# WKConversions — "Creative built to stand out" (47.2 s, voice-over, music, effects)

An isometric explainer for wkconversions.com, in the concept of the Cartesian hero and ClearScaler references Karl supplied,
made bright in the site's own page grey, dot grid, ink and accent blue. Brief (Karl, 6 Oct 2026): use the supplied voice-over,
more bright than dark, never static at any moment, median frame motion about 4% (references about 3%, our usual about 2%).

One living city of businesses on the site's dot-grid paper, its streets full of people. Grey is noise, ink is attention caught,
blue is yours: the competitor catches the crowd, most businesses lose it, WKConversions' routed blue line comes in to your lot,
and one card on your roof carries the work (a tangled offer made clear, a growth line, motion design, value explained, a
Start a project click, the process, the random and decorative struck out). The crowd streams over to you and turns blue; at the
sign-off your block rises above the city in the brand blue and its badge flies into the end card.

## What is here
| Path | What |
|---|---|
| `deliver/wkconversions-stand-out-47s.mp4` | The film: 1920×1080, 30 fps, 47.2 s, H.264 yuv420p BT.709 (TV range), AAC 48 kHz, −15 LUFS. 8-sample motion blur. |
| `storyboard/index.html` | The storyboard page: the film, the direction, a frame per phrase. Built by `storyboard/build_page.py` from `frames.json`. |
| `harvest/` | The site's text (`pages/home.txt`) and stylesheet: every on-screen line is the voice-over or the site's own copy. |
| `assets/` | The wkc mark (SVG), Inter and Inter Tight, site screenshots. |
| `vo/` | The voice-over (ElevenLabs, "Christina – Energetic Commercial Female"), its forced alignment (`align.txt`, `words.json`). |
| `sound/` | `cues.json` (100 effects, generated from the film's labels by `make_cues.py`), `music/lets-move-fit*.wav` (the bed) and `music/composed-fit.wav` (an original alternative), `music-notes.md`, the effects library `lib/`, the mix sheet. |
| `scripts/` | The QC and sound tools used on this film (motion_check, phrase_check, busy_check, qc.sh, motion_probe, sound_mix, music_fit). |
| `film/` | The Remotion project. |

## The Remotion project (`film/`)
```
cd films/wkconversions/film
npm ci
npx remotion studio            # composition "Film"
```
- `src/clock.ts`: every beat as a label in seconds, leading its spoken word (`src/words.json`) by about 0.13 s. Retime by moving labels.
- `src/cam.ts`: the camera is the world's own view: one continuous orbit (12° to 78°, never through the flat 90° view) with
  eased pushes and pull-backs, through a Catmull-Rom curve; each key aims your lot at a point of the frame.
- `src/map.ts`: the city (blocks, your lot, the competitor's lot) and 820 people walking its streets. `src/crowd.ts`: who
  gathers where (the competitor's crowd, the stream to you, the conversions, the sign-off crowd), always along the streets.
- `src/scene.ts`: every object's state over time (heights, the competitor's ink, your blue, rings, routes, the city's swell).
- `src/World.tsx`: the isometric SVG world. `src/Cards.tsx`: the screen-facing cards (tags, offers, grey cards, the main
  card's scenes, the clutter, the badge). `src/Captions.tsx`, `src/Finale.tsx`, `src/Story.tsx`, `src/Film.tsx` (motion blur, audio).
- Draft: `npx remotion render Film out/draft.mp4 --props='{"blurSamples":1,"audio":"mix"}' --scale=0.5`
- Final: `bash scripts/render_chunks.sh Film out/final_master.mp4 '{"blurSamples":8,"audio":"none"}' 0,356,736,1100,1416 public/audio/mix.wav`,
  then the TV-range BT.709 encode (`-vf "scale=in_range=full:out_range=tv,format=yuv420p" -colorspace bt709 -color_primaries bt709 -color_trc bt709`).
- Sound: `cd sound && python3 make_cues.py music/lets-move-fit-mix.wav "<note>"`, then
  `python3 ../scripts/sound_mix.py cues.json ../film/public/audio/mix.wav --sheet mix.png`.

## Motion and busyness
The 4% target and Karl's "nothing busy" rule pull against each other in this concept, because the walking crowd is what moves.
The balance chosen: a pale paper city (its blocks move with the camera but don't read as separate things), grey passers-by,
ink and blue only for the people a business catches. The busy check counts a median of 8 things on screen (references:
Cartesian 7, ClearScaler 26). The motion probe is clean (no camera spikes, lurches, overshoots or flying elements) except
for its BUSY flag on the crowd itself.

## Credits
- Voice-over: ElevenLabs, voice "Christina – Energetic Commercial Female", supplied by Karl.
- Music: "Let's Move" by Michael Ramir C., Mixkit (mixkit.co), Mixkit Stock Music Free License (commercial use, no credit
  required); fitted to the film (the drums drop on the turn, the final chord lands on the end card), its intro lifted 5 dB.
- Effects: generated, royalty-free (`sound/lib`).
- Copy ("Motion design that makes it click.", "Ready to make your story click?", "Start a project"), the wkc mark, Inter and
  Inter Tight, colours: wkconversions.com, as the site shows them.
