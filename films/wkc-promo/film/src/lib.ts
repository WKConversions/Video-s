// Shared tokens and helpers. The film is the NeuralSeek promo rebuilt frame for frame at 1920×1080 (the reference is
// 1280×720: every measurement is ×1.5), in WKConversions' colours and faces.
export const W = 1920, H = 1080;

export const C = {
  blue: "#3F8CE8", blueText: "#1266C9", blueSoft: "#E6F0FD", ink: "#050F19", page: "#F7F7F8", white: "#FFFFFF",
  muted: "#575E68", muted2: "#838A94", faint: "#C9CED4", line: "#E2E3E6", surface: "#EFF0F2",
  // the reference's dark ground and glows, re-coloured into WKC's blues
  night: "#05080F", night2: "#0A1220", glow: "#3F8CE8", glowHi: "#8DC0FF", glowCyan: "#5FD3FF", glowDeep: "#1B4FB8",
};
export const F = { head: "Inter Tight", ui: "Inter" };

export const clamp01 = (t: number) => Math.min(1, Math.max(0, t));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const inv = (a: number, b: number, v: number) => clamp01((v - a) / (b - a));

/** cubic-bezier easing (x1, y1, x2, y2), solved for x by Newton + bisection */
export const bezier = (x1: number, y1: number, x2: number, y2: number) => {
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx, cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
  const sx = (t: number) => ((ax * t + bx) * t + cx) * t, sy = (t: number) => ((ay * t + by) * t + cy) * t, dx = (t: number) => (3 * ax * t + 2 * bx) * t + cx;
  return (x: number) => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    let t = x;
    for (let i = 0; i < 8; i++) { const e = sx(t) - x, d = dx(t); if (Math.abs(e) < 1e-6) return sy(t); if (Math.abs(d) < 1e-6) break; t -= e / d; }
    let lo = 0, hi = 1; t = x;
    for (let i = 0; i < 30; i++) { const v = sx(t); if (Math.abs(v - x) < 1e-6) break; if (v < x) lo = t; else hi = t; t = (lo + hi) / 2; }
    return sy(t);
  };
};
/** WKC's site ease: a fast start and a long soft settle */
export const EASE = bezier(0.22, 1, 0.36, 1);
export const EASE_IO = bezier(0.65, 0, 0.35, 1);
export const EASE_IN = bezier(0.55, 0, 0.9, 0.3);
/** exponential ease-out over n frames decaying by r per frame, landing at rest */
export const expoOut = (n: number, r = 0.8) => (t: number) => {
  const c = clamp01(t), q = Math.pow(r, n), v = n * Math.log(1 / r) * q / (1 - q);
  return (1 - Math.pow(r, c * n)) / (1 - q) + v * c * c * (1 - c);
};
/** progress of an eased move that starts at frame a and lasts n frames */
export const pr = (g: number, a: number, n: number, ease: (t: number) => number = EASE) => ease(clamp01((g - a) / n));

/** keyframes: [[frame, value], ...] interpolated with an ease per segment (default linear) */
export const keys = (g: number, k: [number, number][], ease: (t: number) => number = (t) => t) => {
  if (g <= k[0][0]) return k[0][1];
  for (let i = 1; i < k.length; i++) if (g <= k[i][0]) return lerp(k[i - 1][1], k[i][1], ease((g - k[i - 1][0]) / (k[i][0] - k[i - 1][0])));
  return k[k.length - 1][1];
};
