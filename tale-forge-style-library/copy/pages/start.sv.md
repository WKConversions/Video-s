# Copy deck: Start (/start) · Svenska (Swedish)

Entry to the create flow. Server-rendered state is screen s0 (pitch + two CTAs); the client then walks through four numbered steps. Later steps that need uploads or an account are listed from the JS dictionaries in [../app-strings.md](../app-strings.md).
Every string below is verbatim from the hydrated DOM [source/rendered/dom__start__sv.html](../../source/rendered/dom__start__sv.html) (desktop, natt theme, cookie `tf_locale=sv`), in document order. The server HTML [source/html/start.sv.html](../../source/html/start.sv.html) was compared against it (section 4).
About 88 words of visible and assistive text. Translation notes and voice analysis: [../../analysis/10-copy-voice-and-tone.md](../../analysis/10-copy-voice-and-tone.md). The other language: [start.en.md](start.en.md).

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
| `<link rel="canonical">` | https://tale-forge.app/start |
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


#### `main#main-content › section.start-screen` — data-testid="start-screen-s0"


#### `main#main-content › section.start-screen › div.hero`

- `div.kicker` — Riktiga bilderböcker, upplästa på svenska
- `h1` — Ikväll är hjälten **ert barn**.
- `p.lede` — Tale Forge skriver, målar och läser in en riktig bilderbok där ert barn är huvudpersonen. Porträttet ser ni om ett par minuter, den första boken är gratis.
- `button.btn.btn-primary` — Skapa er hjälte · type="button"
- `button.btn.btn-ghost` — Läs en exempelbok först · aria-expanded="false" · type="button"

#### `section.start-screen › div.hero › div.fan` — aria-hidden (not announced)

- `img` — alt="" (decorative) · src `/assets/cover-filten.webp` · aria-hidden (not announced)
- `img` — alt="" (decorative) · src `/assets/cover-tornet.webp` · aria-hidden (not announced)

#### `div.hero › div.fan › div.badge` — aria-hidden (not announced)

- `b` — Exempelbok · aria-hidden (not announced)
- `span` — Iris och den sparade platsen · på svenska · aria-hidden (not announced)

#### `div.foot`

- `span` — Tale Forge, sagor som minns er värld.
- `span` — Beta · data-testid="beta-build-label"
- `span` — Version 16ab1756 · 26 sep. 2026 · data-testid="footer-version"
- `span` — Tale Forge AB, org.nr 559543-1122, Värnamo, Sverige
- `a` — Kontakt · → `mailto:…@tale-forge.app`
- `a` — Integritet · → `/integritet`
- `a` — Villkor · → `/villkor`

## 3. Client-side states

Captured live on 2026-10-09 with Playwright (desktop 1440×900, natt). Only client-side UI was driven: no form was submitted, nothing was uploaded, no account was created. Each list shows only the strings that are **new** compared with the default state above.

### State: `start-s0-gallery`

After clicking "Läs en exempelbok först": the sample-book gallery opens under the CTAs.
Screenshot: [../states/start-s0-gallery__sv.png](../states/start-s0-gallery__sv.png)

- `a` — [img alt="Omslag till exempelboken Iris och den sparade platsen"] Iris och den sparade platsen · Läs exempelboken · → `/share/iris-sparade-platsen` · aria-label="Läs exempelboken: Iris och den sparade platsen" · contains img alt="Omslag till exempelboken Iris och den sparade platsen"

### State: `start-s1`

After clicking the primary CTA: step 1 of 4 (name, age band, pronoun).
Screenshot: [../states/start-s1__sv.png](../states/start-s1__sv.png)

- `button` — *(no visible text)* · aria-label="Tillbaka" · type="button"
- `b` — Steg 1 av 4 · Hjälten
- `span` — Inget konto och inget kort ännu. Ni börjar med barnet.
- `h2` — Vem blir hjälten?
- `input.field` — placeholder="Barnets namn" · type="text" · autocomplete="off"
- `button.trait` — 4 till 5 år · aria-pressed="false" · type="button"
- `button.trait.on` — 6 till 7 år · aria-pressed="true" · type="button"
- `button.trait` — 8 till 9 år · aria-pressed="false" · type="button"
- `p` — Vilket ord ska sagan använda?
- `button.trait` — Han · aria-pressed="false" · type="button"
- `button.trait` — Hon · aria-pressed="false" · type="button"
- `button.btn.btn-primary` — Vidare · type="button"

### State: `start-s1-moderation-email`

Step 1 with an email address typed as the name and "Vidare/Next" pressed: the client-side moderation message.
Screenshot: [../states/start-s1-moderation-email__sv.png](../states/start-s1-moderation-email__sv.png)

- `button` — *(no visible text)* · aria-label="Tillbaka" · type="button"
- `b` — Steg 1 av 4 · Hjälten
- `span` — Inget konto och inget kort ännu. Ni börjar med barnet.
- `h2` — Vem blir hjälten?
- `input.field` — placeholder="Barnets namn" · value="a@b.se" · type="text" · autocomplete="off"
- `p.field-error` — Vi håller sagorna snälla och trygga. Ta inte med e-postadresser. · role="alert"
- `button.trait` — 4 till 5 år · aria-pressed="false" · type="button"
- `button.trait.on` — 6 till 7 år · aria-pressed="true" · type="button"
- `button.trait` — 8 till 9 år · aria-pressed="false" · type="button"
- `p` — Vilket ord ska sagan använda?
- `button.trait` — Han · aria-pressed="false" · type="button"
- `button.trait.on` — Hon · aria-pressed="true" · type="button"
- `button.btn.btn-primary` — Vidare · type="button"

### State: `start-s2`

Step 2 of 4 (photo) after a valid name. Nothing was uploaded..
Screenshot: [../states/start-s2__sv.png](../states/start-s2__sv.png)

- `button` — *(no visible text)* · aria-label="Tillbaka" · type="button"
- `b` — Steg 2 av 4 · Fotot
- `span` — Ett foto räcker för porträttet, och det går bra att hoppa över.
- `h2` — Gör Iris till hjälten.
- `label` — Jag är barnets förälder eller vårdnadshavare och godkänner integritetspolicyn. · for="start-attest"
- `a` — Läs integritetspolicyn · → `/integritet`
- `input` — aria-label="Välj ett foto" · type="file" · data-testid="start-photo-input"
- `b` — Välj ett foto
- `span` — Ansiktet räcker, resten målar vi.
- `span` — Fotot används bara för att måla porträttet. Det tränar aldrig någon AI, och ni kan radera det när som helst.
- `button.btn.btn-primary` — Vidare · type="button"
- `button.btn.btn-ghost` — Hoppa över, måla en hjälte åt oss · type="button"

## 4. Server HTML vs hydrated DOM

Only in the hydrated DOM (added or changed by client JavaScript):

- `a` — Logga in · → `/login` · aria-label="Logga in"
- `a` — Priser · → `/uppgradera` · aria-label="Priser"
- `a` — Kontakt · → `mailto:…@tale-forge.app`

Only in the server HTML (replaced during hydration):

- `a` — Kontakt · → `/cdn-cgi/l/email-protection#c0aba5b6a9ae80b4a1aca5eda6afb2a7a5eea1b0b0`

## 5. Screenshots

- [start__sv__morgon__desktop__fold.png](../../screenshots/pages/start/start__sv__morgon__desktop__fold.png)
- [start__sv__morgon__mobile__fold.png](../../screenshots/pages/start/start__sv__morgon__mobile__fold.png)
- [start__sv__natt__desktop__fold.png](../../screenshots/pages/start/start__sv__natt__desktop__fold.png)
- [start__sv__natt__mobile__fold.png](../../screenshots/pages/start/start__sv__natt__mobile__fold.png)
