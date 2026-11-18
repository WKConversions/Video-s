# K.B hero film: the smoothness pass (third brief for the scene builders)

The motion pass worked: the film now measures 4.5–4.9% (target 4%), and the scenes look good. One fault is left, and
it is in almost every scene: **things step instead of glide.** The full 60 fps render fails the shake check (SHAKE,
JUDDER and STUTTER lines). The cause is how moving things are positioned. This pass fixes that and nothing else:
**no change to the look, the timing, the hand keys or the sound events.**

## Why it steps (measured on earlier films)
- A box positioned with `left` / `top` (or margin, padding, a spacer's height, `backgroundPosition`) is snapped by the
  browser to whole pixels. A list scrolling at 140 px/s should move 2.33 px a frame; snapped, it moves 2, 2, 3, 2, 2, 3:
  that is the judder. An eased move snaps at its slow end (0, 1, 0, 0, 1 px).
- Text that is laid out again every frame (animated font-size, width, letter-spacing) trembles.

## The rules
1. **Everything that moves is moved by `transform`**: `transform: translate3d(${x}px, ${y}px, 0)` (plus scale/rotate in
   the same transform). `left` / `top` only hold the element's fixed home position (constants, not functions of `t`).
   This includes scrolling lists and feeds, streaming rows and cards, code that scrolls, chart areas that stream,
   travelling chips, odometer digit columns, bars that re-rank, cards that slide, progress-driven offsets.
2. **Constant-speed scrolls move a whole number of pixels per frame.** Make the speed a multiple of 60 px/s (120, 180,
   240, 300, 360, 420, 480 …) and compute the offset from the frame number, so it cannot drift:
   `const off = Math.round(t * 60) * (SPEED / 60)`. Pick the multiple nearest to the current speed. A looping feed wraps
   by a whole number of pixels too (make the loop length an integer).
3. **Give each steadily or slowly moving block its own layer:** `willChange: "transform"` on the element that carries
   the transform (the scrolling container, the sliding card, the digit column), not on its children and not on
   everything. A layer is drawn once and then placed at sub-pixel positions, so slow tails stay smooth.
4. **Do not scale a parent while its children scroll** (a scaled parent turns whole pixels into fractions). If a window
   springs in with a scale, that is fine at the start; from then on it stays at scale 1 while its content scrolls.
5. **Never animate layout:** no time-dependent `width` / `height` / `fontSize` / `letterSpacing` on text or on boxes that
   contain text. Grow a bar or a fill with `transform: scaleX(...)` and `transformOrigin: "left"`, or keep an animated
   `width` only on plain coloured blocks without text or neighbours that it pushes.
6. **No held frames in the middle of a move:** an offset computed with `Math.floor` of a slow counter, or a state that
   switches on a threshold, can repeat a frame. Positions are continuous functions of `t` (rule 2's rounding to the
   frame number is fine: every frame is a new position).

## Flagged in the film (film seconds → your scene's local seconds)
- **A / S1:** SHAKE 0.27–0.88 (left middle: the first role card arriving), SHAKE 2.55–3.22 (the stack folding into the
  tile, right of centre), a STUTTER at 3.08 (one frame held in the middle of motion), smaller jumps 1.4–2.05 and 3.2–4.1.
- **B / S3:** JUDDER over the whole scene (the two scrolling columns: 140 px/s is 2.33 px a frame). **S5:** SHAKE
  0.3–2.25 in many places (the falling cards and the scrolling Resolved list). S4: check it.
- **C / S6:** small jumps 0.55–1.5 (the build window). **S8:** jumps of up to 9 px 0.75–2.0 (streaming chart, bars
  re-ranking, table rows). S7: check it.
- **D / S9:** SHAKE 0.25–0.85 (centre). **S10:** jumps and SHAKE 0.1–1.8 (rank cards, answer lines). **S11:** SHAKE
  2.2–3.35 (the playing page in the player and the format cards).
- **E / S12:** SHAKE and jumps 0.15–2.3 in several places (scan band, assembling blocks, streaming chart and status
  strip). S14: check it. S13 is the lead's.

## Checking
`bash tools/smooth.sh <group> <Scene>` renders the scene at full size in one tab and runs the shake check (1–2 minutes
each; run one at a time). The goal: **no SHAKE, JUDDER or STUTTER line**; "look" lines are small and acceptable. Run it
before you change anything to see your scene's own list, then after. The checker tracks texture: a stream of
identical rows can fool it (it may match a row to its neighbour). If a SHAKE remains on a stream that is moved by
transform, on its own layer, at a whole number of pixels per frame, stop there and report it with the reason.
Also re-run `python3 tools/norm.py` on a clip of each scene you touched: the motion norm must stay at its target
(scenes without a headline 4.5%, with a headline 3%); rounding a scroll speed to a multiple of 60 px/s barely moves it.
Look at one 8-frame sheet per changed scene to confirm nothing moved out of place.

Edit only your own `src/scenes/<group>.tsx` and `<group>_*.tsx`. Do not commit. Report per scene: what you changed,
the shake check before → after, the norm after, anything unresolved.
