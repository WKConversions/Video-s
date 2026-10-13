# Vendom: "Make room for wellbeing" (42 s, voice-over)

Karl's brief (13 Oct 2026): a film for Vendom (vendom-pro.com, spas and swim spas, France) on his ElevenLabs voice-over
(Christina), the 4% motion norm; their own style is choppy and not clean, so the film cleans it up and spices it up.

| Path | What |
|---|---|
| `deliver/vendom-42s-1080p.mp4` | The film: 1920×1080, 30 fps, 42.0 s, H.264 BT.709 TV range, AAC 48 kHz, mix −15.2 LUFS. Median 3.9% of the frame in motion, 97% of frames moving; 27 of 27 phrases bring a new visual. Rendered without motion blur. |
| `deliver/vendom-42s-1080p-share.mp4` | The same film at 22 MB for sending (CRF 22). |
| `harvest/` | The site's pages (home, Why Vendom, swim spas, ranges, after-sales) as HTML and text. |
| `assets/` | Their product renders (top views of every model), photos, logo and icons from vendom-pro.com; Poppins (SIL OFL). |
| `vo/` | The voice-over and its word timings (CTC forced alignment of the script; film time = file time + 0.50 s). |
| `sound/` | `vendom_sfx.py` (43 water-made sounds in G minor pentatonic, each used once), `make_cues.py` → `cues.json`, `music/` (Pop 05 fitted: the lift on "Meet Vendom"). |
| `film/` | The Remotion project: `src/Story.tsx` (every beat), `shared.tsx` (logo, media, UI parts), `lib.tsx` (tokens). |

Render: the bundle in four chunks, two at a time (four at once runs out of browser memory with the water clips), joined, then
the TV-range BT.709 encode with `film/public/audio/mix.wav`.

## The look
Cleaned up from the site: the logo's deep navy and its two teal bubbles, a pale mist white, one face (Poppins, used on
their site), warm amber only where heat is the subject. The bubble is the thread: every new picture opens as a circle
out of an object.

## Truth
From the site: spas and swim spas (Hydra 590 × 225 cm), powerful targeted hydromassage jets that relieve tension,
reinforced insulation that keeps the heat in and lowers consumption, the project steps (advice, choosing the model,
delivery, installation by professionals, commissioning, after-sales). Illustrative only: the escape destinations and
distance, the 38 °C and −2 °C readings, the season temperatures.

## Credits and licences
- Voice-over: ElevenLabs "Christina – Energetic Commercial American Female", supplied by Karl.
- Music: "Pop 05" by Grigoriy Nuzhny, Mixkit, Mixkit Stock Music Free License (`sound/music/source/pop-05-licence.json`).
- Footage: Mixkit Stock Video Free License, each checked on its page (`data-license="videoFree"`), converted to 30 fps:
  3154, 43071, 51961, 51942, 51948, 3352 (`film/public/footage/CREDITS.md`). Three first picks (13195, 28207, 47286) were
  Mixkit Restricted and were not used.
- Product renders, photos, logo, icons and copy: vendom-pro.com. Effects: generated (numpy).
