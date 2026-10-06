// WKConversions' faces (Inter Tight 800 headlines, Inter UI) and bFound's (Instrument Serif), latin cuts.
import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

export const fontsReady = Promise.all([
  loadFont({ family: "Inter Tight", url: staticFile("fonts/inter-tight-latin.woff2"), weight: "100 900" }),
  loadFont({ family: "Inter", url: staticFile("fonts/inter-latin.woff2"), weight: "100 900" }),
  loadFont({ family: "Instrument Serif", url: staticFile("fonts/instrument-serif.woff2"), weight: "400" }),
  loadFont({ family: "Instrument Serif", url: staticFile("fonts/instrument-serif-italic.woff2"), weight: "400", style: "italic" }),
]);
