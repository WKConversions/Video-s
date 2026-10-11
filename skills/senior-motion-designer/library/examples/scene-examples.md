# Scene examples

Fully specified scenes in the production format (`production/output-format.md`) for a fictional
appointment-booking app for clinics, in Minimal User Interface Style. They show the level of detail
expected; never reuse them.

## Scene 04: fifteen hours back

SCENE NUMBER: 04
TIMECODE: 00:14.2–00:18.0
VOICEOVER: "Clinics get fifteen hours a week back."
PURPOSE: Proof of the main benefit (Number/data, importance 1).
CORE MESSAGE: The saved time is large and concrete.
VISUAL STRATEGY: Scale comparison + counter.
VISUAL CONCEPT: A week of receptionist phone time, drawn as 18 hour-blocks on a timeline, collapses
to 3 as the booking flow takes over; the freed 15 blocks slide aside and fuse into one large "15 h".
COMPOSITION: Left-aligned timeline across the lower third; the number grows on the right third,
offset, with negative space above it.
PRIMARY ELEMENT: The "15 h" number (about 220 px tall at 1080p).
SECONDARY ELEMENTS: The shrinking timeline; a small "per week" label (36 px).
BACKGROUND: Near-white canvas, one pale halo circle behind the number.
TYPOGRAPHY: Inter Tight 800, number in the accent, label in blue-grey.
COLORS: Ink, accent for the number and the freed blocks, pale accent tint for the remaining blocks.
MATERIALS: Shapes, typography, one product icon.
EXTERNAL ASSET REQUIREMENT: None.
MOTION: Cause → the booking flow icon slides along the timeline → blocks it passes turn from grey to
accent and detach → they fuse into the number.
EASING: Detach on depart curve; fuse on arrive curve `cubic-bezier(.22,1,.36,1)`.
CAMERA: Slow push from wide to medium (4% over the scene), drifting right toward the number.
ENTRANCE: The timeline continues from the previous scene's calendar edge (layout transformation).
IN-SCENE ANIMATION: Blocks detach in a 2-frame stagger; the counter runs 0→15 in 18 frames landing on
"fifteen"; the halo breathes once.
EXIT: The number pushes toward camera and becomes the background color field of scene 05
(scale-through).
TRANSITION TO NEXT SCENE: Scale-through the "1" of "15".
SOUND DESIGN OPPORTUNITY: Soft ticks as blocks detach; one low impact when the number lands.
WHY THIS VISUAL WORKS: The viewer sees the time leave the week and become one big, readable number;
the claim is felt, not read.

## Scene 07: the patient stops waiting

SCENE NUMBER: 07
TIMECODE: 00:26.0–00:29.4
VOICEOVER: "Patients book in seconds, not on hold."
PURPOSE: Human benefit (Emotional statement + Product demonstration, importance 2).
CORE MESSAGE: Booking is instant for the patient.
VISUAL STRATEGY: UI + real-world imagery.
VISUAL CONCEPT: A photo cut-out of a patient on a sofa, phone in hand; the booking confirmation card
flies out of the phone into the room, tilted in depth, and settles next to her.
COMPOSITION: Patient on the left third, cut-out on the canvas; card on the right at readable size.
PRIMARY ELEMENT: The confirmation card ("Tue 09:30 · Booked", 48 px).
SECONDARY ELEMENTS: The patient, relaxed; a small check mark.
BACKGROUND: Near-white canvas with a soft floor shadow under the cut-out (no photo background, per
the style).
TYPOGRAPHY: Card title Inter Tight 700 48 px; time in the accent.
COLORS: Ink, accent, the photo's natural tones kept warm.
MATERIALS: Photo cut-out, rebuilt UI card, typography.
EXTERNAL ASSET REQUIREMENT: S07-A (below).
MOTION: Cause → her thumb taps → the phone screen flashes → the card launches out of the screen.
EASING: Launch on ease-in for 3 frames, then arrive curve over 9 frames with motion blur.
CAMERA: Slight push toward the card; parallax between cut-out and card to show depth.
ENTRANCE: Scene 06's hold-music waveform flattens into the phone's edge (object becomes object).
IN-SCENE ANIMATION: Card settles, check mark draws on "seconds", her head turns slightly toward it.
EXIT: The card slides left and becomes the first row of the clinic's calendar in scene 08.
TRANSITION TO NEXT SCENE: Layout transformation.
SOUND DESIGN OPPORTUNITY: The hold music from scene 06 cuts to silence on the tap; one soft
confirmation tone.
WHY THIS VISUAL WORKS: A real person makes the benefit felt; the card makes it concrete and readable.

ASSET ID: S07-A
ASSET TYPE: Photo cut-out
SOURCE PREFERENCE: licensed stock
SEARCH QUERY: woman relaxed on sofa using smartphone smiling bright living room
SUBJECT: Adult patient at home
ACTION: Tapping her phone, relaxed
COMPOSITION: Full body or three-quarter, clean edges for cut-out
SUBJECT POSITION: Left third
LIGHTING: Soft daylight
MOOD: Relieved, calm
COLOR CHARACTERISTICS: Warm neutrals, no saturated clothing clashing with the accent
CAMERA ANGLE: Eye level
ASPECT RATIO: Any, at least 2000 px tall
CROP REQUIREMENTS: Must survive a 9:16 crop around her
LICENSE: commercial use required; not presented as a real customer
WHY THIS ASSET IS NEEDED: Gives the booking speed a human, emotional context.
FALLBACK IF NOT FOUND: Only the phone, held by a simple hand illustration, launches the card.
