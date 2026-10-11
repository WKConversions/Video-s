# Benchmarks

Curated breakdowns of work Karl admires. A growing set of these contributes more to taste than more
general rules, so this file is the place to add them: each new breakdown in the record format of
`references/reading-references.md`, with its kind (style, content or motion) and what to take and not
take. Add one only when Karl selects the reference.

## Karl's reference set (October 2026)

Twenty-five more films Karl selected, measured and broken down into twenty techniques with their timing:
`references/technique-catalogue.md`. Their median film moves 3.5% of the frame in a typical frame, against
1.8–2.3% for our October films: the clearest gap they show.

## Karl's reference set, 11 October 2026: voice-over and text visualisation, smoothness

Six films Karl sent with: "Time to train the skill. Here are a few reference videos which animate style and
visualisations of the voiceover/text I really like and are smooth." His words cover all six; what each film shows
of that is named below. Each was read on every frame where it moves (positions per frame; the curve names are
fitted to the steps) and measured with `scripts/motion_check.py`. Their techniques are 21–51 in
`references/technique-catalogue.md`, their curves in `motion/speed-graphs.md`, and the voice-over rules from ref29
in `planning/phrase-by-phrase.md`. All six are motion benchmarks and content references, not style references:
no brand, logo, interface, layout, palette or copy of theirs goes into a client film, nor the real third-party
logos, posts and people they show.

**ref28, Grok Bot** (12.2 s, 30 fps, sparse UI sounds, no voice). A white page with flat chat UI and black type, no
camera and no blur. An AI bot told entirely by its own interface: the prompt bubble, a "working" label with a
shimmer, a cascade of source cards, a reply that grows, one claim line built on a gliding line whose coloured verb
swaps three times, and the mascot's eyes coming back as the logo. What it shows of his brief: the text is the product
talking, crisp on every frame, and every move is an exponential arrival or an accelerating exit. Measured: 79% of
frames moving, median 0.4%, longest still 0.93 s, then a 2.17 s frozen end card. Take: text as the product's UI,
the gliding build (21), the slot swap (23), the shimmer (29), chat-scroll hand-offs (33), the lockup (50). Don't
take: the hard page changes at 5.17 and 8.17 s, the 0.93 s freeze, the frozen end, the speed jump at the 3.27 s cut.

**ref29, CrowdReply** (57.9 s, 25 fps, English voice-over). White with coral and periwinkle, pastel browser
windows, a serif for the subject nouns and a sans for the rest. The only one of the six with a voice-over, so the key
reference for showing a voice phrase by phrase: the voice is acted out by interface text (a typed prompt, a
streamed answer, an address bar, tags, status chips, counters), with pure type only for the hook, the name and the
close, all on one arrival (the colour wake, 24). What it shows of his brief: the voice visualised as it is said, and
whips of 170–180 px a frame that still read as smooth because they ramp exponentially, carry blur and change scene
at the peak. Measured: 98% of frames moving, median 3.5%, longest still 0.92 s (the product name, while it is
spoken); 27 of 28 phrases bring a new visual, the longest voice without one 1.2 s; 13 of its 19 pauses of 0.25 s or
more carry the scene change. Take: the voice through product text, the typed hook (25), the ghost word (26), the
push to the named detail (38), transitions in the pauses. Don't take: the chat-assistant interface it imitates,
the real third-party logos, the palette or the type pairing; its dead stretch at 41.6–44.2 s, the two white frames
and the direction reversal at 17.40 s, UI text of 28 px left unreadable, the call to action cut in 0.24 s after
"Book" with its label about 0.5 s late.

**ref30, Grok Bot Team Bots** (26.8 s, 30 fps, music). Pale tints per use case (peach, lavender, mint) behind a
dark prompt bubble locked dead centre; no camera, no blur. The prompt is the narration: three requests swap in one
slot with their colours, the working label grows into the answer, and the one headline builds on a gliding line,
holds over a music drop-out and is then eaten by its destination word. What it shows of his brief: the text visualised
as the user's own words, the one claim acting out "into", and a film that is smooth with no camera at all.
Measured: 86% of frames moving, median 0.9%, longest still 0.83 s; cuts within ±1–2 frames of music onsets. Take:
one slot for parallel examples with a colour callback (34), the eat-back (27), request and answer stacks (36), the
cascade in motion (35). Don't take: the static 0.53 s cover frame, card text of 10–20 px, the 2.2 s near-static
reply hold (15.07–17.30 s), the third-party app interfaces, the palette and the grain squares.

**ref31, Morphic** (22.3 s, 30 fps, music at 128 bpm). A near-black stage, white grotesk type, one accent at a time,
one centred line or element at a time, a locked camera apart from two pushes. What it shows of his brief: short lines
built and re-centred so nothing jumps, and a click chain that tells prompt, send and result as cause and effect,
every speed peak on a beat. Measured: 83% of frames moving, median 1.0%, longest still 1.23 s; six hard cuts. Take:
make room for the word (22), the key-word pulse (26), eased fast typing (25), the push with its peak on the beat
(38), the zoom out through the cut (39), the generation developing (40), the click chain (37). Don't take: the dark
stage (Karl wants bright films, never a standard dark background), the third-party app logos, the media orbit, the
dead-still holds and locked camera in a voice-over film, the single 640 px frame in its opening slide.

**ref32, Payy** (34.8 s of content then 3.8 s of black, 60 fps, music at about 140 bpm). Black, acid lime, pale grey
and white, condensed caps headlines, one object on a flat field per scene. What it shows of his brief: the word
"private" acted out by hiding the type (glass refraction, a crop, a card in front), and curves whose long tails
hand over to the next move. Measured: 86% of frames moving, median 1.1%, longest still 1.80 s (the end; before it
no still point lasts more than 0.30 s); 11 hard cuts, each hidden at the end of an accelerating exit, on an edge-on
frame or on 2–4 black frames. It renders at 60 fps, so its flat shapes stay crisp at 100 px a frame without blur.
Take: hiding the word (26), the pull-out from a colour field (39), shapes becoming the interface (42), the transfer
with paired counters (45), lifting content out of its container (46), the page-peel flip-book (49). Don't take: the
mark, the lime and purple duotone, the card art, the copy, the phone home screen, the partner post; the style
roulette and the glitchy refraction in a calm film; the dark base; the black tail.

**ref33, Shopify Sidekick** (33.0 s, 30 fps, no audio). A product designer's reel: pale grey and white UI, black
punctuation shots, one purple accent; 33 shots of exactly one second, each holding one micro-interaction. What it
shows of his brief: each kind of text arrives the way the product makes it (typed with a caret, streamed with a dot at the
writing head, a shimmering status, a blur swap, a label that rolls), and every change is shaped. Measured: 67% of
frames moving, median 0.4%, longest still 0.83 s; a hard cut on every whole second (32; the detector finds 21).
Take: the blur swap (23), the reserved-layout build (28), the streamed answer (30), the container making room (31),
landing a headline in focus (32), defocus as pointer (47), the one-second roll-call for a list (48), the letter
window (51), and the exploded tilt for "how it's built" (16.33 s: 2 f at about 140 px a frame, 6 f to settle).
Don't take: a cut every second through a voice-over film, the scramble-decode label in a calm film, 12–14 px UI as
the subject of a phrase, moves that start at full speed on large things (the card snap at 2.17 s, the ×3 push with
a one-frame stop at 30.57 s), the screen-capture artefacts, the names, the mascot and the purple.

**Smooth with little motion.** Five of the six move only 0.4–1.1% of the frame in a typical frame (Grok Bot 0.4%,
Team Bots 0.9%, Morphic 1.0%, Payy 1.1%, Sidekick 0.4%), against a median of 3.5% for the 25 earlier references,
and Karl calls them smooth; only ref29, the one with a voice-over, measures 3.5%. Their smoothness comes from the
craft the breakdowns measured, not from the amount of motion: arrivals that start at speed and decay by a steady
ratio, exits that accelerate into the cut and are shorter than the arrivals, the change of shape on the fastest
frame, the direction carried through every cut, tails that hand over to the next move so a hold is a slow settle
rather than a freeze, no overshoot anywhere, blur only where the speed lasts, and one move at a time. None of this
permits a static stretch under a voice: every phrase still gets its own visual (`planning/phrase-by-phrase.md`).

Open question for Karl: five of these six read as smooth at 0.4–1.1%, so does the 4% norm he set on VoxFlow
(`examples/corrections.md`) hold for every film, or for voice-over films only, with music-only and type-led films
allowed less when their curves measure clean?

## Motion benchmark: Addx Studio, "sends" product film

Karl's benchmark for how a film should move: youtube.com/watch?v=Ljr-lhLyuC0 (54 seconds, 1080p,
30 fps), a product film for the payments app "sends". What he likes is the animation and the way the
film is made: smooth, and constantly, purposefully moving. Stills don't show it.

**Measured** (per-frame change at 160×90, September 2026), against the first two intake-form videos:

| | Benchmark | WKConversions | K.B |
|---|---|---|---|
| Frames where something visibly moves | 97% | 65% | 87% |
| Share of the frame changing, typical frame | 3.2% | 0.2% | 0.4% |
| Longest still moment | 0.8 s | 1.6 s, plus a 3.3 s frozen end | 0.5 s |

It runs at 30 fps like our renders, so the smoothness is craft, not frame rate.

**What it does** (observed frame by frame):
- 0.3–1.1 s: a line of type builds word by word while an icon draws on; the line re-centers smoothly
  as words are added.
- 4.6–5.4 s: a whip zoom with motion blur out of one lockup; the brand name's letters rise in a
  stagger and the tracking tightens into the logo.
- 7.0–7.8 s: balance cards fly in from outside the frame with heavy motion blur, tilted in depth, while
  the headline builds word by word; a new element lands every 3 frames.
- 9.8–11.4 s: the camera pushes into a dashboard sitting on a tilted plane until an onboarding tooltip
  fills the frame.
- 17.0–17.8 s: a blurred cursor sweeps in and selects a pill; the choice darkens and scales slightly.
- 24.8–25.6 s: two wallet icons drift and rotate slightly during the hold, then whip out with blur while
  the next element arrives in the next frame.
- 36.0–37.6 s: avatars fly in blurred from outside the frame, drift, then all but one fade as the
  headline swaps "everyone" for "you".
- 45.2–47.6 s: during a hold on a card grid, the camera pushes about 5% and drifts; small
  illustrations inside keep animating.
- Throughout: interfaces at about twice real size (smallest readable text 36 px, headlines 65–80 px,
  hero numbers about 90 px), soft wide shadows, no crossfades, every scene change a morph, whip or
  camera move.

**Take:** the motion craft (`motion/animation-grammar.md`, `motion/camera.md`,
`motion/transitions.md`, `design/typography.md`) and the measurable targets
(`evaluation/quality-check.md`).
**Don't take:** its layouts, its dark-green palette, its bento grids, its payment-product visuals or its
copy.
