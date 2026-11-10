# Creoble v6 (Danish): build contract (65.2 s, 1920×1080, 60 fps)

Client feedback round (Willads, Creoble) on our demo. The film is new; the script and the Danish voice-over are the
same as v5. The voice-over is paced: silence is added between scenes, so every move can finish before the voice goes
on (`vo/pace.py`).

## The brief (read first)
Karl: *"Very important: constant motion, good heavy Apple animations, but now mostly inspired by the reference video,
also the visuals and what you do with visuals in animation. Same script, same Danish voice-over. New video."*

The reference is a 33 s SaaS film (Langease-style): light background; one accent colour; words appearing one by one,
centred; UI windows tilted in 3D; a camera flying through a tunnel of screens; extreme close-ups of one UI element; a
button that becomes a star that becomes the logo. Take its techniques, not its tempo or colours. Willads: *"It's 33
seconds and fast; ours is 65 seconds and calm."*

**Willads: KEEP**
- The opening: old websites and **"Siden kan ikke findes"** (0–5 s).
- The **typing in the wizard** (8–12 s).
- **Domain, mail and website turning green** one after another (38–43 s).
- The structure and the timing per scene. The script does not change.

**Willads: FIX**
1. **Camera.** A 3D camera that moves through the scene, with perspective, depth of field and motion blur (reference
   6–10 s and 16–21 s).
2. **Product size.** The product is too small. What the voice-over talks about fills at least half the frame. Use
   extreme close-ups (reference 22–24 s).
3. **Layout.** One grid and one set of margins. Nothing is cut off (the old film's hosting card at 31 s and the pills
   at 42 s were cut off).
4. **Typography.** Alternate pure kinetic-type beats with product UI beats.
   - Kinetic-type beats: big, centred, word by word, one accent word (reference 0–4 s and 26–28 s).
   - Product UI beats: little or no text.
   - No blur-in text.
5. **Style.** Calm, light, quiet, magazine-like, like their real wizard: white fields, thin borders, a Fraunces
   headline, one black button. Do not use:
   - icon metaphors (no toggle, padlock, "99" tiles, "Hej" speech bubble);
   - bouncy sage dot transitions;
   - heavy black pills;
   - bounce;
   - confetti.
6. **Transitions.** One element becomes the next scene: the reference's button → star → logo (24–29 s), and its
   progress bar sweeping into the next shot (10–12 s).
7. **Sound** (done by the lead). Soft UI sounds and a calm, minimal music bed, low in the mix.
8. **Logo.** The new dots logo is the recurring element: the loading animation while the site generates, and at the
   end the dots fly in, assemble into the C, then the wordmark appears.

## Hard rules
- **Background:** cream `C.bg` #FAFAF8, never animated, never a colour flood.
- **Colours:** ink, cream, white, sage #87A89E, the accent `ACCENT` #6F9187 (italic accent words), sage tints, and
  `C.sageDark` (the chat button, the progress segment). The example site keeps its own slate teal.
- **Kinetic-type beats.** Use `Kinetic` from `./type`: Fraunces 400, centred.
  - Sizes: `TYPE.hero` 136 px for 1–3 words, `TYPE.big` 112 px for longer lines. Never under 56 px.
  - At most one line, with exactly one accent word (italic, `ACCENT`).
  - Each word arrives on its own spoken word, rising through its mask. The line re-centres by itself.
  - No blur on type, ever. Depth-of-field blur on a plane is for camera depth, not for revealing words.
- **Product beats.** The subject fills at least 50% of the frame width or height.
  - Use extreme close-ups: one field, one button, the price, one row at 40–70% of the frame.
  - Text in the UI reads at 24 px or more on screen while it matters (get the camera close).
- **The grid:** `SAFE` = x 144 / y 108 / 1632 × 864.
  - Every discrete element (card, pill, button, text line, chat panel, logo lockup) sits fully inside it.
  - Only a full-page surface (the wizard page, the website) may run past the frame edge, and only in a close-up
    where that clearly reads as a close-up.
- **Motion identity:** calm, precise, editorial.
  - Curves: `OUT` (0.22, 1, 0.36, 1) for arrivals; `INOUT` for camera moves, carries and morphs.
  - No overshoot anywhere: no `bounce()`, and `aspring` only with damping 1.
  - Durations: about 0.5 s for UI responses, 0.6–0.9 s for arrivals, and 1.0–2.0 s for camera moves.
  - Fast moves exist only in transitions (fly-throughs, a truck along the progress line, a fall-away), and they carry
    motion blur.
- **Constant motion:**
  - Never a still frame. The camera always drifts at least slowly (a continuous dolly, truck or orbit) and something
    in the content moves.
  - A new visual event every 0.6–1.2 s while the voice speaks.
- **The camera:** `./cam`. Every beat lives in a `Stage3D` with `Plane`s, and the camera moves through that world.
  - Depth of field: `ap` 12–24, focused on the subject. Things in front of or behind it go soft; the subject never
    does.
  - Use 3D angles (rx / ry of 4–20°) so depth is obvious, rest to rest with `INOUT`, or as one continuous slow move.
- **Cursor:** `Cursor` (the macOS arrow) in screen space, placed with `project()`.
  - It glides 0.6–0.9 s (`cursorAt`), hovers briefly, presses visibly (the button dips with `press`), and the
    response comes after.
- **Truth:** only the facts below. The example client is Holm Fysioterapi (fictional), holmfysio.dk.

## Facts (on screen, only these, in Danish)
- Wizard: as in the screenshot (`Wizard`).
- Prices: "499 kr.", "Én gang.", "Intet abonnement.", "Siden er din.", "Nul risiko.", "0 kr." (in the roll), and
  "Fra 83 kr./md." with "faktureres årligt".
- Hosting: "Domæne og e-mail er med", "Fast pris", "Også når du fornyer", "Domænet i dit navn", "Servere i Europa",
  "Ingen binding".
- Support: "Ingen kø", "Ingen robotsvar".
- Closing lines: "Hjemmeside og hosting, samlet ét sted", "Byg den. Se den. Så køber du.", "Byg din side gratis",
  "creoble.dk".
- "Gratis" (from the wizard: "Du ser siden gratis").
- The edit request text (scene 4) and the chat lines (scene 8) are illustrations, written below.

## Clock and kit (read the files' headers; don't edit them)
- **Clock.** `g` counts 30ths of a second and is FRACTIONAL at 60 fps (g = frame / 2).
  - `f(label)` gives a label's time in g; `k(g, label, dur_s, ease)` gives 0..1 progress.
  - Labels are the voice-over's words (`w:…`, list below) and `h1` / `h2`. You can offset them ("w:kort+0.3") or
    use plain seconds.
  - Never index arrays with g.
- **`./cam`:**
  - `Stage3D`, `Plane` (with `farBlur` / `farMask` for steep planes);
  - `cam()`, `camKeys` (poses at times), `camAdd` (a base pose plus additive moves);
  - `project` (world → screen, for the cursor and for checking framing);
  - `SAFE`, `PERSP`, `win`.
  - Camera semantics: z decreasing moves forward; rx + looks down; ry + looks right.
  - A plane at z = Z shows at natural size when the camera is at z = Z.
- **`./type`:** `Kinetic` (items `{ t | node+w, at, out?, accent?, dur? }`), `words()`, `TYPE`, `ACCENT`.
- **`./dots`:** `LOGO`, `RING`, `BOX_C`, `dotsAt(size, cx, cy, spin)`, `Dots`, `Spinner`, `assemble(t, from, size, cx, cy)`,
  and `Icon`.
- **`./ui`:**
  - `WizardWindow` (the page in its browser, 1600 × 846; `WIZ_R` holds page rects; page y = window y − 46);
  - `SiteWindow` (1460 × 906) and `NEW_HEADLINE`;
  - `HostingCard` (1000 × 660; `CARD_R` rects), `Cursor` and `cursorAt`;
  - `Handoff1` / `Handoff2`, `camH1` / `camH2`, `H1_SITE` / `H2_CARD`, `HANDOFF_HALF` (9 g), `inHandoff`.
- **`./shared`:** `k`, `f`, `kf`, `typed(g, at, text, cps)`, `press(g, at)`, `aspring`, `RollNumber`, `Ico`, `Wordmark`
  ("Creoble." with the sage stop; `p` reveals it), `PillButton`, and the constants `C`, `OUT`, `INOUT`, `SERIF`,
  `SANS`.
- **Motion blur:** your scene file exports `BLUR: [number, number][]` (windows in seconds). Inside them, the final
  render blends 6 sub-frame samples. Keep each window at 0.8 s or less, and only around fast moves.

## Hand-offs
Both sides draw exactly the kit's picture inside ±0.3 s (`HANDOFF_HALF` = 9 g) of the label.
- **h1 = 13.6 s (A → B):** `<Handoff1 g={g} />`. The finished site, far and soft, drifting; no type on screen.
  - A: from `f("h1") − 9` draw only Handoff1. Before that, converge on it: the site Plane at `H1_SITE`, the camera at
    `camH1(g)`.
  - B: until `f("h1") + 9` draw only Handoff1, then continue from `camH1`.
- **h2 = 37.92 s (B → C):** `<Handoff2 g={g} />`. The whole hosting card, sharp, the rows "Sætter op", the price
  shown.
  - B converges on `H2_CARD` / `camH2` by `f("h2") − 9`.
  - C starts from it.

## Words (paced film seconds; label = "w:" + key)
```
 1  din 0.58 nye 0.76 hjemmeside 1.00 er 1.52 f 1.78 minutter 2.02 vk 2.34
 2  bygget 3.03 af 3.51 ai 3.78
 3  fortl 5.87 kort 6.28 om 6.50 din2 6.70 virksomhed 6.82
 4  creoble 8.99 bygger 9.56 hele 9.92 siden 10.36
 5  ingen 11.33 teknik 11.62          6  ingen2 12.29 skabeloner 12.52
 7  det 14.11 bedste 14.28
 8  du 15.00 ser 15.16 den 15.26 frdig 15.48 fr 15.94 du2 16.16 betaler 16.32 en 16.72 krone 17.12
 9  vil 18.22 du3 18.30 ndre 18.42 noget 18.68     10 skriv 19.23 det2 19.52     11 creoble2 20.06 retter 20.66 det3 20.94
12  tilfreds 22.39      13 499 23.24 kroner 24.18      14 n 25.15 gang 25.38      15 intet 25.95 abonnement 26.34
16  siden2 27.14 er2 27.58 din3 27.86      17 ikke 28.74 tilfreds2 28.96      18 s 29.76 koster 29.92 det4 30.18 ingenting 30.40
19  nul 31.07 risiko 31.48
20  skal 33.18 den2 33.36 p 33.50 nettet 33.64      21 vi 34.31 stter 34.48 det5 34.78 hele2 34.92 op 35.20 for 35.50 dig 35.62
22  fra 35.98 83 36.16 kroner2 36.66 om2 37.28 mneden 37.34
23  domne 38.28 og 38.76 email 39.00 er3 39.36 med 39.54      24 fast 39.97 pris 40.32      25 ogs 41.00 nr 41.06 du4 41.28 fornyer 41.40
26  domnet 42.11 i 42.87 dit 42.92 navn 43.08      27 servere 43.69 i2 44.34 europa 44.46      28 ingen3 45.13 binding 45.50
29  brug 47.03 for2 47.20 hjlp 47.38      30 et 47.95 menneske 48.18 der 48.74 forstr 48.80 din4 49.16 forretning 49.32
31  ingen4 50.18 k 50.50      32 ingen5 51.06 robotsvar 51.38
33  creoble3 53.25      34 hjemmeside2 54.14 og2 54.74 hosting 54.90 samlet 55.38 t 55.92 sted 56.16
35  byg 57.11 den3 57.34      36 se 57.76 den4 58.04      37 s2 58.46 kber 58.72 du5 59.00
38  byg2 60.01 din5 60.24 side 60.38 gratis 60.58 p2 61.18 creoble4 61.38 dk 61.98            end 65.18
```

## Shot list
Seconds are paced film seconds. Each beat is a direction, not a cage, but keep the rules and the KEEP moments.

### Builder A: 0 → h1 (13.6 s), `scenes/A.tsx`
**HOOK (A1–A4), Karl (10 Nov): "be very inspired by the reference video's hook".** The reference's opening, beat for
beat:
- 0–2.5 s: words appear one by one, centred, and the line re-centres.
- 3–4.5 s: a small object sits INSIDE the line between words (its folder icon).
- 4.5–5.5 s: the camera pushes into that object; it opens into a tilted window.
- 6–9.5 s: the camera flies down a TUNNEL of screens, with a short line of type floating in the middle of the tunnel.

Ours does the same with Willads' KEEP (old websites and "Siden kan ikke findes" in the first 5 s):

**A1 · The line with an object in it (0 – 1.5).**
- At frame 0 a small old-website window (about 300 × 190 on screen, dated: a grey title bar, Times text, a blue
  link, a bevelled button; see A2) is already drifting gently at the centre: never a still frame.
- From `w:din` the words arrive around it: "Din" `w:din`, "nye" `w:nye`, then the window as an inline `node`, then
  "hjemmeside" `w:hjemmeside` (accent). The line is `Kinetic` TYPE.big with the window as an inline item of width
  300, so the words slide apart around it like the reference's "Any language [folder] Instantly".

**A2 · Into the window, the tunnel of old sites (1.4 – 2.9), KEEP.**
- From about 1.4 the words leave and the camera pushes into the inline window (it fills the frame, INOUT 0.5 s).
- That window opens into a corridor of old websites, like the reference's tunnel (6–9.5 s), calm but clearly 3D:
  - 8–10 planes of about 1200 × 760, on the left and right walls (ry ±72–80°), the ceiling and the floor (rx ±75°),
    at z from −400 to −4000;
  - the camera flies forward through them (BLUR across the fast part), decelerating, with a slight roll settling.
- **The old sites** are drawn by you in HTML/CSS as fictional dated Danish small-business sites from about 2006:
  - names: "Jensens Bageri", "Hansen Tømrer & Snedker", "Salon Lone", "Nielsen VVS", "Café Hjørnet";
  - look: Verdana / Times / Comic Sans, bevelled grey buttons, blue underlined links, a tiled background,
    "Velkommen til vores hjemmeside!", a hit counter "Besøgende: 004127", "Sidst opdateret: 12.03.2009", an "Under
    konstruktion" stripe;
  - an old grey window bar with a path only ("/forside.htm"), never a real-looking domain; no images; slightly
    desaturated.
- **Inside the tunnel**, floating in its centre like the reference's "Just drop and go": the line "få" `w:f`,
  "minutter" `w:minutter` (accent), "væk." `w:vk` (TYPE.big). The camera travels with it.

**A3 · "Siden kan ikke findes" (2.6 – 3.1), KEEP.**
- At the tunnel's end, facing the camera: an old browser error page. White; Times or Arial; H1 "Siden kan ikke
  findes"; small "HTTP 404 – Filen eller mappen blev ikke fundet."; an old grey "Opdater" button.
- It is readable and about 60% of the frame wide for a moment (about 2.6–2.95).
- The "få minutter væk." line leaves just before.
- At about 2.95 the camera flies through the 404 page (BLUR 2.9–3.2) into calm cream space: the old web is gone.

**A4 · K "Bygget af AI."** On cream, right after the fly-through, settling: `w:bygget`, `w:af`, `w:ai` ("AI." accent),
TYPE.hero. The camera's slow push goes on.

**A5 · Crane down to the wizard (4.25 – 5.6).**
- The `WizardWindow` lives in the same world below the line (about y +1150), tilted back (rx 25–35°).
- After "AI." lands, the camera cranes down (y +1150) and tilts down to face it (rx to match), pushing in. The line
  leaves through the top of the frame. BLUR around the fastest 0.5 s.
- By 5.6 the window faces the camera; the form column is about 900 px wide on screen; the headline "Lad os starte
  med det vigtigste" is readable.

**A6 · The wizard, typing (5.87 – 8.6), KEEP.**
- `w:fortl`: the cursor glides in from the lower right to the Virksomhedsnavn field (0.7 s) and clicks at about
  6.45 (focus ring and caret).
- The camera pushes to an extreme close-up of the field (the field about 1300 px wide on screen by `w:kort` + 0.4).
  Depth of field on the field; the page around it goes soft.
- Typing "Holm Fysioterapi" (`typed`, about 13 chars/s, `caretSolid` while typing) from about 6.6 to 7.9. The camera
  tracks the text slightly right.
- 7.9–8.4: the camera pulls back and glides down-right to "Fortsæt". As it passes, Branche shows "Fysioterapi" (a
  quick fade at about 8.0).
- The cursor glides to Fortsæt (0.6 s), hovers at 8.3, and presses at 8.5.

**A7 · Button → dots (8.5 – 9.0), Willads 6.**
- Lift a copy of the button off the page as its own Plane at the same world spot (`hideButton` on the page).
- Its label fades; it shrinks into a black dot (0.35 s, INOUT). The camera pushes in.
- The dot splits into the six logo dots, which open out into the C (sage) and start turning as the `Spinner` by
  `w:creoble` (8.99).
- The wizard window falls away behind (dolly back plus depth of field, gone by 9.3).

**A8 · Loading, then the progress line (8.99 – 10.9), Willads 8 and 6.**
- `Spinner` size about 300, centred, turning (200°/s). The camera orbits slowly (ry −6 → +6).
- `w:bygger`: a 3 px sage line grows out of the spinner to the right: the progress bar (reference 10–12 s). The camera
  trucks right along it (BLUR during the truck).
- The line becomes the TOP EDGE of the site's browser window: the window unfolds downward from it (clip-path inset
  from the bottom, INOUT 0.6 s).
- The site builds inside it (`SiteWindow` build 0 → 1 over about 1.2 s; the blocks resolve in order). The spinner
  fades as the line leaves it.
- `w:hele` / `w:siden`: the camera settles on the whole window (about 1500 px wide on screen, slight 3D angle).
- **World position:** put the site Plane at `H1_SITE` from the start (0, 0, −1400, ry −8), so this camera is close
  to it (z about −1350).

**A9 · A short glide over the finished site (10.6 – 11.3)**, with a 5° turn.

**A10 · K "Ingen teknik." → "Ingen skabeloner." (11.33 – 13.09).**
- The camera pulls back (to about z −140) and the site recedes and goes soft (ap about 20).
- The line sits in front at the focus: "Ingen" `w:ingen`, "teknik." `w:teknik` (accent, out at `w:ingen2`), then
  "skabeloner." `w:skabeloner` (accent). One line: "Ingen" stays; the line re-centres.
- The words leave at about 13.05. By `f("h1") − 9` (13.3) you are exactly at Handoff1.

### Builder B: h1 (13.6) → h2 (37.92 s), `scenes/B.tsx`
**B1 · K "Det bedste?"** `w:det`, `w:bedste` (accent). It sits over the far, soft site, continuing camH1's drift.
Out at about 14.7.

**B2 · Fly to the site (14.7 – 15.4).**
- The camera dollies forward to the site (to about z −1350, INOUT 0.8 s, BLUR). The focus follows, so the site is
  sharp on arrival.
- `w:du` / `w:frdig`: the finished site is big and sharp.

**B3 · One calm scroll pass (15.3 – 17.0).**
- The site scrolls down once (scroll 0 → 560, INOUT 1.7 s, readable: the service cards with photos pass).
- At the same time the camera glides down-left over it at an 8° angle; the far side goes soft (`farMask`).
- It never scrolls back up.

**B4 · "før du betaler en krone" (15.94 – 17.9).**
- The camera rises to the address bar: an extreme close-up, with the pill about 45% of the frame wide.
- At `w:betaler` a small light-sage pill "Gratis" slides in beside "Forhåndsvisning" (DM Sans 500).
- While the camera is this close (the page body out of frame or deeply soft), reset the scroll to 0. It is never
  seen scrolling up.

**B5 · "Vil du ændre noget?" (18.22 – 18.9).**
- The camera pulls back to the hero.
- The cursor glides to the site's headline "Kom godt i bevægelse igen." and clicks at `w:noget`.
- The headline gets a selection outline (2 px sage, radius 8), and a small edit field attaches under it: white,
  hairline, about 640 × 64 page px, placeholder "Beskriv din ændring…".
- The camera pushes in: headline plus field are about 55% of the frame.

**B6 · "Skriv det." (19.23 – 20.0).** Type "Gør overskriften mere personlig" (about 20 chars/s), then press the field's
small black send arrow at about 20.0.

**B7 · "Creoble retter det." (20.06 – 21.1).**
- The send arrow becomes a tiny `Spinner` for 0.5 s.
- Then the old headline's words rise out through a mask (staggered) and `NEW_HEADLINE` ("Velkommen hjem / i din
  krop.") rises in word by word, in Holm's own type (DM Sans 600, 76 page px, −0.035em, line-height 1.0, `HOLM.ink`).
- Draw the headline yourself over the page: pass `headline={<span />}` to the site and put yours at page x 70,
  y 168.
- The outline and field fade; the camera eases back to show the updated hero.

**B8 · Clear (21.1 – 22.3).** The camera dollies back and the site falls away into depth (soft), leaving cream. BLUR
if fast.

**B9 · The price, all kinetic type (22.39 – 31.84).** The type sits on Planes; the camera keeps a slow continuous
orbit (ry −5 → +5) and push.
- "Tilfreds?" `w:tilfreds` (accent, hero), out at 23.0.
- "499 kr.": "499" upright ink at 240 px from `w:499`, "kr." italic `ACCENT` at `w:kroner`.
- `w:n`: the price line moves up (y −120, INOUT 0.6 s). A sub-line appears below it (Kinetic, 72 px) and swaps on
  each phrase (the old words rise out and the new rise in):
  - "Én gang." (accent "Én");
  - `w:intet`: "Intet abonnement." (accent "abonnement.");
  - `w:siden2`: "Siden er din." (accent "din.");
  - `w:ikke`: "Ikke tilfreds?" (accent "tilfreds?").
- `w:koster` → `w:ingenting`: the price rolls 499 → 0. The three digit columns roll down to 0, then the two leading
  zeros fold away so it reads "0 kr.", centred and smooth.
- `w:nul`: the sub-line becomes "Nul risiko." (accent "Nul").

**B10 · Through the zero (31.9 – 33.2), Willads 6.**
- The sub-line leaves. The camera pushes into the "0" until its counter fills the frame, and passes through it
  (BLUR 32.4–33.0).
- Beyond it, further back in the world, is the site window, whole (address "Forhåndsvisning").

**B11 · "Skal den på nettet?" (33.18 – 34.3), the address pill becomes the hosting card.**
- The camera glides to the address bar.
- A copy of the address pill detaches and grows into the `HostingCard`: one box morphing from the pill's rect to the
  card's rect (clip-path or scale, INOUT 0.8 s). The card's content fades in as it lands. The site recedes behind
  (soft).
- By 34.2 the card faces the camera, whole and inside SAFE, with rows 0 and price 0.

**B12 · "Vi sætter det hele op for dig."** The rows arrive one by one (`w:stter`, `w:hele2`, `w:op`; rows 0 → 3), each
"Sætter op" with its small turning logo. A slow push with a 4° orbit.

**B13 · "Fra 83 kroner om måneden."**
- `w:fra`: price 0 → 1.
- The camera pushes in to an extreme close-up of "Fra 83 kr. /md." (about 50% of the frame wide; "faktureres årligt"
  readable) from about 36.1 to 37.1.
- Then it pulls back to Handoff2's pose by 37.62 and draws Handoff2 from `f("h2") − 9`.

### Builder C: h2 (37.92) → end (65.18 s), `scenes/C.tsx`
**C1 · Green, one after another (38.28 – 39.9), KEEP.**
- From Handoff2, the camera glides up from the price to the rows (pushing in; the rows about 60% of the frame).
- Row 1 turns active at `w:domne`, row 2 at `w:email`, row 3 at `w:med` (each 0 → 1 over 0.45 s).

**C2 · K "Fast pris." → "Også når du fornyer."**
- The camera pulls back and the card recedes, soft but still there with its sage rows.
- The line sits in front: "Fast" `w:fast` (accent) "pris." `w:pris`. They leave at `w:ogs − 0.1`.
- Then "Også" `w:ogs`, "når" `w:nr`, "du" `w:du4`, "fornyer." `w:fornyer` (accent).

**C3 · The pills (42.11 – 46.2), KEEP and FIX 3.**
- Three light pills: white, hairline, soft shadow; DM Sans 500 at 44 px with a small sage dot on the left; height 96,
  radius 48. Never black.
- "Domænet i dit navn" (`w:domnet`), "Servere i Europa" (`w:servere`), "Ingen binding" (`w:ingen3`).
- They form a vertical stack, centred, gap 28. Each slides up into place on its phrase (OUT 0.6 s), and the stack
  re-centres vertically as each one joins. All inside SAFE.
- The camera orbits slowly round the stack (ry −8 → +8). The card stays soft far behind. The C2 line leaves at
  `w:domnet − 0.1`.

**C4 · K "Brug for hjælp?"**
- The pills rise out, staggered, from about 46.3.
- The line: "Brug" `w:brug`, "for" `w:for2`, "hjælp?" `w:hjlp` (accent).

**C5 · A person answers (47.8 – 49.9).** (The panel's input row has a small black send button at the bottom right: C7
clicks it.)
- The line leaves. The wizard's sage chat button (dark sage `C.sageDark`, a white chat icon, drawn about 120 px)
  arrives at the centre (from 0.6 scale, OUT 0.5 s, no bounce).
- The cursor clicks it at about 48.0, and it opens into the chat panel: one shape morphing from the circle to a white
  panel of about 820 × 640, hairline, soft shadow, inside SAFE.
- **The panel:**
  - header: a small sage `Icon` and "Creoble", with "Support" muted;
  - a message from the customer (right, sage-tint bubble): "Kan I hjælpe med min e-mail?";
  - at `w:menneske`, the person: an avatar circle (sage, white initials "SL") and the name "Sofie";
  - her reply types into a white hairline bubble from about `w:forstr` to 49.7: "Selvfølgelig. Jeg kigger på det med
    det samme."
- The camera pushes toward her reply (avatar plus reply about 50% of the frame).

**C6 · K "Ingen kø." → "Ingen robotsvar."**
- The panel recedes, soft.
- The line: "Ingen" `w:ingen4`, "kø." `w:k` (accent; out at `w:ingen5`), then "robotsvar." `w:robotsvar` (accent).

**OUTRO (C7–C11), Karl (10 Nov): "be very inspired by the reference video's outro".** The reference's ending, beat for
beat:
- 22.5–24 s: an extreme close-up of a row; the cursor clicks a black button.
- 24–24.5 s: the button turns to the accent colour and becomes a big four-point star.
- 25–26 s: the star shrinks and flies off on a soft curved trail.
- 26–28 s: it lands trailing a line of words ("Translate. Dub. Distribute"), riding after the last word as each
  arrives.
- 28.5–29 s: it becomes part of the logo mark.
- 29–31 s: the wordmark slides out beside the mark; the URL types in small below.

Ours, with the dots as the star:

**C7 · The click → the dot → the C (51.9 – 53.3).**
- During "Ingen robotsvar." the chat panel stays soft behind. At about 51.9 the line leaves and the camera comes back
  to the panel's black send button (extreme close-up). The cursor clicks it (about 52.1).
- The button turns sage and contracts into one big sage dot (INOUT 0.35 s), like the reference's button → star.
- The dot shrinks and flies to the centre on a soft curved trail (a short fading trail of 4–6 ghost dots), where it
  becomes the largest logo dot.
- The five other dots fly in from depth around the frame (`assemble()`, soft arcs, BLUR 52.4–53.3) and land at
  `w:creoble3` (53.25) exactly: the C, about 240 px, centred on `BOX_C`. No overshoot.

**C8 · The wordmark slides out (53.4 – 54.1).** As in the reference, the C moves left (INOUT 0.7 s) while `Wordmark`
(h about 96) reveals to its right from behind it; its stop lands last. The lockup is centred.

**C9 · "Hjemmeside og hosting, samlet ét sted."** The lockup rises (y −150). The line appears below it (TYPE.line 88;
accent "samlet"), one word per label. A slow dolly in.

**C10 · "Byg den. Se den. Så køber du." (57.11 – 59.5), the reference's "Translate. Dub. Distribute".**
- The lockup and the previous line leave. The smallest dot of the C detaches and flies down on a soft trail.
- One line accumulates word by word (TYPE.big; accent "køber"), with that sage dot (24 px) as the last inline item,
  riding after the last word as each one arrives.

**C11 · The end (60.01 – 65.18), the reference's final lockup.**
- The line rises out. The trailing dot flies back up on a soft trail and becomes the largest dot of the C. The other
  five appear around the ring in turn (0.07 s apart, OUT). Then the wordmark slides out beside it: the final lockup,
  centred, slightly above the middle.
- From `w:byg2`, "Byg din side gratis på" types in small under the lockup (DM Sans 30, muted). From `w:creoble4` to
  `w:dk`, "creoble.dk" types after it in ink. This is the reference's "langease.ai" typing under the logo.
- The hold to the end: a slow camera dolly keeps it alive; nothing else moves.

## Each builder's QC (on your own span only; the machine has 4 CPUs shared by 3 builders)
1. `npx tsc --noEmit -p .` is clean for your files.
2. Render stills from one bundle:
   `node tools/stills.mjs A 30 90 150 …` (60 fps frame numbers, quarter scale), about 24 frames across your span
   (at least 2 per sentence, plus your transitions).
3. Then `python3 tools/sheet.py "out/A_*.png" -o out/A_sheet.png`. Look at the sheet (it is 480 px tiles) and fix:
   - anything cut off or outside SAFE;
   - type under the sizes;
   - a subject under 50% in a product beat;
   - a frame with nothing moving;
   - a wrong word on screen.
4. Never render the full film or video. The lead renders the preview.
5. Report back:
   - your BLUR windows;
   - the sheet path;
   - anything you could not do, with the reason.

## Files
- You own only your scene file (`scenes/A.tsx`, `B.tsx` or `C.tsx`), plus any `scenes/A_*.tsx` (B_, C_) you
  create.
- Never edit the kit (`cam`, `type`, `dots`, `ui`, `shared`, `lib`, `clock`, `Story`, `Film`, `Root`). If you need a
  variant of a kit piece, copy it into your own file.
- Never run `npm install`; never delete outside `out/`.
- `node_modules` is in place.
