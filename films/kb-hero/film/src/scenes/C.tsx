// Group C: pillar 2, Software Development. Minimal pass: S6 title, S7 code -> page -> phone, S8 one dashboard card.
import React from "react";
import { C, Caption, E, Eyebrow, FONT, GRAD, Ripple, S, SHADOW, Stage, Words, clamp, drift, ease, mix, pressAt } from "../kit";
import type { Group, HandKey, Scene, Sfx } from "../types";

const MONO = "'SF Mono', Menlo, Consolas, 'DejaVu Sans Mono', monospace";
const T_KW = "#7C6CFF", T_FN = "#4F7BFF", T_ST = "#14A37A", T_TX = C.navy;

const tokenize = (s: string): [string, string][] => {
  const out: [string, string][] = [];
  const re = /("[^"]*"?)|\b(const)\b|(\b[a-zA-Z_]\w*)(?=\()|(.)/gs;
  let m: RegExpExecArray | null;
  while ((m = re.exec(s))) out.push([m[0], m[1] ? T_ST : m[2] ? T_KW : m[3] ? T_FN : T_TX]);
  return out;
};

// ======================= S6: TEXT =======================
const S6: Scene = ({ t }) => {
  const sub = S(t, 0.25);
  return (
    <Stage t={t} tint={C.indigo} tint2={C.cyan}>
      <Eyebrow t={t} t0={-0.15} text="PILLAR 02" y={290} color={C.indigo} />
      <Words t={t} t0={0} text={"Software\nDevelopment"} size={136} y={520} hi={{ Software: GRAD.dev }} stagger={0.09} />
      <div style={{ position: "absolute", left: 960, top: 790, transform: `translate3d(-50%, -50%, 0) translateY(${((1 - sub) * 24).toFixed(2)}px)`, opacity: clamp(sub * 1.6), fontFamily: FONT, fontWeight: 600, fontSize: 42, color: C.sub, whiteSpace: "nowrap" }}>
        Web apps, mobile apps and business dashboards.
      </div>
    </Stage>
  );
};

// ======================= S7: code -> deploy -> page -> phone =======================
const LINES = ["const app = App()", "app.page(\"Home\")", "app.page(\"Pricing\")", "app.theme(\"light\")", "app.deploy()"];
const EX = 410, EY = 270, EW = 1100, EH = 600, BAR = 76;
const DEP = { x: EX + EW - 30 - 85, y: EY + BAR / 2 };   // Deploy button centre on screen
const Bar: React.FC<{ x: number; y: number; w: number; h: number; bg?: string }> = ({ x, y, w, h, bg = C.card }) => <div style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: h / 2, background: bg }} />;

const Page: React.FC<{ glow: number }> = ({ glow }) => (
  <div style={{ position: "absolute", inset: 0, background: C.white }}>
    <div style={{ position: "absolute", left: 24, top: 16, width: 44, height: 44, borderRadius: 12, background: C.navy }} />
    <Bar x={560} y={30} w={90} h={14} /><Bar x={680} y={30} w={90} h={14} /><Bar x={800} y={30} w={90} h={14} />
    <div style={{ position: "absolute", left: 930, top: 18, width: 140, height: 40, borderRadius: 20, background: C.cyanSoft }} />
    <div style={{ position: "absolute", left: 20, top: 84, width: 1060, height: 230, borderRadius: 24, background: "linear-gradient(110deg,#E6F7FF,#EEF0FF)" }}>
      <Bar x={50} y={50} w={560} h={32} bg={C.navy} /><Bar x={50} y={104} w={380} h={18} bg="#B9C3D2" />
      <div style={{ position: "absolute", left: 50, top: 154, width: 190, height: 52, borderRadius: 26, background: GRAD.dev, boxShadow: `0 0 ${70 * glow}px ${16 * glow}px rgba(56,200,255,${0.7 * glow})` }} />
    </div>
    {[0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: 20 + i * 365, top: 340, width: 330, height: 150, borderRadius: 20, background: C.muted, border: `1px solid ${C.line}` }}>
      <div style={{ position: "absolute", left: 24, top: 24, width: 44, height: 44, borderRadius: 12, background: [GRAD.dev, GRAD.ai, GRAD.growth][i] }} /><Bar x={24} y={92} w={200} h={16} bg="#B9C3D2" /><Bar x={24} y={120} w={130} h={12} />
    </div>)}
  </div>
);

const Phone: React.FC<{ glow: number }> = ({ glow }) => (
  <div style={{ position: "absolute", inset: 0, borderRadius: 46, background: C.navy, padding: 10, boxShadow: SHADOW.lift }}>
    <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: 36, background: C.white, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 16, top: 18, width: 34, height: 34, borderRadius: 10, background: C.navy }} /><Bar x={190} y={28} w={50} h={12} />
      <div style={{ position: "absolute", left: 14, top: 74, width: 232, height: 230, borderRadius: 20, background: "linear-gradient(110deg,#E6F7FF,#EEF0FF)" }}>
        <Bar x={18} y={26} w={190} h={22} bg={C.navy} /><Bar x={18} y={62} w={140} h={14} bg="#B9C3D2" />
        <div style={{ position: "absolute", left: 18, top: 150, width: 130, height: 44, borderRadius: 22, background: GRAD.dev, boxShadow: `0 0 ${50 * glow}px ${12 * glow}px rgba(56,200,255,${0.7 * glow})` }} />
      </div>
      {[0, 1].map((i) => <div key={i} style={{ position: "absolute", left: 14, top: 322 + i * 112, width: 232, height: 98, borderRadius: 16, background: C.muted, border: `1px solid ${C.line}` }}>
        <div style={{ position: "absolute", left: 16, top: 16, width: 32, height: 32, borderRadius: 9, background: [GRAD.ai, GRAD.growth][i] }} /><Bar x={16} y={62} w={140} h={12} bg="#B9C3D2" />
      </div>)}
    </div>
  </div>
);

const S7: Scene = ({ t }) => {
  const arr = S(t, -0.35, { damping: 17 });
  const flipP = E(t, 1.85, 0.7, ease.inOut);
  const shift = E(t, 2.6, 0.7, ease.out);
  const phone = S(t, 2.7, { damping: 15, stiffness: 150 });
  const glow = Math.sin(Math.PI * E(t, 3.0, 1.0, ease.smooth));
  const live = E(t, 1.41, 0.25, ease.out), press = pressAt(t, 1.3);
  const chars = Math.floor(clamp((t + 0.1) / 1.1) * 88);
  let rem = chars;
  const blink = Math.sin(t * 7) > -0.2 ? 1 : 0;
  const rows = LINES.map((ln, i) => { const n = Math.max(0, Math.min(ln.length, rem)); rem -= ln.length; return { n, active: n > 0 && n < ln.length }; });
  const lastRow = rows.reduce((a, r, i) => (r.n > 0 ? i : a), 0);
  const face: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: EW, height: EH, borderRadius: 24, overflow: "hidden", background: C.white, boxShadow: SHADOW.card, border: `1px solid ${C.line}`, backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" };
  const dots = ["#FF5F57", "#FEBC2E", "#28C840"].map((c) => <div key={c} style={{ width: 14, height: 14, borderRadius: "50%", background: c }} />);
  return (
    <Stage t={t} tint={C.indigo} tint2={C.cyan}>
      <Caption t={t} text="Website & mobile app development" grad={GRAD.dev} />
      <div style={{ position: "absolute", left: EX, top: EY, width: EW, height: EH, perspective: 2600, transform: `translate3d(${(-190 * shift).toFixed(2)}px, ${((1 - arr) * 70).toFixed(2)}px, 0)`, opacity: clamp(arr * 2), willChange: "transform" }}>
        <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d", transform: `scale(${(1 + 0.04 * Math.sin(Math.PI * flipP)).toFixed(4)}) rotateY(${(180 * flipP).toFixed(3)}deg)`, willChange: "transform" }}>
          {/* front: the light editor */}
          <div style={face}>
            <div style={{ height: BAR, display: "flex", alignItems: "center", gap: 10, padding: "0 28px", borderBottom: `1px solid ${C.line}`, background: "#FBFBFD" }}>
              {dots}
              <div style={{ flex: 1 }} />
              <div style={{ position: "relative", width: 170, height: 52, borderRadius: 26, transform: `scale(${(1 - 0.06 * press).toFixed(4)})` }}>
                <div style={{ position: "absolute", inset: 0, borderRadius: 26, background: C.cyan, boxShadow: "0 8px 22px rgba(56,200,255,.35)" }} />
                <div style={{ position: "absolute", inset: 0, borderRadius: 26, background: C.green, opacity: live, boxShadow: "0 8px 22px rgba(34,181,115,.35)" }} />
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 700, fontSize: 28, color: C.navy, opacity: 1 - live }}>Deploy</div>
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 700, fontSize: 28, color: "#fff", opacity: live }}>Live</div>
              </div>
            </div>
            <div style={{ padding: "40px 60px", fontFamily: MONO, fontSize: 40, lineHeight: "76px" }}>
              {LINES.map((ln, i) => (
                <div key={i} style={{ height: 76, whiteSpace: "pre", position: "relative" }}>
                  {tokenize(ln.slice(0, rows[i].n)).map((s, j) => <span key={j} style={{ color: s[1] }}>{s[0]}</span>)}
                  {i === lastRow && <span style={{ display: "inline-block", width: 4, height: 44, background: C.cyan, marginLeft: 3, verticalAlign: "middle", opacity: blink }} />}
                </div>
              ))}
            </div>
          </div>
          {/* back: a finished page in a browser */}
          <div style={{ ...face, transform: "rotateY(180deg)" }}>
            <div style={{ height: 60, display: "flex", alignItems: "center", gap: 10, padding: "0 24px", borderBottom: `1px solid ${C.line}`, background: "#FBFBFD" }}>
              {dots}<div style={{ marginLeft: 120, width: 520, height: 32, borderRadius: 16, background: C.card }} />
            </div>
            <div style={{ position: "absolute", left: 0, top: 60, width: EW, height: EH - 60 }}><Page glow={glow} /></div>
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 1425, top: 300, width: 270, height: 560, opacity: clamp(phone * 2), transform: `translate3d(${((1 - phone) * 520).toFixed(2)}px, ${drift(t, 4, 6).toFixed(2)}px, 0)`, willChange: "transform" }}>
        <Phone glow={glow} />
      </div>
      <Ripple t={t} c={1.3} x={DEP.x} y={DEP.y} r={70} color={C.green} />
    </Stage>
  );
};

// ======================= S8: one dashboard card =======================
const CW = 1200, CH = 640, CX = 360, CY = 270, GW = 1080, GH = 340;
const yfn = (u: number) => { const v = 0.12 + 0.78 * Math.pow(u, 1.2) + 0.05 * u * Math.sin(u * 10 + 1); return GH - 20 - (GH - 50) * v; };
const PTS = Array.from({ length: 121 }, (_, i) => [(i / 120) * GW, yfn(i / 120)] as const);
const LINE_D = "M" + PTS.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(" L");
const AREA_D = LINE_D + ` L${GW} ${GH} L0 ${GH} Z`;
const S8: Scene = ({ t }) => {
  const arr = S(t, -0.3, { damping: 17 });
  const soft = (x: number) => 1 - (1 - x) ** 1.7;                 // the chart is still drawing when the scene leaves: no dead hold
  const p = E(t, 0.1, 2.25, soft);
  const num = Math.round(248 * E(t, 0.1, 2.25, soft));
  const dx = p * GW, dy = yfn(p);
  const pulse = (t * 1.2) % 1;
  return (
    <Stage t={t} tint={C.cyan} tint2={C.indigo}>
      <Caption t={t} text="Custom business dashboards" grad={GRAD.dev} />
      <div style={{ position: "absolute", left: CX, top: CY, width: CW, height: CH, borderRadius: 32, background: C.white, boxShadow: SHADOW.lift, border: `1px solid ${C.line}`, opacity: clamp(arr * 2), transform: `translate3d(0, ${((1 - arr) * 80).toFixed(2)}px, 0) scale(${mix(0.94, 1, arr).toFixed(4)})`, willChange: "transform" }}>
        <div style={{ position: "absolute", left: 70, top: 44, fontFamily: FONT, fontWeight: 800, fontSize: 150, lineHeight: 1, color: C.navy, letterSpacing: -4, fontVariantNumeric: "tabular-nums", width: 420 }}>{num}</div>
        <div style={{ position: "absolute", left: 76, top: 214, width: 220, height: 24, borderRadius: 12, background: C.card }} />
        <svg width={GW} height={GH} style={{ position: "absolute", left: 60, top: 270, overflow: "visible" }}>
          <defs>
            <linearGradient id="s8a" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#38C8FF" stopOpacity="0.30" /><stop offset="1" stopColor="#38C8FF" stopOpacity="0" /></linearGradient>
            <linearGradient id="s8l" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#4F7BFF" /><stop offset="1" stopColor="#38C8FF" /></linearGradient>
            <clipPath id="s8c"><rect x="0" y="-40" width={GW} height={GH + 80} transform={`scale(${Math.max(p, 0.0001).toFixed(4)},1)`} /></clipPath>
          </defs>
          <line x1="0" y1={GH - 1} x2={GW} y2={GH - 1} stroke={C.line} strokeWidth="2" />
          <g clipPath="url(#s8c)"><path d={AREA_D} fill="url(#s8a)" /><path d={LINE_D} fill="none" stroke="url(#s8l)" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" /></g>
          <g opacity={clamp(p * 8)}>
            <circle cx={dx} cy={dy} r={18 + 30 * pulse} fill="#38C8FF" opacity={0.35 * (1 - pulse)} />
            <circle cx={dx} cy={dy} r="16" fill="#fff" stroke="#38C8FF" strokeWidth="7" />
          </g>
        </svg>
      </div>
    </Stage>
  );
};

const hand: Record<string, HandKey[]> = {
  S6: [],
  S7: [{ at: 1.3, x: DEP.x, y: DEP.y, click: true }],
  S8: [],
};
const sfx: Record<string, Sfx[]> = {
  S6: [{ t: -0.05, kind: "pop", note: "pillar label" }, { t: 0.3, kind: "slide", note: "line arrives" }],
  S7: [{ t: 0.0, kind: "type", note: "code types on" }, { t: 1.41, kind: "click", note: "Deploy" }, { t: 1.9, kind: "whoosh", note: "editor turns into the page" }, { t: 2.8, kind: "pop", note: "phone slides in" }, { t: 3.3, kind: "success", note: "button glows" }],
  S8: [{ t: 0.0, kind: "rise", note: "card rises" }, { t: 0.15, kind: "sparkle", note: "line draws" }, { t: 1.4, kind: "pop", note: "line lands" }],
};
export const GROUP: Group = { scenes: { S6, S7, S8 }, hand, sfx };
