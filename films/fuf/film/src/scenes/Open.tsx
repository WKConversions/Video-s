import React from "react";
import { T, Para, vis, k, rnd, ARRIVE, MOVE, OUT, SOFT, clamp01, lerp, INK, CREAM, TAUPE } from "./brand";

// ---- A. "Great opportunities start with the right connections." (no caption)
//         "But finding ambitious people who share your vision isn't always easy."
// A network grows from one point (you, taupe) on the left third: cream nodes appear outward in sequence, each drawing
// a fine taupe line back to one or two earlier nodes, small lights travelling the edges. On "connections" a warm
// beat runs through the edges from the origin outward. Then the lines retract and the network loosens into a crowd
// seen from above (people walking every way), and you move through it inside a fine ring: the dots you pass
// brighten and dim again. The whole field drifts slowly in depth (parallax), never scaling.

const RGB = { cream: [247, 244, 239], grey: [146, 141, 135], taupe: [185, 165, 149], warm: [218, 198, 178] };
const mix = (a: number[], b: number[], t: number) => `rgb(${a.map((v, i) => Math.round(lerp(v, b[i], t))).join(",")})`;
const mixA = (a: number[], b: number[], t: number) => a.map((v, i) => lerp(v, b[i], t));

export const ORIGIN = { x: 604, y: 566 };
const NN = 116;          // network nodes; they become the first half of the crowd
export const NC = 232;   // crowd dots (the Logo scene lands one on each point of the mark)

/** Mitchell's best-candidate sampling (progressive, so the network's dots are evenly spread on their own). */
type Base = { x: number; y: number; z: number };
const BASE: Base[] = (() => {
  const out: Base[] = [];
  const taken: { x: number; y: number }[] = [ORIGIN];
  for (let i = 0; i < NC; i++) {
    const net = i < NN;
    const [ax, bx, ay, by] = net ? [-10, 2040, 0, 1080] : [-200, 2180, -170, 1250];
    let best = { x: 0, y: 0 }, bd = -1;
    for (let c = 0; c < 14; c++) {
      const x = ax + rnd(i * 31 + c * 2 + 1) * (bx - ax), y = ay + rnd(i * 31 + c * 2 + 2) * (by - ay);
      let d = Infinity;
      for (const p of taken) d = Math.min(d, (p.x - x) ** 2 + (p.y - y) ** 2);
      if (d > bd) { bd = d; best = { x, y }; }
    }
    taken.push(best);
    out.push({ ...best, z: Math.pow(rnd(i * 7 + 5003), 0.85) });
  }
  return out;
})();
/** The network's nodes (kept for older imports). */
export const DOTS = BASE.slice(0, NN).map(({ x, y }) => ({ x, y }));

// per-dot motion: a slow drift, a parallax factor (depth), and a walk for the crowd
const DOT = BASE.map((b, i) => {
  const p = 0.4 + 0.6 * b.z;
  const da = rnd(i * 13 + 7001) * Math.PI * 2, dv = 3 + 4 * rnd(i * 13 + 7002);
  return {
    ...b, p,
    dx: Math.cos(da) * dv, dy: Math.sin(da) * dv,
    v: (34 + 40 * rnd(i * 13 + 7003)) * p,              // walking speed, px/s, slower in the distance
    th: rnd(i * 13 + 7004) * Math.PI * 2,                // heading
    kap: (rnd(i * 13 + 7005) - 0.5) * 0.36,              // gentle curve, rad per second walked
    r: 1.7 + 2.0 * b.z,
    o: 0.5 + 0.5 * b.z,
    fade: 3.55 + 0.9 * rnd(i * 13 + 7006),               // extra crowd dots fade in from here
  };
});
const CAM = (t: number) => ({ x: -17 * t, y: -2.6 * t });   // the slow truck that gives the parallax

// the network: appearance in order of distance from the origin, edges back to one or two earlier nodes
const NET = (() => {
  const d = DOT.slice(0, NN).map((q) => Math.hypot(q.x - ORIGIN.x, q.y - ORIGIN.y));
  const dmax = Math.max(...d);
  const ta = d.map((v, i) => -0.62 + 2.78 * Math.pow(v / dmax, 0.95) + (rnd(i * 3 + 9001) - 0.5) * 0.12);
  const order = ta.map((_, i) => i).sort((a, b) => ta[a] - ta[b]);
  const edges: { i: number; j: number; len: number; t0: number; dur: number; pulse: boolean; per: number; ph: number; wd: number; rt: number }[] = [];
  order.forEach((i, n) => {
    const earlier = order.slice(0, n).map((j) => ({ j, d: Math.hypot(DOT[j].x - DOT[i].x, DOT[j].y - DOT[i].y) }));
    earlier.push({ j: -1, d: d[i] });                    // the origin
    earlier.sort((a, b) => a.d - b.d);
    const pick = [earlier[0]];
    if (earlier[1] && earlier[1].d < 1.35 * earlier[0].d && earlier[1].d < 300 && rnd(i * 5 + 9101) < 0.36) pick.push(earlier[1]);
    pick.forEach(({ j, d: len }, m) => {
      const mx = (DOT[i].x + (j < 0 ? ORIGIN.x : DOT[j].x)) / 2, my = (DOT[i].y + (j < 0 ? ORIGIN.y : DOT[j].y)) / 2;
      edges.push({
        i, j, len, t0: ta[i] + 0.03 + m * 0.08, dur: 0.24 + len / 950,
        pulse: rnd(i * 5 + m + 9201) < 0.55, per: 1.25 + 1.1 * rnd(i * 5 + m + 9301), ph: rnd(i * 5 + m + 9401),
        wd: Math.hypot(mx - ORIGIN.x, my - ORIGIN.y) / 2300,                // the warm beat's delay
        rt: 3.36 + 0.5 * clamp01((ta[i] + 0.62) / 2.78),                   // retract start
      });
    });
  });
  return { ta, edges };
})();

// the crowd's walking clock: speed ramps up with a smoothstep from 3.45 s over 1.3 s
const WALK0 = 3.45, WD = 1.3;
const walked = (t: number) => { const u = clamp01((t - WALK0) / WD); return WD * (u * u * u - (u * u * u * u) / 2) + Math.max(0, t - WALK0 - WD); };

const posAt = (i: number, t: number) => {
  const q = DOT[i], c = CAM(t), w = walked(t);
  let wx = 0, wy = 0;
  if (w > 0) {
    if (Math.abs(q.kap) < 1e-4) { wx = q.v * w * Math.cos(q.th); wy = q.v * w * Math.sin(q.th); }
    else { wx = (q.v / q.kap) * (Math.sin(q.th + q.kap * w) - Math.sin(q.th)); wy = (q.v / q.kap) * (Math.cos(q.th) - Math.cos(q.th + q.kap * w)); }
  }
  return { x: q.x + q.dx * t + c.x * q.p + wx, y: q.y + q.dy * t + c.y * q.p + wy };
};

// you: the origin, then a measured search through the crowd (cubic Hermite through waypoints, leaving with the drift)
const YW: [number, number, number][] = [[3.7, 0, 0], [4.5, 690, 492], [5.3, 878, 528], [6.1, 1058, 612], [6.9, 1232, 604], [7.7, 1384, 546], [8.5, 1520, 506]];
const youDrift = (t: number) => { const c = CAM(t); return { x: ORIGIN.x + c.x, y: ORIGIN.y + c.y }; };
YW[0][1] = youDrift(YW[0][0]).x; YW[0][2] = youDrift(YW[0][0]).y;
export const youAt = (g: number) => {
  const t = g / 30;
  if (t <= YW[0][0]) return youDrift(t);
  const n = YW.length;
  let i = 0;
  while (i < n - 2 && t > YW[i + 1][0]) i++;
  const [t0, x0, y0] = YW[i], [t1, x1, y1] = YW[i + 1], h = t1 - t0;
  const tan = (j: number) => j === 0 ? [-17 * h, -2.6 * h] : j >= n - 1 ? [(YW[j][1] - YW[j - 1][1]), (YW[j][2] - YW[j - 1][2])] : [(YW[j + 1][1] - YW[j - 1][1]) / 2, (YW[j + 1][2] - YW[j - 1][2]) / 2];
  const s = Math.min(1.5, (t - t0) / h), s2 = s * s, s3 = s2 * s;
  const h00 = 2 * s3 - 3 * s2 + 1, h10 = s3 - 2 * s2 + s, h01 = -2 * s3 + 3 * s2, h11 = s3 - s2;
  const m0 = tan(i), m1 = tan(i + 1);
  return { x: h00 * x0 + h10 * m0[0] + h01 * x1 + h11 * m1[0], y: h00 * y0 + h10 * m0[1] + h01 * y1 + h11 * m1[1] };
};

const RING = 58, CROWD_R = 2.7, CROWD_O = 0.8;
const ringO = (t: number) => clamp01((t - 3.86) / 0.35) * (1 - clamp01((t - (T.s("meet") - 0.45)) / 0.35));

/** Everything about a crowd dot at frame g: position, radius, colour, opacity. */
export type CrowdDot = { x: number; y: number; r: number; c: number[]; o: number };
export const crowdLook = (g: number): CrowdDot[] => {
  const t = g / 30;
  const grey = clamp01((t - 3.45) / 1.0);            // network nodes cool into the crowd
  const ys = Array.from({ length: 10 }, (_, m) => ({ tau: m * 0.09, y: youAt(g - m * 2.7), ro: ringO(t - m * 0.09) }));
  return DOT.map((q, i) => {
    const p = posAt(i, t);
    const net = i < NN;
    // a crowd is one plane seen from above: every dot settles to one size and one grey
    let o = net ? lerp(q.o, CROWD_O, grey) * clamp01((t - NET.ta[i]) / 0.32) : CROWD_O * ARRIVE(clamp01((t - q.fade) / 0.8));
    let c = net ? mixA(RGB.cream, RGB.grey, grey) : RGB.grey;
    const r = net ? lerp(q.r, CROWD_R, grey) : CROWD_R;
    // the ring passes: a brief brightening that dims again
    let lit = 0;
    for (const y of ys) {
      if (y.ro <= 0) continue;
      const pp = y.tau === 0 ? p : posAt(i, t - y.tau);
      const near = clamp01((RING + 10 - Math.hypot(pp.x - y.y.x, pp.y - y.y.y)) / 24);
      lit = Math.max(lit, near * y.ro * Math.pow(1 - y.tau / 0.9, 1.6));
    }
    if (lit > 0) { c = mixA(c, RGB.cream, lit); o = lerp(o, 1, lit); }
    return { x: p.x, y: p.y, r, c, o };
  });
};
/** The crowd dots' positions at frame g (the Logo scene starts its particles from them). */
export const crowdAt = (g: number): { x: number; y: number }[] => DOT.map((_, i) => posAt(i, g / 30));

export const Network: React.FC<{ g: number }> = ({ g }) => {
  const o = vis(g, "open-1", "meet+0.3");
  if (o <= 0) return null;
  const t = g / 30;
  const dots = crowdLook(g);
  const you = youAt(g);
  const nodeAt = (j: number) => j < 0 ? youDrift(t) : dots[j];
  const ro = ringO(t), rd = k(g, "ambitious", 0.7, MOVE);
  const cap = clamp01((t - 6.0) / 0.4) * (1 - clamp01((t - 7.3) / 0.4));
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o, background: INK }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {NET.edges.map((e, n) => {
          const d = clamp01((t - e.t0) / e.dur), dd = SOFT(d);
          const r = MOVE(clamp01((t - e.rt) / 0.5));
          if (dd <= 0 || r >= 1) return null;
          const a = nodeAt(e.i), b = nodeAt(e.j);
          // the warm beat on "connections", running outward from the origin
          const x = t - (T.s("connections") + e.wd);
          const w = x < 0 ? 0 : x < 0.2 ? ARRIVE(x / 0.2) : Math.exp(-(x - 0.2) / 0.5);
          const z = (DOT[e.i].z + (e.j < 0 ? 1 : DOT[e.j].z)) / 2;
          const base = 0.2 + 0.26 * z;
          // drawn from the new node toward the earlier one; retracts into the earlier one
          const sx = lerp(a.x, b.x, r), sy = lerp(a.y, b.y, r), ex = lerp(a.x, b.x, Math.max(r, dd)), ey = lerp(a.y, b.y, Math.max(r, dd));
          const els = [<line key={n} x1={sx} y1={sy} x2={ex} y2={ey} stroke={mix(RGB.taupe, RGB.warm, w)} strokeOpacity={lerp(base, 0.88, w)} strokeWidth={0.8 + 0.5 * z + 0.4 * w} />];
          // a small light travelling outward along the drawn edge
          if (e.pulse && d >= 1 && r <= 0) {
            const u = ((t - e.t0 - e.dur) / e.per + e.ph) % 1, trav = Math.min(0.9, e.len / 300 / e.per);
            if (u < trav) {
              const f = u / trav, px = lerp(b.x, a.x, f), py = lerp(b.y, a.y, f), fo = Math.sin(f * Math.PI) * (1 - r);
              els.push(<circle key={n + "g"} cx={px} cy={py} r={5.5} fill={CREAM} opacity={0.12 * fo} />, <circle key={n + "p"} cx={px} cy={py} r={1.9} fill={CREAM} opacity={0.95 * fo} />);
            }
          }
          return els;
        })}
        {dots.map((q, i) => q.o > 0.003 && q.x > -20 && q.x < 1940 && q.y > -20 && q.y < 1100
          ? <circle key={i} cx={q.x} cy={q.y} r={q.r} fill={`rgb(${q.c.map(Math.round).join(",")})`} opacity={q.o} /> : null)}
        {ro > 0 && <circle cx={you.x} cy={you.y} r={RING} fill="none" stroke={TAUPE} strokeWidth={1.2} opacity={0.75 * ro}
          pathLength={1} strokeDasharray={`${rd} 1`} transform={`rotate(-90 ${you.x} ${you.y})`} />}
        <circle cx={you.x} cy={you.y} r={5.2} fill={TAUPE} />
      </svg>
      {cap > 0 && <div style={{ position: "absolute", left: 40, top: 700, width: 900, height: 300, opacity: cap,
        background: "radial-gradient(closest-side, rgba(43,43,43,0.9), rgba(43,43,43,0.6) 55%, rgba(43,43,43,0))" }} />}
      <Para g={g} lines={[["6.2", "isn't always *easy.*"]]} x={150} y={812} size={64} color={CREAM} out="7.24" />
    </div>
  );
};
