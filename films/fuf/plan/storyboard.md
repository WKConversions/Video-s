# Future Unicorn Founders: storyboard and build contract (42.5 s, 16:9, 1920x1080, 60 fps, Christina voice-over)

## Brief (Karl)
> "Make a 7% motion norm video for this company: test.fuf-16d.workers.dev. Don't take inspiration from their
> current video; they wanted to improve on it." Script and voice-over: Karl's (`vo/script.txt`, `vo/vo.mp3`, 41.1 s).

Karl's standing rules from the last films:
- **Constant, varied, premium motion**, and Apple-quality transitions.
- **A calm, still background:** the foreground carries the motion.
- **No still frames, ever.**
- **Sound effects matter:** UI-style sounds on the events, kept under the voice.
- **Many visuals:** a new visual event on every phrase, at least every 0.5-0.8 s.
- **Motion norm 7%:** the median share of the frame changing per frame at 60 fps (`motion_check.py`).

## Karl's second brief (read first)
> "i want a lot of frames, a lot of animation, a lot of unique ways of visualising and i want some complete
> different approach from the past video's because now the small storyboard of yours has a lot in common... I added
> the past video" (their current film: `harvest/old/FUF_Video.mp4`, contact sheets in `harvest/old/`).

### EXCLUDED: what their current video does (never use any of it)
- Dot-and-line constellations or networks, star fields, particle dots.
- A search lens or ring over a crowd.
- The unicorn assembled from dots or particles.
- A dark world map with arcs flying to Málaga, or role labels on arcs.
- The Málaga photo as a plain full-frame still with a "Málaga" title.
- Three photo cards in a row with captions.
- A fan or stack of business cards.
- Text struck through.
- Two dots joined by a line, or a glowing orb, for "one conversation".
- Slow serif text fading on dark.
- A centred lockup end card with the tagline under it.

## The idea: a tactile, playful editorial world: objects that tell the story
About 20 shots in 42 s, a new one every 1.5-2.5 s, each a different way of visualising. They are real-feeling objects
(a slot machine, a split-flap board, a wax seal, a napkin, coffee cups, a pop-up paper skyline, a sticker, a
Rolodex, a table plan, a door, a speech bubble), single-line drawings in one bronze line, giant kinetic type, and the
client's Málaga photos inside shapes and letters. The background stays a calm, still cream; the OBJECTS move all the
time.

## The look (FUF's site)
- **Colours:** cream #F7F4EF (the still background), ink #272624 (type and one dark section), bronze #8F765E (dots,
  lines, italic accent words), warm greys #4E4A45 / #655F58, sand #EEE7DF / #DDD5CB, tan #BBA791, and one sunset
  accent #E8B98A in the Málaga shots only.
- **Type:** the serif `SERIF` (Bodoni Moda) for headlines, 90-150 px, letter-spacing -0.02em. The accent words are
  italic bronze, exactly like the site ("brighter *futures.*"). The sans `SANS` (Nunito Sans) is only for small
  uppercase labels with wide tracking (`Kicker`), chips and UI.
- **Logo:** the unicorn mark (`Mark`, transparent PNGs in ink, cream and bronze) and the `Lockup`.
- **Photos:** the client's own, `Photo` with slow pushes and pans:
  - `hero-malaga.jpg`: a sunset terrace over Málaga's port, people talking;
  - `malaga-skyline-detail.jpg`.

  Put them in elegant frames (rounded 28 px, the kit SHADOW), as full-frame moments, or revealed through shapes
  (a circle growing from a dot, a line opening a slit).
- **People:** initials in circles, one-line drawings or speech bubbles. No invented names, no stock faces.
- **Feel:** editorial, warm, premium. Springs mostly at damping 0.8 (an elegant settle); 1 for big carries; 0.65
  only for a few playful pops. Never cheap: no bouncy cartoon motion, no glow, no neon.
- **Don't** take inspiration from the site's current video (harvest/…/fuf-video.mp4): never watch or copy it.

## Motion (the 7% norm)
- **Raise the norm with the FOREGROUND:**
  - large photos pushing and panning, at about 2 px or more per frame;
  - reels spinning, flaps flipping, lines drawing, cards and objects arriving;
  - serif words rising through masks;
  - cards and bubbles arriving;
  - a transition every 1.5-2.5 s.
- **The cream background stays still.** Colour fields (ink, sand, a photo) only grow out of an object (a dot opens
  into a circle, a line opens a slit, a card expands).
- **No still frames anywhere** (motion_check "still" entries), including hand-off windows and the last 2 s.
- **Transitions (vary them, never the same twice in a row):**
  - an object morph (seal, glow, bubble);
  - photo inside letters, then the letters grow;
  - a card expands;
  - a speed-matched push;
  - a flood from an object;
  - a door opening;
  - the camera through a shape;
  - a line unwinding into a new drawing.
- **Positioning:** with transforms on static boxes. Never animate left/top/width/height. For growing rounded
  shapes, use clip-path (circle()/inset(... round r)) or scale.
- **Safe area:** a 64 px margin. No cut text, no overlaps, no hard straight clip edges across content.
- **Smoothness:**
  - SVG and text moving slowly (under 1 px per frame) step on whole pixels in this renderer and shake.
  - Either move them faster than 2 px per frame, or hold them still while something else carries the motion.
  - Check `jitter_check.py`.

## Facts (from the site and the script; use these words)
- **Name:** Future Unicorn Founders (FUF).
- **Tagline:** "Build what's next, together." (script). The site's lines:
  - "Ambitious people build brighter futures.";
  - "Good things begin with a conversation.";
  - "Good conversations. Brighter futures.";
  - "Build what's next in good company.";
  - "Ambitious, but approachable.".
- **What it is:** an international community / networking gatherings for founders, entrepreneurs, builders, investors
  and professionals in Málaga, Spain.
  - "Thoughtful gatherings for ambitious people who value real connections over exchanging business cards."
  - "Meet across disciplines".
  - "Talk about the real work: business challenges, growth, strategy and the ideas still taking shape".
  - "Make room for possibility".
- **Place:** "International in outlook. Connected to Málaga."; "Málaga, Spain"; "a relaxed Mediterranean pace".
- **Gatherings:** "Upcoming gatherings · Dates to be announced" (a week calendar Mon-Sun with an FUF tag).
  - Don't show invented dates or venues.
- **Calls to action:** "Join the community ↗", "Explore events". Don't show the test URL.

## Segments, builders, hand-offs (kit `src/kit.tsx`; the word clock `w("word")` gives the voice's word starts)
| Seg | File | Span (s) | Frames | Voice-over | Hand-off at the end |
|---|---|---|---|---|---|
| A | `scenes/A.tsx` | 0-9.8 | 0-587 | S1 "Great opportunities start with the right connections." · S2 "But finding ambitious people who share your vision isn't always easy." · S3 "Meet Future Unicorn Founders." | H1 `H1Seal` (9.8) |
| B | `scenes/B.tsx` | 9.8-16.85 | 588-1010 | S4 "An international networking community bringing founders, entrepreneurs, builders, and investors together in Málaga." | H2 `H2Malaga` (16.85) |
| C | `scenes/C.tsx` | 16.85-24.25 | 1011-1454 | S5 "Through exclusive gatherings and meaningful conversations, new ideas emerge, partnerships form, and opportunities grow." | H3 `H3Ink` (24.25) |
| D | `scenes/D.tsx` | 24.25-32.85 | 1455-1970 | S6 "No awkward networking." · S7 "No endless business card exchanges." · S8 "Just ambitious minds, real conversations, and connections that matter." | H4 `H4Glow` (32.85) |
| E | `scenes/E.tsx` | 32.85-42.5 | 1971-2549 | S9 "Because the next big opportunity might start with one conversation." · S10 "Future Unicorn Founders." · S11 "Build what's next, together." + the end card | the end |

Hand-off rule:
- The outgoing builder morphs INTO the hand-off component by boundary − 0.25 s and draws it unchanged to the boundary.
- The incoming builder draws it unchanged for 0.25 s, then morphs out.

Word times are in `src/words.json` (a list of all of them is at the bottom of this file).

## Shots (follow these ideas, at these times; make each one rich, detailed and premium)
### A (0-9.8)
1. **0.05-1.6, "Great opportunities".**
   - Giant serif type in horizontal strips runs across the frame like a marquee, alternating directions: GREAT ·
     OPPORTUNITIES (ink and bronze italic).
   - The strips slide and stack, filling the frame.
2. **1.6-3.0, "start with the right connections".**
   - A single continuous bronze line (`DrawLine`) draws two hands reaching toward each other (a one-line drawing).
   - The fingertips meet on "connections" (2.22), and the strips clear.
3. **3.4-6.9, "But finding ambitious people who share your vision isn't always easy."**
   - A premium slot machine (cream body, bronze trim, three reels) spins.
   - The symbols are simple line icons: a rocket, a chart, a lightbulb, a handshake, a compass, a briefcase.
   - The reels stop one by one on MISMATCHED symbols as "isn't always easy" lands (6.30-6.54); the lever bounces back.
4. **7.0-9.55, "Meet Future Unicorn Founders."**
   - On "Meet" (7.58) the lever is pulled again; the reels spin and land on three unicorn marks (8.36-8.82).
   - A soft confetti of bronze paper bits flies up.
   - The machine dissolves and the three marks merge into one bronze wax seal (`H1Seal`).

### B (9.8-16.85)
5. **"An international networking community"** (10.02-11.70)
   - A split-flap arrivals board (ink panel, cream flaps; characters flip through letters with real flap motion)
     builds row by row: ARRIVALS · MÁLAGA.
6. **The four roles, each exactly on its word.**
   - The rows flip to FOUNDERS (12.35), ENTREPRENEURS (13.06), BUILDERS (13.92) and INVESTORS (14.78), each with the
     status LANDED in bronze.
   - The camera glides down the board.
7. **"together in Málaga"** (15.20-16.14)
   - All the flaps flip at once to spell MÁLAGA in giant letters.
   - The Málaga photo fills the letters (a photo inside the type), and the letters grow until the photo fills the
     frame (`H2Malaga`).

### C (16.85-24.25)
8. **"Through exclusive gatherings"** (17.07-17.70)
   - The photo slides into a framed print on a cream table.
   - An envelope with a bronze wax seal (the unicorn) slides in; the seal cracks, and the card rises: "Upcoming
     gatherings · Dates to be announced" with a Mon-Sun row and an FUF tag.
9. **"and meaningful conversations"** (18.50-18.94)
   - One continuous bronze line draws two profiles facing each other (the face/vase illusion).
   - The space between them forms a cup.
10. **"new ideas emerge"** (20.14-20.72): a paper napkin where a sketch draws itself (a rough rocket and an arrow
    chart, hand-drawn in ink).
11. **"partnerships form"** (21.57-21.90): top-down, two coffee cups slide together and clink, a ripple runs through
    the coffee, and two saucers lock.
12. **"and opportunities grow"** (22.80-23.32)
    - A pop-up paper Málaga skyline (layered cut-paper buildings and the cathedral) folds up out of the table.
    - Then ink floods in from the cathedral (`H3Ink`).

### D (24.25-32.85)
13. **"No awkward networking."** (24.46-25.04)
    - On ink, a "HELLO my name is" sticker drifts in and its corner curls.
    - It peels off on "awkward" and flies away crumpling.
14. **"No endless business card exchanges."** (25.92-27.32)
    - A desktop Rolodex spins endlessly, faster and faster.
    - It jams on "exchanges", and the cards burst off the ring.
    - Big cream serif type, with "endless" in italic bronze.
15. **"Just ambitious minds, real conversations, and connections that matter."** (28.41-32.12)
    - On cream: a top-down round table plan (a seating chart) with eight chairs.
    - The seats fill with initials in circles on "ambitious minds" (29.00); speech bubbles pop between neighbours on
      "real conversations" (29.84-30.12).
    - Elegant curved bronze links draw across the table between the seats on "connections that matter" (31.34-32.12).
      These are curves on a seating chart, not a constellation.
    - Warm light rises from the table's centre into the `H4Glow`.

### E (32.85-42.5)
16. **"Because the next big opportunity"** (33.08-34.46)
    - The glow narrows into the light spilling through a door that is slightly open, on cream.
    - The door swings open as the camera pushes through.
17. **"might start with one conversation."** (34.46-36.69)
    - Through the door, a single speech bubble grows from small to fill the frame (the bubble becomes the frame).
    - Inside, "one conversation." in big italic bronze serif.
18. **"Future Unicorn Founders."** (37.23-38.75)
    - The bubble's outline unwinds into one line that draws the unicorn mark (`unicornPath` + `DrawLine`).
    - It fills to the solid `Mark`, and "Future Unicorn Founders" slides in beside it.
19. **"Build what's next, together."** (39.13-40.82)
    - Building blocks (cream and bronze cubes) stack up to carry the words "Build what's next," and then
      "*together.*" lands on top.
20. **End card (40.8-42.5).**
    - An editorial split: the Málaga photo panel on one side (slow push); on the other, the `Lockup`, "Ambitious,
      but approachable." and the ink button "Join the community ↗".
    - It keeps moving to the last frame.

## Sound
Each builder returns cues (global seconds) for its visible events: soft, premium UI sounds under the voice.
- IDs:
  - whooshes: gen-whoosh-short, gen-whoosh-medium, gen-whoosh-deep;
  - rises: gen-riser-1s, gen-swell;
  - impacts: gen-impact-soft, gen-stamp;
  - taps: gen-tap, kenney-click-001, kenney-select-001;
  - ticks: gen-tick, kenney-tick-004;
  - pops: gen-pop, kenney-drop-003;
  - appear: gen-appear, kenney-maximize-009;
  - success: gen-chime, gen-success, gen-shimmer.
- Keep effects off the voice's key words where they would mask them.
- db -14 (quiet) … -6 (a hero hit); pitch is in semitones.

## QC each builder runs (60 fps, full 1080p)
1. `npx tsc --noEmit`.
2. `--scale=0.5` stills for quick looks.
3. Render the span: `npx remotion render src/index.ts Film out/seg.mp4 --frames=<a>-<b> --props='{"blurSamples":1,"audio":"none"}' --concurrency=1 --muted --crf=16 --log=error --browser-executable=$B`.
4. Motion: `motion_check.py out/seg.mp4 --profile`.
   - The median must be 7% or more.
   - No still entries.
   - Also run it on the last 2.5 s alone.
5. Shake: `jitter_check.py out/seg.mp4`: no SHAKE. Track any flagged tile; real pixel stepping must be fixed.
6. Look at a strip of frames: premium, readable, safe margins, no cut text or overlaps; the hand-offs match the kit.

## Word starts (s)
great 0.05, opportunities 0.28, start 0.84, with 1.58, the 1.82, right 1.98, connections 2.22 | but 3.41, finding 3.50,
ambitious 3.82, people 4.26, who 4.68, share 4.90, your 5.20, vision 5.36, isnt 5.68, always 6.30, easy 6.54 | meet
7.58, future 8.06, unicorn 8.36, founders 8.82 | an 10.02, international 10.12, networking 10.64, community 11.20,
bringing 11.70, founders2 12.35, entrepreneurs 13.06, builders 13.92, and 14.52, investors 14.78, together 15.20, in
15.78, mlaga 16.14 | through 17.07, exclusive 17.16, gatherings 17.70, and2 18.08, meaningful 18.50, conversations
18.94, new 20.14, ideas 20.34, emerge 20.72, partnerships 21.57, form 21.90, and3 22.70, opportunities2 22.80, grow
23.32 | no 24.46, awkward 24.68, networking2 25.04 | no2 25.92, endless 26.20, business 26.72, card 27.02, exchanges
27.32 | just 28.41, ambitious2 28.52, minds 29.00, real 29.84, conversations2 30.12, and4 31.26, connections2 31.34,
that 31.76, matter 32.12 | because 33.08, the2 33.22, next 33.42, big 33.70, opportunity 33.90, might 34.46, start2
34.98, with2 35.30, one 35.54, conversation 35.84 | future2 37.23, unicorn2 37.44, founders3 37.98 | build 39.13,
whats 39.32, next2 39.62, together2 40.38 (voice ends 40.82).
