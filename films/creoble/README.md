# Creoble: "Se resultatet, før du betaler" (44 s, Danish, voice-over)

Karl's brief (12 Oct 2026): a new film for Creoble (creoble.dk, /builder, /hosting) on his ElevenLabs voice-over (Freja), in
Danish, at the 5% motion norm, in colours "around (not too far)" Creoble's own sage-and-cream style, which on its own reads as
one flat colour.

| Path | What |
|---|---|
| `deliver/creoble-44s-1080p.mp4` | The film: 1920×1080, 30 fps, 44.0 s, H.264 BT.709 TV range, AAC 48 kHz, mix −15.2 LUFS. Median 5.6% of the frame in motion (the 5% norm), 97% of frames moving; 30 of 30 phrases bring a new visual. Rendered without motion blur (as for K.B, so it is ready straight away). |
| `vo/` | The voice-over, its Whisper word timings (Danish) and `words.json` (film time = file time + 0.50 s). Three lines were recorded differently from the written script (see below); the picture follows the recording. |
| `harvest/` | The live pages (home, builder, hosting) and Creoble's CSS: colours, fonts, the builder's real form and branche list, the prices. |
| `assets/` | Fraunces and DM Sans (SIL OFL), Creoble's icon. |
| `film/` | The Remotion project. `src/Scenes.tsx` (every beat on the voice's words), `site.tsx` (the example site "Café Salvie" in a browser: built, scrolled, recoloured, changed), `lib.tsx` (tokens). |
| `sound/` | `creoble_sfx.py` (53 sounds made for this film, in the music's key, E major), `make_cues.py` → `cues.json` (53 cues, every sound used once), `music/` (Just Keep Walking fitted: the lift on "Creoble", the last hit on "i dag"). |

Render: `cd film && bash scripts/render_chunks.sh Film out/final_master.mp4 '{"blurSamples":1,"audio":"none"}' 0,330,660,990,1320 public/audio/mix.wav`
then the TV-range BT.709 encode (`deliver/`). Sound: `cd sound && python3 creoble_sfx.py && python3 make_cues.py && python3 ../scripts/sound_mix.py cues.json ../film/public/audio/mix.wav --sheet mix.png`.

## The film
One continuous stage; the thread object is the example customer's website, "Café Salvie" (Creoble's real "Restaurant / Café"
branche; illustrative, not a client):
1. **Hook:** the café itself, full frame, closes into the hero of its website on "resultatet". The question is the headline.
2. **The old way:** the site locks behind a blur; a quote ("I alt ? kr") and a deposit ("Betal 50 % nu") land on it; the
   unanswered questions rise in a stream; it all falls away.
3. **Creoble turns it around:** the wordmark, and the steps Betal → Vent → Se resultatet turn over into Se resultatet → Ret til → Betal.
4. **Fortæl os lidt om din virksomhed:** Creoble's real first form step, over the café: "Café Salvie", "Restaurant / Café", Byg min side.
5. **The build:** the café footage closes into the hero and the site develops section by section ("Din hjemmeside er færdig").
6. **Explore, design, change in plain words:** the pages scroll, the palette recolours the site twice, "Gør overskriften større" is sent and applied.
7. **Kan du lide resultatet? / 499 kr:** Ja, den er min; 499 kr, Én betaling, Intet abonnement (kr/md struck), Siden er din.
8. **Online:** the switch goes Online, the address becomes cafesalvie.dk, Hosting / Domæne / E-mail gather into one place.
9. **Ingen kode. Ingen usikkerhed.** and the sign-off: Prøv Creoble gratis i dag, "Byg din side gratis".

Colour: Creoble's sage (#87A89E), deep sage-teal and warm cream stay the base; terracotta and clay (the price, "før", the
strike), sand and a deep forest green add warmth so the film is not one flat colour.

## The recording differs from the script
The voice-over says: "Fortæl os lidt om din virksomhed" (script: "Fortæl, hvad din virksomhed laver"), "forvandler Creoble
din beskrivelse til en færdig hjemmeside" (script: "dine ord"), "Udforsk siderne, se designet og fortæl hvad du gerne vil
ændre" (script: "bed om ændringer med helt almindelige ord"). Everything on screen follows the recording.

## Facts used (creoble.dk, 12 Oct 2026)
499 kr one-time, no subscription to own the site ("Siden er din"); hosting from 83 kr/md (990 kr a year), free .dk domain the
first year, e-mail on your own domain; the builder's first step ("Lad os starte med det vigtigste", Virksomhedsnavn,
Branche); "Byg din side gratis".

## Credits and licences
- Voice-over: ElevenLabs "Freja – Natural and melodic", supplied by Karl.
- Music: "Just Keep Walking" by Michael Ramir C., Mixkit, Mixkit Stock Music Free License (`sound/music/source/just-keep-walking-licence.json`).
- Footage (Mixkit Stock Video Free License, checked on each clip's page: `data-license="videoFree"`; converted to 30 fps):
  810 "Latte art", 818 "Coffee in green mug", 3574 "Serving coffee in a cup at a coffee shop" (`film/public/footage/CREDITS.md`).
  The gallery stills on the example site are frames from the same clips.
- Effects: generated (numpy), royalty-free. Creoble's name, icon, colours and copy: creoble.dk. Fonts: Fraunces, DM Sans (SIL OFL).
