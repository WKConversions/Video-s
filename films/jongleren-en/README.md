# JongLeren.es — English version ("Your internship, fully supported", 40 s)

The Dutch film (`../jongleren`), adapted, not rebuilt: the same design, motion, photos, music and effects. Two
things changed, both on the client's English script and the supplied ElevenLabs voice-over ("Christina –
Energetic Commercial American Female", 38.7 s).

## Delivery
| File | What |
|---|---|
| `deliver/jongleren-en-40s.mp4` | 1920×1080, 30 fps, 40.0 s; H.264 High, yuv420p, BT.709 TV range; AAC 256 kb/s 48 kHz, −15 LUFS |
| `deliver/jongleren-en-poster.png` | The end card, as a poster image |

## The changes
- **Synced to the English voice-over.**
  - The film is timed to word labels (`film/src/clock.ts`), so nothing in the animation was rewritten.
  - The English voice-over was transcribed with faster-whisper and corrected to its pauses (`vo/words_en.json`).
  - Each Dutch label the film uses is mapped to the English word with the same meaning (`vo/label_map.json`; for
    example the suitcase fills on "even pack your bags", and the to-dos are juggled on "everything becomes
    easier"). The result is written back under the Dutch label names (`film/src/words.json`), so every visual event
    and every sound cue lands on its English word.
  - The film is 40.0 s: the voice plus a 1.6 s hold on the logo.
- **All on-screen text in English**, from the English script:
  - "Your internship in Spain starts now."
  - "Everything becomes easier."
  - "Intake meeting", "School requirements", "My internship", "Introductory meeting", "Accepted!"
  - "Accommodation near your internship.", "Once you're in Spain?", "We're still here for you."
  - "Personal guidance", "From your first question to your final day."
  - "Your internship, fully supported."
  - The route steps: Intake, App, Search, Interview, Spain.
- **Music:** the same track ("Spanish Heart", Mixkit, free licence, no credit needed), re-cut on its bar grid
  (`scripts/music_fit.py`, with the join fix found in the Alumni review). The band enters on "With JongLeren"
  (4.03 s) and the song's final hit lands as the tagline ends (38.26 s).
- **Effects:** the same 90 cues, now on the English words; three were lowered where they crowded the voice.

Everything else (truth notes, credits, the design) is as in `../jongleren/README.md`.
