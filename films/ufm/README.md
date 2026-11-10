# Unicorn Founders Malaga: "What happens when the right minds meet?" (41 s, 1:1, 60 fps)

A square motion-design film for Unicorn Founders Malaga (UFM), the founders' networking community in Málaga
(site: ufm.fuf-16d.workers.dev; visual inspiration from the event qualification page, unicorn-founders-malaga.netlify.app).
It is set to Karl's script and the supplied ElevenLabs voice-over ("Christina", 39.3 s).

## The idea
One calm cream stage (Apple style: the background stays still, all motion is in the foreground). The client's own
golden-hour photos travel in frames that change shape on the words:
- two faces meet, and their meeting sparks;
- a card tilts to shift perspective;
- three shapes become the Málaga arch;
- the logo builds line by line;
- founders, builders and investors come together;
- two stories swap;
- the site's three conversation topics appear;
- "ambition" turns into "action";
- one conversation becomes a connection, then a collaboration;
- the qualification page's valuation curve climbs through the four meetings to $1B;
- three editorial lines appear;
- the qualification page's night globe turns to Málaga (36.72° N, 4.42° W);
- "a simple hello";
- the photo folds into the "Apply for a seat" button under the logo.

**Look:** the site's tokens: cream #FAF7F2, ink #292929, bronze italic accents #806750, sand, and the line colour.
**Type:** Bodoni Moda (for the site's Bodoni 72/Didot) and Nunito Sans (for Avenir Next).

**Excluded:** the devices of the two earlier FUF films:
- `films/fuf`: the slot machine, the split-flap board, the HELLO sticker, the rolodex, the seating plan and the
  one-line unicorn;
- `films/fuf-brand`: the points-and-lines network, the business-card fan and the dashed reach.

## Files
- **Voice-over:** `vo/` holds the ElevenLabs file, `whisper_words.json` and `words.json` (script-aligned word starts,
  also in `film/src/words.json`).
- **Harvest:**
  - `harvest/site`, `harvest/qual`: screenshots, text and computed styles of both pages;
  - `harvest/assets`: the client's photos, the logo and the qualification page's views.
- **Film:** `film/src/kit.ts` (tokens, the word clock `w()`, curves), `parts.tsx` (the morphing `Frame`, `Words`,
  `LetterMorph`, the night `Globe`), `Film.tsx` (the ten beats).
- **Sound:** `sound/cues.json` (60 effects from `films/alumni/sound/lib`, each on its picture event), `bed.wav` (music)
  and `film/public/audio/mix.wav`.
- **Storyboard:** `plan/storyboard_v1.jpg` (frames from the build).

## Sources and credits
- **Photos and logo:** the client's own, from the site (`assets/brand-00x.webp`, `logo.png`). The transparent logo,
  mark and wordmark were made from `logo.png`.
- **Globe:** land dots from `films/bingua-globe` (Natural Earth-derived).
- **Music:** "House 02" (Mixkit, Mixkit Stock Music Free License, no credit needed). It was fitted with
  `music_fit.py --length 41 --lift 8.29 --end fade` and lifts on "Welcome".
- **Fonts:** Bodoni Moda and Nunito Sans, SIL OFL.

## Render
- Preview (540p): `npx remotion render src/index.ts Film out/preview_raw.mp4 --scale=0.5 --concurrency=4 --muted
  --browser-executable=$B`, then mux `public/audio/mix.wav`.
- Final: render 1080×1080 in chunks, then mux the mix.
