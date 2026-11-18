# K.B hero film: the motion pass (second brief for the scene builders)

Your scenes are built and look clean. One thing is far off: **the motion norm**. Karl asked for "constant motion, aim to
the 4% norm". Measured his way, your scenes sit at 0.5–2.5%. This pass lifts every scene to the target with motion that
means something. Read `plan/build-brief.md` again first (all of it still holds), then this.

## How the norm is measured (so you know what counts)
`python3 tools/norm.py out/<clip>.mp4` on a scene clip (`bash tools/sheet.sh <group> <Scene> clip out/<clip>.mp4`).
The picture is shrunk to 160×90 grey; a pixel counts as moving when its value changes by more than 6/255 from one frame
to the next (60 fps). The norm is the **median over the frames** of the share of pixels moving. So half of all frames
must have 4% of the picture really changing.
- **Does not register:** pale on pale (tinted glass on a bright ground), thin lines, small dots and pulses, slow drift
  and slow camera pushes (under about 40 px a second), opacity changes of small things.
- **Registers:** big, contrasty areas that really change: a list or feed that scrolls, rows and cards streaming in and
  stacking up, code that scrolls while it types, a chart that plays like live data (area fills, bars re-ranking), counters
  rolling like an odometer, a big card turning in 3D, a wide progress fill, solid chips travelling along a path, a page
  that scrolls, a video frame whose content plays.

## Karl's standing rules for reaching it (from his corrections on earlier films, verbatim where quoted)
- "No useless animations, for example the text obviously moving left and right." "Constant motion but no useless only
  movement or sizing motion and don't make it childish." "A productive norm: something is really happening, not just
  easily moving something constantly." "Don't simply animate a UI left to right."
- So: **reach the norm with content that acts** (streams, piles up, scrolls, plays, counts, builds, sorts), never with
  drift, wobble, floating, pulsing, or the camera. Do NOT raise camera pushes or background shapes; the background stays
  calm and bright (Apple style: still background, heavy foreground motion). Remove added drift that does nothing.
- **Few, big things.** Make the subject larger: the main UI fills 70–85% of the frame; type inside UI at least 28 px;
  contrast up (navy text and solid fills on white, gradient-filled cards and buttons, a dark window as an object).
  Thin grey bars on white are invisible to the viewer and to the norm: replace part of them with solid coloured blocks,
  real short labels (generic UI words only), icons, numbers.
- **Chain the events** so that at every moment one big thing is mid-move: a new visual event every 0.4–0.6 s, each one
  the content doing its job, with Apple-style springs (`S`) for arrivals. No dead stretch longer than 0.3 s.
- Still true: bright look, K.B only (never what it stands for, no URL), only the given facts, variety between
  neighbouring scenes, the scene contract (composed at t = −0.3 and until dur + 0.3), pure function of t.

## Targets (norm.py, median over local 0..dur)
- Scenes without headline text (S4, S5, S7, S8, S10, S11, S13): **4.5% or more**, and at most 15% of frames under 1%.
- Scenes with a headline (S1, S2, S3, S6, S9, S12, S14): **3% or more**. Words stay readable for at least 1.2 s; put the
  motion in what the words are about, next to or under them, or in how the words arrive (bigger type, word by word over a
  longer stretch), never by sliding the text around.
Measure, change, measure again. Report the norm of every scene before and after.

## The hand (changes the lead needs)
The cursor must be on screen about half the film, so it now works in sessions: S1–S2, S4, S7, S10–S11, S14. Everywhere
else it is gone. At the end of a session the lead takes the hand away with the scene's transition; at the start of a
session the lead brings it in from below the frame. You only give the keys ON targets (no entry, exit, rest or park
keys). Per group:
- **A:** S1 keeps its click on the K.B tile at 3.7 (remove the off-screen first key; the lead adds the entry). S2: only two
  keys: `{ at: 1.3, x: 1560, y: 640 }` (hover card 3) and `{ at: 3.3, x: 360, y: 640, click: true }` (card 1). The glide
  between them runs from 1.3 to 2.9 and passes card 2 around t = 2.1: card 3 is lifted while the hand is on it, card 2
  lifts as the hand passes (about 1.9–2.4), card 1 from 2.7. Keep the click reaction at 3.3 + 0.11.
- **B:** S4: click the agent tile at **0.75** (`{ at: 0.75, x: 520, y: 760, click: true }`), then the drag key
  `{ at: 2.0, x: 960, y: 520, early: 0, dur: 0.92 }`: the hand's drag runs exactly from **1.08 to 2.0** (ease in-out);
  move the tile with `E(t, 1.08, 0.92, ease.inOut)` so it stays under the fingertip. Remove the third key. No hand in
  S3 and S5.
- **C:** S7: only the Deploy click (`at: 1.3`); remove the second key. S8: no hand: remove its key, the tooltip appears by
  itself. No hand in S6.
- **D:** S10 and S11 keep their keys. No hand in S9.
- **E:** S12: **no hand**: the Diagnose → Build → Run sequence advances by itself (keep its timing). S13 is being rebuilt
  by the lead as a dot globe: do not touch S13 (leave your S13 code in place). S14 keeps its click on the button
  (`at: 2.0`); remove the key after it.
If you move a clicked thing, move its key with it. Keep `sfx` in step with what you change (3–7 per scene, at the real
moments).

## Direction per scene (the lead's ideas; use them or better ones that follow the rules above)
- **S1 (hook, 4.2 s):** "The technical team you don't have to hire yet." Show what the words are about: while the
  headline (kept large, upper third) is read, a row of big **open-role cards** deals in below it one after another
  (generic roles only: "Developer", "AI engineer", "Automation specialist", "Growth marketer"; each a solid card with a
  small "Open role" tag, the title, two bars, a button). Around 2.2 s the cards slide together into one stack, which
  folds into the single K.B tile (the stack morphs into the tile; rings; "YOUR TECH PARTNER"). The hand clicks the
  tile at 3.7 as now. The frame at t = 0 already shows the first words and the first card arriving.
- **S2 (pillars, 3.8 s):** keep the three cards; make the picture inside each card bigger, more solid and playing the
  whole time (the node graph running with solid travelling chips; code lines typing and scrolling; bars and an area
  chart growing). The hovered card's visual speeds up.
- **S3, S6, S9 (pillar titles, 1.5–1.6 s):** already close; lift only if under 3% (bigger type, a solid playing glyph
  of the pillar beside the eyebrow, not drifting accents).
- **S4 (automation canvas, 4.0 s):** bigger tiles (about 170 px) and a real story in streams. Before the drop: manual
  work piling up (solid task cards with amber badges streaming into a growing pile at the trigger). At the drop the
  agent snaps in and the pile drains: solid gradient chips with icons travel the wires one after another, the "Done"
  tiles stack up finished rows with green checks, a counter of handled tasks rolls. Something big is mid-move at
  every moment from t = 0.
- **S5 (agent in the background, 2.2 s):** more and bigger notification cards, solid colours, a steady stream into the
  orb; the resolved list fills the window and scrolls continuously. Larger window, larger orb.
- **S7 (code becomes product, 4.0 s):** the editor fills the frame at first; a longer file scrolls as it types
  (highlighted current line). After Deploy: the browser opens large and the page builds in big solid blocks, then the
  page **scrolls** through its sections while the phone's version scrolls too. No quiet last second.
- **S8 (dashboard, 2.0 s):** fills the frame. Everything plays like live data: the area chart streams leftwards with a
  solid gradient fill, the bars re-rank, the KPI numbers roll (odometer), rows stream into a table. Tooltip self-driven.
- **S10 (search + AI answer, 3.2 s):** larger, more solid result cards (coloured favicon tiles, bold title bars). "Your
  site" climbs slot by slot (4 → 3 → 2 → 1), each swap a big visible move, while the AI answer writes itself line by
  line and scrolls, then cites "Your site". The hand clicks the top result as now.
- **S11 (conversion + product marketing, 3.2 s):** first half: the page reacts in big moves (the booking card flips in,
  the conversion ring fills, bars grow). Second half: the player really **plays** (its picture changes: bars, blocks
  and a progress fill moving inside the frame), and the same content plays in the 16:9, 9:16 and 1:1 cards at once.
- **S12 (built together, 3.5 s):** no hand. Three big step cards (Diagnose, Build, Run) whose pictures play: a scan
  sweeping a system map, blocks assembling into an app, a live uptime chart streaming. Each takes over in turn with a
  wide solid progress fill; then the "Hosting · Maintenance · Growth" chips land. Headline stays readable.
- **S14 (end, 3.3 s):** the K.B tile, "Your tech partner.", the line, the CTA. Keep it calm but alive to the last
  frame: the words arrive big, word by word; the button arrives with a gradient fill sweep; after the click (2.0) the
  button answers with a clear, wide reaction (a solid fill wave across the button, a check drawing on, rings) that is
  still resolving at the last frame. Target 2.5% here.

## Checking and report
For each scene: `bash tools/sheet.sh <group> <Scene> 8 out/<name>.png` (look at it: clean, bright, big, readable, nothing
cut off or overlapping by accident, the hand on its targets), the clip, `python3 tools/norm.py`, and
`python3 tools/flow.py` for unwanted jerks. You have about 20 minutes: spend them on the scenes furthest from target
first. Edit only your own `src/scenes/<group>.tsx` (and your `<group>_*.tsx` helpers). Do not commit. Report per
scene: what changed, norm before → after, hand keys, sfx, anything unresolved.
