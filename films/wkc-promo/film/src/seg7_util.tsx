// Segment 7 helpers: per-frame tables, glyph layout for per-character reveals, SVG blur filters.
import React from "react";
import { tw } from "./kit";
import { F } from "./lib";

/** Inter Tight cap height in em */
export const CAP = 0.727;
export const fsCap = (cap: number) => cap / CAP;
export const TRACK = -0.05;

/** a per-frame table starting at frame f0 (linear between frames, clamped at the ends) */
export const seqv = (g: number, f0: number, v: number[]) => {
  const x = g - f0;
  if (x <= 0) return v[0];
  if (x >= v.length - 1) return v[v.length - 1];
  const i = Math.floor(x), t = x - i;
  return v[i] + (v[i + 1] - v[i]) * t;
};

/** x offsets of each character from the line's left edge and the line width (kerning kept, tracking applied) */
export const glyphs = (text: string, size: number, weight = 800, family: string = F.head, track = TRACK) => {
  const xs: number[] = [];
  for (let i = 0; i < text.length; i++) xs.push(tw(text.slice(0, i), size, weight, family) + i * track * size);
  const w = tw(text, size, weight, family) + (text.length - 1) * track * size;
  return { xs, w };
};

/** an SVG Gaussian blur filter (sx horizontal, sy vertical) with a generous region */
export const Blur: React.FC<{ id: string; sx: number; sy?: number }> = ({ id, sx, sy }) => (
  <filter id={id} x="-40%" y="-150%" width="180%" height="400%" colorInterpolationFilters="sRGB">
    <feGaussianBlur stdDeviation={`${Math.max(0, sx)} ${Math.max(0, sy ?? sx)}`} />
  </filter>
);

/**
 * A line of type drawn glyph by glyph (SVG), left edge x0, baseline y. op(i) / blur(i) per glyph index
 * (gi counts the glyphs that are not spaces, starting at i0).
 */
export const GlyphLine: React.FC<{
  text: string; size: number; x0: number; y: number; idp: string; i0?: number; weight?: number; family?: string; track?: number;
  fill?: string; op?: (i: number) => number; blur?: (i: number) => number;
}> = ({ text, size, x0, y, idp, i0 = 0, weight = 800, family = F.head, track = TRACK, fill = "#FFFFFF", op, blur }) => {
  const { xs } = glyphs(text, size, weight, family, track);
  const out: React.ReactNode[] = [];
  let gi = i0;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === " ") continue;
    const o = op ? op(gi) : 1, b = blur ? blur(gi) : 0;
    if (o > 0.003) {
      const fid = `${idp}-${gi}`;
      out.push(
        <g key={i}>
          {b > 0.15 && <defs><Blur id={fid} sx={b} /></defs>}
          <text x={x0 + xs[i]} y={y} fill={fill} fillOpacity={o} filter={b > 0.15 ? `url(#${fid})` : undefined}
            style={{ fontFamily: family, fontWeight: weight, fontSize: size }}>{ch}</text>
        </g>,
      );
    }
    gi++;
  }
  return <>{out}</>;
};
