# Creoble v4 (Danish), version 2: storyboard and build contract (55.2 s, 16:9, 30 fps)

## Why a version 2: Karl's feedback on version 1 (read this first)
> "i totally dont like it, the music is sad and the motion is slow. apple is constant clean motion. now very simple
> UI's just stand still with some small short visual or animation next to it. This is totally not what i want. apple
> style motion design is constant visualisation of text/voiceover and constant motion animation and transition. but
> minimal apple."

What changes:
- **Constant motion.** Every frame moves: no element ever holds still, and no shot is "a UI standing there with a
  small change next to it".
  - While an element is on screen it travels: a slow push (scale 1 → 1.05), a pan (40–150 px), a scroll, a slow 3D
    tilt changing a few degrees (`drift`).
  - Entrances carry momentum (springs from off-position).
  - Exits are transitions into the next shot.
- **Constant visualisation of the voice-over.**
  - Every sentence is its own shot with its own visual idea, about 1.4 s each, like Apple's product films.
  - Short lines become big kinetic type (`KineticLine`, Fraunces with italic sage words), and they move too.
- **Constant transitions.** Every sentence changes the picture with a real move. Use the Apple vocabulary:
  - zoom-through (scale into an element until it fills the frame and becomes the next shot);
  - push (the shot slides off as the next slides in, same speed);
  - morph (one object becomes the next: a field into a headline, a card into a chart);
  - 3D flip of a card;
  - mask wipe;
  - speed-matched whip (`whipOut` / `whipIn`);
  - match move (an element carried across the cut).
  - Vary them; never the same transition twice in a row.
- **Minimal Apple.** 1–3 big things per shot, lots of whitespace, Creoble's brand. Big type (120–260 px), big UI
  close-ups. Don't show the whole studio when one field, one button or one price says it.
- **Music:** "Take this Higher" (Mixkit, 122.8 BPM, bright and energetic, `sound/bed.wav`).
  - It hits at 0.50 s with the hook.
  - Beat = 0.4886 s; bars start at 0.50 + n × 1.954 s.
  - It breaks down at about 41–47 s and returns at about 47.4 s for "Byg den. Se den. Så køber du.".
  - Land big moves and cuts on beats where you can.
- Version 1's scenes are in `plan/v1-scenes/` for reference only. **Rewrite from scratch;** reuse an idea only if it
  becomes constant motion.

## Brief (unchanged)
- **What it is:** a new SaaS explainer for creoble.dk, for the website hero and the LinkedIn company page.
- **Goal:** show the platform and its USPs. Minimal Apple style in Creoble's own brand (`../brand/BRANDKIT.md`).
- **The hook:** must grab in the first 2 s.
- **Voice-over:** `vo/vo.mp3`, Danish, 53.6 s. Word starts are in `film/src/words.json`.
  - Keys drop non-ASCII letters: "færdig" → `w:frdig`, "Én" → `w:n`, "kø" → `w:k`, "Så" → `w:s`, "ét" → `w:t`.
  - Repeats are numbered: `w:ingen2`, `w:det3`.
  - Check words.json for every key you use.
- **Excluded:** everything from the v1–v3 films (`../creoble/deliver`):
  - sky blue, Inter, the blur-rise word build, the bakery;
  - laptop and phone mockups, tilted 3D layer stacks, the page fan, the globe, the phone checkout;
  - a giant centred 499 with a glow, a struck-out code tile, the blue cursor (no cursor at all).

## Look (Creoble's brand; `src/lib.tsx`)
- **Colour:** ground #FAFAF8 (Story draws it); ink #1A1614; sage #87A89E; deep sage #495D58 for italic words; light
  sage #A8C4BB; cream cards #F7F4ED with a #E8E5DF hairline.
- **Full-frame colour moments:** sage, deep sage or ink are allowed for 1–2 short kinetic-type shots per builder.
  Apple films punctuate with them. Cream type on sage or ink. No orange, no other hues.
- **Type:** Fraunces 400 (−0.025em) for statements and numbers, italic deep-sage key words; DM Sans 400/500 for the
  interface.
- **The client's site:** `HolmSite` ("Holm Fysioterapi", fictional), the thread object of the film, shown big and
  moving: scrolling, flying, zooming.

## Motion rules (measured)
- **No still frame, ever:** the final 0.6 s hold is the only exception.
- **Constant travel:** every element on screen is travelling.
- **Entrances:** `aspring` (response 0.35–0.5, damping 1, or 0.85 only for something thrown).
- **Holds:** `drift`.
- **Exits:** into the next shot.
- **One dominant move at a time, but always one.** Secondary layers drift slower (parallax).
- **Speed:** fast moves are welcome. The final render has motion blur. Ease them (never a linear start or stop on a
  big move) and speed-match cuts (Karl: the cut on the fastest frame).
- **Never:** pan or zoom the whole frame as a camera shake. Move content layers instead. Story keeps a slow breath.
- **QC targets** (`clipcheck.py` on your draft; Karl's norm):
  - moving in 99%+ of frames;
  - typical change **4%+** of the frame;
  - longest still ≤ 0.15 s;
  - every phrase "ok".
- **Readable:** text the viewer must read ≥ 28 px; statements 120–260 px.

## Truth (creoble.dk, 21 Oct 2026)
- **The product:** tell about your business (no tech, no templates to fiddle with); Creoble builds the whole site in
  minutes, with AI. You see it finished, free; change it by writing.
- **The deal:** 499 kr once if you are happy, no subscription, the site is yours. If you are not happy, it costs
  nothing.
- **Hosting:** optional, set up for you, from 83 kr/md (paid yearly; show "Betalt årligt" small), domain and e-mail
  included, a fixed price that does not rise at renewal, the domain in your name, European servers (GDPR), no
  lock-in.
- **Support:** a human answers; no queue, no robot answers.
- **Brand lines:** "Hjemmeside & hosting, samlet ét sted"; "Byg din side gratis"; creoble.dk.
- **Never shown:** the Trustpilot score, packages, the chatbot, invented numbers, a support person's name, real
  companies, Denmark or the language.

## Kit (`src/shared.tsx`; read it once, never edit it)
- **New for version 2:**
  - `drift(g, from, to, a, b)`: constant travel over a shot;
  - `KineticLine`: Apple kinetic type. Words spring in on their labels, the line drifts and grows while it holds,
    and it pushes out on `out`;
  - `RollNumber`: digits that roll like a counter, e.g. 0 → 499, or 499 → 0 with `from`;
  - `whipOut`, `whipIn`, `whipFade`, `WHIP`: the speed-matched whip;
  - `aspring` and `press`: Apple springs and press feedback;
  - `Glass` (it materializes) and `Scrim`.
- **Brand:** `Statement`, `Label`, `Wordmark` (p builds it; the full stop lands last), `PillButton`, `Card`,
  `Toggle`, `Check`, `Chip`, `Ico`.
- **Product:** `Browser` (url, live), `HolmSite` (build, booking, scroll), `Builder` (name, branche, step, press),
  `HOME`, `SiteHome`.
- **Timing:** `k`, `kf`, `f` and `aspring` take a LABEL ("w:skriv", "h2+0.2") or a time in SECONDS. For frame numbers
  use `kf(g, frame, frames)`.

## Builders and boundaries
| Builder | File | Span | Frames |
|---|---|---|---|
| 1 | `S1.tsx` | open → h1 | 0–302 |
| 2 | `S2.tsx` | h1 → h2 | 302–511 |
| 3 | `S3.tsx` | h2 → h3 | 511–797 |
| 4 | `S4.tsx` | h3 → h4 | 797–1174 |
| 5 | `S5.tsx` | h4 → end | 1174–1655 |

**Each boundary is a speed-matched whip to the left** (no shared state to match):
- The outgoing builder translates its whole final shot by `whipOut(g, "hN")` (with `whipFade`) over its last WHIP
  frames, and returns null from f("hN").
- The incoming builder translates its whole first shot by `whipIn(g, "hN")` from f("hN"). Its first shot must already
  be composed and moving on that frame: no build-up from empty.
- B1 starts on the ground at frame 0. B5 ends with a calm hold that still drifts.

## Shot list: one shot per sentence (ideas; make each a strong, moving still)

### B1, open → h1 (0–10.1)
1. **"Din nye *hjemmeside* er få minutter væk." (0.08–2.12), the hook:**
   - "Din nye" springs in big (Fraunces ≈ 200). On "hjemmeside" the italic sage word lands larger still.
   - On the beat at 0.50, zoom THROUGH the word: scale it up fast until a letter's counter fills the frame. Inside,
     a website is already assembling: the `HolmSite` frame flies forward from depth, its sections snapping in
     fast in staggered order (`build` 0 → 0.7).
   - On "få minutter væk" a slim sage progress ring completes around a small clock icon at the frame's corner.
   - The frame keeps flying (scale and rotateY easing from 14° → 0°).
2. **"Bygget af AI." (2.53–3.65):**
   - A bright light-sage sweep crosses the site and it resolves (build → 1).
   - Kinetic type "Bygget af *AI*." slides across the front, Glass behind it, with the sparkle icon.
   - The site keeps scrolling under it.
3. **"Fortæl kort om din virksomhed." (4.17–5.58):**
   - Morph: the site shrinks into a single huge input field, a close-up of Creoble's builder field "Virksomhedsnavn",
     1300 px wide, DM Sans 64 px. "Holm Fysioterapi" types on the voice.
   - The field slowly pushes in. On "virksomhed" industry chips fly in under it ("Sundhed / Klinik" selected with a
     spring). These are the real labels: Sundhed / Klinik, Håndværker / Service, Restaurant / Café.
4. **"Creoble bygger hele siden." (6.09–7.74):**
   - The typed name morphs into the site's headline as the whole page builds around it.
   - Then the page scrolls fast from top to bottom in one continuous move: hero → services → contact strip.
   - Sections fly into place just ahead of the scroll.
5. **"Ingen teknik." (8.13–8.79):** whip to a kinetic type shot "Ingen *teknik*." on a deep-sage full frame (cream
   type). Behind the word a few code glyphs (`</>`, `{ }`) fly off the edge and dissolve.
6. **"Ingen skabeloner." (9.09–9.89):** push to a fast horizontal carousel of identical grey template thumbnails
   sliding left. On "skabeloner" they drop away, one after another, leaving the one real site flying forward. Whip
   out at h1.

### B2, h1 → h2 (10.1–17.0)
7. **"Det *bedste*?" (10.31–10.76):** whip in: huge kinetic type, centred, with a scale push.
8. **"Du ser den færdig, før du betaler en krone." (11.20–13.57):**
   - Zoom through the "?" into the finished site, full-bleed and scrolling with parallax: the photos move slower than
     the text.
   - On "betaler en krone", a big Fraunces "0 kr" slides up over the site on a Glass card, rolling 9 → 0
     (`RollNumber`).
9. **"Vil du ændre noget?" (14.02–14.69):** push: the Glass prompt bar rises big (1200 px wide) across the moving
   site. Kinetic "Vil du ændre noget?" types into its placeholder.
10. **"Skriv det." (15.03–15.46):** close-up of the bar. "Tilføj en knap til online booking" types at 40 px. Send
    `press`es on "det2"; the bar pushes in.
11. **"Creoble retter det." (15.86–16.83):** zoom through the send button into the site's hero. The "Book tid" button
    grows in with a spring and a sage ripple ring. Whip out at h2.

### B3, h2 → h3 (17.0–26.6)
12. **"Tilfreds?" (17.29–17.79):** whip in: kinetic type "Tilfreds?" big on the ground, sliding.
13. **"499 kroner." (18.14–19.67):** "499" rolls up from 000 huge (Fraunces ≈ 260); "kr" springs in. The number keeps
    drifting toward the camera (scale 1 → 1.06).
14. **"Én gang." (20.05–20.43):** the number slides up and out; "Én gang." pushes in. A single sage line draws under
    it.
15. **"Intet abonnement." (20.85–21.64):** a giant Apple toggle (height ≈ 180) labelled "Abonnement" slides in and
    switches OFF on a spring exactly on "abonnement". The toggle keeps drifting.
16. **"Siden er din." (22.04–22.87):** the site flies in, tilted, and lands. A Glass "Din" chip with a user icon
    clips onto it; "Siden er *din*." kinetic beside it.
17. **"Ikke tilfreds?" (23.34–23.99):** a 3D flip of the whole shot (rotateY, spring, no spin) to "*Ikke* tilfreds?" on
    a sage full frame.
18. **"Så koster det ingenting." (24.36–25.33):** "499" rolls DOWN to "0" (`RollNumber` from 499) as "kr" stays: "0
    kr", big, cream on sage.
19. **"Nul risiko." (25.67–26.44):** a shield-check icon draws big, and "Nul risiko." springs in beside it. Whip out
    at h3.

### B4, h3 → h4 (26.6–39.1)
20. **"Skal den på nettet?" (26.89–27.57):** whip in: a huge Glass address bar (1400 × 120, DM Sans 56) slides across
    a moving site. It reads "Forhåndsvisning"; on "nettet" it selects.
21. **"Vi sætter det hele op for dig." (28.01–29.40):**
    - "holmfysio.dk" types in the bar.
    - Four rows cascade up under it and check on the words: Domæne ✓, E-mail ✓, SSL ✓, Hosting ✓.
    - The lock and "● Live" pop on "dig".
22. **"Fra 83 kroner om måneden." (29.68–31.27):** push: "83" rolls in (≈ 240), with "kr /md". "Betalt årligt" sits
    small under it. It drifts.
23. **"Domæne og e-mail er med." (31.58–32.97):** two chips are thrown in from the sides and dock under the price on
    springs (damping 0.85, because they were thrown): "holmfysio.dk" (globe) and "kontakt@holmfysio.dk" (mail).
24. **"Fast pris." (33.27–33.96):** morph: the price shrinks to the left end of a sage line that draws across the
    frame. Kinetic "*Fast* pris." above it.
25. **"Også når du fornyer." (34.30–35.05):**
    - The line keeps travelling: the content pans left through year ticks 2026 → 2027 → 2028, with the sage line
      flat.
    - A grey dashed "Typisk webhotel" line steps up after the first year.
26. **"Domænet i dit navn." (35.41–36.62):** a domain card flies in on a slight 3D tilt that straightens: "holmfysio.dk ·
    Ejer: Holm Fysioterapi" (user icon).
27. **"Servere i Europa." (36.99–38.10):** push: twelve small sage dots assemble into a ring (the EU circle, not
    spinning). Kinetic "Servere i *Europa*." with a server icon. "GDPR" chip.
28. **"Ingen binding." (38.43–39.05):** a big padlock: its shackle lifts open on "binding" with a spring, and it is
    thrown off frame. Whip out at h4.

### B5, h4 → end (39.1–55.2)
29. **"Brug for hjælp?" (39.42–39.95):** whip in: a big dark-sage chat bubble icon (the site's help bubble) springs
    in and expands into a Glass chat card.
30. **"Et menneske, der forstår din forretning." (40.35–42.16):**
    - The chat scrolls continuously.
    - The client's message: "Hej! Kan I hjælpe med at skifte et billede?".
    - Typing dots, then the reply from "Creoble support" (neutral avatar, online dot): "Selvfølgelig! Jeg ordner det
      med det samme."
31. **"Ingen kø." (42.58–43.12):** a chip "Du er nr. 14 i køen" rolls its number 14 → 0 and flies off; kinetic "Ingen
    kø."
32. **"Ingen robotsvar." (43.46–44.29):** a "Bot" chip is struck through and falls away; kinetic "Ingen *robotsvar*."
33. **"Creoble." (44.75–45.32):** zoom-through to the ground. The `Wordmark` builds big (h ≈ 170), and its full stop
    lands on the word, on the breakdown.
34. **"Hjemmeside og hosting, samlet ét sted." (45.65–47.83):** the site frame and the hosting card fly in from left
    and right and snap together under the wordmark on "samlet". The `Label` "Hjemmeside & hosting" draws.
35. **"Byg den." (48.21–48.61)**, 36. **"Se den." (48.86–49.29)**, 37. **"Så køber du." (49.55–50.17):** three fast
    kinetic beats on the music's return. Each pushes the last up and out, and "Så" is italic sage. Or one line whose
    words land in sequence while it slides.
38. **"Byg din side gratis på creoble.dk." (50.61–53.34):**
    - The `PillButton` "Byg din side gratis" springs in big (size ≈ 34), with `press` and `shine` on "gratis".
    - "creoble.dk" types under it.
    - It all keeps a slow push (scale 1 → 1.04) to the end. The last 0.6 s may hold.

## Workflow (each builder)
- **Your folder:** work only in `/home/user/Video-s/films/creoble4/work/<n>/` (node_modules and public are
  hardlinked: never write into them).
- **What you may edit:** your scene file only.
- **Stills:** `node stills.mjs <frames> 1`; look at them with Read.
- **Draft:** `bash ../../scripts/draft.sh <first> <last> out/draft.mp4`, then
  `python3 ../../scripts/clipcheck.py out/draft.mp4 <first> src/words.json`.
- **Speed:** aim for about 40 minutes.
