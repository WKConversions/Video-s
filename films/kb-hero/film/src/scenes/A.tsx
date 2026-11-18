// Group A (minimal pass): S1 headline then the K.B tile; S2 three pillar cards with one icon each.
import React from "react";
import { C, E, FONT, GRAD, KBTile, Ripple, S, SHADOW, Stage, Words, clamp, ease, mix, pressAt } from "../kit";
import type { Group, Scene } from "../types";

// ---------- S1 ----------
const TX = 960, TY = 450, CLICK1 = 3.7;
const S1: Scene = ({ t }) => {
  const tile = S(t, 2.5, { damping: 13, stiffness: 150 });
  const press = pressAt(t, CLICK1);
  const tag = S(t, 2.85), ring = E(t, 2.6, 1.1, ease.out);
  const breathe = 1 + 0.012 * Math.sin(t * 2.4);
  return (
    <Stage t={t}>
      <Words t={t} t0={0.1} text={"The technical team\nyou don't have to hire yet."} size={112} y={540} stagger={0.11} hi={{ technical: GRAD.brand, team: GRAD.brand }} out={2.3} maxW={1800} />
      {t > 2.4 && (
        <>
          <div style={{ position: "absolute", left: TX - 150, top: TY - 150, width: 300, height: 300, borderRadius: 40, border: `5px solid ${C.cyan}`, boxSizing: "border-box", opacity: 0.6 * (1 - ring), transform: `scale(${mix(1, 1.9, ring).toFixed(4)})` }} />
          <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `translate3d(0,0,0) scale(${((tile * (1 - 0.05 * press)) * breathe).toFixed(4)})`, transformOrigin: `${TX}px ${TY}px`, opacity: clamp(tile * 3), willChange: "transform" }}>
            <KBTile x={TX} y={TY} size={300} />
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 690, textAlign: "center", fontFamily: FONT, fontWeight: 700, fontSize: 38, letterSpacing: 12, color: C.navy, opacity: clamp(tag * 1.5), transform: `translate3d(0, ${((1 - tag) * 20).toFixed(2)}px, 0)`, willChange: "transform" }}>YOUR TECH PARTNER</div>
        </>
      )}
      <Ripple t={t} c={CLICK1} x={TX} y={TY} r={230} />
    </Stage>
  );
};

// ---------- S2 ----------
const CW = 480, CH = 520, CY = 620, CLICK2 = 3.3;
const XS = [400, 960, 1520];
const Sparkle: React.FC<{ t: number }> = ({ t }) => (
  <svg width={200} height={200} viewBox="-100 -100 200 200" style={{ transform: `rotate(${(t * 25).toFixed(2)}deg)` }}>
    <defs><linearGradient id="sp" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stopColor={C.cyan} /><stop offset="1" stopColor={C.violet} /></linearGradient></defs>
    <path d="M0 -90 C8 -30 30 -8 90 0 C30 8 8 30 0 90 C-8 30 -30 8 -90 0 C-30 -8 -8 -30 0 -90Z" fill="url(#sp)" />
  </svg>
);
const Code: React.FC<{ t: number }> = ({ t }) => (
  <div style={{ fontFamily: "Menlo, monospace", fontWeight: 800, fontSize: 110, color: C.indigo, letterSpacing: -4, display: "flex", alignItems: "center", height: 200 }}>
    {"</>"}<div style={{ width: 10, height: 100, marginLeft: 10, background: C.cyan, opacity: Math.sin(t * 6) > 0 ? 1 : 0.1 }} />
  </div>
);
const Arrow: React.FC<{ t: number }> = ({ t }) => {
  const d = E(t, 0.5, 1.0, ease.out);
  return (
    <svg width={220} height={200} viewBox="0 0 220 200">
      <defs><linearGradient id="ar" x1="0" x2="1"><stop offset="0" stopColor={C.mint} /><stop offset="1" stopColor={C.cyan} /></linearGradient></defs>
      <path d="M20 170 L80 110 L120 135 L190 45" fill="none" stroke="url(#ar)" strokeWidth={16} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - d} />
      <path d="M140 40 L192 42 L188 95" fill="none" stroke={C.cyan} strokeWidth={16} strokeLinecap="round" strokeLinejoin="round" opacity={clamp((d - 0.8) * 5)} />
    </svg>
  );
};
const PILLARS = [
  { name: "AI, Agents & Automation", grad: GRAD.ai, c: C.violet, Icon: Sparkle },
  { name: "Software Development", grad: GRAD.dev, c: C.indigo, Icon: Code },
  { name: "Growth Technology", grad: GRAD.growth, c: C.mint, Icon: Arrow },
];
const bump = (t: number, a: number, b: number) => Math.sin(Math.PI * clamp((t - a) / (b - a)));

const S2: Scene = ({ t }) => {
  const hov = [0.7 * E(t, 3.0, 0.4, ease.out), bump(t, 1.9, 2.4), bump(t, 0.95, 1.6)];
  const hdr = S(t, -0.1), clickScale = E(t, 3.5, 0.9, ease.inOut);
  return (
    <Stage t={t} tint={C.violet} tint2={C.mint}>
      <KBTile x={960} y={120} size={96} style={{ transform: `scale(${hdr})` }} />
      <div style={{ position: "absolute", left: 960, top: 235, transform: `translate3d(-50%, ${(1 - S(t, 0.05)) * 20 - 50}%, 0)`, opacity: clamp(S(t, 0.05) * 1.5), fontFamily: FONT, fontWeight: 600, fontSize: 56, letterSpacing: -1, color: C.navy, whiteSpace: "nowrap" }}>One partner. Three pillars.</div>
      {PILLARS.map((p, i) => {
        const t0 = 0.15 + i * 0.15, a = S(t, t0, { damping: 15, stiffness: 130 }), h = hov[i];
        const isClick = i === 0, press = isClick ? pressAt(t, CLICK2) : 0;
        const sc = mix(0.6, 1, a) * (1 + 0.03 * h) * (isClick ? (1 - 0.04 * press) * (1 + 0.4 * clickScale) : 1);
        const ty = (1 - a) * 200 - 18 * h;
        const tt = Math.max(0, t - t0);
        return (
          <div key={i} style={{ position: "absolute", left: XS[i] - CW / 2, top: CY - CH / 2, width: CW, height: CH, borderRadius: 38, background: C.white, boxShadow: `${SHADOW.card}, 0 0 ${50 * h + 40 * press}px ${p.c}${h > 0.05 || press > 0.05 ? "55" : "00"}`,
            opacity: clamp(a * 2.2) * (isClick ? 1 : 1 - 0.6 * clickScale), zIndex: isClick ? 3 : 1, willChange: "transform", transform: `translate3d(0, ${ty.toFixed(2)}px, 0) scale(${sc.toFixed(4)})` }}>
            <div style={{ position: "absolute", left: 0, right: 0, top: 70, height: 220, display: "flex", justifyContent: "center", alignItems: "center" }}><p.Icon t={tt} /></div>
            <div style={{ position: "absolute", left: 0, right: 0, top: 340, textAlign: "center", padding: "0 30px", fontFamily: FONT, fontWeight: 800, fontSize: 44, lineHeight: 1.12, letterSpacing: -1, color: C.navy }}>{p.name}</div>
            <div style={{ position: "absolute", left: 60, right: 60, bottom: 30, height: 10, borderRadius: 5, background: p.grad, transformOrigin: "left", transform: `scaleX(${E(t, t0 + 0.3, 0.6, ease.out)})` }} />
          </div>
        );
      })}
      <Ripple t={t} c={CLICK2} x={XS[0] + 130} y={CY + 185} r={200} color={C.violet} />
    </Stage>
  );
};

export const GROUP: Group = {
  scenes: { S1, S2 },
  hand: {
    S1: [{ at: CLICK1, x: TX, y: TY, click: true }],
    S2: [{ at: 1.3, x: XS[2] + 130, y: CY + 185 }, { at: CLICK2, x: XS[0] + 130, y: CY + 185, click: true }],
  },
  sfx: {
    S1: [{ t: 0.15, kind: "whoosh", note: "headline words rise" }, { t: 2.35, kind: "fall", note: "lines draw into the centre" }, { t: 2.55, kind: "pop", note: "K.B tile springs in" }, { t: 3.81, kind: "click", note: "hand clicks the tile" }],
    S2: [{ t: 0.2, kind: "pop", note: "cards cascade" }, { t: 0.5, kind: "slide", note: "third card lands" }, { t: 1.95, kind: "tick", note: "hand passes card 2" }, { t: 3.41, kind: "click", note: "click card 1" }, { t: 3.55, kind: "rise", note: "card grows toward viewer" }],
  },
};
