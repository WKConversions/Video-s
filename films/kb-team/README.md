# K.B team film

A 50-second film for **K.B** that replicates a reference film (Base44, "Build an app with your name on it") shot for
shot, with K.B's brand, team and content, Karl's voice-over (ElevenLabs, voice Warren) and his music track.
1920×1080, 60 fps, Remotion.

## Karl's direction
- "Completely replicate the video […] for KB. […] the visuals in the video will be the same, but it's a different script,
  different approach, different background music. […] So literally the same, but different for KB."
- "The voiceover is shorter than the replicated video […] you have to align the sentences correctly, the same as the
  replica video. Try to also replicate sound effects."
- "For cursor use the 3d cursor model you already know from me."
- The team is the five people on the live About page; never an image that shows a former member (`harvest/facts.md`).
- Always "K.B", never what it stands for, no URL on screen.

## Layout
- `plan/brief.md`: the job, the reference's shot list and the script mapped line for line. `plan/build-brief.md`: the
  builders' brief (every package, frame numbers). `plan/storyboard/kb-team-storyboard.jpg`: the storyboard Karl saw.
- `reference/` (not in git): the reference film, every frame, its separated voice and music. `tools/ref.py` reads it.
- `film/src/timeline.ts`: twelve packages on the reference's cuts (reference frame n = film time n / 24 s).
  `film/src/kit.tsx`: the kit. `film/src/Storyboard.tsx`: one still per shot. `film/src/shots/R01…R12.tsx`: the shots.
  `film/src/Animatic.tsx`: the timing demo.
- `film/tools/`: `compare.py` (a package beside the reference, frame for frame), `filmcompare.py` (the whole film),
  `sheet.sh`, `smooth.sh`, `events.mjs` (sound events), `render_chunks.sh`.
- `sound/`: `make_vo.py` (the voice-over placed sentence by sentence on the reference's sentence times, `vo-plan.json`),
  `music_fit.py` (the track cut to 50.05 s: lift on the first filmed cut at 7.83 s, the end card on a beat),
  `make_cues.py` (effects from Karl's own recordings only), `sound_mix.py`.
- `harvest/`: `facts.md` (team and facts, checked on the live site), the PDF of the third service (not in git).
- `stock/` (not in git): footage candidates. The clips used are listed below.

## Footage (Mixkit Stock Video Free License: commercial use, no attribution required)
F1 people-working-on-laptops-42620 · F2 man-draws-web-design-wireframe-on-tablet-13228 · F3
young-marketing-team-gather-around-laptop-9072 · F4 man-writing-data-on-a-whiteboard-46686 · R
a-woman-using-her-smartphone-1805 · S close-up-view-of-a-woman-texting-on-her-cell-49921 · W
a-graphic-designer-working-on-a-tablet-799 · AA woman-working-in-front-at-home-on-a-computer-49927 · AB
business-people-at-work-meeting-4809 · AC office-meeting-261 · AD young-businesswoman-working-in-the-coffee-shop-17527 ·
AN young-woman-working-remotely-4957 (pages: mixkit.co/free-stock-video/<name>/). F2, F3, F4 and AD are offered free
only at 1280×720. Segments are cut so no brand logo is in the frame.

## Commands (from `film/`)
- Preview: `npx remotion render src/index.ts Film out/p540.mp4 --scale=0.5 --concurrency=4 --muted`, then mux
  `../sound/mix.wav`.
- Final: `bash tools/render_chunks.sh Film out/final.mp4 '{}' 0,738,1515,2250,3003 ../sound/mix.wav`.
