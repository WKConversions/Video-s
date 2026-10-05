// Motion tokens and brand roles for the ClearScaler film. Colours are the site's own dark-mode tokens (clearscaler.com CSS:
// --cs-night, --night-1..3, --night-ink(-2/-3), --cs-orange, --success; OKLCH converted to sRGB), checked against
// brand.json (measured from the dark screenshots). Fonts: Outfit (display), Manrope (UI and body), Geist Mono (labels).
import { Easing } from "remotion";

export const C = {
  night: "#07080C", n1: "#101012", n2: "#19191B", n3: "#232426", line: "#2B2B2D",
  rule: "rgba(255,255,255,0.12)", ruleStrong: "rgba(255,255,255,0.22)",
  ink: "#EDEFF3", ink2: "#B0B1B3", ink3: "#8E8F91",
  orange: "#FC7F48", orangeSoft: "#541500", green: "#4BC680", greenSoft: "#162A12", red: "#FA686A",
  day: "#ECEAE4", inkDay: "#100C08",
};
export const F = { display: "Outfit", ui: "Manrope", mono: "Geist Mono" };
// The kinetic kit's roles (src/kinetic.tsx reads KIT.font/serif/ink/word/mark/under/strike).
export const KIT = { font: F.display, serif: F.display, ink: C.ink, word: C.orange, mark: C.orangeSoft, under: C.orange, strike: C.orange };

// Signature curve: the site's own emphasis ease (--ease-emphasis cubic-bezier(.16,1,.3,1)) for ~80% of arrivals;
// the site's --ease-out (.2,.7,.2,1) for UI responses; DEPART for exits; MOVE for reframes (motion/easing.md).
export const ARRIVE = Easing.bezier(0.16, 1, 0.3, 1);
export const UI = Easing.bezier(0.2, 0.7, 0.2, 1);
export const DEPART = Easing.bezier(0.55, 0, 0.9, 0.4);
export const MOVE = Easing.bezier(0.65, 0, 0.35, 1);
// Duration palette at 30 fps (precise premium; the site's --dur-2 .24s, --dur-3 .48s, --dur-4 .9s): quick 7, standard 14, slow 27.
export const D = { quick: 7, std: 14, slow: 27 };
export const SHADOW = {
  float: "0 30px 80px -24px rgba(0,0,0,0.6)",           // the site's --e-float in dark mode
  edge: "inset 0 1px 0 rgba(255,255,255,0.06)",         // --e1 in dark mode
};
export const R = { card: 14, pill: 999, btn: 10 };
export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
export const clamp01 = (t: number) => Math.min(1, Math.max(0, t));
