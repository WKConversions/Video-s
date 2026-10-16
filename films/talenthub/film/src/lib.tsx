// Talent Hub's tokens (the brand kit, October 2026): Talent Red #CF141E as the primary, Charcoal #191B20 for text,
// Warm Ivory #FCF8F5 as the ground, Soft Rose #FCE6E7 as the accent, Cloud Gray #F0F0EF for UI; Lato (Black for
// headlines, Bold for subheads, Regular for UI). Round shapes, bold red, calm neutrals — the same visual family as
// the JongLeren films (warm ground, soft red ripples, white cards, red pills, a red line with dots), as a bridge.
import { continueRender, delayRender, Easing, staticFile } from "remotion";
import { loadFont } from "@remotion/fonts";

export const C = {
  red: "#CF141E", redDeep: "#A80F17", ink: "#191B20", ivory: "#FCF8F5", rose: "#FCE6E7", cloud: "#F0F0EF", white: "#FFFFFF",
  gray: "#6B6E76", light: "#A6A8AE", line: "#E7E3DF", green: "#1F9D55", greenTint: "#E3F4EA", gold: "#F2B705",
  font: "Lato",
  // slot names the shared kinetic kit reads
  cream: "#FCF8F5", paper: "#FCF8F5", blue: "#CF141E", blueDeep: "#A80F17", blueTint: "#FCE6E7", muted: "#6B6E76",
};
export const KIT = { font: "Lato", serif: "Lato", ink: C.ink, word: C.red, mark: C.rose, under: C.red, strike: C.red };

export const ARRIVE = Easing.bezier(0.16, 1, 0.3, 1);
export const MOVE = Easing.bezier(0.65, 0, 0.35, 1);
export const DEPART = Easing.bezier(0.55, 0, 0.85, 0.3);
export const SNAP = Easing.bezier(0.2, 0.9, 0.25, 1);
export const POP = Easing.bezier(0.3, 1.35, 0.6, 1);           // a small overshoot, for small things landing (chips, dots)

const fontHandle = typeof window !== "undefined" ? delayRender("fonts") : null;
if (typeof window !== "undefined") {
  Promise.all([
    loadFont({ family: "Lato", url: staticFile("fonts/lato-400.woff2"), weight: "400" }),
    loadFont({ family: "Lato", url: staticFile("fonts/lato-700.woff2"), weight: "700" }),
    loadFont({ family: "Lato", url: staticFile("fonts/lato-900.woff2"), weight: "900" }),
  ]).then(() => fontHandle !== null && continueRender(fontHandle));
}

export const clamp01 = (t: number) => Math.min(1, Math.max(0, t));
export const mix = (a: number, b: number, k: number) => a + (b - a) * k;
