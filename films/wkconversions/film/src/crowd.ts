// The crowd (the audience's attention): every person walks their street until a business calls them; then they walk
// the streets to it (along their own street, then round the lot's streets, never across a block) and wait there.
// G1: the competitor communicates better, the people near it gather at it. G2: on "built to attract attention" they
// all walk over to you and turn blue; on "drive conversion" half of them go in. G3: the sign-off gathers the city.
import { T } from "./clock";
import { hash } from "./iso";
import { Biz, COMP, N_PEOPLE, PEOPLE, Person, YOU, centre, ring, walk } from "./map";
import { EASE } from "./kinetic";

type P2 = [number, number];
/** ink: 0 a passer-by (grey), 1 attention caught (ink); blue: caught by you. */
export type Who = { x: number; y: number; o: number; blue: number; r: number; pop: number; ink: number };
const cl = (u: number) => Math.min(1, Math.max(0, u));
const dist = (a: P2, b: P2) => Math.hypot(a[0] - b[0], a[1] - b[1]);

/** A slot on the streets round lot b for someone arriving along an x-street (axis 0) or a y-street (axis 1). */
const slot = (b: Biz, k: number, axis: 0 | 1, from: P2, salt: number): { q: P2; axis: 0 | 1 } => {
  const R = ring(b), lane = (hash(k, salt, 5) - 0.5) * 26;
  if (axis === 0) {                                  // arrives along an x-street: waits on the lot's west or east street
    const x = (Math.abs(from[0] - R.xa) < Math.abs(from[0] - R.xb)) === hash(k, salt, 6) < 0.8 ? R.xa : R.xb;
    return { q: [x + lane, R.ya + 30 + (R.yb - R.ya - 60) * hash(k, salt, 7)], axis: 1 };
  }
  const y = (Math.abs(from[1] - R.ya) < Math.abs(from[1] - R.yb)) === hash(k, salt, 6) < 0.8 ? R.ya : R.yb;
  return { q: [R.xa + 30 + (R.xb - R.xa - 60) * hash(k, salt, 7), y + lane], axis: 0 };
};
/** The route along the streets: first along the street you are on, then along the lot's street to the slot. */
const route = (s: P2, axis: 0 | 1, q: P2): P2[] => (axis === 0 ? [s, [q[0], s[1]], q] : [s, [s[0], q[1]], q]);
const along = (pts: P2[], d: number): P2 => {
  for (let i = 0; i < pts.length - 1; i++) {
    const L = dist(pts[i], pts[i + 1]);
    if (d <= L || i === pts.length - 2) { const u = L > 0 ? cl(d / L) : 1; return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * u, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * u]; }
    d -= L;
  }
  return pts[pts.length - 1];
};
const lenOf = (pts: P2[]) => pts.slice(1).reduce((a, p, i) => a + dist(pts[i], p), 0);
type Leg = { t0: number; pts: P2[]; dur: number; end: P2; endAxis: 0 | 1 };
const leg = (t0: number, s: P2, axis: 0 | 1, b: Biz, k: number, salt: number, speed: number): Leg => {
  const { q, axis: endAxis } = slot(b, k, axis, s, salt);
  const pts = route(s, axis, q);
  return { t0, pts, dur: Math.max(0.8, lenOf(pts) / speed), end: q, endAxis };
};
const at = (l: Leg, t: number, k = 0): P2 => {
  const p = along(l.pts, EASE.steady(cl((t - l.t0) / l.dur)) * lenOf(l.pts));
  const w = cl((t - l.t0 - l.dur) / 0.6), a = 9 * Math.sin(t * (1.1 + 0.6 * hash(k, 1, 9)) + k), b = 5 * Math.sin(t * (1.7 + 0.5 * hash(k, 2, 9)) + 2 * k);
  return l.endAxis === 0 ? [p[0] + a * w, p[1] + b * w] : [p[0] + b * w, p[1] + a * w];
};
const done = (l: Leg, t: number) => cl((t - l.t0) / l.dur);

// ---- who does what (computed once: the plan of every person) ----
const tG1 = T.s("better2"), tG2 = T.s("attract"), tC = T.s("drive"), tR = T.s("goalHit"), tBack = T.s("fin") - 0.6, tG3 = T.s("standout2"), tC3 = T.s("convert");
const C_C = centre(COMP), C_Y = centre(YOU);
type Plan = { g1?: Leg; g2?: Leg; conv?: number; rel?: number; g3?: Leg; conv3?: number };
const PLAN: Plan[] = PEOPLE.map((p) => {
  const pl: Plan = {};
  const k = p.k;
  // G1: the people near the competitor
  const s1 = walk(p, tG1);
  const d1 = dist(s1, C_C);
  const tA = T.s("standout") + 0.2, sA = walk(p, tA), dA = dist(sA, C_C);
  if (dA < 420 && hash(k, 1, 77) < 0.8) { const t0 = tA + dA / 900 + 0.3 * hash(k, 2, 77); pl.g1 = leg(t0, walk(p, t0), p.axis, COMP, k, 1, 110); }
  else if (d1 < 600 && hash(k, 1, 77) < 0.8) { const t0 = tG1 + d1 / 1100 + 0.25 * hash(k, 2, 77); pl.g1 = leg(t0, walk(p, t0), p.axis, COMP, k, 1, 120); }
  // G2: the competitor's crowd and the people near you walk over to you
  const s2 = walk(p, tG2);
  const d2 = dist(s2, C_Y);
  if (pl.g1) { const t0 = tG2 + 0.6 * hash(k, 3, 77); pl.g2 = leg(t0, at(pl.g1, t0, k), pl.g1.endAxis, YOU, k, 2, 280); }
  else if (d2 < 650 && hash(k, 4, 77) < 0.85) { const t0 = tG2 + d2 / 1100 + 0.2 * hash(k, 5, 77); pl.g2 = leg(t0, walk(p, t0), p.axis, YOU, k, 2, 160); }
  if (pl.g2) {
    const arrive = pl.g2.t0 + pl.g2.dur;
    if (hash(k, 6, 77) < 0.5) pl.conv = Math.max(tC + 1.1 * hash(k, 7, 77), arrive + 0.15);
    else pl.rel = Math.max(tR + 1.4 * hash(k, 8, 77), arrive + 0.4);
  }
  // G3: the sign-off gathers the people near you (back on their streets by then)
  const s3 = walk(p, tG3);
  const d3 = dist(s3, C_Y);
  if (d3 < 820 && hash(k, 9, 77) < 0.8) {
    const t0 = tG3 + d3 / 1500 + 0.2 * hash(k, 10, 77);
    pl.g3 = leg(t0, walk(p, t0), p.axis, YOU, k, 3, 240);
    if (hash(k, 11, 77) < 0.45) pl.conv3 = Math.max(tC3 + 0.7 * hash(k, 12, 77), pl.g3.t0 + pl.g3.dur + 0.1);
  }
  return pl;
});
export const CONVERSIONS = PLAN.map((pl, k) => ({ k, t: pl.conv ?? pl.conv3 ?? -1 })).filter((c) => c.t > 0);

/** Where person k is at time t, how visible, how blue, and the pop of their conversion ring (0..1). */
export const who = (k: number, t: number): Who => {
  const p: Person = PEOPLE[k], pl = PLAN[k];
  let pos: P2 = walk(p, t), o = 1, blue = 0, pop = 0, ink = 0;
  const r = 1;
  // the convert step: into the lot's front (toward its middle), shrinking, with a ring on the street
  const goIn = (from: P2, tc: number) => {
    const u = cl((t - tc) / 0.4);
    pos = [from[0] + (C_Y[0] - from[0]) * EASE.easy(u) * 0.55, from[1] + (C_Y[1] - from[1]) * EASE.easy(u) * 0.55];
    o = 1 - u; pop = t >= tc ? cl((t - tc) / 0.7) : 0;
  };
  if (pl.g3 && t >= pl.g3.t0) {
    pos = at(pl.g3, t, k); blue = cl(done(pl.g3, t) / 0.35); ink = 0;
    if (pl.conv3 && t >= pl.conv3) goIn(pl.g3.end, pl.conv3);
    return { x: pos[0], y: pos[1], o, blue, r, pop, ink };
  }
  if (pl.g2 && t >= pl.g2.t0 && t < tBack + 1.5) {
    pos = at(pl.g2, t, k); blue = cl((done(pl.g2, t) - (pl.g1 ? 0.6 : 0.15)) / 0.4); ink = pl.g1 ? 1 : 0;
    if (pl.conv && t >= pl.conv) { goIn(pl.g2.end, pl.conv); if (t >= tBack) { pos = walk(p, t); o = cl((t - tBack) / 0.8); blue = 0; pop = 0; ink = 0; } }
    else if (pl.rel && t >= pl.rel) {
      // released: walks off along its street, fading, while the walker it was fades back in on its own street
      const u = cl((t - pl.rel) / 2.2), q = pl.g2.end, ax = pl.g2.endAxis, dir = hash(k, 13, 77) < 0.5 ? -1 : 1;
      const w: P2 = ax === 0 ? [q[0] + dir * 230 * EASE.easy(u), q[1]] : [q[0], q[1] + dir * 230 * EASE.easy(u)];
      if (u < 1) return { x: w[0], y: w[1], o: 1 - cl((u - 0.55) / 0.45), blue: blue * (1 - u), r, pop: 0, ink: 1 - u };
      pos = walk(p, t); o = 1; blue = 0; ink = 0;
    }
    return { x: pos[0], y: pos[1], o, blue, r, pop, ink };
  }
  if (pl.g1 && t >= pl.g1.t0 && !(pl.g2 && t >= pl.g2.t0)) { pos = at(pl.g1, t, k); ink = cl(done(pl.g1, t) * 3); }
  return { x: pos[0], y: pos[1], o, blue, r, pop, ink };
};
/** The walkers that fade back in while a released person walks off (one per released person). */
export const twinO = (k: number, t: number) => {
  const pl = PLAN[k];
  if (!pl.rel || t < pl.rel || t >= tBack + 1.5) return 0;
  return cl((t - pl.rel - 0.6) / 1.2);
};
export const N = N_PEOPLE;
