// Scene S8 (B4): "share insights, explore opportunities," 17.25-20.50 (plan/contract.md).
// From H.trio the three speaker cards gather into a stack that flips to the group sitting in a circle; a cyan speech bubble
// breaks out of its top-right corner (the wave's hook as its tail, the DMM squiggle as its voice); card and bubble ease left;
// the wave runs out of the bubble and forks to the member perks from their members page; the dot steps through them and
// presses 'WhatsApp group' (20.02). On the white field: deeper cyan, thick strokes.
import React from "react";
import { AbsoluteFill } from "remotion";
import { Scene } from "./types";
import { H } from "../handoff";
import { C, SHADOW_L, Photo, Pt, c01, k, mix, sp, IN, INOUT, OUT } from "../kit";
import { FORK, PILL_LABELS, PILL_W, PILL_H, PILL_X, PILL_YS, PillBar, VoiceBubble, WAPillLayer, at, bubbleS8, branchEnd, cardAt, cubic, piece, ptsStr, quad } from "./b4-kit";

const SPK = ["speaker-tatiana.jpg", "speaker-yago.jpg", "speaker-charlie.jpg"];
const STACK = [{ x: -26, y: 10, r: -6 }, { x: 0, y: 0, r: 0 }, { x: 26, y: 10, r: 6 }];
const T_FLIP = 17.5, D_FLIP = 0.32;
const photoZoom = (t: number) => mix(1.1, 1, k(t, 17.66, 1.5, OUT));

/** H.trio -> a stack (spring) -> one flip (content swaps at 90 deg on 'share') into the 1000 x 750 group card */
const Stack: React.FC<{ t: number }> = ({ t }) => {
  const s = sp(t, H.trio.t, 2.1, 0.8);
  const f = INOUT(c01((t - T_FLIP) / D_FLIP)), ang = 180 * f;
  const wd = mix(H.trio.w, 1000, f), ht = mix(H.trio.h, 750, f), cy = mix(H.trio.y, 560, f);
  if (ang >= 90) {
    return <div style={{ position: "absolute", left: 0, top: 0, transform: `translate(${960 - wd / 2}px, ${cy - ht / 2}px) perspective(1800px) rotateY(${ang - 180}deg)` }}>
      <Photo src="group.jpg" w={wd} h={ht} r={28} zoom={photoZoom(t)} shadow={SHADOW_L} />
    </div>;
  }
  return <>{[0, 2, 1].map((i) => {
    const x = mix(H.trio.xs[i], 960 + STACK[i].x, s), y = mix(H.trio.y, H.trio.y + STACK[i].y, s) + (cy - H.trio.y);
    const sc = i === 1 ? 1 + 0.03 * s : 1;
    return <div key={i} style={{ position: "absolute", left: 0, top: 0, transform: `translate(${x - wd / 2}px, ${y - ht / 2}px) perspective(1800px) rotateY(${ang}deg) rotateZ(${STACK[i].r * s}deg) scale(${sc})` }}>
      <Photo src={SPK[i]} w={wd} h={ht} r={H.trio.r} shadow={SHADOW_L} />
    </div>;
  })}</>;
};

const GroupCard: React.FC<{ t: number }> = ({ t }) => {
  const c = cardAt(t);
  return <div style={{ position: "absolute", left: 0, top: 0, transformOrigin: "500px 375px", transform: `translate(${c.x - 500}px, ${c.y - 375}px) scale(${c.s})` }}>
    <Photo src="group.jpg" w={1000} h={750} r={28} zoom={photoZoom(t)} shadow={SHADOW_L} />
  </div>;
};

// ------------------------------------------------------------------ the wave out of the bubble: trunk, fork, three branches
const trunkPts = (t: number): Pt[] => { const b = bubbleS8(t); const P0: Pt = [b.x + 180 * b.s, b.y]; return cubic(P0, [P0[0] + 130, P0[1] + 30], [FORK[0] - 130, FORK[1]], FORK); };
const BRANCH: Pt[][] = [0, 1, 2].map((i) => { const B = branchEnd(i); return cubic(FORK, [FORK[0] + 80, FORK[1]], [B[0] - 80, B[1]], B, 48); });
const T_TRUNK = 18.7, D_TRUNK = 0.24, T_BR = [18.9, 18.98, 19.06], D_BR = 0.15, T_POP = [19.05, 19.13, 19.21], T_LIT = [19.5, 19.75, 20.02];
const DEEP = C.cyanD;

const Line: React.FC<{ pts: Pt[]; w?: number }> = ({ pts, w = 12 }) => pts.length > 1
  ? <polyline points={ptsStr(pts)} stroke={DEEP} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" fill="none" /> : null;

/** where the travelling dot is (its radius 0 = hidden) */
const dotAt = (t: number): { p: Pt; r: number } => {
  const R = 13;
  if (t < T_TRUNK) return { p: FORK, r: 0 };
  if (t < T_TRUNK + D_TRUNK) return { p: at(trunkPts(t), k(t, T_TRUNK, D_TRUNK, OUT)), r: R * c01((t - T_TRUNK) / 0.06) };
  if (t < 19.3) return { p: FORK, r: R * (1 + 0.12 * Math.sin(2 * Math.PI * (t - 18.94) / 0.36)) };
  if (t < T_LIT[0]) return { p: at(BRANCH[0], k(t, 19.3, 0.2, INOUT)), r: R };
  const hop = (a: Pt, b: Pt, t0: number, d: number): Pt => quad(a, [a[0] - 70, (a[1] + b[1]) / 2], b, k(t, t0, d, INOUT));
  if (t < 19.62) return { p: branchEnd(0), r: R };
  if (t < T_LIT[1]) return { p: hop(branchEnd(0), branchEnd(1), 19.62, 0.13), r: R };
  if (t < 19.88) return { p: branchEnd(1), r: R };
  if (t < T_LIT[2]) return { p: hop(branchEnd(1), branchEnd(2), 19.88, 0.14), r: R };
  const e = k(t, T_LIT[2], 0.12, IN); const B = branchEnd(2);   // presses into the pill and is absorbed
  return { p: [B[0] + 40 * e, B[1]], r: R * (1 - e) };
};

const C8: React.FC<{ t: number }> = ({ t }) => {
  const bub = bubbleS8(t), pop = sp(t, 17.85, 2.2, 0.66);
  const trunk = trunkPts(t), dt = k(t, T_TRUNK, D_TRUNK, OUT), offT = IN(c01((t - 20.03) / 0.15)), offB = IN(c01((t - 20.05) / 0.15));
  const dot = dotAt(t);
  return (
    <AbsoluteFill>
      {t < T_FLIP + D_FLIP ? <Stack t={t} /> : <GroupCard t={t} />}
      {t >= T_TRUNK && t < 20.2 && <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        <Line pts={piece(trunk, offT, dt)} />
        {BRANCH.map((b, i) => <Line key={i} pts={piece(b, offB, k(t, T_BR[i], D_BR, OUT))} />)}
      </svg>}
      {[0, 1].map((i) => {
        if (t < T_POP[i]) return null;
        const q = sp(t, T_POP[i], 2.4, 0.62), lit = k(t, T_LIT[i], 0.24, OUT), bump = 1 + 0.045 * Math.sin(Math.PI * c01((t - T_LIT[i]) / 0.28));
        // the unchosen perks fold back into their branch ends, leftward and accelerating, before the chosen pill flies
        const ex = c01((t - (20.03 + 0.04 * i)) / 0.2), ee = ex * ex;
        if (ex >= 1) return null;
        return <div key={i} style={{ position: "absolute", left: 0, top: 0, opacity: c01((t - T_POP[i]) / 0.06) * (1 - c01((ex - 0.55) / 0.45)), transformOrigin: `0px ${PILL_H / 2}px`,
          transform: `translate(${PILL_X - PILL_W / 2 - 120 * ee}px, ${PILL_YS[i] - PILL_H / 2}px) scale(${q * bump * (1 - ee)})` }}>
          <PillBar t={t} label={PILL_LABELS[i]} w={PILL_W} h={PILL_H} rT={PILL_H / 2} rB={PILL_H / 2} lit={lit} shadow={1} />
        </div>;
      })}
      {t >= T_POP[2] && t < 20.05 && <WAPillLayer t={t} />}
      {t >= 17.85 && t < 20.05 && <div style={{ position: "absolute", left: 0, top: 0, transformOrigin: "0px 0px", transform: `translate(${bub.x - 180 * bub.s}px, ${bub.y - 70 * bub.s}px) scale(${bub.s})` }}>
        <VoiceBubble t={t} pop={pop} shadow />
      </div>}
      {dot.r > 0.05 && <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        <circle cx={dot.p[0]} cy={dot.p[1]} r={dot.r} fill={DEEP} />
      </svg>}
    </AbsoluteFill>
  );
};

export const S8: Scene = {
  id: "S8", t0: 17.25, t1: 20.5, C: C8,
  // a ring through the contours as the stack turns into the group, and one from the pressed pill (S9 carries it on from 20.50)
  topo: (t) => ({ ripples: [
    ...(t >= 17.66 ? [{ x: 960, y: 560, age: t - 17.66, h: 0.34, w: 120, speed: 850 }] : []),
    ...(t >= 20.02 && t < 20.5 ? [{ x: PILL_X, y: PILL_YS[2], age: t - 20.02, h: 0.32, w: 140, speed: 850 }] : []),
  ] }),
};
