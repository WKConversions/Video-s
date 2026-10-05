import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

export const fontsReady = Promise.all([
  loadFont({ family: "Manrope", url: staticFile("fonts/manrope-regular.ttf"), weight: "400" }),
  loadFont({ family: "Manrope", url: staticFile("fonts/manrope-medium.ttf"), weight: "500" }),
  loadFont({ family: "Manrope", url: staticFile("fonts/manrope-semibold.ttf"), weight: "600" }),
  loadFont({ family: "Manrope", url: staticFile("fonts/manrope-bold.ttf"), weight: "700" }),
]);
