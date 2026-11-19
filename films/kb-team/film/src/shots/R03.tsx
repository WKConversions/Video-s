// Package R03 · reference f188–f264 · cuts f192, f196, f200, f205, f254
// F  four filmed flash cuts (F1–F4) · G  the caret alone, then "Can you help" typed · H  the macro letters, two crops.
// Timed on the reference frame by frame (tools/ref.py, dark-pixel boxes): local t = (reference frame − 188) / 24.
import React from "react";
import type { Pkg } from "../types";
import { Footage, Fringe, Ground, kf, refN, rs, useFonts } from "../kit";

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
// Measured on the reference (track.py text): the caret is 12 x 228 px, top 423 (baseline 600), blinks on f205-f211, off
// f212-f216, on from f217; a key per frame of G_KEYS (first letter LEFT of the caret, caret stays at 956-968 for it);
// the left ink edge then glides left 848 -> 459 by f242 (G_L); the caret follows the last letter.
const G_TEXT = "Can you help";
const G_KEYS = [219, 220, 222, 224, 225, 230, 232, 233, 234, 237, 239, 241];
const G_L: [number, number][] = [[219, 848], [222, 846], [224, 842], [225, 838], [227, 828], [229, 812], [231, 789], [233, 760], [235, 720], [237, 668], [239, 596], [241, 498], [242, 459], [243, 440]];
const G_EM = 185, G_LS = -0.05 * G_EM, G_BASE = 600, G_BEAR = 0.05 * G_EM, G_GAP = 34;
const G_SHIFT = 50;                                   // our line is wider than the reference's: keep the centre
const TypedLine: React.FC<{ t: number }> = ({ t }) => {
  const nn = refN(t, F0);
  const n = count(G_KEYS, t);
  const caretOn = n > 0 || !(reached(t, 212) && !reached(t, 217));
  const L = kf(nn, G_L);
  const prog = Math.min(1, Math.max(0, (848 - L) / (848 - 459)));
  const x = L - G_BEAR - G_SHIFT * prog;
  return (
    <Ground tone="vig">
      {n === 0 ? (
        <div style={{ position: "absolute", left: 956, top: 423, width: 12, height: 228, background: INK, opacity: caretOn ? 1 : 0 }} />
      ) : (
        <div style={{ position: "absolute", left: 0, top: G_BASE - 0.8585 * G_EM, transform: `translate3d(${x}px, 0, 0)`, willChange: "transform", fontSize: G_EM, fontWeight: 500, letterSpacing: G_LS, lineHeight: 1, whiteSpace: "pre", color: INK }}>
          {G_TEXT.slice(0, n)}
          <div style={{ position: "absolute", left: n === 1 ? 956 - x : "100%", top: 423 - (G_BASE - 0.8585 * G_EM), marginLeft: n === 1 ? 0 : G_GAP, width: 12, height: 228, background: INK }} />
        </div>
      )}
    </Ground>
  );
};

// ---------------------------------------------------------------- H: the macro letters
// Reference: f243 an empty ground, f244 the giant caret alone (x 222), then letters (f245 f247 f248 f250 f251) with the
// line's ink-left edge drifting 80 -> 34 (5.75 px a frame); f254-f255 the caret alone again (x 140, 134), then letters
// (f256 f257 f258 f260 ...) from ink-left 18, drifting left about 6 px a frame. x-height 373, baseline 775, caret 232-822.
type MacroDef = { word: string; keys: number[]; L: [number, number][]; lone: [number, number][]; loneFrom: number; to: number };
const H_EM = 680, H_BASE = 775, H_BEAR = 0.05 * H_EM, H_GAP = 55;
const M1: MacroDef = { word: "follo", keys: [245, 247, 248, 250, 251], L: [[245, 80], [253, 34], [254, 28]], lone: [[244, 222], [245, 222]], loneFrom: 244, to: 254 };
const M2: MacroDef = { word: "date", keys: [256, 257, 258, 260], L: [[256, 18], [264, -30], [265, -36]], lone: [[254, 140], [255, 134], [256, 128]], loneFrom: 254, to: 265 };
const Macro: React.FC<{ t: number; m: MacroDef }> = ({ t, m }) => {
  const nn = refN(t, F0);
  const n = count(m.keys, t);
  const x = kf(nn, m.L) - H_BEAR;
  const top = H_BASE - 0.8585 * H_EM;
  const caret = (left: number) => <div style={{ position: "absolute", left, top: 232, width: 30, height: 590, background: INK }} />;
  return (
    <Ground tone="vig">
      {n === 0 ? (reached(t, m.loneFrom) ? caret(kf(nn, m.lone)) : null) : (
        <div style={{ position: "absolute", left: 0, top, transform: `translate3d(${x}px, 0, 0)`, willChange: "transform", fontSize: H_EM, fontWeight: 500, letterSpacing: -0.02 * H_EM, lineHeight: 1, whiteSpace: "pre", color: INK }}>
          {m.word.slice(0, n)}
          <div style={{ position: "absolute", left: "100%", top: 232 - top, marginLeft: H_GAP, width: 30, height: 590, background: INK }} />
        </div>
      )}
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
