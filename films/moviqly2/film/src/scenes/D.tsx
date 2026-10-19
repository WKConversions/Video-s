// Scene D — earlier films (h1 → sE): "It studies earlier films, so this one's different."
// Starts on Handoff1 (the raw draft, centred). The draft settles into the middle of a shelf of five earlier films that
// surface in depth around it; violet connectors draw to each with a similarity (62, 48, 91 flagged, 35, 57). On "so"
// the draft steps forward, unplugging; the films recede and grey; on "different" it gets the gradient outline and the
// "New idea" tag. The draft (the thread object of D, E, F) and the shelf are exported for E and F.
import React from "react";
import { C, CRAFT, DraftTile, EARLIER, EarlierFrame, FONT, GRAD, GRAD_D, Handoff1, Ico, LAND, LEAVE, SHADOW, SNAP, clamp01, f, k, kf, mix } from "../shared";

/* ---------- the thread: the draft tile's box across D, E and F ---------- */
// The draft is always a 720-wide DraftTile, moved and scaled as one object (transform), so its shadow and type scale
// together and it never re-lays out.
export type Box = { x: number; y: number; w: number };
export const DW = 720;
export const bh = (b: Box) => (b.w * 9) / 16;
export const lerpBox = (a: Box, b: Box, p: number): Box => ({ x: mix(a.x, b.x, p), y: mix(a.y, b.y, p), w: mix(a.w, b.w, p) });
const centred = (cx: number, cy: number, w: number): Box => ({ x: cx - w / 2, y: cy - (w * 9) / 32, w });
const B_H1: Box = { x: 600, y: 337.5, w: 720 };          // Handoff1
const B_CMP = centred(960, 600, 600);                   // in the middle of the shelf
const B_CMP2 = centred(960, 606, 640);                  // a slow push while it studies them
const B_CLEAR = centred(960, 640, 680);                 // stepped forward, clear of the films
export const B_LEFT: Box = { x: 140, y: 410, w: 720 };  // E: left, beside the grid / the console
export const B_LEFT2: Box = { x: 140, y: 410, w: 748 }; // E: a slow push while it gets its idea and art direction
// F: row 1's thumbnail inside Handoff2's StoryboardCard (w 700, size 22, left 150, vertically centred), measured on
// a render of Handoff2: card 545 px tall → top 267.5; thumbnail at card + 1 border + 19.8 padding, below the header.
export const B_THUMB: Box = { x: 170.8, y: 337.6, w: 96.8 };

export const draftBox = (g: number): Box => {
  let b = B_H1;
  b = lerpBox(b, B_CMP, k(g, "h1", 0.8, CRAFT));
  b = lerpBox(b, B_CMP2, kf(g, f("h1") + 22, f("w:so") - f("h1") - 20, SINE));
  b = lerpBox(b, B_CLEAR, k(g, "w:so", 0.75, CRAFT));
  b = lerpBox(b, B_LEFT, k(g, "sE", 0.6, CRAFT));
  b = lerpBox(b, B_LEFT2, kf(g, f("w:forms") + 6, f("sF") - f("w:forms") - 6, SINE));
  b = lerpBox(b, B_THUMB, k(g, "sF+0.17", 0.8, CRAFT));
  return b;
};
// The four art-direction sliders (E) snap at these labels; each dresses the draft a quarter further.
export const SLIDER_AT = ["w:sets+0.17", "w:art-0.03", "w:direction", "w:direction+0.2"];
export const dressAt = (g: number) => SLIDER_AT.reduce((a, at) => a + 0.25 * k(g, at, 0.36, CRAFT), 0);
// Into the thumbnail (F): 0 → 1 while it carries.
export const intoThumb = (g: number) => k(g, "sF+0.17", 0.8, CRAFT);
// Tags under the draft leave as F starts.
export const tagsOut = (g: number) => k(g, "sF", 0.5, LEAVE);

// The gradient outline and "New idea" tag (from "different"), the "Feature tour" chip (E) and the draft itself.
export const TAG = { dx: 24, w: 172, h: 48, gap: 12, chipW: 236 };
export const chipBoxAt = (b: Box) => ({ x: b.x + TAG.dx + TAG.w + TAG.gap, y: b.y + bh(b) - TAG.h / 2, w: TAG.chipW, h: TAG.h });

export const Draft: React.FC<{ g: number; box?: Box }> = ({ g, box }) => {
  if (g === f("h1")) return <Handoff1 />;
  const b = box ?? draftBox(g), s = b.w / DW, h = bh(b);
  const land = intoThumb(g);
  const ol = k(g, "w:different", 0.35, SNAP) * (1 - land);
  const tg = k(g, "w:different+0.1", 0.45, LAND), to = tagsOut(g);
  // the outline draws around (a conic sweep), the radius follows the tile's
  const rad = mix(18.72, 6.6 / (B_THUMB.w / DW), land);
  const sweep = ol * 360;
  return (
    <>
      {ol > 0 && <div style={{ position: "absolute", left: b.x - 6, top: b.y - 6, width: b.w + 12, height: h + 12, borderRadius: rad * s + 6, background: GRAD_D,
        opacity: clamp01(ol * 2), boxShadow: `0 0 34px rgba(80,60,255,${0.28 * ol})`,
        WebkitMaskImage: ol < 1 ? `conic-gradient(from 200deg, #000 ${sweep}deg, transparent ${sweep}deg)` : undefined,
        maskImage: ol < 1 ? `conic-gradient(from 200deg, #000 ${sweep}deg, transparent ${sweep}deg)` : undefined }} />}
      <div style={{ position: "absolute", left: 0, top: 0, transform: `translate(${b.x}px, ${b.y}px) scale(${s})`, transformOrigin: "0 0" }}>
        <DraftTile w={DW} dress={dressAt(g)} style={{ borderRadius: rad,
          boxShadow: `0 0 0 ${1 / s}px ${C.line}, 0 4px 8px rgba(38,35,44,${0.06 * (1 - land)}), 0 50px 110px -30px rgba(60,40,110,${0.35 * (1 - land)})` }} />
      </div>
      {tg > 0 && to < 1 && (
        <div style={{ position: "absolute", left: b.x + TAG.dx, top: b.y + h - TAG.h / 2, width: TAG.w, height: TAG.h, boxSizing: "border-box", borderRadius: 999, background: GRAD,
          display: "flex", alignItems: "center", justifyContent: "center", gap: 9, color: C.white, fontFamily: FONT, fontWeight: 600, fontSize: 22, letterSpacing: "-0.01em",
          boxShadow: "0 10px 24px -10px rgba(70,50,255,0.6)", opacity: clamp01(tg * 1.8) * (1 - to), transform: `scale(${mix(0.82, 1, tg) * mix(1, 0.8, to)})`,
          filter: tg < 1 || to > 0 ? `blur(${(1 - tg) * 10 + to * 10}px)` : undefined }}>
          <Ico n="spark" s={20} c={C.white} fill={C.white} w={1} />New idea
        </div>
      )}
    </>
  );
};

/* ---------- the shelf of earlier films ---------- */
const TILE = { w: 340, h: 191, lab: 46 };
// left-bottom, left-top, top, right-top, right-bottom: compared in this order (clockwise)
const TILES = [
  { x: 110, y: 650, ry: 18 }, { x: 110, y: 250, ry: 18 }, { x: 790, y: 66, ry: 0 }, { x: 1470, y: 250, ry: -18 }, { x: 1470, y: 650, ry: -18 },
];
const SIM = [62, 48, 91, 35, 57];
const CLOSEST = 2;
const tileIn = (g: number, i: number) => k(g, `w:studies+${(i * 0.13).toFixed(2)}`, 0.5, LAND);
const recede = (g: number) => k(g, "w:so", 1.3, CRAFT);
const exitT = (g: number) => k(g, "sE", 0.5, LEAVE);
const lineStart = (i: number) => f("w:films") - 3 + i * 5;
const SINE = (t: number) => 0.5 - 0.5 * Math.cos(Math.PI * t);
// the shelf spreads slowly outward around the draft (parallax: the draft is nearer)
const tileOff = (g: number, i: number) => {
  const t = TILES[i], dx = t.x + TILE.w / 2 - 960, dy = t.y + TILE.h / 2 - 560, d = Math.hypot(dx, dy);
  const q = kf(g, f("h1"), f("sE") + 15 - f("h1"), SINE) * 46;
  return { x: (dx / d) * q, y: (dy / d) * q * 0.6 };
};

// the point where a ray from a box's centre toward (tx, ty) leaves the box (plus a gap)
const edge = (cx: number, cy: number, hw: number, hh: number, tx: number, ty: number, gap: number) => {
  const dx = tx - cx, dy = ty - cy, d = Math.hypot(dx, dy) || 1;
  const t = Math.min(dx ? hw / Math.abs(dx) : 1e9, dy ? hh / Math.abs(dy) : 1e9);
  return { x: cx + dx * t + (dx / d) * gap, y: cy + dy * t + (dy / d) * gap };
};

export const Shelf: React.FC<{ g: number }> = ({ g }) => {
  const r = recede(g), x = exitT(g);
  if (x >= 1) return null;
  const b = draftBox(g), dcx = b.x + b.w / 2, dcy = b.y + bh(b) / 2;
  return (
    <>
      {TILES.map((t, i) => {
        const p = tileIn(g, i);
        if (p <= 0) return null;
        const flag = i === CLOSEST ? kf(g, lineStart(i) + 6, 8, SNAP) * (1 - r) : 0;
        const lift = kf(g, lineStart(i) - 1, 6, SNAP) * (i === CLOSEST ? 1 : 1 - kf(g, lineStart(i) + 7, 12, LAND));
        const sc = mix(0.7, 1, p) * mix(1, 0.88, r) * mix(1, 0.78, x) * (1 + 0.07 * lift * (1 - r));
        const o = tileOff(g, i);
        return (
          <div key={i} style={{ position: "absolute", left: t.x + o.x, top: t.y + o.y, width: TILE.w, opacity: clamp01(p * 1.8) * mix(1, 0.42, r) * (1 - x),
            transform: `perspective(1600px) rotateY(${t.ry}deg) scale(${sc})`, transformOrigin: "50% 50%",
            filter: `grayscale(${r}) blur(${(1 - p) * 12 + r * 2.5 + x * 8}px)` }}>
            <div style={{ width: TILE.w, height: TILE.h, borderRadius: 14, overflow: "hidden", position: "relative", boxShadow: `0 0 0 ${1 + flag * 2.5}px ${flag > 0.02 ? C.flag : C.line}, ${SHADOW}` }}>
              <EarlierFrame i={i} w={TILE.w} h={TILE.h} />
            </div>
            <div style={{ marginTop: 13, textAlign: "center", fontFamily: FONT, fontWeight: 600, fontSize: 21, letterSpacing: "0.08em", textTransform: "uppercase", color: C.label, whiteSpace: "nowrap" }}>{EARLIER[i]}</div>
          </div>
        );
      })}
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        {TILES.map((t, i) => {
          const d = kf(g, lineStart(i), 9, CRAFT), un = kf(g, f("w:so") + i * 1.5, 12, CRAFT);
          if (d <= 0 || un >= 1) return null;
          const o = tileOff(g, i), tcx = t.x + o.x + TILE.w / 2, tcy = t.y + o.y + (TILE.h + TILE.lab) / 2;
          const A = edge(dcx, dcy, b.w / 2, bh(b) / 2, tcx, tcy, 10), B = edge(tcx, tcy, TILE.w / 2 - 6, (TILE.h + TILE.lab) / 2, dcx, dcy, 10);
          const at = (q: number) => ({ x: mix(A.x, B.x, q), y: mix(A.y, B.y, q) });
          const P0 = at(un), P1 = at(d);
          const col = i === CLOSEST && d > 0.6 ? C.flag : C.violet;
          return (
            <g key={i}>
              <line x1={P0.x} y1={P0.y} x2={P1.x} y2={P1.y} stroke={col} strokeWidth={2.6} strokeLinecap="round" />
              {un < 0.05 && <circle cx={A.x} cy={A.y} r={4.5} fill={col} />}
              {d > 0.95 && <circle cx={B.x} cy={B.y} r={4.5} fill={col} />}
            </g>
          );
        })}
      </svg>
      {TILES.map((t, i) => {
        const pp = kf(g, lineStart(i) + 4, 10, LAND), un = kf(g, f("w:so") + i * 1.5, 10, LEAVE);
        if (pp <= 0 || un >= 1) return null;
        const o = tileOff(g, i), tcx = t.x + o.x + TILE.w / 2, tcy = t.y + o.y + (TILE.h + TILE.lab) / 2;
        const A = edge(dcx, dcy, b.w / 2, bh(b) / 2, tcx, tcy, 10), B = edge(tcx, tcy, TILE.w / 2 - 6, (TILE.h + TILE.lab) / 2, dcx, dcy, 10);
        const m = { x: mix(A.x, B.x, 0.5), y: mix(A.y, B.y, 0.5) };
        const flag = i === CLOSEST, col = flag ? C.flag : C.violet;
        const n = Math.round(SIM[i] * clamp01(kf(g, lineStart(i) + 4, 9, SNAP)));
        return (
          <div key={i} style={{ position: "absolute", left: m.x, top: m.y, transform: `translate(-50%, -50%) scale(${mix(0.82, 1, pp) * mix(1, 0.85, un)})`, opacity: clamp01(pp * 1.8) * (1 - un),
            filter: pp < 1 || un > 0 ? `blur(${(1 - pp) * 10 + un * 8}px)` : undefined, display: "flex", alignItems: "baseline", gap: 7, padding: "8px 18px", borderRadius: 999,
            background: flag ? C.flag : C.white, border: `1.5px solid ${col}`, boxShadow: SHADOW, fontFamily: FONT, whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums" }}>
            <span style={{ fontWeight: 700, fontSize: 27, color: flag ? C.white : C.lavenderInk, letterSpacing: "-0.02em" }}>{n}%</span>
            <span style={{ fontWeight: 500, fontSize: 20, color: flag ? "rgba(255,255,255,0.9)" : C.muted }}>alike</span>
          </div>
        );
      })}
    </>
  );
};

export const SceneD: React.FC<{ g: number }> = ({ g }) => {
  if (g < f("h1") || g >= f("sE")) return null;
  if (g === f("h1")) return <Handoff1 />;
  return (
    <>
      <Shelf g={g} />
      <Draft g={g} />
    </>
  );
};
