# Production plan: ClearScaler, "Your market, worked for you" (40 s, silent)

## Project direction
- PURPOSE: show what the GTM platform is and does for the viewer, muted, on the site and LinkedIn.
- AUDIENCE: founders and commercial leads of B2B companies whose sales depend on the founder.
- FORMAT: 16:9, 1920×1080, 30 fps, 40.0 s (1200 frames). No audio (brief). Art direction from Karl's reference (references/reference.md); round-1 review decisions in frames.json → revisions.
- CORE MESSAGE: ClearScaler finds the buyers who fit, writes to each one, and books the meetings into your calendar; you
  approve and take the calls.
- TONE: confident, precise, dry; "confident and clear" timing row: middle durations, ease-outs, no overshoot, the camera
  only breathes.
- STYLE AND BRAND: ClearScaler's dark site (brand.json): night #07080C, surfaces #101012/#19191B/#232426, ink #EDEFF3,
  ink-2 #B0B1B3, ink-3 #8E8F91, orange #FC7F48, success #4BC680; Outfit 600 (−0.045em) for captions and numbers, Manrope for
  UI, Geist Mono for labels and URLs; radii 14 (cards), 999 (pills); the ∞ mark.
- ART DIRECTION (from Karl's reference, references/reference.md): one dark isometric world that models the domain. Here
  the domain is the viewer's market: an isometric map of accounts (dark extruded blocks, top faces a shade lighter,
  hairline edges, faint large ground outlines), streets between them, the viewer's own company as one block at the front.
  The product's work happens ON the map: a scan that researches, blocks that rise or sink with their score, orange dots
  that travel the streets to one person at a time, green dots that come back. The GTM app appears as a status chip (the
  lead row) top left and as cards tethered to the block they belong to. Captions bottom left, built word by word (grey →
  white), the key word in orange. Mixed media: none (no photos except the founders' avatars on the end card).
- MOTION PERSONALITY: precise premium. Signature curve: the site's emphasis ease cubic-bezier(.16,1,.3,1) for arrivals;
  the site's ease-out (.2,.7,.2,1) for UI responses; DEPART for exits; MOVE (.65,0,.35,1) for reframes. Duration palette:
  quick 7, standard 14, slow 27 frames (the site's .24/.48/.9 s). Entrance pattern: out of the ground (blocks rise), out of
  the block they belong to (cards and pins), word builds for type.
- CAMERA: one slow breath for the film (Film.tsx `breathe`), plus the world's own slow orbit (azimuth 41° → 49° over the
  film, content not camera). No pans or zooms on transitions; the pull-back at 28 s scales the world (content), eased.
- TRANSITION FAMILY: (1) out of an object: cards unfold from their block and fold back into it; (2) layout transformation:
  score bars slide into one bar, the score card becomes the email; (3) object becomes the next thing: the email folds into
  the orange dot that travels, the reply dot drops into the calendar slot, the 8 turns into the ∞ logo.
- VOICE-OVER AND MUSIC: none. On-screen captions are the narration, timed for reading (≈3.5 words/s + 0.4 s).

## Phrases (captions) and visual events (v2, after the art-director pass)
Times in seconds. Every caption is ClearScaler's own copy (facts.md); key word in **bold** turns orange. Captions build word
by word at 0.12 s a word, 68 px, bottom left; a hedge rides as the caption's second line.

| # | Time | Caption | Visual events (on the word) | Source |
|---|---|---|---|---|
| 1 | 0.35–2.1 | Your **offer** isn't the problem. | 0.0 an orange comet draws ClearScaler's ∞ loop on the ground around the viewer's block (the site's hero); the market rises in a wave; 0.47 on "offer" the viewer's block lights and its tag rises; 1.2 the loop settles to a hairline | About page |
| 2 | 2.45–4.3 | Your **distribution** is. | 2.57 the light contracts to a ring (330 units); 2.8–4.2 five grey emails by hand reach the nearest accounts and stop at its edge; the ring's dashes crawl | About page |
| 3 | 4.7–7.0 | ClearScaler researches **every account.** | 4.8 the ring turns orange and sweeps the market while a comet laps the loop; blocks fill with data dots; 5.0 the chip arrives, its count rolls to the demo's 1,284 | home |
| 4 | 7.3–10.3 | Every contact scored against your **rubric.** | 7.5 fits rise with an orange edge, poor fits sink; 8.0 "On hold · nothing is sent" on a sunk block (leader); 8.7 chip: Sofia Berglund · Scoring; 8.9 the card unfolds from Fernhollow's pin; 9.2 five rubric rows fill (site colours); 10.0 rows clear, bars join into one on 0–135 past the 60 tick; 87 rolls up | home, GTM Engine demo |
| 5 | 10.6–12.3 | With the **reason** written down. | 10.85 "Job post · Hiring two pricing analysts" flies out of the block into the card; 11.35 "Website watch · Rates page unchanged since March 2025" | home, GTM Engine demo |
| 6 | 12.6–16.9 | Written **per person.** | 12.6 score parts leave; the card widens to the close framing; the reasons move aside then up; 13.2 Subject "Last year's lanes" · Edited by our team; 13.6 the generic line types; 14.4 struck through; 14.7 the personal sentence writes in, underlined; 15.85 the ask and "Anna"; 15.9 chip: Quality check | home, GTM Engine demo |
| 7 | 17.25–18.9 | **Approved** by you, / in the early months. | 16.4 approval bar (Rewrite · Reject · Approve & send); 16.7 cursor; 17.3 click: the button rolls to a neutral Approved, "Sent from your mailbox" | home (hedge kept) |
| 8 | 19.2–22.0 | One person **at a time.** | 18.3 the draft scales into the route's start and becomes the orange dot (18.85); the fits' orange steps back; 19.95 Fernhollow lifts as it lands ("Sofia Berglund · Fernhollow Freight"); 20.3 the next emails, one at a time; 20.85 "Marta Vogel · Quillmoor Group" | home hero |
| 9 | 22.3–24.9 | Every reply **classified.** | 22.2 green dots come back on the same streets; 23.1 chip stacks Marta (Interested) above Sofia (In outreach); tags Interested / Not now / Out of office | home, GTM Engine demo |
| 10 | 25.2–27.9 | Booked into your **calendar.** | 24.3 Marta's reply grows out of Quillmoor ("Good timing. Thursday works."); 24.9 suggested reply · edit anything before sending; 26.0 the reply folds back, the week unfolds from your block; 26.3 "Thursday at 10:00" flies and lands on the slot; 26.75 Meeting booked · Thu 10:00 | home, GTM Engine demo |
| 11 | 28.3–31.0 | **One loop,** run every weekday. | 27.9 the week folds into your block; 28.0 the market eases back 18%; emails go out across it, about one in eight replies; 29.4 the loop lights: "Be seen" orange, "Be chosen" green, comets on both lobes | GTM Engine page |
| 12 | 31.2–34.6 | (none: the number is the subject) | 31.2 the market steps back; the loop lifts off and stands upright as the 8; 32.2 %; 32.5 "reply rate, first month of sending"; 32.8 "Real · anonymised" + client type, measure, window, source | home, results |
| 13 | 34.6–40.0 | Your distribution, **fixed.** | 34.6 % and label leave; the 8 turns into the white ∞ in the lockup; 35.4 the wordmark slides out, one orange comet laps the mark; 36.0 the line; 36.7 "Outbound, built and run for you."; 37.2 Book a call; 37.5 Magnus and Kian, "30 minutes with Magnus or Kian" | home hero, GTM nav, CTA |

Longest stretch without a new visual (measured on the draft): 0.0 s; 11 of 11 phrases bring a new visual.

## Variety and continuity
| Beat | Strategy | Primary element | Framing | Density | Exit (what it grows out of / into) |
|---|---|---|---|---|---|
| 1–2 | spatial relationship (reach as a ring) | your block and its ring | wide map | sparse → dark | the ring becomes the scan |
| 3 | pattern/system (the scan) | the wave over the market | wide | rising | the wave hands over to the scoring |
| 4–6 | quantity made physical, then UI | the score bar / 87 | medium: one block + card | medium | the card becomes the email |
| 7–8 | UI demonstration, cause → effect | the email, the approve click | close: the card | dense, one thing | the email folds into the dot |
| 9 | path / one person at a time | the travelling dot | wide map | sparse → many | the dots come back green |
| 10–11 | before/after on the same paths, UI | the reply, the calendar slot | medium | medium | the week folds into your block |
| 12 | scale-out | the whole market | widest | dense, small | the market dims back |
| 13 | number filling the frame | 8% | type, full frame | single | the 8 turns into the ∞ |
| 14 | logo and CTA | the lockup, the button | centred (the one centred scene) | sparse | end |

Three distances (wide map, medium block + card, close card), one centred scene, card layouts in two non-adjacent
stretches, the primary kind changes every beat.

## Rules for the build
- Captions: Outfit 600, 68 px, −0.03em, bottom left at x 120, bottom 108; words arrive at 30% ink and brighten over 7 frames, 0.12 s apart; the key word turns orange; a hedge rides as a 46 px ink-2 second line; the outgoing caption leaves before the next builds.
  over 6 frames, 0.13 s apart; the key word turns orange as it brightens; the outgoing caption dims and leaves upward in
  9 frames before the next builds. Two lines never overlap.
- Chip: top left (110, 86), 720 px; lowercase URL pill 22 px, "Demo workspace" 24 px, name 40 px, role 28 px, status pill 32 px; it steps back to 62% while a card carries the beat; from 23.1 s it holds two leads.
  status pill 30 px with the app's dot colours (orange dot = working, green = replied/booked, outline = on hold).
- Cards: night-1 #101012 with the site float shadow, radius 20; text read in a card is 32–44 px; every product panel carries "Demo workspace".
- Nothing bounces; every arrival on the signature curve; exits on DEPART at 70% of the entrance.
- Every number and name on screen is in facts.md; the chip says "Demo workspace" whenever demo data is visible.
