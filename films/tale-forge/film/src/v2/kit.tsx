// v2 building blocks, all light, depth and paper (no drawn lines): picture coordinates, light pools, full-frame page
// turns at the gutter, a rack focus between two halves of one painting, scrims under captions.
import React from "react";
import { AbsoluteFill } from "remotion";
import { C, SOFT, clamp01, lerp } from "../lib";
import { Glow } from "../parts";

/** Where an image point (px, py, 0..1) lands on screen for a Plate of this aspect, scale and focus. */
export const at = (aspect: number, s: number, fx: number, fy: number, px: number, py: number) => {
  const w0 = Math.max(1920, 1080 * aspect), h0 = w0 / aspect;
  return { x: 960 + (px - fx) * w0 * s, y: 540 + (py - fy) * h0 * s };
};

export const SHADOW = "0 2px 18px rgba(12,10,31,0.6)";
export const Band: React.FC<{ o?: number }> = ({ o = 1 }) => (
  <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 330, opacity: o, background: "linear-gradient(180deg, rgba(12,10,31,0) 0%, rgba(12,10,31,0.6) 55%, rgba(12,10,31,0.76) 100%)" }} />
);
export const TopScrim: React.FC<{ o?: number }> = ({ o = 1 }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 240, opacity: o, background: "linear-gradient(180deg, rgba(12,10,31,0.68) 0%, rgba(12,10,31,0) 100%)" }} />
);

/** A soft pool of light on a point: the rest of the picture dims, the point lifts. k 0..1. */
export const LightPool: React.FC<{ x: number; y: number; r: number; k: number; dim?: number; lift?: number; warm?: string }> = ({ x, y, r, k, dim = 0.22, lift = 0.3, warm = "rgba(255,232,190,1)" }) => {
  if (k <= 0) return null;
  return (
    <>
      <AbsoluteFill style={{ background: `radial-gradient(circle ${r * 1.6}px at ${x}px ${y}px, rgba(12,10,31,0) 45%, rgba(12,10,31,${dim}) 100%)`, opacity: k }} />
      <Glow x={x} y={y} r={r} color={warm} opacity={lift * k} />
    </>
  );
};

/** A full-frame page turn at the gutter (x 960): the right half of `from` turns over and lands as the left half of
 *  `to`. k 0..1. Both children are full-frame (1920×1080) pictures. */
export const PageTurn: React.FC<{ k: number; from: React.ReactNode; to: React.ReactNode }> = ({ k, from, to }) => {
  if (k <= 0) return <AbsoluteFill>{from}</AbsoluteFill>;
  if (k >= 1) return <AbsoluteFill>{to}</AbsoluteFill>;
  const e = SOFT(k), ang = -180 * e, shade = Math.sin(Math.PI * e);
  const half = (side: "L" | "R", node: React.ReactNode) => (
    <div style={{ position: "absolute", top: 0, left: side === "L" ? 0 : 960, width: 960, height: 1080, overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: side === "L" ? 0 : -960, width: 1920, height: 1080 }}>{node}</div>
    </div>
  );
  return (
    <AbsoluteFill style={{ perspective: 2800, perspectiveOrigin: "960px 540px" }}>
      {half("L", from)}
      {half("R", to)}
      {/* the shadow the turning leaf casts on the page beneath */}
      <div style={{ position: "absolute", top: 0, left: e < 0.5 ? 960 : 0, width: 960, height: 1080, opacity: 0.45 * shade,
        background: e < 0.5 ? "linear-gradient(90deg, rgba(10,6,20,0.8), rgba(10,6,20,0) 70%)" : "linear-gradient(270deg, rgba(10,6,20,0.8), rgba(10,6,20,0) 70%)" }} />
      <div style={{ position: "absolute", top: 0, left: 960, width: 960, height: 1080, transformOrigin: "0% 50%", transform: `rotateY(${ang}deg)`, transformStyle: "preserve-3d" }}>
        <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, left: -960, width: 1920, height: 1080 }}>{from}</div>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(10,6,20,1), rgba(10,6,20,0) 60%)", opacity: 0.35 * shade }} />
        </div>
        <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: "rotateY(180deg)", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, left: 0, width: 1920, height: 1080 }}>{to}</div>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(270deg, rgba(10,6,20,1), rgba(10,6,20,0) 60%)", opacity: 0.35 * shade }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** The gutter of a double page at x 960: a soft fold shadow. */
export const Gutter: React.FC<{ o?: number }> = ({ o = 1 }) => (
  <div style={{ position: "absolute", top: 0, left: 920, width: 80, height: 1080, opacity: o, mixBlendMode: "multiply",
    background: "linear-gradient(90deg, rgba(40,24,10,0) 0%, rgba(40,24,10,0.18) 50%, rgba(40,24,10,0) 100%)" }} />
);

/** One picture seen as two halves with their own focus and light (a rack focus across the gutter). */
export const Halves: React.FC<{ left: React.CSSProperties; right: React.CSSProperties; children: React.ReactNode }> = ({ left, right, children }) => {
  const m = (dir: string) => `linear-gradient(${dir}, #000 0%, #000 44%, transparent 56%)`;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ WebkitMaskImage: m("90deg"), maskImage: m("90deg"), ...left }}>{children}</AbsoluteFill>
      <AbsoluteFill style={{ WebkitMaskImage: m("270deg"), maskImage: m("270deg"), ...right }}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};

export const grade = (sat: number, bri: number) => `saturate(${sat}) brightness(${bri})`;
export { C, clamp01, lerp };
