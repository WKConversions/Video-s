// Segment 4 helpers: quad -> matrix3d, homographies, per-frame table lookups, the pixel-mosaic and directional-blur
// SVG filters, and a 24-unit outline icon set.
import React from "react";
import { F, clamp01, lerp } from "./lib";

export type P2 = [number, number];
export type Quad = [P2, P2, P2, P2]; // TL, TR, BR, BL

/** 3x3 homography (row-major, 9 numbers) of the local rect (0,0)-(w,h) onto the screen quad */
export const rectToQuadH = (w: number, h: number, q: Quad): number[] => {
  const [[x0, y0], [x1, y1], [x2, y2], [x3, y3]] = q;
  const dx1 = x1 - x2, dx2 = x3 - x2, dx3 = x0 - x1 + x2 - x3;
  const dy1 = y1 - y2, dy2 = y3 - y2, dy3 = y0 - y1 + y2 - y3;
  const den = dx1 * dy2 - dx2 * dy1;
  const g = (dx3 * dy2 - dx2 * dy3) / den, h2 = (dx1 * dy3 - dx3 * dy1) / den;
  const a = x1 - x0 + g * x1, b = x3 - x0 + h2 * x3, d = y1 - y0 + g * y1, e = y3 - y0 + h2 * y3;
  return [a / w, b / h, x0, d / w, e / h, y0, g / w, h2 / h, 1];
};
/** (0,0)-(w,h) local rect -> screen quad [TL,TR,BR,BL] (spec §4.1) */
export const quadToMatrix3d = (w: number, h: number, q: Quad) => {
  const [a, b, x0, d, e, y0, g, h2] = rectToQuadH(w, h, q);
  return `matrix3d(${a},${d},0,${g},${b},${e},0,${h2},0,0,1,0,${x0},${y0},0,1)`;
};
export const applyH = (H: number[], x: number, y: number): P2 => {
  const w = H[6] * x + H[7] * y + H[8];
  return [(H[0] * x + H[1] * y + H[2]) / w, (H[3] * x + H[4] * y + H[5]) / w];
};
export const invH = (m: number[]): number[] => {
  const [a, b, c, d, e, f, g, h, i] = m;
  const A = e * i - f * h, B = -(d * i - f * g), Cc = d * h - e * g;
  const det = a * A + b * B + c * Cc;
  return [A, -(b * i - c * h), b * f - c * e, B, a * i - c * g, -(a * f - c * d), Cc, -(a * h - b * g), a * e - b * d].map((v) => v / det);
};
/** linear interpolation in a sparse per-frame table {frame: [values]} (clamped at both ends) */
export const tab = (T: Record<number, number[]>, g: number): number[] => {
  const ks = Object.keys(T).map(Number).sort((a, b) => a - b);
  if (g <= ks[0]) return T[ks[0]];
  if (g >= ks[ks.length - 1]) return T[ks[ks.length - 1]];
  let i = 0;
  while (ks[i + 1] < g) i++;
  const a = ks[i], b = ks[i + 1], t = (g - a) / (b - a);
  return T[a].map((v, k) => lerp(v, T[b][k], t));
};
/** rows [[frame, ...values]] -> interpolated values (clamped) */
export const rows = (R: number[][], g: number): number[] => {
  if (g <= R[0][0]) return R[0].slice(1);
  for (let i = 1; i < R.length; i++) if (g <= R[i][0]) {
    const t = (g - R[i - 1][0]) / (R[i][0] - R[i - 1][0]);
    return R[i].slice(1).map((v, k) => lerp(R[i - 1][k + 1], v, t));
  }
  return R[R.length - 1].slice(1);
};
export const flatQuad = (v: number[]): Quad => [[v[0], v[1]], [v[2], v[3]], [v[4], v[5]], [v[6], v[7]]];

/** a layer of local size w x h mapped onto a screen quad (parent must be a full-stage, untransformed box) */
export const QuadLayer: React.FC<{ w: number; h: number; q: Quad; children: React.ReactNode; style?: React.CSSProperties }> = ({ w, h, q, children, style }) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: w, height: h, transformOrigin: "0 0", transform: quadToMatrix3d(w, h, q), ...style }}>{children}</div>
);

// ------------------------------------------------------------------------------------------------ SVG filters
/** pixel mosaic with b x b blocks: the box-averaged colour sampled once per block, then spread over the block */
export const mosaicId = (b: number) => `s4px${b}`;
export const MOSAIC_SIZES = [3, 4, 8, 16];
export const FilterDefs: React.FC<{ dirBlur?: number }> = ({ dirBlur = 0 }) => (
  <svg width={0} height={0} style={{ position: "absolute" }}>
    <defs>
      {MOSAIC_SIZES.map((b) => {
        const c = Math.floor(b / 2);
        return (
          <filter key={b} id={mosaicId(b)} x="0" y="0" width="1" height="1" colorInterpolationFilters="sRGB">
            <feGaussianBlur in="SourceGraphic" stdDeviation={b * 0.32} result="avg" />
            <feFlood x={c} y={c} width={1} height={1} floodColor="#000" floodOpacity={1} />
            <feComposite width={b} height={b} />
            <feTile result="grid" />
            <feComposite in="avg" in2="grid" operator="in" />
            <feMorphology operator="dilate" radius={c} />
          </filter>
        );
      })}
      <filter id="s4dir" x="-0.1" y="-0.1" width="1.2" height="1.2" colorInterpolationFilters="sRGB">
        <feGaussianBlur stdDeviation={`${Math.max(0.01, dirBlur)} 0`} />
      </filter>
    </defs>
  </svg>
);
/** horizontal-only Gaussian (id s4hz<k>) for the Send To smear */
export const HBlurDef: React.FC<{ id: string; s: number }> = ({ id, s }) => (
  <svg width={0} height={0} style={{ position: "absolute" }}>
    <defs>
      <filter id={id} x="-0.2" y="-0.2" width="1.4" height="1.4" colorInterpolationFilters="sRGB">
        <feGaussianBlur stdDeviation={`${Math.max(0.01, s)} 0`} />
      </filter>
    </defs>
  </svg>
);

// ------------------------------------------------------------------------------------------------ text
/** SVG text placed by its left edge and baseline */
export const T: React.FC<{ x: number; y: number; s: string; size: number; w: number; fill: string; family?: string; track?: number; opacity?: number; anchor?: "start" | "middle" | "end" }> =
  ({ x, y, s, size, w, fill, family = F.ui, track = 0, opacity = 1, anchor = "start" }) => (
    <text x={x} y={y} fontFamily={family} fontWeight={w} fontSize={size} letterSpacing={track} fill={fill} opacity={opacity} textAnchor={anchor} style={{ whiteSpace: "pre" }}>{s}</text>
  );

// ------------------------------------------------------------------------------------------------ icons
export type IconKind = "play" | "cursor" | "phone" | "bars" | "logo" | "wave" | "split" | "zoom" | "cut" | "type" | "drop" | "flag" | "doc" | "mic"
  | "frame" | "render" | "export" | "diamond" | "select" | "layers" | "pen" | "camera" | "sparkle" | "gear" | "pause" | "eye" | "chev" | "prev" | "next"
  | "playS" | "grid";
/** a 24-unit outline icon centred on (cx, cy), size px wide */
export const Icon: React.FC<{ k: IconKind; cx: number; cy: number; size: number; color: string; sw?: number }> = ({ k, cx, cy, size, color, sw = 2 }) => {
  const p = { fill: "none", stroke: color, strokeWidth: (sw * 24) / size, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const fill = { fill: color, stroke: "none" };
  const body: Record<IconKind, React.ReactNode> = {
    play: <path d="M8.5 5.5 L18.5 12 L8.5 18.5 Z" {...p} />,
    playS: <path d="M8 5 L19 12 L8 19 Z" {...fill} />,
    pause: <><rect x={6.5} y={5} width={3.6} height={14} rx={1} {...fill} /><rect x={13.9} y={5} width={3.6} height={14} rx={1} {...fill} /></>,
    cursor: <path d="M6 3.5 L18.5 13 L12.6 13.8 L15.8 20 L13.2 21.2 L10 15 L6 19 Z" {...p} />,
    phone: <><rect x={7} y={2.5} width={10} height={19} rx={2.4} {...p} /><path d="M10.6 18.4 H13.4" {...p} /></>,
    bars: <path d="M5 20 V13 M10 20 V8 M15 20 V11 M20 20 V4.5 M3 20.5 H21.5" {...p} />,
    logo: <><circle cx={12} cy={12} r={8.5} {...p} /><path d="M7.5 9.5 L9.5 15 L12 10.5 L14.5 15 L16.5 9.5" {...p} /></>,
    wave: <path d="M3 12 H4.5 M7 8.5 V15.5 M10 5 V19 M13 8 V16 M16 6 V18 M19 10 V14 M21 12 H21.5" {...p} />,
    split: <><rect x={3.5} y={5} width={17} height={14} rx={2.2} {...p} /><path d="M12 3 V21" {...p} /><path d="M6.5 15 L9 11.5 L10.5 13" {...p} /><path d="M14.5 15.5 L17.5 9" {...p} /></>,
    zoom: <><circle cx={10.5} cy={10.5} r={6.5} {...p} /><path d="M15.5 15.5 L20.5 20.5" {...p} /></>,
    cut: <><rect x={3} y={6} width={8} height={12} rx={1.6} {...p} /><rect x={14} y={4} width={7} height={16} rx={1.6} {...p} /><path d="M11.5 12 H13.5" {...p} /></>,
    type: <path d="M5 6.5 V4.5 H19 V6.5 M12 4.5 V19.5 M9 19.5 H15" {...p} />,
    drop: <><path d="M12 3.5 C12 3.5 5.5 10.5 5.5 14.5 a6.5 6.5 0 0 0 13 0 C18.5 10.5 12 3.5 12 3.5 Z" {...p} /><path d="M9 15 a3 3 0 0 0 3 3" {...p} /></>,
    flag: <><path d="M5.5 21 V4" {...p} /><path d="M5.5 4.5 H18 L15.5 8.5 L18 12.5 H5.5" {...p} /></>,
    doc: <><path d="M6 3.5 H14 L19 8.5 V20.5 H6 Z" {...p} /><path d="M14 3.5 V8.5 H19 M9 12.5 H16 M9 16.5 H14" {...p} /></>,
    mic: <><rect x={9} y={3} width={6} height={11} rx={3} {...p} /><path d="M5.5 11 a6.5 6.5 0 0 0 13 0 M12 17.5 V21" {...p} /></>,
    frame: <><rect x={3.5} y={5.5} width={17} height={13} rx={2} {...p} /><path d="M3.5 9 H20.5 M7 5.5 V18.5" {...p} /></>,
    render: <><rect x={3} y={6} width={11} height={8} rx={1.4} {...p} /><rect x={15.5} y={4} width={5.5} height={9} rx={1.2} {...p} /><rect x={8} y={15.5} width={6} height={5.5} rx={1.2} {...p} /></>,
    export: <><path d="M12 14 V3.5 M8 7.5 L12 3.5 L16 7.5" {...p} /><path d="M5 12 V19 a1.5 1.5 0 0 0 1.5 1.5 H17.5 a1.5 1.5 0 0 0 1.5 -1.5 V12" {...p} /></>,
    diamond: <><path d="M12 3 L21 12 L12 21 L3 12 Z" {...p} /><path d="M12 8.5 L15.5 12 L12 15.5 L8.5 12 Z" {...p} /></>,
    select: <path d="M5 3.5 L19 12 L12.5 13.2 L9.5 20 Z" {...p} />,
    layers: <><path d="M12 4 L21 8.5 L12 13 L3 8.5 Z" {...p} /><path d="M3 12.5 L12 17 L21 12.5" {...p} /><path d="M3 16 L12 20.5 L21 16" {...p} /></>,
    pen: <><path d="M12 3.5 L18 13 L14.5 20 H9.5 L6 13 Z" {...p} /><path d="M12 3.5 V11.5" {...p} /><circle cx={12} cy={13} r={1.4} {...p} /></>,
    camera: <><rect x={3} y={7} width={13} height={10} rx={2} {...p} /><path d="M16 10.5 L21 7.5 V16.5 L16 13.5" {...p} /></>,
    sparkle: <path d="M12 3 C12.8 8.4 15.6 11.2 21 12 C15.6 12.8 12.8 15.6 12 21 C11.2 15.6 8.4 12.8 3 12 C8.4 11.2 11.2 8.4 12 3 Z" {...p} />,
    gear: <><circle cx={12} cy={12} r={3} {...p} /><path d="M12 2.8 V5.3 M12 18.7 V21.2 M2.8 12 H5.3 M18.7 12 H21.2 M5.5 5.5 L7.3 7.3 M16.7 16.7 L18.5 18.5 M5.5 18.5 L7.3 16.7 M16.7 7.3 L18.5 5.5" {...p} /><circle cx={12} cy={12} r={6.6} {...p} /></>,
    eye: <><path d="M2.5 12 C5 7 8.5 5 12 5 C15.5 5 19 7 21.5 12 C19 17 15.5 19 12 19 C8.5 19 5 17 2.5 12 Z" {...p} /><circle cx={12} cy={12} r={3} {...p} /></>,
    chev: <path d="M6.5 9.5 L12 15 L17.5 9.5" {...p} />,
    prev: <><path d="M6 5 V19" {...p} /><path d="M18 5.5 L9 12 L18 18.5 Z" {...p} /></>,
    next: <><path d="M18 5 V19" {...p} /><path d="M6 5.5 L15 12 L6 18.5 Z" {...p} /></>,
    grid: <><rect x={4} y={4} width={7} height={7} rx={1.5} {...p} /><rect x={13} y={4} width={7} height={7} rx={1.5} {...p} /><rect x={4} y={13} width={7} height={7} rx={1.5} {...p} /><rect x={13} y={13} width={7} height={7} rx={1.5} {...p} /></>,
  };
  return <g transform={`translate(${cx - size / 2} ${cy - size / 2}) scale(${size / 24})`}>{body[k]}</g>;
};

/** expo ease helpers */
export const sat = clamp01;
