// The film's tokens: Alumni's colours (measured, ../brand.json), Lato (the site's font, woff2 from the site),
// the motion identity (smooth SaaS energy: soft ease-out arrivals, scale-and-fade tiles, MOVE for travel, no bounce).
import { continueRender, delayRender, Easing, staticFile } from "remotion";
import { loadFont } from "@remotion/fonts";

export const C = {
  paper: "#F7F8F4", white: "#FFFFFF", ink: "#17271F", muted: "#56665D", line: "#DCE3DD", sage: "#D8E4DA",
  orange: "#FE6C02", lime: "#6ABB24", green: "#028B45", deep: "#006B38", amber: "#F5A000", font: "Lato",
};
// the palette for cables, glows and the key-phrase fill: the logo's orange into its greens, through amber
export const G = { a: C.orange, b: C.lime, c: C.green, deep: C.deep };
export const GRAD = `${C.orange} 0%, ${C.amber} 30%, ${C.lime} 62%, ${C.green} 100%`;
// the mesh: pale neighbours of the brand hues (apricot, pale lime, mint), never saturated behind type
export const M = { a: "#FFD6B0", b: "#DDF1C2", c: "#C9E9D6", d: "#FFE9C7" };
export const KIT = { font: "Lato", serif: "Lato", ink: C.ink, word: C.deep, mark: "#E4F2D6", under: C.orange, strike: C.orange };

export const ARRIVE = Easing.bezier(0.22, 1, 0.36, 1);
export const MOVE = Easing.bezier(0.65, 0, 0.35, 1);
export const DEPART = Easing.bezier(0.55, 0, 0.9, 0.4);
export const GROW = Easing.bezier(0.45, 0, 0.2, 1);
export const SMALLPOP = Easing.bezier(0.3, 1.3, 0.6, 1);

const fontHandle = typeof window !== "undefined" ? delayRender("fonts") : null;
if (typeof window !== "undefined") {
  Promise.all(["400", "700", "900"].map((w) => loadFont({ family: "Lato", url: staticFile(`fonts/lato-${w}.woff2`), weight: w })))
    .then(() => fontHandle !== null && continueRender(fontHandle));
}

export const clamp01 = (t: number) => Math.min(1, Math.max(0, t));
export const mix = (a: number, b: number, k: number) => a + (b - a) * k;
