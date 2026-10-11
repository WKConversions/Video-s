# K.B — "Asked, answered, running" (40 s, SaaS film, voice-over)

Karl's brief (11 Oct 2026): a very SaaS-like film in the style of his six new references (ref28–33) for K.B
(kruslockbosconsultancy.com), on his ElevenLabs voice-over; only "K.B" (never "Consultancy"), no team members, nothing from
the site's hero video, the 4% motion norm.

| Path | What |
|---|---|
| `deliver/kb-saas-40s-1080p.mp4` | The film: 1920×1080, 30 fps, 40.0 s, H.264 BT.709 TV range, AAC 48 kHz, mix −15.2 LUFS. Median 4.05% of the frame in motion, 95% of frames moving; 29 of 29 phrases bring a new visual, 0.0 s of voice over a held frame. Rendered without motion blur (Karl asked for the film straight away). |
| `storyboard/plan.md` | The plan: thesis, motion identity, a visual event for every phrase. `storyboard/concepts/` holds concepts A and B; `context.md` the brief, phrases and facts the planning used. |
| `harvest/` | K.B's facts (re-checked live on 11 Oct), the page dumps. `brand.json`, `assets/`: brand tokens, the K.B tile rebuilt as vectors, fonts. |
| `vo/` | The voice-over and its word timings (CTC forced alignment of the script, film time = file time + 0.50 s). |
| `sound/` | `make_cues.py` → `cues.json` (81 effects keyed to the words), the generated effects library, `music/` (Cat Walk fitted: the drop on "Meet K.B.", the last hit on the closing "K.B."). |
| `film/` | The Remotion project: `src/SectionA.tsx` (hook, question, K.B), `SectionB.tsx` (workspace, connect, automate, agent, dashboard, the question rewriting itself), `SectionC.tsx` (Diagnose/Build/Run, complexity, claim, manual work, sign-off), `Fields.tsx` (colour fields grown out of objects), `clock.ts` (labels on the voice's words). |

Render: `cd film && bash scripts/render_chunks.sh Film out/final_master.mp4 '{"blurSamples":1,"audio":"none"}' 0,300,600,900,1200 public/audio/mix.wav`
(`"blurSamples":8` for the motion-blurred version, about 30 min), then the TV-range BT.709 encode.

## Credits and licences
- Voice-over: ElevenLabs "Christina – Energetic Commercial American Female", supplied by Karl.
- Music: "Cat Walk" by Arulo, Mixkit, Mixkit Stock Music Free License (`sound/music/source/cat-walk-licence.json`).
- Footage (Mixkit Stock Video Free License, checked on each clip's page: `data-license="videoFree"`; converted to 30 fps):
  42628 "Business woman on call while working", 42641 "Young people working together in the office", 43259 "Woman working on
  laptop she drinks coffee". They stand for the viewer's own business and team, never for K.B's team or clients.
  (The first picks, Mixkit 9055, 21225 and 33426, are under Mixkit's Restricted licence and were not used.)
- Effects: generated (numpy), royalty-free. K.B logo, colours, Montserrat and Copperplate CC (SIL OFL), copy: kruslockbosconsultancy.com.
- The n8n logo appears once, as one of the tools K.B builds with (site: "Use of tools like Make and n8n").
