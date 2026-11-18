// Group C: pillar 2, Software Development. S6 text, S7 code becomes a product, S8 a business dashboard comes alive.
// Motion pass: content that acts (typing + scrolling code, a build log, a page that builds and scrolls, live data).
import React from "react";
import { AbsoluteFill } from "remotion";
import { C, E, Eyebrow, FONT, GRAD, KBTile, Ripple, S, SHADOW, Stage, Win, Words, clamp, ease, mix, pressAt } from "../kit";
import type { Group, HandKey, Scene, Sfx } from "../types";

const MONO = "'SF Mono', Menlo, Consolas, 'DejaVu Sans Mono', monospace";
const K = "#C792EA", F = "#82AAFF", ST = "#9CE37D", N = "#FFB86C", P = "#C3D3EA", CY = "#4DD8FF";

/** a tiny syntax highlighter: returns [text, colour] tokens of one code line */
const tokenize = (s: string): [string, string][] => {
  const out: [string, string][] = [];
  const re = /("[^"]*")|\b(import|export|function|const|return|from|async|await)\b|(<\/?[A-Z]\w*)|(\b[a-zA-Z_]\w*)(?=\()|(\b[a-z]+)(?==)|(\s+)|(\w+)|(.)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(s))) {
    if (m[1]) out.push([m[1], ST]); else if (m[2]) out.push([m[2], K]); else if (m[3]) out.push([m[3], F]);
    else if (m[4]) out.push([m[4], F]); else if (m[5]) out.push([m[5], N]); else if (m[6]) out.push([m[6], P]);
    else if (m[7]) out.push([m[7], CY]); else out.push([m[8], P]);
  }
  return out;
};
const CodeLine: React.FC<{ text: string; n: number }> = ({ text, n }) => (
  <>{tokenize(text.slice(0, n)).map((s, i) => <span key={i} style={{ color: s[1], whiteSpace: "pre" }}>{s[0]}</span>)}</>
);

// ======================= S6: TEXT =======================
const POOL = ["const app = createApp()", "app.use(router)", "export function Page() {", "  return <Hero cta=\"Start\" />", "const rows = await api.list()", "import { Cards } from \"./ui\"",
  "<Cards data={rows} />", "export const routes = [", "  \"/\", \"/app\", \"/admin\",", "const user = Auth.session()", "function format(row) {", "  return row.map(show)"];
const S6: Scene = ({ t }) => {
  const sub = S(t, 0.3);
  const off = Math.round((t + 0.3) * 60) * 7, RH = 50;
  const k0 = Math.floor(off / RH);
  const rows = [];
  for (let k = k0 - 1; k < k0 + 11; k++) rows.push(<div key={k} style={{ position: "absolute", left: 28, top: k * RH + 8, height: RH, display: "flex", alignItems: "center", fontFamily: MONO, fontSize: 27 }}><CodeLine text={POOL[((k % 12) + 12) % 12]} n={99} /></div>);
  const prog = E(t, -0.2, 1.7, ease.smooth);
  const blocks = [
    { t0: -0.1, y: 18, h: 110, bg: GRAD.dev, x: 22, w: 436 },
    { t0: 0.2, y: 142, h: 92, bg: C.cyan, x: 22, w: 210 }, { t0: 0.38, y: 142, h: 92, bg: C.mint, x: 248, w: 210 },
    { t0: 0.56, y: 248, h: 62, bg: C.indigo, x: 22, w: 436 },
  ];
  return (
    <Stage t={t} tint={C.indigo} tint2={C.cyan}>
      <Eyebrow t={t} t0={-0.15} text="PILLAR 02" y={108} color={C.indigo} />
      <Words t={t} t0={0} text={"Software\nDevelopment"} size={124} y={300} hi={{ Software: GRAD.dev }} stagger={0.09} />
      <div style={{ position: "absolute", left: 960, top: 497, transform: `translate(-50%,-50%) translateY(${(1 - sub) * 24}px)`, opacity: clamp(sub * 1.6), fontFamily: FONT, fontWeight: 600, fontSize: 40, color: C.sub, whiteSpace: "nowrap" }}>
        Web apps, mobile apps and business dashboards.
      </div>
      <Win x={300} y={600} w={1320} h={440} dark title="build" style={{ transform: `translateY(${(1 - S(t, -0.3, { damping: 16 })) * 120}px)`, boxShadow: SHADOW.lift }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: 800, bottom: 56, overflow: "hidden" }}><div style={{ position: "absolute", left: 0, top: 0, width: 800, height: 1, transform: `translate3d(0, ${-off}px, 0)`, willChange: "transform" }}>{rows}</div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 150, height: RH, background: "rgba(255,255,255,.07)" }} />
        </div>
        <div style={{ position: "absolute", left: 820, top: 14, width: 480, height: 330, borderRadius: 18, background: C.white, overflow: "hidden" }}>
          {blocks.map((b, i) => { const p = S(t, b.t0, { damping: 15, stiffness: 190 }); return <div key={i} style={{ position: "absolute", left: b.x, top: b.y, width: b.w, height: b.h, borderRadius: 16, background: b.bg, opacity: clamp(p * 2), transform: `translate3d(0, ${(1 - p) * 60}px, 0) scale(${mix(0.9, 1, p)})`, willChange: "transform" }} />; })}
        </div>
        <div style={{ position: "absolute", left: 28, right: 28, bottom: 14, height: 30, borderRadius: 15, background: "rgba(255,255,255,.1)", overflow: "hidden" }}>
          <div style={{ width: "100%", height: "100%", transformOrigin: "left", transform: `scaleX(${prog})`, willChange: "transform", background: "linear-gradient(90deg,#4F7BFF,#38C8FF,#22C7A0)" }} />
        </div>
      </Win>
    </Stage>
  );
};

// ======================= S7: CODE BECOMES A PRODUCT =======================
const FILE = [
  "import { Page } from \"./ui\"", "import { api } from \"./data\"", "import { Auth } from \"./auth\"", "",
  "export function App() {", "  const items = api.load()", "  const user = Auth.session()", "  return (", "    <Page layout=\"fluid\">", "      <Nav user={user} />",
  "      <Hero cta=\"Start\" />", "      <Cards data={items} />", "      <Pricing plans={items} />", "      <Footer />", "    </Page>", "  )", "}", "",
  "export async function load() {", "  const rows = await api.list()", "  return rows.map(format)", "}", "", "export const routes = [", "  \"/\", \"/app\", \"/admin\",", "]", "",
  "export function format(row) {", "  return { ...row, label: show(row) }", "}", "",
  "export const theme = { mode: \"light\" }",
];
const LH = 52, VIEW = 684;
const CUM = FILE.reduce<number[]>((a, l) => { a.push((a.length ? a[a.length - 1] : 0) + l.length + 1); return a; }, []);

const Block: React.FC<{ t: number; t0: number; style: React.CSSProperties; children?: React.ReactNode }> = ({ t, t0, style, children }) => {
  const p = S(t, t0, { damping: 15, stiffness: 190 });
  return <div style={{ position: "absolute", opacity: clamp(p * 1.8), transform: `translateY(${(1 - p) * 90}px) scale(${mix(0.92, 1, p)})`, ...style }}>{children}</div>;
};
const Bar: React.FC<{ w: number; h?: number; bg?: string; style?: React.CSSProperties }> = ({ w, h = 18, bg = "rgba(41,58,81,.2)", style }) => <div style={{ width: w, height: h, borderRadius: h / 2, background: bg, ...style }} />;

const ED = { x: 210, y: 150, w: 1500, h: 800 };
const S7_DEPLOY = { x: ED.x + 1340, y: ED.y + 28 };
const SCROLL = 1250;
const S7: Scene = ({ t }) => {
  const press = pressAt(t, 1.3);
  const chars = Math.max(0, (t + 0.25) * 440);
  let caretLine = FILE.length - 1;
  for (let i = 0; i < FILE.length; i++) if (chars <= CUM[i]) { caretLine = i; break; }
  const lineStart = caretLine ? CUM[caretLine - 1] : 0;
  const cl = Math.min(FILE.length - 1, caretLine + clamp((chars - lineStart) / (FILE[caretLine].length + 1)));
  const scrollY = Math.max(0, (cl + 1.4) * LH - VIEW * 0.42);
  const caretOn = Math.floor(t * 3) % 2 === 0 || chars < CUM[FILE.length - 1];
  const typing = chars < CUM[FILE.length - 1];
  const done = t > 2.0;
  const ex = E(t, 1.85, 0.8, ease.inOut);
  const brP = S(t, 1.95, { damping: 17, stiffness: 120 });
  const phoneP = S(t, 2.35, { damping: 16, stiffness: 130 });
  const sy = SCROLL * E(t, 2.55, 1.9, ease.smooth);
  const term = S(t, 1.12, { damping: 18, stiffness: 90 });
  const edIn = S(t, -0.3, { damping: 16, stiffness: 130 });
  const steps = ["Build", "Test", "Optimise", "Deploy"];

  const sec = (i: number) => 2.05 + i * 0.1;
  return (
    <Stage t={t} tint={C.indigo} tint2={C.cyan}>
      <AbsoluteFill style={{ perspective: 2600 }}>
        {/* the editor: a dark window as an object on the bright stage */}
        <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, opacity: 1 - clamp((ex - 0.55) * 2.2), transform: `translateY(${(1 - edIn) * 160}px) translateX(${-330 * ex}px) scale(${1 - 0.28 * ex}) rotateY(${38 * ex}deg)`, transformOrigin: "30% 50%", display: ex >= 1 ? "none" : "block" }}>
          <Win x={ED.x} y={ED.y} w={ED.w} h={ED.h} title="App.tsx" dark style={{ boxShadow: SHADOW.lift }}>
            <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 64, borderBottom: "1px solid rgba(255,255,255,.08)", display: "flex", alignItems: "center", padding: "0 24px", gap: 12 }}>
              <div style={{ padding: "8px 20px", borderRadius: 10, background: "rgba(255,255,255,.12)", color: "#D7E3F4", fontFamily: MONO, fontSize: 22 }}>App.tsx</div>
              <div style={{ padding: "8px 20px", borderRadius: 10, color: "rgba(255,255,255,.4)", fontFamily: MONO, fontSize: 22 }}>ui.ts</div>
              <div style={{ flex: 1 }} />
            </div>
            <div style={{ position: "absolute", left: 0, right: 0, top: 64, height: VIEW, overflow: "hidden" }}>
              <div style={{ position: "absolute", left: 0, right: 0, top: 0, transform: `translate3d(0, ${-scrollY}px, 0)`, willChange: "transform" }}>
                <div style={{ position: "absolute", left: 0, right: 0, top: Math.floor(cl) * LH + 6, height: LH, background: "rgba(255,255,255,.08)" }} />
                {FILE.map((ln, li) => {
                  const n = Math.max(0, Math.min(ln.length, Math.floor(chars - (li ? CUM[li - 1] : 0))));
                  const on = chars >= (li ? CUM[li - 1] : 0);
                  return (
                    <div key={li} style={{ position: "absolute", top: li * LH + 6, height: LH, display: "flex", alignItems: "center", fontFamily: MONO, fontSize: 30, opacity: on ? 1 : 0 }}>
                      <div style={{ width: 90, textAlign: "right", paddingRight: 30, color: "rgba(255,255,255,.3)", fontSize: 24 }}>{li + 1}</div>
                      <CodeLine text={ln} n={n} />
                      {li === Math.floor(cl) && typing && <span style={{ display: "inline-block", width: 4, height: 36, marginLeft: 2, background: "#38C8FF", opacity: caretOn ? 1 : 0 }} />}
                    </div>
                  );
                })}
              </div>
            </div>
            {/* the Deploy button */}
            <div style={{ position: "absolute", left: 1340, top: 28 - 52, transform: `translate(-50%,-50%) scale(${1 - 0.07 * press})`, padding: "11px 38px", borderRadius: 34, background: done ? C.green : GRAD.dev, color: "#fff", fontFamily: FONT, fontWeight: 700, fontSize: 28, boxShadow: `0 ${10 - 6 * press}px 24px rgba(79,123,255,.5)`, whiteSpace: "nowrap", zIndex: 4 }}>{done ? "Live" : "Deploy"}</div>
            {/* the build log streams up from the bottom */}
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 300, background: "#16212F", borderTop: "1px solid rgba(255,255,255,.1)", transform: `translateY(${(1 - term) * 300}px)` }}>
              <div style={{ position: "absolute", left: 30, right: 30, top: 24, height: 24, borderRadius: 12, background: "rgba(255,255,255,.1)", overflow: "hidden" }}>
                <div style={{ width: "100%", height: "100%", transformOrigin: "left", transform: `scaleX(${E(t, 1.35, 0.7, ease.inOut)})`, background: "linear-gradient(90deg,#4F7BFF,#38C8FF,#22C7A0)" }} />
              </div>
              {steps.map((s, i) => {
                const p = S(t, 1.33 + i * 0.14, { damping: 15, stiffness: 190 });
                return (
                  <div key={s} style={{ position: "absolute", left: 30 + (i % 2) * 720, top: 70 + Math.floor(i / 2) * 100, width: 690, height: 80, borderRadius: 18, background: ["#243A5A", "#1F4A57", "#2E3F66", "#1D5A49"][i], display: "flex", alignItems: "center", padding: "0 26px", gap: 20, opacity: clamp(p * 2), transform: `translateY(${(1 - p) * 70}px)` }}>
                    <div style={{ width: 44, height: 44, borderRadius: "50%", background: C.green, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: FONT, fontWeight: 800, fontSize: 28 }}>✓</div>
                    <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 32, color: "#fff" }}>{s}</div>
                    <div style={{ flex: 1 }} />
                    <div style={{ width: 220 * E(t, 1.33 + i * 0.14, 0.4), height: 14, borderRadius: 7, background: [C.indigo, C.cyan, C.violet, C.mint][i] }} />
                  </div>
                );
              })}
            </div>
            <Ripple t={t} c={1.3} x={1340} y={-24} r={90} />
          </Win>
        </div>

        {/* the browser: the live product builds block by block, then scrolls */}
        <div style={{ position: "absolute", left: 140, top: 110, width: 1150, height: 860, opacity: clamp(brP * 2), transform: `translateX(${(1 - brP) * 300}px) scale(${mix(0.86, 1, brP)}) rotateY(${mix(-24, -5, brP)}deg)` }}>
          <Win x={0} y={0} w={1150} h={860} style={{ boxShadow: SHADOW.lift }}>
            <div style={{ position: "absolute", left: 250, top: -40, width: 650, height: 30, borderRadius: 15, background: C.muted }} />
            <div style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0, overflow: "hidden" }}>
              <div style={{ position: "absolute", left: 0, top: 0, width: 1150, transform: `translate3d(0, ${-sy}px, 0)`, willChange: "transform" }}>
                <Block t={t} t0={sec(0)} style={{ left: 40, top: 22, width: 1070, height: 70, display: "flex", alignItems: "center", gap: 22 }}>
                  <div style={{ width: 56, height: 56, borderRadius: 13, background: C.navy }} /><div style={{ flex: 1 }} />
                  <Bar w={90} h={22} bg={C.navy} /><Bar w={90} h={22} bg={C.indigo} /><Bar w={90} h={22} bg={C.mint} />
                  <div style={{ width: 130, height: 50, borderRadius: 25, background: C.cyan }} />
                </Block>
                <Block t={t} t0={sec(1)} style={{ left: 40, top: 112, width: 1070, height: 400, borderRadius: 28, background: GRAD.dev }}>
                  <Bar w={560} h={52} bg="#fff" style={{ position: "absolute", left: 60, top: 80 }} />
                  <Bar w={400} h={52} bg="rgba(255,255,255,.55)" style={{ position: "absolute", left: 60, top: 150 }} />
                  <div style={{ position: "absolute", left: 60, top: 250, width: 220, height: 70, borderRadius: 35, background: C.navy }} />
                  <div style={{ position: "absolute", right: 60, top: 60, width: 300, height: 280, borderRadius: 24, background: "rgba(255,255,255,.9)" }} />
                </Block>
                {[0, 1, 2].map((i) => (
                  <Block key={i} t={t} t0={sec(2 + i)} style={{ left: 40 + i * 364, top: 540, width: 342, height: 300, borderRadius: 24, background: [C.indigo, C.cyan, C.mint][i] }}>
                    <div style={{ position: "absolute", left: 30, top: 30, width: 76, height: 76, borderRadius: 20, background: "rgba(255,255,255,.9)" }} />
                    <Bar w={200} h={24} bg="#fff" style={{ position: "absolute", left: 30, top: 150 }} />
                    <Bar w={260} h={14} bg="rgba(255,255,255,.55)" style={{ position: "absolute", left: 30, top: 200 }} />
                    <Bar w={190} h={14} bg="rgba(255,255,255,.55)" style={{ position: "absolute", left: 30, top: 230 }} />
                  </Block>
                ))}
                {[0, 1, 2].map((i) => (
                  <Block key={i} t={t} t0={sec(5 + i)} style={{ left: 40, top: 880 + i * 190, width: 1070, height: 164, borderRadius: 24, background: ["#EEF2FF", "#E6F7FF", "#E5F8F2"][i], display: "flex", alignItems: "center", padding: "0 36px", gap: 30 }}>
                    <div style={{ width: 96, height: 96, borderRadius: 26, background: [GRAD.dev, GRAD.brand, GRAD.growth][i] }} />
                    <div><Bar w={380} h={26} bg={C.navy} /><Bar w={560} h={16} bg="rgba(41,58,81,.3)" style={{ marginTop: 18 }} /></div>
                    <div style={{ flex: 1 }} /><div style={{ width: 150, height: 54, borderRadius: 27, background: [C.indigo, C.cyan, C.mint][i] }} />
                  </Block>
                ))}
                <div style={{ position: "absolute", left: 40, top: 1470, width: 1070, height: 360, borderRadius: 28, background: GRAD.growth }}>
                  <Bar w={600} h={56} bg="#fff" style={{ position: "absolute", left: 60, top: 90 }} />
                  <div style={{ position: "absolute", left: 60, top: 200, width: 250, height: 76, borderRadius: 38, background: C.navy }} />
                </div>
                <div style={{ position: "absolute", left: 0, top: 1870, width: 1150, height: 260, background: C.navy }} />
              </div>
            </div>
          </Win>
        </div>

        {/* the phone: the same product, re-flowed as an app, scrolling too */}
        <div style={{ position: "absolute", left: 1380, top: 190, width: 330, height: 700, opacity: clamp(phoneP * 2), transform: `translateX(${(1 - phoneP) * 460}px) rotateY(${mix(-30, -10, phoneP)}deg) rotateZ(${mix(5, 1.5, phoneP)}deg)`, borderRadius: 54, background: "#101826", padding: 12, boxShadow: "0 50px 100px rgba(41,58,81,.35), 0 8px 20px rgba(41,58,81,.2)" }}>
          <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: 43, background: C.white, overflow: "hidden" }}>
            <div style={{ position: "absolute", left: "50%", top: 10, width: 96, height: 26, borderRadius: 13, background: "#101826", transform: "translateX(-50%)", zIndex: 3 }} />
            <div style={{ position: "absolute", left: 0, top: 0, width: 306, transform: `translate3d(0, ${-sy * 0.78}px, 0)`, willChange: "transform" }}>
              <Block t={t} t0={2.5} style={{ left: 18, top: 56, width: 270, height: 40, display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: 9, background: C.navy }} /><div style={{ flex: 1 }} /><Bar w={44} h={14} bg={C.indigo} />
              </Block>
              <Block t={t} t0={2.6} style={{ left: 18, top: 112, width: 270, height: 240, borderRadius: 24, background: GRAD.dev }}>
                <Bar w={170} h={26} bg="#fff" style={{ position: "absolute", left: 20, top: 30 }} />
                <Bar w={120} h={26} bg="rgba(255,255,255,.55)" style={{ position: "absolute", left: 20, top: 66 }} />
                <div style={{ position: "absolute", left: 20, top: 140, width: 130, height: 48, borderRadius: 24, background: C.navy }} />
              </Block>
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <Block key={i} t={t} t0={2.7 + i * 0.09} style={{ left: 18, top: 372 + i * 130, width: 270, height: 112, borderRadius: 20, background: [C.indigo, C.cyan, C.mint, C.violet, C.amber, C.coral][i], display: "flex", alignItems: "center", padding: "0 20px", gap: 16 }}>
                  <div style={{ width: 56, height: 56, borderRadius: 16, background: "rgba(255,255,255,.9)" }} />
                  <div><Bar w={120} h={18} bg="#fff" /><Bar w={90} h={12} bg="rgba(255,255,255,.55)" style={{ marginTop: 12 }} /></div>
                </Block>
              ))}
              <div style={{ position: "absolute", left: 18, top: 1170, width: 270, height: 240, borderRadius: 24, background: GRAD.growth }} />
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </Stage>
  );
};

// ======================= S8: DASHBOARD COMES ALIVE =======================
const Odo: React.FC<{ v: number; digits: number; size: number; color?: string }> = ({ v, digits, size, color = "#fff" }) => {
  const h = size * 1.15;
  const cols = [];
  for (let k = digits - 1; k >= 0; k--) {
    const x = v / Math.pow(10, k), fl = Math.floor(x), fr = x - fl;
    const pos = k === 0 ? x : fl + ease.inOut(clamp((fr - 0.8) / 0.2));
    const d = ((pos % 10) + 10) % 10;
    cols.push(
      <div key={k} style={{ width: size * 0.64, height: h, overflow: "hidden", position: "relative" }}>
        <div style={{ position: "absolute", left: 0, top: 0, transform: `translate3d(0, ${-d * h}px, 0)`, willChange: "transform" }}>
          {Array.from({ length: 20 }, (_, i) => <div key={i} style={{ height: h, lineHeight: `${h}px`, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: size, color }}>{i % 10}</div>)}
        </div>
      </div>);
  }
  return <div style={{ display: "flex" }}>{cols}</div>;
};
const val = (u: number) => clamp(0.34 + 0.016 * u + 0.2 * Math.sin(u * 0.85) + 0.14 * Math.sin(u * 2.1 + 1) + 0.05 * Math.sin(u * 4.3 + 2)) * 0.95 + 0.04;
const sig = (x: number) => 1 / (1 + Math.exp(-x));
const CHW = 1000, CHH = 470, PX = 36, PW = 928, PB = 430, PH = 290;

const S8: Scene = ({ t }) => {
  const winP = S(t, -0.25, { damping: 16, stiffness: 120 });
  const T = t + 0.3;
  const off = Math.round(T * 60) * 7;
  const pts: string[] = [];
  for (let x = 0; x <= 3200; x += 8) pts.push(`${PX + x},${PB - val(x / 60) * PH}`);
  const line = "M" + pts.join(" L");
  const area = line + ` L${PX + 3200},${PB} L${PX},${PB} Z`;
  const tipX = PX + 560, tipV = val((560 + off) / 60), tipY = PB - tipV * PH;
  const tip = S(t, 0.9, { damping: 13, stiffness: 220 });
  const kpis = [
    { g: GRAD.dev, b: 1240, r: 15, l: "Visits", d: 4 }, { g: GRAD.ai, b: 318, r: 9, l: "Orders", d: 4 },
    { g: GRAD.growth, b: 2760, r: 22, l: "Leads", d: 4 }, { g: GRAD.warm, b: 540, r: 7, l: "Tasks", d: 4 },
  ];
  const card: React.CSSProperties = { position: "absolute", borderRadius: 24, background: C.white, border: `1px solid ${C.line}`, boxShadow: SHADOW.soft };
  const names = ["Web", "App", "Shop", "API", "Admin"], bc = [GRAD.dev, GRAD.ai, GRAD.growth, GRAD.brand, GRAD.warm];
  const bv = names.map((_, i) => 0.55 + 0.4 * Math.sin(T * (1.7 + 0.5 * i) + i * 2.4));
  const rows = names.map((n, i) => ({ n, i, pos: bv.reduce((a, v, j) => (j === i ? a : a + sig(16 * (v - bv[i]))), 0) }));
  const TR = 58, tOff = Math.round(T * 60) * 4, tk = Math.floor(tOff / TR);
  const trows = [];
  for (let k = tk - 1; k < tk + 5; k++) {
    const kk = ((k % 4) + 4) % 4;
    trows.push(
      <div key={k} style={{ position: "absolute", left: 0, right: 0, top: k * TR, height: TR, background: k % 2 ? "#F1F4FF" : "#fff", display: "flex", alignItems: "center", padding: "0 30px", gap: 24 }}>
        <div style={{ width: 34, height: 34, borderRadius: 10, background: [C.indigo, C.cyan, C.mint, C.violet][kk] }} />
        <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 28, color: C.navy, width: 220 }}>{["Order", "Signup", "Payment", "Booking"][kk]}</div>
        <div style={{ width: 150 + 90 * ((k * 7) % 5) / 4, height: 16, borderRadius: 8, background: "rgba(41,58,81,.18)" }} />
        <div style={{ flex: 1 }} />
        <div style={{ padding: "6px 24px", borderRadius: 22, background: [C.green, C.cyan, C.amber, C.green][kk], color: kk === 1 ? C.navy : "#fff", fontFamily: FONT, fontWeight: 700, fontSize: 24 }}>{["Paid", "New", "Pending", "Sent"][kk]}</div>
      </div>);
  }
  return (
    <Stage t={t} tint={C.cyan} tint2={C.mint}>
      <Win x={120} y={70} w={1680} h={940} style={{ transform: `translateY(${(1 - winP) * 70}px) scale(${mix(0.95, 1, winP)})`, opacity: clamp(winP * 2), boxShadow: SHADOW.lift, background: "#F7F8FC" }}>
        {kpis.map((k, i) => {
          const p = S(t, -0.2 + i * 0.07);
          return (
            <div key={i} style={{ position: "absolute", left: 24 + i * 414, top: 22, width: 390, height: 152, borderRadius: 24, background: k.g, boxShadow: SHADOW.soft, transform: `translateY(${(1 - p) * 40}px)`, opacity: clamp(p * 2) }}>
              <div style={{ position: "absolute", left: 30, top: 18, fontFamily: FONT, fontWeight: 700, fontSize: 28, color: "rgba(255,255,255,.9)" }}>{k.l}</div>
              <div style={{ position: "absolute", left: 30, top: 54 }}><Odo v={k.b + k.r * T} digits={k.d} size={78} /></div>
              <div style={{ position: "absolute", right: 28, top: 28, width: 54, height: 54, borderRadius: 16, background: "rgba(255,255,255,.3)" }} />
            </div>);
        })}
        <div style={{ ...card, left: 24, top: 196, width: CHW, height: CHH, overflow: "hidden", opacity: clamp(S(t, -0.1) * 2) }}>
          <div style={{ position: "absolute", left: 36, top: 26, fontFamily: FONT, fontWeight: 800, fontSize: 36, color: C.navy }}>Revenue</div>
          <div style={{ position: "absolute", right: 30, top: 22, display: "flex", gap: 10 }}>
            {["Day", "Week", "Year"].map((s, i) => <div key={s} style={{ padding: "8px 22px", borderRadius: 24, background: i === 1 ? C.navy : C.muted, color: i === 1 ? "#fff" : C.sub, fontFamily: FONT, fontWeight: 700, fontSize: 24 }}>{s}</div>)}
          </div>
          <svg width={3300} height={CHH} style={{ position: "absolute", left: 0, top: 0, transform: `translate3d(${-off}px, 0, 0)`, willChange: "transform" }}>
            <defs><linearGradient id="ar8" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#4F7BFF" /><stop offset="1" stopColor="#38C8FF" stopOpacity=".6" /></linearGradient></defs>
            <path d={area} fill="url(#ar8)" />
            <path d={line} fill="none" stroke={C.navy} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {tip > 0 && <svg width={CHW} height={CHH} style={{ position: "absolute", left: 0, top: 0 }}><line x1={tipX} x2={tipX} y1={tipY} y2={PB} stroke="#fff" strokeWidth={4} opacity={0.8 * tip} /><circle cx={tipX} cy={tipY} r={16 * tip} fill="#fff" stroke={C.navy} strokeWidth={6} /></svg>}
          {tip > 0 && (
            <div style={{ position: "absolute", left: tipX, top: 0, transform: `translate3d(0, ${tipY - 112}px, 0) translate(-50%,0) scale(${tip})`, transformOrigin: "50% 100%", padding: "10px 24px", borderRadius: 18, background: C.navy, boxShadow: SHADOW.card, fontFamily: FONT, fontWeight: 800, fontSize: 40, color: "#fff", fontVariantNumeric: "tabular-nums" }}>
              {Math.round(tipV * 100)}%
              <div style={{ position: "absolute", left: "50%", bottom: -8, width: 18, height: 18, background: C.navy, transform: "translateX(-50%) rotate(45deg)" }} />
            </div>
          )}
        </div>
        <div style={{ ...card, left: 1048, top: 196, width: 608, height: CHH, overflow: "hidden", opacity: clamp(S(t, 0.0) * 2) }}>
          <div style={{ position: "absolute", left: 32, top: 26, fontFamily: FONT, fontWeight: 800, fontSize: 36, color: C.navy }}>Traffic</div>
          {rows.map((r) => (
            <div key={r.n} style={{ position: "absolute", left: 32, top: 92, transform: `translate3d(0, ${r.pos * 74}px, 0)`, willChange: "transform", display: "flex", alignItems: "center", gap: 18 }}>
              <div style={{ width: 120, fontFamily: FONT, fontWeight: 700, fontSize: 28, color: C.navy }}>{r.n}</div>
              <div style={{ width: 380 * bv[r.i], height: 52, borderRadius: 14, background: bc[r.i] }} />
            </div>
          ))}
        </div>
        <div style={{ ...card, left: 24, top: 692, width: 1632, height: 174, overflow: "hidden", opacity: clamp(S(t, 0.1) * 2) }}><div style={{ position: "absolute", left: 0, top: 0, width: "100%", height: 1, transform: `translate3d(0, ${-tOff}px, 0)`, willChange: "transform" }}>{trows}</div></div>
      </Win>
    </Stage>
  );
};
function rnd0(i: number) { return i * 1.3; }

// hand targets are screen px (no camera now)
const hand: Record<string, HandKey[]> = {
  S7: [{ at: 1.3, x: S7_DEPLOY.x, y: S7_DEPLOY.y + 0, click: true }],
};
const sfx: Record<string, Sfx[]> = {
  S6: [{ t: 0.0, kind: "whoosh", note: "headline words rise" }, { t: 0.2, kind: "type", note: "build code scrolls" }, { t: 0.4, kind: "pop", note: "preview blocks land" }],
  S7: [{ t: 0.0, kind: "type", note: "code types and scrolls" }, { t: 1.41, kind: "click", note: "Deploy" }, { t: 1.55, kind: "tick", note: "build steps stream in" }, { t: 1.95, kind: "slide", note: "editor flips aside" }, { t: 2.1, kind: "open", note: "browser opens, page builds" }, { t: 2.4, kind: "whoosh", note: "phone slides in" }, { t: 2.8, kind: "success", note: "app is live, page scrolls" }],
  S8: [{ t: 0.0, kind: "whoosh", note: "dashboard rises" }, { t: 0.15, kind: "tick", note: "kpis roll" }, { t: 0.5, kind: "pop", note: "bars re-rank" }, { t: 0.95, kind: "pop", note: "tooltip" }],
};
export const GROUP: Group = { scenes: { S6, S7, S8 }, hand, sfx };
