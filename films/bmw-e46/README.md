# BMW 330Ci Coupé (E46, 2001): "wat zit erin" (30 s)

A 30-second film of Karl's brother's car (plate 25-KDB-4): the car as a 3D model in a bright studio, turning on all
its axes; its body lifts off and turns to glass, and five things are pointed at inside it, taken out and explained in
Dutch: the coupé body, the cylinder head, the Double VANOS, the automatic gearbox (ZF 5HP19) and the rear differential.
Built with the senior-motion-designer skill: research → facts → model → plan → Remotion build → QC.

## What is here
| Path | What |
|---|---|
| `deliver/` | the delivered films (16:9 1920×1080 30 fps, with sound and silent) |
| `storyboard/brief.md`, `thesis.md`, `plan.md` | the brief, the thesis with its allowed patterns, the production plan (beats, motion identity, timeline) |
| `harvest/facts.md`, `missing.md` | every claim on screen with its source; what the material lacked and what was done |
| `harvest/research/*.md` | the full research per topic (body, engine and head, VANOS, gearbox, differential), with sources and image credits |
| `harvest/rdw-*.json` | the car's public RDW record (make, engine, power, first registration) |
| `assets/` | the photo of the car, reference images (`ref/`, licences in the research notes; `MODELREF-ONLY_*` files are modelling references, never shown) |
| `build/` | the 3D model, as code: `carfield.py` + `outline.py` (the body as an implicit solid from BMW's dimension drawing), `build_body.py` (meshing), `details2d.py` + `make_maps.py` (windows, chrome, panel gaps and lights as projection maps), `region_mesh.py` (glass and lenses), `details3d.py` (headlight internals, mirrors, kidneys, plates, roundels, wipers, exhaust tips, sticker), `camera_match.py` + `compare_views.py` (checks against the photo and the drawing), `parts/` (wheels, engine, drivetrain, interior, built in Blender's Python module), `SPEC.md` (the shared coordinate system and node names) |
| `film/` | the Remotion project (below) |
| `sound/` | the composed bed (`music-brief.json`, `bed.wav`), the effects library (`lib/`), the cue sheet (`cues.json`) and the mix (`mix.wav`) |
| `scripts/` | the skill's QC and sound scripts used on this film |

## The Remotion project (`film/`)
```
cd films/bmw-e46/film
npm i
npx remotion studio            # composition "Film"; "CarPreview" and "PhotoMatch" check the model
```
- `src/film/timeline.ts`: the beats as labels (on the music's bar lines), the car's pose keys (`KEYS`: yaw, pitch,
  roll and which point of the car is brought where), the camera breath, the x-ray sweep and the lifts.
- `src/film/parts.ts`: which part leaves when and how (head up along the cylinder axis, VANOS forward, gearbox down,
  differential back), the camshafts, valves (firing order 1-5-3-6-2-4), VANOS shift (20°/12.5° cam), gear steps,
  ring and pinion (3.38:1) and the corner speeds.
- `src/film/copy.ts`: every Dutch word on screen; `src/film/Overlay.tsx`: titles, callouts and read-outs.
- `src/car/`: the body's materials (black metallic paint, chrome, glass, lenses, x-ray) reading the detail maps.
- Draft: `npx remotion render Film out/draft.mp4 --gl=angle --props='{"blurSamples":1,"internals":["engine","drivetrain","interior"]}'`
  (in a sandbox add `--browser-executable=/opt/pw-browsers/chromium_headless_shell-*/chrome-linux/headless_shell`).
- Rebuild the body after changing `build/carfield.py`: `python3 build/build_body.py 7 && python3 build/region_mesh.py && python3 build/details3d.py` (from `films/bmw-e46`).

## Credits
- Dimensions and shapes: BMW AG technical training ST034 "E46 Complete Vehicle" (dimension drawings; modelling reference).
- Facts: BMW technical training documents ST034/ST036/ST055 and the E46 automatic-transmission training, BMW data
  sheets, BMW press kits, BMW ETK, RDW open data; full list in `harvest/research/*.md`.
- Font: Barlow (SIL Open Font License). Music and effects: composed and synthesized for this film (royalty-free).
