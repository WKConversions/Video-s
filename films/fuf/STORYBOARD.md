# FUF film: storyboard and build spec (v2: visual-led, ~7 % motion)

Client feedback on v1: "1080p" (it is 1920×1080; low-res photos were enlarged and looked soft), **more animation, a
7 % motion norm, more visualisation of the voice-over, sometimes visualisation only with no caption**. And then:
**"constant motion but no useless movement or sizing motion, don't make it childish by childish motion or visuals.
Still has to be very professional and in the style of the brand."**

## The rules every scene follows

- **Brand.** Charcoal `INK #2B2B2B`, cream `CREAM #F7F4EF`, taupe `TAUPE #B9A595` / `TAUPE_D #8C7765`.
  - Serif: `SERIF` = Bodoni Moda, with an italic word as the accent.
  - Small caps: `SANS` = Nunito Sans, letter-spaced 0.32em, via `Caps`.
  - Thin lines (1–2.5 px), small dots, generous space. It should read as editorial and high-end, like a private
    members' club.
- **Motion that says something.** Lines draw connections, people converge, routes fly into Málaga, a spread lays
  itself out, an endless card exchange is stopped, conversations run between people, one connection becomes a
  trajectory.
  - Ambient motion is allowed only as a slow photographic push or parallax, or a slow drift of a particle field.
  - **Not allowed:** bounce or overshoot, wobble, spinning, cartoon icons (light bulbs, handshakes, rockets,
    arrows), confetti, scaling things up and down for effect, text sliding about for its own sake. Ease with
    `ARRIVE` / `MOVE` / `SOFT` only.
- **Motion amount.** The finished film should measure about **7 %** median "frame in motion" with
  `python3 scripts/motion_check.py <mp4>`. That is the share of a 160×90 downscale whose pixels change by more than
  6/255 between frames.
  - Something meaningful must move in every second.
  - Fine 1 px lines barely register at 160×90. Motion that counts is area: photos pushing, fields of dots
    travelling, lines sweeping wide, light spreading.
- **Captions.** Visualisation leads. Some lines have **no caption at all** (specified below). Where there is one,
  it is a few serif words, never the full sentence as a block.
- **Photos.** Never show a photo larger than about 1.3× its pixel size. `hero-malaga.jpg` may fill the frame.

## Technical

- **Project:** `/home/user/Video-s/films/fuf/film` (Remotion 4, React 19), 1920×1080, 30 fps, 1275 frames (42.5 s).
  - Each scene exports a component `({ g }) => …`, where `g` is the frame. It can be fractional: motion blur
    renders sub-frames.
  - `src/Story.tsx` stacks the scenes in this order, later ones on top: Network (Open.tsx), Logo, Malaga,
    Gatherings, NoCards, Real, One, End.
  - **Every scene paints its own opaque full-frame background** inside its window and fades itself in and out.
  - The stage is 1920×1080 with (0, 0) at the top-left.
- **Kit (`src/scenes/brand.tsx`).** Import from `./brand`. **Don't edit brand.tsx.**
  - `k(g, pos, dur, ease = ARRIVE)`: progress 0→1 starting at `pos`, lasting `dur` seconds.
  - `s(label)`: a label's time in seconds.
  - `vis(g, inPos, outPos)`: the scene's presence (fade in at `inPos`, out at `outPos`).
  - `Para({ g, lines: [[pos, "text with *italic*"]], x, y, size, color, accent, out, center })`: serif lines
    that build word by word from `pos`.
  - `Caps({ t, x, y, o, color, size, center })` and `Photo({ src, x, y, w, h, a, zoom, pos })`.
  - Also: `rnd(i)` (deterministic 0..1), `lerp`, `clamp01`, the easings, `Img` and `staticFile`.
  - `measure(text, size, weight, ls, italic)`: a text's width in px.
- **Positions.** A position is a label (`"founders2"`), a label with **one** offset (`"founders2+0.3"`), or
  seconds as a string (`"12.5"`) or a number.
  - **Never two offsets** (`"x+0.2-0.1"` throws). Compute instead: `(s("x") + 0.1).toFixed(3)`.
  - No `Math.random` and no `Date`. Use `rnd(i)` and functions of `g`.
- **Labels (`src/clock.ts`, seconds):**
  - open 0, connections 2.26
  - but 3.38, ambitious 3.86, vision 5.38, easy 6.54
  - meet 7.7, future 7.86, unicorn 8.4, founders 8.92
  - an 10.02, networking 10.62, founders2 12.16, entrepreneurs 13.04, builders 13.96, investors 14.76,
    together 15.3, malaga 16.18
  - through 17.02, exclusive 17.18, meaningful 18.52, ideas 20.22, partnerships 21.62, opportunities 22.82
  - no 24.46, awkward 24.72, no2 25.9, endless 26.24, business 26.7
  - just 28.12, minds 28.54, real 29.98, connections2 31.36, matter 32.12
  - because 32.88, next 33.44, one 35.54, conversation 35.88
  - endcard 37.4, build 39.24, together2 40.04, rest 40.6, end 42.5
  - The full word timings are in `../vo/whisper_words.json`.
- **Assets (`public/img`).** Use them with `staticFile("img/…")`.

  | File | Size | What it shows |
  |---|---|---|
  | `hero-malaga.jpg` | 1817×866 | Málaga at sunset, a terrace, three people on the right, the cathedral |
  | `malaga-skyline-detail.jpg` | 1270×710 | Málaga skyline detail |
  | `c-terrace.jpg` | 578×742 | People with drinks on a rooftop, the cathedral behind |
  | `c-laptop.jpg` | 410×400 | Laptop showing the unicorn logo, coffee |
  | `c-palms.jpg` | 432×400 | Palms and the cathedral at sunset |
  | `c-bar.jpg` | 290×326 | People talking indoors |
  | `c-lounge.jpg` | 336×326 | People at a table talking, laptop |
  | `c-tower.jpg` | 198×326 | Cathedral tower |
  | `unicorn-ink.png`, `unicorn-cream.png` | 400×400 | The unicorn mark, transparent background, charcoal and cream versions |

  - New assets go only in `public/img/<scene>-*.{png,jpg}` or `src/data/<scene>-*.json`.
  - `../scripts/map_make.py` makes dot maps (read its header for usage).
- **Only edit your own scene file(s).** Never edit brand.tsx, clock.ts, Story.tsx, Film.tsx or another scene's file.
- **Verify.**
  - Typecheck: `cd /home/user/Video-s/films/fuf/film && ./node_modules/.bin/tsc --noEmit -p .`
  - Render stills of your own frames: `node scripts/stills.mjs 300,330,360 1` writes `out/test/f0300.png` and so
    on. Look at them with the Read tool; a contact sheet made with PIL is quicker.
  - **Don't delete `out/test`.** Other builders use it at the same time; use your own frame numbers.

## The scenes

**A · Open.tsx → `Network`.** 0 → meet+0.3.
- **"Great opportunities start with the right connections."** (0–3.3). **No caption.**
  - Charcoal. A network grows from one point on the left third. Nodes (small cream dots) appear outward in
    sequence, and fine taupe lines draw from each new node to one or two earlier ones.
  - Tiny light pulses travel along the edges.
  - **Frame 0 already shows it in motion**, with a few nodes placed and lines drawing.
  - By "connections" (2.26) the network spans the frame, and its edges warm to a brighter taupe for a beat.
- **"But finding ambitious people who share your vision isn't always easy."** (3.38–7.6).
  - The lines retract and the network loosens into a crowd: about 150–250 small grey dots drifting in different
    directions, like a busy square seen from above.
  - One taupe dot, "you", moves through it. A fine ring around it passes others; the dots it passes brighten
    briefly and dim again (no match). No ticks or crosses.
  - Caption: at most "isn't always *easy.*" (serif about 64) on 6.2–7.6, or none.
- **Export `crowdAt(g): { x: number; y: number }[]`**, the crowd dots' positions at frame `g`. The Logo scene
  starts its particles from them.

**B · Logo.tsx → `Logo`.** meet-0.2 → an+0.6. **"Meet Future Unicorn Founders."**
- On charcoal, the crowd dots (from `crowdAt(T.f("meet"))`) travel with `MOVE` and settle along the strokes of the
  unicorn mark.
  - Sample about 250 points from the alpha of `unicorn-cream.png` with a small Python script; save them to
    `src/data/logo-points.json`. Lay them out in frame px for a mark about 420 px tall left of centre.
- As they land, the real mark (`unicorn-cream.png`) resolves over them and the points fade.
- "Future *Unicorn* Founders" builds to its right in cream serif (Para lines on future / unicorn / founders), with a
  thin taupe rule between mark and words.
- Hand over to Málaga from an-0.15 (fade). Nothing bounces.

**C · Malaga.tsx → `Malaga`.** an-0.25 → through-0.1. **"An international networking community bringing founders,
entrepreneurs, builders and investors together in Málaga."**
- **10.0–15.3: the map.**
  - A charcoal dotted map of the Americas, the Atlantic, Europe and the Middle East (map_make dots), its dots in
    taupe at low opacity.
  - Fine taupe arcs fly from about 10 cities (New York, Toronto, São Paulo, London, Amsterdam, Paris, Berlin,
    Zurich, Stockholm, Lisbon, Dubai…) and converge on Málaga. They are staggered, each with a small light
    point travelling along it.
  - Málaga gets a fine ring that strengthens as the arcs land.
  - The four roles appear as small-caps labels beside an arriving arc on their words: FOUNDERS 12.16,
    ENTREPRENEURS 13.04, BUILDERS 13.96, INVESTORS 14.76. There is no headline.
  - The map layer pushes slowly toward Málaga throughout.
- **15.3–17.0: "together in Málaga".**
  - The map closes in on Málaga, and the hero photo opens from the Málaga point as a circular iris, then pushes
    slowly.
  - "Málaga" in serif (about 120), with "36.72° N · 4.42° W" in small caps.

**D · Gatherings.tsx → `Gatherings`.** through-0.2 → no-0.15. **"Through exclusive gatherings and meaningful
conversations, new ideas emerge, partnerships form, and opportunities grow."**
- **17.0–20.0.**
  - Cream. An editorial spread assembles: the photo cards (c-terrace, c-laptop, c-lounge, c-bar, c-palms, c-tower,
    each at 1.3× its pixel size or less) travel into a magazine grid along clean paths, staggered, each with a
    slow inner push.
  - At most one serif line: "Exclusive gatherings, *meaningful conversations.*"
- **20.2–24.0.** One fine line drawing per phrase, over or beside the spread, in ink or taupe. No icons.
  - "new ideas emerge" (20.22): fine lines from several people in the photos converge on one point, which
    brightens.
  - "partnerships form" (21.62): two separate paths meet and run on as one.
  - "opportunities grow" (22.82): one elegant rising line, like a refined financial chart with small ticks.
  - Each may carry a tiny italic caption, or none.

**E · NoCards.tsx → `NoCards`.** no-0.25 → just-0.1. **"No awkward networking. No endless business card exchanges."**
- Charcoal. Business cards (cream, small blank lines, no text) pass back and forth between two positions in an
  endless mechanical rhythm, and a stack grows.
- "No awkward networking." appears in cream serif (about 76) and a taupe strike draws through it; then "No endless
  business card exchanges." gets the same.
- At about 27.0 the exchange stops, and the stack fans and leaves the frame in one clean motion, leaving the
  charcoal empty. Not slapstick.

**F · Real.tsx → `Real`.** just-0.25 → because-0.1. **"Just ambitious minds, real conversations, and connections
that matter."**
- Cream. 6–8 circular portraits, cropped with PIL from faces in c-terrace, c-lounge, c-bar and hero-malaga. Save
  them as `public/img/real-av-*.jpg` and show them at 1.3× their crop or less. They are composed across the
  frame.
- "ambitious minds": they come into focus one by one (fade, a little blur clearing; no pop).
- "real conversations" (29.98): fine curved lines draw between pairs, with light points travelling both ways
  along them.
- "connections that matter" (31.36–32.1): three of the lines strengthen to `TAUPE_D`, and the rest fade.
- Captions: none, or small caps.

**G · One.tsx → `One`.** because-0.25 → endcard-0.1. **"Because the next big opportunity might start with one
conversation."**
- Charcoal. Two portraits or points, far apart, drift toward each other.
- At "one conversation" (35.54–35.88) one line connects them. From the joint, a fine line rises and extends
  across the frame as a long, confident upward trajectory, while a faint dot field slowly gains light.
- Caption: "*One* conversation." (serif about 96) on 35.5–37.3 only.
- Don't import anything from Open.tsx.

**H · End.tsx → `End`.** endcard-0.2 → end. **"Future Unicorn Founders. Build what's next, together."**
- Cream. The lockup:
  - the unicorn-ink.png mark, revealed top to bottom along its strokes;
  - "Future *Unicorn* Founders" (serif about 92);
  - a thin taupe rule;
  - "Build what's next, *together.*" (serif about 60);
  - the "Join the community" pill in ink;
  - "MÁLAGA · INTERNATIONAL" in small caps.
- Behind it, the opening's network draws again very faintly and slowly completes, closing the loop.
