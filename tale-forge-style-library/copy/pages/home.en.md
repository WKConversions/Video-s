# Copy deck: Home (/) · English

The landing page: hero with the gold-gradient headline, the six-step "how it works" explainer (hero, friend, adventure, read and choose, four endings, the world remembers), a demo hero card for Alva, and a two-book bookshelf.
Every string below is verbatim from the hydrated DOM [source/rendered/dom__home__en.html](../../source/rendered/dom__home__en.html) (desktop, natt theme, cookie `tf_locale=en`), in document order. The server HTML [source/html/home.en.html](../../source/html/home.en.html) was compared against it (section 4).
About 621 words of visible and assistive text. Translation notes and voice analysis: [../../analysis/10-copy-voice-and-tone.md](../../analysis/10-copy-voice-and-tone.md). The other language: [home.sv.md](home.sv.md).

## Contents

1. [Head and share metadata](#1-head-and-share-metadata)
2. [Body copy in reading order](#2-body-copy-in-reading-order)
3. [Client-side states](#3-client-side-states)
4. [Server HTML vs hydrated DOM](#4-server-html-vs-hydrated-dom)
5. [Screenshots](#5-screenshots)

## 1. Head and share metadata

| Field | Value |
|---|---|
| `<html lang>` | en |
| `<title>` | Tale Forge |
| `description` | Real picture books, made for your child. |
| `tf-release-sha` | 4be07efd68ad299089d33297742e56589f587460 |
| `og:title` | Tale Forge |
| `og:description` | Real picture books, made for your child. |
| `og:site_name` | Tale Forge |
| `og:locale` | en_US |
| `og:image` | https://tale-forge.app/opengraph-image.png?opengraph-image.2xzm_0q_kwhgm.png |
| `og:image:type` | image/png |
| `og:image:width` | 1200 |
| `og:image:height` | 630 |
| `og:type` | website |
| `twitter:card` | summary_large_image |
| `twitter:title` | Tale Forge |
| `twitter:description` | Real picture books, made for your child. |
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
- `a.skip-link` — Skip to content · → `#main-content`

#### `nav`

- `a.logo` — Tale Forge · → `/` · translate="no" · UPPERCASE via CSS (3q17cp_jgfwol.pretty.css:696-710) · contains decorative img (alt="")
- `a` — Login · → `/login` · aria-label="Login"
- `a` — Pricing · → `/uppgradera` · aria-label="Pricing"
- `div.language-switcher` (wrapper) — aria-label="Change language" · role="group"
- `button` — SV · aria-pressed="false" · type="button"
- `button` — EN · aria-pressed="true" · type="button"
- `button.tt` — Night / Morning · aria-label="Switch theme" · role="switch" · aria-checked="false" · type="button"

#### `main#main-content`


#### `main#main-content › header.hero`

- `span.kicker` — Demo: Alva's world · 2 books
- `h1` — A world that **remembers her**.
- `p.lede` — The painted hero returns. Choices change what happens, and later books remember the adventures you have already shared.
- `a.btn.btn-primary` — Create your hero · → `/start`
- `span.cta-microcopy` — The first book is free, no card needed. After that $14.99 a month.
- `a.btn.btn-ghost` — See how it works · → `#sa-funkar-det`

#### `main#main-content › header.hero › div.fan`

- `a` — *(no visible text)* · → `/signup` · aria-label="Alva and the Fourth Candle in the Tower" · contains decorative img (alt="")
- `a` — *(no visible text)* · → `/signup` · aria-label="Alva and the Blanket by the Radiator" · contains decorative img (alt="")

#### `header.hero › div.fan › div.badge`

- `b` — Sixten remembers the tower
- `span` — from "Alva and the Fourth Candle"

#### `main#main-content › section#sa-funkar-det.reveal.in.hiw`

- `span.hiw-kicker` — How it works · UPPERCASE via CSS (3q17cp_jgfwol.pretty.css:2541-2553)
- `h2.hiw-headline` — Adventures worth talking about.
- `p.hiw-lede` — From one photo to a narrated picture book with four different endings. Here is how an evening works.

#### `main#main-content › section#sa-funkar-det.reveal.in.hiw › ol.hiw-steps`

- `span.hiw-node` — 1 · aria-hidden (not announced)
- `h3` — Build your hero
- `p.hiw-step-copy` — Upload a photo and pick what makes your child your child. We paint the hero in the book's style, and the same face returns in every scene.
- `p.hiw-micro` — The portrait shapes both the pictures and the story.

#### `section#sa-funkar-det.reveal.in.hiw › ol.hiw-steps › div.glass.hiw-card.hiw-portrait-card`

- `img` — alt="Iris, the painted hero of the sample book" · src `/landing/iris/hero-portrait.webp`
- `span.hiw-ai-chip` — Created with AI
- `span.hiw-node` — 2 · aria-hidden (not announced)
- `h3` — Bring a friend
- `p.hiw-step-copy` — A best friend, a cousin, or a pet. Friends from your everyday life step into the book and stay on as part of its world.
- `p.hiw-micro` — In Alva's world, Noah and Sixten the fox are in every book.

#### `section#sa-funkar-det.reveal.in.hiw › ol.hiw-steps › div.glass.hiw-card.hiw-friend-card`

- `img` — alt="" (decorative) · src `/assets/avatar-noah.jpg`
- `b` — Noah
- `span` — best friend · in 2 books
- `img` — alt="" (decorative) · src `/assets/avatar-sixten.jpg`
- `b` — Sixten
- `span` — the mountain fox · comes along in every book
- `div.hiw-invite-slot` — + · aria-hidden (not announced)
- `span.hiw-node` — 3 · aria-hidden (not announced)
- `h3` — Pick tonight's adventure
- `p.hiw-step-copy` — Pick tonight's theme and mood. Then we write, paint, and narrate the whole book in one go. It takes about ten minutes, and we would rather say that honestly than pretend it takes a second.
- `p.hiw-micro` — Just enough time for toothbrushing and pajamas.

#### `section#sa-funkar-det.reveal.in.hiw › ol.hiw-steps › div.glass.hiw-card.hiw-adventure-card`

- `img.hiw-fan-card.hiw-fan-1` — alt="" (decorative) · src `/landing/cards/pick-1.webp` · aria-hidden (not announced)
- `img.hiw-fan-card.hiw-fan-2` — alt="" (decorative) · src `/landing/cards/pick-2.webp` · aria-hidden (not announced)
- `img.hiw-fan-card.hiw-fan-3` — alt="" (decorative) · src `/landing/cards/pick-3.webp` · aria-hidden (not announced)
- `span.hiw-bake-line` — The book is baking. About ten minutes to go.
- `span.hiw-node` — 4 · aria-hidden (not announced)
- `h3` — Read and choose
- `p.hiw-step-copy` — The narrator reads aloud, page by page. Twice in every book the story stops: your child chooses, and the choice changes what happens next. For real.
- `p.hiw-micro` — No pretend choices. Both paths are written, painted, and narrated.
- `button.hiw-play` — Hear the narrator · aria-pressed="false" · type="button"
- `span.hiw-voice-chip` — Grandpa Erik · contains decorative img (alt="")
- `audio` — 

#### `section#sa-funkar-det.reveal.in.hiw › ol.hiw-steps › div.glass.hiw-card.hiw-reader-mock`

- `img` — alt="A spread from the sample book, the page before the first choice" · src `/landing/iris/scene-choice.webp`
- `p.hiw-mock-prose` — Iris stepped between the windowsill and the rug and placed the drawing paper on a low table. The plan for the saved place no longer applied.
- `span.hiw-choice` — Go with Mossa to the green rug.
- `span.hiw-choice` — Stay and draw with the new child in the window light.
- `span.hiw-node` — 5 · aria-hidden (not announced)
- `h3` — Four different endings
- `p.hiw-step-copy` — Two choices make four paths through the same book. Your evening can end one way, and the same book can end differently in another family's home. Read it again, choose differently, and find a path you have not seen.

#### `section#sa-funkar-det.reveal.in.hiw › ol.hiw-steps › div.hiw-map.glass.hiw-card`

- `p.hiw-visually-hidden` — The book starts the same for everyone. At two points the child chooses between two paths. Two choices make four different endings. · screen-reader only (visually hidden)
- `svg.hiw-map-desktop > text.map-choice-label` — Choice 1 · aria-hidden (not announced)
- `svg.hiw-map-desktop > text.map-choice-label` — Choice 2 · aria-hidden (not announced)
- `svg.hiw-map-desktop > text.map-choice-label` — Choice 2 · aria-hidden (not announced)
- `svg.hiw-map-desktop > text.map-num` — 1 · aria-hidden (not announced)
- `svg.hiw-map-desktop > text.map-num` — 2 · aria-hidden (not announced)
- `svg.hiw-map-desktop > text.map-num` — 3 · aria-hidden (not announced)
- `svg.hiw-map-desktop > text.map-num` — 4 · aria-hidden (not announced)
- `svg.hiw-map-mobile > text.map-num` — 1 · aria-hidden (not announced)
- `svg.hiw-map-mobile > text.map-num` — 2 · aria-hidden (not announced)
- `svg.hiw-map-mobile > text.map-num` — 3 · aria-hidden (not announced)
- `svg.hiw-map-mobile > text.map-num` — 4 · aria-hidden (not announced)
- `button.hiw-map-btn.hiw-map-btn-1` — *(no visible text)* · aria-label="Ending 1 of 4, show the path there" · aria-pressed="true" · type="button"
- `button.hiw-map-btn.hiw-map-btn-2` — *(no visible text)* · aria-label="Ending 2 of 4, show the path there" · aria-pressed="false" · type="button"
- `button.hiw-map-btn.hiw-map-btn-3` — *(no visible text)* · aria-label="Ending 3 of 4, show the path there" · aria-pressed="false" · type="button"
- `button.hiw-map-btn.hiw-map-btn-4` — *(no visible text)* · aria-label="Ending 4 of 4, show the path there" · aria-pressed="false" · type="button"
- `p.hiw-caption` — The map of the sample book Iris and the Saved Place. Every dot is a page, every gold star a choice, every medallion an ending. All four really exist.
- `a.btn.btn-ghost` — Read the sample book · → `/share/iris-sparade-platsen`
- `span.hiw-node` — 6 · aria-hidden (not announced)
- `h3` — The world remembers
- `p.hiw-step-copy` — The next book knows who the hero is, which friends came along, and the places you have been. You are not filling a shelf with loose stories. You are building a world.
- `p.hiw-micro` — Heroes, friends, and places carry over from book to book.

#### `section#sa-funkar-det.reveal.in.hiw › ol.hiw-steps › div.glass.hiw-card.hiw-memory-card`

- `img.hiw-cover.hiw-cover-next` — alt="" (decorative) · src `/landing/cover-next-book.webp`
- `img.hiw-cover.hiw-cover-1` — alt="" (decorative) · src `/assets/cover-tornet.webp`
- `img.hiw-cover.hiw-cover-2` — alt="" (decorative) · src `/assets/cover-filten.webp`
- `span.hiw-next-label` — next book · UPPERCASE via CSS (3q17cp_jgfwol.pretty.css:3072-3087)
- `b` — Sixten remembers the tower
- `span` — from "Alva and the Fourth Candle"
- `a.btn.btn-primary` — Create your hero · → `/start`
- `a.btn.btn-ghost` — Read the sample book · → `/share/iris-sparade-platsen`

#### `main#main-content › section.reveal.in`

- `h2` — Your hero
- `span.sec-chip` — the family favorite
- `p` — The one every story is about.

#### `main#main-content › section.reveal.in › div.glass.builder`

- `img` — alt="" (decorative) · src `/assets/cover-filten.webp`
- `a.fab` — *(no visible text)* · → `/login` · aria-label="Change appearance"
- `span` — Made with AI
- `div.builder-name` — Alva
- `span.trait.on` — Brave
- `span.trait.on` — Giggly
- `span.trait.on` — Animal lover
- `span.trait` — Curious
- `span.trait` — Stubborn
- `span.trait` — + More
- `a.upload` (wrapper) — → `/signup`
- `b` — Become your own hero
- `span` — Upload a photo, and we paint you into the book's style.

#### `main#main-content › section.reveal.in › div.glass.friends`

- `h3` — Bring a friend
- `img` — alt="" (decorative) · src `/assets/avatar-noah.jpg`
- `b` — Noah
- `span` — best friend · in 2 books
- `img` — alt="" (decorative) · src `/assets/avatar-sixten.jpg`
- `b` — Sixten
- `span` — the mountain fox · comes along in every book
- `a.friend-add` — Add a friend · → `/signup`

#### `main#main-content › section.reveal.in`

- `h2` — The bookshelf
- `span.sec-chip` — 2 finished books
- `a.book` (wrapper) — → `/signup`
- `img` — alt="" (decorative) · src `/assets/cover-tornet.webp`
- `div.book-title` — Alva and the Fourth Candle in the Tower
- `span.book-sub` — Big feelings · UPPERCASE via CSS (3q17cp_jgfwol.pretty.css:1520-1531)
- `a.book` (wrapper) — → `/signup`
- `img` — alt="" (decorative) · src `/assets/cover-filten.webp`
- `div.book-title` — Alva and the Blanket by the Radiator
- `span.book-sub` — Cozy adventure · UPPERCASE via CSS (3q17cp_jgfwol.pretty.css:1520-1531)

#### `div.foot`

- `span` — Tale Forge, storybooks that remember your world.
- `span` — Beta · data-testid="beta-build-label"
- `span` — Version 16ab1756 · 26 Sep 2026 · data-testid="footer-version"
- `span` — Tale Forge AB, reg. no. 559543-1122, Varnamo, Sweden
- `a` — Contact · → `mailto:…@tale-forge.app`
- `a` — Privacy · → `/integritet`
- `a` — Terms · → `/villkor`

## 3. Client-side states

No client-side state changes the copy on this page beyond what is listed above (the theme toggle and language switch only swap labels already shown).

## 4. Server HTML vs hydrated DOM

Only in the hydrated DOM (added or changed by client JavaScript):

- `a` — Login · → `/login` · aria-label="Login"
- `a` — Pricing · → `/uppgradera` · aria-label="Pricing"
- `a` — Contact · → `mailto:…@tale-forge.app`

Only in the server HTML (replaced during hydration):

- `a` — Contact · → `/cdn-cgi/l/email-protection#87ece2f1eee9c7f3e6ebe2aae1e8f5e0e2a9e6f7f7`

## 5. Screenshots

- [home__en__morgon__desktop__fold.png](../../screenshots/pages/home/home__en__morgon__desktop__fold.png)
- [home__en__morgon__mobile__fold.png](../../screenshots/pages/home/home__en__morgon__mobile__fold.png)
- [home__en__morgon__tablet__fold.png](../../screenshots/pages/home/home__en__morgon__tablet__fold.png)
- [home__en__natt__desktop__fold.png](../../screenshots/pages/home/home__en__natt__desktop__fold.png)
- [home__en__natt__mobile__fold.png](../../screenshots/pages/home/home__en__natt__mobile__fold.png)
- [home__en__natt__tablet__fold.png](../../screenshots/pages/home/home__en__natt__tablet__fold.png)
