// UI-motion helpers for SaaS explainers (measured on Dropbox, monday.com, Slack loops, parallel rounds M23-M24, catalogue M96 and M99).
//   reorder(g, start, dur, from, to, rowH, stagger) → y offset per row: rows slide to their sorted places (FLIP)
//   popFrom(g, at, settle)                         → {scale, opacity}: appears on the click frame, settles slowly
// Timings from the references: reorder ~0.7 s ease-in-out with 0–1 frame stagger; pop 1 frame in, 8–12 settle.
import { Easing, interpolate } from "remotion";

const INOUT = Easing.bezier(0.65, 0, 0.35, 1);
const ARRIVE = Easing.bezier(0.22, 1, 0.36, 1);

/** y (px) of row i at frame g, moving from index from[i] to index to[i]. */
export const reorder = (g: number, start: number, dur: number, from: number[], to: number[], rowH: number, stagger = 1) =>
  from.map((f, i) => {
    const k = interpolate(g, [start + i * stagger, start + i * stagger + dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: INOUT });
    return (f + (to[i] - f) * k) * rowH;
  });

/** A popover that appears in one frame and settles: scale 0.86 → 1, opacity 0 → 1 on the click frame. */
export const popFrom = (g: number, at: number, settle = 10) => {
  if (g < at) return { scale: 0.86, opacity: 0 };
  const k = interpolate(g, [at, at + settle], [0, 1], { extrapolateRight: "clamp", easing: ARRIVE });
  return { scale: 0.94 + 0.06 * k, opacity: 1 };   // most of the jump on the first frame, then a slow settle
};
