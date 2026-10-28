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

---


# M. Motion-graphics SaaS films: measured techniques

Sources (October 2026, motion graphics and UI animation only; live-action and prop films were screened out):
Thinkmojo's Salesforce Agentforce (tm_1) and MuleSoft (tm_5) spots, Obin Studio's AutoHDR (obin_2) and Bleap
(obin_3) films, Foundey's Walkway (foundey_2), Motion the Agency's Sully (mta_sully). Strips and logs are in
`training/reads/<ref>/`.

## The law under all of them: accelerate into the cut, decelerate out of it

Of the measured scene turns in these films, the most common shape is **ease-in → cut on the fastest frame →
ease-out**, not a dissolve and not a symmetric move:
- into the cut, the change grows ×1.13–1.49 per drawn frame (median about ×1.3) for 4–6 frames,
- the cut sits on the frame of peak speed, usually blurred, so the eye can't see the seam,
- the next shot arrives *already moving* and settles within 1–8 drawn frames (median 3).
In code: the outgoing move ends on `cubic-bezier(.55,0,1,.45)` (or any ease-in whose last 20% covers half the
distance); the incoming one starts on ARRIVE. Measure a render with `motion_read.py`: a turn that reads
"hump (ease-in-out)" with no cut is a page change, not this.

## Techniques

**M1. Push into the UI pill, cut on its colour** (Thinkmojo Agentforce, tm_12 locally / tm_1 in round M1,
0.30-1.70 s, f7-41 at 24 fps; re-read on every frame). The camera pushes into a magenta "Done" pill: 4 slow
frames, then a steady exponential ramp of x1.14 -> x1.41 per frame for 15 frames, motion blur on the last 3; on
the fastest frame (all magenta) the cut lands on a violet-magenta title scene. *Transfers as:* the transition
object is a UI result in the current frame and its colour is the bridge; a constant-factor ramp (e^kt) feels like
a camera. *Don't copy:* the pill and its sparkles.

**M2. One push across a hard cut, through the logo** (Thinkmojo MuleSoft, tm_16 locally / tm_5 in round M1,
5.20-7.20 s, f157-217 at 30 fps; re-read on every frame). The stacked API cards slide out, accelerating x1.25-1.4
for 9 frames; hard cut to the logo badge, soft and already pushing in; the push runs at a constant rate (change
7-11 per frame, no ease) for about 26 frames until the logo is a defocused blue field, inside which the next scene
(a grid of connector buttons) racks into focus over about 10 frames. *Transfers as:* the camera is continuous
across the cut; a constant speed reads as travelling through the brand; defocus the logo into the next space.

**M3. Pull back, cut to a title that lands big and shrinks** (foundey_2 Walkway, 16.80-17.75 s, f504-532 at 30
fps; re-measured every frame: the earlier "cards exit left" reading was wrong, it is a pull-back). The camera
pulls back from a UI card for 10 frames, change x1.03-1.32 per frame (card to about 60%); hard cut on the fastest
frame to a violet field with diagonal slabs; the first title line is there on the cut frame at about 130% of its
final size, the second line 2 frames later; both shrink and settle on a geometric decay of x0.68-0.76 per frame
(still after about 10-13 frames) while the slabs drift at a constant slow rate. *Transfers as:* the title
continues the camera's direction across the cut (getting smaller after a pull-back); chapter cards are
punctuation, delivered on a cut, and they still move. Settle with an exponential, not a spring.

**M4. The anchor relay** (mta_sully, 16.05-17.03 s, f481-509 at 30 fps; measured every frame). First the anchor
pill ("AI Nurse") is stripped to its name: its status lines fade over 6 frames while nothing moves. Then the
document panel and the pill slide left together (5 frames into the peak, x1.2-2.9 per frame; the panel travels
over 100% of the width and leaves, the pill about 45%); the next pill ("AI Receptionist") enters from the right at
the same speed on the same line. Horizontal blur on the fastest frames only (f494-499); both settle within 4
frames of the peak; 3 frames later a connector draws between them in about 4 frames. *Transfers as:* one object
persists through the turn and the new information arrives next to it; strip the anchor to what travels; state
the relation (a line) after the motion stops. Whole relay about 0.9 s.

**M5. Anchor type, the world changes behind it** (obin_3 at 21.8 s). The line ("beyond money") is fixed; a soft
blue-white light mass rises from the bottom and sweeps behind it in about 8 frames, and as it passes, the glossy
3D icons around the line become small outlined chips. *Transfers as:* when the words stay, the morph happens to
the world; the reader keeps their place.

**M6. The word is the wipe** (obin_3 at 13.6 s). Hard cut to white; a giant, motion-blurred word ("Trade") sweeps
right to left across the frame, decelerating, for about 0.7 s, then snaps to its small resting size in two
frames. *Transfers as:* a single key word can be the transition, at a size where its letters are shapes; the snap
to reading size is the landing.

**M7. Letters still landing after the cut** (same clip, f27-41; re-read on every frame). On the cut frame the
wordmark's first letters are set and its last 5 are mid-fall along an arc; they settle one after another over 14
frames (x0.89-0.96). *Transfers as:* entering a shot with its animation already under way hides the cut and makes
the film feel continuous.

**M8. Title lands on the last frame, a frame closes in** (obin_4 AutoHDR, 13.30–14.30 s, f399–429 at 30 fps).
The product scene drifts up and towards the camera with change growing ×1.08–1.18 per frame for 12 frames; on
the last frame of that scene the title ("Now") is overprinted at full size, in its final position; the next
frame is a hard cut (×8.8) to black, where only the background changes. The leftover purple light clears in 2
frames; 5 frames after the cut a hexagon outline enters from beyond the frame edges and closes around the word
(peak 1 frame later, then ×0.80–0.90 decay, settled in about 11 frames) while the word shrinks 5–8%.
*Transfers as:* print the incoming title on the outgoing scene's last frame, so the thing being read is the
constant across the cut; then give the card one closing shape that points at the word. *Don't copy:* the
hexagon itself; use a brand shape.

**M9. Defocus and heat into the cut** (tm_4 Wayground, 20.36-20.90 s, f490-504 at 24 fps). Two frames
before anything moves, a hot-pink wash floods the cool lavender background from the right (change x3.1, x2.1);
then the UI card blurs until unreadable while it rises out of the top of the frame, accelerating x1.04-1.73 per
frame for 6 frames, with warm light rising from below. Hard cut to an empty orange-to-plum field held for one
frame. *Transfers as:* end a UI scene by changing its colour temperature and focus before its layout; the wash
brings in the next shot's colour, so the cut changes layout, not colour. *Don't:* blur without motion (reads as
a focus error) or dissolve between two gradients (mud).

**M10. Wordmark writes on, one letter per frame** (tm_4 Wayground, 20.90-21.57 s, f504-519). After one empty
frame, the wordmark appears one letter per drawn frame (9 letters in 0.37 s); each letter enters about half a cap
height below the baseline, tilted, and springs into place over 2-3 frames, so 2-3 letters are always moving; the
mark builds bar by bar alongside; the lockup re-centres every frame; letter colours flicker accent -> brand over
about 4 frames; the background glow keeps receding for 15 frames after the last letter (decay x0.81-0.94).
*Transfers as:* a logo write-on is fast enough to read as a burst (1 letter per frame at 24 fps), grows from the
centre, and the stage keeps moving after it lands. *Don't:* typewriter speed (3-5 frames a letter) or a fixed
left edge.

**M11. The logo mark flies in giant and shrinks into place** (tm_4 Wayground, 3.62-5.00 s, f87-120). No cut:
the lead-in line ("Say hello to") recedes to about 1/8 size in 7 frames, accelerating (x1.5-2.3 per frame);
the mark's bars then sweep in from the right at 2-3x the frame height (peak change on the entry frame) and
shrink about 16x to their rest size over 13 frames on an ease-out, staggered a frame apart; the write-on starts
on the landing frame. *Transfers as:* at giant scale the mark is abstract colour and acts as the wipe; the
recognition happens as it shrinks; the landing hands over to the next event with no pause. *Needs:* a bold,
simple mark (bars, blocks, one letter); thin marks become noise.

**M12. Type only the key phrase; the rest of the paragraph scrolls in whole** (Obin Studio manifesto, obin_3
of the October 2026 download, 13.40-14.60 s, f402-438; drawn at 15 fps). An extreme close-up of a paragraph
(line height about 15% of the frame, lines cut off at both sides, fading to grey towards the top-left) scrolls up
like an editor. Only the accent phrase types on, in violet with a violet caret, at about 33 characters a second
(1-2 per drawn frame); on the frame it completes, the paragraph eases up one line (peak 2 frames later, settled
in about 6); the next black line appears whole in one frame. *Transfers as:* typing is reserved for the phrase
the viewer must remember; context text arrives at once; the close-up makes the viewer follow the writing edge,
not read ahead of the voice-over.

### From the parallel training session (rounds M2-M6, October 2026). Entries marked "re-read on every frame" are verified; the others come from key-frame strips

#### Framer, Ordinary Folk, Venture Videos

**M13. Macro typing insert** (framer_1, 0.60-2.10 s, f18-63 at 30 fps; re-read on every frame). Wide prompt box
typing about 1 character per drawn frame under a slow push-in (box +20% over the sequence) -> hard cut (f36) to an
extreme close-up of the line, text about 1/6 of the frame high (60x the wide), for 23 frames (0.77 s, about 13
characters a second); the text layer slides left one letter per letter so the caret holds within about 5% of
one screen position, the box's glowing edge drifting past -> hard cut back to the wide with the sentence about 13
characters further along (time compressed). *Transfers as:* tiny interface text made legible and alive by an
insert shot, not by zooming the whole UI; the caret is the fixed point; the cut back skips ahead.

**M14. Skeleton hand-off** (framer_1 at 16.9 s). The rows of the outgoing list turn into placeholder bars and
slide; the next page arrives as bars and resolves into text, row by row (~6 frames each side). *Transfers as:*
the loading state is the transition and says "generated" without a word.

**M15. Burst, scatter, regroup, foreground wipe, re-bloom** (of_equilibrium, 5.30-6.75 s, f127-162 at 24 fps;
re-read on every frame). A disc formation settles face-on (x0.54-0.92 per frame for 8 frames) and holds about 4
frames; it bursts towards the camera (x3.8, x3.2, x2.2, then x3.6; peak on the 5th frame) while the inner discs
regroup small and rotate (13 frames) and a new ring swings in and contracts; huge translucent discs in the next
palette sweep past the lens as a foreground wipe (one frame of change 29) and the next composition is already
assembling under them. 1.5 s, no cut. *Transfers as:* "many parts become one" without a cut; hold the whole
before breaking it; burst towards the lens; the foreground wipe is made of the same material as the scene.

**M16. Carousel swing between devices** (vv_reel, 12.90-14.30 s, f322-357 at 25 fps; re-read on every frame).
After a 13-frame hold (change under 0.6), the tablet and phone rotate about a vertical axis and slide left,
accelerating x1.1-2.3 per frame for 6 frames; on the peak frame (f342) the old device leaves at the left edge,
edge-on, as a desktop window enters at the right, turned the other way; it turns face-on and centres, decelerating
x0.56-0.95 for 10 frames. Whole swing 17 frames (0.68 s), ease-in-out with the peak just past the middle. The new
window's call tiles appear 4 frames after the peak, while it still moves. *Transfers as:* both devices on one
rotation (a ring around the camera) read as one camera move; the fastest frame is where nothing is readable.

**M17. Whip pull-out to black, a detail returns from depth** (framer_4 Publish key film, 0.20-1.30 s, f6-39 at
30 fps; re-read on every frame). A keyboard macro pulls back gently (x1.08-1.34 per frame, 8 frames), turns into a
whip (5 frames, peak on the 2nd at x3.2, blur on 4 frames) as the keyboard shrinks, tilts and drops out into black;
one black frame; then the keyboard's own small display ("Published Today") returns alone from depth, from about
1/12 to 3/4 of the frame height over 18 frames, accelerating 8 frames then slowing (an ease-in-out, not ARRIVE).
*Transfers as:* a void frame as the joint between two 3D subjects; the second subject is a detail of the first
(cause -> effect); opposite directions (away, then towards the camera).

#### Retool, Clay

**M18. The prompt becomes the result** (retool_m4 at 11.2 s). The cursor sends a prompt; the cut lands on the
press frame onto the generated artefact, already drifting. The click is the cause, the cut the effect.

**M19. Diagonal dashboard conveyor** (retool_m4 at 11.5 s). Four to six boards on one tilted plane slide up-left past
the camera in one ~2 s ease-in-out, alternating dark and light, landing on the board with the message.

**M20. Extruded bar wave** (retool_m4 at 7.0 s). Bars as 3D blocks; a wave of value changes runs along x (1–2
frames per bar), shallow depth of field on the middle bars.

**M21. Focus pull to the KPI** (retool_m4 at 19.9 s). A slow track over a tilted dashboard while focus racks from the
near cards to the number, which arrives last and sharpest, 3–5 frames after the track stops.

**M22. Ball-run process loop** (Clay website "Execution" loop, clay_execution, 8 s at 15 fps; re-read on every frame).
A pastel 3D wheel with four action buckets; every 30 frames (2 s) a ball rolls down a tube, accelerating (14 frames,
ease-in like gravity); the wheel starts its 90-degree turn 4 frames after the ball appears (11 frames) so the empty
bucket is at the top in time; the new ball lands on the same frame the previous ball, tipped out, hits the floor;
4 frames to settle; ball colours alternate per cycle; static camera, change per frame only 0.9-1.6. *Transfers
as:* input -> process -> output as a toy; real physics for the input; the machine anticipates the input; two
events on one frame make the cycle feel like clockwork.

**Observation: animate on twos.** tm_2, Notion's hero and Retool's teaser hold every drawing for 2 frames (12–15
drawings a second), camera included: a calm, crafted register for product loops. The transition-heavy films are
on ones. A register choice, measured by `motion_read.py` (cadence ≈ 2).

#### Logo and end cards (Thinkmojo's DataCamp, Cloudera, Torq, Slack)

**M23. Brand-system montage, then a colour strobe on the lockup** (Thinkmojo DataCamp, tmw_2, 0-3.30 s, f0-80 at
24.5 fps; re-read on every frame). Hard cuts, one identity element each, almost no motion inside: stripes 6 frames,
dots 10 (constant tiny drift), the mark drawing itself 11 (one 8-frame stroke move). Then the lockup holds in
exactly one place while the background flips violet 4 -> green 5 -> pink 5 -> cyan 5 -> orange 2 frames (about 5
flips a second, the last one short), and the film cuts to its first scene. Montage total 48 frames (2 s).
*Transfers as:* one element per cut, nothing animating inside short shots; a still lockup with a moving palette;
shorten the last beat to end.

**M24. Wordmark built from stroke fragments** (Cloudera). Letters appear as their parts, completing left to right
in ~8 frames, no fades; then letter-spacing tightens ~8–10% over ~0.8 s, linear, so the card lives.

**M25. Symbol hits full frame, inverted flashes on the beats, glitch write-on** (Thinkmojo Torq, tmw_8 locally /
tmw_7 in the parallel session, 6.80-8.90 s, f171-223 at 25 fps; re-read on every frame). After a slow drift, the
symbol appears small and jumps to full frame within 1-3 frames; 2 inverted frames (light background) mark the hit;
the symbol's shapes burst outward in 3 frames to reveal the mascot; the wordmark writes on in about 12 frames, letters
on twos with glow and smear that fade as they settle; a second 2-frame inverted flash lands 6 frames after the
write-on settles (22 frames after the first: the downbeat); the end card holds the lockup while fire boils on twos.
*Transfers as:* an inverted frame is a drum hit (2 frames: felt, not seen); two flashes mark "the mark" and "the
brand"; keep flashes on the beat and at most 1-3 a second (photosensitivity).

**M26. Dots stretch into the logo, hold, release** (Thinkmojo Slack loop, tmw_20 locally / tmw_24 in the parallel
session, f0-208 at 30 fps, mostly on twos; re-read on every frame). Four dots wander on an isometric tile (about 40
frames), stretch into translucent strokes along their own directions with a small overshoot (about 9 frames), hold
the logo (about 38 frames, breathing slightly), contract back to dots (about 7 frames): a seamless cycle of about
100 frames (3.3 s); strokes mix where they cross. *Transfers as:* the logo's parts are in the frame from the start
(the dots are the strokes' ends); a hold over a second so the logo is read every cycle; on twos for a calm loop.

#### Thinkmojo illustration, UI and 3D films

**M27. Glint re-skin** (Thinkmojo, tm_21 locally / tmw_26 in the parallel session, 17.65-18.75 s, f530-562 at 30
fps, mostly on twos; re-read on every frame). Set-up: the finished card of the previous beat slides out while the
pale blueprint card turns face-on and the sky darkens day -> night (10 frames, decaying); a hold of about 4 frames;
then a soft white diagonal band (about 1/3 of the card wide) crosses top-left -> bottom-right in 12 frames (0.4 s,
peak at the middle) and the card is in its finished state exactly at the band's trailing edge (blue blueprint ->
white card, black type, pink charts). *Transfers as:* the light causes the change, so "draft -> final",
"personalised", "updated" read as one event; the layout must not move during the glint.

**M28. Word roll follows the card** (Thinkmojo work-management spot, tmw_14 locally / tmw_17 in the parallel
session, 2.60-3.60 s, f78-109 at 30 fps; re-read on every frame, which corrected "on the same frames"). A category
word over a stack of task cards; the card changes first (lands in 1 frame, settles in 2), then the word rolls up
inside a mask about 1.2x its height (about 3 drawn frames, old word out the top, new word in from below), 0-3
frames after the card; about 8-11 frames per category (Project -> Workflow -> Portfolio); the last cycle drops the
word and the card carries on. *Transfers as:* the example comes first, the label names it; a masked roll reads as
one machine; stop at 4-5 items.

**M29. Card match-cut: same frame, new character, new world** (Thinkmojo 3D avatar film, tmw_23 locally / tmw_29
in the parallel session, 7.30-8.30 s, f176-200 at 24 fps; re-read on every frame, which corrected the first reading:
it is not a foreground wipe). The camera tracks past out-of-focus foreground leaves towards a tilting glass profile
card, accelerating x1.03-1.28 per frame for 11 frames; hard cut on the fastest frame (x2.5) to an extreme close-up of
the same card holding a different character in an underwater world; the camera pulls back (x0.52-0.96) until the
card is within about 5% of its pre-cut position and size, settled in about 12 frames. *Transfers as:* the card is
the anchor across a cut; the new shot starts close and pulls back to the old framing; the foreground layer adds
speed and depth, it doesn't hide the cut.

#### Sound sync

**S1. Sound lands just before the picture** (Framer with audio; WKC v3). Median offset −1 frame (sound first), and
Framer's biggest cut pre-laps by 3 frames (a J-cut). New instrument `scripts/av_sync.py`: matches every strong
visual hit with the nearest sound onset and, because music puts an onset near almost any frame, compares against
random frames. A hit counts as scored only above chance. `scripts/av_plot.py` draws the curves with the hit's frames.
Observation, not a rule: one external film with sound so far.

**M30. Stepped scroll speeds up into a cut** (framer_1, 16.40-17.60 s, f491-528 at 30 fps). A generated page in
a glowing frame, its portraits alive (small loops) and the last one loading from a dark placeholder (about 8
frames); the page scrolls in steps, a few pixels every 5 frames with holds between; the steps merge into a
continuous scroll accelerating x1.1-2.0 per frame for 7 frames; hard cut on the fastest frame to the next page,
smaller, drifting up-left, settling in about 10 frames (x0.66-0.92) with a cursor moving on it. *Transfers as:*
browse a UI in steps so it stays readable; let the steps speed up into the cut so the turn is felt.

**M31. Push through the letter's counter into the next scene** (Foundey, foundey_1, 4.10-6.30 s, f122-188 at 30
fps). Punch-in on a word ("do.", x2.0-2.8 per frame, 6 frames); a slow push (20 frames, decaying) while the
gradient shifts green -> blue -> violet; anticipation: the word shrinks about 10% in 2 frames; a 7-frame pause;
the dive into the "o" (7 frames, peak on the 2nd) until its white counter fills the frame; that white is the next
scene's background, where a cursor settles (6 frames) and an app window fades up around it (10 frames). No cut.
*Transfers as:* match the letter's counter to the next background exactly and put the transform origin in the
counter; anticipate a big push with a small pull-back and a pause.

**M32. Hero comes close and holds, then a cut reveals it tiny in the world** (Ordinary Folk, Creation, of_creation,
5.50-8.20 s, f132-195 at 24 fps, on threes). Cut in mid-pan (motion-blurred first frame); a bird emerges from behind
the moon and approaches over about 8 drawings (0.9 s) to nearly fill the frame while the sky goes night -> day; a
hold of about 20 frames (only a wing flap); it flies away (3 drawings, shrinking to half, accelerating); cut to a
wide shot where the same bird is about 3% of the frame width on a planet. *Transfers as:* bond with the hero in a
held close-up, then let a scale jump at the cut say "small part of a big world"; the leave sets the direction.

#### Buck, Collins (parallel round M8; key-frame strips)

**M33. Wide to macro where two objects meet** (BUCK, Copilot+ PCs, buck_copilot_7, 1.60-4.00 s, f38-96 at 24 fps;
re-read on every frame). Three laptops tumble and settle (about 26 frames); hard cut on the settle (not a peak) to a
macro of two corners meeting, ports and hinges crossing in an X; the macro drifts at the wide's ending pace. The
web file shows a judder (every 4th frame about 2x the change): a dropped frame per 4 from a rate conversion,
confirming rule 18. *Transfers as:* cut in to the point where two things touch (in 2D: where a connector meets
a card); keep the camera's pace across the cut.

**M34. Stacked devices resolve to the hero** (Buck, Surface). The range stacked in depth; the hero's lid opens while
the others sink behind it, about 15 frames, landing on one hero.

**M35. Brush-stroke vortex wipe** (Buck, 2D). The film's own brush strokes fill the frame from the edges (ramp x2.83,
the steepest measured), then spiral down to the next scene's focal point.

#### Koto (parallel round M9; key-frame strips)

**M36. Rubber letters fly in and keep wobbling** (Koto, Fitbit Ace). Letters fly in as stretched 3D tubes (about 4
frames each, 3-frame stagger) and squash into their forms; plain secondary text pops in beside them; the lockup
sways like jelly over a strobing sunburst.

**M37. Living mark, only the eyes move** (Koto, Tripadvisor). Everything frozen for 18 s except the owl's eyes: a
6-frame blink (1 closing, 3 shut, 2 opening) and pose-to-pose gaze holds. The smallest living end card.

**M38. The AI's face is made of lines that become its state** (BUCK for Notion AI, buck_notion_1, 38.50-41.60 s,
f924-997 at 24 fps, on twos). The assistant's face is a few brush lines in a circle; to show a state the same line
morphs: the face collapses into one stroke (4 drawings), becomes endless cursive handwriting in place (the
"writing" state, about 15 drawings, steady change), curls back into the face (4 drawings); each state has its own
background colour (red idle, blue writing, yellow thinking), cut on the change with a slightly closer framing;
then the face turns to a profile pose (9 drawings, decaying). *Transfers as:* the character is its activity;
show AI states with the mascot's own line instead of spinners or labels; a colour per state, always cut.

#### Oddfellows, Tendril (parallel round M11; key-frame strips)

**M39. Graphic-match pull-out** (Oddfellows). About 10 hard cuts in 1.4 s between crops of rhyming shapes, each a
little wider, centred on the same silhouette. Cut on every drawing at first, then hold longer: the rhythm slows
into the reveal of the whole object.

**M40. Container-morph logo carousel** (Oddfellows). A badge outline morphs about every 8 frames; the colour pair and
the logo swap at the morph's midpoint, when the shape reads least. A logo system, product icons or partners
shown as one object.

**M41. Integration lines: icons turn colour on contact** (Thinkmojo meeting-assistant spot, tm_13, 12.10-14.60 s,
f291-351 at 24 fps). The camera tracks right (about 15 frames accelerating, 45 decelerating) as the product window
slides out; lines in four colours draw out of the product, ahead of the camera, to grey integration icons (Slack,
Figma, Jira, Google); each icon switches grey -> full colour on the exact frame its line touches it (contacts 14,
8, 4 frames apart: speeding up); the lines then erase from their tails and the camera settles on the coloured
icons. 2.5 s. *Transfers as:* integrations as cause and effect (connect -> colour), lines out of the product, one
colour per connection, colour switched in one frame, lines removed at the end.

#### Tendril (parallel round M12; key-frame strips)

**M42. Flash swap behind giant type** (Tendril). A giant word sits behind the hero object; one inverted frame, a
white frame, then a cut to a new object in front of the same unmoved word (~5 frames in all).

**M43. Texture first, then the object** (Tendril 2026 reel, 10.30-11.80 s, f247-283 at 24 fps; re-read on every
frame). Hard cut into an unidentifiable macro of a studded black surface (23 frames, a slide and slow pull-back on
twos, then 4 frames accelerating x1.4-2.4); cut on its fastest frame to the whole object (a robot hand) arriving
already moving (x0.79-0.84), the texture recognisable on its palm. *Transfers as:* mystery first, answer second;
in SaaS, a macro of one UI detail before the whole screen.

**M44. The UI becomes the world it stands for** (Thinkmojo Discord spot, tm_22, 8.90-10.40 s, f214-250 at 24 fps).
A voice channel with two avatar tiles drifts left and away (6 frames, x1.13-1.19); the scene it stands for (the
two avatars as full illustrated characters on a couch) sweeps in from the right as a huge foreground layer in about
4 frames, in front of the UI; the camera pulls back from their close-up to a wide (about 16 frames, x0.77-0.93)
while the UI fades behind them; then the characters animate on twos. *Transfers as:* the emotional benefit beat
of a SaaS film: show what the UI means, with the UI's own avatars as the characters, entering in front of it.

#### SaaS product UI: Superhuman, Supabase; Cursor logo (parallel round M13; key-frame strips)

**M45. Clicked card becomes the page** (Superhuman Go). Container transform: the clicked card grows into the
header, its siblings clear in about 5 drawings, its actions cascade in 1-2 drawings apart. The viewer never loses
what was clicked. Superhuman's loops are on twos and threes (about 7-12 drawings a second) with long holds: a calm
product register.

**M46. Logo fold morph** (Cursor). The cube mark folds flat (faces edge-on), holds the square for 2-3 frames, and
unfolds into the logo: geometry assembling itself in 1.3 s.

**M47. Punch in, click, the tile lifts, whip to the result** (Foundey, Walkway, foundey_2, 21.80-23.95 s, f654-718
at 30 fps). Price tiles drop into a calendar; the camera punches in (6 frames to the peak, x1.2-4.4, then a drift
decaying x0.5-0.86 for 15 frames) until the dates are readable; a hand cursor travels about 10 frames and rests 4;
the press darkens the tile for 2 frames, then the tile lifts about 5 frames, tilted about 10 degrees, and drops
back with a dashed selected outline; a whip pan follows the cursor to the side panel (5 frames up to x4.8, braking
in 4), where the result's text fades in. *Transfers as:* punch in before a click; give the selection weight (lift
and tilt); move the camera along the user's intention, choice -> result.

**M48. The growth arrow draws the logo** (Foundey, Walkway, foundey_2, 38.80-41.90 s, f1164-1257 at 30 fps). A
feature toggle ("Auto Pilot") switches on (15 frames of hold with sparks); a thick white stroke with an arrowhead
pushes in from the bottom left and the camera follows it; it zigzags for about 2 s (3-4 turns, stroke about 1/6 of
the frame high) until white bands fill the frame; the camera pulls back (about 12 frames) and the path reads as the
logo mark, the background lightening violet -> lilac. *Transfers as:* the benefit's sign (a growth arrow, a check)
is the drawing tool that draws the brand; one stroke from the UI to the logo, no cut.

**M49. Observations become findings** (Foundey, Buildbox, foundey_1, 39.50-46.00 s, f1185-1380 at 30 fps). One set
of objects changes state step by step, one property per step: four pastel tags (raw observations) hold about 35
frames; the one positive tag floats up and fades (about 10 frames: the AI filters); the three problems line up in
a row (about 25); they shift to the same red (classified); they grow into two-line cards (about 12); hold (about
25); each turns into a real white UI finding card, one after another (about 15), as the caption types in with its
key phrase coloured. 6.5 s. *Transfers as:* show an AI or analytics product's value as a transformation of the
same objects, raw -> filtered -> classified -> product UI.

**M50. Benchmark bars: everyone counts up together, the winner lands first** (Motion the Agency, Sully, mta_sully,
2.80-6.10 s, f84-183 at 30 fps). The previous scene defocuses out (about 5 frames), cut to blue; the headline
arrives in 3 word groups 6-7 frames apart with a blur fade; four bars (product in brand orange, competitors grey)
grow together for about 30 frames with counters tied to them; the product lands first (f132, 84.1%), the others 2,
3 and 5 frames later; hold about 38 frames; scroll out. *Transfers as:* a comparison is a race; give the product
the shortest duration so its number is the first at rest (and the first read); brand colour vs grey replaces a
legend; hold over a second.

**M51. The toggle's knob becomes the agent** (Motion the Agency, Sully, mta_sully, 8.10-10.70 s, f243-321 at 30
fps). A settings card ("Patient Instructions") comes forward out of a fast scroll; the cursor travels about 20
frames and clicks; the toggle turns green in 1 frame; hold about 10; the card streaks left (7 frames, blur on the
fastest) while the toggle's white knob holds still; the knob grows into the "AI Scribe" pill (about 6 frames);
4 frames later a note panel fades in and writes. *Transfers as:* the control that enables a feature becomes the
actor that does it; build the knob as a separate element so it can stay when its card leaves.

**M52. The chaos shrinks into the app icon: dark problem, light solution** (Motion the Agency, BrowserOS,
mta_browseros, 7.80-14.40 s, f234-434 at 30 fps). "Manual chaos" over a dark, crowded browser (24 frames); "chaos"
dissolves into orange app icons that cursors and lines link into a turning network (about 3 s); the network
contracts and the dark frame itself shrinks into a rounded app tile on a light canvas (about 8 frames); the brand's
orange arrow carves the tile, circles (about 15 frames) and dives in; the tile opens into the logo (6 frames); the
wordmark wipes in and the browser rises. No cut. *Transfers as:* the problem -> solution turn as one object, the
solution literally containing the problem; dark world for the pain, light for the product; a brand element acts
to reveal the logo.

#### Narrated 2D explainers: DemoDuck, Breadnbeyond, Yum Yum (parallel round M14; key-frame strips)

**M53. Hub becomes the next scene's ground** (DemoDuck, Lithium Valley). A slow push into a diagram's hub; a disc
behind the hub icon grows about tenfold in 6 frames, accelerating, and becomes the next scene's colour field, with
the brand badge already on it.

**M54. Diagram builds one piece per phrase** (DemoDuck). One line-icon diagram held for 5+ seconds that adds exactly
the element each phrase names, on its word; an accent outline for the payoff.

**M55. The journey line runs through everything; a light page takes over at the question** (Motion the Agency,
Primer, mta2d_primer, 1.70-8.50 s, f51-255 at 30 fps). On dark brown, thin lines merge into one dotted orange line
(the payment journey); the camera tracks along it from step to step (blurred tracks): a checkout card, a Total
Payments counter racing to 6,513,441 in about 24 frames, a dot that becomes "Solved." The track empties the dark
frame while a light page with a torn paper edge waits at the right; the question "But what happens after the
payment settles?" types on in the dark and holds about 45 frames; the light page sweeps over (about 12 frames) and
the same line continues on light: the product's world. *Transfers as:* one line as the film's thread; dark for
the solved or old part, light for the product's part; put the question exactly on the border between them.

**M56. AI prompt to answer** (Motion the Agency, Mirakl, mta2d_mirakl1, 0-4.13 s, f0-123 at 30 fps). Headline
word by word (about 1.1 s, second line in the accent colour); cut to an extreme close-up of the prompt bar typing at
title size (about 16 frames, 2 characters a frame); the camera pulls back (about 8 frames) while typing speeds to
4-5 characters a frame and the request wraps to three lines; "Reasoned for 2 seconds." and the answer stream in,
each line sharpening from blur over 3-4 frames; the result card lands with a violet glow that fades from .9 to .3;
the cursor clicks the cart. 4.1 s. *Transfers as:* the AI-product opening: first words huge, pull back to show the
whole natural request, stream the reply, glow only the result.

#### Flat character explainers: Yum Yum, Breadnbeyond (parallel round M15; key-frame strips)

**M57. Character anchored, the world wipes behind and rebuilds piece by piece** (Yum Yum reel, yumyum_reel,
11.90-14.20 s, f357-422 at 30 fps; re-read on every frame). The protagonist (from behind, holding a mug) never moves;
the old office drifts left as a sky-blue band with a wavy edge and speed lines covers it (about 6 frames); about 6
frames of blue and lines (time passing); the new office wipes in (about 6 frames), furniture drops and slides in
(about 8), and three co-workers pop in 6-9 frames apart, the last jumping in and waving. *Transfers as:* "same
person, new situation"; the new world builds itself in pieces so the after is lively.

**M58. Zoom into one character, the props orbit in** (Breadnbeyond). The chosen character's badge swells over the
other character (a shape wipe in her colour, about 12 frames, ramp x1.22); her props fly in 1 frame apart and drift
in a loose ring; a paper plane exits to lead the next beat. "Meet this user and her tools."

**M59. Status word ladder** (Motion the Agency, Dext, mta2d_dext, 21.10-25.10 s, f633-752 at 30 fps). A static
Payment Runs table; the cursor steps down the status column (about 4 frames per row, then rests); at the left one
big brand-orange word names the pill the cursor is on (Approved -> Paid -> Reconciled, 1.1-1.3 s each), switching
with a 3-4 frame blur crossfade on the frame the cursor arrives. 3.7 s. *Transfers as:* a workflow's stages in
three words, each proven by the UI pill it names; cheap and very clear.

**M60. Product icon as hub; its world blooms around it** (Motion the Agency, Mirakl platform, mta2d_mirakl2,
3.80-11.00 s, f114-330 at 30 fps). Per product, the same centre slot: a dark circular icon lands (about 5 frames);
its world blooms around it (20+ retailer names fly in, blurred, settling into a ring in 15-20 frames); hold about 25;
the icon shrinks away (10 frames) and the product name sharpens in its place, then crossfades to the benefit line
(key words in the accent colour, held about 30); the world scatters (5 frames of blur) and the next product's icon
grows in the same place; for Ads the play icon shrinks into the dot that draws a line chart ("Turn traffic into
revenue"). About 3.5 s per product. *Transfers as:* one grammar for a product suite (same slot, same object, name
then benefit); the icon can become the data it drives.

**M61. The screen gets framed in brand colour, the frame bends into the logo mark** (Motion the Agency, VLX
vertical, mta2d_vlx, 4.30-6.70 s, f129-201 at 30 fps). The brand orange floods in around the picture (about 3
frames) and makes it a framed card with crop marks that shrinks to about 50% (8 frames, ease-out) and holds about
10; the card skews into a parallelogram and its corners curve while the orange gathers into the same shape (about 8
frames); shape and card shrink together, the card fading, into the logo mark (about 9 frames). 1.6 s, no cut.
*Transfers as:* the product scene becomes the logo; one property per step (colour, size, angle, curve, size); for
simple geometric marks.

**M62. "Introducing" types the parent brand, backspaces it to the initial, types the product** (Motion the Agency,
HackerRank Engage, mta_hackerrank, 18.80-23.40 s, f564-699 at 30 fps). The brand's green block cursor (from its
logo) blinks after "Introducing", then types "HackerRank" in about 9 frames; hold about 18; "Introducing" blurs out;
the brand backspaces to "H" in about 8 frames (letters blurring out); "Engage" types on beside it in about 9; the
"H█ Engage" lockup holds about 20 frames; the initial fades and "With Engage you can..." continues the voice-over.
*Transfers as:* introduce a sub-product of a known brand by shortening the parent to its initial in the same line;
type with the brand's own cursor.

**M63. The caption is an island, the data cards gather as the camera pulls back** (Motion the Agency, Dealpath AI,
mta_dealpath, 9.70-12.80 s, f291-382 at 30 fps). A two-line caption ("Every Opportunity Arrives Enriched")
sharpens word by word on a rippling field and holds about 15 frames; a slow pull-back (about 45 frames, scale 1 ->
0.6) brings 20+ small, deliberately unreadable data cards in from every edge until the caption is an island in a
wall of information; the pull-back then accelerates out (about 10 frames). *Transfers as:* show abundance of data
by number, not detail; the caption stays the one readable thing.

**M64. The button flies off, its glowing slot becomes the success toast** (Motion the Agency, Run, mta_run,
7.40-10.60 s, f222-317 at 30 fps). The email types on; "Complete Application" sinks (2 frames), then lifts and flips
up in 3D with motion trails (about 10 frames), leaving its slot glowing (white, violet outline); the form tilts back
and drops out of frame (about 12) while the slot holds still; alone on violet (about 6), the slot grows into the
"Merchant Activated!" toast (about 8) and its text sharpens. 3.2 s. *Transfers as:* submit -> success as one
object; the confirmation comes from where the user clicked; build the slot as its own layer.

**M65. The brand field shrinks into a planet, the products bud off as moons** (Motion the Agency, ScienceLogic
Skylar AI, mta_sciencelogic, 26.20-30.40 s, f786-887 at 30 fps). The platform name on full-frame brand green; the
field shrinks into a circle (about 12 frames, ease-out, to about 40% of the frame height) while the name keeps its
size; hold about 25 frames with a slow drift; two sub-product circles in their own colours ("advisor", "analytics")
pop out of it about 3 frames apart and drift into orbit (about 15 frames); the group keeps drifting. *Transfers
as:* a platform's product family in one image; budding says "part of" with no lines.

**M66. Contrast line, then "one of many": the agents orbit the logo** (Motion the Agency, Sully AI clip 2,
mta_sully2, 13.30-22.30 s, f399-668 at 30 fps). On charcoal, serif type with italic accent words: "Other scribes
*write notes*" (held about 30 frames) is replaced in the same slot by "Sully agents *run your entire
organization.*" (held about 50); giant agent pills scroll past while "AI Scribe. One of many" types (about 70
frames); cut wide to 12 agent pills orbiting slowly while the logo mark assembles in the centre (about 15 frames);
push in, cut to the wordmark. 9 s. *Transfers as:* the positioning beat: competitor claim -> our claim in the same
slot; then show the shown product as one of a family around the brand.

**M67. Files are dragged in, the AI writes the code, they drop down a beam into the product** (Motion the Agency,
XCentium, mta_xcentium3, 2.00-10.00 s, f60-300 at 30 fps). An empty dashed drop zone; five file-type icons (GIF,
JPG, PNG, DOC, PDF) fly in one by one, 4-6 frames apart, each carried by its own coloured cursor; hold about 35
frames; a dark AI panel slides in (about 8) and streams code for about 2 s; a beam draws from the files to the
product box (about 6) and the files shrink down it (about 30, staggered); "Content Successfully migrated" types on.
8 s. *Transfers as:* a migration / import made visible: many sources (colours, cursors), the AI as a texture of
work, the beam as the path into the product.

**M68. Three claims rise through one slot, then a light stroke draws the logo's first letter** (Motion the Agency,
XCentium, mta_xcentium3, 23.80-30.20 s, f714-910 at 30 fps). "All Built-In." shrinks and lifts; "High Performance",
"Low Maintenance", "Maximum Impact" each rise from below blurred (about 5 frames), hold about 20 and lift out as the
next rises, all in one slot; about 8 empty frames; a thin light stroke traces a slanted parallelogram (about 10
frames), fills teal (5), shrinks into the wordmark's X (8); "CENTIUM" appears with a glint sweeping through (10);
the lockup shrinks slowly. 6.4 s. *Transfers as:* a calm benefit list into the logo; one slot keeps the rhythm; a
breath before the logo; draw the logo's first letter as the event.

**M69. The page's text dissolves into particles that become the sound wave** (Motion the Agency, Sinai.ai,
mta_sinai1, 9.20-12.60 s, f276-378 at 30 fps). Push and pan across a book page (about 30 frames); letters detach
from the column's right edge as dark specks and the break-up spreads left (about 25 frames); the specks stream
right, warm from ink to orange/red (about 10 frames) and gather into a flowing golden sound-wave ribbon; the audio
player slides in over it (about 6 frames). 3.4 s. *Transfers as:* a format conversion (text -> audio, data ->
report) shown as the same material changing form; a colour change marks the moment it becomes new.

**M70. Option orbs on a carousel, a touch ring travels between them** (Motion the Agency, Sinai.ai, mta_sinai1,
15.80-20.60 s, f474-614 at 30 fps). The camera dives into the player's voice button (about 8 frames); each option
is a big glossy orb with name and description ("David, Slow & Steady"); an outlined touch ring slides in (10),
shrinks to a ring (4) and pulses (8); the next button morphs into the second orb (8); hold about 40; the ring
stretches into a pill and slides to the next orb (8); the carousel shifts, the old option shrinks to about 60% and
dims, a third enters at the edge; the background takes the chosen option's colour over about 15 frames. *Transfers
as:* "choose your option" without a cursor, for mobile products; the effect of the choice shown on the whole frame.

**M71. Feature word drum: the list rolls past an arrow and lands on the button** (Motion the Agency, Sinai.ai
clip 2, mta_sinai2, 7.30-10.10 s, f219-302 at 30 fps). A giant white arrow wipes the previous scene (about 8
frames); five features sit on a 3D word drum, the middle line upright and sharp, the others tilted 10-15 degrees and
blurred, a pointer arrow at the left; the drum rolls one item about every 8 frames (a 2-3 frame blurred roll, then a
hold of about 5); the last item rolled in is the product's "Ask Assistant" button, held about 25 frames. 2.8 s.
*Transfers as:* a teaser list of 4-6 features in under 2 s; roll fast, then hold; end on the CTA.

#### DemoDuck SaaS explainers: BetterCloud, CampusNexus, MatrixCare, Newsela, Prisidio, Skai, Zenoti (parallel round M16; key-frame strips)

**M72. Push through one avatar, people become data** (DemoDuck, CampusNexus, dd_campusnexus, 11.80-17.60 s,
f354-528 at 30 fps; re-read on every frame). A cloud of flat portrait bubbles builds from the centre out (about 25
frames) and holds (about 30); the camera pushes into the central bubble, accelerating (about 20 frames, to over
100% of the frame); through it, the same circles (same colours and sizes) have no faces: plain data points, one with
a building icon; the push eases and holds. *Transfers as:* "your people, as data" with the same layout on both
sides of the push.

**M73. Pull back, the detail was inside the product** (DemoDuck, CampusNexus). A chart at full frame; the camera
pulls back while the dashboard's panels build in around it, ending on the monitor that holds it, title typing in
last.

#### DemoDuck: Zenoti, MatrixCare, BetterCloud (parallel round M17; key-frame strips)

**M74. Colour-strobe celebration** (DemoDuck, Zenoti, dd_zenoti, 27.20-30.20 s, f652-725 at 24 fps; re-read on
every frame). The salon owner hugs the robot (the product) and throws her arms up (about 30 frames); hard cut on that
pose, same silhouette and position, to a flat field with the setting removed; her salon tools burst outward (about 8
frames) while the background flips 6 times in about 11 frames (green, pink, teal, pink, teal, pink), then settles on
pink with the props drifting. 3 s. *Transfers as:* the once-per-film emotional payoff; cut on the pose; strobe
under 0.5 s (photosensitivity).

**M75. Four tiles close into a box, it opens, the product name lifts out** (DemoDuck, MatrixCare,
dd_matrixcare, 9.60-13.40 s, f230-320 at 24 fps; re-read on every frame, which adds the closing step). Four orange
tiles, one need icon each, slide together into one seamless lid (about 14 frames); hold about 8; the lid folds
down towards the camera, the blue inner walls show and a white card with the product name rises out (about 12);
cut on the frame the card clears, to the card on a full field in the box's orange. 1.6 s. *Transfers as:* "all of
this, in one": pack the needs into the box, then unbox the name; the box's colour bridges the cut.

**M76. The wordmark's page shrinks into the app's sidebar, the UI grows out of it** (DemoDuck, BetterCloud,
dd_bettercloud, 25.20-29.80 s, f630-697 at 24 fps; re-read on every frame). The wordmark on a full-frame white page
holds about 30 frames; the page shrinks into a card on brand blue; "Better" and "Cloud" fade apart (about 6 frames)
leaving the mark; the card narrows into a column (about 12) with the mark moving to its top-left, and becomes the
app's sidebar; menu items appear and the main panel grows out of its right edge to full width (about 12). 2.8 s.
*Transfers as:* brand -> product in one rectangle; the logo ends where it lives in the real UI.

#### DemoDuck: Newsela (parallel round M20; key-frame strips)

**M77. Type writes itself with the voice** (DemoDuck, Newsela, dd_newsela, 0-3.0 s, f0-75 at 25 fps; re-read on
every frame). Grey-to-ink sans on white: each word of the narrated sentence appears at about 25-35% opacity about 4
frames (2-6) before it is spoken and darkens to full ink over 3-4 frames; the centred block re-centres on each word
and each new line; the block holds on the voice's pauses; about 2.5 words a second. *Transfers as:* the default
for a narrated key sentence: the eye arrives just before the ear; drive the timing from `scripts/vo_words.py`.

**M78. Nested squares open a tunnel out of the headline, the product rises from its centre** (DemoDuck, Newsela,
dd_newsela, 8.40-11.60 s, f210-289 at 25 fps; re-read on every frame). The product's name in the headline gets a
text-selection highlight (sweep about 6 frames, hold 6); a tiny pink square appears inside the name and grows as
three nested squares, accelerating, past the frame edges in about 15 frames; the app screen appears in the innermost
square and grows to about 80% of the frame in about 10. 2 s. *Transfers as:* the product grows out of its own name;
3 nested shapes read as depth.

**M79. The logo circle morphs into the first bar, the chart grows from it** (DemoDuck, Skai, dd_skai, 21.60-27.40
s, f540-685 at 25 fps). The logo circle's halo fades (about 20 frames); the circle stretches into a pill, rounds into
a square and widens into a card, the wordmark fading (about 20 frames, one property at a time); two more blocks grow
beside it (about 15); the chart zooms out (about 8) and the three become the first bars of a larger chart where
about 12 bars rise left to right, 1-2 frames apart. 5.8 s. *Transfers as:* brand -> results in one object; the
first bar is the logo.

**M80. A 10-second SaaS hook: the pain in icons, the mascot badge, the name, the product** (DemoDuck, Zocdoc,
dd_zocdoc, 0-10.5 s, f0-251 at 24 fps). Six ideas at about 1.75 s each: a giant pencil writes the task ("Booking
appointments"); hands fidget over a cluttered book ("is such a to-do"); two blobs pop into labelled pain icons
("calling", "waiting", about 18 frames apart, blob -> icon in 6); a dot bursts into a yellow mascot badge with
circular rim text ("you need something new", about 8 frames); hard cut to the wordmark on the same yellow; pull back
(about 12 frames): the yellow is the website on a laptop. *Transfers as:* a model for the first 10 s of an SMB SaaS
explainer: one picture and one word per pain; the name's colour bridges to the product.

**M81. Drops fill buckets, overflow into a stream, the flood reveals the logo** (DemoDuck, Surge, dd_surge,
16.60-29.40 s, f498-882 at 30 fps). Three drops land on flat ellipses that rise into buckets (about 30 frames each,
about 35 apart, three blues, decreasing sizes); they slosh, tip and empty (about 60); the water runs down a slope as
a stream with the camera following (about 90), falls as a waterfall and floods the frame; the logo surfaces in the
water (about 15). 12.8 s, no cut. *Transfers as:* a physical metaphor for the brand name told as one continuous
material; small inputs -> a surge.

**M82. The logo is a box: it unfolds, wears a tie, folds shut, holds all the files** (DemoDuck, Dropbox for
Business, dd_dropbox, 59.60-67.60 s, f1788-2028 at 30 fps). In thin blue line art: a folded diamond stands up into a
box and opens its flaps into the logo's shape (about 25 frames); a necktie hangs inside and sways (about 50: "for
Business"); the box folds shut and flattens into a lid (about 25) that lands on a stack of colourful files and lifts
off; the files resolve into one shared page with the logo. 8 s. *Transfers as:* animate a logo that is a usable
object so it explains the product; one prop per idea.

**M83. The problem mosaic: pain points tile in as a wall** (DemoDuck, BEUMER Group, dd_beumer, 18.60-25.40 s,
f446-608 at 24 fps). A smoke puff bursts out of the warehouse scene, covers it and clears (about 30 frames); the
stacked blocks left behind become a grid; six coloured tiles, each with one bold pain phrase ("Associate Retention",
"Space Constraints", "Picking Errors", "Increasing Returns Volumes", "Customer Expectations", "Order Processing
Times"), slide in from the nearest edge 8-10 frames apart (4 frames each) and type their words, until they fill the
frame; hold about 25 frames; slide on. 6.8 s. *Transfers as:* a B2B problem section: many equal pains in one wall,
readable one by one, overwhelming together.

**M84. The house cutaway: cold blue rooms fill with warm yellow, floor by floor** (DemoDuck, Sealed, dd_sealed,
60.20-70.20 s, f1505-1755 at 25 fps). Flat 2D: money shovelled into a furnace (about 15 frames); the camera pulls
back until that room is one cell of a cutaway house, the roof lands, isometric (about 40); cold hold with wind
lines, every room blue (about 70); the blue drains and warm yellow fills the rooms floor by floor from the bottom
(about 20); a round inset magnifies the installed heat pump (about 40). 10 s. *Transfers as:* an invisible benefit
of a space told with two state colours, changing room by room.

**M85. Rows fly into the form, integrations dock, pay, every icon gets a check** (Motion the Agency UI loop, mta_ui,
0-10.6 s, f0-265 at 25 fps). Clean UI on solid violet: an empty mobile payment form holds about 30 frames; four rows
fly in blurred from the right, landing 2-4 frames apart (one per accounting system); white dots grow into four
integration icons docked around the phone (about 12 frames, staggered 2); the cursor clicks Pay, the screen greys, a
white modal builds (about 15) and a check grows ("Payment Successful"); each docked icon then gets a green check, 2
frames apart; seamless loop. *Transfers as:* "connect, act once, done everywhere" told only with the product's own UI;
one click, results spreading outward.

**M86. The UI slides aside, a caption types in the space it leaves** (Foundey, web-design product film, foundey_4,
18.60-24.40 s, f557-731 at 30 fps). A centred product page drifts about 1 px a frame (about 40 frames); it slides
right about 30% of the frame width (about 8 frames); a two-level caption types into the freed column: a large light
headline ("Drive engagement", 2-3 chars a frame) and a smaller grey line ("through targeted and clear messaging", 1
char a frame, the typing word at half opacity); hold about 45; the next screen slides up over the page as the
caption leaves. *Transfers as:* the default feature beat of a clean SaaS film: UI as the picture, a claim + how-line
beside it, the UI never shrunk.

**M87. The window stays, its content sinks out and the next screen rises in** (Foundey, prospecting-tool loop,
foundey_3, 1.40-2.80 s, f42-84 at 30 fps; repeats every 5 s). A white window card with two blank cards stacked
behind never moves; its content sinks about 40% of the card height while fading out (16 frames, peak change at
frame 7, ease in-out), the empty card holds 4 frames, then the next screen rises from 40% below while fading in
(22 frames, peak at frame 11, settle x0.54-0.86); the background field changes colour per screen. *Transfers as:*
the screen change for runs of dense UI (tables, dashboards) in loops and product sections: the card is the anchor,
the blank frames keep two tables from overlapping. Rule: never crossfade two dense screens in place; empty the
container for 3-5 frames between them.

**M88. Search for the pain, push into the favicon, it becomes the brand, then the app** (Motion the Agency, Katana,
mta_katana, 11.0-17.5 s, f330-525 at 30 fps). The problem ends on a click with a 2-frame warm flash over the cut; a
search pill types the viewer's question (about 2 characters a frame); the results page fades up in 3 frames; the
camera pushes about 24 frames into the first result's favicon (transform-origin on the favicon); the cursor clicks
and the favicon's circle fills the frame in about 9 frames; its two letters slide apart into the wordmark in 6;
logo hold 12; a soft navy circle blooms behind the wordmark in 4 frames and is the app's header bar; a 20-frame
pull-back (a whip, peak change 54) out through the app, rows cascading 4-6 frames apart; the claim types over the
blurred app. *Transfers as:* the problem-to-solution turn when the product answers a common search; the logo is a
door between one push in and one pull out. Find the brand mark inside the UI (favicon, app icon, avatar) and grow
it; don't cut to a logo card.

**M89. Send empties the window, a panel sheet wipes in, then a slow push to the input** (Superhuman, Go web header,
sh_go-header, 14.4-16.8 s, f864-1006 at 60 fps). The Send press is held about 30 frames; the content fades out in 6
(the window frame stays); a white sheet wipes in from the window's left edge in about 14 frames; the new panel's
content fades up in about 18; only then a push-in, about 1.6x towards the input box over about 50 frames: ramp
x1.2-1.4 a frame to the peak at frame 12, then decay about x0.9 a frame for 38 (ease-out heavy, bezier .45,0,.1,1);
typing starts about 6 frames after it settles. The gradient field behind never moves. *Transfers as:* a feature
change inside one window, then bring new UI close enough to read. Rule: a push to read starts only once the content
is fully opaque, and spends at least 70% of its length decelerating.

**M90. Dots settle into a chart** (parallel round M21; re-read on every frame: Epipheo, Deloitte ConvergeHEALTH,
ep_deloitte, 4.9-9.9 s, f117-237 at 24 fps). The headline anticipates (a 1-frame flinch to .97, then a 2-frame
swell to 1.1) and is replaced in one frame by about 120 dots (3 greens + charcoal) seeded at its glyphs; they drift
out decaying x0.92 a frame for about 22 frames, then a second push (about 20 frames, rising to change 11) clears the
big dots off the edges; about 12 survivors form a rising diagonal; the axes grow from the corner and the line draws
point to point 4 frames behind, ending on an arrowhead (about 22 frames); hold 16. *Transfers as:* "noise to
signal": the dots must become the chart, never a placed chart with dots fading out. A long drift needs two humps.

**M91. Circle becomes part of the object** (parallel round M21, Epipheo, ep_11, 15.0 s). A circle holds; copies
slide in to make a row of three; the camera pulls back and tilts (about 19 drawings, ramp x1.55) and the circles are a
ship's portholes; it ends on the ship as a flat icon. Colour and alignment never break. *Transfers as:* "so that's
what it is": start on a simple shape that is a component of the object and reveal the object around it.

**M92. Symmetric shape bloom** (parallel round M21, Epipheo for Chargebee, ep_3, 36.2 s, 25 fps). A dot becomes a
hexagon; rings of geometric shapes burst out, mirrored on two axes, each ring 2-3 drawings after the one inside it
(about 30 drawings, broad peak), swap shapes and colours (3 colours on a dark ground) at the peak and settle into a
calm system in about 12. *Transfers as:* "a platform at the centre of everything", or a section opener.

**M93. Wall of pages pans to the editor** (parallel round M22, re-read on every frame: Epipheo, Shogun, ep_shogun,
42.0-50.0 s, f1008-1200 at 24 fps). Storefront pages hang on the inside of a curved wall; one page swings in and the
camera settles (about 36 frames, x0.87-0.9), holds 4, then pans: the speed ramps linearly (+0.5-0.7 change every
frame) for about 28 frames, cruises about 70 frames with blur (12-14 pages pass), accelerates again for about 10 and
whips down in 4 to the editor rising from below, the cursor already in frame; settle about 20 (x0.9); the cursor
drops a section onto the canvas. *Transfers as:* "look how much people build with it", then the tool. Drive a long
pan by its speed (ramp, cruise, second ramp), not by an ease-in-out on position.

**M94. The wordmark flies in from 10x, its own 'o' is the ring** (parallel round M22 read it as an iris closing; the
every-frame read corrects it: Epipheo, Shogun, ep_shogun, 19.0-22.0 s, f456-528 at 24 fps). Over a busy swirl, in
one frame a huge dark 'o' fills the frame edges (the wordmark at about 10x, the swirl seen through its counter); the
word shrinks to size in about 8 frames (peak change 88 on frame 3), the background changes to a flat lilac confetti
field under the fastest frames, then a long settle (x0.72 then about x0.9 for about 40 frames) with the wordmark
still and the confetti drifting. *Transfers as:* a name reveal for a wordmark with a strong round letter;
interpolate the log of the scale so 10x -> 1x reads as constant speed.

Scope note (parallel round M21, Karl's direction): character and illustration techniques (M57, M58, M74, M35, rule
26) are kept only for films that ask for illustration; the default is 2D motion design: UI, shapes, icons, type, charts.

**M95. Search bar grows into the results** (parallel round M23, Dropbox product-site UI loop, 60 fps file). A lone
search bar; a results panel slides out from under it and the card grows (the bar riding up as the header) into the
full results window in about 0.5 s (ease-in-out hump); grey skeleton tiles for about 0.3 s, then the real thumbnails.
*Transfers as:* "ask and you get it": the input never leaves, it becomes the window's header.

**M96. Menu pops from the click** (parallel round M23, Dropbox). On the click frame the share dialog scales out of
the button's position (transform-origin on the control, about 0.85 -> 1, opacity 0 -> 1) in 1 drawing while the page
dims about 25%; the rows settle over about 10 drawings with a 1-frame stagger; the cursor holds still through the
pop. *Transfers as:* "one click": UI that feels instant but still reads as animation.

**M97. Slide flip, cut on the beat** (parallel round M23, Pitch). Nine generated slides as hard cuts about every 3
drawings (1.8 s) inside one fixed slide frame, with the cursor fixed in the same spot; nothing animates within a
slide. *Transfers as:* "it made all of this": the speed is the message, the fixed frame and cursor keep it readable.

**M98. Panel slides in, the layout reflows** (parallel round M24, Slack product-site loop). On the click the
sidebar narrows to icons, the main view slides left and shrinks, and a new panel slides in from the right edge, all
on one ease-in-out of about 0.8 s; the panel arrives as a colour block and its content fades in 2-4 drawings later.
*Transfers as:* animate the whole layout, not just the newcomer: the new panel pushes its space open.

**M99. An agent sorts the board** (parallel round M24, monday.com). Under an AI-agent label card ("Risk Analyzer,
updating and sorting priority") the board's rows reorder by FLIP tweens on one ease-in-out of about 0.7 s, 0-1 frame
stagger, status and priority cells flipping colour as rows pass; on twos. *Transfers as:* "the AI does the triage":
the agent card is the cause, the reorder the effect.

**M100. Whip between app windows** (parallel round M24, Zapier). Windows sit side by side on a long strip; the strip
whips (about 0.6 s: blur ramps about 6 drawings, peak, about 8 drawings of ease-out landing), the background moving at
about half speed for parallax; the next window lands sharp. *Transfers as:* one move links two steps of a workflow.

## Rules for the skill (measured)

1. **Turn shape:** scene turns accelerate into the cut (×1.15–1.5 per frame over 4–6 frames) and settle in
   1–8 frames after it. A fade or a symmetric ease-in-out between scenes is the exception, and needs a reason.
2. **Turn frequency by register** (`scripts/punch_check.py`; per register: ads, launches and product clips about every
   2-2.5 s, none over 5 s (8 s at most in a launch); feature explainers with chapters about every 4-5 s (Walkway 4.3 s);
   one-stage explainers no turns but a new caption or UI state every 3-8 s (Buildbox). Earlier measurement: explainers and ads make a big change about every 2 s (median
   gap 1.8–2.3 s; showreels 0.5 s) and never go more than about 5 s without one. Hero loops (one continuous UI
   stage: mercury, ramp, mta_ui) and one-stage explainers (Buildbox: 1 big turn in 64 s, a new caption every 3-8 s)
   don't turn at all and are a separate register. WKC v3 had a median of 2.0 s
   but a 7.0 s stretch (3.8–10.8 s) of local changes on one held stage: the build section that felt flattest.
3. **Blur on the peak frames only:** three or four frames around the fastest point; before and after are sharp.
4. **Arrive moving:** the incoming shot's first frame is part-way through its animation (M1, M2, M7).
5. **Anchor through a turn:** keep one object — a pill, a word, a logo — in place or carried, and change the
   world around it (M4, M5).
6. **The read thing is the constant across a cut:** a title, word or logo the viewer is reading keeps its
   place and size through the cut; it may land on the outgoing scene's last frame (M8).
7. **Colour before layout:** a scene can announce its end by changing colour (a wash in the next shot's colour)
   1-2 frames before anything moves; the cut then only changes layout (M9).
8. **Write-ons are bursts:** a wordmark or short title written letter by letter runs at 1 letter per drawn frame
   (24 fps), each letter springing in over 2-3 frames, centred as it grows; nothing reads as typing at 3+ frames a
   letter unless typing is the idea (M10).
9. **Hand over on the landing frame, inside one idea:** within one beat (a mark landing and its wordmark, a
   screen landing and its content), the next event starts on the landing frame or within 3-5 frames; holds go
   at the end of a sequence (M10, M11, rule 13). Between two ideas, breathe (rule 14).
10. **Strip before you move:** an element that travels through a transition drops its secondary detail (status
    lines, sub-labels) before it moves, so only one simple thing is tracked (M4).
11. **Carry the camera's direction across a cut:** after a pull-back the next shot's first element shrinks into
    place; after a push-in it grows (M3, M11). Settle camera-like moves on a geometric decay (each frame about
    0.7-0.76x the last at 30 fps, `1 - 0.74^t`), not a spring.
12. **Animate the phrase, not the paragraph:** in a long on-screen sentence only the key phrase gets an entrance
    animation (typing, colour, a different face); the rest appears whole. One animated phrase per sentence (M12).
13. **Hand the motion on** (local technique): when a move lands, its own consequence (the landed screen's content, a
   cursor press) starts 3–5 drawn frames later. Inside one beat only (see rule 14).
14. **Breathe between moves** (rule, measured with `scripts/relay_check.py`): between one idea's move and the next,
   the references hold the result for 8–14 drawn frames of low drift (median gap; tm_1 14, Sully 12, Bleap 11,
   AutoHDR 10, Walkway 9, Equilibrium 8). WKC v3 measured 3 (74% tight relays): it never breathed and read busy.
   Target for explainers: median gap 8–14 drawn frames, relays under 50%; dense relay registers (Retool-style
   product loops) are the exception and must be chosen.
15. **End cards keep moving** (rule, measured): the lockup holds its place; tracking, a palette strobe, particles or
   a loop keep moving to the last frame. `scripts/motion_check.py` now reports the end card separately (0.2 s
   windows at 320×180, so slow tracking counts): target longest still ≤ 0.5 s. Before this, the probe skipped the
   last 2 s entirely.
16. **Foreground wipes hide the change** (rule; confirmed on every frame in 1 film, M15; M29 turned out to be a hard cut with a foreground layer before it): a layer passing close to the lens covers the frame for 1–2
   frames at peak speed and the scene changes under it, with the camera still moving. Pair with a fixed anchor for
   "same product, new world".
   Re-checked on the local downloads with `relay_check.py`: tm_4 median gap 8 drawn frames, obin_4 10,
   mta_sully 11 (relays 50%, 24%, 27%).
17. **Anticipate the big move:** before a dive, whip or reveal, a small opposite move (about 10% for 2 frames)
    and a short pause (5-7 frames) make the main move read stronger (M31).
18. **Render and deliver at one frame rate** (parallel round M8): frame-rate conversions make smooth moves judder:
    dropped frames every 3-5 frames (Buck, Framer, Sully web files), 24 -> 30 pulldown (one repeat every 5).
    `scripts/jitter_check.py` names them (JUDDER, PULLDOWN) and judges films on twos per drawing instead of
    flagging held drawings as shake.
19. **Smooth landings need their own layer** (parallel round M9, measured in Remotion): every ease-out ends slow, and
    slow text in Chrome snaps to whole pixels unless it is on a compositing layer. The kit's `Line` landed 15, 9, 5,
    4, 2, 1, 0, 1, then dead; with `willChange: transform` while moving it decays to 0.19, and dropping the layer at
    rest keeps the text crisp (sharpness 162 vs 128 always-layered). Patched in `scripts/kinetic.tsx` and
    `scripts/maps.tsx`; `production/build-gotchas.md`.
20. **Supersample the final render for sharp type** (parallel round M10, measured in Remotion): the kit's breathe
    camera is the smoothest of four set-ups (path roughness 0.02 px) but draws small text at about half the
    sharpness of plain text (1027 vs 2220); rendering at `--scale 2` and area-downscaling keeps the smoothness and
    gives 1647, at about 1.4x the render time. See `production/remotion.md`.
21. **Score product films; reels run free** (parallel round M11, measured with `scripts/av_sync.py`, now with a beat
    grid that found WKC v3's tempo to 0.5 bpm): product films score their hits with effects (Framer x1.36, WKC
    x1.89) and cut on the beat (33% and 32% of hits within a frame of a beat, against 17% and 14% by chance). The
    studio reels (Tendril, Oddfellows) do neither: a music bed under picture that runs free. For SaaS explainers:
    score.
22. **State changes switch, they don't fade** (M38, M41, M23): a SaaS state change (connected, generated, active)
    is a one-frame switch of colour or form at a visible cause (a line arriving, a press, a glint edge); a slow
    fade has no cause and reads as loading.
23. **Phrase by phrase, calibrated** (parallel round M14, measured on narrated professional explainers with
    `scripts/vo_words.py` and `scripts/phrase_check.py`): voices run at 2.4-2.5 words a second, matching the skill's
    planning pace. The picture brings something new on 41 of 41 phrases (Eyz) and 59 of 60 (Lithium Valley), never
    more than 0.8 s of voice without a new visual. "New" includes one small element (an icon added to a diagram),
    which `phrase_check` now detects.
24. **Explainer rhythm is phrase rhythm, not scene turns** (parallel round M16, measured on 7 narrated SaaS
    explainers; scopes rule 2): voices run 2.4-2.9 words a second (median 2.5); the picture brings a new visual on
    232 of 239 phrases (97%), the longest gap under 2.5 s in 6 of 7 films; but big scene turns are rare (median gap
    2.6-14 s; CampusNexus runs 63 s on one ever-changing stage). Judge narrated explainers with `phrase_check`, not
    turn frequency. `scripts/qc.sh` takes REGISTER=ad|explainer (default explainer).
25. **SaaS explainer structure** (parallel round M18, measured on 7 DemoDuck SaaS explainers from their
    voice-overs): open in the viewer's world (a "you" or a named persona), never on the product; name the product at
    about a fifth of the runtime (median 22%, 11-25 s in 66-95 s films); tell features as consequences for a person,
    often persona by persona; one proof number at most, late; close in the last 4-9 s (median 5.5 s) with a callback
    to the opening line and the name or URL. Story-led and very short spots name the product later (38-52%). See
    `references/explainer-structures.md`.
26. **Held poses still live** (parallel round M19, measured on DemoDuck's Prisidio): in a hold, the drawing boils,
    redrawn every 3 frames with outlines shifting about a pixel, and the face micro-acts on the same rhythm, while
    the silhouette stays put (re-read locally on every frame, f250-300: boil frames every 2-4 frames, change 0.5-3.2 vs about 0.2 on hold frames). Kit `scripts/boil.tsx` (SVG turbulence, seed stepped every 3 frames). Use on
    characters and hand-drawn icons in every hold over about 0.5 s; not on UI or type.
27. **On-screen words lead the voice by about 4 frames** (parallel round M20, measured on Newsela's type, median 0.15
    s ahead; matches the skill's "lands 3-6 frames before the word" and S1's sound-first finding).
28. **UI loops: fast in, slow settle** (parallel round M23, measured on Dropbox's product loops; matches M89 and
    M96): a UI response appears on the click frame (1 drawing) and spends 8-12 drawings settling; the cause (the
    click, the query) holds still while the effect moves.
