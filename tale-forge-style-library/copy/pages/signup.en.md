# Copy deck: Sign up (/signup) · English

Account creation with Google first, then email and password, plus the parent/guardian attestation checkbox.
Every string below is verbatim from the hydrated DOM [source/rendered/dom__signup__en.html](../../source/rendered/dom__signup__en.html) (desktop, natt theme, cookie `tf_locale=en`), in document order. The server HTML [source/html/signup.en.html](../../source/html/signup.en.html) was compared against it (section 4).
About 98 words of visible and assistive text. Translation notes and voice analysis: [../../analysis/10-copy-voice-and-tone.md](../../analysis/10-copy-voice-and-tone.md). The other language: [signup.sv.md](signup.sv.md).

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
| `<link rel="canonical">` | https://tale-forge.app/signup |
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

- `h1.page-title` — Create account
- `p.lede` — Personalized picture books where your child is the hero, with art and narration. One account for the whole family; then you build your child's hero and their first book.
- `button.btn.btn-ghost` — Continue with Google · type="button"
- `div` — or

#### `section › div.glass › form`

- `label` — Email · for="auth-email"
- `input#auth-email` — placeholder="you@example.com" · type="email" · autocomplete="email" · required
- `label` — Password · for="auth-password"
- `input#auth-password` — placeholder="Your password" · type="password" · autocomplete="new-password" · required
- `button` — *(no visible text)* · aria-label="Show password" · type="button"
- `label` — I am the child's parent or guardian and I accept the privacy notice. · for="signup-attest"
- `a` — Read the privacy notice · → `/integritet`
- `button.btn.btn-primary` — Create account · type="submit"
- `p` — Already have an account? [Log in](/login)

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

- `a` — Contact · → `/cdn-cgi/l/email-protection#82e9e7f4ebecc2f6e3eee7afe4edf0e5e7ace3f2f2`

## 5. Screenshots

- [signup__en__morgon__desktop__fold.png](../../screenshots/pages/signup/signup__en__morgon__desktop__fold.png)
- [signup__en__morgon__mobile__fold.png](../../screenshots/pages/signup/signup__en__morgon__mobile__fold.png)
- [signup__en__natt__desktop__fold.png](../../screenshots/pages/signup/signup__en__natt__desktop__fold.png)
- [signup__en__natt__mobile__fold.png](../../screenshots/pages/signup/signup__en__natt__mobile__fold.png)
