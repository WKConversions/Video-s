# Copy deck: Sign up (/signup) · Svenska (Swedish)

Account creation with Google first, then email and password, plus the parent/guardian attestation checkbox.
Every string below is verbatim from the hydrated DOM [source/rendered/dom__signup__sv.html](../../source/rendered/dom__signup__sv.html) (desktop, natt theme, cookie `tf_locale=sv`), in document order. The server HTML [source/html/signup.sv.html](../../source/html/signup.sv.html) was compared against it (section 4).
About 91 words of visible and assistive text. Translation notes and voice analysis: [../../analysis/10-copy-voice-and-tone.md](../../analysis/10-copy-voice-and-tone.md). The other language: [signup.en.md](signup.en.md).

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
| `<link rel="canonical">` | https://tale-forge.app/signup |
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


#### `main#main-content › section`


#### `main#main-content › section › div.glass`

- `h1.page-title` — Skapa konto
- `p.lede` — Personliga sagoböcker där ert barn är hjälten, med bilder och uppläsning. Ett konto för hela familjen; sen bygger ni ert barns hjälte och den första boken.
- `button.btn.btn-ghost` — Fortsätt med Google · type="button"
- `div` — eller

#### `section › div.glass › form`

- `label` — E-post · for="auth-email"
- `input#auth-email` — placeholder="du@exempel.se" · type="email" · autocomplete="email" · required
- `label` — Lösenord · for="auth-password"
- `input#auth-password` — placeholder="Ditt lösenord" · type="password" · autocomplete="new-password" · required
- `button` — *(no visible text)* · aria-label="Visa lösenord" · type="button"
- `label` — Jag är barnets förälder eller vårdnadshavare och godkänner integritetspolicyn. · for="signup-attest"
- `a` — Läs integritetspolicyn · → `/integritet`
- `button.btn.btn-primary` — Skapa konto · type="submit"
- `p` — Har du redan ett konto? [Logga in](/login)

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

- `a` — Kontakt · → `/cdn-cgi/l/email-protection#b9d2dccfd0d7f9cdd8d5dc94dfd6cbdedc97d8c9c9`

## 5. Screenshots

- [signup__sv__morgon__desktop__fold.png](../../screenshots/pages/signup/signup__sv__morgon__desktop__fold.png)
- [signup__sv__morgon__mobile__fold.png](../../screenshots/pages/signup/signup__sv__morgon__mobile__fold.png)
- [signup__sv__natt__desktop__fold.png](../../screenshots/pages/signup/signup__sv__natt__desktop__fold.png)
- [signup__sv__natt__mobile__fold.png](../../screenshots/pages/signup/signup__sv__natt__mobile__fold.png)
