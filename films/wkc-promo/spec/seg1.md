# Segment 1 spec: frames 0–150 (0.00–5.00 s), plus boundary frames up to 156

Reference: `ref/ref.mp4` (1280×720, 30 fps). **All coordinates, sizes, blur radii and speeds below are already
converted to our 1920×1080 canvas (720p measurement × 1.5)**, unless a value is explicitly tagged "720p".
Frame numbers are global film frames (frame n = n/30 s). Origin is top-left; +x goes right and +y goes down.
Angles: "CCW+" means counter-clockwise is positive, so in CSS use `rotate(-a deg)`. Ellipse angles follow the
SVG/OpenCV convention (clockwise-positive in screen space, rotation of the rx axis).

How the values were measured: thresholded pixel bounding boxes, sub-pixel edge crossings at 50 %,
template matching with scale/rotation search (letters, words, icon), RANSAC ellipse fits for the rings, a Hough
transform plus least-squares fits for the light streak, two-Gaussian fits (core blur + bloom) for the glows,
block-edge periodicity for the mosaic, and spectral-flux onsets for the sound. The "fit" columns are smooth curves
that match the measurements to within the stated error. Use the tables when you need frame exactness.

---

## 1. Shot list

| # | Frames (incl.) | Duration | Content | In → out |
|---|---|---|---|---|
| A | 0 – 4 | 5 f | **Thumbnail:** the settled end card. These frames are the film's own end card playing (they match ref frames 1211–1215 at ≤0.75 mean abs diff) | starts the file → **hard cut** to black |
| B | 5 | 1 f | Pure black `#000000` (every pixel is 0) | hard cut → hard cut |
| C | 6 – 45 | 40 f | **"Meet"**: dark navy, an expanding radial light, letters fade in one by one, slow rise plus accelerating shrink, then a white bloom and a **mosaic/pixelate** exit | fade up from black → **glow + pixelate hard cut** at 45→46 |
| D | 46 – 97 | 52 f | **Logo reveal**: a lockup (icon + "Neural" bold + "Seek" light) arrives over-scaled with a heavy bloom and pulls back (hyperbolic dolly). The icon is drawn on as a stroke, the letters settle, "Seek" fades in letter by letter and slides left to close the gap, and a **light-streak polyline** draws under the logo. Then a slow 3D orbit (rotY + rotZ) and an accelerating shrink and darken | cut in mid-bloom → **hard cut** at 97→98 (the shot is darkening at the cut) |
| E | 98 – 146 | 49 f | **"Build \| AI agents in minutes"**: two glowing 3D rings swing to face the camera. "Build" is revealed by a caret sweep and flattens out of a tilt, then the group slides left with motion blur. Words arrive one per beat (dim → highlight → white), and the camera drifts and pans left. "Build" blurs out | fade up from dark → **hard cut** at 146→147 (on the beat) |
| next | 147 → | | Light product-UI shot ("Drag. / Drop. / Done", app window from the right, cursor). Not part of this segment | |

Transition summary: 4→5 cut; 5→6 cut, then a fade from black (≈ f5–f22); 45→46 cut that hides inside a white bloom and
mosaic (block size doubling every frame); 97→98 cut while the logo shot dims and shrinks (dip toward dark);
146→147 hard cut on the music beat (≈ f146.6). Nothing from an earlier segment enters this one, because frame 0 is
the start of the file.

---

## 2. Backgrounds

### Shot C (6–45) "Meet"
* Base: very dark navy-violet. Once settled (f ≥ 23) the 8×5 cell average colours are: corners `#0D0C18 / #0A0C15 / #0B0B16 / #0E0C18`,
  edges `#0D0D19 – #0E0C19`, centre `#100F22 – #121023`. No grain. There is 8-bit banding in the source; adding 1–2 %
  monochrome noise is optional and invisible.
* **Global fade from black**, measured from the corner luminance relative to the settled value: f6 0.12, f7 0.18, f8 0.41,
  f9 0.45, f10–f13 0.59, f14 0.62, f15 0.65, f16 0.70, f17 0.80, f18 0.82, f19 0.84, f20 0.86, f21 0.94, f22 0.96, f23+ 1.0.
* **Expanding radial light** centred on (968, 537). It starts as a disc with a visible edge and grows into a soft glow:
  edge radius about 390 px at f7, 360 at f8 (it brightens while it shrinks slightly), about 510 at f10, 570 at f11,
  600–750 at f12–14 (soft), 810 at f15, and from f16 it fills the frame. Inside/outside luminance: f7 11/4, f8 14/8, f9 21/9,
  f10 24/11. Settled radial profile (blue-weighted luminance): r=0 → 28, r=180 → 25, r=360 → 23, r=540 → 21,
  r=720 → 20, r=1020 → 18. Colour: centre `#100F22`, falling to `#0D0C18` at the corners.
* **Text glow** (behind "Meet", f ≥ 19): a soft violet halo hugging the word. Measured below the word: `#15122C` at
  the text edge, `#110F25` at +45 px, `#0F0E22` at +90 px, `#0E0D1B` at +225 px, background `#0D0D1A`. Implement as
  `drop-shadow(0 0 90px rgba(60,48,170,.35))` on the text.
* Slight darkening at the corners f30–41 (corner luminance 17 → 14), i.e. the vignette tightens a little as the word shrinks.

### Shot D (46–97) logo
* Spotlight background: radial gradient centred about (960, 640) and slightly below the logo. Colours at f72: centre
  `#1F1849`/`#1E1848`, at r≈300 `#1A153C`, at r≈550 `#15122B`/`#141126`, corners `#15111F` (top-left) and `#0B0E18` (top-right).
  f60 is similar (`#282349` hottest). Overall dimming toward the cut: at f90 the corners are `#0F0D1A`/`#090C16`,
  and at f97 they are `#08090F` with centre `#1E1745` (vignette closing over f88–97).
* f46–52: the bloom from the text lifts the whole centre to warm grey (`#373136` beside the text at f47).
* Faint **dark panel** at the top right (f84–97): the area above the streak's upper-right continuation is about 6 levels
  darker than the area below it (at x=1800 the boundary sits at y≈368 at f84, 248 at f88, 150 at f92, 143 at f95). It reads as
  the dark top face of a slab whose edge is the light streak.

### Shot E (98–146) "Build"
* Base: uniform violet-navy. At f110: `#141023`–`#1D1834` across the frame, the centre inside ring A is `#16112D`, and the rim areas
  near the lit arcs are up to `#261F42`. At f130: corners `#161126`, centre `#16112D`, bottom-left near the lit arc `#231D3B`.
* Fade-up from dark f98→f104: corners `#08090F` (f98) → `#110E1E` (f104); after that the frame stays at about `#141023` corners.
* Rings: see §3/§4 (they are part of the background layer, behind the text).

---

## 3. Elements (look, size, position)

### A. Thumbnail end card (f0–4)
The settled end card: lockup centred at (966, 412), the 7-day-trial glowing pill below it, and the url below that. Build it with the end-card
segment's component and render its local frames that correspond to ref 1211, 1211, 1212, 1213, 1214 for f0–f4.

### C. "Meet"
* Text `Meet`, a geometric sans **Bold** (DM Sans Bold look), white `#F8F8FA` (text core measured as RGB 247.5/247.6/249.6).
* Horizontally centred at **x = 960**: the word's ink box centre is at 959–960 at every frame, and scaling is about this x.
* Size: cap height of `M` (50 % edge crossing) is **181.7 px at f8–f10**, 169.3 px at f34, and 160.7 px at f41.
  Ink width / cap height = 3.41 (ink width 590 px at f30).
* Letter ink spans at f30 (1080p): M 663–849, e 877.5–1002, e 1026–1150.5, t 1167–1254. The cap top is at y 460, the baseline at y 633.5,
  and the `e` x-height top is at 505.5.
* Glow at rest is only the violet halo described in §2. White bloom at the exit (§4).

### D. Logo lockup (at s = 1, which is the end-card size; local coordinates relative to the lockup centre)
* Lockup centre on screen ≈ **(966, 527)** throughout. The measured centre wanders by less than ±2.5 px; see the table.
* Icon (a ribbon "N", cyan `#3BA5E1` top-left → blue `#4C63C0` → purple `#7B1EC5`/`#620FCF` at the right, with dark
  circuit lines and dots): box x −505…−353, y −84…+84 (151×168).
* "Neural": bold geometric sans, white `#FFFFFF`, x −320…+143, cap top −48, baseline +64.5 (cap height 112.5).
* "Seek": light-weight geometric sans, white, final x +166…+506, same baseline. The final gap Neural→Seek is 24 px
  and icon→Neural is 34.5 px.
* Light streak: a 2–3 px core with a 4–6 px glow (FWHM 3–5 px at 720p). The colour runs along its length from violet
  `#5640D4`/`#4836A2` at the ends to a lavender-white hot zone `#E5E3FB` near x 1000–1100 (under the logo centre). It is a polyline:
  [off-screen bottom-left] → up-right diagonal (direction dx/dy = −0.85, i.e. 49.6° above horizontal) → **left corner** →
  long horizontal under the logo (screen y ≈ 664 at f50, 658 at f60–69, i.e. ≈ 60 px below the cap baseline at f69) → **right corner** → steeper up-right
  diagonal (56° at f69 rising to 71° at f97) → continues to the top-right edge of the frame (faint, fades).

### E. "Build | AI agents in minutes"
* `Build`: geometric sans Bold, white `#FFFFFF`. Settled (s=1, f ≥ 129): cap height (B stem) **82.5 px**; ink box
  x 298.5–610.5 at f140 (centre x 453.75, centre y 534.75); ascender top 486, baseline 583.5.
* Caret/divider bar: 2 px core (FWHM 3 px), vertical gradient: top `#7C6ADA` (bright violet) → `#5845B9` at mid →
  transparent by its lower 25 %. Length ≈ 180 px. At f140 it sits at x 649.5, from y 447 (top) to about 622 (faded out).
  Gap from the `d` to the bar is 37.5 px. The bar belongs to the Build group (it scales with it): in local terms it is at Build
  centre + 195.75·s.
* Words `AI agents in minutes`: geometric sans Regular, cap height ≈ **66 px**, baseline ≈ 570 (f140). The word ink
  boxes at f140 are AI 720–795, agents 831–1116, in 1150.5–1216.5, minutes 1254–1591.5 (gaps 36 / 34.5 / 37.5 px). The first
  word starts 69 px right of the bar. The whole line at f140 spans 298.5→1591.5 (centre 945).
* Word colours: "upcoming" dim `#292540`→`#696580` (≈ 15–35 % white); **highlight** lavender/violet
  (`#978BD3` for AI, `#9589D3` for agents, `#5E47D2`/`#6149DD` for "in", which is the most saturated, and `#B7ACE9` for minutes); "past" `#CDCADD`
  (≈ 80 % white); final `#F1EFF7`.
* Rings: two thin circular rings in 3D (A in front/inner, B behind/outer). Each has a 1.5–2 px dark outline
  (`#14122A`, about 5 levels below the background) plus **lit arcs**: violet `#7B67E0` blooming to white `#FBF8FF` at the arc
  centre, with a soft glow of about 6 px. They read as glass rims catching a light.

---

## 4. Animation (per element, with measured keyframes)

### C. "Meet" (f5–45)
**Per-letter fade-in** (measured opacity, normalised peak; the M/e/e/t start frames are about 5, 9.5, 14.5 and 19, a stagger of 4.67 f = 0.155 s).
The `t` and the second `e` follow **easeOutQuad over 15 frames** exactly (t: 0.12, 0.26, 0.39, 0.49, 0.58, 0.66, 0.72, 0.78, 0.84, 0.89, 0.92 …).
`M` and the first `e` are additionally held down by the global fade from black, so use the table values. Each letter also enters
with a small **blur**, σ ≈ 3 px at its first frame falling to 0 over about 20 frames (M edge 10–90 % width: 7.7 px at f10, 4.9 px at
f12–18, 3.6 px at f24, 2.7 px (sharp) at f30+). There is no per-letter position offset; letters only fade and sharpen.

**Word motion** (whole word, anchor = word centre):
* centre y rises along an **easeOutCubic** curve from 620.2 (f5) to 537.6 (f49.9). The fit's maximum error is 1.3 px. The measured values are in the table.
* scale shrinks along an **easeInCubic** curve: cap height = 181.0 − 32.3·t³ px with t=(f−5)/41. The maximum error is 0.5 %. Measured cap heights: 181.7 (f8–10),
  181.2 (f14), 179.1 (f20), 176.8 (f25), 173.1 (f30), 168.2 (f35), 161.0 (f40), 155.3 (f43).
* x stays centred at 960.

**Exit (f37–45)**, which leads into the hard cut at 46:
* white **bloom** (a Gaussian copy of the text added on top in white): f37 σ 75 px / gain 0.03, f38 18/0.12, f39 18/0.26, f40 24/0.44,
  f41 38/0.66, f42 60/0.94, f43 75/1.34, f44 75/1.75, f45 75/2.4. Gain is relative to the text's own brightness, and the result clips to
  white. The halo's tint is very slightly cool (`#5B5B68` at 15 px from the text at f43).
* the text core also softens: blur σ 0.75 px at f40–41, 2.25 at f42, 4.5 at f43, and 9 at f44–45.
* **mosaic/pixelate on the whole frame**: square blocks on a grid anchored at (0,0) of **2 px at f41, 4 px at f42, 8 px at f43, 16 px at f44 and 32 px at f45**
  (240/120/60 blocks across at f43/44/45). Apply it after the bloom.

### D. Logo shot (f46–97)

**Group transform** (apply about the lockup centre, which stays at ≈ (966, 527)):
`translate(966px,527px) perspective(1350px) rotateZ(−rotZ) rotateY(rotY) scale(s)`. rotY is positive when the left side swings toward the camera.

* **scale s (pull-back, hyperbolic like a constant-speed dolly):** `s(f) = 0.9329 + 0.9932 / (1 + (f − 44.29)/3.877)^1.0375`
  for f46–90. The maximum error is 0.005 against these measurements: f47 1.510, f48 1.425, f49 1.364, f50 1.319, f51 1.282, f52 1.252,
  f53 1.227, f54 1.205, f55 1.186, f56 1.170, f58 1.143, f60 1.120, f62 1.101, f64 1.085, f66 1.072, f68 1.060, f70 1.051,
  f72 1.043, f75 1.034, f80 1.022, f85 1.014, f90 1.004. The f46 value (1.60) is uncertain because of the bloom; use the formula (1.613).
  **Exit acceleration** (multiply the formula by): f91 1.000, f92 0.996, f93 0.991, f94 0.984, f95 0.969, f96 0.942, f97 0.885
  (measured s: 1.0005, 0.9967, 0.9903, 0.9818, 0.9656, 0.9378, 0.8800). This is an expo-in into the cut.
* **rotZ (CCW+, screen):** 0 for f46–69, then 0.19 (f70), 0.37, 0.65 (f72), 0.85, 1.03 (f74), 1.20, 1.37 (f76), 1.54, 1.70 (f78), 1.80,
  1.98 (f80), 2.11, 2.20 (f82), 2.33, 2.48 (f84), 2.53, 2.68 (f86), 2.70, 2.86 (f88), 2.95, 2.96 (f90), 3.12, 3.13, 3.17 (f93), 3.05,
  3.04 (f95), and the reading at f96–97 is unreliable (motion), so hold 3.1. The rise is about 0.15–0.17°/frame and starts at f69, an
  easeOut that ends near f91.
* **rotY (left side toward the camera), from the depth ratio of the icon to the last letter and the horizontal foreshortening:** 0 until f69,
  then about 0.36°/frame: 1° (f72), 2.5° (f76), 4° (f80), 5.5° (f84), 7° (f88), 8° (f91), 9° (f92), 10° (f93), 11.5° (f94),
  13° (f95), 15° (f96), 17° (f97). Perspective 1350 px (equivalent to a wide ~28 mm lens). This produces the "Seek is smaller than
  Neural" look at f88–97. The raw estimates are in the table and have ±2° noise.
* Group screen position: centre x drifts 970 → 964.6 and centre y 523 → 531 over the shot. These are measured values and need no extra keyframes beyond the table.

**Per-element animation inside the group** (local px at s=1):
* **Icon draw-on** (a stroke reveal of the ribbon path, which starts at the bottom of the left stem, goes up, over the top-left arch, down the inner
  stem, along the diagonal to the bottom right, up the right stem and ends with the top-right hook). Visible fraction of the path:
  f46 0.05, f47 0.25, f48 0.35, f49 0.45, f50 0.50, f51 0.55, f52 0.62, f53 0.68, f54 0.72, f55 0.76, f56 0.80, f57 0.83, f58 0.86,
  f59 0.89, f60 0.91, f61 0.93, f62 0.94, f63 0.96, f64 0.97, f65 0.98, f66 0.99, f67+ 1.0 (an easeOut over about 22 f).
  The icon's brightness also ramps up: 30 % at f47, 46 % at f49, 62 % at f51, 76 % at f53, 89 % at f55, 95 % at f57 and 100 % at f59+
  (at the start it is a dark teal `#162E4A`).
* **Icon slide right** (toward the text): the icon sits further left by iconOff = 52 px (f49) → 46 (f54) → 39 (f60) → 34 (f65) → 27 (f70)
  → 22 (f72) → 16 (f74) → 13.5 (f76) → 12 (f78) → 10 (f80) → 8.8 (f84). About 0.6·rotY px of the late values comes from the
  perspective itself, so the authored offset is ≈ 0 by f90. The shape is easeInOutSine over f49→f90.
* **"Neural" bloom** (a white-warm Gaussian glow added on top, plus slight core blur): σ/gain f46–51 48 px / 1.0, f52 48/0.98, f53 48/0.95,
  f54 48/0.90, f55 36/0.64, f56 36/0.59, f57 36/0.54, f58 24/0.37, f59 18/0.34, f60 18/0.30, f61 12/0.28, f62 12/0.24, f63 12/0.20,
  f64 9/0.18, f65 9/0.14, f66 9/0.11, f67 6/0.09, f68 6/0.05, f69+ 0. Halo luminance 6 px above the text: 107 (f46) → 92 (f48) →
  86 (f50) → 79 (f52) → 72 (f54) → 65 (f56) → 58 (f58) → 53 (f60) → 47 (f62) → 43 (f64) → 41 (f66) → 40 (rest), where the background is about 30.
  Text-core blur σ: 3 px (f46–47), 2.25 (f48–49), 1.5 (f50–58), 0.75 (f59–68), 0 (f69+). The halo is warm (`#6F636B` beside the text at f46).
* **Letter settle** of "Neural" (f46–59): letters arrive slightly rotated and offset, then settle with an expo-out (half-life ≈ 2.5 f).
  Rotations, measured (CCW+): N −8°, −6°, −4°, −3°, −3°, −2°, −1° (f46…f52), then −1° until f58, 0 at f59. e −2° → 0 by f48.
  u +7°, +5°, +3°, +2°, +2°, +2°, +1° (f46…f52), then +1° until f58. "ra" −6°, −4°, −2°, −2°, −1° (f46…f50), then −1° until f58.
  u sits lower: +8 px (f48), +5 (f50), +3.3 (f52), +1.6 (f55–60), +0.5 (f66), 0 after.
  The last letter **"l" grows up from the baseline**: height 45 % (f47) → 46 % (f48) → 55 % (f50) → 64 % (f52) → 71 % (f54) → 81 % (f56) →
  84 % (f58) → 87 % (f60) → 91 % (f62) → 93 % (f64) → 95 % (f66) → 99 % (f68) → 100 %.
* **"Seek" reveal**, letter by letter as fade plus blur (a soft left-to-right wipe), opacities S/e/e/k:
  f46 .12/.03/.02/0, f48 .23/.03/.02/.01, f50 .40/.05/.01/.01, f52 .52/.07/.02/.02, f54 .67/.17/.02/.01, f56 .78/.31/.02/.02,
  f58 .83/.51/.05/.02, f60 .88/.69/.15/.01, f62 .92/.84/.32/.03, f64 .95/.91/.56/.06, f66 .97/.96/.76/.17, f68 .97/.97/.93/.37,
  f70 .98/.98/1/.63, f72 .98/.98/1/.87, f74 1/1/1/1. The 50 % points are S f51.5, e f57.5, e f63, k f69, so the stagger is 5.8 f and each
  ramp lasts about 13 f. Letters that are still revealing are blurred, σ ≈ 4.5 px at 10 % opacity falling to 0 at 90 %.
* **"Seek" slides left** to close the gap: seekOff = +35 px (f46–53) → 33 (f55) → 31 (f58) → 30 (f60) → 29 (f62) → 27 (f65) →
  24 (f68) → 20 (f70) → 13.6 (f72) → 7 (f74) → 3.3 (f76) → 0.9 (f78) → 0 (f79). After f80 the table goes negative (to −17 at f97);
  that is pure rotY foreshortening, so do not author it. Curve: about linear at −0.55 px/f for f53→f66, then easeInOutCubic 26→0 over f66→f79.
* **Light streak** (in screen space, outside the group transform; use the table in Appendix L):
  - draw-on: the head travels left→right along the horizontal. Its x is 462 (f48), 550 (f49), 646 (f50), 726 (f51), 808 (f52), 892 (f53),
    966 (f54), 1036 (f55), 1100 (f56), 1155 (f57), 1215 (f58), 1273 (f59), 1333 (f60), 1372 (f61), 1423 (f62), 1464 (f63),
    1527 (f64), 1590 (f65), 1599 (f66), 1608 (f67), which is about 60–90 px/f decelerating. It reaches the right corner at f67–69 and then runs up the right
    diagonal: the visible top is y 553 (f69), 540 (f70), 514 (f71), 472 (f72), 427 (f73), 388 (f74), then 337–393 for f75–f91
    (the stroke fades toward its end there), then 380 (f92), 396, 438, 472, 485, 504 (f97).
  - the left part (corner and diagonal) moves with the pull-back. Left corner: (73,663) f51, (115,661) f53, (152,659) f55,
    (177,659) f57, (189,659) f59, (198,658) f60, (214,657) f61, (223,658) f63, (232,658) f65, (245,657) f67, (250,658) f69,
    (255,667) f72, (269,675) f75, (272,681) f78.
  - **tail trim** (the line erases from its start): the left diagonal is visible down to the frame edge until f69. Its lower end then rises
    to y 910 (f70), 885 (f74), 830 (f76), 767 (f78), and the corner is gone at f79. After that the tail runs along the horizontal:
    tail x 279 (f79), 291 (f80), 345 (f81), 393 (f82), 466 (f83), 525 (f84), 582 (f85), 639 (f86), 696 (f87), 755 (f88),
    822 (f89), 887 (f90), 948 (f91), 1011 (f92), 1074 (f93), 1138 (f94), 1191 (f95), 1250 (f96), 1286 (f97), which is about 60 px/f
    from f82.
  - the horizontal tilts with the orbit: slope 0 for f48–69, −0.0054 (f70), −0.0137 (f72), −0.0196 (f74), −0.0268 (f76),
    −0.0354 (f78), −0.0404 (f80), −0.0441 (f82), −0.0500 (f84), −0.0532 (f86), −0.0552 (f88), −0.0610 (f90), −0.0640 (f92),
    −0.0636 (f94), −0.0612 (f96), −0.0486 (f97).
  - brightness: the peak along the line is `#504A58` at f50, `#8076A8` at f55, `#A49DC9` at f60, `#C7C4E3` at f66, `#E5E3FB` at f72–88
    and `#71699B` at f94. The colour gradient along the line is in §3.

### E. "Build" shot (f98–146)

**Rings** (behind everything; SVG `<ellipse>` per ring with a 1.5 px dark stroke plus a lit-arc stroke). The per-frame cx, cy, rx, ry and angle are in
Appendix B. Summary:
* Ring A (front): it starts as a tilted ellipse (241×408 radii, 159°) centred on (768,614) at f98. It opens up (rx/ry 0.59 → 1.0 by
  f120) and moves to the centre (965, 535) by f118. It stays there with r ≈ 548 until f135, then grows to r 574 by f146
  and pans left with the camera (cx 965 → 856 at f146).
* Ring B (back, larger): from (1204,444), 367×477, 159° at f98 to (998,507) r≈745 at f120, (969,523) r≈783 at f130,
  (941,530) r≈814 at f140, and (850,531) r≈850 at f146. It reaches circular a little later than A (ry/rx 1.08 at f110, 1.01 at f120).
* **Lit arcs** (screen angle, 0° = 3 o'clock and 90° = 6 o'clock, so clockwise is positive). Each lit arc is violet at its ends and white at its peak.
  Ring A has two opposite arcs: arc 1 at 162–208° (f104), 148–198° (f110), 126–168° (f120), 107–158° (f130), 104–140° (f140),
  110–125° dim (f146). Arc 2 at 297–339° (f104), 283–344° (f110), 285–327° (f120), 281–308° (f130), 236–254° dim (f140). Arc 1 is
  at 8–38° at f98 and travels anticlockwise about 2°/f, slowing down. Ring B has one main arc on the left: 106–147° (f98), 108–152° (f104),
  109–159° (f110), 130–166° (f120), 136–178° (f130), 140–188° (f140), 152–182° (f146), drifting clockwise at about 1°/f. A second
  small arc sits at 319–335° from f130. The peak colour is `#FBF8FF`–`#FFFCFF` at full strength and `#CEC7E8` at f98–100.
* Shot fade-up from dark f98→f104 (see §2). The rings are already present at f98.

**"Build" group** (word plus caret): Appendix B gives centre, scale, rotZ and caret x per frame.
* Settling from a tilt: scale 0.74 (f99) → 0.68 (f100) → 0.70, 0.72, 0.74, 0.77, 0.79 (f105) → 0.83, 0.84, 0.86, 0.87, 0.88 (f110) →
  0.90, 0.92, 0.92, 0.94, 0.93, 0.95 (f117) → 0.96 (f120) → 0.98 (f123–125) → 1.0 (f129). rotZ (CCW+): −12°, −12.5°, −10°, −8°, −6.5°, −6°,
  −5° (f99–105), then −5, −4.5, −4, −3.5, −3, −3 (f106–111), −2.5, −2, −2, −1.5, −1.5, −1.5 (f112–117), −1, −1, −0.5 (f118–125), 0 at f126.
  So the word is clockwise-tilted and slightly small and straightens out with an expo-out. Before f109 it also shows a little perspective
  (letters on the right sit lower), which the rotZ covers.
* **Reveal of "Build" by the caret sweep**: the caret starts just right of "Bu" and sweeps right in local units −7 → +130.5
  (×1.5 → −10.5 → +195.75 px, scaled by s) with progress 0, 0.02, 0.32, 0.49, 0.63, 0.73, 0.80, 0.85, 0.90, 0.94, 0.96, 0.99, 1.0 for
  f98…f110 (cubic-bezier(0.09,−0.19,0,0.87) over f98.5→f110). Letters fade in as the caret passes, each over about 6 f:
  B 0.35 (f98) → 0.57 (f99) → 0.66 → 0.81 → 0.93 → 1.0 (f103); u 0.24 (f98) → 0.30 (f99) → full by about f102; i 0.23 (f100) → 0.43 → 0.60 → 0.74 → 1.0 (f104);
  l 0.15 (f101) → 0.43 → 0.53 → 0.69 → 0.86 → 0.97 → 1.0 (f107); d 0 (f104) → 0.70 (f105) → 0.81 → 0.98 → 1.0 (f108).
* **Slide left**: Build centre x goes 897 (f108) → 471.6 (f136) along cubic-bezier(0.37, 0.12, 0.03, 0.95). The maximum error is 3 px. The peak speed is
  −54 px/f at f114. Measured x: 890 (f109), 881 (f110), 866 (f111), 844 (f112), 809 (f113), 758 (f114), 704 (f115), 660 (f116),
  626 (f117), 600 (f118), 579 (f119), 561 (f120), 536 (f122), 516 (f124), 501 (f126), 490 (f128), 483 (f130), 476 (f133), 472 (f135).
  y drifts 559 (f99) → 549 (f112) → 546 (f120) → 539 (f130) → 535 (f140) → 534 (f146), a slow upward camera drift.
* **Exit drift (camera pan left, ease-in):** x 470 (f136), 467 (f137), 464 (f138), 459 (f139), 454 (f140), 447 (f141), 438 (f142),
  427 (f143), 412.5 (f144), 392.5 (f145), 362 (f146), which is expo-in. All text **and both rings** move together, so this is a camera pan. Only
  "Build" gets a **horizontal blur ramp**: smear 0.9 (f141), 1.9 (f142), 3.6 (f143), 5.3 (f144), 8.1 (f145), 16.9 px (f146).
  Its vertical edges stay sharp.
* **Words**: each word is positioned at its final slot relative to the Build group from the moment it appears. Its x offset from the Build centre
  (local, s=1, 1080p) is AI +303.75, agents +519.75, in +729.75, minutes +969 (word ink centres). Words do not slide in. They
  step through colour states on the beat:
  | word | dim fade-in (opacity of white) | highlight (hard step) | after |
  |---|---|---|---|
  | AI | — (appears directly highlighted at f116; `#7268A5` f116 → `#978BD3` f121, an ease-in brightening over 5 f) | f116–f121 | f122–126 `#8F89AE` (≈55 %), f127 `#CAC7D9`, f133+ `#F1EFF7` |
  | agents | f118 `#292540` → f121 `#46425C` | f122–f126 `#8E82CB`–`#9589D3` | f127 `#C0BDD3` → f132 `#D0CDDF`, f133+ white |
  | in | f122 `#332F4A` → f126 `#696580` | f127–f130 `#5C46CC` → `#6149DD` (saturated) | f131 `#B0A8DA`, f132 `#CAC6E1`, f133+ white |
  | minutes | f122 `#333049` → f132 `#ABA8BD` (slow) | f133–f138 `#B7ACE9` | f139+ `#ECE9F5` |
  Steps fall on f116, f122, f127, f133 and f139, which is about every 5.75 f, on the music's 8th-note grid.

---

## 5. Camera (whole-picture moves)
* C: no camera. The word moves (rise plus scale) and the background light expands.
* D: one virtual camera on the logo plane. It dollies back (the s formula), then orbits (rotY to the left-near side plus rotZ CCW) from f69, with an
  accelerating pull-back over f91–97. The light streak is **not** rigidly on the plane (its local y drifts from +106 to +124 to +150), so
  animate it in screen space from Appendix L.
* E: the 3D rings swing to face the camera over f98–120 (that is the camera arriving). Then there is a slow upward drift of the text (y 559 → 534) and a
  left pan. The group slide f108–136 is the text's own move, while the f136–146 pan moves text and rings together at the same speed (ring A cx
  965 → 856 against Build 470 → 362).

## 6. Motion blur
* C: no directional blur. The exit blur is isotropic (bloom plus core blur).
* D: no visible directional smear (the moves are slow). The entrance softness is the bloom and core blur listed above.
* E: horizontal motion blur on the Build group during the slide. The 10–90 % edge width of B is 3.4 px (f110 at 720p), then 4.9, 6.9, 9.2, 9.7,
  9.4 and 9.2 (f111–116), against a sharp value of 2.1 (720p). That gives smear lengths at 1080p of 5.4 (f111), 9.2 (f112), 13.5 (f113),
  14.4 (f114), 13.9 (f115) and 13.5 (f116), about 0.26–0.39 of the per-frame displacement. Use a 100–120° shutter equivalent.
  The f141–146 blur on "Build" only is an effect, not camera blur (values above).

## 7. Sound sync (ref audio: 150 BPM, 8th-note grid every 6 f with its phase at f ≈ 2.6 + 6k)
* f3–12: swell from silence (−60 → −29 dB RMS). A soft riser or air whoosh under the fade from black.
* Letter pops of "Meet": the onsets at f17.7, f21.0, f26.7 and f32.7 are soft ticks on the grid. The visible letter starts are M f5, e f9.5,
  e f14.5 and t f19, so put a tiny tick at each letter start (or just let the music carry it).
* f38–45: a rising "charge"/shimmer under the bloom and pixelate, then a **glitch-impact** at the f46 cut (onset at f48.4).
* Logo: hits at f56.7, f68.7, **f74.6 (strongest, when Seek closes the gap)**, f80.6, f87.4, f90.9 and f92.9. A light shimmer or "swish" along
  the streak draw-on (f48–69) and its tail wipe (f79–97). A sparkle when the icon hook completes (f66–68).
* f98–99: **cut to the rings, where the beat drops** (RMS jumps from −25 to −12 dB at 3.3 s). Put the downbeat/impact here.
* f104.6: tick (the `d` appears, and the caret sweep ends at f110).
* **f113.6: whoosh** (the Build slide at peak velocity f113–114, flux 0.89).
* f116.6 pop (AI), **f122.6 pop (agents, flux 1.0)**, f128.6 pop ("in"), f134.8 pop (minutes), f140.6 hit (all white).
* **f146.6: whoosh/impact into the hard cut at 147.**

---

## 8. WKC ADAPTATION (same layout, sizes, positions, timing and motion; WKC content and colours)

**Colour mapping rule for every dark/violet value above:** keep the lightness and saturation and rotate the hue to WKC blue (213°).
Ready-made pairs: `#0F0E21→#0E1721`, `#100F22→#0F1822`, `#121023→#101923`, `#0D0C18→#0C1118`, `#0B0B15→#0B0F15`,
`#090A14→#090E14`, `#1F1849→#182E49`, `#1E1848→#182E48`, `#19153A→#15263A`, `#120F20→#0F1720`, `#15111F→#11171F`,
`#151129→#111C29`, `#1D1739→#172639`, `#16112D→#111E2D`, `#110E1E→#0E151E`, `#14122A→#121D2A`, `#2E2655→#263B55`.
Accents: violet line/caret/arc `#5640D4 / #7B67E0 / #7C6ADA → #3F8CE8` (brand blue), mid `#7967DD → #679CDD`,
lavender `#9F96D9 → #96B4D9`, hot white `#E5E3FB / #FBF8FF → #E6F0FD / #F8FBFF`, "past" grey `#CDCADD → #CAD3DD`,
text white → `#F7F7F8` (brand page white; `#FFFFFF` for the logo wordmark). Warm bloom halos (`#6F636B`) → cool `#E6F0FD`.

### A. f0–4 thumbnail
Show the **WKC end card** in its settled state, rendered from the end-card component (wkc mark plus "WKConversions" lockup centred at
(966, 412), the glowing **"Let's talk"** pill in the reference pill's box x 720–1245 / y 543–702, and **wkconversions.com** centred at
x≈981, y≈750). Use its frames that correspond to ref 1211–1215. Then frame 5 is pure black.

### C. f6–45 "Meet" (script 0–1.5 s)
* Same word, `Meet`. **Inter Tight 800**, colour `#F7F7F8`, centred at x 960, centre y and cap height per Appendix M
  (font-size = cap / 0.728: ≈249 px at f8 falling to 213 px at f43).
* Letter spacing: the reference ink width / cap is 3.41. Inter Tight 800 gives 3.31 at 0 tracking, 3.11 at the brand −0.05em, and
  **3.40 at +0.022em**. Use **+0.022em** for this word so it overlays the reference ink box (590 px wide at f30). If brand tracking
  is required, the word is 9 % narrower but stays centred.
* Per-letter timing, fades, blur, rise, scale, bloom and mosaic are exactly as in §4C. The background is the re-coloured navy (`#0E1721` centre /
  `#0C1118` corners) with the same expanding light. Text halo `drop-shadow(0 0 90px rgba(63,140,232,.30))`. Exit bloom
  colour `#E6F0FD` (cool white), then the mosaic 2/4/8/16/32 px.

### D. f46–97 logo reveal (script 1.5–3 s "WKConversions")
**Lockup** (local px at s=1; place it in a group whose transform is §4D's: centre (966, 527), s, rotZ, rotY, perspective 1350):
* total width 1128.5, centred at 0: **wkc mark** (`films/wkconversions/assets/logo/wkc-mark.svg`, viewBox 999.08×462.37)
  at x −564…−296 (268×124), vertically centred on y +8 (the cap centre). Then a 34.5 px gap. Then the **wordmark**, which occupies exactly the
  reference "Neural Seek" box width (826 px): x −261.75…+564.25, baseline y +64.5.
  - "WK": Inter Tight **800**, 116 px (cap 84.4), tracking −0.05em, white `#FFFFFF`, from x −261.75 to about −68.8. This is the bold part,
    so it takes Neural's role.
  - "Conversions": Inter Tight **300**, 116 px, tracking −0.02em, `#F7F7F8`, final x −44.8…+564.25 (final gap 24 px). It takes
    Seek's role.
* **Mark write-on** replaces the icon draw-on with the same progress table (0.05 at f46 → 1.0 at f67) and the same brightness ramp (30 % at f47 → 100 %
  at f59). Mask the filled brush path with an SVG stroke that traces the handwriting centre-line **w → k → c** (stroke width about 1.4× the brush
  thickness, `strokeDashoffset` driven by the progress), so it literally writes itself. The c's tail finishes on f66–68, as the reference
  hook does. Fill: `linear-gradient(120deg, #9CCBF8 0%, #3F8CE8 55%, #1F5FC4 100%)` (light-blue top-left → brand blue → deep blue
  right, which mirrors the cyan→purple icon), and keep the white circuit-like detail out: the mark is a solid brush. The mark also slides right with the
  iconOff table (52 → 0 px).
* **"WK" bloom and settle**: the bloom table of "Neural" (σ 48 px → 0 by f69, gain 1 → 0) in `#E6F0FD`, and the core blur table. W uses N's rotations
  (−8° → 0), and K uses u's rotation (+7° → 0) plus u's y-offset (+8 → 0) plus the "l" baseline grow (45 % → 100 % height, f47→f68).
* **"Conversions" reveal**: the same fade+blur wipe as "Seek", spread over 11 letters. The 50 % opacity points run linearly from f51.5 (C) to
  f69 (final s), which is a 1.75 f stagger, and each letter ramps over 13 f with blur σ 4.5 → 0. The whole word uses the seekOff slide (+35 px → 0 at f79).
* **Light streak**: identical geometry and timing (Appendix L, screen space). Colour: ends `#3F8CE8`, rising to `#96B4D9` and to a hot
  zone of `#E6F0FD` under the lockup centre (x 1000–1100). Core 2 px plus a 5 px glow `rgba(63,140,232,.55)`. Optional motion-design nod, which does
  not change any geometry: when the head passes the left corner (f51) and the right corner (f69), a 10 px keyframe diamond `#E6F0FD`
  at the corner flashes to 100 % and fades out over 8 f, as if the streak were an animation path with keyframes.
* Background: spotlight centre `#182E49`, mid `#15263A`, outer `#0F1720`, corners `#11171F`/`#0B1118`, closing to `#080B0F` at f97.
  The dark panel at the top right stays as in §2.
* Camera, orbit, exit and cut are exactly as in §4D.

### E. f98–146 "Motion | that makes it click" (script 3.5–5 s, reference timing kept)
Map Build→**Motion**, AI→**that**, agents→**makes**, in→**it**, minutes→**click**. Everything else (rings, caret sweep, tilt-settle,
slide, beat-stepped colour states, exit pan, Build-only exit blur, cut) is unchanged.
* "Motion": Inter Tight 800, cap 82.5 → **113 px**, tracking −0.05em, ink width 346 px (Build is 312). Anchor it by its **left edge**
  at local −156 (Build's left edge relative to the Build centre in Appendix B), so its ink is −156…+190. Then the caret goes at local
  **+227.5** (37.5 px after the ink, as in the reference) instead of +195.75. The caret sweep runs from local −10.5 → +227.5 with the same
  progress curve. Letters fade in as the caret passes: M, o, t, i, o, n with the reference's B/u/i/l/d timings (B→M, u→o, i→t, l→i, d→o) and
  `n` 1 f after `o`, full at f108.
* Caret: 2 px wide, 180 px tall, gradient `#3F8CE8` (top) → `rgba(63,140,232,0)` (bottom 25 %), with a 4 px glow at 40 %.
* Words: **Inter 400, 91 px** (cap 66), baseline at the reference baseline (≈ 570 at f140, i.e. Build centre y + 35), word gap 36 px,
  first word starting 69 px after the caret: local x of the ink boxes: that +296.5…+461, makes +497…+779, it +815…+867,
  click +903…+1101. The line is 1257 px long against the reference's 1294, so the overall centring stays within 18 px.
* Colour states on the same frames: `that` appears highlighted at f116 (`#5B8FD0` → `#7BB6F5` over 5 f), goes to `#9DB0C6` (55 %) at f122–126,
  `#CAD3DD` at f127 and `#F7F7F8` from f133. `makes`: dim white 12 → 30 % over f118–121, highlight `#7BB6F5` f122–126, `#CAD3DD` f127–132,
  white f133+. `it`: dim 15 → 35 % f122–126, **highlight `#3F8CE8` (the saturated one) f127–130**, `#A9C7EE` f131, `#CAD3DD` f132,
  white f133+. `click`: dim 15 → 55 % over f122–132, highlight `#A9CDF7` f133–138, white `#F0F4F8` f139+.
* Rings: same ellipses and lit-arc angles. Outline `#121D2A`, arc ends `#3F8CE8`, arc peak `#F8FBFF` with a `#E6F0FD` glow.
  Background `#111C29`/`#172639` (centre inside ring A `#111E2D`, corners `#0E151E`), fading up from `#08090F` → `#0E151E`
  over f98–104.
* WKC reading of the rings: they become two "orbit/motion-path" loops. Optionally place a tiny 8 px keyframe diamond riding the white peak of
  each lit arc. It is purely additive and does not change any geometry.

### Sound for the WKC version (same sync points as §7)
Air riser f3–12. Soft ticks per letter (f5, f9.5, f14.5, f19). A shimmer riser f38–45 and a digital glitch-hit at f46 (the mosaic). Light swishes
on the streak draw-on f48–69. A whoosh-click at f74 (Conversions snaps in). A sparkle at f67 (the mark's c-tail finishes). **Beat drop/impact at f98.**
Tick at f105. **Whoosh at f113–114** (the Motion slide). UI pops at f116, f122, f127 and f133 (one per highlighted word) and a hit at f139. **Whoosh/impact into the
cut at f146.6.** Music: ≈150 BPM electronic pulse with the 8th-note grid at f ≈ 2.6 + 6k, quiet until f98 and full from f98.

---

## Appendix M: "Meet" per frame (1080p)

centre y and cap h are measured (an `*` marks values from the fit where the letters were too faint to measure). font-size is for Inter Tight 800 (cap 0.728 em). Opacity is the measured normalised peak of each letter (it includes the global fade). "text blur σ (entry)" is the blur on the newest letter (M edge measured; apply the same 3 → 0 px ramp to each letter from its start frame). bg fade is the global background brightness (§2). Bloom and mosaic are the exit effects (§4C).

| f | centre y | cap h | font-size (IT800) | opacity M / e / e / t | text blur σ (entry) | bg fade | bloom σ / gain | text blur σ (exit) | mosaic block |
|---|---|---|---|---|---|---|---|---|---|
| 5 | – | – | – | 0/0/0/0 | – | 0 (pure #000000 frame) | – | – | – |
| 6 | 614.8* | 181.0* | 248.6 | 0.02 / 0.00 / 0.00 / 0.00 | 3.0 | 0.12 | 0 | 0 | – |
| 7 | 609.7* | 181.0* | 248.6 | 0.06 / 0.01 / 0.01 / 0.00 | 3.0 | 0.18 | 0 | 0 | – |
| 8 | 606.1 | 181.0* | 248.6 | 0.11 / 0.00 / 0.00 / 0.01 | 3.0 | 0.41 | 0 | 0 | – |
| 9 | 601.0 | 181.0* | 248.6 | 0.18 / 0.02 / 0.01 / 0.01 | 2.8 | 0.45 | 0 | 0 | – |
| 10 | 596.5 | 180.9* | 248.6 | 0.29 / 0.10 / 0.01 / 0.00 | 2.8 | 0.59 | 0 | 0 | – |
| 11 | 590.5 | 181.4 | 249.1 | 0.35 / 0.16 / 0.01 / 0.00 | 1.8 | 0.59 | 0 | 0 | – |
| 12 | 586.1 | 181.5 | 249.3 | 0.42 / 0.23 / 0.01 / 0.00 | 1.6 | 0.60 | 0 | 0 | – |
| 13 | 582.9 | 181.5 | 249.3 | 0.48 / 0.31 / 0.01 / 0.01 | 1.6 | 0.60 | 0 | 0 | – |
| 14 | 579.2 | 181.2 | 248.9 | 0.56 / 0.39 / 0.01 / 0.01 | 1.6 | 0.62 | 0 | 0 | – |
| 15 | 575.4 | 180.9 | 248.5 | 0.61 / 0.46 / 0.12 / 0.01 | 1.6 | 0.65 | 0 | 0 | – |
| 16 | 572.5 | 180.8 | 248.4 | 0.67 / 0.54 / 0.22 / 0.01 | 1.6 | 0.70 | 0 | 0 | – |
| 17 | 569.6 | 180.3 | 247.7 | 0.76 / 0.62 / 0.33 / 0.01 | 1.4 | 0.80 | 0 | 0 | – |
| 18 | 567.3 | 179.9 | 247.1 | 0.81 / 0.69 / 0.44 / 0.01 | 1.4 | 0.82 | 0 | 0 | – |
| 19 | 564.2 | 179.3 | 246.4 | 0.89 / 0.80 / 0.53 / 0.01 | 1.3 | 0.84 | 0 | 0 | – |
| 20 | 562.2 | 179.1 | 246.0 | 0.93 / 0.85 / 0.62 / 0.11 | 1.2 | 0.86 | 0 | 0 | – |
| 21 | 559.9 | 178.8 | 245.6 | 0.99 / 0.93 / 0.72 / 0.26 | 1.2 | 0.94 | 0 | 0 | – |
| 22 | 557.4 | 178.5 | 245.2 | 1.00 / 1.00 / 0.82 / 0.39 | 1.0 | 0.96 | 0 | 0 | – |
| 23 | 555.6 | 178.0 | 244.5 | 1.00 / 1.00 / 0.86 / 0.49 | 1.0 | 1.00 | 0 | 0 | – |
| 24 | 554.1 | 177.2 | 243.4 | 1.00 / 1.00 / 0.90 / 0.59 | 1.0 | 1.00 | 0 | 0 | – |
| 25 | 552.1 | 176.8 | 242.8 | 1.00 / 1.00 / 0.94 / 0.67 | 0.9 | 1 | 0 | 0 | – |
| 26 | 550.7 | 176.0 | 241.8 | 1.00 / 1.00 / 0.97 / 0.73 | 0.8 | 1 | 0 | 0 | – |
| 27 | 548.9 | 175.6 | 241.3 | 1.00 / 1.00 / 0.99 / 0.79 | 0.7 | 1 | 0 | 0 | – |
| 28 | 547.8 | 174.6 | 239.8 | 1.00 / 1.00 / 1.00 / 0.85 | 0.6 | 1 | 0 | 0 | – |
| 29 | 546.3 | 174.0 | 239.0 | 1.00 / 1.00 / 1.00 / 0.90 | 0.4 | 1 | 0 | 0 | – |
| 30 | 545.5 | 173.1 | 237.8 | 1.00 / 1.00 / 1.00 / 0.93 | 0.0 | 1 | 0 | 0 | – |
| 31 | 544.1 | 172.4 | 236.9 | 1.00 / 1.00 / 1.00 / 0.97 | 0 | 1 | 0 | 0 | – |
| 32 | 542.8 | 171.4 | 235.5 | 1.00 / 1.00 / 1.00 / 0.98 | 0 | 1 | 0 | 0 | – |
| 33 | 542.5 | 170.4 | 234.0 | 1.00 / 1.00 / 1.00 / 1.00 | 0 | 1 | 0 | 0 | – |
| 34 | 541.6 | 169.2 | 232.4 | 1.00 / 1.00 / 1.00 / 1.00 | 0 | 1 | 0 | 0 | – |
| 35 | 540.7 | 168.2 | 231.0 | 1.00 / 1.00 / 1.00 / 1.00 | 0 | 1 | 0 | 0 | – |
| 36 | 539.9 | 167.1 | 229.6 | 1.00 / 1.00 / 1.00 / 1.00 | 0 | 1 | 0 | 0 | – |
| 37 | 539.2 | 165.7 | 227.7 | 1.00 / 1.00 / 1.00 / 1.00 | 0 | 1 | 75 px / 0.03 | 0 | – |
| 38 | 538.6 | 164.5 | 226.0 | 1.00 / 1.00 / 1.00 / 1.00 | 0 | 1 | 18 px / 0.12 | 0 | – |
| 39 | 538.1 | 162.8 | 223.7 | 1.00 / 1.00 / 1.00 / 1.00 | 0 | 1 | 18 px / 0.26 | 0 | – |
| 40 | 538.3 | 161.0 | 221.2 | 1.00 / 1.00 / 1.00 / 1.00 | 0 | 1 | 24 px / 0.44 | 0.75 | – |
| 41 | 537.6 | 159.2 | 218.7 | 1.00 / 1.00 / 1.00 / 1.00 | 0 | 1 | 38 px / 0.66 | 0.75 | 2 px |
| 42 | 538.0* | 157.2 | 215.9 | 1.00 / 1.00 / 1.00 / 1.00 | 0 | 1 | 60 px / 0.94 | 2.25 | 4 px |
| 43 | 537.9* | 155.3 | 213.4 | 1.00 / 1.00 / 1.00 / 1.00 | 0 | 1 | 75 px / 1.34 | 4.50 | 8 px |
| 44 | 537.8* | 152.8 | 209.9 | 1.00 / 1.00 / 1.00 / 1.00 | 0 | 1 | 75 px / 1.75 | 9.00 | 16 px |
| 45 | 537.7* | 151.0* | 207.4 | 1.00 / 1.00 / 1.00 / 1.00 | 0 | 1 | 75 px / 2.40 | 9.00 | 32 px |

## Appendix G: logo group per frame (1080p)

Logo shot per-frame table (1080p). s = lockup scale where 1.0 = end-card size (wordmark cap 112.5 px). rotZ = screen rotation, + = counter-clockwise (CSS rotate(-rotZ deg)). rotY = left side toward camera, perspective 1350 px. iconOff / seekOff = extra local x-offset (px at s=1, 1080p) of the icon (+ = further LEFT of final) and of the 2nd word (+ = further RIGHT of final). measured columns from letter tracking; *fit* columns are the smooth curves to use.

| f | centre x | centre y | s meas | s fit | rotZ° | rotY° est | iconOff | seekOff | Neural glow σ / gain | S e e k opacity |
|---|---|---|---|---|---|---|---|---|---|---|
| 46 | 970.3 | 541.1 | 1.5991 | 1.6127 | 0.00 | 0 | -9.9 | 32.8 | 48 px / 1.00 | 0.12/0.03/0.02/0.00 |
| 47 | 968.3 | 522.9 | 1.5097 | 1.5060 | 0.00 | 0 | 26.8 | 35.1 | 48 px / 1.00 | 0.18/0.03/0.02/0.01 |
| 48 | 968.2 | 523.2 | 1.4252 | 1.4278 | 0.00 | 0 | 47.2 | 35.6 | 48 px / 1.00 | 0.23/0.03/0.02/0.01 |
| 49 | 967.9 | 524.3 | 1.3635 | 1.3682 | 0.00 | 0 | 52.1 | 35.7 | 48 px / 1.00 | 0.30/0.04/0.01/0.01 |
| 50 | 967.8 | 524.7 | 1.3190 | 1.3211 | 0.00 | 0 | 50.7 | 34.5 | 48 px / 1.00 | 0.40/0.05/0.01/0.01 |
| 51 | 967.6 | 525.5 | 1.2821 | 1.2832 | 0.00 | 0 | 49.5 | 34.2 | 48 px / 1.00 | 0.46/0.05/0.01/0.02 |
| 52 | 967.5 | 525.3 | 1.2519 | 1.2519 | 0.00 | 0 | 48.6 | 34.0 | 48 px / 0.98 | 0.52/0.07/0.02/0.02 |
| 53 | 967.4 | 525.6 | 1.2274 | 1.2256 | 0.00 | 0 | 47.4 | 33.3 | 48 px / 0.95 | 0.61/0.11/0.01/0.01 |
| 54 | 967.2 | 526.0 | 1.2051 | 1.2033 | 0.00 | 0 | 46.1 | 32.8 | 48 px / 0.90 | 0.67/0.17/0.02/0.01 |
| 55 | 967.1 | 526.3 | 1.1861 | 1.1841 | 0.00 | 0 | 44.8 | 32.8 | 36 px / 0.64 | 0.74/0.24/0.02/0.02 |
| 56 | 967.1 | 526.0 | 1.1701 | 1.1674 | 0.00 | 0 | 43.6 | 32.2 | 36 px / 0.59 | 0.78/0.31/0.02/0.02 |
| 57 | 967.0 | 526.6 | 1.1551 | 1.1527 | 0.00 | 0 | 42.7 | 31.6 | 36 px / 0.54 | 0.81/0.42/0.04/0.02 |
| 58 | 966.9 | 527.3 | 1.1426 | 1.1398 | -0.20 | 0 | 41.4 | 30.9 | 24 px / 0.37 | 0.83/0.51/0.05/0.02 |
| 59 | 966.9 | 527.3 | 1.1307 | 1.1282 | -0.20 | 0 | 40.5 | 30.5 | 18 px / 0.34 | 0.85/0.60/0.10/0.01 |
| 60 | 966.7 | 527.3 | 1.1197 | 1.1179 | -0.16 | 0 | 39.3 | 30.0 | 18 px / 0.30 | 0.88/0.69/0.15/0.01 |
| 61 | 966.8 | 527.3 | 1.1096 | 1.1086 | -0.10 | 0 | 38.6 | 29.6 | 12 px / 0.28 | 0.89/0.77/0.24/0.02 |
| 62 | 966.7 | 527.2 | 1.1007 | 1.1002 | -0.10 | 0 | 37.5 | 29.0 | 12 px / 0.24 | 0.92/0.84/0.32/0.03 |
| 63 | 966.6 | 527.3 | 1.0927 | 1.0925 | -0.08 | 0 | 36.3 | 28.4 | 12 px / 0.20 | 0.93/0.87/0.45/0.04 |
| 64 | 966.6 | 527.4 | 1.0845 | 1.0855 | -0.06 | 0 | 35.6 | 27.8 | 9 px / 0.18 | 0.95/0.91/0.56/0.06 |
| 65 | 966.6 | 527.3 | 1.0775 | 1.0790 | -0.09 | 0 | 34.2 | 26.9 | 9 px / 0.14 | 0.96/0.95/0.64/0.09 |
| 66 | 966.6 | 527.4 | 1.0717 | 1.0731 | -0.01 | -0.4 | 33.1 | 26.1 | 9 px / 0.11 | 0.97/0.96/0.76/0.17 |
| 67 | 966.5 | 527.4 | 1.0655 | 1.0676 | -0.04 | -0.4 | 31.9 | 25.2 | 6 px / 0.09 | 0.97/0.97/0.88/0.25 |
| 68 | 966.5 | 527.4 | 1.0599 | 1.0626 | -0.03 | 1.2 | 30.2 | 24.0 | 6 px / 0.05 | 0.97/0.97/0.93/0.37 |
| 69 | 966.4 | 527.4 | 1.0545 | 1.0579 | -0.01 | 0.7 | 28.7 | 22.7 | 0 | 0.98/0.98/0.99/0.50 |
| 70 | 966.3 | 527.3 | 1.0510 | 1.0535 | 0.19 | 1.2 | 27.1 | 20.2 | 0 | 0.98/0.98/1.00/0.63 |
| 71 | 966.3 | 527.4 | 1.0473 | 1.0494 | 0.37 | 2.8 | 24.7 | 17.3 | 0 | 0.98/0.98/1.00/0.75 |
| 72 | 966.2 | 527.4 | 1.0432 | 1.0456 | 0.65 | 3.9 | 21.9 | 13.6 | 0 | 0.98/0.98/1.00/0.87 |
| 73 | 966.1 | 527.3 | 1.0400 | 1.0420 | 0.85 | 3.4 | 18.4 | 9.9 | 0 | 0.98/0.98/1.00/0.94 |
| 74 | 966.1 | 527.2 | 1.0370 | 1.0386 | 1.03 | 4.4 | 16.3 | 7.1 | 0 | 1.00/1.00/1.00/1.00 |
| 75 | 966.0 | 527.2 | 1.0341 | 1.0355 | 1.20 | 4.4 | 14.9 | 4.9 | 0 | 1.00/1.00/1.00/1.00 |
| 76 | 966.0 | 527.2 | 1.0315 | 1.0325 | 1.37 | 3.9 | 13.5 | 3.3 | 0 | 1.00/1.00/1.00/1.00 |
| 77 | 965.9 | 527.2 | 1.0289 | 1.0296 | 1.54 | 3.4 | 12.5 | 2.1 | 0 | 1.00/1.00/1.00/1.00 |
| 78 | 965.8 | 527.3 | 1.0265 | 1.0270 | 1.70 | 2.8 | 12.0 | 0.9 | 0 | 1.00/1.00/1.00/1.00 |
| 79 | 965.7 | 527.1 | 1.0240 | 1.0245 | 1.80 | 3.9 | 10.9 | 0.1 | 0 | 1.00/1.00/1.00/1.00 |
| 80 | 965.6 | 527.0 | 1.0223 | 1.0221 | 1.98 | 4.4 | 10.2 | -1.0 | 0 | 1.00/1.00/1.00/1.00 |
| 81 | 965.6 | 527.2 | 1.0198 | 1.0198 | 2.11 | 5.5 | 10.3 | -1.5 | 0 | 1.00/1.00/1.00/1.00 |
| 82 | 965.6 | 527.0 | 1.0185 | 1.0176 | 2.20 | 5.0 | 9.6 | -2.4 | 0 | 1.00/1.00/1.00/1.00 |
| 83 | 965.5 | 527.1 | 1.0165 | 1.0155 | 2.33 | 5.5 | 9.1 | -3.0 | 0 | 1.00/1.00/1.00/1.00 |
| 84 | 965.4 | 527.2 | 1.0147 | 1.0136 | 2.48 | 6.1 | 8.8 | -3.5 | 0 | 1.00/1.00/1.00/1.00 |
| 85 | 965.4 | 527.2 | 1.0135 | 1.0117 | 2.53 | 6.1 | 8.5 | -4.2 | 0 | 1.00/1.00/1.00/1.00 |
| 86 | 965.3 | 527.2 | 1.0117 | 1.0099 | 2.68 | 6.1 | 8.5 | -4.6 | 0 | 1.00/1.00/1.00/1.00 |
| 87 | 965.2 | 527.3 | 1.0103 | 1.0082 | 2.70 | 7.7 | 7.8 | -5.0 | 0 | 1.00/1.00/1.00/1.00 |
| 88 | 965.2 | 527.3 | 1.0078 | 1.0066 | 2.86 | 7.1 | 8.0 | -5.5 | 0 | 1.00/1.00/1.00/1.00 |
| 89 | 965.1 | 527.6 | 1.0061 | 1.0050 | 2.95 | 8.2 | 7.9 | -6.1 | 0 | 1.00/1.00/1.00/1.00 |
| 90 | 965.1 | 527.6 | 1.0043 | 1.0035 | 2.96 | 6.1 | 7.5 | -6.7 | 0 | 1.00/1.00/1.00/1.00 |
| 91 | 965.0 | 528.0 | 1.0005 | 1.0020 | 3.12 | 10.6 | 7.9 | -7.2 | 0 | 1.00/1.00/1.00/1.00 |
| 92 | 965.0 | 528.2 | 0.9967 | 1.0006 | 3.13 | 9.0 | 7.8 | -8.0 | 0 | 1.00/1.00/1.00/1.00 |
| 93 | 964.9 | 528.4 | 0.9903 | 0.9993 | 3.17 | 10.6 | 8.5 | -8.8 | 0 | 1.00/1.00/1.00/1.00 |
| 94 | 964.8 | 529.1 | 0.9818 | 0.9980 | 3.05 | 11.7 | 8.6 | -10.1 | 0 | 1.00/1.00/1.00/1.00 |
| 95 | 964.6 | 529.4 | 0.9656 | 0.9968 | 3.04 | 14.0 | 9.9 | -11.4 | 0 | 1.00/1.00/1.00/1.00 |
| 96 | 964.6 | 530.5 | 0.9378 | 0.9956 | 2.57 | 15.7 | 11.5 | -13.6 | 0 | 1.00/1.00/1.00/1.00 |
| 97 | 964.6 | 531.3 | 0.8800 | 0.9944 | 1.15 | 7.5 | 17.1 | -17.2 | 0 | 1.00/1.00/1.00/1.00 |

Use the "s fit" column for f46–90 and the measured s for f91–97 (the exit). For rotY use the smoothed values in §4D; the raw estimates above are noisy (±2°). iconOff and seekOff above are raw measurements. The authored curves are in §4D: the negative seekOff after f80 and about 0.6·rotY px of iconOff come from the perspective itself. Opacities in the last column apply to the 2nd-word letters (Seek → Conversions; see §8).

## Appendix L: light-streak polyline per frame (screen space, 1080p)

The horizontal segment is y = (y at x=0) + slope·x. "visible x from → to" is the drawn part of the horizontal (tail trim → head; once the head has passed the right corner, the right end is the corner). Diagonals: x = x_corner + (dx/dy)·(y − y_corner). The left diagonal runs down-left from the left corner to the "visible to y" value (at f51–69 that is the frame edge). The right diagonal runs up-right from the right corner to "visible up to y". Before f51 the left corner is just off-screen left (x ≤ 40, y ≈ 664).

| f | horizontal segment: y at x=0 / slope | visible x from → to | left corner (x,y) | left diag dx/dy, visible to y | right corner (x,y) | right diag dx/dy, visible up to y |
|---|---|---|---|---|---|---|
| 48 | 668.5 / -0.0009 | 37 → 462 | off-screen left | – | not reached | – |
| 49 | 665.3 / 0.0008 | 31 → 550 | off-screen left | – | not reached | – |
| 50 | 664.3 / -0.0002 | 40 → 646 | off-screen left | – | not reached | – |
| 51 | 662.9 / -0.0003 | 66 → 726 | (73, 663) | -0.890, 750 | not reached | – |
| 52 | 663.4 / -0.0031 | 85 → 808 | (94, 663) | -0.860, 774 | not reached | – |
| 53 | 661.4 / -0.0008 | 108 → 892 | (114, 661) | -0.851, 798 | not reached | – |
| 54 | 660.1 / -0.0000 | 127 → 966 | (132, 660) | -0.851, 817 | not reached | – |
| 55 | 658.3 / 0.0019 | 145 → 1036 | (152, 659) | -0.864, 838 | not reached | – |
| 56 | 659.7 / -0.0006 | 156 → 1099 | (162, 660) | -0.860, 852 | not reached | – |
| 57 | 658.6 / 0.0002 | 168 → 1155 | (177, 659) | -0.875, 861 | not reached | – |
| 58 | 657.0 / 0.0018 | 184 → 1215 | (191, 657) | -0.882, 877 | not reached | – |
| 59 | 659.2 / -0.0007 | 187 → 1273 | (189, 659) | -0.840, 886 | not reached | – |
| 60 | 658.3 / -0.0002 | 198 → 1333 | (198, 658) | -0.829, 900 | not reached | – |
| 61 | 658.2 / -0.0002 | 205 → 1372 | (214, 658) | -0.870, 907 | not reached | – |
| 62 | 656.4 / 0.0016 | 217 → 1423 | (221, 657) | -0.867, 913 | not reached | – |
| 63 | 658.1 / -0.0004 | 220 → 1464 | (223, 658) | -0.849, 921 | not reached | – |
| 64 | 658.0 / -0.0004 | 226 → 1527 | (228, 658) | -0.854, 924 | not reached | – |
| 65 | 658.0 / -0.0004 | 232 → 1590 | (232, 658) | -0.847, 931 | not reached | – |
| 66 | 658.0 / -0.0004 | 237 → 1599 | (238, 658) | -0.847, 933 | not reached | – |
| 67 | 657.2 / 0.0001 | 243 → 1608 | (245, 657) | -0.862, 930 | not reached | – |
| 68 | 655.8 / 0.0005 | 249 → 1609 | (247, 656) | -0.836, 939 | not reached | – |
| 69 | 658.7 / -0.0006 | 249 → 1599 | (250, 658) | -0.845, 924 | (1604, 658) | -0.666, 553 |
| 70 | 662.7 / -0.0054 | 250 → 1600 | (254, 661) | -0.843, 910 | (1599, 654) | -0.666, 540 |
| 71 | 665.6 / -0.0085 | 256 → 1591 | (260, 663) | -0.854, 918 | (1592, 652) | -0.674, 514 |
| 72 | 670.7 / -0.0137 | 253 → 1591 | (255, 667) | -0.818, 907 | (1593, 649) | -0.626, 472 |
| 73 | 674.0 / -0.0168 | 256 → 1582 | (261, 670) | -0.833, 909 | (1582, 647) | -0.663, 427 |
| 74 | 676.0 / -0.0196 | 265 → 1579 | (267, 671) | -0.852, 885 | (1582, 645) | -0.634, 388 |
| 75 | 681.4 / -0.0246 | 261 → 1579 | (269, 675) | -0.864, 871 | (1577, 643) | -0.640, 393 |
| 76 | 683.1 / -0.0268 | 267 → 1572 | (273, 676) | -0.870, 829 | (1576, 641) | -0.616, 394 |
| 77 | 686.8 / -0.0310 | 265 → 1578 | (270, 678) | -0.835, 798 | (1574, 638) | -0.607, 361 |
| 78 | 691.1 / -0.0354 | 265 → 1576 | (271, 681) | -0.844, 766 | (1571, 635) | -0.603, 379 |
| 79 | 691.5 / -0.0359 | 279 → 1569 | trimmed away | – | (1567, 635) | -0.601, 364 |
| 80 | 695.8 / -0.0404 | 291 → 1570 | trimmed away | – | (1569, 632) | -0.578, 349 |
| 81 | 697.5 / -0.0423 | 345 → 1567 | trimmed away | – | (1566, 631) | -0.572, 361 |
| 82 | 699.5 / -0.0441 | 393 → 1563 | trimmed away | – | (1560, 631) | -0.588, 364 |
| 83 | 703.0 / -0.0475 | 466 → 1563 | trimmed away | – | (1560, 629) | -0.572, 345 |
| 84 | 705.1 / -0.0500 | 525 → 1563 | trimmed away | – | (1558, 627) | -0.570, 339 |
| 85 | 706.6 / -0.0513 | 582 → 1558 | trimmed away | – | (1555, 627) | -0.563, 337 |
| 86 | 708.5 / -0.0532 | 639 → 1555 | trimmed away | – | (1554, 626) | -0.550, 372 |
| 87 | 710.3 / -0.0548 | 696 → 1552 | trimmed away | – | (1550, 625) | -0.554, 363 |
| 88 | 710.8 / -0.0552 | 754 → 1549 | trimmed away | – | (1548, 625) | -0.543, 366 |
| 89 | 713.6 / -0.0583 | 822 → 1549 | trimmed away | – | (1548, 623) | -0.527, 370 |
| 90 | 716.2 / -0.0610 | 886 → 1548 | trimmed away | – | (1541, 622) | -0.542, 369 |
| 91 | 717.0 / -0.0621 | 948 → 1542 | trimmed away | – | (1540, 621) | -0.511, 369 |
| 92 | 718.6 / -0.0640 | 1011 → 1539 | trimmed away | – | (1534, 620) | -0.509, 379 |
| 93 | 718.4 / -0.0645 | 1074 → 1531 | trimmed away | – | (1530, 620) | -0.479, 396 |
| 94 | 716.0 / -0.0636 | 1138 → 1524 | trimmed away | – | (1520, 619) | -0.462, 438 |
| 95 | 715.4 / -0.0647 | 1191 → 1512 | trimmed away | – | (1507, 618) | -0.434, 472 |
| 96 | 708.7 / -0.0612 | 1249 → 1491 | trimmed away | – | (1486, 618) | -0.395, 484 |
| 97 | 691.8 / -0.0486 | 1285 → 1450 | trimmed away | – | (1444, 622) | -0.338, 504 |

## Appendix B: "Build" shot per frame (1080p)

Build centre is the ink-box centre of the whole word "Build" at its current scale and rotation. s is relative to the settled size (cap 82.5 px), and rotZ is CCW+ (negative = clockwise). caret x is the bar x position (measured to f111, derived after that as centre + 195.75·s). Build h-blur is the horizontal smear length on the Build group (slide) and on "Build" only (exit, f141–146). Rings use the SVG/OpenCV ellipse convention: cx, cy, rx, ry, rotation clockwise in degrees. Ring A is the front/inner ring and ring B the back/outer ring. "(interp)" rows are linear interpolations between RANSAC fits; ring B is partly off-frame from f112, so its fits there have about ±6 px uncertainty and the near-circular rows have no meaningful angle.

| f | Build centre x,y | s | rotZ° (−=clockwise) | caret x | Build h-blur px | ring A cx,cy,rx,ry,angle | ring B cx,cy,rx,ry,angle |
|---|---|---|---|---|---|---|---|
| 98 | – | – | – | 888 | 0 | 768, 614, 241, 408, 159° | 1204, 444, 367, 477, 159°  |
| 99 | 896, 559 | 0.74 | -12.0 | 892 | 0 | 780, 619, 313, 460, 156° | 1196, 426, 431, 526, 153°  |
| 100 | 887, 560 | 0.68 | -12.5 | 926 | 0 | 786, 620, 349, 491, 155° | 1199, 429, 457, 534, 156°  |
| 101 | 890, 559 | 0.70 | -10.0 | 954 | 0 | 795, 619, 383, 515, 154° | 1194, 429, 480, 544, 156°  |
| 102 | 892, 557 | 0.72 | -8.0 | 977 | 0 | 805, 618, 413, 535, 153° | 1188, 431, 500, 553, 156°  |
| 103 | 895, 556 | 0.74 | -6.5 | 998 | 0 | 815, 615, 441, 552, 152° | 1179, 433, 516, 561, 156°  |
| 104 | 898, 556 | 0.77 | -6.0 | 1017 | 0 | 826, 612, 467, 567, 152° | 1170, 436, 531, 568, 155°  |
| 105 | 900, 555 | 0.79 | -5.0 | 1031 | 0 | 836, 608, 490, 579, 151° | 1159, 440, 544, 574, 154°  |
| 106 | 895, 554 | 0.83 | -5.0 | 1044 | 0 | 847, 604, 510, 590, 150° | 1148, 443, 556, 582, 154°  |
| 107 | 900, 554 | 0.84 | -4.5 | 1054 | 0 | 857, 600, 527, 599, 150° | 1138, 447, 567, 588, 153°  |
| 108 | 897, 553 | 0.86 | -4.0 | 1058 | 0 | 868, 595, 543, 605, 149° | 1126, 451, 577, 594, 154°  |
| 109 | 890, 551 | 0.87 | -3.5 | 1059 | 0 | 879, 590, 555, 609, 148° | 1114, 454, 588, 604, 151°  |
| 110 | 881, 550 | 0.88 | -3.0 | 1054 | 0 | 890, 584, 564, 611, 148° | 1101, 458, 598, 614, 151°  |
| 111 | 866, 550 | 0.89 | -3.0 | 1044 | 5.4 | 904, 576, 569, 608, 147° | 1090, 466, 611, 622, 152°  |
| 112 | 844, 549 | 0.90 | -2.5 | 1020 | 9.2 | 920, 566, 566, 599, 146° | 1068, 463, 627, 650, 144°  |
| 113 | 809, 549 | 0.92 | -2.0 | 989 | 13.5 | 937, 555, 558, 583, 144° | 1056, 472, 648, 667, ≈circle (interp) |
| 114 | 758, 549 | 0.92 | -2.0 | 938 | 14.4 | 947, 550, 555, 572, 151° | 1043, 481, 668, 685, ≈circle (interp) |
| 115 | 704, 549 | 0.94 | -1.5 | 888 | 13.9 | 956, 543, 549, 566, 144° | 1031, 490, 688, 703, 139°  |
| 116 | 660, 548 | 0.93 | -1.5 | 842 | 13.5 | 960, 540, 548, 563, 143° | 1024, 494, 701, 715, ≈circle (interp) |
| 117 | 626, 548 | 0.95 | -1.5 | 812 | 0 | 962, 538, 549, 560, 142° | 1016, 498, 714, 727, ≈circle (interp) |
| 118 | 600, 547 | 0.95 | -1.0 | 786 | 0 | 964, 537, 548, 558, 142° | 1009, 502, 727, 738, 151°  |
| 119 | 579, 547 | 0.95 | -1.0 | 765 | 0 | 965, 536, 548, 557, 140° | 1004, 505, 735, 745, ≈circle (interp) |
| 120 | 561, 546 | 0.96 | -0.5 | 749 | 0 | 966, 535, 548, 555, 141° | 998, 507, 743, 752, 142°  |
| 121 | 548, 545 | 0.97 | -0.5 | 737 | 0 | 966, 534, 548, 554, 141° | 995, 509, 748, 757, ≈circle (interp) |
| 122 | 536, 545 | 0.97 | -0.5 | 725 | 0 | 966, 534, 548, 553, 140° | 991, 510, 753, 762, 133°  |
| 123 | 525, 544 | 0.98 | -0.5 | 717 | 0 | 966, 534, 548, 552, 139° | 987, 512, 758, 765, ≈circle (interp) |
| 124 | 516, 543 | 0.98 | -0.5 | 708 | 0 | 966, 534, 548, 551, 134° | 984, 515, 763, 768, ≈circle (interp) |
| 125 | 508, 543 | 0.98 | -0.5 | 700 | 0 | 965, 534, 548, 550, 134° | 981, 517, 768, 772, ≈circle (interp) |
| 126 | 501, 541 | 0.99 | 0.0 | 694 | 0 | 965, 534, 548, 550, 128° | 977, 519, 773, 775, 159°  |
| 127 | 495, 541 | 0.99 | 0.0 | 689 | 0 | 964, 534, 547, 549, 126° | 975, 520, 775, 777, ≈circle (interp) |
| 128 | 490, 540 | 0.99 | 0.0 | 684 | 0 | 964, 534, 547, 549, 125° | 973, 521, 777, 780, ≈circle (interp) |
| 129 | 486, 539 | 1.00 | 0.0 | 682 | 0 | 964, 534, 547, 549, 122° | 971, 522, 779, 783, ≈circle (interp) |
| 130 | 483, 539 | 1.00 | 0.0 | 679 | 0 | 963, 534, 548, 549, 122° | 969, 523, 782, 785, 109°  |
| 131 | 480, 538 | 1.00 | 0.0 | 676 | 0 | 963, 535, 548, 549, 122° | 967, 524, 783, 788, ≈circle (interp) |
| 132 | 478, 538 | 1.00 | 0.0 | 674 | 0 | 962, 535, 549, 549, 114° | 966, 525, 785, 791, ≈circle (interp) |
| 133 | 476, 537 | 1.00 | 0.0 | 672 | 0 | 961, 535, 549, 549, 102° | 964, 526, 787, 794, ≈circle (interp) |
| 134 | 474, 537 | 1.00 | 0.0 | 670 | 0 | 961, 535, 550, 550, 90° | 963, 527, 789, 797, 99°  |
| 135 | 472, 536 | 1.00 | 0.0 | 668 | 0 | 960, 535, 551, 551, 69° | 960, 528, 793, 800, ≈circle (interp) |
| 136 | 470, 536 | 1.00 | 0.0 | 666 | 0 | 958, 536, 552, 552, 70° | 957, 528, 797, 803, ≈circle (interp) |
| 137 | 467, 536 | 1.00 | 0.0 | 663 | 0 | 956, 536, 553, 554, 75° | 954, 529, 801, 807, ≈circle (interp) |
| 138 | 464, 535 | 1.00 | 0.0 | 660 | 0 | 953, 536, 555, 555, 75° | 951, 530, 804, 810, 90°  |
| 139 | 459, 535 | 1.00 | 0.0 | 655 | 0 | 949, 536, 556, 557, 54° | 946, 530, 807, 814, ≈circle (interp) |
| 140 | 454, 535 | 1.00 | 0.0 | 650 | 0 | 943, 536, 558, 559, 77° | 941, 530, 810, 818, 98°  |
| 141 | 447, 534 | 1.00 | 0.0 | 643 | 0.9 | 936, 536, 561, 561, 62° | 931, 530, 817, 823, ≈circle (interp) |
| 142 | 438, 534 | 1.00 | 0.0 | 634 | 1.9 | 927, 536, 563, 563, 85° | 922, 530, 824, 829, ≈circle (interp) |
| 143 | 427, 534 | 1.00 | 0.0 | 623 | 3.6 | 916, 536, 566, 566, 156° | 912, 530, 831, 834, 50°  |
| 144 | 412, 534 | 1.00 | 0.0 | 608 | 5.2 | 903, 536, 568, 568, 107° | 892, 531, 837, 840, ≈circle (interp) |
| 145 | 393, 534 | 1.00 | 0.0 | 588 | 8.1 | 884, 536, 571, 571, 87° | 871, 531, 843, 845, ≈circle (interp) |
| 146 | 362, 534 | 1.00 | 0.0 | 558 | 16.9 | 856, 536, 574, 575, 104° | 850, 531, 849, 851, 77°  |

## Boundary notes (frames 0–156)

* Entering from a previous segment: nothing. Frame 0 is the first frame of the file and shows the end card (thumbnail), f5 is black, and the film proper starts at f6.
* Leaving into the next segment: a **hard cut at 146→147** (on the music 8th at f146.6). The f147–156 shot is light/UI: "Drag." (large bold grey-white, left at about x 210–600, y 200–350) with "Drop." dimmed below it, the product window entering from the right with a glowing white rim (left edge at about x 810, top at about y 135 at f150), and a 3D cursor arrow at the lower left (about (720–840, 720–860) at f150). Nothing from shot E carries over. The rings, text and pan all end at f146.
* The last frame of each shot, for continuity checks: C f45 (mosaic 32 px), D f97 (lockup s 0.88, darkened), E f146 (pan at −30 px/f, "Build" smeared 17 px).
