# K.B client-case loops: brief (Karl, 12 Nov 2026)

> "Make 10-second loop videos for these pages, so 8 videos. In the style of kruslockbosconsultancy.com, with glimpses
> here and there of the client case's own house style. The video purely visualises problem → solution: the problem they
> had and K.B solving it. That is the loop video. Finish them asap, skip the storyboard. Make them one by one."

## Format
- 10 s, 1920×1080, 60 fps, **silent** (they autoplay muted on the case pages), and a **seamless loop**: the last frame flows
  into the first (`tools/seam.py` says OK).
- One composition per case in `film/src/cases/<slug>.tsx`, exporting `Loop`. Deliver
  `deliver/<slug>-10s-1080p60.mp4`.

## Story
Each case is pure visualisation of its own story, with facts only from its K.B case page:
1. **The problem** the client had, shown as their real situation: for example a manual process, piles of admin, slow
   intake, scattered tools, errors, waiting.
2. **K.B steps in** with the K.B tile or cursor.
3. **K.B's solution** turns it around: an automation, a workflow, an app, a dashboard.
4. **The result**: one number from the page.
5. Back to the opening.

Text is minimal and big: at most one short problem line, one solution line and one result figure, each readable for at
least 1.2 s. The pictures carry it.

## Look
**K.B (the base).**
- The site's canvas `#F7F7F7`, navy `#293A51`, cyan `#38C8FF` and Montserrat.
- The K.B logo tile (`KBTile` in `src/kb.tsx`), clean white UI cards with soft navy shadows, `ToolTile`s for the tools
  K.B builds with.
- Cyan is a shape on light grounds and never text.

**The client (glimpses).** Their brand colour, logo, a fragment of their site, UI or product, used on a card, a phone
screen or a detail, so you recognise whose case it is. K.B stays the frame.

## Motion (Karl's house rules from the Creoble rounds)
- Constant motion at a calm tempo you can follow. Never a still frame, never a flash followed by a stall.
- The objects carry the motion: Apple-style arrivals, morphs, swaps and things growing out of what caused them.
- Everything settles with a small bounce (`pop` / `popOut` in `src/loop.tsx`). The camera, if it moves at all, never
  bounces.
- Nothing is linear except a slow periodic drift.
- At least one motion-design flourish that makes the loop memorable, like the green smear Karl loved: an element that
  smears out and leaves a trail into the next state. Make it different in every case.
- Everything sits inside SAFE (x 144–1776, y 96–984). Nothing is cut off.
- Every case gets its own visual concept: no two loops share a layout or a central idea.
