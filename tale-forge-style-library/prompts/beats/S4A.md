# Beat S4A — "Iris och den sparade platsen"

Verbatim prose and image prompt for beat **S4A** of the sample book, from `source/sample-book.iris-och-den-sparade-platsen.json` (`beats[4]`). Slot 4 of 6 · path: branch A — choice 2 · pathTag `neutral`. Prose is Swedish (the book language); the illustration brief is English with Swedish canon descriptions embedded, exactly as the engine sent it.

| field | value |
|---|---|
| beatId / slot | `S4A` / 4 |
| reached from | `S3A` |
| leads to | `S5AA` / `S5AB` |
| image | [`assets/share/iris-sparade-platsen/assets/S4A.webp`](../../assets/share/iris-sparade-platsen/assets/S4A.webp) — 1264x848 px, provider `existing` |
| narration | [`assets/share/iris-sparade-platsen/assets/S4A.mp3`](../../assets/share/iris-sparade-platsen/assets/S4A.mp3) — 28627 ms, `vertex-gemini-tts:gemini-3.1-flash-tts-preview:Enceladus`, `ffmpeg-loudnorm:-23LUFS:-2dBTP:11LRA` |

![S4A](../../assets/share/iris-sparade-platsen/assets/S4A.webp)

## Prose (verbatim, Swedish)

> Bibliotekarien bar mosskartan till det låga bordet vid väggen. Iris lade handen på ena hörnet så att pappret låg stilla. Mossa stod vid platsen ovanför stigarna. Amina satt vid platsen bredvid träden. Silverpennan låg mitt emellan dem.
>
> "Månen visar ju vägen genom min skog", sa Mossa.
>
> "Och fågeln kan visa var träden slutar", sa Amina.
>
> Båda tecknen skulle fylla en hel tur. Bibliotekarien höll redan upp klämmorna som kartan skulle hängas i direkt efter nästa tur. Iris såg de två platser hon lämnat. Det brände i fingertopparna. Hon ville rycka åt sig pennan och försöka hinna allt på en gång.

English gloss (summary, not a translation): [At the low table by the wall both blank spaces wait, the silver pen between them. Mossa argues for the moon, Amina for the bird. Iris's fingertips burn; she wants to grab the pen and do everything at once.]

## Choice after this beat (verbatim)

- kind: `ordeal` · afterSlot: 4
- prompt: "Mosskartan ska hängas upp, och bara en tur med silverpennan återstår. Vem får rita kartans sista tecken?"  
  [The moss map is to be hung, and only one turn with the silver pen remains. Who gets to draw the map's last mark?]
- option **A** → `S5AA`: "Låt Mossa rita månen." [Let Mossa draw the moon.]  
  effects: `{"consequence.S4A.gain": "Mossas måne får bli mosskartans sista silvertecken", "consequence.S4A.cost": "det nya barnets fågel får bli mosskartans sista silvertecken", "history.choice.S4A": "S4A:A"}`
- option **B** → `S5AB`: "Låt det nya barnet rita fågeln." [Let the new child draw the bird.]  
  effects: `{"consequence.S4A.gain": "det nya barnets fågel får bli mosskartans sista silvertecken", "consequence.S4A.cost": "Mossas måne får bli mosskartans sista silvertecken", "history.choice.S4A": "S4A:B"}`

## illustrationBrief (verbatim, the full image prompt)

```text
Pre-choice. Tight tabletop frame at the low table by the wall. Iris holds one corner of the mosskarta flat, her other hand tense but suspended above the untouched silverpenna. Mossa stands beside the blank space above the winding paths; Amina sits beside the blank space near the trees. Both open spaces remain empty, and the librarian’s hanging clips are visible at the edge of the table, with no one touching the pen.

Appearance reference for entities already named in the shot above. Never add a character, object, flower, or prop merely because it is listed here:
Hero Iris, barnhjälte: sjuårig flicka med mörka lockar, hallonröd regnjacka och gula stövlar
Companion Mossa, talande skogsmus: liten brun skogsmus med grön halsduk och runda öron
Other Amina, barn: sjuårig flicka med två mörka flätor, orange tröja och blå byxor
Object silverpenna: en vanlig tjock penna som lämnar blanka silverstreck

Style: Warm watercolor and colored-pencil children's-book illustration style, soft light, rounded shapes, expressive small gestures. Absolutely no text, no letters, no numbers, no labels, no signage anywhere in the image.
```

### Anatomy of this brief

- **Shot paragraph** (72 words, 5 sentences). Opens: "Pre-choice. Tight tabletop frame at the low table by the wall." — framing/shot type first, then blocking, then the emotional beat.
- **Appearance reference** lists 4 entities: `Hero Iris, barnhjälte`; `Companion Mossa, talande skogsmus`; `Other Amina, barn`; `Object silverpenna`.
- **Style line**: identical to [`../style-block.txt`](../style-block.txt) in every beat.
