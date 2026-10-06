# WKConversions × bFound — partnership offer (39.5 s, voice-over, music, effects)

A SaaS-style partnership film in the Minimal Gradient SaaS look, built from both brands: WKConversions' blue glowing in from
one side, bFound's indigo from the other. Brief (Karl, 6 Oct 2026): focus on the collaboration between the businesses; code
BFOUND50 gives 50% off the €400 WKConversions startup price (€200) through the form on wkconversions.com/contact, instead of the
~€1,000 a motion designer often charges; median frame motion 4%; never show the commenters on the LinkedIn post.

The thread of the film is the cable between the two glass brand tiles. It links them, carries the film WKConversions made for
bFound into bFound's tile, arches over the LinkedIn response (the real post by bFound's founder; 118 reactions and 45 comments
as harvested; the comments anonymous), breaks the lock on the €1,000 price with both tiles pulling, feeds the referral-code
field (BFOUND50 typed letter by letter exactly as it is spoken), flanks the contact page and holds the end lockup.

## What is here
| Path | What |
|---|---|
| `deliver/wkc-bfound-partnership-40s.mp4` | The film: 1920×1080, 30 fps, 39.5 s, H.264 yuv420p BT.709 (TV range), AAC 48 kHz, −15 LUFS. 8-sample motion blur. |
| `storyboard/index.html` | The storyboard page (built by `storyboard/build_page.py` from `frames.json`). |
| `harvest/facts.md`, `harvest/pages/` | Every claim the film makes, with its source (both sites, the contact form, the LinkedIn post). |
| `assets/` | bFound's logo, site screenshots of bfoundconsulting.com and wkconversions.com/contact. |
| `vo/` | The voice-over and its forced alignment (`align.txt`; the code is aligned letter by letter), `words.json`. |
| `sound/` | `cues.json` (78 effects from the film's labels via `make_cues.py`; the library is `../wkconversions/sound/lib`), `music/ramp-it-up-fit.wav`, the mix sheet. |
| `film/` | The Remotion project (`node_modules` is a link to `../wkconversions/film/node_modules`; run `npm ci` for a standalone copy). |

## The Remotion project (`film/`)
- `src/clock.ts`: every beat as a label (seconds), leading its spoken word by about 0.13 s; `CODE_TIMES`, the spoken letters of the code.
- `src/Scenes.tsx`: every object (the two tiles and their cable, the bFound film and its timeline, the post and comments, the
  price, lock and businesses, the code field, the contact page, the end card) and the few headlines.
- `src/Story.tsx`: the 2.5D stage (a slow drift and tilt that never stops, a push per chapter), the layers. `src/Background.tsx`:
  the mesh gradient, the dot grid, the drifting chips, the grain. `src/ui.tsx`: glass tiles, windows, cables, glyphs, headlines.
- Draft: `npx remotion render Film out/draft.mp4 --props='{"blurSamples":1,"audio":"mix"}' --scale=0.5`
- Final: `bash scripts/render_chunks.sh Film out/final_master.mp4 '{"blurSamples":8,"audio":"none"}' 0,296,592,888,1185 public/audio/mix.wav`,
  then the TV-range BT.709 encode.

## Quality check (final encode)
Median frame motion 4.3% (target about 4%), moving in 100% of frames, longest still 0.0 s; 21 of 21 phrases bring a new
visual; −15.1 LUFS, true peak −1.3 dB. The busy check counts a median of 9 things on screen (references: Cartesian 7,
ClearScaler 26): the response beat (post, comments, reactions) and the contact page carry the most. The shake check flags four
spots, all looked at in strips: a cable pulse wrapping round (not a shake) and three ~1 px steps of slowly drifting text and
the lock, invisible at speed. Reports in `film/out/qc_final/` (not committed).

## Credits
- Voice-over: ElevenLabs, "Christina – Energetic Commercial Female", supplied by Karl.
- Music: "Ramp It Up" by Ahjay Stelino, Mixkit (mixkit.co), Mixkit Stock Music Free License (commercial use, no credit required).
- Effects: generated, royalty-free.
- Logos, fonts (Inter Tight, Inter; Instrument Serif), colours and copy: wkconversions.com and bfoundconsulting.com; the post text
  as published on LinkedIn by bFound's founder.
