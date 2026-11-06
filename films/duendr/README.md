# Duendr (duendr.app): 42.4 s explainer film

Client film for Duendr, the platform connecting creatives with venues, brands and other creatives across Málaga and the
Costa del Sol. English VO (supplied), 1920×1080, 60 fps, Remotion.

## Karl's brief (6 Nov 2026)
- Script and VO as supplied (`vo/script.txt`, `vo/vo.mp3`, word timings `vo/words.json`; the VO is placed at film 0.3 s).
- The map: all eleven cities pinpointed (Málaga, Marbella, Estepona, Fuengirola, Torremolinos, Nerja, Sotogrande, Ronda, Sevilla,
  Granada, Cádiz) on a 3D map with slight curvature, as if looking close-up at the globe.
- Hook ("Looking for your next creative connection?") = the concept of his reference 1, 0–5 s.
- Outro ("From your next project to your next partnership, find your people on Duendr.") = the concept of his reference 16, 35–40 s.
- The rest: creative visualisation.
- **Privacy:** the platform screenshots come from Karl's own account. Never show Karl van Kessel's name, photo, roles or card, nor
  real members or their work: the film uses demo profiles and royalty-free clips inside Duendr's real UI design. The screenshots
  stay local (`harvest/zip/` is gitignored).

## Layout
- `harvest/facts.md`: facts, the privacy rule, the measured brand (dark #161413, cream #F0EBE1, coral #E25A3D, light cream #F3EEE4,
  Inter, the traced wordmark, the icon).
- `plan/contract.md`: the build contract and the storyboard per scene; `plan/storyboard/` makes the storyboard page
  (`make.py` + `template.html`, frames pulled from the render); `plan/make_geo.py` (Natural Earth → `film/src/geo.json`),
  `plan/mapproto.py` (the globe prototype).
- `film/`: the Remotion project.
  - Kit: `src/kit.tsx` (clock, brand, easing, Wordmark, Icon, Rise, Media), `src/ui.tsx` (Duendr's app UI with demo data),
    `src/globe.ts` + `src/map.tsx` (the curved-globe map with the eleven cities), `src/spine.tsx`, `src/handoff.ts`.
  - Scenes `src/scenes/S1.tsx` … `S12.tsx` (B1–B4 built S1–S11 in parallel, the lead built S12 and integrated); `src/Story.tsx`.
  - Assets: `public/clips/` (Mixkit, no credit needed), `public/img/avatars/` (demo faces cropped from the clips), fonts.
  - Checks: `check.sh <ID> <t0> <t1>` (one builder's window), `film_check.sh` (the whole film with the mix → `deliver/`).
- `sound/`: `make_cues.py` → `cues.json` → `sound_mix.py` → `film/public/audio/mix.wav`; music Mixkit "Gimme that groove",
  fitted to 42.4 s with its lift on "Meet" (`bed.wav`, regenerable, gitignored).
- `deliver/`: the MP4s.

## Commands
```
cd films/duendr/film
B=$(ls -d /opt/pw-browsers/chromium_headless_shell*/chrome-linux/headless_shell)
bash film_check.sh                                    # 540p preview with sound + motion/shake + sheets
cd ../sound && python3 make_cues.py && python3 ../../../skills/senior-motion-designer/library/scripts/sound_mix.py cues.json ../film/public/audio/mix.wav --sheet mix.png
```
