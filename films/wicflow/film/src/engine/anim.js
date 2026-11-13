/* Wicflow film: motion helpers. Every time is FILM SECONDS (T), the same clock the voice-over words use.
   House style (Karl): calm and constant, never linear, never a flash; every object movement has a soft start and
   settles with a small overshoot ("everything should bounce a bit"); the camera never bounces.

   seg(T, t0, dur)            linear 0..1 progress (clamped). Only as an input to an ease, never on screen raw.
   ease.inOut / out / in / smooth (u in 0..1)   the curves. inOut = the signature (0.65,0,0.35,1).
   E(T, t0, dur, curve='inOut') eased 0..1 between t0 and t0+dur.
   pop(T, t0, {dur, over})    0 -> 1 with a soft start and a small overshoot that settles (peaks 1+over).
                              over: 0.03 for big surfaces (a window, a card, the world), 0.06-0.1 for small things.
   popOut(T, t0, {dur, over}) 1 -> 0, a small anticipation, then away.
   wobble(T, t0, amp, dur)    a decaying sway after an impact (deg or px).
   drift(T, period, amp, phase) the ambient float (sin) so no frame is ever still.
   mix(a, b, p), mixP(pa, pb, p), clamp01(x), bezier(x1,y1,x2,y2)(u)
   DASH(T)                    the wire dash offset: dashes march at 12 px/s on ONE film clock, so wires never jump
                              at a beat change. Use { dashOff: DASH(T) } on every wire block. */
export const clamp01 = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);
export const seg = (T, t0, dur) => clamp01((T - t0) / dur);
export const mix = (a, b, p) => a + (b - a) * p;
export const mixP = (a, b, p) => [mix(a[0], b[0], p), mix(a[1], b[1], p)];
export function bezier(x1, y1, x2, y2) {
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx, cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
  const X = (t) => ((ax * t + bx) * t + cx) * t, Y = (t) => ((ay * t + by) * t + cy) * t, dX = (t) => (3 * ax * t + 2 * bx) * t + cx;
  return (u) => {
    if (u <= 0) return 0; if (u >= 1) return 1;
    let t = u;
    for (let i = 0; i < 8; i++) { const e = X(t) - u, d = dX(t); if (Math.abs(e) < 1e-6 || Math.abs(d) < 1e-6) break; t -= e / d; }
    return Y(Math.min(1, Math.max(0, t)));
  };
}
export const ease = {
  inOut: bezier(0.65, 0, 0.35, 1),      // the signature curve
  smooth: bezier(0.42, 0, 0.18, 1),     // soft start, long soft landing (glides, travels)
  out: bezier(0.16, 1, 0.3, 1),         // fast start, long settle (arrivals that need no overshoot)
  in: bezier(0.5, 0, 0.75, 0),          // leaving
};
export const E = (T, t0, dur, curve = 'inOut') => ease[curve](seg(T, t0, dur));
const springOver = (t, over) => {
  const lo = Math.log(Math.max(1e-4, over));
  const z = Math.max(0.35, Math.min(0.95, -lo / Math.sqrt(Math.PI * Math.PI + lo * lo)));
  const wd = Math.PI, w0 = wd / Math.sqrt(1 - z * z);
  return 1 - Math.exp(-z * w0 * t) * (Math.cos(wd * t) + ((z * w0) / wd) * Math.sin(wd * t));
};
const soft = (t, a = 0.18) => (t <= 0 ? 0 : t < a ? (t * t) / (2 * a) : t - a / 2);
export const pop = (T, t0, o = {}) => {
  const dur = o.dur ?? 0.6, over = o.over ?? 0.06, t = (T - t0) / dur;
  if (t <= 0) return 0;
  return springOver(soft(t) * 1.09, over);
};
export const popOut = (T, t0, o = {}) => {
  const dur = o.dur ?? 0.5, t = T - t0;
  if (t <= 0) return 1;
  const u = clamp01(t / dur), antic = (o.over ?? 0.04) * Math.sin(Math.PI * clamp01(u / 0.3));
  return 1 + antic - (u * u * (3 - 2 * u)) * (1 + antic);
};
export const wobble = (T, t0, amp = 3, dur = 0.8) => {
  const t = T - t0;
  if (t <= 0 || t > dur * 2) return 0;
  return amp * Math.exp((-4.2 * t) / dur) * Math.sin((2 * Math.PI * t) / (dur * 0.42)) * clamp01(t / 0.06);
};
export const drift = (T, period = 3.76, amp = 6, phase = 0) => amp * Math.sin((2 * Math.PI * T) / period + phase);
export const DASH = (T) => 12 * T;
