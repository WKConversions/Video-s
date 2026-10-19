// Scene K — "Switch to Portrait; the canvas reshapes." (sK → sL, builder 4; plan/storyboard.md).
// A cursor surfaces and clicks the format menu in the preview header on "Switch"; the dropdown opens (16:9 · Landscape ✓,
// 9:16 · Portrait, 1:1 · Square, drawn big enough to read); Portrait is picked on "Portrait" and the header reads
// "9:16 · Portrait". On "the canvas reshapes" the canvas lifts forward a little and reshapes 16:9 → 9:16 (CRAFT) while
// the film recomposes for portrait (the two layouts crossfade, so nothing pops), then settles back into the pane.
import React from "react";
import { C, CRAFT, ChatCalmer, Cursor, FONT, Ico, LAND, LEAVE, Preview, SHADOW_BIG, SNAP, Studio, canvasBox, clamp01, f, filmClock, k, kf, mix } from "../shared";
import { CanvasCard, PANE, Veil, canvasAt, filmNode } from "./I";

export const FMT = { x: 1646, y: 164 };        // the format menu in the preview header (frame px)
export const EXP = { x: 1664.5, y: 102, l: 1591, r: 1738, t: 82, b: 122 };   // the header's Export MP4 button
const MENU = { r: 1742, t: 190, w: 372, row: 60, pad: 8 };
const OPTS = [{ ic: "landscape", t: "16:9 · Landscape" }, { ic: "portrait", t: "9:16 · Portrait" }, { ic: "square", t: "1:1 · Square" }];
const rowY = (i: number) => MENU.t + MENU.pad + MENU.row * (i + 0.5);

// The film fitted to any canvas size: the landscape and the portrait layouts, each scaled to cover, crossfaded by x.
export const FitFilm: React.FC<{ g: number; w: number; h: number; x: number }> = ({ g, w, h, x }) => {
  // each layout is drawn at the nearest size that keeps it (landscape: h ≤ 1.1 w; portrait: h > 1.1 w), scaled to cover
  const layer = (lw: number, lh: number, o: number, b: number) => {
    const s = Math.max(w / lw, h / lh);
    return <div style={{ position: "absolute", left: (w - lw * s) / 2, top: (h - lh * s) / 2, width: lw, height: lh, transform: s !== 1 ? `scale(${s})` : undefined, transformOrigin: "0 0", opacity: o, overflow: "hidden", filter: b > 0.05 ? `blur(${b}px)` : undefined }}>{filmNode(g, lw, lh)}</div>;
  };
  return <>{x < 1 && layer(w, Math.min(h, w * 1.1), 1, x * 10)}{x > 0 && layer(Math.min(w, h / 1.1 - 1), h, x, (1 - x) * 10)}</>;
};

// The format dropdown (drawn at a readable size). sel 0..1 moves the choice from Landscape to Portrait; hover 0..1
// lights the Portrait row under the cursor.
const Menu: React.FC<{ sel: number; hover: number; style?: React.CSSProperties }> = ({ sel, hover, style }) => (
  <div style={{ position: "absolute", left: MENU.r - MENU.w, top: MENU.t, width: MENU.w, padding: MENU.pad, boxSizing: "border-box", background: C.white, borderRadius: 18, border: `1px solid ${C.line}`, boxShadow: SHADOW_BIG, fontFamily: FONT, ...style }}>
    {OPTS.map((o, i) => {
      const on = i === 0 ? 1 - sel : i === 1 ? sel : 0;
      const bg = i === 1 ? Math.max(hover * 0.6, sel) : i === 0 ? 1 - sel : 0;
      return (
        <div key={o.ic} style={{ height: MENU.row, display: "flex", alignItems: "center", gap: 16, padding: "0 16px", borderRadius: 12, position: "relative" }}>
          <div style={{ position: "absolute", inset: 0, borderRadius: 12, background: C.lavender, opacity: bg }} />
          <Ico n={o.ic} s={30} c={on > 0.5 ? C.lavenderInk : C.muted} style={{ position: "relative" }} />
          <div style={{ position: "relative", flex: 1, fontSize: 25, fontWeight: 500, color: on > 0.5 ? C.lavenderInk : C.ink, letterSpacing: "-0.01em", whiteSpace: "nowrap" }}>{o.t}</div>
          <div style={{ position: "relative", opacity: on, transform: `scale(${0.6 + 0.4 * on})` }}><Ico n="check" s={26} c={C.violet} w={2.6} /></div>
        </div>
      );
    })}
  </div>
);

export const SceneK: React.FC<{ g: number }> = ({ g }) => {
  if (g < f("sK") || g >= f("sL")) return null;
  const fc = filmClock(g);
  const sw = f("w:switch"), pt = f("w:portrait");
  // the cursor: surfaces, glides to the format menu, clicks on "Switch", moves to Portrait, clicks on "Portrait", leaves
  const co = k(g, "sK", 0.25, LAND) * (1 - kf(g, pt + 9, 9, LEAVE));
  const m1 = kf(g, f("sK"), sw - f("sK"), CRAFT), m2 = kf(g, sw + 3, pt - sw - 3, CRAFT);
  const P0 = { x: 1500, y: 330 }, P2 = { x: 1585, y: rowY(1) + 4 };
  const cx = mix(mix(P0.x, FMT.x, m1), P2.x, m2) + kf(g, pt + 6, 12, CRAFT) * 30, cy = mix(mix(P0.y, FMT.y, m1), P2.y, m2) + kf(g, pt + 6, 12, CRAFT) * 40;
  const tap = (at: number) => (g < at ? 0 : g < at + 3 ? SNAP((g - at) / 3) : 1 - SNAP(clamp01((g - at - 3) / 5)));
  const press = Math.max(tap(sw), tap(pt));
  // the dropdown: opens on the click, the choice moves on "Portrait", closes into depth
  const open = kf(g, sw + 1, 8, SNAP), close = kf(g, pt + 6, 8, LEAVE), menuP = open * (1 - close);
  const hover = kf(g, pt - 5, 5, SNAP), sel = kf(g, pt, 6, SNAP);
  const picked = g >= pt + 1;
  // the reshape: CRAFT from 16:9 to 9:16 (through the aspect ratios), the canvas lifting a little meanwhile
  const rp = k(g, "w:the5-0.1", 0.9, CRAFT);
  const ar = Math.exp(mix(Math.log(16 / 9), Math.log(9 / 16), rp));
  const lift = k(g, "w:the5-0.2", 0.45, LAND) * (1 - k(g, "w:reshapes+0.25", 0.55, CRAFT));
  const xf = CRAFT(clamp01((rp - 0.47) / 0.22));
  const cb = canvasBox(PANE.w, PANE.h, ar), cr = canvasAt(ar);
  const settled = rp >= 1;
  const content = settled ? undefined : <FitFilm g={g} w={cb.w} h={cb.h} x={xf} />;
  return (
    <>
      <Studio g={g} chat={<ChatCalmer g={g} />} preview={<Preview w={PANE.w} h={PANE.h} ar={settled ? 9 / 16 : ar} s={fc.s} calm={fc.calm} format={picked ? "9:16 · Portrait" : undefined} content={content} />} />
      <Veil a={0.35 * lift} />
      {lift > 0.001 && <CanvasCard r={cr} lift={lift}><FitFilm g={g} w={cr.w} h={cr.h} x={xf} /></CanvasCard>}
      {menuP > 0 && <Menu sel={sel} hover={hover} style={{ transformOrigin: "85% 0", transform: `scale(${mix(0.92, 1, menuP)})`, opacity: clamp01(menuP * 1.5), filter: menuP < 1 ? `blur(${(1 - menuP) * 6}px)` : undefined }} />}
      {co > 0 && <Cursor x={cx} y={cy} press={press} o={co} />}
    </>
  );
};
