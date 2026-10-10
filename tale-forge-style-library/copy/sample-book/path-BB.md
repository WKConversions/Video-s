# Sample book, path BB (ending 4 of 4): "Iris och den sparade platsen"

The complete text of Tale Forge's sample book *Iris och den sparade platsen* [Iris and the Saved Place] as read along path **BB**: choice 1 = **B**, choice 2 = **B**, ending 4 of 4 on the landing endings map (the sun-bird picture; Amina's silver nest). Six pages: S1 → S2 → S3B → S4B → S5BB → S6BB. Swedish prose is verbatim from [`source/sample-book.iris-och-den-sparade-platsen.json`](../../source/sample-book.iris-och-den-sparade-platsen.json) (`beats[].prose`, `beats[].choice`). The English under each page is a translation written for this library, **not Tale Forge copy**, except the sentences marked OFFICIAL, which are Tale Forge's own English from the landing page dictionary.

## Contents

- [Path facts](#path-facts)
- [Page 1 · S1](#page-1--s1)
- [Page 2 · S2](#page-2--s2)
- [Page 3 · S3B](#page-3--s3b)
- [Page 4 · S4B](#page-4--s4b)
- [Page 5 · S5BB](#page-5--s5bb)
- [Page 6 · S6BB](#page-6--s6bb)
- [Ending state (choice effects)](#ending-state-choice-effects)

## Path facts

| Field | Value | Source |
|---|---|---|
| Beats | S1, S2, S3B, S4B, S5BB, S6BB | [`derived/story/graph.json`](../../derived/story/graph.json) |
| Words / sentences | 662 / 80 (mean 8.28 words per sentence) | [`derived/story/prose-metrics.json`](../../derived/story/prose-metrics.json) `perPath` |
| LIX readability | 27.2 (under 25 = children's books; 25–30 = easy) | same |
| Narration, shipped MP3s | 6:35 (395.5 s) for the six pages | ffprobe on `assets/share/iris-sparade-platsen/assets/<beat>.mp3` |
| Narration, JSON `audio.meta.ms` | 199.2 s (does not match the shipped files) | `beats[].assets.audio.meta.ms` |
| Narrator | `narratorPersona: "grandpa"`, TTS `vertex-gemini-tts:gemini-3.1-flash-tts-preview:Enceladus`, loudness `ffmpeg-loudnorm:-23LUFS:-2dBTP:11LRA` | top-level JSON, `beats[].assets.audio` |
| Landing medallion | [`assets/landing/iris/ending-4.webp`](../../assets/landing/iris/ending-4.webp) (256×256 centre crop of S6BB) | [`derived/story/js-excerpts/landing-explainer…pretty.js`](../../derived/story/js-excerpts/landing-explainer.3d9nxlx1n5pdy.m29416.pretty.js) |

Cover: ![cover](../../assets/share/iris-sparade-platsen/assets/cover.webp)

## Page 1 · S1

Slot 1 · 128 words · 15 sentences · LIX 21.8 · narration 67.08 s · image [`S1.webp`](../../assets/share/iris-sparade-platsen/assets/S1.webp) · audio [`S1.mp3`](../../assets/share/iris-sparade-platsen/assets/S1.mp3)

![S1](../../assets/share/iris-sparade-platsen/assets/S1.webp)

**Svenska (verbatim)**

> Iris kom till kvartersbiblioteket med ett stort ritpapper under armen. Hon hade sparat fönsterplatsen åt Mossa. Där skulle kvällsljuset räcka över hela deras teckning. Men ett nytt barn hade hunnit sätta sig där först. Flickan hette Amina och höll en grön penna redo.
>
> "Kan vi ta en sista ritstund här i fönsterljuset?" frågade hon.
>
> Mossa kikade fram ur Iris luva och snurrade halsduken ett varv.
>
> "Det var ju platsen vi skulle ha", sa han. Sedan såg han på Amina. "Fast nu sitter du där, och jag vill inte tränga bort dig. Iris, kan vi ta vår sista ritstund på gröna mattan i stället? Där ryms en karta stor som en skog."
>
> Iris såg från den tagna fönsterplatsen till mattan. Före sagostunden fanns det bara tid för en ritstund.

**English (library translation)**

> Iris came to the neighbourhood library with a big sheet of drawing paper under her arm. She had saved the window seat for Mossa. There, the evening light would reach across their whole drawing. But a new child had got there first. The girl was called Amina and was holding a green pen at the ready.
>
> "Can we have one last drawing time here in the window light?" she asked.
>
> Mossa peeked out of Iris's hood and twirled his scarf once round.
>
> "That was supposed to be our place," he said. Then he looked at Amina. "But you're sitting there now, and I don't want to push you out. Iris, can we have our last drawing time on the green rug instead? There's room there for a map as big as a forest."
>
> Iris looked from the taken window seat to the rug. Before story time there was only time for one drawing session.

## Page 2 · S2

Slot 2 · 114 words · 14 sentences · LIX 22.2 · narration 67.464 s · image [`S2.webp`](../../assets/share/iris-sparade-platsen/assets/S2.webp) · audio [`S2.mp3`](../../assets/share/iris-sparade-platsen/assets/S2.mp3)

![S2](../../assets/share/iris-sparade-platsen/assets/S2.webp)

**Svenska (verbatim)**

> Iris gick in mellan fönsterbänken och mattan och lade ritpappret på ett lågt bord. Planen för den sparade platsen gällde inte längre. Nu väntade Mossa på mattan, medan Amina ville rita med Iris i fönsterljuset.
>
> När Iris ritade med någon annan brukade hon börja på ena sidan. Då blev det en riktig plats kvar för den andras idé, inte bara en smal kant. Hon drog fingertoppen genom luften över pappret. Här kunde hennes bild vara. Där kunde någon annans ta vid.
>
> "Kom nu", sa Mossa. "Jag har ju tre krokiga stigar i huvudet."
>
> Amina knackade på fönsterbänken. "Ljuset är fint just här."
>
> Sagoboken låg redan framme. När ritstunden var slut skulle bibliotekarien öppna den.

**English (library translation)**

> Iris stepped between the windowsill and the rug and placed the drawing paper on a low table. The plan for the saved place no longer applied. *(these two sentences: OFFICIAL, `en.steps.read.prose`)* Now Mossa was waiting on the rug, while Amina wanted to draw with Iris in the window light.
>
> When Iris drew with someone else, she usually started on one side. That way a real space was left for the other person's idea, not just a thin edge. She drew her fingertip through the air above the paper. Her picture could go here. Someone else's could take over there.
>
> "Come on," said Mossa. "I've got three winding paths in my head, you know."
>
> Amina tapped on the windowsill. "The light is nice just here."
>
> The storybook was already out. When drawing time was over, the librarian would open it.

### Choice after page 2 (`kind: "path"`, `afterSlot: 2`)

> **Det hettade i Iris händer; de ville rycka i stolen. Före sagostunden hinner hon bara rita på ett ställe. Vad gör hon?**

[Iris's hands felt hot; they wanted to tug at the chair. Before story time she only has time to draw in one place. What does she do?]

| Option | Swedish label (verbatim) | English | Leads to | On this path |
|---|---|---|---|---|
| A | Gå med Mossa till den gröna mattan. | Go with Mossa to the green rug. (OFFICIAL) | S3A | not taken |
| B | Stanna och rita med det nya barnet i fönsterljuset. | Stay and draw with the new child in the window light. (OFFICIAL) | S3B | **chosen** |

## Page 3 · S3B

Slot 3 · 106 words · 12 sentences · LIX 28.6 · narration 66.12 s · image [`S3B.webp`](../../assets/share/iris-sparade-platsen/assets/S3B.webp) · audio [`S3B.mp3`](../../assets/share/iris-sparade-platsen/assets/S3B.mp3)

![S3B](../../assets/share/iris-sparade-platsen/assets/S3B.webp)

**Svenska (verbatim)**

> Iris stannade och ritade med Amina i fönsterljuset. Hon lyfte upp ritpappret på fönsterbänken och satte sig bredvid. Mossa kom efter, men den sista ritstunden på gröna mattan var förbi.
>
> "Jaha", sa han och snurrade halsduken. "Då får väl molnen flyga hit."
>
> Iris ritade en rund solfågel på ena sidan och lämnade öppna platser runt den. Mossa ritade molnen. Han ville använda bibliotekets sista tur med silverpennan till en stjärna. Amina ritade solfågelns vingar och ville använda samma sista tur till ett bo.
>
> Bibliotekarien lade silverpennan på fönsterbänken och höll upp ett finger. Efter nästa tecken skulle bilden hängas upp. Bara en idé kunde bli silverblank.

**English (library translation)**

> Iris stayed and drew with Amina in the window light. She lifted the drawing paper up onto the windowsill and sat down beside her. Mossa came after them, but the last drawing time on the green rug was over.
>
> "Oh well," he said, twirling his scarf. "Then the clouds will just have to fly over here."
>
> Iris drew a round sun bird on one side and left open spaces around it. Mossa drew the clouds. He wanted to use the library's last turn with the silver pen for a star. Amina drew the sun bird's wings and wanted to use the same last turn for a nest.
>
> The librarian laid the silver pen on the windowsill and held up one finger. After the next mark, the picture would be hung up. Only one idea could turn shiny silver.

## Page 4 · S4B

Slot 4 · 102 words · 12 sentences · LIX 29.1 · narration 57.264 s · image [`S4B.webp`](../../assets/share/iris-sparade-platsen/assets/S4B.webp) · audio [`S4B.mp3`](../../assets/share/iris-sparade-platsen/assets/S4B.mp3)

![S4B](../../assets/share/iris-sparade-platsen/assets/S4B.webp)

**Svenska (verbatim)**

> Bibliotekarien bar solfågelbilden till det låga bordet vid väggen. Iris höll pappret stilla. Mossa stod vid den öppna platsen ovanför molnen. Amina satt vid den öppna platsen mellan vingarna. Silverpennan låg mitt emellan dem.
>
> "Min stjärna skulle lysa över molnen", sa Mossa.
>
> "Mitt bo skulle höra ihop med vingarna", sa Amina.
>
> Båda tecknen skulle ta en hel tur. Bibliotekarien väntade med klämmorna och skulle hänga upp bilden direkt efter nästa tecken. Iris hade lämnat plats för båda idéerna, men silverpennan räckte bara till en. Det hettade i händerna. De ville gripa pennan och fara över pappret fortare än någon hann säga stopp.

**English (library translation)**

> The librarian carried the sun-bird picture to the low table by the wall. Iris held the paper still. Mossa stood by the open space above the clouds. Amina sat by the open space between the wings. The silver pen lay right between them.
>
> "My star would shine over the clouds," said Mossa.
>
> "My nest would belong with the wings," said Amina.
>
> Each mark would take a whole turn. The librarian waited with the clips and would hang the picture up straight after the next mark. Iris had left room for both ideas, but the silver pen was only enough for one. Her hands felt hot. They wanted to grab the pen and race across the paper faster than anyone could say stop.

### Choice after page 4 (`kind: "ordeal"`, `afterSlot: 4`)

> **Solfågelbilden ska hängas upp, och bara en tur med silverpennan återstår. Vem får rita bildens sista tecken?**

[The sun-bird picture is to be hung up, and only one turn with the silver pen is left. Who gets to draw the picture's last mark?]

| Option | Swedish label (verbatim) | English | Leads to | On this path |
|---|---|---|---|---|
| A | Låt Mossa rita stjärnan. | Let Mossa draw the star. | S5BA | not taken |
| B | Låt det nya barnet rita boet. | Let the new child draw the nest. | S5BB | **chosen** |

## Page 5 · S5BB

Slot 5 · 107 words · 14 sentences · LIX 31.9 · narration 65.064 s · image [`S5BB.webp`](../../assets/share/iris-sparade-platsen/assets/S5BB.webp) · audio [`S5BB.mp3`](../../assets/share/iris-sparade-platsen/assets/S5BB.mp3)

![S5BB](../../assets/share/iris-sparade-platsen/assets/S5BB.webp)

**Svenska (verbatim)**

> Iris lät Amina rita boet. Amina sträckte sig efter silverpennan. Då lade Iris snabbt handen över den öppna platsen mellan vingarna.
>
> "Vänta", sa hon.
>
> Händerna ville fortfarande hinna först. Men under handflatan fanns platsen hon hade sparat åt någon annans idé. Iris flyttade handen till papprets kant och sköt pennan mot Amina.
>
> Amina ritade ett runt bo mellan vingarna. Mossa satt vid molnen och såg på platsen där stjärnan inte skulle komma. Han snurrade halsduken långsamt.
>
> När sista kvisten var ritad, puffade silverboet upp sig som om en osynlig fågel landat där. Iris höll pappret stadigt. Boet blev bildens sista silvertecken. Någon silverstjärna fanns inte ovanför molnen.

**English (library translation)**

> Iris let Amina draw the nest. Amina reached for the silver pen. Then Iris quickly put her hand over the open space between the wings.
>
> "Wait," she said.
>
> Her hands still wanted to get there first. But under her palm was the space she had saved for someone else's idea. Iris moved her hand to the edge of the paper and pushed the pen towards Amina.
>
> Amina drew a round nest between the wings. Mossa sat by the clouds and looked at the place where the star would not come. He twirled his scarf slowly.
>
> When the last twig was drawn, the silver nest puffed itself up as if an invisible bird had landed there. Iris held the paper steady. The nest became the picture's last silver mark. There was no silver star above the clouds.

## Page 6 · S6BB

Slot 6 · 105 words · 13 sentences · LIX 30.9 · narration 72.552 s · image [`S6BB.webp`](../../assets/share/iris-sparade-platsen/assets/S6BB.webp) · audio [`S6BB.mp3`](../../assets/share/iris-sparade-platsen/assets/S6BB.mp3)

![S6BB](../../assets/share/iris-sparade-platsen/assets/S6BB.webp)

**Svenska (verbatim)**

> Bibliotekarien hängde upp solfågelbilden, och sagostunden började. Iris och Amina hade ritat i fönsterljuset. Den sista ritstunden med Mossa på gröna mattan hade inte blivit av. Aminas silverbo låg mellan vingarna. Över Mossas moln fanns ingen silverstjärna.
>
> Iris satte sig vid kanten av sagomattan. Hon lämnade plats på ena knät och höll det andra intill Amina. Mossa hoppade upp, virade halsduken runt tassarna och såg på bilden.
>
> "Moln behöver väl inte alltid en stjärna", mumlade han. "De kan vaka över ett bo."
>
> Amina knackade lätt mot Iris hand. Iris öppnade sagoboken mellan dem. Bakom deras huvuden puffade silverboet till, och fönsterljuset föll över alla tre.

**English (library translation)**

> The librarian hung up the sun-bird picture, and story time began. Iris and Amina had drawn in the window light. The last drawing time with Mossa on the green rug had not happened. Amina's silver nest lay between the wings. Over Mossa's clouds there was no silver star.
>
> Iris sat down at the edge of the story rug. She left room on one knee and kept the other close to Amina. Mossa hopped up, wrapped his scarf around his paws and looked at the picture.
>
> "Clouds don't always need a star, do they," he mumbled. "They can keep watch over a nest."
>
> Amina tapped lightly against Iris's hand. Iris opened the storybook between them. Behind their heads the silver nest gave a little puff, and the window light fell across all three.

## Ending state (choice effects)

Each option writes `effects.set` keys into the story state. The values set on this path, verbatim:

| Key | Value |
|---|---|
| `consequence.S2.gain` | en sista ritstund med det nya barnet i fönsterljuset |
| `consequence.S2.cost` | en sista ritstund med Mossa på den gröna mattan |
| `history.choice.S2` | S2:B |
| `consequence.S4B.gain` | det nya barnets bo får bli solfågelbildens sista silvertecken |
| `consequence.S4B.cost` | Mossas stjärna får bli solfågelbildens sista silvertecken |
| `history.choice.S4B` | S4B:B |

Read: every ending names what was gained **and** what was given up ("gain"/"cost"), and the closing page restates the loss plainly before the story-time image. See [`analysis/12-story-and-content-model.md`](../../analysis/12-story-and-content-model.md).
