# Creoble v2: storyboard and build contract

## Why a v2
The client saw v1 (`deliver/creoble-36s.mp4`; its stage is in `plan/v1_Story.tsx`) and said:
> "this is the right direction but too much static and too much the same visuals. a bit boring. i want more variation
> and more apple style animations and things happening."

Keep the direction: cream ground, light blue as the only accent, Apple-like restraint and polish, the same voice-over,
the same example bakery. What changes:
- every phrase gets its own picture idea (composition, scale and framing change from phrase to phrase);
- the product floats as 3D UI planes that turn slowly, devices move with intent, objects become the next thing;
- something meaningful is always moving.

v1's mistake was one composition (a laptop in the middle, a headline above) held for 17 seconds.

## The look (unchanged tokens, `src/lib.tsx`)
- **Ground:** cream #FAFAF7, drawn globally by `Story.tsx` (two light-blue blooms drifting, a little grain). Scenes
  draw on top of it; don't draw your own full-frame background, except scene D's and E's blue field (below).
- **Colour:**
  - ink #1D1D1F, gray #6E6E73, light #A1A1A6, line #E5E5EA, fill #F2F2F0, white;
  - blue #4AA3F5 (the accent), blueDeep #2A86E0 (blue text on white), blueTint #EAF4FE, blueGlow;
  - the bakery site's own warm neutrals are allowed inside the site only.
  - **No orange**, no other hues. Gradients only within the blues (for example blueTint → blue, or a white→blue sheen).
- **Type:**
  - Inter for statements and UI: 600, tracking −0.035em on big lines.
  - Fraunces for the Creoble wordmark (with its blue dot) and the bakery site's headings.
  - Statement lines alone on the ground: 96–150 px. A line over a picture: 56–72 px.
  - Any text the viewer must read: 24 px or more on screen (after scaling). Tiny text inside a device is texture only.
- **Ease (from `lib.tsx`):**
  - ARRIVE (long ease-out) for entrances;
  - MOVE (ease-in-out) for carries and moves;
  - DEPART for exits;
  - nothing bounces, no elastic, no spins.
- **Shapes:** generous radii (14–40 px), soft wide shadows like `0 30px 60px -28px rgba(29,29,31,0.35)`, hairline
  borders.
- **Signature move:** Apple's word build. Each word rises, fades in and sharpens from a blur, on its spoken word
  (`Say`).

## Motion rules (measured on your draft with `scripts/clipcheck.py`)
- **Always alive:** moving in 95%+ of frames, typical change 2.5%+ of the frame, no still longer than 0.4 s. Get
  there with content, not camera shake:
  - a 3D plane turning a few degrees over its hold;
  - a slow push (2–5%);
  - parallax layers;
  - type that builds;
  - UI that responds.
- **Every phrase brings a new visual on its key word.** clipcheck must say "ok" for every phrase in your window.
- **One dominant movement at a time;** secondary layers drift.
- **Every change is a move.** Something carries through or transforms. No hard cuts and no fades to nothing between
  ideas; a quick dissolve of one detail is fine.
- **Clear before busy:** at most about four separate things on screen. Text never collides with text: an outgoing
  line has cleared, or is mostly gone, before the next lands in the same place.
- **Apple feel:**
  - precise, confident, smooth: a 0.5–0.9 s ARRIVE for entrances, 0.8–1.4 s MOVE for big carries;
  - soft blooms and glows allowed in the blues;
  - fast moves are fine, because the final render has motion blur.

## Kit (`src/shared.tsx`; import from `../shared`)
**Clock and type**
- `k(g, at, dur, ease?)` is a 0..1 progress from a label or word, e.g. `k(g, "w:ai+0.1", 0.6)` or `k(g, 12.3, 0.5, MOVE)`.
- `f(at)` is the frame of a label.
- `typed(g, at, text, cps)` returns the text typed so far.
- `Say` builds a statement word by word: `words=[{t, at, blue?}]`, `y` is the top of the line, `size`, `out` is a label
  for its exit, plus `x`, `weight`, `color`.

**Brand and icons**
- `Wordmark x y size o dot` is centred on (x, y); `dot` 0..1 scales the blue dot.
- `Ico n s c w` draws line icons: spark, check, arrow, up, lock, eye, globe, mail, server, code, store, tag, leaf,
  desktop, tablet, phone, pin, sliders, layout, image, palette, type, card.

**Devices and the site**
- `Laptop x y s o` with a 1280×800 screen (`SW`, `SH`), and `Phone x y s o` with a 392×830 screen (`PW`, `PH`). Both
  are centred on (x, y).
- `Site g build scroll headline select` is the bakery desktop site (1280 wide).
  - `build` 0..1 assembles its blocks.
  - Its edit (the headline swap and the opening-hours row) is timed globally on "it" (18.22 s).
  - `headline` replaces the headline element with your own animation.
  - `select={false}` hides its built-in selection box.
  - `HEAD_OLD` / `HEAD_NEW` are the two headlines.
- `MobileSite g build` is the bakery mobile site.

**v2 additions**
- `ANSWERS` holds the three answers, with icon, question, answer and word.
- `AnswerChip icon text size` is a floating answer pill.
- `Cursor x y s o press` is a pointer whose tip is at (x, y).
- `Plane x y w h rx ry rz z s o` is a 3D-turned box for floating UI.
- `AppBar`, `Tell` and `FIELDS` are v1's builder UI, for reference or reuse.
- `keyed` is v1's keyed camera helper.

Need something else? Write it inside your own scene file. **Never edit `shared.tsx`, `lib.tsx`, `Story.tsx`,
`clock.ts` or other scenes' files.**

## Facts allowed on screen (creoble.dk; the UI is in English to match the voice)
- Build your site for free; see it finished in your browser before you pay.
- Built in a few minutes from what you tell it; change it in plain language, not code.
- 499 kr, one payment, no subscription; "Get it for 499 kr" (the site's CTA); the site is yours.
- Hosting from 83 kr/month, billed yearly; your own domain; email included; European servers; GDPR; "we set it all
  up"; built in Denmark.
- "Build your website for free at creoble.dk".

Not allowed:
- ratings, customer counts, template counts;
- AI model names;
- device-size preview toggles (not a stated feature);
- invented prices or durations.

The bakery ("Bageriet Lund", Aarhus) and its texts are example content.

## Words (seconds; `vo/words.json`; use them as `"w:…"` labels)
- **Hook and meet:** what .06, if .22, building .46, a .66, website .82, was 1.2, this 1.48, simple 1.8, meet 2.95,
  creoble 3.40.
- **Tell:** just 4.42, tell 4.56, us 4.82, about 4.96, your 5.18, business 5.3. what2 6.23, you 6.32, do 6.48.
  what3 7.14, you2 7.26, offer 7.38. and 8.28, what4 8.46, makes 8.68, you3 8.88, different 9.0.
- **AI:** then 9.9, let 10.14, ai 10.54, do2 10.86, the 11.24, rest 11.36.
- **Build:** in 12.16, minutes 12.28, your2 13.0, answers 13.16, become 13.5, a2 13.9, complete 14.08, ready 14.75, to
  15.02, use 15.18, website2 15.4.
- **Edit:** want 16.43, to2 16.52, change 16.66, something 16.86. just2 17.66, describe 17.84, it 18.22.
- **Preview:** preview 18.91, everything 19.24, for 19.82, free 20.18.
- **Price:** happy 21.06, with 21.24, the2 21.44, result 21.54. its 22.38, yours 22.58, for2 22.8, just3 23.06, 499
  23.44, kroner 24.2.
- **Hosting:** need 25.3, hosting 25.42. weve 26.28, got 26.46, that 26.58, covered 26.76, too 27.02.
- **Simple:** no 27.87, coding 28.06. no2 28.78, complexity 29.0.
- **Close:** just4 30.04, your3 30.2, website3 30.38, made 31.2, simple2 31.36. creoble2 32.44. End 35.6.

Labels (in `clock.ts`): hook 0, meet 2.80, tell 4.17, ai 9.75, build 11.96, change 16.23, preview 18.71, happy 20.86,
host 25.10, nocode 27.72, simple 29.84, brand 32.19.

## The six scenes
Each scene file `src/scenes/<X>.tsx` exports `Scene<X>` and draws only inside its window. Windows overlap at the
hand-offs; the contract at each hand-off is exact, so the joins are invisible.

### Scene A: 0.00–4.85 s. "What if building a website was this simple?" / "Meet Creoble."
**0.06–2.7: the question.**
- The question builds word by word, big and centred: line 1 "What if building a website" and line 2 "was this
  simple?", with "simple?" in blue. Around 100–120 px.
- Around it, recognisable website-building clutter floats in shallow 3D depth, drifting and slowly turning, so the
  frame is alive. It arrives word by word from "building": small white UI cards with an icon each (code `</>`,
  palette, type "Aa", layout grid, image, sliders), a colour swatch or two in the blues, a little code snippet card.
  6–9 pieces, placed around the edges, never over the type.
- On "simple" (1.8) everything collapses: the clutter flies inward and shrinks into one blue dot. It is the dot of
  the "?", or a dot at the line's end.
- The question leaves (blur-rise out) by about 2.75, so only the single blue dot remains, centred, at about 2.8.

**2.95–4.4: "Meet Creoble."**
- "Meet" builds above the centre (around 48–60 px, gray).
- On "creoble" (3.40) the Creoble wordmark grows out of the dot: the dot is the wordmark's own blue full stop. The
  letters reveal leftward from it (mask wipe or per-letter rise) while the dot slides right to its place.
- Wordmark: around 200 px Fraunces 500, the dot in blue. The dot lands with a small, precise scale settle (no bounce).
- A slow push or drift keeps it alive.
- "Meet" fades out by about 4.2.

**4.17–4.77: hand-off to B.**
- The wordmark shrinks and flies (MOVE) to become the builder window's logo.
- It must be exactly `<Wordmark x={350} y={202} size={28} dot={1} />` (same props, opacity 1) at frame 143 (4.77 s).
- A draws nothing from frame 143 on.

### Scene B: 4.10–12.40 s. "Just tell us about your business." … "Then let AI do the rest."
**4.17–4.77: the builder window rises.**
- A big floating window rises from below (from +320 px, opacity 0, ARRIVE, 0.6 s). It is flat at frame 143.
- Geometry: centre (960, 580), 1400×820, radius 28, white, soft shadow.
- App bar: 64 px tall, hairline bottom. B draws the logo `<Wordmark x={350} y={202} size={28} />` only from frame 143
  on, plus "Step 1 of 2" at the right.
- Inside, the title "Tell us about your business" (around 44 px) and the three fields (questions from `ANSWERS`).

**4.8–6.2.**
- The window tilts slowly into a gentle 3D angle (`Plane`: rx around 6°, ry around −10° over about 1.5 s) and keeps
  drifting.

**6.23 "What you do." / 7.14 "What you offer." / 8.46 "And what makes you different."**
- One field per phrase lifts out of the window toward the camera and fills the middle of the frame: a large field
  card around 1100 px wide, 40–48 px text.
- Its answer types on with a caret (from the phrase's first word plus about 0.15 s; finish within the phrase).
- Each lift has its own detail:
  1. The store icon tile pops in.
  2. Three tag chips (Sourdough / Cakes / Catering) pop under the field as their words are typed.
  3. A leaf icon and a soft blue underline.
- Each field settles back into the form (scaling down into its slot) as the next lifts. The window keeps its slow tilt
  behind (dimmed or blurred slightly while a field is lifted).

**9.9 "Then let AI do the rest."**
- The window turns back to flat and recedes a little.
- A big "Build my website" button (blue, white text, spark icon) is in focus.
- A `Cursor` glides in and presses it on "AI" (10.54): a quick 0.1 s press, then a soft blue ripple.
- The statement "Then let AI do the rest." builds at the top (around 64–72 px, "AI" in blue), or replaces the window
  as the line alone, your call.

**10.6–12.1: AI at work.**
- The window dissolves away while the three answers fly out of it as `AnswerChip`s and are pulled into an AI orb at
  the centre.
- The orb is a soft glowing sphere of blues (blueTint → blue → white sheen, a slowly turning gradient, a gentle glow
  ring). It is light and premium, not neon, and never orange.
- Around the orb, on "do the rest" (10.86 / 11.24 / 11.36), three task pills appear and tick in turn: "Writing your
  texts", "Choosing colours and fonts", "Building your pages".
- The orb breathes and its ring turns.

**12.0–12.12: hand-off to C.**
- Everything except the orb has gone.
- The orb collapses to a bright point at exactly (960, 540) by 12.12 s (frame 364) and is gone by frame 368.

### Scene C: 12.00–19.00 s. "In minutes, your answers become a complete, ready-to-use website." / "Want to change something? Just describe it."
**12.12–13.0 "In minutes".**
- From the point (960, 540) the website bursts out as an exploded 3D stack of layers: nav bar, hero text, hero
  photo, the three cards, the footer.
- Each layer is a flat panel, shown in an isometric-ish view: a `Plane` with rx around 50–60°, rz around −30 to −40°,
  layers separated in z or in screen y.
- The layers fly out one by one (stagger around 0.08 s) and settle into the stack. The stack turns slowly. This is the
  Apple "layers" shot.
- Use the bakery's real content in the layers (`staticFile("img/pastry.jpg")`, `cake.jpg`, `flour.jpg`, the site
  texts).

**13.0–13.9 "your answers become".**
- The three `AnswerChip`s fly in from the edges and dive into their layers:
  - the bakery answer into the nav/hero ("Bageriet Lund");
  - the offer into the cards (Sourdough / Cakes / Catering);
  - the difference into the hero text.
- A blue flash or outline marks each landing.

**14.08 "a complete,".**
- The stack compresses: the layers collapse into one flat page and turn to face the camera (MOVE, around 0.9 s).

**14.75–16.2 "ready-to-use website."**
- The page drops into a `Laptop` that forms around it. Then a `Phone` with `MobileSite` slides in beside it.
- The line "A complete, ready-to-use website." builds at the top (around 60 px, "ready-to-use" in blue) on its words
  (complete 14.08, ready 14.75, website 15.4), or alone first and then the devices, your call.

**16.43 "Want to change something?"**
- The phone leaves. The camera pushes into the laptop until the site's headline fills much of the frame: the laptop at
  around s 1.7–2.0, a slow MOVE of about 1 s. This is a macro detail shot.
- On "change" (16.66) a selection frame with handles and a "Headline" tag snaps around the headline. Draw it yourself
  with `<Site select={false} …>`.

**16.76–18.2 "Just describe it."**
- A large prompt bar floats up in front (white, around 1000 px wide, 32–36 px text, spark icon, blue send button).
- It types "Make it warmer and add our hours: Mon–Fri 6–18" from about 16.76 at about 40 characters a second.
- On "it" (18.22) the send button is pressed.
- The headline rewrites itself: the old words blur out one by one, then the new words "Warm bread, made with love
  every morning." rise in one by one (use the `headline` prop). The opening-hours row (Site's own, on "it") slides in.
- Optional: the line "Just describe it." builds big somewhere it doesn't collide (or skip it; the prompt carries the
  meaning).

**18.3–18.85: pull back and hand off to D.**
- The prompt bar and selection leave. The camera pulls back.
- At frame 566 (18.87 s) the frame must be exactly `<Laptop x={960} y={600} s={0.72}><Site g={g} build={1} scroll={0}
  select={false} /></Laptop>` (default headline), opacity 1, with nothing else on screen. C draws nothing from frame
  567 on.

### Scene D: 18.80–25.45 s. "Preview everything for free." / "Happy with the result? It's yours for just 499 kroner."
**From frame 566.**
- Continue from exactly that laptop and site.

**18.91 "Preview everything".**
- The laptop's site gets a slim preview bar (eye icon, "Preview").
- On "everything" (19.24) the site's pages fan out: the screen content slides aside, and pages fly out of the laptop as
  floating page cards in 3D, side by side: Home, Bread, Cakes, Catering, Visit. Each is a mini page built from the
  site's parts.
- The cards glide past slowly, like a carousel or a cover flow.

**19.82 "for free".**
- A big "Free" lands: for example a statement "Preview everything. Free." with "Free." in blue, or a large pill
  "Preview for free".
- 20.18 ("free") is its key word.

**21.06 "Happy with the result?"**
- The pages gather back into one.
- A `Phone` with the finished site turns into view in 3D (ry from around 25° to around 8°).
- A checkout sheet slides up from the phone's bottom edge (iOS bottom sheet): "Your website", "Get it for 499 kr", a
  blue button.
- The line "Happy with the result?" builds (gray, around 56–64 px) at the top or to the side.

**22.38 "It's yours".**
- The button is pressed (`Cursor` or a tap ripple). The sheet shows a check and "It's yours".

**23.06–23.44 "just 499".**
- A blue disc grows out of the button (iris) and floods the whole frame with the accent blue (C.blue) by about 23.4.
- On "499" (23.44) a huge white "499" (around 280–340 px, Inter 700) rolls in as a slot-machine counter: each digit
  rolls up through numbers and stops, staggered left to right, landing by about 23.9.

**24.2 "kroner".**
- " kr." joins, and "One payment. No subscription." arrives under it (white, around 36–40 px).
- A slow push.

**24.95–25.45: hand-off to E.**
- The blue field must cover the whole frame, flat C.blue, from at least 24.95 to 25.45.
- The "499 kr." group leaves (blur-rise out) so it is gone by 25.30 (frame 759).
- D draws only the flat blue field from frame 759 to its end.

### Scene E: 25.20–30.20 s. "Need hosting? We've got that covered too." / "No coding. No complexity."
**From 25.20.**
- E draws the same flat C.blue full field (on top), so the join is invisible.

**25.30 "Need hosting?"**
- A big white browser address bar rises in the blue field (around 1100 px wide, 44–56 px text).
- The lock icon is in place, and "bagerietlund.dk" types on.
- On "hosting" a "Live" status lights up with a gentle pulse.
- Then the blue field shrinks or opens back to cream: for example, the field contracts into the address bar, or a
  cream iris opens from the bar. The bar stays, and the field is gone by about 26.3.

**26.28 "We've got that covered too."**
- Around the bar (now on cream), a slowly turning dotted globe appears: a sphere of dots in blues, drawn in code.
- Three feature cards or chips orbit or land: "Your own domain" (globe icon), "Email included" (mail), "European
  servers" (server), staggered on weve, got and that.
- On "covered" (26.76) the line "From 83 kr/month, billed yearly." arrives (gray, around 32–36 px).
- Everything keeps turning slowly.

**27.87 "No coding."**
- The hosting picture leaves first (gone by about 27.8).
- "No coding." builds huge (around 130–150 px).
- Behind it, a block of grey monospace HTML/CSS lines scrolls up, and on "coding" (28.06) the code lines wipe away
  line by line (slide and blur out), leaving clean cream.

**28.78 "No complexity."**
- "No complexity." builds as line 2 ("complexity." in blue).
- Behind it, a messy cluster of technical cards (DNS records, server settings, a plugin list, a template picker), tilted
  at odd angles, folds away or flies out on "complexity" (29.0), leaving clean cream.

**29.6–30.15.**
- Both lines leave (blur-rise out). The frame is clean cream by 30.15 (frame 905); E draws nothing after.

### Scene F: 29.90–35.60 s. "Just your website, made simple." / "Creoble."
**30.0 "Just your website".**
- The hero shot. The `Laptop` (with `Site`, build 1, the edited headline) and the `Phone` (with `MobileSite`) rise into
  view, turned in 3D.
- They turn slowly toward the camera (Plane-like rotateY from around −18° to around −5° over about 2 s). Soft floor
  shadow. A gentle push.
- The line "Just your website, made simple." builds at the top (around 64 px, "simple." in blue) on its words (just4
  30.04, your3 30.2, website3 30.38, made 31.2, simple2 31.36).
- Optionally the devices' screens scroll a little.

**31.9–32.4.**
- The devices fold together and shrink into a single blue dot at the centre: the dot that started the film. The line
  leaves.

**32.44 "Creoble."**
- The wordmark grows out of the dot exactly like scene A (the dot is its full stop, the letters reveal leftward). Around
  190 px.
- Then, at about 32.9 (with the dot's settle), "Build your website for free at creoble.dk" arrives under it (gray,
  around 34 px, "creoble.dk" in blueDeep).
- A slow push to the end (35.6). The last 1.5 s may hold almost still, as an end card.

## Your workflow (each builder)
1. **Your folder.** Work only in your own copy of the project: `/home/user/Video-s/films/creoble/work/<X>/` (a full
   copy, with node_modules linked).
   - Edit only `src/scenes/<X>.tsx` there.
   - The other scenes there are empty stubs, except what is noted in your task.
2. **Test frames.**
   - Run `cd /home/user/Video-s/films/creoble/work/<X> && node stills.mjs <frame,frame,...> 1`, which writes
     `out/test/fNNNN.png`.
   - Batch many frames per call (bundling takes about 30 s). Look at them with Read, and make contact sheets with PIL
     to see several at once.
   - Check every phrase's key frames.
3. **Draft clip.**
   - Run `bash ../../scripts/draft.sh <first> <last> out/draft.mp4` (half size, no blur), then
     `python3 ../../scripts/clipcheck.py out/draft.mp4 <first>`.
   - Iterate until motion and phrases meet the targets and the frames look premium.
4. **Typecheck** with `npx tsc --noEmit` (from your folder): it must be clean.
5. **Performance:** keep CSS blur filters small, at most 12 px, and on small elements. Prefer transforms and opacity.
   Don't nest more than about 3 levels of 3D. A frame should render in under about 1.5 s.
6. **Return** a short report:
   - what you built, phrase by phrase;
   - the clipcheck numbers;
   - any contract deviation;
   - the path of your scene file.
