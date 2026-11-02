// B1 (S1–S3, 0–8.55): one continuous life of the logo's wave, shared by the three scenes so nothing jumps between them.
// The mark draws on -> stretches into the line between card A (street) and card B (Diego) -> the ridge pushes them apart ->
// the line snaps -> its dot searches along the ridge and ties a knot -> the knot unwinds into a straight line -> springs
// into the mark -> takes its place in the serif logotype -> is left alone at H.mark (the hand-off to S4).
// The stage is drawn by S1 before 3.32, by S2 from 3.32 to 5.80 and by S3 from 5.80 (each scene draws only its slice).
import React from "react";
import { Easing } from "remotion";
import { C, CX, CY, IN, INOUT, OUT, SANS, SINE, SOFT, Photo, Pt, c01, k, markDot, markPoints, mix, sinePoints, sp } from "../kit";
import { topoPath } from "../topo";
import { H } from "../handoff";
import { TopoPart } from "./types";

export const N = 240;
const TAU = Math.PI * 2;

// ------------------------------------------------------------------ camera (B1 foreground only; the spine's field stays still)
/** breath ±0.8 % (6 s sine) × push 1.00 -> 1.05 (2.9–4.9) × pull 1.05 -> 1.00 from 8.3 (S4 carries the pull on) */
export const cam = (t: number) => (1 + 0.008 * Math.sin((TAU * t) / 6)) * (1 + 0.05 * k(t, 2.9, 2.0, INOUT) - 0.05 * k(t, 8.3, 1.8, INOUT));
/** a layout point -> where it lands on screen under the camera (for topo ripples, which live in screen space) */
export const scr = (p: Pt, t: number): Pt => { const s = cam(t); return [CX + (p[0] - CX) * s, CY + (p[1] - CY) * s]; };
export const Cam: React.FC<{ t: number; children?: React.ReactNode }> = ({ t, children }) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `scale(${cam(t)})` }}>{children}</div>
);

// ------------------------------------------------------------------ polylines
const cumLen = (P: Pt[]): number[] => { const L: number[] = new Array(P.length).fill(0); for (let i = 1; i < P.length; i++) L[i] = L[i - 1] + Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]); return L; };
const pointAt = (P: Pt[], L: number[], s: number): [Pt, number] => {
  const n = P.length; if (s <= 0) return [P[0], 0]; if (s >= L[n - 1]) return [P[n - 1], n - 2];
  let lo = 0, hi = n - 1; while (hi - lo > 1) { const m = (lo + hi) >> 1; if (L[m] <= s) lo = m; else hi = m; }
  const u = (s - L[lo]) / (L[hi] - L[lo] || 1); return [[mix(P[lo][0], P[hi][0], u), mix(P[lo][1], P[hi][1], u)], lo];
};
/** the part of a polyline between arc lengths a and b (px), ends interpolated so a drawn tip glides */
const cut = (P: Pt[], a: number, b: number, L = cumLen(P)): Pt[] => {
  const [pa, ia] = pointAt(P, L, a); if (b <= a) return [pa, pa];
  const [pb, ib] = pointAt(P, L, b); const out: Pt[] = [pa]; for (let i = ia + 1; i <= ib; i++) out.push(P[i]); out.push(pb); return out;
};
const about = (P: Pt[], c: Pt, s: number): Pt[] => P.map((p) => [c[0] + (p[0] - c[0]) * s, c[1] + (p[1] - c[1]) * s]);
const span = (P: Pt[]): [number, number] => { let a = Infinity, b = -Infinity; for (const p of P) { if (p[0] < a) a = p[0]; if (p[0] > b) b = p[0]; } return [a, b]; };
/** centripetal Catmull-Rom through W[1..n-2] (W[0] and W[n-1] only steer the ends), about 3 px per sample */
const spline = (W: Pt[], marks: number[]): Pt[] => {
  const out: Pt[] = []; const d = (a: Pt, b: Pt) => Math.max(1e-3, Math.sqrt(Math.hypot(b[0] - a[0], b[1] - a[1])));
  for (let i = 0; i < W.length - 3; i++) {
    const [p0, p1, p2, p3] = [W[i], W[i + 1], W[i + 2], W[i + 3]]; const t1 = d(p0, p1), t2 = t1 + d(p1, p2), t3 = t2 + d(p2, p3);
    const per = Math.max(6, Math.ceil(Math.hypot(p2[0] - p1[0], p2[1] - p1[1]) / 3)); marks.push(out.length);
    for (let j = 0; j < per; j++) {
      const tt = t1 + ((t2 - t1) * j) / per;
      const l = (a: Pt, b: Pt, ta: number, tb: number): Pt => [((tb - tt) * a[0] + (tt - ta) * b[0]) / (tb - ta), ((tb - tt) * a[1] + (tt - ta) * b[1]) / (tb - ta)];
      const A1 = l(p0, p1, 0, t1), A2 = l(p1, p2, t1, t2), A3 = l(p2, p3, t2, t3); out.push(l(l(A1, A2, 0, t2), l(A2, A3, t1, t3), t1, t2));
    }
  }
  out.push(W[W.length - 2]); return out;
};
const backOut = (u: number, s = 1.25) => { const x = c01(u) - 1; return 1 + (s + 1) * x * x * x + s * x * x; };
const bump = (t: number, a: number, d: number) => Math.sin(Math.PI * c01((t - a) / d));

// ------------------------------------------------------------------ cards A (street, from their hero) and B (Diego, organizing team)
export type CardS = { on: boolean; cx: number; cy: number; s: number; rot: number; sat: number; bri: number; clip: number; zoom: number; att: Pt };
/** b 0 = card A (its right edge holds the line), 1 = card B (the dot docks on its left edge) */
export const card = (t: number, b: 0 | 1): CardS => {
  const A = b === 0, sg = A ? 1 : -1, t0 = A ? 1.05 : 1.7, ax = A ? 600 : 1320;
  const bs = 0.6 + 0.4 * sp(t, t0, 1.6, 0.85);                       // blooms 0.6 -> 1 about the line's cap / the dot
  const m = k(t, 3.1, 0.8, INOUT), lv = k(t, 5.8, 0.45, IN);         // pushed apart by the ridge; gone past the edges
  const s = bs * (1 - 0.18 * m);
  const rot = sg * (4 * sp(t, 2.45, 1.5, 0.7) - 6 * k(t, 3.1, 0.7, INOUT));   // tilt toward each other, then lean away
  const bob = 5 * Math.sin((t - 3.6) * 2.1 + (A ? 0 : 1.7)) * k(t, 3.5, 0.8, INOUT);
  const cx = ax - sg * (200 * bs + 100 * m + 660 * lv), cy = 580 + bob;
  const r = (rot * Math.PI) / 180, hw = sg * 200 * s;
  return { on: t >= t0 && lv < 1, cx, cy, s, rot, sat: 1 - 0.65 * m, bri: 1 - 0.3 * m, clip: mix(20, 820, k(t, t0, 0.65, OUT)), zoom: 1.15 - 0.15 * k(t, t0, 0.9, OUT),
    att: [cx + hw * Math.cos(r), cy + hw * Math.sin(r)] };
};
const CardView: React.FC<{ c: CardS; src: string; pos: string; side: 0 | 1 }> = ({ c, src, pos, side }) => !c.on ? null : (
  <div style={{ position: "absolute", left: 0, top: 0, width: 400, height: 500, transform: `translate(${c.cx - 200}px, ${c.cy - 250}px) rotate(${c.rot}deg) scale(${c.s})` }}>
    <Photo src={src} w={400} h={500} r={32} zoom={c.zoom} pos={pos}
      style={{ clipPath: c.clip < 819.9 ? `circle(${c.clip}px at ${side === 0 ? "100%" : "0%"} 50%)` : undefined, filter: c.sat < 0.999 ? `saturate(${c.sat}) brightness(${c.bri})` : undefined }} />
  </div>
);

// ------------------------------------------------------------------ the wave's shapes
const M480 = markPoints(N, 960, 560, 480), D480 = markDot(960, 560, 480);
const FLAT = markPoints(N, 960, 560, 520);                         // the straight line = the 520 px mark, flattened
const drawE = Easing.bezier(0.45, 0, 0.25, 1);
const GAP = 34;                                                    // the line stops short of its dot, as in the logo
const stretchPts = (t: number): Pt[] => {
  const a = card(t, 0).att, b = card(t, 1).att; const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1;
  const amp = 30 * (1 + 0.15 * bump(t, 2.7, 0.55)) * (1 - 0.55 * k(t, 3.1, 0.3, INOUT));
  return sinePoints(N, a[0], a[1], b[0] - (dx / L) * GAP, b[1] - (dy / L) * GAP, 1.5, amp, Math.PI - 1.2 * Math.max(0, t - 0.8), true);
};
const strokeW = (t: number) => (t < 5.9 ? 42 - 18 * k(t, 3.05, 0.5, INOUT) : 24 + 21.5 * k(t, 5.95, 0.6, INOUT));

// the knot: three tightening loops around the centre (a looped coil advancing left to right, crossing itself); lam unwinds it
// into the flattened mark, sc scales it about its centre, ch turns the loops in place
const KX = 960, KY = 560, LK = 300, R0 = 82, RT = 0.36, AY = 0.9;
const knotPt = (v: number, fx: number, lam: number, sc: number, ch: number): Pt => {
  const base = mix(KX + (v - 0.5) * LK, fx, lam), R = R0 * (1 - RT * v) * (1 - lam), th = Math.PI / 2 + 3 * TAU * v + ch;
  return [KX + (base - KX + R * Math.cos(th)) * sc, KY + R * Math.sin(th) * AY * sc];
};

// the snap (3.32): the stretched line breaks where it crosses the ridge (x 960)
const TS = 3.32;
type Snap = { P: Pt[]; is: number; F: Pt; A0: Pt; B0: Pt; gx: [number, number]; cEnd: number };
let SNAP: Snap | null = null;
const snap = (): Snap => {
  if (SNAP) return SNAP;
  const P = stretchPts(TS); let is = 1; while (is < N - 1 && P[is][0] < 960) is++;
  const u = (960 - P[is - 1][0]) / (P[is][0] - P[is - 1][0] || 1); const F: Pt = [960, mix(P[is - 1][1], P[is][1], u)];
  const B0 = card(TS, 1).att;
  return (SNAP = { P, is, F, A0: card(TS, 0).att, B0, gx: span(P), cEnd: 50 / Math.hypot(B0[0] - F[0], B0[1] - F[1]) });
};

// the search (3.52–5.27): the dot runs up the ridge's flank, turns toward card B, is bent back and loops into the knot.
// One path; the head moves at a steady speed along the ridge and speeds up into the loops; the tail follows (a snake).
const T0S = 3.52, TK = 4.55, TE = 5.27, DT = 0.001;
type Snake = { P: Pt[]; L: number[]; s0: number; sK: number; sE: number; A1: number[]; A2: number[]; v1: number; v2: number };
let SNK: Snake | null = null;
const lin = (t: number, q: [number, number][]) => { if (t <= q[0][0]) return q[0][1]; for (let i = 1; i < q.length; i++) if (t <= q[i][0]) return mix(q[i - 1][1], q[i][1], (t - q[i - 1][0]) / (q[i][0] - q[i - 1][0])); return q[q.length - 1][1]; };
const snake = (): Snake => {
  if (SNK) return SNK;
  const { F, B0, cEnd } = snap(); const D0: Pt = [F[0] + (B0[0] - F[0]) * cEnd, F[1] + (B0[1] - F[1]) * cEnd];
  const K0 = knotPt(0, 0, 0, 1, 0), Kd = knotPt(0.003, 0, 0, 1, 0); const kl = Math.hypot(Kd[0] - K0[0], Kd[1] - K0[1]);
  const W: Pt[] = [[2 * F[0] - D0[0], 2 * F[1] - D0[1]], F, D0, [1034, F[1] - 34], [1042, 470], [1048, 398], [1082, 350], [1152, 333], [1228, 352], [1286, 408],
    [1296, 480], [1250, 546], [1162, 598], [1044, 630], [928, 640], K0, [K0[0] + ((Kd[0] - K0[0]) / kl) * 60, K0[1] + ((Kd[1] - K0[1]) / kl) * 60]];
  const marks: number[] = []; const P = spline(W, marks); const iK = P.length - 1;
  for (let j = 1; j <= 1500; j++) P.push(knotPt(j / 1500, 0, 0, 1, 0));
  const L = cumLen(P); const s0 = L[marks[1]], sK = L[iK], sE = L[P.length - 1];
  // speed = v1 * f1 + v2 * f2 (ramps), solved so the head enters the knot at TK and finishes it at TE
  const f1: [number, number][] = [[T0S, 0], [3.66, 1], [4.28, 1], [4.62, 0]], f2: [number, number][] = [[4.28, 0], [4.62, 1], [5.06, 1], [TE, 0]];
  const n = Math.round((TE - T0S) / DT) + 1; const A1: number[] = new Array(n).fill(0), A2: number[] = new Array(n).fill(0);
  for (let i = 1; i < n; i++) { const ta = T0S + (i - 1) * DT, tb = ta + DT; A1[i] = A1[i - 1] + (DT * (lin(ta, f1) + lin(tb, f1))) / 2; A2[i] = A2[i - 1] + (DT * (lin(ta, f2) + lin(tb, f2))) / 2; }
  const iK2 = Math.round((TK - T0S) / DT); const a1 = A1[iK2], a2 = A2[iK2], b1 = A1[n - 1], b2 = A2[n - 1], det = a1 * b2 - a2 * b1;
  const v1 = ((sK - s0) * b2 - a2 * (sE - s0)) / det, v2 = (a1 * (sE - s0) - b1 * (sK - s0)) / det;
  return (SNK = { P, L, s0, sK, sE, A1, A2, v1, v2 });
};
const headS = (S: Snake, t: number) => { const x = c01((t - T0S) / (TE - T0S)) * (S.A1.length - 1); const i = Math.min(S.A1.length - 2, Math.floor(x)), u = x - i;
  return S.s0 + S.v1 * mix(S.A1[i], S.A1[i + 1], u) + S.v2 * mix(S.A2[i], S.A2[i + 1], u); };

// the lockup: Source Serif 4 700 at 166 px (cap height ≈ 110), lines 0.98 em, the mark 1.25 em after 'Málaga' (as kit Logo)
export const LOGO = { F: 166, x0: 595.3, y0: 278.55, lh: 162.68 };
const LOCK = { cx: 1220.95, cy: 701.6, w: 207.5 };
// H.mark is frame (screen) space (S4 un-does its own camera to match it): land there through B1's camera at 8.55
const S0 = cam(H.mark.t);
const HAND = { cx: CX + (H.mark.cx - CX) / S0, cy: CY + (H.mark.cy - CY) / S0, w: H.mark.width / S0 };
const markFrame = (t: number) => {
  // the slide to the hand-off starts once 'Málaga' has gone (S3 lifts the words bottom-up from 8.15), so it never crosses a word
  const g = k(t, 6.55, 0.55, SOFT), st = sp(t, 7.52, 2.0, 0.75), h = k(t, 8.27, H.mark.t - 8.27, INOUT);
  const lw = LOCK.w * (1.06 - 0.06 * st);
  return { cx: mix(mix(960, LOCK.cx, g), HAND.cx, h), cy: mix(mix(560, LOCK.cy, g), HAND.cy, h), wd: mix(mix(520, lw, g), HAND.w, h) };
};

// ------------------------------------------------------------------ the wave at time t (layout px, under the camera)
type Seg = { P: Pt[]; w: number; op?: number };
type Wave = { segs: Seg[]; dot: { p: Pt; r: number; halo: number } | null; gx: [number, number] };
export const wave = (t: number): Wave => {
  const segs: Seg[] = [];
  // the A half after the snap pulls back into card A (3.32–3.64)
  if (t >= TS && t < 3.66) {
    const { P, is, F, A0, gx } = snap(); const a = card(t, 0).att, cA = 1 - k(t, TS, 0.3, OUT);
    const w = strokeW(t) * (1 - k(t, TS + 0.16, 0.16, IN));
    if (w > 0.3) segs.push({ P: [...P.slice(0, is), F].map((p) => [a[0] + (p[0] - A0[0]) * cA, a[1] + (p[1] - A0[1]) * cA] as Pt), w });
    if (t < 3.52) {
      // the dot's half springs back toward the centre (the line between the break and the dot contracts)
      const B0 = snap().B0, cB = 1 - (1 - snap().cEnd) * backOut((t - TS) / 0.2);
      segs.push({ P: [F, ...P.slice(is)].map((p) => [F[0] + (p[0] - F[0]) * cB, F[1] + (p[1] - F[1]) * cB] as Pt), w: strokeW(t) });
      return { segs, dot: { p: [F[0] + (B0[0] - F[0]) * cB, F[1] + (B0[1] - F[1]) * cB], r: 19.8 - 4.8 * k(t, 3.05, 0.5, INOUT), halo: k(t, TS, 0.2) }, gx };
    }
  }
  if (t < 0.8) {
    // 0.00 the mark draws itself from its left cap (soft start, long settle); 0.55 its dot pops in
    const s = 0.94 + 0.06 * k(t, -0.1, 0.9, OUT); const P = about(M480, [960, 560], s); const L = cumLen(P);
    const p = drawE(c01((t + 0.1) / 0.72)); const d = about([D480], [960, 560], s)[0];
    return { segs: [{ P: cut(P, 0, p * L[L.length - 1], L), w: 42 * s }], dot: { p: d, r: 19.8 * s * c01(sp(t, 0.55, 2.2, 0.75)), halo: 0 }, gx: span(P) };
  }
  if (t < TS) {
    // 0.80 the ends pull apart into one long gentle wave: cap to card A's edge, dot to card B's edge
    const m = k(t, 0.8, 0.4, INOUT), S = stretchPts(t), b = card(t, 1).att; const P = m < 1 ? M480.map((q, i) => [mix(q[0], S[i][0], m), mix(q[1], S[i][1], m)] as Pt) : S;
    return { segs: [{ P, w: strokeW(t) }], dot: { p: [mix(D480[0], b[0], m), mix(D480[1], b[1], m)], r: 19.8 - 4.8 * k(t, 3.05, 0.5, INOUT), halo: 0 }, gx: span(P) };
  }
  const gx = snap().gx;
  if (t < TE) {
    // 3.52 the dot searches; its trail follows like a snake and is reeled into the knot
    const S = snake(), sH = headS(S, t), Lk = S.sE - S.sK; const Lmax = 700 + (Lk - 700) * c01((sH - S.sK) / Lk);
    segs.push({ P: cut(S.P, Math.max(0, sH - Lmax), sH, S.L), w: 24 });
    return { segs, dot: { p: pointAt(S.P, S.L, sH)[0], r: 15, halo: 1 }, gx };
  }
  if (t < 6.36) {
    // 5.30 the knot pulls tight, 5.70 slackens, 5.80 unwinds into the straight line (long S)
    const tight = k(t, 5.3, 0.12, OUT), slack = k(t, 5.7, 0.35, INOUT), lam = k(t, 5.8, 0.56, INOUT);
    const sc = 1 - 0.18 * tight + 0.08 * slack + 0.1 * lam, ch = 0.7 * Math.max(0, t - TE);
    const P = FLAT.map((f, i) => knotPt(i / (N - 1), f[0], lam, sc, ch));
    const g = k(t, 6.0, 0.5, INOUT);
    return { segs: [{ P, w: strokeW(t) }], dot: { p: P[N - 1], r: 15 - 9 * k(t, 6.2, 0.16, INOUT), halo: 1 - k(t, 5.8, 0.4) }, gx: g > 0 ? [mix(gx[0], FLAT[0][0], g), mix(gx[1], FLAT[N - 1][0], g)] : gx };
  }
  // 6.36 the line springs into the logo's wave; 6.55 it glides into the lockup; 8.22 it goes to the hand-off place
  const a = sp(t, 6.36, 1.8, 0.75), f = markFrame(t);
  const P = markPoints(N, f.cx, f.cy, f.wd).map((q) => [q[0], f.cy + a * (q[1] - f.cy)] as Pt);
  const md = markDot(f.cx, f.cy, f.wd), mdA: Pt = [md[0], f.cy + a * (md[1] - f.cy)], hop = k(t, 6.36, 0.16, INOUT), end = P[N - 1];
  const g = k(t, 6.0, 0.5, INOUT), sp0 = span(P);
  return { segs: [{ P, w: t < 6.55 ? strokeW(t) : (f.wd * 14) / 160 }],
    dot: { p: [mix(end[0], mdA[0], hop), mix(end[1], mdA[1], hop) + 3 * bump(t, 8.02, 0.18)], r: ((6.6 * f.wd) / 160) * (0.28 + 0.72 * c01(sp(t, 6.42, 2.4, 0.6) + 0)) * (1 + 0.5 * bump(t, 8.02, 0.18)), halo: 0 },
    gx: g < 1 ? [mix(gx[0], sp0[0], g), mix(gx[1], sp0[1], g)] : sp0 };
};

// ------------------------------------------------------------------ the topography each scene adds (screen px)
export const ridgeH = (t: number) => 2.2 * k(t, 2.7, 2.65, SINE) * (1 - k(t, 5.8, 1.1, INOUT));
const PING = 2.45, CLICK = 8.02;
export const topoS1 = (t: number): TopoPart => {
  if (t < PING) return {}; const p = scr(card(PING, 1).att, PING);
  return { ripples: [{ x: p[0], y: p[1], age: t - PING, h: 0.32 * (1 - k(t, 3.25, 0.5, INOUT)), w: 60, speed: 720 }] };
};
export const topoS2 = (t: number): TopoPart => { const h = ridgeH(t); return h > 0.001 ? { ridges: [{ x1: 960, y1: 150, x2: 960, y2: 930, h, w: 150 }] } : {}; };
export const topoS3 = (t: number): TopoPart => {
  if (t < CLICK) return {}; const d = wave(CLICK).dot; if (!d) return {}; const p = scr(d.p, CLICK);
  return { ripples: [{ x: p[0], y: p[1], age: t - CLICK, h: 0.55 * (1 - k(t, 8.6, 0.42, INOUT)), w: 80, speed: 950 }] };
};
/** the parts the spine merges while B1's scenes are near (same rule as spine: t0 - 0.5 <= t < t1 + 0.5) */
const topoNear = (t: number): Required<TopoPart> => {
  const ps = [t < 3.9 ? topoS1(t) : {}, t >= 2.4 && t < 7.1 ? topoS2(t) : {}, t >= 5.3 && t < 9.05 ? topoS3(t) : {}];
  return { bumps: ps.flatMap((p) => p.bumps ?? []), ripples: ps.flatMap((p) => p.ripples ?? []), ridges: ps.flatMap((p) => p.ridges ?? []) };
};
/** the ridge's contour lines tinted cyan (up to 14 %) in a band about 360 px wide: the same lines the spine draws, re-coloured */
const RidgeTint: React.FC<{ t: number }> = ({ t }) => {
  const q = (ridgeH(t) / 2.2) * (1 - k(t, 5.8, 0.6, INOUT)); if (q < 0.01) return null;
  return (
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", left: 0, top: 0 }}>
      <defs>
        <linearGradient id="b1-tint-g" gradientUnits="userSpaceOnUse" x1={770} y1={0} x2={1150} y2={0}>
          <stop offset="0" stopColor="#000" /><stop offset="0.29" stopColor="#fff" /><stop offset="0.71" stopColor="#fff" /><stop offset="1" stopColor="#000" /></linearGradient>
        <mask id="b1-tint-m"><rect x={0} y={0} width={1920} height={1080} fill="url(#b1-tint-g)" /></mask>
      </defs>
      <path d={topoPath({ t, ...topoNear(t) })} stroke={`rgba(73,216,237,${(0.14 * q).toFixed(3)})`} strokeWidth={2} fill="none" strokeLinecap="round" mask="url(#b1-tint-m)" />
    </svg>
  );
};

// ------------------------------------------------------------------ the stage: cards, line, dot, glint, rings
export const Stage: React.FC<{ t: number; id: string }> = ({ t, id }) => {
  const W = wave(t), a = card(t, 0), b = card(t, 1);
  const rings: { p: Pt; r: number; w: number; o: number }[] = [];
  if (t >= PING && t < PING + 0.8) { const u = k(t, PING, 0.8, OUT); rings.push({ p: b.att, r: mix(22, 190, u), w: 3, o: 0.75 * (1 - u) }); }
  if (t >= TS && t < TS + 0.3) { const u = k(t, TS, 0.3, OUT); rings.push({ p: snap().F, r: mix(10, 70, u), w: 3, o: 0.8 * (1 - u) }); }
  if (t >= CLICK && t < CLICK + 0.5 && W.dot) { const u = k(t, CLICK, 0.5, OUT); rings.push({ p: wave(CLICK).dot!.p, r: mix(10, 210, u), w: 3, o: 0.8 * (1 - u) ** 1.4 }); }
  // the glint runs along the line from A to B (2.14–2.49)
  const gu = c01((t - 2.14) / 0.35); const glint = t >= 2.14 && t < 2.49 && W.segs[0] ? (() => { const P = W.segs[0].P, L = cumLen(P), T = L[L.length - 1]; return cut(P, Math.max(0, gu - 0.14) * T, gu * T, L); })() : null;
  // 4.10 a thin cyan outline pulses once around the dimmed card B (the person it looks for)
  const ou = c01((t - 4.06) / 0.62);
  return (
    <>
      <RidgeTint t={t} />
      <Cam t={t}>
        <CardView c={a} src="street.jpg" pos="45% 50%" side={0} />
        <CardView c={b} src="team-diego.jpg" pos="50% 38%" side={1} />
        {ou > 0 && ou < 1 && <div style={{ position: "absolute", left: 0, top: 0, width: 400, height: 500, borderRadius: 32, border: `3px solid ${C.cyan}`, boxSizing: "border-box",
          opacity: 0.95 * Math.sin(Math.PI * ou), transform: `translate(${b.cx - 200}px, ${b.cy - 250}px) rotate(${b.rot}deg) scale(${b.s * (1.03 + 0.06 * OUT(ou))})` }} />}
        <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          <defs><linearGradient id={`${id}-g`} gradientUnits="userSpaceOnUse" x1={W.gx[0]} y1={0} x2={Math.max(W.gx[0] + 1, W.gx[1])} y2={0}><stop offset="0" stopColor={C.cyan} /><stop offset="1" stopColor={C.cyanL} /></linearGradient></defs>
          {W.segs.map((s, i) => <polyline key={i} points={s.P.map((p) => `${p[0].toFixed(2)},${p[1].toFixed(2)}`).join(" ")} stroke={`url(#${id}-g)`} strokeWidth={s.w} strokeLinecap="round" strokeLinejoin="round" fill="none" opacity={s.op ?? 1} />)}
          {glint && <polyline points={glint.map((p) => `${p[0].toFixed(2)},${p[1].toFixed(2)}`).join(" ")} stroke="#FFFFFF" strokeWidth={W.segs[0].w * 0.5} strokeLinecap="round" strokeLinejoin="round" fill="none" opacity={0.8 * Math.sin(Math.PI * gu)} />}
          {W.dot && W.dot.halo > 0.01 && <circle cx={W.dot.p[0]} cy={W.dot.p[1]} r={W.dot.r * 2.3} fill={C.cyan} opacity={0.2 * W.dot.halo} />}
          {W.dot && W.dot.r > 0.05 && <circle cx={W.dot.p[0]} cy={W.dot.p[1]} r={W.dot.r} fill={C.cyanL} />}
          {rings.map((g, i) => <circle key={i} cx={g.p[0]} cy={g.p[1]} r={g.r} stroke={C.cyan} strokeWidth={g.w} fill="none" opacity={g.o} />)}
        </svg>
      </Cam>
    </>
  );
};

// ------------------------------------------------------------------ top-slot type: words rise on their VO words (kit Rise style), per-word colour
export const Slot: React.FC<{ t: number; words: { s: string; at: number; c?: string }[]; size: number; top: number; color?: string; outAt: number; outDur: number; outDy: number }> =
  ({ t, words, size, top, color = C.white, outAt, outDur, outDy }) => {
    const v = c01((t - outAt) / outDur); if (t < words[0].at - 0.02 || v >= 1) return null;
    return (
      <div style={{ position: "absolute", left: 0, top, width: 1920, display: "flex", justifyContent: "center", fontFamily: SANS, fontWeight: 700, fontSize: size, lineHeight: 1.06, letterSpacing: "-0.025em", whiteSpace: "nowrap" }}>
        {words.map((wd, j) => {
          // the word rises (soft ease, no overshoot) and lands while still softly blurred; the blur clears after it has stopped,
          // so no crisp glyph creeps by sub-pixels (slow text snaps to whole pixels in Chrome). The exit blurs at once and
          // then accelerates away (lift v², fade), for the same reason.
          const u = c01((t - wd.at) / 0.42), q = OUT(u), bl = 9 * (1 - c01((t - wd.at) / 0.62)) ** 2 + 9 * Math.sqrt(v);
          return <span key={j} style={{ display: "inline-block", marginLeft: j ? "0.24em" : 0, color: wd.c ?? color, opacity: c01(u * 3) * (1 - v) ** 1.2,
            transform: `translateY(${(1 - q) * 0.34 * size + v * v * outDy}px)`, filter: bl > 0.04 ? `blur(${bl.toFixed(2)}px)` : undefined }}>{wd.s}</span>; })}
      </div>
    );
  };
