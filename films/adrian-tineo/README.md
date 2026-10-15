# Adrian Tineo: "AI expertise. Business impact." (39 s, voice-over)

Karl's brief (15 Oct 2026): a film for Adrian Tineo's site (test.adrian-tineo-462.workers.dev) on his ElevenLabs
voice-over (Christina), "completely in the style of the website": the site's look and motion, new visuals where the
lines need them.

| Path | What |
|---|---|
| `deliver/adrian-tineo-39s-1080p.mp4` | The film: 1920×1080, 30 fps, 39.0 s, H.264 BT.709 TV range, AAC 48 kHz, mix −15.2 LUFS. |
| `deliver/adrian-tineo-39s-1080p-share.mp4` | The same film, compressed for sending. |
| `storyboard/plan.md` | Thesis, thread object, the phrase table (a visual event on every phrase), sound plan. `concept-A/B/C.md` are the three drafts it was taken from. |
| `harvest/` | The site (HTML, CSS, text), screenshots at three widths, `facts.md` (every on-screen claim comes from it). |
| `assets/` | The site's own files: Manrope (SIL OFL), the chrome sculpture SVGs, the portrait. |
| `vo/` | The voice-over, its script and word timings (CTC forced alignment, cross-checked with Whisper; film time = file time + 0.50 s). |
| `sound/` | `adrian_sfx.py` (45 sounds made for this film, A-flat major pentatonic, each used once), `make_cues.py` → `cues.json`, `music/` (Digital Clouds fitted: lift at 6.90 s on "Meet", last hit 37.29 s). |
| `film/` | The Remotion project: `src/lib.tsx` (the site's measured tokens and its one curve), `src/kit.tsx` (the site's components at film scale), `src/hero.tsx` (the site's hero sculpture in parts), `src/scenes.tsx` (the film). |

Render: `cd film && bash scripts/render_chunks.sh Film out/draft.mp4 '{"blurSamples":1,"audio":"none"}' 0,300,590,880,1170`,
mux `public/audio/mix.wav`, then the TV-range BT.709 encode.

## The style, replicated
Warm paper (#F4F4F2) inside the site's rounded shell over its dark ambient field; ink #151514 and the muted grey second
line of every headline; one quiet sage accent (the status dot); Manrope only, weight 650 with the site's tight tracking;
tiny tracked eyebrows; white cards with 6-px padding around a pale well; floating tags; the dark button with the arrow;
the dark contact panel; the chrome-and-glass sculptures; the B&W portrait. Motion: the site's one curve
cubic-bezier(.22,1,.36,1), its reveal (fade and rise, staggered), its slow floats, its hover lift for the service cards.

## Truth
Every word on screen is from the site or the script: the four service titles and their lines, "A clear direction",
"A real-world advantage", "Business-minded, hands-on", "PhD in Computer Science", "Independent expertise. Shared ambition.".
The tags in the opening (Chatbots, AI agents, LLMs…) are generic terms, not claims. No client logos, numbers or URL.

## Credits and licences
- Voice-over: ElevenLabs "Christina – Energetic Commercial American Female", supplied by Karl.
- Music: "Digital Clouds" by Alejandro Magaña (A. M.), Mixkit, Mixkit Stock Music Free License (`sound/music/source/digital-clouds-licence.json`).
- Type, sculptures, portrait and copy: Adrian Tineo's site. Effects: generated (numpy).
