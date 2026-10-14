# Segment 3 — frames 287–386 (assigned 282–384; 9.57–12.87 s) — prompt pill "Prompt your agent into existence" → 3D card "Describe a usecase…"

All coordinates are **1920×1080 film pixels**: the reference was measured at 1280×720 and every value was multiplied by 1.5. Frame n = n/30 s, and reference frame n = film frame n. x grows right, y grows down. Colours are sampled sRGB hex from the reference frames.

Method: thresholded "dip" maps (local median minus pixel) for the thin rim lines, luminance/gradient profiles with sub-pixel peak fitting for edges, colour masks for the buttons, SIFT feature matching plus a least-squares CSS-3D pose fit (rms 0.3–1.2 px) for the 3D card, rectified (flattened) card images for the card layout and typing, and band-energy analysis of `ref/audio.wav` for sound. Values marked "est." are visual estimates (±6 px).

**Recommended `RANGE` for seg3: `[287, 387)`.** Frames 282–286 belong to segment 2, whose glass pill zooms in over "just vibe it" (seg2 §3.6). The shot this segment rebuilds starts with the hard cut at 287 and ends with the hard cut 386 → 387. Seg3 draws nothing in 282–286. Seg4 starts at 387, and the background continues across that cut (§0).

---------------------------------------------------------------------------------------------------

## 0. Context at the edges

* **276–286 (seg2)**: a glass stadium pill flies in from huge scale over "just vibe it" and frames the line. Its height is 660 at 278, 519 at 282, 420 at 284 and 294 at 286. At 286 it spans x 171–1746, y 390–684. Seg2 owns these frames.
* **286 → 287: HARD CUT.** The background jumps from seg2's pink/aqua/lavender mesh to this segment's white-left / cyan-right gradient, and the frame mean jumps by +22 levels. The new pill does not continue the 286 geometry: at 287 it is **1340 × 468, centred (960, 540)**, taller and narrower than seg2's last pill. It stretches to its wide shape within 9 frames (§3.2). The 808 boom at 285 rings across the cut.
* **386 → 387: HARD CUT (foreground only).** The 3D card vanishes. Frame 387 shows the next shot: white node cards with heavily blurred or pixelated content fly in from the top-left (at x 60–210, y 60–110 at 387), and a purple "Send To" card is smeared horizontally at about (520–640, 205–270). **The background gradient is continuous across 386 → 387**: grid samples differ by ≤ 3 levels. Seg4 should keep drawing the same background.
* **Inside the segment there are no cuts.** The pill shot hands over to the card shot through an 8-frame morph of the input field into the card (333–341).

## 1. Shot list

| # | frames | dur | content | in | out |
|---|---|---|---|---|---|
| P | **287–335** | 49 f | Pastel gradient. A glass stadium pill with a violet rim and a white input field inside snaps from a tall to a wide shape (287–296). The arrow button pops in (293–299). "Prompt your agent into existence" types in (291–307). An outer glass ring flies in from huge scale (295–326). Button press at **311**, then a hover pop (312–322). From 328 the rim and the ring zoom past the camera, and the button spins and shrinks away (327–335) | hard cut | morph (field becomes the card) |
| M | **333–341** | 9 f | **Morph.** The text fades out (333–337). The field loses its rings, then grows taller and narrower and turns into a rounded card with a 3D tilt starting (337–341). Card content fades in from 338 | — | continuous |
| C | **342–386** | 45 f | 3D glass card (rotateX ≈ 14–20°, rotateY −5° → −49°, perspective 1200 px). "Describe a usecase to auto-generate a new / agent, or load an existing" types in (341–354). Paperclip icon, two round icon buttons, purple "Generate Agent ✦" pill. Click/press on the pill at **359–361**. The card drifts (349–372), then turns away and shrinks with accelerating speed (373–386) | morph | **hard cut** 386→387 |

Transitions: **287 hard cut**, **333–341 morph** (described in §4), **386→387 hard cut**. Nothing else cuts, crossfades or pushes.

---------------------------------------------------------------------------------------------------

## 2. Background (287–386, one continuous layer)

* **Type**: a soft 4-corner mesh gradient with no hard edges and no vignette. In words:
  * The left third goes from white to pale lavender-white.
  * The top-left corner turns progressively **pink-magenta**: `#F9E9F4` at 287, `#F3D1F1` at 324 and `#F3ABF4` at 360–386.
  * The top-right is **aqua/cyan**: `#8ECFF1` at 287, then `#5FD3F2` and `#6AE2F2`.
  * The bottom-left becomes **violet/periwinkle** from about 312: `#D3C8F1` at 312, `#AB9CED` at 336, `#917DEF` at 348–372.
  * The bottom-right is cornflower blue: `#97B4EE` at 287, `#779EEF` at 324, and it lightens to `#D7E7F7` by 386.
  * A near-white diagonal "valley" runs from the top centre to the bottom right in 360–386.
* **Motion**: the colours morph slowly and continuously, with no pan or zoom of the gradient. The frame-mean R channel goes 203 (287) → 162 (331) → 193 (384), so the pink/violet build-up peaks around 331. Interpolate linearly between the key grids below; between 372 and 386 the change is small.
* **Grain**: static monochrome film grain, clearly visible. High-pass σ ≈ 1.3–2.5 levels at 720p, about 1.5× the grain of seg2 Shot B. Consecutive frames correlate 0.6–1.0, so the texture holds for several frames and occasionally refreshes. Use `/img/grain.png` at about 8 % (overlay), static.
* **No vignette, no light streaks** apart from the ring (§3.6).
* **Reference grid** (sampled with a 17-px median; the element cells are interpolated):

| f | top-left | top-centre | top-right | mid-left | mid-right | bottom-left | bottom-centre | bottom-right |
|---|---|---|---|---|---|---|---|---|
| 287 | `#F9E9F4` | `#C1EDF2` | `#8ECFF1` | `#FBF7F6` | `#96C2F1` | `#FCF8F7` | `#D3DFF1` | `#97B4EE` |
| 324 | `#F4D1F1` | `#A7DFEE` | `#5FD3F2` | `#EEE7F5` | `#72B9EF` | `#C0B5F0` | `#A3BEF2` | `#779EEF` |
| 360 | `#F1ADF2` | `#C6EDF6` | `#88E8F4` | `#E6CAF3` | `#98EAF5` | `#A494ED` | `#8295ED` | `#C6DCF3` |
| 386 | `#F3ABF4` | `#E0F5F8` | `#71E5F4` | `#EECAF5` | `#ABEEF6` | `#AD9EF1` | `#93A5F0` | `#D7E7F7` |

(top = y 15, mid = y 540, bottom = y 1065; left x 15, centre x 960, right x 1905.) The full 9 × 7 WKC grids are in §10.1.

---------------------------------------------------------------------------------------------------

## 3. SHOT P (287–335): the prompt pill

### 3.1 Layer stack (back → front) and look
1. Background (§2) and grain.
2. **Outer ring** (295–333): a large thin glass stadium with a violet stroke that has gaps, and white specular streaks (§3.6).
3. **Main glass pill**: a stadium with a 4–5 px violet-blue gradient rim and a soft 6 px outer glow. Its interior is transparent: the gap between the rim and the field measures within ±5 levels of the outside.
4. **Input field**: a stadium (radius H/2) filled with white-lavender at about 30–50 % opacity. It is whiter on the left (α ≈ 0.5 at x 300) and more transparent on the right (α ≈ 0.25–0.3 at x 1100–1450). It has a 1.5 px light-grey hairline border (`#E1DDDE` on white, about rgba(120,110,140,.18)).
5. **Text**, left-aligned, ink `#0A0A14` (core pixels measure `#00070A`).
6. **Arrow button** (circle) with a white ↗ arrow.

* **Rim colour and intensity** (main pill): the stroke is a gradient that is not uniform around the perimeter.
  * At 287 the right end is strongest (`#8387F4`) and the left end lighter (`#B7A0F4`).
  * From 296 the bottom edge is strongest (`#5975D9`, dip 95–120). The top edge is weak at 296 (dip 10–26), then strong from 304 on (`#618CCF`, dip 67–97).
  * The left end is medium (dip 33–69, `#D3CEE4` at 312, `#B7A0F4` at 287). From 300 on, the right end is only about 15 % visible.
  * Build it as a conic-gradient stroke: violet-blue at full strength fading to about 15 %. The strong sector moves clockwise from the right end (287) through the bottom (290–300) to the top/left (304+), then holds.
* **Rim profile**: 4–5 px core with a ±6 px soft falloff. No inner bevel.

### 3.2 Main glass pill — per-frame size (stadium, radius = H/2, centre (960, 539.5))
W is measured at row 540 as 2·(960 − left end). The centre x is 960 ± 1 (verified on both ends at 287–302). H is measured at x = 1250 between the rim centres.

| f | W | H | f | W | H | f | W | H |
|---|---|---|---|---|---|---|---|---|
| 287 | 1340 | 468 | 303 | 1596 | 239 | 319 | 1494 | 222 |
| 288 | 1332 | 361 (motion-blurred) | 304 | 1582 | 235 | 320 | 1488 | 221 |
| 289 | 1434 | 335 | 305 | 1566 | 233 | 321 | 1488 | 221 |
| 290 | 1508 | 322 | 306 | 1554 | 231 | 322 | 1484 | 220 |
| 291 | 1560 | 302 | 307 | 1544 | 230 | 323 | 1480 | 220 |
| 292 | 1598 | 295 | 308 | 1534 | 228 | 324 | 1476 | 220 |
| 293 | 1624 | 285 | 309 | 1524 | 227 | 325 | 1474 | 219 |
| 294 | 1642 | 280 | 310 | 1520 | 226 | 326 | 1468 | 219 |
| 295 | 1654 | 274 | 311 | 1512 | 226 | 327 | 1464 | 218 |
| 296 | 1660 | 270 | 312 | 1508 | 225 | 328 | 1478 | 219 |
| 297 | 1660 | 262 | 313 | 1506 | 224 | 329 | 1510 | 224 |
| 298 | 1658 | 255 | 314 | 1504 | 223 | 330 | 1564 | 232 |
| 299 | 1650 | 251 | 315 | 1502 | 223 | 331 | 1638 | 243 |
| 300 | 1638 | 248 | 316 | 1498 | 223 | 332 | 1740 | 257 (opacity .7) |
| 301 | 1626 | 244 | 317 | 1496 | 222 | 333 | 1868 | 275 (opacity .3) |
| 302 | 1612 | 240 | 318 | 1494 | 222 | 334 | ≈2010 | ≈296 (opacity .08, only a streak at y≈679) |

* **287–296 "snap-stretch" entrance**: the width overshoots to 1660 while the height collapses.
  * The width is an **expo-out**: the remaining distance to 1662 shrinks ×0.67 per frame (half-life ≈ 1.7 f).
  * W:H goes 2.86, 3.7, 4.3, 4.7, 5.2, 5.4, 5.7, 5.9, 6.0 and 6.15 (296).
  * **288 is visibly motion-blurred**: the rim spreads to about 10 px and its peaks are halved.
* **297–327 slow zoom-out**: uniform scale with **W = 6.72 H** from 303 on. H decays toward about 216 with ×0.92 per frame (an ease-out with half-life ≈ 8 f).
* **328–334 zoom-past**: an **ease-in** uniform scale-up about (960, 540) of ×1.00, 1.02, 1.06, 1.11, 1.18, 1.26 and ≈1.36 (328→334), fading out over 332–334. The ring does the same (§3.6).

### 3.3 Input field — per-frame size (stadium, radius H/2, centre (960, 540) until 334)

| f | W | H | f | W | H | f | W | H |
|---|---|---|---|---|---|---|---|---|
| 287 | 542 | 237 | 302 | 1470 | 145 | 317 | 1392 | 138 |
| 288 | 992 | 189 (blurred) | 303 | 1464 | 145 | 318 | 1390 | 138 |
| 289 | 1156 | 176 | 304 | 1456 | 145 | 319–320 | 1388 | 138 |
| 290 | 1258 | 170 | 305 | 1448 | 145 | 321 | 1384 | 138 |
| 291 | 1334 | 168 | 306 | 1440 | 144 | 322–323 | 1380 | 138 |
| 292 | 1384 | 159 | 307 | 1432 | 142 | 324 | 1376 | 138 |
| 293 | 1424 | 157 | 308 | 1426 | 142 | 325 | 1372 | 138 |
| 294 | 1452 | 157 | 309 | 1418 | 142 | 326 | 1368 | 138 |
| 295 | 1472 | 153 | 310 | 1414 | 142 | 327 | 1366 | 137 |
| 296 | 1484 | 152 | 311 | 1410 | 141 | 328 | 1360 | 137 |
| 297 | 1492 | 152 | 312 | 1404 | 140 | 329 | 1352 | 136 |
| 298 | 1496 | 150 | 313 | 1402 | 140 | 330 | 1344 | 136 |
| 299 | 1492 | 150 | 314 | 1400 | 140 | 331 | ≈1334 | 133 |
| 300 | 1488 | 148 | 315 | 1398 | 140 | 332 | ≈1322 | 132 |
| 301 | 1480 | 145 | 316 | 1392 | 139 | 333 | ≈1308 | 132 |

* Field top/bottom (rim-centre y): 458/626 at 291, 464/616 at 296, 468/613 at 302, 469/611 at 307, 470/610 at 312, 471/609 at 317–326, 473/609 at 330 and 475/607 at 333.
* Entrance (287–298): W is an expo-out toward 1500 (the remaining distance shrinks ×0.69 per frame, half-life ≈ 1.9 f), with H 237 → 150. From 307 on, the field, text and button group shrinks almost uniformly about (960, 540): field W ×0.915 and text W ×0.918 from 307 to 333.
* The morph continues in §4.

### 3.4 Typed text "Prompt your agent into existence"
* **Font look**: geometric grotesk (DM Sans–like), weight about 500–600, sentence case, normal tracking. **Cap height 33.8 px at 298, 32.5 at 307, 31.6 at 318, 30.7 at 330 and 29.7 at 333**, so the font-size is ≈ 46.4 px at 307 for a cap ratio of 0.70. Full-line ink width is **730.5 px** at 307 (x 325.5–1056) and 670.5 at 333 (375–1045.5). Baseline y ≈ 553 (298–324) → 552 (333); cap top ≈ 520.
* **Characters visible per frame** (letter-by-letter, decelerating):

| f | 290 | 291 | 292 | 293 | 294 | 295 | 296 | 297 | 298 | 299 | 300 | 301 | 302 | 303 | 304 | 305 | 306 | 307 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| chars | 0 | 2 "Pr" | 4 | 6 "Prompt" | 9 | 11 "…your" | 14 | 16 | 17 "…agent" | 20 | 22 "…into" | 24 | 26 | 28 | 29 | 30 | 31 | **32 (done)** |

  That is about 2–3 chars per frame through 302, then 1 char per frame (303–307).
* **Opacity**:
  * The whole text layer fades in as it starts. The first glyph's darkness is 0.48 (291), 0.51, 0.59, 0.69, 0.82, 0.90, 0.97 and 1.0 (298).
  * After that, each new glyph appears at about **0.75 → 0.90 → 0.97 → 1.0** over its first 4 frames, for example the "into existence" bins at 299–306. So the 3–5 newest characters always read lighter grey.
* **Left ink edge x (the "P" stem) per frame**: 381.0 (291), 361.5, 349.5, 342.0, 336.0, 331.5, 327.0, 325.5, 324.0, 322.5 (300), 321.0 (301–304), 322.5, 324.0, 325.5 (307), 327.0, 328.5, 330.0 (310), 331.5, 333.0 (312–313), 334.5, 336.0 (315–316), 337.5 (317–318), 339.0, 340.5 (320–321), 342.0, 343.5, 345.0 (324), 346.5, 348.0, 351.0, 354.0, 357.0, 360.0 (330), 364.5, 369.0, 375.0 (333), 384.0, 397.5 (335). Values are quantised to 1.5 px.
* **Exit**: the text fades **333 (0.95) → 334 (0.80) → 335 (0.45) → 336 (0.20) → 337 (0.08) → 338 (0)** and goes slightly soft (≈ 2 px blur) at 335–337.

### 3.5 Arrow button (circle, white ↗ arrow)
* **Colour**:
  * Rest: **`#5442DF`** (295–311).
  * Hover state after the press, with white lightening: `#5D4CE1` (312), `#6150E4`, `#6755E5`, `#6D5BE5`, `#6F5DE7`, `#7463E7` (317), `#7664E8`, then **`#7B6AE9`** (321–334).
  * From 313, a soft glow halo surrounds the big button: rgba(123,106,233,.35), blur ≈ 14 px.
* **Arrow**: white `#FEFDFF`, stroke ≈ 0.06·D, overall length ≈ 0.45·D. The ↗ glyph points 45° up-right.
* **Per frame** (D = diameter, centre (x, y); angle = arrow direction, counter-clockwise from →):

| f | D | x | y | angle | f | D | x | y | angle |
|---|---|---|---|---|---|---|---|---|---|
| 293 | ≈10 (dot) | 1660 | 541 | — | 314 | 104 | 1589 | 539 | 29° |
| 294 | 36 | 1651 | 542 | 45° | 315 | 112.5 | 1591 | 538.5 | 34° |
| 295 | 53 | 1641.5 | 542 | 45° | 316 | 117.5 | 1591 | 538.5 | 36° |
| 296 | 65 | 1635 | 542 | 45° | 317 | 123.5 | 1591.5 | 539 | 40° |
| 297 | 74 | 1628 | 542 | 45° | 318 | 127 | 1591.5 | 537.5 | 41° |
| 298 | 78 | 1623 | 541.5 | 45° | 320 | 132.5 | 1590 | 537.5 | 44° |
| 299–301 | 79 | 1617.5 → 1609.5 | 541.5 | 45° | 322–326 | 135.5 | 1588 → 1579.5 | 537.5 | 45° |
| 302–305 | 78 → 74.5 | 1606.5 → 1598 | 541.5 | 45° | 327 | 133.5 | 1574 | 537.5 | 44° |
| 306–308 | 74 | 1595 → 1591 | 541 | 45° | 328 | 131 | 1568.5 | 537.5 | 41° |
| 309 | 72 | 1589 | 541 | 45° | 329 | 127.5 | 1562.5 | 539 | 36° |
| 310 | 69.5 | 1587.5 | 541 | 35° | 330 | 121.5 | 1555.5 | 541 | 28° |
| **311** | **59.5** (press) | 1586.5 | 541 | **0° (→)** | 331 | 116 | 1549 | 543 | 17° |
| 312 | 71 | 1585.5 | 540.5 | 16° | 332 | 108 | 1540 | 545 | 1° |
| 313 | 91 | 1586.5 | 540.5 | 23° | 333 | 97 | 1531.5 | 547.5 | −17° |
| | | | | | 334 | 81.5 | 1519.5 | 550 | −42° (↘) |
| | | | | | 335 | ≈45, opacity .4 | 1502 | 552 | −90° (↓) |
| | | | | | 336 | gone | | | |

* **Pop-in (293–299)**: expo-out with no overshoot. The remaining distance to 79 shrinks ×0.6 per frame (half-life ≈ 1.4 f).
* **Press (310–311)**: squash to 0.80 and the arrow snaps to →.
* **Release and hover-grow (312–322)**: expo-out to D 135.5 (×0.72 per frame, half-life ≈ 2.1 f). The arrow springs back to ↗ by 320. The button grows beyond the field's height (138), so it overlaps the field's top and bottom edges.
* **Exit (327–335)**: an ease-in shrink with a clockwise arrow spin of 3, 5, 8, 11, 16, 18, 25 and 48°/frame. The button follows the field leftwards and drops 15 px.

### 3.6 Outer ring (295–333)
* **Geometry**: a stadium with **W = 5.12·H**, centred (960, 540).

| f | H | W | | f | H | W |
|---|---|---|---|---|---|---|
| 295 | 912 | (≈4670, only the top/bottom streaks show) | | 313 | 336 | 1718 |
| 296 | 740 | ≈3790 | | 314 | 332 | 1698 |
| 297 | 637 | ≈3260 | | 315 | 328 | 1682 |
| 298 | 574 | ≈2940 | | 316 | 325 | 1666 |
| 299 | 528 | ≈2700 | | 317 | 323 | 1652 |
| 300 | 492 | ≈2520 | | 318 | 321 | 1642 |
| 301 | 464 | ≈2375 | | 319 | 319 | 1632 |
| 302 | 440 | ≈2250 | | 320 | 317 | 1622 |
| 303 | 422 | ≈2160 | | 321 | 315 | 1614 |
| 304 | 404 | ≈2070 | | 322 | 314 | 1606 |
| 305 | 392 | ≈2005 | | 323 | 312 | 1600 |
| 306 | 382 | ≈1955 | | 324 | 311 | 1592 |
| 307 | 372 | 1904 | | 325 | 310 | 1588 |
| 308 | 364 | 1862 | | 326 | 309 | 1580 (smallest) |
| 309 | 357 | 1826 | | 327 | 311 | 1590 |
| 310 | 350 | 1794 | | 328 | 318 | 1630 |
| 311 | 345 | 1764 | | 329 | 333 | 1706 |
| 312 | 340 | 1740 | | 330 | 356 | 1822 |
| | | | | 331 | ≈389 | ≈1990 (fading) |
| | | | | 332–333 | — | only faint streaks; gone by 334 |

  * **Fly-in (295–326)**: the size decays fast at first (×0.72–0.83 per frame) and then settles at about ×0.86 per frame (half-life ≈ 4.6 f). It reads as a perspective fly-in from the camera: an expo-out on scale.
  * Until about 306 the ring is wider than the frame, so only its top and bottom straight edges show, as **horizontal light streaks**.
  * The left round end enters the frame at 307 (left end x 6).
* **Stroke pattern** (it has gaps; violet plus white):
  * The stroke is 4–5 px, violet-grey (`#A296C4` on the near-white bg, about rgba(110,90,200,.45)), with a 2–4 px glow.
  * **White specular streaks**, about 3 px, white at about 80 % with a soft 4 px glow: on the **top edge from 0.47·W to 0.78·W** measured from the left end, and on the **bottom edge from 0.42·W to 0.73·W**. Examples: top x 906–1410 and bottom x 832–1330 at 324. During the fly-in: top x 1044–1918 and bottom x 976–1630 at 296; top x 990–1507 at 306.
  * **Violet segments**: top-left (from the left arc to about 0.28·W, e.g. x 265–600) and top-right (0.82–0.94·W, e.g. x 1519–1657 at 327), with the bottom similar.
  * The right round end shows at about 45 %.
  * The **left round end shows at 307–313 and again at 321–330, but is hidden at 314–320**: a gap in the dashed/gradient stroke rotates past it. Animate a conic alpha mask rotating slowly, about −12°/frame, over the left half.
* **Blur**: the streaks at 295–300 are soft (about 6 px across the line). The ring is sharp (2 px) after 306.

### 3.7 Zoom-past exit (327–336)
The main pill (§3.2) and the ring both scale up about (960, 540) with an **ease-in**, which reads as the camera pushing through them. The rings fade 331 → 334 and leave faint horizontal streak remnants at about y 679–683 until 336. The field, text and button do not follow: they shrink (§3.3–3.5) while the rings fly outward, so the two read as separate depth layers.

---------------------------------------------------------------------------------------------------

## 4. MORPH M (333–341): input field → card
The field (pill) becomes the card. Every size is a screen-space box (L, R, T, B); est. ±6 px.

| f | field/card box L–R × T–B | corner radius | contents |
|---|---|---|---|
| 333 | ≈ 303–1617 × 475–607 | H/2 | text .95, button 97 px |
| 334 | ≈ 312–1608 × 475–605 | H/2 | text .80, button 81.5 (↘), rings almost gone |
| 335 | 330–1575 × 478–603 | H/2 | text .45, button 45 (↓) at 40 % |
| 336 | 360–1551 × 478–608 | H/2 | text .20 (soft), button gone |
| 337 | 435–1524 × 478–623 | ≈ 50 | text ghost .08 |
| 338 | 477–1507 × 449–649 | ≈ 35 | card content ghost at ≈10 % (button outline visible at ≈(1360–1450, 625)) |
| 339 | 487–1505 × 435–657 | ≈ 30 | content ≈ 20 %, blurred ≈ 3 px |
| 340 | 510–1502 × 424–668 | 28 | **3D tilt starts**: the left edge leans, top-left to the right. Paperclip and button ≈ 35 % |
| 341 | 522–1500 × 415–673 | 28 | "Describ" types in, button ≈ 50 %, violet rim visible on the left and bottom |

* The field shrinks horizontally (mostly from the left) while it grows downwards (337) and then both ways (338–341). Its centre moves from (952, 540) at 335 to (1011, 544) at 341.
* The fill keeps the field's white glass.
* A soft defocus of about 3 px covers 336–339 and is gone by 342.
* From 342 the card's content follows the 3D pose in §5.2, while its outline keeps growing until about 352 (§5.3).

---------------------------------------------------------------------------------------------------

## 5. SHOT C (342–386): the 3D brief card

### 5.1 Card design in flat coordinates (873 × 315 px, origin at the top-left; this is the on-screen size at pose scale s = 1)
* **Card**: a rounded rectangle, **873 × 315**, corner radius **28**.
  * **Glass fill**: white-lavender, translucent. It reads `#DCD4F9` on the left, `#CDDBF6` in the middle and `#A4E3F5` on the right at 360, because the background shows through. Use rgba(245,245,255,.45) with a backdrop blur of about 20 px.
  * **Rim**:
    * Left edge: 2.5 px violet-grey (`#A69BCD` on the fill).
    * Bottom edge: 2.5 px blue-violet (`#92A1E1`), the strongest, giving a slight thickness at the bottom-left corner.
    * Top edge: 1.5 px light line (`#A4C7DC`) with a white inner highlight just below it.
    * Right edge: faint and blurred.
  * **Shadow**: soft, to the right and below: rgba(70,60,160,.12), blur ≈ 30, offset ≈ (12, 18). It shows as a darker band just outside the right edge.
* **Paperclip icon**: bbox x 38–77, y 73–121. It is diagonal (about 45°), with a stroke of about 5 px in ink `#0A0F1E`.
* **Text**: ink **`#020C1D`**; a DM Sans–like grotesk at weight 500–600; **cap height 23 px** (font-size ≈ 33 px); line pitch 45 px.
  * Line 1 "Describe a usecase to auto-generate a new": ink x 112–783, cap top 64, baseline ≈ 86.5.
  * Line 2 "agent, or load an existing": x 112–492, baseline ≈ 131.
* **Two round icon buttons**: centres (467, 231) and (517, 231), Ø 38. Fill white at about 60 % with a 1.5 px white ring and dark glyphs: "⇄" (swap arrows) and a "bot/incognito" glyph.
* **"Generate Agent ✦" pill**: **215 × 58**, centre (664, 230), radius 29, fill **`#5745DE`**. The label is white, about 19 px font (cap ≈ 13.5), weight 600, followed by a small white sparkle icon.
* **Blurred blob** (top-right inside the card, fixed to the card): about x 540–810, y 0–62, a soft rounded bar about 22 levels darker than the fill (`#A2D6F6` against `#CEEBFB`), Gaussian blur ≈ 14 px. It reads as an out-of-focus chip.
* **Depth of field**: the right third of the card (from x ≈ 600) is slightly softer (σ ≈ 1.5–2 px) than the left, and the card's right edge is blurred by about 6 px.

### 5.2 Pose per frame (CSS 3D)
Model:
* Parent: full frame with `perspective: 1200px` and `perspective-origin: 960px 540px`.
* Card: a 873×315 div whose **centre** sits at (cx, cy), i.e. `left = cx − 436.5`, `top = cy − 157.5`.
* `transform-origin: 50% 50%`.
* **`transform: rotateX(rx) rotateY(ry) rotateZ(rz) scale(s)`**. This is the standard CSS convention: positive rx tips the top edge away; negative ry brings the right side closer.

The corners are the projected flat-rect corners after smoothing (Savitzky–Golay, 7 frames), and the CSS parameters are refitted to them (corner rms < 1 px for 342–384). **To match exactly, map the div onto the four corners with a `matrix3d` homography; the CSS parameters reproduce them within 1 px.**

* 342–348: the corners describe the **content frame**. The visible outline is inset at the top and bottom (§5.3).
* 373–384: the corners are corrected for a measured 2 % right-edge drift.
* 385–386: the corners are hand-measured on motion-blurred frames (est. ±8 px); the CSS fit there is rms 5–7 px, so use the corners.

| f | TL x, y | TR x, y | BR x, y | BL x, y | cx | cy | rx° | ry° | rz° | s |
|---|---|---|---|---|---|---|---|---|---|---|
| 342 | 540, 379 | 1467, 363 | 1484, 714 | 523, 705 | 986.5 | 537.3 | 7.50 | -5.33 | 0.46 | 1.082 |
| 343 | 555, 385 | 1474, 367 | 1502, 718 | 514, 700 | 985.2 | 536.5 | 15.29 | -7.59 | 2.02 | 1.094 |
| 344 | 565, 390 | 1479, 369 | 1512, 721 | 510, 697 | 984.3 | 536.5 | 19.59 | -9.16 | 3.26 | 1.102 |
| 345 | 571, 392 | 1484, 368 | 1516, 723 | 512, 696 | 984.2 | 536.8 | 20.43 | -10.40 | 3.83 | 1.105 |
| 346 | 574, 394 | 1481, 370 | 1513, 723 | 516, 696 | 984.8 | 537.4 | 20.42 | -10.47 | 3.83 | 1.098 |
| 347 | 577, 395 | 1474, 372 | 1503, 721 | 522, 695 | 984.0 | 538.2 | 19.40 | -10.43 | 3.65 | 1.083 |
| 348 | 579, 395 | 1465, 373 | 1489, 720 | 533, 694 | 983.0 | 538.9 | 16.83 | -10.45 | 3.16 | 1.064 |
| 349 | 579, 395 | 1459, 373 | 1479, 719 | 541, 694 | 982.4 | 539.7 | 14.24 | -10.47 | 2.61 | 1.050 |
| 350 | 582, 396 | 1457, 373 | 1475, 719 | 544, 693 | 980.7 | 540.0 | 14.16 | -11.06 | 2.77 | 1.045 |
| 351 | 584, 397 | 1454, 374 | 1471, 719 | 546, 692 | 979.0 | 540.3 | 14.09 | -11.62 | 2.91 | 1.040 |
| 352 | 587, 398 | 1452, 374 | 1467, 720 | 548, 691 | 977.2 | 540.6 | 14.02 | -12.15 | 3.05 | 1.036 |
| 353 | 588, 399 | 1449, 374 | 1463, 720 | 551, 690 | 975.5 | 540.8 | 13.65 | -12.63 | 3.09 | 1.031 |
| 354 | 591, 400 | 1446, 375 | 1459, 720 | 552, 689 | 973.4 | 541.0 | 14.02 | -13.22 | 3.35 | 1.027 |
| 355 | 593, 401 | 1443, 376 | 1455, 720 | 553, 688 | 971.5 | 541.2 | 14.09 | -13.69 | 3.51 | 1.023 |
| 356 | 595, 402 | 1440, 376 | 1451, 720 | 555, 687 | 969.8 | 541.4 | 14.09 | -14.10 | 3.63 | 1.018 |
| 357 | 596, 403 | 1437, 377 | 1447, 720 | 557, 686 | 968.2 | 541.5 | 14.04 | -14.44 | 3.70 | 1.014 |
| 358 | 597, 403 | 1433, 377 | 1442, 720 | 558, 686 | 966.7 | 541.7 | 13.97 | -14.70 | 3.75 | 1.009 |
| 359 | 598, 404 | 1430, 378 | 1438, 719 | 560, 685 | 965.3 | 541.8 | 13.83 | -14.95 | 3.76 | 1.005 |
| 360 | 600, 405 | 1426, 379 | 1434, 719 | 560, 684 | 963.5 | 541.9 | 14.27 | -15.30 | 3.97 | 1.001 |
| 361 | 602, 406 | 1423, 379 | 1430, 718 | 561, 683 | 961.9 | 541.9 | 14.53 | -15.53 | 4.10 | 0.996 |
| 362 | 604, 407 | 1419, 381 | 1426, 717 | 561, 682 | 960.1 | 541.7 | 15.39 | -15.72 | 4.39 | 0.991 |
| 363 | 605, 408 | 1415, 381 | 1422, 716 | 562, 681 | 958.5 | 541.6 | 15.81 | -15.96 | 4.57 | 0.987 |
| 364 | 607, 409 | 1412, 382 | 1418, 716 | 563, 680 | 957.1 | 541.8 | 15.75 | -16.23 | 4.65 | 0.983 |
| 365 | 607, 409 | 1410, 382 | 1414, 717 | 565, 680 | 955.9 | 542.2 | 15.00 | -16.63 | 4.56 | 0.979 |
| 366 | 608, 410 | 1407, 383 | 1410, 717 | 567, 679 | 954.6 | 542.3 | 15.09 | -16.85 | 4.65 | 0.975 |
| 367 | 610, 411 | 1403, 384 | 1407, 715 | 567, 678 | 953.4 | 542.2 | 15.30 | -16.95 | 4.73 | 0.971 |
| 368 | 612, 413 | 1399, 385 | 1403, 713 | 565, 677 | 951.7 | 541.7 | 17.13 | -16.86 | 5.23 | 0.967 |
| 369 | 613, 414 | 1396, 386 | 1399, 712 | 565, 676 | 950.5 | 541.5 | 17.71 | -16.93 | 5.42 | 0.963 |
| 370 | 614, 414 | 1394, 386 | 1396, 712 | 568, 676 | 950.1 | 541.8 | 16.94 | -17.24 | 5.30 | 0.959 |
| 371 | 616, 414 | 1392, 387 | 1393, 712 | 571, 675 | 949.8 | 542.0 | 16.59 | -17.54 | 5.29 | 0.955 |
| 372 | 618, 415 | 1389, 387 | 1390, 712 | 574, 674 | 949.2 | 542.0 | 16.33 | -17.96 | 5.32 | 0.950 |
| 373 | 621, 415 | 1386, 387 | 1385, 712 | 579, 674 | 948.3 | 542.4 | 15.32 | -18.69 | 5.20 | 0.944 |
| 374 | 626, 417 | 1379, 388 | 1377, 710 | 581, 672 | 946.2 | 541.8 | 16.47 | -19.14 | 5.70 | 0.935 |
| 375 | 630, 418 | 1373, 388 | 1369, 709 | 586, 670 | 943.9 | 542.0 | 16.01 | -20.11 | 5.80 | 0.926 |
| 376 | 635, 419 | 1365, 389 | 1359, 709 | 592, 669 | 941.3 | 541.9 | 15.68 | -21.16 | 5.98 | 0.916 |
| 377 | 641, 421 | 1355, 391 | 1347, 706 | 596, 666 | 938.1 | 541.3 | 16.84 | -22.03 | 6.65 | 0.903 |
| 378 | 648, 423 | 1344, 392 | 1333, 703 | 602, 663 | 934.7 | 540.9 | 17.32 | -23.27 | 7.19 | 0.889 |
| 379 | 656, 425 | 1331, 393 | 1317, 701 | 611, 660 | 931.4 | 540.7 | 16.99 | -24.75 | 7.46 | 0.872 |
| 380 | 666, 428 | 1315, 396 | 1297, 696 | 619, 656 | 927.4 | 540.1 | 17.90 | -26.27 | 8.27 | 0.851 |
| 381 | 676, 431 | 1297, 397 | 1276, 694 | 632, 652 | 923.7 | 540.0 | 17.32 | -28.50 | 8.62 | 0.829 |
| 382 | 691, 433 | 1276, 399 | 1251, 693 | 649, 649 | 919.2 | 540.4 | 16.98 | -31.99 | 9.43 | 0.810 |
| 383 | 709, 436 | 1254, 400 | 1222, 694 | 668, 645 | 915.0 | 540.9 | 16.85 | -36.29 | 10.53 | 0.793 |
| 384 | 729, 439 | 1228, 401 | 1191, 697 | 690, 642 | 911.7 | 541.7 | 17.16 | -41.27 | 12.05 | 0.780 |
| 385 | 758, 436 | 1192, 406 | 1159, 684 | 705, 649 | 909.8 | 541.8 | 19.66 | -44.78 | 14.08 | 0.746 |
| 386 | 769, 442 | 1151, 416 | 1118, 679 | 735, 641 | 905.9 | 542.8 | 16.12 | -49.06 | 12.67 | 0.699 |

**Motion in words**:
* **Tilt-in (342–349)**: rx overshoots 7.5 → 20.4 (345) → 14.2 (349); ry goes −5.3 → −10.5; s goes 1.08 → 1.105 (345) → 1.05. Effectively a 3-frame swing-in and a 4-frame settle.
* **Slow drift (349–372)**: close to linear. ry ≈ −0.33°/frame (−10.5 → −18.0), s ≈ −0.0043/frame (1.05 → 0.95), cx ≈ −1.45 px/frame (982 → 949). rx stays 14–17° and rz drifts 2.6 → 5.3°.
* **Exit (373–386)**: an **ease-in turn-away and shrink**.
  * ry velocity: −0.5, −1.0, −1.1, −0.8, −1.3, −1.5, −1.5, −2.2, −3.5, −4.3, −5.0, −3.5 and −4.3°/frame (ry −49° at 386).
  * s: 0.944 → 0.780 (384) → 0.70 (386).
  * cx: 948 → 906. rz: 5 → 12–14°.
  * The card never leaves the frame. The 387 cut removes it.

### 5.3 Outline settle (342–352)
The card outline is still growing while the content is already placed. The visible top and bottom edges, in flat coordinates, are:

| f | 342 | 343 | 344 | 345 | 346 | 347 | 348 | 349 | 350 | 351 | 352+ |
|---|---|---|---|---|---|---|---|---|---|---|---|
| top edge y | 38 | 28 | 24 | 18 | 15 | 11 | 9 | 9 | 6 | 4 | 0–3 |
| bottom edge y | 288 | 294 | 298 | 301 | 303 | 305 | 308 | 309 | ≈312 | 315 | 315 |

The left edge stays at x ≈ 0–10 and the right edge at ≈ 873. Height is an expo-out 250 → 315 (half-life ≈ 2.5 f).

### 5.4 Content animation
* **Content fade-in** (paperclip, icons, button, text): about 10 % at 338, 20 % at 339, 35 % at 340, 50 % at 341, 60 % at 342, 80 % at 344 and 100 % at 347. The blob is present from 341 at full strength (at 341–345 it sits over the not-yet-typed part of line 1).
* **Typing** (characters across both lines; line 1 = 41 characters, line 2 = 26):

| f | 341 | 342 | 343 | 344 | 345 | 346 | 347 | 348 | 349 | 350 | 351 | 352 | 353 | 354 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| chars | 7 "Describ" | 15 "…a usec" | 23 "…to a" | 29 "…auto-ge" | 33 "…auto-genera" | 41 (line 1 done) | 45 "agen" | 50 "agent, or" | 54 "…loa" | 58 "…load an" | 62 "…exi" | 64 "…exist" | 66 "…existin" | **67 done** |

  * Speed decelerates: ≈ 8 → 6 → 4 → 2 → 1 chars per frame.
  * New glyphs enter light grey (≈ 40 %) and reach full ink within 3–4 frames (≈ .4 → .7 → .9 → 1), so the newest word always reads lighter.
* **Generate pill pop-in**: 181×45 (344), 193×51, 198×55, 205×56, 210×57, then **214×58 from 349** (scale 0.85 → 1, expo-out). The colour goes from `#6C6DE5` (344) to `#5646DD` (347), i.e. opacity .6 → 1.
* **Generate pill press**: **359** 208×57 → **360–361** 193×53 (scale 0.90) → 362 198 → 363 204 → 364 207 → 365 210 → 366 212 → 367+ 214–216 × 58–60 (back to 1.0 by 367; expo-out, half-life ≈ 1.5 f).
  * After the release the fill lightens to a hover state: `#5A48E0` (361), `#604DE4` (364), `#6452E6` (367), **`#6654E7`** from 369.
  * Its centre moves ≈ 12 px left in card space (664 → 652) by 372.
  * No cursor is visible.
* **Icon buttons**: their white circle backgrounds fade out over 365–380. By 382 only the glyphs remain (at about 50 %).

### 5.5 Background "ghost" elements (behind the card, out of focus)
* **Small blurred icon cluster** (like an out-of-focus toggle or icon pair), about 100 × 30. It is dark blue-grey about 15 levels below the bg, with blur σ ≈ 8. Centre: (1350, 150) at 342–366, (1312, 165) at 376, (1252, 180) at 382 and (1170, 240) at 386, so it drifts down-left with the exit (parallax ≈ 0.5× the card's motion).
* **Dark slanted bar entering from the top edge** (out of focus, a foreground object of the next shot): ΔL ≈ −8 to −12, blur σ ≈ 10, slanted about −12° (rising to the right). Its tip appears at about (735–900, 0–10) at 366. It spans x 765–1080 × y 0–45 at 376, 825–1110 × 0–90 at 382 and 900–1200 × 15–150 at 386.

---------------------------------------------------------------------------------------------------

## 6. Camera
There is no global camera move, shake or rotation in 287–386. Every motion belongs to an element (the pill, field, ring and card each have their own curves). The background never pans. The impression of a camera push-through at 328–336 comes from the rings scaling up while the field shrinks (§3.7).

## 7. Motion blur and focus
* **288**: the stretching pill and field are smeared ≈ 8–10 px (a single frame).
* **295–300**: the ring streaks are soft (≈ 6 px across the line).
* **331–335**: the zooming rims soften ≈ 3–6 px as they fade.
* **335–339**: the morphing field and ghost content are defocused ≈ 3 px. It is sharp again from 342, and the text is crisp by 348.
* **Card**: DOF as in §5.1, sharp on the left and σ ≈ 1.5–2 px on the right. The ghosts have σ 8–10 and the blob ≈ 14.
* **Exit**: a horizontal smear along the card's motion of **≈ 0 (≤ 382), 4 px (383), 6 px (384), 10 px (385), 14 px (386)**. Text strokes look doubled at 385–386.

## 8. Easing summary (measured)
| motion | frames | curve |
|---|---|---|
| Pill width snap | 287→296 | expo-out, ×0.67/f (half-life 1.7 f) |
| Field width snap | 287→298 | expo-out, ×0.69/f (half-life 1.9 f) |
| Pill/field slow zoom-out | 297→327 | expo-out, ×0.92/f (half-life ≈ 8 f) |
| Arrow-button pop-in | 293→299 | expo-out, ×0.6/f |
| Button press / hover-grow | 310–311 / 312→322 | squash 0.80 in 1 f; expo-out ×0.72/f to Ø 135.5 |
| Ring fly-in | 295→326 | perspective-like expo-out, ×0.72–0.83 early, then ×0.86/f |
| Rings zoom-past | 328→334 | ease-in, scale ×1.02, 1.06, 1.11, 1.18, 1.26 |
| Button exit + arrow spin | 327→335 | ease-in |
| Card outline height | 342→352 | expo-out (half-life ≈ 2.5 f) |
| Card tilt-in | 342→349 | overshoot in rx (7.5 → 20.4 → 14.2) |
| Card drift | 349→372 | linear |
| Card exit | 373→386 | ease-in (cubic-like) |
| Typing (pill / card) | 291→307 / 341→354 | decelerating (see tables) |

## 9. Sound sync (from `ref/audio.wav`, 150 BPM; hats every 6 frames on …284.7, 290.7, 296.7 …)
| frame | event on screen | sound |
|---|---|---|
| 285 (seg2) → **287** | 808 boom tail; **hard cut** to the pill close-up | low boom f283–289 (LF peak at 285) |
| 287–290 | pill snap-stretch | (no separate SFX; boom tail) |
| **291** | bar downbeat, **typing starts** | kick (LF peak 291–292) |
| 291–303 | "Prompt your agent into existence" types | about 8 random high **data-blips** (3–15 kHz, 40–70 ms) |
| 293–299 | arrow button pops in | (blips) |
| 295–306 | ring streaks fly in | (implied soft air whoosh; not prominent) |
| **311** | **button press** | 2 high blips 311–314 (13.5 and 12 kHz) |
| 312–322 | button hover-grow | — |
| 328–335 | rings zoom past, button spins out | (hat 332 bright) |
| **339** | bar downbeat, **field becomes the card** (337–341) | kick (LF 339–340) |
| 341–354 | card typing | high ticks on 344–345, 347, 353 |
| **348** | line 1 complete, button settled | 808 accent (LF 348) + soft thump/9 kHz tick 347–350 |
| **359–361** | **Generate pill press** | high tick at 359 and 362 (hat grid 356.7 / 362.7) |
| **381** | exit accelerating | **sub drop** begins (808 glide f381–391) |
| **387** | **hard cut** to the node-card shot | bar downbeat 386.9: kick (LF 387–388) and bubble pops 384–399 |

---------------------------------------------------------------------------------------------------

## 10. WKC ADAPTATION (same frames, sizes, positions, curves; only content, copy and colours change)

Copy every frame number, size, position, easing, opacity and pose above **unchanged**. The script line for this segment is **"Tell us what needs explaining"** (10–12.5 s). The card that follows is the **WKC project brief**: the first step of the 12.5–18 s "brief → storyboard → compositions → animation" demonstration. The next shot's flying cards become the storyboard frames.

### 10.1 Colour map
| element | reference | WKC |
|---|---|---|
| Pill rim (strong / light) | `#5975D9` / `#B7A0F4`, right end 15 % | **`#3F8CE8`** strong / `#8DC0FF` light, same conic intensity pattern and glow rgba(63,140,232,.35) |
| Ring stroke | violet-grey `#A296C4` ≈ rgba(110,90,200,.45) | rgba(63,140,232,.45) (`#6FA6EE` on white) |
| Ring specular streaks | white 80 % | unchanged white |
| Field fill / hairline | white-lavender 30–50 % / `#E1DDDE` | rgba(250,252,255,.30–.50) / rgba(5,15,25,.10) |
| Typed text | `#0A0A14` | ink **`#050F19`** |
| Arrow button rest → hover | `#5442DF` → `#7B6AE9`, glow rgba(123,106,233,.35) | **`#1266C9`** → **`#3F8CE8`** (same step-by-step ramp 312–321), glow rgba(63,140,232,.38) |
| Card glass fill / rim left / rim bottom | white-lavender 45 % / `#A69BCD` / `#92A1E1` | rgba(246,250,255,.45) / `#9DB7DD` / **`#7FA8E6`**; top highlight white |
| Card shadow | rgba(70,60,160,.12) | rgba(18,60,130,.12) |
| Card text, paperclip | `#020C1D` | ink `#050F19` |
| Generate pill rest → hover | `#5745DE` → `#6654E7` | **`#1266C9`** → **`#3F8CE8`** |
| Blob / ghosts | blue-grey | rgba(63,140,232,.22) chip; ghosts in `#1B4FB8` at the same ΔL |
| Background mesh | pink / aqua / violet | hue-remapped grids below (pink → periwinkle/ice blue, violet → brand periwinkle, aqua and blues unchanged, same lightness) |

**WKC background grids** (9 × 7 samples; interpolate linearly in time between these frames and bilinearly in space; `*` = cell covered by the field/card in the reference, filled by row interpolation):

**287**
| y \ x | 15 | 240 | 480 | 720 | 960 | 1200 | 1440 | 1680 | 1905 |
|---|---|---|---|---|---|---|---|---|---|
| 15 | `#EAF0F8` | `#EDF1F7` | `#EAEEF3` | `#D8F1F6` | `#C1EDF2` | `#B0E4F4` | `#9FDBF4` | `#96D7F2` | `#8ECFF1` |
| 180 | `#F0F4F9` | `#F2F4F7` | `#EDF4F7` | `#DBF1F7` | `#C3EAF5` | `#B2E0F3` | `#A1D6F4` | `#9AD6F2` | `#8FCCEF` |
| 360 | `#F5F7FA` | `#F8F6F6` | `#F1F6F7` | `#DDEFF5` | `#C5E6F5` | `#B5DEF6` | `#A5D3F4` | `#9ECEF1` | `#95C6F0` |
| 540 | `#FBF7F6` | `#FCF7F7` | `#F4F6F6` | `#E0ECF5`\* | `#CCE3F4`\* | `#B9DAF4`\* | `#A5D0F3` | `#9FCCF0` | `#96C2F1` |
| 720 | `#FCF8F7` | `#F9F8F6` | `#F4F5F4` | `#E3EDF4` | `#CFE2F1` | `#BDD8F2` | `#ACCDF3` | `#A2C7F0` | `#96BEEF` |
| 900 | `#FCF8F7` | `#FAF9F7` | `#F3F4F5` | `#E5E9F5` | `#D1E1F1` | `#BED6F2` | `#B0CCF3` | `#A4C0F1` | `#96BBF0` |
| 1065 | `#FCF8F7` | `#F9F8F6` | `#F1F2F3` | `#E5E9F4` | `#D3DFF1` | `#C2D4F0` | `#B2CAF1` | `#A4BBF3` | `#97B4EE` |

**300**
| y \ x | 15 | 240 | 480 | 720 | 960 | 1200 | 1440 | 1680 | 1905 |
|---|---|---|---|---|---|---|---|---|---|
| 15 | `#DBE5F3` | `#E0E6F1` | `#E3E8F3` | `#CDE7F2` | `#B5EAF2` | `#97E3F0` | `#7FDAEF` | `#71D1F1` | `#65CDEE` |
| 180 | `#E5EBF6` | `#E6EBF4` | `#E9EDF6` | `#D5EAF6` | `#B6E9F1` | `#99E0F2` | `#82D4EF` | `#77CAF0` | `#73C6EE` |
| 360 | `#F1F3F6` | `#F2F5F8` | `#EFF3F5` | `#D7F0F5` | `#BBE7F4` | `#9FD9F1` | `#8BCDEF` | `#7DC5EE` | `#7ABDEE` |
| 540 | `#FBF7F6` | `#ECEFF5`\* | `#DDE7F4`\* | `#CDDFF3`\* | `#BED6F2`\* | `#AFCEF0`\* | `#9FC6EF`\* | `#90BEEE`\* | `#81B6ED` |
| 720 | `#FCF8F7` | `#FAF9F7` | `#F6F7F8` | `#E3EEF5` | `#C5DDF3` | `#A9CDEF` | `#95BFEF` | `#8AB4EE` | `#84ACED` |
| 900 | `#EFF1F4` | `#F4F5F6` | `#F6F6F7` | `#E7EBF6` | `#C9DCF1` | `#B0CAF2` | `#97BAF1` | `#8BAFEF` | `#81A4EB` |
| 1065 | `#DFE5F2` | `#E8ECF4` | `#EFF1F4` | `#E6EAF5` | `#CEDCF3` | `#B2C9F1` | `#9BBAEC` | `#88ABEC` | `#7A9EEA` |

**312**
| y \ x | 15 | 240 | 480 | 720 | 960 | 1200 | 1440 | 1680 | 1905 |
|---|---|---|---|---|---|---|---|---|---|
| 15 | `#D8E2F1` | `#D7E0F0` | `#D8E1F4` | `#C6DCF3` | `#A9E0F0` | `#86E0EF` | `#69DAEE` | `#5AD3EE` | `#5DD0F1` |
| 180 | `#E1E8F4` | `#E2E8F3` | `#DFE5F2` | `#C7E3F3` | `#A6E4F1` | `#85DCF1` | `#6ED3EF` | `#61CBED` | `#65C8EE` |
| 360 | `#EEF2F7` | `#DFE7F6` | `#DBE4F7` | `#C4E6F5` | `#ACE4F2` | `#95DAF4` | `#7BC9EF` | `#6DBAF3` | `#6CC0F1` |
| 540 | `#F2F4F8` | `#E8EBF6`\* | `#D8E3F5`\* | `#C7DBF3`\* | `#B6D4F2`\* | `#A6CCF1`\* | `#95C4EF`\* | `#85BCEE`\* | `#75B5ED` |
| 720 | `#EDEFF3` | `#EEF0F6` | `#E6F3F3` | `#CBE9F3` | `#AEDBF1` | `#A1CEF0` | `#86B8F0` | `#79ABF1` | `#77ADEE` |
| 900 | `#D9E0F0` | `#E0E5F2` | `#DEE5F2` | `#CBE2F2` | `#B0D4EE` | `#9AC6EE` | `#87B6EE` | `#7BABED` | `#78A4EC` |
| 1065 | `#C9D5F0` | `#CFDAF2` | `#D6DFF2` | `#C8D5F2` | `#B5CFF0` | `#9DC3ED` | `#89B1EB` | `#7DA4EB` | `#749AEB` |

**324**
| y \ x | 15 | 240 | 480 | 720 | 960 | 1200 | 1440 | 1680 | 1905 |
|---|---|---|---|---|---|---|---|---|---|
| 15 | `#D4DFF1` | `#D4DEEF` | `#D5DEF3` | `#C5D9F1` | `#A7DFEE` | `#86DFF1` | `#69DBF0` | `#58D5F0` | `#5FD3F2` |
| 180 | `#E0E7F2` | `#DEE5F1` | `#DEE4F2` | `#C4E1F3` | `#A4E1F2` | `#82DDF1` | `#6AD4EF` | `#5CCDEE` | `#62CDF2` |
| 360 | `#E7ECF4` | `#E6EBF5` | `#DDE6F5` | `#C3E7F4` | `#A2E2F1` | `#86D7EF` | `#71C8EF` | `#67BFF1` | `#6AC1F2` |
| 540 | `#E7ECF5` | `#E4E9F5` | `#D5DBF4`\* | `#C0D1F3`\* | `#ACC8F2`\* | `#98BFF1`\* | `#83B5F0`\* | `#6FACEF` | `#72B9EF` |
| 720 | `#DAE2F4` | `#DDE4F4` | `#D5E1F3` | `#BDDDF2` | `#A5D5F3` | `#8FC7EF` | `#80B7F0` | `#79AFF1` | `#77B0EF` |
| 900 | `#C7D5F4` | `#CBD7F1` | `#C9D1F3` | `#B7CFF2` | `#A5C9EF` | `#92C1EF` | `#82B3EA` | `#7CABEF` | `#78A8EF` |
| 1065 | `#B5C7F0` | `#B8C9F1` | `#BECEF0` | `#B2C1F0` | `#A3BEF2` | `#91B9EF` | `#84ADEE` | `#7BA3EB` | `#779EEF` |

**336**
| y \ x | 15 | 240 | 480 | 720 | 960 | 1200 | 1440 | 1680 | 1905 |
|---|---|---|---|---|---|---|---|---|---|
| 15 | `#CBD9EF` | `#CDDAEF` | `#D2DCF1` | `#C9D8F2` | `#AADFF1` | `#8BE2F2` | `#6BDDF2` | `#5DDBF0` | `#67E0F5` |
| 180 | `#D5E0F2` | `#D4DFF1` | `#DAE1F1` | `#C5E0F3` | `#A8E3F3` | `#87DFF2` | `#6BD7F2` | `#5AD5F1` | `#64DCF4` |
| 360 | `#DBE3F1` | `#DAE2F3` | `#DDE4F3` | `#C2E4F4` | `#A3E3F2` | `#86D8F0` | `#71CEF1` | `#65CDF3` | `#6AD3F3` |
| 540 | `#D4DEF1` | `#D6DFF3` | `#CDDAF4`\* | `#BACFF4`\* | `#A8CCF4`\* | `#96C8F5`\* | `#83C5F5`\* | `#71C2F5` | `#75C9F2` |
| 720 | `#C6D3F0` | `#C6D3F0` | `#C1C9F0` | `#AFCEEE` | `#9ACBEF` | `#8EC5F0` | `#82BBF3` | `#7BB8F2` | `#7BBFF1` |
| 900 | `#AFC3F1` | `#AEC2F1` | `#B0C4EF` | `#A6B9F0` | `#95BAEE` | `#8CB6EF` | `#81B2ED` | `#7CAFF0` | `#80B6F4` |
| 1065 | `#9CB5ED` | `#9AB4EF` | `#A0B8ED` | `#9AA8EE` | `#91ADED` | `#87ADED` | `#81ACEF` | `#7BA4EE` | `#81ACF1` |

**348**
| y \ x | 15 | 240 | 480 | 720 | 960 | 1200 | 1440 | 1680 | 1905 |
|---|---|---|---|---|---|---|---|---|---|
| 15 | `#BCD0F0` | `#B8CDEF` | `#C6D5ED` | `#D6E0F7` | `#BAE5F7` | `#92E8F6` | `#73E4F8` | `#73E6F6` | `#8DEAF2` |
| 180 | `#C8D8F0` | `#C4D4EF` | `#CFDBF0` | `#DAE3F6` | `#B4E5F7` | `#87E7F7` | `#67DFF5` | `#63E0F4` | `#83E8F6` |
| 360 | `#D1DCEE` | `#CDDAF0` | `#D4DEEF` | `#D2DCF2`\* | `#B9D6F3`\* | `#A1D9F3`\* | `#88DBF4`\* | `#6FDDF5` | `#87E6F8` |
| 540 | `#D1DBF0` | `#C7D5F1` | `#CBD6EF` | `#C5CDF0`\* | `#B3D0F0`\* | `#A2D2F1`\* | `#90D5F1`\* | `#7FD8F1` | `#92E4F4` |
| 720 | `#C2CFED` | `#B6C7EE` | `#B3C6EF` | `#B0C5F0`\* | `#A7BEF1`\* | `#9FC3F1`\* | `#96C9F2`\* | `#8DCEF3` | `#A2DDF5` |
| 900 | `#A9BEEF` | `#9AB4EE` | `#97B2EE` | `#97B3EE` | `#8EACED` | `#86AEEE` | `#85B5F0` | `#92C4F3` | `#AED7F6` |
| 1065 | `#94AFED` | `#7FA1ED` | `#7EA1ED` | `#86A8ED` | `#8299EB` | `#7C9FEA` | `#80A5EE` | `#96B9F2` | `#B5D1F3` |

**360**
| y \ x | 15 | 240 | 480 | 720 | 960 | 1200 | 1440 | 1680 | 1905 |
|---|---|---|---|---|---|---|---|---|---|
| 15 | `#B2C8ED` | `#B5CBEF` | `#C8D8F2` | `#DDE5F6` | `#C6EDF6` | `#9BEDF7` | `#78E6F6` | `#70E3F2` | `#88E8F4` |
| 180 | `#BDD0EF` | `#BFD2F1` | `#CEDCF3` | `#E2E8F6` | `#BFEDF7` | `#93EBF5` | `#70E4F5` | `#64E1F4` | `#80E5F2` |
| 360 | `#C9D8F0` | `#C8D7EF` | `#D1DDF3` | `#D2DDF6`\* | `#BBD6F6`\* | `#A2D9F5`\* | `#88DDF5`\* | `#6FE1F5` | `#87E7F6` |
| 540 | `#CBD8F2` | `#C2D1F0` | `#C6D4F0` | `#C8D6F2`\* | `#B8D0F2`\* | `#A7D6F3`\* | `#97DBF3`\* | `#86E1F4` | `#98EAF5` |
| 720 | `#BECEF0` | `#B3C4ED` | `#AFC3F0` | `#B3C7F1`\* | `#ADC0F1`\* | `#A6C9F2`\* | `#A0D1F2`\* | `#99DAF3` | `#ACE8F6` |
| 900 | `#A9BEEE` | `#98B2EE` | `#93AFEE` | `#97B3EF` | `#93A5EF` | `#8FB0F0` | `#94BEF1` | `#A4D0F3` | `#BDE2F4` |
| 1065 | `#94AFED` | `#7DA0EF` | `#7A9EEE` | `#85A6EC` | `#8295ED` | `#849FEE` | `#8EADEF` | `#A8C6F1` | `#C6DCF3` |

**372**
| y \ x | 15 | 240 | 480 | 720 | 960 | 1200 | 1440 | 1680 | 1905 |
|---|---|---|---|---|---|---|---|---|---|
| 15 | `#B0C7EE` | `#BBCFF0` | `#D6E1F4` | `#EBF0F8` | `#CCE9F4` | `#A3EEF6` | `#78E6F6` | `#6BE2F1` | `#7AE5F2` |
| 180 | `#B9CEF0` | `#BFD2F1` | `#D7E2F4` | `#EBEFF8` | `#D0F1F4` | `#A6ECF5` | `#77E6F3` | `#65E1F5` | `#79E5F3` |
| 360 | `#C7D6EF` | `#C9D7F0` | `#D8E2F4` | `#D7E1F6`\* | `#BCDEF6`\* | `#A2E3F6`\* | `#87E7F6` | `#79E4F4` | `#89E8F5` |
| 540 | `#CBD8EF` | `#C5D5F2` | `#D0DCF4` | `#D3DEF4`\* | `#C1DAF4`\* | `#AFDFF4`\* | `#9DE4F3` | `#94E5F4` | `#9FEBF6` |
| 720 | `#C1D1F2` | `#B8CAF1` | `#B8C9F2` | `#BFCFF2`\* | `#B8C9F2`\* | `#B1D2F3`\* | `#AADAF3` | `#ADE4F2` | `#BAEDF5` |
| 900 | `#ADC0ED` | `#9EB7F1` | `#9AB4EF` | `#A0BAF1` | `#9FB0F1` | `#A0BBF1` | `#A8C9F0` | `#B4D8F4` | `#CFEBF6` |
| 1065 | `#99B4F1` | `#82A3ED` | `#80A2ED` | `#8CABEC` | `#899AED` | `#8FA5EF` | `#9BB8F1` | `#B5D0F5` | `#D5E5F6` |

**386**
| y \ x | 15 | 240 | 480 | 720 | 960 | 1200 | 1440 | 1680 | 1905 |
|---|---|---|---|---|---|---|---|---|---|
| 15 | `#B0C8EF` | `#BED1F1` | `#D8E3F5` | `#EDF1F9` | `#E0F5F8` | `#A3D8F3` | `#80E7F5` | `#6AE2F2` | `#71E5F4` |
| 180 | `#B7CCEF` | `#C1D3F1` | `#D9E3F4` | `#F0F2F5` | `#DCF6FA` | `#B0EFF7` | `#84E8F5` | `#6AE2F7` | `#78E4F4` |
| 360 | `#C7D6EF` | `#CAD8F1` | `#DEE6F4` | `#F1F4FB` | `#E4F6F6` | `#C5F2F7` | `#9CEBF6` | `#87E8F6` | `#8BEAF5` |
| 540 | `#CDDAF2` | `#CDDBF4` | `#DAE4F6` | `#E0E7F7`\* | `#D8E7F7`\* | `#CEEEF7` | `#AFEAF6` | `#A3ECF6` | `#ABEEF6` |
| 720 | `#C8D6F3` | `#C2D1F2` | `#C7D4F3` | `#CEDAF4`\* | `#CBD5F5`\* | `#C7DDF5` | `#B9DFF5` | `#BBE8F7` | `#C4F0F6` |
| 900 | `#B6C9F4` | `#AAC0F2` | `#A9BFF2` | `#B0C5F2` | `#ADBBF1` | `#ACC4F2` | `#B2CEF3` | `#C1DAF6` | `#D8ECF9` |
| 1065 | `#9EB7F1` | `#8DABEF` | `#90AEF0` | `#96B3EF` | `#93A5F0` | `#93ACF2` | `#9EBCF1` | `#B8D1F2` | `#D7E7F7` |

### 10.2 Shot P: "Tell us what needs explaining"
* **Pill, field, ring, button**: identical geometry and timing (§3.2–3.7) in WKC colours.
* **Text**: **Inter 500**, sentence case, tracking −0.01 em, ink `#050F19`.
  * Font-size **44.7 px at 307** (Inter cap 0.727 → cap 32.5, the reference value). Scale it per frame with the cap table: ×1.04 at 298, 1.0 at 307, 0.972 at 318, 0.945 at 330, 0.914 at 333.
  * Left ink edge per the §3.4 x-table.
  * Baseline y 553 (→ 552 at 333).
  * The line is about 610 px wide (Inter advance estimate), against 730 px in the reference. It stays left-aligned at the reference's left edge and ends well before the button.
* **Typing schedule** (29 characters over the same frames; the same ≈ 0.75 → 1.0 per-glyph fade and the same 291–298 layer fade):
  * 290: ""
  * 291: "Te"
  * 292: "Tell"
  * 293: "Tell u"
  * 294: "Tell us w"
  * 295: "Tell us wha"
  * 296: "Tell us what n"
  * 297: "Tell us what nee"
  * 298: "Tell us what need"
  * 299: "Tell us what needs"
  * 300: "Tell us what needs e"
  * 301: "Tell us what needs exp"
  * 302: "Tell us what needs expla"
  * 303: "Tell us what needs explai"
  * 304: "Tell us what needs explain"
  * 305: "Tell us what needs explaini"
  * 306: "Tell us what needs explainin"
  * 307: **"Tell us what needs explaining"**, held to 333, then the §3.4 fade-out.
* **Arrow button**: the WKC ↗ "send" button. The press is on 311 and the hover-grow follows, so it reads as "brief sent". The spin-out (327–335) stays identical.
* **Background**: the WKC grids. Static grain `/img/grain.png` at 8 %.

### 10.3 Morph M + Shot C: the WKC project brief card
* **Card**: identical size, pose table, outline settle, rim and shadow (§5), in WKC colours.
* **Paperclip**: kept (attach a script or deck), ink.
* **Copy**: Inter 500, **33 px** (cap 24, close to the reference's 23), ink, line pitch 45, same left x 112. The text has exactly the reference's character counts, so the §5.4 typing table applies frame for frame.
  * Line 1 (41 characters): **"Describe your product, feature or launch,"**
  * Line 2 (26 characters): **"or attach a script or deck"**
  * Per frame: 341 "Describ", 342 "Describe your p", 343 "Describe your product,", 344 "Describe your product, featur", 345 "Describe your product, feature or", 346 full line 1, 347 "or a", 348 "or attach", 349 "or attach a s", 350 "or attach a scrip", 351 "or attach a script or", 352 "or attach a script or d", 353 "or attach a script or dec", 354 "or attach a script or deck".
* **Icon buttons**: the same two 38 px circles.
  * "⇄" becomes a **format icon**: two overlapping rounded frames, landscape and portrait (16:9 ↔ 9:16).
  * The bot glyph becomes a **film/clapper icon**.
  * Same 1.5 px white ring; same fade of the circle backgrounds over 365–380.
* **Action pill**: **"Build storyboard ✦"**. Inter 600, about 19 px, white, with WKC's 4-point sparkle. The pill is 215 × 58 with radius 29: the label (≈ 165 px) plus the sparkle fits the same 215 px pill. Use the identical pop-in (344–349) and **press on 359–361**, with the hover lighten `#1266C9` → `#3F8CE8`. The press reads as "brief approved → storyboard", and the hard cut at 387 lands on the storyboard frames flying in.
* **Blob**: keep it as an out-of-focus brand chip, rgba(63,140,232,.22), blur 14, with the same flat box x 540–810, y 0–62. It reads as a defocused "format" tag. Do not put readable numbers in it.
* **Ghosts**: the blurred icon cluster becomes a blurred WKC monogram chip in `#1B4FB8` (same ΔL ≈ −15 against the bg, σ 8, same path). The dark slanted bar becomes the blurred edge of a **storyboard frame** card entering from the top (same path, slant and blur, ink-blue `#1B4FB8` at the reference's contrast). This foreshadows seg4's storyboard frames.
* **Exit**: the identical ease-in turn-away and shrink with the same horizontal smear (4, 6, 10, 14 px on 383–386), then the hard cut at 387. Keep the background continuous into seg4.

### 10.4 Sound for the WKC build (on the §9 frames)
* Soft sub tail across the 287 cut.
* Airy whoosh 295–306 (ring fly-in).
* Fast soft key/data ticks 291–303.
* **Click on 311** (send button), then a soft "bloop" on the hover-grow 312–316.
* Reverse-air whoosh 328–335 (rings fly past).
* Glass "shimmer" swell on the morph 337–341, landing on the 339 downbeat.
* Faster typing ticks 341–354.
* Thump and tick on 348.
* **Click on 359–360** (Build storyboard).
* Low whoosh into the sub drop 377–386, and the hard cut on the 387 downbeat.

---------------------------------------------------------------------------------------------------

## 11. Self-check performed
* **Pill / field / ring tables**:
  * The ring centre from both ends is 959.5 ± 1 at 310–330.
  * The pill centre from both ends is 960 ± 1 at 287–302.
  * Ring W/H = 5.12 ± 0.04 across 310–328, and pill W/H = 6.72 ± 0.03 across 303–330, which confirms uniform scaling.
* **Text**:
  * The typing strings were read from crops of every frame 290–307 and every rectified card frame 341–357.
  * The per-glyph fade was measured on 20 px bins (299–311).
* **Card pose**:
  * The CSS model was fitted per frame to 40–980 SIFT correspondences. P = 1200 minimises the error (median 0.82 px across all frames, against 0.98 at 900 and 1.05 at 1500).
  * Corner overlays were checked on 342, 344, 346, 348, 352, 370, 378, 382 and 383–386.
  * The right-edge drift was measured in rectified space (873 → 852 over 372–384) and corrected in the table.
* **Known approximations**:
  * Morph boxes at 333–341 are ±6 px.
  * Exit corners at 385–386 are ±8 px.
  * The ring's gap pattern is described, not traced per frame.
  * Grain refreshes irregularly; a static texture is recommended.
