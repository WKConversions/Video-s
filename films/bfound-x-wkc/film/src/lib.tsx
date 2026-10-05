// Tokens, curves and time helpers for the bFound × WKConversions film (1080×1920, 60 fps, 42.98 s).
// Two brands, never blended: bFound's world (top panel) moves softly with its own curve and serif voice;
// WKConversions' world (bottom panel) moves crisp and quick on the site's ease, in Inter Tight.
import { Easing } from "remotion";

export const FPS = 60;
export const DURATION = 2579; // 42.983 s, the length of the source video

export const WK = {
  page: "#F7F7F8", dot: "#D6D9DE", card: "#FFFFFF", card2: "#EFF0F2", line: "#E2E3E6",
  ink: "#050F19", txt2: "#575E68", txt3: "#838A94", faint: "#C9CED4",
  blue: "#3F8CE8", blueDeep: "#2F7AD4", blueText: "#1266C9", soft: "#E6F0FD",
  head: "'Inter Tight', 'Inter', sans-serif", body: "'Inter', sans-serif",
  shadow: "0 60px 128px -60px rgba(5,15,25,.40)",
};

export const BF = {
  bg: "#fdfdff", ink: "#485e9d", logo: "#3c549c", fg: "#131a2d", muted: "#5c6375",
  mist: "#eff3ff", cream: "#fdf8da", lilac: "#fbf4fc", border: "#e1e4ed", peri: "#c5caf5", peri2: "#7e9be9",
  serif: "'Instrument Serif', serif", body: "'Inter', sans-serif",
  shadow: "0 40px 80px -32px rgba(72,94,157,.30)",
};

export const E = {
  wk: Easing.bezier(0.22, 1, 0.36, 1),       // WKC arrival: fast start, long soft settle
  wkMove: Easing.bezier(0.65, 0, 0.35, 1),   // WKC moves between states
  bf: Easing.bezier(0.4, 0, 0.2, 1),         // bFound's site ease: unhurried
  out: Easing.bezier(0.55, 0, 0.9, 0.4),     // departures
  lin: (x: number) => x,
};

export const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
export const lerp = (a: number, b: number, p: number) => a + (b - a) * p;
/** Progress of a move that starts at `start` and lasts `dur` seconds. */
export const k = (t: number, start: number, dur: number, ease: (x: number) => number = E.wk) => ease(clamp01((t - start) / dur));
/** Keyframes: [time, value, ease into this key]. */
export type Key = [number, number, ((x: number) => number)?];
export const kf = (t: number, keys: Key[]) => {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 0; i < keys.length - 1; i++) {
    const [t0, v0] = keys[i];
    const [t1, v1, e] = keys[i + 1];
    if (t < t1) return v0 + (v1 - v0) * (e ?? E.lin)(clamp01((t - t0) / (t1 - t0)));
  }
  return keys[keys.length - 1][1];
};
/** Visibility of something that arrives at a (over din) and is gone by b (leaving over dout). */
export const win = (t: number, a: number, b: number, din = 0.4, dout = 0.3, ein: (x: number) => number = E.wk) =>
  Math.min(ein(clamp01((t - a) / din)), 1 - E.out(clamp01((t - (b - dout)) / dout)));

/** The spoken words (force-aligned with faster-whisper small + medium.en, checked against the loudness envelope). */
export const W = {
  pickup: 2.55, hey: 3.42, emma: 3.95, yeah1: 5.2, saw: 6.08, comment: 6.36, amazing: 7.2, right: 7.6,
  yeah2: 9.38, isnt: 9.8, way: 10.8, help: 11.62, others: 12.24, asWell: 12.62,
  yeah3: 15.05, collab: 17.4,
  yeah4: 20.45, normal: 21.35, thousand: 22.5, starting: 24.38, out: 24.64, our: 25.95, four: 26.94,
  collaborating: 28.5, minus: 29.68, fifty: 30.02, pct: 30.58, code: 32.12, bfound50: 32.38,
  letsHelp: 34.8, help2: 35.4, other: 35.62, people: 36.2,
  allRight: 37.98, excited: 38.98, make: 40.06, happen: 40.38,
};
