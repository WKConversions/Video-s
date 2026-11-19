// K.B team film, package R01 (reference f0-f92), rebuilt v2 from measured keys.
//   A  f0-f41   the three words as hard steps; the line splits on f15 around a card of portraits; the picture spreads
//   B1 f41-f63  the first finished screen (K.B automation product)
//   B2 f64-f74  dark ranking app (hard cut)      B3 f75-f92  tall team card that steps down to a portrait
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import type { Pkg } from "../types";
import { C, F, Tile, Check, abs, kf, refN, useFonts } from "../kit";

const INK = "#16202E";
const EPS = 1e-6;
const T = (n: number) => n / 24;
const cl = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const step = (n: number, a: number, b: number) => cl((n - a) / (b - a));
// text width by canvas (fonts are loaded before Comp draws)
let _cv: CanvasRenderingContext2D | null = null;
const mw = (s: string, size: number, wt: number, ls: number) => {
  if (!_cv) _cv = document.createElement("canvas").getContext("2d")!;
  _cv.font = `${wt} ${size}px Montserrat`;
  return _cv.measureText(s).width + ls * s.length;
};

// ================================================================ the words (A)
const FS = 68, LS = -1.4, SP = 17;
const wordStyle = (x: number, top: number, extra: React.CSSProperties = {}): React.CSSProperties => ({
  position: "absolute", left: x, top, fontSize: FS, lineHeight: `${FS}px`, fontWeight: 500, letterSpacing: LS, color: INK, whiteSpace: "nowrap", fontFamily: F, ...extra,
});
const Words: React.FC<{ n: number }> = ({ n }) => {
  const wT = mw("The", FS, 500, LS), wR = mw("right", FS, 500, LS), wM = mw("team", FS, 500, LS);
  const W = wT + SP + wR + SP + wM, L = 958 - W / 2, xR = L + wT + SP, xM = xR + wR + SP;
  const TOP = 506.6;
  if (n < 15) {
    const els: React.ReactNode[] = [];
    els.push(<div key="a" style={wordStyle(n < 5 ? L + 60 : L, TOP)}>The</div>);
    if (n >= 5) els.push(<div key="b" style={wordStyle(xR, TOP)}>right</div>);
    if (n >= 8) els.push(<div key="c" style={wordStyle(n < 11 ? xM - 9 : xM, TOP)}>team</div>);
    return <>{els}</>;
  }
  if (n >= 40) return null;
  const wP = wT + SP + wR;
  // left part (right edge), right word (left edge)
  const cardL = kf(n, BX) - 14, cardR = kf(n, BX) + kf(n, BW) + 14;
  const rEdge = n < 35.5 ? Math.min(708, cardL) : kf(n, [[35.5, Math.min(708, cardL)], [36, 586], [38, 519], [39, 500]]);
  const dy = kf(n, [[35, 0], [36, -19], [38, -69], [39, -80]]);
  const lo = n < 36 ? 1 : kf(n, [[36, 0.55], [38, 0.35], [38.9, 0.3], [39, 0]]);
  const grey = n < 36 ? INK : "#8C96A3";
  const xr = n < 35.5 ? Math.max(1166, cardR) : kf(n, [[35.5, Math.max(1166, cardR)], [36, 1464], [38, 1469]]);
  const ry = kf(n, [[35, 0], [36, 54], [38, 104]]);
  const ro = n < 36 ? 1 : kf(n, [[36, 1], [39, 0.8], [40, 0]]);
  const rc = n < 36 ? INK : "#4DC4E6";
  return (
    <>
      <div style={{ ...wordStyle(rEdge - wP, TOP + dy), opacity: lo, color: grey }}>The right</div>
      <div style={{ ...wordStyle(xr, TOP + ry), opacity: ro, color: rc }}>team</div>
    </>
  );
};

// ================================================================ the portrait stack (A)
const SHEETS = [
  { who: "robin", n: 15, b: [750, 384, 388, 327], rot: -1.5 },
  { who: "tom", n: 18, b: [750, 374, 388, 327], rot: 1.6 },
  { who: "youri", n: 21, b: [744, 340, 394, 384], rot: -1.1 },
  { who: "karl", n: 24, b: [731, 338, 420, 395], rot: 2 },
  { who: "cedric", n: 26, b: [718, 336, 444, 406], rot: -1.2 },
];
const BX = [[26, 718], [30, 704], [34, 692], [35, 692]] as [number, number][];
const BY = [[26, 336], [30, 327], [34, 316], [35, 316]] as [number, number][];
const BW = [[26, 444], [34, 506], [35, 506]] as [number, number][];
const BH = [[26, 406], [34, 428], [35, 428]] as [number, number][];
const Stack: React.FC<{ n: number }> = ({ n }) => {
  if (n >= 38.5) return null;
  const fadeOut = n < 36 ? 1 : 1 - step(n, 36, 38.5);
  return (
    <>
      {SHEETS.map((s, i) => {
        if (n < s.n) return null;
        let [x, y, w, h] = s.b;
        if (n >= 26) { x = kf(n, BX) + (i - 2) * 3; y = kf(n, BY) + (2 - i) * 2; w = kf(n, BW) - (4 - i) * 2; h = kf(n, BH) - (4 - i) * 2; }
        return (
          <div key={s.who} style={{ position: "absolute", left: x, top: y, width: w, height: h, transform: `rotate(${s.rot}deg)`, opacity: fadeOut, background: "#fff", padding: 6, boxSizing: "border-box", borderRadius: 4, boxShadow: "0 12px 34px rgba(30,45,70,.20), 0 2px 6px rgba(30,45,70,.12)", willChange: "transform" }}>
            <Img src={staticFile(`team/${s.who}.jpg`)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 20%", display: "block", filter: "grayscale(.45) contrast(.7) brightness(1.22)" }} />
          </div>
        );
      })}
      {n >= 30 && (() => {
        const w = kf(n, BW), h = kf(n, BH), cx = kf(n, BX) + w / 2, cy = kf(n, BY) + h / 2, p = kf(n, [[30, 0.22], [34, 0.8], [35, 0.84]]);
        const ow = w * p * 0.95, oh = h * p * 0.62;
        return <div style={{ position: "absolute", left: cx - ow / 2, top: cy - oh / 2, width: ow, height: oh, borderRadius: "50%", overflow: "hidden", opacity: fadeOut * kf(n, [[30, 0], [31.5, 1]]), WebkitMaskImage: "radial-gradient(ellipse at center, #000 62%, transparent 100%)", maskImage: "radial-gradient(ellipse at center, #000 62%, transparent 100%)" }}><RingsBG nn={n} /></div>;
      })()}
    </>
  );
};

// ================================================================ the screen (B1): picture + pieces
const GW = 1336, GH = 831;
const RingsBG: React.FC<{ nn: number }> = ({ nn }) => (
  <svg width="100%" height="100%" viewBox={`0 0 ${GW} ${GH}`} preserveAspectRatio="none" style={{ position: "absolute", inset: 0 }}>
    <defs>
      <linearGradient id="kbg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#4F7BFF" /><stop offset=".28" stopColor="#38C8FF" /><stop offset=".75" stopColor="#22C7A0" /><stop offset="1" stopColor="#22C7A0" /></linearGradient>
      <radialGradient id="kvg" cx=".5" cy=".62" r=".75"><stop offset="0" stopColor="#fff" stopOpacity=".10" /><stop offset=".7" stopColor="#0A2A7A" stopOpacity="0" /><stop offset="1" stopColor="#0A2A7A" stopOpacity=".28" /></radialGradient>
      <filter id="kbl"><feGaussianBlur stdDeviation="6" /></filter>
    </defs>
    <rect width={GW} height={GH} fill="url(#kbg)" />
    <g filter="url(#kbl)" fill="none">
      {Array.from({ length: 11 }, (_, i) => { const u = (i + nn * 0.1) % 11, rx = 40 + u * 98 + u * u * 1.6, ry = rx * 0.36, a = Math.min(1, u / 1.5) * Math.min(1, (11 - u) / 3); return (
        <g key={i} opacity={a}>
          <ellipse cx={676} cy={470 + 12} rx={rx} ry={ry} stroke="#0B3A86" strokeOpacity={0.30} strokeWidth={16 + u * 1.8} />
          <ellipse cx={676} cy={470} rx={rx + 10} ry={ry + 4} stroke="#E8FFFF" strokeOpacity={0.26} strokeWidth={9 + u * 1.2} />
        </g>); })}
    </g>
    <rect width={GW} height={GH} fill="url(#kvg)" />
  </svg>
);
const pop = (n: number, a: number, d = 2) => cl((n - a) / d);
const Piece: React.FC<{ n: number; at: number; x: number; y: number; w: number; h: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ n, at, x, y, w, h, children, style }) => {
  const p = pop(n, at, 2.2);
  if (p <= 0) return null;
  const sc = kf(n, [[at, 0.62], [at + 2.2, 1.04], [at + 4, 1]]);
  return <div style={{ position: "absolute", left: x, top: y, width: w, height: h, opacity: p, transform: `scale(${sc})`, transformOrigin: "50% 50%", ...style }}>{children}</div>;
};
const MiniCard: React.FC<{ n: number; at: number; x: number; y: number; w: number; h: number; bg: string; logo: string; logoBg: string; l1: string; l2: string; tall?: boolean; light?: boolean }> = ({ n, at, x, y, w, h, bg, logo, logoBg, l1, l2, tall, light }) => (
  <Piece n={n} at={at} x={x} y={y} w={w} h={h} style={{ background: bg, borderRadius: 6, overflow: "hidden", boxShadow: "0 8px 22px rgba(10,30,90,.25)" }}>
    <div style={abs(12, 12, tall ? 52 : 40, tall ? 52 : 40, { borderRadius: 10, background: logoBg, display: "flex", alignItems: "center", justifyContent: "center" })}>
      <Img src={staticFile(`tools/${logo}.png`)} style={{ width: "66%", height: "66%", objectFit: "contain" }} />
    </div>
    <div style={abs(12, h - 52, w - 60, 44, { fontSize: 17, lineHeight: "20px", fontWeight: 600, color: light ? INK : "#fff", letterSpacing: -0.2 })}>{l1}<br /><span style={{ fontWeight: 500, opacity: 0.85 }}>{l2}</span></div>
    <div style={abs(w - 42, h - 42, 30, 30, { borderRadius: 15, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" })}>
      <svg width="16" height="16" viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke={INK} strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
    </div>
  </Piece>
);
const ScreenContent: React.FC<{ n: number }> = ({ n }) => {
  const h1 = pop(n, 40.5, 1.6), h2 = pop(n, 42, 2), tiny = pop(n, 43, 2.5);
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: GW, height: GH, fontFamily: F }}>
      {/* index grid */}
      {Array.from({ length: 4 }, (_, r) => Array.from({ length: 4 }, (_, c) => {
        const lab = r === 0 ? `0${c + 1}` : c === 0 ? `0${r + 1}` : r === 1 && c < 3 ? `0${c + 1}` : "";
        return lab ? <div key={`${r}${c}`} style={{ position: "absolute", left: 50 + c * 395, top: 89 + r * 221, fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,.7)", opacity: pop(n, 41, 2) }}>{lab}</div> : null; }))}
      {/* nav pill */}
      <Piece n={n} at={40.5} x={461} y={22} w={430} h={38} style={{ background: "rgba(255,255,255,.55)", borderRadius: 10, display: "flex", alignItems: "center", fontSize: 12, fontWeight: 600, color: INK }}>
        <div style={{ width: 38, height: 38, borderRadius: 9, background: "#FFE27A", display: "flex", alignItems: "center", justifyContent: "center" }}><Tile x={19} y={19} s={26} /></div>
        {["Flows", "Leads", "Inbox", "Team"].map((s, i) => <div key={s} style={{ flex: 1, textAlign: "center", height: 26, lineHeight: "26px", margin: "0 3px", borderRadius: 7, background: i === 0 ? "rgba(255,255,255,.7)" : "transparent" }}>{s}</div>)}
      </Piece>
      {/* headline */}
      <div style={{ position: "absolute", left: 0, top: 117, width: 1352, textAlign: "center", fontSize: 100, lineHeight: "100px", fontWeight: 600, letterSpacing: -3.5, color: "#fff", whiteSpace: "nowrap" }}>
        <div style={{ opacity: h1, transform: `translateY(${(1 - h1) * 14}px)` }}>Good morning,</div>
        <div style={{ opacity: h2, transform: `translateY(${(1 - h2) * 14}px)` }}>team</div>
      </div>
      <div style={{ position: "absolute", left: 989, top: 236, fontSize: 15, lineHeight: "20px", fontWeight: 500, color: "#fff", opacity: tiny, whiteSpace: "nowrap" }}>12 follow-ups sent overnight.<br />3 meetings booked.<br />CRM up to date.</div>
      {/* buttons */}
      <Piece n={n} at={46} x={560} y={418} w={232} h={48} style={{ background: "rgba(255,255,255,.45)", borderRadius: 13, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontSize: 15, fontWeight: 600, color: INK }}>
        <div style={{ width: 98, height: 36, borderRadius: 9, background: "rgba(255,255,255,.82)", textAlign: "center", lineHeight: "36px" }}>Pause</div>
        <div style={{ width: 106, height: 36, borderRadius: 9, background: C.amber, textAlign: "center", lineHeight: "36px" }}>Run now</div>
      </Piece>
      <MiniCard n={n} at={46} x={103} y={271} w={205} h={96} bg="#E9604F" logo="n8n-logo2" logoBg="#fff" l1="Flow" l2="4 steps" />
      <MiniCard n={n} at={44} x={170} y={526} w={206} h={96} bg="#5B54D6" logo="pipedrive" logoBg="#fff" l1="New lead" l2="Sanne" />
      <MiniCard n={n} at={42.5} x={653} y={575} w={180} h={192} bg="#17A98C" logo="resend" logoBg={INK} l1="Follow-up" l2="sent" tall />
      <MiniCard n={n} at={38} x={1056} y={448} w={180} h={135} bg="#1B2540" logo="odoo-1" logoBg="#fff" l1="CRM" l2="updated" />
    </div>
  );
};
const BOXK = {
  x: [[26, 718], [30, 704], [34, 692], [35, 692], [36, 662], [37, 441], [38, 380], [39, 326], [40, 388], [41, 354], [42, 338], [45, 297], [50, 284]] as [number, number][],
  y: [[26, 336], [30, 327], [34, 316], [35, 316], [36, 332], [37, 332], [38, 306], [39, 231], [40, 182], [41, 160], [42, 150], [45, 129], [50, 122]] as [number, number][],
  w: [[26, 444], [34, 506], [35, 506], [36, 591], [37, 944], [38, 1200], [39, 1254], [40, 1143], [41, 1212], [42, 1246], [45, 1313], [50, 1336]] as [number, number][],
  h: [[26, 406], [34, 428], [35, 428], [36, 410], [37, 438], [38, 550], [39, 693], [40, 718], [41, 759], [42, 780], [45, 818], [50, 831]] as [number, number][],
  r: [[35, 4], [36, 140], [37, 220], [38, 275], [39, 160], [40, 50], [41, 16], [42, 12]] as [number, number][],
  d: [[35, 0], [36, 20], [37, 42], [38, 60], [39, 42], [40, 22], [41, 0]] as [number, number][],
};
const Screen: React.FC<{ n: number }> = ({ n }) => {
  if (n < 35) return null;
  const x = kf(n, BOXK.x), y = kf(n, BOXK.y), w = kf(n, BOXK.w), h = kf(n, BOXK.h), r = kf(n, BOXK.r), d = kf(n, BOXK.d);
  const bgop = kf(n, [[35, 0], [36, 0.5], [38, 0.58], [40, 0.74], [41.5, 0.95], [42.5, 1]]);
  const op = 1;
  const rot = 0;
  const s = n < 41 ? kf(n, [[38, 0.6], [41, 0.907]]) : w / GW;
  const cx = w / 2, cy = h / 2;
  const sh = `0 ${20 * cl((n - 36) / 6)}px ${60 * cl((n - 36) / 6) + 10}px rgba(20,60,110,${0.28 * bgop})`;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, opacity: op, transform: `rotate(${rot}deg)`, willChange: "transform" }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: r, overflow: "hidden", boxShadow: sh, filter: d > 0.5 ? "url(#kliq)" : undefined }}>
        <div style={{ position: "absolute", inset: 0, opacity: bgop }}><RingsBG nn={n} /></div>
        <div style={{ position: "absolute", left: cx - GW / 2 * s, top: cy - GH / 2 * s, width: GW, height: GH, transform: `scale(${s})`, transformOrigin: "0 0" }}><ScreenContent n={n} /></div>
      </div>
    </div>
  );
};
const PaperRings: React.FC<{ n: number }> = ({ n }) => {
  if (n < 36 || n > 57) return null;
  const o = kf(n, [[36, 0], [38, 0.55], [44, 0.42], [56, 0]]);
  const cx = 952, cy = 540;
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: o }}>
      {[0, 1, 2, 3].map((i) => { const k = kf(n, [[36, 0.5 + i * 0.12], [56, 1.1 + i * 0.25]]); return <ellipse key={i} cx={cx} cy={cy} rx={520 * k} ry={330 * k} fill="none" stroke="#38C8FF" strokeOpacity={0.45 - i * 0.07} strokeWidth={6} strokeDasharray="2 7" strokeLinecap="round" />; })}
    </svg>
  );
};
const Liquid: React.FC<{ n: number }> = ({ n }) => {
  const d = kf(n, BOXK.d);
  return (
    <svg width={0} height={0} style={{ position: "absolute" }}>
      <filter id="kliq" x="-15%" y="-25%" width="130%" height="150%">
        <feTurbulence type="fractalNoise" baseFrequency="0.022 0.03" numOctaves={3} seed={7} result="nz" />
        <feDisplacementMap in="SourceGraphic" in2="nz" scale={d} xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </svg>
  );
};
const AB: React.FC<{ n: number }> = ({ n }) => (
  <AbsoluteFill style={{ background: "#FAFAFA", fontFamily: F, overflow: "hidden" }}>
    <Liquid n={n} />
    <PaperRings n={n} />
    <Stack n={n} />
    <Screen n={n} />
    <Words n={n} />
  </AbsoluteFill>
);

// ================================================================ B2: the dark ranking app
const LGROUND = <AbsoluteFill style={{ background: "radial-gradient(110% 100% at 50% 45%, #F4F4F3 0%, #ECECEB 70%, #E4E4E3 100%)" }} />;
const LANE: { x: number; y: number; w: number; k: "dot" | "pill"; c: string; t?: string; dim?: boolean }[] = [
  { x: 37, y: 282, w: 58, k: "dot", c: "#7C6CFF", t: "" },
  { x: 190, y: 282, w: 174, k: "pill", c: "#7C6CFF", t: "" },
  { x: 322, y: 243, w: 58, k: "dot", c: "#FF7A66", t: "" },
  { x: 393, y: 208, w: 58, k: "dot", c: "#4F7BFF", t: "" },
  { x: 466, y: 208, w: 58, k: "dot", c: "#4F7BFF", t: "" },
  { x: 669, y: 208, w: 183, k: "pill", c: "#4F7BFF", t: "Your business" },
  { x: 800, y: 245, w: 58, k: "dot", c: "#FF7A66", t: "5" },
  { x: 872, y: 282, w: 58, k: "dot", c: "#7C6CFF", t: "4" },
  { x: 944, y: 318, w: 58, k: "dot", c: "#FFB547", t: "3" },
  { x: 1017, y: 354, w: 58, k: "dot", c: "#22C7A0", t: "2" },
  { x: 1118, y: 318, w: 117, k: "pill", c: "#FFB547", t: "" },
  { x: 1170, y: 354, w: 58, k: "dot", c: "#FF7A66", t: "" },
  { x: 1243, y: 390, w: 58, k: "dot", c: "#7C6CFF", t: "" },
];
const Panel: React.FC<{ x: number; y: number; w: number; h: number; children?: React.ReactNode }> = ({ x, y, w, h, children }) => (
  <div style={abs(x, y, w, h, { background: "#1A1F25", borderRadius: 8 })}>{children}</div>
);
const Round: React.FC<{ x: number; y: number; s: number; children: React.ReactNode }> = ({ x, y, s, children }) => (
  <div style={abs(x, y, s, s, { borderRadius: s / 2, background: "#2A3038", border: "1px solid rgba(255,255,255,.14)", display: "flex", alignItems: "center", justifyContent: "center", color: "#E6EAF0" })}>{children}</div>
);
const DAYS = "MTWTFSSMTWTFSS".split("");
const HEIGHTS = [150, 190, 120, 215, 170, 240, 130, 205, 160, 225, 140, 190, 250, 180];
const B2: React.FC<{ n: number }> = ({ n }) => {
  const cw = kf(n, [[64, 1215], [66, 1200], [68, 1197], [70, 1194], [72, 1192]]);
  const x = kf(n, [[64, 352], [72, 364]]), y = kf(n, [[64, 136], [72, 144]]);
  const s = cw / 1192, off = 4 * (70 - n);
  const lit = step(n, 68, 69.5);
  return (
    <AbsoluteFill style={{ fontFamily: F }}>
      {LGROUND}
      <div style={{ position: "absolute", left: x, top: y, width: 1192, height: 792, transform: `scale(${s})`, transformOrigin: "0 0", background: "#0D0F12", borderRadius: 20, boxShadow: "0 24px 60px rgba(30,40,60,.22)", overflow: "hidden", willChange: "transform" }}>
        <div style={abs(5, 5, 1182, 782, { borderRadius: 15, overflow: "hidden", background: "#12161A" })}>
          {/* header strip */}
          <div style={abs(0, 0, 1182, 125, { background: "#0F1216" })} />
          <Round x={9} y={14} s={44}><div style={{ width: 44, height: 44, borderRadius: 22, background: "#EDEFF2" }} /></Round>
          <Panel x={62} y={7} w={392} h={110}>
            <div style={abs(14, 12, 200, 18, { fontSize: 14, color: "#9AA5B4", fontWeight: 500 })}>Current search</div>
            <div style={abs(14, 36, 260, 22, { fontSize: 18, color: "#F2F5F9", fontWeight: 600, letterSpacing: 0.5 })}>BEST NEAR ME</div>
            <div style={abs(14, 62, 260, 20, { fontSize: 16, color: "#9AA5B4", fontWeight: 500 })}>search + AI answers</div>
            <div style={abs(322, 10, 56, 20, { background: "#B5A8FF", borderRadius: 4, fontSize: 12, fontWeight: 700, color: "#241A66", textAlign: "center", lineHeight: "20px" })}>Live</div>
            <div style={abs(14, 90, 10, 10, { borderRadius: 5, background: C.green })} />
            <div style={abs(32, 87, 260, 16, { fontSize: 12, color: "#9AA5B4", fontWeight: 500 })}>updated just now · 248 bookings</div>
          </Panel>
          <Panel x={463} y={7} w={266} h={110}>
            <div style={abs(0, 12, 266, 18, { fontSize: 15, color: "#E6EAF0", fontWeight: 600, textAlign: "center" })}>Visitors</div>
            <div style={abs(0, 34, 266, 26, { fontSize: 24, color: "#9AA5B4", fontWeight: 500, textAlign: "center" })}>+38%</div>
            <div style={abs(14, 66, 238, 34, { display: "flex", alignItems: "flex-end", gap: 5 })}>{Array.from({ length: 24 }, (_, i) => <div key={i} style={{ flex: 1, height: 8 + ((i * 7) % 5) * 5 + i * 0.5, background: i > 17 ? C.cyan : "#E6EAF0", borderRadius: 1 }} />)}</div>
          </Panel>
          <Panel x={738} y={7} w={168} h={110}>
            <div style={abs(14, 10, 90, 16, { fontSize: 14, color: "#9AA5B4", fontWeight: 500 })}>Position</div>
            <div style={abs(14, 30, 70, 60, { fontSize: 56, color: "#F2F5F9", fontWeight: 600 })}>3</div>
            <svg width="40" height="50" viewBox="0 0 24 30" style={{ position: "absolute", left: 76, top: 36 }}><path d="M12 26V6M4 14l8-8 8 8" fill="none" stroke={C.green} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
            <div style={abs(122, 62, 40, 24, { fontSize: 20, color: "#6D7888", fontWeight: 500 })}>5</div>
          </Panel>
          <Panel x={914} y={55} w={178} h={62}>
            {[0, 1, 2].map((i) => <Round key={i} x={12 + i * 55} y={10} s={42}>{i === 1 ? <svg width="16" height="16" viewBox="0 0 16 16"><path d="M4 2v12M12 2v12" stroke="#E6EAF0" strokeWidth="3.4" strokeLinecap="round" /></svg> : <svg width="18" height="16" viewBox="0 0 18 16"><path d={i === 0 ? "M9 3L3 8l6 5M16 3l-6 5 6 5" : "M2 3l6 5-6 5M9 3l6 5-6 5"} fill="#E6EAF0" stroke="#E6EAF0" strokeWidth="1.5" strokeLinejoin="round" /></svg>}</Round>)}
          </Panel>
          <div style={abs(914, 8, 178, 40, { background: "#E9ECEF", borderRadius: 6, fontSize: 15, fontWeight: 500, color: "#3A4454", lineHeight: "40px", paddingLeft: 36, boxSizing: "border-box" })}>Search<svg width="16" height="16" viewBox="0 0 16 16" style={{ position: "absolute", left: 12, top: 12 }}><circle cx="6.5" cy="6.5" r="4.5" fill="none" stroke="#3A4454" strokeWidth="2" /><path d="M10 10l4 4" stroke="#3A4454" strokeWidth="2" strokeLinecap="round" /></svg></div>
          <Panel x={1100} y={8} w={36} h={40}><svg width="36" height="40" viewBox="0 0 36 40"><path d="M18 11a6 6 0 0 1 6 6v5l2 3H10l2-3v-5a6 6 0 0 1 6-6zM15 28h6" fill="none" stroke="#E6EAF0" strokeWidth="2" strokeLinecap="round" /></svg></Panel>
          <div style={abs(1142, 8, 36, 40, { borderRadius: 6, overflow: "hidden" })}><Img src={staticFile("team/robin.jpg")} style={{ width: 36, height: 40, objectFit: "cover", objectPosition: "50% 15%" }} /></div>
          <Panel x={1100} y={62} w={36} h={55}><svg width="36" height="55" viewBox="0 0 36 55"><circle cx="18" cy="27" r="4" fill="#E6EAF0" /><path d="M18 14v5M18 35v5M5 27h5M26 27h5" stroke="#E6EAF0" strokeWidth="2" strokeLinecap="round" /></svg></Panel>
          <div style={abs(1142, 62, 36, 55, { borderRadius: 6, background: C.green, display: "flex", alignItems: "center", justifyContent: "center" })}><svg width="20" height="20" viewBox="0 0 20 20"><path d="M12 3a7 7 0 1 0 5 11A6 6 0 0 1 12 3z" fill="#fff" /></svg></div>
          {/* lane */}
          <div style={abs(0, 129, 1182, 292, { background: "#15191D", overflow: "hidden" })}>
            <div style={abs(0, 0, 581, 292, { background: "rgba(34,181,115,.26)" })} />
            {[0, 1, 2, 3, 4].map((i) => <div key={i} style={abs(0, 40 + i * 60, 1182, 1, { background: "rgba(255,255,255,.07)" })} />)}
            {[0, 1, 2, 3, 4, 5, 6].map((i) => <div key={i} style={abs(((i * 168 + off) % 1176 + 1176) % 1176, 0, 1, 292, { background: "rgba(255,255,255,.06)" })} />)}
            {LANE.map((it, i) => {
              const cx = it.x + off, bright = cl((cx - 556) / 40);
              const hh = it.k === "pill" ? 58 : it.w;
              return (
                <div key={i} style={{ position: "absolute", left: cx - it.w / 2 - 5, top: it.y - hh / 2 - 134, width: it.w, height: hh, borderRadius: hh / 2, background: it.c, opacity: 0.38 + 0.62 * bright, boxShadow: i === 5 ? "0 0 26px rgba(79,123,255,.7)" : undefined, color: "#fff", fontSize: it.k === "pill" ? 17 : 24, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", filter: bright < 1 ? `saturate(${0.6 + 0.4 * bright})` : undefined }}>
                  <span style={{ color: i === 8 || i === 10 ? INK : "#fff" }}>{it.t}</span>
                </div>
              );
            })}
            <div style={abs(581, 0, 2, 292, { background: "rgba(255,255,255,.8)" })} />
          </div>
          {/* progress */}
          <div style={abs(0, 421, 1182, 18, { background: "#2A2E33" })}><div style={abs(0, 0, 306, 18, { background: C.green })} /></div>
          {/* light lower half */}
          <div style={abs(0, 439, 1182, 343, { background: "#E7E6E1", backgroundImage: "repeating-linear-gradient(90deg, rgba(0,0,0,.07) 0 56px, transparent 56px 112px)" })}>
            <div style={abs(40, 18, 400, 24, { fontSize: 18, fontWeight: 600, color: INK, letterSpacing: 0.3 })}>Visitors per day</div>
            {HEIGHTS.map((hgt, i) => {
              const on = i === 11, hh = on ? hgt * (1 + 0.14 * lit) : hgt;
              return (
                <React.Fragment key={i}>
                  {on && <div style={abs(40 + i * 80 - 4, 0, 56, 343, { background: "linear-gradient(180deg,#2F7BFF,#1B5CF0)", opacity: lit })} />}
                  <div style={abs(40 + i * 80, 296 - hh, 48, hh, { background: on ? `rgb(${Math.round(22 + 57 * lit)},${Math.round(32 + 91 * lit)},${Math.round(46 + 209 * lit)})` : "#16202E", borderRadius: "6px 6px 0 0" })} />
                  <div style={abs(40 + i * 80, 308, 48, 20, { textAlign: "center", fontSize: 14, fontWeight: 500, color: on && lit > 0.5 ? C.indigo : "#7A8494" })}>{DAYS[i]}</div>
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ================================================================ B3: the tall team card that steps down
const CW = 441, CH = 834;
const THUMBS: [string, string][] = [["tom", "CTO"], ["youri", "SOFTWARE"], ["karl", "COMMERCIAL"], ["cedric", "ADVISOR"]];
const CardBody: React.FC<{ photoOnly?: boolean }> = () => (
  <div style={{ position: "absolute", inset: 0, background: "#fff" }}>
    <div style={abs(0, 0, CW, 640, { overflow: "hidden" })}><Img src={staticFile("team/robin.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 14%" }} /></div>
    <div style={abs(14, 16, 48, 48, { borderRadius: 24, background: "rgba(255,255,255,.88)", display: "flex", alignItems: "center", justifyContent: "center" })}><svg width="18" height="18" viewBox="0 0 18 18"><path d="M11 3L5 9l6 6" fill="none" stroke={INK} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg></div>
    <div style={abs(150, 20, 141, 40, { borderRadius: 20, background: "rgba(235,235,235,.92)", fontSize: 14, fontWeight: 600, color: INK, textAlign: "center", lineHeight: "40px", letterSpacing: 0.4 })}>YOUR TEAM</div>
    <div style={abs(CW - 62, 16, 48, 48, { borderRadius: 24, background: "rgba(255,255,255,.88)", display: "flex", alignItems: "center", justifyContent: "center" })}><svg width="20" height="20" viewBox="0 0 20 20"><path d="M10 3v10M5 8l5-5 5 5M4 16h12" fill="none" stroke={INK} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></div>
    <div style={abs(0, 612, CW, 222, { background: "#fff", borderRadius: "30px 30px 0 0" })}>
      <div style={abs(CW / 2 - 60, 10, 120, 4, { borderRadius: 2, background: "#D5D9DF" })} />
      {THUMBS.map(([w, lab], i) => (
        <div key={w}>
          <div style={abs(12 + i * 106, 26, 100, 14, { fontSize: 10, fontWeight: 600, color: INK, letterSpacing: 0.3 })}>{lab}</div>
          <div style={abs(12 + i * 106, 44, 97, 110, { borderRadius: 6, overflow: "hidden", background: "#EEE" })}><Img src={staticFile(`team/${w}.jpg`)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 22%" }} /></div>
        </div>
      ))}
      <div style={abs(12, 166, CW - 24, 44, { borderRadius: 22, background: "#DFE2E6" })}>
        <div style={abs(6, 6, 32, 32, { borderRadius: 16, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" })}><svg width="16" height="16" viewBox="0 0 16 16"><rect x="2" y="3" width="12" height="11" rx="2" fill="none" stroke={INK} strokeWidth="1.6" /><path d="M2 7h12M5 1.5v3M11 1.5v3" stroke={INK} strokeWidth="1.6" strokeLinecap="round" /></svg></div>
        <div style={abs(0, 0, CW - 24, 44, { textAlign: "center", lineHeight: "44px", fontSize: 15, fontWeight: 600, color: INK, letterSpacing: -0.1 })}>Book a Free Discovery Call</div>
      </div>
    </div>
  </div>
);
const Marks: React.FC<{ x: number; y: number; w: number; h: number }> = ({ x, y, w, h }) => (
  <>
    {[[0, 0], [1, 0], [0, 1], [1, 1]].map(([a, b]) => <div key={`${a}${b}`} style={abs(x + a * (w + 16) - 8 - (a ? 0 : 0), y + b * (h + 16) - 8, 8, 8, { borderTop: b ? undefined : "1.5px solid #8A94A2", borderBottom: b ? "1.5px solid #8A94A2" : undefined, borderLeft: a ? undefined : "1.5px solid #8A94A2", borderRight: a ? "1.5px solid #8A94A2" : undefined, transform: `translate(${a ? 0 : 0}px,0)` })} />)}
  </>
);
const B3: React.FC<{ n: number }> = ({ n }) => {
  let inner: React.ReactNode;
  if (n < 85) {
    const cw = kf(n, [[75, 454], [76, 447], [77, 444], [78, 442], [79, 441]]);
    const x = kf(n, [[75, 732], [79, 740]]), y = kf(n, [[75, 96], [79, 110]]);
    const s = cw / CW;
    inner = <div style={{ position: "absolute", left: x, top: y, width: CW, height: CH, transform: `scale(${s})`, transformOrigin: "0 0", borderRadius: 36, overflow: "hidden", boxShadow: "0 24px 60px rgba(30,40,60,.22)", willChange: "transform" }}><CardBody /></div>;
  } else if (n < 87) {
    const s = 363 / CW;
    inner = <div style={{ position: "absolute", left: 778, top: 184, width: CW, height: CH, transform: `scale(${s})`, transformOrigin: "0 0", borderRadius: 36, overflow: "hidden", boxShadow: "0 20px 50px rgba(30,40,60,.2)" }}><CardBody /></div>;
  } else {
    const hgt = n < 90 ? 412 : 362, top = n < 90 ? 261 : 286;
    const px = 794, pw = n < 90 ? 333 : 332;
    inner = (
      <>
        <div style={abs(px, top, pw, hgt, { overflow: "hidden", borderRadius: 4, boxShadow: "0 14px 34px rgba(30,40,60,.16)" })}>
          <Img src={staticFile("team/robin.jpg")} style={abs(0, 261 - top, 333, 412, { objectFit: "cover", objectPosition: "50% 14%", width: 333, height: 412 })} />
        </div>
        {n >= 90 && (
          <>
            <Marks x={px} y={top} w={pw} h={hgt} />
            <div style={abs(814, 669, 220, 18, { fontSize: 13, fontWeight: 500, color: "#7A8494", display: "flex", alignItems: "center", gap: 7, whiteSpace: "nowrap", lineHeight: "18px" })}><span style={{ width: 7, height: 7, borderRadius: 4, background: C.cyan }} />Founder & CEO</div>
          </>
        )}
        {n >= 91 && <div style={{ position: "absolute", left: 788 - mw("For", 134, 500, -4), top: 380 - 17, fontSize: 134, lineHeight: "134px", fontWeight: 500, letterSpacing: -4, color: INK, whiteSpace: "nowrap" }}>For</div>}
      </>
    );
  }
  return <AbsoluteFill style={{ fontFamily: F }}>{LGROUND}{inner}</AbsoluteFill>;
};

const Comp: React.FC<{ t: number }> = ({ t }) => {
  const ok = useFonts();
  if (!ok) return <AbsoluteFill style={{ background: "#FAFAFA" }} />;
  const n = refN(t, 0) + EPS;
  if (n >= 75) return <B3 n={n} />;
  if (n >= 64) return <B2 n={n} />;
  return <AB n={n} />;
};

export const PKG: Pkg = {
  id: "R01",
  Comp,
  sfx: [
    { t: T(15), kind: "pop", note: "the card opens between the words" },
    { t: T(18), kind: "tick", note: "a portrait is dealt", db: -10 },
    { t: T(21), kind: "tick", note: "a portrait is dealt", db: -10 },
    { t: T(24), kind: "tick", note: "a portrait is dealt", db: -10 },
    { t: T(26), kind: "tick", note: "a portrait is dealt", db: -10 },
    { t: T(36), kind: "rise", note: "the picture spreads into the screen" },
    { t: T(44), kind: "pop", note: "a piece lands" },
    { t: T(46), kind: "pop", note: "a piece lands" },
    { t: T(64), kind: "tick", note: "cut to the dark app" },
    { t: T(68), kind: "pop", note: "the bar lights" },
    { t: T(75), kind: "tick", note: "cut to the team card" },
    { t: T(85), kind: "swish", note: "the card shrinks" },
    { t: T(91), kind: "pop", note: "the word arrives" },
  ],
};
