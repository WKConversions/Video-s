# Beat S4B — "Iris och den sparade platsen"

Verbatim prose and image prompt for beat **S4B** of the sample book, from `source/sample-book.iris-och-den-sparade-platsen.json` (`beats[5]`). Slot 4 of 6 · path: branch B — choice 2 · pathTag `neutral`. Prose is Swedish (the book language); the illustration brief is English with Swedish canon descriptions embedded, exactly as the engine sent it.

| field | value |
|---|---|
| beatId / slot | `S4B` / 4 |
| reached from | `S3B` |
| leads to | `S5BA` / `S5BB` |
| image | [`assets/share/iris-sparade-platsen/assets/S4B.webp`](../../assets/share/iris-sparade-platsen/assets/S4B.webp) — 1536x1024 px, provider `existing` |
| narration | [`assets/share/iris-sparade-platsen/assets/S4B.mp3`](../../assets/share/iris-sparade-platsen/assets/S4B.mp3) — 28805 ms, `vertex-gemini-tts:gemini-3.1-flash-tts-preview:Enceladus`, `ffmpeg-loudnorm:-23LUFS:-2dBTP:11LRA` |

![S4B](../../assets/share/iris-sparade-platsen/assets/S4B.webp)

## Prose (verbatim, Swedish)

> Bibliotekarien bar solfågelbilden till det låga bordet vid väggen. Iris höll pappret stilla. Mossa stod vid den öppna platsen ovanför molnen. Amina satt vid den öppna platsen mellan vingarna. Silverpennan låg mitt emellan dem.
>
> "Min stjärna skulle lysa över molnen", sa Mossa.
>
> "Mitt bo skulle höra ihop med vingarna", sa Amina.
>
> Båda tecknen skulle ta en hel tur. Bibliotekarien väntade med klämmorna och skulle hänga upp bilden direkt efter nästa tecken. Iris hade lämnat plats för båda idéerna, men silverpennan räckte bara till en. Det hettade i händerna. De ville gripa pennan och fara över pappret fortare än någon hann säga stopp.

English gloss (summary, not a translation): [Same moment for the sun-bird picture: Mossa's star over the clouds or Amina's nest between the wings. Iris's hands are hot and want to snatch the pen.]

## Choice after this beat (verbatim)

- kind: `ordeal` · afterSlot: 4
- prompt: "Solfågelbilden ska hängas upp, och bara en tur med silverpennan återstår. Vem får rita bildens sista tecken?"  
  [The sun-bird picture is to be hung, and only one turn with the silver pen remains. Who gets to draw the picture's last mark?]
- option **A** → `S5BA`: "Låt Mossa rita stjärnan." [Let Mossa draw the star.]  
  effects: `{"consequence.S4B.gain": "Mossas stjärna får bli solfågelbildens sista silvertecken", "consequence.S4B.cost": "det nya barnets bo får bli solfågelbildens sista silvertecken", "history.choice.S4B": "S4B:A"}`
- option **B** → `S5BB`: "Låt det nya barnet rita boet." [Let the new child draw the nest.]  
  effects: `{"consequence.S4B.gain": "det nya barnets bo får bli solfågelbildens sista silvertecken", "consequence.S4B.cost": "Mossas stjärna får bli solfågelbildens sista silvertecken", "history.choice.S4B": "S4B:B"}`

## illustrationBrief (verbatim, the full image prompt)

```text
Pre-choice tight three-quarter view of the low table. Amina in her orange top and Iris in her raspberry-red raincoat are clearly visible at opposite sides of the shared solfågelbild. Palm-sized Mossa, much smaller than Iris's hand, waits at the top edge with his green scarf. Exactly one untouched silverpenna lies in the center. Iris keeps both hands on the paper's edge; nobody has started the final silver mark.

Appearance reference for entities already named in the shot above. Never add a character, object, flower, or prop merely because it is listed here:
Hero Iris, barnhjälte: sjuårig flicka med mörka lockar, hallonröd regnjacka och gula stövlar
Companion Mossa, talande skogsmus: liten brun skogsmus med grön halsduk och runda öron
Other Amina, barn: sjuårig flicka med två mörka flätor, orange tröja och blå byxor
Object silverpenna: en vanlig tjock penna som lämnar blanka silverstreck

Style: Warm watercolor and colored-pencil children's-book illustration style, soft light, rounded shapes, expressive small gestures. Absolutely no text, no letters, no numbers, no labels, no signage anywhere in the image.
```

### Anatomy of this brief

- **Shot paragraph** (68 words, 5 sentences). Opens: "Pre-choice tight three-quarter view of the low table." — framing/shot type first, then blocking, then the emotional beat.
- **Appearance reference** lists 4 entities: `Hero Iris, barnhjälte`; `Companion Mossa, talande skogsmus`; `Other Amina, barn`; `Object silverpenna`.
- **Style line**: identical to [`../style-block.txt`](../style-block.txt) in every beat.
