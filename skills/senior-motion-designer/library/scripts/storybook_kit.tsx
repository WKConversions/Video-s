// The storybook kit for Remotion: a picture book told with the client's own paintings, light, depth and paper, no
// drawn lines (made for the Tale Forge film v2, October 2026; see production/remotion.md "Storybook films").
// Copy into the project's src/, put storybook_blot.png and storybook_grain.png in public/img/ as blot.png and grain.png.
//   Plate       a full-frame painting placed by a focus point and scale, scaled with a transform (glides, never steps)
//   at()        where a point of a painting lands on screen for a Plate (place lights, labels, lenses by the picture)
//   Glow        soft screen-blended light; LightPool: a pool of light on a point, the rest dimmed (attention by light)
//   PaintBloom  a watercolour bloom: the next picture grows inside a blot-shaped mask out of a named point
//   PageTurn    a full-frame page turn at the gutter: the right half of one picture turns over onto the next
//   Gutter      the fold shadow that makes a full-frame painting read as a double page
//   Halves      one painting as two halves with their own focus and light: a rack focus across the gutter
//   Band, TopScrim  scrims under bottom and top captions
// Patterns that worked: the next scene blooms out of an object in this one (a face, a book, a window); a page turn
// carries a moment from one page to the next; a rack focus shows the other side of the same moment; a book draws
// back from full frame into an object, closes and opens again; the light, not the camera, moves attention.
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const bez = (x1: number, y1: number, x2: number, y2: number) => (t: number) => {
  // cubic-bezier easing, solved for x by Newton steps
  let u = t;
  for (let i = 0; i < 6; i++) {
    const x = 3 * (1 - u) * (1 - u) * u * x1 + 3 * (1 - u) * u * u * x2 + u * u * u - t;
    const dx = 3 * (1 - u) * (1 - u) * x1 + 6 * (1 - u) * u * (x2 - x1) + 3 * u * u * (1 - x2);
    if (Math.abs(dx) < 1e-6) break;
    u = clamp01(u - x / dx);
  }
  return 3 * (1 - u) * (1 - u) * u * y1 + 3 * (1 - u) * u * u * y2 + u * u * u;
};
export const SETTLE = bez(0.2, 0.7, 0.3, 1), SOFT = bez(0.45, 0, 0.55, 1), MOVE = bez(0.65, 0, 0.35, 1);
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
/** eased 0..1 between frames a and b */
export const tw = (g: number, a: number, b: number, e = SETTLE) => e(clamp01((g - a) / Math.max(1, b - a)));
const img = (n: string) => staticFile(`img/${n}`);

/** A full-frame picture that covers 1920×1080, positioned by a normalized focus point and scale. A fixed layout size
 *  scaled with a transform: a slow push glides instead of stepping a pixel at a time. */
export const Plate: React.FC<{ src: string; s?: number; fx?: number; fy?: number; aspect: number; style?: React.CSSProperties }> = ({ src, s = 1, fx = 0.5, fy = 0.5, aspect, style }) => {
  const w0 = Math.max(1920, 1080 * aspect), h0 = w0 / aspect;
  const x = 960 - fx * w0 * s, y = 540 - fy * h0 * s;
  return <Img src={img(src)} style={{ position: "absolute", left: 0, top: 0, width: w0, height: h0, transformOrigin: "0 0", transform: `translate(${x}px, ${y}px) scale(${s})`, willChange: "transform", ...style }} />;
};

/** Soft radial light (screen-blended), for lamps, windows and a book's glow. */
export const Glow: React.FC<{ x: number; y: number; r: number; color: string; opacity?: number; blend?: React.CSSProperties["mixBlendMode"] }> = ({ x, y, r, color, opacity = 1, blend = "screen" }) => (
  <div style={{ position: "absolute", left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: "50%", background: `radial-gradient(circle, ${color} 0%, transparent 70%)`, opacity, mixBlendMode: blend, pointerEvents: "none" }} />
);

/** A watercolour paint bloom: the children grow inside a blot-shaped mask out of (x, y). k 0..1. */
export const PaintBloom: React.FC<{ k: number; x: number; y: number; r: number; children: React.ReactNode }> = ({ k, x, y, r, children }) => {
  if (k <= 0) return null;
  if (k >= 1) return <AbsoluteFill>{children}</AbsoluteFill>;
  const size = 2 * r * SETTLE(k) * 1.25, m = `url(${img("blot.png")})`;
  return (
    <AbsoluteFill style={{ WebkitMaskImage: m, maskImage: m, WebkitMaskRepeat: "no-repeat", maskRepeat: "no-repeat", WebkitMaskSize: `${size}px ${size}px`, maskSize: `${size}px ${size}px`,
      WebkitMaskPosition: `${x - size / 2}px ${y - size / 2}px`, maskPosition: `${x - size / 2}px ${y - size / 2}px` }}>{children}</AbsoluteFill>
  );
};

/** Paper grain over everything: unifies upscaled paintings (watercolour tolerates about 2-2.5× with grain). */
export const Grain: React.FC<{ o?: number }> = ({ o = 0.12 }) => <AbsoluteFill style={{ backgroundImage: `url(${img("grain.png")})`, mixBlendMode: "overlay", opacity: o }} />;

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
