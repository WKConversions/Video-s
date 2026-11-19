// Package R03 · reference f188–f264 · cuts f192, f196, f200, f205, f254
// F  four filmed flash cuts (F1–F4) · G  the caret alone, then "Can you help" typed · H  the macro letters, two crops.
// Timed on the reference frame by frame (tools/ref.py, dark-pixel boxes): local t = (reference frame − 188) / 24.
import React from "react";
import type { Pkg } from "../types";
import { Footage, Fringe, Ground, rs, useFonts } from "../kit";

const F0 = 188;
const at = (n: number) => rs(n - F0);                 // local seconds of a reference frame
const EPS = 1e-6;
const reached = (t: number, n: number) => t + EPS >= at(n);
const frameNo = (t: number) => Math.floor(t * 60 + 0.25); // whole film frame, safe for either half-frame phase
const count = (keys: number[], t: number) => { let k = 0; while (k < keys.length && reached(t, keys[k])) k++; return k; };
const INK = "#1F2A3A";

// ---------------------------------------------------------------- F: four filmed flash cuts
// The clips are 24 / 25 fps. At their own speed in a 60 fps film each drawing would stay 2, 3, 2, 3 frames (a judder the
// shake check reads as jumps). So each clip advances ON TWOS: one drawing per two film frames (played at 30 drawings a
// second, 1.2–1.25 × its speed), and the small push steps with the drawing, so a held frame is truly held.
const FLASH: [string, number, number][] = [["F1", 188, 23.976], ["F2", 192, 23.976], ["F3", 196, 25], ["F4", 200, 25]];
const Flash: React.FC<{ t: number }> = ({ t }) => {
  let i = 0; while (i < FLASH.length - 1 && reached(t, FLASH[i + 1][1])) i++;
  const [name, f, fps] = FLASH[i];
  const j = Math.floor(Math.max(0, frameNo(t) - frameNo(at(f))) / 2);          // the drawing, counted from the cut
  return <Footage name={name} at={(Math.round(0.3 * fps) + j + 0.5) / fps} scale={1.03 + 0.005 * j} />;
};

// ---------------------------------------------------------------- G: the caret, then the typed words
// The reference ("Build an app"): the caret blinks alone in the centre (on f205–f211, off f212–f216, on from f217);
// a key lands on each frame of G_KEYS; the first letter appears LEFT of the caret (the caret does not move for it);
// from f222 the whole line glides left, faster and faster (left edge 849 → 462 px by f242), into the jump at f243.
// Here: 96 px, weight 400. The letters never shift inside the line; the line moves as ONE block on that path and
// ends with the finished text (and its caret) centred. G_PAN = 0 makes the line stand still, centred, all along.
const G_PAN: number = 1;
const G_TEXT = "Can you help";
const G_KEYS = [219, 220, 222, 224, 225, 230, 232, 233, 234, 237, 239, 241];
const G_EM = 96, G_LS = -0.03 * G_EM, G_GAP = G_EM / 6, G_CW = G_EM / 24, G_CH = 1.29 * G_EM;   // caret 4 × 124, 16 px behind
const G_TOP = 538 - 0.54 * G_EM;                       // the line box (line-height 1.08) centred on y 538: top 486
const G_W = 6.544 * G_EM + G_TEXT.length * G_LS;       // the finished line: 593.7 px (Montserrat 400, kerned)
const G_C = 0.709 * G_EM + G_LS;                       // the first letter's advance
const G_X_END = (1920 - (G_W + G_GAP + G_CW)) / 2;     // finished text + caret centred
const G_X_CARET = 960 - G_GAP - G_CW / 2;              // the empty line: its caret stands in the centre
// The glide: speed V0 → V1 px/s, growing as e^(K·τ) (K fitted on the reference path), D px in all, ending on the jump.
// It is drawn in WHOLE pixels a frame that only ever grow (1 1 1 … 2 2 … 3 … 12): layers snap to the pixel grid, so a
// slower or fractional drift would stall on frames or dither 1-2-1 (the shake check's stutter and shake).
const G_K = 2.95, G_V0 = 60, G_FA = frameNo(at(222)), G_FB = frameNo(at(243));
const G_D = Math.round(G_X_CARET - Math.round(G_C) - G_X_END);
const stairs = (v1: number) => {
  const acc = [0], n = G_FB - G_FA;
  for (let i = 1; i <= n; i++) { const g = (Math.exp(G_K * (i - 0.5) / n) - 1) / (Math.exp(G_K) - 1); acc.push(acc[i - 1] + Math.max(1, Math.round((G_V0 + (v1 - G_V0) * g) / 60))); }
  return acc;
};
const G_STAIRS = (() => { let v1 = 600, st = stairs(v1); while (st[st.length - 1] < G_D && v1 < 6000) { v1 += 2; st = stairs(v1); } return st; })();
const TypedLine: React.FC<{ t: number }> = ({ t }) => {
  const n = count(G_KEYS, t);
  const k = Math.min(G_STAIRS.length - 1, Math.max(0, frameNo(t) - G_FA));
  const x = Math.round(G_PAN ? (n === 0 ? G_X_CARET : G_X_CARET - Math.round(G_C) - G_STAIRS[k]) : G_X_END);
  const caretOn = n > 0 || !(reached(t, 212) && !reached(t, 217));
  return (
    <Ground tone="vig">
      <div style={{ position: "absolute", left: 0, top: G_TOP, transform: `translate3d(${x}px, 0, 0)`, willChange: "transform", fontSize: G_EM, fontWeight: 400, letterSpacing: G_LS, lineHeight: 1.08, whiteSpace: "pre", color: INK }}>
        {G_TEXT.slice(0, n)}
        <div style={{ position: "absolute", left: "100%", top: -G_EM / 8, marginLeft: G_GAP, width: G_CW, height: G_CH, background: INK, opacity: caretOn ? 1 : 0 }} />
      </div>
    </Ground>
  );
};

// ---------------------------------------------------------------- H: the macro letters (the FR 9 look)
// The reference: an empty ground for one frame (f243), the giant caret alone (f244; f254–f255), then a key every one or
// two frames (f245 f247 f248 f250 f251; f256 f257 f258 f260 … f262), a hold of two frames, and all along a slow drift
// to the left (about 6 px a reference frame). The first letter appears around the place where the caret stood.
// Proportions of FR 9 (em 860): letter-spacing −0.0395 em, caret 0.028 × 0.93 em, 0.08 em behind the line.
type MacroDef = { word: string; keys: number[]; em: number; base: number; xEnd: number; lone: number; caretFrom: number; to: number };
const M1: MacroDef = { word: "autom", keys: [245, 247, 248, 250, 251], em: 575, base: 783, xEnd: -15, lone: 185, caretFrom: 244, to: 254 };
const M2: MacroDef = { word: "follo", keys: [256, 257, 258, 260, 262], em: 860, base: 883, xEnd: -40, lone: 95, caretFrom: 254, to: 265 };
const Macro: React.FC<{ t: number; m: MacroDef }> = ({ t, m }) => {
  const n = count(m.keys, t);
  const drift = 2 * Math.max(0, frameNo(at(m.to)) - frameNo(t));     // 120 px/s to the left: 2 whole px a frame
  const gap = 0.08 * m.em;
  const x = (n === 0 ? m.lone - gap : m.xEnd) + drift;
  return (
    <Ground tone="vig">
      <div style={{ position: "absolute", left: 0, top: m.base - 0.8985 * m.em, transform: `translate3d(${x}px, 0, 0)`, willChange: "transform", fontSize: m.em, fontWeight: 400, letterSpacing: -0.0395 * m.em, lineHeight: 1.08, whiteSpace: "pre", color: INK }}>
        {m.word.slice(0, n)}
        {reached(t, m.caretFrom) && <div style={{ position: "absolute", left: "100%", top: 0.0235 * m.em, marginLeft: gap, width: 0.028 * m.em, height: 0.93 * m.em, background: INK }} />}
      </div>
      <Fringe />
    </Ground>
  );
};

const Comp: React.FC<{ t: number }> = ({ t }) => {
  useFonts();
  if (!reached(t, 205)) return <Flash t={t} />;
  if (!reached(t, 243)) return <TypedLine t={t} />;
  if (!reached(t, 254)) return <Macro t={t} m={M1} />;
  return <Macro t={t} m={M2} />;
};

export const PKG: Pkg = {
  id: "R03",
  Comp,
  sfx: [
    { t: at(188), kind: "tick", ref: 188, note: "flash cut F1" },
    { t: at(192), kind: "tick", ref: 192, note: "flash cut F2" },
    { t: at(196), kind: "tick", ref: 196, note: "flash cut F3" },
    { t: at(200), kind: "tick", ref: 200, note: "flash cut F4" },
    { t: at(219), kind: "type", ref: 219, note: "0.92" },
    { t: at(245), kind: "type", ref: 245, note: "0.25" },
    { t: at(256), kind: "type", ref: 256, note: "0.25" },
  ],
};
