// Motion tokens and brand roles for the Robin Bos film (brand.json, measured from his site).
import { Easing } from "remotion";

export const C = {
  canvas: "#FCFDFE", haze: "#EFF6FC", mist: "#D6E6F6", sky: "#C8E1FA", skyDeep: "#BBCEE4",
  ink: "#0E2038", navy: "#162A43", field: "#1B334F",
  accent: "#79B9FF", blue: "#5078A0", muted: "#586B80", line: "#D9E3EE", white: "#FFFFFF", kb: "#374E6B",
};
// The kinetic kit's roles (scripts/kinetic.tsx reads KIT.font/serif/ink/word/mark/under/strike).
export const KIT = { font: "Manrope", serif: "Manrope", ink: C.ink, word: C.blue, mark: C.sky, under: C.accent, strike: C.accent };

// Signature curves (motion/easing.md): ARRIVE for ~80% of moves, DEPART for exits, MOVE for reframes.
export const ARRIVE = Easing.bezier(0.22, 1, 0.36, 1);
export const DEPART = Easing.bezier(0.55, 0, 0.9, 0.4);
export const MOVE = Easing.bezier(0.65, 0, 0.35, 1);
// Duration palette at 30 fps (precise premium): quick 6–8, standard 12–16, slow 24–36 frames.
export const D = { quick: 7, std: 14, slow: 30 };
export const FRAME = { w: 1920, h: 1080 };
export const SHADOW = { card: "0 8px 35px rgba(14,32,56,.10), 0 0 0 1px rgba(14,32,56,.03)", soft: "0 20px 55px rgba(41,72,101,.08)" };
export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
export const clamp01 = (t: number) => Math.min(1, Math.max(0, t));
