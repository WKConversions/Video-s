# K.B team film: build brief for the shot builders

You animate two packages of a 50-second film for **K.B**. The film replicates a reference film (Base44, "Build an app
with your name on it") shot for shot: the same cuts on the same frames, the same kind of picture, the same motion and
rhythm, with K.B's brand and content. Read `plan/brief.md` first (Karl's words, the reference's shot overview, the rules).

## What exists
- **The storyboard is the design**: `film/src/Storyboard.tsx` holds one finished still frame per shot (`FR[0]` … `FR[40]`,
  in film order, each marked with its shot letter). Karl has seen it. Your shots must END UP looking like these frames;
  your job is how they get there and move, following the reference. Copy the JSX of your frames as your starting point.
- **The kit** `film/src/kit.tsx` (lead-owned, do not edit): colours `C`, font `F`, `Ground` (paper, vig, ui, dark, cyan),
  `Tx`, `Port` (team portrait card), `Tile` (the K.B logo), `Msg` (the message box; pass the typed part of the text),
  `Glyph` (five K.B pictograms, k = 0..4), `Win`, `Tool`, `Check`, `FlowCard`, `Rank`, `Bars`, `AppUI`, `Arrow`, `Bar`;
  `Footage` (filmed clips), `typed` + `Caret` (typing), `Fringe` (macro look), `HandAt` + `pressAt` (the 3D hand
  cursor), and the time helpers `E` (eased), `S` (spring), `clamp`, `mix`, `ease`, `rnd`, `rs`. Read the whole file once.
- **The contract** `film/src/types.ts` and `film/src/timeline.ts`: your file `film/src/shots/<id>.tsx` exports
  `export const PKG: Pkg = { id, Comp, sfx }`. `Comp` gets `t` = seconds since your package's first reference frame and
  draws one opaque 1920×1080 frame; it must be a pure function of `t`. Reference frame `n` (24 fps) is at
  `t = (n - f0) / 24`. **Every hard cut listed for your package happens exactly at its frame**: `t >= (cut - f0) / 24`.
- **The reference frames**: `python3 -I tools/ref.py strip A B out.png --step 1 --cols 8 --w 240` (from `films/kb-team`)
  draws frames A..B with numbers; `full N out.png`, `crop …`, `diff A B` (change per frame: when things start and stop).
  Coordinates in the reference are 1280×720: multiply by 1.5.
- **Side by side**: from `film/`: `python3 tools/compare.py <id> A B out/cmp.png --step 2 --cols 8 --w 240` renders
  your package and puts each reference frame above your frame at the same moment.

## How to work (usage is tight: be economical)
1. Look at your stretch of the reference ONCE at `--step 2` (two or three sheets), and at `--step 1` only around the
   moments you must time (arrivals, typing, clicks, flash cuts). Note the frames of every event.
2. Write the package in one go from your storyboard frames. Then compare side by side, fix, compare again.
3. **At most ten image views per package in total.** No exploring outside the files named here. Do not re-read big
   files. Do not npm install. Do not commit. Edit only your two `src/shots/<id>.tsx` files.

## Rules of motion
- 60 fps, smooth: the reference is drawn at 24 fps, we move on every frame along the same path and timing.
- Position moving things with `transform: translate3d(...)` (never time-dependent left/top, width, height, font-size);
  put `willChange: "transform"` on a block that slides or scrolls; constant-speed scrolls move a whole number of px per
  frame (speed a multiple of 60 px/s, offset from `Math.round(t * 60)`).
- Arrivals: springs with a small overshoot (`S`) for cards, pops and the logo; eased moves (`E`) for slides; hard cuts
  stay hard. Nothing holds dead still for more than about 0.5 s: something small keeps living (a caret, a slow push of
  a few percent, a pulse).
- Typed text appears character by character (`typed`), with the `Caret`; type at the reference's speed.
- The hand: `HandAt` with keys in your local seconds; first key off-screen (below or beside the frame) so it glides in;
  a click reacts at key time + 0.11 s (`pressAt`). The hand's size about 190–230 px; in the close shots (AE, AM) 300–330.
- Filmed shots: `<Footage name="AA" at={0.1 + tLocal} scale={1 + 0.02 * tLocal} />` (a slow push, as in the reference).
- Text on screen: exactly the words in the storyboard frames. Always "K.B". No other names, no URL.

## Sound events
Export `sfx: [{ t, kind, note }]` (t in your local seconds) for what would sound: `type` (the START of a typing run; put
the run's length in seconds in `note`, for example "1.0"), `click` (a hand click, at key time + 0.11), `tick` (each
flash cut), `pop` (a card or word landing), `swish` (a fast transition or zoom), `rise` (something opens or grows),
`sparkle` (light or data running), `thud` (the logo landing), `slide`. Few and true: the reference is sparing.

## The voice (film seconds; subtract your package's start, f0 / 24, to get local time)
0.32 "What if your business had the right team" (the 1.45, right 1.57, team 1.91) · 3.83 "for what comes next?" (for
3.78, what 4.06, comes 4.26, next 4.52) · 5.93 "K.B." · 7.55 "A team behind you." · 10.55 "Part of your business, with
the talent to take it further." · 14.74 "From the systems your team works with," · 18.21 "to the customers you reach," ·
23.53 "from early concepts" · 27.86 "to products people choose." · 31.08 "One shared vision." · 33.65 "One partner." ·
35.78 "Think big." · 36.87 "Build well." · 38.20 "Grow with us." · 39.50 "Your growth has a partner." · 41.38
"Involved." · 42.30 "From day one onwards." (day 42.36, one 42.64, onwards 42.98) · 45.00 "What could your next chapter
look like?" (your 45.58, next 45.86, chapter 46.10) · 48.14 "K.B."

## The packages (reference frames; FR = storyboard frame index)

**R01 · f0–f92 · cuts f64, f75** — FR 0, 1, 2, 3
- A f0–f41: paper ground. The three small words arrive one by one about 6 frames apart ("The", "right", "team"), centred
  as one line. Around f17 the portrait card opens between "The right" and "team" and pushes them apart; it grows to
  about 300×280 by f26; its picture changes at about f30 (another portrait) and at about f36 it becomes the first
  screen while the words fade and drift apart. Measure these frames in the reference ("Build", "an", "app" and the card).
- B1 f42–f63: FR 1 (the flow window) has grown out of the card, large, right of centre, still settling.
- B2 f64–f74 (hard cut): FR 2 (the dark ranking window), left of centre; something inside moves (the row, the bars).
- B3 f75–f92 (hard cut): FR 3 (the tall product card), centre, slowly shrinking.

**R02 · f93–f187 · cut f130** — FR 4, 5, 6
- D f93–f129: "For what / comes next": each word appears as it is spoken (see the voice times), set loosely like the
  reference's words (they jostle a little as the next arrives). The five portraits pop in around the words one after
  another between f93 and f112 (spring, small overshoot), each with its caption.
- E f130–f187: at the cut the five portraits are travelling into a centred row (FR 5), settled by about f138. From
  about f141 they close up into one square in the centre, which turns into the K.B tile by f148 (FR 6). The logo holds
  to f176 while two hairlines draw in (one vertical, one horizontal, as in the reference f174–f180). f180–f187: the
  logo softens and the ground lightens (the reference dissolves into paper before the hard cut at f188).

**R03 · f188–f264 · cuts f192, f196, f200, f205, f254** — FR 7, 8, 9
- F: four filmed flash cuts: f188–f191 `F1`, f192–f195 `F2`, f196–f199 `F3`, f200–f204 `F4` (Footage, each from at = 0.3).
- G f205–f243: `vig` ground. The caret blinks alone until about f222, then "Can you help" is typed (12 characters by
  about f243, 96 px, weight 400); place the line so the finished text is centred and letters never shift.
- Macro 1 f244–f253 (no cut in the reference, the picture just jumps): giant letters being typed: "au", "aut", "auto",
  "autom" (FR 9 look, with `Fringe`), about 3 frames a letter.
- Macro 2 f254–f264 (hard cut): giant "fo", "fol", "foll", "follo" in the same way, a different crop.

**R04 · f265–f384 · cut f295** — FR 10, 11, 12, 13
- I f265–f294: `ui` ground, the message box. The sentence is nearly typed at the cut and finishes by about f284. The hand
  glides in from the lower right and clicks the send button at about f288 (the button presses; ripple).
- J f295–f311 (hard cut): K.B glyph k=0 for f295–f300, glyph k=3 for f301–f306 (flash, centre, 300 px), then the first
  tool tile pops in the centre (f307–f311).
- K f312–f335: the tool tiles fly in from all sides to their places around the centre, the flow card builds in the
  middle (title first, then rows), cyan dots pop (about f326–f332).
- L f336–f384: the tiles are gone; the flow card alone, smaller (about 375 px wide), centre. Its four rows complete one
  after another (about f342, f354, f366, f376: tint and check). From f378 the card thins to an outline and grows
  (the reference turns to a wireframe before the cut).

**R05 · f385–f474 · cuts f387, f393, f396, f399, f402, f405, f408, f411, f414, f417, f420, f423, f426, f429, f431, f434** — FR 14, 15, 16
- M f385–f416: FR 14 full screen, a new arrangement at every cut (every 3 frames): different colours, avatars and
  bars in the cards; in the first cuts the outer cards are cyan placeholders, later all cards are filled; the row grows
  a little over the sequence (the reference ends on two rows).
- N f417–f433: giant letters of the word "found", a new crop at each cut: "f", "fo", "ou", "un", "nd", "d" (FR 15 look).
- O f434–f474: `ui` ground, the message box with the second sentence: at the cut it reads to "…in search and", the rest
  is typed by about f466; caret.

**R06 · f475–f556 · cuts f478, f484, f513, f528** — FR 17, 18, 19, 20
- P f475–f483: dark ground, the big circles (two framings: f475–f477 closer on the violet one, f478–f483 as FR 17),
  drifting.
- Q f484–f512: FR 18: the browser. The checklist lines appear one by one on the left; on the right the coloured
  circles travel toward the "Your business" card, which lights up.
- R f513–f527: `Footage name="R"`.
- S f528–f556: FR 20: the left 40% is `Footage name="S"` (place it with x about −820 so the hand and phone show); on the
  right the ranking: "Your business" climbs from the sixth place to the second between about f534 and f552, the rows it
  passes move down.

**R07 · f557–f662 · cuts f606, f610, f618, f622, f639** — FR 21, 22, 23, 24, 25
- T f557–f605: dark ground, the dark message box with its sentence. The four attachments load in above it one by one
  (a spinner ring, then the sketch thumbnail): about f566, f578, f590, f600.
- U f606–f621: flash cuts: f606–f609 the pencil sketch (FR 22), f610–f617 the same sketch with more notes and arrows
  drawn on, f618–f621 the wireframe (FR 23).
- V f622–f638: FR 24, the finished product; its cyan hotspots pulse in one after another.
- W f639–f662: `Footage name="W"`.

**R08 · f663–f732 · cuts f679, f699** — FR 26, 27
- X f663–f678: FR 26: the instruction is being typed (the last words arrive by about f676).
- Y f679–f698: a browser like FR 18's, with the K.B panel on the left (three short lines of text and a check) and the
  dark dashboard of FR 27 on the right, wide.
- Z f699–f732: FR 27 close: the bars grow, the tooltip moves along them, "74%" and "4.8" count up.

**R09 · f733–f832 · cuts f748, f760, f771, f787, f810** — FR 28, 29, 30, 31
- AA f733–f747 `Footage AA` with "Can you help us automate our follow-ups and keep the CRM up to date?"; AB f748–f759
  `Footage AB` with "Turn these sketches into an app our customers can use."; AC f760–f770 `Footage AC` with "We want to be
  found by the right customers, in search and in AI answers."; AD f771–f786 `Footage AD` with "Build us one dashboard for
  the whole operation." Each with a dark scrim (dim 0.3–0.4), the white line and the small cyan send button as in FR 28.
- AE f787–f809: paper ground, the one button (300 px), NAVY with a white arrow at first. The hand comes in from the lower
  right and clicks it at about f797; it turns cyan with a navy arrow (FR 30) and pulses.
- AF f810–f832: FR 31: the cards burst out of the button and rise: the first two by f818, then all of them travel
  upward fast while the button sinks out of the frame; a little blur on the fastest frames.

**R10 · f833–f961 · cuts f847, f871, f900, f925** — FR 32, 33, 34
- AG f833–f846: dark ground: the collage cards fly in and settle (FR 32).
- AH f847–f870: FR 33: the window on dark; f871–f899: the same window turned bolder: the big gradient picture fills
  the whole window, "Your product" large at the lower left, a row of six small cards along the bottom, the progress line
  moving.
- AI f900–f924: FR 34's canvas seen CLOSE (scale about 2 on its upper left part): numbers count, the "K.B" and "You"
  cursors move.
- AJ f925–f961: the whole canvas (FR 34), then slowly pulling back a little more; the cursors keep moving.

**R11 · f962–f1079 · cuts f1007, f1050** — FR 35, 36, 37
- AK f962–f1006: FR 35: the three check rows appear one after another while the block moves up a little; "Involved." is
  typed at about f993–f1004 (the voice says it at 41.38).
- AL f1007–f1049: FR 36: "Involved." is there; "From day one onwards." is typed word by word on the voice (42.30–43.75);
  a slow push in; `Fringe`.
- AM f1050–f1079: FR 37: the hand glides to the button and clicks at about f1063; the button presses and lightens.

**R12 · f1080–f1200 · cuts f1152, f1164** — FR 38, 39, 40
- AN f1080–f1151: `Footage name="AN"` with a slow push in and a scrim; "Your next chapter" is typed in white on the voice
  (45.5–46.5 film seconds), then the cyan caret blinks.
- AO f1152–f1163: FR 39: the five glyphs change every two or three frames; the cyan square jumps along the row.
- AP f1164–f1200: cyan full screen: the glyph row closes into the K.B tile in the centre by about f1172 (FR 40), which
  holds; one soft pulse.

## Report
For each package: what you built per shot, the frames you timed against the reference, your sfx list, the result of
`bash tools/smooth.sh <id>` if you ran it, and anything that differs from the reference or the storyboard.
