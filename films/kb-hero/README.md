# K.B hero film

A 40.5 s website hero-section explainer for **K.B**, a tech partner (1920×1080, 60 fps, Remotion). SaaS / Apple style on
the site's bright look. No voice-over, no music: sound effects only, all from Karl's own sound library.

## Karl's direction
- The three pillars: AI, Agents & Automation; Software Development; Growth Technology (the third from the supplied PDF).
- Bright grounds lead; navy and cyan are accents. Always "K.B", never what it stands for, no URL on screen.
- Pure SaaS explainer order, centred text animations, constant motion (the 4% norm), variety in animations, transitions
  and colour. The 3D hand cursor about half the film. Text-free scenes use recognisable assets (macOS windows, a phone,
  a node canvas, a dashboard, a dot globe).
- Only facts from the site and the PDF (`../kb-tech-partner/harvest/facts.md`): headline, pillars, Diagnose / Build /
  Run, Hosting / Maintenance / Growth, "25 client projects completed", "100+ automations built and integrated", the
  office in Málaga (the pin on the globe), "Book a Free Discovery Call".

## Layout
- `plan/build-brief.md`, `plan/build-brief-2.md`: the briefs the scene builders worked from (scenes, then the motion pass).
- `film/src/timeline.ts`: the 14 scenes and the transition into each. `film/src/Film.tsx`: assembly, transitions, the
  cursor sessions. `film/src/kit.tsx`: brand colours, type, shared components. `film/src/scenes/A…E.tsx`: the scenes;
  `S13globe.tsx`: the globe.
- `film/tools/`: `sheet.sh` (a contact sheet or clip of one scene), `norm.py` (the motion norm of a clip), `flow.py`
  (jerks), `events.mjs` (sound events and the cursor report: `node tools/events.mjs --hand`).
- `sound/make_cues.py`: builds `cues.json` from the scenes' sound events with Karl's own recordings only, then
  `python3 sound_mix.py cues.json mix.wav --sheet mix.png`.
- `deliver/`: the MP4s.

## Commands (from `film/`)
- Preview: `npx remotion render src/index.ts Film out/p540.mp4 --scale=0.5 --concurrency=4 --muted`, then mux
  `../sound/mix.wav` with ffmpeg.
- Final: `render_chunks.sh` (copy from the skill's `library/scripts/`).
