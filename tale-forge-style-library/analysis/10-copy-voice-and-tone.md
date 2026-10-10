# 10 · Copy, voice and tone

Tale Forge writes like a calm parent talking to another family at bedtime. Swedish is the source language. Sentences are short and plain, with no exclamation marks, and the copy says straight out how long things take and what can go wrong.
The product is described as craft (paint, forge, bake, a recipe, an editor), and AI shows up as a small label rather than a selling point. One promise runs through everything: the world remembers (*minns*).
This file describes the voice with quoted evidence and measured numbers. The literal material sits in [../copy/](../copy/): page-by-page copy decks in both languages, every JS dictionary (75 tables, 522 keys), a glossary, the sample book's text and the metrics behind every count quoted here.
Swedish quotes are verbatim, with an English gloss in [brackets] where the site's own English differs or is missing. Judgement is marked **Read:**.

## Contents

1. [The copy material in this library](#1-the-copy-material-in-this-library)
2. [The voice on one card](#2-the-voice-on-one-card)
3. [Voice principles with evidence](#3-voice-principles-with-evidence)
4. [Sentence length and rhythm](#4-sentence-length-and-rhythm)
5. [Headline formulas](#5-headline-formulas)
6. [CTA vocabulary](#6-cta-vocabulary)
7. [Price and free-trial phrasing](#7-price-and-free-trial-phrasing)
8. [How AI is mentioned](#8-how-ai-is-mentioned)
9. [Punctuation, case and numerals](#9-punctuation-case-and-numerals)
10. [Swedish and English side by side](#10-swedish-and-english-side-by-side)
11. [Character and title naming](#11-character-and-title-naming)
12. [Microcopy formulas](#12-microcopy-formulas)
13. [Long-form voice: the legal pages](#13-long-form-voice-the-legal-pages)
14. [Reproducing the voice](#14-reproducing-the-voice)
15. [Uncertainties and gaps](#15-uncertainties-and-gaps)

---

## 1. The copy material in this library

| Path | What it holds |
|---|---|
| [../copy/pages/](../copy/pages/) | 17 copy decks, one per page and language: `home`, `start`, `uppgradera`, `login`, `signup`, `integritet`, `villkor`, `404` × `sv`/`en`, plus [share_iris-sparade-platsen.404.md](../copy/pages/share_iris-sparade-platsen.404.md). Each deck has the head and share metadata (title, description, OG/Twitter), then every visible and assistive string (alt, aria-label, placeholder) in reading order, then client-side states and a server-HTML vs hydrated-DOM diff. The legal pages are reproduced in full. |
| [../copy/states/](../copy/states/) | 14 WebP screenshots (1440×900, natt) of the client states listed in the decks: start s0 gallery, s1, s1 moderation message, s2, pricing monthly + schools, login recovery, the share-route 404, each in sv and en. |
| [../copy/app-strings.md](../copy/app-strings.md) | All 75 sv/en dictionaries found in the client JS, as Svenska / English tables in product order (landing explainer, nav, create flow, doors, options, waiting fire, next-book cards, reader, sound, auth, moderation, pricing), each with chunk file, offset and module exports. |
| [../copy/i18n-strings.json](../copy/i18n-strings.json) | Machine-readable version: `areas.<area>.entries.<name>` = `{source, note, value}`, plus `serverRenderedPages.<page>` = sv/en pairs of every server-rendered string and the meta tags. |
| [../copy/glossary.md](../copy/glossary.md) | Product vocabulary sv ⇄ en, with frequency, usage, names and translation choices. |
| [../copy/copy-metrics.json](../copy/copy-metrics.json) | Every number in sections 4, 9 and 10: sentence-length statistics per corpus, a punctuation census, address-form counts, numerals, AI mentions, headline endings, term frequencies. |
| [../copy/sample-book-text.sv.md](../copy/sample-book-text.sv.md) | Full text of the sample book "Iris och den sparade platsen" (14 beats, 1,514 words), the branch tree, choice prompts and links to each spread and narration file. |
| [../copy/sample-book/](../copy/sample-book/README.md) | Not written by this dimension: per-path reading copies of the sample book (paths AA, AB, BA, BB) with English glosses, plus the verbatim briefs and canon. |

**Method.** Page copy comes from the hydrated DOMs `source/rendered/dom__<page>__<lang>.html`, checked against the server HTML `source/html/<page>.<lang>.html`. App copy comes from parsing the Turbopack chunks in `source/js/` with acorn; nothing was executed. The sv and en DOMs line up record for record, so every page string has an exact translation pair. For the metrics, "non-legal" means the marketing pages, auth pages, 404, nav/footer and all JS dictionaries, with identical pairs counted once (588 items). Logged-in screens (bookshelf, account) and emails could not be seen. The strings those screens share with the client bundle (reader, waiting fire, next-book cards) are covered via the dictionaries; anything rendered only on the server behind login is not.

Words per page from the decks: home 576 sv / 621 en; start 88 / 94; uppgradera 138 / 136; login 57 / 55; signup 91 / 98; 404 49 / 49; integritet 1,771 (both languages are on the page); villkor 1,333 / 1,334.

---

## 2. The voice on one card

| Principle | Swedish evidence | The site's English |
|---|---|---|
| Says how long it takes, and what it cannot do | "Det tar ungefär tio minuter, och det säger vi hellre ärligt än låtsas att det går på en sekund." | "It takes about ten minutes, and we would rather say that honestly than pretend it takes a second." |
| Choices are real | "Inga låtsasval. Båda vägarna är skrivna, målade och inlästa." | "No pretend choices. Both paths are written, painted, and narrated." |
| Talks to the family: *ni / er* (plural you) | "Skapa er hjälte" · "Ni börjar med barnet. Inget kort behövs." | "Create your hero" · "You start with your child. No card needed." |
| Lives in the evening ritual | "Lagom tid för tandborstning och pyjamas." | "Just enough time for toothbrushing and pajamas." |
| Craft words, not tech words | "Vi målar hjälten i bokens stil" · "{names} allra första bok smids nu" | "We paint the hero in the book's style" · "{names} very first book is being made" |
| The world remembers | "En värld som minns henne." · "Världen minns" | "A world that remembers her." · "The world remembers" |
| Reassure: nothing is lost | "Boken lägger sig i bokhyllan när den är klar." (12 times) · "Allt ni byggt är kvar." | "The book lands on the bookshelf when it is ready." · "Everything you built is safe." |
| Calm, never loud | 0 exclamation marks in all Swedish copy, legal text and the sample book | 6, all in one English moderation message family: "Let's keep our stories kind and safe!" |

Sources: [../copy/app-strings.md#explainer](../copy/app-strings.md#explainer), [#s1reassurance](../copy/app-strings.md#s1reassurance), [#s6launch](../copy/app-strings.md#s6launch), [#job_status_copy](../copy/app-strings.md#job_status_copy), [#moderationmessages](../copy/app-strings.md#moderationmessages); counts in [../copy/copy-metrics.json](../copy/copy-metrics.json).

---

## 3. Voice principles with evidence

### 3.1 Radical honesty about time, process and limits

Observed. The site states its limits where most product copy would hide them, and often turns the limit into a benefit in the next sentence:

- Landing, step 3: "Välj tema och känsla. Sedan skriver, målar och läser vi in hela boken på en gång. Det tar ungefär tio minuter, och det säger vi hellre ärligt än låtsas att det går på en sekund." The micro line under it: "Lagom tid för tandborstning och pyjamas." The demo progress bar reads "Boken bakas. Ungefär tio minuter kvar." [The book is baking. About ten minutes to go.] ([../copy/pages/home.sv.md](../copy/pages/home.sv.md), `explainer.steps.adventure`)
- Landing, step 4: "Två gånger i varje bok stannar berättelsen: ert barn väljer, och valet ändrar det som händer sedan. På riktigt." Micro: "Inga låtsasval. Båda vägarna är skrivna, målade och inlästa." The endings caption: "Varje prick är en sida, varje guldstjärna ett val, varje medaljong ett slut. Alla fyra finns på riktigt." [All four really exist.]
- Rewrites are admitted: "Vår redaktör skickade tillbaka utkastet, så berättaren skriver ett nytt. Bra böcker behöver en omskrivning ibland." [Our editor sent the draft back, so the storyteller is writing a fresh one. Good books take a rewrite or two.] (`JOB_STATUS_COPY.rewriting`)
- Capacity is admitted: "Smedjan är tom just nu" / "Er saga står kvar och är sparad. Ingen annan familj står före er; smedjan är bara tom för stunden." [The smithy is empty right now … No other family is ahead of you; the workshop is simply empty for the moment.] (`GLOD_COPY.forgeUnavailable`)
- Photo use is limited in writing: "Fotot används bara för att måla porträttet. Det tränar aldrig någon AI, och ni kan radera det när som helst." (`s2Photo.privacy`)
- The card requirement is said plainly: "14 dagar gratis, avsluta när du vill. Kort krävs." ([../copy/pages/uppgradera.sv.md](../copy/pages/uppgradera.sv.md))
- The legal pages admit present weaknesses. "Vi gör vårt bästa, men vi kan inte lova att tjänsten aldrig ligger nere eller att varje bok blir perfekt." "Böckernas bilder och ljud ligger i dag på webbadresser som kan öppnas utan inloggning … Tills det är klart: dela bara boklänkar med personer ni litar på." [Until that is finished, only share book links with people you trust.] "Berättelserna och bilderna skapas med AI, och ibland blir något konstigt eller fel." ([../copy/pages/villkor.sv.md](../copy/pages/villkor.sv.md), [../copy/pages/integritet.sv.md](../copy/pages/integritet.sv.md))

The wait is stated in four different ways: "ungefär tio minuter" (landing), "några minuter" (`WAIT_PHRASE`, the only duration the app itself uses), "Porträttet ser ni om ett par minuter" (/start pitch) and "en inloggningslänk i inkorgen om en minut" (login link).

**Read:** honesty is used to build trust. Each admitted limit comes with a human frame (bedtime, an editor, a smith who is away), so the limit sounds like care rather than failure. The app's "några minuter" [a few minutes] is vaguer than the landing page's "ungefär tio minuter"; the landing page makes the bolder, more specific promise.

### 3.2 Parent-to-parent plural address: *ni / er*

Observed (Swedish second-person forms, non-legal, from `svAddressForms` in [../copy/copy-metrics.json](../copy/copy-metrics.json)):

| Form | App strings | Marketing pages | Auth pages | Legal |
|---|---|---|---|---|
| *ni / er / ert / era* (plural) | 63 | 15 | 3 | 63 |
| *du / dig / din / ditt / dina* (singular) | 33 | 6 | 2 | 0 |

The plural is the default: "Skapa er hjälte", "Ni börjar med barnet.", "ert barn väljer, och valet ändrar det som händer sedan", "Er kväll kan sluta på ett sätt …", "Ni fyller inte en hylla med lösa sagor. Ni bygger en värld."

The singular appears in five places, all of them about one adult acting alone or about the child:
1. **Account mechanics**: "Har du inget konto?", "Har du redan ett konto?", "Bekräfta din e-postadress först.", "Du har redan ett konto med den här adressen. Du behöver inte minnas lösenordet, vi mejlar dig en länk …"
2. **Pricing**: "Ingen bindningstid, avsluta när du vill.", "Din nuvarande plan".
3. **Grown-up feedback** after a book: "Till dig som vuxen" [For grown-ups], "Tack för att du berättade."
4. **Job-status headings**: "Din saga växer fram", "Din saga står i kö" (while the body lines of the same screens use *er*: "Er saga väntar på att börja").
5. **The demo hero card, spoken to the child**: "Din hjälte", "Bli din egen hjälte", "Ladda upp en bild, så målar vi dig i bokens stil."

The meta description on every page is singular: "Riktiga bilderböcker, skapade för ditt barn."

**Read:** *ni* treats the household as the customer: two parents, or a parent and a child, reading together. The copy switches to *du* exactly where one person signs, pays or gives feedback. English "you" cannot show this, so the English site loses a layer of warmth. "your child" covers both *ert barn* and *ditt barn*.

### 3.3 The bedtime ritual

Observed. The product is placed in the evening, around reading aloud:

- Time words: *kväll / ikväll / kvällens* occur 14 times in Swedish, *tonight / evening* 15 times in English. "Ikväll är hjälten ert barn." (/start h1), "Välj kvällens äventyr", "Så här går en kväll till." [Here is how an evening works.], "För kvällar när modet vill växa." [For evenings when courage wants to grow.]
- Routine: "Lagom tid för tandborstning och pyjamas." The first door is titled "Den försvunna lyktan", with the invitation "En godnattsaga där kvällens ljus behöver hittas igen." [A bedtime story where tonight's light needs finding again.] One of the three door registers is "Godnatt" [Bedtime].
- The narrator is a grandfather: "Morfar Erik", described as "En varm, vis berättare med en mysig godnattstämma" [a cozy bedtime voice], the default voice.
- The themes are named for the times of day around sleep, "Natt" and "Morgon" (Night, Morning), never "mörkt/ljust" (dark/light).
- Ambient beds are bedroom sounds: Brasa, Fönsterregn, Sagoskogen, Speldosa, Månharpa, Glödljus (Fireplace, Window rain, Enchanted forest, Music box, Moonlit harp, Ember glow).
- The hand-over screen (assembled from parts plus the child's name): h1 "Lämna över till {namn}." Lede: "Härifrån är boken {namns}: stora bilder, berättarrösten, och ingenting {namn} måste läsa själv." [From here the book is {name}'s: big pictures, the storyteller's voice, and nothing {name} has to read alone.] The button is "Öppna boken tillsammans" [Open the book together]. This sentence is assembled in `source/js/0ad0wel9cyv30.js` around offset 47,700.

**Read:** the copy sells the evening, not the software. Each feature is described by its place in the routine (choosing tonight's adventure, waiting while teeth are brushed, handing over the tablet, reading together).

### 3.4 Craft metaphors; AI as a label

Observed. Generation is never called generation in the UI. The stem "generer-" does not occur anywhere in the JS bundle; the word family appears only in the legal pages (Swedish "porträttgenerering" in the privacy notice, English "generated with AI"). Instead there are four families of craft words (counts from `termCountsNonLegal`):

| Metaphor | Swedish words (count) | Where |
|---|---|---|
| Painter | måla / målas / målade (23), porträtt (12), "Färgen torkar på porträttet", "Er hjälte väntar bakom duken", "Avtäck" | portrait, illustrations, reader ("Bilden målas fortfarande.") |
| Smithy (the brand name) | smida / smids / smed / smedjan / sagosmedjan (16), eld (8), glöd / gnista (10), "väntelden" | the waiting screen, launch ("Redo att tända glöden?" / "Sätt igång") |
| Kitchen | "Boken bakas.", "Bokens recept" | landing demo, recipe line |
| Publishing house | "Vår redaktör skickade tillbaka utkastet", "omskrivning" | job status |

AI is named in four non-legal strings, as a label rather than a pitch; see section 8.

**Read:** the forge in "Tale Forge" is carried through the Swedish app copy consistently (*smedja, smida, smed, glöd, gnista, eld*). The English is weaker here: headings render "smids" as "is being made". For a film, the smithy/ember vocabulary is the richest source of visual metaphor the brand already owns in words.

### 3.5 The world remembers

Observed. *minns* occurs 13 times in Swedish (*remember\** 12 in English): "En värld som minns henne." (home h1), "senare böcker minns äventyren ni redan har delat", "Världen minns" (step 6), "Sixten minns tornet" (badge), "Världen minns:" (world band), "Fånga en gnista som minns en stund ur era böcker" (waiting fire), footer "Tale Forge, sagor som minns er värld." [storybooks that remember your world.] The step-6 body sets it as an antithesis: "Ni fyller inte en hylla med lösa sagor. Ni bygger en värld."

### 3.6 The reassurance refrain

Observed. Whenever the user might worry (waiting, closing the tab, an error), the copy repeats a fixed phrase:

- "… lägger sig i bokhyllan när den är klar" / "… lands on the bookshelf when it is ready": 12 occurrences.
- "Allt ni (just) byggt …" [Everything you (just) built …]: 4. "Allt ni byggt är kvar." "Något gick fel när hjälten skulle sparas. Allt ni byggt finns kvar, försök igen." "Er plan har inte plats för fler böcker just nu. Allt ni byggt är kvar."
- "kvar" [still there] 10 in all, for example "Den här sidan blev inte klar. Resten av boken är kvar."
- Permission to leave: "ni kan stänga sidan" [you can close the page], in the launch sheet, the queue body and the waiting fire.

### 3.7 Calm safety

Observed. Moderation starts every message with the same calm sentence and then gives one concrete instruction: "Vi håller sagorna snälla och trygga. Ta inte med e-postadresser." (and the same with telefonnummer, adresser, personnummer, "Prova gärna andra ord.", "Skriv gärna med vanlig text."). Screenshot: [../copy/states/start-s1-moderation-email__sv.webp](../copy/states/start-s1-moderation-email__sv.webp). Errors never blame the user: "Vi kunde inte läsa det fotot. Prova en JPEG eller PNG bild."

---

## 4. Sentence length and rhythm

Measured over [../copy/i18n-strings.json](../copy/i18n-strings.json) by `sentenceLength` in [../copy/copy-metrics.json](../copy/copy-metrics.json). Sentences are split after . ! ? … when followed by a capital; words are runs of letters and digits.

| Corpus | Sentences sv / en | Mean words per sentence, sv | Mean, en | Median sv / en | Max sv / en | Share of sentences ≤ 8 words, sv / en |
|---|---|---|---|---|---|---|
| Marketing headlines (h1–h3 on home, /start, pricing) | 14 / 14 | **2.9** | 3.0 | 3 / 3 | 5 / 6 | 100% / 100% |
| Marketing body (ledes, step copy, micro, pricing lines) | 56 / 56 | **8.4** | 8.8 | 7 / 8 | 19 / 18 | 66% / 54% |
| App headings (flow, waiting fire, cards) | 42 / 42 | 3.4 | 4.0 | 3 / 3 | 7 / 7 | 100% / 100% |
| App body (all JS sentences of 6+ words) | 206 / 206 | **8.1** | 8.8 | 7 / 8 | 23 / 26 | 62% / 58% |
| Auth pages | 15 / 15 | 4.1 | 4.6 | 2 / 2 | 15 / 16 | 80% / 80% |
| Legal body (main-language half) | 107 / 105 | **13.0** | 14.9 | 12 / 14 | 27 / 34 | 26% / 21% |
| Everything non-legal | 625 / 626 | 5.0 | 5.6 | 4 / 4 | 23 / 26 | 84% / 81% |
| Sample book prose (for comparison) | 171 | 8.9 | — | — | 20 | — |

The sample book figure is from [../copy/sample-book-text.sv.md](../copy/sample-book-text.sv.md). English runs about 5% longer than Swedish by characters (median en/sv ratio 1.05; 10th to 90th percentile 0.89 to 1.22 over 264 non-legal pairs).

Rhythm patterns (observed):

- **Two-sentence lede: a short claim, then a longer one.** "Den målade hjälten återvänder. (4 words) Valen förändrar vad som händer, och senare böcker minns äventyren ni redan har delat. (14)"
- **A fragment as the closing beat.** "… och valet ändrar det som händer sedan. **På riktigt.**" · "**Kort krävs.**" · "**Inget kort behövs.**" · "**Inga låtsasval.**"
- **The making triad**, 5 times: "skriver, målar och läser in" (/start pitch, landing step 3, launch sheet "bok skrivs, målas och läses in", waiting screen "Jag skriver, målar och övar på att säga {namn} precis rätt.", step 4 "skrivna, målade och inlästa"). English: "writes, paints and narrates".
- **Colon reveal.** "Två gånger i varje bok stannar berättelsen: ert barn väljer …" · "Samma hjälte, ny stämning: väljer ni det här blir nästa bok stilla och trygg." · "Sparat: nästa gång ni skapar en bok är det här minnet det första valet ni ser."
- **Antithesis in two short sentences.** "Ni fyller inte en hylla med lösa sagor. Ni bygger en värld."
- **The stack on each hero**: kicker chip → h1 (one sentence) → serif lede (two sentences) → primary CTA → one-line microcopy → ghost CTA. Screenshot: [../screenshots/home-sections/sv__natt__desktop/02_header.hero.png](../screenshots/home-sections/sv__natt__desktop/02_header.hero.png).

**Read:** most sentences are 7 to 8 words, short enough to read aloud in one breath. Read-aloud is the product, so this is consistent. Headlines are three words.

---

## 5. Headline formulas

### 5.1 Display headline: one declarative sentence, a full stop, the child in colour

| Page | Swedish | English | Emphasised span |
|---|---|---|---|
| Home h1 | En värld som **minns henne**. | A world that **remembers her**. | `span.grad` "minns henne" |
| /start h1 (s0) | Ikväll är hjälten **ert barn**. | Tonight the hero is **your child**. | `span.grad` = `s0Pitch.h1Grad` |
| /start hand-over (s8) | Lämna över till **{namn}**. | Hand it over to **{name}**. | `span.grad` = the child's name |
| Home h2 (explainer) | Äventyr värda att prata om. | Adventures worth talking about. | none |

Observed rules:
- 4 to 5 words, ending with a full stop. All three h1s and the explainer h2 end with ".".
- The emphasised phrase is always the **last words before the full stop**, and it always refers to the child: *henne*, *ert barn*, the child's name. The full stop sits outside the span, so it keeps the headline colour (see the crop above, where the gold stops before the ".").
- The emphasis is a **solid colour, not a gradient**, despite the class name `grad`. CSS: `h1 .grad { color: var(--accent-ink); transition: color 0.5s; }` ([../source/css/3q17cp_jgfwol.pretty.css:867-870](../source/css/3q17cp_jgfwol.pretty.css)). `--accent-ink` is `var(--gold-soft)` = `#f5c542` in natt (`body[data-theme="natt"]` opens at line 493, `--accent-ink` at line 497, `--gold-soft` defined at line 464) and `#5b3fc7` violet in morgon (block opens at line 542, `--accent-ink` at line 546). No stylesheet in `source/css/` uses `background-clip: text`.
- h1 typography: `font-family: var(--display)` (Lora), `font-size: clamp(2.7rem, 5.4vw, 4.4rem)`, `font-weight: 700`, `line-height: 1.06`, `letter-spacing: -0.015em`, `text-wrap: balance` ([3q17cp_jgfwol.pretty.css:855-866](../source/css/3q17cp_jgfwol.pretty.css)).

### 5.2 Section and step headings: no full stop

- Explainer steps (h3), imperative or a noun phrase: "Bygg er hjälte", "Ta med en vän", "Välj kvällens äventyr", "Läs och välj", "Fyra olika slut", "Världen minns".
- Section h2: "Din hjälte", "Bokhyllan". Page titles: "Uppgradera", "Logga in", "Skapa konto", "Sidan finns inte".
- Flow headings are **questions**: "Vem blir hjälten?", "Något kärt att ta med?", "Vem följer med?", "Redo att tända glöden?".
- Name-built flow headings end with a full stop: "Gör {namn} till hjälten.", "Spara {namns} hjälte och börja den första boken.", "{Namns} saga växer fram." (assembled in `source/js/0ad0wel9cyv30.js`, see [../copy/app-strings.md#s2photo](../copy/app-strings.md#s2photo), [#s5account](../copy/app-strings.md#s5account), [#s7forging](../copy/app-strings.md#s7forging)).
- Step header formula: "Steg {n} av 4 · {Noun with article}", for example "Steg 1 av 4 · Hjälten", "Steg 3 av 4 · Sällskapet".

Count over 59 heading strings (`headlineEndings`): 51 have no end mark, 4 end with "?", 3 with ".", 1 with "..." ("Nästa gång, kanske..." [Next time, maybe...]).

### 5.3 Kickers (eyebrows)

Two kinds. The hero kicker is a sentence-case pill with an icon: "Exempel: Alvas värld · 2 böcker", "Riktiga bilderböcker, upplästa på svenska" (`.kicker`, 0.85rem/700, [3q17cp_jgfwol.pretty.css:835-850](../source/css/3q17cp_jgfwol.pretty.css)). The section kicker is uppercase through CSS: "Så fungerar det" is displayed as SÅ FUNGERAR DET (`.hiw-kicker`, `text-transform: uppercase`, `letter-spacing: 2px`, 0.82rem/700, [3q17cp_jgfwol.pretty.css:2541-2553](../source/css/3q17cp_jgfwol.pretty.css)).

---

## 6. CTA vocabulary

Observed: every button is an imperative verb plus an object, 1 to 4 words, and the primary CTA carries the family possessive *er* / *your*. The verbs "Köp", "Kom igång" and "Registrera" do not occur (nor "Buy", "Get started", "Sign up").

| Role | Swedish | English | Where |
|---|---|---|---|
| Main conversion | **Skapa er hjälte** | Create your hero | home hero, home closing, /start s0 |
| Reader end screen | Skapa er egen hjälte | Create your own hero | `endingCeremony.createHero` |
| Learn more | Se hur det funkar · Så funkar det | See how it works · How it works | home hero (ghost), reader end |
| Sample | Läs exempelboken · Läs en exempelbok först · Öppna exempelboken | Read the sample book · Read a sample book first · Open the sample book (/start: "Read the Swedish sample") | home, /start, pricing |
| Advance | Vidare | Next | flow steps |
| Skip | Hoppa över, måla en hjälte åt oss | Skip, paint a hero for us | photo step |
| Commit to generation | **Sätt igång** (sheet: "Redo att tända glöden?") | Light it ("Ready to light the ember?") | launch sheet |
| Decline / later | Inte än | Not yet | launch sheet, grown-up vote |
| Portrait | Avtäck · Spara hjälten · Ändra namnet · Måla igen | Unveil · Save the hero · Change the name · Paint again | unveil screen |
| Hand-over | Öppna boken tillsammans · Öppna boken | Open the book together · Open the book | s8, waiting-fire finale |
| Doors | Välj den här · Överraska oss · + ta med en vän | Pick this one · Surprise us · + bring a friend | door grid, recipe |
| Memory | Spara till nästa saga · Fånga en gnista · Minns igen | Save for the next book · Catch a spark · Revisit | waiting fire |
| Reader | Läs sagan · Lyssna-läge · Nästa sida · Läs igen · Nästa äventyr · Till bokhyllan | Read the story · Listen mode · Next page · Read again · Next adventure · To the bookshelf | reader |
| Failure recovery | Välj ett nytt äventyr · Kontrollera igen · Tillbaka till skapandet | Choose a new adventure · Check again · Back to creating | waiting fire, s7 |
| Pricing | Prova gratis i 14 dagar · Uppgradera till Skola · Se planer | Try free for 14 days · Upgrade to School · See plans | pricing, cap error |
| Auth | Fortsätt med Google · Logga in · Skapa konto · Skicka återställningslänk · Mejla mig en inloggningslänk | Continue with Google · Log in · Create account · Send reset link · Email me a login link | login, signup, s5 |
| 404 | Till startsidan | Back to start | 404 |

Loading labels repeat the verb with three full stops (12 distinct strings in the dictionaries; the census in section 9 counts 12 "..." in its corpus, which includes the heading "Nästa gång, kanske..." and excludes the landing-only "Spelar..."): "Målar...", "Sparar hjälten...", "Skapar konto...", "Loggar in...", "Skickar länken...", "Glöden tänds...", "Porträttet målas...", "Spelar...", "Ett ögonblick...". Rest/hover pairs of the home page buttons are in [../screenshots/states/](../screenshots/states/).

---

## 7. Price and free-trial phrasing

Verbatim, in the order a visitor meets them:

| Where | Swedish | English |
|---|---|---|
| Home hero microcopy (`span.cta-microcopy`) | Första boken är gratis, inget kort behövs. Sedan 149 kr i månaden. | The first book is free, no card needed. After that $14.99 a month. |
| /start pitch lede | … Porträttet ser ni om ett par minuter, den första boken är gratis. | … You see the portrait in a couple of minutes, and the first book is free. |
| Step 1 sub | Inget konto och inget kort ännu. Ni börjar med barnet. | No account and no card yet. You start with your child. |
| Step 4 trial line | Första boken är gratis. Porträttet, {vän} och allt ni just byggt följer med. | The first book is free. The portrait, {friend} and everything you just built come along. |
| Pricing intro | Nya personliga böcker varje månad, i en värld som minns. Ingen bindningstid, avsluta när du vill. | New personalized books every month, in a world that remembers. No lock-in, cancel anytime. |
| Family plan (default: yearly) | Familj · För familjen som vill fortsätta berätta tillsammans. · 1490 kr per år · 124 kr per månad vid årsbetalning · 3 nya böcker varje månad, oanvända följer med · Upp till 4 barn · 14 dagar gratis, avsluta när du vill. Kort krävs. · [Prova gratis i 14 dagar] | Family · For the family that wants to keep telling stories together. · $149.00 per year · $12.42 per month billed yearly · 3 new books every month, unused roll over · Up to 4 children · 14 days free, cancel anytime. Card required. · [Try free for 14 days] |
| Monthly toggle | 149 kr per månad | $14.99 per month |
| School plan | Skola · För klassrummet. Samma sagovärld, med plats för hela klassen. · 249 kr per månad · 6 nya böcker varje månad, oanvända följer med · Upp till 30 barn · Ingen bindningstid, avsluta när du vill. · [Uppgradera till Skola] | School · For the classroom. The same story world, with room for the whole class. · $24.99 per month · … · [Upgrade to School] |
| Terms | Familjeplanen börjar med 14 dagar gratis. Kort krävs, men inget dras under provperioden; avslutar ni innan de 14 dagarna är slut betalar ni ingenting alls. | The Family plan starts with 14 days free. A card is required, but nothing is charged during the trial; cancel before the 14 days end and you pay nothing at all. |

Sources: [../copy/pages/home.sv.md](../copy/pages/home.sv.md), [../copy/pages/uppgradera.sv.md](../copy/pages/uppgradera.sv.md) (+ state [../copy/states/uppgradera-monthly-schools__sv.webp](../copy/states/uppgradera-monthly-schools__sv.webp)), [../copy/app-strings.md#upgradepanel](../copy/app-strings.md#upgradepanel), [../copy/pages/villkor.sv.md](../copy/pages/villkor.sv.md).

Observed patterns:
- The order is always: what is free, then the card status, then the price. Free comes first and the price last, in a separate short sentence ("Sedan 149 kr i månaden.").
- "Ingen bindningstid, avsluta när du vill." recurs three times on the pricing page. "avsluta när du vill" is also a proof-list item by itself.
- Formatting: Swedish "149 kr", "1490 kr" (no thousands separator, lower-case "kr" after the number), "i månaden" in the hero but "per månad" on the pricing page. English "$14.99", "$149.00" (two decimals even on round amounts), "a month" vs "per month".
- The currency follows the UI language (`currencyByLocale`: `en` → USD, `sv` → SEK, [../copy/app-strings.md#currencybylocale](../copy/app-strings.md#currencybylocale)).
- **Read:** the home microcopy quotes the monthly 149 kr, but the pricing page opens on yearly billing (1490 kr / 124 kr per month). The cheaper per-month figure is never used as the hook, which fits the honest register.

---

## 8. How AI is mentioned

| Where | Swedish | English | Form |
|---|---|---|---|
| Landing step 1, portrait card chip | Skapad med AI | Created with AI | small chip on the image (`span.hiw-ai-chip`) |
| Home demo hero card | Skapad med AI | Made with AI | small chip |
| Reader cover | Skapad med AI. | Made with AI. | colophon line with a full stop (`readerCover.madeWithAi`) |
| Photo step | Fotot används bara för att måla porträttet. Det tränar aldrig någon AI, … | The photo is only used to paint the portrait. It never trains any AI, … | privacy promise |
| Privacy notice, "AI-innehåll" | Berättelserna, illustrationerna och porträtten skapas med AI. Vi berättar det öppet, så att ni och barnet vet att det är datorn som har hjälpt till att rita och skriva. | The stories, illustrations and portraits are generated with AI. We say so openly, so you and your child know a computer helped draw and write them. | disclosure |
| Terms, "AI-innehåll" | Berättelserna och bilderna skapas med AI, och ibland blir något konstigt eller fel. Läs gärna tillsammans med barnet, … | The stories and pictures are generated with AI, and sometimes something comes out odd or wrong. … | disclosure |
| Privacy notice, processors | Microsoft Azure, AI-tjänster som skriver berättelserna … | Microsoft Azure, AI services that write the stories … | vendor list |

Observed: "AI" appears in no headline, CTA, kicker, meta description or `<title>`. In UI copy it appears only as the chip/colophon "Skapad med AI" and in the photo privacy promise. Elsewhere the copy uses *vi* (we) or *berättaren* (the storyteller) as the maker: "Vi målar hjälten", "Jag skriver, målar och övar …". The legal text says why it is disclosed ("Vi berättar det öppet, så att ni och barnet vet …"). Sources: `aiMentions` in [../copy/copy-metrics.json](../copy/copy-metrics.json).

**Read:** AI is disclosed the way a printer's colophon is: always present, never the pitch. The English has two renderings of the same chip ("Created with AI" and "Made with AI").

---

## 9. Punctuation, case and numerals

Census from `punctuationNonLegal` / `punctuationLegal` in [../copy/copy-metrics.json](../copy/copy-metrics.json). Counts are over the deduplicated non-legal corpus (588 items, about 3,155 Swedish words). Link URLs and JS `${…}` expressions are excluded.

| Mark | sv non-legal | en non-legal | sv legal | en legal | Use |
|---|---|---|---|---|---|
| `!` | **0** | **6** | 0 | 0 | English moderation messages only ("Let's keep our stories kind and safe!"). The sample book also has 0. |
| `?` | 13 | 13 | 0 | 0 | flow questions, auth prompts ("Har du inget konto?") |
| `·` middle dot | 10 | 10 | 0 | 0 | metadata separator: kicker "Exempel: Alvas värld · 2 böcker", "Steg 1 av 4 · Hjälten", "bästa kompisen · med i 2 böcker", "Iris och den sparade platsen · på svenska", footer "Version 16ab1756 · 26 sep. 2026" |
| `...` three full stops | 12 | 12 | 0 | 0 | loading labels and one heading. The single-character ellipsis "…" is never used. |
| `"` straight double quotes | 4 | 4 | 0 | 0 | titles inside copy: från "Alva och fyraljuset"; Hämtad ur "${storyTitle}". Curly quotes (“ ” ”) and guillemets: 0. |
| `'` straight single | 6 | 40 | 1 | 18 | Swedish: titles in the waiting fire, "från '{title}'". English: apostrophes, all straight (curly ’ = 0). |
| `–` `—` dashes | 0 | 0 | 0 | 0 | none anywhere; commas, colons and semicolons do the work |
| `;` | 4 | 4 | 7 | 9 | "Ett konto för hela familjen; sen bygger ni …", "Ni kan stänga sidan; boken lägger sig i bokhyllan …" |
| `:` | 12 | 12 | 9 | 8 | reveals, "Vi valde:", "Världen minns:" |
| `( )` | 0 | 0 | 13 | 14 | only in legal, for definitions: "ett åldersspann (ett intervall, inte ett födelsedatum)" |
| `+` | 3 | 3 | — | — | add affordance: "+ Fler", "+ ta med en vän", the empty friend slot "+" |

Other conventions (observed):
- **Microcopy marker.** Landing micro lines are preceded by a four-point star drawn as an inline SVG, not a typed glyph (`.hiw-star`, path `M12 2c.7 5.6 4.4 9.3 10 10-5.6.7-9.3 4.4-10 10-.7-5.6-4.4-9.3-10-10 5.6-.7 9.3-4.4 10-10z` in `source/js/3d9nxlx1n5pdy.js`). It is 14×14 px in `var(--gold-soft)` ([3q17cp_jgfwol.pretty.css:2655-2660](../source/css/3q17cp_jgfwol.pretty.css)). The text is `.hiw-micro` in `var(--ui)`, 0.88rem/600 ([2645-2654](../source/css/3q17cp_jgfwol.pretty.css)).
- **Case.** Every source string is in sentence case, including buttons, chips and kickers. Capitals are applied only by CSS `text-transform: uppercase`, on 14 rules:

| Selector | File:lines | Size / weight / tracking | Example text |
|---|---|---|---|
| `.logo` | 3q17cp_jgfwol.pretty.css:696-710 | 1.72rem / 700 / 3px, `var(--wordmark)` Cinzel | Tale Forge (`translate="no"`) |
| `.hiw-kicker` | 3q17cp_jgfwol.pretty.css:2541-2553 | 0.82rem / 700 / 2px | Så fungerar det |
| `.hiw-next-label` | 3q17cp_jgfwol.pretty.css:3072-3087 | 0.72rem / 700 / 0.05em | nästa bok |
| `.book-sub` | 3q17cp_jgfwol.pretty.css:1520-1531 | 0.72rem / 800 / 0.04em | Stora känslor |
| `.chip` | 3q17cp_jgfwol.pretty.css:1567-1578 | 0.76rem / 800 / 0.05em | reader and card chips |
| `.comp-chosen` | 3q17cp_jgfwol.pretty.css:1431-1440 | 0.72rem / 800 / 0.05em | chosen companion tag |
| `.reader-title` | 3q17cp_jgfwol.pretty.css:1810-1822 | 2rem, Cinzel, 0 tracking | book title in the reader |
| `.sound-group-label` | 3q17cp_jgfwol.pretty.css:1974-1981 | 0.72rem / 800 / 0.09em | Stämning, Musik |
| `.reader-ceremony-title` | 3q17cp_jgfwol.pretty.css:2119-2131 | 2rem, Cinzel | Slut |
| `.start-flow .ordiv` | 2_gt301v4m-60.pretty.css:613-623 | 0.85rem / 700 / 0.06em | eller |
| `.cs-recipe-title` | 2h1wwdz1nvxwk.pretty.css:154-163 | 0.72rem / 800 / 0.12em | Bokens recept |
| `.cs-door-reg` | 2h1wwdz1nvxwk.pretty.css:381-387 | 0.66rem / 700 / 0.14em | Godnatt, Äventyr, Vänskap |
| `.glod-wb-kicker` | 37m388zf6rymp.pretty.css:157-166 | 0.64rem / 700 / 0.13em, Cinzel | Väntelden |
| `.glod-book-colophon` | 37m388zf6rymp.pretty.css:936-946 | 0.58rem / 700 / 0.22em, Cinzel | colophon on the waiting fire |

  Uppercase is reserved for tiny labels (0.58 to 0.85rem, wide tracking) and for Cinzel titles (logo, book title, "Slut"). Running text and headings are never uppercase. Files are in `source/css/`. The type specimens are in [03-typography.md](03-typography.md).
- **Numerals.** Digits are used for quantities in the contract and in the UI: "2 böcker", "14 dagar", "3 nya böcker", "Upp till 4 barn", "4 till 5 år", "Steg 1 av 4", "1000 tecken", "minst 8 tecken", "6MB" (no space). Words are used for the story structure and for time on the landing page: "fyra olika slut", "Två val ger fyra vägar", "Två gånger i varje bok", "ungefär tio minuter", "Alla fyra finns på riktigt". **Read:** numbers that describe the magic are spelled out; numbers that describe the service are digits.
- **Dates.** "26 sep. 2026" (sv) / "26 Sep 2026" (en), footer version line.
- **Spelling quirk.** "Ikvällens bok målas i" (`recipeLine.paintLead`). Standard Swedish would be "Kvällens bok"; elsewhere the site writes "Ikväll är hjälten ert barn." and "… från er första saga ikväll."
- **Comma before *och*.** The Swedish hand-over line has a serial comma, which is unusual in Swedish: "stora bilder, berättarrösten, och ingenting {namn} måste läsa själv". The other Swedish lists do not ("skriver, målar och läser in").

---

## 10. Swedish and English side by side

The English is a close translation of the Swedish. Word order and images are kept even where idiomatic English would differ ("Who becomes the hero?", "The colour would not settle this time.", "Let us try again."). Notable pairs:

| Swedish | English | What happens in translation |
|---|---|---|
| Exempel: Alvas värld · 2 böcker | Demo: Alva's world · 2 books | "Exempel" becomes "Demo" |
| barnens favorit | the family favorite | children's favourite becomes the family's |
| Riktiga bilderböcker, upplästa på svenska | Real picture books, read aloud | the language promise is dropped |
| Läs exempelboken (/start) | Read the Swedish sample | English warns that the sample is Swedish (home: "Read the sample book") |
| Iris och den sparade platsen | (kept) · "Iris and the Saved Place" in the map caption only | the title is untranslated except in one caption |
| Morfar / Morfar Erik | Grandpa Erik | maternal-grandfather specificity lost; the name is added |
| fjällräven | the mountain fox | calque (standard English: Arctic fox) |
| Alva och fyraljuset i tornet | Alva and the Fourth Candle in the Tower | interpretive |
| Skapad med AI | Created with AI / Made with AI | one source, two renderings |
| Välj kvällens äventyr | Pick tonight's adventure (home) / Choose tonight's adventure (flow) | two verbs |
| {names} allra första bok smids nu | {names} very first book is being made | forge metaphor dropped in the heading |
| Er hjälte väntar bakom duken. | Your hero is waiting behind the veil. | canvas becomes veil |
| Logga in | Login (nav) / Log in (page) | inconsistent in English only |
| Försök igen. (15) | Please try again. (14) | English adds "Please"; Swedish has no politeness marker ("vänligen" 0, "gärna" 3) |
| Vi håller sagorna snälla och trygga. | Let's keep our stories kind and safe! | statement becomes exhortation; the site's only "!" |
| Vi provar igen. | Let us try again. | literal, slightly formal |
| ni / er (plural) and du (singular) | you | the plural/singular distinction is lost |
| 149 kr i månaden | $14.99 a month | currency follows language |
| Tale Forge AB, org.nr 559543-1122, Värnamo, Sverige | Tale Forge AB, reg. no. 559543-1122, Varnamo, Sweden | the English footer drops the ä; the English legal text keeps "Värnamo" |

Systematic differences (observed):
- **Spelling** is US English (distinct strings: personalized/Personalized in 3, cozy in 4, color/colors in 2, favorite, pajamas, practicing; `og:locale` `en_US`), with UK exceptions: "colour" (`s4Unveil.paintFailedLead`), and "personalised" (2 paragraphs) and "organisations" (1) in the legal pages.
- **Oxford comma.** Used in the landing explainer ("write, paint, and narrate"; "Heroes, friends, and places") but not in the flow ("writes, paints and narrates"; "written, painted and narrated"). Swedish never uses it except in the s8 line above.
- **Browser validation is not translated.** An empty submit on the Swedish login shows the browser's native bubble, "Please fill out this field." ([../screenshots/flows/auth__04-login-empty-submit__natt__desktop.webp](../screenshots/flows/auth__04-login-empty-submit__natt__desktop.webp)). The form relies on HTML `required`, so the bubble's language follows the browser, not `tf_locale`. The capture browser ran in English.
- **Length.** English is a median 5% longer by characters, so layouts hold both languages without reflow problems (see the sv/en fold screenshots in [../screenshots/pages/home/](../screenshots/pages/home/)).

**Read:** Swedish is the authored voice and English is the faithful copy. When Tale Forge's tone is wanted in English (for example English subtitles in a film), work from the Swedish: keep the quiet statements and drop the "Please" and the "!".

---

## 11. Character and title naming

| Name | Role | Source |
|---|---|---|
| **Alva** | demo child on the home page ("Exempel: Alvas värld") | [../copy/pages/home.sv.md](../copy/pages/home.sv.md) |
| **Noah** | Alva's best friend, "bästa kompisen · med i 2 böcker" | home step 2, avatar [../assets/assets/avatar-noah.jpg](../assets/assets/avatar-noah.jpg) |
| **Sixten** | Alva's fox, "fjällräven · följer med i varje bok"; "Sixten minns tornet" | avatar [../assets/assets/avatar-sixten.jpg](../assets/assets/avatar-sixten.jpg) |
| **Iris** | hero of the sample book: "sjuårig flicka med mörka lockar, hallonröd regnjacka och gula stövlar" | [../copy/sample-book-text.sv.md](../copy/sample-book-text.sv.md) |
| **Mossa** | Iris's companion, "talande skogsmus" (a talking wood mouse; *mossa* = moss) | same |
| **Amina** | "det nya barnet" [the new child] in the sample book | same |
| **Rufus, Luna, Bo** | ready-made friends: Rufus räven, Luna ugglan, Bo draken | [../copy/app-strings.md#starterfriends](../copy/app-strings.md#starterfriends) |
| **Morfar Erik, Berättaren Lily, Berättaren Marcus, Unga Saga** | narrator voices; default `grandpa` | [../copy/app-strings.md#create_voices](../copy/app-strings.md#create_voices) |

Observed patterns:
- Names are short (one or two syllables) and spelled the same in both languages; only descriptors are translated ("Rufus räven" / "Rufus the fox").
- In Swedish, animals follow the pattern name + definite species noun ("Rufus räven", "Luna ugglan", "Bo draken") or species + name inside sentences ("räven Sixten", "ugglan Luna blinkade långsamt").
- Narrators are named as role + name: "Morfar Erik", "Berättaren Lily", "Unga Saga".
- Book titles follow **{Hero} och {definite noun phrase} {place}**: "Alva och fyraljuset i tornet", "Alva och filten vid elementet", "Iris och den sparade platsen". The first-book door titles drop the hero: "Den försvunna lyktan", "Tornet i molnen", "Stjärnnatten".
- Each starter friend and keepsake carries a one-line action written for the hero card: "och räven Rufus log", "och draken Bo blåste en liten rökring", "höll lyktan högt", "lyfte träsvärdet mot stjärnorna" ([../copy/app-strings.md#keepsakes](../copy/app-strings.md#keepsakes)).

**Read:** the names are recognisably Swedish (Sixten, Saga, Alva, Morfar) without being hard to say in English (Noah, Iris, Luna). The fox Sixten and the mouse Mossa have ordinary first names or nature words, which matches the picture-book convention of animals with plain names.

---

## 12. Microcopy formulas

| Situation | Formula | Examples |
|---|---|---|
| Loading | Verb (present) + "..." | "Målar...", "Sparar hjälten...", "Glöden tänds..." |
| Generic error | "Något gick fel. Försök igen." + optional reassurance | "Något gick fel när hjälten skulle sparas. Allt ni byggt finns kvar, försök igen." |
| Specific error | What could not be done + what to do | "Det fotot är för stort. Välj ett som är mindre än 6MB." · "För många försök just nu. Vänta en liten stund och försök igen." |
| Moderation | "Vi håller sagorna snälla och trygga." + one instruction | "… Ta inte med personnummer." |
| Waiting status (cold, first book) | "{namns} allra första bok …" + time + bookshelf promise | "{names} allra första bok smids i elden nu och tar {minutes}, och den lägger sig i bokhyllan även om ni stänger sidan." |
| Page-level failure (reader) | Short lead + short hint | "Den här sidan blev inte klar." / "Resten av boken är kvar." |
| Not found | Story-world excuse | "Sidan finns inte" / "Den här sidan har vandrat iväg i sagovärlden." |
| Fallback names | Definite noun | "Hjälten", "ert barn", "Er sagovärld" |
| Placeholders | Example in the user's language | "du@exempel.se" / "you@example.com", "Barnets namn", "Ditt lösenord" |
| Footer tagline | Brand + appositive | "Tale Forge, sagor som minns er värld." + "Beta" pill |
| Grown-up check-in | Address the adult apart from the child | "Till dig som vuxen" · "Skulle er familj välja ett nytt äventyr som det här?" · "Ja" / "Inte än" |

All rows are traceable in [../copy/app-strings.md](../copy/app-strings.md) (sections 3, 6, 8, 10, 11) and the page decks.

---

## 13. Long-form voice: the legal pages

Observed in [../copy/pages/integritet.sv.md](../copy/pages/integritet.sv.md) and [../copy/pages/villkor.sv.md](../copy/pages/villkor.sv.md):
- **Both languages on one page.** The UI language comes first, the other in a `<details>` ("Read in English" / "Läs på svenska"). The lede says so: "Samma text finns på svenska och engelska nedan."
- **A summary first.** Each page opens with "I korthet" [In short], starting "Vi är Tale Forge AB, ett litet svenskt företag i Värnamo (org.nr 559543-1122)."
- **Same voice, longer sentences.** Mean 13.0 words per sentence in Swedish and 14.9 in English (vs 8.1 to 8.4 in UI body copy). It still uses *ni/er* (63 times, *du* 0) and *vi*, and has no exclamation marks.
- **Plain headings.** "Vad vi samlar in", "Fotot", "Vem behandlar uppgifterna", "Era rättigheter", "Era böcker och vår motor", "Så får tjänsten användas".
- **Named processors** in a list (Supabase, Microsoft Azure, Google Cloud Storage / Gemini, Amazon AWS, ElevenLabs, PostHog), each with a one-line job description.
- **Admissions and caveats**, quoted in 3.1.
- **Ownership in two short sentences.** "Böckerna ni skapar är er familjs … Vårt är själva appen: berättarmotorn som skriver och minns …"

---

## 14. Reproducing the voice

Rules distilled from sections 3 to 12, for new copy, title cards or voice-over in Tale Forge's manner:

1. **Write Swedish first.** Address the family as *ni/er*. Use *du* only for one adult's account, payment or feedback, and for lines spoken to the child.
2. **One idea per sentence, 7 to 8 words.** Headlines are 3 to 5 words. Close a claim with a 1 to 3 word fragment ("På riktigt.").
3. **Display headlines are declarative, end with a full stop, and put the child last.** That last phrase is the one coloured gold (natt) or violet (morgon); the full stop stays white or ink.
4. **Section titles are imperative or a noun, with no full stop.** Questions are for decisions ("Vem följer med?").
5. **Use craft verbs.** måla, smida, baka, skriva, läsa in. Never "generera". Mention AI once, small and factual: "Skapad med AI."
6. **State the time and the limit, then frame it humanly.** "Det tar ungefär tio minuter." → "Lagom tid för tandborstning och pyjamas."
7. **Reassure with the refrain.** "… lägger sig i bokhyllan när den är klar." / "Allt ni byggt är kvar."
8. **Typography.** No "!", no dashes, three full stops for "...", straight quotes, "·" between metadata, digits for counts and prices, words for story numbers. Sentence case in the source; uppercase only for tiny tracked labels.
9. **Place it in the evening.** kväll, godnatt, brasa, morfar, Natt/Morgon.
10. **Remember.** End on continuity: *minns*, *världen*, *nästa bok*.

Illustrative lines written for this library in the house pattern (**new, not from the site**):

| Use | Swedish | English (house-faithful) |
|---|---|---|
| Film title card | En saga som minns **er kväll**. | A story that remembers **your evening**. |
| VO open | Ikväll är hjälten ert barn. Morfar Erik läser. | Tonight the hero is your child. Grandpa Erik reads. |
| VO honesty beat | Boken tar ungefär tio minuter. Lagom tid för tandborstning. | The book takes about ten minutes. Just enough time for toothbrushing. |
| End card | Skapa er hjälte · Första boken är gratis | Create your hero · The first book is free |

---

## 15. Uncertainties and gaps

- **Logged-in copy is missing.** Bookshelf, account (/konto), the full reader and real waiting screens could not be visited (no login, by rule). Their strings are known only from the client dictionaries. Server-only strings and any transactional emails are not in the library.
- **The sample-book route returned 404** on 2026-10-09 ([../copy/pages/share_iris-sparade-platsen.404.md](../copy/pages/share_iris-sparade-platsen.404.md)). The book text comes from the JSON shipped in the landing bundle, which may differ from what the share page shows when it works.
- **The native validation bubble language** depends on the capturing browser's locale (English in our headless Chromium). A Swedish browser would show Swedish.
- **Metric caveats.** Sentence splitting is heuristic (after . ! ? … and a capital). Short labels count as one-word "sentences" in the all-corpus figures, which pulls the overall mean (5.0) below the body-copy means (8.1 to 8.4). Headline classification for JS strings uses key names (`heading`, `title`, `*Heading`, `*Title`).
- **"fyraljuset" → "Fourth Candle"** is described as interpretive. The Swedish compound literally means "the four-light"; its intended sense (an Advent candle?) cannot be confirmed from the site.
- **Version.** The copy is from release `tf-release-sha 4be07efd68ad299089d33297742e56589f587460`, footer "Version 16ab1756 · 26 sep. 2026", harvested 2026-10-09. The copy changes with releases.
