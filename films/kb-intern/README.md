# K.B intern films: onboarding (60 s) and offboarding (48 s)

Two English explainers for K.B interns, from Karl's briefs and two ElevenLabs voice-overs ("Christina"), in the 2026
K.B brand kit (navy #172B44, light blue #99CDFC, ice #EAF5FF, Manrope, the KB monogram). 1920x1080, 60 fps, Remotion.

- `vo/`: the voice-overs, their word timings (faster-whisper small) and the placed versions. `tools/timing.py` cuts each
  VO in the silence before each scene's first word and places the pieces with a beat at every scene change (the
  onboarding VO is 51.8 s, the offboarding VO 38.9 s), and writes `film/src/<onb|off>/timing.ts`.
- `film/`: one Remotion project, compositions `Onboarding` and `Offboarding`; `src/kit.tsx` is the shared kit; scenes in
  `src/onb/` and `src/off/`. The logo is on its own layer: one file (`public/brand/logo.png`) and a keyframe track per
  film (`src/<id>/logo.ts`); prop `layer` = all | noLogo | logoOnly. `bash render.sh Onboarding onb [layer]`.
- `sound/`: `make_cues.py` (effects from Karl's library on the spoken words), beds Mixkit "Tears of Joy" (onboarding)
  and "Close Up" (offboarding), fitted with music_fit.py; `sound_mix.py` writes `film/public/audio/<id>-mix.wav`.
