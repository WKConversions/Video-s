# Quality check

Verify what was built against the plan and the targets. The art-director pass judges the ideas; this
module checks the execution. You can't watch video, so check through stills, frame strips, contact
sheets and measurements (how to render them: `production/coded-render.md`).

## When

1. **Test frames, before the full render:** each beat's settled frame, mid-transition moments, the
   first and last frame, and every text change.
2. **The finished encode, before anything is sent:** contact sheets of the MP4, the motion check, the
   delivery checks. Check the encode, not just the code.

Work through the passes in order: if a still is weak, fix the design before polishing motion.

## Pass 1: Communication

- Does each settled frame show what its line means, to someone seeing it for the first time?
- Does each beat's point read with the sound off?
- Is any scene too abstract, or merely illustrating nouns?
- **Every phrase visualised:** `python3 scripts/phrase_check.py check film.mp4 src/words.json --sheet
  phrases.png` on the draft and on the final encode. Every phrase brings a new visual, and no more
  than 2.5 seconds of voice passes without one (`planning/phrase-by-phrase.md`). A STATIC phrase is
  fixed in the design, with a new visual event on its key word, not by adding drift.

## Pass 2: Static design

Look at the settled frames as stills: hierarchy, alignment, spacing, typography, color, negative
space, focal point, crop, accidental tangencies, and consistency with the style and brand.

## Pass 3: Motion

- Dominant motion, overlap, stagger logic, velocity, easing, anticipation, settle, motion blur on
  fast moves, unnecessary movement.
- The camera never locks and never wanders.
- **Smooth first: run the motion probe on every build** (`node scripts/motion_probe.mjs out/probe.jsonl`, then
  `python3 scripts/motion_probe.py out/probe.jsonl --style calm|standard|energetic`). It reads the exact box and
  opacity of every element in every frame and reports what Karl sees as spikes: CAMERA (the camera pans or
  zooms too fast or abruptly), LURCH (something on screen jumps from still to fast), OVERSHOOT (a pop in a clean
  film), FLYING (something circles or swings fast for seconds) and BUSY (several separate motions at once for a
  second or more). Calibrated on K.B: v2, where Karl named the spikes, shows 16 camera spikes and 25 pops; v3,
  which he and the client approved, shows none, and its one BUSY moment is the one he still found busy. Fix
  every CAMERA, LURCH, FLYING and OVERSHOOT line before the final render; make each BUSY moment calmer.
- **Clear before busy: count the things on screen** (`python3 scripts/busy_check.py film.mp4`, also part of
  `qc.sh`). Karl found K.B v3 "a bit too busy so you can't see what's happening", and the cause wasn't motion: his
  25 reference films keep a median of 4 separate things on screen (3–7) and have 8 or more for a quarter of the
  time; K.B kept 9, with 8 or more for 64% of the time, each small (11% of the frame covered against 26%). A
  `BUSY` result or a `CROWDED` stretch means fewer, bigger things: merge a row of small items into one, let a
  thing leave before the next arrives, make the subject larger. Plan for it at the storyboard: count the separate
  things in each frame (a headline is one, a card is one, five icons are five).
- Choose each move's speed graph for its moment (`motion/speed-graphs.md`), not one curve for everything.
- Run `scripts/motion_check.py` on the encode: something moves in at least 90% of the frames and nothing holds
  still for more than 0.8 seconds before the end card. How much of the frame moves is information, not a target
  (K.B v3, approved: 1.7%; the reference films: 0.5–6.6%, median 3.5%). Never raise it with the camera: the
  October 2026 3% target was reached with camera moves, and those were the spikes. Liveliness comes from the
  content (a second layer moving inside a scene), within the probe's limits.

- **Run the automatic checks** on the draft and again on the final encode: `bash scripts/qc.sh film.mp4
  qc/` from the project folder (it also draws the movement graph). They find what the eye only catches at
  full speed, after delivery:
  - **Shake** (`jitter_check.py`): motion that moves in steps instead of gliding. A `SHAKE` line is an
    error. The usual cause is an element placed with `left`/`top` under a zoomed camera: box offsets snap
    to whole pixels, so position anything that moves with a transform.
  - **Pops** (`handoff_check.py`): a place that changes in one frame, where nothing moves to explain it.
    Look at every strip it writes. A blink (a layer hidden one frame before the next one shows), a
    carried object redrawn at a different size, a mask that stops clipping, or a layer appearing without
    a move is a bug; a designed text change or hard cut can be passed over.
  - **Transition strips** (`strips.py`): every transition, every 2 frames. Read them all, looking for two
    texts overlapping, a jump in size or position, and anything that blinks.
  These found the hook shake, the labels that jumped as cards left the wall, and the phone that blinked
  before splitting into four: three defects that had reached Karl or a delivery.
- **Motion gaps.** List every change of state in the film (a text swap, a color change, an element
  appearing or leaving, a value updating) and check that each one moves. A change that snaps from one
  frame to the next, with nothing carrying it, is a gap; it reads as a glitch more than as a cut.
- **Hand-offs.** For every scene change that carries an object across, compare the two frames around
  the cut (`scripts/cut_match.py`); the object's box must match within 2 px.
- **Blur quality.** Step through the fastest moves frame by frame; separate copies instead of a smear
  mean the move needs more frames or more samples.
- **Review slowly, then fresh.** Step key transitions at 2-frame intervals, then look at the whole
  contact sheet again after other work; problems invisible at full speed show up both ways.

## Pass 4: Rhythm

Read the film through: the 2-frames-per-second contact sheet top to bottom, and the movement graph
(`scripts/motion_graph.py`, drawn by `qc.sh` as `qc/movement.png`): how much of the picture moves and
how fast the fastest thing moves, through the whole film, under a filmstrip, with the phrases and beats
marked. Look for monotony (a flat line), rushed sections, dead sections (a dip to zero, a red hold),
over-dense sections, missing contrast in tempo and density, speed that jumps without an ease (a
flat-topped block with vertical walls; confirm it with the motion probe), and important ideas without
room to breathe.

## Pass 5: Continuity

Against the continuity table (`motion/continuity.md`): the scenes connect visually, transitions stay
within the film's family, direction carries across, recurring motifs work, and the film reads as one
authored system. Sample every scene change every 2–3 frames.

## Pass 6: Typography

- Readability, line breaks, hold duration (each text's settled hold against the rule in
  `design/typography.md`), over-animation, hierarchy, and spelling against the script
  and the client's own names.
- **Overlap:** render every text change every 2 frames across its transition and inspect the strip;
  two lines of type must never overlap.
- **Size where it plays:** scale the settled frames to 900 px wide (a website section) and 400 px (a
  phone). Everything the viewer must read survives 900 px; each line's key word or number survives
  400 px (sizes in `design/visual-hierarchy.md`).
- **Fonts:** the glyphs are the brand font, not a fallback.

## Pass 7: Polish

Only now: micro timing, subtle shadows, blur, textures, secondary animation, tiny alignment issues,
edge cases.

## Delivery checks

- Frame rate, resolution and aspect ratio as planned:
  `ffprobe -v error -show_entries stream=codec_name,width,height,r_frame_rate,sample_rate -of compact out.mp4`
- Safe areas: key text at least 80 px from the sides and 100 px from the top and bottom (at 1080 px
  wide; scale for other sizes). In 9:16 social video, also keep headlines and key UI clear of the bottom fifth, the top
  eighth and the right edge, where platform captions and buttons sit.
- The end card follows its rule in `motion/animation-grammar.md`.
- Audio at 48 kHz, loudness-normalized, without clipping, and exactly as long as the video.
- Words and brand: `scripts/film_tells.py <project>` answered line by line (`evaluation/tells.md`);
  `scripts/brand_measure.py verify` on the test frames (no frame off-brand without a reason, the
  accent where the thesis puts it); `brand_measure.py contrast` for every text colour on its
  background, at rest and in the middle of its entrance (type fading in over a photo passes through
  unreadable frames: give it a scrim or a solid card).
- **The movement graph goes with the film.** Every draft and final reaches Karl with its movement
  graph: `qc/movement.png`, or `python3 scripts/motion_graph.py out/final.mp4 movement.png --words
  src/words.json --marks "<beat starts>" --tone calm|confident|energetic` (the brief's row in
  `motion/timing.md`). He sees how much moved and where
  without counting frames; send it with the film, never instead of a fix it shows is needed.
- Report what ran, what passed, and what couldn't run. A check with nothing to check (no facts file,
  no audio, no brand file) is "not checked", never "passed".
- Sound (`motion/sound.md`): the mixer's report says every effect clears the bed and none crowds the
  voice; on the mix sheet each effect's mark sits on its picture event, and the effects match the
  brief's density; the music's sections land on the film's turns (`audio_look.py --marks`); no Apple
  sound in a client mix; the track and its licence are credited in the README.
- The logo: the right version, undistorted, with clear space.
- Nothing missing: fonts, assets, and in After Effects, broken expressions, missing footage and color
  management.
- Every claim on screen matches the client's own material; nothing invented.

## Severity

Rank every finding before fixing, and fix from the top:
- **Critical, never ships:** a line whose meaning doesn't read; a page that holds while the voice
  explains it (a phrase with no new visual, or more than 2.5 s of voice without one); invented facts;
  unreadable text where it plays; overlapping type; a frozen frame; a visible jump at a cut; audio out of sync or clipping;
  a wrong logo or brand color.
- **High:** a locked camera; one framing distance; a crossfade between layouts; motion gaps; the same
  entrance three times in a row; missing secondary motion; the motion check below target.
- **Medium:** missing arcs or counter-motion; blur stepping on one move; a settle a few frames short;
  small alignment or spacing issues.

Report findings as Before / After / Why rows (`evaluation/troubleshooting.md`).

## Red flags

Any fingerprint in `design/anti-ai-design.md`, and:
- the tempo never changes (a working hold is a change of tempo; a frozen frame is not),
- a frozen frame anywhere, end card included,
- UI at an unreadable scale,
- scenes that look like unrelated templates.

## Finish

Score the render with the scorecard in `evaluation/art-director.md`, make the three changes that would
most improve perceived professional quality, and only then polish low-impact details and deliver.
