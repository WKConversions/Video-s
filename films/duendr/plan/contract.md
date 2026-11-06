# Duendr: build contract

Film: 42.4 s, 1920x1080, 60 fps, English VO placed at 0.3 s (film = VO + 0.3; `w("word", n)` in `src/kit.tsx` gives a word's
film time, n = which occurrence, 0-based). Project: `films/duendr/film`.

## Karl's brief (verbatim where it matters)
- Script and VO as given. Duendr connects creatives with businesses, venues, brands and other creatives across Málaga and the Costa del Sol.
- "When you animate the map, make the map in a way that you can pinpoint all those cities: Málaga, Marbella, Estepona, Fuengirola,
  Torremolinos, Nerja, Sotogrande, Ronda, Sevilla, Granada and Cádiz. Make sure to make the map 3D with slight curvature as if you're
  looking close-up to the globe." (built: `src/globe.ts` + `src/map.tsx`, `GlobeMap`.)
- Hook "Looking for your next creative connection?" = the concept of his reference 1 (0-5 s), see S1.
- Outro "From your next project to your next partnership, find your people on Duendr." = the concept of his reference 16 (35-40 s), see S12.
- "For the rest be creative in your visualisation."
- PRIVACY: the screenshots are from Karl's account. Never show Karl van Kessel's name, photo, roles or card. No real members' names or
  work either: use the demo profiles and royalty-free clips below.

## House rules for every scene (Karl)
1. Never a still frame: something purposeful moves on every frame of your window (settles, a clip playing inside a card, a dot travelling,
   a card easing). A new visual event every 0.5-0.8 s, on the VO's key words.
2. Overlap: your scene enters before the previous beat has finished and leaves while the next one arrives (0.3-0.8 s). Every change grows
   out of an object (morph, mask from an object, carried object, flip, push); never a plain crossfade, never a hard cut.
3. Apple-style motion: springs on objects (`sp(t, at, f, z)`, z 0.6-0.8), soft eases (`OUT`, `INOUT`, `SOFT`); a calm camera (if you zoom,
   about the frame centre, 1.2-2 s soft; no pans). Compositions centred. Few, big things: key type 96-180 px, UI scaled up 1.8-2.6x
   when it is the subject (the app's components are in app px, ~444 px wide: scale them with a transform).
4. Their look: dark field #161413, cards #1E1B19, cream #F0EBE1, coral #E25A3D, Inter (800-900 for headlines, tight tracking), their real
   components from `src/ui.tsx` (header, Find work / Find talent, chips, gig cards, people rows, map sheet, booked tile, pills, bottom nav),
   the icon (coral circle + cream bar) and the traced wordmark (`src/kit.tsx`). Even all-round soft shadows (`SHADOW`).
5. Technical: move things with `transform` (never animated left/top); no `will-change` on big layers; blur only on short fast moments;
   images at most ~1.3x their pixel size (clips are 960x540: keep a clip card at most ~1250 px wide); `rnd(i)` not Math.random;
   `Media` for clips (they play muted, start at 0 unless you pass `startFrom` in frames at 60 fps).
6. On screen only facts.md + the script + demo content. No invented numbers about Duendr itself (no "500 creatives").

## Files
- `src/kit.tsx`: clock (`w`, `we`, `FPS`, `DUR`), brand `C`, `SHADOW`/`SHADOW_L`/`GLOW`, helpers `k`, `sp`, `win`, `mix`, `c01`, `rnd`, easings,
  `Wordmark`, `Icon` (circle/bar animatable), `Rise` (word-by-word type), `Media` (image or clip), `Center`.
- `src/ui.tsx`: the app UI (`Phone`, `AppHeader`, `Segmented` (on 0..1), `Chip`, `Pill`, `BottomNav`, `GigCard`, `PersonRow`, `MapSheet`,
  `BookedTile`, `Bubble`, `Avatar`, `Badge`, `Ico` icons). Extend in your own files; don't edit ui.tsx.
- `src/map.tsx` + `src/globe.ts`: `GlobeMap` (props: camera `v` = {lam0, phi0, k, pitch, d, S, cx, cy}, `t`, `pins` [{name, at, count?, big?, side?}],
  `children(at)` to draw arcs/cards at lon/lat). A good framing: {lam0 -4.9, phi0 36.95, k 10, pitch 38, d 1.55, S 3600, cx 960, cy 600};
  animate S/pitch/lam0 for camera moves. Crowded coast labels: give Torremolinos, Fuengirola, Estepona, Sotogrande, Cádiz side "l".
- `src/spine.tsx`: the dark field + dither under all scenes. `src/handoff.ts`: exact states at builder boundaries.
- Assets: `public/clips/*.mp4` (960x540, 30 fps, 8 s, muted): dj-stage, dj-turntable, dj-hands, photog-review, photog-lens, portrait-hair,
  model-shoot, model-dress, paint-brush, paint-canvas, dance-graffiti, dance-smoke, design-tablet, design-color, design-menu, piano, guitar,
  fiddle, tattoo, pottery. Avatars `public/img/avatars/{lucia,mateo,rafa,nadia,elena}.jpg` (240 px). Stills in `public/img/stills/`.

## Demo data (use these, consistently)
- Creatives: **Lucía Moreno** (Photographer, Model +1 · Málaga · €150–€250 · Most days · avatar lucia · work: model-shoot, portrait-hair, photog-lens),
  **Mateo Ruiz** (Videographer, Photographer · Marbella · from €300 · Weekends · avatar mateo · work: photog-review, model-dress),
  **Javi Ortega** (DJ, Producer · Marbella · €200–€400 · Weekends · initials JO · work: dj-stage, dj-turntable, dj-hands),
  **Nadia Vega** (Dancer, Choreographer · Málaga · avatar nadia · work: dance-graffiti, dance-smoke),
  **Rafa Torres** (Tattoo artist · Fuengirola · avatar rafa · work: tattoo), **Elena Cruz** (Stylist · Estepona · avatar elena · work: model-dress),
  **Inés Navarro** (Designer, Illustrator · Nerja · initials IN · work: design-tablet, design-color), **Sara Gil** (Ceramicist · Ronda · initials SG · work: pottery),
  **Alba Ríos** (Painter · Granada · initials AR · work: paint-brush, paint-canvas), **Leo Martín** (Pianist · Sevilla · initials LM · work: piano), Tomás (Guitarist · Cádiz · guitar).
- Venues and brands: **Casa Brisa** (beach club, Marbella), **La Terraza** (rooftop, Málaga), **Atelier Mar** (brand, Málaga), **Hotel Sol Nerja**, **Bodega 19** (Ronda).
- Gigs: "Live DJ for sunset sessions" (Casa Brisa · Marbella · €280 · Fri 20 Nov), "Photographer for a rooftop launch" (La Terraza · Málaga · €350),
  "Campaign designer" (Atelier Mar · Málaga · On request), "Acoustic duo for a wedding" (Hotel Sol Nerja · €450), "Mural for a new bodega" (Bodega 19 · Ronda).
- The booking the film follows: Casa Brisa books Javi Ortega, Sat 21 Nov, 20:00, €280 (the fee he keeps in full).

## Builders and files (own only your files; never edit kit.tsx, ui.tsx, map.tsx, globe.ts, spine.tsx, handoff.ts, Story.tsx)
- **B1:** `src/scenes/S1.tsx`, `S2.tsx`, `S3.tsx` (0-8.75) + `src/scenes/b1-*.tsx`, `src/solo/B1.tsx`.
- **B2:** `S4.tsx`, `S5.tsx`, `S6.tsx` (8.6-16.7) + `b2-*`, `src/solo/B2.tsx`.
- **B3:** `S7.tsx`, `S8.tsx` (16.6-25.7) + `b3-*`, `src/solo/B3.tsx`.
- **B4:** `S9.tsx`, `S10.tsx`, `S11.tsx` (25.6-36.05) + `b4-*`, `src/solo/B4.tsx`.
- **Lead:** `S12.tsx` (outro, 35.9-42.4), integration, sound.
Each scene file exports `export const S4: Scene = { id, t0, t1, C }`.

## Check before you finish
1. `./node_modules/.bin/tsc --noEmit -p .` clean for your files.
2. Copy `src/solo/_template.tsx` to `src/solo/<B#>.tsx` with your scenes; `bash check.sh <B#> <t0> <t1>` (960x540 render, motion line,
   SHAKE lines, `out/<B#>-sheet.png` at 0.25 s). Read the sheet, fix, re-run (at most 4 rounds; renders are shared on 4 CPUs).
3. Target: moving in 100% of frames, no SHAKE you can't explain, nothing clipped/colliding, each beat on its word, hand-offs exact.
4. Report: per scene what you built, the motion line, SHAKE left and why, anything not done.

## The storyboard (film times)
### S1 Hook (0.00-2.75, B1) "Looking for your next creative connection?" (Karl's reference 1, 0-5 s)
- 0.00 frame 0 is already moving: a full cream frame (#F3EEE4) with one giant word "Looking" (Inter 900, ~300 px, ink #161413, tracking -0.04em)
  centred, easing down from 1.12 to 1.0.
- 0.30-0.80 on "for" / "your": "Looking" shrinks fast (OUT, 0.3 s) to ~78 px as "for your" join it, small and centred: "Looking for your".
- 0.80-1.05: the whole cream frame scales down (and rounds its corners to 34 px) into a card ~640x360 at the centre: behind it the dark field,
  and a horizontal row of creatives' work cards (the clips: dj-stage, paint-brush, model-shoot, dance-graffiti, pottery, design-tablet...,
  ~560x330 each, 40 px gaps, even soft shadows) slides right-to-left at a steady speed; the cream card is one card in that row.
- 0.96 "next": a coral card (#E25A3D) slides into the row from the right with "next" big in cream (Inter 900, ~170 px); the cream card moves
  off left with the row.
- 1.20-1.60 "creative": the coral card grows (spring, corners to 0) until it fills the frame; "next" shrinks to ~78 px as "creative" joins.
- 1.62 "connection?": "next creative connection?" on the full coral frame, small and centred (cream, ~78 px), words entering one by one
  with the spacing tightening as they settle.
- 2.30-2.75: the line keeps a slow drift; on the pause, the words drop away one by one (as in the reference: "to fulfillment", "so that").
- Out: the coral field is the start of S2 (it condenses into the icon's coral circle).

### S2 "Meet Duendr." (2.45-4.0, B1)
- 2.62 "Meet": the full coral field condenses (radius growing, 0.45 s, INOUT) into the icon's coral circle (~260 px) at the centre on the dark field.
- 2.90 "Duendr": the cream bar of the icon rises next to it (spring) — the "d" — and the wordmark "duendr" (cream, ~170 px tall, its coral dot
  popping last) slides out from behind the icon to the right; the lockup (icon + wordmark) is centred as a group.
- 3.40-3.95: the lockup lifts and shrinks toward the top (it becomes the header of what follows), the coral dot of the wordmark keeps glowing.
- SFX: a deep whoosh into the circle, a pop on the bar, a chime on the dot.

### S3 "The platform connecting creatives, venues, and brands across the Costa del Sol." (3.7-8.75, B1)
- 3.84-4.4 "The platform connecting": the icon's coral circle splits into three coral nodes that move to three columns (left, centre, right),
  thin cream lines drawing between them (connections).
- 4.82 "creatives": the left node blooms into a stack of creative cards (clips: dj-hands, photog-review, paint-canvas) with demo names
  (Javi Ortega, Mateo Ruiz, Alba Ríos) and their avatars/initials.
- 5.78 "venues": the centre node blooms into venue cards (Casa Brisa · Beach club · Marbella; La Terraza · Rooftop · Málaga).
- 6.56 "brands": the right node blooms into a brand card (Atelier Mar · Brand · Málaga) with a campaign clip (model-dress).
- 6.9 lines between all three clusters light up coral, a pulse travels each connection.
- 7.0 "across the Costa del Sol" (7.74 "Costa", 8.20 "Sol"): the three clusters shrink and fly down onto a wide view of the curved globe
  (GlobeMap, wide framing, no pins yet) along the Costa del Sol coastline; the coast lights up coral from Estepona to Nerja (a glowing line
  along the shore). "Costa del Sol" (Inter 800, ~110 px, cream) rises above the horizon.
- 8.3-8.75: the camera dives toward Málaga; everything else fades; Málaga becomes the coral dot of H.dot (r 18 at the frame centre) at 8.75.

### S4 "Showcase your work and share your availability." (8.6-11.6, B2)
- From H.dot: the coral dot becomes the ring of Lucía Moreno's avatar (avatar lucia) which grows; her profile assembles in the app's style
  around it (name + founding badge, "Photographer, Model +1 · Málaga").
- 8.94 "Showcase" / 9.58 "work": her portfolio fills in as a grid of big work tiles (clips model-shoot, portrait-hair, photog-lens) springing in
  one after another, each playing.
- 10.12 "share" / 10.62 "availability": the app's new-post flow: "What's new?" with the "I'm available" card pressed (their screen), then the
  available post: "Available this weekend" in their style (a coral AVAILABLE pill), a week strip where Fri, Sat, Sun light up coral.

### S5 "Find local gigs, discover collaborators," (11.5-14.6, B2)
- 11.84 "Find" / 12.30 "gigs": the board's "Find work" view: gig cards (GigCard with clips: "Live DJ for sunset sessions" · Casa Brisa · €280,
  "Photographer for a rooftop launch" · La Terraza · €350, "Acoustic duo for a wedding" · Hotel Sol Nerja · €450) arrive as a stack that
  flips forward one by one (no scrolling).
- 13.04 "discover" / 13.38 "collaborators": the switch to people: a column of PersonRows (Nadia Vega, Mateo Ruiz, Inés Navarro, Rafa Torres...)
  slides in with avatars; one row lifts out big (Nadia, with her dance clip) and a coral "Let's collab" pill pops (their "Let's collab" post).

### S6 "and explore opportunities on the map." (14.3-16.7, B2) — Karl's map
- 14.40 "explore": the curved globe fills the frame (GlobeMap), the camera settling from wide to the coast framing.
- 14.6-16.0 "opportunities on the map": the 11 pins pop in sequence along the coast and inland (Cádiz, Sotogrande, Estepona, Marbella,
  Fuengirola, Torremolinos, Málaga (big, with a count), Nerja, Ronda, Sevilla, Granada), each with its label, the ring pulsing; thin coral arcs
  link pins (connections across the region). Marbella's pin shows a count (6) and its map sheet (MapSheet "Marbella · 6 open jobs" with
  the demo gigs) rises beside it (scaled ~1.6).
- 16.1-16.7: the map sinks and darkens; the Find work / Find talent switch arrives in front, ending exactly at H.toggle.

### S7 "Hiring creative talent? Post what you need and browse portfolios to find the right fit." (16.6-21.8, B3)
- From H.toggle: 16.84 "Hiring": the switch flips to "Find talent" (the cream thumb slides, spring) — the business side.
- 17.12 "creative talent?": "Hiring creative talent?" (Inter 800, ~120 px) rises above the switch.
- 18.42 "Post" / 18.98 "need": Casa Brisa's post builds in their style: "Live DJ for sunset sessions" typed, chips (Live music, DJ), Fri 20 Nov,
  €280, "Post" pressed; the post flies onto the board.
- 19.46 "browse" / 19.72 "portfolios": a wide row/grid of portfolio cards (clips: dj-turntable, dj-stage, guitar, piano, fiddle, dj-hands) slides
  past — browsing.
- 20.66 "find" / 21.06 "right fit": the row slows; Javi Ortega's card (dj-stage) lifts forward and grows, a coral ring and a check
  ("Right fit") pop; the others fall back.

### S8 "Connect directly, chat about the details, and confirm your booking." (21.6-25.7, B3)
- 22.04 "Connect": on Javi's card the coral "Connect →" pill is pressed (big), a coral line shoots from Casa Brisa's avatar to Javi's.
- 23.28 "chat" / 23.74 "details": a chat in their style (Bubble): Casa Brisa "Hi Javi! Fri 20 Nov, sunset set?", Javi "Works for me. 3 hours?",
  "€280, 18:00–21:00" ... bubbles pop with typing dots between (only illustrative short lines).
- 24.54 "confirm" / 25.10 "booking": a "Confirm booking" pill pressed; the BookedTile (BOOKED ON DUENDR, NOV 21 Sat, Javi Ortega at Casa Brisa,
  Sat · 20:00, the dj-stage clip inside) stamps in with a coral check; ending exactly at H.booking.

### S9 "All in one place." (25.6-27.4, B4)
- From H.booking: 25.84 "All": pieces from the film fly in around it (Lucía's profile, a gig card, the Marbella map sheet, a chat bubble, the
  Find talent switch) and 26.36-26.9 "one place": all of them converge and dive into the Phone (their app on a dark phone, AppHeader + board),
  which settles centred; or into the app icon. One clear move.

### S10 "Creatives keep their full fee, with zero commission." (27.2-30.7, B4)
- 27.50 "Creatives" / 28.50 "full fee": the €280 of the booking comes forward huge (Inter 900, ~260 px, cream) and lands whole in Javi's
  wallet/profile card ("Javi Ortega · €280", nothing taken off).
- 29.52 "zero" / 29.88 "commission": the "0" of a big "0% commission" is the icon's coral circle (the circle rolls in and becomes the 0);
  "commission" in cream; a strike-through of a fee line ("Fee −€0").

### S11 "After each completed booking, recommendations help build trust and strengthen your reputation." (30.6-36.05, B4)
- 31.40 "completed" / 31.78 "booking": the booking tile gets a "Completed" stamp (coral check).
- 32.56 "recommendations": recommendation cards rise out of it in their style (avatar + "Recommended" + a short line from a venue:
  "Packed dance floor, perfect set." — Casa Brisa; "Great energy." — La Terraza), stacking.
- 33.48 "build" / 33.70 "trust": the cards stack into a pile under Javi's profile; a counter of recommendations rises (demo).
- 34.42 "strengthen" / 35.08 "reputation": Javi's profile card grows, a badge lights up, his name rises in the people list.
- 35.5-36.05: a cream circle grows out of the badge until the frame is cream (H.cream).

### S12 Outro (35.9-42.4, lead) "From your next project to your next partnership, find your people on Duendr." (Karl's reference 16, 35-40 s)
- On cream: "From your next project" word by word, centred, the spacing tightening as words settle ("project" in coral); then
  "to your next partnership" ("partnership" coral) replacing it with a sideways wave; "find your people" rising in with a wave stagger;
  "on Duendr." — the text collapses into the icon (coral circle + ink bar) big at the centre, which then shrinks and slides left as the
  "duendr" wordmark (ink, coral dot) appears to its right; the lockup holds to the end with a slow breath.
