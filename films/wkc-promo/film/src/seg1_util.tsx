// Segment 1 helpers: the WKC colour mapping of the reference's violets, colour mixing, glyph layout.
import { measureText } from "@remotion/layout-utils";
import { clamp01, lerp } from "./lib";

const rgb = (hex: string): [number, number, number] => {
  const n = parseInt(hex.replace("#", ""), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const hex = (c: number[]) => "#" + c.map((v) => Math.round(Math.min(255, Math.max(0, v))).toString(16).padStart(2, "0")).join("").toUpperCase();

/** The spec's colour rule: keep a reference colour's lightness and saturation, rotate its hue to WKC blue (213°). */
export const wk = (h: string) => {
  const [r, g, b] = rgb(h).map((v) => v / 255);
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, d = mx - mn;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  const c = (1 - Math.abs(2 * l - 1)) * s, x = c * (1 - Math.abs(((213 / 60) % 2) - 1)), m = l - c / 2;
  return hex([m * 255, (x + m) * 255, (c + m) * 255]);
};
/** mix two hex colours */
export const mix = (a: string, b: string, t: number) => {
  const A = rgb(a), B = rgb(b), k = clamp01(t);
  return hex([lerp(A[0], B[0], k), lerp(A[1], B[1], k), lerp(A[2], B[2], k)]);
};
/** a colour keyframe track: [[frame, hex], ...] mixed linearly */
export const colorAt = (f: number, k: [number, string][]) => {
  if (f <= k[0][0]) return k[0][1];
  for (let i = 1; i < k.length; i++) if (f <= k[i][0]) return mix(k[i - 1][1], k[i][1], (f - k[i - 1][0]) / (k[i][0] - k[i - 1][0]));
  return k[k.length - 1][1];
};
export const rgba = (h: string, a: number) => { const [r, g, b] = rgb(h); return `rgba(${r},${g},${b},${a})`; };

const wc: Record<string, number> = {};
/** advance width of a string (no tracking) */
export const adv = (text: string, family: string, size: number, weight: number) => {
  const key = `${text}|${family}|${size}|${weight}`;
  if (!(key in wc)) wc[key] = measureText({ text, fontFamily: family, fontSize: size, fontWeight: String(weight) }).width;
  return wc[key];
};
/** glyph origins of a string with tracking (em) relative to the first origin, and the total advance (without trailing tracking) */
export const glyphs = (text: string, family: string, size: number, weight: number, track = 0) => {
  const xs = text.split("").map((_, i) => (i ? adv(text.slice(0, i), family, size, weight) : 0) + i * track * size);
  return { xs, total: adv(text, family, size, weight) + (text.length - 1) * track * size };
};
