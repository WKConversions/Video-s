// K.B. Network Intelligence — the shared kit every scene builds with: clock helpers, the statement type (Say), the
// K.B mark, line icons, cards, chips, the three node kinds of the pipeline (AI agent, tool or data, management gate),
// flow lines with travelling packets, the layer tag, the knowledge-base core, and the pipeline overview map (shared
// so scenes hand off on the exact same frame). Scenes import from here and never redefine these. Tokens in ./lib.
import React from "react";
import { Img, staticFile } from "remotion";
import { T } from "./clock";
import { ARRIVE, C, DEPART, FONT, GRAD, LIN, LOGO_FONT, MOVE, POP, RADIUS, SHADOW, SHADOW_BIG, SNAP, clamp01, mix } from "./lib";

export const k = (g: number, at: string | number, dur: number, ease = ARRIVE) => T.k(g, at, dur, ease);
export const f = (at: string | number) => T.f(at);
// progress of a move between two frames (both from labels), eased
export const kf = (g: number, a: number, d: number, e: (t: number) => number = ARRIVE) => e(clamp01((g - a) / Math.max(1, d)));
export const typed = (g: number, at: string | number, text: string, cps = 30) =>
  text.slice(0, Math.max(0, Math.min(text.length, Math.floor(((g - f(at)) / 30) * cps))));

/* ---------- statements (SaaS caption rhythm: only on a few lines) ---------- */
// The site's statement: Montserrat 600, tight tracking; the first phrase in ink, the second in slate (as "Your tech
// partner." / "Less friction. More possibility."). Words rise out of a soft blur on their spoken word. Centred by
// default in `width` from x; out = a label where the line leaves (rises a little and blurs out in 0.4 s).
export type Wd = { t: string; at: string; slate?: boolean; br?: boolean };
export const Say: React.FC<{ g: number; words: Wd[]; x?: number; y: number; size: number; out?: string; align?: "left" | "center"; width?: number; color?: string; slateColor?: string }> = ({
  g, words, x = 0, y, size, out, align = "center", width = 1920, color = C.ink, slateColor = C.slate }) => {
  const o = out ? k(g, out, 0.4, MOVE) : 0;
  if (o >= 1) return null;
  const lines: Wd[][] = [[]];
  words.forEach((w) => { if (w.br && lines[lines.length - 1].length) lines.push([]); lines[lines.length - 1].push(w); });
  return (
    <div style={{ position: "absolute", left: x, top: y, width, transform: `translateY(${-o * 22}px) perspective(4000px) rotateX(0.01deg)`, opacity: 1 - o,
      filter: o > 0 ? `blur(${o * 8}px)` : undefined, fontFamily: FONT, fontWeight: 600, fontSize: size, letterSpacing: "-0.05em", lineHeight: 1.12 }}>
      {lines.map((ln, li) => (
        <div key={li} style={{ display: "flex", justifyContent: align === "center" ? "center" : "flex-start", columnGap: size * 0.26, whiteSpace: "nowrap" }}>
          {ln.map((w, i) => {
            const kk = k(g, w.at, 0.55);
            return <span key={i} style={{ display: "inline-block", color: w.slate ? slateColor : color, opacity: Math.min(1, kk * 1.6), transform: `translateY(${(1 - kk) * size * 0.35}px)`,
              filter: kk < 1 ? `blur(${(1 - kk) * 8}px)` : undefined }}>{w.t}</span>;
          })}
        </div>
      ))}
    </div>
  );
};

/* ---------- the K.B mark ---------- */
// The logo as on the site: a navy gradient square (rounded like the site header's tile) with "K.B" in white
// Copperplate. size = the square's side in px. p 0..1 builds it: the tile grows in, then the letters rise in turn
// (K, the dot, B). letters=false draws the tile only.
export const KBMark: React.FC<{ size: number; p?: number; letters?: boolean; style?: React.CSSProperties }> = ({ size, p = 1, letters = true, style }) => {
  const tile = ARRIVE(clamp01(p / 0.5));
  const L = (i: number) => ARRIVE(clamp01((p - 0.35 - i * 0.12) / 0.4));
  const parts = ["K", ".", "B"];
  return (
    <div style={{ position: "relative", width: size, height: size, ...style }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: size * 0.16, background: GRAD, transform: `scale(${0.6 + 0.4 * tile})`, opacity: clamp01(tile * 1.5),
        boxShadow: `0 ${size * 0.12}px ${size * 0.3}px -${size * 0.12}px rgba(23,44,67,0.45)` }} />
      {letters && (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: LOGO_FONT, fontWeight: 700, fontSize: size * 0.34,
          color: C.white, letterSpacing: "0.02em", paddingTop: size * 0.03 }}>
          {parts.map((t, i) => <span key={i} style={{ display: "inline-block", opacity: L(i), transform: `translateY(${(1 - L(i)) * size * 0.1}px)`, filter: L(i) < 1 ? `blur(${(1 - L(i)) * 4}px)` : undefined }}>{t}</span>)}
        </div>
      )}
    </div>
  );
};
// The supplied logo file (brand/kb-logo.png, square), for a still lockup.
export const KBLogoImg: React.FC<{ size: number; style?: React.CSSProperties }> = ({ size, style }) => (
  <Img src={staticFile("img/kb-logo.png")} style={{ width: size, height: size, borderRadius: size * 0.16, display: "block", ...style }} />
);

/* ---------- icons (thin rounded line, like the site's arrows) ---------- */
export const P: Record<string, React.ReactNode> = {
  mic: <><rect x="18" y="6" width="12" height="22" rx="6" /><path d="M11 22 a13 13 0 0 0 26 0 M24 35 V42 M17 42 H31" /></>,
  meeting: <><rect x="5" y="11" width="27" height="24" rx="5" /><path d="M32 20 L43 14 V32 L32 26" /></>,
  calendar: <><rect x="6" y="9" width="36" height="32" rx="5" /><path d="M6 18 H42 M15 5 V12 M33 5 V12" /></>,
  mail: <><rect x="5" y="10" width="38" height="28" rx="5" /><path d="M6 13 L24 26 L42 13" /></>,
  doc: <><path d="M12 5 H29 L37 13 V43 H12 Z" /><path d="M29 5 V13 H37 M18 22 H31 M18 29 H31 M18 36 H26" /></>,
  chat: <><path d="M7 10 H41 V32 H22 L13 40 V32 H7 Z" /></>,
  wave: <><path d="M8 24 V24 M14 18 V30 M20 12 V36 M26 16 V32 M32 20 V28 M38 23 V25" /></>,
  spark: <><path d="M24 5 L27.5 19 L41 24 L27.5 29 L24 43 L20.5 29 L7 24 L20.5 19 Z" /></>,
  db: <><ellipse cx="24" cy="11" rx="15" ry="5.5" /><path d="M9 11 V37 c0 3 7 5.5 15 5.5 s15 -2.5 15 -5.5 V11" /><path d="M9 20 c0 3 7 5.5 15 5.5 s15 -2.5 15 -5.5 M9 28.5 c0 3 7 5.5 15 5.5 s15 -2.5 15 -5.5" /></>,
  users: <><circle cx="18" cy="17" r="7" /><path d="M5 40 c2 -8 7 -11 13 -11 s11 3 13 11" /><circle cx="33" cy="15" r="6" /><path d="M33 27 c5 0 9 3 10 10" /></>,
  user: <><circle cx="24" cy="16" r="8" /><path d="M9 42 c2 -10 8 -14 15 -14 s13 4 15 14" /></>,
  userCheck: <><circle cx="19" cy="16" r="8" /><path d="M5 42 c2 -10 7 -14 14 -14 c4 0 7 1 9 3" /><path d="M29 35 L34 40 L43 30" /></>,
  globe: <><circle cx="24" cy="24" r="17" /><path d="M7 24 H41" /><path d="M24 7 c-6 6 -6 28 0 34 c6 -6 6 -28 0 -34" /></>,
  trend: <><path d="M5 36 L17 24 L25 31 L42 13" /><path d="M32 13 H42 V23" /></>,
  news: <><rect x="6" y="9" width="30" height="31" rx="4" /><path d="M36 17 H42 V36 a4 4 0 0 1 -8 0 M12 17 H29 M12 24 H29 M12 31 H22" /></>,
  coins: <><ellipse cx="20" cy="13" rx="12" ry="5" /><path d="M8 13 V21 c0 3 5 5 12 5 s12 -2 12 -5 V13" /><path d="M16 30 c1 2 6 4 12 4 c7 0 12 -2 12 -5 V21 c0 -3 -5 -5 -12 -5" /><path d="M16 30 V37 c0 3 5 5 12 5 s12 -2 12 -5 V29" /></>,
  briefcase: <><rect x="6" y="15" width="36" height="25" rx="4" /><path d="M17 15 V11 a3 3 0 0 1 3 -3 H28 a3 3 0 0 1 3 3 V15 M6 25 H42" /></>,
  rocket: <><path d="M24 5 c8 6 11 15 9 25 H15 c-2 -10 1 -19 9 -25 Z" /><circle cx="24" cy="18" r="4" /><path d="M15 30 L9 37 L16 36 M33 30 L39 37 L32 36 M21 36 L24 43 L27 36" /></>,
  handshake: <><circle cx="17" cy="24" r="11" /><circle cx="31" cy="24" r="11" /></>,
  up: <><path d="M8 40 V30 M18 40 V24 M28 40 V18 M38 40 V10" /><path d="M31 9 L38 6 L41 13" /></>,
  share: <><circle cx="12" cy="24" r="5" /><circle cx="36" cy="11" r="5" /><circle cx="36" cy="37" r="5" /><path d="M16.5 21.5 L31.5 13.5 M16.5 26.5 L31.5 34.5" /></>,
  investor: <><circle cx="24" cy="24" r="17" /><path d="M24 14 V34 M19 18 h8 a4 4 0 0 1 0 8 h-6 a4 4 0 0 0 0 8 h8" /></>,
  send: <><path d="M6 23 L42 7 L30 42 L23 27 Z" /><path d="M23 27 L42 7" /></>,
  check: <><path d="M11 25 L20 33 L37 15" /></>,
  x: <><path d="M14 14 L34 34 M34 14 L14 34" /></>,
  eye: <><path d="M4 24 c6 -10 13 -15 20 -15 s14 5 20 15 c-6 10 -13 15 -20 15 s-14 -5 -20 -15 Z" /><circle cx="24" cy="24" r="6" /></>,
  link: <><path d="M20 28 L28 20" /><path d="M22 14 l4 -4 a8 8 0 0 1 12 12 l-4 4 M26 34 l-4 4 a8 8 0 0 1 -12 -12 l4 -4" /></>,
  loop: <><path d="M38 20 a15 15 0 0 0 -27 -4 M10 28 a15 15 0 0 0 27 4" /><path d="M11 8 V16 H19 M37 40 V32 H29" /></>,
  sync: <><path d="M8 18 H38 L31 11 M40 30 H10 L17 37" /></>,
  portal: <><rect x="5" y="8" width="38" height="32" rx="5" /><path d="M5 16 H43 M16 16 V40" /></>,
  building: <><rect x="10" y="7" width="22" height="34" rx="2" /><path d="M32 18 H39 V41 H32 M16 14 h2 M24 14 h2 M16 21 h2 M24 21 h2 M16 28 h2 M24 28 h2 M19 41 V35 H23 V41" /></>,
  bulb: <><path d="M17 31 c-5 -3 -8 -8 -8 -13 a15 15 0 0 1 30 0 c0 5 -3 10 -8 13 V35 H17 Z" /><path d="M18 40 H30 M21 44 H27" /></>,
  flag: <><path d="M10 43 V6" /><path d="M10 8 H38 L32 16 L38 24 H10" /></>,
  list: <><path d="M17 12 H41 M17 24 H41 M17 36 H41" /><circle cx="8" cy="12" r="2" /><circle cx="8" cy="24" r="2" /><circle cx="8" cy="36" r="2" /></>,
  arrow: <><path d="M8 24 H38" /><path d="M28 14 L38 24 L28 34" /></>,
  arrowDown: <><path d="M24 8 V38" /><path d="M14 28 L24 38 L34 28" /></>,
  arrowUR: <><path d="M12 36 L36 12 M16 12 H36 V32" /></>,
  hash: <><path d="M18 6 L14 42 M34 6 L30 42 M8 17 H42 M6 31 H40" /></>,
  phone: <><rect x="13" y="5" width="22" height="38" rx="4" /><path d="M21 37 H27" /></>,
  layers: <><path d="M24 6 L43 15 L24 24 L5 15 Z" /><path d="M5 24 L24 33 L43 24 M5 33 L24 42 L43 33" /></>,
  filter: <><path d="M6 9 H42 L28 26 V38 L20 42 V26 Z" /></>,
  star: <><path d="M24 6 L29 18 L42 19 L32 27 L35 40 L24 33 L13 40 L16 27 L6 19 L19 18 Z" /></>,
  clock: <><circle cx="24" cy="24" r="17" /><path d="M24 14 V24 L31 29" /></>,
  reply: <><path d="M20 12 L8 24 L20 36" /><path d="M8 24 H30 a10 10 0 0 1 10 10 V40" /></>,
  open: <><path d="M5 18 L24 7 L43 18 V40 H5 Z" /><path d="M5 18 L24 30 L43 18" /></>,
};
export const Ico: React.FC<{ n: string; s?: number; c?: string; w?: number; fill?: string; style?: React.CSSProperties }> = ({ n, s = 24, c = C.ink, w = 2, fill = "none", style }) => (
  <svg width={s} height={s} viewBox="0 0 48 48" fill={fill} stroke={c} strokeWidth={(w * 48) / 26} strokeLinecap="round" strokeLinejoin="round" style={{ display: "block", flex: "none", ...style }}>{P[n]}</svg>
);

/* ---------- surfaces ---------- */
export const CARD: React.CSSProperties = { background: C.white, borderRadius: RADIUS, border: `1px solid ${C.line}`, boxShadow: SHADOW, boxSizing: "border-box" };
export const CARD_BIG: React.CSSProperties = { ...CARD, boxShadow: SHADOW_BIG };
// A small label chip: outline (default), soft (mist fill), navy (filled), cyan (AI), ok (green, success only).
export const Chip: React.FC<{ text: string; size?: number; icon?: string; tone?: "outline" | "soft" | "navy" | "cyan" | "ok"; style?: React.CSSProperties }> = ({ text, size = 20, icon, tone = "outline", style }) => {
  const t = { outline: [C.white, C.slate, `inset 0 0 0 1px ${C.line}`], soft: [C.mist, C.slate, "none"], navy: [C.navy, C.white, "none"], cyan: [C.cyanTint, C.cyanDeep, "none"], ok: [C.okTint, C.ok, "none"] }[tone];
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: size * 0.4, padding: `${size * 0.36}px ${size * 0.75}px`, borderRadius: 999, background: t[0], color: t[1], boxShadow: t[2],
      fontFamily: FONT, fontWeight: 600, fontSize: size, letterSpacing: "-0.01em", whiteSpace: "nowrap", ...style }}>
      {icon && <Ico n={icon} s={size * 1.05} c={t[1]} w={2.2} />}{text}
    </div>
  );
};
// The site's eyebrow, as the layer marker of the close-ups: "LAYER 03 · KNOWLEDGE CORE" in small caps, slate, with a
// number tile. Place at (x, y) top-left (default 120, 92). p 0..1 brings it in; the number and name change with `n`.
export const LAYERS = [
  { n: 1, name: "Capture", sub: "Raw inputs" }, { n: 2, name: "Process", sub: "Claude in between" }, { n: 3, name: "Knowledge core", sub: "Single source of truth" },
  { n: 4, name: "Intelligence", sub: "Reads the core plus the outside world" }, { n: 5, name: "Specialist agents", sub: "One purpose each" },
  { n: 6, name: "Outreach router", sub: "Segment by audience" }, { n: 7, name: "Send and track", sub: "Close the loop" },
];
export const LayerTag: React.FC<{ n: number; p?: number; x?: number; y?: number; style?: React.CSSProperties }> = ({ n, p = 1, x = 120, y = 92, style }) => {
  if (p <= 0) return null;
  const L = LAYERS[n - 1];
  return (
    <div style={{ position: "absolute", left: x, top: y, display: "flex", alignItems: "center", gap: 16, opacity: clamp01(p * 1.5), transform: `translateY(${(1 - p) * 14}px)`, ...style }}>
      <div style={{ width: 46, height: 46, borderRadius: 13, background: GRAD, color: C.white, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 700, fontSize: 20 }}>{String(L.n).padStart(2, "0")}</div>
      <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 21, letterSpacing: "0.055em", color: "#48647D", textTransform: "uppercase", whiteSpace: "nowrap" }}>
        Layer {L.n} <span style={{ color: C.faint, margin: "0 8px" }}>·</span> <span style={{ color: C.ink }}>{L.name}</span>
      </div>
    </div>
  );
};

/* ---------- the three node kinds (the PDF's legend: AI agent, tool or data, management gate) ---------- */
// A pipeline node card: icon tile + title + optional sub line. kind "agent" = an AI agent (cyan spark tile, a thin cyan
// ring), "tool" = a tool or data source (mist tile, slate icon). w = width (height follows the content); s = scale.
// glow 0..1 = the agent is working (its ring brightens and a soft cyan halo breathes). o = opacity.
export const NodeCard: React.FC<{ kind: "agent" | "tool"; icon: string; title: string; sub?: string; w?: number; size?: number; glow?: number; o?: number; style?: React.CSSProperties }> = ({
  kind, icon, title, sub, w, size = 1, glow = 0, o = 1, style }) => {
  const agent = kind === "agent", z = size;
  return (
    <div style={{ ...CARD, width: w, padding: `${16 * z}px ${22 * z}px ${16 * z}px ${16 * z}px`, borderRadius: 20 * z, display: "flex", alignItems: "center", gap: 16 * z, opacity: o,
      border: agent ? `${1.5 * z}px solid ${glow > 0 ? `rgba(33,138,179,${0.35 + 0.5 * glow})` : "#CFE3EE"}` : `1px solid ${C.line}`,
      boxShadow: agent && glow > 0 ? `0 0 0 ${8 * z * glow}px rgba(102,184,219,${0.16 * glow}), ${SHADOW}` : SHADOW, ...style }}>
      <div style={{ width: 52 * z, height: 52 * z, borderRadius: 14 * z, flex: "none", display: "flex", alignItems: "center", justifyContent: "center", position: "relative",
        background: agent ? C.cyanTint : C.mist }}>
        <Ico n={icon} s={28 * z} c={agent ? C.cyan : C.slate} w={2.1} />
        {agent && <div style={{ position: "absolute", right: -5 * z, top: -5 * z, width: 20 * z, height: 20 * z, borderRadius: "50%", background: C.white, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 0 ${1.5 * z}px #CFE3EE` }}>
          <Ico n="spark" s={13 * z} c={C.cyan} w={2.6} fill={C.cyan} /></div>}
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 24 * z, letterSpacing: "-0.02em", color: C.ink, whiteSpace: "nowrap" }}>{title}</div>
        {sub && <div style={{ fontFamily: FONT, fontWeight: 500, fontSize: 18 * z, color: agent ? C.cyanDeep : C.muted, whiteSpace: "nowrap", marginTop: 2 * z }}>{sub}</div>}
      </div>
    </div>
  );
};
// The management gate: a navy pill "Gate 2 · Opportunity triage" with a person-and-check icon; approved 0..1 turns it
// solid navy with a white check and the word "Approved" sliding in. size = font px.
export const GATES = [
  { n: 1, name: "Summary review", q: "Accurate and complete?" }, { n: 2, name: "Opportunity triage", q: "Worth pursuing?" },
  { n: 3, name: "Action approval", q: "Right person, right offer, right timing?" }, { n: 4, name: "Message approval", q: "Edit or approve each draft" },
];
export const GateBadge: React.FC<{ n: number; size?: number; approved?: number; showQ?: boolean; style?: React.CSSProperties }> = ({ n, size = 20, approved = 0, showQ, style }) => {
  const G = GATES[n - 1], a = SNAP(clamp01(approved));
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: size * 0.55, padding: `${size * 0.42}px ${size * 0.9}px ${size * 0.42}px ${size * 0.45}px`, borderRadius: 999, whiteSpace: "nowrap",
      background: a > 0.5 ? C.navy : C.white, boxShadow: a > 0.5 ? `0 12px 26px -12px rgba(23,44,67,0.55)` : `inset 0 0 0 ${size * 0.08}px ${C.navy}, ${SHADOW}`, fontFamily: FONT, fontSize: size, ...style }}>
      <div style={{ width: size * 1.7, height: size * 1.7, borderRadius: "50%", background: a > 0.5 ? "rgba(255,255,255,0.14)" : C.gateTint, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Ico n={a > 0.5 ? "check" : "userCheck"} s={size * 1.1} c={a > 0.5 ? C.white : C.navy} w={2.4} />
      </div>
      <span style={{ fontWeight: 700, color: a > 0.5 ? C.white : C.navy }}>Gate {G.n}</span>
      <span style={{ color: a > 0.5 ? "rgba(255,255,255,0.55)" : C.faint }}>·</span>
      <span style={{ fontWeight: 600, color: a > 0.5 ? C.white : C.ink }}>{G.name}</span>
      {showQ && a <= 0.5 && <span style={{ fontWeight: 500, color: C.muted }}>{G.q}</span>}
      {a > 0 && <span style={{ display: "inline-block", overflow: "hidden", maxWidth: size * 6 * a, opacity: a, fontWeight: 600, color: "#BFE6CF" }}>Approved</span>}
    </div>
  );
};

/* ---------- flow ---------- */
// A flow line between two points (straight or bent by `bend`), drawn 0..1 by p; dashed = a read-only or proposed link.
// packets = how many dots travel along it (at `speed` lengths a second, from frame g), in navy or cyan.
export const Flow: React.FC<{ x1: number; y1: number; x2: number; y2: number; p?: number; g?: number; bend?: number; width?: number; color?: string; dashed?: boolean; packets?: number; speed?: number; pcolor?: string; po?: number }> = ({
  x1, y1, x2, y2, p = 1, g = 0, bend = 0, width = 2.5, color = C.faint, dashed, packets = 0, speed = 0.6, pcolor = C.navy, po = 1 }) => {
  if (p <= 0) return null;
  const mx = (x1 + x2) / 2 - (y2 - y1) * bend, my = (y1 + y2) / 2 + (x2 - x1) * bend;
  const d = `M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`;
  const L = Math.hypot(x2 - x1, y2 - y1) * (1 + Math.abs(bend) * 0.6) + 2;
  const at = (t: number) => ({ x: (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * mx + t * t * x2, y: (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * my + t * t * y2 });
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, overflow: "visible", pointerEvents: "none" }}>
      <path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeDasharray={dashed ? `${width * 0.1} ${width * 4}` : `${L} ${L}`} strokeDashoffset={dashed ? 0 : L * (1 - p)} opacity={dashed ? p : 1} />
      {p >= 1 && Array.from({ length: packets }, (_, i) => {
        const t = (((g / 30) * speed + i / packets) % 1 + 1) % 1, q = at(t);
        return <circle key={i} cx={q.x} cy={q.y} r={width * 2.2} fill={pcolor} opacity={po * Math.min(1, t * 6, (1 - t) * 6)} />;
      })}
    </svg>
  );
};
// A single packet dot at (x, y): navy (information) or cyan (AI output); r px. trail = a soft tail toward (tx, ty).
export const Packet: React.FC<{ x: number; y: number; r?: number; color?: string; o?: number }> = ({ x, y, r = 9, color = C.navy, o = 1 }) => (
  <div style={{ position: "absolute", left: x - r, top: y - r, width: 2 * r, height: 2 * r, borderRadius: "50%", background: color, opacity: o, boxShadow: `0 0 0 ${r * 0.6}px ${color === C.cyan ? "rgba(33,138,179,0.15)" : "rgba(52,74,101,0.12)"}` }} />
);

/* ---------- the knowledge base core (layer 3) ---------- */
// The central knowledge base: a white card with the database tile, "Knowledge base", the sub "Documentation agent",
// and record rows that fill as `fill` 0..1 grows (6 rows). x, y = centre; s = scale (1 = 420×260).
export const CORE = { w: 420, h: 260 };
export const CoreNode: React.FC<{ x: number; y: number; s?: number; fill?: number; glow?: number; o?: number }> = ({ x, y, s = 1, fill = 1, glow = 0, o = 1 }) => (
  <div style={{ position: "absolute", left: x - CORE.w / 2, top: y - CORE.h / 2, width: CORE.w, height: CORE.h, transform: `scale(${s})`, transformOrigin: "50% 50%", opacity: o, ...CARD_BIG,
    borderRadius: 30, padding: 26, border: `1.5px solid ${glow > 0 ? `rgba(33,138,179,${0.3 + 0.5 * glow})` : "#CFE3EE"}`, boxShadow: `0 0 0 ${12 * glow}px rgba(102,184,219,${0.14 * glow}), ${SHADOW_BIG}` }}>
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <div style={{ width: 60, height: 60, borderRadius: 16, background: GRAD, display: "flex", alignItems: "center", justifyContent: "center" }}><Ico n="db" s={32} c={C.white} w={2.1} /></div>
      <div>
        <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 30, letterSpacing: "-0.03em", color: C.ink }}>Knowledge base</div>
        <div style={{ fontFamily: FONT, fontWeight: 500, fontSize: 18, color: C.cyanDeep, display: "flex", alignItems: "center", gap: 6 }}><Ico n="spark" s={14} c={C.cyan} fill={C.cyan} w={2.4} />Documentation agent</div>
      </div>
    </div>
    <div style={{ marginTop: 22, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 14px" }}>
      {Array.from({ length: 6 }, (_, i) => {
        const r = clamp01(fill * 6 - i);
        return <div key={i} style={{ height: 22, borderRadius: 8, background: C.mist, overflow: "hidden", position: "relative" }}>
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${(0.45 + ((i * 37) % 40) / 100) * 100 * r}%`, background: i % 3 === 0 ? "#C9D7E2" : "#DCE6EE", borderRadius: 8 }} />
        </div>;
      })}
    </div>
  </div>
);


/* ---------- the structured summary (layer 2's output; hand-off B → C) ---------- */
// Claude's structured summary of one conversation (example data): a white card, header "Structured summary" with the
// Claude spark, then five rows (Summary, People, Asks, Offers, Next steps) that fill in as p goes 0..1 (each row's
// value types in). x, y = centre; s = scale (1 = 640×400).
export const SUMMARY = { w: 640, h: 400 };
export const SUMMARY_ROWS: [string, string, string][] = [
  ["doc", "Summary", "Client plans a second location"], ["users", "People", "Sarah Lee (CEO), Tom Vries"], ["chat", "Asks", "Booking system for both sites"],
  ["handshake", "Offers", "Intro to their fit-out partner"], ["flag", "Next steps", "Send a proposal by Friday"],
];
export const SummaryCard: React.FC<{ x: number; y: number; s?: number; p?: number; o?: number; source?: string }> = ({ x, y, s = 1, p = 1, o = 1, source = "Meeting · 32 min" }) => (
  <div style={{ position: "absolute", left: x - SUMMARY.w / 2, top: y - SUMMARY.h / 2, width: SUMMARY.w, height: SUMMARY.h, transform: `scale(${s})`, transformOrigin: "50% 50%", opacity: o, ...CARD_BIG, borderRadius: 28, padding: "24px 30px" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      <div style={{ width: 44, height: 44, borderRadius: 12, background: C.cyanTint, display: "flex", alignItems: "center", justifyContent: "center" }}><Ico n="spark" s={24} c={C.cyan} fill={C.cyan} w={2.2} /></div>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 26, letterSpacing: "-0.03em", color: C.ink }}>Structured summary</div>
        <div style={{ fontFamily: FONT, fontWeight: 500, fontSize: 17, color: C.cyanDeep }}>Claude · {source}</div>
      </div>
    </div>
    <div style={{ marginTop: 16, borderTop: `1px solid ${C.line}` }}>
      {SUMMARY_ROWS.map(([ic, label, val], i) => {
        const r = clamp01(p * 5.5 - i), n = Math.floor(val.length * clamp01(r * 1.25));
        return (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 14, height: 56, borderBottom: i < 4 ? `1px solid ${C.mist}` : undefined, opacity: clamp01(r * 3) }}>
            <Ico n={ic} s={22} c={C.slate} w={2.1} />
            <div style={{ width: 128, fontFamily: FONT, fontWeight: 600, fontSize: 19, color: C.muted, whiteSpace: "nowrap" }}>{label}</div>
            <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 21, letterSpacing: "-0.015em", color: C.ink, whiteSpace: "nowrap" }}>{val.slice(0, n)}</div>
          </div>
        );
      })}
    </div>
  </div>
);

/* ---------- an opportunity (layer 4's output; hand-off D → E) ---------- */
// A scored opportunity found by the opportunity agent: type icon, title, the PDF's one-line purpose, and a score bar.
// p 0..1 builds it (the score counts up). x, y = centre; w 380 × h 200.
export const OPPS = [
  { key: "partnership", icon: "handshake", t: "Partnership", sub: "Partner to partner", score: 86, agent: "Partnership" },
  { key: "referral", icon: "share", t: "Referral", sub: "Who refers whom", score: 78, agent: "Referral" },
  { key: "investment", icon: "investor", t: "Investment", sub: "Partner to investor", score: 72, agent: "Investor match" },
  { key: "upsell", icon: "up", t: "Existing client", sub: "Upsell opportunity", score: 91, agent: "Upsell" },
];
export const OPP = { w: 380, h: 200, xs: [330, 750, 1170, 1590], y: 560 };   // the hand-off row at sD
export const OppCard: React.FC<{ i: number; x: number; y: number; s?: number; p?: number; o?: number; hi?: number }> = ({ i, x, y, s = 1, p = 1, o = 1, hi = 0 }) => {
  const d = OPPS[i], sc = Math.round(d.score * ARRIVE(clamp01((p - 0.3) / 0.7)));
  return (
    <div style={{ position: "absolute", left: x - OPP.w / 2, top: y - OPP.h / 2, width: OPP.w, height: OPP.h, transform: `scale(${s})`, transformOrigin: "50% 50%", opacity: o, ...CARD, borderRadius: 24, padding: 24,
      boxShadow: hi > 0 ? `0 0 0 ${3 * hi}px ${C.cyan}, ${SHADOW}` : SHADOW }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 52, height: 52, borderRadius: 14, background: C.cyanTint, display: "flex", alignItems: "center", justifyContent: "center" }}><Ico n={d.icon} s={28} c={C.cyan} w={2.1} /></div>
        <div>
          <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 26, letterSpacing: "-0.03em", color: C.ink, whiteSpace: "nowrap" }}>{d.t}</div>
          <div style={{ fontFamily: FONT, fontWeight: 500, fontSize: 18, color: C.muted, whiteSpace: "nowrap" }}>{d.sub}</div>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 30 }}>
        <div style={{ flex: 1, height: 10, borderRadius: 5, background: C.mist, overflow: "hidden" }}><div style={{ width: `${sc}%`, height: "100%", borderRadius: 5, background: `linear-gradient(90deg, ${C.cyanLight}, ${C.cyan})` }} /></div>
        <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 22, color: C.ink, width: 44, textAlign: "right" }}>{sc}</div>
      </div>
      <div style={{ fontFamily: FONT, fontWeight: 500, fontSize: 16, color: C.soft, marginTop: 6 }}>Opportunity score</div>
    </div>
  );
};

/* ---------- the pipeline overview (the PDF's seven layers and four gates, restyled) ---------- */
// World coordinates (the map fills the frame at camera identity). Each layer row: a label at the left (number tile,
// name, sub line) and its nodes as compact pills in the content column; gates sit between rows as a dashed navy line
// with the gate badge. The spine (the flow down the middle of the content column) carries packets.
const ROWS = [
  { kind: "layer", n: 1, y: 178 }, { kind: "layer", n: 2, y: 282 }, { kind: "gate", n: 1, y: 340 }, { kind: "layer", n: 3, y: 398 }, { kind: "layer", n: 4, y: 502 },
  { kind: "gate", n: 2, y: 560 }, { kind: "layer", n: 5, y: 618 }, { kind: "gate", n: 3, y: 676 }, { kind: "layer", n: 6, y: 734 }, { kind: "gate", n: 4, y: 792 }, { kind: "layer", n: 7, y: 850 },
] as const;
type MapNode = { icon: string; t: string; kind: "agent" | "tool" };
const MAP_NODES: Record<number, MapNode[]> = {
  1: [{ icon: "chat", t: "Conversations", kind: "tool" }, { icon: "meeting", t: "Meetings", kind: "tool" }, { icon: "mail", t: "Emails", kind: "tool" }, { icon: "doc", t: "Documents", kind: "tool" }],
  2: [{ icon: "spark", t: "Claude summariser", kind: "agent" }],
  3: [{ icon: "db", t: "Knowledge base", kind: "agent" }, { icon: "users", t: "Client ecosystem", kind: "agent" }],
  4: [{ icon: "globe", t: "External data", kind: "tool" }, { icon: "spark", t: "Opportunity agent", kind: "agent" }],
  5: [{ icon: "rocket", t: "Venture studio", kind: "agent" }, { icon: "handshake", t: "Partnership", kind: "agent" }, { icon: "up", t: "Upsell", kind: "agent" }, { icon: "share", t: "Referral", kind: "agent" }, { icon: "investor", t: "Investor match", kind: "agent" }],
  6: [{ icon: "investor", t: "Investors", kind: "tool" }, { icon: "building", t: "Clients", kind: "tool" }, { icon: "handshake", t: "Partners", kind: "tool" }, { icon: "share", t: "Referrals, leads", kind: "tool" }],
  7: [{ icon: "send", t: "Send, log replies", kind: "tool" }],
};
export const MAP = { left: 120, labelW: 330, cx0: 520, cx1: 1700, spineX: 1110, rows: ROWS, nodes: MAP_NODES, pillH: 50 };
export const mapRowY = (layer: number) => ROWS.find((r) => r.kind === "layer" && r.n === layer)!.y;
export const mapGateY = (gate: number) => ROWS.find((r) => r.kind === "gate" && r.n === gate)!.y;
// centre of node i of a layer in the map (pills are spread evenly across the content column)
export const mapNodeX = (layer: number, i: number) => {
  const n = MAP_NODES[layer].length, span = MAP.cx1 - MAP.cx0;
  return n === 1 ? MAP.spineX : MAP.cx0 + (span * (i + 0.5)) / n;
};
const MapPill: React.FC<{ node: MapNode; x: number; y: number; w: number; dim: number; glow: number }> = ({ node, x, y, w, dim, glow }) => {
  const agent = node.kind === "agent";
  return (
    <div style={{ position: "absolute", left: x - w / 2, top: y - MAP.pillH / 2, width: w, height: MAP.pillH, borderRadius: 14, background: C.white, boxSizing: "border-box", display: "flex", alignItems: "center",
      gap: 10, padding: "0 14px 0 8px", opacity: 1 - 0.55 * dim,
      border: agent ? `1.5px solid ${glow > 0 ? `rgba(33,138,179,${0.4 + 0.5 * glow})` : "#CFE3EE"}` : `1px solid ${C.line}`, boxShadow: `0 0 0 ${6 * glow}px rgba(102,184,219,${0.18 * glow}), 0 10px 22px -14px rgba(41,58,81,0.25)` }}>
      <div style={{ width: 34, height: 34, borderRadius: 10, background: agent ? C.cyanTint : C.mist, display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
        <Ico n={node.icon} s={20} c={agent ? C.cyan : C.slate} w={2.2} fill={node.icon === "spark" ? C.cyan : "none"} />
      </div>
      <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 18, letterSpacing: "-0.02em", color: C.ink, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{node.t}</div>
    </div>
  );
};
// The overview. rows: 0..1 build per layer (7 values) — a layer's label and pills rise in, its spine segment draws;
// gates: 0..1 build per gate (4 values); approved: 0..1 per gate (the badge turns navy and the line goes solid);
// dim: 0..1 per layer (recede a layer to focus another); glow: 0..1 per layer (its agents work); loop 0..1 draws the
// feedback loop from layer 7 back to layer 3 at the right edge; g = frame for the packets on the spine (packets
// only run on built segments). o = overall opacity.
export const PipelineMap: React.FC<{ g: number; rows?: number[]; gates?: number[]; approved?: number[]; dim?: number[]; glow?: number[]; loop?: number; packets?: boolean; o?: number }> = ({
  g, rows = [1, 1, 1, 1, 1, 1, 1], gates = [1, 1, 1, 1], approved = [0, 0, 0, 0], dim = [0, 0, 0, 0, 0, 0, 0], glow = [0, 0, 0, 0, 0, 0, 0], loop = 0, packets = true, o = 1 }) => {
  if (o <= 0) return null;
  const layerRows = ROWS.filter((r) => r.kind === "layer");
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o }}>
      {/* the spine: segments between consecutive layers, drawn when the lower layer builds */}
      {layerRows.slice(1).map((r, i) => {
        const a = layerRows[i].y + MAP.pillH / 2 + 4, b = r.y - MAP.pillH / 2 - 4, p = ARRIVE(clamp01(rows[r.n - 1] * 1.4));
        return <Flow key={r.n} x1={MAP.spineX} y1={a} x2={MAP.spineX} y2={b} p={p} g={g + i * 7} width={2.5} color={C.faint} packets={packets ? 1 : 0} speed={0.9} pcolor={C.navy} po={1 - 0.6 * Math.max(dim[i], dim[r.n - 1])} />;
      })}
      {/* the feedback loop: from layer 7 round the right side back into layer 3 */}
      {loop > 0 && (() => {
        const y7 = mapRowY(7), y3 = mapRowY(3), xr = 1790, X7 = 1300, X3 = 1588, L = (xr - X7) + (y7 - y3) + (xr - X3);
        const d = `M ${X7} ${y7} H ${xr - 30} Q ${xr} ${y7} ${xr} ${y7 - 30} V ${y3 + 30} Q ${xr} ${y3} ${xr - 30} ${y3} H ${X3}`;
        const t = (((g / 30) * 0.35) % 1 + 1) % 1;
        return (
          <svg style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, overflow: "visible" }}>
            <path d={d} fill="none" stroke={C.cyan} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={`${L} ${L}`} strokeDashoffset={L * (1 - ARRIVE(loop))} />
            {loop >= 1 && <path d={`M ${X3 + 18} ${y3 - 9} L ${X3} ${y3} L ${X3 + 18} ${y3 + 9}`} fill="none" stroke={C.cyan} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />}
            {loop >= 1 && (() => {
              // a packet running round the loop
              const seg = [xr - X7, y7 - y3, xr - X3], tot = seg[0] + seg[1] + seg[2]; let s = t * tot; let x = X7, y = y7;
              if (s < seg[0]) { x = X7 + s; } else if ((s -= seg[0]) < seg[1]) { x = xr; y = y7 - s; } else { s -= seg[1]; x = xr - s; y = y3; }
              return <circle cx={x} cy={y} r={7} fill={C.cyan} />;
            })()}
          </svg>
        );
      })()}
      {ROWS.map((r) => {
        if (r.kind === "gate") {
          const b = ARRIVE(clamp01(gates[r.n - 1])), ap = clamp01(approved[r.n - 1]);
          if (b <= 0) return null;
          return (
            <div key={`g${r.n}`} style={{ position: "absolute", left: MAP.cx0 - 60, top: r.y, width: MAP.cx1 - MAP.cx0 + 120, opacity: b }}>
              <div style={{ position: "absolute", left: 0, right: 0, top: -1, height: 0, borderTop: `2px ${ap > 0.5 ? "solid" : "dashed"} ${ap > 0.5 ? C.navy : "rgba(52,74,101,0.45)"}`, transformOrigin: "0 50%", transform: `scaleX(${b})` }} />
              <div style={{ position: "absolute", left: 0, top: 0, transform: "translateY(-50%)" }}><GateBadge n={r.n} size={15} approved={ap} /></div>
            </div>
          );
        }
        const L = LAYERS[r.n - 1], b = clamp01(rows[r.n - 1]), dm = dim[r.n - 1];
        if (b <= 0) return null;
        const nodes = MAP_NODES[r.n], span = MAP.cx1 - MAP.cx0, w = Math.min(330, span / nodes.length - 22);
        return (
          <div key={`l${r.n}`}>
            <div style={{ position: "absolute", left: MAP.left, top: r.y - 26, display: "flex", gap: 14, opacity: ARRIVE(b) * (1 - 0.55 * dm), transform: `translateX(${(1 - ARRIVE(b)) * -24}px)` }}>
              <div style={{ width: 40, height: 40, borderRadius: 11, background: GRAD, color: C.white, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 700, fontSize: 17, marginTop: 4 }}>{L.n}</div>
              <div>
                <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 23, letterSpacing: "-0.03em", color: C.ink, whiteSpace: "nowrap" }}>{L.name}</div>
                <div style={{ fontFamily: FONT, fontWeight: 500, fontSize: 15, color: C.soft, whiteSpace: "nowrap" }}>{L.sub}</div>
              </div>
            </div>
            {nodes.map((nd, i) => {
              const bi = ARRIVE(clamp01(b * 1.6 - i * 0.15));
              return <div key={i} style={{ position: "absolute", left: 0, top: 0, opacity: bi, transform: `translateY(${(1 - bi) * 16}px)` }}>
                <MapPill node={nd} x={mapNodeX(r.n, i)} y={r.y} w={nodes.length === 1 ? 360 : w} dim={dm} glow={glow[r.n - 1]} />
              </div>;
            })}
            {r.n === 3 && <div style={{ position: "absolute", left: MAP.spineX - 40, top: r.y - 14, width: 80, display: "flex", justifyContent: "center", opacity: ARRIVE(b) * (1 - 0.55 * dm) }}><Ico n="sync" s={28} c={C.faint} w={2.2} /></div>}
          </div>
        );
      })}
    </div>
  );
};
// The map's legend (the PDF's key): AI agent, tool or data, management gate. Place at (x, y).
export const MapLegend: React.FC<{ x: number; y: number; o?: number }> = ({ x, y, o = 1 }) => (
  <div style={{ position: "absolute", left: x, top: y, display: "flex", gap: 26, alignItems: "center", opacity: o, fontFamily: FONT, fontWeight: 600, fontSize: 16, color: C.muted }}>
    <span style={{ display: "flex", alignItems: "center", gap: 8 }}><span style={{ width: 22, height: 22, borderRadius: 7, background: C.cyanTint, display: "flex", alignItems: "center", justifyContent: "center" }}><Ico n="spark" s={13} c={C.cyan} fill={C.cyan} /></span>AI agent</span>
    <span style={{ display: "flex", alignItems: "center", gap: 8 }}><span style={{ width: 22, height: 22, borderRadius: 7, background: C.mist, display: "flex", alignItems: "center", justifyContent: "center" }}><Ico n="db" s={13} c={C.slate} /></span>Tool or data</span>
    <span style={{ display: "flex", alignItems: "center", gap: 8 }}><span style={{ width: 22, height: 22, borderRadius: 7, background: C.gateTint, display: "flex", alignItems: "center", justifyContent: "center" }}><Ico n="userCheck" s={13} c={C.navy} /></span>Management gate</span>
  </div>
);

/* ---------- ground ---------- */
// The site's ground: off-white with a very soft navy haze; a slow drift keeps large areas alive (no static page).
export const Ground: React.FC<{ g: number; haze?: number }> = ({ g, haze = 1 }) => {
  const a = Math.sin(g / 90) * 60, b = Math.cos(g / 120) * 50;
  return (
    <div style={{ position: "absolute", inset: 0, background: C.bg, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 1180 + a, top: -420 + b, width: 1300, height: 1000, borderRadius: "50%", background: "radial-gradient(closest-side, rgba(63,88,120,0.10), rgba(63,88,120,0))", opacity: haze }} />
      <div style={{ position: "absolute", left: -520 - b, top: 560 + a * 0.6, width: 1200, height: 900, borderRadius: "50%", background: "radial-gradient(closest-side, rgba(102,184,219,0.09), rgba(102,184,219,0))", opacity: haze }} />
    </div>
  );
};

/* ---------- a cursor (management's hand on approvals) ---------- */
export const Cursor: React.FC<{ x: number; y: number; press?: number; o?: number }> = ({ x, y, press = 0, o = 1 }) => (
  <svg width={44} height={44} viewBox="0 0 44 44" style={{ position: "absolute", left: x - 6, top: y - 4, opacity: o, transform: `scale(${1 - 0.12 * press})`, transformOrigin: "6px 4px", overflow: "visible" }}>
    <path d="M6 4 L6 34 L14 26 L20 40 L26 37 L20 24 L31 24 Z" fill={C.ink} stroke={C.white} strokeWidth={2.4} strokeLinejoin="round" />
  </svg>
);

export { ARRIVE, C, DEPART, FONT, GRAD, LIN, MOVE, POP, RADIUS, SHADOW, SHADOW_BIG, SNAP, clamp01, mix };
