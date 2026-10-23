// Creoble v5 (Danish): the minimal Apple film. One small sage capsule (the thread) runs through the whole film and
// morphs into everything; one thing on screen at a time, centred, small, lots of cream. Kit additions on top of
// ./shared (springs, Liquid Glass, Island, BounceText, RollNumber, Toggle, Check, PillButton) and ./lib (C, fonts,
// eases). The clock: g = 30ths of a second, fractional at 60 fps; f("label") = a label's g.
import React from "react";
import { Img, staticFile } from "remotion";
import { C, HOLM, INOUT, OUT, SANS, SERIF, clamp01, mix } from "./lib";
import { f } from "./shared";

// ── sizes: the minimal rules (plan/storyboard.md) ────────────────────────────────────────────────────────────────
export const W = 1920, H = 1080, CX = 960, CY = 540;
export const MAX_W = 1150, MAX_H = 920;       // revision 1: bigger objects (one at a time), no bigger than this
export const TYPE = { head: 100, sub: 44, ui: 30, small: 24 };  // revision 1: bigger type  // Fraunces headline; DM Sans sub / UI / labels
export const SHADOW_SOFT = "0 1px 2px rgba(26,22,20,0.05), 0 18px 40px -18px rgba(26,22,20,0.22)";

// ── the thread capsule and the hand-offs ───────────────────────────────────────────────────────────────────────
export const PILL = { w: 200, h: 60 };
/** The thread: a sage capsule, centre (x, y), w × h, with a moving sheen (0..1) and an optional stretch. */
export const Pill: React.FC<{ x: number; y: number; w?: number; h?: number; sheen?: number; sx?: number; sy?: number; color?: string; children?: React.ReactNode; style?: React.CSSProperties }> =
  ({ x, y, w = PILL.w, h = PILL.h, sheen = 0, sx = 1, sy = 1, color = C.sage, children, style }) => (
  <div style={{ position: "absolute", left: x - w / 2, top: y - h / 2, width: w, height: h, borderRadius: h / 2, background: color,
    transform: `scale(${sx}, ${sy})`, overflow: "hidden", boxShadow: SHADOW_SOFT, display: "flex", alignItems: "center", justifyContent: "center", ...style }}>
    <div style={{ position: "absolute", inset: 0, background: `linear-gradient(105deg, rgba(255,255,255,0) ${mix(-40, 100, sheen)}%, rgba(255,255,255,0.38) ${mix(-25, 115, sheen)}%, rgba(255,255,255,0) ${mix(-10, 130, sheen)}%)` }} />
    {children}
  </div>
);
export const HANDOFF_HALF = 7.5;   // 0.25 s in g units
/** The hand-off at label `at` ("h1".."h4"): drawn identically by both builders for g in [f(at) - 7.5, f(at) + 7.5].
 * The capsule whips from x 760 to x 1160 through the centre, stretching with its speed, its sheen sweeping. */
export const handoffState = (g: number, at: string) => {
  const u = clamp01((g - (f(at) - HANDOFF_HALF)) / (2 * HANDOFF_HALF));
  const e = INOUT(u);
  const v = Math.sin(Math.PI * u);          // speed shape
  return { x: mix(760, 1160, e), y: CY, sx: 1 + 0.32 * v, sy: 1 - 0.12 * v, sheen: u, u };
};
export const Handoff: React.FC<{ g: number; at: string }> = ({ g, at }) => {
  const s = handoffState(g, at);
  return <Pill x={s.x} y={s.y} sx={s.sx} sy={s.sy} sheen={s.sheen} />;
};
/** true while the hand-off window at `at` is on */
export const inHandoff = (g: number, at: string) => Math.abs(g - f(at)) <= HANDOFF_HALF;

// ── never still: a hold that floats ────────────────────────────────────────────────────────────────────────────
/** A gentle float for anything that holds: y bob, a slow 3D sway. Returns a CSS transform. */
export const float = (g: number, seed = 0, amp = 1) => {
  const t = g / 30 + seed;
  return `translateY(${amp * 7 * Math.sin(t * 1.9)}px) rotateY(${amp * 7 * Math.sin(t * 1.3 + 0.7)}deg) rotateX(${amp * 3 * Math.sin(t * 1.1 + 2)}deg)`;
};

// ── the phone (minimal iPhone, ink frame, Dynamic Island) ──────────────────────────────────────────────────────
export const PHONE = { w: 300, h: 640, r: 50, bezel: 9 };
export const Phone: React.FC<{ x: number; y: number; scale?: number; transform?: string; island?: React.ReactNode; children?: React.ReactNode }> =
  ({ x, y, scale = 1, transform = "", island, children }) => (
  <div style={{ position: "absolute", left: x - PHONE.w / 2, top: y - PHONE.h / 2, width: PHONE.w, height: PHONE.h, transform: `perspective(1600px) ${transform} scale(${scale})`, transformStyle: "preserve-3d" }}>
    <div style={{ position: "absolute", inset: 0, borderRadius: PHONE.r, background: C.ink, boxShadow: "0 2px 4px rgba(26,22,20,0.10), 0 40px 70px -30px rgba(26,22,20,0.35)" }} />
    <div style={{ position: "absolute", inset: PHONE.bezel, borderRadius: PHONE.r - PHONE.bezel, overflow: "hidden", background: HOLM.bg }}>{children}</div>
    <div style={{ position: "absolute", left: PHONE.w / 2 - 45, top: 20, width: 90, height: 26, borderRadius: 13, background: "#000", display: "flex", alignItems: "center", justifyContent: "center" }}>{island}</div>
  </div>
);
export const SCREEN = { w: PHONE.w - 2 * PHONE.bezel, h: PHONE.h - 2 * PHONE.bezel };   // 282 × 622

// ── the example client's site, mobile (Holm Fysioterapi: fictional, its own slate teal, never Creoble's look) ─
/** build 0..1 cascades the blocks in; scroll in px; headline swaps text (the "change it" beat); booking 0..1 shows "Book tid". */
export const MiniSite: React.FC<{ build?: number; scroll?: number; headline?: string; booking?: number; highlight?: number }> =
  ({ build = 1, scroll = 0, headline = "Kom godt i bevægelse igen.", booking = 1, highlight = 0 }) => {
  const b = (i: number) => OUT(clamp01(build * 6 - i));
  const blk = (i: number, st: React.CSSProperties, ch: React.ReactNode) => (
    <div style={{ opacity: b(i), transform: `translateY(${(1 - b(i)) * 14}px)`, ...st }}>{ch}</div>
  );
  const photo = (src: string, h: number) => <div style={{ height: h, borderRadius: 16, overflow: "hidden" }}><Img src={staticFile(`img/${src}`)} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>;
  return (
    <div style={{ width: SCREEN.w, height: SCREEN.h, background: HOLM.bg, fontFamily: SANS, color: HOLM.ink, overflow: "hidden", position: "relative" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: SCREEN.w, transform: `translateY(${-scroll}px)`, padding: "58px 20px 0", boxSizing: "border-box" }}>
        {blk(0, { display: "flex", alignItems: "center", gap: 8, marginBottom: 22 }, <>
          <div style={{ width: 22, height: 22, borderRadius: 7, background: HOLM.accent, color: "#fff", fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>H</div>
          <div style={{ fontSize: 14, fontWeight: 600 }}>Holm Fysioterapi</div><div style={{ flex: 1 }} />
          <div style={{ width: 18, height: 2, background: HOLM.ink, boxShadow: `0 5px 0 ${HOLM.ink}, 0 -5px 0 ${HOLM.ink}` }} /></>)}
        {blk(1, { fontSize: 31, fontWeight: 600, letterSpacing: "-0.03em", lineHeight: 1.05, marginBottom: 12, position: "relative" }, <>
          <span style={{ background: `rgba(135,168,158,${0.35 * highlight})`, borderRadius: 6, boxShadow: highlight > 0 ? `0 0 0 2px rgba(135,168,158,${0.9 * highlight})` : undefined }}>{headline}</span></>)}
        {blk(2, { fontSize: 13, lineHeight: 1.5, color: HOLM.muted, marginBottom: 16 }, "Fysioterapi og genoptræning på Frederiksberg.")}
        {blk(3, { marginBottom: 16 }, photo("holm-shoulder.jpg", 190))}
        {blk(4, { display: "flex", gap: 8, marginBottom: 22 }, <>
          <div style={{ height: 40, padding: "0 16px", borderRadius: 999, background: HOLM.accent, color: "#fff", fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", opacity: booking }}>Book tid</div>
          <div style={{ height: 40, padding: "0 16px", borderRadius: 999, border: `1.5px solid ${HOLM.ink}22`, fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center" }}>Behandlinger</div></>)}
        {[["Fysioterapi", "holm-neck.jpg"], ["Massage", "holm-calves.jpg"], ["Genoptræning", "holm-shoulder.jpg"]].map(([t, src], i) =>
          blk(5 + i * 0.3, { marginBottom: 12, background: "#fff", borderRadius: 16, overflow: "hidden" }, <div key={t}>
            {photo(src, 110)}<div style={{ padding: "10px 14px", fontSize: 15, fontWeight: 600 }}>{t}</div></div>))}
      </div>
    </div>
  );
};

// ── type ────────────────────────────────────────────────────────────────────────────────────────────────────────
/** One short line, centred at (x, y): blur-to-sharp rise per word on p (0..1), out (0..1) blurs it away upward. */
export const Line: React.FC<{ text: string; x?: number; y: number; p: number; out?: number; size?: number; serif?: boolean; color?: string; italicWords?: string[] }> =
  ({ text, x = CX, y, p, out = 0, size = TYPE.head, serif = true, color = C.ink, italicWords = [] }) => {
  const words = text.split(" ");
  return (
    <div style={{ position: "absolute", left: x - 900, top: y - size * 0.62, width: 1800, textAlign: "center", fontFamily: serif ? SERIF : SANS, fontSize: size,
      fontWeight: serif ? 400 : 500, letterSpacing: serif ? "-0.025em" : "-0.01em", color, lineHeight: 1.15, whiteSpace: "nowrap",
      opacity: 1 - out, transform: `translateY(${-28 * out}px)`, filter: out > 0 ? `blur(${10 * out}px)` : undefined }}>
      {words.map((w, i) => {
        const q = OUT(clamp01(p * (words.length + 2) - i * 1.0));
        const it = italicWords.includes(w.replace(/[.,?!]/g, ""));
        return <span key={i} style={{ display: "inline-block", marginRight: "0.26em", opacity: q, transform: `translateY(${(1 - q) * 22}px)`,
          filter: q < 1 ? `blur(${(1 - q) * 8}px)` : undefined, fontStyle: it ? "italic" : "normal", color: it ? C.sageDeep : undefined }}>{w}</span>;
      })}
    </div>
  );
};
export { C, HOLM, SERIF, SANS };
