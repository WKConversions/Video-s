# K.B. Network Intelligence — storyboard and build contract (64.4 s, 16:9, 30 fps)

## Brief (Karl, for the client K.B. Tech Partner)
- A clean, minimalist SaaS explainer in Apple-style motion design: bright background, smooth 2D animation, simple
  icons, connected flowcharts.
- The brand style of the site test.k-b.workers.dev (harvest/: screenshots, CSS tokens, logo, fonts).
- Explain the K.B. Network Intelligence system **layer by layer** (brand/pipeline.pdf, rendered at
  brand/page-1.png): how information flows between AI agents, databases, management approvals and outreach.
- Follow the supplied voice-over exactly (vo/vo.mp3, 61.3 s; word times in film/src/words.json as "w:…" labels).
- Smooth, professional, easy to understand, visually consistent throughout.

## Thesis
"Information becomes opportunity, one approved layer at a time." The film is one connected flowchart: the PDF's
seven layers and four management gates. It is shown as an overview map (`PipelineMap`) at three moments: "Here's how
it works", "Management reviews each stage", and the closing loop. Between them, close-ups explain each layer: the
camera pushes into a layer and its nodes do what the voice says. Packets of information travel along flow lines;
AI agents glow cyan while they work; management gates are navy and approve with a check.

Allowed patterns: flow lines with travelling packets; white cards (radius 24, hairline border, soft navy shadow);
the three node kinds from the PDF's legend (AI agent = cyan spark tile; tool or data = mist tile, slate icon;
management gate = navy `GateBadge`); count-ups and type-ons for UI text; a push-in camera into a layer and a pull-back
to the map; the two-tone statement (ink + slate) for the few captions.
Not allowed: gradients beyond the brand navy gradient and the soft ground haze; glows other than the agent's soft cyan
ring; bounce or elastic (POP only for small chips, dots and checks); 3D spins; dark backgrounds; orange (the PDF's gate
colour is not in the brand, so the gates are navy); third-party logos (tool names as plain text only); stock photos.

## Look (src/lib.tsx, measured from the site)
- **Ground:** off-white #FCFCFA with a slow navy and cyan haze (`Ground`, drawn by Story.tsx; never cover it with a flat
  colour).
- **Colour:**
  - Ink #172C43 for text.
  - Navy gradient #344A65 → #3F5878 for the logo tile, layer number tiles and gates.
  - Slate #3F607D for the second phrase of a statement; muted #55677A and #698096 for sub lines.
  - Hairline #DCE4E9; mist #EEF2F5 for UI fills.
  - One accent, cyan #218AB3 (light #66B8DB, tint #E6F3F9): AI only (agents, AI output packets, the feedback loop).
  - Green #2E9E6B only for a success state (sent, replied), sparingly.
- **Type:** Montserrat (variable): 600 with tracking −0.05em for statements, 600/500 for UI. UI text in focus is at
  least 22 px on screen. The logo "K.B" is Copperplate (`KBMark`, or `KBLogoImg` for the supplied PNG).
- **Captions:** SaaS rhythm, only on these lines:
  - A: "Everyday information. / Real business opportunities." (two-tone);
  - G: an "Example" eyebrow, optional;
  - H: the end card.
  - Everything else is told by the picture and UI labels.

## Kit (src/shared.tsx; read it once)
- **Timing:** `k`, `f`, `kf`, `typed`.
- **Type and logo:** `Say` (centred two-tone statement, words on their labels, `br` for a new line), `KBMark`
  (p 0..1 builds the tile, then K . B), `KBLogoImg`.
- **Icons:** `Ico` (see `P` for the names).
- **Surfaces:** `CARD`, `CARD_BIG`, `Chip` (outline, soft, navy, cyan, ok).
- **Pipeline pieces:**
  - `LayerTag` (the close-ups' layer marker, top-left at 120, 92);
  - `NodeCard` (agent or tool; `glow` while working);
  - `GateBadge` (gate n; `approved` 0..1; `showQ` for its question);
  - `Flow` (a line drawn 0..1 with travelling packets) and `Packet`;
  - `CoreNode` (the knowledge base, fill 0..1);
  - `SummaryCard` (Claude's structured summary, p 0..1 types it);
  - `OppCard` with `OPPS` and `OPP` (the four scored opportunities);
  - `PipelineMap` (the overview: rows, gates, approved, dim, glow, loop) with `MAP`, `mapRowY`, `mapGateY`,
    `mapNodeX`, and `MapLegend`;
  - `Cursor` (management's pointer, for approvals).
- **Ground:** `Ground` (Story draws it).

Never edit shared.tsx, lib.tsx, clock.ts, Story.tsx or other scenes. Write local helpers in your scene file.

## Facts (brand/pipeline.pdf); show them truthfully
- **The seven layers:**
  1. Capture (raw inputs): Wispr Flow (voice notes, dictation), Transcriptions (calls and meetings), Contracts and docs
     (proposals, retros), Slack and email (threads, follow-ups).
  2. Process: the Claude summariser (summary, people, asks, offers, next steps).
  3. Knowledge core (the single source of truth): the Documentation agent (Confluence, PayloadCMS) syncs with the
     Ecosystem agent (KB Customers, client portal).
  4. Intelligence (reads the core plus the outside world): External data (trends, news, funding, hiring signals) and
     the Opportunity agent (spots synergies, scores them). It is read-only: it reads documentation, ecosystem and
     client portal but never writes to them.
  5. Specialist agents (one purpose each): Venture studio (new businesses), Partnership (partner to partner), Upsell
     (existing clients), Referral (who refers whom), Investor match (partner to investor).
  6. Outreach router (segment by audience):
     - Investors: formal, from Robin; email, one-pager, warm intro.
     - Clients: account context; email, client portal.
     - Partners: informal, fast; WhatsApp, Slack.
     - Referrals and leads: intro-led; LinkedIn, email.
  7. Send and track: send, log replies. Outcomes return to layer 3.
- **The four gates:**
  - Gate 1, Summary review: accurate and complete? Approve, correct or discard.
  - Gate 2, Opportunity triage: worth pursuing? Approve, park or kill, then route to an agent.
  - Gate 3, Action approval: right person, right offer, right timing?
  - Gate 4, Message approval: edit or approve each draft before it sends.
  - Gates 1–3 are batched into a daily or weekly Slack digest for management. Gate 4 runs per message.
- **Example data:**
  - Names, companies, scores and messages are illustrative (e.g. "Sarah Lee", a client opening a second location).
  - No real client names, no numbers presented as results, no URLs.

## Words (seconds)
- **Hook:** kb .07, network .36, intelligence .74, turns 2.44, everyday 2.72, information 3.20, into 3.88, real 4.32,
  business 4.80, opportunities 5.20 | heres 6.63, how 6.84, works 7.08.
- **Capture:** first 7.98, conversations 8.70, meetings 9.82, emails 10.54, documents 11.18, collected 11.94.
- **Process:** claude 13.00, processes 13.30, information2 14.10, structured 14.96, summaries 15.40 | once 16.66, approved
  16.80.
- **Knowledge core:** everything 17.76, stored 18.28, central 18.88, knowledge 19.22, base 19.64 | connected 20.30, kbs
  20.90, client 21.36, ecosystem 21.64.
- **Intelligence:** ai 22.93, analyzes 23.60, knowledge2 24.54, alongside 24.88, external 25.34, data 26.06 | identifying
  26.89, potential 27.30, partnerships 27.82, referrals 28.88, investments 29.72, and2 30.73, opportunities2 30.90,
  within 31.52, existing 32.04, clients 32.62.
- **Specialists:** specialized 33.75, agents 34.34, develop 34.68, opportunities3 35.42, actionable 36.40, proposals 37.02.
- **Management and outreach:** management 38.31, reviews 38.56, each 39.06, stage 39.54, before 39.94, personalized
  40.32, outreach 40.98, prepared 41.68, approved2 42.46, sent 43.21, tracked 43.94.
- **Example:** for 44.91, example 45.00, when 45.84, client2 46.04, mentions 46.30, launching 46.72, new 47.30, business2
  47.40, system2 48.29, recognize 48.90, potential2 49.38, needs 49.76, identify 50.73, relevant 51.14, connections
  51.54, suggest 52.70, next 53.34, steps 53.50.
- **Loop:** every 54.49, outcome 54.72, feeds 55.18, back 55.60, knowledge3 56.34, base2 56.60, continuously 57.25,
  improving 57.80, information3 58.64, available 59.10, future 60.00, decisions 60.32. End 64.4.

## Scenes and hand-offs (frames; labels in src/clock.ts)
| Scene | Span | Builder |
|---|---|---|
| A, hook + map | 0 → s1 (230) | 1 |
| B, capture + Claude | s1 → sB (492) | 2 |
| C, gate 1 + knowledge core + ecosystem | sB → s2 (679) | 2 |
| D, intelligence + opportunities | s2 → sD (1005) | 3 |
| E, gate 2 + specialist agents + proposals → map | sD → s3 (1142) | 3 |
| F, management gates + outreach | s3 → s4 (1340) | 4 |
| G, the example | s4 → s5 (1627) | 4 |
| H, the loop + end card | s5 → end (1933) | 1 |

Each scene draws only within its span: from its first frame through its last frame inclusive. The hand-off frame is
drawn identically by both scenes, so the outgoing scene may draw it, the incoming scene must, and either way the
frame is the same. All times are written as labels (`f("s2")`, `k(g, "w:ai+0.2", 0.5)`), never as frame numbers.

Hand-off states (exact, at camera identity, on the `Ground`):
- **s1 (A → B):** `<PipelineMap g={g} />` (all defaults: built, gates shown unapproved, packets on) and
  `<MapLegend x={120} y={1000} />`.
- **sB (B → C):** `<LayerTag n={2} />` and `<SummaryCard x={960} y={560} p={1} />`, and nothing else.
- **s2 (C → D):** `<LayerTag n={3} />` and `<CoreNode x={960} y={560} fill={1} />`, and nothing else.
- **sD (D → E):** `<LayerTag n={4} />` and the four `<OppCard i={i} x={OPP.xs[i]} y={OPP.y} p={1} />`, and nothing
  else.
- **s3 (E → F):** `<PipelineMap g={g} approved={[1, 1, 0, 0]} dim={[0, 0, 0, 0, 0, 1, 1]} />`, and nothing else.
- **s4 (F → G):** a navy dot `<Packet x={960} y={540} r={14} color={C.navy} />` alone.
- **s5 (G → H):** a navy dot `<Packet x={960} y={540} r={14} color={C.navy} />` alone.

## The film, phrase by phrase (ideas, not layouts: compose each beat as a strong still first)

### A (0–7.7): "K.B. Network Intelligence is a system that turns everyday information into real business opportunities." "Here's how it works."
- **0.0–2.4:**
  - `KBMark` builds at centre (about 220 px) on "K.B.".
  - "Network Intelligence" sets beside or under it in Montserrat 600 on "network intelligence".
  - A soft cyan ring breathes behind the mark ("intelligence").
- **2.4–6.1, the statement and its proof:**
  - The logo lockup moves up and shrinks.
  - "Everyday information." builds on "everyday information": small grey icon chips (chat, calendar, mail, doc,
    mic) drift in from the edges as everyday fragments.
  - On "into" they stream into a single line or node.
  - On "real business opportunities" the line resolves into cyan opportunity chips or `OppCard`-like pills, and the
    statement's second line "Real business opportunities." builds in slate.
  - Input → system → output in one picture.
- **6.6–7.7, "Here's how it works":**
  - The statement leaves, and the flow line becomes the map's spine.
  - The `PipelineMap` builds layer by layer, top to bottom (rows 1→7, gates appearing between them).
  - The `MapLegend` fades in.
  - Fully built and calm at s1.

### B (7.7–16.4): capture → Claude
- **s1 → "first":**
  - The camera pushes into layer 1 of the map; the map fades as the close-up takes over.
  - `LayerTag n=1` comes in.
- **"conversations" / "meetings" / "emails" / "documents":** one source each, on its word, as `NodeCard kind="tool"`:
  - Conversations: Wispr Flow, voice notes;
  - Meetings: Transcriptions;
  - Emails: Slack, email;
  - Documents: contracts and docs.
  - Each one emits information packets: a voice waveform, a transcript line, an email, a doc.
- **"are collected":** all the packets stream down into one funnel or line.
- **"Claude processes this information into structured summaries":**
  - `LayerTag` → 2.
  - The Claude summariser agent (`NodeCard kind="agent" glow`) receives the stream.
  - On "structured summaries" the `SummaryCard` types out (p 0→1), rows filling.
  - Hand-off sB: the summary card at centre, complete.

### C (16.4–22.6): gate 1 → knowledge core → ecosystem
- **"Once approved":**
  - `GateBadge n=1` with its question; management approves it (a `Cursor` click, or a check).
  - The badge turns navy "Approved"; the summary passes the gate (a gate line it crosses).
- **"everything is stored in a central knowledge base":**
  - `LayerTag` → 3.
  - The summary card shrinks and drops into the `CoreNode`, and its fill grows.
  - Other summaries stream in too ("everything").
- **"connected to K.B.'s client ecosystem":**
  - The Ecosystem agent and client nodes (KB Customers, client portal, a ring of client avatars or company tiles)
    connect to the core with sync lines (⇄).
  - Before s2 the ecosystem folds back, leaving the core alone at centre.

### D (22.6–33.5): intelligence → opportunities
- **"AI then analyzes this knowledge":**
  - `LayerTag` → 4.
  - The Opportunity agent (`NodeCard kind="agent" glow`) reads the core: a dashed read-only line with an eye icon
    ("read-only").
- **"alongside external data":** External data (trends, news, funding, hiring signals) streams in from the right as
  small signal chips.
- **"identifying potential partnerships, referrals, investments, and opportunities within existing clients":**
  - One `OppCard` per word, scored (count-up), sliding into the row at `OPP.xs`.
  - The fourth one ("Existing client") lands on "within existing clients".
  - Hand-off sD: the four cards in their row.

### E (33.5–38.1): gate 2 → specialist agents → proposals → the map
- **sD → "specialized":** Gate 2 (Opportunity triage) sweeps across the cards, approving them (checks).
- **"Specialized agents develop these opportunities":**
  - `LayerTag` → 5.
  - Each card routes to its specialist agent (Partnership, Referral, Investor match, Upsell; Venture studio is
    shown too, idle, used later in G).
  - The agents glow while working.
- **"into actionable proposals":** each agent outputs a proposal card (a document: title, "Proposed action", the
  right person, timing).
- **Pull back to the map:**
  - From about 37.4 s the camera pulls back to the `PipelineMap` (approved gates 1 and 2, layers 6–7 dimmed).
  - Exact at s3.

### F (38.1–44.7): management reviews each stage → outreach prepared, approved, sent, tracked
- **"Management reviews each stage":**
  - On the map, the four gates light up one by one on "management", "reviews", "each" and "stage" (approved 0→1
    for 3 and 4; gates 1 and 2 pulse again).
  - A small note may slide in: "Gates 1–3: daily or weekly digest in Slack · Gate 4: every message".
- **"before personalized outreach":** the camera pushes into layers 6–7, and `LayerTag` → 6.
- **"is prepared":**
  - The outreach router segments by audience (Investors, Clients, Partners, Referrals and leads) and picks the
    channel.
  - A personalised draft types out (to a partner, an informal short message, for instance).
- **"approved":** `GateBadge n=4` (Message approval) approves it.
- **"sent":** the message flies along its channel; `LayerTag` → 7.
- **"and tracked":**
  - A tracking row runs: Sent → Opened → Replied (a green check), logged.
  - Before s4 everything collapses into the navy dot at centre.

### G (44.7–54.2): the example
- **"For example":**
  - The dot opens into a conversation: an `Example` eyebrow, and a client's transcript or chat bubble.
- **"when a client mentions launching a new business":** the words "launching a new business" highlight in the bubble
  as it is said.
- **"the system can recognize potential needs":** need chips appear out of the highlight (for example Brand and
  website, Software, Funding, Office space). These are illustrative.
- **"identify relevant connections":**
  - A small network from the knowledge base and ecosystem lights up: a partner, an investor and an existing client
    connect to the client.
  - The Venture studio agent glows.
- **"and suggest the next steps":**
  - A next-steps card checks in step by step, for example:
    1. Venture studio intro;
    2. Introduce partner;
    3. Investor warm intro.
- **Before s5:** it all collapses into the navy dot at centre.

### H (54.2–64.4): the loop → end card
- **"Every outcome feeds back into the knowledge base":**
  - The dot is the outcome. The `PipelineMap` builds around it (fast), and the dot sits at layer 7.
  - It travels the feedback loop (`loop` 0→1) up the right side into layer 3's knowledge base, which glows.
- **"continuously improving the information available for future decisions":**
  - The loop keeps cycling; packets flow down the spine again.
  - The knowledge base fills or brightens (improving).
  - Every gate shows approved.
- **About 60.5 → end:**
  - The map pulls back and dissolves into the end card: `KBMark` (or the logo) with "Network Intelligence", and the
    line "From everyday information to real opportunities." in slate.
  - Calm hold with the ground haze drifting, until 64.4.

## Motion
- **Signature curve:** ARRIVE for entrances, MOVE for carries and camera, SNAP for UI states, POP only for small
  chips, dots and checks.
- **Camera:** push-ins and pull-backs only, as scale and translate on a world layer, always with MOVE. No spins, no
  shakes.
- **Packets:** navy for information, cyan for AI output. Keep the frame alive with flow (packets on lines, agents
  breathing), never with random wiggle.
- **Targets (`scripts/clipcheck.py` on your draft):**
  - moving in 97%+ of frames;
  - typical change about 4–6% of the frame;
  - longest still 0.3 s (H's end card exempt after 62.5 s);
  - every phrase "ok";
  - no text collisions, generous whitespace, nothing off-palette;
  - `npx tsc --noEmit` clean.

## Workflow
- Work only in your folder /home/user/Video-s/films/kb/work/<id>/ (a full copy of film/; node_modules and public are
  hardlinked, so never write into them). Edit only your scene files.
- Stills: `node stills.mjs <frames> 1` → out/test/fNNNN.png. Batch 6–10 frames and Read them.
- Draft: `bash ../../scripts/draft.sh <first> <last> out/draft.mp4`, then
  `python3 ../../scripts/clipcheck.py out/draft.mp4 <first> ../../vo/words.json`.
- Keep CSS blur at 12 px or less. A frame renders in under about 1.5 s.
