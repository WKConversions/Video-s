# Output format

After the art-director pass, the plan produces two documents: the **production plan**, the final
production instructions that the build follows and that an animator or another AI can reproduce
without guessing, and the **storyboard**, which Karl approves. Both come from one scene spec; the
storyboard is its condensed view, so the two never disagree. Detailed scene instructions are written
only after the planning steps, never straight from the script.

## Say what the user gets

Before building, say which route you are taking and what the result will be: an After Effects
project (`production/after-effects.md`), a Remotion build (an MP4 plus a project Karl can edit in
Remotion Studio; `production/remotion.md`), the plain coded render as a fallback (an MP4 only;
`production/coded-render.md`), or AE-ready instructions for someone else to animate.

## Project direction

At the top of both documents:

```
PURPOSE / AUDIENCE / FORMAT (aspect ratio, resolution, frame rate) / DURATION / CORE MESSAGE / TONE /
DIRECTION AND BRAND (the direction you decided, why it fits this business and script, what you changed
or borrowed; `styles/README.md`) / ART DIRECTION (the visual world; mixed media decided once) / MOTION PERSONALITY /
TRANSITION FAMILY (two or three behaviors) / VOICE-OVER AND MUSIC (recorded, or timed at 2.5 words
per second; track or none)
```

## Scene spec

```
SCENE NUMBER:
TIMECODE:                   start–end in seconds; frames where it matters
VOICEOVER:                  the exact words
PHRASES:                    each phrase with its time, and the visual event on its key word
PURPOSE:                    beat type and importance, from the beat sheet
CORE MESSAGE:               what the viewer must understand
VISUAL STRATEGY:            from planning/visual-strategy.md
VISUAL CONCEPT:             the idea, in one or two sentences
COMPOSITION:                the settled styleframe: framing distance, alignment, placement, negative space
PRIMARY ELEMENT:            with its size at the output resolution
SECONDARY ELEMENTS:
BACKGROUND:
TYPOGRAPHY:                 the exact on-screen words, or "none"; face, weight, size
COLORS:                     color roles from the style and brand
MATERIALS:                  what the scene is made of: motion graphics, shapes, type, icons, UI, brand
                            assets, charts, photo, video, screenshot, generated image, texture
EXTERNAL ASSET REQUIREMENT: "None", or asset IDs with their requests
MOTION:                     cause → motion → consequence chains
EASING:                     named curves
CAMERA:                     move, amount, direction, depth
ENTRANCE:                   the start state, and how it comes out of the previous scene
IN-SCENE ANIMATION:         the relay of actions with timings in frames, and the working hold
EXIT:
TRANSITION TO NEXT SCENE:   the transition family, and what carries across
SOUND DESIGN OPPORTUNITY:
WHY THIS VISUAL WORKS:      one sentence, tied to the core message
```

The production plan adds **BUILD NOTES** (layer and precomp structure, expressions, or code notes) and
**QC NOTES** (what to check on the render) to each scene. Worked examples: `examples/scene-examples.md`.

## Precision

A production-level instruction states, where relevant: the element, initial state, final state,
start time, duration, position change, scale, rotation, opacity, blur, mask behavior, anchor point,
easing character, overlap, relationship to voice-over and audio, secondary action, and transition into
the next scene. Use approximate numbers where they make a scene reproducible (frames, seconds,
percentages, pixels at the known frame size, degrees, blur, opacity, scale, delay). Don't invent
meaningless precision: the values are starting points, tuned by eye.

Never write vague instructions such as "make it dynamic", "use smooth animation", "add a cool
transition", "make it pop" or "animate professionally". Specify observable behavior.

## Global consistency

End the production plan with the repeated motion rules, typography rules, transition rules, sound
rules, exceptions, and the QC targets (`evaluation/quality-check.md`).

## The storyboard page

One page. Per beat, a frame for every phrase (at least three per beat; 30 to 40 for a film of 30 to 45
seconds), each with its time and what moves: one frame per beat is a presentation storyboard
(`planning/phrase-by-phrase.md`). Each is a frame made with the build itself (rendered from the Remotion project
or the render page, or as a styleframe in the After Effects comp), so the frames Karl
approves are what gets animated; then the time, the voice-over line, the on-screen words, what is
shown, the motion, and the transition into the next beat. Then:
- **Notes:** suggested script changes (never silent rewrites), claims with nothing to show, and the
  assumptions you made (format, the direction you chose and why, which submission).
- **Revision log** from the art-director pass.
- **Asset requests** (`design/asset-strategy.md`) and **tool requests** (`production/tool-requests.md`),
  each also as a JSON block.
- **Open questions:** music, voice-over, anything unresolved.
- **Appendix:** the working tables (beat sheet, variety check, continuity table), collapsed.

Build it as an HTML page: publish it as a private artifact when the session can, otherwise send the
file. Once a render exists, put the film at the top of the page (a web encode published next to the
page as `film.mp4`) with its movement graph right under it (`movement.png`, from
`scripts/motion_graph.py`; its header carries the motion-check numbers), and build the page from a
small script that fills in the frames, the graph and the numbers, so every revision republishes the
same page with fresh ones. When the film goes out on its own, the graph goes with it.
