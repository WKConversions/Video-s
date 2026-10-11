# Phrase by phrase

Karl's standing direction, given on every film since October 2026: the visuals show what is being said,
as it is said. More frames, more animation, never a presentation, and always think outside the box for
the ways to explain and the ways to move between ideas. A voice-over talking over a page that holds
still is the one result he rejects every time. This module is how to plan for that, and how to prove it.

## What makes a film a presentation

A film reads as a presentation when a layout holds while the voice explains it: a title and some bullets
or cards build in place, beat after beat, and the beats are joined by pushes or fades. Its symptoms:
- one storyboard frame per beat, because nothing in a beat changes enough to need a second;
- the same page on screen for more than about 2.5 seconds of voice;
- type that repeats the voice-over instead of a picture that explains it;
- every scene change is a cut, fade or push between pages;
- each beat built and torn down on its own, nothing carried from one to the next.

Measured on the Bruno Morgante film that Karl called a presentation (v2): 8 of its 29 phrases brought
nothing new on screen, and 3.4 seconds of voice played over a held page. The rebuild (v3), on the same
script: 30 of 31 phrases, and never more than 1.0 second.

## The rule

- **One continuous stage, not a set of scenes.** Build one world in which objects persist and transform:
  the viewer's project card that tangles and becomes the portfolio's first row, the client's figure that
  goes from tangled signal to their mirrored pattern, the logo that becomes a map pin. Beats are states
  of that world, not pages; nothing is built for one beat and thrown away.
- **The phrase is the unit, not the sentence or the beat.** Split the force-aligned voice-over into
  phrases (`scripts/phrase_check.py plan words.json`). Every phrase gets its own visual event on the
  word that carries it: something arrives, changes state, transforms, is marked, or the camera reveals
  it. A 30-second script has 20 to 30 phrases; the film has as many visual ideas.
- **A thread, and still a new idea per beat.** Choose one object from the client's own world to carry
  the film (their logo's geometry, their hero diagram, the viewer's own project) and let it change with
  the story, set up early and paid off at the end. The thread is the stage, not the answer: each beat
  still gets its own strategy (`examples/corrections.md`: one device can't answer every line).
- **Show it, then name it.** The picture explains; the type labels it. On-screen words are the key
  phrase only (six words or fewer to a line), built word by word on the spoken words, and the key word
  does something: a mark sweeps under it, it is struck out, ringed, underlined, rolls into another
  word, or changes colour. Unmarked lines of type that only repeat the voice are subtitles.
- **No dead voice.** Never more than 2.5 seconds of voice without a new visual. A working hold
  (the interface working, the camera breathing) keeps the frame alive, but it isn't a new visual; and drift
  added only to keep the frame moving reads as useless (VoxFlow, `examples/corrections.md`).
- **Calm is not static.** A brief that asks for calm pacing and no busy animation (Amargier Advisory)
  gets one move at a time, slower curves and more white space, and still a new visual on every phrase.

## Thinking outside the box: where the idea comes from

For each phrase, run the list and take the idea that reads in a second with the sound off and grows
out of the previous frame. Then cut anything that doesn't read.

1. **Make the word the object.** "idea." gets a mark and the mark becomes the project card; "why" brings
   the tangle; "stick." gets a mark that floods the frame and becomes the next scene.
2. **Act out the verb.** Tangle and untangle, scan and order, connect, link, lay brick by brick, rise,
   open on a centre line, fold away, strike off, fall away, gather in.
3. **Make the quantity physical.** 200 dots for 200 people mentored; twelve ticks for twelve years,
   which then lay the logo; a counter that rolls like an odometer instead of a number that swaps.
4. **Rebuild the client's own forms, live.** Their hero diagram, their logo geometry (traced into vectors
   so it can move), their insight cards, their numbered steps, their example profile. They are the
   brand's own visual language, and they explain the product truthfully.
5. **Turn space into meaning.** A map that spreads out from their home city; a hub with an orbit of
   partners; an axis from strategy to execution with stops lit as they are named; mirror symmetry for a
   product called a mirror; a range slider from executives to students.
6. **Before and after on the same objects.** Dashed links turn solid; statuses roll from Blocked to On
   track; tangled lines order into a pattern; the Idea pill rolls into Result. Swapping in new objects
   loses the change.
7. **The callback.** The opening object returns at the end, changed: the idea card comes back as a
   result; the logo's two bars return as "the thinking" and "the doing"; the bars that met as partners
   close the film as the mark.
8. **People where the line is about people.** The founder's photo at the centre of the ecosystem on
   "hands-on leadership"; labels struck off a person on "not another label".
10. **Borrow a technique that acts it out.** `references/technique-catalogue.md` lists fifty-one from Karl's
   reference films, with their timing: a dial that rolls to the number, a typed prompt with products
   inside the sentence, the word that is a button, a lens that reveals, rings whose label changes with
   each feature, a line that glides while its words pop on, a status that shimmers and grows into the
   result, a destination word that eats its line.
11. **Marking as punctuation.** One mark per phrase at most, in the brand's accent: a marker sweep, an
   underline, a strike, a hand-drawn ring.
12. **A vague line: look up how the references showed it.** `references/visual-dictionary.md` has, by kind of
   line (time, all in one place, AI, data, team, problem, easy, growth, trust, money, connecting, place, the
   call to action), what Karl's references put on screen and the principle behind it; `scripts/ref_lookup.py`
   finds more on the line's own words. Take the principle, build it from the client's material. Land each
   visual 3–6 frames before its word, the way the references do.

## Transitions grow out of objects

Every transition names the object it grows out of; if you can't name it, it is a page change. The ones
that worked in Karl's films (`motion/transitions.md` has the families):
- **A mask out of an object:** a colour field or the next scene grows as a circle out of the card, the
  person, the map pin, the apex of the logo, the button.
- **The mark becomes the next thing:** the highlight under a word becomes a card; the mark under
  "stick." floods the frame red for the numbers; the logo lands as a map pin.
- **Layout transformation:** the tangled cards line up into a ranked portfolio; four insight cards
  gather into one assessment; the businesses on a map fly into an ecosystem ring.
- **Something opens or closes:** a card opens on its centre line into the next screen; the hub folds into
  its centre; two hundred dots gather into the one person who said the quote.
- **A line leads:** a scan line orders what it passes; a red line rises like a curtain onto a stage.
- **A word becomes another word:** a roll in one slot ("hard lessons" into "stories").
- **The camera** pushes slowly through every beat and is released on each transition, so it never locks
  and never jumps (`motion/camera.md`).

Keep two or three of these families for a film, and never a crossfade between layouts.

## Colour fields change with the story

Change the background with the story, through masks that grow out of objects, so the colour change is
itself a move: white, the brand's warm white, a pale tint of its accent, one full field of the accent for
the moment that matters. Bright by default; Karl: no static, standard dark background.

## Showing the voice in text

Karl sent six references on 11 October 2026 for the way they show the voice-over and the text
(`references/benchmarks.md`). ref29 (CrowdReply) is the one with a voice-over; ref28, ref30, ref31 and ref33 tell
their story the same way with on-screen text alone. What they show, measured:
- **The words belong to something.** ref29 never subtitles its voice. For its middle 24 seconds the voice is acted
  out by text inside the product: the buyer's question typed into a chat, the answer streaming in, a query typed
  into an address bar, "Your Brand Missing!" tags appearing on "not", status chips flipping to Live on "live",
  counters rolling, a button label. Pure kinetic type comes three times only: the hook (0–4.1 s), the product name
  (25.5–28 s) and the close (52.8–56.2 s). The type-led films do the same: the user's prompt is the narration
  (ref30), a status shimmers while the product works (ref28, ref33). When a line is something a person or the
  product would write (a question, a request, a status, a result), show it as that text in the client's real
  interface, at two to four times real size.
- **One readable line at a time.** Kinetic lines of seven words or fewer (ref29), one message or line of twelve
  words or fewer (ref28); everything else is texture, greyed, out of focus or past the frame edge. The type grows
  with the stage: about 50 px in the chat, 100 px for the claim, 115 px cap height for the brand (ref28).
- **One arrival for all the text.** ref29 brings every piece of text in the same way (the colour wake, about a word
  a frame, tint to ink in 0.5 s); ref28 and ref30 pop every word and message on whole, at full opacity, never fading
  or blurring it. Choose one for the film so the eye always finds the newest words
  (`references/technique-catalogue.md` 21, 24).
- **The key word changes form, not only colour.** The subject nouns in a serif, the missing word "Find" as a pale
  ghost 1.6 times larger, the verdict in a pill (ref29); a private word hidden behind glass (ref32).
- **On the word, measured.** ref29's new visuals land a median 0.04 s (one frame) before their phrase, most within
  ±0.25 s. State changes land on the word that names them: the punch-in on "checked" (0.00 s), the names on
  "articles" (0.04 s early), "Your Brand Missing!" on "not" (0.04 s late), the rows on "find" (0.04 s early), the
  zoom on "shaping" (0.06 s early), "Live" on "live" (0.04 s early). Lead an arrival by 3–6 frames
  (`motion/timing.md`); land a change of state on its word.
- **Finish the line before its last word.** Typed or built lines are complete 0.3–0.6 s before their last word is
  spoken ("recommend" typed 0.34 s before it is said, the typed query complete 0.46 s before "recommendation",
  "We'll show you the gap" 0.5 s before "gap"), so the viewer has read the line by the time the voice ends it.
- **The name leads, then holds.** The product name starts to build 1.0 s before it is spoken (from 25.76 s;
  "Citation" at 26.74 s), is complete just as the voice reaches it, and the frame holds while it is said
  (26.84–27.92 s); the consequence ("Competitor Mentioned") shows 1.96 s before "competitor's", then holds
  near-still. These two message cards are the film's only real holds, each while the voice speaks it.
- **Transitions live in the pauses.** 13 of ref29's 19 pauses of 0.25 s or more carry a scene change: the transition
  starts on the phrase's last word, the scene changes inside the pause, and the new scene is settled for the next
  phrase's first word (the whip at 27.96–29.0 s changes scene at 28.60, inside the pause 27.98–28.66; the cut at
  4.16 inside 3.64–4.34; the send and push inside 7.26–8.32). Plan from the force-aligned pauses as well as the
  words: a transition that runs across a spoken word smears the phrase.
- **Where it lags, it reads late.** "Let" appears 0.26 s after it is spoken because the old line is still leaving;
  the call to action cuts in 0.24 s after "Book" begins and its label reads about 0.5 s late; the callback answer is
  0.26 s late. Clear the outgoing line before the next phrase starts.
- **Its one dead phrase.** "no one to chase" (41.20–42.44 s) brings nothing new, only a slow 3% zoom that runs
  from 41.6 to 44.2 s, and `phrase_check.py` flags it STATIC: 27 of 28 phrases bring a new visual (table below).
- **Without a voice, the beat is the word.** In the music-only films (ref30, ref31) cuts and pops land within
  1–3 frames of a music onset, and a push's fastest frame, not its landing, sits on the beat.

## The storyboard shows the phrases

A frame per phrase, at least three per beat, each with its time and what moves: 30 to 40 frames for a
film of 30 to 45 seconds (`production/output-format.md`). A storyboard with one frame per beat is a
presentation storyboard, whatever the film turns out to be.

## Measure it

On the draft and on the final encode: `python3 scripts/phrase_check.py check film.mp4 src/words.json
--sheet phrases.png`. Every phrase brings a new visual (6% of the frame changed, or 0.6% of it new
structure, after camera moves are aligned out), and no more than 2.5 seconds of voice passes without
one. Read the sheet: a phrase flagged STATIC is a phrase the picture doesn't explain yet. Calibration on
Karl's films:

| Film | Phrases with a new visual | Longest voice without one |
|---|---|---|
| Bruno Morgante v2, "a presentation" | 21 of 29 | 3.4 s |
| Bruno Morgante v3 | 30 of 31 | 1.0 s |
| MindMirror | 21 of 21 | 0.0 s |
| Amargier Advisory (calm brief) | 19 of 20 | 0.9 s |
| CrowdReply, ref29 (a reference Karl sent, not our film) | 27 of 28 | 1.2 s |
