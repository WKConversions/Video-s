// The world: the site's dot-grid paper, the routed blue lines and rings on the ground, the city's blocks (each with
// its screen on the side facing us, always playing) and the people walking its streets, in depth order.
import React from "react";
import { C, clamp01, lerp, mix, rgba } from "./lib";
import { View, depth, hash, proj, pts } from "./iso";
import { Box, groundRing } from "./draw";
import { BIZ, Biz, CELL, I0, I1, J0, J1, N_PEOPLE, PEOPLE, YOU, centre, walk } from "./map";
import { CONVERSIONS, twinO, who } from "./crowd";
import { OUT_ROUTES, RINGS, Route, TURN_ROUTE, VIEW, heightOf, k, ringState, routeK, sec, youBlue, youEdge } from "./scene";
import { T } from "./clock";
import { EASE } from "./kinetic";

/** A passer-by: grey; the people whose attention a business catches turn ink, and blue when it is yours. */
const WALKER = "#9AA1AB";

/** A side face as an SVG transform: local u runs left to right across the face we see (x = x1), w down from z. */
const sideM = (v: View, x1: number, y1: number, z: number) => {
  const c = Math.cos(v.th), n = Math.sin(v.th), [ox, oy] = proj(v, x1, y1, z);
  return `matrix(${n * v.s} ${-c * 0.56 * v.s} 0 ${0.84 * v.s} ${ox} ${oy})`;
};

/** A business's screen, on the side we see, always playing: grey bars for the city, blue motion for the competitor,
 *  your grey bars until WKConversions comes in, then the brand blue. */
const Screen: React.FC<{ g: number; v: View; b: Biz; h: number }> = ({ g, v, b, h }) => {
  if (h < 34) return null;
  const t = sec(g), Wd = b.y1 - b.y0, hh = Math.min(h - 16, b.role === "biz" ? 26 : 34 + (h - 64) * 0.18);
  const ph = hash(b.i, b.j, 21) * 10, sp = 0.6 + hash(b.i, b.j, 22);
  const you = b.role === "you", comp = b.role === "comp";
  const yb = you ? youEdge(g) : 0;
  const cg = comp ? k(g, "turn", 1.4, EASE.soft) : 0;
  const bg = comp ? mix("#0C1A28", "#F4F5F7", cg) : you ? mix("#EFF0F2", C.blue, yb) : "#F4F5F7";
  const bar = comp ? mix("#6FA9EE", "#E1E3E7", cg) : you ? mix("#AEB4BC", "#FFFFFF", yb) : "#E1E3E7";
  const n = Math.max(2, Math.min(5, Math.floor((hh - 6) / 7)));
  const fast = (comp && cg < 0.5) || (you && yb > 0.5) ? 2.2 : 1;
  return (
    <g transform={sideM(v, b.x1, b.y1, h - 8)}>
      <rect x={8} y={0} width={Wd - 16} height={hh} rx={3} fill={bg} />
      {Array.from({ length: n }, (_, i) => {
        const w = 0.25 + 0.65 * (0.5 + 0.5 * Math.sin(t * sp * 2 * fast + ph + i * 1.7));
        return <rect key={i} x={16} y={5 + i * 7} width={(Wd - 32) * w} height={4} rx={2} fill={bar} />;
      })}
    </g>
  );
};

const RouteLine: React.FC<{ v: View; r: Route; u: number; w?: number }> = ({ v, r, u, w = 5 }) => {
  if (u <= 0) return null;
  const segs = r.pts.slice(1).map((p, i) => Math.hypot(p[0] - r.pts[i][0], p[1] - r.pts[i][1]));
  const L = segs.reduce((a, b) => a + b, 0);
  let d = u * L;
  const out: [number, number][] = [r.pts[0]];
  for (let i = 0; i < segs.length && d > 0; i++) {
    const f = Math.min(1, d / segs[i]);
    out.push([lerp(r.pts[i][0], r.pts[i + 1][0], f), lerp(r.pts[i][1], r.pts[i + 1][1], f)]);
    d -= segs[i];
  }
  const sp = out.map(([x, y]) => proj(v, x, y, 0));
  const head = sp[sp.length - 1];
  return (
    <g>
      <polyline points={pts(sp)} fill="none" stroke={rgba(C.blue, 0.18)} strokeWidth={w * 3.2 * v.s} strokeLinejoin="round" strokeLinecap="round" />
      <polyline points={pts(sp)} fill="none" stroke={C.blue} strokeWidth={w * v.s} strokeLinejoin="round" strokeLinecap="round" />
      {u < 1 && <circle cx={head[0]} cy={head[1]} r={10 * v.s} fill="#fff" stroke={C.blue} strokeWidth={4 * v.s} />}
    </g>
  );
};

export const World: React.FC<{ g: number }> = ({ g }) => {
  const v = VIEW(g), t = sec(g);
  // the dot grid (the site's paper), every quarter cell: fine dots, too small and far apart to read as things
  const dots: React.ReactNode[] = [];
  for (let i = I0 * 4 - 4; i <= I1 * 4 + 8; i++) for (let j = J0 * 4 - 4; j <= J1 * 4 + 8; j++) {
    const [x, y] = proj(v, i * CELL / 4 - 50, j * CELL / 4 - 50);
    if (x < -20 || x > 1940 || y < -20 || y > 1100) continue;
    dots.push(<circle key={`${i},${j}`} data-probe={`dot${i},${j}`} cx={x} cy={y} r={3.0 * v.s} fill="#D3D7DD" />);
  }
  // ground: rings, routes, the turn's node
  const ground: React.ReactNode[] = [];
  RINGS.forEach((r, i) => {
    const s = ringState(g, r);
    if (!s) return;
    const [cx, cy] = centre(r.b);
    ground.push(<polygon key={`r${i}`} points={pts(groundRing(v, cx, cy, s.rad))} fill="none" stroke={r.col} strokeWidth={r.w * v.s} opacity={s.o} />);
  });
  // your lot's marker: a dashed outline round your lot until WKConversions comes in, then solid blue
  {
    const m = 26, { x0, y0, x1, y1 } = YOU, mo = k(g, "youTag", 0.5), mb = k(g, "comes", 0.5), mf = 1 - k(g, "fin", 0.5);
    const lot = [proj(v, x0 - m, y0 - m), proj(v, x1 + m, y0 - m), proj(v, x1 + m, y1 + m), proj(v, x0 - m, y1 + m)] as [number, number][];
    if (mo > 0 && mf > 0) ground.push(<polygon key="lot" points={pts(lot)} fill={rgba(C.blue, 0.08 * mb)} stroke={mb > 0.5 ? C.blue : "#9AA1AB"} strokeWidth={3 * v.s} strokeDasharray={mb > 0.5 ? undefined : `${10 * v.s} ${8 * v.s}`} strokeDashoffset={-t * 40 * v.s} strokeLinejoin="round" opacity={mo * mf} />);
  }
  const fade = 1 - k(g, "comes+0.7", 0.8);
  ground.push(<g key="turn" opacity={fade}><RouteLine v={v} r={TURN_ROUTE} u={routeK(g, TURN_ROUTE)} /></g>);
  OUT_ROUTES.forEach((r, i) => ground.push(<RouteLine key={`o${i}`} v={v} r={r} u={routeK(g, r)} w={4.5} />));

  // blocks and people, back to front
  type It = { d: number; n: React.ReactNode };
  const items: It[] = [];
  const yb = youBlue(g);
  for (const b of BIZ) {
    const h = heightOf(g, b);
    const [, py] = proj(v, b.x0, b.y1, 0);
    if (py < -400 || py > 1500) continue;
    const [sx] = proj(v, (b.x0 + b.x1) / 2, (b.y0 + b.y1) / 2, 0);
    if (sx < -300 || sx > 2220) continue;
    const you = b.role === "you";
    const tint = b.role === "comp" ? "ink" : "paper";
    const ye = youEdge(g), cg = b.role === "comp" ? k(g, "turn", 1.4, EASE.soft) : 0;
    const s = you ? (yb > 0 ? { h, tint: "blue" as const, to: "ai" as const, k: yb } : { h, tint: "grey" as const, to: "blue" as const, k: ye, edge: ye })
      : cg > 0 ? { h, tint: "ink" as const, to: "paper" as const, k: cg } : { h, tint: tint as "ink" | "paper" };
    items.push({ d: depth(v, (b.x0 + b.x1) / 2, (b.y0 + b.y1) / 2) + 40, n: (
      <g key={b.id}>
        <Box v={v} x0={b.x0} y0={b.y0} x1={b.x1} y1={b.y1} s={s} dark={you ? 0.6 * (1 - youEdge(g)) : 0} />
        {!(you && yb > 0.5) && <Screen g={g} v={v} b={b} h={h} />}
        {you && yb > 0 && <YouFace g={g} v={v} h={h} />}
      </g>) });
  }
  const pr = 5.4 * v.s;
  for (let i = 0; i < N_PEOPLE; i++) {
    const w = who(i, t);
    const tw = twinO(i, t);
    if (tw > 0) {
      const [wx, wy] = walk(PEOPLE[i], t), [x, y] = proj(v, wx, wy);
      if (x > -30 && x < 1950 && y > -30 && y < 1110) items.push({ d: depth(v, wx, wy) - 20, n: <circle key={`t${i}`} data-probe={`walker${i}`} cx={x} cy={y - pr} r={pr} fill={WALKER} opacity={tw} /> });
    }
    if (w.o <= 0.01) continue;
    const [x, y] = proj(v, w.x, w.y);
    if (x < -30 || x > 1950 || y < -30 || y > 1110) continue;
    items.push({ d: depth(v, w.x, w.y) - 20, n: <circle key={`p${i}`} data-probe={`person${i}`} cx={x} cy={y - pr} r={pr * (0.6 + 0.4 * w.o)} fill={w.blue > 0 ? mix(mix(WALKER, C.ink, w.ink), C.blue, w.blue) : w.ink > 0 ? mix(WALKER, C.ink, w.ink) : WALKER} opacity={Math.min(1, w.o * 1.4)} /> });
  }
  items.sort((a, b) => a.d - b.d);
  // conversions: a ring on the street where someone went in
  const pops: React.ReactNode[] = [];
  for (const c of CONVERSIONS) {
    const u = (t - c.t) / 0.75;
    if (u <= 0 || u >= 1) continue;
    const w = who(c.k, c.t - 0.001);
    pops.push(<polygon key={`c${c.k}`} points={pts(groundRing(v, w.x, w.y, lerp(8, 46, EASE.whipOut(u)), 28))} fill="none" stroke={C.blue} strokeWidth={3 * v.s} opacity={1 - u} />);
  }
  // the turn's node rises from the end of the line onto your roof on "comes in", and stays there, breathing
  const nodeUp = k(g, "comes", 0.6, EASE.soft);
  const end = TURN_ROUTE.pts[TURN_ROUTE.pts.length - 1];
  const [ycx, ycy] = centre(YOU);
  const nodeO = clamp01((t - T.s("turn") - TURN_ROUTE.dur) / 0.05) * (1 - k(g, "fin", 0.4));
  const np = proj(v, lerp(end[0], ycx, nodeUp), lerp(end[1], ycy, nodeUp), heightOf(g, YOU) * nodeUp + 70 * Math.sin(Math.PI * nodeUp));
  const breath = 0.5 + 0.5 * Math.sin(t * 4);
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
      <defs>
        <filter id="soft" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="7" /></filter>
      </defs>
      {dots}
      {ground}
      {items.map((it) => it.n)}
      {pops}
      {nodeO > 0 && (
        <g opacity={nodeO}>
          <circle cx={np[0]} cy={np[1]} r={(16 + 8 * breath) * v.s} fill={rgba(C.blue, 0.16)} />
          <circle cx={np[0]} cy={np[1]} r={10 * v.s} fill="#fff" stroke={C.blue} strokeWidth={4 * v.s} />
        </g>
      )}
    </svg>
  );
};

/** Your business at the sign-off: blue, its floors drawn on "built", the wireframe edge on "designed". */
const YouFace: React.FC<{ g: number; v: View; h: number }> = ({ g, v, h }) => {
  const { x0, y0, x1, y1 } = YOU;
  const P = (x: number, y: number, z: number) => proj(v, x, y, z);
  const fl = k(g, "built3", 0.6, EASE.steady), wf = k(g, "designed", 0.7, EASE.steady), yb = youBlue(g);
  const yf = Math.cos(v.th) >= 0 ? y1 : y0, yo = yf === y1 ? y0 : y1;
  const floors = [0.25, 0.5, 0.75].map((f, i) => {
    const z = h * f, u = clamp01(fl * 1.6 - i * 0.3);
    if (u <= 0) return null;
    const a = P(x0, yf, z), b = P(x1, yf, z), c = P(x1, yo, z);
    const ab = [a, [lerp(a[0], b[0], u), lerp(a[1], b[1], u)]] as [number, number][];
    const bc = [b, [lerp(b[0], c[0], u), lerp(b[1], c[1], u)]] as [number, number][];
    return <g key={i}><polyline points={pts(ab)} stroke="rgba(255,255,255,0.55)" strokeWidth={2.5 * v.s} fill="none" /><polyline points={pts(bc)} stroke="rgba(255,255,255,0.55)" strokeWidth={2.5 * v.s} fill="none" /></g>;
  });
  // the wireframe: the block's silhouette drawn on in the deep blue
  const sil: [number, number][] = [P(x0, yf, 0), P(x1, yf, 0), P(x1, yo, 0), P(x1, yo, h), P(x0, yo, h), P(x0, yf, h), P(x0, yf, 0)];
  const len = sil.slice(1).reduce((a, p, i) => a + Math.hypot(p[0] - sil[i][0], p[1] - sil[i][1]), 0);
  return (
    <g opacity={yb}>
      {floors}
      {wf > 0 && <polyline points={pts(sil)} fill="none" stroke={C.blueInk} strokeWidth={4 * v.s} strokeLinejoin="round" strokeDasharray={`${len * wf} ${len}`} />}
    </g>
  );
};
