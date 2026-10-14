# WKConversions promo: the AI-agents SaaS promo rebuilt frame for frame (42.07 s)

Karl's reference (`ref/ref.mp4`, the NeuralSeek "Motion Graphics Promo Video | AI Agents SaaS platform", 1280×720, 1262
frames) rebuilt at 1920×1080 for wkconversions.com: the same shots, layouts, sizes, timing, motion, transitions, music style
and sound design, with Karl's script, WKC's monogram, founders and real client work, recoloured into WKC's blues.

| Path | What |
|---|---|
| `deliver/wkconversions-promo-42s-1080p.mp4` | The film: 1920×1080, 30 fps, 1262 frames, H.264 CRF 17, BT.709 TV range, AAC 256k, −14 LUFS. |
| `deliver/wkconversions-promo-42s-share.mp4` | The same, two-pass 5.2 Mb/s, 27 MB. |
| `storyboard/compare/` | Reference (left) and ours (right) every 0.5 s. |
| `storyboard/overlay/` | The overlay check every 0.5 s: 50/50 blend and edges (reference red, ours cyan, both white). |
| `spec/` | The measured specs: `BRIEF.md` (script and direction), `seg1-8.md` (per segment: shots, colours, sizes, per-frame keyframes, easing, WKC adaptation), `audio.md` (150 BPM grid, structure, 54 effects), `BUILD.md` (the builders' brief). |
| `film/` | The Remotion project: `src/segN*.tsx` one segment each (RANGE in each file), `src/logo.tsx` the lockup and end card, `src/kit.tsx` (wkc mark, the reference's dart cursor, grain), `src/lib.ts` (tokens, easing). `public/clips/` real client clips (see `clips.json`). |
| `sound/` | Music ("Can't Get You Off My Mind", Michael Ramir C., Mixkit Free License; `music/CREDITS.md`), 58 synthesised effects, cue sheet, mix and master; `sound/README.md` has the commands. |
| `scripts/` | QC: `overlay.py` (one frame against the reference), `compare_sheets.py`, `overlay_sheets.py`, `jitter_check.py`, `motion_check.py`. |

Render: `cd film && bash scripts/render3.sh 0,316,632,948,1262`, join `out/parts/p{0,316,632,948}.mp4` (concat), mux
`public/audio/mix.wav`, then the delivery encode. Test frames: `node scripts/stills.mjs 10,20 out/test`, then
`python3 scripts/overlay.py out/test/f0010.png 10`.

QC (final): motion in 99 % of frames, median 5.0 % of the frame (reference 6.4 %); shake check clean except one
background tile at 13.5–14.4 s (gradient banding, no moving element); every segment overlay-checked at its key frames.
