// VoxFlow's look, measured on voxflow.nl (harvest/pages/home.json): warm cream page, deep teal, white cards with soft
// wide shadows, Inter 800 headlines with the key word in teal, Geist for the interface.
import { Easing } from "remotion";
import { T } from "./clock";

export const C = {
  page: "#F4F2EB", page2: "#F4F1EA", card: "#FCFAF6", white: "#FFFFFF",
  ink: "#16221F", txt2: "#54635E", txt3: "#6B7672", line: "#E4E0D6", beige: "#EFEBE1",
  teal: "#0F6E6A", tealDeep: "#0A4F4A", tealSoft: "#DBEBE9", tealPale: "#E9F3F1",
  red: "#C8473D", redSoft: "#F8E3E0", night: "#123A37",
};
export const F = { display: "Inter", ui: "Geist" };
/** kinetic.tsx's roles. */
export const KIT = { font: "Inter", serif: "Inter", ink: C.ink, word: C.teal, mark: C.tealSoft, under: C.teal, strike: C.teal };

export const ARRIVE = Easing.bezier(0.16, 1, 0.3, 1);      // the signature curve: expo-out
export const MOVE = Easing.bezier(0.65, 0, 0.35, 1);
export const SOFT = Easing.bezier(0.45, 0, 0.25, 1);       // a soft start for colour fields
export const DEPART = Easing.bezier(0.55, 0, 0.9, 0.4);
export const LIN = (t: number) => t;
export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const sec = (g: number) => g / 30;
/** Progress of a move that starts at a label (or label±s): 0..1, eased (expo-out by default). */
export const k = (g: number, pos: string | number, dur: number, ease: (t: number) => number = ARRIVE) => T.k(g, pos, dur, ease);
/** An element's life: in at `a`, out at `b`. s is a scale factor for arrivals, o the opacity. */
export const life = (g: number, a: string | number, b?: string | number, dIn = 0.5, dOut = 0.4) => {
  const u = k(g, a, dIn), e = b ? k(g, b, dOut, MOVE) : 0;
  return { u, e, o: clamp01(u * 1.5) * (1 - e), on: u > 0 && e < 1 };
};
export const hex = (h: string) => { const n = parseInt(h.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
export const rgba = (h: string, a: number) => { const [r, g, b] = hex(h); return `rgba(${r},${g},${b},${a})`; };
export const mix = (a: string, b: string, t: number) => {
  const x = hex(a), y = hex(b);
  return `rgb(${x.map((v, i) => Math.round(lerp(v, y[i], clamp01(t)))).join(",")})`;
};
/** Absolute placement by centre, on transforms only (left/top snap to whole pixels under the camera). */
export const at = (x: number, y: number, s = 1, o = 1, extra = ""): React.CSSProperties =>
  ({ position: "absolute", left: 0, top: 0, transform: `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(${s}) ${extra}`, opacity: o });
export const SHADOW = "0 30px 60px -28px rgba(22,34,31,0.28), 0 2px 6px rgba(22,34,31,0.06)";
export const SHADOW_SOFT = "0 24px 50px -30px rgba(22,34,31,0.30)";
