# Copy deck: Start (/start) · English

Entry to the create flow. Server-rendered state is screen s0 (pitch + two CTAs); the client then walks through four numbered steps. Later steps that need uploads or an account are listed from the JS dictionaries in [../app-strings.md](../app-strings.md).
Every string below is verbatim from the hydrated DOM [source/rendered/dom__start__en.html](../../source/rendered/dom__start__en.html) (desktop, natt theme, cookie `tf_locale=en`), in document order. The server HTML [source/html/start.en.html](../../source/html/start.en.html) was compared against it (section 4).
About 94 words of visible and assistive text. Translation notes and voice analysis: [../../analysis/10-copy-voice-and-tone.md](../../analysis/10-copy-voice-and-tone.md). The other language: [start.sv.md](start.sv.md).

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
| `<link rel="canonical">` | https://tale-forge.app/start |
| `<link rel="icon">` | /favicon.ico?favicon.0k8s-ucsp6yre.ico |
| `<link rel="icon">` | /icon.png?icon.1q_fj2hxfdn0a.png |
| `<link rel="apple-touch-icon">` | /apple-icon.png?apple-icon.1qwtxz8ono1wt.png |

No JSON-LD structured data on this page.

## 2. Body copy in reading order

Legend: `tag.class` is the element; **bold** marks `<b>`/`<strong>` or the emphasised h1 phrase `span.grad` (a solid accent colour, gold in natt and violet in morgon, not a CSS gradient); `[text](href)` is an inline link; `→` is a link target; " / " separates adjacent child elements with no space between them in the markup; flags in the tail say when CSS shows the text in capitals or when it is hidden from sight or from screen readers. The contact `mailto:` is shortened to `…@tale-forge.app` (it is a personal first-name mailbox; the full address is in the DOM file).
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


#### `main#main-content › section.start-screen` — data-testid="start-screen-s0"


#### `main#main-content › section.start-screen › div.hero`

- `div.kicker` — Real picture books, read aloud
- `h1` — Tonight the hero is **your child**.
- `p.lede` — Tale Forge writes, paints and narrates a real picture book where your child is the main character. You see the portrait in a couple of minutes, and the first book is free.
- `button.btn.btn-primary` — Create your hero · type="button"
- `button.btn.btn-ghost` — Read a sample book first · aria-expanded="false" · type="button"

#### `section.start-screen › div.hero › div.fan` — aria-hidden (not announced)

- `img` — alt="" (decorative) · src `/assets/cover-filten.webp` · aria-hidden (not announced)
- `img` — alt="" (decorative) · src `/assets/cover-tornet.webp` · aria-hidden (not announced)

#### `div.hero › div.fan › div.badge` — aria-hidden (not announced)

- `b` — Sample book · aria-hidden (not announced)
- `span` — Iris och den sparade platsen · Swedish · aria-hidden (not announced)

#### `div.foot`

- `span` — Tale Forge, storybooks that remember your world.
- `span` — Beta · data-testid="beta-build-label"
- `span` — Version 16ab1756 · 26 Sep 2026 · data-testid="footer-version"
- `span` — Tale Forge AB, reg. no. 559543-1122, Varnamo, Sweden
- `a` — Contact · → `mailto:…@tale-forge.app`
- `a` — Privacy · → `/integritet`
- `a` — Terms · → `/villkor`

## 3. Client-side states

Captured live on 2026-10-09 with Playwright (desktop 1440×900, natt). Only client-side UI was driven: no form was submitted, nothing was uploaded, no account was created. Each list shows only the strings that are **new** compared with the default state above.

### State: `start-s0-gallery`

After clicking "Read a sample book first": the sample-book gallery opens under the CTAs.
Screenshot: [../states/start-s0-gallery__en.webp](../states/start-s0-gallery__en.webp)

- `a` — [img alt="Cover of the Swedish sample book Iris och den sparade platsen"] Iris och den sparade platsen · Read the Swedish sample · → `/share/iris-sparade-platsen` · aria-label="Read the Swedish sample: Iris och den sparade platsen" · contains img alt="Cover of the Swedish sample book Iris och den sparade platsen"

### State: `start-s1`

After clicking the primary CTA: step 1 of 4 (name, age band, pronoun).
Screenshot: [../states/start-s1__en.webp](../states/start-s1__en.webp)

- `button` — *(no visible text)* · aria-label="Back" · type="button"
- `b` — Step 1 of 4 · The hero
- `span` — No account and no card yet. You start with your child.
- `h2` — Who becomes the hero?
- `input.field` — placeholder="Your child's name" · type="text" · autocomplete="off"
- `button.trait` — 4 to 5 years · aria-pressed="false" · type="button"
- `button.trait.on` — 6 to 7 years · aria-pressed="true" · type="button"
- `button.trait` — 8 to 9 years · aria-pressed="false" · type="button"
- `p` — Which word should the story use?
- `button.trait` — He · aria-pressed="false" · type="button"
- `button.trait` — She · aria-pressed="false" · type="button"
- `button.btn.btn-primary` — Next · type="button"

### State: `start-s1-moderation-email`

Step 1 with an email address typed as the name and "Vidare/Next" pressed: the client-side moderation message.
Screenshot: [../states/start-s1-moderation-email__en.webp](../states/start-s1-moderation-email__en.webp)

- `button` — *(no visible text)* · aria-label="Back" · type="button"
- `b` — Step 1 of 4 · The hero
- `span` — No account and no card yet. You start with your child.
- `h2` — Who becomes the hero?
- `input.field` — placeholder="Your child's name" · value="a@b.se" · type="text" · autocomplete="off"
- `p.field-error` — Let's keep our stories kind and safe! Please don't include email addresses. · role="alert"
- `button.trait` — 4 to 5 years · aria-pressed="false" · type="button"
- `button.trait.on` — 6 to 7 years · aria-pressed="true" · type="button"
- `button.trait` — 8 to 9 years · aria-pressed="false" · type="button"
- `p` — Which word should the story use?
- `button.trait` — He · aria-pressed="false" · type="button"
- `button.trait.on` — She · aria-pressed="true" · type="button"
- `button.btn.btn-primary` — Next · type="button"

### State: `start-s2`

Step 2 of 4 (photo) after a valid name. Nothing was uploaded..
Screenshot: [../states/start-s2__en.webp](../states/start-s2__en.webp)

- `button` — *(no visible text)* · aria-label="Back" · type="button"
- `b` — Step 2 of 4 · The photo
- `span` — One photo is enough for the portrait, and skipping is fine.
- `h2` — Make Iris the hero.
- `label` — I am the child's parent or guardian and I accept the privacy notice. · for="start-attest"
- `a` — Read the privacy notice · → `/integritet`
- `input` — aria-label="Choose a photo" · type="file" · data-testid="start-photo-input"
- `b` — Choose a photo
- `span` — The face is enough, we paint the rest.
- `span` — The photo is only used to paint the portrait. It never trains any AI, and you can delete it whenever you like.
- `button.btn.btn-primary` — Next · type="button"
- `button.btn.btn-ghost` — Skip, paint a hero for us · type="button"

## 4. Server HTML vs hydrated DOM

Only in the hydrated DOM (added or changed by client JavaScript):

- `a` — Login · → `/login` · aria-label="Login"
- `a` — Pricing · → `/uppgradera` · aria-label="Pricing"
- `a` — Contact · → `mailto:…@tale-forge.app`

Only in the server HTML (replaced during hydration):

- `a` — Contact · → `/cdn-cgi/l/email-protection#49222c3f2027093d28252c642f263b2e2c67283939`

## 5. Screenshots

- [start__en__morgon__desktop__fold.png](../../screenshots/pages/start/start__en__morgon__desktop__fold.png)
- [start__en__morgon__mobile__fold.png](../../screenshots/pages/start/start__en__morgon__mobile__fold.png)
- [start__en__natt__desktop__fold.png](../../screenshots/pages/start/start__en__natt__desktop__fold.png)
- [start__en__natt__mobile__fold.png](../../screenshots/pages/start/start__en__natt__mobile__fold.png)
