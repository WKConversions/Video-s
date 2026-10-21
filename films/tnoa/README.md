# TNOA (The Network of Agents): 20 s brand film, no voice-over (16:9, 60 fps)

A 20-second, music-only film for thenetworkofagents.com in Apple-style motion (spring physics with bounce, morphs, a
notification stack, a bento grid, a liquid join), in TNOA's own brand, taken from the site's CSS: navy #0B1220,
blue #2563EB, sky #1DA1F2, soft background #F4F7FB, hairline #E2E8F1, green #34D399 and amber #FBBF24 for status.
The site sets the system sans; DM Sans stands in for it.

## The film (all copy from the site)
- 0–4.5 s: a network forms: a blue hub pops, twelve agents spring out on two rings, pulses run along the spokes;
  "The Network of Agents" bounces in letter by letter.
- 3.5–9.3 s: the hub grows into the live "tnoa ~ agent activity" panel; the four example tasks from the site stack in
  like notifications (three resolved, one sent to human review).
- 8.6–13.2 s: a bento of the site's three activity numbers rolls in: 312 leads handled today, 96.8% resolved without
  escalation, 2m 41s average response time. (On the site these illustrate agent activity reporting.)
- 12.7–16.9 s: an agent and an engineer slide together and join like liquid: "Proven agents. Accountable engineers."
- 16.2–20 s: navy floods in; "TNOA." lands; a capsule springs open into "Book a Call — Free Audit"; the URL.

## Sources
- **Music:** "Take this Higher" by Michael Ramir C. (Mixkit Stock Music Free License), the first 20 s with a fade.
- **Font:** DM Sans (OFL).

## Build
```
cd film && npx tsc --noEmit
bash ../../creoble4/scripts/render_chunks.sh Film out/raw.mp4 '{"blurSamples":1,"audio":"none"}' 0,240,480,720,960,1200 ../sound/music.wav
```
The composition is `src/Story.tsx` (one file, its own springs) and `src/lib.tsx` (font loading).
