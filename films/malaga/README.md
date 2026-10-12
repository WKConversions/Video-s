# Málaga Hideaway: "Your home in Málaga, in good hands" (46 s, voice-over)

Karl's brief (12 Oct 2026): a film for Málaga Hideaway (malagahideaway.com/en) on his ElevenLabs voice-over (Christina),
copyright-free music and effects over the whole film, the 4% motion norm.

| Path | What |
|---|---|
| `deliver/malaga-hideaway-46s-1080p-share.mp4` | The same film, compressed to 24 MB for sending (CRF 21). |
| `deliver/malaga-hideaway-46s-1080p.mp4` | The film: 1920×1080, 30 fps, 46.0 s, H.264 BT.709 TV range, AAC 48 kHz, mix −15.2 LUFS. Median 4.2% of the frame in motion, 92% of frames moving; 32 of 32 phrases bring a new visual. Rendered without motion blur. |
| `storyboard/plan.md` | Brief, thesis, thread object (the home card), a visual event for every phrase. |
| `harvest/`, `brand.json`, `assets/` | The site (home, keyholding, application, property pages), its CSS, the facts; logo, fonts (Calistoga, Montserrat, SIL OFL), the client's own property photos. |
| `vo/` | The voice-over and its word timings (CTC forced alignment of the script; film time = file time + 0.50 s). |
| `sound/` | `malaga_sfx.py` (51 sounds made for this film, E minor pentatonic, each used once), `make_cues.py` → `cues.json`, `music/` (Summer Fun fitted: lift at 11.0 s on "Málaga Hideaway", last hit 42.9 s on "in good hands"). |
| `film/` | The Remotion project: `src/SceneA.tsx` (home, chores, map, logo, Málaga, checklist), `SceneB.tsx` (service list over footage, ready for every stay, keyholding), `SceneC.tsx` (agreement, phone, updates, freedom, sign-off). |

Render: `cd film && bash scripts/render_chunks.sh Film out/final_master.mp4 '{"blurSamples":1,"audio":"none"}' 0,345,690,1035,1380 public/audio/mix.wav`, then the TV-range BT.709 encode.

## Truth
Every claim comes from the site: rental management, guest reception with electronic access (Nuki or key box), cleaning with
their own laundry service, maintenance through their own service, keyholding (secure key custody, property inspections,
on site when a technician calls), commission-based and transparent prices, use your home whenever you like, reports,
photos and updates, personal contact by WhatsApp. Illustrative only: the door code, dates and guest questions; the
"You" pin sits in northern Europe without naming a city. The home in the film is Happy House (Casa Feliz), El Palo,
a home the company manages (photo from their site).

## Credits and licences
- Voice-over: ElevenLabs "Christina – Energetic Commercial American Female", supplied by Karl.
- Music: "Summer Fun" by Ahjay Stelino, Mixkit, Mixkit Stock Music Free License (`sound/music/source/summer-fun-licence.json`).
- Footage: Mixkit Stock Video Free License, each checked on its page (`data-license="videoFree"`), converted to 30 fps:
  2595, 8729, 43373, 2296, 4029, 4046, 4198, 660, 3175 (`film/public/footage/CREDITS.md`).
- Photos, logo, colours and copy: malagahideaway.com. Map: Natural Earth (public domain). Effects: generated (numpy).
