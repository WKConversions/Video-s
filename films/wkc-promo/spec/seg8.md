# Segment 8: frames 1005-1261 (33.50-42.03 s). "90%" with rings, the "Built for" carousel, the end card and the fade-out

All coordinates are **1920x1080 px** (the measured 720p values multiplied by 1.5). Frame n = n/30 s. All values are measured from `ref/frames` (thresholded boxes, template matching with scale search, ellipse fits, profile fits). Where a value is a fit, the table it comes from is in the appendix.
Blur values are Gaussian sigma in px at 1080p. CSS `filter: blur(Npx)` takes the sigma directly, so use N = the listed value.
Colours are sampled hex values.

---------------------------------------------------------------------------------------------------
## 0. Frame 0 of the film (the thumbnail)
Frames **0-3** are a still copy of the end card. Mean absolute difference between f0000 and f1211 is 0.74/255, the best match of any frame (f1208-f1214 are all below 0.85). Frame 4 is where the film proper starts.
The only differences from f1211 are the pill streak shimmer and sub-pixel glow noise, so **render frames 0-3 as the end card at its settled state (= frame 1211)**. In Remotion, `<Freeze frame={1211}>` of the end-card composition (or the same component at local "settled" time) for frames 0-3.

---------------------------------------------------------------------------------------------------
## 1. Shot list

| frames | shot / transition | type |
|---|---|---|
| (996)-1001 | previous shot "200+ Clients, 21+ Countries" (logo cards), unchanged | n/a |
| **1002-1008** | **transition IN to the "90%" shot.** The ring layer zooms out from huge (scale 2.6 to 1.79) and fades up. From **1002** the old shot blurs bottom-first and darkens. **90%** pops in at **1005**, blurred. Old shot gone by 1008-1009. | zoom-through and blur-through crossfade |
| 1005-1031 | "90%" + 5 converging echo rings + typed subtitle; continuous zoom-out | n/a |
| **1032** | "impact" accent: chromatic aberration switches on, echo rings have fully merged into one thin ring, faint ripple rings appear | accent (no cut) |
| 1032-1053 | hold, slow zoom-out; big outer ring sweeps out at the bottom of frame (1036-1052) | n/a |
| **1054-1058** | exit: zoom-out accelerates, layer fades from 1.0 to 0.32 | zoom-out and fade |
| **1059** | **hard cut** to the "Built for" carousel. Chromatic aberration continues 1059-1063, and a faint ring ghost (5% or less) fades out by about 1066 | cut |
| 1059-1062 | "Built for / Fortune 50" (item 1) | n/a |
| 1063-1126 | 12 whip-switches (1-2 frame, motion-blurred track slides): see section 4C | whip / push |
| 1123-1126 | last regular item "Marketing" eases left, then dissolves into the final item | slide and dissolve |
| 1127-1152 | final item "Agentic AI" (gradient-wipe reveal) + 3 sparkle stars; **1145-1152 white bloom builds** | n/a |
| **1153** | **glow cut** to the end card: the wordmark starts at bloom peak and the bloom decays | cut on a flash |
| 1153-1197 | end card build: icon stroke draw-on and slide, wordmark stroke-on, "Seek" wipe, pill rise and fade, "7-day trial" wipe, url typing (1171-1182) | n/a |
| 1197-1236 | end card hold (only the streak shimmer moves) | n/a |
| **1236-1261** | **linear fade to black**, 1.0 at 1236 down to 0.0 at 1261 | fade to black |

---------------------------------------------------------------------------------------------------
## 2. Background (all shots)
- Base: deep indigo-black, static. There is no grain: the high-pass std is 0.2/255.
- Measured 9x8 block medians, excluding text, at the end card (f1211). Rows are y = 60, 180, 300, 420, 540, 660, 780, 900, 1020 @1080 and columns are x = 60 ... 1860, step 240:
  - top rows: `#110E1C #100E1B #0E0D1A #0C0E1B #0C0F1B #0B0F1A #0B0E19 #0A0D16`
  - middle: `#100E1B #110F1D #131021 ... #151225 #151123 #110E1D #0D0C19`
  - bottom: `#0F0D1A #120E1D #161123 #1A1227 #1B1328 #191225 #140F1E #0E0C19`
- **Recipe:** a linear gradient left to right, `#100E1B` → `#090C15`. Over it, a soft violet radial glow: centre (960, 1000), radii about 900x620 px, centre colour `#1B1328` (carousel shots: weaker, `#151122`), falling to 0 at the radius. Add a faint lighter haze behind the centre text, `#121123` at (960, 540).
- The 90% shot (1005-1058) uses the same base. It has an extra magenta-violet glow in the bottom-left corner (`#25132C` at (40,900), `#724250`-ish streak at (720,1050) from the outer ring) and is slightly darker at the top-right (`#080C15`).
- Vignette: none measurable beyond the gradient above.

---------------------------------------------------------------------------------------------------
## 3./4. Elements and animation

### 4A. Transition IN, frames 999-1008 (what enters)
- **999-1001:** nothing new. The old logo-card shot is static apart from its own drift.
- **1002:** first faint arcs of the ring layer appear at the bottom of frame. The bottom arc of the main ring passes through (1020, 1018), (1080, 1018), (1200, 974) and (1260, 974), and the layer opacity is about 0.6. This is ring layer scale s ≈ 2.60 (main ring semi-major about 1180 px).
- **1003:** main ring ellipse centre (960, 400), a ≈ 983, b ≈ 513 (bottom at y = 914, top off-frame). Layer s ≈ 2.16.
- **1004:** a ≈ 872, b ≈ 456 (bottom y 853). s ≈ 1.92.
- **1005:** a ≈ 803 (s = 1.788). The first echo ring is visible at a ≈ 1360 (bottom near y 1110, partly off-frame). **"90%" appears** (table below): opacity 0.44, blur 10.5, scale 1.788, centre (962, 514).
- **Old shot exit** (fitted gain and blur against f1000, per region):

| frame | top cards (Penn) blur / opacity | centre text blur / opacity | bottom cards (Adobe, Snap) blur / opacity |
|---|---|---|---|
| 1001 | 4 / 1.0 | 1.5 / 1.0 | 4.5 / 1.0 |
| 1002 | 9 / 0.97 | 1.5 / 0.92 | 6 / 0.95 (bottom 20% darkened) |
| 1003 | 15 / 0.90 | 4.5 / 0.87 | 9 / 0.83 (below the ring: darkened about 50%) |
| 1004 | 21 / 0.81 | 6 / 0.67 | 12 / 0.61 |
| 1005 | 21 / 0.55 | 9 / 0.51 | ~0.25 |
| 1006 | 21 / 0.32 | 12 / 0.39 | ~0 |
| 1007 | 21 / 0.15 | 15 / 0.26 | 0 |
| 1008 | 0.05 | 0.2 (under the 90%) | 0 |
| 1009 | 0 | 0 | 0 |

So the old layer gets `blur(σ)` with σ growing from 0 to about 21 over 1001-1004 (stronger toward the bottom of frame). Its opacity goes 1, 0.95, 0.87, 0.7, 0.5, 0.33, 0.18, 0.06, 0 over 1001-1009. Add a bottom-up darkening gradient (black, 0 at y = 540, 60% at y = 1080) during 1002-1005.
- Easing: s(n) of the incoming layer is an exponential settle. Use s(n) = 0.9906 − 0.00571(n−1040) + 0.587·e^(−(n−1005)/5.41) (max error 0.018 for 1005-1049). Before 1005 use the measured 2.60, 2.16, 1.92 at 1002-1004.

### 4B. "90%" shot, frames 1005-1058

**Layer structure (back to front):** background → ring system → "90%" → subtitle. Rings, 90% and subtitle all share the scale s(n). Their positions are listed separately because they also move relative to each other.

**"90%" text**
- Geometric sans, heavy (looks like DM Sans/Manrope ExtraBold), tracking about 0. At s = 1 (frame 1040) the glyph box is **x 616-1306, y 348-536**: width 688, digit height (cap) 188 px, centre (961, 442). That gives a font-size of about 268 px at s = 1.
- Fill: vertical gradient, top `#F3F2F0` to bottom `#9E9499` (the lower 30% darkens). There is also a subtle diagonal sheen, the right side of "%" being darker.
- No glow. After 1032 it has the same chromatic aberration as the frame (see 6).
- Per-frame scale, centre, opacity and blur are in **Table A** (appendix): entrance 1005-1016, then steady.
  - Entrance opacity: 0.44, 0.62, 0.81, then 1.0 from 1008.
  - Entrance blur: 10.5, 9, 7.5, 7.5, 6, 6, 4.5, 4.5, 3, 2.25, 1.5, then 0 from 1016.
  - The centre y comes down from below: 514 → 498 → 487 → 482 → 475 → 470 → 467 → 464 → 460 → 459 → 457 → 455 (1016) → 449 (1022) → 446 (1028) → 442 (1032-1043). The exit then pushes it down to 466 (1058).
- **Exit 1054-1058:** opacity 0.88, 0.75, 0.59, 0.45, 0.32 with no blur. Scale accelerates: 0.856, 0.832, 0.808, 0.772, 0.732.

**Subtitle "Save your time with / task automation"**
- Two lines, centred at x ≈ 960. Medium-bold rounded geometric sans (DM Sans SemiBold look), white `#EBF2EA`/`#F0F0F2`.
- At s = 1 (1040):
  - line 1 box: x 543-1377, y 705-789 (cap top 708, baseline 768, descender to 786). Cap height about 57 px, font-size about 80 px.
  - line 2 box: x 606-1310, y 807-879 (baseline 870). Line pitch 102 px.
  - Word boxes, line 1: Save 539-732, your 762-951, time 978-1170, with 1199-1380. Line 2: task 605-788, automation 818-1311. Word gap about 29 px.
- **Typing:** character by character, about 1 char per frame, each char fading in over about 4 frames (grey `#8A8A90` to white). Visible text per frame:
  - 1007-1009: "Save your". Typing began off-screen; the line is still below the frame edge at 1005-1006.
  - 1010 "…ti", 1011 "tim", 1012 "time", 1013 "w", 1014 "wi", 1015-16 "with"
  - 1017 "t", 1018 "ta", 1019-20 "task"
  - 1021 "a", 1022 "au", 1023 "aut", 1024 "auto", 1025 "autom", 1026 "automa", 1027 "automat", 1028-29 "automati", 1030-31 "automatio", **1032 "automation"**
- **Rise, shrink and blur:** the subtitle comes up from below with its own ease-out on top of s(n). Line-1 top y and word scale:

| frame | line-1 top y | subtitle scale | word gaps (Save-your, your-time, time-with) |
|---|---|---|---|
| 1007 | ~930 (partly off-frame) | ~1.7 | n/a |
| 1010 | 900 | 1.53 | ~110 |
| 1012 | 857 | 1.43 | 84, 111 |
| 1014 | 828 | 1.34 | 72, 81 |
| 1016 | 804 | 1.29 | 60, 68, 88 |
| 1018 | 785 | 1.23 | 50, 54, 69 |
| 1020 | 770 | 1.19 | 44, 48, 58 |
| 1022 | 758 | 1.16 | 38, 42, 53 |
| 1024 | 747 | 1.13 | 33, 35, 44 |
| 1026 | 738 | 1.10 | 33, 32, 39 |
| 1028 | 731 | 1.08 | 33, 30, 35 |
| 1030 | 725 | 1.07 | 33, 29, 30 |
| 1032 | 720 | 1.05 | 32, 29, 32 |
| 1040 | 705 | 1.00 | 30, 27, 29 |
| 1050 | 687 | 0.91 | n/a |
| 1054 | 676 | 0.85 | n/a |
| 1056 | 669 | 0.80 | n/a |
| 1058 | 657 | 0.73 | n/a |

  - Word spacing collapses: each word is offset about **+100 px** (1080p, in subtitle-layer units, i.e. before scale) to the right of its final slot when its first letter appears. The offset decays exponentially with a **half-life of about 3.6 frames**, and following words shift with it (cumulative). In layer units the extra gaps are: your +44 at 1012 → 0 by 1024; time +71 at 1010, 33 at 1016, 0 at 1024; with +58 at 1016, 28 at 1020, 8 at 1026, 0 at 1030. Words slide in from the right as they are typed.
  - Blur: 6 at 1007-1009, 4.5 at 1010-1012, 2 at 1013-1014, 0 from 1015.
  - Exit opacity follows the 90% text (0.88 … 0.32 over 1054-1058).

**Ring system** (centre x = 960 throughout; ring centre y = 400 for 1004-1022, 405 for 1023-1026, 397 for 1027-1031, 403 for 1032-1044, then 1045 406, 1046 406, 1047 408, 1048 410, 1049 411, 1050 412, 1051 414, 1052 417, 1053 418, 1054 422, 1055 425, 1056 429, 1057 434, 1058 441; ellipse b/a = 0.52 for 1004-1022, 0.54 for 1023-1031, 0.515 for 1032-1058. The rings are concentric circles on a plane tilted about 59° (cos⁻¹ 0.52); draw them as flat SVG ellipses.)
- Phase 1, **1002-1031: main ring + 4 echo rings.**
  - **Main ring** semi-major a1(n) = **454.5·s(n)** px. Measured: 1004 872, 1005 803, 1006 752, 1007 713, 1008 683, 1009 656, 1010 635, 1012 602, 1013 587, 1014 575, 1015 563, 1016 554, 1017 545, 1018 536, 1023 506, 1024 500.
  - **Echo rings 2-5** are time-delayed copies of a second ring R that contracts onto the main ring. R(n) = s(n)·(454.5 + 306·e^(−0.1245·(n−1005))) px (half-life 5.6 frames). Ring k (k = 2…5) has semi-major **a_k(n) = R(n − 2·(k−2))**, i.e. each echo lags the previous by 2 frames.
  - Measured R: 1005 1360, 1006 1209, 1007 1092, 1008 999, 1009 922, 1010 862, 1011 811, 1012 769, 1013 730, 1014 700, 1015 673, 1016 649, 1017 625, 1018 607, 1019 589, 1020 574, 1021 562, 1022 547, 1023 538, 1024 526, 1025 520.
  - Example frame 1020: semi-majors 515 (main), 574, 589, 607, 625. By 1027-1031 all five overlap into one ring of a ≈ 485-500.
  - Echo strength stays about 1.0, falling 0.95 per echo; the main ring is drawn with the same style.
  - Ring style: stroke core about 5-7 px, colour `#8A79EB` near the front (bottom) and `#3B2A92`-`#42358F` on the far sides, plus a soft outer glow (Gaussian about 6 px, same hue, 50% intensity).
  - Specular white hot-spots (`#F3F2FE` to `#FFFFFF`) sit at the **top centre** (about ±60° of arc around 12 o'clock, brightest at the top) and on the **front arc just left of centre** (x ≈ 640-720, the brightest white, about 30° long).
  - Each echo ring carries the same hot-spots, so the top hot-spots read as a stack of white dashes at 1015-1028.
- Phase 2, **1032-1058** (from the impact frame):
  - **Main ring only** at a = 454.5·s(n) (1040: a = 455, b = 234, centre (960,403)). It becomes thin and dim on the sides (core `#140A44`, 3-4 px). The top hot-spot stays white (with chromatic aberration fringes: red above, cyan below) and so does the front-centre hot-spot.
  - **Faint ripple rings** appear at 1032 (15% strength, thin, `#2A1F5A`) at layer radii 720, 845 and 910 (×s(n)). They stay fixed in the layer and fade with the scene.
  - **Big outer sweep ring with 2 echoes**, only its bottom arc visible near y 950-1020: semi-major E(n) (×1.5 of 720p) = 1036 ~1007, 1037 1055, 1038 1100, 1039 1124, 1040 1157, 1041 1172, 1042 1196, then asymptote ≈ 1200 by 1045. Echo copies lag 2 and 4 frames. Strength 1.0 until 1049, then 0.66, 0.57, 0.51, 0.45, 0.42, 0.41, 0.42, 0.37, 0.38 (1050-1058). Colour violet `#5B4BC8` with a white-pink hot-spot at bottom centre (`#724250` to `#C8B8D8`).
- Ring layer exit: same fade as the text over 1054-1058, then cut. A ghost of the rings (5% or less) is visible in 1059-1065 behind the carousel; optional.

### 4C. "Built for" carousel, frames 1059-1126

**Group transform.** "Built for" plus the item track form one group that zooms out continuously around the anchor **(936, 530)**:
**S(n) = 1.0014 − 0.00392·(n−1080) + 0.091·e^(−(n−1059)/4.44)** (max error 0.0075; S = 1.182 at 1059, 1.0 at 1080, 0.722 at 1152). Layout below is at S = 1.
Per-frame boxes are in **Table B**.

**"Built for"** (static text, line 1)
- Bold geometric sans (DM Sans Bold look), white `#F8F8FA`. At S = 1: box **x 738-1199, y 344-434**, centre x 968. Ascender to baseline 90 px, cap height about 83, font-size about 118.
- Baseline y = 432 at S = 1.

**Item line (the track)**
- Semibold (DM Sans SemiBold look), `#F6F5F8`, no glow.
- At S = 1: cap top y ≈ 549, baseline y ≈ 655, cap height ≈ 106, font-size ≈ 150. Gap from the "Built for" baseline to the item cap top is 117 px.
- The centred item's centre x ≈ 972 (= the group centre: centre items sit 8-20 px right of 960).
- Items measured: Fortune 50, True No Code, Governed AI (drawn ×1.11 larger, baseline +15), Every Cloud, Every LLM, Multi-Agents, Zero Lock-in, Banking, Healthcare, Insurance, HR, Sales, Marketing, and the final Agentic AI (×1.10).
- Widths at S = 1 (sharp, 1080p): F50 794, TNC 980, GAI 1018, EC 861, ELLM 701, MA 962, ZL 922, BK 572, HC 800, INS 715, HR 184, SL 376, MK 727.

**Side items (ghosts):** the previous item sits left of the centre item and the next item sits right of it.
- Ghost = the same text at **scale 0.75** of the centre item (fit 0.73-0.76), **blur 3.75 px**, **opacity ≈ 0.085** (fitted against sharp text; reads as `#2A2838` on the background).
- Vertically centred on the item's x-height band: ghost centre y ≈ 610 at S = 1.
- Gap between the centre item's edge and the ghost's inner edge (1080p, measured; values after "/" are for the right ghost):
  - TNC 142/224, GAI 188/195, EC 230/181, ELLM 211/238, MA 202/221, ZL 221 / (BK ghost off-screen), BK 555/516, HC 482/502, INS 507/455, HR 525/438, SL 426/296, MK 266 / (no right item).
  - Median for the long items is **≈ 210 px**.
  - Ghosts are clipped by the frame edges; only "ne 50", "Code", "ed AI", "Every" etc. show.

**Switch timing (the rhythm).** Hold frames are the frames where the centre item is sharp. A "switch frame" shows the move as a motion-blurred smear:

| # | outgoing → incoming | hold of outgoing | smear frame(s) | smear type |
|---|---|---|---|---|
| 1 | Fortune 50 → True No Code | 1059-1062 | **1063 + 1064** | 2-frame: start then end |
| 2 | True No Code → Governed AI | 1065-1068 | **1069 + 1070** | 2-frame: start then end |
| 3 | Governed AI → Every Cloud | 1071-1074 | **1075** | start |
| 4 | Every Cloud → Every LLM | 1076-1080 | **1081** | end |
| 5 | Every LLM → Multi-Agents | 1082-1086 | **1087** | end |
| 6 | Multi-Agents → Zero Lock-in | 1088-1091 | **1092** | end |
| 7 | Zero Lock-in → Banking | 1093-1096 | **1097** | start |
| 8 | Banking → Healthcare | 1098-1102 | **1103** | end |
| 9 | Healthcare → Insurance | 1104-1107 | **1108** | start |
| 10 | Insurance → HR | 1109-1110 | **1111** | end |
| 11 | HR → Sales | 1112-1115 | **1116** | start |
| 12 | Sales → Marketing | 1117-1120 | **1121** | start |
| 13 | Marketing → Agentic AI | 1122-1125 | 1123-1125 slow slide, **1126** dissolve | special (4D) |

Holds are 4-5 frames (one of 2 frames, 1109-1110), so a switch lands about every 5.5 frames (0.18 s).
- **Smear "start" frame** (1063, 1069, 1075, 1097, 1108, 1116, 1121):
  - The outgoing item is still at its centre position at about 90% brightness.
  - A motion trail runs **to the left** from its left edge, 120-240 px long, fading linearly.
  - The left ghost has gone and the right ghost is dimmed.
  - Chromatic aberration fringes show at 1063 only.
- **Smear "end" frame** (1064, 1070, 1081, 1087, 1092, 1103, 1111):
  - Every item is already at its new slot.
  - The incoming centre item shows at about 35-45% brightness, with a trail **to the right** of 150-250 px.
  - The previous item, now the left ghost, shows smeared from x = 0 to its slot at about 2.5× normal ghost brightness.
  - The new right ghost is smeared too.
- **Implementation (exact look):**
  - Animate the track's translateX by one slot (centre item to left slot, right item to centre, scale 1 ↔ 0.75, opacity 1 ↔ 0.085, blur 0 ↔ 3.75) over **0.6 frame** with an expo in-out.
  - Wrap the track in Remotion `<CameraMotionBlur shutterAngle={180} samples={10}>`, which samples the 0.5 frame before each frame.
  - Place each move at these sub-frame times:
    - for an "end" switch at frame k: move from k−0.80 to k−0.20
    - for a "start" switch at frame k: move from k−0.15 to k+0.45 (finishes before k+0.5, so k+1 is sharp)
    - for the 2-frame switches (1063/64, 1069/70): use a 1.0-frame move from k−0.2 to k+0.8
  - Without CameraMotionBlur: draw the smear frames explicitly with a horizontal directional blur of the lengths above.
- **Marketing pre-exit:** centre x 968 (1122), 962 (1123), 945 (1124), 917 (1125), then 1126 = blurred / doubled ("Marketigg"). The left ghost slides along. This is an ease-in leftward slide of 4, 17, 28 px/frame. In 1126 Marketing crossfades (50%) with the first frame of "Agentic AI" and there is a small horizontal smear.
- Group exit: none; the group runs into the final item.
- Entrance at 1059 (hard cut): no fade. S starts at 1.182 and eases out (the exponential term), with chromatic aberration 1059-1063.

### 4D. Final item "Agentic AI" + sparkles, frames 1127-1152
- Same item style and baseline. The text is **left-shifted so that text plus sparkles read as centred**: text box x 586-1243 (at 1141, S = 0.762), sparkles to the right up to x ≈ 1412.
- Size: ×1.10 the normal item (cap top 531, baseline 624 at 1141).
- **Reveal:** soft left-to-right **gradient wipe** about 420 px wide (brightness ramps from 0.15 to 1 across it). Its 50% point sits at x ≈ 960 (1127), 1095 (1133) and passes the end of the text (x 1245) at about 1138. The text is ≥ 90% white everywhere by 1146. At 1127, "Agentic" reads 0.8 to 0.35 left to right and "AI" about 0.15.
- **Sparkles:** three 4-point concave stars ("✦"), flat fill, soft glow (Gaussian 4 px, 60%). Size = tip-to-tip width. Positions are screen @1080:
  - **Big star A**, `#4B35E7`: pops in at **1127**, centre (1360, 555), size 25.
    - Grows to 46 (1128), 61 (1129), 72 (1130), 75 (1131), 77 (1132), a back-out pop.
    - Then settles: 73 (1133), 70 (1134), 66 (1136), 63 (1138-1148), 59 (1152).
    - Drifts with the group zoom: centre x 1360 → 1335 (1134) → 1313 (1140) → 1290 (1152), y 555 → 546.
    - Slight rotation of about 10° clockwise during the pop.
  - **Small star C**, `#210FC7`, the deepest blue: appears **1129** at (1398, 532), size 5.
    - Grows to 14, 21, 24 (1132), 29 (1134), 30 (1136), then 25-27.
    - Drifts to (1365, 520) by 1152.
  - **Medium star B**, lavender `#5C49D4`: appears **1132** at (1364, 492), size 11.
    - Grows to 22, 32 (1134), 44 (1136), 45 (1138), then 43, 37 (1144), 35-38.
    - Drifts to (1335, 492) by 1152.
  - From 1149 the stars brighten with the bloom (A reaches `#8474F0` at 1152).
- **Bloom 1145-1152** (before the cut): a white glow grows around the text. Mean luminance of the band just under the text: 24 (baseline), 26, 28, 34, 43, 55, 67, 82, 99 over 1144-1152.
  - Implement as a text-shadow / bloom layer of the text, blur 18-30 px, opacity 0, 0.05, 0.1, 0.25, 0.45, 0.65, 0.8, 0.9, 1.0 over 1144-1152. The text itself stays 100%.
  - At 1152 the glow halo extends about 45 px around the glyphs.

### 4E. End card, frames 1153-1236 (also the frame 0-3 thumbnail)
**Final layout (1211 = frame 0):**
- **Icon** (gradient monogram): box **x 460-616, y 327-498** (156×171).
  - Gradient: top-left cyan `#35B2DB` → mid `#414CA1`/`#4A44DB` → right magenta-violet `#8C15D5`/`#9D33D8`, with dark inner shading `#1A1B51`.
  - Rounded stroke shapes with "circuit" dot terminals.
- **Wordmark** box **x 646-1472, y 363-478**. The cap tops are at y ≈ 363 and the baseline at 478 (cap height ≈ 113, font-size ≈ 160).
  - "Neural": x 646-1108, ExtraBold rounded geometric, `#F9FAFC`.
  - "Seek": x 1132-1472, Light weight, `#ECECF4`.
  - Gap icon → wordmark: 30 px.
- Icon + wordmark group spans x 460-1472, centre x 966.
- **Pill**: capsule, about **x 717-1245, y 549-696** (528×147, fully rounded).
  - Fill `#1F1A37` (barely lighter than the background `#151227`).
  - Hairline border: a faint violet glow, only visible at the round ends (`#19172C`).
  - **Top light streak** on the top edge at **y = 549**, x 840-1170 (>25% of peak). It has a white hot core `#FFFDFF` about 300 px wide centred at x ≈ 962, fading through `#B6AEE1` and `#6E5FBC` to violet `#3C2F7F` tails. The tail is longer on the right (to x ≈ 1170), 3-5 px thick, with a 6 px glow.
  - **Bottom light streak** at **y = 696**, x 765-1135. Its core is centred at x ≈ 935 (left of centre), white `#F7F4FE`, with violet `#7965DB` to `#4C3E9A` tails.
  - Faint violet glows run around the ends of the capsule.
- **"7-day trial"**: box **x 818-1142, y 596-657**, `#FCFAFF`. Bold rounded sans (DM Sans Bold), cap height ≈ 46, font-size ≈ 64. Centre x 980.
- **URL "neuralseek.com"**: box **x 861-1102, y 736-760**, `#EFEBFB`. SemiBold, x-height ≈ 16, font-size ≈ 30. Centre x 982.

**Build animation:**
- **Icon:**
  - Stroke draw-on. A partial left stroke is visible at 1153: x 417-476, y 361-500 (full height y 327-500 from 1154).
  - The right edge of the drawn part reaches x 509 (1155), 521 (1158), 545 (1159), 567 (1160), 576 (1161), 579 (1163) when the shape is complete. The path draws left stroke → over the arch → down the right leg → right tail.
  - Then the whole icon **slides right**: left edge x 417 (1153), 420 (1159), 422 (1163), 426 (1170), 435 (1175), 449 (1180), 455 (1185), 458 (1190), 460 (1197). This is an ease-in-out, fastest at 1176-1179 (3 px/frame).
- **"Neural":** fixed position from 1153.
  - The letters are drawn by stroke reveal over 1153-1158. At 1153 the N lacks its right stem and the l is missing. Complete by 1158.
  - Strong **white bloom** at the cut, decaying: halo luminance above the word 64, 64, 61, 60, 56, 54, 51, 48, 45, 42, 39, 36, 33, 31, 28, 26, 24, 23 (1153-1170), with 21 = none.
  - Implement as glow opacity from 1.0 at 1153 linear-ish down to 0 at 1171: an exponential with a half-life of about 7 frames, blur about 25 px.
- **"Seek":** left-to-right soft wipe (edge softness about 40 px), plus a fade from blurred.
  - Revealed right edge: x 1186 (1159), 1210, 1222, 1243, 1246, 1269, 1281, 1294, 1309, 1318, 1335, 1356, 1366, 1378, 1398, 1410, 1416, 1435, 1456, 1467, 1474 (1179).
  - That is about 14.4 px/frame (linear). Peak brightness 61 → 253 over 1153-1181.
- **Pill + streaks:** rise from +27 px, decaying as an ease-out. Top streak y: 576 (1155), 572 (1159), 568 (1161), 564 (1165), 561 (1169), 558 (1173), 555 (1179), 553 (1185), 552 (1189), 550 (1197), 549 (1204).
  - The streaks fade up: top-streak peak 0.30 (1153), 0.36 (1157), 0.43 (1161), 0.53 (1165), 0.64 (1169), 0.74 (1173), 0.77 (1175), 0.80 (1181), 1.0 (1183+).
  - The bottom streak lags about 2 frames.
- **"7-day trial":** rises with the pill (text top 615 at 1164 → 596 by 1203) and is wiped/faded in left to right.
  - Visible right edge: 860 (1164), 923 (1165), 972 (1167), 999 (1168), 1043 (1170), 1079 (1171), 1123 (1174), 1140 (1177).
  - Brightness: about 25% at 1160, 50% at 1166, 75% at 1172, 100% at 1181.
- **URL typing**, left-aligned at x = 861:
  - 1171 "n", 1172 "ne", 1173 "neur", 1174 "neura", 1175 "neural", 1176 "neurals", 1177 "neuralse", 1178 "neuralsee", 1179 "neuralseek.", 1180 "neuralseek.c", 1181 "neuralseek.co", **1182 "neuralseek.com"**.
  - That is 14 chars in 12 frames. Each char appears at full opacity. No cursor.
- **Hold shimmer:** the streak hot-spots dip (peak down to about 55%, the hot-spot drifting about 25 px right, then back from the left) with a period of **37 frames**.
  - Top dips at 1179 and 1213-1217.
  - Bottom dips at 1197-1200 and 1234-1237, half a period later.

### 4F. Fade-out 1236-1261
Whole-frame multiply to black: 1.000 (1236), 0.954, 0.926, 0.878, 0.844, 0.819, 0.760, 0.733, 0.686, 0.652, 0.609, 0.568, 0.524, 0.476, 0.433, 0.409, 0.354, 0.320, 0.284, 0.246, 0.203, 0.158, 0.121, 0.088, 0.041, **0.000 (1261)**. This is linear over 25 frames.

---------------------------------------------------------------------------------------------------
## 5. Camera
- No rotation and no pan; the motion is scale-only.
  - 90% shot: layer scale s(n) about the screen centre column x = 960 (Table A). The anchor is effectively y ≈ 530 for the exit zoom 1040-1058 and the elements' own y offsets give the rest.
  - Carousel and final item: group scale S(n) about (936, 530).
  - End card: static.

## 6. Motion blur and optics
- Carousel switches: heavy horizontal motion blur, which the shutter-180° recipe in 4C reproduces. No other motion blur in the segment: the zooms are slow.
- **Chromatic aberration** (radial, about the frame centre) **only for 1032-1063**: red channel scaled ×1.0025 and blue ×0.9978 relative to green. That is about ±2.4 px of fringe at the frame edge and about 1 px around the text.
  - It switches on abruptly at 1032 (the impact) and off abruptly at 1064.
  - In Remotion: three copies of the frame with mix-blend `screen`, R/G/B channel filters, scale 1.0025 / 1 / 0.9978.
- The 90% blur on entrance is a defocus (Gaussian), not directional.

## 7. Sound sync (reference audio onsets; frame = t·30)
- The music runs a 16th grid of about 0.1 s.
- Strong onsets: 1004.8 (ring layer and 90% pop-in), 1010.8, 1016.6, 1028.8, 1034.8 (just after the 1032 impact), 1040.8, 1052.5.
- **Music drops out 1044-1055** (rms 0.05) before the carousel.
- **Drop-in hit at 1058.8**, i.e. the cut to "Built for" at 1059 (rms 0.235).
- Carousel: onsets on the grid at about 1064.7, 1067.7, 1073.7, 1079.7, **1082.7 (strongest, ≈ switch 1081)**, 1088.7, 1097.7, 1100.7, 1106.7, 1110.2, 1115.7, 1121.7, 1124.7. Use whoosh/tick SFX on each smear frame.
- 1130.7 sparkle chime (stars pop 1127-1132).
- **Music drops at 1134** (rms 0.03) and a riser builds under the bloom; onset 1148.6.
- 1153 logo hit (soft).
- End card: quiet tail (rms 0.01-0.05), soft pings at about 1171-1182 could match the url typing. Silence after about 1240.

---------------------------------------------------------------------------------------------------
## 8. WKC ADAPTATION (keep every position, size, frame and motion above; only content and colour change)

**Colour mapping:**
- Violet ring, streak and sparkle colours become WKC blues: `#8A79EB` → `#5AA2F0`, `#3B2A92` → `#1F4F99`, `#4B35E7` → `#3F8CE8`, `#210FC7` → `#1266C9`, `#5C49D4` → `#7FB4F2`, lavender tails `#B6AEE1` → `#BBD7F8`.
- Backgrounds: `#0F0D1A` → ink `#050F19` lifted slightly to `#07131F` so the glow still reads. The violet radial glow `#1B1328` becomes `#0D2238`.
- Hot-spots stay white `#FFFFFF`, with soft highlight `#E6F0FD`.
- Text white `#F7F7F8` (page colour).
- Fonts: big numerals and statements Inter Tight 800 with tracking −0.05em (scaled so the measured cap heights match). Subtitle, url and pill Inter 600.

- **1002-1058 → "3" + "Formats for your website and socials"** (script 33.5-35.5)
  - Replace "90%" with a single **"3"** at the same centre, cap height (188 px at s = 1) and gradient fill (top `#F7F7F8` → bottom `#9AA6B4`). Use exactly the same s(n), opacity, blur and position tables.
  - Optional: inside the main ring, three tiny aspect-ratio outlines (16:9, 1:1, 9:16 rounded rects, 2 px `#5AA2F0`, 35% opacity) sitting on the ring's front arc. They inherit the echo-ring timing (first at 1012, then +2 frames each).
  - Subtitle on two lines, **"Formats for your" / "website and socials"**, typed at the same rate (1 char per frame with the same pauses).
    - Line 1 completes at about 1018, line 2 completes at **1032** (the impact frame, as in the reference).
    - Same rise, word-spacing collapse, blur and line pitch.
  - Rings re-coloured blue as above, with the same echo-ring maths and the same 1032 impact accent (chromatic aberration plus ripple rings).
- **1059-1152 → the six "Built for" statements** (script 35.5-38.5). Keep "Built for" exactly (box, size, S(n)).
  - Items: "Your SaaS Product", "E-commerce Brands", "Your Website Hero", "Advertising", "Marketing", and the final "More Conversions".
  - The items are longer than the reference's, so **fit every item to a max width of 1020 px at S = 1** (the widest reference item, Governed AI, is 1018 at S = 1). Shrink the font-size below 150 px only when needed, and keep the baseline at 655.
  - Ghosts: scale 0.75, blur 3.75, opacity 0.085, inner gap 210 px.
  - Rhythm: six statements in about 3 s means ~15 frames each instead of the reference's 5.5. Reuse the reference's own smear frames so the overlay still lines up:

    | item | hold | switch |
    |---|---|---|
    | Your SaaS Product | 1059-1074 | **1075** (start-type) |
    | E-commerce Brands | 1076-1086 | **1087** (end-type) |
    | Your Website Hero | 1088-1102 | **1103** (end-type) |
    | Advertising | 1104-1115 | **1116** (start-type) |
    | Marketing | 1117-1125 | slide-out 1123-1125, dissolve **1126** |
    | More Conversions | 1127-1152 | final |

    Durations 16/12/16/13/10/26 frames, every switch on a reference switch frame. If the client prefers the original rapid cadence, reuse all 12 reference switch frames and cycle the 5 regular items.
  - "More Conversions" takes the Agentic AI treatment: gradient-wipe reveal 1127-1146, three ✦ sparkles in WKC blues at the same frames, positions and sizes (they suit "conversions" as a spark of success), and the white bloom 1145-1152.
- **1153-1236 → WKC end card** (script: logo 38.5-40, "Let's talk" pill 39-41.5, url 39-42.08)
  - **Icon** = the handwritten **"wkc" monogram**. Its stroke draw-on replaces the icon draw (1153-1163, same order: first stroke visible at 1153, complete at 1163), in a blue gradient `#5AA2F0` → `#3F8CE8` → `#1266C9`. Same box (156×171, or the monogram's natural aspect fitted to height 171) and the same slide-right 417 → 460 over 1153-1197.
  - **Wordmark "WKConversions"** in the "Neural"+"Seek" box (x 646-1472, cap height 113). Either "WK" Inter Tight 800 + "Conversions" Inter Tight 300, or all 800. Width must fit 826 px (scale the font to fit, keep the cap top at 363).
    - "WK" (bold part) takes the stroke-on + bloom 1153-1171.
    - "Conversions" takes the left-to-right wipe at 14.4 px/frame, ending at 1179.
  - **Pill = "Let's talk"** (script's glowing CTA) in place of "7-day trial", same pill box, rise, streak fade-in and 37-frame shimmer.
    - Streaks recoloured: white core, `#BBD7F8` → `#3F8CE8` → `#1266C9` tails.
    - Text Inter 700, cap height 46, centred at x 980, same wipe 1160-1181.
  - **URL "wkconversions.com"** (17 chars), left-aligned so it ends centred at x ≈ 982, i.e. its start x is computed from the final width. Typed 1171-1184 at the reference rate of about 1.2 chars/frame (1171 "w" … 1184 complete), Inter 600 at 30 px.
  - Frames 0-3 of the WKC film = this end card at its 1211 state.
- **1236-1261:** the same linear fade to black.

---------------------------------------------------------------------------------------------------
## Appendix

### Table A: "90%" layer per frame (1080p)
s = layer scale (1.0 at 1040). Centre = centre of the 90% glyph box. Glyph w/h = 688·s / 188·s. Blur = Gaussian sigma. Main ring a = 454.5·s.

| frame | s | centre x | centre y | glyph w | glyph h | opacity | blur | main ring a |
|---|---|---|---|---|---|---|---|---|
| 1005 | 1.788 | 962 | 514 | 1231 | 335 | 0.44 | 10.5 | 813 |
| 1006 | 1.668 | 962 | 498 | 1148 | 313 | 0.62 | 9.0 | 758 |
| 1007 | 1.576 | 963 | 487 | 1085 | 296 | 0.81 | 7.5 | 716 |
| 1008 | 1.504 | 962 | 482 | 1036 | 282 | 1.00 | 7.5 | 684 |
| 1009 | 1.444 | 962 | 475 | 994 | 271 | 1.00 | 6.0 | 656 |
| 1010 | 1.396 | 962 | 470 | 961 | 262 | 1.00 | 6.0 | 634 |
| 1011 | 1.352 | 962 | 467 | 931 | 254 | 1.00 | 4.5 | 614 |
| 1012 | 1.316 | 962 | 464 | 906 | 247 | 1.00 | 4.5 | 598 |
| 1013 | 1.284 | 962 | 460 | 884 | 241 | 1.00 | 3.0 | 584 |
| 1014 | 1.256 | 962 | 459 | 865 | 236 | 1.00 | 2.2 | 571 |
| 1015 | 1.232 | 962 | 457 | 848 | 231 | 1.00 | 1.5 | 560 |
| 1016 | 1.208 | 962 | 454 | 832 | 226 | 1.00 | 0.0 | 549 |
| 1017 | 1.188 | 962 | 454 | 818 | 223 | 1.00 | 0.0 | 540 |
| 1018 | 1.172 | 962 | 452 | 807 | 220 | 1.00 | 0.0 | 533 |
| 1019 | 1.156 | 962 | 451 | 796 | 217 | 1.00 | 0.0 | 525 |
| 1020 | 1.140 | 962 | 449 | 785 | 214 | 1.00 | 0.0 | 518 |
| 1021 | 1.124 | 962 | 449 | 774 | 211 | 1.00 | 0.0 | 511 |
| 1022 | 1.116 | 962 | 448 | 768 | 209 | 1.00 | 0.0 | 507 |
| 1023 | 1.104 | 962 | 447 | 760 | 207 | 1.00 | 0.0 | 502 |
| 1024 | 1.096 | 962 | 446 | 755 | 206 | 1.00 | 0.0 | 498 |
| 1025 | 1.084 | 961 | 445 | 746 | 203 | 1.00 | 0.0 | 493 |
| 1026 | 1.076 | 962 | 446 | 741 | 202 | 1.00 | 0.0 | 489 |
| 1027 | 1.068 | 962 | 445 | 735 | 200 | 1.00 | 0.0 | 485 |
| 1028 | 1.060 | 962 | 444 | 730 | 199 | 1.00 | 0.0 | 482 |
| 1029 | 1.056 | 962 | 444 | 727 | 198 | 1.00 | 0.0 | 480 |
| 1030 | 1.048 | 962 | 442 | 722 | 196 | 1.00 | 0.0 | 476 |
| 1031 | 1.044 | 962 | 442 | 719 | 196 | 1.00 | 0.0 | 474 |
| 1032 | 1.040 | 962 | 442 | 716 | 195 | 1.00 | 0.0 | 473 |
| 1033 | 1.036 | 962 | 442 | 713 | 194 | 1.00 | 0.0 | 471 |
| 1034 | 1.028 | 961 | 442 | 708 | 193 | 1.00 | 0.0 | 467 |
| 1035 | 1.024 | 961 | 442 | 705 | 192 | 1.00 | 0.0 | 465 |
| 1036 | 1.020 | 961 | 442 | 702 | 191 | 1.00 | 0.0 | 464 |
| 1037 | 1.016 | 961 | 442 | 700 | 190 | 1.00 | 0.0 | 462 |
| 1038 | 1.012 | 962 | 442 | 697 | 190 | 1.00 | 0.0 | 460 |
| 1039 | 1.004 | 962 | 443 | 691 | 188 | 1.00 | 0.0 | 456 |
| 1040 | 1.000 | 962 | 442 | 688 | 188 | 1.00 | 0.0 | 454 |
| 1041 | 0.996 | 962 | 442 | 686 | 187 | 1.00 | 0.0 | 453 |
| 1042 | 0.988 | 962 | 442 | 680 | 185 | 1.00 | 0.0 | 449 |
| 1043 | 0.980 | 962 | 443 | 675 | 184 | 1.00 | 0.0 | 445 |
| 1044 | 0.972 | 962 | 444 | 669 | 182 | 1.00 | 0.0 | 442 |
| 1045 | 0.964 | 961 | 445 | 664 | 181 | 1.00 | 0.0 | 438 |
| 1046 | 0.956 | 961 | 446 | 658 | 179 | 1.00 | 0.0 | 435 |
| 1047 | 0.948 | 962 | 446 | 653 | 178 | 1.00 | 0.0 | 431 |
| 1048 | 0.940 | 962 | 447 | 647 | 176 | 1.00 | 0.0 | 427 |
| 1049 | 0.932 | 962 | 448 | 642 | 175 | 1.00 | 0.0 | 424 |
| 1050 | 0.916 | 962 | 449 | 631 | 172 | 1.00 | 0.0 | 416 |
| 1051 | 0.904 | 961 | 449 | 622 | 170 | 1.00 | 0.0 | 411 |
| 1052 | 0.892 | 961 | 452 | 614 | 167 | 1.00 | 0.0 | 405 |
| 1053 | 0.876 | 962 | 452 | 603 | 164 | 1.00 | 0.0 | 398 |
| 1054 | 0.856 | 962 | 455 | 589 | 160 | 0.88 | 0.0 | 389 |
| 1055 | 0.832 | 961 | 457 | 573 | 156 | 0.75 | 0.0 | 378 |
| 1056 | 0.808 | 962 | 459 | 556 | 152 | 0.59 | 0.0 | 367 |
| 1057 | 0.772 | 961 | 463 | 532 | 145 | 0.45 | 0.0 | 351 |
| 1058 | 0.732 | 961 | 466 | 504 | 137 | 0.32 | 0.0 | 333 |
Fitted ease: s(n) = 0.9906 − 0.00571·(n−1040) + 0.587·e^(−(n−1005)/5.41) for 1005-1049 (max error 0.018); after 1049 an extra ease-in shrink on top (see table).

### Table B: carousel per frame, hold frames only (1080p)
"Built for" box (x, y), group scale S (= Built-for width / its width at 1080), centre-item box x, item cap top, item baseline (x-height band bottom), centre-item centre x. Values are measured; the smear frames are omitted.

| frame | item | Built-for x | Built-for y | S | item x | cap top | baseline | item cx |
|---|---|---|---|---|---|---|---|---|
| 1059 | Fortune 50 | 700-1245 | 309-414 | 1.182 | 489-1420 | 546 | 670 | 955 |
| 1060 | Fortune 50 | 708-1236 | 315-417 | 1.147 | 502-1407 | 544 | 666 | 955 |
| 1061 | Fortune 50 | 711-1231 | 319-418 | 1.130 | 510-1399 | 544 | 664 | 955 |
| 1062 | Fortune 50 | 715-1228 | 322-420 | 1.114 | 516-1393 | 544 | 661 | 955 |
| 1065 | True No Code | 720-1221 | 327-424 | 1.088 | 442-1507 | 543 | 658 | 975 |
| 1066 | True No Code | 723-1219 | 328-424 | 1.078 | 447-1503 | 543 | 658 | 975 |
| 1067 | True No Code | 724-1216 | 330-426 | 1.068 | 450-1500 | 543 | 657 | 975 |
| 1068 | True No Code | 726-1215 | 331-426 | 1.062 | 453-1495 | 543 | 655 | 974 |
| 1071 | Governed AI | 729-1210 | 336-429 | 1.046 | 441-1506 | 546 | 673 | 974 |
| 1072 | Governed AI | 730-1209 | 336-429 | 1.039 | 444-1503 | 546 | 673 | 974 |
| 1073 | Governed AI | 732-1207 | 337-430 | 1.033 | 447-1500 | 546 | 672 | 974 |
| 1074 | Governed AI | 732-1206 | 339-430 | 1.029 | 448-1497 | 546 | 672 | 973 |
| 1076 | Every Cloud | 735-1203 | 340-430 | 1.016 | 532-1411 | 549 | 658 | 972 |
| 1077 | Every Cloud | 735-1201 | 340-432 | 1.013 | 534-1408 | 549 | 657 | 971 |
| 1078 | Every Cloud | 736-1201 | 342-432 | 1.010 | 537-1407 | 549 | 657 | 972 |
| 1079 | Every Cloud | 738-1200 | 342-432 | 1.003 | 538-1405 | 549 | 657 | 972 |
| 1080 | Every Cloud | 738-1198 | 343-433 | 1.000 | 540-1402 | 549 | 655 | 971 |
| 1082 | Every LLM | 739-1197 | 345-433 | 0.993 | 625-1323 | 553 | 654 | 974 |
| 1083 | Every LLM | 741-1195 | 345-433 | 0.987 | 627-1321 | 553 | 652 | 974 |
| 1084 | Every LLM | 741-1195 | 346-433 | 0.987 | 628-1320 | 553 | 652 | 974 |
| 1085 | Every LLM | 741-1194 | 346-435 | 0.984 | 628-1318 | 553 | 652 | 974 |
| 1086 | Every LLM | 742-1192 | 348-435 | 0.977 | 630-1318 | 553 | 651 | 974 |
| 1088 | Multi-Agents | 744-1191 | 349-435 | 0.971 | 513-1447 | 547 | 652 | 980 |
| 1089 | Multi-Agents | 744-1189 | 349-436 | 0.967 | 514-1444 | 547 | 651 | 980 |
| 1090 | Multi-Agents | 745-1189 | 349-436 | 0.964 | 516-1443 | 547 | 651 | 980 |
| 1091 | Multi-Agents | 745-1188 | 351-436 | 0.961 | 517-1441 | 547 | 651 | 980 |
| 1093 | Zero Lock-in | 747-1186 | 352-436 | 0.954 | 535-1414 | 552 | 654 | 975 |
| 1094 | Zero Lock-in | 748-1185 | 352-438 | 0.948 | 537-1411 | 552 | 652 | 974 |
| 1095 | Zero Lock-in | 748-1183 | 354-438 | 0.945 | 538-1410 | 552 | 652 | 974 |
| 1096 | Zero Lock-in | 750-1183 | 354-438 | 0.941 | 540-1408 | 552 | 652 | 974 |
| 1098 | Banking | 751-1180 | 355-439 | 0.932 | 700-1234 | 547 | 646 | 968 |
| 1099 | Banking | 751-1180 | 357-439 | 0.932 | 700-1233 | 547 | 646 | 967 |
| 1100 | Banking | 753-1179 | 357-439 | 0.925 | 702-1231 | 547 | 646 | 967 |
| 1101 | Banking | 753-1177 | 357-439 | 0.922 | 703-1231 | 547 | 646 | 968 |
| 1102 | Banking | 754-1177 | 358-441 | 0.919 | 703-1230 | 547 | 645 | 967 |
| 1104 | Healthcare | 756-1174 | 360-441 | 0.909 | 606-1336 | 550 | 648 | 971 |
| 1105 | Healthcare | 756-1174 | 360-441 | 0.909 | 607-1335 | 550 | 648 | 971 |
| 1106 | Healthcare | 756-1173 | 361-442 | 0.906 | 609-1333 | 550 | 646 | 971 |
| 1107 | Healthcare | 757-1171 | 361-442 | 0.899 | 610-1330 | 550 | 646 | 970 |
| 1109 | Insurance | 760-1167 | 366-444 | 0.883 | 649-1281 | 552 | 643 | 965 |
| 1110 | Insurance | 762-1165 | 366-444 | 0.876 | 651-1279 | 552 | 643 | 965 |
| 1112 | HR | 763-1164 | 367-445 | 0.870 | 885-1044 | 552 | 643 | 964 |
| 1113 | HR | 763-1162 | 367-445 | 0.866 | 885-1044 | 552 | 642 | 964 |
| 1114 | HR | 765-1162 | 369-445 | 0.863 | 885-1044 | 552 | 642 | 964 |
| 1115 | HR | 765-1161 | 369-445 | 0.860 | 885-1042 | 552 | 642 | 964 |
| 1117 | Sales | 766-1159 | 370-447 | 0.853 | 798-1117 | 549 | 640 | 958 |
| 1118 | Sales | 768-1158 | 372-447 | 0.847 | 798-1117 | 549 | 640 | 958 |
| 1119 | Sales | 768-1158 | 372-447 | 0.847 | 799-1116 | 549 | 639 | 958 |
| 1120 | Sales | 769-1156 | 373-447 | 0.840 | 799-1116 | 549 | 639 | 958 |
| 1122 | Marketing | 771-1155 | 375-448 | 0.834 | 664-1270 | 544 | 634 | 968 |
| 1123 | Marketing | 771-1153 | 375-448 | 0.831 | 658-1263 | 544 | 634 | 961 |
| 1124 | Marketing | 772-1152 | 375-448 | 0.824 | 645-1245 | 546 | 633 | 945 |
| 1125 | Marketing | 772-1152 | 376-450 | 0.824 | 619-1216 | 546 | 633 | 918 |
| 1127 | Agentic AI | 774-1149 | 378-450 | 0.814 | 604-856 | 534 | 630 | 730 |
| 1128 | Agentic AI | 775-1149 | 378-450 | 0.811 | 600-936 | 534 | 630 | 768 |
| 1129 | Agentic AI | 775-1147 | 379-451 | 0.808 | 595-963 | 534 | 630 | 779 |
| 1130 | Agentic AI | 777-1146 | 379-451 | 0.801 | 592-988 | 534 | 628 | 790 |
| 1131 | Agentic AI | 777-1146 | 381-451 | 0.801 | 591-985 | 534 | 628 | 788 |
| 1132 | Agentic AI | 778-1144 | 381-451 | 0.795 | 589-1012 | 534 | 628 | 801 |
| 1133 | Agentic AI | 778-1143 | 382-451 | 0.792 | 588-1015 | 531 | 627 | 802 |
| 1134 | Agentic AI | 778-1143 | 382-453 | 0.792 | 586-1093 | 531 | 627 | 840 |
| 1135 | Agentic AI | 780-1141 | 382-453 | 0.785 | 586-1093 | 531 | 627 | 840 |
| 1136 | Agentic AI | 780-1140 | 384-453 | 0.782 | 586-1092 | 531 | 627 | 839 |
| 1137 | Agentic AI | 781-1140 | 384-453 | 0.779 | 586-1189 | 531 | 625 | 888 |
| 1138 | Agentic AI | 781-1138 | 385-454 | 0.775 | 588-1216 | 531 | 625 | 902 |
| 1139 | Agentic AI | 783-1137 | 385-454 | 0.769 | 588-1215 | 531 | 625 | 902 |
| 1140 | Agentic AI | 783-1137 | 387-454 | 0.769 | 588-1243 | 531 | 624 | 916 |
| 1141 | Agentic AI | 784-1135 | 387-454 | 0.762 | 589-1242 | 531 | 624 | 916 |
| 1142 | Agentic AI | 784-1134 | 388-456 | 0.759 | 591-1240 | 529 | 624 | 916 |
| 1143 | Agentic AI | 786-1134 | 388-456 | 0.756 | 592-1239 | 529 | 624 | 916 |
| 1144 | Agentic AI | 786-1132 | 390-456 | 0.752 | 592-1236 | 529 | 622 | 914 |
| 1145 | Agentic AI | 787-1131 | 390-456 | 0.746 | 594-1234 | 529 | 622 | 914 |
| 1146 | Agentic AI | 787-1131 | 390-457 | 0.746 | 595-1234 | 529 | 622 | 915 |
| 1147 | Agentic AI | 789-1129 | 391-457 | 0.739 | 597-1233 | 529 | 622 | 915 |
| 1148 | Agentic AI | 789-1128 | 391-457 | 0.736 | 600-1231 | 529 | 622 | 916 |
| 1149 | Agentic AI | 790-1128 | 393-457 | 0.733 | 600-1230 | 529 | 621 | 915 |
| 1150 | Agentic AI | 790-1126 | 393-459 | 0.730 | 601-1233 | 528 | 622 | 917 |
| 1151 | Agentic AI | 792-1125 | 394-459 | 0.723 | 601-1234 | 523 | 625 | 918 |
| 1152 | Agentic AI | 792-1125 | 394-459 | 0.723 | 601-1239 | 519 | 633 | 920 |
