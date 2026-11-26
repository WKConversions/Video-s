// Package R09 · reference f733-f832 · cuts f748, f760, f771, f787, f810
// AA-AD  four filmed people, each with one white line (measured on the reference) and the small cyan send button
// AE     the one button on a light ground; the hand clicks it (the reference's arrow path), it turns cyan
// AF     the camera rises through a vertical collage of cards that pop in on the reference's frames; the world
//        slides down at the reference's measured speed (button, chart, photos, numbers ... all in one world)
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { Arrow, C, F, Footage, Glyph, Tool, abs, mix, kf, onTwos, refN, rs, useFonts } from "../kit";
import { Hand, handAt } from "../hand";
import type { Pkg } from "../types";

const F0 = 733;
const at = (n: number) => rs(n - F0);
const EPS = 1e-6;
const MONO = "ui-monospace, Menlo, 'DejaVu Sans Mono', monospace";
const INK = "#16202E";

// ---------------------------------------------------------------- AA-AD: the filmed people and their wishes
// The reference's line: white, regular, 2 lines of 55 px pitch, first line centred at y 505, left edge 532-600; the
// send button (about 44 px) stands at the measured spot below-right. Camera: still (scale 1.000-1.002).
const FILMED = [
  { name: "AA", f: 733, dim: 0.10, shade: 0.30, left: 532, btn: [1385, 631], text: "Can you help us automate our follow-ups and keep the CRM up to date?" },
  { name: "AB", f: 748, dim: 0.12, shade: 0.30, left: 540, btn: [1370, 626], text: "Turn these sketches into an app our customers can use." },
  { name: "AC", f: 760, dim: 0.10, shade: 0.24, left: 574, btn: [1330, 626], text: "We want to be found by the right customers, in search and in AI answers." },
  { name: "AD", f: 771, dim: 0.12, shade: 0.34, left: 600, btn: [1310, 628], text: "Build us one dashboard for the whole operation." },
];
const Filmed: React.FC<{ t: number }> = ({ t }) => {
  let k = 0;
  for (let i = 1; i < FILMED.length; i++) if (t >= at(FILMED[i].f) - EPS) k = i;
  const s = FILMED[k], tw = onTwos(s.name, t - at(s.f), 0.1);
  const n = refN(t, F0), cam = 1 + kf(n, [[s.f, 0], [s.f + 12, 0.0012]]);
  return (
    <AbsoluteFill style={{ fontFamily: F }}>
      <Footage key={s.name} name={s.name} at={tw.at} scale={cam} dim={s.dim} />
      <AbsoluteFill style={{ background: `radial-gradient(42% 24% at ${(s.left + 440) / 19.2}% 49%, rgba(10,16,26,${s.shade}) 0%, rgba(10,16,26,0) 100%)` }} />
      <div style={abs(s.left, 478, 880, undefined, { color: "#fff", fontSize: 41, fontWeight: 500, lineHeight: "54px", letterSpacing: -0.9, textShadow: "0 1px 14px rgba(0,0,0,.35)" })}>{s.text}</div>
      <div style={abs(s.btn[0] - 22, s.btn[1] - 22, 44, 44, { borderRadius: 10, background: C.cyan, display: "flex", alignItems: "center", justifyContent: "center" })}><Arrow s={26} c={INK} /></div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- the world
// W(n): how far the world has slid down by reference frame n (the button's and the cards' measured travel, f799-f832).
const WK: [number, number][] = [[798, 0], [799, 0], [800, 4.5], [801, 13.5], [802, 24], [803, 36], [804, 51], [805, 69], [806, 88.5], [807, 111], [808, 136.5], [809, 165], [810, 196.5], [811, 231], [812, 268.5], [813, 310.5], [814, 357], [815, 406.5], [816, 459], [817, 517.5], [818, 580.5], [819, 646.5], [820, 717], [821, 793.5], [822, 874.5], [823, 961.5], [824, 1056], [825, 1158], [826, 1267.5], [827, 1386], [828, 1515], [829, 1656], [830, 1809], [831, 1974], [832, 2151], [833, 2330]];
const Wn = (n: number) => kf(n, WK);

/** a card that pops in on reference frame f (a hard cut in the reference) at its world place */
const Pop: React.FC<{ n: number; f: number; x: number; y: number; w: number; h: number; children?: React.ReactNode; style?: React.CSSProperties }> = ({ n, f, x, y, w, h, children, style }) =>
  n < f - EPS ? null : <div style={abs(x, y, w, h, { overflow: "hidden", ...style })}>{children}</div>;

const MONTHS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const SOLID = [7, 11, 17.5, 8.5, 11, 12, 7.5, 6.5, 7, 13, 10.5, 9];
const HATCH = [9.5, 16.5, 19.5, 19.5, 14.5, 15, 11, 8.5, 16.5, 16.5, 14.5, 16];
const Chart: React.FC<{ n: number }> = ({ n }) => {
  const hatch = n >= 819 - EPS, leg2 = n >= 820 - EPS, u = 17;       // 17 px per unit, baseline at y 410
  return (
    <div style={{ position: "relative", width: 588, height: 538, background: "#171F2C" }}>
      {[0, 5, 10, 15, 20].map((v) => <div key={v} style={abs(22, 410 - v * u - 9, 44, 18, { fontSize: 15, fontWeight: 500, color: "rgba(255,255,255,.5)", fontFamily: MONO })}>{v === 0 ? "0" : v + "0"}</div>)}
      {SOLID.map((v, i) => (
        <React.Fragment key={i}>
          {hatch && <div style={abs(80 + i * 41, 410 - HATCH[i] * u, 28, HATCH[i] * u, { borderRadius: "6px 6px 0 0", background: "repeating-linear-gradient(135deg, rgba(150,160,190,.55) 0 2px, rgba(150,160,190,.05) 2px 7px)", border: "1px solid rgba(150,160,190,.35)", boxSizing: "border-box" })} />}
          <div style={abs(80 + i * 41, 410 - v * u, 28, v * u, { borderRadius: "6px 6px 0 0", background: "#6F86E8" })} />
        </React.Fragment>))}
      {MONTHS.map((m, i) => <div key={m} style={abs(66 + i * 82, 424, 60, 18, { fontSize: 15, fontWeight: 500, color: "rgba(255,255,255,.55)", textAlign: "center" })}>{m}</div>)}
      <div style={abs(48, 468, 15, 15, { background: "#6F86E8", borderRadius: 3 })} /><div style={abs(74, 464, 200, 24, { fontSize: 19, fontWeight: 500, color: "#fff" })}>Bookings a week</div>
      {hatch && <><div style={abs(300, 468, 15, 15, { background: "repeating-linear-gradient(135deg, #FF7A66 0 2px, #171F2C 2px 5px)", borderRadius: 3 })} /><div style={abs(326, 464, 240, 24, { fontSize: 19, fontWeight: 500, color: C.coral, opacity: leg2 ? 1 : 0.4 })}>Follow-ups sent</div></>}
    </div>
  );
};
const Portrait: React.FC<{ who: string; role: string; pos?: string }> = ({ who, role, pos = "50% 22%" }) => (
  <div style={{ position: "relative", width: "100%", height: "100%", background: "#C9CBCF" }}>
    <Img src={staticFile(`team/${who}.jpg`)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: pos }} />
    <div style={abs(0, 0, undefined, undefined, { right: 0, bottom: 0, padding: "40px 18px 16px", background: "linear-gradient(0deg, rgba(10,16,26,.62), rgba(10,16,26,0))", color: "#fff", fontSize: 21, fontWeight: 600, letterSpacing: -0.3 })}>{role}</div>
  </div>
);
const Bookings: React.FC = () => (
  <div style={{ position: "relative", width: 648, height: 462, background: "linear-gradient(120deg, #FF7A66 0%, #FF9A5A 45%, #FFD070 100%)", overflow: "hidden" }}>
    <div style={abs(0, 0, 648, 462, { backgroundImage: "radial-gradient(circle, rgba(255,255,255,.55) 1.6px, rgba(255,255,255,0) 2.4px)", backgroundSize: "9px 9px", opacity: 0.6 })} />
    <div style={abs(206, 36, 236, 410, { borderRadius: 34, background: "#fff", boxShadow: "0 20px 50px rgba(120,40,20,.35)", padding: "26px 20px", fontFamily: F })}>
      <div style={{ fontSize: 22, fontWeight: 700, color: INK }}>Bookings</div>
      <div style={{ fontSize: 14, fontWeight: 500, color: C.sub, marginTop: 2 }}>Book a table in two taps</div>
      <div style={{ display: "flex", gap: 8, marginTop: 18 }}>{["Fri", "Sat", "Sun"].map((d, i) => <div key={d} style={{ flex: 1, height: 52, borderRadius: 12, background: i === 1 ? C.cyan : "#F1F3F6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 600, color: INK }}>{d}</div>)}</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 14 }}>{["18:00", "18:30", "19:00", "19:30", "20:00", "20:30"].map((d, i) => <div key={d} style={{ height: 42, borderRadius: 10, background: i === 2 ? INK : "#F1F3F6", color: i === 2 ? "#fff" : INK, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 600 }}>{d}</div>)}</div>
      <div style={{ marginTop: 16, height: 52, borderRadius: 14, background: C.cyan, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700, color: INK }}>Book for 2</div>
    </div>
  </div>
);
const Flow: React.FC = () => (
  <div style={{ position: "relative", width: 390, height: 256, background: "#2A3341", fontFamily: F }}>
    <div style={abs(22, 16, 200, 22, { fontSize: 17, fontWeight: 600, color: "rgba(255,255,255,.6)" })}>FOLLOW-UPS</div>
    <div style={abs(300, 14, 70, 24, { fontSize: 15, fontWeight: 600, color: C.mint, textAlign: "right" })}>runs alone</div>
    {["New lead", "Follow-up sent", "CRM updated", "Team notified"].map((s, i) => (
      <div key={s} style={abs(22, 52 + i * 49, 346, 41, { borderRadius: 11, background: i < 3 ? "#364255" : "#3A4960", display: "flex", alignItems: "center", gap: 12, padding: "0 12px", boxSizing: "border-box" })}>
        <div style={{ width: 26, height: 26, borderRadius: 8, background: [C.cyan, C.indigo, C.mint, C.amber][i], display: "flex", alignItems: "center", justifyContent: "center" }}><Glyph k={[0, 2, 4, 3][i]} s={15} c={INK} /></div>
        <div style={{ fontSize: 18, fontWeight: 600, color: "#fff" }}>{s}</div>
        <div style={{ marginLeft: "auto", width: 22, height: 22, borderRadius: 11, background: C.green, display: "flex", alignItems: "center", justifyContent: "center" }}><svg width="13" height="13" viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="#fff" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" /></svg></div>
      </div>))}
  </div>
);
const Numbers: React.FC = () => (
  <div style={{ position: "relative", width: 576, height: 258, background: "#E3E4DC", fontFamily: MONO }}>
    <div style={abs(0, 38, 576, 130, { textAlign: "center", fontSize: 128, fontWeight: 500, color: "#3B4048", letterSpacing: -4, lineHeight: "130px" })}>100+</div>
    <div style={abs(0, 188, 576, 30, { textAlign: "center", fontSize: 25, fontWeight: 500, color: "#6B7078", letterSpacing: 2 })}>AUTOMATIONS BUILT</div>
  </div>
);
const Donut: React.FC = () => (
  <div style={{ position: "relative", width: 480, height: 400, background: "#4F63DA", fontFamily: F }}>
    <div style={abs(22, 16, 240, 22, { fontSize: 17, fontWeight: 600, color: "rgba(255,255,255,.75)" })}>SHOW-UP RATE</div>
    <div style={abs(404, 20, 58, 8, { background: "rgba(255,255,255,.8)", borderRadius: 2 })} />
    <svg width="480" height="400" viewBox="0 0 480 400"><circle cx="212" cy="214" r="136" fill="#E1E3E6" /><path d="M212 214 L212 78" stroke="#B9BDC6" strokeWidth="2" /><path d="M212 214 L330 282" stroke="#B9BDC6" strokeWidth="2" /><path d="M212 214 L96 292" stroke="#B9BDC6" strokeWidth="2" /></svg>
    <div style={abs(212 - 90, 214 - 38, 180, 76, { textAlign: "center", fontSize: 70, fontWeight: 700, color: INK, letterSpacing: -2 })}>92%</div>
    <div style={abs(22, 358, 240, 22, { fontSize: 15, fontWeight: 600, color: "rgba(255,255,255,.7)" })}>Bookings kept this week</div>
  </div>
);
const TOOLS = [["n8n-logo2", false], ["odoo-1", true], ["makecom-removebg-preview", false], ["claude-removebg-preview", false], ["apollo-io", false], ["datadog-1", false]] as const;
const ToolsCard: React.FC = () => (
  <div style={{ position: "relative", width: 438, height: 302, background: "#5E6672" }}>
    <div style={abs(24, 18, 300, 20, { fontSize: 16, fontWeight: 600, color: "rgba(255,255,255,.7)", fontFamily: F })}>THE STACK</div>
    {TOOLS.map(([nm, navy], i) => <Tool key={nm} n={nm} x={28 + (i % 3) * 136} y={56 + Math.floor(i / 3) * 118} s={102} navy={navy} />)}
  </div>
);
const RANKS = ["Harbour Kitchen", "Olive & Oak", "Mesa Verde", "Your business", "Bistro Lune", "Saffron House"];
const RankCard: React.FC = () => (
  <div style={{ position: "relative", width: 384, height: 382, background: "#8A929E", fontFamily: F }}>
    <div style={abs(20, 14, 300, 22, { fontSize: 16, fontWeight: 600, color: "rgba(255,255,255,.85)", letterSpacing: 1 })}>AI ANSWERS · RANKING</div>
    {RANKS.map((r, i) => { const me = r === "Your business"; return (
      <div key={r} style={abs(16, 48 + i * 54, 352, 46, { borderRadius: 11, background: me ? "#fff" : "rgba(255,255,255,.22)", display: "flex", alignItems: "center", gap: 12, padding: "0 14px", boxSizing: "border-box", boxShadow: me ? "0 8px 22px rgba(153,205,252,.45)" : "none" })}>
        <div style={{ fontFamily: MONO, fontSize: 19, fontWeight: 600, color: me ? INK : "#fff", width: 22 }}>{i + 1}</div>
        <div style={{ width: 22, height: 22, borderRadius: 6, background: me ? C.cyan : "rgba(255,255,255,.5)" }} />
        <div style={{ fontSize: 19, fontWeight: me ? 700 : 600, color: me ? INK : "#fff" }}>{r}</div>
      </div>); })}
  </div>
);
const Chip: React.FC<{ n: number; f: number; x: number; y: number; d: number; c: string; l: string }> = ({ n, f, x, y, d, c, l }) =>
  n < f - EPS ? null : <div style={abs(x - d / 2, y - d / 2, d, d, { borderRadius: d / 2, background: c, display: "flex", alignItems: "center", justifyContent: "center", fontSize: d * 0.28, fontWeight: 700, color: INK })}>{l}</div>;

// the ground: pale, calm, with soft cyan-mint flower sprays that live in the world (they slide with the cards)
const rn = (k: number) => { const s = Math.sin(k * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
const SPRAYS = Array.from({ length: 44 }, (_, i) => ({ x: 40 + rn(i + 1) * 1840, y: -700 + rn(i + 40) * 1800, h: 260 + rn(i + 80) * 420, lean: (rn(i + 120) - 0.5) * 220, blue: i % 3 === 0 }));
const GroundWorld: React.FC<{ fade: number }> = ({ fade }) => (
  <div style={abs(0, -3000, 1920, 4600)}>
    <svg width="1920" height="4600" viewBox="0 -3000 1920 4600" style={{ position: "absolute", left: 0, top: 0 }}>
      <defs>
        <radialGradient id="r09w1"><stop offset="0" stopColor="#BDEBD6" stopOpacity=".5" /><stop offset="1" stopColor="#BDEBD6" stopOpacity="0" /></radialGradient>
        <radialGradient id="r09w2"><stop offset="0" stopColor="#B9E6F6" stopOpacity=".4" /><stop offset="1" stopColor="#B9E6F6" stopOpacity="0" /></radialGradient>
      </defs>
      <g opacity={fade}>
        <ellipse cx="1500" cy="-1100" rx="900" ry="360" fill="url(#r09w1)" /><ellipse cx="500" cy="-1300" rx="800" ry="300" fill="url(#r09w1)" />
        <ellipse cx="1000" cy="120" rx="1100" ry="420" fill="url(#r09w1)" /><ellipse cx="1100" cy="760" rx="1000" ry="360" fill="url(#r09w2)" />
        {Array.from({ length: 16 }, (_, i) => <ellipse key={`e${i}`} cx={i % 2 ? 1920 : 0} cy={-1500 + i * 190} rx="520" ry="260" fill={i % 3 === 0 ? "url(#r09w2)" : "url(#r09w1)"} />)}
        {Array.from({ length: 12 }, (_, i) => <ellipse key={`t${i}`} cx={300 + (i % 4) * 440} cy={i % 2 ? -1480 : 1420} rx="520" ry="200" fill="url(#r09w1)" />)}
        <ellipse cx="300" cy="-300" rx="700" ry="260" fill="url(#r09w1)" opacity=".6" />
        {SPRAYS.map((s, i) => (
          <g key={i} opacity={0.4}>
            <path d={`M${s.x} ${s.y} C${s.x + s.lean * 0.2} ${s.y - s.h * 0.4} ${s.x + s.lean * 0.8} ${s.y - s.h * 0.7} ${s.x + s.lean} ${s.y - s.h}`} fill="none" stroke="#9FDCCB" strokeWidth="5" strokeLinecap="round" />
            {[0.35, 0.55, 0.75, 0.95].map((q, j) => <ellipse key={j} cx={s.x + s.lean * q + (j % 2 ? 22 : -22)} cy={s.y - s.h * q} rx={s.blue ? 22 : 14} ry={s.blue ? 36 : 22} fill={s.blue ? "#8CCDEB" : "#A6E2D2"} opacity={s.blue ? 0.7 : 0.8} />)}
          </g>))}
      </g>
    </svg>
  </div>
);

const Notes: React.FC = () => (
  <div style={{ position: "absolute", left: 0, top: 0, fontFamily: "'Brush Script MT', cursive", fontStyle: "italic", color: "rgba(60,70,90,.42)", fontSize: 24, lineHeight: "34px" }}>
    <div style={abs(470, -1262, 330, 34)}>lead in, CRM updated</div><div style={abs(486, -1198, 330, 34)}>follow up after 2 days</div><div style={abs(560, -1150, 330, 34)}>one team, one view</div>
  </div>
);

// ---------------------------------------------------------------- AE + AF
const BTN = { x: 960, y: 541 };
const TIP = { x: 1017, y: 601 };                                    // the arrow's tip at rest on the button (measured)
const HSIZE = 130;
const Tower: React.FC<{ t: number }> = ({ t }) => {
  const n = refN(t, F0), W = Wn(n);
  // the button: scale and colour as measured (f794 pressed, back by f799), black to colour in five frames
  const sc = kf(n, [[793, 1], [794, 0.94], [795, 0.96], [796, 0.978], [797, 0.99], [798, 0.997], [799, 1]]);
  const p = kf(n, [[793, 0], [794, 0.55], [795, 0.71], [796, 0.78], [797, 0.83], [798, 0.87], [799, 0.9], [800, 0.97], [801, 1]]);
  const mixc = (a: number[], b: number[], q: number) => `rgb(${a.map((v, i) => Math.round(mix(v, b[i], q))).join(",")})`;
  const face = p <= 0 ? C.ink : mixc([41, 58, 81], [56, 200, 255], p), arrowC = p <= 0 ? "#fff" : INK;
  // the hand: the reference arrow's path (f787 tip 1136,752 -> f788 1065,696 -> on the button from f789), clicking on f794
  const hk = [{ at: 0, x: TIP.x, y: TIP.y }, { at: at(794) - 0.11, x: TIP.x, y: TIP.y, click: true, early: 0.1 }];
  const h = handAt(t * 30, hk as any, { size: HSIZE, float: 0 });
  const px = kf(n, [[787, 1136], [788, 1065], [789, TIP.x], [793, TIP.x]]), py = kf(n, [[787, 752], [788, 696], [789, TIP.y], [793, TIP.y]]);
  // the fingertip stays on the arrow's own spot (px, py) in the world: the hover offset handAt builds into a click
  // key is taken out again, so the tip rests on (1017, 601) and stays on the same spot of the button until it leaves
  const hr = handAt(at(794) + 5, hk as any, { size: HSIZE, float: 0 });
  const shx = TIP.x - hr.x, shy = TIP.y - hr.y;
  const hx = px - shx * h.press, hy = py - shy * h.press;
  const fade = n >= 810 - EPS ? 1 : kf(n, [[797, 0], [809, 0.28]]);
  return (
    <AbsoluteFill style={{ fontFamily: F, overflow: "hidden", background: "#F3F3F3" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `translate3d(0, ${W.toFixed(2)}px, 0)`, willChange: "transform" }}>
        <GroundWorld fade={fade} />
        {n >= 828 - EPS && <Notes />}
        <Pop n={n} f={819} x={648} y={-592} w={648} h={462}><Bookings /></Pop>
        <Pop n={n} f={810} x={386} y={-320} w={588} h={538} style={{ borderRadius: 10, boxShadow: "0 18px 50px rgba(30,40,60,.18)" }}><Chart n={n} /></Pop>
        <Pop n={n} f={825} x={346} y={-800} w={576} h={258} style={{ boxShadow: "0 12px 34px rgba(30,40,60,.10)" }}><Numbers /></Pop>
        <Pop n={n} f={824} x={1124} y={-724} w={390} h={256} style={{ borderRadius: 10 }}><Flow /></Pop>
        <Pop n={n} f={826} x={188} y={-1114} w={480} h={400}><Donut /></Pop>
        <Pop n={n} f={827} x={1016} y={-1146} w={342} h={482} style={{ boxShadow: "0 12px 30px rgba(30,40,60,.14)" }}><Portrait who="youri" role="Software Engineering" /></Pop>
        {n >= 829 - EPS && <div style={abs(676, -1462, 40, 22, { fontSize: 16, fontWeight: 500, color: "#8A8F98" })}>04</div>}
        <Pop n={n} f={829} x={738} y={-1444} w={438} h={302}><ToolsCard /></Pop>
        <Pop n={n} f={830} x={1252} y={-1858} w={384} h={382}><RankCard /></Pop>
        <Chip n={n} f={829} x={652} y={-1216} d={64} c={C.coral} l="S" /><Chip n={n} f={829} x={1316} y={-1232} d={68} c={C.amber} l="M" /><Chip n={n} f={828} x={1402} y={-1190} d={68} c="#B8A6FF" l="N" />
        <Pop n={n} f={800} x={884} y={80} w={314} h={330} style={{ border: "2px dotted rgba(60,70,90,.25)", boxSizing: "border-box" }}><Portrait who="robin" role="Founder & CEO" /></Pop>
        {n >= 800 - EPS && <div style={abs(1172, 146, 64, 64, { borderRadius: 32, background: C.cyan })} />}
        {/* the button, and the hand that rides with it */}
        <div style={abs(BTN.x - 155, BTN.y - 155, 310, 310, { borderRadius: 58, background: face, transform: `scale(${sc.toFixed(4)})`, willChange: "transform", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: n >= 794 ? "0 18px 40px rgba(153,205,252,.18)" : "0 14px 40px rgba(23,43,68,.14)" })}>
          <svg width="150" height="150" viewBox="0 0 24 24"><path d="M12 19V6M6.2 11.8L12 6l5.8 5.8" fill="none" stroke={arrowC} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
        <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, pointerEvents: "none" }}>
          <Hand x={hx} y={hy} tiltX={h.tiltX} tiltY={h.tiltY} rot={h.rot} press={h.press} size={HSIZE} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Comp: React.FC<{ t: number }> = ({ t }) => {
  const ok = useFonts();
  if (!ok) return <AbsoluteFill style={{ background: "#F3F3F3" }} />;
  return t < at(787) - EPS ? <Filmed t={t} /> : <Tower t={t} />;
};

export const PKG: Pkg = {
  id: "R09",
  Comp,
  sfx: [
    { t: at(788), kind: "swish", note: "the pointer slides onto the button", ref: 788 },
    { t: at(794) - 0.02, kind: "click", note: "the click: the button presses and turns cyan", ref: 794 },
    { t: at(800), kind: "pop", note: "the first card (portrait) pops beside the button; the world starts to slide", ref: 800 },
    { t: at(810), kind: "pop", note: "the chart pops in", ref: 810 },
    { t: at(810), kind: "rise", note: "0.95", ref: 810 },
    { t: at(819), kind: "pop", note: "the next card, at the top edge", ref: 819 },
    { t: at(824), kind: "swish", note: "the fast run of cards, one a frame, f824-f830", ref: 824 },
  ],
};
