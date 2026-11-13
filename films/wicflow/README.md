# Wicflow: hero explainer (storyboard only)

Karl's request (13 Nov 2026): a storyboard for a hero-section SaaS explainer for wicflow.com, using the isometric 3D
block world from their "Built in blocks, highest return first" section as the thread. "No video, only a storyboard."

The storyboard is called **The work, in blocks**. It runs 37.6 s at 1920×1080 and 60 fps, has an English VO line
per beat, and loops (frame 2256 = frame 0). It has 10 beats and 29 rendered styleframes.

**v2 (current), after Karl's feedback "too much text, more SaaS-like":** the voice-over carries the words. On screen
there are only three text moments outside the product UI: "First block · guaranteed" (B5), "All of it connected" (B8)
and the end lockup (B9). Every beat shows its VO line literally, or shows the platform itself, big and centred:
- the company's real work;
- the AI mapping as an interface;
- the costed plan as a UI card;
- the first block rising;
- the quote follow-up running;
- the blocks built and priced in writing, with their automations running;
- all of it connected.

v1 (text-led, with a headline column) is kept as `plan/storyboard/storyboard_v1.json`. Its frames and code are in git
history.

## Where things are
- `plan/brief.md`: Karl's brief, with Wicflow's facts and brand.
- `plan/refs/1.png` … `4.png`: the reference fragments of the block world.
- `harvest/`: site screenshots, `site.css`, `home.html`, the mark (`wicflow-mark.png`, black on alpha) and the site's
  fonts (Stack Sans Headline, Inter, Fragment Mono, Manrope 800).
- `plan/storyboard/storyboard.json`: the v2 storyboard. It holds:
  - the beats, with the VO, the text outside the UI and the UI text for each beat;
  - the drawing spec for each key frame;
  - the text budget and what changed in v2;
  - the notes and the open questions.
- `plan/storyboard/site/index.html`: the storyboard page (self-contained, fonts embedded), with the one-image overview
  at the top.
- `plan/storyboard/site/storyboard-overview.png`: **the whole storyboard in one image** (3200 px wide). Each beat shows
  its number, name, time span, key frames and VO line.
- `plan/storyboard/site/frames/*.jpg`: the styleframes, 1600 px wide, named by beat and time in centiseconds (for
  example `B06-2260.jpg` is B6 at 22.60 s).
- `plan/storyboard/frames-src/`: the styleframes as code.
  - `frame.html?f=<id>` draws one key frame as a 1920×1080 SVG.
  - `lib.js` is the isometric block engine, centred on x 960 in v2.
  - `frames.js` has one function per frame.
  - `render.js` renders the frames with Playwright.
- `plan/storyboard/build_page.py` rebuilds `index.html`; `plan/storyboard/make_overview.js` rebuilds the overview image.

## Re-render
```bash
cd films/wicflow/plan/storyboard/frames-src
NODE_PATH=$(npm root -g) node render.js /tmp/wf-png            # all frames; or add ids, e.g. B06-2260
cd ..
NODE_PATH=$(npm root -g) node make_overview.js                 # the one-image overview
python3 build_page.py                                           # the page
```
The full-size PNGs go to the folder you pass (scratch). Only the 1600 px JPGs are kept in `site/frames/`.

## Status
Storyboard v2 is delivered. There is no `film/`, `sound/` or `deliver/` yet. The open questions are at the end of the
page:
- B1's problem-led VO;
- subtitles for muted autoplay;
- where the film sits in the hero;
- the CTA wording;
- "Hosted in Finland";
- the schematic bar lengths.
