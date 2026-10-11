# Motion typography

## When words appear

Type is imagery, not information laid over animation, and it can be the primary material of a scene.
But words appear only when they communicate better than a picture (the rule is in
`planning/script-analysis.md`). A single emphasized word is often stronger than a whole sentence set
large or bold.

## Hierarchy and line breaks

Control family, weight, size, line height, tracking, case, alignment, color and line breaks. Break
lines by meaning; never split a tight phrase. Prefer compact phrases to subtitle-like paragraphs.
Minimum sizes are in `design/visual-hierarchy.md`; the style or brand sets the typeface.

## Words build on the voice

When a headline is used, it assembles word by word as it is spoken, each word arriving with a small
offset and a little blur, and the line re-centers smoothly as it grows. Headlines swap in 3–5
frames. No bouncing letters.

**Two lines of type never overlap.** When a headline changes, the outgoing text clears or is masked
out before the incoming text reaches the same area; words swapping in one slot share one slot mask.
In the WKConversions intake video, "strategy." and "creative." sat on top of each other for five
frames because they didn't. Check every text change frame by frame (`evaluation/quality-check.md`).

## Kinetic type

Animate groups by meaning. Useful behaviors: a word replaces a word; a sentence expands from a
keyword; type becomes a mask; a word physically demonstrates its meaning; a line reorganizes into a
diagram or interface; type becomes an object for the next scene. Save bigger kinetic moves for the
moments that deserve emphasis; most text appears simply and then sits still to be read.

Character-by-character animation suits precise title construction, typing concepts, rhythmic
editorial motion and intentional typographic reveals. It is never a default entrance.

## Readability

Never sacrifice legibility for motion. Don't scale text through unreadable sizes while its words are
being spoken. Blur on text follows `motion/animation-grammar.md`.

**Hold time, measured from the frame the text is settled and sharp** (not from when it starts moving):
- text the voice doesn't speak: 0.5 s + 0.3 s per word, at least 1 s (a five-word line holds 2 s),
- text the voice speaks as it appears (words building on the voice): until the last word is spoken,
  then 0.4 s more,
- a number or a name the viewer must remember: add 0.5 s.

While text holds, it stays still and the frame around it keeps working (`motion/animation-grammar.md`).
Text that leaves before its hold is over is a legibility finding in the quality check.

## When the brand has no usable face

Use the client's own font when it's a clean face the film can load. When it isn't (a system font, a
licensed face that can't be embedded, a logo-only wordmark), pick a Google Fonts pairing by the
brand's mood from `data/font-pairings.csv` (75 pairings with mood keywords and best-for notes, from
ui-ux-pro-max, MIT), and say which in the storyboard notes.

