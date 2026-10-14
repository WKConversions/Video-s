// The film's tokens: Recruiting Rewards' light theme (the site's CSS variables), Lora for headings and Manrope for
// the interface (the site's fonts), and the motion identity (crisp product motion: soft ease-out arrivals,
// scale-and-fade panels, MOVE for travel, a cursor that clicks; no bounce).
import { continueRender, delayRender, Easing, staticFile } from "remotion";
import { loadFont } from "@remotion/fonts";

export const C = {
  paper: "#F8F6F5", white: "#FFFFFF", ink: "#1C1917", muted: "#777069", line: "#E2DFD9", sand: "#F2F0EB", side: "#FBFAF9",
  green: "#287E61", greenStrong: "#1E674E", greenSoft: "#E5F0EC", greenMid: "#81BBA8", navy: "#0B1F3A",
  amber: "#E0A458", amberBg: "#FEF7DC", amberLine: "#FCE173", amberText: "#BD6705", okBg: "#E4FBED", okText: "#1D8644",
  blue: "#3D7DC2", clay: "#C45D31", teal: "#3D8F8C", infoBg: "#DCEBFE", infoText: "#145BB8", purpBg: "#F5EDF8", purpText: "#783A88",
  font: "Manrope", serif: "Lora",
  // slot names the shared kit (saas.tsx, kinetic.tsx) reads
  orange: "#E0A458", lime: "#81BBA8", deep: "#1E674E",
};
export const G = { a: C.green, b: C.greenMid, c: C.green, deep: C.greenStrong };
export const GRAD = `${C.greenMid} 0%, ${C.green} 100%`;
export const M = { a: "#FFFFFF", b: "#FFFFFF", c: "#FFFFFF", d: "#FFFFFF" };
export const KIT = { font: "Manrope", serif: "Lora", ink: C.ink, word: C.green, mark: C.greenSoft, under: C.green, strike: C.clay };

export const ARRIVE = Easing.bezier(0.22, 1, 0.36, 1);
export const MOVE = Easing.bezier(0.65, 0, 0.35, 1);
export const DEPART = Easing.bezier(0.55, 0, 0.9, 0.4);
export const GROW = Easing.bezier(0.45, 0, 0.2, 1);
export const SMALLPOP = Easing.bezier(0.3, 1.3, 0.6, 1);

const fontHandle = typeof window !== "undefined" ? delayRender("fonts") : null;
if (typeof window !== "undefined") {
  Promise.all([
    ...[["400", "regular"], ["600", "semibold"], ["700", "bold"], ["800", "extra"]].map(([w, n]) => loadFont({ family: "Manrope", url: staticFile(`fonts/manrope-${n}.ttf`), weight: w })),
    loadFont({ family: "Lora", url: staticFile("fonts/lora-600.woff2"), weight: "400 700" }),
    loadFont({ family: "Lora", url: staticFile("fonts/lora-600-italic.woff2"), weight: "400 700", style: "italic" }),
  ]).then(() => fontHandle !== null && continueRender(fontHandle));
}

export const clamp01 = (t: number) => Math.min(1, Math.max(0, t));
export const mix = (a: number, b: number, k: number) => a + (b - a) * k;
