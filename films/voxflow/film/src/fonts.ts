// VoxFlow's faces: Inter (800 headlines) and Geist (interface), latin cuts.
import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

export const fontsReady = Promise.all([
  loadFont({ family: "Inter", url: staticFile("fonts/inter-latin.woff2"), weight: "100 900" }),
  loadFont({ family: "Geist", url: staticFile("fonts/geist-latin.woff2"), weight: "100 900" }),
]);
