# Digital Marketing Málaga: community film (36.4 s, English, 1920×1080, 60 fps)

For digitalmarketingmalaga.com, on Karl's script and the ElevenLabs voice-over ("Christina", 34.2 s, placed at 0.4 s).
Karl's brief: no still frames, overlapping animations and transitions (constant motion), built from the site's own
visual language, not just its assets.

## The film
The logo's cyan wave mark is the thread: it draws itself on their live topographic map, links two people, snaps and
knots on "finding your people isn't always easy" (the contours crowd into a wall), unwinds into the serif logotype,
strings the hero's photo cards on "a global community", pins Málaga, opens their white events page (their real banners
flipping, the date rolling in the site's "2026-10-15 19:00:00" style, the venue underlined), splits the event photo into
the speakers, becomes the speech bubble and the fork to the member perks ("Exclusive training", "Job offers",
"WhatsApp group"), docks as the header of a chat in their brand ("About 240 active members"), zooms through into the
map, climbs a staircase of their pills (career), grows taller humps (business), flares among event moments
(inspiration), folds into a door that opens onto their cyan, and condenses into JOIN US and the logo.

## Build
- **Plan:** `plan/storyboard-wave.json` and `plan/storyboard-topo.json` (two drafts from a storyboard panel), merged
  into `plan/contract.md` (times, hand-offs, ownership, rules).
- **Kit:** `film/src/kit.tsx`, `film/src/topo.ts` (the live contour field: summits, ripples, ridges, reveal, ring),
  `film/src/spine.tsx` (colour field charcoal / white / charcoal + contour lines), `film/src/handoff.ts`.
- **Scenes:** S1–S3 (builder B1), S4–S5 (B2), S6–S7 (B3), S8–S9 (B4), S10–S12 (lead), in `film/src/scenes/`.
- **Checks:** `film/check.sh <id> <t0> <t1>` (one builder's window), `film/film_check.sh` (whole film at 540p with sheets).
- **Sound:** `sound/make_cues.py` → `sound_mix.py`; effects `films/alumni/sound/lib`; bed Mixkit "Tech House vibes"
  (no credit needed), fitted with `music_fit.py` (lift on "Meet").

## Numbers
- Final (1080p): motion median 6.8%, moving in 100% of frames, end card moving to the last frame. Shake check: four
  borderline flags (exactly the 3-jump threshold, 1.3–2.3 px) at 12.6, 13.9 (the rolling date), 22.2 and 25.8 s.
- On screen only facts from the site (facts.md) and the script.

## Deliverables
- `deliver/digital-marketing-malaga-36s-1080p60.mp4` (final), `deliver/dmm-preview-540p60.mp4` (preview).
