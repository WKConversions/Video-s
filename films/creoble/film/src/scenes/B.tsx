// Scene B (4.10–12.40 s): "Just tell us about your business." / "What you do." / "What you offer." /
// "And what makes you different." / "Then let AI do the rest."
// The builder window rises flat (taking A's wordmark as its logo at frame 143) and turns into a gentle 3D angle. On
// each question one field lifts out of the window toward the camera, types its answer and settles back into its slot
// while the next one lifts, each in its own composition: a centred card that gains a store tile, a high card whose
// typed words drop out as tag chips, a turned editorial card with a leaf drawn beside it. On "Then" the window turns
// flat and recedes, the Build button floats up into focus, a cursor presses it on "AI" and the button becomes the AI
// orb; the answers are pulled out of the dissolving window into it, three task pills come out of it and tick, then
// everything is drawn back in and the orb collapses to a point at (960, 540) by frame 364 (the hand-off to C).
// See ../../../plan/v2-storyboard.md.
import React from "react";
import { AbsoluteFill, Easing } from "remotion";
import { ARRIVE, C, DEPART, MOVE, clamp01, mix } from "../lib";
import { ANSWERS, AnswerChip, Cursor, Ico, Plane, SANS, Say, Wordmark, f, k, typed } from "../shared";
import { off } from "../kinetic";

const PULL = Easing.bezier(0.5, 0, 0.85, 0.45);          // drawn in: slow to leave, quick to arrive
const COLLAPSE = Easing.bezier(0.4, 0, 0.9, 0.6);         // the orb falls in on itself

/* ---------- geometry: the window's own 1400 x 820 coordinates ---------- */
const WW = 1400, WH = 820, COL = 250, COLW = 900, BOX_H = 76;
const BOX_Y = [280, 420, 560];                            // the three answer fields
const BTN = { x: 510, y: 680, w: 380, h: 80 };            // Build my website
const BTN_BIG = { w: 520, h: 104, fs: 34 };               // the button lifted into focus
const ORB_Y = 470;                                        // where the button becomes the orb
const ORB_AT = "w:ai+0.1";                                // the button starts becoming the orb
const ORB_D = 280;                                        // the orb's diameter
type WP = { cx: number; cy: number; rx: number; ry: number; z: number; s: number };
const mixP = (a: WP, b: WP, t: number): WP => ({ cx: mix(a.cx, b.cx, t), cy: mix(a.cy, b.cy, t), rx: mix(a.rx, b.rx, t), ry: mix(a.ry, b.ry, t), z: mix(a.z, b.z, t), s: mix(a.s, b.s, t) });
const rgb = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const mixC = (a: string, b: string, t: number) => { const A = rgb(a), B = rgb(b); return `rgb(${A.map((v, i) => Math.round(mix(v, B[i], t))).join(",")})`; };
const bump = (g: number, at: string | number, dur: number) => Math.sin(Math.PI * clamp01((g - f(at)) / (dur * 30)));
// Where a point of the window lands on screen (the same transform Plane applies), for things that leave the window.
const proj = (p: WP, u: number, v: number) => {
  const x = (u - WW / 2) * p.s, y = (v - WH / 2) * p.s, ry = (p.ry * Math.PI) / 180, rx = ((p.rx + 0.01) * Math.PI) / 180;
  const x1 = x * Math.cos(ry), z1 = -x * Math.sin(ry);
  const y2 = y * Math.cos(rx) - z1 * Math.sin(rx), z2 = y * Math.sin(rx) + z1 * Math.cos(rx) + p.z;
  const q = 2400 / (2400 - z2);
  return { x: p.cx + x1 * q, y: p.cy + y2 * q };
};

/* ---------- the window's path: a camera that finds a new angle for every phrase ---------- */
// rise flat (frame 143) → a gentle 3D tilt → back-left (what you do) → back-right (what you offer) → low, seen from
// above (what makes you different) → flat and back on "Then" → dissolve after "AI". Each pose blends into the next.
const win = (g: number) => {
  const rise = k(g, 4.17, 0.6, ARRIVE);
  let p: WP = { cx: 960, cy: 580 + 320 * (1 - rise), rx: 0, ry: 0, z: 0, s: 1 };
  p = mixP(p, { cx: 960, cy: 580, rx: 6 + 1.5 * k(g, 6.0, 1.2, MOVE), ry: -10 - 3 * k(g, 5.6, 1.2, MOVE), z: -40 * k(g, 5.6, 1.2, MOVE), s: 1 }, k(g, 4.8, 1.5, MOVE));
  p = mixP(p, { cx: 700, cy: 610, rx: 7, ry: mix(19, 15, k(g, 6.4, 1.2, MOVE)), z: -820, s: 1 }, k(g, "w:what2-0.25", 0.95, MOVE));
  p = mixP(p, { cx: 1230, cy: 640, rx: 9, ry: mix(-21, -17, k(g, 7.6, 1.2, MOVE)), z: -840, s: 1 }, k(g, "w:what3-0.2", 1.0, MOVE));
  p = mixP(p, { cx: 960, cy: 770, rx: mix(34, 30, k(g, 8.9, 1.2, MOVE)), ry: mix(2, -7, k(g, 8.4, 1.6, MOVE)), z: -720, s: 1 }, k(g, "w:and-0.2", 1.0, MOVE));
  p = mixP(p, { cx: 960, cy: 800, rx: 0, ry: 0, z: 0, s: 0.62 }, k(g, "w:then-0.15", 0.75, MOVE));
  const diss = k(g, "w:ai+0.08", 0.5, MOVE);
  p.cy += 50 * diss; p.s *= 1 - 0.08 * diss;
  const back = clamp01(-p.z / 700);                     // how far back it has fallen: soft focus and a little dimmer
  return { p, o: rise * (1 - diss), back };
};

/* ---------- the three lifts: each field leaves the window, types, and settles back ---------- */
type Box = { w: number; h: number; dx: number; padL: number; labT: number; ansT: number; fs: number };
const LIFTS: { up: string; down: string; tgt: (g: number) => WP; box: Box }[] = [
  { up: "w:what2-0.15", down: "w:what3-0.26", box: { w: 1100, h: 232, dx: 0, padL: 204, labT: 56, ansT: 102, fs: 50 },
    tgt: (g) => { const d = k(g, "w:what2-0.15", 1.6, MOVE); return { cx: 1000, cy: 536, rx: mix(4, 0, d), ry: mix(-8, 2, d), z: 0, s: mix(0.97, 1.01, d) }; } },
  { up: "w:what3-0.04", down: "w:and-0.24", box: { w: 1100, h: 200, dx: 0, padL: 64, labT: 46, ansT: 92, fs: 50 },
    tgt: (g) => { const d = k(g, "w:what3-0.04", 1.6, MOVE); return { cx: 920, cy: mix(420, 400, d), rx: mix(4, 1, d), ry: mix(8, -2, d), z: 0, s: mix(0.97, 1.0, d) }; } },
  { up: "w:and-0.04", down: "w:then-0.2", box: { w: 920, h: 290, dx: 150, padL: 64, labT: 50, ansT: 96, fs: 52 },
    tgt: (g) => { const d = k(g, "w:and-0.04", 2.0, MOVE); return { cx: 960, cy: 440, rx: mix(7, 2, d), ry: mix(-15, -5, d), z: 0, s: mix(0.96, 1.0, d) }; } },
];
const TYPE = [{ at: "w:what2+0.15", cps: 55 }, { at: "w:what3+0.15", cps: 42 }, { at: "w:and+0.15", cps: 37 }];
const liftT = (g: number, i: number) => { const u = k(g, LIFTS[i].up, 0.8, ARRIVE), d = k(g, LIFTS[i].down, 0.56, MOVE); return { u, d, t: u * (1 - d) }; };
const btnUp = (g: number) => k(g, "w:let-0.12", 0.55, ARRIVE);
const btnPress = (g: number) => bump(g, "w:ai", 0.14);         // a quick 0.1 s press on "AI"
const btnSheen = (g: number) => k(g, "w:let+0.05", 0.42, MOVE); // a light passes over it as it comes into focus
// widths of type in em (Inter, measured), for where a word sits inside a line
const EM = { flour500: 6.5998, flour600: 6.4532, sour: 5.1047, sourComma: 5.6255, sourCakesAnd: 10.5435, cakes: 2.729, catering: 3.8033 };
const CHIPS = [{ t: "Sourdough", pre: 0, w: EM.sour, end: 9, cw: 217 }, { t: "Cakes", pre: EM.sourComma, w: EM.cakes, end: 16, cw: 148 }, { t: "Catering", pre: EM.sourCakesAnd, w: EM.catering, end: 29, cw: 182 }];

/* ---------- one answer field, the same drawing in its slot (t = 0) and lifted (t = 1) ---------- */
const Field: React.FC<{ i: number; t: number; u: number; d: number; txt: string; caret: number; check?: number; co?: number; x: number; y: number; w: number; h: number; children?: React.ReactNode }> = ({ i, t, u, d, txt, caret, check = 0, co = 1, x, y, w, h, children }) => {
  const B = LIFTS[i].box, fs = mix(24, B.fs, t), wt = mix(500, 600, t), ring = u * (1 - d);
  const caretEl = caret > 0 ? <span style={{ display: "inline-block", width: Math.max(2, fs * 0.06), height: fs * 1.02, marginLeft: fs * 0.06, borderRadius: 2, background: C.blue, opacity: caret, verticalAlign: "-0.16em" }} /> : null;
  const text: React.CSSProperties = { position: "absolute", opacity: co, fontFamily: SANS, fontWeight: wt, fontSize: fs, lineHeight: 1.2, letterSpacing: `${mix(-0.01, -0.025, t)}em`, color: C.ink, whiteSpace: "nowrap" };
  const top = mix((BOX_H - 4 - 24 * 1.2) / 2, B.ansT, t), left = mix(26, B.padL, t);
  let body: React.ReactNode;
  if (i === 2) {                                           // two lines when lifted, one in the slot
    const l1 = txt.slice(0, 14), l2 = txt.slice(15);
    const dx = (1 - clamp01((t - 0.22) / 0.23)) * fs * mix(EM.flour500, EM.flour600, (wt - 500) / 100), dy = clamp01(t / 0.22) * fs * 1.18;
    body = <>
      <span style={{ ...text, left, top }}>{l1}{l2 ? null : caretEl}</span>
      {l2 && <span style={{ ...text, left: left + dx, top: top + dy }}>
        <span style={{ position: "absolute", left: 0, right: fs * 0.1, top: fs * 1.08, height: fs * 0.2, borderRadius: fs, opacity: t,
          background: "linear-gradient(90deg, rgba(74,163,245,0.16), rgba(74,163,245,0.7))" }} />
        {l2}{caretEl}</span>}
    </>;
  } else body = <span style={{ ...text, left, top }}>{txt}{caretEl}</span>;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, boxSizing: "border-box", borderRadius: mix(18, 34, t),
      background: mixC("#F4F4F2", "#FFFFFF", u), border: `2px solid ${d > 0 ? mixC(C.blue, C.line, d) : `rgba(74,163,245,${u})`}`,
      boxShadow: `0 0 0 ${7 * ring}px rgba(74,163,245,${0.13 * ring}), 0 ${50 * t}px ${100 * t}px -${36 * t}px rgba(29,29,31,${0.34 * t}), 0 ${12 * t}px ${26 * t}px -${12 * t}px rgba(29,29,31,${0.1 * t})` }}>
      <div style={{ position: "absolute", left: mix(0, B.padL, t), top: mix(-36, B.labT, t), opacity: co, fontFamily: SANS, fontWeight: 500, fontSize: mix(21, 26, t), letterSpacing: "-0.01em", color: C.gray, whiteSpace: "nowrap" }}>{ANSWERS[i].q}</div>
      {body}
      {check > 0 && <div style={{ position: "absolute", right: 22, top: (BOX_H - 4 - 30) / 2, width: 30, height: 30, borderRadius: 15, background: C.blue, display: "flex", alignItems: "center", justifyContent: "center",
        opacity: check, transform: `scale(${0.6 + 0.4 * check})` }}><Ico n="check" s={18} c={C.white} w={3.4} /></div>}
      {children}
    </div>
  );
};

/* ---------- the Build button: in the form, lifted into focus, and the first frame of the orb ---------- */
const BtnFace: React.FC<{ w: number; h: number; fs: number; press?: number; labelO?: number; lift?: number; sheen?: number }> = ({ w, h, fs, press = 0, labelO = 1, lift = 0, sheen = 0 }) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: w, height: h, borderRadius: h / 2, overflow: "hidden", background: mixC(C.blue, C.blueDeep, press),
    boxShadow: `0 ${8 + 22 * lift}px ${22 + 40 * lift}px -${12 + 10 * lift}px rgba(42,134,224,${0.45 + 0.2 * lift})`, transform: `scale(${1 - 0.04 * press})` }}>
    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: fs * 0.42, opacity: labelO,
      fontFamily: SANS, fontWeight: 600, fontSize: fs, letterSpacing: "-0.01em", color: C.white, whiteSpace: "nowrap" }}><Ico n="spark" s={fs * 0.95} c={C.white} w={2.2} />Build my website</div>
    {sheen > 0 && sheen < 1 && <div style={{ position: "absolute", top: -h, left: 0, width: h * 0.9, height: h * 3, transform: `translateX(${mix(-h * 1.5, w + h * 0.5, sheen)}px) rotate(20deg)`,
      background: "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.32) 50%, rgba(255,255,255,0) 100%)" }} />}
  </div>
);

/* ---------- the builder window ---------- */
const TITLE = [{ t: "Tell", at: "w:tell" }, { t: "us", at: "w:us" }, { t: "about", at: "w:about" }, { t: "your", at: "w:your" }, { t: "business", at: "w:business" }];
const BuilderWindow: React.FC<{ g: number }> = ({ g }) => {
  const { p, o, back } = win(g);
  if (o <= 0.003) return null;
  const L = [0, 1, 2].map((i) => liftT(g, i)), bu = btnUp(g);
  const veil = 0.3 * Math.max(back, bu);
  const prog = (L[0].d + L[1].d + L[2].d) / 3;
  const sub = k(g, "w:business+0.15", 0.7), btn = k(g, 5.24, 0.75);
  return (
    <Plane x={p.cx} y={p.cy} w={WW} h={WH} rx={p.rx} ry={p.ry} z={p.z} s={p.s} o={o} style={back > 0.02 ? { filter: `blur(${3.2 * back}px)` } : undefined}>
      <div style={{ position: "absolute", inset: 0, borderRadius: 28, background: C.white, overflow: "hidden",
        boxShadow: "0 0 0 1px rgba(29,29,31,0.06), 0 70px 130px -60px rgba(29,29,31,0.42), 0 24px 50px -32px rgba(29,29,31,0.2)" }}>
        {/* app bar: the logo is A's wordmark from frame 143 */}
        <div style={{ position: "absolute", left: 0, top: 0, width: WW, height: 64, borderBottom: `1px solid ${C.line}`, boxSizing: "border-box" }}>
          <div style={{ position: "absolute", right: 36, top: 21, fontFamily: SANS, fontWeight: 500, fontSize: 18, color: C.gray }}>Step 1 of 2</div>
          <div style={{ position: "absolute", left: 0, top: 61, height: 3, width: WW * prog, background: C.blue, borderRadius: 2 }} />
        </div>
        {g >= 143 && <Wordmark x={90} y={32} size={28} dot={1} />}
        {/* title: the voice's words */}
        <div style={{ position: "absolute", left: 0, top: 108, width: WW, display: "flex", justifyContent: "center", gap: 48 * 0.26, fontFamily: SANS, fontWeight: 600, fontSize: 48, letterSpacing: "-0.03em", color: C.ink, lineHeight: 1.1 }}>
          {TITLE.map((w, i) => { const kk = k(g, w.at, 0.8); return <span key={i} style={{ display: "inline-block", opacity: Math.min(1, kk * 1.4), transform: `translateY(${(1 - kk) * 14}px)`, filter: kk < 1 ? `blur(${(1 - kk) * 8}px)` : undefined }}>{w.t}</span>; })}
        </div>
        <div style={{ position: "absolute", left: 0, top: 180, width: WW, textAlign: "center", fontFamily: SANS, fontWeight: 400, fontSize: 22, color: C.gray, opacity: sub, transform: `translateY(${(1 - sub) * 12}px)` }}>We build your website from your answers.</div>
        {/* the fields */}
        {ANSWERS.map((a, i) => {
          const ap = k(g, 4.62 + 0.14 * i, 0.75), l = L[i];
          const lifted = l.u > 0 && l.d < 1;
          const out = k(g, chipAt(i), 0.12);                  // the answer leaves as a chip after "AI"
          const filled = l.d >= 1, check = k(g, off(LIFTS[i].down, 0.65), 0.4);
          return <div key={i} style={{ position: "absolute", left: 0, top: 0, opacity: ap, transform: `translateY(${(1 - ap) * 22}px)` }}>
            {lifted ? <div style={{ position: "absolute", left: COL, top: BOX_Y[i], width: COLW, height: BOX_H, boxSizing: "border-box", borderRadius: 18, border: "2px dashed rgba(74,163,245,0.35)", background: "#F8FAFC" }} />
              : <div style={{ opacity: 1 - out }}><Field i={i} t={0} u={filled ? 1 : 0} d={filled ? 1 : 0} txt={filled ? a.a : ""} caret={0} check={filled ? check : 0}
                co={filled ? mix(0.35, 1, k(g, off(LIFTS[i].down, 0.56), 0.35)) : 1} x={COL} y={BOX_Y[i]} w={COLW} h={BOX_H} /></div>}
          </div>;
        })}
        <div style={{ position: "absolute", left: BTN.x, top: BTN.y, width: BTN.w, height: BTN.h, opacity: btn, transform: `translateY(${(1 - btn) * 22}px)` }}>
          {bu > 0 ? <div style={{ position: "absolute", inset: 0, borderRadius: BTN.h / 2, border: "2px dashed rgba(74,163,245,0.35)", boxSizing: "border-box" }} />
            : <BtnFace w={BTN.w} h={BTN.h} fs={22} />}
        </div>
        <div style={{ position: "absolute", inset: 0, background: C.cream, opacity: veil }} />
      </div>
    </Plane>
  );
};

/* ---------- a lifted field, with its own detail ---------- */
const LiftCard: React.FC<{ g: number; i: number }> = ({ g, i }) => {
  const { u, d, t } = liftT(g, i);
  if (u <= 0 || d >= 1) return null;
  const W = win(g), D = LIFTS[i], B = D.box, P = mixP(W.p, D.tgt(g), t);
  const co = d > 0 ? 1 - 0.65 * (i < 2 ? liftT(g, i + 1).u : btnUp(g)) : 1;   // dims as the next one passes in front
  const blur = (1 - t) * 3.2 * W.back;                 // it leaves the soft-focus window and sharpens (and back)
  const x = mix(COL, 700 + B.dx - B.w / 2, t), y = mix(BOX_Y[i], 410 - B.h / 2, t), w = mix(COLW, B.w, t), h = mix(BOX_H, B.h, t);
  const ans = ANSWERS[i].a, txt = d > 0 ? ans : typed(g, TYPE[i].at, ans, TYPE[i].cps);
  const typing = txt.length < ans.length;
  const caret = clamp01(u * 2 - 1) * (1 - clamp01(d * 5)) * (typing ? 1 : 0.55 + 0.45 * Math.cos((g - f(TYPE[i].at)) / 4.2));
  const fs = mix(24, B.fs, t), padL = mix(26, B.padL, t), top = mix((BOX_H - 4 - 24 * 1.2) / 2, B.ansT, t);
  const cx = x + w / 2, cy = y + h / 2;
  // 1 · the store tile pops in on "do"
  const pop = i === 0 ? k(g, "w:do", 0.6, ARRIVE) : 0, ts = 116 * mix(0.6, 1, pop) * t;
  // 3 · the leaf, drawn beside the card
  const la = i === 2 ? k(g, "w:makes", 0.7, ARRIVE) : 0, dl = k(g, "w:makes+0.05", 0.9, MOVE), dv = k(g, "w:different", 0.5, MOVE);
  const lx = mix(x + 30, 700 + B.dx - B.w / 2 - 190, t), ly = mix(cy, 410, t), lsz = 250 * mix(0.2, 1, t) * mix(0.86, 1, la);
  return (
    <Plane x={P.cx} y={P.cy} w={WW} h={WH} rx={P.rx} ry={P.ry} z={P.z} s={P.s} style={blur > 0.05 ? { filter: `blur(${blur}px)` } : undefined}>
      {la > 0 && <>
        <div style={{ position: "absolute", left: lx - lsz, top: ly - lsz, width: lsz * 2, height: lsz * 2, borderRadius: "50%", opacity: la * t * (0.85 + 0.15 * Math.sin(g / 9)),
          background: "radial-gradient(circle, rgba(74,163,245,0.26) 0%, rgba(74,163,245,0.08) 38%, rgba(74,163,245,0) 66%)" }} />
        <div style={{ position: "absolute", left: lx - lsz / 2, top: ly - lsz / 2, width: lsz, height: lsz, borderRadius: "50%", opacity: la * clamp01(t * 1.5),
          background: "radial-gradient(circle at 34% 28%, #FFFFFF 0%, #F2F8FF 46%, #DCEDFD 100%)", boxShadow: "0 0 0 1.5px rgba(74,163,245,0.22), 0 30px 60px -30px rgba(42,134,224,0.5)",
          display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width={lsz * 0.54} height={lsz * 0.54} viewBox="0 0 48 48" fill="none" stroke={C.blueDeep} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 38 C10 20 22 10 40 9 C39 27 29 38 12 38" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - dl} />
            <path d="M10 38 L26 22" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - dv} />
          </svg>
        </div>
      </>}
      <Field i={i} t={t} u={u} d={d} txt={txt} caret={caret} co={co} x={x} y={y} w={w} h={h}>
        {i === 0 && pop > 0 && <>
          <div style={{ position: "absolute", left: 50 * t + 58 - ts / 2, top: (h - 4) / 2 - ts / 2, width: ts, height: ts, borderRadius: ts * 0.28, opacity: pop * clamp01(t * 1.5),
            background: "linear-gradient(150deg, #F4F9FF 0%, #DCEDFD 100%)", boxShadow: "inset 0 0 0 1.5px rgba(74,163,245,0.22)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Ico n="store" s={ts * 0.5} c={C.blueDeep} w={2.1} />
          </div>
          {pop < 1 && <div style={{ position: "absolute", left: 50 * t + 58 - ts * 0.75, top: (h - 4) / 2 - ts * 0.75, width: ts * 1.5, height: ts * 1.5, borderRadius: ts * 0.4,
            border: `2px solid rgba(74,163,245,${0.4 * (1 - pop)})`, transform: `scale(${0.7 + 0.3 * pop})`, boxSizing: "border-box" }} />}
        </>}
      </Field>
      {/* 2 · each offer drops out of the typed line as a chip */}
      {i === 1 && CHIPS.map((c, j) => {
        const pAt = off(TYPE[1].at, c.end / TYPE[1].cps), p = k(g, pAt, 0.65, ARRIVE);
        if (p <= 0) return null;
        const sx = x + 2 + padL + fs * (c.pre + c.w / 2), sy = y + 2 + top + fs * 0.6;
        const rowL = 700 - (217 + 148 + 182 + 2 * 18) / 2, tx = rowL + CHIPS.slice(0, j).reduce((a, q) => a + q.cw + 18, 0) + c.cw / 2, ty = y + h + 64;
        const px = mix(cx, mix(sx, tx, p), t), py = mix(cy, mix(sy, ty, p), t), sc = mix(0.55, 1, p) * mix(0.3, 1, t);
        return <div key={j} style={{ position: "absolute", left: px, top: py, transform: `translate(-50%, -50%) scale(${sc})`, opacity: clamp01(p * 3) * clamp01(t * 1.6),
          height: 62, padding: "0 30px", borderRadius: 31, background: C.blueTint, boxShadow: "inset 0 0 0 1.5px rgba(74,163,245,0.3), 0 14px 28px -16px rgba(42,134,224,0.45)",
          display: "flex", alignItems: "center", fontFamily: SANS, fontWeight: 600, fontSize: 30, letterSpacing: "-0.01em", color: C.blueDeep, whiteSpace: "nowrap" }}>{c.t}</div>;
      })}
    </Plane>
  );
};

/* ---------- the button lifted into focus, the cursor, the press ---------- */
const BtnLift: React.FC<{ g: number }> = ({ g }) => {
  const bu = btnUp(g);
  if (bu <= 0 || g >= f(ORB_AT)) return null;
  const P = mixP(win(g).p, { cx: 960, cy: ORB_Y, rx: 0, ry: 0, z: 0, s: 1 }, bu);
  const w = mix(BTN.w, BTN_BIG.w, bu), h = mix(BTN.h, BTN_BIG.h, bu);
  const x = mix(BTN.x, 700 - BTN_BIG.w / 2, bu), y = mix(BTN.y, 410 - BTN_BIG.h / 2, bu);
  return (
    <Plane x={P.cx} y={P.cy} w={WW} h={WH} rx={P.rx} ry={P.ry} z={P.z} s={P.s}>
      <div style={{ position: "absolute", left: x, top: y, width: w, height: h }}>
        <BtnFace w={w} h={h} fs={mix(22, BTN_BIG.fs, bu)} press={btnPress(g)} lift={bu} sheen={btnSheen(g)} />
      </div>
    </Plane>
  );
};
const CursorB: React.FC<{ g: number }> = ({ g }) => {
  const a = k(g, "w:let-0.16", 0.5, ARRIVE), e = k(g, "w:ai+0.12", 0.36, MOVE);
  if (a <= 0 || e >= 1) return null;
  const bx = 1100, by = ORB_Y + 18;                       // the tip rests on the button's right half
  const x = mix(mix(1540, 1290, a), bx, a) + 160 * e, y = mix(1150, by, a) + 230 * e;
  return <Cursor x={x} y={y} s={1.3} o={clamp01(a * 3) * (1 - e)} press={btnPress(g)} />;
};

/* ---------- AI at work: the orb, the answers drawn in, the task pills ---------- */
const chipAt = (i: number) => off("w:ai", 0.04 + 0.05 * i);
const orbPos = (g: number) => ({ x: 960, y: mix(ORB_Y, 540, k(g, 11.4, 0.66, MOVE)) });   // at (960, 540) from frame 362
const PILLS = [
  { t: "Writing your texts", at: "w:do2+0.14", x: 530, y: 420 },
  { t: "Choosing colours and fonts", at: "w:the", x: 1400, y: 520 },
  { t: "Building your pages", at: "w:rest", x: 960, y: 800 },
];
const ABSORB = [0, 1, 2].map((i) => chipAt(i) + 0.1 + 0.44);    // when each answer reaches the orb

// the press: a soft blue ripple off the button
const Ripple: React.FC<{ g: number }> = ({ g }) => {
  const rp = k(g, "w:ai", 0.7, ARRIVE);
  if (rp <= 0 || rp >= 1) return null;
  return <div style={{ position: "absolute", left: 960 - BTN_BIG.w / 2, top: ORB_Y - BTN_BIG.h / 2, width: BTN_BIG.w, height: BTN_BIG.h, borderRadius: BTN_BIG.h / 2, boxSizing: "border-box",
    border: `3px solid rgba(74,163,245,${0.55 * (1 - rp)})`, background: `rgba(74,163,245,${0.08 * (1 - rp)})`, transform: `scale(${1 + 0.4 * rp}, ${1 + 1.1 * rp})` }} />;
};

const AnswerFlight: React.FC<{ g: number; i: number }> = ({ g, i }) => {
  const at = chipAt(i), lift = k(g, at, 0.22, ARRIVE), pull = k(g, at + 0.1, 0.44, PULL);
  if (lift <= 0 || pull >= 1) return null;
  const W0 = win(f(at)).p, s0 = proj(W0, 700, BOX_Y[i] + BOX_H / 2), o = orbPos(g);
  const side = [-1, 1, -1][i] * 170;
  const sx = s0.x, sy = s0.y - 14 * lift, cx1 = sx + side, cy1 = sy - 70;
  const q = pull, x = (1 - q) * (1 - q) * sx + 2 * q * (1 - q) * cx1 + q * q * o.x, y = (1 - q) * (1 - q) * sy + 2 * q * (1 - q) * cy1 + q * q * o.y;
  const sc = mix(W0.s, 1, lift) * mix(1, 0.12, Math.pow(q, 1.4));
  return <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) scale(${sc})`, opacity: clamp01(lift * 4) * (1 - clamp01((q - 0.78) / 0.22)) }}>
    <AnswerChip icon={ANSWERS[i].icon} text={ANSWERS[i].a} size={26} />
  </div>;
};

const Pill: React.FC<{ g: number; i: number }> = ({ g, i }) => {
  const P = PILLS[i], e = k(g, P.at, 0.6, ARRIVE), tk = k(g, off(P.at, 0.3), 0.32, ARRIVE), lv = k(g, 11.68 + 0.02 * i, 0.26, PULL);
  if (e <= 0 || lv >= 1) return null;
  const o = orbPos(g), drift = (g - f(P.at)) * 0.0016;                 // the pills ride a slow orbit
  const ang = Math.atan2(P.y - ORB_Y, P.x - 960) + drift, rad = Math.hypot(P.x - 960, P.y - ORB_Y);
  const tx = o.x + Math.cos(ang) * rad, ty = o.y + Math.sin(ang) * rad;
  const x = mix(o.x, tx, e * (1 - lv)), y = mix(o.y, ty, e * (1 - lv)), sc = mix(0.45, 1, e) * mix(1, 0.2, lv);
  return <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) scale(${sc})`, opacity: clamp01(e * 2.5) * (1 - lv * lv),
    display: "flex", alignItems: "center", gap: 15, padding: "15px 30px 15px 15px", borderRadius: 999, background: C.white,
    boxShadow: `0 0 0 ${1 + 1.5 * bump(g, off(P.at, 0.3), 0.5)}px rgba(74,163,245,${0.12 + 0.5 * bump(g, off(P.at, 0.3), 0.5)}), 0 20px 44px -20px rgba(29,29,31,0.3)`,
    fontFamily: SANS, fontWeight: 600, fontSize: 29, letterSpacing: "-0.015em", color: C.ink, whiteSpace: "nowrap" }}>
    <div style={{ position: "relative", width: 40, height: 40 }}>
      <svg width={40} height={40} viewBox="0 0 40 40" style={{ position: "absolute", inset: 0, opacity: 1 - tk, transform: `rotate(${(g - f(P.at)) * 16}deg)` }}>
        <circle cx={20} cy={20} r={16} stroke={C.blueTint} strokeWidth={4} fill="none" />
        <circle cx={20} cy={20} r={16} stroke={C.blue} strokeWidth={4} fill="none" strokeLinecap="round" strokeDasharray="28 100" />
      </svg>
      <div style={{ position: "absolute", inset: 0, borderRadius: 20, background: C.blue, display: "flex", alignItems: "center", justifyContent: "center", opacity: tk, transform: `scale(${0.5 + 0.5 * tk})` }}>
        <Ico n="check" s={22} c={C.white} w={3.4} />
      </div>
    </div>
    {P.t}
  </div>;
};

const Orb: React.FC<{ g: number }> = ({ g }) => {
  if (g < f(ORB_AT)) return null;
  const m = k(g, ORB_AT, 0.5, MOVE), col = k(g, 11.97, 0.15, COLLAPSE), gone = k(g, 12.12, 0.13, MOVE);
  if (gone >= 1) return null;
  const o = orbPos(g);
  const w = mix(BTN_BIG.w, ORB_D, m), h = mix(BTN_BIG.h, ORB_D, m);
  const pulse = ABSORB.reduce((a, t) => a + 0.07 * bump(g, t - 0.02, 0.3), 0) + PILLS.reduce((a, P) => a + 0.035 * bump(g, P.at, 0.3), 0);
  const sc = (1 + 0.025 * Math.sin((g - f(ORB_AT)) / 7) * m + pulse) * mix(1, 0.04, col) * (1 + 0.6 * col * (1 - col));
  const ring = k(g, off(ORB_AT, 0.25), 0.8, ARRIVE) * (1 - k(g, 11.68, 0.3, MOVE));
  const hot = col;                                                      // the orb turns white-hot as it collapses
  return (
    <>
      {/* the glow and the turning ring */}
      <div style={{ position: "absolute", left: o.x - 370, top: o.y - 370, width: 740, height: 740, borderRadius: "50%", opacity: m * (1 - gone) * mix(1, 0.5, col),
        transform: `scale(${mix(1, 0.12, col) * (1 + pulse)})`, background: "radial-gradient(circle, rgba(74,163,245,0.30) 0%, rgba(74,163,245,0.12) 34%, rgba(74,163,245,0) 64%)" }} />
      {ring > 0 && <svg width={460} height={460} viewBox="0 0 460 460" style={{ position: "absolute", left: o.x - 230, top: o.y - 230, opacity: ring, transform: `scale(${mix(0.8, 1, ring)}) rotate(${(g - f(ORB_AT)) * 2.2}deg)` }}>
        <defs><linearGradient id="bring" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={C.blue} stopOpacity={0.9} /><stop offset="1" stopColor={C.blue} stopOpacity={0} /></linearGradient></defs>
        <circle cx={230} cy={230} r={194} stroke="rgba(74,163,245,0.16)" strokeWidth={1.5} fill="none" />
        <circle cx={230} cy={230} r={194} stroke="url(#bring)" strokeWidth={3} fill="none" strokeLinecap="round" strokeDasharray="470 800" />
        <circle cx={230} cy={36} r={5} fill={C.blue} />
      </svg>}
      {/* the body: the button, rounding into a sphere */}
      <div style={{ position: "absolute", left: o.x - w / 2, top: o.y - h / 2, width: w, height: h, borderRadius: h / 2, opacity: 1 - gone, transform: `scale(${sc})`,
        boxShadow: `0 0 ${mix(30, 70, m)}px ${mix(0, 8, m)}px rgba(74,163,245,${0.4 * m}), 0 ${mix(30, 40, m)}px ${mix(62, 80, m)}px -${mix(22, 30, m)}px rgba(42,134,224,${0.5 * m})` }}>
        <BtnFace w={w} h={h} fs={BTN_BIG.fs} lift={1} labelO={1 - clamp01(m * 2.6)} press={btnPress(g)} sheen={btnSheen(g)} />
        <div style={{ position: "absolute", inset: 0, borderRadius: h / 2, overflow: "hidden", opacity: m }}>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 34% 28%, #FFFFFF 0%, #E4F2FE 16%, #A9D3FA 42%, #5FAEF6 70%, #2A86E0 100%)" }} />
          <div style={{ position: "absolute", left: "-25%", top: "-25%", width: "150%", height: "150%", opacity: 0.55, mixBlendMode: "soft-light", transform: `rotate(${(g - f(ORB_AT)) * 3}deg)`,
            background: "conic-gradient(from 0deg, rgba(255,255,255,0) 0deg, rgba(255,255,255,0.9) 60deg, rgba(255,255,255,0) 140deg, rgba(42,134,224,0.8) 220deg, rgba(255,255,255,0) 320deg)" }} />
          <div style={{ position: "absolute", inset: 0, borderRadius: "50%", boxShadow: "inset 0 -18px 40px rgba(42,134,224,0.35), inset 0 10px 26px rgba(255,255,255,0.55)" }} />
          <div style={{ position: "absolute", inset: 0, background: C.white, opacity: hot }} />
        </div>
        {/* the button's spark becomes the orb's light */}
        {m > 0 && m < 1 && <div style={{ position: "absolute", left: w / 2 - 30, top: h / 2 - 30, opacity: Math.sin(Math.PI * m) * 0.9, transform: `scale(${1 + 1.4 * m})` }}><Ico n="spark" s={60} c={C.white} w={2} /></div>}
      </div>
      {/* the bright point it collapses into: exactly (960, 540) at frame 364, gone by 368 */}
      {col > 0 && <div style={{ position: "absolute", left: o.x - 9, top: o.y - 9, width: 18, height: 18, borderRadius: 9, background: C.white, opacity: col * (1 - gone),
        transform: `scale(${mix(2.2, 1, col) * (1 - 0.5 * gone)})`, boxShadow: `0 0 14px 6px rgba(255,255,255,0.9), 0 0 40px 16px rgba(74,163,245,${0.55 * col})` }} />}
    </>
  );
};

/* ---------- the scene ---------- */
export const SceneB: React.FC<{ g: number }> = ({ g }) => {
  if (g < f(4.1) || g > f(12.4)) return null;
  const sayOut = k(g, 11.7, 0.3, DEPART);
  return (
    <AbsoluteFill>
      <BuilderWindow g={g} />
      <LiftCard g={g} i={0} />
      <LiftCard g={g} i={1} />
      <LiftCard g={g} i={2} />
      <Ripple g={g} />
      <BtnLift g={g} />
      {[0, 1, 2].map((i) => <AnswerFlight key={i} g={g} i={i} />)}
      {[0, 1, 2].map((i) => <Pill key={i} g={g} i={i} />)}
      <Orb g={g} />
      {g >= f("w:then-0.1") && sayOut < 1 && <div style={{ position: "absolute", inset: 0, opacity: 1 - sayOut, transform: `translateY(${-22 * sayOut}px)`, filter: sayOut > 0 ? `blur(${sayOut * 8}px)` : undefined }}>
        <Say g={g} y={92} size={68} words={[{ t: "Then", at: "w:then" }, { t: "let", at: "w:let" }, { t: "AI", at: "w:ai", blue: true }, { t: "do", at: "w:do2" }, { t: "the", at: "w:the" }, { t: "rest.", at: "w:rest" }]} />
      </div>}
      <CursorB g={g} />
    </AbsoluteFill>
  );
};
