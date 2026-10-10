# Prompts — Tale Forge image prompts (verbatim)

This folder holds the literal image-generation prompts behind Tale Forge's sample book *"Iris och den sparade platsen"* [Iris and the Saved Place], plus every image-style string found in the site's client code. Everything in the `.txt` and `.json` files and in the verbatim blocks of the `.md` files is copied byte-for-byte from [../source/sample-book.iris-och-den-sparade-platsen.json](../source/sample-book.iris-och-den-sparade-platsen.json) or [../source/js/](../source/js/). Glosses in [brackets] are ours.

The analysis of these prompts, including how they turned into images and how to write new ones, is in [../analysis/07-illustration-and-imagery.md](../analysis/07-illustration-and-imagery.md) (§11 and §15).

## Files

| File | Content | Source key |
|---|---|---|
| [style-block.txt](style-block.txt) | The 29-word style prompt appended to every image prompt | `styleBlock` |
| [cover-brief.txt](cover-brief.txt) | The full cover prompt (shot + appearance reference + style) | `coverBrief` |
| [beats/](beats/) | One page per beat (14): metadata, image, verbatim Swedish prose with an English summary, choice data, and the verbatim `illustrationBrief` with an anatomy note | `beats[i]` |
| [sample-book-image-canon.json](sample-book-image-canon.json) | Verbatim subset: `title`, `throughline`, `canon` (hero, companion, others, place, objects with states), `portraits`, `cover` (provider, ms), `styleBlock`, `spec.world.hero` | several |
| [app-style-strings.md](app-style-strings.md) | Art-style presets (8, default `neon`), hero look strings, companion and keepsake looks, door art, painting copy, reader strings, portrait endpoints, Bokmässan style labels, narrator portraits | `source/js/*.js` with offsets |

## Beats in reading order

| Slot | Beat | Branch | Choice after it |
|---|---|---|---|
| 1 | [S1](beats/S1.md) | trunk | — |
| 2 | [S2](beats/S2.md) | trunk | path: [Go with Mossa to the green rug] → S3A / [Stay and draw with the new child in the window light] → S3B |
| 3 | [S3A](beats/S3A.md) · [S3B](beats/S3B.md) | A · B | — |
| 4 | [S4A](beats/S4A.md) · [S4B](beats/S4B.md) | A · B | ordeal: who draws the last silver mark (moon/bird; star/nest) |
| 5 | [S5AA](beats/S5AA.md) · [S5AB](beats/S5AB.md) · [S5BA](beats/S5BA.md) · [S5BB](beats/S5BB.md) | AA · AB · BA · BB | — |
| 6 | [S6AA](beats/S6AA.md) · [S6AB](beats/S6AB.md) · [S6BA](beats/S6BA.md) · [S6BB](beats/S6BB.md) | endings | — |

## The shape of every image prompt (observed in all 15)

```text
<shot paragraph, English, 55–86 words: phase tag + shot type, blocking, prop states, one gesture, light>

Appearance reference for entities already named in the shot above. Never add a character, object, flower, or prop merely because it is listed here:
<Role> <Name>, <kind>: <look in Swedish>      ← one line per entity present in the shot

Style: Warm watercolor and colored-pencil children's-book illustration style, soft light, rounded shapes, expressive small gestures. Absolutely no text, no letters, no numbers, no labels, no signage anywhere in the image.
```

Image model recorded for the cover and character portraits: `azure-images:gpt-image-2`. The beat images record `provider: "existing"`.
