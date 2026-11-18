// Group C: pillar 2, Software Development. S6 text, S7 code becomes a product, S8 a business dashboard comes alive.
import React from "react";
import { AbsoluteFill } from "remotion";
import { C, E, Eyebrow, FONT, GRAD, KBTile, Ripple, S, SHADOW, Stage, Win, Words, clamp, drift, ease, mix, pressAt } from "../kit";
import type { Group, HandKey, Scene, Sfx } from "../types";

const MONO = "'SF Mono', Menlo, Consolas, 'DejaVu Sans Mono', monospace";
const camAt = (t: number, total: number, k = 0.04) => 1 + k * clamp((t + 0.3) / total);
/** screen position of a point after a centred camera scale */
const camPt = (x: number, y: number, s: number) => ({ x: 960 + (x - 960) * s, y: 540 + (y - 540) * s });

// ======================= S6: TEXT =======================
const S6: Scene = ({ t }) => {
  const sub = S(t, 0.3);
  const caret = Math.floor(t * 2.4) % 2 === 0;
  const brk = (txt: string, x: number, y: number, ph: number, col: string, size: number) => {
    const p = S(t, 0.1 + ph * 0.1);
    return <div style={{ position: "absolute", left: x + drift(t, 5 + ph, 14, ph), top: y + drift(t, 6 + ph, 18, ph + 1), transform: `translate(-50%,-50%) scale(${p}) rotate(${drift(t, 7, 6, ph)}deg)`, opacity: 0.55 * p,
      fontFamily: MONO, fontWeight: 700, fontSize: size, color: col }}>{txt}</div>;
  };
  return (
    <Stage t={t} tint={C.indigo} tint2={C.cyan}>
      <AbsoluteFill style={{ transform: `scale(${camAt(t, 2.1, 0.035)})` }}>
        {brk("<", 330, 420, 0, C.indigo, 150)}
        {brk("/>", 1590, 640, 1, C.cyan, 150)}
        {brk("{ }", 1500, 270, 2, C.violet, 70)}
        {brk("</>", 400, 780, 3, C.mint, 64)}
        <Eyebrow t={t} t0={-0.15} text="PILLAR 02" y={285} color={C.indigo} />
        <Words t={t} t0={0} text={"Software\nDevelopment"} size={124} y={525} hi={{ Software: GRAD.dev }} stagger={0.09} />
        <div style={{ position: "absolute", left: 960, top: 775, transform: `translate(-50%,-50%) translateY(${(1 - sub) * 24}px)`, opacity: clamp(sub * 1.6), fontFamily: FONT, fontWeight: 500, fontSize: 38, color: C.sub, whiteSpace: "nowrap", display: "flex", alignItems: "center" }}>
          Web apps, mobile apps and business dashboards.
          <span style={{ display: "inline-block", width: 4, height: 44, marginLeft: 10, borderRadius: 2, background: C.indigo, opacity: caret ? 1 : 0 }} />
        </div>
      </AbsoluteFill>
    </Stage>
  );
};

// ======================= S7: CODE BECOMES A PRODUCT =======================
type Tok = [string, string];
const K = "#C792EA", F = "#82AAFF", ST = "#9CE37D", N = "#FFB86C", P = "#9FB3CC", CY = "#4DD8FF";
const CODE: Tok[][] = [
  [["import ", K], ["{ Page }", P], [" from ", K], ["\"./ui\"", ST]],
  [["import ", K], ["{ api }", P], [" from ", K], ["\"./data\"", ST]],
  [],
  [["export function ", K], ["App", F], ["() {", P]],
  [["  const ", K], ["items", CY], [" = ", P], ["api", F], [".load()", P]],
  [["  return (", P]],
  [["    <", P], ["Page", F], [" layout", N], ["=", P], ["\"fluid\"", ST], [">", P]],
  [["      <", P], ["Hero", F], [" cta", N], ["=", P], ["\"Start\"", ST], [" />", P]],
  [["      <", P], ["Cards", F], [" data", N], ["={", P], ["items", CY], ["} />", P]],
  [["    </", P], ["Page", F], [">", P]],
  [["  )", P]],
  [["}", P]],
];
const TOTAL_CH = CODE.reduce((a, l) => a + l.reduce((b, s) => b + s[0].length, 0), 0);

const Block: React.FC<{ t: number; t0: number; style: React.CSSProperties; children?: React.ReactNode }> = ({ t, t0, style, children }) => {
  const p = S(t, t0, { damping: 15, stiffness: 190 });
  return <div style={{ position: "absolute", opacity: clamp(p * 1.8), transform: `translateY(${(1 - p) * 46}px) scale(${mix(0.94, 1, p)})`, ...style }}>{children}</div>;
};
const Bar: React.FC<{ w: number; h?: number; bg?: string; style?: React.CSSProperties }> = ({ w, h = 16, bg = "rgba(41,58,81,.16)", style }) => <div style={{ width: w, height: h, borderRadius: h / 2, background: bg, ...style }} />;

const S7_DEPLOY = { x: 780, y: 274 };
const S7: Scene = ({ t }) => {
  const cam = camAt(t, 4.6, 0.045);
  const press = pressAt(t, 1.3);
  const chars = Math.max(0, Math.floor((t + 0.25) * 215));
  const caretOn = Math.floor(t * 2.6) % 2 === 0 || t < 1.2;
  const prog = E(t, 1.42, 0.8, ease.inOut), done = t > 2.25;
  const ex = E(t, 2.2, 0.95, ease.inOut);

  // code text
  let left = chars, caretLine = CODE.length - 1, acc = 0;
  for (let i = 0; i < CODE.length; i++) { const n = CODE[i].reduce((b, x) => b + x[0].length, 0); if (chars <= acc + n) { caretLine = i; break; } acc += n; }
  const lines = CODE.map((ln, li) => {
    const segs: React.ReactNode[] = [];
    const on = li === 0 || chars > CODE.slice(0, li).reduce((a, l) => a + l.reduce((b, x) => b + x[0].length, 0), 0) - 1;
    ln.forEach((s, si) => {
      if (left <= 0) return;
      const n = Math.min(left, s[0].length);
      segs.push(<span key={si} style={{ color: s[1], whiteSpace: "pre" }}>{s[0].slice(0, n)}</span>);
      left -= n;
    });
    return { segs, caret: li === caretLine, li, on };
  });

  const phoneP = S(t, 3.0, { damping: 16, stiffness: 130 });
  const brP = S(t, 2.25, { damping: 17, stiffness: 120 });

  return (
    <Stage t={t} tint={C.indigo} tint2={C.cyan}>
      <AbsoluteFill style={{ perspective: 2600, transform: `scale(${cam})` }}>
        {/* the editor: a dark window as an object on the bright stage */}
        <Win x={140} y={190} w={760} h={700} title="App.tsx" dark
          style={{ transform: `translateX(${-232 * ex + drift(t, 6, 6)}px) translateY(${drift(t, 5, 8)}px) scale(${1 - 0.3 * ex}) rotateY(${34 * ex}deg)`, opacity: 1 - 0.12 * ex, boxShadow: SHADOW.lift }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 64, borderBottom: "1px solid rgba(255,255,255,.08)", display: "flex", alignItems: "center", padding: "0 22px", gap: 12 }}>
            <div style={{ padding: "8px 18px", borderRadius: 10, background: "rgba(255,255,255,.1)", color: "#D7E3F4", fontFamily: MONO, fontSize: 18 }}>App.tsx</div>
            <div style={{ padding: "8px 18px", borderRadius: 10, color: "rgba(255,255,255,.4)", fontFamily: MONO, fontSize: 18 }}>ui.ts</div>
          </div>
          <Btn2 press={press} done={done} />
          {/* progress line */}
          <div style={{ position: "absolute", left: 0, top: 62, height: 3, width: `${prog * 100}%`, background: "linear-gradient(90deg,#4F7BFF,#38C8FF,#22C7A0)", boxShadow: "0 0 18px #38C8FF", opacity: prog > 0 && t < 2.6 ? 1 : 0 }} />
          {/* code */}
          <div style={{ position: "absolute", left: 0, top: 88, right: 0 }}>
            {lines.map((l) => (
              <div key={l.li} style={{ display: "flex", height: 44, alignItems: "center", fontFamily: MONO, fontSize: 24, opacity: l.on ? 1 : 0 }}>
                <div style={{ width: 70, textAlign: "right", paddingRight: 24, color: "rgba(255,255,255,.28)", fontSize: 20 }}>{l.li + 1}</div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  {l.segs}
                  {l.caret && <span style={{ display: "inline-block", width: 3, height: 30, marginLeft: 2, background: "#38C8FF", opacity: caretOn ? 1 : 0 }} />}
                </div>
              </div>
            ))}
          </div>
          <Ripple t={t} c={1.3} x={640} y={32} r={90} />
        </Win>

        {/* the browser: the live product assembles block by block */}
        <div style={{ position: "absolute", left: 600, top: 170, width: 900, height: 640, opacity: clamp(brP * 2), transform: `translateX(${(1 - brP) * 260 + drift(t, 7, 8, 1)}px) translateY(${(1 - brP) * 30 + drift(t, 6, 7)}px) scale(${mix(0.86, 1, brP)}) rotateY(${mix(-26, -9, brP) + drift(t, 8, 1.5)}deg)` }}>
          <Win x={0} y={0} w={900} h={640} style={{ boxShadow: SHADOW.lift }}>
            <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 0 }}>
              <div style={{ position: "absolute", left: 250, top: -40, width: 400, height: 28, borderRadius: 14, background: C.muted, display: "flex", alignItems: "center", paddingLeft: 14 }}><Bar w={150} h={8} /></div>
            </div>
            <Block t={t} t0={2.45} style={{ left: 30, top: 20, width: 840, height: 56, display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 40, height: 40, borderRadius: 9, background: C.navy }} />
              <div style={{ flex: 1 }} />
              <Bar w={70} /><Bar w={70} /><Bar w={70} />
              <div style={{ width: 96, height: 36, borderRadius: 18, background: C.cyan }} />
            </Block>
            <Block t={t} t0={2.6} style={{ left: 30, top: 96, width: 840, height: 250, borderRadius: 22, background: "linear-gradient(120deg,#E6F7FF,#EAEEFF)", border: `1px solid ${C.line}` }}>
              <Bar w={480} h={34} bg="rgba(41,58,81,.78)" style={{ position: "absolute", left: 44, top: 52 }} />
              <Bar w={330} h={34} bg={C.indigo} style={{ position: "absolute", left: 44, top: 100 }} />
              <Bar w={400} h={14} style={{ position: "absolute", left: 44, top: 156 }} />
              <div style={{ position: "absolute", left: 44, top: 186, width: 170, height: 46, borderRadius: 23, background: C.cyan, boxShadow: "0 12px 26px rgba(56,200,255,.4)", transform: `scale(${1 + 0.03 * Math.sin(t * 5)})` }} />
              <div style={{ position: "absolute", right: 36, top: 36, width: 250, height: 178, borderRadius: 18, background: GRAD.dev, opacity: 0.9, transform: `translateY(${drift(t, 4, 6)}px)` }} />
            </Block>
            {[0, 1, 2].map((i) => (
              <Block key={i} t={t} t0={2.85 + i * 0.12} style={{ left: 30 + i * 287, top: 370, width: 266, height: 190, borderRadius: 18, background: C.white, border: `1px solid ${C.line}`, boxShadow: SHADOW.soft }}>
                <div style={{ position: "absolute", left: 22, top: 22, width: 48, height: 48, borderRadius: 13, background: [C.indigo, C.cyan, C.mint][i] }} />
                <Bar w={150} h={16} bg="rgba(41,58,81,.7)" style={{ position: "absolute", left: 22, top: 94 }} />
                <Bar w={200} h={10} style={{ position: "absolute", left: 22, top: 126 }} />
                <Bar w={140} h={10} style={{ position: "absolute", left: 22, top: 148 }} />
              </Block>
            ))}
          </Win>
        </div>

        {/* the phone: the same product, re-flowed as an app */}
        <div style={{ position: "absolute", left: 1385, top: 290, width: 290, height: 600, opacity: clamp(phoneP * 2), transform: `translateX(${(1 - phoneP) * 420}px) translateY(${drift(t, 5, 12, 1)}px) rotateY(${mix(-30, -12, phoneP)}deg) rotateZ(${mix(5, 2, phoneP)}deg)`, borderRadius: 50, background: "#101826", padding: 11, boxShadow: "0 50px 100px rgba(41,58,81,.35), 0 8px 20px rgba(41,58,81,.2)" }}>
          <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: 40, background: C.white, overflow: "hidden" }}>
            <div style={{ position: "absolute", left: "50%", top: 10, width: 86, height: 24, borderRadius: 12, background: "#101826", transform: "translateX(-50%)", zIndex: 3 }} />
            <Block t={t} t0={3.15} style={{ left: 18, top: 52, width: 232, height: 34, display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: C.navy }} /><div style={{ flex: 1 }} /><Bar w={34} h={10} /><Bar w={34} h={10} />
            </Block>
            <Block t={t} t0={3.28} style={{ left: 18, top: 98, width: 232, height: 170, borderRadius: 20, background: "linear-gradient(140deg,#E6F7FF,#EAEEFF)" }}>
              <Bar w={150} h={20} bg="rgba(41,58,81,.78)" style={{ position: "absolute", left: 18, top: 24 }} />
              <Bar w={110} h={20} bg={C.indigo} style={{ position: "absolute", left: 18, top: 54 }} />
              <div style={{ position: "absolute", left: 18, top: 104, width: 110, height: 38, borderRadius: 19, background: C.cyan, boxShadow: "0 8px 18px rgba(56,200,255,.4)" }} />
            </Block>
            {[0, 1, 2].map((i) => (
              <Block key={i} t={t} t0={3.42 + i * 0.1} style={{ left: 18, top: 284 + i * 84, width: 232, height: 72, borderRadius: 16, background: C.white, border: `1px solid ${C.line}`, boxShadow: SHADOW.soft, display: "flex", alignItems: "center", padding: "0 14px", gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 11, background: [C.indigo, C.cyan, C.mint][i] }} />
                <div><Bar w={110} h={12} bg="rgba(41,58,81,.7)" /><Bar w={80} h={9} style={{ marginTop: 9 }} /></div>
              </Block>
            ))}
            <Block t={t} t0={3.75} style={{ left: 40, bottom: 14, width: 188, height: 52, borderRadius: 26, background: "rgba(41,58,81,.06)", display: "flex", alignItems: "center", justifyContent: "space-around" }}>
              {[C.indigo, C.sub, C.sub].map((c, i) => <div key={i} style={{ width: 22, height: 22, borderRadius: 7, background: c, opacity: i ? 0.35 : 1 }} />)}
            </Block>
          </div>
        </div>
      </AbsoluteFill>
    </Stage>
  );
};
const Btn2: React.FC<{ press: number; done: boolean }> = ({ press, done }) => (
  <div style={{ position: "absolute", left: 640 - 0, top: 32, transform: `translate(-50%,-50%) scale(${1 - 0.07 * press})`, padding: "9px 30px", borderRadius: 30, background: done ? C.green : GRAD.dev, color: "#fff", fontFamily: FONT, fontWeight: 700, fontSize: 22,
    boxShadow: `0 ${10 - 6 * press}px 24px rgba(79,123,255,.5)`, whiteSpace: "nowrap" }}>{done ? "Live" : "Deploy"}</div>
);

// ======================= S8: DASHBOARD COMES ALIVE =======================
const PTS = [38, 52, 44, 66, 58, 80, 72, 96, 88, 118];
const CW = 860, CH = 570, PX0 = 50, PX1 = 820, PY0 = 130, PY1 = 500;
const dense = (() => {
  const out: [number, number][] = [], n = PTS.length, mx = 130;
  for (let i = 0; i < (n - 1) * 24 + 1; i++) {
    const f = i / 24, a = Math.floor(f), b = Math.min(n - 1, a + 1), u = (1 - Math.cos((f - a) * Math.PI)) / 2;
    out.push([PX0 + (PX1 - PX0) * (f / (n - 1)), PY1 - (PY1 - PY0) * (mix(PTS[a], PTS[b], u) / mx)]);
  }
  return out;
})();
const TIP_I = 6 * 24 + 6;   // a point on the line between samples
const WINX = 180, WINY = 110, BODYY = WINY + 52, CHX = WINX + 120, CHY = BODYY + 200;
const S8_PT = { x: CHX + dense[TIP_I][0], y: CHY + dense[TIP_I][1] };

const S8: Scene = ({ t }) => {
  const cam = camAt(t, 2.3, 0.04);
  const winP = S(t, -0.25, { damping: 16, stiffness: 120 });
  const draw = E(t, 0.1, 1.0, ease.inOut);
  const path = "M" + dense.map((p) => p.join(",")).join(" L");
  const area = path + ` L${PX1},${PY1} L${PX0},${PY0 + 400} Z`;
  const pulseI = Math.floor(((t * 0.55) % 1) * (dense.length - 1));
  const pulse = dense[pulseI];
  const tip = S(t, 1.12, { damping: 13, stiffness: 220 });
  const kpis = [{ v: 128, c: C.indigo, g: GRAD.dev }, { v: 64, c: C.cyan, g: GRAD.brand }, { v: 92, c: C.mint, g: GRAD.growth }, { v: 37, c: C.violet, g: GRAD.ai }];
  const bars = [46, 70, 54, 88, 64, 100, 76];
  const donut = E(t, 0.35, 1.0, ease.out);
  const R = 76, CIRC = 2 * Math.PI * R;
  const card: React.CSSProperties = { position: "absolute", borderRadius: 22, background: C.white, border: `1px solid ${C.line}`, boxShadow: SHADOW.soft };
  return (
    <Stage t={t} tint={C.cyan} tint2={C.mint}>
      <AbsoluteFill style={{ transform: `scale(${cam})` }}>
        <Win x={WINX} y={WINY} w={1560} h={860} style={{ transform: `translateY(${(1 - winP) * 80}px) scale(${mix(0.94, 1, winP)})`, opacity: clamp(winP * 2), boxShadow: SHADOW.lift, background: "#F7F8FC" }}>
          {/* sidebar */}
          <div style={{ position: "absolute", left: 0, top: 0, width: 90, bottom: 0, background: C.white, borderRight: `1px solid ${C.line}` }}>
            <KBTile x={45} y={52} size={46} style={{ boxShadow: "none" }} />
            {[C.indigo, C.sub, C.sub, C.sub, C.sub].map((c, i) => <div key={i} style={{ position: "absolute", left: 27, top: 120 + i * 70, width: 36, height: 36, borderRadius: 11, background: c, opacity: i ? 0.22 : 1 }} />)}
          </div>
          {/* KPI tiles */}
          {kpis.map((k, i) => {
            const p = S(t, 0.0 + i * 0.1);
            const val = Math.round(k.v * E(t, 0.05 + i * 0.1, 1.0, ease.out));
            return (
              <div key={i} style={{ ...card, left: 120 + i * 356, top: 30, width: 330, height: 140, transform: `translateY(${(1 - p) * 40}px) scale(${mix(0.94, 1, p)})`, opacity: clamp(p * 2) }}>
                <div style={{ position: "absolute", left: 26, top: 26, width: 110, height: 12, borderRadius: 6, background: "rgba(41,58,81,.16)" }} />
                <div style={{ position: "absolute", left: 26, top: 56, fontFamily: FONT, fontWeight: 800, fontSize: 62, letterSpacing: -2, color: C.navy, fontVariantNumeric: "tabular-nums" }}>{val}</div>
                <div style={{ position: "absolute", right: 26, top: 26, width: 44, height: 44, borderRadius: 13, background: k.g }} />
                <div style={{ position: "absolute", right: 26, bottom: 28, width: 90, height: 8, borderRadius: 4, background: "rgba(41,58,81,.08)", overflow: "hidden" }}>
                  <div style={{ width: `${(40 + i * 15) * E(t, 0.3 + i * 0.1, 0.9)}%`, height: "100%", background: k.c, borderRadius: 4 }} />
                </div>
              </div>
            );
          })}
          {/* line chart */}
          <div style={{ ...card, left: 120, top: 200, width: CW, height: CH, opacity: clamp(S(t, 0.05) * 2) }}>
            <div style={{ position: "absolute", left: 34, top: 32, width: 190, height: 16, borderRadius: 8, background: "rgba(41,58,81,.18)" }} />
            <div style={{ position: "absolute", left: 34, top: 64, width: 110, height: 10, borderRadius: 5, background: "rgba(41,58,81,.08)" }} />
            <div style={{ position: "absolute", right: 34, top: 28, display: "flex", gap: 8 }}>
              {[C.indigo, C.cyan, C.mint].map((c, i) => <div key={i} style={{ width: 64, height: 28, borderRadius: 14, background: c, opacity: i ? 0.25 : 1 }} />)}
            </div>
            <svg width={CW} height={CH} style={{ position: "absolute", left: 0, top: 0 }}>
              <defs>
                <linearGradient id="ar" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#4F7BFF" stopOpacity=".24" /><stop offset="1" stopColor="#38C8FF" stopOpacity="0" /></linearGradient>
                <linearGradient id="ln" x1="0" x2="1"><stop offset="0" stopColor="#4F7BFF" /><stop offset="1" stopColor="#38C8FF" /></linearGradient>
                <clipPath id="cl"><rect x={0} y={0} width={PX0 + (PX1 - PX0) * draw} height={CH} /></clipPath>
              </defs>
              {[0, 1, 2, 3].map((i) => <line key={i} x1={PX0} x2={PX1} y1={PY0 + i * 123} y2={PY0 + i * 123} stroke="rgba(41,58,81,.08)" strokeWidth={2} />)}
              <g clipPath="url(#cl)"><path d={area} fill="url(#ar)" /></g>
              <path d={path} fill="none" stroke="url(#ln)" strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - draw} />
              {draw > 0.98 && <><circle cx={pulse[0]} cy={pulse[1]} r={20} fill="#38C8FF" opacity={0.25} /><circle cx={pulse[0]} cy={pulse[1]} r={8} fill="#fff" stroke="#38C8FF" strokeWidth={4} /></>}
              {tip > 0 && <><circle cx={dense[TIP_I][0]} cy={dense[TIP_I][1]} r={24 * tip} fill="#4F7BFF" opacity={0.18} /><circle cx={dense[TIP_I][0]} cy={dense[TIP_I][1]} r={11 * tip} fill="#fff" stroke="#4F7BFF" strokeWidth={5} /></>}
            </svg>
            {tip > 0 && (
              <div style={{ position: "absolute", left: dense[TIP_I][0], top: dense[TIP_I][1] - 108, transform: `translate(-50%,0) scale(${tip})`, transformOrigin: "50% 100%", width: 150, height: 74, borderRadius: 16, background: C.navy, boxShadow: SHADOW.card, padding: "14px 18px" }}>
                <div style={{ width: 60, height: 9, borderRadius: 5, background: "rgba(255,255,255,.35)" }} />
                <div style={{ marginTop: 12, fontFamily: FONT, fontWeight: 800, fontSize: 28, color: "#fff", letterSpacing: -1 }}>{Math.round(88 * E(t, 1.15, 0.5, ease.out))}</div>
                <div style={{ position: "absolute", left: "50%", bottom: -7, width: 16, height: 16, background: C.navy, transform: "translateX(-50%) rotate(45deg)" }} />
              </div>
            )}
          </div>
          {/* bars */}
          <div style={{ ...card, left: 1006, top: 200, width: 514, height: 270, opacity: clamp(S(t, 0.15) * 2) }}>
            <div style={{ position: "absolute", left: 30, top: 28, width: 130, height: 14, borderRadius: 7, background: "rgba(41,58,81,.18)" }} />
            <div style={{ position: "absolute", left: 30, right: 30, bottom: 30, height: 170, display: "flex", alignItems: "flex-end", gap: 20 }}>
              {bars.map((b, i) => {
                const rise = S(t, 0.25 + i * 0.07, { damping: 13, stiffness: 150 });
                const breath = 1 + 0.06 * Math.sin(t * 3.2 + i * 0.9) * clamp((t - 0.9) * 2);
                return <div key={i} style={{ flex: 1, height: `${b * rise * breath}%`, borderRadius: 10, background: [GRAD.dev, GRAD.brand, GRAD.growth][i % 3] }} />;
              })}
            </div>
          </div>
          {/* donut */}
          <div style={{ ...card, left: 1006, top: 496, width: 514, height: 274, opacity: clamp(S(t, 0.3) * 2) }}>
            <svg width={190} height={190} style={{ position: "absolute", left: 40, top: 42, transform: "rotate(-90deg)" }}>
              <circle cx={95} cy={95} r={R} fill="none" stroke="rgba(41,58,81,.08)" strokeWidth={26} />
              <circle cx={95} cy={95} r={R} fill="none" stroke={C.indigo} strokeWidth={26} strokeLinecap="round" strokeDasharray={`${CIRC * 0.46 * donut} ${CIRC}`} />
              <circle cx={95} cy={95} r={R} fill="none" stroke={C.cyan} strokeWidth={26} strokeLinecap="round" strokeDasharray={`${CIRC * 0.2 * donut} ${CIRC}`} strokeDashoffset={-CIRC * 0.5} />
              <circle cx={95} cy={95} r={R} fill="none" stroke={C.mint} strokeWidth={26} strokeLinecap="round" strokeDasharray={`${CIRC * 0.14 * donut} ${CIRC}`} strokeDashoffset={-CIRC * 0.74} />
            </svg>
            <div style={{ position: "absolute", left: 270, top: 62, display: "flex", flexDirection: "column", gap: 34 }}>
              {[C.indigo, C.cyan, C.mint].map((c, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, opacity: clamp(S(t, 0.6 + i * 0.1) * 2) }}>
                  <div style={{ width: 20, height: 20, borderRadius: 6, background: c }} /><div style={{ width: 110 - i * 14, height: 12, borderRadius: 6, background: "rgba(41,58,81,.16)" }} />
                </div>
              ))}
            </div>
          </div>
        </Win>
      </AbsoluteFill>
    </Stage>
  );
};

// hand targets are screen px; the camera scale shifts them a little, so they are mapped through camAt
const d7 = camPt(S7_DEPLOY.x, S7_DEPLOY.y, camAt(1.41, 4.6, 0.045));
const d8 = camPt(S8_PT.x, S8_PT.y, camAt(1.2, 2.3, 0.04));
const hand: Record<string, HandKey[]> = {
  S7: [{ at: 1.3, x: Math.round(d7.x), y: Math.round(d7.y), click: true }, { at: 3.0, x: 1500, y: 780 }],
  S8: [{ at: 1.1, x: Math.round(d8.x), y: Math.round(d8.y) }],
};
const sfx: Record<string, Sfx[]> = {
  S6: [{ t: 0.0, kind: "whoosh", note: "headline words rise" }, { t: 0.35, kind: "pop", note: "sub line" }],
  S7: [{ t: 0.0, kind: "type", note: "code types itself" }, { t: 1.41, kind: "click", note: "Deploy" }, { t: 2.25, kind: "slide", note: "editor flips aside" }, { t: 2.35, kind: "open", note: "browser opens" }, { t: 3.05, kind: "whoosh", note: "phone slides in" }, { t: 3.5, kind: "success", note: "app is live" }],
  S8: [{ t: 0.0, kind: "whoosh", note: "dashboard rises" }, { t: 0.15, kind: "tick", note: "kpis count" }, { t: 0.3, kind: "pop", note: "bars stagger" }, { t: 1.2, kind: "pop", note: "tooltip" }],
};
export const GROUP: Group = { scenes: { S6, S7, S8 }, hand, sfx };
