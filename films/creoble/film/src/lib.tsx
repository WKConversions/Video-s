// The film's tokens: an Apple-style product film for Creoble — cream ground, near-black type, one light-blue accent
// (no orange), Inter for the statements and interface (an SF-like grotesk), Fraunces for the Creoble wordmark (the
// site's own), and the motion identity: slow, precise, assured (long ease-outs, fades that rise and sharpen, smooth
// push-ins on the product; nothing bounces).
import { continueRender, delayRender, Easing, staticFile } from "remotion";
import { loadFont } from "@remotion/fonts";

export const C = {
  cream: "#FAFAF7", paper: "#FAFAF7", white: "#FFFFFF", ink: "#1D1D1F", gray: "#6E6E73", light: "#A1A1A6", line: "#E5E5EA", fill: "#F2F2F0",
  blue: "#4AA3F5", blueDeep: "#2A86E0", blueTint: "#EAF4FE", blueGlow: "rgba(74,163,245,0.35)", green: "#34C759",
  font: "Inter", serif: "Fraunces",
  // slot names the shared kit reads
  muted: "#6E6E73", orange: "#4AA3F5", lime: "#4AA3F5", deep: "#2A86E0", amber: "#4AA3F5",
};
export const G = { a: C.blue, b: C.blue, c: C.blue, deep: C.blueDeep };
export const GRAD = `${C.blue} 0%, ${C.blueDeep} 100%`;
export const M = { a: "#FFFFFF", b: "#FFFFFF", c: "#FFFFFF", d: "#FFFFFF" };
export const KIT = { font: "Inter", serif: "Fraunces", ink: C.ink, word: C.blueDeep, mark: C.blueTint, under: C.blue, strike: C.blue };

export const ARRIVE = Easing.bezier(0.16, 1, 0.3, 1);
export const MOVE = Easing.bezier(0.65, 0, 0.35, 1);
export const DEPART = Easing.bezier(0.55, 0, 0.85, 0.3);
export const GROW = Easing.bezier(0.45, 0, 0.2, 1);
export const SMALLPOP = Easing.bezier(0.16, 1, 0.3, 1);

const fontHandle = typeof window !== "undefined" ? delayRender("fonts") : null;
if (typeof window !== "undefined") {
  Promise.all([
    loadFont({ family: "Inter", url: staticFile("fonts/inter.woff2"), weight: "300 800" }),
    loadFont({ family: "Fraunces", url: staticFile("fonts/fraunces.woff2"), weight: "300 700" }),
  ]).then(() => fontHandle !== null && continueRender(fontHandle));
}

export const clamp01 = (t: number) => Math.min(1, Math.max(0, t));
export const mix = (a: number, b: number, k: number) => a + (b - a) * k;
