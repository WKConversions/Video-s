# Timing and rhythm

## Timing is meaning

Duration communicates weight, importance, confidence and energy. A 6-frame move and a 24-frame move on
the same path have different characters. Vary timing by importance, distance, mass, rhythm and
emotion; don't make every animation 0.3–0.6 seconds.

Starting ranges at 30 fps (adapt to distance, scale, audio, readability and tone):
- micro response: ~3–8 frames,
- small UI transition: ~6–14 frames,
- arrival from outside the frame (with motion blur): ~6–12 frames,
- in-frame entrance or reveal: ~10–20 frames,
- exit: ~3–6 frames,
- major scene transformation: ~16–36 frames,
- deliberate cinematic reveal: often 24+ frames.

## The brief's tone leads

The prompt sets the intensity; the defaults never override it. Read the brief's tone words (and the
client's own notes) before choosing durations, camera, density and sound, and pick the row:

| Tone in the brief | Durations | Camera | Motion: probe style · longest still | Sound |
|---|---|---|---|---|
| calm, warm, human, premium | the upper end of every range above; soft ease-outs, no overshoot | one slow breath for the film | `calm` · 1.2 s | sparse and soft (`motion/sound.md`) |
| not stated, or confident and clear, professional | the middle; ease-outs, no overshoot | one slow breath for the film (K.B, approved) | `calm` · 0.8 s | the film's vibe |
| energetic, bold, youthful, fast | the lower end; snappy curves, overshoot on small things | moves that ease in and out, never linear starts | `energetic` · 0.5 s | dense, crisp |

Calm doesn't mean static: the camera still never locks, and the film still moves in 95% of its frames;
it moves less and slower. Energetic doesn't mean everything moves at once: the hierarchy and the holds
stay. When a brief mixes tones (a calm voice with a bright, visual product), the voice and the client's
words set the pace, and the visuals carry the variety. Measured: the GoHere hero film, briefed "warm,
human, calm", lands at 98%, 3.2% and 0.3 s; the energy comes from its visual changes, not its speed.

## Distance and weight scale the duration

Take the base duration from the film's palette (`motion/motion-identity.md`), then scale it by how far
the element travels at 1080p:

| Travel | about 100 px | 200 px | 400 px | 800 px | across the frame |
|---|---|---|---|---|---|
| Multiplier | 1.0× | 1.3× | 1.6× | 1.8× | 2.0× |

Heavy elements (a full-frame card, a browser window) take the upper end; light ones (a pill, a
cursor, an icon) the lower. Exits run at 65–75% of the matching entrance.

## Stagger budget

Within a group, stagger 2–4 frames per element and keep the whole group's stagger under about 15
frames; a longer cascade reads as waiting. Stagger along the reading order or away from the cause;
every element in a group uses the same curve, and only the start time changes.

## The shape of one move

A move that matters has four parts; skip the first and third on small moves.

| Part | Share | What happens |
|---|---|---|
| Anticipation | 10–20% | a small counter-move or a hold before the release |
| Action | 30–50% | the primary move |
| Reaction | 10–20% | secondary elements respond, 2–4 frames behind |
| Resolution | 20–30% | the settle, then a working hold |

## Settle and holds

After important information arrives, give the viewer time to understand it; don't start the next
transition the instant a title lands. Use pauses deliberately, as working holds: the layout settles
but the frame keeps doing something useful (`motion/animation-grammar.md`). A pause is a change of
tempo, not a frozen frame.

## Rhythm

Alternate intensity. A strong sequence often runs fast → hold → medium → impact → calm →
acceleration → resolve. Constant speed becomes monotonous even when every animation is polished.
Don't confuse speed with energy: energy comes from contrast in timing, choreography, sound, framing
and visual change.

## Sync to the voice

Sync to the word, not just the sentence. With a recording, get word timings by force-aligning the
known script (for example pocketsphinx `set_align_text`) and land key hits on the spoken word itself:
the click on "click", the number on the number. Use exact sync for key impacts and near-sync with
layered timing for secondary movement; one-to-one sync for everything feels mechanical. Without a
recording, time the script at about 2.5 words per second (`planning/intake.md`).

The picture leads the word. In Karl's 24 references with a voice-over, a new visual lands a median 0.14 s (about 4
frames) before its phrase, and before it in 60% of cases: start an arrival 3–6 frames ahead so it reads as the
word is heard. A new visual comes about every 1.7 s, roughly one per phrase; a third of the phrases carry on the
last visual, and a phrase with a list gets a step per item (`references/visual-dictionary.md`).
