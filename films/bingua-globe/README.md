# Bingua — "Scroll the world" (46.5 s, portrait ad, 3D globe)

A TikTok / Meta ad for Bingua (bingua.app) on the ElevenLabs voice-over Karl supplied. One dotted Earth, in the same
bright style as the first portrait ad, stays on screen the whole time and is turned by a thumb. The ad makes five
stops: Spain, France, Japan, Brazil, Italy. At each one the country lights up in Bingua blue and a pin lands on it. A
reel in that language rises out of the country in the Bingua app. A word is tapped and translated, then flies back
and lands on the country, and the pin's label turns into the language with a check. Then the reel sinks back into
the pin and a plane flies the dashed route to the next stop, with the camera riding along.

**Hook (frame 0)**: the globe is already spinning under a thumb with "What" on screen. Each swipe of the thumb lands
the globe somewhere new, and a greeting pops up there: こんにちは in Japan, Olá in Brazil, then ¡Hola! / Bonjour ! /
Ciao! in Europe.

**Productive 5 %**: every move carries the message.
- **Meet Bingua.** The globe pulls back for the Bingua icon and name.
- **The language ring.** On "your world of languages" a ring of greetings orbits the planet in 3D, passing behind it.
- **One swipe.** On "one swipe at a time" a single swipe spins the globe round to Spain.
- **The five stops.** Each reel plays real footage under the app's dual-language transcript, and the transcript
  keeps pace with the voice:
  - Spain: a Seville street, "calle";
  - France: a mime at the Eiffel Tower, "plaisir";
  - Japan: ramen, "おいしい", then a swipe to Shibuya on "one video at a time";
  - Brazil: a football fan, "lindo", and a heart on "content you love";
  - Italy: a pizza chef, "amore", then a swipe to new friends in Rome on "another connection".
- **Five countries, five languages.** The five flags line up with their languages.
- **Endless possibilities.** Every other country lights up in a wave from Italy while greetings pop up across the
  globe.
- **The world becomes your classroom.** The globe goes into the phone and becomes the app's home screen, with the
  five flags.
- **End card.** The globe sets low under Bingua, "Scroll the world. Speak its languages." and the App Store badge;
  a last swipe spins it.

| Path | What |
|---|---|
| `deliver/bingua-globe-46s.mp4` | The ad: 1080×1920, 30 fps, 46.5 s, H.264 BT.709, 8-sample motion blur, AAC 48 kHz, −15 LUFS. |
| `vo/` | The ElevenLabs file and its word timings (`whisper_words.json`; film time = file time). |
| `sound/` | Cue sheet (`make_cues.py` → `cues.json`), the music bed (`bed.wav`, cut by `scripts/music_fit.py`, its entry on "Meet Bingua"), generated effects (`lib/`). |
| `film/` | The Remotion project: `src/clock.ts` (labels on the voice's words), `src/Story.tsx` (the globe, drawn on a canvas each frame as an orthographic projection of 13,600 land dots; the camera track, pins, routes, reels, ring and end card), `src/globe.json` (made by `scripts/globe_dots.py`), `src/app.tsx` (the Bingua app, from the first film). |

Render: `cd film && bash scripts/render_chunks.sh Film out/final_raw.mp4 '{"blurSamples":8,"audio":"none"}' 0,349,698,1047,1395`,
then mux `public/audio/mix.wav` in the delivery encode (sandbox: the pre-installed headless Chromium).

## Credits
- Bingua's interface, icon, name and the App Store badge: bingua.app.
- Footage: Mixkit (Stock Video Free License, commercial use, no credit needed), listed in
  `film/public/footage/CREDITS.md`. The transcripts, translations and greetings shown are written for the ad.
- Globe: Natural Earth via world-atlas 2 (50m countries, public domain). Flags drawn as vectors.
- Music: Mixkit "Inspired", Mixkit Stock Music Free License, no credit required.
- Font: Inter (SIL OFL); Japanese and Korean set in the system's WenQuanYi Zen Hei. Effects: generated
  (`scripts/sfx_synth.py`). Voice: ElevenLabs "Christina", supplied by Karl.
