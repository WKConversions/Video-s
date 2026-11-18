// Group E: the close of the film. S12 how K.B works, S13 proof on a 3D map, S14 the end card.
import React from "react";
import { C, E, FONT, GRAD, S, SHADOW, Stage, clamp, drift, ease, mix } from "../kit";
import type { Group, Scene } from "../types";

import { S12, S14 } from "./E_end";

// ---------------- S13: 3D map and numbers ----------------
const LAND: string[] = [
  "90,520 130,480 230,470 300,490 310,540 270,590 210,620 150,610 100,580 80,550",
  "300,490 260,440 270,380 330,350 400,330 470,300 540,290 620,280 700,260 780,280 860,300 900,360 880,440 820,480 760,500 700,520 640,540 580,520 520,500 450,480 380,500 320,510",
  "470,500 520,510 560,560 600,620 620,680 590,690 560,640 520,590 480,540",
  "290,260 330,230 350,170 390,150 400,200 380,260 400,300 340,330 300,310",
  "230,250 260,230 275,270 245,290",
  "480,260 500,200 540,120 600,60 680,40 740,70 700,120 660,160 640,220 600,260 540,270",
  "640,540 700,520 760,500 790,560 760,620 700,640 670,600",
];
const PIN = { x: 212, y: 604 };

const Counter: React.FC<{ t: number; t0: number; to: number; plus?: boolean; label: string; x: number; y: number; accent: string }> = ({ t, t0, to, plus, label, x, y, accent }) => {
  const a = S(t, t0 - 0.1, { damping: 13 }), n = Math.round(to * clamp(S(t, t0 + 0.05, { damping: 18, stiffness: 120 })));
  const pop = S(t, t0 + 0.55, { damping: 8, stiffness: 260 });
  return (
    <div style={{ position: "absolute", left: x, top: y, width: 560, height: 250, transform: `translate(-50%,-50%) translateY(${(1 - a) * 80 + drift(t, 5, 6, x)}px) scale(${mix(0.88, 1, a)})`, opacity: clamp(a * 1.6), borderRadius: 44,
      background: "rgba(255,255,255,.72)", backdropFilter: "blur(24px)", border: "2px solid rgba(255,255,255,.95)", boxShadow: SHADOW.lift, padding: "34px 44px", boxSizing: "border-box" }}>
      <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 120, lineHeight: 1, letterSpacing: -4, background: accent, WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent", transform: `scale(${1 + 0.03 * Math.sin(pop * 3)})`, transformOrigin: "left center", paddingBottom: 10 }}>
        {n}{plus && n >= to ? "+" : ""}
      </div>
      <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 32, lineHeight: 1.25, color: C.sub, marginTop: 8 }}>{label}</div>
    </div>
  );
};

const S13: Scene = ({ t }) => {
  const rz = -6 + 10 * E(t, -0.3, 3, ease.smooth);
  const sc = 1.4 + 0.12 * E(t, -0.3, 3, ease.smooth);
  const drop = 520 * (1 - S(t, 0.25, { damping: 9, stiffness: 190 }));
  const pinA = clamp((t - 0.2) / 0.1);
  return (
    <Stage t={t} tint={C.cyan} tint2={C.mint}>
      <div style={{ position: "absolute", left: 800, top: 580, width: 0, height: 0, perspective: 1900 }}>
        <div style={{ position: "absolute", left: -500, top: -400, width: 1000, height: 800, transformStyle: "preserve-3d", transform: `scale(${sc}) rotateX(50deg) rotateZ(${rz}deg)` }}>
          <div style={{ position: "absolute", inset: -140, borderRadius: 60, background: "linear-gradient(160deg,#E4F2FB,#D6E9F6)", boxShadow: "0 80px 120px rgba(41,58,81,.25)" }} />
          <svg width="1000" height="800" viewBox="0 0 1000 800" style={{ position: "absolute", inset: 0, overflow: "visible" }}>
            <defs><pattern id="g" width="50" height="50" patternUnits="userSpaceOnUse" patternTransform={`translate(${(t * 8) % 50},0)`}><path d="M50 0H0V50" fill="none" stroke="#B9D3E6" strokeWidth="1.2" opacity=".7" /></pattern></defs>
            <rect x="-140" y="-140" width="1280" height="1080" fill="url(#g)" />
            {LAND.map((p, i) => <polygon key={i} points={p} fill="#FBFCFD" stroke="#CBD6DF" strokeWidth="4" strokeLinejoin="round" />)}
            {LAND.map((p, i) => <polygon key={"s" + i} points={p} fill="none" stroke="rgba(41,58,81,.06)" strokeWidth="14" strokeLinejoin="round" transform="translate(5,9)" />)}
            {[[PIN.x, PIN.y, 560, 330], [PIN.x, PIN.y, 760, 240], [PIN.x, PIN.y, 640, 520]].map(([x0, y0, x1, y1], i) => (
              <path key={i} d={`M ${x0} ${y0} Q ${(x0 + x1) / 2} ${Math.min(y0, y1) - 130} ${x1} ${y1}`} fill="none" stroke={C.cyan} strokeWidth="4" strokeDasharray="14 14" strokeDashoffset={-t * 60} opacity=".5" />
            ))}
            {[0, 1, 2].map((i) => {
              const p = ((t - 0.5 - i * 0.6) / 1.9) % 1, q = t - 0.5 - i * 0.6 < 0 ? 1 : p < 0 ? p + 1 : p;
              return <circle key={i} cx={PIN.x} cy={PIN.y} r={20 + q * 520} fill={`${C.cyan}${q < 0.15 ? "30" : "10"}`} stroke={C.cyan} strokeWidth={5 * (1 - q) + 1} opacity={q >= 1 ? 0 : (1 - q) * 0.9} />;
            })}
          </svg>
          <div style={{ position: "absolute", left: PIN.x, top: PIN.y, width: 0, height: 0, transformStyle: "preserve-3d", transform: `rotateZ(${-rz}deg) rotateX(-50deg) translateY(${-drop}px)`, opacity: pinA }}>
            <div style={{ position: "absolute", left: -52, top: -52, width: 104, height: 104, borderRadius: "50%", background: `radial-gradient(circle, ${C.cyan}77, transparent 70%)`, transform: `scale(${1 + 0.15 * Math.sin(t * 5)})` }} />
            <div style={{ position: "absolute", left: -6, top: -120, width: 12, height: 120, background: "linear-gradient(#38C8FF,#4F7BFF)", borderRadius: 6 }} />
            <div style={{ position: "absolute", left: -40, top: -170, width: 80, height: 80, borderRadius: "50%", background: GRAD.brand, border: "8px solid #fff", boxShadow: "0 0 40px rgba(56,200,255,.8), 0 12px 24px rgba(41,58,81,.3)", boxSizing: "border-box" }}>
              <div style={{ position: "absolute", inset: 18, borderRadius: "50%", background: "#fff" }} />
            </div>
          </div>
        </div>
      </div>
      <Counter t={t} t0={0.5} to={25} label="client projects completed" x={1480} y={360} accent={GRAD.brand} />
      <Counter t={t} t0={0.85} to={100} plus label="automations built and integrated" x={1480} y={680} accent={GRAD.growth} />
    </Stage>
  );
};


export const GROUP: Group = {
  scenes: { S12, S13, S14 },
  hand: {
    S12: [],
    S13: [],
    S14: [
      { at: 2.0, x: 960, y: 745, click: true },
    ],
  },
  sfx: {
    S12: [
      { t: 0.1, kind: "whoosh", note: "headline words rise" },
      { t: 0.2, kind: "pop", note: "cards deal in" },
      { t: 1.7, kind: "snap", note: "Diagnose done, Build takes over" },
      { t: 2.7, kind: "success", note: "Build done, Run takes over" },
      { t: 2.8, kind: "pop", note: "chips land" },
    ],
    S13: [
      { t: 0.3, kind: "pop", note: "pin drops" },
      { t: 0.6, kind: "tick", note: "counter 25" },
      { t: 0.95, kind: "tick", note: "counter 100+" },
    ],
    S14: [
      { t: 0.0, kind: "pop", note: "tile springs in" },
      { t: 0.3, kind: "whoosh", note: "words arrive" },
      { t: 1.0, kind: "slide", note: "button fill sweep" },
      { t: 2.11, kind: "click", note: "book a call" },
      { t: 2.5, kind: "success", note: "check draws on" },
    ],
  },
};
