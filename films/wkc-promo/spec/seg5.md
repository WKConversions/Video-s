# Segment 5b: reference frames 530-717 (17.67-23.93 s)
### "Publish" click, then a pull-back through three UI showcases

Analyst scope: frames 531-720. The hard cut into this segment is 529 -> 530, so frame 530 is included here. The hard cut out is 717 -> 718. Frames 718-720 already belong to the next scene; see section 0.

**Conventions**
- Every coordinate is in **1920x1080 film pixels**: the reference's 720p measurements are multiplied by 1.5. The origin is top-left, x points right and y points down.
- Frame numbers are reference frames, and the two films match 1:1 because both run at 30 fps. Frame n is n/30 s.
- "Scale" values are uniform scale factors unless the text says otherwise.
- Every value was measured from thresholded pixels, feature tracking (ORB + RANSAC similarity per frame) or luminance profiles. Values marked "est." are inferred, for example a 3D angle derived from a measured foreshortening.
- The reference has **no grain**: the high-pass std in flat areas is 0.4-0.7, which is only JPEG noise. It has **no vignette**.

---

## 0. Context: what enters and what leaves

**Frames 520-529, the end of the previous shot.** The tilted 3D "chatbot window + connector cards" scene keeps orbiting. Measured as a 2D approximation, the whole picture rotates clockwise by +0.25°/frame (521), +0.30 (523), +0.38 (525), +0.47 (527), +0.69 (528) and +0.94°/frame (529), so the orbit accelerates. It also translates up-left by about (-5..-13, -4..-12) px/frame at 1080p. Directional motion blur builds up over 527-529, smearing about 15-25 px at 1080p along the motion. Frame 529 is the last frame of that shot.

**529 -> 530 is a hard cut.** The next frame shows the pastel "Publish" scene, already populated (the button at scale 0.52 and the cursor in mid-air).

**717 -> 718 is a hard cut.** Frame 717 is the dashboard, heavily zoom-blurred while zooming out. Frame 718 is the next scene: a near-black background (#0E0B16-ish) with "Plug into any LLM" / "Connect to any Knowledge Base" and a ring of glossy logo tiles (Gemini, Claude, Meta, milvus, elastic, Pinecone, OpenAI, aws, deepseek) behind a thin violet arc. That scene starts zoomed-in and blurred with chromatic fringing on the tiles, then settles quickly: 718 is very blurred, 719 is legible, and 720-726 is a slow zoom-out. The headline types on: at 718-722 "Plug into any L..." is still incomplete and greyed on the right, and it reaches "LLM" at 724. That shot belongs to the next analyst. The camera language continues across this cut too, with an accelerating zoom-out and blur into the cut, then a fast zoom-out that settles.

---

## 1. Shot list

| # | Frames | Duration | Content | In | Out |
|---|---|---|---|---|---|
| 1 | **530-578** | 49 f | Pastel gradient, 3D purple "Publish" pill, glossy 3D cursor flies in, **click at 549-552**, stadium ripple rings plus speed streaks, background colour-swirl | hard cut (zoom-in "pop": button 0.52 -> 1, expo-out) | accelerating zoom-out (ease-in) of button/rings/cursor, cut |
| 2 | **579-605** | 27 f | Collage of product web screens in 5 columns, the plane **rotated 10° clockwise**, columns scrolling in alternating directions | hard cut **plus zoom-through**: plane at 2.51x with heavy radial zoom blur, fast pull-back (expo-out) | accelerating pull-back (expo-in) with light radial blur, cut |
| 3 | **606-648** | 43 f | Five floating phone screens ("Send Money" centre) on a pastel gradient, each at its own depth (parallax) | hard cut, **crisp** (no blur), fast pull-back expo-out | accelerating pull-back plus radial blur, cut |
| 4 | **649-717** | 69 f | Washed-out 3D dashboard (three panels) with two crisp 3D-tilted toasts "Report Is Ready!" whose body text types on; charts build in | hard cut plus strong blur on 649 (smear about 40-60 px), slower pull-back | accelerating pull-back plus heavy radial zoom blur 714-717, cut |

All four transitions are **hard cuts hidden inside a continuous camera pull-back**. Each outgoing shot accelerates its zoom-out (expo-in) and blurs. Each incoming shot starts already zoomed-in and decelerates its zoom-out (expo-out). The exception is 529->530, where the button pops in by scaling up.

---

## 2. SHOT 1 (530-578): "Publish" button, cursor click, ripple rings

### 2.1 Background
- **Static pastel mesh gradient from 530 to 553**: soft and fully blurred, with no visible blob edges. Measured 20x20 px averages on a 5x4 grid. Grid x = 60, 510, 960, 1410, 1860; grid y = 60, 300, 780, 1020.

| f 532 | x60 | x510 | x960 | x1410 | x1860 |
|---|---|---|---|---|---|
| y60 | #F5ADF7 | #E4C7F8 | #8EE2F7 | #74E3FA | #C6F4FA |
| y300 | #F4B4F8 | #EDCAFA | #A8E7F8 | #95E5FA | #D5F6FB |
| y780 | #D0B8F8 | #D2C4F8 | #B4C8F5 | #A9C0F4 | #DCE8F8 |
| y1020 | #A394F4 | #AEA2F5 | #9EAEF5 | #96A7F3 | #CDD7F9 |

  In words: pink-magenta at top-left, saturated cyan at top centre-right, near-white ice at the right, lavender-periwinkle at the bottom, and a pale centre.
- **Colour swirl from 554 to 578**: the colour field rotates **clockwise about the centre** by roughly 100-120° and accelerates (ease-in). The violet that starts at bottom-left climbs the left edge (it reaches top-left by 566), pink travels across the top to top-right (572), and cyan sweeps down the right side to the bottom-centre (572-578). Grid samples, same layout as above:

| f | row y60 | row y300 | row y780 | row y1020 |
|---|---|---|---|---|
| 560 | F3B0F7 FBC1FC B5E4FB 62DCF6 96EBF6 | E7B3FA E5C0FB A4DFF6 96F3FB 99EBF7 | 8D79F2 A3A0F4 98BAF0 ACD3FC DBEDF9 | 7059EE 878BF2 7D9BF5 91ADF2 E2ECFA |
| 566 | 927BF2 DDAAF9 E3BBFA 9EC5F9 9FE6FC | 846EF0 B8A2F7 B8CDF8 97E8FB 7CDDF6 | 736CF0 8294F1 83BCF2 7FE5F8 82DDF7 | 747BEF 778DF2 78A9F7 85D1F8 A3EDF9 |
| 572 | 7172F0 8E89F4 BDA0F7 DF9EF7 EFC2F7 | 838DF0 8493F2 BEB5F7 DBB1FA DDBCF7 | 88A1F2 70A3F2 77CDF5 98C3F8 BDBCF6 | 87A6F2 7FBAF8 81DBFB 8CD8F7 ADCCF9 |
| 578 | A69BF6 B5ADF8 8CC0FA 74BCF8 809BF4 | BEBBFB 92A1F8 7FB6F3 92C5FA 7D8AF3 | A2C3FA 6FA3F6 89ACF4 A7A1F8 B193F9 | 7690F3 7997F7 90A2F7 A19FF3 B194F3 |

- **Soft halo ring, 536-560**, a refraction-like shockwave behind the button. It is a blurred circular band centred near **(852, 518)** with **radius about 545 px** (it touches the top edge). The band is about 90 px wide with a Gaussian falloff (sigma about 30 px). It brightens the background by +20..+26 luminance, roughly white at 10-12 %, and has a faint darker band (-5 lum) just inside it. It fades in over 536-537. Its brightest arc **travels counter-clockwise**: bottom at 538, right at 540-542, top-right at 544, top at 546, top-left at 548-552. That is about 22°/frame until 548, after which it barely moves. The ring fades out over 556-562 while the background swirls.

### 2.2 Element: the 3D "Publish" pill button
- **Shape:** a stadium (full pill, radius = h/2) extruded into a slab.
- **Front face:** flat **#513ADF**. Measured samples are #513AE2 at the top and #503ADB at the bottom, so there is no visible gradient.
- **Side wall (extrusion):** near-white lavender **#F6F1FF**, with a 1-1.5 px darker violet back-edge outline at about 55 % luminance (#5A50B8-ish).
- **Size at scale 1** (frame 548, settled): **750 x 274 px**, centre (952, 541). Peak size (560-562) is **778 x 282**.
- **Label "Publish":**
  - Colour #FFFFFF.
  - Font: geometric grotesk with a high x-height (DM Sans-like), Medium 500, sentence case, tracking 0.
  - Cap height: **88 px** at scale 1. Measured as 90 px at scale 1.027: "P" spans 60 px and "u" 44 px (x-height) at 720p. That gives **font-size ≈ 124 px** (≈ 120 px if set in Inter).
  - Text width "Publish" = 405 px at scale 1.
  - The text block is centred on the face: cap-centre = face centre.
- **Layering, back to front:** background, halo ring, ripple rings, button, cursor.

**Button animation**: the full per-frame table is T1. Scale is the face height divided by 274.5.

| f | 530 | 531 | 532 | 533 | 534 | 535 | 536 | 537 | 538 | 540 | 542 | 545 | 548 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| scale | 0.519 | 0.667 | 0.749 | 0.792 | 0.836 | 0.869 | 0.902 | 0.918 | 0.940 | 0.967 | 0.984 | 1.000 | 1.000 |

- **Entrance easing:** expo-out, fit by `s(n) = 1 - 0.48 * 0.78^(n-530)`. The half-life is 2.8 frames, and the curve starts at 0.52 on the cut frame; there is no 0-scale start.
- **3D swing-in (est. from face foreshortening):**
  - rotateY eases from **≈ 42° at 530 to 0° at 556** (the left side faces the camera; CSS `rotateY(+θ)` with perspective ≈ 1600 px).
  - Fit: `θ(n) = 42° * 0.5^((n-530)/8)`, which is expo-out with an 8-frame half-life.
  - A small rotateX of ≈ -6°, decaying the same way, shows a sliver of the bottom side wall.
  - Visible side-wall width at 1080p: 532: 21 px, 533: 20, 534: 18, 535: 15, 536: 12, 537: 12, 538: 10, 539: 9, 540: 9, 541: 7, 542-543: 5, 545: 3, 548: 2, 551+: 0.
  - Face centre x drifts with the swing: 946 (531-536), 948 (539), 951 (544), 953 (548), 956 (553), 958 (560), 960 (570+). Face centre y is constant at 541.
- **Click press:** 551: 0.989, **552: 0.962** (the deepest point), 553: 0.984, 554: 1.000.
- **Release overshoot:** 555: 1.011, 557: 1.022, **560-562: 1.027**.
- **Exit:** a group zoom-out that applies to the button, rings and cursor together. It is ease-in, with the log-scale velocity roughly doubling every 3 frames. Measured per-frame width ratios: 571: 0.988, 572: 0.985, 573: 0.983, 574: 0.982, 575: 0.974, 576: 0.965, 577: 0.953, 578: 0.917. Scales: 565: 1.016, 567: 1.000, 570: 0.978, 572: 0.956, 574: 0.918, 576: 0.863, 577: 0.825, **578: 0.754**.

### 2.3 Element: the glossy 3D cursor
- **Shape:** the classic pointer arrowhead with no tail (a kite with a concave notch), extruded about 10 px deep.
- **Geometry at scale 1** (frame 546; this is its "rest" pose, nearly frontal): tip **(1050, 564)**, right wing (1196, 638), bottom wing (1098, 731), inner notch (1130, 668). Bounding box 132 x 168. Hotspot = tip.
- **Fill:** a vertical-diagonal gradient from **#161527** at the tip to **#3D3B4E** at the lower right, satin and glossy.
- **Edges:** a crisp **white bevel highlight** about 2-3 px wide along the long left edge and the right-wing edges, plus a soft white outer glow of about 6 px.
- **Visual pose:** at 546 a slight tilt makes it look 3D, with the extrusion showing as a white rim on the left edge.
- **Per-frame path:** table T2 (bbox and centroid; the centroid is the most reliable position while it spins).
- **Fly-in, 530-546:**
  - It appears in-frame at the cut, small: scale ≈ 0.38 (by area) at 530 and **0.35-0.47 over 531-534**. It reaches 0.71 at 537, 0.86 at 540 and 1.0 at 544.
  - It swoops along an arc: centroid **(1105,387) at 530** -> (1175,430) at 531 -> (1212,453) at 532 -> (1217,496) at 533 -> (1218,534) at 534 -> (1213,566) at 535 -> (1201,584) at 536 -> (1189,598) at 537 -> (1176,614) at 539 -> (1159,630) at 540 -> (1132,641) at 542 -> (1108,637) at 544 -> **(1100,627) at 546**. In words: down the right side of the button, then hooking left onto the "sh" of "Publish".
  - It **tumbles about its own vertical axis** during the flight. Est. pose rotateY: 530: ≈180° (mirrored, motion-blurred at 531), 532-534: ≈270° (edge-on, only 40-46 px wide), 535-536: ≈300°, 537-539: ≈330°, 540+: ≈355-360° (frontal with a residual tilt).
  - The tumble and the scale-up are both expo-out and land together at 544-546.
- **Click:**
  - 547-548: tiny pre-move (centroid +3..+9 px x).
  - **549-550: press.** The cursor shrinks to **0.82** (area-based scale at 550) and its tip dips about +15 px x, +27 px y.
  - 551-553: release back to 1.0.
  - The button press follows 1-2 frames later (551-552). **Sound: click at frame 550.**
- **Exit, 553-574:** an ease-in-out arc to the upper right. Centroid: (1125,632) at 553, (1144,617) at 554, (1174,600) at 555, (1213,580) at 556, (1257,559) at 557, (1301,541) at 558, (1346,527) at 559, (1389,513) at 560, (1430,497) at 561, (1468,482) at 562, (1502,466) at 563, (1532,451) at 564, (1560,437) at 565, (1584,423) at 566, (1604,411) at 567, (1620,400) at 568, (1632,392) at 569, (1641,384) at 571, **(1656,385) at 573**. The peak speed is ≈ 45 px/frame at 557-559, and it decelerates to 0 by 573.
  - At the same time it makes a **half turn about its vertical axis**: 553: 10°, 555: 35°, 557: 60°, 559: 80°, **560-561: 90° (edge-on, 30 px wide)**, 562: 110°, 564: 140°, 566: 160°, 569+: **180°**, which is a mirror image with the tip at top-right.
  - 574-578: it follows the group zoom-out toward the centre: (1655,384) at 574, (1648,382) at 575, (1634,381) at 576, (1609,382) at 577, (1560,386) at 578. Its scale falls to ≈0.68 at 578, and a radial blur of about 8 px appears at 577-578.

### 2.4 Element: ripple rings (stadium outlines), 550-578
- **Count and shape:** four concentric outlines with exactly the button's shape (stadium, aspect w/h = **2.76**). They are centred on the button face centre (958-960, 541).
- **Spawn:** each ring is born at the button outline (half-height ≈ 141) at **550.0, 552.9, 555.6 and 558.4**, i.e. every ≈2.8 frames.
- **Growth:** about **+14.5 px/frame of half-height** (+40 px/frame of half-width), linear, until about 570. After that it is cancelled by the group zoom-out. Measured half-heights are in table T3; the half-width is 2.76 x the half-height. Ring spacing settles at ≈ 38-42 px (vertical) between neighbours.
- **Stroke:**
  - Core: white, **≈ 4 px** at 1080p, luminance 245-254.
  - Glow: soft, ≈ 6-8 px each side, white at about 40 % falling to 0.
  - Opacity fades in over the first 2 frames.
  - Brightness distribution:
    - The **bottom straight run** is complete and brightest, and takes a cyan-white glow once the background turns cyan (564+).
    - The **curved ends** are medium.
    - The **top straight run** is drawn broken, as one or two streak segments with gaps (see the speed streaks below). The right curved end of each ring is faint or partly missing.
- **Speed streaks**, from 552 and strongest at 566-578: the rings' top runs read as long horizontal light streaks.
  - 552-558: only short bright segments of the top runs are drawn, on the right half above the button (x ≈ 860-1440 at 556).
  - 566: a long left segment (x ≈ 150-1035) and a separate right segment (x ≈ 1350-1770) per ring, with a gap between them.
  - 572-578: the top runs at y ≈ 90, 125, 160 and 200 (at 574) run from the frame's left edge to 50-95 % of the frame width.
  - Each segment has a bright core that fades to transparent at its ends, so the rings read as motion lines streaming out of the click.
- **Motion blur:** none until 576. At 577-578, radial smear is about 6-10 px.

### 2.5 Camera (shot 1)
No global camera move apart from the **group zoom-out of button, rings and cursor**, which starts at about 562 and accelerates into 578 (see 2.2). The background is not scaled.

---

## 3. SHOT 2 (579-605): rotated collage of product screens

### 3.1 Structure
- **Plane:** a flat plane of portrait columns of rounded "web screen" cards. It is **rotated +10.0° (clockwise) about the frame centre (960, 540)**. Measured with Hough lines on 585, 595 and 605: horizontals 10.0°, verticals 100.0°. There is **no perspective**, and the rotation is constant through the shot.
- **Layout at frame 605 (scale 1.000):** in the plane's own unrotated coordinates, at 1080p, relative to the frame centre (x right, y down). Rotate by +10° around (960,540) to place it on screen.

| column | type | x range | content (reference) | scroll |
|---|---|---|---|---|
| C1 | wide | -942 .. -497 (w 445) | stacked landing-page cards: features card (stats "15k+ 30k 10k", "Some Excellent Features For You") ... -216; dark "A CRM dashboard for engineering teams" -193..143; white "Our Valuable Team Member" with 3 avatars and a purple "Subscribe To Our Newsletter" banner 166..≈510; features card 528.. | up |
| C2 | narrow | -476 .. -147 (w 329) | ONE tall white chat panel (slothpilot): audio-message bubble (violet), long article text, violet "External Link Title" bubble at ≈102..203, reply text, icon row, "..." violet pill, input "Message to slothpilot..." | down |
| C3 | wide | -129 .. 317 (w 446) | cards (each 341 tall, gap 20): dark hero "Here's what our customer has to says" (green accent) ...-308; "Some Excellent Features For You" with green phone -288..53; "Supply Chain Optimization / Pricing Plan" 74..413; dark hero again 435.. | up |
| C4 | narrow | 333 .. 662 (w 329) | ONE tall white article panel: "Do androids dream of electric sheep or not? Explained in E...", Sources, Answer, Future Possibilities, input "Ask a follow up" | down |
| C5 | wide | 680 .. 1125 (w 445) | team-photo card ...-383; dark "Features work for your future / Analytics Dashboard" -377..-23; "Our Co-Founders" + "Webdesigner News" -5..338; next card 358.. | up |

- **Grid metrics:** column gutters 15 px. Vertical gaps between cards are 18-22 px. Card radius ≈ 15 px. Cards are white #FFFFFF (light cards) or near-black navy #0A0B28-#160929 (dark hero cards). Through the gutters a faint cool rim-light shows along card edges.
- **Behind the plane:** the same pastel gradient. At 605 it is pink #ECACF6 at top-left and blue-violet #8F9CF4-#A890D9 in the gutters.
- **Columns tile vertically** (C3 repeats its dark hero card), so build them as long loops.

### 3.2 Animation
- **Zoom (camera) about the frame centre**, measured per frame. Horizontal residual motion of every column is 0 ± 0.3 px after removing the zoom, which confirms the frame centre as the zoom origin. Scale relative to 605 (full table T4): 579: **2.507**, 580: 2.162, 581: 2.004, 582: 1.882, 583: 1.787, 584: 1.709, 585: 1.644, 590: 1.433, 595: 1.316, 600: 1.213, 602: 1.157, 603: 1.119, 604: 1.070, **605: 1.000**.
- **Per-frame ratios:** 580: 0.862, 581: 0.927, 582: 0.939, 583: 0.950, 584: 0.956, 585: 0.962, 586: 0.966 ... 594-598: 0.985 (slowest) ... 601: 0.979, 602: 0.975, 603: 0.967, 604: 0.956, 605: 0.935.
  - Entrance: expo-out decay of zoom velocity; the excess log-velocity above the drift halves about every 3 frames (log-velocity -0.148 at 580, -0.076, -0.063, -0.052, -0.045, -0.039, -0.034 ...).
  - Middle: steady drift of -1.5 %/frame.
  - Exit: expo-in.
- **Column scroll, constant in plane units (1080p at 605 scale):**
  - Wide columns C1/C3/C5: **-6.0 px/frame (upward)**.
  - Narrow columns C2/C4: **+2.9 px/frame (downward)**.
  - On screen these speeds are multiplied by the current zoom. Measured: up columns -7.6 px/f at 582 down to -4.0 at 605; down columns +3.7 down to +1.9, both at 720p.
  - The offset relative to 605 is linear: wide = -6.0·(n-605) and narrow = +2.9·(n-605). At 579, wide columns sit 156 px lower and narrow columns 75 px higher.

### 3.3 Motion blur
- **579:** heavy radial zoom blur, with smear proportional to the distance from centre, ≈0.12 x r (≈60-90 px at frame edges). The text is unreadable.
- **580:** ≈0.05 x r (20-40 px at the edges).
- **581:** ≈8-10 px at the edges.
- **582-602:** sharp.
- **603-605:** light radial smear, 4-10 px at the edges.

---

## 4. SHOT 3 (606-648): floating phone screens, "Send Money"

### 4.1 Background
An animated pastel gradient with nothing over it except the phones. At 606 it is sky/cyan #8DD0F9 / #ABE0FA / #8FE8FA at the top, pink #E5BCFC at the top-left of centre and violet #6E53EE at the bottom-left. By 630-648 it drifts to lilac #A9A8F6 / #9BA8F6 (top-left), cyan #60B5F5 / #7BB4F9 (top-right) and violet #6C55EE / #6D80F0 (left). The blobs drift slowly, by roughly 10-20 px/frame at 1080p.

### 4.2 Elements
Five flat phone screens with portrait ratio **1 : 2.165** (390 x 844), no device bezel, corner radius ≈ 0.045 x w, and a soft shadow (est. 0 20px 60px rgba(40,20,120,0.18)). They have no rotation. **Each has its own scale and position track** (parallax), listed in table T5 as centre-x, top-y and width per frame. Geometry at frame 635:

| id | reference content | box @635 (x0..x1, y0..y1) | w |
|---|---|---|---|
| SEND (centre, largest) | violet header #360088 -> #2F007B (header height ≈ 0.34 w); status bar "09:41" plus signal/wifi/battery; back chevron in a rounded square; title "Send Money" (white, semibold, cap ≈ 0.033 w); white sheet with radius-top corners holding a contact row (avatar, "Clarissa Bates", "Bank - 0002 1887 2532", chevron), big amount "$120.24" (ink #111, cap ≈ 0.085 w) and keypad digits "1 2 3 / 4 5 6 / 7 8 9" | 758..1285, 422..1572 | 527 |
| CHART (upper left) | "Statistic" screen: "$21,350.54", "Overview / Month", 7-month bar chart (ink and violet bars), two cards "Income $18,548.99" (dark) and "Expense $1,445.93" (violet #7B2FF7), tab bar with violet FAB | 411..707, -105..534 | 296 |
| CONTACTS (upper right) | list "Recent Contact": Angelina Johnson, Johan Crafton, Ariana Marnisa (more above: Mark Johnson, Anisa Bella), each with "Bank - ..." sublines; home indicator | 1152..1564, -565..330 | 412 |
| WALLET (lower left) | violet header with avatar and bell, "Available Balance $450.54", 4 action icons (Top Up, Send, Request, History), "Payment List" grid of 8 coloured icons | -33..370, 574..1452 | 403 |
| RECEIPT (right) | violet header "Receipt", green check badge, "Transfer Successful", detail rows, "See Detail", violet "Done" button | 1658..2037, 280..1091 | 378 |

Layering: all five sit on one level with no overlaps. The SEND phone is the farthest away: it has the smallest scale change, while the outer phones scale and slide more.

### 4.3 Animation (camera pull-back with per-element parallax; see table T5)
- **SEND width:** **606: 1035**, 607: 905, 608: 848, 609: 807, 610: 773, 611: 747, 612: 722 ... 620: 603, 630: 544, 640: 505, 644: 473, 645: 463, 646: 450, 647: 433, **648: 408**.
- **SEND per-frame ratios:** 0.874, 0.937, 0.952, 0.958, 0.966, 0.967 ... about 0.99 at 625-640 ... 0.979, 0.979, 0.972, 0.962, 0.942. That is expo-out in, a slow drift, then expo-in out.
- **SEND top edge:** stays at y ≈ 418-447 throughout. The phone is anchored near its top while it shrinks.
- **CHART:** moves right and down (cx 219 -> 638, top -237 -> +22) while shrinking (551 -> 234).
- **CONTACTS:** enters from above the frame at about 613 and slides down-left (cx 1559 -> 1263, top -1202 -> -294).
- **WALLET:** enters from the left at about 613 (cx -194 -> 350).
- **RECEIPT:** enters from the right at about 613 (cx 2107 -> 1696, top 164 -> 340).
- **Camera fixed point:** close to the frame centre horizontally (x ≈ 955-965) and at y ≈ 450-500.
- **Motion blur:**
  - **606-607 are crisp**, with no blur on the cut.
  - 608-643: sharp.
  - 646: ≈4 px radial at the edges; 647: ≈8 px; **648: ≈15-20 px radial at the frame edges**. The SEND phone stays sharp.

---

## 5. SHOT 4 (649-717): dashboard and "Report Is Ready!" toasts

### 5.1 Background and back layers
- **Background gradient (690):** lilac #9AA7F5 (top-left), sky #8BBDF3 (top), #97BCF5 (top-right), pink-violet #C697F5 (bottom-left), violet #6986F1 (bottom-right), and #97A1F3 / #B789F5 at the bottom.
- **Centre dashboard panel**, the back layer. At **690** it occupies **x 432..1476, y 57..1011 (1044 x 954)**, with radius ≈ 14 px and centre (954, 534).
  - Light UI washed with violet: panel background reads #D5D1F2 to #DACBF4. This is roughly a white panel at about 75 % opacity over the gradient, or a 25 % lavender wash.
  - Content (reference): logo plus "Dashboard", "Overview", search, icons and avatar; sidebar "Dashboard, ..., My Privileges, Setting"; "My Cards" (blue card with "$5,756", "Eddy Cusuma", "12/22", "3778 **** **** 1234"); "Recent Transaction" (3 rows); bar chart "Deposit/Withdraw" with 7 days x 2 bars (blue #7474E2 and teal); "Expense Statistics" pie (30 % Entertainment, 15 % Bill Expense, 20 % Investment, 35 % Others); "Quick Transfer" (3 avatars, "Send" button); "Balance History" line chart.
  - **Chart build-in:**
    - Bars grow from the baseline, staggered left to right about every 2 frames from 650. Each bar takes ≈8 frames with an expo-out; all are complete by ≈678.
    - Pie slices pop in, each scaling from the pie centre over ≈3-4 frames: orange 15 % at 650, blue 30 % at 653, magenta 20 % at 656, violet 35 % at 659. All are complete by 662.
- **Left panel** (dark analytics card, behind): at 690 it spans **x ≈ -60..327, y ≈ 174..866**. It is darkened and washed (avg #7C689F), with "12 / New Customer", percentage chips, "Last Month $4,087 / $5,506" and a white area chart.
- **Right panel** ("Promage" dashboard): at 690 it spans **x 1598..≈1990, y ≈ 175..≈900**, with a dark slate sidebar #3B5881 ("Create new project", nav list) and light content #A2B6D9 ("Dashboard / Overview / $53,00989 / Project summary").
- Both side panels follow approximately the centre panel's camera scale, at about 0.9-1.0 times its rate.

### 5.2 Toasts (front layer, crisp, 3D-tilted toward the centre)
**DARK TOAST (left).**
- Fill **#080A13**.
- Corners at 690: TL (80,220), TR (908,252), BL (75,510), BR (924,514). Size ≈ 840 x 290 px, radius ≈ 10 px.
- Est. tilt with perspective 1600 px: **rotateY +11°** (right edge farther; the right edge is 175 px tall against 193 px for the left edge at 720p), **rotateX +8°** (top edge farther; top width 552 vs bottom 566 at 720p), and rotateZ ≈ +1°.
- A thin lighter edge shows the slab thickness.
- Contents:
  - **Checkbox** at (138..212, 284..353): a 74 x 70 rounded square (radius ≈ 8), fill **#513BDC**, with a white check stroke ≈ 4 px.
  - **Title "Report Is Ready!"** at x 262: white #FEFEFF, DM Sans SemiBold 600, cap height **30 px** (font-size ≈ 43 px), baseline y ≈ 318.
  - **Body**: white #FEFEFF at about 92 %, DM Sans Regular 400, cap height **24 px** (font-size ≈ 34 px), x-height 18, line pitch **48 px**, x 262. Two lines: "Please check the attached file or" / "access it via the provided link."
  - **Close "x"**: thin 1.5 px strokes, 22 x 22, grey #9A9AA8, at (836..858, 308..330).

**WHITE TOAST (right).**
- Fill **#F7F5FA**, with a **2-3 px violet rim (#5A3FE0) along the left and bottom edges**, which is the slab side visible because of the tilt.
- Corners at 690: TL (1005,642), TR (1888,652), BL (991,951), BR (1894,994). Size ≈ 895 x 320 px, radius ≈ 12 px.
- Est. tilt: **rotateY -10.5°** (right edge closer: 228 vs 206 px tall at 720p), **rotateX +6°**, rotateZ ≈ +1.5°.
- Contents:
  - **Checkbox** 63 x 66, fill **#573DE1**, white check.
  - **Title "Report Is Ready!"**: **#181720**, DM Sans SemiBold, cap height 28 px.
  - **Body**: **#2B2930**, DM Sans Regular, cap height 22 px, x-height 16, line pitch ≈ 46 px. Three lines: "Let us know if you need any further" / "assistance or would like to generate" / "an updated version."
  - **Close "x"**: 28 x 28, grey #B0AEB8.

**Typing.** Both titles are complete from the first frame (649). Only the bodies type on, with no caret visible. Counts below are characters shown, spaces included.
- DARK body (66 chars): 650: 10, 651: 15, 652: 21, 653: 28, 654: 33, 655: 37, 656: 40, 657: 43, 658: 46, 659: 47, 660: 50, 661: 51, 662: 53, 663: 54, 664: 56, 665: 57, 666: 58, 667-668: 59, 669-670: 60, 671-672: 62, 673-674: 63, 675-677: 64, 678-681: 65, **682: 66 (done)**.
  - This is **ease-out**. Fit: `n(f) = round(66 * (1 - 0.895^(f-648.5)))`, which is exponential with a 6.3-frame half-life, starting at the cut.
- WHITE body (92 chars): 650: 6, 651: 10, 652: 14, 653: 17, 654: 21, 655: 23, 656: 27, 657: 31, 659: 38, 660: 42, 661: 45, 662: 49, 663: 52, 664: 55, 665: 59, 666: 62, 667: 66, 668: 69, 669: 72, 670: 75, 671: 80, 672: 83, 673: 87, 674: 91, **675: 92 (done)**.
  - This is **linear at ≈ 3.45 chars/frame** (103 chars/s), starting at 648.3.
- Line wrap follows the final layout; characters appear in place and never reflow.

### 5.3 Animation and camera
- **Centre panel scale** relative to 690, measured from its left and right edges. The zoom is about the frame centre, and the panel centre stays at x ≈ 954, y ≈ 534.

| f | 649 | 650 | 651 | 652 | 653 | 654 | 655 | 656 | 658 | 660 | 665 | 670 | 675 | 680 | 685 | 690 | 695 | 700 | 704 | 708 | 710 | 712 | 713 | 714 | 715 | 716 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| s | ≈1.245 | 1.220 | 1.197 | 1.182 | 1.167 | 1.154 | 1.141 | 1.133 | 1.115 | 1.098 | 1.065 | 1.043 | 1.028 | 1.014 | 1.006 | 1.000 | 0.986 | 0.969 | 0.952 | 0.929 | 0.915 | 0.895 | 0.881 | 0.866 | 0.849 | 0.818 |

  The entrance is a gentler expo-out (ratio 0.980/frame at 650 rising to 0.997 by 685). The slowest point is 685-690. The exit is expo-in (0.994 at 700, 0.985 at 712, 0.964 at 716, and ≈0.87 at 717).
- **Toasts** move more than the panel because they are nearer the camera. Corner positions per frame are in table T6.
  - DARK toast: its centre slides right, x ≈ 333·1.5 = 500 at 690 rising to 566·1.5 = 849 at 717. Its bottom edge stays at y ≈ 510-526, it is only slightly smaller (width 849 at 690 down to 586 at 717), and its top edge drops 220 -> 327.
  - WHITE toast: its centre slides left, 1443 -> 1088. Its top edge stays at y ≈ 615-648.
  - Both toasts converge on the frame centre throughout the shot. They shrink at about the panel's rate (690->713: toast width x0.90, panel x0.88), but they travel inward much faster than a pure zoom about the centre would move them: the dark toast's centre goes 500 -> 703 at 690->713, where a zoom alone predicts 555. Animate them as their own layers and treat T6 as the exact source.
- **Motion blur:**
  - **649:** a strong blur. It is mostly horizontal and radial, smearing ≈40-60 px (1080p) at the edges; the toasts read as bars and the text is illegible.
  - 650: ≈10-15 px. 651: ≈5 px. 652-711: sharp.
  - Exit: 712: 3-5 px radial; 714: ≈8 px; 715: ≈12 px; **716: ≈20 px; 717: ≈40-60 px** radial zoom blur.

---

## 6. Sound sync (reference events)
| frame | event | suggested SFX |
|---|---|---|
| 530 | cut, button pops in (scale 0.52->1), cursor appears | soft "pop" or whoosh-in |
| 530-537 | cursor tumbling flight | short airy whoosh (cursor spin) |
| 537-538 | halo ring blooms behind the button | subtle shimmer swell |
| **550** (551-552 button press) | **CLICK** (cursor press 549-550, button bottom-out 552) | crisp UI click |
| 550-559 | rings spawn at 550, 553, 556, 559 | layered shimmer/sonar ripple, 4 hits or one rising swell |
| 553-561 | cursor half-turn and fling to upper right | small whoosh |
| 562-578 | colour swirl plus accelerating group zoom-out | rising whoosh into the cut |
| **579** | cut into the collage (zoom-through) | whoosh impact / transition hit |
| 603-606 | accelerating pull-back, **cut at 606** | whoosh |
| 645-649 | accelerating pull-back, **cut at 649** | whoosh |
| 649-651 | toasts present | notification "ding" (two-tone) |
| 650-682 | body text typing (white linear to 675, dark easing to 682) | soft keyboard ticks, about 1 per 2 frames, thinning out |
| 650-662 | charts build (pie slices 650/653/656/659) | optional tiny ticks |
| 712-718 | accelerating pull-back, **cut at 718** | big whoosh into the next scene |

---

## 7. WKC ADAPTATION (keep every size, position, timing and motion above; change only content and colours)

**Global recolour.** The pastel gradients become WKC blues, keeping the same relative lightness.

| reference colour | WKC replacement |
|---|---|
| pink #F5ADF7 / #F4B4F8 | #D9E9FC |
| light lilac #E4C7F8 / #EDCAFA | #E6F0FD (soft highlight) |
| cyan #74E3FA / #8EE2F7 | #8CC4F4 |
| ice #C6F4FA / #DCE8F8 | #EEF5FE |
| periwinkle #9EAEF5 / #A9C0F4 | #A9CBF3 |
| violet #A394F4 / #9D8BF1 | #6FA6EC |
| deep violet #7059EE / #6E53EE | #3F8CE8 |

UI purples become WKC blue: button and checkbox #513ADF become **#3F8CE8**, phone headers #360088 become **#1266C9 -> #0B4E9E**, and violet rims become #1266C9. The dark toast #080A13 becomes ink **#050F19**, the white toast #F7F5FA becomes page **#F7F7F8**, dark text becomes #050F19, and grey body text becomes #575E68. Fonts: UI labels and toasts use **Inter** (titles 600, body 400), and any headline uses Inter Tight 800 at -0.05em. All radii are as measured; where a WKC radius fits, use 10/16/26/34.

**Shot 1 (530-578), "Export" button** (script 18-19.5 s "Export"; the reference shows it from 17.67 s, so keep the reference frames).
- Same 3D slab pill, 750 x 274 at scale 1, centre (952,541), same swing-in, press and overshoot curves.
- Face colour #3F8CE8, with an optional 6 % top-to-bottom lightness gradient (#4A95EC -> #3A86E2).
- Side wall #E6F0FD with a #1266C9 1.5 px back edge.
- Label **"Export"** in Inter 600, white, cap height 88 px (≈121 px font-size), centred.
- Cursor: same glossy arrowhead in ink #050F19 -> #1B2633 with a white bevel.
- Rings and speed streaks: white core with a #E6F0FD/#8CC4F4 glow.
- Halo ring and swirl: same geometry and timing with the blue palette.
- The label stays static: no icon swap and no text change on click.

**Shot 2 (579-605), collage of real WKC work** (script 19.5-24 s: showcase of finished client videos, no headline). Keep the 10° plane, five columns with the same widths, card sizes, scroll speeds and zoom table.
- **Wide columns (C1, C3, C5)** use 446 px-wide cards. Each card is a **16:9 client clip** (446 x 251, playing muted from its `start`) above a white caption strip ≈ 90 px tall, giving 341 px total. The strip carries the client name in Inter 600 22 px ink, a format chip ("16:9", pill, #E6F0FD fill, #1266C9 text, Inter 600 16 px) and a thin progress bar in #3F8CE8.
  - C1: clearscaler-16x9, creoble-16x9, kb-saas-16x9.
  - C3: robin-bos-16x9, wicflow-16x9, creoble-lovable-16x9, wkc-bfound-16x9.
  - C5: malaga-16x9, vendom-16x9, voxflow-16x9.
- **Narrow columns (C2, C4)** stay as one tall panel each, like the reference's chat and article panels.
  - **C2 = a WKC brief-to-script panel**: client brief text, a blue "Storyboard v2" link bubble in place of "External Link Title", a scene list, and input "Message to WKConversions..."
  - **C4 = a case-study page**: "How VoxFlow explains voice AI in 30 seconds" headline (Inter Tight 800 at -0.05em, ink), Sources replaced by "Deliverables: 16:9 · 1:1 · 9:16", body text, and an embedded 9:16 thumbnail (voxflow-9x16) where the reference shows Answer text.
- Use dark cards (ink #050F19) where the reference has dark hero cards; ClearScaler and VoxFlow clips are naturally dark.

**Shot 3 (606-648), phones showing finished vertical videos.** Keep all five phone tracks (T5) and the 1:2.165 screens.
- **SEND becomes the "Export / Share" screen of a 9:16 deliverable.**
  - Header #1266C9 with "09:41" and "Share Video".
  - Contact row: the Vendom logo tile, "Vendom", and "Reel · 1080 x 1920".
  - The big number becomes **"00:15"** (duration) in place of "$120.24".
  - Below it sits a **live 9:16 preview** (vendom-9x16) where the keypad was. Alternatively, keep a keypad-like row of three format chips: "9:16  1:1  16:9".
- **CHART:** a "Performance" screen. "Views 21,350", a 7-month bar chart in ink plus #3F8CE8, and two cards "Watch time 18.5k h" (ink) and "CTR +14.5 %" (#3F8CE8).
- **CONTACTS:** "Recent clients": ClearScaler, Creoble, Malaga Hideaway (plus Robin Bos and bFound above), each with a logo avatar and "16:9 · 1:1 · 9:16" sublines.
- **WALLET:** a full-bleed **malaga-9x16** clip under a #1266C9 header "Malaga Hideaway". The action row becomes "Reel, Story, Ad, Web".
- **RECEIPT:** "Export complete" with the green check kept (#29B36B), detail rows "File: creoble_9x16.mp4 / Format: 1080x1920 / Size: 24 MB", "See Detail", and a #3F8CE8 "Done" button.

**Shot 4 (649-717), the WKC delivery dashboard.** Keep the panel geometry, wash, tilts and toast positions (T6).
- Centre panel: a WKC project dashboard. "WKConversions" logo plus "Projects" and "Overview". "My Cards" becomes **"Now rendering"**: a blue card with the ClearScaler thumbnail, "GTM film 40s", "16:9" and a progress "3778 frames". "Recent Transaction" becomes **"Recent deliveries"** (Creoble, Vendom, VoxFlow rows). The bar chart becomes **"Renders this week"**: 7 days x 2 bars, #3F8CE8 and #8CC4F4, with the same build-in. The pie becomes **"Formats delivered"**: 16:9 35 %, 9:16 30 %, 1:1 20 %, GIF/other 15 %, in WKC blues plus ink, popping in the same order. "Quick Transfer" becomes "Team" (Raphael Wind, Karl van Kessel avatars), and the "Send" button becomes "Share".
- Left panel: an ink analytics card ("Views" area chart). Right panel: a WKC sidebar (ink #050F19) with "New project".
- **Toasts:**
  - Title on both: **"Video Is Ready!"** (15 chars against the reference's 16, so the width matches).
  - DARK body (66 chars, same ease-out typing): **"Your 16:9 master is rendered. Grab it via the provided link below."** Wrap after "Grab".
  - WHITE body (92 chars, same 3.45 chars/frame typing): **"Need a 1:1 or 9:16 cut for socials? We can export more versions from the same project files."** Wrap after "socials?" and after "the".
  - Checkboxes #3F8CE8, white-toast rim #1266C9.

---

## 8. Appendix: measured per-frame tables

Every value is in 1080p px. Frames are reference frames.

### T1 Button front face per frame (1080p px; scale = h/274.5, the settled height at frame 548). est. rotateY = acos(aspect/2.76); the small non-zero values after 550 come from cursor overlap and the press, so use the fitted curve in 2.2
| f | left | right | top | bottom | w | h | cx | cy | scale | aspect w/h | est. rotateY |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 530 | 810 | 1101 | 470 | 612 | 291 | 142 | 956 | 541 | 0.519 | 2.04 | 42° |
| 531 | 744 | 1155 | 450 | 633 | 411 | 183 | 950 | 542 | 0.667 | 2.25 | 36° |
| 532 | 706 | 1190 | 438 | 644 | 483 | 206 | 948 | 541 | 0.749 | 2.35 | 32° |
| 533 | 682 | 1212 | 432 | 650 | 530 | 218 | 947 | 541 | 0.792 | 2.43 | 28° |
| 534 | 664 | 1222 | 426 | 656 | 558 | 230 | 944 | 541 | 0.836 | 2.43 | 28° |
| 535 | 648 | 1245 | 422 | 660 | 597 | 238 | 946 | 541 | 0.869 | 2.50 | 25° |
| 536 | 634 | 1258 | 418 | 666 | 624 | 248 | 946 | 542 | 0.902 | 2.52 | 24° |
| 537 | 624 | 1270 | 416 | 668 | 646 | 252 | 947 | 542 | 0.918 | 2.57 | 22° |
| 538 | 615 | 1280 | 412 | 670 | 664 | 258 | 947 | 542 | 0.940 | 2.58 | 21° |
| 539 | 608 | 1288 | 411 | 672 | 681 | 261 | 948 | 542 | 0.951 | 2.61 | 19° |
| 540 | 600 | 1296 | 408 | 674 | 696 | 266 | 948 | 541 | 0.967 | 2.62 | 18° |
| 541 | 596 | 1302 | 408 | 675 | 706 | 267 | 949 | 542 | 0.973 | 2.65 | 17° |
| 542 | 591 | 1308 | 406 | 676 | 717 | 270 | 950 | 542 | 0.984 | 2.66 | 16° |
| 543 | 588 | 1312 | 405 | 678 | 724 | 273 | 950 | 542 | 0.995 | 2.65 | 16° |
| 544 | 585 | 1317 | 405 | 678 | 732 | 273 | 951 | 542 | 0.995 | 2.68 | 14° |
| 545 | 582 | 1320 | 404 | 678 | 738 | 274 | 951 | 541 | 1.000 | 2.69 | 13° |
| 546 | 580 | 1323 | 404 | 678 | 742 | 274 | 952 | 541 | 1.000 | 2.70 | 11° |
| 547 | 579 | 1326 | 404 | 678 | 747 | 274 | 952 | 541 | 1.000 | 2.72 | 10° |
| 548 | 578 | 1328 | 404 | 678 | 750 | 274 | 952 | 541 | 1.000 | 2.73 | 8° |
| 549 | 579 | 1329 | 404 | 678 | 750 | 274 | 954 | 541 | 1.000 | 2.73 | 8° |
| 550 | 579 | 1328 | 404 | 678 | 748 | 274 | 953 | 541 | 1.000 | 2.73 | 9° |
| 551 | 584 | 1326 | 405 | 676 | 742 | 272 | 955 | 541 | 0.989 | 2.73 | 8° |
| 552 | 592 | 1317 | 410 | 674 | 724 | 264 | 955 | 542 | 0.962 | 2.74 | 6° |
| 553 | 585 | 1328 | 405 | 675 | 742 | 270 | 956 | 540 | 0.984 | 2.75 | 5° |
| 554 | 579 | 1334 | 404 | 678 | 754 | 274 | 956 | 541 | 1.000 | 2.75 | 5° |
| 555 | 574 | 1338 | 402 | 680 | 764 | 278 | 956 | 541 | 1.011 | 2.75 | 5° |
| 556 | 573 | 1341 | 402 | 680 | 768 | 278 | 957 | 541 | 1.011 | 2.77 | 0° |
| 557 | 570 | 1344 | 400 | 681 | 774 | 280 | 957 | 541 | 1.022 | 2.76 | 1° |
| 558 | 570 | 1344 | 400 | 681 | 774 | 280 | 957 | 541 | 1.022 | 2.76 | 1° |
| 559 | 568 | 1334 | 400 | 681 | 765 | 280 | 951 | 541 | 1.022 | 2.73 | 9° |
| 560 | 568 | 1347 | 400 | 682 | 778 | 282 | 958 | 542 | 1.027 | 2.76 | 0° |
| 561 | 568 | 1347 | 400 | 682 | 778 | 282 | 958 | 542 | 1.027 | 2.76 | 0° |
| 562 | 570 | 1347 | 400 | 682 | 777 | 282 | 958 | 542 | 1.027 | 2.76 | 3° |
| 563 | 570 | 1346 | 400 | 681 | 776 | 280 | 958 | 541 | 1.022 | 2.76 | 0° |
| 564 | 572 | 1346 | 400 | 681 | 774 | 280 | 958 | 541 | 1.022 | 2.76 | 1° |
| 565 | 573 | 1344 | 402 | 681 | 771 | 279 | 958 | 542 | 1.016 | 2.76 | 0° |
| 566 | 576 | 1342 | 402 | 680 | 766 | 278 | 959 | 541 | 1.011 | 2.76 | 0° |
| 567 | 578 | 1340 | 404 | 678 | 762 | 274 | 958 | 541 | 1.000 | 2.78 | 0° |
| 568 | 582 | 1336 | 404 | 678 | 754 | 274 | 959 | 541 | 1.000 | 2.75 | 5° |
| 569 | 584 | 1335 | 405 | 676 | 752 | 272 | 959 | 541 | 0.989 | 2.77 | 0° |
| 570 | 588 | 1332 | 406 | 675 | 744 | 268 | 960 | 541 | 0.978 | 2.77 | 0° |
| 571 | 592 | 1328 | 408 | 672 | 735 | 264 | 960 | 540 | 0.962 | 2.78 | 0° |
| 572 | 597 | 1322 | 410 | 672 | 724 | 262 | 959 | 541 | 0.956 | 2.76 | 0° |
| 573 | 603 | 1316 | 412 | 669 | 712 | 256 | 959 | 541 | 0.934 | 2.78 | 0° |
| 574 | 610 | 1310 | 414 | 666 | 699 | 252 | 960 | 540 | 0.918 | 2.77 | 0° |
| 575 | 620 | 1300 | 417 | 663 | 681 | 246 | 960 | 540 | 0.896 | 2.77 | 0° |
| 576 | 632 | 1288 | 422 | 658 | 657 | 237 | 960 | 540 | 0.863 | 2.77 | 0° |
| 577 | 648 | 1274 | 428 | 654 | 626 | 226 | 961 | 541 | 0.825 | 2.76 | 0° |
| 578 | 674 | 1248 | 436 | 644 | 574 | 207 | 961 | 540 | 0.754 | 2.78 | 0° |


### T2 Cursor (dark pixels L<70) per frame, 1080p: bbox and centroid
| f | bbox x0-x1 | bbox y0-y1 | w x h | centroid | area scale (sqrt(area/3644)) |
|---|---|---|---|---|---|
| 530 | 1080-1119 | 356-417 | 39x62 | (1105, 387) | 0.38 |
| 531 | 1154-1196 | 412-456 | 42x44 | (1175, 430) | 0.33 |
| 532 | 1190-1236 | 400-502 | 46x102 | (1212, 453) | 0.35 |
| 533 | 1197-1238 | 438-543 | 40x105 | (1217, 496) | 0.45 |
| 534 | 1200-1242 | 476-590 | 42x114 | (1218, 534) | 0.47 |
| 535 | 1191-1242 | 504-627 | 51x123 | (1213, 566) | 0.58 |
| 536 | 1167-1236 | 530-656 | 69x126 | (1201, 584) | 0.66 |
| 537 | 1143-1224 | 550-678 | 81x128 | (1189, 598) | 0.71 |
| 538 | 1140-1220 | 567-662 | 80x94 | (1184, 601) | 0.66 |
| 539 | 1131-1220 | 579-688 | 88x110 | (1176, 614) | 0.72 |
| 540 | 1090-1216 | 578-716 | 126x138 | (1159, 630) | 0.86 |
| 541 | 1078-1209 | 576-722 | 130x146 | (1146, 638) | 0.92 |
| 542 | 1068-1194 | 573-726 | 126x153 | (1132, 641) | 0.95 |
| 543 | 1060-1180 | 572-729 | 120x158 | (1118, 640) | 0.98 |
| 544 | 1054-1172 | 567-732 | 117x165 | (1108, 637) | 1.00 |
| 545 | 1050-1172 | 566-732 | 122x166 | (1102, 632) | 1.00 |
| 546 | 1047-1179 | 564-732 | 132x168 | (1100, 627) | 0.99 |
| 547 | 1044-1194 | 562-693 | 150x130 | (1103, 624) | 0.97 |
| 548 | 1052-1196 | 567-698 | 144x130 | (1109, 628) | 0.94 |
| 549 | 1062-1192 | 579-699 | 130x120 | (1111, 634) | 0.92 |
| 550 | 1068-1180 | 592-705 | 112x112 | (1109, 639) | 0.82 |
| 551 | 1070-1190 | 590-720 | 120x130 | (1110, 644) | 0.88 |
| 552 | 1068-1194 | 578-722 | 126x144 | (1114, 642) | 0.94 |
| 553 | 1076-1194 | 554-717 | 118x164 | (1125, 632) | 0.97 |
| 554 | 1100-1209 | 540-706 | 110x166 | (1144, 617) | 0.98 |
| 555 | 1132-1233 | 525-693 | 100x168 | (1174, 600) | 0.96 |
| 556 | 1174-1269 | 507-678 | 94x171 | (1213, 580) | 0.93 |
| 557 | 1222-1311 | 489-658 | 88x170 | (1257, 559) | 0.87 |
| 558 | 1272-1344 | 470-640 | 72x171 | (1301, 541) | 0.79 |
| 559 | 1324-1374 | 452-620 | 50x168 | (1346, 527) | 0.70 |
| 560 | 1374-1404 | 435-597 | 30x162 | (1389, 513) | 0.62 |
| 561 | 1416-1446 | 417-580 | 30x164 | (1430, 497) | 0.63 |
| 562 | 1443-1485 | 399-567 | 42x168 | (1468, 482) | 0.70 |
| 563 | 1468-1521 | 384-552 | 52x168 | (1502, 466) | 0.76 |
| 564 | 1492-1552 | 372-538 | 60x166 | (1532, 451) | 0.82 |
| 565 | 1514-1584 | 360-526 | 70x166 | (1560, 437) | 0.86 |
| 566 | 1532-1611 | 348-514 | 80x166 | (1584, 423) | 0.89 |
| 567 | 1552-1634 | 339-504 | 81x165 | (1604, 411) | 0.90 |
| 568 | 1562-1653 | 332-494 | 92x162 | (1620, 400) | 0.90 |
| 569 | 1568-1670 | 326-486 | 102x160 | (1632, 392) | 0.90 |
| 570 | 1576-1666 | 327-460 | 90x134 | (1633, 386) | 0.79 |
| 571 | 1582-1676 | 326-465 | 93x140 | (1641, 384) | 0.80 |
| 572 | 1587-1680 | 326-468 | 93x142 | (1647, 383) | 0.80 |
| 573 | 1587-1696 | 312-465 | 110x153 | (1656, 385) | 0.89 |
| 574 | 1590-1694 | 312-464 | 104x152 | (1655, 384) | 0.90 |
| 575 | 1584-1686 | 314-460 | 102x147 | (1648, 382) | 0.89 |
| 576 | 1572-1670 | 316-459 | 98x142 | (1634, 381) | 0.86 |
| 577 | 1548-1644 | 326-456 | 96x130 | (1609, 382) | 0.80 |
| 578 | 1509-1593 | 340-440 | 84x99 | (1560, 386) | 0.68 |


### T3 Ripple ring half-heights (1080p px, measured at the bottom straight run, x=960). Half-width = 2.76 x half-height. Centre (959, 541). "-" = not born yet
| f | ring A hh | ring B hh | ring C hh | ring D hh |
|---|---|---|---|---|
| 550 | - | - | - | - |
| 551 | 163 | - | - | - |
| 552 | 181 | - | - | - |
| 553 | 196 | 148 | - | - |
| 554 | 211 | 169 | - | - |
| 555 | 226 | 184 | - | - |
| 556 | 238 | 199 | 155 | - |
| 557 | 253 | 214 | 173 | - |
| 558 | 266 | 227 | 188 | - |
| 559 | 281 | 242 | 202 | 160 |
| 560 | 295 | 254 | 217 | 176 |
| 561 | 308 | 269 | 230 | 191 |
| 562 | 322 | 283 | 244 | 205 |
| 563 | 338 | 298 | 256 | 218 |
| 564 | 352 | 311 | 271 | 232 |
| 565 | 368 | 326 | 284 | 245 |
| 566 | 377 | 335 | 295 | 259 |
| 567 | 395 | 350 | 308 | 268 |
| 568 | 404 | 362 | 320 | 283 |
| 569 | 416 | 376 | 335 | 296 |
| 570 | 430 | 388 | 344 | 307 |
| 571 | 440 | 400 | 356 | 316 |
| 572 | 449 | 406 | 365 | 326 |
| 573 | 458 | 413 | 374 | 334 |
| 574 | 464 | 424 | 382 | 344 |
| 575 | 467 | 425 | 385 | 349 |
| 576 | 463 | 424 | 386 | 350 |
| 577 | 455 | 421 | 379 | 344 |
| 578 | 431 | 395 | 359 | 332 |


### T4 Collage zoom about the frame centre (960,540), plane rotated +10°. Column offsets are in plane px at 605 scale; multiply by the scale for screen px
| f | collage scale (605 = 1.000) | per-frame ratio | wide-col offset y (plane px @1080p, 605=0) | narrow-col offset y |
|---|---|---|---|---|
| 579 | 2.507 | - | +156.0 | -75.4 |
| 580 | 2.162 | 0.862 | +150.0 | -72.5 |
| 581 | 2.004 | 0.927 | +144.0 | -69.6 |
| 582 | 1.882 | 0.939 | +138.0 | -66.7 |
| 583 | 1.787 | 0.950 | +132.0 | -63.8 |
| 584 | 1.709 | 0.956 | +126.0 | -60.9 |
| 585 | 1.644 | 0.962 | +120.0 | -58.0 |
| 586 | 1.589 | 0.966 | +114.0 | -55.1 |
| 587 | 1.540 | 0.969 | +108.0 | -52.2 |
| 588 | 1.499 | 0.974 | +102.0 | -49.3 |
| 589 | 1.464 | 0.976 | +96.0 | -46.4 |
| 590 | 1.433 | 0.979 | +90.0 | -43.5 |
| 591 | 1.405 | 0.980 | +84.0 | -40.6 |
| 592 | 1.380 | 0.982 | +78.0 | -37.7 |
| 593 | 1.357 | 0.983 | +72.0 | -34.8 |
| 594 | 1.336 | 0.985 | +66.0 | -31.9 |
| 595 | 1.316 | 0.985 | +60.0 | -29.0 |
| 596 | 1.296 | 0.985 | +54.0 | -26.1 |
| 597 | 1.277 | 0.985 | +48.0 | -23.2 |
| 598 | 1.257 | 0.984 | +42.0 | -20.3 |
| 599 | 1.236 | 0.983 | +36.0 | -17.4 |
| 600 | 1.213 | 0.981 | +30.0 | -14.5 |
| 601 | 1.187 | 0.979 | +24.0 | -11.6 |
| 602 | 1.157 | 0.975 | +18.0 | -8.7 |
| 603 | 1.119 | 0.967 | +12.0 | -5.8 |
| 604 | 1.070 | 0.956 | +6.0 | -2.9 |
| 605 | 1.000 | 0.935 | -0.0 | +0.0 |


### T5 Mobile phones: centre-x, top-y, width per frame (height = 2.165 x width). Tracked by per-element similarity transforms; ±3 px
| f | send cx,top,w | chart cx,top,w | contacts cx,top,w | wallet cx,top,w | receipt cx,top,w |
|---|---|---|---|---|---|
| 606 | 1081, 430, 1035 | 219, -237, 551 | off-screen | off-screen | off-screen |
| 607 | 1065, 440, 905 | 278, -259, 506 | off-screen | off-screen | off-screen |
| 608 | 1059, 443, 848 | 310, -261, 483 | off-screen | off-screen | off-screen |
| 609 | 1054, 445, 807 | 335, -259, 463 | off-screen | off-screen | off-screen |
| 610 | 1050, 446, 773 | 356, -254, 446 | off-screen | off-screen | off-screen |
| 611 | 1047, 446, 747 | 374, -250, 434 | off-screen | off-screen | off-screen |
| 612 | 1044, 447, 722 | 390, -243, 422 | off-screen | off-screen | off-screen |
| 613 | 1042, 447, 702 | 404, -236, 411 | 1559, -1202, 620 | -194, 602, 584 | 2107, 164, 568 |
| 614 | 1039, 447, 682 | 418, -229, 401 | 1540, -1140, 600 | -160, 599, 569 | 2086, 174, 552 |
| 615 | 1037, 446, 665 | 429, -221, 392 | 1523, -1086, 584 | -130, 596, 554 | 2066, 184, 535 |
| 616 | 1036, 446, 651 | 440, -214, 383 | 1507, -1038, 571 | -104, 593, 538 | 2050, 192, 523 |
| 617 | 1034, 445, 640 | 450, -207, 376 | 1493, -992, 554 | -78, 591, 525 | 2034, 200, 512 |
| 618 | 1033, 445, 628 | 460, -201, 369 | 1481, -949, 539 | -54, 592, 516 | 2020, 207, 504 |
| 619 | 1032, 444, 616 | 468, -194, 364 | 1469, -912, 528 | -33, 590, 506 | 2007, 214, 493 |
| 620 | 1029, 442, 603 | 477, -187, 357 | 1458, -874, 514 | -13, 589, 496 | 1994, 220, 485 |
| 621 | 1029, 442, 596 | 484, -179, 352 | 1449, -846, 503 | 5, 587, 487 | 1983, 226, 476 |
| 622 | 1028, 441, 587 | 491, -173, 345 | 1440, -816, 492 | 22, 586, 479 | 1972, 231, 469 |
| 623 | 1027, 439, 579 | 498, -167, 341 | 1431, -788, 485 | 37, 584, 469 | 1962, 236, 461 |
| 624 | 1026, 438, 572 | 505, -161, 336 | 1424, -763, 475 | 51, 583, 461 | 1953, 240, 455 |
| 625 | 1025, 436, 567 | 511, -156, 332 | 1416, -738, 466 | 65, 581, 456 | 1944, 244, 448 |
| 626 | 1025, 435, 561 | 517, -149, 327 | 1409, -717, 462 | 77, 580, 447 | 1936, 248, 441 |
| 627 | 1024, 433, 556 | 522, -145, 322 | 1402, -697, 456 | 89, 579, 440 | 1928, 252, 436 |
| 628 | 1024, 432, 553 | 527, -141, 320 | 1396, -676, 449 | 101, 579, 437 | 1921, 255, 431 |
| 629 | 1024, 430, 549 | 532, -136, 317 | 1389, -658, 445 | 111, 578, 431 | 1914, 259, 425 |
| 630 | 1023, 429, 544 | 537, -132, 313 | 1383, -641, 440 | 121, 577, 428 | 1908, 262, 420 |
| 631 | 1023, 427, 540 | 541, -126, 309 | 1378, -625, 436 | 131, 577, 423 | 1901, 265, 414 |
| 632 | 1022, 425, 537 | 546, -122, 306 | 1372, -609, 431 | 140, 576, 417 | 1895, 268, 409 |
| 633 | 1022, 424, 533 | 550, -116, 303 | 1368, -593, 423 | 150, 576, 412 | 1889, 271, 405 |
| 634 | 1022, 423, 531 | 555, -112, 301 | 1363, -579, 417 | 159, 575, 407 | 1882, 274, 400 |
| 635 | 1022, 422, 527 | 559, -105, 296 | 1358, -565, 412 | 168, 574, 403 | 1876, 277, 395 |
| 636 | 1021, 421, 524 | 564, -98, 293 | 1353, -550, 407 | 177, 574, 398 | 1869, 281, 390 |
| 637 | 1021, 420, 521 | 568, -92, 290 | 1348, -535, 402 | 187, 573, 394 | 1862, 284, 386 |
| 638 | 1020, 419, 515 | 573, -86, 283 | 1342, -521, 401 | 197, 573, 390 | 1854, 287, 382 |
| 639 | 1020, 419, 510 | 577, -78, 281 | 1338, -506, 391 | 207, 572, 385 | 1845, 290, 376 |
| 640 | 1019, 418, 505 | 582, -70, 277 | 1333, -489, 382 | 217, 572, 382 | 1836, 293, 371 |
| 641 | 1018, 417, 498 | 587, -63, 272 | 1328, -474, 376 | 228, 571, 377 | 1827, 297, 365 |
| 642 | 1017, 417, 491 | 592, -55, 268 | 1322, -456, 369 | 240, 570, 372 | 1816, 301, 361 |
| 643 | 1016, 417, 483 | 597, -46, 264 | 1315, -440, 366 | 252, 569, 364 | 1804, 306, 355 |
| 644 | 1015, 418, 473 | 603, -36, 260 | 1308, -421, 360 | 265, 568, 358 | 1790, 310, 348 |
| 645 | 1014, 418, 463 | 609, -26, 255 | 1300, -399, 352 | 280, 567, 350 | 1775, 315, 340 |
| 646 | 1012, 420, 450 | 616, -14, 249 | 1291, -372, 344 | 298, 567, 340 | 1756, 321, 332 |
| 647 | 1010, 423, 433 | 626, 2, 243 | 1279, -339, 333 | 320, 566, 329 | 1731, 329, 320 |
| 648 | 1008, 428, 408 | 638, 22, 234 | 1263, -294, 316 | 350, 564, 311 | 1696, 340, 303 |


### T6 Toast corners per frame (x,y). "*" = clipped by the frame edge (the value is the clip point, not the true corner)
| f | dark TL | dark TR | dark BL | dark BR | white TL | white TR | white BL | white BR |
|---|---|---|---|---|---|---|---|---|
| 650 | 0,82* | 789,93 | 0,480* | 792,470 | 1312,693 | 1918,684* | 1306,1078* | 1918,1078* |
| 651 | 0,99* | 804,111 | 0,484* | 810,472 | 1269,680 | 1918,680* | 1257,1078* | 1918,1078* |
| 652 | 0,112* | 814,124 | 0,488* | 820,478 | 1234,675 | 1918,676* | 1222,1078* | 1918,1078* |
| 653 | 0,123* | 824,136 | 0,490* | 831,482 | 1204,672 | 1918,674* | 1194,1078* | 1918,1078* |
| 654 | 0,132* | 834,148 | 0,494* | 840,483 | 1176,672 | 1918,670* | 1174,1078* | 1918,1078* |
| 655 | 0,140* | 838,156 | 0,496* | 846,488 | 1161,668 | 1918,669* | 1155,1062 | 1918,1078* |
| 656 | 0,146* | 843,164 | 0,498* | 852,490 | 1143,668 | 1918,668* | 1142,1054 | 1918,1068* |
| 657 | 0,152* | 846,170 | 0,500* | 858,490 | 1132,663 | 1918,666* | 1126,1044 | 1918,1062* |
| 658 | 0,158* | 850,176 | 0,501* | 862,494 | 1122,660 | 1918,664* | 1113,1034 | 1918,1056* |
| 659 | 0,162* | 855,182 | 0,502* | 867,495 | 1110,660 | 1918,663* | 1104,1028 | 1918,1052* |
| 660 | 0,166* | 860,188 | 0,504* | 872,495 | 1101,658 | 1918,663* | 1095,1022 | 1918,1047* |
| 661 | 0,171* | 862,192 | 0,506* | 876,495 | 1092,657 | 1918,662* | 1088,1017 | 1918,1042* |
| 662 | 0,174* | 866,196 | 0,506* | 879,498 | 1086,656 | 1918,660* | 1077,1008 | 1918,1040* |
| 663 | 0,178* | 873,206 | 0,507* | 882,500 | 1078,656 | 1918,660* | 1070,1002 | 1918,1035* |
| 664 | 0,180* | 870,204 | 0,508* | 884,502 | 1074,652 | 1918,660* | 1065,1000 | 1918,1034* |
| 665 | 0,184* | 873,208 | 0,508* | 886,502 | 1068,652 | 1918,658* | 1060,998 | 1918,1030* |
| 666 | 0,186* | 880,216 | 0,510* | 890,502 | 1060,652 | 1918,658* | 1056,996 | 1918,1028* |
| 667 | 0,189* | 882,219 | 0,510* | 892,502 | 1056,651 | 1918,657* | 1050,990 | 1918,1026* |
| 668 | 0,192* | 884,220 | 0,510* | 897,502 | 1053,650 | 1918,657* | 1044,986 | 1918,1023* |
| 669 | 0,194* | 885,222 | 0,512* | 898,502 | 1048,648 | 1918,657* | 1041,982 | 1918,1022* |
| 670 | 0,195* | 884,224 | 0,512* | 898,506 | 1048,645 | 1918,656* | 1036,980 | 1918,1020* |
| 671 | 0,198* | 888,228 | 0,512* | 898,508 | 1040,648 | 1918,656* | 1034,978 | 1918,1018* |
| 672 | 0,206* | 886,228 | 0,506* | 902,507 | 1040,646 | 1918,656* | 1029,974 | 1918,1016* |
| 673 | 12,204 | 890,231 | 10,508 | 903,508 | 1038,645 | 1918,656* | 1028,974 | 1918,1016* |
| 674 | 16,207 | 890,232 | 14,506 | 906,507 | 1035,645 | 1918,654* | 1023,969 | 1918,1014* |
| 675 | 26,206 | 891,234 | 21,508 | 908,507 | 1032,645 | 1918,654* | 1022,969 | 1918,1012* |
| 676 | 28,208 | 894,237 | 26,507 | 906,512 | 1029,645 | 1918,654* | 1018,966 | 1918,1011* |
| 677 | 33,210 | 897,240 | 30,507 | 908,512 | 1024,646 | 1918,654* | 1016,964 | 1918,1010* |
| 678 | 36,213 | 898,242 | 36,510 | 910,510 | 1020,648 | 1918,652* | 1014,964 | 1918,1010* |
| 679 | 42,213 | 898,242 | 40,510 | 912,510 | 1022,645 | 1918,652* | 1011,962 | 1918,1010* |
| 680 | 44,216 | 897,242 | 42,507 | 910,514 | 1022,644 | 1918,652* | 1011,963 | 1918,1008* |
| 681 | 48,216 | 898,243 | 48,510 | 914,512 | 1017,645 | 1918,652* | 1008,962 | 1918,1008* |
| 682 | 52,216 | 897,243 | 52,512 | 915,512 | 1017,644 | 1918,652* | 1005,958 | 1918,1006* |
| 683 | 57,216 | 898,244 | 56,512 | 915,513 | 1016,644 | 1918,656* | 1004,958 | 1918,1004* |
| 684 | 60,218 | 902,248 | 57,510 | 916,513 | 1016,642 | 1918,658* | 1005,960 | 1918,1000* |
| 685 | 63,218 | 902,248 | 60,510 | 915,516 | 1014,642 | 1918,662* | 1000,956 | 1918,992* |
| 686 | 64,219 | 902,248 | 64,513 | 918,513 | 1012,642 | 1905,654 | 999,954 | 1908,999 |
| 687 | 66,220 | 902,248 | 68,513 | 920,513 | 1011,642 | 1902,654 | 998,954 | 1905,998 |
| 688 | 72,219 | 903,249 | 70,513 | 920,514 | 1010,642 | 1898,654 | 999,957 | 1902,996 |
| 689 | 75,220 | 908,252 | 75,514 | 921,514 | 1000,648 | 1894,654 | 993,951 | 1898,996 |
| 690 | 80,220 | 908,252 | 75,510 | 924,514 | 1005,642 | 1888,652 | 992,951 | 1894,994 |
| 691 | 82,222 | 909,252 | 80,512 | 926,514 | 1002,642 | 1884,652 | 992,954 | 1890,993 |
| 692 | 86,224 | 912,254 | 86,514 | 928,514 | 1000,642 | 1880,652 | 988,952 | 1886,992 |
| 693 | 88,225 | 914,254 | 88,513 | 930,516 | 996,642 | 1875,652 | 984,950 | 1881,990 |
| 694 | 92,228 | 916,255 | 94,514 | 932,518 | 993,642 | 1874,656 | 982,951 | 1875,990 |
| 695 | 100,225 | 921,256 | 99,514 | 936,516 | 992,640 | 1864,652 | 980,951 | 1870,988 |
| 696 | 106,226 | 922,256 | 102,512 | 940,514 | 988,640 | 1860,652 | 974,946 | 1862,992 |
| 697 | 111,228 | 928,258 | 108,512 | 942,518 | 984,640 | 1854,652 | 972,950 | 1856,990 |
| 698 | 120,228 | 932,258 | 114,512 | 946,518 | 976,642 | 1846,651 | 966,946 | 1846,992 |
| 699 | 126,230 | 934,256 | 123,514 | 950,520 | 972,642 | 1839,651 | 963,948 | 1840,988 |
| 700 | 134,231 | 939,258 | 129,512 | 956,519 | 970,639 | 1832,651 | 956,945 | 1836,982 |
| 701 | 140,234 | 946,260 | 138,513 | 962,519 | 964,639 | 1821,650 | 950,944 | 1822,988 |
| 702 | 148,236 | 957,264 | 148,514 | 968,519 | 956,640 | 1815,651 | 944,944 | 1818,981 |
| 703 | 154,240 | 958,261 | 156,513 | 976,516 | 951,639 | 1806,651 | 936,940 | 1809,978 |
| 704 | 168,238 | 970,264 | 166,513 | 984,516 | 940,640 | 1794,650 | 928,939 | 1798,976 |
| 705 | 180,240 | 975,264 | 180,516 | 988,520 | 933,639 | 1784,650 | 922,940 | 1786,975 |
| 706 | 195,240 | 987,267 | 190,514 | 998,520 | 924,639 | 1770,648 | 914,939 | 1774,972 |
| 707 | 207,243 | 994,267 | 204,514 | 1010,518 | 918,636 | 1755,646 | 904,938 | 1761,969 |
| 708 | 224,243 | 1005,268 | 219,514 | 1020,518 | 903,639 | 1743,648 | 896,936 | 1744,969 |
| 709 | 240,246 | 1018,272 | 234,514 | 1030,518 | 896,638 | 1726,648 | 884,933 | 1730,963 |
| 710 | 258,249 | 1030,273 | 252,514 | 1042,518 | 879,639 | 1707,645 | 870,928 | 1712,960 |
| 711 | 279,252 | 1041,273 | 273,516 | 1056,519 | 868,638 | 1684,642 | 858,927 | 1692,956 |
| 712 | 302,255 | 1056,276 | 296,516 | 1071,518 | 850,639 | 1664,642 | 844,926 | 1670,950 |
| 713 | 327,260 | 1074,284 | 320,514 | 1086,519 | 837,636 | 1636,640 | 830,921 | 1644,944 |
| 714 | 354,267 | 1089,288 | 351,518 | 1104,518 | 820,634 | 1606,638 | 816,914 | 1592,910 |
| 715 | 388,276 | 1110,294 | 387,518 | 1119,520 | 807,630 | 1572,638 | 796,898 | 1550,886 |
| 716 | 444,282 | 1126,300 | 436,519 | 1138,520 | 786,626 | 1522,633 | 780,891 | 1474,915 |
| 717 | 554,327 | 1138,336 | 555,526 | 1143,525 | 780,615 | 1395,621 | 780,838 | 1396,850 |

