// The site's type (test.fuf-16d.workers.dev: Bodoni 72 / Didot and Avenir Next, Apple system fonts) set in their
// closest free equivalents: Bodoni Moda for the serif and Nunito Sans for the sans, latin subsets from Google Fonts
// (SIL OFL).
import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

export const fontsReady = Promise.all([
  loadFont({ family: "Bodoni Moda", url: staticFile("fonts/bodoni-moda-normal-latin.woff2"), weight: "400 700", style: "normal" }),
  loadFont({ family: "Bodoni Moda", url: staticFile("fonts/bodoni-moda-italic-latin.woff2"), weight: "400 700", style: "italic" }),
  loadFont({ family: "Nunito Sans", url: staticFile("fonts/nunito-sans-normal-latin.woff2"), weight: "400 700" }),
  loadFont({ family: "Inter", url: staticFile("fonts/inter-var-latin.woff2"), weight: "100 900" }),
]);
