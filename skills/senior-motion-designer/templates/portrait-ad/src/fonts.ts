// The site's own font (bingua.app CSS: Inter Variable), latin subset from Google Fonts (SIL OFL).
import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

export const fontsReady = Promise.all([loadFont({ family: "Inter", url: staticFile("fonts/inter-var-latin.woff2"), weight: "100 900" })]);
