// Group A: S1 the hook (headline, K.B tile, hand click) and S2 the three pillars.
import React from "react";
import { C, E, FONT, GRAD, KBTile, Ripple, S, SHADOW, Stage, Words, clamp, drift, ease, mix, pressAt, rnd, Win } from "../kit";
import type { Group, Scene } from "../types";

// ---------- shared: floating glass shapes keeping the frame alive ----------
const TINTS = [C.cyan, C.indigo, C.violet, C.mint, C.amber, C.coral];
const Floaters: React.FC<{ t: number; n?: number; seed?: number; arrive?: number }> = ({ t, n = 14, seed = 0, arrive = -0.7 }) => (
  <>
    {Array.from({ length: n }).map((_, i) => {
      const k = i + seed * 31, tint = TINTS[Math.floor(rnd(k + 2) * TINTS.length)];
      const x = 120 + rnd(k) * 1680 + drift(t, 3 + rnd(k + 5) * 3, 70, k), y = 100 + rnd(k + 1) * 880 + drift(t, 3.5 + rnd(k + 6) * 3, 60, k * 2);
      const s = 26 + rnd(k + 3) * 70, sq = rnd(k + 4) > 0.55, p = S(t, arrive + i * 0.05);
      return (
        <div key={i} style={{ position: "absolute", left: x - s / 2, top: y - s / 2, width: s, height: s, borderRadius: sq ? s * 0.28 : "50%", transform: `scale(${p}) rotate(${t * (30 + rnd(k + 7) * 30) * (i % 2 ? 1 : -1)}deg)`,
          background: sq ? `linear-gradient(135deg, ${tint}55, rgba(255,255,255,.7))` : `radial-gradient(circle at 30% 30%, #fff, ${tint}66)`, border: "1.5px solid rgba(255,255,255,.9)", boxShadow: `0 12px 30px ${tint}30`, opacity: 0.85 }} />
      );
    })}
  </>
);

// ---------- S1 ----------
const TX = 960, TY = 470, CLICK1 = 3.7;
const S1: Scene = ({ t, dur }) => {
  const cam = 1 + 0.04 * clamp((t + 0.3) / (dur + 0.6));
  const tp = S(t, 2.45, { damping: 11, stiffness: 150 }), press = pressAt(t, CLICK1);
  const idle = 1 + 0.012 * Math.sin(t * 2.4);
  const breathe = 0.5 + 0.5 * Math.sin(t * 3);
  const tag = S(t, 2.9), tagOut = 0;
  return (
    <Stage t={t} tint={C.cyan} tint2={C.violet}>
      <div style={{ position: "absolute", inset: 0, transform: `scale(${cam}) translate(${drift(t, 8, 8)}px, ${drift(t, 7, 5, 1)}px)` }}>
        <Floaters t={t} n={20} />
        <Words t={t} t0={0} text={"The technical team\nyou don't have to hire yet."} size={104} y={500} hi={{ technical: GRAD.brand, team: GRAD.brand }} out={2.2} maxW={1700} />
        {t > 2.3 && (
          <>
            {[0, 1].map((r) => {
              const ph = (t * 0.7 + r * 0.5) % 1;
              return <div key={r} style={{ position: "absolute", left: TX - 180 - 120 * ph, top: TY - 180 - 120 * ph, width: 360 + 240 * ph, height: 360 + 240 * ph, borderRadius: "50%", border: `3px solid ${C.cyan}`, opacity: 0.35 * (1 - ph) * tp }} />;
            })}
            <div style={{ position: "absolute", left: TX - 260, top: TY - 260, width: 520, height: 520, borderRadius: "50%", background: `radial-gradient(circle, ${C.cyan}${breathe > 0.5 ? "55" : "3A"}, transparent 66%)`, opacity: tp, transform: `scale(${0.9 + 0.12 * breathe})` }} />
            <KBTile x={TX} y={TY} size={280} style={{ transform: `scale(${tp * idle * (1 - 0.07 * press)})`, opacity: clamp(tp * 3), boxShadow: `0 ${30 - 18 * press}px ${70 - 30 * press}px rgba(41,58,81,.28)` }} />
            <div style={{ position: "absolute", left: TX, top: TY + 215, transform: `translate(-50%,-50%) translateY(${(1 - tag) * 26}px)`, opacity: clamp(tag * 1.5) * (1 - tagOut), fontFamily: FONT, fontWeight: 700, fontSize: 30, letterSpacing: 9, color: C.navy, whiteSpace: "nowrap" }}>YOUR TECH PARTNER</div>
            <Ripple t={t} c={CLICK1} x={TX} y={TY} r={260} />
            <Ripple t={t - 0.12} c={CLICK1} x={TX} y={TY} r={180} color={C.indigo} />
          </>
        )}
      </div>
    </Stage>
  );
};

// ---------- S2 ----------
const CW = 500, CH = 560, CY = 690, CLICK2 = 3.3;
const bump = (t: number, a: number, b: number) => E(t, a, 0.35, ease.out) * (1 - E(t, b, 0.4, ease.inOut));

const IllusAI: React.FC<{ t: number }> = ({ t }) => {
  const N = [[70, 210], [190, 80], [210, 230], [330, 120], [400, 220]];
  const L = [[0, 1], [0, 2], [1, 3], [2, 3], [3, 4], [2, 4]];
  const sp = 0.8 + 0.2 * Math.sin(t * 5);
  return (
    <svg width={470} height={300} viewBox="0 0 470 300">
      <defs><linearGradient id="gAI" x1="0" x2="1"><stop offset="0" stopColor={C.cyan} /><stop offset="1" stopColor={C.violet} /></linearGradient></defs>
      {L.map(([a, b], i) => {
        const p = E(t, 0.1 + i * 0.1, 0.5), q = (t * 0.9 + i * 0.27) % 1;
        const [x1, y1] = N[a], [x2, y2] = N[b];
        return (<g key={i}><line x1={x1} y1={y1} x2={mix(x1, x2, p)} y2={mix(y1, y2, p)} stroke="url(#gAI)" strokeWidth={4} strokeLinecap="round" opacity={0.55} />
          {p >= 1 && <circle cx={mix(x1, x2, q)} cy={mix(y1, y2, q)} r={7} fill={C.violet} />}</g>);
      })}
      {N.map(([x, y], i) => {
        const p = S(t, i * 0.09 - 0.05), pulse = 1 + 0.1 * Math.sin(t * 4 + i * 1.7);
        return <circle key={i} cx={x} cy={y} r={(i === 2 ? 26 : 18) * p * pulse} fill="#fff" stroke="url(#gAI)" strokeWidth={6} />;
      })}
      <g transform={`translate(${N[2][0]} ${N[2][1]}) scale(${sp}) rotate(${t * 40})`}>
        <path d="M0 -17 C2 -5 5 -2 17 0 C5 2 2 5 0 17 C-2 5 -5 2 -17 0 C-5 -2 -2 -5 0 -17Z" fill="url(#gAI)" />
      </g>
      <g transform={`translate(${N[3][0] + 36} ${N[3][1] - 40}) scale(${0.6 + 0.3 * Math.sin(t * 5 + 2)})`}><path d="M0 -12 C1 -3 3 -1 12 0 C3 1 1 3 0 12 C-1 3 -3 1 -12 0 C-3 -1 -1 -3 0 -12Z" fill={C.cyan} /></g>
    </svg>
  );
};

const IllusDev: React.FC<{ t: number }> = ({ t }) => {
  const rows: [string, number, string][][] = [
    [["#7C6CFF", 70, "const"], ["#38C8FF", 110, "app"], ["#FFB547", 40, "="]],
    [["#FFFFFF", 40, ""], ["#4F7BFF", 150, "build"], ["#22C7A0", 70, ""]],
    [["#FFFFFF", 40, ""], ["#38C8FF", 90, ""], ["#FF7A66", 120, ""]],
    [["#7C6CFF", 60, ""], ["#22C7A0", 160, ""]],
  ];
  const caretOn = Math.floor(t * 2.4) % 2 === 0;
  return (
    <div style={{ position: "relative", width: 470, height: 300 }}>
      <Win x={25} y={12} w={420} h={270} dark bar={40} style={{ boxShadow: "0 18px 40px rgba(41,58,81,.25)" }}>
        <div style={{ position: "absolute", left: 24, top: 22, width: 372 }}>
          {rows.map((r, i) => {
            const prog = E(t, 0.15 + i * 0.32, 0.45);
            const total = r.reduce((a, s) => a + s[1] + 10, 0);
            const w = total * prog;
            let used = 0;
            return (
              <div key={i} style={{ position: "relative", height: 40, display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 24, fontFamily: FONT, fontSize: 15, color: "rgba(255,255,255,.35)", fontWeight: 600 }}>{i + 1}</div>
                {r.map((s, j) => {
                  const start = used; used += s[1] + 10;
                  const vis = clamp((w - start) / (s[1] + 10));
                  return <div key={j} style={{ width: s[1] * vis, height: 14, borderRadius: 7, background: s[0], opacity: 0.9, flexShrink: 0, transform: `scaleY(${1 + (j === 1 ? 0.15 * Math.sin(t * 3 + i) : 0)})` }} />;
                })}
                {prog > 0 && prog < 1 && <div style={{ width: 3, height: 24, background: C.cyan }} />}
                {i === rows.length - 1 && prog >= 1 && caretOn && <div style={{ width: 3, height: 24, background: C.cyan }} />}
              </div>
            );
          })}
        </div>
      </Win>
      <div style={{ position: "absolute", right: 6, top: -4, transform: `scale(${S(t, 0.9)}) rotate(${drift(t, 3, 4)}deg)`, fontFamily: "Menlo, monospace", fontWeight: 800, fontSize: 64, background: GRAD.dev, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{"{ }"}</div>
    </div>
  );
};

const IllusGrowth: React.FC<{ t: number }> = ({ t }) => {
  const pts = [[40, 240], [120, 200], [200, 215], [290, 130], [370, 100], [440, 40]];
  const d = pts.map((p, i) => `${i ? "L" : "M"}${p[0]} ${p[1]}`).join(" ");
  const draw = E(t, 0.25, 1.1);
  const idx = draw * (pts.length - 1), i0 = Math.min(pts.length - 2, Math.floor(idx)), f = idx - i0;
  const mx = mix(pts[i0][0], pts[i0 + 1][0], f), my = mix(pts[i0][1], pts[i0 + 1][1], f);
  const mgx = mx - 28 + drift(t, 2.4, 5), mgy = my + 10 + drift(t, 2.9, 5, 1);
  return (
    <svg width={470} height={300} viewBox="0 0 470 300">
      <defs><linearGradient id="gGr" x1="0" x2="1"><stop offset="0" stopColor={C.mint} /><stop offset="1" stopColor={C.cyan} /></linearGradient></defs>
      {[0, 1, 2, 3].map((i) => <line key={i} x1={20} x2={450} y1={50 + i * 65} y2={50 + i * 65} stroke={C.line} strokeWidth={2} />)}
      {pts.map(([x], i) => { const h = (255 - pts[i][1]) * 0.55 * S(t, 0.05 + i * 0.08), br = 1 + 0.04 * Math.sin(t * 3 + i);
        return <rect key={i} x={x - 18} y={265 - h * br} width={36} height={h * br} rx={9} fill="url(#gGr)" opacity={0.28} />; })}
      <path d={d} pathLength={1} fill="none" stroke="url(#gGr)" strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={1} strokeDashoffset={1 - draw} />
      {draw > 0.02 && <circle cx={mx} cy={my} r={11} fill="#fff" stroke={C.mint} strokeWidth={5} />}
      <g transform={`translate(${mgx} ${mgy}) scale(${S(t, 0.5)})`}>
        <circle cx={0} cy={0} r={34} fill="rgba(255,255,255,.55)" stroke={C.navy} strokeWidth={7} />
        <line x1={25} y1={25} x2={52} y2={52} stroke={C.navy} strokeWidth={10} strokeLinecap="round" />
        <path d="M-14 -12 A22 22 0 0 1 8 -18" fill="none" stroke="#fff" strokeWidth={5} strokeLinecap="round" />
      </g>
    </svg>
  );
};

const PILLARS = [
  { name: "AI, Agents & Automation", grad: GRAD.ai, c: C.violet, x: 360, Illus: IllusAI },
  { name: "Software Development", grad: GRAD.dev, c: C.indigo, x: 960, Illus: IllusDev },
  { name: "Growth Technology", grad: GRAD.growth, c: C.mint, x: 1560, Illus: IllusGrowth },
];

const S2: Scene = ({ t, dur }) => {
  const cam = 1 + 0.035 * clamp((t + 0.3) / (dur + 0.6));
  const hov = [0.7 * E(t, 2.8, 0.4, ease.out), bump(t, 1.75, 2.45), bump(t, 0.95, 1.7)];
  const hdr = S(t, -0.1), clickScale = E(t, CLICK2 + 0.2, 0.9, ease.inOut);
  return (
    <Stage t={t} tint={C.violet} tint2={C.mint} grid>
      <div style={{ position: "absolute", inset: 0, transform: `scale(${cam}) translate(${drift(t, 7, 6)}px, ${drift(t, 9, 4, 2)}px)` }}>
        <Floaters t={t} n={9} seed={4} arrive={0} />
        <KBTile x={960} y={150} size={110} style={{ transform: `scale(${hdr}) translateY(${drift(t, 4, 3)}px)` }} />
        <div style={{ position: "absolute", left: 960, top: 262, transform: `translate(-50%,-50%) translateY(${(1 - S(t, 0.05)) * 20}px)`, opacity: clamp(S(t, 0.05) * 1.5), fontFamily: FONT, fontWeight: 600, fontSize: 36, letterSpacing: -0.5, color: C.navy, whiteSpace: "nowrap" }}>One partner. Three pillars.</div>
        {PILLARS.map((p, i) => {
          const t0 = 0.12 + i * 0.16, a = S(t, t0, { damping: 15, stiffness: 120 }), settle = 1 - a;
          const side = i - 1, h = hov[i];
          const isClick = i === 0;
          const press = isClick ? pressAt(t, CLICK2) : 0;
          const sc = mix(0.55, 1, a) * (1 + 0.035 * h) * (isClick ? (1 - 0.04 * press) * (1 + 0.55 * clickScale) : 1);
          const tx = (960 - p.x) * settle * 0.9;
          const ty = settle * 220 + (side !== 0 ? 22 : 0) * (1 - Math.min(1, a)) - 18 * h + drift(t, 3.6 + i * 0.5, 7, i * 1.3);
          const ry = side * -14 * settle + drift(t, 5, 1.6, i) , rx = 14 * settle;
          const tt = Math.max(0, t - t0);
          return (
            <div key={i} style={{ position: "absolute", left: p.x - CW / 2, top: CY - CH / 2, width: CW, height: CH, perspective: 1400, zIndex: isClick ? 3 : 1, opacity: clamp(a * 2.2) * (isClick ? 1 : 1 - 0.5 * clickScale) }}>
              <div style={{ width: "100%", height: "100%", borderRadius: 38, background: "linear-gradient(160deg, rgba(255,255,255,.98), rgba(255,255,255,.82))", border: "2px solid rgba(255,255,255,.95)",
                boxShadow: `${SHADOW.card}, 0 0 ${60 * h + 40 * (isClick ? press : 0)}px ${p.c}${h > 0.05 || press > 0.05 ? "55" : "00"}`, overflow: "hidden", position: "relative",
                transform: `translate(${tx}px, ${ty}px) rotateY(${ry}deg) rotateX(${rx}deg) scale(${sc})`, transformOrigin: "50% 50%" }}>
                <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 360, background: `radial-gradient(circle at 50% 30%, ${p.c}1F, transparent 70%)` }} />
                <div style={{ position: "absolute", left: 15, top: 38 }}><p.Illus t={tt} /></div>
                <div style={{ position: "absolute", left: 0, right: 0, top: 388, textAlign: "center", padding: "0 30px", fontFamily: FONT, fontWeight: 800, fontSize: 40, lineHeight: 1.12, letterSpacing: -1, color: C.navy }}>{p.name}</div>
                <div style={{ position: "absolute", left: 60, right: 60, bottom: 38, height: 10, borderRadius: 5, background: p.grad, opacity: 0.95, transformOrigin: "left", transform: `scaleX(${E(t, t0 + 0.3, 0.6, ease.out)})` }} />
                <div style={{ position: "absolute", top: 0, bottom: 0, width: 140, left: -200 + ((t * 420 + i * 300) % 900), background: "linear-gradient(100deg, transparent, rgba(255,255,255,.55), transparent)", transform: "skewX(-18deg)" }} />
              </div>
            </div>
          );
        })}
        <Ripple t={t} c={CLICK2} x={360} y={640} r={200} color={C.violet} />
      </div>
    </Stage>
  );
};

export const GROUP: Group = {
  scenes: { S1, S2 },
  hand: {
    S1: [{ at: 2.3, x: 2150, y: 1300 }, { at: CLICK1, x: TX, y: TY, click: true }],
    S2: [{ at: 1.4, x: 1560, y: 640 }, { at: 2.2, x: 960, y: 640 }, { at: CLICK2, x: 360, y: 640, click: true }],
  },
  sfx: {
    S1: [{ t: 0.1, kind: "whoosh", note: "headline words rise" }, { t: 2.45, kind: "pop", note: "K.B tile springs in" }, { t: 3.81, kind: "click", note: "hand clicks the tile" }, { t: 3.9, kind: "whoosh", note: "iris opens" }],
    S2: [{ t: 0.15, kind: "pop", note: "first card" }, { t: 0.31, kind: "pop", note: "second card" }, { t: 0.47, kind: "pop", note: "third card" }, { t: 1.8, kind: "tick", note: "hover card 3" }, { t: 2.5, kind: "tick", note: "hover card 2" }, { t: 3.41, kind: "click", note: "click card 1" }, { t: 3.6, kind: "whoosh", note: "card scales toward viewer" }],
  },
};
