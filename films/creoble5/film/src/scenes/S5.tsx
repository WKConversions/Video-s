// Scene 5 (builder 5): h4 → end. "Brug for hjælp? Et menneske, der forstår din forretning. Ingen kø. Ingen robotsvar.
// Creoble. Hjemmeside og hosting, samlet ét sted. Byg den. Se den. Så køber du. Byg din side gratis på creoble.dk."
// One object at a time on plain cream, centred and small. The sage thread capsule becomes a chat bubble, the human
// reply, a queue card that counts down to nothing, a robot that is flicked away, a dot that lands as the full stop of
// the wordmark; the wordmark slides up, two pills merge (Gooey) and bud into three step discs that melt into the CTA.
import React from "react";
import { C, INOUT, LIN, OUT, SANS, SERIF, WIPE, clamp01, mix } from "../lib";
import { Island, PillButton, squash, f } from "../shared";
import { CX, CY, HANDOFF_HALF, Handoff, Line, float } from "../v5";
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

// ── the labels this scene lands on ─────────────────────────────────────────────────────────────────────────────────
const L = {
  et: sec("w:et"), forstr: sec("w:forstr"), din4: sec("w:din4"), ingen4: sec("w:ingen4"), ingen5: sec("w:ingen5"), robot: sec("w:robotsvar"),
  creoble: sec("w:creoble3"), hjem: sec("w:hjemmeside2"), hosting: sec("w:hosting"), samlet: sec("w:samlet"), t: sec("w:t"), sted: sec("w:sted"),
  byg: sec("w:byg"), se: sec("w:se"), s2: sec("w:s2"), du5: sec("w:du5"), byg2: sec("w:byg2"), din5: sec("w:din5"), gratis: sec("w:gratis"),
  creoble4: sec("w:creoble4"), dk: sec("w:dk"),
};
// the beats built on those words
const B = {
  collapse: 42.1,            // the chat gathers into the capsule
  card: L.ingen4 - 0.02,     // capsule → queue card (42.58)
  roll: L.ingen4 + 0.2,      // 12 → 0
  cardOut: 43.3,             // the card shrinks to a dot
  launch: 44.4,              // the dot leaves for the wordmark's full stop
  land: 44.4 + 0.3,
  slide: L.hjem,             // the wordmark slides up
  merge: L.samlet + 0.04,
  split: L.byg - 0.16,       // the capsule buds into three discs
  gather: 50.4,              // the discs flow together into the button
  byg2: L.byg2,              // the button grows (50.61)
  press: 51.4,
};

// ── layout ─────────────────────────────────────────────────────────────────────────────────────────────────────────
const STAGE_Y = 545;         // row of pills / discs / button
const WM_Y = 405;            // the small wordmark
const WM_H = 96, WM_W = (WM_H * WM_VIEW.w) / WM_VIEW.h;
const WM_DOT_X = CX - WM_W / 2 + (7062.84 / WM_VIEW.w) * WM_W, WM_DOT_Y = CY - WM_H / 2 + (1344.2 / WM_VIEW.h) * WM_H;   // the full stop (px)
const AV = 64, GAP = 14, RW = 440, RH = 84;
const CL_X0 = CX - (AV + GAP + RW) / 2;
const AV_P = { x: CL_X0 + AV / 2, y: 632 };
const RP = { x: CL_X0 + AV + GAP + RW / 2, y: 632 };
const SG = { x: CL_X0 + AV + GAP + RW - 115, y: 520, w: 230, h: 92 };
const ISL_TOP = 392;
const CARD_Y = 480;
const BTN = { w: 440, h: 82 };
const DOT = 40;                  // the thread dot (the full stop is 18 px at wordmark height 96, so it lands smaller)

// ── a morphing blob: ONE static 200×60 box, moved and sized with transforms only (a pill is exactly the capsule) ───
const BASE = { w: 200, h: 60 };
const Blob: React.FC<{ x: number; y: number; w: number; h: number; r?: number; color?: string; shadow?: string; border?: string; borderO?: number; opacity?: number; rot?: number; tr?: string }> =
  ({ x, y, w, h, r, color = C.sage, shadow, border, borderO = 1, opacity = 1, rot = 0, tr = "" }) => {
  if (w < 0.5 || h < 0.5) return null;
  const sx = w / BASE.w, sy = h / BASE.h, rr = Math.min(r ?? Math.min(w, h) / 2, Math.min(w, h) / 2);
  return <div style={{ position: "absolute", left: 0, top: 0, width: BASE.w, height: BASE.h, boxSizing: "border-box", background: color, opacity,
    transform: `translate(${x - BASE.w / 2}px, ${y - BASE.h / 2}px) ${tr} rotate(${rot}deg) scale(${sx}, ${sy})`,
    borderRadius: `${rr / sx}px / ${rr / sy}px`, boxShadow: shadow,
    border: border ? `solid ${C.line}` : undefined, borderWidth: border ? `${1.5 / sy}px ${1.5 / sx}px` : undefined, borderColor: border ? `rgba(232,229,223,${borderO})` : undefined }} />;
};
const Abs: React.FC<{ x: number; y: number; style?: React.CSSProperties; children?: React.ReactNode }> = ({ x, y, style, children }) =>
  <div style={{ position: "absolute", left: 0, top: 0, transform: `translate(${x}px, ${y}px)`, ...style }}>{children}</div>;
/** words that rise out of blur one after another; centred on (x, y) */
const Words: React.FC<{ words: string[]; ats: number[]; t: number; x: number; y: number; size: number; serif?: boolean; color?: string; weight?: number; out?: number; italic?: number[]; scale?: number }> =
  ({ words, ats, t, x, y, size, serif = false, color = C.ink, weight = 500, out = 0, italic = [], scale = 1 }) => (
  <div style={{ position: "absolute", left: x - 700, top: y - size * 0.62, width: 1400, display: "flex", justifyContent: "center", gap: size * 0.28, whiteSpace: "pre", lineHeight: 1.2,
    fontFamily: serif ? SERIF : SANS, fontSize: size, fontWeight: serif ? 400 : weight, letterSpacing: serif ? "-0.02em" : "-0.01em", color, opacity: 1 - out, transform: `scale(${scale})`, filter: out > 0 ? `blur(${out * 8}px)` : undefined }}>
    {words.map((w, i) => { const q = ez(t, ats[i], 0.45, OUT);
      return <span key={i} style={{ display: "inline-block", opacity: q, transform: `translateY(${(1 - q) * 14}px)`, filter: q < 1 ? `blur(${(1 - q) * 7}px)` : undefined, fontStyle: italic.includes(i) ? "italic" : "normal" }}>{w}</span>; })}
  </div>
);

// ── small drawings ─────────────────────────────────────────────────────────────────────────────────────────────────
const Dots: React.FC<{ t: number; x: number; y: number; o: number }> = ({ t, x, y, o }) => (
  <Abs x={x - 28} y={y - 6} style={{ opacity: o, display: "flex", gap: 10 }}>
    {[0, 1, 2].map((i) => { const up = Math.max(0, Math.sin(t * 9 - i * 0.9));
      return <div key={i} style={{ width: 12, height: 12, borderRadius: 6, background: "#fff", opacity: 0.55 + 0.45 * up, transform: `translateY(${-7 * up}px) scale(${1 + 0.18 * up})` }} />; })}
  </Abs>
);
const Tail: React.FC<{ x: number; y: number; s: number; color: string }> = ({ x, y, s, color }) => (
  <Abs x={x} y={y} style={{ transform: `translate(${x}px, ${y}px) scale(${s})`, transformOrigin: "0 0" }}>
    <svg width={32} height={28} viewBox="0 0 32 28" style={{ display: "block", overflow: "visible" }}><path d="M0 0 L16 0 C16 12 22 23 32 27 C19 29 7 24 0 14 Z" fill={color} /></svg>
  </Abs>
);
const Robot: React.FC<{ blink: number }> = ({ blink }) => (
  <svg width={170} height={170} viewBox="0 0 160 160" style={{ display: "block", overflow: "visible", filter: "drop-shadow(0 14px 16px rgba(26,22,20,0.14))" }}>
    <path d="M80 44 V26" stroke={C.ink} strokeWidth={5} strokeLinecap="round" />
    <circle cx={80} cy={18} r={9} fill={C.sage} />
    <rect x={13} y={72} width={14} height={26} rx={7} fill={C.ink} /><rect x={133} y={72} width={14} height={26} rx={7} fill={C.ink} />
    <rect x={28} y={44} width={104} height={82} rx={28} fill="#fff" stroke={C.ink} strokeWidth={5} />
    <ellipse cx={58} cy={82} rx={8} ry={8 * blink} fill={C.ink} /><ellipse cx={102} cy={82} rx={8} ry={8 * blink} fill={C.ink} />
    <path d="M62 106 H98" stroke={C.ink} strokeWidth={5} strokeLinecap="round" />
  </svg>
);
const StepIcon: React.FC<{ kind: "hammer" | "eye" | "check"; p: number; t: number; at: number }> = ({ kind, p, t, at }) => {
  const rot = kind === "hammer" ? -75 * (1 - p) : kind === "check" ? -22 * (1 - p) : 0;
  const bl = kind === "eye" ? 1 - 0.92 * Math.exp(-Math.pow((t - (at + 0.55)) / 0.05, 2)) : 1;
  return (
    <svg width={46} height={46} viewBox="0 0 48 48" fill="none" stroke="#fff" strokeWidth={3.6} strokeLinecap="round" strokeLinejoin="round" style={{ display: "block", transform: `rotate(${rot}deg) scale(${Math.max(0, p)})`, transformOrigin: kind === "hammer" ? "14px 38px" : "24px 24px" }}>
      {kind === "hammer" && <><path d="M13 37 L30 20" /><g transform="rotate(45 30 20)"><rect x="17" y="13" width="26" height="12" rx="3" fill="#fff" stroke="none" /></g></>}
      {kind === "eye" && <g style={{ transform: `scaleY(${bl})`, transformOrigin: "24px 24px" }}><path d="M5 24 C12 12 36 12 43 24 C36 36 12 36 5 24 Z" /><circle cx={24} cy={24} r={5.5} fill="#fff" stroke="none" /></g>}
      {kind === "check" && <path d="M10 25 L20 35 L38 13" strokeWidth={4.4} />}
    </svg>
  );
};
/** vertical counter strip 12 → 0, rolling downwards through the numbers */
const QueueStrip: React.FC<{ v: number }> = ({ v }) => {
  const ROW = 76, rows = Array.from({ length: 13 }, (_, i) => 12 - i);
  const m = "linear-gradient(transparent 0, #000 24%, #000 76%, transparent 100%)";
  return (
    <div style={{ width: 100, height: ROW, overflow: "hidden", position: "relative", WebkitMaskImage: m, maskImage: m }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: "100%", transform: `translateY(${-(12 - v) * ROW}px)` }}>
        {rows.map((n) => <div key={n} style={{ height: ROW, lineHeight: `${ROW}px`, textAlign: "center", fontFamily: SERIF, fontSize: 64, color: C.ink, letterSpacing: "-0.03em" }}>{n}</div>)}
      </div>
    </div>
  );
};

// ═════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
export const Scene5: React.FC<{ g: number }> = ({ g }) => {
  if (g < f("h4") + HANDOFF_HALF) return <Handoff g={g} at="h4" />;
  const t = g / 30;
  const amp = 0.9 * ez(t, START, 0.8, INOUT);
  // a livelier hover (±9 px, ~0.6 Hz) on top of the kit's float, so no hold is ever still
  const fl = (seed: number, a = 1) => `perspective(1500px) translateY(${9 * amp * a * Math.sin(t * 3.6 + seed * 2)}px) ${float(g, seed, amp * a)}`;
  const Z = 1 + 0.35 * ez(t, START, 0.9, INOUT);   // one slow push-in while the capsule becomes the bubble: objects 1.35×, still under 760×640

  // ── 1+2. the chat: sage bubble with typing dots, the human reply, "Svarer nu" ──────────────────────────────────
  const chatOn = t < B.collapse + 0.5;
  const sagePos = (tt: number) => { const m = spr(tt, START, 0.55, 0.75); return { x: mix(1160, SG.x, m), y: mix(540, SG.y, m) }; };
  let chat: React.ReactNode = null;
  if (chatOn) {
    const pS = spr(t, START, 0.45, 0.55), p0 = sagePos(t), p1 = sagePos(t - 1 / 60);
    const wS = mix(PILL_W, SG.w, pS), hS = mix(PILL_H, SG.h, pS), rS = Math.min(hS / 2, mix(30, 44, clamp01(pS)));
    const sq = squash((p0.x - p1.x) * 0.5, (p0.y - p1.y) * 0.5, 0.003);
    const kk = 0.045 * kick(t, L.din4 - 0.0, 8, 24);                                  // the whole thread nods on "din"
    const pR = spr(t, L.et, 0.5, 0.6), pRx = spr(t, L.et, 0.46, 0.85);
    const rx = mix(SG.x, RP.x, pRx), ry = mix(SG.y, RP.y, pR);
    const rw = mix(120, RW, pR), rh = mix(56, RH, pR);
    const pA = spr(t, L.et + 0.16, 0.42, 0.5);
    const pI = spr(t, L.forstr, 0.5, 0.6);
    const ripple = (at: number) => { const x = ez(t, at, 0.6, OUT); return x > 0 && x < 1 ? <div key={at} style={{ position: "absolute", left: 0, top: 0, width: AV, height: AV, borderRadius: AV / 2, border: `3px solid ${C.sage}`, boxSizing: "border-box", opacity: 0.6 * (1 - x), transform: `translate(${AV_P.x - AV / 2}px, ${AV_P.y - AV / 2}px) scale(${1 + 1.1 * x})` }} /> : null; };
    const dC = ez(t, B.collapse, 0.45, INOUT), vis = 1 - clamp01((dC - 0.5) / 0.5);
    chat = (
      <div style={{ position: "absolute", inset: 0, transformOrigin: `${CX}px ${CY}px`, transform: `scale(${mix(1, 0.1, dC)})`, opacity: vis, filter: dC > 0 ? `blur(${dC * 5}px)` : undefined }}>
        <div style={{ position: "absolute", inset: 0, transform: fl(1.3), transformOrigin: `${CX}px ${CY}px` }}>
          <Blob x={p0.x} y={p0.y} w={wS} h={hS} r={rS} tr={sq} rot={10 * kick(t, START, 5, 16)} shadow={sh(1)} />
          <Tail x={p0.x + wS / 2 - 26} y={p0.y + hS / 2 - 19} s={clamp01(spr(t, START + 0.18, 0.4, 0.6))} color={C.sage} />
          <Dots t={t} x={p0.x} y={p0.y} o={ez(t, START + 0.28, 0.2, OUT)} />
          {/* the human reply: it splits off the sage bubble and settles bottom-left */}
          {pR > 0.001 && <Blob x={rx} y={ry + 3 * kk} w={rw * (1 + kk)} h={rh * (1 + kk)} r={Math.min(rh / 2, 40)} color={cmix("#FFFFFF", C.sage, pR * 2)} shadow={sh(clamp01(pR))} border="1" borderO={clamp01(pR * 2 - 0.6)} />}
          <Words words={["Hej!", "Hvordan", "kan", "jeg", "hjælpe?"]} ats={[0, 1, 2, 3, 4].map((i) => L.et + 0.3 + i * 0.075)} t={t} x={RP.x} y={RP.y} size={24} />
          {pA > 0.001 && <Abs x={mix(RP.x - RW / 2 + 10, AV_P.x, pA) - AV / 2} y={AV_P.y - AV / 2} style={{ width: AV, height: AV, borderRadius: AV / 2, background: C.sage, color: C.cream, fontFamily: SERIF, fontSize: 34, display: "flex", alignItems: "center", justifyContent: "center", transform: `translate(${mix(RP.x - RW / 2 + 10, AV_P.x, pA) - AV / 2}px, ${AV_P.y - AV / 2}px) scale(${Math.max(0, pA)})`, boxShadow: sh(1) }}>C</Abs>}
          {ripple(L.din4)}{ripple(L.din4 + 0.42)}
          {pI > 0.001 && (
            <div style={{ position: "absolute", inset: 0, opacity: clamp01(pI * 5), transformOrigin: `${CX}px ${ISL_TOP}px`, transform: `translateY(${(1 - Math.min(1, pI)) * -44}px) scale(${mix(0.55, 1, Math.min(1, pI))})` }}>
              <Island x={CX} y={ISL_TOP} w={236} h={56} p={pI}>
                <div style={{ width: 236, height: 56, display: "flex", alignItems: "center", justifyContent: "center", gap: 12, fontSize: 22, fontWeight: 500 }}>
                  <div style={{ width: 13, height: 13, borderRadius: 7, background: C.sage, transform: `scale(${1 + 0.3 * Math.sin(t * 6.5)})` }} />Svarer nu
                </div>
              </Island>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── 3. the thread: capsule → queue card "Nr. 12 i kø" counting down to nothing → a dot ─────────────────────────────
  let thread: React.ReactNode = null;
  if (t >= B.collapse + 0.14 && t < B.launch) {
    const app = spr(t, B.collapse + 0.16, 0.4, 0.6);
    const c1 = spr(t, B.card, 0.5, 0.62), cy = mix(CY, CARD_Y, spr(t, B.card, 0.5, 0.8));
    const d = ez(t, B.cardOut, 0.3, INOUT);
    const w1 = mix(PILL_W, 400, c1), h1 = mix(PILL_H, 112, c1), r1 = mix(30, 44, clamp01(c1));
    const dotKick = 1 + 0.6 * Math.max(0, kick(t, L.robot + 0.3, 7, 22));
    const crouch = ez(t, B.launch - 0.12, 0.12, INOUT);   // the dot crouches before it jumps
    const w = mix(w1, DOT, d) * app * dotKick * (1 + 0.28 * crouch), h = mix(h1, DOT, d) * app * dotKick * (1 - 0.3 * crouch), r = mix(r1, DOT / 2, d);
    const white = clamp01(c1 * 1.4) * (1 - d);
    const roll = ez(t, B.roll, 0.72, OUT), v = 12 * (1 - roll);
    const cOp = ez(t, B.card + 0.22, 0.2, OUT) * (1 - ez(t, B.cardOut - 0.06, 0.12, LIN));
    thread = (
      <div style={{ position: "absolute", inset: 0, transform: fl(2.1), transformOrigin: `${CX}px ${CY}px` }}>
        <Blob x={CX} y={cy} w={w} h={h} r={r} color={cmix("#FFFFFF", C.sage, white)} shadow={sh(clamp01((w - DOT) / 140))} border="1" borderO={white} />
        {cOp > 0.01 && (
          <Abs x={CX - 200} y={cy - 56} style={{ width: 400, height: 112, display: "flex", alignItems: "center", justifyContent: "center", gap: 14, opacity: cOp, filter: cOp < 1 ? `blur(${(1 - cOp) * 6}px)` : undefined, fontFamily: SANS, fontSize: 28, fontWeight: 500, color: C.muted }}>
            <span>Nr.</span><QueueStrip v={v} /><span>i kø</span>
          </Abs>
        )}
      </div>
    );
  }
  // "Ingen kø." and "Ingen robotsvar." (one line at a time)
  const lineKo = t >= L.ingen4 - 0.05 && t < B.cardOut + 0.5 ? <Line text="Ingen kø." y={632} p={ez(t, L.ingen4, 0.9, LIN)} out={ez(t, B.cardOut + 0.04, 0.3, INOUT)} italicWords={["kø"]} /> : null;
  const lineRobot = t >= L.ingen5 - 0.05 && t < B.launch + 0.5 ? <Line text="Ingen robotsvar." y={632} p={ez(t, L.ingen5, 1.0, LIN)} out={ez(t, B.launch - 0.2, 0.35, INOUT)} italicWords={["robotsvar"]} /> : null;

  // ── 4. the robot: pops out of the dot, shakes "no", is flicked away ────────────────────────────────────────────────
  let robot: React.ReactNode = null;
  const tf = L.robot + 0.04;
  if (t >= L.ingen5 && t < tf + 0.55) {
    const pop = spr(t, L.ingen5, 0.45, 0.5), x0 = t - (L.ingen5 + 0.3);
    const wob = x0 > 0 ? 11 * Math.sin(x0 * 34) * Math.exp(-x0 * 6) : 0;
    const pull = ez(t, tf - 0.14, 0.14, INOUT), fly = ez(t, tf, 0.5, OUT);
    const dx = -28 * pull + 748 * fly, dy = 10 * pull - 270 * fly;
    const blink = 1 - 0.92 * Math.exp(-Math.pow((t - (L.ingen5 + 0.72)) / 0.045, 2));
    robot = (
      <div style={{ position: "absolute", inset: 0, transform: fl(3.7, 0.7), transformOrigin: `${CX}px ${CY}px` }}>
        <Abs x={CX - 85 + dx} y={CARD_Y - 85 + dy} style={{ opacity: 1 - clamp01((fly - 0.55) / 0.45), transform: `translate(${CX - 85 + dx}px, ${CARD_Y - 85 + dy}px) rotate(${wob + 300 * fly}deg) scale(${Math.max(0, pop) * mix(1, 0.6, fly)})` }}>
          <Robot blink={Math.max(0.05, blink)} />
        </Abs>
      </div>
    );
  }

  // ── 5. Creoble.: the dot flies to the full stop, the letters come out of it right to left ──────────────────────────
  let wm: React.ReactNode = null;
  if (t >= B.launch) {
    const ux = spr(t, B.launch, 0.4, 1), x1 = t - B.launch, lift = 150 * Math.sin(Math.PI * clamp01(x1 / 0.3)), xl = t - B.land;
    const hop = xl > 0 ? 34 * Math.exp(-xl * 6.5) * Math.abs(Math.sin(xl * 15)) : 0;
    const squ = xl > 0 ? Math.exp(-xl * 9) * Math.cos(xl * 24) : 0;
    const ddx = (1 - ux) * (CX - WM_DOT_X), ddy = (1 - ux) * (CARD_Y - WM_DOT_Y) - lift - hop;
    const base = mix(DOT / 18.4, 1, ux), beat = 1 + 0.38 * Math.pow(Math.max(0, Math.sin((t - 46) * 5.3)), 8) * (t > 46 ? 1 : 0);
    const rev = ez(t, B.land - 0.02, 0.8, OUT);
    const sl = spr(t, B.slide, 0.55, 0.72);
    const k0 = WM_VIEW.w / WM_W;
    const bob = t > B.land + 0.5 ? `translateY(${5 * Math.sin(t * 3.4)}px) rotate(${0.9 * Math.sin(t * 2.6)}deg)` : "";
    wm = (
      <div style={{ position: "absolute", left: CX - WM_W / 2, top: CY - WM_H / 2, width: WM_W, height: WM_H, transform: `translateY(${sl * (WM_Y - CY)}px) scale(${mix(1, 0.5, sl)}) ${bob}`, transformOrigin: "50% 50%" }}>
        <div style={{ position: "absolute", inset: 0, WebkitMaskImage: `linear-gradient(270deg, #000 ${rev * 112 - 12}%, transparent ${rev * 112}%)`, maskImage: `linear-gradient(270deg, #000 ${rev * 112 - 12}%, transparent ${rev * 112}%)`,
          transform: `translateX(${-26 * (1 - rev)}px)`, filter: rev < 1 ? `blur(${(1 - rev) * 5}px)` : undefined }}>
          <svg width={WM_W} height={WM_H} viewBox={`0 0 ${WM_VIEW.w} ${WM_VIEW.h}`} style={{ display: "block", overflow: "visible" }}><path d={WM_WORD} fill={C.ink} /></svg>
        </div>
        <svg width={WM_W} height={WM_H} viewBox={`0 0 ${WM_VIEW.w} ${WM_VIEW.h}`} style={{ position: "absolute", left: 0, top: 0, display: "block", overflow: "visible" }}>
          <g style={{ transform: `translate(${ddx * k0}px, ${ddy * k0}px) scale(${base * beat * (1 + 0.4 * squ)}, ${base * beat * (1 - 0.4 * squ)})`, transformOrigin: "7062px 1344px" }}><path d={WM_DOT} fill={C.sage} /></g>
        </svg>
      </div>
    );
  }

  // ── 6+7+8. pills → merge → three step discs → CTA button (one Gooey layer: pills, discs and the button body) ───────
  const gooOn = t >= L.hjem && t < 55.3;
  let goo: React.ReactNode = null, over: React.ReactNode = null;
  if (gooOn) {
    // the three discs ride a travelling wave while they wait for their words (icons and labels follow)
    const wvOn = ez(t, B.split + 0.3, 0.3, OUT) * (1 - ez(t, B.gather - 0.25, 0.2, INOUT));
    const wave = (i: number) => 10 * Math.sin(t * 5.4 - i * 1.25) * wvOn;
    // pills
    const uL = spr(t, L.hjem + 0.04, 0.5, 0.62), uR = spr(t, L.hosting - 0.02, 0.5, 0.58);
    const m = spr(t, B.merge, 0.46, 0.7), kP = 1 + 0.06 * (kick(t, L.t, 8, 26) + kick(t, L.sted, 8, 26));
    const sp = spr(t, B.split, 0.5, 0.62), spm = spr(t, B.split, 0.46, 0.6);
    const gt = spr(t, B.gather, 0.46, 0.9);
    const bg = spr(t, B.byg2 + 0.01, 0.52, 0.62);
    const pLx = mix(CX - 170, CX - 75, m), pRx = mix(CX + 170, CX + 75, m);
    const pWid = 190 * (1 + 0.1 * Math.sin(Math.PI * clamp01(m)));
    const split = t >= B.split;
    // left and right blobs
    const lx = split ? mix(pLx, CX - 200, sp) : pLx, rx = split ? mix(pRx, CX + 200, sp) : pRx;
    const lxx = t >= B.gather ? mix(CX - 200, CX, gt) : lx, rxx = t >= B.gather ? mix(CX + 200, CX, gt) : rx;
    const ly = t < B.split ? mix(STAGE_Y + 80, STAGE_Y, uL) : STAGE_Y + wave(0), ry = t < B.split ? mix(STAGE_Y - 300, STAGE_Y, uR) : STAGE_Y + wave(2);
    const ldx = t < B.merge ? mix(CX - 470, pLx, uL) : lxx, rdx = t < B.merge ? pRx : rxx;
    const lw = split ? mix(pWid, 76, sp) : pWid, lh = split ? mix(70, 76, sp) : 70;
    const dKick = (at: number) => 1 + 0.1 * kick(t, at, 9, 26);
    const showL = uL > 0.001 && t < B.gather + 0.5, showR = uR > 0.001 && t < B.gather + 0.5;
    // middle disc → button body
    const mx = CX, mw = t < B.byg2 ? 76 * spm : mix(76, BTN.w, bg) * (1 - 0.05 * prs(t, B.press) - 0.05 * prs(t, 53.6)), mh = t < B.byg2 ? 76 * spm : mix(76, BTN.h, bg) * (1 - 0.05 * prs(t, B.press) - 0.05 * prs(t, 53.6));
    const mCol = cmix(C.ink, C.sage, clamp01(bg * 1.6));
    const mDisc = t >= B.split && t < B.byg2;
    goo = (
      <div style={{ position: "absolute", left: 260, top: 300, width: 1400, height: 500, filter: "url(#goo)" }}>
        <div style={{ position: "absolute", left: -260, top: -300, width: 1920, height: 1080 }}>
          {showL && <Blob x={ldx} y={ly} w={lw * (t >= B.split ? dKick(L.byg) : kP)} h={lh * (t >= B.split ? dKick(L.byg) : kP)} />}
          {showR && <Blob x={rdx} y={ry} w={lw * (t >= B.split ? dKick(L.s2) : kP)} h={lh * (t >= B.split ? dKick(L.s2) : kP)} />}
          {(mDisc || t >= B.byg2) && <Blob x={mx} y={STAGE_Y + wave(1)} w={mw * (t < B.byg2 ? dKick(L.se) : 1)} h={mh * (t < B.byg2 ? dKick(L.se) : 1)} r={t < B.byg2 ? undefined : 41} color={t < B.byg2 ? C.sage : mCol} />}
        </div>
      </div>
    );

    // texts and icons that ride on the goo (outside the filter)
    const pillTxt = (txt: string, x: number, y: number, at: number) => {
      const o = ez(t, at, 0.22, OUT) * (1 - ez(t, B.merge, 0.2, INOUT));
      return o > 0.01 ? <Abs x={x - 95} y={y - 17} style={{ width: 190, textAlign: "center", fontFamily: SANS, fontWeight: 500, fontSize: 26, color: C.ink, opacity: o, filter: o < 1 ? `blur(${(1 - o) * 6}px)` : undefined, lineHeight: "34px" }}>{txt}</Abs> : null;
    };
    const discs = t >= B.split + 0.1 && t < B.gather + 0.5 ? [
      { x: CX - 200, k: "hammer" as const, at: L.byg, label: "Byg den", w: wave(0) },
      { x: CX, k: "eye" as const, at: L.se, label: "Se den", w: wave(1) },
      { x: CX + 200, k: "check" as const, at: L.s2, label: "Så køber du", w: wave(2) },
    ] : [];
    const sOut = ez(t, B.gather - 0.04, 0.22, INOUT);
    // the CTA text rides on the button
    const reveal = ez(t, B.byg2 + 0.04, 0.62, LIN);
    const ctaOn = t >= B.byg2 + 0.05;
    const pp = Math.max(prs(t, B.press), prs(t, 53.6));
    const sh1 = ez(t, B.press + 0.18, 0.75, INOUT), per = 1.45, ph = ((t - 52.95) % per + per) % per;
    const shine = t < B.press + 0.18 ? 0 : t < B.press + 0.93 ? sh1 : t > 52.95 && ph < 0.75 ? INOUT(ph / 0.75) : 0;
    over = (
      <>
        {pillTxt("Hjemmeside", pLx, ly, L.hjem + 0.3)}
        {pillTxt("Hosting", pRx, ry, L.hosting + 0.22)}
        {t >= B.merge && t < B.split + 0.1 && (
          <Words words={["samlet", "ét", "sted"]} ats={[B.merge + 0.16, L.t, L.sted]} t={t} x={CX} y={STAGE_Y} size={26} out={ez(t, B.split - 0.05, 0.14, LIN)} />
        )}
        {discs.map((d) => {
          const p = spr(t, d.at, 0.42, 0.5) * (1 - sOut);
          return (
            <React.Fragment key={d.k}>
              <Abs x={d.x - 23} y={STAGE_Y - 23 + d.w} style={{ opacity: 1 }}><StepIcon kind={d.k} p={p} t={t} at={d.at} /></Abs>
              <div style={{ position: "absolute", inset: 0, transform: `translateY(${d.w * 0.5}px)` }}><Line text={d.label} x={d.x} y={STAGE_Y + 92} p={ez(t, d.at, 0.55, LIN)} out={sOut} size={26} serif={false} color={C.ink} /></div>
            </React.Fragment>
          );
        })}
        {ctaOn && (
          <>
            <Blob x={CX} y={STAGE_Y} w={mw} h={mh} r={41} color="transparent" shadow={sh(ez(t, 51.0, 0.4, OUT))} />
            <Abs x={CX - BTN.w / 2} y={STAGE_Y - BTN.h / 2} style={{ width: BTN.w, height: BTN.h, WebkitMaskImage: `linear-gradient(90deg, #000 ${reveal * 130 - 30}%, transparent ${reveal * 130}%)`, maskImage: `linear-gradient(90deg, #000 ${reveal * 130 - 30}%, transparent ${reveal * 130}%)`, opacity: ez(t, B.byg2 + 0.04, 0.2, LIN) }}>
              <PillButton text="Byg din side gratis" size={30} press={pp} shine={shine} style={{ width: BTN.w, height: BTN.h, padding: 0, justifyContent: "center", boxSizing: "border-box", background: "transparent", boxShadow: "none" }} />
            </Abs>
            <Line text="creoble.dk" y={STAGE_Y + 100} p={ez(t, L.creoble4, 0.6, LIN)} size={32} serif={false} color={C.sageDeep} />
          </>
        )}
      </>
    );
  }

  // the stage: everything from the wordmark on floats together (a gentle 3D sway), the wordmark adds its own bob
  const late = t >= B.launch;
  return (
    <div style={{ position: "absolute", inset: 0, transform: `scale(${Z})`, transformOrigin: `${CX}px ${CY}px` }}>
      {chat}
      {thread}
      {lineKo}
      {lineRobot}
      {robot}
      {late && (
        <div style={{ position: "absolute", inset: 0, transform: fl(4.4, 0.8), transformOrigin: `${CX}px ${CY}px` }}>
          {wm}
          {goo}
          {over}
        </div>
      )}
    </div>
  );
};

const PILL_W = 200, PILL_H = 60;
