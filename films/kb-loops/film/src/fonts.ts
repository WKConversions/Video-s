// The site's own fonts (kruslockbosconsultancy.com CSS): Montserrat (variable, every heading and line of text) and
// Copperplate CC Heavy (the "K.B" logotype; SIL OFL 1.1, public/fonts/OFL-copperplate-cc.txt).
import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

export const fontsReady = Promise.all([
  loadFont({ family: "Montserrat", url: staticFile("fonts/montserrat-var-latin.woff2"), weight: "100 900" }),
  loadFont({ family: "Montserrat", url: staticFile("fonts/montserrat-var-latin-ext.woff2"), weight: "100 900" }),
  loadFont({ family: "Copperplate CC", url: staticFile("fonts/copperplate-cc-heavy.otf"), weight: "800" }),
]);
