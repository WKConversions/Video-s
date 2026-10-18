// K.B.'s tokens, measured from the site (test.k-b.workers.dev, October 2026): an off-white ground #fcfcfa, white
// cards with a hairline border and a soft navy shadow, the navy brand gradient #344a65 → #3f5878, ink #172c43, slate
// for the second line of a statement (#3f607d) and for muted text (#55677a / #698096), the hairline #dce4e9, and one
// cool accent: the cyan of the site's AI glows and status dots (#218ab3, light #66b8db). Montserrat (variable, 600 for
// headlines with tight tracking, 500 for UI); the K.B logo is set in Copperplate. Radius 24.
import { continueRender, delayRender, Easing, staticFile } from "remotion";
import { loadFont } from "@remotion/fonts";

export const C = {
  bg: "#FCFCFA", white: "#FFFFFF", ink: "#172C43", navy: "#344A65", navy2: "#3F5878", slate: "#3F607D", muted: "#55677A", soft: "#698096",
  faint: "#AEBFCD", line: "#DCE4E9", mist: "#EEF2F5", cloud: "#F4F6F8",
  cyan: "#218AB3", cyanLight: "#66B8DB", cyanTint: "#E6F3F9", cyanDeep: "#1981AC",
  // the management gate: a calm navy with a pale navy tint (no orange: the brand has no warm colour)
  gate: "#344A65", gateTint: "#E9EEF4",
  ok: "#2E9E6B", okTint: "#E5F4EC",          // success only (approved, sent, replied), used sparingly
};
export const GRAD = `linear-gradient(90deg, ${C.navy}, ${C.navy2})`;
export const FONT = "Montserrat";
export const LOGO_FONT = "Copperplate";
export const RADIUS = 24;
// the site's card: white, hairline border, soft navy shadow
export const SHADOW = "0 24px 50px -25px rgba(41,58,81,0.20), 0 4px 12px rgba(41,58,81,0.05)";
export const SHADOW_BIG = "0 46px 95px -24px rgba(41,58,81,0.33), 0 18px 38px -14px rgba(41,58,81,0.22), 0 4px 12px rgba(41,58,81,0.06)";

export const ARRIVE = Easing.bezier(0.16, 1, 0.3, 1);          // the signature curve: a fast start, a long soft landing
export const MOVE = Easing.bezier(0.65, 0, 0.35, 1);           // carries and camera moves
export const DEPART = Easing.bezier(0.55, 0, 0.85, 0.3);
export const SNAP = Easing.bezier(0.2, 0.9, 0.25, 1);          // UI state changes
export const POP = Easing.bezier(0.3, 1.3, 0.6, 1);            // a small overshoot, only for small things (chips, dots, checks)
export const LIN = (t: number) => t;

const fontHandle = typeof window !== "undefined" ? delayRender("fonts") : null;
if (typeof window !== "undefined") {
  Promise.all([
    loadFont({ family: FONT, url: staticFile("fonts/montserrat.woff2"), weight: "100 900" }),
    loadFont({ family: LOGO_FONT, url: staticFile("fonts/copperplate-heavy.otf"), weight: "700" }),
  ]).then(() => fontHandle !== null && continueRender(fontHandle));
}

export const clamp01 = (t: number) => Math.min(1, Math.max(0, t));
export const mix = (a: number, b: number, k: number) => a + (b - a) * k;
