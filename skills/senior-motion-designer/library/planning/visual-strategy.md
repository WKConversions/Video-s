# Visual strategy

For each beat, decide how its meaning is best communicated before deciding how anything moves. The
question is never "what animation fits this sentence?" but "what does the viewer need to understand,
and what is the strongest visual idea for that?"

Then go one level finer: every phrase inside the beat gets its own visual event, on one continuous
stage, never a page that holds while the voice explains it. That is Karl's standing direction; the
method, the idea list and the measurement are in `planning/phrase-by-phrase.md`.

## Literal meaning, not literal nouns

Most viewers see each shot once, for a second or two. In the September 2026 test, abstract devices (a
line snaking through a paragraph, a route drawn between two people, a chart bar turning into a line)
were cut after Karl's feedback: "no metaphors or vague visualizations which some don't understand."
The version that worked showed, shot by shot, what the voice-over meant (examples in
`examples/bad-vs-good.md`).

So the default is to show the meaning of the line concretely at the moment it is spoken: the product
doing the thing, the interface state that proves it, the people, the number, the result, the
relationship changing. That is literal to the meaning, which is different from being literal to the
words:

- **Not subtitles.** Don't set the sentence as type and animate it; show the thing.
- **Not an icon per noun.** One clear depiction per beat, not a row of symbols.
- **Not the noun of every sentence.** "We help businesses grow" is about growth, not about a
  building labelled "business".
- **Not a raw screenshot.** Rebuild and simplify the interface so the relevant element reads
  (`design/ui-product.md`).

A metaphor is allowed only when the subject genuinely can't be shown, or when Karl asks for one, and
only when it is grounded in something recognizable that a first-time viewer reads within a second,
like a diagram that acts out the claim. The same holds for every abstract device: unnamed network
diagrams, spatial and scale metaphors, environmental storytelling. Vague symbols (a lone lightbulb,
glowing lines, floating shapes standing for "innovation") are cut. When you use a metaphor, say in
the notes why a concrete demonstration wasn't possible. Minimal Single Visual Style is conceptual by
design, and its forms pass the same test (`styles/minimal-single-visual.md`).

## Choosing a strategy

For every beat (and then for every phrase in it, `planning/phrase-by-phrase.md`):
1. List two or three candidate strategies from the catalog below, starting from the beat type.
2. Pick the strongest by these tests, in order:
   - A first-time viewer understands it in about a second, with the sound off.
   - It adds meaning beyond the voice-over (the how, the proof, the consequence), not a repeat.
   - It changes on every phrase: a strategy that is one held page for the whole beat fails.
   - It fits the chosen style and the film's art direction.
   - It doesn't make a third beat in a row answered by the same strategy.
   - It gives the scene one clear primary element (`design/visual-hierarchy.md`).
   - It can be built well with the tools and assets at hand (`design/asset-strategy.md`). This test
     rules out the impossible; it never decides between ideas. Don't choose a concept because it is
     easy to animate.
3. Record the winner and the runner-up in the beat sheet's strategy column; the art-director pass
   may swap them.

## Beat type to first candidates

| Beat type | Start from | Watch out for |
|---|---|---|
| Hook | a single striking image, a tension, an unexpected scale, a question made visible | opening on a logo or a title card |
| Problem | the friction happening: clutter piling up, a process breaking, waiting, a before state; people when it is felt | a sad icon; generic chaos |
| Solution | the problem state resolving: the same objects falling into order, the product arriving | a new unrelated scene that drops the problem |
| Feature | UI demonstration, zoom into the detail that matters | the whole dashboard at once |
| Process | spatial flow, a sequence, a timeline, connected objects, one object transforming step by step | a row of numbered cards |
| Comparison | split composition, opposing states, before/after, scale difference, side by side | two identical cards with different labels |
| Number/data | counter, chart, graph, scale, progress, quantity made physical; the number is the largest thing on screen | a number in a pill in a corner |
| Proof | real results, real customer names or logos as the client's site shows them, a real quote | invented metrics or customers |
| Abstract concept | a grounded metaphor, a symbolic object, a transformation, a spatial relationship, carefully chosen imagery | vague symbols |
| Emotional statement | photography, people, lifestyle imagery, a recognizable object, an emotional composition (scale, space, light) | UI where nobody discusses an interface |
| Product demonstration | the product doing the thing, following the interaction hierarchy in `design/ui-product.md` | panning around screenshots |
| CTA | an existing element becoming the button, logo or URL; resolution | a pasted end-card template |
| Transition/setup | a connective move: the camera, a mask, an object carried into the next scene | an empty beat |

## Relationships beat objects

A line is usually about a change or a relationship, so show what happens between the real things
rather than an isolated object. The things stay concrete; the relationship carries the meaning:
- a problem: the client's real bottleneck blocking the work (a form rejecting, a queue piling up),
- simplification: the client's scattered tools consolidating into their one product,
- efficiency: the manual steps collapsing into one action in the product,
- distribution: one post reaching many real feeds and formats,
- speed: the distance between request and result shrinking,
- intelligence: the client's real data resolving into the one decision it supports.

## Catalog

Each entry: what it is, when it works, when it doesn't.

**Demonstration**
- **UI demonstration:** the real product doing the job. Use for features, product proof and
  workflows. Not when no interface is being discussed. Details in `design/ui-product.md`.
- **Zoom into detail:** the camera travels from context to the one element that matters. Use when a
  small thing carries the point (a status, a number, a button). Not as a default move on every scene.
- **Highlight / spotlight:** contrast, focus or light isolates one element while the rest recedes.
  Use for "see what matters", choosing, finding. Not with more than one spotlight at a time.
- **Cause-and-effect animation:** an action visibly produces its result (a click fires, the chart
  responds). Use for mechanism and "how it works". Not when the cause is invisible or invented.
- **Product image:** the physical product, cut out or in context. Use for physical goods and
  packaging. Not as decoration next to software.
- **Screenshot:** only as reference for rebuilding, or when authenticity matters more than clarity
  (a real review, a real message). Never enlarged beyond its resolution.
- **UI + real-world imagery:** the interface meeting its real context (a phone in a hand, a booking
  appearing at a real location). Use to ground software in life. Not as stock filler.

**Quantity**
- **Counter:** a number counting to its value. Use for a single figure the viewer must remember.
  Not for several numbers at once.
- **Chart / graph / data visualization:** the shape of data (trend, share, distribution). Use for real
  numbers only. Not for invented or decorative data.
- **Progress visualization:** a bar, path or fill reaching a goal. Use for completion, speed, steps
  saved. Not as a loading-bar cliché.
- **Scale comparison:** size difference makes a quantity felt (18 hours vs 3). Use when the ratio is
  the message.

**Structure**
- **Diagram:** the real parts and how they connect: the client's actual tools, integrations or steps,
  named. Use for systems, integrations, architecture. Not unnamed nodes standing in for "connection",
  and not when a single object would do.
- **Process flow / timeline / sequence:** steps in order, in space or time. Use for "first, then,
  finally". Not as a row of identical cards.
- **Spatial relationship:** position carries meaning (inside/outside, near/far, above/below, center
  and orbit). Use for belonging, priority, distance.
- **Map:** geography or a journey. Use for locations, reach, delivery. Not as a decorative globe.
- **Pattern / system visualization, repeated elements:** many of one thing, then the exception, or
  order emerging. Use for scale, noise vs signal, standardization. Not as wallpaper.

**Comparison**
- **Before/after:** one scene, two states. Use for transformation and results. Strongest when the
  same objects change rather than being swapped.
- **Split composition:** two halves in tension. Use for choices, us vs them, old vs new.
- **Comparison:** side-by-side objects, opposing states. Use when the difference is the point.

**Object and idea**
- **Single hero visual:** one strong object or image carries the beat, with plenty of space. Use for
  important statements and emotional peaks.
- **Object transformation:** one thing becomes another. Use when the message is progress (a sketch
  becomes the product, a lead becomes a customer). Morph with meaning, never circle to cube to logo.
- **Minimal object representation:** a simplified, recognizable object. Use when the real thing is
  too detailed and the silhouette carries it.
- **Metaphor / symbol:** see "Literal meaning" above.
- **Icon:** a small, consistent glyph that labels. Use to support, never as the scene's idea. Not one
  per noun.
- **Abstract shapes:** geometry that acts out a relationship (converging, stacking, resolving). Use in
  Minimal Single Visual Style and for transitions. Not as filler.
- **Camera reveal / negative-space reveal:** the camera or empty space discloses the answer step by
  step. Use for setup and payoff.
- **Character or object interaction, environmental storytelling:** someone or something acting in a
  place. Use when context carries the meaning.

**Imagery**
- **Photography / photo cut-out / collage / image + graphics:** real people, places and objects,
  alone or combined with graphics. Use for human context, emotion, real-world examples, contrast
  between reality and digital. Not as decoration. Rules and requests in `design/asset-strategy.md`.

**Type**
- **Typography:** a statement set as the image itself, big, with nothing competing. Use for the few
  lines where the wording is the point (a promise, a name, the CTA). Not for every line.
- **Kinetic typography:** words that act out their meaning. Use for emphasis moments. Rules in
  `design/typography.md`.

## Variety across the film

Choose each beat's strategy for its line, and change the idea when the line changes subject; the
same strategy answers at most two beats in a row. Continuity comes from the shared visual
system and the hand-offs between scenes (`motion/continuity.md`), not from repeating a device. Check
the finished storyboard against the variety budget in `design/composition.md` and the fingerprints in
`design/anti-ai-design.md`.
