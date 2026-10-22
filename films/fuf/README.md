# Future Unicorn Founders: 42.5 s film (16:9, 60 fps)

A new film for Future Unicorn Founders (a networking community in Málaga) on Karl's script and the ElevenLabs
voice-over "Christina" (41.1 s). It deliberately breaks with the client's current video (`harvest/old/`, contact
sheets there): no constellations, star fields, world-map arcs, photo-card rows or business-card fans. The film is
built from tactile objects and kinetic type: marquee type and a one-line drawing of two hands, a slot machine
(mismatched reels, then three unicorns), a split-flap arrivals board flipping to the four roles and MÁLAGA, the
Málaga photo, a wax-sealed invitation, face/vase profiles in one line, a napkin sketch, two coffee cups, a pop-up
paper Málaga, a "HELLO my name is" sticker, a Rolodex that jams, a seating plan, a door into the sunset, a speech
bubble, the unicorn drawn as one line, building blocks and an editorial end card. FUF's look: cream #F7F4EF, ink
#272624, bronze #8F765E italic accents, Bodoni Moda (for the site's Didot/Bodoni) and Nunito Sans (for Avenir).

## Delivered
- `deliver/fuf-42s-60fps.mp4`: 1920×1080, 60 fps, H.264 BT.709, -15.2 LUFS, peak -1.3 dBFS.
  - Motion median 8.2%, moving in 100% of frames, longest still 0.07 s.
- `deliver/fuf-preview-wip-540p.mp4`: the first work-in-progress preview.
- Storyboards: `plan/storyboard.md` (the contract), `plan/storyboard_wip.jpg`.

## Sources
- **Voice-over:** `vo/vo.mp3`, aligned to the script (`vo/words.json`, word starts; `film/src/words.json`).
- **Music:** "I Believe in Us" (Mixkit Stock Music Free License, no credit needed), fitted with `scripts/music_fit.py
  --length 42.5 --lift 7.58 --end real`. The music lifts on "Meet", and its last hit lands on "Future Unicorn
  Founders".
- **Effects:** the alumni library. The cues per segment are in `sound/cues_A-E.json`; `python3 sound/build_mix.py`
  mixes them with the voice and the bed.
- **Photos and the unicorn mark:** the client's own, from the site (`harvest/assets/`); transparent marks were made
  from the mark PNG. **Fonts:** Bodoni Moda and Nunito Sans (OFL).

## Build
Five segments (`film/src/scenes/A-E.tsx`) were built in parallel and each reviewed independently. The kit
`film/src/kit.tsx` holds the brand, the word clock `w()`, springs, `Photo`, `SerifLine`, `DrawLine`, `unicornPath`
and the hand-offs H1-H4. To render the five chunks, use `film/out/chunks/run.sh` and then `finalize.sh`.
