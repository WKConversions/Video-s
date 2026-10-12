// Málaga Hideaway's faces (malagahideaway.com): Calistoga for display lines, Montserrat for everything else (SIL OFL).
import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

export const fontsReady = Promise.all([
  loadFont({ family: "Calistoga", url: staticFile("fonts/Calistoga-Regular-latin.woff2"), weight: "400" }),
  loadFont({ family: "Calistoga", url: staticFile("fonts/Calistoga-Regular-latin-ext.woff2"), weight: "400", unicodeRange: "U+0100-024F" }),
  loadFont({ family: "Montserrat", url: staticFile("fonts/Montserrat-Variable-100-900-latin.woff2"), weight: "100 900" }),
  loadFont({ family: "Montserrat", url: staticFile("fonts/Montserrat-Variable-100-900-latin-ext.woff2"), weight: "100 900", unicodeRange: "U+0100-024F" }),
]);
