# Segment 7: reference frames 862-1005 (28.73-33.50 s)
### "Enterprise-grade security" badges, four rapid lines with light streaks, "200+ Clients, 21+ Countries" logo wall

All coordinates are 1920x1080 px (720p measurements x 1.5), frames are film frames (frame n = n/30 s). "L" = 0-255 luminance. Every number below was measured from the reference frames (thresholded masks, SIFT homography tracking, ellipse fits, per-glyph peak luminance); per-frame tables are in the appendix (section 9).

## 0. Context: what enters and what leaves

**856-865 (previous segment's shot, nothing of segment 7 is visible yet).** The "Fully containerized / On-prem control / server card" shot leaves with an accelerating whip-tilt UP: the toggle centre y goes 441, 433.5, 423, 411, 394.5, 375, 346.5, 307.5, 246, 129 (frames 856-865), and the card's "Choose" button centre y goes 939, 933, 925.5, 916.5, 906, 891, 873, 847.5, 808.5, 733.5. Upper elements move about 1.5x faster than lower ones, so it is a tilt with perspective, not a flat slide. There is a vertical smear of 12-25 px on 863-865, the toggle widens 120 -> 147 px (x1.22), and the title "Fully containerized" fades and blurs letter by letter, left to right, from 858; it is gone off the top by 864. **Hard cut 865 | 866.** If seg7's RANGE starts at 862, draw nothing of seg 7 before 866.

**1002-1009 (handoff to the "90%" segment).** A glowing violet ring (the rim of the next shot's dark disc) sweeps in from below. 1002: a faint curved violet streak near the bottom (y ~ 940-1060). 1003: a huge tilted ellipse rim encloses the scene, with its lower arc at y ~ 840-935 (brightest x 818-1410); everything outside or below the rim is darkened to about 40% and blurred. 1004: the lower arc is at y ~ 777-869. 1005: big blurred "90%" digits fade in on top. The clients scene keeps zooming out while it fades (measured gain): 1002 1.00, 1003 0.84, 1004 0.65, 1005 0.48, 1006 0.31, 1007 0.16, 1008 0.07, 1009 0.02, then it is gone.

## 1. Shot list

| # | frames | what | in | out |
|---|---|---|---|---|
| A | 866-907 | "Enterprise-grade / security" between two metal hexagon badges (SOC 2 left, HIPAA right), two neon hexagon-corner lines | hard cut at 866; every element is already mid-animation at the cut | accelerating pan left (ease-in) from 886, then T1 |
| T1 | 907-912 | **foreground pass-by wipe**: a giant, defocused, grey metal badge sweeps right to left across the lens; shot A is swapped for shot B behind it at 908 -> 909 | the occluder enters from the right on 907 | clean from 913 |
| B | 909-917 | "Semantic scoring" + the light-streak ring (the ring opens 911-930) | revealed by T1, sliding left | T2 |
| T2 | 918-919 | line swap: 918 "negative" frame of the old line; 919 ghost of the old line + blurred incoming line | | |
| C | 919-930 | "Confidence thresholds" | rise from below + blur (919-922) | T3 |
| T3 | 931-932 | same swap recipe (931 negative with horizontal echo, 932 ghost + incoming) | | |
| D | 932-940 | "PII redaction" (the ring now splits into 3 trails) | rise + blur (932-934) | T4 |
| T4 | 941-942 | same swap recipe (941 negative, 942 ghost + faint incoming) | | |
| E | 942-961 | "Prompt injection safe" (5-6 trails); camera pull-back from 948 with out-of-focus logo tiles flying in | rise + blur (942-955) | hard cut 961 \| 962 |
| F | 962-1002 | "200+ Clients, / 21+ Countries" + 8 glass logo tiles + 4 bokeh tiles; continuous pull-back zoom with parallax | cut-in with heavy directional smear and chromatic aberration (962), sharp by 967; per-character reveal 962-989 | T5 (1002-1009) |

The streak ring is ONE continuous element from 911 to 961. It is not cut at the text swaps: only the text changes.

## 2. SHOT A (866-907): "Enterprise-grade security"

### 2.1 Background
- Base: dark navy-violet, no grain (flat-area noise std < 0.5 L), mild vignette (corners about 15% darker). Measured grid at frame 900: top centre #0B0D19, top right #090D16, left edge #171020 (purple cast), centre #100F21, lower centre #161125, bottom #181125.
- A broad, soft purple radial glow sits at the bottom centre: peak #1B122A at about (954, 1032), half-max about 1350 x 580 px. It carries faint concentric ring banding (+/-2 L) in the lower half.
- **Neon lines** (behind the badges and title): they are the visible corners of two giant hexagon outlines. Core 3-4.5 px, peak #604FC1 (#5C4BBB), glow falls off to the background within about +/-12 px (#2C225F at 8 px). Brightest at the corner, fading toward the far ends (about 45% at the left end, #3C2F7E).
  - **Bottom-left line**: horizontal from x 0 at y 930, corner at (270, 930), then a diagonal down-right to (374, 1080) (about 50 deg below horizontal). Values are the settled ones at 900. **Draw-on** (trim end along the path, from the left): it appears at 873 (visible x 96-183), reaches x 242 at 875 and the corner at about 878-879, then runs down the diagonal (y 1017 at 880, 1038 at 883, 1068 at 884) and reaches the frame bottom at 885. Its horizontal part rides the title's rise (y 978 at 873, 970 at 875, 952 at 880, 945 at 884, 934 at 893, 930 from 900) and pans left with the exit (left end 72 at 893 -> 24 at 906).
  - **Top-right line**: a diagonal from the top edge at (1521, 0) down-right to a corner at (~1605, 103), then horizontal to the right, fading to 0 at about x 1737. **Draw-on**: it appears at 893 (y 0-51); it reaches y 88 at 894 and the corner at 895; then the horizontal grows to a right end of 1616 (895), 1638 (896), 1684 (899), 1704 (902), 1726 (904), 1737 (905).

### 2.2 Title "Enterprise-grade" / "security"
- Bold geometric grotesk (DM-Sans-Bold-like, single-storey g, straight y), sentence case, normal tracking, pure #FFFFFF, no glow. Two lines in a centred block, block centre x about 957.
- Cap height **68 px** (E: 45.5 px at 720p), x-height of "security" 51 px. Font-size is about 94 px in Inter Tight (cap 0.727).
- Settled positions: line 1 baseline **y 504.75**, line 2 baseline **y 621.9** (leading 117). Line 1's E left edge is at x 549; line 2 spans x 763-1150.
- Layering: the last "e" of "grade" passes BEHIND the HIPAA badge (the badges are in front of the title).
- **Rise (whole block)**: line-1 baseline from 621.9 (at frame 865.8 = the cut) to 504.75 over 38.2 f, cubic-bezier(0, .63, .44, .99). Fit rms 0.2 px. Measured first frames: 866 606.1 (smeared), 867 589.3, 868 578.8, 869 570.8, 870 564.0, 871 558.5. There is vertical motion blur on 866-868 (about 15 px smear at 866).
- **Per-character opacity** (one stagger across both lines, by glyph index i: "Enterprise-grade" = 0-15 incl. hyphen, "security" = 16-23): op_i(t) = 1-(1-u)^1.36 with u = clamp((t - 823.4 - 1.74 i)/44). Fit rms 0.8%. Because of the offset, most glyphs are already partly visible at the cut. Measured: glyph 8 ('s'): 866-871 = .74 .77 .79 .82 .84 .86; glyph 16 ('s' of security): .41 .46 .49 .51 .53 .56; glyph 23 ('y'): .07 .10 .13 .17 .20 .22 (full at about 906). Glyphs under about 60% opacity are also softly blurred (about 2-3 px).
- **Exit**: the block pans left with an ease-in (velocity x1.22 per frame). dx = -0.3 (886), -0.9 (888), -1.8 (890), -3.2 (892), -5.1 (894), -7.6 (896), -11.3 (898), -16.9 (900), -20.2, -24.4, -29.9, -36.5, -44.4, -55.0, -69.1 (907). From 908 it is covered by the T1 occluder.

### 2.3 Badges (SOC 2 left, HIPAA right)
- **Shape**: a hexagon with flat top and bottom edges and pointed left and right vertices, width:height 1.125, vertices rounded (radius about 6% of width). Everything is pure greyscale (saturation 0).
  - Outer silver bezel about 9% of the width thick, brushed metal: #E8E8E8 highlight at top-left, through #8A8A8A, to #5A5A5A at bottom-right. A thin dark groove sits inside it.
  - Inner face: dark brushed metal #151515-#3A3A3A with a diagonal glossy reflection band from the top-left.
  - Across the middle: a light-grey brushed band (height about 13% H, pointed ends following the hexagon) with heavy dark text "SOC 2" / "HIPAA" (#1A1A1A, cap about 6.5% H).
  - Above the band: a logo glyph at -0.35 H, and "Compliancy / Group" (#C8C8C8, cap about 4% H) at -0.23 H / -0.17 H.
  - Below the band: a large date "5.19.2025" / "6.4.2025" (#5A5A5A, embossed, cap about 8.5% H) at +0.15 H, and "✓ MONITORED" (#D0D0D0, cap about 4.5% H) at +0.29 H.
  - A soft light outer glow of about 12 px at about 25%.
- **SOC 2**: 579 x 515 px, centre (304, 645) at frame 895.
- **HIPAA**: about 745 x 645 px (1.29x SOC 2, so nearer the camera), centre (1696, 528) at 895 (estimated; its right side is off-frame). It is in front of the title.
- **3D**: both badges turn toward the title, with perspective about 1500 px.
  - SOC 2: rotateY about +10 deg (its right edge recedes; the top and bottom edges converge by 3.5 deg toward the right).
  - HIPAA: rotateY about -17 deg (its left edge recedes; the edges diverge by 7 deg toward the right).
  - These stay roughly constant (+/-3 deg).
- **SOC 2 motion**:
  - Enters from the top: y 332 -> 659, starting at 866 (the cut), duration 40.4 f, cubic-bezier(.01, .13, .08, .96) (rms 0.05 px).
  - x 292 -> 309 over 866-886.
  - rotZ -8.5 deg (866), -9.0 (868), then eases into a steady +0.3 deg/f from about 885: -4.5 (886), -1.8 (895), +1.9 (907), +2.2 (908).
  - Scale 0.99 -> 1.00.
  - First 6 centres: (292,322) (296,388) (298,421) (299,446) (300,466) (302,484).
- **HIPAA motion**:
  - Enters from the bottom-right: y 1281 -> 491, starting at 866, duration 43.6 f, cubic-bezier(0, .03, .03, 1) (rms 0.06 px).
  - x stays at 1704 until 886.
  - rotZ about +20 deg (866) -> +17.3 (869), then turns at -0.70 deg/f slowing to -0.53 deg/f: +1.2 (895), -5.2 (907).
  - Centres: 866-868 are estimates, because only its top edge is in frame (that edge is at y 927 / 774 / 702): about 1213 / 1135 / 1068. Then measured: 1011 (869), 961, 919, 882, 848 (873).
- **Exit**: both badges accelerate left from about 890 (x1.25 per frame). SOC 2 x: 304 (895) -> 296 (900) -> 252 (907) -> 236 (908). HIPAA x: 1696 (895) -> 1684 (900) -> 1629 (907).

### 2.4 Camera (shot A)
There is no global camera move. Each element animates on its own (the neon lines follow the title's rise). Only the last 20 frames have a common leftward ease-in pan (title, badges and lines all move by -55 to -75 px by 907), which leads into T1.

## 3. T1 (907-913): foreground pass-by wipe
- The occluder is a giant, out-of-focus, desaturated metal badge (it reads as an extreme close-up of a badge bezel, with concentric curved highlights). Gaussian defocus is about 40 px; the core is #1C1C1C with highlights up to #555555; it is fully opaque in its middle.
- It moves right to left and decelerates. The scene behind it switches from A to B at 908 -> 909. Edges (50% coverage, x):

| frame | occluder covers | soft edge | behind it |
|---|---|---|---|
| 907 | x >= ~1395, semi-transparent (40-80%) | wide | shot A |
| 908 | ~323 -> 1845, opaque between ~420 and ~1620 | ~100 px | shot A visible left of it (SOC 2 at x 236) and right of it (HIPAA remnant) |
| 909 | 0 -> 1008 | ~60 px (fairly hard) | shot B visible right of 1008 |
| 910 | 0 -> 576 | ~150 px | shot B |
| 911 | 0 -> 293 | ~100 px | shot B |
| 912 | 0 -> 92 | ~60 px | shot B |
| 913 | gone | | shot B |

## 4. SHOTS B-E (909-961): four rapid lines with the light-streak ring

### 4.1 Background
- The same dark base as A (top #0B0D19, right edge #090D16, bottom #181125).
- A centred blue-violet radial glow: centre about (945, 540) (drifts within +/-30 px), peak about #201B4C (raw samples next to the text: #1F1B4A above, #1D1745 below), half-max radius about 410 px horizontally x 390 px vertically. There is no grain.

### 4.2 Light-streak ring (911-961, continuous)
- **Strokes**: thin elliptical strokes. Core about 3 px plus glow, half-max width 3-6 px.
  - Colour gradient along each arc: transparent at the major-axis tips (#221A4D), then violet #4432A8 / #5543B1, then lavender #9D97C5, then a hot white #F1EEFF at the brightest point.
  - Hot spots are near the minor-axis ends: on the lower arc at x ~ 950-1000, and on the upper arc at x ~ 730-810 (they stay there; they do not travel).
  - Only the middle ~60% of each long arc is visible.
  - The upper arc runs behind the text.
  - A faint dark (#000 at 30-40%) slightly larger ellipse outline shows near the left tip (x 30-90, y 680-900) and the right tip (932-941).
- **Geometry and opening** (table T2):
  - ry (semi-minor) 34 (911) -> 312 (928-930) over 17 f, cubic-bezier(0, .23, .43, 1).
  - Rotation -3.2 deg -> -20.1 deg (rising to the right), same timing: -3.2, -5.3, -7.0, -8.6, -10.1, -11.5 (911-916).
  - rx about 900-939.
  - Centre (919, 586) at 911, (942, 574) at 916, (970, 536) at 930 (drifts up-right).
  - Read it as a circle of radius ~935 tilting open around its major axis.
- **Trail count**:
  - 1 ring for 911-932.
  - 3 trails for 934-941.
  - 5-6 trails for 943-961: concentric, same centre, ry spread about +/-8%, rotation spread +/-2 deg, extra trails at 50-80% opacity.
- **Brightness** (hot-spot L): 167 (911), 196, 212, 223 (914), 236 (926), about 230 to 933, then 205 (937), 163 (940), 145 (945-955), 104 (959), 84 (961).
- **Pull-back, 954-961**: the bundle retracts and shrinks. Visible arcs bbox: x 232-1342 / y 132-837 (954); x 255-1366 / y 144-856 (956); x 354-1342 / y 165-843 (958); x 576-1219 / y 360-798 (961). ry stays about 245 and the rotation is about -15 deg while the arcs trim from the left and fade.

### 4.3 The four lines (all centred, #FFFFFF (#F9F9FD measured), bold geometric grotesk, no glow)

| line | cap h | x-height | width @ scale 1 | baseline (settled) | centre x | notes |
|---|---|---|---|---|---|---|
| B "Semantic scoring" | 96 | 70 | 1170 | 573.75 | slides 1106 -> ~957 | heaviest weight |
| C "Confidence thresholds" | 93 | 61.5 | 1311 | 570.75 | 1000 -> 970 drift | |
| D "PII redaction" | 90 | 61.5 | 736 | 576 | 958 | slow scale-down from 935 |
| E "Prompt injection safe" | 78 | 51 | 1062 | ~561 | 969 | rise, then pull-back |

- **B entrance**: revealed by T1 while sliding left. Centre x: 1106 (909), 1076, 1058, 1043, 1031, 1022, 1012, 1004, 998 (917). Fit: 1105.5 -> 956.8 (the frame centre), start 909, 23.4 f, cubic-bezier(.02, .22, .24, 1) (about expo-out, half-life 3.2 f). There is no vertical motion. Horizontal motion blur is about half the per-frame step: about 15 px at 909, 6 px at 911, 3 px at 914.
- **C entrance** (opacity, y offset below final, width scale): 919: op .52 (heavy blur, about 6 px Gaussian, plus about 25 px horizontal smear and a faint vertical trail below), +24.6 px; 920: .91, +9.3, scale .973; 921: .96, +4.2, .989; 922: 1.0, +1.5, .997; sharp from 923. Then x drifts left: 1000 (920) -> 970 (930), expo half-life 6 f.
- **D entrance**: 932: op .53 (blurred), +18.6 px; 933: .95, +5.9; 934: 1.0, +1.8; 935: +0.2. From 935 it scales down about its centre: 1.0 -> .992, .984, .976, .963, .955 (940).
- **E entrance**: 942: op about .24 (very faint, blurred), about +69 px; 943: .97, +53, scale .962; 944: +40, .986; 945: +31, .997; 946: +24; 947: +18.5; 948: +14; 949: +10.4; 950: +7.5; 951: +5.1; 952: +3.5; 953: +2.3; 955: +0.6. That is expo-out with half-life 2.8 f. Settled cap-band centre y about 523.
- **E pull-back**: scale about the text centre (969, 533) 1.0 (947), .997, .993, .984, .976, .965, .952, .938, .922, .905, .886, .863, .831, .794, .737 (961). It accelerates (ease-in). Opacity about 1 -> .95 (954) -> .87 (958) -> .74 (961). A defocus grows from 0 to about 2.5 px by 961.

### 4.4 Line swap recipe (T2 918-919, T3 931-932, T4 941-942)
1. **Frame N (918 / 931 / 941) = "negative" of the old line**, in the same place.
   - Offsets: 918 shifted (-6, -7.5); 931 shifted 8 px up, scale .96, with 3-4 horizontal echo copies trailing left about 9 px apart at falling opacity; 941 not shifted, scale .98.
   - Fill goes dark: 918 / 931 use a vertical gradient #0A0A12 (top) -> #4E4E5B (bottom), median #3D3B4D; 941 is flat #09081A.
   - Rim: a 2-3 px lavender-grey stroke #7B7A8B-#86849C, blurred about 1.5 px. On 918 and 931 there is also a soft outer halo of about 6 px.
   - The incoming line is not drawn yet.
2. **Frame N+1 (919 / 932 / 942)** = the old line as a 12-15% ghost in the same negative / outline style, plus the incoming line at about 50% (942: 25%), blurred and low.
   - Ghost placement: 919 about 70 px higher at the same size; 932 scale about .73 and about 60 px higher; 942 scale about .77 at the same y.
3. **N+2**: the incoming line is at .91-.97 and nearly sharp. **N+3**: sharp.

### 4.5 Bokeh tiles in shot E (948-961)
- Foreground, out of focus (blur about 8-12 px), desaturated grey rounded-rect blobs (L 40-70, 30-50% opacity), plus one red-tinted blob entering at the right edge on 957-958.
- They fly inward from the frame edges and shrink (the camera pulls back past them). Centre and size per frame:
  - a: (1775, 14) 166x32 (948) -> (1622, 104) (950) -> (1475, 203) (953) -> (1430, 225) 66x30 (954)
  - b: (1908, 972) (949) -> (1865, 936) (950) -> (1694, 857) (953) -> (1592, 818) (955)
  - c: (956, 1044) 140x60 (949) -> (956, 990) (950) -> (953, 881) 90x35 (953)
  - d: (668, 8) (954) -> (740, 65) (955) -> (788, 168) (957) -> (833, 263) (960)
  - e: (3, 443) (957) -> (72, 457) (959) -> (120, 462) (960)

## 5. SHOT F (962-1002): "200+ Clients, / 21+ Countries" logo wall

### 5.1 Background
- Dark base: centre #0C0E1C, right / top-right #090B14, left #120E1D, bottom #191124, with a weak bottom-left glow #221D31. There is no centred glow and no grain.
- Four far, heavily blurred tiles (blur about 20 px): a dark-red logo blob about 120x110 at (240, 135); a grey pill 110x30 at (1550, 147); grey 130x45 at (1725, 822); red-grey 100x30 at (983, 878). Positions are at frame 990; they scale with the camera (use the "text" layer scale).

### 5.2 Text
- Two centred lines on x = 930: "200+ Clients," (x 670-1191) and "21+ Countries" (x 667-1194). #FBFAFF, bold geometric grotesk.
- Cap **57 px**, x-height 43, baselines **474.75 / 603.75** (leading 129) at the reference pose (frame 990, scale 1). Font-size about 78 px in Inter Tight.
- **Reveal**: one per-glyph stagger across both lines (spaces excluded; 12 + 12 glyphs). op_i = 1-(1-u)^1.30 with u = clamp((t - 948.0 - 0.80 i)/21.2). Measured: glyph 0: .58 (962), .73, .76, .81, .86, .93 (967); glyph 12: .18, .27, .34, .40, .48, .54; glyph 23: .01 (966), .03, .10, .15, .21, .27 (971), full at 988.

### 5.3 Glass logo tiles
- Boxes at frame 990, scale 1:

| tile | box x | box y | size |
|---|---|---|---|
| Penn | 416-717 | 92-255 | 301x163 |
| Harvard | 900-1106 | 72-300 | 206x228 |
| clip | 1356-1556 | 206-399 | 200x194 |
| Snapchat (icon + label) | 202-414 | 416-639 | 212x223 |
| Verizon | 1539-1882 | 426-666 | 343x240 |
| NatWest (logo + wordmark) | 1192-1557 | 606-994 | 365x389 |
| Adobe (logo + wordmark) | 406-758 | 711 to ~1104 | 352 x ~393, bottom off-frame |
| Banco Guayaquil | 22-332 | 802-963 | 310x161 |

- **Style**: dark translucent fill #1D1A2D-#232031 (bg + 8-10 L), corner radius about 9-10% of the tile width (NatWest r about 33, Penn about 25, Harvard about 20).
- **Border**: 2-3 px with a gradient. Top and left are bright lavender (#8E86B7 / #7B73A6); the right edge is violet #3F3675 with an 8-12 px violet outer glow (#1D1649); the bottom border is almost invisible (#231D39).
- An inner highlight band runs just under the top border (#363054 fading to the fill over about 15 px). Logos are in full colour.

### 5.4 Camera: pull-back zoom about the frame centre with per-layer parallax
- Each layer is scaled about (960, 540): p_i(t) = (960, 540) + s_i(t) * (p_i(990) - (960, 540)), and its size is multiplied by s_i(t). The fit p = C + s(p0 - C) reproduces the tracked positions within 1-3 px.
- s_i(t) = a - b(t - 990) + c * r^(t - 963), valid 963-998 (max error 0.3-1.4%). Measured per-frame values are in table T3; use them directly. After 998 the zoom-out accelerates (text .963 at 998 -> .909 at 1004).

| layer | a | b | c | r |
|---|---|---|---|---|
| text | .996 | .0047 | .412 | .857 |
| Penn | .989 | .0046 | .503 | .872 |
| Harvard | .973 | .0064 | .553 | .895 |
| clip | .963 | .0020 | .471 | .908 |
| Snapchat | .991 | .0039 | .346 | .878 |
| Verizon | .977 | .0046 | .609 | .887 |
| NatWest | .995 | .0022 | .533 | .854 |
| Adobe | .973 | .0050 | .977 | .877 |
| Banco | .991 | .0013 | .388 | .873 |

- **Entrance look**:
  - 962 has a heavy directional smear (horizontal echo copies about 45 px apart) and radial chromatic aberration (RGB split of +/-8-10 px at the frame edges: blue outside, red inside). The near tiles show a radial zoom streak (clip tile about 40-60 px).
  - Smear is about 10 px at 963 and 5 px at 964, about 2 px on 965-966, and the image is sharp from 967. There is no flash (mean L stays at 23.7).

## 6. Motion blur summary
- Fast moves are blurred over about 0.5-1 frame of displacement (180-360 deg shutter look).
- Specific frames: title A vertical smear on 866-868; Semantic horizontal smear on 909-913; the incoming lines' blur on 919/920, 932/933, 942-944; zoom streaks on 962-964; the previous shot's vertical smear on 863-865.
- The T1 occluder is a defocus blur of about 40 px.
- The badges show no visible blur after 867.

## 7. Sound sync (reference picture events, with audio onsets measured in ref/audio.wav)

| frame | picture event | audio |
|---|---|---|
| 866 | hard cut, badges slam in | low hit 865-868 |
| 873, 893 | neon line draw-ons (zaps) | hi ticks 873, 881, 885 |
| 890-907 | pan builds | hi swish 890-891, 896 |
| 908-909 | foreground pass-by wipe | big low hit + whoosh 909-910 |
| 918-919 | negative flash, then "Confidence thresholds" | strongest hi transient of the segment at 919-920 |
| 931-932 | swap to "PII redaction" | hi 929-933 |
| 941-942 | swap to "Prompt injection safe" | hi 942-944 |
| 948-961 | bokeh fly-in / pull-back whoosh | flux 948, low 953/956 |
| 962 | cut to the logo wall | big low hit at 963 |
| 962-989 | per-character shimmer | hits 968, 973, 977, 985-987 |
| 1002-1005 | portal ring whoosh into "90%" | hi 1000-1001, big low hit 1005 |

## 8. WKC ADAPTATION (keep every size, position, timing, ease and transition above; change only content and colours)

**Colour remap for the whole segment:**
- Base: #0B0D19 / #181125 -> WKC ink #050F19 at the top to #0A1630 at the bottom (blue instead of purple).
- Purple bottom glow #1B122A -> #0E2244.
- Shots B-E centre glow #201B4C -> #0B2A57.
- Violet strokes #604FC1 / #5543B1 / #4432A8 -> #3F8CE8, with #1B4FB8 for the dimmer parts and the tips.
- Lavender #9D97C5 -> #8DC0FF; hot white #F1EEFF -> #E6F0FD with a #5FD3FF tint at the hot spot.
- Negative-frame rim #7B7A8B -> #8DC0FF at 60%.
- Glass tile border: #8E86B7 -> #E6F0FD (top / left); the violet right edge and glow #3F3675 / #1D1649 -> #3F8CE8 / #1B4FB8.
- Headlines: Inter Tight 800, tracking -0.05em, #FFFFFF.
- **Size the text by the measured cap heights** (68 / 96 / 93 / 90 / 78 / 57 px). Use the reference baselines and centre x. Widths will differ with the new words.

**Shot A (866-907) -> "Detail-driven" / "design"** (script 29-30.5).
- Same two-line block: cap 68, baselines 504.75 / 621.9, centred on x 957, the same rise curve, and the same per-glyph stagger formula (i runs over "Detail-driven" then "design").
- The badges stay brushed-chrome hexagons with identical geometry, 3D tilt and motion, re-skinned as WKC "detail stamps":
  - Logo slot: the WkcMark monogram (silver) instead of the Compliancy logo; "WKConversions" in Inter 600 instead of "Compliancy Group".
  - **Left badge (SOC 2 slot)**: band "TYPE", big embossed value "-0.05em", footer "✓ KERNED".
  - **Right badge (HIPAA slot)**: band "EASE", big value ".22 1 .36 1", footer "✓ TUNED". These are the studio's real brand specs, not claims.
  - Safe fallback if the client wants no specs: bands "DETAIL" and "DESIGN" with the monogram only.
- Badge face tinted toward ink (#0B1A2A brushed); bezel stays neutral chrome; outer glow #8DC0FF at 20%.
- Neon hexagon corners in #3F8CE8 with a #1B4FB8 glow, same paths and draw-on frames.
- "Detail-driven" is narrower than "Enterprise-grade", so the right badge no longer covers the last letter. That is fine; keep the badge in front of the text.

**T1 (907-913)**: the same pass-by wipe. The occluder is a giant defocused version of the same WKC chrome badge (grey, desaturated). Same edge positions per frame.

**Shots B-E: four beats on the reference's exact frames.** The script has three lines here, so use a build on the fourth beat (script words only):
- B 909-917: "Clear messaging" (cap 96, baseline 573.75, the same slide-in from x 1106 -> 957).
- C 919-930: "Smooth transitions" (cap 93, baseline 570.75, x drift 1000 -> 970).
- D 932-940: "Every frame" (cap 90, baseline 576, centre 958, slow scale-down).
- E 942-961: "Every frame intentional" (cap 78, centre (969, ~523), rise, then the pull-back to .737). About 1.1x wider than the reference line, so check that it stays inside 1920.
- Same negative-frame / ghost / blurred-rise swaps on 918-919, 931-932 and 941-942.
- The light-streak ring is unchanged in geometry and timing, recoloured to the WKC blues; read it as a motion path / easing curve, which suits "Smooth transitions".
- Bokeh tiles in E (948-961): blurred stills of WKC client clips (public/clips/*.jpg), desaturated about 60%, so they become the sharp tiles of shot F after the cut.

**Shot F (962-1002) -> "2 Founders," / "1 Studio"** (script 32.5-33.5).
- Cap 57, baselines 474.75 / 603.75, centred on x 930, the same per-glyph stagger, the same smear and chromatic-aberration cut-in, and the same per-layer zoom table.
- Tiles keep the same boxes, glass style (recoloured) and per-layer scales:
  - NatWest slot (365x389, right): **Karl van Kessel** portrait (karl-400.webp, cover crop, upper 75% of the tile), with "Karl van Kessel" in Inter 600 white where the "NatWest" wordmark sits (bottom, cap about 26 px).
  - Adobe slot (352x393, left, bottom off-frame): **Raphael Wind** portrait (raphael-400.webp), with "Raphael Wind" in the "Adobe" wordmark position.
  - Penn slot (wide): ClearScaler (clearscaler-16x9.jpg still, or its name in white Inter 600 on the glass).
  - Harvard slot (tall): Vendom (vendom-1x1.jpg).
  - clip slot (square, orange logo): VoxFlow (voxflow-9x16.jpg, centre crop).
  - Snapchat slot (icon + label): Creoble (creoble-9x16.jpg as the icon square, with the label "Creoble").
  - Verizon slot (wide): Malaga Hideaway (malaga-16x9.jpg).
  - Banco slot (wide, small): Robin Bos (robin-bos-16x9.jpg).
  - The four far bokeh tiles: K.B, Wicflow, bFound and Creoble-lovable stills, blurred about 20 px.
- Use stills, not playing video, at this tile size, so they read as logos and portraits. Never add client names that are not in clips.json.

**T5 (1002-1009)**: keep the portal ring and the crossfade curve (gains 1.00 / .84 / .65 / .48 / .31 / .16 / .07 / .02). The next segment brings "3" + "Formats for your website and socials" in place of "90%".

## 9. Appendix: measured per-frame tables

### T1 Shot A per frame (1080p). Title baseline = line-1 baseline y; dx = horizontal pan of the title block. Badge centre/rotZ/scale from SIFT homography tracking (scale relative to frame 895). HIPAA rows marked * are extrapolated (only its top edge is in frame).

| frame | title L1 baseline y | title dx | SOC2 centre (x, y) | SOC2 rotZ | SOC2 scale | HIPAA centre (x, y) | HIPAA rotZ | HIPAA scale |
|---|---|---|---|---|---|---|---|---|
| 866 | 606.1 | 0.0 | (292, 322) | -8.5° | 0.993 | (1704, 1213)* | ~20°* | ~1.04* |
| 867 | 589.3 | 0.0 | (296, 388) | -8.8° | 0.994 | (1704, 1135)* | ~19°* | ~1.04* |
| 868 | 578.8 | 0.0 | (298, 421) | -9.0° | 0.994 | (1704, 1068)* | ~18°* | ~1.04* |
| 869 | 570.8 | 0.0 | (299, 446) | -8.9° | 0.995 | (1704, 1011) | 17.3° | 1.015 |
| 870 | 564.0 | 0.0 | (300, 466) | -8.8° | 0.996 | (1704, 961) | 16.4° | 1.010 |
| 871 | 558.5 | 0.0 | (302, 484) | -8.5° | 0.996 | (1704, 919) | 15.7° | 1.017 |
| 872 | 553.9 | 0.0 | (302, 500) | -8.3° | 0.996 | (1704, 882) | 15.0° | 1.015 |
| 873 | 549.8 | 0.0 | (303, 513) | -8.1° | 0.998 | (1704, 848) | 14.2° | 1.014 |
| 874 | 545.5 | 0.0 | (304, 526) | -7.9° | 0.998 | (1704, 818) | 13.5° | 1.015 |
| 875 | 542.0 | 0.0 | (305, 537) | -7.6° | 0.998 | (1704, 791) | 12.8° | 1.014 |
| 876 | 538.5 | 0.0 | (305, 547) | -7.4° | 0.998 | (1704, 766) | 12.3° | 1.013 |
| 877 | 535.3 | 0.0 | (306, 557) | -7.0° | 0.998 | (1704, 744) | 11.6° | 1.012 |
| 878 | 532.4 | 0.0 | (306, 565) | -6.9° | 0.999 | (1704, 723) | 11.0° | 1.011 |
| 879 | 529.9 | 0.0 | (307, 573) | -6.6° | 1.000 | (1704, 703) | 10.4° | 1.011 |
| 880 | 527.4 | 0.0 | (307, 581) | -6.3° | 0.999 | (1704, 685) | 9.7° | 1.013 |
| 881 | 525.8 | 0.0 | (308, 588) | -6.1° | 1.000 | (1704, 669) | 9.1° | 1.011 |
| 882 | 524.1 | 0.0 | (308, 594) | -5.8° | 1.000 | (1704, 653) | 8.5° | 1.011 |
| 883 | 521.9 | 0.0 | (308, 600) | -5.4° | 1.001 | (1704, 639) | 8.0° | 1.010 |
| 884 | 520.2 | 0.0 | (308, 605) | -5.1° | 1.002 | (1704, 625) | 7.4° | 1.010 |
| 885 | 518.7 | 0.0 | (309, 610) | -4.9° | 1.002 | (1704, 613) | 6.9° | 1.008 |
| 886 | 517.0 | -0.3 | (309, 615) | -4.5° | 1.002 | (1704, 601) | 6.2° | 1.008 |
| 887 | 515.7 | -0.6 | (309, 620) | -4.2° | 1.001 | (1703, 590) | 5.6° | 1.006 |
| 888 | 513.9 | -0.9 | (308, 624) | -3.9° | 1.001 | (1703, 580) | 5.1° | 1.006 |
| 889 | 512.6 | -1.3 | (308, 628) | -3.6° | 1.001 | (1702, 571) | 4.5° | 1.005 |
| 890 | 511.8 | -1.8 | (308, 631) | -3.3° | 1.002 | (1702, 562) | 3.9° | 1.004 |
| 891 | 510.7 | -2.4 | (308, 634) | -3.1° | 1.002 | (1701, 554) | 3.4° | 1.003 |
| 892 | 509.7 | -3.2 | (307, 637) | -2.7° | 1.002 | (1700, 547) | 2.8° | 1.002 |
| 893 | 509.2 | -3.9 | (306, 640) | -1.4° | 0.999 | (1699, 540) | 2.3° | 1.002 |
| 894 | 508.3 | -5.1 | (306, 643) | -1.7° | 1.000 | (1698, 534) | 1.8° | 1.001 |
| 895 | 507.7 | -6.3 | (304, 645) | -1.8° | 1.000 | (1696, 528) | 1.2° | 1.000 |
| 896 | 507.1 | -7.6 | (303, 647) | -1.4° | 1.000 | (1695, 523) | 0.7° | 0.998 |
| 897 | 506.6 | -9.4 | (302, 649) | -1.2° | 0.999 | (1693, 518) | 0.2° | 0.998 |
| 898 | 506.2 | -11.3 | (300, 651) | -0.8° | 0.999 | (1690, 514) | -0.4° | 0.996 |
| 899 | 505.8 | -13.9 | (298, 652) | -0.6° | 0.997 | (1688, 510) | -0.9° | 0.995 |
| 900 | 505.3 | -16.9 | (296, 654) | -0.3° | 0.998 | (1684, 506) | -1.5° | 0.994 |
| 901 | 505.2 | -20.2 | (292, 655) | 0.0° | 0.998 | (1681, 503) | -2.0° | 0.993 |
| 902 | 505.0 | -24.4 | (289, 656) | 0.4° | 0.996 | (1676, 500) | -2.5° | 0.991 |
| 903 | 504.8 | -29.9 | (285, 657) | 0.7° | 0.995 | (1670, 498) | -3.0° | 0.990 |
| 904 | 504.7 | -36.5 | (279, 658) | 1.0° | 0.996 | (1663, 496) | -3.5° | 0.988 |
| 905 | 504.3 | -44.4 | (272, 658) | 1.3° | 0.994 | (1655, 494) | -4.0° | 0.986 |
| 906 | 504.8 | -55.0 | (263, 659) | 1.6° | 0.995 | (1644, 493) | -4.6° | 0.983 |
| 907 | 504.8 | -69.1 | (252, 659) | 1.9° | 0.995 | (1629, 492) | -5.2° | 0.980 |
| 908 | - | - | (236, 659) | 2.2° | 0.994 | - | - | - |

### T2 Shots B-E per frame (1080p). Text centre x from the bbox; centre y = middle of the cap band; scale = width / settled width; text peak L ~ opacity (bg 25 -> 0, 254 -> 1). Ring = ellipse fit to the violet streak pixels (rx/ry semi-axes, rot = major-axis angle, negative = rising to the right). From 937 rx is not observable (only partial arcs): use ~935. From 954 the bundle retracts; use the visible-arc bbox.

| frame | line | text centre x | text cap-band centre y | width (1080p) → scale | text peak L (≈opacity) | ring centre | ring rx / ry | ring rot | visible arcs bbox (x; y) |
|---|---|---|---|---|---|---|---|---|---|
| 909 | Semantic scoring | 1106 (from right edge; left part hidden by wipe) | 529 | occluded | 253 (1.00) | - | - | - | - |
| 910 | Semantic scoring | 1076 (from right edge) | 527 | occluded | 254 (1.00) | - | - | - | - |
| 911 | Semantic scoring | 1058 | 525 | 1170 → 1.000 | 255 (1.00) | (919, 586) | 661 / 34 | -3.2° | 516-1350; 589-637 |
| 912 | Semantic scoring | 1043 | 525 | 1168 → 0.999 | 255 (1.00) | (967, 559) | 896 / 96 | -5.3° | 420-1483; 445-685 |
| 913 | Semantic scoring | 1031 | 525 | 1168 → 0.999 | 255 (1.00) | (959, 564) | 903 / 125 | -7.0° | 396-1531; 412-730 |
| 914 | Semantic scoring | 1022 | 525 | 1170 → 1.000 | 255 (1.00) | (952, 568) | 904 / 152 | -8.6° | 288-1525; 373-771 |
| 915 | Semantic scoring | 1012 | 525 | 1168 → 0.999 | 255 (1.00) | (947, 572) | 908 / 176 | -10.1° | 310-1524; 345-808 |
| 916 | Semantic scoring | 1004 | 525 | 1168 → 0.999 | 255 (1.00) | (942, 574) | 910 / 198 | -11.5° | 498-1522; 316-817 |
| 917 | Semantic scoring | 998 | 525 | 1170 → 1.000 | 255 (1.00) | (941, 575) | 916 / 218 | -12.8° | 384-1528; 292-870 |
| 918 | - | - | - | - | 194 (0.74) | (942, 575) | 921 / 235 | -14.1° | 483-1540; 295-876 |
| 919 | Confidence thresholds | - | - | - | 144 (0.52) | (941, 574) | 923 / 250 | -15.1° | 426-1504; 285-910 |
| 920 | Confidence thresholds | 1000 | 534 | 1275 → 0.973 | 234 (0.91) | (942, 573) | 926 / 263 | -16.1° | 435-1543; 265-930 |
| 921 | Confidence thresholds | 996 | 528 | 1296 → 0.989 | 245 (0.96) | (942, 571) | 930 / 274 | -17.0° | 429-1546; 241-943 |
| 922 | Confidence thresholds | 991 | 526 | 1306 → 0.997 | 254 (1.00) | (945, 568) | 932 / 284 | -17.7° | 333-1545; 195-961 |
| 923 | Confidence thresholds | 987 | 525 | 1311 → 1.000 | 254 (1.00) | (948, 564) | 934 / 292 | -18.3° | 330-1543; 180-969 |
| 924 | Confidence thresholds | 984 | 524 | 1311 → 1.000 | 254 (1.00) | (949, 561) | 934 / 298 | -18.9° | 330-1522; 168-976 |
| 925 | Confidence thresholds | 981 | 524 | 1311 → 1.000 | 254 (1.00) | (952, 557) | 935 / 303 | -19.3° | 324-1522; 157-979 |
| 926 | Confidence thresholds | 979 | 524 | 1312 → 1.001 | 254 (1.00) | (955, 553) | 938 / 307 | -19.6° | 319-1519; 145-982 |
| 927 | Confidence thresholds | 976 | 524 | 1311 → 1.000 | 254 (1.00) | (959, 549) | 938 / 310 | -19.9° | 315-1515; 136-982 |
| 928 | Confidence thresholds | 974 | 524 | 1312 → 1.001 | 254 (1.00) | (962, 545) | 939 / 312 | -20.0° | 324-1515; 129-981 |
| 929 | Confidence thresholds | 972 | 524 | 1311 → 1.000 | 254 (1.00) | (965, 541) | 937 / 312 | -20.1° | 336-1513; 123-978 |
| 930 | Confidence thresholds | 970 | 524 | 1308 → 0.998 | 254 (1.00) | (970, 536) | 939 / 312 | -20.1° | 324-1519; 120-973 |
| 931 | - | - | - | - | 191 (0.72) | (973, 533) | 938 / 311 | -20.0° | 339-1545; 120-967 |
| 932 | PII redaction | - | - | - | 146 (0.53) | (987, 527) | 959 / 306 | -19.9° | 249-1486; 118-961 |
| 933 | PII redaction | 961 | 537 | 730 → 0.992 | 242 (0.95) | (992, 527) | 985 / 298 | -19.9° | 240-1447; 120-952 |
| 934 | PII redaction | 960 | 533 | 735 → 0.998 | 253 (1.00) | (971, 539) | 966 / 295 | -19.8° | 243-1461; 124-967 |
| 935 | PII redaction | 959 | 531 | 736 → 1.000 | 254 (1.00) | (983, 541) | 940 / 290 | -18.9° | 226-1465; 129-931 |
| 936 | PII redaction | 959 | 531 | 730 → 0.992 | 254 (1.00) | (975, 546) | 934 / 290 | -18.8° | 228-1434; 135-970 |
| 937 | PII redaction | 958 | 531 | 724 → 0.984 | 254 (1.00) | (966, 547) | ~935 / 289 | -18.3° | 252-1431; 145-958 |
| 938 | PII redaction | 958 | 531 | 718 → 0.976 | 254 (1.00) | (957, 551) | ~935 / 286 | -18.8° | 250-1423; 160-978 |
| 939 | PII redaction | 958 | 531 | 710 → 0.963 | 254 (1.00) | (927, 557) | ~935 / 291 | -17.8° | 252-1417; 168-958 |
| 940 | PII redaction | 958 | 531 | 704 → 0.955 | 254 (1.00) | (913, 559) | ~935 / 293 | -18.2° | 255-1422; 181-960 |
| 941 | - | - | - | - | 148 (0.54) | (894, 565) | ~935 / 294 | -18.8° | 264-1414; 183-979 |
| 942 | Prompt injection safe | - | - | - | 79 (0.24) | (922, 559) | ~935 / 294 | -19.1° | 234-1416; 157-979 |
| 943 | Prompt injection safe | 970 | 575 | 1022 → 0.962 | 247 (0.97) | (919, 560) | ~935 / 292 | -19.0° | 210-1426; 151-978 |
| 944 | Prompt injection safe | 969 | 563 | 1047 → 0.986 | 254 (1.00) | (907, 564) | ~935 / 291 | -18.8° | 280-1431; 145-973 |
| 945 | Prompt injection safe | 969 | 553 | 1059 → 0.997 | 254 (1.00) | (915, 559) | ~935 / 290 | -19.7° | 315-1426; 145-981 |
| 946 | Prompt injection safe | 969 | 546 | 1062 → 1.000 | 254 (1.00) | (913, 559) | ~935 / 287 | -19.6° | 219-1510; 123-979 |
| 947 | Prompt injection safe | 969 | 540 | 1062 → 1.000 | 254 (1.00) | (921, 553) | ~935 / 284 | -19.4° | 292-1527; 118-975 |
| 948 | Prompt injection safe | 969 | 536 | 1059 → 0.997 | 254 (1.00) | (901, 558) | ~935 / 279 | -19.3° | 247-1483; 123-970 |
| 949 | Prompt injection safe | 968 | 532 | 1054 → 0.993 | 254 (1.00) | (887, 558) | ~935 / 276 | -19.6° | 264-1438; 135-963 |
| 950 | Prompt injection safe | 968 | 530 | 1046 → 0.984 | 253 (1.00) | (877, 550) | ~935 / 275 | -20.3° | 208-1347; 142-955 |
| 951 | Prompt injection safe | 968 | 527 | 1036 → 0.976 | 252 (0.99) | (872, 549) | ~935 / 268 | -21.0° | 192-1330; 123-946 |
| 952 | Prompt injection safe | 968 | 526 | 1024 → 0.965 | 250 (0.98) | (872, 545) | ~935 / 261 | -21.0° | 213-1383; 127-937 |
| 953 | Prompt injection safe | 969 | 525 | 1011 → 0.952 | 247 (0.97) | (914, 523) | ~935 / 255 | -20.7° | 312-1333; 127-925 |
| 954 | Prompt injection safe | 969 | 524 | 996 → 0.938 | 243 (0.95) | see note (retracting) | see note (retracting) | see note (retracting) | 232-1342; 132-837 |
| 955 | Prompt injection safe | 968 | 523 | 980 → 0.922 | 238 (0.93) | see note (retracting) | see note (retracting) | see note (retracting) | 232-1360; 135-834 |
| 956 | Prompt injection safe | 968 | 523 | 962 → 0.905 | 232 (0.90) | see note (retracting) | see note (retracting) | see note (retracting) | 255-1366; 144-856 |
| 957 | Prompt injection safe | 968 | 523 | 940 → 0.886 | 226 (0.88) | see note (retracting) | see note (retracting) | see note (retracting) | 261-1375; 154-862 |
| 958 | Prompt injection safe | 968 | 524 | 916 → 0.863 | 224 (0.87) | see note (retracting) | see note (retracting) | see note (retracting) | 354-1342; 165-843 |
| 959 | Prompt injection safe | 969 | 524 | 882 → 0.831 | 223 (0.86) | see note (retracting) | see note (retracting) | see note (retracting) | 514-1357; 177-831 |
| 960 | Prompt injection safe | 969 | 524 | 843 → 0.794 | 219 (0.85) | see note (retracting) | see note (retracting) | see note (retracting) | 580-1161; 285-810 |
| 961 | Prompt injection safe | 968 | 526 | 783 → 0.737 | 195 (0.74) | see note (retracting) | see note (retracting) | see note (retracting) | 576-1219; 360-798 |

### T3 Shot F per-layer zoom scale s_i(t) about the frame centre (960,540) (1.000 = pose at frame 990; positions/boxes in section 5.3). Unmarked = measured (SIFT similarity, >=10 inliers); * = from the fit formula (section 5.4) or extrapolated.

| frame | text | penn | harv | clip | snap | veri | natw | adobe | banco |
|---|---|---|---|---|---|---|---|---|---|
| 962 | 1.608* | 1.695* | 1.770* | 1.538* | 1.494* | 1.792* | 1.681* | 2.227* | 1.472* |
| 963 | 1.542 | 1.616* | 1.699* | 1.488* | 1.442* | 1.710* | 1.587* | 2.085* | 1.414* |
| 964 | 1.472 | 1.547* | 1.634* | 1.443* | 1.396* | 1.637* | 1.507* | 1.960* | 1.364* |
| 965 | 1.409 | 1.486* | 1.576* | 1.401* | 1.357 | 1.571* | 1.449 | 1.849* | 1.319* |
| 966 | 1.362 | 1.435 | 1.523* | 1.354 | 1.318 | 1.512* | 1.376 | 1.752* | 1.282 |
| 967 | 1.325 | 1.385 | 1.475* | 1.336 | 1.288 | 1.460* | 1.324 | 1.666* | 1.246 |
| 968 | 1.288 | 1.341 | 1.431* | 1.307 | 1.254 | 1.413* | 1.280 | 1.590* | 1.214 |
| 969 | 1.258 | 1.304 | 1.392* | 1.264 | 1.228 | 1.370* | 1.245 | 1.523* | 1.184 |
| 970 | 1.230 | 1.271 | 1.356 | 1.250 | 1.206 | 1.332* | 1.214 | 1.463* | 1.162 |
| 971 | 1.207 | 1.242 | 1.325 | 1.214 | 1.187 | 1.299 | 1.188 | 1.410* | 1.144 |
| 972 | 1.186 | 1.218 | 1.294 | 1.188 | 1.168 | 1.265 | 1.165 | 1.363* | 1.128 |
| 973 | 1.168 | 1.194 | 1.263 | 1.174 | 1.153 | 1.242 | 1.146 | 1.321* | 1.112 |
| 974 | 1.151 | 1.174 | 1.237 | 1.158 | 1.137 | 1.216 | 1.127 | 1.284* | 1.099 |
| 975 | 1.135 | 1.156 | 1.214 | 1.141 | 1.123 | 1.190 | 1.112 | 1.250* | 1.086 |
| 976 | 1.120 | 1.140 | 1.193 | 1.120 | 1.110 | 1.165 | 1.098 | 1.220* | 1.077 |
| 977 | 1.107 | 1.125 | 1.175 | 1.111 | 1.098 | 1.150 | 1.086 | 1.194* | 1.068 |
| 978 | 1.095 | 1.109 | 1.157 | 1.105 | 1.088 | 1.133 | 1.074 | 1.169* | 1.057 |
| 979 | 1.084 | 1.097 | 1.137 | 1.087 | 1.078 | 1.118 | 1.064 | 1.148* | 1.051 |
| 980 | 1.073 | 1.083 | 1.123 | 1.088 | 1.068 | 1.104 | 1.055 | 1.128* | 1.044 |
| 981 | 1.064 | 1.074 | 1.109 | 1.068 | 1.060 | 1.091 | 1.046 | 1.110 | 1.035 |
| 982 | 1.055 | 1.064 | 1.094 | 1.053 | 1.051 | 1.078 | 1.039 | 1.091 | 1.032 |
| 983 | 1.046 | 1.052 | 1.079 | 1.041 | 1.044 | 1.066 | 1.032 | 1.080 | 1.024 |
| 984 | 1.038 | 1.044 | 1.066 | 1.024 | 1.037 | 1.055 | 1.026 | 1.068 | 1.020 |
| 985 | 1.031 | 1.036 | 1.053 | 1.031 | 1.031 | 1.044 | 1.020 | 1.050 | 1.015 |
| 986 | 1.024 | 1.027 | 1.041 | 1.015 | 1.024 | 1.033 | 1.015 | 1.040 | 1.012 |
| 987 | 1.017 | 1.020 | 1.030 | 1.018 | 1.016 | 1.025 | 1.010 | 1.031 | 1.007 |
| 988 | 1.011 | 1.012 | 1.020 | 1.008 | 1.008 | 1.016 | 1.007 | 1.020 | 1.003 |
| 989 | 1.005 | 1.006 | 1.011 | 1.003 | 1.006 | 1.010 | 1.003 | 1.009 | 1.002 |
| 990 | 1.000 | 1.000 | 1.000 | 1.000 | 1.000 | 1.000 | 1.000 | 1.000 | 1.000 |
| 991 | 0.995 | 0.994 | 0.992 | 0.999 | 0.994 | 0.990 | 0.996 | 0.991 | 0.996 |
| 992 | 0.990 | 0.988 | 0.981 | 0.991 | 0.991 | 0.986 | 0.994 | 0.984 | 0.996 |
| 993 | 0.985 | 0.983 | 0.974 | 0.988 | 0.986 | 0.980 | 0.993 | 0.978 | 0.993 |
| 994 | 0.981 | 0.978 | 0.966 | 0.980 | 0.980 | 0.974 | 0.991 | 0.970 | 0.992 |
| 995 | 0.977 | 0.973 | 0.959 | 0.973 | 0.979 | 0.969 | 0.990 | 0.965 | 0.991 |
| 996 | 0.973 | 0.968 | 0.950 | 0.969 | 0.974 | 0.963 | 0.988 | 0.957 | 0.990 |
| 997 | 0.968 | 0.963 | 0.942 | 0.966 | 0.969 | 0.956 | 0.985 | 0.949 | 0.987 |
| 998 | 0.963 | 0.957 | 0.933 | 0.962 | 0.964 | 0.948 | 0.981 | 0.941 | 0.984 |
| 999 | 0.956 | 0.949 | 0.925 | 0.948 | 0.957 | 0.939 | 0.976 | 0.930 | 0.980 |
| 1000 | 0.948 | 0.941 | 0.916 | 0.953 | 0.950 | 0.930 | 0.969 | 0.918 | 0.974 |
| 1001 | 0.940 | 0.932 | 0.900 | 0.949 | 0.941 | 0.919 | 0.961 | 0.907 | 0.969 |
| 1002 | 0.931 | 0.921 | 0.893 | 0.930 | 0.934 | 0.907 | 0.952 | 0.894 | 0.960 |
| 1003 | 0.920 | 0.911 | 0.879 | 0.912 | 0.927 | 0.891 | 0.938 | 0.880* | 0.952* |
| 1004 | 0.909 | 0.896 | 0.869 | 0.895* | 0.915 | 0.874 | 0.924* | 0.866* | 0.944* |
