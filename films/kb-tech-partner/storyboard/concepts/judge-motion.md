# Judge: motion and feasibility

**Measured on real assets** (`scratchpad/judge/m*.py`). `motion_check` samples about 2×2 pixels per 12 px cell (INTER_LINEAR) and includes the end card. Flat shapes barely count; moving texture, and any tint more than 6 levels off its background, does.

| Content | Changed |
|---|---|
| 7 logo tiles, diagonal, 130 / 90 px/s | 2.7 / 2.1% |
| Sheet scrolling 45–60 px/s | 5–9%; **0.0% at a 72 px row pitch** (strobes) |
| Founders photo, 620 / 900 / 1100×700, 40–50 px/s | 4.4 / 5.5 / 6.6% |
| Runners photo 1240×760, 40 px/s | 18.5% |
| Clips in a 900×560 window, no pan (360p) | 0.6–3.0% |
| Clips in an 880 tile, pan 60 px/s | 4.2–6.7% |
| C's exploded view, drift / plus pan 55 | 2.1–3.7 / 3.8–7.3% |

In `busy_check`, A's navy bars count as 37 things and light-grey bars as 1, with the same motion; gaps of 24 px or less merge tiles into one thing. The probe ignores moves under 60 px/s, so **photos panning at up to 55 px/s inside frames that hold still score high with no BUSY flag and no camera**.

## Scores

**A: 4/10.** Its physics is wrong: grey bars do count, and its hook is 2.7%, not the 5.5–7% it claims.
- About 14 s is below 5% (P01–03, P07–08, P15–17, P19–21); median about 5% ±1.
- Navy bars across 12 s of sheet fail `busy_check`. P05 runs rows, windows, a pointer and a pile at once, which the probe flags as BUSY.
- It is the hardest build (columns into nodes, sheet into lane, iris), and the riffle and pointer loop look cheap.

**B: 7.5/10.** Its numbers check out.
- P09–18 plus P21 is about 14 s well above 5%, so the median comes out at 6.5–8% with a still camera.
- Weak spots:
  - P01–06, 27% of the film: the clip changes 0.6–3% in its window, not the 15% B assumes.
  - P14: the dashboard alone is about 2.5%.
  - Crowded frames: P04–06 (wall), P10–13 (portrait column) and P16–18 (8+ things).
  - Cheap risks: the puzzle, the odometer and the down-escalator.

**C: 6.5/10.** Calmest (2–4 things) and easiest to build. But its 5.5–6% has no margin:
- P08–09 measures 3.8–6.8%.
- The exploded view (P10–15) without a pan measures 2.1–3.7%.
- Its chosen clip, 6161, measured the weakest.

## Winner: B, fixes

1. **P01–06:** pan the clip at 50–55 px/s inside a window of at least 1000×620, including while it is grey. Choose the clip by HD measurement (6513 and 5609 measured best, 4547 worst). Run two conveyor rows with gaps of 24 px or less.
2. **Crowding:**
   - Close the wall's gaps to 24 px or less.
   - Take the portrait column off screen during the case (P10–13).
   - In P16–18, keep the strip's gaps at 24 px or less and swap the team row for one photo tile (C graft below).
3. **P13:** draw the cells in light tints, with text in the header only. Use a row pitch of 64 or 76 px and scroll at 60–100 px/s.
4. **P14:** scroll the dashboard at 1.6×, 90+ px/s; open P15's photo at 20.6 s.
5. **Cheap moves:**
   - The puzzle becomes tiles closing in pairs.
   - "100%" rises in instead of rolling on an odometer.
   - P19 drops the down-escalator for P01's conveyor running under the window, with no step flip.
6. **Clearance:** keep a fallback in the same window that moves as much (the founders photo, or a Make scenario scrolling).

## Grafts

- **C P01–03:** the two-row floor lifts the business on "grow" and sinks it on "back" (one thing, 3–5%).
- **C P18:** the K.B tile flips into the founders photo beside the business. Two things instead of 8, at 4.4–5.5%.
- **C P16–17:** the K.B tile stretches into a Strategy→Implementation bar, and the textured window rides 1000 px along it.
- **A P04:** a dropdown of real tool tiles scrolling past a selector band, replacing the puzzle.
- **C End:** the pair holds, lifted; only words and button arrive.
