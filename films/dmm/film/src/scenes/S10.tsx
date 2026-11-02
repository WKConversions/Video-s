// S10 (23.15–28.0) "Whether you're building your career, growing your business, or simply looking for inspiration":
// back on the charcoal map, the wave alone acts out the three ambitions with the site's own shapes: it climbs a
// staircase of their cyan pills (career), grows its humps taller one after another like the logo's own second hump
// (business), lets go of the line and flares as the contours ring out around its dot (inspiration).
import React from "react";
import { C, GLOW, INOUT, IN, OUT, Photo, Pt, SANS, SHADOW, WavePoly, c01, k, mix, sp, w } from "../kit";
import { Scene } from "./types";

const T0 = 23.15, T1 = 28.0;
const START: Pt = [470, 860];
const PILLS = [{ x: 600, y: 820, at: w("whether") + 0.02 }, { x: 960, y: 650, at: w("building") + 0.02 }, { x: 1320, y: 480, at: w("career") - 0.1 }];
const PW = 380, PH = 104;

/** the dot's hop path: start -> top of each pill, one arc per hop */
const hopPts = (t: number): { pts: Pt[]; dot: Pt } => {
  const pts: Pt[] = []; let cur: Pt = START; pts.push(cur);
  for (const p of PILLS) {
    const target: Pt = [p.x + PW * 0.2, p.y - PH / 2 - 16]; const u = k(t, p.at + 0.06, 0.32, INOUT);
    if (u <= 0) break;
    for (let i = 1; i <= 16; i++) { const s = (i / 16) * u; const x = mix(cur[0], target[0], s), y = mix(cur[1], target[1], s) - Math.sin(Math.PI * s) * 70; pts.push([x, y]); }
    if (u < 1) return { pts, dot: pts[pts.length - 1] };
    cur = target;
  }
  return { pts, dot: pts[pts.length - 1] };
};

/** the growth curve: from (360, 760) rising to (1560, 380) with humps that grow taller from left to right */
const N = 140;
const growPts = (g: number, t: number): Pt[] => {
  const out: Pt[] = [];
  for (let i = 0; i < N; i++) {
    const u = i / (N - 1); const x = mix(360, 1560, u); const base = mix(760, 400, u ** 1.2);
    const hump = c01((g * 1.6 - u * 0.9) / 0.7);            // humps grow in from the left
    const amp = (30 + 95 * u) * hump * (0.92 + 0.08 * Math.sin(t * 3 + u * 6));
    out.push([x, base - amp * Math.max(0, Math.sin(u * Math.PI * 4.5 - 0.6)) + amp * 0.25 * Math.max(0, -Math.sin(u * Math.PI * 4.5 - 0.6))]);
  }
  return out;
};
/** the stair trail resampled to N points, so it can morph into the growth curve */
const resample = (src: Pt[]): Pt[] => {
  if (src.length < 2) return Array.from({ length: N }, () => src[0] ?? START);
  const L: number[] = [0]; for (let i = 1; i < src.length; i++) L.push(L[i - 1] + Math.hypot(src[i][0] - src[i - 1][0], src[i][1] - src[i - 1][1]));
  const tot = L[L.length - 1] || 1; const out: Pt[] = []; let j = 0;
  for (let i = 0; i < N; i++) { const d = (i / (N - 1)) * tot; while (j < L.length - 2 && L[j + 1] < d) j++; const s = (d - L[j]) / ((L[j + 1] - L[j]) || 1); out.push([mix(src[j][0], src[j + 1][0], s), mix(src[j][1], src[j + 1][1], s)]); }
  return out;
};

const Slot: React.FC<{ t: number }> = ({ t }) => {
  // one slot, two lines: the verb in grey (56 px), the ambition big (120 px); each rolls through on its words
  const lines: [number, number, string, string, boolean][] = [
    [w("building") - 0.05, w("growing") - 0.12, "building your", "career", false],
    [w("growing") - 0.05, w("or") - 0.05, "growing your", "business", false],
    [w("simply") - 0.05, T1, "looking for", "inspiration", true],
  ];
  const bigAt = [w("building") + 0.1, w("growing") + 0.06, w("inspiration") - 0.1];
  return <>{lines.map(([a, b, small, big, cyan], i) => {
    if (t < a - 0.02 || t > b + 0.4) return null;
    const pin = c01(sp(t, a, 1.8, 0.72)), pinB = c01(sp(t, bigAt[i], 1.8, 0.72)); const o = i < 2 ? k(t, b - 0.05, 0.3, IN) : k(t, 27.5, 0.28, IN);
    const roll = (q: number) => ({ opacity: c01(q * 1.6) * (1 - o), transform: `translateY(${(1 - q) * 46 - o * 46}px)`, filter: q < 0.97 || o > 0.02 ? `blur(${(1 - q) * 10 + o * 10}px)` : undefined });
    return <div key={i} style={{ position: "absolute", left: 0, right: 0, top: 110, textAlign: "center", fontFamily: SANS }}>
      <div style={{ fontWeight: 500, fontSize: 56, color: C.grey, letterSpacing: "-0.01em", ...roll(pin) }}>{small}</div>
      <div style={{ fontWeight: 700, fontSize: 120, lineHeight: 1.05, letterSpacing: "-0.03em", color: cyan ? C.cyan : C.white, ...roll(pinB) }}>{big}</div>
    </div>; })}</>;
};

const LOOK = [{ src: "talk.jpg", x: 540, y: 600, w: 360, h: 250, pos: "50% 45%" }, { src: "outdoor.jpg", x: 1380, y: 600, w: 360, h: 250, pos: "50% 60%" }, { src: "group.jpg", x: 960, y: 860, w: 300, h: 190, pos: "50% 45%" }];
const Ambitions: React.FC<{ t: number }> = ({ t }) => {
  const dotIn = c01(sp(t, T0 + 0.1, 2.2, 0.6));
  const hop = hopPts(t);
  const smooth = k(t, w("growing") - 0.3, 0.55, INOUT);            // the stair smooths into the growth curve
  const grow = k(t, w("growing") - 0.1, 0.9, OUT);
  const letGo = k(t, w("or") - 0.05, 0.6, INOUT);                     // the dot leaves the line; the line fades into the map
  const stairs = resample(hop.pts);
  const curve = lerpPts2(stairs, growPts(grow, t), smooth);
  const lineEnd = curve[curve.length - 1];
  // the dot: on the stair / curve end, then floating to the centre, drifting, flaring on "inspiration"
  const floatP = k(t, w("or") - 0.05, 0.9, INOUT);
  // looking: the dot visits three moments from their events (left, right), then comes back to the centre and flares
  const v1 = k(t, w("looking") - 0.2, 0.32, INOUT), v2 = k(t, w("looking") + 0.14, 0.32, INOUT), v3 = k(t, w("for") + 0.02, 0.26, INOUT);
  const look: [number, number] = [mix(mix(mix(0, LOOK[0].x + 150 - 960, v1), LOOK[1].x - 150 - 960, v2), 0, v3), mix(mix(mix(0, LOOK[0].y - 520, v1), LOOK[1].y - 520, v2), 0, v3)];
  const dx = mix(lineEnd[0], 960, floatP) + look[0], dy = mix(lineEnd[1], 520, floatP) + look[1];
  const flare = c01(sp(t, w("inspiration") - 0.05, 1.6, 0.55)); const settle = k(t, 27.6, 0.5, OUT);
  const dotScale = (0.9 + 0.5 * dotIn) * (1 + 1.8 * flare - 0.8 * flare * settle);
  // a glint along the curve once it has grown
  const glintU = c01((t - (w("business") + 0.1)) / 0.5);
  return (
    <>
      {/* the staircase of their pills */}
      {PILLS.map((p, i) => { const q = c01(sp(t, p.at, 2.1, 0.7)); const out = k(t, w("growing") - 0.35, 0.4, IN);
        if (q <= 0 || out >= 1) return null;
        return <div key={i} style={{ position: "absolute", left: 0, top: 0, width: PW, height: PH, borderRadius: PH / 2, background: C.cyan, boxShadow: GLOW,
          transform: `translate(${p.x - PW / 2}px, ${p.y - PH / 2 + (1 - q) * 60 + out * 420}px) scale(${0.7 + 0.3 * q})`, opacity: c01(q * 2) * (1 - out) }} />; })}
      <WavePoly pts={curve} width={26} p={1} opacity={1 - letGo * 0.88} />
      {glintU > 0 && glintU < 1 && <WavePoly pts={curve} width={26} from={Math.max(0, glintU - 0.08)} p={glintU} color="rgba(255,255,255,0.75)" opacity={(1 - letGo) * Math.sin(Math.PI * glintU)} />}
      {/* three moments from their events float up while the dot looks around: talk, terrace, room */}
      {LOOK.map((c, i) => { const q = c01(sp(t, w("simply") - 0.1 + i * 0.12, 1.6, 0.72)); const lit = i === 0 ? v1 * (1 - v2) : i === 1 ? v2 * (1 - v3) : 0;
        const push = k(t, w("inspiration") - 0.05, 0.7, IN); if (q <= 0 || push >= 1) return null;
        const ox = (c.x - 960) * push * 0.6, oy = (c.y - 520) * push * 0.6;
        return <div key={c.src} style={{ position: "absolute", left: 0, top: 0, transform: `translate(${c.x - c.w / 2 + ox}px, ${c.y - c.h / 2 + oy + (1 - q) * 70}px) scale(${(0.86 + 0.14 * q) * (1 + 0.05 * lit)})`, opacity: c01(q * 2) * (1 - push) * (0.72 + 0.28 * lit) }}>
          <Photo src={c.src} w={c.w} h={c.h} r={22} pos={c.pos} shadow={SHADOW} /></div>; })}
      {/* the dot */}
      {/* rings of light out of the dot as it flares: the contour field answering it */}
      {[0, 1, 2].map((i) => { const u = c01((t - (w("inspiration") - 0.05) - i * 0.28) / 1.5); if (u <= 0 || u >= 1) return null;
        return <div key={i} style={{ position: "absolute", left: 0, top: 0, width: 100, height: 100, borderRadius: 50, border: `3px solid rgba(158,230,253,${0.75 * (1 - u)})`,
          transform: `translate(${dx - 50}px, ${dy - 50}px) scale(${0.5 + u * 13})` }} />; })}
      {t < T0 + 0.9 && <div style={{ position: "absolute", left: 0, top: 0, width: 100, height: 100, borderRadius: 50, border: `3px solid rgba(158,230,253,${0.7 * (1 - k(t, T0 + 0.1, 0.8))})`,
        transform: `translate(${START[0] - 50}px, ${START[1] - 50}px) scale(${0.4 + 3.5 * k(t, T0 + 0.1, 0.8)})` }} />}
      <div style={{ position: "absolute", left: 0, top: 0, width: 40, height: 40, borderRadius: 20, background: C.cyanL, opacity: c01(dotIn * 2) * (1 - k(t, 27.9, 0.1)),
        boxShadow: flare > 0.01 ? `0 0 ${30 + 60 * flare}px rgba(158,230,253,${0.4 + 0.4 * flare}), 0 0 ${110 * flare}px rgba(73,216,237,${0.35 * flare})` : GLOW,
        transform: `translate(${(t < w("or") - 0.05 ? hop.dot[0] * (1 - smooth) + lineEnd[0] * smooth : dx) - 20}px, ${(t < w("or") - 0.05 ? hop.dot[1] * (1 - smooth) + lineEnd[1] * smooth : dy) - 20}px) scale(${dotScale})` }} />
      <Slot t={t} />
    </>
  );
};
const lerpPts2 = (A: Pt[], B: Pt[], p: number): Pt[] => A.map((a, i) => [a[0] + (B[i][0] - a[0]) * p, a[1] + (B[i][1] - a[1]) * p]);

export const S10: Scene = {
  id: "S10", t0: T0, t1: T1, C: Ambitions,
  topo: (t) => {
    const floatP = k(t, w("or") - 0.05, 0.9, INOUT);
    return {
      bumps: [
        // the contours lean toward the drifting dot, then ring around it as it flares
        ...(t > w("or") ? [{ x: 960, y: 520, h: 0.35 * floatP + 0.9 * c01(sp(t, w("inspiration") - 0.05, 1.2, 0.8)), r: 260 }] : []),
        // the growth curve's summit, rising with it
        ...(t > w("growing") - 0.3 && t < w("looking") + 0.4 ? [{ x: 1500, y: 420, h: 0.7 * k(t, w("growing") - 0.1, 0.9) * (1 - k(t, w("or"), 0.8)), r: 300 }] : []),
      ],
      ripples: [
        { x: 960, y: 520, age: t - (w("inspiration") - 0.02), h: 0.55, w: 70, speed: 820 },
        { x: 960, y: 520, age: t - (w("inspiration") + 0.4), h: 0.45, w: 70, speed: 820 },
      ],
    };
  },
};
