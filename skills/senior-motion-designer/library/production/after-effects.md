# After Effects

For sessions with direct After Effects access, and for plans someone else will animate in After
Effects.

## With direct access

Build the composition; keep text and important properties editable; name layers clearly; keep a
sensible hierarchy; use precomps intentionally; use native shape and text layers where practical; use
expressions for repeatability, not novelty. Then capture previews or screenshots, inspect them
(render a draft and check it like any encode: `evaluation/quality-check.md`), and revise.

## Handing off to an animator

Deliver the production plan (`production/output-format.md`) with BUILD NOTES for each scene, detailed
enough that an experienced animator can reproduce it without guessing: layer structure, precomps,
anchor points, keyframe values and timing in frames, curves as graph-editor settings, expressions.

## Project organization

Name layers by role: `CTRL_`, `TXT_`, `UI_`, `ICON_`, `IMG_`, `BG_`, `FX_`, `MATTE_`, with SFX reference
markers where useful. Avoid dozens of "Shape Layer 1" and "Null 7" names in production work.

## Construction

- Prefer editable text, shape layers, controllable effects, reusable precomps, master controls, and
  expressions for repeated logic. Rasterize only when necessary.
- Set anchor points before animating scale or rotation (`motion/easing.md`).
- Precompose when elements behave as one unit, the hierarchy gets clearer, effects need grouped
  treatment, or a component is reusable. Don't precompose blindly; keep frequently adjusted properties
  accessible.
- Use expressions for reusable controls, procedural counters, responsive layout, linked styling,
  repeated stagger logic and deterministic behavior; not where two clean keyframes are clearer.
- Parent the scene to a 3D camera (or a camera null) so holds keep their slow push and interfaces can
  sit on a tilted plane (`motion/camera.md`).

## Motion blur

Enable layer motion blur with a 180° shutter angle; when and where blur belongs is in
`motion/animation-grammar.md`.

## Curves

Inspect the speed and value graphs rather than trusting the default Easy Ease (`motion/easing.md`).
The named curves translate into keyframe velocity like this, with speed as a multiple of the move's
average speed:

| Curve | Outgoing keyframe | Incoming keyframe |
|---|---|---|
| arrive `cubic-bezier(.22,1,.36,1)` | influence 22%, speed about 4.5× | influence 64%, speed 0 |
| depart `cubic-bezier(.64,0,.78,0)` | influence 64%, speed 0 | influence 22%, speed about 4.5× |
| move `cubic-bezier(.65,0,.35,1)` | influence 65%, speed 0 | influence 65%, speed 0 |

## Reading an AE file Karl sends

Karl sends small .aep files with named compositions (a transition, a pop, a text animation) as references for
motion style and speed graphs. Read them without After Effects: `python3 scripts/ae_read.py file.aep` prints every
composition's moves with their eases, frame steps, the Remotion equivalent of each ease, the expressions it knows
(his Elastic Controller) and how the layers hand off at a cut; `--sheet out.html --png out.png` draws the speed
graphs. Take them as direction, never as literal copies; what his first file taught is in
`motion/speed-graphs.md` (A1–A7). Keep the file in `ae_refs/` in the repo.

## Preview loop

After each meaningful section: preview at full speed, inspect key transitions frame by frame, inspect
the typography holds and the motion hierarchy, and fix the weakest issue before adding polish.

## Delivery

Run the delivery checks in `evaluation/quality-check.md`; they include the After Effects items
(broken expressions, missing footage, color management).
