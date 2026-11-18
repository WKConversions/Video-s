// Group E: the close of the film. S12 how K.B works, S13 proof on a 3D map, S14 the end card.
import React from "react";
import { C, E, FONT, GRAD, KBTile, S, SHADOW, Stage, Words, Btn, Chip, Ripple, clamp, drift, ease, mix, pressAt, rnd } from "../kit";
import type { Group, Scene } from "../types";

// ---------------- S12: Diagnose, Build, Run ----------------
const TX = [480, 960, 1440], TRACK_Y = 800, TILE_Y = 585;
const ACC = [C.cyan, C.indigo, C.mint];
const NAMES = ["Diagnose", "Build", "Run"];

const IconScan: React.FC<{ t: number; c: string }> = ({ t, c }) => {
  const a = t * 2.4, mx = 6 * Math.cos(a), my = 5 * Math.sin(a * 1.3);
  return (
    <svg width="96" height="96" viewBox="0 0 96 96">
      <rect x="14" y="20" width="50" height="8" rx="4" fill={c} opacity=".25" /><rect x="14" y="36" width="36" height="8" rx="4" fill={c} opacity=".25" /><rect x="14" y="52" width="44" height="8" rx="4" fill={c} opacity=".25" />
      <g transform={`translate(${mx},${my})`}>
        <circle cx="48" cy="44" r="19" fill="rgba(255,255,255,.55)" stroke={c} strokeWidth="6" />
        <line x1="62" y1="58" x2="78" y2="74" stroke={c} strokeWidth="8" strokeLinecap="round" />
      </g>
    </svg>
  );
};
const IconBlocks: React.FC<{ t: number; c: string }> = ({ t, c }) => {
  const ph = (t * 0.9) % 1.6;
  const drop = (i: number) => { const p = E(ph, i * 0.35, 0.4, ease.out); return (1 - p) * -34; };
  const op = (i: number) => clamp((ph - i * 0.35) / 0.12) * (ph > 1.45 ? clamp((1.6 - ph) / 0.15) : 1);
  return (
    <svg width="96" height="96" viewBox="0 0 96 96">
      <rect x="14" y="62" width="30" height="22" rx="6" fill={c} opacity={op(0)} transform={`translate(0,${drop(0)})`} />
      <rect x="50" y="62" width="30" height="22" rx="6" fill={c} opacity={op(1) * 0.7} transform={`translate(0,${drop(1)})`} />
      <rect x="32" y="36" width="30" height="22" rx="6" fill={c} opacity={op(2) * 0.45} transform={`translate(0,${drop(2)})`} />
    </svg>
  );
};
const IconLoop: React.FC<{ t: number; c: string }> = ({ t, c }) => (
  <svg width="96" height="96" viewBox="0 0 96 96">
    <g transform={`rotate(${t * 150} 48 48)`}>
      <path d="M 48 18 A 30 30 0 1 1 20 56" fill="none" stroke={c} strokeWidth="8" strokeLinecap="round" />
      <path d="M 8 50 L 20 62 L 34 50 Z" fill={c} transform="rotate(-20 20 56)" />
    </g>
    <circle cx="48" cy="48" r="7" fill={c} opacity=".6" />
  </svg>
);

const S12: Scene = ({ t }) => {
  const lift = E(t, 1.2, 0.7, ease.out);
  const trackP = E(t, 1.15, 0.7, ease.out);
  const knobIn = S(t, 1.4);
  const knobX = TX[0] + (TX[2] - TX[0]) * E(t, 1.95, 0.75);
  const press = pressAt(t, 1.7);
  const cam = 1 + 0.03 * E(t, -0.3, 4.2, ease.smooth);
  return (
    <Stage t={t} tint={C.cyan} tint2={C.mint}>
      <div style={{ position: "absolute", inset: 0, transform: `scale(${cam}) translate(${drift(t, 7, 6)}px, ${drift(t, 9, 4, 1)}px)` }}>
        <Words t={t} t0={-0.15} text={"Built together.\nBuilt to be run."} size={mix(100, 74, lift)} y={mix(540, 190, lift)} hi={{ together: GRAD.brand, run: GRAD.growth }} />
        {/* track */}
        <div style={{ position: "absolute", left: TX[0], top: TRACK_Y - 6, width: (TX[2] - TX[0]) * trackP, height: 12, borderRadius: 6, background: "rgba(41,58,81,.12)" }} />
        <div style={{ position: "absolute", left: TX[0], top: TRACK_Y - 6, width: Math.max(0, knobX - TX[0]) * trackP, height: 12, borderRadius: 6, background: "linear-gradient(90deg,#38C8FF,#4F7BFF 50%,#22C7A0)", boxShadow: "0 0 18px rgba(56,200,255,.5)" }} />
        {TX.map((x, i) => {
          const lit = i === 0 ? S(t, 1.7) : clamp((knobX - x + 60) / 120);
          const lp = i === 0 ? lit : E(lit, 0, 1, ease.out);
          const appear = S(t, 1.25 + i * 0.14);
          const Ic = [IconScan, IconBlocks, IconLoop][i];
          return (
            <React.Fragment key={i}>
              <div style={{ position: "absolute", left: x - 9, top: TRACK_Y - 9, width: 18, height: 18, borderRadius: "50%", background: lp > 0.5 ? ACC[i] : C.card, opacity: trackP }} />
              <div style={{ position: "absolute", left: x - 165, top: TILE_Y - 115, width: 330, height: 230, borderRadius: 40, background: C.white, opacity: clamp(appear * 1.5),
                transform: `translateY(${(1 - appear) * 70 + drift(t, 4 + i, 5, i) - lp * 10}px) scale(${mix(0.85, 1, appear) * (1 + 0.05 * lp)})`,
                boxShadow: lp > 0.05 ? `0 30px 70px ${ACC[i]}55, 0 4px 12px rgba(41,58,81,.06)` : SHADOW.card, border: `3px solid ${lp > 0.05 ? ACC[i] : "rgba(41,58,81,.08)"}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14 }}>
                <div style={{ width: 120, height: 120, borderRadius: 34, background: `${ACC[i]}${lp > 0.05 ? "2E" : "18"}`, display: "flex", alignItems: "center", justifyContent: "center" }}><Ic t={t} c={ACC[i]} /></div>
                <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 38, color: C.navy, letterSpacing: -1 }}>{NAMES[i]}</div>
              </div>
            </React.Fragment>
          );
        })}
        {/* knob */}
        <div style={{ position: "absolute", left: knobX - 34, top: TRACK_Y - 34, width: 68, height: 68, borderRadius: "50%", background: C.white, border: `7px solid ${C.cyan}`, boxShadow: `0 10px 26px rgba(56,200,255,.5)`,
          transform: `scale(${knobIn * (1 - 0.14 * press)})` }} />
        <Ripple t={t} c={1.7} x={TX[0]} y={TRACK_Y} />
        {/* after-we-deliver chips under Run */}
        <div style={{ position: "absolute", left: TX[2], top: 880, transform: "translateX(-50%)", opacity: S(t, 2.7), fontFamily: FONT, fontWeight: 700, fontSize: 22, letterSpacing: 4, color: C.mint, whiteSpace: "nowrap" }}>WE STAY ON</div>
        {["Hosting", "Maintenance", "Growth"].map((w, i) => {
          const p = S(t, 2.75 + i * 0.15, { damping: 12 });
          const cx = TX[2] + (i - 1) * 215;
          return <div key={w} style={{ position: "absolute", left: cx, top: 960, transform: `translate(-50%,-50%) translateY(${(1 - p) * 40}px) scale(${mix(0.5, 1, p) * (1 + 0.02 * Math.sin(t * 3 + i))})`, opacity: clamp(p * 2) }}>
            <Chip text={w} size={28} color={C.navy} bg={[C.cyanSoft, "#E8EEFF", "#E2F8F1"][i]} style={{ border: `2px solid ${ACC[i]}`, boxShadow: SHADOW.soft }} />
          </div>;
        })}
      </div>
    </Stage>
  );
};

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

// ---------------- S14: end card ----------------
const BTN_Y = 810;
const S14: Scene = ({ t }) => {
  const tile = S(t, -0.15, { damping: 12, stiffness: 150 });
  const btn = S(t, 1.0, { damping: 11 });
  const press = pressAt(t, 2.0);
  const rel = t > 2.37 ? 0.035 * Math.exp(-(t - 2.37) * 7) * Math.sin((t - 2.37) * 28) : 0;
  const sheen = E(t, 1.5, 0.9, ease.smooth);
  const lineP = S(t, 0.95, { damping: 16 });
  const cam = 1 + 0.025 * E(t, -0.3, 3.9, ease.smooth);
  return (
    <Stage t={t} tint={C.cyan} tint2={C.violet}>
      <div style={{ position: "absolute", inset: 0, transform: `scale(${cam}) translateY(${drift(t, 8, 5)}px)` }}>
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} style={{ position: "absolute", left: 160 + rnd(i) * 1600 + drift(t, 5 + i, 18, i), top: 120 + rnd(i + 9) * 800 + drift(t, 6 + i * 0.7, 22, i * 2), width: 14 + rnd(i + 3) * 18, height: 14 + rnd(i + 3) * 18, borderRadius: "50%",
            background: [C.cyan, C.indigo, C.mint, C.violet][i % 4], opacity: 0.35 * clamp(S(t, 0.4 + i * 0.1)) }} />
        ))}
        <div style={{ position: "absolute", left: 960 - 260, top: 265 - 260, width: 520, height: 520, borderRadius: "50%", background: `radial-gradient(circle, ${C.cyan}${t > 0 ? "55" : "55"}, transparent 66%)`, transform: `scale(${(1 + 0.1 * Math.sin(t * 2.4)) * tile})` }} />
        <KBTile x={960} y={265} size={230} style={{ transform: `scale(${tile}) translateY(${drift(t, 4, 6)}px)`, opacity: clamp(tile * 2) }} />
        <Words t={t} t0={0.3} text="Your tech partner." size={110} y={540} hi={{ tech: GRAD.brand, partner: GRAD.brand }} />
        <div style={{ position: "absolute", left: 960, top: 645, width: 1400, textAlign: "center", transform: `translate(-50%,-50%) translateY(${(1 - lineP) * 30}px)`, opacity: clamp(lineP * 1.5), fontFamily: FONT, fontWeight: 500, fontSize: 34, color: C.sub }}>
          We build the systems your business runs on, with you.
        </div>
        <div style={{ position: "absolute", left: 960, top: BTN_Y, transform: `translate(-50%,-50%) scale(${mix(0.6, 1, btn) * (1 - 0.06 * press + rel)})`, opacity: clamp(btn * 2), filter: `brightness(${1 + 0.1 * press})` }}>
          <div style={{ position: "relative" }}>
            <Btn x={0} y={0} text="Book a Free Discovery Call" size={38} style={{ position: "relative", left: 0, top: 0, transform: "none", boxShadow: `0 ${16 - 8 * press}px 40px rgba(56,200,255,.45)` }} />
            <div style={{ position: "absolute", inset: 0, borderRadius: 999, overflow: "hidden", pointerEvents: "none" }}>
              <div style={{ position: "absolute", top: -20, bottom: -20, width: 120, left: `${mix(-20, 110, sheen)}%`, background: "linear-gradient(100deg, transparent, rgba(255,255,255,.65), transparent)", transform: "skewX(-20deg)" }} />
            </div>
          </div>
        </div>
        <Ripple t={t} c={2.0} x={960} y={BTN_Y} r={200} />
      </div>
    </Stage>
  );
};

export const GROUP: Group = {
  scenes: { S12, S13, S14 },
  hand: {
    S12: [
      { at: 1.7, x: TX[0], y: TRACK_Y, click: true },
      { at: 2.7, x: TX[2], y: TRACK_Y, early: 0, dur: 0.75 },
    ],
    S13: [],
    S14: [
      { at: 2.0, x: 960, y: BTN_Y, click: true },
      { at: 3.0, x: 1180, y: BTN_Y + 110 },
    ],
  },
  sfx: {
    S12: [
      { t: 0.1, kind: "whoosh", note: "headline words rise" },
      { t: 1.3, kind: "pop", note: "tiles arrive" },
      { t: 1.81, kind: "click", note: "knob grab" },
      { t: 2.0, kind: "slide", note: "knob drag" },
      { t: 2.8, kind: "pop", note: "chips cascade" },
      { t: 3.0, kind: "success", note: "Run reached" },
    ],
    S13: [
      { t: 0.3, kind: "pop", note: "pin drops" },
      { t: 0.6, kind: "tick", note: "counter 25" },
      { t: 0.95, kind: "tick", note: "counter 100+" },
    ],
    S14: [
      { t: 0.0, kind: "pop", note: "tile springs in" },
      { t: 1.0, kind: "pop", note: "button" },
      { t: 2.11, kind: "click", note: "book a call" },
      { t: 2.25, kind: "success" },
    ],
  },
};
