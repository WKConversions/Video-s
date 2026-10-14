# Segment 6b: reference frames 718-865 (23.93-28.83 s)
### "Plug into any LLM" logo-tile orbit, "Deploy anywhere" card picker, "Fully containerized" server card

Analyst scope: frames 720-862. The shots actually run from the hard cut 717 -> 718 to the hard cut 865 -> 866, so this spec covers 718-865 and describes what enters at 714-720 and what leaves at 862-868 (section 0).

**Conventions**
- Every coordinate is in **1920x1080 film pixels**: the reference's 720p measurements multiplied by 1.5. Origin top-left, x right, y down. Angles: rotateZ positive = clockwise on screen. Ring angles are measured clockwise from 3 o'clock (screen coordinates).
- Frame numbers are reference frames; both films run at 30 fps, frame n = n/30 s.
- "Scale" values are uniform scale factors about the stated origin. Unless stated, text and the tile layer scale about the **frame centre (960,540)**.
- Everything was measured: thresholded bounding boxes, luminance/colour profiles, multi-scale template tracking (NCC), RANSAC circle fits for the rings, per-letter peak-brightness for the text wipes. "est." marks inferred values.
- The reference has **no grain** (high-pass std 0.3 in flat areas = JPEG noise) and **no vignette**.
- Font look: a geometric grotesk (DM Sans-like). Headlines are Bold (~700), sentence case, normal tracking; sub-headlines Medium (~500). WKC uses Inter Tight 800 / Inter 500: match the **cap height, baseline and centre**, not the width (cap-height ratio of Inter / Inter Tight = 0.727 em).

---

## 0. Context: what enters and what leaves

**Enters (714-720).** Frames 714-717 are the end of the previous segment's pastel "Report Is Ready!" dashboard (spec seg5): an accelerating pull-back (cards' scale 0.94 @714 -> 0.915 @715 -> 0.895 @716 -> ~0.80 @717, drifting down) with radial zoom blur growing to ~40-60 px at 717. **717 -> 718 is a hard cut** onto a near-black scene. Frame 718 is the new scene at its most extreme: everything ~1.2-2.2x too big, heavy radial zoom blur (smear 25-40 px at mid radius) and a strong **RGB split** (red channel scaled outward, blue inward: 16 px R-B separation at r ≈ 630 px). It settles in a few frames: 719 is legible, CA is gone by 721-722, blur by 725. The audio has a low boom on the cut (step-14 pickup, 716.9).

**Leaves (862-868).** Shot C exits by moving everything **up** with an accelerating, vertically stretched pan (the higher an element, the faster it moves; formula in 4.6), headline letters wiping out left-to-right, vertical motion blur. **865 -> 866 is a hard cut** (on the bar-18 downbeat at 866.9) to the next segment: two silver hexagonal "Compliancy Group" badges (SOC 2 top-left, HIPAA bottom-right) tumbling in and "Enterprise-grade / security" with the same right-side grey wipe. That scene belongs to the next analyst.

---

## 1. Shot list

| # | Frames | Content | In | Out |
|---|---|---|---|---|
| A | **718-767** (50 f) | Dark scene: "Plug into any LLM" / "Connect to any Knowledge Base", 11 glossy logo tiles around two thin glowing rings (rings rotate, two tiles spin) | **hard cut 717->718** with zoom-out settle from ~1.2-2.2x, radial zoom blur + RGB split decaying over 718-724 | accelerating zoom-IN (expo-in) 757-767 + radial blur + RGB fringes, text fades 761-767, tiles fade 763-767, background darkens ~30%: a **dip to near-black**, then **hard cut 767->768** |
| B | **768-818** (51 f) | "Deploy anywhere" / "Cloud freedom", OFF toggle, three glass cards (Azure, aws, IBM) with "Choose" buttons; the selection hops aws -> IBM -> Azure | fade-up from ~45% at 768 to 100% at 775, vertical smear 24 px at 768 decaying by 776, fast camera settle (scale 0.705 -> 0.85 in 6 f) then slow push-in | headline wipes out left-to-right 798-818, Azure deselects 815-818, vertical blur + RGB fringes 815-818, **hard cut 818->819** |
| C | **819-865** (47 f) | "Fully containerized" / "On-prem control", ON toggle (knob slides right), one big server card with a 3-bar server icon and "Choose" | hard cut, light vertical blur 819-822, group zoom-in settle 0.705 -> 1.0 by 841, icon bars un-tilt by 836 | 849-865 accelerating upward pan with vertical stretch, headline wipes out from 853, **hard cut 865->866** |

There are no cursors, no typing and no crossfades in this segment.

---

## 2. SHOT A (718-767): "Plug into any LLM"

### 2.1 Background
- Flat **#100E1B** (luminance ≈ 15). Centre very slightly bluer **#0F0E1F**, top-right corner a touch darker **#0B0D19**. No vignette, no grain.
- During the exit the background itself darkens to ~70%: centre lum 16 (757) -> 14 (760) -> 12 (764) -> 10 (766-767) => ≈ **#0B0A13 at 767** (implement as a black overlay 0 -> 0.30 over 759-767, ease-in).

### 2.2 Rings (behind the tiles and text)
Two concentric, thin, glowing circles centred exactly on **(960,540)**, each with bright travelling "comet" arcs.
- **Inner ring**: rest radius **400 px** (reached at 751-753). **Outer ring**: rest radius **788 px** (reached at 748-750; mostly off-frame, visible as arcs at the lower-left and top-right corners).
- Line: a **3 px white core** (#FCFEFF at the hot spot), glow falling off over ~18 px each side (≈ Gaussian σ 9 px), glow tint grey-violet (#565867 at 2 px, #2E2F41 at 13 px from the core, at the hot spot).
- **Arc profile** (along the ring, both directions from the peak, symmetric): 0°: #FCFEFF; ±5°: #B1ACE2 / #DBD8F5; ±10°: #8579DD / #6A5FBD; ±15°: #584DA9; ±20°: #49408F; ±25°: #373074; ±30°: #2B2759 / #1A1938; gone by ±35-40°. The bright core FWHM is ~19°.
- Between the arcs the whole circle is still faintly visible (lum ~20 vs background 15 ≈ white at 3% opacity).
- **Inner ring arcs**: two arcs **150° apart**. At frame 750: arc #1 at **132°** (lower-left), arc #2 at **282°** (top, slightly right). Both rotate **counter-clockwise at a constant -1.86°/frame** for the whole shot (arc #2: 334° @722 -> 282° @750 -> 256° @764). angle(f) = 132 - 1.86·(f-750) and 282 - 1.86·(f-750).
- **Outer ring arcs**: arc A (bright, peak ~250) at 141° @740 -> 154° @760 (**clockwise +0.65°/frame**, opposite direction), arc B dimmer (peak 50-110, often clipped) at ≈ 320° (top-right).
- **Ring scale** (radius per frame, table T1): rings zoom much more than the text (they act as the nearest layer): inner ring radius 885 (718, est.) -> 716 (719) -> 656 (720) -> 582 (722) -> 506 (726) -> 450 (734) -> 417 (740) -> 404 (746) -> **400 (750-753)**, then grows on the exit: 404 (756) -> 416 (760) -> 459 (764) -> 513 (766). The settle is expo-out (best fit expo-out from 1.87x at 718 over D=46 f; rms 0.015); the exit is **expo-in**: (r/400 - 1) doubles every ~2 frames (0.010 @756, 0.039 @760, 0.148 @764, 0.28 @766).

### 2.3 Logo tiles (11 glossy glass tiles)
- Look: rounded rectangle, **corner radius ≈ 20 px**, fill **#1A1926** (≈ 90% opaque; aws tile #1F1C2B), soft dark drop shadow ~6 px below (#13101F). A **2-3 px rim lit from the left**: the left edge is white-hot over its upper two thirds (#FDFDFF), fading to #9E98C8 lower down and violet #1D144B at the bottom-left corner; the top edge is white only near the top-left corner, #CAC5ED at ~25% of the width, #423A76 at ~50%, gone by ~75%. No rim on the right/bottom edges. Logos are white/near-white (#EFEEF2) except elastic's coloured cluster.
- Rest geometry (frames 753-758, tile-layer scale 1.0) is table **T2**. Wide tiles (~215x100-122) hold glyph + wordmark (wordmark ≈ 146x38-50, i.e. ~67% of the tile width); square tiles (~138x120-130) hold one glyph (~80x55-90).
- **Tile layer motion** (all tiles together, about (960,540)): scale + rotateZ, table T1 columns 4-5. Measured from the 9 non-spinning tiles (rms 2-4 px early, < 1 px after 745):
  - Entry: scale 1.32 (718, est.) -> 1.25 (720) -> 1.126 (726) -> 1.068 (730) -> 1.035 (736) -> 1.012 (745) -> **1.000 (753)**; the curve is expo-out (fit: expo-out from 1.32 at 718, D = 55 f, rms 0.003). The layer also **starts rotated clockwise and unwinds counter-clockwise into place**: rotateZ +2.2° (718, est.) -> +1.47° (726) -> +1.10° (730) -> +0.71° (736) -> +0.31° (745) -> 0° (755). Residual translation ≤ (−1, +3) px early; ignore.
  - Exit: scale 1.0016 (757), 1.0038, 1.0079, 1.0161 (760), 1.0282, 1.0462, 1.0715 (763), **1.1048 (764)**, ≈1.16 (765), ≈1.25 (766), ≈1.40 (767) (765-767 est. from the ring/blur; the tiles are smeared).
- **Per-tile spins** (on top of the layer):
  - **T9 (OpenAI, lower-left square)**: rotateZ **0° -> +360° (clockwise) from 729 to 760, cubic in-out** (fit rms 4°). Measured: +1° (728), +4° (730), +9° (732), +17° (734), +28° (736), +45° (738), +68° (740), +102° (742), +162° (744), +232° (746), +280° (748), +310° (750), +329° (752), +342° (754), +349° (756), +357° (758), +360° (761).
  - **T2 (Meta, top-right square)**: rotateZ **0° -> -360° (counter-clockwise) from 753 to ~767, ease-in-out (.42,0,.58,1)**. Measured: -1° (753), -5° (754), -13° (755), -30° (756), -57° (757), -97° (758), -151° (759), -200° (760), -239° (761), -268° (762), -287° (763). The shot cuts before it lands.
  - Small static tilts: T5 Claude +2° (+1.5..3.8° measured), T7 mistral -2°.
- Tile opacity: 1.0 until 762, then 0.97 (763), 0.89 (764), 0.75 (765), 0.50 (766), **0.09 (767)** (peak-brightness based; part of the drop at 766-767 is smear).

### 2.4 Headline "Plug into any LLM"
- White **#FFFFFF**, Bold geometric grotesk, sentence case, normal tracking. Rest box (753-758) **(590,477)-(1326,561)**; **cap height 61.5 px** (P: 478.5 -> 540), x-height 45, **baseline y = 540**, descender to 561; centre x **958**. Ref font ≈ DM Sans 700 at ~88 px; **Inter Tight 800: 85 px**.
- Soft white glow: +20 lum right at the edge, half gone 9 px out, gone by ~25 px => `text-shadow: 0 0 14px rgba(255,255,255,.28), 0 0 34px rgba(255,255,255,.08)` (at 1080p).
- Scale about (960,540): ~1.20 (718, smeared), **1.165 (719)**, 1.130, 1.110, 1.095, 1.085, 1.070 (724), 1.065, 1.050, 1.045, 1.035, 1.025 (729), 1.025, 1.015, 1.010, 1.005 (733), 1.000 from 736 (expo-out, half-life 4.1 f: s = 1 + 0.167·2^(-(f-719)/4.1)). Exit: 1.005 (759), 1.010, 1.025, 1.035, 1.055 (763), 1.090, 1.130 (765), est. 1.17, 1.21 (767).
- **Left-to-right reveal wipe** (a moving linear opacity ramp, not letter pops): α(x) = clamp((front − x)/W, 0, 1), x measured in the rest layout (before the scale). Measured front (1080p): 1185 (719), 1218 (720), 1311 (723), 1408 (726), 1463 (728), 1550 (730), 1641 (733), 1728 (736), 1813 (739), 1888 (742), 1953 (745), ≈2095 (748), all letters at 100% from **756**; ramp width W grows 735 (719) -> 850 (730) -> 950 (737) -> ~950 (745). Practical fit: **front = 1185 + 30·(f−719), W = min(960, 735 + 9·(f−719))**. At 719 that gives "Plug" 81-62%, "any" 25-11%, "LLM" ≈ 0-4%; at 730 "LLM" 45/38/28%; at 750 "LLM" 95/92/82%.
- Exit: uniform fade, α = 1.0 (760), 0.94, 0.82, 0.66 (763), 0.47, 0.31, 0.19, 0.09 (767) — ease-in, together with the zoom.

### 2.5 Sub-headline "Connect to any Knowledge Base"
- White **#FEFEFF**, Medium (~500). Rest box **(646,600)-(1269,639)**, **cap height 30 px** (K: 600 -> 630), x-height 21, **baseline y = 630**, centre x 958. **Inter 500: 41 px.** No visible glow.
- Fully opaque from 719 (no wipe). Scale about (960,540): ~1.27 (718), **1.215 (719)**, 1.175, 1.155, 1.150, 1.140, 1.125 (724), 1.110, 1.100, 1.090, 1.080, 1.070 (729), 1.065, 1.060, 1.055, 1.050, 1.045, 1.040 (735), 1.035, 1.030 (738), 1.025 (740), 1.020 (742), 1.015 (745), 1.010 (748), 1.005 (752), 1.000 (755). Expo-out, half-life ≈ 6.8 f: s = 1 + 0.204·2^(-(f-719)/6.8). It settles ~20 frames later than the headline (a slower, "deeper" layer).
- Exit: 1.01 (761), 1.02, 1.035, 1.06 (764), 1.095 (765); α = 1.0 (761), 0.88, 0.73, 0.47, 0.29, 0.16, 0.07 (767).

### 2.6 Camera, blur, chromatic aberration (shot A)
- There is no single rigid camera: every layer scales about the frame centre with its own curve (rings strongest, then tiles, sub, headline), which reads as a 3D dolly with parallax. Use the per-layer tables (T1).
- **Motion blur = radial zoom blur** proportional to the per-frame scale change × radius, shutter ≈ 180° (smear ≈ 0.5 × per-frame displacement). Entry: 718 extreme (25-40 px at mid radius, text unreadable), 719-722 the sub shows a ~5-6 px horizontal echo at "Connect" (≈ σ 1.5-2 px overall), 723-724 σ ≈ 0.75 px, sharp from 725. Exit: ≈ 12 px (764), 22 px (765), 38 px (766), 55 px (767) at r ≈ 750 (est. from the scale rates), streaks radial.
- **RGB split** (red scaled outward, blue inward about the centre): 718: R-B ≈ 3.8% of the radius (≈ 24 px at r = 630); 719: ≈ 0.6% (4 px); 720: ≈ 0.25%; 721-722: < 1 px; none 723-763; exit 765-767: 1.5-4 px plus rainbow fringes on the smeared tiles.

---

## 3. SHOT B (768-818): "Deploy anywhere"

### 3.1 Background
- Base **#0B0D19** (top centre / right), a soft violet wash in the top-left (**#151120** at the corner, fading by x ≈ 500), and a violet **floor glow** at the bottom centre (#131020 @780 -> #171125 @795 -> #1C142B @805 -> #20152E @815, centre ≈ (960, 1150), radii ≈ 900x450, it brightens as the camera pushes in). Bottom-left/right corners #0F0D1A / #14101F.
- **Fade-in from black on the cut**: global opacity ≈ 0.45 (768: background #06090E), 0.80 (769), 0.88 (770), 0.94 (772), 1.0 (775).

### 3.2 Camera (shot B)
Measured on "Cloud freedom" (the most neutral layer), table T3.
- **Scale** (about the frame centre, combined with the translation below): 0.705 (768), 0.745, 0.770, 0.800, 0.815, 0.835, 0.850 (774), 0.860, 0.870, 0.880, 0.890, 0.900 (779), 0.905, 0.915, 0.925, 0.925, 0.935, 0.945 (785), 0.950, 0.955, 0.965, 0.970 (789-790), 0.980, 0.990, 0.990, **1.000 (794-796)**, 1.010, 1.010, 1.020, 1.020 (800), 1.030, 1.030, 1.040, 1.045, 1.050 (805), 1.055, 1.065, 1.065, 1.075, 1.075 (810), 1.085, 1.095, 1.105, 1.105, 1.115 (815), 1.120, 1.120, 1.130 (818). = a fast expo-out settle (half-life ≈ 3.3 f) riding on a **linear push-in of +0.005/frame**, slightly accelerating after 810: s ≈ 1 + 0.005·(f−795) − 0.16·2^(−(f−768)/3.3).
- **Translation**: with scaling about (960,540), the content additionally moves down: ty ≈ −21 (768) -> −20 (774) -> −15 (782) -> −7 (790) -> 0 (795) -> +6 (800) -> +15 (805) -> +25 (810) -> +36 (813) -> +44 (816) -> +57 (818) px. Lower elements move down faster than this (the card row is on a tilted plane): use T3's per-element positions for the cards.
- **Roll (rotateZ)**: ≈ +1.0° (769-782) -> +0.5° (784-788) -> 0° (790-801) -> −0.4° (804) -> −0.8° (807-818). Ease-in-out between.
- Motion blur: vertical smear 24 px (768), ≈ 9 px (769-771), ≈ 4.5 px (772-775), sharp 776-812, 4.5 px (812-815), 9-12 px (816-818).

### 3.3 Headline "Deploy anywhere"
- White, Bold, same style and glow as 2.4. At 795: box **(640,166)-(1263,246)**, **cap height 55.5** ("D" 166.5 -> 222), centre x 952. The headline has its **own clockwise tilt of ≈ +1.3°** on top of the camera roll (baseline 222 under "D", 235.5 under the final "e"); total tilt +2.5° (775), +2.0° (785), +1.5° (790), +1.3° (795), +1.0° (800), +0.7° (805), +0.45° (810), +0.35° (812). Inter Tight 800 ≈ **76 px** at camera scale 1.0.
- "Deploy" centre per frame in T3 (it moves with the camera: (820,270) @768 -> (765,202) @795 -> (746,215) @815).
- **Reveal wipe in** (same mechanism as 2.4; x in the 795 layout, 1080p): front 1059 (768), 1227 (775), 1319 (780), 1433 (786), 1509 (790), 1586 (795), 1632 (797), 1680 (800), ≈1700 (805), ≈1740 (810); W ≈ 650 (615-690 measured). It decelerates and never quite finishes: the last "e" peaks at ~90% at 812-813. At 795: "Deploy" 100%, "a" 96%, "n" 90%, "y" 82%, "w" 76%, "h" 70%, "e" 63%, "r" 55%, "e" 49% (colour of the end letters ≈ #A3A6AF).
- **Wipe out** (starts at the left while the right is still revealing): α_out(x) = clamp((x − tail)/W_out, 0, 1), W_out ≈ 645; tail (1080p, 795 layout): ≈ 90 (800), 306 (805), 455 (810), 567 (813), 633 (815), 729 (817), 777 (818) => ≈ +24 px/frame (720p) = **+36 px/frame**, linear after 803. α = min(α_in, α_out). "D" is gone at 815, "Deplo" by 818 ("loy anywhere" visible at 817).

### 3.4 Sub-headline "Cloud freedom"
- White #FDFEFF, Medium. At 795: box **(807,277)-(1110,315)**, **cap height 32** ("C" 277.5 -> 310.5), baseline 310.5, centre x 958. **Inter 500 ≈ 44 px** at camera scale 1.0. Opaque from the first frame (only the global fade-in). Follows the camera (T3).

### 3.5 Toggle (OFF)
- Pill track **#D3D2D7**, at 795: **(909,397)-(1009,445) = 100x48**, centre (959,421). Knob: circle **30 px**, **#5940DE**, centre (938,421) (left position, 8 px inset). No shadow visible.
- Track follows the camera (T3; 76x39 at 770 -> 112x52 at 818). The **knob starts sliding right at ~797, ease-in**: knob x (1080p) 938 (795), 940 (798), 941 (800), 945 (804), 948 (807), 952 (810), 958 (813), 963 (815), 966 (816), 969 (817), 974 (818) — i.e. from 21% left of centre to 13% right of centre of the track by the cut; shot C continues the throw.

### 3.6 The three cards
Glass cards, same material as the tiles (2.3) but larger. Design size (Azure card at 795, unselected) **444x330, corner radius ≈ 18**, fill **#131021-#151225** (≈ +3 lum over the background), rim lit from the top-left. Inside, centred horizontally: logo centre at **−70 px** and "Choose" button centre at **+70 px** from the card centre (at card scale 1).
- Logos (at 795): Azure ≈ 96x84, aws ≈ 129x81, IBM ≈ 147x65 (unselected size).
- Button: pill **214x90**, label "Choose" (Medium, cap ≈ 17, Inter 500 ≈ 24 px), at card scale 1.
- **States**:

| | selected | unselected |
|---|---|---|
| card scale | ×1.20 | ×1.00 |
| logo | #FFFFFF | #5C5C65 (Azure) / #535264 (aws) |
| button fill | **#513ADF** (+ soft violet glow ≈ 8 px) | **#241D53** |
| button text | #FDF5FF | #61588E |
| rim | left edge white #D2CFEE -> #6154AE at 40% -> #403675 at the bottom; top edge white at TL -> #857CBF at 20% -> #594CA6 at 40% -> #2B2457 at 70% -> gone at 85% | same shape at ~20% (lum 27-42) |
| fill | #161425 -> #1C1427 (slightly lighter) | #131021 |

- **Layout at 795** (card centres, 1080p): Azure **(481,727)** unselected, rel. scale **1.00**; aws **(962,729)** unselected, rel. scale **0.88**; IBM **(1406,710)** selected, rel. scale 0.91 × 1.2 = **1.09**. (The cards sit on a perspective row: the middle one is smallest, and the row turns over the shot so the right card grows faster: IBM/Azure size ratio 0.77 @776 -> 0.85 @805 -> 0.90 @813.) Card top-left corners at 795: Azure (252,560), aws (768,564), IBM selected (1164,533)-(1635,906).
- **Per-frame**: T3 gives each card's logo scale (relative to that card at 795), logo centre and selection weight. Card scale vs design = logo_s × (1.00 Azure | 0.88 aws | 1.09 IBM); card centre = logo centre + (0, 70.5 × card scale).
- **Selection timeline** (weights from the button colour; scale progress from the logo scales):
  - 768-781: **aws selected**.
  - **781-784 aws deselects**: colour weight 0.86, 0.58, 0.18, 0; scale ×1.2 -> ×1.0 over 781-784 (progress 0, 0.47, 0.93, 1) — fast.
  - **782-787 IBM selects**: colour weight 0.16, 0.37, 0.59, 0.83, 0.97, 1.0; scale progress 0.46 (782), 0.65, 0.82, 0.82, 1.0 (786) — expo-out ≈ 5 f.
  - **797-802 IBM deselects**: colour 1.0 (798), 0.71, 0.42, 0.14, 0 (802); scale 797-800.
  - **799-804 Azure selects**: colour 0.03 (800), 0.30, 0.59, 0.87, 1.0 (804); scale progress 0.2 (799), 0.55, 0.70, 0.88, 1.0 (803).
  - **815-818 Azure deselects** (exit): colour 0.88, 0.60, 0.30, 0.01; scale ×1.2 -> ×1.13 by 818 (logo s 1.25 -> 1.13).
- Exit blur 815-818: vertical smear + small RGB split on the cards (red left / blue right fringes ≈ 2-3 px).

---

## 4. SHOT C (819-865): "Fully containerized"

### 4.1 Background
- Base **#0B0D19 / #090D16** (top centre/right), violet wash top-left **#171022**, strong violet **floor glow** bottom centre: **#20152F** at (630,1050), **#30233C-#31233D** behind the lower card, falling to #1B1328 at x ≈ 1350 and #0D0C19 at the right edge. Centre ≈ (960, 1150), radii ≈ 700x420. No grain/vignette.

### 4.2 Headline "Fully containerized"
- White, Bold, same style/glow. At rest (842-849): box **(514,175)-(1404,269)**, **cap height 67.5** ("F" 178.5 -> 246), **baseline 246**, descender 268.5, centre x **959**. Inter Tight 800 ≈ **93 px**.
- Scale/centre of the word "Fully" in T4: 0.880 (819), 0.900, 0.920, 0.920, 0.925, 0.925, 0.940 (825), 0.940, 0.945, 0.955, 0.955, 0.965 (830), 0.970, 0.970, 0.975, 0.975, 0.980 (835), 0.985, 0.990, 0.985, 0.990, 0.995 (840), 0.995, **1.000 (842)**; drifting from (672,216) to (624,220).
- **Reveal wipe in**: front (1080p, rest layout) 1116 (819-820), 1265 (824), 1433 (830), 1577 (835), 1710 (840), 1851 (845), 1985 (850), 2010 (851); W ≈ **900** (fit 885-930). Linear: **front ≈ 1116 + 29.4·(f−820)**. At 845 "conta" 100%, "i" 89%, "n" 85%, "e" 80%, "r" 75%, "i" 69%, "z" 64%, "e" 58%, "d" 53% (end colour ≈ #9A9CA4).
- **Wipe out** from 853: tail (1080p, W_out ≈ 975) ≈ −360 (853), −262 (854), −174 (855), −97 (856), 0 (857), +98 (858), +215 (859), est. +330 (860), +460 (861), +600 (862) (accelerating). "F" α: 0.92 (853), 0.82, 0.73, 0.65, 0.55, 0.45, 0.33 (859); "ully containerized" remains at 862 while the word leaves the top of frame.

### 4.3 Sub-headline "On-prem control"
- White, Medium. Rest box **(793,327)-(1141,368)**, **cap height 30** ("O" 327 -> 358.5 incl. overshoot), baseline 358.5, centre x 967. **Inter 500 ≈ 41 px.** Scale/centre in T4: 0.835 (819) -> 0.93 (824) -> 0.965 (830) -> 0.99 (837) -> 1.0 (842).

### 4.4 Toggle (ON)
- Track **#513ADF** pill, rest **(900,442)-(1020,499) = 120x57**; knob **white**, **34.5 px**, rest centre **x 991.5, y 470**.
- The cut lands with the toggle already ON-coloured but the knob still on the left: **knob x 933 (819) -> 945 (820) -> 952 (821) -> 961 (823) -> 968 (825) -> 973 (827) -> 978 (829) -> 981 (831) -> 984 (833) -> 986 (835) -> 988 (837) -> 989 (839) -> 991 (841)**: expo-out, ≈ half the travel in 3 frames. Track grows with the camera: 96x47 (819) -> 114x53 (825) -> 120x57 (842).

### 4.5 Server card group (card + icon + button)
- **Card**: rest left 678, top 571.5, right 1239 => **561 wide**, ≈ 578 tall (bottom ≈ 1150, off-frame until the exit), **corner radius ≈ 22**. Fill **#231E33** (top) -> **#2F233C** (bottom, the floor glow shows through). Rim: left edge **#FEFAFF** (upper third) -> #BFB4EC (middle) -> #6251AF -> #47377E (bottom); top edge #FCFAFF at the TL corner -> #7F72C2 at 1/3 -> #453B78 at 2/3 -> gone at ~90%; 3 px line + ~9 px inner glow.
- **Server icon**: three stacked white (#FFFFFF) rounded bars, total **168x147** at rest, centre (958,762); each bar ≈ 168x47, gap ≈ 3, radius ≈ 9; on each bar three dark dots (left) and a dark dash ≈ 45x7 (right), colour ≈ the card fill.
- **Button "Choose"**: pill **(837,907)-(1083,1011) = 246x104**, centre (960,959), **#513ADF**, white text (bbox 136x28, Inter 500/600 ≈ 37 px).
- Relative layout at rest: card centre (958.5, 860); icon centre at −98 px, button centre at +99 px from the card centre.
- **Entry** (group scale = button scale, about the card centre): 0.705 (819), 0.785, 0.815, 0.850, 0.875, 0.900 (824), 0.910, 0.930, 0.930, 0.940, 0.955 (829), 0.955, 0.965, 0.975, 0.975, 0.980, 0.990 (835-840), **1.000 (841)**. Button centre y 884 (819) -> 898 -> 906 -> 912 -> 918 -> 921 (824) -> 925 -> 928 -> 931 -> 932 -> 935 (829) -> 936 -> 938 -> 940 -> 942 -> 944 -> 946 (835) ... 956 (842) -> 959 (845). Card left/top rim (1080p): (711,563) @822, (695,564) @826, (687,566) @830, (683,567) @835, (680,569) @840, (678,571) @845.
- **Bar tilt cascade**: the three bars are each rotated **≈ −5.5°** (counter-clockwise, right end up) from 819 to ~831 (the lower two relax first: −3.5° at 829-831 while the top bar is still −5.4°), then straighten: −3.7° (833), −2.2° (834), −1.2° (835), 0° (836). Ease-out.
- The card itself shows a slight 3D skew during 819-822 (bottom edge rising to the right by ≈ 2.5°, est. rotateY ≈ −8° with perspective 1600) that is gone by 826.

### 4.6 Camera and exit (shot C)
- 819-841: per-element zoom-in settle (T4). Text layers: scale 0.835-0.88 -> 1.0, moving down 3-21 px; the card group starts smaller (0.705) and lower elements travel further.
- 842-849: hold.
- **849-865 exit**: everything moves up with an accelerating curve, **displacement proportional to the distance from a pivot below the frame**: translateY(f) = −k(f)·(1958 − y_rest) (1080p, y_rest = the element's rest centre y), with k = 0.0019 (850), 0.0037, 0.0056, 0.0075 (853), 0.0093, 0.013 (855), 0.0186, 0.0242, 0.0298, 0.0391 (859), 0.0503, 0.0634, 0.082 (862), 0.108, 0.150 (864), 0.226 (865). Check: button (y 959) moves −150 px at 864, the sub (y 347) −242 px. Scale drifts 1.00 -> 1.02 (856) -> 1.04 (860-864) -> 1.07 (865). Vertical motion blur ≈ half the per-frame displacement (≈ 20 px on the button at 864, ≈ 35 px at 865).

---

## 5. Camera summary
- A: no global camera; per-layer zoom about (960,540) (rings > tiles > sub > headline), tile layer starting at +2.2° (clockwise) and unwinding to 0° by 755, rings rotating (inner −1.86°/f, outer +0.65°/f), exit zoom-in expo-in.
- B: zoom 0.705 -> 1.13 (expo settle + linear push), slight downward drift, roll +1° -> −0.8°.
- C: zoom-in settle to 1.0 by 841-842, hold 842-849, accelerating upward pan with vertical stretch 849-865.

## 6. Sound sync (reference events; see spec/audio.md)
| Frame(s) | Visual | Sound |
|---|---|---|
| 714-718 | cut to the dark scene, zoom/RGB-split settle | low boom on the step-14 pickup (716.9), impact on 718 |
| 723 | (settling) | bar-15 downbeat |
| 728-729 | OpenAI tile starts its spin | bright tick (HF spike at 728) |
| 751-759 | Meta tile spin starts 753; exit begins 757 | soft mid swish |
| 764-768 | zoom-in exit, dip, cut | whoosh into the cut; UI blip 766.5-768.6 as the scene opens on the selected aws card |
| 771 | (camera settle) | bar-16 downbeat |
| 782-786 | selection jumps to IBM | glassy UI blip (782.7-785.7) |
| 797-803 | selection jumps to Azure | short reverse swell + blip (797-801) |
| 806-818 | toggle knob starts creeping right | ratchet ticks 806-812, reverse swoosh 812-823 |
| 819 | cut to "Fully containerized", knob throws to ON | swoosh stop at the bar-17 downbeat (818.9) |
| 852-865 | upward exit | rising whoosh, bright tick ~860 |
| 866 | cut to the badges | bar-18 downbeat (866.9) |

---

## 7. WKC ADAPTATION
Keep every size, position, timing, curve, blur and the cut/dip structure above; change only content and colours. The script lines map one-for-one onto the three shots (the reference's frames win over the script's rounded seconds): **A 718-767 = "Made for every platform" / "From websites to social ads"; B 768-818 = "Publish anywhere" / "Every format"; C 819-865 = "Multiple versions" / "One project".**

**Palette mapping** (reference violet -> WKC blue):
- Backgrounds: A flat **#08111E** (same luminance as #100E1B). B/C base **#07101C**, top-left wash **#0B1A30**, floor glow **#0E2342** (B, brightening to **#123058** at 815) / **#16385F** behind the C card.
- Ring arcs: core #FFFFFF, ±5° **#E6F0FD**, ±10° **#8DC0FF**, ±15-20° **#3F8CE8**, ±25° **#1B4FB8**, ±30° #0F2E6B, gone by ±35-40°; faint base circle rgba(141,192,255,.04); glow tint #5D6B80.
- Tile / card rims: white -> **#8DC0FF** -> **#3F8CE8** -> **#1B4FB8** -> transparent (same positions as 2.3 / 3.6 / 4.5). Tile fill **#101C2C**; card fill unselected **#0E1828**, selected **#132138**, C card **#152338 -> #1A2C45**.
- Buttons: selected **#3F8CE8** with white text and a soft #3F8CE8 glow; unselected **#12284D** with text **#6F8DB8**. Unselected logos **#5C6573**.
- Toggle OFF: track **#D6DEE9**, knob **#3F8CE8**. Toggle ON: track **#3F8CE8**, knob white.
- Text: white with the same glow. The grey end of the wipe is the same white at partial opacity (do not tint it).

**Typography**: headlines Inter Tight 800, tracking −0.05em, sized by cap height: A 85 px (cap 61.5, baseline 540, centred on x 958), B 76 px at camera 1.0 (cap 55.5, baseline 222 at its left end, keep the +1.3° tilt), C 93 px (cap 67.5, baseline 246, centre 959). Subs Inter 500: A 41 px (baseline 630), B 44 px (baseline 310.5), C 41 px (baseline 358.5). Keep the wipes: re-express front/tail in the new text's own x range (same speed in px/frame, same W), so the right-most third of each headline is still grey when the shot settles, exactly like the reference.

**Shot A — "Made for every platform" / "From websites to social ads".** The orbit of tiles becomes the platforms WKC delivers to. Keep all 11 tile boxes (T2), materials, the layer motion and both spins; swap logos (monochrome white glyph + Inter 600 wordmark, sized like the reference's: wordmarks ≈ 67% of the tile width, single glyphs ≈ 55-60% of the tile height):
| ref tile | WKC tile |
|---|---|
| T1 Gemini (wide) | browser-window glyph + "Website" |
| T2 Meta (square, spins −360° 753-767) | Meta ∞ glyph (Meta ads); keep the spin |
| T3 milvus (wide) | "in" glyph + "LinkedIn" |
| T4 IBM (square) | YouTube play glyph |
| T5 Claude (wide, +2°) | camera glyph + "Instagram" |
| T6 elastic (wide, the coloured one) | TikTok note glyph (its cyan/red offset may stay coloured, like elastic) + "TikTok" |
| T7 mistral (square, −2°) | X glyph |
| T8 Pinecone (wide) | "Google Ads" (glyph + wordmark) |
| T9 OpenAI (square, spins +360° 729-760) | shopping-bag glyph (Shopify / e-commerce); keep the spin |
| T10 deepseek (wide) | "Webflow" (W glyph + wordmark) |
| T11 aws (squarish, stacked wordmark) | "vimeo" stacked wordmark (or a generic "Ads" play-badge if trademark use is a concern) |
If platform marks cannot be used, use generic line glyphs (globe, briefcase, camera, play, music note, megaphone, bag) with the platform names as the wordmarks; keep the wide/square split.

**Shot B — "Publish anywhere" / "Every format".** Same cards, toggle (OFF, knob creeping right from 797) and the selection hops on the same frames (middle -> right at 782-787 -> left at 799-804 -> none at 815-818). The three cards become **export formats**: left (Azure) **"16:9"**, middle (aws) **"1:1"**, right (IBM) **"9:16"** — each "logo" is a rounded outline frame of that aspect ratio with a small play triangle inside, about the reference logo's size (≈ 96-147 wide, ≈ 65-85 tall at card scale 1), the ratio label set in Inter 600 ≈ 28 px under it if space allows (else omit). Button label **"Publish"** instead of "Choose". (Shot A already shows the platforms, so B shows the formats; the later "3 Formats" scene at 33.5-35.5 s re-uses the idea with real thumbnails.)

**Shot C — "Multiple versions" / "One project".** Toggle ON with the same knob throw. The server card becomes the **project card**: keep the card, rim, glow and button geometry; the 3-bar server icon becomes **three stacked version bars** with exactly the same size, radius and tilt cascade: on each bar a small dark play triangle + "V1" / "V2" / "V3" (Inter 700, dark ink #050F19, ≈ 22 px) on the left and the dark dash on the right (a mini progress bar: 100% / 70% / 40%). Button label **"Render all"**. The bar tilt cascade (−5.5° -> 0 by 836) now reads as the versions fanning out of one project.

**Transitions**: identical to the reference — the 718 cut with zoom/RGB-split settle, the 757-767 zoom-in with dip to near-black, the 768 fade-up with vertical smear, the 818/819 hard cut with the knob throw, the 849-865 stretched upward exit into the 866 cut.

---

## 8. Appendix: measured per-frame tables

### T1 Shot A per-frame layer values (1080p). Scales are about (960,540). "Wipe front" is in the rest layout (α = clamp((front − x)/W)); measured values, the text gives the linear fit. Ring radii are the rings' centre-line radii; ring arcs: inner ring angles (clockwise from 3 o'clock). Text α / tile α are the exit fades.

| f | headline s | sub s | tile layer s | tile layer rot° | inner ring r (px) | outer ring r (px) | ring arc #1 / #2 angle° | headline wipe front x | text α (head/sub) | tiles α |
|---|---|---|---|---|---|---|---|---|---|---|
| 718 | ~1.20 (blurred) | ~1.27 (blurred) | 1.321 | 2.21 | 885 | off-frame | 192 / 342 | 1190 | 1.00/1.00 | 1.00 |
| 719 | 1.165 | 1.215 | 1.283 | 2.10 | 716 | off-frame | 190 / 340 | 1210 | 1.00/1.00 | 1.00 |
| 720 | 1.130 | 1.175 | 1.250 | 2.00 | 656 | off-frame | 188 / 338 | 1231 | 1.00/1.00 | 1.00 |
| 721 | 1.110 | 1.155 | 1.220 | 1.90 | 614 | off-frame | 186 / 336 | 1252 | 1.00/1.00 | 1.00 |
| 722 | 1.095 | 1.150 | 1.194 | 1.81 | 582 | off-frame | 184 / 334 | 1272 | 1.00/1.00 | 1.00 |
| 723 | 1.085 | 1.140 | 1.171 | 1.71 | 556 | off-frame | 182 / 332 | 1293 | 1.00/1.00 | 1.00 |
| 724 | 1.070 | 1.125 | 1.151 | 1.62 | 536 | off-frame | 180 / 330 | 1314 | 1.00/1.00 | 1.00 |
| 725 | 1.065 | 1.110 | 1.133 | 1.53 | 520 | off-frame | 178 / 328 | 1334 | 1.00/1.00 | 1.00 |
| 726 | 1.050 | 1.100 | 1.126 | 1.47 | 506 | 956 | 177 / 327 | 1355 | 1.00/1.00 | 1.00 |
| 727 | 1.045 | 1.090 | 1.102 | 1.60 | 494 | 937 | 175 / 325 | 1376 | 1.00/1.00 | 1.00 |
| 728 | 1.035 | 1.080 | 1.086 | 1.38 | 482 | 918 | 173 / 323 | 1396 | 1.00/1.00 | 1.00 |
| 729 | 1.025 | 1.070 | 1.076 | 1.23 | 473 | 904 | 171 / 321 | 1417 | 1.00/1.00 | 1.00 |
| 730 | 1.025 | 1.065 | 1.068 | 1.10 | 464 | 891 | 169 / 319 | 1438 | 1.00/1.00 | 1.00 |
| 731 | 1.015 | 1.060 | 1.061 | 1.01 | 457 | 879 | 167 / 317 | 1459 | 1.00/1.00 | 1.00 |
| 732 | 1.010 | 1.055 | 1.054 | 0.95 | 450 | 867 | 165 / 315 | 1479 | 1.00/1.00 | 1.00 |
| 733 | 1.005 | 1.050 | 1.049 | 0.89 | 445 | 858 | 164 / 314 | 1500 | 1.00/1.00 | 1.00 |
| 734 | 1.005 | 1.045 | 1.044 | 0.82 | 439 | 849 | 162 / 312 | 1521 | 1.00/1.00 | 1.00 |
| 735 | 1.005 | 1.040 | 1.039 | 0.76 | 435 | 842 | 160 / 310 | 1541 | 1.00/1.00 | 1.00 |
| 736 | 1.000 | 1.035 | 1.035 | 0.71 | 430 | 834 | 158 / 308 | 1562 | 1.00/1.00 | 1.00 |
| 737 | 1.000 | 1.032 | 1.032 | 0.64 | 427 | 828 | 156 / 306 | 1583 | 1.00/1.00 | 1.00 |
| 738 | 1.000 | 1.030 | 1.028 | 0.62 | 423 | 822 | 154 / 304 | 1604 | 1.00/1.00 | 1.00 |
| 739 | 1.000 | 1.027 | 1.026 | 0.54 | 420 | 818 | 152 / 302 | 1624 | 1.00/1.00 | 1.00 |
| 740 | 1.000 | 1.025 | 1.023 | 0.51 | 417 | 813 | 151 / 301 | 1645 | 1.00/1.00 | 1.00 |
| 741 | 1.000 | 1.022 | 1.021 | 0.46 | 414 | 808 | 149 / 299 | 1666 | 1.00/1.00 | 1.00 |
| 742 | 1.000 | 1.020 | 1.018 | 0.40 | 412 | 804 | 147 / 297 | 1686 | 1.00/1.00 | 1.00 |
| 743 | 1.000 | 1.018 | 1.016 | 0.37 | 410 | 800 | 145 / 295 | 1707 | 1.00/1.00 | 1.00 |
| 744 | 1.000 | 1.017 | 1.014 | 0.32 | 408 | 797 | 143 / 293 | 1728 | 1.00/1.00 | 1.00 |
| 745 | 1.000 | 1.015 | 1.012 | 0.31 | 406 | 794 | 141 / 291 | 1748 | 1.00/1.00 | 1.00 |
| 746 | 1.000 | 1.013 | 1.010 | 0.27 | 404 | 791 | 139 / 289 | 1769 | 1.00/1.00 | 1.00 |
| 747 | 1.000 | 1.012 | 1.008 | 0.22 | 403 | 789 | 138 / 288 | 1790 | 1.00/1.00 | 1.00 |
| 748 | 1.000 | 1.010 | 1.007 | 0.21 | 401 | 788 | 136 / 286 | 1810 | 1.00/1.00 | 1.00 |
| 749 | 1.000 | 1.009 | 1.005 | 0.17 | 401 | 788 | 134 / 284 | 1831 | 1.00/1.00 | 1.00 |
| 750 | 1.000 | 1.007 | 1.004 | 0.14 | 400 | 788 | 132 / 282 | 1852 | 1.00/1.00 | 1.00 |
| 751 | 1.000 | 1.006 | 1.002 | 0.10 | 400 | 789 | 130 / 280 | 1873 | 1.00/1.00 | 1.00 |
| 752 | 1.000 | 1.005 | 1.001 | 0.08 | 400 | 791 | 128 / 278 | 1893 | 1.00/1.00 | 1.00 |
| 753 | 1.000 | 1.003 | 1.000 | 0.06 | 401 | 794 | 126 / 276 | 1914 | 1.00/1.00 | 1.00 |
| 754 | 1.000 | 1.002 | 1.000 | 0.04 | 401 | 798 | 125 / 275 | 1935 | 1.00/1.00 | 1.00 |
| 755 | 1.000 | 1.000 | 1.000 | 0.00 | 403 | 803 | 123 / 273 | 1955 | 1.00/1.00 | 1.00 |
| 756 | 1.000 | 1.000 | 1.000 | 0.00 | 404 | 809 | 121 / 271 | 1976 | 1.00/1.00 | 1.00 |
| 757 | 1.000 | 1.000 | 1.002 | 0.00 | 406 | 817 | 119 / 269 | 1997 | 1.00/1.00 | 1.00 |
| 758 | 1.000 | 1.000 | 1.004 | 0.00 | 408 | 825 | 117 / 267 | 2018 | 1.00/1.00 | 1.00 |
| 759 | 1.005 | 1.000 | 1.008 | 0.00 | 412 | 838 | 115 / 265 | done | 1.00/1.00 | 1.00 |
| 760 | 1.010 | 1.000 | 1.016 | 0.00 | 416 | 851 | 113 / 263 | done | 1.00/1.00 | 1.00 |
| 761 | 1.025 | 1.010 | 1.028 | 0.00 | 424 | 873 | 112 / 262 | done | 0.94/1.00 | 1.00 |
| 762 | 1.035 | 1.020 | 1.046 | 0.00 | 431 | 896 | 110 / 260 | done | 0.82/0.88 | 1.00 |
| 763 | 1.055 | 1.035 | 1.071 | 0.00 | 445 | 935 | 108 / 258 | done | 0.66/0.73 | 0.97 |
| 764 | 1.090 | 1.060 | 1.105 | 0.00 | 459 | 974 | 106 / 256 | done | 0.47/0.47 | 0.89 |
| 765 | 1.130 | 1.095 | - | - | 486 | off-frame | 104 / 254 | done | 0.31/0.29 | 0.75 |
| 766 | ~1.20 (blurred) | ~1.27 (blurred) | - | - | 513 | off-frame | 102 / 252 | done | 0.19/0.16 | 0.50 |
| 767 | ~1.20 (blurred) | ~1.27 (blurred) | - | - | - | off-frame | 100 / 250 | done | 0.09/0.07 | 0.09 |

### T2 Logo tiles at rest (frames 753-758, tile-layer scale 1.0; rim-to-edge boxes, 1080p)

| tile | box (x0,y0)-(x1,y1) | size | centre | rotateZ | content |
|---|---|---|---|---|---|
| T1 "Gemini" wordmark (wide) | (426,122)-(644,243) | 218x122 | (535,182) | +0° | Gemini wordmark + 4-point sparkle over the i, #EFEEF2, ≈146x50 |
| T2 Meta "∞" (square) | (1364,128)-(1512,250) | 148x123 | (1438,189) | +0° | infinity glyph ≈81x54; SPINS −360° 753-767 |
| T3 "milvus" (wide) | (1635,128)-(1851,232) | 216x105 | (1743,180) | +0° | eye glyph + "milvus" |
| T4 IBM watsonx globe (square) | (84,380)-(222,510) | 138x130 | (153,445) | +0° | globe-with-rays glyph |
| T5 "Claude" (wide) | (306,512)-(519,612) | 213x100 | (412,562) | +2° | burst glyph + serif "Claude", ≈146x38 |
| T6 "elastic" (wide) | (1628,398)-(1846,518) | 219x120 | (1737,458) | +0° | coloured cluster glyph + "elastic" |
| T7 mistral "M" (square) | (1458,578)-(1596,698) | 138x120 | (1527,638) | -2° | pixel-M glyph |
| T8 "Pinecone" (wide) | (92,756)-(303,854) | 212x98 | (197,805) | +0° | pine glyph + "Pinecone" |
| T9 OpenAI knot (square) | (442,850)-(580,988) | 138x138 | (512,920) | +0° | knot glyph; SPINS +360° 729-760 |
| T10 "deepseek" (wide) | (1218,880)-(1450,984) | 232x104 | (1334,932) | +0° | whale glyph + "deepseek" |
| T11 "aws" (squarish) | (1623,798)-(1797,927) | 174x129 | (1710,862) | +0° | "aws" over smile arrow |

Tile position at frame f = (960,540) + s(f)·R(rot(f))·(rest centre − (960,540)), with s and rot from T1 (R = clockwise rotation); each tile is also scaled by s(f). Spinning tiles add their own rotateZ about their centre.

### T3 Shot B per-frame (1080p). cam s = scale of "Cloud freedom" relative to frame 795 (tracked). Centres are tracked template centres. Logo s = each card logo's scale relative to the same card at 795 (IBM was selected at 795, so IBM card scale = s × 1.09; aws = s × 0.88; Azure = s × 1.00). sel = selection weight from the button colour (0 = #241D53, 1 = #513ADF). Toggle box/knob blurred at 768-769.

| f | cam s (sub) | sub centre | "Deploy" centre | toggle track box | knob cx | Azure logo s / centre / sel | aws logo s / centre / sel | IBM logo s / centre / sel |
|---|---|---|---|---|---|---|---|---|
| 768 | 0.705 | (958,346) | (820,270) | blurred | 940 | - | - | - |
| 769 | 0.745 | (958,334) | (812,252) | blurred | 938 | 0.85 / (585,639) / 0.00 | 0.90 / (958,629) / 0.99 | 0.65 / (1312,626) / 0.00 |
| 770 | 0.770 | (958,328) | (806,243) | (921,421)-(997,460) | 938 | 0.86 / (572,642) / 0.00 | 0.93 / (958,630) / 0.98 | 0.67 / (1300,628) / 0.00 |
| 771 | 0.800 | (958,319) | (802,236) | (919,418)-(999,459) | 937 | 0.88 / (562,644) / 0.00 | 0.97 / (958,632) / 0.99 | 0.68 / (1306,629) / 0.00 |
| 772 | 0.815 | (958,316) | (798,230) | (918,414)-(999,456) | 936 | 0.88 / (554,646) / 0.00 | 0.99 / (958,634) / 0.98 | 0.68 / (1314,631) / 0.00 |
| 773 | 0.835 | (958,312) | (795,226) | (916,412)-(1000,454) | 936 | 0.90 / (548,646) / 0.00 | 1.02 / (958,635) / 0.98 | 0.71 / (1322,632) / 0.00 |
| 774 | 0.850 | (958,311) | (793,222) | (916,409)-(1002,454) | 936 | 0.91 / (540,649) / 0.00 | 1.04 / (958,636) / 0.99 | 0.71 / (1328,634) / 0.01 |
| 775 | 0.860 | (958,308) | (790,220) | (915,408)-(1002,453) | 935 | 0.92 / (535,650) / 0.00 | 1.06 / (958,637) / 0.99 | 0.73 / (1332,634) / 0.01 |
| 776 | 0.870 | (958,308) | (788,218) | (915,408)-(1002,451) | 935 | 0.93 / (531,650) / 0.00 | 1.08 / (958,638) / 1.00 | 0.72 / (1339,635) / 0.01 |
| 777 | 0.880 | (958,306) | (786,216) | (915,406)-(1003,451) | 935 | 0.95 / (526,650) / 0.00 | 1.08 / (958,639) / 0.99 | 0.73 / (1342,636) / 0.01 |
| 778 | 0.890 | (958,304) | (784,214) | (913,405)-(1003,450) | 935 | 0.96 / (521,651) / 0.00 | 1.08 / (958,639) / 0.98 | 0.75 / (1348,637) / 0.02 |
| 779 | 0.900 | (958,304) | (783,212) | (913,405)-(1003,450) | 935 | 0.97 / (518,651) / 0.00 | 1.08 / (958,640) / 0.99 | 0.73 / (1352,638) / 0.02 |
| 780 | 0.905 | (958,302) | (781,212) | (913,403)-(1005,450) | 935 | 0.95 / (514,652) / 0.00 | 1.09 / (958,643) / 0.99 | 0.75 / (1357,638) / 0.02 |
| 781 | 0.915 | (958,301) | (779,210) | (912,403)-(1005,448) | 935 | 0.96 / (511,652) / 0.00 | 1.07 / (958,645) / 0.86 | 0.76 / (1360,639) / 0.02 |
| 782 | 0.925 | (958,299) | (778,208) | (912,402)-(1005,448) | 935 | 0.97 / (507,652) / 0.00 | 1.02 / (960,652) / 0.58 | 0.84 / (1364,633) / 0.24 |
| 783 | 0.925 | (958,299) | (777,208) | (912,402)-(1005,447) | 935 | 0.97 / (504,652) / 0.01 | 0.95 / (962,659) / 0.28 | 0.87 / (1367,631) / 0.46 |
| 784 | 0.935 | (958,298) | (776,206) | (912,400)-(1006,447) | 935 | 0.98 / (502,653) / 0.01 | 0.95 / (962,661) / 0.00 | 0.91 / (1370,629) / 0.68 |
| 785 | 0.945 | (958,297) | (775,206) | (910,400)-(1006,447) | 935 | 0.99 / (499,653) / 0.00 | 0.97 / (961,662) / 0.00 | 0.92 / (1375,628) / 0.89 |
| 786 | 0.950 | (958,297) | (773,206) | (910,399)-(1006,447) | 935 | 0.98 / (497,653) / 0.00 | 0.95 / (962,662) / 0.00 | 0.95 / (1377,628) / 1.00 |
| 787 | 0.955 | (958,297) | (772,204) | (910,399)-(1006,445) | 936 | 0.99 / (494,653) / 0.01 | 0.95 / (962,662) / 0.00 | 0.95 / (1382,628) / 1.00 |
| 788 | 0.965 | (958,296) | (772,204) | (910,399)-(1008,445) | 936 | 0.99 / (493,653) / 0.01 | 0.97 / (961,663) / 0.00 | 0.95 / (1384,628) / 1.00 |
| 789 | 0.970 | (958,296) | (770,203) | (910,397)-(1008,445) | 936 | 1.00 / (490,654) / 0.01 | 0.98 / (962,664) / 0.00 | 0.96 / (1387,628) / 1.00 |
| 790 | 0.970 | (958,296) | (770,203) | (910,397)-(1008,445) | 936 | 0.99 / (488,655) / 0.01 | 0.98 / (962,664) / 0.00 | 0.97 / (1390,628) / 1.00 |
| 791 | 0.980 | (958,295) | (768,203) | (909,397)-(1008,445) | 936 | 0.99 / (487,655) / 0.01 | 0.98 / (962,665) / 0.00 | 0.98 / (1394,629) / 1.00 |
| 792 | 0.990 | (958,296) | (767,203) | (909,397)-(1008,445) | 937 | 1.00 / (484,656) / 0.02 | 0.98 / (962,665) / 0.00 | 1.00 / (1396,630) / 1.00 |
| 793 | 0.990 | (958,296) | (766,202) | (909,397)-(1008,445) | 937 | 1.01 / (484,656) / 0.02 | 1.00 / (962,666) / 0.00 | 0.99 / (1400,631) / 1.00 |
| 794 | 1.000 | (958,296) | (766,202) | (909,397)-(1009,445) | 938 | 0.99 / (481,656) / 0.01 | 1.00 / (962,666) / 0.00 | 1.00 / (1402,632) / 1.00 |
| 795 | 1.000 | (958,296) | (765,202) | (909,397)-(1009,445) | 938 | 1.00 / (480,657) / 0.01 | 1.00 / (962,668) / 0.00 | 1.00 / (1406,633) / 1.00 |
| 796 | 1.000 | (958,296) | (764,202) | (907,397)-(1009,445) | 938 | 1.00 / (478,657) / 0.01 | 1.01 / (962,668) / 0.00 | 1.00 / (1408,634) / 1.00 |
| 797 | 1.010 | (958,296) | (764,203) | (907,397)-(1009,445) | 939 | 1.00 / (477,658) / 0.01 | 1.00 / (962,669) / 0.00 | 0.98 / (1412,637) / 1.00 |
| 798 | 1.010 | (958,296) | (763,202) | (907,397)-(1009,445) | 940 | 1.00 / (476,658) / 0.03 | 1.02 / (962,670) / 0.00 | 0.96 / (1414,640) / 1.00 |
| 799 | 1.020 | (958,296) | (762,203) | (907,397)-(1009,445) | 940 | 1.06 / (474,655) / 0.03 | 1.02 / (962,671) / 0.00 | 0.88 / (1418,648) / 0.71 |
| 800 | 1.020 | (958,296) | (761,203) | (907,397)-(1009,447) | 941 | 1.12 / (472,652) / 0.03 | 1.02 / (962,673) / 0.00 | 0.87 / (1420,652) / 0.42 |
| 801 | 1.030 | (959,296) | (760,203) | (907,397)-(1011,447) | 942 | 1.16 / (471,650) / 0.30 | 1.03 / (962,674) / 0.00 | 0.86 / (1423,655) / 0.13 |
| 802 | 1.030 | (959,298) | (760,204) | (907,399)-(1011,447) | 943 | 1.19 / (470,650) / 0.59 | 1.03 / (962,675) / 0.01 | 0.86 / (1426,656) / 0.00 |
| 803 | 1.040 | (959,298) | (758,204) | (906,399)-(1011,448) | 943 | 1.22 / (468,650) / 0.87 | 1.03 / (962,676) / 0.01 | 0.86 / (1429,658) / 0.00 |
| 804 | 1.045 | (958,298) | (758,204) | (906,399)-(1011,448) | 945 | 1.21 / (466,651) / 1.00 | 1.03 / (962,678) / 0.01 | 0.86 / (1432,659) / 0.00 |
| 805 | 1.050 | (959,298) | (757,204) | (906,400)-(1011,450) | 946 | 1.22 / (465,651) / 1.00 | 1.03 / (962,680) / 0.01 | 0.87 / (1436,661) / 0.00 |
| 806 | 1.055 | (958,300) | (756,206) | (906,400)-(1012,450) | 947 | 1.24 / (463,652) / 1.00 | 1.05 / (962,682) / 0.01 | 0.88 / (1438,663) / 0.00 |
| 807 | 1.065 | (958,300) | (755,206) | (906,400)-(1012,451) | 948 | 1.24 / (461,653) / 0.99 | 1.05 / (962,683) / 0.02 | 0.89 / (1442,664) / 0.00 |
| 808 | 1.065 | (958,300) | (754,206) | (906,402)-(1012,451) | 949 | 1.24 / (460,655) / 0.99 | 1.06 / (962,685) / 0.02 | 0.88 / (1446,668) / 0.00 |
| 809 | 1.075 | (958,302) | (754,206) | (904,403)-(1012,453) | 950 | 1.26 / (458,658) / 0.99 | 1.07 / (962,687) / 0.02 | 0.90 / (1449,670) / 0.00 |
| 810 | 1.075 | (958,302) | (752,207) | (904,403)-(1012,454) | 952 | 1.24 / (455,659) / 1.00 | 1.07 / (962,690) / 0.00 | 0.92 / (1453,672) / 0.00 |
| 811 | 1.085 | (959,304) | (752,208) | (904,405)-(1014,456) | 953 | 1.26 / (454,662) / 0.99 | 1.07 / (962,693) / 0.00 | 0.92 / (1457,675) / 0.00 |
| 812 | 1.095 | (959,304) | (751,208) | (904,406)-(1014,457) | 955 | 1.24 / (451,665) / 1.00 | 1.08 / (962,696) / 0.00 | 0.93 / (1461,678) / 0.00 |
| 813 | 1.105 | (959,306) | (749,208) | (903,408)-(1014,459) | 957 | 1.25 / (448,669) / 1.00 | 1.08 / (962,699) / 0.00 | 0.94 / (1465,682) / 0.00 |
| 814 | 1.105 | (959,308) | (747,209) | (903,409)-(1014,462) | 960 | 1.25 / (446,674) / 1.00 | 1.10 / (962,703) / 0.00 | 0.94 / (1471,686) / 0.00 |
| 815 | 1.115 | (959,309) | (746,209) | (903,411)-(1015,463) | 963 | 1.21 / (440,681) / 0.88 | 1.10 / (962,707) / 0.00 | 0.94 / (1475,691) / 0.00 |
| 816 | 1.120 | (958,310) | (743,211) | (903,414)-(1015,468) | 966 | 1.13 / (435,692) / 0.60 | 1.12 / (962,712) / 0.00 | 0.95 / (1480,695) / 0.00 |
| 817 | 1.120 | (958,318) | (742,214) | (903,420)-(1015,471) | 969 | 1.12 / (429,703) / 0.30 | 1.12 / (962,717) / 0.00 | 0.96 / (1487,702) / 0.00 |
| 818 | 1.130 | (958,321) | (737,215) | (903,424)-(1015,475) | 974 | 1.13 / (418,712) / 0.01 | 1.12 / (962,723) / 0.00 | 0.99 / (1496,710) / 0.00 |

### T4 Shot C per-frame (1080p). Scales relative to frame 845. Server-icon centres 819-842 come from the white-bar blob (the bars are tilted); 860-865 rows are chain-tracked (y only) through heavy vertical blur.

| f | sub s / centre | "Fully" s / centre | toggle track box | knob cx | server icon centre | "Choose" button centre | note |
|---|---|---|---|---|---|---|---|
| 819 | 0.835 / (966,326) | 0.880 / (672,216) | (912,406)-(1008,453) | 933 | (958,720) | (959,884) | |
| 820 | 0.860 / (966,332) | 0.900 / (664,217) | (909,414)-(1011,462) | 945 | (958,724) | (959,898) | |
| 821 | 0.870 / (967,334) | 0.920 / (658,216) | (907,417)-(1012,466) | 952 | (958,724) | (959,906) | |
| 822 | 0.905 / (967,332) | 0.920 / (654,216) | (906,418)-(1014,469) | 957 | (958,725) | (959,912) | |
| 823 | 0.915 / (968,333) | 0.925 / (650,217) | (906,420)-(1014,472) | 961 | (958,728) | (959,918) | |
| 824 | 0.930 / (967,334) | 0.925 / (647,217) | (904,423)-(1015,475) | 965 | (958,728) | (960,921) | |
| 825 | 0.930 / (967,335) | 0.940 / (644,218) | (903,424)-(1017,477) | 968 | (958,728) | (959,925) | |
| 826 | 0.940 / (968,337) | 0.940 / (643,218) | (903,426)-(1017,480) | 971 | (958,729) | (959,928) | |
| 827 | 0.950 / (968,337) | 0.945 / (640,218) | (903,427)-(1017,481) | 973 | (958,730) | (959,931) | |
| 828 | 0.950 / (968,338) | 0.955 / (638,218) | (903,429)-(1017,483) | 976 | (958,730) | (959,932) | |
| 829 | 0.955 / (967,340) | 0.955 / (637,218) | (903,430)-(1018,484) | 977 | (958,732) | (959,934) | |
| 830 | 0.965 / (968,340) | 0.965 / (635,219) | (901,432)-(1018,487) | 979 | (958,733) | (959,936) | |
| 831 | 0.965 / (968,340) | 0.970 / (634,219) | (901,433)-(1018,487) | 981 | (958,734) | (959,938) | |
| 832 | 0.965 / (968,342) | 0.970 / (633,219) | (901,433)-(1018,489) | 982 | (958,736) | (959,940) | |
| 833 | 0.975 / (968,342) | 0.975 / (632,219) | (901,435)-(1018,490) | 984 | (958,739) | (959,942) | |
| 834 | 0.975 / (968,344) | 0.975 / (630,219) | (901,436)-(1018,492) | 985 | (958,742) | (960,944) | |
| 835 | 0.980 / (967,344) | 0.980 / (629,220) | (901,436)-(1018,492) | 986 | (958,745) | (959,946) | |
| 836 | 0.985 / (968,344) | 0.985 / (628,220) | (900,438)-(1020,493) | 987 | (958,748) | (959,947) | |
| 837 | 0.990 / (968,344) | 0.990 / (628,220) | (900,438)-(1020,495) | 988 | (958,752) | (959,949) | |
| 838 | 0.990 / (968,346) | 0.985 / (627,220) | (900,439)-(1020,495) | 989 | (958,755) | (959,950) | |
| 839 | 0.990 / (968,346) | 0.990 / (626,220) | (900,439)-(1020,496) | 989 | (958,758) | (959,952) | |
| 840 | 0.990 / (968,346) | 0.995 / (625,220) | (900,441)-(1020,496) | 990 | (958,758) | (959,953) | |
| 841 | 0.990 / (968,347) | 0.995 / (625,220) | (900,441)-(1020,498) | 990 | (958,759) | (959,954) | |
| 842 | 1.000 / (968,347) | 1.000 / (624,220) | (900,441)-(1020,498) | 991 | (958,760) | (959,956) | |
| 843 | 1.000 / (968,347) | 0.995 / (623,220) | (900,442)-(1020,499) | 991 | (958,761) | (959,957) | |
| 844 | 1.000 / (968,347) | 1.005 / (623,220) | (900,442)-(1020,499) | 991 | (958,762) | (959,958) | |
| 845 | 1.000 / (968,347) | 1.000 / (622,220) | (900,442)-(1020,499) | 991 | (958,763) | (959,958) | |
| 846 | 1.000 / (968,347) | 0.995 / (622,220) | (900,442)-(1020,499) | 992 | (958,763) | (959,958) | |
| 847 | 1.000 / (968,346) | 1.005 / (622,219) | (900,441)-(1020,499) | 992 | (958,763) | (959,959) | |
| 848 | 1.000 / (968,346) | 1.005 / (622,218) | (900,441)-(1020,498) | 992 | (958,763) | (959,958) | |
| 849 | 1.000 / (968,344) | 1.000 / (621,216) | (900,439)-(1020,496) | 992 | (959,762) | (959,958) | |
| 850 | 1.010 / (968,341) | 1.010 / (621,214) | (900,438)-(1020,495) | 992 | (959,760) | (959,957) | |
| 851 | 1.010 / (968,340) | 1.005 / (620,212) | (898,435)-(1021,493) | 992 | (959,759) | (959,956) | |
| 852 | 1.010 / (968,337) | 1.010 / (620,208) | (898,433)-(1021,490) | 992 | (959,756) | (959,954) | |
| 853 | 1.010 / (968,332) | 1.005 / (619,204) | (898,429)-(1021,487) | 992 | (958,753) | (959,951) | |
| 854 | 1.015 / (968,328) | 1.015 / (618,199) | (898,424)-(1021,483) | 992 | (959,750) | (959,948) | |
| 855 | 1.015 / (968,322) | 1.015 / (616,193) | (898,420)-(1021,477) | 992 | (959,746) | (959,944) | |
| 856 | 1.020 / (968,316) | 1.020 / (616,184) | (898,412)-(1021,471) | 992 | (959,740) | (959,939) | |
| 857 | 1.025 / (968,308) | 1.020 / (614,175) | (898,405)-(1021,463) | 992 | (958,733) | (959,933) | |
| 858 | 1.025 / (968,297) | 1.030 / (613,164) | (898,394)-(1023,453) | 993 | (958,724) | (959,926) | |
| 859 | 1.035 / (968,284) | 1.045 / (610,148) | (897,382)-(1023,441) | 993 | (959,714) | (959,916) | |
| 860 | ~1.04 / (968,267) | blurred, exiting top (letters wiping out) | centre y 399 | 992 | (959,699) | (960,906) | chain-tracked y only |
| 861 | ~1.04 / (968,246) | blurred, exiting top (letters wiping out) | centre y 380 | 992 | (959,684) | (960,891) | chain-tracked y only |
| 862 | ~1.04 / (968,216) | blurred, exiting top (letters wiping out) | centre y 351 | 992 | (959,660) | (960,873) | chain-tracked y only |
| 863 | ~1.04 / (968,174) | blurred, exiting top (letters wiping out) | centre y 312 | 992 | (959,630) | (960,848) | chain-tracked y only |
| 864 | ~1.04 / (968,106) | blurred, exiting top (letters wiping out) | centre y 252 | 992 | (959,582) | (960,808) | chain-tracked y only |
| 865 | ~1.04 / (968,-) | blurred, exiting top (letters wiping out) | centre y 135 | 992 | (959,489) | (960,735) | chain-tracked y only |
