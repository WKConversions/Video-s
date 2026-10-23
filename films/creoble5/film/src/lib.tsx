// Creoble v4 (Danish), in Creoble's own brand kit (brand/BRANDKIT.md, 21 Oct 2026) and its site (creoble.dk):
// background #fafaf8, text #1a1614, sage #87a89e (primary), light sage #a8c4bb; the site's italic accent words in a
// deep sage (#495d58, measured), its cards cream #f7f4ed with a #e8e5df hairline, its buttons a near-black pill with
// cream text (DM Sans 500), its help bubble a dark sage (#4a6b62). Type: Fraunces 400 (headlines, the wordmark:
// −0.025em) with italic key words; DM Sans 400/500 for UI, labels 500 uppercase with wide tracking.
// HOLM is the example client's site that Creoble builds in the film (a fictional physiotherapy clinic): its own calm
// slate-teal look, so it never reads as Creoble's UI.
import { continueRender, delayRender, Easing, staticFile } from "remotion";
import { loadFont } from "@remotion/fonts";

export const C = {
  bg: "#FAFAF8", ink: "#1A1614", sage: "#87A89E", sageLight: "#A8C4BB", sageDeep: "#495D58", sageDark: "#4A6B62", sageTint: "#E7EFEC",
  card: "#F7F4ED", line: "#E8E5DF", muted: "#6B6560", soft: "#A39E97", white: "#FFFFFF", cream: "#F5F1EA", btnText: "#F7F4ED",
};
export const HOLM = { bg: "#F4F1EC", ink: "#1F2A2E", accent: "#2E4A52", tint: "#E3E9E8", muted: "#5E6A6D" };
export const SERIF = "Fraunces";
export const SANS = "DM Sans";
// Apple-style layered shadows (v5, Karl: "UIs with drop shadow same as Apple style"): a fine contact line, a soft
// mid shadow and a big diffuse ambient one, warm-tinted for the cream ground. appleShadow(a, b): a = strength 0..1,
// b = 0 for small UI (chips, pills, buttons) .. 1 for hero UI (the browser, the phone, big cards).
const SH_SMALL = [[0, 0.5, 1, 0, 0.08], [0, 2, 6, 0, 0.06], [0, 10, 24, 0, 0.08], [0, 24, 48, -8, 0.10]];
const SH_BIG = [[0, 1, 2, 0, 0.07], [0, 6, 16, 0, 0.06], [0, 24, 56, 0, 0.10], [0, 60, 120, -24, 0.20]];
export const appleShadow = (a = 1, b = 0) => SH_SMALL.map((l, i) => {
  const m = (j: number) => l[j] + (SH_BIG[i][j] - l[j]) * b;
  return `${m(0)}px ${m(1).toFixed(2)}px ${m(2).toFixed(1)}px ${m(3).toFixed(1)}px rgba(26,22,20,${(m(4) * a).toFixed(3)})`;
}).join(", ");
export const SHADOW = appleShadow(1, 0);
export const SHADOW_BIG = appleShadow(1, 1);
/** the same look for irregular shapes (SVG, cut-outs) */
export const DROP = "drop-shadow(0 2px 3px rgba(26,22,20,0.08)) drop-shadow(0 12px 22px rgba(26,22,20,0.12))";
export const DROP_BIG = "drop-shadow(0 3px 6px rgba(26,22,20,0.08)) drop-shadow(0 30px 50px rgba(26,22,20,0.16))";

// v4's motion identity: calm, editorial, precise. Lines are revealed through a mask (the site's editorial feel),
// objects settle (a short scale and fade), nothing overshoots or blurs in.
export const OUT = Easing.bezier(0.22, 1, 0.36, 1);        // the signature: arrivals and reveals, long soft landing
export const INOUT = Easing.bezier(0.65, 0, 0.35, 1);      // carries, morphs, frame expansions
export const WIPE = Easing.bezier(0.77, 0, 0.175, 1);      // mask wipes and Apple-style reveals
export const EXIT = Easing.bezier(0.55, 0, 0.75, 0.2);     // leaving
export const LIN = (t: number) => t;

const fontHandle = typeof window !== "undefined" ? delayRender("fonts") : null;
if (typeof window !== "undefined") {
  Promise.all([
    loadFont({ family: SANS, url: staticFile("fonts/dmsans.woff2"), weight: "100 1000" }),
    loadFont({ family: SERIF, url: staticFile("fonts/fraunces.woff2"), weight: "100 900", style: "normal" }),
    loadFont({ family: SERIF, url: staticFile("fonts/fraunces-italic.woff2"), weight: "100 900", style: "italic" }),
  ]).then(() => fontHandle !== null && continueRender(fontHandle));
}

export const clamp01 = (t: number) => Math.min(1, Math.max(0, t));
export const mix = (a: number, b: number, k: number) => a + (b - a) * k;
