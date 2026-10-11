# Visual dictionary

How Karl's 25 reference films show what the voice says, by the kind of line, and how fast the picture moves
against the words. Use it when a line is vague and its picture isn't obvious: find how the references made the
same kind of line concrete, and adapt the idea to the client's own product and material. Never copy a layout
(Karl: "find examples for certain visualizations in the reference videos, not exact and precise like the
references"). Read it with `planning/phrase-by-phrase.md` (every phrase gets its own visual) and
`references/technique-catalogue.md` (the techniques, timed).

To see more than the examples below: `python3 scripts/ref_lookup.py "your words|similar words" --out sheet.png`
finds every phrase in the references' transcripts that matches and tiles what was on screen at its start, on the
matching word and at its end (the films are in `refs_src/`; the word-timed transcripts in `data/ref_words.json`).

## How the picture keeps time with the words

Measured on the 24 references with a voice-over (word timings from the voice stems, picture changes from
frame-to-frame change):
- **The picture leads.** A new visual lands a median 0.14 s (about 4 frames) before its phrase starts, and before
  the phrase in 60% of cases. Key the arrival 3–6 frames before the word, never after it.
- **A new visual about every 1.7 s** (half of them between 0.8 and 2.9 s), against phrases of about 2 s (half between 1.1 and 3.5 s) at
  2.3 words a second. So roughly one change per phrase (1.2 on average).
- **A third of phrases start nothing new** (36%): they continue the visual of the phrase before, which keeps
  working (it fills in, a detail moves, a label changes). A third bring two or more changes: a list of things
  ("searching for parts, gathering prices, crunching data") gets a change per item.
- **Long, vague lines get several steps.** Qualetics' 13-second sentence about "data machines" runs through a
  ring, a row of six services and a line of icons; a single held picture would have died.

What it means for a build: one visual per phrase as the default, arriving just before the phrase; a vague or
long line split into its parts with a step for each; a short line can carry on the last visual instead of
starting a new one.

## By the kind of line

Each entry: what the references showed (film, timecode), then the principle to take.

### Time, speed, "instantly"
- boksi 0:13 "time-consuming": the pile of content cards is replaced by an hourglass, and a coin pops beside it.
- pretaa 0:13 "the exact right time to upsell": a timeline with a play head runs along the bottom; a clock with
  a dollar badge rises on it; the line curves up into an arrow.
- kyvos 0:08 "demand for instant insights": a dense ring of data symbols, then an empty window with a loading
  spinner. "Instant" shown by its absence: the wait.
- collato 0:23 "instantly visualized": an empty app window; nodes and lines draw into a map inside it.
- Dripc 0:33 "credit… instantly": the assets you'd normally pledge (house, car, ring, papers) give way to the phone
  with a big green amount and coins.

Take: show the time itself (a clock, an hourglass, a spinner, a timeline) only as the problem; show speed as the
result appearing at once in the product.

### "All in one place", unified, centralised
- Fellow 0:39 "centralizes all your meetings": three app icons in a row; a window grows behind them and they dock
  into its top bar.
- JOS 0:56 "centralizing business applications": two people at a board that fills with the apps' icons.
- Seed Fitness 0:09 "your training, your nutrition, all in one system": a line of type in the middle; the photos
  around it change with each word.
- JustCall 0:16 "logs everything you need": the CRM's activity list fills in row by row (call, message, missed
  call).

Take: the separate things visibly go into one container (dock, fill, gather). Never a "hub" diagram with spokes
as a default.

### AI, automation, "smart"
- SKUVE 0:15 "from smart search to AI chat": huge type types out, becomes a real search bar, a query is typed and
  sent.
- elyxir 0:00 "everyone has the best AI model": the sentence types into a glowing input pill.
- collato 0:31 "AI-powered search… automated summaries": "Ask anything" in the product; the answer panel opens with
  its summary.
- Shopgenie 0:42 "the AI service writer, Jasmine": a genie lamp, then a person's face with a chat bubble saying hi.
- Faronics 0:12 "automate key tasks": icons rise out of the buildings of a city, then a calm meeting room.

Take: AI is an input and an answer in the product (a prompt typed, a result appearing), or a named helper with a
face. No robots, brains or circuit boards.

### Data, insight, tracking, dashboards
- JustCall 0:37 "track deal progress": the pipeline bar is lifted out of the CRM, enlarged, and its stages fill one
  by one.
- CalcuQuote 0:18 "searching for parts, gathering prices, crunching data": one collage of cards; the label beside
  it changes with each verb.
- Kaelio 0:00 "switch between five dashboards": a team icon in the middle, dashboard icons pulling at it from all
  sides.
- Happy 0:36 "insights on leadership": floating faces with insight cards; one card and its face come forward.

Take: lift the one element that carries the line out of the screen and make it big. A list of verbs over one
picture can change only its label.

### A team, collaboration, people
- JOS 0:44 "work from anywhere, effortless collaboration": one person at a desk, then two in different places
  joined by a dotted line, then four faces in video tiles around one shared screen.
- elyxir 0:50 "add your team to it": "Create new", then a row of avatars with a plus, Send pressed.
- pretaa 0:00 "sales reps don't know what to do next": several reps with speech bubbles full of garbled symbols.
- Happy 1:40 "remote, in the office, or in between": a video-call grid of four faces, then office footage.

Take: real faces or avatars doing the thing together; confusion as garbled speech, not a question mark icon.

### A problem, a pain, "manual", "complex", "expensive"
- UpSend 0:15 "too expensive for startups": a tablet full of coins; they drop off the screen one by one.
- Qualetics 0:16 "a daunting challenge": a ring full of infrastructure empties until only a dot is left.
- CalcuQuote 0:13 "a maze of manual tasks": windows multiply and pile up.
- Faronics 0:04 "battling the same problems": footage of a man at a laptop; error pop-ups gather round his head.
- Kaelio 0:04 "problems after they've escalated": four report cards get red warning badges, one after another.

Take: the problem happens to the real objects of the work: too many of them, things draining away, alerts
appearing. One beat, then the turn.

### Easy, simple, seamless
- Benefits Science 1:08 "easily converted into PowerPoint": a click on Export, and four format bubbles pop out.
- JustCall 0:05 "if it isn't seamless": a coin drops straight through a sales funnel.
- CalcuQuote 0:48 "easy to negotiate": a single tile with a price icon (the weakest: a label).

Take: easy is one gesture and its result, shown. Avoid tiles labelled "easy to…".

### Growth, results, revenue
- Fellow 0:54 "insights that help your team grow": the dashboard's charts grow as the cursor moves.
- elyxir 0:43 "no more choosing, just getting results": one line of type swaps, "results" gets a drawn underline.
- SKUVE 0:41 "as your catalog grows": a product card's details fill in.

Take: the client's own numbers or charts growing; when there are none, the type itself with one mark on the key
word (never an invented chart).

### Trust, security, compliance, track record
- CalcuQuote 1:31 "a trusted partner for 10 years": a timeline of years scrolls by with team photos and counters
  rolling up.
- Faronics 0:45 "easy compliance": a report pops out of the table with a green check.
- Benefits Science 0:08 "can you even trust the data": the charts get red warning badges.
- JOS 0:25 "secure distributed workspace": a central tile with the workspace's icons circling in dotted rings.

Take: trust is evidence: years, counts, a check on the real report. A shield or a padlock only on the thing it
protects.

### Money, cost, pricing, credit
- UpSend 0:15: coins draining (cost as loss); Dripc 0:33: a big amount on the phone with coins (money gained);
  boksi 0:15 "expensive": the hourglass with a coin beside it (time and money together).

Take: money moves (drains, arrives, adds up); a static dollar icon says nothing.

### Connecting, integrating, syncing
- FCS 1:47 "integrates with all the major systems… OpenAPI": an API cloud with a lock in the middle, the partners'
  logos in a ring around it.
- Kaelio 0:19 "connects your CRM, analytics…": the logo, lines drawing out to each named tool, the camera
  travelling to each.
- collato 0:00 "juggling projects, tools and stakeholders": the person in the middle, cards and faces orbiting him
  on dashed lines.
- JustCall 1:03 "integration": two blobs merge into the two logos with an ×.

Take: named things joined by lines that draw on the word, or two marks becoming one lockup. Draw only the tools
the client really connects to.

### Personal, custom, "built for you"
- boksi 0:23 "not localized and personalized": puzzle pieces that don't fit, then fit together.
- Seed Fitness 0:09 "built for you": photos of the person's own training and food.

### Place, remote, worldwide
- Dripc 1:15 "65 countries": a dotted world map with the number in a pill, then the customers' testimonials.
- SmileGenius 0:12 "remote patient monitoring": the clinic and the patient joined by an arc; then the patient's
  app on a phone in a hand.
- Happy 1:40 "remote or in the office": video tiles, then the office.

Take: a map when the line is about where (`design/maps.md`); otherwise the two places joined, and the product in
the hand of the person far away.

### The call to action
- SmileGenius, JustCall, collato, Faronics: the logo, the address or tagline, one button; the button is pressed
  (a cursor or a finger) on the words "book a demo", "try it now".
- Kaelio: the sentence "Try Kaelio for free" with the logo set inside it.

Take: the end card is the logo, a line and one action, calm (the K.B lesson); the action is shown being taken.

## When the line is vague

1. Name the concrete thing the line is about (which object, whose action, what changes).
2. Look it up here, or with `ref_lookup.py` on the line's own words and their synonyms.
3. Pick the reference's principle, not its picture, and build it from the client's product, people and brand.
4. If the line has parts, give each part a step; if it repeats the last line, let the last visual carry on.
5. Land each step 3–6 frames before its word.
