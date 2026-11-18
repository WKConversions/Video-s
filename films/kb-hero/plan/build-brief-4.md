# K.B hero film: the minimal pass (fourth brief for the scene builders)

Karl watched the full film. His words: **"It's a bit too busy and it should be more minimal visuals. I can't keep up
with what it all is and what you're visualising. It's too much."** He is right: the motion pass filled every scene with
streams, feeds, counters and second windows. This pass takes them out. Each scene is rebuilt around **one idea that
reads in a second**. The timeline, the transitions and the brand look stay.

Read `plan/build-brief.md` (contract, kit, hand, checks) and `plan/build-brief-3.md` (the smoothness rules: they all
still hold for everything you write), then this.

## The rules of this pass
1. **One idea, one hero object, one main action per scene.** A viewer who has never seen K.B must be able to say what
   the scene showed, in five words, after one viewing. Structure every scene as arrive → act → result.
2. **At most four separate things on screen** (a headline is one, a card is one, a row of three tiles is three). No
   side panels, no second storyline, no feed beside a chart, no counters beside a flow, nothing in the corners.
3. **Out, everywhere:** scrolling feeds and columns, streaming rows, odometer walls, re-ranking bars, build logs, timelines,
   "playing" pictures inside cards, chips flying around, columns beside headlines, floating decoration.
4. **Big, simple, calm.** The hero object fills 55–70% of the frame width; simple solid shapes; few labels (at least
   32 px, generic UI words only); generous empty space around it. Apple-style: one spring arrival, one clear move, a
   clean result. Never two moves competing for the eye; never a dead hold over 0.5 s either: after the result, one
   small living detail keeps the frame alive (a caret blinks, a glow breathes, a check settles), nothing more.
5. **Every text-free scene has ONE caption** that says what it is: the kit's new `Caption` (top centre, the same place in
   every scene): `<Caption t={t} text="…" grad={GRAD.ai} />`. The texts are fixed below (K.B's own service names). Keep
   the hero object clear of it (the caption occupies y 68–140).
6. **Time to read.** Things arrive in the first 0.4 s, the action sits in the middle, the result holds for at least
   0.8 s before the scene ends. Headlines and captions are fully in by 0.5 s.
7. Still true: bright grounds (the code editor becomes a LIGHT window now: white, navy text, coloured tokens), K.B
   only, given facts only, the scene contract (composed at t = −0.3 and until dur + 0.3), pure function of `t`, moves by
   transform on their own layer (brief 3). The motion norm is no longer a target: clarity is.

## Sound events
Fewer and more telling: 2–5 per scene, only on moments the viewer sees. Kinds now also include `rise` (something opens
or grows), `fall` (something closes or leaves), `sparkle` (data or light running through something), `thud` (a heavy,
final landing), besides `click` (the hand, at its deepest point: key `at` + 0.11), `pop`, `tick`, `whoosh`, `slide`,
`snap`, `open`, `success`, `type`, `glitch`. Pick the kind that describes the moment; the lead maps them to Karl's
sounds.

## The scenes (durations unchanged)

**Group A**
- **S1 (4.2 s) Hook: text, then the tile.** Only the headline, centred in the frame: "The technical team" / "you don't
  have to hire yet." at about 112 px, word by word with `Words` (stagger about 0.11, "technical team" in `GRAD.brand`),
  complete by 1.3 s, held until 2.3. Then the lines draw together and vanish into the centre while the K.B tile (300 px)
  springs in at the same spot (about 2.5), with "YOUR TECH PARTNER" letter-spaced under it and one soft ring. The hand
  clicks the tile at 3.7 (press, one ripple). No cards, no chips, no floaters. Hand: `[{ at: 3.7, x: 960, y: <tile>, click: true }]`.
- **S2 (3.8 s) Three pillars.** The small K.B tile and "One partner. Three pillars." on top; three cards (about
  480×520) in a row, each with ONE large simple icon and its title (44 px): pillar 1 a sparkle (the AI agent mark),
  pillar 2 code brackets `</>`, pillar 3 a rising arrow line. Each icon has one calm loop (the sparkle turns slowly, a
  caret blinks, the arrow draws once). Cards cascade in (0.15 / 0.30 / 0.45). Hand as now: hover card 3 (`at: 1.3`), pass
  card 2 (lifts about 1.9–2.4), click card 1 (`at: 3.3`), which presses and then grows toward the viewer from 3.5.
  Nothing plays inside the cards.

**Group B**
- **S3 (1.6 s) Pillar 1 title.** Eyebrow "PILLAR 01", "AI, Agents" / "& Automation" (120 px, `GRAD.ai` words), the line
  "Connecting your tools to eliminate manual work." Nothing beside it (remove the scrolling columns). No hand.
- **S4 (4.0 s) Caption "Cross-platform integrations".** A row of three big tiles (about 210 px, y ≈ 540): the Pipedrive
  logo tile on the left, an empty dashed slot in the middle, the Odoo logo tile on the right (kit `Tool`; put a pale
  logo on a navy tile). The AI Agent tile (the Claude logo, gradient border, label "AI Agent") waits below the slot at
  about (960, 870). The hand presses it at 0.75 and drags it into the slot (keys:
  `{ at: 0.75, x: 960, y: 870, click: true }`, `{ at: 2.0, x: 960, y: 540, early: 0, dur: 0.92 }`; the tile follows
  `E(t, 1.08, 0.92, ease.inOut)` under the fingertip and snaps in at 2.0). Then ONE line draws from the left tile
  through the agent to the right tile (2.1–2.6), ONE gradient pulse travels along it (2.6–3.3), and a green check pops
  on each tile as the pulse passes it. Hold. No inbox, no Done panel, no counters, no extra tools.
- **S5 (2.2 s) Caption "Custom AI Agents".** The agent orb (large, left of centre) and a column of three task cards to
  its right (each one icon and one word: "Email", "Report", "Booking"). One after another (0.4, 0.9, 1.4) a soft pulse
  goes from the orb to a card and the card turns done (tinted, a green check draws on). Hold. Nothing streams. No hand.

**Group C**
- **S6 (1.5 s) Pillar 2 title.** Eyebrow "PILLAR 02", "Software" / "Development" (`GRAD.dev`), the line "Web apps,
  mobile apps and business dashboards." Nothing below it (remove the build window). No hand.
- **S7 (4.0 s) Caption "Website & mobile app development".** One LIGHT editor window (about 1100×600, centred): five
  short code lines type on (0–1.1), a "Deploy" button in its top bar. The hand clicks Deploy at 1.3 (it turns green,
  "Live"). At about 1.8 the editor turns over like a card (one 3D flip) and its back is a browser window with a simple
  finished page: a nav bar, one hero block (a headline bar, a short bar, a button) and three cards. At about 2.7 a
  phone slides in beside it with the same page stacked for mobile. Hold: the page's button glows once. No build log,
  no scrolling, no second editor. Hand: `[{ at: 1.3, x: <Deploy>, y: <Deploy>, click: true }]`.
- **S8 (2.0 s) Caption "Custom business dashboards".** ONE large white card (about 1200×640): on the left one big
  number counting up (a plain number, no unit) over a short grey label bar; across the card one line chart that draws
  itself left to right with a soft area fill, a dot riding its end. Nothing else (no KPI row, no bars, no table). No hand.

**Group D**
- **S9 (1.6 s) Pillar 3 title.** Eyebrow "PILLAR 03", "Growth" / "Technology" (`GRAD.growth`), the line "Visibility.
  Conversion. Product marketing." Nothing beside it (remove the bars and the feed). No hand.
- **S10 (3.2 s) Caption "SEO & GEO Optimization".** A search bar (wide, top of the hero area) types "your business"
  (0–0.8). Below it three result rows; the "Your site" row starts third and climbs to first in ONE smooth move at about
  1.2–1.7 (the two others slide down), and gets a mint highlight. At 2.0 a small "AI answer" card pops at the right
  (a sparkle icon, two bars and a "Your site" source chip that lights up). The hand clicks the top result at 2.3
  (press, ripple). Hand: `[{ at: 2.3, x: <top result>, y: <top result>, click: true }]` (remove the search-bar hover).
- **S11 (3.2 s) Caption "Website & Conversion Optimization".** ONE browser window with a simple landing page (a
  headline bar, a short bar, a big "Book a call" button) and, beside it, one large conversion ring at a low fill. The
  hand clicks the button at 0.9: it presses, a "Confirmed" card with a green check pops over the page (1.1–1.5), and
  the ring sweeps up to a high fill, its centre arrow popping (1.3–2.2). Hold with one living detail. Remove the video
  player, the format cards, the timeline, the feed and the bars: one idea only. Hand:
  `[{ at: 0.9, x: <button>, y: <button>, click: true }]`.

**Group E**
- **S12 (3.5 s) "Built together. Built to be run."** The headline on top (72 px) and three step cards (Diagnose, Build,
  Run), each with ONE simple icon (a magnifier, building blocks, a loop arrow) and its name: no playing pictures. One
  progress line under the cards fills left to right; as it reaches a card (0.5, 1.7, 2.7) that card lifts, its icon
  makes one small move and a check appears. At 2.8 the row "After we deliver" + chips Hosting, Maintenance, Growth
  lands. No hand.
- **S13** is the lead's (the globe). Do not touch it.
- **S14 (3.3 s) End card.** Already minimal: leave it as it is, unless something in it breaks rules 2–4.

## Checking and report
For each scene: an 8-frame sheet (`bash tools/sheet.sh <group> <Scene> 8 out/<name>.png`): look at it as Karl would.
Is it calm? Can you say what it shows in five words? Count the things on screen. Then `bash tools/smooth.sh <group>
<Scene>` (no SHAKE, JUDDER or STUTTER). Render one thing at a time. Edit only your own scene file(s). Do not npm
install. Do not commit. Report per scene: what it shows now (one line), the number of things on screen at its
busiest moment, hand keys, sfx, the shake check result, anything unresolved.
