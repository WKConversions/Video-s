# Mexico social (conecta advisors): client video, three changes only (17 Nov)

The client made the video himself; nothing else may change. Source: `source/social.mp4` (1400×720, 30 fps, 430
frames, no audio) and `source/mexico_pre_merge_V2.psd`. Not in git (the client's files and Adobe Stock assets in the
PSD): `source/`, `deliver/`, the frame folders in `work/`.

1. **Map scene (frames 186–242):** the PSD's two visuals (green circle with the statue and agaves, green circle with
   the logo) are placed exactly where the PSD has them (`work/psd_align.py`: the PSD map fits the video by a uniform
   0.757 scale), follow the map's motion per frame (`work/track.py`), and slide up out of their base line like the
   buildings: the statue with the tall tower (from frame 188), the logo with the second tower (from 200), 14 frames,
   ease-out (`work/visuals_overlay.py`).
2. **The green curve (frames 199–240):** same path and draw-on timing, redrawn with a round ball and a uniform stroke
   (the original ball was a flattened oval); the ball appears when the line completes (frame 215), as in the original
   (`work/line_fix.py`).
3. **Logo reveal (frames 346–369):** the logo's own animation is untouched; the text now slides out from behind the
   logo's right edge as the logo travels left, instead of popping open on its own; from frame 370 the frames are the
   original ones (`work/logo_reveal.py`).

`work/composite.py` builds the delivery: every other frame is the original, encoded at x264 crf 4.
Delivered: `deliver/social-aangepast.mp4`.
