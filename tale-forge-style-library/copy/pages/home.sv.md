# Copy deck: Home (/) · Svenska (Swedish)

The landing page: hero with the gold-gradient headline, the six-step "how it works" explainer (hero, friend, adventure, read and choose, four endings, the world remembers), a demo hero card for Alva, and a two-book bookshelf.
Every string below is verbatim from the hydrated DOM [source/rendered/dom__home__sv.html](../../source/rendered/dom__home__sv.html) (desktop, natt theme, cookie `tf_locale=sv`), in document order. The server HTML [source/html/home.sv.html](../../source/html/home.sv.html) was compared against it (section 4).
About 576 words of visible and assistive text. Translation notes and voice analysis: [../../analysis/10-copy-voice-and-tone.md](../../analysis/10-copy-voice-and-tone.md). The other language: [home.en.md](home.en.md).

## Contents

1. [Head and share metadata](#1-head-and-share-metadata)
2. [Body copy in reading order](#2-body-copy-in-reading-order)
3. [Client-side states](#3-client-side-states)
4. [Server HTML vs hydrated DOM](#4-server-html-vs-hydrated-dom)
5. [Screenshots](#5-screenshots)

## 1. Head and share metadata

| Field | Value |
|---|---|
| `<html lang>` | sv |
| `<title>` | Tale Forge |
| `description` | Riktiga bilderböcker, skapade för ditt barn. |
| `tf-release-sha` | 4be07efd68ad299089d33297742e56589f587460 |
| `og:title` | Tale Forge |
| `og:description` | Riktiga bilderböcker, skapade för ditt barn. |
| `og:site_name` | Tale Forge |
| `og:locale` | sv_SE |
| `og:image` | https://tale-forge.app/opengraph-image.png?opengraph-image.2xzm_0q_kwhgm.png |
| `og:image:type` | image/png |
| `og:image:width` | 1200 |
| `og:image:height` | 630 |
| `og:type` | website |
| `twitter:card` | summary_large_image |
| `twitter:title` | Tale Forge |
| `twitter:description` | Riktiga bilderböcker, skapade för ditt barn. |
| `twitter:image` | https://tale-forge.app/twitter-image.png?twitter-image.2xzm_0q_kwhgm.png |
| `twitter:image:type` | image/png |
| `twitter:image:width` | 1200 |
| `twitter:image:height` | 630 |
| `<link rel="manifest">` | /manifest.webmanifest |
| `<link rel="canonical">` | https://tale-forge.app |
| `<link rel="icon">` | /favicon.ico?favicon.0k8s-ucsp6yre.ico |
| `<link rel="icon">` | /icon.png?icon.1q_fj2hxfdn0a.png |
| `<link rel="apple-touch-icon">` | /apple-icon.png?apple-icon.1qwtxz8ono1wt.png |

No JSON-LD structured data on this page.

## 2. Body copy in reading order

Legend: `tag.class` is the element; **bold** marks `<b>`/`<strong>` or the gold gradient phrase `span.grad`; `[text](href)` is an inline link; `→` is a link target; " / " separates adjacent child elements with no space between them in the markup; flags in the tail say when CSS shows the text in capitals or when it is hidden from sight or from screen readers. The contact `mailto:` is shortened to `…@tale-forge.app` (it is a personal first-name mailbox; the full address is in the DOM file).
- `img` — alt="" (decorative) · src `/assets/nebula-hero.webp`
- `img` — alt="" (decorative) · src `/assets/morgon-aurora-desktop.webp`
- `a.skip-link` — Hoppa till innehållet · → `#main-content`

#### `nav`

- `a.logo` — Tale Forge · → `/` · translate="no" · UPPERCASE via CSS (3q17cp_jgfwol.pretty.css:696-710) · contains decorative img (alt="")
- `a` — Logga in · → `/login` · aria-label="Logga in"
- `a` — Priser · → `/uppgradera` · aria-label="Priser"
- `div.language-switcher` (wrapper) — aria-label="Byt språk" · role="group"
- `button` — SV · aria-pressed="true" · type="button"
- `button` — EN · aria-pressed="false" · type="button"
- `button.tt` — Natt / Morgon · aria-label="Byt tema" · role="switch" · aria-checked="false" · type="button"

#### `main#main-content`


#### `main#main-content › header.hero`

- `span.kicker` — Exempel: Alvas värld · 2 böcker
- `h1` — En värld som **minns henne**.
- `p.lede` — Den målade hjälten återvänder. Valen förändrar vad som händer, och senare böcker minns äventyren ni redan har delat.
- `a.btn.btn-primary` — Skapa er hjälte · → `/start`
- `span.cta-microcopy` — Första boken är gratis, inget kort behövs. Sedan 149 kr i månaden.
- `a.btn.btn-ghost` — Se hur det funkar · → `#sa-funkar-det`

#### `main#main-content › header.hero › div.fan`

- `a` — *(no visible text)* · → `/signup` · aria-label="Alva och fyraljuset i tornet" · contains decorative img (alt="")
- `a` — *(no visible text)* · → `/signup` · aria-label="Alva och filten vid elementet" · contains decorative img (alt="")

#### `header.hero › div.fan › div.badge`

- `b` — Sixten minns tornet
- `span` — från "Alva och fyraljuset"

#### `main#main-content › section#sa-funkar-det.reveal.in.hiw`

- `span.hiw-kicker` — Så fungerar det · UPPERCASE via CSS (3q17cp_jgfwol.pretty.css:2541-2553)
- `h2.hiw-headline` — Äventyr värda att prata om.
- `p.hiw-lede` — Från ett foto till en uppläst bilderbok med fyra olika slut. Så här går en kväll till.

#### `main#main-content › section#sa-funkar-det.reveal.in.hiw › ol.hiw-steps`

- `span.hiw-node` — 1 · aria-hidden (not announced)
- `h3` — Bygg er hjälte
- `p.hiw-step-copy` — Ladda upp en bild och välj det som gör ert barn till ert barn. Vi målar hjälten i bokens stil, och samma ansikte återkommer i varje scen.
- `p.hiw-micro` — Porträttet styr både bilderna och berättelsen.

#### `section#sa-funkar-det.reveal.in.hiw › ol.hiw-steps › div.glass.hiw-card.hiw-portrait-card`

- `img` — alt="Iris, den målade hjälten i exempelboken" · src `/landing/iris/hero-portrait.webp`
- `span.hiw-ai-chip` — Skapad med AI
- `span.hiw-node` — 2 · aria-hidden (not announced)
- `h3` — Ta med en vän
- `p.hiw-step-copy` — En bästa kompis, en kusin eller ett husdjur. Vänner från er vardag kliver in i boken och stannar kvar som en del av världen.
- `p.hiw-micro` — I Alvas värld är Noah och räven Sixten med i varje bok.

#### `section#sa-funkar-det.reveal.in.hiw › ol.hiw-steps › div.glass.hiw-card.hiw-friend-card`

- `img` — alt="" (decorative) · src `/assets/avatar-noah.jpg`
- `b` — Noah
- `span` — bästa kompisen · med i 2 böcker
- `img` — alt="" (decorative) · src `/assets/avatar-sixten.jpg`
- `b` — Sixten
- `span` — fjällräven · följer med i varje bok
- `div.hiw-invite-slot` — + · aria-hidden (not announced)
- `span.hiw-node` — 3 · aria-hidden (not announced)
- `h3` — Välj kvällens äventyr
- `p.hiw-step-copy` — Välj tema och känsla. Sedan skriver, målar och läser vi in hela boken på en gång. Det tar ungefär tio minuter, och det säger vi hellre ärligt än låtsas att det går på en sekund.
- `p.hiw-micro` — Lagom tid för tandborstning och pyjamas.

#### `section#sa-funkar-det.reveal.in.hiw › ol.hiw-steps › div.glass.hiw-card.hiw-adventure-card`

- `img.hiw-fan-card.hiw-fan-1` — alt="" (decorative) · src `/landing/cards/pick-1.webp` · aria-hidden (not announced)
- `img.hiw-fan-card.hiw-fan-2` — alt="" (decorative) · src `/landing/cards/pick-2.webp` · aria-hidden (not announced)
- `img.hiw-fan-card.hiw-fan-3` — alt="" (decorative) · src `/landing/cards/pick-3.webp` · aria-hidden (not announced)
- `span.hiw-bake-line` — Boken bakas. Ungefär tio minuter kvar.
- `span.hiw-node` — 4 · aria-hidden (not announced)
- `h3` — Läs och välj
- `p.hiw-step-copy` — Berättarrösten läser högt, sida för sida. Två gånger i varje bok stannar berättelsen: ert barn väljer, och valet ändrar det som händer sedan. På riktigt.
- `p.hiw-micro` — Inga låtsasval. Båda vägarna är skrivna, målade och inlästa.
- `button.hiw-play` — Hör berättarrösten · aria-pressed="false" · type="button"
- `span.hiw-voice-chip` — Morfar · contains decorative img (alt="")
- `audio` — 

#### `section#sa-funkar-det.reveal.in.hiw › ol.hiw-steps › div.glass.hiw-card.hiw-reader-mock`

- `img` — alt="Uppslag ur exempelboken, sidan före det första valet" · src `/landing/iris/scene-choice.webp`
- `p.hiw-mock-prose` — Iris gick in mellan fönsterbänken och mattan och lade ritpappret på ett lågt bord. Planen för den sparade platsen gällde inte längre.
- `span.hiw-choice` — Gå med Mossa till den gröna mattan.
- `span.hiw-choice` — Stanna och rita med det nya barnet i fönsterljuset.
- `span.hiw-node` — 5 · aria-hidden (not announced)
- `h3` — Fyra olika slut
- `p.hiw-step-copy` — Två val ger fyra vägar genom samma bok. Er kväll kan sluta på ett sätt, och samma bok kan sluta helt annorlunda hemma hos en annan familj. Läs igen, välj annorlunda och hitta en väg ni inte har sett.

#### `section#sa-funkar-det.reveal.in.hiw › ol.hiw-steps › div.hiw-map.glass.hiw-card`

- `p.hiw-visually-hidden` — Boken börjar likadant för alla. Vid två tillfällen väljer barnet mellan två vägar. Två val ger fyra olika slut. · screen-reader only (visually hidden)
- `svg.hiw-map-desktop > text.map-choice-label` — Val 1 · aria-hidden (not announced)
- `svg.hiw-map-desktop > text.map-choice-label` — Val 2 · aria-hidden (not announced)
- `svg.hiw-map-desktop > text.map-choice-label` — Val 2 · aria-hidden (not announced)
- `svg.hiw-map-desktop > text.map-num` — 1 · aria-hidden (not announced)
- `svg.hiw-map-desktop > text.map-num` — 2 · aria-hidden (not announced)
- `svg.hiw-map-desktop > text.map-num` — 3 · aria-hidden (not announced)
- `svg.hiw-map-desktop > text.map-num` — 4 · aria-hidden (not announced)
- `svg.hiw-map-mobile > text.map-num` — 1 · aria-hidden (not announced)
- `svg.hiw-map-mobile > text.map-num` — 2 · aria-hidden (not announced)
- `svg.hiw-map-mobile > text.map-num` — 3 · aria-hidden (not announced)
- `svg.hiw-map-mobile > text.map-num` — 4 · aria-hidden (not announced)
- `button.hiw-map-btn.hiw-map-btn-1` — *(no visible text)* · aria-label="Slut 1 av 4, visa vägen dit" · aria-pressed="true" · type="button"
- `button.hiw-map-btn.hiw-map-btn-2` — *(no visible text)* · aria-label="Slut 2 av 4, visa vägen dit" · aria-pressed="false" · type="button"
- `button.hiw-map-btn.hiw-map-btn-3` — *(no visible text)* · aria-label="Slut 3 av 4, visa vägen dit" · aria-pressed="false" · type="button"
- `button.hiw-map-btn.hiw-map-btn-4` — *(no visible text)* · aria-label="Slut 4 av 4, visa vägen dit" · aria-pressed="false" · type="button"
- `p.hiw-caption` — Kartan över exempelboken Iris och den sparade platsen. Varje prick är en sida, varje guldstjärna ett val, varje medaljong ett slut. Alla fyra finns på riktigt.
- `a.btn.btn-ghost` — Läs exempelboken · → `/share/iris-sparade-platsen`
- `span.hiw-node` — 6 · aria-hidden (not announced)
- `h3` — Världen minns
- `p.hiw-step-copy` — Nästa bok vet vem hjälten är, vilka vänner som var med och vilka platser ni har varit på. Ni fyller inte en hylla med lösa sagor. Ni bygger en värld.
- `p.hiw-micro` — Hjältar, vänner och platser följer med från bok till bok.

#### `section#sa-funkar-det.reveal.in.hiw › ol.hiw-steps › div.glass.hiw-card.hiw-memory-card`

- `img.hiw-cover.hiw-cover-next` — alt="" (decorative) · src `/landing/cover-next-book.webp`
- `img.hiw-cover.hiw-cover-1` — alt="" (decorative) · src `/assets/cover-tornet.webp`
- `img.hiw-cover.hiw-cover-2` — alt="" (decorative) · src `/assets/cover-filten.webp`
- `span.hiw-next-label` — nästa bok · UPPERCASE via CSS (3q17cp_jgfwol.pretty.css:3072-3087)
- `b` — Sixten minns tornet
- `span` — från "Alva och fyraljuset"
- `a.btn.btn-primary` — Skapa er hjälte · → `/start`
- `a.btn.btn-ghost` — Läs exempelboken · → `/share/iris-sparade-platsen`

#### `main#main-content › section.reveal.in`

- `h2` — Din hjälte
- `span.sec-chip` — barnens favorit
- `p` — Den som varje saga handlar om.

#### `main#main-content › section.reveal.in › div.glass.builder`

- `img` — alt="" (decorative) · src `/assets/cover-filten.webp`
- `a.fab` — *(no visible text)* · → `/login` · aria-label="Ändra utseende"
- `span` — Skapad med AI
- `div.builder-name` — Alva
- `span.trait.on` — Modig
- `span.trait.on` — Fnissig
- `span.trait.on` — Djurvän
- `span.trait` — Nyfiken
- `span.trait` — Envis
- `span.trait` — + Fler
- `a.upload` (wrapper) — → `/signup`
- `b` — Bli din egen hjälte
- `span` — Ladda upp en bild, så målar vi dig i bokens stil.

#### `main#main-content › section.reveal.in › div.glass.friends`

- `h3` — Ta med en vän
- `img` — alt="" (decorative) · src `/assets/avatar-noah.jpg`
- `b` — Noah
- `span` — bästa kompisen · med i 2 böcker
- `img` — alt="" (decorative) · src `/assets/avatar-sixten.jpg`
- `b` — Sixten
- `span` — fjällräven · följer med i varje bok
- `a.friend-add` — Lägg till en vän · → `/signup`

#### `main#main-content › section.reveal.in`

- `h2` — Bokhyllan
- `span.sec-chip` — 2 färdiga böcker
- `a.book` (wrapper) — → `/signup`
- `img` — alt="" (decorative) · src `/assets/cover-tornet.webp`
- `div.book-title` — Alva och fyraljuset i tornet
- `span.book-sub` — Stora känslor · UPPERCASE via CSS (3q17cp_jgfwol.pretty.css:1520-1531)
- `a.book` (wrapper) — → `/signup`
- `img` — alt="" (decorative) · src `/assets/cover-filten.webp`
- `div.book-title` — Alva och filten vid elementet
- `span.book-sub` — Mysigt äventyr · UPPERCASE via CSS (3q17cp_jgfwol.pretty.css:1520-1531)

#### `div.foot`

- `span` — Tale Forge, sagor som minns er värld.
- `span` — Beta · data-testid="beta-build-label"
- `span` — Version 16ab1756 · 26 sep. 2026 · data-testid="footer-version"
- `span` — Tale Forge AB, org.nr 559543-1122, Värnamo, Sverige
- `a` — Kontakt · → `mailto:…@tale-forge.app`
- `a` — Integritet · → `/integritet`
- `a` — Villkor · → `/villkor`

## 3. Client-side states

No client-side state changes the copy on this page beyond what is listed above (the theme toggle and language switch only swap labels already shown).

## 4. Server HTML vs hydrated DOM

Only in the hydrated DOM (added or changed by client JavaScript):

- `a` — Logga in · → `/login` · aria-label="Logga in"
- `a` — Priser · → `/uppgradera` · aria-label="Priser"
- `a` — Kontakt · → `mailto:…@tale-forge.app`

Only in the server HTML (replaced during hydration):

- `a` — Kontakt · → `/cdn-cgi/l/email-protection#8fe4eaf9e6e1cffbeee3eaa2e9e0fde8eaa1eeffff`

## 5. Screenshots

- [home__sv__morgon__desktop__fold.png](../../screenshots/pages/home/home__sv__morgon__desktop__fold.png)
- [home__sv__morgon__mobile__fold.png](../../screenshots/pages/home/home__sv__morgon__mobile__fold.png)
- [home__sv__morgon__tablet__fold.png](../../screenshots/pages/home/home__sv__morgon__tablet__fold.png)
- [home__sv__natt__desktop__fold.png](../../screenshots/pages/home/home__sv__natt__desktop__fold.png)
- [home__sv__natt__mobile__fold.png](../../screenshots/pages/home/home__sv__natt__mobile__fold.png)
- [home__sv__natt__tablet__fold.png](../../screenshots/pages/home/home__sv__natt__tablet__fold.png)
