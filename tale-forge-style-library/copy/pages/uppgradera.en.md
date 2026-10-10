# Copy deck: Upgrade / pricing (/uppgradera) · English

The pricing page reached from the nav link "Priser" / "Pricing". It renders client-side from `UpgradePanel` in source/js/26ye0kuppitcn.js; the default state is yearly billing with only the Family plan visible.
Every string below is verbatim from the hydrated DOM [source/rendered/dom__uppgradera__en.html](../../source/rendered/dom__uppgradera__en.html) (desktop, natt theme, cookie `tf_locale=en`), in document order. The server HTML [source/html/uppgradera.en.html](../../source/html/uppgradera.en.html) was compared against it (section 4).
About 136 words of visible and assistive text. Translation notes and voice analysis: [../../analysis/10-copy-voice-and-tone.md](../../analysis/10-copy-voice-and-tone.md). The other language: [uppgradera.sv.md](uppgradera.sv.md).

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
| `<title>` | Upgrade |
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
| `<link rel="canonical">` | https://tale-forge.app/uppgradera |
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


#### `main#main-content › section`


#### `main#main-content › section › div.glass`

- `h1.page-title` — Upgrade
- `p` — New personalized books every month, in a world that remembers. No lock-in, cancel anytime.

#### `main#main-content › section › section.glass` — aria-labelledby="included-heading"

- `h2#included-heading` — What is included
- `a.upgrade-sample-link` (wrapper) — → `/share/iris-sparade-platsen` · aria-label="Sample book: Open the sample book"
- `img` — alt="Cover of the Swedish sample book Iris och den sparade platsen" · src `/_next/image?url=%2Fshare%2Firis-sparade-platsen%2Fassets%2Fcover.webp&w=3840&q=75`
- `figcaption.upgrade-sample-caption` — Sample book: Iris och den sparade platsen

#### `section › section.glass › ul.upgrade-proof-list`

- `li` — Personalized illustrated storybooks
- `li` — Narration for every story
- `li` — Meaningful choices that shape the story
- `li` — Space for up to 4 children with Family and 30 with School
- `li` — Cancel anytime
- `button.trait` — Monthly · aria-pressed="false" · type="button"
- `button.trait.on` — Yearly · aria-pressed="true" · type="button"

#### `main#main-content › section › div.glass`

- `h2` — Family
- `p` — For the family that wants to keep telling stories together.
- `p` — $149.00 per year
- `p` — $12.42 per month billed yearly

#### `section › div.glass › ul`

- `li` — 3 new books every month, unused roll over
- `li` — Up to 4 children
- `p` — 14 days free, cancel anytime. Card required.
- `button.btn.btn-primary` — Try free for 14 days · type="button"
- `button.trait` — For schools · aria-expanded="false" · type="button"

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

### State: `uppgradera-monthly-schools`

After pressing "Månadsvis/Monthly" and "För skolor/For schools": monthly prices and the School plan.
Screenshot: [../states/uppgradera-monthly-schools__en.webp](../states/uppgradera-monthly-schools__en.webp)

- `button.trait.on` — Monthly · aria-pressed="true" · type="button"
- `button.trait` — Yearly · aria-pressed="false" · type="button"
- `p` — $14.99 per month
- `h2` — School
- `p` — For the classroom. The same story world, with room for the whole class.
- `p` — $24.99 per month
- `li` — 6 new books every month, unused roll over
- `li` — Up to 30 children
- `p` — No lock-in, cancel anytime.
- `button.btn.btn-primary` — Upgrade to School · type="button"

## 4. Server HTML vs hydrated DOM

Only in the hydrated DOM (added or changed by client JavaScript):

- `a` — Login · → `/login` · aria-label="Login"
- `a` — Pricing · → `/uppgradera` · aria-label="Pricing"
- `a` — Contact · → `mailto:…@tale-forge.app`

Only in the server HTML (replaced during hydration):

- `a` — Contact · → `/cdn-cgi/l/email-protection#e8838d9e8186a89c89848dc58e879a8f8dc6899898`

## 5. Screenshots

- [uppgradera__en__morgon__desktop__fold.png](../../screenshots/pages/uppgradera/uppgradera__en__morgon__desktop__fold.png)
- [uppgradera__en__morgon__mobile__fold.png](../../screenshots/pages/uppgradera/uppgradera__en__morgon__mobile__fold.png)
- [uppgradera__en__natt__desktop__fold.png](../../screenshots/pages/uppgradera/uppgradera__en__natt__desktop__fold.png)
- [uppgradera__en__natt__mobile__fold.png](../../screenshots/pages/uppgradera/uppgradera__en__natt__mobile__fold.png)
