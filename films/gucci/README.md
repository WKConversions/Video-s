# Gucci — "A statement of distinction." (35.4 s, English)

A luxury brand film made from the client's script and the supplied ElevenLabs voice-over ("Christina – Energetic
Commercial American Female", 33.0 s).

## Delivery
| File | What |
|---|---|
| `deliver/gucci-35s.mp4` | The film. 1920×1080 with a 2.4:1 letterbox, 30 fps, 35.4 s, H.264 High, yuv420p, BT.709 TV range; AAC 48 kHz stereo at about −15 LUFS |

## Material, and what could not be used
- gucci.com refuses connections from the build environment (bot protection; the connection is dropped, not refused
  by our network policy), so nothing was harvested from the site: no campaign photography, product shots or site fonts.
- The **GUCCI wordmark** comes from Wikimedia Commons (`Gucci_Logo.svg`); the brand's trademarks remain Gucci's.
  It is recoloured to ivory.
- The **Web stripe** (green, red, green) is drawn in code as the house's heritage code.
- **Footage:** eleven royalty-free clips from Mixkit (Mixkit Stock Video Free License: commercial use, no credit
  required), listed in `film/public/footage/CREDITS.md`. They are mood only: crowds, a silhouette, leather and
  stitching, a needle, scissors, fashion models.
  - **No Gucci product is shown, and none is implied.** The garments and leather in the clips are not Gucci's.
  - The clips are 1280×720 and upscaled. The heavy grade, the letterbox and the grain carry that.
  - For a real campaign, swap in Gucci's own footage: each shot is one `<Clip>` line in `film/src/Story.tsx`.
- **Type:** Bodoni Moda (OFL), a Didone, for the statements; Manrope for the small tracked capitals.

## The idea
*Remembered by the few.*
- The film opens on a crowd that sees everything. It narrows to a single beam of light, and one figure stands in it.
- From there:
  - 1921, Florence.
  - Italian craftsmanship in close-up, then individuality, prestige and style, rolling in place.
  - A thread drawn on "intention".
  - The Web stripe drawn on "legacy".
  - Leather goods and ready-to-wear side by side, closing into one portrait.
  - On "cannot be replicated", the picture multiplies into copies that fall away, leaving the original.
  - On "stand apart", the crowd parts around one.
- That one figure's strip of light becomes a line, which turns into the rule under the GUCCI wordmark.

## Phrase by phrase
| Time | Phrase | Visual event |
|---|---|---|
| 0.06 | Exclusivity isn't about being seen by everyone. | A station concourse full of people, cold and grey; "Exclusivity" |
| 3.02 | It's about being remembered by the few. | The crowd narrows to a single beam; a lone figure in a spotlight; "remembered by the few." |
| 5.91 | Since 1921, | Black; "1921" rises digit by digit; Florence |
| 7.18 | Gucci has turned Italian craftsmanship into a symbol of individuality, prestige, and style. | A seam opens on leather being stitched; "Individuality", "Prestige" and "Style" roll in place over a portrait, leather and a model, each on its word |
| 12.89 | Every detail has intention. | A thread brought to a needle's eye, in black and white; a fine line drawn on "intention" |
| 15.13 | Every design carries a legacy. | Scissors through fabric; the Web stripe drawn across on "legacy" |
| 17.47 | From crafted leather goods to distinctive fashion statements, | The frame splits: leather on one side, a model on the other |
| 20.73 | Gucci offers more than something to wear. | The halves close into one portrait; "More than something to wear." |
| 22.98 | It offers a presence that cannot be replicated, | A model among mirrors; the picture multiplies into copies on "cannot be replicated", and they fall away |
| 25.58 | not designed to follow the crowd, but to stand apart from it. | A street crowd; on "stand apart" the crowd parts around one strip, which keeps its colour |
| 29.65 | Gucci. Beyond fashion. A statement of distinction. | The strip of light becomes a line under the GUCCI wordmark; the Web stripe; the tagline |

## Sound
- **Voice-over:** the supplied file, in sync, with a gentle compressor on its peaks.
- **Music:** "Majestic" by Diego Nava (Mixkit, lounge, 85 BPM), from the Mixkit Stock Music Free License, free for
  commercial use with no credit required. It is royalty-free, not public domain.
  - The edit uses the track's closing section. Its beat comes in on "1921", and it rings out on the end card.
  - It plays at −22 LUFS and ducks under speech.
- **Effects:** 19, kept sparse for a luxury film: low swells, deep swishes, two deep impacts (1921 and the name) and
  a shimmer. They come from the studio's generated sounds.

## Truth
- Gucci was founded in Florence in 1921.
- The Web stripe is the house's heritage code, and the wordmark is the brand's own (via Wikimedia Commons).
- The category labels ("Leather goods", "Ready-to-wear") are the house's own categories.
- Everything else on screen is the script's own words.

## Build
Remotion 4 (`film/`): `src/Story.tsx` is the film on the voice-over's words (`vo/words.json`; `src/clock.ts`).
```
cd films/gucci
python3 scripts/music_fit.py sound/music/majestic.mp3 sound/bed.wav --length 35.4 --lift 5.9
python3 scripts/cues.py && python3 scripts/sound_mix.py sound/cues.json film/public/audio/mix.wav --sheet sound/mix.png
cd film && bash ../scripts/render_chunks.sh Film out/final.mp4 '{"blurSamples":4,"audio":"none"}' 0,270,540,800,1062 public/audio/mix.wav
```

## Assumptions
- 16:9 with a 2.4:1 letterbox, 35.4 s: the voice-over plus about 2.7 s on the end card.
- The script is used exactly as written.
- A spec or portfolio film. Using the Gucci name and marks publicly needs the brand's permission.
