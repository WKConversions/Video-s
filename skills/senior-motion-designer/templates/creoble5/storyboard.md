# REVISION 4 (Karl, on the final: "the view shifting is too choppy, should all be softer and smoother and slower")
- **The camera, which is every view change** (push, pull, pan, the stage's scale or position), becomes calm:
  - **Fewer moves:** at most one reframe per sentence. Many beats keep the frame where it is.
  - **Slower:** each move takes 1.2–2.0 s. Never a quick push, never two moves back to back.
  - **Softer:** a smooth sine or `INOUT` ease from rest to rest. No springs, anticipation or overshoot on the camera.
    The springs stay on the objects only.
  - **Smaller:** zoom changes within about ±12%, pans within about 150 px.
- **Objects:** the content (pops, docks, typing, rolls, photo swaps) keeps its Apple springs. Hero-photo swaps
  become calmer too: at most one swap every 1.5–2 s, crossfade or slow slide.
- **Hand-offs:** the kit's `StageHandoff` is now a softer push, 1.0 → 1.04 (was 1.08). Incoming: start at 1.04 and
  continue that push's motion with a long ease-out. Outgoing: end at scale 1, scroll 0.
- **Motion:** report the median honestly. Smoothness now matters more than the number.

# REVISION 3 (Karl, on draft 3; overrides Revision 2 where they differ)
> "I don't like that the website is constantly scrolling up and down."

- **No scroll ping-pong, ever:**
  - The page never scrolls back up.
  - Scroll only where the beat is about looking at the site ("Du ser den færdig", "Se den"). There it is ONE calm
    downward pass, readable and eased, never a time-lapse.
  - To get back to the top, don't scroll up. Use a cut-like move: the phone turns in 3D and shows the top, or an
    iOS-style status-bar tap jumps there behind a quick blur, or the page rebuilds.
- **What replaces it (explaining motion, still aiming at ≥ 7%):**
  - **Camera framing on the stage.** Push in on the part of the site the voice names (the headline, the address
    bar, the price area, the booking button, a photo), glide to the next detail, pull back. Use varied directions,
    eased speed ramps, purposeful.
  - **Site content changing in place:**
    - blocks building or rebuilding;
    - photos swapping in their frames (slide or crossfade);
    - the layout reflowing desktop ↔ mobile;
    - the AI trying colour and type variants;
    - sections fanning out as pages (Forside, Behandlinger, Kontakt);
    - the headline being edited;
    - the "Book tid" button appearing.
  - **The beat objects docking:** price, chips, lock, chat, toggle, as now.
- **Hand-offs:** the kit's `StageHandoff` is now a camera push-in (stage scale 1.0 → 1.08 at scroll 0), not a
  scroll.
  - Outgoing: end on the plain stage at scale 1, scroll 0.
  - Incoming: start from the stage at scale 1.08, scroll 0.

# REVISION 2 (Karl chose this; it overrides Revision 1 where they differ): the website is the hero object
Draft 2 measured 2.0%. The only content that reached 7% was Holm's photo-rich site moving (building, scrolling, being
edited); typing fields, icons, chat bubbles and buttons alone stay under 1%.

So the website is the ONE hero object in every beat:
- **The stage:** `Stage` in `./v5` is a browser of 960×600 with `HolmSite`, centred. It takes `scroll` in design px (0
  … `STAGE_SCROLL_MAX` ≈ 658), plus `build`, `booking`, `url` and `live`. Its children are drawn over the site area.
  - It may become the phone (`Phone` at scale 1.4 with `MiniSite`) and back, as a morph.
  - It may flip in 3D to show a back side: code, or the map.
  - It may push in on a detail (exceeding the size limits briefly is allowed for a focus push).
- **The site is always alive:** building, scrolling, being edited, or its photos sliding. A steady scroll at ≥ 3 px
  per frame on screen, with eased turnarounds and never a slow creep, is the base motion under every beat. A beat with
  nothing else to do scrolls the site.
- **Every phrase acts on the site,** docking onto it, opening over it, or flying out of it and back. Beat objects stay
  big and readable (Revision 1 sizes) but sit ON the stage (overlapping it is fine), never as a separate scene.
  Examples:
  - the price tag docks on the site;
  - the domain types into its address bar;
  - the lock snaps onto the price;
  - the support chat opens over the site;
  - the CTA button lands on the site.
- **Hand-offs:** replace the capsule whip with `<StageHandoff g={g} at="hN" />`. It is the stage centred, the site
  scrolling 0 → 300 across the window, and the address bar "Forhåndsvisning" (h1–h3) or "holmfysio.dk" live (h4).
  - Outgoing: by `f(hN) − 7.5`, be the plain stage at scroll 0 with that address bar.
  - Incoming: from `f(hN) + 7.5`, start from the stage at scroll 300.
- **Target:** span median ≥ 7% at `--scale=0.5`, with no SHAKE at `--scale=1` on the busiest 3 s. Keep the motion
  explaining, never wobble.

# REVISION 1 (Karl, on the 540p draft; read before everything below, it overrides the size and motion rules)
> "Bigger object and 7% useful motion. No shaking objects, and the 7% has to be useful, explaining motion. But it
> should be very understandable."

The draft was minimal but measured only 0.8% motion: one small object on cream can't change 7% of the frame. So:
- **Bigger object.** Still ONE object at a time, centred, on plain still cream, with at most one short line of text.
  - The hero object is now 45–60% of the frame width: about 900–1100 px wide, or about 420×900 for the phone
    (`<Phone scale={1.4}>`).
  - New limits: `MAX_W` 1150, `MAX_H` 920. Type is bigger: headline 92–110 px, UI text ≥ 28 px at 1080p.
- **7% from useful, explaining motion.** The number must come from content that SHOWS what the voice says, moving
  inside or out of the object:
  - the site building itself block by block;
  - typing;
  - scrolling through the finished site;
  - the headline rewriting;
  - numbers rolling;
  - chips flying out and docking;
  - checks ticking;
  - the globe turning;
  - server pins pulsing on the map;
  - messages typing.

  Keep the object busy explaining for most of every second. No decorative wobble, sway or float to pad the number:
  `float()` only very gently, and only between beats.
- **Very understandable.** Each phrase's picture reads in one second: a clear subject, Danish labels where they help,
  nothing abstract. If a visual needs a label to be understood, give it one (e.g. "Domæne", "E-mail", "Servere i
  Europa").
- **No shake** (`jitter_check` at full scale shows no SHAKE line):
  - Move with transforms on static boxes. Never animate left/top/width/height, font-size or letter-spacing.
  - No slow sub-pixel text glides: text either sits still or moves at ≥ 2 px per frame.
  - A slow-moving text layer gets `willChange: "transform"` plus a static `rotate(0.1deg)`, but only if it never
    scales up afterwards (Chrome keeps the first raster scale).
  - Scrolling content inside a device: put `willChange: "transform"` on the scrolling layer, and scroll at a steady
    ≥ 2 px per frame, or eased fast; no slow creep.
  - Use clip-path for growing boxes.
- **Measure:**
  - motion: on your span's render at `--scale=0.5`, median ≥ 7%;
  - shake: `jitter_check` on a `--scale=1` render of your 3 busiest seconds (`--frames=a-b`), no SHAKE.
- **Hand-offs:** unchanged (the small capsule whips across at h1–h4).
- **Shot list:** same as below, at the new size. Where a beat had a tiny object (the "</>" chip, the toggle, chips,
  the lock, the calendar), make it a big, readable object of its own, or show the beat inside the hero object.

# Creoble v5 (Danish): the minimal Apple film. Build contract (55.2 s, 16:9, 1920×1080, 60 fps)

## Karl's brief (read first)
> "Make a new video, 7% motion, but way way way more minimalistic apple style with creoble brand. Now some moments
> its all too big and too much in the screen, make a very minimalistic but very obvious apple animated video. Same
> script, same voiceover, danish."

So, against v4 (`films/creoble4`), which is the film to move AWAY from:
- **v4's mistakes, now banned:**
  - full-frame browsers and sites (1460 px wide);
  - big multi-element bento grids;
  - huge statements;
  - several things competing.
- **v5:**
  - ONE thing on screen at a time, centred, small, on plain cream;
  - lots of empty space;
  - unmistakably Apple motion: springs that overshoot and settle, one object morphing into the next, Liquid Glass,
    the Dynamic Island, blur-to-sharp type, rolling numbers, iOS toggles.

## The idea: one thread
A small sage capsule (`Pill`, 200×60, sage #87A89E) is the film's only character. It morphs into everything the voice
names:
- a stopwatch;
- a text field;
- a phone;
- a price;
- a lock;
- a chain link;
- a speech bubble;
- finally the full stop of the wordmark.

Every phrase is one morph or one event on that object. Nothing appears from nothing: things grow out of the capsule
or out of the current object, and collapse back into it.

## Minimal rules (hard)
- **Background:** plain `C.bg` #FAFAF8, never animated. No full-frame colour floods, no textures, no camera drift over
  the whole frame.
- **Size:** no object larger than 760×640 px (`MAX_W`, `MAX_H`). The phone (`Phone`, 300×640) is the biggest thing
  in the film. Most objects are 200–600 px wide.
- **Count:** at most 2 things on screen (the object plus at most one line of text, or one small chip), and centred.
  The text sits above or below the object, never on top of it.
- **Text:**
  - at most ONE short line on screen;
  - headline Fraunces 400, 64–80 px (`TYPE.head` 76), with the key word in italic deep sage (`italicWords`);
  - UI text DM Sans 22–30 px;
  - no paragraphs, and never the whole sentence of the voice on screen;
  - only the word or two that matter (e.g. "499 kr.", "Én gang.", "Nul risiko.");
  - the voice carries the rest.
- **Colours:** sage, light sage, deep sage, ink, cream, white. No orange, no other hues. The example site Holm
  Fysioterapi keeps its own slate teal, inside the phone only.

## Motion (7% target)
- **The measure:** the median share of the frame that changes per frame (`motion_check.py`) at 60 fps. Target 7% on
  your span.
- **Reach it the minimal way, never by adding things or making them bigger:**
  - the object is always moving (springs, morphs, travel along arcs);
  - holds float (`float(g)`: bob plus a slow 3D sway, so every pixel of the object changes);
  - content inside the object moves (the Holm site scrolling in the phone, numbers rolling, typing);
  - a new visual event every 0.5–0.8 s;
  - morphs and arrivals fast and springy (0.3–0.5 s), overshooting and settling.
- **No still frames, ever:** something visible moves in every frame, including inside the hand-off windows.
- **Springs:** `bounce(g, at, response, damping)` from `./shared` for arrivals, pops and lands (damping 0.55–0.7);
  `aspring` for carries; `press()` for button presses; `squash(vx, vy)` for fast travel.
- **Positioning:** transforms only (translate/scale/rotate on static boxes). Never animate left/top/width/height (they
  snap to pixels and shake). For a growing rounded box, use `clip-path: inset(... round r)` on a static box, or scale.
  Slow-moving text: `willChange: "transform"` ONLY if it never scales up later.
- **Morphs:** a capsule becoming a card or a phone is a clip-path or border-radius plus scale morph of one box, with
  the content fading in as it lands (blur to sharp). A shape's colour can cross-fade during the morph.
- **Vary the moves:** don't repeat the same entrance twice in your span. Directions change (up, down, arc, in depth);
  arrivals change (drop and bounce, grow from the capsule, flip in 3D, slide from the Island).

## Clock and kit
- **Clock:** `g` counts 30ths of a second (fractional at 60 fps). `f("w:word")` is a word's start in g; labels are in
  `src/words.json` (lower-case, æøå dropped: "færdig" → `w:frdig`, "Én" → `w:n`, "kø" → `w:k`, a repeat gets a
  number: `w:ingen2`).
- **Helpers in `./shared`:**
  - `k(g, at, dur_s, ease)` gives 0..1 progress; `kf` is the same with frames;
  - `bounce`, `aspring`, `press`, `squash`;
  - `LiquidGlass` (the masked rim lens: it refracts what's behind it, so put it over moving content), `Island`,
    `Gooey`;
  - `BounceText`, `RollNumber`, `Toggle`, `Check`, `PillButton`, `Ico` (icons), `Wordmark`.

  Read their signatures in `src/shared.tsx` (don't read the whole file; grep for what you need).
- **`./v5` (the minimal kit):**
  - `Pill` and `Handoff` (the thread, and the hand-off at h1..h4);
  - `float(g, seed)`;
  - `Phone` (300×640, with Dynamic Island and a children slot of 282×622) and `MiniSite` (the mobile Holm site:
    `build`, `scroll`, `headline`, `booking`, `highlight`);
  - `Line` (one centred line with a blur-to-sharp rise per word; `p`, `out`, `italicWords`);
  - the constants `CX`, `CY`, `MAX_W`, `MAX_H`, `TYPE`, `SHADOW_SOFT`.

## Hand-offs (the thread whips across)
At each hand-off label h1..h4, both builders draw `<Handoff g={g} at="hN" />` and NOTHING else, for
`g ∈ [f("hN") − 7.5, f("hN") + 7.5]` (0.25 s each side). The capsule whips from x 760 to x 1160 through the centre,
stretching.
- **Outgoing builder:** by `f("hN") − 7.5` your last object has collapsed into the capsule at x 760, y 540 (200×60,
  sage). From there until your span ends at `f("hN")`, draw only `<Handoff>`.
- **Incoming builder:** from your span start `f("hN")` until `f("hN") + 7.5`, draw only `<Handoff>`. Then your first
  object grows out of the capsule at x 1160, y 540.
- **Spans** (Story switches scenes at the h labels):
  - S1: 0 to h1 (10.05 s);
  - S2: h1 to h2 (17.05 s);
  - S3: h2 to h3 (26.66 s);
  - S4: h3 to h4 (39.22 s);
  - S5: h4 to the end (55.18 s).

## Facts (on screen, only these; Danish)
Use these from the script and creoble.dk:
- 499 kr.
- Én gang.
- Intet abonnement.
- Siden er din.
- Nul risiko.
- Fra 83 kr./md. (with "faktureres årligt" as a small note)
- Domæne og e-mail er med.
- Fast pris.
- Også når du fornyer.
- Domænet i dit navn.
- Servere i Europa.
- Ingen binding.
- Ingen kø.
- Ingen robotsvar.
- Hjemmeside og hosting, samlet ét sted.
- Byg den. Se den. Så køber du.
- Byg din side gratis
- creoble.dk

The example client is Holm Fysioterapi (fictional, in the phone), with the example domain holmfysio.dk. No other
names, numbers or claims.

## Shot list (word labels in brackets; a direction, not a cage, but keep the rules)

### S1 · 0 – h1 (10.05 s): "Din nye hjemmeside er få minutter væk. Bygget af AI. Fortæl kort om din virksomhed. Creoble bygger hele siden. Ingen teknik. Ingen skabeloner."
1. **[w:din] Opening.** A sage dot (24 px) drops from above into the empty cream frame and bounces twice, then
   stretches sideways into the capsule.
   - [w:hjemmeside] The capsule springs open into a small Liquid Glass browser window (≈520×320). A tiny site sketch
     (3–4 sage-tint blocks) builds inside it in a quick cascade.
   - [w:minutter] The window shrinks back into a ring: a stopwatch (≈220 px) whose sage arc sweeps fast. The line
     "få minutter" sits under it (italic "minutter").
2. **[w:bygget] Bygget af AI.**
   - The stopwatch ring collapses to a dot that bursts into a small four-point sparkle (✦, sage), spinning in on a
     spring.
   - "Bygget af AI." (Line, "AI" italic) rises under it.
3. **[w:fortl] The text field.**
   - The sparkle stretches into a Liquid Glass text field (≈560×76) with a blinking sage caret.
   - [w:kort] It types "Holm Fysioterapi" (DM Sans 28), letter by letter.
   - A small label above it: "Fortæl kort om din virksomhed" (DM Sans 22, muted).
4. **[w:creoble] Creoble bygger hele siden.**
   - The field's send arrow is pressed (`press`), and the field collapses into the capsule.
   - The capsule rises and becomes the Dynamic Island of a `Phone` that grows down out of it (the phone body
     unrolls from the Island: clip-path from the top).
   - [w:bygger] Inside, `MiniSite` builds block by block (build 0→1 by [w:siden]). The phone floats (`float`).
5. **[w:ingen] Ingen teknik.**
   - A small ink chip "</>" pops out to the left of the phone on a spring.
   - [w:teknik] A sage line strikes it, and it drops away with gravity (rotating, fading).
6. **[w:ingen2] Ingen skabeloner.**
   - Three tiny grey template cards fan out behind the phone like a hand of cards.
   - [w:skabeloner] They slide away and fade (the opposite direction), leaving the one real site, which scrolls
     slowly.
7. **h1.** The phone collapses up into its Island, the Island drops into the capsule at x 760, and the hand-off
   follows.

### S2 · h1 – h2 (17.05 s): "Det bedste? Du ser den færdig, før du betaler en krone. Vil du ændre noget? Skriv det. Creoble retter det."
1. **[w:det] Det bedste?**
   - The capsule grows into the phone again: a different entrance from S1's. It flips up from flat in 3D
     (rotateX 70° → 0) with a bounce.
   - "Det bedste?" rises above it.
2. **[w:du] Du ser den færdig, før du betaler en krone.**
   - The phone shows the finished `MiniSite`, scrolling smoothly down and back (the full site, seen).
   - The Island expands (Island morph) into a pill reading "Forhåndsvisning" with an eye icon.
   - [w:krone] A small Liquid Glass tag "0 kr." swings in beside the phone on a spring.
3. **[w:vil] Vil du ændre noget?** The phone turns slightly toward the camera (3D). On the site's headline a sage
   selection highlight (`highlight` 0→1) springs on.
4. **[w:skriv] Skriv det.**
   - An iMessage-style sage bubble rises from below the phone with typing dots.
   - It then reads "Gør overskriften varmere" (DM Sans 24, an example instruction).
5. **[w:creoble2] Creoble retter det.**
   - The headline blur-swaps to "Velkommen hjem i din krop." (the corrected headline; an example).
   - A sage check pops on the bubble with a bounce, then the bubble pops away.
6. **h2.** The phone shrinks and rounds into the capsule at x 760, and the hand-off follows.

### S3 · h2 – h3 (26.66 s): "Tilfreds? 499 kroner. Én gang. Intet abonnement. Siden er din. Ikke tilfreds? Så koster det ingenting. Nul risiko."
1. **[w:tilfreds] Tilfreds?** The capsule settles at the centre and a sage check draws inside it (a stroke draw plus a
   pop).
2. **[w:499] The price.**
   - The capsule widens into a price capsule (≈420×120, cream with a sage hairline, or sage with cream text).
   - `RollNumber` rolls 0→499 (Fraunces), and "kr." slides in on [w:kroner].
3. **[w:n] Én gang.**
   - A small "1×" chip pops out under the price with a bounce.
   - "Én gang." as a small line.
4. **[w:intet] Intet abonnement.**
   - A small recurring "/md" suffix tries to attach to the price.
   - [w:abonnement] It is struck and drops away (gravity), and the price wobbles back to clean.
5. **[w:siden2] Siden er din.** The price capsule morphs into a mini phone silhouette (≈90×180) and a "Din" badge
   pops onto it. Keep it one object.
6. **[w:ikke] Ikke tilfreds?** The object tilts like a question (a 3D rotate wobble).
7. **[w:s] Så koster det ingenting.** It morphs back into the price, which rolls 499→0 ("0 kr.", fast roll).
8. **[w:nul] Nul risiko.**
   - An iOS `Toggle` (≈120 px), labelled "Risiko", appears.
   - It switches OFF with a bounce, sage → grey (or a shield check pops).
   - "Nul risiko." as a line.
9. **h3.** The toggle's knob slides out and becomes the capsule at x 760, and the hand-off follows.

### S4 · h3 – h4 (39.22 s): "Skal den på nettet? Vi sætter det hele op for dig. Fra 83 kroner om måneden. Domæne og e-mail er med. Fast pris. Også når du fornyer. Domænet i dit navn. Servere i Europa. Ingen binding."
1. **[w:skal] Skal den på nettet?**
   - The capsule rolls into a small dotted globe (≈260 px, sage dots on a sphere), rotating.
   - "på nettet?" as a line.
2. **[w:vi] Vi sætter det hele op for dig.** A progress ring around the globe fills 0→100% with a check at the end
   (one object).
3. **[w:fra] Fra 83 kroner om måneden.**
   - The globe compacts into the price capsule.
   - `RollNumber` 0→83, then "kr./md." [w:mneden].
   - A tiny note "faktureres årligt" (DM Sans 18, muted) under it.
4. **[w:domne] Domæne og e-mail er med.**
   - Two small chips pop out of the capsule left and right on arcs: "holmfysio.dk" and "@holmfysio.dk" (with globe
     and envelope icons).
   - Then they tuck back in.
5. **[w:fast] Fast pris.** A small sage lock snaps shut onto the price capsule (a shackle drop plus a bounce).
6. **[w:ogs] Også når du fornyer.** Beside the price, a year flips like a calendar 2027 → 2028 → 2029 while "83 kr."
   stays put.
7. **[w:domnet] Domænet i dit navn.** The capsule becomes the domain chip "holmfysio.dk", and a small "Ejer: dig" tag
   swings under it.
8. **[w:servere] Servere i Europa.**
   - The chip shrinks to a pin dropping onto a small dotted map of Europe (≈520 px wide, sage-tint dots), which
     appears around the pin. The pin pulses.
   - "Servere i Europa." as a line.
9. **[w:ingen3] Ingen binding.**
   - The map collapses into a two-link chain (sage outline).
   - [w:binding] The chain snaps apart and the halves bounce apart.
10. **h4.** One half becomes the capsule at x 760, and the hand-off follows.

### S5 · h4 – end (55.18 s): "Brug for hjælp? Et menneske, der forstår din forretning. Ingen kø. Ingen robotsvar. Creoble. Hjemmeside og hosting, samlet ét sted. Byg den. Se den. Så køber du. Byg din side gratis på creoble.dk."
1. **[w:brug] Brug for hjælp?** The capsule becomes a chat bubble (an iMessage shape, sage) with typing dots.
2. **[w:et] The human reply.**
   - A cream reply bubble from the other side: "Hej! Hvordan kan jeg hjælpe?", next to a small round avatar with
     the initial "C" in sage. No photo, no name.
   - [w:forstr] A small "Svarer nu" status in the Island-style pill above.
3. **[w:ingen4] Ingen kø.** A queue counter "Nr. 12 i kø" rolls down to nothing and vanishes (rolling numbers).
4. **[w:ingen5] Ingen robotsvar.** A tiny robot glyph tries to pop in and is flicked away (a spring out).
5. **[w:creoble3] Creoble.**
   - Everything collapses into the sage dot, which flies to the wordmark's full stop.
   - The wordmark "Creoble." (`Wordmark`, h ≈ 96) reveals letters right-to-left out of the dot, the dot landing with a
     bounce.
6. **[w:hjemmeside2] Hjemmeside og hosting, samlet ét sted.**
   - The wordmark slides up.
   - Two small pills "Hjemmeside" and "Hosting" glide together and merge (`Gooey`) into one capsule labelled
     "samlet ét sted".
7. **[w:byg] Byg den. Se den. Så køber du.** Three small steps in a row pop in on their words with bouncing icons:
   hammer, eye, check.
8. **[w:byg2] The call to action.**
   - Its label is `w:byg2`.
   - The row merges into one ink pill button "Byg din side gratis" (`PillButton`), with press and shine.
   - "creoble.dk" under it.
   - The wordmark stays above, small. Everything floats gently to the last frame: no still end.

## Sound
Each builder writes `../sound/cues_S<i>.json`: `[{"id": "...", "frame": <60fps global frame>, "db": -6, "pitch": 0, "note": "..."}]`.
- Put one UI sound on every visible event: pop, land, morph, tick, swipe, check.
- A frame is the picture event (`f(label) * 2` plus offsets, at 60 fps).
- Use ids from Karl's library only:
  - whooshes: gen-whoosh-short, gen-whoosh-medium, gen-whoosh-whip;
  - rises and impacts: gen-riser-1s, gen-swell, gen-impact-soft, gen-stamp;
  - taps: gen-tap, kenney-click-001, kenney-select-001, kenney-select-002;
  - ticks: gen-tick, kenney-tick-004;
  - pops and drops: gen-pop, kenney-drop-003;
  - appear and success: gen-appear, kenney-maximize-009, gen-chime, gen-success, gen-shimmer.

  Under the voice, keep them light (db −10 … −4).

## QC each builder runs (on its own span only; be quick: the machine has 4 CPUs shared by 5 builders)
```
cd /home/user/Video-s/films/creoble5/film
B=$(ls -d /opt/pw-browsers/chromium_headless_shell*/chrome-linux/headless_shell | head -1)
npx tsc --noEmit
npx remotion still src/index.ts Film out/s<i>_<frame>.jpg --frame=<60fps frame> --scale=0.25 --props='{"blurSamples":1,"audio":"none"}' --browser-executable=$B --log=error
npx remotion render src/index.ts Film out/s<i>.mp4 --frames=<a>-<b> --scale=0.5 --concurrency=1 --muted --props='{"blurSamples":1,"audio":"none"}' --browser-executable=$B --log=error
python3 /home/user/Video-s/skills/senior-motion-designer/library/scripts/motion_check.py out/s<i>.mp4 --profile
python3 /home/user/Video-s/films/creoble4/scripts/jitter_check.py out/s<i>.mp4
```
- **Stills:** about 8 frames across the span, joined into one contact sheet with PIL. Look at it once.
- **Motion:** report the median (target 7%) and that there are no still seconds.
- **Shake:** no SHAKE line.
- **Hand-offs:** check the first and last frames against `<Handoff>`.
