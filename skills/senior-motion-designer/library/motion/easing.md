# Easing

## Choose easing by intent

The full vocabulary is `motion/speed-graphs.md`: 24 speed graphs Karl approved, each with its moment (A1–A7 from
his After Effects file, B1–B17 beyond it), all built into `scripts/kinetic.tsx`. The short version:

- **Decisive arrival:** strong, controlled ease-out; a confident, readable finish, good for type and UI.
- **Launch or departure:** ease-in, building momentum.
- **Neutral repositioning, moves and reframes:** a symmetric ease-in-out.
- **Mechanical or system motion:** cleaner and more uniform.
- **Organic physical response:** a subtle overshoot only where justified.
- **Premium UI:** restrained, precise easing with limited rebound.
- **Spring:** only when a physical or playful character warrants it.

Linear motion only where the visual logic calls for constant velocity: time itself as the subject
(countdowns, playheads). Never elastic or bounce as decoration.

## No overshoot in a clean film

In a calm, clean or professional film (K.B, approved), nothing pops past its size and springs back:
everything arrives on a smooth ease-out (`ARRIVE`). Karl read the pops as spikes. Overshoot belongs to playful
and energetic briefs, and even there on small things only (a badge, a like). `scripts/motion_probe.py` flags an
element that appears, grows past its size and springs back.

## Default curves

These worked in the WKConversions builds and suit most films; styles and brands can override them:
- arrive: `cubic-bezier(.22,1,.36,1)`, a fast start and a long, soft settle,
- depart: `cubic-bezier(.64,0,.78,0)`,
- move / reframe: `cubic-bezier(.65,0,.35,1)`.

The signature curve covers about 80% of the moves in a film (`motion/motion-identity.md`); depart
and move cover most of the rest.

## Springs

A spring suits physical response (a card settling into a stack, a pressed button releasing). In
Remotion, `Easing.spring({damping: 200})` is a push without bounce; with `spring()`:

| Feel | stiffness | damping | Use |
|---|---|---|---|
| Stiff, no bounce | 300–400 | 30 | premium UI settles |
| Standard | 250 | 20–24 | small physical responses |
| Gentle | 100–150 | 20–25 | large, heavy settles |
| Bouncy | 150–250 | 10–15 | playful films only |

## Material

What a thing is made of sets its motion: rigid objects (glass, metal, a device) move a little slower
with no overshoot; paper-like cards 3–5% overshoot at most, and none in premium films; soft or
liquid shapes can lag and stretch slightly, and smoke or light moves slowest.

## Treat curves as authored motion

Inspect velocity rather than trusting a default ease. Anchor points matter as much as the curve: set
them before animating scale or rotation.

## Velocity continuity

When one object becomes another or crosses a cut, match its perceived velocity. Abrupt velocity
changes make a transition feel assembled instead of continuous. Karl's own transitions (Training.aep, A1 and A2 in
`motion/speed-graphs.md`) do exactly this: the outgoing move speeds up for 10 frames (influence 90% → 0.1%), the
cut sits on the fastest frame, and the incoming move starts at that speed and slows for 10 frames. Exits
accelerate, arrivals decelerate.
