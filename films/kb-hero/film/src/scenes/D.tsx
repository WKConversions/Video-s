// Group D, minimal pass: pillar 3. S9 title, S10 SEO & GEO (one rank climb + one AI answer), S11 conversion (one click, one ring).
import React from "react";
import { C, FONT, GRAD, SHADOW, Stage, Words, Eyebrow, Win, Btn, Caption, E, S, ease, mix, clamp, pressAt, Ripple } from "../kit";
import type { Group, Scene, HandKey, Sfx } from "../types";

const Bar: React.FC<{ x: number; y: number; w: number; h: number; bg?: string; style?: React.CSSProperties; children?: React.ReactNode }> = ({ x, y, w, h, bg = C.card, style, children }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: h / 2, background: bg, ...style }}>{children}</div>
);
const Check: React.FC<{ s: number; p: number; color?: string }> = ({ s, p, color = "#fff" }) => (
  <svg width={s} height={s} viewBox="0 0 24 24"><path d="M5 12.5 L10 17.5 L19 7" fill="none" stroke={color} strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - clamp(p)} /></svg>
);
const Sparkle: React.FC<{ s: number; color?: string }> = ({ s, color = "#fff" }) => (
  <svg width={s} height={s} viewBox="0 0 24 24"><path d="M12 2 L14 10 L22 12 L14 14 L12 22 L10 14 L2 12 L10 10 Z" fill={color} /></svg>
);

// ---------------- S9: text ----------------
const S9: Scene = ({ t }) => {
  const sub = S(t, 0.35);
  return (
    <Stage t={t} tint={C.mint} tint2={C.cyan}>
      <Eyebrow t={t} t0={-0.15} text="PILLAR 03" y={340} color={C.mint} />
      <Words t={t} t0={0} text={"Growth\nTechnology"} size={128} y={540} hi={{ Growth: GRAD.growth }} stagger={0.1} />
      <div style={{ position: "absolute", left: 960, top: 770, width: 1400, textAlign: "center", opacity: clamp(sub * 1.5), transform: `translate3d(-50%, ${((1 - sub) * 24 - 50).toFixed(2)}%, 0)`, willChange: "transform",
        fontFamily: FONT, fontWeight: 600, fontSize: 44, color: C.sub, letterSpacing: -0.5 }}>Visibility. Conversion. Product marketing.</div>
    </Stage>
  );
};

// ---------------- S10: SEO & GEO ----------------
const SX = 160, SW = 1000, ROW = 150, R0 = 370, RH = 120;
const S10: Scene = ({ t }) => {
  const q = "your business", n = Math.floor(clamp(t / 0.8) * q.length);
  const arr = S(t, -0.2, { damping: 16 });
  const c = E(t, 1.2, 0.5, ease.inOut), fill = E(t, 1.45, 0.4, ease.out);
  const press = pressAt(t, 2.3), card = S(t, 2.0, { damping: 12 }), chip = E(t, 2.15, 0.4, ease.out);
  const glow = 0.5 + 0.5 * Math.sin(t * 3.2);
  const rows = [
    { slot: c, mine: false, d: 0 }, { slot: 1 + c, mine: false, d: 1 }, { slot: 2 * (1 - c), mine: true, d: 2 },
  ];
  return (
    <Stage t={t} tint={C.mint} tint2={C.cyan}>
      <Caption t={t} text="SEO & GEO Optimization" grad={GRAD.growth} />
      <div style={{ position: "absolute", left: SX, top: 215, width: SW, height: 110, borderRadius: 55, background: C.white, boxShadow: SHADOW.card, border: `1px solid ${C.line}`, opacity: clamp(arr * 2),
        transform: `translate3d(0, ${((1 - arr) * 40).toFixed(2)}px, 0)`, willChange: "transform" }}>
        <svg width={48} height={48} viewBox="0 0 48 48" style={{ position: "absolute", left: 38, top: 31 }}><circle cx={21} cy={21} r={13} fill="none" stroke={C.navy2} strokeWidth={5} /><line x1={31} y1={31} x2={42} y2={42} stroke={C.navy2} strokeWidth={5} strokeLinecap="round" /></svg>
        <div style={{ position: "absolute", left: 110, top: 0, height: 110, display: "flex", alignItems: "center", fontFamily: FONT, fontWeight: 600, fontSize: 46, color: C.navy, letterSpacing: -1 }}>
          {q.slice(0, n)}<span style={{ display: "inline-block", width: 3, height: 50, background: C.cyan, marginLeft: 4, opacity: Math.sin(t * 12) > -0.2 ? 1 : 0 }} />
        </div>
      </div>
      {rows.map(({ slot, mine, d }) => {
        const p = S(t, 0.7 + d * 0.12, { damping: 14 });
        return (
          <div key={d} style={{ position: "absolute", left: SX, top: R0, width: SW, height: RH, borderRadius: 26, background: C.white, overflow: "hidden", opacity: clamp(p * 2), willChange: "transform",
            boxShadow: mine ? `0 ${22 + 8 * glow * fill}px 54px rgba(34,199,160,${(0.12 + 0.2 * fill).toFixed(3)})` : SHADOW.soft, border: `${mine ? 2 : 1}px solid ${mine ? C.mint : C.line}`,
            transform: `translate3d(0, ${(slot * ROW + (1 - p) * 60).toFixed(2)}px, 0) scale(${(1 - 0.03 * (mine ? press : 0)).toFixed(4)})` }}>
            {mine && <div style={{ position: "absolute", inset: 0, background: GRAD.growth, transform: `scaleX(${fill})`, transformOrigin: "0 50%" }} />}
            <div style={{ position: "absolute", left: 24, top: 24, width: 72, height: 72, borderRadius: 20, background: mine ? C.navy : C.card }} />
            {mine
              ? <div style={{ position: "absolute", left: 124, top: 0, height: RH, display: "flex", alignItems: "center", fontFamily: FONT, fontWeight: 700, fontSize: 42, color: mix(0, 1, fill) > 0.5 ? "#fff" : C.navy }}>Your site</div>
              : <><Bar x={124} y={34} w={420} h={26} bg={C.card} /><Bar x={124} y={76} w={260} h={18} bg={C.muted} /></>}
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 1260, top: 370, width: 500, height: 330, borderRadius: 32, background: C.white, boxShadow: SHADOW.lift, border: `1px solid ${C.line}`, opacity: clamp(card * 1.6),
        transform: `translate3d(0, ${((1 - card) * 40).toFixed(2)}px, 0) scale(${mix(0.85, 1, card).toFixed(4)})`, willChange: "transform" }}>
        <div style={{ position: "absolute", left: 36, top: 32, display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 56, height: 56, borderRadius: 18, background: GRAD.ai, display: "flex", alignItems: "center", justifyContent: "center", transform: `rotate(${(t * 40).toFixed(2)}deg)` }}><Sparkle s={32} /></div>
          <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 34, color: C.navy }}>AI answer</div>
        </div>
        <Bar x={36} y={128} w={428} h={22} bg={C.card} /><Bar x={36} y={170} w={300} h={22} bg={C.card} />
        <div style={{ position: "absolute", left: 36, top: 232, height: 62, padding: "0 28px", borderRadius: 31, display: "flex", alignItems: "center", fontFamily: FONT, fontWeight: 700, fontSize: 32,
          background: chip > 0.5 ? C.mint : C.muted, color: chip > 0.5 ? "#fff" : C.sub, boxShadow: chip > 0.5 ? `0 0 ${24 + 16 * glow}px rgba(34,199,160,.5)` : "none" }}>Your site</div>
      </div>
      <Ripple t={t} c={2.3} x={660} y={R0 + RH / 2} color={C.mint} r={110} />
    </Stage>
  );
};

// ---------------- S11: conversion ----------------
const WX = 140, WY = 260, WW = 1000, WH = 640, BX = 640, BY = 790, RX = 1540, RY = 580, RR = 150;
const S11: Scene = ({ t }) => {
  const win = S(t, -0.2, { damping: 16 }), press = pressAt(t, 0.9);
  const conf = S(t, 1.1, { damping: 12 }), confOut = E(t, 2.6, 0.4, ease.in);
  const ring = S(t, -0.1, { damping: 16 }), sweep = E(t, 1.3, 1.3, ease.inOut), val = mix(0.2, 0.88, sweep);   // the ring fills calmly until 2.6, then pulses twice: no dead hold
  const arrow = S(t, 1.5, { damping: 11 }), glow = 0.5 + 0.5 * Math.sin(t * 3);
  const circ = 2 * Math.PI * RR;
  return (
    <Stage t={t} tint={C.mint} tint2={C.cyan}>
      <Caption t={t} text="Website & Conversion Optimization" grad={GRAD.growth} />
      <div style={{ opacity: clamp(win * 2), transform: `translate3d(0, ${((1 - win) * 50).toFixed(2)}px, 0)`, willChange: "transform" }}>
        <Win x={WX} y={WY} w={WW} h={WH} title="Landing page">
          <Bar x={140} y={70} w={720} h={44} bg={C.navy} /><Bar x={240} y={140} w={520} h={44} bg={C.navy} />
          <Bar x={320} y={226} w={360} h={24} bg={C.card} />
        </Win>
        <Btn x={BX} y={BY} text="Book a call" size={38} press={press} bg={press > 0.5 ? C.mint : C.cyan} color={press > 0.5 ? "#fff" : C.navy} />
      </div>
      <div style={{ position: "absolute", left: BX - 230, top: 560, width: 460, height: 170, borderRadius: 34, background: C.white, boxShadow: SHADOW.lift, border: `1px solid ${C.line}`, display: "flex", alignItems: "center", gap: 24, padding: "0 36px", boxSizing: "border-box",
        opacity: clamp(conf * 1.6) * (1 - confOut), transform: `translate3d(0, ${((1 - conf) * 40).toFixed(2)}px, 0) scale(${mix(0.85, 1, conf).toFixed(4)})`, willChange: "transform" }}>
        <div style={{ width: 84, height: 84, borderRadius: 42, background: C.green, display: "flex", alignItems: "center", justifyContent: "center" }}><Check s={52} p={E(t, 1.2, 0.3, ease.out)} /></div>
        <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 44, color: C.navy }}>Confirmed</div>
      </div>
      <div style={{ position: "absolute", left: RX - RR - 30, top: RY - RR - 30, width: 2 * RR + 60, height: 2 * RR + 60, opacity: clamp(ring * 2), transform: `scale(${mix(0.85, 1, ring).toFixed(4)})`, willChange: "transform" }}>
        <svg width={2 * RR + 60} height={2 * RR + 60} viewBox={`${-30} ${-30} ${2 * RR + 60} ${2 * RR + 60}`} style={{ overflow: "visible", filter: `drop-shadow(0 0 ${14 + 14 * glow * sweep}px rgba(34,199,160,${(0.15 + 0.3 * sweep).toFixed(3)}))` }}>
          <defs><linearGradient id="g11" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={C.mint} /><stop offset="1" stopColor={C.cyan} /></linearGradient></defs>
          <g transform={`translate(${RR} ${RR})`}>
            <circle r={RR} fill="none" stroke={C.card} strokeWidth={40} />
            <circle r={RR} fill="none" stroke="url(#g11)" strokeWidth={40} strokeLinecap="round" strokeDasharray={`${circ * val} ${circ}`} transform="rotate(-90)" />
          </g>
        </svg>
        <div style={{ position: "absolute", left: "50%", top: "50%", transform: `translate3d(-50%, -50%, 0) scale(${arrow.toFixed(4)})`, opacity: clamp(arrow * 2) }}>
          <svg width={110} height={110} viewBox="0 0 24 24"><path d="M12 20 V5 M5 12 L12 5 L19 12" fill="none" stroke={C.mint} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
      </div>
      <Ripple t={t} c={0.9} x={BX} y={BY} color={C.cyan} r={110} />
      <Ripple t={t} c={2.45} x={RX} y={RY} color={C.mint} r={RR + 130} />
      <Ripple t={t} c={2.95} x={RX} y={RY} color={C.mint} r={RR + 130} />
    </Stage>
  );
};

const hand: Record<string, HandKey[]> = {
  S9: [],
  S10: [{ at: 2.3, x: 660, y: R0 + RH / 2, click: true }],
  S11: [{ at: 0.9, x: BX, y: BY, click: true }],
};
const sfx: Record<string, Sfx[]> = {
  S9: [{ t: 0.05, kind: "pop", note: "eyebrow" }, { t: 0.45, kind: "rise", note: "subline" }],
  S10: [{ t: 0.05, kind: "type", note: "search types" }, { t: 1.25, kind: "slide", note: "rank climbs" }, { t: 2.0, kind: "pop", note: "AI answer" }, { t: 2.41, kind: "click", note: "click result" }],
  S11: [{ t: 1.01, kind: "click", note: "Book a call" }, { t: 1.15, kind: "pop", note: "Confirmed" }, { t: 1.4, kind: "rise", note: "ring sweeps" }, { t: 2.56, kind: "success", note: "ring full" }],
};
export const GROUP: Group = { scenes: { S9, S10, S11 }, hand, sfx };
