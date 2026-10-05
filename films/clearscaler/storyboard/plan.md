# Production plan: ClearScaler, "Your market, worked for you" (40 s, silent)

## Project direction
- PURPOSE: show what the GTM platform is and does for the viewer, muted, on the site and LinkedIn.
- AUDIENCE: founders and commercial leads of B2B companies whose sales depend on the founder.
- FORMAT: 16:9, 1920×1080, 30 fps, 40.0 s (1200 frames). No audio (brief).
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

## Phrases (captions) and visual events
Times in seconds. Every caption is from the site (facts.md) unless marked; key word in **bold** turns orange.

| # | Time | Caption (bottom left) | Visual events (on the word) | Source |
|---|---|---|---|---|
| 1 | 0.4–3.2 | Most companies don't have an **offer** problem. | 0.0 ground outlines draw out from the front; 0.2–2.2 the market rises block by block in a wave from the front; 1.1 on "offer" the viewer's block lights (warm edge) and its tag "Your company" rises | Magnus, home/about |
| 2 | 3.4–5.6 | They have a **reach** problem. | 3.8 on "reach" a dashed ring spreads from your block and stops after two streets: only the three nearest blocks catch its light; the market beyond stays dark | Magnus |
| 3 | 5.9–8.5 | ClearScaler researches **every account.** | 6.0 the ring turns orange and sweeps out across the whole market; every block it passes fills with rows of data dots; 6.3 the chip arrives top left (gtm.clearscaler.com/leads · Demo workspace) and its lead count rolls 0 → 1,284 with the wave | home ("Every account researched") |
| 4 | 8.8–11.0 | Every contact scored against your **rubric.** | 9.0 the blocks answer the score: fits rise and take an orange top edge, poor fits sink and grey out (On hold, nothing is sent); 10.2 the chip becomes Sofia Berglund · Fernhollow Freight · Scoring; 10.4 Fernhollow's block lifts, a pin rises, the score card unfolds out of it | home, engine |
| 5 | 10.6–12.4 | (caption 4 holds) | 10.7 five rubric bars fill (Structural fit 24/30, Pain signals 36/50, Timing signals 14/20, Commercial pressure 8/20, Buying committee 5/15); 11.6 they slide end to end into one bar on 0–135 that crosses the 60 tick; 87 rolls up; chip: Scored 87 / 135 · Strong fit | engine demo |
| 6 | 12.6–14.2 | With the **reason** written down. | 12.8 "Job post · Hiring two pricing analysts" types into the card; 13.4 "Website watch · Rates page unchanged since March 2025" | home, engine demo |
| 7 | 14.5–17.4 | Written **per person.** | 14.5 the score card turns into the draft (the two signals dock as the email's source); To sofia.berglund@…, Subject Last year's lanes; 15.2 the generic line types; 16.0 an orange strike crosses it; 16.3 the personal sentence writes in, its two signal phrases underlined; chip: Writing email | home, engine demo |
| 8 | 17.6–19.2 | **Approved** by you. (in the early months) | 17.7 the approval bar rises (This email is waiting for your approval · Approve & send); 18.0 the cursor enters, 18.6 clicks; the button rolls to a green Approved stamp; chip: Awaiting approval → Approved | home |
| 9 | 19.4–22.6 | One person **at a time.** | 19.3 the draft folds on its centre line into an orange dot at your block; 19.6–20.8 it travels the streets to Fernhollow, whose block takes an orange pin; chip: In outreach · Sent from your mailbox; 21.0–22.5 more dots leave one after another, each to a different block that fits | home hero |
| 10 | 22.9–25.0 | Every reply **classified.** | 23.0 green dots come back from three blocks; tags rise above them: Interested (Quillmoor Group), Not now (Brightwick Systems), Out of office (Larkspan Analytics); 24.0 the chip becomes Marta Vogel · Quillmoor Group · Interested; Marta's reply rises: "Good timing. Thursday works." | home, engine demo |
| 11 | 25.3–27.8 | Booked into your **calendar.** | 25.3 the suggested answer writes under the reply (Great, Marta. I will send an invite for Thursday at 10:00.); 26.1 a week (Mon–Fri) unfolds out of your block; 26.7 the green dot drops into Thursday 10:00 and becomes "Meeting booked · Thu 10:00 · Marta Vogel"; chip: Meeting booked · Thu 10:00 | home, engine demo |
| 12 | 28.2–30.6 | Run for you, **every week.** | 28.0 the week folds back into your block; 28.3–29.9 the market pulls back (world scale 1 → 0.5) and grows at its edges; orange dots leave and green dots come back across it, several at once; the chip turns into the Monday summary (3 meetings booked) | logistics page; engine demo |
| 13 | 31.0–34.0 | (no caption: the number is the subject) | 30.9 the market dims and sinks back; "8%" builds big at the left, its 8 drawn as the ∞ mark stood upright; "reply rate, first month of sending"; source line "Real · anonymised · Replies over 300 contacts · 12 Aug to 12 Sep 2026" | home, results |
| 14 | 34.2–40.0 | Your distribution, **fixed.** | 34.2 the % and the label leave; the 8 turns −90° into the ∞ mark, which moves into the lockup; 35.0 the ClearScaler wordmark slides out from behind it; 35.8 the line builds; 36.9 the orange Book a call button rises; 37.2 Magnus's and Kian's avatars and "30 minutes with Magnus or Kian"; one slow push to the end | home hero, CTA |

Longest stretch without a new visual: ≈1.2 s (9.9–11.0 is filled by the rubric bars). Thirteen captions, 14 beats.

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
- Captions: Outfit 600, 60 px, −0.03em, bottom left at x 120, baseline 960; words arrive at 35% ink and brighten to ink
  over 6 frames, 0.13 s apart; the key word turns orange as it brightens; the outgoing caption dims and leaves upward in
  9 frames before the next builds. Two lines never overlap.
- Chip: top left at (120, 96), 620 px wide; mono URL row 22 px (texture), name 34 px Manrope 600, title 26 px ink-2,
  status pill 30 px with the app's dot colours (orange dot = working, green = replied/booked, outline = on hold).
- Cards: night-1 #101012 with the site's float shadow and 1 px rule, radius 14; text ≥ 32 px for anything read.
- Nothing bounces; every arrival on the signature curve; exits on DEPART at 70% of the entrance.
- Every number and name on screen is in facts.md; the chip says "Demo workspace" whenever demo data is visible.
