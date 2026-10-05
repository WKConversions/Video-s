# bFound × WKConversions — collaboration intro (42.98 s, 1080×1920)

A portrait film over the audio of `bfound_x_WKC.mp4` (Karl's side of a call with Emma Bauditz, bFound):
the collaboration and the code **BFOUND50** on wkconversions.com/contact. No footage from the source video is used; only its audio.

- `deliver/bfound-x-wkc-42s.mp4` — the film: 1080×1920, 60 fps, 42.983 s, H.264 yuv420p BT.709, AAC 48 kHz (original audio).
- `film/` — the Remotion project (composition `Film`). `npm i`, then `bash scripts/render_chunks.sh Film out/final.mp4 '{"audio":false}' 0,645,1290,1935,2579 public/audio/vo.wav`.
- `film/src/Story.tsx` — the stage: bFound's world (top panel: Instrument Serif, pastel washes, soft blur-in moves on bFound's ease) and WKC's world (bottom panel: Inter Tight 800, dot grid, #3F8CE8, crisp moves on cubic-bezier(.22,1,.36,1)). The seam between them moves with who is talking.
- `film/src/lib.tsx` — tokens, curves and the word times (`W`), from `vo/transcript*.json` (faster-whisper small + medium.en).
- `harvest/` — both sites: screenshots, CSS, logos, `brand.md` notes.

Facts used on screen: Emma Bauditz, founder of bFound (her site); Karl made bFound's video (WKC testimonial); the contact form's referral code field and "Price: €400" (wkconversions.com/contact); €1,000 normal price and −50 % with BFOUND50 (the audio). €200 is the 50 % of €400 said in the audio.
