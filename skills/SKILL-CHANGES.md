# senior-motion-designer: what changed (reference training, 11 October 2026)

Upload `senior-motion-designer.zip` to replace the skill. The library inside it is the live library
(https://claude.ai/artifact/UeFiNvnC9tHrN97jpEyr5X, version 21): version 20 (the Tale Forge update) plus the
training on Karl's six new reference films and the VoxFlow correction. SKILL.md is unchanged from version 20.

Karl's brief for the set: "Time to train the skill. Here are a few reference videos which animate style and
visualisations of the voiceover/text I really like and are smooth." The films are in the repository
(`refs_src/ref28–ref33.mp4`, with `refs_src/analysis/` holding the motion, cuts, contact sheets and transcripts);
they are not bundled with the skill.

| Ref | Film | What it teaches |
|---|---|---|
| ref28 | Grok Bot | text as the product talking; gliding word build; exponential arrivals, accelerating exits |
| ref29 | CrowdReply | the only one with a voice-over: the voice acted out by product text, phrase by phrase; transitions in the voice's pauses |
| ref30 | Grok Bot Team Bots | one slot for parallel examples; the destination word eats the line; smooth with no camera |
| ref31 | Morphic | making room for the word; the click chain as cause and effect; speed peaks on the beat |
| ref32 | Payy | acting out "private" by hiding the type; long tails handing over to the next move; cuts hidden in accelerating exits |
| ref33 | Shopify Sidekick | each kind of text arriving the way the product makes it: typed, streamed, shimmering, rolled, blur-swapped |

## What changed in the library

- `references/technique-catalogue.md`: techniques 21–51 in two new sections, "Text that carries the voice" and
  "Product, hand-offs and sign-offs", each with the reference times and the measured timing; the table now covers
  31 films.
- `references/benchmarks.md`: a new section on the set: each film's look, what it shows of Karl's brief, its
  measurements, what to take and what not to take; why they read as smooth at little motion; and an open
  question (below).
- `motion/speed-graphs.md`: a table of 19 moves measured frame by frame across the six films, with the rules
  they share (arrivals start at the cut's speed and decay by about ×0.8 a frame, exits accelerate and are shorter,
  no overshoot, the change of shape on the fastest frame, direction carried through the cut).
- `motion/easing.md`: the same finding in short: the smoothness is in the curves, not in the amount of motion.
- `motion/timing.md`: scene changes go in the voice's pauses.
- `planning/phrase-by-phrase.md`: a new section, "Showing the voice in text": how ref29 shows a voice-over
  through product text, and when pure type is used.
- `examples/corrections.md`: the VoxFlow correction ("no useless animations, for example the text obviously
  moving left and right"; "I want the 4% norm") and a new recurring lesson: reach the motion norm with motion that
  means something; decorative drift reads as useless.
- `data/ref_names.json` and `data/ref_words.json`: ref28–ref33 named; ref29's words added for `scripts/ref_lookup.py`.
- `index.html`: the descriptions of the changed modules.

## Open question for Karl

Five of the six read as smooth at 0.4–1.1% of the frame in motion (only ref29, with a voice-over, measures 3.5%).
Does the 4% norm set on VoxFlow hold for every film, or for voice-over films only, with music-only and type-led
films allowed less when their curves measure clean? The library records the question and keeps the norm until he
answers.
