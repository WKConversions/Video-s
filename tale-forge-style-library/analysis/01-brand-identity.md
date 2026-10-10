# 01 · Brand identity: Tale Forge

Tale Forge presents itself as a small Swedish workshop that **forges** bedtime picture books. The name, the logo (an anvil with an open book and a quill on it, under sparkles) and the in-app vocabulary ("smids", the smithy, the waiting fire, embers) all point at crafting. A night sky (nebula, starfield, the *Natt* theme) stands for bedtime and imagination, and a running promise of **memory** ("En värld som minns henne", "sagor som minns er värld") stands for continuity between books.
The logo is a single 512 px gold raster (mean `#d8a216`). The nav sets the name in Cinzel 700 capitals in `--logo-ink`, which is gold `#f5c542` at night and violet `#6d4fe0` in the morning theme. The share image sets the title in DejaVu Serif Bold, a font the site does not otherwise use.
This file covers literal material (CSS, copy, numbers, files) and then, under **Read** headings, what it means and how to reproduce it. Measurements and sheets are in [`../derived/brand/`](../derived/brand/).

## Contents

1. [At a glance](#1-at-a-glance)
2. [The name](#2-the-name)
3. [The logo file (tf-logo.webp)](#3-the-logo-file-tf-logowebp)
4. [The nav lockup (.logo)](#4-the-nav-lockup-logo)
5. [Other places the wordmark style appears](#5-other-places-the-wordmark-style-appears)
6. [Favicon, app icons, PWA manifest](#6-favicon-app-icons-pwa-manifest)
7. [OG / Twitter share image](#7-og--twitter-share-image)
8. [Brand lines (verbatim copy)](#8-brand-lines-verbatim-copy)
9. [The naming system](#9-the-naming-system)
10. [Market and positioning cues](#10-market-and-positioning-cues)
11. [The metaphor system](#11-the-metaphor-system)
12. [Read: brand personality and how to reproduce it in film](#12-read-brand-personality-and-how-to-reproduce-it-in-film)
13. [Inconsistencies and gaps](#13-inconsistencies-and-gaps)
14. [Files in derived/brand/](#14-files-in-derivedbrand)

---

## 1. At a glance

| Item | Value | Source |
|---|---|---|
| Name as written | `Tale Forge` (two words, title case) | `<title>`, `og:title`, `og:site_name`, manifest `name`/`short_name` ([../source/meta/manifest.webmanifest](../source/meta/manifest.webmanifest)) |
| Name as shown in the nav | **TALE FORGE**: source text `Tale Forge` with `text-transform: uppercase`, Cinzel 700, `letter-spacing: 3px` | [../source/css/3q17cp_jgfwol.pretty.css](../source/css/3q17cp_jgfwol.pretty.css):696-710 |
| Logo | `assets/assets/tf-logo.webp`, 512×512 RGBA raster. Gold anvil + open book + quill + 4 four-point sparkles + 2 dots + stacked `TALE / FORGE` | [../assets/assets/tf-logo.webp](../assets/assets/tf-logo.webp) |
| Logo gold | mean `#d8a216`, range `#eec026` (brightest 3%) to `#cd9210` (darkest 3%), left-to-right sheen | [../derived/brand/logo-colour-sheet.png](../derived/brand/logo-colour-sheet.png) |
| Wordmark ink | Natt `#f5c542` (= `--gold-soft`), Morgon `#6d4fe0` (= `--violet`) | 3q17cp_jgfwol.pretty.css:537, 586 |
| App colour | `#171232` (manifest `theme_color` and `background_color`, natt body background) | manifest; 3q17cp_jgfwol.pretty.css:606 |
| Fonts in brand roles | Cinzel 700 (`--wordmark`), Lora 700 (`--display`), Source Serif 4 (`--serif`), Schibsted Grotesk (`--ui`) | 3q17cp_jgfwol.pretty.css:460-472 |
| Tagline (footer) | `Tale Forge, sagor som minns er värld.` / `Tale Forge, storybooks that remember your world.` | [../source/rendered/dom__home__sv.html](../source/rendered/dom__home__sv.html) `.foot` |
| Description | `Riktiga bilderböcker, skapade för ditt barn.` [Real picture books, made for your child.] | `<meta name="description">`, manifest `description` |
| Company | `Tale Forge AB, org.nr 559543-1122, Värnamo, Sverige` | footer `data-testid="footer-company"` |
| Status | `Beta` badge + `Version 16ab1756 · 26 sep. 2026` | footer `data-testid="beta-build-label"`, `footer-version` |
| Price | `149 kr i månaden` after a free first book; yearly `1490 kr` | home hero; [../source/js/26ye0kuppitcn.js](../source/js/26ye0kuppitcn.js) |
| Themes | `Natt` [Night] (default) / `Morgon` [Morning] | nav toggle; `body[data-theme]` |
| Default narrator | `Morfar Erik` [Grandpa Erik], chip text `Morfar` | [../source/js/390j9gbq0u9ce.js](../source/js/390j9gbq0u9ce.js) `CREATE_VOICES` |

---

## 2. The name

### 2.1 Spelling, casing, markup

- The name is always the two words **Tale Forge**: English, title case, one space. It is not translated. The Swedish UI keeps the English name and puts Swedish around it: `Tale Forge, sagor som minns er värld.`
- The nav link carries `translate="no"`, so browser translation never turns the name into "Saga Smedja" or similar. It is the only element on the site with that attribute (one hit per page in `../source/rendered/dom__*.html`):

```html
<a class="logo" translate="no" style="text-decoration:none" href="/"><img src="/assets/tf-logo.webp" alt="">Tale Forge</a>
```

- The capitals in the nav come from CSS (`text-transform: uppercase`, 3q17cp_jgfwol.pretty.css:700), not from the source text. Copy-paste and screen readers get "Tale Forge".
- The logo `<img>` has `alt=""` (decorative). The link's accessible name is the text "Tale Forge".
- `<html lang="sv">` by default and `lang="en"` when the `tf_locale=en` cookie is set. The URL does not change.

### 2.2 Where the name appears, and in which type

| Place | Rendering | Font | Colour | Source |
|---|---|---|---|---|
| Nav lockup (every page) | `TALE FORGE` | Cinzel 700, 27.52 px (16.8 px ≤560 px), tracking 3 px (1.5 px) | `--logo-ink` | 3q17cp_jgfwol.pretty.css:696-716, 746-755 |
| Inside the logo raster | `TALE` / `FORGE`, stacked, centred | Roman inscriptional capitals (very close to Cinzel; see 3.5) | gold sheen | tf-logo.webp |
| OG / Twitter image | `Tale Forge` mixed case | **DejaVu Serif Bold** ~84 px (measured) | `#f5c542` | [../derived/brand/og-font-match.png](../derived/brand/og-font-match.png) |
| Footer tagline | `Tale Forge, sagor som minns er värld.` | Schibsted Grotesk 400, 0.9rem | `--foot-ink` (`#b7a9d6` natt / `#5f5878` morgon) | 3q17cp_jgfwol.pretty.css:1933-1947 |
| Footer legal line | `Tale Forge AB, org.nr 559543-1122, Värnamo, Sverige` | Schibsted Grotesk | `var(--card-sub)`, opacity 0.85 | inline style, footer |
| Running copy | `Tale Forge skriver, målar och läser in en riktig bilderbok…` (/start lede) | Source Serif 4 | `--page-sub` | [../source/rendered/dom__start__sv.html](../source/rendered/dom__start__sv.html) |
| Colophon on a finished ("forged") book in the waiting screen | `TALE FORGE` | Cinzel 700, 0.58rem, tracking 0.22em | `#f7e7c38c` | [../source/css/37m388zf6rymp.pretty.css](../source/css/37m388zf6rymp.pretty.css):936-946; JS `className:"glod-book-colophon","aria-hidden":"true",children:"Tale Forge"` in [../source/js/2j_-r8q4tgdka.js](../source/js/2j_-r8q4tgdka.js) |
| `<title>` | `Tale Forge` on home, start, login, signup, 404. Sub-pages use the bare page name: `Uppgradera`, `Integritetspolicy`, `Användarvillkor` (en: `Upgrade`, `Privacy notice`, `Terms of service`), with no brand suffix | `../source/html/*.html` |
| PWA | `name` and `short_name` both `Tale Forge` | manifest |

All eight treatments side by side, rendered with the site's own font files: [../derived/brand/wordmark-specimen.webp](../derived/brand/wordmark-specimen.webp).

---

## 3. The logo file (tf-logo.webp)

### 3.1 File facts

| Property | Value |
|---|---|
| Path | [../assets/assets/tf-logo.webp](../assets/assets/tf-logo.webp) (served at `/assets/tf-logo.webp`, `<link rel="preload" as="image">` on every page) |
| Format | WebP, 512×512, RGBA, 46,378 bytes |
| Alpha | 256 alpha levels, i.e. anti-aliased cut-out on transparent. Opaque-ish pixels (α > 0): 37,823; fully opaque: 9,874 |
| Visible bbox | x 121–385, y 36–455 inclusive (α > 0) |
| Vector original | none published (`/assets/tf-logo.svg`, `/assets/tf-logo.png`, `/logo.svg`, `/assets/logo.svg`, `/icon.svg`, `/safari-pinned-tab.svg` all return 404 when probed on 2026-10-09) |
| Use on site | nav only (42 px / 28 px). Every icon and the OG image are this same artwork scaled (section 6, 7) |

### 3.2 Every element, top to bottom

See [../derived/brand/logo-anatomy.png](../derived/brand/logo-anatomy.png) (boxes are connected components of α > 32, coordinates in source px).

| Element | Box (x0,y0 – x1,y1) | Description (observed) |
|---|---|---|
| Sparkles | small 4-point star (254,60–265,71); large 4-point star (228,80–248,100); small 4-point star (313,99–324,111); large 4-point star (290,119–312,141); dots (227,111–233,117) and (274,137–279,143) | Four-point "twinkle" stars with concave sides (the classic sparkle glyph), two large (~21–23 px) and two small (~12 px), plus two round dots. They are scattered either side of the quill, as if thrown off by it. |
| Quill | (242,38 – 339,191) | A feather quill. Tip at (338,38), nib at (250,191), so it leans about 30° right of vertical. The vane is solid gold with notched barb cuts on the outer edge and a negative-space rachis (the central shaft line). The nib comes down into the gutter of the book, as if writing in it. |
| Open book | (160,153 – 343,210) | Seen front-on, open flat. Pages are drawn as gold outlines with a double contour at the outer edges (the page block). The pages curve up from the centre gutter, and the inside of each page is empty (transparent). |
| Anvil | (123,210 – 361,327) | A London-pattern anvil in side view, horn pointing left. A vertical cut-line near the horn marks the step. The face is flat (the book rests on it) and a thin negative highlight line runs along its top edge. Below are the waist and splayed feet with an arched cut-out. It is the largest mass (14,219 px at α > 32). |
| Wordmark line 1 | (152,340 – 355,391) | `TALE`, cap height 52 px, stems about 10–11 px, hairlines 3–4 px. The T and A touch. |
| Wordmark line 2 | (133,403 – 383,452) | `FORGE`, cap height 49–50 px, 12 px below line 1. It is wider than TALE (251 vs 204 px), so the stack makes a slight inverted pyramid that sits under the anvil. |

### 3.3 Construction and proportions

- Margins inside the 512 canvas: top 38, bottom 59, left 123, right 128 px. The lockup is portrait (265×421 px visible) and centred on x ≈ 253 (canvas centre 256).
- The mark (sparkles to anvil feet) takes y 38–327: 290 px, 57% of the height. The wordmark takes y 340–452: 113 px.
- One colour only, with no outline, stroke, shadow or second hue. Every interior detail (page lines, rachis, anvil step, foot arch) is **negative space**: transparent cuts in a solid gold plate.
- Lossless crops for reuse: [../derived/brand/logo-parts/tf-logo__mark-only.png](../derived/brand/logo-parts/tf-logo__mark-only.png) (254×305), [../derived/brand/logo-parts/tf-logo__wordmark-only.png](../derived/brand/logo-parts/tf-logo__wordmark-only.png) (266×128), [../derived/brand/logo-parts/tf-logo__trimmed.png](../derived/brand/logo-parts/tf-logo__trimmed.png) (281×436, 8 px padding).

### 3.4 Colour (measured)

Method: pixels with α ≥ 250 (n = 24,574), k-means in CIELAB (k = 8, k-means++ seed 0), each swatch = median member pixel. This follows the studio's `brand.json` convention in `films/clearscaler/brand.json`. Sheet: [../derived/brand/logo-colour-sheet.png](../derived/brand/logo-colour-sheet.png). Data: [../derived/brand/brand.json](../derived/brand/brand.json) → `logo.palette`.

| Swatch | Share | L\* a\* b\* (centroid) |
|---|---|---|
| `#ecbe25` | 5.1% | 79.0, 3.5, 75.0 |
| `#e6b41e` | 8.1% | 76.0, 5.9, 74.0 |
| `#dfab18` | 12.2% | 72.8, 7.4, 72.5 |
| `#daa415` | 13.6% | 70.8, 8.8, 71.2 |
| `#d69f13` | 18.7% | 68.9, 9.6, 69.9 |
| `#d59a14` | 7.1% | 67.8, 12.1, 69.0 |
| `#d19a13` | 22.5% | 66.9, 10.4, 68.3 |
| `#cf9512` | 12.7% | 65.5, 12.2, 67.3 |

- Mean `#d8a216`. Brightest 3% `#eec026`, darkest 3% `#cd9210`.
- **Sheen direction: left to right.** Mean colour of each fifth of the anvil, left to right: `#ecbe26` → `#e2af1a` → `#d9a315` → `#d29a13` → `#d29914`. The book does the same (`#ecbb23` → `#d49d13`). Top to bottom the change is small (anvil `#dca618` → `#d69e14`), so this is a horizontal metallic sheen, brightest on the anvil horn and the left page.
- Per element means: quill `#d7a114`, book `#dfab19`, anvil `#d9a316`, TALE `#d69e15`, FORGE `#d19813`. The wordmark is slightly darker than the mark.
- **The logo gold is not a CSS token.** It is warmer and darker (ochre, L\* 66–79) than `--gold` `#f2b22e` and `--gold-soft` `#f5c542` (3q17cp_jgfwol.pretty.css:463-464). So in the nav, a darker gold image sits next to lighter gold Cinzel text.

### 3.5 The wordmark inside the logo

- The letters are Roman inscriptional capitals (the Trajan family look): flared wedge serifs, moderate stroke contrast (stem 10–11 px against hairline 3–4 px at 50–52 px cap height), pointed A apex, R with a straight diagonal leg.
- Measured against the site's Cinzel 700 at the same cap height, glyph widths agree within about ±3 px (logo L 42 / E 42 / F 37 / O 54 / E 39 px against Cinzel 39 / 39 / 35 / 55 / 40 px) and the stem-to-cap ratio is the same (~0.2). The logo letters are spaced slightly wider. Comparison: [../derived/brand/wordmark-specimen.webp](../derived/brand/wordmark-specimen.webp), row 1.
- Read: the logo was very probably set in Cinzel (or a near-identical Trajan-style face) and then gilded together with the mark, which matches the nav's `--wordmark: Cinzel`. This is not proven: no font metadata survives in a raster.

### 3.6 Read: what the logo says

- **Anvil + book + quill.** The book sits on the anvil while the quill writes in it, so writing (the quill) and smithing (the anvil) together make the book. That is the name drawn as a picture: a *tale* made at a *forge*.
- The sparkles bring in magic, wishes and the night sky. They are the same four-point star the site uses elsewhere (`.hiw-star`, [../assets/svg-inline/home__hiw-star__700fa96f.svg](../assets/svg-inline/home__hiw-star__700fa96f.svg); the map's "guldstjärna" [gold star] for each choice).
- One-colour gold with engraved cuts reads like a **stamped emblem**: foil on a book cover or a maker's mark. It is not a playful children's-brand logo, so it signals heirloom and quality rather than cartoon.
- It is the kind of all-in-one emblem (pictogram over a stacked serif name) that generic logo tools produce. It has no small-size variant, and the internal `TALE FORGE` is illegible below about 64 px (see 4.4 and section 6).

---

## 4. The nav lockup (.logo)

### 4.1 CSS (verbatim)

[../source/css/3q17cp_jgfwol.pretty.css](../source/css/3q17cp_jgfwol.pretty.css):696-716

```css
.logo {
  white-space: nowrap;
  font-family: var(--wordmark);
  color: var(--logo-ink);
  text-transform: uppercase;
  letter-spacing: 3px;
  text-shadow: var(--logo-shadow);
  flex-shrink: 0;
  align-items: center;
  gap: 13px;
  font-size: 1.72rem;
  font-weight: 700;
  transition: color 0.5s;
  display: flex;
}
.logo img {
  object-fit: contain;
  filter: drop-shadow(0 0 14px #f5c54280);
  width: 42px;
  height: 42px;
}
```

3q17cp_jgfwol.pretty.css:746-755 (phones):

```css
@media (max-width: 560px) {
  .logo {
    letter-spacing: 1.5px;
    gap: 8px;
    font-size: 1.05rem;
  }
  .logo img {
    width: 28px;
    height: 28px;
  }
```

Tokens: 3q17cp_jgfwol.pretty.css:469 (`--wordmark`), 537-538 (natt), 586-587 (morgon):

```css
:root            { --wordmark: var(--font-cinzel), "Playfair Display", Georgia, serif; }
body[data-theme="natt"] {
  --logo-ink: #f5c542;
  --logo-shadow: 0 2px 6px #050814cc, 0 0 34px #f5c54273;
}
body[data-theme="morgon"] {
  --logo-ink: #6d4fe0;
  --logo-shadow: 0 1px 2px #241f352e, 0 0 24px #6d4fe052;
}
```

Font face (3q17cp_jgfwol.pretty.css:1-38): Cinzel is declared only at weight 700, as two unicode-range subsets. The Latin file `fd5073be3e923c20-s.p.0bu2vpnzs5p12.woff2` ([../assets/fonts/](../assets/fonts/)) is **preloaded on every page** through the HTTP `link` header (see [../source/meta/home-response-headers.txt](../source/meta/home-response-headers.txt)), alongside the Lora, Source Serif 4 and Schibsted Grotesk Latin files. The metric-matched fallback is `Cinzel Fallback` = `local(Times New Roman)` with `size-adjust: 136.86%`, `ascent-override: 71.31%`, `descent-override: 27.18%` (lines 22-29).

### 4.2 Measured (live, Playwright, 2026-10-09)

From [../derived/brand/lockups/_capture-meta.json](../derived/brand/lockups/_capture-meta.json) and the computed-style dumps ([../source/rendered/computed-styles__home__sv__natt__desktop.json](../source/rendered/computed-styles__home__sv__natt__desktop.json) etc.):

| | Desktop 1440 | Mobile 390 |
|---|---|---|
| `.logo` box (x, y, w, h) | 188, 27, 261 × 42 | 28, 14, 158.3 × 28 |
| `<img>` | 42 × 42 at (188, 27) | 28 × 28 at (28, 14) |
| text run | x 243, w 206, h 37 | x 64, w 122.3, h 22 |
| font-size / tracking | 27.52 px / 3 px | 16.8 px / 1.5 px |
| gap | 13 px | 8 px |
| colour natt / morgon | `rgb(245,197,66)` / `rgb(109,79,224)` | same |
| text-shadow natt | `rgba(5,8,20,.8) 0 2px 6px, rgba(245,197,66,.45) 0 0 34px` | same |
| text-shadow morgon | `rgba(36,31,53,.18) 0 1px 2px, rgba(109,79,224,.32) 0 0 24px` | same |
| img filter (both themes) | `drop-shadow(rgba(245,197,66,.5) 0 0 14px)` | same |

Position: `.shell` is `width: min(1120px, 100%)` with `padding: 0 28px` (3q17cp_jgfwol.pretty.css:681-688), so at 1440 px the logo starts at x = 160 + 28 = 188. The nav row has `padding: 22px 0` (14 px on phones).

### 4.3 Behaviour

- **No hover state.** The rest and hover captures in `screenshots/states/<lang>__<theme>/01_logo_TALE_FORGE__{rest,hover}.png` are pixel-identical in morgon. In natt the maximum difference is 16 levels, which comes from the starfield twinkle behind the logo, not from the logo.
- **No animation.** `document.getAnimations()` on home lists only `twinkle`, `float1`, `float2`, `floatBadge` and `pulse` ([../source/rendered/running-animations__home.json](../source/rendered/running-animations__home.json)).
- **Theme switch:** the text colour cross-fades gold ↔ violet over `0.5s` (`transition: color 0.5s`). The image does **not** change: it stays gold, with the same gold `drop-shadow`, in both themes.
- In the morning theme, the mean logo gold `#d8a216` against the flat `#ede9f6` gives 1.93:1 contrast (1.76:1 over the aurora art). The violet text gives 4.57:1. Natt: `#f5c542` on `#171232` gives 11.08:1. See [../derived/brand/logo-on-themes.webp](../derived/brand/logo-on-themes.webp).

### 4.4 Captures (deviceScaleFactor 3)

All in [../derived/brand/lockups/](../derived/brand/lockups/), captured from the live site with the `tf_locale` cookie and `tf-theme` localStorage set, fonts loaded and the starfield animation frozen:

| File | Shows |
|---|---|
| `nav-lockup__natt__desktop@3x.png` (963×306) | Logo + wordmark with 30 CSS px of context, so the 34 px gold glow is visible. The bokeh disc behind "TALE" is part of the nebula photo. |
| `nav-lockup__morgon__desktop@3x.png` | Same in Morgon over the watercolour aurora. The gold mark nearly disappears; the text is violet. |
| `nav-lockup__{natt,morgon}__desktop__tight@3x.png` (783×126) | Element screenshot of `.logo` exactly (261×42 CSS px). The glow is cut off. |
| `nav-lockup__{natt,morgon}__mobile@3x.png`, `…__mobile__tight@3x.png` | The 28 px / 16.8 px phone lockup |
| `nav-lockup__{natt,morgon}__transparent@3x.png` (963×306, RGBA) | Lockup with page backgrounds hidden and `omitBackground`, i.e. **alpha-matted text-shadow and glow for compositing in film** |
| `nav-bar__{sv,en}__{natt,morgon}__{desktop,mobile}@3x.png` | The whole `<nav>`: lockup, `Logga in`/`Login`, `Priser`/`Pricing`, SV/EN switch, Natt/Morgon toggle. On phones the nav wraps to two rows and the toggle drops its labels. |
| `footer-brand-strip__sv__{natt,morgon}__desktop@3x.png` (3192×312) | The `.foot` brand strip: tagline, Beta pill, version, legal line, links |

Read: at 42 px the logo's own `TALE FORGE` is a 4 px-high smudge, so the nav effectively shows the name twice, and only the Cinzel copy is legible. The image works as a small gold "seal" next to the wordmark.

---

## 5. Other places the wordmark style appears

`--logo-ink` / `--logo-shadow` and Cinzel are reused as the "title of a book" voice. Wherever a book or the brand needs to look engraved, the site uses Cinzel capitals:

| Selector | Use | CSS |
|---|---|---|
| `.reader-title` | Book title in the reader, Cinzel uppercase 2rem, `letter-spacing: 0`, colour `--logo-ink`, shadow `--logo-shadow` | 3q17cp_jgfwol.pretty.css:1810-1823 |
| `.reader-ceremony-title` | Title on the end-of-book "ceremony" with the keepsake cover | 3q17cp_jgfwol.pretty.css:2119-2131 |
| `.glod-wb-kicker` | `Väntelden` / `The waiting fire`, the kicker on a nailed wooden sign on the waiting screen: Cinzel 0.64rem, tracking 0.13em, `#e4cfa4` | 37m388zf6rymp.pretty.css:157-166 |
| `.glod-book-colophon` | `Tale Forge` colophon on the forged book, Cinzel 0.58rem, tracking 0.22em, `#f7e7c38c` | 37m388zf6rymp.pretty.css:936-946 |
| `.cs-door-face:after`, `.cs-door-star`, `.cs-door-reg--surprise` | `--logo-ink` used as the frame line, star glyph and "Överraska" label of the story-choice cards | [../source/css/2h1wwdz1nvxwk.pretty.css](../source/css/2h1wwdz1nvxwk.pretty.css):397-399, 445-456, 469-476 |

Read: **gold Cinzel capitals = "this is a book / this is Tale Forge"**. Headlines use Lora, UI uses Schibsted Grotesk and reading text uses Source Serif 4. Cinzel is reserved for names and titles.

---

## 6. Favicon, app icons, PWA manifest

Head tags (identical on every page, [../source/html/home.sv.html](../source/html/home.sv.html)):

```html
<link rel="manifest" href="/manifest.webmanifest"/>
<link rel="icon" href="/favicon.ico?favicon.0k8s-ucsp6yre.ico" sizes="48x48" type="image/x-icon"/>
<link rel="icon" href="/icon.png?icon.1q_fj2hxfdn0a.png" sizes="256x256" type="image/png"/>
<link rel="apple-touch-icon" href="/apple-icon.png?apple-icon.1qwtxz8ono1wt.png" sizes="180x180" type="image/png"/>
```

There is **no `<meta name="theme-color">`**. Manifest ([../source/meta/manifest.webmanifest](../source/meta/manifest.webmanifest)), verbatim:

```json
{"name":"Tale Forge","short_name":"Tale Forge","description":"Riktiga bilderböcker, skapade för ditt barn.","start_url":"/","display":"standalone","background_color":"#171232","theme_color":"#171232","icons":[{"src":"/icons/icon-192.png","sizes":"192x192","type":"image/png","purpose":"any"},{"src":"/icons/icon-512.png","sizes":"512x512","type":"image/png","purpose":"any"},{"src":"/icons/icon-512.png","sizes":"512x512","type":"image/png","purpose":"maskable"}]}
```

| File | Size | Background | Logo content (bbox) | Logo height / width as % of icon |
|---|---|---|---|---|
| [../assets/brand/favicon.ico](../assets/brand/favicon.ico) | 16, 32, 48 frames | transparent | full logo | 81–84% / 50–52% |
| [../assets/brand/icon.png](../assets/brand/icon.png) | 256×256, 8-bit palette + tRNS | transparent | (61,19)–(191,226) | 81.2% / 51.2% |
| [../assets/brand/apple-icon.png](../assets/brand/apple-icon.png) | 180×180 | `#171232` | (55,32)–(123,142) | 61.7% / 38.3% |
| [../assets/icons/icon-192.png](../assets/icons/icon-192.png) | 192×192 | `#171232` | (63,42)–(127,145) | 54.2% / 33.9% |
| [../assets/icons/icon-512.png](../assets/icons/icon-512.png) | 512×512 | `#171232` | (168,112)–(340,385) | 53.5% / 33.8%, inside the 40% maskable safe circle |

Sheet: [../derived/brand/icon-sheet.png](../derived/brand/icon-sheet.png) (favicon frames at 1× on dark and light tabs and at 8× nearest-neighbour; app icons at 1:1 with content boxes; maskable circle on icon-512).

Observed:
- Every icon is the full emblem, wordmark included. At 16 px the wordmark is a few gold pixels and the anvil reads as a gold blob. No simplified mark exists.
- The square icons use the night colour `#171232` (rgb 23,18,50), the natt `body` background and the manifest `theme_color`, so a home-screen install opens on the night palette.
- The logo is a different size in each icon: 62% tall in apple-icon, 54% in the PWA icons, 81% in the transparent icon.

---

## 7. OG / Twitter share image

[../assets/brand/opengraph-image.png](../assets/brand/opengraph-image.png) and [../assets/brand/twitter-image.png](../assets/brand/twitter-image.png) are **byte-identical** (md5 `dcd913b929b9d82890c1c26312b21ab3`): 1200×630, 8-bit palette PNG (256 colours), 307,416 bytes. One image serves both languages. Annotated: [../derived/brand/og-image-annotated.webp](../derived/brand/og-image-annotated.webp).

Meta tags (home, sv), verbatim:

```html
<meta property="og:title" content="Tale Forge"/>
<meta property="og:description" content="Riktiga bilderböcker, skapade för ditt barn."/>
<meta property="og:site_name" content="Tale Forge"/>
<meta property="og:locale" content="sv_SE"/>   <!-- en_US on English -->
<meta property="og:image" content="https://tale-forge.app/opengraph-image.png?opengraph-image.2xzm_0q_kwhgm.png"/>
<meta property="og:image:type" content="image/png"/><meta property="og:image:width" content="1200"/><meta property="og:image:height" content="630"/>
<meta property="og:type" content="website"/>
<meta name="twitter:card" content="summary_large_image"/>
<meta name="twitter:title" content="Tale Forge"/>
<meta name="twitter:image" content="https://tale-forge.app/twitter-image.png?twitter-image.2xzm_0q_kwhgm.png"/>
```

There is no `og:image:alt`. The `?…png` hash query is how Next.js serves a static `opengraph-image.png` file convention, i.e. a hand-made image rather than one generated per request.

### 7.1 Composition (measured)

| Layer | Measurement | How it was established |
|---|---|---|
| Background | [../assets/assets/nebula-hero.webp](../assets/assets/nebula-hero.webp) (2400×1340) scaled to 50% (1200×670), top 40 px cropped (bottom-aligned) | luminance correlation r = 0.994 at scale 0.5, offset (0, 40) |
| Darkening | per channel `out ≈ 0.445 · src + (5, 8, 16)`, uniform across 15 regions | equals a flat `#0b0f1e` layer at ~55% opacity. `#0b0f1e` is the site's own scrim colour (`.bg-night .scrim`, 3q17cp_jgfwol.pretty.css:631-635, where it runs `#0b0f1e` 38% → 50%, ending on the near-identical `#0d1122` at 74%). No vignette. |
| Logo | tf-logo.webp at ~149 px square, box ≈ (70,161)–(219,310). Visible gold (106,172)–(181,292) | gold-pixel bbox ÷ the logo's known content ratio |
| Title | `Tale Forge`, mixed case, **DejaVu Serif Bold at 84 px**, flat `#f5c542` (= `--gold-soft`), no shadow. Ink bbox (71,301)–(556,382), left edge on the logo column x ≈ 70, 9 px below the logo's visible bottom | all 7 glyph runs match DejaVu Serif Bold 84 px within ±1 px, mask IoU 0.91. [../derived/brand/og-font-match.png](../derived/brand/og-font-match.png) |
| Card A | [../assets/assets/cover-tornet.webp](../assets/assets/cover-tornet.webp), box (616,101)–(891,508), 276×408 | r = 0.995 against the cover |
| Card B | [../assets/assets/cover-filten.webp](../assets/assets/cover-filten.webp), box (906,121)–(1181,528), 276×408, 20 px lower than A | r = 0.994 |
| Card style | 4 px cream border `#efe8dd` (rgb 239,232,221), corner radius ~10 px, **upright (0°)**, 14 px gutter, 18 px right margin, no visible drop shadow | pixel scans |

What it shows: the astronaut from the hero sits reading a glowing book on a pile of books in a violet-blue nebula with gold bokeh (left half). The emblem and a big gold title sit over it on the left, and two picture-book covers from "Alvas värld" stand on the right: Alva in a red hat at a gate with a white fox, an old wooden lookout tower and sheep behind (*Alva och fyraljuset i tornet*), and Alva in a red puffer jacket holding a tartan blanket with the fox, indoors (*Alva och filten vid elementet*).

Read:
- The OG image is a still of the home hero: same background, same two covers, same gold-on-night. On the site the cards are tilted −8° and +7° and float (`.fb1`/`.fb2`, 3q17cp_jgfwol.pretty.css:948-979). In the OG image they are upright, which makes it the calmer, flatter version.
- The title font is the odd one out. DejaVu Serif Bold is the default bold "serif" on most Linux systems, so the image was almost certainly rendered server-side or in a script that asked for a serif it did not have. It is not Cinzel (the nav's wordmark) or Lora (the display face), and it is mixed case where the nav is capitals. For emulation, treat it as an accident. Set the name in Cinzel 700 capitals in `#f5c542` to match the live brand, or reproduce DejaVu only when an exact copy of the share card is wanted.
- The left-heavy layout (70 px margin, cards pushed to 18 px from the right edge) is asymmetric and tight on the right.

---

## 8. Brand lines (verbatim copy)

Swedish is the default; English is shown when `tf_locale=en`. Sources: `<head>` of [../source/html/](../source/html/), hydrated DOM [../source/rendered/](../source/rendered/), dictionaries in [../source/js/3d9nxlx1n5pdy.js](../source/js/3d9nxlx1n5pdy.js) (landing), [../source/js/26ye0kuppitcn.js](../source/js/26ye0kuppitcn.js) (upgrade), [../source/js/2j_-r8q4tgdka.js](../source/js/2j_-r8q4tgdka.js) (waiting/forge), [../source/js/0ad0wel9cyv30.js](../source/js/0ad0wel9cyv30.js) (start flow).

### 8.1 Core lines

| Role | Svenska | English (site's own) |
|---|---|---|
| Meta description / manifest | Riktiga bilderböcker, skapade för ditt barn. | Real picture books, made for your child. |
| Footer tagline | Tale Forge, sagor som minns er värld. | Tale Forge, storybooks that remember your world. |
| Home H1 (gold words in `span.grad`) | En värld som **minns henne**. | A world that **remembers her**. |
| Home kicker | Exempel: Alvas värld · 2 böcker | Demo: Alva's world · 2 books |
| Home lede | Den målade hjälten återvänder. Valen förändrar vad som händer, och senare böcker minns äventyren ni redan har delat. | The painted hero returns. Choices change what happens, and later books remember the adventures you have already shared. |
| Primary CTA | Skapa er hjälte | Create your hero |
| Price line under CTA | Första boken är gratis, inget kort behövs. Sedan 149 kr i månaden. | The first book is free, no card needed. After that $14.99 a month. |
| Secondary CTA | Se hur det funkar | See how it works |
| Floating badge | Sixten minns tornet / från "Alva och fyraljuset" | Sixten remembers the tower / from "Alva and the Fourth Candle" |
| /start kicker | Riktiga bilderböcker, upplästa på svenska | Real picture books, read aloud |
| /start H1 | Ikväll är hjälten **ert barn**. | Tonight the hero is **your child**. |
| /start lede | Tale Forge skriver, målar och läser in en riktig bilderbok där ert barn är huvudpersonen. Porträttet ser ni om ett par minuter, den första boken är gratis. | Tale Forge writes, paints and narrates a real picture book where your child is the main character. You see the portrait in a couple of minutes, and the first book is free. |
| How-it-works headline | Äventyr värda att prata om. | Adventures worth talking about. |
| Memory section | Världen minns · "Ni fyller inte en hylla med lösa sagor. Ni bygger en värld." | The world remembers · "You are not filling a shelf with loose stories. You are building a world." |
| Upgrade intro | Nya personliga böcker varje månad, i en värld som minns. Ingen bindningstid, avsluta när du vill. | New personalized books every month, in a world that remembers. No lock-in, cancel anytime. |
| Family plan line | För familjen som vill fortsätta berätta tillsammans. | For the family that wants to keep telling stories together. |
| School plan line | För klassrummet. Samma sagovärld, med plats för hela klassen. | For the classroom. The same story world, with room for the whole class. |
| Signup lede | Personliga sagoböcker där ert barn är hjälten, med bilder och uppläsning. | Personalized picture books where your child is the hero, with art and narration. |
| Login | Välkommen tillbaka. | Welcome back. |
| 404 | Sidan finns inte · Den här sidan har vandrat iväg i sagovärlden. | Page not found · This page wandered off into the story world. |
| Forge finale (waiting screen) | Elden har smitt klart din saga. | The fire has forged your story. |
| AI disclosure chip | Skapad med AI | Made with AI (home card) / Created with AI (how-it-works) |
| Privacy "In short" | Vi är Tale Forge AB, ett litet svenskt företag i Värnamo (org.nr 559543-1122). Vi gör personliga bilderböcker för ert barn. | We are Tale Forge AB, a small Swedish company in Värnamo (org. no. 559543-1122). We make personalised picture books for your child. |

### 8.2 Footer brand strip (verbatim, hydrated DOM)

```html
<div class="foot">
  <div style="display:flex;flex-direction:column;gap:6px">
    <span style="display:inline-flex;align-items:center;flex-wrap:wrap;gap:10px">
      <span>Tale Forge, sagor som minns er värld.</span>
      <span data-testid="beta-build-label" style="padding:2px 7px;border:1px solid var(--card-line);border-radius:999px;font-family:var(--ui);font-size:.7rem;letter-spacing:.03em;opacity:0.8">Beta</span>
    </span>
    <span data-testid="footer-version" style="color:var(--card-sub);opacity:0.85;font-size:.8rem">Version 16ab1756 · 26 sep. 2026</span>
  </div>
  <span data-testid="footer-company" style="display:inline-flex;gap:16px;flex-wrap:wrap;align-items:center">
    <span style="color:var(--card-sub);opacity:0.85">Tale Forge AB, org.nr 559543-1122, Värnamo, Sverige</span>
    <a href="mailto:…@tale-forge.app" style="color:var(--card-sub);text-decoration-color:var(--accent)">Kontakt</a>
    <a href="/integritet" …>Integritet</a>
    <a href="/villkor" …>Villkor</a>
  </span>
</div>
```

(The `mailto:` is a personal first-name address at tale-forge.app. It is shortened here, but the full address is in the DOM files.) English footer: `Tale Forge, storybooks that remember your world.` · `Version 16ab1756 · 26 Sep 2026` · `Tale Forge AB, reg. no. 559543-1122, Varnamo, Sweden` (written without the diacritics: "Varnamo") · `Contact` `Privacy` `Terms`.

`.foot` CSS (3q17cp_jgfwol.pretty.css:1933-1947): `border-top: 1px solid var(--card-line); color: var(--foot-ink); justify-content: space-between; gap: 16px; padding: 26px 0 34px; font-size: 0.9rem; margin-top: auto`. Footer links are underlined in `--accent`: gold at night, violet in the morning. Capture: [../derived/brand/lockups/footer-brand-strip__sv__natt__desktop@3x.webp](../derived/brand/lockups/footer-brand-strip__sv__natt__desktop@3x.webp).

The footer appears identically on every captured page (home, start, uppgradera, login, signup, integritet, villkor, 404).

---

## 9. The naming system

### 9.1 Themes

| id (`body[data-theme]`) | sv label | en label | Icon | Notes |
|---|---|---|---|---|
| `natt` (default) | Natt | Night | crescent moon ([../assets/svg-inline/404__tt-opt__80ee85dd.svg](../assets/svg-inline/404__tt-opt__80ee85dd.svg)) | nebula photo + scrim + starfield. Gold accents. Persisted in `localStorage 'tf-theme'` |
| `morgon` | Morgon | Morning | sun with 8 rays ([../assets/svg-inline/404__tt-opt__ddbc3897.svg](../assets/svg-inline/404__tt-opt__ddbc3897.svg)) | watercolour aurora (`morgon-aurora-*.webp`). Violet accents |

The toggle is `aria-label="Byt tema"` / `"Switch theme"`, `role="switch"`. The language switch is `aria-label="Byt språk"` / `"Change language"`, buttons `SV` / `EN`.
Read: the pair is "Night" and "Morning", not "dark" and "light". Both name times of a child's day around reading: bedtime and waking.

### 9.2 Narrators (`CREATE_VOICES`, [../source/js/390j9gbq0u9ce.js](../source/js/390j9gbq0u9ce.js))

| id | sv | en | sv description | en description |
|---|---|---|---|---|
| `grandpa` (DEFAULT_CREATE_VOICE_ID) | Morfar Erik | Grandpa Erik | En varm, vis berättare med en mysig godnattstämma | A warm, wise storyteller with a cozy bedtime voice |
| `female` | Berättaren Lily | Storyteller Lily | En livfull, uttrycksfull berättare fylld av förundran | A bright, expressive narrator full of wonder |
| `male` | Berättaren Marcus | Narrator Marcus | En trygg, äventyrlig röst för spännande berättelser | A steady, adventurous voice for exciting tales |
| `young` | Unga Saga | Young Saga | En entusiastisk ung röst som känns som en kompis | An enthusiastic young voice that feels like a friend |

- Landing voice chip: sv `Morfar`, en `Grandpa Erik`. Image [../assets/landing/voice/narrator-morfar.webp](../assets/landing/voice/narrator-morfar.webp) is the same painting as `portrait-grandpa.jpg` (r = 0.998). Sample audio: [../assets/audio/landing-voice/](../assets/audio/landing-voice/).
- The sample book's `narratorPersona` is `"grandpa"` ([../source/sample-book.iris-och-den-sparade-platsen.json](../source/sample-book.iris-och-den-sparade-platsen.json)).
- Portraits (400×400, fetched from `/voices/portrait-<id>.jpg`): [../derived/brand/narrators/](../derived/brand/narrators/). Sheet: [../derived/brand/narrator-cast.webp](../derived/brand/narrator-cast.webp). All four are watercolour and coloured-pencil vignettes on cream paper, in the books' illustration style. Erik: white hair and beard, round glasses, mustard cable cardigan over a blue check shirt, holding a small book with an acorn on the cover. Lily: dark curls in a bun with a gold star clip, blue scarf, mustard top. Marcus: salt-and-pepper stubble, olive field jacket, a rolled map in the pocket. Saga: ginger ponytail, freckles, coral hoodie, striped tee.
- Read: *Morfar* (mother's father) is a specifically Scandinavian kinship word and the warmest default a Swedish parent could pick. *Saga* is a common Swedish girl's name that also means "fairy tale".

### 9.3 Ambient beds (`AMBIENT_BEDS`, [../source/js/1pgfdvt65g9p-.js](../source/js/1pgfdvt65g9p-.js))

| id | group | sv | en | file |
|---|---|---|---|---|
| `hearth` (DEFAULT_WAIT_BED) | ambience | Brasa | Fireplace | [../assets/audio/atmosphere/v1/hearth.mp3](../assets/audio/atmosphere/v1/hearth.mp3) |
| `rain` | ambience | Fönsterregn | Window rain | `rain.mp3` |
| `forest` | ambience | Sagoskogen | Enchanted forest | `forest.mp3` |
| `musicbox` | music | Speldosa | Music box | `musicbox.mp3` |
| `harp` | music | Månharpa | Moonlit harp | `harp.mp3` |
| `fire` | music | Glödljus | Ember glow | `fire.mp3` |

Defaults: `DEFAULT_BED_VOLUME` 0.18, capped at 0.4. Storage keys `tf-bed`, `tf-bed-vol`. On the waiting screen the fire sound toggle is labelled `Eldljud` / `Fire sound`.
Read: two of six beds are fire (*Brasa*, *Glödljus*) and the default is the hearth, so the forge is also the family fireplace. The Swedish names are invented compounds (*Sagoskogen* "the fairy-tale forest", *Månharpa* "moon harp", *Glödljus* "ember light") that sound like places and objects in a story.

### 9.4 Product nouns

| Swedish (as used) | English (site's own) | Where |
|---|---|---|
| hjälte / hjälten, *Skapa er hjälte*, *Bygg er hjälte*, *Din hjälte · barnens favorit* | hero, *Create your hero*, *Build your hero*, *Your hero · the family favorite* | CTA, steps, home card |
| vän, *Ta med en vän*, *Lägg till en vän*, sällskapet | friend, *Bring a friend*, *Add a friend*, the company | step 2, start step 3 |
| värld, sagovärld, *Er sagovärld*, *Alvas värld* | world, story world, *Your storyworld*, *Alva's world* | everywhere |
| Bokhyllan · *2 färdiga böcker* | The bookshelf · *2 finished books* | home card; "boken lägger sig i bokhyllan" [the book lands on the bookshelf] |
| exempelboken, *Läs exempelboken* | the sample book | CTA |
| berättarrösten, uppläsning, *inlästa* | the narrator, narration, *narrated* | steps, upgrade |
| porträttet, *Den målade hjälten* | the portrait, *The painted hero* | steps |
| val, slut, *Fyra olika slut* | choice, ending, *Four different endings* | steps, map |
| Väntelden, glöd, gnista, smedjan, smed | the waiting fire, ember, spark, the smithy, smith | waiting screen |
| Bokmässans snabb-saga | the Book Fair quick story | privacy page; `fair-story-page` test id |

Story registers ("doors", [../source/js/2j_-r8q4tgdka.js](../source/js/2j_-r8q4tgdka.js)): `Godnatt` [Bedtime], `Äventyr` [Adventure], `Vänskap` [Friendship], `Överraska oss` [Surprise us]. First-run stories: `Den försvunna lyktan` [The Lost Lantern] ("En godnattsaga där kvällens ljus behöver hittas igen."), `Tornet i molnen` [The Tower in the Clouds].
Plans: `Familj` / `Family`, `Skola` / `School` (internal id `academy`).
Trait chips on the hero card: `Modig, Fnissig, Djurvän, Nyfiken, Envis, + Fler` [Brave, Giggly, Animal lover, Curious, Stubborn, + More].
Start flow step titles: `Steg 1 av 4 · Hjälten` → `Fotot` → `Sällskapet` → `Kontot`, then `Sista valet före boken`, `Boken skapas` [The book is being made]. The container for the last screen has `className: "forge"` ([../source/css/2_gt301v4m-60.pretty.css](../source/css/2_gt301v4m-60.pretty.css):806-833).

### 9.5 Demo cast

- **Alvas värld** (home demo): Alva (red hat, green parka, braids); Noah, `bästa kompisen · med i 2 böcker` [best friend · in 2 books]; Sixten, `fjällräven · följer med i varje bok` [the arctic/mountain fox · comes along in every book]. Books: `Alva och fyraljuset i tornet` (`Stora känslor` [Big feelings]) and `Alva och filten vid elementet` (`Mysigt äventyr` [Cozy adventure]). Assets: cover-tornet/filten.webp, avatar-noah/sixten.jpg.
- **Iris och den sparade platsen** (sample book): Iris (seven, dark curls, raspberry-red raincoat, yellow boots) and Mossa, `en talande skogsmus` [a talking wood mouse] with a green scarf, at `kvartersbiblioteket` [the neighbourhood library]. The narrator is grandpa.

---

## 10. Market and positioning cues

Observed facts:

| Cue | Evidence |
|---|---|
| Swedish-first | Default locale `sv` (cookie `tf_locale`, no URL change); `og:locale sv_SE`; Swedish route slugs `/uppgradera`, `/integritet`, `/villkor`, `/konto`, `/valkommen` ([../source/meta/sitemap.xml](../source/meta/sitemap.xml); the last two are `Disallow`ed in [../source/meta/robots.txt](../source/meta/robots.txt)); the only sample book is Swedish, and the English /start page labels it `Iris och den sparade platsen · Swedish`. The Swedish /start kicker promises `upplästa på svenska` [narrated in Swedish]; the English one says only `read aloud`. |
| Local, small, founder-run | `Tale Forge AB … Värnamo` (a small town in Småland); `ett litet svenskt företag` [a small Swedish company]; Beta badge; a personal first-name contact mailbox; a short commit hash shown in the footer. |
| Cultural detail | *Morfar*; *fjällräv*; *fyraljuset* (the fourth Advent candle: "Alva and the Fourth Candle"); *elementet* (the radiator); *kvartersbiblioteket*; *Bokmässan* (Göteborg Book Fair, a "snabb-saga" mode for the fair with an anonymous account); "Lagom tid för tandborstning och pyjamas." [Just enough time for toothbrushing and pajamas.] |
| Price | Family: 149 kr/month or 1490 kr/year (124 kr/month billed yearly), 3 books/month (unused roll over), up to 4 children. School: 249 kr/month or 2490 kr/year, 6 books/month, up to 30 children. USD 14.99/149 and EUR 13.99/139 for Family; USD 24.99/249 and EUR 22.99/229 for School. The billing toggle defaults to yearly. ([../source/js/26ye0kuppitcn.js](../source/js/26ye0kuppitcn.js)) |
| Entry offer | Home and /start: `Första boken är gratis, inget kort behövs.` [The first book is free, no card needed.] /uppgradera: `14 dagar gratis, avsluta när du vill. Kort krävs.` [14 days free, cancel anytime. Card required.] |
| Buyer | The parent ("ert barn" [your child], plural *ni/er* addressing the family). Signup consent: `Jag är barnets förälder eller vårdnadshavare` [I am the child's parent or guardian]. Schools are a second tier. |
| Product claim | Real, printed-book-like picture books (`Riktiga bilderböcker`), personalised with a painted portrait, narrated, branching (2 choices → 4 endings), with memory across books. About ten minutes to make. |
| AI stance | Disclosed but not foregrounded: a small `Skapad med AI` chip; the privacy page says `Vi använder AI-tjänster för att skriva och illustrera.` The word "AI" is absent from the H1s, the description and the tagline. |

Read: the positioning is a **premium, honest, Swedish bedtime ritual**, not an "AI story generator". The emphasis is on *real* books, *real* choices, honest timings ("det säger vi hellre ärligt än låtsas att det går på en sekund" [we would rather say that honestly than pretend it takes a second]) and a family world that grows. 149 kr/month (about the price of one paperback picture book) places it as an affordable monthly treat.

---

## 11. The metaphor system

Four strands recur. The first three are explicit in the brief and the fourth emerges from the copy.

### 11.1 Forge / craft: making by hand, with fire

- **Name and logo**: *Forge*, the anvil, and the quill writing into a book resting on the anvil.
- **Waiting and generation copy** ([../source/js/2j_-r8q4tgdka.js](../source/js/2j_-r8q4tgdka.js)), verbatim:
  - `{names} allra första bok smids nu` [{names}' very first book is being forged now]
  - `kvällens bok smids i elden nu och tar {minutes}` [tonight's book is being forged in the fire and takes {minutes}]
  - `Den startar av sig själv när sagosmedjan är redo.` [It starts by itself when the story smithy is ready.]
  - `Smedjan är tom just nu` … `så snart en smed är tillbaka` [The smithy is empty right now … as soon as a smith is back]
  - `Väntelden. Fånga en glöd för att se vad den minns.` [The waiting fire. Catch an ember to see what it remembers.]
  - `Elden kunde inte slutföra sagan` [The fire could not finish the story]
  - `Elden har smitt klart din saga.` [The fire has finished forging your story.]
  - `Vår redaktör skickade tillbaka utkastet, så berättaren skriver ett nytt. Bra böcker behöver en omskrivning ibland.` [Our editor sent back the draft, so the storyteller is writing a new one. Good books sometimes need a rewrite.]
- **Domestic variant**: `Boken bakas. Ungefär tio minuter kvar.` [The book is baking. About ten minutes to go.] The book is baked as well as forged.
- **Materials in CSS**: the waiting screen ("glöd" = ember) is a canvas fire with a **wooden signpost**. Two posts (`.glod-post`: `linear-gradient(90deg, #33210f, #553d24 45%, #291908)`) hold a nailed board (`linear-gradient(178deg, #5e4129, #4a3120 56%, #3c2717)`, four metal `glod-nail` heads `radial-gradient(circle at 35% 30%, #e8d5ac, #6b5335 62%, #2c1e12)`, rotated −1.3°) with the Cinzel kicker `VÄNTELDEN`. The `Öppna boken` [Open the book] button is a wooden plank. See [../source/css/37m388zf6rymp.pretty.css](../source/css/37m388zf6rymp.pretty.css):61-166 (sign, posts, board, nails, kicker) and 982-1051 (`.glod-open`).
- **Internals**: the text engine is `causal-foundry-v1`; progress fields are `foundryProgress`.

### 11.2 Night sky: bedtime and imagination

- Default theme **Natt**. The background is `nebula-hero.webp`, an astronaut reading a glowing book on a pile of books among violet nebula clouds and gold bokeh, under a starfield of six radial-gradient stars twinkling over 4.6 s (3q17cp_jgfwol.pretty.css:636-656).
- Gold four-point sparkles in the logo; `.hiw-star` and "guldstjärna" for choices on the story map; star icon in the /start kicker ([../assets/svg-inline/start__kicker__ad275afb.svg](../assets/svg-inline/start__kicker__ad275afb.svg)); sparkle-burst icon in the home kicker ([../assets/svg-inline/home__kicker__822f9609.svg](../assets/svg-inline/home__kicker__822f9609.svg)).
- Bedtime vocabulary: *godnattstämma* [bedtime voice], *Godnatt* register, *Månharpa*, *Speldosa*, *Den försvunna lyktan* ("kvällens ljus" [the evening's light]), "Ikväll är hjälten ert barn" [Tonight the hero is your child], "Så här går en kväll till" [Here is how an evening goes].
- Read: the astronaut is the child as explorer. Reading is space travel, and the book is the only warm light in a cold, deep scene, which is why gold equals story.

### 11.3 Memory: world continuity

- Headlines: `En värld som minns henne.`, `Världen minns`, `i en värld som minns`, tagline `sagor som minns er värld`.
- Proof devices: the floating badge `Sixten minns tornet` (with a pulsing gold dot); `nästa bok` [next book] memory tag; `Hjältar, vänner och platser följer med från bok till bok.` [Heroes, friends and places carry over from book to book.]
- Embers remember: `Den här glöden minns något ur en av era böcker.`, `Fånga en gnista som minns en stund ur era böcker`, `Minns igen`. The fire metaphor and the memory metaphor merge here: **an ember is a memory that stays warm.**
- Data model: the sample book's `spec.world` has `shelf`, `embers`, `places`, `friends`, `cast`, `keepsakes`, `skills`, `readJourneys`, `hero`.

### 11.4 Realness and honesty

`Riktiga bilderböcker`, `På riktigt.`, `Inga låtsasval.` [No pretend choices.], `Alla fyra finns på riktigt.` [All four really exist.], the honest ten-minute wait, `Vi säljer aldrig era uppgifter.` [We never sell your data.]
Read: this is the counterweight to "AI". The brand claims craft and truthfulness rather than magic speed.

### 11.5 How the strands combine (Read)

```
             night sky (Natt)  ─── imagination, bedtime, wonder ───┐
                                                                     │
  quill + book ──┐                                                   ▼
                 ├──► FORGE (anvil, fire, smith) ──► gold ──► a real book that REMEMBERS
  anvil + fire ──┘        (craft, effort, honesty)     (value)   (embers, bookshelf, world)
```

Gold is the shared currency. It is the colour of the emblem, of firelight, of the stars, of the glowing book in the astronaut's hands, of the choice stars and of the night-theme CTA.

---

## 12. Read: brand personality and how to reproduce it in film

**Personality:** a warm, slightly old-fashioned Scandinavian craftsperson who works at night. Heirloom rather than toy, and calm rather than hyper. Gilded and storybook-classical in its emblems (Cinzel capitals, gold foil), while the UI around them is soft and modern (rounded pills, frosted cards, grotesk UI type). It is parent-facing and polite (plural *ni/er*), honest about time and AI, and quietly proud of being local.

**To emulate in motion** (guidance, derived from the facts above):

1. **Emblem treatment.** Use [tf-logo.webp](../assets/assets/tf-logo.webp) as a single gold plate. If you need movement, use a slow left-to-right light sweep: the art already carries a horizontal sheen from `#ecbe26` to `#d29914`, so a highlight travelling across it reads as native. Add a soft gold bloom like the nav's `drop-shadow(0 0 14px #f5c54280)`. Do not outline it, recolour it or add a second colour; the site never does.
2. **Wordmark.** Set `TALE FORGE` in Cinzel 700 capitals, with tracking about 0.11 em (3 px at 27.52 px). Use `#f5c542` with `0 2px 6px #050814cc, 0 0 34px #f5c54273` on night and `#6d4fe0` with `0 1px 2px #241f352e, 0 0 24px #6d4fe052` on day. For alpha-matted references use [lockups/nav-lockup__natt__transparent@3x.png](../derived/brand/lockups/nav-lockup__natt__transparent@3x.png).
3. **Lockup geometry.** Emblem height = 1.53 × font size (42 px / 27.52 px) with a 13 px gap, which is 0.47 × font size. On phones: 28 / 16.8 / 8 px.
4. **Night is the hero state.** `#171232` field, nebula plate darkened with `#0b0f1e` at 40–55%, a few twinkling gold and cream points (4.6 s ease-in-out cycle). Morning is the secondary state: lilac watercolour `#ede9f6`, violet ink, and the gold emblem used small.
5. **Fire and wood for "making" beats.** Embers, a hearth bed (`hearth.mp3`), a nailed wooden sign with a Cinzel kicker. Use these for a "your book is being forged" moment rather than progress bars.
6. **Voice.** Morfar Erik is the brand's voice: grandfatherly and calm. Copy should be short, declarative and honest, with one gold-coloured phrase per headline (`span.grad`).
7. **End card.** Emblem + `Tale Forge, sagor som minns er värld.` (or `storybooks that remember your world.`), with `tale-forge.app` in Schibsted Grotesk at the footer's muted lilac `#b7a9d6`.

---

## 13. Inconsistencies and gaps

| Observation | Evidence |
|---|---|
| Three different typefaces carry the name: Cinzel (nav), the Trajan-style emblem lettering, and DejaVu Serif Bold (share image) | sections 3.5, 7 |
| The emblem is never adapted to the morning theme. The gold image sits at under 2:1 contrast on the lilac background while the wordmark next to it turns violet. | [logo-on-themes.webp](../derived/brand/logo-on-themes.webp) |
| No small-size mark: the favicon and 42 px nav image include an illegible wordmark | [icon-sheet.png](../derived/brand/icon-sheet.png) |
| Logo gold (`#d8a216`) does not match any CSS gold (`#f2b22e`, `#f5c542`) | section 3.4 |
| Offer mismatch: "first book free, no card needed" (home) vs "14 days free … Card required" (upgrade) | section 10 |
| The "Läs exempelboken" target `/share/iris-sparade-platsen` returns 404 server-side | [../source/html/share_iris-sparade-platsen.404.sv.html](../source/html/share_iris-sparade-platsen.404.sv.html) |
| Footer version `16ab1756` and `<meta name="tf-release-sha" content="4be07efd…">` name different commits | footer, `<head>` |
| English legal line drops the diacritics ("Varnamo") | footer en |
| Sub-page `<title>`s have no brand name (`Uppgradera`) | section 2.2 |
| No `og:image:alt`, no `<meta name="theme-color">`, and one OG image for both languages | section 6, 7 |
| The hero accent class is named `.grad` but is a flat colour (`color: var(--accent-ink)`, 3q17cp_jgfwol.pretty.css:867-870) | CSS |

---

## 14. Files in derived/brand/

| File | What it shows |
|---|---|
| [logo-on-themes.webp](../derived/brand/logo-on-themes.webp) (2248×1640) | Row 1: tf-logo at 520 px on the flat Natt background `#171232`, over the nebula with the site scrim, on the flat Morgon background `#ede9f6`, and over the morning aurora, each with the measured contrast of the mean gold. Rows 2–3: the live nav lockups at 3× (desktop, mobile) and 1× in both themes, plus contrast notes. |
| [logo-anatomy.png](../derived/brand/logo-anatomy.png) (1900×1280) | Logo at 2× with every component boxed and labelled (quill, 4 sparkles, dots, book, anvil, TALE, FORGE) with source-pixel coordinates, the canvas centre line, margins and proportions. |
| [logo-colour-sheet.png](../derived/brand/logo-colour-sheet.png) (1600×1250) | CIELAB k-means palette (8 swatches with share and L\*), mean, brightest and darkest; the per-column horizontal sheen strip; per-element left-to-right fifths; comparison with the CSS tokens. |
| [wordmark-specimen.webp](../derived/brand/wordmark-specimen.webp) (2800×2768) | All the ways "Tale Forge" is set: logo raster vs Cinzel at the same cap height, nav lockup in Natt and Morgon, OG DejaVu title, reader title, glöd colophon (true size and 3×), the Lora display headline for contrast, and the name in footer and lede text. Rendered with the site's own woff2 files. |
| [og-image-annotated.webp](../derived/brand/og-image-annotated.webp) (1856×1146) | OG image at 1:1 with numbered boxes (logo, title, two cards), layout guides, a legend with all measurements, and enlarged details (logo gap, title, card corner, gutter). |
| [og-font-match.png](../derived/brand/og-font-match.png) (1500×1322) | Evidence that the OG title is DejaVu Serif Bold 84 px: the published crop, a pixel overlay (white = both, red / blue = mismatch), a glyph-run table (±1 px), and candidate fonts (DejaVu, Cinzel, Lora, Liberation Serif) set to the same width. |
| [icon-sheet.png](../derived/brand/icon-sheet.png) (1900×1238) | favicon.ico frames 16/32/48 at 1× on dark and light tabs and at 8×; icon.png (on a checkerboard), apple-icon, icon-192 and icon-512 at 1:1 with content boxes, and the maskable safe circle. |
| [narrator-cast.webp](../derived/brand/narrator-cast.webp) (1632×750) | The four narrator portraits with sv/en names, ids and descriptions; Morfar Erik marked as default. |
| [narrators/portrait-{grandpa,female,male,young}.jpg](../derived/brand/narrators/) | Original 400×400 portraits fetched from `https://tale-forge.app/voices/portrait-<id>.jpg` |
| [logo-parts/](../derived/brand/logo-parts/) | Lossless RGBA crops of tf-logo.webp: `tf-logo__mark-only.png`, `tf-logo__wordmark-only.png`, `tf-logo__trimmed.png` |
| [lockups/](../derived/brand/lockups/) | Live Playwright captures at deviceScaleFactor 3 (section 4.4) + `_capture-meta.json` (computed values and font-load state per capture) |
| [brand.json](../derived/brand/brand.json) | Machine-readable: name, lines (sv/en), wordmark spec, logo palette, theme backgrounds, icons, OG composition, naming (themes, narrators, beds, registers, plans, nouns, traits), pricing |

Method notes: scripts are in the session scratchpad (`tools/brand/`: `capture_nav.js`, `gen_*.py`), not in the library. All live captures were taken on 2026-10-09 without logging in or submitting anything.
