# JongLeren.es — "Jouw stage, volledig begeleid" (42 s, Dutch)

An explainer for jongleren.es (internship placement in southern Spain for Dutch students), made from the
client's script and the supplied ElevenLabs voice-over ("Ido – Informal Friendly Narrator", 40.6 s), to the
energetic **4% motion norm**. All on-screen text is Dutch, taken from the script and the site's own words.

## Delivery
| File | What |
|---|---|
| `deliver/jongleren-jouw-stage-42s.mp4` | The film. 1920×1080, 30 fps, 42.0 s; H.264 High, yuv420p, BT.709 TV range; AAC 256 kb/s 48 kHz stereo, −15 LUFS integrated, true peak under −1 dBTP |
| `deliver/jongleren-poster.png` | The end card (frame 1250) as a poster image for a website embed (the film's first frame is a nearly empty white page) |
| `storyboard/storyboard.jpg` | One frame per phrase of the voice-over, taken from the render, with what happens on screen |
| `storyboard/plan.md` | Brief, beats, thesis, motion identity, the phrase-by-phrase table and the revision log of the art-director pass |

## The idea
*JongLeren juggles it all for you.* The name means "juggling" and the logo is a bull juggling four balls,
so the film is built from those balls. A red ball starts a route before the suitcase is packed. The
to-dos ("Stageplek", "Schooleisen", "Huisvesting", "Gesprekken") become the balls the logo's bull
juggles, then land as the five steps of the site's own route (Intake → App → Zoektocht → Gesprek → Spanje).
Each step is ticked as the voice reaches it. In the summary the line runs from the first question to the
last internship day, and on "JongLeren" the dots lift off and land as the logo's four balls.

## Motion (the 4% norm)
Measured on the final render with `scripts/motion_check.py` (160×90, a change of more than 6 levels):
MOTION_LINE. The movement comes from the content, not the camera: big photos with slow pushes, arrivals from
outside the frame, colour fields growing out of a ball, cards and lines drifting while they hold. The camera
only breathes (under 20 px/s, 2.1 %/s), with one slow push into the end card, following the K.B lessons.
- **Motion probe:** clean (`scripts/motion_probe.py --style energetic`): no camera spikes, lurches, overshoot
  on big things, flying or busy stretches.
- **Shake:** none (`jitter_check.py`). Slow moves are placed with transforms, and the two zooming text cards
  are rendered in contiguous chunks (`scripts/render_chunks.sh`).
- **Phrases:** every one of the 24 phrases brings a new visual, and the voice never runs without one
  (`phrase_check.py`).
- **Render:** motion blur at 8 samples (CameraMotionBlur, 180°).

## Sound
- **Voice-over:** the supplied ElevenLabs file, placed at 0 and in sync (lag 0), with a gentle 2.5:1
  compressor on its loudest syllables.
- **Music:** "Spanish Heart" by Michael Ramir C. (Mixkit, Latin, about 90 BPM), from
  assets.mixkit.co/music/974.
  - Licence: the Mixkit Stock Music Free License, which allows commercial use and needs no credit. It is
    royalty-free, not public domain.
  - The track is cut on its bar grid (`scripts/music_fit.py`): the band enters on "Met JongLeren" (3.7 s) and
    the song's real final hit lands just after the last word (40.65 s).
  - It plays at −23 LUFS, about 12 dB under the voice, ducks a further 6 dB while the voice speaks, and is
    lifted where the track itself dips.
- **Effects:** 90 cues, each on its picture event (`scripts/cues.py`, one note per cue; `sound/cues.json`).
  - Pops rise a scale where things land.
  - Swishes play on the bigger arrivals, alternating two samples and pitches.
  - Taps play on the app; ticks play on the vacancy cards; the riser fills with the download.
  - One chime plays when the call connects, one stamp and celebration on "aangenomen", and a shimmer on the
    logo.
  - Sources, all copyright-free: Kenney "Interface Sounds" (CC0, kenney.nl) and the studio's own generated
    sounds (`gen-*`), both in `sound/lib/sfx/`.
- **Mix:** `scripts/sound_mix.py`, with the project's additions: the bed level, lifts, voice compression and
  a per-cue auto-level switch. Result: MIX_LINE.

## Truth: what is on screen, and where it comes from
- **From the site (`harvest/facts.md`):**
  - The five steps.
  - "Online · vrijblijvend" intake.
  - The study fields and cities.
  - Housing as an option ("Indien nodig"), near the internship ("in de buurt van je stageplaats", shown as
    "Huisvesting dicht bij je stage.").
  - "Team JongLeren · Málaga".
  - Personal guidance, coaching and activities in Spain.
  - The app's home screen.
- **Example content, shown as UI and not as claims:**
  - The day and time picked for the intake ("di 14:00") and on the invitation ("do · 10:00").
  - The wish chips.
  - The school checklist lines ("Stageperiode", "Uren per week", "Leerdoelen").
  - The vacancy cards' sectors.
  - The "Jij" avatar. There is no photo of an intake call on the site, so no person is invented.
- **Every photo is the client's own, from jongleren.es:**
  - hero: DSC4548, two students with a suitcase in Málaga.
  - team: DSC3216.
  - company: Carlijn van Gelder and Dionne van Luit at Marbella Dream Living.
  - visit: Stagebezoek Eline Kersten.
  - coaching: IMG_8154, the site's "Taallessen/Coaching" image.
  - meetup: student meet-up, September 2018.
  - house: 3K7A1934, the site's accommodation image.
  - Granada: 3K7A0275.
  - The app screen and the logo are also from the site. The logo is cut from the site's 1536 px PNG, and its
    four balls are redrawn so they can move.
- **For the client to confirm:**
  - On /student the price table includes coaching only in the Goud and Platinum packages, and housing help
    is not in Brons.
  - The script's "coaching" and "volledig begeleid" are the client's own words. They may want to check that
    they are happy with them for every package.
- **Type:** Roboto 700 (SIL Open Font License), the site's typeface.

## Build
Remotion 4 (`film/`): `src/Story.tsx` is one continuous stage, timed to the voice-over's words
(`src/words.json`, from faster-whisper, corrected to the pauses) through labels in `src/clock.ts`.
```
cd films/jongleren
python3 scripts/cues.py && python3 scripts/sound_mix.py sound/cues.json film/public/audio/mix.wav --sheet sound/mix.png
cd film && bash ../scripts/render_chunks.sh Film out/final.mp4 '{"blurSamples":8,"audio":"none"}' 0,190,470,760,1010,1260 public/audio/mix.wav
ffmpeg -i out/final.mp4 -vf "scale=in_range=full:out_range=tv,format=yuv420p" -colorspace bt709 -color_primaries bt709 -color_trc bt709 \
  -c:v libx264 -profile:v high -crf 16 -preset slow -c:a aac -b:a 256k -ar 48000 -movflags +faststart ../deliver/jongleren-jouw-stage-42s.mp4
cd .. && python3 scripts/board.py film/out/final.mp4 storyboard/storyboard.jpg
```
QC: `scripts/qc.sh`, `scripts/phrase_check.py check`, `node film/scripts/motion_probe.mjs` + `scripts/motion_probe.py`.

## Assumptions
- 16:9 for the site and YouTube. A 9:16 or 1:1 cut for socials would be a re-layout, not a crop.
- Length 42.0 s: the voice-over plus a 1.4 s hold on the end card.
- The script is used exactly as written.
