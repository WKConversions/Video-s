import React from "react";
import { T, Para, Caps, Photo, vis, k, s, rnd, measure, ARRIVE, MOVE, OUT, SOFT, IN, FLICK, clamp01, lerp, Img, staticFile, SERIF, SANS, INK, CREAM, TAUPE, TAUPE_D } from "./brand";
import { DOTS } from "./Open";

// ---- 8. one conversation ----------------------------------------------------------------------------------------------------------
export const One: React.FC<{ g: number }> = ({ g }) => {
  const o = vis(g, "because-0.25", "endcard-0.1");
  if (o <= 0) return null;
  const t = g / 30, near = k(g, "because", 2.4, SOFT), meet = k(g, "one", 0.5, MOVE), glow = k(g, "conversation", 0.9);
  const ax = lerp(360, 860, near), bx = lerp(1560, 1060, near), y = 700;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o, background: INK }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {DOTS.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={3.5} fill={CREAM} opacity={0.18 * (1 - glow * 0.5)} />)}
        <circle cx={960} cy={y} r={40 + 260 * glow} fill={TAUPE} opacity={0.18 * glow * (1 - glow * 0.6)} />
        <line x1={ax} y1={y} x2={lerp(ax, bx, meet)} y2={y} stroke={TAUPE} strokeWidth={2.5} />
        <circle cx={ax} cy={y + Math.sin(t * 1.4) * 4 * (1 - meet)} r={11} fill={CREAM} />
        <circle cx={bx} cy={y + Math.cos(t * 1.3) * 4 * (1 - meet)} r={11} fill={CREAM} />
      </svg>
      <Para g={g} lines={[["because", "The next big opportunity"], ["34.3", "might start with *one conversation.*"]]} x={0} y={300} size={84} color={CREAM} center />
    </div>
  );
};
