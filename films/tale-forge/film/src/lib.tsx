// Motion tokens and brand roles for the Tale Forge film. Colours: the client's brief (violet #6D4FE0, gold #F2B22E,
// night #171232, warm light #FFF7E9) plus the site's own tokens (tale-forge-style-library/tokens/color.css:
// --violet-soft #9b87f5, --gold-soft #f5c542, --page-ink #fff7e9, --card #0f1628ad, --btn-grad, --btn-ink #3a2b10).
// Fonts: Lora (display, --display), Schibsted Grotesk (UI, --ui), Cinzel (wordmark).
import { Easing, interpolate } from "remotion";

export const C = {
  violet: "#6D4FE0", violetSoft: "#9B87F5", violetInk: "#5B3FC7",
  gold: "#F2B22E", goldSoft: "#F5C542", goldPale: "#FFE08A", goldInk: "#FFD98F",
  night: "#171232", nightDeep: "#0C0A1F", nightMid: "#241A52",
  warm: "#FFF7E9", warm2: "#FBE7C2", ember: "#E79A3C",
  plum: "#241F35", sub: "#D9CFEE", cardInk: "#F2EEFF",
  card: "rgba(15,22,40,0.68)", cardLine: "rgba(155,135,245,0.26)",
  btnInk: "#3A2B10",
  silhouette: "#171232",
};
export const F = { display: "Lora", ui: "Schibsted Grotesk", wordmark: "Cinzel" };

// Signature curve: the site's own "settle" cubic-bezier(.2,.7,.3,1) (screen enter, .reveal, tfStartIn) for arrivals.
// Breaths and idle loops use ease-in-out (the site's float1/float2/twinkle keyframes). No overshoot (calm brief).
export const SETTLE = Easing.bezier(0.2, 0.7, 0.3, 1);
export const MOVE = Easing.bezier(0.65, 0, 0.35, 1);
export const SOFT = Easing.bezier(0.45, 0, 0.55, 1);
export const DEPART = Easing.bezier(0.55, 0, 0.9, 0.4);
// Duration palette (s): ui 0.45 (tfStartIn), draw 0.9 (the map path), bloom 1.6 (paint and light), loop 7–9.
export const D = { ui: 0.45, draw: 0.9, bloom: 1.6, slow: 2.4 };

export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
export const clamp01 = (t: number) => Math.min(1, Math.max(0, t));
/** eased 0..1 between two frames */
export const tw = (g: number, a: number, b: number, ease = SETTLE) =>
  interpolate(g, [a, Math.max(a + 1, b)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
/** 1 inside [a,b], fading in/out over `fin`/`fout` frames */
export const win = (g: number, a: number, b: number, fin = 12, fout = 12) =>
  Math.min(tw(g, a, a + fin, SOFT), 1 - tw(g, b - fout, b, SOFT));
/** the site's idle float: ease-in-out pendulum, amplitude px, period s */
export const float = (g: number, amp: number, period: number, phase = 0, fps = 30) => {
  const t = ((g / fps + phase) % period) / period;
  const u = t < 0.5 ? t * 2 : 2 - t * 2;
  return amp * (SOFT(u) - 0.5) * 2;
};
/** seeded random */
export const rand = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

export const GLOW = {
  gold: "0 0 34px rgba(245,197,66,0.45)",
  btn: "0 14px 40px rgba(245,197,66,0.28)",
  card: "0 18px 44px rgba(5,8,20,0.42)",
};
