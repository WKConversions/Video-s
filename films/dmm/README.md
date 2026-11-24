# Digital Marketing Málaga: community film (v2 39.6 s, English, 1920×1080, 60 fps)

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

## v2: the client's feedback (Nov 2026)
- "A tiiiiny bit fast": the whole film runs at 92% (`SPEED` in `film/src/kit.tsx`; story time = film time × 0.92).
  The VO is slowed with ffmpeg atempo 0.92, pitch kept (`vo/vo-92.wav`), so every word still lands on its picture;
  `make_cues.py` scales the cues; the bed is refitted to 39.57 s (lift on "Meet" at 7.0 s).
- "Swap this guy": Charlie Titherley is out. The third banner in S6 is now their "How to win in Reddit marketing
  fireside chat" (Belinda Conde, Pablo García, Alexandra M. Sims), rebuilt at face size (`scenes/b3-reddit.tsx`) because
  the site only has a 697-px PNG; Belinda replaces Charlie in the S7 trio and the S8 stack. Her photo is cut from that
  banner (135 px on the site), so her card is soft: a high-res photo from the client is a one-file swap
  (`public/img/speaker-belinda.jpg`, 465×675).
- "Remove the coworking names": the roller under the event card reads "Málaga" (it was Impact Hub Perchel / Momentum
  Coworking); the Where line and address are painted out of the Tatiana and Yago banners (originals in
  `harvest/banner-*-film-v1.png`); the Reddit rebuild has none. Event photos showing a venue's lettering or a slide
  naming one ("Codespace") are not used.
- "A wider variety of photos": the hero cards (S4/S5) and the inspiration trio (S10) use six new photos from their
  event pages (`event-stone`, `-terrace`, `-pyramid`, `-brick`, `-stone2`, `-speaker`); the cathedral, the two people
  of the bookend and the event/group photos stay.

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
- v2 final (1080p): moving in 99% of frames, motion median 6.4% (slower pace), end card moving to the last frame.
  Shake check: two larger flags that are not shake: 11.5 s (the headline word roll) and 37.8 s (faint contour lines
  morphing on the end card; the tile's frame difference is smooth, the meter misreads the stripes); four borderline
  1.4–1.5 px flags as in v1. Mix: 111 effects, -15.1 LUFS, peak -1.5 dBFS.
- v1 final (1080p): motion median 6.8%, moving in 100% of frames, end card moving to the last frame. Shake check: four
  borderline flags (exactly the 3-jump threshold, 1.3–2.3 px) at 12.6, 13.9 (the rolling date), 22.2 and 25.8 s.
- On screen only facts from the site (facts.md) and the script.

## Deliverables
- `deliver/digital-marketing-malaga-v2-40s-1080p60.mp4` (v2 final), `deliver/dmm-preview-540p60.mp4` (v2 preview),
  `deliver/digital-marketing-malaga-36s-1080p60.mp4` (v1, as first delivered).
