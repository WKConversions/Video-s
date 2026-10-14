// Segment 7: the brushed-chrome hexagon badge (the reference's SOC 2 / HIPAA badges re-skinned as WKC "detail stamps").
import React from "react";
import { F } from "./lib";
import { tw } from "./kit";
import { WKC_PATH, WKC_VIEW } from "./mark";

type P = [number, number];
/** base size of the badge (the left badge at scale 1); hexagon with flat top/bottom and pointed left/right vertices */
export const BW = 615, BH = 514;

const hexPts = (W: number, H: number, k = 0.25): P[] => {
  const a = W * k;
  return [[-W / 2, 0], [-a, -H / 2], [a, -H / 2], [W / 2, 0], [a, H / 2], [-a, H / 2]];
};
/** the polygon moved inward by d (clockwise in screen coordinates) */
const inset = (pts: P[], d: number): P[] => {
  const n = pts.length;
  const L = pts.map((p, i) => {
    const q = pts[(i + 1) % n], dx = q[0] - p[0], dy = q[1] - p[1], l = Math.hypot(dx, dy);
    return { p: [p[0] - (dy / l) * d, p[1] + (dx / l) * d] as P, v: [dx, dy] as P };
  });
  return pts.map((_, i) => {
    const A = L[(i - 1 + n) % n], B = L[i];
    const det = -A.v[0] * B.v[1] + A.v[1] * B.v[0];
    const rx = B.p[0] - A.p[0], ry = B.p[1] - A.p[1];
    const s = (-rx * B.v[1] + ry * B.v[0]) / det;
    return [A.p[0] + s * A.v[0], A.p[1] + s * A.v[1]] as P;
  });
};
const toward = (a: P, b: P, r: number): P => {
  const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy), k = Math.min(r, l / 2) / l;
  return [a[0] + dx * k, a[1] + dy * k];
};
const rounded = (pts: P[], r: number) => {
  const n = pts.length;
  let d = "";
  for (let i = 0; i < n; i++) {
    const c = pts[i], a = toward(c, pts[(i - 1 + n) % n], r), b = toward(c, pts[(i + 1) % n], r);
    d += `${i === 0 ? "M" : "L"}${a[0].toFixed(2)} ${a[1].toFixed(2)} Q${c[0].toFixed(2)} ${c[1].toFixed(2)} ${b[0].toFixed(2)} ${b[1].toFixed(2)} `;
  }
  return d + "Z";
};

const R = BW * 0.06;
/** the badge outlines for a hexagon whose flat top is 2k of the width wide */
const geo = (k: number) => {
  const OUT = hexPts(BW, BH, k);
  return { outer: rounded(OUT, R), recess: rounded(inset(OUT, 24), R * 0.8), rim: rounded(inset(OUT, 42), R * 0.7), face: rounded(inset(OUT, 45), R * 0.68) };
};
const GEO: Record<string, ReturnType<typeof geo>> = {};
const geoK = (k: number) => (GEO[k] ??= geo(k));
const G0 = geoK(0.25);
export const BADGE_PATH = G0.outer;
const P_RECESS = G0.recess, P_RIM = G0.rim, P_FACE = G0.face;

const Check: React.FC<{ x: number; y: number; s: number; color: string }> = ({ x, y, s, color }) => (
  <path d={`M${x} ${y - 0.45 * s} L${x + 0.35 * s} ${y} L${x + 1.0 * s} ${y - 0.95 * s}`} fill="none" stroke={color} strokeWidth={s * 0.11} strokeLinecap="round" strokeLinejoin="round" />
);

/** the badge drawn about its centre (0, 0) in a (BW + 2 pad) x (BH + 2 pad) SVG */
export const Badge: React.FC<{ id: string; band: string; value: string; foot: string; valueSize?: number; k?: number }> = ({ id, band, value, foot, valueSize = 66, k = 0.25 }) => {
  const { outer: BADGE_PATH, recess: P_RECESS, rim: P_RIM, face: P_FACE } = geoK(k);
  const pad = 40, ux = (n: string) => `${id}-${n}`;
  const footSize = 33, footW = tw(foot, footSize, 500, F.ui) + 0.01 * footSize * foot.length, chk = 26, gap = 10;
  return (
    <svg width={BW + 2 * pad} height={BH + 2 * pad} viewBox={`${-BW / 2 - pad} ${-BH / 2 - pad} ${BW + 2 * pad} ${BH + 2 * pad}`} style={{ display: "block", overflow: "visible" }}>
      <defs>
        <linearGradient id={ux("bezel")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F2F2F2" /><stop offset="0.22" stopColor="#C9C9C9" /><stop offset="0.5" stopColor="#8E8E8E" />
          <stop offset="0.78" stopColor="#6A6A6A" /><stop offset="1" stopColor="#585858" />
        </linearGradient>
        <linearGradient id={ux("face")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#060B12" /><stop offset="0.3" stopColor="#0B1520" /><stop offset="0.62" stopColor="#0E1A27" /><stop offset="1" stopColor="#1C2A39" />
        </linearGradient>
        <linearGradient id={ux("gloss")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0" /><stop offset="0.18" stopColor="#FFFFFF" stopOpacity="0.10" />
          <stop offset="0.3" stopColor="#FFFFFF" stopOpacity="0.02" /><stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={ux("band")} x1="0" y1="0" x2="1" y2="0.25">
          <stop offset="0" stopColor="#6C6C6C" /><stop offset="0.35" stopColor="#9A9A9A" /><stop offset="0.7" stopColor="#A6A6A6" /><stop offset="1" stopColor="#808080" />
        </linearGradient>
        <linearGradient id={ux("mark")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F4F6F8" /><stop offset="1" stopColor="#9EA4AA" />
        </linearGradient>
        <clipPath id={ux("cf")}><path d={P_FACE} /></clipPath>
        <clipPath id={ux("cr")}><path d={P_RECESS} /></clipPath>
        <clipPath id={ux("co")}><path d={BADGE_PATH} /></clipPath>
        <filter id={ux("glow")} x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="9" /></filter>
        <filter id={ux("brush")} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.0025 0.42" numOctaves="2" seed="7" />
          <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  2.2 0 0 0 -1.05" />
        </filter>
        <filter id={ux("brushD")} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.0025 0.42" numOctaves="2" seed="11" />
          <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -2.2 0 0 0 1.05" />
        </filter>
      </defs>
      {/* soft outer glow */}
      <path d={BADGE_PATH} fill="#8DC0FF" opacity={0.2} filter={`url(#${ux("glow")})`} transform="scale(1.02)" />
      {/* chrome bezel with brushed streaks */}
      <path d={BADGE_PATH} fill={`url(#${ux("bezel")})`} />
      <g clipPath={`url(#${ux("co")})`}>
        <rect x={-BW / 2} y={-BH / 2} width={BW} height={BH} filter={`url(#${ux("brush")})`} opacity={0.35} />
        <rect x={-BW / 2} y={-BH / 2} width={BW} height={BH} filter={`url(#${ux("brushD")})`} opacity={0.3} />
      </g>
      <path d={BADGE_PATH} fill="none" stroke="#FFFFFF" strokeOpacity={0.35} strokeWidth={1.5} />
      {/* recess, rim and the dark brushed face */}
      <path d={P_RECESS} fill="#040608" stroke="#2A2A2A" strokeWidth={1.5} />
      <path d={P_RIM} fill="#2E3740" />
      <path d={P_FACE} fill={`url(#${ux("face")})`} />
      <g clipPath={`url(#${ux("cf")})`}>
        <rect x={-BW / 2} y={-BH / 2} width={BW} height={BH} filter={`url(#${ux("brush")})`} opacity={0.12} />
        <rect x={-BW / 2} y={-BH / 2} width={BW} height={BH} fill={`url(#${ux("gloss")})`} />
      </g>
      {/* the light band across the middle, clipped to the recess so its ends follow the hexagon */}
      <g clipPath={`url(#${ux("cr")})`}>
        <rect x={-BW / 2} y={-46} width={BW} height={86} fill={`url(#${ux("band")})`} />
        <rect x={-BW / 2} y={-46} width={BW} height={86} filter={`url(#${ux("brush")})`} opacity={0.3} />
        <rect x={-BW / 2} y={-47} width={BW} height={2.5} fill="#1E1E1E" opacity={0.8} />
        <rect x={-BW / 2} y={38.5} width={BW} height={2.5} fill="#1E1E1E" opacity={0.8} />
        <rect x={-BW / 2} y={-44.5} width={BW} height={1.5} fill="#E8E8E8" opacity={0.55} />
      </g>
      {/* monogram and studio name */}
      <g transform={`translate(${-39} ${-170 - 18}) scale(${78 / WKC_VIEW.w})`}>
        <path d={WKC_PATH} fill={`url(#${ux("mark")})`} />
      </g>
      <text x={0} y={-92} textAnchor="middle" fill="#C8C8C8" style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 33, letterSpacing: "-0.01em" }}>WKConversions</text>
      {/* band label */}
      <text x={0} y={14} textAnchor="middle" fill="#161616" style={{ fontFamily: F.head, fontWeight: 900, fontSize: 47, letterSpacing: "0.01em" }}>{band}</text>
      {/* big embossed value */}
      <text x={-1.5} y={95.5} textAnchor="middle" fill="#000000" opacity={0.55} style={{ fontFamily: F.ui, fontWeight: 500, fontSize: valueSize, letterSpacing: "0.02em" }}>{value}</text>
      <text x={1.2} y={98.7} textAnchor="middle" fill="#9A9A9A" opacity={0.35} style={{ fontFamily: F.ui, fontWeight: 500, fontSize: valueSize, letterSpacing: "0.02em" }}>{value}</text>
      <text x={0} y={97} textAnchor="middle" fill="#5A5A5A" style={{ fontFamily: F.ui, fontWeight: 500, fontSize: valueSize, letterSpacing: "0.02em" }}>{value}</text>
      {/* footer with a thin check */}
      <Check x={-(footW + chk + gap) / 2} y={156 - 2} s={chk} color="#D0D0D0" />
      <text x={-(footW + chk + gap) / 2 + chk + gap} y={156} fill="#D0D0D0" style={{ fontFamily: F.ui, fontWeight: 500, fontSize: footSize, letterSpacing: "0.01em" }}>{foot}</text>
    </svg>
  );
};

/** the same badge as a flat silhouette with its concentric bezel rings (for the defocused foreground pass-by) */
export const BADGE_RINGS = { outer: BADGE_PATH, recess: P_RECESS, rim: P_RIM, face: P_FACE };
