# Digital Marketing Málaga: build contract

Film: 36.4 s, 1920x1080, 60 fps, English VO placed at 0.4 s (film time = VO time + 0.4). Project: `films/dmm/film`.
Brief (Karl, verbatim): "I dont want still frames and i want overlapping animations and transitions so it has constant
motion. Use visuals from their website to make the animations really theirs and unique (visuals is different to assets)."

## Concept and thread
Digital Marketing Málaga's own cyan wave mark is the connection. It is one line that joins two people, gets lost in their topographic terrain, becomes DMM, strings their community, events and WhatsApp conversation together, and finally folds into a door that opens. Every move is built from their site's visual language: topographic charcoal, the wave and its dot, rounded photo cards at different heights, dark event banners, pill buttons and the white events list. No other community could own this film.

**Thread:** The logo's wave: a cyan gradient squiggle (#49D8ED→#9EE6FD) with a lower first hump, a taller second hump, an end hook and a separate dot. Its path through the film:
- 0.0: it draws itself on their topographic charcoal.
- 0.8: it stretches into the line between two people.
- 3.3: it snaps on a ridge of contour lines, searches, and ties itself into a knot on "easy".
- 5.8: the knot pulls straight and springs back into the mark as the serif logotype builds around it.
- 8.7: it stretches across the frame and the hero's photo cards land on its peaks and valleys.
- 11.3: it pulls back into its dot. The dot pins Málaga on the contour map, then opens into the white events page.
- 13.7: it underlines a talk's headline.
- 16.45: it joins the speakers' names.
- 17.85: it becomes a speech bubble's tail and voice, then forks into paths to the member perks and presses "WhatsApp group".
- 20.3: it is the voice-note waveform, the bubble tails and the typing dots in the chat.
- 23.7: it climbs a staircase of their pills, grows taller humps like the logo's own second hump, and its dot lights up.
- 28.4: it links the two people from the opening again and folds up into the outline of a door that opens onto cyan light.
- 32.4: it draws itself back into the logo exactly as on frame 0 and grows on "grow together", with rings rippling from its dot to the last frame.

**Colour:** Three fields in the site's own order (dark hero, white content, dark footer). Every change is a mask that grows out of an object, never a crossfade.
- 0–12.6: charcoal #2C2C31 with their calm topographic lines. Cyan is the only colour. This covers the connection, the search and DMM's own world.
- 12.62: the Málaga pin opens into a white #F5F5F5 circle, their white events section. It is the daylight of the in-person part: banners, the event room, speakers, sharing and the phone. The dark banners and the charcoal phone stand out on it.
- 23.15: the phone's topographic wallpaper zooms through and becomes the charcoal stage again, for the personal, aspirational part, where the cyan wave reads at its best.
- 30.2–30.8: the opened door floods the frame with the full cyan gradient #49D8ED→#9EE6FD. This is the one accent field, kept for the moment that matters: the new door.
- 30.85: that cyan condenses into the JOIN US pill and reveals the charcoal topographic footer for the end card.

Type is white on charcoal, and charcoal on white and on cyan. On white, the wave uses the deeper #49D8ED end and a thicker stroke for contrast.

## How the film is built (read the files)
- `src/kit.tsx`: brand tokens `C`, `SANS`, `SERIF`, shadows (`SHADOW` on charcoal, `SHADOW_L` on white), `w(word)`/`we(word)` (VO word
  start/end in film time; keys in `src/words.ts`, repeats numbered), helpers `k`, `sp` (spring), `win`, `mix`, `c01`, `rnd`;
  components `Topo`, `WaveMark` (the logo mark, draw-on `p`, `dot`), `WaveLink`, `markPoints`/`markDot`/`sinePoints`/`lerpPts`/`WavePoly`
  (morph the wave between shapes with the same point count), `Logo`, `Rise` (word-by-word type), `Pill`, `Photo`, `Banner`, `Bubble`, `Center`.
- `src/topo.ts`: the live contour field (`bumps` summits, `ripples` rings, `ridges` walls).
- `src/spine.tsx`: under all scenes: the field colour (charcoal until 13.2, white #F5F5F5 13.2–23.15, charcoal after), the contour lines
  (white 10% on charcoal, cyan 30% on white) with every scene's `topo(t)` parts merged, the dither. Don't draw your own background field.
- `src/scenes/types.ts`: a scene is `{ id, t0, t1, C: ({t}) => JSX, topo?: (t) => TopoPart }`; drawn while t0 <= t < t1, in a 1920x1080 frame.
- `src/handoff.ts`: the exact states where one builder's scene hands an object to the next builder's scene.
- Assets in `public/img/`: group.jpg 1600x1200 (group in a room), street.jpg 1200 sq (woman in a Málaga street), talk.jpg 1600x1200
  (a talk with an audience), cathedral.jpg 714x668 (keep <= 520 px), crowd.jpg 1600x888 (event crowd in a stone-walled venue),
  outdoor.jpg 1800x850 (terrace event), dmm03.jpg 589x335 (keep <= 600 px), team-alexandra/pablo/cristina/diego.jpg, banner-tatiana/yago/charlie.png
  (1600 px), banner-reddit/human/ferdinand/vanessa/aiseo/nicole.png (~700 px, keep <= 900 px), speaker-tatiana/yago/charlie.jpg (~450x650
  portraits cut from the banners above the printed name), topo.png (their texture), dither.png.
- Facts: only `harvest/facts.md` and the script may appear on screen. Site screenshots: `harvest/pages/*.png`.

## Rules for every scene (Karl's house style + this brief)
1. Never a still frame: something purposeful moves on every frame of your window, including holds (settles, flowing contours, a dot
   travelling, a card easing). A new visual event every 0.5–0.8 s, on the VO's key words (`w('word')`).
2. Overlap: your scene's entrance starts before the previous beat has finished, and its exit overlaps the next (0.3–0.8 s). Inside a
   scene, the next element starts before the last has settled. Transitions grow out of an object (morph, mask from an object, flip,
   carried object), never a plain crossfade or a cut.
3. Apple-style motion on the objects (springs `sp(t, at, f, z)` with z 0.6–0.8, soft eases `OUT`/`INOUT`), a calm camera (no pans;
   if you zoom, about the frame centre, 1.2–2 s soft). Everything centred as a group. Few, big things: key type 90–112 px, cards large.
4. Their visuals: the wave mark, the contour field, rounded photo cards with even soft shadows, the banners, the pills, Albert Sans
   and the serif logotype. Nothing generic (no stock icons, no emoji, no WhatsApp green UI).
5. Technical: position MOVING things with `transform: translate(...)`, never animated `left`/`top` (they snap to whole pixels = shake).
   Don't put `will-change` on big layers. Blur only on short fast moments. Keep images at or below ~1.3x their pixel size.
   No `Math.random`/`Date`: use `rnd(i)`. Use `Img` from remotion (via kit `Photo`/`Banner`) so frames wait for images.
6. Text never clips or collides; on white use charcoal text and the deeper cyan (#1FB9D2 / #49D8ED) for lines (contrast).

## Builders and files (own only your files; never edit kit.tsx, topo.ts, spine.tsx, handoff.ts, Story.tsx)
- **B1:** `src/scenes/S1.tsx`, `S2.tsx`, `S3.tsx` (0–8.55), plus any `src/scenes/b1-*.tsx` helpers, `src/solo/B1.tsx`.
- **B2:** `S4.tsx`, `S5.tsx` (8.30–13.25), `src/scenes/b2-*.tsx`, `src/solo/B2.tsx`.
- **B3:** `S6.tsx`, `S7.tsx` (12.45–17.25), `src/scenes/b3-*.tsx`, `src/solo/B3.tsx`.
- **B4:** `S8.tsx`, `S9.tsx` (17.25–23.15), `src/scenes/b4-*.tsx`, `src/solo/B4.tsx`.
- **Lead (me):** S10–S12 (23.15–36.4), the spine, sound, integration.
Each scene file keeps its export name (`export const S4: Scene = {...}`).

## How to check your work (required before you finish)
1. `cd films/dmm/film && ./node_modules/.bin/tsc --noEmit -p .` (no errors in your files).
2. Copy `src/solo/_template.tsx` to `src/solo/<B#>.tsx`, list your scenes, then `bash check.sh <B#> <t0> <t1>` over your window
   (renders at 960x540, prints the motion line and any SHAKE, writes `out/<B#>-sheet.png`, frames 0.25 s apart).
3. Look at the sheet (Read the PNG). Fix what you see: anything clipped, colliding, unreadable, off-brand, or a stretch where nothing
   moves. Re-run. Target: moving in 100% of frames, no SHAKE line, every beat on its word, hand-off states exact.
4. Finish with a short report: what you built per scene, the motion line, any SHAKE left and why, anything you could not do.

## The storyboard (film times; the beats are the spec)


### S1: Great marketing starts with great connections,
**Build:** Window 0.00–3.40. Owner B1. As written. Card A = img/street.jpg, card B = img/team-diego.jpg (both 400x500, radius 32). The wave stroke: WaveMark at 480 px wide (stroke 42 px), then a morph (markPoints -> sinePoints) to the stretched line between the cards. Top-slot type 'Great connections' (Albert Sans 700, 112 px, white, centred, y ≈ 150–260); 'connections' cyan.

**Idea:** Their own wave mark draws itself on their topographic charcoal, then stretches into the line that joins two people. It states the film's idea, drawn with their mark from frame 0. Centre stage: first the mark, then a pair of rounded photo cards (400x500, radius 32) at (400,580) and (1520,580) with the wave between them. Type sits in the top slot (y≈190).

- 0.00 frame 0 is already moving: on charcoal #2C2C31 the topographic contour lines (1.5 px, cyan at 9%) draw on outward from the centre (until 1.2 s), and the cyan wave mark (480x268 px, stroke 44, gradient #49D8ED→#9EE6FD) starts drawing from its left cap at the centre; the camera breathes for the whole film (scale 1.00±0.8%, 6 s sine, about the centre)
- 0.30 the stroke climbs its taller second hump (draw-on, soft start, long settle)
- 0.55 the end dot pops in after the hook (spring damping 18, ≤3% settle): the full mark sits centred, just ahead of 'marketing'
- 0.80 the mark's ends pull apart (stretch, long S, 0.4 s): the cap glides to x=600 and the dot to x=1320, and the wave relaxes into one long, gentle wave
- 1.05 ('starts') card A blooms out of the left cap: the woman in the Málaga street from their hero, 400x500, scale 0.6→1 from the cap point (spring damping 20), with an even all-round soft shadow
- 1.70 ('great') card B blooms out of the dot: Diego's portrait, 400x500; the dot docks on its left edge; 'Great' rises in the top slot (Albert Sans 700, 112 px, white)
- 2.14 ('connections') 'connections' rises in cyan; a bright glint runs along the wave from A to B (0.35 s); on arrival both cards tilt 4° toward each other (spring) and a soft cyan ring pings from the dot
- 2.70 the wave's amplitude swells once (1.0→1.15) as the contour lines between the cards start to bunch
- 2.95 'Great connections' lifts 30 px and fades (exit accelerating, 0.3 s)

**On screen:** 'Great connections'

**Out:** Object continuity, 0.4 s overlap. The same wave stays stretched between the two cards while, from 2.90, the contour lines bunch into a ridge between them and push them apart until the wave snaps (3.32).

**Sound (lead mixes it):** gen-appear (appear-rise) under the draw-on at 0.0; gen-swell on the stretch at 0.80; kenney-drop-003 pops for the cards at 1.05 and 1.70; gen-chime as the glint lands at 2.45. A quiet music bed fades in from 0.0.


### S2: but finding your people isn't always easy.
**Build:** Window 2.90–6.60. Owner B1. As written, with one graft from the topographic draft: the contour lines also crowd into steep walls (TopoPart ridges/bumps: dense lines = steep ground). Ridge: a vertical wall at the centre via topo ridges [{x1:960,y1:150,x2:960,y2:930,h:rising 0→2.2,w:150}] easing in 2.9–5.3 and out 5.8–6.8. The knot: three tightening loops (build them as points with the SAME count you later morph to a straight line and to markPoints), so it can unwind through a straight line into the mark in S3. Top-slot type 'finding your people' (100 px, white 85%, 'people' cyan).

**Idea:** Their topographic texture becomes the obstacle. The contour lines bunch into a steep ridge between the two people, the wave that joined them snaps, and its dot searches along the contours until it ties itself into a knot on 'easy'. One line, one terrain and two dimmed people: the difficulty reads with the sound off.

- 2.90 the contour lines between the cards bunch into a vertical ridge at the centre (Topo densify, a local band about 360 px wide, tint up to 14% cyan, slow B3 ease until 5.4)
- 3.10 ('but') cards A and B ease outward to x=300 and x=1620 (0.8 s): scale 0.82, desaturated to 35%, dimmed to 70%; the wave stretches thin (stroke 44→24); a camera push 1.00→1.05 starts (2.9→4.9, INOUT, about the centre)
- 3.32 the wave snaps at the ridge: the A half pulls back into card A, and the dot half springs back toward the centre (spring damping 12)
- 3.50 ('finding') the dot starts searching: it travels along one contour of the ridge at constant speed, leaving its cyan trail; 'finding your people' rises in the top slot word by word (Albert Sans 700, 100 px, white 85%)
- 4.10 ('people') a thin cyan outline pulses once around the dimmed card B, the person it is looking for; the trail turns toward it, but the ridge's contours bend it back
- 4.60 ('isn't always') the trail loops back on itself in three clean, tightening loops around the centre, crossing itself: a knot forms (Wave tangle)
- 5.30 ('easy') the knot pulls tight (contracts 18% in 0.12 s with a soft stop); the ridge is at its densest; the camera push has come to rest at 1.05
- 5.70 in the pause the type fades down and the knot's loops start to slacken

**On screen:** 'finding your people'

**Out:** Before and after on the same object, 0.7 s overlap. The knot unwinds through a straight line into the logo's wave (S3), while the ridge relaxes back into the calm texture and the dimmed cards slide out past the frame edges (5.8–6.2, accelerating).

**Sound (lead mixes it):** gen-whoosh-deep (low, quiet) as the ridge rises at 3.0; kenney-click-001 pitched down on the snap at 3.32; kenney-tick-004 three times as the dot turns (3.9, 4.3, 4.7); gen-impact-soft as the knot pulls tight at 5.32. The music bed ducks and darkens (low-pass) through the problem.


### S3: Meet Digital Marketing Málaga,
**Build:** Window 5.80–8.55. Owner B1. As written: knot → straight 520 px line → springs into the logo's wave → the serif logotype (kit Logo, but build the lines yourself so each line rises on its own word: 'Digital' 6.66, 'Marketing' 7.14, 'Málaga' 7.58) builds around it; the dot clicks in after 'Málaga'; a ring ripples out (TopoPart ripple). The logotype leaves 8.25–8.50. HAND-OFF at 8.55 (src/handoff.ts H.mark): the mark alone, complete, WaveMark width 400, box centred at (960, 560). S3's window ends at 8.55; draw nothing after.

**Idea:** The answer arrives on the problem's own line. The knot pulls straight and springs back into the logo's wave, and the serif logotype 'Digital / Marketing / Málaga' builds around it, word by word with the voice. DMM is literally what untangles the search.

- 5.80 the knot unwinds (long S, fastest in the middle): the loops pull out into one straight horizontal line, 520 px, at the centre; the ridge relaxes into the calm texture (until 7.0); cards A and B leave past the frame edges
- 6.36 ('Meet') the straight line springs into the wave shape (amplitude 0→1, spring damping 14, one settle of 3% at most): the logo's wave, 520x290 px, centred; its dot pops at 6.46
- 6.60 ('Digital') 'Digital' rises in their serif logotype (white, cap height ≈110 px; slides up 40 px and fades in, 0.35 s) while the wave glides (0.5 s) to its lockup place after where 'Málaga' will stand; the lockup (≈780x470 px) is centred
- 7.08 ('Marketing') 'Marketing' rises
- 7.52 ('Málaga') 'Málaga' rises beside the waiting wave; the wave settles from 1.06 to 1.0
- 8.02 (end of 'Málaga') the dot clicks in as the full stop, and one ring ripples out of it across the contour lines (1.2 s)
- 8.25 the logotype words lift 40 px and fade, 0.05 s apart (exit accelerating); the wave and its dot stay

**On screen:** 'Digital Marketing Málaga'

**Out:** Object continuity, 0.5 s overlap. The logotype leaves, but its wave stays and becomes S4's community line, stretching across the frame from 8.70.

**Sound (lead mixes it):** gen-riser-1s from 5.3 into the snap; gen-shimmer as the line springs into the mark at 6.40; a soft gen-tap on each logotype word (6.66, 7.14, 7.58); gen-pop on the dot at 8.04. The bed opens back up.


### S4: a global community of digital marketers,
**Build:** Window 8.30–10.95. Owner B2. From 8.55 you own the wave (it arrives as H.mark: WaveMark width 400 centred (960,560)); before 8.55 you may only add ripples/cards that don't touch it. Then as written: three rings ripple out of the dot (TopoPart ripples), the wave stretches across the frame (morph markPoints -> sinePoints, x 150–1770, two peaks y 470, two valleys y 700), the four hero cards rise onto it: img/group.jpg 380x285 at (330,690), img/street.jpg 290x390 at (760,470), img/talk.jpg 380x285 at (1170,690), img/cathedral.jpg 320x300 at (1580,470); a light pulse runs along the wave and lifts each card. Top-slot type 'a global community' (100 px white, 'community' cyan) rolls to 'of digital marketers'.

**Idea:** Their hero, rebuilt and alive. The wave stretches across the frame and the hero's four rounded photo cards land on its peaks and valleys at their different heights, so the community is strung on the connection line. Rings ripple out across the map for 'global'. The top slot quotes their hero line.

- 8.40 the wave slides to the centre as the logotype leaves; a camera pull 1.05→1.00 starts (8.3→10.1, INOUT)
- 8.62 ('a global') three cyan rings ripple out of the dot across the contour field to the frame edges (Topo ripple, fading from 25% to 0, until 9.9); 'a global' rises in the top slot (Albert Sans 700, 100 px)
- 8.70 the wave stretches across the frame (x 150–1770, 0.6 s, long S) into two peaks (y=470) and two valleys (y=700)
- 9.00 ('community') the hero cards rise from below onto the wave, 0.09 s apart (spring damping 18): the group in a room, 380x285, on the first valley (330,690); the woman in the Málaga street, 290x390, on the first peak (760,470), as card A returns; the talk with an audience, 380x285, on the second valley (1170,690); the cathedral, 320x300, on the second peak (1580,470); the wave threads behind each card, and 'community' lands in cyan
- 9.62 ('of digital marketers') the top slot rolls (drop-through, 0.25 s) to 'of digital marketers', word by word
- 10.00 a light pulse travels along the wave from left to right (0.6 s); each card lifts 14 px and brightens as the pulse passes (follow-through, 3 frames): one connected community
- 10.50 the cards start sliding inward along the wave

**On screen:** 'a global community', 'of digital marketers'

**Out:** Layout transformation, 0.5 s overlap. The four cards slide along the shortening wave to the centre and stack (S5), and the outward ripples turn into inward rings.

**Sound (lead mixes it):** gen-swell under the ripples at 8.62; gen-whoosh-medium on the stretch at 8.70; kenney-drop-003 four times with rising pitch for the cards (9.00–9.27); a soft gen-tick tail under the pulse at 10.0.


### S5: right here in Málaga.
**Build:** Window 10.45–13.25. Owner B2. As written: contours draw into rings around (960,600) (TopoPart bump h up to 1.6, r 420), the cards slide in along the shortening wave and fan-stack at the centre, the cathedral card rises to the top at 500x470 centred (960, 600) so its top edge is y = 365, the wave pulls back into its dot, the dot arcs down onto the cathedral card's top edge like a pin. Top slot 'right here in Málaga' ('Málaga' cyan). HAND-OFF at 12.45 (H.pin): the pin dot at (960, 365), radius 12, colour #9EE6FD; from 12.45 S6 draws the dot (swell, then the white circle). Keep drawing the card stack (gently settling) until 13.25: S6's white circle covers it by 13.2. Stop drawing the type by 12.6.

**Idea:** Global to local on their own topographic map. The contour lines draw in to concentric rings around one summit, the community cards gather into a stack there with the cathedral on top, and the wave's dot drops onto it like a map pin.

- 10.50 ('right') the contour lines start contracting into concentric rings around (960,600) (Topo rings around a point, slow, until 11.8); the top slot rolls to 'right here'
- 10.60 the four cards slide inward along the wave (0.65 s, long S, 0.05 s apart), the wave shortening with them
- 11.16 ('here') the cards meet in a fanned stack at the centre (tilted −8°, −3°, +5°); the cathedral card rises to the top and grows to 500x470 (spring damping 20)
- 11.30 the wave pulls back into its dot (draw-off from the cap end, 0.4 s); the dot lifts above the stack
- 11.72 ('Málaga') the dot arcs down onto the top edge of the cathedral card and lands like a pin (one small settle); a ring pings out to meet the summit rings; the slot completes 'in Málaga', with Málaga in cyan
- 12.25 the rings keep easing inward around the pin, slowly; at 12.45 the pin's dot starts to swell

**On screen:** 'right here in Málaga'

**Out:** A mask out of an object, 0.5 s overlap. The pin's dot swells (12.45) and opens into the white circle that becomes the events page (S6, 12.62).

**Sound (lead mixes it):** gen-whoosh-short as the cards converge at 10.62; gen-impact-soft as the cathedral card lands on top at 11.20; kenney-select-001 with a soft gen-chime for the pin at 11.78.


### S6: Discover fresh ideas at our local events,
**Build:** Window 12.45–15.50. Owner B3. From H.pin: the dot swells (r 12 → 35, 12.45–12.62) and opens into a white #F5F5F5 circle (cyan 6 px rim) that grows from (960,365) to cover the frame by 13.17 (the spine's field turns white at 13.2). Then as written: banners land and flip (img/banner-tatiana.png → banner-yago.png → banner-charlie.png; 1280x700 = Banner w 1280, radius 28) on 'Discover' 12.62 / 'fresh' 13.00 / 'ideas' 13.42; the wave draws under the headline at 13.70; the fourth flip at 14.18 shows the event itself: img/crowd.jpg in the same card; it grows to 1360x744 at 14.55. GRAFT from the topographic draft: under the card, the date rolls like an odometer in the site's own style ('2026-10-15 19:00:00' for Tatiana, '2026-09-17 19:00:00' Yago, '2026-06-18 19:00:00' Charlie; only the changing digits roll; Albert Sans 500, 44 px, #9A999E) and the venue under it ('Impact Hub Perchel' / 'Momentum Coworking', Albert Sans 700, 54 px, charcoal) gets the cyan wave as underline on 'local' (14.28). Keep the card centred higher (centre y ≈ 430) to leave room below. At 15.05 the card shows thin seams (S7 splits it).

**Idea:** The pin opens Málaga's events. A white circle out of the dot becomes their white events section. Their own dark event banners flip one after another, each cyan headline a fresh idea, and the last flip turns the announcement into the room full of people: the local event itself.

- 12.45 the pin's dot swells (24→70 px, 0.18 s): the anticipation
- 12.62 ('Discover') the dot opens into a white #F5F5F5 circle that grows from the pin to cover the frame (0.55 s, symmetric ease, a 6 px cyan rim on its edge); inside it the first dark banner lands at the centre: Tatiana Benito, 'What Happens When You Take the P&G Playbook Out of P&G?', 1280x700, radius 28, even soft shadow, scale 0.9→1 with a 6° Y-tilt settling to 0 (spring damping 20)
- 13.00 ('fresh') the banner flips on its vertical axis (0.30 s; the content swaps at 90°, on the fastest frame) to Yago González, 'How to do Digital Business Consulting in 2026'
- 13.42 ('ideas') it flips again, to Charlie Titherley, 'Building Apps in Hours, without developer reliance'
- 13.70 the logo's wave draws on under the banner's cyan headline as its underline (300 px, stroke 14, 0.3 s): the idea is marked
- 14.18 ('local events') a fourth flip: the back of the banner is the event itself, the talk in the stone-walled venue with its seated audience (2025_04 photo), in the same 1280x700 card
- 14.55 the event card grows to 1360x744 (spring) while the photo inside settles from 1.04 to 1.0
- 15.05 thin seams appear in the card as it gets ready to split into three panels

**On screen:** 'What Happens When You Take the P&G Playbook Out of P&G?', 'How to do Digital Business Consulting in 2026', 'Building Apps in Hours, without developer reliance'

**Out:** Layout transformation, 0.35 s overlap. The event card splits into three vertical panels that flip into the three speakers (S7), in the same flip family as the banners.

**Sound (lead mixes it):** gen-whoosh-deep (soft) as the circle opens at 12.62; a light gen-whoosh-short on each flip (13.00, 13.42, 14.18); gen-tick on the underline at 13.70. The bed brightens on the white field.


### S7: learn from industry professionals,
**Build:** Window 15.05–17.25. Owner B3. As written: the event card (crowd.jpg, 1360x744 centred (960,430)) splits into three panels that flip, 0.10 s apart from 15.38, to img/speaker-tatiana.jpg, img/speaker-yago.jpg, img/speaker-charlie.jpg (portraits cropped above the printed names), then morph into portrait cards 430x620 radius 28 at centres (480,520), (960,520), (1440,520); names rise under them at 16.10 (Albert Sans 600, 42 px, charcoal); one cyan wave draws under the three names (16.45) and its dot runs to the right end. The names and the underline leave by 17.20. HAND-OFF at 17.25 (H.trio): exactly those three cards, nothing else. Draw nothing after 17.25.

**Idea:** The event card splits into three panels that flip to the speakers' own portraits, cut from their banners, and they are named. The professionals you learn from at these events are shown as people, not as a claim.

- 15.10 the event card divides into three vertical panels of 440x744; the gaps open to 40 px (0.35 s), with the photo still running across them like a triptych
- 15.38 ('learn') the panels flip one after another (0.30 s each, 0.10 s apart) to the speakers' portraits, cropped from the photo halves of the 2026 banners (above the printed name): Tatiana Benito, Yago González, Charlie Titherley
- 15.95 ('industry') the panels morph into portrait cards of 430x620 (height first, radius over the middle of the move) in a centred row at y=500
- 16.10 their names rise under the cards, 0.08 s apart (Albert Sans 600, 42 px, charcoal #2C2C31): 'Tatiana Benito', 'Yago González', 'Charlie Titherley'
- 16.45 ('professionals') one cyan wave draws under the three names as a single continuous underline (0.5 s), linking them
- 17.00 the underline's dot runs on to the right end of the row, and the cards start sliding together toward the centre

**On screen:** 'Tatiana Benito', 'Yago González', 'Charlie Titherley'

**Out:** Layout transformation, 0.4 s overlap. The three cards gather into one stack (their names dropping away) that flips, in the same family, to S8's group photo.

**Sound (lead mixes it):** gen-whoosh-short for the split at 15.10; kenney-select-001 three times for the flips (15.38–15.58); a soft gen-tap three times for the names; gen-tick on the underline at 16.45.


### S8: share insights, explore opportunities,
**Build:** Window 17.25–20.50. Owner B4. From H.trio (three cards 430x620 at (480,520),(960,520),(1440,520), radius 28). As written: they slide together into a stack (0.3 s), the stack flips at 17.56 to one landscape card img/group.jpg 1000x750; a cyan speech bubble breaks out of its top-right corner with the wave's hook as its tail and a playing voice wave (the mark, its dot running along it); the card and bubble ease left; the wave runs out of the bubble's tail and forks into three branches ending in three cyan pills (kit Pill, 50 px text, charcoal): 'Exclusive training' (y 390), 'Job offers' (y 540), 'WhatsApp group' (y 690) at x ≈ 1400; the dot travels the branches lighting each and presses 'WhatsApp group' at 20.02. Field is white here: use the deeper cyan and thick strokes (contrast).

**Idea:** People share in a circle, and the wave turns from a voice into paths. A speech bubble breaks out of the group photo with the wave as its tail and voice. Then the wave forks to what a free membership actually opens, from their members page: Exclusive training, Job offers and the WhatsApp group.

- 17.25 the three portrait cards slide together into a stack at the centre (0.4 s) as their names drop away
- 17.56 ('share') the stack flips to one landscape card: the group sitting in a circle, talking (7f268048), 1000x750
- 17.85 ('insights') a cyan speech bubble breaks out of the card's top-right corner (360x140, radius 70, with the wave's end hook as its tail; spring damping 18), holding a voice wave: the DMM squiggle, with its dot playing along it
- 18.40 the card and its bubble ease left to x=650 and scale to 0.78 (0.5 s), making room
- 18.70 ('explore') the wave runs out of the bubble's tail to the right (draw-on, 0.35 s) and forks into three branches
- 19.05 ('opportunities') three cyan pills pop at the branch ends at x=1400, 0.08 s apart (520x112, Albert Sans 600, 50 px, charcoal text): 'Exclusive training' (y=390), 'Job offers' (y=540), 'WhatsApp group' (y=690)
- 19.50 the dot travels the branches and lights each pill as it passes (step, hold, step: 'Exclusive training' at 19.50, 'Job offers' at 19.75)
- 20.02 the dot reaches 'WhatsApp group' and presses it (scale 1→0.94→1, spring): the press causes the next scene

**On screen:** 'Exclusive training', 'Job offers', 'WhatsApp group'

**Out:** Match transformation, 0.5 s overlap. The pressed 'WhatsApp group' pill flies into the rising phone and becomes its header bar (pill to bar, same mass). The speech bubble drops into the chat as its first message. The group card and the other two pills leave to the left, accelerating.

**Sound (lead mixes it):** kenney-select-002 on the flip at 17.56; gen-pop for the bubble at 17.85; gen-whoosh-short for the run at 18.70; kenney-drop-003 three times for the pills (19.05–19.21); kenney-tick-004 on the steps (19.50, 19.75); gen-tap on the press at 20.02.


### S9: and keep the conversation going in our private WhatsApp group.
**Build:** Window 19.95–23.15. Owner B4. As written, in DMM's brand (not WhatsApp green): the phone (480x980, radius 64, charcoal UI) rises; the pressed pill flies into its header and becomes the header bar ('Digital Marketing Málaga', wave-mark avatar); messages: the speech bubble drops in as a voice note (the wave as waveform), an image message (img/outdoor.jpg), a link preview (banner-tatiana thumbnail + 'What Happens When You Take the P&G Playbook Out of P&G?' + '2026-10-15 19:00:00'), typing dots; the lock closes on 'private' (21.88); type on the right: 'private' then 'WhatsApp group' (Albert Sans 700, 100 px, charcoal) and the header's second line 'About 240 active members'. Zoom-through 22.70–23.15: the phone scales up about its screen centre until its charcoal topographic screen covers the frame (use kit Topo inside the screen, or img/topo.png on charcoal), blur only on the fastest frames. HAND-OFF at 23.15 (H.cut): your window ends; the spine shows the charcoal stage from 23.15, easing in from 1.06.

**Idea:** The conversation continues in their pocket. A phone in DMM's own colours (charcoal UI, their topographic texture as the chat wallpaper, cyan bubbles whose tails are the wave) fills with the community's own material. The group locks as private, and its wallpaper becomes the next scene.

- 20.05 the phone (480x980, charcoal UI, topographic wallpaper) rises from below to the centre (spring damping 22, 0.6 s); the pressed pill flies into its header and becomes the header bar, its text rolling from 'WhatsApp group' to 'Digital Marketing Málaga', with the wave mark as the group avatar; camera push 1.00→1.06 (20.2→22.0, INOUT)
- 20.30 the speech bubble from S8 drops into the chat as the first message: a voice note with the DMM wave as its waveform and the dot playing
- 20.58 ('conversation') an image message arrives: the outdoor terrace event (2021_05 b9025ec0) in a rounded bubble; the column steps up (natural spring)
- 21.05 ('going') a link preview arrives: Tatiana's banner thumbnail, 'What Happens When You Take the P&G Playbook Out of P&G?' and '2026-10-15 19:00:00' in the site's date style
- 21.55 three cyan typing dots (the wave's dot, tripled) bounce at the bottom; the phone glides left to x=700 (0.5 s) to make room
- 21.82 ('private') a cyan lock beside the group name closes (the shackle drops on a spring); 'private' rises on the right (Albert Sans 700, 100 px, charcoal, x≈1080–1700)
- 22.14 ('WhatsApp group') 'WhatsApp group' rises under it; the header's second line rolls in: 'About 240 active members'
- 22.70 the type on the right leaves; the phone starts its zoom-through: it scales up about its screen centre (x1→x3.4, ease-in, blur on the 4 fastest frames)
- 23.15 cut on the fastest frame: the wallpaper is now the film's charcoal topographic stage, still easing in (1.06→1.0, ease-out)

**On screen:** 'Digital Marketing Málaga', 'What Happens When You Take the P&G Playbook Out of P&G?', '2026-10-15 19:00:00', 'private', 'WhatsApp group', 'About 240 active members'

**Out:** Zoom-through, 0.45 s overlap: the element zooms, not the camera, and this is the film's only zoom-through. The phone's topographic wallpaper fills the frame and becomes S10's charcoal stage, with the speed matched across the cut at 23.15.

**Sound (lead mixes it):** kenney-maximize-009 (appear-rise) as the phone rises at 20.05; kenney-drop-003 for each message (20.30, 20.58, 21.05); gen-tick for the typing dots at 21.55; kenney-click-001 for the lock at 21.82; gen-whoosh-whip through the zoom (22.75–23.20).


### S10: Whether you're building your career, growing your business, or simply looking for inspiration,
**Build:** Owner: lead.

**Idea:** Back on their topographic charcoal, the wave alone acts out three ambitions with the site's own shapes. It climbs a staircase of their pill buttons (career). It grows its humps taller one after another, like the logo's own taller second hump (business). Its dot lights up as the contour lines ring around it (inspiration). One phrase per ambition rolls in the top slot.

- 23.20 the wave's dot pops in at the lower left (560,780); the camera eases from 1.06 to 1.00 (23.4→25.2, INOUT)
- 23.70 ('building') the first cyan pill (their button shape, 300x84, radius 42, no text) settles into place at (640,760) (spring damping 20, no bounce) and the dot hops onto it, drawing the wave behind it; 'your career' starts rising in the top slot (Albert Sans 700, 108 px, white)
- 24.00 the second pill lands at (960,620); the dot hops up
- 24.28 ('career') the third pill lands at (1280,480); the dot reaches the top, and the wave behind it is now a three-step staircase
- 24.80 the pills slide down and out of frame (exit accelerating, 0.35 s) as the stepped line smooths into one long wave
- 25.00 ('growing') the wave's humps grow one after another from left to right, each taller than the last (0.7 s, soft start, long settle), with the dot ending high at (1500,360); the slot rolls to 'your business'
- 25.60 a glint runs along the wave's gradient from left to right (0.4 s) as it finishes growing
- 26.10 ('or simply') the dot lets go of the line and floats to (960,480); the line relaxes and fades into one of the contour lines, becoming part of the terrain
- 26.70 ('looking') the dot drifts in a small, calm arc, looking; the nearest contours lean toward it
- 27.14 ('inspiration') the dot flares (scale 1→2.2, soft glow) and the contour lines around it pull into rings and ripple outward (1.2 s); the slot rolls to 'inspiration' in cyan
- 27.65 the rings keep spreading; the glowing dot settles at 1.6x in the centre, waiting

**On screen:** 'your career', 'your business', 'inspiration'

**Out:** Object continuity, 0.35 s overlap. The glowing dot stays at the centre and becomes the meeting point of the next connection as the two people slide in on either side (S11).

**Sound (lead mixes it):** kenney-tick-004 on each pill, stepping up in pitch (23.70, 24.00, 24.28); gen-whoosh-short as the pills leave at 24.80; gen-riser-1s under the growth (24.9–25.8); gen-shimmer on the flare at 27.14. The bed lifts a little.


### S11: your next connection could open a new door.
**Build:** Owner: lead.

**Idea:** The payoff of the opening. The two people who were pushed apart slide back in, the glowing dot links them, and the line between them folds up into the outline of a door that swings open onto the brand's cyan light. A connection literally becomes a door.

- 27.70 ('your next') cards A (the woman in the Málaga street) and B (Diego), in full colour now, slide in from the frame edges to (520,600) and (1400,600), 360x460 each (fast, then slow, 0.5 s)
- 28.42 ('next') the dot draws the wave out to both cards at once (0.35 s), linking them; 'your next connection' rises in the top slot word by word
- 28.72 ('connection') the link completes: both cards tilt 4° toward each other (spring) and a ring pings from the centre
- 29.22 ('could') the middle of the line lifts and folds up, by way of a straight line, into a door outline (0.45 s): a 320x580 rounded-top rectangle centred at (960,560), whose bottom stays as the threshold between the two cards; a charcoal door panel with the topographic texture fills it
- 29.62 ('open') the panel swings open toward the viewer on its left hinge (rotateY 0→−72°, perspective 1600 px, soft start, long settle, 0.55 s) and cyan light (#49D8ED→#9EE6FD) pours through the gap, a wedge spreading across the floor; the slot type lifts away
- 30.20 ('a new door') the lit opening grows into a mask that covers the frame (rounded rectangle to full frame, ease-in, fastest at the end, 0.55 s); the cards and the outline disappear under the light
- 30.76 ('door') the frame is the full cyan gradient; a faint white sheen crosses it once

**On screen:** 'your next connection'

**Out:** Background becomes foreground, 0.3 s overlap. The full cyan field contracts into the JOIN US pill at the centre (S12, 30.85–31.12).

**Sound (lead mixes it):** kenney-drop-003 twice for the cards (27.70, 27.78); gen-chime on the connection at 28.72; gen-swell as the door draws at 29.22; gen-whoosh-medium on the swing at 29.62, with gen-riser-2s building from 28.9 into the flood; gen-shimmer at full cyan at 30.76.


### S12: Join Digital Marketing Málaga. Let's grow together.
**Build:** Owner: lead.

**Idea:** The cyan light condenses into their own JOIN US pill, which is pressed on 'Join' and reveals their footer's topographic charcoal. The logotype builds and the wave draws itself back into the logo exactly as on frame 0. It then grows on 'Let's grow together', with rings rippling from its dot to the last frame.

- 30.85 the full cyan field contracts toward the centre into a pill (1920x1080 → 560x150, corner radius rising over the middle of the move, 0.3 s), revealing the charcoal topographic footer behind it; 'JOIN US' (Albert Sans 600, 56 px, charcoal, +4% tracking) rises inside 3 frames after the pill settles
- 31.14 ('Join') the pill is pressed (scale 1→0.94→1, spring damping 16) and a cyan ring ripples from it across the contour lines; camera push 1.00→1.04 (31.2→33.2, INOUT)
- 31.50 ('Digital') the pill eases down to y=880 and shrinks to 400x108 (0.5 s) as 'Digital' rises in the serif logotype above (lockup ≈700x410, centred at (960,400))
- 31.96 ('Marketing') 'Marketing' rises
- 32.38 ('Málaga') 'Málaga' rises, and the wave draws itself on after it from its left cap, exactly as on frame 0 (first hump, taller second hump, hook; 0.45 s)
- 32.92 (end of 'Málaga') the dot pops in as the full stop
- 33.34 ('Let's') 'Let's grow together.' rises under the logo word by word at y=690 (Albert Sans 700, 92 px, white, with 'together' in cyan); the URL 'digitalmarketingmalaga.com' (Albert Sans 500, 36 px, grey #9A999E) fades up under the pill at y=975
- 33.70 ('grow') the logo's wave grows: its second hump rises 18% (0.6 s, soft)
- 33.82 ('together') rings start rippling out of the wave's dot through the contour lines, one every 0.7 s, fading as they spread
- 34.50 a second ring leaves the dot; the contour lines keep flowing slowly
- 35.00 a glint runs once along the wave's gradient (0.6 s)
- 35.60 a third ring leaves; the camera's breath eases toward rest; the logo itself rests
- 36.20 a fourth ring is still spreading on the last frame (36.4): nothing is still

**On screen:** 'JOIN US', 'Digital Marketing Málaga', "Let's grow together.", 'digitalmarketingmalaga.com'

**Out:** End of film. The end card holds its layout while rings keep spreading from the wave's dot to the last frame (no fade).

**Sound (lead mixes it):** gen-whoosh-short (a reversed feel) for the contraction at 30.85; gen-tap on the press at 31.14 with a soft gen-swell ring; a soft gen-tap on 'Digital', 'Marketing' and 'Málaga'; gen-success on the dot at 32.92; a soft gen-chime on 'together' at 33.82; gen-shimmer for the glint at 35.0. The music bed resolves and rings out to 36.4.
