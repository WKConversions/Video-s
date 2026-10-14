// The film's tokens: black and ivory with Gucci's heritage colours (the Web stripe's green and red), a Didone
// serif for the statements (Bodoni Moda), small tracked capitals for the labels, and the motion identity: slow and
// assured (long ease-outs, masked reveals, slow pushes; no bounce, nothing quick except the cuts on the beat).
import { continueRender, delayRender, Easing, staticFile } from "remotion";
import { loadFont } from "@remotion/fonts";

export const C = {
  black: "#0A0908", ink: "#0A0908", ivory: "#F2ECE2", dim: "#A39A8E", line: "#3A342E",
  webGreen: "#1F5A3D", webRed: "#A3192A", ancora: "#6E1A1C", font: "Manrope", serif: "Bodoni Moda",
  // slot names the shared kit reads
  paper: "#0A0908", white: "#F2ECE2", muted: "#A39A8E", orange: "#A3192A", lime: "#1F5A3D", green: "#1F5A3D", deep: "#1F5A3D", amber: "#A3192A",
};
export const G = { a: C.webRed, b: C.webGreen, c: C.webGreen, deep: C.webGreen };
export const GRAD = `${C.webGreen} 0%, ${C.webRed} 50%, ${C.webGreen} 100%`;
export const M = { a: "#000000", b: "#000000", c: "#000000", d: "#000000" };
export const KIT = { font: "Bodoni Moda", serif: "Bodoni Moda", ink: C.ivory, word: C.ivory, mark: C.ancora, under: C.ivory, strike: C.webRed };

export const ARRIVE = Easing.bezier(0.16, 1, 0.3, 1);          // a long, assured ease-out
export const MOVE = Easing.bezier(0.7, 0, 0.3, 1);
export const DEPART = Easing.bezier(0.6, 0, 0.85, 0.3);
export const GROW = Easing.bezier(0.45, 0, 0.2, 1);
export const SMALLPOP = Easing.bezier(0.16, 1, 0.3, 1);

const fontHandle = typeof window !== "undefined" ? delayRender("fonts") : null;
if (typeof window !== "undefined") {
  Promise.all([
    loadFont({ family: "Bodoni Moda", url: staticFile("fonts/bodoni-normal.woff2"), weight: "400 700" }),
    loadFont({ family: "Bodoni Moda", url: staticFile("fonts/bodoni-italic.woff2"), weight: "400 700", style: "italic" }),
    ...[["400", "regular"], ["600", "semibold"], ["700", "bold"]].map(([w, n]) => loadFont({ family: "Manrope", url: staticFile(`fonts/manrope-${n}.ttf`), weight: w })),
  ]).then(() => fontHandle !== null && continueRender(fontHandle));
}

export const clamp01 = (t: number) => Math.min(1, Math.max(0, t));
export const mix = (a: number, b: number, k: number) => a + (b - a) * k;
