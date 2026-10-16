// Bingua's tokens, measured on bingua.app: the iOS light ground (#F2F2F7), white cards with hairlines, black Inter
// type with iOS secondary gray, one sky-blue accent (#2FAFEE, the logo's play triangle) and a deeper link blue
// (#0A649A); the logo tile is navy (#0F1A29). The app's own UI colours (transcript highlight, adjective tag, the
// flashcard's Forgot/Got it) are kept for the UI. Flat colour, no gradients. Motion: SaaS-crisp ease-outs.
import { continueRender, delayRender, Easing, staticFile } from "remotion";
import { loadFont } from "@remotion/fonts";

export const C = {
  bg: "#F2F2F7", white: "#FFFFFF", ink: "#000000", ink2: "#1C1C1E", gray: "#6B6B70", light: "#A1A1A6", line: "#E5E5EA", fill: "#EBEBF0",
  sky: "#2FAFEE", skyDeep: "#0A649A", skyTint: "#E4F3FC", skyGlow: "rgba(47,175,238,0.30)", navy: "#0F1A29",
  green: "#2E8B4E", greenTint: "#E0EFE5", red: "#E5484D", redTint: "#F7E1E3", flame: "#F59E0B",
  font: "Inter",
  // slot names the shared kinetic kit reads
  cream: "#F2F2F7", paper: "#F2F2F7", blue: "#2FAFEE", blueDeep: "#0A649A", blueTint: "#E4F3FC", muted: "#6B6B70",
};
export const KIT = { font: "Inter", serif: "Inter", ink: C.ink, word: C.sky, mark: C.skyTint, under: C.sky, strike: C.sky };

export const ARRIVE = Easing.bezier(0.16, 1, 0.3, 1);
export const MOVE = Easing.bezier(0.65, 0, 0.35, 1);
export const DEPART = Easing.bezier(0.55, 0, 0.85, 0.3);
export const SNAP = Easing.bezier(0.2, 0.9, 0.25, 1);          // a crisp UI ease-out for taps, pops and chips

const fontHandle = typeof window !== "undefined" ? delayRender("fonts") : null;
if (typeof window !== "undefined") {
  loadFont({ family: "Inter", url: staticFile("fonts/inter.woff2"), weight: "300 800" }).then(() => fontHandle !== null && continueRender(fontHandle));
}

export const clamp01 = (t: number) => Math.min(1, Math.max(0, t));
export const mix = (a: number, b: number, k: number) => a + (b - a) * k;
