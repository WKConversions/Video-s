# Motion identity

Decided once per film at the art-direction step, before any scene is animated, so every move in the
film belongs to one world. The brand or the chosen style usually decides it; this module turns that
into numbers the build can follow.

## Pick one personality

| Personality | Feel | Signature curve | Overshoot | Paths | Fits |
|---|---|---|---|---|---|
| **Precise premium** | calm, exact, expensive | arrive `cubic-bezier(.22,1,.36,1)` | none | straight or gently arced | premium SaaS, agencies, finance, WKConversions |
| **Clean corporate** | clear, efficient, predictable | `cubic-bezier(.2,0,0,1)` | 0–3% | mostly straight | enterprise, B2B dashboards, healthcare |
| **Energetic** | bold, fast, punchy | expo-out `cubic-bezier(.16,1,.3,1)` | up to 10%, on impacts only | long diagonals | sports, events, launches, social ads |
| **Playful** | friendly, bouncy, warm | back-out `cubic-bezier(.34,1.56,.64,1)` | 10–20% | arcs everywhere | consumer apps, kids, food |

One personality carries at least 90% of the film. A single moment may borrow another (a success
check in an otherwise precise film), and the change is eased into, never snapped. WKConversions and
the library's three directions are precise premium: no bounce, no elastic (`brands/wkconversions-brand.md`).

## The three constants

Write these into the production plan's project direction and into the build's motion tokens
(`production/remotion.md`):

1. **Signature curve**, used for about 80% of moves. The rest use the depart and move curves
   (`motion/easing.md`).
2. **Duration palette**, three tiers in frames at 30 fps. Precise premium: quick 6–8, standard 12–16,
   slow 24–36. Every duration in the film comes from the palette, scaled by distance
   (`motion/timing.md`).
3. **Entrance pattern**, the film's default arrival: for precise premium, from outside the frame on
   the arrive curve with motion blur, or out of depth from about 70% scale. Scenes still vary their
   entrances (`motion/animation-grammar.md`); the pattern is the language, not a template.

## Intensity by moment

Inside the one personality, the intensity follows what the moment is for. Three schools of
interface motion give the calibration:

| Moment | Calibration | What it looks like |
|---|---|---|
| **Interface at work** (a tap, a status flipping, a row reordering, a tooltip) | Emil Kowalski: motion nobody notices | 2–6 px of travel, 4–6 frames, a critically damped settle, no blur, no scale, no rotation |
| **Storytelling** (a scene forming, a card arriving, a reveal, a transition) | Jakub Krehel: every element gets a moment on stage | 8–16 px of travel plus a blur of 4–8 px that sharpens as it lands, 10–15 frames, a 2–3 frame stagger, masks and layered depth |
| **Celebration** (the payoff, a success, the end card's button) | Jhey Tompkins: delight, used once | scale, a small rotation, colour, a drawn stroke; the one place the film may overshoot |

The interface stays in the first row even in an energetic film: a button that bounces reads as a
toy. Storytelling carries most of a film; celebration appears once or twice, where the voice-over
lands its promise.

**Staging.** While the hero moves, the rest of the frame steps back: siblings dim to 40–60% or soften
with 2–4 px of blur, and come back as it settles. **Depth by speed:** in a parallax or camera move the
foreground travels 1.0×, the middle 0.5×, the background 0.2× (0.1× for a texture or a sky).

## Emotion to motion

Use the beat's tone from the script analysis (`planning/script-analysis.md`) to adjust tempo and path
inside the personality, never to switch personality:

| Tone | Tempo | Path | Curve bias |
|---|---|---|---|
| Frustration, problem | cramped, stuttering, things pile up or fail | short, blocked, falling | depart, abrupt stops |
| Relief, solution | opening up, one clean move | long, unbroken | arrive, long settle |
| Confidence | direct, decisive | straight, horizontal | strong ease-out |
| Urgency | fast, sharp | straight lines | quick tier |
| Pride, proof | measured, with a hold | upward, settling | slow tier |
| Curiosity, hook | a question held open | toward the unknown, a reveal | anticipation, then release |

Direction carries meaning too: up reads as growth, down as settling, left to right as progress,
toward the center as focus, away from it as release. Use it when it agrees with the line; don't
fight the spatial layout to get it.

## Weight

Heavier things move shorter and slower and settle longer; lighter things are quicker. A full-frame
card or a browser window is heavy (standard to slow tier, no overshoot); a pill, cursor or icon is
light (quick tier). Mixing weights in one move is what makes a scene feel physical.
