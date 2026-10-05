// Isometric projection for the bright world: world units on the ground (x right-down, y left-down), z up.
// A view is an azimuth th, a scale s and a focus (fx, fy) projected to the screen point (cx, cy).
export type View = { th: number; s: number; fx: number; fy: number; cx: number; cy: number };
export const K = 0.56;   // ground foreshortening (sin of the elevation)
export const H = 0.84;   // height factor (cos of the elevation)
export const proj = (v: View, x: number, y: number, z = 0): [number, number] => {
  const dx = x - v.fx, dy = y - v.fy, c = Math.cos(v.th), s = Math.sin(v.th);
  return [v.cx + (dx * c - dy * s) * v.s, v.cy + ((dx * s + dy * c) * K - z * H) * v.s];
};
export const depth = (v: View, x: number, y: number) => x * Math.sin(v.th) + y * Math.cos(v.th);
export const pts = (a: [number, number][]) => a.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
/** Deterministic noise in 0..1 (no Math.random in a frame-driven film). */
export const hash = (i: number, j: number, k = 0) => {
  const s = Math.sin(i * 127.1 + j * 311.7 + k * 74.7) * 43758.5453;
  return s - Math.floor(s);
};
