// The market map, drawn as one SVG per frame: the ground, the reach ring and the research scan, the account blocks
// (depth-sorted), the routes the emails take and the replies that come back, the pins on contacted accounts.
import React from "react";
import { T } from "./clock";
import { C, clamp01, lerp } from "./lib";
import {
  BLOCKS, Block, CELL, GAP, I0, I1, J0, J1, ROUTES, SENDS, Send, WAVE, YOU, blockIntro, centre, depth, dist, pointOn, proj,
  lightOf, ring, researched, rise, scored, slice, View, view,
} from "./world";

const pts = (a: [number, number][]) => a.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
const ORANGE = (o: number) => `rgba(252,127,72,${o})`;
const GREEN = (o: number) => `rgba(75,198,128,${o})`;
const INK = (o: number) => `rgba(237,239,243,${o})`;

/** Where a send is at frame g: out (0..1), and back (0..1) when there is a reply. */
export const sendState = (g: number, s: Send) => {
  const t = g / 30;
  const out = clamp01((t - s.at) / s.dur);
  const ease = (u: number) => (u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2);
  const back = s.back ? clamp01((t - s.back.at) / s.back.dur) : 0;
  return { out: ease(out), back: ease(back), started: t >= s.at, arrived: out >= 1, home: back >= 1, backStarted: s.back ? t >= s.back.at : false };
};

const Box: React.FC<{ v: View; b: Block; g: number }> = ({ v, b, g }) => {
  const h = rise(g, b);
  const intro = blockIntro(g, b);
  if (intro <= 0) return null;
  const sc = scored(g, b), rs = researched(g, b);
  const you = b === YOU;
  const lit = you ? T.k(g, "offer", 0.5) : 0;
  const poorDim = b.fit === "poor" ? lerp(1, 0.42, sc) : 1;
  // after scoring, the accounts that don't fit step back so the fits (and what happens to them) read first
  const light = you ? 1 : (0.16 + 0.84 * lightOf(g, b)) * (b.fit === "border" ? lerp(1, 0.58, sc) : 1);
  const P = (x: number, y: number, z: number) => proj(v, x, y, z);
  const top: [number, number][] = [P(b.x0, b.y0, h), P(b.x1, b.y0, h), P(b.x1, b.y1, h), P(b.x0, b.y1, h)];
  const right: [number, number][] = [P(b.x1, b.y0, 0), P(b.x1, b.y1, 0), P(b.x1, b.y1, h), P(b.x1, b.y0, h)];
  const front: [number, number][] = [P(b.x0, b.y1, 0), P(b.x1, b.y1, 0), P(b.x1, b.y1, h), P(b.x0, b.y1, h)];
  const strongEdge = b.fit === "strong" && !you ? sc : 0;
  // data dots on the top face: the research, made physical
  const dots: React.ReactNode[] = [];
  if (rs > 0 && !you) {
    const nx = b.x1 - b.x0 > b.y1 - b.y0 ? 4 : 2, ny = nx === 4 ? 2 : 4;
    for (let a = 0; a < nx; a++)
      for (let c = 0; c < ny; c++) {
        const k = clamp01(rs * 1.6 - (a + c * nx) * 0.06);
        if (k <= 0) continue;
        const [x, y] = P(lerp(b.x0, b.x1, (a + 0.5) / nx), lerp(b.y0, b.y1, (c + 0.5) / ny), h);
        const col = b.fit === "strong" ? (sc > 0 ? ORANGE(0.35 + 0.5 * sc) : INK(0.4)) : b.fit === "poor" ? INK(0.4 - 0.3 * sc) : INK(0.4);
        dots.push(<circle key={a * 9 + c} cx={x} cy={y} r={2.3 * v.s * (0.5 + 0.5 * k)} fill={col} opacity={k} />);
      }
  }
  return (
    <g opacity={Math.min(1, intro * 2.2) * poorDim * light}>
      <polygon points={pts(front)} fill={you ? lerpHex("#16171B", "#2A2B30", lit) : "#0F1013"} stroke={INK(you ? 0.1 + 0.3 * lit : 0.07)} strokeWidth={1} />
      <polygon points={pts(right)} fill={you ? lerpHex("#1D1E22", "#383940", lit) : "#16171A"} stroke={INK(you ? 0.1 + 0.3 * lit : 0.07)} strokeWidth={1} />
      <polygon points={pts(top)} fill={you ? lerpHex("#26272C", "#5A5C63", lit) : "#23242A"} stroke={you ? INK(0.2 + 0.7 * lit) : strongEdge > 0 ? ORANGE(0.75 * strongEdge) : INK(0.16)}
        strokeWidth={you ? 1.6 : 1.2} />
      {dots}
    </g>
  );
};

const lerpHex = (a: string, b: string, k: number) => {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16)), pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return `rgb(${pa.map((v, i) => Math.round(lerp(v, pb[i], k))).join(",")})`;
};

export const World: React.FC<{ g: number }> = ({ g }) => {
  const v = view(g);
  const P = (x: number, y: number, z = 0) => proj(v, x, y, z);
  // ground: the market's slab and a faint outer outline, drawn on in the first second
  const gx0 = I0 * CELL - GAP, gy0 = J0 * CELL - GAP, gx1 = (I1 + 1) * CELL, gy1 = (J1 + 1) * CELL;
  const slab: [number, number][] = [P(gx0, gy0), P(gx1, gy0), P(gx1, gy1), P(gx0, gy1)];
  const outer: [number, number][] = [P(gx0 - 130, gy0 - 130), P(gx1 + 130, gy0 - 130), P(gx1 + 130, gy1 + 130), P(gx0 - 130, gy1 + 130)];
  const draw = T.k(g, "open", 1.3);
  // the reach ring, then the research scan
  const rg = ring(g);
  const [yx, yy] = centre(YOU);
  const [rcx, rcy] = P(yx, yy);
  const reachOn = T.k(g, "reach", 0.3) * (1 - rg.scan);
  const scanOn = rg.scan * (1 - rg.fade);
  // blocks, culled to the frame and sorted back to front
  const vis = BLOCKS.filter((b) => {
    const [x, y] = P((b.x0 + b.x1) / 2, (b.y0 + b.y1) / 2);
    return x > -160 && x < 2080 && y > -140 && y < 1180;
  }).sort((a, b) => depth(v, a.x1, a.y1) - depth(v, b.x1, b.y1));
  // routes: out in orange, back in green
  const trails: React.ReactNode[] = [];
  const heads: React.ReactNode[] = [];
  const all = [...SENDS, ...WAVE];
  all.forEach((s, n) => {
    const st = sendState(g, s);
    if (!st.started) return;
    const r = ROUTES.get(s.to)!;
    const settle = st.arrived ? clamp01((g / 30 - s.at - s.dur) / 0.8) : 0;
    const waveFade = WAVE.includes(s) ? 1 : 1 - T.k(g, "pull+1.2", 1.2);
    const tail = Math.max(0, st.out - 0.35);
    const line = slice(r, st.arrived ? 0 : tail * 0.0, st.out).map(([x, y]) => P(x, y));
    if (line.length > 1) trails.push(<polyline key={`o${n}`} points={pts(line)} fill="none" stroke={ORANGE(lerp(0.85, 0.22, settle) * waveFade)} strokeWidth={2.4 * Math.max(0.6, v.s)} strokeLinecap="round" strokeLinejoin="round" />);
    if (!st.arrived) {
      const [x, y] = P(...pointOn(r, st.out));
      heads.push(<g key={`h${n}`}><circle cx={x} cy={y} r={11 * Math.max(0.6, v.s)} fill={ORANGE(0.18)} /><circle cx={x} cy={y} r={5.5 * Math.max(0.6, v.s)} fill={C.orange} /></g>);
    }
    if (s.back && st.backStarted) {
      const back = slice(r, 1 - st.back, 1).map(([x, y]) => P(x, y));
      const fadeB = st.home ? 1 - clamp01((g / 30 - s.back.at - s.back.dur) / 0.8) * 0.75 : 1;
      if (back.length > 1) trails.push(<polyline key={`b${n}`} points={pts(back)} fill="none" stroke={GREEN(0.9 * fadeB * waveFade)} strokeWidth={2.6 * Math.max(0.6, v.s)} strokeLinecap="round" strokeLinejoin="round" />);
      if (!st.home) {
        const [x, y] = P(...pointOn(r, 1 - st.back));
        heads.push(<g key={`g${n}`}><circle cx={x} cy={y} r={11 * Math.max(0.6, v.s)} fill={GREEN(0.18)} /><circle cx={x} cy={y} r={5.5 * Math.max(0.6, v.s)} fill={C.green} /></g>);
      }
    }
  });
  // pins on contacted accounts: orange when written to, green when they replied
  const pins: React.ReactNode[] = [];
  all.forEach((s, n) => {
    const st = sendState(g, s);
    const k = st.arrived ? clamp01((g / 30 - s.at - s.dur) / 0.3) : 0;
    if (k <= 0) return;
    const b = s.to, h = rise(g, b);
    const [cx, cy] = centre(b);
    const green = s.back && st.backStarted ? clamp01((g / 30 - s.back.at) / 0.25) : 0;
    const [x0, y0] = P(cx, cy, h), [x1, y1] = P(cx, cy, h + 44 * (1 - Math.pow(1 - k, 3)));
    const col = green > 0 ? `rgb(${Math.round(lerp(252, 75, green))},${Math.round(lerp(127, 198, green))},${Math.round(lerp(72, 128, green))})` : C.orange;
    pins.push(<g key={`p${n}`} opacity={k * (WAVE.includes(s) ? 0.9 : 1)}><line x1={x0} y1={y0} x2={x1} y2={y1} stroke={col} strokeWidth={1.6} /><circle cx={x1} cy={y1} r={4.5 * Math.max(0.6, v.s)} fill={col} /></g>);
  });
  return (
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, overflow: "visible" }} data-probe="world">
      <polygon points={pts(outer)} fill="none" stroke={INK(0.05)} strokeWidth={1} pathLength={1} strokeDasharray={`${draw} 1`} />
      <polygon points={pts(slab)} fill="#0A0B0E" fillOpacity={draw} stroke={INK(0.09)} strokeWidth={1} pathLength={1} strokeDasharray={`${draw} 1`} />
      {reachOn > 0 && (
        <g opacity={reachOn}>
          <ellipse cx={rcx} cy={rcy} rx={rg.r * v.s} ry={rg.r * v.s * 0.56} fill={INK(0.025)} stroke={INK(0.45)} strokeWidth={1.5} strokeDasharray="7 7" />
        </g>
      )}
      {scanOn > 0 && (
        <g opacity={scanOn}>
          <ellipse cx={rcx} cy={rcy} rx={Math.max(0, rg.r - 70) * v.s} ry={Math.max(0, rg.r - 70) * v.s * 0.56} fill="none" stroke={ORANGE(0.12)} strokeWidth={10} />
          <ellipse cx={rcx} cy={rcy} rx={rg.r * v.s} ry={rg.r * v.s * 0.56} fill="none" stroke={ORANGE(0.75)} strokeWidth={2} />
        </g>
      )}
      {trails}
      {vis.map((b) => <Box key={b.id} v={v} b={b} g={g} />)}
      {pins}
      {heads}
    </svg>
  );
};
void dist;
