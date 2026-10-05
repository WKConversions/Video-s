# Wicflow — "AI at work" (37.5 s, voice-over, music, effects)

A bright brand film for Wicflow (wicflow.com), in the concept Karl picked from the Cartesian hero and our ClearScaler film
(one isometric world that models the domain, a status chip, captions built word by word, paths travelling the world, a
scale-out, a calm logo end), redrawn in Wicflow's own white, ink and service tints and spiced up in motion and colour.
Built with the senior-motion-designer skill: site harvest → reference read → a three-concept panel judged on three lenses →
Remotion build → five independent art-director reviews → fixes → QC → delivery.

## What is here
| Path | What |
|---|---|
| `deliver/wicflow-ai-at-work-37s.mp4` | The film: 1920×1080, 30 fps, 37.5 s, H.264 yuv420p BT.709 (TV range), AAC 48 kHz, −15 LUFS. 8-sample motion blur. |
| `storyboard/index.html` | The storyboard page: the film, the direction, a frame per phrase, the revision log, open questions. Built by `storyboard/build_page.py` from `frames.json`. |
| `storyboard/plan.md`, `thesis.md`, `brief.md` | The production plan (every phrase's visual event, with times), the thesis and its allowed patterns, the brief. |
| `storyboard/concept_*.json`, `storyboard/review/` | The three concepts from the panel; draft v2 and its contact sheets as reviewed. |
| `harvest/facts.md`, `missing.md`, `pages/` | Every claim the film may make, with its page; what the site lacks; the text of the pages. |
| `brand.json`, `assets/` | The brand measured from the site's CSS; logo (PNG and the traced SVG), fonts, tool logos, site screenshots. |
| `vo/` | The voice-over (ElevenLabs, "Christina – Energetic Commercial Female"), its forced alignment (`align.txt`, `words.json`). |
| `sound/` | `cues.json` (66 effects, generated from the film's labels by `make_cues.py`), `music/its-love-fit.wav` and the alternatives, the generated effects library `lib/`, `music-notes.md`, the mix sheet. |
| `film/` | The Remotion project. |

## The Remotion project (`film/`)
```
cd films/wicflow/film
npm i
npx remotion studio            # composition "Film"
```
- `src/clock.ts`: every beat as a label in seconds, relative to the voice-over's words (`src/words.json`). Retime by moving labels.
- `src/map.ts`: the world's geometry (the business, the track, the market, the CRM, the tool plot, the team and desk, the copies,
  the routes). `src/scene.ts`: every object's state over time (the dot's path, the business's growth, dims and sinks).
- `src/World.tsx`: the isometric SVG world. `src/Overlay.tsx`: everything that faces the camera (the AI-at-work chip, cards,
  pills, badges). `src/Captions.tsx`, `src/Finale.tsx`, `src/Story.tsx` (layers and colour fields), `src/Film.tsx` (camera
  breath, motion blur, audio).
- Draft: `npx remotion render Film out/draft.mp4 --props='{"blurSamples":1,"audio":"mix"}'`
- Final: `bash scripts/render_chunks.sh Film out/final_raw.mp4 '{"blurSamples":8,"audio":"none"}' 0,320,536,788,1125 public/audio/mix.wav`,
  then the TV-range BT.709 encode (`-vf "scale=in_range=full:out_range=tv,format=yuv420p" -colorspace bt709 -color_primaries bt709 -color_trc bt709`).
- In this sandbox: `--browser-executable=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell`.
- Sound: `cd sound && node labels.js > labels.json` (bundle `labels_export.ts` with esbuild), `python3 make_cues.py`, then
  `python3 scripts/sound_mix.py sound/cues.json film/public/audio/mix.wav --sheet sound/mix.png`.

## Credits
- Voice-over: ElevenLabs, voice "Christina – Energetic Commercial Female", supplied by Karl.
- Music: "It's Love" by Michael Ramir C., Mixkit (mixkit.co), Mixkit Stock Music Free License (commercial use, no credit required).
- Effects: generated for this film (`scripts/sfx_synth.py`), royalty-free.
- Copy, demo data (Building firm · 40 staff · Tampere; Anna; "Thursday at 10?"), logo, fonts (Space Grotesk, Manrope) and the 15
  tool logos: wicflow.com, as the site shows them; the Claude symbol from Wikimedia Commons (the site's file is 32 px).
