// The market map: the viewer's market drawn as an isometric field of accounts (dark blocks), the way Karl's reference
// draws a store floor; on its ground, ClearScaler's own loop (the site's figure-8, the logo's curve) with the viewer's
// company at its crossing. Geometry, projection, the named demo accounts, the street routes the emails travel, and
// each block's state over time. Pure functions of the frame.
import { T } from "./clock";
import { clamp01, lerp } from "./lib";
import { pointAt } from "./loop";

export const CELL = 175;            // lot pitch, world units
export const GAP = 64;              // street width
export const I0 = -6, I1 = 10;      // lot columns (x), inclusive
export const J0 = -6, J1 = 10;      // lot rows (y)
const XMAX = (I1 + 1) * CELL - GAP, YMAX = (J1 + 1) * CELL - GAP;

/** Deterministic noise in 0..1 for a lot (no Math.random in a frame-driven film). */
export const hash = (i: number, j: number, k = 0) => {
  const s = Math.sin(i * 127.1 + j * 311.7 + k * 74.7) * 43758.5453;
  return s - Math.floor(s);
};
const cos01 = (u: number) => 0.5 - 0.5 * Math.cos(Math.PI * clamp01(u));

// ---------- the view: projection with the world's own slow orbit ----------
const K = 0.56;                     // ground foreshortening (sin of the elevation)
const H = 0.84;                     // height factor (cos of the elevation)
export type View = { th: number; s: number; fx: number; fy: number; cx: number; cy: number; sink: number };
export const view = (g: number): View => {
  const t = g / 1200;
  const th = ((41 + 8 * t) * Math.PI) / 180;                                    // 8° over the film: content, slow
  // the pull-back: a gentle 18% over 2.9 s on a cosine (peak ≈ 9 %/s), never a crash zoom
  const pull = cos01((g / 30 - T.s("pull")) / 2.9);
  const sink = cos01((g / 30 - T.s("stat")) / 1.2);                             // the market steps back for the number
  return { th, s: lerp(1, 0.82, pull) * (1 - 0.06 * sink), fx: XMAX - 680, fy: YMAX - 680, cx: 1200, cy: 470 + 40 * sink, sink };
};
export const proj = (v: View, x: number, y: number, z = 0): [number, number] => {
  const dx = x - v.fx, dy = y - v.fy, c = Math.cos(v.th), s = Math.sin(v.th);
  return [v.cx + (dx * c - dy * s) * v.s, v.cy + ((dx * s + dy * c) * K - z * H) * v.s];
};
export const depth = (v: View, x: number, y: number) => x * Math.sin(v.th) + y * Math.cos(v.th);

// ---------- the blocks ----------
export type Fit = "strong" | "border" | "poor";
export type Block = { id: string; i: number; j: number; x0: number; y0: number; x1: number; y1: number; h: number; fit: Fit; name?: string };

const lots: Block[] = [];
for (let i = I0; i <= I1; i++)
  for (let j = J0; j <= J1; j++) {
    if (hash(i, j, 9) < 0.08) continue;                                         // a few empty lots
    const long = hash(i, j, 7);
    const w = (CELL - GAP) * (long < 0.2 ? 1 : 0.62 + 0.38 * hash(i, j, 1)), d = (CELL - GAP) * (long > 0.82 ? 1 : 0.62 + 0.38 * hash(i, j, 2));
    const x0 = i * CELL + ((CELL - GAP) - w) * hash(i, j, 3), y0 = j * CELL + ((CELL - GAP) - d) * hash(i, j, 4);
    const r = hash(i, j, 5);
    lots.push({ id: `${i},${j}`, i, j, x0, y0, x1: x0 + w, y1: y0 + d, h: hash(i, j, 8) < 0.06 ? 80 + 30 * hash(i, j, 6) : 14 + 46 * hash(i, j, 6) ** 1.6,
      fit: r < 0.42 ? "strong" : r < 0.68 ? "border" : "poor" });
  }
export const BLOCKS = lots;
const set = (i: number, j: number, p: Partial<Block>) => {
  let b = BLOCKS.find((q) => q.i === i && q.j === j);
  if (!b) { b = { id: `${i},${j}`, i, j, x0: i * CELL + 6, y0: j * CELL + 6, x1: i * CELL + CELL - GAP - 6, y1: j * CELL + CELL - GAP - 6, h: 30, fit: "border" }; BLOCKS.push(b); }
  Object.assign(b, p);
  return b;
};

// The named accounts: the viewer's company at the front, and the site's demo workspace companies.
export const YOU = set(8, 8, { name: "Your company", fit: "strong", h: 66, x0: 8 * CELL, y0: 8 * CELL, x1: 8 * CELL + CELL - GAP, y1: 8 * CELL + CELL - GAP });
export const FERN = set(6, 7, { name: "Fernhollow Freight", fit: "strong", h: 42 });
export const QUILL = set(6, 4, { name: "Quillmoor Group", fit: "strong", h: 48 });
export const BRIGHT = set(9, 5, { name: "Brightwick Systems", fit: "strong", h: 32 });
export const LARK = set(5, 8, { name: "Larkspan Analytics", fit: "border", h: 28 });
export const PELL = set(7, 6, { name: "Pellbrook Supply", fit: "poor", h: 36 });
// keep the viewer's neighbours low so its block and its loop crossing read
for (const b of BLOCKS) if (b !== YOU && Math.abs(b.i - YOU.i) <= 1 && Math.abs(b.j - YOU.j) <= 1) b.h = Math.min(b.h, 26);

export const centre = (b: Block): [number, number] => [(b.x0 + b.x1) / 2, (b.y0 + b.y1) / 2];
export const dist = (b: Block, o: Block = YOU) => Math.hypot(centre(b)[0] - centre(o)[0], centre(b)[1] - centre(o)[1]);

// ---------- ClearScaler's loop on the ground ----------
/** The site's loop (loop.ts, 720 units across) laid on the ground, crossing at the viewer's block, its long axis
 *  running across the screen. LOOP_K world units per loop unit. */
export const LOOP_K = 1.75;
export const loopWorld = (lx: number, ly: number): [number, number] => {
  const [cx, cy] = centre(YOU);
  const u = (lx - 512) * LOOP_K, w = (ly - 512) * LOOP_K;
  return [cx + (u + w) * Math.SQRT1_2, cy + (-u + w) * Math.SQRT1_2];
};
export const LOOP_N = 320;
export const LOOP_PTS: { x: number; y: number }[] = Array.from({ length: LOOP_N + 1 }, (_, n) => pointAt(n / LOOP_N));

// ---------- routes along the streets ----------
export type Route = { pts: [number, number][]; len: number[]; total: number };
const fillet = (pts: [number, number][], r: number): [number, number][] => {
  const out: [number, number][] = [pts[0]];
  for (let k = 1; k < pts.length - 1; k++) {
    const [ax, ay] = pts[k - 1], [bx, by] = pts[k], [cx, cy] = pts[k + 1];
    const l1 = Math.hypot(bx - ax, by - ay), l2 = Math.hypot(cx - bx, cy - by), rr = Math.min(r, l1 / 2, l2 / 2);
    const p: [number, number] = [bx - ((bx - ax) / l1) * rr, by - ((by - ay) / l1) * rr], q: [number, number] = [bx + ((cx - bx) / l2) * rr, by + ((cy - by) / l2) * rr];
    for (let n = 0; n <= 8; n++) { const t = n / 8, m = 1 - t; out.push([m * m * p[0] + 2 * m * t * bx + t * t * q[0], m * m * p[1] + 2 * m * t * by + t * t * q[1]]); }
  }
  out.push(pts[pts.length - 1]);
  return out;
};
const measureRoute = (pts: [number, number][]): Route => {
  const len = [0];
  for (let k = 1; k < pts.length; k++) len.push(len[k - 1] + Math.hypot(pts[k][0] - pts[k - 1][0], pts[k][1] - pts[k - 1][1]));
  return { pts, len, total: len[len.length - 1] };
};
/** From the street beside the viewer's block, across the grid on the streets, into the target's side. */
export const route = (to: Block, from: Block = YOU): Route => {
  const sx = (i: number) => i * CELL - GAP / 2;           // the vertical street west of column i
  const sy = (j: number) => j * CELL - GAP / 2;           // the horizontal street north of row j
  const [fx] = centre(from), [tx] = centre(to);
  const streetY = sy(from.j);                              // the street north of the viewer's lot (its start)
  const colX = to.i <= from.i ? sx(to.i + 1) : sx(to.i);   // the street beside the target's column, facing the viewer
  const rowY = sy(to.j + 1);                               // the street south of the target
  const pts: [number, number][] = [[fx, streetY], [colX, streetY], [colX, rowY], [tx, rowY], [tx, to.y1]];
  const clean = pts.filter((p, k) => k === 0 || Math.hypot(p[0] - pts[k - 1][0], p[1] - pts[k - 1][1]) > 1);
  return measureRoute(fillet(clean, 34));
};
export const pointOn = (r: Route, u: number): [number, number] => {
  const d = clamp01(u) * r.total;
  let k = 1;
  while (k < r.len.length - 1 && r.len[k] < d) k++;
  const t = (d - r.len[k - 1]) / Math.max(1e-6, r.len[k] - r.len[k - 1]);
  return [lerp(r.pts[k - 1][0], r.pts[k][0], t), lerp(r.pts[k - 1][1], r.pts[k][1], t)];
};
/** The part of a route from u0 to u1, as world points. */
export const slice = (r: Route, u0: number, u1: number): [number, number][] => {
  const a = clamp01(u0) * r.total, b = clamp01(u1) * r.total;
  if (b <= a) return [];
  const out: [number, number][] = [pointOn(r, u0)];
  for (let k = 0; k < r.pts.length; k++) if (r.len[k] > a && r.len[k] < b) out.push(r.pts[k]);
  out.push(pointOn(r, u1));
  return out;
};

// ---------- sends: who gets an email, when ----------
export type Send = { to: Block; at: number; dur: number; back?: { at: number; dur: number } };
const strongNear = BLOCKS.filter((b) => b.fit === "strong" && !b.name && b.i >= 1 && b.j >= 0 && b.i <= 10 && b.j <= 9 && dist(b) > 350).sort((a, b) => hash(a.i, a.j, 11) - hash(b.i, b.j, 11));
// one at a time: each email leaves as the one before lands
export const SENDS: Send[] = [
  { to: FERN, at: T.s("send"), dur: 1.1 },
  { to: QUILL, at: T.s("more"), dur: 0.55, back: { at: T.s("replies"), dur: 0.9 } },
  { to: strongNear[0], at: T.s("more") + 0.42, dur: 0.5 },
  { to: BRIGHT, at: T.s("more") + 0.84, dur: 0.5, back: { at: T.s("replies") + 0.3, dur: 0.85 } },
  { to: strongNear[1], at: T.s("more") + 1.26, dur: 0.5 },
  { to: LARK, at: T.s("more") + 1.68, dur: 0.5, back: { at: T.s("replies") + 0.6, dur: 0.85 } },
  { to: strongNear[2], at: T.s("more") + 2.1, dur: 0.5 },
];
// the engine at scale: many at once across the market, out (orange); replies come back from about one in eight
const far = BLOCKS.filter((b) => b.fit === "strong" && !b.name && dist(b) > 500).sort((a, b) => hash(a.i, a.j, 13) - hash(b.i, b.j, 13));
export const WAVE: Send[] = Array.from({ length: 16 }, (_, n) => ({
  to: far[n], at: T.s("pull") + 0.25 + n * 0.1, dur: 1.0 + 0.4 * hash(n, 1, 3),
  back: n % 8 === 1 ? { at: T.s("pull") + 1.4 + n * 0.05, dur: 0.9 } : undefined,
}));
export const ROUTES = new Map<Block, Route>();
for (const s of [...SENDS, ...WAVE]) if (!ROUTES.has(s.to)) ROUTES.set(s.to, route(s.to));

// the viewer's own reach before ClearScaler: a few emails by hand, to the nearest accounts, that stop at the ring
export const REACH_R = 330;
export const OWN = BLOCKS.filter((b) => b !== YOU && dist(b) > 120 && dist(b) < REACH_R + 60).slice(0, 5);
for (const b of OWN) if (!ROUTES.has(b)) ROUTES.set(b, route(b));

// ---------- per-block state ----------
const fpsT = (g: number) => g / 30;
/** Ring radius around the viewer's block (world units): the reach ring, then the research scan sweeping out. */
export const ring = (g: number) => {
  const reach = T.k(g, "dist", 0.7) * REACH_R;
  const scan = T.k(g, "scan", 2.1, (u) => u * u * (3 - 2 * u)) * 3400;
  return { r: Math.max(reach, scan), scan: T.k(g, "scan", 0.25), fade: T.k(g, "score+0.3", 0.8) };
};
/** How lit the market is: the light reveals the market, contracts to the viewer's reach on "distribution", and opens
 *  to everything with the research scan. */
export const lightR = (g: number) => {
  const open = (0.35 + 0.65 * T.k(g, "open", 1.4, (u) => 1 - Math.pow(1 - u, 2))) * 1250;
  const shrink = T.k(g, "dist", 0.7, (u) => u * u * (3 - 2 * u));
  return Math.max(lerp(open, REACH_R, shrink), ring(g).r * T.k(g, "scan", 0.01));
};
export const lightOf = (g: number, b: Block) => {
  const r = lightR(g), d = dist(b);
  const x = clamp01((d - (r - 120)) / 420);
  return 1 - x * x * (3 - 2 * x);
};
export const researched = (g: number, b: Block) => clamp01((ring(g).r - dist(b)) / 110) * (T.k(g, "scan", 0.01) > 0 ? 1 : 0);
/** Score answer: 0 before, 1 after; staggered outward from the viewer. */
export const scored = (g: number, b: Block) => {
  const t0 = T.s("score") + Math.min(1.0, dist(b) / 2600);
  const k = clamp01((fpsT(g) - t0) / 0.5);
  return 1 - Math.pow(1 - k, 3);
};
export const blockIntro = (g: number, b: Block) => clamp01((fpsT(g) + 0.45 - (b === YOU ? 0.0 : 0.2) - dist(b, YOU) / 2600) / 0.5);
export const rise = (g: number, b: Block) => {
  const k = scored(g, b);
  const f = b.fit === "strong" ? 1.28 : b.fit === "poor" ? 0.45 : 1;
  const up = 1 - Math.pow(1 - blockIntro(g, b), 3);
  // Fernhollow lifts a little as the first email lands, then settles
  const landed = b === FERN ? 22 * clamp01((fpsT(g) - T.s("arrive")) / 0.3) * (1 - clamp01((fpsT(g) - T.s("arrive") - 1.0) / 0.6)) : 0;
  return b.h * lerp(1, f, k) * up + landed;
};
/** While the first email travels, the fits' orange steps back so the email is the only orange thing. */
export const fitQuiet = (g: number) => 0.75 * clamp01(T.k(g, "fold", 0.4) - T.k(g, "more", 0.6));
