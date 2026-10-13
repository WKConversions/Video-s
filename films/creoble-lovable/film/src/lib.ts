// Creoble × the Lovable 2.0 launch film: Creoble's palette (creoble.dk: sage, forest, cream, terracotta, sand; Fraunces and
// DM Sans), pushed into the reference's big glowing gradients. The motion copies the reference: words blur in fast and
// settle, UI arrives with a long exponential ease-out, hard cuts on the beat.
import { Easing } from "remotion";

export const FPS = 30;
export const W = 1920, H = 1080;

export const C = {
  page: "#FAFAF8", cream: "#F4F3EF", paper: "#F6F2EC", white: "#FFFFFF", ink: "#1D1B19", muted: "#6B6B68", faint: "#A6A39C", line: "#E4E1D9",
  sage: "#87A89E", sageDeep: "#4A6B62", sageLight: "#A8C4BB", sageTint: "#EEF3F1", teal: "#4F6B66", forest: "#2F4A43",
  terra: "#C97B5A", terraDeep: "#A85F42", clay: "#F3E4DA", sand: "#EAD9C3", sandPale: "#F7EFE4",
  night: "#0B120F", night2: "#18221E", panel: "#1C2522", panel2: "#26302C",
  // the gradient stops: Creoble's forest, sage, terracotta and sand, lit up the way the reference lights its blue, pink and orange
  gDeep: "#1E4A3F", gTeal: "#3D8371", gSage: "#8FC0AE", gMint: "#D3EBE1", gTerra: "#E06F45", gCoral: "#EF8A66", gApricot: "#F7B276", gSand: "#FBE3C6",
  // the flower shop's own brand (the colours "Ret farverne" asks for)
  rose: "#B4475A", roseDeep: "#7C2A3A", blush: "#FBEFEC", plum: "#3B2229", petal: "#F3C9CF",
};
export const F = { ui: "DM Sans", serif: "Fraunces" };

/** The gradient the reference uses for type and marks (blue → pink → orange), in Creoble's colours. */
export const GRAD = `linear-gradient(90deg, ${C.gTeal} 0%, ${C.gSage} 34%, ${C.gCoral} 68%, ${C.gApricot} 100%)`;
export const GRAD_V = `linear-gradient(180deg, ${C.gCoral} 0%, ${C.gTerra} 35%, ${C.gSage} 72%, ${C.gTeal} 100%)`;

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
/** Exponential ease-out over n frames, decaying by r per frame (the reference's UI arrivals). */
export const expoOut = (n: number, r = 0.84) => (t: number) => {
  // cut off at n frames the exponential still moves 1-4 % of its range a frame and stops dead; the cubic term bleeds that speed
  // off over the last frames, so it lands at rest (same start speed, same end, still monotonic)
  const c = clamp01(t), q = Math.pow(r, n), v = n * Math.log(1 / r) * q / (1 - q);
  return (1 - Math.pow(r, c * n)) / (1 - q) + v * c * c * (1 - c);
};
export const ARRIVE = Easing.bezier(0.16, 1, 0.3, 1);
export const MOVE = Easing.bezier(0.65, 0, 0.35, 1);
export const SOFT = Easing.bezier(0.45, 0, 0.25, 1);
export const DEPART = Easing.bezier(0.55, 0, 0.9, 0.4);
/** 0..1 from frame a over n frames, eased. */
export const pr = (g: number, a: number, n: number, e: (t: number) => number = ARRIVE) => e(clamp01((g - a) / Math.max(1, n)));
/** Exponential arrival from frame a over n frames. */
export const px = (g: number, a: number, n: number, r = 0.84) => expoOut(n, r)(clamp01((g - a) / n));
/** Frame of a time in seconds. */
export const sf = (s: number) => Math.round(s * FPS);
/** A click from frame a: squeezed in 3 f, held 3 f, released in 4 f. */
export const press = (g: number, a: number) => g < a ? 0 : g < a + 3 ? (g - a) / 3 : g < a + 6 ? 1 : g < a + 10 ? 1 - (g - a - 6) / 4 : 0;

export const hex = (h: string) => { const n = parseInt(h.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
export const rgba = (h: string, a: number) => { const [r, g, b] = hex(h); return `rgba(${r},${g},${b},${a})`; };
export const mix = (a: string, b: string, t: number) => { const x = hex(a), y = hex(b); return `rgb(${x.map((v, i) => Math.round(lerp(v, y[i], clamp01(t)))).join(",")})`; };

/** A keyframed path: eased between keys (MOVE), with the velocity for the cursor's lean. */
export type Key = { f: number; x: number; y: number };
export const path = (g: number, keys: Key[], e: (t: number) => number = MOVE) => {
  const at = (q: number) => {
    if (q <= keys[0].f) return { x: keys[0].x, y: keys[0].y };
    for (let i = 0; i < keys.length - 1; i++) {
      const a = keys[i], b = keys[i + 1];
      if (q <= b.f) { const t = e(clamp01((q - a.f) / Math.max(1, b.f - a.f))); return { x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t) }; }
    }
    const l = keys[keys.length - 1]; return { x: l.x, y: l.y };
  };
  const p = at(g), q = at(g - 1);
  return { x: p.x, y: p.y, vx: p.x - q.x, vy: p.y - q.y };
};

export const SHADOW = "0 50px 100px -40px rgba(20,30,26,0.45), 0 2px 10px rgba(20,30,26,0.10)";
export const SHADOW_SOFT = "0 24px 50px -24px rgba(20,30,26,0.30), 0 1px 4px rgba(20,30,26,0.06)";
