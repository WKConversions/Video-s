// Moviqly film 2 ("Behind this prompt"). The platform's tokens, as in film 1 and measured again on the test site
// (19 Oct 2026, harvest/): warm paper #faf9f7, ink #26232c, hairline #e7e3ea, the brand trio purple #982aff, blue
// #3047ff, cyan #10dbed, the studio's violet checks #8853df, the canvas area's dot grid (#9783ab22, 15 px), DM Sans.
// Film 2's own motion identity (plan/storyboard.md): precise, no overshoot, things surface from depth.
// FJ is the fictional demo brand the films in the previews are made for ("Fjello", an outdoor-gear shop): pine,
// ember, sand, Fraunces headlines. It is never Moviqly's own look.
import { continueRender, delayRender, Easing, staticFile } from "remotion";
import { loadFont } from "@remotion/fonts";

export const C = {
  paper: "#FAF9F7", white: "#FFFFFF", ink: "#26232C", muted: "#6C6676", soft: "#9B95A5", line: "#E7E3EA", mist: "#F2EFF6",
  purple: "#982AFF", blue: "#3047FF", cyan: "#10DBED", violet: "#8853DF", lavender: "#EEE8FF", lavenderInk: "#4B2A9A",
  canvas: "#F8F6FB", dot: "#9783AB33", label: "#4F3E5E", detail: "#8D7F99", card: "#E8E0F0",
  button: "#171717", ok: "#22A06B", flag: "#E0526F",
};
export const GRAD = `linear-gradient(90deg, ${C.purple}, ${C.blue} 55%, ${C.cyan})`;
export const GRAD_D = `linear-gradient(135deg, ${C.purple}, ${C.blue} 55%, ${C.cyan})`;
export const FONT = "DM Sans";
export const SERIF = "Fraunces";
export const SHADOW = "0 1px 2px rgba(38,35,44,0.06), 0 10px 28px rgba(38,35,44,0.08)";
export const SHADOW_BIG = "0 2px 4px rgba(38,35,44,0.06), 0 30px 70px -20px rgba(38,35,44,0.25)";
export const SHADOW_DEEP = "0 4px 8px rgba(38,35,44,0.06), 0 50px 110px -30px rgba(60,40,110,0.35)";

// The fictional demo brand. Its film is drawn in code (shared.tsx FjFrame); its site is FjSite.
export const FJ = { pine: "#1F4D3B", deep: "#143528", ember: "#F07A2C", sand: "#F3EADB", snow: "#FFFFFF", ink: "#17201B", moss: "#5E8B6F", mist: "#DCE7DF" };

// Film 2's motion identity: precise, crafted, no overshoot (film 1 was playful, with POP).
export const LAND = Easing.bezier(0.2, 0.9, 0.1, 1);            // the signature: things land from depth, long precise settle
export const CRAFT = Easing.bezier(0.76, 0, 0.24, 1);           // carries and depth moves: firm in, firm out
export const SNAP = Easing.bezier(0.3, 0.8, 0.2, 1);            // UI state changes, checks
export const LEAVE = Easing.bezier(0.6, 0, 0.9, 0.4);           // exits into depth
export const LIN = (t: number) => t;

const fontHandle = typeof window !== "undefined" ? delayRender("fonts") : null;
if (typeof window !== "undefined") {
  Promise.all([
    loadFont({ family: FONT, url: staticFile("fonts/dmsans.woff2"), weight: "100 1000" }),
    loadFont({ family: SERIF, url: staticFile("fonts/fraunces.woff2"), weight: "100 900" }),
  ]).then(() => fontHandle !== null && continueRender(fontHandle));
}

export const clamp01 = (t: number) => Math.min(1, Math.max(0, t));
export const mix = (a: number, b: number, k: number) => a + (b - a) * k;
