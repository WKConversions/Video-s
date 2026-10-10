# 15 · Recreating the style: a playbook for web, film and illustration

How to make new work that looks, moves, sounds and reads like [tale-forge.app](https://tale-forge.app). This file does not add new measurements of the site. It turns the fourteen analysis files, the tokens and the literal material into recipes. Every value is copied from the shipped code or from a measurement already in the library, and each one carries its source. Where this file proposes something the site does not do, it says **Read:** (interpretation) or **ours** (a construction or fix of our own). Captured 2026-10-09/10.

**Citation key.** `G:` = [../source/css/3q17cp_jgfwol.pretty.css](../source/css/3q17cp_jgfwol.pretty.css) (global sheet) · `S:` = [../source/css/2_gt301v4m-60.pretty.css](../source/css/2_gt301v4m-60.pretty.css) (onboarding `/start`) · `H:` = [../source/css/37m388zf6rymp.pretty.css](../source/css/37m388zf6rymp.pretty.css) (the glöd hearth stage). Numbers after the colon are line numbers in those prettified files. "07 §8.3" means section 8.3 of [07-illustration-and-imagery.md](07-illustration-and-imagery.md), and so on for the other analysis files. Swedish is quoted verbatim and followed by the site's own English or by a gloss in [brackets].

## Contents

1. [The style in eight sentences](#1-the-style-in-eight-sentences)
2. [Building a web page in this style](#2-building-a-web-page-in-this-style)
3. [Making a film or motion piece in this style](#3-making-a-film-or-motion-piece-in-this-style)
4. [Generating new illustrations in this style](#4-generating-new-illustrations-in-this-style)
5. [Checklist: does it look like Tale Forge?](#5-checklist-does-it-look-like-tale-forge)
6. [Files this playbook relies on](#6-files-this-playbook-relies-on)

---

## 1. The style in eight sentences

These restate the principles of [../STYLE-GUIDE.md §2](../STYLE-GUIDE.md#2-design-principles) as working rules.

1. **Design the night frame first.** The server always ships `<body data-theme="natt">` ([06 §3.1](06-theming-and-atmosphere.md#31-server-html-the-body-tag-and-the-pre-paint-script)), the canvas is `#171232` (G:606) and the one warm light is gold `#f5c542` (`--gold-soft`, G:464).
2. **The book is the brightest, warmest thing in the frame.** 72-96 % of each storybook image's pixels are warm-hued, while the rendered night backdrop is 98 % blue-violet (07 §1; [02 §16](02-color.md#16-illustration-colour-versus-ui-colour)).
3. **UI is glass laid over a painted sky.** The plate is fixed and never scrolls (G:612-622); cards are `#0f1628ad` + `blur(22px)` at night and `#fffc` + `blur(24px)` by day (G:498-500, G:547-549).
4. **Serif for the story, grotesk for the controls, Cinzel for the made object.** Lora for titles, Source Serif 4 for anything read aloud, Schibsted Grotesk for controls, Cinzel only for the wordmark and book titles (G:466-469; [03 §1](03-typography.md#1-at-a-glance)).
5. **Capsules act, cards hold, books tilt.** Every control is `border-radius: 999px` (`.btn`, G:890), every glass card is 26 px (G:1117), covers are 2:3 and tilted −8° / +7° (G:948-961).
6. **A slow world and a quick hand.** Idle loops run 4.6-9 s on `ease-in-out`; touched things answer in 0.25 s on a spring that overshoots 11.7 % (G:886-903; [09 §1](09-motion-and-interaction.md#1-at-a-glance)).
7. **A grandfather reads, everything else stays under him.** Morfar Erik [Grandpa Erik] reads at about 100 words a minute; beds play about 20 LU under the voice ([11 §3.8](11-audio-and-voice.md#38-level-design-what-the-listener-actually-hears)).
8. **Short, honest evening sentences that end on memory.** Swedish first, 7-8 words a sentence, no `!`, craft verbs instead of "generera" [generate], and the child last in the headline ([10 §14](10-copy-voice-and-tone.md#14-reproducing-the-voice)).

---

## 2. Building a web page in this style

### 2.1 Start from the library's files

| Need | File | Notes |
|---|---|---|
| Fonts, both theme token sets, page canvas | [../tokens/tokens.css](../tokens/tokens.css) | Copy-pasteable. Every value was checked by script against its cited CSS line. Fonts load from [../derived/typography/fonts/](../derived/typography/fonts/) (renamed copies of [../assets/fonts/](../assets/fonts/)) |
| Same tokens for JS or film | [../tokens/tokens.json](../tokens/tokens.json), [../tokens/tokens.ts](../tokens/tokens.ts) | W3C design-token format with natt/morgon modes; TypeScript for Remotion |
| Night plate | [../assets/assets/nebula-hero.webp](../assets/assets/nebula-hero.webp) | 2400×1340 |
| Morning plates | [../assets/assets/morgon-aurora-desktop.webp](../assets/assets/morgon-aurora-desktop.webp), [../assets/assets/morgon-aurora-mobile.webp](../assets/assets/morgon-aurora-mobile.webp) | 2560×1440 and 1440×2560 |
| Logo raster | [../assets/assets/tf-logo.webp](../assets/assets/tf-logo.webp) | 512×512 RGBA, one gold (mean `#d8a216`, [01 §3](01-brand-identity.md#3-the-logo-file-tf-logowebp)). Use it unchanged |
| A verified full backdrop reconstruction | [../derived/theming/recreate/theme-stack.html](../derived/theming/recreate/theme-stack.html) | Pixel-identical to the live backdrop in all four theme/viewport cases ([06 §14.1](06-theming-and-atmosphere.md#14-reproducing-it)) |
| One-page visual summary | [../style-board.html](../style-board.html) | The style board |

### 2.2 The tokens you will touch most

All 47 semantic tokens are in [../STYLE-GUIDE.md §4.2](../STYLE-GUIDE.md#42-semantic-tokens-both-themes) and in `tokens.css`. These are the ones a new page uses first.

| Token | natt | morgon | Lines |
|---|---|---|---|
| canvas (`body` background) | `#171232` | `#ede9f6` | G:606 / G:610 |
| `--page-ink` (headlines) | `#fff7e9` | `#241f35` | G:494 / G:543 |
| `--page-sub` (ledes) | `#d9cfee` | `#5f5878` | G:495 / G:544 |
| `--accent` | `var(--gold-soft)` = `#f5c542` | `#6d4fe0` | G:496 / G:545 (`--gold-soft` G:464) |
| `--accent-ink` (the headline phrase) | `var(--gold-soft)` = `#f5c542` | `#5b3fc7` | G:497 / G:546 (`--gold-soft` G:464) |
| `--card` | `#0f1628ad` | `#fffc` | G:498 / G:547 |
| `--card-line` | `#9b87f542` | `#ffffffe6` | G:499 / G:548 |
| `--card-blur` | `22px` | `24px` | G:500 / G:549 |
| `--card-ink` / `--card-sub` | `#f2eeff` / `#b5acd3` | `#241f35` / `#5f5878` | G:501-502 / G:550-551 |
| `--frame` (mat around pictures) | `#101a30` | `#fff` | G:503 / G:552 |
| `--chip-bg` / `--chip-line` / `--chip-ink` | `#fff9ec1a` / `#fff3d942` / `#e8dfc9` | `#6d4fe014` / `#6d4fe029` / `var(--accent-ink)` | G:505-507 / G:554-556 |
| `--pill-bg` / `--pill-ink` | `#9b87f529` / `#c9bcff` | `#6d4fe01a` / `var(--accent-ink)` | G:508-509 / G:557-558 |
| `--btn-grad` | `linear-gradient(135deg, #ffe08a, #f5c542)` | `linear-gradient(135deg, #6d4fe0, #5b3fc7)` | G:528 / G:577 |
| `--btn-ink` | `#3a2b10` | `#fff` | G:529 / G:578 |
| `--btn-shadow` / `--btn-shadow-hover` | `0 14px 40px #f5c54247` / `0 20px 55px #f5c5426b` | `0 14px 34px #6d4fe059` / `0 22px 48px #6d4fe073` | G:530-531 / G:579-580 |
| `--ghost-bg` / `--ghost-ink` / `--control-line` | `#fff9ec1a` / `#fff3d9` / `#fff3d952` | `#ffffffb8` / `#241f35` / `#887da0` | G:532-534 / G:581-583 |
| `--card-shadow` | `0 18px 44px #0508146b` | `0 4px 12px #241f351a, 0 22px 52px #241f3529` | G:536 / G:585 |
| `--h1-shadow` | `0 2px 30px #0c082859` | `none` | G:511 / G:560 |
| `--logo-ink` / `--logo-shadow` | `#f5c542` / `0 2px 6px #050814cc, 0 0 34px #f5c54273` | `#6d4fe0` / `0 1px 2px #241f352e, 0 0 24px #6d4fe052` | G:537-538 / G:586-587 |

Primitives (`:root`, G:460-465): `--violet #6d4fe0`, `--violet-soft #9b87f5`, `--gold #f2b22e`, `--gold-soft #f5c542`, `--coral #ff6154`. Theme switch timing: `--theme-transition-duration: 0.5s; --theme-transition-easing: ease` (G:470-471).

**Rule of use.** Write components against the tokens, never against hex. The morning theme is then a token swap: the same 47 properties are redeclared in the same order (G:493-541, G:542-590), and theme never changes layout ([06 §4](06-theming-and-atmosphere.md#4-the-complete-token-diff)).

### 2.3 Fonts and the type scale

| Role variable (G:466-469) | Family | Weights that exist | Use |
|---|---|---|---|
| `--display` | Lora | 600, 700 | h1-h3, names, book titles, prices, numerals |
| `--serif` | Source Serif 4 | 400, 600 | ledes, body copy, story prose, choices |
| `--ui` | Schibsted Grotesk | 400, 700, 800 | buttons, chips, labels, nav, forms, footer |
| `--wordmark` | Cinzel | 700 | the wordmark and book or reader titles, always uppercase |

The latin files are declared in G:12-21 (Cinzel 700), G:128-137 and G:226-235 (Lora 600 and 700, one variable file), G:299-308 and G:355-364 (Source Serif 4 400 and 600), G:391-400, G:412-421 and G:433-442 (Schibsted Grotesk 400, 700 and 800). `tokens.css` repeats them with library paths. Ask only for the weights in the table: Grotesk `600` draws at 700 and `500` at 400 ([03 §4](03-typography.md#4-weights-declared-vs-drawn-measured)). No italic face ships. All four families are SIL OFL 1.1 ([03 §11](03-typography.md#11-licences-verified)).

| Role | Rule | Lines |
|---|---|---|
| Hero h1 | Lora 700, `clamp(2.7rem, 5.4vw, 4.4rem)`, `line-height: 1.06`, `letter-spacing: -0.015em`, `text-wrap: balance`, `text-shadow: var(--h1-shadow)` | G:855-866 |
| Section headline | `.hiw-headline` Lora 700, `clamp(1.9rem, 4vw, 2.7rem)`, `-0.015em` | G:2554-2561 |
| Section title | `h2` Lora 600, `clamp(1.5rem, 2.4vw, 2rem)`, `-0.01em` | G:1055-1062 |
| Step title | `.hiw-step-text h3` Lora 700, `1.35rem` | G:2631-2637 |
| Hero lede | Source Serif 4, `clamp(1.08rem, 1.65vw, 1.28rem)`, `line-height: 1.65`, `max-width: 46ch` | G:871-879 |
| Section lede | Source Serif 4, `1.1rem`, `line-height: 1.7`, `max-width: 56ch` | G:2562-2568 |
| Step body | Source Serif 4, `1.02rem`, `line-height: 1.75`, `max-width: 52ch` | G:2638-2644 |
| Button | Grotesk 700, `1.05rem` | G:886-903 |
| Kicker chip | Grotesk 700, `0.85rem`, sentence case | G:835-850 |
| Eyebrow | Grotesk 700, `0.82rem`, `text-transform: uppercase`, `letter-spacing: 2px` | G:2541-2553 |
| Wordmark | Cinzel 700, `1.72rem`, uppercase, `letter-spacing: 3px` (`1.05rem` / `1.5px` at ≤560 px) | G:696-710, G:746-751 |

### 2.4 The background stack

Markup (verbatim from [../source/rendered/dom__home__sv.html](../source/rendered/dom__home__sv.html), paths made relative to the library root):

```html
<div class="bg bg-night"><img src="assets/assets/nebula-hero.webp" alt=""><div class="scrim"></div><div class="starfield"></div></div>
<div class="bg bg-day"><picture><source media="(max-width: 760px)" srcset="assets/assets/morgon-aurora-mobile.webp"><img src="assets/assets/morgon-aurora-desktop.webp" alt=""></picture></div>
<div class="wrap"><div class="shell"> … nav, main, footer … </div></div>
```

Back to front ([06 §5.3](06-theming-and-atmosphere.md#53-the-stack-back-to-front)):

| Layer | Rule | Lines |
|---|---|---|
| Canvas | `background: #171232` (natt), `#ede9f6` (morgon) | G:606, G:610 |
| Plate box | `.bg { z-index: 0; pointer-events: none; height: 100lvh; position: fixed; top: 0; left: 0; right: 0 }`, opacity transition on the theme tokens | G:612-622 |
| Night painting | `object-fit: cover; object-position: center 30%` | G:623-630 |
| Scrim (night only) | `linear-gradient(#0b0f1e61 0%, #0b0f1e80 45%, #0d1122bd 100%)` | G:631-635 |
| Stars (night only) | six `radial-gradient` dots of 1-1.6 px in the top quarter, `animation: 4.6s ease-in-out infinite twinkle`, opacity 0.95 ↔ 0.55 | G:636-656 |
| Morning painting | `object-fit: cover`, swapped to the portrait file at ≤760 px | G:657-666 |
| Theme switch | `.bg-night` and `.bg-day` cross-fade on opacity | G:667-676 |
| Content | `.wrap { z-index: 1; position: relative }`; `.shell { width: min(1120px, 100%); padding: 0 28px; min-height: 100dvh }` | G:677-688 |

**Read:** the scrim is not optional at night. Without it the hero lede measures 1.63:1 against the brightest tenth of the painting behind it; with it, 4.65:1 ([06 §11](06-theming-and-atmosphere.md#11-how-text-stays-legible-over-the-paintings)). The morning plate needs no scrim because its centre is empty paper.

### 2.5 The glass card recipe

Verbatim, G:1110-1147:

```css
.glass {
  background: var(--card);
  -webkit-backdrop-filter: blur(var(--card-blur));
  backdrop-filter: blur(var(--card-blur));
  border: 1px solid var(--card-line);
  box-shadow: var(--card-shadow);
  color: var(--card-ink);
  border-radius: 26px;
  transition:
    background 0.5s,
    border-color 0.5s,
    color 0.5s,
    box-shadow 0.4s;
  position: relative;
}
.glass:before {
  content: "";
  pointer-events: none;
  -webkit-mask-composite: xor;
  opacity: 0.45;
  background: linear-gradient(135deg, #9b87f580, #f2b22e59 50%, #ff61544d);
  border-radius: 26px;
  padding: 1px;
  position: absolute;
  inset: 0;
  -webkit-mask-image: linear-gradient(#fff 0 0), linear-gradient(#fff 0 0);
  -webkit-mask-position:
    0 0,
    0 0;
  -webkit-mask-size: auto, auto;
  -webkit-mask-repeat: repeat, repeat;
  -webkit-mask-clip: content-box, border-box;
  -webkit-mask-origin: content-box, border-box;
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  -webkit-mask-source-type: auto, auto;
  mask-mode: match-source, match-source;
}
```

A picture inside glass, as in step 1 of the home page (markup from the hydrated DOM; CSS `.hiw-card { padding: 22px }` G:2664-2666, `.hiw-frame` G:2671-2683, `.hiw-ai-chip` G:2684-2698):

```html
<div class="glass hiw-card hiw-portrait-card">
  <div class="hiw-frame">
    <img src="assets/landing/iris/hero-portrait.webp" alt="Iris, den målade hjälten i exempelboken">
    <span class="hiw-ai-chip">Skapad med AI</span>
  </div>
</div>
```

The alt text reads [Iris, the painted hero of the sample book]; the chip reads [Created with AI]. The frame is `background: var(--frame); border: 1px solid var(--frame-line); border-radius: 24px; padding: 10px` and the image inside it has `border-radius: 20px`.

Glass rules ([06 §9](06-theming-and-atmosphere.md#9-glass-surfaces)): blur grows with the surface. Chips get `blur(10px)` (G:839-840), ghost buttons `blur(14px)` (G:922-923), cards `22px` / `24px` from the token. All small text sits on glass, never straight on the painting. Card padding in use: 22 (step card, G:2665), 26 (builder), 28 (page card), 34 (auth and legal) ([04 §8](04-layout-spacing-responsive.md#8-the-de-facto-spacing-scale)).

### 2.6 Button recipes

| Button | Rule | Lines |
|---|---|---|
| Base `.btn` | `border-radius: 999px; min-height: 52px; padding: 17px 30px; font-size: 1.05rem; font-weight: 700; gap: 10px`; `transition: transform 0.25s cubic-bezier(0.2, 0.7, 0.3, 1.4), box-shadow 0.3s, background 0.5s, color 0.5s` | G:886-903 |
| Press | `.btn:active { transform: scale(0.96) }` | G:904-906 |
| Primary | `color: var(--btn-ink); background: var(--btn-grad); box-shadow: var(--btn-shadow), inset 0 1px 0 #ffffff73` | G:907-913 |
| Primary hover | `box-shadow: var(--btn-shadow-hover); transform: translateY(-3px)` | G:914-917 |
| Ghost | `background: var(--ghost-bg); color: var(--ghost-ink); border: 1px solid var(--ghost-line); backdrop-filter: blur(14px)` | G:918-924 |
| Nav pill `.nav-cta` | ghost tokens, `border-radius: 999px; padding: 11px 20px; font-size: 0.95rem; font-weight: 700` | G:731-745 |
| Toggle thumb | a small primary button: `background: var(--btn-grad); box-shadow: var(--btn-shadow)`, slides on `cubic-bezier(0.2, 0.7, 0.3, 1.2)` over the theme duration | G:785-800 |
| Focus ring (the house ring) | `outline: 3px solid var(--accent); outline-offset: 3px; box-shadow: 0 0 0 6px color-mix(in srgb, var(--card) 88%, transparent)` | G:822-826 |

Labels: an imperative verb plus an object, 1-4 words, often with *er* [your, plural]: "Skapa er hjälte" [Create your hero], "Se hur det funkar" [See how it works], "Läs exempelboken" [Read the sample book] ([10 §6](10-copy-voice-and-tone.md#6-cta-vocabulary)).

Two defects not to copy ([05a §15](05a-components-landing.md#15-defects-inconsistencies-and-gaps)). Both fixes below are **ours**:

```css
/* .btn-primary:hover replaces the transform, so a mouse press never scales; it also drops the inset gloss */
.btn-primary:hover { box-shadow: var(--btn-shadow-hover), inset 0 1px 0 #ffffff73; }
.btn-primary:hover:active { transform: translateY(-3px) scale(0.96); }
/* ghost buttons and nav pills have no hover state on the site; give them the house focus ring and a lift */
```

### 2.7 The headline with the accent phrase

```html
<h1>En värld som <span class="grad">minns henne</span>.</h1>   <!-- [A world that remembers her.] -->
```

```css
h1 .grad { color: var(--accent-ink); transition: color 0.5s; }   /* G:867-870 */
```

- **It is a flat colour, not a gradient**, whatever the class name says. No sheet in the library uses `background-clip: text` ([10 §5.1](10-copy-voice-and-tone.md#51-display-headline-one-declarative-sentence-a-full-stop-the-child-in-colour)). Gold `#f5c542` at night, violet `#5b3fc7` in the morning.
- **Formula:** one declarative sentence of 4-5 words; the coloured phrase is the last words before the full stop and refers to the child; the full stop sits outside the span and keeps the headline ink. The three on the site: "En värld som **minns henne**." [A world that remembers her.], "Ikväll är hjälten **ert barn**." [Tonight the hero is your child.], "Lämna över till **{namn}**." [Hand it over to {name}.].
- **Measured size:** 70.4 px at 1440 wide (two lines, 538×149 px), 43.2 px at 390 wide ([03 §5.1](03-typography.md#51-display-lora---display); [../derived/layout/measurements/home__sv__natt__1440.json](../derived/layout/measurements/home__sv__natt__1440.json)).
- **Watch:** at `line-height: 1.06`, a capital Å, Ä or Ö on line 2 comes close to line 1 ([03 §10](03-typography.md#10-swedish-typesetting-and-diacritics)).
- **Never:** a gradient fill, uppercase Lora, italics for emphasis ([03 §13.3](03-typography.md#133-exact-match-vs-upgrade)).

### 2.8 Section heads

Two patterns exist.

**The large explainer head** (`.hiw-head`, G:2538-2568): a violet eyebrow pill, a Lora headline with a full stop, a serif lede.

```html
<div class="hiw-head">
  <span class="hiw-kicker">Så fungerar det</span>
  <h2 class="hiw-headline">Äventyr värda att prata om.</h2>
  <p class="hiw-lede">Från ett foto till en uppläst bilderbok med fyra olika slut. Så här går en kväll till.</p>
</div>
```

[How it works · Adventures worth talking about. · From one photo to a narrated picture book with four different endings. Here is how an evening works.] CSS: `.hiw-head { margin-bottom: 36px }`; `.hiw-kicker` uses `--pill-ink` on `--pill-bg`, `text-transform: uppercase; letter-spacing: 2px; padding: 7px 14px; font-size: 0.82rem; font-weight: 700; margin-bottom: 16px`; `.hiw-headline` `margin-bottom: 12px`; `.hiw-lede` `max-width: 56ch; line-height: 1.7`.

**The compact section head** (`.sec-head`, G:1041-1046 with `h2` G:1055-1062 and `.sec-chip` G:1087-1098): an h2 with **no** full stop and a small chip beside it.

```html
<div class="sec-head"><h2>Din hjälte</h2><span class="sec-chip">barnens favorit</span></div>
```

[Your hero · the children's favourite; the site's English says "the family favorite"]. CSS: `.sec-head { align-items: center; gap: 14px; margin-bottom: 22px; display: flex }`; `.sec-chip` uses the chip tokens with `blur(10px)`, `padding: 6px 12px; font-size: 0.8rem; font-weight: 700`.

Heading punctuation ([10 §5.2](10-copy-voice-and-tone.md#52-section-and-step-headings-no-full-stop)): display headlines end with a full stop; section and step titles have none; decisions are questions ("Vem följer med?" [Who comes along?]).

### 2.9 Spacing, radius and tilt

There are no spacing tokens on the site; all values are literal px. The de-facto scale is 4 · 6 · 8 · 10 · 12 · 14 · 16 · 18 · 20 · 22 · 24 · 26 · 28 · 30 · 34 · 36 · 40 · 44 ([04 §8](04-layout-spacing-responsive.md#8-the-de-facto-spacing-scale)).

| Role | Value | Lines |
|---|---|---|
| Page gutter | `padding: 0 28px` at every width | G:686 |
| Content column | `width: min(1120px, 100%)` (1064 px of content at 1440) | G:683 |
| Nav padding | `22px 0` (`14px 0` at ≤560 px) | G:693, G:756-759 |
| Hero grid | `1.05fr 0.95fr`, `gap: 40px`, `min-height: 64vh`, `padding: 4vh 0 2vh` | G:827-834 |
| Section | `padding: 44px 0 8px` | G:1039 |
| Explainer head → steps | `margin-bottom: 36px` | G:2539 |
| Between steps | `gap: 36px` | G:2571 |
| Section head → content | `margin-bottom: 22px` | G:1044 |
| Kicker → h1 → lede → CTA | 22 · 18 · 30 px | G:844, G:861, G:875 |
| CTA row gap | `14px` | G:883 |

| Radius | Used on | Lines |
|---|---|---|
| `999px` | every button, chip, pill, toggle | G:890, G:841, G:779 |
| `26px` | every glass card | G:1117 |
| `24px` | picture frames (`.hiw-frame`) | G:2674 |
| `22px` | shelf book cards | G:1491 |
| `20px` | hero covers | G:931 |
| `18px` | memory badge | G:988 |
| `14px` | small fanned cards | G:2755 |

| Tilt | Value | Lines |
|---|---|---|
| Hero covers | `rotate(-8deg)` and `rotate(7deg)` | G:953, G:960 |
| Fanned adventure cards | `rotate(-4deg)`, none, `rotate(4deg)` | G:2759, G:2764, G:2768 |
| Memory badge | 2.5° → 3° | G:1001-1009 |
| Book hover | `translateY(-10px) rotate(-1deg)` | G:1501-1503 |
| Controls | never rotated | [04 §14](04-layout-spacing-responsive.md#14-tilt-and-rotation-the-physical-book-vocabulary) |

### 2.10 Minimal starter: the hero

One file that reproduces the home hero in both themes. Save it at the library root (beside `README.md`), so that its relative paths reach `tokens/` and `assets/`. It loads [../tokens/tokens.css](../tokens/tokens.css) for the fonts, the token blocks and the canvas, and copies every other declaration from G (vendor-prefixed duplicates dropped). The markup is the hydrated DOM of the Swedish home page with the links neutralised and the nav reduced to the logo and the theme toggle.

```html
<!doctype html>
<html lang="sv">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Tale Forge hero starter</title>
<!-- fonts (@font-face), :root primitives, both theme token blocks and the body canvas -->
<link rel="stylesheet" href="tokens/tokens.css">
<style>
/* Every declaration is copied from source/css/3q17cp_jgfwol.pretty.css (G); line numbers in comments. */
* { box-sizing: border-box; margin: 0; }                                                     /* G:591-594 */
/* backdrop stack */
.bg { z-index: 0; pointer-events: none; height: 100lvh; position: fixed; top: 0; left: 0; right: 0;
      transition: opacity var(--theme-transition-duration) var(--theme-transition-easing); } /* G:612-622 */
.bg-night img { object-fit: cover; object-position: center 30%; width: 100%; height: 100%; position: absolute; inset: 0; } /* G:623-630 */
.bg-night .scrim { background: linear-gradient(#0b0f1e61 0%, #0b0f1e80 45%, #0d1122bd 100%); position: absolute; inset: 0; } /* G:631-635 */
.starfield { position: absolute; inset: 0; animation: 4.6s ease-in-out infinite twinkle;
  background-image:
    radial-gradient(1.4px 1.4px at 12% 8%, #ffe9b0e6 50%, #0000 51%),
    radial-gradient(1px 1px at 32% 16%, #f5f0e8cc 50%, #0000 51%),
    radial-gradient(1.6px 1.6px at 58% 6%, #f5c542d9 50%, #0000 51%),
    radial-gradient(1px 1px at 76% 12%, #f5f0e8b3 50%, #0000 51%),
    radial-gradient(1.2px 1.2px at 90% 22%, #ffe9b0bf 50%, #0000 51%),
    radial-gradient(1.3px 1.3px at 44% 24%, #9b87f599 50%, #0000 51%); } /* G:636-647 */
@keyframes twinkle { 0%, to { opacity: 0.95; } 50% { opacity: 0.55; } }                     /* G:648-656 */
.bg-day picture, .bg-day img { width: 100%; height: 100%; position: absolute; inset: 0; }    /* G:657-663 */
.bg-day img { object-fit: cover; }                                                           /* G:664-666 */
body[data-theme="natt"] .bg-day, body[data-theme="morgon"] .bg-night { opacity: 0; }         /* G:667-669, 674-676 */
body[data-theme="natt"] .bg-night, body[data-theme="morgon"] .bg-day { opacity: 1; }         /* G:670-673 */
/* shell and nav */
.wrap { z-index: 1; position: relative; }                                                    /* G:677-680 */
.shell { flex-direction: column; width: min(1120px, 100%); min-height: 100dvh; margin: 0 auto; padding: 0 28px; display: flex; } /* G:681-688 */
.shell > nav { justify-content: space-between; align-items: center; gap: 14px; padding: 22px 0; display: flex; } /* G:689-695 */
.logo { white-space: nowrap; font-family: var(--wordmark); color: var(--logo-ink); text-transform: uppercase; letter-spacing: 3px;
        text-shadow: var(--logo-shadow); flex-shrink: 0; align-items: center; gap: 13px; font-size: 1.72rem; font-weight: 700;
        transition: color 0.5s; display: flex; }                                             /* G:696-710 */
.logo img { object-fit: contain; filter: drop-shadow(0 0 14px #f5c54280); width: 42px; height: 42px; } /* G:711-716 */
/* theme toggle */
.tt { background: var(--ghost-bg); border: 1px solid var(--control-line); min-height: 44px; font-family: var(--ui); cursor: pointer;
      user-select: none; border-radius: 999px; align-items: center; padding: 4px; display: flex; position: relative;
      transition: background var(--theme-transition-duration) var(--theme-transition-easing),
                  border-color var(--theme-transition-duration) var(--theme-transition-easing); } /* G:768-784 */
.tt-thumb { background: var(--btn-grad); width: calc(50% - 4px); box-shadow: var(--btn-shadow); border-radius: 999px;
            position: absolute; top: 4px; bottom: 4px; left: 4px;
            transition: transform var(--theme-transition-duration) cubic-bezier(0.2, 0.7, 0.3, 1.2),
                        background var(--theme-transition-duration) var(--theme-transition-easing); } /* G:785-797 */
body[data-theme="morgon"] .tt-thumb { transform: translate(100%); }                         /* G:798-800 */
.tt-opt { z-index: 1; color: var(--ghost-ink); align-items: center; gap: 7px; padding: 8px 14px; font-size: 0.95rem;
          font-weight: 700; display: inline-flex; position: relative;
          transition: color var(--theme-transition-duration) var(--theme-transition-easing); } /* G:801-813 */
.tt-opt svg { width: 15px; height: 15px; }                                                   /* G:814-817 */
body[data-theme="natt"] .tt-opt.night, body[data-theme="morgon"] .tt-opt.day { color: var(--btn-ink); } /* G:818-821 */
.tt:focus-visible { outline: 3px solid var(--accent); outline-offset: 3px;
                    box-shadow: 0 0 0 6px color-mix(in srgb, var(--card) 88%, transparent); } /* G:822-826 */
/* hero */
.hero { grid-template-columns: 1.05fr 0.95fr; align-items: center; gap: 40px; min-height: 64vh; padding: 4vh 0 2vh; display: grid; } /* G:827-834 */
.kicker { color: var(--chip-ink); background: var(--chip-bg); border: 1px solid var(--chip-line); backdrop-filter: blur(10px);
          border-radius: 999px; align-items: center; gap: 8px; margin-bottom: 22px; padding: 8px 16px; font-size: 0.85rem;
          font-weight: 700; transition: all 0.5s; display: inline-flex; }                    /* G:835-850 */
.kicker svg { width: 14px; height: 14px; }                                                   /* G:851-854 */
h1 { font-family: var(--display); letter-spacing: -0.015em; text-wrap: balance; color: var(--page-ink); text-shadow: var(--h1-shadow);
     margin-bottom: 18px; font-size: clamp(2.7rem, 5.4vw, 4.4rem); font-weight: 700; line-height: 1.06; transition: color 0.5s; } /* G:855-866 */
h1 .grad { color: var(--accent-ink); transition: color 0.5s; }                               /* G:867-870 */
.lede { font-family: var(--serif); color: var(--page-sub); max-width: 46ch; margin-bottom: 30px;
        font-size: clamp(1.08rem, 1.65vw, 1.28rem); line-height: 1.65; transition: color 0.5s; } /* G:871-879 */
.cta-row { flex-wrap: wrap; align-items: center; gap: 14px; display: flex; }                 /* G:880-885 */
.cta-row--microcopy { align-items: flex-start; }                                             /* G:3132-3134 */
.cta-primary-col { flex-direction: column; align-items: flex-start; gap: 10px; display: flex; } /* G:3135-3140 */
.cta-microcopy { font-family: var(--ui); color: var(--page-sub); font-size: 0.85rem; }       /* G:3141-3145 */
.btn { cursor: pointer; font-family: var(--ui); border: none; border-radius: 999px; align-items: center; gap: 10px;
       min-height: 52px; padding: 17px 30px; font-size: 1.05rem; font-weight: 700; display: inline-flex;
       transition: transform 0.25s cubic-bezier(0.2, 0.7, 0.3, 1.4), box-shadow 0.3s, background 0.5s, color 0.5s; } /* G:886-903 */
.btn:active { transform: scale(0.96); }                                                      /* G:904-906 */
.btn-primary { color: var(--btn-ink); background: var(--btn-grad); box-shadow: var(--btn-shadow), inset 0 1px 0 #ffffff73; } /* G:907-913 */
.btn-primary:hover { box-shadow: var(--btn-shadow-hover); transform: translateY(-3px); }    /* G:914-917 */
.btn-ghost { background: var(--ghost-bg); color: var(--ghost-ink); border: 1px solid var(--ghost-line); backdrop-filter: blur(14px); } /* G:918-924 */
/* cover fan and memory badge */
.fan { height: min(58vh, 540px); position: relative; }                                       /* G:925-928 */
.fan .fbook { border: 5px solid var(--frame); border-radius: 20px; width: min(46%, 240px); position: absolute; overflow: hidden;
              transition: transform 0.5s cubic-bezier(0.2, 0.7, 0.3, 1.2), border-color 0.5s;
              box-shadow: 0 24px 50px #0a072066, 0 0 44px #f5c5421f; }                       /* G:929-941 */
.fan .fbook img { aspect-ratio: 2/3; object-fit: cover; width: 100%; display: block; }       /* G:942-947 */
.fb1 { z-index: 1; animation: 7s ease-in-out infinite float1; top: 10%; left: 6%; transform: rotate(-8deg); } /* G:948-954 */
.fb2 { z-index: 2; animation: 8s ease-in-out infinite float2; top: 2%; right: 8%; transform: rotate(7deg); }  /* G:955-961 */
@keyframes float1 { 0%, to { transform: rotate(-8deg) translateY(0); } 50% { transform: rotate(-8.6deg) translateY(-12px); } } /* G:962-970 */
@keyframes float2 { 0%, to { transform: rotate(7deg) translateY(0); } 50% { transform: rotate(7.6deg) translateY(-16px); } }   /* G:971-979 */
.fan .badge { z-index: 3; background: var(--card); backdrop-filter: blur(var(--card-blur)); border: 1px solid var(--card-line);
              color: var(--card-ink); box-shadow: var(--card-shadow); border-radius: 18px; align-items: center; gap: 12px;
              padding: 14px 18px; transition: background 0.5s, color 0.5s; animation: 9s ease-in-out infinite floatBadge;
              display: flex; position: absolute; bottom: 23%; right: 9%; }                   /* G:980-1000 */
@keyframes floatBadge { 0%, to { transform: rotate(2.5deg) translateY(0); } 50% { transform: rotate(3deg) translateY(-7px); } } /* G:1001-1009 */
.badge .dotpulse { background: var(--gold); border-radius: 50%; flex: none; width: 10px; height: 10px;
                   animation: 2.4s infinite pulse; box-shadow: 0 0 #f2b22e80; }            /* G:1010-1018 */
@keyframes pulse { 0% { box-shadow: 0 0 #f2b22e73; } 70% { box-shadow: 0 0 0 12px #f2b22e00; } to { box-shadow: 0 0 #f2b22e00; } } /* G:1019-1029 */
.badge b { font-size: 0.95rem; }                                                             /* G:1030-1032 */
.badge span { color: var(--card-sub); font-size: 0.8rem; display: block; }                   /* G:1033-1037 */
@media (max-width: 880px) { .hero { grid-template-columns: 1fr; min-height: auto; padding-top: 3vh; }
                            .fan { height: 340px; margin-top: 8px; } }                       /* G:2243-2252 */
@media (max-width: 560px) { .logo { letter-spacing: 1.5px; gap: 8px; font-size: 1.05rem; }
                            .logo img { width: 28px; height: 28px; }
                            .shell > nav { gap: 8px; padding: 14px 0; } }                    /* G:746-759 (excerpt) */
@media (max-width: 560px) { .tt-opt { gap: 0; padding: 8px; font-size: 0; } }               /* G:2286-2294 (excerpt): icon-only toggle */
@media (prefers-reduced-motion: reduce) { .fb1, .fb2, .badge, .dotpulse, .starfield { animation: none; }
                                          body, .bg, .tt, .tt-thumb, .tt-opt { transition: none; } } /* G:2349-2363 */
/* Ours, not the site's: ".badge" and ".dotpulse" above lose to ".fan .badge" and ".badge .dotpulse",
   so the shipped page keeps floating the badge under reduced motion (analysis/14 §9). This closes the leak. */
@media (prefers-reduced-motion: reduce) { .fan .badge, .badge .dotpulse { animation: none; } }
</style>
</head>
<body data-theme="natt">
<div class="bg bg-night"><img src="assets/assets/nebula-hero.webp" alt=""><div class="scrim"></div><div class="starfield"></div></div>
<div class="bg bg-day"><picture><source media="(max-width: 760px)" srcset="assets/assets/morgon-aurora-mobile.webp"><img src="assets/assets/morgon-aurora-desktop.webp" alt=""></picture></div>
<div class="wrap"><div class="shell">
  <nav>
    <a class="logo" translate="no" style="text-decoration:none" href="#"><img src="assets/assets/tf-logo.webp" alt="">Tale Forge</a>
    <button class="tt" role="switch" aria-checked="false" aria-label="Byt tema" type="button"><span class="tt-thumb" aria-hidden="true"></span><span class="tt-opt night"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>Natt</span><span class="tt-opt day"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.4M12 19.1v2.4M2.5 12h2.4M19.1 12h2.4M4.9 4.9l1.7 1.7M17.4 17.4l1.7 1.7M19.1 4.9l-1.7 1.7M6.6 17.4l-1.7 1.7"/></svg>Morgon</span></button>
  </nav>
  <main>
    <header class="hero">
      <div>
        <span class="kicker"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1"/></svg>Exempel: Alvas värld · 2 böcker</span>
        <h1>En värld som <span class="grad">minns henne</span>.</h1>
        <p class="lede">Den målade hjälten återvänder. Valen förändrar vad som händer, och senare böcker minns äventyren ni redan har delat.</p>
        <div class="cta-row cta-row--microcopy">
          <div class="cta-primary-col"><a class="btn btn-primary" href="#" style="text-decoration:none">Skapa er hjälte</a><span class="cta-microcopy">Första boken är gratis, inget kort behövs. Sedan 149 kr i månaden.</span></div>
          <a class="btn btn-ghost" href="#" style="text-decoration:none">Se hur det funkar</a>
        </div>
      </div>
      <div class="fan">
        <div class="fbook fb1"><img src="assets/assets/cover-tornet.webp" alt=""></div>
        <div class="fbook fb2"><img src="assets/assets/cover-filten.webp" alt=""></div>
        <div class="badge"><span class="dotpulse"></span><div><b>Sixten minns tornet</b><span>från "Alva och fyraljuset"</span></div></div>
      </div>
    </header>
  </main>
</div></div>
<script>
  /* toggle behaviour as described in analysis/06 §3: same localStorage key, natt is the default */
  const b = document.body, t = document.querySelector('.tt');
  try { const s = localStorage.getItem('tf-theme'); if (s === 'morgon' || s === 'natt') b.dataset.theme = s; } catch (e) {}
  t.setAttribute('aria-checked', b.dataset.theme === 'morgon');
  t.addEventListener('click', () => {
    b.dataset.theme = b.dataset.theme === 'natt' ? 'morgon' : 'natt';
    t.setAttribute('aria-checked', b.dataset.theme === 'morgon');
    try { localStorage.setItem('tf-theme', b.dataset.theme); } catch (e) {}
  });
</script>
</body>
</html>
```

**Verified (2026-10-10, ours).** A script checked that each of the 250 declarations above appears on its cited G lines (0 misses). The page was then rendered with Playwright (Chromium) at 1440×900 and 390×844 in both themes, with animations paused at 0, and compared with the live layout measurements in [../derived/layout/measurements/home__sv__natt__1440.json](../derived/layout/measurements/home__sv__natt__1440.json) and [home__sv__natt__390.json](../derived/layout/measurements/home__sv__natt__390.json):

| Box | Live, 1440 | Starter, 1440 | Live, 390 | Starter, 390 |
|---|---|---|---|---|
| h1 (w×h) | 538×149 | 538×149 | 334×92 | 334×92 |
| `.lede` | 498×101 | 498×101 | 334×114 | 334×114 |
| `.btn-primary` | 183×54 | 183×54 | 183×54 | 183×54 |
| `.fan` | 486×522 | 486×522 | 334×340 | 334×340 |
| h1 top (y) | 197 | 190 | 198 | 154 |

Every size matches. Only the vertical offset differs, because the starter's nav lacks the "Logga in" [Log in] and "Priser" [Pricing] pills and the SV/EN switch: the live nav is 96 px tall at 1440 (the 52 px language switch is its tallest item) and wraps to 116 px at 390. `.grad` computes to `rgb(245, 197, 66)` = `#f5c542` at night and `rgb(91, 63, 199)` = `#5b3fc7` in the morning. Compare with [../screenshots/pages/home/home__sv__natt__desktop__fold.png](../screenshots/pages/home/home__sv__natt__desktop__fold.png) and [home__en__morgon__desktop__fold.png](../screenshots/pages/home/home__en__morgon__desktop__fold.png).

To grow the starter: the how-it-works rail, map, builder, shelf and footer are specified component by component in [05a §17](05a-components-landing.md#17-reproduce-it-recipes-for-film-and-for-emulation); auth, pricing, onboarding and the reader in [05b](05b-components-app-and-forms.md); a layout skeleton in [04 §19.1](04-layout-spacing-responsive.md#191-minimal-css-skeleton-literal-values); icons in [08 §14](08-iconography-and-svg.md#14-reproducing-the-style-web-and-film).

### 2.11 Web defects not to copy

From [../STYLE-GUIDE.md §16](../STYLE-GUIDE.md#16-known-defects-and-inconsistencies): the unreachable skip link (`.skip-link:not(:focus) { visibility: hidden }`, G:486-488); the theme switch where gradients snap at frame 0 while text fades ([06 §7.2](06-theming-and-atmosphere.md#72-what-fades-and-what-snaps)); hover-less ghost buttons and nav pills; trait chips that look interactive but are inert spans; morning inputs that lose their border; the reduced-motion leak of the badge float (fixed in the starter); the footer as a `div` rather than `<footer>`; and a sample link that returns 404.

---

## 3. Making a film or motion piece in this style

### 3.1 Visual grammar: two worlds, one bedtime

| | **Natt** [Night] | **Morgon** [Morning] |
|---|---|---|
| Plate | [nebula-hero.webp](../assets/assets/nebula-hero.webp): an astronaut sits on a pile of old books reading a glowing book, in a violet-blue nebula with gold bokeh. Figure in the left-centre third; the glowing book at about 39 % across and 43 % down ([06 §6.1](06-theming-and-atmosphere.md#61-night-nebula-herowebp)) | [morgon-aurora-desktop.webp](../assets/assets/morgon-aurora-desktop.webp): wet-on-wet watercolour dawn; lavender clouds top left, an apricot-coral bloom top right, sprigs at the sides, misty hills at the bottom, and about 60 % of the width left as empty paper ([06 §6.2](06-theming-and-atmosphere.md#62-morning-morgon-aurora-desktopwebp)) |
| Medium | cinematic digital painting, bokeh, shallow depth of field | watercolour on cold-press paper, flat, no depth |
| Light | one warm point source inside the scene: the book (page glow `#fbf8cd`) | a diffuse warm bloom at the top edge |
| Treatment | scrim, six twinkling stars, a dark halo under headlines | none |
| Accent light | gold: `#f5c542` glows and button | violet: `#6d4fe0` glows and button; small gold markers stay |
| Frames around pictures | navy `#101a30` | white `#fff` |

**Read:** night is "film" and morning is "picture book" ([06 §6.5](06-theming-and-atmosphere.md#65-the-pair-compared)). Use night for the opening, the waiting and the bedtime read; use morning for the day after, the shelf and memory. The switch between them is a dissolve, never a wipe.

Recurring objects of the grammar, each with its literal source:

- **Tilted book cards.** 2:3 covers in a 5 px `--frame` border with 20 px corners, tilted −8° and +7°, under a navy drop and a faint gold halo `0 24px 50px #0a072066, 0 0 44px #f5c5421f` (G:929-961). Fanned cards sit at −4°, 0°, +4° in a 3 px frame with 14 px corners (G:2751-2769).
- **The glass chip that remembers.** A frosted badge with a pulsing gold dot: "Sixten minns tornet" [Sixten remembers the tower], from "Alva och fyraljuset" [from "Alva and the Fourth Candle"] (G:980-1037).
- **Gold and violet glows.** Light comes out of objects: the logo (`drop-shadow(0 0 14px #f5c54280)`, both themes, G:711-716), the buttons, the covers, the map medallions. Shadows are navy, indigo or plum, never black ([06 §10](06-theming-and-atmosphere.md#10-glows)).
- **Star twinkle.** Six 1-1.6 px dots (`#ffe9b0e6`, `#f5f0e8cc`, `#f5c542d9`, `#f5f0e8b3`, `#ffe9b0bf`, `#9b87f599`) breathing 0.95 ↔ 0.55 over 4.6 s (G:636-656). The painting supplies all the other stars.
- **The four-point sparkle.** `M12 2c.7 5.6 4.4 9.3 10 10-5.6.7-9.3 4.4-10 10-.7-5.6-4.4-9.3-10-10 5.6-.7 9.3-4.4 10-10z` in `--gold-soft` `#f5c542` (`.hiw-star`, G:2655-2660, G:464; [../derived/icons/svg/motif-four-point-sparkle.svg](../derived/icons/svg/motif-four-point-sparkle.svg)).
- **The path that draws itself.** The endings map: dotted routes, one lit route drawing on, round medallions for the four endings ([../derived/icons/svg/hiw-endings-map-desktop__natt.svg](../derived/icons/svg/hiw-endings-map-desktop__natt.svg); [08 §8](08-iconography-and-svg.md#8-the-endings-map)).
- **Craft objects at the peaks.** An easel with a breathing veil for the portrait reveal, a wooden signpost with brass nails over a canvas fire for the wait, a plank button "Öppna boken" [Open the book] ([05b §16](05b-components-app-and-forms.md#16-reproduce-it-film-and-emulation-recipes)).

Styleframes already in the library: [../derived/typography/film-title-card-natt.webp](../derived/typography/film-title-card-natt.webp) and [film-title-card-morgon.webp](../derived/typography/film-title-card-morgon.webp) (the hero at 1920×1080), [../screenshots/flows/extra-viewports/home__sv__natt__1920x1080__fold.webp](../screenshots/flows/extra-viewports/home__sv__natt__1920x1080__fold.webp) and [home__sv__morgon__1920x1080__fold.webp](../screenshots/flows/extra-viewports/home__sv__morgon__1920x1080__fold.webp) (the live site at 1080p), and the motion references [../screenshots/motion/home-hero-idle-12s__sv__natt__desktop.webm](../screenshots/motion/home-hero-idle-12s__sv__natt__desktop.webm) and [../derived/theming/crossfade/theme-switch__natt-morgon-natt__desktop__60fps.mp4](../derived/theming/crossfade/theme-switch__natt-morgon-natt__desktop__60fps.mp4).

### 3.2 Motion language, in numbers

Machine-readable: [../derived/motion/motion-spec.json](../derived/motion/motion-spec.json) (curves and 26 motifs); Remotion helpers: [../derived/motion/motion-tokens.ts](../derived/motion/motion-tokens.ts) (`EASE`, `DUR`, `yoyo`, `heroIdle`, `pulseRing`, `fadeUp`, `hoverLift`, `pathDraw`, `themeMix`, `emberRise`). Frames at 30 fps; double them for 60 fps.

**Curves** (`motion-spec.json` → `curves`):

| Name | Cubic bezier | Character | Use in film |
|---|---|---|---|
| `css_ease` | `0.25, 0.1, 0.25, 1` | the CSS default | dissolves, colour, glow and shadow fades |
| `ease_in_out` | `0.42, 0, 0.58, 1`, applied per half | a pendulum that stops dead at both ends | every idle loop |
| `ease_out` | `0, 0, 0.58, 1` | | path draw-on, rising embers |
| `settle` | `0.2, 0.7, 0.3, 1` | fast arrival, long settle | entrances (0.45 s), reveals (0.7 s) |
| `soft_spring` | `0.2, 0.7, 0.3, 1.2` | overshoots 4.4 % | objects that land: covers, cards, toggle thumb |
| `spring` | `0.2, 0.7, 0.3, 1.4` | overshoots 11.7 % | things that are pressed: buttons, pops |

**Motifs** (from [09 §13.1](09-motion-and-interaction.md#131-per-motif) and `motion-spec.json` → `motifs`):

| Motif | Values | Duration (s / frames @30) | Curve |
|---|---|---|---|
| Star twinkle | opacity 0.95 → 0.55 → 0.95 | 4.6 / 138 | ease-in-out per half |
| Back cover float | rotate −8° → −8.6°, y 0 → −12 px | 7 / 210 | ease-in-out |
| Front cover float | rotate 7° → 7.6°, y 0 → −16 px | 8 / 240 | ease-in-out |
| Glass chip float | rotate 2.5° → 3°, y 0 → −7 px | 9 / 270 | ease-in-out |
| Gold dot pulse | ring 0 → 12 px, `#f2b22e73` → `#f2b22e00` at 70 %, then rest | 2.4 / 72 | ease |
| Press lift | y 0 → −3 px (peak −3.35), shadow `0 14px 40px #f5c54247` → `0 20px 55px #f5c5426b` | 0.25 / 7.5 (shadow 0.3 / 9) | spring |
| Press down | scale 1 → 0.96 | 0.25 / 7.5 | spring |
| Card lift | y −10 px, rotate −1° | 0.35 / 10.5 | soft spring |
| Theme dissolve | plates and text colours 0 → 1 | 0.5 / 15 | ease |
| Map route draw | stroke trim 0 → 1, opacity 0 → 0.9; next route every 4.5 s / 135 f | 0.9 / 27 | ease-out |
| Screen enter | opacity 0 → 1, y 22 → 0 px; no exit animation | 0.45 / 13.5 | settle |
| Veil breathe | glow opacity 0.42 ↔ 0.9, scale 1 ↔ 1.06 | 4.6 / 138 | ease-in-out |
| Portrait unveil | blur 26 → 20 → 7 → 0 px in phases at 0 / 1.1 / 2.6 s, each 1.5 s | 4.1 / 123 (computed: 2.6 + 1.5) | ease |
| Gold sheen | a 115° band slides −130 % → 130 % | 1.3 / 39 | ease |
| Ember burst | 18 embers, x ±110 px, y −120 … −280 px, opacity 0 → 0.95 (12 %) → 0, delays 0-0.9 s | 2.4 / 72 | ease-out |

Rules of motion ([09 §14](09-motion-and-interaction.md#14-read-the-motion-personality)):

- **Bedtime tempo.** Loops last 4.6-9 s; responses last 0.25 s; the ratio is about 30:1. Peak idle speed on the site is 6.9 px/s. **Read:** keep any camera drift under that, about 9 px/s once the 1440 layout is scaled ×4/3 to a 1920 frame.
- **Coprime loops.** Give floating layers their own periods (7 / 8 / 9 s) and amplitudes (12 / 16 / 7 px) so they never sync; the fan repeats its pose only every 504 s.
- **Overshoot only where a hand is.** Ambient motion never overshoots.
- **Light is the effect.** What "happens" is a gold ring growing, a glow breathing, a sheen passing, embers rising, a path drawing.
- **Cuts and settles, not camera tricks.** The site's grammar between screens is a cut followed by a 0.45 s settle-in from 22 px below. No sideways slides, wipes, zooms or spinners ([09 §13.3](09-motion-and-interaction.md#133-shot-recipes), recipe 7). **Read:** a slow push-in inside a storybook plate is still in keeping, best on the shoulder-to-shoulder two-shots ([07 §16](07-illustration-and-imagery.md#16-read-using-this-in-film)).
- **Night to morning.** Dissolve two finished frames over 15 frames `ease`, or stagger plate (frames 0-15) then text (frames 6-18) ([06 §14](06-theming-and-atmosphere.md#14-reproducing-it)). Do not reproduce the site's mixed state, where gradients flip at frame 0. The accent passes through a muddy mauve in sRGB (`#f5c542 → #a98383 → #5b3fc7`, [02 §14](02-color.md#14-the-theme-crossfade-frame-by-frame)); route it through coral `#ff6154` or cut on a beat instead.

After Effects users: [09 §13.2](09-motion-and-interaction.md#132-after-effects-conversion) converts each curve to influence and speed. For the springs, use three keys: 0, **104.4 % at 72 %** of the time (soft spring) or **111.7 % at 64 %** (spring), then 100 %.

### 3.3 Type on screen at 1920×1080

The site is laid out for a 1440-wide desktop, so ×4/3 maps it onto a 1920 frame. [../derived/typography/film-title-card.html](../derived/typography/film-title-card.html) renders the hero rules at `zoom: 4/3` inside 5 % safe margins (96 / 54 px). Sizes from [03 §13.4](03-typography.md#134-scale-for-a-19201080-frame):

| Role | Face | Site px at 1440 | ×4/3 at 1080p | Film minimum (Read, 03) | Leading / tracking |
|---|---|---|---|---|---|
| Title (h1) | Lora 700 | 70.4 | 93.9 | 90-120 | 1.06 / −0.015em |
| Section headline | Lora 700 | 43.2 | 57.6 | 56-72 | normal / −0.015em |
| h2 | Lora 600 | 32 | 42.7 | 44-56 | normal / −0.01em |
| Wordmark | Cinzel 700, uppercase | 27.52 | 36.7 | 36-48 | 0.109em (3 px at 27.52 px) |
| Lede | Source Serif 4 400 | 20.48 | 27.3 | 28-34 | 1.65 |
| Body serif | Source Serif 4 400 | 16.32 | 21.8 | ≥ 28 | 1.75 |
| Button label | Grotesk 700 | 16.8 | 22.4 | 26-32 | — |
| Kicker chip | Grotesk 700 | 13.6 | 18.1 | ≥ 24 | — |
| Eyebrow | Grotesk 700, uppercase | 13.12 | 17.5 | ≥ 22 | 0.152em (2 px at 13.12 px) |

Rules for type in a frame:

- One sentence per card. The coloured phrase is last; the full stop stays in the headline ink.
- Keep tracking in **em** when scaling.
- Over the night plate, use the scrim and `0 2px 30px #0c082859` under the title (G:511), or set type in the calm areas: the dark sky at top left, or the lower band, which measures 1.18 busyness against 3.25-4.64 behind the hero copy ([06 §6.4](06-theming-and-atmosphere.md#64-where-text-can-sit-measured-busyness)).
- Over the morning plate, set dark plum ink `#241f35` on the empty paper centre; nothing else is needed.
- Small text (captions, names, metadata) sits on a glass chip, not on the painting.
- Typography never animates on the site (no kinetic type); it moves only with its container ([03 §14](03-typography.md#14-type-in-motion-pointers)). **Read:** in a film, keep to the same rule: fade-up 22 px over 0.45 s on `settle`.
- Fonts for film: [03 §13.2](03-typography.md#132-remotion-the-studios-pipeline) gives a `@remotion/fonts` loader for the four latin files.

### 3.4 Colour script

**Read:** a sequence in four lights, each built from measured values. It follows the product's own evening: a night sky, the forge that makes the book, the warm pages, and the morning after.

| Act | Light | Palette (literal) | Source |
|---|---|---|---|
| 1. Night sky (the promise) | one warm light in a cool dark field | canvas `#171232`; nebula clusters `#101B3F` 26 %, `#38446E` 24 %, `#746F8E` 15 %; book glow `#fbf8cd`; gold `#f5c542`; cream ink `#fff7e9`; scrim `#0b0f1e` / `#0d1122` | G:606, G:464, G:494, G:632; [06 §6.1](06-theming-and-atmosphere.md#61-night-nebula-herowebp) |
| 2. The forge (the wait) | firelight, wood and brass, the same in both themes | sign board `linear-gradient(178deg, #5e4129, #4a3120 56%, #3c2717)` with `#fbeed2` text; ember core `radial-gradient(circle at 42% 38%, #fff3cf, #ffd98f 45%, #ff9a4c 78%, #e06a24 100%)` | H:90-91, H:541-548; [02 §9.2](02-color.md#92-the-glöd-stage-hearth--ember-scene) |
| 3. The book (the story) | indoor evening window light, warm brown shadows, no blue | pooled `#E9C898` 20 %, `#6A4B1B` 20 %, `#9D7D38` 18 %, `#D18537` 17 %, `#2E2211` 15 %, `#AB301F` 8 %; highlights near `#F7CA71` | [07 §5.1](07-illustration-and-imagery.md#51-pooled-palettes), [07 §6](07-illustration-and-imagery.md#6-light) |
| 4. Morning (the memory) | diffuse dawn on paper | canvas `#ede9f6`; plate `#F3E9EF` 40 %, `#EEE2ED` 24 %, apricot `#FCD8A6`, lavender `#dcc9eb`, coral `#fab4a5`; ink `#241f35`; accent `#6d4fe0` / `#5b3fc7` | G:610, G:543, G:545-546; [06 §6.2](06-theming-and-atmosphere.md#62-morning-morgon-aurora-desktopwebp) |

Constants across all four: gold for anything "lit" (the logo, stars, the pulse dot `#f2b22e`); never pure white text at night and never pure black shadows ([../STYLE-GUIDE.md §17](../STYLE-GUIDE.md#17-do-and-dont)); never tint the storybook images toward the UI violet. The contrast between a warm picture and a cool sky is the point (P2 in [../STYLE-GUIDE.md §2](../STYLE-GUIDE.md#2-design-principles)).

### 3.5 Illustration assets and how to frame them

| Asset | Native | How the site frames it | In a 1920×1080 film |
|---|---|---|---|
| [nebula-hero.webp](../assets/assets/nebula-hero.webp) | 2400×1340 | fixed plate, `cover`, `center 30%` | cover to 1934×1080 (about 7 px trimmed per side) with [element__scrim-rgba__1920x1080.png](../derived/theming/night-stack/element__scrim-rgba__1920x1080.png) and [element__starfield-rgba__1920x1080__peak-opacity.png](../derived/theming/night-stack/element__starfield-rgba__1920x1080__peak-opacity.png) on top ([06 §14](06-theming-and-atmosphere.md#14-reproducing-it)) |
| [morgon-aurora-desktop.webp](../assets/assets/morgon-aurora-desktop.webp) | 2560×1440 | fixed plate, `cover` | exactly 16:9; type in the empty centre |
| [morgon-aurora-mobile.webp](../assets/assets/morgon-aurora-mobile.webp) | 1440×2560 | ≤760 px | 9:16 plate; a separate painting, not a crop |
| [cover-tornet.webp](../assets/assets/cover-tornet.webp), [cover-filten.webp](../assets/assets/cover-filten.webp) (Alva demo covers) | 848×1264 (2:3) | 5 px `--frame`, r 20, −8° / +7°, floating | 299×441 when the 1440 hero is scaled ×4/3 to fill the frame ([04 §19.2](04-layout-spacing-responsive.md#192-film-framing)); border and corners scale with it |
| [cover.webp](../assets/share/iris-sparade-platsen/assets/cover.webp) (sample book) | 1024×1536 (2:3) | gallery card | the same tilted-card treatment |
| [S1](../assets/share/iris-sparade-platsen/assets/S1.webp) … [S6BB](../assets/share/iris-sparade-platsen/assets/S6BB.webp) (14 pages) | 1536×1024; S1, S4A 1264×848 (3:2) | reader: the page `contain` over a copy of itself at `filter: blur(26px) saturate(1.08)`, `opacity: 0.9`, `scale(1.18)` | at full height a 3:2 page is 1620×1080 (computed), leaving 150 px each side: fill them with the same blurred copy (G:1784-1793) rather than cropping faces |
| [hero-portrait.webp](../assets/landing/iris/hero-portrait.webp) | 512×768 | vignette on cream paper in a `.hiw-frame` (10 px mat, r 24) | the "your hero" moment; the unveil uses a 330×440 (3:4) frame with a 6 px border and r 26 ([05b §16.1](05b-components-app-and-forms.md#161-the-unveil-portrait-reveal-about-5-s)) |
| [ending-1..4.webp](../assets/landing/iris/ending-1.webp) | 256×256 | round medallions on the endings map | small medallions only; for full frames use S6AA-S6BB |
| [pick-1.webp](../assets/landing/cards/pick-1.webp), [pick-2.webp](../assets/landing/cards/pick-2.webp), [pick-3.webp](../assets/landing/cards/pick-3.webp), [surprise-us.webp](../assets/images/create/surprise-us.webp) | 800×537 | 3 px frame, r 14, fanned −4° / 0° / +4° | "choose tonight's adventure" beats; small on screen |
| [cover-next-book.webp](../assets/landing/cover-next-book.webp) | 848×1264 | ghost "nästa bok" [next book] cover | the end card's promise of continuity |
| [narrator-morfar.webp](../assets/landing/voice/narrator-morfar.webp), [portrait-grandpa.jpg](../derived/brand/narrators/portrait-grandpa.jpg) | 256 / 400 square | 28 px circle in the voice chip | a small circular portrait beside the narrator's first line |
| [tf-logo.webp](../assets/assets/tf-logo.webp) | 512×512 | 42 px with `drop-shadow(0 0 14px #f5c54280)` | unchanged, gold, with its glow; never recoloured |

Contact sheets: [../derived/illustration/contact-sheet__scenes-branch-tree.webp](../derived/illustration/contact-sheet__scenes-branch-tree.webp) (all 14 pages as the story tree), [contact-sheet__covers.webp](../derived/illustration/contact-sheet__covers.webp), [contact-sheet__landing-images.webp](../derived/illustration/contact-sheet__landing-images.webp).

Framing notes:

- **Keep the families apart** ([07 §3](07-illustration-and-imagery.md#3-the-image-families-and-the-storybook-vs-atmosphere-contrast)). The Iris book (watercolour and coloured pencil, warm brown line), the Alva covers (ink outline and wash), the narrator vignettes, the glossy adventure cards and the two backdrop paintings are six different hands. Do not cut one into a sequence of another without a frame or a theme change between them.
- **Composition of the pages.** Mass is centred: every scene's luminance centroid falls within x 0.47-0.54 and y 0.45-0.60. The camera is slightly high, three-quarter, at a child's eye height; there are no low angles, extreme wides or Dutch tilts ([07 §7](07-illustration-and-imagery.md#7-composition-framing-and-perspective)).
- **Continuity jumps are in the source.** Window side, time of day and Mossa's size change between consecutive pages ([07 §6](07-illustration-and-imagery.md#6-light), [§8.3](07-illustration-and-imagery.md#83-mossa-scale-drift-is-the-main-consistency-failure)). **Read:** cut so the jumps fall on the choice points, or regenerate with the kit in §4.3.
- **Resolution.** The plates are 2400 and 2560 px wide. **Read:** they hold at 1080p; a 3840-wide delivery needs an upscale of the plates.
- **Rights.** The images, narration and beds are Tale Forge's assets. Use them as reference, temp or pitch material unless Tale Forge grants a licence ([11 §10](11-audio-and-voice.md#10-using-these-sounds-in-a-film) makes the same point for sound).

### 3.6 New art that matches

Every one of the 15 image prompts behind the sample book ends with this line, verbatim ([../prompts/style-block.txt](../prompts/style-block.txt)):

```text
Warm watercolor and colored-pencil children's-book illustration style, soft light, rounded shapes, expressive small gestures. Absolutely no text, no letters, no numbers, no labels, no signage anywhere in the image.
```

The full recipe (prompt anatomy, character sheets, consistency kit, negatives) is §4. For the backdrops and cards, which have no source prompts, [07 §15.5](07-illustration-and-imagery.md#155-the-other-families-constructed-descriptions-no-source-prompts-exist) gives constructed descriptions.

### 3.7 Sound

**The narrator is the brand's voice.** The default persona is `grandpa` = **Morfar Erik** [Grandpa Erik; *morfar* is the mother's father], described as "En varm, vis berättare med en mysig godnattstämma" / "A warm, wise storyteller with a cozy bedtime voice" ([11 §4](11-audio-and-voice.md#4-the-narrator-morfar-erik--grandpa-erik)).

| Measure (14 sample pages) | Value |
|---|---|
| Engine | `vertex-gemini-tts:gemini-3.1-flash-tts-preview:Enceladus` |
| Pace | 87-115 words/min over the whole file (mean 102); 118-147 without pauses |
| Pauses | 13-25 per page (≥ 0.2 s at −40 dBFS), 20 % of the speech time on average; median pause 0.44-1.17 s per page (mean 0.66 s); longest 2.27 s |
| Pitch | median F0 93-119 Hz; rises about +2.7 semitones on quoted dialogue and about a fifth on the girl Amina's lines |
| Loudness | −18.5 to −19.9 LUFS-I, true peak −2.0 to −2.4 dBTP |
| Between pages in listen mode | 900 ms of bed-only sound |
| Choice moments | no narration: the voice stops and the child decides |

English line, the brand promise in his mouth: "Come close my friend. Tonight, I am telling a story that belongs to you alone, and I will keep every word warm." ([../assets/audio/landing-voice/grandpa-sample-en.mp3](../assets/audio/landing-voice/grandpa-sample-en.mp3), machine transcript in [11 §4.5](11-audio-and-voice.md#45-swedish-vs-english-morfar)). Casting brief for a new read: [11 §10.4](11-audio-and-voice.md#104-emulating-the-voice-if-a-new-read-is-needed) (a Scandinavian man of about 70, about 100 Hz, breathy-soft, close-miked, 95-110 wpm, 0.5-1 s after every sentence, never projecting).

**The six ambient beds** (`AMBIENT_BEDS`; all 30.000 s, 128 kb/s MP3, 44.1 kHz stereo, seamless loops; [11 §7](11-audio-and-voice.md#7-the-six-ambient-beds), [../derived/audio/audio-specs.csv](../derived/audio/audio-specs.csv)):

| id | Svenska | English | Group | LUFS-I | TP dBTP | LRA LU | Measured character |
|---|---|---|---|---|---|---|---|
| [`hearth`](../assets/audio/atmosphere/v1/hearth.mp3) (default) | Brasa | Fireplace | ambience | −24.4 | −2.6 | 2.7 | close log fire; 84.8 % of energy below 80 Hz; effectively mono |
| [`rain`](../assets/audio/atmosphere/v1/rain.mp3) | Fönsterregn | Window rain | ambience | −24.7 | −3.2 | 0.5 | steady bright rain on glass; centroid 6309 Hz |
| [`forest`](../assets/audio/atmosphere/v1/forest.mp3) | Sagoskogen | Enchanted forest | ambience | −24.4 | −3.1 | 3.8 | evening wood, breeze, a few chirps; the widest bed |
| [`musicbox`](../assets/audio/atmosphere/v1/musicbox.mp3) | Speldosa | Music box | music | −24.3 | −11.0 | 3.1 | D major, A4-E7, a 0.5 s note grid (120 BPM) |
| [`harp`](../assets/audio/atmosphere/v1/harp.mp3) | Månharpa | Moonlit harp | music | −24.3 | −9.3 | 3.6 | F major pentatonic, G3-D5, dark and soft |
| [`fire`](../assets/audio/atmosphere/v1/fire.mp3) | Glödljus | Ember glow | music | −24.4 | −5.6 | 5.7 | embers with one held F#5 tone; stereo correlation −0.14 |

**Levels.** In the app the bed plays at `DEFAULT_BED_VOLUME` 0.18 (−14.9 dB), about −39.3 LUFS, which is about 20 LU under the voice; the maximum, 0.4, is still about 13 LU under ([11 §3.8](11-audio-and-voice.md#38-level-design-what-the-listener-actually-hears)). Mapped to a film mix with the voice at −16 LUFS ([11 §10.1](11-audio-and-voice.md#101-mixing-to-the-studios-delivery-spec)):

| Element | Film level |
|---|---|
| Narration | −16 LUFS (raise about 3.4 dB through a true-peak limiter) |
| Bed under voice, "default feel" | −36 LUFS |
| Bed under voice, never louder than | −29 LUFS |
| Bed alone (title card, choice beat) | −24 to −27 LUFS |

**Rules** ([11 §9](11-audio-and-voice.md#9-sonic-identity-interpretation), [§10.2](11-audio-and-voice.md#102-bed-handling)):

- Voice first, everything else far under it. No interface sounds and no autoplay on the site: every sound starts from a click.
- Warm interior at night: fire, rain on the window, a music box. Only plucked and struck music; no percussion, bass line or vocals.
- High-pass `hearth` at about 45 Hz for film. Do not layer `fire` (F#5) with `harp` (F major). Check `fire` in mono before broadcast.
- Cut music on the music box's 0.5 s grid; loop at the file boundary or crossfade 2-3 s inside the harp's rests.
- Hold a silent beat (bed only) on a choice. Budget about 0.6 s per word of narration, pauses included.
- ffmpeg recipes for a narrated page over the default bed: [11 §10.3](11-audio-and-voice.md#103-ffmpeg-recipes-literal).

### 3.8 On-screen copy and voice-over, Swedish and English

From [10 §14](10-copy-voice-and-tone.md#14-reproducing-the-voice) and [10 §10](10-copy-voice-and-tone.md#10-swedish-and-english-side-by-side):

1. **Write Swedish first.** Address the family in the plural *ni / er*; use *du* only for one adult's account or payment and for lines spoken to the child. The English is a close copy of the Swedish, not a rewrite.
2. **One idea per sentence, 7-8 words.** Headlines 3-5 words. Close a claim with a 1-3 word fragment ("På riktigt." [For real.]).
3. **Title cards are one declarative sentence with a full stop and the child last**, in the accent colour.
4. **Craft verbs:** *måla* [paint], *smida* [forge], *baka* [bake], *skriva* [write], *läsa in* [narrate, literally "read in"]. Never "generera" [generate]. AI appears once, small and factual: "Skapad med AI" [Created with AI] ([10 §8](10-copy-voice-and-tone.md#8-how-ai-is-mentioned)).
5. **State the time and the limit, then frame it humanly:** "Det tar ungefär tio minuter, och det säger vi hellre ärligt än låtsas att det går på en sekund." [It takes about ten minutes, and we would rather say that honestly than pretend it takes a second.] → "Lagom tid för tandborstning och pyjamas." [Just enough time for toothbrushing and pajamas.]
6. **Reassure with the refrain:** "Boken lägger sig i bokhyllan när den är klar." [The book lands on the bookshelf when it is ready.] / "Allt ni byggt är kvar." [Everything you built is still here.]
7. **Punctuation:** no `!` in Swedish (0 in all Swedish copy), no dashes, three full stops for "...", straight quotes, `·` between metadata, digits for prices and counts, words for story numbers ("fyra olika slut" [four different endings]) ([10 §9](10-copy-voice-and-tone.md#9-punctuation-case-and-numerals)).
8. **English:** US spelling as on the site ("cozy", "pajamas", "color"); keep the quiet statements; drop the "Please" and the "!" that the English UI sometimes adds. Names: *Natt / Morgon* become Night / Morning; *Morfar Erik* becomes Grandpa Erik.
9. **End on memory:** *minns* [remembers], *världen* [the world], *nästa bok* [the next book].

Lines from the site that work as VO or supers (site's own English):

| Svenska | English |
|---|---|
| En värld som minns henne. | A world that remembers her. |
| Ikväll är hjälten ert barn. | Tonight the hero is your child. |
| Den målade hjälten återvänder. | The painted hero returns. |
| Inga låtsasval. Båda vägarna är skrivna, målade och inlästa. | No pretend choices. Both paths are written, painted, and narrated. |
| Ni fyller inte en hylla med lösa sagor. Ni bygger en värld. | You are not filling a shelf with loose stories. You are building a world. |
| Elden har smitt klart din saga. | The fire has forged your story. |
| Tale Forge, sagor som minns er värld. | Tale Forge, storybooks that remember your world. |
| Skapa er hjälte | Create your hero |

New lines in the house pattern, written for the library and **not from the site** ([10 §14](10-copy-voice-and-tone.md#14-reproducing-the-voice)): "En saga som minns **er kväll**." [A story that remembers **your evening**.] · "Ikväll är hjälten ert barn. Morfar Erik läser." [Tonight the hero is your child. Grandpa Erik reads.] · "Boken tar ungefär tio minuter. Lagom tid för tandborstning." [The book takes about ten minutes. Just enough time for toothbrushing.]

### 3.9 A shot grammar taken from the product

**Read:** the product already contains a film structure. The sample book's briefs form a shot list ([12 §11](12-story-and-content-model.md#11-the-illustration-brief-grammar-a-ready-shot-list)): wide to establish, overhead three-quarter at the decision, tighter through the ordeal, a close insert on the small magic, wide or medium on the return. Choices are held frames with an empty space and an untouched object. Endings are two- or three-shots in warm window light with the hung picture behind. The site's own sequences give the transitions:

| Beat | Picture | Motion | Sound |
|---|---|---|---|
| Open | night plate, stars breathing, nothing else moves | hero idle loops (§3.2) from frame 0 | `hearth` alone at −24 to −27 LUFS |
| Promise | title card "En värld som minns henne." | fade-up 22 px over 13.5 f on `settle` | narrator enters; bed drops to −36 |
| The hero | the unveil: blur 26 → 0 px over about 4.1 s, gold sheen, 18 embers | [05b §16.1](05b-components-app-and-forms.md#161-the-unveil-portrait-reveal-about-5-s) frame by frame | voice, then a held beat |
| The wait | the forge: signpost, canvas fire | fire grows in steps ×0.55 → ×1 → ×1.25 ([05b §16.2](05b-components-app-and-forms.md#162-the-waiting-fire-book-baking)) | `hearth` or `fire` |
| The story | 3:2 pages over their own blurred copy | cut + settle between pages; slow push-in on two-shots | narration, 900 ms bed-only between pages |
| The choice | a held frame, an empty space, an untouched object | endings map draws one route per 4.5 s | no voice |
| Morning | dissolve to the morgon plate over 15 f | thumb on the soft spring | `musicbox` or `harp` |
| End | the "nästa bok" [next book] ghost cover, "Skapa er hjälte" | press lift on the button | bed alone |

---

## 4. Generating new illustrations in this style

### 4.1 The prompt recipe

Every image prompt in the sample book has three parts, in this order ([07 §11.3](07-illustration-and-imagery.md#113-anatomy-of-every-beat-brief-observed-invariants); [../prompts/README.md](../prompts/README.md)):

1. **A shot paragraph in English**, 55-72 words in 3-5 sentences (the cover's is 86). It opens with a phase tag and a shot type, then blocks every figure, states every prop that matters (including what is still empty), gives one small gesture, and names the light.
2. **The fixed header**, then one line per entity present in this shot, in the order Hero, Companion, Other, Place, Object, as `<Role> <Name>, <kind>: <look>` with the look in Swedish. The header is identical in all 15:

   `Appearance reference for entities already named in the shot above. Never add a character, object, flower, or prop merely because it is listed here:`
3. **`Style: `** followed by the style block (§3.6), identical in all 15.

The cover brief, verbatim ([../prompts/cover-brief.txt](../prompts/cover-brief.txt)):

```text
Wordless portrait 2:3 book cover in warm evening light at kvartersbiblioteket. Iris, a seven-year-old girl with dark curls, a raspberry-red raincoat, and yellow boots, stands decisively between the broad window bench and the soft green rug, holding exactly one stort ritpapper under her arm. Mossa, a small brown forest mouse with round ears and a green scarf, points toward the rug from Iris's yellow boot. On a low table between them lies exactly one silverpenna, catching the window light. Low bookcases frame the scene; no typography.

Appearance reference for entities already named in the shot above. Never add a character, object, flower, or prop merely because it is listed here:
Hero Iris, barnhjälte: sjuårig flicka med mörka lockar, hallonröd regnjacka och gula stövlar
Companion Mossa, talande skogsmus: liten brun skogsmus med grön halsduk och runda öron
Place kvartersbiblioteket: låga bokhyllor, en bred fönsterbänk och en mjuk grön matta
Object stort ritpapper: ett brett vitt ritpapper med plats för flera tecknare
Object silverpenna: en vanlig tjock penna som lämnar blanka silverstreck

Style: Warm watercolor and colored-pencil children's-book illustration style, soft light, rounded shapes, expressive small gestures. Absolutely no text, no letters, no numbers, no labels, no signage anywhere in the image.
```

Glosses: *kvartersbiblioteket* [the neighbourhood library]; *stort ritpapper* [big drawing paper]; *silverpenna* [silver pen]; Iris [seven-year-old girl with dark curls, raspberry-red raincoat and yellow boots]; Mossa, *talande skogsmus* [talking forest mouse; small brown forest mouse with a green scarf and round ears]; the library [low bookshelves, a wide window bench and a soft green rug]; the paper [a wide white drawing paper with room for several artists]; the pen [an ordinary thick pen that leaves shiny silver lines].

Vocabulary from the 14 beat briefs ([../prompts/beats/](../prompts/beats/); [07 §15.1](07-illustration-and-imagery.md#151-template)):

| Slot | Words used |
|---|---|
| Phase tags | "Pre-choice.", "Settled result", "Final … return image" |
| Shot types | "Wide establishing frame", "balanced overhead-three-quarter frame", "High three-quarter view", "Intimate window-bench frame", "Tight tabletop frame", "close view", "tight two-child tabletop crop", "Final warm medium close-up" |
| Controls | "exactly one", "exactly two blank drawing spaces", "remains plainly unmarked", "untouched", "no one touching the pen", "clearly visible", "Palm-sized … much smaller than Iris's hand", "making his true mouse scale unmistakable" |
| Light | "warm evening light", "evening window light", "Warm window light falls across all three" |

A full beat brief to copy the rhythm from: [../prompts/beats/S6AB.md](../prompts/beats/S6AB.md) (the one where the scale clause worked).

**Style amplifiers (added by 07 from the measured images, not in the source prompts)** ([07 §15.2](07-illustration-and-imagery.md#152-style-amplifiers-added-from-the-measured-images)): "dark-brown coloured-pencil outlines and hatching over soft watercolour washes on warm cream paper with visible tooth; no black ink" · "golden evening window light, warm brown shadows, no blue fill; palette of ochre, amber, cream, moss green and one accent red" · "big dark round eyes with a white catchlight, stippled rosy cheeks, small nose, gentle closed-mouth smiles" · "low, rounded wooden furniture, braided moss-green rug, pine shelves". Target numbers for a finished set (medians over cover + 14 scenes): L\* about 45-55, chroma 30-45, warm-hued pixels 85-95 %, highlights near `#F5D6A0`, shadows near `#2B1E10`.

Image model recorded for the cover and the two character references: `azure-images:gpt-image-2` ([../prompts/sample-book-image-canon.json](../prompts/sample-book-image-canon.json) → `portraits`, `cover`). Sizes: pages 1536×1024 (3:2), cover 1024×1536 (2:3).

### 4.2 Character sheets

The engine kept Iris recognisable because every beat was conditioned on a reference portrait. Two details that are in no prompt appear in nearly every image, a pink polka-dot hood lining and a blue-and-white striped top ([07 §8.2](07-illustration-and-imagery.md#82-iris-observed-design)). The JSON names `portraits.hero` → `/share/iris-sparade-platsen/assets/refs/hero.png` and `portraits.companion` → `…/refs/companion.png` (both 404 when fetched read-only). The landing's [hero-portrait.webp](../assets/landing/iris/hero-portrait.webp), a full-length figure on cream paper (66 % paper-white), looks like that reference or a sibling.

Build one sheet per character before any scene:

| Field | What to fix | Example from the library |
|---|---|---|
| Canon line | `<Role> <Name>, <kind>: <look>`: species or age, hair, one costume with colour words | "Hero Iris, barnhjälte: sjuårig flicka med mörka lockar, hallonröd regnjacka och gula stövlar" |
| Mannerism | one small, repeatable gesture, which the briefs turn into a pose | Mossa "snurrar halsduken ett varv när han tänker" [twirls his scarf one turn when he thinks]; Amina "knackar lätt med pekfingret mot pappret när hon får en idé" [taps the paper lightly with her index finger when she gets an idea] ([07 §8.1](07-illustration-and-imagery.md#81-canon-verbatim-from-the-book-json)) |
| Reference portrait | full length, on blank warm cream paper, nothing else in the picture | [hero-portrait.webp](../assets/landing/iris/hero-portrait.webp) (512×768) |
| Unprompted details | write the ones the engine invents into the look, so they stay | pink polka-dot hood lining; blue-and-white striped top |
| Costume hue | measured hue window to hold across shots | raincoat h 27.3-36.3°, `#90231E` … `#DF4043`; Amina's jumper h 54.4-64.3°, `#C95D19` … `#DC7D35` ([07 §5.3](07-illustration-and-imagery.md#53-signature-costume-colours)) |
| Scale | the companion's size against the hero's hand | "Palm-sized Mossa, much smaller than Iris's hand" |
| Face template | the style has one child face, varied by hair and costume | big round eyes set low, small nose, small mouth, pink cheeks, about 1:4 head to body ([07 §8.5](07-illustration-and-imagery.md#85-faces-and-expressions)) |
| Expression range | gentle and low; tension in the hands | small smiles, a mild frown; no tears, anger or theatrical poses |

The library's sheet built from the shipped images, a model for the layout: [../derived/illustration/character-reference-sheet.webp](../derived/illustration/character-reference-sheet.webp). Because the style block forbids text in the image, add names and notes in layout software afterwards.

A reference-portrait prompt in the house structure (**ours**, constructed; the site's portrait prompt is server-side and not in the library):

```text
Wordless full-length reference portrait on blank warm cream paper. Iris stands facing three-quarter left with both hands in her raincoat pockets and a small closed-mouth smile; her yellow boots stand flat on the paper. Nothing else is in the picture: no floor, no furniture, no props. Soft warm light from the left.

Appearance reference for entities already named in the shot above. Never add a character, object, flower, or prop merely because it is listed here:
Hero Iris, barnhjälte: sjuårig flicka med mörka lockar, hallonröd regnjacka med rosa prickigt foder i luvan över en blåvit randig tröja, blå jeans och gula stövlar

Style: Warm watercolor and colored-pencil children's-book illustration style, soft light, rounded shapes, expressive small gestures. Absolutely no text, no letters, no numbers, no labels, no signage anywhere in the image.
```

[The look line glosses as: seven-year-old girl with dark curls, raspberry-red raincoat with a pink dotted lining in the hood over a blue-and-white striped top, blue jeans and yellow boots.]

### 4.3 Consistency rules learned from the sample book

From [07 §8](07-illustration-and-imagery.md#8-characters-design-faces-consistency), [§10](07-illustration-and-imagery.md#10-the-sample-book-as-an-image-sequence-all-14-beats) and [§15.3](07-illustration-and-imagery.md#153-consistency-kit-lessons-from-8-and-10):

1. **Anchor scale in every shot with a small companion.** Mossa is boot-high in S1, knee-high on the cover and in S2, head-sized in S3A, S3B, S5AA, S5AB, S5BB, S6BA and S6BB, and truly palm-sized only in S4A, S4B, S5BA and S6AB. Where the brief carried a clause such as "Palm-sized Mossa, much smaller than Iris's hand" (S4B, S5BA) or "only Mossa's tiny mouse head and two little front paws peek over the page … making his true mouse scale unmistakable" (S6AB), scale was mostly right; S5BB failed even with "Palm-sized". **Read:** the model treats a companion as a co-star and sizes him up; give a physical comparison, not an adjective.
2. **Pass the reference portrait to every shot** (§4.2).
3. **Describe every drawn or diegetic object once and reuse the description.** The "solfågel" [sun bird] Iris draws became a sun with a beak, an orange robin, a smiling sun and a yellow bird with spread wings, because the prompts named it but never described it.
4. **Lock the set.** Name the window side and the time of day in every shot. The window sits behind the figures in S1, to the right in S2, S3B and S6AA, and to the left in S6BA and S6BB; S6AA turned to night though its brief said evening ([07 §6](07-illustration-and-imagery.md#6-light)).
5. **Keep one render run.** S1 and S4A are 1264×848, paler (L\* 73.9 and 67.1 against 32.9-63.4) and crisper than the other twelve, which suggests another run or setting.
6. **Write the look in the prompt's language when you can.** The engine mixes English shots with Swedish looks, which worked with gpt-image-2; a single language is safer with other models.
7. **List only who and what is in the shot.** The fixed header exists because a listed entity tends to appear; S5BA lists only Hero and Companion because Amina is absent.
8. **State counts and empties before a choice:** "exactly one", "exactly two blank drawing spaces", "remains plainly unmarked", "no one touching the pen".

### 4.4 Negative constraints

| Never | Why (source) |
|---|---|
| text, letters, numbers, labels or signage in the image; on covers, "Wordless" and "no typography" | the style block and the cover brief; all 15 storybook images comply ([07 §7](07-illustration-and-imagery.md#7-composition-framing-and-perspective)) |
| characters, objects, flowers or props that are not in the shot paragraph | the fixed header |
| black ink outlines | storybook lines are warm brown pencil; the darkest decile has hue 54-81° ([07 §4](07-illustration-and-imagery.md#4-medium-technique-and-line-storybook-family)) |
| blue fill light, cool shadows, a violet tint | cool-hued pixels never exceed 3.9 % of a storybook image; the contrast with the violet UI is deliberate ([07 §1](07-illustration-and-imagery.md#1-at-a-glance)) |
| pure white paper inside the scene | paper-white share is 0.000-0.017 in 14 of 15 images; the paper is a warm cream |
| low angles, extreme wides, Dutch tilts | none occur ([07 §7](07-illustration-and-imagery.md#7-composition-framing-and-perspective)) |
| tears, anger, big theatrical poses | expressions are low-amplitude even where the prose says hands "burned" ([07 §8.5](07-illustration-and-imagery.md#85-faces-and-expressions)) |
| mixing image families inside one sequence | the Alva ink-and-wash covers, the cards and the nebula are other hands ([07 §3](07-illustration-and-imagery.md#3-the-image-families-and-the-storybook-vs-atmosphere-contrast)) |
| the create flow's default style for brand work | `DEFAULT_CREATE_STYLE_ID = "neon"` ("Lysande magi" [Glowing magic]) is not the watercolour of every marketing image ([../prompts/app-style-strings.md](../prompts/app-style-strings.md) §1) |
| sci-fi or space imagery inside the books | the astronaut is the only science-fiction image and lives only in the night backdrop ([07 §3](07-illustration-and-imagery.md#3-the-image-families-and-the-storybook-vs-atmosphere-contrast)) |

A worked beat prompt that applies all of the above is in [07 §15.4](07-illustration-and-imagery.md#154-worked-example-constructed-by-us-not-from-the-site) (constructed by the library, not from the site).

---

## 5. Checklist: does it look like Tale Forge?

Answer each with yes or no. A piece in the house style answers yes to all that apply to its medium.

| # | Check | Source |
|---|---|---|
| 1 | The night version exists and was designed first: canvas `#171232`, the nebula under its scrim | G:606, G:631-635 |
| 2 | Each frame has exactly one warm light source, gold `#f5c542` at night | G:464; [06 §6.1](06-theming-and-atmosphere.md#61-night-nebula-herowebp) |
| 3 | Night text is cream `#fff7e9`, never `#fff`; shadows are navy, indigo or plum, never black | G:494; [02 §8](02-color.md#8-coloured-light-shadows-and-glows) |
| 4 | The morning version is a token swap (violet `#6d4fe0` / `#5b3fc7`, white glass, white frames) with an identical layout | G:542-590 |
| 5 | Small text sits on glass (`#0f1628ad` + 22 px blur, or `#fffc` + 24 px) with the 1 px violet-gold-coral rim at 45 % | G:498-500, G:547-549, G:1110-1147 |
| 6 | Headlines are Lora 700, one declarative sentence with a full stop, the child last in the accent colour, the full stop in ink | G:855-870; [10 §5.1](10-copy-voice-and-tone.md#51-display-headline-one-declarative-sentence-a-full-stop-the-child-in-colour) |
| 7 | Text meant to be read aloud is Source Serif 4 at a leading of 1.65-1.85 | G:877, G:1823-1833 |
| 8 | Controls are Schibsted Grotesk 700 in 999 px pills at least 44 px tall (buttons 52 px) | G:886-903 |
| 9 | Cinzel appears only in uppercase on the made object (wordmark, book and reader titles) | G:696-710; [03 §1](03-typography.md#1-at-a-glance) |
| 10 | There is no gradient-filled text, no all-caps headline and no decorative italic | G:867-870; [03 §13.3](03-typography.md#133-exact-match-vs-upgrade) |
| 11 | Glass cards have 26 px corners; covers are 2:3 in a `--frame` mat and tilted a few degrees; controls are never rotated | G:1117, G:929-961 |
| 12 | Illustrations are warm watercolour and coloured pencil with brown line on cream paper, and are not tinted violet | [07 §4](07-illustration-and-imagery.md#4-medium-technique-and-line-storybook-family) |
| 13 | No illustration contains text, letters, numbers or signage | [../prompts/style-block.txt](../prompts/style-block.txt) |
| 14 | Idle motion loops over 4.6-9 s, eases in and out on every half, moves a few px and never overshoots | G:636-1009; [09 §3](09-motion-and-interaction.md#3-idle-loops-what-moves-when-nobody-touches-anything) |
| 15 | Fast motion (0.25 s, spring up to 11.7 % overshoot) happens only on things a hand touches | G:886-917 |
| 16 | Scene changes are cuts with a 0.45 s settle-in from 22 px below, or dissolves; there are no wipes, sideways slides, zooms or spinners | S:1-13; [09 §13.3](09-motion-and-interaction.md#133-shot-recipes) |
| 17 | Night and morning dissolve into each other over 0.5 s `ease` (15 frames at 30 fps) between finished frames | G:470-471 |
| 18 | A warm, low, grandfatherly voice leads, at about 100 words a minute with a pause after every sentence | [11 §4.3](11-audio-and-voice.md#43-pace-and-pauses-all-14-beats-from-narration-text-matchcsv) |
| 19 | The bed sits about 20 LU under the voice and never closer than 13 LU; there are no UI sound effects and no percussion | [11 §3.8](11-audio-and-voice.md#38-level-design-what-the-listener-actually-hears) |
| 20 | The Swedish is written first, addresses the family as *ni / er*, runs 7-8 words a sentence and has no `!` and no dashes | [10 §14](10-copy-voice-and-tone.md#14-reproducing-the-voice) |
| 21 | Making is described with craft verbs (*måla, smida, baka, skriva, läsa in*), never "generera"; AI appears only as "Skapad med AI" | [10 §8](10-copy-voice-and-tone.md#8-how-ai-is-mentioned) |
| 22 | Time is stated honestly ("ungefär tio minuter" [about ten minutes]) and framed humanly | [10 §14](10-copy-voice-and-tone.md#14-reproducing-the-voice) |
| 23 | The piece ends on memory: *minns*, *världen*, *nästa bok* | [../STYLE-GUIDE.md §2](../STYLE-GUIDE.md#2-design-principles) |
| 24 | The gold logo raster is used unchanged, with its 14 px gold glow | G:711-716 |
| 25 | A reduced-motion version freezes the loops and keeps only short fades | G:2349-2372; [14 §9](14-accessibility-and-craft.md#9-motion-and-prefers-reduced-motion) |

---

## 6. Files this playbook relies on

| Purpose | Files |
|---|---|
| Master summary | [../STYLE-GUIDE.md](../STYLE-GUIDE.md), [../README.md](../README.md), [../style-board.html](../style-board.html) |
| Tokens | [../tokens/tokens.css](../tokens/tokens.css), [../tokens/tokens.json](../tokens/tokens.json), [../tokens/tokens.ts](../tokens/tokens.ts) |
| CSS (cite these) | [../source/css/3q17cp_jgfwol.pretty.css](../source/css/3q17cp_jgfwol.pretty.css), [../source/css/2_gt301v4m-60.pretty.css](../source/css/2_gt301v4m-60.pretty.css), [../source/css/37m388zf6rymp.pretty.css](../source/css/37m388zf6rymp.pretty.css) |
| Markup | [../source/rendered/dom__home__sv.html](../source/rendered/dom__home__sv.html) |
| Fonts | [../derived/typography/fonts/](../derived/typography/fonts/), [../derived/typography/font-files.md](../derived/typography/font-files.md), [../derived/typography/licences/](../derived/typography/licences/) |
| Backdrop and theming | [../derived/theming/recreate/theme-stack.html](../derived/theming/recreate/theme-stack.html), [../derived/theming/night-stack/](../derived/theming/night-stack/), [../derived/theming/theme-system.json](../derived/theming/theme-system.json) |
| Motion | [../derived/motion/motion-spec.json](../derived/motion/motion-spec.json), [../derived/motion/motion-tokens.ts](../derived/motion/motion-tokens.ts), [../derived/motion/clips/](../derived/motion/clips/), [../screenshots/motion/](../screenshots/motion/) |
| Film type | [../derived/typography/film-title-card.html](../derived/typography/film-title-card.html), [../derived/layout/film-frames-guides.webp](../derived/layout/film-frames-guides.webp) |
| Illustration | [../prompts/](../prompts/README.md), [../derived/illustration/character-reference-sheet.webp](../derived/illustration/character-reference-sheet.webp), [../derived/illustration/palettes.json](../derived/illustration/palettes.json), [../assets/share/iris-sparade-platsen/assets/](../assets/share/iris-sparade-platsen/assets/) |
| Sound | [../assets/audio/atmosphere/v1/](../assets/audio/atmosphere/v1/), [../assets/audio/landing-voice/](../assets/audio/landing-voice/), [../derived/audio/audio-specs.csv](../derived/audio/audio-specs.csv), [../derived/audio/seams/](../derived/audio/seams/) |
| Copy | [../copy/pages/](../copy/pages/), [../copy/app-strings.md](../copy/app-strings.md), [../copy/glossary.md](../copy/glossary.md), [../copy/sample-book-text.sv.md](../copy/sample-book-text.sv.md) |
| Icons | [../derived/icons/svg/](../derived/icons/svg/) |

The scripts that verified the starter and the links in this file were kept outside the library, in the session scratchpad, like the other analysis tools ([../README.md](../README.md)).
