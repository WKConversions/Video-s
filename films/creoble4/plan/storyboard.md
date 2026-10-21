# Creoble v4 (Danish), storyboard and build contract (55.2 s, 16:9, 30 fps)

## Brief (Karl, for Creoble)
- **What it is:** a new SaaS explainer for creoble.dk. It plays as the hero video on their website and on their
  LinkedIn company page. **It is a new film**, not v1–v3 with a new voice-over (see the exclusions below).
- **Goal:** show the platform and its USPs.
- **Style:** minimal interfaces, minimal frames, an Apple-style film in Creoble's own brand
  (`../brand/BRANDKIT.md`), with Apple-style animations and transitions here and there.
- **The hook:** a strong visual hook on the opening line. It is the first thing a visitor and a LinkedIn scroller
  see.
- **Voice-over:** `vo/vo.mp3`, Danish ("Mathias", 53.6 s). Word starts are in `film/src/words.json`.
  - Keys are the script's words in lower case with æ, ø, å and other non-ASCII letters dropped: "færdig" →
    `w:frdig`, "Én" → `w:n`, "kø" → `w:k`, "Så" → `w:s`, "ét" → `w:t`.
  - A repeated word gets a number: `w:ingen2`, `w:det3`, `w:creoble2`.
  - The full list of keys is in words.json; check it before you use a key.
- **The client's standing wishes** (all Creoble films):
  - cream or off-white background, with the brand colour (sage) as the primary colour;
  - no orange;
  - clean, minimalist, Apple-like.

## Script, with the sentence times (s)
| Time (s) | Line |
|---|---|
| 0.08 | Din nye hjemmeside er få minutter væk. |
| 2.53 | Bygget af AI. |
| 4.17 | Fortæl kort om din virksomhed. |
| 6.09 | Creoble bygger hele siden. |
| 8.13 | Ingen teknik. |
| 9.09 | Ingen skabeloner. |
| 10.31 | Det bedste? |
| 11.20 | Du ser den færdig, før du betaler en krone. |
| 14.02 | Vil du ændre noget? |
| 15.03 | Skriv det. |
| 15.86 | Creoble retter det. |
| 17.29 | Tilfreds? |
| 18.14 | 499 kroner. |
| 20.05 | Én gang. |
| 20.85 | Intet abonnement. |
| 22.04 | Siden er din. |
| 23.34 | Ikke tilfreds? |
| 24.36 | Så koster det ingenting. |
| 25.67 | Nul risiko. |
| 26.89 | Skal den på nettet? |
| 28.01 | Vi sætter det hele op for dig. |
| 29.68 | Fra 83 kroner om måneden. |
| 31.58 | Domæne og e-mail er med. |
| 33.27 | Fast pris. |
| 34.30 | Også når du fornyer. |
| 35.41 | Domænet i dit navn. |
| 36.99 | Servere i Europa. |
| 38.43 | Ingen binding. |
| 39.42 | Brug for hjælp? |
| 40.35 | Et menneske, der forstår din forretning. |
| 42.58 | Ingen kø. |
| 43.46 | Ingen robotsvar. |
| 44.75 | Creoble. |
| 45.65 | Hjemmeside og hosting, samlet ét sted. |
| 48.21 | Byg den. |
| 48.86 | Se den. |
| 49.55 | Så køber du. |
| 50.61–53.34 | Byg din side gratis på creoble.dk. |

The film ends at 55.2 s, after a calm hold.

## Excluded: everything v1–v3 used (`../creoble/deliver/`, `../creoble/plan/`)
- **Colour and type:** sky blue anywhere; Inter; the word build where words rise, fade and sharpen out of a blur.
- **Story content:** the bakery "Bageriet Lund"; the blue AI orb; the blue guide cursor (no cursor at all in v4).
- **Devices and depth:** laptop and phone mockups; tilted 3D UI layer stacks; the fan of page previews; the globe;
  a phone checkout.
- **Specific gags:** a giant centred "499" with a glow; a code tile struck through; floating "Aa", palette and
  layout cards around the opening question; the wordmark at the end with a "creoble.dk" chip clicked by a cursor.

## Thesis and allowed patterns
- **Thesis:** your website, from a few words to live on its own domain, in one calm place. The film follows one
  client's website, "Holm Fysioterapi" (fictional), and every USP happens *to that website*. The thread object is the
  browser frame with the site.
- **Allowed patterns:**
  - editorial statements: Fraunces 400, lines revealed through a mask, italic key words in deep sage, exactly as
    creoble.dk sets its headlines;
  - Creoble's real UI: the builder step, cream cards, black and sage pill buttons, the eyebrow label;
  - the minimal browser frame with the site;
  - simple data UI: a toggle, a receipt, a flat price line, chips, checks, a chat;
  - Apple-style transitions: a frame expanding to full screen, a mask wipe, a card morphing into the next card,
    a hairline drawing into a frame, a page sliding under its frame;
  - one slow camera breath (Story).
- **Not allowed:** anything by habit: no bounce or overshoot, no blur-ins, no spins, no particles or confetti, no
  gradients outside sage, no big centred statement more than twice.

## Look (Creoble's brand; `src/lib.tsx`)
- **Ground:** #FAFAF8, flat and quiet.
- **Colour:**
  - text #1A1614;
  - sage #87A89E for fills, checks, the toggle and the wordmark's full stop;
  - deep sage #495D58 for italic accent words and small labels;
  - light sage #A8C4BB for hairlines;
  - cards #F7F4ED with a #E8E5DF hairline;
  - the dark sage #4A6B62 of the help bubble.
- **Type:**
  - Fraunces 400, −0.025em, for statements and big prices;
  - DM Sans 400/500 for the interface; labels in DM Sans 500, uppercase, tracked 0.2em, with a hairline before.
- **The client's site (`HOLM`):** its own slate teal (#2E4A52) on warm stone, in DM Sans 600. It must never look
  like Creoble's UI.
- **Composition:**
  - lots of whitespace and few things: at most about 3 at once;
  - statements left-aligned with a generous margin (x ≈ 140–180), like creoble.dk; centred only for "Det bedste?"
    and the sign-off;
  - text the viewer must read is at least 24 px on screen.

## Motion identity
- **Personality:** calm, editorial, precise. Apple's restraint: one dominant move at a time, generous holds that
  still breathe.
- **Curves (`lib.tsx`):**
  - OUT (0.22, 1, 0.36, 1), the signature, for reveals and arrivals;
  - INOUT for carries, frame expansions and morphs;
  - WIPE for mask wipes;
  - EXIT for leaving.
- **Durations:** UI changes 0.3–0.45 s; reveals 0.55 s; carries and morphs 0.7–1.0 s.
- **Entrance pattern:**
  - words are revealed through a mask (`Statement`);
  - objects `settle` (scale 0.965 → 1 with a fade);
  - frames draw their hairline first, then fill.
- **Exits:** wipe up through the mask, or the thread object carries everything away.
- **Transitions:** an Apple-style move about every 8–10 s, chosen from the allowed list. Always on an object you can
  name, never a camera pan or zoom of the whole frame.

## Truth (creoble.dk, 21 Oct 2026)
- Tell about your business (no tech, no templates to fiddle with). Creoble builds the whole site in minutes from your
  words; it is built with AI.
- You see it finished in your browser, free. You change it by writing what you want.
- Pay 499 kr once if you are happy (no subscription, the site is yours). If you are not happy, it costs nothing.
- Optional hosting, set up for you: from 83 kr/md (paid yearly; show "Betalt årligt" small under the price),
  domain and e-mail included, a fixed price that does not rise at renewal, the .dk domain registered in your name,
  European servers (GDPR), no lock-in (ingen binding).
- A human answers; no ticket queue, no robot answers.
- Tagline "Hjemmeside & hosting, samlet ét sted"; button "Byg din side gratis"; creoble.dk.
- **Never shown:**
  - the Trustpilot score, the packages, the chatbot, invented numbers;
  - "gratis hosting", a person's name for support (support is "Creoble support", with a neutral avatar);
  - real companies;
  - anything that mentions Denmark or the language.

## Kit (`src/shared.tsx`; read it once, never edit it)
- **Clock and motion:** `k f kf typed settle breath`.
- **Type and brand:** `Statement` (words, mask reveal, `it` for italic sage), `Label`, `Wordmark` (p builds it; the
  full stop lands last).
- **Icons and buttons:** `Ico` (names in `P`), `PillButton` (ink, sage or outline; `press`, `shine`).
- **Small pieces:** `Card`, `Toggle`, `Check`, `Chip`.
- **Frames:** `Browser` (`BAR`, url, live), `HolmSite` (`SITE`; build 0..1, booking 0..1, scroll).
- **Builder:** `Builder` (`STEPS`; name, caret, branche, step, press).
- **Home and hand-offs:** `HOME`, `SiteHome`, `Handoff1`–`Handoff4`.

## Builders and hand-offs (labels in `src/clock.ts`)
| Builder | File | Span | Frames |
|---|---|---|---|
| 1 | `S1.tsx` | open → h1 ("Det bedste?" − 0.25 s) | 0–302 |
| 2 | `S2.tsx` | h1 → h2 ("Tilfreds?" − 0.25 s) | 302–511 |
| 3 | `S3.tsx` | h2 → h3 ("Skal" − 0.3 s) | 511–797 |
| 4 | `S4.tsx` | h3 → h4 ("Brug" − 0.3 s) | 797–1174 |
| 5 | `S5.tsx` | h4 → end | 1174–1655 |

At each hand-off frame the incoming builder draws exactly `HandoffN` and moves on from it. The outgoing builder's
scene returns null from that frame and arrives in exactly that state on the frame before.
- **h1:** `SiteHome`, preview, no booking button.
- **h2, h3:** `SiteHome booking={1}`.
- **h4:** `SiteHome booking={1} url="holmfysio.dk" live={1}`.

Use labels for all times (`f("w:skriv")`, `k(g, "w:krone", 0.5)`, `f("h2") - 10`), never frame numbers.

## The film, phrase by phrase (compose each beat as a strong still first)

### B1, the hook (0–10.1)
- **"Din nye *hjemmeside* er få minutter væk." (0.08–2.12): the hook. The word becomes the website.**
  - The statement reveals on its words: left-aligned, about 150 px, "hjemmeside" in italic sage.
  - On "hjemmeside" (0.50), a sage hairline draws a rectangle around the italic word, and the rectangle grows into
    the Browser frame: the word becomes the site. The statement carries on around it ("er få minutter væk."), then
    wipes up and out by about 2.2 s.
  - On "minutter" (1.52), a thin sage progress line runs along the frame's top edge, and the site's placeholders
    appear in quick order (HolmSite build ≈ 0 → 0.3).
- **"Bygget af AI." (2.53–3.65):** a soft light-sage sweep passes over the frame and resolves the placeholders into
  the real site (build → 1). A small chip "Bygget af AI" (sparkle icon) settles at the frame's corner.
- **"Fortæl kort om din virksomhed." (4.17–5.58):**
  - Apple transition: the site frame slides back and aside while Creoble's `Builder` comes forward as one frame
    (a card morph is good).
  - "Holm Fysioterapi" types in Virksomhedsnavn on the voice, with the caret. Branche becomes "Sundhed / Klinik".
- **"Creoble bygger hele siden." (6.09–7.74):**
  - "Næste" presses, and the rail's steps tick in quick turn.
  - The builder morphs back into the site frame.
  - On "hele siden" the whole page is shown: it scrolls top to bottom inside its frame (scroll 0 → about 690 → back),
    or the frame grows tall. The nav items can light up as it passes.
- **"Ingen teknik. Ingen skabeloner." (8.13–9.89):** two short beats with whitespace.
  - On "teknik", a small dark code panel (a few lines of HTML) slides away from beside the site and dissolves.
  - On "skabeloner", a 3 × 2 grid of identical grey template thumbnails behind the site falls away.
  - Or: two Statement lines on the left with the site to the right. Your choice, but it must be visual.
- **End:** exactly `Handoff1` at h1.

### B2, see it, change it (10.1–17.0)
- **"Det *bedste*?" (10.31–10.76):**
  - From `Handoff1`, the site settles back and right (about 0.62 ×). "Det *bedste*?" reveals large on the left with
    whitespace.
  - It is one of the two centred moments, so centring is also fine: the site then sits below it.
- **"Du ser den færdig, før du betaler en krone." (11.20–13.57):**
  - Apple transition: the frame expands to fill the screen, a full-bleed product shot of the finished site, gently
    scrolling.
  - On "færdig", a chip "Forhåndsvisning · Gratis" settles on the URL pill area.
  - On "betaler en krone" (12.52–13.57), a small receipt card lands: "Betalt indtil nu" and "0 kr" in Fraunces.
- **"Vil du ændre noget? Skriv det. Creoble retter det." (14.02–16.83):**
  - The frame returns to a smaller size. Creoble's prompt bar rises under it: a white rounded input with the sparkle
    icon and "Skriv din ændring…" as placeholder.
  - On "Skriv det" it types "Tilføj en knap til online booking". It sends on "det2", with a sage send circle.
  - On "retter det" (16.46), a light-sage sweep passes over the hero, and the "Book tid" button grows into place
    (booking 0 → 1). A small "Opdateret" check lands.
- **End:** exactly `Handoff2` at h2.

### B3, the deal (17.0–26.6): two columns
- **"Tilfreds?" (17.29):** the site shrinks into the left column (about 0.5 ×). "Tilfreds?" reveals in the right
  column as the column's heading.
- **"499 kroner." (18.14–19.67):** a Creoble price card settles: "Din hjemmeside" and "499 kr", Fraunces about 120 px.
  The number may tick up to 499 over 0.6 s.
- **"Én gang." (20.05):** a line "1 betaling" with a check lands under it.
- **"Intet abonnement." (20.85):** a row "Abonnement" with a `Toggle` that switches **off** on "abonnement".
- **"Siden er din." (22.04–22.87):** the site in the left column gets a sage ring and a chip "Din" (user icon) under
  it.
- **"Ikke tilfreds?" (23.34):** Apple transition: the card flips over a horizontal axis, or morphs (no spin), to the
  other answer.
- **"Så koster det ingenting." (24.36–25.33):** "0 kr" in Fraunces.
- **"Nul risiko." (25.67–26.44):** a shield-check icon and the words "Nul risiko" land.
- **Out:** everything clears, and the site carries back to `Handoff3` at h3.

### B4, hosting (26.6–39.1)
- **"Skal den på nettet?" (26.89–27.57):** from `Handoff3`, the URL pill comes forward (a large twin of the address
  bar under the frame). It reads "Forhåndsvisning".
- **"Vi sætter det hele op for dig." (28.01–29.40):**
  - The twin types "holmfysio.dk".
  - A setup list ticks in quick turn: Domæne ✓ · E-mail ✓ · SSL ✓ · Hosting ✓.
  - The frame's pill becomes "holmfysio.dk" with the lock and the Live dot.
- **"Fra 83 kroner om måneden." (29.68–31.27):**
  - A Creoble hosting card settles beside the site, now smaller: "Hosting", "fra 83 kr /md", small "Betalt årligt".
- **"Domæne og e-mail er med." (31.58–32.97):** two chips attach to the card: "holmfysio.dk" (globe) and
  "kontakt@holmfysio.dk" (mail).
- **"Fast pris. Også når du fornyer." (33.27–35.05):**
  - The card morphs into a minimal line chart over the years 2026 · 2027 · 2028 (Fraunces year labels).
  - The sage line "Creoble" stays flat at 83 kr. A grey dashed line "Typisk webhotel" steps up after year one,
    as Creoble's own hosting page compares.
  - Draw the lines on the words.
- **"Domænet i dit navn. Servere i Europa. Ingen binding." (35.41–39.05):** three promises land in one row, one per
  phrase:
  - a domain card "holmfysio.dk · Ejer: Holm Fysioterapi" (user icon);
  - "Servere i Europa · GDPR" (server icon);
  - "Ingen binding" (an unlock icon that opens on "binding").
- **End:** the row clears and the site returns to exactly `Handoff4` at h4.

### B5, a human, the brand, the CTA (39.1–55.2)
- **"Brug for hjælp?" (39.42–39.95):** from `Handoff4`, the site recedes. A chat card comes forward: white, radius 20,
  header "Creoble support" with a neutral avatar and a sage "online" dot. The client's message lands: "Hej! Kan I
  hjælpe med at skifte et billede?"
- **"Et menneske, der forstår din forretning." (40.35–42.16):** typing dots, then the reply lands from "Creoble
  support": "Selvfølgelig! Jeg ordner det med det samme."
- **"Ingen kø." (42.58):** a ticket chip "Du er nr. 14 i køen" dissolves away, or is struck through in sage.
- **"Ingen robotsvar." (43.46):** a "Bot" chip dissolves the same way.
- **"Creoble." (44.75):**
  - Apple transition: everything clears to the ground. The `Wordmark` builds large and centred (h ≈ 150), and its
    full stop lands on the word.
- **"Hjemmeside og hosting, samlet ét sted." (45.65–47.83):**
  - The `Label` "Hjemmeside & hosting" draws above, or under.
  - Two small objects slide in from the left and right and meet as one unit under the wordmark on "samlet ét sted":
    the site frame and the hosting card.
- **"Byg den. Se den. Så køber du." (48.21–50.17):** Creoble's own line, as Statement, with "Så" in italic sage, one
  beat per sentence.
- **"Byg din side gratis på creoble.dk." (50.61–53.34):**
  - The `PillButton` "Byg din side gratis" settles under it, with a soft shine on "gratis".
  - "creoble.dk" in DM Sans 500 lands under the button. No cursor.
- **Then:** a calm hold to the end; only the breath moves.

## QC targets (on your draft)
- `python3 ../../scripts/clipcheck.py out/draft.mp4 <first> src/words.json`:
  - moving in 95%+ of frames;
  - typical change 2.5%+;
  - longest still ≤ 0.4 s (the final hold is exempt);
  - every phrase "ok".
- `npx tsc --noEmit` clean.
- No text collisions; readable sizes.

## Workflow (each builder)
- **Your folder:** work only in `/home/user/Video-s/films/creoble4/work/<n>/`, a copy of `film/`. node_modules and
  public are hardlinked: never write into them.
- **What you may edit:** your scene file only. Write local helpers in it.
- **Stills:** `node stills.mjs <frames> 1` → `out/test/fNNNN.png`. Look at them with Read.
- **Draft:** `bash ../../scripts/draft.sh <first> <last> out/draft.mp4`, then run clipcheck on it.
- **Speed:** Karl wants speed. Aim to finish in about 35–40 minutes, with every phrase built and the hand-offs exact.
