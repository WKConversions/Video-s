# TNOA, version 2: storyboard and build contract (20 s, 16:9, 1920x1080, 60 fps, no voice-over)

## Karl's feedback on version 1 (read first)
> "i want way more visuals, now its like 4 scenes or something. i want more visuals, more explaining, more
> showcasing, more visualisation and higher motion norm, better transitions, apple like transitions and heavy apple
> animations." Earlier: "background of apple style videos normally aren't this moving. Keep it simple minimalistic
> apple style with no statics and as high as possible motion norm." And: Apple is sound-effect dominant.

So version 2 is about twelve shots in 20 s (one every 1.5-1.8 s), each showing one thing TNOA does, joined by
Apple-style transitions, with heavy Apple animation (springs that overshoot and settle, 3D card turns, morphs, glass,
the Dynamic Island, notification stacks, bento grids, cover flow, odometers, iOS switches, liquid joins). Version 1
is archived in `plan/v1-Story.tsx`; don't reuse its shots as they were.

## The look
- **Background:** plain #F4F7FB and still. Never animate the background itself (no moving grids, no drifting
  textures). Colour fields (blue #2563EB, navy #0B1220) are allowed, but only when they grow out of an object (a
  tile floods the frame, an iris opens from a button).
- **Brand:** the kit's `B` colours only; DM Sans (700 for headlines, letter-spacing -0.035em; 500/600 for UI); mono
  only for the terminal line. White cards with the hairline #E2E8F1 and the kit `SHADOW`. Status green for done,
  amber for human review.
- **Few, big things:** at most about four separate things on screen. The subject of each shot is big. The type must
  read on a phone: headlines 90-160 px, UI text 26 px or more.
- **Truth:** every word, number and name comes from the site (the facts list below). Nothing invented. No logos: tool
  names are text chips.

## Motion
- **Motion norm: as high as possible, target 7%.** The measure is the median share of the frame that changes between
  consecutive frames at 60 fps (`motion_check.py`). Version 1 reached 2% with a still background. Raise it with the
  FOREGROUND only:
  - big elements (25-60% of the frame) always moving, at 2 px or more per frame (120+ px/s), through 3D turns,
    floats, slides, rolls and morphs;
  - a transition every 1.2-1.8 s;
  - textured content (type, UI rows, numbers) moving, not flat shapes.
- **No still frames, ever:** something big moves in every frame, including inside the hand-off windows.
- **Apple transitions (vary them; never the same one twice in a row):**
  - icon-to-app open (a small node or icon grows into a full app card);
  - card expand (App Store "Today" card, a row grows into its own screen);
  - colour flood or iris from an object;
  - capsule morph (Dynamic Island opens into content, or content shrinks into it);
  - cover-flow flick;
  - push with momentum (outgoing and incoming speed-matched, with motion blur feel through speed);
  - liquid join;
  - a 3D card flip (at most once in the film).
- **Heavy Apple animation:**
  - `bounce`/`spring` from the kit on everything that lands, pops, snaps or opens;
  - staggered letter builds (`BounceWords`);
  - 3D perspective turns on cards;
  - squash on fast landings;
  - odometer and roll numbers;
  - iOS switches;
  - notification stacks that push each other down;
  - glass (`Glass`) over moving content.
- **Positioning:** with transforms on static boxes (translate/scale/rotate), never animated left/top/width/height
  (they snap to whole pixels and shake). For a growing rounded box, use clip-path inset(... round r) on a static box,
  or scale. Slow-moving text gets `willChange: "transform"` ONLY if it never scales up afterwards.

## Facts (from thenetworkofagents.com; use these words)
- **Name:** TNOA, The Network of Agents. "Production-Ready AI Agents".
- **Headline:** "Deploy AI agents that deliver, backed by the engineers who built them."
- **Proof:** "Every agent in the TNOA network is already proven in production, and a vetted engineer stays accountable
  for keeping it working in your business."
- **Agent activity panel** ("tnoa ~ agent activity"):
  - 312 Leads handled today, 96.8% Resolved without escalation, 2m 41s Avg. response time;
  - rows:
    - Qualify inbound lead — ACME Roofing | Lead Response | ✓ Routed to sales | 38s;
    - Ticket #4812 — billing question | Support Triage | ✓ Resolved | 1m 12s;
    - Invoice #2207 — 14 days overdue | Collections | ✓ Reminder sent | 22s;
    - Proposal draft — discovery call | Proposals | ⚠ Human review | 4m 03s.
- **Three steps:**
  1. "Tell us what's broken": share the workflow that's costing you time and money;
  2. "Get matched with a working agent": an agent that already works, and the engineer who built it stays involved;
  3. "Deploy with accountability": every agent is backed by a vetted engineer who stays accountable once it's live in
     production.
- **Agents (workflows):** Inbound lead response, Customer support triage, Voice agents, Invoicing & collections, Quote &
  proposal drafting, Scheduling & dispatch, Data entry & reconciliation, Reporting & insights, Content & social, Email
  marketing, Paid ads, SEO & outbound, Something custom.
- **Integrations:** Gmail & Outlook, Slack, QuickBooks & Xero, HubSpot & Salesforce, Google Sheets, Stripe, Calendars,
  Custom APIs. "No rip-and-replace. Agents plug into your existing stack, and your data stays yours."
- **Best fit:** small and mid-sized businesses losing hours every week to manual handoffs, admin and copy-paste work.
- **Platforms:** OpenClaw, Hermes (Nous Research), ChatGPT (OpenAI), Claude (Anthropic).
- **Offer:** "Book a Call — Start Your Free Audit". "Free 15-minute discovery call · Free audit & roadmap if there's a
  fit · No obligation". "Get the Free Scorecard". URL: thenetworkofagents.com.

## Segments, builders and hand-offs (kit: `src/kit.tsx`)
| Segment | File | Span (s) | Frames | Hand-off at the end |
|---|---|---|---|---|
| A | `scenes/A.tsx` | 0-5 | 0-299 | H1: `H1Card` (white card 1200x680) at 5.0 |
| B | `scenes/B.tsx` | 5-10 | 300-599 | H2: `H2Blue` (full blue frame) at 10.0 |
| C | `scenes/C.tsx` | 10-15 | 600-899 | H3: `H3Capsule` (navy capsule 640x120) at 15.0 |
| D | `scenes/D.tsx` | 15-20 | 900-1199 | the end |

Hand-off rule:
- The outgoing builder morphs INTO the hand-off component by boundary − 0.25 s and draws it as is until the boundary.
- The incoming builder draws it as is from the boundary to boundary + 0.25 s, then morphs out of it.
- The components move on their own inside the window, so the cut is never still.
- Each segment renders ONLY in its own span (Story switches at the boundaries).

## Shot list (a direction, not a cage: keep the facts, the hand-offs and the variety; improve the ideas)

### A (0-5 s): the hook and the network
1. **0.0-1.4, the headline.**
   - "Deploy AI agents" builds letter by letter (`BounceWords`, about 150 px), then "that deliver." on a second
     line, blue.
   - The full stop drops, bounces and becomes the blue hub dot.
2. **1.4-3.2, the network.**
   - The hub pushes the words away (they fly up and out, with momentum).
   - Twelve agent nodes spring out from it on two rings in 3D (the network tilts and turns, rotateX/rotateY);
     pulses run along the spokes.
   - Six nodes pop name chips with staggered bounces: Lead response, Support triage, Voice agents, Invoicing,
     Proposals, Scheduling.
3. **3.2-5.0, icon-to-app open.**
   - The camera pushes toward the "Lead response" node.
   - That node grows like an app icon opening on iPhone, into the white `H1Card`, while the rest of the network
     scatters out.

### B (5-10 s): what the agents do
4. **5.0-6.6, the activity panel.**
   - The card becomes "tnoa ~ agent activity" (navy title bar, a green "Live" dot).
   - The four rows stack in like iOS notifications, each pushing the others down, with status pills popping (✓
     green, ⚠ amber) and times ticking up to their values.
   - The panel keeps turning in 3D.
5. **6.6-8.2, card expand.**
   - The amber "Human review" row expands (App Store card expand) to fill the card.
   - An engineer avatar slides in and joins the agent icon like liquid.
   - "A vetted engineer stays accountable." bounces in.
6. **8.2-10.0, the numbers.**
   - A bento of the three numbers rises with staggered bounces, the numbers rolling up: 312, 96.8%, 2m 41s.
   - Then the blue 96.8% tile grows to flood the frame (`H2Blue`).

### C (10-15 s): how it works, three steps
7. **10.0-11.6, step 1 "Tell us what's broken".**
   - On blue, a big "1" springs in.
   - A glass message card types "Leads wait until the next morning." (a plain example of a broken workflow, framed
     as the visitor's input; keep it short).
   - The step title bounces in white.
8. **11.6-13.2, step 2 "Get matched with a working agent".**
   - Cover flow: agent cards (the workflow names from the facts) flick past in 3D.
   - One, "Inbound lead response · proven in production", snaps to the centre with a bounce, and a small engineer
     chip docks onto it.
9. **13.2-15.0, step 3 "Deploy with accountability".**
   - A giant iOS switch "Deploy" flips on with a bounce, and the status turns "Live".
   - Then everything shrinks into the navy capsule (`H3Capsule`).

### D (15-20 s): fits your stack, the offer
10. **15.0-16.6, integrations.**
    - The capsule opens like the Dynamic Island: "Plugs into your stack".
    - Tool chips fly in on arcs and dock around it (orbit with springs): Gmail & Outlook, Slack, QuickBooks & Xero,
      HubSpot & Salesforce, Google Sheets, Stripe.
    - "Your data stays yours." pops.
11. **16.6-17.8, the free audit.**
    - A scorecard card flips or slides in, and three checks tick in turn: Free 15-minute discovery call, Free audit &
      roadmap, No obligation.
12. **17.8-20.0, the end card.**
    - Navy floods from the card.
    - "TNOA." lands letter by letter (the full stop sky blue), with "The Network of Agents" under it.
    - A capsule springs open into the blue button "Book a Call — Start Your Free Audit" (press and shine).
    - "thenetworkofagents.com" under it.
    - It keeps floating to the last frame: no still end.

## Sound (Apple is sound-effect dominant)
Each builder returns a cue list for its span: one UI sound on every visible event (land, pop, snap, flip, switch,
tick, whoosh on transitions). Times are in global seconds. IDs from Karl's library:
- whooshes: gen-whoosh-short, gen-whoosh-medium, gen-whoosh-whip, gen-whoosh-deep;
- rises: gen-riser-1s, gen-swell;
- impacts: gen-impact-soft, gen-impact-deep, gen-stamp;
- taps: gen-tap, kenney-click-001, kenney-select-001, kenney-select-002;
- ticks: gen-tick, kenney-tick-004;
- pops and drops: gen-pop, kenney-drop-003;
- appear: gen-appear, kenney-maximize-009;
- success: gen-chime, gen-success, gen-shimmer.

db is relative (-14 quiet tick … -4 a hero hit); pitch is in semitones (−5..+7), so a run of pops can climb. The
music is a quiet bed under them.

## QC each builder runs on its own span (at 60 fps, full 1080p)
1. `npx tsc --noEmit`.
2. A still or two to check the look:
   `npx remotion still src/index.ts Film out/x.png --frame=<n> --props='{"blurSamples":1,"audio":"none"}' --browser-executable=$B`.
3. A render of its span:
   `npx remotion render src/index.ts Film out/seg.mp4 --frames=<a>-<b> --props='{"blurSamples":1,"audio":"none"}' --concurrency=1 --muted --crf=16 --log=error --browser-executable=$B`.
4. Motion: `python3 <skill>/scripts/motion_check.py out/seg.mp4 --profile`.
   - Report the median; the target is 7%, and higher is better.
   - No still frames at all ("still" in the profile).
   - Note: motion_check ignores the last 2 s of a clip longer than 4 s, so ALSO run it on the last 2.5 s alone.
5. Shake: `python3 /home/user/Video-s/films/creoble4/scripts/jitter_check.py out/seg.mp4` must show no SHAKE line.
6. Look at a strip of frames across the span; check the hand-off frames against the kit component.
