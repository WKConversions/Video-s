// Vendom's face: Poppins (used on vendom-pro.com; SIL OFL), latin, 300–600.
import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

export const fontsReady = Promise.all(
  ["300", "400", "500", "600"].map((w) => loadFont({ family: "Poppins", url: staticFile(`fonts/Poppins-${w}-latin.woff2`), weight: w })),
);
