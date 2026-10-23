// Scene 5 (builder 5), revision 2: h4 → end, the WEBSITE is the hero object in every beat.
// "Brug for hjælp? Et menneske, der forstår din forretning. Ingen kø. Ingen robotsvar. Creoble. Hjemmeside og hosting,
// samlet ét sted. Byg den. Se den. Så køber du. Byg din side gratis på creoble.dk."
// One Stage (browser + Holm's site) that is always alive: it scrolls steadily behind the support chat that opens over
// it (the question types, the human's reply types, a queue counter rolls down, a robot is flicked away); it collapses
// into the dot that lands as the full stop of the wordmark (the one beat without the site); it re-opens, two pills
// merge on it; it flips and REBUILDS itself (Byg den), is scanned and scrolled (Se den), the price docks on it
// (Så køber du); the price tag becomes the CTA button, and the site keeps scrolling to the last frame.
// Transforms only; the scroll is a steady ≥ 3 px per frame with softly rounded turnarounds; no wobble.
import React from "react";
import { C, INOUT, LIN, OUT, SANS, SERIF, clamp01, mix } from "../lib";
import { Island, PillButton, RollNumber, Ico, f } from "../shared";
import { CX, CY, HANDOFF_HALF, Line, NEW_HEADLINE, Stage, StageHandoff, STAGE, STAGE_SCROLL_MAX } from "../v5";
import { WM_DOT, WM_VIEW, WM_WORD } from "../wordmark";

// ── clock helpers (seconds; own springs so nothing is rounded to the 30 fps grid) ──────────────────────────────────
const sec = (l: string) => f(l) / 30;
const START = (f("h4") + HANDOFF_HALF) / 30;               // the stage leaves the hand-off (scroll 300, holmfysio.dk live)
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

// ── the site's steady scroll: a triangle between 0 and the page end with softly rounded turnarounds ─────────────────
const SMAX = STAGE_SCROLL_MAX, V = 480;                           // design px per second ≈ 5.3 px per frame on screen
const foldScroll = (x: number) => {
  const P = 2 * SMAX, m = ((x % P) + P) % P, u = m <= SMAX ? m : P - m, e = 6;   // short, eased turnarounds (no slow creep)
  if (u < e) return (u * u) / (2 * e) + e / 2;
  if (u > SMAX - e) { const v = SMAX - u; return SMAX - ((v * v) / (2 * e) + e / 2); }
  return u;
};
/** scroll from rest at t0 at s0, speeding up to V design px per second (≈ V × 0.657 / 60 px per frame on screen) */
const scrollFrom = (t: number, t0: number, s0: number, V: number) => { const tau = Math.max(0, t - t0), T0 = 0.3; return foldScroll(s0 + V * (tau - T0 * (1 - Math.exp(-tau / T0)))); };

// ── the labels this scene lands on ─────────────────────────────────────────────────────────────────────────────────
const L = {
  et: sec("w:et"), forstr: sec("w:forstr"), din4: sec("w:din4"), ingen4: sec("w:ingen4"), ingen5: sec("w:ingen5"), robot: sec("w:robotsvar"),
  hjem: sec("w:hjemmeside2"), hosting: sec("w:hosting"), samlet: sec("w:samlet"), t: sec("w:t"), sted: sec("w:sted"),
  byg: sec("w:byg"), se: sec("w:se"), s2: sec("w:s2"), byg2: sec("w:byg2"), creoble4: sec("w:creoble4"),
};
const B = {
  open: START + 0.18,        // the chat button opens into the panel
  card: L.ingen4 - 0.02,     // chat panel → queue card
  roll: L.ingen4 + 0.1,      // 12 → 0
  cardOut: 43.35,            // the card shrinks to a dot
  collapse: 43.95,            // the stage collapses into the dot
  launch: 44.3,              // the dot leaves for the wordmark's full stop
  land: 44.62,
  slide: 45.2,              // the wordmark slides up and the stage re-opens
  reopen: 45.3,
  merge: L.samlet + 0.04,    // the pills melt together
  flipOut: 47.92,            // the stage flips edge-on and rebuilds
  flipIn: 48.06,
  build: 48.2,
  scroll2: 48.3,             // the steady scroll starts again
  gather: 50.28,             // the price tag becomes the button
  byg2: L.byg2,              // the button grows (50.61)
  press: 51.4,
};

// ── layout (px at 1080p) ───────────────────────────────────────────────────────────────────────────────────────────
const SX = 100, ZS = 1.1;                                     // the stage steps left while the chat is open; it pushes in a little (1.1×)                                               // the stage steps left while the chat is open
const PANEL = { x: 1290, y: 540, w: 480, h: 460 };            // the chat panel, docked on the right half of the stage
const WM_Y = 140;                                             // the small wordmark above the stage
const WM_H = 150, WM_W = (WM_H * WM_VIEW.w) / WM_VIEW.h;
const WM_DOT_X = CX - WM_W / 2 + (7062.84 / WM_VIEW.w) * WM_W, WM_DOT_Y = CY - WM_H / 2 + (1344.2 / WM_VIEW.h) * WM_H;   // the full stop (px)
const WM_DOT_D = (2 * 145 * WM_H) / WM_VIEW.h;                // its diameter
const DOT = 64;                                               // the thread dot before it lands
const PW = 380, PH = 110, PY = 540;                           // the two pills
const BTN = { w: 780, h: 140, y: 690 };
const TAG = { x: CX + 330, y: 690, w: 520, h: 300 };          // the price tag docked on the stage
const LINE_Y = 950, LINE_SIZE = 88;
const HW = (STAGE.w * ZS) / 2, HH = (STAGE.h * ZS) / 2;       // the stage's half extents on screen

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
const Words: React.FC<{ words: string[]; ats: number[]; t: number; x: number; y: number; size: number; align?: "left" | "center"; color?: string; weight?: number; out?: number; italic?: number[]; dur?: number }> =
  ({ words, ats, t, x, y, size, align = "center", color = C.ink, weight = 500, out = 0, italic = [], dur = 0.3 }) => (
  <div style={{ position: "absolute", left: align === "center" ? x - 700 : x, top: y - size * 0.62, width: align === "center" ? 1400 : undefined, display: "flex", justifyContent: align === "center" ? "center" : "flex-start", gap: size * 0.28, whiteSpace: "pre", lineHeight: 1.2,
    fontFamily: SANS, fontSize: size, fontWeight: weight, letterSpacing: "-0.01em", color, opacity: 1 - out, filter: out > 0 ? `blur(${out * 10}px)` : undefined }}>
    {words.map((w, i) => { const q = ez(t, ats[i], dur, OUT);
      return <span key={i} style={{ display: "inline-block", opacity: q, transform: `translateY(${(1 - q) * 22}px) scale(${0.92 + 0.08 * q})`, filter: q < 1 ? `blur(${(1 - q) * 8}px)` : undefined, fontStyle: italic.includes(i) ? "italic" : "normal" }}>{w}</span>; })}
  </div>
);

// ── drawings ───────────────────────────────────────────────────────────────────────────────────────────────────────
const Dots: React.FC<{ t: number; x: number; y: number; o: number; color?: string }> = ({ t, x, y, o, color = "#fff" }) => (
  <Abs x={x - 48} y={y - 11} style={{ opacity: o, display: "flex", gap: 18 }}>
    {[0, 1, 2].map((i) => { const up = Math.max(0, Math.sin(t * 11 - i * 0.9));
      return <div key={i} style={{ width: 22, height: 22, borderRadius: 11, background: color, opacity: 0.5 + 0.5 * up, transform: `translateY(${-13 * up}px) scale(${1 + 0.2 * up})` }} />; })}
  </Abs>
);
const Robot: React.FC<{ blink: number }> = ({ blink }) => (
  <svg width={260} height={260} viewBox="0 0 160 160" style={{ display: "block", overflow: "visible", filter: "drop-shadow(0 16px 20px rgba(26,22,20,0.2))" }}>
    <path d="M80 44 V26" stroke={C.ink} strokeWidth={5} strokeLinecap="round" />
    <circle cx={80} cy={18} r={9} fill={C.sage} />
    <rect x={13} y={72} width={14} height={26} rx={7} fill={C.ink} /><rect x={133} y={72} width={14} height={26} rx={7} fill={C.ink} />
    <rect x={28} y={44} width={104} height={82} rx={28} fill="#fff" stroke={C.ink} strokeWidth={5} />
    <ellipse cx={58} cy={82} rx={8} ry={8 * blink} fill={C.ink} /><ellipse cx={102} cy={82} rx={8} ry={8 * blink} fill={C.ink} />
    <path d="M62 106 H98" stroke={C.ink} strokeWidth={5} strokeLinecap="round" />
  </svg>
);
/** vertical counter strip 12 → 0, rolling downwards through the numbers (Fraunces 160) */
const QueueStrip: React.FC<{ v: number }> = ({ v }) => {
  const ROW = 200, rows = Array.from({ length: 13 }, (_, i) => 12 - i);
  const m = "linear-gradient(transparent 0, #000 16%, #000 84%, transparent 100%)";
  return (
    <div style={{ width: 210, height: ROW, overflow: "hidden", position: "relative", WebkitMaskImage: m, maskImage: m }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: "100%", transform: `translateY(${-(12 - v) * ROW}px)`, willChange: "transform" }}>
        {rows.map((n) => <div key={n} style={{ height: ROW, lineHeight: `${ROW}px`, textAlign: "center", fontFamily: SERIF, fontSize: 160, color: C.cream, letterSpacing: "-0.03em" }}>{n}</div>)}
      </div>
    </div>
  );
};
const Hammer: React.FC<{ rot: number }> = ({ rot }) => (
  <svg width={170} height={170} viewBox="0 0 48 48" fill="none" stroke={C.sageDeep} strokeWidth={4.6} strokeLinecap="round" strokeLinejoin="round" style={{ display: "block", transform: `rotate(${rot}deg)`, transformOrigin: "10px 40px", filter: "drop-shadow(0 8px 10px rgba(26,22,20,0.25))" }}>
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
  if (g < f("h4") + HANDOFF_HALF) return <StageHandoff g={g} at="h4" />;
  const t = g / 30;

  // ── the stage: always alive. Scroll, build, step aside for the chat, collapse into the dot, re-open, flip and rebuild ──
  const rebuilt = t >= B.flipIn;
  let scroll = scrollFrom(t, START, 300, V);
  if (t >= B.reopen) scroll = scrollFrom(t, B.reopen, 90, V);
  if (rebuilt) scroll = t < B.scroll2 ? 0 : scrollFrom(t, B.scroll2, 0, V);
  const build = rebuilt ? clamp01((t - B.build) / 0.85) : 1;
  let stageTr = "", stageSc = 1, stageOp = 1;
  const stageOn = t < B.collapse + 0.45 || t >= B.reopen;
  if (t < B.collapse + 0.45) {
    const shift = spr(t, B.open, 0.55, 0.8), c = ez(t, B.collapse, 0.4, INOUT);
    stageTr = `translate(${mix(-SX * shift, 1290 - CX, c)}px, ${mix(0, 540 - CY, c)}px)`;
    stageSc = mix(1 + (ZS - 1) * spr(t, START + 0.05, 0.6, 0.85), 0.06, c); stageOp = 1 - clamp01((c - 0.75) / 0.25);
  } else {
    const u = spr(t, B.reopen, 0.5, 0.62);
    stageSc = mix(0.12, ZS, u); stageOp = clamp01(u * 3);
    if (t >= B.flipOut && t < B.flipIn) stageTr = `perspective(2200px) rotateY(${90 * ez(t, B.flipOut, 0.14, INOUT)}deg)`;
    else if (t >= B.flipIn) stageTr = `perspective(2200px) rotateY(${-90 * (1 - spr(t, B.flipIn, 0.34, 0.65))}deg)`;
  }
  // Se den: a sage scan band sweeps down and up the live site
  const su = (t - (L.se + 0.02)) / 0.3, scanOn = su >= 0 && su < 2, sfr = su - Math.floor(su), scanY = Math.floor(su) % 2 === 0 ? sfr : 1 - sfr;
  const stage = !stageOn ? null : (
    <Stage transform={stageTr} scale={stageSc} scroll={scroll} build={build} url="holmfysio.dk" live={1} headline={NEW_HEADLINE} style={{ opacity: stageOp }}>
      {scanOn && <div style={{ position: "absolute", left: 0, top: 0, width: STAGE.w, height: 120, transform: `translateY(${-60 + (STAGE.h - 46) * scanY}px)`, background: "linear-gradient(transparent, rgba(135,168,158,0.62), transparent)" }} />}
    </Stage>
  );

  // ── 1+2. the support chat opens OVER the live site: the question types, the human's reply types, "Svarer nu" ─────────
  let panel: React.ReactNode = null;
  if (t >= START && t < B.launch) {
    const btn = spr(t, START + 0.02, 0.4, 0.5), po = spr(t, B.open, 0.5, 0.7);
    const qm = spr(t, B.card, 0.5, 0.62), d = ez(t, B.cardOut, 0.3, INOUT);
    const bw = 96 * btn;
    let w = mix(bw, PANEL.w, po), h = mix(bw, PANEL.h, po), r = mix(48, 40, po);
    const x = mix(1390, PANEL.x, po), y = mix(800, PANEL.y, po);
    h = mix(h, 300, qm);
    const inkAmt = clamp01(qm * 1.4) * (1 - d);
    const crouch = ez(t, B.launch - 0.12, 0.12, INOUT), dotKick = 1 + 0.6 * Math.max(0, kick(t, L.robot + 0.3, 7, 22));
    w = mix(w, DOT, d) * (1 + 0.28 * crouch) * (d > 0 ? dotKick : 1); h = mix(h, DOT, d) * (1 - 0.3 * crouch) * (d > 0 ? dotKick : 1); r = mix(r, DOT / 2, d);
    const col = cmix(C.sage, cmix(C.ink, cmix("#FFFFFF", C.sage, clamp01(po * 1.6)), inkAmt), d);
    const chatOp = ez(t, B.open + 0.25, 0.15, LIN) * (1 - ez(t, B.card - 0.2, 0.14, LIN));
    const Q = "Brug for hjælp?", qTxt = typed(t, B.open + 0.5, Q, 34);
    const caret = Math.floor(t * 4) % 2 === 0 || qTxt.length < Q.length;
    const qb = spr(t, B.open + 0.35, 0.42, 0.6);
    const pR = spr(t, L.et, 0.5, 0.6), pA = spr(t, B.open + 0.5, 0.42, 0.5), pI = spr(t, L.forstr, 0.5, 0.6);
    const rx = mix(1150, 1290, pR), ry = mix(380, 630, pR);
    const l1 = ["Hej!", "Hvordan", "kan"], l2 = ["jeg", "hjælpe?"], ats = [0, 1, 2, 3, 4].map((i) => L.et + 0.5 + i * 0.16);
    const ripple = (at: number) => { const q = ez(t, at, 0.6, OUT); return q > 0 && q < 1 ? <div key={at} style={{ position: "absolute", left: 0, top: 0, width: 96, height: 96, borderRadius: 48, border: `5px solid ${C.sage}`, boxSizing: "border-box", opacity: 0.7 * (1 - q), transform: `translate(${1116 - 48}px, ${366 - 48}px) scale(${1 + 0.9 * q})` }} /> : null; };
    const qIn = t >= B.card - 0.1 && d < 1 ? ez(t, B.card + 0.2, 0.18, OUT) * (1 - ez(t, B.cardOut - 0.06, 0.12, LIN)) : 0;
    const v = 12 * (1 - ez(t, B.roll, 0.62, OUT));
    panel = (
      <>
        <Blob x={x} y={y} w={w} h={h} r={r} color={col} shadow={sh(1)} border={clamp01(po * 1.4 - 0.4) * (1 - inkAmt)} />
        {po < 0.6 && btn > 0.05 && <Abs x={x - 28} y={y - 28} style={{ opacity: 1 - clamp01(po * 2.4), transform: `translate(${x - 28}px, ${y - 28}px) scale(${btn})` }}><Ico n="chat" s={56} c="#fff" w={2.4} /></Abs>}
        {chatOp > 0.01 && (
          <div style={{ position: "absolute", inset: 0, opacity: chatOp }}>
            {qb > 0.001 && <Blob x={1336} y={470} w={340 * Math.min(1.1, qb)} h={100 * Math.min(1.1, qb)} r={50} color={C.sage} />}
            {qb > 0.9 && <Abs x={1336 - 170 + 30} y={470 - 24} style={{ fontFamily: SANS, fontSize: 36, fontWeight: 500, color: "#fff", whiteSpace: "pre", lineHeight: "48px" }}>
              {qTxt}<span style={{ display: "inline-block", width: 4, height: 38, marginLeft: 3, marginBottom: -6, background: "#fff", opacity: caret && t < L.et + 0.2 ? 1 : 0 }} /></Abs>}
            {pA > 0.001 && <Abs x={1116 - 48} y={366 - 48} style={{ width: 96, height: 96, borderRadius: 48, background: C.sage, color: C.cream, fontFamily: SERIF, fontSize: 50, display: "flex", alignItems: "center", justifyContent: "center", transform: `translate(${1116 - 48}px, ${366 - 48}px) scale(${Math.max(0, pA)})`, boxShadow: sh(1) }}>C</Abs>}
            {ripple(L.din4)}{ripple(L.din4 + 0.42)}
            {pR > 0.001 && <Blob x={rx} y={ry} w={mix(120, 432, pR)} h={mix(80, 166, pR)} r={44} color={cmix("#F3F0EA", C.sage, pR * 2)} shadow={sh(clamp01(pR))} border={clamp01(pR * 2 - 0.6)} />}
            <Dots t={t} x={1074 + 90} y={630} o={ez(t, L.et + 0.2, 0.1, LIN) * (1 - ez(t, L.et + 0.48, 0.08, LIN))} color={C.sage} />
            <Words words={l1} ats={ats.slice(0, 3)} t={t} x={1106} y={604} size={36} align="left" dur={0.18} />
            <Words words={l2} ats={ats.slice(3)} t={t} x={1106} y={656} size={36} align="left" dur={0.18} />
            {pI > 0.001 && (
              <div style={{ position: "absolute", inset: 0, opacity: clamp01(pI * 5), transformOrigin: `1360px 328px`, transform: `translateY(${(1 - Math.min(1, pI)) * -40}px) scale(${mix(0.55, 1, Math.min(1, pI))})` }}>
                <Island x={1360} y={328} w={250} h={76} p={pI}>
                  <div style={{ width: 250, height: 76, display: "flex", alignItems: "center", justifyContent: "center", gap: 14, fontSize: 30, fontWeight: 500 }}>
                    <div style={{ width: 18, height: 18, borderRadius: 9, background: C.sage, transform: `scale(${1 + 0.3 * Math.max(0, Math.sin(t * 9))})` }} />Svarer nu
                  </div>
                </Island>
              </div>
            )}
          </div>
        )}
        {qIn > 0.01 && (
          <Abs x={PANEL.x - PANEL.w / 2} y={PANEL.y - 150} style={{ width: PANEL.w, height: 300, display: "flex", alignItems: "center", justifyContent: "center", gap: 18, opacity: qIn, filter: qIn < 1 ? `blur(${(1 - qIn) * 8}px)` : undefined, fontFamily: SANS, fontSize: 52, fontWeight: 500, color: C.sageLight }}>
            <span>Nr.</span><QueueStrip v={v} /><span>i kø</span>
          </Abs>
        )}
      </>
    );
  }
  // "Ingen kø." and "Ingen robotsvar." under the stage (one line at a time)
  const lineKo = t >= L.ingen4 - 0.05 && t < B.cardOut + 0.5 ? <Line text="Ingen kø." y={LINE_Y} size={LINE_SIZE} p={ez(t, L.ingen4, 0.9, LIN)} out={ez(t, B.cardOut - 0.12, 0.26, INOUT)} italicWords={["kø"]} /> : null;
  const lineRobot = t >= L.ingen5 - 0.05 && t < B.launch + 0.5 ? <Line text="Ingen robotsvar." y={LINE_Y} size={LINE_SIZE} p={ez(t, L.ingen5, 1.0, LIN)} out={ez(t, B.launch - 0.2, 0.35, INOUT)} italicWords={["robotsvar"]} /> : null;

  // ── 4. the robot: pops out of the dot over the stage, shakes "no", is flicked away ─────────────────────────────────
  let robot: React.ReactNode = null;
  const tf = L.robot + 0.04;
  if (t >= L.ingen5 && t < tf + 0.55) {
    const pop = spr(t, L.ingen5, 0.45, 0.5), x0 = t - (L.ingen5 + 0.3);
    const wob = x0 > 0 ? 11 * Math.sin(x0 * 34) * Math.exp(-x0 * 6) : 0;
    const pull = ez(t, tf - 0.14, 0.14, INOUT), fly = ez(t, tf, 0.5, OUT);
    const dx = -40 * pull + 1000 * fly, dy = 16 * pull - 420 * fly;
    const blink = 1 - 0.92 * Math.exp(-Math.pow((t - (L.ingen5 + 0.72)) / 0.045, 2));
    robot = (
      <Abs x={1290 - 130 + dx} y={540 - 130 + dy} style={{ opacity: 1 - clamp01((fly - 0.55) / 0.45), transform: `translate(${1290 - 130 + dx}px, ${540 - 130 + dy}px) rotate(${wob + 300 * fly}deg) scale(${Math.max(0, pop) * mix(1, 0.6, fly)})` }}>
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
    const ddx = (1 - ux) * (1290 - WM_DOT_X), ddy = (1 - ux) * (540 - WM_DOT_Y) - lift - hop;
    const base = mix(DOT / WM_DOT_D, 1, ux);
    const bph = ((t - 46.4) % 0.7 + 0.7) % 0.7 / 0.7, beat = 1 + (t > 46.4 ? 0.9 * Math.pow(Math.max(0, Math.sin(Math.PI * bph)), 6) : 0);   // the full stop pulses with the shine
    const rev = ez(t, B.land - 0.02, 0.7, OUT);
    const sl = spr(t, B.slide, 0.5, 0.75);
    const k0 = WM_VIEW.w / WM_W;
    wm = (
      <div style={{ position: "absolute", left: CX - WM_W / 2, top: CY - WM_H / 2, width: WM_W, height: WM_H, transform: `translateY(${sl * (WM_Y - CY)}px) scale(${mix(1, 0.5, sl)})`, transformOrigin: "50% 50%" }}>
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

  // ── 6. Hjemmeside + Hosting: two pills glide together and merge (Gooey) ON the re-opened stage ─────────────────────
  let goo: React.ReactNode = null, over: React.ReactNode = null;
  if (t >= B.reopen + 0.05 && t < B.flipOut + 0.1) {
    const uL = spr(t, L.hjem - 0.06, 0.5, 0.62), uR = spr(t, L.hosting - 0.02, 0.5, 0.58), m = spr(t, B.merge, 0.46, 0.7);
    const pLx = mix(CX - 330, CX - 130, m), pRx = mix(CX + 330, CX + 130, m);
    const kP = 1 + 0.06 * (kick(t, L.t, 8, 26) + kick(t, L.sted, 8, 26));
    const pWid = PW * (1 + 0.1 * Math.sin(Math.PI * clamp01(m)));
    const ldx = t < B.merge ? mix(CX - 640, pLx, uL) : pLx, rdx = t < B.merge ? mix(CX + 640, pRx, uR) : pRx;
    const ly = mix(PY + 120, PY, uL), ry = mix(PY - 90, PY, uR);
    const gone = ez(t, B.flipOut - 0.08, 0.1, LIN), gs = 1 - gone;
    goo = (
      <div style={{ position: "absolute", left: 0, top: 200, width: 1920, height: 700, filter: "url(#goo)" }}>
        <div style={{ position: "absolute", left: 0, top: -200, width: 1920, height: 1080 }}>
          {uL > 0.001 && <Blob x={ldx} y={ly} w={pWid * kP * gs} h={PH * kP * gs} />}
          {uR > 0.001 && <Blob x={rdx} y={ry} w={pWid * kP * gs} h={PH * kP * gs} />}
        </div>
      </div>
    );
    const pillTxt = (txt: string, x: number, y: number, at: number) => {
      const o = ez(t, at, 0.2, OUT) * (1 - ez(t, B.merge, 0.2, INOUT));
      return o > 0.01 ? <Abs x={x - PW / 2} y={y - 32} still style={{ width: PW, textAlign: "center", fontFamily: SANS, fontWeight: 500, fontSize: 46, color: C.ink, opacity: o, filter: o < 1 ? `blur(${(1 - o) * 8}px)` : undefined, lineHeight: "64px" }}>{txt}</Abs> : null;
    };
    over = (
      <>
        {pillTxt("Hjemmeside", ldx, ly, L.hjem + 0.15)}
        {pillTxt("Hosting", rdx, ry, L.hosting + 0.2)}
        {t >= B.merge && <Words words={["samlet", "ét", "sted"]} ats={[B.merge + 0.16, L.t, L.sted]} t={t} x={CX} y={PY} size={50} out={ez(t, B.flipOut - 0.1, 0.08, LIN)} />}
      </>
    );
  }

  // ── 7. Byg den. Se den. Så køber du. — on the stage: the site rebuilds itself (hammer), is scanned and scrolled
  //      (eye), the price docks on it (check); then the tag becomes the CTA button ─────────────────────────────────────
  let steps: React.ReactNode = null, lines: React.ReactNode = null;
  if (t >= B.flipIn) {
    const bump = (x: number) => (x < 0 ? 0 : x < 0.09 ? x / 0.09 : Math.exp(-(x - 0.09) * 11));
    const hits = [0, 1, 2, 3, 4, 5, 6].map((i) => B.build + (0.85 * (i + 0.7)) / 7);
    const hit = hits.reduce((a, at) => Math.max(a, bump(t - (at - 0.09))), 0);
    const hammerOn = t >= B.build - 0.05 && t < L.se + 0.1;
    const eyeS = spr(t, L.se, 0.4, 0.5), blink = 1 - 0.92 * Math.exp(-Math.pow((t - (L.se + 0.5)) / 0.05, 2));
    const tg = spr(t, L.s2 - 0.04, 0.45, 0.6), gt = spr(t, B.gather, 0.42, 0.8);
    const gathered = t >= B.gather;
    const pp = Math.max(prs(t, B.press), prs(t, 53.3), prs(t, 54.6)), pr = t >= B.byg2 ? 1 - 0.05 * pp : 1;
    // the tag docks (slides in from the right with a squash), then morphs into the button
    let tx = mix(CX + 760, TAG.x, tg), tw = TAG.w, th = TAG.h, tr = 36, tcol = "#FFFFFF", ty = TAG.y;
    if (gathered) {
      tx = mix(TAG.x, CX, gt); tw = mix(TAG.w, BTN.w, gt); th = mix(TAG.h, BTN.h, gt); tr = mix(36, 70, gt); tcol = cmix("#FFFFFF", C.ink, 1 - clamp01(gt * 1.6)); ty = mix(TAG.y, BTN.y, gt);
      if (t >= B.byg2) { tw *= pr; th *= pr; }
    }
    const tagOn = t >= L.s2 - 0.1;
    const tagVx = (mix(CX + 760, TAG.x, spr(t, L.s2 - 0.04, 0.45, 0.6)) - mix(CX + 760, TAG.x, spr(t - 1 / 60, L.s2 - 0.04, 0.45, 0.6))) * 30 * 0.5;
    const stretch = gathered ? 1 : 1 + Math.min(0.18, Math.abs(tagVx) * 0.0035);
    const cOp = (gathered ? 1 - ez(t, B.gather - 0.02, 0.12, LIN) : 1) * clamp01(tg * 3);
    const priceP = ez(t, L.s2 + 0.12, 0.45, OUT), chk = spr(t, L.s2 + 0.45, 0.4, 0.5);
    const reveal = ez(t, B.byg2 + 0.04, 0.62, LIN);
    const ph = t < 51.1 ? -1 : (((t - 51.1) % 0.7) + 0.7) % 0.7 / 0.7, bandX = mix(-380, BTN.w + 40, ph);
    steps = (
      <>
        {hammerOn && <Abs x={CX + HW - 160} y={CY + HH - 150}><Hammer rot={-62 + 72 * hit} /></Abs>}
        {eyeS > 0.001 && t < L.s2 + 0.1 && <Abs x={CX + HW - 100} y={CY - HH - 60}><EyeBadge s={eyeS * (1 - ez(t, L.s2 - 0.05, 0.15, LIN))} blink={Math.max(0.06, blink)} /></Abs>}
        {tagOn && <Blob x={tx} y={ty} w={tw * stretch} h={th / Math.sqrt(stretch)} r={tr} color={tcol} shadow={sh(1)} border={gathered ? 0 : 1} />}
        {tagOn && cOp > 0.01 && (
          <div style={{ position: "absolute", inset: 0, opacity: cOp }}>
            <Abs x={tx - 200} y={ty - 112} style={{ width: 400, display: "flex", alignItems: "baseline", justifyContent: "center", gap: 12 }}>
              <RollNumber value={499} p={priceP} size={150} /><span style={{ fontFamily: SANS, fontSize: 52, fontWeight: 500, color: C.muted }}>kr.</span>
            </Abs>
            {chk > 0.001 && <Abs x={tx + TAG.w / 2 - 80} y={ty - TAG.h / 2 - 40} style={{ width: 110, height: 110, borderRadius: 55, background: C.sage, display: "flex", alignItems: "center", justifyContent: "center", transform: `translate(${tx + TAG.w / 2 - 80}px, ${ty - TAG.h / 2 - 40}px) scale(${Math.max(0, chk)}) rotate(${-25 * (1 - clamp01(chk))}deg)`, boxShadow: sh(1) }}><Ico n="check" s={70} c="#fff" w={2.8} /></Abs>}
          </div>
        )}
        {t >= B.byg2 + 0.05 && (
          <Abs x={CX - BTN.w / 2} y={BTN.y - BTN.h / 2} style={{ width: BTN.w, height: BTN.h, opacity: ez(t, B.byg2 + 0.04, 0.2, LIN) }}>
            <div style={{ position: "absolute", inset: 0, WebkitMaskImage: `linear-gradient(90deg, #000 ${reveal * 130 - 30}%, transparent ${reveal * 130}%)`, maskImage: `linear-gradient(90deg, #000 ${reveal * 130 - 30}%, transparent ${reveal * 130}%)` }}>
              <PillButton text="Byg din side gratis" size={56} press={pp} style={{ width: BTN.w, height: BTN.h, padding: 0, justifyContent: "center", boxSizing: "border-box", background: "transparent", boxShadow: "none" }} />
            </div>
            {ph >= 0 && (
              <div style={{ position: "absolute", inset: 0, borderRadius: BTN.h / 2, overflow: "hidden", transform: `scale(${pr})` }}>
                <div style={{ position: "absolute", left: 0, top: 0, width: 400, height: BTN.h, transform: `translateX(${bandX}px) skewX(-18deg)`, background: "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.3), rgba(255,255,255,0))" }} />
              </div>
            )}
          </Abs>
        )}
      </>
    );
    // one line at a time under the stage
    const ln = (txt: string, at: number, next: number, it: string[]) => t >= at - 0.05 && t < next + 0.4 ? <Line key={txt} text={txt} y={LINE_Y} size={LINE_SIZE} p={ez(t, at, 0.45, LIN)} out={t > next - 0.12 ? ez(t, next - 0.12, 0.2, INOUT) : 0} italicWords={it} /> : null;
    lines = (
      <>
        {ln("Byg den.", L.byg, L.se, ["Byg"])}{ln("Se den.", L.se, L.s2, ["Se"])}{ln("Så køber du.", L.s2, B.gather + 0.1, ["køber"])}
        {t >= L.creoble4 - 0.05 && <Line text="creoble.dk" y={LINE_Y} size={56} p={ez(t, L.creoble4, 0.6, LIN)} serif={false} color={C.sageDeep} />}
      </>
    );
  }

  return (
    <>
      {stage}
      {panel}
      {lineKo}
      {lineRobot}
      {robot}
      {wm}
      {goo}
      {over}
      {steps}
      {lines}
    </>
  );
};
