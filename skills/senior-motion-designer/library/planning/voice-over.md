# Voice-over

How a recorded voice-over gets into the film. The picture is built to the estimated timing first
(about 2.5 words per second, `planning/intake.md`); when the recording arrives, every key hit moves
onto its spoken word. Budget one draft render to hear the sync before the final.

## 1. Identify every file

Recordings arrive as several files, often named only by date and voice, sometimes with alternate or
partial takes and a missing line. Before timing anything:
- list each file's length and pauses (`ffprobe`, and `silencedetect`: `motion/timing.md`),
- transcribe each file (`scripts/vo_align.py transcribe`, or `scripts/vo_whisper.py` with word timings when
  pocketsphinx struggles, as it can on synthetic voices) and match it to a script line,
- report what doesn't match: a missing line, an extra take, a changed wording. Use the full take of a
  line over a partial one and say which files you left out. Never invent the missing line; ask for it
  and keep its slot at the estimated timing.

## 2. Word timings

Force-align the known script to each file (`scripts/vo_align.py align`). Spell brand names the way
they are spoken ("WKConversions" as "double you kay conversions"), or the aligner rejects them. Keep
the word list per line with its start and end times.

## 3. Place the lines

Put each line where its key word lands on its visual hit: the click on "click", the scroll on
"scroll", the number on the number. Place the line's start so that word falls on the planned frame,
and keep at least 0.3 s between lines. If a line runs longer than its scene, move the scene's events,
not the audio (`motion/timing.md`), and check the next scene still starts from the same state.

## 4. Retime the picture

For each scene, list the words that carry a hit and move those keyframes onto them:
- headlines build word by word on the spoken words,
- a statement's supporting labels stay on screen until the statement completes,
- exits start after the line's last key word, not during it.

Then render a quick draft with the audio, check the audio track's placement with `silencedetect`, and
listen for the words against the hits before the final render.

## 5. Deliver

Audio stays outside the motion-blur wrapper (`production/build-gotchas.md`). Normalize to −15 LUFS
at encode with a 48 kHz track exactly as long as the film (`production/coded-render.md`). Record the
source (for example "ElevenLabs, voice Christina"), the files used and the word timings in the
production plan.
