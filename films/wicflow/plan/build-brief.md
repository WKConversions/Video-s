# Wicflow hero film: build brief for the beat builders

You are animating part of a 33.0 s, 1920×1080, 60 fps hero explainer film for Wicflow (custom AI systems for
companies, built in blocks). Karl van Kessel (WKConversions) approved the storyboard; now it moves. You turn the
storyboard's static key frames for your beats into smooth, continuous motion, timed to a new, faster voice-over.

## What already exists (read these first, in this order)

- `films/wicflow/plan/storyboard/storyboard.json`: the approved storyboard v2. For each of YOUR beats read
  `visual`, `motion`, `transitionOut` and `frames[].draw`. Its times are for an old 37.6 s cut: **ignore its
  absolute times** and retime everything to the spans and words below. Keep its ideas, objects, colours,
  compositions and the order of events.
- `films/wicflow/plan/storyboard/site/frames/*.jpg`: the key frames as pictures (view them; they are the look).
- `films/wicflow/film/src/engine/kit.js`: the storyboard's drawing engine as one ES module. GENERATED: never edit
  it. It has the isometric block world (`world`, `renderBlock`, `P`, `geom`, `topFaceCardOrder`, `namedState`,
  `solidNamed`, `litWorld`, `lightLine`, `LINES`, `spark`, …), the UI helpers (`cardAt`, `cardMorph`, `quoteBody`,
  `mapWindow`, `mapBody`, `planCard`, `planRow`, `autoPanel`, `signedDoc`, `hoursFlowCard`, `reportCard`, `lockup`,
  `pill`, `tile`, `icon`, …) and `FRAMES[id]()`, which draws each storyboard key frame (look at how each key frame
  is composed: your animation passes through those states). Most helpers already take state parameters
  (`quoteBody({quiet, ring})`, `mapBody({fill, scanX, found, flow})`, `planRow(key, cy, {lit, grow, plate, …})`,
  `autoPanel({draft, ready, sheen, quote, pulse})`, `lockup({wordOp, line, cta, sheen})` …): animate by driving
  those parameters with time. When a helper can't do what you need, COPY it into your beat file and extend it there.
- `films/wicflow/film/src/engine/anim.js`: the motion helpers (`E`, `ease`, `pop`, `popOut`, `wobble`, `drift`,
  `seg`, `mix`, `mixP`, `DASH`). Read its header.
- `films/wicflow/film/src/timeline.js`: `SPANS` (which beat draws when), `w(word, n)` / `we(word, n)` (voice-over
  word start / end times). `films/wicflow/film/src/film.js`: assembles the frame.
- `films/wicflow/film/src/beats/B1.js … B9.js`: one module per beat. Right now each is a PLACEHOLDER that shows
  the storyboard key frames as a slideshow. You replace the ones you own.

## The contract for a beat module

```js
import * as K from '../engine/kit.js';
import { E, pop, popOut, wobble, drift, mix, mixP, seg, DASH } from '../engine/anim.js';
import { SPANS, w, we } from '../timeline.js';
export const HAND = [];            // the 3D hand's keys in this beat (only B1 and B9 use the hand; see below)
export function draw(T) { ... }    // T = FILM seconds (not beat-local). Return the frame's inner SVG markup
                                   // (it is wrapped in K.svgDoc, which adds the background and shared defs).
```

- `draw(T)` is called for every frame with T in the beat's span. It must be **pure and deterministic** (only a
  function of T: no Math.random, no Date, no state kept between calls; use a seeded hash if you need variety) and
  **fast** (aim under 60 ms a frame in the previewer; avoid stacking dozens of large blur filters).
- Extra `<defs>` can go inline in the markup. Use `K.uid()` for any id you create (it is reset every frame, so ids
  stay stable from frame to frame).
- Files you OWN: only the beat files named in your task (and, if you want shared helpers between your own beats,
  one extra file `src/beats/<your group letter>_shared.js`). Do not edit any other file. Do not run
  `npm install`. Do not commit; the lead commits.

## The voice-over (Christina, energetic) and the new spans

Words with start times (film s):
Quotes 0.00 go 0.40 quiet 0.62 · Enquiries 1.76 pile 2.18 up 2.64 · Hours 3.50 get 3.78 typed 4.04 in 4.28 twice
4.50 (ends 4.86) · Off 5.66 the 5.94 shelf 6.06 software 6.22 never 6.76 quite 7.22 fits 7.62 (ends 8.04) · First
8.80 we 9.46 map 9.60 where 9.88 the 10.10 time 10.22 goes 10.48 (ends 10.76) · A 11.36 costed 11.52 plan 11.92 ·
Highest 12.76 return 13.16 first 13.64 (ends 13.86) · First 14.48 block 14.78 guaranteed 15.42 (ends 15.74) · Not
16.46 as 16.62 agreed 16.76 you 17.50 don't 17.64 pay 17.78 (ends 18.02) · Then 18.62 it 18.96 runs 19.24 · No 20.18
open 20.40 quote 20.78 goes 21.06 quiet 21.36 (ends 21.72) · Block 22.40 by 22.52 block 22.74 each 23.32 priced
23.62 in 23.94 writing 24.20 (ends 24.50) · One 25.14 system 25.44 all 26.26 of 26.52 it 26.64 connected 26.74
(ends 27.12) · Let's 27.74 find 27.94 the 28.10 first 28.22 thing 28.42 to 28.60 build 28.74 (ends 28.98).

Lines of the old script that are NOT in this read (show them in pictures only, or drop them): "We build around how
you work" (B2), "before we start" (B7), "Book an AI mapping" (B9: the button still reads "Book an AI mapping").

| Beat | Span (film s) | Old span | VO in the span |
|---|---|---|---|
| B1 The real work | 0.00–5.45 | 0.0–3.6 | Quotes go quiet. Enquiries pile up. Hours get typed in twice. |
| B2 Off the shelf never fits | 5.45–8.60 | 3.6–7.6 | Off-the-shelf software never quite fits. |
| B3 The AI mapping | 8.60–11.20 | 7.6–11.2 | First, we map where the time goes. |
| B4 The costed plan | 11.20–14.30 | 11.2–15.2 | A costed plan. Highest return, first. |
| B5 First block, guaranteed | 14.30–18.45 | 15.2–19.4 | First block, guaranteed. Not as agreed, you don't pay. |
| B6 Inside the block, it runs | 18.45–22.20 | 19.4–23.2 | Then it runs. No open quote goes quiet. |
| B7 Block by block | 22.20–25.00 | 23.2–27.0 | Block by block, each priced in writing. |
| B8 All of it connected | 25.00–27.55 | 27.0–30.8 | One system, all of it connected. |
| B9 End card + CTA press | 27.55–33.00 | 30.8–35.8 | Let's find the first thing to build. (then no VO: the hand presses the button) |

**NO LOOP** (Karl): the film ends on the end card after the hand presses "Book an AI mapping". The storyboard's
B10 (back to the work) is cut, and nothing at the end unbuilds or fades back to the opening.

Show each line's meaning **when it is spoken**: put the visual event of a phrase on its key word (quiet, pile,
typed/twice, fits, map, time goes, costed plan, highest/first, block/guaranteed, don't pay, runs, quiet, block by
block, priced/writing, connected, build). Show the change ON the word, not seconds before or after it.

## Hand-off states (the seams between builders: match them EXACTLY)

At each seam the last frame of one beat and the first frame of the next must be the same picture, so the cut is
invisible. These are the states (call them at T = the seam time):

- **8.60 (B2 → B3):** the clean, measured wire world, centred at scale 1, nothing else on screen:
  `K.world({ def: { w: { wire: 1 }, dash: '3 4', wireOp: 0.55, dashOff: DASH(T) } })`.
  B2 ends there (the scan band, ticks and slab are gone by 8.60); B3 opens from it (the faces lift into tiles).
- **14.30 (B4 → B5):** the ranked plan card, flat and still, no sheen:
  `K.planCard() + K.planLines() + ['quote','enq','cust','hours','report'].map((k, i) => K.planRow(k, K.SLOT[i], i === 0 ? { hi: true, tag: true } : { op: 0.62 })).join('')`.
  B4 ends there; B5 opens with the card tilting back onto the floor.
- **22.20 (B6 → B7):** back out in the world at scale 1, block 01 lit:
  `K.world({ def: { w: { glass: 1 } }, blocks: K.namedState({ '01': { w: { peri: 1 }, num: '01', glowMul: 1.2 }, '06': { w: { wire: 1 }, dashOff: DASH(T) } }) })`.
  B6 ends there (its reverse zoom-through has fully settled by 22.20); B7 opens from it.

Inside your own group, design the seams yourself, but the same rule holds: no jump, no pop, no blank frame.
A wire block always uses `dashOff: DASH(T)` (one clock for the marching dashes, across the whole film).

## Karl's motion rules (these decide whether the film passes)

- **Smooth and constant, at a calm pace you can follow, never linear.** Karl's words on earlier films: "the
  animations go much too fast and too linear… flash… still… It should be constant, at a calm pace, but not
  linear"; "it has to glide in gradually, smooth, everything slides out, fluid"; "sometimes shaky". So: every
  movement eases in AND out (`E(..., 'inOut' | 'smooth')`), nothing starts or stops abruptly, no flashes, no
  strobing, no shaking.
- **Everything bounces a bit:** every OBJECT arrival, morph, slide, scale or swap uses `pop` (small overshoot:
  `over` 0.03 for big surfaces such as a window, a card or the world; 0.06–0.1 for small things such as a chip, a
  dot, a check, a stud). The CAMERA never bounces: a move of the whole world or the whole frame (zoom, scale,
  pan) uses `E` with 'inOut' or 'smooth', no overshoot.
- **Never a still frame.** Something purposeful always moves: marching dashes (`DASH`), a slow drift (`drift`),
  pulses running along lines, a breathing glow. The background stays calm and still; all motion is in the
  foreground.
- **A new visual event every 0.5–0.8 s**, but each one stays readable: nothing appears for less than 0.5 s, and
  any text holds at least 1.2 s once fully in.
- **Text budget:** no words outside the product UI except the three text moments already in the storyboard (B5
  "First block · guaranteed", B8 "All of it connected", B9 the end lockup). UI text stays small and only where a
  real interface shows it. No figures, no invented numbers or claims. Do not add any new words.
- **Flourishes:** Karl loves small motion-design surprises (on an earlier film, a coloured smear trailing a fast
  move). Give each of your beats ONE tasteful flourish of its own, in Wicflow's colours (periwinkle #6172F3 /
  lavender #B9C1FF, peach for time, orange only for "doesn't fit"): a light trail behind a fast move, a sheen, a
  ripple when something lands, a burst of sparks on a connection. Never the same flourish twice in the film.
- Transitions grow out of objects (cards become block faces, faces become tiles, the plan lies down as the
  ground…), never a cut to a new slide. A zoom-through may be fast (about 0.25–0.3 s) but must still ease.

## The 3D hand cursor (only B1 and B9)

Remotion draws Karl's 3D hand on top of your SVG from your `HAND` keys. You only give the keys and make the UI
react. A key: `{ at, x, y, click }` (film s, screen px of the TARGET in the 1920×1080 frame). How the hand moves:
- it glides from key to key in one eased move that takes `glideTime(d) = max(0.55, min(1.6, 0.45 + d/1000))` s
  for a distance of d px, and arrives about 0.5 s before `at` when there is room;
- for a click key, the fingertip is exactly on (x, y) at the DEEPEST point of the click, at `at + 0.11` s: make the
  clicked thing react at that moment (press in, then respond);
- it leaves a click key only `0.32` s after `at`, so two clicks need at least `0.32 + glideTime(d)` s between their
  `at` times (otherwise the glide gets compressed: a fault);
- to enter, start with a key off-screen (for example `{ at, x: 2150, y: 1250 }`, no click) and to exit end with
  one; the hand is visible only between the first glide and the last key (plus its glide).
Use the hand only for MANUAL work (B1: a person re-typing hours by hand) and for the final CTA press (B9). The
automation beats (B6, B7) have no hand: that contrast is the point.

## How to check your work (do it; you can't watch video, so measure)

From `films/wicflow/film`:
- `node tools/frames.mjs sheet <t0> <t1> <n> out/dev/<name>.png [--hand]`: a contact sheet of n frames (480 px
  tiles, 4 per row; prints the time of each tile). View it with Read. `--hand` marks the hand's targets in pink.
- `node tools/frames.mjs clip <t0> <t1> out/dev/<name>.mp4`: a 960×540 60 fps clip; then
  `python3 tools/flow.py out/dev/<name>.mp4` prints JERKS (sudden starts, stops and speed changes) and a profile
  of how much of the picture changes per frame. Fix every JERK line in your span except a deliberate zoom-through;
  watch for flat stretches in the profile (near 0 = a still frame) and spikes (a flash or a jump).
- `node tools/frames.mjs png <t> out/dev/<name>.png`: one full-size frame, to check details.
- Check each seam you touch: a sheet of the 4 frames around it (seam − 2/60 … seam + 1/60) must show no jump.
- Keep scratch output in `films/wicflow/film/out/dev/` (gitignored) and delete big clips when done: the disk is
  small.

When done, reply with a short report: what each beat now does (the main events with their times), your HAND keys
(if any), the seams you checked, the flow.py result, and anything you could not solve.
