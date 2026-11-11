// v6's shared object motion after Karl's notes of 10 Nov: "everything in the video should bounce a bit; now a lot is
// linear", and "the spread green animation is amazing; I want such nice additions in animations through the video,
// not the same each time, it gives the video more motion design". (Willads had asked for no bounce: Karl, the owner,
// overrides that with "a bit". So: a small settle, never a cartoon bounce. The camera never bounces.)
//
//   pop(g, at, o)  0 → 1 with a soft start (no sudden kick, so the flow check stays clean) and a small overshoot that
//                  settles: o.dur = time to the peak (s, default 0.6; it passes 1 at about 0.8 × dur); o.over = overshoot (default 0.06 = 6%;
//                  use 0.03 for big surfaces like a window or a card, 0.06–0.1 for small things like a chip, a check,
//                  a dot, a word). Returns up to 1 + over, then settles to 1 by about 1.8 × dur.
//   popOut(g, at, o) 1 → 0, the same shape reversed in time (a small anticipation, then away).
//   wobble(g, at, amp, dur) a decaying sway (deg or px) for after an impact: a card that lands, a button pressed.
// Use pop for every arrival, morph, slide, scale and swap of an OBJECT. Keep sine eases for the camera and for long
// travels (a slide of more than about 700 px uses pop with over 0.03).
import { clamp01 } from "./lib";
import { f } from "./shared";

const springOver = (t: number, over: number) => {
  // a damped spring normalised so it first reaches 1 at t = 1 and peaks at 1 + over
  const z = Math.max(0.35, Math.min(0.95, -Math.log(Math.max(1e-4, over)) / Math.sqrt(Math.PI * Math.PI + Math.log(Math.max(1e-4, over)) ** 2)));
  const wd = Math.PI / 1.0, w0 = wd / Math.sqrt(1 - z * z), x = t;           // first crossing of 1 at t = 1 when wd·t ≈ π − φ: close enough for UI
  return 1 - Math.exp(-z * w0 * x) * (Math.cos(wd * x) + ((z * w0) / wd) * Math.sin(wd * x));
};
const soft = (t: number, a = 0.18) => (t <= 0 ? 0 : t < a ? (t * t) / (2 * a) : t - a / 2);   // a soft start, velocity continuous
export const pop = (g: number, at: string | number, o: { dur?: number; over?: number } = {}) => {
  const dur = o.dur ?? 0.6, over = o.over ?? 0.06, t = (g - f(at)) / 30 / dur;
  if (t <= 0) return 0;
  return springOver(soft(t) * 1.09, over);
};
export const popOut = (g: number, at: string | number, o: { dur?: number; over?: number } = {}) => {
  const dur = o.dur ?? 0.5, t = (g - f(at)) / 30;
  if (t <= 0) return 1;
  const u = clamp01(t / dur), antic = (o.over ?? 0.04) * Math.sin(Math.PI * clamp01(u / 0.3));
  return 1 + antic - (u * u * (3 - 2 * u)) * (1 + antic);
};
export const wobble = (g: number, at: string | number, amp = 3, dur = 0.8) => {
  const t = (g - f(at)) / 30;
  if (t <= 0 || t > dur * 2) return 0;
  return amp * Math.exp(-4.2 * t / dur) * Math.sin((2 * Math.PI * t) / (dur * 0.42)) * clamp01(t / 0.06);
};
