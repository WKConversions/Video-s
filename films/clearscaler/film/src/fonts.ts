// The site's own variable fonts (clearscaler.com /assets/*.woff2): Outfit for display, Manrope for UI and body,
// Geist Mono for labels and URLs.
import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

export const fontsReady = Promise.all([
  loadFont({ family: "Outfit", url: staticFile("fonts/outfit-var.woff2"), weight: "500 600" }),
  loadFont({ family: "Manrope", url: staticFile("fonts/manrope-var.woff2"), weight: "200 800" }),
  loadFont({ family: "Geist Mono", url: staticFile("fonts/geist-mono-var.woff2"), weight: "400 600" }),
]);
