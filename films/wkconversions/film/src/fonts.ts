// The site's own faces (wkconversions.com /assets/fonts): Inter Tight (headlines, 800) and Inter (UI), latin variable cuts.
import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

export const fontsReady = Promise.all([
  loadFont({ family: "Inter Tight", url: staticFile("fonts/inter-tight-latin.woff2"), weight: "100 900" }),
  loadFont({ family: "Inter", url: staticFile("fonts/inter-latin.woff2"), weight: "100 900" }),
]);
