// The stage's pieces: the business (one clip in a tile that can open into nine parts), the floor of real tool tiles,
// the tool faces, the founders' photo, the note, labels. Everything that moves is placed with transforms (never
// left/top) so it glides instead of stepping a pixel at a time (production/build-gotchas.md).
import React from "react";
import { Img, OffthreadVideo, staticFile } from "remotion";
import { C, F, R, SHADOW, TOOLS, clamp01, lerp } from "./lib";

export const FOOTAGE = staticFile("footage/business.mp4");
const FOUNDERS = staticFile("img/team/founders.jpg");

/** Where the footage sits inside a tile of w×h: a square of side S (cover × zoom), drifting on a slow Lissajous so the
 *  picture keeps travelling (≈40–75 px/s at 900 px) inside a frame that holds still. t in seconds. */
export const footagePan = (t: number, w: number, h: number, zoom: number) => {
  const S = Math.max(w, h) * zoom;
  const ax = Math.min(0.07 * S, (S - w) / 2 - 2), ay = Math.min(0.06 * S, (S - h) / 2 - 2);
  return { S, fx: (w - S) / 2 + ax * Math.sin((t / 11) * 2 * Math.PI + 0.6), fy: (h - S) / 2 + ay * Math.sin((t / 8.3) * 2 * Math.PI + 1.9) };
};

const Video: React.FC<{ S: number; x: number; y: number; grey: number; style?: React.CSSProperties }> = ({ S, x, y, grey, style }) => (
  <OffthreadVideo muted src={FOOTAGE} style={{ position: "absolute", left: 0, top: 0, width: S, height: S, transform: `translate(${x}px, ${y}px)`,
    filter: grey > 0.001 ? `grayscale(${grey}) brightness(${1 + 0.06 * grey}) contrast(${1 - 0.12 * grey})` : undefined, willChange: "transform", ...style }} />
);

/** A tool's face: navy with its real logo (never recoloured). */
export const ToolFace: React.FC<{ tool: string; w: number; h: number; radius?: number | string; logo?: number }> = ({ tool, w, h, radius = R.tile, logo = 0.62 }) => (
  <div style={{ width: w, height: h, borderRadius: radius, background: C.navy, display: "flex", alignItems: "center", justifyContent: "center" }}>
    <Img src={staticFile("img/" + TOOLS[tool])} style={{ width: Math.min(w, h) * logo, height: Math.min(w, h) * logo, objectFit: "contain" }} />
  </div>
);

/** A turn about the vertical axis: k 0 → 1 shows `a` turning edge-on and `b` coming round (the film's flip family). */
export const Flip3D: React.FC<{ k: number; w: number; h: number; a: React.ReactNode; b: React.ReactNode; axis?: "Y" | "X"; style?: React.CSSProperties }> = ({ k, w, h, a, b, axis = "Y", style }) => {
  const ang = clamp01(k) * 180;
  const front = ang < 90;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: w, height: h, transform: `perspective(${Math.max(w, h) * 3.2}px) rotate${axis}(${front ? ang : ang - 180}deg)`, ...style }}>
      {front ? a : b}
    </div>
  );
};

export type Piece = {
  lift?: number; dim?: number; ring?: number; label?: string; labelK?: number; flip?: number; tool?: string;
};

/** The business: one clip in a tile w×h centred on (x, y). `open` 0 → 1 parts it into a 3×3 exploded view (gap,
 *  tilt back); pieces can be ringed, labelled, lifted, dimmed and flipped into tool faces. `grey` 1 = held back.
 *  `flood`: circles (tile coords) inside which the colour comes back. `lens`: a magnifier (tile coords). `plan` < 1
 *  shows the business as its plan: a dashed outline, the footage filling in from the left as plan → 1. */
export const Biz: React.FC<{
  t: number; x: number; y: number; w: number; h: number; grey?: number; open?: number; gap?: number; tilt?: number; zoom?: number;
  pieces?: Record<number, Piece>; flood?: { x: number; y: number; r: number }[]; lens?: { x: number; y: number; r: number; k: number };
  plan?: number; radius?: number; shadow?: number; name?: string;
}> = ({ t, x, y, w, h, grey = 0, open = 0, gap = 22, tilt = 8, zoom = 1.5, pieces = {}, flood = [], lens, plan = 1, radius = 0.12, shadow = 1, name = "biz" }) => {
  const { S, fx, fy } = footagePan(t, w, h, zoom);
  const Rt = Math.min(w, h) * radius;
  const cw = w / 3, ch = h / 3, g = gap * open, inner = 12 * open;
  const maskFor = (ox: number, oy: number) => flood.length
    ? flood.map((q) => `radial-gradient(circle at ${q.x - ox}px ${q.y - oy}px, #000 ${Math.max(0, q.r - 1)}px, transparent ${q.r + 1}px)`).join(", ")
    : undefined;
  const cells = [];
  const plain = open < 0.02 && Object.values(pieces).every((p) => !p.ring && !p.flip && !p.lift && !p.dim);
  if (plain) {
    const mask = maskFor(0, 0);
    cells.push(
      <div key="all" data-probe={`${name}-all`} style={{ position: "absolute", left: 0, top: 0, width: w, height: h, overflow: "hidden", borderRadius: Rt, background: C.pale }}>
        <Video S={S} x={fx} y={fy} grey={grey} />
        {mask && grey > 0 && (
          <div style={{ position: "absolute", inset: 0, WebkitMaskImage: mask, maskImage: mask } as React.CSSProperties}>
            <Video S={S} x={fx} y={fy} grey={0} />
          </div>
        )}
      </div>,
    );
  }
  for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) {
    if (plain) break;
    const i = r * 3 + c, p = pieces[i] ?? {};
    const ov = open < 0.02 ? 0.75 : 0;                              // closed: overlap a hair so no seam shows
    const mask = maskFor(c * cw - ov, r * ch - ov);
    const px = c * cw + (c - 1) * g, py = r * ch + (r - 1) * g;
    const br = [r === 0 && c === 0 ? Rt : inner, r === 0 && c === 2 ? Rt : inner, r === 2 && c === 2 ? Rt : inner, r === 2 && c === 0 ? Rt : inner];
    const lift = p.lift ?? 0, dim = p.dim ?? 0, ring = p.ring ?? 0, flip = p.flip ?? 0;
    const face = (
      <div style={{ position: "absolute", left: 0, top: 0, width: cw + 2 * ov, height: ch + 2 * ov, overflow: "hidden", borderRadius: br.map((v) => `${v}px`).join(" "),
        background: C.pale }}>
        <Video S={S} x={fx - c * cw + ov} y={fy - r * ch + ov} grey={grey} />
        {mask && grey > 0 && (
          <div style={{ position: "absolute", inset: 0, WebkitMaskImage: mask, maskImage: mask } as React.CSSProperties}>
            <Video S={S} x={fx - c * cw + ov} y={fy - r * ch + ov} grey={0} />
          </div>
        )}
      </div>
    );
    cells.push(
      <div key={i} data-probe={`${name}-p${i}`} style={{ position: "absolute", left: 0, top: 0, width: cw + 2 * ov, height: ch + 2 * ov,
        transform: `translate(${px - ov}px, ${py - ov}px) translateZ(${lift * 60}px) scale(${1 + 0.05 * lift})`, opacity: 1 - 0.55 * dim,
        boxShadow: lift > 0 ? `0 ${30 * lift}px ${60 * lift}px -20px rgba(41,58,81,${0.45 * lift})` : undefined, borderRadius: br.map((v) => `${v}px`).join(" "), willChange: "transform" }}>
        {flip > 0 ? <Flip3D k={flip} w={cw} h={ch} a={face} b={<ToolFace tool={p.tool ?? "make"} w={cw} h={ch} radius={inner + 4} logo={0.5} />} /> : face}
        {ring > 0 && flip < 0.5 && (
          <div style={{ position: "absolute", left: -10, top: -10, width: cw + 20, height: ch + 20, borderRadius: inner + 10, border: `5px solid ${C.cyan}`,
            opacity: clamp01(ring * 2), transform: `scale(${lerp(1.12, 1, ring)})` }} />
        )}
        {p.label && (p.labelK ?? 0) > 0 && flip < 0.5 && (
          <div style={{ position: "absolute", left: 18, top: 18, padding: "10px 20px 11px", borderRadius: R.pill, background: C.white, boxShadow: SHADOW.soft,
            fontFamily: F.sans, fontWeight: 700, fontSize: 36, letterSpacing: "-0.01em", color: C.navy, whiteSpace: "nowrap",
            opacity: clamp01((p.labelK ?? 0) * 1.6), transform: `translateY(${(1 - (p.labelK ?? 0)) * 26}px)`, filter: (p.labelK ?? 0) < 1 ? `blur(${(1 - (p.labelK ?? 0)) * 6}px)` : undefined }}>
            {p.label}
          </div>
        )}
      </div>,
    );
  }
  const planK = clamp01(plan);
  return (
    <div data-probe={name} style={{ position: "absolute", left: 0, top: 0, width: w, height: h, transform: `translate(${x - w / 2}px, ${y - h / 2}px)`, willChange: "transform" }}>
      {shadow > 0 && open < 0.5 && planK > 0.02 && (
        <div style={{ position: "absolute", inset: 0, borderRadius: Rt, boxShadow: SHADOW.card, opacity: shadow * (1 - open * 2) * planK }} />
      )}
      <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d", transform: open > 0 ? `perspective(2600px) rotateX(${tilt * open}deg)` : undefined,
        clipPath: planK < 1 ? `inset(-40px ${(1 - planK) * w}px -40px -40px)` : undefined }}>
        {cells}
      </div>
      {planK < 1 && (
        <svg width={w} height={h} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          <rect x={2} y={2} width={w - 4} height={h - 4} rx={Rt} fill="rgba(56,200,255,0.07)" stroke={C.cyan} strokeWidth={4} strokeDasharray="14 10" opacity={1 - planK * 0.6} />
          {[1, 2].map((k) => (
            <g key={k} opacity={0.65 * (1 - planK)}>
              <line x1={(k * w) / 3} y1={14} x2={(k * w) / 3} y2={h - 14} stroke={C.cyan} strokeWidth={2.5} strokeDasharray="8 10" />
              <line x1={14} y1={(k * h) / 3} x2={w - 14} y2={(k * h) / 3} stroke={C.cyan} strokeWidth={2.5} strokeDasharray="8 10" />
            </g>
          ))}
        </svg>
      )}
      {lens && lens.k > 0 && (
        <>
          <div style={{ position: "absolute", inset: 0, overflow: "hidden", borderRadius: Rt, clipPath: `circle(${lens.r}px at ${lens.x}px ${lens.y}px)` }}>
            <div style={{ position: "absolute", left: 0, top: 0, width: w, height: h, transformOrigin: `${lens.x}px ${lens.y}px`, transform: `scale(${1 + 0.35 * lens.k})` }}>
              <Video S={S} x={fx} y={fy} grey={0} />
            </div>
          </div>
          <div style={{ position: "absolute", left: 0, top: 0, width: 2 * lens.r, height: 2 * lens.r, borderRadius: "50%", border: `6px solid ${C.cyan}`,
            boxShadow: "0 18px 40px -16px rgba(41,58,81,0.5)", transform: `translate(${lens.x - lens.r}px, ${lens.y - lens.r}px)` }} />
        </>
      )}
    </div>
  );
};

/** The founders' photo (the site's About photo, Málaga) in a tile, drifting slowly across the three of them. */
export const Founders: React.FC<{ t: number; w: number; h: number; radius?: number }> = ({ t, w, h, radius = 0.12 }) => {
  const H = h * 1.32, W = H * (2800 / 2100);
  const x = (w - W) / 2 + Math.min(0.12 * W, (W - w) / 2 - 2) * Math.sin((t / 9.5) * 2 * Math.PI - 0.4);
  const y = (h - H) / 2 + Math.min(0.06 * H, (H - h) / 2 - 2) * Math.sin((t / 7.1) * 2 * Math.PI + 0.8);
  return (
    <div style={{ width: w, height: h, borderRadius: Math.min(w, h) * radius, overflow: "hidden", position: "relative", background: C.pale }}>
      <Img src={FOUNDERS} style={{ position: "absolute", left: 0, top: 0, width: W, height: H, transform: `translate(${x}px, ${y}px)`, willChange: "transform" }} />
    </div>
  );
};

/** Distance a conveyor has travelled by frame g, from a list of [frame, speed px/s] keys, the speed eased between keys
 *  (B10 with soft changes, never a jump): the integral, summed frame by frame. */
export const travelled = (g: number, keys: [number, number][]) => {
  const speed = (f: number) => {
    if (f <= keys[0][0]) return keys[0][1];
    for (let i = 1; i < keys.length; i++) if (f < keys[i][0]) {
      const u = (f - keys[i - 1][0]) / (keys[i][0] - keys[i - 1][0]);
      const s = u * u * (3 - 2 * u);
      return lerp(keys[i - 1][1], keys[i][1], s);
    }
    return keys[keys.length - 1][1];
  };
  let d = 0;
  for (let f = 0; f < g; f++) d += speed(f + 0.5) / 30;
  return d;
};

/** A row of tool tiles running right to left; `offset` is how far it has travelled. Tiles 200, pitch 220. */
export const ToolRow: React.FC<{ tools: string[]; y: number; offset: number; size?: number; pitch?: number; name: string; backs?: (i: number) => number; skip?: (x: number) => boolean }> = ({
  tools, y, offset, size = 200, pitch = 220, name, backs, skip }) => {
  const n = tools.length, span = n * pitch;
  const base = ((offset % span) + span) % span;
  const out = [];
  for (let i = 0; i < n + 10; i++) {
    const x = i * pitch - base - pitch;
    if (x < -pitch * 1.5 || x > 1920 + pitch) continue;
    if (skip && skip(x)) continue;
    const tool = tools[i % n];
    const b = backs ? backs(i) : 0;
    out.push(
      <div key={i} data-probe={`${name}-${i}`} style={{ position: "absolute", left: 0, top: 0, width: size, height: size, transform: `translate(${x}px, ${y}px)`, willChange: "transform",
        filter: "drop-shadow(0 16px 22px rgba(41,58,81,0.28))" }}>
        {b > 0 ? <Flip3D k={b} w={size} h={size} axis="X" a={<ToolFace tool={tool} w={size} h={size} />} b={<div style={{ width: size, height: size, borderRadius: R.tile, background: C.navy }} />} />
          : <ToolFace tool={tool} w={size} h={size} />}
      </div>,
    );
  }
  return <>{out}</>;
};

/** A white note: "Advice", a document handed over (and nothing more). */
export const Note: React.FC<{ w?: number }> = ({ w = 360 }) => (
  <div style={{ width: w, height: w * 0.7, borderRadius: R.card, background: C.white, boxShadow: SHADOW.card, padding: `${w * 0.1}px ${w * 0.11}px`, boxSizing: "border-box" }}>
    <div style={{ fontFamily: F.sans, fontWeight: 700, fontSize: w * 0.19, color: C.navy, letterSpacing: "-0.02em", lineHeight: 1 }}>Advice</div>
    {[0.86, 0.72, 0.8].map((k, i) => (
      <div key={i} style={{ height: w * 0.035, width: `${k * 100}%`, borderRadius: 9, background: C.line, marginTop: i === 0 ? w * 0.09 : w * 0.05 }} />
    ))}
  </div>
);
