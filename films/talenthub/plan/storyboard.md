# Talent Hub — storyboard and build contract (36.0 s, 16:9, 30 fps)

## Brief (the client, translated)
- **What it is:** a video for Talent Hub, a company that has no website yet. The platform is in development, so the
  film animates a kind of prototype (brand/requirements.pdf describes it).
- **Brand:** brand/brandkit.pdf.
- **Logo:** animate the SQUARE "th" logo instead of writing "Talent Hub". Use the wide logo for the CTA.
- **Captions:** SaaS caption rhythm. Captions on some lines only, not everywhere.
- **5% motion norm:**
  - The typical frame changes about 5%.
  - Simple UI sliding left and right does NOT count. It must be visualisation and explanation motion that
    represents what the voice says.
- **Background:** bright overall; it may vary lightly here and there.
- **Bridge to JongLeren:** the client's earlier JongLeren films (films/jongleren-en/deliver/jongleren-en-40s.mp4)
  are related, and this film should connect to them as a bridge.
  - Not a literal transition, and NOT opening with anything like "coming from JongLeren".
  - It must stand on its own. The bridge lives in the shared visual language: warm ivory ground, soft red ripple
    rings, bold left-aligned statements with a red key word, white cards, red pills, a red dot and line as the
    thread, a full red colour-field moment.
  - The brand kit itself calls Talent Hub "a recognisable evolution of JongLeren". Never mention JongLeren on screen.

## Look (src/lib.tsx)
- **Colour:** Talent Red #CF141E (primary), Charcoal #191B20 (text), Warm Ivory #FCF8F5 (ground), Soft Rose
  #FCE6E7 (accent), Cloud Gray #F0F0EF (UI). Plus gray #6B6E76; green only for an "unlocked / connected" success
  state.
  - **Ground:** ivory with soft red ripples, drawn by Story.tsx.
  - **Variation:** scenes may lighten or vary it here and there (a rose or cloud panel, a full red field at the
    hand-offs).
- **Type:**
  - Lato only (900 headlines, 700 sub, 400 UI).
  - Statements are left-aligned, around 96–130 px, with the key word red.
  - UI text in focus is 22 px or more on screen.
- **Logo:**
  - `THMark` (p 0..1 builds it: the t rises, the h drops in, the arch sweeps), red on ivory or white on red.
  - Never stretch, rotate, shadow or recolour it beyond red and white (brand rule).
  - `WideLogo` only in the CTA.
- **Motion:**
  - ARRIVE for entrances, MOVE for carries, SNAP for UI, POP only for small things.
  - Explanation motion: things move because of what they mean — candidates flowing into a pool, filters
    removing non-matches, a lock opening, a line connecting two people, pins lighting up across a map.

## Kit (src/shared.tsx)
- **Timing:** `k`, `f`, `typed`.
- **Type and logo:** `Say` (left-aligned word build), `THMark`, `WideLogo`.
- **Icons:** `Ico`: search, filter, sliders, lock, unlock, mail, phone, globe, pin, cap, briefcase, building, user,
  users, check, star, chat, send, coin, plane, arrow, plus, x, spark, grid, bell, doc, door, rocket.
- **Pieces:** `CARD`, `Pill` (white with red text, or filled), `Chip` (skill or filter chip, `on` state), `Avatar`
  (anonymised silhouette, or initials when unlocked).
- **Candidates:** `CANDIDATES` (12 example graduates) and `CandidateCard` (anonymised until unlocked; match badge;
  hi ring).
- **Dashboard:** `Dashboard` with `DASH` (the client dashboard window: top bar with mark, search and credits; filter
  rail with three groups; results area; `count`; `filters` on-states).
- **Background and thread:** `Ripples`, `RedIris` (a full red field grown from a point), `Dot`, `Link` (a red
  connection line drawing).
- **Jobs:** `JOBS` (6 example opportunities abroad).

Never edit shared.tsx, lib.tsx, Story.tsx, clock.ts or other scenes. Write local helpers in your scene file.

## Facts (brand/requirements.pdf) — prototype, shown truthfully
- **Graduates (students) and clients:** agency recruiters and direct employers.
- **The candidate pool is anonymised:** clients see work-relevant experience only. Personal and contact data stay
  hidden until the profile is unlocked.
- **Credits:** one credit unlocks one candidate profile. Unlocking immediately reveals personal and contact data and
  enables outreach. Clients buy monthly credit bundles.
- **Students:** complete their profile, search jobs and apply. Clients post vacancies.
- **International career opportunities:** the client network abroad, plus Spain.

Not allowed:
- real company names, prices or user numbers presented as facts;
- "available now" or a website/URL (there is none yet).

Example UI numbers ("1,248 candidates", "10 credits") are fine as prototype UI.

## Words (seconds; "w:…" labels)
- **Hook and meet:** looking .10, for .28, qualified .52, talent .90 | meet 1.99, talent2 2.20, hub 2.54.
- **Platform:** the 3.41, platform 3.46, connecting 3.84, graduates 4.32, with 4.76, international 5.14, career 5.64,
  opportunities 6.20.
- **Database and dashboard:** browse 7.57, a 7.82, database 7.92, of 8.24, qualified2 8.50, candidates 8.98 | all
  9.97, in 10.16, one 10.40, intuitive 10.70, dashboard 11.26.
- **Filter:** filter 12.45, by 12.58, skills 12.84, experience 13.56, and 14.34, qualifications 14.52, to 15.06, find
  15.60, the2 15.80, right 15.94, match 16.16.
- **Profile and connect:** discover 17.08, candidate 17.34, profiles 17.80 | unlock 18.86, contact 19.08, details 19.50
  | and2 20.38, connect 20.46, directly 20.74, with2 21.34, potential 21.54, hires 21.90.
- **Graduates:** for2 22.97, graduates2 23.02, its 23.80, a2 23.98, gateway 24.06, to2 24.36, exciting 24.64,
  opportunities2 25.16, abroad 25.70.
- **Employers:** for3 26.85, employers 26.90, and3 27.34, recruiters 27.54, its2 28.39, a3 28.54, smarter 28.60, way
  28.96, to3 29.26, discover2 29.44, talent3 29.76.
- **End:** talent4 30.78, hub2 31.04 | your 31.78, next 31.86, connection 32.10, starts 32.56, here 33.00. End 36.0.

## Hand-offs (exact)
- **A→B at 3.1 s:** the logo becomes the hub node.
  - A ends with the red "th" mark (`THMark` size 150, red, on ivory) centred at (960, 540): frame 93 (3.10 s) shows
    exactly that.
  - B draws the same mark there from frame 93, and A draws nothing after frame 93.
- **B→C at 12.2 s:** the dashboard.
  - At frame 366 (12.20 s), B shows exactly `<Dashboard count={1248} credits={10} filters={[0,0,0]}>` at its default
    geometry (DASH: x 160, y 120, 1600×860, s 1), with the results grid of the first 8 `CANDIDATES` as
    `CandidateCard w={290}` in 4 columns × 2 rows (gap 24 px, starting at the results area's top-left).
  - C draws the same from frame 366, and B draws nothing after frame 366.
- **C→D at 22.7 s:** a red iris.
  - C ends by growing a `RedIris` from its last focal point (the sent message) that covers the frame by frame 684
    (22.80 s). C draws nothing after frame 686.
  - D draws a full red field (`RedIris` p=1) from frame 683, and opens out of it (the red shrinks into a red dot or
    pin, revealing ivory) from 22.85 s.
- **D→E at 30.5 s:** a red iris again.
  - D ends with a red iris from its focal point covering the frame by frame 920 (30.67 s). D draws nothing after
    frame 922.
  - E draws a full red field from frame 918.

## Scenes
### A: 0.00–3.40. "Looking for qualified talent?" / "Meet Talent Hub."
- **0.1–1.5:** caption, left-aligned, about 120 px: "Looking for / qualified talent?" ("talent?" red). Explanation
  motion around it:
  - A big search field types "qualified talent" while a cloud of many small grey anonymous avatars (30–60) drifts and
    swirls across the right side: the scattered talent out there, hard to find.
  - A red search lens sweeps over them.
- **1.99 "Meet":** the avatars stream inward and converge into one red dot at centre, which grows into a red field
  (`RedIris`).
- **2.2–2.95 "Talent Hub":** the white `THMark` builds on the red field (p 0→1). No text "Talent Hub". Big, about
  420 px wide.
- **2.95–3.1:** the red field contracts back into the mark. The mark turns red on ivory and shrinks to size 150 at
  (960, 540), the hub node (hand-off).

### B: 2.90–12.40. "The platform connecting graduates with international career opportunities." / "Browse a database of qualified candidates, all in one intuitive dashboard."
- **3.41–7.1, the network:**
  - The th hub node sits at centre.
  - On "graduates" (4.32), graduate avatars (cap icon badges, rose rings) pop in on the left in a loose column.
  - On "international" (5.14), a light dotted world/Europe map fades in on the right, with red pins lighting up across
    cities (Madrid, Lisbon, Berlin, Dublin, Amsterdam, Barcelona…).
  - On "career opportunities" (5.64–6.2), job cards (`JOBS`: title and city) pop next to the pins.
  - On "connecting" (3.84), red `Link` lines draw from each graduate through the hub to a pin, one by one, rhythmically.
  - A small caption tag at the top left only ("Graduates ⇄ Careers abroad"), or no caption at all.
- **7.57–9.8, the database:**
  - The network collapses: graduates and links pour into the hub, which opens into a growing grid of anonymised
    `CandidateCard`s, cards flowing in like data (staggered, from the hub outward).
  - A counter counts up to 1,248.
  - On "qualified" (8.5) each card gets a small check badge.
- **9.97–12.2, the dashboard:**
  - On "one" (10.40) the scattered cards gather and snap into the `Dashboard` window as it assembles around them
    (top bar drops in, filter rail slides from the left, counter lands).
  - On "intuitive dashboard" a caption at the top: "All in one dashboard." It must be gone by 12.1, or sit above the
    window without collision.
  - End exactly in the B→C hand-off state.

### C: 12.00–22.95. Filter → match → profile → unlock → connect
- **12.45 "Filter":**
  - The dashboard's filter rail lights up. The filters apply one group at a time on "skills" (12.84), "experience"
    (13.56) and "qualifications" (14.52); the chips turn on with `filters`.
  - Each time, the non-matching cards visibly drop out of the grid (fall, fade, shrink away). The remaining cards
    reflow into place, and the counter falls 1,248 → 312 → 86 → 12.
  - This is the core explanation: filtering removes the noise.
- **15.6–16.5 "find the right match":** one card gets the red hi ring and a "98% match" badge, and the others dim.
- **17.08 "Discover candidate profiles":**
  - That card expands out of the grid into a large profile panel (the dashboard recedes and blurs behind it).
  - The panel holds the anonymised profile: Candidate #2481, Marketing Graduate, skills, experience timeline,
    education, languages, and a locked contact section (blurred name, email and phone with a lock icon).
- **18.86 "unlock contact details":**
  - "Unlock profile · 1 credit" is pressed.
  - The credit counter drops 10 → 9 (a coin flies from the counter into the lock).
  - The lock springs open, the blur dissolves, and Sofia de Vries, email and phone are revealed (example data).
  - The avatar turns from silhouette to initials.
- **20.38 "connect directly with potential hires":**
  - A "Connect" or message action: an employer avatar appears and a red `Link` line draws from the employer to Sofia.
  - A message bubble ("Hi Sofia — we'd love to talk!") travels along the line, and a reply bubble pops.
  - Caption (optional, top): "Connect directly."
- **22.6–22.8:** a red iris from the sent message covers the frame (hand-off).

### D: 22.60–30.80. For graduates / for employers and recruiters
- **From 22.85:** the red field shrinks into a red pin or dot.
- **22.97 "For graduates, it's a gateway to exciting opportunities abroad.":**
  - Caption: "For graduates" (left, about 110 px, "graduates" red).
  - A graduate's side of the prototype: the graduate's profile card, and on "gateway" (24.06) a doorway / arch shape
    opens (or the profile card becomes a door) onto a horizon of opportunity cards from abroad (`JOBS`, with city
    pins and flags as colour dots) flying in on curved paths.
  - On "exciting opportunities" an "Apply" button is pressed on one, which turns to a green check "Applied".
  - A plane icon traces a dashed route.
- **26.85 "For employers and recruiters, it's a smarter way to discover talent.":**
  - Caption: "For employers & recruiters" ("recruiters" red).
  - Two client types, as two cards: Agency recruiter (users icon) and Direct employer (building icon). Each posts a
    vacancy (a job card flies into a board).
  - On "smarter way to discover talent" a radar / scan sweep finds matching candidates, which pop with match % and line
    up ranked: smarter, not more work.
- **30.4–30.67:** a red iris from the top match covers the frame (hand-off).

### E: 30.40–36.00. "Talent Hub. Your next connection starts here."
- **From 30.5:** full red field.
- **30.78 "Talent Hub":** the white `THMark` builds big at centre, as in A, with the music's last hit at 31.0.
- **31.4–31.8:** the red field opens back to ivory (the field contracts into the mark, the mark turns red).
- **31.78 "Your next connection starts here.":**
  - The mark slides left and becomes the start of the `WideLogo`, as the wordmark reveals beside it. The wide logo is
    about 1100 px wide, centred, at y ≈ 420.
  - The tagline builds under it ("connection" red, about 64 px).
  - A red dot and line draws under it, connecting two small avatars (graduate ↔ employer).
- **To 36.0:** an end card with a gentle push. Ripples in the background.

## Motion targets (scripts/clipcheck.py on your draft)
- Moving in 97%+ of frames.
- **Typical change 5%+ (the 5% norm).** Get there with explanation motion: flows, pools, reflows, lines drawing,
  maps lighting up, fields growing. Not slides.
- Longest still 0.3 s (E's end card exempt after 34.5 s).
- Every phrase "ok", no text collisions, generous whitespace, nothing off-palette.
- `npx tsc --noEmit` clean.

## Workflow
- Work only in your folder: /home/user/Video-s/films/talenthub/work/<id>/. Edit only your scene file(s).
- Stills: `node stills.mjs <frames> 1` → out/test/fNNNN.png. Batch them and Read them.
- Draft: `bash ../../scripts/draft.sh <first> <last> out/draft.mp4`, then
  `python3 ../../scripts/clipcheck.py out/draft.mp4 <first>`.
- Keep CSS blur filters 12 px or less. A frame renders in under about 1.5 s.
