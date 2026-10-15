// Scene A (0–4.85 s): "What if building a website was this simple?" / "Meet Creoble." See ../../../plan/v2-storyboard.md.
// 1 · The question builds word by word while website-building clutter swims in around it in shallow 3D, every piece
//     busy with its own fiddly task (code typing, a font being tweaked, swatches being picked, sliders nudged).
// 2 · On "simple" the clutter implodes: each card folds into a blue droplet and is drawn into the "?", becoming its dot.
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
const IN = Easing.bezier(0.4, 0, 0.75, 0.45);         // the clutter accelerates into the dot
const LAND = Easing.bezier(0.33, 0, 0.12, 1);          // the dot's carry to its place as the full stop
const SWING = Easing.bezier(0.3, 0.25, 0.25, 1);        // the wordmark's swing: opens steadily, settles long
const LIGHTBLUE = "#9DCCF8";                           // a paler step of the accent (syntax strings, inside the code card)
const MONO = "'DejaVu Sans Mono', 'Liberation Mono', monospace";

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

/* ---------- the clutter: website-building pieces, each busy ---------- */
type Piece = { id: string; x: number; y: number; z: number; w: number; h: number; rx: number; ry: number; rz: number; at: string; ph: number; ord: number; r: number; bg: string };
const PIECES: Piece[] = [
  { id: "code", x: 330, y: 205, z: 40, w: 360, h: 210, rx: 8, ry: 16, rz: -3, at: "w:building", ph: 0.0, ord: 1, r: 22, bg: C.ink },
  { id: "layout", x: 1600, y: 860, z: 30, w: 300, h: 210, rx: -10, ry: -18, rz: 3, at: "w:building+0.14", ph: 1.3, ord: 8, r: 22, bg: C.white },
  { id: "type", x: 1650, y: 215, z: -100, w: 200, h: 200, rx: 10, ry: -20, rz: 4, at: "w:a", ph: 2.1, ord: 4, r: 26, bg: C.white },
  { id: "palette", x: 340, y: 870, z: 0, w: 300, h: 116, rx: -12, ry: 14, rz: -2, at: "w:website", ph: 0.7, ord: 2, r: 26, bg: C.white },
  { id: "image", x: 1150, y: 170, z: -180, w: 250, h: 184, rx: 12, ry: -8, rz: 2, at: "w:website+0.12", ph: 2.8, ord: 5, r: 22, bg: C.white },
  { id: "sliders", x: 190, y: 560, z: -60, w: 214, h: 170, rx: 4, ry: 24, rz: -4, at: "w:was", ph: 1.9, ord: 0, r: 22, bg: C.white },
  { id: "toggle", x: 1020, y: 920, z: 70, w: 264, h: 84, rx: -14, ry: 8, rz: 2, at: "w:was+0.12", ph: 0.4, ord: 7, r: 42, bg: C.white },
  { id: "picker", x: 1700, y: 600, z: 40, w: 168, h: 150, rx: 4, ry: -22, rz: 2, at: "w:this", ph: 3.3, ord: 6, r: 22, bg: C.white },
  { id: "tile", x: 700, y: 150, z: -240, w: 110, h: 110, rx: 14, ry: 10, rz: -6, at: "w:this+0.1", ph: 1.1, ord: 3, r: 30, bg: C.blueTint },
];
const F = 1800;                                        // the clutter camera's focal length (px)
const COLLAPSE = 1.78, C_STAGGER = 0.012;              // on "simple"; the far pieces leave first and take longer
const cDur = (p: Piece) => 0.3 + 0.14 * clamp01(Math.hypot(p.x - Q_DOT.x, p.y - Q_DOT.y) / 1150);
const collapseLin = (t: number, p: Piece) => clamp01((t - (COLLAPSE + p.ord * C_STAGGER)) / cDur(p));
const C_DONE = Math.max(...PIECES.map((p) => COLLAPSE + p.ord * C_STAGGER + cDur(p)));

// A value that steps through a list on a beat, each step a short MOVE (UI state changing, never a jump).
const hop = (t: number, period: number, n: number, ph = 0) => {
  const u = t / period + ph, i = Math.floor(u), fr = MOVE(clamp01((u - i) / 0.45));
  return { a: ((i % n) + n) % n, b: (((i + 1) % n) + n) % n, t: fr };
};

const CODE: [string, string][][] = [
  [[C.blue, "<nav"], [C.light, " class="], [LIGHTBLUE, '"menu"'], [C.blue, ">"]],
  [[C.blue, "  <a"], [C.light, " href="], [LIGHTBLUE, '"/"'], [C.blue, ">"], ["#F2F2F0", "Home"], [C.blue, "</a>"]],
  [[C.blue, "  <a"], [C.light, " href="], [LIGHTBLUE, '"/shop"'], [C.blue, ">"], ["#F2F2F0", "Shop"], [C.blue, "</a>"]],
  [[C.blue, "</nav>"]],
  [["#F2F2F0", ".menu"], [C.light, " { "], [LIGHTBLUE, "gap"], [C.light, ": "], ["#F2F2F0", "24px"], [C.light, " }"]],
];

const PieceBody: React.FC<{ p: Piece; t: number; t0: number }> = ({ p, t, t0 }) => {
  const lt = t - t0;                                   // seconds since it arrived
  if (p.id === "code") {
    let n = Math.floor(Math.max(0, lt) * 72);
    return (
      <div style={{ position: "absolute", inset: 0, padding: "18px 22px", boxSizing: "border-box" }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>{[0, 1, 2].map((i) => <div key={i} style={{ width: 11, height: 11, borderRadius: 6, background: "#3A3A3E" }} />)}</div>
        {CODE.map((line, li) => {
          const segs: React.ReactNode[] = [];
          let caretHere = false;
          for (let si = 0; si < line.length; si++) {
            const [col, txt] = line[si];
            const take = Math.max(0, Math.min(txt.length, n));
            n -= take;
            if (take > 0) segs.push(<span key={si} style={{ color: col }}>{txt.slice(0, take)}</span>);
            if (take < txt.length && !caretHere) { caretHere = true; break; }
          }
          return (
            <div key={li} style={{ height: 26, display: "flex", alignItems: "center", fontFamily: MONO, fontSize: 16, whiteSpace: "pre" }}>
              {segs}{caretHere && segs.length > 0 && <span style={{ width: 2, height: 19, marginLeft: 1, background: C.blue }} />}
            </div>
          );
        })}
      </div>
    );
  }
  if (p.id === "layout") {
    const r = 0.5 + 0.13 * Math.sin(t * 2.4 + p.ph);
    const W = p.w - 32, hx = 16, hy = 42, hh = 84, colY = 140, colH = 52;
    const rects = [[hx, hy, W * r - 6, hh], [hx + W * r + 6, hy, W * (1 - r) - 6, hh], [hx, colY, W / 3 - 8, colH], [hx + W / 3 + 4, colY, W / 3 - 8, colH], [hx + (2 * W) / 3 + 8, colY, W / 3 - 8, colH]];
    const h = hop(t, 0.42, rects.length, p.ph);
    const A = rects[h.a], B = rects[h.b];
    const sel = [0, 1, 2, 3].map((i) => mix(A[i], B[i], h.t));
    return (
      <div style={{ position: "absolute", inset: 0 }}>
        <div style={{ position: "absolute", left: 16, top: 16, width: W, height: 14, borderRadius: 7, background: "#ECECEA", display: "flex", alignItems: "center", gap: 5, paddingLeft: 7, boxSizing: "border-box" }}>
          {[0, 1, 2].map((i) => <div key={i} style={{ width: 5, height: 5, borderRadius: 3, background: C.light }} />)}</div>
        <div style={{ position: "absolute", left: rects[0][0], top: hy, width: rects[0][2], height: hh, borderRadius: 10, background: C.fill, padding: 12, boxSizing: "border-box" }}>
          {[0.9, 0.7, 0.45].map((wd, i) => <div key={i} style={{ width: `${wd * 100}%`, height: i === 0 ? 11 : 7, borderRadius: 4, background: i === 0 ? "#D8D8D6" : "#E3E3E1", marginBottom: 8 }} />)}</div>
        <div style={{ position: "absolute", left: rects[1][0], top: hy, width: rects[1][2], height: hh, borderRadius: 10, background: C.blueTint, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Ico n="image" s={30} c={C.blue} w={2} /></div>
        {[2, 3, 4].map((i) => <div key={i} style={{ position: "absolute", left: rects[i][0], top: colY, width: rects[i][2], height: colH, borderRadius: 9, background: C.fill }} />)}
        <div style={{ position: "absolute", left: sel[0] - 4, top: sel[1] - 4, width: sel[2] + 8, height: sel[3] + 8, borderRadius: 12, border: `2.5px solid ${C.blue}`, boxSizing: "border-box" }} />
      </div>
    );
  }
  if (p.id === "type") {
    const wv = 0.5 + 0.5 * Math.sin(t * 3.0 + p.ph);
    return (
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 22, boxSizing: "border-box" }}>
        <div style={{ fontFamily: SERIF, fontWeight: Math.round(mix(330, 680, wv)), fontSize: 90, lineHeight: 1, color: C.ink, letterSpacing: "-0.02em", height: 96 }}>Aa</div>
        <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 15, color: C.gray, marginTop: 10 }}>Weight {Math.round(mix(300, 700, wv) / 10) * 10}</div>
        <div style={{ position: "relative", width: 140, height: 4, borderRadius: 2, background: C.line, marginTop: 14 }}>
          <div style={{ position: "absolute", left: 0, top: 0, width: 140 * wv, height: 4, borderRadius: 2, background: C.blue }} />
          <div style={{ position: "absolute", left: 140 * wv - 9, top: -7, width: 18, height: 18, borderRadius: 9, background: C.white, boxShadow: "0 0 0 1px rgba(29,29,31,0.1), 0 2px 5px rgba(29,29,31,0.2)" }} />
        </div>
      </div>
    );
  }
  if (p.id === "palette") {
    const sw = [C.blue, C.blueDeep, C.blueTint, C.ink, "#CFE6FC"];
    const h = hop(t, 0.46, sw.length, p.ph);
    const x0 = 96, gap = 40;
    const sx = mix(x0 + h.a * gap, x0 + h.b * gap, h.t);
    return (
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", paddingLeft: 22, boxSizing: "border-box" }}>
        <div style={{ width: 56, height: 56, borderRadius: 16, background: C.blueTint, display: "flex", alignItems: "center", justifyContent: "center" }}><Ico n="palette" s={30} c={C.blueDeep} w={2.2} /></div>
        {sw.map((c, i) => <div key={i} style={{ position: "absolute", left: x0 + i * gap, top: p.h / 2 - 14, width: 28, height: 28, borderRadius: 14, background: c, boxShadow: c === C.blueTint || c === "#CFE6FC" ? `inset 0 0 0 1px ${C.line}` : undefined }} />)}
        <div style={{ position: "absolute", left: sx - 5, top: p.h / 2 - 19, width: 38, height: 38, borderRadius: 19, border: `2.5px solid ${C.blue}`, boxSizing: "border-box" }} />
      </div>
    );
  }
  if (p.id === "image") {
    const up = ss(0, 1.4, lt);
    return (
      <div style={{ position: "absolute", inset: 0, padding: 14, boxSizing: "border-box" }}>
        <div style={{ height: 108, borderRadius: 14, background: C.blueTint, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", position: "relative" }}>
          <Ico n="image" s={46} c={C.blue} w={2} />
          <div style={{ position: "absolute", left: 0, top: 0, width: `${up * 100}%`, height: "100%", background: "linear-gradient(90deg, rgba(74,163,245,0) 0%, rgba(74,163,245,0.16) 100%)" }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: SANS, fontWeight: 500, fontSize: 15, color: C.gray, marginTop: 12 }}><span>hero.jpg</span><span>{Math.round(up * 100)}%</span></div>
        <div style={{ height: 5, borderRadius: 3, background: C.fill, marginTop: 8 }}><div style={{ width: `${up * 100}%`, height: 5, borderRadius: 3, background: C.blue }} /></div>
      </div>
    );
  }
  if (p.id === "sliders") {
    return (
      <div style={{ position: "absolute", inset: 0, padding: "20px 22px", boxSizing: "border-box" }}>
        {["Size", "Spacing", "Radius"].map((lab, i) => {
          const v = 0.5 + 0.36 * Math.sin(t * (2.1 + i * 0.7) + p.ph + i * 1.9);
          return (
            <div key={lab} style={{ marginBottom: 14 }}>
              <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 14, color: C.gray, marginBottom: 8 }}>{lab}</div>
              <div style={{ position: "relative", height: 4, borderRadius: 2, background: C.line }}>
                <div style={{ position: "absolute", left: 0, top: 0, width: `${v * 100}%`, height: 4, borderRadius: 2, background: C.blue }} />
                <div style={{ position: "absolute", left: `calc(${v * 100}% - 8px)`, top: -6, width: 16, height: 16, borderRadius: 8, background: C.white, boxShadow: "0 0 0 1px rgba(29,29,31,0.1), 0 2px 5px rgba(29,29,31,0.2)" }} />
              </div>
            </div>
          );
        })}
      </div>
    );
  }
  if (p.id === "toggle") {
    const on = ss(-0.35, 0.35, Math.sin(t * 4.4 + p.ph));
    return (
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 18px 0 30px", boxSizing: "border-box" }}>
        <span style={{ fontFamily: SANS, fontWeight: 600, fontSize: 21, color: C.ink, letterSpacing: "-0.01em" }}>Sticky header</span>
        <div style={{ position: "relative", width: 60, height: 36, borderRadius: 18, background: on > 0.5 ? C.blue : C.line, transition: "none" }}>
          <div style={{ position: "absolute", inset: 0, borderRadius: 18, background: C.blue, opacity: on }} />
          <div style={{ position: "absolute", left: mix(3, 27, on), top: 3, width: 30, height: 30, borderRadius: 15, background: C.white, boxShadow: "0 2px 6px rgba(29,29,31,0.22)" }} />
        </div>
      </div>
    );
  }
  if (p.id === "picker") {
    const u = 0.5 + 0.38 * Math.sin(t * 2.3 + p.ph), v = 0.5 + 0.34 * Math.sin(t * 3.1 + p.ph * 2);
    const hv = 0.5 + 0.4 * Math.sin(t * 1.7 + p.ph);
    return (
      <div style={{ position: "absolute", inset: 0, padding: 13, boxSizing: "border-box" }}>
        <div style={{ position: "relative", height: 92, borderRadius: 12, overflow: "hidden", background: `linear-gradient(90deg, ${C.white} 0%, ${C.blue} 100%)` }}>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(42,134,224,0) 0%, rgba(26,82,140,0.85) 100%)" }} />
          <div style={{ position: "absolute", left: u * 142 - 9, top: v * 92 - 9, width: 18, height: 18, borderRadius: 9, border: `3px solid ${C.white}`, boxSizing: "border-box", boxShadow: "0 1px 4px rgba(29,29,31,0.35)" }} />
        </div>
        <div style={{ position: "relative", height: 10, borderRadius: 5, marginTop: 14, background: `linear-gradient(90deg, ${C.blueTint} 0%, ${C.blue} 55%, ${C.blueDeep} 100%)` }}>
          <div style={{ position: "absolute", left: hv * 142 - 9, top: -4, width: 18, height: 18, borderRadius: 9, background: C.white, boxShadow: "0 0 0 1px rgba(29,29,31,0.1), 0 2px 5px rgba(29,29,31,0.25)" }} />
        </div>
      </div>
    );
  }
  // tile: the code sign
  return <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}><Ico n="code" s={54} c={C.blueDeep} w={2.2} /></div>;
};

const PieceView: React.FC<{ g: number; p: Piece; tgt: [number, number] }> = ({ g, p, tgt }) => {
  const t = sec(g);
  const a = k(g, p.at, 0.9);
  const cl = collapseLin(t, p);
  if (a <= 0 || cl >= 1) return null;
  const c = IN(cl);
  // where it floats: projected from its depth, with the slow dolly and a drift
  const cz = 150 * clamp01(t / 1.9);
  const zz = p.z - (1 - a) * 480 + cz;
  const sp = F / (F - zz);
  const dx = 12 * Math.sin(t * 0.8 + p.ph * 2), dy = 9 * Math.sin(t * 0.65 + p.ph * 3 + 1);
  const px = 960 + (p.x + dx - 960) * sp, py = 540 + (p.y + dy - 540) * sp;
  // where it goes: a gentle curve into the dot of the "?"
  const vx = tgt[0] - px, vy = tgt[1] - py, L = Math.max(1, Math.hypot(vx, vy));
  const qx = (px + tgt[0]) / 2 - (vy / L) * L * 0.16, qy = (py + tgt[1]) / 2 + (vx / L) * L * 0.16;
  const x = (1 - c) * (1 - c) * px + 2 * (1 - c) * c * qx + c * c * tgt[0];
  const y = (1 - c) * (1 - c) * py + 2 * (1 - c) * c * qy + c * c * tgt[1];
  const flat = 1 - ss(0, 0.45, cl);
  const rx = (p.rx + 3.5 * Math.sin(t * 0.5 + p.ph * 1.7) + (1 - a) * 14) * flat;
  const ry = (p.ry + 5 * Math.sin(t * 0.55 + p.ph) + (1 - a) * 26 * (p.ry < 0 ? -1 : 1)) * flat;
  const rz = p.rz * flat;
  // it folds into a blue droplet
  const m = ss(0.08, 0.5, cl), d = Math.min(p.w, p.h);
  const sw = mix(p.w, d, m), sh = mix(p.h, d, m), rr = mix(p.r, d / 2, m);
  const sc = lerpLog(sp, 11 / d, Math.pow(c, 0.8));      // it shrinks as it travels: big while slow, a droplet when fast
  const onScreen = Math.max(sw, sh) * sc;               // it turns blue only once it is small: a droplet, not a blue card
  const dark = p.bg === C.ink;
  const blur = (1 - a) * (dark ? 5 : 8) + (p.z < -150 ? 1.2 : 0) * (1 - c);
  const o = Math.min(1, a * (dark ? 2.4 : 1.6)) * (1 - ss(0.94, 1, cl));
  return (
    <div style={{ position: "absolute", left: x - p.w / 2, top: y - p.h / 2, width: p.w, height: p.h, opacity: o,
      transform: `perspective(1400px) rotateX(${rx + 0.01}deg) rotateY(${ry}deg) rotateZ(${rz}deg) scale(${sc})`, filter: blur > 0.3 ? `blur(${blur}px)` : undefined }}>
      <div style={{ position: "absolute", left: (p.w - sw) / 2, top: (p.h - sh) / 2, width: sw, height: sh, borderRadius: rr, overflow: "hidden", background: p.bg,
        boxShadow: `0 0 0 1px rgba(29,29,31,${0.05 * (1 - m)}), 0 24px 48px -24px rgba(29,29,31,${0.32 * (1 - m)})` }}>
        <div style={{ position: "absolute", left: -(p.w - sw) / 2, top: -(p.h - sh) / 2, width: p.w, height: p.h, opacity: 1 - ss(0, 0.28, cl) }}>
          <PieceBody p={p} t={Math.min(t, COLLAPSE + p.ord * C_STAGGER)} t0={T.s(p.at)} />
        </div>
        <div style={{ position: "absolute", inset: 0, background: C.blue, opacity: Math.max(1 - ss(30, 110, onScreen), dark ? ss(0.04, 0.3, cl) : ss(0.12, 0.48, cl)) }} />
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
      {/* 1 · the clutter, behind the question */}
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
