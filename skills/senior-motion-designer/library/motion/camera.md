# Camera and depth

## Smooth before everything: the camera only breathes

Karl's rule from K.B (October 2026), the film the client called great: the camera breathes, it never
lurches. A camera that pans or zooms on a transition reads as a spike, however short: "out of nowhere
starts going right, like a spike" (a linear camera segment that started at full speed), "the frame
spikes out of nowhere" (a 5% zoom released in 0.6 s on a scene change), "too fast and spiky" (a 16%
zoom on a scene while its cards popped).
- **One slow breath for the whole film:** a push and drift of a few percent over many seconds (K.B v3: scale
  1.02 ± 1.8% over a 21-second cycle, drift ± 20 px over 17 s), easing to rest before the sign-off. No
  per-beat push-and-release, no lean towards a point on a transition, no linear camera segments.
- **Limits, measured:** the camera never pans faster than about 30 px/s or zooms faster than about 6%/s in
  a calm or clean film (v3: 25 px/s and 5.3%/s; the spikes Karl named: 176–564 px/s and 15–19%/s).
  `scripts/motion_probe.py` checks them on every build.
- **Transitions move the content, not the camera:** a scene leaves and the next arrives (`motion/transitions.md`);
  the camera keeps breathing through them.
- **Energy comes from the content:** more moving layers inside a scene, never a faster camera. In an energetic
  brief the camera may move more (the probe's `--style energetic`), but it still eases in and out.

## The camera never stops, and never wanders

The camera is never locked: a locked camera with a few elements moving inside it reads as a
slideshow, which is what separated the first intake videos from Karl's benchmark film. But every
camera move has a direction and a reason: to reveal information, follow action, transfer attention,
create scale, connect scenes or intensify a moment. Aimless drifting is as weak as a locked frame.

- **Holds:** the slow breath above carries them; a push towards a focal point is part of the breath (a few
  percent over many seconds), never a quick move on the beat.
- **Push-ins:** establish the screen or scene, then push in until the part the line names fills the
  frame and reads (`design/visual-hierarchy.md`). Interfaces can sit on a slightly tilted plane that the
  camera pushes into.
- **Distances:** the camera moves the film between wide, medium and close framings (the framing budget
  is in `design/composition.md`).
- **Whip zooms and whip pans:** a transition family like any other (`motion/transitions.md`), used
  only when motivated, never as a random preset.

## Depth

Even in 2.5D:
- foreground objects move more than the background during parallax, and parallax is used only to
  express real depth between meaningful layers,
- focus can transfer attention between depth planes,
- perspective stays coherent across the film,
- a slight 3D tilt (about 5–15°) on cards and screens adds depth where the chosen style allows it,
- soft, wide shadows and layers at different depths moving at different speeds sell the space,
- depth supports hierarchy; it is never a feature checklist.

## Cuts

Not every change needs interpolation. A clean hard cut can be stronger than a forced transition when
the audio carries the connection, the compositions match, the action direction matches, or contrast
is the point. Most scene changes are still moves (`motion/transitions.md`).

## Atmosphere

Grain, glow, bloom, haze and lens effects must support the art direction and the style. Don't use
atmosphere to hide weak composition. "Cinematic" doesn't mean slow; it comes from intentional
framing, motivated camera, depth, light, pacing, anticipation, sound and a controlled reveal.

## In a coded render

Put the whole scene inside one camera element under a CSS `perspective` and set its transform every
frame (`production/coded-render.md`, `scripts/render.html`).
