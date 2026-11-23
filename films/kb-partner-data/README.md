# K.B blog + social loop: partner data without the spreadsheet

A 12-second seamless loop, 1080 x 1080 only, 30 fps, no audio, for the K.B blog post "Still Chasing Partners for Data
by Email? How to Replace the Excel Spreadsheet". Glassmorphism on a soft light gradient (Manrope, navy #172B44,
grey-blue #66768A, one accent #99CDFC).

Story: nine frosted tiles full of jittering Excel and Gmail icons, red "Reminder" / "Final_v3" badges; a navy paper
plane lands on three tiles and each gets another envelope; three tiles go grey with "Missing". The tiles stack into
one frosted card (a springy settle) with "Travel", "Food", "Materials"; the icons swirl in a funnel above it and drop
through its slot one by one. The card rises, four partner rows slide in and get checks, the counter runs to
"100% submitted"; the K.B wordmark shows briefly; the card splits back into the grid of the first frame.

- Seamless: the jitter runs on periods that divide 12 s and every move ends before 12 s; 360 frames.
- Motion (`motion_check.py`): median 2.4% of the frame changing per frame, against the brief's 4%. The chase and the
  portal measure 2.7-5.1%, the overview's last seconds (9-10 s) 0.6-0.8%: frosted white panels on a light ground
  barely register as change.
- Only the brief's words on screen (the counter counts up to "100% submitted"); the logos only as small icons.

Files: `film/src/Loop.tsx` (the loop), `film/src/index.ts`; `deliver/kb-partner-data-loop-12s-1080x1080.mp4`.
Render (from `film/`): `npx remotion render src/index.ts Loop out/loop.mp4 --concurrency=4 --muted --crf=16`.
