# Sample book text: "Iris och den sparade platsen"

The complete text of the sample book that the landing page links to ("Läs exempelboken" / "Read the sample book"), verbatim from [source/sample-book.iris-och-den-sparade-platsen.json](../source/sample-book.iris-och-den-sparade-platsen.json) (`beats[].prose`, `beats[].choice`). Swedish only: the book exists in one language and the English site still calls it "the Swedish sample". 14 beats, 1514 words in all; one path through the book (S1, S2, S3, S4, S5, S6) is six beats.
Each beat links its painted spread (WebP) and its narration (MP3, narrator persona `grandpa`). The share route /share/iris-sparade-platsen itself returned 404 when harvested, see [pages/share_iris-sparade-platsen.404.md](pages/share_iris-sparade-platsen.404.md). Story structure, illustration briefs and style prompt belong to the story/illustration analyses; this file is the literal text only.

## Contents

1. [Book data](#1-book-data)
2. [Branch tree](#2-branch-tree)
3. [Text by beat](#3-text-by-beat)
4. [Typography of the prose](#4-typography-of-the-prose)

## 1. Book data

| Field | Value |
|---|---|
| `title` | Iris och den sparade platsen |
| `language` / `band` | sv / B (age band B = "6 till 7 år") |
| `throughline` | Iris vill dela sin sista ritstund före sagostunden, men fönsterplatsen hon sparat åt Mossa är tagen; nu måste hon välja var hon ritar och vem som får bildens sista silvertecken. |
| `spec.premiseAnchor` | Iris hade sparat fönsterplatsen åt Mossa, men ett nytt barn hann sätta sig där först. |
| `canon.hero` | Iris: sjuårig flicka med mörka lockar, hallonröd regnjacka och gula stövlar; lämnar alltid lite plats på sidan när hon ritar med någon annan |
| `canon.companion` | Mossa (talande skogsmus): liten brun skogsmus med grön halsduk och runda öron; snurrar halsduken ett varv när han tänker |
| `canon.others` | Amina (barn): sjuårig flicka med två mörka flätor, orange tröja och blå byxor; knackar lätt med pekfingret mot pappret när hon får en idé |
| `canon.place` | kvartersbiblioteket: låga bokhyllor, en bred fönsterbänk och en mjuk grön matta |
| `narratorPersona` | grandpa (shown as "Morfar" / "Grandpa Erik" on the landing page) |
| Cover | [cover.webp](../assets/share/iris-sparade-platsen/assets/cover.webp) |

## 2. Branch tree

```
S1 → S2 ─┬─ A → S3A → S4A ─┬─ A → S5AA → S6AA
         │                └─ B → S5AB → S6AB
         └─ B → S3B → S4B ─┬─ A → S5BA → S6BA
                          └─ B → S5BB → S6BB
```

- **After S2** (`kind: path`): "Det hettade i Iris händer; de ville rycka i stolen. Före sagostunden hinner hon bara rita på ett ställe. Vad gör hon?"
  - A → S3A: "Gå med Mossa till den gröna mattan."
  - B → S3B: "Stanna och rita med det nya barnet i fönsterljuset."
- **After S4A** (`kind: ordeal`): "Mosskartan ska hängas upp, och bara en tur med silverpennan återstår. Vem får rita kartans sista tecken?"
  - A → S5AA: "Låt Mossa rita månen."
  - B → S5AB: "Låt det nya barnet rita fågeln."
- **After S4B** (`kind: ordeal`): "Solfågelbilden ska hängas upp, och bara en tur med silverpennan återstår. Vem får rita bildens sista tecken?"
  - A → S5BA: "Låt Mossa rita stjärnan."
  - B → S5BB: "Låt det nya barnet rita boet."

## 3. Text by beat

### S1

Slot 1 · next: S2 · 128 words · [image](../assets/share/iris-sparade-platsen/assets/S1.webp) · [narration](../assets/share/iris-sparade-platsen/assets/S1.mp3) (34.6 s)

> Iris kom till kvartersbiblioteket med ett stort ritpapper under armen. Hon hade sparat fönsterplatsen åt Mossa. Där skulle kvällsljuset räcka över hela deras teckning. Men ett nytt barn hade hunnit sätta sig där först. Flickan hette Amina och höll en grön penna redo.
>
> "Kan vi ta en sista ritstund här i fönsterljuset?" frågade hon.
>
> Mossa kikade fram ur Iris luva och snurrade halsduken ett varv.
>
> "Det var ju platsen vi skulle ha", sa han. Sedan såg han på Amina. "Fast nu sitter du där, och jag vill inte tränga bort dig. Iris, kan vi ta vår sista ritstund på gröna mattan i stället? Där ryms en karta stor som en skog."
>
> Iris såg från den tagna fönsterplatsen till mattan. Före sagostunden fanns det bara tid för en ritstund.

### S2

Slot 2 · 114 words · [image](../assets/share/iris-sparade-platsen/assets/S2.webp) · [narration](../assets/share/iris-sparade-platsen/assets/S2.mp3) (41.5 s)

> Iris gick in mellan fönsterbänken och mattan och lade ritpappret på ett lågt bord. Planen för den sparade platsen gällde inte längre. Nu väntade Mossa på mattan, medan Amina ville rita med Iris i fönsterljuset.
>
> När Iris ritade med någon annan brukade hon börja på ena sidan. Då blev det en riktig plats kvar för den andras idé, inte bara en smal kant. Hon drog fingertoppen genom luften över pappret. Här kunde hennes bild vara. Där kunde någon annans ta vid.
>
> "Kom nu", sa Mossa. "Jag har ju tre krokiga stigar i huvudet."
>
> Amina knackade på fönsterbänken. "Ljuset är fint just här."
>
> Sagoboken låg redan framme. När ritstunden var slut skulle bibliotekarien öppna den.

**Choice** — Det hettade i Iris händer; de ville rycka i stolen. Före sagostunden hinner hon bara rita på ett ställe. Vad gör hon?

- A: Gå med Mossa till den gröna mattan. → S3A
- B: Stanna och rita med det nya barnet i fönsterljuset. → S3B

### S3A

Slot 3 · next: S4A · 110 words · [image](../assets/share/iris-sparade-platsen/assets/S3A.webp) · [narration](../assets/share/iris-sparade-platsen/assets/S3A.mp3) (40.5 s)

> Iris gick med Mossa till den gröna mattan. Hon bar dit ritpappret och lade det mitt framför dem. Amina lämnade fönsterbänken och satte sig vid papprets andra kant.
>
> "Då blir det ingen ritstund i fönsterljuset", sa hon. "Men jag vill gärna hjälpa till här."
>
> Iris ritade gröna mossöar på ena sidan och lämnade öppna platser intill. Mossa ritade kartans stigar. Han ville använda bibliotekets sista tur med silverpennan till en måne. Amina ritade träden och ville använda samma sista tur till en fågel.
>
> Bibliotekarien lade silverpennan bredvid pappret och höll upp ett finger. Efter nästa tecken skulle mosskartan hängas upp. Två tomma platser väntade, men bara en kunde bli silverblank.

### S3B

Slot 3 · next: S4B · 106 words · [image](../assets/share/iris-sparade-platsen/assets/S3B.webp) · [narration](../assets/share/iris-sparade-platsen/assets/S3B.mp3) (28.0 s)

> Iris stannade och ritade med Amina i fönsterljuset. Hon lyfte upp ritpappret på fönsterbänken och satte sig bredvid. Mossa kom efter, men den sista ritstunden på gröna mattan var förbi.
>
> "Jaha", sa han och snurrade halsduken. "Då får väl molnen flyga hit."
>
> Iris ritade en rund solfågel på ena sidan och lämnade öppna platser runt den. Mossa ritade molnen. Han ville använda bibliotekets sista tur med silverpennan till en stjärna. Amina ritade solfågelns vingar och ville använda samma sista tur till ett bo.
>
> Bibliotekarien lade silverpennan på fönsterbänken och höll upp ett finger. Efter nästa tecken skulle bilden hängas upp. Bara en idé kunde bli silverblank.

### S4A

Slot 4 · 100 words · [image](../assets/share/iris-sparade-platsen/assets/S4A.webp) · [narration](../assets/share/iris-sparade-platsen/assets/S4A.mp3) (28.6 s)

> Bibliotekarien bar mosskartan till det låga bordet vid väggen. Iris lade handen på ena hörnet så att pappret låg stilla. Mossa stod vid platsen ovanför stigarna. Amina satt vid platsen bredvid träden. Silverpennan låg mitt emellan dem.
>
> "Månen visar ju vägen genom min skog", sa Mossa.
>
> "Och fågeln kan visa var träden slutar", sa Amina.
>
> Båda tecknen skulle fylla en hel tur. Bibliotekarien höll redan upp klämmorna som kartan skulle hängas i direkt efter nästa tur. Iris såg de två platser hon lämnat. Det brände i fingertopparna. Hon ville rycka åt sig pennan och försöka hinna allt på en gång.

**Choice** — Mosskartan ska hängas upp, och bara en tur med silverpennan återstår. Vem får rita kartans sista tecken?

- A: Låt Mossa rita månen. → S5AA
- B: Låt det nya barnet rita fågeln. → S5AB

### S4B

Slot 4 · 102 words · [image](../assets/share/iris-sparade-platsen/assets/S4B.webp) · [narration](../assets/share/iris-sparade-platsen/assets/S4B.mp3) (28.8 s)

> Bibliotekarien bar solfågelbilden till det låga bordet vid väggen. Iris höll pappret stilla. Mossa stod vid den öppna platsen ovanför molnen. Amina satt vid den öppna platsen mellan vingarna. Silverpennan låg mitt emellan dem.
>
> "Min stjärna skulle lysa över molnen", sa Mossa.
>
> "Mitt bo skulle höra ihop med vingarna", sa Amina.
>
> Båda tecknen skulle ta en hel tur. Bibliotekarien väntade med klämmorna och skulle hänga upp bilden direkt efter nästa tecken. Iris hade lämnat plats för båda idéerna, men silverpennan räckte bara till en. Det hettade i händerna. De ville gripa pennan och fara över pappret fortare än någon hann säga stopp.

**Choice** — Solfågelbilden ska hängas upp, och bara en tur med silverpennan återstår. Vem får rita bildens sista tecken?

- A: Låt Mossa rita stjärnan. → S5BA
- B: Låt det nya barnet rita boet. → S5BB

### S5AA

Slot 5 · next: S6AA · 107 words · [image](../assets/share/iris-sparade-platsen/assets/S5AA.webp) · [narration](../assets/share/iris-sparade-platsen/assets/S5AA.mp3) (26.2 s)

> Iris lät Mossa rita månen. Hon sköt silverpennan över bordet tills den låg framför tassarna och pekade på den öppna platsen ovanför stigarna.
>
> Mossa tog pennan med båda tassarna. Halsduken släpade genom mossan medan han ritade en rund måne. Iris höll kartan stilla utan att täcka träden eller platsen bredvid dem.
>
> Amina tittade på den tomma platsen där fågeln kunde ha varit. Hon knackade en gång mot bordet och drog sedan fingret längs sina träd.
>
> Mossa slöt månens ring. Silvermånen blinkade till fast ingen rörde pappret. Iris rätade på ryggen. Hon hade inte ryckt åt sig pennan. Kartan bar Mossas måne, och någon silverfågel fanns inte där.

### S5AB

Slot 5 · next: S6AB · 103 words · [image](../assets/share/iris-sparade-platsen/assets/S5AB.webp) · [narration](../assets/share/iris-sparade-platsen/assets/S5AB.mp3) (30.0 s)

> Iris lät Amina rita fågeln. Hon räckte fram silverpennan, men fingrarna knep kvar om mitten. Pennan rörde sig inte. Amina höll i andra änden och väntade.
>
> Mossa snurrade halsduken ett varv. Iris såg platsen bredvid träden, den som hon själv hade lämnat öppen. Hon släppte pennan och lade handflatan på kartans kant i stället.
>
> Amina ritade en liten fågel med utbredda vingar. När näbben blev klar, flaxade silvervingarna en enda gång fast pappret låg stilla.
>
> Mossa tittade upp mot platsen ovanför stigarna. Ingen silvermåne fanns där. Iris drog inte tillbaka pennan. Fågeln fick kartans sista silverstreck, och Amina log så att flätorna gungade.

### S5BA

Slot 5 · next: S6BA · 114 words · [image](../assets/share/iris-sparade-platsen/assets/S5BA.webp) · [narration](../assets/share/iris-sparade-platsen/assets/S5BA.mp3) (32.1 s)

> Iris lät Mossa rita stjärnan. Hon vände pappret en aning på det låga bordet så att platsen ovanför molnen låg framför honom. Sedan rullade hon silverpennan över bordet till hans tassar.
>
> Mossa satte ena foten på pennan och styrde med hela kroppen. Först kom ett streck, sedan fem spetsar. Iris höll kvar sin solfågel på ena sidan och lämnade Aminas vingar fria på den andra.
>
> Amina följde den tomma platsen mellan vingarna med blicken. Där blev inget silverbo.
>
> När Mossa ritade sista spetsen, glimmade stjärnan och hoppade till på pappret. Mossa tappade nästan halsduken av förvåning. Iris skrattade till. Hon hade valt utan att knuffa sig före, och stjärnan lyste över deras gemensamma bild.

### S5BB

Slot 5 · next: S6BB · 107 words · [image](../assets/share/iris-sparade-platsen/assets/S5BB.webp) · [narration](../assets/share/iris-sparade-platsen/assets/S5BB.mp3) (35.6 s)

> Iris lät Amina rita boet. Amina sträckte sig efter silverpennan. Då lade Iris snabbt handen över den öppna platsen mellan vingarna.
>
> "Vänta", sa hon.
>
> Händerna ville fortfarande hinna först. Men under handflatan fanns platsen hon hade sparat åt någon annans idé. Iris flyttade handen till papprets kant och sköt pennan mot Amina.
>
> Amina ritade ett runt bo mellan vingarna. Mossa satt vid molnen och såg på platsen där stjärnan inte skulle komma. Han snurrade halsduken långsamt.
>
> När sista kvisten var ritad, puffade silverboet upp sig som om en osynlig fågel landat där. Iris höll pappret stadigt. Boet blev bildens sista silvertecken. Någon silverstjärna fanns inte ovanför molnen.

### S6AA

Slot 6 · 110 words · [image](../assets/share/iris-sparade-platsen/assets/S6AA.webp) · [narration](../assets/share/iris-sparade-platsen/assets/S6AA.mp3) (27.4 s)

> Bibliotekarien hängde upp mosskartan, och sagostunden började. Iris hade fått sin sista ritstund med Mossa på gröna mattan. Ritstunden med Amina i fönsterljuset hade inte blivit av. På kartan lyste Mossas måne. Ingen silverfågel flög över Aminas träd.
>
> Iris satte sig på mattan, men inte mitt på den mjukaste platsen. Hon lämnade en bred bit bredvid knät. Amina slog sig ner där. Mossa klättrade upp på Iris gula stövel.
>
> "Min måne kan nog lysa åt dina träd också", viskade han till Amina.
>
> Amina pekade ut en krokig stig åt honom. Iris höll sagoboken så att alla tre såg. Bakom dem glimmade månen över kartan, och fönsterplatsen stod tom i kvällsljuset.

### S6AB

Slot 6 · 105 words · [image](../assets/share/iris-sparade-platsen/assets/S6AB.webp) · [narration](../assets/share/iris-sparade-platsen/assets/S6AB.mp3) (30.5 s)

> Bibliotekarien hängde upp mosskartan, och sagostunden började. Iris hade ritat med Mossa på gröna mattan. Hon och Amina hade inte fått sin sista ritstund i fönsterljuset. Aminas silverfågel flög över träden, men ingen silvermåne syntes ovanför Mossas stigar.
>
> Iris satte sig på mattan och lämnade en liten plats på den öppna sagobokens kant. Mossa slog sig ner där. Amina satt på andra sidan Iris.
>
> "Du kan välja första stigen i berättelsen", viskade Iris till Mossa.
>
> Han snurrade halsduken och pekade. Amina följde stigen med fingret i luften. Iris lutade sig närmare båda två. Bakom dem blinkade silverfågeln, och på kartan fick natten vara utan måne.

### S6BA

Slot 6 · 103 words · [image](../assets/share/iris-sparade-platsen/assets/S6BA.webp) · [narration](../assets/share/iris-sparade-platsen/assets/S6BA.mp3) (27.7 s)

> Bibliotekarien hängde upp solfågelbilden, och sagostunden började. Iris och Amina hade fått sin sista ritstund i fönsterljuset. Mossa hade inte fått rita med Iris på gröna mattan. Över molnen lyste hans silverstjärna. Mellan Aminas vingar fanns inget silverbo.
>
> Iris gick först till sagomattan. Hon valde en plats nära fönstret och lämnade en liten öppning mellan sig och Amina. Mossa tassade in i den och lutade ryggen mot deras armar.
>
> "Här syns stjärnan ju bäst", sa han.
>
> Amina kupade händerna som ett låtsasbo åt hans svans. Iris log och höll sagoboken öppen. Ovanför dem hoppade silverstjärnan till, precis som när Mossa ritade sista spetsen.

### S6BB

Slot 6 · 105 words · [image](../assets/share/iris-sparade-platsen/assets/S6BB.webp) · [narration](../assets/share/iris-sparade-platsen/assets/S6BB.mp3) (30.7 s)

> Bibliotekarien hängde upp solfågelbilden, och sagostunden började. Iris och Amina hade ritat i fönsterljuset. Den sista ritstunden med Mossa på gröna mattan hade inte blivit av. Aminas silverbo låg mellan vingarna. Över Mossas moln fanns ingen silverstjärna.
>
> Iris satte sig vid kanten av sagomattan. Hon lämnade plats på ena knät och höll det andra intill Amina. Mossa hoppade upp, virade halsduken runt tassarna och såg på bilden.
>
> "Moln behöver väl inte alltid en stjärna", mumlade han. "De kan vaka över ett bo."
>
> Amina knackade lätt mot Iris hand. Iris öppnade sagoboken mellan dem. Bakom deras huvuden puffade silverboet till, och fönsterljuset föll över alla tre.

## 4. Typography of the prose

Counted over all 14 beats: straight double quotes `"` 40 (dialogue, i.e. 20 quoted lines), exclamation marks 0, question marks 2, em/en dashes 0, ellipses 0, semicolons 0. Dialogue is set in straight double quotes followed by an attribution verb ("frågade hon", "sa han"), not in the Swedish typographic ”…” or the dialogue dash. Paragraphs are separated by blank lines in the JSON.
