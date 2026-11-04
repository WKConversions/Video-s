# Royal School of Music: Spanish version (41.6 s, 1920×1080, 60 fps)

The English film (`films/rsm`) rebuilt on Karl's Spanish script and the ElevenLabs voice-over ("Christina", Spanish,
39.6 s, placed at 0.4 s). Same scenes and visuals; every beat retimed to the Spanish words and every on-screen text in
Spanish.

- **Timing:** `vo/words.json` (faster-whisper, checked against the pauses with ffmpeg silencedetect). `film/src/kit.tsx`
  keeps the English film's beat keys, each mapped to the Spanish word that carries the beat (personalized → "clases",
  international → "certificaciones", get → "Ponte"); the scene windows in `film/src/Story.tsx` moved with them.
- **Text:** "Encontrar al profesor adecuado", Lun–Vie and "Clase", Piano / Guitarra / Violín / Canto / Batería,
  "Te acercamos la música", "Clases personalizadas a domicilio", "Educación musical para colegios", "Actuaciones en
  directo para tus eventos", "Aprende" + the instrument, "Profesores cualificados", "Confianza", "Técnica", "PREPÁRATE PARA",
  "Certificaciones internacionales", "Tu camino en la música empieza aquí.", "Ponte en contacto"; the word guitar
  rebuilt from Spanish words (`plan/make_guitar_es.py`).
- **Sound:** `sound/make_cues.py` (the English cue sheet retimed), the same Mixkit bed ("Driving Ambition") refitted to
  41.6 s with the lift on "Descubre".
- **Checks (final):** moving in 96% of frames, median 1.7% (the English film: 1.8%); two borderline shake flags (the 3-jump
  threshold, ≤ 2.5 px) at 10.3 s and 17.3 s.
- **Deliverable:** `deliver/royal-school-of-music-es-41s-1080p60.mp4`.
