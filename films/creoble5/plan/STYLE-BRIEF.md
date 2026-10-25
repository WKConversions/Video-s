# Creoble: Apple-style brand video, style brief

Paste this into a new chat to make a video in the same style. It describes the approved Creoble film:
- version v5 final v2, Danish, 55 s;
- file `films/creoble5/deliver/creoble-v5-dk-55s-60fps-v2.mp4` in the Video-s repo.

It covers what the film is, how it looks and moves, and every correction the client's producer (Karl) gave on the way
there.

---

## 1. The brief in one paragraph
A 55-second SaaS explainer for **Creoble** (creoble.dk), a Danish AI website builder with hosting:
- **Where it plays:** the hero video on creoble.dk and their LinkedIn company page.
- **Audio:** Danish voice-over with a quiet music bed and sound effects.
- **Format:** 1920×1080 at 60 fps.
- **Style:** minimal Apple style in Creoble's own brand:
  - one clear thing on screen at a time, centred, on a calm cream background;
  - obvious Apple animation on the objects: springs, morphs, Liquid Glass, Dynamic Island, rolling numbers, word
    reveals;
  - a calm, slow, soft camera;
  - about 3% "useful" motion (the motion explains something, never decorative wobble).

## 2. Brand (Creoble's official kit)
- **Colours:**
  - background #FAFAF8;
  - text / ink #1A1614 (warm near-black);
  - sage #87A89E (primary);
  - light sage #A8C4BB;
  - deep sage #495D58 (italic accent words);
  - dark sage #4A6B62;
  - sage tint #E7EFEC;
  - cream #F5F1EA;
  - card #F7F4ED;
  - hairline #E8E5DF.
  - **No orange, ever.**
- **Type:**
  - Fraunces 400 for headlines and the wordmark, with italic key words in deep sage;
  - DM Sans 400/500 for UI;
  - small labels in DM Sans 500, uppercase, with wide tracking.
- **Wordmark:** "Creoble." as the client's outlined SVG (Fraunces 400, optical size 24, −0.025em). The full stop is sage
  on light grounds and light sage on dark ones. Never type it as text.
- **Buttons:** a near-black (ink) pill with cream text, DM Sans 500.
- **The example client inside the product:** "Holm Fysioterapi", a fictional physiotherapy clinic on Frederiksberg.
  - It has its own slate-teal look (bg #F4F1EC, ink #1F2A2E, accent #2E4A52), so it never reads as Creoble's UI.
  - Example domain: holmfysio.dk.
  - Its headline is "Kom godt i bevægelse igen.", corrected in the film to "Velkommen hjem i din krop.".
- **The client's wishes:**
  - cream or off-white background;
  - the brand colour primary, cream secondary;
  - no orange;
  - clean, minimal, Apple-like.

## 3. Script and voice-over (Danish, used as written)
> Din nye hjemmeside er få minutter væk. Bygget af AI. Fortæl kort om din virksomhed. Creoble bygger hele siden.
> Ingen teknik. Ingen skabeloner. Det bedste? Du ser den færdig, før du betaler en krone. Vil du ændre noget? Skriv
> det. Creoble retter det. Tilfreds? 499 kroner. Én gang. Intet abonnement. Siden er din. Ikke tilfreds? Så koster
> det ingenting. Nul risiko. Skal den på nettet? Vi sætter det hele op for dig. Fra 83 kroner om måneden. Domæne og
> e-mail er med. Fast pris. Også når du fornyer. Domænet i dit navn. Servere i Europa. Ingen binding. Brug for
> hjælp? Et menneske, der forstår din forretning. Ingen kø. Ingen robotsvar. Creoble. Hjemmeside og hosting, samlet
> ét sted. Byg den. Se den. Så køber du. Byg din side gratis på creoble.dk.

- **Voice-over:** "Mathias" (ElevenLabs), 53.6 s, in `films/creoble4/vo/vo.mp3`.
- **Word timings:** `films/creoble5/film/src/words.json`. Labels are lower-case with æ, ø and å dropped
  (`w:minutter`, `w:499`), and a repeated word gets a number (`w:creoble2`).
- **Truth:** on screen, only these facts from the script and creoble.dk:
  - 499 kr. once, no subscription, the site is yours, free if not satisfied;
  - from 83 kr./month, billed yearly ("faktureres årligt"), domain and e-mail included;
  - fixed price, also on renewal;
  - the domain in your name;
  - servers in Europe;
  - no lock-in;
  - a human, no queue, no robot answers.
  - Nothing invented.

## 4. The concept: the website is the hero
One object carries the whole film: **a browser window (about 960×600, centred) showing Holm's photo-rich website**,
the product Creoble makes. It is always doing something that explains the line:
- building itself;
- changing looks;
- being edited;
- going online;
- getting a price, a domain, a chat.

Every phrase acts on it: things dock onto it, open over it, fly out of it, or it morphs. Examples:
- into a phone (about 420×896) and back;
- flipping over in 3D to show code or a server map.

Between the five sections the stage stays put, and the camera makes a soft push-in (scale 1.0 → 1.04 over 0.5 s).
The film opens with a sage dot that drops, bounces and stretches into a capsule that opens into the browser. It ends on
the wordmark above the ink button "Byg din side gratis" with "creoble.dk".

## 5. Shot list (times in seconds)
**S1, 0–10.05: build**
- **Opening:** a sage dot drops, bounces twice and stretches into a capsule, which opens (spring morph) into the
  browser.
- **The build:** the site starts as a sage wireframe and resolves block by block into Holm's site. A "2 min" timer
  chip sits in the address bar.
- **"Bygget af AI":** a sage AI sparkle is born from the chip and sweeps over the site. The AI tries three looks (a
  sage tone with a serif headline, then dark, then back), and the hero photo slides.
- **"Fortæl kort om din virksomhed":** a Liquid Glass prompt field docks on the lower part of the stage, with a label
  chip above it. "Holm Fysioterapi" types and appears live in the site's header.
- **"Creoble bygger hele siden":** the page unbuilds to the wireframe and rebuilds in a fast cascade. The site fans
  out into its pages (Forside / Behandlinger / Kontakt) and merges back.
- **"Ingen teknik":** the stage flips in 3D to a back side of scrolling code. A sage strike and wipe cross it, and it
  flips back.
- **"Ingen skabeloner":** grey "Skabelon" template sites flick through a cover-flow, and Holm's real site lands.

**S2, 10.05–17.05: see it, change it**
- **"Det bedste?":** the stage morphs (clip-path) into the phone, with "Det bedste?" centred above it.
- **"Du ser den færdig…":** ONE calm downward pass through the finished site. The Dynamic Island opens into
  "Forhåndsvisning" with an eye, and a glass "0 kr." tag docks on the phone.
- **"Vil du ændre noget?":** a status-bar tap jumps to the top behind a short blur (it never scrolls up). A slow push
  in on the headline, the selection springs on with handles, and the Island shows "Redigerer".
- **"Skriv det.":** a sage chat bubble rises and types "Gør overskriften varmere", then is sent.
- **"Creoble retter det.":** the headline deletes backwards and retypes "Velkommen hjem i din krop.", a check pops,
  and the phone morphs back into the stage.

**S3, 17.05–26.66: price**
- **"Tilfreds?":** a big sage check stamps onto the stage.
- **"499 kroner":** a price capsule docks on the lower half and Fraunces digits roll 0 → 499 with motion blur, then
  "kr.". "Én gang." pops up as a chip.
- **"Intet abonnement":** a "/md" tag flies at the price, is struck through and falls.
- **"Siden er din":** the pages fan out with a "Din" badge.
- **"Ikke tilfreds?":** a gentle question tilt of the stage.
- **"Så koster det ingenting":** 499 rolls down to 0 kr.
- **"Nul risiko":** an iOS toggle row "Risiko" switches off.

**S4, 26.66–39.22: online**
- **"Skal den på nettet?":** a turning dotted globe (real land shapes) grows out of the address bar.
- **"Vi sætter det hele op for dig":** a progress bar and ring fill. The address bar changes from "Forhåndsvisning" to
  "holmfysio.dk" with a lock and a "Live" dot, and two ripples run across the site.
- **"Fra 83 kroner om måneden":** a price capsule rolls to 83 with "kr./md." and the small note "faktureres årligt".
- **"Domæne og e-mail er med":** a Domæne card flies into the address bar, and an E-mail card docks just under it.
- **"Fast pris":** a lock drops onto the price and snaps shut.
- **"Også når du fornyer":** a calendar card flips 2027 → 2028 → 2029 beside a steady "83 kr./md.".
- **"Domænet i dit navn":** "holmfysio.dk" pops in letter by letter with an "Ejer: dig" tag.
- **"Servere i Europa":** the stage flips to a Europe dot map with three server pins and data dots travelling between
  them.
- **"Ingen binding":** it flips back, and a two-link chain snaps.

**S5, 39.22–55.18: help and end**
- **"Brug for hjælp?":** a chat panel opens over the live site (stage plus panel centred as one group), and the
  question types.
- **"Et menneske…":** a human reply types "Hej! Hvordan kan jeg hjælpe?" with a round "C" avatar and a "Svarer nu"
  pill.
- **"Ingen kø":** a queue card rolls "Nr. 12" down to 0.
- **"Ingen robotsvar":** a robot glyph is flicked away.
- **"Creoble.":** the stage collapses into the sage dot, which lands as the wordmark's full stop while the letters
  wipe out of it. The wordmark then slides up small.
- **"Hjemmeside og hosting, samlet ét sted":** "Hjemmeside" and "Hosting" pills merge (gooey) into "samlet ét sted".
- **"Byg den":** the stage flips and rebuilds with a hammer.
- **"Se den":** an eye badge pops and the site makes one calm pass down.
- **"Så køber du":** a "499 kr." tag rolls in and a check pops.
- **"Byg din side gratis på creoble.dk":** the ink pill "Byg din side gratis" lands with press and shine, "creoble.dk"
  sits under it, and the wordmark stays above. It keeps living to the last frame.

## 6. Motion rules (Karl's corrections, all must hold)
- **Minimal, but not tiny:**
  - one hero object at a time, centred, on a plain still background;
  - the stage is about half the frame;
  - at most one short line of text;
  - no full-frame UIs, no bento clutter, no huge statements.
  - Karl: "way way way more minimalistic", and later "bigger object".
- **Everything centred:**
  - the camera only zooms about the frame centre, never pans sideways;
  - side elements sit on the centre line;
  - two things sharing the frame are centred as a group.
- **The camera is calm** (Karl: "the view shifting is too choppy, should be softer, smoother, slower"):
  - at most one reframe per sentence, and many beats hold;
  - each move takes 1.2–2.0 s on a sine / ease-in-out from rest to rest;
  - no spring, anticipation or overshoot on the camera;
  - zoom within about ±12%.
- **The objects are Apple-heavy:**
  - everything that arrives, pops, docks or stamps springs with a clear overshoot and settle (damping about 0.5),
    with squash and stretch on fast travel;
  - morphs rubber-band;
  - 3D flips settle with weight;
  - text rises word by word out of a blur;
  - numbers roll with vertical motion blur and land with a bounce.
- **Scrolling:** never scroll the site up and down. At most ONE calm downward pass where the line is about looking
  ("Du ser den færdig", "Se den"). Get back to the top with a cut-like move (a status-bar tap behind a blur), never a
  visible scroll up.
- **Motion that explains:** every movement shows what the voice says. No decorative wobble, sway or drifting
  backgrounds. Photo swaps in the hero frame stay calm: at most one per 1.5–2 s, crossfaded.
- **Never still:** something always moves, and there are no frozen holds.
- **Variety:** don't repeat the same move in a row. "Zoom through text into the next shot" is banned, and so is
  "everything drifting left while growing".

## 7. Look details
- **Shadows (Apple style, non-directional, even on all sides, generous):** layered box-shadows with zero offset, warm
  ink tint, e.g. for hero UI:
  `0 0 2px rgba(26,22,20,.09), 0 0 30px rgba(26,22,20,.10), 0 0 90px rgba(26,22,20,.13), 0 0 180px rgba(26,22,20,.13)`.
  Small UI uses about half those sizes. Irregular shapes use the same as `drop-shadow` filters.
- **A static dither layer:** a tiled noise PNG, ±1–2 shade levels, never moving, over the whole frame. It removes the
  8-bit banding that big soft shadows show on cream.
- **Liquid Glass:** backdrop brightness/saturate plus a masked rim lens. No SVG refraction filter, which shows
  rectangular seams in headless Chrome.

## 8. Sound
- **The mix:** the voice-over, a quiet music bed and effects that lead.
- **Music:** "Take this Higher" by Michael Ramir C., Mixkit free licence, fitted to 55.18 s. In the mix it sits at
  about −29 LUFS with a 5 dB duck under the voice.
- **Effects:** about 300, one UI sound on every visible event (pop, land, morph, tick, swipe, check, chime, whoosh on
  transitions), from Karl's library (`films/alumni/sound/lib`).
- **Master:** about −15.3 LUFS, peak −1.5 dBTP.

## 9. Technical recipe (the Video-s repo)
- **Stack:** Remotion 4.0.532, 1920×1080, 60 fps. The animation clock is g = frame / 2 (30ths of a second), with
  labels from `words.json`.
- **Five segment files:** `src/scenes/S1–S5.tsx`, each drawing only its own span. The hand-offs at h1 = 10.05,
  h2 = 17.05, h3 = 26.66 and h4 = 39.22 s are drawn identically by both sides (`StageHandoff`).
- **Kit:**
  - `src/v5.tsx`: `Stage` (browser plus Holm site, whole-pixel scrolling), `StageHandoff`, `Phone`, `MiniSite`,
    `NEW_HEADLINE`;
  - `src/shared.tsx`: springs (`bounce`, `aspring`, `press`, `squash`), `LiquidGlass`, `Island`, `Gooey`, `RollNumber`,
    `Toggle`, `PillButton`, `Wordmark`, `HolmSite`;
  - `src/lib.tsx`: colours, fonts, `appleShadow`, `SHADOW`, `SHADOW_BIG`, `DROP`.
- **Smoothness rules:**
  - Move things with transforms on static boxes; never animate left/top/width/height.
  - Slow-moving text either moves in whole pixels or at ≥ 2 px per frame.
  - Avoid long, slow camera tails over text: they step on the pixel grid and read as shake.
  - Don't rely on `will-change` compositor layers for scrolling in headless Chrome (they skip frames).
- **Final render:** `bash ../scripts/render_chunks.sh Film out.mp4 '{"blurSamples":4,"audio":"none"}'
  0,604,1024,1600,2354,3310 public/audio/mix.wav` (4-sample motion blur, H.264).
- **QC:**
  - `motion_check.py`: the final measures about 3% of the frame moving per frame, moving in 95%+ of frames;
  - `jitter_check.py` at full scale: no SHAKE lines;
  - look at a contact sheet with a centre line drawn on it.

## 10. How we got here (so you don't repeat the rejected versions)
- **v1–v3 (English, blue accent):** superseded when the official sage brand kit arrived.
- **v4:**
  - version 1 was too static;
  - version 2 was monotonous (everything drifting left and growing, zooming through text, stutter at 30 fps);
  - version 3 went to 60 fps, bounces, Liquid Glass, the Island and bento grids, but was "too big and too much in the
    screen".
- **v5 (this film):**
  - **Minimal:** a single sage capsule morphing into everything was too small (0.8% motion).
  - **Bigger objects:** reached 2%.
  - **The website as the hero:** 7.4%, but the site scrolled up and down constantly, which Karl disliked.
  - **No scroll ping-pong:** camera framing and content changing in place instead.
  - **Shadows:** first Apple layered, then bigger and directionless.
  - **Apple-heavy springs** on the objects.
  - **A calm camera:** Karl found the view shifting too choppy.
  - **Everything centred:** the final.
