// B2 (S4 + S5, 8.30–13.25): one continuous model that both scenes read, so the hand-over between them is seamless.
// The logo's wave (from S3, H.mark) stretches into the community line across the frame; the hero's four cards ride on
// it; it shortens to the centre where the cards stack; it pulls back into its dot, and the dot lands as the pin (H.pin).
import { Easing } from "remotion";
import { INOUT, OUT, Pt, SINE, c01, k, markDot, markPoints, mix, sp } from "../kit";
import { H } from "../handoff";

export const NP = 201;                    // 5 segments x 40 intervals: knots line up with markPoints' segments
export const T_SPLIT = 10.45;             // S4 draws the wave, cards and dot before this; S5 from it
export const T_SLIDE = 10.55, T_GROW = 11.1, T_OFF = 11.12, T_LIFT = 11.42, T_LAND = 11.84;

// ------------------------------------------------------------------ camera (S4 only): pull 1.05 -> 1.00 about the centre
export const camAt = (t: number) => mix(1.05, 1, k(t, 8.3, 1.8, INOUT));
const S0 = camAt(H.mark.t);
const toWorld = (p: Pt, s: number): Pt => [960 + (p[0] - 960) / s, 540 + (p[1] - 540) / s];

// ------------------------------------------------------------------ the mark as handed over (world space under S0)
const MARK_W = markPoints(NP, H.mark.cx, H.mark.cy, H.mark.width).map((p) => toWorld(p, S0));
const MDOT_W = toWorld(markDot(H.mark.cx, H.mark.cy, H.mark.width), S0);
const MC = toWorld([H.mark.cx, H.mark.cy], S0);
const MSTROKE = (14 * H.mark.width) / 160 / S0, MDOTR = (6.6 * H.mark.width) / 160 / S0;

// ------------------------------------------------------------------ the community line: valleys (y 700) at x 330 and
// 1170, peaks (y 470) at 760 and 1580, then the logo's steep descent, its hook and the dot
const ys = (x: number) => {
  const ph = x <= 760 ? -0.5 + (x - 330) / 430 : x <= 1170 ? 0.5 + (x - 760) / 410 : 1.5 + (x - 1170) / 410;
  return 585 - 115 * Math.sin(ph * Math.PI);
};
const bez = (a: Pt, b: Pt, c: Pt, d: Pt) => (u: number): Pt => {
  const m = (i: 0 | 1) => (1 - u) ** 3 * a[i] + 3 * (1 - u) ** 2 * u * b[i] + 3 * (1 - u) * u * u * c[i] + u ** 3 * d[i];
  return [m(0), m(1)];
};
/** n + 1 points evenly spaced along the arc of f(0..1) */
const sampleSeg = (f: (u: number) => Pt, n: number): Pt[] => {
  const M = 400, P: Pt[] = [], L = [0];
  for (let i = 0; i <= M; i++) { P.push(f(i / M)); if (i) L.push(L[i - 1] + Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1])); }
  const out: Pt[] = []; let j = 0;
  for (let i = 0; i <= n; i++) {
    const d = (i / n) * L[M]; while (j < M - 1 && L[j + 1] < d) j++;
    const s = (d - L[j]) / (L[j + 1] - L[j] || 1); out.push([mix(P[j][0], P[j + 1][0], s), mix(P[j][1], P[j + 1][1], s)]);
  }
  return out;
};
const SEGS: ((u: number) => Pt)[] = [
  (u) => { const x = mix(150, 760, u); return [x, ys(x)]; },          // start -> valley 1 -> peak 1 (the mark's first rise)
  (u) => { const x = mix(760, 1170, u); return [x, ys(x)]; },         // peak 1 -> valley 2
  (u) => { const x = mix(1170, 1580, u); return [x, ys(x)]; },        // valley 2 -> peak 2 (the tall hump)
  (u) => [mix(1580, 1735, u), 470 + (155 * (1 - Math.cos(Math.PI * u))) / 2],   // the steep descent
  bez([1735, 625], [1750, 625], [1766, 617], [1772, 604]),             // the hook
];
export const LINE: Pt[] = SEGS.flatMap((f, i) => sampleSeg(f, 40).slice(i ? 1 : 0));
const LINE_DOT: Pt = [1794, 578];
const DOT_OFF: Pt = [LINE_DOT[0] - LINE[NP - 1][0], LINE_DOT[1] - LINE[NP - 1][1]];
/** cumulative arc length along LINE (for the light pulse) */
export const LCUM: number[] = LINE.reduce<number[]>((a, p, i) => (a.push(i ? a[i - 1] + Math.hypot(p[0] - LINE[i - 1][0], p[1] - LINE[i - 1][1]) : 0), a), []);
export const LTOT = LCUM[NP - 1];

// ------------------------------------------------------------------ the hero's four cards (their hero, rebuilt)
export type CardDef = { src: string; w: number; h: number; x: number; y: number; pos: string; idx: number; stack: { x: number; y: number; rot: number; sc: number } };
const near = (x: number) => LINE.reduce((b, p, i) => (Math.abs(p[0] - x) < Math.abs(LINE[b][0] - x) ? i : b), 0);
export const CARDS: CardDef[] = [
  { src: "group.jpg", w: 380, h: 285, x: 330, y: 690, pos: "50% 50%", idx: near(330), stack: { x: 742, y: 652, rot: -8, sc: 1.14 } },
  { src: "street.jpg", w: 290, h: 390, x: 760, y: 470, pos: "50% 45%", idx: near(760), stack: { x: 826, y: 592, rot: -3, sc: 1.1 } },
  { src: "talk.jpg", w: 380, h: 285, x: 1170, y: 690, pos: "50% 50%", idx: near(1170), stack: { x: 1180, y: 642, rot: 5, sc: 1.14 } },
  { src: "cathedral.jpg", w: 320, h: 300, x: 1580, y: 470, pos: "50% 40%", idx: near(1580), stack: { x: 960, y: 600, rot: 0, sc: 1 } },
];
const IDX_C = near(960);
const RETRACT = Easing.bezier(0.5, 0, 0.85, 0.55);
export const CATH = { w: 500, h: 470 };

// ------------------------------------------------------------------ helpers
const ptAt = (pts: Pt[], f: number): Pt => { const i = Math.max(0, Math.min(NP - 2, Math.floor(f))), u = c01(f - i); return [mix(pts[i][0], pts[i + 1][0], u), mix(pts[i][1], pts[i + 1][1], u)]; };
/** the shortening (S5): the line contracts toward the centre and flattens */
export const shrinkAt = (t: number) => k(t, T_SLIDE - 0.04, 0.8, INOUT);
const contract = (p: Pt, c: number): Pt => [960 + (p[0] - 960) * mix(1, 0.55, c), mix(585, 600, c) + (p[1] - 585) * mix(1, 0.3, c)];
/** slide progress of card i along the shortening line (0.65 s, long S, 0.05 s apart) */
const slideAt = (i: number, t: number) => k(t, T_SLIDE + 0.05 * i, 0.65, INOUT);
/** the light pulse: arc position 0..1 along the line (10.00 -> 10.60) */
export const pulseAt = (t: number) => (t - 10.0) / 0.6;
const passT = (idx: number) => 10.0 + 0.6 * (LCUM[idx] / LTOT);

// ------------------------------------------------------------------ the wave at time t
export type WaveState = { pts: Pt[]; width: number; from: number; dot: Pt; dotR: number; glow: number; show: boolean };
export const waveAt = (t: number): WaveState => {
  if (t < 8.7) {   // anticipation: the mark gathers a little before the stretch
    const a = k(t, H.mark.t, 0.15, OUT);
    const sq = (p: Pt): Pt => [MC[0] + (p[0] - MC[0]) * (1 - 0.03 * a), MC[1] + (p[1] - MC[1]) * (1 + 0.025 * a)];
    return { pts: MARK_W.map(sq), width: MSTROKE, from: 0, dot: sq(MDOT_W), dotR: MDOTR, glow: 0, show: true };
  }
  if (t < T_SLIDE - 0.04) {   // the stretch across the frame (8.70, 0.6 s, long S)
    const e = k(t, 8.7, 0.6, INOUT);
    const sq = (p: Pt): Pt => [MC[0] + (p[0] - MC[0]) * 0.97, MC[1] + (p[1] - MC[1]) * 1.025];
    const pts = MARK_W.map((p, i) => { const a = sq(p); return [mix(a[0], LINE[i][0], e), mix(a[1], LINE[i][1], e)] as Pt; });
    const md = sq(MDOT_W);
    // the dot lights up as the pulse reaches it
    const lit = Math.max(0, sp(t, 10.56, 2.2, 0.55) - sp(t, 10.72, 1.6, 0.7));
    return { pts, width: mix(MSTROKE, 26, e), from: 0, dot: [mix(md[0], LINE_DOT[0], e), mix(md[1], LINE_DOT[1], e)], dotR: mix(MDOTR, 13, e) * (1 + 0.3 * lit), glow: lit, show: true };
  }
  // the shortening, then the draw-off into the dot, then the dot's arc onto the cathedral card
  const c = shrinkAt(t);
  const pts = LINE.map((p) => contract(p, c));
  const end = pts[NP - 1];
  const dot0: Pt = [end[0] + DOT_OFF[0] * mix(1, 0.85, c), end[1] + DOT_OFF[1] * mix(1, 0.85, c)];
  const from = k(t, T_OFF, T_LIFT - T_OFF, RETRACT);   // a tape pulled in: slow, then snapping into the dot
  const lit = Math.max(0, sp(t, 10.56, 2.2, 0.55) - sp(t, 10.72, 1.6, 0.7));
  if (t < T_LIFT) return { pts, width: mix(26, 28, c), from, dot: dot0, dotR: 13 * (1 + 0.3 * lit), glow: lit, show: from < 0.999 };
  // the arc: lifts above the stack, then comes down onto the top edge of the cathedral card (lands at T_LAND)
  const pin = pinAt(t);
  const u = Easing.bezier(0.42, 0, 0.82, 0.78)(c01((t - T_LIFT) / (T_LAND - T_LIFT)));
  const A = dot0, B: Pt = [1440, 330], Cc: Pt = [985, 200];
  const m = (i: 0 | 1) => (1 - u) ** 3 * A[i] + 3 * (1 - u) ** 2 * u * B[i] + 3 * (1 - u) * u * u * Cc[i] + u ** 3 * pin[i];
  const arcDot: Pt = t < T_LAND ? [m(0), m(1)] : pin;
  // in flight the dot is a touch bigger and glows (easy to follow), and lands at the pin's size
  const fl = k(t, T_LIFT, 0.14) * (1 - k(t, T_LAND - 0.1, 0.1, INOUT));
  return { pts, width: 28, from: 1, dot: arcDot, dotR: mix(mix(13, H.pin.r, k(t, T_LIFT, 0.3)), 16, fl), glow: 0.55 * fl, show: false };
};

/** the pin: the top-centre of the cathedral card (it settles there), exact H.pin by 12.45 */
export const pinAt = (t: number): Pt => {
  const c = cardAt(3, t); const live: Pt = [c.x, c.y - c.h / 2];
  const lock = k(t, 12.18, 0.25, INOUT);
  return [mix(live[0], H.pin.x, lock), mix(live[1], H.pin.y, lock)];
};
/** the landing settle of the pin dot (one small dip) */
export const pinSettle = (t: number) => {
  const u = t - T_LAND; if (u < 0) return { dy: 0, sx: 1, sy: 1 };
  const d = Math.exp(-u * 9) * Math.sin(u * 22);
  return { dy: 6 * d, sx: 1 + 0.16 * d, sy: 1 - 0.16 * d };
};

// ------------------------------------------------------------------ the cards at time t (world space)
export type CardState = { x: number; y: number; w: number; h: number; rot: number; sc: number; lift: number; on: boolean; sheen: number };
export const cardAt = (i: number, t: number): CardState => {
  const c = CARDS[i];
  // rise from below onto the wave (9.00, 0.09 s apart, a heavy spring)
  const at = 9.0 + 0.09 * i, q = sp(t, at, 1.5, 0.8);
  const y0 = 1110 + c.h / 2;
  let x = c.x, y = c.y + (1 - q) * (y0 - c.y), rot = (1 - q) * (i % 2 ? 6 : -6), sc = 0.94 + 0.06 * q;
  let wd = c.w, ht = c.h;
  // the light pulse lifts it (follow-through: 3 frames after the pulse passes)
  const pt = passT(c.idx);   // the pulse is under the card's centre: it peaks ~3-5 frames later (follow-through)
  const lift = 14 * (sp(t, pt - 0.06, 4.0, 0.6) - sp(t, pt + 0.1, 2.6, 0.72));
  const sheen = c01((t - (pt - 0.16)) / 0.4);
  // S5: slide along the shortening line to the centre, then into the fanned stack
  const s = slideAt(i, t);
  if (t >= T_SLIDE) {
    const cc = shrinkAt(t);
    const f = mix(c.idx, IDX_C, s);
    const ride = contract(ptAt(LINE, f), cc);
    const off: Pt = [(c.x - LINE[c.idx][0]) * (1 - s), (c.y - LINE[c.idx][1]) * (1 - s)];
    // a gentle tilt with the slope it rides
    const a = contract(ptAt(LINE, Math.max(0, f - 2)), cc), b2 = contract(ptAt(LINE, Math.min(NP - 1, f + 2)), cc);
    const tilt = (Math.atan2(b2[1] - a[1], b2[0] - a[0]) * 180) / Math.PI * 0.22;
    const bl = k(s, 0.5, 0.5, SINE);
    x = mix(ride[0] + off[0], c.stack.x, bl); y = mix(ride[1] + off[1], c.stack.y, bl);
    // the fan keeps opening a touch while it settles (gently, to the end of the window)
    const open = 1 + 0.18 * k(t, 11.5, 1.6, SINE);
    rot = mix(tilt * (1 - s), c.stack.rot * open, bl);
    sc = mix(1, c.stack.sc, bl);
    if (i === 3) {
      const g = sp(t, T_GROW, 1.35, 0.8);
      wd = mix(c.w, CATH.w, g); ht = mix(c.h, CATH.h, g); sc = 1;
      // the pin lands: the card gives a little
      const u = t - T_LAND; if (u > 0) y += 5 * Math.exp(-u * 8) * Math.sin(u * 17);
    }
  }
  return { x, y, w: wd, h: ht, rot, sc, lift, on: t >= at, sheen: t > pt - 0.2 && t < pt + 0.3 ? sheen : -1 };
};

// ------------------------------------------------------------------ the summit (S5) and the rings (S4)
export const summitAt = (t: number) => {
  const p = k(t, 10.45, 1.35, SINE);
  const inward = k(t, 12.0, 1.1, SINE);
  const fall = k(t, 12.6, 0.55, INOUT);
  return { h: 2.0 * p * (1 - fall), r: mix(1150, 560, k(t, 10.45, 1.35, INOUT)) - 50 * inward };
};
export const RING_C = markDot(H.mark.cx, H.mark.cy, H.mark.width);   // frame space: the dot at the hand-over
export const RING_T = [8.62, 8.8, 8.98], RING_SPEED = 950;
