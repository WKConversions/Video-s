// Motion tokens and brand roles for the Wicflow film. Colours are the site's own CSS tokens and panel tints (brand.json,
// measured 5 Oct 2026): white paper, ink #17171B / #0A0A0D, muted #606069, line #D6D6D9; the three service tints (blue,
// sage, sand: each a radial from light to the panel colour); the live-AI blue #1769C2 (the "AI at work" dot and focus ring).
// Fonts: Space Grotesk 600 (the site's h1–h4 and the OG card, −0.045em), Manrope (body, UI).
import { Easing } from "remotion";

export const C = {
  paper: "#FFFFFF", paper2: "#F7F7F9", paper3: "#F4F4F7",
  ink: "#17171B", inkStrong: "#0A0A0D", muted: "#606069", line: "#D6D6D9", line2: "#E8E8EB",
  blue: "#1769C2", blueDeep: "#0F4F96", blueHalo: "rgba(23,105,194,0.12)",
  // the three service tints: [light, mid, panel]; side faces of blocks take a shade darker (derived, same hue)
  tBlue: ["#F1F5FB", "#E6EDF7", "#DFE7F3"], sideBlue: ["#CFDBEC", "#BCCDE4"],
  tSage: ["#F1F6F1", "#E5EEE6", "#DDE8DE"], sideSage: ["#CBDCCD", "#B8CEBB"],
  tSand: ["#F8F4EC", "#F0E9DC", "#EAE1D1"], sideSand: ["#DDD1BC", "#D0C2A8"],
  tGrey: ["#FAFAFB", "#F1F1F4", "#E9E9EE"], sideGrey: ["#DCDCE2", "#CDCDD5"],
  btn: "#0A0A0D", btnInk: "#EEEEF1",
};
export const F = { display: "Space Grotesk", ui: "Manrope" };
// The kinetic kit's roles (src/kinetic.tsx reads KIT.font/serif/ink/word/mark/under/strike).
export const KIT = { font: F.display, serif: F.display, ink: C.ink, word: C.blue, mark: "#DFE7F3", under: C.blue, strike: C.blue };

// Motion identity: "precise, energetic". Signature curve expo-out (.16,1,.3,1) for ~80% of arrivals (the energetic row,
// motion/motion-identity.md); UI responses on the site's ease-out; DEPART for exits (accelerating); MOVE for reframes.
export const ARRIVE = Easing.bezier(0.16, 1, 0.3, 1);
export const UI = Easing.bezier(0.2, 0.7, 0.2, 1);
export const DEPART = Easing.bezier(0.55, 0, 0.9, 0.4);
export const MOVE = Easing.bezier(0.65, 0, 0.35, 1);
export const SMOOTH = (u: number) => { const c = Math.min(1, Math.max(0, u)); return c * c * (3 - 2 * c); };
// Duration palette at 30 fps (energetic end of precise): quick 6, standard 12, slow 24 frames.
export const D = { quick: 6, std: 12, slow: 24 };
export const SHADOW = {
  card: "0 30px 70px -28px rgba(23,23,27,0.28), 0 2px 6px rgba(23,23,27,0.06)",
  float: "0 40px 90px -30px rgba(23,23,27,0.32), 0 3px 10px rgba(23,23,27,0.06)",
  edge: "inset 0 0 0 1px rgba(0,0,0,0.07)",
};
export const R = { card: 24, inner: 16, pill: 999 };
export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
export const clamp01 = (t: number) => Math.min(1, Math.max(0, t));
export const mix = (a: string, b: string, k: number) => {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16)), pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return `rgb(${pa.map((v, i) => Math.round(lerp(v, pb[i], clamp01(k)))).join(",")})`;
};
export const rgba = (hex: string, o: number) => `rgba(${[1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)).join(",")},${o})`;
