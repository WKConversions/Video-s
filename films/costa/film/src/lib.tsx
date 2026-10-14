// The film's tokens: Costa Connect's colours (from the site's CSS), Manrope (the site's font, from the site), and the
// motion identity (calm-confident network energy: soft ease-out arrivals, scale-and-fade tiles, MOVE for travel, no bounce).
import { continueRender, delayRender, Easing, staticFile } from "remotion";
import { loadFont } from "@remotion/fonts";

export const C = {
  paper: "#FBF8F3", white: "#FFFFFF", ink: "#071B40", navy: "#071B40", blue: "#21468B", slate: "#435273", rust: "#BA4D1D",
  muted: "#626C7A", line: "#E0E3E7", orange: "#EF6925", red: "#D1261D", font: "Manrope",
  // the kit's slot names (saas.tsx), mapped onto Costa Connect's palette: orange (Spain, the sun) into navy (the Netherlands)
  amber: "#BA4D1D", lime: "#435273", green: "#071B40", deep: "#071B40",
};
// cables run from orange (Spain) through rust and slate into navy (the Netherlands)
export const G = { a: C.orange, b: C.slate, c: C.navy, deep: C.navy };
export const GRAD = `${C.orange} 0%, ${C.rust} 30%, ${C.slate} 65%, ${C.navy} 100%`;
// the site's own .gradient-text fill (navy → slate → rust → burnt orange), for the key phrase of a line
export const GRADTXT = "#071b40 0%, #435273 34%, #9d534d 66%, #ba4d1d 100%";
// the mesh: pale neighbours of the brand (peach, pale blue, sand, periwinkle), never saturated behind type
export const M = { a: "#FFDCC6", b: "#D8E2F4", c: "#E2E8F6", d: "#F9E4CF" };
export const KIT = { font: "Manrope", serif: "Manrope", ink: C.ink, word: C.navy, mark: "#FDE3D3", under: C.orange, strike: C.orange };

export const ARRIVE = Easing.bezier(0.22, 1, 0.36, 1);
export const MOVE = Easing.bezier(0.65, 0, 0.35, 1);
export const DEPART = Easing.bezier(0.55, 0, 0.9, 0.4);
export const GROW = Easing.bezier(0.45, 0, 0.2, 1);
export const SMALLPOP = Easing.bezier(0.3, 1.3, 0.6, 1);

const fontHandle = typeof window !== "undefined" ? delayRender("fonts") : null;
if (typeof window !== "undefined") {
  Promise.all([["400", "regular"], ["600", "semibold"], ["700", "bold"], ["800", "extra"]].map(([w, n]) => loadFont({ family: "Manrope", url: staticFile(`fonts/manrope-${n}.ttf`), weight: w })))
    .then(() => fontHandle !== null && continueRender(fontHandle));
}

export const clamp01 = (t: number) => Math.min(1, Math.max(0, t));
export const mix = (a: number, b: number, k: number) => a + (b - a) * k;
