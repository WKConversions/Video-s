// Group E helpers: S12 (Diagnose, Build, Run) and S14 (end card), motion pass.
import React from "react";
import { C, E, FONT, GRAD, KBTile, S, SHADOW, Stage, Words, Chip, Ripple, clamp, ease, mix, pressAt } from "../kit";
import type { Scene } from "../types";

const CX = [450, 960, 1470], CW = 440, CT = 250, CH = 520;
const ACC = [C.cyan, C.indigo, C.mint];
const NAMES = ["Diagnose", "Build", "Run"];
const AT = [0.5, 1.7, 2.7];
const LY = 850, LX0 = CX[0], LX1 = CX[2];

// one big simple icon per step (200 px box); `m` 0..1 is its one small move
const Icon: React.FC<{ i: number; m: number; col: string }> = ({ i, m, col }) => {
  const sw = 14;
  if (i === 0) return (
    <svg width="220" height="220" viewBox="0 0 220 220" style={{ transform: `translate3d(${(Math.sin(m * Math.PI) * 18).toFixed(2)}px, ${(Math.sin(m * Math.PI) * -10).toFixed(2)}px, 0) rotate(${(m * 0).toFixed(2)}deg)` }}>
      <circle cx="94" cy="94" r="58" fill={`${col}22`} stroke={col} strokeWidth={sw} />
      <path d="M138 138 L190 190" stroke={C.navy} strokeWidth={sw + 4} strokeLinecap="round" />
    </svg>);
  if (i === 1) return (
    <svg width="220" height="220" viewBox="0 0 220 220">
      <rect x="22" y="112" width="80" height="80" rx="16" fill={C.navy} />
      <rect x="118" y="112" width="80" height="80" rx="16" fill={col} />
      <rect x="70" y={(22 + 90 * (1 - E(m, 0, 1, ease.out))).toFixed(1)} width="80" height="80" rx="16" fill={C.cyan} opacity={clamp(m * 3)} />
    </svg>);
  return (
    <svg width="220" height="220" viewBox="0 0 220 220" style={{ transform: `rotate(${(m * 360).toFixed(2)}deg)` }}>
      <path d="M180 110 A70 70 0 1 1 146 50" fill="none" stroke={col} strokeWidth={sw} strokeLinecap="round" />
      <path d="M118 44 L152 50 L142 84" fill="none" stroke={col} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
    </svg>);
};

export const S12: Scene = ({ t }) => {
  const f1 = E(t, AT[0], AT[1] - AT[0], ease.smooth) * 0.5, f2 = E(t, AT[1], AT[2] - AT[1], ease.smooth) * 0.5;
  const fill = t < AT[1] ? f1 : 0.5 + f2;
  return (
    <Stage t={t} tint={C.cyan} tint2={C.mint}>
      <Words t={t} t0={-0.15} text={"Built together.\nBuilt to be run."} size={72} y={135} stagger={0.12} hi={{ together: GRAD.brand, run: GRAD.growth }} />
      {CX.map((x, i) => {
        const appear = S(t, -0.15 + i * 0.12), a = AT[i];
        const lift = S(t, a, { damping: 14 }), chk = S(t, a + 0.15, { damping: 9 }), m = E(t, a, 0.7, ease.inOut);
        const on = t >= a;
        return (
          <div key={i} style={{ position: "absolute", left: x - CW / 2, top: CT, width: CW, height: CH, borderRadius: 40, background: C.white, opacity: clamp(appear * 1.5),
            transform: `translate3d(0, ${((1 - appear) * 90 - lift * 22).toFixed(2)}px, 0) scale(${mix(0.88, 1, appear).toFixed(4)})`, willChange: "transform",
            border: `3px solid ${on ? ACC[i] : "rgba(41,58,81,.08)"}`, boxShadow: on ? `0 30px 70px ${ACC[i]}55` : SHADOW.card }}>
            <div style={{ position: "absolute", left: 0, right: 0, top: 70, display: "flex", justifyContent: "center" }}><Icon i={i} m={m} col={ACC[i]} /></div>
            <div style={{ position: "absolute", left: 0, right: 0, top: 360, textAlign: "center", fontFamily: FONT, fontWeight: 700, fontSize: 48, color: C.navy, letterSpacing: -1 }}>{NAMES[i]}</div>
            <div style={{ position: "absolute", right: 24, top: 24, width: 56, height: 56, borderRadius: "50%", background: C.green, transform: `scale(${on ? chk : 0})`, willChange: "transform" }}>
              <svg width="56" height="56" viewBox="0 0 56 56"><path d="M15 29 L25 39 L42 18" fill="none" stroke="#fff" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="50" strokeDashoffset={50 * (1 - E(t, a + 0.1, 0.4, ease.out))} /></svg>
            </div>
          </div>
        );
      })}
      <div style={{ position: "absolute", left: LX0, top: LY - 7, width: LX1 - LX0, height: 14, borderRadius: 7, background: "rgba(41,58,81,.10)", opacity: clamp(S(t, 0.2) * 2) }}>
        <div style={{ width: "100%", height: "100%", borderRadius: 7, background: GRAD.brand, transform: `scaleX(${fill.toFixed(4)})`, transformOrigin: "left", willChange: "transform" }} />
      </div>
      {(() => { const p0 = S(t, 2.8, { damping: 14 }); return (
        <div style={{ position: "absolute", left: 0, right: 0, top: 930, height: 70, display: "flex", alignItems: "center", justifyContent: "center", gap: 22 }}>
          <span style={{ fontFamily: FONT, fontWeight: 600, fontSize: 36, color: C.sub, opacity: clamp(p0 * 2), transform: `translate3d(0, ${(1 - p0) * 30}px, 0)`, marginRight: 8 }}>After we deliver</span>
          {["Hosting", "Maintenance", "Growth"].map((w, i) => {
            const p = S(t, 2.85 + i * 0.12, { damping: 12 });
            return <div key={w} style={{ transform: `translate3d(0, ${(1 - p) * 40}px, 0) scale(${mix(0.5, 1, p)})`, willChange: "transform", opacity: clamp(p * 2) }}>
              <Chip text={w} size={36} color={C.navy} bg={[C.cyanSoft, "#E8EEFF", "#E2F8F1"][i]} style={{ border: `2.5px solid ${ACC[i]}`, boxShadow: SHADOW.soft }} />
            </div>;
          })}
        </div>); })()}
    </Stage>
  );
};

// ---------------- S14 ----------------
const BTN_Y = 745, BTN_W = 1000, BTN_H = 140;
export const S14: Scene = ({ t }) => {
  const tile = S(t, -0.15, { damping: 12, stiffness: 150 });
  const btn = S(t, 0.9, { damping: 12 });
  const fillIn = E(t, 1.1, 0.95, ease.smooth);
  const press = pressAt(t, 2.0);
  const wave = E(t, 2.11, 0.95, ease.smooth);
  const check = E(t, 2.6, 0.85, ease.inOut);
  const line = "We build the systems your business runs on, with you.";
  const n = Math.floor(line.length * E(t, 0.9, 1.1, (v) => v));
  return (
    <Stage t={t} tint={C.cyan} tint2={C.violet}>
      <KBTile x={960} y={170} size={190} style={{ transform: `scale(${tile})`, opacity: clamp(tile * 2) }} />
      <Words t={t} t0={0.0} text="Your tech partner." size={150} y={400} maxW={1800} stagger={0.5} hi={{ tech: GRAD.brand, partner: GRAD.brand }} />
      <div style={{ position: "absolute", left: 960, top: 520, width: 1500, textAlign: "center", transform: "translate(-50%,-50%)", fontFamily: FONT, fontWeight: 500, fontSize: 38, color: C.sub, letterSpacing: -0.5 }}>
        {line.slice(0, n)}<span style={{ opacity: 0 }}>{line.slice(n)}</span>
      </div>
      {/* the CTA stays one clean pill to the last frame: a gradient sweep fills it, the click sends a mint wave across it and a check draws on beside the label */}
      <div style={{ position: "absolute", left: 960 - BTN_W / 2, top: BTN_Y - BTN_H / 2, width: BTN_W, height: BTN_H, borderRadius: BTN_H / 2, background: C.navy, overflow: "hidden",
        transform: `scale(${mix(0.7, 1, btn) * (1 - 0.05 * press) * (1 + 0.035 * Math.sin(Math.PI * clamp((t - 2.2) / 0.55)))})`, opacity: clamp(btn * 2), boxShadow: `0 ${16 - 8 * press}px 40px rgba(56,200,255,.4)` }}>
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${fillIn * 100}%`, background: GRAD.brand }} />
        <div style={{ position: "absolute", left: BTN_W / 2 - 40 - BTN_W * 0.56 * wave, top: BTN_H / 2 - 40 - BTN_W * 0.56 * wave, width: 80 + BTN_W * 1.12 * wave, height: 80 + BTN_W * 1.12 * wave, borderRadius: "50%", background: GRAD.growth, opacity: wave > 0 ? 1 : 0 }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 700, fontSize: 50, color: "#fff", whiteSpace: "nowrap" }}>
          <span>Book a Free Discovery Call</span>
          <svg width={86 * clamp(check * 2.5)} height="70" viewBox="-10 0 76 56" style={{ marginLeft: 6 * clamp(check * 2.5), overflow: "visible" }}>
            <circle cx="34" cy="28" r={26 * clamp(check * 2.5)} fill="#fff" />
            <path d="M21 29 L31 39 L48 18" fill="none" stroke={C.green} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="50" strokeDashoffset={50 * (1 - clamp((check - 0.3) / 0.7))} />
          </svg>
        </div>
      </div>
      <Ripple t={t} c={2.0} x={960} y={BTN_Y} r={260} />
    </Stage>
  );
};
