# Designed, not generated

The goal for every video: the viewer thinks "that was a clever way of communicating the idea", not
"that was a lot of animation". Concept first, motion second, effects last. Prefer intentional art
direction and strong visual concepts.

## AI motion-design fingerprints

Avoid these defaults. None is forbidden outright, but each needs a reason in this script:

- everything centered, everything floating, perfect symmetry everywhere,
- excessive rounded cards and pills, floating UI panels, generic SaaS dashboards,
- UI when no interface is being discussed,
- every scene built from text plus an icon; an icon for every noun; repetitive icon grids; the
  literal noun of every sentence shown,
- animating every word of the voice-over; excessive text on screen,
- too many tiny UI elements; every scene at the same visual density,
- identical layouts, identical gradients and identical backgrounds from scene to scene,
- the same entrance everywhere: repeated scale-in, repeated fade-up; every object bouncing; every
  transition zooming,
- random gradients, excessive glow, a black background with white type and a blue-purple glow,
- random particles, floating dots and circles, glowing lines and constellations, procedural grids
  and tiled patterns,
- meaningless parallax, endless morphing, generic futuristic styling,
- huge words every few seconds, and a showreel structure ("now typography, now particles, now a UI,
  now a morph, now the logo"),
- decorative elements without a communication purpose, and effects compensating for weak layout,
- a sound effect on every movement.

Beyond motion, the same reflexes show up in data, layout and words: invented figures and names,
decorative labels, three equal cards, hollow copy. `evaluation/tells.md` is the test for all of them:
a pattern stays only when the film's thesis names it.

## Count them

A fingerprint is about frequency and uniformity: one instance can be a choice, the same instance
everywhere is the tell. Count across the storyboard and the test frames, and redesign when a count is
reached:

| Pattern | Flag when |
|---|---|
| The same entrance (fade-up, scale-in, blur-in) | on 3 or more elements in one scene, or opening 3 scenes in a row |
| Blur-in on every entering element | 3 or more distinct elements in one scene enter blurred without moving; blur belongs to fast moves |
| Stagger cascades | 2 or more groups in one scene cascade; one cascade is a moment, two are a habit |
| Looping attention motion (pulsing dots, breathing buttons, glowing rings) | any instance; the CTA gets a click, not a pulse |
| Springs with bounce | any bounce outside a playful film |
| Motion on content that should just be there (captions, body text, labels) | the move carries no meaning and delays reading |
| Scale-from-zero pops | any instance (`motion/animation-grammar.md`) |
| Every scene centered, or every scene built on cards | beyond the variety budget (`design/composition.md`) |

The vocabulary of the film's direction (the interface direction's cards and pills, the gradient
direction's glass and cables) counts as a reason, as long as it shows the client's real product and
numbers, never generic stand-ins, and stays within the variety budget in `design/composition.md`.

## Principles

- **Message before motion.** For each line, decide what it communicates and the clearest visual for
  it, then how it moves. Never pick a technique first and force the message into it.
- **Vary the structure, keep the language** (what varies and what stays: `design/composition.md`).
- **Morph with meaning.** A transformation represents progress in the message (a customer becomes an
  interaction, a conversion, measurable growth), never circle to chart to button to cube to logo.
- **Natural timing.** Anticipation, overlap, follow-through, delayed reactions, uneven and
  accelerating timing. Land key hits exactly and let the rest move around them.
- **Technique budget.** Use often: position, scale, masks and reveals, object transformation, camera
  moves, motion blur on fast moves, opacity, shape changes, continuity, anticipation and
  follow-through, depth, perspective, parallax that shows real depth. Use sometimes: kinetic type
  beyond word builds, path animation, morphing, blur as a transition, rotation, data visualization.
  Use rarely, and only when the concept needs it: particles, neon glow, procedural grids, random
  geometry, generic interface interactions, liquid effects, 3D spins, heavy springs, glitch,
  decorative text staggering.
