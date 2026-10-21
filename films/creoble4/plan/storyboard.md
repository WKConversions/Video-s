# Creoble v4 (Danish), version 3: storyboard and build contract (55.2 s, 16:9, 60 fps)

## Karl's feedback on version 2 (read this first)
> "everything has the constant same motion moving to the left while sizing. it has too much of the same animation
> that it zooms in through text revealing the next. You need more difference and more variation. Also, the quality
> of the video is bad, it needs more frames to run smoothly... stuttering. i want more obvious apple style animation
> with bounce animations, liquid glass and typical apple style stuff. still creoble brand"

Version 1 was too static; version 2 was constant but monotonous: everything drifted left and grew, and too many shots
zoomed through text into the next. Version 3 keeps the constant motion and makes it **varied and obviously Apple**:
- **60 fps.** The composition renders at 60 fps.
  - Story passes `g = frame / 2`: your scene still thinks in 30ths of a second, labels and seconds as before, but
    **g is fractional**. Never index arrays with g; never assume integer g.
  - stills.mjs and draft.sh take **60 fps frame numbers** (frame = seconds × 60).
- **Variety is the rule.** Every shot below names its own motion. Don't reuse the same move twice in your span:
  - Directions change: up, down, right, left, diagonal, in depth, along an arc.
  - Holds change too: a float (a small sine bob), a slow sway in 3D, a slow rise, parallax. Never the
    drift-left-and-grow of version 2.
  - **Zoom through text into the next shot is banned.**
- **Bounce.** `bounce(g, at, response, damping)` overshoots and settles (damping 0.55 playful, 0.7 gentle). Use it for
  everything that pops, lands, drops, snaps or gets thrown: chips, tiles, icons, toggles, buttons, numbers, glass.
  `aspring` (damping 1) only for big carries.
- **Liquid Glass:** `LiquidGlass`. A refracting glass panel with a moving specular highlight; it bends what is behind
  it at its rim. Put it over moving content so the refraction shows. Animate `sheen` as it moves; give moving glass
  `squash(vx, vy)` so it stretches while travelling and rounds out when it stops.
- **Typical Apple:**
  - `Island`: a Dynamic-Island-style ink capsule that springs open into a status, the film's running status motif;
  - `Gooey`: liquid merge and split of sage blobs;
  - bento grids of tiles popping in with staggered bounces;
  - iOS notification stacks;
  - cover-flow carousels with momentum and rubber-band overscroll;
  - the iOS toggle with a bounce;
  - number tickers;
  - `BounceText`: letters popping in one by one with a bounce;
  - 3D card flips (once);
  - gravity drops with bounces;
  - arcs (things travel on curves, not straight lines).
- **Still minimal and still Creoble:**
  - 1–3 big things per shot, lots of whitespace;
  - sage, cream, ink; Fraunces for statements (italic deep sage); DM Sans for UI;
  - full sage or ink frames allowed as punctuation, 1–2 per builder.
- **Earlier versions are reference only:** `plan/v1-scenes/` and `plan/v2-scenes/`. Rewrite from scratch.

## Unchanged from version 2
- **Brief:** a new SaaS explainer for creoble.dk, for the website hero and LinkedIn. It shows the platform and its
  USPs, with a hook in the first 2 s.
- **Voice-over:** Danish, 53.6 s. Keys in `film/src/words.json` drop non-ASCII letters ("færdig" → `w:frdig`, "Én" →
  `w:n`, "kø" → `w:k`, "Så" → `w:s`, "ét" → `w:t`); repeats are numbered.
- **Music:** "Take this Higher", 122.8 BPM. It hits at 0.50 s; beat 0.4886 s; it breaks down at about 41–47 s and
  returns at about 47.4 s. Land pops on beats.
- **Truth:** only what creoble.dk says:
  - **The product:** tell about your business; built by AI in minutes; see it free; change it by writing.
  - **Price:** 499 kr once if happy, no subscription, the site is yours; not happy, it costs nothing.
  - **Hosting:** from 83 kr/md, "Betalt årligt"; domain and e-mail included; a fixed price at renewal; the domain in
    your name; EU servers / GDPR; no lock-in.
  - **Support:** a human answers; no queue, no robots.
  - **Never shown:** prices beyond these, a support person's name, real companies, Denmark or the language.
- **Excluded:** everything from the v1–v3 films: sky blue, Inter, the bakery, laptop and phone mockups, the globe, a
  giant centred 499 with a glow, the blue cursor (no cursor at all).
- **Readable:** text the viewer must read ≥ 28 px; statements 120–260 px.

## Kit (`src/shared.tsx`; read it once, never edit it)
- **Version 3 pieces:**
  - `bounce`, `squash`, `LiquidGlass` (w, h, radius, p, sheen, tint "clear", "sage" or "ink", transform);
  - `Island` (x, y top-centre; w, h; p from bounce);
  - `Gooey` (a wrapper; solid blobs inside merge);
  - `BounceText` (text, at, x, y, size, it, sans, color, itColor, stagger, align, damping);
  - `FilterDefs` (Story draws it).
- **Boundaries:** `pushOutUp`, `pushInUp`, `whipOutR`, `whipInR`, `SageIris`.
- **From earlier versions:**
  - motion and type: `aspring`, `press`, `drift`, `KineticLine`, `RollNumber`, `whipOut`, `whipIn`;
  - brand pieces: `Glass`, `Scrim`, `Statement`, `Label`, `Wordmark`, `PillButton`, `Card`, `Toggle`, `Check`,
    `Chip`, `Ico`;
  - product pieces: `Browser`, `HolmSite` (build, booking, scroll), `Builder`, `HOME`, `SiteHome`.
- **Timing:** `k`, `f`, `aspring` and `bounce` take a label or SECONDS; for 30-unit frame numbers use `kf`.

## Builders and boundaries (60 fps frames)
| Builder | File | Span (labels) | 60 fps frames |
|---|---|---|---|
| 1 | `S1.tsx` | open → h1 | 0–604 |
| 2 | `S2.tsx` | h1 → h2 | 604–1022 |
| 3 | `S3.tsx` | h2 → h3 | 1022–1594 |
| 4 | `S4.tsx` | h3 → h4 | 1594–2348 |
| 5 | `S5.tsx` | h4 → end | 2348–3310 |

Each boundary is different:
- **h1, speed-matched push UP.** B1's last shot translates by `pushOutUp(g, "h1")`. B2's first shot is composed and
  moving at h1 and translates by `pushInUp(g, "h1")`.
- **h2, a hard cut on the beat.** B3's first shot pops in fresh with a bounce on its first frames. B2 simply ends; its
  last shot is still moving.
- **h3, the sage iris.** BOTH B3 and B4 draw `<SageIris g={g} at="h3" />` on top of their content near h3. B3 for its
  last 11 frames, as the disc grows to cover; B4 for its first 13, as it shrinks to reveal.
- **h4, speed-matched whip to the RIGHT.** B4's last shot uses `whipOutR(g, "h4")`; B5's first uses
  `whipInR(g, "h4")`.

## Shot list (each line: the sentence, then its MOTION; keep the motion named)

### B1 (0–10.1)
1. **"Din nye *hjemmeside* er få minutter væk." (0.08–2.12), the hook. Motion: letter bounce + glass morph.**
   - "Din nye" and the italic "hjemmeside" pop in letter by letter (`BounceText`, Fraunces ≈ 190), "hjemmeside"
     landing on the 0.50 beat.
   - A `LiquidGlass` capsule bounces UP from below the words and squashes as it lands. On "minutter" it stretches
     wide and morphs (w, h, radius on springs) into a browser-sized glass window.
   - On "væk", sage blobs pour into it and merge (`Gooey`), then pop into the site's sections (HolmSite build,
     staggered).
2. **"Bygget af *AI*." (2.53–3.65). Motion: Island drop + staggered section pops + 3D tilt.**
   - An `Island` drops from the top centre and springs open: "✦ Bygget af AI".
   - The site's sections pop in with staggered bounces while the site tilts toward camera (rotateX 12° → 0°).
3. **"Fortæl kort om din virksomhed." (4.17–5.58). Motion: card rises from below + gravity drop.**
   - The builder's form card (a big `Card` with the Virksomhedsnavn field) slides UP into frame on a spring.
     "Holm Fysioterapi" types.
   - On "virksomhed" the industry chips drop from above and bounce on the field (gravity). The real labels: Sundhed /
     Klinik (selected), Håndværker / Service, Restaurant / Café.
4. **"Creoble bygger hele siden." (6.09–7.74). Motion: 3D flip up + vertical scroll with rubber-band.**
   - The card flips up (rotateX) and reveals the site on its back.
   - The site scrolls fast DOWN through the whole page, overscrolls at the bottom and rubber-bands back.
5. **"Ingen *teknik*." (8.13–8.79). Motion: split-screen slide from the right + gooey dissolve.**
   - A deep-sage panel slides in from the right and covers the frame. Cream `BounceText`.
   - A few code glyphs on blobs melt together (`Gooey`) and pop away.
6. **"Ingen skabeloner." (9.09–9.89). Motion: cover-flow carousel flicked RIGHT with momentum.**
   - Grey identical template cards in 3D cover-flow fly off to the right with momentum and rubber-band. The one real
     site stays, centred.
   - Then the speed-matched push UP out at h1.

### B2 (10.1–17.0)
7. **"Det *bedste*?" (10.31–10.76). Motion: push in from below (h1) + scale pop with bounce + shine sweep.** Big type,
   with a light sweep across the italic word.
8. **"Du ser den færdig, før du betaler en krone." (11.20–13.57). Motion: full-bleed pop with bounce + vertical
   scroll + Island.**
   - The finished site pops to full bleed (scale 0.9 → 1 with a bounce) and scrolls.
   - On "betaler en krone" an `Island` springs open at the top: "Betalt: 0 kr", with the 0 ticking in.
9. **"Vil du ændre noget?" (14.02–14.69). Motion: glass DROPS from the top with a bounce and squash.** The
   `LiquidGlass` prompt bar (≈ 1200 wide) falls in from above, squashes on landing and rounds out. The site keeps
   moving behind it, refracted at the rim.
10. **"Skriv det." (15.03–15.46). Motion: elastic stretch.** "Tilføj en knap til online booking" types (≈ 44 px), and
    the bar's width springs wider with the text (bounce). The send button presses.
11. **"Creoble retter det." (15.86–16.83). Motion: arc travel + liquid merge + Island.**
    - The sage send dot leaves the bar and travels on an ARC into the site's hero. It merges like liquid
      (`Gooey`) and pops out as the "Book tid" button (booking 0 → 1) with a bounce.
    - An `Island` "✓ Opdateret".
    - B2 ends here, still moving (hard cut at h2).

### B3 (17.0–26.6)
12. **"Tilfreds?" (17.29). Motion: hard cut on the beat + letter bounce, centred.**
13. **"499 kroner." (18.14–19.67). Motion: vertical ticker rolling DOWN with a bounce at the end.** "499" Fraunces
    ≈ 260, left of centre; "kr" drops in from above with a bounce.
14. **"Én gang." (20.05–20.43). Motion: coin bounce.** The number collapses into one sage coin that drops and bounces
    once on a hairline ("once"). "*Én* gang." pops beside it.
15. **"Intet abonnement." (20.85–21.64). Motion: slide in from the RIGHT + iOS toggle with a bounce.** A giant toggle
    (≈ 180 tall) labelled "Abonnement" switches OFF on the word with an overshoot.
16. **"Siden er din." (22.04–22.87). Motion: glass card pop + arc orbit dock.** The site in a `LiquidGlass` frame
    pops in. A "Din" chip with a user icon flies around it on an arc and docks with a bounce.
17. **"*Ikke* tilfreds?" (23.34–23.99). Motion: 3D flip (the film's only one).** Flip to a sage full frame, cream
    type.
18. **"Så koster det ingenting." (24.36–25.33). Motion: ticker 499 → 0 rolling UP with a bounce.** "0 kr" big,
    cream on sage.
19. **"Nul risiko." (25.67–26.44). Motion: icon pop with a bounce + letter bounce.**
    - A shield-check pops in big with a bounce, and "Nul risiko." bounces in letter by letter.
    - Then the `SageIris` grows from the shield to cover at h3.

### B4 (26.6–39.1)
20. **"Skal den på nettet?" (26.89–27.57). Motion: iris reveal + glass settle with a wobble.**
    - The `SageIris` shrinks to reveal a big `LiquidGlass` address bar floating over the scrolling site. It reads
      "Forhåndsvisning" and wobbles (squash) as it settles.
    - On "nettet" the text selects.
21. **"Vi sætter det hele op for dig." (28.01–29.40). Motion: notification stack.**
    - "holmfysio.dk" types.
    - Setup rows stack in from the top like iOS notifications, each pushing the others down on springs: Domæne ✓,
      E-mail ✓, SSL ✓, Hosting ✓.
    - An `Island` "● Live" on "dig".
22. **"Fra 83 kroner om måneden." (29.68–31.27). Motion: bento tile pops.** A bento grid begins: a big "Hosting" tile
    pops in with a bounce, and "83" ticks in, with "kr /md" and a small "Betalt årligt".
23. **"Domæne og e-mail er med." (31.58–32.97). Motion: staggered bento pops.** Two more tiles pop in beside it with
    staggered bounces: "holmfysio.dk" (globe) and "kontakt@holmfysio.dk" (mail).
24. **"Fast pris." (33.27–33.96). Motion: layout morph.** The Hosting tile expands to fill the grid (the other tiles
    slide aside on springs), showing "*Fast* pris." and a flat sage line drawing.
25. **"Også når du fornyer." (34.30–35.05). Motion: vertical year odometer.**
    - In the expanded tile the year rolls UP 2026 → 2027 → 2028 (a ticker) while "83 kr" stays put.
    - A grey dashed "Typisk webhotel" line jumps up.
26. **"Domænet i dit navn." (35.41–36.62). Motion: tile collapse + new tile pop.** The tile shrinks back; a new bento
    tile pops: "holmfysio.dk · Ejer: Holm Fysioterapi" (user icon).
27. **"Servere i Europa." (36.99–38.10). Motion: staggered dot pops in a ring.** A tile where twelve sage dots pop in
    one by one around a ring (bounce, no spin), with a server icon and a "GDPR" chip.
28. **"Ingen binding." (38.43–39.05). Motion: shackle spring + grid scatter.**
    - A padlock tile: the shackle springs open with a bounce on "binding".
    - The whole bento grid scatters, tiles flying out in different directions with momentum.
    - Then the whip RIGHT at h4.

### B5 (39.1–55.2)
29. **"Brug for hjælp?" (39.42–39.95). Motion: whip in from the left (h4) + drop bounce + gooey split.** A sage chat
    bubble drops with a bounce and splits like liquid into two bubbles.
30. **"Et menneske, der forstår din forretning." (40.35–42.16). Motion: message stack (iMessage) + bouncing typing
    dots + Island.**
    - Messages spring up from the bottom: the client's "Hej! Kan I hjælpe med at skifte et billede?", then typing
      dots that bounce, then the reply from "Creoble support" (neutral avatar): "Selvfølgelig! Jeg ordner det med det
      samme."
    - An `Island` "Creoble support · svarer nu".
31. **"Ingen kø." (42.58–43.12). Motion: squash and pop.** A ticket chip "Du er nr. 14 i køen" gets squashed and pops
    into droplets (`Gooey`). "Ingen kø." bounces in.
32. **"Ingen robotsvar." (43.46–44.29). Motion: gravity fall.** A "Bot" chip falls off the bottom with a bounce. A
    `KineticLine`: "Ingen *robotsvar*."
33. **"Creoble." (44.75–45.32). Motion: the full stop leads.** The sage full stop bounces in from above (two bounces)
    and lands. The `Wordmark` wipes in from it, right to left (h ≈ 170), on the breakdown.
34. **"Hjemmeside og hosting, samlet ét sted." (45.65–47.83). Motion: two glass tiles rise and merge like liquid.**
    - A site tile and a hosting tile ("Hosting · fra 83 kr /md · Betalt årligt") rise from bottom-left and
      bottom-right in `LiquidGlass`. On "samlet" they merge into one rounded card (overlap with a gooey sage join
      behind them).
    - The `Label` "Hjemmeside & hosting" draws.
35. **"Byg den." (48.21)**, 36. **"Se den." (48.86)**, 37. **"*Så* køber du." (49.55): vertical stack build on the
    music's return.**
    - Each line pops in with a bounce under the previous one; the stack shifts up as it grows.
    - Ink full frame with cream type is allowed.
38. **"Byg din side gratis på creoble.dk." (50.61–53.34). Motion: Island → button morph.**
    - An ink `Island` capsule springs open and morphs into the `PillButton` "Byg din side gratis" (size ≈ 38), with
      a press and shine on "gratis".
    - "creoble.dk" types under it.
    - A gentle float (a small bob) to the end; the last 0.6 s may hold.

## QC (on your draft at 60 fps)
- `bash ../../scripts/draft.sh <first60> <last60> out/draft.mp4`, then
  `python3 ../../scripts/clipcheck.py out/draft.mp4 <first60> src/words.json`. It now reads the fps from the clip.
- **Targets at 60 fps:**
  - moving in 99%+ of frames;
  - typical change **2%+ per frame** (= 4% at 30 fps);
  - longest still ≤ 0.15 s (the final hold is exempt);
  - every phrase "ok".
- **Variety:** list the motion of each shot in your report. No move twice in your span.
- **Smooth:** look at consecutive stills for jumps; ease every big move. Overshoot comes only from `bounce`.

## Workflow (each builder)
- **Your folder:** work only in `/home/user/Video-s/films/creoble4/work/<n>/` (node_modules and public are
  hardlinked: never write into them).
- **What you may edit:** your scene file only.
- **Stills:** `node stills.mjs <60fps frames> 1`; look at them with Read.
- **Draft:** as in QC above.
- **Speed:** aim for about 40 minutes.
