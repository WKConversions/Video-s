// Talent Hub — the shared kit every scene builds with: clock helpers, the statement type (Say), the animated "th"
// mark and the wide logo, icons, cards and red pills, avatars, the candidate card, the platform's dashboard window
// (shared so scenes B and C join on the exact same frame), the hand-off fields, and the example data.
// Scenes import from here and never redefine these. Tokens and eases live in ./lib.
import React from "react";
import { Img, staticFile } from "remotion";
import { T } from "./clock";
import { ARRIVE, C, DEPART, MOVE, POP, SNAP, clamp01, mix } from "./lib";
import { TH } from "./thpaths";
import { tx } from "./lang";
export { tx };

export const k = (g: number, at: string | number, dur: number, ease = ARRIVE) => T.k(g, at, dur, ease);
export const f = (at: string | number) => T.f(at);
export const FONT = "Lato";
export const typed = (g: number, at: string | number, text: string, cps = 34) =>
  text.slice(0, Math.max(0, Math.min(text.length, Math.floor(((g - f(at)) / 30) * cps))));

/* ---------- statements (SaaS caption rhythm: only on some lines) ---------- */
// Words rise and sharpen on their spoken word. Lato Black, tight; key words in Talent Red. Left-aligned by default
// (as in the JongLeren films), x = left edge; align "center" centres the line in `width`.
export type Wd = { t: string; at: string; red?: boolean };
export const Say: React.FC<{ g: number; words: Wd[]; x?: number; y: number; size: number; out?: string; weight?: number; color?: string; align?: "left" | "center"; width?: number }> = ({
  g, words, x = 120, y, size, out, weight = 900, color = C.ink, align = "left", width = 1680 }) => {
  const o = out ? k(g, out, 0.4) : 0;
  if (o >= 1) return null;
  return (
    <div style={{ position: "absolute", left: x, top: 0, width, display: "flex", flexWrap: "wrap", justifyContent: align === "center" ? "center" : "flex-start", columnGap: size * 0.24,
      transform: `translateY(${y - o * 26}px) perspective(4000px) rotateX(0.01deg)`, opacity: 1 - o, filter: o > 0 ? `blur(${o * 8}px)` : undefined,
      fontFamily: FONT, fontWeight: weight, fontSize: size, letterSpacing: "-0.02em", lineHeight: 1.05, color, whiteSpace: "nowrap" }}>
      {words.map((w, i) => {
        const kk = k(g, w.at, 0.5);
        return <span key={i} style={{ display: "inline-block", color: w.red ? C.red : undefined, opacity: Math.min(1, kk * 1.7), transform: `translateY(${(1 - kk) * size * 0.4}px)`,
          filter: kk < 1 ? `blur(${(1 - kk) * 7}px)` : undefined }}>{w.t}</span>;
      })}
    </div>
  );
};

/* ---------- the logo ---------- */
// The square "th" mark, drawn from the traced paths. p (0..1) runs its build: the t's stem rises out of its baseline,
// the h's stem drops in beside it, then the h's arch sweeps round; color sets the fill (red, or white on red).
// Scale with `size` (the mark's width in px; its height is size × 596/764).
export const THMark: React.FC<{ size: number; p?: number; color?: string; style?: React.CSSProperties }> = ({ size, p = 1, color = C.red, style }) => {
  const h = size * TH.h / TH.w;
  const tp = SNAP(clamp01(p / 0.45)), hp = SNAP(clamp01((p - 0.2) / 0.45)), ap = ARRIVE(clamp01((p - 0.45) / 0.55));
  const id = React.useId().replace(/:/g, "");             // unique clip ids per mark, so marks in different build states never share a clip
  return (
    <svg width={size} height={h} viewBox={`0 0 ${TH.w} ${TH.h}`} style={{ display: "block", overflow: "visible", ...style }}>
      <defs>
        <clipPath id={`th-t-${id}`}><rect x={-20} y={TH.h * (1 - tp)} width={300} height={TH.h + 40} /></clipPath>
        <clipPath id={`th-h-${id}`}><rect x={280} y={-20} width={520} height={(TH.h + 40) * hp} /></clipPath>
        <clipPath id={`th-arch-${id}`}><path d={`M 480 ${TH.h} L 480 0 L ${480 + 300 * ap} 0 L ${480 + 300 * ap} ${TH.h} Z`} /></clipPath>
      </defs>
      <g clipPath={`url(#th-t-${id})`}><path d={TH.t} fill={color} /></g>
      <g clipPath={`url(#th-h-${id})`}>
        {/* the h's stem shows as it drops; its arch is revealed left to right after */}
        <g clipPath={ap < 1 ? `url(#th-arch-${id})` : undefined}><path d={TH.hh} fill={color} /></g>
        {ap < 1 && <rect x={287} y={0} width={193} height={TH.h} fill={color} />}
      </g>
    </svg>
  );
};
// The wide logo (the "th" mark and the TalentHub wordmark), for the call to action. width in px; the height follows.
export const WideLogo: React.FC<{ width: number; style?: React.CSSProperties }> = ({ width, style }) => (
  <Img src={staticFile("img/talenthub-wide.svg")} style={{ width, height: (width * 344) / 1701, display: "block", ...style }} />
);

/* ---------- icons (rounded monoline) ---------- */
export const P: Record<string, React.ReactNode> = {
  search: <><circle cx="21" cy="21" r="12" /><path d="M30 30 L40 40" /></>,
  filter: <><path d="M7 10 H41 L28 26 V38 L20 42 V26 Z" /></>,
  sliders: <><path d="M8 14 H40 M8 24 H40 M8 34 H40" /><circle cx="16" cy="14" r="3.5" /><circle cx="31" cy="24" r="3.5" /><circle cx="21" cy="34" r="3.5" /></>,
  lock: <><rect x="11" y="21" width="26" height="19" rx="4" /><path d="M16 21 V15 a8 8 0 0 1 16 0 V21" /></>,
  unlock: <><rect x="11" y="21" width="26" height="19" rx="4" /><path d="M16 21 V15 a8 8 0 0 1 15.5 -2.5" /></>,
  mail: <><rect x="6" y="11" width="36" height="26" rx="4" /><path d="M7 13 L24 26 L41 13" /></>,
  phone: <><path d="M14 7 L20 7 L23 16 L18 19 a22 22 0 0 0 11 11 L32 25 L41 28 L41 34 a4 4 0 0 1 -4 4 C22 38 10 26 10 11 a4 4 0 0 1 4 -4 Z" /></>,
  globe: <><circle cx="24" cy="24" r="17" /><path d="M7 24 H41" /><path d="M24 7 c-6 6 -6 28 0 34 c6 -6 6 -28 0 -34" /></>,
  pin: <><path d="M24 43 C24 43 37 30 37 20 a13 13 0 0 0 -26 0 C11 30 24 43 24 43 Z" /><circle cx="24" cy="20" r="4.5" /></>,
  cap: <><path d="M4 18 L24 9 L44 18 L24 27 Z" /><path d="M12 22 V32 c6 5 18 5 24 0 V22" /><path d="M44 18 V28" /></>,
  briefcase: <><rect x="6" y="15" width="36" height="25" rx="4" /><path d="M17 15 V11 a3 3 0 0 1 3 -3 H28 a3 3 0 0 1 3 3 V15" /><path d="M6 25 H42" /></>,
  building: <><rect x="10" y="7" width="22" height="34" rx="2" /><path d="M32 18 H39 V41 H32" /><path d="M16 14 h2 M24 14 h2 M16 21 h2 M24 21 h2 M16 28 h2 M24 28 h2 M19 41 V35 H23 V41" /></>,
  user: <><circle cx="24" cy="17" r="8" /><path d="M9 41 c2 -9 8 -13 15 -13 s13 4 15 13" /></>,
  users: <><circle cx="18" cy="17" r="7" /><path d="M5 40 c2 -8 7 -11 13 -11 s11 3 13 11" /><circle cx="33" cy="15" r="6" /><path d="M33 27 c5 0 9 3 10 10" /></>,
  check: <><path d="M11 25 L20 33 L37 15" /></>,
  star: <><path d="M24 7 L29 18 L41 19 L32 27 L35 39 L24 33 L13 39 L16 27 L7 19 L19 18 Z" /></>,
  chat: <><path d="M8 12 H40 V32 H22 L13 39 V32 H8 Z" /></>,
  send: <><path d="M6 23 L42 7 L30 42 L23 27 Z" /><path d="M23 27 L42 7" /></>,
  coin: <><circle cx="24" cy="24" r="16" /><path d="M24 15 V33 M19 19 h8 a4 4 0 0 1 0 8 h-6 a4 4 0 0 0 0 8 h8" /></>,
  plane: <><path d="M6 27 L42 10 L35 38 L25 30 L19 37 L19 28 Z" /></>,
  arrow: <><path d="M10 24 H37" /><path d="M27 14 L37 24 L27 34" /></>,
  plus: <><path d="M24 11 V37 M11 24 H37" /></>,
  x: <><path d="M14 14 L34 34 M34 14 L14 34" /></>,
  spark: <><path d="M24 6 L27 20 L41 24 L27 28 L24 42 L21 28 L7 24 L21 20 Z" /></>,
  grid: <><rect x="7" y="7" width="14" height="14" rx="3" /><rect x="27" y="7" width="14" height="14" rx="3" /><rect x="7" y="27" width="14" height="14" rx="3" /><rect x="27" y="27" width="14" height="14" rx="3" /></>,
  bell: <><path d="M12 33 V22 a12 12 0 0 1 24 0 V33 L39 37 H9 Z" /><path d="M20 40 a4 4 0 0 0 8 0" /></>,
  doc: <><path d="M12 6 H29 L37 14 V42 H12 Z" /><path d="M29 6 V14 H37 M18 22 H31 M18 29 H31 M18 36 H26" /></>,
  door: <><path d="M12 42 V7 H33 V42" /><path d="M8 42 H40" /><circle cx="28" cy="25" r="1.6" /></>,
  rocket: <><path d="M24 5 c8 6 11 15 9 25 H15 c-2 -10 1 -19 9 -25 Z" /><circle cx="24" cy="18" r="4" /><path d="M15 30 L9 37 L16 36 M33 30 L39 37 L32 36 M21 36 L24 43 L27 36" /></>,
};
export const Ico: React.FC<{ n: string; s?: number; c?: string; w?: number; fill?: string }> = ({ n, s = 24, c = C.ink, w = 2.4, fill = "none" }) => (
  <svg width={s} height={s} viewBox="0 0 48 48" fill={fill} stroke={c} strokeWidth={w * (48 / s) * (s / 26)} strokeLinecap="round" strokeLinejoin="round" style={{ display: "block", flex: "none" }}>{P[n]}</svg>
);

/* ---------- surfaces ---------- */
export const CARD: React.CSSProperties = { background: C.white, borderRadius: 26, boxShadow: "0 0 0 1px rgba(25,27,32,0.05), 0 26px 56px -26px rgba(25,27,32,0.30)" };
// A white pill with red text (the JongLeren / Talent Hub chip); filled = red pill with white text.
export const Pill: React.FC<{ text: string; size?: number; icon?: string; filled?: boolean; style?: React.CSSProperties }> = ({ text, size = 28, icon, filled, style }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: size * 0.35, padding: `${size * 0.42}px ${size * 0.8}px`, borderRadius: 999,
    background: filled ? C.red : C.white, color: filled ? C.white : C.red, boxShadow: filled ? `0 14px 30px -14px rgba(207,20,30,0.55)` : "0 0 0 1px rgba(25,27,32,0.06), 0 14px 30px -16px rgba(25,27,32,0.30)",
    fontFamily: FONT, fontWeight: 700, fontSize: size, letterSpacing: "-0.005em", whiteSpace: "nowrap", ...style }}>
    {icon && <Ico n={icon} s={size * 1.05} c={filled ? C.white : C.red} w={2.6} />}{text}
  </div>
);
// A soft skill / filter chip (cloud gray, ink text); on = rose with red text and a check.
export const Chip: React.FC<{ text: string; size?: number; on?: number; style?: React.CSSProperties }> = ({ text, size = 22, on = 0, style }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: size * 0.3, padding: `${size * 0.32}px ${size * 0.65}px`, borderRadius: 999, whiteSpace: "nowrap",
    background: on > 0.5 ? C.rose : C.cloud, color: on > 0.5 ? C.red : C.ink, fontFamily: FONT, fontWeight: 700, fontSize: size, boxShadow: on > 0.5 ? `inset 0 0 0 2px ${C.red}` : undefined, ...style }}>
    {on > 0.5 && <Ico n="check" s={size * 0.9} c={C.red} w={3} />}{text}
  </div>
);
// An avatar: anonymised (a gray silhouette) until unlocked (initials on rose). size in px.
export const Avatar: React.FC<{ size: number; initials?: string; unlocked?: number; ring?: string; style?: React.CSSProperties }> = ({ size, initials = "", unlocked = 0, ring, style }) => (
  <div style={{ position: "relative", width: size, height: size, borderRadius: "50%", overflow: "hidden", background: C.cloud, flex: "none", boxShadow: ring ? `0 0 0 ${size * 0.06}px ${ring}` : undefined, ...style }}>
    <svg width={size} height={size} viewBox="0 0 48 48" style={{ position: "absolute", inset: 0, opacity: 1 - unlocked }}>
      <circle cx="24" cy="19" r="8.5" fill="#C9C6C2" /><path d="M7 46 c2 -11 9 -15 17 -15 s15 4 17 15 Z" fill="#C9C6C2" />
    </svg>
    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: C.rose, color: C.red, fontFamily: FONT, fontWeight: 900, fontSize: size * 0.38, opacity: unlocked }}>{initials}</div>
  </div>
);

/* ---------- candidates (example data; the platform shows an anonymised pool) ---------- */
export type Cand = { id: string; role: string; field: string; skills: string[]; exp: number; edu: string; lang: string; city: string; name: string; initials: string; jl?: boolean };
// jl = a JongLeren alumnus/alumna: internship work experience in Spain, verified by the partner (the USP).
export const CANDIDATES: Cand[] = [
  { jl: true, id: "2481", role: "Marketing Graduate", field: "Marketing", skills: ["Social media", "Spanish", "SEO"], exp: 2, edu: "Bachelor", lang: "EN · ES · NL", city: "Málaga", name: "Sofia de Vries", initials: "SV" },
  { jl: true, id: "1907", role: "Business Graduate", field: "Business", skills: ["Sales", "Excel", "English"], exp: 1, edu: "Bachelor", lang: "EN · NL", city: "Valencia", name: "Daan Bakker", initials: "DB" },
  { jl: true, id: "3125", role: "Tourism Graduate", field: "Hospitality", skills: ["Guest relations", "Spanish"], exp: 2, edu: "Bachelor", lang: "EN · ES", city: "Sevilla", name: "Lotte Jansen", initials: "LJ" },
  { id: "2210", role: "IT Graduate", field: "IT", skills: ["React", "SQL", "English"], exp: 1, edu: "Bachelor", lang: "EN · NL", city: "Madrid", name: "Noah Visser", initials: "NV" },
  { jl: true, id: "4402", role: "HR Graduate", field: "HR", skills: ["Recruitment", "German"], exp: 1, edu: "Bachelor", lang: "EN · DE", city: "Berlin", name: "Emma Smit", initials: "ES" },
  { jl: true, id: "1388", role: "Design Graduate", field: "Design", skills: ["Figma", "Branding"], exp: 2, edu: "Bachelor", lang: "EN · NL", city: "Barcelona", name: "Milan Peters", initials: "MP" },
  { jl: true, id: "2954", role: "Finance Graduate", field: "Finance", skills: ["Excel", "Reporting"], exp: 3, edu: "Master", lang: "EN · NL", city: "Amsterdam", name: "Julia Mulder", initials: "JM" },
  { jl: true, id: "3367", role: "Marketing Graduate", field: "Marketing", skills: ["Content", "Spanish"], exp: 1, edu: "Bachelor", lang: "EN · ES", city: "Alicante", name: "Sem de Boer", initials: "SB" },
  { jl: true, id: "1742", role: "Logistics Graduate", field: "Logistics", skills: ["Planning", "SAP"], exp: 2, edu: "Bachelor", lang: "EN · NL", city: "Rotterdam", name: "Sara Hendriks", initials: "SH" },
  { jl: true, id: "2678", role: "Event Graduate", field: "Events", skills: ["Planning", "Spanish"], exp: 1, edu: "Bachelor", lang: "EN · ES", city: "Málaga", name: "Luuk Vos", initials: "LV" },
  { id: "3591", role: "Sales Graduate", field: "Sales", skills: ["CRM", "English"], exp: 2, edu: "Bachelor", lang: "EN · NL", city: "Dublin", name: "Eva Dekker", initials: "ED" },
  { id: "1265", role: "Data Graduate", field: "Data", skills: ["Python", "SQL"], exp: 1, edu: "Master", lang: "EN · NL", city: "Lisbon", name: "Thijs Meijer", initials: "TM" },
];
// The candidate card as it shows in the pool: anonymised (silhouette, role, skills, experience, education) until
// unlocked; then the name and contact details appear. w is the card width (height ≈ 0.62 w). match = a % badge.
// verified 0..1 shows the "JongLeren verified" badge on JongLeren alumni (c.jl).
// Dutch role names for the example candidates.
const ROLES_NL: Record<string, string> = { "Marketing Graduate": "Afgestudeerd · Marketing", "Business Graduate": "Afgestudeerd · Business", "Tourism Graduate": "Afgestudeerd · Toerisme",
  "IT Graduate": "Afgestudeerd · IT", "HR Graduate": "Afgestudeerd · HR", "Design Graduate": "Afgestudeerd · Design", "Finance Graduate": "Afgestudeerd · Finance",
  "Logistics Graduate": "Afgestudeerd · Logistiek", "Event Graduate": "Afgestudeerd · Events", "Sales Graduate": "Afgestudeerd · Sales", "Data Graduate": "Afgestudeerd · Data" };
export const roleTx = (r: string) => tx(r, ROLES_NL[r] ?? r);
const SKILLS_NL: Record<string, string> = { Spanish: "Spaans", English: "Engels", German: "Duits", "Guest relations": "Gastvrijheid", Reporting: "Rapportage", Planning: "Planning", Sales: "Sales" };
export const skillTx = (t: string) => tx(t, SKILLS_NL[t] ?? t);
export const cityTx = (t: string) => tx(t, ({ Lisbon: "Lissabon" } as Record<string, string>)[t] ?? t);
export const CandidateCard: React.FC<{ c: Cand; w?: number; unlocked?: number; match?: number; hi?: number; verified?: number; style?: React.CSSProperties }> = ({ c, w = 300, unlocked = 0, match, hi = 0, verified = 0, style }) => {
  const s = w / 300;
  return (
    <div style={{ ...CARD, position: "relative", width: w, padding: 18 * s, boxSizing: "border-box", borderRadius: 20 * s, boxShadow: hi > 0 ? `0 0 0 ${3 * s * hi}px ${C.red}, 0 26px 56px -26px rgba(25,27,32,0.35)` : CARD.boxShadow, ...style }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 * s }}>
        <Avatar size={52 * s} initials={c.initials} unlocked={unlocked} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 19 * s, color: C.ink, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{unlocked > 0.5 ? c.name : roleTx(c.role)}</div>
          <div style={{ fontFamily: FONT, fontWeight: 400, fontSize: 15 * s, color: C.gray }}>{unlocked > 0.5 ? roleTx(c.role) : `${tx("Candidate", "Kandidaat")} #${c.id}`}</div>
        </div>
        {match !== undefined && <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 15 * s, color: C.red, background: C.rose, borderRadius: 999, padding: `${4 * s}px ${9 * s}px` }}>{match}%</div>}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 * s, marginTop: 14 * s }}>
        {c.skills.map((t) => <Chip key={t} text={skillTx(t)} size={13 * s} />)}
      </div>
      <div style={{ display: "flex", gap: 14 * s, marginTop: 12 * s, fontFamily: FONT, fontWeight: 700, fontSize: 14 * s, color: C.gray }}>
        <span>{tx(`${c.exp} yr${c.exp > 1 ? "s" : ""} exp.`, `${c.exp} jr ervaring`)}</span><span>{c.edu}</span><span>{c.lang}</span>
      </div>
      {c.jl && verified > 0 && <div style={{ position: "absolute", right: 12 * s, top: -12 * s, transform: `scale(${0.7 + 0.3 * verified})`, transformOrigin: "100% 50%", opacity: clamp01(verified * 2) }}><JLBadge size={12 * s} /></div>}
    </div>
  );
};

/* ---------- JongLeren: the verified partner (the USP: candidates with internship work experience via JongLeren) ---------- */
// The JongLeren mark (the juggling bull, red; white = for red grounds). h = height in px (the mark is 900×1120).
export const JLMark: React.FC<{ h: number; white?: boolean; style?: React.CSSProperties }> = ({ h, white, style }) => (
  <Img src={staticFile(white ? "img/jl-mark-white.png" : "img/jl-mark.png")} style={{ height: h, width: (h * 900) / 1120, display: "block", ...style }} />
);
// The JongLeren wordmark ("JongLeren.es", red). w = width in px (900×140).
export const JLWord: React.FC<{ w: number; style?: React.CSSProperties }> = ({ w, style }) => (
  <Img src={staticFile("img/jl-word.png")} style={{ width: w, height: (w * 140) / 900, display: "block", ...style }} />
);
// A small "JongLeren verified" badge (rose pill, the mark, a check), for a candidate card or profile. size = font px.
export const JLBadge: React.FC<{ size?: number; text?: string; style?: React.CSSProperties }> = ({ size = 16, text, style }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: size * 0.4, padding: `${size * 0.25}px ${size * 0.6}px ${size * 0.25}px ${size * 0.3}px`, borderRadius: 999, background: C.rose,
    color: C.red, fontFamily: FONT, fontWeight: 900, fontSize: size, whiteSpace: "nowrap", ...style }}>
    <div style={{ width: size * 1.5, height: size * 1.5, borderRadius: "50%", background: C.white, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}><JLMark h={size * 1.25} /></div>
    {text ?? tx("JongLeren verified", "JongLeren geverifieerd")}
    <Ico n="check" s={size} c={C.red} w={3.2} />
  </div>
);
// The partner seal: a round stamp "Verified partner" around the JongLeren mark. size = diameter in px. p 0..1 stamps it.
export const PartnerSeal: React.FC<{ size: number; p?: number; style?: React.CSSProperties }> = ({ size, p = 1, style }) => {
  const text = tx("VERIFIED PARTNER · VERIFIED PARTNER · ", "GEVERIFIEERDE PARTNER · GEVERIFIEERDE PARTNER · ");
  const id = React.useId().replace(/:/g, "");
  return (
    <div style={{ position: "relative", width: size, height: size, transform: `scale(${0.6 + 0.4 * p}) rotate(${(1 - p) * -25}deg)`, opacity: clamp01(p * 2), ...style }}>
      <svg width={size} height={size} viewBox="0 0 200 200" style={{ position: "absolute", inset: 0 }}>
        <circle cx="100" cy="100" r="97" fill={C.white} stroke={C.red} strokeWidth="4" />
        <circle cx="100" cy="100" r="70" fill={C.rose} />
        <defs><path id={`seal-${id}`} d="M100,100 m-83,0 a83,83 0 1,1 166,0 a83,83 0 1,1 -166,0" /></defs>
        <text fontFamily={FONT} fontWeight={900} fontSize="15" letterSpacing="2.2" fill={C.red}><textPath href={`#seal-${id}`}>{text}</textPath></text>
      </svg>
      <div style={{ position: "absolute", left: size * 0.5, top: size * 0.5, transform: "translate(-50%, -54%)" }}><JLMark h={size * 0.5} /></div>
      <div style={{ position: "absolute", right: size * 0.02, bottom: size * 0.06, width: size * 0.26, height: size * 0.26, borderRadius: "50%", background: C.red, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 0 ${size * 0.02}px ${C.white}` }}>
        <Ico n="check" s={size * 0.15} c={C.white} w={3.4} />
      </div>
    </div>
  );
};

/* ---------- the dashboard window (scenes B and C draw it identically) ---------- */
// The platform's client dashboard: a white window with a slim top bar (the "th" mark, a search field, credits), a
// left filter rail and a results area. x/y/w/h place the window; children render inside the results area (its
// content box starts at (rail + 32, bar + 28) inside the window). count = the results counter; credits = the
// client's credits. filters = 0..1 on-states of the three filter groups (skills, experience, qualifications).
export const DASH = { x: 160, y: 120, w: 1600, h: 860, bar: 78, rail: 300 };
export const Dashboard: React.FC<{ x?: number; y?: number; w?: number; h?: number; s?: number; o?: number; count: number; credits?: number; filters?: [number, number, number] | [number, number, number, number]; children?: React.ReactNode; style?: React.CSSProperties }> = ({
  x = DASH.x, y = DASH.y, w = DASH.w, h = DASH.h, s = 1, o = 1, count, credits = 10, filters = [0, 0, 0], children, style }) => {
  if (o <= 0.005) return null;
  const groups: [string, string, string[]][] = [[tx("Skills", "Vaardigheden"), "sliders", [tx("Spanish", "Spaans"), "Marketing", "Social media"]], [tx("Experience", "Werkervaring"), "briefcase", [tx("1–3 years", "1–3 jaar")]],
    [tx("Qualifications", "Kwalificaties"), "cap", [tx("Bachelor's degree", "Bachelor")]]];
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, opacity: o, transform: `scale(${s})`, transformOrigin: "50% 50%", ...CARD, borderRadius: 30, overflow: "hidden", ...style }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: w, height: DASH.bar, display: "flex", alignItems: "center", gap: 22, padding: "0 30px", boxSizing: "border-box", borderBottom: `1px solid ${C.line}` }}>
        <THMark size={52} />
        <div style={{ flex: 1, height: 46, borderRadius: 999, background: C.cloud, display: "flex", alignItems: "center", gap: 12, padding: "0 20px", fontFamily: FONT, fontSize: 20, color: C.gray }}><Ico n="search" s={22} c={C.gray} />{tx("Search candidates", "Zoek kandidaten")}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: FONT, fontWeight: 700, fontSize: 20, color: C.ink, background: C.rose, borderRadius: 999, padding: "10px 18px" }}><Ico n="coin" s={24} c={C.red} />{credits} credits</div>
      </div>
      <div style={{ position: "absolute", left: 0, top: DASH.bar, width: DASH.rail, bottom: 0, background: C.ivory, borderRight: `1px solid ${C.line}`, padding: "26px 24px", boxSizing: "border-box" }}>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 24, color: C.ink, display: "flex", alignItems: "center", gap: 10 }}><Ico n="filter" s={24} c={C.red} />{tx("Filters", "Filters")}</div>
        {groups.map(([name, icon, chips], i) => (
          <div key={name} style={{ marginTop: 26 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: FONT, fontWeight: 700, fontSize: 18, color: C.gray }}><Ico n={icon} s={20} c={C.gray} />{name}</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 10 }}>{chips.map((t) => <Chip key={t} text={t} size={16} on={filters[i]} />)}</div>
          </div>
        ))}
        {/* the verified partner filter: internship experience verified by JongLeren */}
        <div style={{ marginTop: 26 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: FONT, fontWeight: 700, fontSize: 18, color: C.gray }}><Ico n="check" s={20} c={C.gray} />{tx("Verified partner", "Geverifieerde partner")}</div>
          <div style={{ marginTop: 10, display: "inline-flex", alignItems: "center", gap: 8, padding: "5px 12px 5px 6px", borderRadius: 999, background: (filters[3] ?? 0) > 0.5 ? C.rose : C.cloud,
            boxShadow: (filters[3] ?? 0) > 0.5 ? `inset 0 0 0 2px ${C.red}` : undefined, fontFamily: FONT, fontWeight: 700, fontSize: 16, color: (filters[3] ?? 0) > 0.5 ? C.red : C.ink }}>
            <div style={{ width: 24, height: 24, borderRadius: "50%", background: C.white, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}><JLMark h={20} /></div>JongLeren
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", left: DASH.rail + 32, top: DASH.bar + 22, fontFamily: FONT, fontWeight: 900, fontSize: 26, color: C.ink }}>
        {count.toLocaleString(tx("en-US", "nl-NL"))} <span style={{ fontWeight: 400, color: C.gray }}>{tx("candidates", "kandidaten")}</span>
      </div>
      <div style={{ position: "absolute", left: DASH.rail + 32, top: DASH.bar + 72, right: 32, bottom: 0 }}>{children}</div>
    </div>
  );
};

/* ---------- ground details and hand-offs ---------- */
// Soft red ripples (the JongLeren films' background rings), centred on (x, y); a = strength 0..1.
export const Ripples: React.FC<{ g: number; x: number; y: number; a?: number; n?: number }> = ({ g, x, y, a = 1, n = 4 }) => (
  <>{Array.from({ length: n }, (_, i) => {
    const r = 180 + (((g * 1.4 + i * (900 / n)) % 900));
    return <div key={i} style={{ position: "absolute", left: x - r, top: y - r, width: 2 * r, height: 2 * r, borderRadius: "50%", border: `2px solid rgba(207,20,30,${0.10 * a * (1 - (r - 180) / 900)})` }} />;
  })}</>
);
// A full red field grown from a point (an iris): p 0..1; the radius reaches the frame's far corner at p = 1.
export const RedIris: React.FC<{ x: number; y: number; p: number; color?: string }> = ({ x, y, p, color = C.red }) => {
  if (p <= 0) return null;
  const R = Math.hypot(Math.max(x, 1920 - x), Math.max(y, 1080 - y)) * p;
  return <div style={{ position: "absolute", left: x - R, top: y - R, width: 2 * R, height: 2 * R, borderRadius: "50%", background: color }} />;
};
// The thread: a red dot (as in the JongLeren films) and a red connection line between two points (p 0..1 draws it).
export const Dot: React.FC<{ x: number; y: number; r: number; color?: string; style?: React.CSSProperties }> = ({ x, y, r, color = C.red, style }) => (
  <div style={{ position: "absolute", left: x - r, top: y - r, width: 2 * r, height: 2 * r, borderRadius: "50%", background: color, ...style }} />
);
export const Link: React.FC<{ x1: number; y1: number; x2: number; y2: number; p: number; bend?: number; width?: number; color?: string; dash?: boolean }> = ({ x1, y1, x2, y2, p, bend = 0, width = 4, color = C.red, dash }) => {
  if (p <= 0) return null;
  const mx = (x1 + x2) / 2 - (y2 - y1) * bend, my = (y1 + y2) / 2 + (x2 - x1) * bend;
  const d = `M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`;
  const L = Math.hypot(x2 - x1, y2 - y1) * (1 + Math.abs(bend));
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, overflow: "visible", pointerEvents: "none" }}>
      <path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeDasharray={dash ? "2 12" : `${L * 1.2} ${L * 1.2}`} strokeDashoffset={dash ? 0 : L * 1.2 * (1 - p)} opacity={dash ? p : 1} />
    </svg>
  );
};

/* ---------- example opportunities (graduates' side) ---------- */
export const JOBS = tx([
  { title: "Marketing Assistant", city: "Madrid", country: "Spain" }, { title: "Junior Account Manager", city: "Berlin", country: "Germany" },
  { title: "Hotel Operations Trainee", city: "Lisbon", country: "Portugal" }, { title: "Business Analyst", city: "Dublin", country: "Ireland" },
  { title: "Content Creator", city: "Barcelona", country: "Spain" }, { title: "HR Coordinator", city: "Amsterdam", country: "Netherlands" },
], [
  { title: "Marketingassistent", city: "Madrid", country: "Spanje" }, { title: "Junior accountmanager", city: "Berlijn", country: "Duitsland" },
  { title: "Trainee hotelbeheer", city: "Lissabon", country: "Portugal" }, { title: "Business analist", city: "Dublin", country: "Ierland" },
  { title: "Contentcreator", city: "Barcelona", country: "Spanje" }, { title: "HR-coördinator", city: "Amsterdam", country: "Nederland" },
]);
export { ARRIVE, C, DEPART, MOVE, POP, SNAP, clamp01, mix };
