# Corrections

Karl's corrections, kept so the skill learns his recurring preferences. Read the lessons before
planning; read the entries of the categories you are working on when a decision is close.

## Recurring lessons (summary)

- Show what a line means so it reads in a second; vague metaphors get cut.
- Give every beat its own idea; one example can run through a film, one device can't answer every
  line.
- Constant, purposeful motion: nothing static, nothing useless; the camera never locks.
- Reach the motion norm with motion that means something: content that streams, piles up or plays. Drift added
  to keep the frame moving, text sliding left and right, reads as useless (VoxFlow).
- Smooth before everything: the camera only breathes, nothing lurches, nothing pops past its size in a clean
  film, nothing flies around; liveliness comes from the content, never from camera moves (K.B, approved).
- Clear before busy: one thing to watch at a time; when the eye can't tell what to look at, take things away.
- No tunnel vision in motion: choose the speed graph for the moment from the approved vocabulary
  (`motion/speed-graphs.md`); transitions are speed-matched, with the cut on the fastest frame.
- Every phrase gets its own visual, on one continuous stage: never a page that holds while the voice
  explains it, never a presentation; think outside the box for the visuals and the transitions.
- References are examples of a look or a technique, never layouts to reproduce.
- The client's weak material (their own hero video, for K.B) is not a reference.
- Everything must read where the film plays: big subject, readable sizes, text never colliding.
- You decide each film's direction from the case, never from a style the client picked; it must visibly
  set the look (over any brand's site look, WKConversions' too), and it is direction, never a template.
- Show the motion, not just the numbers: every draft and final goes to Karl with its movement graph.
- Think like an art director, not a prompt generator: meaning, strongest idea, the film as a whole.
- Use the client's own material at its best: no cheap stand-ins (silhouettes, cut-out puppets, doodles) for what
  the client's art can show; and nothing that suggests a business the client isn't in (Tale Forge, approved).
- Show only the product's real interface and copy; never a feature it doesn't have.
- When Karl is waiting for a revision, go straight to the video: build the fix, render, send; no planning panels
  or extra passes he didn't ask for, and honest time estimates.
- Apple style, as Karl means it: the background calm and still, all motion in the foreground (heavy springs,
  morphs, Apple transitions), never a still frame, a new visual every 0.5–0.8 s, 60 fps, sound-effect dominant
  over a quiet music bed (louder bed only when there is no voice-over).
- The client's own brand, always: harvested from their site, never another client's look.
- A film that replaces a client's old video shares nothing with it: list what the old one did as EXCLUDED first.
- Realistic frames are motion design too: a speed-ramped virtual camera, zoom-through joints, UI breaking out of
  the screen (`production/realism.md`); real footage under a linear drift reads as stock, not design.
- Say the generation time when a job starts; when Karl asks for a quick preview, send one first (minutes, not hours).
- Calm camera: few reframes (one per sentence at most), each 1.2–2 s on a soft ease from rest to rest, no spring or
  overshoot on the camera, zoom within ±12%; the springs live on the objects (Creoble v5).
- Centre everything: the camera zooms about the frame centre only, never pans; two things sharing the frame are
  centred as a group.
- Reach a motion target with motion that explains: the client's product (their website, their app) as the one hero
  object, always doing something; never decorative wobble; never scroll a page up and down.
- Shadows Apple-style: layered, no offset, even on all sides, generous; a static dither against banding.

## Adding a correction

When Karl gives concrete feedback on a result:
1. identify the reusable principle behind it,
2. separate a project-specific preference from a general one,
3. add an entry below in the right category, and update the summary if it's a new recurring lesson,
4. fix the module the lesson belongs to, so the rule lives in one place (this file records the
   history; the modules hold the rules),
5. never generalize a one-off preference to all work.

Keep what worked too: when Karl approves a solution, add it to `examples/bad-vs-good.md`.

Don't change the library on your own during a video job: propose the entry and the module change to
Karl, and update the library when he agrees.

Template:
```
CATEGORY:
DATE / PROJECT:
ORIGINAL IDEA:
WHY IT WAS WEAK:
USER CORRECTION:
FINAL APPROACH:
GENERAL LESSON:
```

## Visual metaphor corrections

CATEGORY: Visual metaphor
DATE / PROJECT: September 2026, WKConversions 30-second ad
ORIGINAL IDEA: Abstract devices: a line snaking through a paragraph, a route drawn between two people,
a chart bar turning into a line.
WHY IT WAS WEAK: Viewers had to decode them in the one or two seconds each shot is seen.
USER CORRECTION: "No metaphors or vague visualizations which some don't understand."
FINAL APPROACH: Each shot showed what the voice-over meant: the highlight landing on the phrase, the
video splitting into formats, the founders in a chat.
GENERAL LESSON: Literal meaning first; metaphors only when grounded and readable in a second.

## Composition corrections

CATEGORY: Composition / visual strategy
DATE / PROJECT: September 2026, WKConversions ad, first cut
ORIGINAL IDEA: One invoice example and one line motif carried most of the film.
WHY IT WAS WEAK: One device answering every line made the film a single trick.
USER CORRECTION: Asked for other animation concepts besides the invoice.
FINAL APPROACH: A different device per beat, connected by the visual system and the transitions.
GENERAL LESSON: Give each beat its own idea.

CATEGORY: Composition
DATE / PROJECT: September 2026, first intake-form videos (WKConversions, K.B)
ORIGINAL IDEA: A centered headline over a centered object in every WKConversions scene; K.B's screens
shown whole, one wide card after another.
WHY IT WAS WEAK: One framing and one structure for the whole film; subjects too small to read.
USER CORRECTION: From the review against Karl's benchmark film: vary framing, push in on the subject.
FINAL APPROACH: The variety budget and readable sizes (`design/composition.md`,
`design/visual-hierarchy.md`).
GENERAL LESSON: Consistent language, varied structure; the subject is the largest thing on screen.

## Animation corrections

CATEGORY: Animation
DATE / PROJECT: October 2026, training (Karl's Training.aep and the speed-graph sheets)
ORIGINAL IDEA: Three curves (ARRIVE, MOVE, DEPART) for nearly every move in every film.
WHY IT WAS WEAK: Every film moved the same way, whatever the moment; Karl called it tunnel vision.
USER CORRECTION: He sent an After Effects file with named compositions (transitions, a pop, three text
animations) "for inspiration and direction, not to take literally", and asked for speed graphs with the moments
each suits, to approve. He approved all 24 ("love them").
FINAL APPROACH: `motion/speed-graphs.md` (A1–A7 read from his file, B1–B17 beyond it), the sheets in
`motion/speed-graphs/`, every curve built into the kit (`EASE`, `whip`, `popElastic`, `bounce`, `speedRamp`,
`stepper`, `flick`, `zoomThrough`), and `scripts/ae_read.py` for the next files he sends.
GENERAL LESSON: Pick the speed graph for the moment and the film's vibe. In his transitions the speed builds into
the cut, the shape changes on the fastest frame and the next move starts at that speed: exits accelerate,
arrivals decelerate.

CATEGORY: Animation
DATE / PROJECT: September 2026, WKConversions ad
ORIGINAL IDEA: Scenes settled and held still between beats.
WHY IT WAS WEAK: A frozen frame reads as dead air in a short ad.
USER CORRECTION: More constant motion, "nothing static but no useless movement".
FINAL APPROACH: Working holds: the interface keeps working and the camera keeps moving.
GENERAL LESSON: Something purposeful always moves.

CATEGORY: Animation
DATE / PROJECT: September 2026, intake videos vs the "sends" benchmark
ORIGINAL IDEA: A locked camera, fades and short slides in place, one element at a time, no motion
blur.
WHY IT WAS WEAK: Measured against the benchmark, only 65–87% of frames moved and a typical frame had
0.2–0.4% of its area in motion (benchmark: 97% and 3.2%); it felt stiff.
USER CORRECTION: Karl likes "how smooth it is and constant good motion"; "if you look frame by frame
you don't see the animations".
FINAL APPROACH: The motion craft: moving camera, motion blur, arrivals from outside the frame,
overlapping waves (`references/benchmarks.md`).
GENERAL LESSON: Smoothness comes from craft, not frame rate; measure motion, not just stills.

CATEGORY: Animation
DATE / PROJECT: October 2026, the 25 reference films against Bruno v3, MindMirror, Amargier and Zapify
ORIGINAL IDEA: Something moves in 98–99% of frames, but a typical frame changed only 1.8–2.3% of its
area: one small thing drifting while the rest held.
WHY IT WAS WEAK: Karl's reference films measure a median of 3.5%: they keep several layers moving at once
(blooms, orbiting icons, screens turning on tilted planes) and their arrivals travel further.
USER CORRECTION: Karl: raise the motion target to 3%.
FINAL APPROACH: The default target is 3% (calm briefs 2%, energetic 4%) in `motion_check.py`,
`evaluation/quality-check.md` and `motion/timing.md`; the techniques are in `references/technique-catalogue.md`.
GENERAL LESSON: Measure how much of the frame moves, not only whether something does. (Superseded by the
K.B entries below: the 3% was reached with camera moves, and those read as spikes.)

CATEGORY: Animation / camera
DATE / PROJECT: October 2026, K.B website film, v2 → v3 (v3 approved; the client: "great, for the first time")
ORIGINAL IDEA: To reach 3% of the frame in motion, the camera pushed and released on every beat, leaned towards
points, swayed ±38 px, and scenes zoomed while their cards popped with an overshoot.
WHY IT WAS WEAK: Karl: "around second 10 the animation isn't smooth and out of nowhere starts going right, like a
spike"; "second 6 on 7 the frame spikes out of nowhere"; "20 to 22 not smooth, too fast and spiky". Measured: the
camera at 176–564 px/s and 15–19%/s on those transitions (a linear segment starting at full speed, a 5% zoom
released in 0.6 s, a 16% scene zoom) and 106 overshoot pops.
USER CORRECTION: Smooth, clean transitions; "keep it clean".
FINAL APPROACH: One slow camera breath for the whole film (under 25 px/s and 5.3%/s), no pans or zoom releases on
transitions, every pop replaced by a smooth ease-out, the scene zoom cut to 5% over 2.6 s, the orbit and feed slowed
to a third. `scripts/motion_probe.py` now finds all of v2's spikes and none in v3.
GENERAL LESSON: Spikes come from the camera and from overshoot; a calm, clean film moves its content, not its
camera, and lands everything without bounce. Measure the motion curves on every build.

CATEGORY: Animation / sign-off
DATE / PROJECT: October 2026, K.B website film, v1 → v3
ORIGINAL IDEA: Tool tiles orbiting the logo at the close; then system lines, travelling pulses, a cursor and a
camera push under the sign-off.
WHY IT WAS WEAK: Karl: "the outro is just flying over the screen, that's not clean"; "still the outro is flying
around too much. Just animate the logo and text coming in but don't make it go all over the place."
USER CORRECTION: The logo and the text coming in, nothing else.
FINAL APPROACH: The badge rises in with a fade, the lines build word by word, the button rises in; one slow push.
GENERAL LESSON: The sign-off is the calmest moment of the film: the logo and the words arrive, and nothing else
moves across the screen.

CATEGORY: Animation / density
DATE / PROJECT: October 2026, K.B website film, after v3
ORIGINAL IDEA: Several layers moving at once in most beats (3D-tilted planes, orbiting chips, a feed, a version
dial, a rotating ring) to keep the frame alive.
WHY IT WAS WEAK: Karl: "It's a bit too busy so you can't see what's happening. It is better than first though."
USER CORRECTION: Find the pacing, the frame quantity and the visual that make each line clear.
FINAL APPROACH: The probe's BUSY measure (separate motions at once); v3's busiest moment (the improvement loop,
six motions) is the one to calm.
GENERAL LESSON: One thing to watch at a time; secondary motion only where it doesn't compete with the line.

CATEGORY: Animation / reporting
DATE / PROJECT: October 2026, skill update
ORIGINAL IDEA: The motion numbers reached Karl as three figures and a per-second text profile.
WHY IT WAS WEAK: He couldn't see how much animation and movement there was through the film, or where.
USER CORRECTION: "Make me a graph with animation/movement through the whole video so I can see how much
animation/movement there was."
FINAL APPROACH: `scripts/motion_graph.py`: how much of the picture moves and how fast, under a filmstrip,
with the holds, phrases and beats marked; drawn by `qc.sh` and sent with every draft and final
(`evaluation/quality-check.md`, `production/output-format.md`).
GENERAL LESSON: Show the motion, not just the numbers.

CATEGORY: Animation / motion density
DATE / PROJECT: October 2026, VoxFlow film
ORIGINAL IDEA: "Working holds": layers and the headline drifted 1–2.6 px a frame to keep the frame moving.
WHY IT WAS WEAK: Karl: "no useless animations, for example the text obviously moving left and right".
USER CORRECTION: "no useless animations, for example the text obviously moving left and right"; "I want the 4%
norm".
FINAL APPROACH: Nothing drifts, and nothing with text on it slides across the frame. Arrivals land in place on
their word; whips move both scenes on one curve. The motion comes from the content: streams of calls,
notifications and appointments piling up, live waveforms, a clock rolling through the night, footage of the
practice and the caller; and one ramped camera push per shot, released only under full-frame changes. The median
reached 4.1% of the frame in motion.
GENERAL LESSON: Reach the motion norm with motion that means something; decorative drift reads as useless.

## Style corrections

CATEGORY: Style
DATE / PROJECT: September 2026, intake-form styles
ORIGINAL IDEA: Using the style reference images as templates.
WHY IT WAS WEAK: Every film would share the references' alignments and visuals.
USER CORRECTION: "Don't literally take over the reference images, it's a reference, an example. I
don't want to see the exact same alignments and visuals. It has to suit the case and script."
FINAL APPROACH: Styles define the look only; the case decides layouts; a copy check before the
storyboard goes out.
GENERAL LESSON: References are for principles and language, never for layouts.

CATEGORY: Style
DATE / PROJECT: September 2026, WKConversions intake video (Minimal Single Visual Style chosen)
ORIGINAL IDEA: The WKConversions site look (dot grid, white cards) instead of the chosen style.
WHY IT WAS WEAK: The client's chosen style didn't show.
USER CORRECTION: From the review: the style must set the look.
FINAL APPROACH: The style outranks any brand's site look; the brand supplies color, fonts, logo,
wording (`styles/README.md`).
GENERAL LESSON: The chosen style wins on the look, for WKConversions too. (Since October 2026 the
direction is decided by the skill, not picked by the client; the lesson holds for the direction it decides.)

CATEGORY: Style
DATE / PROJECT: October 2026, the intake form without a style question
ORIGINAL IDEA: The client picked one of three styles on the form; the skill mapped the answer, asked
for it when it was missing, and treated the style's definition as fixed values.
WHY IT WAS WEAK: The form no longer offers the styles, and a style applied as a spec makes every film in
it look like one template.
USER CORRECTION: "Remove the mandatory giving of one of the 3 styles… when you receive a task to make the
video, identify the style and direction of the video and decide yourself. Never take the style literal,
it is for your direction."
FINAL APPROACH: The skill decides the direction and tone after the harvest, from the business, the video
type, the core message and the brand (`styles/README.md`); the three styles are directions to start from,
adapted to the brand and the case, with a new direction when none fits; the decision and its reason go
into the project direction, where Karl can redirect it at the storyboard (`planning/intake.md`).
GENERAL LESSON: The look is an art-direction decision made for each case; a style is direction, never a
template.


CATEGORY: Style
DATE / PROJECT: October 2026, Tale Forge brand film v2
ORIGINAL IDEA: The child's day drawn in crayon over the client's paintings: a crayon house and moon, stick-figure
children, a tangle that unwinds into a gold thread, question marks, the hero drawn in gold line before she is
painted, a crayon ring and doodle speech bubbles in the conversation, crayon sounds.
WHY IT WAS WEAK: Tale Forge makes personalised picture books; the doodles made it look like a drawing app.
USER CORRECTION: "No drawings, the business isnt a drawing story business."
FINAL APPROACH: Only the client's paintings, light, depth and paper: the opening page at dusk with a cool shadow
and a warm light, the blank book rising and opening, today's moment painted onto its page and turned over, the
hero and her world blooming in, a rack focus on the first page, the book closing and opening again, "The End"
lifting off as gold motes in the conversation (`production/remotion.md`, storybook films). Sample pages whose focus
was the children drawing were left out too.
GENERAL LESSON: The look must not suggest an activity the business isn't about; decorate with the client's own
medium, never with a new one.

## Asset-selection corrections

CATEGORY: Asset selection
DATE / PROJECT: September 2026, K.B intake video
ORIGINAL IDEA: Looking at the client's hero video for direction.
WHY IT WAS WEAK: Karl judged that video weak.
USER CORRECTION: "Don't take an example of the website his video. That video is not so good."
FINAL APPROACH: Only the brand basics (colors, Montserrat, the K.B logotype) came from the site.
GENERAL LESSON: Harvest a client's brand, not their existing motion work, unless Karl says it's good.


CATEGORY: Asset selection
DATE / PROJECT: October 2026, Tale Forge brand film v1
ORIGINAL IDEA: The real world (a child coming home, a parent at the bedside) built as a shadow theatre: silhouettes
of a child and a mother cut from the client's art, moving over a night room, next to the client's watercolour book.
WHY IT WAS WEAK: Home-made silhouettes and cut-out figures beside professional paintings read as low quality, and
puppet motion (a cut-out walking or hopping) looks cheap however smooth it is.
USER CORRECTION: "The animations with like the shadow and the kid + mom is very low quality and bad."
FINAL APPROACH: v2 told everything with the client's own paintings (the sample book's pages, the hero portrait, the
cover, the adventure cards) moved by light, depth and page turns.
GENERAL LESSON: Don't build stand-in characters next to a client's art; find the moment in their own material, and
when it isn't there, tell it with light and objects rather than puppets.

## Typography corrections

CATEGORY: Typography
DATE / PROJECT: September 2026, WKConversions intake video
ORIGINAL IDEA: Headline words swapping in one slot without a shared mask.
WHY IT WAS WEAK: "strategy." and "creative." overlapped for five frames; "We bring it" ran into "the
idea."
USER CORRECTION: From the review.
FINAL APPROACH: Two lines of type never overlap; every text change checked frame by frame.
GENERAL LESSON: Check text transitions at 2-frame steps before the full render.

## UI corrections

CATEGORY: UI
DATE / PROJECT: September 2026, K.B intake video
ORIGINAL IDEA: Whole interfaces at real size, 16–22 px text on a 1080p frame.
WHY IT WAS WEAK: Unreadable in a website section or on a phone.
USER CORRECTION: From the review; confirmed by the benchmark, which shows UI at about twice real size.
FINAL APPROACH: Readable sizes and push-ins (`design/visual-hierarchy.md`).
GENERAL LESSON: Show the part the line names, big.

## Transition corrections

CATEGORY: Transition / visual density
DATE / PROJECT: October 2026, Bruno Morgante film v2
ORIGINAL IDEA: Nine beats, each a designed page (a photo and type, or cards), joined by a camera push
and a soft dissolve; one storyboard frame per beat.
WHY IT WAS WEAK: Each page held while the voice explained it; measured afterwards, 8 of 29 phrases
brought nothing new and 3.4 s of voice played over a held page.
USER CORRECTION: "The vibe of the video and storyboard is like a presentation. We want real motion
design… more visualization for the words being said… more constant motion design visualization with
more frames, more transitions, more creativity. It's too much talking over a single page."
FINAL APPROACH: v3 on one continuous stage: kinetic type on the force-aligned words, marks and strikes,
colour fields that grow out of objects, the viewer's project carried from the hook to the end; 30 of 31
phrases with a new visual.
GENERAL LESSON: The phrase is the unit; every transition names the object it grows out of
(`planning/phrase-by-phrase.md`).

CATEGORY: Visual density (standing direction)
DATE / PROJECT: October 2026, MindMirror and Amargier Advisory intake films; skill update
ORIGINAL IDEA: (repeated in every brief) "more visualization and animation during the voice-over
instead of static with voice-over on background… don't make the vibe like a presentation… really come
up with nice transitions, ways to visualize words being said"; "make the video bright, no static
standard dark background".
WHY IT WAS WEAK: The rule lived in Karl's prompts, not in the skill.
USER CORRECTION: "Improve the skill on what I always prompt: no static frames with simple voice-over on
background… visuals represent what's being said… more frames, more animation, never a boring
presentation vibe, always think outside the box for animations, visuals to explain and transitions."
FINAL APPROACH: `planning/phrase-by-phrase.md` (the rule, the idea list, object-born transitions, bright
colour fields, a frame per phrase), `scripts/phrase_check.py` (measured, calibrated on four of Karl's
films), and the shared kinetic kit `scripts/kinetic.tsx`.
GENERAL LESSON: Show every phrase; measure it before Karl has to say it again.

## AI-looking design corrections

CATEGORY: AI-looking design
DATE / PROJECT: September 2026, skill rebuild
ORIGINAL IDEA: The skill acting as a prompt generator: an animation per sentence.
WHY IT WAS WEAK: Template-driven films: centered text, cards, pills, repeated entrances.
USER CORRECTION: Karl's brief: understand the meaning, choose the strongest visual idea, fit it into
the whole film, critique and revise before production.
FINAL APPROACH: The planning workflow, the visual-strategy catalog, the art-director pass.
GENERAL LESSON: Ask what the viewer needs to understand before asking what should move.

## Apple-style, brand and realism corrections (October 2026)

CATEGORY: Style / motion
DATE / PROJECT: October 2026, TNOA 20 s (no voice-over)
ORIGINAL IDEA: v1: four scenes on a gently drifting background, music-led, about 2% motion.
WHY IT WAS WEAK: Apple films keep the background still and put all the motion in the foreground; four scenes in
20 s is too few; the music drowned the effects.
USER CORRECTION: "Background of Apple style videos normally aren't this moving." "I want way more visuals ...
better transitions, Apple-like transitions and heavy Apple animations." "Apple is sound-effect dominant."
FINAL APPROACH: v2: twelve shots (one every 1.5–1.8 s), a plain still background, springs that overshoot and
settle, 3D card turns, the Dynamic Island, notification stacks, cover flow; an effect on every visible event over a
quiet bed; 6.6% motion at 60 fps.
GENERAL LESSON: Apple style = still background, heavy foreground motion, many visuals, effects-led mix. Measure
the motion norm the brief names (`motion_check.py` median at 60 fps) and reach it with the foreground only.

CATEGORY: Brand
DATE / PROJECT: October 2026, TNOA
ORIGINAL IDEA: Started from the previous client's (Creoble's) kit and colours.
USER CORRECTION: "Not same branding as Creoble, this time from thenetworkofagents.com."
FINAL APPROACH: Harvested TNOA's own colours and type from its site into a fresh kit.
GENERAL LESSON: Every film starts from the client's own harvested brand; reused code keeps only the mechanics.

CATEGORY: Process / concept
DATE / PROJECT: October 2026, Future Unicorn Founders 42 s
ORIGINAL IDEA: A first storyboard that, without meaning to, repeated much of the client's old video.
USER CORRECTION: "A complete different approach from the past videos, because now your storyboard has a lot in
common."
FINAL APPROACH: Listed what the old video did as EXCLUDED, then built a new concept (tactile objects) around it.
GENERAL LESSON: When a client wants to improve an old film, read it first and write the EXCLUDED list before any
storyboard.

CATEGORY: Realism / animation
DATE / PROJECT: October 2026, realism demo (Upwork-ad style, Creoble brand)
ORIGINAL IDEA: Real Mixkit phone footage with a tracked UI on the screen, slow linear drifts and plain cuts.
WHY IT WAS WEAK: Real footage with a constant drift reads as stock footage, not motion design.
USER CORRECTION: "The 3D frames and realistic frames look so linear and not really motion-design like."
FINAL APPROACH: A virtual camera over footage and UI with speed ramps and a roll; joints that zoom through the
screen into the next shot or pull out of a white screen; UI layers lifting off the glass with parallax and shadow;
shutter motion blur; 3D camera orbits and rack focus in the 2D shots.
GENERAL LESSON: Treat realistic material as a stage for motion design (`production/realism.md`).

CATEGORY: Process / speed
DATE / PROJECT: October 2026, realism demo
USER CORRECTION: "I want max 10 minutes, I need to see it quickly." "Just tell me the generation time whenever you
start."
FINAL APPROACH: A 9 s preview in about 10 minutes (two parallel builders while the lead tracked the footage), the
full version offered after.
GENERAL LESSON: Give the generation time at the start of every job. When speed is asked for, ship the smallest
convincing preview first and skip review rounds he didn't ask for.

## Creoble v5 and the loops (October 2026)

CATEGORY: Composition / motion
DATE / PROJECT: October 2026, Creoble v5 (Danish, 55 s)
USER CORRECTIONS, in order: "way way way more minimalistic … now it's all too big" → a single small capsule measured
0.8% motion → "bigger object and 7% useful motion" → the client's website as the one hero object (7.4%) → "I don't
like that the website is constantly scrolling up and down" → camera framing and in-place changes instead → "UIs with
drop shadow same as Apple style" → "more size drop shadow, no direction, even all sides" → "more Apple-style heavy
animations" → "the view shifting is too choppy, softer, smoother, slower" → "make sure stuff is as centred as possible".
FINAL APPROACH: the website (browser ≈ half the frame, or the phone) is the hero; every phrase acts on it; heavy
springs on objects only; a calm, centred, zoom-only camera; even layered shadows plus a static dither; one calm
downward pass at most; ≈3% motion. Worked example: `templates/creoble5`, `house/creoble-style-brief.md`.
GENERAL LESSON: minimal ≠ small; motion targets come from the product doing things, not from decoration or camera
moves; a calm camera beats a busy one; centre.

CATEGORY: Process / format
DATE / PROJECT: October 2026, Klyro, Fieldnote, Morrow House (12 s loops from a website archive, 15 minutes each)
USER CORRECTION: "why more than an hour, it's just 12 seconds"; "something simple in 15 minutes".
FINAL APPROACH: one composition, 720 frames at 60 fps; 3 beats of 4 s on one centred product card in the site's own
brand (colours and fonts from its CSS, copy from its HTML); two lanes of small chips streaming at a speed where
speed × 12 s is a whole number of chip spacings (seamless); each beat enters from and leaves to an empty card body;
effects every 4 s; check seam diff (last vs first frame) ≈ a normal frame step. Templates: `templates/klyro`,
`templates/fieldnote`, `templates/morrow`.
GENERAL LESSON: a short loop is a template job: start from the loop template, harvest the brand, ship in 15 minutes.

## Process corrections

CATEGORY: Process
DATE / PROJECT: October 2026, Tale Forge brand film v2 revision
ORIGINAL IDEA: For the "no drawings" revision, a multi-agent design round (three concepts, three judges, a
synthesis and a critic) before building, with a 2½-hour estimate.
WHY IT WAS WEAK: Karl was waiting for the video; the planning round cost time without changing what he saw.
USER CORRECTION: "Be more straight to the video. No unnecessary things. It takes too long."
FINAL APPROACH: Stopped the round, built the revision directly from the best concept so far, rendered the draft with
the mix and sent it within the hour, naming what wasn't checked.
GENERAL LESSON: A revision goes straight to the video. Plan in the build, render the draft, send it; offer the
extra passes (blurred render, full QC) instead of doing them first.

CATEGORY: Sound
DATE / PROJECT: October 2026, Tale Forge brand film v2
ORIGINAL IDEA: v1 used a found CC BY track ("Frost Waltz", Kevin MacLeod), which needs a credit line.
USER CORRECTION: "New music which is not copyrighted and new sound effects all over the video."
FINAL APPROACH: An original waltz composed for the cut on a sampled chamber orchestra (VSCO 2 CE, CC0), checked by
measurement; a new effects kit of recorded CC0 instruments and generated foley, a sound on every picture event.
GENERAL LESSON: "Not copyrighted" means nothing to license or credit: compose (`score_sampled.py`) or use CC0, and
say so in the README.
