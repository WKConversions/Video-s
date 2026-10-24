# Fieldnote: 12 s looping product explainer (1080p, 60 fps)

Made from the client's site (`harvest/site`: Fieldnote, "Work that moves", field service operations), in its own
brand: cream #fffaf2, ink #20232b, coral, blue, mint and yellow, Space Grotesk and DM Sans.

- **The work order:** WO-1042 moves through the site's three moves, 4 s each, in one app card with Apple springs:
  - **Capture on site:** photos pop in, the checklist ticks, a note types.
  - **Make it actionable:** tasks slide in with owners and due dates ("No re-entry").
  - **Close the loop:** the route draws with the van moving along it; crew aligned, customer notified, work order
    closed.
- **The day:** the day's visits stream underneath in two lanes, exactly periodic over 12 s.
- **Loop:** each beat starts from an empty card body and ends on one, so the last frame flows into the first.
  Seam diff 2.0 against a typical frame step of 1.9.
- **Motion:** median 3.1% at 1080p (3.3% at 540p), moving in 100% of frames.
- **Sound:** 35 effects from the alumni library (`sound/cues.json`), repeating every 4 s.
- **Deliverable:** `deliver/fieldnote-loop-12s-1080p60.mp4`.
