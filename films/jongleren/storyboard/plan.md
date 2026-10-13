# JongLeren.es — "Jouw stage, volledig begeleid" (plan)

## 1 Brief
- **Client:** JongLeren.es, "Hét stagebemiddelingsbedrijf in Zuid-Spanje" (Málaga). Internship placement,
  housing, coaching and community for Dutch students (mbo, hbo, university).
- **Deliverable:** a Dutch explainer for the site and socials, 1920×1080, 30 fps, 42.0 s: the supplied
  ElevenLabs voice-over ("Ido – Informal Friendly Narrator", 40.6 s) plus a 1.6 s end-card hold.
- **Audience:** students (17–25) planning an internship abroad, and their parents/school as second readers.
- **Message:** from your first question to your last internship day, JongLeren arranges and guides
  everything: intake, app, internship search, interview, housing, support in Spain.
- **Tone:** friendly, informal, youthful; Karl asks for **the 4% motion norm**: a typical frame has about
  4% of its area changing (`motion_check.py`), something moves in 90%+ of frames, no still over 0.5 s
  (the energetic row of `motion/timing.md`). Reached by the content moving (big photos with slow pushes,
  arrivals from outside the frame, colour fields growing out of objects, the line drawing), never by
  camera swings (the K.B lessons: the camera only breathes; no spikes, no overshoot on big things; one
  thing to watch at a time).
- **Language:** all on-screen text Dutch, from the script and the site's own words.
- **Assumptions:** 16:9; script used exactly as written; music and effects copyright-free (Karl's
  standing request since GoHere).

## 2 Look and material
Brand (measured, `brand.json`): red `#D2020C` (the logo, the site's buttons), white, warm grey `#EFEDED`,
text grey-brown `#4F4938`/`#545454`, black; Roboto (700 headings). The site's illustrations of Andalusian
towns (white houses, bougainvillea pink `#F54A86`, terracotta `#DB8D3D`, sand `#D8C7BD`, leaf `#C5E499`)
are the film's second palette. Real assets from the site: the logo (the JL monogram with the juggling
bull and its four balls), the app's home screen (the bull with its feature circles), the hero photo
(two students with a suitcase in Málaga), photos of interns with their companies, a coaching
conversation, a student meet-up, the team, the town illustrations, the plane icon.

## 3–4 Beats and arc
| # | Time | Line | Meaning | Beat type |
|---|---|---|---|---|
| 1 | 0.0–3.7 | Jouw stage in Spanje begint al voordat je je koffer pakt. | your internship starts before you even pack | hook |
| 2 | 3.7–6.6 | Met JongLeren wordt alles een stuk makkelijker. | JongLeren takes the juggling off your hands | promise / turn |
| 3 | 6.6–13.3 | Eerst plannen we een intakegesprek. Je vertelt wat je studeert, wat je zoekt en welke eisen jouw school stelt. | step 1: they listen first | process |
| 4 | 13.3–17.3 | Vervolgens download je onze app, waarin je iedere stap kunt volgen. | step 2: transparency in the app | product |
| 5 | 17.3–22.2 | Wij zoeken een passende stageplek en regelen een kennismakingsgesprek met het bedrijf. | step 3: they search and connect | process |
| 6 | 22.2–27.2 | Ben je aangenomen? Dan helpen we je indien nodig ook met het vinden van huisvesting. | step 4: hired, and a home if you want | payoff + option |
| 7 | 27.2–33.9 | En eenmaal in Spanje? Ook dan staan we voor je klaar. Met persoonlijke begeleiding, coaching en activiteiten. | step 5: in Spain you're not alone | reassurance |
| 8 | 34.0–37.0 | Van je eerste vraag tot je laatste stagedag. | the whole journey, covered | summary |
| 9 | 37.2–42.0 | JongLeren. Jouw stage, volledig begeleid. | brand + promise | sign-off |

Arc: a question held open (before the suitcase) → relief (the juggling taken over) → five steps, each
ticked, rising in energy to "aangenomen" → arrival in Spain (the suitcase pays off) → the whole line seen at
once → the logo, where the step dots become the bull's juggling balls.

## 5 Thesis and art direction
**Thesis:** *JongLeren juggles it all for you.* Their name means "juggling", their logo is a bull
juggling four balls, their app shows the bull with its services in circles around it, and their site
explains the service as a five-step line. The film is built only from those forms: red balls that become
the steps of a line, and the line that becomes the logo again.

Allowed patterns: red balls/dots (the logo's balls, the app's circles, the site's timeline dots); one red
line that draws from step to step; their real photos in rounded cards; their town illustrations for Spain;
app UI rebuilt from their screen; Dutch type built word by word with one red mark per phrase; colour
fields white → warm grey → red, grown out of a ball or a card. Not allowed: icons per noun, generic
stock, dark backgrounds, 3D spins, bounces on large things, numbers the site doesn't give.

**Motion identity:** energetic-clean (youthful, friendly, no toy). Signature curve: expo-out
`(.16,1,.3,1)` for arrivals (≈80%); `MOVE (.65,0,.35,1)` for carried objects; `DEPART` for exits. Duration
palette: quick 5–7 f, standard 10–14 f, slow 20–26 f. Entrance pattern: from outside the frame or out of
a ball/card (mask), with motion blur. Overshoot (≈8%) only on small things landing: balls, ticks, chips.
Camera: one slow breath for the film (≤ 25 px/s), a slow push into the sign-off; never a move on a cut.

## 6 Thread and phrase-by-phrase visuals
Thread object: **the red ball** (the logo's juggling ball). It opens as the hook's question dot, becomes
JongLeren's juggled to-dos, lines up as the five step dots of the route line, rides along as the progress
dot in the app, marks each step done, and flies back into the logo as its four balls.

| P | Time | Phrase | Visual event (on the key word) |
|---|---|---|---|
| 01 | 0.16 | jouw stage in spanje begint al voordat je je | "Jouw stage in **Spanje**" builds word by word; a red ball drops in and starts a dotted line "Start" on "begint" |
| 02 | 2.58 | koffer pakt | a red suitcase (flat, their red) slides in under the line and its lid closes on "pakt": the journey is already under way before it |
| 03 | 3.68 | met jongleren wordt alles een stuk makkelijker | the to-dos tumble in (Stageplek, Huisvesting, Gesprek, Eisen school, Documenten) in a heap; on "JongLeren" the logo rises in a red field and on "makkelijker" the to-dos become balls juggled in a clean arc around the bull |
| 04 | 6.66 | eerst plannen we een intakegesprek | the balls line up into the route (five dots); the first dot opens into an intake card: video call, date picked, "Intakegesprek" |
| 05 | 8.76 | je vertelt wat je studeert | the call fills; a chip rolls through study fields (Marketing & Communicatie → Toerisme & Recreatie → IT-sector) on "studeert" |
| 06 | 10.22 | wat je zoekt en welke eisen jouw school stelt | wishes as chips (Málaga, Marbella, Granada; stage, woning); then a school checklist ticks three lines on "eisen" |
| 07 | 13.34 | vervolgens download je onze app | the intake card folds into a phone; the app icon drops in, a download ring fills, the app opens (their bull home screen) |
| 08 | 15.20 | waarin je iedere stap kunt volgen | inside the app the route appears as their step list; the progress dot runs down: Intake ✓, App ✓, Zoektocht… |
| 09 | 17.30 | wij zoeken een passende stageplek | out of the phone: vacancy cards flick past (their sectors); one locks with a red ring: "Match" |
| 10 | 18.96 | en regelen een kennismakingsgesprek | the match card turns into an invitation: "Kennismakingsgesprek" with a time, two avatars joined by the red line |
| 11 | 21.02 | met het bedrijf | the invitation opens into a real photo of an intern with the company (from the site) |
| 12 | 22.24 | ben je aangenomen | the photo frame gets the stamp "Aangenomen!" with a tick (the film's one celebration) |
| 13 | 23.48 | dan helpen we je indien nodig ook met het | an option row "Huisvesting regelen?" and a switch that flips on ("indien nodig") |
| 14 | 25.68 | vinden van huisvesting | the switch's dot opens into an Andalusian street of their illustrations, a house lights up with a key pin |
| 15 | 27.29 | en eenmaal in spanje | the street opens on the hero photo: two students with a suitcase in Málaga (the suitcase from P02, arrived) |
| 16 | 28.76 | ook dan staan we voor je klaar | the team photo slides in beside them: "We staan voor je klaar" |
| 17 | 30.56 | met persoonlijke | a card deals in: an internship visit photo, labelled "Persoonlijke begeleiding" |
| 18 | 31.16 | begeleiding | the label's mark sweeps under "begeleiding" |
| 19 | 32.00 | coaching en activiteiten | two more cards deal in: "Coaching" (the café conversation), "Activiteiten" (the meet-up) |
| 20 | 34.06 | van je eerste vraag tot je laatste stagedag | the cards shrink onto the route; the line draws across from a "?" bubble to a last-day calendar, every dot ticked |
| 21 | 37.21 | jongleren | the dots rise off the line and land as the logo's four balls; the logo forms in white on red |
| 22 | 38.25 | jouw stage | the line "Jouw stage," builds under the logo |
| 23 | 39.20 | volledig | "volledig begeleid." completes, red mark under "volledig begeleid" |
| 24 | 39.80 | begeleid | jongleren.es settles; the camera's slow push to the end |

## 9 Sound
Music: a copyright-free, sunny, youthful track (Mixkit, no credit) with a lift on the turn (3.7 s,
"Met JongLeren") and its ending on the sign-off. Effects (energetic: denser, crisp, still under the
voice): Kenney CC0 interface sounds and generated whooshes/pops: ball drops and pops on landings (rising
a scale for runs), swishes on the big arrivals, taps on the app, a download tick, a chime for the
invitation, one success for "aangenomen", a shimmer for the logo.
