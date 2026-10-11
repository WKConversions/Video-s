# Concept A: "The business gets its own system"

A 40-second SaaS film for K.B, told inside a single app. The story uses the force-aligned voice-over in `../context.md`.
It runs at 1920×1080, 30 fps, about 39.6 s.

## Thesis

At the start, your business is one tab squeezed between countless tools. K.B builds it its own system: the same tools,
tasks and agents end up running inside one calm app built around "Your business", with K.B docked in its header as the
tech team.

**Allowed patterns:**
- An illustrative app whose workspace is "Your business". It stands for the viewer's own business. It is never a
  client, and it is never presented as a K.B product.
- Tool names from K.B's own pages: CRM, Support desk, Google Workspace, Slack, ClickUp, Notion, Airtable. They appear
  as text with generic line glyphs, never as those brands' logos.
- Task words from K.B's own copy: Follow-ups, Payment confirmations, CRM updates, Company outreach, Excel files,
  Approvals, Syncing data, Data routing.
- Statuses and titles in K.B's own words:
  - Connected
  - Workflows
  - Runs smoothly ("makes sure it runs smoothly")
  - AI agent
  - Working in the background
  - Business dashboard
  - Diagnose / Build / Run
  - Friction
  - Uptime and monitoring
  - K.B Tech Partner (the site's nav pill on hover)
- Two example agent results built from those task words: "Follow-ups sent" and "CRM updated".
- Two multiplayer cursors, tagged "K.B" and "Your team".
- The real K.B logo tile and the Copperplate "K.B".

**Nothing else.** On screen, the name is always "K.B": no "Consultancy", no domain, no team, no client names or logos,
no figures anywhere, and nothing from the site's hero video.

## Thread object

The thread is the **"Your business" workspace chip**: a white pill with a soft cyan-gradient avatar square and the label
"Your business". Its journey through the film:

1. It arrives alone (01).
2. Countless tool tabs squeeze it down to a bare square, one tab among 26 (03).
3. It is lifted out and unrolls into the composer that asks the question (05).
4. It rides the scroll up and pins as the header (06).
5. K.B docks beside it, and the app window is drawn out of the pair (09).
6. It gains its status, "● Runs smoothly" (13).
7. It is the hub the whole system pulses into (17).
8. It eats the returning tabs (22).
9. It becomes the word "you" in the claim (24).
10. It is the row label of its own time (25–26).
11. It hands over to the K.B logo for the sign-off.

## Motion identity

- **Signature curve: the exponential arrival.**
  - The first frame is the fastest, then the speed falls by about ×0.80 a frame. 90% of the travel is done in 10–12 f.
  - A 20–30 f tail follows, and the next move starts from it, so a hold is a slow settle and never a freeze.
  - No overshoot anywhere, ever.
  - Its partner is the accelerating exit: an expo-in at about ×1.3 a frame that takes half the arrival's frames.
    Things swap on the fastest frame.
- **Duration palette (30 fps):**

  | Frames | Used for |
  |---|---|
  | 0 f | Whole words popping on |
  | 4 + 2 + 3 f | A click: press, hold, release |
  | 10 f | Small UI: toggle knob, check fill, tag (snaps stretched for a calm film) |
  | 12–14 f | Cursor decelerations, collapses |
  | 16–20 f | Panels, morphs, the dock |
  | 9 f launch + 18 f landing | Scroll hand-offs (land long under a voice) |
  | 30 f | Sweeps and line draws |
  | Constant speed | Working states only: streams 4–6 px/f, shimmer 25 px/f, sync dots 12 px/f, uptime ticks 4 px/f |

- **Entrance pattern:**
  - Everything enters from below, in the direction of the interface's own scroll, or grows out of an object already on
    screen (a dot, a chip, a skeleton line, a toggle).
  - Only the cursors and the returning tabs come in from the sides, and they are already moving when they do.
  - **One arrival for all text:** whole words pop on at full opacity on their spoken word. There are two exceptions,
    each because it is how that product text really arrives (ref33): the question is typed with a caret, and the
    agent's reply streams.
  - The claim line gets the film's one glide.
- **Camera:** one slow breath for the whole film (scale 1.00 → 1.03 → 1.00, ±16 px over 17 s), easing to rest from
  34.5 s. No pans, no pushes on transitions, no camera zooms. Every zoom is done by an element.

## Transition family

1. **The interface's own scroll (33).** The current state leaves upward on an expo-in, and the next rises on an expo-out.
   They swap on the fastest frame, inside the voice's pause. The header stays pinned like a real sticky header. Used
   for: the strip to the top (03→04), the click scroll (06), Integrations→Workflows (11), →Agent (14), the dashboard
   pushing the agent card up (15), →Diagnose (18), →Time bar (25) and →sign-off (27).
2. **The click causes the next scene (37).** A visible cause for each change: the send (05→06), the hover that turns
   the tile into the pill (07–08), the toggle that starts the cascade (10), and the cursors that automate steps (19).
3. **Grows out of, or collapses into, an object.**
   - The chip unrolls into the composer.
   - The reply dot grows into the K.B tile, and a field grows out of the tile.
   - The window is drawn out of the lockup.
   - The rows fold into one line, which becomes the header status.
   - The feed reflows into the grid.
   - The window closes on its centre line into a bar.
   - The chip eats the tab line (27).
   - The chip becomes "you".

Never a crossfade between layouts.

## Colour fields

All bright and pale. Every change is a mask that grows out of an object.

| Time (s) | Field | How it changes |
|---|---|---|
| 0–5.8 | Canvas `#F7F7F7` | The crowded world |
| 5.8–8.7 | White | Behind the question, the grey task stream is out of focus |
| 8.74 | Pale cyan `#E9F8FF` | Grows as a circle out of the K.B tile |
| 12.2 on | PaleCool `#F1F5F9` stage around a white window | Each card owns a tint (34) |

The card tints:
- Integrations: pale cyan `#E9F8FF`.
- Workflows: pale card `#EBECF4`.
- AI agent: paleCool `#F1F5F9`.
- Business dashboard: navy tint `#E6EBF2`.

The same tints come back together in the 2×2 pay-off (16), where they read without labels.

The rest of the film:
- **21.9:** the brightest tint of the film, `#DDF4FF`, floods the window out of the business chip on "together". It is
  used once.
- **Diagnose / Build / Run:** paleCool, then `#EBECF4`, then `#E9F8FF`, each wiped in by its event (the scan line, the
  click, the running cascade).
- **27.9 complexity:** canvas grey comes back with the tabs, then white grows out of the lockup on "complexity".
- **Claim:** white.
- **Time bar:** paleCool, then pale cyan grown out of "Time to grow".
- **Sign-off:** the site's canvas `#F7F7F7`, with the navy tile.

Colour rule check:
- Cyan is never used for text on light grounds.
- On cyan, text is navy only: the "Your team" tag and "Time to grow".
- White text appears only on navy.

## Stage geometry (1920×1080)

- **The opening (01–05):** objects sit at the centre. The tab strip rises to y=150 at 03.
- **From 09:** a 1760×1000 window (x 80–1840, y 40–1040).
  - Header band: y 40–220, with the lockup centred at y=130. It reads [▣ Your business] [K.B Tech Partner] at 0.8
    scale: chip 520×112 and pill 600×112.
  - Body: y 220–1040. Cards are 1440–1600 wide.
- **UI scale:** about 2.5–3.3× real. Rows are 46 px, titles 56–60 px, tags and statuses 30–38 px, and the question is
  54 px.
- **Claim:** 104 px and 96 px. **Sign-off line:** 76 px.
- **Only one line is readable at a time.** In any list, the row being acted on is ink and the rest are muted grey
  texture.

## Phrase by phrase

Times are film seconds. Arrivals lead their word by 3–6 f, and changes of state land on the word.

| # | Time | Phrase | Key word | Visual event | Techniques | Carries over | Motion that keeps it near 4% (content only) |
|---|---|---|---|---|---|---|---|
| 01 | 0.70–1.78 | One business. | business 0.88 | The film opens mid-move. A white workspace chip (780×156, 104 px cyan-gradient avatar, chevron) rises to (960,540) from 160 px below on the exponential and settles by 0.95. "Your" pops on at 0.70 and "business" at 0.84 (66 px, 600, ink). One object alone on the pale stage. | 33, 21 (pop on whole), ref28 ease-out (B4) | Nothing; the chip is the thread | The chip's rise and tail: about 2%, the one deliberately quiet phrase ("One") |
| 02 | 1.84–2.40 | Countless | Countless 1.84 | From 1.74, tool tabs (280×120, 44 px line glyph and 40 px label) pop on at both ends of the row, alternately right and left, every 2 f: CRM, Slack, Support desk, Notion, Google Workspace, ClickUp, Airtable, then unlabelled glyph tabs. Each lands moving 60 px outward, and the row stays centred on the chip. By 2.30 the row is about 4,300 px wide and bleeds off both edges. | 35, 31, 16, B4 | The chip, dead centre | A dozen arrivals in 17 f, and the whole 1920×120 row re-spacing every frame: about 6–8% |
| 03 | 2.40–3.24 | tools. | tools 2.40 | The row behaves like an overfull tab bar. Every tab compresses to its glyph (280→104 px, labels clipping away, S-curve 10 f), while about 14 more glyph tabs slide in from both edges, already moving. The result is a tight strip of 26. The business chip is squeezed too: "Your business" → "Your bu…" → only its gradient square, the one coloured tile among 26. In the pause (2.90–3.19) the strip rises from y 540 to y 150 as the window's tab bar: fastest frame at 3.15, landed by 3.55. | 31 (in reverse), 35, 33, A1 rhythm | The chip (now a square) and all the tabs | Full-width resizing, the second wave, then the 390 px rise: about 8–10% |
| 04 | 3.24–5.82 | And hundreds of tasks connecting them. | hundreds 3.54 · tasks 4.10 · connecting 4.62 | Task rows stream up under the tab bar. Each row is 1400×96 (x 260–1660): an empty checkbox, a 40 px task word (Follow-ups, Payment confirmations, CRM updates, Company outreach, Excel files, Approvals, Syncing data, Data routing), and at the right two glyph chips with an arrow for the tools it joins. Each row lands at y≈920 and pushes the stack up 108 px. On "hundreds" the interval drops from 8 f to 4 f; on "tasks" it drops to 2 f, and the stack becomes a blur of rows. Only the newest row is ink; older rows grey and soften as they rise. On "connecting", thin grey dashed connectors (2 px) draw from rows up to their tabs and cross each other. At most six show at once, and the newest row's pair is navy. | 33, 35, 16, B12, B11, 47 | The tab strip with the squeezed business square | The stream (a 1400×660 block at 4–30 px/f) and the connectors: about 10–15%, the busiest stretch by design |
| 05 | 5.82–8.22 | What if everything just worked together? | everything 6.22 · together 7.32 | In the pause (5.32–5.77) the tangle defocuses (blur 14 px, 50%, 8 f) and keeps streaming behind. The business square lifts out on a bell, descends to the centre, and a 1560×150 composer unrolls from it, the square riding its left edge, with a grey 104 px send disc at the right. From 5.84 the question types with a caret at about 26 chars/s (54 px ink) and is complete by 7.24. On "together" the send disc fills cyan with a navy arrow, and a 100 px cursor enters from the lower right already moving. It decelerates (14 f), its arrow fills on hover, and it presses at 7.90 inside the pause: 0.86 in 4 f, hold 2, release 3. | 47, 46, 25, 37, B10 | The business square (now the composer's avatar) and the out-of-focus stream | The stream behind at a constant 5 px/f over about 70% of the frame, plus typing and the cursor: about 3–5% |
| 06 | 8.40–9.64 | Meet K.B. | K.B 8.74 | The click causes the next scene. On release (8.05) the stream stops, and everything scrolls up out of frame (expo-in 10 f). The composer rides the same scroll, collapses back to the "Your business" chip (label blur-swaps back) and pins at the top (960,120, 0.8). In the empty centre, a 28 px navy dot and a 520×28 skeleton line appear, and a shimmer sweeps the line (8.30–8.64). On "K.B" the dot grows into the real K.B logo tile, 260 px at (960,540), on an exponential (11 f, no overshoot), and the skeleton folds into it. A pale cyan field grows out of the tile as a circle (18 f). | 37, 33, 29, 50, 12 | The chip (now the pinned header) and the parked cursor | The scroll-out, shimmer, tile growth and the iris edge crossing the frame: about 5–8% for 1.3 s, then the name holds while it is said (ref29) |
| 07 | 9.66–10.51 | Your technology | technology 9.90 | From 9.50 the cursor glides onto the tile (expo-out 12 f) and hovers it. The tile answers by flattening into K.B's own nav pill: from a 260² square to a 420×150 navy #293A51 pill with "K.B" in #F1F5F9 Copperplate 74 px. It passes through a rounded rectangle, keeps its mass, and changes radius over the middle 60% (16 f, 9.84–10.37). | 37 (hover), morph rules (transitions.md), B1 | The tile becoming the pill, the cursor, the header chip, the cyan field | Cursor travel and morph: about 2–3% (the name hold) |
| 08 | 10.51–11.19 | partner, | partner 10.51 | The pill does what it does on K.B's site on hover. It starts widening on an ease-in at 10.25; "Tech Partner" fades on at its final gap near the speed peak (10.45); it settles at 900×150 (12 f), reading "K.B Tech Partner" (Montserrat 600, 54 px, #F1F5F9 on navy). The cursor leaves at 10.75, accelerating off the bottom. | 22, 37 | The pill and the header chip | Both pill ends moving and the cursor exit: about 2–3% |
| 09 | 11.19–13.13 | built around your business. | built 11.19 · around 11.57 · business 12.23 | **built:** the pill rises and docks beside the header chip, which slides left to make room. Both move on one long-S (20 f), and the pill shrinks to 0.8, giving the lockup [▣ Your business] [K.B Tech Partner] at y=130. **around:** a dotted navy outline (2 px, 35%) draws out of the lockup's two ends, runs to the frame edges and down the sides, and meets along the bottom (14 f). It is the reserved layout of the 1760×1000 window, with the lockup in its header. **business:** the outline fills solid. The white window wipes down from the header (12 f), the stage outside turns paleCool, and the body shows the grey skeleton lines of its first card. | 22/31, B2, 28, 42, B11 | The chip and the pill | The dock, the outline around the whole frame and the fill wipe: about 6–10%, one step per word |
| 10 | 13.17–14.53 | Connect your tools. | connect 13.17 · tools 13.65 | In the pause (12.78–13.15) the skeleton fills into the **Integrations** card (pale cyan). Five rows (1440×110, 46 px, muted) bring back the opening's tabs: CRM, Support desk, Google Workspace, Slack, Notion, each with a grey toggle (128×68). **connect:** the cursor, already in from the lower right, clicks toggle 1. The knob slides, the track fills cyan (10 f), the row turns ink, and "Connected" (navy 34 px, cyan dot) pops. A cyan spine draws from the header chip down the card's left gutter, with a branch into row 1. **tools:** the other four flip in a cascade 3 f apart with no cursor; each row is ink for its moment and the spine branches into it. Then small cyan sync dots run up the spine into the business chip. | 28, 37, 35, B11, B10, 34 | The opening's tabs (now rows) and the lockup | Toggles, spine, then the constant dot stream: about 4–6% |
| 11 | 14.53–15.81 | Automate workflows. | automate 14.53 · workflows 14.91 | In the pause (14.16–14.46) the Integrations card leaves upward under the header (expo-in 9 f). At the fastest frame it swaps for the **Workflows** card rising (expo-out 18 f, #EBECF4 tint, 56 px title). Its rows are the opening's tasks, with the same words and glyph pairs, now ordered with empty check circles. **automate:** the run starts by itself. Each circle fills with a cyan check while a shimmer passes through the next label, one row every 5 f, and the list streams upward with new rows entering below. The row being checked is ink. **workflows:** a cyan line draws down through the check circles (12 f), linking the tasks into one pipeline that keeps running. | 33, 29, B13, B10, B11, 34 | The task rows from 04 (before/after on the same objects) and the lockup | The checking stream: about 6–8% |
| 12 | 15.93–16.65 | Simplify | simplify 15.93 | The run continues through the pause. On "Simplify" the pipeline folds: the rows above and below collapse into the middle row like an accordion (S-curve 10 f). The last row blur-swaps to "✓ Runs smoothly" (52 px). One line where there were dozens. | 29 (collapse into one checked line, stretched to 10 f), 23 | The Workflows card and its run | The list block collapsing: about 5% |
| 13 | 16.65–17.55 | operations. | operations 16.65 | "Runs smoothly" buds out of the card, stretches and travels up on a short bell (11 f) into the header chip. The chip makes room for a second line, "Your business / ● Runs smoothly" (30 px muted, cyan dot), and grows from 112 to 150 px (9 f). The business's operations are now one status. | 45, 31 | The chip (now with its status) and the emptied card | Transfer and resize: about 3% |
| 14 | 17.81–18.63 | From intelligent | intelligent 18.01 | In the pause (17.40–17.78) the empty card scrolls away and the **AI agent** card rises (paleCool). It has an 88 px navy rounded-square avatar with a cyan dot, "AI agent" at 52 px, and a grey status, "Working in the background" (38 px). **intelligent:** a 90 px shimmer band starts sweeping through the status at constant speed, and the avatar's dot blinks once (5 f). | 33, 29, 34 | The lockup with its status | The card's arrival, then the shimmer: about 4%, then 1.5% |
| 15 | 18.63–20.95 | AI agents to custom software, | agents 19.01 · custom 19.61 · software 20.05 | **agents:** the shimmer grows into the result. The reply streams in at about 20 words/s behind a cyan writing-head dot: "✓ Follow-ups sent", then "✓ CRM updated" appended 4 f later, and the card height eases to fit (46 px). **custom:** the **Business dashboard** card rises and pushes the agent card up, part-way under the header. **software:** it lands. A cyan line chart (1200×300) draws left to right (30 f), and three navy bars rise 3 f behind each other. There are no figures and no axis values. | 29→30, 33, B11, B9 | The agent card (pushed up) and the lockup | The word stream, the push and the chart draw: about 4–6% |
| 16 | 20.99–21.61 | everything | everything 20.99 | From the pause (20.62–20.86) into the word, the feed reflows into one view. The agent and dashboard cards shrink to 780×360 into the lower row, while Integrations and Workflows come back down from under the header into the upper row. Each keeps its tint, and all four move on one bell (18 f) whose peak lands on "everything". The result is a 2×2 grid with every card still live. | Layout transformation, 34, B1 (peak on the word) | All four cards and the lockup | One move of four cards plus their live content: about 10% |
| 17 | 21.61–22.75 | works together. | works 21.61 · together 21.89 | **works:** a cyan tree draws from the header's business chip down the grid's centre gutter, branching into each card's inner corner (12 f). **together:** one 18 px cyan pulse runs along all four branches at once into the chip (10 f). On arrival its status dot pulses once, and the window body floods with the brightest tint (#DDF4FF) as a circle grown out of the chip (16 f). | B11, 45, 12, 34 (pay-off) | The grid and the lockup | Tree, pulse and flood over still-live cards: about 5–8% |
| 18 | 22.75–24.37 | We analyze your processes, | analyze 22.95 · processes 23.47 | In the pause (22.34–22.72) the grid scrolls up and out as one. A white card rises with the title "Diagnose" (60 px) and a flow of four step pills (330×110, 36 px, muted): Outreach → Follow-ups → Approvals → CRM updates. **analyze:** a 4 px cyan scan line sweeps the card left to right (ease-in-out, 30 f), and each step turns ink as it is crossed. **processes:** as it passes, a "Friction" tag (navy pill, #F1F5F9 30 px) pops above Follow-ups, then above Approvals. | 33, B17, 21 | The lockup and the task words | The arrival, the sweep and the steps changing: about 4% |
| 19 | 24.45–26.03 | build alongside your team, | build 24.45 · alongside 24.75 · team 25.39 | **build:** the title swaps in its slot, "Diagnose" → "Build" (spacing collapse, 7 f). A navy cursor tagged "K.B" enters from the right, already moving, and clicks Follow-ups. The step becomes automated (white pill, cyan check), its Friction tag lifts off, and the arrow after it becomes a cyan line with moving dashes. **alongside:** a cursor tagged "Your team" (cyan tag, navy text) enters from the left and settles beside the K.B cursor. **team:** the Your team cursor clicks Approvals, which is automated too. | 23, 37, B4 | The process card and its tags | Two cursors, the swaps and the running dashes: about 3–4% |
| 20 | 26.03–27.87 | and keep your systems running. | keep 26.21 · systems 26.61 · running 27.05 | **keep:** the title swaps "Build" → "Run". The Your team cursor leaves, accelerating; the K.B cursor stays, parked beside the title (K.B stays on). **systems:** all four steps turn cyan-checked in a cascade 3 f apart, the flow line runs with cyan dashes, and the pale cyan tint wipes in along it. **running:** an uptime strip (1440×80) rises under the flow: thin cyan ticks streaming left at constant speed, with "Uptime and monitoring" (34 px muted) at the left and "● Running" at the right. | 23, B13, B10, 33 | The process card and the K.B cursor | The cascade, then the live monitor: about 4% |
| 21 | 27.87–28.89 | No unnecessary | no 27.87 · unnecessary 28.21 | In the pause (27.40–27.74) the K.B cursor leaves, and the window closes on its centre line. Its top and bottom converge (ease-in 12 f) into a 1760×170 bar at y=540 holding the lockup. **No:** the opening's tabs pour back into the bar from both edges (already moving, 2 f apart) and squeeze the lockup. "K.B Tech Partner" retracts to "K.B" (the site's resting pill), "Your business" truncates to "Your b…", and the stage goes canvas grey. **unnecessary:** the business chip starts eating the line. The outermost tabs slide into the lockup and vanish, both ends converging at quickening intervals (9, 6, 4… f). | Window closes on its centre line, 35, 22 reversed, 27 | The lockup, and the tabs from 02–03 (callback) | Collapse, tabs pouring in and being eaten: about 6–8% |
| 22 | 28.89–29.79 | complexity. | complexity 28.89 | The eating reaches its fastest frame on "complexity". The last tabs vanish, the bar closes around the lockup, and both labels reopen in full: "Your business ● Runs smoothly" and "K.B Tech Partner". A white field grows out of the lockup over the grey (16 f). One clean lockup on a clean stage. | 27, 22, 12 | The lockup | The last tabs being eaten, the labels widening, the iris: about 4% |
| 23 | 29.93–30.86 | Just technology | technology 30.16 | In the pause (29.57–29.91) the lockup rises to y=300 to make room (bell 14 f). The claim builds under it at y=520 (104 px Montserrat 700 ink): "Just" pops at 29.92 and "technology" at 30.14. The line is laid out at its final centred width, starts 140 px right, and glides once to centre on one exponential that word arrivals never restart. Then it rests. | 21 (the film's one glide), 22 | The lockup | Lockup rise, glide and pops: about 2% (the claim, by intent) |
| 24 | 30.86–32.48 | that works the way you do. | works 31.04 · way 31.44 · you 31.60 · do 31.78 | Line 2 builds at y=670 (96 px), each word popping on its word, with a slot reserved before "do.". **you:** the business chip buds out of the lockup (the K.B pill closes the gap and stays centred above). It travels down on a short bell (11 f) into the slot and blur-swaps its label to "you", so the business's own pill, gradient avatar and all, becomes the word. "do." pops at 31.76. | 45, 26 (key word changes form), 23, 21 | The business chip, the K.B pill and line 1 | The chip's travel and the pops: about 2–3% |
| 25 | 32.48–33.84 | Less manual work. | less 32.48 · manual 32.74 · work 33.16 | In the pause (32.04–32.39) the K.B pill and the claim leave upward (expo-in 9 f), except the "you" pill. It swaps back to "Your business" and glides left to become a row label at (360,520). Its row rises beside it: a 1120×140 time bar of four grey blocks (#EBECF4, 36 px ink): Follow-ups, CRM updates, Excel files, Outreach. **less:** block 1 takes a cyan check and collapses to a 14 px cyan sliver (S-curve 10 f), and its neighbours slide left to close up. **manual:** two more go, 4 f apart. **work:** the last one goes. Four thin cyan slivers stay (still running), and empty dashed space opens. | 33, 31, B13, B1 | The business chip and the task words (callback) | Blocks collapsing and sliding along the bar: about 3–4% |
| 26 | 33.84–35.18 | More time to grow. | more 33.84 · time 34.08 · grow 34.44 | **More:** a block grows rightward out of the slivers into the empty space (pale cyan → cyan gradient, S-curve 20 f). **time:** its label pops, "Time to grow" (navy 48 px 700). **grow:** it reaches the bar's end, and a pale cyan field grows out of it across the stage (16 f). | 31, 21, 12 | The chip row and the bar | The growing block and the field: about 3% |
| 27 | 35.18–36.08 | K.B. | K.B 35.18 | In the pause (34.75–35.14) the row scrolls up and out (expo-in 9 f), and the stage clears to canvas #F7F7F7. The K.B logo tile (280 px) rises in from 90 px below to (960,420) on an exponential at ×0.83 a frame (20 f), its opacity up over the first 6 f. It has landed by "K.B". Nothing else moves. | 33, ref31 sign-off curve, 50 (no overshoot) | The brand; the business has had its turn | The tile's rise: about 1–2% (calm by rule) |
| 28 | 36.08–37.24 | Your tech team, | tech 36.32 · team 36.56 | Under the tile, one centred line laid out at its final width (y=700, 76 px Montserrat 700 ink): "Your", "tech", "team," pop on whole in place on their spoken words. No movement. | 28, 21 | The tile | Pops only: under 1% |
| 29 | 37.24–38.26 | without the hiring. | hiring 37.66 | The same line completes in place: "without", "the", "hiring." Then the frame rests while the camera's breath eases to a stop and the tails die out by 39.6 s. | 28, 21 | The tile and the line | Pops only: under 1% |

Every phrase brings a new visual on its key word. The longest stretch of voice without one is about 0.9 s, inside the
name hold at 06–08.

## The 4% norm

The motion comes from content only:
- the tab row re-spacing and compressing;
- the task stream (accelerating, then out of focus behind the question);
- the scroll hand-offs;
- the toggle cascade and the sync-dot stream;
- the self-checking run list;
- the streamed agent reply and the chart draw;
- the 2×2 reflow and the pulse;
- the scan;
- the running dashes and the uptime ticks;
- the tabs being eaten;
- the time blocks collapsing and growing.

Nothing drifts. The camera only breathes. The only text that moves is the claim line's single glide.

Estimate: about 60% of the measured frames sit at 4% or more. The calm stretches are the name (06–08), the claim
(23–24) and the time bar (25–26); the sign-off is excluded by the probe. That should put the median at about 4%.

To calibrate:
1. Build 04 and 11 first.
2. Run `motion_check.py --profile` and `busy_check.py`.
3. Tune the stream speeds and row sizes, never the camera.

## The three moments at most risk

1. **04 "hundreds of tasks connecting them" could get busy.** The stream, 26 tabs and the connectors are all on screen
   at once. How we keep it readable:
   - one ink row at the landing slot, with older rows grey and softened;
   - the tabs already quiet glyphs;
   - connectors only from "connecting" on: grey, 2 px, never more than six, and only the newest pair navy.

   The viewer reads one task at a time and feels the rest as quantity.
2. **16–17 "everything works together" could get busy.** Four live cards, a tree, a pulse and a flood. How we keep it
   readable:
   - the reflow is one move on one curve;
   - the cards' live content runs at half speed in mid-grey during the move;
   - the tree draws as one wave out of the chip, the pulse is one synchronised pass, and the flood waits for it to land;
   - the only readable words are on the business chip.
3. **23–24 the claim on white could go static,** and so could the name hold at 06–08. Three things keep it moving:
   - the lockup's make-room rise;
   - the line's single glide;
   - the business chip travelling into the line as "you".

   We accept about 2% here as the claim's hold (ref29 holds only at its name and its consequence), carried by the 6–15%
   stretches either side. If the probe finds a still point over 0.8 s, the K.B pill gets its "Tech Partner" re-reveal
   (22) at "technology". No drift is added.

Also watched: 09 is sequenced one step per word (dock, outline, fill) so the three never overlap.

## Build notes (Remotion, one person, a day)

- **Setup:** one composition, one `timeline.ts` keyed from `vo/words.json`, and the kit (`EASE`, `track`, `breathe`,
  `Iris`, `Typed`).
- **Components:** `Chip`, `Tab`, `TaskRow`, `Stream` (a time-driven vertical list with an interval curve), `Composer`,
  `Cursor` (enter, hover, press, leave), `Toggle`, `Card`, `Shimmer`, `StreamedText`, `LineChart`, `UptimeTicks`,
  `TimeBar`, `KBPill` (the tile, pill and partner states), `ScanLine`.
- **Shared layouts:**
  - The tab strip is reused in 02–03 and 21–22.
  - The task rows are reused in 04, 11, 18 and 25.
  - The cards are reused in 10, 11, 14, 15 and 16.
- **Assets:** the K.B tile from `assets/logo/kb-logo-tile.svg`, Copperplate `assets/fonts/copperplate-cc-heavy.otf`, and
  Montserrat. Glyphs are generic line icons. No third-party logos.
