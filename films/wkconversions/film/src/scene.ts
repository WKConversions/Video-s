// The state of every object at frame g: pure functions of the frame and the labels (src/clock.ts). The World (SVG)
// and the cards (screen-facing HTML) both read from here, so a card and the block it grows out of always agree.
import { T } from "./clock";
import { ARRIVE, MOVE, clamp01, lerp } from "./lib";
import { EASE } from "./kinetic";
import { View, proj } from "./iso";
import { Biz, COMP, YOU, centre } from "./map";
import { VIEW } from "./cam";

export const k = (g: number, pos: string | number, dur: number, ease: (t: number) => number = ARRIVE) => T.k(g, pos, dur, ease);
export const sec = (g: number) => g / 30;
export const after = (g: number, pos: string) => sec(g) >= T.s(pos);
export const between = (g: number, a: string, b: string) => sec(g) >= T.s(a) && sec(g) < T.s(b);
export { VIEW };

// ---------- the two businesses ----------
/** Your business: 64 high; it grows a floor when WKConversions comes in, and rises above the city at the sign-off. */
export const youH = (g: number) => 72 + 40 * k(g, "comes", 0.7, EASE.soft) + 110 * k(g, "fin", 1.1, EASE.soft) + 95 * k(g, "standout2", 1.0, EASE.soft);
/** Grey until the sign-off, then the brand blue (the site's accent) from the roof down. */
export const youBlue = (g: number) => k(g, "fin", 0.9, MOVE);
export const youEdge = (g: number) => k(g, "comes", 0.45);
/** The competitor stands out first: it rises on "stand out" and lowers with the rest of the city at the sign-off. */
export const compH = (g: number) => (108 + 66 * k(g, "standout", 0.75, EASE.soft)) * cityScale(g);
/** Everything but you lowers a little on "built to stand out". */
export const cityScale = (g: number) => 1 - 0.24 * k(g, "standout2", 1.1, EASE.soft);
/** The city rises out of the paper in the first second and a half, in a wave out from the square between the two. */
export const riseOf = (g: number, b: Biz) => {
  const [x, y] = centre(b), d = Math.hypot(x - 75, y - 75);
  return ARRIVE(clamp01((sec(g) - d / 1900) / 0.7));
};
/** The market is alive: a slow swell rolls through the city's heights (never yours or the competitor's). */
export const swell = (g: number, b: Biz) => {
  const [x, y] = centre(b), t = sec(g);
  return 11 * Math.sin((x * 0.6 + y * 0.8) / 150 - t * 1.9 + b.i * 0.7) + 5 * Math.sin((x * 0.9 - y * 0.4) / 110 + t * 1.3);
};
export const heightOf = (g: number, b: Biz) => riseOf(g, b) * (b.role === "you" ? youH(g) : b.role === "comp" ? compH(g) : Math.max(12, b.h + swell(g, b)) * cityScale(g));

/** The screen point of a block's roof centre (plus a lift above it), in the world's view at frame g. */
export const roofAt = (g: number, b: Biz, lift = 0, v: View = VIEW(g)): [number, number] => {
  const [x, y] = centre(b);
  return proj(v, x, y, heightOf(g, b) + lift);
};
export const youRoof = (g: number, lift = 0) => roofAt(g, YOU, lift);
export const compRoof = (g: number, lift = 0) => roofAt(g, COMP, lift);

// ---------- ground rings: [centre block, start label, delay s, colour, max radius] ----------
export type RingEv = { b: Biz; at: string; d: number; col: string; R: number; dur: number; w: number; o: number };
const INK = "#575E68", BLUE = "#3F8CE8";
export const RINGS: RingEv[] = [
  ...[0, 0.35].map((d) => ({ b: COMP, at: "standout", d, col: INK, R: 330, dur: 1.5, w: 6, o: 0.22 })),
  ...[0, 0.6, 1.2, 1.8].map((d) => ({ b: COMP, at: "comm", d, col: INK, R: 420, dur: 1.8, w: 6, o: 0.2 })),
  ...[0, 0.3].map((d) => ({ b: YOU, at: "comes", d, col: BLUE, R: 380, dur: 1.4, w: 8, o: 0.32 })),
  ...[0, 0.55, 1.1, 1.65, 2.2, 2.75].map((d) => ({ b: YOU, at: "attract", d, col: BLUE, R: 520, dur: 1.9, w: 8, o: 0.3 })),
  ...[0, 0.4, 0.8].map((d) => ({ b: YOU, at: "standout2", d, col: BLUE, R: 620, dur: 2.0, w: 9, o: 0.3 })),
  ...[0, 0.5].map((d) => ({ b: YOU, at: "convert", d, col: BLUE, R: 520, dur: 1.6, w: 8, o: 0.3 })),
];
export const ringState = (g: number, r: RingEv) => {
  const u = (sec(g) - T.s(r.at) - r.d) / r.dur;
  if (u <= 0 || u >= 1) return null;
  return { rad: lerp(110, r.R, EASE.whipOut(u)), o: r.o * (1 - u) * clamp01(u * 8) };
};

// ---------- routes: the site's routed blue line, along the streets ----------
export type Route = { pts: [number, number][]; at: string; dur: number; ease?: (t: number) => number };
/** "That's where WKConversions": the line comes in along the streets from beyond the frame and ends at your lot. */
export const TURN_ROUTE: Route = { pts: [[-1650, -550], [-300, -550], [-300, -300], [200, -300], [200, -175]], at: "turn", dur: 1.05, ease: EASE.steady };
/** "Creative": routes leave your lot along the streets in four directions. */
export const OUT_ROUTES: Route[] = [
  { pts: [[450, -300], [1050, -300], [1050, -800], [1800, -800]], at: "creative", dur: 1.2 },
  { pts: [[450, -50], [450, 700], [950, 700], [950, 1500]], at: "creative+0.12", dur: 1.25 },
];
export const routeK = (g: number, r: Route) => k(g, r.at, r.dur, r.ease ?? EASE.steady);
