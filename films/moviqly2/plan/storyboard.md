# Moviqly film 2 — "Behind this prompt": storyboard and build contract (46.0 s, 16:9, 30 fps)

## Brief (Karl, for his own product Moviqly)
- Second SaaS explainer for the same platform, from Karl's script and VO (`vo/vo.mp3`, "Christina – Energetic
  Commercial", 44.6 s). Word times are in `film/src/words.json` as "w:…" labels.
- "About the platform, less problem solution, more platform." "Use the style of the platform." The test site
  https://moviqly.moviqly.workers.dev/ was captured in `harvest/` (landing, voice menu, sign-up, empty studio). It
  matches the local app in the inventory (https://claude.ai/artifact/37Tj26aL2ih9gVzSBcQvKr). No prompt was sent.
- **Script:**
  - Behind this prompt, an AI motion-design studio. Ask for an energetic, thirty-second film about your site.
  - Moviqly scans your site: headlines, numbers, colors, logo. It studies earlier films, so this one's different.
  - It picks one of nine forms, finds the idea, sets the art direction. Your storyboard arrives.
  - Every number and quote is checked against your site. Moviqly reviews test frames like an art director.
  - Your film plays beside the chat. Type "make it calmer". The storyboard updates.
  - Switch to Portrait; the canvas reshapes. Click Export MP4.
  - Every step visible. Every version saved. Describe your first motion. Make it Moviqly.

## This film must differ from film 1 (`films/moviqly/`): excluded
Film 1 used all of the following; none of it comes back here:
- **Opening and close:** a prompt box typing one sentence that grows into a playing film; a big centred logo build on
  a risen glow ("Meet Moviqly"); the landing-page CTA (logo, headline, prompt box, black "Get started" button clicked
  by a cursor).
- **Middle:**
  - a chain of big flat cards, one per pipeline step (a website card with a light sweep and colour chips, an
    "Understood" card, a script writing itself, palette swatches and a type specimen);
  - an activity card standing beside each card;
  - use-case chips;
  - the prompt box flying into a studio that assembles around it.
- **Showcase and outro:**
  - the canvas morphing 16:9 → 9:16 → 1:1 on three words;
  - the film shrinking into a gradient dot that bursts into orbiting film tiles;
  - the blue "Lumo" demo film;
  - POP overshoot on chips, checks and buttons;
  - push-ins on a world layer;
  - the glow resting under every scene.

## Thesis and allowed patterns (evaluation/tells.md)
- **Thesis:** Moviqly is a whole motion-design studio hidden behind one prompt box, and every decision it makes is
  out in the open. The film follows one film (for the fictional brand Fjello) through that studio, from the brief to
  the MP4, and comes back out to the prompt.
- **Allowed patterns:**
  - depth: the studio sits *behind* the prompt, things surface from depth and recede into it;
  - the thread object: the Fjello film, first a raw draft tile, then dressed, a storyboard, test frames, the
    playing film, the portrait film and the versions;
  - the app's real pieces (prompt box, studio, chat, activity steps, storyboard card, preview, format menu, Export
    MP4);
  - the studio floor (the canvas area's dot grid);
  - violet check marks (the app's step checks);
  - thin violet connector lines (comparison and fact check);
  - the landing glow, at the open and the close only;
  - a loupe (the art director's review);
  - one slow camera breath.
- **Not allowed:** anything else by habit: no bounce or overshoot, no spins, no orbiting tiles, no confetti, no
  sparkles, no extra headlines that repeat the VO.

## World and look (the platform's own language; film 2's composition)
- **Ground:** `Ground` in Story, warm paper with the studio canvas's dot grid. It fades in as we go behind the prompt
  (A) and out at the close (N). The landing `Glow` is drawn by scenes A and N only.
- **Platform:**
  - DM Sans, ink #26232C; purple/blue/cyan only as the M mark, gradient buttons and the selection or outline
    accents;
  - violet #8853DF for the checks.
- **Demo brand, Fjello** (fictional outdoor-gear shop, `shared.tsx`):
  - colours: pine #1F4D3B, ember #F07A2C, sand #F3EADB; type: Fraunces;
  - the site `FjSite` (with `SITE_SPOTS`), the 7-scene film `FjFrame` / `FjFilm` (calm version too), the raw
    `DraftTile` (dress 0..1), `FjLogo`, `Mountains`, `Product`;
  - its copy is the film's own fiction; never show a real company.
- **Earlier films:** `EarlierFrame` 0–4 (other briefs, other forms, labels in `EARLIER`).
- **Camera:** Story wraps every scene in one slow breath (`breath`). Scenes never pan or zoom the whole frame;
  transitions move content.

## Motion identity (motion/motion-identity.md)
- **Personality:** a precise studio at work. Energetic voice, crisp and confident moves, no playfulness: nothing
  overshoots.
- **Curves (`lib.tsx`):**
  - LAND (0.2, 0.9, 0.1, 1) is the signature: arrivals with a long precise settle;
  - CRAFT (0.76, 0, 0.24, 1) for carries and depth moves;
  - SNAP for UI state changes;
  - LEAVE for exits into depth;
  - no linear moves except progress bars.
- **Durations:** UI snaps 6–9 frames; arrivals 12–16; carries 18–24; depth moves 20–28.
- **Entrance pattern:** things surface from depth (`surface(p)`: scale 0.82 → 1, out of a blur), never rise from below
  or slide in from off-screen. Exits recede into depth (reverse) or are carried away by the thread object.
- **One dominant movement at a time.** Every phrase gets a visual event on its key word (below), on the word.

## Truth (only what the app does; inventory + test site)
- Brief in plain words; Moviqly reads the length, tone and website from it.
- It reads the site (headings, numbers, quotes, colours, fonts, logo, site pieces) and looks at earlier films to make
  this one different ("Looked at 5 earlier films…", "91% alike to the closest earlier film", then a new idea).
- It picks a form from nine (`EARLIER` lists five of the real names; all nine below), finds the idea, sets the art
  direction (world, type, palette, cuts, camera…), and the storyboard card appears.
- It checks facts ("Every number and quote is on the site"), renders test frames and reviews them (cut-off text,
  overlaps, broken images), then renders.
- The film plays in the preview beside the chat. A follow-up "make it calmer" updates the storyboard.
- The format menu (16:9 · Landscape, 9:16 · Portrait, 1:1 · Square) reshapes the canvas.
- Export MP4 shows "Export queued…", then "Rendering 42%", and the MP4 downloads by itself; the caption then shows
  "Download MP4 ↓". No "Downloaded" state.
- Every project keeps its chat, storyboards and versions.
- **The nine forms:** Product demo, Feature tour, Story ad, One continuous journey, Conversation, Typographic
  manifesto, Proof first, Living system, Classic explainer. Fjello's film is a Feature tour.
- **Never shown:** prices, user counts, file attachments or the voiceover recorder (in progress), the knowledge base,
  "local / no API fees", any URL of Moviqly.

## Kit (`src/shared.tsx`; read it once, never edit it)
- **Clock and type:** `k f kf typed`, `surface`, `Stage3D`, `Say`.
- **Ground and logo:** `Glow`, `Ground`, `breath`, `MMark`, `Wordmark`, `Logo`.
- **Icons:** `Ico` (names in `P`: loupe, eye, layers, sliders, bulb, portrait…), `Check`.
- **Buttons and boxes:** `SendButton`, `BlackButton`, `ExportButton` (real states), `PromptBox` (`promptH(w)`),
  `UserBubble`.
- **Chat:** `Activity` (steps or a folded line), `FJ_STEPS` and `steps(n, working)`, `StoryboardCard` (punchy or
  calm).
- **Studio:** `Preview` (`canvasBox`), `Studio` (`STUDIO`, `studioPane`, `canvasRect(ar)`), `ChatReady`, `ChatCalmer`,
  `BRIEF`, `filmClock`, `Cursor`.
- **Fjello:** `FjSite`, `SITE_SPOTS`, `SITE_W`, `SITE_BAR`, `FjFrame`, `FjFilm`, `fjAt`, `FJ_SCENES`, `DraftTile`,
  `FjLogo`, `FjPeak`, `Mountains`, `Product`, `EarlierFrame`, `EARLIER`.
- **Hand-offs:** `Handoff1`–`Handoff4` with `H1`, `H2`.
- **Tokens (`./lib`):** `C`, `FJ`, `FONT`, `SERIF`, `GRAD`, `GRAD_D`, the shadows, `LAND`, `CRAFT`, `SNAP`, `LEAVE`,
  `clamp01`, `mix`.

## Scenes, builders and hand-offs (labels in `src/clock.ts`)
| Scene | Span (labels → frames) | Builder |
|---|---|---|
| A, behind the prompt | open → sB (0–103) | 1 |
| B, the brief | sB → sC (103–212) | 1 |
| C, the scan | sC → h1 (212–366) | 1 |
| D, earlier films | h1 → sE (366–463) | 2 |
| E, form, idea, art direction | sE → sF (463–599) | 2 |
| F, storyboard arrives | sF → h2 (599–651) | 2 |
| G, fact check | h2 → sH (651–740) | 3 |
| H, test-frame review | sH → h3 (740–831) | 3 |
| I, plays beside the chat | h3 → sJ (831–891) | 4 |
| J, make it calmer | sJ → sK (891–999) | 4 |
| K, portrait | sK → sL (999–1084) | 4 |
| L, export | sL → h4 (1084–1142) | 4 |
| M, steps and versions | h4 → sN (1142–1242) | 3 |
| N, back to the prompt | sN → end (1242–1381) | 3 |

**How the hand-offs work:** at each hand-off frame the incoming scene draws exactly `HandoffN` and moves on from it.
The outgoing scene stops one frame before (`g >= f("h1")` → null) and arrives at exactly that state. Nothing is
drawn twice.

All times come from labels (`f("w:numbers")`, `k(g, "w:headlines", 0.4)`, `f("h1") - 8`), never frame numbers. Story
wraps everything in the breath, so draw in frame coordinates.

- **h1 (C → D):** `Handoff1`, the raw draft tile (dress 0), 720 × 405, centred, flat.
- **h2 (F → G):** `Handoff2`, the punchy `StoryboardCard` (w 700, size 22) at left 150, vertically centred.
- **h3 (H → I):** `Handoff3`, the reviewed frame alone at `canvasRect(16/9)`, showing `FjFilm s={1.6}`.
- **h4 (L → M):** `Handoff4 g={g}`, the studio: `ChatCalmer`, the preview in Portrait playing the calm film
  (`filmClock`), "Download MP4 ↓", Export idle.

## The film, phrase by phrase (compose each beat as a strong still first; few, big things)
Strategy per beat: the chosen idea first, the runner-up after "|". Every phrase gets an event on its key word (in
quotes, with its time).

### A, behind the prompt (0–3.4): "Behind this prompt, an AI motion-design studio."
- **0.0, the landing look:** the full `Glow` and a big `PromptBox` (w ≈ 1100, placeholder) on a `Stage3D`, slightly
  tilted back (rotateX ≈ 8°), already moving.
- **"Behind" (0.14) / "this prompt" (0.30–1.03):** the prompt box swings open like a door on its left edge (rotateY
  to ≈ −70°, CRAFT). The glow sinks away, Story's dot grid appears, and behind the box the studio is revealed: its
  stations stand in depth, dim and out of focus. They are the Fjello site, a few film tiles, the storyboard card, a
  step list with checks, the loupe.
- **"an AI motion-design studio" (1.36–3.27):** the stations come into focus front to back, one after another (each
  `surface`s and gets a small violet check). On "studio" (2.66) the whole studio is lit.
- **Out by sB:** the door swings shut (the box returns flat, front-on) and the stations recede into blur, ending with
  the box alone, front-on, where B wants it.
- **Runner-up:** | the box as a glass pane the studio is seen through (x-ray).

### B, the brief (3.4–7.1): "Ask for an energetic, thirty-second film about your site."
- **Placement:** the `PromptBox` front-on, lower half, off-centre is fine. "Ask for" (3.74): it types `BRIEF`, with
  the words landing on the voice.
- **Key words, as parsed tokens:**
  - On "energetic" (4.34), "thirty-second" (5.19) and "your site" (6.24), each key word lifts out of the typed line
    as a parsed token above the box. The tokens are white chips with an icon and a small caps key: "TONE ·
    Energetic", "LENGTH · 30 s", "WEBSITE · fjello.com".
  - Each surfaces from depth, leaving the text in place. This shows that Moviqly reads the brief.
- **Send (≈ 6.8):** the send button presses, the box sinks back into depth, and the WEBSITE chip stays, moving to
  where C will open the site.
- **Runner-up:** | the brief typed huge, without the box, words underlined as they are understood.

### C, the scan (7.1–12.2): "Moviqly scans your site: headlines, numbers, colors, logo."
- **"Moviqly scans your site" (7.38–8.75):** the WEBSITE chip opens into `FjSite`, large on the left (≈ 1000 wide,
  tilted a little in depth, rotateY ≈ 10°). A violet scan line (`GRAD` beam, soft glow) sweeps down while the page
  scrolls (scroll 0 → ≈ 520).
- **The four lifts:** on each word the named thing lifts off the page toward the viewer and is carried to a material
  rail on the right (`SITE_SPOTS` for the positions):
  - "headlines" (9.21): the headline;
  - "numbers" (10.04): "120" and "4.9 ★";
  - "colors" (10.74): four sampled colour discs, from pine, ember, sand and ink;
  - "logo" (11.54): the logo.
- **Out by h1 (11.97–12.2):** the site recedes into blur. The four materials gather onto a white card that settles
  exactly as `Handoff1`.
- **Runner-up:** | an x-ray of the page splitting into layers.

### D, earlier films (12.2–15.4): "It studies earlier films, so this one's different."
- **Start:** `Handoff1`. "It studies earlier films" (12.50–13.86): five `EarlierFrame` tiles (≈ 340 wide, form name in
  small caps under each) surface in depth on a shelf around and behind the draft.
- **The comparison:** violet connector lines draw from the draft to each tile in turn, each with a similarity
  percentage: 62%, 48%, 91% (the closest, its line turns the flag colour), 35%, 57%.
- **"so this one's different" (14.03–15.19):** the draft steps clear of the closest film. The earlier films recede and
  grey out, and the draft gets a gradient outline and a small "New idea" tag (the real step: "Found a new idea").
- **Runner-up:** | a timeline of past films with the new one placed in an empty slot.

### E, form, idea, art direction (15.4–20.0): "It picks one of nine forms, finds the idea, sets the art direction."
- **"picks one of nine forms" (15.73–17.32):**
  - A 3 × 3 grid of the nine forms surfaces: small white cards, each with the name and a simple glyph.
  - A violet selection ring hops across them and lands on **Feature tour** on "forms" (16.68).
  - The other eight recede.
- **"finds the idea" (17.62–18.46):** the idea lands on the draft as one big serif line: "Fjello gear goes further
  than the trail." (from `FJ_STEPS`), with a small `Ico` bulb.
- **"sets the art direction" (18.69–19.79):**
  - An art-direction console stands beside the draft: four sliders, PALETTE "Pine & ember", TYPE "Serif, bold",
    CUTS "Whip", CAMERA "Push-in".
  - The sliders snap in turn (SNAP), and with each one the draft is dressed a step further (`DraftTile` dress 0 → 1).
  - By ≈ 19.8 the draft is the finished first frame.
- **Runner-up:** | a mixing desk with knobs; | a spinning selector (rejected: no spins).

### F, the storyboard arrives (20.0–21.7): "Your storyboard arrives."
- **"arrives" (20.94):** the dressed frame becomes row 1's thumbnail, and the `StoryboardCard` builds around it. The
  rows land in a quick cascade (p 0 → 1 in ≈ 1 s), each surfacing.
- **End:** exactly `Handoff2`.
- **Runner-up:** | frames dealt like cards onto a table.

### G, the fact check (21.7–24.7): "Every number and quote is checked against your site."
- **Start:** `Handoff2`, with `FjSite` surfacing on the right (≈ 820 wide, scroll ≈ 560, so the stats and the quote
  show).
- **"Every number" (21.99–22.62):** the storyboard's "120 trails tested" row and the site's "120" highlight. A violet
  connector draws between them and a `Check` lands on the row.
- **"and quote" (22.82–23.08):** the same for the quote row and the site's quote.
- **"checked against your site" (23.36–24.48):** a step row lands between the two: a check and "Every number and quote
  is on the site".
- **Out by sH:** the site recedes, and the card's thumbnails lift off as test frames for H.
- **Runner-up:** | a highlighter running over both texts at once.

### H, the review (24.7–27.7): "Moviqly reviews test frames like an art director."
- **The light table:** the seven test frames (`FjFrame` 0–6, t 1) lie on a light table, a plane tilted back
  (rotateX ≈ 25°) in two rows.
- **"reviews test frames" (25.36–26.40):** a loupe (a white ring with a violet rim and a magnified view of what is
  under it) glides from frame to frame.
- **"like an art director" (26.40–27.46):**
  - The loupe stops on frame 1 of the film (scene 0): its headline runs off the right edge (cut-off text). The
    frame is flagged with a thin red outline and "Cut-off text".
  - The headline reflows inside the frame, and the flag becomes a `Check`.
  - The other frames get their checks in a quick sweep: "Review passed · No cut-off text, overlaps or broken
    images."
- **End:** the fixed frame lifts off the table, flattens, and lands exactly as `Handoff3`. Everything else is gone.
- **Runner-up:** | a red-pen markup over each frame.

### I, beside the chat (27.7–29.7): "Your film plays beside the chat."
- **Start:** `Handoff3`. The film plays from it (`filmClock`).
- **"Your film plays" (28.08–28.68):** the `Studio` assembles around the canvas from depth: the window and the
  preview pane `surface` while the canvas stays exactly in place.
- **"beside the chat" (28.68–29.59):** the chat column fills (`ChatReady`, its rows landing in turn).
- **Runner-up:** | the studio slides in from the left.

### J, make it calmer (29.7–33.3): "Type 'make it calmer'. The storyboard updates."
- **"Type" (30.01):** the composer types "make it calmer" on the words (30.62–31.56), with the caret. Send presses at
  ≈ 31.6.
- **The bubble:** the chat moves on from `ChatReady` to `ChatCalmer`'s layout. The bubble lands, and the activity runs
  briefly ("Working 0:08"), then folds.
- **"The storyboard updates" (32.03–33.18):**
  - The storyboard card is the subject, so it lifts forward out of the chat, big and readable (≈ 1.7×, with a deep
    shadow), next to the studio.
  - The Showcase row slides out, the durations tick up, and the header changes to "6 scenes · 30 s · smooth
    motion".
  - The card goes back into place by sK. At "w:updates" the preview's film switches to the calm version
    (`filmClock`).
- **End at sK:** the studio with `ChatCalmer` and the 16:9 calm film.
- **Runner-up:** | a before and after split of the two storyboards.

### K, Portrait (33.3–36.1): "Switch to Portrait; the canvas reshapes."
- **"Switch to Portrait" (33.59–34.45):** a `Cursor` clicks the format menu in the preview header, and the dropdown
  opens: 16:9 · Landscape ✓, 9:16 · Portrait, 1:1 · Square, with the `Ico` landscape, portrait and square icons. On
  "Portrait" (34.02) it is picked.
- **"the canvas reshapes" (34.89–36.05):**
  - The canvas animates 16:9 → 9:16 (CRAFT), and the film recomposes for portrait.
  - Crossfade the layout switch so nothing pops.
  - The canvas is the subject: the preview can lift forward a little while it reshapes.
- **Runner-up:** | a phone frame dropping in.

### L, export (36.1–38.1): "Click Export MP4."
- **"Click" (36.43):** the cursor presses Export MP4 in the header.
- **The button, big:** for legibility a large twin of the button (`ExportButton` size ≈ 40) stands forward under the
  header and mirrors its state:
  - "Export queued…";
  - "Rendering 42%" … 100% (37.2–37.9);
  - back to "Export MP4".
- **The download:** an MP4 file chip ("moviqly-7c1e09ab.mp4", `Ico` file) drops from it and settles, and the caption
  shows "Download MP4 ↓".
- **Out by h4:** the twin and the chip recede, ending at exactly `Handoff4`.
- **Runner-up:** | the film flying into a download tray.

### M, steps and versions (38.1–41.4): "Every step visible. Every version saved."
- **Start:** `Handoff4`.
- **"Every step visible" (38.38–39.64):** the folded activity unfolds and lifts out in front as a tall card with all
  of `FJ_STEPS`, big (size ≈ 24). Their checks land top to bottom in a quick cascade, and the clock reads "Worked
  for 3:48".
- **"Every version saved" (40.01–41.22):**
  - The step card and the studio recede, and behind them three versions stand in depth, staggered: v1 16:9 punchy,
    v2 16:9 calm, v3 9:16 calm, each a playing `FjFilm`.
  - They carry small labels: "Version 1 · punchy", "Version 2 · calmer", "Version 3 · portrait".
  - The header's "● All changes saved" can echo it.
- **Runner-up:** | a project history list.

### N, back to the prompt (41.4–46.0): "Describe your first motion. Make it Moviqly."
- **Bookend with A:** the versions slide back into depth behind a `PromptBox` that comes forward front-on, so the
  door closes. The `Glow` rises back (the landing look), and Story fades the dots.
- **"Describe your first motion" (41.71–43.11):** the empty box with a blinking caret, and the studio's empty-state
  label "DESCRIBE YOUR FIRST MOTION" (small caps, hairline pill) lands under it.
- **"Make it Moviqly" (43.53–44.37):** `MMark` and the headline "Make it Moviqly" ("Moviqly" in `GRAD`, `Say`, ≈ 120
  px) land above the box. Compose it differently from film 1: no "Get started" button, no cursor.
- **Then:** a calm hold to the end; only the glow drifts.

## Variety check (design/composition.md)
| Beat | Strategy | Composition |
|---|---|---|
| A | depth reveal | centre, deep |
| B | parsed tokens | low box, tokens above |
| C | site + rail | left / right, close |
| D | comparison shelf | wide, dense |
| E | grid → console | grid, then split |
| F | build-up | card, left |
| G | connectors | two columns |
| H | light table + loupe | tilted plane |
| I | assembly | full UI, wide |
| J | lift-out | UI + card forward |
| K | reshape | UI, canvas forward |
| L | big twin button | macro |
| M | lift-out + depth stack | tall card, then deep |
| N | bookend | centre |

- **Distribution:** three of fourteen centred; no structure more than twice in a row.
- **Framing:** wide, medium, close and macro.
- **Density:** alternates (D and H dense; F and L sparse).

## Motion and QC targets (on your draft)
- **`python3 ../../scripts/clipcheck.py out/draft.mp4 <first> ../../film/src/words.json`:**
  - moving in 97%+ of frames;
  - typical change 3–6%;
  - longest still ≤ 0.3 s (N after 45.2 s exempt);
  - every phrase "ok".
- **On screen:**
  - UI text in focus ≥ 22 px (lift it forward or show a big twin when the real UI is small);
  - no collisions, no text off-frame.
- **Code:** `npx tsc --noEmit` clean.

## Workflow (each builder)
- **Your folder:** work only in `/home/user/Video-s/films/moviqly2/work/<id>/`, a copy of `film/`. node_modules and
  public are hardlinked there: never write into them.
- **What you may edit:** your scene files (`src/scenes/X.tsx`). Never edit shared.tsx, lib.tsx, clock.ts or Story.tsx;
  write local helpers in your scene file.
- **Stills:** `node stills.mjs <frames> 1` → `out/test/fNNNN.png`. Batch 6–10 frames.
- **Draft:** `bash ../../scripts/draft.sh <first> <last> out/draft.mp4`, then run clipcheck on it.
- **Speed:** Karl wants speed. Aim to finish in about 40 minutes, with every phrase built and the hand-offs exact.
