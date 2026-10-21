# Future Unicorn Founders: "Build what's next, together." (42.5 s, voice-over)

A brand film for Future Unicorn Founders (FUF), a networking community in Málaga, on the ElevenLabs voice-over Karl
supplied. It follows the brand: charcoal, taupe and cream, the site's Bodoni serif with italic accents, and the site's
spaced small caps. The tone is high-end and calm, with no gimmicks.

| Line | On screen |
|---|---|
| Great opportunities start with the right connections. | Charcoal. Points spread across the frame and taupe lines draw the connections between them. |
| But finding ambitious people who share your vision isn't always easy. | The lines fade and the points drift apart. One point searches the frame with a dashed reach and finds no one. |
| Meet Future Unicorn Founders. | Cream opens out from the centre. The unicorn mark draws in and the wordmark builds beside it. |
| An international networking community … in Málaga. | The site's Málaga hero photo pushes in slowly. Founders, entrepreneurs, builders & *investors* build on their words, then "Together in *Málaga*" and the coordinates. |
| Through exclusive gatherings … opportunities grow. | Cream gallery: three photos rise in, and each caption lands on its words (New ideas *emerge*, Partnerships *form*, Opportunities *grow*). |
| No awkward networking. No endless business card exchanges. | Charcoal. A fan of business cards. Each line is struck through in taupe, then the cards fly off. |
| Just ambitious minds, real conversations, and connections that matter. | A tall photo of people talking, and three lines that build. |
| Because the next big opportunity might start with one conversation. | Charcoal. Two points find each other and connect on "one conversation". |
| Future Unicorn Founders. Build what's next, together. | End card: the mark, the name, the line, a "Join the community" button, MÁLAGA · INTERNATIONAL. |

| Path | What |
|---|---|
| `deliver/fuf-42s.mp4` | The film: 1920×1080, 30 fps, 42.5 s, H.264 BT.709, 8-sample motion blur, AAC 48 kHz, −15 LUFS. |
| `vo/` | The ElevenLabs file and its word timings (`whisper_words.json`). |
| `sound/` | Cue sheet (`make_cues.py` → `cues.json`), the music bed (`bed.wav`, its lift on "Meet Future Unicorn Founders"), generated effects (`lib/`). |
| `film/` | The Remotion project: `src/clock.ts` (labels on the voice's words), `src/Story.tsx` (the nine scenes), `public/img/` (the site's images and logos; the gallery photos are cropped from the brand collage Karl supplied). |

Render: `cd film && bash scripts/render_chunks.sh Film out/final_raw.mp4 '{"blurSamples":8,"audio":"none"}' 0,319,638,957,1275`,
then mux `public/audio/mix.wav` in the delivery encode. The first delivery used 2-sample blur and a stand-in serif to meet
a 25-minute deadline; this version has the full blur and the closest free match to the site's type.

## Credits
- FUF's logo, unicorn mark, photos and Málaga images: the client (test.fuf-16d.workers.dev and the supplied brand board).
- Music: Mixkit "Deep Urban" (Eugenio Mininni), Mixkit Stock Music Free License, no credit required.
- Fonts: the site sets Bodoni 72 / Didot and Avenir Next (Apple system fonts, not embeddable); the film uses their
  closest free equivalents, Bodoni Moda and Nunito Sans (SIL OFL). Effects: generated (`scripts/sfx_synth.py`).
  Voice: ElevenLabs "Christina", supplied by Karl.
