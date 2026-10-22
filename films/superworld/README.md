# SuperWorld: 40 s product film, no voice-over (16:9, 60 fps)

An Apple-style product film for map.superworldapp.com. The script is on-screen type (Karl had no voice-over).
Everything is drawn as prototypes in SuperWorld's brand, not screenshots: cream #FFFAF0, blue #276FF3, the logo
gradient #1E3AD6 → #307EE7 → #44C6FA, Instrument Sans and the logo mark. Script, look, facts and shots:
`plan/storyboard.md`. Harvest: `harvest/` (the Mapbox token in one page's links is redacted).

## Delivered
- `deliver/superworld-40s-60fps.mp4`: 1920×1080, 60 fps, H.264 BT.709, -15.5 LUFS mix.
  - Motion median 6.7%, moving in 100% of frames; the last 2.5 s measure 9.0%.

## Build
- Four segments (`film/src/scenes/A-D.tsx`, 10 s each) were built in parallel and reviewed independently. The kit
  `film/src/kit.tsx` holds the brand, the springs, the prototype `CityMap`, pins, avatars, glass, the Island and the
  hand-offs H1-H3.
- Sound: each segment's cues are in `sound/cues_A-D.json`; `python3 sound/build_mix.py` (from films/superworld)
  writes the cue sheet and `sound/mix.wav`.
  - UI sounds come from the alumni library; the bed is "Infinity" (Mixkit, quiet at -33 LUFS).
- Render: `cd film && bash ../../creoble4/scripts/render_chunks.sh Film out/raw.mp4 '{"blurSamples":1,"audio":"none"}' 0,400,800,1200,1600,2000,2400`.
