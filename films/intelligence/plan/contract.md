# Intelligence platform explainer: build contract

Film: 49.8 s, 1920x1080, 60 fps, English VO placed at 0.4 s (film = VO + 0.4; `w("word", n)` in `src/kit.tsx` gives a word's film time,
n = which occurrence, 0-based). Project: `films/intelligence/film`. The film plays on the platform's own homepage: it shows users what
the platform does and where. Karl's brief: "it must be exactly the platform; don't design it yourself; literally use the screenshots;
adjust elements" and "all the examples (transcripts, outcomes, proposals) must be custom, not what is there now".

## The screens (READ THIS)
- `public/screens/NN.png` (2559 x 1350 px) are Karl's 36 screenshots in the order he took them, already anonymised: logo "nova",
  avatar "S", names Sam van Dijk / Daniel Bos, "WKC" -> "Nova". Screen 05 (settings) does not exist: never show settings.
- The original example CONTENT on those screens is Karl's real business (his studio's strategy, prices, a real client's offer). It must
  never be readable in the film. Wherever a text block is readable at your framing, cover it (`Cover`, the local background colour)
  and re-set custom text (`T`) in the platform's own type, same position, size, weight, colour and line height. UI chrome stays the
  photo: nav, page titles, section labels ("Strategy", "How we work", "Playbooks", "Layer 1"), buttons, step labels, icons, badges.
- Typography: page titles Inter Tight ~28-30 px bold (screen px); card titles Inter ~15-16 px semibold; body Inter ~13-14 px, line
  height ~1.55; muted text #5f666f; ink #050f19. Calibrate each block: render a still, compare with the original screen at the same
  framing, and match size, line breaks and baseline before you move on. The OCR word boxes of every screen are in
  `/home/user/Video-s/films/intelligence/harvest/ocr/<time>.tsv` (2x upscaled px: divide by 2); the screen number NN maps to the
  sorted file names in `/home/user/Video-s/films/intelligence/harvest/zip/` (NN-th file, skipping none: 05 is 034419).
- Screen map: 01 home ("Good morning, Sam", cards Knowledge base / Offer / Strategy) · 02 knowledge base (6 departments) · 03 Offer
  step 1 (paste transcript; "Earlier offers") · 04 Strategy overview · 06 Sales department (Strategy layer 1, How we work layer 2,
  Playbooks layer 3) · 07-11 other departments · 12 Offer "Reading your transcript…" · 13 Offer step 2 "Here's what I took from it"
  (cards) · 14 its bottom ("What do you want to do with this?" Make an offer / Update the knowledge base / Both) · 15 "Writing your
  offer…" · 16 "Your offer is ready" (document) · 17 offer bottom (payment terms, next step) · 18 Sales strategy + Strategy agent panel ·
  19-23 other strategies · 24 Sales strategy at "6. Pricing" + agent with "Raise our minimum project price to €450" typed · 25 sent,
  "Thinking…" · 26 the agent's reply + the suggested change (Approve / Reject) · 27-28 "Pricing — strategy updated · Updating 15 related
  documents…" · 29 "4 related documents updated — check them before they go live" (Approve all / Review one by one) · 30 "Review
  updated documents" list · 31-33 the diffs expanded · 34 all approved · 35 "All changes" log · 36 the Pricing document (How we work)
  showing €450.

## House rules (Karl)
1. Never a still frame: something purposeful moves on every frame (a slow push-in on the stage, a lift, typing, a cursor). A new
   visual event every 0.5-0.8 s, on the VO's key words.
2. Apple-style, calm: the screen is the stage; the camera only breathes (slow push-ins, soft eases, at most one gentle reframe per
   phrase, never whip pans). On the key word, the component that matters LIFTS OUT of the screen (`Crop` of that region, springs
   toward the viewer to a readable size, soft shadow `SHADOW`, the stage behind dims with a light veil) — one lifted thing at a time.
   Interactions are real: the `Cursor` clicks the nav tab / button that leads to the next screen; text is typed (`Typed`).
   Navigation between screens is the app's own state change: a short soft dissolve (0.25-0.35 s) from screen to screen triggered by the
   click, never a hard cut, never a slide-show.
3. Readable: any text the viewer should read is at least ~24 px in the frame (body text at screen scale >= 1.7 when lifted).
4. Move with transform only; no will-change on big layers; `rnd` not Math.random; keep shadows soft and even.
5. On screen only: the platform's own UI, the script, and the custom content below. No invented features.

## Custom content (use these words; keep them consistent)
- The demo company is **Nova**, a brand and web studio (projects + monthly retainers). Users: Sam van Dijk, Daniel Bos.
- Department card lines (02, 04): keep the platform's own sentence pattern ("The one strategic document for Sales at Nova. Every choice
  about who we sell to, how, what, at what price…") — these are already Nova after anonymising; re-set them only if a WKC detail shows.
- Sales strategy text (18, 24-29, left column, wherever readable): Introduction: "This document sets out how Nova sells: who we sell to,
  through which channels, how a deal runs, what we offer and at what price. Every How we work page and every playbook in Sales follows
  from it." · 1. Purpose and philosophy: "In short: Sales turns a good first conversation into a signed project or a monthly retainer, and
  never sells what we can't deliver well." · 6. Pricing: "In short: Prices are set per client and agreed in the call, above clear
  minimums. We don't publish a price list and we don't discount." Pricing table (Choice | Decision): Minimum one-off project | €400
  (after the change: €450) · Minimum monthly retainer | €900 to €2,000 a month · Range per service | €450 to €4,500 · Discounts | Never;
  scope comes down, not the price · Add-on inside a project | From €250, e.g. an extra landing page. · 7. Revenue goal and metrics:
  "In short: grow retainers to half of revenue within 12 months."
- The agent (24-29): the user types **"Raise our minimum project price to €450"** (the VO's example). Reply: "Here's what I took from
  it — You want the minimum price for a stand-alone project to go from €400 to €450. I only changed Pricing (chapter 6). Retainers and
  the no-discount rule stay as they are." Suggestion card: "Sales strategy · Chapter 6 · Pricing" with the table row "Minimum one-off
  project | ~~€400~~ €450". Then "Pricing — strategy updated · Updating 15 related documents…", then "4 related documents updated —
  check them before they go live".
- Review (30-34), the 4 updated documents and their diffs: Pricing (Sales · How we work 2.6): "Minimum one-off project: €400 → €450" ·
  Pricing calculator (Sales · Playbook 3.6.1): "Floor for a stand-alone project: €400 → €450" · Custom project pricing (Sales · Playbook
  3.6.3): "Projects under €450 get a smaller scope, not a lower price" (new line) · Margin check per project (Finance · Playbook 3.2.1):
  "Lowest project we take on: €400 → €450". The other rows keep "No change needed". Diff lines: removed lines on #f0d2c7 with the old
  value struck, added lines on #dcf3e5.
- The call transcript (03, typed/pasted into the box): "Lena (Fernwood): We're opening a second roastery in Utrecht in March and our
  website still looks like 2016. / Sam (Nova): What should the new site do for you? / Lena: Sell our beans online, subscriptions too, and
  take bookings for the café. We have about eight thousand for the website, maybe more for a brand refresh. / Sam: When does it need
  to be live? / Lena: Before the opening, the 14th of March." Earlier offers row: "Offer for Studio Kade: website refresh · 3 Nov 2026".
- "Here's what I took from it" (13): summary: "Fernwood Coffee Roasters is a specialty roaster with a café in Amsterdam, opening a second
  roastery in Utrecht in March. They want a new website with a webshop and a brand refresh before the opening." Cards: Client / company:
  "Fernwood Coffee Roasters, Amsterdam; second roastery opening in Utrecht." · Decision maker: "Lena Vos, co-founder. She signs off on
  budget." · Needs: "A new website with a webshop and subscriptions for beans, café table booking, and a refreshed brand." · Problems:
  "The current site is slow on mobile and can't sell online; orders come in by email." · Budget signals: "Around €8,000 for the website;
  open to more for the brand refresh." · Timeline: "Live before the Utrecht opening on 14 March; first designs in January." · Fit with
  our ideal client: "Strong fit: an established local brand, a clear budget, and web plus brand is our core work." · Risks / unknowns:
  "Webshop platform not chosen yet; product photography not planned."
- The offer (15-17): title "Offer for Fernwood Coffee Roasters"; under it "Prepared by Nova. Draft for discussion. Prices exclude VAT."
  · What we heard: "Fernwood is opening a second roastery in Utrecht on 14 March and needs a website that sells beans online and takes
  café bookings, with a brand refresh to match." · You told us you need: Brand refresh: logo, colours and packaging labels · A new
  website with webshop and bean subscriptions · Café table booking · Live before 14 March. · Scope and price (table): Brand refresh
  €2,400 · Website design and build €6,200 · Webshop and subscriptions €1,800 · Total €10,400. · Timeline: designs in January, launch
  7 March. · Payment terms: 40% at the start, 60% at launch; invoices due within 14 days. · Next step: a 30-minute call to confirm the
  scope, then we start on 12 January. · Signed "Sam van Dijk and Daniel Bos, Nova".

## The storyboard (film times; VO words: Meet 0.40, Everything 2.70, one place 5.02-5.28, knowledge 6.44, department 7.74,
sales 8.76, marketing 9.22, operations 9.92, finance 10.80, Each 11.78, one strategy document 12.64-13.38, how you work 14.70,
playbooks 16.18, Need 17.32, Open 18.68, Strategy 19.00, tell the agent 20.00-20.40, Raise 21.26, euros 24.20, suggests 25.40, edit
26.60, approve 27.52, Every related 28.38, document 29.04, updates 29.56, ready 30.78, review 31.46, Had 32.36, client 32.64, Paste
33.58, transcript 33.96, Offer 34.72, pulls 35.74, matters 36.32, needs 37.10, budget 37.84, timeline 38.32, writes 39.30, tailored
39.62, offer 40.10, prices 41.14, process 41.74, minutes 42.70, One 43.74, source of truth 43.96-44.42, always in sync 45.16-45.68,
every offer 46.46-46.74, point 47.58)

### S1 Home (0-6.0, B1) "Meet your intelligence platform. Everything about how your company works, in one place."
- Frame 0 moves: screen 01 assembles: "Good morning, Sam" and "What would you like to work on?" rise in, then the three cards (Knowledge
  base, Offer, Strategy) spring up one after another (2.7, 3.4, 4.1) — the platform's three places. 5.02 "one place": a slow push-in
  holds all three; the cursor drifts to the Knowledge base card.
### S2 Knowledge base (5.6-11.6, B1) "The knowledge base covers every department, from sales and marketing to operations and finance."
- 6.2 the cursor clicks Knowledge base (01) -> dissolve to 02. 7.74 "department": the six department cards are the subject. 8.76 / 9.22 /
  9.92 / 10.80: Sales, Marketing, Operations, Finance each lift a little (scale 1.04, shadow, a soft blue ring) on its word, in turn.
### S3 Three layers (11.4-17.2, B1) "Each starts with one strategy document, followed by how you work and detailed playbooks."
- 11.8 the cursor clicks Sales -> dissolve to 06. 12.64 "one strategy document": the Strategy (Layer 1) block lifts out big (one row:
  "Sales strategy"). 14.70 "how you work": it settles back as the How we work (Layer 2) list lifts (its rows readable). 16.18
  "playbooks": the Playbooks (Layer 3) block lifts, rows cascading. Ends at H1: screen 06, nothing lifted, Cam {x:1280, y:600, s:1.0}.
### S4 Tell the agent (17.0-24.6, B2) "Need something to change? Open Strategy and just tell the agent, like: 'Raise our minimum project price to €450.'"
- From H1. 18.68-19.00 the cursor clicks the "Strategy" nav tab -> 04 -> clicks Sales -> 18/24 (Sales strategy + agent panel).
  20.0-20.4 "tell the agent": the Strategy agent panel lifts out big at the right. 21.26-24.2: "Raise our minimum project price to €450"
  is typed into the agent's input, word by word with the VO; the pricing table (chapter 6) is visible on the left.
### S5 The suggestion (24.4-27.0, B2) "It suggests the exact edit."
- Send pressed (24.4) -> "Thinking…" (25) -> 25.4 "suggests": the agent's reply and the suggestion card appear (26); 26.12-26.6 "exact
  edit": the table row €400 -> €450 lifts and the old value strikes through, the new one in green.
### S6 Approve (26.9-28.2, B2) "You approve."
- 27.52 the cursor presses Approve (big, satisfying press); the card turns to "Pricing — strategy updated".
### S7 Every document follows (28.0-32.2, B2) "Every related document updates to match, ready for your review."
- 28.38 "Updating 15 related documents…" with the progress filling; 29.04-29.56 the document names tick past (15 rows from the review list,
  a quick cascade); 30.2 "4 related documents updated — check them before they go live"; 30.78-31.46 "ready for your review": the Review
  updated documents list (30/31) with one diff expanded (Pricing: €400 -> €450), the "To check" badges and Approve buttons. Ends at H2:
  screen 34 (all approved), nothing lifted, Cam {x:1280, y:600, s:1.0}.
### S8 Paste the transcript (31.9-35.3, B3) "Had a client call? Paste the transcript into Offer."
- From H2. 32.64 the cursor clicks the "Offer" nav tab -> 03. 33.58 "Paste the transcript": the transcript box lifts and the call
  transcript (custom, Fernwood) pours in (pasted, line by line, fast). 34.72 "Offer": "Read transcript →" pressed.
### S9 What matters (35.1-38.9, B3) "It pulls out what matters, needs, budget and timeline,"
- 35.6 "Reading your transcript…" (12) -> 36.0 "Here's what I took from it" (13) with the custom summary; 37.10 Needs, 37.84 Budget signals,
  38.32 Timeline: each card lifts in turn with its custom text.
### S10 The offer (38.8-43.4, B3) "and writes a tailored offer from your own prices and process, in minutes."
- 39.1 "Make an offer" (14) pressed -> "Writing your offer…" (15) -> 39.62-40.1 "tailored offer": "Your offer is ready" (16) with the
  custom offer: the title "Offer for Fernwood Coffee Roasters" lifts. 41.14 "prices": the scope-and-price table lifts (custom prices).
  41.74 "process": payment terms and next step (17). 42.70 "minutes": the Copy / Download / Print buttons, Copy pressed.
### S11 One source of truth (43.2-49.8, B3) "One source of truth, always in sync, and every offer on point."
- 43.74-44.42 "One source of truth": the Sales strategy (18) — the source; 45.16-45.68 "always in sync": the knowledge base (02)
  departments light up in a ripple (all six, quick); 46.22-47.58 "every offer on point": the offer (16) settles centred; then the home
  screen (01) with its three cards returns and holds with a slow push-in to the end (49.8): the platform at rest.

## Builders and files (own only your files; never edit kit.tsx, spine.tsx, Story.tsx, Root.tsx)
- B1: `src/scenes/S1.tsx`, `S2.tsx`, `S3.tsx` (0-17.2) + `src/scenes/b1-*.tsx`, `src/solo/B1.tsx`.
- B2: `S4.tsx`, `S5.tsx`, `S6.tsx`, `S7.tsx` (17.0-32.2) + `b2-*`, `src/solo/B2.tsx`.
- B3: `S8.tsx`, `S9.tsx`, `S10.tsx`, `S11.tsx` (31.9-49.8) + `b3-*`, `src/solo/B3.tsx`.
Each scene file exports `export const S4: Scene = { id, t0, t1, C }`. Hand-offs: H1 at 17.2 = screen 06, nothing lifted, Cam
{x:1280, y:600, s:1.0}; H2 at 32.2 = screen 34, nothing lifted, Cam {x:1280, y:600, s:1.0}. Both neighbours draw exactly that state.

## Check before you finish
1. `./node_modules/.bin/tsc --noEmit -p .` clean for your files.
2. Copy `src/solo/_template.tsx` to `src/solo/<B#>.tsx` with your scenes; `bash check.sh <B#> <t0> <t1>`; Read `out/<B#>-sheet.png`.
3. PRIVACY CHECK: render full-size stills of every framing you use and read them: no readable original example content (anything
   about the original studio's motion design, video, Málaga/UFM/Luma/Brevo, its real prices other than the €400/€450 example, its
   revenue), no WKC, no Karl, no settings screen. Every readable example text is the custom content above.
4. Report per scene what you built, the motion line, SHAKE, and anything not done.
