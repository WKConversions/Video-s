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

## Result
- `deliver/kb-team-50s-1080p60.mp4`: the film, 1920×1080, 60 fps, 50.05 s. `deliver/kb-team-demo-540p.mp4`: the animated
  demo Karl saw first. `deliver/kb-team-timing-demo-540p.mp4`: the storyboard frames on the reference's cuts.
- **Against the reference** (`tools/filmcompare.py`): every shot matches in kind, order and cut frame.
- **Motion** (`motion_check.py`): something moves in 74% of frames; the median frame has 0.6% of its area in motion;
  the longest stretch the meter calls still is 0.62 s (target 0.8 s or less). The reference itself is still in a
  quarter of its frames, with holds at 6.3 s, 18.1 s and 48.8 s. Ours sit in the same places, each with typing or a
  slow push in it (the meter does not see a slow push: the logo at 6.4 s, the caret alone at 8.6 s).
- **Shake** (`jitter_check.py`): no shake or judder. Its two "look" lines are the counter at 2.4-3.0 s and the typed
  letters at 9.3-10 s.
- **Sound** (`sound/mix.wav`): 71 effects, 18 different sounds, all Karl's own recordings; -16.0 LUFS, peak -1.5 dBFS.
  The reference has far fewer audible effects (about 15); ours follow the house style (effects lead) on the same moves.

## Open points
- **Illustration content that is not from the site or the script:** the client messages typed on screen ("Can you help
  us automate our follow-ups and keep the CRM up to date?", "We want to be found by the right customers, in search and
  in AI answers.", "Turn these sketches into an app our customers can use.", "Now add online booking, so customers can
  order in two taps", "Build us one dashboard for the whole operation."), the mock product ("Bookings", "Book a table",
  "Your business, the first result") and the numbers on the mock screens (+38% visitors; 248, 92%, 4.8; 72-74%, 4.6-4.8,
  11.8K-15.3K). K.B's own figures on screen are 25 client projects and 100+ automations.
- **Portraits** carry the role only (Founder & CEO, …), no names.
- **Four clips are 1280×720 enlarged** (F2, F3, F4, AD): Mixkit offers them free only at that size.
- **Apple-licensed system sounds are not used**; nothing is generated.

## How the picture stays smooth
- **Filmed shots run on twos** (`onTwos` in the kit). The stock clips are 24, 25 or 30 fps; at their own speed in a
  60 fps film each drawing stays 2, 3, 2, 3 frames, which reads as stutter. So every clip advances one drawing per two
  film frames (the 24 and 25 fps clips play 1.2-1.25 x their speed) and the camera over it steps with the drawing.
  `jitter_check.py` reports those held frames as STUTTER: that is the cadence, not a stalled frame.
- **The camera over footage settles** (`settle` in the kit): the picture arrives a little large and comes to rest, then
  keeps a slow push. No linear drift over stock.
- **A moving block needs a transparent margin.** A layer's own edge snaps to whole pixels, so a card that is its own
  layer moves in one-pixel steps. Make the moving layer a few pixels larger than the card and transparent there (the
  collage in `R10.tsx`): the edge is then inside the layer's picture and glides.
- The final render is in four chunks, one browser tab each, cut on hard cuts (`tools/render_chunks.sh`).

## Commands (from `film/`)
- Preview: `npx remotion render src/index.ts Film out/p540.mp4 --scale=0.5 --concurrency=4 --muted`, then mux
  `../sound/mix.wav`.
- Final: `bash tools/render_chunks.sh Film out/final.mp4 '{}' 0,738,1515,2250,3003 ../sound/mix.wav`.
