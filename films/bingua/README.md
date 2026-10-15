# Bingua — "Learn languages by scrolling" (36 s, voice-over)

A product film for Bingua (bingua.app) on the ElevenLabs voice-over Karl supplied. One phone runs the real Bingua
interface, rebuilt from the app's own screenshots: the XP bar, the video feed (For you / Discover), the dual transcript
under the video, the word card, the sentence breakdown, Save, Cards and Quiz, the tab bar with the Cards badge. What the
finger opens lifts out beside the phone at a readable size.

**Productive 5 %**: the motion is the app doing its job, never idle drift: real footage plays in the feed, the feed
is swiped (lesson → videos, German → French → Italian → Spanish), the transcript keeps pace with the speech, "famoso"
is tapped and translated, a line is swiped into its breakdown, the word is saved and flies into Cards (14 → 15), a
flashcard flips, a quiz is answered (+10 XP), the old lesson and a study routine are flicked away, a video is hearted,
the XP bar fills to the goal and the streak goes to 3. The camera only breathes.

| Path | What |
|---|---|
| `deliver/bingua-36s.mp4` | The film: 1920×1080, 30 fps, 36.0 s, H.264 BT.709, 8-sample motion blur, AAC 48 kHz, −15 LUFS. |
| `storyboard/index.html` | The storyboard (published privately: https://claude.ai/artifact/Gf6eUYqDfqqnVrHrKZS6xn). |
| `vo/` | The ElevenLabs file and its word timings (`whisper_words.json`; film time = file time + 0.30 s). |
| `sound/` | Cue sheet (`make_cues.py` → `cues.json`), the music bed (`bed.wav`, cut by `scripts/music_fit.py`), generated effects (`lib/`). |
| `film/` | The Remotion project: `src/clock.ts` (labels on the voice's words), `src/app.tsx` (the Bingua app), `src/Story.tsx` (the stage, the phone ↔ icon morph, the finger, the lifts), `src/lib.tsx` (tokens and the Bingua icon rebuilt as vectors). |

Render: `cd film && bash scripts/render_chunks.sh Film out/final_raw.mp4 '{"blurSamples":8,"audio":"none"}' 0,270,540,810,1080 public/audio/mix.wav`
(sandbox: the pre-installed headless Chromium).

## Credits
- Bingua's interface, icon, name, the line "Learn languages by Scrolling." and the App Store badge: bingua.app.
- Footage: Mixkit (Stock Video Free License, commercial use, no credit needed): "Woman eating fast food in the street",
  "Man being recorded himself for a blog on the street", "Portrait of an influencer talking to the camera", "Serving
  parmesan cheese in spaghetti bolognese" (see `film/public/footage/CREDITS.md`). The transcripts shown are written for
  the film.
- Music: Mixkit "Tech House vibes" (Alejandro Magaña), Mixkit Stock Music Free License, no credit required.
- Font: Inter (SIL OFL). Effects: generated (`scripts/sfx_synth.py`). Voice: ElevenLabs "Christina", supplied by Karl.
