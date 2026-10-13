# Alumni — "Your next chapter starts abroad" (website hero film, 39 s, English)

A hero film for the Alumni site (small-salad-e287.raphael-0d6.workers.dev), made from the client's script and
the supplied ElevenLabs voice-over ("Christina – Energetic Commercial American Female", 36.75 s). It meets the
**5% motion norm** and has a **SaaS look**: the library's minimal-gradient-SaaS style, with its palette built
from Alumni's own brand.

## Delivery
| File | What |
|---|---|
| `deliver/alumni-hero-39s.mp4` | The film. 1920×1080, 30 fps, 39.0 s, H.264 High, yuv420p, BT.709 TV range; AAC 256 kb/s 48 kHz stereo at −15 LUFS |
| `deliver/alumni-hero-39s-muted.mp4` | The same picture without sound, for an autoplaying hero (browsers only autoplay muted video) |
| `deliver/alumni-poster.png` | The end card as the poster image |
| `storyboard/storyboard.jpg` | One frame per phrase of the voice-over, from the render |
| `storyboard/plan.md` | The brief, the thesis, the motion identity and the phrase-by-phrase table |

## The idea
*From experience to opportunity: the logo is the journey.*
- Alumni's mark is an orange A (a climb) and a green L (a turn forward). The site draws its icons as one line
  that runs from orange into green.
- The film's thread is that line:
  - It leaves the finished internship ("just the beginning").
  - It becomes the AL on "Meet Alumni".
  - It runs as the cables that connect a graduate to opportunities, employers and agencies.
  - It draws the site's own Guidance, Connection and Opportunity shapes for the three audiences.
  - It flies to a new country.
  - It ends between "experience", in the A's orange, and "opportunity", in the L's green.
- The end card is the site's own hero line, eyebrow and calls to action, so the film hands over to the page.

## Motion (the 5% norm)
Measured on the final render with `scripts/motion_check.py`: MOTION_LINE.
- **Where the motion comes from:** the content, not the camera.
  - Windows and headlines drift at 35–55 px/s in parallax.
  - The site's two city photos push and pan inside windows (the style allows photos only inside windows).
  - Cables draw, with orbs travelling along them, and type builds word by word.
- **Camera:** it only breathes, with one slow push into the end card.
- **Phrases:** PHRASE_LINE
- **Motion probe:** PROBE_LINE
- **Shake check:** SHAKE_LINE

## Sound
- **Voice-over:** the supplied file, in sync (lag 0), with a gentle 2.5:1 compressor on its peaks.
- **Music:** "Take this Higher" by Michael Ramir C. (Mixkit, EDM, 124 BPM), from
  assets.mixkit.co/music/1012.
  - Licence: Mixkit Stock Music Free License, free for commercial use with no credit required. It is
    royalty-free, not public domain.
  - It was picked from 65 analysed Mixkit tracks (`sound/music/candidates.*`, shortlist in
    `sound/music/shortlist/`).
  - It is cut on its bar grid (`scripts/music_fit.py`): the kick and bass enter exactly on "Meet Alumni"
    (4.35 s), and the song's real final hit lands on the end card (37.7 s).
  - It plays at −23 LUFS (about 12 dB under the voice) and ducks under speech.
- **Effects:** 69 cues, each on its picture event (`scripts/cues.py`), using clean UI sounds:
  - taps and keys for the typing, soft pops where things land, airy swishes on the bigger moves;
  - one shimmer for the brand.
  - Sources, all copyright-free: Kenney "Interface Sounds" (CC0) and the studio's own generated sounds.
- **Mix:** MIX_LINE

## Truth: what is on screen, and where it comes from
- **From the site (`harvest/facts.md`):**
  - "Your next chapter starts abroad.", "From graduation to working abroad".
  - "For graduates & former interns · Your career abroad", "For employers · Your next colleague",
    "For recruitment agencies · Your next talent connection" (with the site's colour dots).
  - "01 · Introduce · Start with your experience.", "Look beyond borders.".
  - The calls to action "Explore my next step" and "Find talent".
  - The four value shapes, the AL logo, Lato, and the two city photos (the site names neither city).
- **Example content, shown as UI and not as claims:**
  - The search suggestions ("Working abroad", "A new career", "A new colleague", from the site's
    "A new career. A new colleague." line).
  - The ambition chips ("Work abroad", "Grow in my field", "A new team").
  - The "Abroad", "Completed" and "Emerging talent" labels.
  - Initials avatars (no invented faces), and the "Welcome to the team!" message.
  - Skeleton lines wherever a real vacancy or company would otherwise have to be invented.
- **No numbers, employer names, partner logos or promises of a job.** The site says roles are discussed
  individually.
- **The voice says "businesses" and "recruitment partners"**; the labels use the site's terms, employers
  and recruitment agencies.

## Build
Remotion 4 (`film/`): `src/Story.tsx` is one continuous stage on the words of the force-aligned voice-over
(`vo/words_full.json`, `src/clock.ts`). `src/saas.tsx` holds the style kit: mesh, grain, glass, windows,
cables with orbs, and gradient type.
```
cd films/alumni
python3 scripts/cues.py && python3 scripts/sound_mix.py sound/cues.json film/public/audio/mix.wav --sheet sound/mix.png
cd film && bash ../scripts/render_chunks.sh Film out/final.mp4 '{"blurSamples":4,"audio":"none"}' 0,290,580,870,1170 public/audio/mix.wav
```

## Assumptions
- 16:9, 39.0 s: the voice-over plus 2.5 s on the end card, so the music's last hit rings out.
- The script is used exactly as written.
- In a hero section the film will usually play muted, so every line also reads on screen.
