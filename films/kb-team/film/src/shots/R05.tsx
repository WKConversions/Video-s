// Package R05 · reference f385–f474 · shots M N O.
//   M  f385–f419  full-screen flash cuts of tall record cards (photo + name + status), 3 / 5 cards, then a 3 x 5 wall;
//                 hard cuts on the reference's frames, held between (the reference is held, 24 fps with repeats)
//   N  f420–f433  macro: the letters of "search" as typed (bold, near black), new crop at each cut: s, se, ea, ar, rc
//   O  f434–f474  the message box: the second sentence is typed to its end; no push
// t = seconds since f385.
import React from "react";
import { Img, staticFile } from "remotion";
import { C, F, Ground, Msg, abs, kf, refN, useFonts } from "../kit";
import type { Pkg, Sfx } from "../types";

const F0 = 385;
const at = (n: number) => (n - F0) / 24;
const refAt = (t: number) => refN(t, F0) + 1e-6;

// ---------------------------------------------------------------- M
// cleared stills only (single people, and single faces cropped out of the group stills) plus initials tiles
const fx = (f: number) => `${Math.max(0, Math.min(100, ((f * 1405 - 215) / 974) * 100)).toFixed(0)}% 50%`;
type Item = { src: string; pos: string } | { tile: string };
const PHOTO: Item[] = [
  { src: "stills/R-1.jpg", pos: "40% 50%" }, { tile: C.cyan }, { src: "stills/AC-1.jpg", pos: fx(0.31) }, { tile: C.indigo }, { src: "stills/AA-1.jpg", pos: "42% 50%" },
  { src: "stills/F3-1.jpg", pos: fx(0.16) }, { tile: C.mint }, { src: "stills/AD-1.jpg", pos: "36% 50%" }, { src: "stills/AC-1.jpg", pos: fx(0.54) }, { tile: C.violet },
  { src: "stills/W-1.jpg", pos: "70% 50%" }, { src: "stills/F3-1.jpg", pos: fx(0.34) }, { tile: C.amber }, { src: "stills/AN-1.jpg", pos: "72% 50%" }, { src: "stills/AC-1.jpg", pos: fx(0.8) },
  { tile: C.coral }, { src: "stills/F4-1.jpg", pos: "45% 50%" }, { src: "stills/F3-1.jpg", pos: fx(0.5) }, { tile: C.ink }, { src: "stills/AC-1.jpg", pos: fx(0.11) }, { src: "stills/F3-1.jpg", pos: fx(0.7) },
];
const NAMES = ["Sanne", "Milan", "Noor", "Daan", "Lotte", "Jesse", "Fenna", "Ruben"];
const STATUS: [string, string][] = [["New lead", C.cyan], ["Follow-up sent", C.amber], ["Meeting booked", C.mint], ["Quote signed", C.green]];
const CW = 431, CH = 790, PITCH = 433, ROWP = 795, X0 = 745, Y0 = 145;

const Sil: React.FC = () => (
  <svg viewBox="0 0 100 220" style={abs(0, 0, "100%" as any, "100%" as any)} preserveAspectRatio="xMidYMax meet">
    <g fill="#3DB8F0"><ellipse cx="50" cy="40" rx="17" ry="21" /><path d="M30 68 Q50 58 70 68 L76 120 L68 124 L66 215 L52 215 L50 140 L48 215 L34 215 L32 124 L24 120 Z" /></g>
  </svg>
);
const Card: React.FC<{ x: number; y: number; k: number; place?: boolean; mid?: boolean; seed: number }> = ({ x, y, k, place, mid, seed }) => {
  const it = PHOTO[k % PHOTO.length];
  const nm = NAMES[(seed + k) % NAMES.length], [st, sc] = STATUS[(seed + k * 3) % STATUS.length];
  return (
    <div style={abs(x, y, CW, CH, { overflow: "hidden", borderLeft: "2px dotted rgba(255,255,255,.85)", boxSizing: "border-box", background: "#999" })}>
      {"src" in it ? <Img src={staticFile(it.src)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: it.pos, filter: "brightness(1.1) contrast(.82) saturate(.9)" }} />
        : <div style={abs(0, 0, CW, CH, { background: it.tile, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 330, letterSpacing: -8 })}>{nm[0]}</div>}
      <div style={abs(0, 0, CW, CH, { background: "linear-gradient(180deg, rgba(228,234,240,.6) 0%, rgba(228,234,240,.2) 40%, rgba(184,104,90,.16) 58%, rgba(184,104,90,.42) 100%)" })} />
      {place && <div style={abs(0, 0, CW, CH, { background: "rgba(220,225,230,.35)" })}><Sil /></div>}
      {!place && !mid && (
        <div style={abs(22, 700, undefined, 52, { display: "flex", alignItems: "center", gap: 10, padding: "0 20px 0 14px", borderRadius: 26, background: "rgba(255,255,255,.88)", fontSize: 22, fontWeight: 600, color: "#16202E", whiteSpace: "nowrap" })}>
          <span style={{ width: 14, height: 14, borderRadius: 7, background: sc }} />{nm}<span style={{ fontWeight: 500, color: "#5A6575" }}>{st}</span>
        </div>)}
      {mid && (<>
        <div style={abs(24, 44, 48, 48, { borderRadius: 24, background: "rgba(255,255,255,.88)", display: "flex", alignItems: "center", justifyContent: "center" })}><svg width="20" height="20" viewBox="0 0 20 20"><path d="M12 4l-6 6 6 6" fill="none" stroke="#16202E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></div>
        <div style={abs(147, 44, 138, 48, { borderRadius: 24, background: "rgba(255,255,255,.88)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, fontWeight: 500, color: "#16202E" })}>NEW LEAD</div>
        <div style={abs(359, 44, 48, 48, { borderRadius: 24, background: "rgba(255,255,255,.88)", display: "flex", alignItems: "center", justifyContent: "center" })}><svg width="22" height="22" viewBox="0 0 22 22"><path d="M4 11a7 7 0 0 1 12-5l2 2M18 11a7 7 0 0 1-12 5l-2-2M17 3v5h-5M5 19v-5h5" fill="none" stroke="#16202E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg></div>
        <div style={abs(10, 728, 411, 48, { borderRadius: 24, background: "rgba(222,222,222,.95)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 500, color: "#16202E", letterSpacing: 0.3 })}>
          <svg width="20" height="22" viewBox="0 0 20 22" style={{ position: "absolute", left: 18 }}><rect x="3" y="9" width="14" height="10" rx="2" fill="none" stroke="#16202E" strokeWidth="1.8" /><path d="M6 9V6a4 4 0 0 1 8 0v3" fill="none" stroke="#16202E" strokeWidth="1.8" /></svg>OPEN RECORD</div>
      </>)}
    </div>
  );
};
// layout of each cut: rows (-1 top, 0 mid, 1 bottom), columns (-2..2), placeholders as "row,col" keys
// changes inside a flash (the reference swaps part of its picture on f391, f395, f403, f415): [frame, "row,col", card shift]
const SUBS: [number, string, number][] = [[391, "0,2", 4], [395, "-1,2", 0], [395, "1,-2", 0], [395, "1,2", 0], [403, "0,2", 6], [415, "0,-2", 5]];
type Cut = { f: number; rows: number[]; cols: number[]; ph: string[]; mid: number };
const CUTS: Cut[] = [
  { f: 385, rows: [0], cols: [-1, 0, 1], ph: ["0,-1", "0,1"], mid: 0 },
  { f: 387, rows: [0], cols: [-2, -1, 0, 1, 2], ph: ["0,-2", "0,2"], mid: 0 },
  { f: 390, rows: [0], cols: [-2, -1, 0, 1, 2], ph: ["0,-2", "0,2"], mid: 0 },
  { f: 393, rows: [-1, 0, 1], cols: [-2, -1, 0, 1, 2], ph: ["-1,2", "1,-2", "1,2"], mid: 0 },
  { f: 396, rows: [-1, 0, 1], cols: [-2, -1, 0, 1, 2], ph: ["1,-2", "1,2"], mid: 0 },
  { f: 399, rows: [-1, 0, 1], cols: [-2, -1, 0, 1, 2], ph: [], mid: 0 },
  { f: 402, rows: [-1, 0, 1], cols: [-2, -1, 0, 1, 2], ph: [], mid: 0 },
  { f: 405, rows: [-1, 0, 1], cols: [-2, -1, 0, 1, 2], ph: [], mid: 3 },
  { f: 408, rows: [-1, 0, 1], cols: [-2, -1, 0, 1, 2], ph: [], mid: 5 },
  { f: 411, rows: [-1, 0, 1], cols: [-2, -1, 0, 1, 2], ph: [], mid: 6 },
  { f: 414, rows: [0], cols: [-2, -1, 0, 1, 2], ph: [], mid: 8 },
  { f: 417, rows: [0], cols: [-1, 0, 1], ph: [], mid: 10 },
];
const ShotM: React.FC<{ n: number }> = ({ n }) => {
  let ci = 0;
  CUTS.forEach((c, i) => { if (n >= c.f) ci = i; });
  const c = CUTS[ci], moved = n >= 417 ? { x: 2.5, y: 1.1 } : { x: 0, y: 0 };
  const cards: React.ReactNode[] = [];
  for (const r of c.rows) for (const col of c.cols) {
    const mid = r === 0 && col === 0;
    const k = mid ? c.mid : (ci * 7 + (r + 1) * 3 + (col + 2) * 5 + 1) % PHOTO.length;
    const key = `${r},${col}`, subs = SUBS.filter(([f, kk]) => f > c.f && n >= f && kk === key && f < (CUTS[ci + 1]?.f ?? 999));
    const k2 = (k === c.mid && !mid ? (k + 1) % PHOTO.length : k) + subs.reduce((a, x) => a + x[2], 0);
    cards.push(<Card key={key} x={X0 + col * PITCH + moved.x} y={Y0 + r * ROWP + moved.y} k={k2} place={c.ph.includes(key) && !subs.some((x) => x[2] === 0)} mid={mid} seed={ci + r * 2 + col} />);
  }
  return <div style={abs(0, 0, 1920, 1080, { background: "#EEEEEE", overflow: "hidden", fontFamily: F })}>{cards}</div>;
};

// ---------------------------------------------------------------- N
// [cut frame, previous letter, newest letter, newest letter's centre x, font px, baseline y]
const CROPS: [number, string, string, number, number, number][] = [
  [420, "", "s", 953, 1620, 880], [423, "s", "e", 930, 1750, 1012], [426, "e", "a", 961, 1780, 1022], [429, "a", "r", 932, 1790, 1020], [431, "r", "c", 920, 1830, 1030],
];
const ShotN: React.FC<{ n: number }> = ({ n }) => {
  let c = CROPS[0];
  for (const s of CROPS) if (n >= s[0]) c = s;
  const [, prev, cur, cx, fs, base] = c;
  return (
    <Ground tone="vig">
      <div style={abs(0, 0, 1920, 1080, { background: "radial-gradient(ellipse 960px 540px at 50% 50%, #FBFBFB 0%, #F7F7F7 60%, #D9D9D9 100%)" })} />
      <div style={abs(0, 0, 1920, 1080, { })}>
        <div style={{ position: "absolute", left: cx, top: base - 0.8585 * fs, fontSize: fs, lineHeight: 1, fontWeight: 600, color: "#050505", letterSpacing: -fs * 0.035, whiteSpace: "nowrap", transform: "translateX(-50%)" }}>
          <span style={{ position: "absolute", right: "100%", top: 0 }}>{prev}</span>{cur}
        </div>
      </div>
    </Ground>
  );
};

// ---------------------------------------------------------------- O
const HEAD = "We want to be found by the right customers, in search and ";
const TAIL = "in AI answers.";
// the reference's typing: frame on which each of the 14 last characters appears ("gu" is there at the cut)
const TYPE_F = [434, 434, 435, 438, 441, 443, 446, 452, 454, 456, 458, 460, 461, 462];
const ShotO: React.FC<{ n: number }> = ({ n }) => {
  let k = 0;
  TYPE_F.forEach((f, i) => { if (n >= f) k = i + 1; });
  const last = k > 0 ? TYPE_F[k - 1] : 434;
  const caret = k < TAIL.length ? n - last < 3 || Math.floor((n - last - 3) / 6) % 2 === 1 : Math.floor((n - 462) / 6) % 2 === 0;
  const dx = kf(n, [[468, 0], [470, 1], [471, 2], [472, 4], [473, 8], [474, 8]]);
  return (
    <Ground tone="ui">
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `translate3d(${dx.toFixed(2)}px, 0, 0)`, willChange: "transform" }}>
        <Msg x={405} y={400} w={1110} text={HEAD + TAIL.slice(0, k)} caret={caret} />
      </div>
    </Ground>
  );
};

const Comp: React.FC<{ t: number }> = ({ t }) => {
  const ok = useFonts();
  const n = refAt(t);
  if (!ok) return <Ground tone={n >= 434 ? "ui" : n >= 420 ? "vig" : "paper"} />;
  if (n >= 434) return <ShotO n={n} />;
  if (n >= 420) return <ShotN n={n} />;
  return <ShotM n={n} />;
};

const sfx: Sfx[] = [
  ...[385, 387, 390, 393, 396, 399, 402, 405, 408, 411, 414, 417].map((f) => ({ t: at(f), kind: "tick", note: "flash cut", ref: f })),
  ...[420, 423, 426, 429, 431].map((f, i) => ({ t: at(f), kind: "type", note: i === 3 ? "0.08" : "0.12", ref: f })),
  { t: at(434), kind: "type", note: "0.30", ref: 434 },
  { t: at(441), kind: "type", note: "0.20", ref: 441 },
  { t: at(452), kind: "type", note: "0.45", ref: 452 },
];

export const PKG: Pkg = { id: "R05", Comp, sfx };
