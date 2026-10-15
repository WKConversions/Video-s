# Concept A: "Intelligence, applied" (object-led)

The site's own chrome sculpture is the film. One six-piece sculpture, in the site's material, starts out scattered across
the page, jams on "your business", is put in order the moment Adrian appears, and then reshapes itself for every line: the
site's hero sculpture, the four service sculptures, a collar built around your business. At the end, its black heart opens
into the site's dark contact panel. The chrome orb is the dot after "AI•" in the first second, and the dot of
"Adrian Tineo•" in the last.

Film: 1920×1080, 30 fps, 1170 frames (39.0 s), VO at +0.50 s. All frames below are film frames
(frame = round(film seconds × 30)), read from `film/src/words.json`.

---

## 1. Beats and phrases

| # | Phrase | Film s | Frames | Key word (frame) | Beat |
|---|---|---|---|---|---|
| P1 | AI is everywhere. | 0.68–2.14 | 20–64 | **AI** (20), **everywhere** (50) | A Hook |
| P2 | But making it work for your business? | 2.70–4.12 | 81–124 | work (97), **business** (112) | A Problem |
| P3 | That's where things get complicated. | 4.74–6.20 | 142–186 | things (157), **complicated** (169) | A Problem |
| P4 | Meet Adrian Tineo, | 6.90–8.02 | 207–241 | **Meet** (207), Adrian (217), Tineo (229) | B Turn |
| P5 | your independent AI expert. | 8.30–10.00 | 249–300 | independent (257), **expert** (290) | B Turn |
| P6 | From uncovering the right opportunities | 10.56–12.46 | 317–374 | **uncovering** (325), opportunities (354) | C Span |
| P7 | to building real solutions, | 12.60–13.94 | 378–418 | **building** (382), solutions (402) | C Span |
| P8 | Adrian connects strategy, | 14.48–15.72 | 434–472 | **connects** (446), strategy (457) | C Span |
| P9 | engineering, | 16.04–16.56 | 481–497 | **engineering** (481) | C Span |
| P10 | and execution. | 16.84–17.58 | 505–527 | **execution** (512) | C Span |
| P11 | Explore use cases. | 18.26–19.36 | 548–581 | **Explore** (548), cases (569) | D Services |
| P12 | Develop and integrate AI. | 19.90–21.38 | 597–642 | Develop (597), **integrate** (618), AI (634) | D Services |
| P13 | Evaluate performance. | 21.98–23.14 | 660–694 | **Evaluate** (660), performance (678) | D Services |
| P14 | Bring expert leadership | 23.76–24.90 | 713–747 | **Bring** (713), leadership (735) | D Services |
| P15 | directly into your team. | 25.02–26.22 | 751–787 | into (769), **team** (781) | D Services |
| P16 | No hype. | 26.86–27.30 | 806–819 | **hype** (811) | E Promise |
| P17 | No guesswork. | 27.68–28.30 | 831–849 | **guesswork** (837) | E Promise |
| P18 | Just practical AI, | 28.61–29.86 | 858–896 | **practical** (868), AI (886) | E Promise |
| P19 | built around your business. | 30.12–31.46 | 904–944 | **built** (904), around (915), business (933) | E Promise |
| P20 | Ready to turn AI potential | 32.15–33.59 | 964–1008 | Ready (964), **turn** (975), potential (994) | F CTA |
| P21 | into meaningful business impact? | 33.73–35.19 | 1012–1056 | into (1012), **impact** (1046) | F CTA |
| P22 | Let's talk. | 35.69–36.13 | 1071–1084 | **talk** (1077) | F CTA |
| — | sign-off (no voice) | 36.13–39.00 | 1084–1170 | — | F End |

22 phrases, 22 visual events on key words, plus secondary events on the words in brackets. Each event starts 3 to 6 frames
before its word, so the picture leads the word (`motion/timing.md`).

---

## 2. Thesis, thread object, motion identity

### Thesis
**Adrian Tineo takes AI from scattered and complicated to one clear, working structure built around your business. The
film shows this with the website's own chrome sculpture being sorted, built and reshaped phrase by phrase, and it is
signed with the dot of his name.**

**Allowed patterns** (named here so the tells check can tell choices from reflexes):
- The site's chrome and glass sculpture vocabulary (its hero sculpture and its four service sculptures, their gradients and
  ground shadows), rebuilt and recombined as abstract forms. This is the client's own visual language. Wherever a form
  could be misread, a site label names it.
- The site's floating tags with site copy only: "A clear direction" (↗), "A real-world advantage" (✳), and an
  "Adrian Tineo" photo tag.
- The site's numbered rows and service names (01–04) from `harvest/facts.md`.
- The sage status dot on eyebrows only ("YOUR BUSINESS", "INDEPENDENT AI CONSULTING"), as the site uses it.
- One strike-through mark on two words, "Hype." and "Guesswork." (script words).
- The site's dark contact panel (#141413 with its faint arc) for the CTA, inside the paper shell.
- Adrian's portrait in black and white, with the site's frosted caption.
- No numbers, no clients, no logos, no testimonials, no URL. The bar heights carry no values.

### On-screen words (the complete list, with sources)
| Words | Where | Source |
|---|---|---|
| AI | P1, with the orb as its dot | script |
| • YOUR BUSINESS | P2–P5, P19 | site ("Start with your business", "your business") |
| Adrian Tineo · PhD in Computer Science | P4–P5 portrait caption | facts |
| • INDEPENDENT AI CONSULTING | P5 | site hero eyebrow |
| ↗ A clear direction · ✳ A real-world advantage | P6, P7 | site hero tags |
| Adrian Tineo (photo tag) | P6–P15 | facts |
| 01 Strategy · 02 Engineering · 03 Execution | P8–P10 | script |
| 01 AI strategy & direction · 02 AI development & integration · 03 Evaluation & performance · 04 Fractional AI leadership | P11–P15 | facts (service titles) |
| ~~Hype.~~ ~~Guesswork.~~ | P16, P17 | script (struck) |
| • YOUR BUSINESS | P19 (callback) | site |
| AI expertise. / Business impact. | P21 → end | site H1 / facts tagline |
| Let's talk ↗ | P22 → end | site nav CTA |
| Adrian Tineo• | sign-off | site wordmark |

The type labels the picture. It never repeats a full voice-over sentence.

### The thread object: one sculpture, six pieces
All six pieces are drawn from the site's SVGs and the kit's `MetalDefs`. From P2 to the panel at f1016 the stage holds
exactly these pieces. They split, fuse, sink and rise, but nothing new is added and nothing is thrown away.

| Piece | Means | Material (site gradients) | Forms across the film |
|---|---|---|---|
| **O, the orb** | AI | hero `orb` radial + `light` highlight + rim arc, `coreShadow` | the dot of "AI•" → wedged in the jam → shut in the socket → revealed → middle tier → explores the steps → into the module's inlay → rides the tallest bar → sinks into the disc → rises onto the core → lifts (potential) → drops in → **the dot of "Adrian Tineo•"** |
| **C1–C4, four chrome blocks** | the work: AI made useful | strategy `top/front/side` for blocks; hero `metal/bevel` for plates; enablement `chrome/inner` for the ring | 4 cubes scattered everywhere → jammed pile → 2×2 lid plate → top tier → 4 steps → fused module → 4 bars → chrome ring → flat ring → collar around the core |
| **K, the black block** | your business | strategy `dark/darkfront`, build `black/blackedge`, performance `black/base`, enablement `black` | slab with a 2×2 socket → base of the hero stack → black cube on the top step → slab the module seats in → disc → black ring (your team) → core cube → its top face becomes the dark contact panel |

The meaning is constant all the way through: **chrome = AI and Adrian's expertise, black = your business.** This maps
onto the site's own sculptures. Chrome steps climb to the black cube, a chrome stack is capped by a black slab, chrome bars
stand on a black disc, and a chrome ring links with a black ring.

**Build primitives** (new, in `kit.tsx`; everything is driven by the frame):
- `IsoBox {x,y,z (plan, base centre), w,d,h, r (plan corner radius), rot (plan rotation), tilt (2-D screen rotation, jam
  only), mat, socket?, inlay?}`. True isometric projection, the site's: `sx = 0.866·(px−py)`, `sy = 0.5·(px+py) − pz`.
  The top face is the projected rounded rect. The two visible side faces are the lower silhouette chain (leftmost →
  bottom-most → rightmost), extruded by h. White top-edge highlight at the site's 0.64 opacity. Drop shadow
  `dy 15 sd 11 .18`. A cube, slab, plate, bar or disc (r = w/2) is one primitive, so every morph is a parameter lerp.
- `IsoFrame {outer, wall, r, h}`: a hollow rounded square, used for the flat ring and the collar. r = outer/2 gives a
  round band.
- `Ring {cx,cy,rx,ry,rot,mat}`: the site's enablement stroke (inner 33 + chrome 24 offset −3, highlight arcs). It is split
  into front and back half-arcs by clipPath for the interlock.
- `Orb {x,y,r}` and `GroundShadow` (the site's blurred ellipse, `#3B3B3B` .23, blur 23·g). A shadow shrinks and fades
  with its piece's height.
- `DashedPath` (site dash 3/7, ×2 for film = 6/14, `#ABABAB`, 2 px) with a draw-on mask.
- Sculpture placement: **anchor** = screen point of plan (0,0,0), **g** = group scale. Every offset below is given at g = 1
  and is multiplied by g.

### Motion identity
- **Personality: precise premium, the site's own motion.** Calm and exact. No bounce, no overshoot, no glow, nothing pops.
- **Signature curve:** the site's only curve `cubic-bezier(.22,1,.36,1)` (`EASE`) for about 85% of moves. `MOVE`
  (.65,0,.35,1) is used for group relocations and the turn, `DEPART` (.55,0,.9,.4) for exits. The P3 jam alone uses a short
  accelerate-and-stop `bezier(.4,0,1,1)`, so its stops feel abrupt without bouncing.
- **Duration palette (frames):** quick **8–12** (hover lifts, strikes, label rolls, exits). Standard **20–26** (the site's
  reveal is 26 f = 0.85 s; sculpture morphs 20–24). Slow **30–36** (group relocations, the portrait-to-tag, the turn). Exits
  run at about 70% of their entrance.
- **Entrance pattern:** type, tags and cards use the site's reveal: fade plus a 34 px rise (the site's 22 px ×1.5) over
  26 f, with siblings stepped 3 f (about 100 ms, the site's `--delay`). Pieces of the sculpture never "enter" after P2. They
  transform out of their previous form. Off-frame arrivals happen only in P1 ("everywhere") and for K rising from below
  the shell edge in P2.
- **The site's idle motion:** settled sculptures float on the site's 9 s cycle (−14 px, 1.5°, ease-in-out) and tags on its
  7 s cycle (−9 px, phase −3 s on the second tag). A thing that is named gets the site's hover lift (tiers +10 px, tags
  +8 px, button −6 px, 10 f up and 12 f back). The portrait settles from image scale 1.06 to 1.00 (the site's hover
  scale). The jam is stuck, so it does not float.
- **Camera: one slow breath for the whole film.** Scale 1.000 → 1.030 (f0–600) → 1.012 (f1080), at rest from f1100.
  Drift +14 px x / −8 px y and back. Sine-shaped, under 2 px/s and 0.2%/s, far inside the 25 px/s and 5%/s limits. No
  push, pan or zoom on any transition. Transitions move content only.
- **Transition families (three):** (1) **object transformation** of the sculpture (the main one), (2) **layout
  transformation** (the group glides, rows fold, the portrait shrinks into a tag), (3) **a mask out of an object** (the
  black core's top face grows into the contact panel).
- **Motion target:** median about 4% of the frame moving. P1 and the jam run high, the holds lower. Every hold keeps its
  float and the camera's breath.

### The stage
- `Ambient` (drift 0 → 1 over the film) behind `Shell` x 64–1856, y 54–1026, radius 52, the site's white hairline and
  shadow. Paper `#F4F4F2` is the canvas from frame 0 to f1016. The content area is x 160–1760, y 120–960.
- Fonts: Manrope only. Headlines are weight 650 at −0.054 em, line-height 1.08, with an ink first line and a `#777772`
  second line. Eyebrows are 20 px, 700, 0.2 em, uppercase, with the sage dot `#88A397`.

---

## 3. Phrase by phrase

Positions are in px on the 1920×1080 frame. "→" means "animates to".

### Beat A: Hook and problem (f0–206)

**P1 · "AI is everywhere." (f20–64) · key: AI f20, everywhere f50**
- *f0 (first frame):* the paper shell over the ambient, with the chrome **orb O** alone at (960, 560), r 64, its ground
  shadow below and the site's float running. One striking object on the page, no title card.
- *Event 1, "AI" (f14–40):* the word **"AI"** reveals at x 420, baseline y 650 (340 px, 650, ink; site reveal, 26 f).
  Over the same 26 f (MOVE), O glides to (814, 609) and shrinks to r 41, so it sits on the baseline as the word's dot: **"AI•"**,
  the site's wordmark logic. Primary: "AI•".
- *Event 2, "everywhere" (f44–74):* the four **chrome cubes C1–C4** (plan 120, h 110, r 10) slide in from outside the
  frame into all four zones, at four depths. They arrive on EASE over 24–30 f, scaled by travel, starting f44 / 46 / 48 / 50,
  with motion blur:
  - C1 near: from (2100, 1200) → (1560, 860), g 1.9, tilt 14°, blur 6 px. It crosses the shell's bottom-right edge
    onto the dark ambient: everywhere, even beyond the page.
  - C2 mid: from (−200, −150) → (300, 250), g 1.0, tilt −10°, straddling the shell's top-left corner.
  - C3 far: from (2050, 120) → (1480, 300), g 0.55, tilt 6°, opacity 0.85.
  - C4 mid-small: from (−150, 1150) → (330, 820), g 0.8, tilt −16°.
  - Then all four float, phases staggered. Secondary: the scattered cubes. Detail: the dot.
- *Carry:* the orb stays (it is the thread). The cubes are the pieces everything else is built from.

**P2 · "But making it work for your business?" (f81–124) · key: business f112**
- *f78–90, "But":* the letters "AI" slide left 60 px and fade (DEPART 12 f). The orb stays.
- *f86–110, "making it work":* O rolls off the baseline to hover at (1000, 600). C1–C4 drift in toward the centre
  (MOVE 30 f, f93–123). Their scale goes to g 1.0, blur to 0 and tilt to ±6–9°, ending loosely around (1000, 450): C1 (760, 470),
  C2 (900, 330), C3 (1110, 360), C4 (1240, 480). This is AI trying to come together.
- *Event, "business" (f104–134):* the **black block K** (slab, plan 300×300, h 64, r 18, a 2×2 **socket** recessed 16 on
  its top: plan 250, `#0A0A0A` with the build sculpture's `#767676` inner outline) rises from below the shell's bottom edge
  into anchor (1000, 740), g 1.0. It is heavy: 30 f EASE, and its ground shadow grows in with it.
- *f114–140:* eyebrow **"• YOUR BUSINESS"** reveals at (740, 940), left-aligned to K's left corner.
- Composition: primary K, centred low. Secondary: the four cubes and the orb above it. Detail: the eyebrow.
- *Carry:* the pieces are now over the business. They will try to land on it.

**P3 · "That's where things get complicated." (f142–186) · key: complicated f169**
- *f138–156, "That's where":* C1–C4 drop onto K, each in 10–12 f on the accelerate-and-stop curve, stepped 4 f (f138, 142,
  146, 150). None of them fits the socket. They land crooked and overlapping:
  - C1 at plan (−80, −60), z 64, tilt 11°;
  - C2 at (60, −40), z 64, tilt −8°, wedged against C1;
  - C3 at (−20, 80), z 64, tilt 4°, hanging over K's front edge;
  - C4 on top of C2 (z 174), tilt 14°.
  - O rolls in (f140–156) and gets wedged between C1 and C3 at the socket's rim.
- *f153–163, "things":* a stutter. C2 slips 22 px and shoves C4 (tilt 14° → 22°, slides 18 px toward the edge), and C1 is
  nudged 8 px. Short, blocked moves (MOVE 10 f).
- *Event, "complicated" (f165–183):* **seven dashed connector lines** (the site's dashed line) draw between the pieces and
  K's corners. Each draws in 14 f, stepped 2 f, and they cross into a tangle. The whole pile sags 3° (MOVE 16 f) and stays
  stuck: no float.
- Composition: primary, the jammed pile on K (x 740–1260, y 380–890). Detail: the eyebrow. Four things.
- *Carry:* the mess holds still as a problem waiting for someone.

### Beat B: Meet Adrian (f199–316)

**P4 · "Meet Adrian Tineo," (f207–241) · key: Meet f207**
- *Event, "Meet" (f199–229):* a **layout transformation**. The whole problem (K, pile, lines, eyebrow) glides left to
  anchor (600, 760) at g 0.85 (MOVE 30 f). On the same leftward vector, the **portrait card** slides in from x +320 to
  x 1150–1710, y 170–870 (560×700, radius 34, `#E6E6E1`). It is grayscale with `multiply`, object-position 48%, and
  fades in over 30 f on EASE (directional continuation: the card arrives on the same leftward move).
- *f213–233, "Adrian":* the site's frosted caption rises inside the card's bottom (inset 24, radius 20, `#FFFFFFDB`,
  12 px rise, 20 f): **"Adrian Tineo"** (30 px, 650) on the left, "PhD in Computer Science" (17 px, `#71716B`) on the right.
- *f225–255, "Tineo":* the photo settles from scale 1.06 to 1.00 (the site's image hover, EASE 30 f).
- Composition: primary, Adrian (the largest thing, right). Secondary: the jam (left, smaller). Detail: the caption.
- *Carry:* the mess is still on screen next to him, so the next phrase can resolve it.

**P5 · "your independent AI expert." (f249–300) · key: expert f290**
- *f253–279, "independent":* eyebrow **"• INDEPENDENT AI CONSULTING"** reveals above the card at (1150, 118).
- *Event, "expert" (f282–308):* **the jam resolves.** The tangle lines retract (reverse draw, 10 f, f282–292). The orb
  drops into K's socket (f284–296). The four cubes lift off, square up (tilt → 0) and slide edge to edge into a 2×2
  while flattening into tiles (h 110 → 24), so they become **one chrome lid plate**. The lid lowers flush onto K and covers
  the socket with the orb inside it. K's sag goes to 0, and a single soft click lands at f300. EASE 24 f, pieces stepped
  3 f. The shadow tightens to one ellipse. From here the closed box floats.
- Composition: Adrian (right), with a quiet closed box beside him (left). The causality reads as order arriving with him.
- *Carry:* the closed box holds something. The next phrase opens it.

### Beat C: The span: opportunity to solution, strategy to execution (f305–540)

**P6 · "From uncovering the right opportunities" (f317–374) · key: uncovering f325**
- *f305–341 (layout transformation, MOVE 36 f):* the portrait card shrinks into an **"Adrian Tineo" tag** at the top
  right (x 1440–1760, y 100–196). It is the site's tag: a 64 px photo tile on the left, the name in 24 px 600, near-white
  `rgba(255,255,255,.95)`, radius 25. The photo's mask shrinks into the tile and the caption's name carries into the
  tag's text. The eyebrow exits (rise 12 px, fade, DEPART 12 f). The box glides to anchor (1000, 760) at g 1.15.
- *Event, "uncovering" (f321–345):* **the lid lifts off** like a hatch: z 64 → 224 with a 2-D tilt of −7° (hinged at
  the back), EASE 24 f. It reveals the orb sitting in K's socket, and the orb rises 20 px as the light reaches it.
- *f350–376, "opportunities":* tag **"↗ A clear direction"** (pale tile with arrow-up-right) reveals at x 330–720,
  y 350–440, from under the raised lid's left edge, then takes up the tag float.
- Composition: primary, the opened sculpture (centre, x 700–1300). Secondary: the tag. Detail: Adrian's tag (top right).
- *Carry:* the open parts are about to be built into a structure.

**P7 · "to building real solutions," (f378–418) · key: building f382**
- *Event, "building" (f378–402):* **the site's hero sculpture assembles.** The lid levels (tilt → 0) and rises to its
  tier (z 300). The orb rises to the middle tier (z 180), and three dashed verticals (the hero SVG's, at K's left corner,
  centre and right corner) draw up from K to the lid (14 f). Each tier settles with its own shadow (EASE 16–24 f, stepped
  3 f). The result is a dark base, a chrome orb and a chrome plate: "Intelligence, applied."
- *f398–424, "solutions":* tag **"✳ A real-world advantage"** (dark tile `#242423`, white asterisk) reveals at
  x 1290–1750, y 840–940. With it, the composition is the site's hero art: the sculpture plus two tags on the diagonal.
- *Carry:* three tiers stacked one above the other are the three things he connects.

**P8 · "Adrian connects strategy," (f434–472) · key: connects f446**
- *f430–442, "Adrian":* the Adrian tag does the hover lift (+8 px, 10 f up, 12 f back). Both hero tags drift off (fade,
  drop 20 px, DEPART 12 f, f430 / f434).
- *Event, "connects" (f442–466):* the sculpture glides right to anchor (1340, 800) at g 0.95, and its tiers spread to an
  exploded view at equal spacing (MOVE 24 f): K's top face centre at y 739, the orb at y 616, the lid at y 492. The dashed
  verticals lengthen to join all three tiers into one connected column.
- *f453–477, "strategy":* row **01** at the left. A hairline (2 px `#D8D8D2`) draws from x 160 to 760 at y 436 (14 f), then
  "01" (22 px `#86867D`, x 160) and **"Strategy"** (72 px, 650, ink, x 236, centre y 492) reveal. A dashed leader draws
  from x 780 to the lid's left edge at y 492 (12 f). The lid lifts +10 px and settles (hover).
- Composition: rows on the left (reading order), the column on the right. The site's numbered rows sit beside its sculpture.

**P9 · "engineering," (f481–497) · key: engineering f481**
- *Event (f477–501):* row **02**: hairline at y 559, "02", **"Engineering"** (centre y 616). Its leader draws to the orb,
  and the orb lifts +10 px.

**P10 · "and execution." (f505–527) · key: execution f512**
- *Event (f508–532):* row **03**: hairline at y 682, "03", **"Execution"** (centre y 739). Its leader draws to K's top
  face, and K lifts +6 px. The closing hairline at y 805 draws from f520 to f534.
- At f532 the frame is a labelled diagram. Three named tiers are joined by one dashed column, so the viewer reads
  "he connects all three" with the sound off.
- *Carry:* row 01 and the tiers are about to become the service sequence.

### Beat D: The four services, four forms of the same sculpture (f538–800)

Layout for the whole beat: a **label slot** at the left (number at x 160, y 340, 26 px `#757571`; title on two lines at
84 px, ink line plus grey line, from y 380 to 580). The **sculpture** sits at anchor (1260, 780), g 1.15, filling
x 860–1650. The Adrian tag stays at the top right. Each phrase changes both the label (a masked roll: the old text
slides up out, the new rises in, 14 f) and the form.

**P11 · "Explore use cases." (f548–581) · key: Explore f548**
- *f538–552:* rows 02 and 03, the leaders and the closing hairline fold up into row 01 and fade (DEPART 12 f). "01" stays.
  "Strategy" rolls to **"AI strategy / & direction"**, and the slot moves up to its beat position (MOVE 14 f).
- *Event, "Explore" (f544–572):* **the hero stack becomes the site's strategy sculpture.** The lid splits into its four
  tiles, which extrude back into cubes (h 24 → 110) and glide into the site's zig-zag steps. Their offsets at g 1 (site
  layout ×1.9) are (−230, +46), (−76, −44), (+78, +46), (+230, −44); EASE 24 f, stepped 3 f. K shrinks from slab to cube
  (plan 300 → 120, h 64 → 110; its socket closes to the site's small chrome square) and rides up onto cube 4 (z 110). It
  lands on "cases", f569: your goal at the top of the steps.
- *f556–576, "use cases":* the site's dashed path draws through the steps from left to right (20 f). Offsets:
  (−390, +128) → (−186, +8) → (−34, +96) → (+270, −82).
- *f548–596:* the orb drops to the start of the path and **glides along it across cubes 1 to 3**, exploring (MOVE 48 f).
  It comes to rest on top of cube 3, next to the black cube. It is the one moving focus once the morph has landed.
- *Carry:* the four cubes are about to be pulled together into one piece.

**P12 · "Develop and integrate AI." (f597–642) · key: integrate f618**
- *f593–607:* the label rolls to **"02 · AI development / & integration"**.
- *f593–617, "Develop":* the four cubes slide together into a 2×2 and **fuse into one chrome module** (plan 244, h 110;
  seams fade from 80% to 10%), hovering at z 180 over the centre. K slides down off the steps and grows back into the slab
  with its socket (plan 300, h 64) at ground level. The orb rides along and sits on the module's top centre. EASE 24 f.
- *Event, "integrate" (f614–634):* **the module lowers into K's socket and seats flush** (z 180 → 48; the socket rim
  hides its bottom 16). EASE 20 f: one clean seat with no bounce, and the two shadows merge. This is the payoff of P3:
  the same pieces that jammed on your business now fit it exactly.
- *f630–642, "AI":* the orb sinks into a small inlay at the module's top centre and sits half sunk, like the chrome square
  on the site's build sculpture (EASE 12 f).
- *Carry:* the module is about to split into what gets measured.

**P13 · "Evaluate performance." (f660–694) · key: Evaluate f660**
- *f656–670:* the label rolls to **"03 · Evaluation / & performance"**.
- *Event, "Evaluate" (f656–680):* **the site's performance sculpture.** K's corners round all the way, so the slab
  becomes a disc (r 18 → 170, plan 300 → 340, h 64 → 44, colours to the site's `black` and `base`). The module splits into
  **four bars** that rise to 96 / 168 / 240 / 312 (plan 64, near-sharp corners, the site's front, side and top
  gradients). Their base offsets are (−105, +18), (−35, +6), (+35, −6), (+105, −18); EASE 20 f each, stepped 3 f. The orb
  rides up on bar 4.
- *f674–700, "performance":* **a measuring hairline** (ink at 35%, 2 px, 560 px wide, centred on the sculpture) steps up
  from bar top to bar top: four stops of 5 f each (step, hold, step), then a hold at the tallest and a fade (f700–710).
  Evaluating is shown as measuring. No numbers.
- *Carry:* the bars' chrome is about to come back as one ring.

**P14 · "Bring expert leadership" (f713–747) · key: Bring f713**
- *f709–723:* the label rolls to **"04 · Fractional AI / leadership"**.
- *Event, "Bring" (f709–739):* the bars **sink into the disc** (h → 0, DEPART 16 f), and the orb goes down with bar 4 into
  K. From the disc's centre a **chrome ring** rises at the same moment. It starts as a flat ellipse (rx 60), grows to
  rx 110, rises and stands up (ry 35 → 170, rotate −24°, the site's angle) to centre (1080, 430). EASE 26 f. This is the
  bars' metal gathered into one ring, drawn in the site's enablement chrome.
- *f731–751, "leadership":* the **Adrian tag glides from the top-right corner and docks at the ring's upper right**
  (1200, 250), MOVE 20 f. The chrome ring is now visibly Adrian's leadership.
- *Carry:* the disc below is your business, and it is about to become your team.

**P15 · "directly into your team." (f751–787) · key: team f781**
- *f745–767, "directly":* **the disc stands up into a black ring** at (1440, 560): ry grows, the fill drains into the
  site's 34 px black stroke, and it rotates −24° (MOVE 22 f). This is your team, still black because it is yours.
- *Event, "into your team" (f765–783):* the chrome ring moves **straight** from (1080, 430) to (1232, 560) and
  **interlinks** with the black ring, with the tag riding along (EASE 18 f). The draw order is the black back arc, then the
  chrome ring, then the black front arc. On "team", f781, the link sits. The result is the site's linked-rings sculpture:
  expertise inside your team.
- *Carry:* the linked pair moves aside for the promise.

### Beat E: The promise (f798–960)

**P16 · "No hype." (f806–819) · key: hype f811**
- *f798–828:* the label slot exits upward (rise 30, fade, DEPART 10 f) and the Adrian tag fades (its job is done; the
  wordmark carries his name at the end). The ring pair glides to (1560, 640) at g 0.8 (MOVE 30 f) and keeps floating.
- *f802–822, "No":* **"Hype."** reveals at x 160, cap top y 330 (180 px, 650, ink).
- *Event, "hype" (f809–819):* **a strike** (ink, 7 px Rule) draws through "Hype." from left to right at mid x-height,
  y about 420 (EASE 10 f).
- Composition: the type is primary (left), the linked rings are secondary (right). Three things.

**P17 · "No guesswork." (f831–849) · key: guesswork f837**
- *f827–847:* **"Guesswork."** reveals on the line below (180 px, 650, grey `#777772`, x 160, cap top y 530, width about
  990 px). Together the two lines form the site's two-tone headline.
- *Event, "guesswork" (f835–847):* the ink strike draws through it at y about 620 (EASE 12 f).
- *Carry:* both struck words are about to fall away, leaving only the work.

**P18 · "Just practical AI," (f858–896) · key: practical f868**
- *f854–870, "Just":* the struck words fall away (slide down 40 px and fade, DEPART 12 f, stepped 4 f). The page is
  cleared.
- *Event, "practical" (f858–882):* the ring pair glides to the centre, anchor (960, 700) at g 1.2 (MOVE 24 f). The **black
  ring lies down and fills into a solid black core cube** (ring → filled ellipse → disc → cube; plan 200, h 200, r 14,
  with an inlay recess of plan 70 on top). The **chrome ring lies flat around the core's base** (an `IsoFrame` with
  r = max, outer 400, wall 34, h 20, so rx about 294), landing on "practical", f868–880. It is one plain, grounded object.
- *f882–896, "AI":* **the orb rises out of the core's top** (it has been inside since P14) and sits in the inlay at about
  (960, 430) (EASE 14 f).
- Composition: a centred single object. This is the film's one centred statement.

**P19 · "built around your business." (f904–944) · key: built f904**
- *Event, "built" (f900–924):* **the flat chrome ring squares up and rises into a chrome collar** around the core
  (IsoFrame r: max → 30, h 20 → 120, outer 400 → 330; top in the site's `metal`, faces in `bevel`), EASE 24 f. The chrome
  is now built around the black, so you see AI built around your business.
- *f929–955, "business":* eyebrow **"• YOUR BUSINESS"** reveals centred at (960, 945): the callback to P2. The same
  label, the same black block, but this time the chrome fits around it instead of jamming on top of it.
- Then a working hold: the sculpture floats on the 9 s cycle and the camera breathes.

### Beat F: CTA (f960–1170)

**P20 · "Ready to turn AI potential" (f964–1008) · key: turn f975**
- *f960–966, "Ready":* a small anticipation: the sculpture counter-turns −2° in plan.
- *Event, "turn" (f966–996):* **the whole sculpture turns 90° about its vertical axis** (IsoBox/IsoFrame `rot`, MOVE
  30 f). It is a literal turn, and the silhouette returns to its start, so the state does not change.
- *f990–1006, "potential":* the orb lifts 80 px above the core and hovers there (EASE 16 f).

**P21 · "into meaningful business impact?" (f1012–1056) · key: impact f1046**
- *f1008–1020, "into":* **the orb drops into the core** and disappears into its inlay (DEPART, accelerating, 12 f). The
  eyebrow fades (8 f).
- *f1016–1042, "meaningful business": a mask out of the black core.* The core's black top face, a rhombus, **grows into
  the dark contact panel.** Its four corners interpolate to the panel rect, x 96–1824, y 86–994 (the shell inset 32), with
  radius 40, fill `#141413` and MOVE 26 f. The collar and the paper are covered by it. The site's faint arc arrives with
  the panel: a 1200 px circle, 2 px, `rgba(255,255,255,.03)`, centred at (1820, 380). The paper shell stays visible as a
  32 px rim, exactly as the site's contact panel sits in its page.
- *Event, "impact" (f1034–1062):* the site's H1 on the panel at x 192, 150 px, weight 650. Line 1 **"AI expertise."**
  (`#F5F5F2`) reveals from f1034. Line 2 **"Business impact."** (`#AAA9A1`) reveals from f1040 and lands on "impact",
  f1046 (site reveal, words stepped 3 f). Baselines y 470 and 632.

**P22 · "Let's talk." (f1071–1084) · key: talk f1077**
- *f1063–1083:* the **light button "Let's talk ↗"** (`.button-light`, size 1.25: about 125 px tall, 37 px text, radius
  25) reveals at x 192, y 740.
- *Event, "talk" (f1075–1083):* the button does the site's hover (lift −6 px, fill to `#E3E7E3`, arrow nudged
  (+4, −4), EASE 8 f) and returns at f1084–1100. The action is shown being taken.

**Sign-off (f1084–1170, 36.1–39.0 s, no voice)**
- *f1088–1114:* the **wordmark "Adrian Tineo"** (`#F5F5F2`, 84 px, 800, −0.066 em) reveals at the panel's top left
  (x 192, top y 150), words stepped 3 f.
- *f1104–1128:* **the orb surfaces as the wordmark's dot** at its exact spot: chrome, diameter 0.24 em = 20 px, rising
  16 px with a fade, plus one glint of its highlight. It is not a scale-from-zero. This is the payoff: the dot after "AI•"
  in the first second is the dot of "Adrian Tineo•" in the last.
- *f1128–1170:* a calm hold. On screen: the wordmark with its chrome dot (top left), "AI expertise. / Business impact."
  (primary), "Let's talk ↗" (below), and the faint arc (right). The camera's breath has come to rest by f1140. Nothing else
  moves across the screen (the K.B lesson). **No URL.**

---

## 4. Continuity table

| Object | Appears | Transforms (frame: what) | Leaves |
|---|---|---|---|
| Ambient + paper shell | f0 | breath only; ambient drift 0 → 1 | stays to f1170 (the shell rim frames the panel) |
| **Orb O** (AI) | f0, centre | f14 becomes the dot of "AI•" · f86 hovers over the centre · f140 wedged in the jam · f284 into the socket (hidden by the lid) · f321 revealed · f378 middle tier · f548 explores the steps · f630 into the module's inlay · f656 rides bar 4 · f709 sinks into the disc · f882 rises onto the core · f990 lifts · f1008 drops into the core · f1104 surfaces as the wordmark dot | stays to the end |
| **C1–C4** (chrome) | f44, from four frame edges | f93 converge · f138 jammed pile · f282 2×2 lid plate on K · f321 lid lifts · f378 top tier · f544 4 steps · f593 fused module · f614 seated in K · f656 four bars · f709 sink; their metal rises as the chrome ring · f765 links the black ring · f858 lies flat around the core · f900 rises into the collar · f966 turns | covered by the panel at f1016–1042 |
| **K** (black, your business) | f104, rising from below the shell edge | f165 sags under the jam · f282 squares, closed box · f321 socket revealed · f378 base tier · f544 black cube on the top step · f593 slab with socket · f656 disc · f745 black ring (your team) · f858 core cube · f966 turns | f1016 its top face grows into the dark panel |
| Dashed connectors | f165 (tangle) | f282 retract · f378 straight hero verticals · f442 column · f453–508 row leaders · f556 strategy path | leaders fold f538; path fades f593 |
| "AI" type | f14 | — | f78 slides left |
| "• YOUR BUSINESS" | f114 | f199 moves left with the group | f305 fades; **returns** f929; leaves f1008 |
| Portrait card | f199, from the right | f213 caption · f225 photo settles | f305 **shrinks into the Adrian tag** |
| "• INDEPENDENT AI CONSULTING" | f253 | — | f305 |
| Adrian tag | f305 (from the card) | f430 hover · f731 docks on the chrome ring · f765 rides into the link | f798 fades |
| Tags "A clear direction" / "A real-world advantage" | f350 / f398 | float | f430 / f434 |
| Rows 01–03 | f453 / f477 / f508 | f538 fold into row 01 → label slot | — |
| Label slot 01–04 | f538 | rolls f593, f656, f709 | f798 exits up |
| Measuring hairline | f674 | four steps | f700–710 |
| "Hype." / "Guesswork." | f802 / f827 | struck f809 / f835 | f854 fall away |
| Dark panel + arc | f1016, out of K's top face | — | to the end |
| "AI expertise. / Business impact." | f1034 | — | to the end |
| "Let's talk ↗" | f1063 | f1075 hover-press | to the end |
| Wordmark "Adrian Tineo•" | f1088 (dot = O at f1104) | — | to the end |

**Hand-offs (each exit names its entrance):** the dot leaves the word to hover above the business. K rises under the
waiting pieces. The jam slides left as Adrian slides in on the same vector. The jam resolves beside him into a box. The card
shrinks into a tag as the box comes forward. The lid lifts, then becomes a tier. The tiers become rows' anchors, then
steps. The steps fuse into the module, the module splits into bars, and the bars' metal becomes the ring. The disc becomes
the team ring, the rings lie down into the collar, and the core's face becomes the panel. The orb becomes the dot. The
focal point never jumps without a move to follow.

**Framing distances and density:**

| Phrases | Framing | Layout | Density |
|---|---|---|---|
| P1 | wide | left-weighted lock-up, all corners filled | dense |
| P2–P3 | medium | one object, centre-low | sparse → dense |
| P4–P5 | medium-wide | a person and an object | medium |
| P6–P7 | medium-close | the site's hero art | sparse |
| P8–P10 | medium | a diagram with rows | medium |
| P11–P15 | close | big form, big label | sparse |
| P16–P17 | type close-up | type and object | sparse |
| P18–P19 | medium | centred, single | single element |
| P20–end | wide | the panel | sparse |

That gives three-plus distances, alternating density, and one centred scene.

**Accepted deviation, for the judges:** object-led scenes lead P6–P15 three times in a row (hero art, diagram, services).
That is the brief's angle. Each of the three changes alignment (centred, right with rows, right with a big label), scale
(g 1.15 / 0.95 / 1.15), and what is primary (sculpture with tags, reading-order rows, sculpture with a label).

---

## 5. Runner-ups (rejected, and why)

| Beat | Runner-up | Why it lost |
|---|---|---|
| A Hook | The site's hero sculpture already assembled, which explodes outward on "everywhere". | An explosion reads as "breaking", not "everywhere", and it spends the site's hero image before Adrian has earned it. |
| A Hook (thread) | One continuous chrome tube (the enablement ring's material) that loops through the whole frame, tangles on "complicated", straightens for Adrian, then bends into the four forms. | It is the "line snaking through the frame" device Karl cut in September 2026. A tube is also outside the site's blocky isometric language, and the services become line drawings instead of sculptures. |
| A Problem | A square chrome peg that will not go into a round socket on the black block. | Clear but a cliché, and it is one object. The jam plus the tangle shows many things and their connections going wrong, and it sets up the exact fit in P12. |
| B Meet | The orb rolls in as the dot of "Adrian Tineo•" on "Tineo". | Lovely, but it spends the film's payoff at 8 s. Kept for the sign-off. |
| C Span (P6–P7) | A horizontal axis from "From possibility" to "a plan" (the site's words) with the orb travelling along it. | A route between two labels is abstract. A lid lifting is physical, reads in a second, and rebuilds the site's hero. |
| C Connects | Three interlinked rings for strategy, engineering and execution. | The most literal "connect", but it spends the enablement sculpture that "into your team" needs. |
| D Services | Four of the site's service cards built in a row, one per phrase. | A row of numbered cards is the presentation pattern, and it would duplicate the sculpture four times instead of carrying it. |
| D Team | The Adrian portrait tag sliding into a row of chrome "team" pillars. | Bars as people is a stretch. Interlinked rings are the site's own image for "bring your people with you" and read as "linked in" instantly. |
| E No hype / No guesswork | An oversized, over-glossy piece shrinking to the right size (hype deflated), then a piece dropping straight into place (no guesswork). | Neither reads with the sound off. Two struck words read in half a second and keep the site's type-led voice. |
| E Built around | The four service sculptures orbiting the black core. | A hub with orbits is a cliché, and it is busy. A collar rising around the core is one move that says "around". |
| F CTA | The core's face shrinks into the dark "Let's talk" button itself. | The same idea at a smaller scale. Growing it into the panel gives the site's contact panel, the site's H1 and the button room, and keeps the sign-off calm. |

---

## 6. Sound hints and sign-off

Music: a calm, premium bed (soft piano or felt keys over a warm pad) at a mid tempo. It stays sparse under A, gets a lift
at f282 (the resolution), runs a quiet pulse under D (one tick per form change), opens up at f900 (built around), swells
under the panel growing (f1016–1046), and resolves on a held chord at f1084 that rings out to f1170. From the candidates
in `sound/music/`, pick with `music_find.py`/`music_fit.py`.

SFX. Every sound is soft, warm and premium, ranked with `sfx_hear.py pick … "calm premium corporate"`. There is no sound
on floats or holds.

| Frame | Accent | Sound |
|---|---|---|
| f16 | the orb becomes the dot | a tiny glass tick |
| f50–58 | the cubes arrive everywhere | one airy swish, peaking at f52 (not one per cube) |
| f128 | K lands | a low, soft thud |
| f142, 148, 157 | the jam lands and shoves | three muted wooden-metal knocks, abrupt and dry |
| f169–183 | the tangle draws | a faint scratchy texture under it |
| f300 | the jam closes into the box | **one clean click**: the resolution |
| f325 | the lid lifts | a soft lift whoosh |
| f354, f402 | the tags | two light UI ticks |
| f446 | the column connects | a soft rising tone |
| f457, 481, 512 | rows 01–03 | three soft ticks on the beat |
| f569 | the black cube tops the steps | a tick |
| f630 | the module seats in the socket | **the film's main sound**: a deep, soft seated thunk |
| f640 | the orb in the inlay | a glass tick |
| f679, 684, 689, 694 | the measuring steps | four very soft ticks |
| f713–739 | the ring rises | a gentle swell |
| f781 | the rings link | a soft metallic clink |
| f811, f837 | the strikes | two pen-swipe whispers |
| f856 | the words fall away | one soft swish |
| f904–924 | the collar rises | a low build swell, settling at f924 |
| f966–996 | the turn | one slow rotational whoosh, peaking at f981 |
| f1012 | the orb drops into the core | a soft plip |
| f1016–1042 | the panel grows out of the core | a deep, soft whoosh, peaking at f1032 |
| f1077 | the button | a soft UI click |
| f1110 | the dot glints | a tiny glass tick, the last sound |

**Sign-off (36.1–39.0 s):** the dark contact panel framed by the paper rim. "Adrian Tineo•" sits top left, its dot the
chrome orb. "AI expertise. / Business impact." is in the site's two tones, with the white "Let's talk ↗" button below and
the faint arc on the right. Everything arrives and then holds; only the camera's last breath settles. No URL, no email, no
extra lines.

---

## 7. Checks and build notes

**Phrase coverage:** 22 of 22 phrases have their own visual event. Events in voice land at f16, 44, 78, 86, 104, 114,
138, 153, 165, 199, 213, 225, 253, 282, 305, 321, 350, 378, 398, 430, 442, 453, 477, 508, 538, 544, 556, 593, 614, 630,
656, 674, 709, 731, 745, 765, 798, 802, 809, 827, 835, 854, 858, 882, 900, 929, 960, 966, 990, 1008, 1016, 1034, 1063 and
1075. The longest stretch of voice without a new visual is about 1.2 s (f656 → f674, which is inside one morph), well
under 2.5 s. The silences carry working holds: f944–964 has the float and breath, and f1128–1170 is the sign-off.

**Things on screen:** never more than four groups. The maximum is P4–P5: the jam, Adrian's card and two eyebrows.

**Readability on a phone, sound off:** "AI•" opens. "YOUR BUSINESS" names the black block. Adrian is shown with his name
and title. The tags and rows label every abstract form. The service names are 84 px. "Hype." and "Guesswork." are 180 px
and struck. The H1 is 150 px, and the button is about 125 px tall. The smallest text is the 20 px eyebrows; at 40% of 1080p
they are about 8 px tall, and they are always secondary.

**Tells self-check:**
- No invented data. The bars have no values; every word is in the table in §2.
- No decorative filler. The numbers 01–04 index the real services. The sage dot appears only on site eyebrows. The blobs
  are only the site's own ambient.
- No glow, bounce or pops. Scale-from-zero is never used; the dot rises in.
- One centred scene.
- No looping attention motion, and the button gets a click, not a pulse.

**Build size:** the new kit primitives (`IsoBox`, `IsoFrame`, `Ring` with front and back halves, `Orb`, `DashedPath`
with draw-on, `PortraitCard` to `Tag`) come to about 350 lines. The scene state is one keyframe table per piece
(params by `T.k(g, "w:…", seconds, ease)`) in about six segment files of 150–250 lines each: hook and jam, Adrian, the
span, the services, the promise, the CTA. All of it is SVG and CSS transforms; there is no 3-D engine.

**Stills for the storyboard sheet (28):** f0, 30, 70, 118, 150, 185, 228, 300, 340, 372, 418, 470, 500, 532, 575, 600,
640, 692, 740, 786, 818, 848, 892, 944, 1000, 1046, 1083, 1169.
