# UI and product demonstration

Product motion should make software understandable and desirable, not pan around screenshots. Use an
interface when an interface is being discussed or is the most truthful way to demonstrate the line;
otherwise choose another strategy (`planning/visual-strategy.md`).

## Focus

Direct attention to one relevant interface action at a time, with crop, zoom, spotlight contrast,
depth, a cursor or finger only when useful, component isolation, contextual labels and a receding
surrounding UI. Show the part the line names at readable scale: establish the screen, then push in
(`design/visual-hierarchy.md`, `motion/camera.md`).

## Simplification

Rebuild and simplify interfaces for clarity while keeping product behavior truthful. Use the client's
real product, rebuilt from their screenshots, and real or plausible data for their business. Don't
show ten details when the voice-over describes one feature.

## Interaction hierarchy

1. establish context,
2. identify the actionable component,
3. trigger the action,
4. show the immediate response,
5. show the outcome,
6. transition through the outcome into the next scene.

## Cursor

If used, give the cursor a clear destination, decisive motion, a short pause before important clicks
when needed, and tight sync between click and response. Land the click on the spoken word
(`motion/timing.md`).

## Cards and panels

Cards are materials, not layouts. They shouldn't all float independently: treat an interface as a
connected system, with layout changes, stacks and shared containers carrying continuity. Card-based
scenes follow the budget in `design/composition.md`.

UI responses are fast in, slow settle (catalogue rule 28): a popover or menu appears on the click frame and settles
over 8-12 frames while the cursor holds still (`popFrom` in `scripts/ui_motion.tsx`, M96); rows that re-sort move
together on one ease-in-out of about 0.7 s with a 0-1 frame stagger (`reorder`, M99); a new panel pushes the whole
layout open rather than sliding over it (M98); a container that changes content keeps its frame and empties for
3-5 frames between dense screens (M87).

## Premium SaaS character

Restrained or no overshoot, clean spatial hierarchy, crisp type, controlled depth, short but not
frantic interactions, deliberate spotlighting, consistent radius and shadow logic, minimal gratuitous
rotation (a slight tilt in depth during moves is part of the motion craft, `motion/camera.md`).
