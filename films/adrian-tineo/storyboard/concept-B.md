# Concept B: "The living page" (interface-led)

**Adrian Tineo** · 1920×1080 · 30 fps · 39.0 s = 1170 frames · VO at +0.50 s (first word f20, last word ends f1084) ·
sign-off f1084–1170. All times are film seconds; frame = round(s × 30). Every visual event lands 3–6 frames before its
word (the picture leads).

The film is the website coming alive, with new layouts built for the film's lines. Its actors are the site's own
components: the floating tag, the white card with its pale well, the eyebrow with the sage status dot, the two-tone
headline, the numbered row with its hairline, the dark button, the dark contact panel and the paper shell over the
ambient field. The site's hover states carry meaning. A lift means "this one". A tilted frame going flat means "put in
order". A button press means "act".

The story is told with the same objects in two states. The market's AI components arrive scattered and tilted on the
dark field and pile onto **your business**. Adrian's page rises and clears them away. His work builds, labels and
surrounds your business. The noise comes back once and is struck out. The single generic "AI" tag that survives becomes
"Practical AI" and clicks into your business. Your business then becomes the conversation, "What could AI do for your
business?", and the tag becomes the "Let's talk" button.

---

## 1. Beats and phrases

| # | Phrase | Start–end (s) | Frames | Key word(s) → frame |
|---|---|---|---|---|
| **B1 Hook / problem** | | **0.00–6.90** | **f0–207** | |
| P01 | AI is everywhere. | 0.68–2.14 | f20–64 | AI f20 · **everywhere f50** |
| P02 | But making it work for your business? | 2.70–4.12 | f81–124 | work f97 · **business f112** |
| P03 | That's where things get complicated. | 4.74–6.20 | f142–186 | things f157 · **complicated f169** |
| **B2 Meet Adrian** | | **6.90–10.56** | **f207–317** | |
| P04 | Meet Adrian Tineo, | 6.90–8.02 | f207–241 | Meet f207 · **Adrian f217** · Tineo f229 |
| P05 | your independent AI expert. | 8.30–10.00 | f249–300 | **independent f257** · expert f290 |
| **B3 What he does** | | **10.56–18.26** | **f317–548** | |
| P06 | From uncovering the right opportunities | 10.56–12.46 | f317–374 | uncovering f325 · right f347 · **opportunities f354** |
| P07 | to building real solutions, | 12.60–13.94 | f378–418 | **building f382** · solutions f402 |
| P08 | Adrian connects strategy, | 14.48–15.72 | f434–472 | **connects f446** · strategy f457 |
| P09 | engineering, | 16.04–16.56 | f481–497 | **engineering f481** |
| P10 | and execution. | 16.84–17.58 | f505–527 | **execution f512** |
| **B4 The services** | | **18.26–26.87** | **f548–806** | |
| P11 | Explore use cases. | 18.26–19.36 | f548–581 | **explore f548** · use f564 · cases f569 |
| P12 | Develop and integrate AI. | 19.90–21.38 | f597–642 | develop f597 · **integrate f618** · AI f634 |
| P13 | Evaluate performance. | 21.98–23.14 | f660–694 | evaluate f660 · **performance f678** |
| P14 | Bring expert leadership | 23.76–24.90 | f713–747 | bring f713 · **leadership f735** |
| P15 | directly into your team. | 25.02–26.22 | f751–787 | **into f769** · team f781 |
| **B5 The difference** | | **26.87–32.15** | **f806–964** | |
| P16 | No hype. | 26.87–27.31 | f806–819 | **hype f811** |
| P17 | No guesswork. | 27.69–28.31 | f831–849 | **guesswork f837** |
| P18 | Just practical AI, | 28.61–29.87 | f858–896 | **practical f868** · AI f886 |
| P19 | built around your business. | 30.13–31.47 | f904–944 | **built f904** · around f915 · business f933 |
| **B6 Call to action** | | **32.15–36.13** | **f964–1084** | |
| P20 | Ready to turn AI potential | 32.15–33.59 | f964–1008 | **ready f964** · potential f994 |
| P21 | into meaningful business impact? | 33.73–35.19 | f1012–1056 | into f1012 · business f1035 · **impact f1046** |
| P22 | Let's talk. | 35.69–36.13 | f1071–1084 | lets f1071 · **talk f1077** |
| **Sign-off** | (music only) | **36.13–39.00** | **f1084–1170** | |

There are 22 phrases and 6 beats. The gaps between sentences (0.5–0.7 s) are working holds: floats, the camera breath
and the tail of the last move.

---

## 2. Direction

### Thesis

> Adrian Tineo turns the noise of AI into a calm, working page built around your business. The film shows this with his
> own website's parts: the market's AI components pile onto your business, his page rises and puts things in order, his
> work builds and labels what your business needs, and the one AI that survives the hype clicks into place and becomes
> the button to talk.

**Allowed patterns** (named on purpose, so they are not tells):
- **The market's AI noise** in the opening, returning once on "No hype". These are generic labels set in the site's own
  components: a light button "Try AI ↗" and the tags "✳ AI-powered", "↗ New AI tool", "✳ AI assistant", led by one tag
  "✳ AI". They are shown as the noise around a business and never as Adrian's claims. Four of them are struck out on
  "hype".
- **"Your business"**: one white site card standing for the viewer's business. It has no invented company name, data or
  figures. Its well starts empty, and its footer holds an empty tag slot drawn with the hero SVG's own dashed hairline.
- **The site's 3D tilt** (its `.browser-frame` transform, rotateX 13° rotateY −16° rotateZ 3°) used for disorder, and
  **tilt → flat** (the site's own hover) used for order.
- **The site's hover states as meaning**: lift −12 px (6 px × 2) with a deeper shadow, image scale 1.06 → 1.00, the
  circle-link rotating 45° and turning dark, a button lift or press.
- **The hero sculpture rebuilt in its parts**. hero-intelligence.svg is split into its groups (ground shadow, dark-glass
  base slab, silver slab, orb, top slab, dashed connectors) so that it can be uncovered, built and exploded.
- **Numbered rows "01 Strategy / 02 Engineering / 03 Execution"**: the site's process-row component, labelled with the
  voice-over's own three words.
- **The four service cards and their sculptures**, with the site's copy verbatim (eyebrow, title, footer), shown one at
  a time as a deck. They later shrink into four floating tags that carry a thumbnail of their sculpture in the icon
  tile.
- **One strike mark** (an ink hairline) for "No hype". **Dashed hairlines turning solid** for "No guesswork". Both use
  the hero SVG's dash style, `2 7` at site scale (`4 12` at film scale).

Nothing else is invented: no clients, numbers, logos, testimonials or URL (`harvest/facts.md`).

### Thread object: the "Your business" card (and the AI tag that finally fits it)

**The thread is a white site card titled "Your business".** It is on screen from 2.3 s until it becomes the dark contact
panel at 32 s. It changes state with the story:

1. **P02** It rises onto the dark field. Its well is empty (only the soft ground shadow) and its footer slot is empty
   (a dashed outline).
2. **P02** The big tilted "AI" tag tries the slot and doesn't fit.
3. **P03** The noise piles onto it, dashed lines tangle, and the card tips on a 3D tilt.
4. **P04** Adrian's page rises behind it and the noise falls away. The card goes flat and moves aside: "you", next to
   Adrian.
5. **P06–P07** It comes forward in close-up. In its well the right opportunity (the chrome orb) is uncovered, and the
   hero sculpture is built around it, with the site's two tags: "A clear direction" and "A real-world advantage".
6. **P08–P10** The structure in its well explodes into three layers, connected and labelled 01 Strategy, 02 Engineering,
   03 Execution.
7. **P11–P15** It holds the left of the frame while Adrian's four services are dealt beside it.
8. **P19** It moves to the centre. "Practical AI" clicks into its slot, and the four services gather around it as
   floating tags.
9. **P20** It grows into the dark contact panel. Its own title "Your business" travels into the headline as "your
   business?".

**The payoff object is the "✳ AI" tag**, the first thing in the film:
- P01: it is generic AI.
- P02: it is too big and too tilted for the slot.
- P04: it falls away with the noise.
- P16: it comes back with the hype and is the one piece not struck out.
- P18: it goes flat and its label rolls to "Practical AI".
- P19: it fits the slot exactly.
- P21: it becomes the "Let's talk ↗" button.
- P22: it is pressed.
- Sign-off: the dark panel folds into it.

So the film starts on the word "AI" and ends on the button.

**The one accent: the sage status dot.** It first appears with "● INDEPENDENT AI CONSULTING" (P05). After that it is
Adrian's attention:
- it leaves his card and lands on the right spot in your business (P06);
- it runs down the connectors (P08);
- it becomes the dot of the contact eyebrow (P20) and of the sign-off eyebrow.

It marks at most one thing per phrase.

### Motion identity

- **Personality:** precise premium, calm. It is the site's own motion: no overshoot, no bounce, no glow, no scale from
  zero and no cursor. The site's hovers happen by themselves.
- **Signature curve: `EASE` = cubic-bezier(.22,1,.36,1)**, the site's only curve. It is used for about 80% of moves:
  every arrival, reveal, settle and line draw.
  - `MOVE` (.65,0,.35,1) is for heavy objects moving between two rest states: the business card's relocations, explode
    and restack, tilt → flat, layout transformations, and the panel growing and folding.
  - `DEPART` (.55,0,.9,.4) is for exits: drops and retractions, at 65–75% of the matching arrival's duration.
  - `INOUT` is for floats, the breath, the dot's run and the arc.
- **Duration palette (frames at 30 fps):**
  - quick, 6–10 f: strikes 8, label rolls 10, icon swaps 6, hover lifts 8–10, a press of 4 down and 6 back;
  - standard, 14–20 f: tags 18, sculpture parts 12–18, hairlines 18, leaders 14, explode 20, dot hops;
  - slow, 24–36 f: the site's reveal 26 f (= 0.85 s), card moves 26–30, card arrivals 24–36, shell rise 36, panel
    growth 32, panel fold 36.
- **Entrance pattern:**
  - Text and in-place elements use the site's reveal: opacity 0→1 and a rise of 44 px (22 px × 2) over 26 f on `EASE`,
    with siblings 3 f apart (the site's 80–100 ms).
  - Objects from outside the frame slide in on `EASE` with the film's 180° motion blur.
  - Everything else grows out of an object already on screen.
- **Floats:**
  - Sculptures use the site's 9 s float: −18 px and 1.5°, `INOUT`.
  - Tags use the site's 7 s float: −12 px.
  - Phases are offset so no two objects bob together.
- **Staging:** while the hero object moves, its siblings dim to 50–60% and come back as it settles.
- **Camera:** one slow breath for the whole film and nothing else. Scale 1.000 → 1.040 over 0–39 s (`INOUT`), plus a
  drift of x 6·sin(2πt/22) and y 4·sin(2πt/17). That stays under 10 px/s. There are no pans or zooms on transitions; the
  content moves.
- **Intensity by moment:**
  - Interface at work: rolls, strikes, presses and hovers, with 2–12 px of travel.
  - Storytelling: everything else.
  - Celebration, used twice and still without overshoot: the tag clicking into the slot (P19) and the button press
    (P22).

### Transition family (three, used throughout)

1. **Object continuity and layout transformation.** The card moves, scales, goes flat and gathers things around it. Row
   01 grows into card 01. The deck cards shrink into tags. The tag becomes the button.
2. **A mask out of an object.** The shell's top edge rises like a curtain. An iris grows out of the sage dot. The dark
   panel grows out of the business card and folds back into the button.
3. **Exit reveals.** The noise drops off the page. Struck pieces fall away. Rows and leaders retract to reveal the next
   state.

There are no crossfades between layouts and no camera moves between them.

### Colour-field plan

| Time | Field | Why |
|---|---|---|
| 0–6.9 s | the site's dark ambient field (130° gradient #090909 → #4B4B49 → #B0B0AA, blurred blobs drifting) | the noise lives outside Adrian's page |
| 6.9–32.0 s | the paper shell (#F4F4F2, 52 px corners, white hairline, deep soft shadow) over the ambient, which stays visible as a 54–64 px frame | his page: calm, bright, ordered |
| 32.0–36.4 s | the dark contact panel (#141413) inside the paper shell, grown out of the business card | the site's own invitation |
| 36.4–39.0 s | paper again (the panel folds into the dark button) | the bright, calm end |

Paper fills 70% of the film. The two dark stretches are the site's own dark surfaces, and each is entered and left
through an object.

### The cast (film-scale specs, kit components, tokens from `lib.tsx` C)

**AI tag (T0).** `Tag` with the dark tile and the asterisk icon, text "AI", size 2.2: font 50 px, tile 137 px, about
370×236. It tilts in 3D (perspective 1600) at rotateX 13°, rotateY −16°, rotateZ 3°.

**Noise pieces (H1–H4):**
- H1: `Button` light, "Try AI" with the arrow-up-right, size 1.3, tilt (10°, 18°, −4°).
- H2: `Tag` pale tile with the asterisk, "AI-powered", size 1.4, tilt (12°, −20°, 5°).
- H3: `Tag` pale tile with the arrow-up-right, "New AI tool", size 1.2, tilt (14°, 12°, 3°).
- H4: `Tag` dark tile with the asterisk, "AI assistant", size 1.5, tilt (8°, 16°, −6°).

**Business card (BC).** Card-local size 620×820 at scale 1.
- `Card`: C.white, 32 px corners, 2 px #fff border, 12 px padding, SH.card.
- `Well`: x12 y12, 596×520, 22 px corners, fill C.wellHero (#EAEAE7) with the hero SVG's radial gradient (#F8F8F8 →
  #EDEDED at 62% → #E3E3E3). On its floor sits the hero's ground shadow: an ellipse 330×52, #3B3B3B at 23%, blur 23.
- Title "Your business": Manrope 650, 56 px, −0.054 em, C.ink, at x 40, top y 560.
- Hairline: y 660, x 40–580, C.line, 2 px.
- **Slot**: a rounded rect x 40–360, y 690–790 (320×100), 28 px corners. Its stroke is #A3A3A3, 2 px, dash `4 12` (the
  hero's dashed line style). It has a plus icon (28 px, #A3A3A3) where a tag's tile would sit.
- The hero sculpture (HS) lives in the well (see below).

**Portrait card (PC).** The site's `.expert-visual`, 720×800, 40 px corners, well fill C.wellHero.
- `adrian-tineo.jpg`, grayscale(1) with multiply, cover, object-position 48% 30%.
- Inside label at top-left (x+36, y+40): `Eyebrow` "INDEPENDENT AI CONSULTING", 22 px, C.ink, with the sage `StatusDot`.
- Nameplate inside the bottom (inset 24): 672×120, rgba(255,255,255,.94), 22 px corners. "Adrian Tineo" in Manrope 600,
  44 px, C.ink, left at x+36. "PhD in Computer Science" in Manrope 500, 24 px, C.label, right at x−36.

**Check tag (CK).** `Tag` pale tile with the check icon, "Business-minded, hands-on", size 1.3, about 600×140.

**Hero sculpture (HS).** hero-intelligence.svg as inline SVG, split into these groups:
- G-shadow: the ground ellipse.
- G-base: the dark-glass slab at translate(400 556).
- G-mid: the silver slab at (400 442) with its inset and ellipses.
- G-orb: the circle r61 at (400 342), its highlight and its rim stroke.
- G-top: the slab at (400 198) with its glass and metal core.
- G-dash: the three dashed verticals `M218 257v155 M582 257v155 M400 143v160`.

It is drawn at 560×560 card-local, centred in the well. Its visible extent is about 340 × 472 card-local.

**Hero tags.**
- HT1: `Tag` pale tile with the arrow-up-right, "A clear direction", size 1.25.
- HT2: `Tag` dark tile with the asterisk, "A real-world advantage", size 1.25.

These are the site's two hero tags with their exact texts and glyphs.

**Rows (R1–R3).** The site's process step at film scale.
- A 2 px hairline, #D8D8D2, across x 1060–1760.
- The number "01" in Manrope 500, 22 px, C.num, at x 1060.
- The title in Manrope 650, 64 px, −0.035 em, C.ink, at x 1140.
- The row icon at x 1720, 40 px, stroke 1.6: ↗ for 01, ✳ for 02, ↗ for 03 (the site's own order).
- Pitch 200 px: hairlines at y 250, 450 and 650, plus a closing hairline at y 850.

**Leaders (L1–L3).** 2 px lines in C.rule (#C9C9C2) from each slab's right tip to (1040, the row's title centre).

**Service cards (S1–S4).** 760×880, centred at (1270, 545).
- `Card` with a `Well` of 736×470, 22 px corners, fill C.well.
- The service SVG without its bg rect, drawn at 736×613 (viewBox 600×500 × 1.227), centred and clipped to the well.
- The well number at (30, 30): Manrope 500, 20 px, C.num.
- Eyebrow: Manrope 700, 20 px, 0.2 em, C.label, at y 520.
- Title: Manrope 650, 60 px, −0.054 em, C.ink, two lines at line height 1.08, at y 560–690.
- Hairline at y 790.
- Footer text: Manrope 500, 22 px, C.desc, at y 830.
- The circle-link: a 72 px circle in C.chip with the arrow-up-right at 30 px, at (690, 830).

Copy, verbatim from the site:
- S1 "01" · FIND THE RIGHT OPPORTUNITY · "AI strategy / & direction" · "From possibility to a plan"
- S2 "02" · MAKE THE IDEA WORK · "AI development / & integration" · "From concept to capability"
- S3 "03" · KNOW WHAT WORKS · "Evaluation / & performance" · "From assumptions to evidence"
- S4 "04" · BRING YOUR PEOPLE WITH YOU · "Fractional AI / leadership" · "Expertise, when you need it"

**Contact panel (CP).**
- C.panel #141413, 40 px corners, final rect x 96–1824, y 86–994 (32 px of paper margin inside the shell).
- The site's faint arc: a circle r 620 centred at (1780, 640), stroke rgba(255,255,255,.06), 2 px.
- The site's contact symbol: arrow-up-right, 84 px, stroke #B4B4AA, at (1700, 190).
- Eyebrow "YOUR NEXT CHAPTER WITH AI": 22 px, 0.2 em, #A0A09A, with the sage dot, centred at (960, 250).
- Headline, centred, 104 px, 650, −0.054 em:
  - line 1 "What could AI do for" in C.onPanel, top y 330;
  - line 2 "your business?" in C.onPanel2 #AAA9A1, top y 442.
- Button: `Button` light, "Let's talk" with the arrow-up-right, size 1.1 (about 440×138), centred at (960, 760).

---

## 3. Phrase by phrase

Notation: (x, y) are frame-pixel centres in stage space. The camera breath is applied on top. "s" is scale. Card-local
coordinates are given at scale 1. Each phrase lists its **EVENT**, **COMPOSITION** (primary / secondary / detail),
**MOTION**, **CARRY** (what the next phrase grows out of) and **STILL** (the longest stretch of voice over an unchanged
picture).

### B1 · HOOK / PROBLEM: the noise and your business (f0–207, dark ambient field)

**Opening frame (f0).** The site's ambient field fills the frame (`Ambient`, drift 0 → 1 over the film, so the blobs
crawl about 2 px/s), and the camera breath is already moving. Nothing else is on screen. At f14 the first object starts.

#### P01 · "AI is everywhere." (f20–64)
- **EVENT:**
  - On "AI" (lead f14 → f40): the tag **T0 "✳ AI"** rises into frame at (800, 520) with the site's reveal: rise 44,
    fade, 26 f `EASE`. It is already in its 3D tilt and starts its 7 s float.
  - On "everywhere" (lead f44 → f68): four AI components slide in from the four frame edges. Each arrives already moving
    and decelerates over 24 f on `EASE`, staggered 3 f, with motion blur. Each fades in over its first 8 f.

| Piece | Starts | Enters from | Rest position | Scale and depth |
|---|---|---|---|---|
| H2 "✳ AI-powered" | f44 | the right | (1770, 250) | 1.0, cropped by the right edge by about 60 px |
| H1 "Try AI ↗" | f47 | the top-left | (330, 200) | 0.9, 1.5 px depth blur |
| H4 "✳ AI assistant" | f50 | the bottom-right | (1580, 880) | 1.0 |
| H3 "↗ New AI tool" | f53 | the bottom-left | (310, 905) | 0.9, 1.5 px depth blur |

- **COMPOSITION:** Primary: T0, the largest thing, left of centre. Secondary: the four pieces scattered to the corners,
  one cropped by the frame, all on different tilts. Detail: the drifting blobs. Five things, deliberately unordered: AI
  is everywhere and spills past the frame.
- **MOTION:** Arrival travel is 280–380 px (the 1.6–1.8× distance multiplier → 24 f). All five then float at 7 s with
  different phases.
- **CARRY:** T0 is the object. It will try your business next.
- **STILL:** 0.0 s.

#### P02 · "But making it work for your business?" (f81–124)
- **EVENT:**
  - On "But" (lead f70 → f106): **the business card BC rises from below the frame** to (1240, 540), s1.0, over 36 f on
    `EASE` (heavy, 970 px). Its well is empty, with only the ground shadow, and its dashed slot sits in the footer. H4 is
    in its way and slides aside to (1700, 960) between f80 and f98 (18 f `EASE`, a reaction).
  - On "work" (lead f92 → f112): **T0 travels to the slot and doesn't fit**, 20 f on `EASE`. It goes from (800, 520) to
    a hover at (1120, 880), and its tilt worsens to (16°, 24°, −9°). It is twice the slot's height (236 vs 100) and
    sits crooked across it, sticking out of the card's edge.
  - On "business" (lead f108 → f134): the card's title **"Your business"** reveals: rise 44, 26 f `EASE`.
- **COMPOSITION:** Primary: BC (620×820, card x 930–1550, y 130–950), right of centre. Secondary: T0 crooked over the
  slot (slot at frame (1130, 870)). Detail: H1 to H4 at the edges.
- **MOTION:** The card's rise is the dominant move (about 25% of the frame). T0's short move overlaps its end. The
  title's reveal is the label.
- **CARRY:** The pieces at the edges are the objects. They go for the card next.
- **STILL:** 0.3 s (f112–124, while the title rises).

#### P03 · "That's where things get complicated." (f142–186)
- **EVENT:**
  - On "That's / things" (lead f138 → f162): **the four pieces converge on the card and pile up**, 24 f on `EASE`,
    staggered 3 f in the order H2, H1, H4, H3. They land crooked over the slot and the card's lower half, overlapping T0
    and each other:

| Piece | Lands at | Tilt (rotZ) |
|---|---|---|
| H1 | (1060, 800) | +12° |
| H2 | (1330, 850) | −8° |
| H3 | (980, 960) | +6° |
| H4 | (1260, 975) | −14° |

  - On "complicated" (lead f165): **four dashed lines tangle**. They draw from each piece's centre to the slot over 14 f
    on `EASE`, staggered 2 f. They are cubic Béziers whose control points cross: #8A8A84, 2.5 px, dash `4 12`.
  - Also on "complicated": **the card tips back on a 3D tilt** (rotateX 8°, rotateY −12°, rotateZ −2°) over 24 f on
    `MOVE` (f165–189). The pile and the lines are children of its plane and tip with it.
- **COMPOSITION:** Primary: the buried card, whose clean empty well still shows above the pile. Secondary: the pile with
  its tangle, a single clump. Three visual groups: the card, the pile and the lines.
- **MOTION:** The converging pile is the big move. The tilt is slow and heavy.
- **CARRY:** The pile is the object. On "Meet" it falls off the page.
- **STILL:** 0.4 s (f189–199, the tilt settling under the voice's tail; the floats keep going).

### B2 · MEET ADRIAN: his page rises (f199–317)

#### P04 · "Meet Adrian Tineo," (f207–241)
- **EVENT:**
  - On "Meet" (lead f199):
    - **The noise falls away.** T0 and H1 to H4 leave the card's plane and drop 520–640 px down and out of the frame.
      Each rotates a further ±6° on `DEPART` over 12–16 f, staggered 2 f (T0 at f199, then H1, H2, H3, H4). Each fades
      only in its last 4 f, as it crosses the bottom edge.
    - The dashed lines retract into the slot over 8 f on `DEPART`.
    - **The paper shell rises from below the frame like a curtain**: x 64, w 1792, h 972, 52 px corners. Its top edge
      sweeps from y 1100 to y 54 over 36 f on `EASE` (f203–239). Z order: ambient < noise < shell < BC.
    - **BC goes flat**: tilt → 0 over 24 f on `MOVE` (f203–227). That is the site's tilted frame straightening on
      hover. BC also slides left to (560, 600) and scales 1.0 → 0.82 over 30 f on `MOVE` (f209–239).
  - **The portrait card PC rides up with the page.** It is part of the shell's content, its well at (1300, 590) with
    x 940–1660 and y 190–990.
    - On "Adrian" (lead f213 → f239): **his B&W photo develops in its well** (opacity 0→1 over 16 f) and settles from
      scale 1.06 to 1.00 over 60 f on `EASE` (the site's image hover, reversed).
    - On "Tineo" (lead f225 → f251): **the nameplate** "Adrian Tineo · PhD in Computer Science" rises 30 px inside the
      photo and fades in over 26 f on `EASE`.
- **COMPOSITION:** Primary: PC, the largest thing and a person. Secondary: BC on the left (508×672), flat and empty. Detail:
  the shell's edge and the ambient margins. Split left and right: you and Adrian.
- **MOTION:** The rising shell is the one big move, a full-frame mask out of the site's own page. BC's straightening is
  the "order" signal.
- **CARRY:** The photo's label space is the object: his eyebrow arrives there.
- **STILL:** 0.0 s.

#### P05 · "your independent AI expert." (f249–300)
- **EVENT:**
  - On "independent" (lead f251): inside the photo, top-left at (976, 230), **the sage status dot appears**. It scales
    0.6 → 1 and fades in over 12 f on `EASE` (the film's first touch of the accent). **"INDEPENDENT AI CONSULTING"**
    reveals beside it at f254–280 (26 f).
  - On "expert" (lead f284 → f308): **CK "✓ Business-minded, hands-on"** slides in from 120 px left with a fade over
    24 f on `EASE`. It lands at (1050, 720), overlapping the photo's left edge and BC's right edge, the way the site's
    hero tags overlap the art. Then it starts its 7 s float.
- **COMPOSITION:** Primary: PC with the nameplate. Secondary: CK bridging the two cards. Detail: the eyebrow. Four
  things.
- **MOTION:** Small, calm arrivals. The photo's scale settle carries through the hold.
- **CARRY:** The sage dot is the object. It leaves his card and goes to work in your business.
- **STILL:** 0.9 s (f257–284 between the eyebrow and the tag; the photo is still settling).

### B3 · WHAT HE DOES: from opportunity to a built, connected solution (f311–548)

#### P06 · "From uncovering the right opportunities" (f317–374)
- **EVENT:**
  - Lead f311: **the sage dot detaches from the eyebrow.** Then PC (with its nameplate and eyebrow text) and CK exit
    right: +560 px on `DEPART` over 16 f, CK at f311 and PC at f314.
  - **BC comes forward in close-up.** Over 28 f on `MOVE` (f315–343) it goes to scale 1.35 with its well centred at
    (820, 470), which puts the card centre at (820, 656). The card spans x 402–1238 and y 103–1209. The shell's bottom
    edge crops its footer; the title still shows at y 859–940.
  - On "uncovering → right" (f317–347): **the dot searches**. It arcs over the well to (690, 360) between f317 and f333
    (`EASE`), pauses 2 f, then moves to the well centre (820, 470) between f335 and f347 (`EASE`). It lands on "right".
  - On "opportunities" (lead f350 → f368): **an iris grows out of the dot**: a circular mask from r 0 to r 150 over 18 f
    on `EASE`. It uncovers **the chrome orb**, shown at 1.7× its sculpture size (r 104). The iris rim is a C.line
    hairline that fades as it opens. The dot dissolves into the orb's highlight between f362 and f368.
  - **HT1 "↗ A clear direction"** slides from 100 px left onto the well's top-left edge at (470, 230) over 18 f on
    `EASE` (f356–374), then floats.
- **COMPOSITION:** Primary: the orb in the big pale well, a close shot. Secondary: HT1. Detail: the card's title, low in
  the frame. The empty right third of the frame is the space the rows will need.
- **MOTION:** The card's push-forward is content, not camera. The dot's search is the readable action.
- **CARRY:** The orb is the object. The structure is built around it.
- **STILL:** 0.0 s.

#### P07 · "to building real solutions," (f378–418)
- **EVENT:**
  - On "building" (lead f376): **the hero sculpture builds around the orb.**
    - The orb shrinks from r 104 to its place in the sculpture (r 58 on frame) over 20 f on `MOVE`.
    - G-base rises from below the well floor (masked by the well) to its place: 160 px over 18 f on `EASE`
      (f376–394).
    - G-mid rises 120 px (f380–398).
    - G-top descends 140 px from above the well's top edge (f385–403).
    - The ground shadow fades in (f380–400).
    - G-dash draws its three dashed verticals by stroke-dashoffset over 14 f (f396–410).
  - On "solutions" (lead f398 → f416): **HT2 "✳ A real-world advantage"** slides from 100 px right onto the well's
    bottom-right edge at (1150, 760), 18 f `EASE`.
  - The well now holds the site's hero art (sculpture and two tags) inside "Your business".
- **COMPOSITION:** Primary: the sculpture, about 460×640 on frame. Secondary: the two tags at opposite corners. Detail:
  the title.
- **MOTION:** Three layered, staggered placements with soft settles, then the 9 s float.
- **CARRY:** The sculpture's three layers are the object. They come apart and get named.
- **STILL:** 0.2 s.

#### P08 · "Adrian connects strategy," (f434–472)
- **EVENT:**
  - Lead f430: HT1 and HT2 slide 40 px outward and fade over 10 f on `DEPART`. **BC eases back to scale 1.0 at
    (620, 540)** over 26 f on `MOVE` (f430–456). The card spans x 310–930 and y 130–950; the well centre is (620, 402).
  - On "connects" (lead f442 → f462):
    - **The sculpture explodes into three layers** over 20 f on `MOVE`. The SVG goes from 560 to 480 card-local, G-top
      moves −50 and G-base +40.
    - The dashed connectors stretch to bridge the gaps.
    - **The sage dot re-emerges from the orb**, runs up to G-top, then **runs down the central connector to G-base**
      over 24 f on `INOUT` (f446–470). The dot itself makes the connection.
  - On "strategy" (lead f453):
    - **Row 01 grows out of the top layer.** Leader L1 draws from G-top's right tip (761, 228) to (1040, 312) over 14 f
      on `EASE` (f453–467).
    - Row 01's hairline draws from its left end across x 1060 → 1760 at y 250 over 18 f.
    - "01" and **"Strategy"** reveal: rise 44, 26 f (f457–483). The ↗ icon fades in with them.
- **COMPOSITION:** Primary: the exploded three-layer structure in the card's well. Secondary: row 01 on the right.
  Asymmetric: the diagram on the left, labels on the right.
- **MOTION:** The explode and the dot's run (the verb), then the label.
- **CARRY:** The middle layer is the object for row 02.
- **STILL:** 0.0 s.

#### P09 · "engineering," (f481–497)
- **EVENT:** On "engineering" (lead f477): **row 02** (hairline at y 450, "02", **"Engineering"**, the ✳ icon) grows out
  of G-mid. Leader L2 runs from (761, 424) to (1040, 512). The timings match row 01.
- **COMPOSITION:** As before, with two labelled layers.
- **CARRY:** The base layer is the object for row 03.
- **STILL:** 0.0 s.

#### P10 · "and execution." (f505–527)
- **EVENT:** On "execution" (lead f508): **row 03** (hairline at y 650, "03", **"Execution"**, the ↗ icon) grows out of
  G-base. Leader L3 runs from (761, 533) to (1040, 712). The closing hairline at y 850 draws across between f514 and
  f532. The diagram is now complete: one structure, three connected layers, three names.
- **COMPOSITION:** Primary: the labelled diagram. Six components, but they read as one diagram.
- **CARRY:** Row 01 is the object. It grows into the first service card.
- **STILL:** 0.0 s.

### B4 · THE SERVICES: a deck dealt beside your business (f530–806)

#### P11 · "Explore use cases." (f548–581)
- **EVENT:** The transition comes in waves.
  - f530: rows 02 and 03 retract. Their text rises −20 and fades, and their hairlines scaleX → 0 toward the right, over
    10 f on `DEPART`. All leaders retract into the slabs.
  - f530–548: the sculpture restacks (18 f `MOVE`).
  - f536–564: **BC moves to the left of the frame**, to (400, 540) at s0.72 (spanning x 177–623, y 245–835), over 28 f on
    `MOVE`.
  - On "Explore" (lead f540 → f566): **row 01 grows into service card S1.**
    - Over 26 f on `MOVE`, a white rounded rect grows from row 01's box (x 1060–1760, y 250–450, 0 px corners) to the
      card (x 890–1650, y 105–985, 32 px corners).
    - "Strategy" fades out in 6 f.
    - **"01" travels into the well's top-left (932, 147)**.
    - The well fades in (f548–562).
    - The eyebrow "FIND THE RIGHT OPPORTUNITY" and the title "AI strategy & direction" reveal over 26 f, 3 f apart
      (f556–585). The footer follows at f562.
  - On "use cases" (lead f560):
    - **The four chrome cubes rise one by one**, each from 40 px below with a fade, 12 f on `EASE`, starting at f560,
      f563, f566 and f569.
    - The dashed step line draws (f566–584).
    - **The black cube descends onto the last cube** (f574–590, 16 f `EASE`). That is the site's own picture of
      finding the right opportunity, acted step by step.
- **COMPOSITION:** Primary: S1 on the right (760×880). Secondary: BC on the left holding the hero sculpture. Two big
  things.
- **CARRY:** S1 is the object. The next card is dealt onto it.
- **STILL:** 0.0 s.

#### P12 · "Develop and integrate AI." (f597–642)
- **EVENT:**
  - On "Develop" (lead f589 → f613): **S2 is dealt onto the deck.** It comes from (1700, 545) at opacity 0 to (1270, 545),
    24 f on `EASE`, with the fade over its first 10 f and motion blur. **S1 steps back** over 18 f on `MOVE`: scale 0.95,
    y −30, content dimmed to 45%. Only its top edge shows above S2.
  - S2's plates arrive spread apart (G-black −70, G-mid 0, G-low +60 in SVG units).
  - On "integrate" (lead f614): **the plates close into one tight stack** over 16 f on `MOVE`, and the dashed verticals
    shorten with them.
  - On "AI" (lead f630): **the black plate's metal core** (the light square and its inset outline) fades in over 10 f.
    This is the AI inside, integrated.
- **COMPOSITION:** As before, with a stack of two.
- **CARRY:** The deck is the object.
- **STILL:** 0.0 s.

#### P13 · "Evaluate performance." (f660–694)
- **EVENT:**
  - On "Evaluate" (lead f652 → f676): **S3 is dealt.** S1 steps to scale 0.90 at y −60, and S2 to 0.95 at y −30.
  - On "performance" (lead f674): **the four chrome bars grow** from the black disc, height 0 → full, 18 f on `EASE`,
    starting at f674, f677, f680 and f683. That is evaluation as evidence.
- **CARRY:** The deck.
- **STILL:** 0.0 s.

#### P14 · "Bring expert leadership" (f713–747)
- **EVENT:**
  - On "Bring" (lead f705 → f729): **S4 is dealt** and the stack steps again: S1 at 0.85 (y −90), S2 at 0.90, S3 at 0.95.
    S4's two chrome rings sit apart (±40 SVG units). The black ring is missing.
  - On "leadership" (lead f731 → f749): **the black ring rises into the well from below its floor** and hovers above the
    gap between the chrome rings, 18 f `EASE`.
- **COMPOSITION:** Primary: S4. The stack of four now shows Adrian's whole offer. Secondary: BC.
- **CARRY:** The black ring is the object.
- **STILL:** 0.0 s.

#### P15 · "directly into your team." (f751–787)
- **EVENT:**
  - On "into" (lead f765 → f781): **the black ring drops into the gap and links the two chrome rings** over 16 f on
    `MOVE`. The chrome rings slide in ±40 → 0. At f781 the site SVG's interleave arcs (the chrome arc over the black, and
    the black over the right chrome) switch on over 2 f, while the motion is at rest. The expert is now part of the
    chain.
  - On "team" (lead f779 → f789): **S4 lifts −12 px** with a deeper shadow, and **its circle-link rotates 45° and turns
    dark** (C.btn), the site's hover, over 10 f on `EASE`.
- **CARRY:** The edge of the frame is the object. The noise comes back over it.
- **STILL:** 0.2 s.

### B5 · THE DIFFERENCE: the hype struck out, the one AI made practical (f790–964)

#### P16 · "No hype." (f806–819)
- **EVENT:**
  - Lead f790 → f806: **the noise comes back up from below the frame**, where it fell at P04. H1 to H4 come first,
    16 f on `EASE` with motion blur, 2 f apart; T0 follows at f794–810.
  - They take their old tilts at H1 (560, 300), H2 (1500, 230), H3 (360, 880), H4 (1420, 900) and T0 (960, 540), at
    size 2.2.
  - BC and the deck dim to 60% (staging).
  - On "hype" (lead f807): **an ink strike draws through each of the four hype labels**: C.ink, 4 px, round caps, left
    to right across the text, 8 f on `EASE`, staggered 2 f.
  - f817–831: **the four struck pieces fall away**, 600 px down on `DEPART` over 14 f, staggered 2 f. T0 is not struck.
- **COMPOSITION:** For 0.3 s the frame is crowded. Then four things: BC, the deck, T0 and the falling pieces.
- **CARRY:** T0 is the object.
- **STILL:** 0.0 s.

#### P17 · "No guesswork." (f831–849)
- **EVENT:**
  - Lead f824 → f836: **three dashed curves wander out of T0** toward BC's slot at frame (321, 778). They are Béziers
    with crossing control points in #8A8A84, dash `4 12`, drawing over 12 f on `EASE`. These are the guesses.
  - On "guesswork" (lead f833 → f849): **the three curves pull taut and merge into one straight, solid line** from T0 to
    the slot, over 16 f on `MOVE`. The control points go to the straight segment, and the dash gap goes 12 → 0, C.ink at
    50%, 2 px. The site's own footer for evaluation is "From assumptions to evidence".
- **COMPOSITION:** Primary: T0. Secondary: the line leading to BC. Detail: the dimmed deck.
- **CARRY:** The line is the object. It is the path T0 will take.
- **STILL:** 0.0 s.

#### P18 · "Just practical AI," (f858–896)
- **EVENT:**
  - On "practical" (lead f864 → f880): **T0 goes flat**: tilt → 0 over 16 f on `MOVE`, the site's straightening hover.
    **Its label rolls "AI" → "Practical AI"** in a slot mask over 10 f (f866–876): the old word rises out and the new one
    rises in. The tag widens 370 → 600 over the same frames, and the ✳ tile stays.
  - On "AI" (lead f882 → f890): T0 lifts −12 px (hover) over 8 f on `EASE`, ready to go.
- **COMPOSITION:** Primary: "✳ Practical AI", large, flat and readable (50 px type). Secondary: the line to BC. BC and the
  deck are still dimmed.
- **CARRY:** T0 and the line.
- **STILL:** 0.3 s.

#### P19 · "built around your business." (f904–944)
- **EVENT:**
  - On "built" (lead f900 → f924): **T0 travels along the line into the slot and fits exactly**, 24 f on `EASE`. It
    shrinks to the slot's 320×100 in card space, and the line is consumed behind it. At f924 it sits flush, and the
    dashed outline fades under it over 6 f. *Click.*
  - On "around" (lead f911 → f941), **a layout transformation** over 30 f on `MOVE`, staggered 2 f:
    - **BC moves to (900, 540) at s0.95** (spanning x 606–1195, y 151–930) and undims.
    - **The four deck cards shrink into four floating tags around it.** Each card's content fades in 6 f, its white rect
      morphs into the tag pill, and its sculpture scales down into the tag's pale icon tile as an 81 px thumbnail
      (multiply).
    - The labels reveal over 8 f once each tag lands, in the site's hero-tag style (size 1.3, overlapping BC's edges in
      a zig-zag):

| Tag | Label | Position |
|---|---|---|
| 01 | AI strategy & direction | (600, 290) |
| 02 | AI development & integration | (1290, 400) |
| 03 | Evaluation & performance | (560, 690) |
| 04 | Fractional AI leadership | (1250, 820) |

  - On "business" (lead f929 → f939): **BC lifts −12 px** with a deeper shadow (hover): the centre of attention.
- **COMPOSITION:** Primary: BC, with the hero sculpture in its well and "Practical AI" in its slot. Secondary: the four
  service tags floating around it, asymmetric like the site's hero art. Medium distance.
- **CARRY:** BC is the object. It becomes the conversation.
- **STILL:** 0.1 s.

### B6 · CALL TO ACTION: your business becomes the conversation (f950–1084)

#### P20 · "Ready to turn AI potential" (f964–1008)
- **EVENT:**
  - Lead f950 → f962: the four service tags drift 20 px into BC and fade over 12 f on `DEPART`. They gather into your
    business.
  - On "Ready" (lead f958 → f990): **BC grows into the dark contact panel** over 32 f on `MOVE`.
    - Its rect goes from x 606–1195, y 151–930 to x 96–1824, y 86–994, and its corners from 30 to 40 px.
    - Its fill goes white → C.panel over 14 f (f958–972).
    - The well and the hero sculpture fade out over 12 f (f958–970).
    - **Its title "Your business" travels into the headline's line 2** at (960, 498), growing to 104 px and turning
      C.onPanel2. The "Y" swaps to "y" in a 4 f slot mask at f975.
    - **T0 ("✳ Practical AI") rides from the slot to (960, 760)** and grows to button scale.
    - The arc starts drawing (see P21).
  - Lead f976 → f1002: **the sage dot glides out of the sculpture's place** to the eyebrow position, and "YOUR NEXT
    CHAPTER WITH AI" reveals beside it (26 f).
  - On "potential" (lead f990 → f1016): **line 1 "What could AI do for"** reveals above in C.onPanel: rise 44, 26 f.
- **COMPOSITION:** Centred. Primary: the headline (104 px). Secondary: the tag waiting below. Detail: the eyebrow, the arc
  and the ambient margins. The site's contact panel.
- **CARRY:** The headline's open end ("your business" with no "?" yet) and T0.
- **STILL:** 0.0 s.

#### P21 · "into meaningful business impact?" (f1012–1056)
- **EVENT:**
  - On "into" (f1012–1052): **the faint arc draws** around the right of the panel, stroke-dashoffset over 40 f on `INOUT`.
    That is the site's arc, acting the "turn".
  - On "meaningful" (lead f1016 → f1034): **the site's contact symbol ↗** reveals top-right at (1700, 190).
  - On "business" (lead f1031 → f1039): **the "?" rises in** after "your business". The question is complete: the
    site's own CTA, "What could AI do for your business?".
  - On "impact" (lead f1042 → f1056): **T0 becomes the button.** Over 14 f on `EASE`:
    - the pill reshapes to the light button (about 440×138, 27.5 px corners);
    - the dark ✳ tile shrinks and fades;
    - the arrow-up-right fades in at the right;
    - the label rolls "Practical AI" → "Let's talk" (10 f slot roll, f1044–1054).
- **COMPOSITION:** As before, now with the action in place: four things.
- **CARRY:** The button is the object.
- **STILL:** 0.4 s.

#### P22 · "Let's talk." (f1071–1084)
- **EVENT:** **The button is pressed on "talk".**
  - f1071–1077: hover lift −8 px (6 f `EASE`).
  - f1077–1081: press +4 px, fill → #E3E7E3 (the site's `.button-light:hover`), 4 f.
  - f1081–1087: release (6 f `EASE`). *Click.*
- **COMPOSITION:** As before.
- **CARRY:** The button is the object. The panel folds into it.
- **STILL:** 0.0 s.

### SIGN-OFF (f1084–1170): the panel folds into the button and the brand arrives

- **f1086–1122: the dark panel folds into the button** over 36 f on `MOVE`.
  - Its rect shrinks onto the button's rect (x 740–1180, y 691–829) and its corners go 40 → 27.5 px. Its contents
    (headline, eyebrow text, arc, symbol) don't move: they are clipped by the shrinking rect and fade out by f1104, so
    nothing is squeezed on screen.
  - Between f1100 and f1118 the button's white fill fades away, so the arriving panel becomes the fill. The label and
    arrow turn #111 → #FFF, and the panel colour settles from #141413 to C.btn #171716 with its C.btnEdge rim.
  - Result: the site's own dark "Let's talk ↗" button on paper.
- **f1086–1112: the sage dot leaves the contact eyebrow** before the fold reaches it. It glides (26 f `EASE`) to the
  sign-off eyebrow's dot position at (675, 300). This is the only thing that travels.
- **f1104–1130:** "INDEPENDENT AI CONSULTING" reveals beside the dot, Eyebrow 24 px C.ink, centred line at (960, 300).
- **f1110–1136:** the **wordmark "Adrian Tineo."** (`Wordmark`, 150 px, weight 800, −0.066 em) reveals at (960, 430):
  rise 44, 26 f `EASE`.
- **f1118–1144:** the tagline in the site's two-tone headline, on one line, 64 px: "AI expertise." in C.ink and
  "Business impact." in C.grey2, at (960, 590). It is the site's hero headline.
- **f1144–1170:** hold. Only the camera breath moves, plus the ambient's slow crawl in the margins.

**Final frame:** the paper shell over the dark ambient field. Centred:
1. ● INDEPENDENT AI CONSULTING
2. **Adrian Tineo.**
3. AI expertise. *Business impact.*
4. the dark [ Let's talk ↗ ] button

No URL, no other mark.

---

## 4. Continuity table

| Object | Enters (frame, how) | Transforms | Leaves (frame, how) |
|---|---|---|---|
| Ambient field | f0, already there | drifts all film; visible as the shell's margins after f239 | stays to the end |
| T0 "✳ AI" tag | f14, the site's reveal | f92 tries the slot (doesn't fit) · f138 buried in the pile | f199 falls off the page |
| T0 (return) | f794, rises from below | f864 goes flat, "AI" → "Practical AI" · f900 into the slot (fits) · f958 rides to the button spot · f1042 → light button "Let's talk ↗" · f1077 pressed · f1086 the panel folds into it → dark button | stays to the end (the final button) |
| H1–H4 noise | f44–53, slide in from the four edges | f138 pile onto BC · f165 tangle | f199 fall off the page |
| H1–H4 (return) | f790, rise from below | f807 struck out | f817 fall away |
| Dashed tangle | f165, grows out of the pile pieces | tilts with BC | f199 retracts into the slot |
| Business card BC | f70, rises from below | f112 title · f165 tips on a tilt · f203 goes flat, moves left (s0.82) · f315 close-up (s1.35), orb uncovered, sculpture built · f430 s1.0, diagram · f536 left (s0.72) · f911 centre (s0.95), tags around · f958 grows into the contact panel | f1086–1122 the panel folds into the button |
| Slot (in BC) | f70, with BC | f92 T0 doesn't fit · f924 T0 fits, outline fades | hidden under T0 |
| Shell (paper page) | f203, rises from below like a curtain | the stage for f239 onward | stays (the end frame) |
| Portrait card PC | f203, rides up with the shell | f213 photo develops · f225 nameplate · f251 eyebrow + dot | f314 exits right |
| Check tag CK | f284, slides from the left | floats | f311 exits right |
| Sage dot | f251, with the eyebrow (scale 0.6 → 1) | f317 searches the well · f350 iris → becomes the orb's highlight · f446 runs down the connectors · rides in the sculpture · f976 → contact eyebrow dot · f1086 → sign-off eyebrow dot | stays to the end |
| Orb | f350, the iris out of the dot | f376 shrinks into the sculpture | part of HS |
| Hero sculpture HS (base, mid, top, dashes) | f376–410, built in BC's well | f442 explodes (3 layers) · f530 restacks · rides with BC | f958–970 fades as BC turns into the panel |
| HT1 / HT2 hero tags | f356 / f398, slide onto the well's edges | float | f430 slide out |
| Rows 01–03 + leaders | f453 / f477 / f508, grow out of the slabs | — | f530 rows 02 and 03 retract; row 01 → S1 |
| S1 | f540, grows out of row 01 | f560 cubes step up · stacks back f589 / f652 / f705 | f911 shrinks into tag 01 |
| S2 / S3 / S4 | f589 / f652 / f705, dealt from the right | plates integrate f614 · bars grow f674 · black ring rises f731, links f765 · S4 hovers f779 | f911 shrink into tags 02–04 |
| Service tags 01–04 | f911, out of the deck cards | float around BC | f950 drift into BC |
| Guess lines → line | f824, grow out of T0 | f833 straighten, dashed → solid | f900 consumed by T0 |
| Contact panel CP | f958, out of BC | arc f1012 · symbol f1016 · "?" f1031 | f1086 folds into the button |
| Headline | line 2 = BC's title (f958) · line 1 f990 reveal | "?" f1031 | f1086–1104 clipped by the fold |
| Eyebrow, wordmark, tagline (sign-off) | f1104 / f1110 / f1118, the site's reveal | — | the end |

Reading it top to bottom, every entrance is either the first frame or an arrival from outside the frame, and every
other change grows out of something already on screen. Every exit names what it hands to.

---

## 5. Runner-ups (rejected, and why)

| Beat | Chosen | Runner-up | Why it lost |
|---|---|---|---|
| B1 Hook | Five AI components on tilted planes, scattered and cropped by the frame, piling onto "Your business" | A two-tone headline "AI is everywhere." building word by word, with "everywhere" repeated in tags | Subtitles the voice; nothing shows the problem of fitting AI into a business |
| B1 (alt) | (as above) | A wall of 20 small AI tags tiling the dark field | Busy (the K.B lesson), unreadable at phone size, a tiled-pattern AI tell |
| B2 Meet | The paper page rises like a curtain and clears the noise; his B&W photo develops in the site's portrait card; eyebrow and check tag | The wordmark "Adrian Tineo." building huge in the centre, then the photo | A title card mid-film; less human; the page rising is the stronger "order arrives" moment |
| B3 Opportunity → solution | The dot searches your business's well and an iris uncovers the orb; the hero sculpture is built around it with the site's two hero tags | A hairline axis "Opportunity ——— Solution" with the strategy cubes at one end and the build plates at the other | Uses the service sculptures that the deck needs (duplication); an axis reads as a slide |
| B3 Connects | The built structure explodes into three layers; the dot runs down the connectors; rows 01/02/03 grow out of the layers | Adrian's portrait in the centre with three rows wired to him | He has just left; a 3 s return fragments the beat; the connected layers show the work, not a claim |
| B4 Services | A deck: one big service card at a time, its sculpture acting the verb, the earlier cards stacking behind | The site's own four-card row, hovered card by card | The site's exact layout (Karl wants new layouts), 30 px titles at a quarter of the frame, a "four equal cards" tell |
| B4 (alt) | (as above) | One card whose contents roll 01 → 04 | No accumulation, so nothing to gather "around your business" later |
| B5 No hype / guesswork | The same noise returns and is struck out; dashed guesses pull into one solid line; the one AI goes flat, becomes "Practical AI" and clicks in | A two-tone headline "No hype. / No guesswork." | Karaoke; the strike on the opening's own noise is the before/after on the same objects |
| B5 Built around | The deck shrinks into four floating tags around your business, asymmetric like the site's hero art | The four cards as a symmetric bento around the centre card | Five cards at once (busy) and a third centred scene in a row |
| B6 CTA | Your business grows into the dark contact panel; its title becomes "your business?"; the tag becomes the button and is pressed | The contact panel sliding up from the bottom as a new section | A page scroll is a pan; nothing carried; the thread wouldn't pay off |
| B6 (alt) | (as above) | T0's dark tile growing into the panel | A strong mask out of an object, but it loses the title-into-headline carry |
| Sign-off | The panel folds into the dark button; the eyebrow, wordmark and tagline rise in; one slow breath | Pulling back to show the whole shell with all the cards | A zoom release (Karl's spikes) and busy; the sign-off must be the calmest moment |
| Sign-off (alt) | (as above) | Ending on the dark panel | Karl asks for bright endings; the fold gives the end its one meaningful move |

---

## 6. Sound

**Music** (character): calm, premium, minimal electronic with soft piano and a clear, quiet pulse around 96–100 BPM.
- 0–6.9 s: a filtered, slightly restless arpeggio with a soft noisy texture (the noise), and a mild dissonance on
  "complicated" (5.5 s).
- 6.8 s ("Meet", the shell rising): the filter opens into a warm, clean chord.
- 10.5–26.2 s: a steady pulse; each service adds one light layer.
- 26.8 s ("No hype"): the pad drops out, leaving the pulse and the dry strikes.
- 28.9 s ("practical"): the warmth returns.
- 32 s: the fullest, still restrained, moment under the CTA.
- 36.9–37.0 s: the final resolving chord on the wordmark, ringing out to 39.0 s.

**SFX accents** (film seconds, frame). They are quiet UI sounds. The sage dot has one soft click motif that returns each
time it acts.

| Time | Frame | Sound | On |
|---|---|---|---|
| 0.47 | f14 | soft tick with a short airy rise | T0 appears |
| 1.47–1.77 | f44–53 | four low whooshes panned to their edges (R, top-L, bottom-R, bottom-L) | the noise arrives |
| 2.33 | f70 | a low soft swell | the card rises |
| 3.73 | f112 | a dull, muted "thunk" | T0 doesn't fit |
| 4.60–4.90 | f138–147 | four small muted clacks | the pile |
| 5.50 | f165 | a soft dissonant cluster | the tangle and tilt |
| 6.63 | f199 | a descending whoosh | the noise falls |
| 6.77–7.23 | f203–217 | an airy rising swell resolving into the clean chord | the page rises; Adrian |
| 8.37 | f251 | dot click | INDEPENDENT |
| 9.47 | f284 | soft tick | check tag |
| 11.10 / 11.57 | f333 / f347 | dot click ×2 (search, land) | the dot searches |
| 11.67 | f350 | a glassy chime | the orb uncovered |
| 13.13 / 13.27 / 13.43 | f394 / f398 / f403 | three soft glass and metal settles | the slabs land |
| 13.27 | f398 | soft tick | "A real-world advantage" |
| 14.73–15.67 | f442–470 | an airy separation and a small rising glissando | explode; the dot runs |
| 15.10 / 15.90 / 16.93 | f453 / f477 / f508 | soft paper ticks | rows 01 / 02 / 03 |
| 17.67 | f530 | soft whoosh | the transition |
| 18.67–19.67 | f560–590 | four tiny metallic taps, then one heavier tap | cubes step; black cube |
| 19.63 | f589 | soft card swish | S2 dealt |
| 20.47 / 21.00 | f614 / f630 | a smooth slide, a precise click, a tiny chime | plates integrate; core |
| 21.73 | f652 | card swish | S3 |
| 22.47–23.37 | f674–701 | a short rising tone in four steps | bars grow |
| 23.50 | f705 | card swish | S4 |
| 24.37 | f731 | soft metal ring | black ring rises |
| 26.03 | f781 | a clean metallic clink | the ring links "into your team" |
| 26.33 | f790 | a muted whoosh up | the noise returns |
| 26.90–27.03 | f807–813 | four dry pencil scratches | struck out |
| 27.23 | f817 | descending whoosh | the hype falls away |
| 27.77–28.30 | f833–849 | a pitch-bend settling into one tone | the guesses become one line |
| 28.80 | f864 | soft tick | flat; "Practical AI" |
| 30.37 | f911 | soft whoosh | gathering around |
| 30.80 | f924 | a precise click, the film's clearest UI sound so far | it fits |
| 31.93 | f958 | a low, warm darkening swell | your business becomes the panel |
| 34.73 | f1042 | soft "fwip" | tag → button |
| 35.90 | f1077 | **the crisp button click** | "talk" |
| 36.20–37.40 | f1086–1122 | an inhaled reverse swell into the button | the panel folds |
| 37.00 | f1110 | the final chord | the wordmark |

There is no sound on the floats, the reveals of small text or the camera breath.

---

## 7. Checks

### Phrase check (no phrase over 2.5 s of unchanged picture)

| P | Visual events | Longest still under voice |
|---|---|---|
| P01 | 2 | 0.0 s |
| P02 | 3 | 0.3 s |
| P03 | 3 | 0.4 s |
| P04 | 4 | 0.0 s |
| P05 | 2 | 0.9 s |
| P06 | 4 | 0.0 s |
| P07 | 2 | 0.2 s |
| P08 | 3 | 0.0 s |
| P09 | 1 | 0.0 s |
| P10 | 2 | 0.0 s |
| P11 | 3 | 0.0 s |
| P12 | 3 | 0.0 s |
| P13 | 2 | 0.0 s |
| P14 | 2 | 0.0 s |
| P15 | 2 | 0.2 s |
| P16 | 3 | 0.0 s |
| P17 | 2 | 0.0 s |
| P18 | 2 | 0.3 s |
| P19 | 3 | 0.1 s |
| P20 | 3 | 0.0 s |
| P21 | 4 | 0.4 s |
| P22 | 1 | 0.0 s |

22 of 22 phrases bring a new visual. The longest voice over an unchanged picture is 0.9 s (P05).

### Variety budget

| Scene | Phrases | Strategy | Structure | Alignment | Primary (kind, size) | Things | Cards? | Distance | Density | Field |
|---|---|---|---|---|---|---|---|---|---|---|
| S1 | P01 | quantity, scatter | scattered, cropped | left of centre | interface tag, 370 px | 5 | no | wide | dense | dark |
| S2 | P02–03 | demonstration of failure | asymmetric | right | the card, 620×820 | 3 groups | yes | medium | dense | dark |
| S3 | P04–05 | person | split L/R | right-weighted | photo, 720×800 | 4 | photo card | medium | medium | paper |
| S4 | P06–07 | object build | close crop, card cut by the frame | left | sculpture, 460×640 | 3 | (inside one) | close | sparse | paper |
| S5 | P08–10 | diagram + type | split | left diagram, right rows | labelled structure | 2 groups | no | medium | medium | paper |
| S6 | P11–15 | UI demo, list | deck | right-weighted | service card, 760×880 | 3 | yes | close | medium | paper |
| S7 | P16–18 | before/after, strike | scattered → single | centre | tag, 600 px | 6 → 3 | no | medium | dense → sparse | paper |
| S8 | P19 | spatial layout | zig-zag around | left of centre | the card + 4 tags | 5 | one card | medium | dense | paper |
| S9 | P20–22 | type + action | statement | centred | headline, 104 px | 4 | no | wide | sparse | dark panel |
| S10 | sign-off | logo | stack | centred | wordmark, 150 px | 4 | no | wide | sparse | paper |

- Centred scenes: 2 of 10 (S9, S10, the statement and the logo).
- Primary kinds: tag, card, person, object, diagram, card, tag, layout, type, logo. The same kind never leads three in a
  row.
- Framing distances: wide, medium and close.
- **Known tension:** S2–S4 are all built on a card. The card is the film's subject (the thread), and the interface-led
  angle is card-based by nature. The structure still changes every scene: a buried card, a split with a person, a close
  crop on an object inside the card.

### The 4% plan (median share of the frame changing)

- **Big-area moves on the beats:**
  - the noise arrivals (P01);
  - the card's 970 px rise (P02, about 25% of the frame);
  - the full-frame shell curtain (P04);
  - the close-up push (P06);
  - the slab builds (P07);
  - the deck deals (760×880, 430 px each, P12–P14);
  - the noise return and drop (P16);
  - the layout transformation (P19);
  - the panel growth and fold (P20 and the sign-off).
- **Between them:** the sculpture float (9 s, 18 px, 1.5°) and the tag floats (7 s, 12 px) keep about 1–2% moving on
  holds. The photo's 60 f scale settle covers P04–P05.
- **Expected:** a median of 3–4%, and no camera-driven spikes, because the camera only breathes.
- **Calm side:** the site's motion is calm. If the probe reads more than 5%, slow the deals first (24 → 30 f).

### Busy check (separate motions at once)

- **Peak: P11's transition (f530–566).** Rows retract, the sculpture restacks, the card moves left and row 01 grows into
  S1. They are staged as three waves 4–6 f apart, and only S1's growth is in the foreground.
- **P16 (f790–831).** Up to six pieces on screen for 0.4 s. The crowding is the point, and four leave within 0.5 s.
- **P19.** One gesture: everything moves together on one curve toward one centre.
- **Elsewhere:** 3–4 things, one moving at a time.

### Copy on screen and its source

| On screen | Source |
|---|---|
| "AI" | script |
| "Try AI", "AI-powered", "New AI tool", "AI assistant" | allowed pattern: generic market noise, struck out in the film |
| "Your business" / "your business?" | script; the site's CTA grey span |
| "INDEPENDENT AI CONSULTING" | site hero eyebrow |
| "Adrian Tineo" · "PhD in Computer Science" | site portrait nameplate |
| "Business-minded, hands-on" | site check item |
| "A clear direction" · "A real-world advantage" | site hero tags |
| "01 Strategy · 02 Engineering · 03 Execution" | script words in the site's numbered-row component |
| Service eyebrows, titles, footers (01–04) | site service cards, verbatim |
| "Practical AI" | script |
| "YOUR NEXT CHAPTER WITH AI" · "What could AI do for your business?" | site contact panel |
| "Let's talk" | site nav button and script |
| "Adrian Tineo." · "AI expertise. Business impact." | site wordmark and hero headline |

There are no client names, numbers, logos or URL. The third-party names on the site (Goldman Sachs, Telepass, NVIDIA)
are deliberately not used.

### Risks (the three moments most likely to fail) and the fix ready for each

1. **P02's "doesn't fit" reads only as "a tag on a card".**
   - Fix: keep the dashed slot clearly visible beside T0, and make the mismatch obvious (T0 more than twice the slot's
     height, tilted, sticking out of the card).
   - If it still doesn't read at the 2-frame check, let T0 bump the slot's edge (a 6 px nudge back, no bounce) with the
     dull thunk.
2. **The dark opening (6.9 s) against Karl's "make it bright".**
   - It is the site's own ambient, and it is left through a full paper curtain.
   - Fallback: start on paper with the noise floating over a smaller shell, and keep the dark field only as the margins.
3. **Small type in the business card after P11 (title at 40 px).**
   - Every word that matters is read big first: the title at P02 and P06, "Practical AI" at P18 at 50 px.
   - When it is small it is context, not reading.

### Build notes (Remotion, kit components)

- **One `stage.tsx`** owns the ambient, the shell and the camera breath for the whole film.
- **One `thread.tsx`** owns the three objects that cross every segment: BC (with HS inside), T0 and the sage dot.
  - Each is a keyframe table on word labels (`W("w:key", ±s)`) with its eases.
  - Rest states, where segments can hand over:
    - **BC:** s0.82 at (560, 600) f239–315 · s1.35 well-centred at (820, 470) f343–430 · s1.0 at (620, 540) f456–530 ·
      s0.72 at (400, 540) f564–911 · s0.95 at (900, 540) f941–958.
    - **T0:** hovering f112–138 · off stage f215–790 · in the slot f924–958 · on the panel f990–1042.
    - **Sage dot:** in the eyebrow f263–311 · in the sculpture f470–976 · on the contact eyebrow f1002–1086 · on the
      sign-off eyebrow from f1112.
- **Segment files**, each owning everything else in its range:
  - seg1 f0–207: the noise, the pile, the tangle;
  - seg2 f199–317: the portrait card, the eyebrow, the check tag;
  - seg3 f311–548: the iris, the hero tags, the explode, rows, leaders;
  - seg4 f530–806: the service deck and its four sculptures;
  - seg5 f790–964: the noise return, strikes, guess lines, tags around BC;
  - seg6 f950–1170: the contact panel, headline, button morph, fold, sign-off.
- **Sculptures:**
  - the site's own SVGs as inline React, split into groups by their existing `<g>` and `<use>` elements (the strategy
    blocks at translate(152 286), (233 239), (314 285), (394 239) plus the black block at (393 160); the build slabs at
    (300 302), (300 228), (300 150); the four bars; the three ring ellipses with their interleave arcs);
  - gradients from `MetalDefs` or the files' own defs;
  - every motion is a transform on a group (translate, scaleY for the bars, opacity), computed from the frame.
- **3D tilts:** CSS `perspective(1600px) rotateX() rotateY() rotateZ()` on the piece's wrapper. The pile pieces are
  children of BC's tilted wrapper from f162 to f199.
- **Masks:** the iris is a circular `clip-path` on the orb's layer. The well clips the slabs rising and descending. The
  panel grow and fold animates one rounded rect with `overflow: hidden` holding the panel's content.
- **Label rolls** ("AI" → "Practical AI" → "Let's talk", Y → y): two spans in one overflow-hidden slot. The old one
  rises out while the new one rises in, so they never overlap. Check them at 2-frame steps.
