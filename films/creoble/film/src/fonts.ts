// Creoble's faces (creoble.dk): Fraunces for headings (italic for the accent word), DM Sans for everything else (SIL OFL).
import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

export const fontsReady = Promise.all([
  loadFont({ family: "Fraunces", url: staticFile("fonts/Fraunces-normal-latin.woff2"), weight: "300 700", style: "normal" }),
  loadFont({ family: "Fraunces", url: staticFile("fonts/Fraunces-italic-latin.woff2"), weight: "300 700", style: "italic" }),
  loadFont({ family: "DM Sans", url: staticFile("fonts/DMSans-normal-latin.woff2"), weight: "300 700" }),
]);
