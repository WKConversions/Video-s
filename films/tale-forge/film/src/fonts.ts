// Tale Forge's own web fonts (tale-forge.app /_next/static/media, renamed in tale-forge-style-library/derived/typography/fonts/):
// Lora (variable 400–700) for display and story text, Schibsted Grotesk (variable 400–900) for UI, Cinzel 700 for the wordmark.
import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

export const fontsReady = Promise.all([
  loadFont({ family: "Lora", url: staticFile("fonts/Lora-var400-700-latin.woff2"), weight: "400 700" }),
  loadFont({ family: "Lora", url: staticFile("fonts/Lora-var400-700-latin-ext.woff2"), weight: "400 700" }),
  loadFont({ family: "Schibsted Grotesk", url: staticFile("fonts/SchibstedGrotesk-var400-900-latin.woff2"), weight: "400 900" }),
  loadFont({ family: "Schibsted Grotesk", url: staticFile("fonts/SchibstedGrotesk-var400-900-latin-ext.woff2"), weight: "400 900" }),
  loadFont({ family: "Cinzel", url: staticFile("fonts/Cinzel-700-latin.woff2"), weight: "700" }),
]);
