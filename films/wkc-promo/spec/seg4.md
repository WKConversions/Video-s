# Segment 4: reference frames 384-531 (12.80-17.70 s)
### Node cards on a pastel board, then the 3D wall of cards with an app panel, then the cut to "Publish"

**Conventions**
- Every coordinate is in **1920x1080 film pixels**: the reference's 720p measurements were multiplied by 1.5. The origin is top-left, x points right and y points down. Colours are sampled sRGB hex values from the reference frames.
- Frame n = n/30 s, and the reference and our film share frame numbers 1:1.
- How it was measured: SIFT similarity and homography tracking per card and per plane (RANSAC, typical reprojection error under 1 px), thresholded bounding boxes, a mosaic-period detector (autocorrelation of gradient energy), Gaussian blur fitting against warped sharp frames, a 3D self-calibration of the camera (focal length from plane rigidity plus equal card sizes), and rectification of both planes into flat local coordinates. Values marked "est." are inferred, not measured.
- **No grain and no vignette** in frames 387-529. The flat-area high-pass std is 0.47-0.57 levels, which is only JPEG noise. The previous shot (to 386) has slight grain (std 0.96).

---

## 0. Context at the edges (378-537)

* **378-386: the end of the previous shot (seg3).** The glass prompt pill ("Describe a usecase to auto-generate a new agent, or load an existing" plus the purple "Generate Agent" button) recedes. It shrinks with an ease-in and swings in 3D: its right side moves back and to the left while its text block stays centred near (950,547). From 384 the right half gets a growing horizontal motion blur: about 6 px at 384, 12 px at 385 and 18 px at 386. Measured "Generate Agent" button bbox per frame:

| frame | button bbox (x0-x1, y0-y1) | size | centre |
|---|---|---|---|
| 382 | 987-1162, 576-634 | 175x58 | (1074,605) |
| 383 | 975-1137, 576-633 | 162x57 | (1056,604) |
| 384 | 961-1110, 574-630 | 148x55 | (1035,602) |
| 385 | 949-1075, 573-625 | 126x52 | (1012,599) |
| 386 | 933-1038, 570-619 | 105x49 | (985,594) |

  The dark-text bbox of the pill copy is x 702-1190 at 382, 756-1141 at 384 and 840-1071 at 386, with y always about 465-630. The image sharpness (Laplacian variance) falls 173 → 128 → 80 → 38 → 22 over 382-386 as the blur grows. The seg3 builder owns the pill's design. This segment only needs it to keep moving through 384-386 with these sizes and blurs: give seg3's RANGE an overlap to 387, or reuse its pill component here.
* **386 → 387: HARD CUT.** The pastel background continues almost unchanged (it is the same screen-fixed mesh). The purple button is replaced by the purple "Send To" node card, which appears to the right of where the button was and is heavily motion-blurred. This is a match-cut in spirit (purple pill → purple card), but the geometry does not carry over.
* **428 → 429: HARD CUT** (a jump-cut into a closer framing of the same card board). It lands on the step-14 pickup of bar 8 together with a short bright swish (§8).
* **529 → 530: HARD CUT** to the pastel "Publish" scene (seg5). Frames 530-537 belong to seg5: the purple pill button pops from scale 0.52 with a glossy cursor in mid-air. 529 is the last frame of this segment's picture. It is motion-blurred about 23 px horizontally, and the 3D orbit is accelerating.

## 1. Shot list

| # | frames | dur | content | in | out |
|---|---|---|---|---|---|
| (tail) | 384-386 | 3 f | seg3's prompt pill receding with blur | - | hard cut |
| **A** | **387-428** | 42 f | Pastel board. The purple **"Send To"** node card grows in (387-393). 15 white **integration cards** pop in as **pixel-mosaic blocks** one after another (387-418, top-left → bottom-right) on a near-frontal plane with mild perspective. The Send To subtitle **types on** (389-417). The camera settles (387-412), then zooms in with an ease-in (412-428). The Send To card **de-rezzes** into mosaic blocks (424-428) | hard cut | hard cut |
| **B1** | **429-444** | 16 f | Closer framing of the same board. In the old Send To slot a white **"Box"** card re-rezzes from mosaic (429-436). The plane keeps approaching the camera with an expo-out, and its perspective flattens (rotY +19.4° → +10.8°) | hard cut | continuous |
| **B2** | **444-462** | 19 f | Fast **swing into 3D**: the wall rotates through frontal to rotY -33° (peak 4.3°/frame at 450-451) while it pulls back (expo-out after a short ease-in). The **app panel** ("Chatbot" UI) flies in from in front of the camera (first visible 455, heavy defocus σ≈20-27 px), the **dashed data-flow lines** start drawing (458+) | continuous | continuous |
| **B3** | **462-505** | 44 f | Decelerating orbit: the wall reaches rotY -43°. The panel settles parallel to the wall, about 1290 px in front of it. Dashed lines with travelling arrowheads grow toward the panel | continuous | continuous |
| **B4** | **505-529** | 25 f | **Accelerating orbit** (ease-in) to rotY -56° with **horizontal motion blur** building over 525-529 | continuous | hard cut |

No crossfades occur: every shot change is a hard cut and all motion happens inside the shots.

---

## 2. Background (all shots)

A **pastel mesh gradient, fixed to the screen**: magenta-pink top-left, aqua top-right, near-white lavender in the upper centre and periwinkle/violet along the bottom. It drifts only slightly. In shot B it shifts a little with the orbit, and the right edge lightens toward `#CCF4FB`. It is the same family as seg2's pastel (seg2 §3.1). Rebuild it by drawing the colour grid below as a small image and resizing it to 1920x1080 with bicubic smoothing, then interpolate linearly between the listed frames. Each cell is the median of the background pixels in a 240x216 cell centred at the listed point, with cards and the panel masked out. Masked cells were filled from their neighbours. The WKC column uses the same hue map as seg2 §8.1 (pink → periwinkle, lavender → ice blue, aqua kept), refitted on seg2's 63 colour pairs (rms 2.6 levels).

**Frame 387** (reference | WKC). Columns x = 120, 360, 600, 840, 1080, 1320, 1560, 1800

| y | 120 | 360 | 600 | 840 | 1080 | 1320 | 1560 | 1800 |
|---|---|---|---|---|---|---|---|---|
| 108 | `#F5ADF7`→`#B0C3F4` | `#F8C7F9`→`#C7CFF8` | `#FAE2F9`→`#DCE5F8` | `#EBF5F9`→`#E3F6F7` | `#CDF3F9`→`#D2F4F7` | `#9DECF7`→`#ABEDF5` | `#76E5F7`→`#95ECF4` | `#6AE2F8`→`#9CEFF4` |
| 324 | `#F6BDF8`→`#BFCAF7` | `#F8D0F9`→`#CED6F8` | `#FAE6F9`→`#DFE9F8` | `#EEF7FA`→`#E5F8F8` | `#D5F5F9`→`#D7F6F7` | `#AFEEF8`→`#BCF0F6` | `#8FE9F8`→`#ABEEF5` | `#86E8F8`→`#A6EFF5` |
| 540 | `#F2CAF7`→`#C8D5F6` | `#EFD1F8`→`#CED8F8` | `#F0E3F8`→`#DBE7F7` | `#EBF0F8`→`#E1F2F7` | `#DDEBF7`→`#D7EDF6` | `#BDE9F8`→`#C6EBF6` | `#AFEAF8`→`#BEECF6` | `#ACEDF9`→`#C0F1F6` |
| 756 | `#DAC3F5`→`#C1D2F5` | `#D3C2F5`→`#C0D1F5` | `#D2CBF5`→`#C4D6F5` | `#D3D3F6`→`#C8DAF6` | `#CDD8F5`→`#C6DEF5` | `#C2DBF5`→`#C1DFF5` | `#BFE1F7`→`#C5E4F6` | `#C8ECF9`→`#CFEEF7` |
| 972 | `#B6A8F3`→`#B2C4F2` | `#AEA0F2`→`#AEC2F1` | `#ABA5F3`→`#B3C2F2` | `#A9AEF2`→`#ADC5F2` | `#A8B7F3`→`#B1C9F3` | `#ACC0F3`→`#B1CDF4` | `#B8CDF5`→`#BCD5F5` | `#CEE0F8`→`#CEE3F7` |

**Frame 405** (reference | WKC). Columns x = 120, 360, 600, 840, 1080, 1320, 1560, 1800

| y | 120 | 360 | 600 | 840 | 1080 | 1320 | 1560 | 1800 |
|---|---|---|---|---|---|---|---|---|
| 108 | `#F5ACF7`→`#AFC3F4` | `#F6B9F9`→`#BEC5F7` | `#F9D4FA`→`#D2D7F9` | `#F2EEFB`→`#E3EEFA` | `#CEF4FA`→`#D5F5F7` | `#9FEDF8`→`#B2F0F5` | `#78E5F7`→`#96EBF4` | `#6EE3F8`→`#9DEFF4` |
| 324 | `#F6B8F9`→`#BEC4F7` | `#F6C8F8`→`#C7D2F7` | `#F8DFF9`→`#D9E2F8` | `#F7E6FA`→`#DEE7F9` | `#CAF1FA`→`#D3F3F7` | `#B1EEF9`→`#C3F1F6` | `#8AE7F8`→`#A9EDF5` | `#84E7F9`→`#AFF1F5` |
| 540 | `#F4CBF9`→`#CBD2F8` | `#ECD3FA`→`#D4D7F9` | `#F1E5FA`→`#DDE6F9` | `#F3EDF8`→`#E3F0F7` | `#C5CAF4`→`#BED4F4` | `#C6E7F9`→`#CFEAF7` | `#BAE8F8`→`#C5EAF6` | `#BAEDF9`→`#C8EFF7` |
| 756 | `#E1CBF8`→`#CBD4F7` | `#D4C4F8`→`#CACFF7` | `#DDD7F9`→`#D3DCF8` | `#DEDEF9`→`#D5E1F8` | `#D5E1F8`→`#D1E4F7` | `#C6DBF6`→`#C5DFF6` | `#C1DDF7`→`#C6E1F6` | `#CAE8F9`→`#D0EAF7` |
| 972 | `#BFB1F6`→`#C2C6F5` | `#BAADF6`→`#C3C4F4` | `#BDB7F6`→`#C2C9F5` | `#BDC2F6`→`#C2CFF6` | `#B6C4F6`→`#C1D0F6` | `#ADC0F4`→`#B5CDF4` | `#B0C5F5`→`#BAD0F5` | `#C6D5F6`→`#C4DBF6` |

**Frame 428** (reference | WKC). Columns x = 120, 360, 600, 840, 1080, 1320, 1560, 1800

| y | 120 | 360 | 600 | 840 | 1080 | 1320 | 1560 | 1800 |
|---|---|---|---|---|---|---|---|---|
| 108 | `#F6B5F8`→`#B8C5F6` | `#F5ACF8`→`#B2C0F5` | `#F5BFF8`→`#C0CCF7` | `#E7D9FA`→`#D7DCF9` | `#B8E9F8`→`#C4EBF6` | `#86E7F7`→`#9EEBF4` | `#6AE2F7`→`#90EBF4` | `#76E5F8`→`#9FEFF4` |
| 324 | `#F7C1F9`→`#C3CBF8` | `#F5C0F7`→`#C0CFF6` | `#F5CDF9`→`#CCD4F8` | `#EFDFF9`→`#D8E2F8` | `#C9EDF9`→`#D0EFF7` | `#9DE8F8`→`#B4ECF5` | `#91E4F7`→`#A9E8F5` | `#90E4F8`→`#B0EAF5` |
| 540 | `#F6D2FA`→`#D2D6F9` | `#EFD3F9`→`#D1D8F8` | `#F5DFF9`→`#D9E2F8` | `#F6E3F9`→`#DCE6F8` | `#BFC7F4`→`#BBD2F4` | `#B2E4F8`→`#C2E7F6` | `#ACDAF7`→`#BEDFF6` | `#ABE1F8`→`#C0E6F6` |
| 756 | `#E8D1F9`→`#D0D7F8` | `#EDD1F9`→`#D0D7F8` | `#EDE0FA`→`#DAE2F9` | `#E7E4F9`→`#D9E6F8` | `#CCD9F7`→`#CADEF7` | `#BDD9F6`→`#C1DEF6` | `#ACCEF4`→`#B3D5F4` | `#B2D1F7`→`#C3D9F6` |
| 972 | `#C3B6F6`→`#C1C9F5` | `#C8BCF7`→`#C6CBF6` | `#D2CBF8`→`#CCD4F7` | `#DCDDF9`→`#D4E0F8` | `#CEDAF8`→`#CEDFF7` | `#B1C7F4`→`#B6D1F4` | `#AAC3F3`→`#B0CEF4` | `#A9BEF4`→`#B5CCF4` |

**Frame 429** (reference | WKC). Columns x = 120, 360, 600, 840, 1080, 1320, 1560, 1800

| y | 120 | 360 | 600 | 840 | 1080 | 1320 | 1560 | 1800 |
|---|---|---|---|---|---|---|---|---|
| 108 | `#F6B5F8`→`#B8C5F6` | `#F5ACF8`→`#B2C0F5` | `#F5C0F8`→`#C1CCF7` | `#E7D9FA`→`#D7DCF9` | `#B8E9F8`→`#C4EBF6` | `#86E7F7`→`#9EEBF4` | `#69E2F7`→`#8FEBF4` | `#76E5F8`→`#9FEFF4` |
| 324 | `#F7C2F9`→`#C4CBF8` | `#F5BFF7`→`#BFCEF6` | `#F5CDF9`→`#CCD4F8` | `#EDE1F9`→`#D9E4F8` | `#CAEEF9`→`#D0F0F7` | `#9BE8F8`→`#B3ECF5` | `#90E4F7`→`#A8E8F5` | `#91E5F8`→`#B0EBF5` |
| 540 | `#F3D3FA`→`#D3D6F9` | `#EFD3F9`→`#D1D8F8` | `#F5DFF9`→`#D9E2F8` | `#F4E7FA`→`#DEE8F9` | `#D8EEF9`→`#D7EFF7` | `#B5E7F8`→`#C3EAF6` | `#ABDAF7`→`#BDDFF6` | `#ACE0F8`→`#C1E5F6` |
| 756 | `#EBD2F9`→`#D1D7F8` | `#EDD2F9`→`#D0D7F8` | `#EFE0FA`→`#DAE2F9` | `#F1ECFB`→`#E2ECFA` | `#D7EBF8`→`#D4EDF7` | `#BADAF7`→`#C3DFF6` | `#AAD7F7`→`#BEDDF6` | `#B3D7F8`→`#C7DDF7` |
| 972 | `#C2B5F6`→`#C1C8F5` | `#C4B7F6`→`#C1C9F5` | `#D0C7F8`→`#CBD1F7` | `#DBDAF8`→`#D1DFF7` | `#CDD9F8`→`#CDDEF7` | `#AFC5F4`→`#B5D0F4` | `#A8C0F4`→`#B4CDF4` | `#ABC4F5`→`#B9D0F5` |

**Frame 470** (reference | WKC). Columns x = 120, 360, 600, 840, 1080, 1320, 1560, 1800

| y | 120 | 360 | 600 | 840 | 1080 | 1320 | 1560 | 1800 |
|---|---|---|---|---|---|---|---|---|
| 108 | `#F5B1F8`→`#B6C3F6` | `#F4AFF8`→`#B5C1F5` | `#E7CBFA`→`#D1D0F9` | `#C1DFF8`→`#CAE3F7` | `#8EE6F7`→`#A5EAF5` | `#6BE2F7`→`#91EBF4` | `#71E3F9`→`#ABF2F4` | `#9CEBF9`→`#B9F1F6` |
| 324 | `#F5BCF8`→`#BECAF7` | `#F4BDF8`→`#BFCAF7` | `#E5D4FA`→`#D5D8F9` | `#C7E2F8`→`#CCE5F7` | `#9AE6F8`→`#B4EBF6` | `#81E3F7`→`#9FE9F5` | `#83E1F8`→`#ACEAF5` | `#A8E7F9`→`#C2ECF6` |
| 540 | `#F5BCF8`→`#BECAF7` | `#EFC8F8`→`#C9D0F8` | `#E6DFFA`→`#D9E1F9` | `#CEEAF8`→`#CFECF7` | `#B1E7F8`→`#C0EAF6` | `#9FDBF6`→`#B1DFF5` | `#9BD6F7`→`#B9DDF6` | `#B4E9F9`→`#C6EDF7` |
| 756 | `#F5BCF8`→`#BECAF7` | `#F2C2F8`→`#C4CDF7` | `#EDDBF9`→`#D6DEF9` | `#DBE4F9`→`#D6E7F8` | `#C2DCF7`→`#C6E0F6` | `#A6C6F5`→`#B7D1F5` | `#A0C3F5`→`#B7CFF5` | `#B8D8F8`→`#C8DEF7` |
| 972 | `#F5BCF8`→`#BECAF7` | `#F2CFF8`→`#CED6F8` | `#F1F0FA`→`#E3F1F9` | `#EFF1FC`→`#E5F0FA` | `#BDCBF7`→`#C6D4F6` | `#9AB3F4`→`#B6C7F4` | `#90A8F3`→`#B4C3F3` | `#ABC1F6`→`#C0CFF6` |

**Frame 500** (reference | WKC). Columns x = 120, 360, 600, 840, 1080, 1320, 1560, 1800

| y | 120 | 360 | 600 | 840 | 1080 | 1320 | 1560 | 1800 |
|---|---|---|---|---|---|---|---|---|
| 108 | `#F5ACF7`→`#AFC3F4` | `#F4B6F9`→`#BDC3F7` | `#EAC4F8`→`#C7CFF7` | `#B4E0F8`→`#C4E4F7` | `#7AE4F6`→`#90E7F4` | `#69E2F8`→`#9BEFF4` | `#85E7F9`→`#B0F1F5` | `#B1F0FA`→`#C8F4F6` |
| 324 | `#F6BEF8`→`#BFCBF7` | `#F2BEF8`→`#C2C9F7` | `#EDC7F9`→`#CACFF8` | `#B3E5F8`→`#C2E8F6` | `#93E5F9`→`#BAEDF6` | `#8EE5F9`→`#B7EEF5` | `#A1E6FA`→`#C7EEF6` | `#CCF4FB`→`#D8F6F8` |
| 540 | `#EEC9F8`→`#C9D2F7` | `#F0C3F8`→`#C6CEF7` | `#EEC5F8`→`#C8CEF8` | `#C2D9F8`→`#CDDFF7` | `#A7E3F9`→`#C4E9F7` | `#A6DCF9`→`#C8E4F7` | `#B8DDF8`→`#C7E2F7` | `#DCF2FB`→`#DEF3F9` |
| 756 | `#CFBCF6`→`#C1CCF5` | `#C8ADF5`→`#BEC5F4` | `#DBB9F7`→`#C2C9F6` | `#D9D6F8`→`#D0DCF8` | `#EFF0F9`→`#E2F1F8` | `#ABCAF6`→`#BDD4F6` | `#B2C9F7`→`#C5D4F6` | `#D7E4F9`→`#D5E6F8` |
| 972 | `#A595F4`→`#C0BDF1` | `#9A89F3`→`#C1BBEF` | `#BAA1F5`→`#BEC0F3` | `#BBB8F5`→`#C1CAF5` | `#9DB2F4`→`#B7C7F4` | `#94ACF2`→`#AAC3F2` | `#97B0F4`→`#B8C6F4` | `#C4D2F7`→`#C7D9F7` |

**Frame 528** (reference | WKC). Columns x = 120, 360, 600, 840, 1080, 1320, 1560, 1800

| y | 120 | 360 | 600 | 840 | 1080 | 1320 | 1560 | 1800 |
|---|---|---|---|---|---|---|---|---|
| 108 | `#F5ACF7`→`#AFC3F4` | `#F2B9F9`→`#C0C5F7` | `#D7CEF8`→`#CDD6F7` | `#ABDDFA`→`#D1E5F7` | `#76E3F7`→`#97EAF4` | `#71E2F9`→`#ACF1F4` | `#8FE9F9`→`#B3F1F5` | `#BCF2FA`→`#CCF5F7` |
| 324 | `#F5B6F8`→`#BAC6F6` | `#F4B8F8`→`#BCC7F6` | `#D3D8F6`→`#CADEF6` | `#B5E1F9`→`#CAE6F7` | `#A2E4F8`→`#BAE9F6` | `#96E2F9`→`#BEEAF6` | `#AFE6F8`→`#C0E9F6` | `#CFF3FA`→`#D6F4F7` |
| 540 | `#EEC3F7`→`#C3D0F6` | `#EEC2F8`→`#C5CDF7` | `#D1C7F7`→`#CAD2F7` | `#B3BDF9`→`#D9CCF7` | `#B2D8F8`→`#C6DEF7` | `#ABD8F8`→`#C4DFF7` | `#BFDAF7`→`#C5DFF6` | `#DCF0FA`→`#DBF1F8` |
| 756 | `#D3BBF7`→`#C4CAF6` | `#D1BAF7`→`#C4CAF6` | `#CDC3F6`→`#C5D0F6` | `#EFF0FA`→`#E2F1F9` | `#AFC2F5`→`#BBCFF5` | `#A9C3F5`→`#B9CFF5` | `#C1D0F6`→`#C2D8F6` | `#D6E3F8`→`#D2E6F7` |
| 972 | `#AB9CF4`→`#BCBFF2` | `#AB9CF5`→`#C4BEF2` | `#A49CF2`→`#AFC0F0` | `#A6B6F4`→`#B6C9F4` | `#99ABF3`→`#B2C4F3` | `#8EA7F2`→`#ACC2F2` | `#A4B9F3`→`#AFC9F3` | `#C6D3F7`→`#C7DAF7` |

There is no light ring, streak or glow in this segment. The only "glow" is the soft lavender shadow under the cards (§3.2).

---

## 3. SHOT A (387-428): the node-card board

### 3.1 Layout: rest quads at frame 420 (camera scale = 1 by definition)

The board is a 4-column grid of white cards on a plane that is slightly turned away to the right: columns shrink to the right (card width 500 → 432 → 377 → about 330) and row lines fan toward a vanishing point on the right. The cards are **individually tilted by ±2°**, a hand-placed look. The quads below already include all of this, so draw each card as a flat 500x170 card mapped onto its quad with the `quadToMatrix3d` helper (§4.1). Corners are TL, TR, BR, BL. "Anchor" is the point the per-card scale in TA2 acts about: the quad centre, except where noted. The col-4 cards are clipped by the frame edge at 1918, so their right corners are completed from a homography fit of the grid (error about 6 px) and their anchor is the centre of the *visible* part.

| card | slot | TL | TR | BR | BL | anchor |
|---|---|---|---|---|---|---|
| DB2 Database | c1r1 | 186,186 | 686,201 | 693,362 | 192,354 | (439,276) (TA2's offsets at 387-392 keep its TL corner fixed) |
| Google Drive - | c2r1 | 770,212 | 1202,226 | 1209,375 | 777,370 | (989,296) |
| MySQL | c3r1 | 1276,236 | 1653,248 | 1660,390 | 1282,384 | (1468,314) |
| Postgres | c4r1 | 1724,255 | 2048,271 | 2050,402 | 1722,392 | (1821,327) |
| Elastic | c1r2 | 183,432 | 684,435 | 692,597 | 190,604 | (437,517) |
| **Send To** (purple) | c2r2 | 746,402 | 1286,412 | 1286,627 | 746,618 | (1016,515) |
| BigQuery | c3r2 | 1287,447 | 1658,456 | 1660,598 | 1290,600 | (1474,525) |
| DB2 Database | c4r2 | 1713,459 | 2051,461 | 2053,593 | 1714,597 | (1816,529) |
| Postgres | c1r3 | 182,684 | 694,675 | 682,840 | 180,846 | (435,761) |
| Jira | c2r3 | 766,672 | 1180,666 | 1180,814 | 759,820 | (972,743) |
| S3 Read File | c3r3 | 1284,668 | 1648,668 | 1644,806 | 1278,814 | (1464,739) |
| MariaDB | c4r3 | 1708,668 | 2054,652 | 2056,785 | 1710,795 | (1814,729) |
| MariaDB | c1r4 | 190,944 | 686,928 | 688,1073 | 183,1108 | (436,1007) |
| Search for | c2r4 | 768,892 | 1194,884 | 1191,1026 | 766,1047 | (980,962) |
| Create DOC | c3r4 | 1288,909 | 1650,898 | 1642,1032 | 1284,1048 | (1466,972) |
| Elastic | c4r4 | 1758,867 | 2057,845 | 2059,978 | 1756,993 | (1838,927) |

The same grid in the wall-local units of shot B (§4.2) maps to frame 420 with the homography `H420 = [[1.0954, -0.00754, 187.61], [0.0765, 1.0098, 180.36], [0.000136, -0.000011, 1]]` (local (x,y) → screen). That fit has an rms error of 5.7 px on the settled cards. Use it if you want one shared board component, but the table above is the measured truth.

### 3.2 Card design (measured on DB2 c1r1 at 420, where it is 500x168 px on screen)
* **White card**: fill `#FDFDFB`, corner radius about 15 px. It has a thin slab "thickness" lip (3-4 px, light grey-lavender) along the bottom edge and a soft **lavender drop shadow** below (`#C1C5F5` at the shadow core, about 8 px down, 20 px blur, about 35 % opacity).
* **Icon**: a 50x50 brand logo at (+39, +31) from the card's TL.
* **Title**: Inter **600**, about 37 px (cap height 26 px), colour `#030303`. It starts at x +111, with its cap top at +44.
* **Gear icon**: 31x30 px outline in `#111`, 32 px from the right edge, vertically centred on the title (y +54..+84).
* **Divider**: 1.5 px, `#DBDBDB`, at y +96, from x +39 to about x +470.
* **Subtitle**: Inter 400, about 34 px, `#A8A6A7`, at x +40, top +111.
* Texts (reference): c1r1 "DB2 Database / Run a query against DB2"; c2r1 "Google Drive - / Read from Google"; c3r1 "MySQL / Run a query against"; c4r1 "Postgres / Run a query against"; c1r2 "Elastic / get"; c3r2 "BigQuery / Run a query against"; c4r2 "DB2 Database / Run a query against DB2"; c1r3 "Postgres / Run a query against"; c2r3 "Jira / Search"; c3r3 "S3 Read File / Read a file from"; c4r3 "MariaDB / Run a query against"; c1r4 "MariaDB / Run a query against"; c2r4 "Search for / Search Github"; c3r4 "Create DOC / Create local Word"; c4r4 "Elastic / get".
* **Connector arrows** sit between horizontally adjacent cards, at about the title's height: a short **blue** (`#2F6FE0`-ish) line of about 2-3 px with a small open arrowhead, spanning the gap (about 45 px long). They are measured at 420, for example, at (708-755, 285), (1224-1265, 305) and (1677-1710, 321) in row 1, and (708-755, 753), (1227-1265, 743) and (1680-1710, 733) in row 3. Each arrow appears together with the card on its right.
* **"Send To" card** (purple, bigger than the others: 541x225 at 420):
  * Fill `#543FDD` (measured `#523BE1`-`#543FDD`), radius about 10 px. A purple-tinted soft shadow (`#C1C5F5` band) sits just below, about 10-20 px deep.
  * A white "brain/sparkle" icon of 62x62 at (808-870, 450-511).
  * Title "Send To": white, Inter 600, about 40 px (cap 30 px, 472-503), x 888-1032.
  * Gear: white outline, 37x39 at (1182-1219, 467-506).
  * Divider: white at about 60 %, 1.5 px, at y 525, from x 808 to 1232.
  * Subtitle "Based on the RAG analy...": about 38 px Inter 400, white at about 45 % (reads `#A79CF0` on the fill), x 808-1256, y 552-590.

### 3.3 Camera (whole board)
The board moves as one plane (table **TA1**). The background does **not** move. Model the camera as a similarity about the frame centre: `screen = C + s·R(rot)·(p420 − C) + (tx, ty)` with C = (960,540), where p420 is a point of the frame-420 layout.
* 387-392: estimated. The DB2 card's top-left corner sits still at about (137,152) while the card grows.
* 393-412: **settling**. The rotation eases out from +2.7° to +0.2° (clockwise), tx from -97 to -5 (expo-out, half-life about 5 frames), and the scale stays nearly constant at 0.945-0.96.
* 412-428: **push-in with an ease-in**. The scale goes 0.959 → 1.084, and the per-frame increment grows from 0.003 to 0.014. The zoom centre stays at about (960-964, 540).

### 3.4 Card entrances: pixel mosaic + scale-up
Each white card enters with the same recipe, staggered in a diagonal sweep (table TA2, "first visible" = f0):
1. **Mosaic phase.** Draw the card pixelated with **16 px** square blocks (screen space, 1080p) for frames f0..f0+4, **8 px** blocks at f0+5, **4 px** at f0+6, and sharp from f0+7. The blocks are axis-aligned to the screen, and the card's silhouette is ragged on the block grid while it grows. Measured examples: DB2 has 16 px at 387-391, 7.5 at 392, 4.5 at 393 and is sharp at 394. Elastic has 16 px at 394-398, 7.5 at 399, 4.5 at 400 and is sharp at 401. Later, smaller cards follow the same timing.
2. **Scale-up.** The card scales about its anchor from about 0.25-0.40 at f0 (DB2: 0.61) and reaches about 0.93 by f0+6. This is an expo-out: `s(t) ≈ 1 − 0.70·0.70^t` (t in frames since f0) for the mosaic phase.
3. **Drift-in** (offsets are screen px added after the camera). Then a slower convergence to the rest quad (scale 0.85-0.95 → 1 and offsets of up to -140 px decaying toward 0) that lasts until about 418-420. Cards in columns 3-4 slide in from the **left**: their offsets are negative dx (Postgres c4r1 starts at dx -141). After 420 the lower and right cards keep growing slightly (up to 1.04-1.13 at 428) as the push-in starts. Use the TA2 numbers directly: interpolate linearly between the listed frames.
4. The order and first-visible frames are DB2 387, GDrive 388, MySQL 389, Postgres(c4r1) 391, Elastic 394, BigQuery 397, DB2(c4r2) 398, Postgres(c1r3) 401, Jira 403, S3 406, MariaDB(c4r3) 408, MariaDB(c1r4) 409, Search 411, Create DOC 412, Elastic(c4r4) 414. A new card appears every 1-3 frames.

Mosaic in Remotion: render each card as SVG/HTML and wrap it in an SVG filter that pixelates, for example:
```html
<filter id="px16" x="0" y="0" width="1" height="1">
  <feFlood x="8" y="8" width="1" height="1"/><feComposite width="16" height="16"/>
  <feTile result="t"/><feComposite in="SourceGraphic" in2="t" operator="in"/>
  <feMorphology operator="dilate" radius="8"/></filter>
```
Use 16/8/4 px variants, applied in screen space (after the card's quad warp). Alternatively, draw the card into a `<canvas>` at 1/16 size and upscale it with `imageSmoothingEnabled=false`.

### 3.5 The purple "Send To" card
* **Entrance 387-393 (screen bbox measured).** The **right edge stays at x ≈ 1261-1270** while the card grows leftward and vertically. This is a scale-up anchored at the right-middle (about (1268,488)), with a strong **horizontal motion blur** at the start. Horizontal edge spread (10-90 %) is 30 px at 387, 24 at 388, 16.5 at 389, 12 at 390, 7.5 at 391, 4.5 at 392 and 3 (sharp) from 393:

| frame | x0-x1 | y0-y1 | w x h |
|---|---|---|---|
| 387 | 1056-1261 | 414-534 | 205x120 |
| 388 | 1002-1264 | 405-552 | 262x147 |
| 389 | 958-1267 | 399-564 | 309x165 |
| 390 | 924-1269 | 396-574 | 345x178 |
| 391 | 894-1270 | 393-582 | 376x189 |
| 392 | 870-1270 | 391-588 | 400x196 |
| 393 | 850-1270 | 391-594 | 420x202 |
| 394 | 834-1269 | 391-597 | 435x205 |
| 396 | 808-1267 | 393-604 | 459x211 |
| 398 | 792-1264 | 394-609 | 472x214 |
| 400 | 780-1263 | 397-613 | 483x216 |

  From 393 on, use the TA2 "SendTo" row (relative to the camera): scale 0.895 → 1.0 and offset (+159,-15) → 0, an expo-out reaching rest at about 415. At 420 it equals the rest quad. The card contents (icon, title, gear, divider) are present from 387 and are just blurred.
* **Typing of the subtitle** (frame = first frame the string is fully visible). The text is left-aligned at x 808 (rest layout) and types at about 0.9 characters per frame, with holds at word ends:

| frame | text | frame | text |
|---|---|---|---|
| 389-390 | `Ba` | 404 | `Based on the R` |
| 391 | `Bas` | 405 | `Based on the RA` |
| 392 | `Base` | 406-408 | `Based on the RAG` |
| 393-394 | `Based` | 409 | `Based on the RAG a` |
| 395-396 | `Based o` | 410 | `Based on the RAG an` |
| 397-398 | `Based on` | 411 | `Based on the RAG ana` |
| 399 | `Based on t` | 412-413 | `Based on the RAG anal` |
| 400 | `Based on th` | 414 | `Based on the RAG analy` |
| 401-403 | `Based on the` | 415 | `Based on the RAG analy.` |
|  |  | 416 | `Based on the RAG analy..` |
|  |  | 417-428 | `Based on the RAG analy...` |

  No cursor caret is visible.
* **Exit / de-rez 421-428.** Relative to the camera, the card **shrinks**: rel scale 0.994 (421), 0.987, 0.975, 0.958, 0.931, 0.907 (426). Its bbox measures 496x208 at 427 and 472x192 at 428, about 0.87x, centre (1012,520). It is **mosaicked with growing blocks**: about 4 px at 424-425, the lower half 7.5 px and the upper 4.5 px at 426, and 7.5 px over the whole card at 427-428. By 427-428 the texts and icon read as pixel blocks. In shot B the slot is taken over by a white card (the reference's "Box") that re-rezzes the same way in reverse (§4.3).

### 3.6 Motion blur in shot A
Only the Send To entrance (387-392, see above) and the card mosaic edges are blurred. The camera moves too slowly (< 8 px/frame) for visible blur.

---

## 4. SHOT B (429-529): the 3D wall of cards and the app panel

### 4.1 Rendering model (how to rebuild it exactly)
Shot B is a true 3D scene with two planes, filmed by an orbiting camera:
1. the **wall**: the same card grid as shot A, now with 5 rows;
2. the **app panel**: a big rounded slab with dark sides, parallel to the wall (within 1°) and about 1290 px in front of it.

The camera's focal length was self-calibrated as **f = 3291 px** (CSS `perspective: 3291px`, perspective-origin at the frame centre). The fit used plane rigidity over 70 frames plus equal card sizes. The rms consistency was 0.7 %. The vertical FOV is about 18.6°.

**Primary method (exact):** render each plane as a flat DOM layer in its own local pixel coordinates. Map it to the screen every frame with a `matrix3d` built from the 4 screen corners in tables TB1 (wall) and TB2 (panel). This reproduces the measured image-plane motion with sub-pixel accuracy: no 3D fitting error, and the perspective foreshortening is exact. Put the layer at left 0 and top 0 of the 1920x1080 stage with `transform-origin: 0 0`, and give its parent **no** CSS perspective:
```ts
// (0,0)-(w,h) local rect -> screen quad [TL,TR,BR,BL] (1080p px)
export function quadToMatrix3d(w: number, h: number, q: [number, number][]) {
  const [[x0, y0], [x1, y1], [x2, y2], [x3, y3]] = q;
  const dx1 = x1 - x2, dx2 = x3 - x2, dx3 = x0 - x1 + x2 - x3;
  const dy1 = y1 - y2, dy2 = y3 - y2, dy3 = y0 - y1 + y2 - y3;
  const den = dx1 * dy2 - dx2 * dy1;
  const g = (dx3 * dy2 - dx2 * dy3) / den, h2 = (dx1 * dy3 - dx3 * dy1) / den;
  const a = x1 - x0 + g * x1, b = x3 - x0 + h2 * x3, d = y1 - y0 + g * y1, e = y3 - y0 + h2 * y3;
  return `matrix3d(${a / w},${d / w},0,${g / w},${b / h},${e / h},0,${h2 / h},0,0,1,0,${x0},${y0},0,1)`;
}
```
This formula was checked numerically against the measured homographies (identical to 0.01 px). Interpolate the quad corners linearly per frame, or call it directly with the per-frame rows. The homography's w stays positive (≥ 0.44) over the drawn regions, so there are no inversion artifacts. Local content may extend outside the reference rectangle, for example the dashed lines reach local x = -620; the same matrix applies to it.

**Alternative (approximate):** a CSS 3D scene. The wall is a div with `transform: translate3d(tx,ty,tz) rotateZ(rz) rotateY(ry) rotateX(rx)` (in that order, origin at the wall's local (0,0), parent `perspective: 3291px; perspective-origin: 960px 540px`), using the per-frame pose columns of TB1. Positive tz moves toward the viewer. The panel is a child of the wall with `translate3d(relx, rely, relz) rotateX(1.01deg) rotateY(0.69deg) rotateZ(0.93deg)`, from TB2's rel columns. The rigid fit leaves errors of rms 1.7-7.7 px and up to 21 px at the far corners, so use this route only if you need true 3D (for example to give the panel real thickness).

### 4.2 Wall layout (wall-local px, 1 local px ≈ 1 screen px of the shot A board at 420)
* **Grid**: card **500x170**, columns at x = **0, 593, 1186, 1779**, rows at y = **0, 246, 492, 738, 984**. The reference rectangle used by TB1 is (0,0)-(2279,1154).
* Each card is rotated **-0.45°** (CCW) about its centre on average. Per-card deviations from the exact grid are ≤ 3 px and ≤ 0.9°, so the exact grid is fine.
* **Cards** (reference texts), row by row:
  * r1: DB2 Database · Google Drive - · MySQL · Postgres
  * r2: Elastic · **Box** ("Write Box"; the old Send To slot) · BigQuery · DB2 Database
  * r3: Postgres · Jira · S3 Read File · MariaDB
  * r4: MariaDB · Search for · Create DOC · Elastic
  * r5: only c3 ("Create PowerPoint / Create local PPT"). c4r5 is empty; c1r5 and c2r5 are always hidden behind the panel.
* Card design is as in §3.2, in local px (title about 37 px, subtitle about 34 px, icon 50 px, gear 31 px, radius 15, lavender shadow).
* **Connector arrows** sit in each column gap at the card's vertical centre: from local x = card right + 10 to the next card left − 10, y = row + 84, about 3 px stroke, blue `#2F6FE0`, with a small arrowhead. All gaps have them. The two arrows touching the Box card draw on during B1 (below).
* **Box card re-rez 429-436** (in local px). It grows anchored at its **right-middle (1093,331)**, with scale 0.80 (429), 0.87, 0.92, 0.97, 0.98, 0.99, 1.00 (435). Its mosaic blocks are 8 local px (about 11-12 screen px) through 434 and 3 local px at 435, and it is sharp from 436. The arrow into it (c1r2 → c2r2) draws on left to right over 435-438. The arrow out of it (c2r2 → c3r2) appears at 440.

### 4.3 Wall motion (TB1), in words
| phase | frames | rotY | rotX | rotZ | depth tz (CSS, + = toward viewer) | character |
|---|---|---|---|---|---|---|
| B1 | 429-444 | +19.4 → +10.8 | +1.3 → -1.0 | 0.2 → -0.3 | 490 → 925 (442) → 917 | approach with expo-out (+88/frame at 430 → 0 at 442), slow turn toward frontal, accelerating (-0.4°/frame → -1.2°/frame) |
| B2 | 444-462 | +10.8 → -33.3 | -1.0 → -21 | -0.3 → +11 | 917 → -776 | **swing**: rotY speed peaks at **-4.3°/frame at 450-451**; pull-back peaks at about -140 tz/frame at 454-455 |
| B3 | 462-505 | -33.3 → -43.3 | -21 → -28.1 | +11 → +19.9 | -776 → -1733 | decelerating orbit (rotY -0.8°/frame at 463, -0.3 at 472, -0.1 at 490); expo-out |
| B4 | 505-529 | -43.3 → -56.4 | -28.1 → -38.9 | +19.9 → +33.9 | -1733 → -1919 | **accelerating orbit (ease-in)**: rotY -0.1 → -0.5 (519) → -1.0 (525) → -2.1°/frame (529) |

On screen the B4 exit reads as a rotation that speeds up while the content drifts up-left. Wall screen velocity at (1500,300) is (-2.7,-1.0) px/frame at 516, (-6.0,-1.9) at 521, (-9.8,-3.0) at 524, (-16.9,-4.9) at 526 and (-20.8,-5.1) at 527-528. The panel follows the same orbit.

### 4.4 The app panel (panel-local px, size **1540x1000**, aspect 1.54)
The panel was rectified to a clean front view (orthogonality check 89.2°). Front face: background `#F9F9F9` (chat area) and `#FDFCFD` (sidebar). TL corner radius about 24 local px, TR about 30. It reads as a **slab**: its **top and right sides are near-black `#0F0D10`** (seen at 500 as a 7.6 px band along the top edge and 14.4 px along the right edge, with a rounded TR corner). The left and bottom edges show no side. Draw this as a dark border on the front face: about 8 local px top, 16 local px right, rounded at TR. The panel has no drop shadow on the wall.

Layout map (local px, x right, y down), measured at frame 500:
* **Left sidebar** x 0-100: logo tile "S" (purple, about 34 px) at (40,45). Line icons (#333, about 24 px) at x 40, y = 120, 187, 253, 320, 387, 453. Settings icon at (50,887), round avatar r 25 at (47,953).
* **Header** (y 25-70): title **"Chatbot"** Inter 700 (bbox x 109-232, y 38-60, cap 22 → about 30 px font). Sun/moon toggles at (587,47) and (640,47). Search (870,47) and gear (920,47) in circles r 22. **"Download App"** outline pill x 952-1123, y 27-67.
* **Chat column** x 200-1000:
  * "S" bot avatar at (207,152), with the line "Hello! I'm your personal AI Assistant Slothpilot." (x 247-600, about 16 px, `#333`) and time "10:25".
  * **Voice bubble**: purple `#513AE0` rounded rect (r 18), x 700-995, y 188-272. White play circle r 15 at (727,215), white waveform x 755-975 y 200-230, "02:12" at (733,250), "11:25 ✓✓" at (950,250).
  * User avatar r 20 at (1025,210).
  * Long bot message: "S" at (207,307), paragraph and numbered list, x 247-810, y 300-570, about 15 px text, `#333`; time "12:25" at (790,583).
  * **Link card**: purple `#4630BE` (shaded `#513AE0`), x 560-995, y 618-735 (r 14). "External Link Title" white 600, "External link description" white 60 %, divider, "https://www.externallink.com" white, link icon at (965,647). User avatar at (1025,665).
  * Third bot message "S" at (207,767), text x 253-660, y 770-860, time (640,880). Action icons row at y 920, x 247-395.
* **Right column** x 1150-1540 (same off-white):
  * Avatar r 27 at (1200,47); **"X_AE_A-13"** 600 about 18 px (x 1243-1336, y 29-42); "205 Tokens Left" grey (y 50-62); chevron at (1490,47).
  * Tabs "Main" (x 1168-1210, with a purple underline x 1150-1220 at y 132), "Settings" (1243-1315), "Payment" (1347-1420), then a divider at y 135.
  * **"Chatbot GPT"** bold about 18 px (x 1178-1295, y 186-199). Items with icons: "Chatbot" (y 245), "Designer" (304), **"Vacation Planner"** (363, selected: band `#ECEEF7` x 1153-1540, y 335-390, plus a purple left bar `#594D95`, 4 px), "Cooking Assistant" (423).
  * **"Recent Chats"** bold (y 515) with a chevron; "How to get fit without doing an…" (565), "Hacking FBI S…" (622, with a left bar).

### 4.5 Panel motion (TB2), in words
* **455-465: flies in from in front of the camera.** At 455 only a blurred grey edge shows in the bottom-left corner. The panel is about 2240 px in front of the wall plane and so very close to the lens. Its quads are huge (TB2), and it moves up and back fast. The top-edge line on screen at x = 300 is at y 952 (456), 862, 792, 734, 684, 639, 602, 567 (463), 536, 507 (465): steps of -90, -70, -58, -50, -45, -37, -35, -31, -29 px. Relative to the wall it decelerates: z_rel ≈ 1285 + 873·0.9165^(n−456) and x_rel ≈ 960 − 283·0.9397^(n−456).
* **Defocus blur** (Gaussian σ, 1080p px, fitted against a sharp warped copy): ≥ 20 at 455-458 (about 22-27), 12 at 459, 9 at 460, 6 at 461, 4.5 at 462, 2.2 at 463, 1.5 at 464, then sharp from 465. This is lens defocus because the panel is near the camera; the bezel band widens to 22-27 px instead of 15.
* **465-505:** settles (expo-out) while orbiting with the wall.
* **505-529:** keeps orbiting with the wall. The relative offset drifts slightly (x_rel +60, z_rel -250 by 529), visible as the panel sliding right relative to the cards.
* 455-462 are model-based (the top-edge line was measured; position along the edge comes from an exponential fit checked against the blurred content, ±10-15 px). 463-529 are measured homographies (sub-pixel), and 529 was matched from 528 (63 inliers, ±3 px).

### 4.6 Dashed "data-flow" lines (B2-B4)
Four dashed lines run from source cards toward the panel. Each grows from its source like a "draw-on" and carries a **filled triangular arrowhead** at its leading end (about 30x20 px on screen at 500, pointing along the line). Measured style: core colour `#685CF1` (anti-aliased `#6C67D6`), stroke about 5 px. The dashes are **constant in screen space: dash ≈ 20 px, gap ≈ 20 px** (measured 21/19.5 at 500 on two lines). So draw them as a screen-space SVG overlay: project the line's endpoints with the wall matrix and stroke in screen px. Geometry in **wall-local px**, with s = distance along the line from its start:

| line | start (local) | unit direction | appears | head position s (local px) by frame |
|---|---|---|---|---|
| L1 | (-10,136) at DB2 c1r1, left edge | (-0.967, 0.256) → toward the panel's top-left corner | 458 | 458: 98, 460: 299, 462: 378, 464: 448, 466: 501, 468: 558, 470: about 610, then static (the head disappears behind the panel's top-left corner) |
| L2 | (1340,126) at MySQL c3r1 subtitle | (-0.929, 0.369) | 458 | 458: 39, 460: 107, 462: 168, 464: 229, 466: 283, 468: 324, 470: 371, 474: 447, 478: 499, 482: 550, 486: 579, 490: 612, 494: 626, 498: 649, 502: 663, 506: 670, 510: 686, 514: 709 |
| L3 | (1880,437) at DB2 c4r2 bottom-left | (-0.844, 0.536) | 471 | 472: 68, 474: 140, 476: 180, 478: 219, 482: 364, 486: 423, 490: 470, 494: 504, 498: 518, 502: 542, 506: 562, 510: 579, 514: 601 |
| L4 | (1845,908) at Elastic c4r4 bottom | (-0.769, 0.639) | 462 (a stub of about 50 px until 476) | 476: 92, 480: 139, 484: 170, 488: 210, 490: 380, 494: 455, 498: 519, 502: 540, 506: 590, 510: 665, 514: 701, 518: 767 |

* The tail stays at s ≈ 0 (attached to the card). The line is drawn from s = 0 to the head. The head speed is an expo-out (L2: about 30 px/frame at 458-466, 13 at 478, 4 at 500).
* During 461-480, L2 shows a **fainter, thinner dashed continuation ahead of its head** down to about s ≈ 1100 (toward the panel's top edge). Treat it as the target path at about 50 % opacity.
* After 514 the heads keep moving with the motion blur. Hold the last values plus the blur.
* The lines are not exactly on the wall plane: they rise toward the panel. Wall-plane drawing is within about 15 px of the reference at 470-515, and the head positions above are measured in wall-local projection.

### 4.7 Exit (520-529) and motion blur
* The B4 ease-in orbit (§4.3) gives **horizontal motion blur** along the motion direction (roughly the -x direction, tilted about 12° upward): no visible blur up to 524, about 6 px at 525, 12 px at 526-527, 14-18 px at 528 and **about 23 px at 529** (1080p smear length). That is about 0.6-0.9 of the per-frame displacement. During the 444-462 swing the right side of the frame moves up to 45 px/frame with **no** blur, so this exit blur is a deliberate directional-blur transition into the cut, not shutter blur. Ramp a horizontal blur (CSS `filter` cannot do directional blur, so use an SVG `feGaussianBlur stdDeviation="σx 0"` with σx ≈ smear/2.5, or several offset copies) over 525-529. Sharpness (Laplacian variance) falls 943 (524) → 734 → 408 → 182 → 148 → 102 (529).
* 529 is the last frame. Hard cut to 530 (seg5).

---

## 5. Camera summary
| frames | camera |
|---|---|
| 384-386 | (seg3 pill shot) |
| 387-412 | shot A board settles: rotation +3.0° → +0.2° and pan tx -110 → -5 (expo-out, half-life about 5 f); scale about 0.94-0.96 |
| 412-428 | push-in, scale 0.959 → 1.084 with an ease-in, about the centre (962,540) |
| 429-444 | new framing: the wall approaches with an expo-out and turns toward frontal |
| 444-462 | fast 3D swing and pull-back (peak 4.3°/frame) |
| 462-505 | decelerating orbit (expo-out) |
| 505-529 | accelerating orbit (ease-in) into the cut |

## 6. Motion blur summary
* 384-386: the receding pill blurs horizontally, 6 → 12 → 18 px.
* 387-392: the Send To card's horizontal smear is 30, 24, 16.5, 12, 7.5, 4.5 px.
* 455-464: the panel has **defocus** σ ≥ 20 → 1.5 px (§4.5).
* 525-529: the whole picture has horizontal motion blur, 6 → 23 px.
* There is no blur anywhere else. Even during the 444-462 swing, when the screen centre moves up to 28 px/frame and the right edge up to 45 px/frame (450-455), the frames stay sharp (Laplacian variance 500-800). Do **not** add motion blur to the swing.

## 7. Layering (back → front)
1. Pastel background (screen-fixed).
2. Card shadows, then cards, then connector arrows (one plane: shot A, then the wall in B).
3. The Send To card (shot A; above the white cards, with its own purple shadow).
4. Dashed data-flow lines (B; drawn above the wall cards, below the panel).
5. App panel (B; front-most, occludes the wall's left columns).
6. Motion-blur and mosaic effects apply per layer as above.

## 8. Sound sync (from spec/audio.md; frames where the picture events land)
| frame(s) | sound | picture |
|---|---|---|
| 381-391 (peak about 387) | **sub drop** (808 glide to about 27-30 Hz after a 60 ms HF gap at 12.72-12.78 s) | the pill recedes (381-386) → **hard cut 387** on the bar-8 downbeat (f387 = 12.897 s) |
| 384-399 | about 10 soft **bubble pops** (2 kHz tonal + 10-12 kHz blips), -21 dB | the cards pop in as mosaics (387-418). Place pops on the first-visible frames: 387, 388, 389, 391, 394, 397, 398 (and continue softly: 401, 403, 406, 408, 409, 411, 412, 414) |
| 389-417 | (no distinct typing sound; the beat carries it) | Send To subtitle types |
| 399, 411, 423 | beats 2-4 of bar 8 (hats and clap) | - |
| 427-430.5 (14.23-14.35 s) | **short bright swish** (2-12 kHz, +10 dB band) | Send To de-rez peak → **hard cut 429** (the step-14 pickup of bar 8) |
| 435 | bar-9 downbeat | Box card sharp (436), arrows draw on |
| 447-459 | beats of bar 9 | the 3D swing (444-462) peaks at 450-451; the panel enters at 455 |
| 483, 495, 507, 519 | bar 10 beats | dashed lines growing |
| 501, 506 (16.70, 16.87 s) | **two small pops** (1-2 kHz body + HF), subtle | the L4 arrowhead / dashes extending (L4 jumps 488 → 490 → 494); a soft "data arrives" tick |
| 524-534, swell peak 530.4 (17.68 s) | **sub drop** (808 glide to about 27 Hz, +8-10 dB sub) | accelerating orbit and blur → **hard cut 530** to "Publish" (bar 11 = the "Break" at f531) |

---

## 9. WKC ADAPTATION (same frames, quads, sizes, motion, mosaic timing and cuts; only content and colours change)

**The story of this segment** (script 12.5-18 s, "visual demonstration, no headline"): the brief from seg3's pill **turns into a storyboard**. In shot A, storyboard frames pop onto a board and a highlighted WKC-blue "Storyboard" card types out what is happening. Shot B swings the board into 3D: the storyboard wall, with **WKC Studio**, an animation tool showing a polished composition preview and a keyframe timeline, flying in front of it. Dashed **motion paths** carry the frames from the board into the timeline. The orbit then accelerates into the "Export"/"Publish" cut (seg5).

### 9.1 Global re-colour map
| element | reference | WKC |
|---|---|---|
| Pastel background | pink / aqua / lavender mesh | WKC grids in §2 (periwinkle / aqua / ice blue). Same positions and drift |
| White cards | `#FDFDFB`, lavender shadow `#C1C5F5` | `#FFFFFF`, shadow rgba(63,140,232,0.22) (core `#C9DDF6`), same offset and blur; slab lip `#E6F0FD` |
| Card title / subtitle | `#030303` Inter 600 / `#A8A6A7` Inter 400 | ink `#050F19` Inter 600 (no negative tracking in UI) / muted `#838A94` Inter 400 |
| Card divider | `#DBDBDB` | `#E3E8EF` |
| Gear icon | `#111` outline | small **keyframe diamond** outline icon, `#575E68`, same box (31x30) |
| Connector arrows | `#2F6FE0` | `#3F8CE8` |
| Send To card fill / shadow | `#543FDD` / purple glow | **`#3F8CE8`** / rgba(63,140,232,0.30) glow, same size |
| Send To text | white / white 45 % | white / `#E6F0FD` at 75 % (reads about `#B5D3F7`) |
| Dashed lines + arrowheads | `#685CF1` | `#3F8CE8` core, with a faint `#8DC0FF` 2 px halo at 40 % |
| App panel face / sidebar | `#F9F9F9` / `#FDFCFD` | page `#F7F7F8` / `#FFFFFF` |
| Panel slab sides (bezel) | `#0F0D10` | ink `#050F19` |
| Panel purple bubbles | `#513AE0`, `#4630BE` | `#3F8CE8`, `#1266C9` |
| Selected list item | `#ECEEF7` + bar `#594D95` | `#E6F0FD` + bar `#3F8CE8` |
| Tab underline | purple | `#1266C9` |

### 9.2 Shot A (387-428): "the brief becomes storyboard frames"
* **Cards = storyboard frames.** Keep each card's quad, entrance, mosaic schedule and arrows exactly as in §3. The content is redesigned as a storyboard frame card:
  * **Left icon (50x50 at +39,+31)**: a mini **frame thumbnail**, a radius-10 tile in `#E6F0FD` with a 2 px `#3F8CE8` line glyph drawn for that scene (play triangle, cursor arrow, phone outline, chart bars, logo mark, speech wave...).
  * **Title**: the scene name.
  * **Subtitle**: a one-line direction note.
  * **Right**: a keyframe diamond icon.
* Texts by slot (A shows rows 1-4; B adds row 5):

| slot | title | subtitle |
|---|---|---|
| c1r1 | 01 · Hook | Logo lands on the beat |
| c2r1 | 02 · Problem | Show the pain point |
| c3r1 | 03 · Product | Hero UI, slow push-in |
| c4r1 | 04 · Feature | Callout with a cursor |
| c1r2 | 05 · Benefit | Before and after split |
| c2r2 (B only) | 06 · Detail | Macro on the interface |
| c3r2 | 07 · Transition | Match cut to mobile |
| c4r2 | 08 · Mobile | The 9:16 version |
| c1r3 | 09 · Kinetic type | One idea per line |
| c2r3 | 10 · Sound | Whoosh on every cut |
| c3r3 | 11 · Brand | WKC blue, Inter Tight |
| c4r3 | 12 · Outro | Logo and call to action |
| c1r4 | Script | Read from the brief |
| c2r4 | Voice-over | Timed to the frame |
| c3r4 | Styleframes | Polish every composition |
| c4r4 | Render | 16:9 · 1:1 · 9:16 |
| c3r5 (B only) | Export | For every platform |

* **The highlighted card** (Send To slot c2r2, 541x225 at rest):
  * fill `#3F8CE8`;
  * the 62 px white icon is the **WKC monogram** (`/img/wkc-mark.svg`, white) instead of the brain;
  * title **"Storyboard"** (white, Inter 600, about 40 px; it is wider than "Send To", so keep the left edge at x 888 and the gear/diamond icon at 1182-1219);
  * the subtitle types **"From brief to storyboard..."** (27 characters). Scale the reference's per-frame character count by 24/22 so the words land on the same frames. Visible text per frame:

    | frames | text |
    |---|---|
    | 389-390 | `Fr` |
    | 391 | `Fro` |
    | 392 | `From` |
    | 393-394 | `From␣` |
    | 395-396 | `From␣bri` |
    | 397-398 | `From␣brie` |
    | 399 | `From␣brief␣` |
    | 400 | `From␣brief␣t` |
    | 401-403 | `From␣brief␣to` |
    | 404 | `From␣brief␣to␣s` |
    | 405 | `From␣brief␣to␣st` |
    | 406-408 | `From␣brief␣to␣sto` |
    | 409 | `From␣brief␣to␣storyb` |
    | 410 | `From␣brief␣to␣storybo` |
    | 411 | `From␣brief␣to␣storyboa` |
    | 412-413 | `From␣brief␣to␣storyboar` |
    | 414 | `From␣brief␣to␣storyboard` |
    | 415 | `From␣brief␣to␣storyboard.` |
    | 416 | `From␣brief␣to␣storyboard..` |
    | 417 | `From␣brief␣to␣storyboard...` |
    | 418-428 | `From brief to storyboard...` (`␣` = space) |

* **Entrance and exit** exactly as the reference: the right-anchored grow with 30 → 3 px horizontal smear over 387-393, the drift-in, then the mosaic de-rez with shrink at 424-428 (4 → 7.5 px blocks).
* Background: WKC pastel grid at 387, 405 and 428 (§2).

### 9.3 Shot B (429-529): "storyboard wall + WKC Studio"
* **Wall**: the same storyboard cards (table above) on the same grid and plane motion (TB1). In c2r2 the "06 · Detail" card re-rezzes at 429-436 as in §4.2, and its two arrows draw on at 435-440. Row 5 has only c3 ("Export / For every platform").
* **App panel → "WKC Studio"** (same 1540x1000 local layout, same quads TB2, same defocus):
  * **Sidebar** (x 0-100): the logo tile at (40,45) is the **WKC monogram** in white on a `#3F8CE8` radius-10 tile (34 px). Tool icons in `#575E68`, 24 px: select arrow (y 120), layers (187), pen/bezier (253), text "T" (320), camera (387), sparkle (453). Settings at (50,887). The avatar circle r 25 at (47,953) uses **Raphael Wind**'s portrait (`/img/raphael-400.webp`).
  * **Header**: "Chatbot" becomes **"Studio"** (Inter Tight 800, -0.05em, `#050F19`, same cap height 22 and left x 109). Sun/moon become **play ▶ / pause ❚❚** icons. Search/gear become **zoom** (magnifier) and **settings**. The "Download App" pill becomes a **"Preview"** pill (same box 952-1123 x 27-67, 1.5 px border `#D9E2EC`, eye icon, text `#050F19`). Do not use "Export" here: that word belongs to seg5.
  * **Chat column becomes the composition and timeline**:
    * y 140-165: the WKC monogram mini-avatar (20 px) at (207,152) with "Scene 03 · Product   00:00:06:12" in `#838A94` (replaces the greeting line).
    * **Voice bubble** (700-995 x 188-272) becomes a `#3F8CE8` **voice-over clip** with the same play circle, white waveform, "VO" label at (733,250) and "00:12" at (950,250). The user avatar r 20 at (1025,210) is **Karl van Kessel** (`/img/karl-400.webp`).
    * **Long message block** (247-810 x 300-570) becomes the **composition preview**: a 16:9 frame 480x270 at x 247-727, y 300-570 (radius 10, 1 px `#D9E2EC`) playing a still or a short loop of a real WKC project. Use `clips/wicflow-16x9.mp4`, whose light-blue isometric look suits the palette; `kb-saas-16x9.mp4` also works. Add thin title-safe guides (`#3F8CE8` at 25 %). Put "1920 × 1080 · 30 fps" in `#838A94` at (790,583) where "12:25" was. Optionally add a narrow vertical opacity slider at x 760-790.
    * **Link card** (560-995 x 618-735) becomes a `#1266C9` **keyframe block**: "Position · Scale · Opacity" in white 600, a sub-line "ease cubic-bezier(.22,1,.36,1)" in white 60 %, a white 1 px divider, then a mini track with 5 white keyframe diamonds (10 px) at x 600, 680, 760, 860 and 950, y 715. The link icon becomes a diamond icon at (965,647). The avatar at (1025,665) is Karl again.
    * **Third message and icons** (247-660 x 760-940) become **three timeline layer rows** at y 780, 830 and 880. Each row has a label at x 253 ("Logo", "Headline", "Cursor"; Inter 500, 15 px, `#575E68`), a `#E6F0FD` bar from x 360 to 990 (height 18, radius 9), and `#3F8CE8` keyframe diamonds. A **playhead** (2 px `#3F8CE8` line with a 10 px triangle head) runs at x 520, from y 760 to 940. Action icons at y 920 become small transport icons (⏮ ▶ ⏭) in `#838A94`.
  * **Right column becomes the project panel**:
    * Avatar (1200,47) r 27 is **Raphael Wind**'s portrait; name **"Raphael Wind"** (Inter 600, 18 px), sub-line **"WKConversions"** in `#838A94`; chevron unchanged.
    * Tabs **"Scenes" · "Layers" · "Render"**, with a `#1266C9` underline under "Scenes".
    * "Chatbot GPT" becomes **"Storyboard"**, with items "01 · Hook", "02 · Problem", **"03 · Product"** (selected: band `#E6F0FD`, left bar `#3F8CE8`) and "04 · Feature", each with a tiny frame glyph icon.
    * "Recent Chats" becomes **"Recent projects"**: "Wicflow · AI at work" (565) and "VoxFlow launch film" (622, with the left bar). These are real WKC clients from clips.json, and no other names may be used.
  * **Slab sides**: ink `#050F19` (top 8 / right 16 local px, rounded TR).
* **Dashed lines become motion paths**: same geometry, timing and arrowheads (§4.6), coloured `#3F8CE8`. Add a 10 px hollow keyframe diamond at each tail (s = 0) to make them read as motion paths. Keep the screen-space 20/20 dash.
* **Exit**: identical orbit, ease-in and 6 → 23 px horizontal blur into the hard cut at 530 (seg5's WKC "Export"/"Publish" button).

### 9.4 Sound for the WKC build
Keep every sync point of §8:
* sub-drop swell peaking on the 387 cut;
* soft pops on each card's first-visible frame (387-414);
* bright swish into the 429 cut;
* two soft ticks at 501/506 (motion-path arrivals);
* the sub drop peaking at the 530 cut.

---

## 10. Self-check performed (measured accuracy)
* **Shot A**: per-card SIFT similarity tracks against frame 420 (6-150 inliers per card per frame). The camera is the mean of the DB2 and Elastic tracks (inlier error 0.6-0.9 px). TA1 ∘ TA2 reproduces each tracked card centre by construction. Mosaic-phase values come from bounding boxes (±0.05 scale).
* **Shot B wall**: homographies to frames 440 and 500, plus a consecutive-frame chain (300-1000 inliers per frame). Ideal grid corners projected with TB1 against detected card corners: rms 3.5-3.9 px at 470/500/520 and 8-10 px at 432-448. The B1 card quads are less sharply detected, and individual cards deviate ≤ 3 local px. The overlay sheet `wkc-seg4c/chkB.jpg` shows the grid and panel outline on frames 430, 445, 452, 458, 470, 490, 510, 525 and 529, all on target.
* **Panel**: homographies 463-529 (rms ≤ 0.5 px on the fitted grid; 529 is ±3 px). 455-462 are modelled from the measured top-edge line (≤ 1.6 px line error) plus an exponential along-edge position (±10-15 px).
* **Focal length** 3291 px: joint fit of rigidity and equal card size; card sizes agree to 0.9 % and right angles to about 1°.
* **Not measured**: the exact hidden cards behind the panel (c1r5, c2r5); the panel's bottom-right region (never on screen); the precise dash phase animation (the dashes look static along the line while the head advances).

---

## Appendix: data tables


### TA1 Shot A camera (similarity about the frame centre (960,540); maps the frame-420 layout to frame n)

| frame | scale | rot (deg, + = clockwise) | tx | ty |
|---|---|---|---|---|
| 387 | 0.940 | +3.00 | -110 | -20 | (est.)
| 388 | 0.940 | +3.00 | -110 | -20 | (est.)
| 389 | 0.940 | +3.00 | -110 | -20 | (est.)
| 390 | 0.940 | +3.00 | -110 | -20 | (est.)
| 391 | 0.940 | +3.00 | -110 | -20 | (est.)
| 392 | 0.941 | +2.85 | -104 | -14 | (est.)
| 393 | 0.9430 | +2.70 | -97.5 | -8.6 |
| 394 | 0.9510 | +1.98 | -80.6 | -9.7 |
| 395 | 0.9472 | +2.50 | -76.6 | -1.4 |
| 396 | 0.9570 | +1.77 | -59.5 | -2.5 |
| 397 | 0.9545 | +1.85 | -53.6 | +1.1 |
| 398 | 0.9520 | +1.66 | -46.9 | +1.4 |
| 399 | 0.9555 | +1.17 | -36.7 | +0.1 |
| 400 | 0.9509 | +1.23 | -34.1 | +1.7 |
| 401 | 0.9520 | +0.97 | -27.4 | +1.3 |
| 402 | 0.9501 | +0.93 | -24.0 | +2.1 |
| 403 | 0.9474 | +0.81 | -21.4 | +1.5 |
| 404 | 0.9471 | +0.67 | -17.9 | +1.2 |
| 405 | 0.9457 | +0.59 | -16.7 | -0.1 |
| 406 | 0.9473 | +0.44 | -13.9 | -1.0 |
| 407 | 0.9480 | +0.35 | -11.9 | -1.1 |
| 408 | 0.9506 | +0.32 | -9.4 | -0.6 |
| 409 | 0.9519 | +0.33 | -8.1 | +0.2 |
| 410 | 0.9570 | +0.18 | -4.4 | -0.3 |
| 411 | 0.9553 | +0.21 | -6.1 | -0.1 |
| 412 | 0.9592 | +0.22 | -4.6 | +0.4 |
| 413 | 0.9622 | +0.18 | -4.0 | +0.3 |
| 414 | 0.9645 | +0.11 | -4.1 | -0.3 |
| 415 | 0.9692 | +0.09 | -3.1 | -0.2 |
| 416 | 0.9751 | +0.07 | -1.8 | -0.1 |
| 417 | 0.9803 | +0.10 | -1.5 | +0.5 |
| 418 | 0.9849 | +0.01 | -1.6 | -0.5 |
| 419 | 0.9926 | +0.03 | -0.6 | +0.1 |
| 420 | 1.0000 | +0.00 | -0.0 | -0.0 |
| 421 | 1.0084 | +0.02 | +0.8 | +0.4 |
| 422 | 1.0152 | -0.06 | +0.1 | -0.5 |
| 423 | 1.0252 | -0.05 | +1.0 | -0.2 |
| 424 | 1.0350 | -0.08 | +1.2 | -0.4 |
| 425 | 1.0472 | +0.04 | +2.0 | +1.2 |
| 426 | 1.0572 | -0.03 | +1.3 | +0.3 |
| 427 | 1.0703 | -0.06 | +1.9 | -0.0 |
| 428 | 1.0835 | -0.01 | +1.2 | +0.5 |

### TA2 Shot A per-card entrance: `frame:scale,dx,dy` — card quad at frame n = Cam_n( anchor + scale·(Q420 − anchor) ) + (dx, dy): the scale acts about the anchor of §3.1 before the TA1 camera, the offset is in screen px after it; rest = 1,0,0. Mosaic-phase values (before "sharp") are bbox-based / curve-based and less precise (±0.05)

* **DB2** (first visible 387, sharp 393): 387:0.61,-99,-35 388:0.75,-63,-22 389:0.85,-38,-14 390:0.92,-20,-7 391:0.98,-5,-2 392:1.00,+0,+0 393:1.000,+0,+0 394:1.000,+0,+0 395:1.000,+0,+0 396:1.000,+0,+0 397:1.000,+0,+0 398:1.000,+0,+0 399:1.000,+0,+0 400:1.000,+0,+0 402:1.000,+0,+0 404:1.000,+0,+0 406:0.999,+1,+1 408:0.997,+2,+1 410:0.993,+1,+2 412:0.997,+1,+1 414:0.999,+1,+1 416:0.999,+0,+0 418:1.001,+0,+0 420:1.000,+0,+0 422:1.001,+0,-0 424:1.001,-0,-0 426:1.000,-0,-0 428:1.002,-0,-0
* **GDrive** (first visible 388, sharp 394): 388:0.28,-46,+14 389:0.47,-46,+14 390:0.61,-46,+14 391:0.70,-46,+14 392:0.77,-46,+14 393:0.82,-46,+14 394:0.851,-46,+14 395:0.879,-37,+5 396:0.877,-41,+9 397:0.887,-37,+4 398:0.909,-32,+3 399:0.903,-33,+6 400:0.924,-27,+3 402:0.937,-23,+3 404:0.951,-17,+2 406:0.963,-12,+4 408:0.966,-9,+3 410:0.974,-9,+3 412:0.981,-5,+1 414:0.990,-2,+1 416:0.992,-2,+1 418:0.997,-0,+0 420:1.000,-0,+0 422:1.003,+1,+0 424:1.002,+1,-0 426:1.004,+2,-1 428:1.005,+2,-1
* **MySQL** (first visible 389, sharp 397): 389:0.26,-61,-7 390:0.45,-61,-7 391:0.58,-61,-7 392:0.67,-61,-7 393:0.73,-61,-7 394:0.78,-61,-7 395:0.81,-61,-7 396:0.83,-61,-7 397:0.845,-61,-7 398:0.861,-57,-8 399:0.872,-60,-1 400:0.909,-52,-2 401:0.911,-53,+0 402:0.910,-49,-3 403:0.924,-44,-0 404:0.932,-41,+0 406:0.931,-34,+3 408:0.940,-30,+3 410:0.953,-27,+4 412:0.966,-17,+1 414:0.980,-10,+1 416:0.986,-7,+1 418:0.999,-1,+1 420:1.000,+0,-0 422:1.004,+3,+0 424:1.006,+4,+0 426:1.009,+5,-1 428:1.006,+5,-1
* **Postgres4** (first visible 391, sharp 400): 391:0.27,-141,-1 392:0.46,-141,-1 393:0.59,-141,-1 394:0.68,-141,-1 395:0.74,-141,-1 396:0.79,-141,-1 397:0.82,-141,-1 398:0.84,-141,-1 399:0.86,-141,-1 400:0.870,-141,-1 401:0.877,-135,+3 403:0.891,-107,+1 404:0.902,-96,+2 406:0.927,-74,+5 408:0.934,-58,+4 410:0.949,-48,+5 412:0.969,-30,+1 414:0.978,-17,+1 416:0.984,-12,+1 418:0.992,-3,+1 420:1.000,+0,+0 422:1.000,+5,+1 424:1.007,+7,+0 426:1.005,+8,-1 428:1.002,+9,-2
* **Elastic** (first visible 394, sharp 401): 394:0.32,+25,+4 395:0.52,+26,+1 396:0.64,+14,+4 397:0.77,+15,+1 398:0.83,+16,-2 399:0.88,+7,-3 400:0.91,+3,-5 401:0.939,+1,-5 402:0.969,+0,-4 403:0.984,-0,-3 404:0.992,-1,-3 405:1.000,-1,-1 406:1.001,-1,-1 407:1.001,-2,-1 408:1.003,-2,-1 410:1.007,-1,-2 412:1.003,-1,-1 414:1.001,-1,-1 416:1.001,-0,-0 418:0.999,-0,-0 420:1.000,-0,+0 422:0.999,-0,+0 424:0.999,+0,+0 426:1.000,+0,+0 428:0.998,+0,+0
* **BigQuery** (first visible 397, sharp 406): 397:0.28,-53,-5 398:0.47,-53,-5 399:0.60,-53,-5 400:0.70,-53,-5 401:0.76,-53,-5 402:0.81,-53,-5 403:0.84,-53,-5 404:0.87,-53,-5 405:0.88,-53,-5 406:0.893,-53,-5 407:0.911,-47,-3 408:0.931,-42,-4 409:0.934,-38,-4 410:0.938,-37,-3 411:0.956,-27,-3 412:0.963,-24,-3 414:0.975,-14,-1 416:0.987,-9,-1 418:0.995,-3,+0 420:1.000,+0,+0 422:1.005,+4,+1 424:1.007,+5,+1 426:1.009,+6,+0 428:1.008,+7,-0
* **DB2c4** (first visible 398, sharp 403): 398:0.24,-128,-11 399:0.41,-128,-11 400:0.53,-128,-11 401:0.61,-128,-11 402:0.67,-128,-11 403:0.708,-128,-11 404:0.747,-120,-9 405:0.795,-106,-7 406:0.828,-98,-4 407:0.860,-88,-3 408:0.877,-81,-3 409:0.894,-72,-4 410:0.918,-68,-2 412:0.947,-47,-3 414:0.965,-30,-1 416:0.977,-20,-1 418:0.992,-7,+1 420:1.000,+0,+0 422:1.005,+8,+1 424:1.010,+13,+2 426:1.016,+17,+0 428:1.012,+20,-1
* **Postgres1** (first visible 401, sharp 408): 401:0.26,+28,-0 402:0.43,+30,-1 403:0.55,+25,+7 404:0.67,+15,-2 405:0.75,+13,-1 406:0.81,+10,-0 407:0.86,+8,-1 408:0.883,+6,-2 410:0.931,+3,-3 411:0.951,+3,-2 412:0.961,+3,-2 413:0.972,+2,-2 414:0.981,+2,-1 416:0.990,+1,-1 418:0.997,+0,+0 420:1.000,+0,-0 422:1.004,-0,+1 424:1.005,-1,+1 426:1.005,-0,+1 428:1.005,-0,+1
* **Jira** (first visible 403, sharp 410): 403:0.17,-118,-31 404:0.31,-106,-23 405:0.38,-92,-25 406:0.50,-87,-17 407:0.60,-75,-21 408:0.65,-68,-18 409:0.67,-58,-11 410:0.778,-51,-18 411:0.819,-42,-16 412:0.851,-36,-14 413:0.881,-30,-11 414:0.914,-23,-7 415:0.922,-20,-6 416:0.952,-14,-5 418:0.979,-6,-2 420:1.000,+0,-0 422:1.019,+6,+3 424:1.032,+11,+4 426:1.037,+14,+5 428:1.041,+17,+6
* **S3** (first visible 406, sharp 410): 406:0.26,-58,-7 407:0.38,-52,-9 408:0.51,-46,-10 409:0.60,-38,-9 410:0.682,-39,-8 411:0.748,-29,-6 412:0.807,-25,-7 413:0.851,-21,-5 414:0.888,-15,-3 415:0.917,-13,-3 416:0.936,-11,-3 418:0.974,-4,-0 420:1.000,+0,+0 422:1.017,+5,+2 424:1.027,+7,+2 426:1.037,+10,+1 428:1.038,+12,+1
* **MariaDB4** (first visible 408, sharp 417): 408:0.29,-14,-3 409:0.49,-14,-3 410:0.63,-14,-3 411:0.73,-14,-3 412:0.80,-14,-3 413:0.84,-14,-3 414:0.88,-14,-3 415:0.90,-14,-3 416:0.92,-14,-3 417:0.930,-14,-3 418:0.951,-8,-1 419:0.980,-4,-1 420:1.000,+0,+0 421:1.015,+3,-1 422:1.030,+9,+2 423:1.041,+11,+2 424:1.048,+15,+2 426:1.068,+20,+2 428:1.067,+25,+1
* **MariaDB1** (first visible 409, sharp 413): 409:0.39,+13,+67 410:0.57,+7,+50 411:0.70,+8,+43 412:0.78,+7,+34 413:0.832,+4,+26 414:0.884,+3,+22 415:0.919,+2,+17 416:0.945,+2,+12 417:0.967,+2,+9 418:0.982,+1,+6 419:0.993,+0,+3 420:1.000,+0,-0 422:1.011,-1,-4 424:1.015,-1,-8 426:1.017,-1,-11 428:1.018,-1,-14
* **Search** (first visible 411, sharp 415): 411:0.38,-13,-26 412:0.54,-12,-20 413:0.68,-9,-16 414:0.77,-7,-12 415:0.846,-7,-10 416:0.896,-6,-7 417:0.933,-4,-6 418:0.962,-2,-2 419:0.983,-1,-1 420:1.000,+0,-0 421:1.011,+1,+1 422:1.020,+2,+4 424:1.030,+4,+6 426:1.035,+6,+7 428:1.039,+8,+9
* **CreateDOC** (first visible 412, sharp 416): 412:0.27,-10,+27 413:0.48,-11,+20 414:0.62,-7,+17 415:0.73,-7,+14 416:0.829,-8,+9 417:0.892,-5,+5 418:0.942,-2,+5 419:0.972,-1,+1 420:1.000,-0,+0 421:1.022,+1,-3 422:1.036,+4,-3 424:1.051,+4,-7 426:1.063,+7,-11 428:1.066,+9,-14
* **Elastic4** (first visible 414, sharp 418): 414:0.37,+58,-8 415:0.60,+43,-7 416:0.75,+31,-5 417:0.86,+24,-6 418:0.876,+6,-2 419:0.949,+3,-1 420:1.000,+0,+0 421:1.038,-2,+0 422:1.061,-1,+2 423:1.089,-3,+3 424:1.103,-4,+4 426:1.116,-5,+3 428:1.125,-5,+2
* **SendTo** (tracked 393-426): 393:0.895,+159,-15 395:0.954,+124,-17 397:0.947,+84,-16 399:0.972,+59,-12 401:0.975,+41,-11 403:0.978,+29,-9 405:0.986,+20,-6 407:0.982,+12,-3 409:0.983,+6,-3 411:0.989,+3,-2 413:0.991,+1,-2 415:0.997,+0,-1 417:0.999,-0,-1 419:1.002,+0,-0 420:1.000,+0,+0 421:0.994,-0,+0 422:0.987,+0,+2 423:0.975,-1,+1 424:0.958,-1,+3 425:0.931,-4,+2 426:0.907,-5,+3

### TB1 Wall plane per frame. Quad = screen corners (1080p) of the wall-local rectangle (0,0)-(2279,1154) [TL, TR, BR, BL]. CSS pose = alternative rigid fit (perspective 3291px, origin centre; local origin = wall (0,0)); fit error in the last column

| frame | TL | TR | BR | BL | rotX | rotY | rotZ | tx | ty | tz | fit rms/max px |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 429 | 70,126 | 2245,224 | 2259,1287 | 63,1489 | 1.29 | 19.41 | 0.21 | 203.5 | 187.1 | 490.4 | 2.8/5 |
| 430 | 40,113 | 2288,213 | 2304,1313 | 32,1521 | 1.39 | 19.01 | 0.22 | 201.5 | 187.1 | 578.1 | 1.8/4 |
| 431 | 15,102 | 2321,205 | 2340,1333 | 8,1547 | 1.53 | 18.63 | 0.21 | 199.2 | 187.3 | 640.6 | 1.0/3 |
| 432 | -7,94 | 2350,197 | 2368,1349 | -13,1568 | 1.48 | 18.32 | 0.19 | 196.8 | 187.7 | 693.4 | 0.5/2 |
| 433 | -26,87 | 2376,191 | 2395,1365 | -32,1585 | 1.43 | 17.93 | 0.17 | 193.4 | 188.1 | 735.7 | 0.5/1 |
| 434 | -45,81 | 2400,184 | 2419,1379 | -50,1601 | 1.39 | 17.51 | 0.15 | 189.4 | 188.7 | 770.7 | 0.9/2 |
| 435 | -62,76 | 2423,178 | 2441,1393 | -67,1614 | 1.30 | 17.05 | 0.13 | 184.7 | 189.3 | 800.3 | 1.4/3 |
| 436 | -80,72 | 2443,172 | 2460,1404 | -83,1626 | 1.18 | 16.63 | 0.09 | 179.6 | 190.1 | 826.7 | 1.8/3 |
| 437 | -97,69 | 2465,165 | 2480,1417 | -98,1635 | 1.05 | 16.03 | 0.05 | 172.9 | 191.0 | 846.9 | 2.5/5 |
| 438 | -114,67 | 2484,159 | 2497,1429 | -113,1644 | 0.82 | 15.84 | -0.01 | 166.8 | 192.4 | 882.1 | 2.0/4 |
| 439 | -131,65 | 2503,152 | 2514,1440 | -128,1651 | 0.64 | 15.24 | -0.06 | 158.6 | 193.6 | 898.5 | 2.4/4 |
| 440 | -148,65 | 2522,146 | 2529,1451 | -142,1655 | 0.39 | 14.65 | -0.11 | 149.8 | 194.9 | 911.7 | 2.7/5 |
| 441 | -165,65 | 2540,139 | 2544,1463 | -156,1658 | 0.13 | 13.88 | -0.17 | 139.2 | 196.3 | 920.3 | 3.1/6 |
| 442 | -183,66 | 2558,132 | 2557,1474 | -169,1658 | -0.23 | 13.00 | -0.22 | 127.3 | 197.9 | 924.9 | 3.6/7 |
| 443 | -200,68 | 2576,125 | 2569,1485 | -181,1655 | -0.59 | 11.98 | -0.27 | 113.9 | 199.3 | 924.1 | 4.2/8 |
| 444 | -216,71 | 2593,118 | 2580,1497 | -192,1649 | -1.00 | 10.78 | -0.31 | 98.6 | 200.7 | 917.0 | 4.7/9 |
| 445 | -232,75 | 2610,111 | 2587,1508 | -201,1639 | -1.54 | 9.38 | -0.34 | 81.6 | 201.8 | 903.2 | 5.4/10 |
| 446 | -245,80 | 2625,104 | 2593,1520 | -207,1624 | -2.07 | 7.69 | -0.34 | 62.6 | 202.4 | 878.5 | 6.0/11 |
| 447 | -255,85 | 2638,98 | 2594,1533 | -209,1602 | -2.42 | 5.54 | -0.21 | 41.4 | 201.0 | 838.6 | 7.0/14 |
| 448 | -260,91 | 2648,92 | 2590,1545 | -205,1572 | -3.21 | 2.85 | -0.12 | 18.7 | 199.6 | 781.1 | 7.3/15 |
| 449 | -258,97 | 2652,89 | 2578,1556 | -194,1534 | -4.40 | -0.73 | 0.00 | -4.6 | 196.8 | 698.0 | 7.7/13 |
| 450 | -246,101 | 2649,89 | 2558,1567 | -173,1485 | -5.44 | -4.79 | 0.33 | -24.8 | 189.5 | 598.1 | 7.4/13 |
| 451 | -222,104 | 2633,93 | 2524,1574 | -142,1426 | -6.76 | -9.11 | 0.84 | -39.4 | 177.4 | 485.1 | 6.6/12 |
| 452 | -185,104 | 2602,103 | 2475,1575 | -99,1358 | -8.42 | -13.03 | 1.52 | -48.0 | 160.8 | 364.6 | 5.7/13 |
| 453 | -136,101 | 2558,118 | 2417,1570 | -47,1286 | -10.17 | -16.55 | 2.40 | -49.9 | 138.9 | 234.4 | 4.5/12 |
| 454 | -81,95 | 2503,136 | 2354,1561 | 7,1217 | -12.08 | -19.64 | 3.49 | -45.6 | 111.9 | 100.6 | 3.7/11 |
| 455 | -26,88 | 2444,155 | 2290,1545 | 61,1153 | -13.73 | -22.38 | 4.61 | -35.7 | 83.7 | -40.6 | 3.5/10 |
| 456 | 27,81 | 2387,172 | 2232,1529 | 110,1099 | -15.02 | -24.77 | 5.70 | -21.6 | 56.1 | -175.7 | 3.5/11 |
| 457 | 74,73 | 2331,188 | 2178,1509 | 154,1054 | -16.11 | -26.71 | 6.72 | -5.9 | 30.1 | -301.7 | 3.5/11 |
| 458 | 116,67 | 2285,200 | 2132,1490 | 193,1014 | -17.11 | -28.41 | 7.67 | 10.8 | 5.9 | -417.0 | 4.1/14 |
| 459 | 154,61 | 2241,212 | 2092,1473 | 229,981 | -18.28 | -30.04 | 8.59 | 27.9 | -16.2 | -519.3 | 4.4/15 |
| 460 | 187,56 | 2203,222 | 2057,1456 | 258,952 | -18.95 | -31.21 | 9.40 | 44.1 | -36.7 | -615.9 | 4.5/16 |
| 461 | 216,51 | 2170,230 | 2026,1439 | 286,928 | -19.78 | -32.38 | 10.11 | 60.1 | -54.3 | -698.9 | 5.1/21 |
| 462 | 243,47 | 2140,237 | 2000,1426 | 308,907 | -20.24 | -33.26 | 10.76 | 75.2 | -71.3 | -775.7 | 5.0/20 |
| 463 | 266,43 | 2115,242 | 1976,1411 | 331,888 | -20.87 | -34.15 | 11.39 | 89.8 | -86.6 | -847.6 | 5.4/21 |
| 464 | 288,40 | 2091,248 | 1957,1399 | 350,871 | -21.47 | -34.90 | 11.98 | 103.8 | -100.7 | -907.8 | 5.1/19 |
| 465 | 307,37 | 2070,252 | 1939,1388 | 366,857 | -21.88 | -35.48 | 12.51 | 116.9 | -113.7 | -965.0 | 5.0/17 |
| 466 | 324,34 | 2052,256 | 1924,1379 | 382,843 | -22.33 | -36.10 | 13.01 | 129.4 | -125.9 | -1017.8 | 4.7/16 |
| 467 | 341,32 | 2035,259 | 1908,1368 | 397,832 | -22.75 | -36.67 | 13.45 | 141.5 | -136.6 | -1066.3 | 5.1/17 |
| 468 | 355,29 | 2020,262 | 1896,1359 | 410,821 | -23.08 | -37.17 | 13.86 | 152.9 | -146.8 | -1110.7 | 5.1/20 |
| 469 | 369,27 | 2006,265 | 1884,1350 | 423,811 | -23.43 | -37.63 | 14.25 | 163.6 | -156.3 | -1152.2 | 5.3/21 |
| 470 | 381,25 | 1994,267 | 1873,1342 | 434,802 | -23.76 | -38.06 | 14.62 | 173.8 | -165.1 | -1190.5 | 5.0/20 |
| 471 | 393,23 | 1983,269 | 1864,1336 | 444,794 | -24.01 | -38.44 | 14.97 | 183.5 | -173.6 | -1225.4 | 5.2/23 |
| 472 | 404,22 | 1972,271 | 1856,1329 | 454,787 | -24.32 | -38.79 | 15.30 | 192.3 | -181.4 | -1258.9 | 5.1/22 |
| 473 | 414,20 | 1963,273 | 1847,1322 | 463,780 | -24.54 | -39.08 | 15.59 | 200.5 | -188.6 | -1292.7 | 4.9/22 |
| 474 | 423,18 | 1954,274 | 1840,1316 | 471,774 | -24.77 | -39.35 | 15.87 | 208.5 | -195.5 | -1323.2 | 4.7/21 |
| 475 | 431,17 | 1946,275 | 1833,1310 | 478,768 | -24.96 | -39.60 | 16.12 | 216.0 | -201.7 | -1351.9 | 4.5/19 |
| 476 | 440,15 | 1938,276 | 1827,1305 | 486,762 | -25.24 | -39.91 | 16.39 | 223.6 | -207.9 | -1378.0 | 4.6/19 |
| 477 | 447,14 | 1932,277 | 1821,1301 | 493,757 | -25.45 | -40.15 | 16.63 | 230.5 | -213.6 | -1402.6 | 4.4/18 |
| 478 | 454,13 | 1926,278 | 1816,1296 | 500,752 | -25.71 | -40.41 | 16.87 | 237.4 | -219.2 | -1425.5 | 4.7/19 |
| 479 | 461,12 | 1919,279 | 1811,1292 | 506,748 | -25.80 | -40.60 | 17.07 | 243.8 | -224.1 | -1447.3 | 4.4/17 |
| 480 | 467,11 | 1914,280 | 1806,1288 | 511,744 | -25.93 | -40.76 | 17.26 | 249.3 | -228.8 | -1468.1 | 4.1/15 |
| 481 | 473,10 | 1909,281 | 1803,1284 | 516,740 | -26.12 | -40.96 | 17.45 | 255.0 | -233.4 | -1487.7 | 4.0/15 |
| 482 | 479,9 | 1904,281 | 1799,1280 | 522,736 | -26.30 | -41.14 | 17.64 | 260.5 | -237.7 | -1507.0 | 4.0/15 |
| 483 | 484,8 | 1900,282 | 1795,1277 | 525,733 | -26.37 | -41.26 | 17.81 | 265.5 | -242.1 | -1523.9 | 3.9/15 |
| 484 | 489,7 | 1896,282 | 1791,1274 | 530,730 | -26.48 | -41.45 | 17.95 | 270.6 | -245.5 | -1539.6 | 3.8/15 |
| 485 | 494,6 | 1892,283 | 1788,1270 | 534,727 | -26.60 | -41.60 | 18.09 | 275.3 | -248.8 | -1555.8 | 3.6/15 |
| 486 | 498,5 | 1888,283 | 1785,1268 | 538,724 | -26.77 | -41.74 | 18.27 | 279.8 | -252.8 | -1570.4 | 3.6/14 |
| 487 | 502,4 | 1885,283 | 1782,1265 | 542,721 | -26.88 | -41.90 | 18.40 | 284.3 | -255.8 | -1584.1 | 3.5/14 |
| 488 | 506,4 | 1882,284 | 1780,1262 | 545,719 | -26.98 | -41.99 | 18.52 | 287.9 | -258.9 | -1596.9 | 3.3/13 |
| 489 | 510,3 | 1879,284 | 1777,1260 | 549,716 | -27.09 | -42.11 | 18.65 | 291.8 | -262.0 | -1609.5 | 3.2/13 |
| 490 | 514,2 | 1876,284 | 1775,1257 | 553,714 | -27.22 | -42.24 | 18.77 | 295.7 | -264.6 | -1621.6 | 3.3/13 |
| 491 | 517,2 | 1874,284 | 1773,1255 | 556,712 | -27.35 | -42.38 | 18.89 | 299.5 | -267.0 | -1632.1 | 3.4/14 |
| 492 | 520,1 | 1871,285 | 1771,1253 | 559,710 | -27.40 | -42.46 | 19.00 | 302.7 | -269.7 | -1642.2 | 3.1/12 |
| 493 | 523,0 | 1869,285 | 1769,1252 | 560,709 | -27.42 | -42.53 | 19.08 | 305.6 | -272.0 | -1652.3 | 2.9/12 |
| 494 | 526,-0 | 1867,285 | 1768,1250 | 563,707 | -27.54 | -42.63 | 19.18 | 308.7 | -274.1 | -1660.8 | 2.8/11 |
| 495 | 529,-1 | 1865,285 | 1766,1248 | 565,705 | -27.58 | -42.70 | 19.27 | 311.6 | -276.4 | -1670.7 | 2.8/11 |
| 496 | 531,-1 | 1863,285 | 1765,1246 | 568,704 | -27.65 | -42.78 | 19.34 | 314.2 | -278.2 | -1678.5 | 2.6/10 |
| 497 | 533,-2 | 1861,285 | 1763,1246 | 569,703 | -27.62 | -42.83 | 19.41 | 316.7 | -279.9 | -1685.1 | 2.2/8 |
| 498 | 536,-2 | 1860,286 | 1761,1243 | 572,701 | -27.83 | -42.93 | 19.52 | 319.3 | -282.1 | -1694.0 | 2.7/11 |
| 499 | 538,-3 | 1858,286 | 1760,1242 | 574,699 | -27.86 | -42.99 | 19.59 | 321.6 | -283.7 | -1700.3 | 2.5/10 |
| 500 | 540,-3 | 1856,286 | 1759,1241 | 576,698 | -27.91 | -43.05 | 19.64 | 323.6 | -285.1 | -1706.8 | 2.4/10 |
| 501 | 541,-3 | 1855,286 | 1758,1240 | 577,697 | -27.95 | -43.09 | 19.71 | 325.5 | -286.8 | -1712.9 | 2.3/9 |
| 502 | 543,-4 | 1854,286 | 1757,1238 | 578,696 | -28.01 | -43.14 | 19.77 | 327.2 | -288.1 | -1718.4 | 2.3/9 |
| 503 | 545,-4 | 1853,286 | 1756,1237 | 581,695 | -28.12 | -43.21 | 19.83 | 329.2 | -289.5 | -1723.7 | 2.4/10 |
| 504 | 546,-4 | 1852,286 | 1755,1236 | 581,694 | -28.08 | -43.23 | 19.88 | 330.7 | -290.8 | -1728.9 | 2.1/8 |
| 505 | 548,-5 | 1850,286 | 1754,1235 | 582,693 | -28.15 | -43.28 | 19.93 | 332.3 | -291.9 | -1733.5 | 2.1/8 |
| 506 | 549,-5 | 1850,286 | 1753,1234 | 584,692 | -28.22 | -43.33 | 19.98 | 333.8 | -293.1 | -1737.8 | 2.2/9 |
| 507 | 550,-5 | 1849,286 | 1753,1233 | 585,692 | -28.24 | -43.39 | 20.03 | 335.7 | -294.1 | -1742.3 | 2.2/8 |
| 508 | 552,-6 | 1848,286 | 1752,1233 | 586,690 | -28.30 | -43.47 | 20.11 | 337.5 | -295.5 | -1745.3 | 2.1/8 |
| 509 | 553,-7 | 1846,286 | 1751,1232 | 587,690 | -28.26 | -43.49 | 20.14 | 338.6 | -296.6 | -1749.7 | 1.8/7 |
| 510 | 556,-7 | 1844,286 | 1750,1232 | 590,688 | -28.43 | -43.66 | 20.28 | 342.0 | -298.7 | -1753.6 | 2.0/8 |
| 511 | 558,-8 | 1842,286 | 1748,1232 | 592,687 | -28.54 | -43.81 | 20.39 | 344.8 | -300.6 | -1757.5 | 2.0/8 |
| 512 | 560,-9 | 1840,286 | 1746,1232 | 594,685 | -28.62 | -43.97 | 20.53 | 347.9 | -302.9 | -1761.0 | 1.8/7 |
| 513 | 563,-10 | 1837,286 | 1744,1232 | 596,684 | -28.73 | -44.16 | 20.69 | 351.7 | -305.5 | -1766.5 | 1.8/7 |
| 514 | 566,-12 | 1834,285 | 1741,1232 | 599,681 | -28.85 | -44.38 | 20.89 | 356.0 | -308.7 | -1771.2 | 1.7/7 |
| 515 | 569,-13 | 1831,285 | 1738,1232 | 602,680 | -29.00 | -44.66 | 21.08 | 360.7 | -311.6 | -1776.3 | 1.8/7 |
| 516 | 573,-15 | 1827,285 | 1734,1233 | 606,677 | -29.18 | -44.94 | 21.33 | 365.9 | -315.2 | -1780.9 | 1.7/6 |
| 517 | 578,-17 | 1823,284 | 1731,1233 | 610,675 | -29.38 | -45.29 | 21.62 | 372.2 | -319.2 | -1786.0 | 1.7/6 |
| 518 | 582,-19 | 1817,283 | 1725,1233 | 614,672 | -29.57 | -45.65 | 21.91 | 378.6 | -323.7 | -1792.9 | 1.6/6 |
| 519 | 588,-22 | 1812,283 | 1720,1234 | 620,669 | -29.91 | -46.11 | 22.31 | 386.6 | -329.0 | -1799.0 | 1.8/7 |
| 520 | 594,-25 | 1805,282 | 1714,1235 | 625,665 | -30.20 | -46.62 | 22.73 | 395.8 | -334.6 | -1805.6 | 1.8/7 |
| 521 | 602,-28 | 1797,281 | 1707,1236 | 632,661 | -30.52 | -47.16 | 23.21 | 406.0 | -340.9 | -1814.2 | 1.8/7 |
| 522 | 610,-32 | 1788,280 | 1699,1238 | 639,656 | -30.98 | -47.80 | 23.80 | 417.4 | -348.4 | -1821.2 | 1.7/7 |
| 523 | 619,-36 | 1778,278 | 1689,1239 | 647,651 | -31.42 | -48.50 | 24.45 | 430.5 | -356.5 | -1831.3 | 1.6/6 |
| 524 | 630,-40 | 1765,276 | 1677,1240 | 657,646 | -32.01 | -49.34 | 25.24 | 446.4 | -365.7 | -1843.5 | 1.9/7 |
| 525 | 642,-46 | 1751,274 | 1664,1242 | 668,639 | -32.76 | -50.27 | 26.22 | 464.0 | -376.7 | -1851.5 | 1.8/7 |
| 526 | 656,-52 | 1733,272 | 1647,1244 | 680,630 | -33.63 | -51.32 | 27.40 | 485.3 | -389.8 | -1866.3 | 2.1/8 |
| 527 | 675,-59 | 1709,267 | 1625,1244 | 700,622 | -34.90 | -52.82 | 28.91 | 514.4 | -403.3 | -1885.5 | 2.4/9 |
| 528 | 698,-69 | 1679,264 | 1600,1248 | 717,609 | -36.45 | -54.27 | 30.97 | 546.2 | -423.7 | -1899.5 | 1.8/5 |
| 529 | 728,-81 | 1636,257 | 1561,1249 | 745,595 | -38.88 | -56.45 | 33.94 | 593.2 | -447.2 | -1919.5 | 1.9/7 |

### TB2 App panel per frame. Quad = screen corners of the panel-local rectangle (0,0)-(1540,1000) [TL, TR, BR, BL]; blur = Gaussian sigma in px (1080p); rel = panel origin in wall-local 3D coords (x, y, z toward viewer) for the CSS route

| frame | TL | TR | BR | BL | blur σ | rel x | rel y | rel z | source |
|---|---|---|---|---|---|---|---|---|---|
| 455 | -3098,509 | 2045,1343 | 1733,5684 | -2315,3039 | 20.0 | 659 | -141 | 2245 | model |
| 456 | -2481,460 | 1426,1155 | 1336,4655 | -1886,2598 | 20.0 | 677 | -144 | 2159 | model |
| 457 | -2037,420 | 1165,1029 | 1148,3981 | -1561,2293 | 24.0 | 694 | -146 | 2080 | model |
| 458 | -1714,383 | 1034,934 | 1046,3523 | -1317,2069 | 22.0 | 710 | -148 | 2009 | model |
| 459 | -1457,360 | 963,877 | 992,3190 | -1113,1901 | 12.0 | 725 | -151 | 1937 | model |
| 460 | -1284,332 | 925,824 | 954,2963 | -981,1779 | 9.0 | 739 | -153 | 1895 | model |
| 461 | -1117,314 | 916,783 | 946,2766 | -845,1674 | 6.0 | 753 | -155 | 1839 | model |
| 462 | -1008,292 | 901,745 | 929,2631 | -760,1597 | 4.5 | 765 | -157 | 1809 | model |
| 463 | -873,282 | 918,720 | 936,2490 | -644,1509 | 2.2 | 785 | -130 | 1784 | measured |
| 464 | -783,267 | 924,693 | 936,2387 | -568,1450 | 1.5 | 796 | -135 | 1746 | measured |
| 465 | -706,254 | 932,670 | 943,2305 | -505,1403 | 0 | 803 | -137 | 1716 | measured |
| 466 | -637,242 | 942,650 | 951,2235 | -448,1361 | 0 | 815 | -141 | 1687 | measured |
| 467 | -575,232 | 952,633 | 960,2176 | -398,1325 | 0 | 824 | -144 | 1659 | measured |
| 468 | -522,221 | 962,617 | 967,2119 | -353,1291 | 0 | 831 | -146 | 1633 | measured |
| 469 | -474,212 | 972,602 | 975,2068 | -312,1263 | 0 | 838 | -148 | 1610 | measured |
| 470 | -430,203 | 982,589 | 984,2025 | -275,1237 | 0 | 846 | -151 | 1587 | measured |
| 471 | -389,196 | 993,577 | 992,1986 | -240,1213 | 0 | 851 | -150 | 1565 | measured |
| 472 | -351,190 | 1003,567 | 1001,1952 | -209,1192 | 0 | 857 | -153 | 1546 | measured |
| 473 | -317,183 | 1013,557 | 1009,1920 | -181,1172 | 0 | 864 | -155 | 1530 | measured |
| 474 | -286,177 | 1022,548 | 1016,1891 | -154,1155 | 0 | 869 | -156 | 1513 | measured |
| 475 | -257,172 | 1031,539 | 1024,1865 | -130,1139 | 0 | 875 | -158 | 1500 | measured |
| 476 | -231,166 | 1040,532 | 1031,1840 | -107,1124 | 0 | 882 | -161 | 1485 | measured |
| 477 | -206,162 | 1048,525 | 1039,1819 | -86,1110 | 0 | 888 | -163 | 1472 | measured |
| 478 | -184,157 | 1056,518 | 1046,1799 | -66,1098 | 0 | 894 | -167 | 1459 | measured |
| 479 | -163,153 | 1063,512 | 1051,1777 | -48,1086 | 0 | 896 | -165 | 1446 | measured |
| 480 | -143,149 | 1070,506 | 1057,1760 | -31,1075 | 0 | 900 | -166 | 1436 | measured |
| 481 | -125,145 | 1077,501 | 1063,1744 | -15,1065 | 0 | 905 | -169 | 1426 | measured |
| 482 | -107,142 | 1083,496 | 1069,1730 | -0,1056 | 0 | 910 | -171 | 1416 | measured |
| 483 | -91,139 | 1089,491 | 1075,1717 | 13,1047 | 0 | 914 | -171 | 1408 | measured |
| 484 | -76,136 | 1095,487 | 1079,1704 | 26,1039 | 0 | 917 | -171 | 1398 | measured |
| 485 | -62,133 | 1100,483 | 1083,1692 | 38,1032 | 0 | 921 | -173 | 1390 | measured |
| 486 | -49,131 | 1105,479 | 1088,1681 | 50,1025 | 0 | 925 | -175 | 1383 | measured |
| 487 | -37,128 | 1110,476 | 1091,1670 | 60,1018 | 0 | 928 | -176 | 1376 | measured |
| 488 | -25,126 | 1114,473 | 1095,1661 | 70,1012 | 0 | 931 | -177 | 1369 | measured |
| 489 | -15,124 | 1118,470 | 1099,1652 | 79,1006 | 0 | 934 | -178 | 1363 | measured |
| 490 | -5,122 | 1122,467 | 1102,1644 | 88,1001 | 0 | 937 | -179 | 1357 | measured |
| 491 | 4,120 | 1125,465 | 1105,1636 | 96,996 | 0 | 940 | -181 | 1351 | measured |
| 492 | 13,118 | 1128,462 | 1108,1629 | 103,992 | 0 | 942 | -181 | 1346 | measured |
| 493 | 21,117 | 1131,460 | 1111,1623 | 110,988 | 0 | 945 | -181 | 1343 | measured |
| 494 | 28,115 | 1134,458 | 1113,1616 | 116,984 | 0 | 947 | -182 | 1338 | measured |
| 495 | 35,114 | 1136,456 | 1115,1611 | 122,980 | 0 | 949 | -182 | 1335 | measured |
| 496 | 41,112 | 1138,455 | 1117,1606 | 127,977 | 0 | 951 | -183 | 1331 | measured |
| 497 | 47,111 | 1140,453 | 1119,1601 | 132,973 | 0 | 952 | -181 | 1328 | measured |
| 498 | 52,110 | 1142,452 | 1120,1597 | 137,970 | 0 | 955 | -185 | 1326 | measured |
| 499 | 57,109 | 1143,451 | 1121,1593 | 141,968 | 0 | 957 | -185 | 1323 | measured |
| 500 | 61,108 | 1144,449 | 1122,1589 | 145,965 | 0 | 959 | -186 | 1321 | measured |
| 501 | 65,107 | 1145,448 | 1123,1586 | 148,963 | 0 | 960 | -186 | 1319 | measured |
| 502 | 69,106 | 1146,448 | 1124,1583 | 152,961 | 0 | 962 | -187 | 1318 | measured |
| 503 | 72,106 | 1146,447 | 1124,1581 | 154,959 | 0 | 964 | -188 | 1317 | measured |
| 504 | 75,105 | 1147,446 | 1124,1578 | 157,958 | 0 | 964 | -187 | 1316 | measured |
| 505 | 77,105 | 1147,446 | 1125,1576 | 159,956 | 0 | 966 | -188 | 1316 | measured |
| 506 | 79,104 | 1147,445 | 1124,1574 | 161,955 | 0 | 967 | -189 | 1315 | measured |
| 507 | 81,104 | 1146,445 | 1124,1573 | 162,953 | 0 | 969 | -189 | 1315 | measured |
| 508 | 83,103 | 1145,444 | 1123,1571 | 164,952 | 0 | 970 | -189 | 1314 | measured |
| 509 | 85,102 | 1143,444 | 1122,1569 | 165,950 | 0 | 971 | -188 | 1314 | measured |
| 510 | 87,101 | 1141,443 | 1120,1568 | 167,948 | 0 | 974 | -190 | 1312 | measured |
| 511 | 90,100 | 1139,442 | 1118,1567 | 170,946 | 0 | 977 | -190 | 1309 | measured |
| 512 | 92,98 | 1135,441 | 1115,1564 | 172,944 | 0 | 978 | -189 | 1306 | measured |
| 513 | 95,97 | 1131,440 | 1111,1563 | 175,941 | 0 | 982 | -189 | 1304 | measured |
| 514 | 99,95 | 1127,439 | 1108,1561 | 178,938 | 0 | 986 | -189 | 1300 | measured |
| 515 | 103,92 | 1122,437 | 1103,1560 | 181,934 | 0 | 991 | -189 | 1296 | measured |
| 516 | 107,90 | 1116,435 | 1098,1557 | 185,930 | 0 | 995 | -189 | 1291 | measured |
| 517 | 111,87 | 1109,433 | 1092,1555 | 189,926 | 0 | 1000 | -188 | 1285 | measured |
| 518 | 116,83 | 1100,431 | 1085,1552 | 193,921 | 0 | 1006 | -187 | 1279 | measured |
| 519 | 122,79 | 1091,428 | 1076,1549 | 198,916 | 0 | 1013 | -188 | 1270 | measured |
| 520 | 129,75 | 1081,425 | 1067,1547 | 204,909 | 0 | 1021 | -187 | 1262 | measured |
| 521 | 136,70 | 1069,421 | 1057,1543 | 211,903 | 0 | 1029 | -186 | 1253 | measured |
| 522 | 145,65 | 1056,417 | 1045,1539 | 218,895 | 0 | 1037 | -184 | 1239 | measured |
| 523 | 155,60 | 1040,412 | 1032,1535 | 227,886 | 0 | 1048 | -183 | 1227 | measured |
| 524 | 166,52 | 1023,407 | 1017,1530 | 237,877 | 0 | 1063 | -182 | 1213 | measured |
| 525 | 179,44 | 1003,399 | 999,1524 | 249,866 | 0 | 1075 | -181 | 1193 | measured |
| 526 | 195,35 | 979,393 | 977,1516 | 262,852 | 0 | 1089 | -178 | 1172 | measured |
| 527 | 215,27 | 951,383 | 955,1511 | 280,837 | 0 | 1114 | -178 | 1147 | measured |
| 528 | 238,6 | 909,371 | 909,1474 | 300,820 | 0 | 1107 | -165 | 1101 | measured |
| 529 | 273,-11 | 862,353 | 864,1450 | 332,795 | 0 | 1123 | -158 | 1048 | measured |
