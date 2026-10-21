import React from "react";
import { T, Para, Caps, Photo, vis, k, s, rnd, measure, ARRIVE, MOVE, OUT, SOFT, IN, FLICK, clamp01, lerp, Img, staticFile, SERIF, SANS, INK, CREAM, TAUPE, TAUPE_D } from "./brand";

// ---- 8. one conversation ----------------------------------------------------------------------------------------------------------
export const One: React.FC<{ g: number }> = ({ g }) => {
  const o = vis(g, "because-0.25", "endcard-0.1");
  if (o <= 0) return null;
  const t = g / 30, near = k(g, "because", 2.4, SOFT), meet = k(g, "one", 0.5, MOVE), glow = k(g, "conversation", 0.9);
  const ax = lerp(360, 860, near), bx = lerp(1560, 1060, near), y = 700;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o, background: INK }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {/* a field of people, drifting; it gains light once the conversation starts */}
        {Array.from({ length: 170 }, (_, i) => {
          const px = rnd(i) * 1920, py = ((rnd(i + 300) * 1180 - (t - s("because")) * (12 + 22 * rnd(i + 600))) % 1180 + 1180) % 1180 - 50;
          return <circle key={i} cx={px} cy={py} r={2.6 + 1.6 * rnd(i + 900)} fill={CREAM} opacity={0.12 + 0.3 * k(g, "conversation+0.3", 1.6, SOFT) * rnd(i + 1200)} />;
        })}
        <circle cx={960} cy={y} r={40 + 260 * glow} fill={TAUPE} opacity={0.18 * glow * (1 - glow * 0.6)} />
        <line x1={ax} y1={y} x2={lerp(ax, bx, meet)} y2={y} stroke={TAUPE} strokeWidth={2.5} />
        {/* the next big opportunity: from the conversation, one long rising line */}
        {(() => {
          const p = k(g, "conversation", 1.4, SOFT);
          if (p <= 0) return null;
          const pts = Array.from({ length: 49 }, (_, i) => { const u = i / 48; return [960 + u * 900, y - 590 * Math.pow(u, 1.7)]; });
          const n = Math.max(2, Math.round(49 * p)), [hx, hy] = pts[n - 1];
          return <>
            <path d={pts.slice(0, n).map(([x, yy], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${yy.toFixed(1)}`).join(" ")} fill="none" stroke={TAUPE} strokeWidth={2.5} />
            <circle cx={hx} cy={hy} r={70} fill={TAUPE} opacity={0.14} /><circle cx={hx} cy={hy} r={7} fill={CREAM} />
          </>;
        })()}
        <circle cx={ax} cy={y + Math.sin(t * 1.4) * 4 * (1 - meet)} r={11} fill={CREAM} />
        <circle cx={bx} cy={y + Math.cos(t * 1.3) * 4 * (1 - meet)} r={11} fill={CREAM} />
      </svg>
      <Para g={g} lines={[["because", "The next big opportunity"], ["34.3", "might start with *one conversation.*"]]} x={0} y={300} size={84} color={CREAM} center />
    </div>
  );
};
