// B4 helpers for S8 + S9 (plan/contract.md). Everything that crosses the S8 -> S9 boundary is a pure function of film
// time here, so both scenes draw exactly the same state at the switch: the group card, the speech bubble (the wave's
// hook as its tail, the DMM squiggle as its voice), the pressed 'WhatsApp group' pill that becomes the phone's header,
// and the phone's live topographic wallpaper (the spine's own field, so the zoom-through lands on S10's stage line for line).
import React from "react";
import { Img, staticFile } from "remotion";
import { C, SANS, WaveMark, markPoints, Pt, c01, k, mix, sp, INOUT, OUT, SOFT } from "../kit";
import { noise3 } from "../topo";

// ------------------------------------------------------------------ geometry helpers
export const cubic = (P0: Pt, P1: Pt, P2: Pt, P3: Pt, n = 72): Pt[] => {
  const out: Pt[] = [];
  for (let i = 0; i <= n; i++) {
    const u = i / n, v = 1 - u, a = v * v * v, b = 3 * v * v * u, c = 3 * v * u * u, d = u * u * u;
    out.push([a * P0[0] + b * P1[0] + c * P2[0] + d * P3[0], a * P0[1] + b * P1[1] + c * P2[1] + d * P3[1]]);
  }
  return out;
};
export const quad = (P0: Pt, P1: Pt, P2: Pt, u: number): Pt => {
  const v = 1 - u; return [v * v * P0[0] + 2 * v * u * P1[0] + u * u * P2[0], v * v * P0[1] + 2 * v * u * P1[1] + u * u * P2[1]];
};
const cum = (pts: Pt[]) => { const L = [0]; for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1])); return L; };
/** the point at fraction u of a polyline's length */
export const at = (pts: Pt[], u: number): Pt => {
  const L = cum(pts), tot = L[L.length - 1], s = c01(u) * tot;
  for (let i = 1; i < pts.length; i++) if (L[i] >= s) { const q = (s - L[i - 1]) / Math.max(1e-6, L[i] - L[i - 1]); return [mix(pts[i - 1][0], pts[i][0], q), mix(pts[i - 1][1], pts[i][1], q)]; }
  return pts[pts.length - 1];
};
/** the piece of a polyline between fractions a and b of its length */
export const piece = (pts: Pt[], a: number, b: number): Pt[] => {
  const L = cum(pts), tot = L[L.length - 1], sa = c01(a) * tot, sb = c01(b) * tot; if (sb - sa < 0.5) return [];
  const out: Pt[] = [at(pts, a)];
  for (let i = 1; i < pts.length - 1; i++) if (L[i] > sa && L[i] < sb) out.push(pts[i]);
  out.push(at(pts, b)); return out;
};
export const ptsStr = (p: Pt[]) => p.map((q) => `${q[0].toFixed(2)},${q[1].toFixed(2)}`).join(" ");

// ------------------------------------------------------------------ S8 layout (frame px)
/** the group card (1000 x 750 at scale 1): flips in at (960, 560), eases left and down to 0.78 at 18.40, leaves left from 20.05 */
export const cardAt = (t: number) => {
  const mv = k(t, 18.4, 0.5, SOFT), ex = Math.pow(c01((t - 20.05) / 0.45), 2.2);
  return { x: mix(960, 540, mv) - 1400 * ex, y: mix(560, 565, mv), s: mix(1, 0.78, mv) };
};
/** the speech bubble's body centre and scale while it rides the card's top-right corner (S8, until 20.05) */
export const bubbleS8 = (t: number) => { const c = cardAt(t); return { x: c.x + c.s * 510, y: c.y - c.s * 385, s: c.s }; };
export const FORK: Pt = [1100, 540];
export const PILL_X = 1510, PILL_W = 520, PILL_H = 112, PILL_YS = [390, 540, 690];
export const PILL_LABELS = ["Exclusive training", "Job offers", "WhatsApp group"];
/** where each branch tucks under its pill's left end */
export const branchEnd = (i: number): Pt => [PILL_X - PILL_W / 2 + 12, PILL_YS[i]];

// ------------------------------------------------------------------ S9 phone (layer px = frame px before S9's camera push)
export const PH_W = 480, PH_H = 980, BZ = 12, SC_W = 456, SC_H = 956, HEAD_H = 128;
/** the chat column (screen px): bottom anchor, gap, bubble heights (voice note = the S8 bubble at 0.72) */
export const YB = 926, GAP = 26, VB_S = 0.72, H_V = 140 * 0.72, H_I = 190, H_L = 311, H_T = 58;
/** the zoom point (screen px): the screen's centre column, in the gap between the image and the link once all have arrived */
export const ZS: Pt = [SC_W / 2, YB - H_T - GAP - H_L - GAP / 2];
export const Q0: Pt = [BZ + ZS[0], BZ + ZS[1]];
export const XL = 537;          // the phone's centre x after the glide (21.55), so phone + type sit centred as a group
export const phoneAt = (t: number) => {
  const rise = sp(t, 20.05, 1.45, 0.8), glide = k(t, 21.55, 0.5, SOFT);
  const xz = c01((t - 22.7) / 0.45), ez = xz * xz * xz, ep = INOUT(c01((t - 22.7) / 0.4));
  const rx = mix(960, XL, glide), ry = 50 + Q0[1] + (1 - rise) * 1150;
  return { ax: mix(rx, 960, ep), ay: mix(ry, 540, ep), z: 1 + 5 * ez, ez, push: mix(1, 1.06, k(t, 20.2, 1.8, INOUT)) };
};
export type PhoneState = ReturnType<typeof phoneAt>;
/** a point in phone px -> layer px */
export const phoneToLayer = (ph: PhoneState, q: Pt): Pt => [ph.ax + (q[0] - Q0[0]) * ph.z, ph.ay + (q[1] - Q0[1]) * ph.z];

// ------------------------------------------------------------------ the 'WhatsApp group' pill: pops (S8), lit and pressed at 20.02, flies into the header (S9)
export const T_DOCK = 20.48;
export const waPill = (t: number) => {
  const ef = INOUT(c01((t - 20.12) / (T_DOCK - 20.12)));
  const [hx, hy] = phoneToLayer(phoneAt(t), [PH_W / 2, BZ + HEAD_H / 2]);
  const arc = Math.sin(Math.PI * ef);
  return {
    cx: mix(PILL_X, hx, ef) + 40 * arc, cy: mix(PILL_YS[2], hy, ef) - 30 * arc, w: mix(PILL_W, SC_W, ef), h: mix(PILL_H, HEAD_H, ef),
    rT: mix(PILL_H / 2, 52, ef), rB: mix(PILL_H / 2, 0, ef), pop: sp(t, 19.21, 2.4, 0.62), lit: k(t, 20.02, 0.22, OUT),
    dip: 1 - 0.06 * Math.sin(Math.PI * c01((t - 20.02) / 0.2)), shadow: 1 - ef,
  };
};
/** S8 and S9 both draw the pill with this, so the switch at 20.05 is exact */
export const WAPillLayer: React.FC<{ t: number }> = ({ t }) => {
  const p = waPill(t);
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: p.w, height: p.h, transformOrigin: `0px ${p.h / 2}px`, transform: `translate(${p.cx - p.w / 2}px, ${p.cy - p.h / 2}px) scale(${p.pop})` }}>
      <div style={{ transform: `scale(${p.dip})` }}>
        <PillBar t={t} label={PILL_LABELS[2]} w={p.w} h={p.h} rT={p.rT} rB={p.rB} lit={p.lit} shadow={p.shadow} header />
      </div>
    </div>
  );
};

// ------------------------------------------------------------------ their pill, lit from its left end; as the header it rolls to the group's name
const Lock: React.FC<{ drop: number }> = ({ drop }) => (
  <svg width={22} height={30} viewBox="0 0 22 30" style={{ overflow: "visible", display: "block" }}>
    <path d="M5.5 15 V9.5 a5.5 5.5 0 0 1 11 0 V15" transform={`translate(0 ${(-7 * (1 - drop)).toFixed(2)})`} stroke={C.char} strokeWidth={3.4} fill="none" strokeLinecap="round" />
    <rect x={1} y={13} width={20} height={16} rx={4} fill={C.char} />
  </svg>
);
const HeaderContent: React.FC<{ t: number; roll: number; bw: number; bh: number }> = ({ t, roll, bw, bh }) => {
  const av = sp(t, 20.4, 2.4, 0.65), l2 = INOUT(c01((t - 22.14) / 0.32));
  const lockIn = sp(t, 21.56, 2.6, 0.7), drop = sp(t, 21.82, 3.0, 0.45), lockPop = 1 + 0.28 * Math.sin(Math.PI * c01((t - 21.82) / 0.3));
  return (
    <div style={{ position: "absolute", left: (bw - SC_W) / 2, top: (bh - HEAD_H) / 2, width: SC_W, height: HEAD_H }}>
      <div style={{ position: "absolute", left: 18, top: 33, width: 62, height: 62, borderRadius: 31, background: C.char, transform: `scale(${av})` }}>
        <WaveMark width={40} p={k(t, 20.46, 0.4)} dot={k(t, 20.82, 0.14)} style={{ position: "absolute", left: 10, top: 20 }} />
      </div>
      <div style={{ position: "absolute", left: 94, top: 49, height: 30, display: "flex", alignItems: "center", gap: 10, opacity: c01(roll * 1.5), transform: `translateY(${(1 - roll) * 46 - 13 * l2}px)` }}>
        <span style={{ fontFamily: SANS, fontWeight: 700, fontSize: 25, letterSpacing: "-0.01em", color: C.char, whiteSpace: "nowrap" }}>Digital Marketing Málaga</span>
        {lockIn > 0.001 && <div style={{ transform: `scale(${lockIn * lockPop})` }}><Lock drop={drop} /></div>}
      </div>
      {l2 > 0 && <div style={{ position: "absolute", left: 94, top: 73, fontFamily: SANS, fontWeight: 500, fontSize: 18, color: "rgba(44,44,49,0.78)", whiteSpace: "nowrap",
        opacity: c01(l2 * 1.5), transform: `translateY(${(1 - l2) * 30}px)` }}>About 240 active members</div>}
    </div>
  );
};
export const PillBar: React.FC<{ t: number; label: string; w: number; h: number; rT: number; rB: number; lit: number; shadow: number; header?: boolean }> =
  ({ t, label, w: bw, h: bh, rT, rB, lit, shadow, header }) => {
    const roll = header ? INOUT(c01((t - 20.26) / 0.32)) : 0;
    return (
      <div style={{ position: "relative", width: bw, height: bh, borderRadius: `${rT}px ${rT}px ${rB}px ${rB}px`, overflow: "hidden", background: C.cyanL,
        boxShadow: shadow > 0.002 ? `0 0 2px rgba(20,24,30,${0.06 * shadow}), 0 0 26px rgba(20,24,30,${0.09 * shadow}), 0 0 50px rgba(31,185,210,${0.3 * lit * shadow})` : undefined }}>
        {lit > 0.001 && <div style={{ position: "absolute", inset: 0, background: C.cyan, clipPath: `circle(${(lit * (bw + bh)).toFixed(1)}px at ${bh / 2}px ${bh / 2}px)` }} />}
        {roll < 0.999 && <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontWeight: 600, fontSize: 50,
          letterSpacing: "0.02em", color: C.char, whiteSpace: "nowrap", opacity: 1 - c01(roll * 1.6), transform: `translateY(${-roll * 46}px) scale(${1 - 0.35 * roll})` }}>{label}</div>}
        {header && roll > 0.001 && <HeaderContent t={t} roll={roll} bw={bw} bh={bh} />}
      </div>
    );
  };

// ------------------------------------------------------------------ the speech bubble: cyan, the wave's end hook as its tail, the DMM squiggle as its voice
/** body 360 x 140 (radius 70); the tail curls out of its bottom-left corner and ends in the hook's upward flick */
const TAIL_D = "M 96 116 C 88 146 62 164 36 164 C 28 164 21 160 16 154";
const WAVE: Pt[] = markPoints(84, 186, 70, 200);   // the mark's wave, 176 x 85 px, centred in the body
export const VoiceBubble: React.FC<{ t: number; pop?: number; shadow?: boolean }> = ({ t, pop = 1, shadow }) => {
  const a = 1 + 0.09 * Math.sin(t * 7.1) + 0.05 * Math.sin(t * 11.3 + 1.3);       // the voice: humps breathe
  const pts = WAVE.map(([x, y]) => [x, 70 + (y - 70) * a] as Pt);
  const u = ((((t - 17.92) / 1.6) % 1) + 1) % 1;                                      // the playhead loops every 1.6 s
  const dot = at(pts, u), dr = 10.5 * c01(Math.min(u / 0.06, (1 - u) / 0.06)), played = 1 - c01((u - 0.8) / 0.18);
  const head = piece(pts, 0, u);
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 360, height: 140, transformOrigin: "16px 154px", transform: `scale(${pop})` }}>
      <svg width={360} height={180} viewBox="0 0 360 180" style={{ position: "absolute", left: 0, top: 0, overflow: "visible", filter: shadow ? "drop-shadow(0 0 14px rgba(20,24,30,0.16))" : undefined }}>
        <path d={TAIL_D} stroke={C.cyan} strokeWidth={24} strokeLinecap="round" fill="none" />
        <rect x={0} y={0} width={360} height={140} rx={70} fill={C.cyan} />
        <polyline points={ptsStr(pts)} stroke={C.char} strokeOpacity={0.3} strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" fill="none" />
        {head.length > 1 && <polyline points={ptsStr(head)} stroke={C.char} strokeOpacity={played} strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" fill="none" />}
        {dr > 0.05 && <circle cx={dot[0]} cy={dot[1]} r={dr} fill={C.char} />}
      </svg>
    </div>
  );
};
/** a chat bubble of any size with the same hook tail (at the voice note's 0.72 scale) */
export const ChatBubble: React.FC<{ w: number; h: number; r: number; color: string; children?: React.ReactNode }> = ({ w: bw, h: bh, r, color, children }) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: bw, height: bh }}>
    <svg width={140} height={60} style={{ position: "absolute", left: 0, top: bh - 140 * VB_S, overflow: "visible" }}>
      <g transform={`scale(${VB_S})`}><path d={TAIL_D} stroke={color} strokeWidth={24} strokeLinecap="round" fill="none" /></g>
    </svg>
    <div style={{ position: "absolute", inset: 0, borderRadius: r, background: color, overflow: "hidden" }}>{children}</div>
  </div>
);
export const ImageMsg: React.FC = () => (
  <ChatBubble w={384} h={H_I} r={26} color={C.cyan}>
    <div style={{ position: "absolute", left: 8, top: 8, width: 368, height: 174, borderRadius: 18, overflow: "hidden" }}>
      <Img src={staticFile("img/outdoor.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </div>
  </ChatBubble>
);
export const LinkMsg: React.FC = () => (
  <ChatBubble w={384} h={H_L} r={26} color={C.cyan}>
    <div style={{ position: "absolute", left: 8, top: 8, width: 368, height: 201, borderRadius: 18, overflow: "hidden", background: C.char }}>
      <Img src={staticFile("img/banner-tatiana.png")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </div>
    <div style={{ position: "absolute", left: 16, top: 219, width: 352, fontFamily: SANS, fontWeight: 600, fontSize: 21, lineHeight: 1.22, letterSpacing: "-0.01em", color: C.char }}>
      What Happens When You Take the P&amp;G Playbook Out of P&amp;G?</div>
    <div style={{ position: "absolute", left: 16, top: 278, fontFamily: SANS, fontWeight: 500, fontSize: 17, color: "rgba(44,44,49,0.72)", whiteSpace: "nowrap" }}>2026-10-15 19:00:00</div>
  </ChatBubble>
);
export const TypingMsg: React.FC<{ t: number }> = ({ t }) => (
  <ChatBubble w={112} h={H_T} r={29} color="#3A3A41">
    {[0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: 25 + 24 * i, top: 22, width: 14, height: 14, borderRadius: 7, background: i === 1 ? C.cyan : C.cyanL,
      transform: `translateY(${(-6 * (0.5 + 0.5 * Math.sin(2 * Math.PI * 1.7 * t - i * 0.95))).toFixed(2)}px)` }} />)}
  </ChatBubble>
);

// ------------------------------------------------------------------ the phone's wallpaper: the spine's own contour field (same noise, levels, grid)
const SCL = 1 / 860, SPC = 0.085;
/** contour segments of the spine's base field over [fx0, fx1] x [fy0, fy1] (field px = the spine's frame px), on the spine's 10 px grid */
export const fieldPath = (t: number, fx0: number, fy0: number, fx1: number, fy1: number, cell = 10): string => {
  const z = t * 0.05;
  const i0 = Math.floor(fx0 / cell), i1 = Math.ceil(fx1 / cell), j0 = Math.floor(fy0 / cell), j1 = Math.ceil(fy1 / cell);
  const gw = i1 - i0 + 1, gh = j1 - j0 + 1; if (gw < 2 || gh < 2 || gw * gh > 120000) return "";
  const f = new Float32Array(gw * gh);
  for (let j = 0; j < gh; j++) for (let i = 0; i < gw; i++) {
    const x = (i0 + i) * cell, y = (j0 + j) * cell;
    f[j * gw + i] = noise3(x * SCL, y * SCL, z) + 0.32 * noise3(x * SCL * 2.1 + 17, y * SCL * 2.1 - 9, z * 1.3);
  }
  let lo = Infinity, hi = -Infinity; for (let n = 0; n < f.length; n++) { if (f[n] < lo) lo = f[n]; if (f[n] > hi) hi = f[n]; }
  const parts: string[] = [];
  for (let L = Math.ceil(lo / SPC) * SPC; L < hi; L += SPC) {
    for (let j = 0; j < gh - 1; j++) for (let i = 0; i < gw - 1; i++) {
      const a = f[j * gw + i], b = f[j * gw + i + 1], c = f[(j + 1) * gw + i + 1], d = f[(j + 1) * gw + i];
      const idx = (a > L ? 8 : 0) | (b > L ? 4 : 0) | (c > L ? 2 : 0) | (d > L ? 1 : 0);
      if (idx === 0 || idx === 15) continue;
      const x = (i0 + i) * cell, y = (j0 + j) * cell;
      const top = () => [x + cell * (L - a) / (b - a), y], right = () => [x + cell, y + cell * (L - b) / (c - b)];
      const bottom = () => [x + cell * (L - d) / (c - d), y + cell], left = () => [x, y + cell * (L - a) / (d - a)];
      const seg = (p: number[], q: number[]) => parts.push(`M${p[0].toFixed(1)} ${p[1].toFixed(1)}L${q[0].toFixed(1)} ${q[1].toFixed(1)}`);
      switch (idx) {
        case 1: case 14: seg(left(), bottom()); break;
        case 2: case 13: seg(bottom(), right()); break;
        case 3: case 12: seg(left(), right()); break;
        case 4: case 11: seg(top(), right()); break;
        case 6: case 9: seg(top(), bottom()); break;
        case 7: case 8: seg(left(), top()); break;
        case 5: seg(left(), top()); seg(bottom(), right()); break;
        case 10: seg(top(), right()); seg(left(), bottom()); break;
      }
    }
  }
  return parts.join("");
};
/** the wallpaper inside the screen (screen px). The zoom point shows field (960, 540); m field px per screen px goes 2 -> 6 through
 *  the zoom, so at the cut (23.15: phone x6 under the 1.06 push) the field sits at exactly the spine's 1.06 about the frame centre. */
export const Wallpaper: React.FC<{ t: number; ph: PhoneState }> = ({ t, ph }) => {
  const m = 2 + 4 * ph.ez;
  const toS = (Fx: number, Fy: number): Pt => [(960 + (Fx - 960) / ph.push - ph.ax) / ph.z + ZS[0], (540 + (Fy - 540) / ph.push - ph.ay) / ph.z + ZS[1]];
  const a = toS(0, 0), b = toS(1920, 1080);
  const x0 = Math.max(0, a[0]), y0 = Math.max(0, a[1]), x1 = Math.min(SC_W, b[0]), y1 = Math.min(SC_H, b[1]);
  if (x1 <= x0 || y1 <= y0) return null;
  const F = (sx: number, sy: number): Pt => [960 + (sx - ZS[0]) * m, 540 + (sy - ZS[1]) * m];
  const p0 = F(x0, y0), p1 = F(x1, y1);
  const d = fieldPath(t, p0[0] - 20, p0[1] - 20, p1[0] + 20, p1[1] + 20);
  return (
    <svg width={SC_W} height={SC_H} style={{ position: "absolute", left: 0, top: 0 }}>
      <g transform={`translate(${ZS[0]} ${ZS[1]}) scale(${1 / m}) translate(-960 -540)`}>
        <path d={d} stroke={`rgba(255,255,255,${mix(0.15, 0.1, ph.ez).toFixed(3)})`} strokeWidth={mix(2.6, 2, ph.ez)} fill="none" strokeLinecap="round" />
      </g>
    </svg>
  );
};
