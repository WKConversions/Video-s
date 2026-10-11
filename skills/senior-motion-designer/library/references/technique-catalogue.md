# Technique catalogue: Karl's reference films

Twenty-five SaaS and product explainer films Karl selected in October 2026 as the motion design he wants
(sent as files, read frame by frame with `scripts/ref_sheet.py`, measured with `scripts/motion_check.py`).
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
