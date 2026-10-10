# Sample book, path AB (ending 2 of 4): "Iris och den sparade platsen"

The complete text of Tale Forge's sample book *Iris och den sparade platsen* [Iris and the Saved Place] as read along path **AB**: choice 1 = **A**, choice 2 = **B**, ending 2 of 4 on the landing endings map (the moss map; Amina's silver bird). Six pages: S1 → S2 → S3A → S4A → S5AB → S6AB. Swedish prose is verbatim from [`source/sample-book.iris-och-den-sparade-platsen.json`](../../source/sample-book.iris-och-den-sparade-platsen.json) (`beats[].prose`, `beats[].choice`). The English under each page is a translation written for this library, **not Tale Forge copy**, except the sentences marked OFFICIAL, which are Tale Forge's own English from the landing page dictionary.

## Contents

- [Path facts](#path-facts)
- [Page 1 · S1](#page-1--s1)
- [Page 2 · S2](#page-2--s2)
- [Page 3 · S3A](#page-3--s3a)
- [Page 4 · S4A](#page-4--s4a)
- [Page 5 · S5AB](#page-5--s5ab)
- [Page 6 · S6AB](#page-6--s6ab)
- [Ending state (choice effects)](#ending-state-choice-effects)

## Path facts

| Field | Value | Source |
|---|---|---|
| Beats | S1, S2, S3A, S4A, S5AB, S6AB | [`derived/story/graph.json`](../../derived/story/graph.json) |
| Words / sentences | 660 / 78 (mean 8.46 words per sentence) | [`derived/story/prose-metrics.json`](../../derived/story/prose-metrics.json) `perPath` |
| LIX readability | 26.0 (under 25 = children's books; 25–30 = easy) | same |
| Narration, shipped MP3s | 6:21 (381.0 s) for the six pages | ffprobe on `assets/share/iris-sparade-platsen/assets/<beat>.mp3` |
| Narration, JSON `audio.meta.ms` | 205.6 s (does not match the shipped files) | `beats[].assets.audio.meta.ms` |
| Narrator | `narratorPersona: "grandpa"`, TTS `vertex-gemini-tts:gemini-3.1-flash-tts-preview:Enceladus`, loudness `ffmpeg-loudnorm:-23LUFS:-2dBTP:11LRA` | top-level JSON, `beats[].assets.audio` |
| Landing medallion | [`assets/landing/iris/ending-2.webp`](../../assets/landing/iris/ending-2.webp) (256×256 centre crop of S6AB) | [`derived/story/js-excerpts/landing-explainer…pretty.js`](../../derived/story/js-excerpts/landing-explainer.3d9nxlx1n5pdy.m29416.pretty.js) |

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
| A | Gå med Mossa till den gröna mattan. | Go with Mossa to the green rug. (OFFICIAL) | S3A | **chosen** |
| B | Stanna och rita med det nya barnet i fönsterljuset. | Stay and draw with the new child in the window light. (OFFICIAL) | S3B | not taken |

## Page 3 · S3A

Slot 3 · 110 words · 12 sentences · LIX 30.1 · narration 64.32 s · image [`S3A.webp`](../../assets/share/iris-sparade-platsen/assets/S3A.webp) · audio [`S3A.mp3`](../../assets/share/iris-sparade-platsen/assets/S3A.mp3)

![S3A](../../assets/share/iris-sparade-platsen/assets/S3A.webp)

**Svenska (verbatim)**

> Iris gick med Mossa till den gröna mattan. Hon bar dit ritpappret och lade det mitt framför dem. Amina lämnade fönsterbänken och satte sig vid papprets andra kant.
>
> "Då blir det ingen ritstund i fönsterljuset", sa hon. "Men jag vill gärna hjälpa till här."
>
> Iris ritade gröna mossöar på ena sidan och lämnade öppna platser intill. Mossa ritade kartans stigar. Han ville använda bibliotekets sista tur med silverpennan till en måne. Amina ritade träden och ville använda samma sista tur till en fågel.
>
> Bibliotekarien lade silverpennan bredvid pappret och höll upp ett finger. Efter nästa tecken skulle mosskartan hängas upp. Två tomma platser väntade, men bara en kunde bli silverblank.

**English (library translation)**

> Iris went with Mossa to the green rug. She carried the drawing paper over and laid it right in front of them. Amina left the windowsill and sat down at the paper's other edge.
>
> "So there won't be any drawing time in the window light," she said. "But I'd really like to help here."
>
> Iris drew green moss islands on one side and left open spaces next to them. Mossa drew the map's paths. He wanted to use the library's last turn with the silver pen for a moon. Amina drew the trees and wanted to use the same last turn for a bird.
>
> The librarian laid the silver pen next to the paper and held up one finger. After the next mark, the moss map would be hung up. Two empty spaces were waiting, but only one could turn shiny silver.

## Page 4 · S4A

Slot 4 · 100 words · 12 sentences · LIX 24.3 · narration 53.304 s · image [`S4A.webp`](../../assets/share/iris-sparade-platsen/assets/S4A.webp) · audio [`S4A.mp3`](../../assets/share/iris-sparade-platsen/assets/S4A.mp3)

![S4A](../../assets/share/iris-sparade-platsen/assets/S4A.webp)

**Svenska (verbatim)**

> Bibliotekarien bar mosskartan till det låga bordet vid väggen. Iris lade handen på ena hörnet så att pappret låg stilla. Mossa stod vid platsen ovanför stigarna. Amina satt vid platsen bredvid träden. Silverpennan låg mitt emellan dem.
>
> "Månen visar ju vägen genom min skog", sa Mossa.
>
> "Och fågeln kan visa var träden slutar", sa Amina.
>
> Båda tecknen skulle fylla en hel tur. Bibliotekarien höll redan upp klämmorna som kartan skulle hängas i direkt efter nästa tur. Iris såg de två platser hon lämnat. Det brände i fingertopparna. Hon ville rycka åt sig pennan och försöka hinna allt på en gång.

**English (library translation)**

> The librarian carried the moss map to the low table by the wall. Iris put her hand on one corner so the paper lay still. Mossa stood by the space above the paths. Amina sat by the space beside the trees. The silver pen lay right between them.
>
> "The moon shows the way through my forest, you know," said Mossa.
>
> "And the bird can show where the trees end," said Amina.
>
> Each mark would take a whole turn. The librarian was already holding up the clips the map would hang from straight after the next turn. Iris looked at the two spaces she had left. Her fingertips burned. She wanted to snatch the pen and try to fit everything in at once.

### Choice after page 4 (`kind: "ordeal"`, `afterSlot: 4`)

> **Mosskartan ska hängas upp, och bara en tur med silverpennan återstår. Vem får rita kartans sista tecken?**

[The moss map is to be hung up, and only one turn with the silver pen is left. Who gets to draw the map's last mark?]

| Option | Swedish label (verbatim) | English | Leads to | On this path |
|---|---|---|---|---|
| A | Låt Mossa rita månen. | Let Mossa draw the moon. | S5AA | not taken |
| B | Låt det nya barnet rita fågeln. | Let the new child draw the bird. | S5AB | **chosen** |

## Page 5 · S5AB

Slot 5 · 103 words · 13 sentences · LIX 32.2 · narration 63.24 s · image [`S5AB.webp`](../../assets/share/iris-sparade-platsen/assets/S5AB.webp) · audio [`S5AB.mp3`](../../assets/share/iris-sparade-platsen/assets/S5AB.mp3)

![S5AB](../../assets/share/iris-sparade-platsen/assets/S5AB.webp)

**Svenska (verbatim)**

> Iris lät Amina rita fågeln. Hon räckte fram silverpennan, men fingrarna knep kvar om mitten. Pennan rörde sig inte. Amina höll i andra änden och väntade.
>
> Mossa snurrade halsduken ett varv. Iris såg platsen bredvid träden, den som hon själv hade lämnat öppen. Hon släppte pennan och lade handflatan på kartans kant i stället.
>
> Amina ritade en liten fågel med utbredda vingar. När näbben blev klar, flaxade silvervingarna en enda gång fast pappret låg stilla.
>
> Mossa tittade upp mot platsen ovanför stigarna. Ingen silvermåne fanns där. Iris drog inte tillbaka pennan. Fågeln fick kartans sista silverstreck, och Amina log så att flätorna gungade.

**English (library translation)**

> Iris let Amina draw the bird. She held out the silver pen, but her fingers kept pinching its middle. The pen didn't move. Amina held the other end and waited.
>
> Mossa twirled his scarf once round. Iris saw the space beside the trees, the one she herself had left open. She let go of the pen and laid her palm on the edge of the map instead.
>
> Amina drew a little bird with outspread wings. When the beak was finished, the silver wings flapped a single time, though the paper lay still.
>
> Mossa looked up at the space above the paths. There was no silver moon there. Iris did not pull the pen back. The bird got the map's last silver stroke, and Amina smiled so that her braids swung.

## Page 6 · S6AB

Slot 6 · 105 words · 12 sentences · LIX 26.8 · narration 65.64 s · image [`S6AB.webp`](../../assets/share/iris-sparade-platsen/assets/S6AB.webp) · audio [`S6AB.mp3`](../../assets/share/iris-sparade-platsen/assets/S6AB.mp3)

![S6AB](../../assets/share/iris-sparade-platsen/assets/S6AB.webp)

**Svenska (verbatim)**

> Bibliotekarien hängde upp mosskartan, och sagostunden började. Iris hade ritat med Mossa på gröna mattan. Hon och Amina hade inte fått sin sista ritstund i fönsterljuset. Aminas silverfågel flög över träden, men ingen silvermåne syntes ovanför Mossas stigar.
>
> Iris satte sig på mattan och lämnade en liten plats på den öppna sagobokens kant. Mossa slog sig ner där. Amina satt på andra sidan Iris.
>
> "Du kan välja första stigen i berättelsen", viskade Iris till Mossa.
>
> Han snurrade halsduken och pekade. Amina följde stigen med fingret i luften. Iris lutade sig närmare båda två. Bakom dem blinkade silverfågeln, och på kartan fick natten vara utan måne.

**English (library translation)**

> The librarian hung up the moss map, and story time began. Iris had drawn with Mossa on the green rug. She and Amina had not had their last drawing time in the window light. Amina's silver bird flew over the trees, but no silver moon could be seen above Mossa's paths.
>
> Iris sat down on the rug and left a little space on the edge of the open storybook. Mossa settled down there. Amina sat on Iris's other side.
>
> "You can choose the first path in the story," Iris whispered to Mossa.
>
> He twirled his scarf and pointed. Amina followed the path with her finger in the air. Iris leaned closer to both of them. Behind them the silver bird blinked, and on the map the night was allowed to have no moon.

## Ending state (choice effects)

Each option writes `effects.set` keys into the story state. The values set on this path, verbatim:

| Key | Value |
|---|---|
| `consequence.S2.gain` | en sista ritstund med Mossa på den gröna mattan |
| `consequence.S2.cost` | en sista ritstund med det nya barnet i fönsterljuset |
| `history.choice.S2` | S2:A |
| `consequence.S4A.gain` | det nya barnets fågel får bli mosskartans sista silvertecken |
| `consequence.S4A.cost` | Mossas måne får bli mosskartans sista silvertecken |
| `history.choice.S4A` | S4A:B |

Read: every ending names what was gained **and** what was given up ("gain"/"cost"), and the closing page restates the loss plainly before the story-time image. See [`analysis/12-story-and-content-model.md`](../../analysis/12-story-and-content-model.md).
