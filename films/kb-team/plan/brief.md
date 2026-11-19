# K.B team film: the brief

A new film for **K.B** (a tech partner for startups and SMEs; site kruslockbosconsultancy.com). Karl van Kessel
(WKConversions) owns the work. He supplied a reference film, a recorded voice-over, a music track and a PDF.

## Karl's words (verbatim)
> I want you to completely replicate the video I added in this prompt for KB Consultancy. But I also added […] the
> script for that video. Because the visuals in the video will be the same, but it's a different script, different
> approach, different background music, which I also added in the prompt. But just the video replicated for KB. So
> don't take exactly the same visuals, but done for KB. So literally the same, but different for KB.
> […] The voiceover is shorter than the replicated video, which you're going to replicate. So you have to align the
> sentences correctly, the same as the replica video. Yeah. Try to also replicate sound effects.
> for cursor use the 3d cursor model you already know from me
> also k.b website is kruslockbosconsultancy.com

What this means:
- **The reference decides the film**: its length (50.06 s), its shot list, the kind of picture in every shot, its
  rhythm, its transitions, its typography behaviour, its cuts, its sound design. We rebuild every shot for K.B: the
  same idea, composition logic, timing and motion, with K.B's brand, K.B's content and K.B's script.
- **Not a copy of Base44's assets**: no Base44 name, logo, UI screenshots, copy, photos or footage. Everything on
  screen is K.B's own (brand, team portraits, client-facing UI we draw, royalty-free footage we source).
- **The cursor** is Karl's 3D hand cursor wherever the reference shows a cursor.
- **Sound**: Karl's voice-over (ElevenLabs, voice Warren), his music track, and sound effects that replicate the
  reference's, taken from Karl's own sound library.

## Standing rules (Karl's, from earlier K.B films)
- Always "K.B". Never write what it stands for, never "Consultancy", no URL or domain on screen.
- On screen, only facts from K.B's site, the PDF (the third service, Growth Technology) or the script. Small generic
  UI words are fine; no invented client names, people, numbers or claims about K.B.
- 60 fps output, 1920×1080. (The reference is 24 fps, 1280×720: multiply its pixels by 1.5.)
- Sound effects only from Karl's library; nothing generated.

## The reference: "Build an app with your name on it" (Base44), 50.06 s, 24 fps, 1201 frames
`reference/base44.mp4`; every frame at 640×360 in `reference/frames/fNNNN.jpg` (frame N = time N/24);
`python3 -I tools/ref.py` makes strips, full frames, crops and colour samples (see its header).

Shot overview (times in seconds; letters are working names):
| | Time | What the reference shows | Reference voice |
|---|---|---|---|
| A | 0.00–1.75 | White paper ground. Small black words arrive: "Build", "an", "app"; an image card opens between "Build" and "an app" and grows | "What if you could build an app" |
| B | 1.75–3.88 | The image becomes an app screen; hard cuts to two more app screens (2.67, 3.13) | |
| D | 3.88–5.42 | Words "With your name on it" centre; portrait photos of people pop in around them | "with your name on it?" |
| E | 5.42–7.83 | Four portraits gather into a row, one becomes the last character of the logo, the logo holds; hairlines; dissolve | "Base44." |
| F | 7.83–8.54 | Live action: four 4-frame flash cuts (a metronome, a machine) | "Big changes start small." |
| G | 8.54–10.58 | Grey-white vignette: a blinking text cursor, then "Build an app" is typed | |
| H | 10.58–11.04 | Macro: giant typed letters, a few at a time ("da|", "daily|", "out|") | "A few words even will get you a fully working app." |
| I | 11.04–12.29 | A prompt box: a sentence is typed, an arrow cursor clicks the orange send button | |
| J | 12.29–13.0 | Two black pictogram glyphs flash; a product photo appears | |
| K | 13.0–14.0 | Product photos fly in around a phone-shaped app card; blue dots | |
| L | 14.0–16.04 | The phone app, items inside it swap | "From a tool only you will use" |
| M | 16.04–17.38 | Full-screen flash cuts every 3 frames: rows of photos; blue silhouettes become photos | |
| N | 17.38–18.08 | Macro: giant black letters, 3 frames each ("p", "ia", "no") | "to… a platform millions might." |
| O | 18.08–19.79 | The prompt box again, a second sentence typed | |
| P | 19.79–20.17 | Dark ground, big coloured circles with letters | |
| Q | 20.17–21.38 | A browser window: chat panel left, the app right, coloured notes move | |
| R | 21.38–22.0 | Live action: a man at his desk | |
| S | 22.0–23.21 | Split: live close-up of hands (left) and a dark leaderboard UI (right); one row climbs the ranks | |
| T | 23.21–25.25 | Dark prompt box; four image attachments load in above the typed sentence | "From passion projects" |
| U | 25.25–25.92 | Flash cuts: pencil sketch, technical drawing, wireframe | |
| V | 25.92–26.63 | The finished app UI (light), a 3D object in the middle | |
| W | 26.63–27.63 | Live action: a maker at his desk, the app on his monitor | "to… enterprise-level systems." |
| X | 27.63–28.29 | UI close-up: suggestion chips, a typed instruction, a build bar | |
| Y | 28.29–29.13 | Browser: chat panel left, a dark dashboard right | |
| Z | 29.13–30.54 | Dashboard close-up: purple bar chart, a tooltip, numbers counting | |
| AA–AD | 30.54–32.79 | Live action, four people at laptops (0.5–0.65 s each), a line of small white text over each | "Same starting point." |
| AE | 32.79–33.75 | White ground: one black rounded-square send button; the cursor clicks it, it turns orange | "No ceiling." |
| AF | 33.75–34.71 | Cards burst upward out of the button: charts, photos, stats; fast rise | |
| AG | 34.71–35.29 | Black ground: a collage of abstract art cards assembles | "Shape it." |
| AH | 35.29–37.5 | Black ground: an app window; it changes into a full-bleed version | "Push it." |
| AI | 37.5–38.54 | A canvas of many app screens, close; numbers count | |
| AJ | 38.54–40.08 | The canvas wider: many more screens | "Build on it." |
| AK | 40.08–41.96 | UI close-up: a report scrolls, check marks, a sentence is typed | "Your back end is covered, secure" |
| AL | 41.96–43.75 | Macro: the typed sentence, huge, word by word | "and ready to launch." |
| AM | 43.75–45.0 | UI corner: a black "Publish" button; the cursor clicks it | |
| AN | 45.0–48.0 | Live action: a man from behind at a desk by a window; white words typed over it: "Build it today" | "What if you can build it today?" |
| AO | 48.0–48.5 | Light ground: a row of five pictogram glyphs cycling | |
| AP | 48.5–50.06 | Full orange screen, the dark logo in the centre | "Base44." |

## The K.B script, line for line against the reference
| Reference voice (time in the reference) | K.B voice-over (Karl's script) | K.B meaning |
|---|---|---|
| What if you could build an app (0.0) … with your name on it? (3.9) | What if your business had the right team … for what comes next? | hook |
| Base44. (5.9) | K.B. | logo |
| Big changes start small. (7.6) | A team behind you. | |
| A few words even will get you a fully working app. (10.4) | Part of your business, with the talent to take it further. | |
| From a tool only you will use (14.2) | From the systems your team works with | service: AI, Agents & Automation (internal systems) |
| to… a platform millions might. (~18) | to the customers you reach. | service: Growth Technology (SEO & GEO, conversion, product marketing) |
| From passion projects (23.0) | From early concepts | service: Software Development (idea, sketch, wireframe) |
| to… enterprise-level systems. (~27) | to products people choose. | Software Development (finished products) |
| Same starting point. (30.6) | One shared vision. | |
| No ceiling. (33.1) | One partner. | |
| Shape it. (35.3) Push it. (37.1) Build on it. (38.3) | Think big. Build well. Grow with us. | |
| Your back end is covered, (39.6) secure (41.0) and ready to launch. (41.6) | Your growth has a partner. Involved. From day one onwards. | |
| What if you can build it today? (44.7) | What could your next chapter look like? | |
| Base44. (47.6) | K.B. | end logo |

## K.B material already in the repo
- `../kb-tech-partner/harvest/facts.md` (every fact, verified against the live site on 2026-10-08), `../kb-tech-partner/assets/`
  (logo tile SVG and wordmark, 14 client logos, 22 tool logos, site screenshots), `../kb-tech-partner/harvest/ref-images/`
  (four team portraits, the team photo).
- `harvest/growth-technology.pdf`: the new third service page (English on pages 2–5): "Growth Technology - Visibility,
  Conversion & Product Marketing": SEO & GEO Optimization; Website & Conversion Optimization; Digital Product Marketing.
- K.B brand: navy #293A51, cyan #38C8FF, ground #F7F7F7, Montserrat; logo lettering Copperplate. The earlier K.B hero
  film's kit is in `../kb-hero/film/src/kit.tsx`; the 3D hand cursor in `../kb-hero/film/src/hand.tsx` + `public/hand`.
