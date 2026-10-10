# App image-style and prompt strings (verbatim)

Every string in the shipped JavaScript that names an art style, describes how a character should look, or tells the parent what the painting step does. Swedish strings are followed by an English gloss in brackets. Offsets are character indices into the single-line minified chunk (UTF-8 decoded, as a Python `str` index), so `source/js/2j_-r8q4tgdka.js @50494` means "find it at character 50 494 of that file".

The illustration prompt that the server actually sends is not in the client code. The only complete image prompts in the library are the sample book's, in [style-block.txt](style-block.txt), [cover-brief.txt](cover-brief.txt) and [beats/](beats/). This file collects what the client tells us about the image pipeline around those prompts.

## Contents

1. [Art-style presets (create flow)](#1-art-style-presets-create-flow)
2. [Hero look strings (what the portrait prompt is fed)](#2-hero-look-strings)
3. [Starter companions and keepsakes (their "look" strings)](#3-starter-companions-and-keepsakes)
4. [Adventure-card ("door") art and the Surprise door](#4-adventure-card-door-art-and-the-surprise-door)
5. [Painting copy on the landing page](#5-painting-copy-on-the-landing-page)
6. [Painting copy in /start (photo → portrait)](#6-painting-copy-in-start-photo--portrait)
7. [Reader and report strings about images](#7-reader-and-report-strings-about-images)
8. [Image pipeline: endpoints, job flags, providers](#8-image-pipeline-endpoints-job-flags-providers)
9. [Bokmässan kiosk story styles (fetched)](#9-bokmässan-kiosk-story-styles-fetched)
10. [Narrator portraits](#10-narrator-portraits)

---

## 1. Art-style presets (create flow)

Source: `source/js/390j9gbq0u9ce.js`, Turbopack module 67711 (characters 30 758–32 398). A prettier-formatted copy is at [../derived/story/js-excerpts/style-presets.390j9gbq0u9ce.m67711.pretty.js](../derived/story/js-excerpts/style-presets.390j9gbq0u9ce.m67711.pretty.js). Preview images were fetched read-only to [../derived/illustration/fetched/style-previews/](../derived/illustration/fetched/style-previews/). The sheet is [../derived/illustration/contact-sheet__create-style-presets.webp](../derived/illustration/contact-sheet__create-style-presets.webp).

```js
let t = "neon",            // DEFAULT_CREATE_STYLE_ID  (source/js/390j9gbq0u9ce.js @30781)
  r = [
    { id: "watercolor",  labelEn: "Soft Watercolor",            labelSv: "Mjuk akvarell",
      description: "Warm painted scenes like a feature animation",            previewImageUrl: "/style-previews/create/watercolor.jpg" },
    { id: "inkaccent",   labelEn: "New Yorker ink, one accent", labelSv: "New Yorker-tusch, en accent",
      description: "Bold black ink on white, one pop of color",               previewImageUrl: "/style-previews/create/inkaccent.png" },
    { id: "comic",       labelEn: "Comic book",                 labelSv: "Seriestil",
      description: "Punchy inked panels with action energy",                  previewImageUrl: "/style-previews/create/comic.png" },
    { id: "crayon",      labelEn: "Crayon, drawn by a kid",     labelSv: "Kritteckning",
      description: "Wobbly wax-crayon charm, taped to the fridge",            previewImageUrl: "/style-previews/create/crayon.png" },
    { id: "neon",        labelEn: "Glowing magic",              labelSv: "Lysande magi",
      description: "Glowing neon light on any scene",                         previewImageUrl: "/style-previews/create/neon.png" },
    { id: "pixel",       labelEn: "Retro game pixel art",       labelSv: "Retrospel-pixel",
      description: "Chunky 16-bit pixels like a beloved old game",            previewImageUrl: "/style-previews/create/pixel.png" },
    { id: "clay",        labelEn: "Claymation",                 labelSv: "Lera-animation",
      description: "Stop-motion clay characters with fingerprints and seams", previewImageUrl: "/style-previews/create/clay.png" },
    { id: "screenprint", labelEn: "Vintage screen-print",       labelSv: "Vintage screentryck",
      description: "1960s poster colors, bold shapes, print texture",         previewImageUrl: "/style-previews/create/screenprint.png" },
  ];
// getCreateStylePreset(id) returns the matching preset, or the "neon" preset as fallback.
```

(Layout condensed onto fewer lines; every value is verbatim.)

Swedish label glosses: *Mjuk akvarell* [soft watercolour]; *New Yorker-tusch, en accent* [New Yorker India ink, one accent]; *Seriestil* [comic style]; *Kritteckning* [crayon drawing]; *Lysande magi* [glowing magic]; *Retrospel-pixel* [retro-game pixel]; *Lera-animation* [clay animation]; *Vintage screentryck* [vintage screen print].

Observed: all eight previews show the same two children (a girl with puffs, red glasses and a yellow raincoat; a boy with a green-striped jumper and a hearing aid) in eight renderings. They are 400×268 px. Only `watercolor.jpg` is a JPEG; the rest are PNGs.

Read: the default is `neon`, not `watercolor`. The sample book and every marketing image use the watercolour look, but a parent who never opens the style picker would get "Glowing magic". This may be deliberate (a striking first impression) or a leftover. It cannot be confirmed without logging in.

A `styleLabel` field travels with the story recipe (`source/js/390j9gbq0u9ce.js @30019`, in the object `{heroName, portraitUrl, adventureDirection, companion, styleLabel, narratorLabel, carriedEmberThread}`).

## 2. Hero look strings

Source: `source/js/2j_-r8q4tgdka.js`, module 2002 (`@50494`–`@51600`). The export is named `ILLUSTRATED_HERO_LOOK` (`@55499`).

```js
let i = "A brave storybook child hero with warm eyes and tousled hair";   // ILLUSTRATED_HERO_LOOK (en)
d = {
  photo: { sv: "ser ut precis som på sitt målade porträtt", en: "looks just like their painted portrait" },
  look:  { sv: "ett modigt sagobarn med varma ögon och rufsigt hår", en: i },
}
```

- `photo` applies when the parent uploaded a photo. The hero's text description then simply points at the painted portrait, and the portrait image itself becomes the visual reference.
- `look` is the fallback when the parent skips the photo ("Hoppa över, måla en hjälte åt oss" [Skip, paint a hero for us]). Gloss of the sv string: [a brave fairy-tale child with warm eyes and tousled hair].

Compare the sample book, where the hero look is a concrete costume: `"sjuårig flicka med mörka lockar, hallonröd regnjacka och gula stövlar"` [seven-year-old girl with dark curls, raspberry-red raincoat and yellow boots] ([sample-book-image-canon.json](sample-book-image-canon.json) → `canon.hero.look`).

## 3. Starter companions and keepsakes

Source: `source/js/2j_-r8q4tgdka.js` module 2002, `@50559` (companions) and `@51049` (keepsakes). The `/start` flow shows these as ready-made friends, drawn as inline SVG icons (see `derived/story/js-excerpts/start-flow…pretty.js` lines 79–120 and 160+), not as raster art.

```js
l = {
  rufus: { short: "Rufus", look: { sv: "en räv med varm röd päls",   en: "a fox with warm red fur" },
           mannerism: { sv: "viftar på svansen när han tänker", en: "flicks his tail when he is thinking" } },
  luna:  { short: "Luna",  look: { sv: "en uggla med mjuka fjädrar", en: "an owl with soft feathers" },
           mannerism: { sv: "blinkar långsamt", en: "blinks slowly" } },
  bo:    { short: "Bo",    look: { sv: "en liten drake med gröna fjäll", en: "a small dragon with green scales" },
           mannerism: { sv: "blåser små rökringar", en: "blows small smoke rings" } },
},
o = {
  halsduk: { name: { sv: "röd halsduk", en: "red scarf" },   look: { sv: "en mjuk röd halsduk", en: "a soft red scarf" } },
  lykta:   { name: { sv: "gammal lykta", en: "old lantern" }, look: { sv: "en gammal lykta med ett varmt sken", en: "an old lantern with a warm glow" } },
  svard:   { name: { sv: "träsvärd", en: "wooden sword" },   look: { sv: "ett träsvärd med slitna kanter", en: "a wooden sword with worn edges" } },
}
```

Pattern (observed): every entity has a short **look** (one noun phrase: species plus one or two tactile qualities) and a **mannerism** (one small, repeatable gesture). The sample book uses the same two fields: Mossa *"snurrar halsduken ett varv när han tänker"* [twirls his scarf one turn when he thinks]. The illustration briefs then turn the mannerism into a visible pose ("one paw twisting his green scarf", S1).

## 4. Adventure-card ("door") art and the Surprise door

Source: `source/js/2j_-r8q4tgdka.js @17156` (pretty copy: [../derived/story/js-excerpts/doors-recipe-worldband.2j_-r8q4tgdka.m83876.pretty.js](../derived/story/js-excerpts/doors-recipe-worldband.2j_-r8q4tgdka.m83876.pretty.js) lines 152–162).

```js
let d = {
  ember:      ["/cards/generated/lost-lantern-v1.webp"],
  register:   ["/cards/generated/tower-clouds-v1.webp", "/cards/generated/lost-lantern-v1.webp"],
  competency: ["/cards/generated/starry-friendship-v1.webp", "/cards/generated/lost-lantern-v1.webp"],
}
```

The three landing cards are byte-identical to these files. Each pair's MD5 matched, checked by fetching `/cards/generated/*.webp` read-only:

| landing file | = generated card | what it shows (observed) |
|---|---|---|
| [assets/landing/cards/pick-1.webp](../assets/landing/cards/pick-1.webp) | `lost-lantern-v1.webp` | night forest path lit by a trail of golden fireflies or lights; an **empty brass lantern hook** on a tree trunk at left; a cottage with a lit window in the distance |
| [assets/landing/cards/pick-2.webp](../assets/landing/cards/pick-2.webp) | `starry-friendship-v1.webp` | two small figures seen from behind on a blanket in a meadow under a dense starry sky, a lantern glowing between them, a cottage and a glowing path at right |
| [assets/landing/cards/pick-3.webp](../assets/landing/cards/pick-3.webp) | `tower-clouds-v1.webp` | a round stone tower with a red pennant on top of a green hill, a winding path, towering white cumulus, bright daylight |

All three are 800×537 px. On the landing page they fan out in step 3 *"Välj kvällens äventyr"* [Choose tonight's adventure] (`.hiw-fan`, CSS at `source/css/3q17cp_jgfwol.pretty.css:2744-2769`).

Card titles come from `assembleCards()` (pretty copy: [../derived/story/js-excerpts/assemble-cards.2j_-r8q4tgdka.m16335.pretty.js](../derived/story/js-excerpts/assemble-cards.2j_-r8q4tgdka.m16335.pretty.js)). The registers are cozy / adventure / silly / wonder, titled *"Ett mysigt äventyr"* [A cozy adventure], *"Ett stort äventyr"* [A big adventure], *"Ett larvigt äventyr"* [A silly adventure] and *"Ett underbart äventyr"* [A wonder-filled adventure].

**Surprise door** (`@15909`–`@16700`):

```js
l = { sv: { cap: "Överraska", title: "Överraska oss", bodyLead: "Vi väljer äventyr, bildstil och röst utifrån", bodyTail: "ålder.", button: "Överraska oss" },
      en: { cap: "Surprise",  title: "Surprise us",   bodyLead: "We pick the adventure, art style and voice for",  bodyTail: "age.",  button: "Surprise us" } }
// art: <img src="/images/create/surprise-us.webp" alt="" data-testid="surprise-art" onError → fallback "✦">
```

[We pick the adventure, art style and voice based on <hero>'s age.] The art is [assets/images/create/surprise-us.webp](../assets/images/create/surprise-us.webp) (800×537): an ornate golden door standing open in a mossy, flowering hillside at dusk, with a sunlit mountain path visible through it. Read: *bildstil* [art style] is chosen per age, so style is a parameter of the product, not a constant.

## 5. Painting copy on the landing page

Source: `source/js/3d9nxlx1n5pdy.js` module 29416 (pretty copy: [../derived/story/js-excerpts/landing-explainer.3d9nxlx1n5pdy.m29416.pretty.js](../derived/story/js-excerpts/landing-explainer.3d9nxlx1n5pdy.m29416.pretty.js)).

| key | sv (verbatim) | en (verbatim) | offset |
|---|---|---|---|
| steps.hero.body | "Ladda upp en bild och välj det som gör ert barn till ert barn. Vi målar hjälten i bokens stil, och samma ansikte återkommer i varje scen." | "Upload a photo and pick what makes your child your child. We paint the hero in the book's style, and the same face returns in every scene." | @1143 |
| steps.hero.micro | "Porträttet styr både bilderna och berättelsen." | "The portrait shapes both the pictures and the story." | @1226 |
| steps.hero.artChip | "Skapad med AI" | "Created with AI" | @1283 |
| steps.hero.portraitAlt | "Iris, den målade hjälten i exempelboken" | "Iris, the painted hero of the sample book" | @1311 |
| steps.friend.micro | "I Alvas värld är Noah och räven Sixten med i varje bok." | "In Alva's world, Noah and Sixten the fox are in every book." | — |
| steps.friend.rows | `{ name: "Noah", sub: "bästa kompisen · med i 2 böcker" }`, `{ name: "Sixten", sub: "fjällräven · följer med i varje bok" }` | `{ name: "Noah", sub: "best friend · in 2 books" }`, `{ name: "Sixten", sub: "the mountain fox · comes along in every book" }` | — |
| steps.adventure.body | "… Sedan skriver, målar och läser vi in hela boken på en gång. Det tar ungefär tio minuter …" | "… Then we write, paint, and narrate the whole book in one go. It takes about ten minutes …" | — |
| steps.adventure.micro | "Lagom tid för tandborstning och pyjamas." | — | @1930 |
| steps.read.micro | "Inga låtsasval. Båda vägarna är skrivna, målade och inlästa." | "No pretend choices. Both paths are written, painted, and narrated." | @2218 |
| steps.read.sceneAlt | "Uppslag ur exempelboken, sidan före det första valet" | "A spread from the sample book, the page before the first choice" | @2365 |
| steps.endings.mapAlt | "Kartan över exempelboken Iris och den sparade platsen. Varje prick är en sida, varje guldstjärna ett val, varje medaljong ett slut. Alla fyra finns på riktigt." | "The map of the sample book Iris and the Saved Place. Every dot is a page, every gold star a choice, every medallion an ending. All four really exist." | @2737 |
| steps.memory.nextBookLabel | "nästa bok" | "next book" | — |
| hero-fan badge (HTML) | "**Sixten minns tornet** från \"Alva och fyraljuset\"" | "**Sixten remembers the tower** from \"Alva and the Fourth Candle\"" | `source/html/home.sv.html` |
| demo book titles (HTML) | "Alva och fyraljuset i tornet" · *Stora känslor*; "Alva och filten vid elementet" · *Mysigt äventyr* | "Alva and the Fourth Candle in the Tower" · *Big feelings*; "Alva and the Blanket by the Radiator" · *Cozy adventure* | `source/html/home.*.html` |

Gloss of sv-only line: *"Lagom tid för tandborstning och pyjamas."* [Just enough time for brushing teeth and pyjamas.]

Image paths referenced by this module: `/landing/iris/hero-portrait.webp`, `/landing/iris/scene-choice.webp`, `/landing/iris/cover-thumb.webp`, `/landing/iris/ending-1..4.webp` (mapped `AA, AB, BA, BB`), `/landing/cards/pick-1..3.webp` (`@6811`), `/assets/avatar-noah.jpg`, `/assets/avatar-sixten.jpg`, `/landing/voice/narrator-morfar.webp`, `/landing/cover-next-book.webp`, `/assets/cover-tornet.webp`, `/assets/cover-filten.webp`.

## 6. Painting copy in /start (photo → portrait)

Source: `source/js/0ad0wel9cyv30.js` (pretty copy: [../derived/story/js-excerpts/start-flow.0ad0wel9cyv30.m9181.pretty.js](../derived/story/js-excerpts/start-flow.0ad0wel9cyv30.m9181.pretty.js)). The painting metaphor runs all the way through:

| sv (verbatim) | en (verbatim) | offset |
|---|---|---|
| "Tale Forge skriver, målar och läser in en riktig bilderbok där ert barn är huvudpersonen. Porträttet ser ni om ett par minuter, den första boken är gratis." | "Tale Forge writes, paints and narrates a real picture book where your child is the main character. You see the portrait in a couple of minutes, and the first book is free." | @303 |
| "Ansiktet räcker, resten målar vi." | "The face is enough, we paint the rest." | @8472 |
| "Fotot används bara för att måla porträttet. Det tränar aldrig någon AI, och ni kan radera det när som helst." | "The photo is only used to paint the portrait. It never trains any AI, and you can delete it whenever you like." | @8516 |
| "Porträttet har börjat målas" | "The portrait has started painting" | @8637 |
| "Hoppa över, måla en hjälte åt oss" | "Skip, paint a hero for us" | @8686 |
| "Färgen torkar på porträttet" | "The paint is drying on the portrait" | @3041 |
| "Avtäck" / "Målar..." / "Måla igen" | "Unveil" / "Painting..." / "Paint again" | ~@11200 |
| "Er hjälte väntar bakom duken." | "Your hero is waiting behind the veil." | ~@11400 |
| "Porträttet målas..." | "The portrait is being painted..." | @11478 |
| "Färgen ville inte fastna den här gången." / "Allt ni byggt är kvar. Vi provar igen." | "The colour would not settle this time." / "Everything you built is safe. Let us try again." | @11303 |
| "Steg 2 av 4 · Fotot" / "Ett foto räcker för porträttet, och det går bra att hoppa över." / "Porträttet målas i bakgrunden medan ni väljer." | "Step 2 of 4 · The photo" / "One photo is enough for the portrait, and skipping is fine." / "The portrait is painted in the background while you choose." | — |

Note that *duken* means both "the canvas" and "the cloth" in Swedish, so the sv line plays on a painter's canvas being unveiled. The en "veil" keeps only the cloth sense. Accepted upload types: `image/png,image/jpeg,image/webp,image/heic`; the limit is 6 MB ("Välj ett som är mindre än 6MB"). The client normalises uploads to PNG (`normalizeImageToPng`).

## 7. Reader and report strings about images

Source: `source/js/36tbz-w9v-p8v.js`.

- Cover screen: `madeWithAi: "Skapad med AI."` / `"Made with AI."` (@430). `coverArtAlt: e => \`Omslagsbild till ${e}\`` / `` `Cover illustration for ${e}` `` (@317).
- Page view: `viewIllustration: "Visa bara bilden"` [Show only the picture] / `"View illustration"` (@21440). `backToStory: "Tillbaka till sagan"` / `"Back to story"`. `pictureAlt: "Sagans illustration"` / `"Story illustration"` (@21504).
- Every picture is rendered twice. An `art-bg` copy is blurred behind an `art-main` copy shown with `contain` (@897; CSS at `source/css/3q17cp_jgfwol.pretty.css:1784-1800`).
- A developer overlay string shows which models made each page (@2383): `` `DEV: image with ${n.image.join(" + ")}, narration with ${n.narration.join(" + ")}, outline with ${n.outline.join(" + ")}, story with ${n.story.join(" + ")}` ``
- Feedback tags (@8099): `{tag:"image_issue", en:"Issue with an image", sv:"Problem med en bild"}`.

## 8. Image pipeline: endpoints, job flags, providers

- Portrait endpoints (`source/js/2j_-r8q4tgdka.js @54495`–`@55400`): `POST /create/portrait` with `{characterId, photoBase64, contentType:"image/png"}`, `POST /create/portrait/{work_item_id}/accept` and `POST /create/portrait/paint` with `{characterId}` (no photo: "paint a hero for us"). Draft: `/start/portrait-draft` (`source/js/0ad0wel9cyv30.js @10544`).
- Polling (`source/js/2x2s34sgoij7z.js @4880`): `GET /jobs/portrait/{work_item_id}/ready` every 2 500 ms (`intervalMs??2500`), giving up after 4 failures. It returns `{ready, portraitUrl, canRepaint}`.
- Book job progress (`source/js/2j_-r8q4tgdka.js @3521`): `GET /jobs/story/{story_id}/progress`. The flags are `outlineFailed, storyFailed, portraitsFailed, coverFailed, criticalPathFailed`, and the book opens when `storyReady && coverReady && criticalPathReady`. Read: the order is outline → story text → character portraits → cover → the "critical path" pages. The other branches can finish later.
- Providers recorded in the sample book ([sample-book-image-canon.json](sample-book-image-canon.json)): cover and both character portraits are `azure-images:gpt-image-2`, and the cover took `meta.ms: 57340` (57.3 s). All 14 beat images say `provider: "existing"`. Narration is `vertex-gemini-tts:gemini-3.1-flash-tts-preview:Enceladus`, normalised `ffmpeg-loudnorm:-23LUFS:-2dBTP:11LRA`.
- Character reference portraits are listed at `/share/iris-sparade-platsen/assets/refs/hero.png` and `…/refs/companion.png`. Both returned **404** on a read-only GET (2026-10-10), so they are not public.

## 9. Bokmässan kiosk story styles (fetched)

A separate route family `/bokmassan/saga/berattelser/<slug>` (a book-fair kiosk) ships nine pre-made stories. Each carries a visible style label. The data was decoded read-only from the RSC payload into [../derived/illustration/fetched/bokmassan/stories-image-meta.json](../derived/illustration/fetched/bokmassan/stories-image-meta.json), and all 42 page images are in [../derived/illustration/fetched/bokmassan/](../derived/illustration/fetched/bokmassan/). The sheet is [../derived/illustration/contact-sheet__bokmassan-stories.webp](../derived/illustration/contact-sheet__bokmassan-stories.webp).

| slug | title (verbatim) | style label (verbatim) [gloss] | aspect |
|---|---|---|---|
| boken-som-foljde-med | Valen som bar små berättelser | Lysande gouache och papperskonst [luminous gouache and paper art] | 3 / 2 |
| den-forsvunna-bokstaven | Den försvunna bokstaven | Lysande glasmosaik [luminous stained-glass mosaic] | 16 / 9 |
| den-tysta-platsen | Den tysta platsen | Pappersteater [paper theatre] | 3 / 2 |
| drakens-felknut | Drakens felknut | Leranimering [clay animation] | 3 / 2 |
| glasspinnens-stora-rymning | Glasspinnens stora rymning | Färgstarkt bläck [vivid ink] | 3 / 2 |
| nar-mattan-blev-hav | När mattan blev hav | Nordiskt träsnitt [Nordic woodcut] | 16 / 9 |
| nattaget-fran-bla-mattan | Nattåget från blå mattan | Lekfull leranimation [playful clay animation] | 16 / 9 |
| ravens-nya-hem | Rävens nya hem | Mjuk filtillustration [soft felt illustration] | 16 / 9 |
| stjarnan-som-inte-vagade-lysa | Stjärnan som inte vågade lysa | Filmisk gouache [cinematic gouache] | 3 / 2 |

Each page also has a verbatim Swedish `alt` text that works as a de-facto shot description. Example (opening of *Valen som bar små berättelser*): *"Nilo och hans morfar ser en väldig pappersval vecklas ut ur en bok i en blå bokmässemonter; i valens kropp lyser ett litet hav av stjärnor och båtar."* [Nilo and his grandfather watch a huge paper whale unfold out of a book in a blue book-fair booth; inside the whale's body a little sea of stars and boats glows.] The opening pages also carry a `clue` hotspot `{x, y, label, description}` in percent of the image.

## 10. Narrator portraits

Source: `source/js/390j9gbq0u9ce.js` module 99026, `@32700` and following. Images were fetched by the brand agent to [../derived/brand/narrators/](../derived/brand/narrators/).

| id | name sv / en | portraitUrl |
|---|---|---|
| grandpa (default) | Morfar Erik / Grandpa Erik (landing chip "Morfar" / "Grandpa Erik") | `/voices/portrait-grandpa.jpg` (the same picture as [assets/landing/voice/narrator-morfar.webp](../assets/landing/voice/narrator-morfar.webp): a 400×400 JPEG against a 256×256 WebP. Mean absolute difference is 2.3/255 when both are resized to 200 px.) |
| female | Berättaren Lily / Storyteller Lily | `/voices/portrait-female.jpg` |
| male | Berättaren Marcus / Narrator Marcus | `/voices/portrait-male.jpg` |
| young | Unga Saga / Young Saga | `/voices/portrait-young.jpg` |

All four are vignettes painted in loose watercolour on white, with no background. Paper-white pixels make up 37–51 % of each image ([../derived/illustration/image-metrics.json](../derived/illustration/image-metrics.json) → `share_paper_white_L>90_C<12`, 0.366–0.506).
