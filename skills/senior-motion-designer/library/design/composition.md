# Composition and variety

## Styleframe first

Every scene must work as a static frame before motion is added. Before animating, define the finished
state of each key scene: focal point, typography, alignment, scale relationships, spacing, contrast,
color, depth, asset style, crop and framing, brand behavior. If the still is weak, redesign it;
motion polish is not the priority.

## Building a frame

- **Grid.** Use an underlying system even when the result looks loose: safe margins, major columns,
  baseline relationships, repeated alignment edges, spacing increments. Break the grid deliberately,
  never by accident.
- **Centering.** Center only when it serves symmetry, singular importance, a logo or hero reveal,
  monumental scale or direct address. Use offset and asymmetric layouts for movement, comparison,
  editorial sophistication, product storytelling and directional flow.
- **Negative space** is active: leave room around important type, in the direction an object will
  move, where the next object will enter, and to contrast with dense scenes.
- **Scale** is hierarchy and storytelling. Use dramatic scale differences on purpose.
- **Cropping.** Objects may exceed the frame when the crop communicates scale or energy. Avoid
  accidental tangencies: edges barely touching, text almost colliding, inconsistent near-crops.
- **Depth** through scale, overlap, atmospheric blur, shadow, parallax, focus, z-position, light and
  perspective, used as a compositional tool, not a checklist (camera and parallax rules in
  `motion/camera.md`).
- **Intentional imperfection.** Controlled asymmetry, crops, offsets, overlaps, partial reveals and
  tension make a frame feel authored. The rule is intentionality, not symmetry.

## Consistency is not repetition

Change the composition and the storytelling, never the visual language.
- **Keep consistent:** the type family and system, brand colors and color logic, corner-radius
  language, line weights, icon style, spacing logic, easing character, shape language, texture, and
  the depth system (how shadows and perspective are rendered).
- **Vary:** composition, alignment, framing and camera distance, scale, crop, direction, density, how
  much depth a scene uses, tempo and timing, arrangement, the visual strategy, and how type is used.

Consistency does not mean every frame is structurally identical. Examples of structural variety: a
close crop, a small object in a lot of space, a split comparison, a full-frame line of type, a scene
built around movement instead of text, a camera revealing information step by step.

## Variety check (run on the whole storyboard)

Before the storyboard goes out, list every scene in a table and check:

| Scene | Strategy | Structure | Centered? | Alignment | Primary element (kind, scale) | Element count | Card layout? | Camera distance | Density | Background | Exit direction |
|---|---|---|---|---|---|---|---|---|---|---|---|

Budget (a starting point; break it only with a reason you can state):
- Centered compositions: at most a third of the scenes, kept for statements, hero and logo moments.
- The same alignment, primary scale and structure: never in more than two consecutive scenes.
- Card-based layouts (panels, tiles, bento grids): never more than two scenes in a row, and at least a
  third of the film built around something else: a number filling the frame, an object, a photo, a
  typographic moment, a diagram.
- Hierarchy: the kind of primary element (a number, an object, a person, a line of type, an interface
  detail) changes; the same kind leads at most two scenes in a row.
- Element count: never the same count three scenes in a row, and some scenes hold a single element.
- Framing: at least three distances per film (wide, medium, close). A film seen from one distance reads
  as a slideshow however much moves inside it.
- Density: alternate dense and empty scenes; no film at one density throughout.
- Backgrounds: the style's canvas stays, but light, depth and crop change from scene to scene.
- Transition direction: the same exit direction at most two scenes in a row, even though direction
  carries across each change (`motion/continuity.md`).

For each failure, change the weaker scene: a different framing, an offset layout, a close crop,
another strategy from `planning/visual-strategy.md`. Keep the visual language; change the structure.
