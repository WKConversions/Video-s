// Gold crayon doodles that draw themselves: the child's feelings drawn over the storybook, the way a child would.
// Each stroke draws on with pathLength/dashoffset on the settle curve; a turbulence filter roughens the line like crayon.
import React from "react";
import { C, SETTLE, SOFT, clamp01, lerp, tw } from "../lib";

/** One svg layer holding doodles; children are <Stroke>s. */
export const DoodleLayer: React.FC<{ children: React.ReactNode; opacity?: number; style?: React.CSSProperties; name?: string; id?: string }> = ({ children, opacity = 1, style, name, id = "crayon" }) => (
  <svg data-name={name} width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", left: 0, top: 0, opacity, overflow: "visible", ...style }}>
    <defs>
      <filter id={id} x="-10%" y="-10%" width="120%" height="120%">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={4} result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale={2.6} xChannelSelector="R" yChannelSelector="G" result="d" />
        <feGaussianBlur in="d" stdDeviation={0.35} result="b" />
        <feMerge><feMergeNode in="b" /></feMerge>
      </filter>
      <filter id={`${id}-glow`} x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation={5} result="g" />
        <feMerge><feMergeNode in="g" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
    </defs>
    <g filter={`url(#${id}-glow)`}><g filter={`url(#${id})`}>{children}</g></g>
  </svg>
);

/** A stroke that draws on between frames a and b (eased), optionally fading out after `out`. */
export const Stroke: React.FC<{ d: string; g: number; a: number; b: number; color?: string; w?: number; out?: number; outDur?: number; fill?: string; fillAt?: number; dash?: string; halo?: string }> = ({
  d, g, a, b, color = C.goldSoft, w = 6, out, outDur = 10, fill, fillAt, dash, halo,
}) => {
  const k = tw(g, a, b, SETTLE);
  if (k <= 0) return null;
  const o = out === undefined ? 1 : 1 - tw(g, out, out + outDur, SOFT);
  if (o <= 0) return null;
  const fk = fill && fillAt !== undefined ? tw(g, fillAt, fillAt + 8, SOFT) : 0;
  return (
    <g opacity={o}>
      {fill && fk > 0 && <path d={d} fill={fill} opacity={fk} stroke="none" />}
      {halo && !dash && <path d={d} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - k} stroke={halo} strokeWidth={w + 9} strokeLinecap="round" strokeLinejoin="round" fill="none" opacity={0.7} />}
      <path d={d} pathLength={1} strokeDasharray={dash ? undefined : "1 1"} strokeDashoffset={dash ? undefined : 1 - k} stroke={color} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" fill="none"
        style={dash ? { strokeDasharray: dash, opacity: k } : undefined} />
    </g>
  );
};

/** A soft spring pop for small playful things (the brief asks for playful motion): overshoot 8 %, settle. */
export const pop = (g: number, a: number, dur = 12) => {
  const t = clamp01((g - a) / dur);
  if (t <= 0) return 0;
  const s = 1 - Math.pow(1 - t, 3);
  return s + Math.sin(t * Math.PI) * 0.12 * (1 - t);
};

// ---------------------------------------------------------------- doodle drawings (paths in local coords)
/** stick child: head circle + body + arms out, at (x, y) = feet centre, size s */
export const kid = (x: number, y: number, s = 1, armsUp = 0) => {
  const h = 70 * s, r = 11 * s;
  const hy = y - h - r;
  return [
    `M ${x + r} ${hy} a ${r} ${r} 0 1 0 ${-2 * r} 0 a ${r} ${r} 0 1 0 ${2 * r} 0`,
    `M ${x} ${hy + r} L ${x} ${y - 28 * s}`,
    `M ${x} ${y - 28 * s} L ${x - 12 * s} ${y} M ${x} ${y - 28 * s} L ${x + 12 * s} ${y}`,
    `M ${x - 22 * s} ${hy + r + 18 * s - armsUp * 16 * s} L ${x} ${hy + r + 12 * s} L ${x + 22 * s} ${hy + r + 18 * s - armsUp * 16 * s}`,
  ];
};
export const star = (x: number, y: number, r: number) =>
  `M ${x} ${y - r} L ${x + r * 0.28} ${y - r * 0.28} L ${x + r} ${y} L ${x + r * 0.28} ${y + r * 0.28} L ${x} ${y + r} L ${x - r * 0.28} ${y + r * 0.28} L ${x - r} ${y} L ${x - r * 0.28} ${y - r * 0.28} Z`;
export const heart = (x: number, y: number, s: number) =>
  `M ${x} ${y + 10 * s} C ${x - 26 * s} ${y - 8 * s} ${x - 14 * s} ${y - 30 * s} ${x} ${y - 14 * s} C ${x + 14 * s} ${y - 30 * s} ${x + 26 * s} ${y - 8 * s} ${x} ${y + 10 * s} Z`;
export const qmark = (x: number, y: number, s: number) =>
  [`M ${x - 18 * s} ${y - 30 * s} C ${x - 18 * s} ${y - 58 * s} ${x + 22 * s} ${y - 60 * s} ${x + 20 * s} ${y - 32 * s} C ${x + 18 * s} ${y - 14 * s} ${x} ${y - 14 * s} ${x} ${y + 6 * s}`,
   `M ${x} ${y + 26 * s} L ${x + 0.5} ${y + 27 * s}`];
/** a tangled scribble ball around (x, y) */
export const tangle = (x: number, y: number, r: number, seed = 1) => {
  let d = `M ${x - r} ${y}`;
  for (let i = 0; i < 14; i++) {
    const a1 = (i * 2.4 + seed) % (Math.PI * 2), a2 = a1 + 1.7 + (i % 3) * 0.4;
    const r1 = r * (0.5 + ((i * 37) % 10) / 20), r2 = r * (0.4 + ((i * 53) % 10) / 18);
    d += ` Q ${x + Math.cos(a1) * r1 * 1.4} ${y + Math.sin(a1) * r1} ${x + Math.cos(a2) * r2 * 1.3} ${y + Math.sin(a2) * r2}`;
  }
  return d;
};
export { lerp };
