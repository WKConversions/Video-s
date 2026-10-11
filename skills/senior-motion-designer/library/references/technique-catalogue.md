# Technique catalogue: Karl's reference films

Thirty-one SaaS and product films Karl selected in October 2026 as the motion design he wants: twenty-five
explainers early in the month (ref03–ref27, techniques 1–20) and six on 11 October for the way they show the
voice-over and the text, and for their smoothness (ref28–ref33, techniques 21–51; `references/benchmarks.md`).
They were sent as files, read frame by frame with `scripts/ref_sheet.py` and measured with `scripts/motion_check.py`.
They are references for motion craft and for ways to explain, never for layouts, palettes or copy
(`references/reading-references.md`). The files stay in Karl's repository (`refs_src/`), not in the library.

Use this module at step 6 (visual strategy) and step 9 (motion): for each phrase, look for the technique here
that acts out its meaning, and take its timing.

## What the 25 have in common (measured)

| | Median of the 25 | Range | Our October films |
|---|---|---|---|
| Frames where something moves | 97% | 71–100% | 98–99% |
| Share of the frame changing, typical frame | **3.5%** | 0.5–6.6% | **1.8–2.3%** |
| Longest still moment | 0.17 s | 0.03–3.5 s | 0.4–0.6 s |
| Hard cuts | 4 in a 73-second film (one per 23 s) | 0–17 | 0–2 |

- **They move more of the frame.** Our films move as often but half as much: something small drifts while
  the rest holds. The references keep a second and third layer moving (blooms drifting, icons orbiting,
  satellites bobbing, a UI tilting slowly in 3D), and their arrivals are bigger. Aim for 3% and more.
- **Almost every change is a move.** One hard cut in twenty seconds; the rest are morphs, masks, camera
  moves and objects that turn into the next thing.
- **Two rhythms alternate.** A short line of type on its own, large and centred, built word by word on the
  voice (1–2 s), then the picture that shows it (2–4 s), then the next line. Kinetic type carries the voice;
  the visual carries the proof. Twelve of the 25 work this way (OSK Manager, SKUVE, Seed Fitness, Qwilr,
  Vela, Kaelio, Lovio, elyxir, collato, Fellow, Happy, JustCall).
- **Bright and soft.** Twenty of the 25 are white or a pale tint, with soft colour blooms drifting at the
  edges or behind the subject, soft wide shadows, and the brand colour used in one or two places.
- **One diagram carries many phrases.** Concentric rings whose label changes with each feature (Vela), a hub
  with satellites (Kaelio, Qualetics, Fellow, Benefits Science), a funnel (JustCall): set up once, then each
  phrase changes one part of it.

The six added on 11 October are not in these medians. Five of them move only 0.4–1.1% of the frame and still
read as smooth; their smoothness is in the curves and the hand-offs, not the area moving (`references/benchmarks.md`).

## Techniques, with their timing

Times are from 10 fps samples of the reference; the kit component is in `scripts/kinetic.tsx`.

### Type that moves with the voice

1. **Blur-rise word build** (OSK Manager 0:01–0:04, Kaelio, Lovio). Each word rises out of a blur on its
   spoken word, in 0.2–0.3 s; the key word in the brand colour or a heavier weight; the line re-centres as
   it grows. When the next line comes, the old one shrinks a little and blurs out in 0.2 s. Kit: `Line`
   with `centred`.
2. **Typed prompt with inline objects** (SKUVE 0:08–0:11, Seed Fitness, Qwilr). Letters type at about 18 a
   second with a caret; product photos sit inside the sentence in brackets and change every 0.3 s ("You
   have (🎒)(👟) the products"). Then the type becomes a real search box. Kit: `Typed` with `slots`.
3. **The word is the button** (OSK Manager 0:19–0:22). "Just click one **button**": the last word arrives as
   a real button, a cursor comes in and clicks it (a 0.1 s press), and the product UI grows out of the
   click point in 0.4 s. A word that is an object the viewer can act on is the strongest transition there
   is.
4. **Highlight block** (Kaelio 0:29–0:31). The key words sit in a solid block of the brand colour with
   stripes under it, slid in from the side; the next line builds under the logo. Kit: `W.mark`.
5. **Dial selector** (Kaelio 0:42–0:44). "Set it up under [15 mins]": a list rolls through an outlined pill
   in 0.7 s and stops on the answer, the neighbours faded above and below. For any number, time or choice
   the voice names. Kit: `Selector`.
6. **Split exit** (Qwilr 0:10–0:13). "It's both." leaves by its words moving apart sideways into a blur in
   0.2 s, and the next element blooms in where they were. Kit: `Line` with `split`.
7. **A logo element replaces a letter** (Lovio 0:14, "for m●mentum"; Happy). The brand's mark sits inside a
   word of the line, then the line resolves into the logo. Shown by keeping the mark in place while the
   words around it change.
8. **Ransom-note letters** (Shopgenie 0:38–0:40). Cut-out letters in mixed type tumble in and settle into a
   line; one per frame. Only where the brand is playful (it is a collage film).

### Objects that become the next thing

9. **Shape-morph chain** (JustCall 0:00–0:10). A heart pulses out as outlines, splits like a puzzle, the
   halves part to reveal the funnel's first bar ("Awareness", 0.4 s), the funnel builds bar by bar, tilts
   into 3D while coins pour through it (1 s), then falls apart into the next scene. Five ideas, no cut.
10. **Object becomes the logo** (pretaa 0:13–0:20, Vela 0:03–0:05, Kaelio 0:12–0:13). A dashed path draws
    along the floor and bends up into an arrow (growth); a clock forms on it, a coin badge lands; the coin
    flattens edge-on into a vertical line that becomes the first stroke of the wordmark, which writes
    itself letter by letter (0.1 s a letter). Vela's V is written as one tick-like stroke, then the letters
    wipe in. Kaelio's "æ" glyph appears first and the name rolls out of it. Kit: `Stroke`, `Flip`.
11. **Flip into the next object** (Dripc 0:01–0:02). A money bag flips edge-on and comes round as a coin
    (0.3 s), which then multiplies onto a conveyor belt. Kit: `Flip`.
12. **Dot iris** (Shopgenie 0:37–0:38). A white dot appears in the middle of the scene and grows into a disc
    that becomes the next scene's ground in 0.3 s. Kit: `Iris`.
13. **Puzzle assembly** (boksi 0:23–0:27). Pieces fly in, rotating, and snap into place with a burst of
    small particles; the set then scatters and re-forms around a new piece. For "fits", "complete", "the
    missing piece".
14. **Mind map that grows as the camera moves** (Kaelio 0:19–0:22). The logo becomes a pill; lines draw out
    to satellite pills (0.3 s each) while the camera pushes in and pans to each satellite as it is named.
15. **Lens reveal** (Qualetics 0:10–0:13). A magnifier sweeps over a faint line diagram and shows it in
    colour and detail inside the lens only; the lens grows into the next scene. For "insight", "see",
    "find".
16. **Multiplication** (UpSend 0:12–0:14). A tablet fills with tokens row by row in 1 s: a quantity made
    physical. Coins pouring, avatars filling a grid, proposals tiling the frame (Qwilr 0:21) work the same.

### The stage and the camera

17. **Concentric rings with a changing label** (Vela 0:14–0:18). Three arcs at the bottom of the frame; the
    label in the inner one changes word by word with each feature ("Books the meeting", "Sends
    reminders", "Handles rescheduling") while its icon rides round the arcs. One diagram, three phrases.
18. **3D-tilted UI** (Fellow, collato, Benefits Science, FCS). The product screen sits on a plane tilted 10–20°
    and turns slowly during the hold; the camera pushes in to a detail that then fills the frame. It keeps
    a large share of the frame moving during long holds.
19. **Footage with UI floating over it** (JOS, Faronics, SKUVE, Happy). A stock shot of a person at work with
    the product's cards and notifications floating in front, tracking the scene. Only with footage that
    matches the client (`scripts/stock.py`).
20. **Soft blooms on white** (OSK Manager, pretaa, Benefits Science, Vela). One or two blurred discs of the
    brand colour drift in the corners or behind the subject, so a white page never reads flat; they
    brighten behind the subject at its moment (Qwilr's AI circle). Kit: `Bloom`.

### Text that carries the voice (11 October 2026 set)

Times are in seconds of the reference, measured on every frame; f is a frame of the reference (30 fps, except
CrowdReply at 25 and Payy at 60). The steps were seen; the curve names are fitted to them. None of these is in the
kit yet: build them from the timings.

21. **Gliding word build** (Grok Bot, ref28 5.17–5.87; Grok Bot Team Bots, ref30 17.97–19.40). The sentence is
    laid out at its final, centred width; it starts 120–200 px off and glides there on one exponential ease-out
    (ref28: 37, 16, 11, 9, 7… px/f over 21 f; ref30: 52, 33, 22… px/f, 90% in 10 f) that word arrivals never
    restart. Whole words pop on at the end of the line at full opacity, with no fade, blur or rise, every 2–8 f
    (ref30: every 4 f, 7.5 words a second, each on a music hit); in ref28 each lands 4–43 px too far and closes up
    in 3–6 f. ref30's last word, the destination, arrives in grey and docks with its own slide (139 px, 25 f). The
    type is crisp on every frame. For the film's one claim line in a clean or premium film, where 1's blur-rise reads
    soft; with a voice, pop each word on its spoken word and keep the glide. One glide per line, while its words
    arrive, then it rests: text that keeps sliding left and right reads as useless (VoxFlow, `examples/corrections.md`).
22. **Make room for the word** (Morphic, ref31 1.13–1.60 and 18.00–19.00). The line starts moving towards its new
    centre on an ease-in 6–15 f before the new word exists; the word fades on, attached at its final gap, near
    the speed peak (4–9 f, no rise, no blur); the group settles on an ease-out (5–12 f). The travel is half the new
    word's width plus the space; peak 35 px/f in the opener, 18 px/f at the calm sign-off. For a status or
    qualifier added to a name: "X is live", "X Pro", "now with Y".
23. **Swap a word in its slot.** Three measured ways, all keeping the reading line in place:
    - *spacing collapse* (Grok Bot, ref28 6.40 and 6.93): for 1 frame every word space closes to 0 and the word
      is swapped; the spaces reopen about 10 px too wide and settle in 4–5 f while the line re-centres (peak
      31–41 px/f). 6–8 f a swap, each option in its own colour, held 0.5–1.2 s, a click within ±1 f;
    - *blur swap* (Shopify Sidekick, ref33 4.03–4.83): the old text blurs out in 6 f, both are fully blurred for
      3 f, the new one blurs in over 15 f, with no movement; for a status, a fade (14.43–14.73: 3 f out, 2 empty
      frames, 3 f in, grey turning green on the result);
    - *hard swap under moving media* (Morphic, ref31 13.27 and 15.00): the verb's left edge pinned, the noun cut
      in place in the same frame as the media orbiting it change, one per bar (1.73–1.80 s). It works only because
      everything around it is moving.
    For several capabilities, audiences or outcomes in one sentence ("for sales / ops / finance"), rotating
    examples, before and after statuses. An alternative to the dial (5) when the word must stay in the line.
24. **Colour wake: one arrival for all text** (CrowdReply, ref29 2.96–3.60, 9.40–11.30, 25.76–26.80,
    54.04–54.56). Text reveals left to right, about a word a frame (a front of about 150 px/f), or a character
    a frame when typed. Each glyph arrives soft in an accent tint, holds it 3–4 f and settles to ink in 4–5 f, so
    a coloured band trails the reading position: 0.26 s to appear, 0.5 s to settle. The streamed AI answer is the
    same effect at UI size (the newest 2–3 words tinted, ink in 4–6 f). For films that mix kinetic type and UI:
    the eye always finds the newest words. The tint is the client's accent.
25. **Typed line with the caret followed** (CrowdReply, ref29 0.04–2.96; Shopify Sidekick, ref33 1.00–2.00). A hook
    line 120–145 px high, wider than the frame, types with a caret, and the line slides so the caret stays at
    55–75% of the width: down to about 12 px/f between words, up to 100–200 px/f across long ones. It leaves on
    an expo-in whip in the pause (ref29: ×1.15 a frame to 179 px/f, blurred) or is cut while still moving (ref33,
    16 px/f). Typing speeds measured: 25 characters a second under a voice (ref29), 46 eased (ref31 6.10–7.63:
    about 20 a second on the first word, 50–70 in the middle, 10–20 on the last), 60 without a voice (ref33); the
    send button lights on the first letter (ref31). For a hook question or prompt the voice speaks, a search the
    product answers. The slide has a reason (it follows the writing); start it from rest or on a cut, never at full
    speed mid-shot, and keep the camera limits (`motion/camera.md`) in a calm film.
26. **The key word acts its meaning.** Three measured treatments:
    - *ghost* (CrowdReply, ref29 1.80–2.64): the missing word 1.6 times larger, pale and slightly blurred, a letter
      every 3–4 f across the spoken word, then typed dots in the pause that become the next screen's loading row.
      For "can't find", "missing", "invisible";
    - *pulse* (Morphic, ref31 1.60–2.53): the word turns to the accent letter by letter, 4 f apart, 16 f in all,
      peaks on a music hit, holds 2 f and returns to white in one piece over 12 f; then something acts on it (a
      click). Marks the word without leaving colour behind;
    - *hidden* (Payy, ref32 7.25–9.15 and 24.75–26.45): the line cuts on whole (the second line 10 f later),
      re-centres in 8–14 f and reads clearly for about 0.6 s; then a glass object turns in front and refracts it
      for about 1 s, cut while still distorted. Or the word, its letters about 500 px high, scrolls through a
      window (45 px/f decaying to a 1–3 px/f drift) with a product card over its middle, never whole. For privacy,
      security, hidden costs, "what others can't see".
27. **The destination word eats the line** (Grok Bot Team Bots, ref30 19.93–20.77). After the hold, the word that
    names the destination slides into the line on an exponential ease-in over 24 f (to 87 px/f) and deletes the
    words in its way, right to left, at quickening intervals (9, 4, 3 f). Both ends converge, so the line's centre
    never moves, and the cut lands on the fastest frame onto the destination itself. For "into", "all in one
    place", "bring everything to", "replace X with Y".
28. **Reserved-layout build** (Shopify Sidekick, ref33 8.00–8.97 and 9.47–9.97). The final layout is laid down
    first, as dotted leaders the length of each line or as the words at low opacity; then it fills: about 2
    characters a frame on every line at once, or words brightening 3 at a time every 40 ms. Nothing reflows or
    re-centres; a slow 5% scale-up runs under it. For a paragraph, a list, terms, AI output or code read quickly:
    use it instead of 1 when the text is long or several lines build at once.
29. **Working shimmer, then the result grows out of it** (Grok Bot, ref28 0.03–1.57; Team Bots, ref30 11.80–14.17;
    CrowdReply, ref29 8.52–9.40; Shopify Sidekick, ref33 17.40 and 22.27–22.57). A band 60–100 px wide sweeps
    left to right through a grey status label at constant speed (10–30 px/f, 0.5–1 s a pass); the label never
    moves, and an avatar blinks once (5 f). On completion the indicator grows into the result (ref30: the 57 px
    avatar grows over 2 f and the reply card pops on around it, already rising, settling 64 px), or the step list
    collapses into one checked line within 1–2 f (ref33). For "analysing", "searching", "it works for you": the
    wait stays alive without moving the layout, and the result comes out of it.
30. **Streamed answer** (Grok Bot, ref28 3.30–4.37; CrowdReply, ref29 9.40–11.30; Shopify Sidekick, ref33
    22.57–22.97). The answer arrives the way the product produces it: the reply bubble rises with its first line
    (ref28: 102 px/f decaying about ×0.8 a frame over 32 f), the second line is appended whole 4 f later and the
    bubble's height eases to fit it (28 f); or the words stream at about 20 a second, led by a small accent dot at
    the writing head, the frame drifting 2–3 px/f with them. An avatar follows its bubble about 2 f behind (B9).
    For an AI answer, a generated summary, "in seconds": the voice says the result as its first words appear.
31. **The container makes room** (Shopify Sidekick, ref33 31.23–31.90 and 11.13–11.30). A 4 f press darkens the
    button about 50%; its label rolls to the next word in 3 f and the button widens to fit over 9 f (about
    27 px/f), pushing its neighbour along. A banner slides out from behind the composer and pushes it down 38 px
    in 6 f (20, 12, 2, 2, 2 px/f). For step flows (Next to Submit, Draft to Published) and any "and then".
32. **Land the headline in focus** (CrowdReply, ref29 25.48–26.80; Shopify Sidekick, ref33 21.13–21.93). The line
    is already in place behind, out of focus. The outgoing object flies into the lens (ref33: ×1.18, ×1.29, ×1.8 a
    frame, gone in 5 f), or the scene cuts to a field of cards blurred about 30 px that sharpen over about 1 s
    while the title builds in front (ref29: a letter a frame, each settling in about 12 f, after a small outline
    label drawn from a vertical line in 8 f). Opacity first, sharpness last, 16–20 f. For the product name or a
    tagline the viewer must read as it is spoken.

### Product, hand-offs and sign-offs (11 October 2026 set)

33. **Chat-scroll continuity** (Grok Bot, ref28 0.03–4.37; Team Bots, ref30 2.17, 4.10, 11.80, 20.77). Every state
    enters from below on an exponential ease-out (first step 27–102 px/f, 50–500 px over 14–32 f) and leaves
    upward on an exponential ease-in (to 12–62 px/f over 9–17 f); the cut sits on the fastest frame and the next
    state carries on upward; a new reply pushes the older one up (57 px). About 1.7 s a state. For a chat,
    assistant, inbox or feed product, "ask, work, answer": the interface's own scroll is the transition, calmer
    than A2.
34. **One slot, many examples** (Team Bots, ref30 4.10–11.80, paid off 20.77–24.37). The element that carries the
    message (a prompt bubble) is locked dead centre for 7.2 s. On each cut its words, its colour, the background
    tint and the shapes' colours change in one frame, while the shapes keep their places and their drift.
    2.1–3.0 s an item: build about 0.7 s, hold 0.3–1 s, dismantle about 0.9 s. Each example owns a colour family,
    and the same colours return for the same examples in the pay-off, which then reads without labels. For three
    parallel use cases, teams, audiences or plans.
35. **Cascade in motion** (Grok Bot, ref28 1.60–3.27; Team Bots, ref30 4.33–5.03). Supporting cards appear at full
    size and opacity in one frame, already moving, one every 2–5 f, all on the same exponential ease-out (first
    step 27–60 px/f, 80–150 px, 7–25 f), on a staircase or around a still hero element. They leave by peeling off
    back to front on staggered ease-ins (16 f), or by single-frame pop-offs 2–10 f apart. Their text is texture,
    not reading. For "we read hundreds of reviews", sources, inputs, integrations: a quantity of evidence, the UI
    form of 16. Small supporting pieces only; the hero element gets a full move.
36. **Request, then answer** (Team Bots, ref30 20.77–24.37). The request card rises in (118 px, exponential
    ease-out); 18 f later the answer card lands on top at about 105% and settles to 100% in about 25 f, without
    passing its size, while the request recedes to about 90% and shows a 49 px lip. One pair every 30 f, the
    background changing per pair, the last held about 1 s. For fast proof: question and answer, alert and fix,
    three examples in three seconds.
37. **The click causes the next scene** (Morphic, ref31 2.40–3.50, 4.27–5.60, 9.17–9.90; Team Bots, ref30
    0.53–2.17; CrowdReply, ref29 6.36–7.48 and 53.04). A large cursor (about 100 px) enters from the frame edge
    already moving (75–140 px/f) and decelerates on an exponential over 11–16 f; its arrow fills on hover; the
    press takes the target or the cursor to 0.7–0.88 in 3–5 f, holds 1–4 f and releases in 2–4 f, on a beat or
    the word. The click ends one scene and brings the next, which appears on the old one's footprint at the same
    width; the cursor leaves accelerating (to 175 px/f). Variant, the pinned cursor (ref29): it stays sharp and
    still while the UI whips under it (expo-in 10 f, 3–4 blurred frames at 170–200 px/f, expo-out 15 f at ×0.73 a
    frame), so the button lands under it. The CTA can grow from the film's caret (ref29 53.04: a vertical line
    widens into the button in 5 f). Extends 3 into a chain where every scene change has a visible cause.
38. **Push to the named detail** (Morphic, ref31 5.77–6.40 and 8.20–9.13; CrowdReply, ref29 5.24 and 12.48). A push
    from rest to rest on an expo in-out, 19–28 f, ×1.5–2.0, its fastest frame (8.6–20% a frame) on the beat or the
    stressed word, with any content change (the first typed letter, a line removed) hidden in that frame. Or a
    punch-in: a slow push accelerates (0.1 to 2% a frame over about 17 f), then one frame jumps to 1.5–2.6 times
    tighter on the detail the voice names, that frame blurred, the drift continuing the same way and decaying
    over 14–26 f (×0.87 a frame); ref29 lands it on "checked" (12.48, exact). For a small UI detail made readable
    the moment it is named. Standard and energetic films; in a calm film the camera limits hold, so move the
    content instead.
39. **Zoom out through the cut** (Morphic, ref31 0.53–1.13; CrowdReply, ref29 3.56–4.64; Payy, ref32 2.90–3.55). The
    outgoing element shrinks on an ease-in into the cut and the incoming one appears already shrinking at the same
    rate in % a frame, then eases out (ref31: −6.3 then −6.2% a frame, 9 f + 10 f, though the shapes differ twice
    in size). Or cut to a frame filled with the brand colour whose edges are already moving (143 px/f per edge at
    60 fps) and contract into the app icon, half the width gone in 0.43 s, never stopping before the next move.
    Match the scale speed, not the size. For a big word or claim handing over to the name, or opening on the
    brand colour and landing in the product: B16 run backwards.
40. **Generation develops** (Morphic, ref31 9.90–10.40). After the send click the result cuts in, rising 114 px on
    an ease-out with its siblings 2–3 f behind, in false colour (a deep tint crossed by a band of the brand accent);
    its true colours develop over 15 f as the band rises and fades. For "generate", "create", "render": making,
    shown without a spinner.
41. **Names become things** (CrowdReply, ref29 17.48–20.80). A list of names slides in (expo-out from 163 px/f, 940 px
    in 19 f); the names blur away and leave their logos, which gather and grow 20% (17 f), then drop out on an
    expo-in (×1.5 a frame, 9 f); the places themselves rise from below, staggered 0.2–0.4 s. For "sources",
    "partners", "the tools you use": a spoken list turned into what it names, built from the client's own world.
42. **The interface grows out of the film's shapes** (Payy, ref32 11.07–11.75; Shopify Sidekick, ref33 28.37–28.67).
    Two pills in the film's colours fly in from opposite edges on a pure exponential (109 to 1 px/f, 18 f,
    mirrored), meet, grow on an ease-in into the frame where the screen appears, then ease out into real buttons,
    their labels 5–7 f behind. Or a line of code types on the left while a placeholder bar on the right grows into
    the rendered card (63 to 335 px, peak 71 px/f, about 10 f), its image sharpening over 12 f. For "send and
    request", "two sides", "one line of code", "write it, see it".
43. **Drain the world, colour the verdict** (CrowdReply, ref29 21.70–24.84). Everything around the subject drifts
    outward and turns grey over about 0.6 s while one pill in the warning colour grows from a dash at the optical
    centre (an S-curve in width, 15 f, peak +101 px a frame, no overshoot); its two words follow as it settles
    (22.60 and 22.88 s); then the frame holds near-still (0.45 px/f) through the sentence. For the one loss or
    consequence line.
44. **The product replaces the problem's interface** (CrowdReply, ref29 24.84–26.20). The icon at the start of a
    search bar slides through the query at about 65 px/f, erasing it (11 f), shrinks to a dot (4 f) and regrows as
    the product's mark (3 f); the name rolls out of it a letter a frame (8 f). For "that's what X fixes",
    "introducing X", "instead, X".
45. **Transfer: leave, travel, arrive, count** (Payy, ref32 17.20–18.88). A capsule buds out of the source (18 f
    ease-out) and holds about 0.8 s; it stretches on an ease-in (5 f), detaches, travels on a short bell (357 px in
    11 f, peak 56 px/f) and merges into the target. The source's number rolls down during the departure (14 f),
    the target's rolls up after the arrival (16 f), and a badge pops 4 f after the merge. For a payment, a message
    sent, data synced, a reward: cause and effect in order in under 0.7 s.
46. **Lift the content out of its container** (Payy, ref32 22.17–22.72). The whole source (a post, review or email)
    shows for about 2 s; then its chrome fades over 15 f while the part that matters scales up about 26% on a bell
    (33 f) and becomes the subject. It can leave edge-on into the next scene (an 11 f collapse, the cut on the
    thinnest frame, as in 11). For a review, a press mention, a partner announcement.
47. **Defocus as pointer** (Shopify Sidekick, ref33 2.17, 15.00–16.00 and 25.27–25.97). After a 2–3 f change,
    everything but the control or line the voice names goes out of focus, or a tilted plane's depth of field keeps
    only the active line sharp, and it stays so through the hold. For one control in a dense interface, with no
    boxes, arrows or dimming.
48. **One-second roll-call** (Shopify Sidekick, ref33 whole film). Shots of exactly 30 f with a hard cut on every
    whole second, each holding one complete interaction that starts 0–17 f in and settles 5–15 f before the cut;
    macro shots (UI text 40–145 px, bleeding off the frame) alternate with micro ones (a whole component small on
    white), with a dark shot about every 4 s. For a 4–8 s stretch where the voice rattles off a list of features;
    never a whole voice-over film.
49. **Page-peel flip-book** (Payy, ref32 29.70–32.15). Eight pages peel from the right edge towards the upper left,
    each ramping up over about 10 f and gone 4 f after its peak; the first a beat apart (0.43 s), then eighth notes
    (0.20–0.23 s), overlapping at the end; the last reveals the end line. For an end montage of outputs, channels or
    places, cut to music.
50. **Lockup on the fastest frame** (Grok Bot, ref28 8.17–9.97; Team Bots, ref30 24.37–26.10). The mark grows from 43%
    to 100% on an exponential ease-out (11–12 f, no overshoot), holds 4–5 f, shrinks on an S-curve (14–16 f) and
    slides sideways on an S-curve (peak 45–46 px/f), turning once about its vertical axis so its eyes or highlight
    come round. The wordmark's first word pops on at the slide's peak speed, the second 4 f later; the lockup
    settles centred. For a sign-off with a round or character mark, calm enough for a clean film: A1's change on
    the fastest frame, used for a reveal.
51. **A letter opens into the product** (Shopify Sidekick, ref33 0.00–0.67 and 32.00–32.80). One letter of the name
    swells (ease-in 8 f), becomes a rounded window onto the product on the fastest frame, and grows on an ease-out
    (11 f), pushing its neighbours apart. At the end the film's first interface, still typing, sits in the word in
    place of a letter; the group accelerates in (10 f), swaps on the fastest frame and the letters close (6 f). For
    an opening and its callback at the sign-off; extends 7.

## Applying them

- Choose by meaning: the technique has to act out the phrase (`planning/phrase-by-phrase.md`). A dial for a
  number, a typed prompt for "ask", the word-button for "one click", a lens for "insight", a funnel for
  "conversion", a puzzle for "fits".
- Take two or three for a film, with the transition family (`motion/transitions.md`), so it feels authored.
- Build the second rhythm in: a line of type alone, then its picture, alternating, with the camera and a
  bloom always moving.
- Never copy a reference's layout, palette, illustrations or copy. Name the reference in the storyboard
  notes when a technique comes from it.

| Ref file | Brand | Look | Moving | Typical change | Longest still | Cuts |
|---|---|---|---|---|---|---|
| ref03 | UpSend | grey, yellow and black flat illustration | 94% | 4.4% | 3.5 s | 5 |
| ref04 | SmileGenius | pale teal and pink, gradient characters | 98% | 2.0% | 0.13 s | 0 |
| ref05 | Dripc | periwinkle, 3D coins and icons | 99% | 3.5% | 0.27 s | 6 |
| ref06 | pretaa | pale grey, blue and red blooms | 99% | 3.9% | 0.13 s | 2 |
| ref07 | FCS | dark purple, 3D UI, footage | 97% | 5.5% | 0.10 s | 6 |
| ref08 | Happy | white and orange, footage and UI | 97% | 5.3% | 1.5 s | 5 |
| ref09 | Qualetics | dark, then white line art | 97% | 3.2% | 0.37 s | 0 |
| ref10 | JustCall × Pipedrive | periwinkle and mint, 3D shapes | 99% | 2.7% | 0.10 s | 0 |
| ref11 | CalcuQuote | pale blue, UI and footage | 98% | 3.1% | 0.10 s | 5 |
| ref12 | Shopgenie | collage, blue and white | 96% | 2.1% | 0.13 s | 1 |
| ref13 | JOS | white and teal line illustration | 99% | 5.0% | 0.43 s | 0 |
| ref14 | Faronics | footage with UI, pale blue | 97% | 4.1% | 0.07 s | 11 |
| ref15 | boksi | mint and peach, 3D shapes | 100% | 6.6% | 0.03 s | 5 |
| ref16 | Benefits Science | aqua with colour blooms, UI | 98% | 4.0% | 0.43 s | 4 |
| ref17 | kyvos | charcoal and orange, line and dots | 90% | 1.8% | 1.1 s | 0 |
| ref18 | collato | purple, lavender, 3D UI | 94% | 3.7% | 1.4 s | 3 |
| ref19 | elyxir | black and green glow | 100% | 4.8% | 0.13 s | 4 |
| ref20 | Lovio | clouds, glass UI, deep blue | 99% | 4.2% | 0.08 s | 9 |
| ref21 | OSK Manager | white and blue blooms, kinetic type | 94% | 2.8% | 0.63 s | 1 |
| ref22 | SKUVE | off-white and lime, type and footage | 96% | 2.8% | 0.10 s | 17 |
| ref23 | Seed Fitness | warm off-white, kinetic type, UI | 71% | 0.5% | 0.67 s | 10 |
| ref24 | Qwilr | white, kinetic type, UI | 75% | 1.0% | 1.1 s | 0 |
| ref25 | Vela | white and periwinkle | 96% | 2.3% | 0.17 s | 1 |
| ref26 | Fellow | indigo and white, 3D UI | 88% | 1.8% | 1.2 s | 7 |
| ref27 | Kaelio | mint, serif and sans, kinetic type | 100% | 3.7% | 0.03 s | 1 |
| ref28 | Grok Bot | white, flat chat UI, black type, no camera | 79% | 0.4% | 0.93 s | 0 (4) |
| ref29 | CrowdReply | white, coral and periwinkle, UI and kinetic type, voice-over | 98% | 3.5% | 0.92 s | 0 (about 16, most hidden in whips and zooms) |
| ref30 | Grok Bot (Team Bots) | pale tint per use case, chat UI, no camera | 86% | 0.9% | 0.83 s | 0 (11) |
| ref31 | Morphic | near-black, white type, UI and photos | 83% | 1.0% | 1.23 s | 0 (6) |
| ref32 | Payy | black, acid lime and grey, flat UI, 60 fps | 86% | 1.1% | 1.80 s (the end) | 11 (11) |
| ref33 | Shopify Sidekick | pale grey UI, black punctuation shots | 67% | 0.4% | 0.83 s | 21 (32) |

ref28–ref33: Cuts is the scene detector's count (`cuts.txt`), with the hard cuts counted frame by frame in brackets;
the detector misses a cut between two frames of similar brightness (pale or dark). ref32 runs at 60 fps and ref29 at 25.
