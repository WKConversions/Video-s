# Scripts

Deterministic helpers for repeatable mechanical tasks; taste and art direction stay in the modules.
Fetch a script with the Artifact tool (`read`, the library URL, `path: "scripts/<name>"`) and copy the
saved file into the build folder.

| Script | What it does | Used in |
|---|---|---|
| `render.html` | render-page skeleton: stage, camera, easing helpers, font loading | `production/coded-render.md` |
| `render.mjs` | renders test frames, or every frame with motion blur | `production/coded-render.md` |
| `contact_sheet.py` | tiles test frames into one labelled sheet | `production/coded-render.md` |
| `motion_check.py` | measures how constantly and how much a video moves | `evaluation/quality-check.md`, `references/reading-references.md` |
| `motion_graph.py` | the movement graph Karl gets with every film: how much of the picture moves and how fast, through the whole film, under a filmstrip, with the still holds, the phrases and the beats marked | `evaluation/quality-check.md`, `production/output-format.md` |
| `reference_frames.js` | captures frames of an online video inside its page | `references/reading-references.md` |
| `site_extract.js` | extracts brand values, logo, images and text from a client's site | `design/asset-strategy.md` |
| `grab.js` | downloads a file from inside a page as base64 | `design/asset-strategy.md` |
| `stills.mjs` | renders a list of test frames from a Remotion project, bundled once | `production/remotion.md` |
| `render_chunks.sh` | renders a Remotion film in contiguous chunks, one tab each, in parallel, and lays the mix under it | `production/remotion.md`, `production/build-gotchas.md` |
| `cut_match.py` | compares the carried object's box across a cut | `production/build-gotchas.md` |
| `vo_align.py` | transcribes voice-over files and force-aligns the script for word timings | `planning/voice-over.md` |
| `vo_whisper.py` | word timings with faster-whisper, the script as prompt (more robust on synthetic voices than pocketsphinx) | `planning/voice-over.md` |
| `qc.sh` | runs the automatic checks on an encode (motion, shake, pops, busy, strips) and draws the movement graph, results in one folder | `evaluation/quality-check.md` |
| `jitter_check.py` | finds shake: motion that moves in steps instead of gliding | `evaluation/quality-check.md` |
| `handoff_check.py` | finds pops: a place that changes in one frame (a blink, a jump in size, a layer appearing) | `evaluation/quality-check.md` |
| `strips.py` | strips of frames around every transition, or around given frames | `evaluation/quality-check.md` |
| `sfx_index.py` | measures sound effects from their waveforms (sync point, hits, decay, loudness, pitch) and draws them | `motion/sound.md` |
| `sfx_build.py` | trims and files Karl's sounds by role into `sound/sfx/`, writes the index and catalogue | `motion/sound.md` |
| `sfx_synth.py` | generates whooshes, risers, impacts, a stamp, a shimmer and a swell with exact sync points | `motion/sound.md` |
| `sound_mix.py` | mixes voice-over, music and effects from a cue sheet, each effect on its frame, to −15 LUFS | `motion/sound.md` |
| `music_find.py` | finds royalty-free tracks by mood and tempo and measures them | `motion/sound.md` |
| `music_fit.py` | cuts a found track to the film: a lift on the turn, its real ending on the end card | `motion/sound.md` |
| `music_make.py` | composes a bed to a brief: tempo, key, vibe and sections by bar | `motion/sound.md` |
| `score_sampled.py` | composes an original score on a sampled chamber orchestra (VSCO 2 CE, CC0): a tempo map cut to the VO phrases, strings, harp, glock, winds, horn, pizzicato, swells; stems levelled, a hall; free of rights, no credit line. A template with a worked example (Tale Forge's waltz) | `motion/sound.md` |
| `score_check.py` | checks a composed score without listening: chord tones per bar, stem levels per bar, clicks | `motion/sound.md` |
| `sfx_kit.py` | a storybook / magical effects kit: recorded CC0 instruments (glock glissandi, wind chimes, bell tree, harp, pizzicato steps, bubbles, cymbal swell) and generated foley (page turns, book thump, stamp, pops, raindrops, whooshes, crayon, crickets, birds), sync points exact; merges into the index | `motion/sound.md` |
| `sfx_fairy.py` | generated fairytale effects (twinkles, shooting star, magic dust, bloops, page turn, door latch) and a night ambience bed; uses `sfx_synth.py` | `motion/sound.md` |
| `cues_from_labels.py` | writes the mixer's cue sheet from the film's timing labels and VO words, so every effect follows the picture when timing changes | `motion/sound.md` |
| `brand_measure.py` | measures brand colours from images, checks frames against them (ΔE2000), computes contrast | `design/asset-strategy.md`, `evaluation/quality-check.md` |
| `film_tells.py` | reports a film's tells: invented figures and names, filler words, decorative labels, held against the facts file | `evaluation/tells.md` |
| `timeline.ts` | a film's timing as labels and relative placements (GSAP's position parameter), for Remotion | `production/remotion.md` |
| `phrase_check.py` | splits the aligned voice-over into phrases (the shot list), and measures on a render that every phrase brings a new visual | `planning/phrase-by-phrase.md`, `evaluation/quality-check.md` |
| `kinetic.tsx` | the kinetic kit for Remotion: word-by-word type with marks, rolls, masks out of objects, the breathing camera, keyed tracks; from Karl's references, typed prompts, a dial selector, a split exit, drawn strokes, blooms and flips; the approved speed graphs (`EASE`, `whip`, `popElastic`, `bounce`, `speedRamp`, `stepper`, `flick`, `zoomThrough`) | `production/remotion.md`, `planning/phrase-by-phrase.md` |
| `storybook_kit.tsx` + `storybook_blot.png`, `storybook_grain.png` | the storybook kit for Remotion: paintings placed by focus point, light pools, watercolour blooms out of an object, full-frame page turns at the gutter, a rack focus across the gutter, paper grain; no drawn lines | `production/remotion.md` |
| `three_card.tsx` | a tested 3D scene for Remotion: a lit card with a soft shadow, frame-driven | `production/remotion.md` |
| `three_kit.tsx` | the 3D kit: a bright studio, a breathing camera, the logo as a real tile, a laptop, phone and panels with live interface screens (projected onto the 3D screens), frame-driven speed graphs | `design/three-d.md` |
| `stock.py` | searches royalty-free footage (Mixkit) and photos (Openverse, Pexels by ID), measures them, keeps credits | `design/asset-strategy.md` |
| `ref_sheet.py` | contact sheets of a reference video with true timecodes, an overview or a transition frame by frame | `references/reading-references.md` |
| `audio_look.py` | a sound file as a spectrogram over its loudness curve, with marks | `motion/sound.md` |
| `motion_probe.mjs` + `probe.tsx` + `motion_probe.py` | the motion probe: renders a Remotion film without pixels, logs every element's box and opacity per frame, and finds camera spikes, lurches, pops past size, flying and busy stretches; `--style calm/standard/energetic` | `evaluation/quality-check.md`, `motion/camera.md` |
| `mcp_call.py` | calls any configured MCP server's tools from the command line or a script (stdio and HTTP), with a device sign-in for servers that need one | `production/mcp-tools.md` |
| `busy_check.py` | counts the separate things on screen four times a second; busy when the median is above 6 or 8+ things fill more than 35% of the time (calibrated on Karl's references and K.B) | `evaluation/quality-check.md` |
| `ref_sound.py` | hears a reference's sound design: the music bed, the sound on each big move of the picture (against chance), the other effects; with the voice removed (Demucs) and the repeating music filtered out | `motion/sound.md` |
| `sfx_hear.py` | hears sound effects with an audio-language model: tone scales, style fit and what each sounds like, written into the index; `pick` ranks a role's sounds for a film's vibe | `motion/sound.md` |
| `map_make.py` + `maps.tsx` | the data and components for map animations: a dot map spreading from a place, country shapes with highlights, pins and routes | `design/maps.md` |
| `ae_read.py` | reads an After Effects project: every composition's keyframes, eases (with their Remotion equivalents), elastic expressions, text selectors, frame steps and hand-offs; `--sheet` draws the speed graphs | `motion/speed-graphs.md`, `production/after-effects.md` |

**Requirements.** Node with `playwright` and `sharp` in the build folder (tested with Playwright 1.56.0
against a pre-installed Chromium, and sharp 0.34.5); Python with Pillow, numpy and
opencv-python-headless.

**Also:** `stills.mjs` needs the Remotion project's own packages (run it from the project folder);
`vo_align.py` needs `pip install pocketsphinx` and ffmpeg, `vo_whisper.py` `pip install faster-whisper`; the sound scripts need ffmpeg, numpy, Pillow
and `pip install pyloudnorm`, and `sound_mix.py` reads the library's `sound/` folder.

**Usage.**
- `node render.mjs test 0,45,120` renders those frames to `test/` as PNG; `node render.mjs full 0 899 4 8`
  renders every frame to `frames/` as JPEG, with 4 parallel pages and 8 motion-blur samples (1 turns
  blur off). `PAGE` sets the page (default `render.html`), `SIZE` the frame (default `1080x1920`).
- `python3 contact_sheet.py` reads `test/f*.png` and writes `test/sheet.png`, 8 columns 216 px wide.
- `bash qc.sh film.mp4 qc/` runs motion, shake, pop and strip checks and draws `qc/movement.png`; read
  `qc/shake.txt`, `qc/pops.txt` and look at `qc/pops/*.png` and `qc/strips/sheet_*.png`. Run it from the project
  folder so the graph finds `src/words.json`; `MOTION_TONE=calm bash qc.sh …` sets its still limit. About 5 minutes
  for 45 seconds.
- `python3 motion_graph.py out/final.mp4 movement.png --words src/words.json --marks "0:Hook,4.2:Problem,9.8:Product"
  --tone calm` (or `confident`, `energetic`: the brief's row in `motion/timing.md`) draws the movement graph (the three motion numbers, a filmstrip, how much of the picture moves and how
  fast, the holds over the tone's limit, the phrases and beats); `--json` keeps the measurements. About 45 seconds per
  minute of film. Its numbers are motion_check.py's.
- `python3 jitter_check.py film.mp4 --png worst.png`: `SHAKE` lines are errors (regular steps, or many
  places at once); `look` lines are small irregular jumps to check in a strip. Exit code 1 on a shake.
- `python3 handoff_check.py film.mp4 --strips pops/ [--cuts 120,452]`: every `POP` comes with a strip,
  cropped to where it happened; designed hard cuts go in `--cuts`. Exit code 1 on a pop.
- `python3 strips.py film.mp4 strips/ [--at 140,146]`: without `--at` it finds the transitions itself.
- `python3 motion_check.py out.mp4 --profile` prints the three motion numbers (the last 2 seconds are
  ignored on films longer than 4 seconds) and, with `--profile`, one line per second.
- `bash render_chunks.sh Film out/final.mp4 '{"blurSamples":8}' 0,252,600,870,1110 public/audio/mix.wav`
  from the project folder: the boundaries are each chunk's first frame, then the total.
- `python3 sound_mix.py sound/cues.json public/audio/mix.wav --sheet mix.png [--music other.wav]`: cue
  format in the script's header; prints the level report (effects masked by the bed, effects crowding
  the voice) and the final loudness. About 10 seconds.
- `python3 music_find.py --mood calm,hopeful --feel calming,bright --bpm 85-115 --min 40 --out music/`
  downloads and measures candidates; read `music/candidates.png`.
- `python3 music_fit.py track.mp3 bed.wav --length 37 --lift 9.0 --sheet fit.png` prints the plan (the
  tempo, the start, the join, where each entry and the last chord land in the film).
- `python3 music_make.py brief.json bed.wav`: the brief format is in the script's header.
- `python3 -I score_sampled.py <vsco> score.wav --stems stems/` (copy it into the build and rewrite its TEMPO MAP and
  SCORE; the checkout of the samples is in its header), then `python3 -I score_check.py score.wav --stems stems/`.
  About 30 seconds for 70 seconds of music.
- `python3 -I sfx_kit.py <vsco> sound/lib` and `python3 -I sfx_fairy.py sound/lib` (with `sfx_synth.py` beside it);
  `python3 -I cues_from_labels.py cuelist.json sound/cues.json` (the cue-list format is in its header).
- `python3 audio_look.py mix.wav look.png --marks 9.0,25.0`.
- `python3 sfx_index.py <folder> waves/` measures every sound and draws the waveform sheets; then
  `sfx_build.py <folder> <library/sound>` and `sfx_synth.py <library/sound>`.
- `python3 brand_measure.py measure site.png logo.png --out brand.json`, then
  `python3 brand_measure.py verify out/test/f*.png --brand brand.json` and
  `python3 brand_measure.py contrast "#121212/#F6F4F1" "#FFFFFF/#BD1717"`. In brand.json, `palette`
  holds measured colours, `tokens` the film's colour tokens (name: hex), `accent` the brand's accent.
- `python3 phrase_check.py plan src/words.json` lists the phrases with their times (one visual each);
  `python3 phrase_check.py check out/draft.mp4 src/words.json --sheet phrases.png` flags STATIC phrases
  and the longest voice without a new visual; exit code 1 while any fail.
- `python3 film_tells.py films/<project>`: reads `harvest/facts.md` and `storyboard/thesis.md` when
  they exist; exit code 1 while tells are unanswered.
- `python3 stock.py search "tourist phone street" --kind video --out stock/`, then
  `python3 stock.py get stock/candidates.json 3,7 --to public/footage`; read `stock/candidates.png`.
- `reference_frames.js`: run it in the video's page, then `await sheet([0.5, 2, 3.5])` and screenshot the
  canvas.
- `site_extract.js`: run it in the client's page after scrolling once; it returns one object.
- `grab.js`: define it once in the page, then `await grab(url)` returns a data URL; the part after the
  comma is the file in base64.

Good candidates for future scripts: validating brief fields, converting timecodes between frame
rates, building a scene timing sheet from word timings, exporting reference thumbnails.
