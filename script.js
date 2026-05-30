// ============================================================
// GAME DATA — ALL SIGNALS, ALL FRAGMENTS, FULL STORY
// ============================================================

const SIGNALS = {
  917: {
    id: 'beacon',
    name: 'Emergency Beacon',
    source: 'GOV-AUTO',
    cssClass: 'src-beacon',
    color: '#aaaaaa',
    loop: true,
    dayUnlock: 1,
    silentAfter: null,
    references: [],
    fragments: [
      // The beacon text changes subtly by day range — handled in getFragment()
    ],
    beaconTexts: [
      // Day 1-5
      "THIS IS AN AUTOMATED EMERGENCY BROADCAST. THIS MESSAGE WILL REPEAT. // A voluntary dispersal advisory is in effect. Gatherings of more than three persons are discouraged at this time. Citizens are encouraged to remain calm, isolated, and compliant. Essential services continue to operate normally. This is not a cause for alarm. This is a voluntary dispersal advisory. // [MESSAGE REPEATS]",
      // Day 6-12
      "THIS IS AN AUTOMATED EMERGENCY BROADCAST. THIS MESSAGE WILL REPEAT. // A mandatory dispersal advisory is in effect. Gatherings of more than three persons are prohibited at this time. Citizens are encouraged to remain calm, isolated, and cooperative. Essential services have been suspended until further notice. This is not a cause for alarm. Repeat: this is not a cause for alarm. // [MESSAGE REPEATS]",
      // Day 13-20
      "THIS IS AN AUTOMATED EMERGENCY BROADCAST. THIS MESSAGE WILL REPEAT. // Dispersal protocols remain active. Gatherings of any size are prohibited. Residents should remain separated from all other persons. Contact with other individuals is strongly discouraged for your safety and the safety of others. Those who have maintained isolation report no symptoms. Isolation is protection. Isolation is safety. Isolation is recommended indefinitely. // [MESSAGE REPEATS]",
      // Day 21+
      "THIS IS AN AUTOMATED EMERGENCY BROADCAST. THIS MESSAGE WILL REPEAT. // Dispersal protocols remain active. All citizens are reminded that proximity to other persons remains the primary vector. Maintain minimum distance of 500 meters from all other individuals. Those who comply report wellness. Those who comply report clarity. Those who comply report peace. // Comply. // [MESSAGE REPEATS]"
    ]
  },

  881: {
    id: 'mara',
    name: 'Mara Chen',
    source: 'MARA / 88.1',
    cssClass: 'src-mara',
    color: '#7adfff',
    loop: false,
    dayUnlock: 1,
    silentAfter: 47,
    references: ['103.4 MHz — she mentions a researcher', '91.7 MHz — questions the broadcast'],
    fragments: [
      {
        day: 1,
        text: "...hello? Is anyone receiving this? My name is Dr. Mara Chen, I was with the WHO field office in Oslo. I'm broadcasting on 88.1. If you can hear this, please log your coordinates and respond on— // [static] // —I've been alone for nineteen days. The city is quiet. Not abandoned, exactly. People are still here. I can see lights at night. But no one is gathering. Whatever this is, it isn't death. It's something else."
      },
      {
        day: 3,
        text: "Day twenty-two. I ran the serology panels again. No pathogen. Nothing airborne, nothing vector-borne, nothing in the water. I checked for ELF radiation, for atmospheric pressure anomalies, for every known environmental cause of mass behavioral change. Clean across the board. // The die-off isn't biological. I've run every test. It's something else. Something about proximity. The closer people stand, the faster— // [signal breaks] // —I need to think about this differently."
      },
      {
        day: 7,
        text: "Day thirty-one. I found a note under my door this morning. Handwritten. It said: STOP BROADCASTING. THEY'RE LISTENING. // I don't know who left it. The corridor was empty. // I've been trying to reach a researcher someone mentioned online before the networks went down. Works or worked for a defense agency. She was asking questions about aerosol dispersal six months before any of this started. Frequency 103.4, if she's still broadcasting. // I haven't slept in two days."
      },
      {
        day: 12,
        text: "Day thirty-eight. Something I haven't told anyone: I went outside last week. Walked three blocks to a pharmacy. I passed a woman on the street — maybe forty meters away — and we just... stopped. And looked at each other. For a long time. Neither of us moved closer. // It wasn't fear. I want to be clear about that. It wasn't fear. It was something more like... an understanding. A recognition that the distance was correct. // I don't know what to do with that."
      },
      {
        day: 18,
        text: "Day forty-four. Last transmission from me for a while. Maybe permanently. // I've started going outside more. The silence isn't oppressive anymore. I think I was pathologizing something that isn't a disease. // What if this isn't something that's being done to us? What if it's something we're doing — something we've always been capable of, and the conditions finally made it... available? // The beacon is lying about something. I'm not sure what yet. Check 91.7 carefully. The wording changes. // Take care of yourself. Whoever you are."
      }
    ]
  },

  946: {
    id: 'osei',
    name: 'Father Osei',
    source: 'OSEI / 94.6',
    cssClass: 'src-osei',
    color: '#b0ff88',
    loop: false,
    dayUnlock: 1,
    silentAfter: null,
    references: ['88.1 MHz — he has questions for the scientist'],
    fragments: [
      {
        day: 1,
        text: "This is Father Emmanuel Osei. I am broadcasting from the hill above St. Michael's Parish in Kumasi. I don't know who is listening. I'm broadcasting because I think someone should be saying something true into the air, and most of what I hear on this radio is not true. // My congregation walked into the bush two weeks ago. All forty-seven of them. Single file, just before dawn. I watched from the window of the rectory. They didn't look frightened. They looked relieved."
      },
      {
        day: 4,
        text: "I've been thinking about a verse from Elijah — not the famous one, the one after. After the fire, after the earthquake, after the wind. A still small voice. // What if this is the still small voice? Not a punishment. Not an attack. What if the world has simply... exhaled? // I still believe in community. I still believe we need each other. But I wonder if we have been confusing need with noise. The absence of noise is not the same as the absence of God."
      },
      {
        day: 9,
        text: "A young woman came to the church yesterday. She had walked forty kilometers from Accra, alone, and she sat in the last pew without speaking for most of the morning. When she left she put a folded piece of paper on the altar. It said: I thought I was sick. I'm not sick. I'm just quiet now. // I don't know what to do with the theology of that. I'm working on it."
      },
      {
        day: 15,
        text: "I've been corresponding — slowly, by radio — with a scientist broadcasting on 88.1. She believes this is an attack or an accident. I believe she is a good scientist and asking the right questions but the wrong kind of questions. // There are things that happen in the world that feel like disease because they change us, but they are not diseases. Sometimes the change is not a wound. // I'm still here. I'm still broadcasting. I think I will be for a long time. Come find 94.6 if you need to hear a human voice."
      },
      {
        day: 22,
        text: "I want to say something about fear. // The people who are suffering most right now are not the ones who are alone. They're the ones who are alone and convinced they should not be. The ones who believe their solitude is a deprivation rather than a condition. // I'm not saying we don't need each other. I'm saying: what if we need each other differently than we thought? What if the old way of needing — the crowds, the cities, the constant mass proximity — what if that was always a kind of panic? A species-wide insistence that we exist?"
      },
      {
        day: 28,
        text: "Final entry, for now. I say final because I'm going to stop broadcasting and start walking. There are villages in the north where people have been living this way for generations — scattered, quiet, connected by footpath and fire. I want to see what that looks like now. // I'll leave the transmitter running. You can have the frequency. // Tell the scientist on 88.1 that I said: the data and the meaning are not the same thing. She'll know what I mean."
      }
    ]
  },

  1034: {
    id: 'yusra',
    name: 'Dr. Yusra Haddad',
    source: 'HADDAD / 103.4',
    cssClass: 'src-yusra',
    color: '#ffaa44',
    loop: false,
    dayUnlock: 5,
    silentAfter: null,
    references: ['88.1 MHz — she knows Mara\'s work', '117.2 MHz — she\'s heard the children'],
    degradeAfterDay: 25,
    fragments: [
      {
        day: 5,
        text: "If you're finding this frequency, you were looking for it. // My name doesn't matter. What matters: I worked in an applied physics lab contracted by a defense agency. The project was called LULL. Officially: a crowd dispersal research program. Behavioral modification through atmospheric distribution of synthesized neuro-inhibitory compounds. Non-lethal, they said. Targeted, they said. // Project LULL was never supposed to leave the lab. They told us it was a deterrent. Nobody asked what happens when it goes airborne at scale. Nobody thought it would work this well."
      },
      {
        day: 8,
        text: "The mechanism is simpler than you'd think. The compound doesn't cause pain. It doesn't cause fear. It attenuates the neurological reward response associated with physical proximity to other humans — the dopamine cascade you get from a crowd, from a handshake, from a shared meal. // It doesn't make you not want people. It makes the wanting feel... optional. Like something you remember wanting but no longer miss. // The researchers who designed it thought this would disperse riots. They didn't model long-term atmospheric persistence. They didn't model wind patterns across continents."
      },
      {
        day: 14,
        text: "I've been trying to reach someone in Geneva who might still have the synthesis inhibitor. There's a counteragent — there was always a counteragent, they always build those in — but I don't have the production capacity and I don't know if the supply chain still exists. // The broadcast on 91.7 is a management protocol. Not a warning. The language has been shifting — I've been logging it — it's steering people toward compliance rather than explaining anything. Someone is still running that. Someone knows. // Check what day you're listening on. The broadcast is different."
      },
      {
        day: 20,
        text: "[heavy static] ...can you hear this... the signal is degrading on my end... // I want to say something for the record. I helped build this. I didn't know what it would become but I helped build it and I cashed the [static] // ...the children on 117.2, I've heard them. I don't think they're affected the same way. Children's reward circuits are different — more plastic, less [static] ...they might be immune. They might be the [static] ...important. Find them. Talk to them. They're [static] ...telling you something I [static]"
      },
      {
        day: 28,
        text: "[severe static — multiple words inaudible] ...[static]...not an accident, not entirely...[static]...there were people who wanted this...[static]...not the dispersal, the quiet...[static]...they ran models, they knew...[static]...fourteen months is not [static]...don't trust the [static]...the beacon is [static]...91.7...[static]...I'm sorry...[static]...[static]...[silence]"
      }
    ]
  },

  1172: {
    id: 'twins',
    name: 'The Twins',
    source: 'UNKNOWN / 117.2',
    cssClass: 'src-twins',
    color: '#ff88cc',
    loop: false,
    dayUnlock: 20,
    silentAfter: null,
    references: ['94.6 MHz — Osei comforts them', '88.1 MHz — they\'ve seen Mara\'s building'],
    fragments: [
      {
        day: 20,
        text: "Hello. We found this radio in a van. We don't know whose it was. We've been figuring out how to use it for a few days. // There are two of us. We're twins. We're not going to say our names or where we are because we learned that's not safe. // We're okay. We have food. We've been moving a lot. // We found a man alone in a field two days ago. He said he couldn't remember anyone's face anymore. We stayed with him — two meters away, like he asked — and just talked. He got better. Or at least he said he did. Then he asked us to leave, gently. And we did."
      },
      {
        day: 23,
        text: "We think we're different from adults. We've been testing it. We can sit close to each other — not touching, just close — and it's fine. Better than fine. We think it's because we've always been close. Since before we were born. Maybe our brains are wired differently. // A priest on 94.6 told us that's possible. That children might work differently. He was kind. He said God made humans to be near each other and that's not wrong, that's just harder right now. // We think the hardness won't last forever. We don't know why we think that. We just do."
      },
      {
        day: 26,
        text: "We found a building with a lot of scientific equipment in it. There was a name on a whiteboard — Dr. Mara Chen — and notes in three languages. We didn't understand the notes. But on a sticky note on the monitor it said: 88.1, she will understand. // We think someone was trying to reach someone. Maybe multiple people. // We took the sticky note. We're going to keep looking for people who are trying to reach people. That seems important. That seems like the most important thing."
      },
      {
        day: 30,
        text: "Last time we're going to broadcast for a while. We think broadcasting might be making us a target. The automated signal on 91.7 got louder last week — stronger, like someone boosted it. We don't know why. // We want to say one thing before we go quiet: being alone isn't the worst thing. We've met some people who are genuinely okay alone. They've found something in the quiet that they didn't have before. // But some people are not okay alone. And those people are worth finding. // We'll still be listening. 117.2. We're here."
      }
    ]
  }
};

// ============================================================
// GAME STATE
// ============================================================
let state = {
  day: 1,
  currentFreq: 88.0,
  discoveredSources: {},   // id -> true
  loggedFragments: [],     // array of {signalId, fragmentIndex, day}
  currentSignalId: null,
  currentFragmentIndex: null,
  staticOn: true,
  audioContext: null,
  staticNode: null,
  gainNode: null
};

// ============================================================
// AUDIO — Web Audio static noise
// ============================================================
function initAudio() {
  if (state.audioContext) return;
  try {
    state.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const bufferSize = 4096;
    const noiseNode = state.audioContext.createScriptProcessor(bufferSize, 1, 1);
    noiseNode.onaudioprocess = function(e) {
      const output = e.outputBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * 0.15;
      }
    };
    const filter = state.audioContext.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1200;
    filter.Q.value = 0.5;

    state.gainNode = state.audioContext.createGain();
    state.gainNode.gain.value = state.staticOn ? 0.3 : 0;

    noiseNode.connect(filter);
    filter.connect(state.gainNode);
    state.gainNode.connect(state.audioContext.destination);
    state.staticNode = noiseNode;
  } catch(e) {}
}

function setStaticVolume(vol) {
  if (state.gainNode) {
    state.gainNode.gain.setTargetAtTime(vol, state.audioContext.currentTime, 0.1);
  }
}

function toggleStatic() {
  initAudio();
  state.staticOn = !state.staticOn;
  const btn = document.getElementById('static-btn');
  btn.textContent = state.staticOn ? '[ STATIC: ON ]' : '[ STATIC: OFF ]';
  btn.classList.toggle('active-btn', state.staticOn);
  setStaticVolume(state.staticOn ? 0.3 : 0);
}

// ============================================================
// FREQUENCY → SIGNAL MATCHING
// ============================================================
function freqToKey(freqFloat) {
  return Math.round(freqFloat * 10);
}

function getSignalAtFreq(freqInt) {
  const TOLERANCE = 3; // ±0.3 MHz
  for (const key of Object.keys(SIGNALS)) {
    if (Math.abs(parseInt(key) - freqInt) <= TOLERANCE) {
      return { key: parseInt(key), signal: SIGNALS[key] };
    }
  }
  return null;
}

function getFragmentForDay(signal) {
  if (signal.id === 'beacon') {
    const day = state.day;
    if (day <= 5) return { text: signal.beaconTexts[0], index: 0 };
    if (day <= 12) return { text: signal.beaconTexts[1], index: 1 };
    if (day <= 20) return { text: signal.beaconTexts[2], index: 2 };
    return { text: signal.beaconTexts[3], index: 3 };
  }
  // Find best fragment for current day
  const available = signal.fragments.filter(f => f.day <= state.day);
  if (!available.length) return null;
  return { fragment: available[available.length - 1], index: signal.fragments.indexOf(available[available.length - 1]) };
}

function isAlreadyLogged(signalId, fragmentText) {
  return state.loggedFragments.some(f => f.signalId === signalId && f.text === fragmentText);
}

// ============================================================
// DIAL MOVEMENT
// ============================================================
let typewriterTimer = null;

function onDialMove(rawVal) {
  const freqInt = parseInt(rawVal);
  const freqFloat = freqInt / 10;
  state.currentFreq = freqFloat;

  document.getElementById('freq-display').textContent = freqFloat.toFixed(1);
  document.getElementById('status-freq').textContent = freqFloat.toFixed(1);

  const match = getSignalAtFreq(freqInt);

  updateSignalMeter(match, freqInt);

  if (match) {
    const signal = match.signal;

    // Check if unlocked
    if (signal.dayUnlock > state.day) {
      showStatic("... signal detected ... not yet active ...");
      document.getElementById('freq-display').classList.remove('locked');
      state.currentSignalId = null;
      return;
    }

    // Check if silent
    if (signal.silentAfter && state.day > signal.silentAfter) {
      showStatic(`... ${signal.name} — signal lost — day ${signal.silentAfter} ...`);
      state.currentSignalId = null;
      return;
    }

    // Discover source
    if (!state.discoveredSources[signal.id]) {
      state.discoveredSources[signal.id] = true;
      updateKnownSignals();
    }

    document.getElementById('freq-display').classList.add('locked');
    document.getElementById('status-text').textContent = `LOCKED — ${signal.source}`;
    document.getElementById('status-dot').classList.add('live');

    const fragResult = getFragmentForDay(signal);
    if (!fragResult) {
      showStatic(`... ${signal.name} — no transmission on day ${state.day} ...`);
      return;
    }

    const fragText = signal.id === 'beacon' ? fragResult.text : fragResult.fragment.text;
    const fragIndex = fragResult.index;

    state.currentSignalId = signal.id;
    state.currentFragmentIndex = fragIndex;

    // Apply degradation for Yusra late game
    let displayText = fragText;
    if (signal.id === 'yusra' && signal.degradeAfterDay && state.day > signal.degradeAfterDay) {
      displayText = degradeText(fragText, (state.day - signal.degradeAfterDay) / 15);
    }

    showTransmission(signal, displayText, isAlreadyLogged(signal.id, fragText));
    setStaticVolume(state.staticOn ? 0.05 : 0); // quiet while locked
  } else {
    document.getElementById('freq-display').classList.remove('locked');
    document.getElementById('status-text').textContent = 'STANDBY — NO SIGNAL';
    document.getElementById('status-dot').classList.remove('live');
    state.currentSignalId = null;
    showStatic();
    setStaticVolume(state.staticOn ? 0.3 : 0);
  }

  updateStats();
}

function degradeText(text, amount) {
  const words = text.split(' ');
  return words.map(w => {
    if (Math.random() < amount * 0.4 && w.length > 3) {
      return '[static]';
    }
    return w;
  }).join(' ');
}

function updateSignalMeter(match, freqInt) {
  const bars = document.querySelectorAll('.sig-bar');
  if (!match) {
    bars.forEach((b, i) => {
      const h = Math.floor(Math.random() * 6) + 2;
      b.style.height = h + 'px';
      b.style.background = 'var(--border)';
    });
    return;
  }
  const keyFreq = match.key;
  const dist = Math.abs(keyFreq - freqInt);
  const strength = Math.max(0, 1 - dist / 3);
  bars.forEach((b, i) => {
    const heights = [8, 14, 20, 24, 20, 14, 8];
    const h = Math.round(heights[i] * strength + Math.random() * 3);
    b.style.height = h + 'px';
    b.style.background = strength > 0.6 ? 'var(--green)' : strength > 0.3 ? 'var(--amber)' : 'var(--border-bright)';
  });
}

function showStatic(msg) {
  clearTimeout(typewriterTimer);
  const box = document.getElementById('transmission-box');
  box.innerHTML = `<span class="static-text">${msg || '... no signal ... adjust frequency ... scanning ...'}</span>`;
  document.getElementById('log-row').style.display = 'none';
}

function showTransmission(signal, text, alreadyLogged) {
  clearTimeout(typewriterTimer);
  const box = document.getElementById('transmission-box');
  box.innerHTML = `<span class="source-tag ${signal.cssClass}">${signal.source}</span><span class="tx-text"></span><span class="cursor-blink"></span>`;
  const txSpan = box.querySelector('.tx-text');
  const cursor = box.querySelector('.cursor-blink');

  // Typewriter effect
  let i = 0;
  const speed = text.length > 300 ? 18 : 28;
  function type() {
    if (i < text.length) {
      txSpan.textContent += text[i];
      i++;
      typewriterTimer = setTimeout(type, 1000 / speed);
    } else {
      cursor.style.display = 'none';
    }
  }
  type();

  // Log button
  const logRow = document.getElementById('log-row');
  const logBtn = document.getElementById('log-btn');
  const logInd = document.getElementById('logged-indicator');
  logRow.style.display = 'flex';
  if (alreadyLogged) {
    logBtn.style.display = 'none';
    logInd.textContent = '[ ALREADY LOGGED ]';
  } else {
    logBtn.style.display = '';
    logInd.textContent = '';
  }
}

// ============================================================
// LOGGING
// ============================================================
function logCurrentFragment() {
  if (!state.currentSignalId) return;
  const signal = SIGNALS[Object.keys(SIGNALS).find(k => SIGNALS[k].id === state.currentSignalId)];
  if (!signal) return;

  const fragResult = getFragmentForDay(signal);
  if (!fragResult) return;
  const fragText = signal.id === 'beacon' ? fragResult.text : fragResult.fragment.text;

  if (!isAlreadyLogged(signal.id, fragText)) {
    state.loggedFragments.push({
      signalId: signal.id,
      signalName: signal.name,
      source: signal.source,
      cssClass: signal.cssClass,
      color: signal.color,
      text: fragText,
      day: state.day,
      freq: state.currentFreq,
      references: signal.references || []
    });
    saveState();
  }

  document.getElementById('log-btn').style.display = 'none';
  document.getElementById('logged-indicator').textContent = '[ LOGGED ]';
  updateArchiveCount();
  updateStats();
  updateEndingScreen();
}

// ============================================================
// KNOWN SIGNALS SIDEBAR
// ============================================================
function updateKnownSignals() {
  const container = document.getElementById('known-signals-list');
  const discovered = Object.values(SIGNALS).filter(s => state.discoveredSources[s.id]);

  if (!discovered.length) {
    container.innerHTML = '<div style="font-size:11px;color:var(--text-dim);">Scan the dial to discover signals.</div>';
    return;
  }

  container.innerHTML = discovered.map(sig => {
    const freqKey = Object.keys(SIGNALS).find(k => SIGNALS[k].id === sig.id);
    const freqDisplay = (parseInt(freqKey) / 10).toFixed(1);
    const loggedCount = state.loggedFragments.filter(f => f.signalId === sig.id).length;
    const totalFrags = sig.id === 'beacon' ? 4 : sig.fragments.length;
    const isTuned = state.currentSignalId === sig.id;
    const hasNew = !isAlreadyLogged(sig.id, (() => {
      const fr = getFragmentForDay(sig);
      if (!fr) return '__none__';
      return sig.id === 'beacon' ? fr.text : fr.fragment.text;
    })());

    return `<div class="sig-entry ${isTuned ? 'tuned' : ''}" onclick="tuneToFreq(${freqKey})">
      <div class="sig-freq-small ${sig.cssClass}">${freqDisplay} MHz</div>
      <div class="sig-name-small">${sig.name}</div>
      <div class="sig-count">${loggedCount}/${totalFrags} fragments logged</div>
      ${hasNew && loggedCount < totalFrags ? '<div class="sig-new-dot"></div>' : ''}
    </div>`;
  }).join('');
}

function tuneToFreq(freqInt) {
  const dial = document.getElementById('dial');
  dial.value = freqInt;
  onDialMove(freqInt);
}

// ============================================================
// ADVANCE DAY
// ============================================================
function advanceDay() {
  state.day++;
  document.getElementById('day-display').textContent = state.day;
  document.getElementById('status-day').textContent = state.day;
  document.getElementById('stat-days').textContent = state.day;

  // Re-trigger current freq to refresh fragment
  if (state.currentFreq) {
    onDialMove(Math.round(state.currentFreq * 10));
  }

  updateKnownSignals();
  updateEndingScreen();
  saveState();
}

// ============================================================
// STATS
// ============================================================
function updateStats() {
  document.getElementById('stat-logged').textContent = state.loggedFragments.length;
  document.getElementById('stat-sources').textContent = Object.keys(state.discoveredSources).length;
  document.getElementById('stat-days').textContent = state.day;
  updateArchiveCount();
}

function updateArchiveCount() {
  const c = state.loggedFragments.length;
  document.getElementById('archive-count').textContent = c > 0 ? `(${c})` : '';
}

// ============================================================
// ARCHIVE
// ============================================================
let archiveFilter = 'all';

function filterArchive(filter) {
  archiveFilter = filter;
  document.querySelectorAll('.filter-btn').forEach(b => {
    b.classList.toggle('active', b.textContent.trim() === filter.toUpperCase() ||
      (filter === 'all' && b.textContent.trim() === 'ALL'));
  });
  renderArchive();
}

function renderArchive() {
  const grid = document.getElementById('archive-grid');
  const frags = archiveFilter === 'all'
    ? state.loggedFragments
    : state.loggedFragments.filter(f => f.signalId === archiveFilter);

  if (!frags.length) {
    grid.innerHTML = '<div class="empty-archive">No transmissions logged.<br>Return to the radio. Scan the dial.<br><span style="color:var(--text-dim)">Something is out there.</span></div>';
    return;
  }

  grid.innerHTML = frags.map((f, i) => `
    <div class="archive-card">
      <div class="arc-source ${f.cssClass}">${f.source}</div>
      <div class="arc-freq">${f.freq.toFixed(1)} MHz</div>
      <div class="arc-text">"${f.text.substring(0, 200)}${f.text.length > 200 ? '...' : ''}"</div>
      ${f.references && f.references.length ? `<div class="arc-refs">↳ refs: ${f.references.join(', ')}</div>` : ''}
      <div class="arc-day">Logged: day ${f.day}</div>
    </div>
  `).join('');

  // Update filter buttons
  const filterBar = document.getElementById('filter-bar');
  const sources = [...new Set(state.loggedFragments.map(f => f.signalId))];
  filterBar.innerHTML = `<button class="filter-btn ${archiveFilter === 'all' ? 'active' : ''}" onclick="filterArchive('all')">ALL</button>` +
    sources.map(id => {
      const f = state.loggedFragments.find(x => x.signalId === id);
      return `<button class="filter-btn ${archiveFilter === id ? 'active' : ''}" onclick="filterArchive('${id}')">${f.source.split('/')[0].trim()}</button>`;
    }).join('');
}

// ============================================================
// ENDINGS
// ============================================================
function getEnding() {
  const logged = state.loggedFragments;
  const hasMara = logged.some(f => f.signalId === 'mara');
  const hasYusra = logged.some(f => f.signalId === 'yusra');
  const hasOsei = logged.some(f => f.signalId === 'osei');
  const hasTwins = logged.some(f => f.signalId === 'twins');
  const hasBeacon = logged.some(f => f.signalId === 'beacon');
  const maraDeeply = logged.filter(f => f.signalId === 'mara').length >= 3;
  const oseiBoth = hasOsei && hasTwins;
  const yusraDeep = logged.filter(f => f.signalId === 'yusra').length >= 3;
  const beaconOnly = hasBeacon && !hasMara && !hasYusra && !hasOsei && !hasTwins;

  if (beaconOnly) return 'beacon_only';
  if (hasYusra && yusraDeep && hasMara) return 'conspiracy';
  if (oseiBoth && !yusraDeep) return 'acceptance';
  if (hasYusra && hasMara && hasOsei) return 'ambiguous';
  if (logged.length >= 3) return 'ambiguous';
  return null;
}

const ENDINGS = {
  beacon_only: {
    title: "THE ADVISORY",
    condition: "You only logged the government broadcast.",
    color: '#aaaaaa',
    body: `<p>You sat at the radio for a long time. You found one signal, strong and clear. It repeated. It told you to remain calm. It told you isolation was safety. It told you to comply.</p>
    <p>You don't know who made it. You don't know if anyone is still running it. The language shifted a little over the days — you noticed that — but it kept saying the same essential thing: stay away from each other. You are safer alone.</p>
    <p>You turned off the transmitter eventually. The broadcast continued without you, looping into the empty air. Somewhere, someone's voice on a recording was still insisting that everything was under control.</p>
    <p>You didn't know enough to disagree.</p>
    <p style="color:var(--text-dim);font-size:11px;margin-top:20px;">There were other signals. You didn't look for them.</p>`
  },
  conspiracy: {
    title: "PROJECT LULL",
    condition: "You found Mara Chen and Dr. Yusra Haddad, and logged their deepest transmissions.",
    color: '#ffaa44',
    body: `<p>You know what happened. Or you know enough.</p>
    <p>A compound was designed. A crowd dispersal tool, they called it. Synthesized to attenuate the neurological reward of proximity — to make human togetherness feel unnecessary. It was tested. It worked. And then something went wrong, or something went right, depending on who you ask.</p>
    <p>It went airborne. It persisted. It spread along wind patterns and trade routes and ventilation systems until there was no air left that didn't carry it. And the government broadcast on 91.7 changed its language, week by week, nudging compliance, framing isolation as protection. Someone is still running that broadcast. Someone knows, and they're not telling.</p>
    <p>Mara Chen went quiet on day 47. She said the silence wasn't oppressive anymore. You don't know if that was acceptance or exposure. Dr. Haddad's signal degraded into noise. She said she was sorry.</p>
    <p>You know what happened. You don't know what to do about it. You're still alone. The air still carries what it carries.</p>
    <p style="color:var(--text-dim);font-size:11px;margin-top:20px;">There was a priest on 94.6. You didn't listen to him.</p>`
  },
  acceptance: {
    title: "THE STILL SMALL VOICE",
    condition: "You followed Father Osei and the Twins, without hearing the conspiracy evidence.",
    color: '#b0ff88',
    body: `<p>You spent your days at the radio listening to people who were trying to find meaning in the quiet rather than an explanation for it.</p>
    <p>Father Osei talked about Elijah, about the voice that came after the earthquake and the fire. He talked about a congregation that walked into the bush and looked relieved. He talked about a young woman who wrote on a piece of paper: I thought I was sick. I'm not sick. I'm just quiet now.</p>
    <p>The twins found a man in a field who had forgotten faces. They stayed nearby and talked to him, and he got better. They thought they were immune — something about their wiring, their twinness, the fact that they'd never known separateness. They were out there somewhere, still listening, still looking for people worth finding.</p>
    <p>You don't know if this was done to you or whether it simply happened. You're not sure the distinction matters anymore. Something changed. People dispersed. The world got quieter. In the quiet, some people found something they didn't know they'd lost.</p>
    <p>You're still here. You're still at the radio. You leave it on at night, just in case.</p>
    <p style="color:var(--text-dim);font-size:11px;margin-top:20px;">There was a researcher who knew the truth. You never found her frequency.</p>`
  },
  ambiguous: {
    title: "SIGNAL AND NOISE",
    condition: "You found multiple sources — the picture is incomplete, and contradictory.",
    color: '#7adfff',
    body: `<p>You have pieces. You have a scientist who stopped broadcasting. A priest who went walking. Two children who were still listening. A researcher whose signal decayed into static and apology. A government broadcast that kept changing its words.</p>
    <p>The pieces don't resolve cleanly into a picture. Was this engineered? The researcher said yes. Was it inevitable, even beautiful in some terrible way? The priest seemed to think so. Was it survivable, reversible, something a counteragent could fix? Mara Chen was still asking those questions on day 44, and then she wasn't.</p>
    <p>You've logged what you could. You've built an archive of a world that went quiet. Future people — if there are future people who want to understand this — will find these fragments and argue about them. They'll build theories. They'll disagree.</p>
    <p>You don't know what happened. You know a lot about what people thought while it was happening. That might be the same thing. It might not be.</p>
    <p>The radio is still on.</p>
    <p style="color:var(--text-dim);font-size:11px;margin-top:20px;">This is the most honest ending. Not all questions resolve.</p>`
  }
};

function updateEndingScreen() {
  const endingId = getEnding();
  const container = document.getElementById('ending-content');

  if (!endingId || state.loggedFragments.length < 1) {
    container.innerHTML = `<div class="ending-locked">
      <div style="font-family:var(--display);font-size:28px;color:var(--text-dim);letter-spacing:4px;margin-bottom:16px;">NO CONCLUSION</div>
      <div style="font-size:12px;line-height:2.2;">
        You haven't logged enough transmissions.<br>
        Return to the radio. Keep scanning.<br>
        <span style="color:var(--text-dim)">Conclusions emerge from evidence.</span>
      </div>
    </div>`;
    return;
  }

  const ending = ENDINGS[endingId];
  container.innerHTML = `<div class="ending-card">
    <div class="ending-title" style="color:${ending.color}">${ending.title}</div>
    <div class="ending-condition">CONCLUSION REACHED — ${ending.condition}</div>
    <div class="ending-body">${ending.body}</div>
    <div style="margin-top:24px;padding-top:16px;border-top:1px solid var(--border);font-size:10px;color:var(--text-dim);letter-spacing:1px;">
      FRAGMENTS IN ARCHIVE: ${state.loggedFragments.length} //
      SOURCES FOUND: ${Object.keys(state.discoveredSources).length}/5 //
      DAYS ELAPSED: ${state.day}
    </div>
  </div>
  <div style="text-align:center;margin-top:16px;">
    <button class="btn" onclick="switchTab('archive')">[ VIEW FULL ARCHIVE ]</button>
  </div>`;
}

// ============================================================
// TABS
// ============================================================
function switchTab(name) {
  document.querySelectorAll('.tab').forEach((t, i) => {
    const tabs = ['radio', 'archive', 'ending'];
    t.classList.toggle('active', tabs[i] === name);
  });
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById('screen-' + name).classList.add('active');
  if (name === 'archive') renderArchive();
  if (name === 'ending') updateEndingScreen();
}

// ============================================================
// SAVE / LOAD
// ============================================================
function saveState() {
  try {
    localStorage.setItem('dead_signal_save', JSON.stringify({
      day: state.day,
      discoveredSources: state.discoveredSources,
      loggedFragments: state.loggedFragments
    }));
  } catch(e) {}
}

function loadState() {
  try {
    const raw = localStorage.getItem('dead_signal_save');
    if (!raw) return;
    const saved = JSON.parse(raw);
    state.day = saved.day || 1;
    state.discoveredSources = saved.discoveredSources || {};
    state.loggedFragments = saved.loggedFragments || [];
    document.getElementById('day-display').textContent = state.day;
    document.getElementById('status-day').textContent = state.day;
    updateKnownSignals();
    updateStats();
    updateEndingScreen();
  } catch(e) {}
}

// ============================================================
// INTRO / START
// ============================================================
function startGame() {
  initAudio();
  document.getElementById('intro').style.opacity = '0';
  document.getElementById('intro').style.transition = 'opacity 1s';
  setTimeout(() => {
    document.getElementById('intro').style.display = 'none';
  }, 1000);
  loadState();
}