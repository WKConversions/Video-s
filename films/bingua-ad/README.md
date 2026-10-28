# Bingua — "Turn scrolling into real-life connections" (40.5 s, portrait ad)

A TikTok / Meta ad for Bingua (bingua.app) on the ElevenLabs voice-over Karl supplied. It spends its first ten
seconds on the problem (doomscrolling other people's lives), then pays it off with Bingua: what you scroll turns
into a language, and the language takes you out into the world. Bright and minimal: Bingua's light grey stage,
its blue, a dotted world map and the flags of the most useful languages.

**Hook (frame 0)**: a social feed is already rushing past under a thumb, and "You're" is on screen with the first
word of the voice. No logo, no intro.

**Productive 5 %**: every move says something.
- **The problem.** The feed keeps getting flicked. The "Your plans" card (Learn Spanish, Trip to Lisbon, Meet new
  people) is stamped ON HOLD. A counter runs from 5 min to 1 hour while the battery drains. Today's stats land:
  1 h 03 min scrolled, 0 new words, 0 people met.
- **Meet Bingua.** The brand blue floods out of the phone and pours back into it as the app.
- **The app.** Six swipes each collect a word (hola, merci, danke, grazie, obrigado, dank je). On "learning a
  language" the words fly home to their countries on the world map, where each language lights up with its flags.
  Then the app at work: real video, "famoso" tapped and translated, the conversation plays on, a video is hearted.
- **Abroad.** On "the difference" the map comes back and zooms into Europe, and a plane flies from home
  (Amsterdam) to Barcelona. Others' feed shrinks away. Real scenes replace it, each with what happened in it:
  - the park conversation ("¡Hola! ¿De dónde eres?" / "¡Soy de Holanda!");
  - "+3 new friends" on a balcony;
  - an Ibiza walk while Lisbon, Paris, Rome and Berlin pin on.
- **Outside the screen.** A selfie inside the phone breaks out of the bezel to full frame.
- **End card.** The world lit in every language: Bingua, "Turn scrolling into real-life connections." and the
  App Store badge.

| Path | What |
|---|---|
| `deliver/bingua-ad-40s.mp4` | The ad: 1080×1920, 30 fps, 40.5 s, H.264 BT.709, 8-sample motion blur, AAC 48 kHz, −15 LUFS. |
| `vo/` | The ElevenLabs file and its word timings (`whisper_words.json`; film time = file time). |
| `sound/` | Cue sheet (`make_cues.py` → `cues.json`), the music bed (`bed.wav`, cut by `scripts/music_fit.py` so the track's big entry lands on "Meet Bingua"), generated effects (`lib/`). |
| `film/` | The Remotion project: `src/clock.ts` (labels on the voice's words), `src/Story.tsx` (the whole stage: feed, plans, counter, flood, map, flight, scenes, break-out, end card), `src/app.tsx` (the Bingua app, from the first film), `public/map/` (the dotted world and one layer per language, drawn from world-atlas 110m). |

Render: `cd film && bash scripts/render_chunks.sh Film out/final_raw.mp4 '{"blurSamples":8,"audio":"none"}' 0,304,608,912,1215`,
then mux `public/audio/mix.wav` in the delivery encode (sandbox: the pre-installed headless Chromium).

## Credits
- Bingua's interface, icon, name and the App Store badge: bingua.app.
- Footage: Mixkit (Stock Video Free License, commercial use, no credit needed), listed in
  `film/public/footage/CREDITS.md`, plus "Woman eating fast food in the street" from the first Bingua film. The
  social posts, captions and dialogue shown are written for the ad.
- Map: world-atlas 2.0.2 (Natural Earth, public domain). Flags drawn as vectors.
- Music: Mixkit "One More Dance" (Arulo), Mixkit Stock Music Free License, no credit required.
- Font: Inter (SIL OFL). Effects: generated (`scripts/sfx_synth.py`). Voice: ElevenLabs "Christina", supplied by Karl.
