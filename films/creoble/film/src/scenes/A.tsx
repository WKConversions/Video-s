// Scene A (0–4.85 s): "What if building a website was this simple?" / "Meet Creoble." See ../../../plan/v2-storyboard.md.
// 1 · The question builds word by word while five calm, light cards (type, colour, layout, image, code) swim in around
//     it, one per word, and drift slowly in shallow 3D in the open space above and below the type (v3: no dark cards).
// 2 · On "simple" the pieces collapse: each card folds into a blue droplet and is drawn into the "?", becoming its dot.
// 3 · The question rises away; the dot glides to the centre and glows; "Meet" tracks in above it.
// 4 · On "creoble" the wordmark swings open out of the dot (hinged at its full stop), letter by letter, while the dot
//     slides right to become that full stop and settles; the word tightens its tracking; a push and a slow truck.
// 5 · Hand-off (frames 119–142): the wordmark lifts and shrinks, then slides (MOVE) into the builder window's app bar
//     as the window rises beneath it. At frame 142 this scene draws exactly <Wordmark x={350} y={202} size={28} dot={1} />
//     (the shared component), which scene B draws from frame 143; this scene draws nothing after 142. The scene's root
//     sits at zIndex 3 so the flying mark passes over B's rising window (B is later in Story.tsx's order).
import React from "react";
import { AbsoluteFill, Easing } from "remotion";
import { ARRIVE, C, DEPART, MOVE, clamp01, mix } from "../lib";
import { T } from "../clock";
import { Ico, SANS, SERIF, Wordmark, k } from "../shared";

const sec = (g: number) => g / 30;
const ss = (a: number, b: number, x: number) => { const t = clamp01((x - a) / (b - a)); return t * t * (3 - 2 * t); };
const lerpLog = (a: number, b: number, t: number) => Math.exp(mix(Math.log(a), Math.log(b), t));
const IN = Easing.bezier(0.4, 0, 0.75, 0.45);         // the pieces accelerate into the dot
const LAND = Easing.bezier(0.33, 0, 0.12, 1);          // the dot's carry to its place as the full stop
const SWING = Easing.bezier(0.3, 0.25, 0.25, 1);        // the wordmark's swing: opens steadily, settles long

/* ---------- the question ---------- */
const QS = 108;                                        // the question's size
const Y1 = 383, Y2 = 511;                              // tops of its two lines
const Q_DOT = { x: 1331, y: 600, d: 17 };              // the "?" dot (unpushed frame), measured on Inter 600 at 108 px
const push1 = (t: number) => 0.955 + 0.09 * clamp01(t / 2.7);    // the push on the question (tension builds with the clutter)
const OUT1 = 2.3, OUT2 = 2.36;                        // the lines leave (blur-rise), word by word

type QW = { t: string; at: string | number; blue?: boolean; q?: boolean };
const LINE1: QW[] = [{ t: "What", at: 0 }, { t: "if", at: "w:if" }, { t: "building", at: "w:building" }, { t: "a", at: "w:a" }, { t: "website", at: "w:website" }];
const LINE2: QW[] = [{ t: "was", at: "w:was" }, { t: "this", at: "w:this" }, { t: "simple", at: "w:simple", blue: true, q: true }];

const QLine: React.FC<{ g: number; words: QW[]; y: number; out: number; stagger: number }> = ({ g, words, y, out, stagger }) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: 1920, display: "flex", justifyContent: "center", gap: QS * 0.26, transform: `translateY(${y}px)`,
    fontFamily: SANS, fontWeight: 600, fontSize: QS, letterSpacing: "-0.035em", lineHeight: 1.08, color: C.ink, whiteSpace: "nowrap" }}>
    {words.map((w, i) => {
      const kk = k(g, w.at, 0.9);
      const o = k(g, out + i * stagger, 0.36, DEPART);
      if (kk <= 0 || o >= 1) return <span key={i} style={{ display: "inline-block", opacity: 0 }}>{w.t}{w.q ? "?" : ""}</span>;
      return (
        <span key={i} style={{ display: "inline-block", color: w.blue ? C.blue : undefined, opacity: Math.min(1, kk * 1.4) * (1 - o),
          transform: `translateY(${(1 - kk) * QS * 0.28 - o * QS * 0.24}px)`, filter: kk < 1 || o > 0 ? `blur(${(1 - kk) * 10 + o * 9}px)` : undefined }}>
          {w.t}{w.q && <span style={{ display: "inline-block", clipPath: "inset(-30px -30px 40px -30px)" }}>?</span>}
        </span>
      );
    })}
  </div>
);

/* ---------- the pieces: five calm, light cards, one idea each ---------- */
// White, frosted, hairline-edged cards with a soft shadow. Each carries one idea and one blue detail (type, colour,
// layout, image, code), with at most one gentle change after it lands. They drift slowly in shallow 3D around the
// question, in the open space above and below it, never over the type.
type Piece = { id: string; x: number; y: number; z: number; w: number; h: number; rx: number; ry: number; rz: number; at: string; ph: number; ord: number; r: number };
const PIECES: Piece[] = [
  { id: "type", x: 440, y: 205, z: 30, w: 196, h: 196, rx: 7, ry: 12, rz: -2, at: "w:building", ph: 0.0, ord: 0, r: 40 },
  { id: "code", x: 1110, y: 175, z: -120, w: 140, h: 140, rx: 8, ry: -6, rz: 3, at: "w:a", ph: 2.1, ord: 2, r: 34 },
  { id: "colour", x: 1560, y: 230, z: 0, w: 292, h: 132, rx: 8, ry: -13, rz: 2, at: "w:website", ph: 1.3, ord: 3, r: 40 },
  { id: "layout", x: 520, y: 875, z: -50, w: 292, h: 204, rx: -7, ry: 12, rz: 2, at: "w:was", ph: 0.7, ord: 1, r: 30 },
  { id: "image", x: 1520, y: 845, z: 30, w: 276, h: 196, rx: -8, ry: -12, rz: -2, at: "w:this", ph: 2.8, ord: 4, r: 30 },
];
const F = 1800;                                        // the pieces' camera focal length (px)
const COLLAPSE = 1.78, C_STAGGER = 0.025;              // on "simple"; the far pieces leave first and take longer
const cDur = (p: Piece) => 0.32 + 0.14 * clamp01(Math.hypot(p.x - Q_DOT.x, p.y - Q_DOT.y) / 1150);
const collapseLin = (t: number, p: Piece) => clamp01((t - (COLLAPSE + p.ord * C_STAGGER)) / cDur(p));
const C_DONE = Math.max(...PIECES.map((p) => COLLAPSE + p.ord * C_STAGGER + cDur(p)));
const PALE = "#CFE6FC";                                // a paler step of the accent

const PieceBody: React.FC<{ p: Piece; lt: number }> = ({ p, lt }) => {
  const d = (at: number, dur = 0.6) => ARRIVE(clamp01((lt - at) / dur));   // the card's one gentle change, after it lands
  if (p.id === "type") {
    return (
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontWeight: 600, fontSize: 92, letterSpacing: "-0.03em", color: C.ink, lineHeight: 1, paddingBottom: 6, boxSizing: "border-box" }}>
        A<span style={{ color: C.blue }}>a</span>
      </div>
    );
  }
  if (p.id === "code") {
    return <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}><Ico n="code" s={64} c={C.blueDeep} w={2.1} /></div>;
  }
  if (p.id === "colour") {
    const ring = d(0.5, 0.7);                           // the middle swatch is picked
    const S = 58, GAP = 26, x0 = (p.w - (3 * S + 2 * GAP)) / 2;
    return (
      <div style={{ position: "absolute", inset: 0 }}>
        {[C.blueTint, C.blue, C.blueDeep].map((c, i) => (
          <div key={i} style={{ position: "absolute", left: x0 + i * (S + GAP), top: p.h / 2 - S / 2, width: S, height: S, borderRadius: S / 2, background: c, boxShadow: i === 0 ? `inset 0 0 0 1px ${PALE}` : undefined }} />
        ))}
        <div style={{ position: "absolute", left: x0 + S + GAP - 7, top: p.h / 2 - S / 2 - 7, width: S + 14, height: S + 14, borderRadius: (S + 14) / 2, border: `2.5px solid ${C.blue}`, boxSizing: "border-box",
          opacity: ring, transform: `scale(${1.18 - 0.18 * ring})` }} />
      </div>
    );
  }
  if (p.id === "layout") {
    const hero = d(0.35, 0.8);                          // the hero block draws itself across the page
    const W = p.w - 40;
    return (
      <div style={{ position: "absolute", inset: 0 }}>
        <div style={{ position: "absolute", left: 20, top: 20, width: W * 0.42, height: 10, borderRadius: 5, background: C.line }} />
        <div style={{ position: "absolute", left: 20, top: 46, width: mix(W * 0.3, W, hero), height: 72, borderRadius: 14, background: C.blueTint, boxShadow: `inset 0 0 0 1.5px ${C.blue}` }} />
        {[0, 1].map((i) => <div key={i} style={{ position: "absolute", left: 20 + i * (W / 2 + 6), top: 130, width: W / 2 - 6, height: 54, borderRadius: 12, background: C.fill }} />)}
      </div>
    );
  }
  // image: a soft, blue-only photograph whose sun rises a little
  const sun = d(0.2, 1.4);
  const iw = p.w - 28, ih = p.h - 28;
  return (
    <div style={{ position: "absolute", left: 14, top: 14, width: iw, height: ih, borderRadius: 18, overflow: "hidden", background: `linear-gradient(180deg, ${C.blueTint} 0%, ${PALE} 100%)` }}>
      <div style={{ position: "absolute", left: iw * 0.64, top: mix(ih * 0.42, ih * 0.2, sun), width: 34, height: 34, borderRadius: 17, background: C.white, boxShadow: "0 0 24px 6px rgba(255,255,255,0.7)" }} />
      <svg width={iw} height={ih} viewBox={`0 0 ${iw} ${ih}`} style={{ position: "absolute", left: 0, top: 0 }}>
        <path d={`M0 ${ih * 0.74} C ${iw * 0.22} ${ih * 0.5}, ${iw * 0.4} ${ih * 0.52}, ${iw * 0.62} ${ih * 0.72} S ${iw * 0.9} ${ih * 0.7}, ${iw} ${ih * 0.62} V ${ih} H 0 Z`} fill={C.blue} opacity={0.45} />
        <path d={`M0 ${ih * 0.86} C ${iw * 0.3} ${ih * 0.72}, ${iw * 0.6} ${ih * 0.8}, ${iw} ${ih * 0.76} V ${ih} H 0 Z`} fill={C.blueDeep} opacity={0.75} />
      </svg>
    </div>
  );
};

const PieceView: React.FC<{ g: number; p: Piece; tgt: [number, number] }> = ({ g, p, tgt }) => {
  const t = sec(g);
  const a = k(g, p.at, 1.0);
  const cl = collapseLin(t, p);
  if (a <= 0 || cl >= 1) return null;
  const c = IN(cl);
  // where it floats: projected from its depth, with a slow dolly and a slow drift
  const cz = 130 * clamp01(t / 1.9);
  const zz = p.z - (1 - a) * 360 + cz;
  const sp = F / (F - zz);
  const dx = 10 * Math.sin(t * 0.7 + p.ph * 2), dy = 8 * Math.sin(t * 0.55 + p.ph * 3 + 1);
  const px = 960 + (p.x + dx - 960) * sp, py = 540 + (p.y + dy - 540) * sp;
  // where it goes: a gentle curve into the dot of the "?"
  const vx = tgt[0] - px, vy = tgt[1] - py, L = Math.max(1, Math.hypot(vx, vy));
  const qx = (px + tgt[0]) / 2 - (vy / L) * L * 0.16, qy = (py + tgt[1]) / 2 + (vx / L) * L * 0.16;
  const x = (1 - c) * (1 - c) * px + 2 * (1 - c) * c * qx + c * c * tgt[0];
  const y = (1 - c) * (1 - c) * py + 2 * (1 - c) * c * qy + c * c * tgt[1];
  const flat = 1 - ss(0, 0.45, cl);
  const rx = (p.rx + 2.5 * Math.sin(t * 0.45 + p.ph * 1.7) + (1 - a) * 12) * flat;
  const ry = (p.ry + 3.5 * Math.sin(t * 0.5 + p.ph) + (1 - a) * 20 * (p.ry < 0 ? -1 : 1)) * flat;
  const rz = p.rz * flat;
  // it folds into a blue droplet
  const m = ss(0.08, 0.5, cl), d = Math.min(p.w, p.h);
  const sw = mix(p.w, d, m), sh = mix(p.h, d, m), rr = mix(p.r, d / 2, m);
  const sc = lerpLog(sp, 11 / d, Math.pow(c, 0.8));      // it shrinks as it travels: big while slow, a droplet when fast
  const onScreen = Math.max(sw, sh) * sc;               // it turns blue only once it is small: a droplet, not a blue card
  const blur = (1 - a) * 8 + (p.z < -150 ? 0.8 : 0) * (1 - c);
  const o = Math.min(1, a * 1.6) * (1 - ss(0.94, 1, cl));
  return (
    <div style={{ position: "absolute", left: x - p.w / 2, top: y - p.h / 2, width: p.w, height: p.h, opacity: o,
      transform: `perspective(1400px) rotateX(${rx + 0.01}deg) rotateY(${ry}deg) rotateZ(${rz}deg) scale(${sc})`, filter: blur > 0.3 ? `blur(${blur}px)` : undefined }}>
      <div style={{ position: "absolute", left: (p.w - sw) / 2, top: (p.h - sh) / 2, width: sw, height: sh, borderRadius: rr, overflow: "hidden",
        background: "linear-gradient(180deg, rgba(255,255,255,0.97) 0%, rgba(255,255,255,0.86) 100%)",
        boxShadow: `inset 0 1px 0 rgba(255,255,255,${1 - m}), 0 0 0 1px rgba(29,29,31,${0.06 * (1 - m)}), 0 30px 60px -30px rgba(29,29,31,${0.26 * (1 - m)}), 0 8px 20px -14px rgba(29,29,31,${0.12 * (1 - m)})` }}>
        <div style={{ position: "absolute", left: -(p.w - sw) / 2, top: -(p.h - sh) / 2, width: p.w, height: p.h, opacity: 1 - ss(0, 0.28, cl) }}>
          <PieceBody p={p} lt={Math.min(t, COLLAPSE + p.ord * C_STAGGER) - T.s(p.at)} />
        </div>
        <div style={{ position: "absolute", inset: 0, background: C.blue, opacity: Math.max(1 - ss(30, 110, onScreen), ss(0.12, 0.48, cl)) }} />
      </div>
    </div>
  );
};

// A soft bloom ring (a band of light blue, not a line) widening out of the dot and fading.
const Bloom: React.FC<{ x: number; y: number; r0: number; r1: number; k: number; a?: number }> = ({ x, y, r0, r1, k: kk, a = 1 }) => {
  if (kk <= 0 || kk >= 1) return null;
  const R = mix(r0, r1, ARRIVE(kk));
  return <div style={{ position: "absolute", left: x - R, top: y - R, width: 2 * R, height: 2 * R, borderRadius: "50%", opacity: a * Math.pow(1 - kk, 1.6),
    background: "radial-gradient(circle, rgba(74,163,245,0) 48%, rgba(74,163,245,0.26) 64%, rgba(74,163,245,0.10) 78%, rgba(74,163,245,0) 92%)" }} />;
};

/* ---------- Meet Creoble ---------- */
const WM = 200;                                        // the wordmark's size in the reveal
const WM_Y = 540;                                      // its centre (the period sits at +296, +60)
const DOT_DX = 296, DOT_DY = 60, DOT_D = 26;           // the period at 200 px: offset from the wordmark centre, diameter
// the push on "Meet Creoble"; it keeps running under the flight, which blends out of it (no hitch in the scale at frame 119)
const push2 = (t: number) => 0.97 + 0.07 * Math.max(0, t - 2.75) / 1.42;
const drift = (t: number) => -16 + 32 * Math.max(0, t - 2.9) / 1.27;   // and a slow truck right, through the flight's start too
const REVEAL = 3.18;                                   // the dot starts pulling the word out (just before "creoble")
// The hand-off flight, frames 119 → 142 (3.97 → 4.73 s): it starts a beat before B's window rises (4.17) so the mark is
// already up and small, above the window's content, while the window comes up beneath it; height and size lead (LIFT),
// the sideways carry is a MOVE: a lift, then a slide into the app bar.
const FLY0 = 119, FLY1 = 142;
const LIFT = Easing.bezier(0.4, 0, 0.2, 1);
const SNAP = 0;                                        // native text snaps its baseline; matches the scaled build at the switch

export const SceneA: React.FC<{ g: number }> = ({ g }) => {
  if (g < 0 || g > FLY1) return null;
  const t = sec(g);

  /* the question */
  const S1 = push1(t);
  const simpleK = k(g, "w:simple", 0.9);
  const qdot: [number, number] = [960 + (Q_DOT.x - 960) * S1, 540 + (Q_DOT.y + (1 - simpleK) * QS * 0.28 - 540) * S1];

  /* the dot */
  const P2 = push2(t);
  const fill = PIECES.reduce((s, p) => s + ss(0.9, 1, collapseLin(t, p)), 0) / PIECES.length;
  const done = C_DONE;
  const absorb = Math.sin(Math.PI * clamp01((t - done + 0.06) / 0.42));
  const glide = k(g, 2.42, 0.56, MOVE);
  const E = LAND(clamp01((t - REVEAL) / 0.6));
  const track = 13 * (1 - ss(3.3, 3.96, t));           // the word unfurls a little loose and tightens to its exact spacing
  const dotLX = 960 + E * (DOT_DX + 4 * track);         // the dot slides right, pulling the word out of itself
  const Gx = dotLX - (960 + DOT_DX + 4 * track);        // the word rides with the dot
  const localDot: [number, number] = [dotLX, WM_Y + DOT_DY];
  const DR = drift(t);
  const centreDot: [number, number] = [960 + DR + (localDot[0] - 960) * P2, 540 + (localDot[1] - 540) * P2];
  const dx = mix(qdot[0], centreDot[0], glide), dy = mix(qdot[1], centreDot[1], glide) + 46 * Math.sin(Math.PI * glide);
  const breathe = 1 + 0.4 * ss(2.95, 3.18, t) * (1 - ss(3.18, 3.46, t));   // it gathers itself, then draws in as it pulls the word out
  const settle = k(g, 3.6, 0.26);
  const dSize = mix(Q_DOT.d * S1, mix(30, DOT_D, settle) * P2, glide) * Math.sqrt(fill) * (1 + 0.22 * absorb) * breathe;
  const glow = ss(2.15, 2.4, t) * (1 - ss(3.5, 3.82, t));
  const toGlyph = ss(3.8, 3.93, t);                     // the circle hands over to the full-stop glyph (at rest, before the flight)
  const ringA = clamp01((t - (C_DONE - 0.04)) / 0.8);    // a soft bloom ring as the dot absorbs the clutter
  const ringB = clamp01((t - 2.86) / 0.7);              // and a wider, passing one as it lands at the centre, on "meet"
  const flare = Math.sin(Math.PI * clamp01((t - 3.56) / 0.32));   // a soft flare as the full stop settles
  const swing = -50 * (1 - SWING(clamp01((t - REVEAL) / 0.7)));   // the word swings open out of the dot, hinged at the full stop

  /* Meet */
  const mk = k(g, 2.84, 0.9), mo = k(g, 3.8, 0.32, DEPART);

  /* the mark: one letter-by-letter structure from the reveal to the hand-off */
  const flying = g >= FLY0;
  const fl = clamp01((g - FLY0) / (FLY1 - FLY0)), fx = MOVE(fl), fy = LIFT(fl);
  const end = g === FLY1;                               // frame 142: exactly scene B's <Wordmark x={350} y={202} size={28} />
  const mSize = flying ? lerpLog(P2 * WM, 28, fy) : WM;
  const mX = flying ? mix(960 + DR, 350, fx) : 960 + DR + Gx * P2;
  const mY = flying ? mix(540, 202, fy) - SNAP * (1 - ss(0, 0.3, fl)) : 540 + (WM_Y - 540) * P2;
  const u = mSize / WM;

  return (
    <AbsoluteFill style={{ zIndex: 3, pointerEvents: "none" }}>
      {/* 1 · the pieces, behind the question */}
      {t < 2.5 && PIECES.map((p) => <PieceView key={p.id} g={g} p={p} tgt={qdot} />)}

      {/* 1 · the question */}
      {t < 3.0 && (
        <AbsoluteFill style={{ transform: `scale(${S1})`, transformOrigin: "960px 540px" }}>
          <QLine g={g} words={LINE1} y={Y1} out={OUT1} stagger={0.025} />
          <QLine g={g} words={LINE2} y={Y2} out={OUT2} stagger={0.035} />
        </AbsoluteFill>
      )}

      {/* 2 · the dot: its bloom, the ping on "meet", the dot itself */}
      {fill > 0 && !flying && (
        <>
          <div style={{ position: "absolute", left: dx - 170, top: dy - 170, width: 340, height: 340, borderRadius: "50%", opacity: Math.max(glow * (0.55 + 0.25 * absorb + 0.3 * (breathe - 1) / 0.4), 0.6 * flare),
            background: "radial-gradient(circle, rgba(74,163,245,0.26) 0%, rgba(74,163,245,0.10) 38%, rgba(74,163,245,0) 70%)" }} />
          <Bloom x={qdot[0]} y={qdot[1]} r0={14} r1={250} k={ringA} />
          <Bloom x={960 + DR} y={540 + (WM_Y + DOT_DY - 540) * P2} r0={24} r1={540} k={ringB} a={0.75} />
          <div style={{ position: "absolute", left: dx - dSize / 2, top: dy - dSize / 2, width: dSize, height: dSize, borderRadius: "50%", background: C.blue, opacity: 1 - toGlyph,
            boxShadow: glow > 0 ? `0 0 ${18 * glow}px ${4 * glow}px rgba(74,163,245,${0.45 * glow})` : undefined }} />
        </>
      )}

      {/* 3 · Meet */}
      {t > 2.8 && mo < 1 && (
        <div style={{ position: "absolute", left: 0, top: 348, width: 1920, textAlign: "center", fontFamily: SANS, fontWeight: 500, fontSize: 58, lineHeight: 1.08, color: C.gray,
          letterSpacing: `${mix(0.2, -0.01, ss(2.84, 3.95, t))}em`, opacity: Math.min(1, mk * 1.4) * (1 - mo), transformOrigin: "960px 192px",
          transform: `translate(${0.6 * DR}px, ${(1 - mk) * 18 - mo * 16}px) scale(${P2})`, filter: mk < 1 || mo > 0 ? `blur(${(1 - mk) * 9 + mo * 8}px)` : undefined }}>Meet</div>
      )}

      {/* 3 · Creoble. — unfurled out of the dot, then (4) flown into the builder's app bar. Before the flight it is drawn
          at 200 px and pushed with a transform (smooth); in the flight its real font size animates, so Fraunces' optical
          size lands exactly on scene B's 28 px logo. Letter spans keep the kerning of the plain Wordmark (checked). */}
      {end && <Wordmark x={350} y={202} size={28} dot={1} />}
      {t >= REVEAL && !end && (
        <div style={{ position: "absolute", left: 0, top: 0, transformOrigin: "0 0", transform: flying ? undefined : `translate(${mX}px, ${mY}px) scale(${P2})` }}>
          <div style={{ position: "absolute", left: 0, top: 0, fontFamily: SERIF, fontWeight: 500, fontSize: mSize, letterSpacing: "-0.02em", color: C.ink, whiteSpace: "nowrap", lineHeight: 1,
            transform: `${flying ? `translate(${mX}px, ${mY}px)` : "translate(0px, 0px)"} translate(-50%, -50%)${swing < -0.01 ? ` perspective(1500px) rotateY(${swing}deg)` : ""}`,
            transformOrigin: `calc(50% + ${(DOT_DX + 4 * track) * u}px) ${(WM / 2 + DOT_DY) * u}px` }}>
            {"Creoble".split("").map((ch, i) => {
              const j = 6 - i;                         // right to left, out of the dot
              const p = k(g, REVEAL + 0.04 + j * 0.05, 0.45);
              const lx = ((1 - p) * 34 + (i - 3) * track) * u, ly = (1 - p) * 18 * u;
              return <span key={i} style={{ position: "relative", left: lx, top: ly, opacity: Math.min(1, p * 1.6), filter: p < 1 ? `blur(${(1 - p) * 9 * u}px)` : undefined }}>{ch}</span>;
            })}
            <span style={{ display: "inline-block", position: "relative", left: 4 * track * u, color: C.blue, transform: "scale(1)", transformOrigin: "50% 80%", opacity: toGlyph }}>.</span>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
