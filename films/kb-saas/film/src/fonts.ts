// K.B's faces (brand.json): Montserrat for everything, Copperplate CC Heavy for the K.B logotype only.
import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

export const fontsReady = Promise.all([
  loadFont({ family: "Montserrat", url: staticFile("fonts/montserrat-var-latin.woff2"), weight: "100 900" }),
  loadFont({ family: "Copperplate", url: staticFile("fonts/copperplate-cc-heavy.otf"), weight: "800" }),
]);
