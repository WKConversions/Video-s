# Creoble v6 (Danish): Willads' feedback round

65.2 s, 1920×1080, 60 fps. Same script and Danish voice-over as v5, paced with silence between scenes
(`vo/pace.py` → `vo/vo_paced.mp3`, `film/src/words.json`). The contract with the feedback, rules, kit and shot list is
in `plan/contract.md`.

- `film/src/`: the kit:
  - `cam.tsx`: 3D camera, planes, depth of field, motion-blur windows;
  - `type.tsx`: kinetic type;
  - `dots.tsx`: the new 6-dot logo, spinner, assembly;
  - `ui.tsx`: the new wizard, the Holm site window, the hosting card, the cursor, the hand-offs;
  - `scenes/A.tsx` (0–13.6 s), `B.tsx` (13.6–37.92 s), `C.tsx` (37.92 s to the end).
  - Kit check: the `Kit` composition.
  - Stills: `node tools/stills.mjs <prefix> <frames…>`, then `python3 tools/sheet.py`.
- `sound/`:
  - `make_cues.py` → `cues.json` → `sound_mix.py` → `film/public/audio/mix.wav`.
  - Effects: `sound/lib` (Kenney CC0 and Pixabay UI sounds).
  - Music: Mixkit "Piano Reflections" (free licence, no credit), fitted with
    `music_fit.py music/piano-reflections.mp3 bed.wav --length 65.18 --lift 8.99` (the file is gitignored and
    regenerable with `music_find.py`).
- `deliver/`: the MP4s.
