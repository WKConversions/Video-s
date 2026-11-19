# Reading the reference: instructions for the shot readers

You read one stretch of the reference film frame by frame and write down exactly what happens, so that another
designer who never saw the film can rebuild every shot for K.B with the same composition logic, timing and motion.
Read `plan/brief.md` first (what the job is, the shot overview, the script mapping).

## What you cannot do, and what to do instead
You cannot watch video. You see frames. So work from the frames, and **measure** wherever a number is needed:
- `python3 -I tools/ref.py strip A B out.png --step 1 --cols 6 --w 320` makes a labelled contact sheet of frames A..B
  (frame number and time on each tile, "CUT" on the first frame after a hard cut). View it with the Read tool.
  Use `--step 1` around every change (arrivals, cuts, typing, clicks); `--step 2` or `3` only for calm holds.
  Save your sheets under `reference/strips/<your id>/`.
- `full N out.png` gives one frame at 1280×720; `crop N x y w h out.png --scale 3` enlarges a region (read small text,
  see a cursor, compare two frames of a moving thing); `color N x y` samples a colour; `diff A B` prints how much of
  the picture changes into each frame (motion onsets, holds, the cadence: animated on ones, twos or threes).
- For positions and sizes, measure with OpenCV / numpy / PIL in a small script (threshold the element, take its bounding
  box, track it over frames). Put scripts in your scratchpad, not in the repo.
All frame numbers are reference frames at 24 fps (time = frame / 24). All coordinates are 1280×720 pixels.

## What to write: `plan/ref/<your id>.md`
Start with one line: your id, the frame range, the time range. Then one block per **shot** (a shot runs from one hard
cut to the next; split a long shot into phases if its picture changes completely). For every shot:

```
### <shot id> · f<first>–f<last> · <t0>–<t1> s · <a three to six word name>
PURPOSE: what the viewer is meant to understand or feel here (one sentence)
REFERENCE VOICE: the words spoken during it (from plan/brief.md), with the frames they fall on
GROUND: background colour(s) (hex, sampled), texture, vignette, faint motifs (leaves, hairlines, grain), light or dark
ELEMENTS, bottom to top: for each: id · kind (text, image card, photo, UI, footage, shape, cursor) · exact content (every
  word on screen, spelled as shown) · box at rest [x, y, w, h] · style: for text the weight, size in px (cap height or
  x-height measured), tracking, colour hex, alignment; for cards the corner radius, border, shadow; for UI the regions
  and what is in each, with proportions and colours
MOTION: a table, one row per move: element · frames (start–end) · from → to (position, scale, opacity, rotation, blur,
  crop) · the curve as measured (values per frame: fast start and slow end? overshoot? linear?) · stagger to its
  neighbours. Include typing (characters per frame, where the caret is, its blink), counters, swaps, flashes.
CADENCE: are new drawings on every frame, every second, every third? any held frames?
CAMERA: push, pull, pan, zoom-through, none; scale factors over frames
CURSOR: where it is on each key frame, when it clicks, what reacts and on which frame
TRANSITION IN / OUT: hard cut, match cut (what carries over, where), dissolve (frames), flash, zoom-through
SOUND MOMENTS: frames where the picture surely has a sound (a click, each typed character, a card landing, a cut)
LIVE ACTION (only for filmed shots): subject, what they do, framing (wide, medium, close; angle), lens feel (depth of
  field), light and colour grade, camera movement, what changes over the shot, where text sits over it
WHY IT WORKS: the craft reason, in one or two sentences
FOR K.B: one or two concrete ideas for the same shot with K.B's content (the lead decides; keep K.B's rules)
```

Be exact and complete rather than elegant. Numbers beat adjectives: "slides 96 px in 5 frames: 40, 28, 16, 8, 4" is
useful; "slides in smoothly" is not. Where you inferred something you could not measure, say "inferred".
If a moment is unclear on the small frames, look at the full frame or a crop before you write it down.

## Your reply
A short summary (it goes to the lead): the shots you found (id, frames, name), the three most important things a
builder must get right in your stretch, and anything you could not determine.
