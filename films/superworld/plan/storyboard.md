# SuperWorld: script, storyboard and build contract (40 s, 16:9, 1920x1080, 60 fps, no voice-over)

## Brief (Karl)
> "maak een 7% motion norm video voor dit bedrijf: map.superworldapp.com/home, /map/worlds, /apps and the properties
> and chat page. I don't have a voiceover and script, so make the suitable script in English and make the video.
> Video has to be 40 seconds. I'd rather see you make prototypes to visualise instead of using stuff from the /home
> page since those are a bit ugly."

Karl's standing rules from the last films:
- Apple-style motion: constant, varied, heavy springs and morphs, Apple transitions.
- The BACKGROUND is calm and still; the foreground carries the motion.
- No still frames, ever.
- Sound-effect dominant, with the music only a quiet bed.
- Many visuals: a new visual event at least every 0.5 s.
- Motion norm 7% (median share of the frame changing per frame at 60 fps, `motion_check.py`).

## The script (on-screen type; there is no voice-over)
The script IS the on-screen copy. Each line lands as big kinetic type (Instrument Sans 700, 96-150 px) with the
prototype that shows it.

| # | Time (s) | Line | What shows it |
|---|---|---|---|
| 1 | 0.0-3.0 | **Your world,** / **mapped by you and your friends.** | A dot globe spins and dives into a city |
| 2 | 3.0-6.5 | **Real places. Pinned by real people.** | Pins drop on the map; Recs, Check-ins, Posts, People, Worlds |
| 3 | 6.5-10.0 | **Recommend the spots you love.** | A pin opens into a recommendation card |
| 4 | 10.0-13.5 | **Become the Pioneer of your place.** | A Pioneer title card |
| 5 | 13.5-20.0 | **Own a piece of the map.** | Plots light up; one is bought; Top Plots leaderboard |
| 6 | 20.0-24.5 | **Meet up in every city.** | City chats and an activity chat you join |
| 7 | 24.5-30.0 | **Play apps built on Earth.** | App cards in cover flow |
| 8 | 30.0-34.0 | **Build your own. No code.** | Studio templates snap into an app; creators earn |
| 9 | 34.0-40.0 | **SuperWorld** / **Your world, mapped by you and your friends.** / map.superworldapp.com | Logo end card |

## The look: PROTOTYPES, not screenshots
- **Draw everything as clean prototypes in SuperWorld's brand (kit `S`):** cream #FFFAF0 background, white cards
  with a #E0E0E0 hairline and the kit `SHADOW`, ink #1A1A1A, grey #424242, SuperWorld blue #276FF3, the logo
  gradient (`GRAD`), the blue-to-violet button gradient (`BTN`), the gold pill (`goldBg`/`gold`) for titles and the
  leaderboard, red hearts, amber stars.
- **Never use or copy their screenshots.** Rebuild the UI ideas cleaner and more premium.
- **Type:** Instrument Sans only (kit `SANS`); headlines 700 with letter-spacing -0.03em; UI text 26 px or more.
- **Map:** the kit's `CityMap` prototype (a clean vector city), with `Pin`, `Avatar` and `toScreen()` to place things
  on map points (`PLACES`).
  - The map is a SUBJECT: show it in a rounded window, as a tilted 3D sheet, or full frame when the shot is about it.
  - Move it with purposeful camera moves (dive in, glide to a place).
  - Never drift it as wallpaper.
- **People:** avatars are coloured discs with an initial. Use usernames from the facts (@hrish, @travellingtexan,
  @katya, @maxwoon, @alex.alexander, @isla.vuorinen, @sebastian.ramon). No photos of people.
- **Few, big things:** about four separate things on screen at most; the subject of each shot is big.
- **Truth:** every word, number and name comes from the facts below. Nothing invented. The $SPWR token stays out of
  the film.

## Motion (the 7% norm)
- **Raise the norm with the FOREGROUND:**
  - big elements (25-60% of the frame) always moving, at 2 px or more per frame;
  - 3D turns, morphs, slides, map dives, rolls;
  - a transition every 1.2-2 s;
  - textured content (type, UI rows, map detail) moving, not flat shapes.
- **Background:** the cream stays still. Colour fields only when they grow out of an object.
- **No still frames anywhere,** including the hand-off windows and the last two seconds.
- **Apple transitions (vary them; never the same twice in a row):**
  - icon-to-app open;
  - card expand;
  - colour flood or iris from an object;
  - Dynamic-Island capsule morph;
  - cover-flow flick;
  - a speed-matched push;
  - a liquid join;
  - a map dive (zoom into a place);
  - at most one 3D card flip in the whole film.
- **Heavy Apple animation:**
  - kit `bounce`/`spring` on everything that lands, pops, snaps or opens;
  - `BounceWords` letter builds;
  - 3D perspective on cards;
  - squash on fast landings;
  - roll numbers;
  - iOS switches and segmented controls;
  - notification stacks;
  - `Glass` over moving content.
- **Positioning:** with transforms on static boxes. Never animate left/top/width/height; for growing rounded boxes,
  use clip-path inset(... round r) or scale. Keep everything inside a 64 px safe margin. No overlaps that cut text.
  No hard straight clip edges across content (use soft masks).

## Facts (from map.superworldapp.com; use these words)
- **Tagline:** "SuperWorld: your world, mapped by you and your friends."
- **The Map:** "Real places, pinned by real people."
  - Recs: places people vouch for (comment, share, or buy the spot).
  - Check-ins: places people have checked in to.
  - Posts: media and comments pinned anywhere on Earth.
  - People: Super Citizens on the map, right now.
  - Worlds: user-built worlds that start where you look.
  - "Tap to discover things to do nearby".
- **A recommendation:** @isla.vuorinen recommended Casa Haga · Restaurant · tags: Spanish, The food, The ambiance,
  Terrace, Cozy, Groups · "Love it!" · Kylätie 25 A, Helsinki.
- **Titles:**
  - "@hrish is the Pioneer of Sesame" · Pioneer · Since 21 Oct 2026;
  - "@hrish is the SuperFan of Málaga, Spain" · SuperFan;
  - "Hyped by 3 people".
- **Properties:**
  - "Click anywhere on map to buy!";
  - plot states: Owned, My plots, Listed, Wishlisted, Available;
  - Marketplace;
  - "Top Plots — Where the most happens on SuperWorld" (All Time / Weekly; Near here / Worldwide);
  - #1 @travellingtexan 9,265 pts The Metropolitan Museum of Art, New York City;
  - #2 @katya 8,825 pts Department of Mathematics, North Bergen;
  - #3 @maxwoon 7,826 pts West 47th Street, New York City;
  - #4 Available 6,400 pts 129 W 20th St, New York.
- **Chat:**
  - Messages = your chats · Discover = find new people;
  - New York · 21 members; Jersey City · 2 members;
  - "SuperWorld City Ambassadors" (@hrish, Manhattan);
  - an activity chat: "sebastian.ramon is hosting an activity chat" · 🎤 valencia vds · 📍 Ciudad de las Artes y las
    Ciencias · Wed, Oct 21 · 2 members · 1 going · Join;
  - "isla.vuorinen joined the València chat"; "tattiv joined the Lisbon chat".
- **Apps:**
  - "Apps built on Earth — Playable worlds, tours and stories on the real map.";
  - "Interactive experiences you open right on the map.";
  - Explore (tours, expeditions, investigations, globes); Build yours (SuperWorld Studio templates, no code);
    Creators earn (from the apps they build);
  - the apps:
    - Treasure Hunt (ADVENTURE: decode clues on a hand-drawn chart, dig up lost artifacts);
    - Postcards (TOUR: spin the rack, play the map tour, collect a postcard from every place you visit);
    - Party World (MULTIPLAYER: hang out with friends by voice in 3D worlds, pick your avatar, walk, fly and wave
      together);
    - SpaceTime (VIEWER: real environments captured as Gaussian splats);
    - Theories of Everything (VISUALIZATION: five theories of how the Pyramids were built);
    - Network States (COMMUNITY: fly the globe from Próspera to the Network School);
    - CryptoMondays (COMMUNITY);
    - News + Game Theory Predictions (NEWS);
    - Disclosure — The UAP / UFO Files (MYSTERY);
  - "Make your own app — Open Studio".
- **Nav:** Home · Map · Properties · Apps · Chat. "Leaderboard".
- **URL:** map.superworldapp.com.

## Segments, builders and hand-offs (kit: `src/kit.tsx`)
| Segment | File | Span (s) | Frames | Script lines | Hand-off at the end |
|---|---|---|---|---|---|
| A | `scenes/A.tsx` | 0-10 | 0-599 | 1-3 | H1: `H1Map` (the map, full frame, gliding) at 10.0 |
| B | `scenes/B.tsx` | 10-20 | 600-1199 | 4-5 | H2: `H2Panel` (white panel 820x960) at 20.0 |
| C | `scenes/C.tsx` | 20-30 | 1200-1799 | 6-7 | H3: `H3Gradient` (logo gradient, full frame) at 30.0 |
| D | `scenes/D.tsx` | 30-40 | 1800-2399 | 8-9 | the end |

Hand-off rule:
- The outgoing builder morphs INTO the hand-off component by boundary − 0.25 s and draws it unchanged to the boundary.
- The incoming builder draws it unchanged for the first 0.25 s, then morphs out of it.
- The components keep moving on their own, so the cut is never still.

## Shot ideas per segment (a direction: keep the script line timings, the facts and the hand-offs; improve the ideas)

### A (0-10 s)
1. **0-3, the globe.**
   - A globe of blue dots spins (orthographic dots on a sphere, rotating), and the logo's gradient glows behind it.
   - "Your world," builds, then "mapped by you and your friends." (blue accent on "you and your friends").
   - The globe dives: the camera falls into the city, and the dots become the `CityMap`.
2. **3-6.5, the map.**
   - Pins drop and bounce on `PLACES` with avatars.
   - A segmented control springs in: Recs, Check-ins, Posts, People, Worlds; the active pill slides between them as
     pins of that kind pop.
   - "Real places. Pinned by real people."
3. **6.5-10, a recommendation.**
   - A pin grows into a recommendation card (icon-to-app open): Casa Haga, Restaurant, tag chips, "Love it!",
     hearts popping.
   - "Recommend the spots you love."
   - Then the card shrinks back into its pin and the map takes the frame (`H1Map`).

### B (10-20 s)
4. **10-13.5, the title.**
   - The camera glides to a place, and a gold Pioneer title card flips up from the map (or rises with a bounce):
     "@hrish is the Pioneer of Sesame", Since 21 Oct 2026.
   - Confetti or sparkle dots in gold.
   - "Become the Pioneer of your place."
5. **13.5-20, Properties.**
   - The map tilts into 3D; a plot grid draws over it; plots glow (blue-violet heat) where the most happens.
   - A cursor taps an Available plot: "Click anywhere on map to buy!"; the plot fills, and the state chip flips
     Available → Owned with a bounce.
   - The Top Plots leaderboard slides in as a stack: #1 @travellingtexan 9,265 pts The Metropolitan Museum of Art,
     #2, #3, the points rolling up.
   - "Own a piece of the map."
   - Then the leaderboard card becomes the `H2Panel`.

### C (20-30 s)
6. **20-24.5, Chat.**
   - The panel becomes the chat list: Messages | Discover segmented control; city chats (New York · 21 members, Jersey
     City · 2 members) stack in like notifications.
   - An activity chat card opens (card expand): 🎤 valencia vds, 📍 Ciudad de las Artes y las Ciencias, 2 members ·
     1 going.
   - Join is pressed, avatars join (liquid join), and "isla.vuorinen joined the València chat".
   - "Meet up in every city."
7. **24.5-30, Apps.**
   - Cover flow of app cards (each a designed prototype with its category tag and a simple illustration): Treasure
     Hunt, Postcards, Party World, SpaceTime, Theories of Everything, Network States.
   - "Play apps built on Earth."
   - The last card floods into the `H3Gradient`.

### D (30-40 s)
8. **30-34, Studio.**
   - On the gradient, template tiles (Tour, Treasure Hunt, Party World) fly in and snap together into an app card
     on a mini map.
   - "Build your own. No code." and a gold chip "Creators earn".
9. **34-40, the end card.**
   - The app card shrinks into the logo mark (morph).
   - The logo bounces in, and the "SuperWorld" wordmark builds.
   - "Your world, mapped by you and your friends." and "map.superworldapp.com".
   - It keeps floating to the last frame.

## Sound (Apple is sound-effect dominant)
Each builder returns a cue list: one UI sound on every visible event, with times in global seconds. IDs:
- whooshes: gen-whoosh-short, gen-whoosh-medium, gen-whoosh-whip, gen-whoosh-deep;
- rises: gen-riser-1s, gen-swell;
- impacts: gen-impact-soft, gen-impact-deep, gen-stamp;
- taps: gen-tap, kenney-click-001, kenney-select-001, kenney-select-002;
- ticks: gen-tick, kenney-tick-004;
- pops and drops: gen-pop, kenney-drop-003;
- appear: gen-appear, kenney-maximize-009;
- success: gen-chime, gen-success, gen-shimmer.

db is relative (-14 quiet … -4 a hero hit); pitch is in semitones (−5..+7).

## QC each builder runs (60 fps, full 1080p)
1. `npx tsc --noEmit`.
2. Stills at --scale=0.5 to check the look.
3. A render of the span: `npx remotion render src/index.ts Film out/seg.mp4 --frames=<a>-<b> --props='{"blurSamples":1,"audio":"none"}' --concurrency=1 --muted --crf=16 --log=error --browser-executable=$B`.
4. Motion: `python3 <skill>/scripts/motion_check.py out/seg.mp4 --profile`.
   - Report the median; the target is 7% or more.
   - No "still" entries at all.
   - Note: motion_check ignores the last 2 s of a clip longer than 4 s, so also run it on the last 2.5 s alone.
5. Shake: `python3 /home/user/Video-s/films/creoble4/scripts/jitter_check.py out/seg.mp4`: no SHAKE.
6. Look at a strip of frames across the span (ffmpeg, then Read):
   - premium, readable, inside the safe margin;
   - no cut text, no hard clip edges, no overlaps;
   - the hand-off frames match the kit components.
