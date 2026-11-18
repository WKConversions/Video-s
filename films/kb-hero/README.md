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

## Versions
- **v1** (`deliver/kb-hero-40s-1080p60.mp4`): the dense version, built to the 4% motion norm (measured 4.5%). Karl: "It's a
  bit too busy and it should be more minimal visuals. I can't keep up with what it all is and what you're visualising.
  It's too much and it also needs more sfx variety."
- **v2** (`deliver/kb-hero-v2-40s-1080p60.mp4`, preview `kb-hero-v2-preview-540p.mp4`): the minimal pass
  (`plan/build-brief-4.md`). One idea, one hero object and one main action per scene, at most four things on screen;
  the pillar titles are text only; each text-free scene has one caption with the service's own name from the site; the
  code editor is a light window. Same timeline and transitions.

## Result (v2, full render)
- 40.5 s, 1920×1080, 60 fps. Cursor on screen 51% of the film, five sessions, no compressed glide.
- Motion (`motion_check.py`): median 0.7% (v1: 4.5%), something moves in 87% of the frames (target 90), longest still
  0.63 s (target 0.8 or less). The price of minimal scenes; the lever, if it feels too still, is larger hero objects with
  fuller moves, not more items.
- Smoothness: no shake or judder in the shake check; three single held frames sit between consecutive moves.
- Sound: 63 effects, 23 different sounds, Karl's own recordings only (no Apple system sounds, nothing generated), no
  music, no voice. `sound/make_cues.py` cuts his compilation `ui-all-in-one` into its 11 sounds; each kind of event has
  a family of sounds that changes scene by scene, quick repeats step up in pitch, and the cursor click is always the
  same sound.
- Not shown on its own: Digital Product Marketing (named in the pillar line only). The dashboard number is a mock.

## Layout
- `plan/build-brief.md`, `-2.md`, `-3.md`, `-4.md`: the briefs the scene builders worked from (scenes, the motion
  pass, the smoothness pass, the minimal pass).
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
- The 20 Apple system sounds in Karl's library stay out (licence risk on a client's public website) unless he says
  otherwise.
