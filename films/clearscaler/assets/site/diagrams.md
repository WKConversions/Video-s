# ClearScaler signature diagrams and site motion (harvest, 2026-10-05)

Source: server HTML of www.clearscaler.com (saved in assets/site/html/), the inline CSS (html/site.css) and the JS chunks (html/WriteDemo-BMyPmWRC.js, html/Stage-Ce7ZPeTx.js). Colours below are the dark-theme values (brand.json has the hex).

## 1. The loop (figure-8): one curve for everything

The hero loop, the 12-station engine diagram, the FIG 0.x icons, the blog covers, the closer's field of marks and the paid report's trace all draw the same path:

```
LOOP_D = "M512 512C449.7 444.9 383.3 374.6 289.2 374.6C210.4 374.6 151.8 439.2 151.8 512C151.8 584.8 210.4 649.4 289.2 649.4C383.3 649.4 449.7 579.1 512 512C574.3 444.9 640.7 374.6 734.8 374.6C813.6 374.6 872.2 439.2 872.2 512C872.2 584.8 813.6 649.4 734.8 649.4C640.7 649.4 574.3 579.1 512 512Z"
viewBox (hero, engine diagram, paid trace) = "136 358 752 308"
```

Geometry: crossing at (512, 512); left lobe centred (289.2, 512), right lobe centred (734.8, 512); lobe half-height 137.4; extents x 151.8 to 872.2, y 374.6 to 649.4. Path length 1943.5 units, 8 cubic segments (270.0, 215.8, 215.8, 270.0, 270.0, 215.8, 215.8, 270.0); cumulative fractions 0.139 (top of left lobe), 0.25 (left extreme), 0.361 (bottom of left lobe), 0.5 (back at the crossing), 0.639 (top of right lobe), 0.75 (right extreme), 0.861 (bottom of right lobe), 1.0.
Direction of travel: from the crossing up and left into the LEFT lobe ("Be seen"), round it anticlockwise on screen (top, far left, bottom), back through the crossing, up and right into the RIGHT lobe ("Be chosen"), round it clockwise (top, far right, bottom), back to the crossing.

**The logo mark is this same curve**, stroked 97.2 units wide. The nav logo's polyline path (viewBox 0 0 817.2 372) equals LOOP_D translated by (-103.2, -326); the closer's field uses LOOP_D directly with `<symbol viewBox="103.2 325.8 817.6 372.4">` and `stroke-width="97.2"`. So a 1 px hairline loop can thicken into the logo mark with no morph, only stroke-width (1 → 97.2 in path units) and a viewBox/scale change. Logo files: assets/logo/clearscaler-mark*.svg (the polyline version from the nav), assets/logo/clearscaler-logo*.svg (mark 0 to 817.2 + wordmark 1021 to 2854 on one 372-unit grid; site renders it 20 px high with an 11 px gap).

## 2. Hero loop stage (home, behind "Your distribution, fixed.")

```html
<div data-loop="grid" class="loop-grid">                     <!-- 64 px square grid, 1 px lines in ink at 4% (≈#111215 on night),
                                                                 masked radial-gradient(58% 60%, #000 22%, transparent 74%) -->
  <svg class="loop-grid__circles" viewBox="136 358 752 308">
    <circle cx="289.2" cy="512" r="137.4"/>                   <!-- stroke ink at 9%, 1 px non-scaling -->
    <circle cx="734.8" cy="512" r="137.4"/>
  </svg>
</div>
<svg class="loop-stage__svg" viewBox="136 358 752 308">       <!-- width min(1600px, 130vw): 1600 px at a 1440 viewport, so the
                                                                 lobes run off both edges; centred on the headline -->
  <defs><radialGradient id="lg"><stop offset="0" stop-color="#FC7F48" stop-opacity=".55"/>
        <stop offset=".45" stop-color="#FC7F48" stop-opacity=".14"/><stop offset="1" stop-opacity="0"/></radialGradient></defs>
  <circle class="loop-glow" cx="512" cy="512" r="70" fill="url(#lg)"/>
  <path class="loop-hair"  d="LOOP_D" vector-effect="non-scaling-stroke"/>   <!-- 1 px, rule-strong (white 22% ≈ #3E3E41) -->
  <path class="loop-comet" data-part="tail" d="LOOP_D" pathLength="1"/>
  <path class="loop-comet" data-part="mid"  d="LOOP_D" pathLength="1"/>
  <path class="loop-comet" data-part="head" d="LOOP_D" pathLength="1"/>
</svg>
```

The comet is three orange (#FC7F48) dashes on the same path, round caps, moving together (stroke-width in user units × --loop-u = .47 at desktop, i.e. about 2.4 px / 1.9 px on screen):

| part | dasharray (fraction of path) | opacity | stroke-width | keyframes (dashoffset) |
|---|---|---|---|---|
| tail | .12 .88 | .22 | 2.4 × u | .12 → -.88 |
| mid | .06 .94 | .5 | 1.9 × u | .06 → -.94 |
| head | .022 .978 | 1 | 1.9 × u | .022 → -.978 |

Timing: `--dur-loop: 9s`, linear, 3 laps (27 s), then it stops. The crossing glow (`loop-glow-in`, 27 s linear) holds at opacity .35 until 92% and rises to .9 at the end, so the centre lights up as the third lap finishes. At 1600 px the path is about 4,135 px long: the head travels about 460 px/s. A mask over the stage dims the loop behind the headline and the CTA row (radial-gradient(30% 13%, 25% black 35%, black) composited with radial-gradient(36% 17% at 50% 71%, transparent 50%, black)). The headline's word "fixed" is in orange (`.stage-brand`).
The OG image (assets/logo/og-home.png) is a still of this: logo top-left, hairline loop on a faint grid, comet with an orange glow mid-lap, "We fix distribution for B2B companies." bottom-left.

## 3. "One loop, run every weekday." (gtm-engine, 12 stations)

Same viewBox and hair path. Stations are 4-unit circles (fill night, stroke ink-2 1.25 px); "Hold" is dashed (stroke ink-3, dasharray 2 2); "Send" sits on the crossing, r 6, stroke ink 1.5 px. Labels 13 px Manrope 500 ink-2 (linked ones underlined in rule-strong); lobe names in Geist Mono 12 px .08em caps ink-3: "BE SEEN" (left lobe centre) and "BE CHOSEN" (right).

| order | label | cx | cy | label side |
|---|---|---|---|---|
| 1 | Find | 443.56 | 443.07 | above |
| 2 | Research | 331.47 | 379.49 | above |
| 3 | Score | 209.02 | 400.35 | left |
| 4 | Hold (held, dashed) | 151.8 | 512 | left |
| 5 | Write | 209.02 | 623.65 | left |
| 6 | Check | 331.47 | 644.51 | below |
| 7 | Approve | 443.56 | 580.93 | below |
| 8 | Send (r 6) | 512 | 512 | above |
| 9 | Follow up | 626.79 | 407.82 | above |
| 10 | Reply | 793.25 | 387.53 | right |
| 11 | Book | 870.81 | 531.37 | right |
| 12 | Learn (loops back) | 661.17 | 634.23 | below |

Packets: three orange dots travel the loop together, each a near-zero dash (dasharray .0001 .9999, round cap) of stroke 14 × u with a glow copy at 34 × u, opacity .22 (u = .62 at ≥1100 px container). Start offsets .183, .5 and .76 of the path; animation 12 s linear, 3 laps (`loop-packet-0..2`: dashoffset -.183 → -1.183 etc.). Screenshot: assets/site/mockups/engine-loop-diagram-*.png.

## 4. FIG 0.1 / 0.2 / 0.3 (home, "Three channels. One loop, run by us.")

Small icons (128 px wide on the cards) with a mono caption "FIG 0.1 OUTBOUND" (Geist Mono 12 px, .08em, caps; "FIG 0.1" ink-3, the name ink-2). viewBox "0 330 1024 364". Each has two dashed guide circles (r 173.4 at the lobe centres, stroke ink 10%, dasharray 2 4), the hair path, one lobe lit in orange (1.5 px, round caps) and three tick circles (r 5, fill night, stroke ink-2).

```html
<!-- FIG 0.1 Outbound: left lobe lit -->
<circle class="loop-fig__guide" cx="289.2" cy="512" r="173.4"/><circle class="loop-fig__guide" cx="734.8" cy="512" r="173.4"/>
<path class="loop-hair" d="LOOP_D"/>
<path class="loop-lit" d="M512 512C449.7 444.9 383.3 374.6 289.2 374.6C210.4 374.6 151.8 439.2 151.8 512C151.8 584.8 210.4 649.4 289.2 649.4C383.3 649.4 449.7 579.1 512 512"/>
<circle class="loop-fig__tick" cx="362.83" cy="389.77" r="5"/><circle class="loop-fig__tick" cx="151.8" cy="512" r="5"/><circle class="loop-fig__tick" cx="362.83" cy="634.23" r="5"/>

<!-- FIG 0.2 Paid: same left lobe lit, plus three "placements" (ellipses) feeding the far-left point, lines in ink-3 1 px -->
<g class="loop-fig__line">
  <ellipse cx="58" cy="472" rx="40" ry="11"/><path d="M98 472C124 472 132 512 151.8 512"/>
  <ellipse cx="58" cy="512" rx="40" ry="11"/><path d="M98 512C124 512 132 512 151.8 512"/>
  <ellipse cx="58" cy="552" rx="40" ry="11"/><path d="M98 552C124 552 132 512 151.8 512"/>
</g>

<!-- FIG 0.3 Pages: right lobe lit, a page wireframe inside it -->
<g class="loop-fig__line"><rect x="676" y="462" width="118" height="100" rx="8"/><path d="M676 480H794"/>
  <path d="M690 500H770M690 514H752"/><rect x="690" y="530" width="44" height="16" rx="8"/></g>
<path class="loop-lit" d="M512 512C574.3 444.9 640.7 374.6 734.8 374.6C813.6 374.6 872.2 439.2 872.2 512C872.2 584.8 813.6 649.4 734.8 649.4C640.7 649.4 574.3 579.1 512 512"/>
<circle class="loop-fig__tick" cx="661.17" cy="389.77" r="5"/><circle class="loop-fig__tick" cx="872.2" cy="512" r="5"/><circle class="loop-fig__tick" cx="661.17" cy="634.23" r="5"/>
```
Meaning: outbound and paid both feed "be seen" (left lobe); pages are "be chosen" (right lobe). Each card below its fig: a mini mockup (FIG 0.1 inbox replies; FIG 0.2 sponsored ad with "Ad click · Page visit · Call booked"; FIG 0.3 a page with "Live lane pricing for freight teams." and an orange "Book a demo"), then the channel name with a chevron and its tagline.

## 5. Paid report trace (paid-acquisition hero, Google row)

```html
<svg class="wr-loop" viewBox="136 358 752 308">
  <path class="wr-loop__base" d="LOOP_D"/>
  <path class="wr-loop__lit" pathLength="1" d="M151.8 512C151.8 584.8 210.4 649.4 289.2 649.4C383.3 649.4 449.7 579.1 512 512C574.3 444.9 640.7 374.6 734.8 374.6C813.6 374.6 872.2 439.2 872.2 512"/>
  <circle class="wr-loop__dot" cx="151.8" cy="512" r="13"/>   <!-- Search ad  "freight quoting software" -->
  <circle class="wr-loop__dot" cx="512"   cy="512" r="13"/>   <!-- Click      Mon 09:12 -->
  <circle class="wr-loop__dot" cx="734.8" cy="374.6" r="13"/> <!-- Booked call Wed 10:00 -->
  <circle class="wr-loop__dot" cx="872.2" cy="512" r="17"/>   <!-- Deal won   $4,800 (last dot orange, larger) -->
</svg>
```
The lit trace draws on with stroke-dashoffset over 1.2 s (`--dur-5`, ease-out). This is the site's own picture of one buyer moving from "seen" to "chosen" to revenue.

## 6. Closer field ("Be seen. Be chosen.")

A 6 × 5 grid of logo marks behind the statement (gap clamp(16px, 3.2vw, 48px) × clamp(12px, 2.6vw, 40px), cell aspect 817.6 : 372.4). Outline variant: each mark is LOOP_D stroked 97.2 used as a mask minus an inner stroke of (97.2 − 2 × 6.8), i.e. an outlined mark; opacities .14 / .2 / .28 / .1 / .24 by nth-child pattern. The 18th cell (row 3, last column) is the solid orange mark (`lf-lit`). Twinkle: cells 4, 12 and 21 pulse to opacity .34 (2.4 s ease-in-out, 3 times, delays 0 / .8 / 1.6 s). On hovering the CTA a light comet (on-brand at 55%, stroke 22, dash .14) glints once round the lit mark in 1.2 s cubic-bezier(.2,.7,.2,1). Behind it: radial orange glow at the bottom (`radial-gradient(60% 50% at 50% 92%, brand-glow, transparent 70%)`). The statement is Outfit 600, −.05em, line-height .92, up to 160 px.

## 7. Blog cover ("bcover", /blog)

```html
<div class="bcover">                 <!-- surface-1 #101012, 1 px rule border; ::before = 28 px square grid in ink 5%,
                                          masked radial-gradient(70% 80%, #000 30%, transparent 88%) -->
<svg viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">
  <radialGradient id="glow"><stop offset="0" stop-color="#FC7F48" stop-opacity=".34"/><stop offset="1" stop-opacity="0"/></radialGradient>
  <circle cx="919.4" cy="400.2" r="360" fill="url(#glow)"/>            <!-- glow sits at the head of the lit segment -->
  <g transform="translate(239.7 -129.2) scale(1.182)">
    <circle class="bcover__circle" cx="289.2" cy="512" r="181.4"/><circle class="bcover__circle" cx="734.8" cy="512" r="181.4"/>  <!-- ink 8% -->
    <path class="bcover__hair" d="LOOP_D"/>                            <!-- rule-strong 1 px -->
    <g class="bcover__motif"> eight tick circles r 7 (fill surface-1, stroke ink-3 75%) </g>
    <path class="bcover__lit" d="M395 617.6L402.4 612.8 ... L575.1 447.9"/>  <!-- orange 2 px segment crossing the centre -->
  </g>
</svg></div>
```
Per-article motifs vary (data-kind gtm/outbound/paid/…); the system is constant: grid, two faint circles, hairline loop, ticks, one orange lit segment, orange glow.

## 8. What the site animates (the motion vocabulary)

Tokens: `--ease-out cubic-bezier(.2,.7,.2,1)` (default for almost everything), `--ease-emphasis cubic-bezier(.16,1,.3,1)` (entrances, slides), `--ease-in-out cubic-bezier(.6,0,.2,1)`, `--ease-spring linear(0, .6 18%, 1.02 38%, .99 60%, 1)` (chips settling, stamps); durations `--dur-1 .12s` (hover colour), `--dur-2 .24s` (swaps, crossfades), `--dur-3 .48s` (reveals, toasts), `--dur-4 .9s`, `--dur-5 1.2s` (line draws), `--dur-loop 9s`, `--dur-press 80ms`, `--rise 12px`. Everything plays a set number of times (usually 3 cycles or once) and then rests on its final state; there is a site-wide "Pause animations" toggle.

- **Comet on the loop** (hero): above. 9 s laps × 3, glow at the crossing at the end.
- **Section reveal**: opacity 0 → 1 and translateY 12 px → 0, .48 s ease-out.
- **Hero product stage** (home, under the CTA; Stage-Ce7ZPeTx.js): browser-framed leads screen, tilted `perspective(1800px) rotateX(10deg) scale(.96)` flattening as it scrolls into view, a soft orange shadow under it (0 32px 110px −24px orange 16%), right edge fading out. A 10 s beat, 3 cycles: 0.6 s signal chip slides in from 12 px right (.48 s emphasis) → 1.4 s a new lead row appears at the top with an orange 9% wash fading over 1.6 s, status "Scoring", score counts up (84 / 88 / 91), Total and In progress tick up by one (1,283 → 1,284; the first cycle lands on 1,285 and 47; digits swap with a fade + 4 px rise, .24 s) → 2.1 s status flips to "Writing email" and the fit chip settles to "Strong fit" (scale .86 → 1, .42 s spring) → 3.2 s Marta Vogel's row flips to "Replied", the Replied tile ticks up by one and In outreach down by one (56 → 57, 813 → 812) → 4.0 s reply card "MV Marta Vogel · Quillmoor Group / Good timing. Thursday works." rises 16 px and fades in (.48 s) over the frame's bottom-left → 6.0 s her row becomes "Meeting booked" and the toast "Meeting booked · Thu 10:00" rises in (frosted, blur 12 px, `--e-float` shadow). References: mockups/home-hero-stage-t*.png.
- **The email being written** (WriteDemo-BMyPmWRC.js; "Write and approve."): before it starts, the whole body shows as ghost text at 22% opacity. Timeline (full version, ms from start): 300 first research signal highlights (border, surface-1 fill, 2 px orange inset bar on the left) → 1000 second signal → 1600 typing starts: each word snaps to full opacity at its own delay, 11.0 ms per character (2,400 ms for the 218 characters; per-word delays in the HTML: "Hi" 0, "Sofia," 33, "I" 110, "wanted" 132, … "Fernhollow" 2081, "quotes" 2202, "today?" 2279, "Anna" 2356) → 4300 strike: a line-through wipes left to right across the generic sentence (clip-path, .3 s ease-out) and it greys to ink-2 → 4750 insert: the researched sentence wipes in (clip-path .48 s + opacity .24 s) with a 1.5 px orange underline at 60%, and the "Edited by our team" pill pops in (spring) → 5650 "Approve & send" (orange) presses (scale .97) → 5950 stamp: "This email is waiting for your approval" slides up and out, "Approved" (check icon, surface-2 tile, 9 px radius, 13 px semibold) slides up in (.24 s, emphasis) → 6550 the buttons give way to "Sent from your mailbox" (green check) → (gtm-engine/booked version) 7350 typing dots (three 6 px dots, 1.1 s bounce) → 8550 reply bubble "Good timing. Thursday works." → 9450 the week strip's Thursday gets a green "10:00" chip (spring). Runs once; a "Replay" pill appears. Lite version: type at 200, strike 2900, insert 3350, press 4250, stamp 4550, sent 5150. References: mockups/home-written-t*.png, engine-write.png.
- **Score breakdown**: the 0 to 135 scale fills to 87 in green (scaleX .644, .9 s ease-out) with a 2 px ink tick at the 60 threshold (44.4%); five layer bars fill in sequence (90 ms stagger, .9 s; Structural fit green, Pain/Timing ink-2, the rest ink-3); the callout "Qualified, scored 87, 27 points above the 60-point bar" fades in (green on dark green).
- **Inbox / reply and book**: outgoing bubble (surface-1, 1 px rule, 14 px radius) then the incoming bubble (surface-2, right-aligned), "Suggested reply" with an orange sparkle icon, then the Mon to Fri strip with "10:00" on Thursday (green chip, spring).
- **Chips with dots**: status dots pulse (opacity 1 ↔ .35, 2.4 s, 3 times) while a lead is being worked on.
- **Logo wall**: monochrome grey logos in a marquee, 40 s linear infinite, 8% fades at both edges, pauses on hover.
- **Sticky step rail**: "01 Found / 02 Written / 03 Booked" in Geist Mono 12 px; the active item turns ink and semibold with a 2 px orange bar on its left; the rail track fills with scroll.
- **Result stats**: big Outfit numbers with the unit in orange ("3x", "5x", "%", "6x"); on /results a slope chart draws from Month 1 (white dot) to Month 7 (orange dot) with a 1.2 s clip-path wipe, the end dot springing in after .7 s.
- **Buttons**: orange fill, night text, 12 px radius, Manrope 600; arrow icon (shaft "M2.5 8h10", head "M9 4.5 12.5 8 9 11.5", stroke 1.75) whose shaft draws on hover; press = 80 ms.
