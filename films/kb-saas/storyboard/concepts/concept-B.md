# Concept B: "The prompt is the narration"

**Working title:** Asked, answered, running · 1920×1080 · 30 fps · about 40.0 s (voice-over at +0.50 s, last word ends 38.0 s)

The voice is acted out by the text that interfaces produce: a question typed into a prompt bar, a status that shimmers
while something works, an answer that streams in, a status chip that flips to Running, a request with its answer card
landing on it, and a word that swaps in its slot. Pure kinetic type comes three times only: the hook (0.0–3.2 s), the
name (8.4–9.6 s) and the close (35.2–40.0 s). Everything else is text inside an interface, at 2–4× real size, one
readable line at a time. The whole film scrolls one way, upward, like a conversation.

## Thesis

K.B is the answer to the question every growing business asks itself. The film is that conversation. Your own tasks
pile up between your tools. You type the question ("What if everything just worked together?"). K.B takes your tasks one
by one and answers each with something running. At the end your question rewrites itself into the answer, and the task
list empties into time to grow.

**Allowed patterns** (named on purpose, so they are not tells):
- An illustrative request thread between "Your team" and K.B. Its composer placeholder is K.B's own contact heading,
  "How can we help?". It is never presented as a K.B software product.
- Two generic cursors, labelled "Your team" and "K.B". No people, faces, initials or team members.
- Illustrative examples of what K.B builds (a connection, a workflow, an AI agent, a dashboard, a monitoring panel). Their
  copy is taken only from K.B's site and case pages. There are no figures, no client names and no client logos.
- Third-party tool names as plain text (Slack, Notion, Airtable, ClickUp, Google Workspace, Odoo: the FAQ integrations
  and the site's tool list). Two real tool logos K.B builds with (n8n, Make) appear once each, small, inside a card.
- The site's own nav behaviour: the "K.B" pill expands to "K.B Tech Partner" on hover.
- One full cyan field ("everything works together"), with navy text on it.

## Thread object

**The business's task list.** It is the viewer's own work, written in K.B's words from its case pages: "Follow-ups",
"CRM updates", "Payment confirmations", "Excel files", "Outreach", "Intake calls". It changes state through the film:
- P04: it piles up between the tools;
- P09: K.B's frame is built around it;
- P10–P11: its rows get connected and automated;
- P13: it merges into one line;
- P25: it checks itself off and empties;
- P26: the empty list becomes "Time to grow".

**The narrative spine is the question.** It is typed at P05, sent at P06 and kept off-frame. It returns at P16 and
rewrites itself into the answer at P17.

**The mark is the send button.** The composer's navy send tile grows into the K.B logo tile on "Meet K.B" (P06). The same
tile rises in for the sign-off (P27). You press it to ask, and K.B is what answers.

## Motion identity

- **Personality:** precise premium (clean). No overshoot or bounce anywhere, and nothing pops past its size.
- **Signature curve, about 80% of moves:** the measured exponential arrival. A move starts at speed and decays by ×0.8 a
  frame: 90% of its travel in about 10 f, then a tail of up to 30 f. The tail is the hold, and the next move starts out of
  it. In Remotion that is `p = (1 − 0.8^f) / (1 − 0.8^n)`, which is close to `cubic-bezier(.16,1,.3,1)`.
- **Exits:** an exponential ease-in (×1.3 a frame), in about half the frames of the matching arrival, always upward. The
  scene cuts on the fastest frame, and the next state carries on upward at that speed (A1/A2 vertical, technique 33).
- **Moves on screen** (a pill making room, a card opening): B1 easy ease, 12–16 f. Lines draw on B11. Cursors follow on
  B4. The shimmer, the feed and the live traces run on B10 (constant speed, starting and stopping off screen or under
  something).
- **Duration palette:** quick 6 f (swaps, toggles, a press 4 f + release 3 f), standard 14 f (to 90% of an arrival),
  slow 24 f (field masks, the cyan flood, the name tile).
- **Entrance pattern:**
  - Every card, pill, message and row enters from below, already moving, and decelerates.
  - Every piece of text uses **one arrival**: whole words (or typed characters) pop on at full ink, with no fade, blur
    or rise. Behind the newest two or three words sits a pale cyan wake: a rounded band at x-height, #38C8FF at 18%,
    clearing in 12 f. That is the colour wake of technique 24, done as a shape, because the brand never puts cyan text on
    a light ground.
- **Camera:** one slow breath for the whole film, under 0.25 px a frame anywhere in the frame (scale ≤ 0.025% a frame,
  drift ≤ 0.15 px a frame). That keeps it below `motion_check.py`'s 6-level threshold, so it never counts toward the 4%.
  It eases to rest from 35.2 s. There are no camera pushes: "push to the detail" is always done by the content, as a row
  lifting out (46) or a pill opening into a card (31).
- **Blur:** only on the slot roll (P02) and the two scroll hand-offs that pass 60 px a frame (P04→P05, P15).

## Transition family (three)

1. **Chat-scroll hand-off (33).** The next state rises from below and pushes the current one up and out. The cut sits on
   the fastest frame, and sometimes a 48–56 px lip of the old state stays at the top edge. Direction is always up. It is
   used in most pauses.
2. **The container makes room or collapses (31).** A pill opens into a card, and a card or a whole panel collapses into one
   line or one pill. Examples: nav pill → card (P09); "Operations" row → agent panel (P14); monitoring panel → "Running"
   pill (P22/23); pill → "Manual work" card (P25).
3. **A field grows out of an object.** The white field grows out of the send tile (P06). The section tints grow out of the
   connection line and the answer card (P10, P11). Cyan floods out of the answer bubble (P17) and later contracts into
   the audit pill (P18).

**The one named exception:** at P15 the agent panel hands over to the software window on "to", mid-phrase (see Risks).

## Colour-field plan

| Time | Field | Grows out of |
|---|---|---|
| 0.0–8.4 | canvas #F7F7F7: the business today | — |
| 8.4 | white #FFFFFF; the blurred task feed disappears under it | a circle out of the send tile, 24 f |
| 13.6 | paleCool #F1F5F9 (Connect) | a band widening out of the cyan connection line |
| 14.9 | pale card #EBECF4 (Automate) | the answer card |
| 15.9–21.8 | white (Simplify, agent, software) | the deck gathering clears the tint |
| 21.9 | **full cyan #38C8FF**, navy text: the film's one accent field | a circle out of the answer bubble, 24 f |
| 22.4 | #F7F7F7 (the work: audit, build, run) | uncovered as the cyan contracts into the audit pill |
| 29.9 | white ("Just technology") | a circle out of the "Running" pill |
| 32.4 | paleCool #F1F5F9 ("Manual work") | the card |
| 35.1–40.0 | white sign-off; the navy tile is the only colour | — |

**Colour callback (34):** each system keeps its tint. The pale-cool connection, the pale-card workflow, the agent (pale
cyan #E8F7FF) and the white dashboard come back together as the lips of the "everything" stack (P16). The same tints are
the dots of the monitoring rows (P20), so the pay-off reads without labels.

## Phrase by phrase

Times are film seconds. Every arrival leads its word by 1–3 frames, and every change of state lands on the word.
Abbreviations: ref = reference film; f = frame (1/30 s); "make room" = technique 22; "expo" = exponential.

**P01 · One business. · 0.70–1.78 · key "One" 0.70**
- **Visual event:**
  - From frame 0, a navy caret (8×112 px) rises 40 px into place at x 300, y 540 on the signature curve and blinks once.
  - On "One" (0.66) the line arrives: it rises 60 px from below, and "One" pops on whole at the caret.
  - On "business." (0.85) the second word pops on into the moving line. Type: Montserrat 700, 128 px, ink, left edge
    pinned at x 300.
  - The caret steps after each word, and the wake sits behind the newest word.
- **Techniques:** 21 (pop on whole, crisp), 24 (wake as a shape), 25 (caret, without the follow), 33 (enters from below).
- **Carries over:** nothing, since it is the opening. The caret is the business's voice and types the question in P05.
- **Motion (4%):** the line's arrival and the word pops (about 2%). This is the planned quiet open.

**P02 · Countless · 1.84–2.40 · key "Countless" 1.84**
- **Visual event:**
  - In the pause (from 1.74), "One business." is pushed up 170 px. It greys to 30% and scales to 72%, its left edge
    pinned.
  - "Countless" pops on at 1.80 at y 560.
  - Right after it, at the caret, a slot window 150 px tall rolls tool names upward at a constant 55 px a frame,
    motion-blurred: Slack, Notion, Airtable, ClickUp, Odoo, Google Workspace (the long name bleeds off the right edge).
    The names are grey #49525B.
  - The roll never stops while "Countless" is spoken. "Countless" is acted out as a slot that can't settle.
- **Techniques:** 33, 5 (dial) run as a constant roll on B10, 23, 24.
- **Carries over:** line 1 above; the caret becomes the slot's left edge.
- **Motion (4%):** the rolling slot of 128 px text, plus the push-up's tail (about 4–6%).

**P03 · tools. · 2.40–3.24 · key "tools" 2.40**
- **Visual event:**
  - From 2.26 the roll decelerates (expo ×0.75 a frame, 8 f) and lands on "tools." in ink at 2.38.
  - The last two names stay as faded neighbours above and below (20%), then clear in 12 f.
  - In the pause (from 3.10) both lines rise again: "One business." leaves the top, and "Countless tools." greys.
- **Techniques:** 5 (lands with faded neighbours), B4, 23, 33.
- **Carries over:** the slot and its tool names (they return as the chips in P04 and the swaps in P24).
- **Motion (4%):** the deceleration, the neighbours clearing, the push-up (about 3–4%).

**P04 · And hundreds of tasks connecting them. · 3.24–5.82 · keys "hundreds" 3.54, "tasks" 4.10, "connecting" 4.62**
- **Visual event:**
  - On "And" (3.21) "Countless tools." exits upward.
  - On "hundreds" (3.50) task pills start streaming up from the bottom edge (35). Each appears at full size, already
    moving, one every 3 f. They are white pills with an empty checkbox, Montserrat 600 at 48 px, in a centred column at a
    104 px pitch: Follow-ups, CRM updates, Payment confirmations, Excel files, Outreach, Intake calls, Scattered
    submissions, Approval flows, and on.
  - The whole column keeps rising at about 5 px a frame (B10). Only the newest pill, at the bottom, is ink and readable;
    rising pills grey to 40% and soften by 2 px.
  - On "tasks" (4.07) the tool names from the slot come back as small grey chips (36 px) in two columns at x 330 and
    x 1590, rising with the feed.
  - On "connecting" (4.58), from each task pill two dashed grey lines draw outward to one tool on the left and one on the
    right (B11, 8 f, staggered 2 f row by row). Each task is a hand-made link between two tools.
  - By "them" (5.08) the feed has sped up to about 9 px a frame and fills the frame: overload.
- **Techniques:** 35, 16 (quantity made physical), B10, B11.
- **Carries over:** the tool names from the slot become the chips the tasks connect.
- **Motion (4%):** a rising feed of text and drawing lines across most of the frame (about 8–15%). This is the film's
  densest stretch.

**P05 · What if everything just worked together? · 5.82–8.22 · keys "What" 5.82, "everything" 6.22, "together" 7.32**
- **Visual event:**
  - In the pause 5.32–5.77 a white composer rises from the bottom edge: 1500×300 px, radius 48, a soft wide navy-tinted
    shadow, settling at y 560.
  - As it rises, the feed behind defocuses (14 px blur, 30%) but keeps streaming (47). The tasks don't stop while you
    ask.
  - The placeholder is "How can we help?" (grey, 64 px). The send tile, an 88 px rounded square at the lower right, is
    disabled (#E2E8F0).
  - On "What" (5.76) the question types, eased: about 20 characters a second on "What if", 45 in the middle. It is
    Montserrat 500, 76 px, ink, on two lines ("What if everything / just worked together?"). It is complete at 6.95,
    0.37 s before "together".
  - The send tile turns navy on the first letter.
  - On "together" (7.32) the "Your team" cursor enters from the lower-right edge. It is a 96 px navy arrow with a white
    outline and a label pill. It arrives already moving at 110 px a frame and decelerates over 14 f onto the send tile;
    its arrow fills on hover.
  - The press lands in the pause, at 7.90: 0.88 scale in 4 f, hold 2 f, release 3 f.
- **Techniques:** 25 (eased typing; the send button lights on the first letter, as in ref31), A6, 47, 37, 33.
- **Carries over:** the hook's caret types the question; the blurred feed keeps running behind.
- **Motion (4%):** the blurred feed streaming behind (meaningful: the work keeps coming), the typing with its wake, the
  cursor (about 4–6%).

**P06 · Meet K.B · 8.40–9.64 · key "K.B" 8.74**
- **Visual event:**
  - From 7.93 the question lifts out of the composer and rises as a sent bubble (grey #EBECF4, 52 px), out of the top
    edge (expo-in 10 f). It is kept for P16.
  - The composer's field collapses onto its send tile. Both ends converge (27), so the tile ends at the frame centre.
  - The cursor leaves, accelerating, to the lower right.
  - On "Meet" (8.36) the tile grows in place from 88 to 260 px (slow tier, exponential, no overshoot: B16 done by the
    element, not the camera). Its arrow shrinks to a dot and is gone on the fastest frame.
  - A white field grows as a circle out of the tile (24 f) and covers the #F7F7F7 and the blurred feed: the tasks stop.
  - "K.B" rolls up inside the tile in white Copperplate, a glyph every 2 f, complete at 8.72 on "K.B".
  - The tile holds, its tail settling, while the name is spoken (8.74–9.30). "Meet" is not put on screen: the name is
    the event.
- **Techniques:** 44 (the button becomes the mark, the name rolls out of it), 37, 50 (mark grows on an exponential, no
  overshoot), a mask out of an object.
- **Carries over:** the send tile, which is now the mark.
- **Motion (4%):** tile, field and bubble exit between 8.0 and 8.8 (6–12%). Then the name holds while spoken, the
  references' one sanctioned hold.

**P07 · Your technology · 9.66–10.51 · key "technology" 9.90**
- **Visual event:**
  - In the pause 9.33–9.62 the tile morphs into the site's own nav pill. It goes through a simple shape: the square
    widens into a pill (B1, 14 f, mass kept). The pill is navy #293A51, with "K.B" in #F1F5F9 Copperplate at 72 px, and
    it is 150 px tall (about 3× the site's nav).
  - On "technology" (9.86) the "Your team" cursor glides in from the lower left (B4) and hovers the pill. The pill does
    what the site's nav does on hover:
    - it makes room, moving toward its new centre 8 f before the word;
    - "Tech" attaches at its final gap near the speed peak;
    - it settles in 10 f.
- **Techniques:** 22, 37 (hover), B4, a morph through a simple shape.
- **Carries over:** the K.B tile, now the nav pill.
- **Motion (4%):** the morph, making room, the cursor (about 3%).

**P08 · partner, · 10.51–11.19 · key "partner" 10.51**
- **Visual event:** on "partner" (10.47) the pill makes room once more and "Partner" attaches. It reads "K.B Tech Partner",
  verbatim the site's nav on hover, in its own lockup type.
- **Techniques:** 22.
- **Carries over:** the pill and the cursor resting on it.
- **Motion (4%):** the make-room move (about 2–3%). This is a planned quiet beat.

**P09 · built around your business. · 11.19–13.13 · keys "built" 11.19, "around" 11.57, "business" 12.23**
- **Visual event:**
  - On "built" (11.16) the cursor clicks the pill (0.92, 3 + 3 f) and the pill opens (31). It moves up to y 230 and its
    lower edge pulls down into a white card (1040×640, radius 24, 16 f). The pill is now the card's header label. The
    cursor leaves, accelerating.
  - On "around" (11.54) the business's own tasks from the hook rise into the card, one every 3 f. They are the same white
    pills, 52 px, left-aligned, each keeping its own width: Follow-ups, CRM updates, Payment confirmations, Excel files,
    Outreach.
  - A 3 px cyan outline traces around them, hugging their ragged right edge step by step (B11, 20 f). K.B's frame is
    fitted to your tasks.
  - On "business" (12.20) the outline closes and the card's white and soft shadow settle behind the pills.
- **Techniques:** 37, 31, 35, B11.
- **Carries over:** the pill (header) and the hook's task pills (the thread).
- **Motion (4%):** the card opening, the cascade, the trace (about 5–7% until 12.2, then the tails).

**P10 · Connect your tools. · 13.17–14.53 · keys "Connect" 13.17, "tools" 13.65**
- **Visual event:**
  - In the pause 12.78–13.15 "CRM updates" lifts out of the card (46). The card, its header and the other pills exit
    upward (expo-in 9 f), leaving a 56 px lip at the top edge.
  - The pill scales ×1.4 to the centre and opens at both ends into two chips: "CRM" at x 440 and "Support desk" at
    x 1480 (white chips, 64 px text; K.B's own example, "linking a CRM to your support desk").
  - A dashed grey line joins the chips, with a grey "Manual" tag at its midpoint. "CRM updates" becomes a small grey
    caption above (36 px).
  - On "Connect" (13.13) the dashed line is redrawn solid, left to right, in cyan (B11, 10 f).
  - On "tools" (13.62):
    - a navy capsule ("Data") buds from CRM, travels the line on a short bell (11 f) and merges into Support desk (45);
    - "Manual" blur-swaps to "Connected" (navy text, cyan dot);
    - the pale-cool field grows out of the line.
  - A capsule then travels every 14 f: data syncing.
- **Techniques:** 46, 45, 23 (blur swap), B11, a mask out of an object.
- **Carries over:** the "CRM updates" task (the thread).
- **Motion (4%):** the lift-out and exits, the line draw, the travelling capsules, the field mask (about 4–6%).

**P11 · Automate workflows. · 14.53–15.81 · keys "Automate" 14.53, "workflows" 14.91**
- **Visual event:**
  - In the pause 14.16–14.46 the connection scrolls up to a 56 px lip at the top.
  - A "Your team" request bubble rises from below: grey #EBECF4, right-aligned at x 1500, 56 px, "Automate our
    follow-ups". It has landed by "Automate" (14.50).
  - On "workflows" (14.88) K.B's answer card rises over the request at full size. This is technique 36 without the 105%
    landing. It is a white card, 1300×420:
    - header: the n8n logo (36 px), "Follow-ups" (56 px, 700) and a toggle that switches on (6 f, navy track);
    - body: three step chips, "Scheduled task" → "Conditional logic" → "Follow-up sent", with a cyan dot running through
      them. Each step ticks as the dot passes (B13, 5 f a step), and the run loops by itself.
  - The request recedes to 92% and shows a 48 px lip above the card.
  - The pale-card field grows out of the card.
- **Techniques:** 36 (adapted), 33, B13, the toggle as a 6 f state change.
- **Carries over:** the connection lip; the "Your team" voice.
- **Motion (4%):** the scroll and arrival, the looping run (about 4–6%).

**P12 · Simplify · 15.93–16.65 · key "Simplify" 15.93**
- **Visual event:**
  - Through the pause 15.52–15.77 the run keeps looping, and nothing new arrives.
  - On "Simplify" (15.90) the three pieces on screen (connection lip, request lip, workflow card) slide together into one
    tidy deck at the centre (layout transformation, B1 14 f). They take equal widths of 1100 px and stack with 28 px
    lips. The tint clears to white as they gather.
- **Techniques:** layout transformation, B1.
- **Carries over:** everything from P10–P11.
- **Motion (4%):** three large cards gathering (about 6–10% for 14 f).

**P13 · operations. · 16.65–17.55 · key "operations" 16.65**
- **Visual event:** on "operations" (16.62) the deck flattens into one checked line (29, the ref33 collapse, stretched to
  10 f for a calm film). The cards' heights close into a single white row, 1100×128: a cyan circle with a navy check,
  then "Operations" (72 px, 700, ink).
- **Techniques:** 29, 31.
- **Carries over:** the deck.
- **Motion (4%):** the collapse (about 6%), then the row's tail to 17.4.

**P14 · From intelligent · 17.81–18.63 · key "intelligent" 18.01**
- **Visual event:**
  - In the pause 17.40–17.78 the "Operations" row makes room. It moves up to y 330, and its lower edge opens down into a
    panel (1200×460, 14 f), with the row as the panel's header.
  - On "intelligent" (17.98) the panel shows:
    - an "AI agent" chip (navy pill, white 40 px text);
    - beside it, the status "Working in the background" (grey, 52 px; K.B: agents "designed to work reliably in the
      background");
    - a 110 px shimmer band sweeping the status left to right at a constant 24 px a frame, while the label itself never
      moves.
- **Techniques:** 31, 29.
- **Carries over:** the Operations row; K.B's agents work "across daily operations".
- **Motion (4%):** the panel opening (about 5%), then the shimmer (about 1%).

**P15 · AI agents to custom software, · 18.63–20.95 · keys "AI" 18.63, "agents" 19.01, "custom" 19.61, "software" 20.05**
- **Visual event:**
  - On "AI" (18.60) the shimmer ends and the result grows out of the indicator (29). A reply bubble grows under the
    agent chip.
  - The reply streams at about 20 words a second, led by a small cyan dot at the writing head, the newest words on the
    wake: "CRM updated · Follow-ups sent" (56 px). It is complete at 18.98, on "agents", and the status rolls to "Done"
    (6 f).
  - On "to" (19.42) the panel exits upward (expo-in 8 f), cut on its fastest frame (19.58).
  - A software window (1440×820, radius 24) is already rising from below on "custom" (19.61). It arrives in false
    colour: a deep cyan tint crossed by a lighter band (40).
  - On "software" (20.02) the band rises and the true colours develop over 15 f: a custom business dashboard with a
    sidebar of nav pills, the title "Dashboard" (64 px), a line chart drawing itself left to right (B11), and table rows
    as skeleton bars. There are no values and no figures.
- **Techniques:** 29, 30, 33, 40, 23, B11.
- **Carries over:** the agent from the Operations panel; the window carries on the panel's upward speed.
- **Motion (4%):** streaming, the hand-off, the development, the chart drawing (about 5–8%).

**P16 · everything · 20.99–21.61 · key "everything" 20.99**
- **Visual event:**
  - In the pause 20.62–20.86 the dashboard shrinks into the cut (39: ease-in to −6% a frame, 9 f).
  - At the same shrink rate, easing out, it lands as the back card of a stack in the upper half. The stack is four
    cards fanned with 36 px lips, one for each answer, in their tints (pale-cool connection, pale-card workflow,
    pale-cyan agent, white dashboard): everything built so far.
  - On "everything" (20.96) the business's question returns from below in front of the stack (chat-scroll). It is the
    same grey bubble that left in P06, now centred at 64 px: "What if everything just worked together?".
  - A cyan underline sweeps under "everything" (B11, 8 f).
- **Techniques:** 39, 36 (lip stack), 33, one mark.
- **Carries over:** the dashboard (now in the stack); the question sent in P06.
- **Motion (4%):** the zoom through the cut, the stack settling, the bubble rising (about 6%).

**P17 · works together. · 21.61–22.75 · keys "works" 21.61, "together" 21.89**
- **Visual event:**
  - On "works" (21.58) the question rewrites itself:
    - "What if" and "just" collapse out (23 spacing collapse: their width closes to 0 in 6 f);
    - "worked" rolls to "works" ("ed" rolls out, "s" rolls in, 6 f);
    - "everything" capitalises;
    - the line re-centres in 5 f, its centre held (as in 27).
  - On "together" (21.86):
    - "?" rolls to ".";
    - the bubble's grey fill flips to cyan, and the cyan floods the frame as a circle growing out of the bubble (24 f,
      exponential);
    - the line scales from 64 to 104 px (B3), so it reads "Everything works together." in navy on the film's one full
      cyan field;
    - the stack behind is covered.
- **Techniques:** 23, 27 (the centre held while words leave), a field flood out of an object, B3.
- **Carries over:** the question, which becomes the answer.
- **Motion (4%):** the edit (about 2%), then the flood (15–40% for 20 f).

**P18 · We analyze your processes, · 22.75–24.37 · keys "analyze" 22.95, "processes" 23.47**
- **Visual event:**
  - In the pause 22.34–22.72 the cyan field contracts, its edges already moving (39 reversed), into a white status pill
    at x 960, y 230 (640×110). "Everything works together." exits upward (expo-in 8 f). The #F7F7F7 working ground is
    uncovered.
  - On "analyze" (22.92) the pill reads "Process audit" (grey 48 px, a cyan dot) with the shimmer passing.
  - Beneath it the business's processes rise as rows (35, 3 f): Intake calls, Approval flows, Data routing, Reporting,
    Onboarding (52 px rows, 900 px wide).
  - A pale cyan scan band steps down the rows (B13, 5 f a row).
  - On "processes" (23.44), as the band passes, two rows take a "Friction" tag (navy text on #EBECF4, cyan dot, 6 f):
    Approval flows and Data routing. The shimmer stops and a check replaces the pill's dot.
- **Techniques:** 39, 29, 35, B13/B17.
- **Carries over:** the cyan field, now the audit pill.
- **Motion (4%):** the contraction, the cascade, the stepping band (about 4–6%).

**P19 · build alongside your team, · 24.45–26.03 · keys "build" 24.45, "alongside" 24.75, "team" 25.39**
- **Visual event:**
  - On "build" (24.42) the "Approval flows" row lifts and widens into a build card (31, 14 f) while the other rows exit
    upward. Inside: "Request" → "Approval" → an empty dashed slot.
  - The K.B cursor (navy arrow, label pill "K.B" in navy on cyan) enters from the right edge already moving and
    decelerates onto the slot (14 f).
  - On its click (24.66) a step chip, the Make logo with "Automation", drops into the slot (20 px, 8 f).
  - On "alongside" (24.72) the "Your team" cursor enters from the left edge and settles beside the K.B cursor (B4): two
    cursors side by side over the same flow, in the open.
  - On "team" (25.36) "Your team" clicks the card's "Approve" button, and the status chip rolls "Draft" → "Approved"
    (A2 drop-through, 6 f).
- **Techniques:** 31, 37, B4, A2, 23.
- **Carries over:** the flagged row (the thread); the "Your team" cursor from P05–P09.
- **Motion (4%):** the card widening, rows leaving, the cursors travelling (about 3–5%).

**P20 · and keep your systems running. · 26.03–27.87 · keys "keep" 26.21, "systems" 26.61, "running" 27.05**
- **Visual event:**
  - On "keep" (26.18) the build card scrolls up to a lip, and a monitoring panel rises under it. Its header label is
    "UPTIME AND MONITORING" (30 px, 600, tracked, navy; K.B's Hosting plan).
  - On "systems" (26.58) four system rows land (35, 3 f). Each has its tint dot, its name (48 px) and a thin live trace
    running at a constant 3 px a frame (B10): "CRM ⟷ Support desk", "Follow-ups", "AI agent", "Dashboard". Statuses read
    "…".
  - On "running" (27.02) the statuses flip top to bottom, 3 f apart, to "Running" (grey to navy, cyan dot; a fade swap).
    The traces keep running.
- **Techniques:** 33, 35, B10, 23.
- **Carries over:** the four systems built in P10–P15, by their tints.
- **Motion (4%):** rows landing, four live traces (about 4–5%).

**P21 · No unnecessary · 27.87–28.89 · keys "No" 27.87, "unnecessary" 28.21**
- **Visual event:**
  - On "No" (27.84) the maintenance behind the systems unfolds below the panel, a row every 2 f, already moving (35).
    The rows are dense, 40 px and grey: SSL certificates, Security patches, Regular backups, Dependency updates,
    Reconnecting APIs, Monitoring and alerts. They are the complexity a system carries.
  - On "unnecessary" (28.18) each row takes a small navy "K.B" chip at its right end, top to bottom, 3 f apart: handled.
- **Techniques:** 35.
- **Carries over:** the monitoring panel and its running traces.
- **Motion (4%):** the cascade, the chips, the traces (about 5%).

**P22 · complexity. · 28.89–29.79 · key "complexity" 28.89**
- **Visual event:**
  - On "complexity" (28.86) the maintenance rows fold away behind the panel, back to front. They peel up under its lower
    edge on staggered expo-ins (16 f): out of your sight.
  - In the pause 29.57–29.91 the panel collapses (31). Its header and four rows merge, their heights closing into one
    line, and the line's ends draw in to a pill.
- **Techniques:** 35 (peel off back to front), 31.
- **Carries over:** the panel, which becomes the pill.
- **Motion (4%):** the fold and the collapse (about 6%).

**P23 · Just technology · 29.93–30.86 · key "Just" 29.93**
- **Visual event:**
  - On "Just" (29.90) the collapse lands: one white pill alone at the frame centre (720×150, soft shadow), with a cyan
    dot and "Running" (72 px, 600, ink).
  - The ground turns white as a circle grows out of the pill (20 f).
  - Nothing else is on screen.
- **Techniques:** 31, a mask out of an object.
- **Carries over:** the monitoring panel, now one pill.
- **Motion (4%):** the landing and the mask (about 5% for 15 f), then the film's one deliberate breath.

**P24 · that works the way you do. · 30.86–32.48 · keys "works" 31.04, "way" 31.44, "do" 31.78**
- **Visual event:**
  - On "works" (31.01) the pill makes room. Its text blur-swaps to "Works with Slack", and the pill widens to fit (31,
    9 f).
  - On "way" (31.41) the name swaps to "Notion".
  - On "do" (31.75) it swaps to "Google Workspace" and holds.
  - These are the tools that rolled as chaos in the hook, now landing one at a time, each a place your system works.
- **Techniques:** 22, 23, 31.
- **Carries over:** the pill; the tool names from P02–P04 (a callback).
- **Motion (4%):** the swaps and the width easing (about 2–3%).

**P25 · Less manual work. · 32.48–33.84 · keys "Less" 32.48, "manual" 32.74, "work" 33.16**
- **Visual event:**
  - In the pause 32.04–32.39 the pill opens downward into a card (31, 14 f). Its text blur-swaps to "Manual work" (K.B:
    "eliminate manual work"), now the header at 64 px, 700.
  - The hook's task pills rise into the card (35, 3 f): Follow-ups, CRM updates, Payment confirmations, Excel files,
    Outreach. The pale-cool field grows out of the card.
  - On "Less" (32.45) the top task's checkbox fills (navy, white check, 4 f) and the row folds away (height to 0, 8 f,
    the rows below closing up). The next row follows 5 f later.
  - On "manual" the third goes; by "work" (33.16) the last. The list is empty.
- **Techniques:** 31, 35, B13, the 29 collapse per row.
- **Carries over:** the pill (header); the hook's tasks (the thread's pay-off).
- **Motion (4%):** the card opening, the cascade, the rows checking and folding (about 5–7%).

**P26 · More time to grow. · 33.84–35.18 · keys "time" 34.08, "grow" 34.44**
- **Visual event:**
  - On "time" (34.05) the empty card's header swaps "Manual work" → "Time to grow" (23 spacing collapse, 6 f, left edge
    pinned).
  - On "grow" (34.41) the empty card grows. Its body opens up and down by 280 px (B3, soft start and long settle, 22 f):
    the room the tasks used to take.
  - In the pause 34.75–35.14 the card leaves upward (expo-in 9 f).
- **Techniques:** 23, B3, 33.
- **Carries over:** the emptied card.
- **Motion (4%):** the swap, the growth, the exit (about 3–5%).

**P27 · K.B. · 35.18–36.08 · key "K.B" 35.18**
- **Visual event:**
  - The K.B tile (240 px, navy gradient, white Copperplate "K.B") rises in from below at the exit's speed. It
    decelerates (×0.85 a frame, 22 f, no overshoot) to x 960, y 430 and lands on "K.B" (35.15).
  - The field is white. The camera breath eases to rest.
- **Techniques:** the entrance pattern; 50's exponential landing without its slide or turn.
- **Carries over:** the send tile from P06, the mark that sent the question.
- **Motion (4%):** the arrival only. This is the sign-off, the calmest moment.

**P28 · Your tech team, · 36.08–37.24 · keys "tech" 36.32, "team" 36.56**
- **Visual event:** words pop on whole at their final, centred positions under the tile, at y 690 (Montserrat 700, 84 px,
  ink): "Your" 36.05, "tech" 36.29, "team," 36.53. The line is laid out from the start, so nothing slides or re-centres.
  The wake sits behind the newest word.
- **Techniques:** 21 (pop on whole, no glide), 24.
- **Carries over:** the tile.
- **Motion (4%):** the pops (the measure skips the last 2 s).

**P29 · without the hiring. · 37.24–38.26 · keys "without" 37.24, "hiring" 37.66**
- **Visual event:** the second line pops on at y 800: "without" 37.21, "the" 37.53, "hiring." 37.63. The lockup then holds
  to 40.0 and nothing else moves: the logo and the words, as Karl asked.
- **Techniques:** 21.
- **Carries over:** the tile and line 1.
- **Motion (4%):** none (the end card).

## Continuity: every exit names its entrance

1. caret → words pop → the slot of tool names → "tools." → the task feed and the tool chips, joined by dashed links
2. → the composer rises over the feed (the feed blurs) → the typed question → the cursor presses the send tile
3. → the question rises out; the composer collapses into the tile → the tile grows into the K.B mark; a white field
   grows from it
4. → tile → nav pill → hover makes room (Tech Partner) → click opens the pill into a card → your tasks rise in; the
   outline is fitted to them
5. → the first task lifts out → the connection → scrolls to a lip; a request rises → the answer card lands → the lips
   gather into a deck → the deck flattens into "Operations"
6. → the row opens into the agent panel → the shimmer grows into the reply → the panel scrolls out; the software window
   rises
7. → it shrinks into the stack → the question returns in front → rewrites itself → cyan floods out of the bubble
8. → the cyan contracts into the audit pill → rows scanned, friction tagged → the flagged row widens into the build card
   → the cursors build and approve
9. → the card scrolls up; the monitoring panel rises → maintenance unfolds and folds → the panel collapses into the pill
   → the pill swaps through your tools
10. → the pill opens into "Manual work" → the tasks check off → the header swaps; the card grows → the card leaves
    upward; the K.B tile rises → the words

Direction: everything moves upward. The only horizontal moves are lines drawing left to right, the shimmer, the
travelling capsules, the cursors, and the pill making room. Nothing with text on it drifts sideways.

## The 4% plan

**Where the motion comes from.** The median should come from content in motion:
- a feed of tasks streaming (P04, and blurred behind P05);
- the slot rolling (P02);
- cascades of rows landing (P09, P18, P20, P21, P25);
- runs looping and capsules syncing (P10, P11);
- streams, typing and live traces (P05, P15, P20);
- containers opening and collapsing (P09, P13, P14, P22);
- field masks growing out of objects, with the cyan flood and contraction the biggest (P17–P18);
- the chat-scroll hand-offs in the pauses.

The camera breath is held under the probe's threshold (see Motion identity), so it adds nothing. Check it by rendering
the draft once with the breath switched off: the median must hold.

**Projected:** about 55–60% of frames carry a stream, a cascade, a hand-off or a field mask. The projected median is about
4–5%. These are estimates from the plan, to be verified with `motion_check.py --profile` on the first draft.

**Planned quiet stretches** (the rhythm, not dead air):
- the open (0–1.7 s);
- the name hold (8.8–9.3 s);
- the nav hover (9.7–11.1 s);
- "Just technology" (30.0–31.0 s);
- the sign-off.

Every one of them still brings a new visual on its key word. The longest voice without a new visual is planned at about
0.7 s (the name hold).

## Risks: the three moments most likely to be busy or static

**1. P04, "hundreds of tasks connecting them": busy.** Pills stream, tool chips arrive and lines draw, all at once, in the
film's densest frame. How it is avoided:
- One direction of motion (up), no camera, one readable item: the newest pill at the bottom, in ink. Everything above it
  greys to 40% and softens.
- The tool chips are small (36 px) and grey. The dashed lines are grey and draw only once, on "connecting".
- The density is the point (overload), and it is cut clean in the next pause by one white composer rising over it.

**2. P20–P22, monitoring, maintenance unfolding, and the fold: busy.** Four live traces, status flips, six maintenance rows
and their chips are all in one panel. How it is avoided:
- The traces are hairlines in grey, and only the status words change to navy.
- The maintenance rows arrive only on "No", the chips only on "unnecessary", and everything folds on "complexity". One
  event per word, never two moving things that compete.
- The panel then collapses to a single pill, so the busiest moment hands straight over to the emptiest.

**3. P23–P24, "Just technology that works the way you do": static.** One pill alone for about 1.1 s, then three word
swaps. How it is avoided:
- The pill lands on "Just" out of a full collapse in the pause, and a white field grows out of it. That is the
  phrase's event and a large change.
- The swaps land on the stressed words ("works", "way", "do"). The pill eases to each name's width (9 f), so the frame
  keeps working without drift.
- The stillness here is deliberate: the one breath before the payoff, where "just" means just this.

**Also watched:**
- **P15 agent → software hand-off.** It happens mid-phrase, on the function word "to" (19.42–19.58, only 0.12 s of
  gap). It is kept to an 8 f exit and a cut on the fastest frame, so it crosses "to" and lands settled for "custom".
- **P06–P08 name section.** It is quiet by design. The name holds only while it is spoken, and the hover gives the
  next two phrases their events.
- **Reused words.** The prior film ringed "Follow-ups", "CRM updates" and "Excel files" as labels. The words come back
  here (they are K.B's own), but as a streaming list, not as labels on footage. The strategy is different.

## Copy sources (everything on screen)

| On screen | Source |
|---|---|
| "How can we help?" | [K] contact page heading |
| Follow-ups, CRM updates, Payment confirmations, Outreach | [C1] challenge: "candidate follow-ups, payment confirmations, company outreach, and CRM updates" |
| Excel files, Scattered submissions | [C2] "complex Excel files, manual follow-ups, and scattered submissions" |
| Intake calls | [C3] "AI transcription of intake calls" |
| Slack, Notion, Airtable, ClickUp, Google Workspace | [K] FAQ integrations |
| Odoo | [H] "Tools we build with" |
| K.B Tech Partner | [H] nav pill on hover |
| CRM, Support desk, Connected | [SA] "linking a CRM to your support desk"; the VO's "Connect" |
| Data (the capsule) | [SA] "syncing data across platforms" |
| Scheduled task, Conditional logic, Data routing, Approval flows | [SA] "data routing and approval flows to scheduled tasks and conditional logic" |
| n8n and Make logos | [SA]/[H] tools ("Use of tools like Make and n8n") |
| AI agent, Working in the background | [H] "Custom AI Agents"; [SA] "designed to work reliably in the background" |
| CRM updated · Follow-ups sent | [C3] "CRM auto-updates"; [C1] follow-ups (illustrative) |
| Dashboard | [H] "Custom business dashboards" |
| Process audit, Friction | [C1]/[C3]/[K] "process audit"; [H] Diagnose "find where the friction is" |
| Reporting, Onboarding | [C2] "Filtering and reporting overview"; [C1] "Training & onboarding" |
| Draft, Approve, Approved | generic interface words, with [H] Build: "with your team, in the open" |
| UPTIME AND MONITORING, Running | [H] Hosting plan; the VO's "running" |
| SSL certificates, Security patches, Regular backups, Dependency updates, Reconnecting APIs, Monitoring and alerts | [H] Hosting and Maintenance plans |
| Manual work | [H] "Connecting tools to eliminate manual work" |
| Everything works together., Time to grow, Your tech team, without the hiring. | the voice-over |

No figures. No client names or logos. Never "Consultancy", never the domain.

## Build notes (Remotion, one person, one day)

**Shared components:**
- `Field`: a background colour with circle masks via `clip-path`.
- `Thread`: the column's y position, as a sum of exponential steps, one per state.
- `Pill` and `Card`: animated width, height and radius, for making room, opening and collapsing.
- `Words`: absolutely placed words that pop on, with the wake rect.
- `Typed`: an eased character count with a caret.
- `Stream`: a word count with the head dot.
- `Shimmer`: a gradient band clipped to the text, moving linearly.
- `Slot`: a vertical roll, a blur swap or a spacing collapse.
- `Cursor`: a B4 spring path, a press, and a label.
- `Trace`: an SVG path drawn with `strokeDashoffset`.
- `Feed`: rows at `y = base − speed · t`.

**Curve helpers:** `arrive(f, n)` = (1 − 0.8^f) / (1 − 0.8^n); `depart(f, n)` = (1.3^f − 1) / (1.3^n − 1); B1 via
`Easing.bezier(.65,0,.35,1)`.

**Assets:** Montserrat variable (`assets/fonts`), Copperplate CC Heavy, `assets/logo/kb-logo-tile.svg`,
`assets/tools/n8n.png`, `assets/tools/make.png`.

**Scope:** about 25 states, each 20–60 lines on the shared parts.

**Check:** text transitions at 2-frame steps. Then `motion_check.py`, `motion_probe.py --style calm`, `busy_check.py`,
`phrase_check.py` and `film_tells.py` on the draft.
