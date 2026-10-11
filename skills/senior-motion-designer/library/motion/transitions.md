# Transitions

## Every change is a move

The best transition is usually already present in the scene. Ask: what existing object, edge,
movement, scale relationship or camera direction can produce the next scene? One scene becomes the
next through a morph, a camera move or a motivated whip: the icon becomes the logo, the card becomes
the wallet, five avatars merge into one. Don't crossfade one layout into the next.

## Families

- **Object continuity:** an object stays while its role, scale or environment changes.
- **Object becomes the next object (match transformation):** a shape, letter, interface component or
  image transforms into a related form.
- **Scale-through:** the camera pushes through an element into the next composition.
- **Whip (zoom or pan):** the camera whips, blurred, along a real direction of travel or out of one
  element into the next scene. Only when the movement is motivated; never as a preset.
- **Background becomes foreground, or the reverse:** a shape expands into the next scene's background.
- **Mask continuity:** an existing edge becomes the reveal boundary; a mask grows into the next scene.
- **Layout transformation:** current elements rearrange into the next composition.
- **Directional continuation:** motion exits in a direction and the next scene continues that vector.
- **Line leads the eye:** a line or path draws into the next composition; a graph line turns into
  another shape.
- **Exit reveals:** text or an object leaves and uncovers the next scene behind it.
- **Foreground wipe:** a foreground element crosses the frame and conceals the change.
- **Focus or depth shift:** attention transfers between depth planes.
- **Light or color transition:** a visual property carries across scenes; use sparingly.
- **Hard cut:** when audio, matching composition or matching direction carries it (`motion/camera.md`).
- **Speed-matched whip through a cut (Karl's Training.aep):** the outgoing thing speeds up into the cut, the shape
  or scene changes on the fastest frame, and the incoming thing carries on at that speed and slows. Sideways (A1),
  as a drop-through in one spot (A2), or in scale into the next scene (B16). The timings and curves are in
  `motion/speed-graphs.md`; `whip()` and `zoomThrough()` in the kit build them.

## Name the object

Every transition names the object it grows out of: the card, the person, the mark, the dot, the line.
If you can't name it, it is a page change, and the film starts to read as a presentation. The ones that
worked in Karl's October 2026 films, with the films they come from, are listed in
`planning/phrase-by-phrase.md`: masks out of a card, a person, a map pin and a logo's apex; a highlight
that becomes a card; a mark that floods the frame; cards that line up into a portfolio or gather into one;
a card that opens on its centre line; dots that gather into one person; a line that rises like a curtain;
a word that rolls into another.

## From Karl's reference films

`references/technique-catalogue.md` has the transitions of 25 films Karl selected, timed frame by frame: the
word that is a button and opens the product; a coin that flips edge-on into the first stroke of the logo; a
dot that grows into the next scene's ground; a heart that splits like a puzzle into a funnel; a lens that
shows the next scene inside it; a mind map that grows while the camera travels to each new node.

## A small family per film

Choose two or three transition behaviors for a film and use them consistently; consistency makes it
feel authored. For example: a UI product film uses layout transformation, scale-through and masks; a
cinematic brand piece uses camera continuity, foreground wipes and match cuts; a typography-led
explainer uses type scaling, shape morphs and spatial continuation.

## Making a morph look good

Choosing a match transformation is the idea; these rules make it look good on screen.

- **Go through a simple shape.** Complex to complex (a logo into an interface) passes through a rounded
  rectangle, a circle or a line: shape A collapses to it, it becomes shape B. Direct morphs between
  complex outlines tear.
- **Keep the mass.** The visual area stays roughly constant through the morph (within about 20%); a
  shape that shrinks while it changes reads as disappearing, not becoming.
- **Separate dimensions.** Width, height, corner radius and position each interpolate on their own; corner
  radius changes over the middle 60% of the morph, never all at the start or end.
- **Hide the middle with speed.** The in-between frames are the ugly ones, so the morph is fastest there:
  a symmetric ease-in-out, 16–24 frames at 30 fps (upper end for calm briefs). Shutter blur on the fastest
  frames covers the rest.
- **Change on the fastest frame.** Colour, fill and content (text, an icon, an image inside the shape) swap
  on the fastest frames, not at the start or end, where the eye sits.
- **Content after the shape.** The next scene's content inside the shape arrives 2–4 frames after the shape
  settles, with its own entrance (`motion/animation-grammar.md`), never stretched along with the shape.
- **Speed-match the hand-off** in and out of the morph, as in the Training.aep whips (`motion/speed-graphs.md`).
- Path morphs need the same point count on both shapes; when they don't match, use the simple shape in
  between, or a mask that grows instead of a path morph.

## Avoid

Generic spins, arbitrary zooms, unmotivated whip pans, repeated blur wipes, unnecessary glitch, and
transition packs with unrelated movement styles. A morph must represent progress in the message
(`design/anti-ai-design.md`).
