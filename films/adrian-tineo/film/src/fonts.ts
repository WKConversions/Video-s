// Adrian Tineo's face (adrian-tineo site): Manrope, variable 200–800, the only typeface on the site (SIL OFL).
import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

export const fontsReady = Promise.all([
  loadFont({ family: "Manrope", url: staticFile("fonts/manrope-latin-variable.woff2"), weight: "200 800" }),
]);
