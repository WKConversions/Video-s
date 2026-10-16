# Bingua: portrait version (1080×1920)

The client asked: "can you make exactly this video in portrait format?" So the content is fixed. Keep the same:
- scenes, visual ideas and order;
- words and timings, and the same key-word sync;
- colours, type, kit and motion style.

The finished 16:9 film is `deliver/bingua-38s.mp4`, and a frame per line is in `plan/frames/storyboard_full.jpg`. The only
change is the layout, re-composed for a vertical frame (Reels, TikTok, Shorts, Stories).

## Rules
- **Frame:** 1080 wide, 1920 tall. The composition is "Portrait"; the Film wrapper renders `src/StoryPortrait.tsx`,
  which composes `src/portrait/{A,B,C,D,E}.tsx`.
- **Start from the 16:9 scene.** Copy your landscape scene (`src/scenes/<X>.tsx`) into `src/portrait/<X>.tsx`,
  rename the component to `Scene<X>P`, and re-lay it out. Keep every animation, timing, word sync and piece of content.
  Change positions, sizes and arrangement only.
- **Typical re-layout:** what sat side by side in 16:9 stacks vertically in portrait.
  - Statement on top: left- or centre-aligned, around 96–120 px. Long lines wrap onto two or three lines.
  - Then the visual below (video card, UI card, chart, row).
  - Horizontal rows of video cards become a 2–3-wide row, or a vertical feed column, at a readable size.
  - Wide cards (the transcript, the chart) get narrower and taller, around 940 px wide.
- **Safe area:** keep all text and key UI inside x 60–1020 and y 220–1640. Reels and TikTok overlay the top bar and
  the bottom captions and buttons. Backgrounds and videos may bleed beyond it.
- **Bigger:** on a phone the frame is small. Statements at least 90 px; UI text in focus at least 30 px; the
  word pop-up, the flashcards and the save pill larger than in 16:9.
- **Feed swipe:** wrap the scene in `<Feed g={g} in=… out=… h={1920}>`, so the swipe travels the full height.
  The swipe labels and timings are unchanged.
- **Say:** pass `width={1080}` (and `x`) for centred lines. Use `align="left"` with `x={60}`, `width={960}` for
  left-aligned text. `Say` wraps words with flexWrap.
- **VideoCard:** the clips are portrait (405×720). In portrait they can be big: up to about 760×1350 as a hero, or
  around 300×530 in a row of three.
- Never edit `shared.tsx`, `lib.tsx`, `Story*.tsx`, `clock.ts`, the landscape scenes or other portrait scenes.

## Test
- From your work folder: `node stills.mjs <frames> 1 Portrait` → `out/test/fNNNN.png` (1080×1920).
- Draft: `bash ../../scripts/draftP.sh <first> <last> out/draftP.mp4`, then
  `python3 ../../scripts/clipcheck.py out/draftP.mp4 <first>`.
  - The motion numbers hold for portrait.
  - Every phrase must still be "ok".
- `npx tsc --noEmit` must be clean.
