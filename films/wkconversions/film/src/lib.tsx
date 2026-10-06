// Brand roles and motion tokens for the WKConversions film, from the live wkconversions.com stylesheet (6 Oct 2026):
// page #F7F7F8 with a #D6D9DE dot grid, cards white / #EFF0F2, lines #E2E3E6, ink #050F19, muted #575E68 / #838A94 /
// #C9CED4, the accent blue #3F8CE8 (blue on light #1266C9, soft #E6F0FD). Grey is noise; blue marks what matters.
// Type: Inter Tight 800 for headlines (−0.05em), Inter for UI. Motion: the site's own ease (.22,1,.36,1).
import { Easing } from "remotion";

export const C = {
  page: "#F7F7F8", card: "#FFFFFF", card2: "#EFF0F2", line: "#E2E3E6", dot: "#D6D9DE",
  ink: "#050F19", ink2: "#0C1A28", txt2: "#575E68", txt3: "#838A94", faint: "#C9CED4",
  blue: "#3F8CE8", blue2: "#2F7AD4", blueInk: "#1266C9", blueSoft: "#E6F0FD", blueHalo: "rgba(63,140,232,0.16)",
  // kept for the shared iso kit (draw.tsx); unused tints map to the grey family
  tBlue: ["#F3F7FE", "#E6F0FD", "#D6E6FB"], sideBlue: ["#B9D3F6", "#8DB8F0"],
  tSage: ["#F2F3F5", "#EFF0F2", "#E2E3E6"], sideSage: ["#C9CED4", "#AEB4BC"],
  tSand: ["#F2F3F5", "#EFF0F2", "#E2E3E6"], sideSand: ["#C9CED4", "#AEB4BC"],
  tGrey: ["#FFFFFF", "#EFF0F2", "#E2E3E6"], sideGrey: ["#C9CED4", "#9AA1AB"],
  paper: "#F7F7F8", muted: "#575E68", btn: "#050F19", btnInk: "#F6F6F6", inkStrong: "#050F19", line2: "#EFF0F2",
};
export const F = { display: "Inter Tight", ui: "Inter" };
export const KIT = { font: F.display, serif: F.display, ink: C.ink, word: C.blueInk, mark: C.blueSoft, under: C.blue, strike: C.blue };

export const ARRIVE = Easing.bezier(0.22, 1, 0.36, 1);       // the site's --ease
export const UI = Easing.bezier(0.2, 0.7, 0.2, 1);
export const DEPART = Easing.bezier(0.55, 0, 0.9, 0.4);
export const MOVE = Easing.bezier(0.65, 0, 0.35, 1);
export const SMOOTH = (u: number) => { const c = Math.min(1, Math.max(0, u)); return c * c * (3 - 2 * c); };
export const D = { quick: 6, std: 12, slow: 24 };
export const SHADOW = {
  card: "0 18px 44px -26px rgba(5,15,25,.32), 0 2px 6px rgba(5,15,25,.05)",     // --shadow-soft
  float: "0 30px 64px -30px rgba(5,15,25,.40), 0 3px 10px rgba(5,15,25,.06)",   // --shadow-lift
  edge: "inset 0 0 0 1px #E2E3E6",
};
export const R = { card: 26, lg: 34, md: 16, sm: 10, pill: 999 };
export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
export const clamp01 = (t: number) => Math.min(1, Math.max(0, t));
export const mix = (a: string, b: string, k: number) => {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16)), pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return "#" + pa.map((v, i) => Math.round(lerp(v, pb[i], clamp01(k))).toString(16).padStart(2, "0")).join("");
};
export const rgba = (hex: string, o: number) => `rgba(${[1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)).join(",")},${o})`;
