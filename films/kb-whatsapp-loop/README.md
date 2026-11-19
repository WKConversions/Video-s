# K.B blog loop: WhatsApp orders into the CRM

A 12-second seamless loop for the K.B blog post "Still Retyping WhatsApp Orders by Hand? How to Automate Them Into Your
CRM". Before / after split screen: on the left an order from a chat bubble is retyped by hand into a grey CRM form
("2 hrs/day"); a sky-blue divider draws down the centre; on the right the same bubble flows into a clean CRM card by a
drawn line, all fields fill at once and are "Reviewed"; the "2 hrs/day" pill is struck through and "Back to your team"
appears; then everything resets to frame 0.

- 1920x1080, 30 fps, 12.0 s (360 frames), no audio. Frame 359 is pixel-identical to frame 0 (checked on lossless
  stills), so the loop has no jump.
- The key action sits inside the centred square x 420-1500: `deliver/…-1080x1080.mp4` is that square crop.
- Only the brief's words are on screen; the typed order is shown as glyph blocks. K.B colours (navy #293A51 to
  #3A4E69, off-white, light slate, sky blue #38C8FF as the one accent), Montserrat, ease cubic-bezier(0.65, 0, 0.35, 1).

## Files
- `film/src/Loop.tsx`: the whole loop (every value a pure function of the frame). `film/src/index.ts`: composition "Loop".
- `deliver/kb-whatsapp-crm-loop-12s-1080p30.mp4` (16:9), `deliver/kb-whatsapp-crm-loop-12s-1080x1080.mp4` (1:1).

## Render (from `film/`)
`npx remotion render src/index.ts Loop out/loop.mp4 --concurrency=4 --muted --crf=16`, then
`ffmpeg -i out/loop.mp4 -vf crop=1080:1080:420:0 …` for the square.
