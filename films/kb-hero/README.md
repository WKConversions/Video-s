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

## Result (final render)
- `deliver/kb-hero-40s-1080p60.mp4` (40.5 s, 1920×1080, 60 fps) and `deliver/kb-hero-preview-540p.mp4` (the first preview).
- Motion norm (`motion_check.py`, median): 4.5% (target 4%); something moves in 100% of the frames.
- Cursor on screen 53% of the film, in five sessions (S1–S2, S4, S7, S10–S11, S14); no compressed glide.
- Sound: 76 effects from Karl's own library only (no Apple system sounds, nothing generated), no music, no voice.
- Smoothness: everything that moves is placed by transform; constant scrolls run a whole number of pixels per frame
  (`plan/build-brief-3.md`). The shake check's remaining SHAKE lines sit on streams of identical rows; measured frame by
  frame with `film/tools/shift_probe.py` they move exactly 7 px every frame (the checker matches a row to its neighbour).

## Layout
- `plan/build-brief.md`, `-2.md`, `-3.md`: the briefs the scene builders worked from (scenes, the motion pass, the
  smoothness pass).
- `film/src/timeline.ts`: the 14 scenes and the transition into each. `film/src/Film.tsx`: assembly, transitions, the
  cursor sessions. `film/src/kit.tsx`: brand colours, type, shared components. `film/src/scenes/A…E.tsx`: the scenes;
  `S13globe.tsx`: the globe.
- `film/tools/`: `sheet.sh` (a contact sheet or clip of one scene), `norm.py` (the motion norm of a clip), `flow.py`
  (jerks), `smooth.sh` (the shake check of one scene), `shift_probe.py` (frame-by-frame shift of one rectangle), `events.mjs` (sound events and the cursor report: `node tools/events.mjs --hand`).
- `sound/make_cues.py`: builds `cues.json` from the scenes' sound events with Karl's own recordings only, then
  `python3 sound_mix.py cues.json mix.wav --sheet mix.png`.
- `deliver/`: the MP4s.

## Commands (from `film/`)
- Preview: `npx remotion render src/index.ts Film out/p540.mp4 --scale=0.5 --concurrency=4 --muted`, then mux
  `../sound/mix.wav` with ffmpeg.
- Final: `bash tools/render_chunks.sh Film out/final.mp4 '{}' 0,576,1278,1878,2430 ../sound/mix.wav` (about 3 minutes).
  The film's copy of the script tolerates the container's new browser path; the skill's copy stops there (see below).

## Open points
- The skill's `library/scripts/render_chunks.sh` exits at once in the current container: its browser lookup fails
  under `set -o pipefail` because the headless shell moved. One-line fix, waiting for Karl's OK (skill change).
- The code editor in S7 is a dark window on the bright stage; a light-theme editor is possible if Karl wants the
  film brighter still.
