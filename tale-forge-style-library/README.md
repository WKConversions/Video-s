# Tale Forge style library

A reference library of how [tale-forge.app](https://tale-forge.app) looks, moves, sounds and speaks. Tale Forge (Tale Forge AB, Värnamo) is a Swedish/English web app that makes personalised, AI-illustrated, narrated, branching picture books for children, read at bedtime, in a story world that remembers the child from book to book.

The library holds two kinds of material:

- **Literal material**: the site's own HTML, CSS, JS, fonts, images, audio, copy and image prompts, plus screenshots and recordings of the live site. Nothing in these folders is redrawn or retyped.
- **Analysis**: fifteen files in [analysis/](analysis/) (01-14, with 05 split into 05a and 05b) that describe each dimension of the style with every value cited to the literal material, a playbook for recreating it ([analysis/15-recreating-the-style.md](analysis/15-recreating-the-style.md)), and a master summary in [STYLE-GUIDE.md](STYLE-GUIDE.md).

**Start here:** [STYLE-GUIDE.md](STYLE-GUIDE.md) (the whole style in one document) → [style-board.html](style-board.html) (one visual page) → [analysis/15-recreating-the-style.md](analysis/15-recreating-the-style.md) (recipes for web and film) → the numbered analysis files for depth.

## Source and capture

| | |
|---|---|
| Site | https://tale-forge.app (Swedish default; English via the `tf_locale=en` cookie, same URLs) |
| Captured | 2026-10-09 and 2026-10-10. The home response is dated `Fri, 09 Oct 2026 13:03:29 GMT` ([source/meta/home-response-headers.txt](source/meta/home-response-headers.txt)) |
| Release | `<meta name="tf-release-sha" content="4be07efd68ad299089d33297742e56589f587460">` in every server HTML ([source/html/home.sv.html](source/html/home.sv.html)) |
| Footer version | `Version 16ab1756 · 26 sep. 2026` (sv) / `Version 16ab1756 · 26 Sep 2026` (en), with a `Beta` badge ([source/rendered/dom__home__sv.html](source/rendered/dom__home__sv.html)). The footer hash and the release sha name different commits |
| Routes covered | `/`, `/start`, `/uppgradera`, `/login`, `/signup`, `/integritet`, `/villkor`, 404, `/share/iris-sparade-platsen` (404), the unlisted `/bokmassan/*` kiosk; gated routes reconstructed from code |
| Size | about 1.1 GB, most of it screenshots |

### Method

- **Harvest.** Server HTML per route and language, the four shipped stylesheets, 17 client JS chunks, fonts, images, audio, manifest, robots, sitemap and response headers were downloaded as served.
- **Browser.** Headless Chromium driven by Playwright. Viewports: desktop 1440×900, tablet 834 wide, mobile 390×844, plus 1920×1080, 2560×1440 and 360×740 for the home page. Both languages (`tf_locale`) and both themes (`localStorage['tf-theme']` = `natt` or `morgon`). Hydrated DOMs, computed styles and running animations were dumped per page.
- **Safety.** Read-only. Every non-GET request to the site, analytics (`/ph`) and third-party hosts (except Google Fonts) were aborted. No account, child, portrait or book was created and nothing was submitted. Screens behind the backend were rendered by the site's own code from a seeded local draft with mocked backend responses. Each such screenshot is labelled (`LIVE`, `LIVE·INJECTED`, `FORCED`, `RECON`, `CODE-ONLY`; see [05b §0](analysis/05b-components-app-and-forms.md#0-method-evidence-labels-and-safety)).
- **Code.** JS was read and parsed (grep, acorn), never executed outside the browser session. CSS is cited from the prettified copies with line numbers; one-line JS chunks are cited by character offset.
- **Measurement.** Contrast from live crops with the text hidden; colour palettes by k-means in CIELAB; motion by pausing and seeking CSS animations; accessibility with axe-core 4.14.0 (36 runs); audio with ffmpeg (EBU R128 loudness), numpy spectra and pitch, and faster-whisper transcripts.
- **Interpretation** is always marked **Read:** in the analysis files. The tools that produced the derived files were kept outside the library (session scratchpad).

## How to navigate

1. Read [STYLE-GUIDE.md](STYLE-GUIDE.md) for the principles, both themes, token tables, type scale, motion timings, sound levels, voice rules and the defect list.
2. Open the analysis file for the dimension you need (table below). Each one starts with an "At a glance" table and ends with recipes, a file index and open questions.
3. Follow the links from any analysis file into `source/`, `assets/`, `screenshots/` and `derived/` for the literal evidence.
4. To build something, use [tokens/](tokens/), [style-board.html](style-board.html) and [analysis/15-recreating-the-style.md](analysis/15-recreating-the-style.md).

## Folder tree

```text
tale-forge-style-library/
├── README.md                this index
├── STYLE-GUIDE.md           the master style guide
├── style-board.html         one-page visual style board (WebP renders in derived/style-board/)
├── analysis/                15 analysis files (01-14 with 05a/05b) + 15-recreating-the-style.md
├── tokens/                  design tokens: tokens.css|json|ts (combined), color.css, color.json,
│                            typography.json, layout.json
├── source/
│   ├── html/                17 server HTML files: 8 routes × sv/en + the share-route 404
│   ├── css/                 4 stylesheets as served (*.css) and prettified (*.pretty.css, cite these)
│   ├── js/                  17 client chunks (Next.js / Turbopack), read only
│   ├── rendered/            16 hydrated DOMs, 64 computed-style dumps, 8 running-animation dumps
│   ├── meta/                manifest, robots.txt, sitemap.xml, response headers, asset URL lists
│   └── sample-book.iris-och-den-sparade-platsen.json   the complete sample book data object
├── assets/
│   ├── assets/              logo, night and morning plates, Alva demo covers, avatars
│   ├── landing/             Iris crops, adventure cards, next-book cover, narrator portrait
│   ├── images/create/       "Överraska oss" [Surprise us] door art
│   ├── share/iris-sparade-platsen/assets/   sample-book cover, 14 page images, 14 narrations
│   ├── audio/               6 ambient beds (atmosphere/v1/), 2 landing narrator samples
│   ├── fonts/               17 WOFF2 subsets with their served (hashed) names
│   ├── brand/               favicon, apple icon, icon, OG and Twitter images
│   ├── icons/               PWA icons 192 and 512
│   └── svg-inline/          16 inline SVGs lifted from the server HTML
├── screenshots/
│   ├── pages/<route>/       fold (PNG) and full-page (WebP) captures per language, theme, viewport
│   ├── home-sections/       each home section per language, theme, viewport
│   ├── components/landing/  63 landing components × natt/morgon × desktop/mobile (+ en), states
│   ├── components/app/      auth, pricing, /start s0-s8, waiting fire, reader (labelled by evidence)
│   ├── states/<lang>__<theme>/   rest/hover pairs of every interactive home element
│   ├── flows/               11 flows, step by step, plus extra-viewports/
│   └── motion/              WebM recordings (hero idle, scroll) and theme-switch frames
├── copy/                    copy decks per page (sv, en), all app strings, glossary, metrics,
│                            sample-book text, client-state screenshots
├── prompts/                 image prompts verbatim: style block, cover brief, 14 beat briefs, canon
└── derived/<area>/          measurements, sheets and extracts per dimension:
                             a11y, audio, brand, color, ia, icons, illustration, layout, motion,
                             story, style-board, theming, typography
```

## The analysis files

| File | What it covers |
|---|---|
| [01-brand-identity.md](analysis/01-brand-identity.md) | The name, the anvil-book-quill logo raster and its measured gold, the Cinzel nav lockup, favicons and OG image, brand lines, naming system and the four metaphor strands (forge, night sky, memory, honesty). |
| [02-color.md](analysis/02-color.md) | Five primitives and 47 semantic tokens per theme, the backdrop plates and scrim, the gold/violet accent swap, alpha and glows, route palettes (glöd hearth), image palettes and live-measured WCAG contrast. |
| [03-typography.md](analysis/03-typography.md) | Lora, Source Serif 4, Schibsted Grotesk and Cinzel: files and @font-face, weights declared versus drawn, the full type scale by role, treatments, Swedish diacritics and licences. |
| [04-layout-spacing-responsive.md](analysis/04-layout-spacing-responsive.md) | Page skeleton, containers and measures, measured vertical rhythm, the de-facto spacing and radius scales, elevation, z-index, blur, aspect ratios, tilt, tap targets and all 31 breakpoints. |
| [05a-components-landing.md](analysis/05a-components-landing.md) | All 63 landing components (nav, theme toggle, hero, cover fan, how-it-works steps, endings map, builder, shelf, footer) with CSS, measured sizes, states, keyboard order and four crops each. |
| [05b-components-app-and-forms.md](analysis/05b-components-app-and-forms.md) | Auth forms, pricing, the `/start` onboarding s0-s8, the portrait unveil, the Glödvakten waiting fire, the reader, legal pages, 404 and the book-fair kiosk, with evidence labels. |
| [06-theming-and-atmosphere.md](analysis/06-theming-and-atmosphere.md) | Natt and Morgon as a concept and a mechanism: the token diff, the backdrop stack, the two paintings, the measured crossfade, the toggle, glass, glows and how text stays legible. |
| [07-illustration-and-imagery.md](analysis/07-illustration-and-imagery.md) | Every raster image, the six image families, medium and line, measured palettes, light, characters and consistency, the verbatim prompt system and how to prompt the style. |
| [08-iconography-and-svg.md](analysis/08-iconography-and-svg.md) | The hand-maintained 24×24 icon set (lineage versus Feather and Lucide), stroke and colour rules, the endings-map SVG, decorative motifs, glyphs and icon accessibility. |
| [09-motion-and-interaction.md](analysis/09-motion-and-interaction.md) | Curves and durations, idle loops, hover and press, the theme switch, the self-drawing story map, the procedural fire, reduced motion and a frame-accurate motion spec for film. |
| [10-copy-voice-and-tone.md](analysis/10-copy-voice-and-tone.md) | Voice principles with evidence, sentence rhythm, headline and CTA formulas, price phrasing, how AI is mentioned, punctuation and numerals, Swedish beside English. |
| [11-audio-and-voice.md](analysis/11-audio-and-voice.md) | Every audio file, how audio is wired, the narrator Morfar Erik (engine, pace, pitch), narration matched to text, the six ambient beds, loop seams, levels and mixing recipes. |
| [12-story-and-content-model.md](analysis/12-story-and-content-model.md) | The sample book as data, the branching graph and four endings, narrative style measured, how choices are written, the world-memory mechanic and the content taxonomy. |
| [13-pages-ia-and-flows.md](analysis/13-pages-ia-and-flows.md) | Route inventory, the shared shell, the two page templates, page-by-page notes, metadata, eleven recorded flows, the user journey and IA defects. |
| [14-accessibility-and-craft.md](analysis/14-accessibility-and-craft.md) | Scorecard, landmarks and headings, skip link, focus, ARIA, alt text, targets, reduced motion, a contrast matrix, axe-core results, fonts, images, security headers, PWA and page weights. |
| [15-recreating-the-style.md](analysis/15-recreating-the-style.md) | The playbook: building a web page (tokens, fonts, background stack, glass, buttons, a minimal hero starter), making a film or motion piece (motion numbers, type at 1920×1080, colour script, sound, voice-over), generating new illustrations (prompt recipe, character sheets, consistency rules) and a checklist. |

## Where the literal material lives

| Material | Location | Notes |
|---|---|---|
| CSS | [source/css/](source/css/) | Cite the `.pretty.css` files with line numbers: [3q17cp_jgfwol](source/css/3q17cp_jgfwol.pretty.css) (global, every page), [2_gt301v4m-60](source/css/2_gt301v4m-60.pretty.css) (onboarding `/start`), [2h1wwdz1nvxwk](source/css/2h1wwdz1nvxwk.pretty.css) (create sheets and doors), [37m388zf6rymp](source/css/37m388zf6rymp.pretty.css) (glöd hearth, share route). The pricing page's inline `<style>` is extracted to [derived/layout/uppgradera-inline-style.pretty.css](derived/layout/uppgradera-inline-style.pretty.css) |
| HTML and DOM | [source/html/](source/html/), [source/rendered/](source/rendered/) | `<page>.<lang>.html` as served; `dom__<page>__<lang>.html` after hydration; `computed-styles__<page>__<lang>__<theme>__<viewport>.json` |
| JS | [source/js/](source/js/) | One line per chunk; readable excerpts in `derived/*/js-excerpts/` |
| Tokens | [tokens/](tokens/) | Combined: [tokens.css](tokens/tokens.css) (copy-pasteable CSS with `@font-face`, both theme sets and named raw literals, each cited to a CSS line), [tokens.json](tokens/tokens.json) (W3C design-token format with natt/morgon modes), [tokens.ts](tokens/tokens.ts) (for film and Remotion). Per dimension: [color.css](tokens/color.css), [color.json](tokens/color.json), [typography.json](tokens/typography.json), [layout.json](tokens/layout.json) |
| Fonts | [assets/fonts/](assets/fonts/) | 17 WOFF2 files under their served hashed names. Human-named copies in [derived/typography/fonts/](derived/typography/fonts/); the mapping in [derived/typography/font-files.md](derived/typography/font-files.md); licences in [derived/typography/licences/](derived/typography/licences/) |
| Images | [assets/](assets/) | Logo [tf-logo.webp](assets/assets/tf-logo.webp); plates [nebula-hero.webp](assets/assets/nebula-hero.webp), [morgon-aurora-desktop.webp](assets/assets/morgon-aurora-desktop.webp), [morgon-aurora-mobile.webp](assets/assets/morgon-aurora-mobile.webp); sample book [assets/share/iris-sparade-platsen/assets/](assets/share/iris-sparade-platsen/assets/); OG image [assets/brand/opengraph-image.png](assets/brand/opengraph-image.png) |
| Vectors | [assets/svg-inline/](assets/svg-inline/), [derived/icons/svg/](derived/icons/svg/) | Inline SVGs as served; cleaned standalone icons, motifs and endings maps |
| Copy decks | [copy/](copy/) | [copy/pages/](copy/pages/) one deck per page and language; [app-strings.md](copy/app-strings.md) all 75 client dictionaries; [i18n-strings.json](copy/i18n-strings.json); [glossary.md](copy/glossary.md); [sample-book-text.sv.md](copy/sample-book-text.sv.md); [copy/sample-book/](copy/sample-book/README.md) per-path readings |
| Prompts | [prompts/](prompts/README.md) | [style-block.txt](prompts/style-block.txt), [cover-brief.txt](prompts/cover-brief.txt), [beats/](prompts/beats/), [sample-book-image-canon.json](prompts/sample-book-image-canon.json), [app-style-strings.md](prompts/app-style-strings.md) |
| Screenshots | [screenshots/](screenshots/) | Pages, home sections, components, hover states, flows, motion frames |
| Flows | [screenshots/flows/](screenshots/flows/) | `<flow>__<NN-step>__<starting-theme>__<viewport>.png`; step log [derived/ia/flows.csv](derived/ia/flows.csv); contact sheets [derived/ia/flow-sheets/](derived/ia/flow-sheets/); site map [derived/ia/sitemap.svg](derived/ia/sitemap.svg) |
| Motion clips | [screenshots/motion/](screenshots/motion/), [derived/motion/clips/](derived/motion/clips/), [derived/theming/crossfade/](derived/theming/crossfade/) | WebM recordings (hero idle 12 s, scroll, map loop, hover tour, language switch) with `.marks.json` timing marks; 60 fps theme-switch MP4s; [motion-spec.json](derived/motion/motion-spec.json) and [motion-tokens.ts](derived/motion/motion-tokens.ts) |
| Audio | [assets/audio/](assets/audio/), [assets/share/iris-sparade-platsen/assets/](assets/share/iris-sparade-platsen/assets/), [derived/audio/](derived/audio/) | Six beds in `atmosphere/v1/`; Morfar Erik landing samples in `landing-voice/`; 14 narrated pages `S*.mp3`; eight voice-picker samples in [derived/audio/fetched/voices/](derived/audio/fetched/voices/); specs, transcripts, loop-seam auditions |
| Style board | [style-board.html](style-board.html), [derived/style-board/](derived/style-board/) | One-page board drawn with [tokens/tokens.css](tokens/tokens.css) and verbatim site CSS; renders [style-board-natt.webp](derived/style-board/style-board-natt.webp) and [style-board-morgon.webp](derived/style-board/style-board-morgon.webp) |

## File-format notes

- **Full-page screenshots are WebP at quality 92** (`*__full.webp`). Because the backdrop plate is `position: fixed; height: 100lvh`, everything below the first viewport in a full-page capture sits on the flat canvas colour (`#171232` / `#ede9f6`); a scrolling viewer always sees the plate.
- **Folds and component crops are PNG** (`*__fold.png`, `screenshots/components/**`, `screenshots/states/**`). Exceptions, all WebP: full-viewport frames and very large crops in [screenshots/components/app/](screenshots/components/app/) (q92), the `_sheet-*` contact sheets in [screenshots/components/landing/](screenshots/components/landing/), and the extra-viewport set in [screenshots/flows/extra-viewports/](screenshots/flows/extra-viewports/). Measurement data for the landing crops is in [screenshots/components/landing/_data/](screenshots/components/landing/_data/) (JSON).
- File names encode the variant: `<page>__<lang>__<theme>__<viewport>__<fold|full>`; component crops `NN-name__<theme>__<viewport>`; `-en` marks English. Device scale factor (1, 2 or 3) is stated in each analysis file.
- Recordings from Playwright are WebM; the derived theme-switch videos are MP4 at 60 fps.
- Audio is MP3 as served (beds 128 kb/s, 44.1 kHz stereo; narration 48 kHz).
- CSV and JSON files in `derived/` are described in the "Files" section at the end of the analysis file for their area.

## Limits

- **Gated routes were reconstructed from code.** `/konto`, `/create`, `/valkommen` and `/reader/{id}` redirect to `/login`. The reader, the create flow and the logged-in bookshelf are described from shipped CSS, JS and the sample-book JSON, and rendered only as labelled reconstructions (`RECON`, `LIVE·INJECTED`, `FORCED`).
- **The sample-book page `/share/iris-sparade-platsen` returns 404** on the server ([source/html/share_iris-sparade-platsen.404.sv.html](source/html/share_iris-sparade-platsen.404.sv.html)), although four links point to it. The book itself is in the library in full: data in [source/sample-book.iris-och-den-sparade-platsen.json](source/sample-book.iris-och-den-sparade-platsen.json), pictures and narration in [assets/share/iris-sparade-platsen/assets/](assets/share/iris-sparade-platsen/assets/).
- **Nothing was listened to by a human.** All statements about voices, beds and music come from measurements, spectrograms, machine transcripts and the product's own descriptions.
- **Single engine.** All captures are Chromium; Firefox and Safari rendering, iOS volume handling and gapless looping in other browsers were not tested.
- **A moment in time.** Copy, prices and assets change with releases; everything here is the release named above.

## Licensing

- **Fonts:** Cinzel, Lora, Source Serif 4 and Schibsted Grotesk are licensed under the **SIL Open Font License 1.1**. The licence texts are in [derived/typography/licences/](derived/typography/licences/) ([OFL-Cinzel.txt](derived/typography/licences/OFL-Cinzel.txt), [OFL-Lora.txt](derived/typography/licences/OFL-Lora.txt), [OFL-SourceSerif4.txt](derived/typography/licences/OFL-SourceSerif4.txt), [OFL-SchibstedGrotesk.txt](derived/typography/licences/OFL-SchibstedGrotesk.txt)).
- **Everything else** (logo, illustrations, backdrop paintings, narration and audio, copy, prompts, code and screenshots of the site) belongs to **Tale Forge AB** (org.nr 559543-1122, Värnamo). It was collected for reference and analysis only and is not licensed for reuse. Third-party marks that appear in the material (the Google "G" on the sign-in button) belong to their owners.
