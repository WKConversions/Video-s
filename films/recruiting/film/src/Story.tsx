// Recruiting Rewards — "Hiring, simplified." One continuous stage around the platform itself: the scattered mess of
// hiring gathers into one window, and the film walks through the product the way the client's own demo does
// (describe the role, set the reward, publish; recruiters take it on; candidates arrive with match scores; compare,
// shortlist, message, interview, move through the stages; hired, and only then invoiced), then the recruiter's side,
// and the mess is pulled into the window again before the logo. Bright: the site's light theme, green accent.
import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { T } from "./clock";
import { ARRIVE, C, DEPART, MOVE, SMALLPOP, clamp01, mix } from "./lib";
import { Grain } from "./saas";
import { breathe, off } from "./kinetic";

const k = (g: number, at: string | number, dur: number, ease = ARRIVE) => T.k(g, at, dur, ease);
const f = (at: string | number) => T.f(at);
const drift = (g: number, from: string | number, pps: number) => {
  const t = (g - f(from)) / 30; if (t <= 0) return 0; return pps * (t < 0.4 ? (t * t) / 0.8 : t - 0.2);
};
const typed = (g: number, at: string, text: string, cps = 30) => text.slice(0, Math.max(0, Math.min(text.length, Math.floor(((g - f(at)) / 30) * cps))));
const SERIF = "Lora", SANS = "Manrope";

/* ---------- icons (monoline, the platform's style) ---------- */
const P: Record<string, React.ReactNode> = {
  plus: <><path d="M24 10 V38 M10 24 H38" /></>,
  kanban: <><rect x="7" y="9" width="9" height="30" rx="2" /><rect x="20" y="9" width="9" height="20" rx="2" /><rect x="33" y="9" width="8" height="25" rx="2" /></>,
  briefcase: <><rect x="6" y="15" width="36" height="25" rx="5" /><path d="M17 15 V11 a4 4 0 0 1 4 -4 h6 a4 4 0 0 1 4 4 V15" /><path d="M6 26 H42" /></>,
  chat: <><path d="M8 12 a5 5 0 0 1 5 -5 h22 a5 5 0 0 1 5 5 v14 a5 5 0 0 1 -5 5 H20 l-8 7 v-7 h0 a5 5 0 0 1 -4 -5 Z" /></>,
  users: <><circle cx="18" cy="17" r="6" /><path d="M7 38 c0 -7 5 -11 11 -11 s11 4 11 11" /><circle cx="33" cy="15" r="5" /><path d="M31 26 c6 0 10 4 10 10" /></>,
  globe: <><circle cx="24" cy="24" r="17" /><path d="M7 24 H41" /><path d="M24 7 c-6 6 -6 28 0 34 c6 -6 6 -28 0 -34" /></>,
  coins: <><ellipse cx="24" cy="14" rx="14" ry="6" /><path d="M10 14 v8 c0 3.3 6.3 6 14 6 s14 -2.7 14 -6 v-8" /><path d="M10 22 v8 c0 3.3 6.3 6 14 6 s14 -2.7 14 -6 v-8" /></>,
  check: <><path d="M10 25 L20 34 L38 14" /></>,
  star: <><path d="M24 7 l5 11 12 1 -9 8 3 12 -11 -7 -11 7 3 -12 -9 -8 12 -1 Z" /></>,
  mail: <><rect x="6" y="11" width="36" height="26" rx="4" /><path d="M7 13 L24 26 L41 13" /></>,
  file: <><path d="M12 6 H29 L37 14 V42 H12 Z" /><path d="M29 6 V14 H37" /><path d="M17 24 H32 M17 31 H32" /></>,
  sheet: <><rect x="8" y="7" width="32" height="34" rx="3" /><path d="M8 17 H40 M8 27 H40 M20 7 V41" /></>,
  phone: <><path d="M14 7 l6 1 3 8 -4 3 c2 5 5 8 10 10 l3 -4 8 3 1 6 c-1 3 -4 5 -7 5 C20 39 9 28 9 13 c0 -3 2 -6 5 -6 Z" /></>,
  calendar: <><rect x="7" y="10" width="34" height="31" rx="4" /><path d="M7 19 H41 M16 6 V13 M32 6 V13" /></>,
  arrow: <><path d="M8 24 H38" /><path d="M28 14 L38 24 L28 34" /></>,
  search: <><circle cx="21" cy="21" r="12" /><path d="M30 30 L41 41" /></>,
  pin: <><path d="M24 43 c-9 -10 -14 -17 -14 -24 a14 14 0 0 1 28 0 c0 7 -5 14 -14 24 Z" /><circle cx="24" cy="19" r="5" /></>,
  send: <><path d="M6 23 L42 7 L30 42 L23 27 Z" /><path d="M23 27 L42 7" /></>,
  bolt: <><path d="M27 5 L11 27 H23 L20 43 L37 20 H25 Z" /></>,
  tag: <><path d="M6 8 H24 L42 26 L26 42 L6 22 Z" /><circle cx="15" cy="16" r="3" /></>,
};
const Ico: React.FC<{ n: string; s?: number; c?: string; w?: number; fill?: string }> = ({ n, s = 24, c = C.ink, w = 2.6, fill = "none" }) => (
  <svg width={s} height={s} viewBox="0 0 48 48" fill={fill} stroke={c} strokeWidth={w * (48 / s) * (s / 28)} strokeLinecap="round" strokeLinejoin="round" style={{ display: "block", flex: "none" }}>{P[n]}</svg>
);

/* ---------- small pieces ---------- */
const box = (x: number, y: number, w: number, h: number, extra?: React.CSSProperties): React.CSSProperties => ({ position: "absolute", left: 0, top: 0, width: w, height: h, transform: `translate(${x}px, ${y}px)`, ...extra });
const card: React.CSSProperties = { background: C.white, border: `1.5px solid ${C.line}`, borderRadius: 18, boxShadow: "0 1px 2px rgba(28,25,23,0.04), 0 10px 30px -14px rgba(28,25,23,0.16)" };
const HUES = [[C.greenSoft, C.greenStrong], [C.amberBg, C.amberText], [C.infoBg, C.infoText], [C.purpBg, C.purpText], [C.okBg, C.okText], ["#FBE9E2", C.clay]];
const Initials: React.FC<{ name: string; s?: number; hue?: number }> = ({ name, s = 44, hue = 0 }) => {
  const [bg, fg] = HUES[hue % HUES.length];
  return <div style={{ width: s, height: s, borderRadius: s, background: bg, color: fg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontWeight: 800, fontSize: s * 0.38, flex: "none" }}>{name.split(" ").map((p) => p[0]).join("")}</div>;
};
const Face: React.FC<{ src: string; s: number; ring?: string; style?: React.CSSProperties }> = ({ src, s, ring = C.white, style }) => (
  <div style={{ width: s, height: s, borderRadius: s, overflow: "hidden", border: `4px solid ${ring}`, boxShadow: "0 10px 24px rgba(28,25,23,0.18)", background: C.sand, flex: "none", ...style }}>
    <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 30%", transform: "scale(1.25)" }} />
  </div>
);
const AI: React.FC<{ v: number; s?: number; on?: number }> = ({ v, s = 16, on = 0 }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: s * 0.3, padding: `${s * 0.22}px ${s * 0.5}px`, borderRadius: s, fontFamily: SANS, fontWeight: 800, fontSize: s,
    background: on > 0.5 ? C.okBg : C.amberBg, color: on > 0.5 ? C.okText : C.amberText, fontVariantNumeric: "tabular-nums", border: `1.2px solid ${on > 0.5 ? "#A9E8C1" : C.amberLine}`, whiteSpace: "nowrap", flex: "none" }}>
    <span style={{ fontSize: s * 0.78, opacity: 0.8 }}>AI</span>{v.toFixed(1)}
  </div>
);
const Stars: React.FC<{ n: number; s?: number; of?: number }> = ({ n, s = 16, of = 5 }) => (
  <div style={{ display: "flex", gap: s * 0.18 }}>{Array.from({ length: of }, (_, i) => <Ico key={i} n="star" s={s} c={i < n ? C.amber : "#D9D4CC"} fill={clamp01(n - i) > 0.5 ? C.amber : "none"} w={2} />)}</div>
);
const Pill: React.FC<{ t: string; bg?: string; fg?: string; s?: number; icon?: string; border?: string; style?: React.CSSProperties }> = ({ t, bg = C.sand, fg = C.ink, s = 18, icon, border, style }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: s * 0.4, padding: `${s * 0.35}px ${s * 0.75}px`, borderRadius: s * 2, background: bg, color: fg, fontFamily: SANS, fontWeight: 700, fontSize: s, whiteSpace: "nowrap",
    border: border ? `1.5px solid ${border}` : undefined, flex: "none", ...style }}>{icon && <Ico n={icon} s={s * 1.05} c={fg} w={2.8} />}{t}</div>
);
const Btn: React.FC<{ t: string; s?: number; press?: number; icon?: string; ghost?: boolean; style?: React.CSSProperties }> = ({ t, s = 22, press = 0, icon, ghost, style }) => (
  <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: s * 0.45, padding: `${s * 0.6}px ${s * 1.1}px`, borderRadius: s * 2, fontFamily: SANS, fontWeight: 800, fontSize: s,
    background: ghost ? C.white : C.green, color: ghost ? C.ink : C.white, border: ghost ? `1.5px solid ${C.line}` : "none", transform: `scale(${1 - press * 0.05})`,
    boxShadow: ghost ? undefined : "0 10px 24px -10px rgba(40,126,97,0.7)", whiteSpace: "nowrap", ...style }}>{t}{icon && <Ico n={icon} s={s * 1.05} c={ghost ? C.ink : C.white} w={3} />}</div>
);
const Bar: React.FC<{ label: string; v: number; k: number; w: number; s?: number }> = ({ label, v, k: kk, w, s = 20 }) => (
  <div style={{ width: w }}>
    <div style={{ display: "flex", justifyContent: "space-between", fontFamily: SANS, fontWeight: 700, fontSize: s, color: C.ink }}><span>{label}</span><span style={{ color: C.muted }}>{(v * kk).toFixed(0)}/10</span></div>
    <div style={{ marginTop: s * 0.4, height: s * 0.5, borderRadius: s, background: C.sand, overflow: "hidden" }}><div style={{ width: `${v * 10 * kk}%`, height: "100%", borderRadius: s, background: C.green }} /></div>
  </div>
);

/* ---------- the headline type (the site's Lora, a key word in green) ---------- */
type Wd = { t: string; at: string; green?: boolean };
const Head: React.FC<{ g: number; words: Wd[]; y: number; size: number; out?: string; x?: number }> = ({ g, words, y, size, out, x }) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: x === undefined ? 1920 : undefined, display: "flex", justifyContent: x === undefined ? "center" : "flex-start", gap: size * 0.26,
    transform: `translate(${x ?? 0}px, ${y}px)`, fontFamily: SERIF, fontWeight: 600, fontSize: size, lineHeight: 1.1, letterSpacing: "-0.02em", color: C.ink, whiteSpace: "nowrap" }}>
    {words.map((w, i) => {
      const kk = k(g, w.at, 0.5), o = out ? k(g, off(out, i * 0.04), 0.35, DEPART) : 0;
      return <span key={i} style={{ display: "inline-block", color: w.green ? C.green : C.ink, opacity: Math.min(1, kk * 1.6) * (1 - o), transform: `translateY(${((1 - kk) * 0.3 - o * 0.3) * size}px)`,
        filter: kk < 1 || o > 0 ? `blur(${(1 - kk) * 8 + o * 8}px)` : undefined }}>{w.t}</span>;
    })}
  </div>
);

/* ---------- the cursor ---------- */
type CK = [string, number, number];   // label, x, y (stage)
const CURSOR: { from: string; to: string; keys: CK[]; clicks: string[] }[] = [
  { from: "w:set", to: "w:publish+0.6", keys: [["w:set", 1500, 900], ["w:reward-0.2", 1241, 492], ["w:reward+0.15", 1241, 492], ["w:reward+0.7", 1420, 700], ["w:publish-0.05", 1595, 828], ["w:publish+0.5", 1650, 900]], clicks: ["w:reward", "w:publish"] },
  { from: "w:shortlist-0.4", to: "w:message-0.2", keys: [["w:shortlist-0.4", 1450, 700], ["w:shortlist-0.05", 1248, 352], ["w:shortlist+0.1", 1248, 352], ["w:shortlist+0.5", 1340, 470]], clicks: ["w:shortlist"] },
  { from: "w:interviews", to: "w:move", keys: [["w:interviews", 1300, 940], ["w:interviews+0.55", 1312, 742], ["w:interviews+0.7", 1312, 742], ["w:interviews+1.1", 1400, 830]], clicks: ["w:interviews+0.65"] },
  { from: "rec-0.25", to: "w:explore", keys: [["rec-0.25", 1250, 260], ["w:recruiters4-0.05", 1100, 78], ["w:recruiters4+0.15", 1100, 78], ["w:recruiters4+0.7", 1240, 200]], clicks: ["w:recruiters4"] },
  { from: "w:submit-0.2", to: "w:and4", keys: [["w:submit-0.2", 1480, 800], ["w:qualified+0.05", 1643, 486], ["w:talent-0.05", 1643, 486], ["w:talent+0.4", 1740, 580]], clicks: ["w:talent-0.2"] },
];
const Cursor: React.FC<{ g: number }> = ({ g }) => {
  const seg = CURSOR.find((c) => g >= f(c.from) && g < f(c.to));
  if (!seg) return null;
  let x = seg.keys[0][1], y = seg.keys[0][2];
  for (let i = 1; i < seg.keys.length; i++) {
    const a = seg.keys[i - 1], b = seg.keys[i];
    const t = clamp01((g - f(a[0])) / Math.max(1, f(b[0]) - f(a[0])));
    if (g >= f(a[0])) { const e = MOVE(t); x = mix(a[1], b[1], e); y = mix(a[2], b[2], e); }
  }
  const o = Math.min(clamp01((g - f(seg.from)) / 6), clamp01((f(seg.to) - g) / 6));
  const press = seg.clicks.some((c) => g >= f(c) && g < f(c) + 5) ? 1 : 0;
  const ring = seg.clicks.map((c) => (g - f(c)) / 16).find((t) => t > 0 && t < 1);
  return (
    <>
      {ring !== undefined && <div style={{ position: "absolute", left: 0, top: 0, width: 120, height: 120, borderRadius: 60, border: `4px solid ${C.green}`, transform: `translate(${x - 60}px, ${y - 60}px) scale(${0.2 + ring * 0.9})`, opacity: 1 - ring }} />}
      <svg width={52} height={60} viewBox="0 0 28 32" style={{ position: "absolute", left: 0, top: 0, transform: `translate(${x - 5}px, ${y - 3}px) scale(${1 - press * 0.12})`, opacity: o, overflow: "visible" }}>
        <path d="M2 2 L2 26 L8.5 20 L13 30 L17.5 28 L13 18.5 L22 18.5 Z" fill={C.ink} stroke="#FFFFFF" strokeWidth={2} strokeLinejoin="round" />
      </svg>
    </>
  );
};

/* ---------- 1 · the scattered mess of hiring (opening, and again before the end) ---------- */
const MESS = [
  { i: "mail", t: "Re: CV attached", x: 330, y: 250, r: -7 }, { i: "sheet", t: "candidates_v7.xlsx", x: 1590, y: 230, r: 6 },
  { i: "file", t: "CV_final_FINAL.pdf", x: 1640, y: 790, r: -5 }, { i: "mail", t: "Fwd: Fwd: Application", x: 290, y: 800, r: 5 },
  { i: "phone", t: "Call the agency back", x: 640, y: 960, r: -4 }, { i: "chat", t: "Any update on the role?", x: 1310, y: 950, r: 4 },
  { i: "mail", t: "47 unread", x: 730, y: 120, r: 3 }, { i: "file", t: "Agency invoice: 25% fee", x: 1220, y: 115, r: -5 },
];
const Mess: React.FC<{ g: number; inAt: string; gather: string; to: [number, number]; low?: boolean }> = ({ g, inAt, gather, to, low }) => (
  <>
    {MESS.map((m, i) => {
      const a = k(g, off(inAt, i * 0.05), 0.5), q = k(g, off(gather, i * 0.035), 0.75, MOVE);
      if (a <= 0 || q >= 1) return null;
      const dx = Math.sin(g / 37 + i) * 8 + (m.x < 960 ? -1 : 1) * drift(g, inAt, 10), dy = Math.cos(g / 41 + i * 2) * 6;
      const my = low && m.y < 300 ? m.y + 250 : m.y;
      const x = mix(m.x + dx, to[0], q), y = mix(my + dy, to[1], q);
      return (
        <div key={i} style={{ ...box(x - 170, y - 42, 340, 84), ...card, borderRadius: 16, display: "flex", alignItems: "center", gap: 16, padding: "0 20px", boxSizing: "border-box",
          opacity: Math.min(1, a * 1.5) * (1 - clamp01((q - 0.6) / 0.4)), transform: `translate(${x - 170}px, ${y - 42}px) rotate(${m.r * (1 - q)}deg) scale(${(0.85 + 0.15 * a) * (1 - 0.8 * q)})`,
          filter: a < 1 ? `blur(${(1 - a) * 6}px)` : undefined }}>
          <div style={{ width: 46, height: 46, borderRadius: 12, background: i % 3 === 1 ? C.okBg : i % 3 === 2 ? "#FBE9E2" : C.infoBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Ico n={m.i} s={26} c={i % 3 === 1 ? C.okText : i % 3 === 2 ? C.clay : C.infoText} />
          </div>
          <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 22, color: C.ink, whiteSpace: "nowrap" }}>{m.t}</div>
        </div>
      );
    })}
  </>
);

/* ---------- the window (the platform), and where it is ---------- */
const WW = 1600, WH = 900, SB = 270;
const LOGO = { x: 960, y: 500, w: 1000 };           // the logo for "Meet Recruiting Rewards"
const ENDL = { x: 960, y: 400, w: 860 };            // the end card's logo
const iconAt = (L: { x: number; y: number; w: number }) => ({ x: L.x - L.w / 2 + (L.w * 52) / 919, y: L.y });
const win = (g: number) => {
  if (g < f("create")) {
    const inn = k(g, "w:one-0.3", 0.75), fold = k(g, "meet", 0.6, MOVE);
    const ic = iconAt(LOGO);
    return { x: mix(960, ic.x, fold), y: mix(560, ic.y, fold), s: mix(mix(0.25, 0.84, inn), 0.03, fold), o: Math.min(1, inn * 1.6) * (1 - clamp01((fold - 0.6) / 0.4)), dim: 0 };
  }
  const back = k(g, "create", 0.75, MOVE), small = k(g, "inbox", 0.7, MOVE), fold = k(g, "end_", 0.6, MOVE);
  const ic = iconAt(LOGO), ie = iconAt(ENDL);
  const dim = k(g, "w:goes-0.15", 0.5) * (1 - k(g, "arrive+0.2", 0.5));
  let x = mix(ic.x, 960, back), y = mix(ic.y, 545, back), s = mix(0.03, 1, back);
  s = mix(s, 0.7, small); y = mix(y, 650, small);
  y += 40 * k(g, "rec-0.4", 0.6, MOVE) * (1 - k(g, "inbox", 0.6, MOVE));
  x = mix(x, ie.x, fold); y = mix(y, ie.y, fold); s = mix(s, 0.03, fold);
  return { x, y, s, o: clamp01(back * 3) * (1 - clamp01((fold - 0.6) / 0.4)), dim };
};

// which view the window shows
const mode = (g: number) => (g >= f("w:recruiters4") && g < f("inbox") ? "rec" : "co");
const navActive = (g: number) => {
  if (mode(g) === "rec") return g < f("w:submit-0.1") ? 0 : g < f("w:and4") ? 1 : 3;
  if (g >= f("create") && g < f("arrive")) return 0;
  return 1;
};
const Sidebar: React.FC<{ g: number }> = ({ g }) => {
  const rec = mode(g) === "rec";
  const items = rec ? [["globe", "Marketplace"], ["briefcase", "Assignments"], ["users", "Candidates"], ["coins", "Earnings"]] : [["plus", "Create job ad"], ["kanban", "Pipeline"], ["briefcase", "Jobs"], ["chat", "Messages"]];
  const act = navActive(g);
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: SB, height: WH, background: C.side, borderRight: `1.5px solid ${C.line}` }}>
      <Img src={staticFile("img/logo-icon.svg")} style={{ position: "absolute", left: 26, top: 24, width: 46, height: 46 }} />
      <div style={{ position: "absolute", left: 18, top: 94, width: SB - 36, height: 58, borderRadius: 14, border: `1.5px solid ${C.line}`, background: C.white, display: "flex", alignItems: "center", gap: 12, padding: "0 12px", boxSizing: "border-box" }}>
        <div style={{ width: 34, height: 34, borderRadius: 9, background: rec ? C.navy : C.green, color: C.white, fontFamily: SANS, fontWeight: 800, fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>{rec ? "R" : "N"}</div>
        <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 18, color: C.ink, whiteSpace: "nowrap" }}>{rec ? "Recruiter workspace" : "Nordvik Systems AB"}</div>
      </div>
      {items.map(([ic, t], i) => (
        <div key={t} style={{ position: "absolute", left: 14, top: 178 + i * 60, width: SB - 28, height: 50, borderRadius: 12, display: "flex", alignItems: "center", gap: 14, padding: "0 14px", boxSizing: "border-box",
          background: i === act ? C.greenSoft : "transparent", color: i === act ? C.greenStrong : "#57524C", fontFamily: SANS, fontWeight: i === act ? 800 : 600, fontSize: 21 }}>
          <Ico n={ic} s={24} c={i === act ? C.greenStrong : "#57524C"} />{t}
        </div>
      ))}
      <div style={{ position: "absolute", left: 18, bottom: 22, width: SB - 36, height: 74, borderRadius: 14, background: C.white, border: `1.5px solid ${C.line}`, padding: "14px 16px", boxSizing: "border-box" }}>
        <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 18, color: C.ink }}>Invite team</div>
        <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 15, color: C.muted, marginTop: 3 }}>Add your team</div>
      </div>
    </div>
  );
};

/* ---------- the pipeline (Candidate pipeline, kanban) ---------- */
const COLS = ["New", "Shortlist", "Interview", "Tests", "Reference check", "Hired"];
const COLW = 196, COLG = 12, CX0 = 44, CY0 = 186, SLOT = 128;
const colX = (c: number) => CX0 + c * (COLW + COLG);
type Cand = { n: string; t: string; ai: number; hue: number; col: number; slot: number; at: string; stars?: number };
const OTHERS: Cand[] = [
  { n: "Julia Berg", t: "Account Executive", ai: 7.5, hue: 2, col: 0, slot: 1, at: "w:arrive+0.25", stars: 3 },
  { n: "Linnea Wallin", t: "Senior AE · SaaS", ai: 8.0, hue: 3, col: 0, slot: 2, at: "w:arrive+0.45", stars: 4 },
  { n: "Jonas Ferm", t: "Sales Manager", ai: 7.1, hue: 4, col: 0, slot: 3, at: "w:see+0.1", stars: 3 },
  { n: "Fredrik Lindahl", t: "Account Executive", ai: 8.5, hue: 1, col: 1, slot: 1, at: "w:one2-0.1", stars: 4 },
  { n: "Henrik Dalgren", t: "Business Developer", ai: 7.0, hue: 5, col: 2, slot: 1, at: "w:one2", stars: 3 },
  { n: "Moa Novak", t: "Account Executive", ai: 7.5, hue: 2, col: 2, slot: 2, at: "w:one2+0.1", stars: 4 },
  { n: "Elin Larsson", t: "AE · Fintech", ai: 7.5, hue: 3, col: 3, slot: 1, at: "w:clear-0.1", stars: 4 },
  { n: "Malin Malmberg", t: "Key Account Manager", ai: 8.0, hue: 4, col: 4, slot: 1, at: "w:clear", stars: 4 },
  { n: "Karl Hansen", t: "Sales Lead", ai: 7.0, hue: 0, col: 1, slot: 2, at: "w:clear+0.1", stars: 3 },
];
const HOME: Cand[] = [   // an existing role's pipeline, at the start
  { n: "Astrid Norling", t: "Account Manager", ai: 8.0, hue: 0, col: 0, slot: 0, at: "w:one", stars: 4 },
  { n: "Nils Hansen", t: "Sales Manager", ai: 7.2, hue: 2, col: 0, slot: 1, at: "w:one", stars: 3 },
  { n: "Filip Ranstam", t: "Account Manager", ai: 9.0, hue: 1, col: 1, slot: 0, at: "w:one", stars: 5 },
  { n: "Johanna Ekholm", t: "Key Account Manager", ai: 7.5, hue: 3, col: 1, slot: 1, at: "w:one", stars: 4 },
  { n: "Marcus Lindqvist", t: "Account Manager", ai: 7.0, hue: 4, col: 2, slot: 0, at: "w:one", stars: 3 },
  { n: "Wilma Sundin", t: "Sales Lead", ai: 8.5, hue: 5, col: 3, slot: 0, at: "w:one", stars: 4 },
  { n: "Rebecka Lund", t: "Account Manager", ai: 7.5, hue: 2, col: 4, slot: 0, at: "w:one", stars: 4 },
  { n: "Anders Holm", t: "Sales Manager", ai: 8.0, hue: 0, col: 2, slot: 1, at: "w:one", stars: 4 },
];
const OSKAR = { n: "Oskar Vinge", t: "Account Executive · SaaS", ai: 9.0, hue: 1 };
// Oskar's column over time: arrives, shortlisted, interview, tests, reference check, hired
const oskarCol = (g: number): [number, number, number] => {   // from col, to col, progress
  const steps: [string, number][] = [["short+0.35", 1], ["w:interviews+0.75", 2], ["w:through", 3], ["w:stage", 4], ["w:hire", 5]];
  let c = 0;
  for (const [at, to] of steps) { const p = k(g, at, 0.6, MOVE); if (p <= 0) return [c, c, 0]; if (p < 1) return [c, to, p]; c = to; }
  return [c, c, 0];
};
const CandCard: React.FC<{ c: { n: string; t: string; ai: number; hue: number; stars?: number }; x: number; y: number; o?: number; s?: number; hi?: number; aiOn?: number; aiV?: number; aiO?: number; star?: number }> = ({ c, x, y, o = 1, s = 1, hi = 0, aiOn = 0, aiV, aiO = 1, star = 0 }) =>
  o <= 0.01 ? null : (
    <div style={{ ...box(x, y, COLW, 116), ...card, borderRadius: 14, opacity: o, transform: `translate(${x}px, ${y}px) scale(${s})`, padding: 12, boxSizing: "border-box",
      boxShadow: hi > 0 ? `0 0 0 ${3 * hi}px ${C.green}, 0 16px 34px -14px rgba(40,126,97,0.5)` : card.boxShadow }}>
      <div style={{ display: "flex", gap: 9, alignItems: "flex-start" }}>
        <Initials name={c.n} s={34} hue={c.hue} />
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 15, color: C.ink, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.n}</div>
          <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 12, color: C.muted, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginTop: 2 }}>{c.t}</div>
        </div>
      </div>
      <div style={{ position: "absolute", right: 10, bottom: 26, opacity: aiO }}><AI v={aiV ?? c.ai} s={13} on={aiOn} /></div>
      <div style={{ position: "absolute", left: 12, bottom: 30 }}><Stars n={star > 0 ? 5 : c.stars ?? 4} s={13} /></div>
      <div style={{ position: "absolute", left: 12, bottom: 9, display: "flex", alignItems: "center", gap: 6, fontFamily: SANS, fontWeight: 700, fontSize: 12, color: C.green }}><Ico n="mail" s={14} c={C.green} />New message</div>
    </div>
  );
const Pipeline: React.FC<{ g: number; set: "home" | "job"; o: number }> = ({ g, set, o }) => {
  if (o <= 0) return null;
  const home = set === "home";
  const cards = home ? HOME : OTHERS;
  const better = home ? k(g, "w:better", 0.9, MOVE) : 0;
  const [c0, c1, p] = oskarCol(g);
  const oa = k(g, "arrive+0.35", 0.5);
  const ox = mix(colX(c0), colX(c1), p), oy = CY0 - Math.sin(Math.PI * p) * 40;
  const inCompare = g >= f("compare") && g < f("short+0.95");
  const count = (col: number) => cards.filter((c) => c.col === col && k(g, c.at, 0.4) > 0.5).length + (!home && oa > 0.5 && (p > 0.5 ? c1 : c0) === col ? 1 : 0);
  const sweep = home ? 0 : k(g, "w:without", 1.1, MOVE);   // the overview: a light runs along the stages
  const ov = home ? 0 : k(g, "w:without-0.1", 0.9, MOVE) * (1 - k(g, "w:hire-0.1", 0.6, MOVE));
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o, transform: `scale(${1 - 0.07 * ov})`, transformOrigin: "50% 42%" }}>
      <div style={{ position: "absolute", left: 44, top: 36, fontFamily: SERIF, fontWeight: 600, fontSize: 44, color: C.ink, letterSpacing: "-0.01em" }}>Candidate pipeline</div>
      <div style={{ position: "absolute", right: 40, top: 40, display: "flex", gap: 12 }}>
        <Pill t={home ? "Account Manager · Denmark" : "Account Executive, SaaS"} icon="briefcase" bg={C.white} border={C.line} s={18} />
        <Pill t="Kanban" icon="kanban" bg={C.greenSoft} fg={C.greenStrong} s={18} />
      </div>
      <div style={{ position: "absolute", left: 44, top: 104, width: 820, height: 46, borderRadius: 12, border: `1.5px solid ${C.line}`, background: C.white, display: "flex", alignItems: "center", gap: 10, padding: "0 16px", boxSizing: "border-box",
        fontFamily: SANS, fontWeight: 600, fontSize: 17, color: C.muted }}><Ico n="search" s={18} c={C.muted} />Search candidates…</div>
      {COLS.map((name, i) => {
        const lit = clamp01(1 - Math.abs(sweep * 7 - 0.5 - i) / 1.0) * (sweep > 0 && sweep < 1 ? 1 : 0);
        return (
          <div key={name} style={{ position: "absolute", left: colX(i), top: 160, width: COLW, display: "flex", alignItems: "center", gap: 8, fontFamily: SANS, fontWeight: 800, fontSize: 15, color: C.ink, whiteSpace: "nowrap" }}>
            <div style={{ width: 9, height: 9, borderRadius: 5, background: i === 5 ? C.okText : [C.blue, C.amber, C.purpText, C.teal, C.clay][i] }} />{name}
            <span style={{ display: "inline-block", fontWeight: 800, padding: "1px 8px", borderRadius: 10, background: lit > 0.05 ? mixC(C.sand, C.green, lit) : C.sand, color: lit > 0.5 ? C.white : C.muted, transform: `scale(${1 + 0.25 * lit})` }}>{count(i)}</span>
          </div>
        );
      })}
      {COLS.map((_, i) => <div key={`l${i}`} style={{ position: "absolute", left: colX(i), top: 184, width: COLW, height: 690, borderRadius: 14, background: "rgba(242,240,235,0.55)" }} />)}
      {cards.map((c, i) => {
        const a = home ? k(g, off(c.at, 0.05 + i * 0.04), 0.45) : k(g, c.at, 0.45);
        const best = home && c.ai >= 9 ? better : 0;
        return <CandCard key={c.n} c={c} x={colX(c.col)} y={CY0 + 10 + c.slot * SLOT + (1 - a) * 30} o={a} aiV={home ? c.ai * better : undefined} aiO={home ? clamp01(better * 4) : 1} aiOn={best} hi={best} />;
      })}
      {!home && !inCompare && <CandCard c={OSKAR} x={ox} y={oy + 10 + (1 - oa) * 30} o={oa} hi={k(g, "w:profiles-0.1", 0.3) * (1 - k(g, "w:dashboard", 0.4))} star={g >= f("short") ? 1 : 0} />}
    </div>
  );
};
function mixC(a: string, b: string, t: number) {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16)), pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return "#" + pa.map((v, i) => Math.round(mix(v, pb[i], clamp01(t))).toString(16).padStart(2, "0")).join("");
}

/* ---------- create the job: one sentence, the criteria detected ---------- */
const BRIEF = "We're hiring an Account Executive for our SaaS team in Stockholm, hybrid, 3–5 years of B2B sales experience";
const CRIT = [["Role name", "w:add"], ["Seniority", "w:your"], ["Education", ""], ["Location", "w:requirements-0.05"], ["Industry", "w:requirements+0.15"], ["Skills", "w:requirements+0.35"], ["Company", "w:requirements+0.55"]];
const Create: React.FC<{ g: number; o: number; x: number }> = ({ g, o, x }) => {
  if (o <= 0) return null;
  const t = typed(g, "w:create+0.05", BRIEF, 62);
  const n = CRIT.filter(([, at]) => at && g >= f(at)).length;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o, transform: `translateX(${x}px)` }}>
      <Img src={staticFile("img/logo-icon.svg")} style={{ position: "absolute", left: 665 - 40, top: 150, width: 80, height: 80 }} />
      <div style={{ position: "absolute", left: 0, top: 250, width: 1330, textAlign: "center", fontFamily: SERIF, fontWeight: 600, fontSize: 58, color: C.ink, letterSpacing: "-0.015em" }}>Who do you want to hire today?</div>
      <div style={{ position: "absolute", left: 165, top: 360, width: 1000, height: 230, borderRadius: 22, background: C.white, border: `2px solid ${C.green}`, boxShadow: "0 0 0 6px rgba(40,126,97,0.12), 0 20px 40px -24px rgba(28,25,23,0.3)" }}>
        <div style={{ position: "absolute", left: 30, top: 26, right: 30, fontFamily: SANS, fontWeight: 600, fontSize: 30, lineHeight: 1.4, color: C.ink }}>
          {t}<span style={{ display: "inline-block", width: 3, height: 34, marginLeft: 3, verticalAlign: "-6px", background: C.green, opacity: t.length < BRIEF.length && Math.floor(g / 8) % 2 ? 1 : 0.2 }} />
        </div>
        <div style={{ position: "absolute", left: 22, bottom: 20 }}><Pill t={`${n}/7 criteria detected`} icon="search" s={17} bg={n > 0 ? C.greenSoft : C.sand} fg={n > 0 ? C.greenStrong : C.muted} /></div>
        <div style={{ position: "absolute", right: 20, bottom: 16, width: 52, height: 52, borderRadius: 26, background: C.green, display: "flex", alignItems: "center", justifyContent: "center" }}><Ico n="arrow" s={26} c={C.white} w={3} /></div>
      </div>
      <div style={{ position: "absolute", left: 0, top: 625, width: 1330, display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
        {CRIT.map(([c, at]) => {
          const on = at ? k(g, at, 0.35, SMALLPOP) : 0;
          return <div key={c} style={{ transform: `scale(${1 + 0.08 * Math.sin(Math.PI * clamp01(on))})` }}><Pill t={c} icon={on > 0.5 ? "check" : undefined} s={21} bg={on > 0.5 ? C.greenSoft : C.white} fg={on > 0.5 ? C.greenStrong : C.muted} border={on > 0.5 ? "#BFDCCF" : C.line} /></div>;
        })}
      </div>
    </div>
  );
};

/* ---------- set the reward and publish ---------- */
const REW = [["A different price", ""], ["71 250 SEK", "Base level"], ["95 000 SEK", "Recommended"], ["118 750 SEK", "Premium"]];
const Reward: React.FC<{ g: number; o: number; x: number }> = ({ g, o, x }) => {
  if (o <= 0) return null;
  const sel = k(g, "w:reward", 0.3, SMALLPOP), pub = k(g, "w:publish+0.1", 0.35, SMALLPOP);
  const press = g >= f("w:publish") && g < f("w:publish") + 5 ? 1 : 0;
  const pubOk = k(g, "w:publish+0.15", 0.45, SMALLPOP);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o, transform: `translateX(${x}px)` }}>
      <div style={{ position: "absolute", left: 60, top: 34, display: "flex", alignItems: "center", gap: 14, fontFamily: SANS, fontWeight: 700, fontSize: 19, color: C.muted }}>
        <div style={{ width: 28, height: 28, borderRadius: 14, background: C.green, display: "flex", alignItems: "center", justifyContent: "center" }}><Ico n="check" s={18} c={C.white} w={3.4} /></div>Write the ad
        <div style={{ width: 70, height: 2, background: C.line }} />
        <div style={{ width: 28, height: 28, borderRadius: 14, border: `2px solid ${C.green}`, color: C.green, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 800 }}>2</div><span style={{ color: C.ink }}>Publish</span>
      </div>
      <div style={{ position: "absolute", left: 60, top: 92, fontFamily: SERIF, fontWeight: 600, fontSize: 50, color: C.ink, letterSpacing: "-0.01em" }}>Publishing and reward</div>
      <div style={{ position: "absolute", left: 60, top: 160, fontFamily: SANS, fontWeight: 600, fontSize: 22, color: C.muted }}>Set the reward before your ad goes live on the marketplace.</div>
      <div style={{ ...box(60, 220, 1210, 440), ...card, borderRadius: 22 }}>
        <div style={{ position: "absolute", left: 36, top: 28, fontFamily: SERIF, fontWeight: 600, fontSize: 36, color: C.ink }}>Reward</div>
        <div style={{ position: "absolute", left: 36, top: 82, fontFamily: SANS, fontWeight: 600, fontSize: 20, color: C.muted }}>The reward sets how hard recruiters compete for this role. You only pay when the candidate starts.</div>
        {REW.map(([v, l], i) => {
          const on = i === 2 ? sel : 0;
          return (
            <div key={i} style={{ position: "absolute", left: 36 + i * 290, top: 136, width: 270, height: 130, borderRadius: 16, background: on > 0.5 ? C.greenSoft : C.white,
              border: `${on > 0.5 ? 3 : 1.5}px solid ${on > 0.5 ? C.green : C.line}`, transform: `scale(${1 + 0.05 * Math.sin(Math.PI * clamp01(on))})`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6 }}>
              {i === 0 ? <Ico n="tag" s={30} c={C.muted} /> : <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 32, color: on > 0.5 ? C.greenStrong : C.ink }}>{v}</div>}
              <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 16, letterSpacing: "0.08em", textTransform: "uppercase", color: on > 0.5 ? C.greenStrong : C.muted }}>{i === 0 ? v : l}</div>
            </div>
          );
        })}
        <div style={{ position: "absolute", left: 36, right: 36, top: 300, height: 1.5, background: C.line }} />
        <div style={{ position: "absolute", left: 36, right: 36, top: 330, display: "flex", justifyContent: "space-between", fontFamily: SANS, fontWeight: 700, fontSize: 26, color: C.ink }}>
          <span style={{ color: C.muted }}>Total recruitment price</span><span style={{ fontWeight: 800, opacity: 0.25 + 0.75 * sel }}>{sel > 0.5 ? "95 000 SEK" : "—"}</span>
        </div>
        <div style={{ position: "absolute", left: 36, top: 384, display: "flex", alignItems: "center", gap: 10, fontFamily: SANS, fontWeight: 700, fontSize: 19, color: C.okText }}><Ico n="check" s={20} c={C.okText} w={3} />Always free until the job starts</div>
      </div>
      {/* published: a confirmation over the page, which then lifts out as the live vacancy */}
      {pubOk > 0 && <div style={{ position: "absolute", inset: 0, background: "rgba(253,252,251,0.72)", opacity: Math.min(1, pubOk) }} />}
      {pubOk > 0 && (
        <div style={{ ...box(665 - 340, 420 - 150, 680, 300), ...card, borderRadius: 28, opacity: Math.min(1, pubOk * 1.4) * (1 - k(g, "live", 0.25)), transform: `translate(${665 - 340}px, ${420 - 150 + (1 - Math.min(1, pubOk)) * 30}px) scale(${0.86 + 0.14 * pubOk})`,
          boxShadow: "0 40px 90px -30px rgba(28,25,23,0.45)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
          <div style={{ width: 92, height: 92, borderRadius: 46, background: C.green, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${k(g, "w:publish+0.2", 0.4, SMALLPOP)})` }}><Ico n="check" s={50} c={C.white} w={3.6} /></div>
          <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 54, color: C.ink, letterSpacing: "-0.01em" }}>Published</div>
          <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 22, color: C.muted }}>Out to the marketplace after a quick quality check</div>
        </div>
      )}
      <div style={{ position: "absolute", right: 60, top: 700, display: "flex", gap: 16 }}>
        <Btn t="Save draft" ghost s={22} />
        <div style={{ position: "relative" }}>
          <Btn t={pub > 0.5 ? "Published" : "Publish"} icon={pub > 0.5 ? "check" : "send"} s={24} press={press} style={{ background: pub > 0.5 ? C.greenStrong : C.green, minWidth: 210 }} />
        </div>
      </div>
    </div>
  );
};

/* ---------- live: the job leaves the window for the marketplace, recruiters take it on ---------- */
const REC = [["img/r-henning.jpg", "Henning"], ["img/r-sebastian.jpg", "Sebastian"], ["img/r-stephanie.jpg", "Stephanie"], ["img/r-elin.jpg", "Elin"], ["img/r-johan.jpg", "Johan"]];
const recAt = (i: number) => ({ x: 460 + i * 200, y: 700 + (i % 2) * 40 });
const Live: React.FC<{ g: number }> = ({ g }) => {
  if (g < f("live") || g > f("arrive+1.2")) return null;
  const up = k(g, "live", 0.7, MOVE), back = k(g, "arrive", 0.7, MOVE);
  const pulse = k(g, "w:live", 0.5, SMALLPOP);
  const x = mix(mix(1095, 960, up), 1443, back), y = mix(mix(515, 330, up), 153, back), s = mix(mix(0.72, 1, up), 0.31, back);
  return (
    <AbsoluteFill>
      {/* recruiters take it on */}
      {[...REC, ["", "Arthur"]].map(([src, name], i) => {
        const a = k(g, off("w:recruiters2", -0.1 + i * 0.07), 0.5, SMALLPOP), w = k(g, off("w:work", i * 0.06), 0.35, SMALLPOP);
        const p = recAt(i), leave = k(g, off("arrive+0.5", i * 0.04), 0.4, DEPART);
        if (a <= 0) return null;
        const lk = k(g, off("w:recruiters2", 0.1 + i * 0.07), 0.5, MOVE);
        return (
          <React.Fragment key={i}>
            <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, opacity: 1 - leave }}>
              <path d={`M ${p.x} ${p.y - 70} C ${p.x} ${p.y - 170}, ${960 + (p.x - 960) * 0.4} 560, ${960 + (p.x - 960) * 0.35} 482`} fill="none" stroke={C.green} strokeWidth={3} strokeDasharray="1 2" pathLength={1}
                strokeDashoffset={1 - lk} strokeLinecap="round" />
            </svg>
            <div style={{ position: "absolute", left: 0, top: 0, transform: `translate(${p.x - 64}px, ${p.y - 64 + (1 - a) * 40}px) scale(${Math.min(1.05, a) * (1 - 0.3 * leave)})`, opacity: Math.min(1, a) * (1 - leave) }}>
              {src ? <Face src={src} s={128} /> : <div style={{ width: 128, height: 128, borderRadius: 64, border: "4px solid #FFFFFF", boxShadow: "0 10px 24px rgba(28,25,23,0.18)", overflow: "hidden" }}><Initials name="Arthur Berg" s={120} hue={4} /></div>}
              <div style={{ position: "absolute", right: 2, top: 4, width: 30, height: 30, borderRadius: 15, background: C.okText, border: "4px solid #FFFFFF", transform: `scale(${w})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Ico n="bolt" s={14} c={C.white} w={3} />
              </div>
              <div style={{ position: "absolute", left: -40, width: 208, top: 136, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 21, color: C.ink }}>{name}</div>
              <div style={{ position: "absolute", left: -40, width: 208, top: 164, textAlign: "center", fontFamily: SANS, fontWeight: 700, fontSize: 16, color: w > 0.5 ? C.okText : C.muted }}>{w > 0.5 ? "Working on it" : "Recruiter"}</div>
            </div>
          </React.Fragment>
        );
      })}
      {/* the vacancy */}
      <div style={{ ...box(x - 430, y - 150, 860, 300), ...card, borderRadius: 26, transform: `translate(${x - 430}px, ${y - 150}px) scale(${s})`, opacity: Math.min(1, up * 2) * (1 - clamp01((back - 0.6) / 0.4)),
        boxShadow: "0 30px 70px -30px rgba(28,25,23,0.45)" }}>
        <div style={{ position: "absolute", left: 40, top: 34, display: "flex", alignItems: "center", gap: 12, fontFamily: SANS, fontWeight: 700, fontSize: 21, color: C.muted }}>
          <div style={{ width: 32, height: 32, borderRadius: 9, background: C.green, color: C.white, fontWeight: 800, fontSize: 17, display: "flex", alignItems: "center", justifyContent: "center" }}>N</div>Nordvik Systems AB
        </div>
        <div style={{ position: "absolute", right: 36, top: 30, transform: `scale(${1 + 0.15 * Math.sin(Math.PI * clamp01(pulse))})` }}>
          <Pill t={pulse > 0.3 ? "Live" : "Published"} s={22} bg={pulse > 0.3 ? C.okBg : C.sand} fg={pulse > 0.3 ? C.okText : C.muted} icon={pulse > 0.3 ? "bolt" : "check"} border={pulse > 0.3 ? "#A9E8C1" : undefined} />
        </div>
        <div style={{ position: "absolute", left: 40, top: 88, fontFamily: SERIF, fontWeight: 600, fontSize: 56, color: C.ink, letterSpacing: "-0.015em" }}>Account Executive, SaaS</div>
        <div style={{ position: "absolute", left: 40, top: 182, display: "flex", gap: 12 }}>
          <Pill t="Sales" s={20} /><Pill t="Stockholm" icon="pin" s={20} /><Pill t="Hybrid" s={20} /><Pill t="3–5 years" s={20} />
        </div>
        <div style={{ position: "absolute", right: 36, top: 178 }}><Pill t="Reward 95 000 SEK" icon="coins" s={22} bg={C.amberBg} fg={C.amberText} border={C.amberLine} /></div>
      </div>
    </AbsoluteFill>
  );
};
// candidates arrive: little profile chips leave the recruiters and drop into the pipeline's first column
const Arrive: React.FC<{ g: number }> = ({ g }) => {
  if (g < f("arrive") || g > f("arrive+1.4")) return null;
  const W = win(g);
  const dst = (slot: number) => ({ x: W.x - (WW / 2) * W.s + (SB + colX(0) + COLW / 2) * W.s, y: W.y - (WH / 2) * W.s + (CY0 + 10 + slot * SLOT + 58) * W.s });
  return (
    <AbsoluteFill>
      {[[5, 0], [0, 1], [3, 2]].map(([r, slot], i) => {
        const p = k(g, off("arrive", 0.05 + i * 0.12), 0.75, MOVE);
        if (p <= 0 || p >= 1) return null;
        const a = recAt(r), b = dst(slot);
        const x = mix(a.x, b.x, p), y = mix(a.y, b.y, p) - Math.sin(Math.PI * p) * 120;
        return <div key={i} style={{ position: "absolute", left: 0, top: 0, transform: `translate(${x - 30}px, ${y - 30}px) scale(${1 - 0.3 * p})` }}><Initials name={i === 0 ? OSKAR.n : OTHERS[i - 1].n} s={60} hue={i === 0 ? 1 : OTHERS[i - 1].hue} /></div>;
      })}
    </AbsoluteFill>
  );
};

/* ---------- the candidate: profile, match scores, application (a panel over the pipeline) ---------- */
const Panel: React.FC<{ g: number; o: number; x: number; tab: number; children: React.ReactNode }> = ({ o, x, tab, children }) =>
  o <= 0 ? null : (
    <div style={{ position: "absolute", left: 1330 - 640, top: 0, width: 640, height: WH, background: C.white, borderLeft: `1.5px solid ${C.line}`, boxShadow: "-30px 0 60px -30px rgba(28,25,23,0.35)", opacity: o, transform: `translateX(${x}px)` }}>
      <div style={{ position: "absolute", left: 32, top: 30, display: "flex", alignItems: "center", gap: 16 }}>
        <Initials name={OSKAR.n} s={64} hue={1} />
        <div>
          <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 38, color: C.ink, letterSpacing: "-0.01em" }}>Oskar Vinge</div>
          <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 19, color: C.muted, marginTop: 2 }}>Account Executive · SaaS</div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 32, right: 32, top: 126, display: "flex", gap: 26, borderBottom: `1.5px solid ${C.line}`, fontFamily: SANS, fontWeight: 700, fontSize: 18, color: C.muted }}>
        {["Info", "AI score", "Q&A", "Chat"].map((t, i) => <div key={t} style={{ paddingBottom: 12, color: i === tab ? C.greenStrong : C.muted, borderBottom: i === tab ? `3px solid ${C.green}` : "3px solid transparent", marginBottom: -1.5 }}>{t}</div>)}
      </div>
      {children}
    </div>
  );
const Profile: React.FC<{ g: number }> = ({ g }) => {
  if (g < f("see-0.1") || g > f("w:dashboard+0.6")) return null;
  const inn = k(g, "w:profiles-0.15", 0.5, MOVE), out = k(g, "w:one2-0.05", 0.5, MOVE);
  const pf = k(g, "w:profiles", 0.4), ms = k(g, "w:match-0.05", 0.4), ap = k(g, "w:applications-0.1", 0.4);
  const bars = [["B2B sales track record", 9], ["SaaS experience", 9], ["Communication", 8], ["Requirements covered", 9]] as const;
  return (
    <Panel g={g} o={inn} x={(1 - inn) * 120 + out * 680} tab={ms > 0.5 && ap < 0.5 ? 1 : 0}>
      <div style={{ position: "absolute", left: 32, top: 184, display: "flex", gap: 10, opacity: pf, transform: `translateY(${(1 - pf) * 16}px)` }}>
        <Pill t="Stockholm" icon="pin" s={18} /><Pill t="5 years B2B SaaS" icon="briefcase" s={18} /><Pill t="Available 1 November" icon="calendar" s={18} />
      </div>
      <div style={{ position: "absolute", left: 32, top: 252, display: "flex", alignItems: "center", gap: 18, opacity: Math.min(1, ms * 2), transform: `scale(${1 + 0.06 * Math.sin(Math.PI * clamp01(ms))})`, transformOrigin: "0 50%" }}>
        <AI v={9.0 * k(g, "w:match", 0.8, MOVE)} s={30} on={ms > 0.9 ? 1 : 0} />
        <div><div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 16, letterSpacing: "0.08em", color: C.muted }}>AI MATCH SCORE</div><Stars n={5} s={20} /></div>
      </div>
      <div style={{ position: "absolute", left: 32, top: 336, display: "flex", flexDirection: "column", gap: 18, opacity: Math.min(1, ms * 2) }}>
        {bars.map(([l, v], i) => <Bar key={l} label={l} v={v} k={k(g, off("w:match", 0.05 + i * 0.1), 0.6, MOVE)} w={576} s={19} />)}
      </div>
      <div style={{ position: "absolute", left: 32, right: 32, top: 596, opacity: ap, transform: `translateY(${(1 - ap) * 30}px)` }}>
        <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 16, letterSpacing: "0.08em", color: C.muted }}>APPLICATION</div>
        {[["Source", "Marketplace"], ["Recruiter", "Arthur Berg"], ["Current stage", "New"]].map(([a, b], i) => (
          <div key={a} style={{ display: "flex", justifyContent: "space-between", marginTop: 14, fontFamily: SANS, fontWeight: 700, fontSize: 20, color: C.ink, opacity: k(g, off("w:applications", i * 0.08), 0.35) }}>
            <span style={{ color: C.muted }}>{a}</span><span>{b}</span>
          </div>
        ))}
        <div style={{ marginTop: 22, display: "flex", gap: 12, opacity: k(g, "w:in", 0.35) }}><Pill t="CV.pdf" icon="file" s={18} bg={C.infoBg} fg={C.infoText} /><Pill t="Screening answers" icon="check" s={18} bg={C.okBg} fg={C.okText} /></div>
      </div>
    </Panel>
  );
};

/* ---------- compare, shortlist ---------- */
const CMP = [{ ...OTHERS[3] }, { ...OSKAR, stars: 5 }, { ...OTHERS[1] }];
const CMPV = [[8, 8, 9], [9, 9, 8], [8, 7, 8]];
const Compare: React.FC<{ g: number }> = ({ g }) => {
  if (g < f("compare-0.1") || g > f("msg+0.2")) return null;
  const inn = k(g, "compare", 0.6), best = k(g, "w:instantly", 0.4, SMALLPOP), sl = k(g, "w:shortlist", 0.35, SMALLPOP);
  const go = k(g, "short+0.35", 0.6, MOVE);                 // the best one flies to the Shortlist column, the others step back
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(248,246,245,0.78)", opacity: inn * (1 - go) }} />
      {CMP.map((c, i) => {
        const a = k(g, off("compare", i * 0.08), 0.55), mid = i === 1;
        const cx = 225 + i * 440, cy = 470;
        const tx = mid ? mix(cx, colX(1) + COLW / 2, go) : cx, ty = mid ? mix(cy, CY0 + 10 + 58, go) : cy + go * 60;
        const sc = mid ? mix(1, 0.5, go) : 1 - 0.1 * go;
        const o = mid ? Math.min(1, a) * (1 - clamp01((go - 0.85) / 0.15)) : Math.min(1, a) * (1 - k(g, "w:shortlist+0.1", 0.4));
        if (o <= 0.01) return null;
        return (
          <div key={i} style={{ ...box(tx - 200, ty - 260, 400, 520), ...card, borderRadius: 24, opacity: o, transform: `translate(${tx - 200}px, ${ty - 260 + (1 - a) * 50}px) scale(${sc * (mid ? 1 + 0.04 * best : 1)})`,
            boxShadow: mid && best > 0 ? `0 0 0 ${4 * Math.min(1, best)}px ${C.green}, 0 30px 60px -30px rgba(40,126,97,0.6)` : card.boxShadow }}>
            <div style={{ position: "absolute", left: 0, right: 0, top: 34, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
              <Initials name={c.n} s={84} hue={c.hue} />
              <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 32, color: C.ink }}>{c.n}</div>
              <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 18, color: C.muted }}>{c.t}</div>
              <AI v={c.ai} s={26} on={mid && best > 0.5 ? 1 : 0} />
            </div>
            <div style={{ position: "absolute", left: 30, top: 290, display: "flex", flexDirection: "column", gap: 16 }}>
              {["Track record", "SaaS", "Communication"].map((l, j) => <Bar key={l} label={l} v={CMPV[i][j]} k={k(g, off("compare", 0.2 + j * 0.08), 0.5, MOVE)} w={340} s={17} />)}
            </div>
            {mid && <div style={{ position: "absolute", left: 0, right: 0, top: -24, display: "flex", justifyContent: "center", transform: `scale(${best})`, opacity: Math.min(1, best) }}><Pill t="Best match" icon="check" s={20} bg={C.green} fg={C.white} /></div>}
            {mid && <div style={{ position: "absolute", right: 22, top: 22, width: 50, height: 50, borderRadius: 25, background: sl > 0.5 ? C.amberBg : C.white, border: `1.5px solid ${sl > 0.5 ? C.amberLine : C.line}`,
              display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${1 + 0.3 * Math.sin(Math.PI * clamp01(sl))})` }}><Ico n="star" s={28} c={C.amber} fill={sl > 0.5 ? C.amber : "none"} w={2.4} /></div>}
            {mid && sl > 0 && <div style={{ position: "absolute", left: 0, right: 0, bottom: 26, display: "flex", justifyContent: "center", opacity: Math.min(1, sl) }}><Pill t="Shortlisted" icon="star" s={20} bg={C.amberBg} fg={C.amberText} border={C.amberLine} /></div>}
          </div>
        );
      })}
    </div>
  );
};

/* ---------- message the recruiter, track the interview ---------- */
const Message: React.FC<{ g: number }> = ({ g }) => {
  if (g < f("msg-0.1") || g > f("track+0.7")) return null;
  const inn = k(g, "msg", 0.5, MOVE), out = k(g, "track", 0.5, MOVE);
  const t1 = typed(g, "w:message+0.05", "Strong profile. Can we meet Oskar this week?", 55);
  const r = k(g, "w:recruiters3+0.35", 0.4, SMALLPOP);
  return (
    <Panel g={g} o={inn} x={(1 - inn) * 120 + out * 680} tab={3}>
      <div style={{ position: "absolute", left: 32, top: 186, display: "flex", alignItems: "center", gap: 12 }}>
        <Initials name="Arthur Berg" s={46} hue={4} />
        <div><div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 20, color: C.ink }}>Arthur Berg</div><div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 16, color: C.muted }}>Recruiter · Sales</div></div>
      </div>
      <div style={{ position: "absolute", right: 32, top: 280, maxWidth: 480, padding: "18px 24px", borderRadius: 24, borderBottomRightRadius: 6, background: C.green, color: C.white, fontFamily: SANS, fontWeight: 700, fontSize: 23, lineHeight: 1.35, opacity: t1.length ? 1 : 0 }}>{t1}</div>
      <div style={{ position: "absolute", left: 32, top: 420, maxWidth: 480, padding: "18px 24px", borderRadius: 24, borderBottomLeftRadius: 6, background: C.sand, color: C.ink, fontFamily: SANS, fontWeight: 700, fontSize: 23, lineHeight: 1.35,
        opacity: r, transform: `scale(${0.85 + 0.15 * r})`, transformOrigin: "0 100%" }}>Yes, Thursday 10:00 works. I'll book it.</div>
      <div style={{ position: "absolute", left: 32, right: 32, bottom: 34, height: 64, borderRadius: 16, border: `1.5px solid ${C.line}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 10px 0 20px", boxSizing: "border-box",
        fontFamily: SANS, fontWeight: 600, fontSize: 19, color: C.muted }}>Write a message…<div style={{ width: 46, height: 46, borderRadius: 23, background: C.green, display: "flex", alignItems: "center", justifyContent: "center" }}><Ico n="send" s={22} c={C.white} w={3} /></div></div>
    </Panel>
  );
};
const Interview: React.FC<{ g: number }> = ({ g }) => {
  if (g < f("track") || g > f("move+0.5")) return null;
  const inn = k(g, "track+0.05", 0.45), out = k(g, "w:interviews+0.75", 0.4, DEPART);
  const fb = typed(g, "w:interviews+0.05", "Great discovery call.", 50);
  const press = g >= f("w:interviews+0.65") && g < f("w:interviews+0.65") + 5 ? 1 : 0;
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(28,25,23,0.18)", opacity: inn * (1 - out) }} />
      <div style={{ ...box(665 - 320, 450 - 250, 640, 500), ...card, borderRadius: 24, opacity: inn * (1 - out), transform: `translate(${665 - 320}px, ${450 - 250 + (1 - inn) * 40 - out * 30}px) scale(${0.95 + 0.05 * inn})`,
        boxShadow: "0 40px 80px -30px rgba(28,25,23,0.45)" }}>
        <div style={{ position: "absolute", left: 36, top: 30, fontFamily: SERIF, fontWeight: 600, fontSize: 34, color: C.ink }}>Shortlist → Interview</div>
        <div style={{ position: "absolute", left: 36, top: 92, fontFamily: SANS, fontWeight: 800, fontSize: 16, letterSpacing: "0.08em", color: C.muted }}>RATE THE CANDIDATE</div>
        <div style={{ position: "absolute", left: 36, top: 122 }}><Stars n={clamp01((g - f("w:track")) / 9) * 4 + clamp01((g - f("w:track") - 9) / 9)} s={40} /></div>
        <div style={{ position: "absolute", left: 36, right: 36, top: 196, height: 84, borderRadius: 14, border: `2px solid ${C.green}`, padding: "16px 18px", boxSizing: "border-box", fontFamily: SANS, fontWeight: 600, fontSize: 22, color: C.ink }}>{fb}</div>
        <div style={{ position: "absolute", left: 36, top: 304, fontFamily: SANS, fontWeight: 800, fontSize: 16, letterSpacing: "0.08em", color: C.muted }}>NEXT STEP</div>
        <div style={{ position: "absolute", left: 36, right: 36, top: 334, height: 60, borderRadius: 14, background: C.greenSoft, border: `1.5px solid #BFDCCF`, display: "flex", alignItems: "center", gap: 14, padding: "0 18px", boxSizing: "border-box",
          fontFamily: SANS, fontWeight: 700, fontSize: 20, color: C.greenStrong }}><Ico n="calendar" s={24} c={C.greenStrong} />Let the recruiter book for you</div>
        <div style={{ position: "absolute", right: 36, bottom: 30 }}><Btn t="Send" icon="send" s={21} press={press} /></div>
      </div>
    </div>
  );
};

/* ---------- hired, and only then the reward is invoiced ---------- */
const Hired: React.FC<{ g: number }> = ({ g }) => {
  if (g < f("w:hire") || g > f("rec+0.6")) return null;
  const inn = k(g, "w:hire+0.3", 0.5), out = k(g, "rec-0.2", 0.4, DEPART), pay = k(g, "w:pay-0.1", 0.45, SMALLPOP);
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(28,25,23,0.18)", opacity: inn * (1 - out) }} />
      <div style={{ ...box(665 - 340, 455 - 300, 680, 600), ...card, borderRadius: 26, opacity: inn * (1 - out), transform: `translate(${665 - 340}px, ${455 - 300 + (1 - inn) * 40}px) scale(${0.94 + 0.06 * inn})`,
        boxShadow: "0 40px 80px -30px rgba(28,25,23,0.45)" }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 34, display: "flex", justifyContent: "center" }}>
          <div style={{ width: 70, height: 70, borderRadius: 35, background: C.okBg, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${k(g, "w:hire+0.45", 0.4, SMALLPOP)})` }}><Ico n="check" s={40} c={C.okText} w={3.4} /></div>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 124, textAlign: "center", fontFamily: SERIF, fontWeight: 600, fontSize: 40, color: C.ink }}>Congrats, Oskar Vinge is hired!</div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 182, textAlign: "center", fontFamily: SANS, fontWeight: 600, fontSize: 21, color: C.muted }}>Here's what happens next with payment.</div>
        <div style={{ position: "absolute", left: 44, right: 44, top: 240, borderRadius: 16, border: `1.5px solid ${C.line}`, background: "#FCFBFA", padding: "20px 24px" }}>
          <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 15, letterSpacing: "0.08em", color: C.muted }}>INVOICE BREAKDOWN</div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 14, fontFamily: SANS, fontWeight: 600, fontSize: 21, color: C.muted }}><span>Recruitment reward</span><span>95 000 SEK</span></div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 14, padding: "10px 12px", marginLeft: -12, marginRight: -12, borderRadius: 10, background: pay > 0.5 ? C.greenSoft : "transparent",
            fontFamily: SANS, fontWeight: 800, fontSize: 24, color: pay > 0.5 ? C.greenStrong : C.ink }}><span>Total to invoice</span><span>95 000 SEK</span></div>
        </div>
        <div style={{ position: "absolute", left: 44, right: 44, top: 444, display: "flex", gap: 14, alignItems: "flex-start", fontFamily: SANS, fontWeight: 600, fontSize: 20, lineHeight: 1.4, color: C.ink }}>
          <Ico n="calendar" s={26} c={C.green} />The reward is invoiced when the candidate starts the job.
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: -26, display: "flex", justifyContent: "center", transform: `scale(${pay})`, opacity: Math.min(1, pay) }}>
          <Pill t="Pay on results" icon="check" s={26} bg={C.green} fg={C.white} />
        </div>
      </div>
    </div>
  );
};

const fmt = (v: number) => String(v).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
/* ---------- the recruiter's side: explore, submit, earn ---------- */
const JOBS = [
  { t: "Account Executive, SaaS", tags: ["Sales", "Stockholm"], rw: "95 000 SEK", hot: true },
  { t: "Account Manager", tags: ["Sales", "Denmark"], rw: "" }, { t: "Scale up CTO", tags: ["C-level", "Stockholm"], rw: "" }, { t: "Cloud Architect", tags: ["Tech", "Finland"], rw: "" },
];
const Recruiter: React.FC<{ g: number; o: number }> = ({ g, o }) => {
  if (o <= 0) return null;
  const rel = k(g, "w:relevant", 0.4, SMALLPOP);
  const sub = k(g, "w:submit-0.45", 0.5, MOVE), done = k(g, "w:talent-0.12", 0.3, SMALLPOP), q = k(g, "w:qualified", 0.4, SMALLPOP);
  const earn = k(g, "w:and4", 0.55, MOVE), paid = k(g, "w:placements", 0.4, SMALLPOP);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o }}>
      <div style={{ position: "absolute", left: 44, top: 36, fontFamily: SERIF, fontWeight: 600, fontSize: 44, color: C.ink }}>Marketplace</div>
      <div style={{ position: "absolute", left: 44, top: 108, display: "flex", gap: 12 }}>
        {["All roles", "Sales", "Tech", "C-level"].map((t, i) => <Pill key={t} t={t} s={19} bg={i === 1 && rel > 0.5 ? C.green : i === 0 && rel <= 0.5 ? C.ink : C.white} fg={(i === 1 && rel > 0.5) || (i === 0 && rel <= 0.5) ? C.white : C.ink} border={C.line} />)}
      </div>
      {JOBS.map((j, i) => {
        const a = k(g, off("w:recruiters4+0.3", i * 0.08), 0.5), dimmed = !j.tags.includes("Sales") && rel > 0.5 ? 0.45 : 1;
        const hov = clamp01(1 - Math.abs((g - f("w:explore")) / 5 - i) / 0.9) * (g >= f("w:explore") && g < f("w:relevant") + 4 ? 1 : 0);
        return (
          <div key={j.t} style={{ ...box(44, 180 + i * 136, 1240, 118), ...card, background: hov > 0.05 ? mixC("#FFFFFF", "#F4F9F7", hov) : C.white, borderRadius: 18, opacity: a * dimmed, transform: `translate(${44 + (1 - a) * 60 + hov * 10}px, ${180 + i * 136}px)`,
            boxShadow: j.hot && rel > 0 ? `0 0 0 ${3 * Math.min(1, rel)}px ${C.green}, 0 16px 34px -16px rgba(40,126,97,0.5)` : card.boxShadow }}>
            <div style={{ position: "absolute", left: 30, top: 22, fontFamily: SERIF, fontWeight: 600, fontSize: 32, color: C.ink }}>{j.t}</div>
            <div style={{ position: "absolute", left: 30, top: 72, display: "flex", gap: 10 }}>{j.tags.map((t) => <Pill key={t} t={t} s={16} />)}{j.hot && rel > 0.5 && <Pill t="Matches your niche" icon="check" s={16} bg={C.okBg} fg={C.okText} />}</div>
            <div style={{ position: "absolute", right: 30, top: 36 }}>{j.rw ? <Pill t={`Reward ${j.rw}`} icon="coins" s={21} bg={C.amberBg} fg={C.amberText} border={C.amberLine} /> : <Pill t="Reward stated up front" icon="coins" s={19} bg={C.sand} fg={C.muted} />}</div>
          </div>
        );
      })}
      {/* submit talent (a panel), then the reward for the placement */}
      <div style={{ position: "absolute", left: 1330 - 600, top: 0, width: 600, height: WH, background: C.white, borderLeft: `1.5px solid ${C.line}`, boxShadow: "-30px 0 60px -30px rgba(28,25,23,0.35)",
        transform: `translateX(${(1 - sub) * 640}px)`, opacity: sub > 0 ? 1 : 0 }}>
        <div style={{ position: "absolute", left: 32, top: 34, right: 32, opacity: 1 - earn, transform: `translateX(${-earn * 60}px)` }}>
          <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 16, letterSpacing: "0.08em", color: C.muted }}>SUBMIT CANDIDATE</div>
          <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 36, color: C.ink, marginTop: 8 }}>Account Executive, SaaS</div>
          <div style={{ ...card, position: "relative", marginTop: 30, padding: 22, borderRadius: 18 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <Initials name={OSKAR.n} s={60} hue={1} />
              <div style={{ flex: 1 }}><div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 24, color: C.ink }}>Oskar Vinge</div><div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 17, color: C.muted }}>Account Executive · SaaS</div></div>
              <AI v={9.0} s={22} on={q > 0.5 ? 1 : 0} />
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 18, opacity: q, transform: `translateY(${(1 - q) * 10}px)` }}><Pill t="Interviewed" icon="check" s={17} bg={C.okBg} fg={C.okText} /><Pill t="Screening answered" icon="check" s={17} bg={C.okBg} fg={C.okText} /></div>
          </div>
          <div style={{ marginTop: 30, display: "flex", justifyContent: "flex-end" }}><Btn t={done > 0.5 ? "Submitted" : "Submit"} icon={done > 0.5 ? "check" : "send"} s={24} press={g >= f("w:talent-0.2") && g < f("w:talent-0.2") + 5 ? 1 : 0} style={{ background: done > 0.5 ? C.greenStrong : C.green }} /></div>
        </div>
        <div style={{ position: "absolute", left: 32, top: 34, right: 32, opacity: earn, transform: `translateX(${(1 - earn) * 60}px)` }}>
          <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 16, letterSpacing: "0.08em", color: C.muted }}>EARNINGS · ACCOUNT EXECUTIVE, SAAS</div>
          <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 36, color: C.ink, marginTop: 8 }}>Placement reward</div>
          <div style={{ ...card, marginTop: 30, padding: 26, borderRadius: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 20, color: C.muted }}>Oskar Vinge · hired</div>
              <div style={{ transform: `scale(${paid})`, opacity: Math.min(1, paid) }}><Pill t="Paid on hire" icon="check" s={18} bg={C.okBg} fg={C.okText} /></div>
            </div>
            <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 64, color: C.ink, marginTop: 14, letterSpacing: "-0.02em", fontVariantNumeric: "tabular-nums" }}>{fmt(Math.round((95000 * k(g, "w:rewards2", 1.0, MOVE)) / 250) * 250)} <span style={{ fontSize: 30, color: C.muted }}>SEK reward</span></div>
            <div style={{ marginTop: 18, height: 14, borderRadius: 8, background: C.sand, overflow: "hidden" }}><div style={{ width: `${75 * k(g, "w:for2", 0.8, MOVE)}%`, height: "100%", background: C.green, borderRadius: 8 }} /></div>
            <div style={{ marginTop: 12, fontFamily: SANS, fontWeight: 800, fontSize: 22, color: C.greenStrong }}>70–80% of the reward is yours</div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ---------- the window, put together ---------- */
const Window: React.FC<{ g: number }> = ({ g }) => {
  const W = win(g);
  if (W.o <= 0.01) return null;
  const home = g < f("create") ? 1 : 0;
  const cIn = k(g, "create+0.4", 0.5), cOut = k(g, "w:set-0.2", 0.5, MOVE);
  const rIn = k(g, "w:set-0.2", 0.5, MOVE);
  const pIn = k(g, "arrive", 0.5), recIn = k(g, "w:recruiters4", 0.5, MOVE), recOut = k(g, "inbox", 0.5, MOVE);
  const pipeO = home ? 1 : g >= f("arrive") ? pIn * (1 - recIn) + recOut : 0;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: WW, height: WH, borderRadius: 26, overflow: "hidden", background: C.white, opacity: W.o,
      transform: `translate(${W.x - WW / 2}px, ${W.y - WH / 2}px) scale(${W.s})`, transformOrigin: "50% 50%",
      boxShadow: "0 50px 120px -40px rgba(28,25,23,0.45), 0 0 0 1.5px rgba(28,25,23,0.06)", filter: W.dim > 0.02 ? `blur(${W.dim * 6}px)` : undefined }}>
      <Sidebar g={g} />
      <div style={{ position: "absolute", left: SB, top: 0, width: WW - SB, height: WH, overflow: "hidden", background: "#FDFCFB" }}>
        <Pipeline g={g} set={home ? "home" : "job"} o={pipeO} />
        {!home && <Create g={g} o={cIn * (1 - cOut)} x={(1 - cIn) * 60 - cOut * 120} />}
        {!home && g < f("arrive+0.5") && <Reward g={g} o={rIn * (1 - k(g, "arrive", 0.4))} x={(1 - rIn) * 140} />}
        <Profile g={g} />
        <Compare g={g} />
        <Message g={g} />
        <Interview g={g} />
        <Hired g={g} />
        <Recruiter g={g} o={recIn * (1 - recOut)} />
      </div>
      <div style={{ position: "absolute", inset: 0, background: C.paper, opacity: W.dim * 0.55 }} />
    </div>
  );
};

/* ---------- proof points from the site (a navy toast under the window) ---------- */
const PROOF: [string, string, string, string][] = [   // from, to, figure, text
  ["w:one+0.15", "w:better-0.15", "One", "place for the whole process"],
  ["w:better+0.25", "meet-0.1", "7/10", "match score before a candidate reaches you"],
  ["w:recruiters2+0.5", "arrive", "Within days,", "candidates arrive"],
];
const Proof: React.FC<{ g: number }> = ({ g }) => (
  <>
    {PROOF.map(([a, b, fig, t]) => {
      const i = k(g, a, 0.5), o = k(g, off(b, -0.3), 0.3, DEPART);
      if (i <= 0 || o >= 1) return null;
      return (
        <div key={a} style={{ position: "absolute", left: 0, top: 0, width: 1920, display: "flex", justifyContent: "center", transform: `translateY(${962 + (1 - i) * 30 + o * 20}px)`, opacity: Math.min(1, i * 1.5) * (1 - o) }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 30px", borderRadius: 40, background: C.navy, boxShadow: "0 20px 40px -18px rgba(11,31,58,0.6)", fontFamily: SANS, fontWeight: 700, fontSize: 28, color: C.white, whiteSpace: "nowrap" }}>
            <span style={{ fontWeight: 800, color: C.amber }}>{fig}</span>{t}
          </div>
        </div>
      );
    })}
  </>
);
/* ---------- the mode switch: for companies / for recruiters (the site's own nav) ---------- */
const Switch: React.FC<{ g: number }> = ({ g }) => {
  const a = k(g, "rec-0.35", 0.5), o = k(g, "inbox-0.1", 0.4, DEPART), s = k(g, "w:recruiters4", 0.4, MOVE);
  if (a <= 0 || o >= 1) return null;
  return (
    <div style={{ position: "absolute", left: 960 - 260, top: 44 + (1 - a) * -30, width: 520, height: 64, borderRadius: 32, background: C.white, border: `1.5px solid ${C.line}`, boxShadow: "0 12px 30px -16px rgba(28,25,23,0.35)", opacity: a * (1 - o) }}>
      <div style={{ position: "absolute", top: 6, left: 6 + s * 254, width: 254, height: 52, borderRadius: 26, background: C.green }} />
      {["For companies", "For recruiters"].map((t, i) => (
        <div key={t} style={{ position: "absolute", top: 0, left: 6 + i * 254, width: 254, height: 64, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontWeight: 800, fontSize: 22,
          color: (i === 1 ? s : 1 - s) > 0.5 ? C.white : C.muted }}>{t}</div>
      ))}
    </div>
  );
};

/* ---------- the logo (Meet Recruiting Rewards, and the end card) ---------- */
const Logo: React.FC<{ x: number; y: number; w: number; o: number; wipe: number }> = ({ x, y, w, o, wipe }) => {
  const h = (w * 100) / 919, iw = (w * 104) / 919;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: w, height: h, transform: `translate(${x - w / 2}px, ${y - h / 2}px)`, opacity: o }}>
      <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 ${(1 - wipe) * 100 * (1 - iw / w)}% 0 0)` }}>
        <Img src={staticFile("img/logo-black.svg")} style={{ width: w, height: h, transform: `translateX(${(1 - wipe) * -30}px)` }} />
      </div>
    </div>
  );
};
const Meet: React.FC<{ g: number }> = ({ g }) => {
  if (g < f("meet") || g > f("create+0.8")) return null;
  const a = k(g, "meet+0.35", 0.4), wipe = k(g, "w:recruiting-0.05", 0.8, MOVE), out = k(g, "create-0.05", 0.5, MOVE);
  const tag = k(g, "w:recruiting+0.25", 0.5);
  return (
    <AbsoluteFill style={{ opacity: 1 - out, transform: `scale(${1 + out * 0.15})`, transformOrigin: `${iconAt(LOGO).x}px ${LOGO.y}px` }}>
      <Logo x={LOGO.x} y={LOGO.y} w={LOGO.w} o={a} wipe={wipe} />
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, textAlign: "center", transform: `translateY(${LOGO.y + 90 + (1 - tag) * 16}px)`, opacity: tag, fontFamily: SANS, fontWeight: 700, fontSize: 36, color: C.green }}>The AI hiring marketplace</div>
    </AbsoluteFill>
  );
};
const End: React.FC<{ g: number }> = ({ g }) => {
  if (g < f("end_")) return null;
  const a = k(g, "end_+0.4", 0.4), wipe = k(g, "w:recruiting3", 0.8, MOVE);
  const tag = k(g, "w:rewards3+0.45", 0.6), cta = k(g, "w:rewards3+0.85", 0.6), url = k(g, "w:rewards3+1.15", 0.5);
  const hover = k(g, "w:rewards3+1.8", 0.4);
  return (
    <AbsoluteFill>
      <Logo x={ENDL.x} y={ENDL.y} w={ENDL.w} o={a} wipe={wipe} />
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, textAlign: "center", transform: `translateY(${500 + (1 - tag) * 20}px)`, opacity: tag, fontFamily: SERIF, fontWeight: 600, fontSize: 66, color: C.ink, letterSpacing: "-0.015em" }}>
        Match right. <span style={{ color: C.green }}>Pay on results.</span>
      </div>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, display: "flex", justifyContent: "center", transform: `translateY(${650 + (1 - cta) * 30}px)`, opacity: cta }}>
        <Btn t="Start hiring" icon="arrow" s={34} style={{ transform: `scale(${1 + 0.03 * hover})` }} />
      </div>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, textAlign: "center", transform: `translateY(${800 + (1 - url) * 16}px)`, opacity: url, fontFamily: SANS, fontWeight: 700, fontSize: 30, color: C.muted }}>recruitingrewards.com</div>
    </AbsoluteFill>
  );
};

/* ---------- the closing lines, and the price card ---------- */
const Closing: React.FC<{ g: number }> = ({ g }) => {
  if (g < f("inbox-0.2") || g > f("end_+0.3")) return null;
  const card0 = k(g, "w:no2+0.05", 0.5), cardOut = k(g, "just+0.45", 0.45, DEPART);
  const zero = k(g, "w:upfront-0.05", 0.45, SMALLPOP), agency = k(g, "w:costs+0.3", 0.5, SMALLPOP);
  return (
    <AbsoluteFill>
      <Head g={g} y={70} size={96} out="upfront-0.32" words={[{ t: "No", at: "w:no" }, { t: "scattered", at: "w:scattered" }, { t: "inboxes.", at: "w:inboxes", green: true }]} />
      <Head g={g} y={70} size={96} out="just-0.3" words={[{ t: "No", at: "w:no2" }, { t: "upfront", at: "w:upfront" }, { t: "costs.", at: "w:costs", green: true }]} />
      <Head g={g} y={70} size={96} out="end_-0.1" words={[{ t: "Just", at: "w:just" }, { t: "recruiting,", at: "w:recruiting2" }, { t: "redesigned.", at: "w:redesigned", green: true }]} />
      {card0 > 0 && cardOut < 1 && (
        <div style={{ ...box(1180, 450, 560, 500), ...card, borderRadius: 28, opacity: Math.min(1, card0) * (1 - cardOut), transform: `translate(${1180 + (1 - card0) * 80}px, ${450 - cardOut * 30}px)`, boxShadow: "0 40px 90px -30px rgba(28,25,23,0.45)" }}>
          <div style={{ position: "absolute", left: 40, top: 36, fontFamily: SANS, fontWeight: 800, fontSize: 18, letterSpacing: "0.08em", color: C.muted }}>UPFRONT COST</div>
          <div style={{ position: "absolute", left: 40, top: 64, fontFamily: SANS, fontWeight: 800, fontSize: 112, color: C.ink, letterSpacing: "-0.03em", transformOrigin: "0 60%", transform: `scale(${zero})`, opacity: Math.min(1, zero * 2) }}>
            0<span style={{ fontSize: 48, color: C.muted }}> SEK</span>
          </div>
          <div style={{ position: "absolute", left: 40, right: 40, top: 222, display: "flex", flexDirection: "column", gap: 14 }}>
            {["Free to post", "Pay when the candidate starts"].map((t, i) => {
              const a = k(g, off("w:costs", i * 0.12), 0.4);
              return <div key={t} style={{ display: "flex", alignItems: "center", gap: 14, fontFamily: SANS, fontWeight: 700, fontSize: 25, color: C.ink, opacity: a, transform: `translateX(${(1 - a) * 30}px)` }}>
                <div style={{ width: 34, height: 34, borderRadius: 17, background: C.greenSoft, display: "flex", alignItems: "center", justifyContent: "center" }}><Ico n="check" s={20} c={C.greenStrong} w={3.4} /></div>{t}</div>;
            })}
          </div>
          <div style={{ position: "absolute", left: 28, right: 28, bottom: 28, height: 120, borderRadius: 20, background: C.greenSoft, display: "flex", alignItems: "center", gap: 18, padding: "0 24px", boxSizing: "border-box",
            opacity: Math.min(1, agency), transform: `scale(${0.9 + 0.1 * agency})` }}>
            <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 52, color: C.greenStrong, letterSpacing: "-0.02em", whiteSpace: "nowrap" }}>30–45%</div>
            <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 23, lineHeight: 1.25, color: C.greenStrong }}>lower cost than an agency</div>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

export const Story: React.FC = () => {
  const g = useCurrentFrame();
  const cam = breathe(g, "end_", 0.04);
  const hookOut = k(g, "w:one-0.35", 0.45, DEPART);
  return (
    <AbsoluteFill style={{ background: C.paper }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 55% at 50% 45%, #FFFFFF 0%, rgba(255,255,255,0) 70%)" }} />
      <AbsoluteFill style={{ transform: `translate(${cam.x}px, ${cam.y}px) scale(${cam.s}) perspective(4000px) rotateX(0.01deg)`, transformOrigin: "50% 50%" }}>
        {g < f("w:one+0.6") && <Mess g={g} inAt="hook" gather="w:simplified+0.15" to={[960, 560]} />}
        {g < f("w:one") && <div style={{ opacity: 1 - hookOut }}><Head g={g} y={440} size={132} words={[{ t: "Hiring,", at: "w:hiring" }, { t: "simplified.", at: "w:simplified", green: true }]} /></div>}
        {/* more recruiters: the people on the platform, around it */}
        {g < f("meet+0.5") && REC.map(([src, name], i) => {
          const a = k(g, off("w:more", 0.05 + i * 0.07), 0.5, SMALLPOP), o = k(g, off("meet-0.15", i * 0.03), 0.35, DEPART);
          if (a <= 0) return null;
          const P2 = [[190, 290], [175, 640], [1735, 250], [1750, 560], [1700, 860]][i];
          const lk = k(g, off("w:more", 0.2 + i * 0.07), 0.5, MOVE);
          const ex = P2[0] < 960 ? 290 : 1630;
          return (
            <React.Fragment key={i}>
              <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, opacity: 1 - o }}>
                <path d={`M ${P2[0] + (P2[0] < 960 ? 62 : -62)} ${P2[1]} L ${ex} ${mix(P2[1], 560, 0.3)}`} fill="none" stroke={C.green} strokeWidth={3} pathLength={1} strokeDasharray="1 2" strokeDashoffset={1 - lk} strokeLinecap="round" />
              </svg>
              <div style={{ position: "absolute", left: 0, top: 0, transform: `translate(${P2[0] - 58}px, ${P2[1] - 58 + Math.sin(g / 30 + i) * 5}px) scale(${Math.min(1.05, a) * (1 - 0.4 * o)})`, opacity: Math.min(1, a) * (1 - o) }}>
                <Face src={src} s={116} />
                <div style={{ position: "absolute", left: -40, width: 196, top: 124, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 19, color: C.ink }}>{name}</div>
              </div>
            </React.Fragment>
          );
        })}
        <Window g={g} />
        <Meet g={g} />
        <Live g={g} />
        <Arrive g={g} />
        <Switch g={g} />
        {g >= f("inbox-0.2") && g < f("w:inboxes+0.8") && <Mess g={g} inAt="inbox-0.1" gather="w:inboxes-0.1" to={[960, 650]} low />}
        <Closing g={g} />
        <End g={g} />
        <Cursor g={g} />
      </AbsoluteFill>
      <Proof g={g} />
      <Grain o={0.035} />
    </AbsoluteFill>
  );
};
