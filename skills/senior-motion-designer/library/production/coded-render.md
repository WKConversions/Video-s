# Coded render

Build the video as code, rendered frame by frame, when the session has no After Effects. Coded builds
use Remotion by default (`production/remotion.md`), because Karl gets a project he can edit in
Studio. This module is the fallback when Remotion can't be installed or rendered, and its steps 1, 4
and 6 (timing to the recording, test frames, checking the encode) apply to both routes.

The plain page renderer produced all three versions of the September 2026 WKConversions ad, and a
900-frame draft re-render took about 30 seconds. The result is an MP4, not an editable project: say
so, and offer an AE hand-off spec (`production/after-effects.md`) if the film will be finished in After
Effects. The scripts are in `scripts/` (`scripts/index.md`).

## 1. Time it to the recording

Check length and pauses with `ffprobe vo.mp3` and
`ffmpeg -i vo.mp3 -af silencedetect=noise=-35dB:d=0.18 -f null - 2>&1 | grep silence_`, then get word
timings and place key hits on the words (`motion/timing.md`). If the recording's pacing doesn't match
the plan, split it at the pauses and place each line on its scene's frame instead of stretching the
animation.

## 2. Keep fonts, assets and tools local

- Install the brand fonts in the build folder (for example `npm i @fontsource/inter-tight @fontsource/inter`)
  and point `@font-face` at the .woff2 files in `node_modules`; font CDNs are often unreachable from a
  sandbox.
- Load every face with `document.fonts.load()` before `setup()` measures anything, as the skeleton
  does. `document.fonts.ready` alone can resolve before a face that no element uses yet has loaded, and
  text built in `setup()` is then measured in a fallback font; this happened in the WKConversions intake
  video.
- Install Playwright and sharp in the same folder, in one command (`npm i playwright sharp`); a later
  `npm i` removes packages that `package.json` doesn't list. If launching reports a missing browser
  executable, pin Playwright to the version the pre-installed Chromium belongs to (`npm ls -g playwright`)
  or pass `executablePath` to `chromium.launch`.

## 3. One page, one pure function

Start from `scripts/render.html`: a page at the exact output size, every element absolutely positioned,
and a `render(f)` that sets every element's state from the frame number alone. No CSS transitions or
animations, timers or unseeded randomness, so any frame renders on its own and frames render in
parallel. `f` can be fractional, because motion blur samples between frames. The whole scene sits
inside one camera element under a CSS `perspective`, transformed every frame, so the camera can move
through every shot (`motion/camera.md`). The easing helpers are the named curves (`motion/easing.md`).

Build this page first, then render one settled frame per beat for the storyboard, so the frames Karl
approves are exactly what gets animated.

## 4. Test frames before the full render

`node render.mjs test 0,45,120` renders chosen frames to `test/`, and `python3 contact_sheet.py` tiles
them into a labelled `test/sheet.png`. Render each beat's settled state, mid-transition moments, the
first and last frame, and every text change at 2-frame steps; look at the sheet, fix, repeat. The
checks are in `evaluation/quality-check.md`.

## 5. Render, mix, encode

- Render every frame with motion blur: `node render.mjs full 0 899 4 8` (4 parallel pages, 8 samples
  per frame across a 180° shutter). That takes about half a second per 1080p frame, around 12 minutes
  for a 45-second film; use 1 sample for quick drafts. Set `PAGE` and `SIZE` (default `1080x1920`) as
  needed.
- Mix the voice-over lines and any sound effects into one 48 kHz WAV exactly as long as the video
  (numpy and wave are enough; `motion/sound.md`).
- Encode:
  `ffmpeg -framerate 30 -i frames/f%04d.jpg -i mix.wav -c:v libx264 -preset slow -crf 17 -pix_fmt yuv420p -profile:v high -movflags +faststart -c:a aac -b:a 192k -ac 2 -af "loudnorm=I=-15:TP=-1.5:LRA=11" -ar 48000 -shortest out.mp4`
  Keep `-ar 48000`: `loudnorm` resamples to 192 kHz, and without it the file comes out at 96 kHz.

## 6. Check the encode

Make contact sheets of the finished MP4,
`ffmpeg -i out.mp4 -vf "fps=2,scale=160:-2,tile=15x4:padding=3:color=white" qc_%02d.png`, run
`python3 motion_check.py out.mp4 --profile`, and work through `evaluation/quality-check.md`. Revisions
go through the same code.
