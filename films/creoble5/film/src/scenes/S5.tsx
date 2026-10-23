// Scene 5 (builder 5), revision 1 (bigger object, useful motion): h4 → end.
// "Brug for hjælp? Et menneske, der forstår din forretning. Ingen kø. Ingen robotsvar. Creoble. Hjemmeside og hosting,
// samlet ét sted. Byg den. Se den. Så køber du. Byg din side gratis på creoble.dk."
// One object at a time on plain cream, centred, about 2× the draft: the sage thread capsule becomes a chat that TYPES
// (question, then the human's reply), a big queue card whose number rolls down to 0, a big robot that is flicked away,
// a dot that lands as the full stop of a 150 px wordmark; two pills merge (Gooey) and spring out into three step cards
// that act it out (a site builds itself, an eye scans it, a price rolls and a check ticks); they flow into the CTA.
// No float, sway or wobble: everything that moves says something. Transforms only; text either sits still or moves fast.
import React from "react";
import { Img, staticFile } from "remotion";
import { C, INOUT, LIN, OUT, SANS, SERIF, clamp01, mix } from "../lib";
import { Island, PillButton, RollNumber, Ico, f } from "../shared";
import { CX, CY, HANDOFF_HALF, Handoff, Line } from "../v5";
import { WM_DOT, WM_VIEW, WM_WORD } from "../wordmark";

// ── clock helpers (seconds; own springs so nothing is rounded to the 30 fps grid) ──────────────────────────────────
const sec = (l: string) => f(l) / 30;
const START = (f("h4") + HANDOFF_HALF) / 30;               // the capsule leaves the hand-off: x 1160, y 540, 200×60
/** Apple spring from time `at` (s): resp = response (s), damp = damping ratio (<1 overshoots). 0 → 1 (passes 1). */
const spr = (t: number, at: number, resp = 0.45, damp = 0.62) => {
  const x = t - at;
  if (x <= 0) return 0;
  const w0 = (2 * Math.PI) / resp;
  if (damp >= 1) return 1 - (1 + w0 * x) * Math.exp(-w0 * x);
  const wd = w0 * Math.sqrt(1 - damp * damp);
  return 1 - Math.exp(-damp * w0 * x) * (Math.cos(wd * x) + ((damp * w0) / wd) * Math.sin(wd * x));
};
const ez = (t: number, at: number, dur: number, e: (x: number) => number = OUT) => e(clamp01((t - at) / dur));
/** a short decaying wobble after `at` (a kick): 0 before, ±1 → 0 after */
const kick = (t: number, at: number, rate = 9, freq = 26) => { const x = t - at; return x <= 0 ? 0 : Math.exp(-x * rate) * Math.sin(x * freq); };
/** Apple press feedback: 0 → 1 in 0.1 s, held, released with a spring */
const prs = (t: number, at: number, hold = 0.12) => {
  const x = t - at;
  if (x < 0) return 0;
  if (x < 0.1) return x / 0.1;
  if (x < 0.1 + hold) return 1;
  const r = x - 0.1 - hold, w0 = (2 * Math.PI) / 0.3;
  return (1 + w0 * r) * Math.exp(-w0 * r);
};
const sh = (a: number) => `0 1px 2px rgba(26,22,20,${0.05 * a}), 0 18px 40px -18px rgba(26,22,20,${0.22 * a})`;
const cmix = (a: string, b: string, pa: number) => `color-mix(in srgb, ${a} ${(clamp01(pa) * 100).toFixed(1)}%, ${b})`;
const typed = (t: number, at: number, text: string, cps: number) => text.slice(0, Math.max(0, Math.min(text.length, Math.floor((t - at) * cps))));

// ── the labels this scene lands on ─────────────────────────────────────────────────────────────────────────────────
const L = {
  et: sec("w:et"), forstr: sec("w:forstr"), din4: sec("w:din4"), ingen4: sec("w:ingen4"), ingen5: sec("w:ingen5"), robot: sec("w:robotsvar"),
  creoble: sec("w:creoble3"), hjem: sec("w:hjemmeside2"), hosting: sec("w:hosting"), samlet: sec("w:samlet"), t: sec("w:t"), sted: sec("w:sted"),
  byg: sec("w:byg"), se: sec("w:se"), s2: sec("w:s2"), byg2: sec("w:byg2"), creoble4: sec("w:creoble4"),
};
const B = {
  collapse: 42.0,            // the chat gathers into the capsule
  card: L.ingen4 - 0.02,     // capsule → queue card
  roll: L.ingen4 + 0.1,      // 12 → 0
  cardOut: 43.35,            // the card shrinks to a dot
  launch: 44.4,              // the dot leaves for the wordmark's full stop
  land: 44.7,
  slide: L.hjem - 0.28,      // the wordmark slides up
  merge: L.samlet + 0.04,    // the pills melt together
  split: L.byg - 0.16,       // the capsule springs out into three step cards
  gather: 50.28,              // the cards flow into the button
  byg2: L.byg2,              // the button grows (50.61)
  press: 51.4,
};

// ── layout (px at 1080p; nothing above 1150 × 920) ─────────────────────────────────────────────────────────────────
const STAGE_Y = 545;         // pills and the button
const WM_Y = 370;            // the small wordmark
const WM_H = 150, WM_W = (WM_H * WM_VIEW.w) / WM_VIEW.h;
const WM_DOT_X = CX - WM_W / 2 + (7062.84 / WM_VIEW.w) * WM_W, WM_DOT_Y = CY - WM_H / 2 + (1344.2 / WM_VIEW.h) * WM_H;   // the full stop (px)
const WM_DOT_D = (2 * 145 * WM_H) / WM_VIEW.h;                // its diameter
const DOT = 64;                                               // the thread dot before it lands
const AV = 110, GAP = 24, RW = 760, RH = 150;
const CL_X0 = CX - (AV + GAP + RW) / 2;
const AV_P = { x: CL_X0 + AV / 2, y: 700 };
const RP = { x: CL_X0 + AV + GAP + RW / 2, y: 700 };
const SG = { x: CL_X0 + AV + GAP + RW - 280, y: 545, w: 560, h: 140 };
const ISL_TOP = 335, ISL = { w: 380, h: 92 };
const CARD = { w: 900, h: 360, y: 470 };
const PW = 440, PH = 130;                                     // the two pills
const SITE = { w: 900, h: 540, y: 500 };                     // the step stage
const TYPE_LINE = 64;
const BTN = { w: 780, h: 140 };

// ── a morphing blob: ONE static 200×60 box, moved and sized with transforms only (a pill is exactly the capsule) ───
const BASE = { w: 200, h: 60 };
const Blob: React.FC<{ x: number; y: number; w: number; h: number; r?: number; color?: string; shadow?: string; border?: number; opacity?: number; rot?: number; tr?: string }> =
  ({ x, y, w, h, r, color = C.sage, shadow, border = 0, opacity = 1, rot = 0, tr = "" }) => {
  if (w < 0.5 || h < 0.5) return null;
  const sx = w / BASE.w, sy = h / BASE.h, rr = Math.min(r ?? Math.min(w, h) / 2, Math.min(w, h) / 2);
  const plain = `translate(${x - w / 2}px, ${y - h / 2}px) ${tr} rotate(${rot}deg)`;
  return (
    <>
      {shadow && <div style={{ position: "absolute", left: 0, top: 0, width: w, height: h, borderRadius: rr, boxShadow: shadow, opacity, transform: plain }} />}
      <div style={{ position: "absolute", left: 0, top: 0, width: BASE.w, height: BASE.h, background: color, opacity,
        transform: `translate(${x - BASE.w / 2}px, ${y - BASE.h / 2}px) ${tr} rotate(${rot}deg) scale(${sx}, ${sy})`, borderRadius: `${rr / sx}px / ${rr / sy}px` }} />
      {border > 0.01 && <div style={{ position: "absolute", left: 0, top: 0, width: w, height: h, boxSizing: "border-box", borderRadius: rr, border: `1.5px solid rgba(232,229,223,${border})`, opacity, transform: plain }} />}
    </>
  );
};
/** an absolutely placed layer moved by transform; `still` keeps its text crisp while it travels (never scaled up later) */
const Abs: React.FC<{ x: number; y: number; style?: React.CSSProperties; still?: boolean; children?: React.ReactNode }> = ({ x, y, style, still, children }) =>
  <div style={{ position: "absolute", left: 0, top: 0, transform: `translate(${x}px, ${y}px)${still ? " rotate(0.1deg)" : ""}`, willChange: still ? "transform" : undefined, ...style }}>{children}</div>;
/** words that rise out of blur one after another (left aligned from x, or centred on x); fast */
const Words: React.FC<{ words: string[]; ats: number[]; t: number; x: number; y: number; size: number; align?: "left" | "center"; serif?: boolean; color?: string; weight?: number; out?: number; italic?: number[]; dur?: number }> =
  ({ words, ats, t, x, y, size, align = "center", serif = false, color = C.ink, weight = 500, out = 0, italic = [], dur = 0.3 }) => (
  <div style={{ position: "absolute", left: align === "center" ? x - 700 : x, top: y - size * 0.62, width: align === "center" ? 1400 : undefined, display: "flex", justifyContent: align === "center" ? "center" : "flex-start", gap: size * 0.28, whiteSpace: "pre", lineHeight: 1.2,
    fontFamily: serif ? SERIF : SANS, fontSize: size, fontWeight: serif ? 400 : weight, letterSpacing: serif ? "-0.02em" : "-0.01em", color, opacity: 1 - out, filter: out > 0 ? `blur(${out * 10}px)` : undefined }}>
    {words.map((w, i) => { const q = ez(t, ats[i], dur, OUT);
      return <span key={i} style={{ display: "inline-block", opacity: q, transform: `translateY(${(1 - q) * 22}px) scale(${0.92 + 0.08 * q})`, filter: q < 1 ? `blur(${(1 - q) * 8}px)` : undefined, fontStyle: italic.includes(i) ? "italic" : "normal" }}>{w}</span>; })}
  </div>
);

// ── drawings ───────────────────────────────────────────────────────────────────────────────────────────────────────
const Dots: React.FC<{ t: number; x: number; y: number; o: number; color?: string }> = ({ t, x, y, o, color = "#fff" }) => (
  <Abs x={x - 54} y={y - 12} style={{ opacity: o, display: "flex", gap: 20 }}>
    {[0, 1, 2].map((i) => { const up = Math.max(0, Math.sin(t * 11 - i * 0.9));
      return <div key={i} style={{ width: 24, height: 24, borderRadius: 12, background: color, opacity: 0.5 + 0.5 * up, transform: `translateY(${-14 * up}px) scale(${1 + 0.2 * up})` }} />; })}
  </Abs>
);
const Tail: React.FC<{ x: number; y: number; s: number; color: string }> = ({ x, y, s, color }) => (
  <Abs x={x} y={y} style={{ transform: `translate(${x}px, ${y}px) scale(${s})`, transformOrigin: "0 0" }}>
    <svg width={56} height={50} viewBox="0 0 32 28" style={{ display: "block", overflow: "visible" }}><path d="M0 0 L16 0 C16 12 22 23 32 27 C19 29 7 24 0 14 Z" fill={color} /></svg>
  </Abs>
);
const Robot: React.FC<{ blink: number }> = ({ blink }) => (
  <svg width={280} height={280} viewBox="0 0 160 160" style={{ display: "block", overflow: "visible", filter: "drop-shadow(0 16px 20px rgba(26,22,20,0.16))" }}>
    <path d="M80 44 V26" stroke={C.ink} strokeWidth={5} strokeLinecap="round" />
    <circle cx={80} cy={18} r={9} fill={C.sage} />
    <rect x={13} y={72} width={14} height={26} rx={7} fill={C.ink} /><rect x={133} y={72} width={14} height={26} rx={7} fill={C.ink} />
    <rect x={28} y={44} width={104} height={82} rx={28} fill="#fff" stroke={C.ink} strokeWidth={5} />
    <ellipse cx={58} cy={82} rx={8} ry={8 * blink} fill={C.ink} /><ellipse cx={102} cy={82} rx={8} ry={8 * blink} fill={C.ink} />
    <path d="M62 106 H98" stroke={C.ink} strokeWidth={5} strokeLinecap="round" />
  </svg>
);
/** vertical counter strip 12 → 0, rolling downwards through the numbers (Fraunces 200) */
const QueueStrip: React.FC<{ v: number }> = ({ v }) => {
  const ROW = 250, rows = Array.from({ length: 13 }, (_, i) => 12 - i);
  const m = "linear-gradient(transparent 0, #000 18%, #000 82%, transparent 100%)";
  return (
    <div style={{ width: 300, height: ROW, overflow: "hidden", position: "relative", WebkitMaskImage: m, maskImage: m }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: "100%", transform: `translateY(${-(12 - v) * ROW}px)`, willChange: "transform" }}>
        {rows.map((n) => <div key={n} style={{ height: ROW, lineHeight: `${ROW}px`, textAlign: "center", fontFamily: SERIF, fontSize: 200, color: C.cream, letterSpacing: "-0.03em" }}>{n}</div>)}
      </div>
    </div>
  );
};
/** the example site (Holm Fysioterapi, its own slate teal) that "Byg den" builds block by block and "Se den" scrolls */
const SiteView: React.FC<{ t: number; ats: number[] | null; scroll: number }> = ({ t, ats, scroll }) => {
  const q = (i: number) => (ats ? spr(t, ats[i], 0.36, 0.55) : 1);
  const wrap = (i: number, x: number, y: number, w: number, h: number, st: React.CSSProperties, ch?: React.ReactNode) => {
    const p = q(i);
    if (p <= 0.001) return null;
    return <div key={i} style={{ position: "absolute", left: 0, top: 0, width: w, height: h, opacity: clamp01(p * 4), transform: `translate(${x}px, ${y - scroll + (1 - p) * -90}px) scale(${mix(0.86, 1, clamp01(p))})`, ...st }}>{ch}</div>;
  };
  const photo = (src: string, w: number, h: number, r: number) => <div style={{ width: w, height: h, borderRadius: r, overflow: "hidden", background: HOLM_TINT }}><Img src={staticFile(`img/${src}`)} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>;
  return (
    <div style={{ position: "absolute", inset: 0, background: "#F4F1EC", fontFamily: SANS, color: "#1F2A2E" }}>
      {wrap(0, 40, 26, 820, 48, {}, <div style={{ display: "flex", alignItems: "center", gap: 14, height: 48 }}>
        <div style={{ width: 44, height: 44, borderRadius: 13, background: "#2E4A52", color: "#fff", fontWeight: 700, fontSize: 26, display: "flex", alignItems: "center", justifyContent: "center" }}>H</div>
        <div style={{ fontSize: 28, fontWeight: 600 }}>Holm Fysioterapi</div><div style={{ flex: 1 }} />
        <div style={{ fontSize: 22, color: "#5E6A6D" }}>Behandlinger</div><div style={{ fontSize: 22, color: "#5E6A6D", marginLeft: 26 }}>Kontakt</div></div>)}
      {wrap(1, 44, 112, 440, 130, { fontSize: 58, fontWeight: 600, letterSpacing: "-0.03em", lineHeight: 1.05 }, <>Kom godt i bevægelse igen.</>)}
      {wrap(2, 44, 262, 400, 66, { fontSize: 23, lineHeight: 1.45, color: "#5E6A6D" }, <>Fysioterapi og genoptræning på Frederiksberg.</>)}
      {wrap(3, 500, 104, 352, 300, {}, photo("holm-stretch.jpg", 352, 300, 24))}
      {wrap(4, 44, 346, 400, 58, { display: "flex", gap: 12 }, <>
        <div style={{ height: 58, padding: "0 30px", borderRadius: 29, background: "#2E4A52", color: "#fff", fontSize: 23, fontWeight: 600, display: "flex", alignItems: "center" }}>Book tid</div>
        <div style={{ height: 58, padding: "0 28px", borderRadius: 29, border: "2px solid #1F2A2E22", fontSize: 23, fontWeight: 600, display: "flex", alignItems: "center" }}>Behandlinger</div></>)}
      {[["Fysioterapi", "holm-neck.jpg"], ["Massage", "holm-calves.jpg"], ["Genoptræning", "holm-shoulder.jpg"]].map(([tt, src], i) =>
        wrap(5 + i, 40 + i * 282, 448, 262, 250, { background: "#fff", borderRadius: 20, overflow: "hidden" }, <>{photo(src, 262, 176, 0)}<div style={{ padding: "14px 18px", fontSize: 24, fontWeight: 600 }}>{tt}</div></>))}
    </div>
  );
};
const HOLM_TINT = "#E3E9E8";
const Hammer: React.FC<{ rot: number }> = ({ rot }) => (
  <svg width={170} height={170} viewBox="0 0 48 48" fill="none" stroke={C.sageDeep} strokeWidth={4.6} strokeLinecap="round" strokeLinejoin="round" style={{ display: "block", transform: `rotate(${rot}deg)`, transformOrigin: "10px 40px" }}>
    <path d="M12 38 L30 20" /><g transform="rotate(45 30 20)"><rect x="16" y="12" width="28" height="13" rx="3" fill={C.sageDeep} stroke="none" /></g>
  </svg>
);
const EyeBadge: React.FC<{ s: number; blink: number }> = ({ s, blink }) => (
  <div style={{ width: 130, height: 130, borderRadius: 65, background: C.sage, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${Math.max(0, s)})`, boxShadow: sh(1) }}>
    <svg width={80} height={80} viewBox="0 0 48 48" fill="none" stroke="#fff" strokeWidth={3.6} strokeLinecap="round" strokeLinejoin="round">
      <g style={{ transform: `scaleY(${blink})`, transformOrigin: "24px 24px" }}><path d="M5 24 C12 12 36 12 43 24 C36 36 12 36 5 24 Z" /><circle cx={24} cy={24} r={6} fill="#fff" stroke="none" /></g>
    </svg>
  </div>
);

// ═════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
export const Scene5: React.FC<{ g: number }> = ({ g }) => {
  if (g < f("h4") + HANDOFF_HALF) return <Handoff g={g} at="h4" />;
  const t = g / 30;

  // ── 1+2. the chat: the question types itself, the human's reply types word by word, "Svarer nu" ──────────────────
  let chat: React.ReactNode = null;
  if (t < B.collapse + 0.5) {
    const m = spr(t, START, 0.55, 0.75), pS = spr(t, START, 0.45, 0.55);
    const sx0 = mix(1160, SG.x, m), sy0 = mix(540, SG.y, m);
    const wS = mix(200, SG.w, pS), hS = mix(60, SG.h, pS), rS = Math.min(hS / 2, mix(30, 62, clamp01(pS)));
    const Q = "Brug for hjælp?";
    const qTxt = typed(t, START + 0.4, Q, 30);
    const caret = Math.floor(t * 4) % 2 === 0 || qTxt.length < Q.length;
    const pR = spr(t, L.et, 0.5, 0.6), pRx = spr(t, L.et, 0.46, 0.85);
    const rx = mix(SG.x, RP.x, pRx), ry = mix(SG.y, RP.y, pR), rw = mix(160, RW, pR), rh = mix(80, RH, pR);
    const pA = spr(t, L.et + 0.16, 0.42, 0.5), pI = spr(t, L.forstr, 0.5, 0.6);
    const replyWords = ["Hej!", "Hvordan", "kan", "jeg", "hjælpe?"], rAts = replyWords.map((_, i) => L.et + 0.5 + i * 0.17);
    const ripple = (at: number) => { const x = ez(t, at, 0.6, OUT); return x > 0 && x < 1 ? <div key={at} style={{ position: "absolute", left: 0, top: 0, width: AV, height: AV, borderRadius: AV / 2, border: `5px solid ${C.sage}`, boxSizing: "border-box", opacity: 0.7 * (1 - x), transform: `translate(${AV_P.x - AV / 2}px, ${AV_P.y - AV / 2}px) scale(${1 + 0.9 * x})` }} /> : null; };
    const dC = ez(t, B.collapse, 0.45, INOUT), vis = 1 - clamp01((dC - 0.5) / 0.5);
    chat = (
      <div style={{ position: "absolute", inset: 0, transformOrigin: `${CX}px ${CY}px`, transform: `scale(${mix(1, 0.1, dC)})`, opacity: vis, filter: dC > 0 ? `blur(${dC * 6}px)` : undefined }}>
        <Blob x={sx0} y={sy0} w={wS} h={hS} r={rS} rot={10 * kick(t, START, 5, 16)} shadow={sh(1)} />
        <Tail x={sx0 + wS / 2 - 44} y={sy0 + hS / 2 - 32} s={clamp01(spr(t, START + 0.18, 0.4, 0.6))} color={C.sage} />
        <Dots t={t} x={SG.x} y={SG.y} o={ez(t, START + 0.25, 0.12, LIN) * (1 - ez(t, START + 0.4, 0.08, LIN))} />
        {pS > 0.9 && (
          <Abs x={SG.x - SG.w / 2 + 48} y={SG.y - 28} style={{ fontFamily: SANS, fontSize: 44, fontWeight: 500, color: "#fff", whiteSpace: "pre", lineHeight: "56px", letterSpacing: "-0.01em" }}>
            {qTxt}<span style={{ display: "inline-block", width: 4, height: 44, marginLeft: 3, marginBottom: -7, background: "#fff", opacity: caret && t < L.et + 0.2 ? 1 : 0 }} />
          </Abs>
        )}
        {/* the human reply: it splits off the sage bubble, shows typing dots, then types word by word */}
        {pR > 0.001 && <Blob x={rx} y={ry} w={rw} h={rh} r={Math.min(rh / 2, 62)} color={cmix("#FFFFFF", C.sage, pR * 2)} shadow={sh(clamp01(pR))} border={clamp01(pR * 2 - 0.6)} />}
        <Dots t={t} x={RP.x - RW / 2 + 110} y={RP.y} o={ez(t, L.et + 0.2, 0.1, LIN) * (1 - ez(t, L.et + 0.48, 0.08, LIN))} color={C.sage} />
        <Words words={replyWords} ats={rAts} t={t} x={RP.x - RW / 2 + 50} y={RP.y} size={40} align="left" dur={0.18} />
        {pA > 0.001 && <Abs x={mix(RP.x - RW / 2 + 10, AV_P.x, pA) - AV / 2} y={AV_P.y - AV / 2} style={{ width: AV, height: AV, borderRadius: AV / 2, background: C.sage, color: C.cream, fontFamily: SERIF, fontSize: 56, display: "flex", alignItems: "center", justifyContent: "center", transform: `translate(${mix(RP.x - RW / 2 + 10, AV_P.x, pA) - AV / 2}px, ${AV_P.y - AV / 2}px) scale(${Math.max(0, pA)})`, boxShadow: sh(1) }}>C</Abs>}
        {ripple(L.din4)}{ripple(L.din4 + 0.42)}
        {pI > 0.001 && (
          <div style={{ position: "absolute", inset: 0, opacity: clamp01(pI * 5), transformOrigin: `${CX}px ${ISL_TOP}px`, transform: `translateY(${(1 - Math.min(1, pI)) * -70}px) scale(${mix(0.55, 1, Math.min(1, pI))})` }}>
            <Island x={CX} y={ISL_TOP} w={ISL.w} h={ISL.h} p={pI}>
              <div style={{ width: ISL.w, height: ISL.h, display: "flex", alignItems: "center", justifyContent: "center", gap: 18, fontSize: 36, fontWeight: 500 }}>
                <div style={{ width: 22, height: 22, borderRadius: 11, background: C.sage, transform: `scale(${1 + 0.3 * Math.max(0, Math.sin(t * 9))})` }} />Svarer nu
              </div>
            </Island>
          </div>
        )}
      </div>
    );
  }

  // ── 3. the thread: capsule → big queue card "Nr. 12 i kø" counting down to nothing → a dot ────────────────────────
  let thread: React.ReactNode = null;
  if (t >= B.collapse + 0.14 && t < B.launch) {
    const app = spr(t, B.collapse + 0.16, 0.4, 0.6);
    const c1 = spr(t, B.card, 0.5, 0.62), cy = mix(CY, CARD.y, spr(t, B.card, 0.5, 0.8));
    const d = ez(t, B.cardOut, 0.3, INOUT);
    const w1 = mix(200, CARD.w, c1), h1 = mix(60, CARD.h, c1), r1 = mix(30, 70, clamp01(c1));
    const dotKick = 1 + 0.6 * Math.max(0, kick(t, L.robot + 0.3, 7, 22));
    const crouch = ez(t, B.launch - 0.12, 0.12, INOUT);   // the dot crouches before it jumps
    const w = mix(w1, DOT, d) * app * dotKick * (1 + 0.28 * crouch), h = mix(h1, DOT, d) * app * dotKick * (1 - 0.3 * crouch), r = mix(r1, DOT / 2, d);
    const white = clamp01(c1 * 1.4) * (1 - d);
    const roll = ez(t, B.roll, 0.62, OUT), v = 12 * (1 - roll);
    const cOp = ez(t, B.card + 0.2, 0.18, OUT) * (1 - ez(t, B.cardOut - 0.06, 0.12, LIN));
    thread = (
      <>
        <Blob x={CX} y={cy} w={w} h={h} r={r} color={cmix(C.ink, C.sage, white)} shadow={sh(clamp01((w - DOT) / 240))} />
        {cOp > 0.01 && (
          <Abs x={CX - CARD.w / 2} y={cy - CARD.h / 2} style={{ width: CARD.w, height: CARD.h, display: "flex", alignItems: "center", justifyContent: "center", gap: 28, opacity: cOp, filter: cOp < 1 ? `blur(${(1 - cOp) * 8}px)` : undefined, fontFamily: SANS, fontSize: 70, fontWeight: 500, color: C.sageLight }}>
            <span>Nr.</span><QueueStrip v={v} /><span>i kø</span>
          </Abs>
        )}
      </>
    );
  }
  // "Ingen kø." and "Ingen robotsvar." (one line at a time, the headline size)
  const lineKo = t >= L.ingen4 - 0.05 && t < B.cardOut + 0.5 ? <Line text="Ingen kø." y={745} p={ez(t, L.ingen4, 0.9, LIN)} out={ez(t, B.cardOut - 0.12, 0.26, INOUT)} italicWords={["kø"]} /> : null;
  const lineRobot = t >= L.ingen5 - 0.05 && t < B.launch + 0.5 ? <Line text="Ingen robotsvar." y={745} p={ez(t, L.ingen5, 1.0, LIN)} out={ez(t, B.launch - 0.2, 0.35, INOUT)} italicWords={["robotsvar"]} /> : null;

  // ── 4. the robot: pops out of the dot, shakes "no", is flicked away ────────────────────────────────────────────────
  let robot: React.ReactNode = null;
  const tf = L.robot + 0.04;
  if (t >= L.ingen5 && t < tf + 0.55) {
    const pop = spr(t, L.ingen5, 0.45, 0.5), x0 = t - (L.ingen5 + 0.3);
    const wob = x0 > 0 ? 11 * Math.sin(x0 * 34) * Math.exp(-x0 * 6) : 0;
    const pull = ez(t, tf - 0.14, 0.14, INOUT), fly = ez(t, tf, 0.5, OUT);
    const dx = -40 * pull + 1300 * fly, dy = 16 * pull - 440 * fly;
    const blink = 1 - 0.92 * Math.exp(-Math.pow((t - (L.ingen5 + 0.72)) / 0.045, 2));
    robot = (
      <Abs x={CX - 140 + dx} y={CARD.y - 140 + dy} style={{ opacity: 1 - clamp01((fly - 0.55) / 0.45), transform: `translate(${CX - 140 + dx}px, ${CARD.y - 140 + dy}px) rotate(${wob + 300 * fly}deg) scale(${Math.max(0, pop) * mix(1, 0.6, fly)})` }}>
        <Robot blink={Math.max(0.05, blink)} />
      </Abs>
    );
  }

  // ── 5. Creoble.: the dot flies to the full stop, the letters come out of it right to left ──────────────────────────
  let wm: React.ReactNode = null;
  if (t >= B.launch) {
    const ux = spr(t, B.launch, 0.4, 1), x1 = t - B.launch, lift = 230 * Math.sin(Math.PI * clamp01(x1 / 0.3)), xl = t - B.land;
    const hop = xl > 0 ? 50 * Math.exp(-xl * 6.5) * Math.abs(Math.sin(xl * 15)) : 0;
    const squ = xl > 0 ? Math.exp(-xl * 9) * Math.cos(xl * 24) : 0;
    const ddx = (1 - ux) * (CX - WM_DOT_X), ddy = (1 - ux) * (CARD.y - WM_DOT_Y) - lift - hop;
    const base = mix(DOT / WM_DOT_D, 1, ux);
    const bph = ((t - 46.4) % 0.7 + 0.7) % 0.7 / 0.7, beat = 1 + (t > 46.4 ? 0.9 * Math.pow(Math.max(0, Math.sin(Math.PI * bph)), 6) : 0);   // the full stop pulses with the shine
    const rev = ez(t, B.land - 0.02, 0.8, OUT);
    const sl = spr(t, B.slide, 0.55, 0.72);
    const k0 = WM_VIEW.w / WM_W;
    const wmIn = ez(t, B.byg2 + 0.05, 0.4, OUT), wmOp = t < B.split - 0.1 ? 1 : t < B.byg2 ? 1 - ez(t, B.split - 0.1, 0.18, LIN) : wmIn, wmDy = t < B.byg2 ? 0 : (1 - wmIn) * 70;
    wm = (
      <div style={{ position: "absolute", left: CX - WM_W / 2, top: CY - WM_H / 2, width: WM_W, height: WM_H, opacity: wmOp, transform: `translateY(${sl * (WM_Y - CY) + wmDy}px) scale(${mix(1, 0.5, sl)})`, transformOrigin: "50% 50%" }}>
        <div style={{ position: "absolute", inset: 0, WebkitMaskImage: `linear-gradient(270deg, #000 ${rev * 112 - 12}%, transparent ${rev * 112}%)`, maskImage: `linear-gradient(270deg, #000 ${rev * 112 - 12}%, transparent ${rev * 112}%)`,
          transform: `translateX(${-44 * (1 - rev)}px)`, filter: rev < 1 ? `blur(${(1 - rev) * 7}px)` : undefined }}>
          <svg width={WM_W} height={WM_H} viewBox={`0 0 ${WM_VIEW.w} ${WM_VIEW.h}`} style={{ display: "block", overflow: "visible" }}><path d={WM_WORD} fill={C.ink} /></svg>
        </div>
        <svg width={WM_W} height={WM_H} viewBox={`0 0 ${WM_VIEW.w} ${WM_VIEW.h}`} style={{ position: "absolute", left: 0, top: 0, display: "block", overflow: "visible" }}>
          <g style={{ transform: `translate(${ddx * k0}px, ${ddy * k0}px) scale(${base * beat * (1 + 0.4 * squ)}, ${base * beat * (1 - 0.4 * squ)})`, transformOrigin: "7062px 1344px" }}><path d={WM_DOT} fill={C.sage} /></g>
        </svg>
      </div>
    );
  }

  // ── 6+7+8. pills (Gooey) → three step cards that act it out → CTA button ────────────────────────────────────────
  let goo: React.ReactNode = null, over: React.ReactNode = null, cards: React.ReactNode = null;
  const m = spr(t, B.merge, 0.46, 0.7);
  const pLx = mix(CX - 330, CX - 140, m), pRx = mix(CX + 330, CX + 140, m);
  const splitOn = t >= B.split;
  if (t >= L.hjem - 0.1 && t < B.split) {
    const uL = spr(t, L.hjem - 0.06, 0.5, 0.62), uR = spr(t, L.hosting - 0.02, 0.5, 0.58);
    const kP = 1 + 0.06 * (kick(t, L.t, 8, 26) + kick(t, L.sted, 8, 26));
    const pWid = PW * (1 + 0.1 * Math.sin(Math.PI * clamp01(m)));
    const ldx = t < B.merge ? mix(CX - 760, pLx, uL) : pLx, rdx = t < B.merge ? mix(CX + 760, pRx, uR) : pRx;
    const ly = mix(STAGE_Y + 120, STAGE_Y, uL), ry = mix(STAGE_Y - 90, STAGE_Y, uR);
    goo = (
      <div style={{ position: "absolute", left: 0, top: 200, width: 1920, height: 700, filter: "url(#goo)" }}>
        <div style={{ position: "absolute", left: 0, top: -200, width: 1920, height: 1080 }}>
          {uL > 0.001 && <Blob x={ldx} y={ly} w={pWid * kP} h={PH * kP} />}
          {uR > 0.001 && <Blob x={rdx} y={ry} w={pWid * kP} h={PH * kP} />}
        </div>
      </div>
    );
    const pillTxt = (txt: string, x: number, y: number, at: number) => {
      const o = ez(t, at, 0.2, OUT) * (1 - ez(t, B.merge, 0.2, INOUT));
      return o > 0.01 ? <Abs x={x - PW / 2} y={y - 35} still style={{ width: PW, textAlign: "center", fontFamily: SANS, fontWeight: 500, fontSize: 52, color: C.ink, opacity: o, filter: o < 1 ? `blur(${(1 - o) * 8}px)` : undefined, lineHeight: "70px" }}>{txt}</Abs> : null;
    };
    over = (
      <>
        {pillTxt("Hjemmeside", ldx, ly, L.hjem + 0.15)}
        {pillTxt("Hosting", rdx, ry, L.hosting + 0.2)}
        {t >= B.merge && <Words words={["samlet", "ét", "sted"]} ats={[B.merge + 0.16, L.t, L.sted]} t={t} x={CX} y={STAGE_Y} size={56} out={ez(t, B.split - 0.05, 0.05, LIN)} />}
      </>
    );
  }

  // one big stage for the three steps: the merged capsule becomes a white card that BUILDS a site (Byg den), is SCANNED and
  // scrolled (Se den) and turns into the price with a ticking check (Så køber du); then it flows into the CTA button
  const stepsOn = splitOn;
  if (stepsOn) {
    const sp = spr(t, B.split, 0.5, 0.62), gt = spr(t, B.gather, 0.34, 0.9), bg = spr(t, B.byg2 + 0.01, 0.52, 0.62);
    const gathered = t >= B.gather;
    const pp = Math.max(prs(t, B.press), prs(t, 53.3), prs(t, 54.6)), pr = t >= B.byg2 ? 1 - 0.05 * pp : 1;
    let w = mix(720, SITE.w, sp), h = mix(130, SITE.h, sp), r = mix(65, 36, sp), y = mix(STAGE_Y, SITE.y, sp);
    let col = cmix("#FFFFFF", C.sage, clamp01(sp * 1.3)), shA = clamp01(sp * 1.2 - 0.2), bd = clamp01(sp * 1.4 - 0.4);
    if (gathered) {
      w = mix(SITE.w, 140, gt); h = mix(SITE.h, 140, gt); r = mix(36, 70, gt); y = mix(SITE.y, STAGE_Y, gt);
      col = cmix("#FFFFFF", C.ink, 1 - clamp01(gt * 1.6)); bd = 0; shA = 1;
      if (t >= B.byg2) { w = mix(w, BTN.w, bg) * pr; h = mix(h, BTN.h, bg) * pr; r = mix(r, BTN.h / 2, bg); y = mix(y, STAGE_Y, bg); }
    }
    cards = <Blob x={CX} y={y} w={w} h={h} r={r} color={col} shadow={sh(shA)} border={bd} />;
    // what the stage shows
    const cOp = (gathered ? 1 - ez(t, B.gather - 0.04, 0.12, LIN) : 1) * ez(t, B.split + 0.28, 0.1, LIN);
    if (cOp > 0.01) {
      const ox = CX - SITE.w / 2, oy = SITE.y - SITE.h / 2;
      const tb = [0.08, 0.2, 0.3, 0.38, 0.5, 0.62, 0.72, 0.82].map((d) => L.byg + d + 0.12);
      const bump = (x: number) => (x < 0 ? 0 : x < 0.09 ? x / 0.09 : Math.exp(-(x - 0.09) * 11));
      const hit = tb.reduce((a2, at) => Math.max(a2, bump(t - (at - 0.09))), 0);       // the hammer hits as each block lands
      const scroll = 170 * ez(t, L.se + 0.22, 0.42, INOUT);                                // Se den: the page scrolls
      const u = (t - (L.se + 0.02)) / 0.3, scanOn = u >= 0 && u < 2, frac = u - Math.floor(u), scanY = Math.floor(u) % 2 === 0 ? frac : 1 - frac;
      const eyeS = spr(t, L.se, 0.4, 0.5), blink = 1 - 0.92 * Math.exp(-Math.pow((t - (L.se + 0.5)) / 0.05, 2));
      const siteOut = ez(t, L.s2 - 0.04, 0.2, INOUT);
      const priceIn = spr(t, L.s2 + 0.06, 0.45, 0.6), priceP = ez(t, L.s2 + 0.1, 0.4, OUT), chk = spr(t, L.s2 + 0.42, 0.4, 0.5);
      cards = (
        <>
          {cards}
          <div style={{ position: "absolute", left: ox, top: oy, width: SITE.w, height: SITE.h, borderRadius: 36, overflow: "hidden", opacity: cOp, clipPath: `inset(0 round 36px)` }}>
            {siteOut < 1 && <div style={{ position: "absolute", inset: 0, opacity: 1 - siteOut, filter: siteOut > 0 ? `blur(${siteOut * 10}px)` : undefined, transform: `scale(${1 - 0.04 * siteOut})` }}><SiteView t={t} ats={tb} scroll={scroll} /></div>}
            {scanOn && <div style={{ position: "absolute", left: 0, top: 0, width: SITE.w, height: 130, transform: `translateY(${-65 + SITE.h * scanY}px)`, background: "linear-gradient(transparent, rgba(135,168,158,0.6), transparent)" }} />}
            {t >= L.s2 && (
              <div style={{ position: "absolute", inset: 0, opacity: clamp01(priceIn * 2), transform: `scale(${mix(0.88, 1, clamp01(priceIn))})` }}>
                <div style={{ position: "absolute", left: 0, top: 70, width: SITE.w, display: "flex", alignItems: "baseline", justifyContent: "center", gap: 16 }}>
                  <RollNumber value={499} p={priceP} size={240} /><span style={{ fontFamily: SANS, fontSize: 72, fontWeight: 500, color: C.muted }}>kr.</span>
                </div>
              </div>
            )}
          </div>
          {t >= L.byg + 0.1 && t < L.s2 && <Abs x={CX + SITE.w / 2 - 150} y={SITE.y + SITE.h / 2 - 150}><Hammer rot={-62 + 72 * hit} /></Abs>}
          {eyeS > 0.001 && t < L.s2 + 0.1 && <Abs x={CX + SITE.w / 2 - 80} y={SITE.y - SITE.h / 2 - 60}><EyeBadge s={eyeS * (1 - siteOut)} blink={Math.max(0.06, blink)} /></Abs>}
          {chk > 0.001 && <Abs x={CX - 70} y={SITE.y + 130} style={{ width: 140, height: 140, borderRadius: 70, background: C.sage, display: "flex", alignItems: "center", justifyContent: "center", transform: `translate(${CX - 70}px, ${SITE.y + 130}px) scale(${Math.max(0, chk)}) rotate(${-25 * (1 - clamp01(chk))}deg)`, boxShadow: sh(1), opacity: cOp }}><Ico n="check" s={92} c="#fff" w={2.8} /></Abs>}
        </>
      );
      // one line at a time under the stage
      const ln = (txt: string, at: number, next: number, it: string[]) => t >= at - 0.05 && t < next + 0.4 ? <Line key={txt} text={txt} y={SITE.y + SITE.h / 2 + 100} p={ez(t, at, 0.45, LIN)} out={t > next - 0.12 ? ez(t, next - 0.12, 0.2, INOUT) : 0} size={TYPE_LINE} italicWords={it} /> : null;
      over = <>{ln("Byg den.", L.byg, L.se, ["Byg"])}{ln("Se den.", L.se, L.s2, ["Se"])}{ln("Så køber du.", L.s2, B.gather, ["køber"])}</>;
    }
  }

  // the CTA text rides on the button; its shine loops (the end stays alive)
  let cta: React.ReactNode = null;
  if (t >= B.byg2 + 0.05) {
    const reveal = ez(t, B.byg2 + 0.04, 0.62, LIN);
    const pp = Math.max(prs(t, B.press), prs(t, 53.3), prs(t, 54.6)), pr = 1 - 0.05 * pp;
    const ph = t < 51.1 ? -1 : (((t - 51.1) % 0.7) + 0.7) % 0.7 / 0.7;
    const bandX = mix(-380, BTN.w + 40, ph);
    cta = (
      <>
        <Abs x={CX - BTN.w / 2} y={STAGE_Y - BTN.h / 2} style={{ width: BTN.w, height: BTN.h, opacity: ez(t, B.byg2 + 0.04, 0.2, LIN) }}>
          <div style={{ position: "absolute", inset: 0, WebkitMaskImage: `linear-gradient(90deg, #000 ${reveal * 130 - 30}%, transparent ${reveal * 130}%)`, maskImage: `linear-gradient(90deg, #000 ${reveal * 130 - 30}%, transparent ${reveal * 130}%)` }}>
            <PillButton text="Byg din side gratis" size={56} press={pp} style={{ width: BTN.w, height: BTN.h, padding: 0, justifyContent: "center", boxSizing: "border-box", background: "transparent", boxShadow: "none" }} />
          </div>
          {ph >= 0 && (
            <div style={{ position: "absolute", inset: 0, borderRadius: BTN.h / 2, overflow: "hidden", transform: `scale(${pr})` }}>
              <div style={{ position: "absolute", left: 0, top: 0, width: 400, height: BTN.h, transform: `translateX(${bandX}px) skewX(-18deg)`, background: "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.3), rgba(255,255,255,0))" }} />
            </div>
          )}
        </Abs>
        <Line text="creoble.dk" y={STAGE_Y + 160} p={ez(t, L.creoble4, 0.6, LIN)} size={44} serif={false} color={C.sageDeep} />
      </>
    );
  }

  return (
    <>
      {chat}
      {thread}
      {lineKo}
      {lineRobot}
      {robot}
      {wm}
      {goo}
      {cards}
      {over}
      {cta}
    </>
  );
};
