# Wicflow: hero explainer (storyboard only)

Karl's request (13 Nov 2026): a storyboard for a hero-section SaaS explainer for wicflow.com, using the isometric 3D
block world from their "Built in blocks, highest return first" section as the thread. "No video, only a storyboard."

The storyboard is called **The work, in blocks**. It runs 37.6 s at 1920×1080 and 60 fps, works muted, has an
optional English VO line per beat, and loops (frame 2256 = frame 0). It has 10 beats and 28 rendered styleframes.

## Where things are
- `plan/brief.md`: Karl's brief, with Wicflow's facts and brand.
- `plan/refs/1.png` … `4.png`: the reference fragments of the block world.
- `harvest/`: site screenshots (`home-hero.png`, `home-s01.png` … `home-s09.png`), `site.css`, `home.html`, the mark
  (`wicflow-mark.png`, black on alpha, used as a mask) and the site's fonts: Stack Sans Headline, Inter, Fragment Mono
  and Manrope 800 (the nav wordmark), all from wicflow.com.
- `plan/storyboard/storyboard.json`: the final storyboard. It holds the beats, the drawing spec per key frame, the
  notes, the open questions, each frame's image file and the places where the styleframes differ from the spec.
- `plan/storyboard/site/index.html`: the storyboard page (self-contained, fonts embedded), with the frames in
  `plan/storyboard/site/frames/*.jpg` (1600 px wide, named beat + time in centiseconds, e.g. `B05-1840.jpg` = B5 at
  18.40 s).
- `plan/storyboard/frames-src/`: the styleframes as code. `frame.html?f=<id>` draws one key frame as a 1920×1080 SVG;
  `lib.js` is the isometric block engine (states WIRE, GLASS, SOLID, GLASS-PERI and PERI, studs, leader lines, light
  lines); `frames.js` has one function per frame; `render.js` renders them with Playwright.
- `plan/storyboard/build_page.py`: rebuilds `index.html` from `storyboard.json`.

## Re-render
```bash
cd films/wicflow/plan/storyboard/frames-src
NODE_PATH=$(npm root -g) node render.js /tmp/wf-png            # all frames; or add ids, e.g. B05-1840
cd .. && python3 build_page.py                                  # rebuild the page
```
The full-size PNGs go to the folder you pass (scratch). Only the 1600 px JPGs are kept in `site/frames/`.

## Status
The storyboard is delivered. There is no `film/`, `sound/` or `deliver/` yet. The open questions for Karl and Wicflow
(hero placement, CTA wording, the mark flourish, the schematic bar lengths) are at the end of the page.
