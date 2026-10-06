// Tokens for the WKConversions × bFound film, in the Minimal Gradient SaaS style: a near-white frame glowing into a mesh
// gradient built from both brands (WKConversions' blue #3F8CE8 from one side, bFound's indigo #485E9D from the other, with
// bFound's cream as the warm note), frosted-glass tiles, thin cables with travelling pulses, near-black type whose key
// phrase carries the blue → indigo gradient (the two brands in one stroke).
import { Easing } from "remotion";

export const C = {
  white: "#FFFFFF", page: "#FAFBFE", ink: "#0B1324", ink2: "#131A2D", txt2: "#5C6375", txt3: "#8E93A8", line: "#E4E7F0",
  label: "#8E8FC8",                         // the style's tracked uppercase labels
  wkc: "#3F8CE8", wkcInk: "#1266C9", wkcSoft: "#E6F0FD",
  bf: "#485E9D", bfInk: "#33467F", bfSoft: "#EFF3FF", cream: "#FDF8DA", blush: "#FBF4FC",
  sky: "#9CC6FC", lilac: "#AAA1FD", violet: "#6D74E0",
  grey: "#B4B9C8",
};
export const GRAD = `linear-gradient(90deg, ${C.wkc} 0%, ${C.violet} 55%, ${C.bf} 100%)`;
export const F = { display: "Inter Tight", ui: "Inter", serif: "Instrument Serif" };
export const KIT = { font: F.display, serif: F.serif, ink: C.ink, word: C.wkcInk, mark: C.wkcSoft, under: C.wkc, strike: C.wkc };

export const ARRIVE = Easing.bezier(0.22, 1, 0.36, 1);       // soft ease-out for arrivals (the site's --ease)
export const MOVE = Easing.bezier(0.65, 0, 0.35, 1);         // smooth ease-in-out for travel
export const DEPART = Easing.bezier(0.55, 0, 0.9, 0.4);
export const SMOOTH = (u: number) => { const c = Math.min(1, Math.max(0, u)); return c * c * (3 - 2 * c); };
export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
export const clamp01 = (t: number) => Math.min(1, Math.max(0, t));
export const mix = (a: string, b: string, k: number) => {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16)), pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return "#" + pa.map((v, i) => Math.round(lerp(v, pb[i], clamp01(k))).toString(16).padStart(2, "0")).join("");
};
export const rgba = (hex: string, o: number) => `rgba(${[1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)).join(",")},${o})`;
export const GLASS = {
  background: "linear-gradient(160deg, rgba(255,255,255,0.86), rgba(255,255,255,0.62))",
  boxShadow: "inset 0 0 0 1.5px rgba(255,255,255,0.95), 0 30px 60px -28px rgba(40,50,110,0.35), 0 2px 8px rgba(40,50,110,0.06)",
} as const;
