// Group D helpers: content that really scrolls (feeds, streaming text lines, a page recording). Pure functions of t.
import React from "react";
import { C, GRAD, SHADOW, rnd } from "../kit";

const PAL = [C.indigo, C.coral, C.amber, C.mint, C.violet, C.cyan, C.green];
const FADE = "linear-gradient(to bottom, transparent 0, #000 36px, #000 calc(100% - 28px), transparent 100%)";
/** scroll offset in px: eased start, then constant speed */
export const scrollOff = (t: number, t0: number, speed: number) => {
  const tau = Math.max(0, t - t0);
  return speed * (tau - 0.15 * (1 - Math.exp(-tau / 0.15)));
};

/** a feed of solid rows (coloured tile, bold bar, sub bar, status dot) scrolling upward */
export const RowFeed: React.FC<{ t: number; t0?: number; x: number; y: number; w: number; h: number; speed?: number; pitch?: number; seed?: number; card?: boolean; style?: React.CSSProperties }> =
  ({ t, t0 = -0.3, x, y, w, h, speed = 500, pitch = 100, seed = 0, card = true, style }) => {
    const off = scrollOff(t, t0, speed), base = Math.floor(off / pitch), frac = off - base * pitch;
    const n = Math.ceil(h / pitch) + 2;
    return (
      <div style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: 30, overflow: "hidden", background: card ? C.white : "transparent", boxShadow: card ? SHADOW.card : "none", border: card ? `1px solid ${C.line}` : "none", ...style }}>
        <div style={{ position: "absolute", inset: 0, WebkitMaskImage: FADE, maskImage: FADE }}>
          {Array.from({ length: n }).map((_, i) => {
            const g = base + i, r1 = rnd(g * 7 + seed), r2 = rnd(g * 13 + seed + 3), col = PAL[Math.floor(r1 * 7) % 7];
            const tile = pitch - 34;
            return (
              <div key={i} style={{ position: "absolute", left: 16, top: i * pitch - frac + 8, width: w - 32, height: pitch - 16, borderRadius: 22, background: "#F1F4FA" }}>
                <div style={{ position: "absolute", left: 10, top: 9, width: tile, height: tile, borderRadius: 16, background: col }} />
                <div style={{ position: "absolute", left: tile + 30, top: 14, width: (w - tile - 150) * (0.55 + 0.45 * r2), height: 24, borderRadius: 12, background: C.navy }} />
                <div style={{ position: "absolute", left: tile + 30, top: 50, width: (w - tile - 150) * (0.3 + 0.4 * r1), height: 14, borderRadius: 7, background: "#BFC8DC" }} />
                <div style={{ position: "absolute", right: 18, top: (pitch - 16 - 34) / 2, width: 34, height: 34, borderRadius: "50%", background: r2 > 0.4 ? C.green : C.amber }} />
              </div>
            );
          })}
        </div>
      </div>
    );
  };

/** streaming answer text on a dark panel: lines (white / cyan segments) that write in at the bottom and scroll up */
export const LineFeed: React.FC<{ t: number; t0?: number; x: number; y: number; w: number; h: number; speed?: number; pitch?: number; bar?: number }> =
  ({ t, t0 = -0.3, x, y, w, h, speed = 560, pitch = 52, bar = 28 }) => {
    const off = scrollOff(t, t0, speed), base = Math.floor(off / pitch), frac = off - base * pitch;
    const n = Math.ceil(h / pitch) + 2;
    return (
      <div style={{ position: "absolute", left: x, top: y, width: w, height: h, overflow: "hidden", WebkitMaskImage: FADE, maskImage: FADE }}>
        {Array.from({ length: n }).map((_, i) => {
          const g = base + i, k = ((g % 6) + 6) % 6, yy = i * pitch - frac;
          const reveal = Math.max(0, Math.min(1, (h - yy - 4) / 90));
          const head = k === 0, shortL = k === 5;
          const total = head ? 0.5 : shortL ? 0.3 + 0.3 * rnd(g) : 0.86 + 0.14 * rnd(g * 3);
          const cut = 0.35 + 0.3 * rnd(g * 5 + 1), hasHi = !head && rnd(g * 11) > 0.55;
          return (
            <div key={i} style={{ position: "absolute", left: 0, top: yy, width: w * total * reveal, height: bar, overflow: "hidden", whiteSpace: "nowrap" }}>
              {head ? <div style={{ width: w * total, height: bar, borderRadius: bar / 2, background: C.cyan }} /> : (
                <div style={{ display: "flex", gap: 14, width: w * total }}>
                  <div style={{ flex: hasHi ? cut : 1, height: bar, borderRadius: bar / 2, background: "rgba(255,255,255,.88)" }} />
                  {hasHi && <div style={{ flex: 0.22, height: bar, borderRadius: bar / 2, background: g % 2 ? C.cyan : "#A99BFF" }} />}
                  {hasHi && <div style={{ flex: 1 - cut - 0.22, height: bar, borderRadius: bar / 2, background: "rgba(255,255,255,.88)" }} />}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

/** one page of a long landing page (800 x 1500), solid bold blocks: the "recording" that plays inside the video frames */
export const PL = 1500;
const PageBlock: React.FC = () => {
  const B = (x: number, y: number, w: number, h: number, bg: string, r = 16, st?: React.CSSProperties, ch?: React.ReactNode) => (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: r, background: bg, ...st }}>{ch}</div>
  );
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 800, height: PL }}>
      {B(30, 24, 740, 290, GRAD.brand, 30)}
      {B(70, 70, 380, 42, "#fff", 21)}{B(70, 128, 280, 36, "rgba(255,255,255,.8)", 18)}{B(70, 224, 210, 60, C.navy, 30)}
      {B(560, 60, 170, 170, "rgba(255,255,255,.92)", 85)}{B(600, 100, 90, 90, C.navy, 45)}
      {[GRAD.growth, GRAD.ai, GRAD.warm].map((g, i) => B(30 + i * 250, 350, 240, 240, g, 28, undefined, <>
        {B(28, 28, 64, 64, "#fff", 32)}{B(28, 126, 160, 24, "#fff", 12)}{B(28, 166, 110, 18, "rgba(255,255,255,.7)", 9)}</>))}
      {B(30, 630, 740, 380, C.muted, 30)}
      {[120, 180, 150, 250, 200, 300, 260, 340, 310].map((h, i) => B(52 + i * 78, 990 - h, 56, h, [C.indigo, C.cyan, C.mint][i % 3], 14))}
      {B(30, 1040, 360, 150, C.coral, 28, undefined, <>{B(26, 28, 200, 26, "#fff", 13)}{B(26, 74, 130, 18, "rgba(255,255,255,.75)", 9)}</>)}
      {B(410, 1040, 360, 150, C.violet, 28, undefined, <>{B(26, 28, 200, 26, "#fff", 13)}{B(26, 74, 130, 18, "rgba(255,255,255,.75)", 9)}</>)}
      {B(30, 1220, 740, 250, GRAD.navy, 30)}{B(70, 1268, 400, 40, "#fff", 20)}{B(70, 1340, 250, 70, C.cyan, 35)}
    </div>
  );
};
/** a looping page recording at scroll offset `off` (px of the 800 x 450 design frame) */
export const VPage: React.FC<{ off: number }> = ({ off }) => {
  const o = off % PL;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 800, height: 450, overflow: "hidden", background: "#fff" }}>
      <div style={{ position: "absolute", left: 0, top: -o }}><PageBlock /></div>
      <div style={{ position: "absolute", left: 0, top: PL - o }}><PageBlock /></div>
    </div>
  );
};
