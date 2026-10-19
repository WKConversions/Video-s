// Moviqly's tokens, measured from the app (the read-only tour of 19 Oct 2026, harvest/shots): warm paper #faf9f7,
// ink #26232c, hairline #e7e3ea, soft #f2eff6; the brand trio purple #982aff, blue #3047ff, cyan #10dbed (the landing
// glow: purple from the bottom left, blue in the middle, cyan from the bottom right, fading up into paper); black
// buttons #171717; lavender user bubbles; purple check marks; DM Sans throughout. Rounded, soft, friendly SaaS.
import { continueRender, delayRender, Easing, staticFile } from "remotion";
import { loadFont } from "@remotion/fonts";

export const C = {
  paper: "#FAF9F7", white: "#FFFFFF", ink: "#26232C", muted: "#6C6676", soft: "#9B95A5", line: "#E7E3EA", mist: "#F2EFF6",
  purple: "#982AFF", blue: "#3047FF", cyan: "#10DBED", violet: "#7C3AED", lavender: "#EEE8FF", lavenderInk: "#4B2A9A",
  button: "#171717", ok: "#22A06B",
};
export const GRAD = `linear-gradient(90deg, ${C.purple}, ${C.blue} 55%, ${C.cyan})`;
export const GRAD_D = `linear-gradient(135deg, ${C.purple}, ${C.blue} 55%, ${C.cyan})`;
export const FONT = "DM Sans";
export const SHADOW = "0 1px 2px rgba(38,35,44,0.06), 0 10px 28px rgba(38,35,44,0.08)";
export const SHADOW_BIG = "0 2px 4px rgba(38,35,44,0.06), 0 30px 70px -20px rgba(38,35,44,0.25)";

export const ARRIVE = Easing.bezier(0.16, 1, 0.3, 1);          // the signature curve: fast start, long soft landing
export const MOVE = Easing.bezier(0.65, 0, 0.35, 1);           // carries and camera
export const DEPART = Easing.bezier(0.55, 0, 0.85, 0.3);
export const SNAP = Easing.bezier(0.2, 0.9, 0.25, 1);          // UI state changes
export const POP = Easing.bezier(0.3, 1.35, 0.6, 1);           // small overshoot: chips, checks, dots, buttons (Moviqly is playful)
export const LIN = (t: number) => t;

const fontHandle = typeof window !== "undefined" ? delayRender("fonts") : null;
if (typeof window !== "undefined") {
  loadFont({ family: FONT, url: staticFile("fonts/dmsans.woff2"), weight: "100 1000" }).then(() => fontHandle !== null && continueRender(fontHandle));
}

export const clamp01 = (t: number) => Math.min(1, Math.max(0, t));
export const mix = (a: number, b: number, k: number) => a + (b - a) * k;
