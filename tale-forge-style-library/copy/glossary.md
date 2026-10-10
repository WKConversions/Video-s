# Glossary: Tale Forge product vocabulary, Svenska ⇄ English

The words Tale Forge uses for its own things, with the English the site pairs them with, how each is used, and where to find it.
Swedish is the source language (default locale `sv`, cookie `tf_locale`); English is a translation layer, and some pairs are not one-to-one (Morfar, saga, ni/du, mejl/e-post).
Counts are occurrences in the non-legal copy (deduplicated sv/en pairs) from [copy-metrics.json](copy-metrics.json) `termCountsNonLegal`. Keys such as `create-flow.s6Launch` point to tables in [app-strings.md](app-strings.md) and to `areas.<area>.entries.<name>` in [i18n-strings.json](i18n-strings.json); page copy is in [pages/](pages/).
Voice analysis built on these terms: [../analysis/10-copy-voice-and-tone.md](../analysis/10-copy-voice-and-tone.md).

## Contents

1. [Core nouns: hero, world, book, shelf](#1-core-nouns-hero-world-book-shelf)
2. [Story mechanics: choice, ending, adventure, evening](#2-story-mechanics-choice-ending-adventure-evening)
3. [Making the book: paint, forge, ember](#3-making-the-book-paint-forge-ember)
4. [Voice and sound](#4-voice-and-sound)
5. [Themes, chrome and account](#5-themes-chrome-and-account)
6. [Plans and money](#6-plans-and-money)
7. [Options: ages, traits, moods, art styles](#7-options-ages-traits-moods-art-styles)
8. [Names: people, animals, books](#8-names-people-animals-books)
9. [Address forms and register words](#9-address-forms-and-register-words)
10. [Translation choices worth knowing](#10-translation-choices-worth-knowing)

## 1. Core nouns: hero, world, book, shelf

| Svenska | English | Count sv / en | How it is used | Evidence |
|---|---|---|---|---|
| **hjälte**, hjälten, hjältar | hero | 39 / 41 | The child as protagonist. The single most repeated product noun and the main CTA object: "Skapa er hjälte" (Create your hero). The flow names its stages after it ("Steg 1 av 4 · Hjälten", "Spara hjälten", "Hjältekortet" = the hero card). Fallback name when the child's name is missing is "Hjälten" / "The hero". | home h1 area and CTAs in [pages/home.sv.md](pages/home.sv.md); [app-strings.md#s1hero](app-strings.md#s1hero), [#s3company](app-strings.md#s3company), [#s4unveil](app-strings.md#s4unveil) |
| huvudperson | main character | 1 / 1 | Used once, in the /start pitch lede, to explain "hero" plainly: "en riktig bilderbok där ert barn är huvudpersonen". | [app-strings.md#s0pitch](app-strings.md#s0pitch) |
| **värld**, världen, sagovärld | world, story world, storyworld | 13 / 17 | The persistent universe a family builds across books. Carries the promise "the world remembers": "En värld som minns henne.", "Världen minns", footer "Tale Forge, sagor som minns er värld." English spells it both "story world" (`worldBand.world`, 404, upgrade) and "storyworld" (`worldBand.fallbackTitle` "Your storyworld"). | [pages/home.sv.md](pages/home.sv.md); [app-strings.md#worldband](app-strings.md#worldband) |
| **minns** | remembers | 13 / 12 | The brand verb. Always present tense, always with the world, a book, a friend or an ember as subject: "senare böcker minns äventyren", "Sixten minns tornet", "Världen minns:", "Fånga en gnista som minns en stund ur era böcker". | home hero and step 6; [app-strings.md#glod_copy](app-strings.md#glod_copy) |
| **saga**, sagan, sagor | story (also "tale") | 53 / 65 (story/stories) | The everyday word for the generated story; warmer and more fairy-tale than English "story". Forms many compounds (19): sagobok, sagovärld, sagobarn, sagosmedja, sagoskogen, sagostund (book only). | throughout; `JOB_STATUS_COPY`, `GLOD_COPY` |
| berättelse(n) | story | 11 / — | The more neutral, structural word: used for narration and production steps ("Spela berättelsen", "Berättelsen planeras", "Meningsfulla val som formar berättelsen"). | [app-strings.md#narrationcontrols](app-strings.md#narrationcontrols), [#job_status_copy](app-strings.md#job_status_copy) |
| **bilderbok**, bilderböcker | picture book | 6 / — | The claim word, always with "riktig" (real): "Riktiga bilderböcker, skapade för ditt barn." (meta description), "En riktig bilderbok tar några minuter." | meta in every page deck; [app-strings.md#job_status_copy](app-strings.md#job_status_copy) |
| sagobok, sagoböcker | storybook, picture book | — | Used on signup and upgrade ("Personliga sagoböcker", "Personliga, illustrerade sagoböcker"); English varies between "picture books" and "storybooks". | [pages/signup.sv.md](pages/signup.sv.md), [pages/uppgradera.sv.md](pages/uppgradera.sv.md) |
| bok, boken, böcker | book | 76 / 96 | The unit of product and of pricing ("3 nya böcker varje månad"). A book "lands" (lägger sig) on the shelf, "is baked" (bakas) on the landing page and "is forged" (smids) in the app. | upgrade, waiting fire |
| **bokhyllan** (nav: Bokhylla) | the bookshelf (nav: Bookshelf) | 17 / 17 | Where finished books live. The fixed phrase "lägger sig i bokhyllan när den är klar" / "lands on the bookshelf when it is ready" occurs 12 times: it is the app's reassurance refrain whenever a page can be closed or something fails. Home h2 "Bokhyllan" / "The bookshelf". | [app-strings.md#s6launch](app-strings.md#s6launch), [#job_status_copy](app-strings.md#job_status_copy), [#navbookshelf](app-strings.md#navbookshelf) |
| exempelbok, exempelboken | sample book ("the Swedish sample") | — | The one public demo book, "Iris och den sparade platsen". English keeps the Swedish title and flags the language: "Read the Swedish sample", "Iris och den sparade platsen · Swedish". Text: [sample-book-text.sv.md](sample-book-text.sv.md). | [app-strings.md#s0pitch](app-strings.md#s0pitch), [#upgradepanel](app-strings.md#upgradepanel) |
| Exempel: (kicker) | Demo: | — | Label for the invented demo family on the home hero: "Exempel: Alvas värld · 2 böcker" / "Demo: Alva's world · 2 books". | [pages/home.sv.md](pages/home.sv.md) |

## 2. Story mechanics: choice, ending, adventure, evening

| Svenska | English | Count sv / en | How it is used | Evidence |
|---|---|---|---|---|
| **val**, valet, valen | choice, the choice(s) | 13 / 49 (choice/choose/pick) | The branching mechanic. Always defended as real: "Inga låtsasval." (No pretend choices.), "valet ändrar det som händer sedan. På riktigt." Map nodes are "Val 1", "Val 2". The last setup screen is "Sista valet före boken". | home step 4 ([pages/home.sv.md](pages/home.sv.md)); [app-strings.md#explainer](app-strings.md#explainer), [#stepheaders](app-strings.md#stepheaders) |
| välj, väljer | choose / pick | 36 | The most frequent verb. English alternates "choose" (headings, errors) and "pick" (doors, adventure step): "Välj kvällens äventyr" is "Pick tonight's adventure" on the landing page but "Choose tonight's adventure" in the flow. | [app-strings.md#doorgridheading](app-strings.md#doorgridheading) |
| **slut** | ending; "The End" | 5 | Two senses: an ending of a branching book ("Fyra olika slut", "Slut 2 av 4, visa vägen dit") and the closing word of every book in the reader, "Slut" / "The End". | [app-strings.md#theend](app-strings.md#theend), [#explainer](app-strings.md#explainer) |
| **äventyr** | adventure | 28 / 28 | The story the family orders for tonight; also a mood register ("Ett mysigt äventyr", "Ett larvigt äventyr"). | doors, next-book cards |
| dörr | door | — | Internal name for the adventure cards: "Välj en dörr så skrivs första boken." Not a visible label otherwise (CSS `cs-door`). | [app-strings.md#s6launch](app-strings.md#s6launch) |
| **kväll**, ikväll, kvällens | evening, tonight, tonight's | 14 / 15 | The bedtime frame. "Ikväll är hjälten ert barn.", "Välj kvällens äventyr", "Så här går en kväll till." Note the non-standard spelling "Ikvällens bok målas i" (`recipeLine.paintLead`); elsewhere "Ikväll" / "kvällens". | [app-strings.md#recipeline](app-strings.md#recipeline) |
| tråd | thread | — | A story thread carried into the next book: "En tråd från er förra saga kan bli nästa bok.", "En saga som spinner vidare" (spins on). | [app-strings.md#emberinvitationgeneric](app-strings.md#emberinvitationgeneric) |
| Överraska oss | Surprise us | — | The fourth door: the app picks adventure, art style and voice from the child's age. | [app-strings.md#surprisedoor](app-strings.md#surprisedoor) |
| Bokens recept | Book recipe | — | The editable summary line under the doors: style, voice, language, companion. | [app-strings.md#recipeline](app-strings.md#recipeline) |
| sällskapet | the company | — | Step 3 title ("Steg 3 av 4 · Sällskapet"), i.e. who comes along. | [app-strings.md#stepheaders](app-strings.md#stepheaders) |
| vän, färdig vän, kompis | friend, ready-made friend, buddy/friend | 25 | Companions. "Ta med en vän" (Bring a friend). Ready-made friends are Rufus, Luna and Bo; "Sagan väljer" (The story chooses) is the default. | [app-strings.md#starterfriends](app-strings.md#starterfriends) |
| något kärt | something dear | — | Keepsake object: "Något kärt att ta med?" (red scarf, old lantern, wooden sword). | [app-strings.md#keepsakes](app-strings.md#keepsakes) |

## 3. Making the book: paint, forge, ember

The brand name is a forge, and the app spells that metaphor out in Swedish: smedja (smithy), smida (to forge), smed (smith), eld (fire), glöd (ember), gnista (spark). The landing page uses a softer kitchen metaphor (bakas, baking), and the portrait uses a painter's (måla, duken, färgen torkar).

| Svenska | English | Count sv / en | How it is used | Evidence |
|---|---|---|---|---|
| **måla**, målas, målade | paint, painted | 23 / 22 | Every image is "painted", never "generated" in UI copy: "Vi målar hjälten i bokens stil", "Porträttet har börjat målas", "Bilden målas fortfarande." | [app-strings.md#s2photo](app-strings.md#s2photo), [#readerpicturewait](app-strings.md#readerpicturewait) |
| porträtt(et) | portrait | 12 | The painted likeness of the child; "Porträttet styr både bilderna och berättelsen." | home step 1; `s2Photo`, `s4Unveil` |
| Avtäck; bakom duken | Unveil; behind the veil | — | Portrait reveal. "Er hjälte väntar bakom duken." Literally "behind the canvas/cloth"; English chose "veil". | [app-strings.md#s4unveil](app-strings.md#s4unveil) |
| Färgen torkar på porträttet | The paint is drying on the portrait | — | Progress pill while the portrait renders; failure is "Färgen ville inte fastna den här gången." (The colour would not settle this time.) | [app-strings.md#s3company](app-strings.md#s3company), [#s4unveil](app-strings.md#s4unveil) |
| smida, smids, smitt; smedja(n), sagosmedjan; smed | forge, being made/forged; smithy, the forge, workshop; smith | 16 / 18 | Generation. "{names} allra första bok smids nu", "Smedjan är tom just nu" (no worker free), "så snart en smed är tillbaka". English translates "smids" as "is being made" in headings and "forge" in lines. | [app-strings.md#job_status_copy](app-strings.md#job_status_copy), [#glod_copy](app-strings.md#glod_copy) |
| **väntelden**; elden | the waiting fire; the fire | 8 / 14 | The waiting screen is a hearth: "Väntelden. Fånga en glöd för att se vad den minns." | [app-strings.md#glod_copy](app-strings.md#glod_copy) |
| **glöd**, glöden; gnista | ember; spark | 10 / 10 | Two jobs: the launch button ("Redo att tända glöden?" / "Ready to light the ember?", "Sätt igång" / "Light it", "Glöden tänds..."), and memory tokens that float on the waiting screen ("Fånga en gnista", "Spara till nästa saga"). | [app-strings.md#s6launch](app-strings.md#s6launch), [#glod_copy](app-strings.md#glod_copy) |
| Boken bakas | The book is baking | — | Landing page only: "Boken bakas. Ungefär tio minuter kvar." | home step 3 |
| redaktör, utkast, omskrivning | editor, draft, rewrite | — | The quality loop told as a newsroom: "Vår redaktör skickade tillbaka utkastet ... Bra böcker behöver en omskrivning ibland." | [app-strings.md#job_status_copy](app-strings.md#job_status_copy) |
| Skapad med AI | Made with AI / Created with AI | 4 | The AI label. A small chip on images ("Skapad med AI") and a line on the book cover ("Skapad med AI."). English uses two renderings: "Created with AI" (landing step 1 chip) and "Made with AI" (demo hero card, reader cover). | [app-strings.md#readercover](app-strings.md#readercover); home deck |

## 4. Voice and sound

| Svenska | English | How it is used | Evidence |
|---|---|---|---|
| **berättarröst**, berättarrösten | narrator voice, the narrator | The read-aloud voice: "Hör berättarrösten" (Hear the narrator), recipe sheet title "Berättarröst". | [app-strings.md#explainer](app-strings.md#explainer), [#recipeline](app-strings.md#recipeline) |
| berättare, Berättaren Lily/Marcus | storyteller, Storyteller Lily / Narrator Marcus | Voice names. The waiting screen's first-person voice is the storyteller: "Jag skriver, målar och övar på att säga {name} precis rätt." | [app-strings.md#create_voices](app-strings.md#create_voices), [#s7forging](app-strings.md#s7forging) |
| **Morfar**, Morfar Erik | Grandpa Erik | The default narrator (`DEFAULT_CREATE_VOICE_ID`, persona `grandpa`). Swedish "morfar" is specifically the mother's father; English has no single word, so it becomes "Grandpa" plus the name. On the landing chip Swedish shows just "Morfar", English "Grandpa Erik". Sample audio: [../assets/landing/voice/](../assets/landing/voice/), [../assets/audio/landing-voice/](../assets/audio/landing-voice/). | [app-strings.md#create_voices](app-strings.md#create_voices), [#explainer](app-strings.md#explainer) |
| uppläsning; läsa in; upplästa | narration; narrate (record); read aloud | "Uppläsning till varje berättelse", "skriver, målar och läser in", kicker "Riktiga bilderböcker, upplästa på svenska" (English drops "på svenska": "Real picture books, read aloud"). | [app-strings.md#upgradepanel](app-strings.md#upgradepanel), [#s0pitch](app-strings.md#s0pitch) |
| Lyssna-läge | Listen mode | Reader mode. | [app-strings.md#readercover](app-strings.md#readercover) |
| Bakgrundsljud; Stämning; Musik; Av | Background sound; Ambience; Music; Off | Reader sound menu. | [app-strings.md#soundmenu](app-strings.md#soundmenu) |
| Brasa, Fönsterregn, Sagoskogen, Speldosa, Månharpa, Glödljus | Fireplace, Window rain, Enchanted forest, Music box, Moonlit harp, Ember glow | Ambient beds (`AMBIENT_BEDS`), files [../assets/audio/atmosphere/v1/](../assets/audio/atmosphere/v1/) (`hearth`, `rain`, `forest`, `musicbox`, `harp`, `fire`). | [app-strings.md#ambient_beds](app-strings.md#ambient_beds) |
| Eldljud | Fire sound | Sound chip on the waiting fire. | [app-strings.md#firesoundtoggle](app-strings.md#firesoundtoggle) |

## 5. Themes, chrome and account

| Svenska | English | How it is used | Evidence |
|---|---|---|---|
| **Natt** / **Morgon** | Night / Morning | The two themes (`body[data-theme]` natt/morgon). The toggle's keys are `night`/`day`, but the visible word for the light theme is Morgon / Morning, never "Dag" / "Day". aria-label "Byt tema" / "Switch theme". | [app-strings.md#themetoggle](app-strings.md#themetoggle) |
| SV / EN; Byt språk | SV / EN; Change language | Language switcher; the language names in the recipe are "svenska" (lower case) / "English". | [app-strings.md#languageswitcheraria](app-strings.md#languageswitcheraria), [#recipemodel](app-strings.md#recipemodel) |
| Logga in | Login (nav) / Log in (page, button) | The English nav link is one word, the page heading and button two words. | [app-strings.md#navlogin](app-strings.md#navlogin), [#authforms](app-strings.md#authforms) |
| Priser; Konto; Bokhylla | Pricing; Account; Bookshelf | Nav items (Konto and Bokhylla when signed in). | [app-strings.md#navpricing](app-strings.md#navpricing) |
| Hoppa till innehållet | Skip to content | Skip link. | every page deck |
| Kontakt · Integritet · Villkor | Contact · Privacy · Terms | Footer links; page titles are "Integritetspolicy" / "Privacy notice" and "Användarvillkor" / "Terms of service". | [pages/integritet.sv.md](pages/integritet.sv.md), [pages/villkor.sv.md](pages/villkor.sv.md) |
| Beta | Beta | Pill next to the footer tagline. | footer in every deck |
| e-post, e-postadress / mejl, mejla, mejladress | email | Both registers coexist: formal "E-post" for the field label and errors, colloquial "mejl" in reassurance and contact ("vi mejlar dig en länk", "Din mejladress", "mejla oss"). Counts 10 / 6. | [app-strings.md#authfields](app-strings.md#authfields), [#s5account](app-strings.md#s5account) |
| förälder eller vårdnadshavare | parent or guardian | Attestation: "Jag är barnets förälder eller vårdnadshavare och godkänner integritetspolicyn." | [pages/signup.sv.md](pages/signup.sv.md) |
| integritetspolicyn | the privacy notice | English avoids "policy". | [app-strings.md#authfields](app-strings.md#authfields) |
| Till dig som vuxen | For grown-ups | Header of the parent-only feedback block after a book. | [app-strings.md#feedbackform](app-strings.md#feedbackform) |
| Sidan finns inte | Page not found | 404: "Den här sidan har vandrat iväg i sagovärlden." (This page wandered off into the story world.) | [pages/404.sv.md](pages/404.sv.md) |
| Bokmässans snabb-saga | the Book Fair quick story | Legal pages only: a separate anonymous quick-story flow for Bokmässan (the book fair). The flow itself is not on the public site. | [pages/integritet.sv.md](pages/integritet.sv.md) |

## 6. Plans and money

| Svenska | English | How it is used | Evidence |
|---|---|---|---|
| Första boken är gratis | The first book is free | The free tier, always paired with "inget kort behövs" / "no card needed". | home hero microcopy; [app-strings.md#s0pitch](app-strings.md#s0pitch) |
| Familj; Skola; Gratisplanen | Family; School; the free plan | Plan names are single common nouns. | [app-strings.md#upgradepanel](app-strings.md#upgradepanel); [pages/villkor.sv.md](pages/villkor.sv.md) |
| provperiod; 14 dagar gratis; Kort krävs. | trial; 14 days free; Card required. | Family trial line: "14 dagar gratis, avsluta när du vill. Kort krävs." | [pages/uppgradera.sv.md](pages/uppgradera.sv.md) |
| Ingen bindningstid | No lock-in | Always followed by "avsluta när du vill" / "cancel anytime". | [app-strings.md#upgradepanel](app-strings.md#upgradepanel) |
| Månadsvis / Årsvis | Monthly / Yearly | Billing toggle; default is yearly. | uppgradera deck |
| 149 kr i månaden; 1490 kr per år; 124 kr per månad vid årsbetalning; 249 kr per månad (Skola) | $14.99 a month; $149.00 per year; $12.42 per month billed yearly; $24.99 per month | Prices change currency with the UI language (`currencyByLocale`: sv → SEK, en → USD). | [pages/uppgradera.sv.md](pages/uppgradera.sv.md), [pages/uppgradera.en.md](pages/uppgradera.en.md) |
| oanvända följer med | unused roll over | "3 nya böcker varje månad, oanvända följer med". | [app-strings.md#upgradepanel](app-strings.md#upgradepanel) |
| kassan | checkout | "Kunde inte öppna kassan." | [app-strings.md#upgradepanel](app-strings.md#upgradepanel) |
| Ångerrätt | Right of withdrawal | Legal. | [pages/villkor.sv.md](pages/villkor.sv.md) |

## 7. Options: ages, traits, moods, art styles

| Group | Svenska | English | Evidence |
|---|---|---|---|
| Age groups (bands A/B/C) | 4 till 5 år · 6 till 7 år · 8 till 9 år | 4 to 5 years · 6 to 7 years · 8 to 9 years | [app-strings.md#age_groups](app-strings.md#age_groups) |
| Pronoun | "Vilket ord ska sagan använda?" Han / Hon | "Which word should the story use?" He / She | [app-strings.md#s1hero](app-strings.md#s1hero) |
| Traits (demo hero card) | Modig, Fnissig, Djurvän, Nyfiken, Envis, + Fler | Brave, Giggly, Animal lover, Curious, Stubborn, + More | [pages/home.sv.md](pages/home.sv.md) |
| Door registers | Godnatt, Äventyr, Vänskap | Bedtime, Adventure, Friendship | [app-strings.md#doorregisterlabels](app-strings.md#doorregisterlabels) |
| Next-book moods | Ett mysigt / stort / larvigt / underbart äventyr | A cozy / big / silly / wonder-filled adventure | [app-strings.md#registercards](app-strings.md#registercards) |
| Mood results | stilla och trygg · modig och vild · tokig och full av fniss · stilla magi | calm and snug · bold and wild · silly and full of giggles · quiet magic | [app-strings.md#registerwhylines](app-strings.md#registerwhylines) |
| Shelf categories | Stora känslor, Mysigt äventyr | Big feelings, Cozy adventure | [pages/home.sv.md](pages/home.sv.md) |
| First-book doors | Den försvunna lyktan, Tornet i molnen, Stjärnnatten | The Lost Lantern, The Tower in the Clouds, The Starry Night | [app-strings.md#firstrundoorcards](app-strings.md#firstrundoorcards) |
| Art styles (`CREATE_STYLE_PRESETS`) | Mjuk akvarell, New Yorker-tusch en accent, Seriestil, Kritteckning, Lysande magi, Retrospel-pixel, Lera-animation, Vintage screentryck | Soft Watercolor, New Yorker ink one accent, Comic book, Crayon drawn by a kid, Glowing magic, Retro game pixel art, Claymation, Vintage screen-print | [app-strings.md#create_style_presets](app-strings.md#create_style_presets) |
| Feedback chips | Något var otydligt, Valen kändes för lika, För lång, Väntan var för lång, ... | Something was unclear, Choices felt too similar, Too long, The wait was too long, ... | [app-strings.md#feedbackissuetags](app-strings.md#feedbackissuetags) |

## 8. Names: people, animals, books

Observed: every character name in the product is a short Nordic or international first name that works unchanged in both languages; only descriptors and titles are translated.

| Name | Who | Svenska descriptor | English descriptor | Where |
|---|---|---|---|---|
| **Alva** | Demo child on the home page ("Exempel: Alvas värld") | — | — | home hero, demo hero card ([pages/home.sv.md](pages/home.sv.md)) |
| **Noah** | Alva's friend | bästa kompisen · med i 2 böcker | best friend · in 2 books | home step 2, [../assets/assets/avatar-noah.jpg](../assets/assets/avatar-noah.jpg) |
| **Sixten** | Alva's fox | fjällräven · följer med i varje bok; "räven Sixten" | the mountain fox · comes along in every book; "Sixten the fox" | home step 2 and badge, [../assets/assets/avatar-sixten.jpg](../assets/assets/avatar-sixten.jpg) |
| **Iris** | Hero of the sample book | sjuårig flicka med mörka lockar, hallonröd regnjacka och gula stövlar | — (book is Swedish only) | [sample-book-text.sv.md](sample-book-text.sv.md) |
| **Mossa** | Iris's companion | talande skogsmus (talking wood mouse); "mossa" = moss | — | sample book; English landing choice "Go with Mossa to the green rug." |
| **Amina** | "det nya barnet" (the new child) in the sample book | sjuårig flicka med två mörka flätor | — | sample book `canon.others` |
| **Rufus**, **Luna**, **Bo** | Ready-made friends | Rufus räven, Luna ugglan, Bo draken | Rufus the fox, Luna the owl, Bo the dragon | [app-strings.md#starterfriends](app-strings.md#starterfriends) |
| **Erik**, **Lily**, **Marcus**, **Saga** | Narrator voices | Morfar Erik, Berättaren Lily, Berättaren Marcus, Unga Saga | Grandpa Erik, Storyteller Lily, Narrator Marcus, Young Saga | [app-strings.md#create_voices](app-strings.md#create_voices) |
| Alva och fyraljuset i tornet | Demo book 1 (category "Stora känslor") | — | Alva and the Fourth Candle in the Tower | home bookshelf, [../assets/assets/cover-tornet.webp](../assets/assets/cover-tornet.webp) |
| Alva och filten vid elementet | Demo book 2 (category "Mysigt äventyr") | — | Alva and the Blanket by the Radiator | home bookshelf, [../assets/assets/cover-filten.webp](../assets/assets/cover-filten.webp) |
| Iris och den sparade platsen | The sample book | — | Kept in Swedish ("Iris och den sparade platsen · Swedish"); translated only in the map caption: "Iris and the Saved Place" | [app-strings.md#explainer](app-strings.md#explainer) |
| Den tomma sidan | Iris's earlier book (world memory) | — | — | sample book `spec.world.shelf` |

Title formula (observed in all three book titles): `{Hero} och {definite noun phrase}` + optional place ("i tornet", "vid elementet") = "{Hero} and the {Thing} {in/by the Place}".

## 9. Address forms and register words

| Svenska | English | Note |
|---|---|---|
| **ni / er / ert / era** (plural you, your) | you / your | The default address: the family, not one parent. 63 occurrences in app strings, 15 on marketing pages, 63 in the legal text. "Skapa er hjälte", "Ni börjar med barnet." |
| du / dig / din / ditt / dina (singular you) | you / your | Used where one adult acts alone: login and recovery ("Har du inget konto?", "Glömt lösenordet?"), the grown-up feedback ("Till dig som vuxen", "Tack för att du berättade."), the pricing page ("avsluta när du vill", "Din nuvarande plan"), the job-status headings ("Din saga växer fram") and the demo card addressed to the child ("Din hjälte", "Bli din egen hjälte", "så målar vi dig"). 33 in app strings, 6 on marketing pages, 0 in legal. Meta description: "skapade för ditt barn". |
| vi | we | The company speaks as "vi" ("Vi målar hjälten", "det säger vi hellre ärligt"). The storyteller speaks as "jag" ("Jag börjar berätta så fort ni säger till."). |
| gärna | (please / feel free) | 3 uses ("Prova gärna andra ord", "Läs gärna tillsammans med barnet"). Swedish has no "vänligen" (0); English adds "Please" to 14 of its "try again" messages. |
| lagom | just enough | "Lagom tid för tandborstning och pyjamas." / "Just enough time for toothbrushing and pajamas." |
| funkar / fungerar | works | Both: kicker "Så fungerar det" (standard), button "Se hur det funkar" and reader "Så funkar det" (colloquial). |
| På riktigt. | For real. | Fragment used as a closing beat after a claim about choices. |
| allra första | very first | Emotional intensifier for the first book: "{names} allra första bok smids nu". |

## 10. Translation choices worth knowing

| Svenska | English | What changes |
|---|---|---|
| "Exempel: Alvas värld" | "Demo: Alva's world" | "Exempel" (example) becomes "Demo". |
| "barnens favorit" | "the family favorite" | Children's favourite becomes the family's. |
| "fjällräven" | "the mountain fox" | Literal calque of fjäll (mountain) + räv (fox); standard English would be "Arctic fox". The pictured fox is white. |
| "fyraljuset" | "the Fourth Candle" | Interpretive: "fyraljus" names a four-candle light; English chose "Fourth Candle". |
| "Morfar" | "Grandpa Erik" | Maternal-grandfather specificity lost; the name is added in English everywhere. |
| "Skapad med AI" | "Created with AI" / "Made with AI" | One Swedish phrase, two English ones. |
| "upplästa på svenska" | "read aloud" | The language promise is dropped in English (the sample book is only Swedish). |
| "Läs exempelboken" | "Read the Swedish sample" / "Read the sample book" | English warns about the language on /start but not on the home page. |
| "Välj kvällens äventyr" | "Pick tonight's adventure" (home) / "Choose tonight's adventure" (flow) | Two verbs for one phrase. |
| "smids" | "is being made" (headings) / "forge" (lines) | The forge metaphor is weaker in English headings. |
| "bakom duken" | "behind the veil" | Canvas/cloth becomes veil. |
| "Logga in" | "Login" (nav) / "Log in" (page) | Inconsistent in English only. |
| "149 kr i månaden" | "$14.99 a month" | Currency follows the language, not the market. |
| "org.nr", "Värnamo, Sverige" | "reg. no.", "Varnamo, Sweden" | English footer drops the ä in Värnamo; the legal text keeps "Värnamo". |
| "Vi håller sagorna snälla och trygga." | "Let's keep our stories kind and safe!" | The only exclamation marks on the site are these six English moderation messages; Swedish is a calm statement. |
| personalized / cozy / favorite / color / pajamas | (US spelling) | English UI is US-spelled, with exceptions: "colour" in `s4Unveil.paintFailedLead`, and "personalised" and "organisations" in the legal pages. `og:locale` is `en_US`. |
