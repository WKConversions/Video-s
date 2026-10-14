# Segment 2 — frames 147–286 (assigned 150–282; 4.90–9.53 s) — "Drag. Drop. Done." UI drag → pastel "Or……… just vibe it"

All coordinates in this file are **1920×1080 pixels** (the reference was measured at 1280×720 and every value was multiplied by 1.5). Frame n = n/30 s. "x" grows to the right, "y" grows down. Colours are sampled sRGB hex from the reference frames.
Measurement method: SIFT homographies for the UI panel (rms error < 0.7 px), SIFT similarity fits for the text column, thresholded bounding boxes for text, cards and dots, connected-component and convexity analysis for the cursor, and band-limited onset detection on `ref/audio.wav` for sound.

---------------------------------------------------------------------------------------------------

## 0. Context at the edges (frames 144–288)

* **144–146**: the end of the previous segment. Dark violet shot with "Build | AI agents in minutes" and the large thin light ring. Nothing from it carries into this segment.
* **146 → 147: HARD CUT** into Shot A. There is no crossfade or blur, and frame 146 is clean. The music hit lands on this cut (see §7).
* Shot A starts mid-motion. On frame 147 the UI panel, the cursor and the "Drag." word are already moving (these entrances finished their first frames "before" the cut). Copy the first frames exactly from the tables; do not animate them in from zero.
* **218 → 219: HARD CUT** from dark Shot A to pastel Shot B.
* **244 → 245: HARD CUT ("whip-cut")** inside Shot B. The line jumps ahead along the dot leader. The background changes state and the ring disappears.
* **286 → 287: HARD CUT** into the next segment: a close-up of a glass prompt pill on a white/cyan pastel background, tilted in 3D, with an inner pill. From 276 to 286 that pill **already zooms in over Shot B** (see Shot B3). In the reference the next shot's pill does not continue the 286 pill's geometry (at 287 it spans x 282–1595, y 290–758), so the handover is a cut.

## 1. Shot list

| # | frames | duration | content | in | out |
|---|---|---|---|---|---|
| A | **147–218** | 72 f | Dark violet stage. Left: "Drag." / "Drop." / "Done" column with the active word white and the others at 10 %. Right: a large glowing-rim product UI panel (dark sidebar + light canvas). A 3D arrow cursor drags a Slack logo onto the canvas (147–168), drops it (170), the drop grows into a big purple card (170–187), the card shrinks into a white node (188–198), the cursor whips a loop (194–201), and the panel tilts into 3D (199–218) | cut | cut |
| A-sub | 147–167 | — | "Drag." active | — | 3-frame crossfade 168–170 |
| A-sub | 168–198 | — | "Drop." active | 3-frame crossfade | 3-frame crossfade 198–201 |
| A-sub | 199–218 | — | "Done" active | — | cut |
| B1 | **219–244** | 26 f | Pastel mesh gradient. "Or" (zoom-settle from 1.39×), then "." characters typed one after another while the line pans left with acceleration. A soft light ring appears behind | cut | **whip-cut** (hard cut) |
| B2 | **245–265** | 21 f | Same line further along: the tail of the dot leader, then "just vibe it" typed (248–254), sparkles (253+), the pan decelerates to centre, and the dots are erased from the left (262–265) | cut | — (continuous) |
| B3 | **266–286** | 21 f | "just vibe it" turns into wobbly 3D extruded type and shrinks/squeezes. Sparkles drift. From 276 the next shot's glass pill flies in from huge scale (its edges first read as horizontal light streaks) and frames the line by 284–286 | — | cut at 287 |

No crossfades, blur-throughs or pushes happen anywhere in this segment. Every shot change is a hard cut, and all motion lives inside the shots.

---------------------------------------------------------------------------------------------------

## 2. SHOT A (147–218): dark stage + UI panel

### 2.1 Background
* Flat, nearly uniform dark violet-navy. Its brightness rises during the shot (an animated base colour, not a moving gradient):
  * 147–150: `#0B0B15` everywhere (top-right corner slightly darker `#070A13`).
  * Ramp from 150 to 185, roughly linear: top-left `#0D0B18` (153), `#0F0D1A` (159), `#120E1D` (165, then constant). Left-middle `#141021` by 183. Bottom-left corner `#161129`→`#18122C` (a faint violet glow in the lower-left, roughly radial, radius ~600 px, centred about (0, 1080)). Area under the text column `#141020` from 186, `#161126` from 201.
  * From 185 on: top `#120E1D`, middle-left `#141021`, lower-left `#17122B`.
* **Grain**: practically none (high-pass σ ≈ 0.2 levels). **Vignette**: none.
* **Neon line strokes** ("circuit" lines): a thin glowing polyline, the visible corners of a very large chamfered (octagonal) frame that sits behind the panel in world space and moves with the camera.
  * Core: 3–4 px wide, colour `#9A90E8`→`#A89DEC` at its brightest. Glow: a purple halo of about 20 px (`#6C59C3` at 6 px from the core).
  * **Bottom-left piece**. It fades in 168→176 (core brightness `#382F72` at 170, `#776EA9` at 173, `#9389CC` at 176), then holds. Shape: a near-horizontal segment entering from the left edge, then a corner, then a diagonal running down-right at about 51° (dy/dx ≈ 1.25) off the bottom edge. Corner position by frame: 185 **(168, 986)**, 200 **(225, 963)**, 210 **(308, 936)**, 218 **(342, 915)**. Horizontal part at 185: y 981 at x=0, y 984 at x=120. The whole piece drifts up and right with the camera zoom-out (see the 2.2 camera table).
  * **Top-right piece**. It appears 197–200 and holds. Shape: a diagonal entering from the top edge going down-right at about 50°, then a corner, then a near-horizontal segment that rises slightly to the right edge. Corner: 210 **(1628, 105)**, 218 **(1593, 132)**. At 218 the horizontal part runs from (1593, 132) to (1815, 111). The diagonal meets the top edge at about x=1515 (218).

### 2.2 Camera / layer transforms: per-frame table (MEASURED)
Two layers move separately. Both use transform-origin **(960, 540)** in screen space:
* **Text layer** (the Drag/Drop/Done column): 2D only, `translate(tx,ty) scale(s)`. A point in world space (= its screen position on frame 185) maps to `screen = (960,540) + (tx,ty) + s·(world − (960,540))`.
* **UI panel**: CSS 3D. The parent has `perspective: 3300px; perspective-origin: 960px 540px`. Panel transform = `translate(tx,ty) scale(s) rotateX(rX) rotateY(rY) rotateZ(rZ)`, transform-origin at screen (960,540). Because the panel's top-left sits at world (635.6, 67.5), that is `transform-origin: 324.4px 472.5px` on the panel element. With these parameters the 4-corner fit to the measured homographies is within 0.7 px rms on every frame.
* Rotations before 199 measured as noise (|r| < 0.2°) and are set to 0.
* Before 185 the panel differs from the text layer only by an extra slide from the right: panel tx − text tx = 113, 83, 71, 61, 50, 43, 40, 33, 26, 19, 22, 19, 17, 16, 15, 14, 12, 11, 11, 10, 10, 10, 9, 10, 7, 7, 7, 6, 5, 5, 4, 3, 3, 2, 2, 1, 1, 1, 0 (frames 147→185). It decays like an expo-out: the first frames halve every ~3 frames, then a long tail.
* The text-layer columns at 147–157 carry about ±2 px of tracking noise. Smooth them if you like; true camera s = panel s for 147–198.
* α = opacity of white text (the dim state is 0.10). The panel TL/BL columns give the screen positions of the panel's top-left and bottom-left rim corners, as a check.

| f | cam s | text tx | text ty | panel tx | panel ty | panel s | rotX° | rotY° | rotZ° | panel TL screen | panel BL screen | α Drag | α Drop | α Done | bg (top-left) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 147 | 0.9504 | 90.3 | 39.5 | 203.0 | 41.3 | 0.9482 | 0 | 0 | 0 | (855, 133) | (855, 1093) | 0.80 | 0 | 0 | #0B0B15 |
| 148 | 0.9492 | 97.5 | 38.8 | 180.8 | 41.2 | 0.9483 | 0 | 0 | 0 | (833, 133) | (833, 1093) | 0.79 | 0 | 0 | #0B0B15 |
| 149 | 0.9465 | 97.2 | 38.7 | 168.0 | 40.9 | 0.9483 | 0 | 0 | 0 | (820, 133) | (820, 1093) | 0.80 | 0.08 | 0 | #0B0B15 |
| 150 | 0.9460 | 96.7 | 38.6 | 157.6 | 40.7 | 0.9485 | 0 | 0 | 0 | (810, 133) | (810, 1093) | 0.80 | 0.08 | 0 | #0B0B15 |
| 151 | 0.9501 | 98.7 | 39.2 | 148.5 | 40.6 | 0.9487 | 0 | 0 | 0 | (801, 132) | (801, 1093) | 0.81 | 0.08 | 0.08 | #0B0B15 |
| 152 | 0.9507 | 97.3 | 39.0 | 140.4 | 40.2 | 0.9488 | 0 | 0 | 0 | (792, 132) | (792, 1092) | 0.82 | 0.08 | 0.08 | #0B0B15 |
| 153 | 0.9462 | 92.5 | 38.7 | 133.0 | 39.8 | 0.9491 | 0 | 0 | 0 | (785, 131) | (785, 1092) | 0.84 | 0.08 | 0.08 | #0D0B18 |
| 154 | 0.9504 | 93.1 | 38.1 | 125.8 | 39.5 | 0.9494 | 0 | 0 | 0 | (778, 131) | (778, 1092) | 0.86 | 0.09 | 0.08 | #0E0C19 |
| 155 | 0.9536 | 93.1 | 32.8 | 119.3 | 39.1 | 0.9499 | 0 | 0 | 0 | (771, 130) | (771, 1092) | 0.88 | 0.08 | 0.09 | #0E0C19 |
| 156 | 0.9604 | 93.8 | 37.8 | 113.3 | 38.6 | 0.9504 | 0 | 0 | 0 | (765, 129) | (765, 1092) | 0.90 | 0.09 | 0.09 | #0E0C19 |
| 157 | 0.9509 | 84.9 | 34.1 | 107.3 | 38.0 | 0.9511 | 0 | 0 | 0 | (759, 129) | (759, 1092) | 0.92 | 0.09 | 0.09 | #0F0D1A |
| 158 | 0.9531 | 82.3 | 34.7 | 101.7 | 37.3 | 0.9519 | 0 | 0 | 0 | (753, 128) | (753, 1091) | 0.93 | 0.10 | 0.09 | #100E1B |
| 159 | 0.9537 | 78.8 | 34.5 | 96.2 | 36.6 | 0.9526 | 0 | 0 | 0 | (747, 127) | (747, 1091) | 0.96 | 0.10 | 0.10 | #100E1B |
| 160 | 0.9534 | 74.5 | 33.9 | 91.0 | 35.8 | 0.9538 | 0 | 0 | 0 | (741, 125) | (742, 1091) | 0.96 | 0.10 | 0.10 | #100E1B |
| 161 | 0.9551 | 71.2 | 33.4 | 85.9 | 34.7 | 0.9550 | 0 | 0 | 0 | (736, 123) | (736, 1090) | 0.97 | 0.10 | 0.10 | #110E1C |
| 162 | 0.9554 | 67.0 | 32.4 | 80.8 | 33.6 | 0.9565 | 0 | 0 | 0 | (730, 122) | (730, 1090) | 0.97 | 0.10 | 0.09 | #110E1C |
| 163 | 0.9577 | 63.6 | 31.4 | 75.8 | 32.3 | 0.9582 | 0 | 0 | 0 | (725, 119) | (725, 1090) | 0.98 | 0.10 | 0.10 | #110E1C |
| 164 | 0.9600 | 59.5 | 30.0 | 70.9 | 30.6 | 0.9603 | 0 | 0 | 0 | (719, 117) | (719, 1089) | 0.98 | 0.10 | 0.10 | #110E1C |
| 165 | 0.9623 | 55.0 | 28.8 | 65.9 | 28.7 | 0.9628 | 0 | 0 | 0 | (713, 114) | (713, 1089) | 0.99 | 0.10 | 0.10 | #120E1D |
| 166 | 0.9658 | 50.6 | 27.1 | 60.8 | 26.4 | 0.9658 | 0 | 0 | 0 | (707, 110) | (707, 1088) | 0.99 | 0.10 | 0.10 | #120E1D |
| 167 | 0.9697 | 45.3 | 24.8 | 55.4 | 23.6 | 0.9695 | 0 | 0 | 0 | (701, 106) | (701, 1087) | 1.00 | 0.10 | 0.10 | #120E1D |
| 168 | 0.9725 | 39.4 | 20.4 | 49.9 | 20.3 | 0.9738 | 0 | 0 | 0 | (694, 100) | (694, 1086) | 0.53 | 0.33 | 0.11 | #120E1D |
| 169 | 0.9805 | 35.5 | 18.3 | 44.2 | 16.7 | 0.9785 | 0 | 0 | 0 | (687, 94) | (687, 1085) | 0.10 | 0.79 | 0.11 | #120E1D |
| 170 | 0.9834 | 29.2 | 15.1 | 38.7 | 13.3 | 0.9831 | 0 | 0 | 0 | (680, 89) | (680, 1084) | 0.10 | 1.00 | 0.10 | #120E1D |
| 171 | 0.9895 | 27.1 | 11.0 | 33.7 | 10.2 | 0.9871 | 0 | 0 | 0 | (673, 84) | (673, 1083) | 0.10 | 1.00 | 0.10 | #120E1D |
| 172 | 0.9915 | 22.4 | 8.2 | 29.4 | 7.8 | 0.9903 | 0 | 0 | 0 | (668, 80) | (668, 1083) | 0.10 | 1.00 | 0.11 | #120E1D |
| 173 | 0.9930 | 18.8 | 5.8 | 25.5 | 5.9 | 0.9928 | 0 | 0 | 0 | (663, 77) | (663, 1082) | 0.10 | 1.00 | 0.11 | #120E1D |
| 174 | 0.9951 | 16.0 | 4.2 | 21.9 | 4.4 | 0.9948 | 0 | 0 | 0 | (659, 74) | (659, 1082) | 0.10 | 1.00 | 0.10 | #120E1D |
| 175 | 0.9964 | 13.3 | 3.2 | 18.8 | 3.3 | 0.9963 | 0 | 0 | 0 | (655, 73) | (655, 1081) | 0.10 | 1.00 | 0.11 | #120E1D |
| 176 | 0.9974 | 11.2 | 2.1 | 16.0 | 2.4 | 0.9975 | 0 | 0 | 0 | (652, 71) | (652, 1081) | 0.10 | 1.00 | 0.11 | #120E1D |
| 177 | 0.9984 | 9.7 | 1.6 | 13.5 | 1.6 | 0.9984 | 0 | 0 | 0 | (649, 70) | (650, 1081) | 0.10 | 1.00 | 0.10 | #120E1D |
| 178 | 0.9993 | 8.2 | 1.1 | 11.2 | 1.1 | 0.9991 | 0 | 0 | 0 | (647, 69) | (647, 1081) | 0.10 | 1.00 | 0.10 | #120E1D |
| 179 | 0.9996 | 6.5 | 0.4 | 9.0 | 0.6 | 0.9997 | 0 | 0 | 0 | (645, 68) | (645, 1080) | 0.10 | 1.00 | 0.10 | #120E1D |
| 180 | 0.9998 | 4.8 | 0.1 | 7.2 | 0.3 | 1.0000 | 0 | 0 | 0 | (643, 68) | (643, 1080) | 0.10 | 1.00 | 0.10 | #120E1D |
| 181 | 1.0002 | 3.6 | -0.1 | 5.4 | 0.1 | 1.0002 | 0 | 0 | 0 | (641, 67) | (641, 1080) | 0.10 | 1.00 | 0.10 | #120E1D |
| 182 | 1.0005 | 3.0 | 0.0 | 3.8 | 0.0 | 1.0005 | 0 | 0 | 0 | (639, 67) | (639, 1080) | 0.10 | 1.00 | 0.10 | #120E1D |
| 183 | 1.0000 | 1.5 | 0.0 | 2.5 | -0.0 | 1.0005 | 0 | 0 | 0 | (638, 67) | (638, 1080) | 0.10 | 1.00 | 0.10 | #120E1D |
| 184 | 0.9998 | 0.6 | -0.1 | 1.2 | -0.0 | 1.0003 | 0 | 0 | 0 | (637, 67) | (637, 1080) | 0.10 | 1.00 | 0.10 | #120E1D |
| 185 | 1.0000 | 0.0 | 0.0 | -0.0 | -0.0 | 1.0000 | 0 | 0 | 0 | (636, 68) | (636, 1080) | 0.10 | 1.00 | 0.10 | #120E1D |
| 186 | 0.9984 | -1.9 | -0.0 | -1.1 | 0.1 | 0.9995 | 0 | 0 | 0 | (635, 68) | (635, 1080) | 0.10 | 1.00 | 0.10 | #120E1D |
| 187 | 0.9983 | -2.1 | 0.1 | -2.0 | 0.2 | 0.9988 | 0 | 0 | 0 | (634, 68) | (634, 1080) | 0.10 | 1.00 | 0.10 | #120E1D |
| 188 | 0.9980 | -2.2 | 0.3 | -3.0 | 0.5 | 0.9977 | 0 | 0 | 0 | (633, 69) | (633, 1079) | 0.10 | 1.00 | 0.10 | #120E1D |
| 189 | 0.9962 | -3.2 | 0.6 | -3.8 | 0.7 | 0.9963 | 0 | 0 | 0 | (633, 70) | (633, 1079) | 0.10 | 1.00 | 0.10 | #120E1D |
| 190 | 0.9940 | -4.4 | 1.1 | -4.5 | 1.0 | 0.9944 | 0 | 0 | 0 | (633, 71) | (633, 1078) | 0.10 | 1.00 | 0.10 | #120E1D |
| 191 | 0.9926 | -4.6 | 1.6 | -5.2 | 1.4 | 0.9921 | 0 | 0 | 0 | (633, 73) | (633, 1077) | 0.10 | 1.00 | 0.10 | #120E1D |
| 192 | 0.9892 | -5.6 | 1.9 | -5.8 | 2.0 | 0.9893 | 0 | 0 | 0 | (633, 74) | (633, 1076) | 0.10 | 1.00 | 0.10 | #120E1D |
| 193 | 0.9859 | -6.1 | 2.9 | -6.6 | 2.6 | 0.9857 | 0 | 0 | 0 | (634, 77) | (634, 1075) | 0.10 | 1.00 | 0.10 | #120E1D |
| 194 | 0.9817 | -6.5 | 3.6 | -7.3 | 3.4 | 0.9814 | 0 | 0 | 0 | (634, 80) | (634, 1073) | 0.10 | 1.00 | 0.10 | #120E1D |
| 195 | 0.9758 | -7.6 | 4.4 | -7.9 | 4.4 | 0.9759 | 0 | 0 | 0 | (636, 83) | (635, 1071) | 0.10 | 1.00 | 0.10 | #120E1D |
| 196 | 0.9690 | -8.2 | 5.8 | -8.5 | 5.7 | 0.9688 | 0 | 0 | 0 | (637, 88) | (637, 1069) | 0.10 | 1.00 | 0.10 | #120E1D |
| 197 | 0.9599 | -8.8 | 7.3 | -9.1 | 7.3 | 0.9600 | 0 | 0 | 0 | (639, 94) | (639, 1066) | 0.10 | 1.00 | 0.10 | #120E1D |
| 198 | 0.9488 | -8.9 | 9.7 | -9.8 | 9.5 | 0.9482 | 0 | 0 | 0 | (643, 101) | (643, 1062) | 0.10 | 0.81 | 0.10 | #120E1D |
| 199 | 0.9330 | -9.6 | 12.8 | -9.5 | 10.0 | 0.9295 | 0.38 | -0.71 | 0.23 | (651, 110) | (647, 1051) | 0.10 | 0.34 | 0.34 | #120E1D |
| 200 | 0.9112 | -11.2 | 16.3 | -7.9 | 9.2 | 0.9032 | 1.27 | -2.38 | 0.74 | (667, 122) | (653, 1033) | 0.10 | 0.10 | 0.80 | #120E1D |
| 201 | 0.8892 | -11.7 | 20.7 | -5.8 | 9.3 | 0.8759 | 2.25 | -4.11 | 1.27 | (683, 135) | (661, 1016) | 0.10 | 0.10 | 1.00 | #120E1D |
| 202 | 0.8701 | -12.3 | 23.8 | -4.3 | 10.3 | 0.8539 | 2.79 | -5.36 | 1.64 | (695, 146) | (667, 1004) | 0.10 | 0.10 | 1.00 | #120E1D |
| 203 | 0.8556 | -13.4 | 26.1 | -3.2 | 11.3 | 0.8378 | 3.31 | -6.28 | 1.92 | (704, 155) | (672, 995) | 0.10 | 0.11 | 1.00 | #120E1D |
| 204 | 0.8451 | -13.9 | 28.1 | -2.4 | 12.3 | 0.8257 | 3.64 | -7.12 | 2.14 | (711, 162) | (676, 988) | 0.10 | 0.11 | 1.00 | #120E1D |
| 205 | 0.8370 | -14.0 | 29.7 | -1.7 | 12.8 | 0.8165 | 4.10 | -7.54 | 2.33 | (716, 167) | (679, 983) | 0.10 | 0.11 | 1.00 | #120E1D |
| 206 | 0.8313 | -13.6 | 30.8 | -1.1 | 13.6 | 0.8092 | 4.40 | -8.08 | 2.47 | (720, 171) | (681, 979) | 0.10 | 0.11 | 1.00 | #120E1D |
| 207 | 0.8246 | -14.7 | 31.6 | -0.8 | 14.1 | 0.8029 | 4.49 | -8.38 | 2.59 | (723, 175) | (683, 976) | 0.10 | 0.11 | 1.00 | #120E1D |
| 208 | 0.8200 | -14.9 | 32.0 | -0.5 | 14.5 | 0.7982 | 4.87 | -8.72 | 2.72 | (726, 178) | (684, 974) | 0.10 | 0.11 | 1.00 | #120E1D |
| 209 | 0.8161 | -15.2 | 33.0 | -0.1 | 14.7 | 0.7935 | 4.87 | -8.95 | 2.78 | (729, 180) | (686, 971) | 0.10 | 0.11 | 1.00 | #120E1D |
| 210 | 0.8122 | -15.5 | 33.7 | 0.1 | 15.0 | 0.7894 | 5.04 | -9.13 | 2.86 | (731, 182) | (687, 969) | 0.10 | 0.11 | 1.00 | #120E1D |
| 211 | 0.8098 | -15.0 | 34.0 | 0.4 | 15.2 | 0.7859 | 5.11 | -9.31 | 2.91 | (733, 184) | (689, 967) | 0.10 | 0.11 | 1.00 | #120E1D |
| 212 | 0.8065 | -15.1 | 34.2 | 0.6 | 15.4 | 0.7824 | 5.23 | -9.41 | 2.96 | (734, 186) | (690, 965) | 0.10 | 0.11 | 1.00 | #120E1D |
| 213 | 0.8030 | -15.2 | 34.5 | 0.8 | 15.5 | 0.7788 | 5.31 | -9.55 | 3.00 | (736, 188) | (691, 963) | 0.10 | 0.11 | 1.00 | #120E1D |
| 214 | 0.7983 | -15.3 | 34.4 | 1.0 | 15.6 | 0.7750 | 5.35 | -9.70 | 3.03 | (737, 190) | (693, 961) | 0.10 | 0.11 | 1.00 | #120E1D |
| 215 | 0.7938 | -15.7 | 34.5 | 1.2 | 15.5 | 0.7704 | 5.46 | -9.75 | 3.07 | (739, 192) | (694, 958) | 0.10 | 0.11 | 1.00 | #120E1D |
| 216 | 0.7880 | -15.2 | 34.3 | 1.4 | 15.5 | 0.7647 | 5.44 | -9.79 | 3.08 | (741, 195) | (696, 955) | 0.10 | 0.11 | 1.00 | #120E1D |
| 217 | 0.7798 | -14.8 | 34.2 | 1.7 | 15.4 | 0.7567 | 5.50 | -9.89 | 3.10 | (744, 199) | (700, 951) | 0.10 | 0.11 | 1.00 | #120E1D |
| 218 | 0.7640 | -14.8 | 33.6 | 2.2 | 15.2 | 0.7426 | 5.48 | -10.04 | 3.11 | (749, 205) | (705, 943) | 0.10 | 0.11 | 1.00 | #120E1D |

**Easing identified from the table**
* Camera zoom-in, frames 152→185, s 0.9488→1.0005 (hold 147–152): **cubic-bezier(0.69, 0.11, 0.34, 1.09)** (rms 0.002). An ease-in-out with a tiny overshoot to 1.0005 at 182–183. Panel top edge y: 133 (≤152) → 67.5 (185).
* Camera zoom-out, 185→218: s 1.000 → 0.9482 (198) → 0.8759 (201) → 0.8165 (205) → 0.7894 (210) → 0.7647 (216) → 0.7426 (218). This is an ease-in (cubic-bezier(0.28, 0.02, 0.82, 0.12) on 185–199), a fast stretch at 199–202 (≈ −0.027 per frame), an ease-out to about 0.77, then a second acceleration at 216–218 that leads into the cut.
* Panel 3D tilt, 199→215: rotY 0 → −9.75°, rotX 0 → +5.46°, rotZ 0 → +3.07°, all on the same curve **cubic-bezier(0.20, 0.15, 0.04, 0.90)**, a strong ease-out: half of the tilt is reached by about frame 202. Values at 218: rotX 5.48°, rotY −10.04°, rotZ 3.11°. The left side of the panel comes toward the viewer, the right side recedes, and the bottom edge comes forward.

### 2.3 Text column "Drag." / "Drop." / "Done"
* **Font**: DM Sans (Google). It was confirmed by rendering and comparing glyph masks (IoU 0.98 for "Drag.").
  * "Drag." = **DM Sans 800** (ExtraBold), tracking 0.
  * "Drop." and "Done" = **DM Sans ≈450** (between Regular and Medium; 400 also passes), tracking −0.015 em.
  * The weights belong to the words, not to the active state: "Drag." stays 800 when dim and "Drop." stays light when bright.
* **Size at camera s=1 (frame 185)**: font-size **168 px**, cap height (the D stem) **118.5 px**.
* **World positions** (screen positions at frame 185; left ink edge of the "D" at **x = 70.5** for all three lines; line pitch **183.75 px**):
  * "Drag." cap-top 147, baseline 264. Ink box x 70.5–478.5, y 147–301.5 (with the g descender).
  * "Drop." cap-top 331.5, baseline 448.5. Ink box 70.5–460.5 × 331.5–484.5.
  * "Done" cap-top 514.5, baseline 631.5. Ink box 72–456 × 514.5–633.
  * Measured glyph runs for "Drag." at 185 (D, r, a, g, .): x 70–168, 187–241, 255–333, 352–435, 453–478.
* **Colour**: active `#FFFFFF`; inactive = white at **0.10 opacity** (reads as `#2C2839` on the bg). No glow, no shadow, crisp edges (1–2 px antialias).
* **Entrances** (screen offsets on top of the layer transform):
  * "Drag." at 147 is 7 px left and about 1.2 % larger than its rest pose, and settles by 148 (x 205→213, width 390→386).
  * "Drop." pops in at **149** (opacity 0.08 → 0.10 by 151) and slides in from −15 px (149) → −3 px (150) → 0 (151).
  * "Done" pops in at **151** (0.08 → 0.10) with the same slide: −12 (151) → −2 (152) → 0 (153).
* **"Drag." brighten**: at 147 the fill is a left→right gradient. Opacity is 0.67 at the left end and 0.85 at the right end (sampled `#B1B1B5`→`#DBDBDF`). It ramps to solid white: mean opacity 0.80 (147–150), 0.82 (152), 0.86 (154), 0.90 (156), 0.93 (158), 0.96 (160), 0.98 (163), 1.00 (167). This is an ease-out over 150→167, and the left side catches up fastest.
* **Active-word handover** (crossfades of exactly 3 frames, with no movement):
  * Drag→Drop: 167 (1.00 / 0.10) → **168 (0.53 / 0.33)** → **169 (0.10 / 0.79)** → 170 (0.10 / 1.00).
  * Drop→Done: 197 (1.00 / 0.10) → **198 (0.81 / 0.10)** → **199 (0.34 / 0.34)** → **200 (0.10 / 0.80)** → 201 (0.10 / 1.00).

### 2.4 UI panel (world geometry at frame 185, camera s = 1)
* **Outer box**: left rim at **x = 635.6**, top rim at **y = 67.5**. It extends past the right and bottom of the frame at every frame (its world size is at least 1590 × 1160; build it about 1700 × 1250). Top-left corner radius about 21 px.
* **Rim**: a 3–4 px stroke around the box. Core `#B9B5D8` when idle, `#D7D3F5` while the travelling light passes.
* **Travelling rim light**: a long bright dash (about 63 % of the perimeter) circles the border **clockwise**, up the left edge then along the top edge. The leading and trailing ends move about **230 px per frame** (world), so one lap takes **about 27 frames**. While lit, the stroke gets an outer and inner bloom: +53 levels at 4 px, +37 at 8 px, +27 at 12 px, +19 at 20 px, +12 at 32 px, about 0 by 45 px. Bloom colour about `rgba(185,175,255,0.35)` (`#474464` 4 px outside, `#2D2A45` at 12 px, `#1A182B` at 40 px). Measured on/off timing at points along the edge (world coordinates):
  * Lit at the shot start (147).
  * **Trailing end passes**: left edge bottom→top during 155–159, then the top edge left→right during 159–164.
  * **Leading end returns**: left edge bottom→top during 164–168, then the top edge 168–174.
  * Trailing end again: left 181–186, top 186–190.
  * Leading end again: left 191–195, top 195–200.
  * Trailing end again: left 209–213, top 212–217.
  * In other words, the left edge is lit 147–157, 165–184, 192–211, and the top edge is lit 147–161, 169–188, 196–215.
* **Sidebar** (dark): x 635.6–960, fill `#0A0D16`.
  * Logo (mark + "NeuralSeek" wordmark, white) in box (660, 90)–(882, 129).
  * Label "Pages" at (677, 180), colour `#464852`, about 15 px font.
  * 17 rows, pitch **53.7 px**. Text centre y = 234 + 53.7·(i−1) for rows i=1…17; row 17 sits below the frame at s=1 and becomes visible once the camera zooms out (199+).
  * Every label starts at x≈735. Rows 1, 2 and 10–17 are top-level and also have a 20 px outline icon at x≈699 and a faint chevron at x≈680. Rows 3–9 are sub-items with no icon.
  * Labels (white `#ABABB1`, Inter-like 500, about 19.5 px): Weight Tuning, Get Data, Text, KB Documentation, Seek, Documents, Rest, Webpage Data, Webpage Links, Upload Data, Generate Data, Local Cache, Extract Data, Multi-Agent, Control Flow, RAG Tools, GuardRails.
* **Content area**: x ≥ 960.
  * **Top nav bar**: y 67.5–159, `#FBFBFD`. Items at text y 108–125, starting x 1011, Inter 400 about 20 px, colour `#3A3A3A`: Home, Configure, Integrate, Extract, Load, mAIstro, Seek, Chat, Curate, Governance.
  * **Tab bar**: y 160–219, `#FEFEFE`. "Agent Editor ✎ | Agent NTL ⊡ | Agent Registry ⊞ | Agent Scheduler ▤", text y 185–205 from x 1021, Inter 500 about 20 px. Active underline under "Agent Editor": x 1011–1175, y 217, 2 px, blue `#3B5BDB`.
  * **Canvas**: `#F5F4F9`.
  * **Nodes**: white `#FCFCFC` cards, **358 × 126**, radius about 9, 1 px `#EDEDF0` border, soft 0 4 px 14 px rgba(0,0,0,0.05) shadow. Inside each: icon (18 px) + title (Inter 600, about 19 px, `#2A2A2B`) at y+29, a gear icon at the right (x+325), a hairline divider at y+52, and a subtitle (Inter 400, about 17 px, `#BBBBBB`) at y+86.
    * A (1012, 255) "Google Drive - Read" / "Read from Google Drive".
    * B (1440, 253) "Send To LLM" / "Based on the RAG analysis insight…".
    * C (1868, 255) "MySQL" / "Run a query against MySQL", partly off-frame.
    * D (1012, 450) "Snowflake" / "Run a query against Snowflake".
    * E (1440, 450) "Send To LLM" / "Based on the RAG analysis insight…".
    * F (1868, 450) "Email" / "Send an Email".
    * **G (new node, from 198)** (1012, 645) "Post a Message" (Slack icon) / "Send a message".
  * **Connectors**: blue `#2B59D9` arrows. "→" between columns at x 1410–1425 and y 318 (row 1) / 513 (row 2), and the same between columns 2 and 3 at x 1837–1845. "↓" A→D at x 1191, y 420–428.
  * **New "↓" D→G**: draws downwards 199→204. It is a dot at 199, about 1/3 length at 200, 2/3 at 201–202 and full (≈ 27 px, y 600–627) at 203–204.

### 2.5 Cursor (3D arrow), screen-space path (MEASURED)
* **Look**: an extruded 3D "navigation arrow" (➤ shape with a notch: tip, two wings, and a concave notch opposite the tip).
  * Glossy black-navy body (`#1A1A1A` on white, picking up `#292847` from the purple card).
  * Thickness about 9–12 px, visible when it banks.
  * Bevelled edges with a **white specular rim**. On the dark background this rim blooms (white line plus about 12 px white/lavender glow); on the white canvas it is subtle.
  * Size: tip-to-wing about 150 px, wing span about 140 px.
  * It **rotates in 3D** to face its direction of travel and banks through turns. At 209–211 it flips through edge-on (a thin sliver) to end up pointing left.
* **No motion blur**, even on the 300 px/frame jump at 197→198.
* **Payload** (147–168): the 4-colour Slack logo, about 55 px, with a soft colour glow of about 6 px, glued at the tip. It counter-rotates in 3D while flying; its colour centroid sits within about 6 px of the tip. Release at **168**: the logo stays at (≈1083, 690) and the cursor tip backs off up-left.
* **Path**: tip and wing vertices per frame are in the table below. The heading is the angle from the wing midpoint to the tip (0° = pointing right, +90° = pointing down).
  * **Entry 147→167**: expo-out with a half-life of **2.8 frames**. Tip x velocity 122, 81, 72, 50, 39, 35, 21, 21, 15, 20, 12, 12, 8, 9, 5 px/frame.
  * **Hover 164–187**: the tip drifts about 2 px per frame.
  * **Loop 194–201**: one fast clockwise circle around the canvas centre. Radius about 330 px, from (1296,656) up to (1347,536) and (1325,347), across the top (1163,176), down the left over the sidebar (683,248) and (657,605), back right (926,716) and (1179,797), up through (1281,686).
  * Then the cursor climbs up and left: (1304,567) on 203 → (1290,473) on 204 → (1272,341) on 205 → (1161,231) on 208, flips edge-on 209–211, reaches (1017,165) on 212, and settles at the panel's top-left corner, about (899,212) on 218, pointing left. Speed 202→208 is about 50 → 35 px/frame (ease-out); 212→218 is about 20 → 6 px/frame.

**Cursor per frame** (screen space; tip = arrow point = hotspot; wings = the two back corners):

| f | tip (x,y) | wing A | wing B | heading° | size (tip→wing-mid) | note |
|---|---|---|---|---|---|---|
| 147 | (562, 840) | (506, 702) | (410, 807) | 39 | 135 | shot starts; payload (Slack logo) glued to tip |
| 148 | (684, 852) | (610, 717) | (519, 822) | 35 | 145 |  |
| 149 | (765, 840) | (678, 720) | (606, 840) | 26 | 137 |  |
| 150 | (837, 824) | (724, 722) | (680, 854) | 15 | 140 |  |
| 151 | (886, 812) | (759, 726) | (744, 856) | 9 | 137 |  |
| 152 | (926, 801) | (795, 722) | (788, 861) | 4 | 135 |  |
| 153 | (960, 786) | (818, 723) | (837, 858) | -2 | 133 |  |
| 154 | (981, 764) | (846, 720) | (864, 861) | -12 | 129 |  |
| 155 | (1002, 758) | (866, 720) | (892, 850) | -13 | 126 |  |
| 156 | (1017, 747) | (878, 716) | (915, 855) | -18 | 127 |  |
| 157 | (1036, 744) | (879, 712) | (921, 855) | -16 | 142 |  |
| 158 | (1048, 735) | (910, 710) | (952, 855) | -22 | 126 |  |
| 159 | (1060, 728) | (912, 712) | (964, 844) | -23 | 132 |  |
| 160 | (1068, 718) | (922, 710) | (982, 834) | -25 | 127 |  |
| 161 | (1077, 712) | (927, 711) | (1006, 834) | -29 | 126 | arrives over canvas, hovering |
| 162 | (1082, 705) | (933, 708) | (1008, 826) | -29 | 127 |  |
| 163 | (1082, 699) | (939, 702) | (999, 830) | -31 | 131 |  |
| 164 | (1082, 694) | (938, 700) | (1012, 820) | -32 | 125 |  |
| 165 | (1082, 693) | (939, 698) | (1011, 820) | -32 | 125 |  |
| 166 | (1080, 692) | (933, 698) | (1008, 816) | -31 | 127 |  |
| 167 | (1078, 688) | (930, 698) | (1010, 816) | -32 | 128 |  |
| 168 | (1077, 694) | (927, 690) | (1005, 818) | -28 | 126 | release: payload detaches |
| 169 | (1074, 690) | (924, 690) | (992, 818) | -29 | 133 |  |
| 170 | (1064, 696) | (918, 686) | (993, 813) | -26 | 120 | card spawns at payload |
| 171 | (1053, 699) | (915, 686) | (990, 813) | -27 | 112 |  |
| 172 | (1038, 702) | (903, 687) | (975, 819) | -27 | 111 |  |
| 173 | (1029, 705) | (909, 699) | (984, 819) | -33 | 99 |  |
| 174 | (1026, 708) | (888, 704) | (966, 826) | -30 | 114 |  |
| 175 | (1029, 711) | (890, 711) | (954, 834) | -30 | 124 |  |
| 176 | (1022, 722) | (873, 730) | (952, 850) | -32 | 129 |  |
| 177 | (1014, 730) | (864, 738) | (939, 858) | -31 | 131 |  |
| 178 | (1002, 742) | (858, 753) | (940, 858) | -32 | 121 |  |
| 179 | (994, 750) | (852, 760) | (927, 866) | -31 | 122 |  |
| 180 | (984, 759) | (834, 796) | (938, 909) | -44 | 136 |  |
| 181 | (984, 759) | (825, 806) | (944, 918) | -46 | 143 |  |
| 182 | (976, 756) | (826, 816) | (948, 928) | -52 | 147 |  |
| 183 | (968, 753) | (834, 825) | (938, 918) | -55 | 144 |  |
| 184 | (956, 750) | (843, 834) | (928, 909) | -60 | 140 |  |
| 185 | (966, 750) | (840, 828) | (924, 909) | -55 | 145 |  |
| 186 | (974, 759) | (855, 834) | (939, 918) | -57 | 140 |  |
| 187 | (982, 759) | (850, 828) | (930, 909) | -50 | 143 |  |
| 188 | (1008, 759) | (862, 828) | (940, 928) | -48 | 160 |  |
| 189 | (1041, 759) | (939, 798) | (998, 903) | -52 | 117 | cursor leaves card |
| 190 | (1083, 756) | (966, 810) | (1028, 914) | -51 | 136 |  |
| 191 | (1128, 762) | (1016, 806) | (1064, 926) | -49 | 136 |  |
| 192 | (1179, 756) | (1066, 790) | (1125, 910) | -49 | 126 |  |
| 193 | (1238, 722) | (1116, 765) | (1208, 878) | -53 | 125 |  |
| 194 | (1296, 656) | (1170, 718) | (1300, 804) | -60 | 122 |  |
| 195 | (1347, 536) | (1242, 640) | (1394, 672) | -76 | 124 |  |
| 196 | (1324, 346) | (1344, 510) | (1448, 432) | -120 | 143 | fast loop (whip) starts |
| 197 | (1162, 176) | (1323, 226) | (1280, 98) | 174 | 139 |  |
| 198 | (682, 248) | (596, 370) | (705, 352) | -74 | 118 | over sidebar |
| 199 | (657, 604) | (738, 690) | (705, 705) | -125 | 113 |  |
| 200 | (926, 716) | (956, 852) | (900, 840) | -91 | 131 |  |
| 201 | (1179, 796) | (1054, 764) | (1035, 834) | -1 | 134 | loop closes |
| 202 | (1281, 686) | (1170, 774) | (1148, 684) | -20 | 130 |  |
| 203 | (1304, 567) | (1266, 682) | (1166, 616) | -43 | 120 |  |
| 204 | (1290, 472) | (1216, 586) | (1280, 576) | -69 | 117 |  |
| 205 | (1272, 340) | (1256, 501) | (1299, 522) | -92 | 171 |  |
| 206 | (1238, 315) | (1228, 452) | (1329, 424) | -109 | 130 |  |
| 207 | (1203, 272) | (1214, 408) | (1308, 338) | -120 | 117 |  |
| 208 | (1161, 231) | (1204, 366) | (1268, 280) | -129 | 119 |  |
| 209 | (1140, 210) | (1227, 238) | (1188, 315) | -135 | 95 | 3D flip (turning edge-on) |
| 210 | (1089, 180) | (1186, 270) | (1186, 270) | -137 | 133 | edge-on sliver |
| 211 | (1053, 172) | (1158, 240) | (1158, 240) | -147 | 125 | edge-on sliver |
| 212 | (1017, 165) | (1137, 195) | (1107, 248) | -152 | 119 | now points left |
| 213 | (988, 165) | (1116, 172) | (1064, 255) | -154 | 112 |  |
| 214 | (960, 166) | (1088, 156) | (1062, 264) | -159 | 123 |  |
| 215 | (939, 174) | (1066, 156) | (1044, 264) | -163 | 122 |  |
| 216 | (918, 178) | (1050, 152) | (1008, 264) | -165 | 115 |  |
| 217 | (904, 189) | (1040, 156) | (1010, 264) | -170 | 122 |  |
| 218 | (898, 212) | (1023, 164) | (1004, 264) | -179 | 115 | hovering panel top-left corner |

### 2.6 The drop: purple card (169–197) → node G (198+)
* **169**: a faint, blurred lavender shadow blob shows up below-right of the payload; this is the card's shadow arriving first.
* **170**: the card rect appears **behind the payload**. Screen box (1034, 644), 168 × 99. Its top-left anchors at the payload.
* **Grow, 170→187**: the card's **size animates, not its scale**. The text stays at final size and is revealed by the growing rounded rect. The top-left drifts from (1034,644) to (946,573). Width: 168, 280, 378, 462, 528, 584, 628, 668, 699, 726, 747, 767, 783, 797, 809, 821, 827, 830. Height: 99, 150, 189, 219, 242, 258, 273, 284, 292, 298, 305, 309, 312, 315, 318, 320, 321, 321. This is an **expo-out**: the remaining size shrinks by ×0.82 per frame, a half-life of about 3.5 frames, done by 187.
* **Rest box (187)**: (946.5, 573) 830 × 321.
  * Radius **22 px**. Fill **`#523CDE`**.
  * Shadow: a purple-tinted plateau below and to the right, about `box-shadow: 18px 51px 45px rgba(82,60,222,0.20)`. Measured: 0–55 px below the card the canvas reads `#D7D1F5` and fades back to `#F7F7F9` by about 80 px; a weaker band on the right side; none on top.
  * **Payload logo** (Slack, 60 px), centre at card +(97, 102).
    * From 172 to 185 it **spins clockwise** about 270–360° with an ease-out (its colour quadrants rotate through top-left, right, bottom and back to upright).
    * It pulses in size: 1.0 → 1.45× (176–178) → 1.0 (185).
  * **Title** "Post a Message": Inter 600, 41 px (cap 30 px), `#F4F0FF`. Ink left at card +160.5, baseline at card +115.5.
  * **Divider**: 3 px, `#E2D7FF` (white about 85 %), from card +99 to +759, at y +165.
  * **Subtitle** "Send a message": Inter 400, 36 px (cap 26 px), `#CFC2FF` (white about 75 %). Left at +85.5, baseline at +229.5.
  * **Gear icon**: 45 px, white at 25 % (`#8B78FE`), centre at +(750, 102).
* **Content reveal** (offsets from the rest layout):
  * **Title**: opacity 0.25 (174), 0.40, 0.55, 0.70, 0.80, 0.90, 1.0 (180). x-offset +45 (174), +42, +33, +28, +24, +19, +14, +12, +9, +5 (183), 0 (186).
  * **Subtitle**: opacity 0.15 (177), 0.35, 0.50, 0.65, 0.80, 0.90, 1.0 (183). x-offset +48 (177), +44, +36, +30, +23, +17, +11, 0 (186).
  * **Divider**: draws outward from its centre x ≈ 1376. Half-width 43 (178), 115, 175, 250, 261, 276 (183), 330 (186).
  * **Gear**: opacity 0.3 (181) → 1.0 (184).
* **Shrink, 188→197**: now a **uniform scale** of the whole card and its content about the point **(1010, 711)**, the left-middle of where node G will sit. Width 830 → 830, 824, 812, 792, 765, 725, 666, 579, 465, 399 (197). Ease-in, about **cubic-bezier(0.78, 0.02, 0.65, 0.66)**.
* **198**: hard swap (one frame, no crossfade) to **node G**, the white node "Post a Message / Send a message" at its grid slot (§2.4), already in the panel's camera space.
* Card rects per frame (screen space; they include the camera and panel motion):

| f | card x | y | w | h (screen, 1080p) | content |
|---|---|---|---|---|---|
| 170 | 1034 | 644 | 168 | 99 | payload icon only |
| 171 | 1012 | 622 | 280 | 150 |  |
| 172 | 998 | 608 | 378 | 189 |  |
| 173 | 984 | 597 | 462 | 219 |  |
| 174 | 976 | 590 | 528 | 242 | title fades in (≈25%), 50 px right of rest |
| 175 | 970 | 585 | 584 | 258 |  |
| 176 | 966 | 580 | 628 | 273 |  |
| 177 | 962 | 578 | 668 | 284 | title 70%; subtitle fades in |
| 178 | 958 | 576 | 699 | 292 | divider starts drawing from centre |
| 179 | 956 | 574 | 726 | 298 |  |
| 180 | 954 | 574 | 747 | 304 |  |
| 181 | 952 | 573 | 766 | 309 | gear fades in |
| 182 | 951 | 573 | 783 | 312 |  |
| 183 | 950 | 573 | 796 | 315 |  |
| 184 | 948 | 573 | 808 | 318 | all content ≈ full |
| 185 | 946 | 573 | 820 | 320 |  |
| 186 | 946 | 573 | 826 | 321 |  |
| 187 | 946 | 573 | 830 | 321 |  |
| 188 | 945 | 574 | 830 | 320 | shrink starts (ease-in) |
| 189 | 945 | 576 | 824 | 316 |  |
| 190 | 946 | 579 | 812 | 310 |  |
| 191 | 948 | 582 | 792 | 303 |  |
| 192 | 950 | 586 | 765 | 292 |  |
| 193 | 952 | 592 | 724 | 278 |  |
| 194 | 957 | 603 | 666 | 255 |  |
| 195 | 962 | 616 | 579 | 220 |  |
| 196 | 972 | 634 | 465 | 177 |  |
| 197 | 980 | 645 | 399 | 152 | last purple frame |

---------------------------------------------------------------------------------------------------

## 3. SHOT B (219–286): pastel "Or……… just vibe it"

### 3.1 Background
* **Pastel mesh gradient**, fixed to the screen (it does not pan with the text). It stays the same in B1 and B2, with only slight lightening top-left in B3.
* **Exact colour grid** (1080p sample points, blurred 8 px). Rebuild it by drawing these 9×7 colours as an image and resizing it to 1920×1080 with bicubic smoothing (or with stacked radial gradients matched to these samples):

| y \ x | 15 | 240 | 480 | 720 | 960 | 1200 | 1440 | 1680 | 1905 |
|---|---|---|---|---|---|---|---|---|---|
| 15 | `#F1A3F2` | `#F2ACF4` | `#EEBFF3` | `#D9D0F3` | `#B6DFF1` | `#92E7F1` | `#78E5F2` | `#75E5F3` | `#85E8F4` |
| 180 | `#F3ADF3` | `#F2B3F3` | `#F0C4F3` | `#DFD4F5` | `#C1E3F4` | `#A2EAF1` | `#8EE8F2` | `#89E6F2` | `#97E9F4` |
| 360 | `#F3BAF4` | `#F4BDF3` | `#F3CDF5` | `#E8DDF3` | `#CDE8F3` | `#B1EAF4` | `#A1E4F2` | `#9EE2F1` | `#A8E7F2` |
| 540 | `#F0C2F3` | `#EFC5F4` | `#F2D1F4` | `#EEE2F4` | `#E6E8F4`* | `#BAE3F2` | `#ABDAF0` | `#A8D8F1` | `#B0DCF1` |
| 720 | `#E3BEF1` | `#E2C2F2` | `#E6CEF3` | `#E3DDF2` | `#D4E0F3` | `#BDD7F2` | `#AECEF1` | `#AACBF1` | `#B2D0F2` |
| 900 | `#CFB4F1` | `#CEB7F1` | `#D0C3F0` | `#CFCBF1` | `#C5CFF0` | `#B5C9F1` | `#A8C0EE` | `#A3BDF0` | `#ABC3F1` |
| 1065 | `#B6A4EC` | `#B7A7F0` | `#BBB0F0` | `#B9B9EF` | `#B3BDF0` | `#A7BAEF` | `#9AB2ED` | `#95AEED` | `#9EB5EF` |

  \* interpolated, because the text covers this sample. In words: magenta-pink top-left, aqua top-right, a near-white lavender centre, and periwinkle along the bottom. B3 (270–280) lightens the top-left to `#F8C3F7` / `#F5C0F2`.
* **Grain**: fine static monochrome noise, σ ≈ 1.1–1.3 levels (8-bit). Correlation between consecutive frames is 0.85, so it is effectively a **static** texture. Use `/img/grain.png` at about 5 % (overlay).
* **Light ring**: a soft white elliptical band behind the text, +30–40 % white at its crest, band width about 120 px, edges blurred about 30 px, brighter on its left/lower-left and right flanks (a lit glass ring). It changes no hue. Approximate ellipses (centre; rx × ry):
  * B1: 219–225 none. 226 starts faint. 228–230 fully visible: centre (1014, 450), 686 × 570.
    * 234: (983, 528), 596 × 507.
    * 240: (855, 548), 653 × 525.
    * 244: (693, 558), 648 × 525.
    * The centre trails the text pan at about 0.9× its speed.
  * B2: **245–251 no ring** (the whip-cut state). Fades in 252→256: (978, 533), 911 × 510.
  * B2/B3, centre and rx (ry ≈ 520 throughout): 260 (992, 522), rx ≈ 820; 266 (972, 540), rx ≈ 900; 272 (990, 540), rx ≈ 920; 278 (936, 540), rx ≈ 830. Fades out 280→286 as the pill covers it.

### 3.2 Type (all of B)
* **Font**: **DM Sans 700** (opsz 14). Rendered letter positions of "just vibe it" match the reference within 1–2 px. "Or" fits 700–800; use 700 for the whole line.
* **Size**: **157.5 px** (cap height 111 px; "O" with overshoot 114 px; x-height 78 px). Tracking 0. Colour **`#0C0C19`**. No glow or shadow (the "halo" in high-pass views is an artefact).
* **Vertical**: the line's centre stays at **y = 539** for every scale; at scale 1 the baseline is y 595.5 and the cap-top y 483.
* **Layout at scale 1**, relative to the O's left ink edge: "O" 0–108, "r" 126–177, **first "." centre at +193**.
* **Dot leader**: "." glyphs, about 22 px diameter, centre y 583, **pitch 40.35 px**.
* **"just vibe it"** ink spans at 265 (rest; centre ≈ 956): j 548–582, u 606–681, s 700–768, t 782–836, v 888–969, i 986–1005, b 1031–1115, e 1134–1212, i 1272–1290, t 1310–1365. The "j" ink starts 15.75 px right of the last dot centre.

### 3.3 B1 / B2 per-frame line track (MEASURED)
* **Scale** of the whole line about its O-left / centre-y anchor: **s = 1 + 0.39·0.86^(f−219)**, an expo-out zoom-settle with a half-life of about 4.6 frames (fits within ±0.01). It starts at 1.39 on the cut frame.
* **Pan**: the line holds at its centre (x ≈ 950) for 219–224, then accelerates left. O-left velocity (px/frame): +15, +7.5, +3, +3, +1.5, 0, −1.5, −3, −3, −6, −6, −7.5, −9, −10.5, −12, −15, −16.5, −18, −21, −24, −28.5, −34.5, −40.5, −51, −69 (219→244). This is an exponential ease-in of about ×1.17 per frame from 230.
* **Typing**: "Or" is already there at 219 with no typing. "." characters: 1 per frame from 221, about 1.5 per frame from 226.
* **Whip-cut at 245**: hard cut. The view jumps far along the leader; 8 dots are visible at the left edge (centres from x 9 to 292).
  * Typing is fast here: about 4–5 dots per frame for 245–247.
  * The pan continues, decelerating (px/frame): −42, −23, −16, −13.5, −12, −10.5, −9, −9, −7.5, −6, −7.5, −6, −4.5, −4.5, −6, −3, −4.5, −4.5, −3 (245→264), ≈ 42·0.8^(f−245) settling to a 3–4 px/frame creep.
* **Typing "just vibe it"**: 248 "j", 249 "just", 250 "just v", 251 "just vib", 252 "just vibe", 253 "just vibe i", 254 "just vibe it". That is 1–3 characters per frame, 1.7 on average. Each character pops in at full opacity, with no fade, scale or caret.
* **Dot erase, 262–265**: the dots vanish from the far-left end towards the "j", about 3–5 per frame with no fade. Leftmost surviving dot centre: 188 (262), 386 (263), 502 (264), none at 265. By 265 the line "just vibe it" is centred (548–1365).

**B1 per frame** (O-left = left ink edge of "O"; dots on the pitch 40.35·s starting at O-left + 193·s; centre y 539):

| f | line scale | "O" left edge x | rightmost dot centre x | dots typed | visible text / event |
|---|---|---|---|---|---|
| 219 | 1.390 | 828 | - | 0 | CUT IN. "Or" (no dot), centred on x≈950 |
| 220 | 1.300 | 843 | - | 0 |  |
| 221 | 1.240 | 850 | 1090 | 1 | first "." typed |
| 222 | 1.220 | 854 | 1138 | 2 |  |
| 223 | 1.190 | 856 | 1182 | 3 |  |
| 224 | 1.170 | 858 | 1178 | 3 |  |
| 225 | 1.150 | 858 | 1219 | 4 | line starts panning left (ease-in) |
| 226 | 1.130 | 856 | 1302 | 6 |  |
| 227 | 1.110 | 854 | 1336 | 7 |  |
| 228 | 1.100 | 850 | 1373 | 8 | ring fades in |
| 229 | 1.087 | 844 | 1449 | 10 |  |
| 230 | 1.078 | 838 | 1481 | 11 |  |
| 231 | 1.067 | 831 | 1553 | 13 |  |
| 232 | 1.058 | 822 | 1581 | 14 |  |
| 233 | 1.051 | 812 | 1650 | 16 |  |
| 234 | 1.043 | 800 | 1674 | 17 |  |
| 235 | 1.036 | 784 | 1695 | 18 |  |
| 236 | 1.030 | 768 | 1756 | 20 |  |
| 237 | 1.025 | 750 | 1775 | 21 |  |
| 238 | 1.020 | 729 | 1831 | 23 |  |
| 239 | 1.017 | 705 | 1845 | 24 |  |
| 240 | 1.013 | 676 | 1894 | 26 |  |
| 241 | 1.010 | 642 | 1896 | 27 |  |
| 242 | 1.006 | 602 | 1892 | 28 |  |
| 243 | 1.002 | 550 | 1916 | 30+ | head clipped by right frame edge |
| 244 | 1.000 | 482 | 1885 | 31+ | last frame before whip-cut |

**B2 per frame** (the "j" ink starts 15.75 px right of the last dot centre; dots on the pitch 40.35 px to the left):

| f | line scale | "j" left edge x | rightmost dot centre x | text | note |
|---|---|---|---|---|---|
| 245 | 1.000 | - | 292 | dots only | WHIP-CUT (hard cut, new background state, no ring); 8 dots visible x 9-292 |
| 246 | 1.000 | - | 409 | dots only | pan -42 px/frame (decelerating) |
| 247 | 1.000 | - | 590 | dots only | 4-5 dots typed per frame |
| 248 | 1.000 | 670 | 655 | …j |  |
| 249 | 1.000 | 657 | 641 | …just |  |
| 250 | 1.000 | 645 | 629 | …just v |  |
| 251 | 1.000 | 634 | 619 | …just vib |  |
| 252 | 1.000 | 626 | 610 | …just vibe | ring fades back in |
| 253 | 1.000 | 616 | 601 | …just vibe i |  |
| 254 | 1.000 | 609 | 593 | …just vibe it (sparkle seed appears 253) |  |
| 255 | 1.000 | 603 | 587 | …just vibe it |  |
| 256 | 1.000 | 596 | 580 | …just vibe it |  |
| 257 | 1.000 | 590 | 574 | …just vibe it |  |
| 258 | 1.000 | 585 | 569 | …just vibe it |  |
| 259 | 1.000 | 580 | 565 | …just vibe it |  |
| 260 | 1.000 | 574 | 559 | …just vibe it |  |
| 261 | 1.000 | 572 | 556 | …just vibe it |  |
| 262 | 1.000 | 567 | 551 | …just vibe it | dots erased left of x=168 |
| 263 | 1.000 | 562 | 547 | …just vibe it | dots erased left of x=366 |
| 264 | 1.000 | 560 | 544 | …just vibe it | dots erased left of x=482 |
| 265 | 1.000 | 548 | – | …just vibe it | all dots gone; line centred (j-left 548 … t-right 1365) |

### 3.4 Sparkles (253–286)
* Three **4-point concave stars** (✦, astroid shape): **S1 big, S2 small above it, S3 small to the right**.
  * Fill `#FFFFFF` with a soft glow (about 8–10 px blur, slightly warm/pink fringe). Drawn above the text.
  * Sizes are tip-to-tip.
  * They twinkle: about ±15 % scale pulses, plus a slight rotation.
* **Entrance**: a glow seed appears at **253**, pops to a star at **254**, and reaches full size by **256**. S3 appears at **256** and S2 at about **260**, each popping in over 2 frames.
* After 262 the cluster drifts up-right with the line (to 270), then back left and down as the line squeezes in B3.

| f | S1 centre / size | S2 centre / size | S3 centre / size |
|---|---|---|---|
| 253 | (1403, 468) glow dot r≈6 | – | – |
| 254 | (1416, 492) / 24 | – | – |
| 256 | (1422, 486) / 42 | – | (1443, 503) / 10 |
| 258 | (1416, 485) / 42 | – | (1449, 495) / 18 |
| 262 | (1400, 480) / 45 | (1427, 455) / 27 | (1440, 492) / 24 |
| 266 | (1419, 476) / 45 | (1458, 437) / 27 | (1476, 483) / 24 |
| 270 | (1436, 459) / 48 | (1485, 405) / 30 | (1512, 462) / 24 |
| 274 | (1418, 453) / 48 | (1470, 387) / 30 | (1499, 449) / 24 |
| 278 | (1391, 447) / 48 | (1440, 378) / 30 | (1472, 441) / 24 |
| 282 | (1353, 450) / 45 | (1401, 378) / 27 | (1431, 438) / 24 |
| 286 | (1290, 470) / 40 | (1319, 401) / 24 | (1344, 450) / 20 |

### 3.5 B3 (266–286): "vibe" 3D extruded wobble + squeeze
* **Starts at 266**, on the music hit. The flat line becomes **3D extruded sticker type**:
  * The **front glyphs** (`#0C0C19`) get a 2–3 px **white `#FFFFFF` outer stroke**.
  * A **back copy** (fill `#262B36`, also with a thin white edge) sits behind, offset down-right by (dx, dy) = (+4.5, +3) at 266, (+7.5, +3) at 270, (+9, +4.5) at 276 and (+12, +4.5) at 282. This reads as depth or extrusion.
* **Per-letter wobble**, ramping in from 266 to 286: each glyph gets its own rotateZ of ±4–8°, a y-offset of ±4–8 px, and a rotateY that narrows it. "just" squeezes to 0.65 of its width by 286, "vibe" stays at about 1.0, and "it" ends at 0.9. The pattern looks hand-placed: "j" leans left, "u" sits low, "s" and "t" tilt right, "it" stands tallest. The line also tilts so it rises to the right: about −1° (270), −2° (276), −3° (280–286).
* **Group squeeze** about x ≈ 975, y ≈ 555: scaleX 1.00 (265), 1.01 (270), 0.96 (274), 0.90 (278), 0.82 (282), 0.77 (284), 0.68 (286). scaleY 1.00 → 0.97 (274) → 0.94 (282) → 0.93 (286). This is an **ease-in**: slow at first, fastest 282–286 as it is pulled into the incoming pill.
* Measured per-word ink boxes (front copy + extrusion):

| f | "just" box (x0–x1 × y0–y1) | "vibe" box | "it" box | line x-span | width vs 265 |
|---|---|---|---|---|---|
| 265 | 548–836 × 482–630 | 888–1212 × 482–597 | 1269–1365 × 482–596 | 548–1365 | 1.00 |
| 268 | 544–831 × 484–638 | 876–1221 × 477–602 | 1275–1388 × 472–600 | 544–1388 | 1.03 |
| 271 | 561–834 × 490–644 | 874–1212 × 476–604 | 1264–1380 × 466–598 | 561–1380 | 1.00 |
| 274 | 580–838 × 495–648 | 874–1200 × 476–606 | 1251–1365 × 462–598 | 580–1365 | 0.96 |
| 277 | 600–844 × 500–650 | 878–1188 × 476–606 | 1236–1347 × 460–596 | 600–1347 | 0.91 |
| 280 | 621–852 × 504–651 | 882–1174 × 477–606 | 1218–1326 × 460–594 | 621–1326 | 0.86 |
| 283 | 648–861 × 507–648 | 888–1160 × 480–603 | 1198–1298 × 462–590 | 648–1298 | 0.79 |
| 286 | 690–876 × 513–638 | 898–1130 × 489–597 | 1161–1246 × 472–584 | 690–1246 | 0.68 |

### 3.6 Exit (276–286): the glass prompt pill zooms in over the line
* The next segment's **glass pill** (a stadium shape with W:H ≈ 5.35) flies in from far bigger than the frame, centred at about (958, 536), and **shrinks onto the text**.
* While it is larger than the frame, only its straight top and bottom edges show. They read as **thin horizontal light streaks**: 2–4 px, white-lavender, with a soft blur of about 6 px.
* Look once it is fully visible (284–286):
  * Soft lavender rim, about 5 px, `#8C84E8` at about 60 %, with a soft outer glow.
  * A **second inner outline** about 35 px inside (a glass bezel).
  * The interior is barely lighter (+8 levels).
* Measured edges:

| f | top edge y | bottom edge y | left / right ends x | height |
|---|---|---|---|---|
| 276 | – | 879 (streak x 1080–1530) | – | – |
| 277 | – | 876 | – | – |
| 278 | 207 (streak x 0–180) | 867 | – | 660 |
| 279 | 219 | 849 | – | 630 |
| 280 | 236 | 834 | – | 598 |
| 281 | 255 | 816 | – | 561 |
| 282 | 276 | 795 | – | 519 |
| 283 | 300 | 771 | – | 471 |
| 284 | 324 | 744 | ≈ −10 / 1930 (round ends just off-frame) | 420 |
| 285 | 351 | 714 | 15 / 1905 | 363 |
| 286 | 390 | 684 | 171 / 1746 | 294 |

  Height shrinks ×0.95, 0.94, 0.925, 0.91, 0.89, 0.865, 0.81 per frame: an accelerating zoom-out (ease-in). **287 is a hard cut** to the next segment's pill close-up.

---------------------------------------------------------------------------------------------------

## 4. Camera summary
* **Shot A**: a global zoom/pan shared by the text layer and the panel (table 2.2).
  * Hold 147–152 (s 0.948).
  * Ease-in-out push-in 152→185 (s → 1.000, up-left pan of about 135 px).
  * Ease-in pull-out 185→199 that continues fast to 202, then eases to 0.77 by 215 and accelerates again into the cut (0.743 at 218).
  * The panel adds its own slide-in from the right (+113 px at 147 → 0 by 185) and **3D tilt from 199** (rotY → −10°, rotX → +5.5°, rotZ → +3.1°, perspective 3300 px).
  * The neon background lines move with the camera, with slight extra parallax.
* **Shot B1**: zoom-settle (1.39 → 1.0, expo-out) and an accelerating left pan.
* **Shot B2**: a decelerating left pan.
* **Shot B3**: the squeeze/zoom-out of the line plus the incoming pill.
* There is no camera rotation in B, and the background does not move with the camera.

## 5. Motion blur
* **None anywhere**. Edge widths stay at 1–2 px on text panning at 69 px/frame (244) and on the panel sliding at 22–30 px/frame (147–149). The cursor stays sharp on its 480 px/frame jump at 197→198.
* Do **not** add motion blur.

## 6. Layering (back → front)
* **Shot A**: background colour → neon lines → panel (outer bloom, rim, sidebar, canvas, nodes, connectors) → card and its shadow (inside the panel's space) → text column (it never overlaps the panel) → payload logo → cursor (always on top).
* **Shot B**: gradient → ring → grain → dots and text (extrusion copy under the face) → sparkles → pill (rim over the text from 284; its interior is transparent glass).

---------------------------------------------------------------------------------------------------

## 7. Sound sync (measured from `ref/audio.wav`)
* The music runs at **150 BPM**, with hats/ticks on a **6-frame grid** at 146.8, 152.7, 158.7, 164.6, 170.9, 176.8, 182.6, 188.7, 194.5, 200.3, 206.9, 212.8, 218.7, 224.7, 230.7, 236.7, 242.8, 248.8, 254.8, 260.7, 266.7, 272.7, 278.7 and 284.7. Every edit sits on this grid.
* **Low impacts (kick/boom)**: **147** (4.90 s, cut to "Drag."), **195** (6.50 s), **204** (6.80 s), **243** (8.10 s, just before the whip-cut) and **285** (9.50 s, pill frames the text).

| frame | time | visible event | suggested SFX |
|---|---|---|---|
| 147 | 4.90 | Cut into Shot A; "Drag." lights | Sub boom + bright tick (music downbeat) |
| 147–160 | 4.90–5.33 | Cursor flies in carrying the payload | Soft air whoosh, following the expo-out |
| 164–171 | 5.47–5.70 | Payload hovers then is released; the reference has a rising high-mid texture here | Short riser into the drop |
| **168–170** | 5.60–5.67 | "Drop." lights; **card pops out of the payload (170)** | **Pop / bubbly "plop"** on 170, with an air burst at 171 (−7 dB air peak) |
| 172–185 | 5.73–6.17 | Logo spins, title and subtitle slide in | Tiny UI ticks at 176.8, 182.6 and 185.8 |
| **188** | 6.27 | **Card starts collapsing** (strongest transient in Shot A) | Snap / click |
| 195 | 6.50 | Low impact; cursor whip loop begins (196) | Kick + whoosh start |
| **198–201** | 6.60–6.70 | **Card → node swap (198)**, cursor loops, **"Done" lights (200)**, panel tilts | Airy whoosh (air band peaks −8 dB at 200–201) + soft "settle" click on 198 |
| 204 | 6.80 | Low impact; connector arrow finished | Kick (music) |
| 209 | 6.97 | Cursor flips edge-on | Light click |
| **218→219** | 7.27–7.30 | **Hard cut to pastel** | Transition hit (mid + high transient at 218.5) |
| 220.7 | 7.36 | First "." appears 221 | Soft key tick |
| 221–244 | 7.37–8.13 | Dots typing | **No per-dot typing sound** in the reference. Only the music ticks on the 3-frame grid (224.7, 227.9, 233.3, 236.7) |
| **243** | 8.10 | Low impact | Kick → |
| **244.7** | 8.16 | **Whip-cut** at 245 | Whip / short swish tick |
| 248.8 | 8.29 | "j" appears; typing of "just vibe it" | Key tick (music hat) |
| 263–266 | 8.77–8.87 | Sparkles fully formed; tonal chime about 3–5 kHz in the spectrum | **Sparkle chime / twinkle** |
| **266.7** | 8.89 | **"vibe" 3D wobble starts** (strong transient) | Rubbery "boing" or wobble whoosh |
| 272.7 | 9.09 | – | Click (music) |
| 276–284 | 9.20–9.47 | Pill streaks fly in | Rising whoosh, ending on → |
| **284.7–285** | 9.49–9.50 | **Pill frames the text** | **Low impact**; then a hard cut at 287 |


---------------------------------------------------------------------------------------------------

## 8. WKC ADAPTATION: what replaces what (same frames, positions, sizes and motion)

Copy every frame number, path, size, easing and opacity above **unchanged**. Only the content, the copy and the colours change. The reference timing (A = 4.90–7.27 s, B = 7.30–9.53 s) carries the script lines "Explain. Engage. Convert." (5–7.5 s) and "Or just look incredible." (7.5–10 s).

### 8.1 Global re-colour map (reference → WKC)

| element | reference | WKC |
|---|---|---|
| Shot A base | `#0B0B15` → `#120E1D` / `#141021` / lower-left `#17122B` | `#050C16` → top `#08111E`, mid-left `#0A1526`, lower-left glow `#0C1A30` (same timing 150→185) |
| Neon line core / glow | `#9A90E8`, purple halo | core `#7DB8F7`, glow `#3F8CE8` at about 45 %, same 20 px halo |
| Panel rim idle / lit | `#B9B5D8` / `#D7D3F5` | `#B4C9E4` / `#D9EAFF` |
| Travelling rim bloom | rgba(185,175,255,.35) | rgba(110,175,255,.38) |
| Text active / inactive | `#FFFFFF` / white at 10 % | identical |
| Drop card fill / shadow | `#523CDE` / rgba(82,60,222,.20) | **`#3F8CE8`** / rgba(63,140,232,.22) |
| UI accents (arrows, tab underline) | `#2B59D9`, `#3B5BDB` | `#3F8CE8` arrows, `#1266C9` underline |
| Cursor | black-navy glass, white rim | ink `#0A1422` body, rim `#E6F0FD`, rim bloom rgba(63,140,232,.35) on dark |
| Shot B text | `#0C0C19` | ink **`#050F19`** |
| Pill rim | `#8C84E8` | `#3F8CE8` at 60 % with `#8EC3FF` bloom |
| Pastel mesh | pink / aqua / lavender | WKC-blue mesh below |

**WKC pastel grid** (same sample points as §3.1, hue-shifted: pink→periwinkle, lavender→ice blue, aqua kept). If the lower edge needs more brand blue, deepen the bottom row by about 6 % toward `#8DB6F0`.

| y \ x | 15 | 240 | 480 | 720 | 960 | 1200 | 1440 | 1680 | 1905 |
|---|---|---|---|---|---|---|---|---|---|
| 15 | `#A5C6F0` | `#AECCF2` | `#C0D6F2` | `#D1E2F2` | `#B6DBF1` | `#92E1F1` | `#78DDF2` | `#75DDF3` | `#85E1F4` |
| 180 | `#AFCCF1` | `#B5CFF1` | `#C5D9F2` | `#D5E5F4` | `#C0DDF5` | `#A2E5F1` | `#8EE1F2` | `#89DFF2` | `#97E3F4` |
| 360 | `#BBD3F3` | `#BED5F3` | `#CEDFF4` | `#DEE8F2` | `#CDE5F3` | `#B1E6F4` | `#A1DFF2` | `#9EDCF1` | `#A8E2F2` |
| 540 | `#C3D8F2` | `#C6DAF3` | `#D2E1F3` | `#E2EBF4` | `#E6ECF4` | `#BADFF2` | `#ABD5F0` | `#A6D0F3` | `#B0D8F1` |
| 720 | `#BFD6F0` | `#C3D9F1` | `#CFE0F2` | `#DEE8F1` | `#D3E3F4` | `#BCD8F3` | `#ACD0F3` | `#A8CEF3` | `#B0D2F4` |
| 900 | `#B6D3EF` | `#B8D4F0` | `#C4DAEF` | `#CAD8F2` | `#C4D8F1` | `#B4D1F2` | `#A6C9F0` | `#A1C7F2` | `#A9CCF3` |
| 1065 | `#A6CAEA` | `#A9CDEE` | `#B2D2EE` | `#B8CEF0` | `#B1CDF2` | `#A5C7F1` | `#98C0EF` | `#93BDEF` | `#9CC3F1` |

### 8.2 Shot A (147–218): "Explain. / Engage. / Convert." over the WKC Studio scene editor
* **Words** (one-for-one): "Drag." → **"Explain."**, "Drop." → **"Engage."**, "Done" → **"Convert."**. Keep the reference's weight contrast and every opacity and crossfade frame (Explain 147–167, Engage 168–198, Convert 199–218).
  * Font: **Inter Tight 800** for "Explain." and **Inter Tight 500** for "Engage." and "Convert.", tracking −0.05 em.
  * The WKC words are longer, so use **font-size 151 px** (cap 111 px, versus 118.5 in the reference). With that size "Convert." (509 px) still ends 56 px left of the panel rim at the closest frame (185). At 163 px the gap would be only 16 px and the rim bloom would touch the text.
  * Keep the reference **left ink edge x = 70.5** and the **baselines y = 264 / 448.5 / 631.5** (world, frame 185). The line pitch stays 183.75.
  * Keep the "Explain." left→right brighten gradient (147–167) and the pop-and-slide entrances of lines 2 and 3 (149 and 151).
* **Panel → "WKC Studio – Scene Editor"**, with identical geometry, rim, travelling light, camera and 3D tilt.
  * **Sidebar logo box** (660,90)–(882,129): `/img/wkc-mark.svg` (white) + wordmark "WKConversions" in Inter Tight 700.
  * Label "Pages" → **"Library"**.
  * **17 rows** (same y pitch 53.7, same icon/sub-item pattern):
    * Rows 1–2 (icons): **Projects**, **Assets**.
    * Rows 3–9 (indented sub-items): **Brief, Script & VO, Storyboard, Style frames, Brand kit, Footage, Music & SFX**.
    * Rows 10–17 (icons): **Upload, Animate, Keyframes, Easing, Transitions, Render, Formats, Export**.
  * **Top nav** (same x and baseline): Home · Brief · Storyboard · Design · Animate · Sound · Review · Render · Export · Clients.
  * **Tabs**: "Scene Editor ✎ | Timeline ⏱ | Storyboard ⊞ | Render Queue ▤", underline under "Scene Editor" (x 1011–1175, `#1266C9`).
  * **Nodes** at the reference slots, same 358×126 cards and the same blue connector arrows. They read as a production pipeline:
    * A (1012,255) **"Product brief" / "What needs explaining?"** (doc icon).
    * B (1440,253) **"Script & VO" / "30 s story, word-timed"** (waveform icon).
    * C (1868,255) **"Style frames" / "On-brand in WKC blue"** (palette icon).
    * D (1012,450) **"Storyboard" / "12 frames, shot by shot"** (grid icon).
    * E (1440,450) **"Animate" / "Keyframes & easing curves"** (diamond-keyframe icon).
    * F (1868,450) **"Render" / "16:9 · 1:1 · 9:16"** (film icon).
    * The **new connector ↓ D→G** draws 199→204, as in the reference.
* **Payload** (the reference Slack logo): a **55 px "keyframe pinwheel"**, four rounded diamond keyframes in a 2×2 pinwheel coloured `#3F8CE8`, `#7FD3FF`, `#1266C9`, `#E6F0FD`, with a 6 px blue glow. It is the WKC equivalent of a colourful integration icon, and it reads as "motion". It gets the same 3D counter-rotation in flight, the release at 168, the clockwise spin and 1.45× pulse 172–185, and it sits at card +(97,102).
* **Drop card** (same rect animation, same reveal timings): **`#3F8CE8`** card.
  * Title **"Explainer scene"** (Inter 600, 41 px, white).
  * Divider (white 85 %).
  * Subtitle **"Drop in your product story"** (Inter 400, 36 px, white 78 %).
  * A keyframe-diamond icon (white 30 %) in place of the gear.
  * It shrinks into **node G (1012,645) "Explainer scene" / "Send to timeline"**, white node with the pinwheel icon (swap on 198).
* **Cursor**: the same 3D arrow, path, banking, loop and flip (table 2.5), in WKC ink with a cool-white rim.
* **Neon lines and background**: same geometry and timing, in WKC blues (8.1).

### 8.3 Shot B (219–286): "Or ……… just look incredible."
* **"Or"** stays (Inter Tight 800, ink `#050F19`, **151 px**, which gives the same 111 px cap height as the reference's DM Sans 157.5 px). It is centred on x 950 at 219 with the same zoom-settle s = 1 + 0.39·0.86^(f−219).
* **Dot leader**: set the "." characters at the reference **pitch 40.35 px**, **first dot +193 px** from the O's left edge, dot centre y 583 at s = 1, same per-frame counts (B1 table). That keeps the pan identical and the frame-by-frame overlay exact.
* **Whip-cut at 245, then typing "just look incredible."** (Inter Tight 700, 151 px, −0.05 em, ink). The line is 1193 px wide versus 818 px in the reference, so to keep the reference's final centring (centre x ≈ 960 at 265) **shift the B2 j-left track by −184 px**. Use 486 at 248 down to 364 at 265, with the same velocities; the dot positions shift with it.
  * Typing: 248 "j", 249 "just", 250 "just lo", 251 "just look", 252 "just look inc", 253 "just look incred", 254 **"just look incredible."** That is 21 characters over 7 frames, with the same pop-in style.
  * Dot erase 262–265 with the same per-frame boundaries, also shifted by −184.
* **Sparkles**: the same three ✦ stars, sizes and timings, anchored to the end of "incredible.". Take every §3.4 position **relative to the line's right ink edge**: the reference right edge is x 1365 at 265; the WKC line's is about 1556. Add +191 px in x and keep the y values. Keep them white with a faint `#8EC3FF` fringe instead of pink.
* **B3 "incredible" wobble** (266–286): the same 3D extruded sticker treatment. Ink face, 2–3 px white stroke, back copy `#1B3A63` (WKC deep blue instead of grey), same offsets, the same per-letter wobble pattern spread over 21 glyphs, the same group squeeze about the line centre (scaleX → 0.68, scaleY → 0.93, tilt → −3°).
  * For a brand touch, let only **"incredible."** carry the strongest wobble. Mirror the reference's "just" squeeze onto "just look" and keep "incredible." widest.
* **Exit pill** (276–286): identical stadium zoom and edge table, re-coloured. This pill is the next segment's **"Tell us what needs explaining"** brief input, so the handover reads as "now brief us".
* **Background**: the WKC pastel grid (8.1) with the same light ring (white), the same static grain, and the same ring timing (none at 219–225 and 245–251).

### 8.4 Sound for the WKC build
Use the §7 cue frames as they are.
* Sub boom on the 147 cut.
* Air whoosh on the cursor entry (147–160), riser 164–170, **bubbly pop on 170** (card birth), snap on 188, whoosh 198–201 with a soft click on 198 (node swap).
* Transition hit on 218/219.
* Soft key ticks on 221 and 248 only; let the music's 6-frame hats carry the typing feel, as the reference does.
* Swish on the 245 whip-cut, **twinkle chime 263–266** (sparkles), rubbery wobble whoosh on 266, rising whoosh 276–284, **low impact on 285**.

---------------------------------------------------------------------------------------------------

## 9. Self-check performed
The tables were drawn back onto reference frames 150, 170, 185, 199, 205 and 218 (scratch file `verify_overlay.jpg`):
* The text-layer transform puts the Drag/Drop/Done boxes on the words.
* The 3D panel model puts the rim polyline on the reference rim, including the tilted frames 205 and 218.
* The cursor tips and card rects land on the reference cursor and card.
* Panel model error: ≤ 0.7 px rms (1080p) on every frame 147–218.
* Text-layer error: about ±2 px at 147–157 (tracking noise) and ≤ 1 px elsewhere.
