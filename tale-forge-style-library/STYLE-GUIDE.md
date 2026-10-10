# Tale Forge style guide

The master guide to how [tale-forge.app](https://tale-forge.app) looks, moves, sounds and speaks. It condenses the fifteen analysis files in [analysis/](analysis/) into one document. Every value below is copied from shipped code or measured on the live site (captured 2026-10-09/10, release `tf-release-sha 4be07efd68ad299089d33297742e56589f587460`, footer `Version 16ab1756 · 26 sep. 2026`). Interpretation is marked **Read:**. Swedish is quoted verbatim, followed by the site's own English or by a gloss in [brackets].

**CSS citation key.** `G:` = [source/css/3q17cp_jgfwol.pretty.css](source/css/3q17cp_jgfwol.pretty.css) (global sheet, every page) · `S:` = [source/css/2_gt301v4m-60.pretty.css](source/css/2_gt301v4m-60.pretty.css) (onboarding `/start`) · `C:` = [source/css/2h1wwdz1nvxwk.pretty.css](source/css/2h1wwdz1nvxwk.pretty.css) (create sheets, doors) · `H:` = [source/css/37m388zf6rymp.pretty.css](source/css/37m388zf6rymp.pretty.css) (the glöd hearth stage). Numbers after the colon are line numbers in those prettified files.

## Contents

1. [Brand essence and core idea](#1-brand-essence-and-core-idea)
2. [Design principles](#2-design-principles)
3. [The two themes: Natt and Morgon](#3-the-two-themes-natt-and-morgon)
4. [Colour](#4-colour)
5. [Typography](#5-typography)
6. [Layout and spacing](#6-layout-and-spacing)
7. [Surfaces: glass, glows, backdrops](#7-surfaces-glass-glows-backdrops)
8. [Components](#8-components)
9. [Iconography](#9-iconography)
10. [Illustration and imagery](#10-illustration-and-imagery)
11. [Motion](#11-motion)
12. [Sound](#12-sound)
13. [Copy voice](#13-copy-voice)
14. [Story shape, pages and flows](#14-story-shape-pages-and-flows)
15. [Accessibility bar](#15-accessibility-bar)
16. [Known defects and inconsistencies](#16-known-defects-and-inconsistencies)
17. [Do and don't](#17-do-and-dont)
18. [Building with it](#18-building-with-it)

---

## 1. Brand essence and core idea

**The product.** Tale Forge makes personalised picture books for children aged 4 to 9 (age bands `A` 4-5, `B` 6-7 by default, `C` 8-9; [12 §9.1](analysis/12-story-and-content-model.md#91-age-groups-bands)). A parent enters the child's name and age and uploads a photo, or skips it ("Hoppa över, måla en hjälte åt oss" [Skip, paint a hero for us]). The child is painted as the hero, a book is written, painted and narrated in about ten minutes, the story branches twice (two choices, four endings), and **the next book remembers** the hero, the friends, the places and what was learned. It is read aloud at bedtime by a grandfatherly narrator. It is Swedish-first (`<html lang="sv">`, English via the `tf_locale=en` cookie) and made by a small company in Värnamo.

**The core idea in the site's own words:**

| Role | Svenska (verbatim) | English (site's own) | Source |
|---|---|---|---|
| Home H1 (gold words = `span.grad`) | En värld som **minns henne**. | A world that **remembers her**. | [copy/pages/home.sv.md](copy/pages/home.sv.md), [home.en.md](copy/pages/home.en.md) |
| Footer tagline | Tale Forge, sagor som minns er värld. | Tale Forge, storybooks that remember your world. | same |
| Meta description, manifest | Riktiga bilderböcker, skapade för ditt barn. | Real picture books, made for your child. | [source/html/home.sv.html](source/html/home.sv.html), [source/meta/manifest.webmanifest](source/meta/manifest.webmanifest) |
| /start H1 | Ikväll är hjälten **ert barn**. | Tonight the hero is **your child**. | [copy/pages/start.sv.md](copy/pages/start.sv.md) |

**Four metaphor strands** ([01 §11](analysis/01-brand-identity.md#11-the-metaphor-system)):

| Strand | Literal evidence | Read |
|---|---|---|
| **Forge / craft** | The logo is an anvil with an open book and a quill writing in it ([assets/assets/tf-logo.webp](assets/assets/tf-logo.webp), 512×512, one gold, mean `#d8a216`). The waiting screen is *Väntelden* [the waiting fire]; "{names} allra första bok smids nu" [{names}' very first book is being forged now]; "Elden har smitt klart din saga." [The fire has forged your story.] | Making by hand, with effort and fire. Heirloom, not toy. |
| **Night sky / bedtime** | Default theme `natt`; the backdrop is an astronaut reading a glowing book in a violet nebula ([assets/assets/nebula-hero.webp](assets/assets/nebula-hero.webp)); four-point gold sparkles; narrator "Morfar Erik … en mysig godnattstämma" [a cozy bedtime voice] | Reading is exploration; the book is the one warm light in the dark. |
| **Memory** | "Världen minns" [The world remembers]; badge "Sixten minns tornet" [Sixten remembers the tower]; data model `spec.world` with `shelf`, `embers`, `places`, `friends`, `keepsakes`, `skills` ([source/sample-book.iris-och-den-sparade-platsen.json](source/sample-book.iris-och-den-sparade-platsen.json)) | A series that grows with the family. An ember is a memory that stays warm. |
| **Realness / honesty** | "Riktiga bilderböcker" [real picture books], "Inga låtsasval." [No pretend choices.], "Alla fyra finns på riktigt." [All four really exist.], an honest ten-minute wait | The counterweight to "AI". Craft and truthfulness rather than magic speed. |

**Gold is the shared currency.** It is the colour of the emblem, the firelight, the stars, the glowing book in the astronaut's hands, the choice markers and the night-theme button.

**Read: personality.** A warm, slightly old-fashioned Scandinavian craftsperson who works at night. Gilded and storybook-classical in its emblems (Cinzel capitals, gold foil), soft and modern in its interface (pills, frosted glass, a Nordic grotesk). Parent-facing and polite (plural *ni/er*), honest about time and AI, quietly proud of being local. Detail: [analysis/01-brand-identity.md](analysis/01-brand-identity.md), [analysis/12-story-and-content-model.md](analysis/12-story-and-content-model.md).

---

## 2. Design principles

Eight rules that explain most of what the site does. Each is backed by literal evidence.

**P1. Night is the default, and gold is the lamp.**
- Every server HTML ships `<body data-theme="natt">`; there is no `prefers-color-scheme` anywhere; the PWA manifest is `"background_color":"#171232","theme_color":"#171232"` ([06 §1](analysis/06-theming-and-atmosphere.md#1-at-a-glance)).
- At night `--accent` is `var(--gold-soft)` = `#f5c542` (G:496, G:464): the logo, the primary button, focus rings, links and the reader's drop cap all glow gold. Morning keeps gold only for small "lit" markers (pulse dots, stars).
- *So:* design the night frame first. Give each screen one warm light source.

**P2. The book is the brightest, warmest thing on screen.**
- Across all 15 sample-book images, 95% of chromatic pixels are warm and 0% blue-violet; the rendered night backdrop is 98% blue-violet ([02 §16](analysis/02-color.md#16-illustration-colour-versus-ui-colour)).
- Covers sit in a thick `--frame` mat (`#101a30` at night, `#fff` in the morning; G:503, G:552) with a gold halo `0 0 44px #f5c5421f` (G:938-940).
- *So:* never tint illustrations toward the UI violet. The contrast between the two layers is the point.

**P3. Glass over a painted sky.**
- The plate is `position: fixed; height: 100lvh` and never scrolls (G:612-622). Cards are translucent veils: `--card` `#0f1628ad` + `blur(22px)` at night, `#fffc` + `blur(24px)` by day (G:498-500, G:547-549). 240 of the 393 hex literals that ship carry alpha ([02 §6](analysis/02-color.md#6-alpha-everywhere-the-8-digit-hex-pattern)).
- *So:* UI is a pane laid over an illustration, not app chrome. Put small text on glass, not on the painting.

**P4. Serif for the story, grotesk for the controls, Cinzel for the made object.**
- Text elements across 8 pages × 2 languages × 2 viewports: 780 Schibsted Grotesk, 151 Source Serif 4, 88 Lora, 32 Cinzel ([03 §1](analysis/03-typography.md#1-at-a-glance)). Cinzel appears only on the wordmark, book titles, the hearth sign and the book colophon.
- *So:* the family switch, not size, tells you "story" versus "control". The scale stays compact (11-21 px for almost everything below the h1).

**P5. Capsules act, cards hold, books tilt.**
- Every control and label is `border-radius: 999px`; every glass card is 26 px (G:1117); covers are always 2:3 and tilted −8° / +7° in the hero fan (G:948-960), ±4-7° in other fans, 2.5° for paper tags; controls are never rotated ([04 §14](analysis/04-layout-spacing-responsive.md#14-tilt-and-rotation-the-physical-book-vocabulary)).
- *So:* interactive means pill; physical objects get tilt, a frame and a soft drop shadow.

**P6. A slow world and a quick hand.**
- Idle loops run 4.6-9 s on `ease-in-out` per half (starfield 4.6 s, covers 7 s and 8 s, badge 9 s); responses run 0.25 s on a spring that overshoots 11.7% (G:886-903). Peak idle speed is 6.9 px/s ([09 §1](analysis/09-motion-and-interaction.md#1-at-a-glance)).
- *So:* ambient motion never overshoots; overshoot is reserved for things a hand touches. Waiting is staged as a breathing veil or a growing fire; the only spinner is a 26 px arc in the plain fallback job-status card ([05b §6.8](analysis/05b-components-app-and-forms.md#68-jobstatus-the-plain-non-fire-progress-card)).

**P7. Honest craft, not magic.**
- "Det tar ungefär tio minuter, och det säger vi hellre ärligt än låtsas att det går på en sekund." [It takes about ten minutes, and we would rather say that honestly than pretend it takes a second.] The stem "generer-" never occurs in the UI; generation is *måla* [paint], *smida* [forge], *baka* [bake]. AI appears only as a small chip, "Skapad med AI" [Created with AI]. Zero exclamation marks in all Swedish copy ([10 §2](analysis/10-copy-voice-and-tone.md#2-the-voice-on-one-card)).
- *So:* state the limit, then frame it humanly ("Lagom tid för tandborstning och pyjamas." [Just enough time for toothbrushing and pajamas.]).

**P8. The world remembers.**
- *minns* [remembers] occurs 13 times in the Swedish copy. A skill learned in one book becomes the hero's mannerism and the tool that solves the next one (`spec.world.skills` → `canon.hero.mannerism` → `fills.tool`; [12 §8](analysis/12-story-and-content-model.md#8-the-world-remembers-the-continuity-mechanic)). The landing proves it with the floating badge "Sixten minns tornet" and the "nästa bok" [next book] cover.
- *So:* end on continuity. Every surface should show something carried forward.

---

## 3. The two themes: Natt and Morgon

The names are times of day around reading, *Natt* [Night] and *Morgon* [Morning], never "dark" and "light". Toggle: `role="switch"`, `aria-label="Byt tema"` [Switch theme]. Full analysis: [analysis/06-theming-and-atmosphere.md](analysis/06-theming-and-atmosphere.md).

| | **Natt** (default) | **Morgon** |
|---|---|---|
| Read | A reading lamp in a dark room | A watercolour sketchbook at dawn |
| Switch | `body[data-theme="natt"]`, G:493-541 | `body[data-theme="morgon"]`, G:542-590 |
| Canvas (`body` background) | `#171232` (G:606) | `#ede9f6` (G:609-611) |
| Plate | [nebula-hero.webp](assets/assets/nebula-hero.webp) 2400×1340, `object-position: center 30%`, plus scrim and six star dots | [morgon-aurora-desktop.webp](assets/assets/morgon-aurora-desktop.webp) 2560×1440, [-mobile.webp](assets/assets/morgon-aurora-mobile.webp) 1440×2560 below 760 px; no scrim, no stars |
| Plate medium | photographic, cinematic digital painting, bokeh | wet-on-wet watercolour, paper-white centre |
| Rendered plate median | `#262a41` | `#f1e4eb` |
| Headline ink | `#fff7e9` warm cream | `#241f35` plum-black |
| Accent | gold `#f5c542` | violet `#6d4fe0` (text: `#5b3fc7`) |
| Primary button | `linear-gradient(135deg, #ffe08a, #f5c542)`, label `#3a2b10` | `linear-gradient(135deg, #6d4fe0, #5b3fc7)`, label `#fff` |
| Glass | `#0f1628ad` + blur 22 px | `#fffc` + blur 24 px |
| Card shadow | `0 18px 44px #0508146b` | `0 4px 12px #241f351a, 0 22px 52px #241f3529` |
| Frames around pictures | navy `#101a30` | white `#fff` |
| Structure lines | violet-soft `#9b87f5` at 16-60% | violet `#6d4fe0` at 8-45% |
| Wordmark | `#f5c542` + `0 2px 6px #050814cc, 0 0 34px #f5c54273` | `#6d4fe0` + `0 1px 2px #241f352e, 0 0 24px #6d4fe052` |
| h1 shadow | `0 2px 30px #0c082859` | `none` |
| Gold that remains | everywhere | logo mark, pulse dots `#f2b22e`, `.hiw-star` `#f5c542`, map choice strokes, skip link |

**Mechanism.** The server always ships `natt`; an inline script, the first child of `<body>`, reads `localStorage['tf-theme']` before first paint ([source/html/home.sv.html](source/html/home.sv.html)). Both theme blocks declare the same 47 custom properties in the same order. Switching is a 0.5 s `ease` crossfade (`--theme-transition-duration: 0.5s; --theme-transition-easing: ease`, G:470-471) of `body` colours (G:598-608) and of the two fixed plates' opacity (G:612-622, G:667-676). Theme never changes layout: page heights are identical in both.

**What does not change:** the five primitives, the glass rim (violet → gold → coral), the gold logo raster and its `drop-shadow(0 0 14px #f5c54280)` (G:711-716), the violet hover glows, the gold "lit" markers, the warm illustrations, and the wood, brass and parchment of the glöd stage.

**Read:** the two themes are one cycle, dusk-night and dawn, never noon. Both canvases sit on the same ~302° violet hue axis.

---

## 4. Colour

Full analysis: [analysis/02-color.md](analysis/02-color.md). Copy-pasteable tokens: [tokens/color.css](tokens/color.css), machine-readable [tokens/color.json](tokens/color.json).

### 4.1 Primitives (`:root`, G:460-472)

| Primitive | Hex | Role |
|---|---|---|
| `--violet` | `#6d4fe0` | morning accent; violet glows |
| `--violet-soft` | `#9b87f5` | night structure colour: hairlines, pills, toggles, map dots |
| `--gold` | `#f2b22e` | status gold: pulse dots, skip link, left rules |
| `--gold-soft` | `#f5c542` | night accent, logo ink, button end stop, stars |
| `--coral` | `#ff6154` | defined but never `var()`-referenced; used only as raw alpha hex (errors, glass rim) |

### 4.2 Semantic tokens, both themes

All 47 tokens, verbatim. Line numbers are in G (natt block 493-541, morgon block 542-590).

**Ink**

| Token | natt | morgon | Lines |
|---|---|---|---|
| `--page-ink` | `#fff7e9` | `#241f35` | 494 / 543 |
| `--page-sub` | `#d9cfee` | `#5f5878` | 495 / 544 |
| `--micro-ink` | `color-mix(in srgb, var(--page-sub) 85%, transparent)` | `var(--page-sub)` | 510 / 559 |
| `--accent` | `var(--gold-soft)` = `#f5c542` | `#6d4fe0` | 496 / 545 |
| `--accent-ink` | `var(--gold-soft)` = `#f5c542` | `#5b3fc7` | 497 / 546 |
| `--logo-ink` | `#f5c542` | `#6d4fe0` | 537 / 586 |
| `--prose-ink` | `#eae4f5` | `#3a3450` | 526 / 575 |
| `--foot-ink` | `#b7a9d6` | `#5f5878` | 527 / 576 |

**Glass and frames**

| Token | natt | morgon | Lines |
|---|---|---|---|
| `--card` | `#0f1628ad` | `#fffc` | 498 / 547 |
| `--card-line` | `#9b87f542` | `#ffffffe6` | 499 / 548 |
| `--card-blur` | `22px` | `24px` | 500 / 549 |
| `--card-ink` | `#f2eeff` | `#241f35` | 501 / 550 |
| `--card-sub` | `#b5acd3` | `#5f5878` | 502 / 551 |
| `--frame` | `#101a30` | `#fff` | 503 / 552 |
| `--frame-line` | `#9b87f566` | `#ffffffe6` | 504 / 553 |
| `--card-shadow` | `0 18px 44px #0508146b` | `0 4px 12px #241f351a, 0 22px 52px #241f3529` | 536 / 585 |

**Chips, pills and toggles**

| Token | natt | morgon | Lines |
|---|---|---|---|
| `--chip-bg` | `#fff9ec1a` | `#6d4fe014` | 505 / 554 |
| `--chip-line` | `#fff3d942` | `#6d4fe029` | 506 / 555 |
| `--chip-ink` | `#e8dfc9` | `var(--accent-ink)` | 507 / 556 |
| `--pill-bg` | `#9b87f529` | `#6d4fe01a` | 508 / 557 |
| `--pill-ink` | `#c9bcff` | `var(--accent-ink)` | 509 / 558 |
| `--gold-chip-bg` | `#f2b22e29` | `#f2b22e26` | 512 / 561 |
| `--gold-chip-ink` | `#ffd98f` | `#8f6a12` | 513 / 562 |
| `--coral-chip-bg` | `#ff615424` | `#ff61541f` | 514 / 563 |
| `--coral-chip-ink` | `#ffab9f` | `#c23a2b` | 515 / 564 |
| `--trait-line` | `#9b87f559` | `#6d4fe047` | 516 / 565 |
| `--trait-ink` | `#cfc5ec` | `#5f5878` | 517 / 566 |
| `--trait-on-bg` | `#9b87f533` | `#6d4fe01f` | 518 / 567 |
| `--trait-on-line` | `#9b87f599` | `#6d4fe06b` | 519 / 568 |
| `--trait-on-ink` | `#e9e2ff` | `#4a36a8` | 520 / 569 |

**Controls and buttons**

| Token | natt | morgon | Lines |
|---|---|---|---|
| `--btn-grad` | `linear-gradient(135deg, #ffe08a, #f5c542)` | `linear-gradient(135deg, #6d4fe0, #5b3fc7)` | 528 / 577 |
| `--btn-ink` | `#3a2b10` | `#fff` | 529 / 578 |
| `--btn-shadow` | `0 14px 40px #f5c54247` | `0 14px 34px #6d4fe059` | 530 / 579 |
| `--btn-shadow-hover` | `0 20px 55px #f5c5426b` | `0 22px 48px #6d4fe073` | 531 / 580 |
| `--ghost-bg` | `#fff9ec1a` | `#ffffffb8` | 532 / 581 |
| `--ghost-ink` | `#fff3d9` | `#241f35` | 533 / 582 |
| `--control-line` | `#fff3d952` | `#887da0` | 534 / 583 |
| `--ghost-line` | `var(--control-line)` | `var(--control-line)` | 535 / 584 |
| `--choice-bg` | `#ffffff0f` | `#fff` | 522 / 571 |
| `--choice-line` | `#9b87f552` | `#6d4fe038` | 523 / 572 |
| `--choice-ink` | `#f2eeff` | `#241f35` | 524 / 573 |
| `--bar-bg` | `#ffffff24` | `#241f3514` | 525 / 574 |
| `--dash-line` | `#ffecbe59` | `#6d4fe059` | 521 / 570 |

**Light and the story map**

| Token | natt | morgon | Lines |
|---|---|---|---|
| `--h1-shadow` | `0 2px 30px #0c082859` | `none` | 511 / 560 |
| `--logo-shadow` | `0 2px 6px #050814cc, 0 0 34px #f5c54273` | `0 1px 2px #241f352e, 0 0 24px #6d4fe052` | 538 / 587 |
| `--map-dot` | `var(--violet-soft)` = `#9b87f5` | `var(--violet)` = `#6d4fe0` | 539 / 588 |
| `--map-glow` | `#f5c54240` | `#6d4fe033` | 540 / 589 |

Opaque "flat" equivalents of every translucent token (composited over the measured plate medians) are in [02 §3](analysis/02-color.md#3-every-semantic-token-both-themes) and in section 5 of [tokens/color.css](tokens/color.css). Token sheets: [derived/color/semantic-natt.png](derived/color/semantic-natt.png), [derived/color/semantic-morgon.png](derived/color/semantic-morgon.png).

### 4.3 How the colours behave

- **Two jobs at night, one by day.** At night gold is the *light* (accent, logo, button, focus, drop cap) and violet-soft is the *structure* (hairlines, pills, toggles, map dots). Morning collapses both into violet ([02 §5](analysis/02-color.md#5-the-gold-and-violet-accent-swap)).
- **Ink is never pure.** Night text is cream `#fff7e9`, never `#fff`. Shadow ink is navy `#050814`, indigo `#0c0828` or plum `#241f35`, never black in the global sheet ([02 §8](analysis/02-color.md#8-coloured-light-shadows-and-glows)).
- **Glass rim.** Every `.glass` card has a 1 px iridescent edge: `linear-gradient(135deg, #9b87f580, #f2b22e59 50%, #ff61544d)` at `opacity: 0.45` (G:1125-1147).
- **Hearth palette (route-only, theme-independent).** Wood `linear-gradient(178deg, #5e4129, #4a3120 56%, #3c2717)` with `#fbeed2` text (H:89-102); posts `linear-gradient(90deg, #33210f, #553d24 45%, #291908)` (H:73); brass nails `radial-gradient(circle at 35% 30%, #e8d5ac, #6b5335 62%, #2c1e12)` (H:134); ember cores `radial-gradient(circle at 42% 38%, #fff3cf, #ffd98f 45%, #ff9a4c 78%, #e06a24 100%)` (H:541-548; [02 §9.2](analysis/02-color.md#92-the-glöd-stage-hearth--ember-scene)).

### 4.4 Illustration palette (pooled, sample book, k=8 CIELAB)

`#EBCB9E` 18% parchment · `#654619` 17% umber · `#907330` 16% olive-ochre · `#D59E56` 15% honey · `#B96B24` 13% burnt orange · `#291E0F` 12% near-black brown · `#AB2923` 7% raspberry · `#495050` 3% slate. Median L\* 49.8, C\* 36.3 ([02 §16](analysis/02-color.md#16-illustration-colour-versus-ui-colour); [derived/color/illustration-vs-ui.png](derived/color/illustration-vs-ui.png)).

### 4.5 Contrast, measured live ([02 §13](analysis/02-color.md#13-contrast-wcag-measured-on-the-live-site))

| Pair | natt | morgon |
|---|---|---|
| Primary button label on button | 9.44:1 (`#3a2b10` on gold) | 6.21:1 (`#fff` on violet) |
| H1 on plate (median) | 13.02:1 | 13.48:1 |
| H1 accent words (median / worst 5%) | 7.37 / 4.21 | 6.03 / 5.84 |
| Hero lede (median / worst 5%) | 7.42 / **3.61** | 5.65 / 5.39 |
| Voice chip "Morfar" (median / worst 5%) | 5.26 / **2.67** | 5.33 / 5.23 |
| Step number node (`--gold-chip-ink`) | 6.63 | **3.73 (AA fail)** |
| Wordmark `TALE FORGE` | 11.0 | 3.88 at 27.52 px (passes as large text); 3.97 at 16.8 px on mobile (fails) |

---

## 5. Typography

Full analysis: [analysis/03-typography.md](analysis/03-typography.md). Tokens: [tokens/typography.json](tokens/typography.json). Specimens: [derived/typography/specimen-natt.png](derived/typography/specimen-natt.png), [specimen-morgon.png](derived/typography/specimen-morgon.png).

### 5.1 Families and roles (G:460-472)

| Role variable | Family | Weights drawn | Used for | Read |
|---|---|---|---|---|
| `--display` | **Lora** (`var(--font-lora), Georgia, serif`) | 600, 700 | h1-h3, names, book titles, prices, numerals | the picture-book title page |
| `--serif` | **Source Serif 4** (`var(--font-source-serif), Georgia, serif`) | 400, 600 | ledes, body copy, story prose, choices, legal prose | the read-aloud voice |
| `--ui` | **Schibsted Grotesk** (`var(--font-schibsted), "Segoe UI", system-ui, sans-serif`) | 400, 700, 800 | body default, buttons, chips, labels, nav, forms, footer | the Nordic machine |
| `--wordmark` | **Cinzel** (`var(--font-cinzel), "Playfair Display", Georgia, serif`) | 700 (static) | the wordmark, reader and ceremony titles, hearth kicker, book colophon; always uppercase | the seal stamped on the made object |

Self-hosted through `next/font`: 17 WOFF2 subsets, 421 KB, of which the 4 preloaded latin files total 147 KB. `font-display: swap` with `size-adjust` fallback faces. No OpenType features are set; no italic face is loaded (seven italic rules render synthetic italics). All four families are SIL OFL 1.1 ([derived/typography/licences/](derived/typography/licences/)).

### 5.2 Scale

| Role | Selector | Family / weight | Size | Desktop / mobile px | Line-height | Tracking | Lines |
|---|---|---|---|---|---|---|---|
| Hero headline | `h1` | Lora 700 | `clamp(2.7rem, 5.4vw, 4.4rem)` | 70.4 / 43.2 | 1.06 | −0.015em, `text-wrap: balance` | G:855-866 |
| Section headline | `.hiw-headline` | Lora 700 | `clamp(1.9rem, 4vw, 2.7rem)` | 43.2 / 30.4 | normal | −0.015em | G:2554-2561 |
| Section title | `h2` | Lora 600 | `clamp(1.5rem, 2.4vw, 2rem)` | 32 / 24 | normal | −0.01em | G:1055-1062 |
| Step title | `.hiw-step-text h3` | Lora 700 | 1.35rem | 21.6 | normal | 0 | G:2631-2637 |
| Book title | `.book-title` | Lora 700 | 1.02rem | 16.32 | 1.25 | −0.01em | G:1513-1519 |
| Wordmark | `.logo` | Cinzel 700, uppercase | 1.72rem; 1.05rem ≤560 px | 27.52 / 16.8 | — | 3px; 1.5px | G:696-710, G:746-755 |
| Reader title | `.reader-title` | Cinzel 700, uppercase | 2rem; 1.55rem ≤560 px | 32 / 24.8 | 1.18 | 0 | G:1810-1822 |
| Hero lede | `.lede` | Source Serif 4 400 | `clamp(1.08rem, 1.65vw, 1.28rem)` | 20.48 / 17.28 | 1.65 | measure 46ch | G:871-879 |
| Section lede | `.hiw-lede` | Source Serif 4 400 | 1.1rem | 17.6 | 1.7 | 56ch | G:2562-2568 |
| Step body | `.hiw-step-copy` | Source Serif 4 400 | 1.02rem | 16.32 | 1.75 | 52ch | G:2638-2644 |
| Story prose | `.prose` | Source Serif 4 400 | 1.2rem | 19.2 | **1.85** | — | G:1823-1833 |
| Drop cap | `.prose:first-letter` | Source Serif 4 600, `var(--accent)` | 2.5em | 48 | 0.9 | — | G:1834-1841 |
| Button | `.btn` | Grotesk 700 | 1.05rem | 16.8 | — | — | G:886-903 |
| Kicker pill | `.kicker` | Grotesk 700, sentence case | 0.85rem | 13.6 | — | — | G:835-850 |
| Eyebrow | `.hiw-kicker` | Grotesk 700, uppercase | 0.82rem | 13.12 | 2px | — | G:2541-2553 |
| Trait chip | `.trait` | Grotesk 700 | 0.88rem | 14.08 | — | — | G:1223-1238 |
| Micro label | `.chip` | Grotesk 800, uppercase | 0.76rem | 12.16 | 0.05em | — | G:1567-1578 |
| Footer | `.foot` | Grotesk 400 | 0.9rem | 14.4 | — | — | G:1933-1944 |

### 5.3 Treatments

- **The accent phrase.** `h1 .grad { color: var(--accent-ink) }` (G:867-870) is a flat colour, not a gradient. It always covers the last words before the full stop, which refer to the child; the full stop stays in headline ink.
- **Uppercase** only by CSS, only for tiny tracked labels (0.58-0.85rem, 0.04-0.22em) and Cinzel titles. Source strings are sentence case.
- **Weights that resolve differently from what CSS asks.** Grotesk `600` draws at 700, `500` at 400, `900` at 800; Source Serif `700` at 600 ([03 §4](analysis/03-typography.md#4-weights-declared-vs-drawn-measured)). Specify only drawn weights.
- **Swedish.** All four families carry å ä ö é. The h1's 1.06 leading is tight for a capital Å/Ä/Ö on a wrapped line ([03 §10](analysis/03-typography.md#10-swedish-typesetting-and-diacritics)).

---

## 6. Layout and spacing

Full analysis: [analysis/04-layout-spacing-responsive.md](analysis/04-layout-spacing-responsive.md). Tokens: [tokens/layout.json](tokens/layout.json).

**Skeleton.** `body` → two fixed `.bg` plates (z 0) → `.wrap` (z 1) → `.shell` (`width: min(1120px, 100%); padding: 0 28px; min-height: 100dvh`, flex column, G:681-688) → `nav` (static, never sticky, 96 px tall on desktop) → `main#main-content` → `.foot` (`margin-top: auto`, G:1933-1944). Content column: 1064 px at desktop, 334 px at 390 px.

**Column widths in use:** 440 (auth, 404) · 560 (pricing, start step card) · 600 · 680 (reader feedback) · 760 (legal) · 980 (adventure launcher) · 1120 (stage). **Text measures:** 46ch (lede), 52ch (step), 56ch (section lede), 62ch, 72ch (captions) ([04 §4](analysis/04-layout-spacing-responsive.md#4-containers-column-widths-and-text-measures)).

**Spacing.** No spacing tokens exist; all values are literal px. De-facto scale: **4 · 6 · 8 · 10 · 12 · 14 · 16 · 18 · 20 · 22 · 24 · 26 · 28 · 30 · 34 · 36 · 40 · 44** ([derived/layout/inventory/spacing-declarations.csv](derived/layout/inventory/spacing-declarations.csv)).

| Role | Value |
|---|---|
| Page gutter | 28 at every width |
| Nav padding-y | 22 (14 ≤560 px) |
| Section open / close | 44 / 8 (52 between sections) |
| Between how-it-works steps | 36 |
| Section head → content | 22 |
| Hero grid | `1.05fr 0.95fr`, gap 40, `min-height: 64vh`, `padding: 4vh 0 2vh` (G:827-834) |
| Card padding | 22 (step card) · 26 (builder) · 28 (page card) · 34 (auth, legal) |
| Sibling gaps | 9-18 |

Roles and sources: [04 §6](analysis/04-layout-spacing-responsive.md#6-vertical-rhythm-measured), [04 §8](analysis/04-layout-spacing-responsive.md#8-the-de-facto-spacing-scale).

**Radius grows with size:** 999 px every pill · 50% dots, nodes, FAB · 6 skip link · 8 icon buttons · 12 tags, signboard · 14 small covers, inputs · 16 choices, fields · 18 badges, dashed slots · 20 hero book cards · 22 shelf books · 24 frames, bottom sheets · **26 every glass card** · 28/30/32 portrait frames ([04 §9](analysis/04-layout-spacing-responsive.md#9-border-radius-scale), [radius-inventory.csv](derived/layout/inventory/radius-inventory.csv)).

**Aspect ratios:** covers **2:3** (art files 848×1264); reader scene 3:2 (1264/848; 16:9 ≤560 px); adventure art 16:9; easel 3:4 (S:287-298).

**Tilt:** hero books −8° and +7°; fanned cards ±4-7°; paper tags 2.5°; hearth props under 2°; book hover −1°; controls 0° ([04 §13-14](analysis/04-layout-spacing-responsive.md#13-aspect-ratios)).

**Breakpoints** (desktop-first, `max-width` only, 31 blocks; [derived/layout/media-queries.csv](derived/layout/media-queries.csv)): **880** hero and builder to one column, fan 340 px, steps become `44px 1fr` (G:2243-2275, G:3146-3170) · **760** create picker, styles grid 4→2 · **720** story map swaps to the mobile SVG (G:3171-3200) · **700** sheets become bottom sheets (C:325-343) · **600** adventure cards become a 92 px art row · **560** compact nav and icon-only theme toggle (G:746-767, G:2286-2348) · 480 · 400. The hearth stage uses `min-width: 860px` and `1800px`.

**Tap targets:** `min-height: 44px` on the toggle, traits, nav pills, language buttons, sound controls and map buttons; `.btn` 52 px; `.choice` 54 px ([04 §15](analysis/04-layout-spacing-responsive.md#15-tap-targets), [derived/layout/inventory/tap-target-inventory.csv](derived/layout/inventory/tap-target-inventory.csv)).

---

## 7. Surfaces: glass, glows, backdrops

Full analysis: [analysis/06-theming-and-atmosphere.md](analysis/06-theming-and-atmosphere.md), [02 §8](analysis/02-color.md#8-coloured-light-shadows-and-glows), [04 §10-12](analysis/04-layout-spacing-responsive.md#10-elevation-shadows-and-hover-lifts).

### 7.1 The night backdrop stack (G:612-656)

```html
<div class="bg bg-night"><img src="/assets/nebula-hero.webp" alt=""/><div class="scrim"></div><div class="starfield"></div></div>
<div class="bg bg-day"><picture><source media="(max-width: 760px)" srcSet="/assets/morgon-aurora-mobile.webp"/><img src="/assets/morgon-aurora-desktop.webp" alt=""/></picture></div>
```

- **Scrim:** `linear-gradient(#0b0f1e61 0%, #0b0f1e80 45%, #0d1122bd 100%)` (G:631-635). It cuts bright patches behind the hero by about 70% and lifts the lede from 1.63:1 to 4.65:1 at the 90th percentile ([06 §11](analysis/06-theming-and-atmosphere.md#11-how-text-stays-legible-over-the-paintings)).
- **Starfield:** six radial-gradient dots, 1-1.6 px, in the top quarter: `#ffe9b0e6`, `#f5f0e8cc`, `#f5c542d9`, `#f5f0e8b3`, `#ffe9b0bf`, `#9b87f599`, twinkling opacity 0.95 ↔ 0.55 over `4.6s ease-in-out infinite` (G:636-656). The painting supplies all other stars.
- Plates for compositing (live captures of the `.bg` layer alone): [derived/color/backdrop-layer__natt__desktop.png](derived/color/backdrop-layer__natt__desktop.png), [backdrop-layer__morgon__desktop.png](derived/color/backdrop-layer__morgon__desktop.png).

### 7.2 Glass (G:1110-1147)

Abridged; the full rule, with `-webkit-` prefixes, the mask properties and the 0.5 s colour transitions, is at G:1110-1147.

```css
.glass {
  background: var(--card);
  backdrop-filter: blur(var(--card-blur));
  border: 1px solid var(--card-line);
  box-shadow: var(--card-shadow);
  color: var(--card-ink);
  border-radius: 26px;
}
.glass:before { /* 1px rim via mask-composite: exclude */
  opacity: 0.45;
  background: linear-gradient(135deg, #9b87f580, #f2b22e59 50%, #ff61544d);
  border-radius: 26px;
  padding: 1px;
}
```

**Blur ladder** (blur grows with surface size): chips `.kicker`, `.sec-chip`, `.hiw-ai-chip` 10 px (G:839-840, G:1091-1092, G:2687-2688) · `.btn-ghost` 14 px (G:918-924) · glass cards 22 / 24 px · modal scrims only 6 px over `#0a081980` (C:241-244) · reader art background `filter: blur(26px) saturate(1.08)` at `scale(1.18)`, so the letterbox is the page's own colours (G:1784-1793).

### 7.3 Elevation and glow

| Level | Value | Used by |
|---|---|---|
| contact | `0 10px 22px #0a072040` | friend avatars (G:1309) |
| frame | `0 16px 36px #0a07204d` | portrait frames (G:1175) |
| card | `var(--card-shadow)` | glass, books, badge (G:1115, G:987) |
| hero book | `0 24px 50px #0a072066, 0 0 44px #f5c5421f` | `.fan .fbook` (G:938-940) |
| easel (deepest) | `0 30px 70px #0508148c, 0 0 60px #f5c54224` | `.start-flow .easel` (S:295-297) |
| violet hover | `0 14px 30px #6d4fe02e` | `.choice:hover` (G:1923-1927) |
| button gloss | `var(--btn-shadow), inset 0 1px 0 #ffffff73` | `.btn-primary` (G:907-913) |
| live dot ring | `0 0 #f2b22e73` → `0 0 0 12px #f2b22e00` over 2.4 s | `.badge .dotpulse` (G:1010-1029) |

Shadows always fall straight down with a blur 2-3× the offset. "Important" is expressed as a coloured glow (gold at night, violet by day), never as a darker shadow.

---

## 8. Components

Full inventories: [analysis/05a-components-landing.md](analysis/05a-components-landing.md) (63 landing components, each cropped in four theme/viewport variants in [screenshots/components/landing/](screenshots/components/landing/)) and [analysis/05b-components-app-and-forms.md](analysis/05b-components-app-and-forms.md) (auth, pricing, `/start` s0-s8, the waiting fire, the reader; crops in [screenshots/components/app/](screenshots/components/app/)).

**Four shared recipes** cover almost everything ([05a §2](analysis/05a-components-landing.md#2-the-four-shared-recipes-pill-chip-glass-gradient-button)):

| Recipe | Literal | Used by |
|---|---|---|
| **Pill** | `border-radius: 999px`, `min-height: 44px` (buttons 52-56) | buttons, chips, kicker, traits, toggle, nav links, language switch |
| **Chip** | `--chip-bg / --chip-line / --chip-ink`, `blur(10px)`; violet `--pill-*`; gold `--gold-chip-*` | kicker, section chip, voice chip, eyebrow, genre tags, step nodes |
| **Glass card** | §7.2 | portrait, friend, adventure, reader-mock, map and memory cards; builder and friends cards |
| **Gradient button** | `--btn-grad`, `--btn-ink`, `--btn-shadow`; `padding: 17px 30px; min-height: 52px` (G:886-903) | `.btn-primary`, narrator play pill, theme-toggle thumb, pencil FAB |

**Signature components.**
- **Theme toggle** `.tt` (G:768-826): a pill track with a sliding thumb that is a little gradient button (`width: calc(50% - 4px)`, `.5s cubic-bezier(.2,.7,.3,1.2)`); labels "Natt" / "Morgon" with moon and sun icons; icons only ≤560 px.
- **Hero stack:** kicker chip → h1 (one sentence) → serif lede (two sentences) → primary CTA "Skapa er hjälte" [Create your hero] → one-line microcopy → ghost CTA "Se hur det funkar" [See how it works].
- **Cover fan** `.fan` (`height: min(58vh, 540px)`): two framed 2:3 covers tilted −8°/+7° floating on 7 s and 8 s, plus a glass memory badge "Sixten minns tornet" with a pulsing gold dot on 9 s.
- **How-it-works rail:** six zig-zag steps (`.hiw-step--flip`), a 2 px dashed `--dash-line` rail (G:2587-2595) with 40 px gold-ringed numbered nodes (G:2599-2613), each step ending in a gold four-point star micro line.
- **Endings map:** an SVG tree (960×540 desktop, 360×620 mobile) whose lit route draws itself and cycles through the four endings ([08 §8](analysis/08-iconography-and-svg.md#8-the-endings-map)).
- **Book card** `.book`: 5 px `--frame` border, radius 22, 2:3 art, hover `translateY(-10px) rotate(-1deg)` on a 0.35 s soft spring (G:1485-1505).
- **Trait chips** `.trait` / `.trait.on` (G:1223-1246): 2 px outline pills that fill violet when chosen.

**Craft objects at the emotional peaks** (app). Ordinary UI is glass on a painted sky; the moments that matter turn into objects: the **easel** with a breathing veil and a 5 s unveil (S:287-298), the **wooden signpost** with brass nails and a Cinzel `VÄNTELDEN` kicker on a canvas fire (H:61-166), a cloth-bound book with a blind-stamped frame, and a plank button "Öppna boken" [Open the book] (H:982-1051). Wood, brass and parchment stay the same in both themes.

**Read:** demo-as-interface. The landing never shows product screenshots; it rebuilds miniature, real-CSS versions of the product's own widgets and fills them with one sample family (Alva, Noah, Sixten the fox) and one sample book (Iris).

---

## 9. Iconography

Full analysis: [analysis/08-iconography-and-svg.md](analysis/08-iconography-and-svg.md). Clean SVGs: [derived/icons/svg/](derived/icons/svg/); sheets: [derived/icons/icon-sheet-natt.png](derived/icons/icon-sheet-natt.png), [icon-sheet-morgon.png](derived/icons/icon-sheet-morgon.png).

- **No icon library or icon font.** 34 hand-maintained inline drawings (33 Tale Forge plus the Google "G"), started from Feather and Lucide and re-tuned.
- **Grid:** 24×24 viewBox, live area about 2-22, one-decimal coordinates, paths/circles/rects only.
- **Stroke:** `fill="none" stroke="currentColor" stroke-linecap="round"`; joins round on 26 of 30 stroked icons. Weights: 2 for forms and system, 2.2-2.4 for marketing chrome at 14-18 px, 1.7-1.8 for friendly character glyphs at 26-34 px. Fills only for media verbs (play, pause) and the sparkle.
- **Colour** always from the parent through `currentColor` (`--chip-ink`, `--ghost-ink`, `--btn-ink`, `--accent`…), so icons re-theme for free.
- **Containers:** icons rarely sit bare; they live in a 42 px gold FAB, a 46 px chip tile (r 14), a 44 px transport square (r 8) or a dashed "add" card.
- **Decorative grammar:** *twinkles* (the concave four-point sparkle `M12 2c.7 5.6 4.4 9.3 10 10-5.6.7-9.3 4.4-10 10-.7-5.6-4.4-9.3-10-10 5.6-.7 9.3-4.4 10-10z` in `#f5c542`; `.hiw-star` 14 px, G:2655-2660), *trails* (dotted `stroke-dasharray: 0.1 8` and 2 px dashed `--dash-line`), *rings* (gold-edged nodes and medallions).
- **Emoji in UI copy: 0.** Unicode glyphs used as icons: `·` `+` `✓` `×` `✦` (arrows, `✧`, `♫`, `◇` only on the book-fair sub-brand).

---

## 10. Illustration and imagery

Full analysis: [analysis/07-illustration-and-imagery.md](analysis/07-illustration-and-imagery.md). Prompts: [prompts/](prompts/).

**The style block, verbatim** ([prompts/style-block.txt](prompts/style-block.txt); `styleBlock` in [source/sample-book.iris-och-den-sparade-platsen.json](source/sample-book.iris-och-den-sparade-platsen.json)). It is the last line of all 15 image prompts (cover + 14 pages):

```text
Warm watercolor and colored-pencil children's-book illustration style, soft light, rounded shapes, expressive small gestures. Absolutely no text, no letters, no numbers, no labels, no signage anywhere in the image.
```

**Prompt anatomy** (identical in all 15, [07 §11](analysis/07-illustration-and-imagery.md#11-the-prompt-system-literally)): a 55-72-word shot paragraph opening with a phase tag and a shot type ("Pre-choice. Wide establishing frame…") → the fixed header `Appearance reference for entities already named in the shot above. Never add a character, object, flower, or prop merely because it is listed here:` → one line per entity present, `<Role> <Name>, <kind>: <look>` with the look in **Swedish** → `Style: ` + the style block. Model: `azure-images:gpt-image-2` for the cover and portraits.

**What the pictures look like** (measured): watercolour washes with blooms, coloured-pencil hatching on top, warm-brown broken outlines (never black ink), toned cream paper, rounded forms, indoor evening window light. 72-96% of each image's pixels are warm-hued; cool hues never exceed 3.9%. Pages are 1536×1024 (3:2; S1 and S4A 1264×848), the cover 1024×1536 (2:3).

**Image families** (keep them distinct): storybook watercolour (the product) · Alva ink-and-wash (demo covers and avatars) · white-paper vignettes (narrator portraits) · painterly fantasy cards (adventure choices) · the cinematic nebula (night plate) · atmospheric wet washes (morning plates, the blank "next book" cover).

**Framing in the UI:** pictures sit in a solid 3-6 px `--frame` border (or a 10 px mat) with 14-30 px corners ([07 §12](analysis/07-illustration-and-imagery.md#12-how-images-are-framed-in-the-ui-css)), tilted when they are covers; in the reader the page sits over a 26 px blurred copy of itself.

**Canon colour words:** Iris *hallonröd regnjacka och gula stövlar* [raspberry-red raincoat and yellow boots]; Mossa *liten brun skogsmus med grön halsduk* [small brown forest mouse with a green scarf]; the library *en mjuk grön matta* [a soft green rug]; the pen *blanka silverstreck* [shiny silver lines].

---

## 11. Motion

Full analysis: [analysis/09-motion-and-interaction.md](analysis/09-motion-and-interaction.md). Spec for film: [derived/motion/motion-spec.json](derived/motion/motion-spec.json), Remotion helpers [derived/motion/motion-tokens.ts](derived/motion/motion-tokens.ts), clips [derived/motion/clips/](derived/motion/clips/).

**Curves**

| Name | Value | Used for |
|---|---|---|
| `ease` | `cubic-bezier(.25,.1,.25,1)` | theme crossfade, colour and shadow fades, pulse |
| `ease-in-out` | `cubic-bezier(.42,0,.58,1)`, applied per keyframe segment | **every idle loop** (pendulum: stops dead at both ends) |
| `ease-out` | `cubic-bezier(0,0,.58,1)` | story-map path draw, rising embers |
| settle | `cubic-bezier(.2,.7,.3,1)` | `.reveal` 0.7 s (G:1099-1105), screen enter 0.45 s (S:11-12) |
| soft spring | `cubic-bezier(.2,.7,.3,1.2)`, overshoot 4.4% | objects that land: fan covers, toggle thumb, book card, choices |
| spring | `cubic-bezier(.2,.7,.3,1.4)`, overshoot 11.7% | things you press: `.btn`, FAB, play pill, unveil pop |

**Key timings**

| Motif | Literal | Source |
|---|---|---|
| Starfield twinkle | opacity .95 ↔ .55, `4.6s ease-in-out infinite` | G:636-656 |
| Hero covers | `float1` 7 s: −8° → −8.6°, −12 px; `float2` 8 s: 7° → 7.6°, −16 px | G:948-979 |
| Memory badge | `floatBadge` 9 s: 2.5° → 3°, −7 px | G:995-1009 |
| Live dot | `pulse` 2.4 s, gold ring to 12 px | G:1010-1029 |
| Press | `.btn` `transform .25s cubic-bezier(.2,.7,.3,1.4)`; hover `translateY(-3px)`; active `scale(0.96)` | G:886-917 |
| Theme switch | 0.5 s `ease`; plate 50% at 147 ms, 90% at 311 ms; thumb overshoots +4.2 px at about 350-367 ms | G:470-471; [06 §7](analysis/06-theming-and-atmosphere.md#7-the-crossfade-between-themes-measured) |
| Story map | `stroke-dashoffset 0.9s ease-out`; first draw 0.6 s after 40% visible, next route every 4.5 s | G:2942-2946; JS |
| Screen enter | `tfStartIn` 0.45 s settle, from `translateY(22px)`, no exit animation | S:1-12 |
| Portrait unveil | blur 26 → 20 → 7 → 0 px in phases at 0 / 1.1 / 2.6 s, each 1.5 s; button pop `0.42s cubic-bezier(.2,.7,.3,1.4)` | S:299-336, S:510-526 |

The three hero loops (7, 8, 9 s) are pairwise coprime, so the fan repeats its exact pose only every 504 s.

**Reduced motion** (`@media (prefers-reduced-motion: reduce)`, G:2349-2372 and four more blocks): floats, pulses, twinkle and reveals switch off; glows freeze at mid-opacity; short opacity fades (0.2-0.4 s) stay.

**Read: the personality.** Bedtime tempo: the world breathes on 4.6-9 s loops while touched things answer in 0.25 s (about 30:1). Light is the effect: rings that grow, glows that breathe, a gold sheen, a path that draws itself. Colour changes are dissolves, never wipes. Transitions between scenes are a cut followed by a 0.45 s settle-in from 22 px below. Waiting never shows a spinner on the storybook surfaces (the fallback job-status card has one, a 270° arc spun by SMIL `animateTransform` in 0.8 s).

---

## 12. Sound

Full analysis: [analysis/11-audio-and-voice.md](analysis/11-audio-and-voice.md). Files: [assets/audio/](assets/audio/), [assets/share/iris-sparade-platsen/assets/](assets/share/iris-sparade-platsen/assets/).

**The narrator is the brand's voice.** Default `grandpa` = **Morfar Erik** [Grandpa Erik; *morfar* = mother's father], "En varm, vis berättare med en mysig godnattstämma" / "A warm, wise storyteller with a cozy bedtime voice". Engine on all 14 sample pages: `vertex-gemini-tts:gemini-3.1-flash-tts-preview:Enceladus`. Measured: 87-115 words/min (mean 102), pauses fill 20% of speech time, median F0 93-119 Hz (low male), rising about +2.7 semitones on quoted dialogue. The other voices: *Berättaren Lily* [Storyteller Lily], *Berättaren Marcus* [Narrator Marcus], *Unga Saga* [Young Saga].

**Ambient beds** (`AMBIENT_BEDS`, [source/js/1pgfdvt65g9p-.js](source/js/1pgfdvt65g9p-.js); all 30.000 s, 128 kb/s MP3, 44.1 kHz stereo, loop seamlessly):

| id | Svenska | English | Group | File |
|---|---|---|---|---|
| `hearth` (default) | Brasa | Fireplace | ambience | [hearth.mp3](assets/audio/atmosphere/v1/hearth.mp3) |
| `rain` | Fönsterregn | Window rain | ambience | [rain.mp3](assets/audio/atmosphere/v1/rain.mp3) |
| `forest` | Sagoskogen | Enchanted forest | ambience | [forest.mp3](assets/audio/atmosphere/v1/forest.mp3) |
| `musicbox` | Speldosa | Music box | music | [musicbox.mp3](assets/audio/atmosphere/v1/musicbox.mp3) |
| `harp` | Månharpa | Moonlit harp | music | [harp.mp3](assets/audio/atmosphere/v1/harp.mp3) |
| `fire` | Glödljus | Ember glow | music | [fire.mp3](assets/audio/atmosphere/v1/fire.mp3) |

**Levels** ([11 §3.8](analysis/11-audio-and-voice.md#38-level-design-what-the-listener-actually-hears)):

| Signal | File loudness | Gain | Heard at |
|---|---|---|---|
| Narration | −18.5 … −19.9 LUFS-I, TP −2.0 … −2.4 dBTP | 1.0 | ≈ −19 LUFS |
| Bed, default `DEFAULT_BED_VOLUME` 0.18 | −24.3 … −24.7 LUFS-I | −14.9 dB | ≈ −39.3 LUFS (≈ 20 LU under the voice) |
| Bed, maximum `MAX_BED_VOLUME` 0.4 | same | −8.0 dB | ≈ −32.4 LUFS |

No autoplay and no interface sounds: every sound starts from a click. **Read:** voice first, everything else far under it; warm interior at night (fire, rain on the window, a music box); plucked and struck lullaby music, no percussion. Nobody listened to these files for this library: all timbre statements come from measurements.

---

## 13. Copy voice

Full analysis: [analysis/10-copy-voice-and-tone.md](analysis/10-copy-voice-and-tone.md). Copy decks: [copy/pages/](copy/pages/); all app strings: [copy/app-strings.md](copy/app-strings.md); glossary: [copy/glossary.md](copy/glossary.md).

**Verbatim lines** (Swedish first; the English is the site's own):

| # | Svenska | English | Where |
|---|---|---|---|
| 1 | En värld som minns henne. | A world that remembers her. | home h1 |
| 2 | Ikväll är hjälten ert barn. | Tonight the hero is your child. | /start h1 |
| 3 | Den målade hjälten återvänder. Valen förändrar vad som händer, och senare böcker minns äventyren ni redan har delat. | The painted hero returns. Choices change what happens, and later books remember the adventures you have already shared. | home lede |
| 4 | Skapa er hjälte | Create your hero | primary CTA |
| 5 | Första boken är gratis, inget kort behövs. Sedan 149 kr i månaden. | The first book is free, no card needed. After that $14.99 a month. | CTA microcopy |
| 6 | Det tar ungefär tio minuter, och det säger vi hellre ärligt än låtsas att det går på en sekund. | It takes about ten minutes, and we would rather say that honestly than pretend it takes a second. | home step 3 |
| 7 | Lagom tid för tandborstning och pyjamas. | Just enough time for toothbrushing and pajamas. | home step 3 micro |
| 8 | Inga låtsasval. Båda vägarna är skrivna, målade och inlästa. | No pretend choices. Both paths are written, painted, and narrated. | home step 4 micro |
| 9 | Ni fyller inte en hylla med lösa sagor. Ni bygger en värld. | You are not filling a shelf with loose stories. You are building a world. | home step 6 |
| 10 | Fotot används bara för att måla porträttet. Det tränar aldrig någon AI, och ni kan radera det när som helst. | The photo is only used to paint the portrait. It never trains any AI, and you can delete it whenever you like. | /start photo step |
| 11 | Boken lägger sig i bokhyllan när den är klar. | The book lands on the bookshelf when it is ready. | waiting, launch (12 times) |
| 12 | Väntelden. Fånga en glöd för att se vad den minns. | The waiting fire. Touch an ember to see what it remembers. | waiting-fire canvas label |
| 13 | Smedjan är tom just nu | The smithy is empty right now | capacity notice |
| 14 | Elden har smitt klart din saga. | The fire has forged your story. | waiting-fire finale |
| 15 | Vi håller sagorna snälla och trygga. Prova gärna andra ord. | Let's keep our stories kind and safe! Please try different words. | moderation |
| 16 | Den här sidan har vandrat iväg i sagovärlden. | This page wandered off into the story world. | 404 |
| 17 | Tale Forge, sagor som minns er värld. | Tale Forge, storybooks that remember your world. | footer |

**Rules** ([10 §14](analysis/10-copy-voice-and-tone.md#14-reproducing-the-voice)):
1. Swedish first. Address the family in the plural *ni / er*; use singular *du* only where one adult signs, pays or gives feedback, and when speaking to the child.
2. One idea per sentence, 7-8 words (non-legal body copy mean 8.1-8.4 words). Headlines 3-5 words. Close a claim with a short fragment: "På riktigt." [For real.]
3. Display headlines are one declarative sentence ending in a full stop, with the child last and in the accent colour. Section titles have no full stop. Decisions are questions: "Vem följer med?" [Who comes along?]
4. Craft verbs (*måla, smida, baka, skriva, läsa in*); never "generera". AI is a colophon, "Skapad med AI", not a pitch.
5. State the time and the limit, then frame it humanly. Reassure with the refrain ("… lägger sig i bokhyllan när den är klar", "Allt ni byggt är kvar." [Everything you built is still here.]).
6. Typography of copy: no `!` in Swedish, no dashes, three full stops for loading labels ("Målar..." [Painting...]), straight quotes, `·` between metadata, digits for service counts and prices, words for story numbers ("fyra olika slut" [four different endings]). Sentence case in source; uppercase only via CSS.
7. CTAs are an imperative verb plus an object, 1-4 words, often with *er*: "Skapa er hjälte", "Läs exempelboken" [Read the sample book], "Sätt igång" [Light it]. Never "Köp" or "Kom igång".

---

## 14. Story shape, pages and flows

Full analysis: [analysis/12-story-and-content-model.md](analysis/12-story-and-content-model.md), [analysis/13-pages-ia-and-flows.md](analysis/13-pages-ia-and-flows.md).

- **Book shape.** 6 slots, 14 beats, 2 choices (after slot 2 `kind:"path"`, after slot 4 `kind:"ordeal"`), 4 endings, 6 pages per reading plus a cover. Engine `causal-foundry-v1`. Every option names an equal gain and cost; no option is marked better; every ending closes on a warm reading tableau where the hero makes room for someone ([12 §3](analysis/12-story-and-content-model.md#3-the-branching-graph); [derived/story/branch-graph.webp](derived/story/branch-graph.webp)).
- **Prose.** Sample book *Iris och den sparade platsen* [Iris and the Saved Place]: 1,514 words, 8.51 words per sentence, LIX 27.8 (easy), age band "6 till 7 år" [6 to 7 years]. Full text: [copy/sample-book-text.sv.md](copy/sample-book-text.sv.md).
- **Two page templates.** The *storybook scroll* (home, `/start` s0: hero, zig-zag steps, cards over the plate; home is 4994 px tall at 1440) and the *quiet card* (login, signup, 404, pricing, legal: one centred glass card 440 / 560 / 760 px wide).
- **Journey.** `/` → `/start` s0-s8 (one URL, draft in `localStorage['tf-start-draft']`) → the waiting fire (s7) → hand-over "Lämna över till {namn}." [Hand it over to {name}.] → the reader. Gated routes (`/konto`, `/create`, `/valkommen`, `/reader/{id}`) answer 307 to `/login?returnTo=…`. Language is a cookie; the URL never changes.

---

## 15. Accessibility bar

Full analysis: [analysis/14-accessibility-and-craft.md](analysis/14-accessibility-and-craft.md) (axe-core 4.14.0, 36 runs; contrast matrix [derived/a11y/contrast.csv](derived/a11y/contrast.csv)).

Hold new work to at least what ships, and to the fixes the site still needs:

| Area | Bar | What ships |
|---|---|---|
| Language | `lang="sv"` or `"en"` server-side; brand name `translate="no"` | Done; legal columns wrap each language in `lang` |
| Contrast | AA everywhere, measured over the plate's bright 5%, not only the median | Buttons 9.4:1 / 6.2:1; body copy passes on the median; worst-5% night text dips to 2.67:1; morgon gold-chip ink 3.73:1 and footer meta fail |
| Focus | The house ring on every control: `outline: 3px solid var(--accent); outline-offset: 3px; box-shadow: 0 0 0 6px color-mix(in srgb, var(--card) 88%, transparent)` (G:822-826) | Only 5 custom `:focus-visible` rules; most controls show the browser ring |
| Targets | ≥ 44 × 44 px | Nav, toggle, language, traits, sound controls pass; FAB is 42 px |
| Motion | Respect `prefers-reduced-motion`: freeze loops at a mid pose, keep ≤ 0.4 s fades, hold glows at ~60% | 6 → 2 running animations under `reduce`; the hero badge float and its dot leak |
| Structure | One `h1` per page, `<footer>` landmark, per-route `<title>` | 404 has only an `h2`; footer is a `div` (axe `region` 36/36); five routes titled just "Tale Forge" |
| Skip link | Reachable by the first Tab | Present but unreachable (`visibility: hidden`, G:486-488) |
| Fonts | Preload, `swap`, metric-matched fallbacks | Done |

---

## 16. Known defects and inconsistencies

Observed on the live site or in shipped code. Treat these as things **not** to copy.

| # | Defect | Evidence |
|---|---|---|
| 1 | The advertised sample book `/share/iris-sparade-platsen` returns 404 from four entry points (home ×2, `/start` gallery, `/uppgradera` cover); its tab title still resolves to the book | [source/html/share_iris-sparade-platsen.404.sv.html](source/html/share_iris-sparade-platsen.404.sv.html); [13 §5.8](analysis/13-pages-ia-and-flows.md#58-shareiris-sparade-platsen-the-broken-sample-book-link) |
| 2 | The skip link can never be focused | G:486-488; [14 §4](analysis/14-accessibility-and-craft.md#4-the-skip-link-hoppa-till-innehållet) |
| 3 | Footer `Version 16ab1756` names a different commit from `<meta name="tf-release-sha" content="4be07efd…">` | [source/html/home.sv.html](source/html/home.sv.html) |
| 4 | Three typefaces carry the name: Cinzel (nav), Trajan-style lettering in the logo raster, DejaVu Serif Bold in the OG image | [01 §13](analysis/01-brand-identity.md#13-inconsistencies-and-gaps) |
| 5 | The logo gold (`#d8a216`) matches no CSS gold (`#f2b22e`, `#f5c542`); the emblem never adapts to Morgon (under 2:1 on lilac) and has no small-size variant | [derived/brand/logo-on-themes.png](derived/brand/logo-on-themes.png) |
| 6 | Offer mismatch: "Första boken är gratis, inget kort behövs." [first book free, no card needed] vs "14 dagar gratis, avsluta när du vill. Kort krävs." [14 days free … Card required.] | [10 §7](analysis/10-copy-voice-and-tone.md#7-price-and-free-trial-phrasing) |
| 7 | `.grad` is a flat colour, not a gradient (G:867-870) | [03 §15](analysis/03-typography.md#15-inconsistencies-and-gaps) |
| 8 | Phantom weights (Grotesk 600 → 700, 500 → 400), synthetic italics, 62 literal font sizes and no size or spacing tokens | [03 §4](analysis/03-typography.md#4-weights-declared-vs-drawn-measured), [04 §8](analysis/04-layout-spacing-responsive.md#8-the-de-facto-spacing-scale) |
| 9 | Theme switch: gradients, text-shadows and inline-styled nav pills snap at frame 0 while text fades; h1 contrast drops to 1.11:1 at 150 ms | [06 §7.2](analysis/06-theming-and-atmosphere.md#72-what-fades-and-what-snaps) |
| 10 | `.btn-primary:hover` overrides `.btn:active`, so the mouse press is swallowed and the inset gloss drops on hover (G:904-917) | [05a §15](analysis/05a-components-landing.md#15-defects-inconsistencies-and-gaps) |
| 11 | Ghost buttons, nav pills, language buttons and footer links have no hover state; trait chips and "+ Fler" look interactive but are inert spans | same |
| 12 | The map caption promises a "guldstjärna" [gold star] for each choice; the drawing uses gold diamonds | same |
| 13 | Morgon inputs lose their border (`--card-line` `#ffffffe6` on white); auth buttons have no disabled look; `.chip` on `<button>` shows the UA button face ("Eldljud", "Bakgrundsljud") | [05b §14](analysis/05b-components-app-and-forms.md#14-defects-quirks-and-dormant-code) |
| 14 | Dormant code: the waiting-fire finale, memory notes and active ember are switched off; `.reveal` ships already `.in` | same; [09 §6](analysis/09-motion-and-interaction.md#6-scrolling-and-the-dormant-reveal) |
| 15 | Reduced motion leaks the hero badge float and its pulse dot (specificity) | [14 §9](analysis/14-accessibility-and-craft.md#9-motion-and-prefers-reduced-motion) |
| 16 | The create flow's default art style is `neon` ("Lysande magi" [Glowing magic]), not the watercolour of the sample book | [07 §1](analysis/07-illustration-and-imagery.md#1-at-a-glance) |
| 17 | Mossa's scale drifts from boot-high to head-sized across the sample pages | [07 §8.3](analysis/07-illustration-and-imagery.md#83-mossa-scale-drift-is-the-main-consistency-failure) |
| 18 | Audio: the landing play pill reads a different story from the picture beside it; picker samples spread 8 dB; the "Eldljud" [Fire sound] chip can play rain | [11 §9](analysis/11-audio-and-voice.md#9-sonic-identity-interpretation) |
| 19 | English footer drops diacritics ("Varnamo"); "Ikvällens bok målas i" is non-standard Swedish | [10 §9](analysis/10-copy-voice-and-tone.md#9-punctuation-case-and-numerals) |
| 20 | No current-page state in the nav; a gated redirect to `/login` gives no reason | [13 §11](analysis/13-pages-ia-and-flows.md#11-defects-and-oddities) |

---

## 17. Do and don't

**Do**

- Start from the Natt frame: `#171232`, the nebula plate under the `#0b0f1e` scrim, cream ink `#fff7e9`, one gold light `#f5c542`.
- Swap tokens, not designs, for Morgon: violet `#6d4fe0` / `#5b3fc7`, white glass, white frames, keep the small gold markers.
- Put small text on glass (`#0f1628ad` + 22 px blur, or `#fffc` + 24 px), with the 1 px violet-gold-coral rim at 45%.
- Use Lora for titles, Source Serif 4 at 1.65-1.85 leading for anything read aloud, Schibsted Grotesk 700 in pills for controls, Cinzel caps only for the made object.
- Make every control a 44 px+ pill; give cards 26 px corners; frame covers in `--frame` and tilt them a few degrees.
- Animate the world slowly (4.6-9 s pendulum loops, a few px) and the hand quickly (0.25 s spring).
- Keep illustrations warm watercolour and coloured pencil on cream paper, with the verbatim style block.
- Let Morfar Erik's voice lead; keep beds about 20 LU under it.
- Write short, honest, evening sentences in Swedish first, with the child as the last word of the headline.
- End on memory: what the world keeps for the next book.

**Don't**

- Use pure white text at night or pure black shadows anywhere in the UI.
- Add gradient text, all-caps headlines, italics as a design element, or a "kiddy" rounded display face.
- Use saturated full-bleed colour fields or large gold fills (apart from buttons).
- Tint the illustrations violet, or put text, letters or signage inside them.
- Use spinners, percentages, sideways slides, wipes or zooms; or overshoot on ambient motion.
- Say "generera", "Köp", "Kom igång", or lead with "AI". No exclamation marks in Swedish.
- Recolour, outline or add a second colour to the gold logo raster.
- Copy the defects in §16: the mixed crossfade state, the unreachable skip link, hover-less controls, the 404 sample link.

---

## 18. Building with it

- **Tokens:** [tokens/tokens.css](tokens/tokens.css) (copy-pasteable CSS, both themes, every value cited), [tokens/tokens.json](tokens/tokens.json) (W3C design-token format with natt/morgon modes), [tokens/tokens.ts](tokens/tokens.ts) (for film and Remotion), plus the per-dimension [tokens/color.css](tokens/color.css), [color.json](tokens/color.json), [typography.json](tokens/typography.json), [layout.json](tokens/layout.json).
- **Style board:** [style-board.html](style-board.html), drawn with `tokens/tokens.css`, and its renders in [derived/style-board/](derived/style-board/) ([style-board-natt.webp](derived/style-board/style-board-natt.webp), [style-board-morgon.webp](derived/style-board/style-board-morgon.webp)).
- **Recipes for web, film and illustration:** [analysis/15-recreating-the-style.md](analysis/15-recreating-the-style.md) (a minimal hero starter page, motion and type at 1920×1080, a colour script, the prompt recipe and a "does it look like Tale Forge?" checklist).
- **Index of everything in the library:** [README.md](README.md).
