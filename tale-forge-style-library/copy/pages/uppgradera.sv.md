# Copy deck: Upgrade / pricing (/uppgradera) · Svenska (Swedish)

The pricing page reached from the nav link "Priser" / "Pricing". It renders client-side from `UpgradePanel` in source/js/26ye0kuppitcn.js; the default state is yearly billing with only the Family plan visible.
Every string below is verbatim from the hydrated DOM [source/rendered/dom__uppgradera__sv.html](../../source/rendered/dom__uppgradera__sv.html) (desktop, natt theme, cookie `tf_locale=sv`), in document order. The server HTML [source/html/uppgradera.sv.html](../../source/html/uppgradera.sv.html) was compared against it (section 4).
About 138 words of visible and assistive text. Translation notes and voice analysis: [../../analysis/10-copy-voice-and-tone.md](../../analysis/10-copy-voice-and-tone.md). The other language: [uppgradera.en.md](uppgradera.en.md).

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
| `<title>` | Uppgradera |
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
| `<link rel="canonical">` | https://tale-forge.app/uppgradera |
| `<link rel="icon">` | /favicon.ico?favicon.0k8s-ucsp6yre.ico |
| `<link rel="icon">` | /icon.png?icon.1q_fj2hxfdn0a.png |
| `<link rel="apple-touch-icon">` | /apple-icon.png?apple-icon.1qwtxz8ono1wt.png |

No JSON-LD structured data on this page.

## 2. Body copy in reading order

Legend: `tag.class` is the element; **bold** marks `<b>`/`<strong>` or the emphasised h1 phrase `span.grad` (a solid accent colour, gold in natt and violet in morgon, not a CSS gradient); `[text](href)` is an inline link; `→` is a link target; " / " separates adjacent child elements with no space between them in the markup; flags in the tail say when CSS shows the text in capitals or when it is hidden from sight or from screen readers. The contact `mailto:` is shortened to `…@tale-forge.app` (it is a personal first-name mailbox; the full address is in the DOM file).
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


#### `main#main-content › section`


#### `main#main-content › section › div.glass`

- `h1.page-title` — Uppgradera
- `p` — Nya personliga böcker varje månad, i en värld som minns. Ingen bindningstid, avsluta när du vill.

#### `main#main-content › section › section.glass` — aria-labelledby="included-heading"

- `h2#included-heading` — Det här ingår
- `a.upgrade-sample-link` (wrapper) — → `/share/iris-sparade-platsen` · aria-label="Exempelbok: Öppna exempelboken"
- `img` — alt="Omslag till exempelboken Iris och den sparade platsen" · src `/_next/image?url=%2Fshare%2Firis-sparade-platsen%2Fassets%2Fcover.webp&w=3840&q=75`
- `figcaption.upgrade-sample-caption` — Exempelbok: Iris och den sparade platsen

#### `section › section.glass › ul.upgrade-proof-list`

- `li` — Personliga, illustrerade sagoböcker
- `li` — Uppläsning till varje berättelse
- `li` — Meningsfulla val som formar berättelsen
- `li` — Plats för upp till 4 barn med Familj och 30 i Skola
- `li` — Avsluta när du vill
- `button.trait` — Månadsvis · aria-pressed="false" · type="button"
- `button.trait.on` — Årsvis · aria-pressed="true" · type="button"

#### `main#main-content › section › div.glass`

- `h2` — Familj
- `p` — För familjen som vill fortsätta berätta tillsammans.
- `p` — 1490 kr per år
- `p` — 124 kr per månad vid årsbetalning

#### `section › div.glass › ul`

- `li` — 3 nya böcker varje månad, oanvända följer med
- `li` — Upp till 4 barn
- `p` — 14 dagar gratis, avsluta när du vill. Kort krävs.
- `button.btn.btn-primary` — Prova gratis i 14 dagar · type="button"
- `button.trait` — För skolor · aria-expanded="false" · type="button"

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

### State: `uppgradera-monthly-schools`

After pressing "Månadsvis/Monthly" and "För skolor/For schools": monthly prices and the School plan.
Screenshot: [../states/uppgradera-monthly-schools__sv.webp](../states/uppgradera-monthly-schools__sv.webp)

- `button.trait.on` — Månadsvis · aria-pressed="true" · type="button"
- `button.trait` — Årsvis · aria-pressed="false" · type="button"
- `p` — 149 kr per månad
- `h2` — Skola
- `p` — För klassrummet. Samma sagovärld, med plats för hela klassen.
- `p` — 249 kr per månad
- `li` — 6 nya böcker varje månad, oanvända följer med
- `li` — Upp till 30 barn
- `p` — Ingen bindningstid, avsluta när du vill.
- `button.btn.btn-primary` — Uppgradera till Skola · type="button"

## 4. Server HTML vs hydrated DOM

Only in the hydrated DOM (added or changed by client JavaScript):

- `a` — Logga in · → `/login` · aria-label="Logga in"
- `a` — Priser · → `/uppgradera` · aria-label="Priser"
- `a` — Kontakt · → `mailto:…@tale-forge.app`

Only in the server HTML (replaced during hydration):

- `a` — Kontakt · → `/cdn-cgi/l/email-protection#a6cdc3d0cfc8e6d2c7cac38bc0c9d4c1c388c7d6d6`

## 5. Screenshots

- [uppgradera__sv__morgon__desktop__fold.png](../../screenshots/pages/uppgradera/uppgradera__sv__morgon__desktop__fold.png)
- [uppgradera__sv__morgon__mobile__fold.png](../../screenshots/pages/uppgradera/uppgradera__sv__morgon__mobile__fold.png)
- [uppgradera__sv__natt__desktop__fold.png](../../screenshots/pages/uppgradera/uppgradera__sv__natt__desktop__fold.png)
- [uppgradera__sv__natt__mobile__fold.png](../../screenshots/pages/uppgradera/uppgradera__sv__natt__mobile__fold.png)
