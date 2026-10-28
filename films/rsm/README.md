# Royal School of Music: website hero explainer (35.6 s, English, 1920×1080, 60 fps)

For royalschoolofmusic.es, on Karl's script and the ElevenLabs voice-over ("Christina", 33.6 s, placed at 0.4 s).
Apple style: a calm, still background (#F6F7F7), all motion in the foreground, the client's own brand (logo teal
#01ABA8, Montserrat, the logo's Goudy serif as Sorts Mill Goudy, the note colours of the site's artwork).

Karl's four site pictures, rebuilt as motion (sharp at 1080p, no watermark):
- **The word guitar** (S1): `plan/make_assets.py` packs music words into a guitar silhouette; they fly in and lock
  from frame 0, and strum on "exciting".
- **The note burst** (S1, S3, S7): the site's colourful notes as SVG, bursting out of the guitar and the logo.
- **The partner logos** (S4 schools, S7 Trinity): cropped from the site's own logo strips.
- **The low-poly instruments** (S4 events): re-triangulated from the screenshot (Delaunay, colours sampled), assembling.

Scenes on the words: S1 guitar (0–3 s); S2 the problem in one card: a teacher search, weeks that are full, five
instruments and a hesitating cursor, then grey on "often less so"; S3 the card collapses into the logo tile, "Royal
School of Music"; S4 the tile opens into the services card (home, schools, events); S5 Learn piano / guitar /
violin / singing / drums; S6 qualified teachers, confidence and skills as an equaliser; S7 the certificate (Trinity
College London, ABRSM; both on the site); S8 the melody runs along a staff; S9 end card, "Get in touch".

- **Sound:** `sound/make_cues.py` → `sound_mix.py`; effects from `films/alumni/sound/lib`; bed Mixkit "Driving
  Ambition" (no credit needed), fitted with `music_fit.py` (lift on "Meet").
- **Motion:** median 1.8%, moving in 94% of frames (no target given; approved by Karl). Shake check: two small flags
  (9.9–10.5 s wordmark landing, 27.2–27.9 s the teachers → certificate hand-off, up to 3.8 px).
- **Deliverables:** `deliver/royal-school-of-music-35s-1080p60.mp4` (final, H.264 BT.709, AAC), `deliver/rsm-preview-540p60.mp4`.
