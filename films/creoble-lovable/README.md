# Creoble × the Lovable 2.0 launch film

An 80.49 s Danish film for creoble.dk that replicates the Lovable 2.0 launch video (`ref/lovable-2.mp4`) cut for cut:
the same length, shot structure, animation and easing, gradient-glow look, music style and sound design, in Creoble's
colours (sage, forest, cream, terracotta, sand, pushed into the reference's glowing gradients) and fonts (Fraunces,
DM Sans), with Karl's Danish script on screen and Creoble's own story in the demos.

- `ref/` the reference, its 2 fps frames, contact sheets and a picture of its audio (112 BPM electronic, no voice).
- `assets/Cursor.glb` Karl's 3D hand cursor; `assets/cursor/` its 30 sprites (5 leans × 6 press depths, rendered with
  three.js in headless Chromium) and the fingertip of each (`tips.json`).
- `film/` the Remotion project: `src/A.tsx` 0–23 s (kinetic opening, logo, count to 5, showcase), `B.tsx` 23–34 s
  (prompt pill, the builder building the flower shop, "Ret farverne…", recolour), `C.tsx` 34–54 s (the chatbot: set-up,
  "Med ét klik", activation, the bot answering a customer down to an order), `D.tsx` 54–80.49 s (free preview, 499 kr.,
  hosting and domain, the close and creoble.dk). `src/Story.tsx` is the shot list.
- `sound/` the music cut (`music_splice.py`: Expressive Courage cut to the reference's structure — the drop-out under
  the logo, drops at 8.8 s and 54.15 s, the hard stop at 49.4 s, the track's own ending on the logo), the film's 122
  generated effects (`creoble_sfx.py`, each used once), the cue sheet (`make_cues.py`) and the mix sheet.
- `deliver/` the 1080p film and a share copy under 30 MB.

- `storyboard/` the review notes (`review_all.json`) and the side-by-side sheets (`scripts/compare_sheets.py`: the
  reference left, the film right, every 0.5 s).

Sound: `cd sound && python3 creoble_sfx.py && python3 make_cues.py && python3 ../scripts/sound_mix.py cues.json
../film/public/audio/mix.wav --sheet mix.png`.

Render: `cd film && bash out/render3.sh 0,800,1620,2415`, join `out/parts/p{0,800,1620}.mp4` with ffmpeg's concat
demuxer, then mux `public/audio/mix.wav` with the delivery encode (TV-range BT.709, x264 CRF 17, AAC 256k, faststart;
the share copy two-pass at 2.75 Mb/s, under 30 MB).
