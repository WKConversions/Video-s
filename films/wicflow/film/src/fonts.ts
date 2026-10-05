// The site's own faces: Space Grotesk (h1–h4, OG card; variable 400–700 from Google Fonts, the site ships the 600 cut)
// and Manrope (body and UI; variable 400–800).
import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

export const fontsReady = Promise.all([
  loadFont({ family: "Space Grotesk", url: staticFile("fonts/spacegrotesk-var.woff2"), weight: "400 700" }),
  loadFont({ family: "Manrope", url: staticFile("fonts/manrope-var.woff2"), weight: "400 800" }),
]);
