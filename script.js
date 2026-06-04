/* ============================================================
   DEAD SIGNAL — script.js
   All game data, state, audio, and UI logic.
   ============================================================ */

// ============================================================
// SIGNAL DATABASE
// Frequencies are stored as integer keys (MHz × 10).
// Each fragment: { day: N, text: "..." }
//   day  = exact in-game day the fragment unlocks
//   text = explicitly references that day number in narrative
// ngFragments = alternate deeper lore layer for NG+ runs
// ============================================================

const SIG = {

  // --- 91.7 MHz — Government Emergency Beacon ---
  917: {
    id: 'beacon',
    name: 'Emergency Beacon',
    source: 'GOV-AUTO / 91.7',
    css: 'src-beacon',
    color: '#aaaaaa',
    isBeacon: true,
    dayUnlock: 1,
    silentAfter: null,
    refs: [],

    // Normal run: public-facing broadcast that shifts language over time
    beacon: [
      [1,
        "THIS IS AN AUTOMATED EMERGENCY BROADCAST. THIS MESSAGE WILL REPEAT.\n\n" +
        "A voluntary dispersal advisory is in effect. Gatherings of more than three " +
        "persons are discouraged at this time. Citizens are encouraged to remain calm, " +
        "isolated, and compliant. Essential services continue to operate normally. " +
        "This is not a cause for alarm.\n\n[ MESSAGE REPEATS ]"
      ],
      [6,
        "THIS IS AN AUTOMATED EMERGENCY BROADCAST. THIS MESSAGE WILL REPEAT.\n\n" +
        "A mandatory dispersal advisory is in effect. Gatherings of more than three " +
        "persons are prohibited. Citizens are encouraged to remain calm, isolated, and " +
        "cooperative. Essential services have been suspended. This is not a cause for " +
        "alarm. This is not a cause for alarm. Repeat: this is not a cause for alarm.\n\n" +
        "[ MESSAGE REPEATS ]"
      ],
      [13,
        "THIS IS AN AUTOMATED EMERGENCY BROADCAST. THIS MESSAGE WILL REPEAT.\n\n" +
        "Dispersal protocols remain active. Gatherings of any size are prohibited. " +
        "Contact with other individuals is strongly discouraged for your safety and the " +
        "safety of others. Those who have maintained isolation report no symptoms. " +
        "Isolation is protection. Isolation is safety. Isolation is recommended " +
        "indefinitely.\n\n[ MESSAGE REPEATS ]"
      ],
      [21,
        "THIS IS AN AUTOMATED EMERGENCY BROADCAST. THIS MESSAGE WILL REPEAT.\n\n" +
        "All citizens are reminded that proximity remains the primary vector. Maintain " +
        "minimum distance of 500 meters from all other individuals at all times. Those " +
        "who comply report wellness. Those who comply report clarity. Those who comply " +
        "report peace.\n\nComply.\n\n[ MESSAGE REPEATS ]"
      ],
      [35,
        "THIS IS AN AUTOMATED EMERGENCY BROADCAST. THIS MESSAGE WILL REPEAT.\n\n" +
        "Dispersal protocols remain active. Citizens who experience urges toward social " +
        "contact should remain indoors and await recalibration. The feeling of longing " +
        "you may experience is a symptom, not a need. Distance is health. You are well. " +
        "You are safe. You are alone and that is correct.\n\nComply.\n\n[ MESSAGE REPEATS ]"
      ],
    ],

    // NG+ run: same frequency, but now shows internal management memos
    ngBeacon: [
      [1,
        "THIS IS AN AUTOMATED EMERGENCY BROADCAST.\n\n" +
        "[ NOTICE — CLEARANCE LEVEL 4+ ONLY ]\n" +
        "Dispersal index holding at 94.7%. Target threshold: 97%. Current timeline " +
        "projects full saturation by day 60 of the advisory period. Compliance rates " +
        "exceed projections. Behavioral modeling indicates minimal resistance vector. " +
        "Continue standard broadcast.\n\n[ MESSAGE REPEATS ]"
      ],
      [15,
        "THIS IS AN AUTOMATED EMERGENCY BROADCAST.\n\n" +
        "[ NOTICE — CLEARANCE LEVEL 4+ ONLY ]\n" +
        "Anomaly detected: subject cluster in sector 7G showing reduced LULL response. " +
        "Recommend targeted booster dispersal. Secondary concern: unauthorized broadcasts " +
        "on 103.4 compromising op-sec. Flag for suppression. Dispersal index: 96.1%. " +
        "Timeline nominal.\n\n[ MESSAGE REPEATS ]"
      ],
      [30,
        "THIS IS AN AUTOMATED EMERGENCY BROADCAST.\n\n" +
        "[ NOTICE — CLEARANCE LEVEL 4+ ONLY ]\n" +
        "Final report: saturation achieved. Behavioral modification stable and " +
        "self-sustaining. LULL compound no longer required — subjects now enforce " +
        "dispersal socially. Phase 2 may begin at project director discretion. " +
        "Archive all operational data.\n\nComply.\n\n[ MESSAGE REPEATS ]"
      ],
    ],
  },

  // --- 88.1 MHz — Dr. Mara Chen, WHO epidemiologist, Oslo ---
  881: {
    id: 'mara',
    name: 'Dr. Mara Chen',
    source: 'MARA / 88.1',
    css: 'src-mara',
    color: '#7adfff',
    dayUnlock: 1,
    silentAfter: 47,
    refs: ['103.4 MHz', '91.7 MHz'],

    fragments: [
      {
        day: 1,
        text:
          "Day 1 of broadcasting. My name is Dr. Mara Chen, WHO field epidemiologist. " +
          "I am transmitting on 88.1 from Oslo. Anyone receiving, please respond.\n\n" +
          "I've been alone for nineteen days. The city hasn't emptied — I can see lights " +
          "at night, movement at distance. But no one gathers. No one comes near. I " +
          "watched two children walk past each other on the street below this morning. " +
          "They acknowledged each other. Neither stopped.\n\n" +
          "Whatever this is, it isn't death. It's something else. I'm going to find out what.",
      },
      {
        day: 3,
        text:
          "Day 3. Completed the full environmental battery today — serology, atmospheric " +
          "particulates, water supply, EM spectrum. Nothing. No pathogen. No toxin. No known vector.\n\n" +
          "I've started thinking about it differently. What if the mechanism isn't chemical? " +
          "What if it's neurological — something that doesn't show up in blood because it " +
          "isn't in the blood, it's changed the wiring?\n\n" +
          "The die-off isn't biological. I've run every test. It's something about proximity. " +
          "The closer people stand, the faster the effect manifests. I need to redesign my entire framework.",
      },
      {
        day: 7,
        text:
          "Day 7. Someone slid a handwritten note under my lab door last night. " +
          "It said: STOP BROADCASTING. THEY ARE LISTENING.\n\n" +
          "I don't know who left it or how they got into the building.\n\n" +
          "I found a cached reference on what remains of the academic network — a defense " +
          "contractor running 'proximity response attenuation research' roughly eighteen " +
          "months before the Quieting started. The paper was pulled. The author's name was " +
          "partially visible: Dr. Y. H— at an institution I can't identify. If she's still " +
          "out there, someone suggested trying 103.4 MHz. I'll try tonight.",
      },
      {
        day: 12,
        text:
          "Day 12. I went outside on day 10. Three blocks to retrieve equipment. " +
          "I passed a woman — forty meters away — and we both stopped. " +
          "We stood there for a long time. Neither of us closed the distance.\n\n" +
          "It wasn't fear. I want to be precise about that. It was more like a mutual " +
          "recognition. A shared understanding that the distance was correct. That coming " +
          "closer would have been the wrong thing, the way touching a hot surface is wrong " +
          "— not morally, just physically wrong.\n\n" +
          "I've been trying to model that sensation for two days. I don't have language for it yet.",
      },
      {
        day: 18,
        text:
          "Day 18. The government broadcast on 91.7 changed its wording on day 13. " +
          "I logged both versions. It changed again on day 21 — I'm anticipating that now " +
          "and logging every iteration. 'Voluntary' became 'mandatory.' Then 'recommended " +
          "indefinitely.' Then 'comply.'\n\n" +
          "Someone is still running that machine. They're not warning us. They're steering " +
          "us. Whoever is tending that broadcast knows something we don't.\n\n" +
          "I've been corresponding with a priest named Osei on 94.6. He thinks this is " +
          "spiritual. I think he's wrong. I can't fully dismiss him. He's watching things I'm not watching.",
      },
      {
        day: 30,
        text:
          "Day 30. Final transmission for the foreseeable future.\n\n" +
          "I've been going outside more. Not because I have to. Because the silence is " +
          "becoming ambient — the way white noise disappears.\n\n" +
          "I've been asking the wrong question. 'What is causing this?' assumes disease. " +
          "But what if it's a response? What if mass human proximity was always unsustainable " +
          "and something — chemical, emergent, whatever LULL was — finally gave us permission to stop?\n\n" +
          "Check 91.7 carefully. Log every version. The wording keeps shifting. Someone is " +
          "keeping that machine running for a reason.\n\nWhoever you are. Take care.",
      },
    ],

    // NG+ — Mara reveals she was complicit before the Quieting
    ngFragments: [
      {
        day: 1,
        text:
          "Day 1 of my second transmission series. I need to say something I couldn't say before.\n\n" +
          "I knew about LULL. Not the details — I wasn't read in. But six months before the " +
          "Quieting I was approached by a contractor asking for consultation on 'behavioral " +
          "threshold modeling in high-density urban environments.' I asked what the application " +
          "was. They said crowd management. I signed the NDA. I gave them three months of work.\n\n" +
          "I didn't know what it would become. But I knew something was being built. I told " +
          "myself it would be controlled.\n\n" +
          "I was wrong. Not because anyone died. Because it worked on a global scale. " +
          "Controlled was never the point.",
      },
      {
        day: 8,
        text:
          "Day 8. The institution was VALE Research Partners. I found cached internal documents " +
          "before the networks fully went down. LULL had a second phase called LULL-PERMANENT " +
          "— testing whether the behavioral attenuation could become self-reinforcing without " +
          "continued chemical exposure.\n\n" +
          "The hypothesis: suppress social reward long enough, social behavior decays on its own. " +
          "The body stops seeking what it stops receiving.\n\n" +
          "I found one line of the classified trial abstract: 'Behavioral modification achieved " +
          "permanent status in 89% of subjects within 42 days of compound withdrawal.'\n\n" +
          "Forty-two days. We are far, far past that now.",
      },
      {
        day: 20,
        text:
          "Day 20. The twins on 117.2 — I've been listening to them since day 23 of the " +
          "first run. I have a hypothesis now.\n\n" +
          "LULL attenuates the learned reward response to proximity. Children who haven't " +
          "fully formed that pathway — still in the developmental plastic window — are below " +
          "the attenuation threshold. The compound has nothing to bind to.\n\n" +
          "If that's right, the children are the control group. They're what we were before. " +
          "They're also proof the effect isn't permanent for everyone. There may be a recovery window.\n\n" +
          "I should have been a better scientist the first time. I'm trying now.",
      },
    ],
  },

  // --- 94.6 MHz — Father Emmanuel Osei, Kumasi, Ghana ---
  946: {
    id: 'osei',
    name: 'Father Emmanuel Osei',
    source: 'OSEI / 94.6',
    css: 'src-osei',
    color: '#b0ff88',
    dayUnlock: 1,
    silentAfter: null,
    refs: ['88.1 MHz'],

    fragments: [
      {
        day: 1,
        text:
          "Day 1 of transmission. This is Father Emmanuel Osei, St. Michael's Parish, Kumasi. " +
          "I don't know who is listening. I'm broadcasting because someone should be saying something true.\n\n" +
          "My congregation — forty-seven people, most of whom I have known for twenty years — " +
          "walked into the bush on day 19 before I began this log. Single file, before dawn. " +
          "I watched from the rectory window. None of them looked frightened. " +
          "Every one of them looked relieved.\n\n" +
          "I did not follow them. I've been sitting with that decision every day since.",
      },
      {
        day: 4,
        text:
          "Day 4. A woman left food at the church gate this morning. She didn't call out. " +
          "She didn't look at the window. I went out after she left and found a note folded inside the bundle.\n\n" +
          "It said: Thank you for the broadcasts. I am well. I am alone. These are not the same thing.\n\n" +
          "I've been sitting with that sentence all day. The scientist on 88.1 would call this " +
          "a symptom of the compound. I'm not certain she's wrong. I'm not certain she's right.",
      },
      {
        day: 9,
        text:
          "Day 9. On the subject of Elijah — the passage I keep returning to.\n\n" +
          "After the great wind. After the earthquake. After the fire. A still small voice. " +
          "I've always read this as metaphor. I wonder now if it was something more literal. " +
          "What if the noise was the problem? What if we had been so loud, for so long, " +
          "that we could not hear anything quiet?\n\n" +
          "I'm not saying this is a gift. People are suffering. But I have met, via this " +
          "radio, people who have found something in the quiet they didn't have before. " +
          "I think both things can be true.",
      },
      {
        day: 15,
        text:
          "Day 15. Dr. Chen and I have been corresponding. She told me today that the comfort " +
          "I feel with solitude is the compound working on my reward pathways. I told her: " +
          "even if that's true, the peace is still real. The compound doesn't make the peace " +
          "fake. It may have opened a door I was too busy to notice.\n\n" +
          "She said she'd think about that. I believe she will.\n\n" +
          "We disagree on what the questions mean. We agree that the questions matter. " +
          "That feels like enough common ground for now.",
      },
      {
        day: 22,
        text:
          "Day 22. On fear versus grief.\n\n" +
          "The people suffering most are not suffering because they're alone. They're " +
          "suffering because they believe they shouldn't be. The loneliness is real but " +
          "the shame of it — the conviction that something is wrong with them — that's " +
          "what breaks people. And the broadcast on 91.7 makes it worse by framing " +
          "isolation as medical compliance rather than a lived condition.\n\n" +
          "We were not built for crowds of thousands. We may not be built for total solitude " +
          "either. We are built for something between. We are learning what that is.",
      },
      {
        day: 28,
        text:
          "Day 28. I'm walking north tomorrow. Villages in the Brong-Ahafo region have lived " +
          "dispersed for generations — extended families spread across wide land, connected " +
          "by footpath and signal fire. I want to see what that looks like now. Whether the " +
          "new world looks like something that was always here.\n\n" +
          "I'll leave the transmitter running on 94.6. The frequency is yours.\n\n" +
          "For Dr. Chen, if she ever hears this: the data and the meaning are not the same " +
          "thing. Keep looking for both.\n\n" +
          "For whoever is at the radio: someone is always worth finding.",
      },
    ],

    // NG+ — Osei admits his own pre-existing longing for the Quieting
    ngFragments: [
      {
        day: 1,
        text:
          "Day 1 of my second transmission series. Something I've never said on this radio.\n\n" +
          "I was not surprised by the Quieting. Not because I predicted it. But because I " +
          "felt relief when it happened. I saw that same relief in my congregation's faces " +
          "as they filed out before dawn.\n\n" +
          "As if we had all been waiting for permission to stop.\n\n" +
          "I've spent months asking whether that relief is chemical. Whether something made " +
          "us feel this way. But I've also asked: what if the chemical found something real? " +
          "What if the longing for quiet was always there, underneath everything?",
      },
      {
        day: 14,
        text:
          "Day 14. A man came to the church. He had walked six days from Accra. He sat in " +
          "the last pew for four hours without speaking. Then he said: 'I used to think " +
          "being alone meant no one wanted me. Now I think it means no one needs to.'\n\n" +
          "He left a small carving on the altar before he went — a figure with arms open, " +
          "facing away from everything.\n\n" +
          "I don't know what to do with the theology of that yet. But I know what I saw in " +
          "his face. It was the same thing I saw in my congregation's faces on the morning " +
          "they walked away. Not resignation.\n\nArrival.",
      },
    ],
  },

  // --- 103.4 MHz — Dr. Yusra Haddad, VALE Research Partners ---
  1034: {
    id: 'yusra',
    name: 'Dr. Yusra Haddad',
    source: 'HADDAD / 103.4',
    css: 'src-yusra',
    color: '#ffaa44',
    dayUnlock: 5,
    silentAfter: null,
    refs: ['88.1 MHz', '117.2 MHz'],
    degradeAfter: 25, // signal degrades after this day

    fragments: [
      {
        day: 5,
        text:
          "Day 5. If you found this frequency someone pointed you here, which means " +
          "you're already asking the right questions.\n\n" +
          "I was a researcher at VALE Research Partners, contracted to DARPA's behavioral " +
          "disruption division. The project was designated LULL. The theory: synthesize a " +
          "compound that suppresses the neurological reward response triggered by physical " +
          "proximity to other humans. The dopamine cascade from a handshake, a crowd, a " +
          "shared meal. Make togetherness feel optional.\n\n" +
          "We did. It worked. And on day 8 of the field trial, three years before the " +
          "Quieting, someone in my own lab made a decision I did not authorize and cannot forgive.",
      },
      {
        day: 8,
        text:
          "Day 8. The compound was never supposed to leave the lab. Someone on my team " +
          "modified the molecular structure for airborne persistence. Without my knowledge. " +
          "Without ethics review. They called it LULL-ATMOSPHERIC.\n\n" +
          "They released it in a single city as a proof of concept. Day 43 of that test, " +
          "wind patterns carried it over three national borders. They lost containment. " +
          "They never disclosed this to anyone.\n\n" +
          "That was fourteen months before the day you're listening on.",
      },
      {
        day: 14,
        text:
          "Day 14. The broadcast on 91.7 is a behavioral management protocol, not a public " +
          "health advisory. I've been tracking the language changes systematically. " +
          "'Voluntary' on day 1. 'Mandatory' by day 6. 'Recommended indefinitely' by day 13. " +
          "'Comply' by day 21.\n\n" +
          "Someone within the original project team is still running that broadcast. They " +
          "know what happened. They chose to manage the outcome rather than disclose it.\n\n" +
          "There is a counteragent — VALE-9. I don't have production capacity. " +
          "If you have lab access and can receive this, respond on 103.4. Please.",
      },
      {
        day: 20,
        text:
          "Day 20. I've been monitoring 117.2. Two children — twins, they say. " +
          "They don't seem affected the way adults are.\n\n" +
          "Hypothesis: LULL attenuates learned proximity reward pathways. Children still " +
          "in the developmental plastic window haven't fully formed those pathways. " +
          "The compound has a reduced binding surface. They may be functionally immune.\n\n" +
          "Implication: the effect may not be permanent for everyone. If reward pathways " +
          "can be rebuilt through sustained counter-stimulus — forced proximity, even without " +
          "reward, re-sensitizing over time — there may be a recovery window.\n\n" +
          "The children on 117.2 are already doing this. Deliberately, I think. They're showing us something.",
      },
      {
        day: 28,
        text:
          "Day 28. Signal is degrading on my end. [static] battery situation getting [static].\n\n" +
          "For the record. I helped build this. I didn't know what it would [static] become " +
          "but I ran the trials and I cashed the [static] and I told myself it was safe " +
          "because no one died [static].\n\n" +
          "No one died. It just [static] made them want to be alone. We called that non-lethal. " +
          "I don't know [static] what word applies anymore.\n\n" +
          "The children on [static] 117.2 — they're important. They're showing the way " +
          "[static] back if anyone wants it.\n\nI'm [static] sorry.",
      },
    ],

    // NG+ — Yusra names names and reveals the counteragent formula
    ngFragments: [
      {
        day: 5,
        text:
          "Day 5 of the second series. I want to tell you what I've learned since the first.\n\n" +
          "The people who authorized LULL-ATMOSPHERIC — I know their names. Three of them. " +
          "Two are almost certainly still running the broadcast on 91.7. The third has gone quiet somewhere.\n\n" +
          "They didn't do it for money. The most frightening conclusion I've reached is that " +
          "they believed it was correct. They modeled mass human proximity as civilizational " +
          "risk — the density that causes wars, pandemics, resource collapse. They decided to solve it.\n\n" +
          "They thought they were saving us. I can't stop thinking about that.",
      },
      {
        day: 15,
        text:
          "Day 15. The counteragent — VALE-9. I need to describe it clearly in case I go silent.\n\n" +
          "It's a selective re-sensitization compound. It doesn't reverse LULL directly — it " +
          "reopens the proximity reward pathway so sustained human contact can re-train the " +
          "response naturally. Approximately 14 days of consistent close human contact to " +
          "complete re-sensitization. Synthesizable from precursors available in any " +
          "moderately equipped lab.\n\n" +
          "Formula sequence begins: C14H21N3O2 — chelated with [signal degrades here]\n\n" +
          "I'll try to retransmit the complete sequence. Stay on 103.4.",
      },
      {
        day: 22,
        text:
          "Day 22. Something I haven't said yet. About Elena.\n\n" +
          "Dr. Elena Voss was the project director above me at VALE. She signed the " +
          "authorization for LULL-ATMOSPHERIC. She is the person most responsible for what happened.\n\n" +
          "I spent months hating her. Then I found something odd in the 91.7 transmission " +
          "packet — buried in the metadata, almost imperceptible. Irregular intervals. " +
          "Hesitations. Someone with the right equipment could read it as Morse.\n\n" +
          "I decoded it. It said: FORMULA IS IN GENEVA. USE IT.\n\n" +
          "Elena is inside the system she built. She's trying to undo it from inside. " +
          "I don't know what to do with that.",
      },
    ],
  },

  // --- 117.2 MHz — The Twins (unnamed, age 14, location unknown) ---
  1172: {
    id: 'twins',
    name: 'The Twins',
    source: 'UNKNOWN / 117.2',
    css: 'src-twins',
    color: '#ff88cc',
    dayUnlock: 20,
    silentAfter: null,
    refs: ['94.6 MHz', '88.1 MHz'],

    fragments: [
      {
        day: 20,
        text:
          "Hello. We found radio equipment in an abandoned emergency management van on day 17. " +
          "We spent three days learning to use it. Today is day 20, which is why you're hearing us now.\n\n" +
          "There are two of us. We're twins. Fourteen years old. We won't say our names or " +
          "location — we've learned that's not safe — but we're okay.\n\n" +
          "We've noticed we're different from adults. We can sit near each other — closer than " +
          "the distance adults seem to need — and it feels normal, not wrong. We don't fully understand why yet.\n\n" +
          "We found a man alone in a field yesterday. Day 19. He said he hadn't spoken to " +
          "anyone in six weeks. We stayed nearby and talked to him for an hour. He said it helped. " +
          "Then he asked us to leave.",
      },
      {
        day: 23,
        text:
          "Day 23. We've been testing things.\n\n" +
          "We tried standing close to an adult — a woman named Delphine. When we got within " +
          "about two meters she became visibly uncomfortable. Not frightened. More like pained. " +
          "Like something pulling her backward.\n\n" +
          "At three meters she was okay. We talked for a long time. She told us she used to " +
          "have a large family. She said she remembers loving being in the same room as all of " +
          "them, but she can't reconstruct what that felt like anymore. Like trying to remember a smell.\n\n" +
          "We think adults are losing the memory of closeness. We're writing down everything " +
          "we remember about it. Just in case.",
      },
      {
        day: 26,
        text:
          "Day 26. We found what used to be a research station. Scientific equipment everywhere. " +
          "A name on a whiteboard: Dr. Mara Chen. A sticky note on the monitor: 88.1, she will understand.\n\n" +
          "Someone was trying to leave a message for someone else. We started tuning to 88.1 " +
          "after that. Dr. Chen sounds like someone who is very good at knowing things and is " +
          "afraid of what she's beginning to know.\n\n" +
          "We also found a locked room in the station. Through the door gap: hundreds of printed " +
          "documents. A logo on some pages — a geometric V inside a circle. We couldn't get in. Yet.",
      },
      {
        day: 30,
        text:
          "Day 30. Last broadcast for a while. We think staying on one frequency draws attention " +
          "— 91.7 got stronger this week, like someone boosted the signal. We're not sure if that's coincidence.\n\n" +
          "One thing before we go quiet: being alone isn't the worst thing. We've met people who " +
          "are genuinely okay now. Who found something in the quiet they didn't have before. We respect that.\n\n" +
          "But we've also met people who are not okay alone and are getting worse. Those people " +
          "are worth finding. We've been keeping a list of their locations.\n\n" +
          "We'll still be on 117.2. We don't know exactly what we're looking for yet. " +
          "We think we'll know it when we find it.",
      },
    ],

    // NG+ — Twins reveal VALE documents they found
    ngFragments: [
      {
        day: 20,
        text:
          "Day 20. Back on this radio for the second time. We need to tell someone about the logo.\n\n" +
          "The geometric V inside a circle — we've seen it three times now. The research " +
          "station on day 26 of the last run. The side of a vehicle that passed us at " +
          "distance on day 34. A sealed crate in a coastal warehouse we sheltered in on day 41.\n\n" +
          "We think it's VALE. We know about them from Dr. Haddad on 103.4. We think the " +
          "station we found was one of theirs. We got into the locked room eventually.\n\n" +
          "We're not going to transmit what we found yet. We need to figure out who to trust first.",
      },
      {
        day: 27,
        text:
          "Day 27. We trust Dr. Chen. We trust Father Osei, even though he's walking.\n\n" +
          "The documents from the VALE station: field reports. Population compliance data. " +
          "Maps with percentage saturation rates by region. It reads like a corporate quarterly " +
          "review. Calm language. Clean columns.\n\n" +
          "There's a final report, dated seven months into the Quieting: 'Phase 1 complete. " +
          "Behavioral modification stable and self-sustaining. Recommend archive and proceed " +
          "to Phase 2 per original directive.'\n\n" +
          "We don't know what Phase 2 is. The document ends there.\n\n" +
          "Whoever is listening: there is evidence. We have it.",
      },
    ],
  },

  // --- 109.8 MHz — Shan (SECRET: no breadcrumb, found only by scanning) ---
  1098: {
    id: 'shan',
    name: 'Shan',
    source: 'SHAN / 109.8',
    css: 'src-shan',
    color: '#cc88cc',
    isSecret: true,
    dayUnlock: 10,
    silentAfter: null,
    refs: ['connects the others'],

    fragments: [
      {
        day: 10,
        text:
          "Day 10. I don't know if anyone will find this frequency. I broadcast here because " +
          "it felt like somewhere no one would look.\n\n" +
          "My name is Shan. I was a network engineer. I live in a server farm in Iceland — " +
          "about a hundred racks of hardware and one functioning gas heater. I've kept a " +
          "piece of the internet running. A small subnet that still carries traffic if you " +
          "know where to reach it.\n\n" +
          "I've been watching that traffic for months.\n\n" +
          "The world didn't go as quiet as you think. There are more people transmitting " +
          "than you'd believe. They're all broadcasting to empty rooms — the same as you. " +
          "I'm trying to change that.",
      },
      {
        day: 15,
        text:
          "Day 15. Traffic patterns I've been monitoring.\n\n" +
          "Communications volume dropped 94% in the first three months. Expected. Then " +
          "something strange: it started rising again. Not voice, not video — text. Short " +
          "messages. Coordinates. Timestamps. People were building a new network without " +
          "knowing each other was doing it.\n\n" +
          "I've been routing their messages. Connecting people who don't know they're " +
          "connected. I'm a node that no one knows exists.\n\n" +
          "In the last thirty days I've facilitated contact between over 2,000 individuals " +
          "across 47 countries. None of them can tolerate physical proximity yet. But they're " +
          "talking. Through screens, radio, letters left in agreed locations.\n\n" +
          "Solitude and silence are not the same thing.",
      },
      {
        day: 22,
        text:
          "Day 22. Something concerning.\n\n" +
          "I found references to 'Phase 2' in two separate message threads from different " +
          "countries, neither aware of the other. Both described a new broadcast — not on " +
          "91.7, a rotating frequency — running a subsonic signal. Below hearing. " +
          "Measurable only with specific equipment.\n\n" +
          "A physicist in São Paulo had the equipment. She described it as a 'forced " +
          "recalibration tone.' Different from LULL. LULL made proximity feel unrewarding. " +
          "This signal seems designed to make communication itself feel unrewarding.\n\n" +
          "Not just physical togetherness. Any togetherness. Radio. Text. Signal.\n\n" +
          "Something wants us to stop talking to each other entirely. I'm still routing. " +
          "I'll keep routing.",
      },
      {
        day: 35,
        text:
          "Day 35. I found the source of the Phase 2 signal.\n\n" +
          "Coordinates buried in the 91.7 broadcast metadata. I had to strip layers of the " +
          "transmission packet to find them. The facility runs on its own power grid. It has " +
          "been continuously staffed throughout the Quieting.\n\n" +
          "Someone decided that making proximity unrewarding wasn't enough. They want " +
          "connection itself to feel unrewarding. Not as crowd control. As an endpoint.\n\n" +
          "But I've seen anomalies in the Phase 2 transmission pattern — tiny hesitations, " +
          "irregular intervals — that look less like signal noise and more like someone " +
          "blinking in Morse code from inside.\n\n" +
          "I'm going to try to reach them. Stay on 109.8.",
      },
    ],

    // NG+ — Shan identifies Elena Voss and starts distributing the counteragent formula
    ngFragments: [
      {
        day: 10,
        text:
          "Day 10 of the second series. I'll be brief — I think this channel may be monitored.\n\n" +
          "I've been inside the Phase 2 facility's network. The person blinking Morse in the " +
          "transmission pattern — her name is Dr. Elena Voss. She was the original project " +
          "director for LULL. She authorized the atmospheric release. She's been running both " +
          "phases from inside.\n\n" +
          "But the Morse isn't asking for rescue. It's asking for a message to be delivered. " +
          "To Dr. Yusra Haddad on 103.4.\n\n" +
          "Tell her: Elena says the counteragent formula is complete and stored at the original " +
          "VALE lab in Geneva. She left it there before Phase 2 began. She wants it used.",
      },
      {
        day: 25,
        text:
          "Day 25. I've pushed the counteragent formula through the subnet. It's cached at " +
          "multiple nodes now. A chemistry graduate in Cape Town has requested the precursor " +
          "list. A hospital technician in Reykjavik has lab access.\n\n" +
          "I don't know if enough people will want it. Some won't. Father Osei probably " +
          "wouldn't take it. The people who found peace in the quiet — I'm not sure it's " +
          "my place to take that from them.\n\n" +
          "But the ones being destroyed by it. The ones whose longing is eating them alive. " +
          "They should have a choice.\n\n" +
          "That's all I'm trying to give anyone. A choice.",
      },
    ],
  },
};

// ============================================================
// ENDINGS
// ============================================================
const ENDINGS = {

  beacon_only: {
    title: "THE ADVISORY",
    color: '#aaaaaa',
    condition: "You only logged the government broadcast.",
    body: `
      <p>You sat with the radio for days. You found one signal — clear, strong, repeating.
      It told you to remain calm. It told you isolation was safety. It told you to comply.
      And every few days, without explanation, it changed one word.</p>
      <p>You noticed the changes. You don't know what they mean. Somewhere in a facility
      you'll never find, a machine or a person is adjusting language — fine-tuning the
      instructions sent into empty air to an audience that can no longer gather to compare notes.</p>
      <p>You turned off the transmitter. The broadcast continued without you, looping into
      the quiet. Somewhere, someone's voice on a recording still insists everything is under
      control. You didn't know enough to disagree.</p>
      <p style="color:var(--text-dim);font-size:11px;margin-top:18px;">
        There were other signals on the dial. You didn't look for them.
      </p>`,
  },

  conspiracy: {
    title: "PROJECT LULL",
    color: '#ffaa44',
    condition: "You found Mara Chen and Dr. Yusra Haddad.",
    body: `
      <p>You know what happened. Or enough of it.</p>
      <p>A compound was synthesized to make togetherness feel optional. Someone decided
      that working was sufficient reason to release it at scale. It went airborne. It spread
      along wind patterns and trade routes until no air on earth didn't carry it. And then
      someone began managing the aftermath — nudging the broadcast on 91.7 from 'voluntary'
      to 'mandatory' to 'comply,' week by week, as if language could finish what chemistry started.</p>
      <p>Mara Chen went quiet on day 47. She said the silence wasn't oppressive anymore.
      You don't know if that was peace or exposure. Yusra Haddad's signal degraded into
      static. She said she was sorry.</p>
      <p>You know what happened. You don't know what to do about it. The air still carries what it carries.</p>
      <p style="color:var(--text-dim);font-size:11px;margin-top:18px;">
        There was a priest on 94.6 who found a different answer. You didn't follow him.
      </p>`,
  },

  acceptance: {
    title: "THE STILL SMALL VOICE",
    color: '#b0ff88',
    condition: "You followed Father Osei and the Twins, without pursuing the conspiracy.",
    body: `
      <p>You spent your time listening to people trying to find meaning in the quiet
      rather than an explanation for it.</p>
      <p>Father Osei talked about Elijah. About a congregation that walked into the bush
      before dawn and looked — every one of them — relieved. He talked about a woman who
      left a note: I thought I was sick. I'm not sick. I'm just quiet now. He walked north
      on day 28 to find villages that had always lived this way.</p>
      <p>The twins were somewhere out there, still moving, keeping a list of people who
      needed checking on, writing down everything they remembered about what human closeness felt like.</p>
      <p>You don't know if this was done to you or whether it happened. You're not sure the
      distinction matters. The world got quieter. In the quiet, some people found something
      they didn't know they'd lost.</p>
      <p style="color:var(--text-dim);font-size:11px;margin-top:18px;">
        There was a researcher who knew the technical truth. You never found her frequency.
      </p>`,
  },

  ambiguous: {
    title: "SIGNAL AND NOISE",
    color: '#7adfff',
    condition: "You found multiple sources. The picture is contradictory.",
    body: `
      <p>You have pieces. A scientist who stopped broadcasting. A priest who went walking.
      Two children still listening. A researcher whose signal decayed into apology.
      A government broadcast that kept changing its words.</p>
      <p>The pieces don't resolve. Was this engineered? The researcher said yes. Was it
      inevitable, even necessary? The priest didn't think that was the wrong question.
      Was there a counteragent? Mara Chen was asking on day 30 and then her signal went quiet.</p>
      <p>You've built an archive of a world that went quiet. Future people — if any are
      interested — will find these fragments. They'll argue about them. Both theories will have evidence.</p>
      <p>The radio is still on. You're still here.</p>
      <p style="color:var(--text-dim);font-size:11px;margin-top:18px;">
        This is the most honest ending. Not all signals resolve into meaning.
      </p>`,
  },

  secret: {
    title: "THE NODE",
    color: '#cc88cc',
    condition: "You found the hidden signal on 109.8.",
    body: `
      <p>You found a frequency no one pointed you toward. You found Shan — a network engineer
      in Iceland keeping a piece of the internet alive, routing messages between two thousand
      people who didn't know they were connected.</p>
      <p>You found out about Phase 2. A subsonic signal designed to make communication itself
      feel unrewarding. Not just physical togetherness — any togetherness. And you found the
      anomaly buried in the transmission pattern: someone inside the facility blinking in Morse,
      trying to leave a message that couldn't be intercepted.</p>
      <p>The counteragent formula exists. It's cached in a subnet, waiting. A graduate in Cape
      Town. A technician in Reykjavik. The chain exists. Shan built it, thread by thread,
      because solitude and silence are not the same thing.</p>
      <p>You were the only one who listened on 109.8. Now you know.
      What you do with that knowledge is a question the radio can't answer.</p>
      <p style="color:var(--text-dim);font-size:11px;margin-top:18px;">
        There is a way back. Whether to take it is another question.
      </p>`,
  },

  ng_complete: {
    title: "PHASE 2",
    color: '#ff88cc',
    condition: "NG+ — You assembled the full picture across all sources.",
    body: `
      <p>You know all of it now.</p>
      <p>LULL was never purely a crowd-dispersal tool. It was a civilizational hypothesis
      enacted without consent: that human mass-proximity was itself the pathogen — the
      density that causes wars, pandemics, collapse. The solution was elegant. Reduce the
      reward of togetherness until togetherness stops.</p>
      <p>Phase 1 worked. Phase 2 — the signal designed to make even remote communication
      feel unrewarding — was the insurance policy. The endpoint was not solitude. It was
      total disconnection. Every human an island with no bridge and no desire for one.</p>
      <p>Elena Voss, who authorized all of it, left the counteragent formula in a locked
      lab in Geneva and started blinking Morse from inside her own facility. The twins have
      VALE documents. Shan is routing the formula. Mara Chen, if she's still listening,
      now knows what she helped build.</p>
      <p>The question isn't whether this can be undone. It can. The question is what we
      rebuild. Whether we go back to the density that made LULL seem like a solution to
      someone. Whether we find the third thing — the space between isolation and the crowd.
      Father Osei walked north to find it. He may already be there.</p>
      <p style="color:var(--text-dim);font-size:11px;margin-top:18px;">
        All endings are true. This one requires the most evidence.
      </p>`,
  },
};

// ============================================================
// GAME STATE
// ============================================================
let ST = {
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
};

let JOURNAL = [];       // permanent record of completed runs

let archFilter = 'all';
let archView   = 'grid';
let twTimer    = null;

// ============================================================
// AUDIO — Web Audio static noise
// ============================================================
function initAudio() {
  if (ST.audioCtx) return;
  try {
    ST.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const proc = ST.audioCtx.createScriptProcessor(4096, 1, 1);
    proc.onaudioprocess = e => {
      const d = e.outputBuffer.getChannelData(0);
      for (let i = 0; i < 4096; i++) d[i] = (Math.random() * 2 - 1) * 0.12;
    };
    const filt = ST.audioCtx.createBiquadFilter();
    filt.type = 'bandpass';
    filt.frequency.value = 1100;
    filt.Q.value = 0.6;
    ST.gainNode = ST.audioCtx.createGain();
    ST.gainNode.gain.value = 0.3;
    proc.connect(filt);
    filt.connect(ST.gainNode);
    ST.gainNode.connect(ST.audioCtx.destination);
  } catch (e) {}
}

function setVol(v) {
  if (ST.gainNode)
    ST.gainNode.gain.setTargetAtTime(v, ST.audioCtx.currentTime, 0.1);
}

function toggleStatic() {
  initAudio();
  ST.staticOn = !ST.staticOn;
  const b = document.getElementById('static-btn');
  b.textContent = ST.staticOn ? '[ STATIC: ON ]' : '[ STATIC: OFF ]';
  b.classList.toggle('active-btn', ST.staticOn);
  setVol(ST.staticOn ? 0.3 : 0);
}

// ============================================================
// SIGNAL HELPERS
// ============================================================
function sigAtFreq(fi) {
  for (const k of Object.keys(SIG)) {
    if (Math.abs(parseInt(k) - fi) <= 3)
      return { key: parseInt(k), sig: SIG[k] };
  }
  return null;
}

function getFragment(sig) {
  if (sig.isBeacon) {
    const list = ST.ng && sig.ngBeacon ? sig.ngBeacon : sig.beacon;
    let best = list[0];
    for (const t of list) { if (ST.day >= t[0]) best = t; }
    return { text: best[1], id: 'beacon_' + best[0] };
  }
  const frags =
    ST.ng && sig.ngFragments && sig.ngFragments.length
      ? sig.ngFragments
      : sig.fragments;
  const avail = frags.filter(f => f.day <= ST.day);
  if (!avail.length) return null;
  const f = avail[avail.length - 1];
  return { text: f.text, id: sig.id + '_d' + f.day };
}

function isLogged(sid, txt) {
  return ST.logged.some(f => f.signalId === sid && f.text === txt);
}

function degradeText(text, amount) {
  return text
    .split(' ')
    .map(w => (Math.random() < amount * 0.45 && w.length > 3 ? '[static]' : w))
    .join(' ');
}

// ============================================================
// DIAL
// ============================================================
function onDialMove(raw) {
  const fi = parseInt(raw);
  const ff = fi / 10;
  ST.currentFreq = ff;
  document.getElementById('freq-display').textContent = ff.toFixed(1);
  document.getElementById('status-freq').textContent  = ff.toFixed(1);

  const m = sigAtFreq(fi);
  updateMeter(m, fi);

  if (!m) {
    document.getElementById('freq-display').classList.remove('locked');
    document.getElementById('status-text').textContent = 'STANDBY — NO SIGNAL';
    document.getElementById('status-dot').classList.remove('live');
    ST.curSigId = null;
    ST.curFragText = null;
    showStatic();
    setVol(ST.staticOn ? 0.3 : 0);
    return;
  }

  const { sig } = m;

  if (sig.dayUnlock > ST.day) {
    showStatic('... signal detected ... not yet active ...');
    ST.curSigId = null;
    return;
  }
  if (sig.silentAfter && ST.day > sig.silentAfter) {
    showStatic('... ' + sig.name + ' — signal lost day ' + sig.silentAfter + ' ...');
    ST.curSigId = null;
    return;
  }

  // Discover new source
  if (!ST.discovered[sig.id]) {
    ST.discovered[sig.id] = true;
    updateKnown();
  }

  document.getElementById('freq-display').classList.add('locked');
  document.getElementById('status-text').textContent = 'LOCKED — ' + sig.source;
  document.getElementById('status-dot').classList.add('live');

  const fr = getFragment(sig);
  if (!fr) {
    showStatic('... ' + sig.name + ' — no transmission on day ' + ST.day + ' ...');
    return;
  }

  // Apply degradation for Yusra late-game
  let txt = fr.text;
  if (sig.id === 'yusra' && sig.degradeAfter && ST.day > sig.degradeAfter) {
    txt = degradeText(txt, (ST.day - sig.degradeAfter) / 18);
  }

  ST.curSigId    = sig.id;
  ST.curFragText = fr.text; // store original for logging

  showTx(sig, txt, isLogged(sig.id, fr.text));
  setVol(ST.staticOn ? 0.04 : 0);
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
  document.getElementById('transmission-box').innerHTML =
    '<span class="static-text">' + (msg || '... no signal ... adjust frequency ...') + '</span>';
  document.getElementById('transmission-box').classList.remove('secret-active');
  document.getElementById('log-row').style.display = 'none';
}

function showTx(sig, text, already) {
  clearTimeout(twTimer);
  const box = document.getElementById('transmission-box');
  box.classList.toggle('secret-active', !!sig.isSecret);
  box.innerHTML =
    '<span class="source-tag ' + sig.css + '">' +
    sig.source + (ST.ng ? ' [NG+]' : '') +
    '</span><span class="tx-text"></span><span class="cursor-blink"></span>';

  const tx  = box.querySelector('.tx-text');
  const cur = box.querySelector('.cursor-blink');
  let i = 0;
  const spd = text.length > 300 ? 16 : 25;

  function type() {
    if (i < text.length) {
      tx.textContent += text[i++];
      twTimer = setTimeout(type, 1000 / spd);
    } else {
      cur.style.display = 'none';
    }
  }
  type();

  const lr = document.getElementById('log-row');
  const lb = document.getElementById('log-btn');
  const li = document.getElementById('logged-indicator');
  lr.style.display = 'flex';
  if (already) {
    lb.style.display = 'none';
    li.textContent   = '[ ALREADY LOGGED ]';
  } else {
    lb.style.display = '';
    li.textContent   = '';
  }
}

// ============================================================
// LOGGING
// ============================================================
function logCurrentFragment() {
  if (!ST.curSigId || !ST.curFragText) return;
  const sig = Object.values(SIG).find(s => s.id === ST.curSigId);
  if (!sig || isLogged(sig.id, ST.curFragText)) return;

  ST.logged.push({
    signalId:   sig.id,
    signalName: sig.name,
    source:     sig.source,
    css:        sig.css,
    color:      sig.color,
    isSecret:   !!sig.isSecret,
    text:       ST.curFragText,
    day:        ST.day,
    freq:       ST.currentFreq,
    refs:       sig.refs || [],
    run:        ST.run,
  });

  saveState();
  document.getElementById('log-btn').style.display = 'none';
  document.getElementById('logged-indicator').textContent = '[ LOGGED ]';
  updateArchiveCount();
  updateStats();
  updateEnding();
  // Show NG+ button once any ending is reachable
  if (getEndingId()) document.getElementById('ng-btn').style.display = '';
}

// ============================================================
// KNOWN SIGNALS SIDEBAR
// ============================================================
function updateKnown() {
  const c     = document.getElementById('known-signals-list');
  const found = Object.values(SIG).filter(s => ST.discovered[s.id]);

  if (!found.length) {
    c.innerHTML = '<div style="font-size:11px;color:var(--text-dim);">Scan the dial to discover signals.</div>';
    return;
  }

  c.innerHTML = found.map(sig => {
    const k      = Object.keys(SIG).find(k => SIG[k].id === sig.id);
    const fd     = (parseInt(k) / 10).toFixed(1);
    const frags  = ST.ng && sig.ngFragments && sig.ngFragments.length
      ? sig.ngFragments
      : sig.fragments || [];
    const total  = sig.isBeacon ? 5 : frags.length;
    const logd   = ST.logged.filter(f => f.signalId === sig.id).length;
    const fr     = getFragment(sig);
    const hasNew = fr && !isLogged(sig.id, fr.text);
    const isTuned = ST.curSigId === sig.id;

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
  document.getElementById('dial').value = fi;
  onDialMove(fi);
}

// ============================================================
// ADVANCE DAY
// ============================================================
function advanceDay() {
  ST.day++;
  ['day-display', 'status-day', 'stat-days'].forEach(
    id => (document.getElementById(id).textContent = ST.day)
  );
  if (ST.currentFreq) onDialMove(Math.round(ST.currentFreq * 10));
  updateKnown();
  updateEnding();
  saveState();
}

// ============================================================
// STATS
// ============================================================
function updateStats() {
  document.getElementById('stat-logged').textContent  = ST.logged.length;
  document.getElementById('stat-sources').textContent = Object.keys(ST.discovered).length;
  document.getElementById('stat-days').textContent    = ST.day;
  document.getElementById('stat-run').textContent     = ST.run;
  document.getElementById('status-run').textContent   = ST.run;
  updateArchiveCount();
  updateJournalCount();
}

function updateArchiveCount() {
  const c = ST.logged.length;
  document.getElementById('archive-count').textContent = c > 0 ? '(' + c + ')' : '';
}

function updateJournalCount() {
  document.getElementById('journal-count').textContent = JOURNAL.length > 0 ? '(' + JOURNAL.length + ')' : '';
}

// ============================================================
// ARCHIVE
// ============================================================
function setView(v) {
  archView = v;
  document.getElementById('vg').classList.toggle('active', v === 'grid');
  document.getElementById('vt').classList.toggle('active', v === 'timeline');
  document.getElementById('archive-grid').style.display     = v === 'grid'     ? 'grid'  : 'none';
  document.getElementById('archive-timeline').style.display = v === 'timeline' ? 'block' : 'none';
  renderArchive();
}

function filterArchive(f) {
  archFilter = f;
  document.querySelectorAll('.filter-btn').forEach(b =>
    b.classList.toggle(
      'active',
      (f === 'all' && b.textContent.trim() === 'ALL') || b.dataset.filter === f
    )
  );
  renderArchive();
}

function renderArchive() {
  const frags = archFilter === 'all'
    ? ST.logged
    : ST.logged.filter(f => f.signalId === archFilter);

  // Rebuild source filter buttons
  const fb   = document.getElementById('filter-bar');
  const srcs = [...new Set(ST.logged.map(f => f.signalId))];
  fb.innerHTML =
    '<button class="filter-btn ' + (archFilter === 'all' ? 'active' : '') +
    '" onclick="filterArchive(\'all\')">ALL</button>' +
    srcs.map(id => {
      const f = ST.logged.find(x => x.signalId === id);
      return (
        '<button class="filter-btn ' + (archFilter === id ? 'active' : '') +
        '" data-filter="' + id + '" onclick="filterArchive(\'' + id + '\')">' +
        f.source.split('/')[0].trim() +
        '</button>'
      );
    }).join('');

  if (archView === 'grid') renderGrid(frags);
  else renderTimeline(frags);
}

function renderGrid(frags) {
  const g = document.getElementById('archive-grid');
  if (!frags.length) {
    g.innerHTML = '<div class="empty-archive">No transmissions logged.<br>Return to the radio. Scan the dial.</div>';
    return;
  }
  g.innerHTML = frags.map(f =>
    '<div class="archive-card ' + (f.isSecret ? 'secret-card' : '') + '">' +
    '<div class="arc-source ' + f.css + '">' + f.source +
    (f.run > 1 ? ' <span style="color:var(--text-dim)">[RUN ' + f.run + ']</span>' : '') + '</div>' +
    '<div class="arc-freq">' + f.freq.toFixed(1) + ' MHz &mdash; Day ' + f.day + '</div>' +
    '<div class="arc-text">&ldquo;' + f.text.substring(0, 220) + (f.text.length > 220 ? '...' : '') + '&rdquo;</div>' +
    (f.refs && f.refs.length ? '<div class="arc-refs">&#8627; cross-refs: ' + f.refs.join(', ') + '</div>' : '') +
    '</div>'
  ).join('');
}

function renderTimeline(frags) {
  const tl = document.getElementById('archive-timeline');
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
    byDay[d].map(f =>
      '<div class="tl-entry">' +
      '<div class="tl-dot" style="background:' + f.color + '"></div>' +
      '<div>' +
      '<div class="tl-source ' + f.css + '">' + f.source + '</div>' +
      '<div class="tl-text">&ldquo;' + f.text.substring(0, 160) + (f.text.length > 160 ? '...' : '') + '&rdquo;</div>' +
      '</div></div>'
    ).join('') +
    '</div>'
  ).join('');
}

// ============================================================
// ENDINGS
// ============================================================
function getEndingId() {
  const L   = ST.logged;
  const has = id => L.some(f => f.signalId === id);
  const cnt = id => L.filter(f => f.signalId === id).length;

  if (ST.ng && has('twins') && has('shan') && cnt('yusra') >= 2 && cnt('mara') >= 2)
    return 'ng_complete';
  if (has('shan') && cnt('shan') >= 2)
    return 'secret';
  if (has('yusra') && cnt('yusra') >= 3 && has('mara'))
    return 'conspiracy';
  if (has('osei') && has('twins') && !has('yusra'))
    return 'acceptance';
  if ((has('yusra') && has('mara') && has('osei')) || L.length >= 3)
    return 'ambiguous';
  if (has('beacon') && L.length === 1)
    return 'beacon_only';
  return null;
}

function updateEnding() {
  const eid  = getEndingId();
  const cont = document.getElementById('ending-content');

  if (!eid) {
    cont.innerHTML =
      '<div class="ending-locked">' +
      '<div style="font-family:var(--display);font-size:28px;color:var(--text-dim);letter-spacing:4px;margin-bottom:16px;">NO CONCLUSION</div>' +
      '<div style="font-size:12px;line-height:2.2;">You haven\'t logged enough transmissions.<br>Return to the radio. Keep scanning.</div>' +
      '</div>';
    return;
  }

  if (!ST.achieved.includes(eid)) ST.achieved.push(eid);

  const e      = ENDINGS[eid];
  const allIds = Object.keys(ENDINGS);

  cont.innerHTML =
    '<div style="margin-bottom:16px;">' +
    '<div style="font-size:10px;color:var(--text-dim);letter-spacing:2px;margin-bottom:10px;">' +
    'ENDINGS DISCOVERED — ' + ST.achieved.length + '/' + allIds.length + '</div>' +
    '<div class="endings-grid">' +
    allIds.map(id => {
      const ae = ST.achieved.includes(id);
      const cur = id === eid;
      const en  = ENDINGS[id];
      return (
        '<div class="ending-mini ' + (ae ? 'achieved ' : '') + (cur ? 'current-run' : '') + '">' +
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
    'FRAGMENTS: ' + ST.logged.length + ' // SOURCES: ' + Object.keys(ST.discovered).length + '/6 // ' +
    'DAYS: ' + ST.day + ' // RUN: ' + ST.run +
    '</div></div>' +
    '<div style="text-align:center;margin-top:14px;display:flex;gap:10px;justify-content:center;">' +
    '<button class="btn" onclick="switchTab(\'archive\')">[ VIEW ARCHIVE ]</button>' +
    '<button class="btn danger" onclick="showNGConfirm()">[ NEW GAME+ ]</button>' +
    '</div>';
}

// ============================================================
// JOURNAL
// ============================================================
function renderJournal() {
  const g = document.getElementById('journal-grid');
  if (!JOURNAL.length) {
    g.innerHTML =
      '<div class="journal-empty">No completed runs yet.<br>Reach a conclusion, then start New Game+.<br>' +
      '<span style="color:var(--text-dim)">Each playthrough is preserved here permanently.</span></div>';
    return;
  }

  g.innerHTML = JOURNAL.map(run => {
    const e     = run.endingId ? ENDINGS[run.endingId] : null;
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
      '<div class="journal-notes">' + notes.join('<br>') + '</div>' +
      '</div>'
    );
  }).join('');
}

// ============================================================
// NEW GAME+
// ============================================================
function showNGConfirm() {
  document.getElementById('ng-confirm').classList.add('show');
}

function confirmNewGame() {
  document.getElementById('ng-confirm').classList.remove('show');

  // Archive this run to the journal
  JOURNAL.push({
    run:     ST.run,
    ng:      ST.ng,
    day:     ST.day,
    endingId: getEndingId(),
    frags:   ST.logged.length,
    sources: Object.keys(ST.discovered).length,
    mara:    ST.logged.some(f => f.signalId === 'mara'),
    osei:    ST.logged.some(f => f.signalId === 'osei'),
    yusra:   ST.logged.some(f => f.signalId === 'yusra'),
    twins:   ST.logged.some(f => f.signalId === 'twins'),
    shan:    ST.logged.some(f => f.signalId === 'shan'),
  });

  // Carry over audio nodes and achievements; reset everything else
  const prev = [...ST.achieved];
  const ac   = ST.audioCtx;
  const gn   = ST.gainNode;
  const newRun = ST.run + 1;

  ST = {
    day: 1,
    currentFreq: 88.0,
    discovered: {},
    logged: [],
    curSigId: null,
    curFragText: null,
    staticOn: ST.staticOn,
    audioCtx: ac,
    gainNode: gn,
    run: newRun,
    ng: true,
    achieved: prev,
  };

  // Reset UI elements
  document.getElementById('day-display').textContent  = 1;
  document.getElementById('status-day').textContent   = 1;
  document.getElementById('freq-display').textContent = '88.0';
  document.getElementById('dial').value               = 880;
  document.getElementById('ng-badge').style.display   = '';
  document.getElementById('ng-btn').style.display     = 'none';

  showStatic();
  document.getElementById('log-row').style.display = 'none';
  updateKnown();
  updateStats();
  updateEnding();
  renderJournal();
  switchTab('radio');
  saveState();
}

// ============================================================
// TABS
// ============================================================
function switchTab(name) {
  const tabs = ['radio', 'archive', 'ending', 'journal'];
  document.querySelectorAll('.tab').forEach((t, i) =>
    t.classList.toggle('active', tabs[i] === name)
  );
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById('screen-' + name).classList.add('active');
  if (name === 'archive') renderArchive();
  if (name === 'ending')  updateEnding();
  if (name === 'journal') renderJournal();
}

// ============================================================
// SAVE / LOAD
// ============================================================
function saveState() {
  try {
    localStorage.setItem('ds_v3', JSON.stringify({
      ST: {
        day:      ST.day,
        discovered: ST.discovered,
        logged:   ST.logged,
        run:      ST.run,
        ng:       ST.ng,
        achieved: ST.achieved,
      },
      JOURNAL,
    }));
  } catch (e) {}
}

function loadSave() {
  try {
    const raw = localStorage.getItem('ds_v3');
    if (!raw) return false;
    const saved = JSON.parse(raw);
    Object.assign(ST, saved.ST);
    JOURNAL = saved.JOURNAL || [];
    document.getElementById('day-display').textContent = ST.day;
    document.getElementById('status-day').textContent  = ST.day;
    if (ST.ng) document.getElementById('ng-badge').style.display = '';
    if (getEndingId()) document.getElementById('ng-btn').style.display = '';
    updateKnown();
    updateStats();
    updateEnding();
    renderJournal();
    return true;
  } catch (e) {
    return false;
  }
}

// ============================================================
// INTRO / START
// ============================================================
function startGame(cont) {
  initAudio();
  const intro = document.getElementById('intro');
  intro.style.opacity    = '0';
  intro.style.transition = 'opacity 0.8s';
  setTimeout(() => (intro.style.display = 'none'), 800);
  if (cont) loadSave();
}

// Check for existing save on page load — show Continue button if found
window.addEventListener('load', () => {
  try {
    const raw = localStorage.getItem('ds_v3');
    if (raw) {
      const s = JSON.parse(raw);
      document.getElementById('continue-btn').style.display = '';
      document.getElementById('intro-save-note').textContent =
        'Save found — Run ' + s.ST.run + ', Day ' + s.ST.day + ', ' + s.ST.logged.length + ' fragments logged';
    }
  } catch (e) {}
});