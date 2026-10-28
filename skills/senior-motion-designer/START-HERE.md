# Start here: running this skill as a copy

This folder is the complete senior-motion-designer skill as Karl used it in October 2026 (Creoble v5, the
Klyro, Fieldnote and Morrow House loops). Copy the folder, rename the skill in `SKILL.md`'s front matter, and
build from there.

## What is in the folder
| Folder | What it holds |
|---|---|
| `SKILL.md` | the workflow (read first) |
| `library/` | every module, script and contact sheet; `examples/corrections.md` holds Karl's rules, newest lessons on top |
| `house/` | `HOUSE-RULES.md` (standing rules and house style), `BRIEF_TEMPLATE.md`, `creoble-style-brief.md` (the full Creoble Apple-style recipe) |
| `templates/creoble5/` | the Creoble v5 film (55 s): Stage, StageHandoff, Phone, MiniSite, Apple shadows, dither, the scenes |
| `templates/klyro`, `fieldnote`, `morrow` | the three 12 s seamless loops (the 15-minute recipe) |
| `templates/portrait-ad`, `globe-ad` | 9:16 social ads (Bingua): hook on frame 0, world map, dot globe, phone UI; 30 fps, footage and audio not included |
| `sounds/lib/` | Karl's 24 sound effects (4.3 MB) |
| `setup/` | `cloud-setup.sh` (Python and Node tools), `get_blender.sh` |
| `test/` | `verify.sh` and `reference.json`: proves a new setup renders like the original |

## 1. The environment (once)
- A Claude Code session with a shell (a cloud session works). Upload the zip as a skill, or put this folder
  in the repository.
- Paste `setup/cloud-setup.sh` into the environment's setup script, or run it. It installs numpy,
  opencv-python-headless, pyloudnorm, Pillow, faster-whisper and yt-dlp.
- Node 18+, ffmpeg, and Chromium headless_shell (cloud sessions have it under `/opt/pw-browsers`).
- Remotion 4.0.532: `npm ci` in one template, then hardlink its `node_modules` into the others
  (`cp -al templates/klyro/node_modules templates/<x>/`) instead of reinstalling.

## 2. Check the setup (5–10 minutes)
`bash test/verify.sh` renders the three loops at 540p and compares them with the approved numbers. If all pass,
the copy renders like the original. If one fails, fix the environment before making films.

## 3. Make a film
1. Read `house/HOUSE-RULES.md` and the top of `library/examples/corrections.md`.
2. Fill in `house/BRIEF_TEMPLATE.md` (or have the client do it).
3. Copy the nearest template to `films/<client>/film/`: `creoble5` for a product film with voice-over,
   a loop template for a 12 s loop. Replace brand, fonts, copy and images with the client's own (harvested
   from their site); keep the mechanics.
4. Sound: in cue sheets set `"library"` to the path of `sounds/lib`, then `library/scripts/sound_mix.py`.
5. Preview: `npx remotion render src/index.ts <Comp> out/x.mp4 --scale=0.5 --concurrency=4 --muted
   --browser-executable=$B`, mux the mix with ffmpeg. Final: `library/scripts/render_chunks.sh`.

## 4. The quality bar (measure every render)
- 60 fps, 1920×1080.
- `motion_check.py`: moving in 100% of frames; median at the brief's target (the loops: 2.9–4.0%).
- `jitter_check.py`: no SHAKE (slow scrolls in whole pixels, calm camera 1.2–2 s sine, no camera spring).
- Loops: the last-to-first frame difference about one normal frame step.
- One contact sheet at 480 px tiles; Apple style: calm background, foreground motion, a new visual every
  0.5–0.8 s, centred, minimal but large, even all-round shadows plus dither.

## What a copy cannot carry
- Karl's judgement. The first draft of a new film lands near draft 4–6 of the originals; feedback rounds
  are still needed. Turn each piece of feedback into an entry in `corrections.md`, so the copy learns too.
- Run-to-run variance of the model: the same brief gives different films. The templates and
  `test/verify.sh` keep the mechanics fixed; the creative choices are not.
- Clients' material (sites, logos, voice-overs) and paid tools (After Effects, Mosaic Motion credits). These
  are not in the zip.
- No credentials are stored here, by design. API keys go in the environment's secrets.
