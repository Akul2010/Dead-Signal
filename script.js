/* ============================================================
   DEAD SIGNAL — script.js
   Refactored game state, audio engine, progression validation,
   modal systems, and UI controller logic.
   ============================================================ */

// ============================================================
// GAME STATE MANAGEMENT
// ============================================================
let gameState = {
  day: 1,
  currentFreq: 88.0,
  discovered: {},       // { signalId: true }
  logged: [],           // array of logged fragment objects
  curSigId: null,
  curFragText: null,
  staticOn: true,
  audioCtx: null,
  gainNode: null,
  run: 1,
  ng: false,            // New Game+ active?
  achieved: [],         // ending IDs unlocked across all runs
  viewingEndingId: null // current ending ID being viewed in details panel
};

let journalData = [];   // permanent record of completed runs
let archFilter = 'all'; // current archive filter ('all' or signalId)
let archView   = 'grid';// current archive view ('grid' or 'timeline')
let twTimer    = null;  // typing animation timer

// ============================================================
// AUDIO SYSTEM (Web Audio Static Noise Generator)
// ============================================================
function initAudio() {
  if (gameState.audioCtx) return;
  try {
    gameState.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
    // ScriptProcessor to generate white/static noise
    const proc = gameState.audioCtx.createScriptProcessor(4096, 1, 1);
    proc.onaudioprocess = e => {
      const d = e.outputBuffer.getChannelData(0);
      for (let i = 0; i < 4096; i++) {
        d[i] = (Math.random() * 2 - 1) * 0.12;
      }
    };
    
    // Bandpass filter to make it sound like a radio static
    const filt = gameState.audioCtx.createBiquadFilter();
    filt.type = 'bandpass';
    filt.frequency.value = 1100;
    filt.Q.value = 0.6;
    
    gameState.gainNode = gameState.audioCtx.createGain();
    gameState.gainNode.gain.value = 0.3;
    
    proc.connect(filt);
    filt.connect(gameState.gainNode);
    gameState.gainNode.connect(gameState.audioCtx.destination);
  } catch (e) {
    console.warn("Web Audio API not supported or blocked by browser policy.");
  }
}

function setVol(v) {
  if (gameState.gainNode && gameState.audioCtx) {
    gameState.gainNode.gain.setTargetAtTime(v, gameState.audioCtx.currentTime, 0.1);
  }
}

function toggleStatic() {
  initAudio();
  gameState.staticOn = !gameState.staticOn;
  const btn = document.getElementById('static-btn');
  if (btn) {
    btn.textContent = gameState.staticOn ? '[ STATIC: ON ]' : '[ STATIC: OFF ]';
    btn.classList.toggle('active-btn', gameState.staticOn);
  }
  setVol(gameState.staticOn ? 0.3 : 0);
}

// ============================================================
// TUNER & TRANSMISSIONS HELPERS
// ============================================================
function sigAtFreq(fi) {
  for (const k of Object.keys(SIG)) {
    if (Math.abs(parseInt(k) - fi) <= 3) {
      return { key: parseInt(k), sig: SIG[k] };
    }
  }
  return null;
}

function getFragment(sig) {
  if (sig.isBeacon) {
    const list = gameState.ng && sig.ngBeacon ? sig.ngBeacon : sig.beacon;
    let best = list[0];
    for (const t of list) {
      if (gameState.day >= t[0]) best = t;
    }
    return { text: best[1], id: 'beacon_' + best[0] };
  }
  
  const frags = (gameState.ng && sig.ngFragments && sig.ngFragments.length)
    ? sig.ngFragments
    : sig.fragments;
    
  const avail = frags.filter(f => f.day <= gameState.day);
  if (!avail.length) return null;
  const f = avail[avail.length - 1];
  return { text: f.text, id: sig.id + '_d' + f.day };
}

function isLogged(sid, txt) {
  return gameState.logged.some(f => f.signalId === sid && f.text === txt);
}

function degradeText(text, amount) {
  return text
    .split(' ')
    .map(w => (Math.random() < amount * 0.45 && w.length > 3 ? '[static]' : w))
    .join(' ');
}

// ============================================================
// DIAL MOVEMENT & TUNING CONTROLLER
// ============================================================
function onDialMove(raw) {
  const fi = parseInt(raw);
  const ff = fi / 10;
  gameState.currentFreq = ff;
  
  const freqDisp = document.getElementById('freq-display');
  const statFreq = document.getElementById('status-freq');
  if (freqDisp) freqDisp.textContent = ff.toFixed(1);
  if (statFreq) statFreq.textContent = ff.toFixed(1);

  const m = sigAtFreq(fi);
  updateMeter(m, fi);

  if (!m) {
    if (freqDisp) freqDisp.classList.remove('locked');
    document.getElementById('status-text').textContent = 'STANDBY — NO SIGNAL';
    document.getElementById('status-dot').classList.remove('live');
    gameState.curSigId = null;
    gameState.curFragText = null;
    showStatic();
    setVol(gameState.staticOn ? 0.3 : 0);
    return;
  }

  const { sig } = m;

  if (sig.dayUnlock > gameState.day) {
    showStatic('... signal detected ... not yet active ...');
    gameState.curSigId = null;
    return;
  }
  
  if (sig.silentAfter && gameState.day > sig.silentAfter) {
    showStatic('... ' + sig.name + ' — signal lost day ' + sig.silentAfter + ' ...');
    gameState.curSigId = null;
    return;
  }

  // Discover new source
  if (!gameState.discovered[sig.id]) {
    gameState.discovered[sig.id] = true;
    updateKnown();
  }

  if (freqDisp) freqDisp.classList.add('locked');
  document.getElementById('status-text').textContent = 'LOCKED — ' + sig.source;
  document.getElementById('status-dot').classList.add('live');

  const fr = getFragment(sig);
  if (!fr) {
    showStatic('... ' + sig.name + ' — no transmission on day ' + gameState.day + ' ...');
    return;
  }

  // Apply degradation for Yusra late-game
  let txt = fr.text;
  if (sig.id === 'yusra' && sig.degradeAfter && gameState.day > sig.degradeAfter) {
    txt = degradeText(txt, (gameState.day - sig.degradeAfter) / 18);
  }

  gameState.curSigId    = sig.id;
  gameState.curFragText = fr.text; // Store original clean copy for archive log

  showTx(sig, txt, isLogged(sig.id, fr.text));
  setVol(gameState.staticOn ? 0.04 : 0);
  updateStats();
}

function updateMeter(m, fi) {
  const bars = document.querySelectorAll('.sig-bar');
  if (!m) {
    bars.forEach(b => {
      b.style.height     = (Math.floor(Math.random() * 5) + 2) + 'px';
      b.style.background = 'var(--border)';
    });
    return;
  }
  const str = Math.max(0, 1 - Math.abs(m.key - fi) / 3);
  [10, 16, 22, 26, 22, 16, 10].forEach((h, i) => {
    bars[i].style.height     = Math.round(h * str + Math.random() * 3) + 'px';
    bars[i].style.background =
      str > 0.6 ? 'var(--green)' : str > 0.3 ? 'var(--amber)' : 'var(--border-bright)';
  });
}

function showStatic(msg) {
  clearTimeout(twTimer);
  const box = document.getElementById('transmission-box');
  if (box) {
    box.innerHTML = '<span class="static-text">' + (msg || '... no signal ... adjust frequency ...') + '</span>';
    box.classList.remove('secret-active');
  }
  const logRow = document.getElementById('log-row');
  if (logRow) logRow.style.display = 'none';
}

function showTx(sig, text, already) {
  clearTimeout(twTimer);
  const box = document.getElementById('transmission-box');
  if (!box) return;
  
  box.classList.toggle('secret-active', !!sig.isSecret);
  box.innerHTML =
    '<span class="source-tag ' + sig.css + '">' +
    sig.source + (gameState.ng ? ' [NG+]' : '') +
    '</span><span class="tx-text"></span><span class="cursor-blink"></span>';

  const tx  = box.querySelector('.tx-text');
  const cur = box.querySelector('.cursor-blink');
  let i = 0;
  const spd = text.length > 300 ? 16 : 25;

  function type() {
    if (i < text.length) {
      if (tx) tx.textContent += text[i++];
      twTimer = setTimeout(type, 1000 / spd);
    } else {
      if (cur) cur.style.display = 'none';
    }
  }
  type();

  const lr = document.getElementById('log-row');
  const lb = document.getElementById('log-btn');
  const li = document.getElementById('logged-indicator');
  
  if (lr) lr.style.display = 'flex';
  if (already) {
    if (lb) lb.style.display = 'none';
    if (li) li.textContent   = '[ ALREADY LOGGED ]';
  } else {
    if (lb) lb.style.display = '';
    if (li) li.textContent   = '';
  }
}

// ============================================================
// ARCHIVING & LOGGING FRAGMENTS
// ============================================================
function logCurrentFragment() {
  if (!gameState.curSigId || !gameState.curFragText) return;
  const sig = Object.values(SIG).find(s => s.id === gameState.curSigId);
  if (!sig || isLogged(sig.id, gameState.curFragText)) return;

  gameState.logged.push({
    signalId:   sig.id,
    signalName: sig.name,
    source:     sig.source,
    css:        sig.css,
    color:      sig.color,
    isSecret:   !!sig.isSecret,
    text:       gameState.curFragText,
    day:        gameState.day,
    freq:       gameState.currentFreq,
    refs:       sig.refs || [],
    run:        gameState.run,
  });

  saveState();
  const lb = document.getElementById('log-btn');
  const li = document.getElementById('logged-indicator');
  if (lb) lb.style.display = 'none';
  if (li) li.textContent = '[ LOGGED ]';
  
  updateArchiveCount();
  updateStats();
  updateEnding();
}

// ============================================================
// KNOWN FREQUENCIES SIDEBAR
// ============================================================
function updateKnown() {
  const c = document.getElementById('known-signals-list');
  if (!c) return;
  
  const found = Object.values(SIG).filter(s => gameState.discovered[s.id]);

  if (!found.length) {
    c.innerHTML = '<div style="font-size:11px;color:var(--text-dim);">Scan the dial to discover signals.</div>';
    return;
  }

  c.innerHTML = found.map(sig => {
    const k      = Object.keys(SIG).find(key => SIG[key].id === sig.id);
    const fd     = (parseInt(k) / 10).toFixed(1);
    const frags  = gameState.ng && sig.ngFragments && sig.ngFragments.length
      ? sig.ngFragments
      : sig.fragments || [];
    const total  = sig.isBeacon ? 5 : frags.length;
    const logd   = gameState.logged.filter(f => f.signalId === sig.id).length;
    const fr     = getFragment(sig);
    const hasNew = fr && !isLogged(sig.id, fr.text);
    const isTuned = gameState.curSigId === sig.id;

    return (
      '<div class="sig-entry ' +
      (sig.isSecret ? 'secret-sig ' : '') +
      (isTuned ? 'tuned' : '') +
      '" onclick="tuneToFreq(' + k + ')">' +
      '<div class="sig-freq-small ' + sig.css + '">' + fd + ' MHz' + (sig.isSecret ? ' ◆' : '') + '</div>' +
      '<div class="sig-name-small">' + sig.name + '</div>' +
      '<div class="sig-count">' + logd + '/' + total + ' logged</div>' +
      (hasNew ? '<div class="sig-new-dot"></div>' : '') +
      '</div>'
    );
  }).join('');
}

function tuneToFreq(fi) {
  const dial = document.getElementById('dial');
  if (dial) {
    dial.value = fi;
    onDialMove(fi);
  }
}

// ============================================================
// IN-GAME TIME PROGRESSION
// ============================================================
function advanceDay() {
  gameState.day++;
  const dDisp = document.getElementById('day-display');
  const sDay = document.getElementById('status-day');
  const stDays = document.getElementById('stat-days');
  
  if (dDisp) dDisp.textContent = gameState.day;
  if (sDay) sDay.textContent = gameState.day;
  if (stDays) stDays.textContent = gameState.day;
  
  if (gameState.currentFreq) {
    onDialMove(Math.round(gameState.currentFreq * 10));
  }
  updateKnown();
  updateEnding();
  saveState();
}

// ============================================================
// STATS AND NOTIFICATION COUNTERS
// ============================================================
function updateStats() {
  const statLog = document.getElementById('stat-logged');
  const statSrc = document.getElementById('stat-sources');
  const statDay = document.getElementById('stat-days');
  const statRun = document.getElementById('stat-run');
  const statusRun = document.getElementById('status-run');
  
  if (statLog) statLog.textContent  = gameState.logged.length;
  if (statSrc) statSrc.textContent = Object.keys(gameState.discovered).length;
  if (statDay) statDay.textContent    = gameState.day;
  if (statRun) statRun.textContent     = gameState.run;
  if (statusRun) statusRun.textContent   = gameState.run;
  
  updateArchiveCount();
  updateJournalCount();
}

function updateArchiveCount() {
  const count = gameState.logged.length;
  const countSpan = document.getElementById('archive-count');
  if (countSpan) {
    countSpan.textContent = count > 0 ? '(' + count + ')' : '';
  }
}

function updateJournalCount() {
  const countSpan = document.getElementById('journal-count');
  if (countSpan) {
    countSpan.textContent = journalData.length > 0 ? '(' + journalData.length + ')' : '';
  }
}

// ============================================================
// ARCHIVE TABS AND RENDERING (TIMELINE / GRID)
// ============================================================
function setView(v) {
  archView = v;
  const vg = document.getElementById('vg');
  const vt = document.getElementById('vt');
  const gridDiv = document.getElementById('archive-grid');
  const tlDiv = document.getElementById('archive-timeline');
  
  if (vg) vg.classList.toggle('active', v === 'grid');
  if (vt) vt.classList.toggle('active', v === 'timeline');
  if (gridDiv) gridDiv.style.display = v === 'grid' ? 'grid'  : 'none';
  if (tlDiv) tlDiv.style.display = v === 'timeline' ? 'block' : 'none';
  
  renderArchive();
}

function filterArchive(f) {
  archFilter = f;
  document.querySelectorAll('.filter-btn').forEach(b => {
    b.classList.toggle(
      'active',
      (f === 'all' && b.textContent.trim() === 'ALL') || b.dataset.filter === f
    );
  });
  renderArchive();
}

function renderArchive() {
  const frags = archFilter === 'all'
    ? gameState.logged
    : gameState.logged.filter(f => f.signalId === archFilter);

  // Rebuild source filter buttons
  const fb = document.getElementById('filter-bar');
  if (fb) {
    const srcs = [...new Set(gameState.logged.map(f => f.signalId))];
    fb.innerHTML =
      '<button class="filter-btn ' + (archFilter === 'all' ? 'active' : '') +
      '" onclick="filterArchive(\'all\')">ALL</button>' +
      srcs.map(id => {
        const f = gameState.logged.find(x => x.signalId === id);
        return (
          '<button class="filter-btn ' + (archFilter === id ? 'active' : '') +
          '" data-filter="' + id + '" onclick="filterArchive(\'' + id + '\')">' +
          f.source.split('/')[0].trim() +
          '</button>'
        );
      }).join('');
  }

  if (archView === 'grid') renderGrid(frags);
  else renderTimeline(frags);
}

function renderGrid(frags) {
  const g = document.getElementById('archive-grid');
  if (!g) return;
  
  if (!frags.length) {
    g.innerHTML = '<div class="empty-archive">No transmissions logged.<br>Return to the radio. Scan the dial.</div>';
    return;
  }
  
  g.innerHTML = frags.map(f => {
    const globalIdx = gameState.logged.indexOf(f);
    return (
      '<div class="archive-card ' + (f.isSecret ? 'secret-card' : '') + '" onclick="viewArchiveLogByIndex(' + globalIdx + ')">' +
      '<div class="arc-source ' + f.css + '">' + f.source +
      (f.run > 1 ? ' <span style="color:var(--text-dim)">[RUN ' + f.run + ']</span>' : '') + '</div>' +
      '<div class="arc-freq">' + f.freq.toFixed(1) + ' MHz &mdash; Day ' + f.day + '</div>' +
      '<div class="arc-text">&ldquo;' + f.text.substring(0, 220) + (f.text.length > 220 ? '...' : '') + '&rdquo;</div>' +
      (f.refs && f.refs.length ? '<div class="arc-refs">&#8627; cross-refs: ' + f.refs.join(', ') + '</div>' : '') +
      '</div>'
    );
  }).join('');
}

function renderTimeline(frags) {
  const tl = document.getElementById('archive-timeline');
  if (!tl) return;
  
  if (!frags.length) {
    tl.innerHTML = '<div class="empty-archive">No transmissions logged.</div>';
    return;
  }
  const byDay = {};
  frags.forEach(f => {
    if (!byDay[f.day]) byDay[f.day] = [];
    byDay[f.day].push(f);
  });
  const days = Object.keys(byDay).map(Number).sort((a, b) => a - b);

  tl.innerHTML = days.map(d =>
    '<div class="tl-day-group">' +
    '<div class="tl-day-label">DAY ' + d + '</div>' +
    byDay[d].map(f => {
      const globalIdx = gameState.logged.indexOf(f);
      return (
        '<div class="tl-entry" onclick="viewArchiveLogByIndex(' + globalIdx + ')">' +
        '<div class="tl-dot" style="background:' + f.color + '"></div>' +
        '<div>' +
        '<div class="tl-source ' + f.css + '">' + f.source + '</div>' +
        '<div class="tl-text">&ldquo;' + f.text.substring(0, 160) + (f.text.length > 160 ? '...' : '') + '&rdquo;</div>' +
        '</div></div>'
      );
    }).join('') +
    '</div>'
  ).join('');
}

// Opens the CRT full transmission viewer modal
function viewArchiveLogByIndex(idx) {
  const f = gameState.logged[idx];
  if (f) {
    showLogViewer(
      f.text, 
      `// TRANSMISSION ARCHIVE: ${f.source} (${f.freq.toFixed(1)} MHz) // DAY ${f.day}`
    );
  }
}

function showLogViewer(text, title) {
  const modal = document.getElementById('log-viewer-modal');
  const mTitle = document.getElementById('log-viewer-title');
  const mBody = document.getElementById('log-viewer-content');
  
  if (modal && mTitle && mBody) {
    mTitle.textContent = title || '// ARCHIVED TRANSMISSION';
    mBody.textContent = text;
    modal.classList.add('show');
  }
}

// ============================================================
// STRICTOR ENDINGS PROGRESSION VALIDATION
// ============================================================
function getEndingId() {
  const logged = gameState.logged;
  const has = id => logged.some(f => f.signalId === id);
  const count = id => logged.filter(f => f.signalId === id).length;

  // Stricter requirement: Must reach Day 30+ to trigger any ending
  if (gameState.day < 30) {
    return null;
  }

  // 1. NG+ COMPLETE ENDING (PHASE 2)
  // Must be in NG+, Day 30+, and have logged >= 2 fragments from all four key agents
  if (gameState.ng && has('twins') && has('shan') && count('yusra') >= 2 && count('mara') >= 2) {
    return 'ng_complete';
  }

  // 2. SECRET ENDING (THE NODE)
  // Requires Day 35+ (when Shan's final transmission emits) and logging >= 3 Shan fragments
  if (gameState.day >= 35 && has('shan') && count('shan') >= 3) {
    return 'secret';
  }

  // 3. CONSPIRACY ENDING (PROJECT LULL)
  // Requires logging >= 3 Mara Chen and >= 3 Yusra Haddad fragments
  if (has('mara') && count('mara') >= 3 && has('yusra') && count('yusra') >= 3) {
    return 'conspiracy';
  }

  // 4. ACCEPTANCE ENDING (THE STILL SMALL VOICE)
  // Requires logging >= 3 Father Osei and >= 2 Twins, and specifically no Yusra (avoiding conspiracy crossover)
  if (has('osei') && count('osei') >= 3 && has('twins') && count('twins') >= 2 && !has('yusra')) {
    return 'acceptance';
  }

  // 5. AMBIGUOUS ENDING (SIGNAL AND NOISE)
  // Reached if logged from >= 3 different agents and compiled >= 6 total fragments
  const uniqueSources = new Set(logged.map(f => f.signalId));
  if (uniqueSources.size >= 3 && logged.length >= 6) {
    return 'ambiguous';
  }

  // 6. BEACON ONLY ENDING (THE ADVISORY)
  // Requires Day 35+ (last beacon fragment), only logged Beacon (>= 4 fragments), and absolutely nothing else
  if (gameState.day >= 35 && has('beacon') && count('beacon') >= 4 && uniqueSources.size === 1) {
    return 'beacon_only';
  }

  return null;
}

// Renders the Conclusions dashboard
function updateEnding() {
  const eid = getEndingId();

  // Unlock ending globally if not already tracked (do this BEFORE checking if ending-content exists)
  if (eid && !gameState.achieved.includes(eid)) {
    gameState.achieved.push(eid);
    saveState();
  }

  const cont = document.getElementById('ending-content');
  if (!cont) return;

  // If viewing details of a clicked unlocked ending, maintain that view
  if (gameState.viewingEndingId) {
    viewEndingLogs(gameState.viewingEndingId);
    return;
  }

  if (!eid) {
    cont.innerHTML =
      '<div class="ending-locked">' +
      '<div style="font-family:var(--display);font-size:28px;color:var(--text-dim);letter-spacing:4px;margin-bottom:16px;">NO CONCLUSION</div>' +
      '<div style="font-size:12px;line-height:2.2;">You haven\'t logged enough transmissions.<br>Return to the radio. Keep scanning.</div>' +
      '</div>' +
      '<div style="text-align:center;margin-top:24px;padding-top:16px;border-top:1px solid var(--border);">' +
      '<button class="btn danger" onclick="showResetConfirm()">[ RESET ALL PROGRESS ]</button>' +
      '</div>';
    return;
  }

  const e = ENDINGS[eid];
  const allIds = Object.keys(ENDINGS);
  const baseGameEndings = ['beacon_only', 'conspiracy', 'acceptance', 'ambiguous', 'secret'];
  const allBaseEndingsAchieved = baseGameEndings.every(id => gameState.achieved.includes(id));

  // Determine transition button based on progress
  let actionButtonsHtml = '<button class="btn" onclick="switchTab(\'archive\')">[ VIEW ARCHIVE ]</button>';
  if (gameState.ng) {
    actionButtonsHtml += '<button class="btn danger" onclick="showBaseGameConfirm()">[ RETURN TO BASE GAME ]</button>';
  } else {
    if (allBaseEndingsAchieved) {
      actionButtonsHtml += '<button class="btn danger" onclick="showNGConfirm()">[ NEW GAME+ ]</button>';
    } else {
      actionButtonsHtml += '<button class="btn danger" onclick="showNextRunConfirm()">[ START NEXT RUN ]</button>';
    }
  }

  cont.innerHTML =
    '<div style="margin-bottom:16px;">' +
    '<div style="font-size:10px;color:var(--text-dim);letter-spacing:2px;margin-bottom:10px;">' +
    'ENDINGS DISCOVERED — ' + gameState.achieved.length + '/' + allIds.length + '</div>' +
    '<div class="endings-grid">' +
    allIds.map(id => {
      const ae = gameState.achieved.includes(id);
      const cur = id === eid;
      const en  = ENDINGS[id];
      const clickHandler = ae ? 'onclick="viewEndingLogs(\'' + id + '\')"' : '';
      return (
        '<div class="ending-mini ' + (ae ? 'achieved ' : '') + (cur ? 'current-run' : '') + '" ' + clickHandler + '>' +
        '<div class="ending-mini-title" style="color:' + (ae ? en.color : 'var(--text-dim)') + '">' +
        (ae ? en.title : '???') + '</div>' +
        '<div class="ending-mini-status">' + (cur ? '◆ THIS RUN' : ae ? 'found' : 'locked') + '</div>' +
        '</div>'
      );
    }).join('') +
    '</div></div>' +
    '<div class="ending-card">' +
    '<div class="ending-title" style="color:' + e.color + '">' + e.title + '</div>' +
    '<div class="ending-condition">— ' + e.condition + '</div>' +
    '<div class="ending-body">' + e.body + '</div>' +
    '<div style="margin-top:18px;padding-top:14px;border-top:1px solid var(--border);font-size:10px;color:var(--text-dim);">' +
    'FRAGMENTS: ' + gameState.logged.length + ' // SOURCES: ' + Object.keys(gameState.discovered).length + '/6 // ' +
    'DAYS: ' + gameState.day + ' // RUN: ' + gameState.run +
    '</div></div>' +
    '<div style="text-align:center;margin-top:14px;display:flex;gap:10px;justify-content:center;">' +
    actionButtonsHtml +
    '</div>' +
    '<div style="text-align:center;margin-top:24px;padding-top:16px;border-top:1px solid var(--border);">' +
    '<button class="btn danger" onclick="showResetConfirm()">[ RESET ALL PROGRESS ]</button>' +
    '</div>';
}

// View logs associated with an unlocked ending (separate journal sub-page view)
function viewEndingLogs(endingId) {
  const ending = ENDINGS[endingId];
  if (!ending) return;

  gameState.viewingEndingId = endingId;

  // Retrieve logs compiled during the run that unlocked this ending
  const currentEndingId = getEndingId();
  let logs = [];
  let runLabel = "";

  if (endingId === currentEndingId) {
    logs = gameState.logged;
    runLabel = "Run " + gameState.run + (gameState.ng ? " [NG+]" : "");
  } else {
    // Find the latest historical run matching this ending
    const matchingRun = [...journalData].reverse().find(r => r.endingId === endingId);
    if (matchingRun) {
      logs = matchingRun.logged || [];
      runLabel = "Run " + matchingRun.run + (matchingRun.ng ? " [NG+]" : "");
    }
  }

  const cont = document.getElementById('ending-content');
  if (!cont) return;

  let logsHtml = "";
  if (!logs || logs.length === 0) {
    logsHtml = '<div class="empty-archive">No detailed transmission logs archived for this run (legacy save).</div>';
  } else {
    logsHtml = logs.map(f => 
      '<div class="ending-log-card ' + (f.isSecret ? 'secret-card' : '') + '">' +
      '<div class="ending-log-meta">' +
      '<span class="' + f.css + '">' + f.source + ' (' + f.freq.toFixed(1) + ' MHz)</span>' +
      '<span>Day ' + f.day + '</span>' +
      '</div>' +
      '<div class="ending-log-text">' + f.text + '</div>' +
      '</div>'
    ).join('');
  }

  cont.innerHTML = 
    '<div class="ending-detail-header">' +
    '<button class="btn" onclick="hideEndingDetail()">[ &larr; BACK TO CONCLUSIONS ]</button>' +
    '<span style="font-size: 10px; color: var(--text-dim); letter-spacing: 1px;">DETAIL VIEW // ' + runLabel + '</span>' +
    '</div>' +
    '<div class="ending-card" style="margin-bottom: 24px;">' +
    '<div class="ending-title" style="color:' + ending.color + '">' + ending.title + '</div>' +
    '<div class="ending-condition">— ' + ending.condition + '</div>' +
    '<div class="ending-body">' + ending.body + '</div>' +
    '</div>' +
    '<div class="ending-detail-logs-title">// LOGGED TRANSMISSIONS DURING THIS PLAYTHROUGH</div>' +
    '<div class="ending-detail-logs-list">' +
    logsHtml +
    '</div>';
}

function hideEndingDetail() {
  gameState.viewingEndingId = null;
  updateEnding();
}

// ============================================================
// JOURNAL (PAST PLAYTHROUGHS PERMANENT LOG)
// ============================================================
function renderJournal() {
  const g = document.getElementById('journal-grid');
  if (!g) return;
  
  if (!journalData.length) {
    g.innerHTML =
      '<div class="journal-empty">No completed runs yet.<br>Reach a conclusion, then start a new run.<br>' +
      '<span style="color:var(--text-dim)">Each playthrough is preserved here permanently.</span></div>';
    return;
  }

  g.innerHTML = journalData.map((run, idx) => {
    const e = run.endingId ? ENDINGS[run.endingId] : null;
    const notes = [];
    if (run.mara)  notes.push('Found Mara Chen — followed the science.');
    if (run.osei)  notes.push('Found Father Osei — listened to the faith.');
    if (run.yusra) notes.push('Found Yusra Haddad — heard the confession.');
    if (run.twins) notes.push('Found the Twins — the children were the control group.');
    if (run.shan)  notes.push('Found the hidden frequency. Shan was routing in the dark.');
    if (!notes.length) notes.push('Listened only to the beacon. Nothing else.');

    return (
      '<div class="journal-card">' +
      '<div class="journal-run-title">RUN ' + run.run + (run.ng ? ' [NG+]' : '') + '</div>' +
      '<div class="journal-ending" style="color:' + (e ? e.color : 'var(--text-dim)') + '">' +
      (e ? e.title : 'NO CONCLUSION') + '</div>' +
      '<div class="journal-stats">Days: ' + run.day + ' &nbsp; Fragments: ' + run.frags +
      ' &nbsp; Sources: ' + run.sources + '/6<br>Secret found: ' + (run.shan ? 'YES ◆' : 'no') + '</div>' +
      '<div class="journal-notes" style="margin-bottom:12px;">' + notes.join('<br>') + '</div>' +
      '<button class="btn" style="width:100%;" onclick="viewJournalLogsByIndex(' + idx + ')">[ VIEW FULL LOG ]</button>' +
      '</div>'
    );
  }).join('');
}

function viewJournalLogsByIndex(idx) {
  const run = journalData[idx];
  if (!run) return;
  
  const logs = run.logged || [];
  if (logs.length === 0) {
    showLogViewer("No detailed transmission logs archived for this run (legacy save).", `// RUN ${run.run} LOG`);
    return;
  }
  
  const formattedLogs = logs.map(f => {
    return `[${f.source} — ${f.freq.toFixed(1)} MHz — DAY ${f.day}]\n\n${f.text}\n\n========================================\n\n`;
  }).join('');
  
  showLogViewer(formattedLogs, `// RUN ${run.run} ARCHIVE LOG // ${logs.length} FRAGMENTS`);
}

// ============================================================
// TRANSITIONS: NEW RUN, NG+, AND BASE GAME LOOPS
// ============================================================
function showNGConfirm() {
  document.getElementById('ng-confirm').classList.add('show');
}

function showNextRunConfirm() {
  document.getElementById('next-run-confirm').classList.add('show');
}

function showBaseGameConfirm() {
  document.getElementById('base-game-confirm').classList.add('show');
}

function showResetConfirm() {
  document.getElementById('reset-confirm').classList.add('show');
}

function confirmNewGame() {
  document.getElementById('ng-confirm').classList.remove('show');
  archiveCurrentRun(true); // reset state and start next run as NG+
}

function confirmNextRun() {
  document.getElementById('next-run-confirm').classList.remove('show');
  archiveCurrentRun(false); // reset state and start next run in base game
}

function confirmBaseGame() {
  document.getElementById('base-game-confirm').classList.remove('show');
  archiveCurrentRun(false); // reset state and return back to base game
}

// Utility function to archive current run to permanent history and reset state
function archiveCurrentRun(startAsNG) {
  // Archive data to journal
  journalData.push({
    run:      gameState.run,
    ng:       gameState.ng,
    day:      gameState.day,
    endingId: getEndingId(),
    frags:    gameState.logged.length,
    sources:  Object.keys(gameState.discovered).length,
    mara:     gameState.logged.some(f => f.signalId === 'mara'),
    osei:     gameState.logged.some(f => f.signalId === 'osei'),
    yusra:    gameState.logged.some(f => f.signalId === 'yusra'),
    twins:    gameState.logged.some(f => f.signalId === 'twins'),
    shan:     gameState.logged.some(f => f.signalId === 'shan'),
    logged:   [...gameState.logged] // clone current logged fragments
  });

  const prevAchieved = [...gameState.achieved];
  const audioContext = gameState.audioCtx;
  const gainNodeElement = gameState.gainNode;
  const nextRunNum = gameState.run + 1;

  // Re-initialize state
  gameState = {
    day: 1,
    currentFreq: 88.0,
    discovered: {},
    logged: [],
    curSigId: null,
    curFragText: null,
    staticOn: gameState.staticOn,
    audioCtx: audioContext,
    gainNode: gainNodeElement,
    run: nextRunNum,
    ng: startAsNG,
    achieved: prevAchieved,
    viewingEndingId: null
  };

  // Reset UI elements
  document.getElementById('day-display').textContent  = 1;
  document.getElementById('status-day').textContent   = 1;
  document.getElementById('freq-display').textContent = '88.0';
  document.getElementById('dial').value               = 880;
  
  const badge = document.getElementById('ng-badge');
  if (badge) {
    badge.style.display = startAsNG ? '' : 'none';
  }

  showStatic();
  const logRow = document.getElementById('log-row');
  if (logRow) logRow.style.display = 'none';
  
  updateKnown();
  updateStats();
  updateEnding();
  renderJournal();
  switchTab('radio');
  saveState();
}

// Full wipe helper
function resetAllProgress() {
  localStorage.removeItem('ds_v3');
  
  gameState = {
    day: 1,
    currentFreq: 88.0,
    discovered: {},
    logged: [],
    curSigId: null,
    curFragText: null,
    staticOn: gameState.staticOn,
    audioCtx: gameState.audioCtx,
    gainNode: gameState.gainNode,
    run: 1,
    ng: false,
    achieved: [],
    viewingEndingId: null
  };
  journalData = [];

  const modal = document.getElementById('reset-confirm');
  if (modal) modal.classList.remove('show');
  
  window.location.reload();
}

// ============================================================
// TAB CONTROLLER
// ============================================================
function switchTab(name) {
  const tabs = ['radio', 'archive', 'ending', 'journal'];
  document.querySelectorAll('.tab').forEach((t, i) => {
    t.classList.toggle('active', tabs[i] === name);
  });
  document.querySelectorAll('.screen').forEach(s => {
    s.classList.remove('active');
  });
  
  const scr = document.getElementById('screen-' + name);
  if (scr) scr.classList.add('active');
  
  if (name === 'archive') renderArchive();
  if (name === 'ending')  updateEnding();
  if (name === 'journal') renderJournal();
}

// ============================================================
// STATE SERIALIZATION (SAVE / LOAD)
// ============================================================
function saveState() {
  try {
    localStorage.setItem('ds_v3', JSON.stringify({
      gameState: {
        day:        gameState.day,
        discovered: gameState.discovered,
        logged:     gameState.logged,
        run:        gameState.run,
        ng:         gameState.ng,
        achieved:   gameState.achieved,
      },
      journalData,
    }));
  } catch (e) {
    console.error("Local storage save failed:", e);
  }
}

function loadSave() {
  try {
    const raw = localStorage.getItem('ds_v3');
    if (!raw) return false;
    const saved = JSON.parse(raw);
    
    // Support loading both new state naming conventions and legacy versions
    if (saved.gameState) {
      Object.assign(gameState, saved.gameState);
    } else if (saved.ST) {
      Object.assign(gameState, saved.ST);
    }
    
    if (saved.journalData) {
      journalData = saved.journalData;
    } else if (saved.JOURNAL) {
      journalData = saved.JOURNAL;
    }

    document.getElementById('day-display').textContent = gameState.day;
    document.getElementById('status-day').textContent  = gameState.day;
    
    const badge = document.getElementById('ng-badge');
    if (badge) {
      badge.style.display = gameState.ng ? '' : 'none';
    }
    
    updateKnown();
    updateStats();
    updateEnding();
    renderJournal();
    return true;
  } catch (e) {
    console.error("Error loading save file:", e);
    return false;
  }
}

// ============================================================
// INTRO PANEL CONTROLLER
// ============================================================
function startGame(cont) {
  initAudio();
  const intro = document.getElementById('intro');
  if (intro) {
    intro.style.opacity    = '0';
    intro.style.transition = 'opacity 0.8s';
    setTimeout(() => (intro.style.display = 'none'), 800);
  }
  if (cont) loadSave();
}

// Detect existing saves on initial page load
window.addEventListener('load', () => {
  try {
    const raw = localStorage.getItem('ds_v3');
    if (raw) {
      const s = JSON.parse(raw);
      const runVal = s.gameState ? s.gameState.run : (s.ST ? s.ST.run : 1);
      const dayVal = s.gameState ? s.gameState.day : (s.ST ? s.ST.day : 1);
      const loggedVal = s.gameState ? s.gameState.logged : (s.ST ? s.ST.logged : []);

      const contBtn = document.getElementById('continue-btn');
      const saveNote = document.getElementById('intro-save-note');
      
      if (contBtn) contBtn.style.display = '';
      if (saveNote) {
        saveNote.textContent =
          'Save found — Run ' + runVal + ', Day ' + dayVal + ', ' + loggedVal.length + ' fragments logged';
      }
    }
  } catch (e) {}
});
