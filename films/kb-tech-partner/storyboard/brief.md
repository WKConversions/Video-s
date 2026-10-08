# Brief: K.B, "Your tech partner" (2026-10-08)

| Field | |
|---|---|
| PROJECT | A brand film for K.B (kruslockbosconsultancy.com), requested by Karl (WKConversions) |
| CLIENT-BRAND | **K.B** only. Never "Consultancy" or "Kruslock Bos Consultancy" on screen or in the sound (Karl). The site's own lockup is "K.B Tech Partner". |
| DELIVERABLE | MP4 + the Remotion project (editable in Remotion Studio) + storyboard page |
| PLATFORM | Website section and LinkedIn (assumed: Karl gave no platform) |
| ASPECT RATIO / RESOLUTION / FRAME RATE | 16:9, 1920×1080, 30 fps (assumed: a website brand film) |
| TARGET DURATION | set by the voice-over: 31.95 s of voice, placed at 0.40 s; the film ends about 1.7 s after the last word (≈34 s) |
| AUDIENCE | Founders and managers of growing businesses (startups and SMEs) who know technology could help but don't know which solution or where to start ([H] For Startups / For Established SMEs) |
| PRIMARY OBJECTIVE | Position K.B as the embedded tech partner who stays from strategy to implementation, not an advisor who hands over a report and leaves |
| DESIRED VIEWER ACTION | Book a call with K.B (site CTA: "Book a Free Discovery Call") |
| SCRIPT | as written by Karl (below), unchanged |
| VOICE-OVER | Recorded: ElevenLabs, voice "Christina – Energetic Commercial Female" (vo/elevenlabs-christina.mp3, 31.95 s, mono 44.1 kHz), one take, every word present; force-aligned to the script (vo/align.txt, film/src/words.json) |
| BRAND ASSETS | the site: logo (K.B in Copperplate on navy), Montserrat, navy/cyan/light grey, tools strip, team photos, client-case cards (harvest/) |
| REFERENCES | none supplied for this film; Karl's standing direction and the skill's reference set; **the site's hero video is ruled out** (not a reference, not material) |
| MUST INCLUDE | 5% of the frame in motion (Karl: "5% motion instead of 1, 2, 3 or 4%": the median share of the frame changing per frame, `motion_check.py`); no static frames under the voice; a new visual on every phrase |
| MUST AVOID | captions everywhere (Karl: "don't place the caption everywhere, sometimes only visualize the script"); "Consultancy"; the hero video; camera spikes, overshoot pops, flying outros (K.B v2 lessons); busy frames (K.B v3 lesson) |
| TONE | Energetic, confident, warm (the voice is ElevenLabs' "Energetic Commercial"); clean, never spiky |
| TECHNICAL CONSTRAINTS | Remotion in the cloud sandbox (headless Chromium), no After Effects; no speakers, so the mix is read by measurement |
| OTHER NOTES | Music: none supplied, so one is found or composed to the film (open question for Karl). URL: the domain contains "consultancy", so the end card shows no URL (open question). |

## Script (Karl, as written)
1. Technology should help your business grow. Not hold it back.
2. But finding the right solutions, and knowing where to start, isn't always easy.
3. That's where K.B. comes in.
4. We don't just offer advice. We become your tech partner.
5. First, we understand your business. Then, we identify opportunities, develop solutions, and help bring them to life.
6. From strategy to implementation, we're by your side.
7. Because real growth doesn't come from technology alone.
8. It comes from having the right partner behind it.

## What "5% motion" means here, and how it is reached
`motion_check.py` measures, at 160×90, the share of the frame whose brightness changes by more than 6 levels from one
frame to the next; the film's median frame must reach **5.0%** (K.B v3, approved: 1.7%; Karl's 25 references: median
3.5%, range 0.5–6.6%). Karl's K.B lessons still hold: the 3% target of October was first reached with camera moves and
those read as spikes, so **the camera only breathes** and the motion comes from the content: big subjects that keep
travelling, colour fields that grow out of objects, real photographs that keep moving inside their frames, and a second
layer working inside every scene, without crowding the frame (the probe's BUSY and `busy_check.py` stay clean).

## Assumptions (stated for Karl)
- 16:9 1080p30 for a website section and LinkedIn.
- The voice-over starts at 0.40 s so the first picture lands before the first word.
- No storyboard approval stop: Karl asked for the video with the voice-over in hand, so the film is built through to
  delivery; the storyboard page comes with it for review.
