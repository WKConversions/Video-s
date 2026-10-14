# Costa Connect — "Blijf verbonden, waar je ook onderneemt" (37.5 s, Dutch)

A film for Costa Connect (test.costa-connect.workers.dev), made from the client's script and the supplied ElevenLabs
voice-over ("Ido – Informal Friendly Narrator", 35.0 s). The brief asked for a real network style and feel, a bit of
SaaS, and a call to action that makes people want to act. All on-screen text is Dutch.

## Delivery
| File | What |
|---|---|
| `deliver/costa-connect-37s.mp4` | The film. 1920×1080, 30 fps, 37.5 s, H.264 High, yuv420p, BT.709 TV range; AAC 48 kHz stereo at about −15 LUFS |

## The idea
*Two countries, one network: the line between Spain and the Netherlands.*
- The film's thread is one network line, running from orange (Spain, the Costa) into navy (the Netherlands):
  - It stalls in the gap on "afstand".
  - Costa Connect's mark drops into the gap and closes it.
  - It branches into the four services.
  - It runs to the pin on location, carries the contact out of the chat and brings the update back.
  - It shortens, thickens and grows new nodes on "korte lijnen, sterke relaties, nieuwe mogelijkheden".
  - It becomes the one line between the site's two location cards.
  - It ends running from both countries into the call-to-action button.
- The look is the minimal-gradient SaaS kit in Costa Connect's own brand:
  - the site's navy, orange, cream and gradient type;
  - Manrope;
  - frosted windows and nodes, with photos only inside windows.

## Phrase by phrase
| Time | Phrase | Visual event |
|---|---|---|
| 0.06 | Ondernemen vanuit Spanje. | Costa del Sol window (the site's Nerja photo), pin and the site's coordinates |
| 1.88 | Kansen in Nederland. | Amsterdam window, pin |
| 3.60 | Waarom zou afstand daartussen staan? | The windows move apart; the line from each side stalls in the gap |
| 5.78 | Met Costa Connect blijft jouw netwerk dichtbij. | The mark drops into the gap and the line closes (the music opens up here); nodes pop around both sides; the sides move closer |
| 8.91 | Van gesprekken … praktische zaken: | The windows fold into the hub; four service tiles branch out on their words |
| 13.18 | wij zijn jouw gezicht op locatie. | The hub becomes Rienk's portrait (the site's photo) on a "Jouw vertegenwoordiger" card; a pin lands on Amsterdam |
| 15.67 | Jij vertelt wat er speelt. | The card grows into the chat ("Rechtstreeks met Rienk"); your messages ("Een belangrijk gesprek", "Een bezoek ter plekke") type in |
| 17.31 | Wij leggen contact, | The line runs out of the chat to the people on location; "Contact gelegd" |
| 18.49 | schuiven aan tafel | The window grows to the table, captioned with the site's line "Jij op afstand. Wij aan tafel." |
| 19.68 | en houden je op de hoogte. | The update flies back across and lands in the chat: "Update over de voortgang" |
| 21.16 | Geen extra kantoor. Geen gemiste kansen. | An office tile is struck through and drops away; three follow-ups turn to ticks |
| 24.11 | Korte lijnen, sterke relaties en nieuwe mogelijkheden. | A network around the mark: the lines shorten, thicken, and new nodes grow |
| 27.76 | Twee landen. Eén netwerk. | The site's two location cards ("Jouw thuisbasis", "Jouw aanwezigheid"), joined by one line through the mark |
| 30.01 | Costa Connect. Blijf verbonden, waar je ook onderneemt. | The mark rises into the logo, the wordmark wipes in; the cards move to the corners, still connected |
| 33.87 | Klaar om te connecten? | The site's call to action "Laten we kennismaken" and the e-mail address; both countries' lines run into the button; a cursor clicks it |

## Sound
- **Voice-over:** the supplied file, in sync, with a gentle compressor on its peaks.
- **Music:** "Reaching Out" (Mixkit, 115 BPM), from the Mixkit Stock Music Free License, free for commercial use
  with no credit required. It is royalty-free, not public domain.
  - It is cut on its bar grid (`scripts/music_fit.py`): the band enters exactly on "Met Costa Connect" (5.78 s),
    and the song's final hit lands on "connecten?".
  - It plays at −23 LUFS and ducks under speech.
- **Effects:** 78 cues, each on its picture event (`scripts/cues.py`).
  - Clean UI taps and pops on the nodes, airy swishes on the bigger moves, one shimmer for the brand, a click on
    the button.
  - Sources: Kenney "Interface Sounds" (CC0) and the studio's own generated sounds (shared with the Alumni film).

## Truth: what is on screen, and where it comes from
- **From the site:**
  - The places, codes and coordinates.
  - "Jouw thuisbasis", "Jouw aanwezigheid", "Jouw vertegenwoordiger", "Rechtstreeks met Rienk".
  - "Jij op afstand. Wij aan tafel.", "Laten we kennismaken", and rienk@costa-connect.nl.
  - The photos (Nerja, Amsterdam, the meeting, Rienk), the logo, Manrope and the colours.
- **The script's own words:** the headlines and the four service tiles.
- **Example content, shown as UI and not as claims:**
  - The chat messages, taken from the site's situations: "Een belangrijk gesprek", "Een bezoek ter plekke".
  - "Contact gelegd" and "Update over de voortgang", the latter from the site's "duidelijke updates over de voortgang".
  - The "Gesprek / Bezoek / Afspraak" follow-ups.
- **No numbers, client names or promises.**

## Build
Remotion 4 (`film/`): `src/Story.tsx` is one continuous stage on the voice-over's words (`vo/words.json`: whisper word
times snapped to the pauses; `src/clock.ts`). `src/saas.tsx` holds the style kit, `src/lib.tsx` the brand tokens.
```
cd films/costa
python3 scripts/music_fit.py sound/music/reaching-out.mp3 sound/bed.wav --length 37.5 --lift 5.78
python3 scripts/cues.py && python3 scripts/sound_mix.py sound/cues.json film/public/audio/mix.wav --sheet sound/mix.png
cd film && bash ../scripts/render_chunks.sh Film out/final.mp4 '{"blurSamples":4,"audio":"none"}' 0,282,563,845,1125 public/audio/mix.wav
```

## Checks on the final
- Phrases: every phrase of the voice-over brings a new visual on its words (`phrase_check.py`).
- Motion: something moves in every frame; the median frame has about 2% of its area in motion. No motion norm was
  set for this film.
- Shake: the camera carries a 3D term so its slow breath doesn't step type a whole pixel at a time (`jitter_check.py`).
- Frame review: three independent reviews of the final's frames (layout, Dutch copy and truth, story and timing),
  each serious finding checked again by a skeptic at full resolution. Fixed from it:
  - The headline hand-overs at 3.6 s and 5.8 s.
  - The update badge's path and landing at 20 s.
  - The scene hand-overs at 24 s and 27.8 s.
  - The logo's lift before "Klaar".
  - The table caption, Rienk's ring, both coordinates on the opening pins, and the cursor leaving the button.

## Assumptions
- 16:9, 37.5 s: the voice-over plus about 2.8 s on the call to action.
- The script is used exactly as written.
- The logo's English tagline is left off; the film closes on the script's "Blijf verbonden".
