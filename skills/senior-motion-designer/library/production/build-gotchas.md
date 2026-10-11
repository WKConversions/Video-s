# Build gotchas

Where coded builds have actually gone wrong. Self-check the project against every item before the
full render; each one cost a re-render or a broken delivery once. Add to this list when a build finds a
new one (the learning loop in `examples/corrections.md` covers taste; this file covers mechanics).

## Picture

- **Match every hand-off by measurement.** When one scene's camera starts on the previous scene's
  object (a zoom out of a number, a card carried across), compute the new camera from the old
  scene's end state, render the last frame of one and the first of the next, and compare the bounding
  box of the object on both (`scripts/cut_match.py`). Font side bearings and line-box centering are
  off by tens of pixels even when the math is right; correct by the measured difference and note it
  in the code.
- **Zoom on a log scale.** A 17× → 1× zoom interpolated linearly races at the start and crawls at the
  end. Interpolate the logarithm of the scale, and keep the camera's focus on the tracked object
  while its screen position glides to its final place; interpolating the focus point and the scale
  separately makes the object drift off screen mid-move.
- **One clock for shared parts.** When a second composition adds its own timing labels, shared components
  (captions, `rise`) still resolve labels from the main clock: merge the new labels into it (under the old ones),
  or they fail with "no label".
- **Measure text only after the fonts load.** Gate the component on the font promise with
  `delayRender` / `continueRender` before `measureText`, or layouts are measured in a fallback face.
  Letter-spacing is added after each glyph, including the last: subtract one spacing to find a glyph's
  visible width.
- **Things you carry across scenes must be drawn the same way on both sides.** Same size (convert
  screen sizes into the next camera's world units), same border, same padding, same text wrap. Draw
  the carried object in a container scaled by the inverse camera scale rather than re-laying it out.
- **Elements that leave must leave the frame.** After a pull-back, anything that "exited" to a
  position that is now inside the wider framing reappears. Check exits at the widest framing the
  scene reaches.
- **Masks, not pops.** An element that belongs to a page being revealed goes inside that page's
  reveal mask, or it pops in on its own.
- **Hand an object over to its copies on the same frame, and back only once the original covers them.**
  One phone that becomes four: hide the original on the frame the copies appear, start them exactly on
  top of it, and fade copies 2 to 4 in as they leave (stacked, their shadows add up and darken in one
  frame). On the way back, bring the original to full opacity above the copies first, fade the last copy
  out under it, then remove them; at 75% the copies' colours vanish at once, and a copy removed at full
  opacity takes its shadow with it. `handoff_check.py` finds all three; the strip shows them only as a
  darker outline or a tint.
- **Never clamp a share of an eased curve.** `clamp01(k * 1.15 - i * 0.05)` cuts the ease off at 87%,
  while the element still moves fast: it stops dead (sharp after blurred frames) and on the way back it
  starts at full speed. Give each element its own eased span, staggered, instead.
- **Motion blur can step.** At 8 samples a move of more than about 150 px per frame shows separate
  copies. Lengthen the move, or raise the samples for those frames.
- **Place anything that moves with a transform, never `left`/`top`.** Box offsets snap to whole pixels:
  under a camera zoom, a slow push or a slow drift the element moves in 1 px steps while its neighbours
  glide, and it shakes (a background photo, a caption word, a background glow). `jitter_check.py`
  reports it as a `SHAKE` with regular steps.
- **Slow text still steps a pixel at a time, even with transforms,** because glyphs are drawn on
  whole pixels; motion blur doesn't hide it (on a slow move all 8 samples land on the same pixel).
  Give slowly moving text its own layer (`will-change: transform` on the moving span), then render in
  contiguous chunks, one tab each (`scripts/render_chunks.sh`): with `--concurrency` above 1, Remotion
  gives neighbouring frames to different tabs, each layer keeps a sub-pixel offset that depends on its
  tab's history, and the text trembles ±0.85 px from frame to frame (measured on the GoHere captions:
  one tab glides 0, −0.1, −0.2, −0.3, −0.6 px a frame; four tabs alternate +0.85, −0.87, +0.46, −0.91).
  A layer recreated every frame snaps again, and a tiny rotation only half-helps.

## Sound

- **A long workflow can outlive a container restart.** Before redoing background work after a restart, check
  whether its agents are still writing (recent files, the task list); two writers on one file overwrite each
  other. Stop the duplicate first; a generator that writes a shared index merges it instead of replacing it.
- **Samples from a big git repository:** clone with `--filter=blob:none --no-checkout --depth 1`, list files with
  `git ls-tree -r --name-only` (never `-l`, which downloads every blob for its size) and check out only the folders
  you need with a sparse checkout. Check a sample folder's octave naming by pitch detection before using it.
- **Audio goes outside the motion-blur wrapper.** `CameraMotionBlur` renders its children once per
  sample; audio inside it can play several times over. Put every `<Audio>` in a sibling of the blur
  wrapper.
- **Check every voice-over file before placing it.** Files arrive as alternate takes, partial takes and
  out of order. Transcribe each one and match it to the script before timing anything
  (`planning/voice-over.md`).
- **Mix with `scripts/sound_mix.py`** (`motion/sound.md`): its output is already −15 LUFS with peaks
  under −1.5 dB, at the film's exact length; encode it as it is, without a second `loudnorm`. A plain
  voice-over without the mixer: normalize at encode, `loudnorm=I=-15:TP=-1.5:LRA=11` with `-ar 48000`,
  cut to the film's exact length with `-t`.
- **ffmpeg's own stereo-to-mono downmix sums the channels:** a peak read from `-ac 1` is up to 6 dB too
  high. Decode stereo and average it yourself (the sound scripts do).

## Encode and tools

- **Remotion writes full-range video** (`yuvj420p`). Re-encode deliveries to `yuv420p`, TV range,
  BT.709 (`-vf "scale=in_range=full:out_range=tv,format=yuv420p" -colorspace bt709 -color_primaries
  bt709 -color_trc bt709`), or players show crushed or washed-out color.
- **Playwright's bundled ffmpeg can't decode H.264.** For probing and encoding, install a full build
  (`pip install imageio-ffmpeg` gives a static binary).
- **Don't `pkill -f` or `pgrep -f` a pattern that appears in your own command.** A wait loop that
  checks `pgrep -f "remotion render"` finds itself and never ends; kill by process id, or wait on the
  output file.
- **Render test frames from one bundle.** Bundle once and render a list of stills
  (`scripts/stills.mjs`): 36 frames take under a minute, where one `remotion still` call per frame
  takes that long for a few.

## Time budget (4 CPU cores, 1920×1080, 30 fps, 900 frames)

| Render | Time |
|---|---|
| 36 test stills, no blur | under 1 minute |
| Full draft, no blur | about 1.5 minutes |
| Full final, 8-sample motion blur | about 16 minutes |

A 70-second film (2100 frames) drafts in about 4–9 minutes with `render_chunks.sh` in four chunks.

Draft first and check timing and sync on the draft; spend the blurred render once. When Karl is waiting for a
revision, deliver the draft-quality render as the preview and say the motion-blur pass was skipped.
