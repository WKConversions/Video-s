# Creoble — "Just your website, made simple." (35.6 s, English, Apple-style)

A 16:9 SaaS explainer for Creoble (creoble.dk), made from the client's script and the supplied ElevenLabs voice-over
("Christina – Energetic Commercial American Female", 33.2 s), in the style of Apple's product videos. The brief:
- extremely minimal, premium and clean;
- a cream background, light blue as the accent, lots of whitespace, elegant type, subtle motion, refined UI
  animation, and no orange;
- focused on the AI website builder and domain hosting.

## Delivery
| File | What |
|---|---|
| `deliver/creoble-36s.mp4` | The film. 1920×1080, 30 fps, 35.6 s, H.264 High, yuv420p, BT.709 TV range; AAC 48 kHz stereo at about −15 LUFS |

## The look
- **Ground:** cream (#FAFAF7, close to the site's own #FAFAF8) with a soft white light at the centre.
- **Type:** near-black type (#1D1D1F), and one light-blue accent (#4AA3F5) on the key word of each line and in
  the interface. No orange anywhere.
- **Fonts:**
  - Inter, an SF-like grotesk, for the statements (600, tight tracking) and the interface.
  - Fraunces for the "Creoble." wordmark, as on the site. Its dot is in the accent blue.
- **Statements:** big and centred. Each word rises, fades in and sharpens from a blur.
- **Devices:** a laptop and a phone, drawn generically in code (no brand marks), floating with soft shadows.
- **Motion:** slow, precise moves of the product, and nothing bounces.
- **Reference images:** the brief mentions Apple-style reference images, but none were attached (only the
  voice-over). The look follows the familiar Apple product-film grammar. Send the references to match them closer.

## The flow (as the brief asks)
| Time | Voice | Picture |
|---|---|---|
| 0.06 | What if building a website was this simple? | The question, word by word; "simple?" in blue |
| 2.95 | Meet Creoble. | "Meet" and the Creoble wordmark; the blue dot lands last (the music's beat enters here) |
| 4.42 | Just tell us about your business. | The laptop rises with the builder: "Tell us about your business" |
| 6.23 | What you do. What you offer. And what makes you different. | The camera moves in; three fields fill on their words (an example bakery in Aarhus) |
| 9.90 | Then let AI do the rest. | "Build my website" is pressed; the AI writes the texts, chooses colours and fonts, builds the pages |
| 12.16 | In minutes, your answers become a complete, ready-to-use website. | The site assembles block by block from "In"; the phone joins with the mobile version |
| 16.43 | Want to change something? Just describe it. | A prompt bar rises and the headline is selected on "change"; "Make the headline warmer and add our opening hours" is typed; the headline changes, opening hours slide in, each change outlined in blue |
| 18.91 | Preview everything for free. | "Preview, for free"; the page scrolls |
| 21.06 | Happy with the result? It's yours for just 499 kroner. | The site comes to the centre, "It's yours"; then "499" on its word, "kr." joins on "kroner"; one payment, no subscription |
| 25.30 | Need hosting? We've got that covered too. | The site's own domain, Live; own domain, email included, European servers; from 83 kr/month |
| 27.87 | No coding. No complexity. | The two lines; a blue code tile is struck through on "coding" and fades on "No complexity" |
| 30.04 | Just your website, made simple. | Laptop and phone with the finished site |
| 32.44 | Creoble. | The wordmark; "Build your website for free at creoble.dk" |

## Truth: what is on screen, and where it comes from
- **From the site:**
  - free to build, with the finished site seen before paying;
  - 499 kr, one payment, no subscription ("Engangsbeløb, ingen abonnement");
  - built in minutes ("på få minutter"), and changes made in plain language, not code;
  - hosting from 83 kr/month, paid yearly, with domain and email included, on European servers;
  - "Byg din side gratis" (build your site for free).
- **Example content, shown as UI and not as claims:**
  - The bakery ("Bageriet Lund", Aarhus), its texts, the example answers and the edit prompt.
  - The interface is rebuilt in English to match the voice. The real product is Danish.
- **Photos on the example site:** three stills from Mixkit stock video (Mixkit Stock Video Free License,
  commercial use, no credit required), listed in `film/public/img/CREDITS.md`.

## Sound
- **Voice-over:** the supplied file, in sync, with a gentle compressor on its peaks.
- **Music:** "Pop Track 03" by Lily J (Mixkit, soft electronic), from the Mixkit Stock Music Free License, free for
  commercial use with no credit required. It is royalty-free, not public domain.
  - It is cut on its bar grid (`scripts/music_fit.py`), with its beat entering on "Meet Creoble" (2.95 s).
  - The song's last hit lands on the end card.
  - It plays at −23 LUFS and ducks under speech.
- **Effects:** 75 quiet interface sounds (keys, clicks, soft pops, airy swishes, one shimmer for the brand), using
  Kenney "Interface Sounds" (CC0) and the studio's own generated sounds.

## Build
Remotion 4 (`film/`): `src/Story.tsx` is one stage on the voice-over's words (`vo/words.json`; `src/clock.ts`).
```
cd films/creoble
python3 scripts/music_fit.py sound/music/pop-track-03.mp3 sound/bed.wav --length 35.6 --lift 2.95
python3 scripts/cues.py && python3 scripts/sound_mix.py sound/cues.json film/public/audio/mix.wav --sheet sound/mix.png
cd film && bash ../scripts/render_chunks.sh Film out/final.mp4 '{"blurSamples":4,"audio":"none"}' 0,270,540,800,1068 public/audio/mix.wav
```

## Checks on the final
- Phrases: every phrase brings a new visual on its words (`phrase_check.py`). The first final had four phrases
  without one. Fixed:
  - "In minutes": the site now starts assembling on "In".
  - "Want to change something?": the prompt rises and the headline is selected.
  - "kroner": "kr." joins the number.
  - "No coding.": the code tile is struck through.
- Shake: none (`jitter_check.py`).
- Motion: calmer than the studio's SaaS films by design (Apple's product-film holds), with no hold longer than
  about 1.3 s outside the end card.

