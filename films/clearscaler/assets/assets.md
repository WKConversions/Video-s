# Assets harvested (2026-10-05)

Source site: https://www.clearscaler.com (dark theme, the site default). Screens at 1440×900, deviceScaleFactor 1, headless Chromium (harvest scripts in the session scratchpad: harvest.mjs, mockups.mjs, render_logos.mjs).

## Logo (assets/logo/)
| File | What | Source |
|---|---|---|
| clearscaler-logo.svg | Full lockup, ∞ loop mark + "ClearScaler" wordmark, fill/stroke **currentColor** (set `color` on the parent when inlined; renders black as an `<img>`). viewBox 0 0 2854 372: mark 0 to 817.2 (stroked path, width 97.2, round caps/joins), wordmark 1021 to 2854 (filled outlines). Site renders it 20 px high, 11 px gap | nav markup on every page (two inline SVGs on one 372-unit grid), rebuilt 1:1 |
| clearscaler-logo-white.svg / -ink.svg | Same lockup hard-coded #EDEFF3 (use on night) / #100C08 (light) | same |
| clearscaler-mark.svg, -white.svg, -ink.svg | Loop mark alone, viewBox 0 0 817.2 372 | nav markup |
| clearscaler-wordmark.svg, -white.svg, -ink.svg | Wordmark alone, viewBox 1021 0 1833 372 | nav markup |
| clearscaler-logo-white.png (1427×186, RGBA) | Lockup raster, white on transparent | rendered from the SVG |
| clearscaler-mark-white.png (817×372, RGBA) | Mark raster | rendered |
| clearscaler-logo-on-night.png (1600×400) | Lockup on #07080C (brand measurement input) | rendered |
| favicon.svg | App icon: rounded square (rx 21.3 of 100), #07080C + #EDEFF3 mark; swaps to #ECEAE4 + #100C08 under prefers-color-scheme: light | https://www.clearscaler.com/favicon.svg |
| favicon-512-dark.png / favicon-512-light.png (512×512) | favicon.svg rendered in each scheme | rendered |
| favicon-32.png (32×32), apple-touch-icon.png (180×180) | site icons | /favicon-32.png, /apple-touch-icon.png |
| og-home.png (1200×630) | Share image: logo top-left, hairline loop with orange comet on a faint grid, "We fix distribution for B2B companies." | https://www.clearscaler.com/og/home.png |

## Founders (assets/people/)
| File | What | Source |
|---|---|---|
| magnus-avatar-128.webp / .png (128×128) | Magnus Motzfeldt-Berge: smiling, dark zip-neck sweater, white tee, dark grey studio background. The avatar the site shows everywhere (32 to 64 px circles) | inline data:image/webp on / (the first avatar, followed by the name "Magnus Motzfeldt-Berge"; order "Magnus or Kian") |
| kian-avatar-128.webp / .png (128×128) | Kian Khamoushi: beard, cream/olive striped shirt, dark background | inline data:image/webp on / (second avatar, followed by "Kian Khamoushi") |
| magnus-400.png (400×400, RGBA, opaque grey #AEAEAE background) | Larger photo, same shoot | https://www.clearscaler.com/images/magnus.jpg (a PNG served as .jpg; referenced by the site's founder data, not shown at this size on the pages) |
| kian-400.png (400×400, RGBA, transparent cut-out) | Larger photo, background removed | https://www.clearscaler.com/images/kian.jpg (same note) |

## Client logos (assets/clients/), the logo wall "CLIENTS WHO AGREED TO BE NAMED"
| File | Client | Source |
|---|---|---|
| oftet.svg | Oftet | /clients/opt/oftet.5deef0b8.svg |
| topjobsabroad.webp (188×48) | Top Jobs Abroad (the only client named with figures + quote) | /clients/opt/topjobsabroad.52235e68.webp |
| kbconsultancy.webp (68×68) | KB Consultancy ("K.B" tile; site uses it as a luminance knockout) | /clients/opt/kbconsultancy.0e1a75a9.webp |
| younomad.webp (238×60) | YouNomad | /clients/opt/younomad.8d3cbfc1.webp |
| bfound.webp (210×60) | bFound | /clients/opt/bfound.d92e8d0c.webp |
| talentify.webp (72×72) | Talentify (round badge; knockout + 30% tile) | /clients/opt/talentify.2600ca8b.webp |
| marzelle.webp (176×68) | Marzelle Sweets | /clients/opt/marzelle.4d6deed7.webp |
| wkconversions.svg | WK Conversions | /clients/opt/wkconversions.285d7d0e.svg |
| coastaldesigns.webp (240×60) | Coastal Designs | /clients/opt/coastaldesigns.f3121de4.webp |
| mono/*-white.png (4× the site's display size) | Each logo as the site renders it (CSS mask: alpha, or luminance for KB/Talentify), filled #EDEFF3 on transparent: tint to ink-3 #8E8F91 to match the site | rendered |
| logowall-dark.png (1600×120) | Reference strip: the nine marks in #8E8F91 on night, in site order and display sizes | rendered |

## Site captures (assets/site/)
| File | What | Source |
|---|---|---|
| <page>-dark-hero.png (1440×900) | Viewport at load, dark theme (cookie banner bottom-left) for home, gtm-engine, paid-acquisition, conversion, results, about, for-logistics, gtm-plan; plus home-light-hero.png | the eight pages |
| <page>-dark-full.png (1440 × 1658 to 7548) | Full-page captures. Sticky-scroll sections ("Found. Written. Booked.", "Inside the engine") overlap or look empty in these: use mockups/ for those | same |
| <page>-dark-extract.json | Computed styles (CSS vars, colours, fonts, easings, h1/h2/body/button), logo markup, headings and page text | same, via site_extract.js |
| tiles/<page>-NN.png (61 tiles, 1440×900) | Full-page captures sliced for reading | from *-full.png |
| mockups/home-hero-stage-t*.png (8 frames, 0.3 to 9 s) | The hero product animation (leads table: signal chip, new lead row, score, Marta's reply card, "Meeting booked · Thu 10:00" toast) | / scrolled to the product frame |
| mockups/home-found-, home-written-, home-booked-t*.png | The three home steps; home-written has 9 frames through the draft animation (typing, strike, insert, Approved, Sent) | / sticky section |
| mockups/home-three-channels.png | "Three channels. One loop, run by us." with FIG 0.1/0.2/0.3 cards | / |
| mockups/engine-loop-diagram-{500,3000,6000}.png | The 12-station loop with moving orange packets | /gtm-engine |
| mockups/engine-{find,write,safe,reply,learn,report}.png | Inside the engine, six steps, final states (score breakdown, draft, email health, inbox thread, experiment, weekly summary) | /gtm-engine |
| mockups/logistics-find-reach-book.png | "Find. Reach. Book." three-card version (Tom Keller draft, Omar Rios reply) | /for/logistics |
| demo-workspace.json | The site's demo-workspace data object (Wrenmoor Industrial: leads, buckets, score, draft, inbox, experiment, mailboxes, digest, moments) | /assets/index-fEDpQcFv.js |
| site-copy.json | Company constants, founders (with bios, LinkedIn URLs), the five results with case text, FAQ, timeline and "not for you" copy | same bundle |
| claims.json | The site's claims registry: every figure with measure, window, source, consent tier and status (verified/confirm), plus the client consent list | /assets/claims-Df6JCv7j.js |
| diagrams.md | Loop path data, the engine diagram stations, FIG 0.x / bcover / closer-field / paid-trace markup, and what the site animates with timings | written from the HTML/CSS/JS |
| text/*.txt (14 pages) | Visible page text from the server HTML, including closed accordions (FAQ answers, founder bios, case details) | home, gtm-engine, paid-acquisition, conversion, results, about, for/{logistics,recruitment-agencies,marketing-agencies,b2b-saas,b2b}, gtm-plan, contact, book |
| html/*.html, html/site.css | Raw server HTML of those pages and the inline stylesheet (all tokens, keyframes) | same |
| html/WriteDemo-BMyPmWRC.js, html/Stage-Ce7ZPeTx.js | JS chunks that time the email-draft and hero-stage animations | /assets/ |

## Fonts (film/public/fonts/)
| File | Family / axis | Source |
|---|---|---|
| outfit-var.woff2 | Outfit Variable, wght 500 to 600 only (latin subset) | /assets/outfit-latin-wght-normal-BnmCSwjh.woff2 |
| manrope-var.woff2 | Manrope Variable, wght 200 to 800 (latin) | /assets/manrope-latin-wght-normal-DHIcAJRg.woff2 |
| manrope-latin-ext-var.woff2 | Manrope Variable, latin-ext range (á in Málaga is in the latin file; this covers the rest) | /assets/manrope-latin-ext-wght-normal-Ch3YOpNY.woff2 |
| geist-mono-var.woff2 | Geist Mono Variable, wght 400 to 600 (latin) | /assets/geist-mono-latin-wght-normal-so4CIWYV.woff2 |
None of the subsets contains → (U+2192): draw arrows as SVG.

## Film copies (film/public/img/)
clearscaler-logo.svg, clearscaler-logo-white.svg, clearscaler-mark.svg, clearscaler-mark-white.svg, clearscaler-wordmark-white.svg, favicon.svg, magnus-avatar-128.png, kian-avatar-128.png, magnus-400.png, kian-400.png, clients/<nine>-white.png.

## Not harvested
No video, photography (beyond the two founders), illustrations or downloadable brand kit exist on the site. The blog (25 articles) was not harvested beyond its cover-art system (bcover, in diagrams.md).
