# Troubleshooting

A symptom list for the test frames, the draft render and Karl's feedback. Find the symptom, check the
likely causes in order, apply the fix in the module named. Use it after the quality check
(`evaluation/quality-check.md`) finds a problem and before guessing at one.

| Symptom | Likely cause | Fix |
|---|---|---|
| **Feels stiff or robotic** | one element at a time with gaps; everything on one curve; straight paths; no blur | overlap in waves, secondary motion 2–4 frames behind, arcs on travel, 180° motion blur (`motion/animation-grammar.md`) |
| **Reads as a slideshow** | locked camera; one camera distance; crossfades between layouts | a camera that always moves, three framing distances, every change a move (`motion/camera.md`, `motion/transitions.md`) |
| **Dead air** | a settle with nothing working; frozen end card | a working hold: the interface keeps working, the camera keeps pushing (`motion/animation-grammar.md`) |
| **Flat or cheap** | only the primary layer moves; opacity-only changes; same curve everywhere | add the secondary and ambient layers; pair opacity with position or scale; vary curves by role |
| **Busy or distracting** | more than one dominant move; over a third of the elements moving at once; every element with its own entrance | one dominant move, the rest follow; group entrances; cut what carries nothing (`design/visual-hierarchy.md`) |
| **Too slow** | durations above the palette; ease-in-out where arrive fits; long anticipation | take the palette tier down; arrive curve; drop anticipation on small moves (`motion/timing.md`) |
| **Too fast or jarring** | a big move under 10 frames; no settle; no motion blur on a fast move | scale duration with distance; add a settle; blur (`motion/timing.md`) |
| **No personality** | default curves; one duration for everything; no signature entrance | apply the motion identity's three constants (`motion/motion-identity.md`) |
| **Inconsistent** | curves and durations chosen per scene; mixed personalities | one palette, one signature curve, one transition family per film |
| **Transition feels assembled** | velocity jumps at the cut; the focal point jumps; a duplicated element instead of the same one carried across | match velocity, hand the eye over, carry the same object; check the cut frames (`motion/continuity.md`, `evaluation/quality-check.md`) |
| **Jump at a cut** | the next scene's first frame doesn't match the last frame of the previous one | compute the next camera from the previous end state; compare the two frames' pixels (`production/build-gotchas.md`) |
| **Blur shows steps** | a very fast move for the sample count | lengthen the move by a few frames or raise the samples for those frames (`production/remotion.md`) |
| **Text unreadable where it plays** | under 36 px at 1080; moving while spoken; one distance for a whole screen | push in on the named part; hold text still to be read (`design/visual-hierarchy.md`) |
| **Two lines of type overlap** | swap without a shared slot mask | clear or mask the outgoing text first; check at 2-frame steps (`design/typography.md`) |
| **Picture off the voice** | timed to an estimate; hits on the sentence, not the word | force-align the recording and land key hits on the word (`planning/voice-over.md`) |
| **Looks AI-generated** | template structure, repeated devices, decorative motion | the fingerprints and their counts (`design/anti-ai-design.md`) |

## Reporting a fix

Every problem found in a review, and every change in the revision log, is one row in this format, so
Karl can see what changed and why at a glance:

| Scene | Before | After | Why |
|---|---|---|---|
| 1 → 2 | the hook shrinks into the page while the page fades in | the page's camera starts inside the timer on the same "3" and zooms out | a crossfade between layouts; one object and one move reads as one film |

Name the observable behavior on both sides (what moves, how far, how long), never "improved the
transition".
