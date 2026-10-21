// Loads the film's one font, DM Sans (TNOA's site uses the system sans; DM Sans stands in for it in the render).
import { continueRender, delayRender, staticFile } from "remotion";
import { loadFont } from "@remotion/fonts";

const fontHandle = typeof window !== "undefined" ? delayRender("fonts") : null;
if (typeof window !== "undefined") {
  loadFont({ family: "DM Sans", url: staticFile("fonts/dmsans.woff2"), weight: "100 1000" })
    .then(() => fontHandle !== null && continueRender(fontHandle));
}
