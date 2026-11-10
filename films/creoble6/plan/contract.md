# Creoble v6, build contract 2 (65.2 s, 1920×1080, 60 fps): the new voice-over, object-led Apple motion

The first build (plan/v1/contract.md) was made on the wrong voice-over and leaned on camera moves. Karl sent the
right voice-over on 10 Nov (a different Danish script, below) and this direction. Everything here replaces v1. The
kit files stay; the three scene files are written new.

## Karl's direction (read first; these are his words)
- "I really don't want you to just hover the camera over the screen. The camera doesn't have to be the majority
  animated. It's the things on the screen that have to be the majority animated, in heavy Apple-style animation. It
  has to be Apple style. But it has to be smooth when you do zoom-in stuff, for the hook and such."
- "Sometimes animations are a bit shaky. Sometimes you let a text appear for less than half a second; you can't even
  see it. It goes in all kinds of directions that have no logic. Sometimes you don't see things clearly at all. It is
  not fully Apple style."
- "Take a good look at the reference, how everything is smooth." (Contact sheets, one frame per 0.5 s:
  `/tmp/claude-0/-home-user-Video-s/1b338aa5-0d41-5df7-93ad-fbe415aea70d/scratchpad/cref/ref1.png` and `ref2.png`.)
- Earlier, still valid: be very inspired by the reference's hook and outro; calm tempo you can follow; no flash then
  stall; alternate text and visual, not too much text.

## The client (Willads), still valid
- **Keep:** the opening with old websites and "Siden kan ikke findes"; the typing in the wizard; domain, mail and
  website turning green one after another.
- **Fix:**
  - the product big: at least half the frame;
  - one grid, nothing cut off;
  - kinetic type beats alternating with product beats;
  - calm, light, magazine-like;
  - no icon metaphors, no bounce, no confetti, no heavy black pills, no blur-in text;
  - transitions where one element becomes the next;
  - the dots logo as the recurring element (loading; the end).

## Motion rules (hard)
1. **Objects carry the motion, not the camera.**
   - Each beat has a mostly fixed frame. The things in it move: cards arrive, fields fill, rows tick, photos
     land, blocks slide into a layout, one element morphs into the next.
   - The camera only (a) holds a very slow, steady push (a scale change of about 2–4% over a whole beat), and
     (b) makes at most ONE deliberate move per scene: a smooth push-in or pull-back of 1.5–2.5 s, sine eased, where
     it explains something (the hook's zoom, a close-up of the field being typed in).
   - No orbiting, no trucking around, no flying through things, no tilted hovering. A static 3D angle is allowed
     only if it never changes during the beat.
2. **Apple-style object motion.**
   - Springs: `aspring(g, at, response, damping)` from `./shared`, with response 0.45–0.7 s. Damping 1 (no overshoot)
     for big surfaces; 0.85–0.9 for small things (a check, a chip, a dot), which gives a barely visible settle.
     Never a bounce.
   - Arrivals: scale from 0.92–0.96 with a short rise (20–40 px) and a fade, staggered 0.08–0.12 s in a group.
   - Morphs: one box changes size, radius and colour while its content cross-fades. Things grow out of the
     element that caused them, and shrink back into it.
   - Presses: `press()`; the response follows the press.
   - Type: `Kinetic` (word by word, on the spoken word, line re-centring).
3. **Smooth and continuous.**
   - Start an animation before its word so it LANDS on the word.
   - Overlap: the next thing begins while the last is settling. No dead holds, no bursts.
   - Nothing moves faster than the eye can follow: a large surface never travels more than about 900 px in under
     0.8 s.
4. **Direction logic: one axis per scene, and causes are visible.**
   - New things enter from below (rising) and leave upward, unless they grow out of a named element.
   - Within a scene never mix left, right, up and down entrances. A list fills top to bottom; a row of things
     fills left to right.
5. **Readable.**
   - Every word or line of type stays fully on screen for at least 1.2 s after it has landed (short lines 1.5 s).
     If the voice leaves no room, show fewer words; never flash a line.
   - UI text that matters shows at 28 px or more on screen. One subject per beat, at least half the frame, sharp.
   - No depth-of-field blur on anything the viewer should read; blur only for a surface that has clearly left the
     stage.
6. **No shake.**
   - Animate with transforms and opacity only (never width, height, left, top or font-size).
   - Do not animate `filter: blur()` on large text surfaces. Do not scale UI above 1.6× with a moving camera.
   - Round nothing. No tiny rocking or wobble loops.
7. **The grid:** `SAFE` (x 144, y 108, 1632 × 864). Every card, pill, line and lockup sits fully inside it.
8. **Truth:** only what the voice says and the wizard shows. Holm Fysioterapi (fictional), holmfysio.dk. The edit
   text, the panel change and the chat lines below are illustrations.

## Measured check (each builder, own span)
Render your span at quarter scale and run the check, then fix and repeat:
```
npx remotion render src/index.ts Film out/A.mp4 --frames=0-1229 --scale=0.25 --concurrency=2 --muted --props='{"blurSamples":1,"audio":"none"}' --log=error
python3 tools/flow.py out/A.mp4        # times are relative to your span's first frame
```
- **0 JERK lines.**
- **Profile:** no peak above about 2.5. No long flat zero: something always moves (the slow push plus an object
  animating, a caret, the logo turning).
- Also make a sheet of about 30 stills (`node tools/stills.mjs A <frames…>`, `python3 tools/sheet.py`) and look at it
  for size, margins, cut-offs, direction logic and readability.

## Kit (don't edit; read the headers)
- `./shared`: `k`, `f`, `kf`, `typed`, `press`, `aspring`, `RollNumber`, `Ico`, `Wordmark`, `HolmSite`, `Browser`,
  the constants.
- `./type`: `Kinetic`, `words`, `TYPE`, `ACCENT`.
- `./dots`: `Spinner`, `Dots`, `dotsAt`, `assemble`, `Icon`, `BOX_C`.
- `./cam`: `Stage3D`, `Plane`, `cam`, `camKeys`, `project`, `SAFE`. Use it for the fixed stage and the one move.
- `./ui`: `WizardWindow` / `Wizard` (+ `WIZ_R`), `SiteWindow`, `NEW_HEADLINE`, `HostingCard` (rows ".dk-domæne",
  "E-mail på domænet", "Siden online"; price "99 kr. /md.", "Uden binding"), `Cursor`, `cursorAt`, `Handoff1`,
  `Handoff2`, `HANDOFF_HALF`.
- `scenes/A_old.tsx` holds the old-website mock-ups and the 404 page from the first build (reuse them).
- Chrome rasterises 3D planes at scale 1: for a close-up, lay the UI out larger and scale it down, so text stays
  crisp.
- Clock: `g` = seconds × 30, fractional. Labels are the words below (`w:` + key), `h1`, `h2`.

## Hand-offs (both sides draw only the kit's picture inside ±0.3 s)
- **h1 = 20.5 s (A → B):** `<Handoff1 g={g} />`: the finished Holm site in its window, whole, sharp, centred.
- **h2 = 44.65 s (B → C):** `<Handoff2 g={g} />`: the hosting card, whole, all rows "Aktiv", the price shown.

## Sound events
Export from your scene file `EVENTS: { t: number; kind: "click" | "type" | "check" | "pop" | "open" | "send" | "logo"; len?: number; note: string }[]`
(seconds; `len` for typing runs): every click, typing run, check, arrival that deserves a sound. The lead mixes
from it.

## The voice-over (paced film seconds; label = "w:" + key)
```
 1   0.40- 3.78  De fleste virksomheder har en hjemmeside, de ikke er stolte af.
      de 0.40  fleste 0.56  virksomheder 1.00  har 1.56  en 1.80  hjemmeside 1.96  de2 2.58  ikke 2.70  er 3.08  stolte 3.28  af 3.60
 2   4.22- 5.18  Eller slet ingen.
      eller 4.22  slet 4.48  ingen 4.98
 3   6.76- 9.20  Med Creoble fortæller du kort om din virksomhed.
      med 6.76  creoble 6.94  fortller 7.36  du 7.90  kort 8.06  om 8.38  din 8.54  virksomhed 8.66
 4   9.68-12.92  Navn, branche, hvad du laver og hvordan man kontakter dig.
      navn 9.68  branche 10.28  hvad 10.96  du2 11.02  laver 11.12  og 11.38  hvordan 11.82  man 12.06  kontakter 12.26  dig 12.72
 5  13.76-15.64  Så bygger Creoble siden til dig.
      s 13.76  bygger 14.08  creoble2 14.40  siden 14.88  til 15.26  dig2 15.50
 6  16.08-19.98  Tekst, billeder og opbygning, alt sammen ud fra det du skrev.
      tekst 16.08  billeder 16.74  og2 17.02  opbygning 17.42  alt 18.44  sammen 18.60  ud 18.96  fra 19.10  det 19.28  du3 19.46  skrev 19.70
 7  21.04-23.74  Du ser hele siden før du betaler en krone.
      du4 21.04  ser 21.18  hele 21.38  siden2 21.82  fr 22.20  du5 22.52  betaler 22.68  en2 23.04  krone 23.38
 8  24.20-25.94  Og vil du ændre noget, skriver du det bare.
      og3 24.20  vil 24.30  du6 24.38  ndre 24.48  noget 24.76  skriver 25.36  du7 25.54  det2 25.70  bare 25.78
 9  26.92-28.56  Når du er tilfreds, vælger du selv.
      nr 26.92  du8 27.04  er2 27.16  tilfreds 27.30  vlger 27.98  du9 28.14  selv 28.30
10  28.56-34.16  Download siden én gang for alle, eller lad os sætte den online for 99 kroner om måneden.
      download 28.56  siden3 29.26  n 29.76  gang 30.04  for 30.26  alle 30.44  eller2 30.90  lad 31.18  os 31.42  stte 31.54  den 31.74  online 31.88  for2 32.28  99 32.52  kroner 32.86  om2 33.58  mneden 33.68
11  34.44-34.94  Uden binding.
      uden 34.44  binding 34.68
12  36.08-38.70  Vælger du hosting, får du dit eget dk-domæne.
      vlger2 36.08  du10 36.30  hosting 36.46  fr2 37.20  du11 37.24  dit 37.38  eget 37.52  dkdomne 37.82
13  38.98-42.40  E-mail på domænet og siden online på europæiske servere.
      email 38.98  p 39.36  domnet 39.54  og4 40.04  siden4 40.26  online2 40.54  p2 41.04  europiske 41.24  servere 41.86
14  42.72-44.16  Det hele sættes op for dig.
      det3 42.72  hele2 42.84  sttes 43.16  op 43.60  for3 43.86  dig3 44.04
15  45.22-49.72  Får du nye priser eller et nyt billede, skriver du det i dit panel og siden opdateres.
      fr3 45.22  du12 45.30  nye 45.42  priser 45.62  eller3 46.06  et 46.36  nyt 46.52  billede 46.62  skriver2 47.36  du13 47.54  det4 47.72  i 47.86  dit2 47.94  panel 48.06  og5 48.34  siden5 48.70  opdateres 49.02
16  50.06-51.72  Du rører aldrig en linje kode.
      du14 50.06  rrer 50.20  aldrig 50.44  en3 50.98  linje 51.16  kode 51.40
17  52.54-53.88  Du kan stoppe når som helst.
      du15 52.54  kan 52.70  stoppe 52.78  nr2 53.14  som 53.38  helst 53.58
18  54.26-55.82  Prisen er den samme hvert år.
      prisen 54.26  er3 54.60  den2 54.80  samme 54.92  hvert 55.34  r 55.60
19  56.20-58.24  Og skriver du til os, svarer en dansker.
      og6 56.20  skriver3 56.30  du16 56.56  til2 56.70  os2 56.88  svarer 57.46  en4 57.66  dansker 57.86
20  59.04-62.38  Byg din side gratis på creoble.dk                                   end 65.20
      byg 59.04  din2 59.68  side 59.78  gratis 60.04  p3 60.68  creobledk 60.92
```

## Shot list
Each beat names its fixed frame and what the OBJECTS do. Rhythm: type, product, type, product.

### Builder A: 0 → h1 (20.5 s), `scenes/A.tsx`
**A1 · Hook, after the reference (0 – 3.9): type with the old website inside the line.**
- Frame: cream, centred. From frame 0 a small old-website window (about 360 px wide, from `A_old`) sits at the
  centre, already growing in a slow steady push.
- The words arrive around it, word by word, the line re-centring (the reference's "Any language [folder]
  Instantly"): "en" `w:en`, [the old site], "hjemmeside," `w:hjemmeside`. Then the line swaps to "de ikke er"
  `w:de2` … "stolte" `w:stolte` (accent) "af." `w:af`, with the old site still in the line. Each line stays readable
  for 1.2 s or more.
- Objects: while the line is up, two more old sites slide up behind the first as a soft stack (staggered springs),
  so "de fleste virksomheder" reads as many.
- The one camera move of the hook: from about 2.6 to 4.4 a smooth push toward the inline window (sine ease, the
  viewer sees it coming). It grows until it fills about 60% of the frame, and the words glide out past the edges.

**A2 · "Eller slet ingen." (4.22 – 6.3), KEEP.**
- Inside that window, the old site's content drops away row by row (springs, top to bottom) and the error page is
  left: "Siden kan ikke findes" (the 404 from `A_old`), big, sharp, about 60% of the frame, landing on `w:ingen` and
  readable for at least 1.3 s.
- Out: the window shrinks into a small dot at the centre (one morph, 0.7 s): the first logo dot.

**A3 · "Med Creoble fortæller du kort om din virksomhed." (6.3 – 9.5): the dot becomes Creoble, then the wizard.**
- The dot opens into the six sage dots (the C) with the wordmark beside it on `w:creoble` (small lockup, 1.2 s).
- Then the lockup rises to the top and the `WizardWindow` grows up from below (spring, damping 1) and settles: the
  whole form column readable, the window about 1500 px wide. Fixed frame from here.

**A4 · "Navn, branche, hvad du laver og hvordan man kontakter dig." (9.5 – 13.5), KEEP the typing.**
- The one camera move of this scene: a smooth push (about 2 s, ending about 9.9) to a close view of the form
  column, so the fields are large (the column about 1100 px wide). Then it holds.
- Objects, top to bottom, each on its word, with the cursor leading every action:
  - `w:navn`: click into Virksomhedsnavn, type "Holm Fysioterapi" (about 14 chars/s);
  - `w:branche`: the select opens a small menu (three options, "Fysioterapi" highlighted) and takes "Fysioterapi";
  - `w:hvad` … `w:laver`: a field "Hvad laver du?" eases in under Branche (the fields below make room, one spring)
    and types "Genoptræning og massage";
  - `w:kontakter`: E-mail types "kontakt@holmfysio.dk" and Telefon "+45 31 42 53 64".
- Then the cursor glides to "Fortsæt" and presses it (about 13.3).

**A5 · "Så bygger Creoble siden til dig." (13.5 – 16.0): button → dots → loading.**
- The pressed button contracts into a dot; the wizard window sinks away below (spring, fade); the dot opens into
  the six-dot logo, turning as the loader (`Spinner`, about 280 px, centred), on `w:bygger`.
- By `w:siden` an empty browser window rises behind/under the spinner (the site's frame, about 1150 px wide,
  placed as in `Handoff1`), the spinner settling small onto its address bar.

**A6 · "Tekst, billeder og opbygning, alt sammen ud fra det du skrev." (16.08 – 20.5): the site assembles from the
answers.** Fixed frame: the site window, centred (the `Handoff1` pose). Objects only:
- `w:tekst`: the headline and paragraph type/rise in, line by line.
- `w:billeder`: the hero photo and the three service photos land in their frames one by one (scale 0.94 → 1,
  staggered).
- `w:opbygning`: the remaining blocks (nav, buttons, cards) slide up into the layout, top to bottom.
- `w:alt` … `w:skrev`: three small chips with the wizard's answers ("Holm Fysioterapi", "Fysioterapi",
  "Genoptræning og massage") rise in beside or below the window and fly into the site where they are used
  (name → the nav, the others → the headline area and the service cards), each landing with a soft highlight.
- Draw the site with `HolmSite` pieces or `SiteWindow build`; if `build` cannot separate text, photos and
  layout, layer your own masks over `SiteWindow` so the three phases are distinct.
- By `f("h1") − 9` the picture equals `Handoff1` exactly.

### Builder B: h1 (20.5) → h2 (44.65 s), `scenes/B.tsx`
**B1 · "Du ser hele siden før du betaler en krone." (20.5 – 24.0).**
- Frame: the site window centred. The one camera move: a slow pull-back so the WHOLE page is seen: the window
  grows taller (one morph) to show the full page (hero, services, contact strip), about 80% of the frame height.
- `w:fr` … `w:krone`: a light chip "Gratis forhåndsvisning" rises onto the window's top edge and stays 1.5 s or more.

**B2 · "Og vil du ændre noget, skriver du det bare." (24.2 – 26.7).**
- The window returns to its normal size, slightly closer on the hero (the scene's push, smooth).
- `w:ndre`: the cursor clicks the headline; a sage outline and a small edit field grow out of it.
- `w:skriver`: "Gør overskriften mere personlig" types; send is pressed; a tiny `Spinner`; the headline's words
  swap to `NEW_HEADLINE` (rise out, rise in).

**B3 · "Når du er tilfreds, vælger du selv." (26.92 – 28.6): type.**
- The site shrinks into a small thumbnail card at the centre (one morph), and the line appears above it:
  "Du vælger selv." (hero, accent "selv."), on `w:vlger`, staying 1.3 s or more.

**B4 · "Download siden én gang for alle, eller lad os sætte den online for 99 kroner om måneden." (28.56 – 34.2):
two choices.** Fixed frame, objects only.
- The thumbnail card splits into two cards side by side (one morph: the copy slides right), inside SAFE, each
  about 700 × 520:
  - left, on `w:download`: "Download", with the site thumbnail and a line "Én gang for alle" arriving on `w:n`;
    a small download arrow button (UI, not a metaphor tile);
  - right, on `w:eller2` … `w:online`: "Online", the thumbnail under an address pill "holmfysio.dk"; the price
    "99 kr. /md." rises in big on `w:99`.
- The card being spoken about is full strength; the other dims to 55%.

**B5 · "Uden binding." (34.44 – 35.6).** On the right card a row "Uden binding" ticks in with a sage check
(`w:binding`). Both cards full strength for a moment.

**B6 · "Vælger du hosting, får du dit eget dk-domæne. E-mail på domænet og siden online på europæiske servere."
(36.08 – 42.4), KEEP the green.**
- `w:vlger2` … `w:hosting`: the cursor clicks the right card; the left card leaves downward; the right card morphs
  into the `HostingCard` (one box growing to 1000 × 660, centred, about 60% of the frame).
- Rows arrive top to bottom, each "Sætter op" with its small turning logo, then turn green on their words:
  row 1 on `w:dkdomne`, row 2 on `w:email` … `w:domnet`, row 3 on `w:online2` … `w:servere`.
- The scene's one push: a slow, small push toward the rows while they turn.

**B7 · "Det hele sættes op for dig." (42.72 – 44.65).** All three "Aktiv"; a soft sage sweep runs once down the
card; the price row settles. By `f("h2") − 9` the picture equals `Handoff2` exactly.

### Builder C: h2 (44.65) → end (65.2 s), `scenes/C.tsx`
**C1 · "Får du nye priser eller et nyt billede, skriver du det i dit panel og siden opdateres." (45.22 – 49.8).**
- The hosting card shrinks to a small card at the left edge of SAFE and the live site window rises at the right
  (about 900 px wide); between them a "panel": a white card "Dit panel" with one text field (about 520 px wide).
  Fixed frame; a row filling left to right: panel, then site.
- `w:priser`: the field types "Massage: 450 kr." and on the site the Massage card's price line updates (old
  value rises out, new rises in, a soft highlight).
- `w:billede`: a photo thumbnail is dropped onto the panel (the cursor carries it) and the site's hero photo
  cross-fades to the new one (use another `holm-*.jpg`).
- `w:opdateres`: a small "Opdateret" check lands on the site window.

**C2 · "Du rører aldrig en linje kode." (50.06 – 52.3): type.**
- The panel and site shrink away downward; the line "Aldrig en linje kode." arrives (hero; accent "kode."), words on
  `w:aldrig`, `w:en3`, `w:linje`, `w:kode`; fully up for 1.2 s or more.

**C3 · "Du kan stoppe når som helst." + "Prisen er den samme hvert år." (52.54 – 56.0): the plan card.**
- A subscription card rises (about 900 × 520): "Hosting · holmfysio.dk", "99 kr. /md.".
- `w:stoppe`: a row "Stop når som helst" ticks in with a sage check.
- `w:prisen` … `w:r`: under the price, three year columns "År 1", "År 2", "År 3" arrive left to right, each
  "99 kr. /md.", the same height, joined by a thin level line: the same price every year.

**C4 · "Og skriver du til os, svarer en dansker." (56.2 – 58.9).**
- The plan card leaves upward; the chat panel rises (about 820 × 600): header "Creoble Support"; the customer's
  bubble "Kan I hjælpe med min e-mail?" on `w:skriver3`; on `w:svarer` the reply from "Sofie" (avatar "S", sage)
  types: "Selvfølgelig. Jeg kigger på det nu." A small Danish flag chip "Dansk support" by her name on
  `w:dansker`.

**C5 · Outro, after the reference (58.9 – 65.2): "Byg din side gratis på creoble.dk".**
- The reference: a clicked black button turns to the accent colour and becomes the star; the star settles as the
  logo mark; the wordmark slides out beside it; the address types in below.
- Ours: the cursor clicks the chat's black send button (about 58.7); it turns sage and contracts into a dot; the
  panel sinks away; the dot glides to the centre (a calm arc, about 1 s) and becomes the largest logo dot while
  the other five arrive round the ring one by one (springs, 0.08 s apart): the C, about 200 px, complete by `w:byg`.
- The C moves left as the wordmark slides out beside it (the lockup about 700 px wide, centred, upper middle).
- `w:gratis`: a black button "Byg din side gratis" rises under the lockup (radius 12; DM Sans 500, 34 px).
- `w:creobledk`: "creoble.dk" types in under the button (DM Sans 32, ink). The cursor glides to the button and
  rests on it; the button's press lands about 63.3.
- To the end: the slow push only. The lockup, the button and the address stay fully readable for at least 2 s.

## Files
- You own only your scene file and any `scenes/A_*.tsx` (B_, C_) helpers. Never edit the kit, never run
  `npm install`, never delete outside `out/`.
- Report: the flow result (JERK count, profile maximum, where it is flat and why), the sheet path, one line per
  beat, anything you could not do.
