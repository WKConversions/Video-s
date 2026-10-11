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
