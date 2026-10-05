// The market map, drawn as one SVG per frame: the ground and ClearScaler's loop on it, the reach ring and the research
// scan, the account blocks (depth-sorted), the routes the emails take and the replies that come back, the pins.
import React from "react";
import { T } from "./clock";
import { C, clamp01, lerp } from "./lib";
import {
  BLOCKS, Block, CELL, GAP, I0, I1, J0, J1, LOOP_PTS, OWN, ROUTES, SENDS, Send, WAVE, YOU, blockIntro, centre, depth, fitQuiet,
  lightOf, loopWorld, pointOn, proj, researched, ring, rise, scored, slice, View, view,
} from "./world";

const pts = (a: [number, number][]) => a.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
const ORANGE = (o: number) => `rgba(252,127,72,${o})`;
const GREEN = (o: number) => `rgba(75,198,128,${o})`;
const INK = (o: number) => `rgba(237,239,243,${o})`;
const lerpHex = (a: string, b: string, k: number) => {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16)), pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return `rgb(${pa.map((v, i) => Math.round(lerp(v, pb[i], k))).join(",")})`;
};

/** Where a send is at frame g: out (0..1), and back (0..1) when there is a reply. */
export const sendState = (g: number, s: Send) => {
  const t = g / 30;
  const out = clamp01((t - s.at) / s.dur);
  const ease = (u: number) => (u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2);
  const back = s.back ? clamp01((t - s.back.at) / s.back.dur) : 0;
  return { out: ease(out), back: ease(back), started: t >= s.at, arrived: out >= 1, home: back >= 1, backStarted: s.back ? t >= s.back.at : false };
};

/** The loop's points on the ground, projected (also used by the finale, where the loop lifts off). */
export const groundLoop = (g: number): [number, number][] => {
  const v = view(g);
  return LOOP_PTS.map((p) => { const [x, y] = loopWorld(p.x, p.y); return proj(v, x, y, 0); });
};
const seg = (p: [number, number][], u0: number, u1: number) => {
  const n = p.length - 1, a = Math.max(0, Math.floor(u0 * n)), b = Math.min(n, Math.ceil(u1 * n));
  return b > a ? p.slice(a, b + 1) : [];
};

const Box: React.FC<{ v: View; b: Block; g: number }> = ({ v, b, g }) => {
  const h = rise(g, b);
  const intro = blockIntro(g, b);
  if (intro <= 0) return null;
  const sc = scored(g, b), rs = researched(g, b);
  const you = b === YOU;
  const lit = you ? Math.max(0.35, T.k(g, "offer", 0.5)) * clamp01(intro * 2) : 0;
  const poorDim = b.fit === "poor" ? lerp(1, 0.42, sc) : 1;
  // after scoring, the accounts that don't fit step back so the fits (and what happens to them) read first
  const light = you ? 1 : (0.16 + 0.84 * lightOf(g, b)) * (b.fit === "border" ? lerp(1, 0.58, sc) : 1);
  const quiet = fitQuiet(g);
  const P = (x: number, y: number, z: number) => proj(v, x, y, z);
  const top: [number, number][] = [P(b.x0, b.y0, h), P(b.x1, b.y0, h), P(b.x1, b.y1, h), P(b.x0, b.y1, h)];
  const right: [number, number][] = [P(b.x1, b.y0, 0), P(b.x1, b.y1, 0), P(b.x1, b.y1, h), P(b.x1, b.y0, h)];
  const front: [number, number][] = [P(b.x0, b.y1, 0), P(b.x1, b.y1, 0), P(b.x1, b.y1, h), P(b.x0, b.y1, h)];
  const strongEdge = b.fit === "strong" && !you ? sc * (1 - quiet) : 0;
  const dots: React.ReactNode[] = [];
  if (rs > 0 && !you) {
    const nx = b.x1 - b.x0 > b.y1 - b.y0 ? 4 : 2, ny = nx === 4 ? 2 : 4;
    const fitOrange = b.fit === "strong" ? sc * (1 - quiet) : 0;
    for (let a = 0; a < nx; a++)
      for (let c = 0; c < ny; c++) {
        const k = clamp01(rs * 1.6 - (a + c * nx) * 0.06);
        if (k <= 0) continue;
        const [x, y] = P(lerp(b.x0, b.x1, (a + 0.5) / nx), lerp(b.y0, b.y1, (c + 0.5) / ny), h);
        const base = b.fit === "poor" ? 0.4 - 0.3 * sc : 0.4;
        dots.push(<circle key={a * 9 + c} cx={x} cy={y} r={2.3 * v.s * (0.5 + 0.5 * k)} fill={INK(base)} opacity={k * (1 - fitOrange)} />);
        if (fitOrange > 0) dots.push(<circle key={`o${a * 9 + c}`} cx={x} cy={y} r={2.3 * v.s * (0.5 + 0.5 * k)} fill={ORANGE(0.85)} opacity={k * fitOrange} />);
      }
  }
  return (
    <g opacity={Math.min(1, intro * 2.2) * poorDim * light}>
      <polygon points={pts(front)} fill={you ? lerpHex("#16171B", "#2A2B30", lit) : "#0F1013"} stroke={INK(you ? 0.1 + 0.3 * lit : 0.07)} strokeWidth={1} />
      <polygon points={pts(right)} fill={you ? lerpHex("#1D1E22", "#383940", lit) : "#16171A"} stroke={INK(you ? 0.1 + 0.3 * lit : 0.07)} strokeWidth={1} />
      <polygon points={pts(top)} fill={you ? lerpHex("#26272C", "#5A5C63", lit) : "#23242A"} stroke={you ? INK(0.2 + 0.7 * lit) : INK(0.16)} strokeWidth={you ? 1.6 : 1.2} />
      {strongEdge > 0 && <polygon points={pts(top)} fill="none" stroke={ORANGE(0.75)} strokeWidth={1.2} opacity={strongEdge} />}
      {dots}
    </g>
  );
};

export const World: React.FC<{ g: number }> = ({ g }) => {
  const t = g / 30;
  const v = view(g);
  const P = (x: number, y: number, z = 0) => proj(v, x, y, z);
  const S = Math.max(0.7, v.s);
  // ground: the market's slab and a faint outer outline, drawn on in the first second
  const gx0 = I0 * CELL - GAP, gy0 = J0 * CELL - GAP, gx1 = (I1 + 1) * CELL, gy1 = (J1 + 1) * CELL;
  const slab: [number, number][] = [P(gx0, gy0), P(gx1, gy0), P(gx1, gy1), P(gx0, gy1)];
  const outer: [number, number][] = [P(gx0 - 130, gy0 - 130), P(gx1 + 130, gy0 - 130), P(gx1 + 130, gy1 + 130), P(gx0 - 130, gy1 + 130)];
  const draw = 0.35 + 0.65 * T.k(g, "open", 1.0);

  // ClearScaler's loop on the ground: drawn by an orange comet in the first second (the site's hero), then a hairline;
  // the scan laps it once; at the end it lights up, orange round "be seen", green round "be chosen".
  const loop = groundLoop(g);
  const drawU = 0.2 + 0.8 * T.k(g, "open", 1.3, (u) => u * u * (3 - 2 * u));
  const settle = T.k(g, "open+1.2", 0.7);
  const lap = clamp01((t - T.s("scan")) / 1.6);
  const lit = T.k(g, "loopOn", 0.8);
  const loopGone = false;
  const ghost = T.k(g, "stat", 0.6);
  const comet = (u: number, len: number, col: (o: number) => string, w: number, key: string) => {
    const parts: React.ReactNode[] = [];
    for (let k = 0; k < 6; k++) {
      const a = u - (len * (k + 1)) / 6, b = u - (len * k) / 6;
      const p = seg(loop, Math.max(0, a), Math.max(0, b));
      if (p.length > 1) parts.push(<polyline key={key + k} points={pts(p)} fill="none" stroke={col(0.95 * (1 - k / 6))} strokeWidth={w * (1 - k / 9)} strokeLinecap="round" />);
    }
    return parts;
  };
  const loopEls: React.ReactNode[] = [];
  if (!loopGone) {
    const hair = INK(0.13 * settle * (1 - ghost) + 0.2 * ghost);
    if (drawU > 0) loopEls.push(<polyline key="hair" points={pts(seg(loop, 0, drawU))} fill="none" stroke={hair} strokeWidth={1.6 * S} />);
    if (drawU > 0 && settle < 1) loopEls.push(<polyline key="draw" points={pts(seg(loop, 0, drawU))} fill="none" stroke={ORANGE(0.85 * (1 - settle))} strokeWidth={2.6 * S} strokeLinecap="round" />);
    if (drawU > 0 && drawU < 1) loopEls.push(...comet(drawU, 0.12, ORANGE, 4 * S, "c0"));
    if (lap > 0 && lap < 1) loopEls.push(...comet(lap, 0.16, ORANGE, 3.5 * S, "c1"));
    if (ghost > 0) { const u = ((t - T.s("stat")) / 3.2) % 1; loopEls.push(...comet(u, 0.1, (o) => ORANGE(o * 0.8 * ghost), 4 * S, "c4")); }
    if (lit > 0 && ghost < 1) {
      loopEls.push(<polyline key="seen" points={pts(seg(loop, 0, 0.5))} fill="none" stroke={ORANGE(0.75 * lit * (1 - ghost))} strokeWidth={3 * S} strokeLinecap="round" />);
      loopEls.push(<polyline key="chosen" points={pts(seg(loop, 0.5, 1))} fill="none" stroke={GREEN(0.75 * lit * (1 - ghost))} strokeWidth={3 * S} strokeLinecap="round" />);
      const run = ((t - T.s("loopOn")) / 1.4) % 1;
      loopEls.push(...comet(run * 0.5 + 0.0001, 0.08, (o) => ORANGE(o * lit * (1 - ghost)), 5 * S, "c2"));
      loopEls.push(...comet(0.5 + run * 0.5, 0.08, (o) => GREEN(o * lit * (1 - ghost)), 5 * S, "c3"));
    }
  }

  // the reach ring (the viewer's own reach), then the research scan
  const rg = ring(g);
  const [yx, yy] = centre(YOU);
  const [rcx, rcy] = P(yx, yy);
  const reachOn = T.k(g, "dist", 0.3) * (1 - rg.scan);
  const scanOn = rg.scan * (1 - rg.fade);
  // blocks, culled to the frame and sorted back to front
  const vis = BLOCKS.filter((b) => {
    const [x, y] = P((b.x0 + b.x1) / 2, (b.y0 + b.y1) / 2);
    return x > -160 && x < 2080 && y > -140 && y < 1180;
  }).sort((a, b) => depth(v, a.x1, a.y1) - depth(v, b.x1, b.y1));

  // routes: out in orange, back in green; settled routes stay as a faint trace
  const trails: React.ReactNode[] = [];
  const heads: React.ReactNode[] = [];
  const pins: React.ReactNode[] = [];
  const all = [...SENDS, ...WAVE];
  const toLoop = T.k(g, "loopOn", 0.8);                                         // the traffic hands over to the loop
  all.forEach((s, n) => {
    const st = sendState(g, s);
    if (!st.started) return;
    const r = ROUTES.get(s.to)!;
    const settleR = st.arrived ? clamp01((t - s.at - s.dur) / 0.8) : 0;
    const handed = s.back && st.backStarted ? clamp01((t - s.back.at) / 0.25) : 0;   // the orange gives way to the reply
    const fade = (1 - toLoop) * (WAVE.includes(s) ? 1 : 1 - T.k(g, "pull+0.6", 1.0));
    if (fade <= 0) return;
    const line = slice(r, 0, st.out).map(([x, y]) => P(x, y));
    if (line.length > 1) {
      trails.push(<polyline key={`t${n}`} points={pts(line)} fill="none" stroke={INK(0.12 * settleR * fade)} strokeWidth={2 * S} strokeLinecap="round" strokeLinejoin="round" />);
      trails.push(<polyline key={`o${n}`} points={pts(line)} fill="none" stroke={ORANGE(0.9 * (1 - settleR) * (1 - handed) * fade)} strokeWidth={3.2 * S} strokeLinecap="round" strokeLinejoin="round" />);
    }
    if (!st.arrived) {
      const [x, y] = P(...pointOn(r, st.out));
      const first = n === 0;
      if (first) { const tail = slice(r, Math.max(0, st.out - 0.18), st.out).map(([a, b]) => P(a, b)); if (tail.length > 1) heads.push(<polyline key={`ht${n}`} points={pts(tail)} fill="none" stroke={ORANGE(0.95)} strokeWidth={8 * S} strokeLinecap="round" />); }
      heads.push(<g key={`h${n}`} opacity={fade}><circle cx={x} cy={y} r={(first ? 45 : 22) * S} fill={ORANGE(first ? 0.22 : 0.2)} /><circle cx={x} cy={y} r={(first ? 14 : 9) * S} fill={C.orange} /></g>);
    }
    if (s.back && st.backStarted) {
      const back = slice(r, 1 - st.back, 1).map(([x, y]) => P(x, y));
      const fadeB = st.home ? 1 - clamp01((t - s.back.at - s.back.dur) / 0.8) * 0.8 : 1;
      if (back.length > 1) trails.push(<polyline key={`b${n}`} points={pts(back)} fill="none" stroke={GREEN(0.9 * fadeB * fade)} strokeWidth={3.2 * S} strokeLinecap="round" strokeLinejoin="round" />);
      if (!st.home) {
        const [x, y] = P(...pointOn(r, 1 - st.back));
        heads.push(<g key={`g${n}`} opacity={fade}><circle cx={x} cy={y} r={22 * S} fill={GREEN(0.2)} /><circle cx={x} cy={y} r={9 * S} fill={C.green} /></g>);
      }
    }
    // the pin on a contacted account: orange when written to, green when it replied (crossfaded, not tinted)
    const k = st.arrived ? clamp01((t - s.at - s.dur) / 0.3) : 0;
    if (k > 0) {
      const b = s.to, h = rise(g, b);
      const [cx, cy] = centre(b);
      const green = s.back && st.backStarted ? clamp01((t - s.back.at) / 0.25) : 0;
      const [x0, y0] = P(cx, cy, h), [x1, y1] = P(cx, cy, h + 44 * (1 - Math.pow(1 - k, 3)));
      pins.push(<g key={`p${n}`} opacity={k * fade}>
        <line x1={x0} y1={y0} x2={x1} y2={y1} stroke={C.orange} strokeWidth={2} opacity={1 - green} />
        <line x1={x0} y1={y0} x2={x1} y2={y1} stroke={C.green} strokeWidth={2} opacity={green} />
        <circle cx={x1} cy={y1} r={5.5 * S} fill={C.orange} opacity={1 - green} />
        <circle cx={x1} cy={y1} r={5.5 * S} fill={C.green} opacity={green} />
      </g>);
    }
  });
  // the viewer's own reach: a few grey emails by hand, to the nearest accounts only
  [...OWN, ...OWN].forEach((b, n) => {
    const at = T.s("dist") + 0.2 + n * 0.3, u = clamp01((t - at) / 0.6);
    const gone = T.k(g, "scan", 0.4);
    if (u <= 0 || gone >= 1) return;
    const r = ROUTES.get(b)!;
    const line = slice(r, 0, u).map(([x, y]) => P(x, y));
    if (line.length > 1) trails.push(<polyline key={`own${n}`} points={pts(line)} fill="none" stroke={INK(0.35 * (1 - gone))} strokeWidth={2 * S} strokeLinecap="round" strokeLinejoin="round" />);
    if (u < 1) { const [x, y] = P(...pointOn(r, u)); heads.push(<circle key={`oh${n}`} cx={x} cy={y} r={6 * S} fill={INK(0.75)} />); }
  });

  return (
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, overflow: "visible" }} data-probe="world">
      <polygon points={pts(outer)} fill="none" stroke={INK(0.05)} strokeWidth={1} pathLength={1} strokeDasharray={`${draw} 1`} />
      <polygon points={pts(slab)} fill="#0A0B0E" fillOpacity={draw} stroke={INK(0.09)} strokeWidth={1} pathLength={1} strokeDasharray={`${draw} 1`} />
      {reachOn > 0 && (
        <g opacity={reachOn}>
          <ellipse cx={rcx} cy={rcy} rx={rg.r * v.s} ry={rg.r * v.s * 0.56} fill={INK(0.06)} stroke={INK(0.7)} strokeWidth={3} strokeDasharray="10 9" strokeDashoffset={-g * 1.2} />
        </g>
      )}
      {loopEls}
      {scanOn > 0 && (
        <g opacity={scanOn}>
          <ellipse cx={rcx} cy={rcy} rx={Math.max(0, rg.r - 70) * v.s} ry={Math.max(0, rg.r - 70) * v.s * 0.56} fill="none" stroke={ORANGE(0.12)} strokeWidth={10} />
          <ellipse cx={rcx} cy={rcy} rx={rg.r * v.s} ry={rg.r * v.s * 0.56} fill="none" stroke={ORANGE(0.75)} strokeWidth={2.5} />
        </g>
      )}
      {trails}
      {vis.map((b) => <Box key={b.id} v={v} b={b} g={g} />)}
      {pins}
      {heads}
    </svg>
  );
};
