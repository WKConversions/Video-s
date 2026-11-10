// Unicorn Founders Malaga: brand tokens (measured from ufm.fuf-16d.workers.dev/css/styles.css), the word clock and
// the motion identity. Apple style: a calm cream stage, all motion in the foreground. One signature curve for arrivals
// (a fast start, a long soft settle), one for morphs and travel (symmetric), never past the target size.
import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";
import WORDS from "./words.json";

export const FPS = 60;
export const SIZE = 1080;
export const DUR = 41;

export const C = {
  cream: "#FAF7F2", paper: "#F0EAE3", ink: "#292929", bronze: "#806750", sand: "#BAA48F", line: "#D9D0C7",
  muted: "#6B645D", night: "#1C1B1A", glow: "#E0C6AD",
};
export const SERIF = "'Bodoni Moda', 'Bodoni 72', Didot, Georgia, serif";
export const SANS = "'Nunito Sans', 'Avenir Next', Avenir, sans-serif";

export const fontsReady = Promise.all([
  loadFont({ family: "Bodoni Moda", url: staticFile("fonts/bodoni-moda-normal-latin.woff2"), weight: "400 900", style: "normal" }),
  loadFont({ family: "Bodoni Moda", url: staticFile("fonts/bodoni-moda-italic-latin.woff2"), weight: "400 900", style: "italic" }),
  loadFont({ family: "Nunito Sans", url: staticFile("fonts/nunito-sans-normal-latin.woff2"), weight: "200 1000" }),
]);

const W = WORDS as Record<string, number>;
/** the voice-over's word start (seconds), e.g. w("meet"), w("connection2", -0.1) */
export const w = (k: string, off = 0) => {
  const v = W["w:" + k];
  if (v === undefined) throw new Error("no word " + k);
  return v + off;
};

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const bez = (x1: number, y1: number, x2: number, y2: number) => (t: number) => {
  let u = t;
  for (let i = 0; i < 8; i++) {
    const x = 3 * (1 - u) * (1 - u) * u * x1 + 3 * (1 - u) * u * u * x2 + u * u * u - t;
    const dx = 3 * (1 - u) * (1 - u) * x1 + 6 * (1 - u) * u * (x2 - x1) + 3 * u * u * (1 - x2);
    if (Math.abs(dx) < 1e-6) break;
    u = clamp01(u - x / dx);
  }
  return 3 * (1 - u) * (1 - u) * u * y1 + 3 * (1 - u) * u * u * y2 + u * u * u;
};
export const OUT = bez(0.16, 1, 0.3, 1);      // arrivals
export const MOVE = bez(0.65, 0, 0.35, 1);    // morphs and travel
export const SOFT = bez(0.45, 0, 0.55, 1);    // light, fades
/** eased 0..1 from time a over d seconds */
export const p = (t: number, a: number, d: number, e = OUT) => e(clamp01((t - a) / Math.max(1e-3, d)));
/** keyframed value: [[time, value], ...], eased per segment */
export const kf = (t: number, keys: [number, number][], e = MOVE) => {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 0; i < keys.length - 1; i++) {
    const [t0, v0] = keys[i], [t1, v1] = keys[i + 1];
    if (t < t1) return t1 <= t0 ? v1 : lerp(v0, v1, e((t - t0) / (t1 - t0)));
  }
  return keys[keys.length - 1][1];
};
