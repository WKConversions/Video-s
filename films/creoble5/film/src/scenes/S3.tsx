// Scene 3 (h2 to h3): the price. One sage capsule, one thing on screen: check -> 499 kr. -> Én gang -> /md struck ->
// mini phone ("Din") -> tilt (?) -> 0 kr. -> iOS toggle OFF -> knob becomes the capsule (hand-off). Transforms only; the
// capsule's size/shape morphs with clip-path on one static box; its shadow is a transparent caster (box-shadow).
import React from "react";
import { C, INOUT, OUT, SANS, SERIF, clamp01, mix } from "../lib";
import { CX, Handoff, SHADOW_SOFT, float } from "../v5";
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

// ── colours ─────────────────────────────────────────────────────────────────────────────────────────────────────
const SAGE = [135, 168, 158], WHITE = [255, 255, 255], TINT = [231, 239, 236];
const lerpC = (a: number[], b: number[], t: number) => a.map((v, i) => v + (b[i] - v) * t);
const rgba = (a: number[], al = 1) => `rgba(${a.map(Math.round).join(",")},${al})`;
/** fill index: 0 sage, 1 white (price), 2 sage tint (phone screen) */
const fillAt = (fl: number) => { const u = Math.min(2, Math.max(0, fl)); return u <= 1 ? lerpC(SAGE, WHITE, u) : lerpC(WHITE, TINT, u - 1); };

const BW = 760, BH = 440;   // the static box the capsule lives in (always centred on the capsule)
const abs = (x: number, y: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left: x, top: y, ...extra });

// ── rolling price: columns that roll up (0 -> 499) or down (499 -> 0), then collapse; "kr." slides in beside ─────────────
const Price: React.FC<{ size: number; from: number; to: number; p: number; krb: number }> = ({ size, from, to, p, krb }) => {
  const n = Math.max(String(from).length, String(to).length);
  const fs = String(from).padStart(n, "0"), ts = String(to).padStart(n, "0");
  const dw = 0.6 * size, lh = size * 1.2, up = to >= from ? 1 : -1, toLen = String(to).length;
  const cols = Array.from({ length: n }, (_, j) => {
    const present = j >= n - toLen;
    const c = present ? 1 : 1 - OUT(clamp01((p - 0.8) / 0.2));
    const a = Number(fs[j]), b = Number(ts[j]);
    const turns = ((up * (b - a)) % 10 + 10) % 10 + (j === n - toLen ? 10 : 0);
    const q = OUT(clamp01(p * 1.15 - j * 0.08));
    const pos = a + up * turns * q;
    return { c, m: ((pos % 10) + 10) % 10 };
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
            <div style={{ transform: `translateY(${-col.m * lh}px)`, fontFamily: SERIF, fontSize: size, letterSpacing: "-0.03em", color: C.ink, textAlign: "center", lineHeight: `${lh}px` }}>
              {Array.from({ length: 11 }, (_, i) => <div key={i} style={{ height: lh }}>{i % 10}</div>)}
            </div>
          </div>
        );
      })}
      <div style={abs(0, -lh / 2, { height: lh, display: "flex", alignItems: "center", fontFamily: SERIF, fontStyle: "italic", fontSize: size * 0.5, color: C.sageDeep, whiteSpace: "nowrap",
        transform: `translate(${x + gap + (1 - krb) * 28}px, ${size * 0.17}px)`, opacity: krv, filter: krv < 1 ? `blur(${(1 - krv) * 6}px)` : undefined })}>kr.</div>
    </div>
  );
};

// ── iOS toggle (own, springy: the knob overshoots and stretches while it travels) ─────────────────────────────────────
const TG = { size: 92, w: 156 }, TGX = 180;   // toggle: track 156 x 92, centred 180 right of the capsule centre
const PW = 640, PH = 200;                        // the price / row capsule
const Tgl: React.FC<{ u: number }> = ({ u }) => {
  const s = TG.size, tr = clamp01(u), travel = s * 0.7;
  const kx = s * 0.09 + travel * (1 - u);   // u may pass 1: the knob overshoots left
  const col = lerpC(SAGE, [220, 216, 209], tr);
  return (
    <div style={{ width: TG.w, height: s, borderRadius: s, background: rgba(col), position: "relative" }}>
      <div style={{ position: "absolute", top: s * 0.09, left: 0, width: s * 0.82, height: s * 0.82, borderRadius: "50%", background: "#fff", boxShadow: "0 2px 6px rgba(0,0,0,0.20)",
        transform: `translateX(${kx}px) scaleX(${1 + 0.28 * Math.sin(Math.PI * tr)})` }} />
    </div>
  );
};

// ── the line "Nul risiko.": two words, each blur-to-sharp on its own cue ────────────────────────────────────────────
const NulLine: React.FC<{ g: number; y: number; tA: number; tB: number; out: number; size: number }> = ({ g, y, tA, tB, out, size }) => (
  <div style={{ position: "absolute", left: CX - 700, top: y - size * 0.62, width: 1400, textAlign: "center", fontFamily: SERIF, fontSize: size, letterSpacing: "-0.025em", lineHeight: 1.15, whiteSpace: "nowrap",
    opacity: 1 - out, transform: `translate(${size * 1.18 * (1 - sp(g, tB - 1, 0.45, 0.7))}px, ${-30 * out}px)`, filter: out > 0 ? `blur(${10 * out}px)` : undefined }}>
    {[{ t: "Nul", at: tA, it: false }, { t: "risiko.", at: tB, it: true }].map((w, i) => {
      const q = sp(g, w.at, 0.42, 0.7), qc = clamp01(q), o = OUT(clamp01((g - w.at) / 7));
      return <span key={i} style={{ display: "inline-block", marginRight: i === 0 ? "0.26em" : 0, opacity: o, transform: `translateY(${(1 - q) * 30}px)`, filter: o < 1 ? `blur(${(1 - qc) * 9}px)` : undefined,
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
  const tIkke = f("w:ikke"), tTil2 = f("w:tilfreds2"), tS = f("w:s"), tIng = f("w:ingenting"), tNul = f("w:nul"), tRis = f("w:risiko");
  const tChk = T0 + 5, tLand = t499 + 33, tDock = tIntet + 6, tDrop = tAbo + 5, tHop = tTil2 + 11, tOff = tNul + 4;
  const tEx = TE - 6.5;     // the knob leaves the row

  // ── the capsule's own state (all springs) ─────────────────────────────────────────────────────────────────────
  let x = track(g, 1160, [[T0, 960, 0.55, 0.62]]) + imp(g, tDock, -13, 2, 6);
  let y = track(g, 540, [[tN - 1, 476, 0.45, 0.62], [tIntet, 540, 0.4, 0.7], [tNul - 3, 480, 0.45, 0.62]])
    - 70 * (sp(g, tHop, 0.28, 0.55) - sp(g, tHop + 7, 0.28, 0.62));
  let w = track(g, 200, [[T0 + 2, 300, 0.45, 0.6], [t499, PW, 0.45, 0.58], [tSiden, 190, 0.5, 0.6], [tS, PW, 0.45, 0.6]]);
  let h = track(g, 60, [[T0 + 2, 96, 0.45, 0.6], [t499, PH, 0.45, 0.58], [tSiden, 380, 0.5, 0.6], [tS, PH, 0.45, 0.6]]);
  let r = track(g, 30, [[T0 + 2, 48, 0.4, 0.9], [t499, PH / 2, 0.4, 0.9], [tSiden, 46, 0.5, 0.9], [tS, PH / 2, 0.4, 0.9]]);
  let fl = track(g, 0, [[t499, 1, 0.35, 1], [tSiden, 2, 0.4, 1], [tS, 1, 0.35, 1]]);
  let ring = track(g, 0, [[t499, 4, 0.35, 1], [tSiden, 10, 0.4, 1], [tS, 4, 0.35, 1]]);
  const flAmp = INOUT(clamp01((g - T0) / 26)) * 2.6;          // the float eases in from the hand-off
  let sc = 1 + imp(g, tChk + 6, 0.07, 2.0, 6.5) + imp(g, tLand, 0.055, 2.3, 6) + imp(g, tIng, 0.07, 2.2, 6) + imp(g, tNul, 0.04, 2.2, 6) + imp(g, tN, 0.03, 2.2, 7);
  let rz = imp(g, tDock, -3.5, 2.2, 5) + imp(g, tDrop, 6, 2.4, 5) + imp(g, tIkke, -15, 1.6, 3.2) + imp(g, tTil2, 11, 1.8, 3.4) + imp(g, t499, -3, 2, 6) + imp(g, tS, 4, 2, 5);
  let ry = imp(g, tSiden, -55, 1.2, 3.2) + imp(g, tIkke, 30, 1.6, 3.2) + imp(g, tS, 40, 1.3, 4.2) + imp(g, T0, 12, 1.4, 4);
  let rx = imp(g, tTil2, -18, 1.8, 3.4) + imp(g, tHop, 8, 1.8, 4);

  // ── the exit: the row collapses onto its knob, the knob flies out and becomes the capsule at x 760 ───────────────
  const e1 = ramp(g, tEx, 3.2, OUT), e2 = ramp(g, tEx + 2.6, TE - (tEx + 2.6), INOUT);
  const mx = (a: number, b: number, t: number) => mix(a, b, t);
  {
    // knob centre when OFF: the toggle's left edge + 6.3 + 29
    const k1 = { x: x + TGX - TG.w / 2 + TG.size * 0.09 + TG.size * 0.41, y, w: TG.size * 0.82, h: TG.size * 0.82, r: TG.size * 0.41, fl: 1, ring: 4 };   // knob centre = capsule centre - 210 + (track left) + 6 + 29
    x = mx(x, k1.x, e1); y = mx(y, k1.y, e1); w = mx(w, k1.w, e1); h = mx(h, k1.h, e1); r = mx(r, k1.r, e1); fl = mx(fl, k1.fl, e1); ring = mx(ring, k1.ring, e1);
    x = mx(x, 760, e2); y = mx(y, 540, e2); w = mx(w, 200, e2); h = mx(h, 60, e2); r = mx(r, 30, e2); fl = mx(fl, 0, e2); ring = mx(ring, 0, e2);
    sc = mx(sc, 1, e2); rz = mx(rz, 0, e2); ry = mx(ry, 0, e2); rx = mx(rx, 0, e2);
  }
  const spinX = -360 * (1 - sp(g, t499, 0.7, 0.75)) + 360 * (1 - sp(g, tS, 0.7, 0.75));   // card flips (X): at the price, and back to it
  const spinY = -360 * (1 - sp(g, tSiden, 0.85, 0.7));                                      // the phone turns in (Y)
  const mirX = Math.cos(((rx + spinX) * Math.PI) / 180) < 0 ? -1 : 1, mirY = Math.cos(((ry + spinY) * Math.PI) / 180) < 0 ? -1 : 1;
  const amp = flAmp * (1 - e2);
  const inner = fillAt(fl);

  // sheen: a glint that sweeps across the capsule, on a loop and faster on events
  const loop = ((g - T0) / 24) % 1;
  const sheen = loop;
  const sheenCol = fl > 1 ? SAGE : lerpC(WHITE, SAGE, clamp01(fl));
  const sheenA = fl > 1 ? 0.3 : mix(0.4, 0.34, clamp01(fl));

  // ── content visibilities ─────────────────────────────────────────────────────────────────────────────────────
  const chkP = ramp(g, tChk, 8, OUT), chkOut = ramp(g, t499, 7, OUT), chkPop = sp(g, tChk + 7, 0.35, 0.5);
  const priceIn = ramp(g, t499 + 1, 7) * (1 - ramp(g, tSiden - 2, 4)) + ramp(g, tS + 3, 6) * (1 - ramp(g, tNul - 1, 5));
  const rowIn = ramp(g, tNul - 1, 6) * (1 - clamp01(e1 * 2.2));
  const pR1 = clamp01((g - (t499 + 3)) / 30), pR2 = clamp01((g - (tS + 3)) / 16.5);
  const phase2 = g >= tS - 1;
  const krb = phase2 ? 1 : sp(g, tKr, 0.4, 0.62);
  const phoneIn = ramp(g, tSiden + 4, 5) * (1 - ramp(g, tS - 1, 3));

  // ── "Én gang." chip: pops out from under the capsule, widens to its text, tucks back ───────────────────────────
  const chipPop = sp(g, tN, 0.42, 0.55), chipTuck = ramp(g, tIntet - 1, 6, INOUT), chipW = ramp(g, tN + 4, 8);
  const chipY = mix(y, y + PH / 2 + 26 + 48, chipPop);
  const showChip = g >= tN && g < tIntet + 6;

  // ── "/md": a glass tag tries to attach to the price, is struck and drops ─────────────────────────────────────────
  const mdT = (g - tDrop) / 30;
  const mdIn = 1 - sp(g, tIntet, 0.42, 0.6);
  const mdX = x + 262 + mdIn * 340 + (mdT > 0 ? 70 * mdT : 0);
  const mdY = y + (mdT > 0 ? 0.5 * 2600 * mdT * mdT : 0) + imp(g, tIntet + 9, -7, 3, 4) * (mdT > 0 ? 0 : 1);
  const mdRot = (mdT > 0 ? 380 * mdT : 0) + imp(g, tIntet + 7, 5, 3.4, 4);
  const mdO = mdT > 0 ? 1 - clamp01(mdT / 0.42) : 1;
  const strike = ramp(g, tAbo, 4.5, INOUT);
  const showMd = g >= tIntet && mdT < 0.45;

  // ── the "Din" badge on the phone ───────────────────────────────────────────────────────────────────────────────
  const badge = sp(g, tDin, 0.4, 0.5) * (1 - ramp(g, tIkke, 5, INOUT));
  const showBadge = g >= tDin && g < tIkke + 6;

  const nulOut = ramp(g, TE - 5, 4, INOUT);
  const lineY = 648;

  const blk = (i: number) => sp(g, tSiden + 9 + i * 2.4, 0.36, 0.58);
  const bar = (i: number, cx0: number, cy0: number, bw0: number, bh0: number, col: string, rad0 = bh0 / 2) => {
    const q = blk(i), K = 190 / 140, cx = cx0 * K, cy = cy0 * K, bw = bw0 * K, bh = bh0 * K, rad = rad0 * K;
    return <div key={i} style={abs(-bw / 2, -bh / 2, { width: bw, height: bh, borderRadius: rad, background: col, opacity: clamp01(q * 1.6) * phoneIn, transform: `translate(${cx}px, ${cy + (1 - q) * 14}px) scale(${0.55 + 0.45 * q})` })} />;
  };

  // shape clip (centred in the box): outer ring (sage) and inner fill
  const clip = (ww: number, hh: number, rr: number, inset = 0) => {
    const ix = (BW - ww) / 2 + inset, iy = (BH - hh) / 2 + inset;
    return `inset(${iy}px ${ix}px ${iy}px ${ix}px round ${Math.max(0, Math.min(rr - inset, (Math.min(ww, hh) - 2 * inset) / 2))}px)`;
  };
  const Wl = 2 * Math.round(w / 2), Hl = 2 * Math.round(h / 2);

  return (
    <>
      {/* "Én gang." chip (under the capsule) */}
      {showChip && (
        <div style={{ position: "absolute", left: 0, top: 0, width: 340, height: 96, transform: `translate(${x - 170}px, ${chipY - 48}px) scale(${mix(0.3, 1, chipPop) * (1 - 0.7 * chipTuck)})`, opacity: 1 - chipTuck, filter: "drop-shadow(0 8px 10px rgba(26,22,20,0.14))" }}>
          <div style={{ position: "absolute", inset: 0, background: "#fff", clipPath: `inset(0px ${(1 - chipW) * 122}px round 48px)` }}>
            <div style={{ position: "absolute", inset: 0, boxShadow: `inset 0 0 0 3px ${C.sage}`, borderRadius: 48 }} />
            <div style={abs(170 - 40 - 122 * chipW, 8, { width: 80, height: 80, borderRadius: 40, background: C.sage, color: "#fff", fontFamily: SANS, fontWeight: 600, fontSize: 36, display: "flex", alignItems: "center", justifyContent: "center" })}>1×</div>
            <div style={abs(104, 0, { height: 96, display: "flex", alignItems: "center", fontFamily: SANS, fontWeight: 500, fontSize: 42, color: C.ink, whiteSpace: "nowrap", opacity: chipW, transform: `translateX(${(1 - chipW) * 24}px)`, filter: chipW < 1 ? `blur(${(1 - chipW) * 5}px)` : undefined })}>Én gang.</div>
          </div>
        </div>
      )}

      {/* the capsule: caster (shadow), sage ring, inner fill, content */}
      <div style={{ position: "absolute", left: 0, top: 0, width: BW, height: BH,
        transform: `translate(${x - BW / 2}px, ${y - BH / 2}px) perspective(1500px) ${float(g, 0.3, amp)} rotateX(${rx + spinX}deg) rotateY(${ry + spinY}deg) rotateZ(${rz}deg) scale(${sc})` }}>
        <div style={abs(BW / 2 - Wl / 2, BH / 2 - Hl / 2, { width: Wl, height: Hl, borderRadius: Math.min(r, Math.min(Wl, Hl) / 2), boxShadow: SHADOW_SOFT })} />
        <div style={{ position: "absolute", inset: 0, background: rgba(SAGE), clipPath: clip(w, h, r) }} />
        <div style={{ position: "absolute", inset: 0, background: rgba(inner), clipPath: clip(w, h, r, ring) }}>
          {/* glint */}
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(105deg, ${rgba(sheenCol, 0)} ${mix(-55, 95, sheen)}%, ${rgba(sheenCol, sheenA)} ${mix(-30, 120, sheen)}%, ${rgba(sheenCol, 0)} ${mix(-5, 145, sheen)}%)` }} />
          <div style={abs(BW / 2, BH / 2, { transform: `scale(${mirY}, ${mirX})` })}>
            {/* check */}
            {chkOut < 1 && (
              <svg width={60} height={60} viewBox="0 0 48 48" style={abs(-30, -30, { overflow: "visible", opacity: 1 - chkOut, transform: `scale(${(0.6 + 0.4 * chkPop) * (1 - 0.5 * chkOut)})` })}>
                <path d="M11 25 L21 35 L38 14" pathLength={1} fill="none" stroke="#fff" strokeWidth={5.5} strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1" strokeDashoffset={1 - chkP} />
              </svg>
            )}
            {/* price */}
            {priceIn > 0.001 && (
              <div style={{ opacity: priceIn, transform: `scale(${mix(0.9, 1, priceIn)})`, filter: priceIn < 1 ? `blur(${(1 - priceIn) * 7}px)` : undefined }}>
                {!phase2 ? <Price size={132} from={0} to={499} p={pR1} krb={krb} /> : <Price size={132} from={499} to={0} p={pR2} krb={1} />}
              </div>
            )}
            {/* phone screen */}
            {phoneIn > 0.001 && (
              <>
                {bar(0, 0, -120, 44, 12, C.ink, 6)}
                {bar(1, 0, -82, 84, 12, C.sageDeep)}
                {bar(2, 0, -58, 98, 7, C.sageLight)}
                {bar(3, -14, -44, 70, 7, C.sageLight)}
                {bar(4, 0, 2, 104, 76, C.sageLight, 14)}
                {bar(5, 0, 66, 72, 24, C.sage)}
                {bar(6, -27, 106, 48, 26, "#CFE0DA", 10)}
                {bar(7, 27, 106, 48, 26, "#CFE0DA", 10)}
              </>
            )}
            {/* risk row */}
            {rowIn > 0.001 && (
              <div style={{ opacity: rowIn, transform: `scale(${mix(0.94, 1, rowIn)})`, filter: rowIn < 1 ? `blur(${(1 - rowIn) * 6}px)` : undefined }}>
                <div style={abs(-268, -40, { height: 80, display: "flex", alignItems: "center", fontFamily: SANS, fontWeight: 500, fontSize: 44, color: C.ink, letterSpacing: "-0.01em" })}>Risiko</div>
                <div style={abs(TGX - TG.w / 2, -TG.size / 2)}><Tgl u={sp(g, tOff, 0.4, 0.55)} /></div>
              </div>
            )}
          </div>
        </div>
        {/* Din badge */}
        {showBadge && (
          <div style={abs(BW / 2 + 95 - 56, BH / 2 - 190 - 12, { width: 112, height: 58, borderRadius: 29, background: C.ink, color: C.cream, fontFamily: SERIF, fontStyle: "italic", fontSize: 38, display: "flex", alignItems: "center", justifyContent: "center",
            transform: `scale(${badge}) rotate(${(1 - badge) * -25}deg)`, opacity: clamp01(badge * 3), boxShadow: "0 8px 16px -6px rgba(26,22,20,0.4)" })}>Din</div>
        )}
      </div>

      {/* "/md": glass tag */}
      {showMd && (
        <div style={{ position: "absolute", left: 0, top: 0, width: 150, height: 84, opacity: mdO, transform: `translate(${mdX - 75}px, ${mdY - 42}px) rotate(${mdRot}deg)` }}>
          <LiquidGlass w={150} h={84} p={1} sheen={clamp01((g - tIntet) / 20)} tint="ink">
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontWeight: 500, fontSize: 40, color: C.cream }}>/md</div>
          </LiquidGlass>
          <div style={abs(-8, 40, { width: 166, height: 5, borderRadius: 2, background: C.sageLight, transformOrigin: "0% 50%", transform: `rotate(-6deg) scaleX(${strike})` })} />
        </div>
      )}

      {/* "Nul risiko." */}
      {g >= tNul && <NulLine g={g} y={lineY} tA={tNul} tB={tRis - 1.5} out={nulOut} size={80} />}
    </>
  );
};
