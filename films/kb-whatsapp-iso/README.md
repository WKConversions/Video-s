# K.B blog + social loop: WhatsApp orders into the CRM (isometric)

A 12-second seamless loop for the K.B blog post "Still Retyping WhatsApp Orders by Hand? How to Automate Them Into Your
CRM", for the blog page and social media. 30 fps, no audio, readable with the sound off.

Story: an isometric phone lights up with three WhatsApp orders (an unread badge counts 3, 8, 14); app icons
(WhatsApp, Instagram, Messenger, Gmail, a website chat) orbit, order slips flutter, a desk shows "retype?". A hub card
"One inbox" rises; the icons glide in along sky-blue lines, the chat bubbles follow. A line draws to a CRM card, the
bubbles become order rows (Customer, Qty 6, Tomorrow) and "Reviewed" stamps on; a van with water bottles drives towards
a map pin. "2 hrs/day saved" stamps in, the K.B wordmark fades in; then everything returns to the opening frame.

## Formats (`deliver/`)
One scene laid out in a 1080 x 1080 square, rendered natively in four canvases (nothing is upscaled or cropped away):
1:1 1080x1080 (master), 4:5 1080x1350, 9:16 1080x1920 (the top and bottom 250 px hold no key content; the wordmark sits
above the bottom zone), 16:9 1920x1080. The K.B wordmark is placed in each format's own bottom-right corner.

## Facts
- Seamless: every motion runs on a period that divides 12 s (orbit 4 s, floats 2, 3 and 4 s) and every move ends
  before 12 s, so the frame after the last is frame 0. 360 frames.
- Motion (`motion_check.py`, the 1:1 master): median 2.6% of the frame changing per frame, against the brief's 4%. The
  orbit phases measure 2.7-3.1%, the arrival of the hub 5.7%, the calm resolution (6-10 s) 1.6-2.0%. Reaching 4% would
  need the resolution to keep moving much more (it is "long calm" in the brief).
- Only the brief's words on screen. App logos are drawn as small channel icons only. K.B colours: off-white ground with
  a soft sky-blue wash, navy #293A51 lines and text, sky blue #38C8FF only for the connector lines, hub outline, tick
  and the "2 hrs" highlight. Montserrat. Ease cubic-bezier(0.65, 0, 0.35, 1); a small overshoot only on the bubble pops
  and the Reviewed stamp.

## Files and commands (from `film/`)
- `src/Iso.tsx`: the whole loop (isometric projection helpers, the objects, the timeline); `src/index.ts`: the four
  compositions Square, Portrait, Story, Wide.
- Preview: `npx remotion render src/index.ts Square out/p540.mp4 --scale=0.5 --concurrency=4 --muted`.
- Finals: `npx remotion render src/index.ts <Square|Portrait|Story|Wide> out/<name>.mp4 --concurrency=4 --muted --crf=16`.
