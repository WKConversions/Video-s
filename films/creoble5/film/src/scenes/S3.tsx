// Scene 3 (h2 to h3), revision 1: the price, big. One object, always working: capsule + check -> a 960x320 price capsule
// whose digit strips roll several full turns (0 -> 499) -> "1× Én gang." chip flies out -> a big "/md" tag flies in, is
// struck and falls -> the capsule unrolls into a big phone (1.35x) with the real MiniSite building and scrolling ("Din")
// -> question tilt -> back to the price, strips roll 499 -> 0 -> a big iOS toggle switches OFF -> the knob becomes the
// capsule (hand-off). Transforms only; the shape morphs with clip-path on one static box; its shadow is a transparent caster.
import React from "react";
import { C, INOUT, OUT, SANS, SERIF, clamp01, mix } from "../lib";
import { CX, HOLM, Handoff, MiniSite, Phone, SHADOW_SOFT } from "../v5";
import { LiquidGlass, f } from "../shared";

// ── small math ──────────────────────────────────────────────────────────────────────────────────────────────────
/** a spring 0 -> 1 from g-time `at` (response s, damping ratio); damping < 1 overshoots */
const sp = (g: number, at: number, resp = 0.45, damp = 0.62) => {
  const t = (g - at) / 30;
  if (t <= 0) return 0;
  const w0 = (2 * Math.PI) / resp;
  if (damp >= 1) return 1 - (1 + w0 * t) * Math.exp(-w0 * t);
  const wd = w0 * Math.sqrt(1 - damp * damp);
  return 1 - Math.exp(-damp * w0 * t) * (Math.cos(wd * t) + ((damp * w0) / wd) * Math.sin(wd * t));
};
type Key = [number, number, number?, number?];
/** value that starts at v0 and spring-travels to each key's value from its time (additive, so overlaps stay continuous) */
const track = (g: number, v0: number, keys: Key[]) => {
  let v = v0, prev = v0;
  for (const [at, val, r = 0.45, d = 0.62] of keys) { v += (val - prev) * sp(g, at, r, d); prev = val; }
  return v;
};
/** a damped wobble impulse: starts at 0 */
const imp = (g: number, at: number, A: number, fr = 2.2, dec = 6) => {
  const t = (g - at) / 30;
  return t <= 0 ? 0 : A * Math.exp(-dec * t) * Math.sin(2 * Math.PI * fr * t);
};
const ramp = (g: number, at: number, durG: number, e: (t: number) => number = OUT) => e(clamp01((g - at) / Math.max(0.001, durG)));
/** a single glint sweep: 0..1 while active, else 1 (invisible) */
const sweep = (g: number, at: number, dur: number) => (g >= at && g < at + dur ? (g - at) / dur : -1);

// ── colours ─────────────────────────────────────────────────────────────────────────────────────────────────────
const SAGE = [135, 168, 158], WHITE = [255, 255, 255], INKC = [26, 22, 20];
const lerpC = (a: number[], b: number[], t: number) => a.map((v, i) => v + (b[i] - v) * t);
const rgba = (a: number[], al = 1) => `rgba(${a.map(Math.round).join(",")},${al})`;
/** fill index: 0 sage, 1 white (price), 2 ink (phone body) */
const fillAt = (fl: number) => { const u = Math.min(2, Math.max(0, fl)); return u <= 1 ? lerpC(SAGE, WHITE, u) : lerpC(WHITE, INKC, u - 1); };

// ── sizes (revision 1) ──────────────────────────────────────────────────────────────────────────────────────────
const BW = 1200, BH = 960;                       // the static box the capsule lives in (always centred on the capsule)
const PW = 1140, PH = 400, ROW_W = 880;           // price capsule; the risk row is a little narrower
const PS = 1.4;                                  // phone scale: 420 x 896
const PHW = 300 * PS, PHH = 640 * PS, PHR = 50 * PS;
const TG = { size: 200, w: 340 }, TGX = 140;     // iOS toggle 340 x 200, centred 140 right of the capsule centre
const DIG = 330;                                 // price digits, Fraunces px
const abs = (x: number, y: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left: x, top: y, ...extra });
// roll easing: fast the whole way, a short decel to land (no long slow tail)
const ROLL = (q: number) => { if (q <= 0) return 0; if (q >= 1) return 1; if (q < 0.8) return (8 / 9) * (q / 0.8); const u = (q - 0.8) / 0.2; return 8 / 9 + (1 / 9) * (2 * u - u * u); };

// ── rolling price: digit strips that roll several full turns (up 0 -> 499, down 499 -> 0), then collapse; "kr." beside ──
const Price: React.FC<{ size: number; from: number; to: number; p: number; dp: number; krb: number; spins: number[] }> = ({ size, from, to, p, dp, krb, spins }) => {
  const n = Math.max(String(from).length, String(to).length);
  const fs = String(from).padStart(n, "0"), ts = String(to).padStart(n, "0");
  const dw = 0.6 * size, lh = size * 1.2, up = to >= from ? 1 : -1, toLen = String(to).length;
  const cols = Array.from({ length: n }, (_, j) => {
    const present = j >= n - toLen;
    const c = present ? 1 : 1 - OUT(clamp01((p - 0.86) / 0.14));
    const a = Number(fs[j]), b = Number(ts[j]);
    const total = ((up * (b - a)) % 10 + 10) % 10 + 10 * spins[j];
    const posAt = (pp: number) => a + up * total * ROLL(clamp01(pp * 1.12 - j * 0.07));
    const pos = posAt(p), speed = Math.abs(pos - posAt(Math.max(0, p - dp)));
    return { c, m: ((pos % 10) + 10) % 10, blur: Math.min(30, speed * lh * 0.32) };
  });
  const digitsW = cols.reduce((s, c) => s + dw * c.c, 0);
  const krv = clamp01(krb), gap = 0.1 * size * krb, krW = 0.6 * size * krb;
  const G = digitsW + gap + krW;
  let x = -G / 2;
  return (
    <div style={abs(0, 0)}>
      {cols.map((col, j) => {
        const xx = x; x += dw * col.c;
        return (
          <div key={j} style={abs(0, -lh / 2, { width: dw, height: lh, overflow: "hidden", transform: `translateX(${xx}px)`, opacity: col.c })}>
            {col.blur > 0.6 && <svg width={0} height={0} style={{ position: "absolute" }}><defs><filter id={`s3vb${j}`} x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur stdDeviation={`0 ${col.blur.toFixed(2)}`} /></filter></defs></svg>}
            <div style={{ transform: `translateY(${-col.m * lh}px)`, filter: col.blur > 0.6 ? `url(#s3vb${j})` : undefined, fontFamily: SERIF, fontSize: size, letterSpacing: "-0.03em", color: C.ink, textAlign: "center", lineHeight: `${lh}px` }}>
              {Array.from({ length: 11 }, (_, i) => <div key={i} style={{ height: lh }}>{i % 10}</div>)}
            </div>
          </div>
        );
      })}
      <div style={abs(0, -lh / 2, { height: lh, display: "flex", alignItems: "center", fontFamily: SERIF, fontStyle: "italic", fontSize: size * 0.5, color: C.sageDeep, whiteSpace: "nowrap",
        transform: `translate(${x + gap + (1 - krb) * 60}px, ${size * 0.17}px)`, opacity: krv, filter: krv < 1 ? `blur(${(1 - krv) * 8}px)` : undefined })}>kr.</div>
    </div>
  );
};

// ── iOS toggle (own, springy: the knob overshoots and stretches while it travels) ─────────────────────────────────────
const Tgl: React.FC<{ u: number }> = ({ u }) => {
  const s = TG.size, tr = clamp01(u), travel = s * 0.7;
  const kx = s * 0.09 + travel * (1 - u);   // u may pass 1: the knob overshoots left
  const col = lerpC(SAGE, [220, 216, 209], tr);
  return (
    <div style={{ width: TG.w, height: s, borderRadius: s, background: rgba(col), position: "relative" }}>
      <div style={{ position: "absolute", top: s * 0.09, left: 0, width: s * 0.82, height: s * 0.82, borderRadius: "50%", background: "#fff", boxShadow: "0 4px 12px rgba(0,0,0,0.22)",
        transform: `translateX(${kx}px) scaleX(${1 + 0.22 * Math.sin(Math.PI * tr)})` }} />
    </div>
  );
};

// ── the line "Nul risiko.": two words, each blur-to-sharp on its own cue; "Nul" sits centred until "risiko." arrives ─────
const NulLine: React.FC<{ g: number; y: number; tA: number; tB: number; out: number; size: number }> = ({ g, y, tA, tB, out, size }) => (
  <div style={{ position: "absolute", left: CX - 800, top: y - size * 0.62, width: 1600, textAlign: "center", fontFamily: SERIF, fontSize: size, letterSpacing: "-0.025em", lineHeight: 1.15, whiteSpace: "nowrap",
    opacity: 1 - out, transform: `translate(${size * 1.18 * (1 - sp(g, tB - 1, 0.45, 0.7))}px, ${-40 * out}px)`, filter: out > 0 ? `blur(${12 * out}px)` : undefined }}>
    {[{ t: "Nul", at: tA, it: false }, { t: "risiko.", at: tB, it: true }].map((w, i) => {
      const q = sp(g, w.at, 0.42, 0.7), qc = clamp01(q), o = OUT(clamp01((g - w.at) / 7));
      return <span key={i} style={{ display: "inline-block", marginRight: i === 0 ? "0.26em" : 0, opacity: o, transform: `translateY(${(1 - q) * 40}px)`, filter: o < 1 ? `blur(${(1 - qc) * 10}px)` : undefined,
        fontStyle: w.it ? "italic" : "normal", color: w.it ? C.sageDeep : C.ink }}>{w.t}</span>;
    })}
  </div>
);

export const Scene3: React.FC<{ g: number }> = ({ g }) => {
  const H2 = f("h2"), H3 = f("h3"), T0 = H2 + 7.5, TE = H3 - 7.5;
  if (g <= T0) return <Handoff g={g} at="h2" />;
  if (g >= TE) return <Handoff g={g} at="h3" />;

  // cues (g)
  const t499 = f("w:499"), tKr = f("w:kroner"), tN = f("w:n"), tIntet = f("w:intet"), tAbo = f("w:abonnement"), tSiden = f("w:siden2"), tDin = f("w:din3");
  const tIkke = f("w:ikke"), tTil2 = f("w:tilfreds2"), tS = f("w:s"), tNul = f("w:nul"), tRis = f("w:risiko");
  const tChk = T0 + 5, tRoll = t499 + 1, ROLL1 = 52, tLand = tRoll + ROLL1 - 3, tDock = tIntet + 6, tDrop = tAbo + 5, tOff = tNul;
  const tRoll2 = tS + 2, ROLL2 = 26, tLand2 = tRoll2 + ROLL2 - 3;
  const tEx = TE - 10;     // the knob leaves the row

  // ── the capsule's own state (all springs) ─────────────────────────────────────────────────────────────────────
  let x = track(g, 1160, [[T0, 960, 0.55, 0.62]]) + imp(g, tDock, -40, 2, 6);
  let y = track(g, 540, [[tN - 1, 472, 0.45, 0.62], [tIntet, 540, 0.4, 0.7], [tNul - 6, 460, 0.45, 0.62]]);
  let w = track(g, 200, [[T0 + 2, 880, 0.45, 0.6], [t499, PW, 0.45, 0.58], [tSiden, PHW, 0.5, 0.6], [tS, PW, 0.45, 0.6], [tNul - 5, ROW_W, 0.4, 0.8]]);
  let h = track(g, 60, [[T0 + 2, 280, 0.45, 0.6], [t499, PH, 0.45, 0.58], [tSiden, PHH, 0.5, 0.6], [tS, PH, 0.45, 0.6]]);
  let r = track(g, 30, [[T0 + 2, 140, 0.4, 0.9], [t499, PH / 2, 0.4, 0.9], [tSiden, PHR, 0.5, 0.9], [tS, PH / 2, 0.4, 0.9]]);
  let fl = track(g, 0, [[t499, 1, 0.35, 1], [tSiden, 2, 0.4, 1], [tS, 1, 0.07, 1]]);
  let ring = track(g, 0, [[t499, 5, 0.35, 1], [tSiden, 0, 0.4, 1], [tS, 5, 0.35, 1]]);
  let sc = 1 + imp(g, tChk + 6, 0.10, 2.0, 6.5) + imp(g, tLand, 0.07, 2.3, 6) + imp(g, tLand2, 0.08, 2.2, 6) + imp(g, tNul, 0.05, 2.2, 6) + imp(g, tN, 0.05, 2.2, 7);
  let rz = imp(g, tDock, -4, 2.2, 5) + imp(g, tDrop, 3, 2.4, 5) + imp(g, tIkke, -14, 1.6, 3.2) + imp(g, tTil2, 10, 1.8, 3.4);
  let ry = imp(g, tIkke, 28, 1.6, 3.2);
  let rx = imp(g, tTil2, -16, 1.8, 3.4);
  const spinY = -360 * (1 - sp(g, tSiden, 0.9, 0.7));   // the one flip: the phone turns in

  // ── the exit: the row collapses onto its knob, the knob flies out and becomes the capsule at x 760 ───────────────
  const e1 = ramp(g, tEx, 4.5, OUT), e2 = ramp(g, tEx + 4, TE - (tEx + 4), INOUT);
  const mx = (a: number, b: number, t: number) => mix(a, b, t);
  {
    // knob centre when OFF: the toggle's left edge + 0.09 s + 0.41 s
    const k1 = { x: x + TGX - TG.w / 2 + TG.size * 0.09 + TG.size * 0.41, y, w: TG.size * 0.82, h: TG.size * 0.82, r: TG.size * 0.41, fl: 1, ring: 5 };
    x = mx(x, k1.x, e1); y = mx(y, k1.y, e1); w = mx(w, k1.w, e1); h = mx(h, k1.h, e1); r = mx(r, k1.r, e1); fl = mx(fl, k1.fl, e1); ring = mx(ring, k1.ring, e1);
    x = mx(x, 760, e2); y = mx(y, 540, e2); w = mx(w, 200, e2); h = mx(h, 60, e2); r = mx(r, 30, e2); fl = mx(fl, 0, e2); ring = mx(ring, 0, e2);
    sc = mx(sc, 1, e2); rz = mx(rz, 0, e2); ry = mx(ry, 0, e2); rx = mx(rx, 0, e2);
  }
  const inner = fillAt(fl);
  const mirX = Math.cos((rx * Math.PI) / 180) < 0 ? -1 : 1, mirY = Math.cos(((ry + spinY) * Math.PI) / 180) < 0 ? -1 : 1;

  // glints on the events (a single sweep; 1 = off-capsule, matches the hand-off pill)
  const sw = [sweep(g, T0 + 8, 18), sweep(g, tLand, 12), sweep(g, tN + 8, 12), sweep(g, tIntet + 12, 12), sweep(g, tLand2, 12), sweep(g, tNul + 4, 12)].find((v) => v >= 0);
  const sheen = sw === undefined ? 1 : sw;
  const sheenCol = fl > 1 ? WHITE : lerpC(WHITE, SAGE, clamp01(fl));
  const sheenA = fl > 1 ? 0.12 : mix(0.4, 0.34, clamp01(fl));

  // ── content visibilities ─────────────────────────────────────────────────────────────────────────────────────
  const chkP = ramp(g, tChk, 9, OUT), chkOut = ramp(g, t499, 6, OUT), chkPop = sp(g, tChk + 7, 0.35, 0.5);
  const priceIn = ramp(g, t499 + 1, 6) * (1 - ramp(g, tSiden - 2, 4)) + ramp(g, tS + 4, 5) * (1 - ramp(g, tNul - 5, 5));
  const pR1 = clamp01((g - tRoll) / ROLL1), pR2 = clamp01((g - tRoll2) / ROLL2);
  const phase2 = g >= tS - 1;
  const krb = phase2 ? 1 : sp(g, tKr, 0.4, 0.62);
  const rowIn = ramp(g, tNul - 5, 6) * (1 - clamp01(e1 * 2.2));
  const phoneIn = ramp(g, tSiden + 2, 6) * (1 - ramp(g, tS - 1, 3));
  // the site builds block by block, then scrolls steadily down the page
  const build = ramp(g, tSiden + 3, 22, (t) => t);
  const scDown = ramp(g, tSiden + 10, 38, (t) => (t < 0.88 ? (t / 0.88) * 0.93 : 0.93 + 0.07 * (1 - Math.pow(1 - (t - 0.88) / 0.12, 2)))), scUp = ramp(g, tTil2 + 6, 20, INOUT);
  const scroll = 360 * scDown - 330 * scUp;

  // ── "Én gang." chip: pops out from under the capsule, widens to its text, tucks back ───────────────────────────
  const CW = 420, CH = 110, chipHalf = (CW - CH) / 2;
  const chipPop = sp(g, tN, 0.6, 0.5), chipTuck = ramp(g, tIntet - 1, 6, INOUT), chipW = ramp(g, tN + 6, 14);
  const chipY = mix(y, y + PH / 2 + 26 + CH / 2, chipPop);
  const showChip = g >= tN && g < tIntet + 6;

  // ── "/md": a big glass tag flies in, docks on the price (the price recoils), is struck and drops ───────────────────
  const mdT = (g - tDrop) / 30;
  const mdIn = 1 - sp(g, tIntet, 0.42, 0.6);
  const mdX = x + 575 + mdIn * 700 + (mdT > 0 ? 120 * mdT : 0);
  const mdY = y + (mdT > 0 ? 0.5 * 4200 * mdT * mdT : 0) + imp(g, tIntet + 9, -12, 3, 4) * (mdT > 0 ? 0 : 1);
  const mdRot = (mdT > 0 ? 420 * mdT : 0) + imp(g, tIntet + 7, 5, 3.4, 4);
  const mdO = mdT > 0 ? 1 - clamp01(mdT / 0.6) : 1;
  const strike = ramp(g, tAbo, 4.5, INOUT);
  const showMd = g >= tIntet && mdT < 0.62;

  // ── the "Din" badge on the phone ───────────────────────────────────────────────────────────────────────────────
  const badge = sp(g, tDin, 0.4, 0.5) * (1 - ramp(g, tIkke, 5, INOUT));
  const showBadge = g >= tDin && g < tIkke + 6;

  const nulOut = ramp(g, TE - 5, 4, INOUT);
  const lineY = 762;

  // shape clip (centred in the box): outer ring (sage) and inner fill
  const clip = (ww: number, hh: number, rr: number, inset = 0) => {
    const ix = (BW - ww) / 2 + inset, iy = (BH - hh) / 2 + inset;
    return `inset(${iy}px ${ix}px ${iy}px ${ix}px round ${Math.max(0, Math.min(rr - inset, (Math.min(ww, hh) - 2 * inset) / 2))}px)`;
  };
  const Wl = 2 * Math.round(w / 2), Hl = 2 * Math.round(h / 2);
  const kS = clamp01((w - 200) / 600);      // shadow grows with the object; at 200 px it is exactly SHADOW_SOFT
  const shadow = kS === 0 ? SHADOW_SOFT : `0 1px 2px rgba(26,22,20,0.05), 0 ${mix(18, 44, kS)}px ${mix(40, 90, kS)}px -${mix(18, 34, kS)}px rgba(26,22,20,${mix(0.22, 0.32, kS)})`;

  return (
    <>
      {/* "Én gang." chip (under the capsule) */}
      {showChip && (
        <div style={{ position: "absolute", left: 0, top: 0, width: CW, height: CH, transform: `translate(${x - CW / 2}px, ${chipY - CH / 2}px) scale(${mix(0.3, 1, chipPop) * (1 - 0.7 * chipTuck)})`, opacity: 1 - chipTuck, filter: "drop-shadow(0 12px 14px rgba(26,22,20,0.16))" }}>
          <div style={{ position: "absolute", inset: 0, background: "#fff", clipPath: `inset(0px ${(1 - chipW) * chipHalf}px round ${CH / 2}px)` }}>
            <div style={{ position: "absolute", inset: 0, boxShadow: `inset 0 0 0 4px ${C.sage}`, borderRadius: CH / 2 }} />
            <div style={abs(CW / 2 - 47 - (CW / 2 - 55) * chipW, 8, { width: 94, height: 94, borderRadius: 47, background: C.sage, color: "#fff", fontFamily: SANS, fontWeight: 600, fontSize: 44, display: "flex", alignItems: "center", justifyContent: "center" })}>1×</div>
            <div style={abs(130, 0, { height: CH, display: "flex", alignItems: "center", fontFamily: SANS, fontWeight: 500, fontSize: 40, color: C.ink, whiteSpace: "nowrap", opacity: chipW, transform: `translateX(${(1 - chipW) * 40}px)`, filter: chipW < 1 ? `blur(${(1 - chipW) * 6}px)` : undefined })}>Én gang.</div>
          </div>
        </div>
      )}

      {/* the capsule: caster (shadow), sage ring, inner fill, content */}
      <div style={{ position: "absolute", left: 0, top: 0, width: BW, height: BH,
        transform: `translate(${x - BW / 2}px, ${y - BH / 2}px) perspective(1800px) rotateX(${rx}deg) rotateY(${ry + spinY}deg) rotateZ(${rz}deg) scale(${sc})` }}>
        <div style={abs(BW / 2 - Wl / 2, BH / 2 - Hl / 2, { width: Wl, height: Hl, borderRadius: Math.min(r, Math.min(Wl, Hl) / 2), boxShadow: shadow })} />
        <div style={{ position: "absolute", inset: 0, background: rgba(SAGE), clipPath: clip(w, h, r) }} />
        <div style={{ position: "absolute", inset: 0, background: rgba(inner), clipPath: clip(w, h, r, ring) }}>
          {/* glint */}
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(105deg, ${rgba(sheenCol, 0)} ${mix(-55, 95, sheen)}%, ${rgba(sheenCol, sheenA)} ${mix(-30, 120, sheen)}%, ${rgba(sheenCol, 0)} ${mix(-5, 145, sheen)}%)` }} />
          <div style={abs(BW / 2, BH / 2, { transform: `scale(${mirY}, ${mirX})` })}>
            {/* check */}
            {chkOut < 1 && (
              <svg width={190} height={190} viewBox="0 0 48 48" style={abs(-95, -95, { overflow: "visible", opacity: 1 - chkOut, transform: `scale(${(0.6 + 0.4 * chkPop) * (1 - 0.5 * chkOut)})` })}>
                <path d="M11 25 L21 35 L38 14" pathLength={1} fill="none" stroke="#fff" strokeWidth={5.5} strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1" strokeDashoffset={1 - chkP} />
              </svg>
            )}
            {/* price: strips roll several full turns */}
            {priceIn > 0.001 && (
              <div style={{ opacity: priceIn, transform: `scale(${mix(0.92, 1, priceIn)})` }}>
                {!phase2 ? <Price size={DIG} from={0} to={499} p={pR1} dp={0.5 / ROLL1} krb={krb} spins={[1, 2, 3]} /> : <Price size={DIG} from={499} to={0} p={pR2} dp={0.5 / ROLL2} krb={1} spins={[1, 2, 3]} />}
              </div>
            )}
            {/* the phone with the real site, building and scrolling */}
            {phoneIn > 0.001 && (
              <div style={{ opacity: phoneIn }}>
                <Phone x={0} y={0} scale={PS}>
                  <div style={{ width: 282, height: 622, willChange: "transform", transform: "rotate(0.1deg)" }}><MiniSite build={build} scroll={scroll} booking={1} />
                    {/* status bar: scrolled content passes under the Island, not through it */}
                    <div style={{ position: "absolute", left: 0, top: 0, width: 282, height: 56, background: `linear-gradient(${HOLM.bg} 0, ${HOLM.bg} 40px, rgba(244,241,236,0) 56px)` }} />
                  </div>
                </Phone>
              </div>
            )}
            {/* risk row */}
            {rowIn > 0.001 && (
              <div style={{ opacity: rowIn, transform: `scale(${mix(0.94, 1, rowIn)})`, filter: rowIn < 1 ? `blur(${(1 - rowIn) * 8}px)` : undefined }}>
                <div style={abs(-336, -50, { height: 100, display: "flex", alignItems: "center", fontFamily: SANS, fontWeight: 500, fontSize: 48, color: C.ink, letterSpacing: "-0.01em" })}>Risiko</div>
                <div style={abs(TGX - TG.w / 2, -TG.size / 2)}><Tgl u={sp(g, tOff, 0.4, 0.55)} /></div>
              </div>
            )}
          </div>
        </div>
        {/* Din badge */}
        {showBadge && (
          <div style={abs(BW / 2 + 205 - 110, BH / 2 - 400 - 52, { width: 220, height: 104, borderRadius: 52, background: C.ink, color: C.cream, fontFamily: SERIF, fontStyle: "italic", fontSize: 70, display: "flex", alignItems: "center", justifyContent: "center",
            transform: `scale(${badge}) rotate(${(1 - badge) * -25}deg)`, opacity: clamp01(badge * 3), boxShadow: "0 14px 28px -10px rgba(26,22,20,0.45)" })}>Din</div>
        )}
      </div>

      {/* "/md": big glass tag */}
      {showMd && (
        <div style={{ position: "absolute", left: 0, top: 0, width: 300, height: 170, opacity: mdO, transform: `translate(${mdX - 150}px, ${mdY - 85}px) rotate(${mdRot}deg)` }}>
          <LiquidGlass w={300} h={170} p={1} sheen={clamp01((g - tIntet) / 20)} tint="ink" style={{ background: "linear-gradient(160deg, rgba(40,35,32,0.96), rgba(26,22,20,0.92))" }}>
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SERIF, fontSize: 120, letterSpacing: "-0.02em", color: C.cream }}>/md</div>
          </LiquidGlass>
          <div style={abs(-14, 76, { width: 328, height: 12, borderRadius: 6, background: C.sageLight, transformOrigin: "0% 50%", transform: `rotate(-8deg) scaleX(${strike})` })} />
        </div>
      )}

      {/* "Nul risiko." */}
      {g >= tNul && <NulLine g={g} y={lineY} tA={tNul} tB={tRis - 1.5} out={nulOut} size={100} />}
    </>
  );
};
