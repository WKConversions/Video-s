# Font files: hashed name → human name

The site self-hosts 17 WOFF2 subset files through `next/font/google` (Next.js). Their names are content hashes. This table maps each one to its family, Unicode subset and the `@font-face` rules that point at it, and links the renamed copy in [`fonts/`](fonts/). The copies are byte-identical (verified with `cmp`); only the file name changed.
Facts come from the `@font-face` blocks in [`../../source/css/3q17cp_jgfwol.pretty.css`](../../source/css/3q17cp_jgfwol.pretty.css) (lines 1–459) and from reading each file's `name`, `fvar`, `OS/2` and `cmap` tables with fontTools 4.66.

## Contents

1. [Mapping table](#mapping-table)
2. [What the names mean](#what-the-names-mean)
3. [Fallback faces](#fallback-faces)
4. [Preload and delivery](#preload-and-delivery)
5. [Licence files](#licence-files)

## Mapping table

| Hashed file (assets/fonts/) | Human copy | Family | Subset | Declared weights | Axes in file | Preloaded | Bytes | Glyphs / code points | Version | @font-face lines |
|---|---|---|---|---|---|---|---|---|---|---|
| `fd5073be3e923c20-s.p.0bu2vpnzs5p12.woff2` | [`Cinzel-700-latin.woff2`](fonts/Cinzel-700-latin.woff2) | Cinzel | latin | 700 | static Bold | yes | 15,224 | 228 / 220 | Version 2.000 | 12-21 |
| `93b6da25d7dcc0a6-s.0ds8vreemgw27.woff2` | [`Cinzel-700-latin-ext.woff2`](fonts/Cinzel-700-latin-ext.woff2) | Cinzel | latin-ext | 700 | static Bold | no | 8,320 | 182 / 125 | Version 2.000 | 1-11 |
| `8c2eb9ceedecfc8e-s.p.1c4v1kyduoipm.woff2` | [`Lora-var400-700-latin.woff2`](fonts/Lora-var400-700-latin.woff2) | Lora | latin | 600, 700 | wght 400–700 | yes | 37,792 | 282 / 226 | Version 3.008 | 128-137, 226-235 |
| `507a47c1876d4ec2-s.16qc705tx6j2a.woff2` | [`Lora-var400-700-latin-ext.woff2`](fonts/Lora-var400-700-latin-ext.woff2) | Lora | latin-ext | 600, 700 | wght 400–700 | no | 20,176 | 262 / 192 | Version 3.008 | 117-127, 215-225 |
| `71fbf9c08529c2a5-s.1dgp9w781ejf6.woff2` | [`Lora-var400-700-cyrillic.woff2`](fonts/Lora-var400-700-cyrillic.woff2) | Lora | cyrillic | 600, 700 | wght 400–700 | no | 21,252 | 174 / 108 | Version 3.008 | 49-56, 147-154 |
| `e7150917543fc9da-s.0or-mv9rm3-7p.woff2` | [`Lora-var400-700-cyrillic-ext.woff2`](fonts/Lora-var400-700-cyrillic-ext.woff2) | Lora | cyrillic-ext | 600, 700 | wght 400–700 | no | 23,588 | 202 / 149 | Version 3.008 | 40-48, 138-146 |
| `e1ccd2766b08c828-s.1trkgqz3-pw7b.woff2` | [`Lora-var400-700-vietnamese.woff2`](fonts/Lora-var400-700-vietnamese.woff2) | Lora | vietnamese | 600, 700 | wght 400–700 | no | 8,908 | 154 / 114 | Version 3.008 | 107-116, 205-214 |
| `e9457141811d41ae-s.0ydhovl1n7s8f.woff2` | [`Lora-var400-700-math.woff2`](fonts/Lora-var400-700-math.woff2) | Lora | math | 600, 700 | wght 400–700 | no | 29,236 | 200 / 141 | Version 3.008 | 57-76, 155-174 |
| `ac34884600cd8d5d-s.444o2y6he09-k.woff2` | [`Lora-var400-700-symbols.woff2`](fonts/Lora-var400-700-symbols.woff2) | Lora | symbols | 600, 700 | wght 400–700 | no | 17,280 | 93 / 72 | Version 3.008 | 77-106, 175-204 |
| `68d403cf9f2c68c5-s.p.42000xkkqj0am.woff2` | [`SourceSerif4-var200-900-latin.woff2`](fonts/SourceSerif4-var200-900-latin.woff2) | Source Serif 4 | latin | 400, 600 | wght 200–900 | yes | 50,924 | 331 / 231 | Version 4.004 | 299-308, 355-364 |
| `292081311a6a8abc-s.3irbj1um1c5rd.woff2` | [`SourceSerif4-var200-900-latin-ext.woff2`](fonts/SourceSerif4-var200-900-latin-ext.woff2) | Source Serif 4 | latin-ext | 400, 600 | wght 200–900 | no | 42,056 | 373 / 276 | Version 4.004 | 288-298, 344-354 |
| `256e1f7f180674ba-s.444m1fhac1z6e.woff2` | [`SourceSerif4-var200-900-cyrillic.woff2`](fonts/SourceSerif4-var200-900-cyrillic.woff2) | Source Serif 4 | cyrillic | 400, 600 | wght 200–900 | no | 36,500 | 185 / 106 | Version 4.004 | 262-269, 318-325 |
| `20aee433927f7d4b-s.2u46yrlpkdxrh.woff2` | [`SourceSerif4-var200-900-cyrillic-ext.woff2`](fonts/SourceSerif4-var200-900-cyrillic-ext.woff2) | Source Serif 4 | cyrillic-ext | 400, 600 | wght 200–900 | no | 18,108 | 87 / 55 | Version 4.004 | 253-261, 309-317 |
| `be3bf58b83159894-s.1298pfel08g2l.woff2` | [`SourceSerif4-var200-900-greek.woff2`](fonts/SourceSerif4-var200-900-greek.woff2) | Source Serif 4 | greek | 400, 600 | wght 200–900 | no | 20,084 | 106 / 84 | Version 4.004 | 270-277, 326-333 |
| `753b6407f468151f-s.1wcle8r8k1a_g.woff2` | [`SourceSerif4-var200-900-vietnamese.woff2`](fonts/SourceSerif4-var200-900-vietnamese.woff2) | Source Serif 4 | vietnamese | 400, 600 | wght 200–900 | no | 13,440 | 172 / 115 | Version 4.004 | 278-287, 334-343 |
| `31a9145ccb84606d-s.p.1_j-vbs-91rji.woff2` | [`SchibstedGrotesk-var400-900-latin.woff2`](fonts/SchibstedGrotesk-var400-900-latin.woff2) | Schibsted Grotesk | latin | 400, 700, 800 | wght 400–900 | yes | 46,864 | 287 / 227 | Version 1.100 | 391-400, 412-421, 433-442 |
| `481eac7be1c268b7-s.34f9nwclrjpmo.woff2` | [`SchibstedGrotesk-var400-900-latin-ext.woff2`](fonts/SchibstedGrotesk-var400-900-latin-ext.woff2) | Schibsted Grotesk | latin-ext | 400, 700, 800 | wght 400–900 | no | 20,844 | 249 / 180 | Version 1.100 | 380-390, 401-411, 422-432 |

Totals: 17 files, 430,596 bytes (421 KB). The four preloaded latin files that every page needs total 150,804 bytes.

## What the names mean

- `<Family>-700-<subset>`: Cinzel is served as a static Bold instance (no `fvar` table; name table subfamily "Bold", `usWeightClass` 700).
- `<Family>-varMIN-MAX-<subset>`: Lora, Source Serif 4 and Schibsted Grotesk are variable fonts with a `wght` axis. The same file backs several `@font-face` rules that each declare one weight (Lora 600 and 700; Source Serif 4 400 and 600; Schibsted Grotesk 400, 700 and 800). Because each rule declares a single weight, Chromium draws only those exact instances. See [`weight-resolution.json`](weight-resolution.json).
- Source Serif 4's upstream file also has an optical-size axis (`opsz` 8–60, per [`licences/google-fonts-METADATA-sourceserif4.pb.txt`](licences/google-fonts-METADATA-sourceserif4.pb.txt)). The served subsets have no `opsz` axis; their `STAT` table names the pinned instance "14pt". So `font-optical-sizing: auto` on `.prose` (3q17cp_jgfwol.pretty.css:1827) has nothing to act on.
- Subset names follow Google Fonts' slicing and are identified here by their `unicode-range`: `latin` (U+0000–00FF plus common punctuation, includes å ä ö Å Ä Ö é and ·), `latin-ext`, `cyrillic`, `cyrillic-ext`, `greek`, `vietnamese`, `math`, `symbols`.
- `.p.` in a hashed name marks a file Next.js preloads (see below).

## Fallback faces

`next/font` also emits one metric-matched fallback face per family. It points at a local system font and rescales it so that text laid out before the web font arrives occupies about the same space (the HTML carries `<meta name="next-size-adjust">`).

| Fallback family | src | size-adjust | ascent-override | descent-override | line-gap-override | Lines |
|---|---|---|---|---|---|---|
| Cinzel Fallback | `local(Times New Roman)` | 136.86% | 71.31% | 27.18% | 0% | 22-29 |
| Lora Fallback | `local(Times New Roman)` | 115.2% | 87.33% | 23.78% | 0% | 236-243 |
| Source Serif 4 Fallback | `local(Times New Roman)` | 117.91% | 87.87% | 28.41% | 0% | 365-372 |
| Schibsted Grotesk Fallback | `local(Arial)` | 104.49% | 93.46% | 24.67% | 0% | 443-450 |

The overrides are the web font's own vertical metrics divided by the size adjustment. For example Lora: hhea ascender 1006/1000 ÷ 1.152 = 87.33 %, descender 274/1000 ÷ 1.152 = 23.78 %. Schibsted Grotesk: 2000/2048 ÷ 1.0449 = 93.46 %, 528/2048 ÷ 1.0449 = 24.67 %. All four check out against the files.

Read: `local(Times New Roman)` and `local(Arial)` exist on Windows and macOS; on Linux and Android they usually do not, and the stack falls through to Georgia / "Segoe UI" / system-ui. With `font-display: swap` the visible swap there can shift text.

## Preload and delivery

- The home response sends a `link:` header that preloads exactly the four latin files: `31a9145ccb84606d-s.p.1_j-vbs-91rji.woff2` (Schibsted Grotesk), `68d403cf9f2c68c5-s.p.42000xkkqj0am.woff2` (Source Serif 4), `8c2eb9ceedecfc8e-s.p.1c4v1kyduoipm.woff2` (Lora), `fd5073be3e923c20-s.p.0bu2vpnzs5p12.woff2` (Cinzel), with `crossorigin` and `type="font/woff2"`. Source: [`../../source/meta/home-response-headers.txt`](../../source/meta/home-response-headers.txt).
- CSP `font-src 'self'`: fonts never come from fonts.googleapis.com at runtime. The site path is `/_next/static/immutable/media/<hash>.woff2`.
- Every `@font-face` uses `font-display: swap`.
- The `<html>` element carries the four `…__variable` classes that define `--font-cinzel`, `--font-lora`, `--font-source-serif` and `--font-schibsted` (3q17cp_jgfwol.pretty.css:37-39, 250-252, 377-379, 457-459). The `--display / --ui / --serif / --wordmark` role variables on `:root` (lines 460-472) build on those.

## Licence files

All four families are under the SIL Open Font License 1.1. Evidence, stored in [`licences/`](licences/):

| Family | In-file copyright (name ID 0) | In-file licence URL (name ID 14) | Google Fonts METADATA `license:` | Reserved Font Name | Licence text |
|---|---|---|---|---|---|
| Cinzel | Copyright 2020 The Cinzel Project Authors (https://github.com/NDISCOVER/Cinzel) | https://scripts.sil.org/OFL | OFL ([METADATA](licences/google-fonts-METADATA-cinzel.pb.txt)) | none | [OFL-Cinzel.txt](licences/OFL-Cinzel.txt) |
| Lora | Copyright 2011 The Lora Project Authors (https://github.com/cyrealtype/Lora-Cyrillic), with Reserved Font Name "Lora". | https://scripts.sil.org/OFL | OFL ([METADATA](licences/google-fonts-METADATA-lora.pb.txt)) | "Lora" | [OFL-Lora.txt](licences/OFL-Lora.txt) |
| Source Serif 4 | © 2014 - 2021 Adobe Systems Incorporated (http://www.adobe.com/), with Reserved Font Name ‘Source’. | http://scripts.sil.org/OFL | OFL ([METADATA](licences/google-fonts-METADATA-sourceserif4.pb.txt)) | 'Source' (stated in the font's copyright string; the Google Fonts OFL.txt header omits it) | [OFL-SourceSerif4.txt](licences/OFL-SourceSerif4.txt) |
| Schibsted Grotesk | Copyright 2023 The Schibsted-Grotesk Project Authors (https://github.com/schibsted/schibsted-grotesk) | https://scripts.sil.org/OFL | OFL ([METADATA](licences/google-fonts-METADATA-schibstedgrotesk.pb.txt)) | none | [OFL-SchibstedGrotesk.txt](licences/OFL-SchibstedGrotesk.txt) |

The OFL.txt and METADATA.pb files were fetched on 2026-10-09 from `https://raw.githubusercontent.com/google/fonts/main/ofl/<family>/`. The four OFL bodies are identical (same MD5 after the copyright header). Keep the matching OFL file next to any copy of the fonts you pass on.
