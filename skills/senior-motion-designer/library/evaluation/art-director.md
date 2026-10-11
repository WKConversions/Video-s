# Art director pass

A separate critique of the storyboard, followed by real revisions. The aim is a storyboard a senior
art director would sign off, not a list of weaknesses: never deliver a critique of scenes you didn't
fix.

## When

- **After the first full storyboard,** before it goes to Karl. This is the main pass.
- **On the test frames** of the build: a scene that worked as a description can fail as a frame.
- **After the render,** alongside `evaluation/quality-check.md`, with the scorecard below to compare
  versions.

## Step back first

Critique as someone who didn't make it. Reread the beat sheet (what each viewer must understand),
then look at the storyboard cold: frames first, notes second. When the session can start a
subagent, give a fresh agent the beat sheet, the storyboard and this module and ask it for the
critique, so the work isn't grading itself. Either way, you make the revisions.

## Three lenses

Look at each scene three times, each time asking one question, and write down what each lens
finds:
- **Restraint: should this move at all?** Cut movement that carries no meaning, elements that
  compete, a second idea in one scene. The best motion goes unnoticed as motion; the viewer should
  notice the idea.
- **Polish: is it finished?** Settles, follow-through, blur on fast moves, readable sizes, clean
  hand-offs, no motion gaps, no overlapping type.
- **Invention: what could this become?** Is there a stronger, more surprising concrete idea for this
  line: an object that becomes the next scene, a callback, a better use of the camera?

The lenses weigh differently by beat: importance-1 beats get the most invention, connective beats the
most restraint.

## Every scene

Ask each question of each scene, and write one line for every one that fails.

**Communication**
- Is the idea immediately understandable, to a first-time viewer, with the sound off?
- Does the visual add meaning beyond the voice-over, or only repeat it?
- Is this too literal? Literal to the meaning is the aim; literal to the words is the failure: the
  sentence set as type, an icon for the noun, a raw screenshot (`planning/visual-strategy.md`).
- Is this just animated text?
- Does the picture change on every phrase, or does a page hold while the voice explains it? A beat
  that is one held layout reads as a presentation (`planning/phrase-by-phrase.md`).
- Is there a stronger visual metaphor, or a stronger concrete idea? For a beat whose subject can't be
  shown, a grounded metaphor that reads within a second can beat a weak picture; Karl cuts vague
  ones (`planning/visual-strategy.md`).

**Simplicity and hierarchy**
- Could one strong object replace multiple weak objects?
- Is the visual hierarchy obvious?
- Is the most important element immediately visible, and the largest thing on screen while its line
  plays?
- Is there too much information?
- Is there a simpler idea?

**Material**
- Is there unnecessary UI?
- Could UI be replaced with a more interesting visualization: a number filling the frame, an object,
  a before and after?
- Is this another card-based layout?
- Could a photograph improve this?
- Could a real-world object improve this?

Photos and objects stay within the chosen style's imagery rules (`design/asset-strategy.md`).

**The film**
- Does the composition resemble previous scenes too closely? Have I used this technique already?
- Is the motion motivated: does every movement have a cause and a consequence
  (`motion/animation-grammar.md`)?
- Does the transition connect naturally, out of something already happening in the scene
  (`motion/continuity.md`)? Name the object it grows out of; a transition without one is a page change.
- Is there a more surprising way to show this phrase? Run the idea list in `planning/phrase-by-phrase.md`
  before accepting the first idea.

**Level**
- Is the scene high-end enough? Would it hold up next to Karl's benchmark (`references/benchmarks.md`)?
- Does it look AI-generated or template-driven (`design/anti-ai-design.md`)? Could it appear in almost
  any SaaS video?
- Is it there to communicate or to impress?

When the film starts from one of the library's directions, also run its copy check (`styles/README.md`).

## The whole film

- Does it read as one authored film rather than a set of templates?
- Is the core message the spine, and does the last beat land it?
- Does one example, prop or motif carry too much of the film?
- Is there contrast in tempo and density, without the frame ever going dead, end card included?
- Is the motion language consistent: one personality, one small transition family?
- Is typography treated as design rather than subtitles?
- What can be removed without losing meaning?
- Which 20% of the scenes lower the perceived quality most?

## Independent reviews, then cold eyes

For a full film, run the critique as separate reviews that never see each other's findings (a
review that has read another one agrees with it). With subagents, one fresh agent per lens; without,
one pass per lens, the frames reread each time:

| Lens | Holds | Gets |
|---|---|---|
| **Story** | each beat's frame against what the viewer must understand, with the sound off | the beat sheet, the frames |
| **Truth** | every word, figure, name and logo on screen against the client's own material | `harvest/facts.md`, the frames, `scripts/film_tells.py` output |
| **Legibility** | the frames at phone size (scaled to 390 px wide) and in a website embed: the subject the largest thing, the type readable, nothing colliding | the frames, scaled |
| **Brand** | colours, type and logo against the measured brand, contrast by number | `brand.json`, `scripts/brand_measure.py verify` and `contrast` output |
| **Motion** (on a render) | the measured motion, shake, pops and strips, and a new visual on every phrase | `scripts/qc.sh` output, `scripts/phrase_check.py check` output and sheet |

Every finding carries a severity (critical: the message, a claim or legibility breaks; major: it
looks cheap or generic; minor: finish), the beat, the evidence and one precise fix. Then one
judgement pass deduplicates, checks each finding against the frames, rejects what contradicts the
approved direction (say so by name) and settles contradictions once.

**Cold eyes.** After the fixes, one more reviewer who has read nothing (no beat sheet, no reviews, no
plan) gets the frames and one scenario: how the audience meets the film ("a founder scrolling
LinkedIn on a phone, sound off, 2 seconds to decide"). It says, in at most eight points, what still
looks amateur or like a template. It sees what the others stopped seeing: the same layout in three
beats, a colour that talks too much, type that looks generic.

**Turn cold-eyes notes into decisions, not tasks.** Write them as rules the next round applies to the
whole film ("the saturated colour appears only on the action Bruno causes", "every beat has one
photo or one interface, never both at full size"). A list of eight tasks fixes eight spots; a rule
fixes the pattern that made them. Deciding what the notes mean is art direction: never delegate it.

**The stop rule.** Stop when nothing above minor is left; or after two rounds; or when a round fixed
nothing (the same critical or major points came back: those are decisions for Karl, as open
questions). Minor points left go into the notes; they are not a reason for another round.

## Revise

1. Mark every scene **keep**, **improve** or **replace**.
2. For each scene marked improve or replace, state the problem in one line, then fix it: take the
   runner-up from the beat sheet or a new strategy from the catalog, rerun the strategy tests
   (`planning/visual-strategy.md`) and redesign the styleframe.
3. Start with the weakest 20% and with the three changes that would most improve the film.
4. Rerun the variety check (`design/composition.md`) and the continuity table
   (`motion/continuity.md`) for each changed scene and its neighbors.
5. Run the pass again on the revised storyboard, twice at most. Anything still unresolved becomes an
   open question for Karl.
6. Keep a short revision log for the storyboard notes, one Before / After / Why row per change
   (`evaluation/troubleshooting.md`).

## Scorecard

Use it to compare iterations consistently: the storyboard before and after revision, or a render
against the previous version. Score each dimension 1–5 with the evidence; don't chase the total at
the expense of judgment.

| Dimension | 5 | 1 |
|---|---|---|
| Communication | the visual meaning is immediate and reinforces the message | attractive but unclear or unrelated |
| Visual density | every phrase gets its own visual, on one continuous stage | a page holds while the voice explains it |
| Composition | strong hierarchy, spacing, balance, crop and focal control | weak or template-like arrangement |
| Typography | designed, readable, hierarchical, integrated | subtitle-like or inconsistent |
| Motion | controlled, purposeful, choreographed, the frame always alive | arbitrary movement or default easing |
| Timing and rhythm | varied, deliberate, readable pacing | monotonous, rushed or dragging |
| Transitions and continuity | the scenes connect through one visual grammar | unrelated effects |
| Art direction | a distinct, consistent visual world with varied structure | mixed styles or a generic AI look |
| Product and brand accuracy | the supplied brand and product, accurately | invented or distorted information |
| Sound relationship | audio reinforces hierarchy and rhythm | random or excessive effects |
| Polish | a professional commercial finish | roughness, broken spacing, awkward curves, unreadable frames |

Then answer:
- Which scene is weakest? Which is strongest, and why?
- What looks generic? What looks over-designed?
- What can be removed?
- Where does the eye go to the wrong place?
- Which transition breaks continuity?
- Which timing decision feels least intentional?
- Which three changes would bring the largest quality gain? Make them before polishing low-impact
  details.

When Karl's feedback shows something this pass missed, propose a correction
(`examples/corrections.md`).
