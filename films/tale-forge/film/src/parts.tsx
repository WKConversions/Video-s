// Shared pieces of the Tale Forge stage: stars (the site's starfield twinkle), sparkles (the site's four-point
// sparkle), storybook captions (Lora, word by word on the spoken words), glass chips (the site's --card glass),
// paint blooms (a watercolour blot mask growing out of a point) and light blooms (gold glow out of an object).
import React from "react";
import { Img, staticFile } from "remotion";
import { C, F, SETTLE, SOFT, clamp01, float, lerp, rand, tw } from "./lib";
import { T } from "./clock";

export const img = (n: string) => staticFile(`img/${n}`);

/** A full-frame picture that covers 1920×1080, positioned by a normalized focus point and scale. */
export const Plate: React.FC<{ src: string; s?: number; fx?: number; fy?: number; aspect: number; style?: React.CSSProperties; name?: string }> = ({ src, s = 1, fx = 0.5, fy = 0.5, aspect, style, name }) => {
  // cover: width = max(1920, 1080*aspect)
  // a fixed layout size, scaled with a transform: a slow push glides instead of stepping a pixel at a time
  const w0 = Math.max(1920, 1080 * aspect), h0 = w0 / aspect;
  const x = 960 - fx * w0 * s, y = 540 - fy * h0 * s;
  return <Img data-name={name} src={img(src)} style={{ position: "absolute", left: 0, top: 0, width: w0, height: h0, transformOrigin: "0 0", transform: `translate(${x}px, ${y}px) scale(${s})`, willChange: "transform", ...style }} />;
};

/** Seeded starfield; each star twinkles on the site's 4.6 s ease-in-out (.95 → .55), phases spread. */
export const Stars: React.FC<{ g: number; n?: number; h?: number; seed?: number; opacity?: number }> = ({ g, n = 80, h = 700, seed = 1, opacity = 1 }) => (
  <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, opacity }}>
    {Array.from({ length: n }, (_, i) => {
      const x = rand(i * 3 + seed) * 1920, y = Math.pow(rand(i * 7 + seed * 5), 1.4) * h;
      const r = 0.8 + rand(i * 11 + seed) * 1.8;
      const tw4 = 0.75 + float(g, 0.2, 4.6, rand(i + seed * 13) * 4.6);
      const big = rand(i * 17 + seed) > 0.9;
      return (
        <g key={i} opacity={tw4}>
          {big && <circle cx={x} cy={y} r={r * 4} fill="rgba(255,240,200,0.12)" />}
          <circle cx={x} cy={y} r={r} fill={big ? C.goldPale : "#F4EEFF"} />
        </g>
      );
    })}
  </svg>
);

/** The site's four-point sparkle (derived/icons/svg/motif-four-point-sparkle.svg) as a filled star. */
export const Sparkle: React.FC<{ x: number; y: number; r: number; color?: string; opacity?: number; rot?: number }> = ({ x, y, r, color = C.goldSoft, opacity = 1, rot = 0 }) => (
  <svg width={r * 2} height={r * 2} viewBox="-10 -10 20 20" style={{ position: "absolute", left: x - r, top: y - r, opacity, transform: `rotate(${rot}deg)`, overflow: "visible" }}>
    <path d="M0 -10 C 1 -3 3 -1 10 0 C 3 1 1 3 0 10 C -1 3 -3 1 -10 0 C -3 -1 -1 -3 0 -10 Z" fill={color} style={{ filter: `drop-shadow(0 0 ${r * 0.18}px ${color})` }} />
  </svg>
);

/** A burst of sparkles rising out of a point: magic leaving an object. k is 0..1 progress. */
export const Burst: React.FC<{ k: number; x: number; y: number; n?: number; spread?: number; rise?: number; seed?: number; size?: number; color?: string }> = ({ k, x, y, n = 18, spread = 260, rise = 220, seed = 3, size = 14, color }) => {
  if (k <= 0 || k >= 1) return null;
  return (
    <>
      {Array.from({ length: n }, (_, i) => {
        const a = rand(i * 5 + seed) * Math.PI * 2, d = (0.35 + rand(i * 9 + seed) * 0.65) * spread;
        const life = clamp01((k - rand(i * 3 + seed) * 0.25) / 0.75);
        const e = SETTLE(life);
        const px = x + Math.cos(a) * d * e, py = y + Math.sin(a) * d * 0.55 * e - rise * life * (0.5 + rand(i + seed) * 0.5);
        const o = life <= 0 ? 0 : Math.sin(Math.PI * Math.min(1, life * 1.05));
        return <Sparkle key={i} x={px} y={py} r={size * (0.4 + rand(i * 13 + seed) * 0.8)} opacity={o} rot={life * 90} color={color} />;
      })}
    </>
  );
};

/** Soft radial light (screen-blended), for lamps, windows and the book's glow. */
export const Glow: React.FC<{ x: number; y: number; r: number; color: string; opacity?: number; blend?: React.CSSProperties["mixBlendMode"] }> = ({ x, y, r, color, opacity = 1, blend = "screen" }) => (
  <div style={{ position: "absolute", left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: "50%", background: `radial-gradient(circle, ${color} 0%, transparent 70%)`, opacity, mixBlendMode: blend, pointerEvents: "none" }} />
);

/** A watercolour paint bloom: the child grows inside a blot-shaped mask out of (x, y). k 0..1. */
export const PaintBloom: React.FC<{ k: number; x: number; y: number; r: number; children: React.ReactNode; name?: string }> = ({ k, x, y, r, children, name }) => {
  if (k <= 0) return null;
  if (k >= 1) return <div data-name={name} style={{ position: "absolute", inset: 0 }}>{children}</div>;
  const size = 2 * r * SETTLE(k) * 1.25;
  const m = `url(${img("blot.png")})`;
  return (
    <div data-name={name} style={{ position: "absolute", inset: 0, WebkitMaskImage: m, maskImage: m, WebkitMaskRepeat: "no-repeat", maskRepeat: "no-repeat",
      WebkitMaskSize: `${size}px ${size}px`, maskSize: `${size}px ${size}px`, WebkitMaskPosition: `${x - size / 2}px ${y - size / 2}px`, maskPosition: `${x - size / 2}px ${y - size / 2}px` }}>
      {children}
    </div>
  );
};

/** A storybook caption: Lora words that rise out of a soft blur on their spoken words, then leave together. */
export type Word = { t: string; at: string | number; gold?: boolean; violet?: boolean };
export const Say: React.FC<{ g: number; words: Word[]; x: number; y: number; size: number; out: string | number; color?: string; align?: "left" | "center"; weight?: number; width?: number; shadow?: string; lead?: number; name?: string; lh?: number }> = ({
  g, words, x, y, size, out, color = C.warm, align = "left", weight = 600, width = 1600, shadow, lead = 0.12, name, lh = 1.12,
}) => {
  const outK = tw(g, T.f(out), T.f(out) + 12, SOFT);
  if (outK >= 1) return null;
  return (
    <div data-name={name} style={{ position: "absolute", left: align === "center" ? x - width / 2 : x, top: y, width, textAlign: align, fontFamily: F.display, fontWeight: weight, fontSize: size, lineHeight: lh, letterSpacing: "-0.01em", color, opacity: 1 - outK, textShadow: shadow, transform: `translateY(${-outK * 10}px)` }}>
      {words.map((w, i) => {
        const a = T.f(w.at) - Math.round(lead * 30);
        const k = tw(g, a, a + 14, SETTLE);
        const accent = w.gold ? C.goldSoft : w.violet ? C.violet : undefined;
        return (
          <span key={i} style={{ display: "inline-block", whiteSpace: "pre", opacity: k, transform: `translateY(${(1 - k) * 18}px)`, filter: k < 1 ? `blur(${(1 - k) * 6}px)` : undefined, willChange: "transform",
            ...(accent ? { color: accent } : {}) }}>
            {w.t}{i < words.length - 1 ? " " : ""}
          </span>
        );
      })}
    </div>
  );
};

/** A glass chip / pill in the site's natt style: --card glass, --card-line border, Schibsted Grotesk. */
export const Chip: React.FC<{ children: React.ReactNode; style?: React.CSSProperties; light?: boolean; size?: number; name?: string }> = ({ children, style, light, size = 30, name }) => (
  <div data-name={name} style={{ position: "absolute", display: "inline-flex", alignItems: "center", gap: size * 0.4, padding: `${size * 0.42}px ${size * 0.8}px`, borderRadius: 999,
    background: light ? "rgba(255,255,255,0.86)" : C.card, border: `1.5px solid ${light ? "rgba(109,79,224,0.22)" : C.cardLine}`, backdropFilter: "blur(22px)",
    color: light ? C.plum : C.cardInk, fontFamily: F.ui, fontWeight: 700, fontSize: size, letterSpacing: "0.01em", whiteSpace: "nowrap", boxShadow: light ? "0 10px 30px rgba(36,31,53,0.14)" : "0 14px 34px rgba(5,8,20,0.38)", ...style }}>
    {children}
  </div>
);

/** Rise-in of an element (the site's tfStartIn: 22 px, settle curve), and a soft exit. */
export const rise = (g: number, at: string | number, out?: string | number, dist = 22, dur = 0.45) => {
  const k = tw(g, T.f(at), T.f(at) + Math.round(dur * 30), SETTLE);
  const o = out === undefined ? 0 : tw(g, T.f(out), T.f(out) + 10, SOFT);
  return { opacity: k * (1 - o), transform: `translateY(${(1 - k) * dist}px)` };
};
export const vis = (g: number, a: string | number, b: string | number) => g >= T.f(a) - 2 && g <= T.f(b) + 2;
export { lerp, clamp01 };
