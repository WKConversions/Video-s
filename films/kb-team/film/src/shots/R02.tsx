// Package R02 (reference f93-f187; cut f130), rebuilt on the reference's measured boxes.
//   D f93-f129   "For what / comes next" set like the reference's "With your name on it"; the avatar cards sit around it
//                (one big card beside the first word that shrinks away, cards pop in left / bottom / bottom right, three
//                faded cards on the edges)
//   E f130-f187  the cards travel into a row of four (f133), swap faces as the logo is typed in over them (f137-f146),
//                the logo holds (f146-f183) while hairlines appear, greys out and the next picture shows through (f184+)
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import type { Pkg, Sfx } from "../types";
import { C, F, Footage, Glyph, ROLE, abs, clamp, kf, refN, useFonts } from "../kit";

const F0 = 93;
const nf = (n: number) => (n - F0) / 24;           // local seconds of a reference frame
type Box = [number, number, number, number];
type Ch = [number, Box];

/** value of a box at fractional reference frame n; each entry starts at its frame and glides in from the frame before */
const box = (n: number, ch: Ch[]): Box => {
  const out: number[] = [];
  for (let k = 0; k < 4; k++) {
    const keys: [number, number][] = [];
    ch.forEach(([f, b], i) => { if (i > 0) keys.push([f - 1, ch[i - 1][1][k]]); keys.push([f, b[k]]); });
    out.push(kf(n, keys.filter((e, i) => i === 0 || e[0] > keys[i - 1][0])));
  }
  return out as Box;
};
const val = (n: number, ch: [number, number][]) => kf(n, ch.flatMap(([f, v], i) => (i > 0 ? [[f - 1, ch[i - 1][1]], [f, v]] : [[f, v]]) as [number, number][]));

// ---- the cards (photo boxes, 1920 x 1080)
type Card = { id: string; who: string | [number, string][]; ch: Ch[]; from: number; to: number; cap?: number; ghost?: boolean; glyph?: [number, string]; pop?: number };
const CARDS: Card[] = [
  { id: "robin", who: [[0, "robin"], [141, "youri"]], from: 0, to: 144, cap: 1.0, ch: [
    [93, [1269, 286, 291, 361]], [95, [1315, 286, 291, 361]], [100, [1339, 219, 207, 258]], [130, [966, 259, 195, 243]], [132, [966, 252, 195, 250]],
    [133, [969, 382, 192, 192]], [136, [969, 444, 192, 192]], [139, [967, 450, 180, 180]], [142, [966, 472, 135, 135]]] },
  { id: "tom", who: [[0, "tom"], [137, "cedric"]], from: 95.4, to: 140, cap: 1, pop: 95.4, ch: [
    [96, [126, 157, 184, 235]], [99, [126, 166, 184, 235]], [102, [126, 247, 184, 235]], [112, [141, 247, 183, 234]], [129, [246, 247, 184, 234]], [130, [414, 249, 184, 234]],
    [133, [519, 427, 192, 192]], [135, [519, 442, 192, 190]], [137, [517, 441, 193, 193]], [139, [547, 447, 181, 181]]] },
  { id: "youri", who: [[0, "youri"], [139, "tom"]], from: 101, to: 142, cap: 1, pop: 101, ch: [
    [102, [484, 790, 159, 181]], [105, [649, 790, 159, 181]], [108, [657, 790, 168, 181]], [120, [663, 790, 168, 181]], [122, [750, 790, 168, 181]], [125, [757, 790, 168, 181]],
    [127, [757, 769, 168, 183]], [130, [744, 544, 180, 202]], [132, [736, 498, 187, 183]], [133, [741, 498, 183, 183]], [134, [741, 450, 192, 192]], [136, [741, 444, 192, 192]],
    [139, [756, 450, 178, 180]]] },
  { id: "karl", who: "karl", from: 104, to: 146, cap: 1, pop: 104, ch: [
    [105, [1422, 1090, 189, 205]], [106, [1422, 970, 189, 205]], [110, [1422, 895, 189, 205]], [126, [1402, 895, 189, 205]], [128, [1282, 895, 187, 205]], [130, [1222, 637, 189, 205]], [131, [1222, 589, 189, 205]],
    [133, [1192, 465, 192, 192]], [137, [1191, 441, 193, 193]], [139, [1176, 448, 180, 180]], [142, [1122, 471, 134, 135]]] },
  { id: "cedric", who: "cedric", from: 0, to: 133, cap: 1, ghost: true, glyph: [0, "#ABE0F7"], ch: [
    [93, [1107, -45, 214, 262]], [96, [1125, -45, 214, 262]], [132, [1117, -32, 214, 262]]] },
  { id: "gl", who: "youri", from: 0, to: 133, ghost: true, glyph: [3, "#BCC6F5"], ch: [
    [93, [-78, 480, 190, 213]], [96, [-63, 480, 190, 213]], [128, [-51, 480, 190, 213]], [131, [25, 480, 205, 213]]] },
  { id: "gr", who: "karl", from: 0, to: 133, cap: 1, ghost: true, glyph: [4, "#B0E6D5"], ch: [
    [93, [1720, 565, 250, 220]], [96, [1729, 565, 250, 220]], [125, [1701, 565, 250, 220]], [128, [1693, 565, 250, 220]], [131, [1614, 565, 256, 220]]] },
];
const BW = 300, BH = 360;                        // the window the layer is built for
const LW = 380, LH = 460, WCX = 190, WCY = 185;   // layer size and the window centre inside it

const CardView: React.FC<{ c: Card; n: number }> = ({ c, n }) => {
  if (n < c.from - 3 || n >= c.to) return null;
  const [x, y, w, h] = box(n, c.ch);
  const who = Array.isArray(c.who) ? [...c.who].reverse().find(([f]) => n >= f)![1] : c.who;
  const p = c.pop ? clamp((n - c.pop) / 2.5) : 1;
  const sp = c.pop ? 0.82 + 0.18 * (1 - Math.pow(1 - p, 3)) : 1;
  const out = c.id === "robin" ? 1 : 1;
  const fade = clamp((c.to - n) / 0.9) * out;
  const s = Math.max(w / BW, h / BH) * sp;
  const cx = x + w / 2, cy = y + h / 2;
  const iw = (w / s) * sp / sp, ih = h / s;
  const insetL = WCX - iw / 2, insetR = LW - (WCX + iw / 2), insetT = WCY - ih / 2, insetB = LH - (WCY + ih / 2);
  const ghost = c.ghost;
  return (
    <>
      <div style={{ position: "absolute", left: 0, top: 0, width: LW, height: LH, transformOrigin: `${WCX}px ${WCY}px`, transform: `translate3d(${(cx - WCX).toFixed(2)}px, ${(cy - WCY).toFixed(2)}px, 0) scale(${s.toFixed(4)})`, clipPath: `inset(${insetT.toFixed(2)}px ${insetR.toFixed(2)}px ${insetB.toFixed(2)}px ${insetL.toFixed(2)}px round ${(3 / s).toFixed(2)}px)`, opacity: clamp(p * 2.2) * fade * (ghost ? (c.glyph ? 0.85 : 0.5) : 1), willChange: "transform", filter: ghost && !c.glyph ? "blur(1.6px) grayscale(.5) contrast(.8) brightness(1.1)" : undefined }}>
        {c.glyph ? (
          <div style={{ width: LW, height: LH, background: c.glyph[1], position: "relative" }}>
            <div style={{ position: "absolute", left: WCX - 70, top: WCY - 70 }}><Glyph k={c.glyph[0]} s={140} c="rgba(41,58,81,.22)" /></div>
          </div>
        ) : <Img src={staticFile(`team/${who}.jpg`)} style={{ width: LW, height: LH, objectFit: "cover", objectPosition: "50% 14%" }} />}
      </div>
      {c.cap && !c.glyph && n < 133 && (
        <div style={{ position: "absolute", left: 0, top: 0, transform: `translate3d(${(x + 4).toFixed(2)}px, ${(y + h + 13).toFixed(2)}px, 0)`, fontSize: 19, fontWeight: 500, letterSpacing: -0.2, color: C.sub, display: "flex", alignItems: "center", gap: 8, whiteSpace: "nowrap", opacity: clamp(p * 2.2) * fade * (ghost ? 0.55 : 1), willChange: "transform" }}>
          <span style={{ width: 10, height: 10, borderRadius: 5, background: C.cyan }} />{ROLE[who]}
        </div>
      )}
    </>
  );
};

// ---- the words
const FS = 114, ASC = 108 * FS / 126;
const BASE1 = 472, BASE2 = 583, BASE3 = 690;
const wordStyle = (x: number, base: number, anchorCentre = false): React.CSSProperties => ({ position: "absolute", left: x, top: base - ASC, fontSize: FS, lineHeight: `${FS}px`, fontWeight: 600, letterSpacing: -3.2, color: "#23262D", whiteSpace: "nowrap", transform: anchorCentre ? "translateX(-50%)" : undefined });
const enter = (n: number, f: number) => { const p = clamp(n - f); return { p, e: 1 }; };

const Words: React.FC<{ n: number }> = ({ n }) => {
  if (n >= 130) return null;
  const fWhat = 97.4 - 1, fComes = 102.2 - 1, fNext = 108.5 - 1;
  // positions follow the reference's "With your name on it" (steps, glide in the frame before)
  const forC = val(n, [[93, 905], [102, 958], [125, 896]]);
  const whatX = val(n, [[93, 500], [102, 510], [105, 560], [127, 520]]);
  const comesX = val(n, [[93, 1010], [102, 1010], [105, 965]]);
  const nextX = val(n, [[93, 1104], [122, 984], [127, 944]]);
  const sc = kf(n, [[127, 1], [128, 0.962]]);
  const fOut = clamp(129.9 - n), whatOut = clamp(128.9 - n);
  const w = (id: string, f: number, node: React.ReactNode, x: number, base: number, cen = false, o = 1) => {
    const { p } = f <= 93 ? { p: 1 } : enter(n, f);
    if (p <= 0) return null;
    return <div key={id} style={{ ...wordStyle(0, base, false), left: 0, transform: `translate3d(${(x).toFixed(2)}px, 0px, 0) ${cen ? "translateX(-50%)" : ""} scale(${sc.toFixed(4)})`, transformOrigin: cen ? "50% 60%" : "0 60%", opacity: p * o, willChange: "transform" }}>{node}</div>;
  };
  return (
    <>
      {w("for", 0, "For", forC, BASE1, true, fOut)}
      {w("what", fWhat, "what", whatX, BASE2, false, whatOut)}
      {w("comes", fComes, "comes", comesX, BASE2, false, fOut)}
      {w("next", fNext, "next", nextX, BASE3, false, fOut)}
    </>
  );
};

// ---- faint background text, like the reference's ghost screens
const Ghost: React.FC<{ n: number }> = ({ n }) => {
  const o = 0.55 * (1 - clamp((n - 133) / 18));
  if (o <= 0.01) return null;
  const block = (x: number, y: number, w: number, lines: number, lh = 19, key = "") => (
    <div key={key} style={abs(x, y, w, lines * lh, {})}>
      {Array.from({ length: lines }, (_, i) => <div key={i} style={{ height: 7, marginBottom: lh - 7, borderRadius: 3, width: `${i === lines - 1 ? 45 : 100 - ((i * 37) % 28)}%`, background: "#DADADA" }} />)}
    </div>
  );
  return (
    <div style={{ opacity: o }}>
      {block(95, 78, 330, 4, 22, "a")}{block(100, 190, 250, 2, 20, "b")}{block(363, 360, 300, 6, 20, "c")}{block(100, 840, 290, 9, 20, "d")}
      {block(1150, 790, 380, 12, 20, "e")}{block(1590, 40, 300, 5, 18, "f")}{block(1000, 480, 230, 3, 18, "g")}
    </div>
  );
};

// ---- the logo lockup (K.B tile + wordmark), typed in over the cards
const TILE = 165;
const Lockup: React.FC<{ n: number }> = ({ n }) => {
  if (n < 139.5) return null;
  const cx = kf(n, [[140, 659], [142, 800], [144, 880], [146, 946]]);
  const pop = clamp((n - 139.6) / 1.6);
  const ts = 0.47 + 0.53 * (1 - Math.pow(1 - pop, 3));
  const dis = kf(n, [[183, 0], [184, 1]]);
  return (
    <div style={{ position: "absolute", left: 0, top: 0, transformOrigin: "946px 540px", transform: `scale(${(1 - 0.045 * dis).toFixed(4)})`, opacity: 1 - 0.62 * dis, filter: dis > 0.01 ? `grayscale(${dis.toFixed(2)})` : undefined }}>
      <div style={{ position: "absolute", left: 0, top: 0, transform: `translate3d(${(cx - TILE / 2).toFixed(2)}px, ${540 - TILE / 2}px, 0) scale(${ts.toFixed(4)})`, opacity: clamp(pop * 3), willChange: "transform" }}>
        <Img src={staticFile("logo/kb-logo-tile.svg")} style={{ width: TILE, height: TILE, borderRadius: TILE * 0.075, display: "block" }} />
      </div>
    </div>
  );
};

// hairlines: [axis, position, first frame, last frame]
const LINES: [string, number, number, number][] = [
  ["v", 135, 175, 183], ["v", 1662, 178, 183], ["h", 800, 180, 183], ["v", 595, 182, 183], ["v", 1630, 182, 183], ["h", 274, 182, 183], ["h", 1066, 183, 183],
  ["v", 642, 184, 187], ["v", 1258, 184, 187], ["h", 309, 184, 187], ["h", 765, 184, 187],
];
const Lines: React.FC<{ n: number }> = ({ n }) => (
  <>
    {LINES.map(([ax, p, a, b], i) => {
      const o = clamp((n - a + 1)) * clamp(b + 1 - n);
      if (o <= 0.01) return null;
      const st = ax === "v" ? abs(p - 1.5, 0, 3, 1080) : abs(0, p - 1.5, 1920, 3);
      return <div key={i} style={{ ...st, background: "#B2B2B2", opacity: o * 0.85 }} />;
    })}
  </>
);

const Comp: React.FC<{ t: number }> = ({ t }) => {
  const ok = useFonts();
  if (!ok) return <AbsoluteFill style={{ background: "#F4F4F4" }} />;
  const n = refN(t, F0);
    return (
    <AbsoluteFill style={{ background: "#F4F4F4", fontFamily: F, color: C.ink, overflow: "hidden" }}>
      <Ghost n={n} />
      {CARDS.map((c) => <CardView key={c.id} c={c} n={n} />)}
      <Words n={n} />
      <Lockup n={n} />
      <Lines n={n} />
      {n >= 184 && <AbsoluteFill style={{ opacity: kf(n, [[184, 0], [185, 0.03], [186, 0.35], [187, 0.55]]) }}><Footage name="F1" at={7.5 / 23.976} scale={1.03} grade="grayscale(1) brightness(2.2) contrast(.3)" /></AbsoluteFill>}
    </AbsoluteFill>
  );
};
const at = (f: number) => nf(f);
const sfx: Sfx[] = [
  { t: at(95.6), kind: "pop", note: "tom's card", ref: 96 },
  { t: at(101.6), kind: "pop", note: "youri's card", ref: 102 },
  { t: at(105.6), kind: "pop", note: "karl's card rises", ref: 106 },
  { t: at(130), kind: "swish", note: "the cards travel into a row", ref: 130 },
  { t: at(133), kind: "slide", note: "they settle in a row", ref: 133 },
  { t: at(140), kind: "pop", note: "the K.B tile replaces the first card", ref: 140 },
  { t: at(142), kind: "tick", note: "wordmark types in over the cards", ref: 142 },
  { t: at(146), kind: "thud", note: "the lockup is complete", ref: 146 },
  { t: at(184), kind: "swish", note: "the logo greys out into the next picture", ref: 184 },
];
export const PKG: Pkg = { id: "R02", Comp, sfx };
