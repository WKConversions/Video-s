# GoHere — end-card revision: "A selection of our clients" (two cuts)

The client's feedback on their 36.9 s film (`source/gohere-v1.mp4`): replace "APPS BY" on the end card
with "A selection of our clients" and add more clients (12 logos sent in a zip, `assets/logos/`). Karl:
keep the audio; anything added gets sound too.

There is no project for this film, only the render, so the end card's old row is replaced in the render
itself: the box under the button and left of the phone (x 0–1210, y 752–1080) is pure white in the source
apart from that row, and from frame 1014 it is drawn by `overlay/`, which rebuilds the row in the film's
own style. The type (Nunito 800 22 px names, Nunito Sans 800 20 px label at 0.18 em), tile size (55 px),
radius, shadow and spacing were fitted to the source's last frame pixel by pixel (`scripts/calibrate.py`),
and the four apps the film already showed are cut from that frame, so they look exactly as before. The
new row enters on the original row's frames with its measured settle (32 px left, 7 px down, (1−u)^2.2).

## Deliveries
| File | What |
|---|---|
| `deliver/gohere-clients-names-40s.mp4` | **A — with names.** 40.07 s. The label on its own line, two rows of tile + name in the film's style. Page 1: the film's four (original timing) with the client's first four under them; then each slot hands over to the next client (a name never appears where another is still fading) and page 2, the other eight, holds to the end. A soft pop as each new client lands (12), rising a scale; the film's own four stay silent, as they were. |
| `deliver/gohere-clients-logos-37s.mp4` | **B — logo wall.** 36.87 s, the source's exact length. The label, then all 16 app icons in one row (same tiles, no names), cascading in one frame apart; four soft ticks on the cascade, after the voice's last word. |

Both: 1920×1080, 30 fps, H.264 High yuv420p (untagged, like the source), AAC 256 kb/s 48 kHz. Frames
0–1013 are the source re-encoded (crf 15, PSNR ≥ 48 dB against it). The voice-over is the source track,
in sync (lag 0) and unchanged in level (−22.3 LUFS integrated, peak −6.4 dBFS, as the source); it is
re-encoded, not stream-copied. A holds the source's last frame (1105) for 3.2 s while page 2 arrives;
by then the source's own movement has stopped, so nothing visibly freezes.

Client order: the film's four, then the email's order. Names: as in the stores and the email
(Alicante Like a Local, Raadsheer, Malaga Tips, Club Rondreizen, Sevilla by Mandy, Stoute schoenen,
Valencia Tips, Wereldstadgidsen, VakantieXperts, Honeyguide, Freely, BCN Hacks).

**For the client to confirm:** "BCN Discount" in the email is now called **BCN Hacks** in the stores (Play
package `app.gohere.bcndiscount`) and the logo file is named that, so the film says BCN Hacks. The zip also
held **GoHere Tanzania**, which is not in the email's list, so it is left out. In B, Sevilla by Mandy's own
icon (beige on cream) reads faintly at tile size; a higher-contrast version would help.

## QC
- Independent review panel (compositing, spec, motion, sound, art direction) with every medium+ finding
  re-checked by a second reviewer. Fixed from it: names trembling on a 6-frame cycle and rendering soft
  (a `will-change` layer split across render tabs: now no layer, contiguous blocks per tab, positions on a
  1/4 px grid, drawn at 4× and scaled down); A's first version ran 9 s past the last word on four pages of
  four and rested on four names (now two pages of eight, +3.2 s); B held a frozen frame (now the source's
  length); B's ticks were bright and loud and started under the last word (now four soft, lower ticks, 3 dB
  further down, after the word); sounds landed 2 frames before their item was solid (now at 95% opacity).
- Automatic checks on both encodes: no shake, look or pop from frame 1014 on (the source's own
  earlier flags are unchanged and outside the edit); A's final hold changes 0 pixels from frame to frame;
  the box's edges match the source to ≤ 3 levels.
- Not checked by ear: the effects were placed and levelled from the waveform; Karl's ear has the final say.

## Rebuild
```
cd films/gohere
(cd overlay && npm i)                       # Playwright 1.56.1 (uses the pre-installed Chromium)
python3 scripts/make_tiles.py               # tiles: the film's four cut from its last frame, the client's twelve squared
bash scripts/build.sh A deliver/gohere-clients-names-40s.mp4
bash scripts/build.sh B deliver/gohere-clients-logos-37s.mp4
python3 scripts/stills.py A 1060,1140,1201 sheet.png    # test stills
```
- `overlay/index.html`: the row, both layouts, all timing (frame numbers of the film) and the sound cues.
- `overlay/render.mjs`: renders the overlay box per frame (`SS=4` for the build), or the calibration row.
- `scripts/sound.py`: the source track plus the synthesized pops/ticks on their cue frames.
- `scripts/build.sh`: overlay frames + mix → the delivery encode.

## Credits
Client logos and app names: GoHere (supplied by the client). Fonts: Nunito and Nunito Sans (SIL OFL).
Sound effects synthesized for this film.
