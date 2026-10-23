import React from "react";
import { Easing } from "remotion";
import { C, HOLM, OUT, INOUT, SANS, clamp01, mix } from "../lib";
import { Ico, LiquidGlass, f, squash } from "../shared";
import { CX, Handoff, HANDOFF_HALF, Line, MiniSite, float } from "../v5";

// Scene 1 (0 → h1, 10.05 s), builder 1. One sage thing on screen at a time, centred, small, on plain cream:
// dot → capsule → Liquid Glass window → stopwatch → sparkle → text field → Dynamic Island → phone → capsule.
// All timings are seconds (t = g / 30); springs are local (seconds based, no label rounding).

const SAGE = C.sage, DEEP = C.sageDeep, LIGHT = C.sageLight, INK = C.ink;
const sp = (t: number, t0: number, resp = 0.4, damp = 1) => {
  const x = t - t0;
  if (x <= 0) return 0;
  const w0 = (2 * Math.PI) / resp;
  if (damp >= 1) return 1 - (1 + w0 * x) * Math.exp(-w0 * x);
  const wd = w0 * Math.sqrt(1 - damp * damp);
  return 1 - Math.exp(-damp * w0 * x) * (Math.cos(wd * x) + ((damp * w0) / wd) * Math.sin(wd * x));
};
const ez = (t: number, t0: number, d: number, e: (x: number) => number = OUT) => e(clamp01((t - t0) / d));
const hex = (c: string) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
const mixc = (a: string, b: string, p: number) => {
  const A = hex(a), B = hex(b), q = clamp01(p);
  return "#" + A.map((v, i) => Math.round(mix(v, B[i], q)).toString(16).padStart(2, "0")).join("");
};
const SWEEP = Easing.bezier(0.45, 0.05, 0.25, 1);
const kick = (t: number, t0: number, amp: number) => (t < t0 ? 0 : amp * Math.exp(-(t - t0) * 7) * Math.sin((t - t0) * 26));

/** A static box (BW × BH) centred on the frame centre, moved by transforms only; its visible shape is a clip-path inset
 * (w × h, radius r), so a dot, a capsule, a window and a circle are one box morphing. */
const Shaped: React.FC<{ BW: number; BH: number; cx: number; cy: number; w: number; h: number; r?: number; color: string; sc?: number; tf?: string; shadow?: number; children?: React.ReactNode }> =
  ({ BW, BH, cx, cy, w, h, r, color, sc = 1, tf = "", shadow = 1, children }) => {
  const ww = Math.max(0.5, w), hh = Math.max(0.5, h), rr = Math.max(0, Math.min(r ?? hh / 2, ww / 2, hh / 2));
  const ix = (BW - ww) / 2, iy = (BH - hh) / 2;
  return (
    <div style={{ position: "absolute", left: 960 - BW / 2, top: 540 - BH / 2, width: BW, height: BH, transform: `translate(${cx - 960}px, ${cy - 540}px) ${tf} scale(${sc})`,
      filter: shadow > 0 ? `drop-shadow(0 ${12 * shadow}px ${15 * shadow}px rgba(26,22,20,${0.13 * shadow}))` : undefined }}>
      <div style={{ position: "absolute", inset: 0, clipPath: `inset(${iy}px ${ix}px ${iy}px ${ix}px round ${rr}px)`, background: color }}>{children}</div>
    </div>
  );
};

// ── the window's site sketch (box-local coordinates 580 × 360) ────────────────────────────────────────────────────
const Blk: React.FC<{ t: number; t0: number; x: number; y: number; w: number; h: number; r?: number; bg?: string; i?: number; children?: React.ReactNode }> =
  ({ t, t0, x, y, w, h, r = 18, bg = "rgba(255,255,255,0.78)", i = 0, children }) => {
  const p = sp(t, t0, 0.36, 0.58);
  const live = clamp01((t - t0 - 0.5) * 2) * 2.2 * Math.sin(t * 2.4 + i * 1.7);
  return <div style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: r, background: bg, opacity: clamp01(p * 3),
    transform: `translateY(${(1 - p) * 24 + live}px) scale(${0.78 + 0.22 * p})`, overflow: "hidden" }}>{children}</div>;
};
const Sketch: React.FC<{ t: number }> = ({ t }) => {
  const wob = (a: number, s: number) => 1 + a * Math.sin(t * 3.1 + s);
  const sheenX = ((t * 0.85) % 1.6) / 1.6;
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <Blk t={t} t0={0.78} x={22} y={14} w={536} h={30} r={15} bg="rgba(255,255,255,0.55)" i={0}>
        {[0, 1, 2].map((n) => <div key={n} style={{ position: "absolute", left: 14 + n * 17, top: 10, width: 10, height: 10, borderRadius: 5, background: DEEP, opacity: 0.45 }} />)}
        <div style={{ position: "absolute", left: 100, top: 8, width: 340, height: 14, borderRadius: 7, background: "rgba(255,255,255,0.9)" }} />
      </Blk>
      <Blk t={t} t0={0.86} x={22} y={56} w={536} h={150} r={22} i={1}>
        <div style={{ position: "absolute", left: 28, top: 30, width: 230, height: 24, borderRadius: 12, background: DEEP, transformOrigin: "0 50%", transform: `scaleX(${wob(0.07, 0)})` }} />
        <div style={{ position: "absolute", left: 28, top: 68, width: 300, height: 12, borderRadius: 6, background: SAGE, opacity: 0.6, transformOrigin: "0 50%", transform: `scaleX(${wob(0.06, 1.4)})` }} />
        <div style={{ position: "absolute", left: 28, top: 92, width: 250, height: 12, borderRadius: 6, background: SAGE, opacity: 0.4, transformOrigin: "0 50%", transform: `scaleX(${wob(0.06, 2.6)})` }} />
        <div style={{ position: "absolute", left: 28, top: 114, width: 112, height: 14, borderRadius: 7, background: INK, opacity: 0.0 }} />
        <div style={{ position: "absolute", right: 28, top: 22, width: 118, height: 106, borderRadius: 22, background: LIGHT, transform: `rotate(${4 * Math.sin(t * 2.2)}deg)` }}>
          <div style={{ position: "absolute", left: 30, top: 24, width: 58, height: 58, borderRadius: 29, background: SAGE, transform: `translate(${5 * Math.sin(t * 3.3)}px, ${5 * Math.cos(t * 3.3)}px)` }} />
        </div>
      </Blk>
      {[0, 1].map((n) => (
        <Blk key={n} t={t} t0={0.99 + n * 0.12} x={22 + n * 282} y={218} w={254} h={128} r={22} i={2 + n}>
          <div style={{ position: "absolute", left: 22, top: 22, width: 44, height: 44, borderRadius: 14, background: n ? DEEP : SAGE, opacity: 0.85, transform: `scale(${wob(0.08, n * 2)})` }} />
          <div style={{ position: "absolute", left: 22, top: 82, width: 150, height: 12, borderRadius: 6, background: SAGE, opacity: 0.55, transformOrigin: "0 50%", transform: `scaleX(${wob(0.07, n + 1)})` }} />
          <div style={{ position: "absolute", left: 22, top: 102, width: 100, height: 10, borderRadius: 5, background: SAGE, opacity: 0.35 }} />
        </Blk>
      ))}
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(105deg, rgba(255,255,255,0) ${mix(-30, 100, sheenX)}%, rgba(255,255,255,0.42) ${mix(-15, 115, sheenX)}%, rgba(255,255,255,0) ${mix(0, 130, sheenX)}%)`, pointerEvents: "none" }} />
    </div>
  );
};

// ── the stopwatch (box-local 580 × 360, centre 290,180; 260 px) ──────────────────────────────────────────────────
const Stopwatch: React.FC<{ t: number; face: number }> = ({ t, face }) => {
  const turns = 1.75 * SWEEP(clamp01((t - 1.55) / 0.82)) + Math.max(0, t - 2.37) * 0.12;
  const ang = turns * 360, circ = 2 * Math.PI * 119;
  const arc = (turns % 1) * circ;
  return (
    <>
      <div style={{ position: "absolute", left: 290 - 108, top: 180 - 108, width: 216, height: 216, borderRadius: "50%", background: "#fff", transform: `scale(${face})` }} />
      <div style={{ position: "absolute", left: 290 - 108, top: 180 - 108, width: 216, height: 216, borderRadius: "50%", opacity: clamp01(face * 2 - 0.6),
        background: `conic-gradient(from ${ang - 84}deg at 50% 50%, rgba(135,168,158,0) 0deg, rgba(135,168,158,0.42) 84deg, rgba(135,168,158,0) 84.5deg)` }} />
      <svg width={260} height={260} viewBox="0 0 260 260" style={{ position: "absolute", left: 160, top: 50, opacity: clamp01(face * 1.6 - 0.2) }}>
        {Array.from({ length: 60 }, (_, i) => {
          const a = (i * 6 * Math.PI) / 180, major = i % 5 === 0, r1 = 98, r2 = major ? 80 : 88;
          return <line key={i} x1={130 + Math.sin(a) * r1} y1={130 - Math.cos(a) * r1} x2={130 + Math.sin(a) * r2} y2={130 - Math.cos(a) * r2} stroke={LIGHT} strokeWidth={major ? 3.2 : 2} strokeLinecap="round" opacity={major ? 1 : 0.7} />;
        })}
        <circle cx={130} cy={130} r={119} fill="none" stroke={DEEP} strokeWidth={14} strokeLinecap="round" strokeDasharray={`${arc} ${circ}`} transform="rotate(-90 130 130)" opacity={arc > 2 ? 1 : 0} />
        <line x1={130} y1={130} x2={130} y2={130 - 84} stroke={INK} strokeWidth={4.5} strokeLinecap="round" transform={`rotate(${ang} 130 130)`} />
        <circle cx={130} cy={130} r={9} fill={INK} /><circle cx={130} cy={130} r={3.5} fill={SAGE} />
      </svg>
    </>
  );
};

// ── the sparkle ──────────────────────────────────────────────────────────────────────────────────────────────────
const STAR = "M50 0 C54.5 29 71 45.5 100 50 C71 54.5 54.5 71 50 100 C45.5 71 29 54.5 0 50 C29 45.5 45.5 29 50 0 Z";
const Sparkle: React.FC<{ t: number; cx: number; cy: number; size: number; rot: number; scale: number }> = ({ t, cx, cy, size, rot, scale }) => (
  <div style={{ position: "absolute", left: cx - size / 2, top: cy - size / 2, width: size, height: size, transform: `rotate(${rot}deg) scale(${Math.max(0, scale)})`,
    filter: "drop-shadow(0 12px 15px rgba(26,22,20,0.13))" }}>
    <svg width={size} height={size} viewBox="0 0 100 100">
      <defs>
        <linearGradient id="s1-spark" x1="0" y1="0" x2="1" y2="1" gradientTransform={`rotate(${t * 90} 0.5 0.5)`}>
          <stop offset="0" stopColor={LIGHT} /><stop offset="0.5" stopColor={SAGE} /><stop offset="1" stopColor={DEEP} />
        </linearGradient>
      </defs>
      <path d={STAR} fill="url(#s1-spark)" />
    </svg>
  </div>
);

// ── template cards ───────────────────────────────────────────────────────────────────────────────────────────────
const TemplateCard: React.FC<{ rot: number; dx: number; dy: number; op: number }> = ({ rot, dx, dy, op }) => (
  <div style={{ position: "absolute", left: CX - 112, top: 800 - 330, width: 224, height: 310, borderRadius: 24, background: "#E6E3DD", border: "1px solid #D5D1C9", opacity: op,
    transformOrigin: "112px 330px", transform: `translate(${dx}px, ${dy}px) rotate(${rot}deg)`, boxShadow: "0 10px 24px -14px rgba(26,22,20,0.28)" }}>
    <div style={{ position: "absolute", left: 22, top: 24, width: 96, height: 14, borderRadius: 7, background: "#CFCBC3" }} />
    <div style={{ position: "absolute", left: 22, top: 56, width: 180, height: 118, borderRadius: 14, background: "#D9D5CD" }} />
    {[0, 1, 2].map((n) => <div key={n} style={{ position: "absolute", left: 22, top: 194 + n * 24, width: 180 - n * 34, height: 10, borderRadius: 5, background: "#D2CEC6" }} />)}
  </div>
);

// ── the scene ────────────────────────────────────────────────────────────────────────────────────────────────────
export const Scene1: React.FC<{ g: number }> = ({ g }) => {
  const HOFF = f("h1") - HANDOFF_HALF;
  if (g >= HOFF) return <Handoff g={g} at="h1" />;       // from h1 - 0.25 s to the end of the span: the hand-off only
  const t = g / 30, TH = HOFF / 30;

  // float amplitude: none while the dot and capsule land, full in the holds, none again before the phone and the hand-off
  const ampA = ez(t, 0.62, 0.35, INOUT) * (1 - ez(t, 5.85, 0.3, INOUT));
  const phoneAmp = ez(t, 7.05, 0.5, INOUT) * (1 - ez(t, TH - 0.78, 0.28, INOUT));

  // ── A: dot → capsule → window → stopwatch (one Shaped box, 580 × 360) ──
  let A: React.ReactNode = null;
  let aSc = 1, crown: React.ReactNode = null;
  if (t < 2.7) {
    // the dot drops, bounces twice, and the impacts squash it
    const fall = t < 0.2 ? (t / 0.2) ** 2 : 1;
    let y = -30 + 570 * fall;
    if (t >= 0.2 && t < 0.34) { const u = (t - 0.2) / 0.14; y = 540 - 95 * 4 * u * (1 - u); }
    if (t >= 0.34 && t < 0.42) { const u = (t - 0.34) / 0.08; y = 540 - 24 * 4 * u * (1 - u); }
    if (t >= 0.42) y = 540;
    const imp = [0.2, 0.34, 0.42].reduce((s, ti, i) => s + (t >= ti ? [0.55, 0.4, 0.25][i] * Math.exp(-(t - ti) / 0.045) : 0), 0);
    const fs = t < 0.2 ? (t / 0.2) * 0.4 : 0;
    const dw = 24 * (1 + 0.5 * imp - 0.2 * fs), dh = 24 * (1 - 0.4 * imp + fs);
    const pd = sp(t, 0.43, 0.26, 0.6), wp = sp(t, 0.62, 0.5, 0.68), s1 = sp(t, 1.38, 0.42, 0.7);
    const capW = t < 0.43 ? dw : mix(dw, 200, pd), capH = t < 0.43 ? dh : mix(dh, 60, pd);
    const w = capW + 380 * wp - 320 * s1, h = capH + 300 * wp - 100 * s1;
    const cy0 = t < 0.43 ? y + 12 - dh / 2 : 540;
    const cy = cy0 - 20 * wp - 30 * s1 - 10 * ez(t, 2.42, 0.22, INOUT);
    const r = Math.min(w / 2, h / 2, 34 + 96 * clamp01(s1));
    const col = mixc(mixc(SAGE, "#A9C6BD", clamp01(wp * 1.2)), SAGE, clamp01(s1 * 1.4));
    const collapse = ez(t, 2.42, 0.22, INOUT);
    aSc = 1 + (24 / 260 - 1) * collapse;
    const winOp = clamp01(wp * 1.4) * (1 - clamp01(s1 * 2.4));
    const swFace = clamp01(sp(t, 1.5, 0.4, 0.8));
    A = (
      <Shaped BW={580} BH={360} cx={960} cy={cy} w={w} h={h} r={r} color={col} sc={aSc} shadow={1}>
        {winOp > 0.01 && (
          <div style={{ position: "absolute", inset: 0, opacity: winOp }}>
            <LiquidGlass w={580} h={360} radius={34} p={1} sheen={0.5 + 0.5 * Math.sin(t * 1.6)} tint="sage" />
            <Sketch t={t} />
          </div>
        )}
        {swFace > 0.001 && <Stopwatch t={t} face={swFace} />}
      </Shaped>
    );
    // the crown and side button pop out of the stopwatch
    const cp = sp(t, 1.6, 0.3, 0.55);
    if (cp > 0.001) crown = (
      <div style={{ position: "absolute", left: 960, top: cy, width: 0, height: 0, transform: `scale(${aSc})`, opacity: 1 - collapse }}>
        <div style={{ position: "absolute", left: -11, top: -136, width: 22, height: 16, background: SAGE, transform: `scaleY(${cp})`, transformOrigin: "50% 100%" }} />
        <div style={{ position: "absolute", left: -32, top: -158, width: 64, height: 22, borderRadius: 11, background: SAGE, transform: `scale(${cp})`, transformOrigin: "50% 100%" }} />
        <div style={{ position: "absolute", left: 88, top: -112, width: 24, height: 14, borderRadius: 7, background: SAGE, transform: `rotate(45deg) scale(${cp})` }} />
      </div>
    );
  }

  // ── the shock ring and the sparkle (bursts from the stopwatch's dot) ──
  const SPY = 478;
  let spark: React.ReactNode = null;
  if (t >= 2.56 && t < 4.1) {
    const born = sp(t, 2.6, 0.5, 0.52), shrink = ez(t, 3.86, 0.2, INOUT);
    const sc0 = born * (1 + 0.035 * Math.sin(t * 6.9)) * (1 + kick(t, 3.01, 0.07) + kick(t, 3.3, 0.14)) * (1 - shrink);
    const rot = -230 * (1 - sp(t, 2.6, 0.55, 0.62)) + 26 * (t - 2.6) + 160 * shrink;
    spark = <Sparkle t={t} cx={CX} cy={mix(SPY, 530, shrink)} size={236} rot={rot} scale={sc0} />;
  }
  const ringP = ez(t, 2.6, 0.5, OUT);
  const ring = t >= 2.6 && t < 3.15 ? (
    <div style={{ position: "absolute", left: 960 - 150, top: SPY - 150, width: 300, height: 300, borderRadius: "50%", border: `3px solid ${SAGE}`, opacity: 0.55 * (1 - ringP), transform: `scale(${0.1 + 0.9 * ringP})` }} />
  ) : null;

  // ── the text field (box 620 × 84), from the sparkle's dot ──
  let field: React.ReactNode = null;
  if (t >= 3.98 && t < 6.42) {
    const f1 = sp(t, 4.0, 0.22, 0.7), f2 = sp(t, 4.17, 0.45, 0.62), g1 = sp(t, 6.12, 0.26, 0.85);
    const w = 24 + 176 * f1 + 420 * f2 - 420 * g1, h = 24 + 36 * f1 + 24 * f2 - 24 * g1;
    const col = mixc(mixc(SAGE, "#FFFFFF", clamp01(f2 * 1.3)), SAGE, clamp01(g1 * 1.2));
    const txt = "Holm Fysioterapi", t0 = 4.62, cps = 12;
    const n = Math.max(0, Math.min(txt.length, Math.floor((t - t0) * cps)));
    const contentOp = clamp01((f2 - 0.35) * 2.2) * (1 - clamp01(g1 * 4));
    const btn = sp(t, 4.5, 0.4, 0.55), pr = 1 - 0.14 * Math.max(0, Math.min(1, (t - 6.09) / 0.08)) * (t < 6.21 ? 1 : Math.exp(-(t - 6.21) * 12));
    const caretOn = n < txt.length || Math.floor(t * 2.2) % 2 === 0;
    field = (
      <Shaped BW={620} BH={84} cx={960} cy={530} w={w} h={h} r={h / 2} color={col} tf={`perspective(1400px) ${float(g, 0.3, ampA)}`} shadow={1}>
        <div style={{ position: "absolute", inset: 0, opacity: clamp01(f2 * 1.6) }}>
          <LiquidGlass w={620} h={84} radius={42} p={1} sheen={0.5 + 0.5 * Math.sin(t * 1.8)} tint="clear" />
        </div>
        <div style={{ position: "absolute", inset: 0, opacity: contentOp, fontFamily: SANS }}>
          <div style={{ position: "absolute", left: 28, top: 26, transform: `rotate(${20 * Math.sin(t * 2.5)}deg) scale(${1 + 0.08 * Math.sin(t * 5)})` }}><Ico n="sparkle" s={32} c={SAGE} fill={SAGE} w={1} /></div>
          <div style={{ position: "absolute", left: 80, top: 0, height: 84, display: "flex", alignItems: "center", fontSize: 28, fontWeight: 500, color: INK, whiteSpace: "pre", letterSpacing: "-0.01em" }}>
            {txt.slice(0, n).split("").map((ch, i) => {
              const a = sp(t, t0 + i / cps, 0.22, 0.5);
              return <span key={i} style={{ display: "inline-block", opacity: clamp01(a * 3), transform: `translateY(${(1 - a) * 9}px) scale(${0.6 + 0.4 * a})`, filter: a < 0.7 ? `blur(${(0.7 - a) * 5}px)` : undefined }}>{ch}</span>;
            })}
            <span style={{ display: "inline-block", width: 3, height: 34, marginLeft: 3, borderRadius: 2, background: SAGE, opacity: caretOn ? 1 : 0 }} />
          </div>
          <div style={{ position: "absolute", left: 620 - 13 - 58, top: 13, width: 58, height: 58, borderRadius: 29, background: SAGE, display: "flex", alignItems: "center", justifyContent: "center",
            transform: `scale(${Math.max(0, btn) * pr})`, boxShadow: "0 6px 14px -6px rgba(26,22,20,0.4)" }}>
            <Ico n="arrow" s={30} c="#fff" w={2.6} style={{ transform: `translateX(${3 * Math.sin(t * 5)}px)` }} />
          </div>
        </div>
      </Shaped>
    );
  }

  // ── B: capsule rises and becomes the Island (6.4 → 6.8); later the Island drops into the capsule (→ TH) ──
  let B: React.ReactNode = null;
  if (t >= 6.4 && t < 6.8) {
    const pr = sp(t, 6.4, 0.38, 0.72);
    B = <Shaped BW={240} BH={80} cx={960} cy={530 - 277 * pr} w={200 - 110 * pr} h={60 - 34 * pr} color={mixc(SAGE, "#000000", clamp01((pr - 0.45) * 2))} />;
  }
  const dropStart = TH - 0.2;
  if (t >= dropStart) {
    const q = ez(t, dropStart, 0.2, OUT), qp = ez(t - 1 / 30, dropStart, 0.2, OUT);
    const px = (u: number) => mix(960, 760, u), py = (u: number) => mix(253, 540, u);
    B = <Shaped BW={240} BH={80} cx={px(q)} cy={py(q)} w={90 + 110 * q} h={26 + 34 * q} color={mixc("#000000", SAGE, clamp01(q * 1.3))}
      tf={squash(px(q) - px(qp), py(q) - py(qp), 0.0016)} />;
  }

  // ── the phone, unrolled from the Island ──
  let phone: React.ReactNode = null, chip: React.ReactNode = null, cards: React.ReactNode = null;
  const u0 = 6.78;
  if (t >= u0 && t < TH - 0.15) {
    const pw = sp(t, u0, 0.38, 0.8), ph = sp(t, u0 + 0.02, 0.5, 0.68);
    const collapse = ez(t, TH - 0.42, 0.24, INOUT);
    const open = t < TH - 0.45 ? 1 : 1 - collapse;
    const ow = t < TH - 0.45 ? clamp01(pw) : open, oh = t < TH - 0.45 ? clamp01(ph) : open;
    const top = mix(240, 220, oh), bot = mix(814, 220, oh), side = mix(915, 810, ow), rad = mix(13, 50, ow);
    const pop = 1 + 0.45 * Math.max(0, Math.min(ph, pw) - 1);
    const build = ez(t, 6.86, 0.7, (x) => x);
    const scroll = 330 * INOUT(clamp01((t - 7.45) / 2.0));
    phone = (
      <div style={{ position: "absolute", inset: 0, transformOrigin: "960px 540px", transform: `perspective(1600px) ${float(g, 2.0, phoneAmp)} scale(${pop})` }}>
        <div style={{ position: "absolute", inset: 0, filter: "drop-shadow(0 2px 3px rgba(26,22,20,0.10)) drop-shadow(0 30px 26px rgba(26,22,20,0.20))" }}>
        <div style={{ position: "absolute", inset: 0, clipPath: `inset(${top}px ${side}px ${bot}px ${side}px round ${rad}px)` }}>
          <div style={{ position: "absolute", left: 810, top: 220, width: 300, height: 640 }}>
            <div style={{ position: "absolute", inset: 0, borderRadius: 50, background: INK }} />
            <div style={{ position: "absolute", left: 9, top: 9, width: 282, height: 622, borderRadius: 41, overflow: "hidden", background: HOLM.bg,
              clipPath: `inset(${top - 220}px ${side - 810}px ${bot - 220}px ${side - 810}px round ${Math.max(0, rad - 9)}px)` }}>
              <MiniSite build={build} scroll={scroll} />
            </div>
            <div style={{ position: "absolute", left: 105, top: 20, width: 90, height: 26, borderRadius: 13, background: "#000" }} />
          </div>
        </div>
        </div>
      </div>
    );

    // "</>" chip pops out to the left, is struck through and drops
    const ct = t - 8.13;
    if (ct > -0.01 && ct < 1.4) {
      const p = sp(t, 8.13, 0.5, 0.58), arc = Math.sin(Math.PI * clamp01(p));
      const x0 = 830, y0 = 520, x1 = CX - 318, y1 = 432;
      const dt = Math.max(0, t - 8.64), fall = 0.5 * 2600 * dt * dt;
      const strike = ez(t, 8.42, 0.14, OUT), hit = sp(t, 8.42, 0.3, 0.5);
      const cxp = mix(x0, x1, p) - 62 * dt, cyp = mix(y0, y1, p) - 70 * arc + fall + 4 * Math.sin(t * 5.5) * (1 - clamp01(dt * 8));
      const rot = -7 * clamp01(p) - 5 * Math.sin(Math.PI * clamp01(hit)) + 150 * dt * dt * 2.2;
      const op = 1 - clamp01(dt / 0.5);
      chip = (
        <div style={{ position: "absolute", left: cxp - 70, top: cyp - 39, width: 140, height: 78, opacity: op, transform: `rotate(${rot}deg) scale(${Math.max(0, p) * (1 - 0.06 * Math.sin(Math.PI * clamp01(hit)))})` }}>
          <div style={{ width: 140, height: 78, borderRadius: 39, background: INK, color: C.btnText, fontFamily: SANS, fontWeight: 600, fontSize: 36, letterSpacing: "-0.02em",
            display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 14px 24px -14px rgba(26,22,20,0.55)" }}>{"</>"}</div>
          <div style={{ position: "absolute", left: -14, top: 36, width: 168, height: 7, borderRadius: 4, background: SAGE, transformOrigin: "0 50%", transform: `rotate(-9deg) scaleX(${strike})` }} />
        </div>
      );
    }

    // three grey template cards fan out behind the phone and slide away the other way
    if (t > 9.07) {
      const rots = [-38, -17, 24];
      cards = (
        <>{rots.map((a, i) => {
          const fan = sp(t, 9.09 + i * 0.045, 0.42, 0.6), away = ez(t, 9.3 + i * 0.04, 0.34, INOUT);
          return <TemplateCard key={i} rot={a * fan + 22 * away} dx={420 * away} dy={-150 * away} op={clamp01(fan * 4) * (1 - away)} />;
        })}</>
      );
    }
  }

  // ── the lines ──
  const lines = (
    <>
      {t > 1.36 && t < 2.62 && <Line text="få minutter" y={706} p={clamp01((t - 1.38) / 0.8)} out={ez(t, 2.34, 0.26, INOUT)} italicWords={["minutter"]} />}
      {t > 2.58 && t < 4.15 && <Line text="Bygget af AI." y={706} p={clamp01((t - 2.6) / 1.9)} out={ez(t, 3.86, 0.24, INOUT)} italicWords={["AI"]} />}
      {t > 4.15 && t < 6.4 && <Line text="Fortæl kort om din virksomhed" y={444} size={24} serif={false} color={C.muted} p={clamp01((t - 4.2) / 1.7)} out={ez(t, 6.0, 0.24, INOUT)} />}
    </>
  );

  return (
    <>
      {lines}
      <div style={{ position: "absolute", inset: 0, transformOrigin: "960px 520px", transform: `perspective(1400px) ${float(g, 0.3, ampA)}` }}>
        {A}{crown}{ring}{spark}
      </div>
      {field}
      {cards}
      {phone}
      {chip}
      {B}
    </>
  );
};
