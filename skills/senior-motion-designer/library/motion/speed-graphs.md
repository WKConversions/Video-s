# Speed graphs

The shapes of motion Karl approved (October 2026, "love them"), so a film is never one curve used everywhere. Each
one has a code, the moment it fits, what to avoid, and how to build it. A1–A7 are read from his After Effects file
`Training.aep` (`ae_refs/` in the repo, read with `scripts/ae_read.py`). B1–B17 widen the range. See the sheets,
which show the speed graph, the distance covered on each frame, and an onion skin of every frame:
`motion/speed-graphs/sheet_A.png`, `sheet_B1.png`, `sheet_B2.png`.

His instruction with the file: take it as inspiration and direction, never literally ("it can mess up the video").
So a curve is chosen for the moment, scaled to the film's tone (slower and shorter moves in a calm film), and
checked with the motion probe like everything else.

## How to choose

1. **What is the moment?** Arriving, moving on screen, leaving, handing over to the next thing, running
   continuously, keeping time, or holding. The tables below are grouped that way.
2. **What does the film's vibe allow?** Calm or clean films (K.B): no overshoot, no bounce, no anticipation, no
   impacts; whips and zoom-throughs slowed (14–16 f a half). Standard films add whips at full speed, the speed
   ramp and the stepper. Energetic or playful films can use everything, but the playful ones once or twice a film.
3. **Does the speed stay continuous?** Through a hand-off or a cut, the speed going out is the speed coming in
   (A1, A2, B16). A curve that jumps from still to fast on something already visible is a spike; the probe flags it.
4. **One graph in charge.** At any moment one movement leads; the others are followers (B9) or holds (B15).

## A · from Karl's Training.aep

| Code | Name | The graph | Use it for | Careful |
|---|---|---|---|---|
| A1 | Whip through the cut | Ease-in into the cut (influence 90% → 0.1%), the shape swaps on the fastest frame, ease-out after (0.1% → 90%); 10 f + 10 f, 500 px each side, frame steps 97 → 184 → 184 → 97 | Changing the subject while the eye follows a move: one feature to the next, a word becoming a picture, "from X to Y" | Needs motion blur on the four fastest frames; same direction both sides; calm films: 14–16 f a half |
| A2 | Drop-through (cut on motion) | A1's curve vertically, 200 px a side; on the cut the new shape starts 400 px back (above) at the same speed (74 px a frame both sides) | Replacing what's in one spot: one stat for the next, before → after, options flipping | Short halves (≈20% of the frame height) so speed hides the jump back |
| A3 | Pop in with elastic settle | 5 linear frames (scale 75 → 100% and −45° → 0 in 3), then the Elastic Controller (20 / 40 / 60): one ≈25% overshoot, settled in ≈10 f | Playful or energetic films: an icon, badge, sticker, notification, reward | Never in a clean film, on big hero elements or text blocks |
| A4 | Drop in, land, hold, drop out | Fall (ease-in), cut, linear landing with the pop, 25 f hold, exit ease-in with a 45° turn, cut, next arrival (ease-out) | A run of items taking the same spot, each with its beat: benefits, steps, places in turn | Land on a stressed word; keep a long hold alive (B15) |
| A5 | Word cascade: slide and pop | Per word: pops on 94 px high (≈0.6 em), drops in with a fast start and soft landing; even stagger; 1 s a line, ≈0.5 s a word | A headline or key line at speaking pace | Long lines: shorter word times so the line ends before the next point |
| A6 | Type-on, fast then trickling | Characters pop on (no fade) on 0.1% → 90%: a third of the line in 3 frames, the rest over the second | Typed input: search, prompt, chat, URL; a short phrase whose first word matters | Key word first; real typing wants an even pace (`Typed`) |
| A7 | Punchy title pop | The line jumps 100 px in 3 f with a −10° tilt and the elastic settle; words cascade at twice A5's speed (0.5 s) | Energetic hooks, a CTA, the one claim that must hit | Not calm or premium; once a film |

What his file teaches beyond the curves:
- **Transitions are speed-matched.** Every cut in the file sits on the fastest frame, and the incoming move starts
  at the speed the outgoing one reached. The change of shape happens where the eye can't follow details, so the
  film reads as one movement. That's the "never spikes frame to frame" rule from the inside: the speed builds over
  10 frames and comes down over 10, with no jump.
- **Exits accelerate, arrivals decelerate.** Nothing leaves on an ease-out or arrives on an ease-in.
- **A beat is fall, land, hold, leave** (A4), and the hold is where the voice-over speaks.
- **Short and decisive.** 10 frames a half, 3–5 frames for a pop. Durations scale with the film's tone; the shape
  stays.

## B · moving and arriving

| Code | Name | The graph | Use it for | Careful |
|---|---|---|---|---|
| B1 | Easy ease | A plain bell (33% / 33%), 12–20 f | Something on screen moving somewhere new: re-ordering, making room, resizing | Arrivals from off screen (hesitant); generic if every move uses it |
| B2 | Long S | Sharp peak in the middle (80% / 80%), 24–40 f | A big deliberate move: a pin from city to city, a phone from one half to the other, a product turning | Small UI moves; busy frames; blur the middle |
| B3 | Soft start, long settle | Leaves rest gently, peaks early, long landing (40% / 85%), 18–26 f | Clean films: something that sat still starts moving; a slow push in on a detail | Too polite for energetic films and for entrances |
| B4 | Natural spring | Up to speed in 2–3 f, exponential settle, no overshoot (`spring({damping: 200})`, ≈23 f) | Things following things: a highlight between items, a cursor, a selection box | Ending on a beat: the tail is long, so time the beat at ≈80% |
| B5 | Single overshoot | Fast arrival, ≈10% past, back once, 12–18 f | Energetic films: a price tag, badge or stat landing, a chip snapping into a row | Never in clean films; small things only |
| B6 | Anticipation | Pulls back 6% over 5 f, then launches (to speed in 2–3 f) over 10–14 f | An action someone triggers: a button launching something, a message sent, a swipe | Corporate and clean films; anything not caused; text |
| B7 | Accelerate into an impact | Speeds up into contact and stops on it (≈3× the average speed at the end), 6–10 f, then a hold | A stamp, a word slamming in on the stressed syllable, a pin punched into a map, a check hitting a box | Clean films; never the camera; follow with stillness, not a shake; the sound lands on the stop |
| B8 | Gravity drop with bounces | A straight ramp of speed (falling), two shrinking bounces, 16–26 f | A physical thing dropped: a parcel, a coin into a jar, a pin onto a map (one small bounce) | Corporate, premium, text; more than two bounces is a cartoon |
| B9 | Follow-through | A leader on `EASE.lead`; its label and details follow 3 and 6 f later on `EASE.follow` | Anything made of parts: a card with its label, a pin with its city name, a chart with its numbers | More than 6 f behind reads as separate arrivals: the busy look |

## B · continuous, rhythm and transitions

| Code | Name | The graph | Use it for | Careful |
|---|---|---|---|---|
| B10 | Constant speed | A flat line; the start and end are off screen | A logo ticker, a feed or conveyor, a turning dial, a plane cruising a route, background drift | Anything that starts or stops in view; 40–150 px/s behind the message |
| B11 | Linear with soft ends | Steady middle, short eases at the ends, 30–90 f | Progress: a bar filling, a route drawing on a map, a count-up, a long scroll | Arrivals; moves under 12 f |
| B12 | Fast–slow–fast | High at both ends, a long low middle: the middle half of the time covers ≈20% of the distance, 30–60 f | A pass-through: a card gliding past, a word whipping in, held while spoken, whipping out | Clean films where things settle; one ramp at a time; blur the ends |
| B13 | Step, hold, step | Repeated quick ease-outs with holds between (5–8 f a step, holds of 8–20 f or the beat) | A highlight stepping down a list, steps 1 → 2 → 3, a digit ticking, days flipping | A long hold with nothing alive; uneven steps unless the voice-over is |
| B14 | Finger flick | A push that builds to full speed in 3 f, then an exponential coast (20–40 f) | Real interface gestures: a feed scrolling in a phone, a carousel swipe, a map flicked | Non-interface objects |
| B15 | Breathing hold | Gentle humps of a slow sine: 2–20 px, a 2–4 s period | Holds: the camera's breath, floating cards, a gently pulsing pin | Anything that must read as resting (the final logo) |
| B16 | Zoom-through | A1 in scale: grows ×4 into the cut on `whipIn`, the next scene grows from 25% to 100% on `whipOut`; the zoom speed matches | Going inside something: the phone screen, a map pin, the dot of a logo, a document | The element zooms, never the camera (a camera zoom release was a K.B spike); once a film |
| B17 | Sweep and hold | Ease-in-out passes with rests at the ends, 15–20 f a pass | A before/after slider, a scanner line over a document, a toggle shown both ways | More than two passes; fast sweeps |

## Measured on Karl's 11 October 2026 references

Six films he sent for their text and their smoothness (`references/benchmarks.md`), measured on every frame. The
steps per frame were seen; the curve names are fitted to them. f is a frame of the reference: 30 fps, except
CrowdReply (25) and Payy (60).

| Ref | Time (s) | Move | Frames | Curve | Peak |
|---|---|---|---|---|---|
| ref28 | 0.03–1.00 | Prompt bubble rises; the film opens mid-move | 30 | Exponential ease-out 12, 15, 11, 8, 7, 6, 5, 4… px/f, 100 px; its 0.5 px/f tail runs into the exit | 15 px/f |
| ref28 | 3.30–4.37 | Reply bubble arrives from below | 32 | Exponential ease-out 102, 73, 56, 45, 37, 31, 26… (×0.8 a frame), 500 px, no blur | 102 px/f |
| ref28 | 5.17–5.87 | Claim line glides while words pop on | 21 | One exponential ease-out 37, 16, 11, 9, 7, 6, 5, 4…, never restarted, 118 px | 37 px/f |
| ref28 | 8.17–8.53 | Logo mark scales in | 11 | Exponential ease-out, diameter +73, +19, +10, +5, +4…, no overshoot | 73 px/f (diameter) |
| ref29 | 6.36–7.48 | Whip pan to the send button, cursor pinned | 10 + 15 | Expo-in 1.6 → 52.6 px/f (×1.3 a frame), 3–4 blurred frames, expo-out 173, 132, 92, 69, 54… (×0.73) | 173 px/f |
| ref29 | 17.48–19.32 | Logo tile slides in, later drops out | 19; 9 | In: from 163 px/f at ×0.86 a frame, 940 px; out: expo-in ×1.5 a frame, 5 → 301 px/f | 301 px/f |
| ref29 | 22.16–22.72 | Verdict pill grows from a dash | 15 | S-curve in width +20, +29, +43, +68, +101, +90, +55, +35, +24…, no overshoot | 101 px/f |
| ref29 | 27.96–29.96 | Vertical whip, scene swapped at the peak | 16 + 33 | Expo-in ×1.3 a frame to about 181 px/f, swap on the fastest frame under heavy blur, expo-out ×0.86 a frame | 181 px/f |
| ref30 | 1.87–2.97 | Panel lifts into a cut; the bubble rises after it | 9 + 24 | Ease-in 1, 1, 2, 4, 5, 7, 12, 20, 43; cut; ease-out 27, 17, 11, 9, 7, 5, 4… | 43 px/f |
| ref30 | 19.93–20.77 | Destination word eats the line into a cut | 24 | Exponential ease-in 1, 1, 2 … 20, 23, 29, 36, 46, 62, 87; cut on the fastest frame | 87 px/f |
| ref30 | 21.37–22.20 | Answer card lands at 105% and settles | 25 | Exponential ease-out in width 8, 6, 5, 4, 3… px/f, never below 100% | 8 px/f |
| ref31 | 0.53–1.13 | Word shrinks into the cut, the logo keeps shrinking after it | 9 + 10 | Ease-in −0.3 … −5.3, −11.6, −6.3% a frame; cut; ease-out from −6.2% a frame (−4.8, −3.7, −2.8…), matched to the frame before the cut | 11.6%/f (one frame) |
| ref31 | 8.20–9.13 | Camera push ×2.0 to the send button | 28 | Expo in-out from rest to rest, half the zoom in 3 frames, the peak frame on the beat (8.68) | 20%/f |
| ref31 | 16.73–17.37 | Sign-off line slides in after a cut | 20 | Exponential ease-out at ×0.83 a frame: 23, 18, 15, 12, 10, 9, 8, 6… | 23 px/f |
| ref32 | 11.07–11.72 | Two pills fly in and meet | 18 | Pure exponential ease-out 109, 100, 74, 55, 43, 35, 28 … 1; crisp at 60 fps without blur | 109 px/f |
| ref32 | 23.25–23.80 | Banner flattens edge-on into the cut; the next card opens from edge-on | 11 + 19 | Ease-in −2, −5, −8 … −93, −162 px/f in height; cut on the thinnest frame; ease-out +76, +64, +46… | 162 px/f |
| ref33 | 1.00–2.00 | Frame follows the typing caret | 29 | Up to the peak in 8 f, then exponential decay (×0.81–0.92 a frame); cut while still at 16 px/f | 198 px/f |
| ref33 | 16.30–16.57 | Small UI snap and settle (pill to exploded view) | 9 | 60–75% of the distance in 2 f, then exponential: 2, 138, 140, 39, 19, 15, 2… px/f | 140 px/f |
| ref33 | 17.40–17.97 | Status shimmer | 17 | Linear, constant 30 px/f: the only linear motion in the film | 30 px/f |

What they support, alongside A and B above:
- **Arrivals start at speed and decay by a constant ratio.** Nearly every measured arrival is an exponential
  ease-out whose first frame is its fastest, on the first frame after a cut or coming from outside the frame, never
  from rest in view (the exceptions ramp up over 2–8 f first: Morphic's tile row, Sidekick's caret pan, the
  cursors). The speed falls by a ratio of 0.65–0.92 a frame (about ×0.8 is typical): 90% of the travel in 10–15 f,
  then a tail of 18–40 f at 0.5–2 px/f. The tail is the hold: the next move's ease-in starts from it, so before
  Payy's end card no still point lasts more than 0.30 s. This is `ARRIVE` and B4, starting at the cut's speed (A1,
  A2).
- **Exits accelerate, and are shorter.** Every exit is an ease-in (×1.15–1.5 a frame) over about half the frames of
  its arrival: CrowdReply's tile 9 f out against 19 in, Sidekick's blur swap 6 f out against 15 in, its menu 1–2 f
  out against 8 in.
- **Under a voice, land long.** CrowdReply's scene whips launch in about 16 f and land in about 33 f, so the new
  scene is readable as the next phrase starts: A1 with a landing twice its launch, for scene changes in a
  voice-over film.
- **No overshoot anywhere.** Not one bounce in the six, measured on pills, logos, cards and type; the answer card
  arrives at 105% and settles down without passing its size (`motion/easing.md`).
- **The fastest frame hides the change.** Cuts sit on the fastest frame and carry the direction (Grok Bot 22 → 27
  px/f upward, Team Bots 43 → 27, Payy 38 → 33, Morphic −6.3 → −6.2% a frame in scale, its fastest frame of −11.6%
  one frame before the cut). Reveals use the same frame: the wordmark pops on at the peak of the mark's slide, and a
  push's peak hides a line being removed. Where the speed jumps across a cut (Grok Bot 3.27: 30–62 → 102 px/f across
  a blank frame), the hand-off is one of that film's weaker moments.
- **The peak on the beat, not the landing.** In the music-only films a push's or whip's fastest frame sits on the
  beat (Morphic 6.10 on 6.11, 8.68 on 8.68); the landing follows.
- **Blur only where speed lasts.** At 30 fps, flat type and UI moved at 87–102 px/f without blur (Grok Bot, Team
  Bots) because the peak lasts 1–3 frames at the head of an exponential. Sustained whips of 170–180 px/f carry blur
  (CrowdReply: a smear about 15% of the frame's travel, about a 55° shutter). At 60 fps (Payy) flat shapes stay
  crisp at 100 px/f. Sidekick's caret pan reaches 198 px/f with no blur, so blur is a choice, not a necessity. A1's
  blur on its four fastest frames stands.
- **Small UI may snap.** Sidekick's state changes cover 60–75% of the distance in 2 frames and settle in 4–7 (6–9 f
  in all), on a locked frame and on small elements only. On a large element or the camera the same curve is the
  K.B spike; in a calm film stretch it to 10–14 f.
- **Linear only for what never starts or stops in view.** Constant speed appears only in the status shimmer
  (10–30 px/f), Morphic's media orbit cruising at 7–18 px/f and CrowdReply's sources panel scrolling at 0.8 px/f
  (B10).

## Building them

In Remotion everything is in `scripts/kinetic.tsx`: the named curves in `EASE`, and the helpers `whip` (A1, A2),
`popElastic` and `aeElastic` (A3, A4, A7), `bounce` (B8), `speedRamp` (B12), `stepper` (B13), `flick` (B14),
`zoomThrough` (B16) and `breathe` (B15). B4 is Remotion's own `spring({frame, fps, config: {damping: 200}})`.
`ARRIVE`, `MOVE` and `DEPART` stay the defaults for a film's signature moves (`motion/easing.md`); these widen
the vocabulary for the moments that need something else.

In After Effects each card gives the keyframe influence and speed. `scripts/ae_read.py` reads any .aep Karl sends
and prints every move with its frame steps, the Remotion equivalent of each ease and how the layers hand off.

Check every build with the motion probe (`scripts/motion_probe.py`): a whip whose speed builds and falls passes;
a curve that starts at full speed on something already visible is a lurch.
