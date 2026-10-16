# Bingua — "Learn languages by scrolling." (37.6 s, English, SaaS explainer)

Made from the client's script and the supplied ElevenLabs voice-over ("Christina – Energetic Commercial American Female",
35.3 s). The brief:
- explain what Bingua is and what it is good for through UI and visual animation, without a phone on screen all the time;
- the bright style and colours of bingua.app;
- "SaaS style" in the animation and the way it explains, not in gradients.

## Delivery
`deliver/bingua-38s.mp4`:
- 1920×1080, 30 fps, 37.6 s;
- H.264 High, BT.709;
- AAC 48 kHz, −15.2 LUFS.

## Look (measured on bingua.app)
- **Ground and surfaces:** iOS light grey #F2F2F7 with white cards and hairlines.
- **Type:** black Inter.
- **Colour:**
  - The accent is sky blue #2FAFEE (the logo's play triangle), with link blue #0A649A.
  - The logo is drawn as the site's navy tile (#0F1A29) with the play triangle and two subtitle bars.
  - The app's own UI colours appear only inside UI: the adjective tag, Forgot / Got it, the badge, the streak flame.
- **No gradients.** Between scenes the whole frame scrolls up like the app's feed.

## Flow
The storyboard (`plan/storyboard.md`) has one picture per voice-over line. A frame per line is in
`plan/frames/storyboard_full.jpg`.

## Truth
- Every feature shown is from bingua.app:
  - dual-language transcripts;
  - tap a word for its translation, word class and note;
  - swipe a line for a sentence breakdown;
  - "+ Save";
  - flashcards that come back before you forget;
  - quizzes with listening, typing, matching and speaking;
  - six languages;
  - XP, goal, streak and the 1.00x speed control.
- **Example content:**
  - The Spanish lines and translations come from the app's own screenshots.
  - The counters ("Words saved 81", "100 XP today") are example UI.
- **Footage:** seven Mixkit clips (Mixkit Stock Video Free License, commercial use, no credit needed), listed in
  `footage/CREDITS.md`.

## Sound
- **Music:** "Swings and Slides" by Ahjay Stelino (Mixkit Stock Music Free License). It is fitted with its beat entering on
  "Meet Bingua", at −24 LUFS, and ducks under speech.
- **Effects:** 82 crisp UI sounds on the picture events, clearly audible: taps, pops, the save, flips, ticks and the feed
  swipes.

## Build
Remotion 4 (`film/`): five scenes in `film/src/scenes/` on the voice-over's words (`src/clock.ts`), with the kit in
`src/shared.tsx`.
```
cd films/bingua/film && bash ../scripts/render_chunks.sh Film out/final.mp4 '{"blurSamples":8,"audio":"none"}' 0,282,564,846,1128 public/audio/mix.wav
```

## Checks on the final
- Every one of the 19 voice-over phrases brings a new visual.
- Something moves in 98% of frames.
- The longest still is 0.17 s.
