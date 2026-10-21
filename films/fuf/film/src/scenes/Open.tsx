import React from "react";
import { T, Para, Caps, Photo, vis, k, s, rnd, measure, ARRIVE, MOVE, OUT, SOFT, IN, FLICK, clamp01, lerp, Img, staticFile, SERIF, SANS, INK, CREAM, TAUPE, TAUPE_D } from "./brand";

// ---- 1-2. connections in the dark, then the search -------------------------------------------------------------------------
const _rnd = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
export const DOTS = Array.from({ length: 44 }, (_, i) => ({ x: 80 + rnd(i) * 1760, y: 70 + rnd(i + 99) * 940 }));
const EDGES = (() => {
  const e: [number, number, number][] = [];
  DOTS.forEach((p, i) => DOTS.forEach((q, j) => { if (j > i) { const d = Math.hypot(p.x - q.x, p.y - q.y); if (d < 270) e.push([i, j, d]); } }));
  return e.sort((a, b) => (DOTS[a[0]].x + DOTS[a[1]].x) - (DOTS[b[0]].x + DOTS[b[1]].x));
})();
export const Network: React.FC<{ g: number }> = ({ g }) => {
  const o = vis(g, "open-1", "meet+0.25");
  if (o <= 0) return null;
  const t = g / 30, apart = k(g, "but", 2.4, SOFT), lost = k(g, "but", 0.6, OUT);
  const pos = (i: number) => { const p = DOTS[i]; return { x: 960 + (p.x - 960) * (1 + 0.18 * apart) + Math.sin(t * 0.6 + i) * 6, y: 540 + (p.y - 540) * (1 + 0.18 * apart) + Math.cos(t * 0.5 + i * 1.3) * 6 }; };
  // the one dot looking for its match
  const seek = k(g, "ambitious", 0.4) * (1 - k(g, "meet-0.2", 0.3, OUT)), su = clamp01((t - s("ambitious")) / (s("easy") + 0.4 - s("ambitious")));
  const sx = 960 + Math.sin(su * Math.PI * 1.6) * 520, sy = 600 + Math.sin(su * Math.PI * 2.4 + 0.6) * 260;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {EDGES.map(([i, j], n) => {
          const d = clamp01((t + 0.4 - n * (2.6 / EDGES.length)) / 0.5) * (1 - lost);
          if (d <= 0) return null;
          const a = pos(i), b = pos(j);
          return <line key={n} x1={a.x} y1={a.y} x2={lerp(a.x, b.x, d)} y2={lerp(a.y, b.y, d)} stroke={TAUPE} strokeOpacity={0.45} strokeWidth={1.4} />;
        })}
        {DOTS.map((_, i) => { const p = pos(i); return <circle key={i} cx={p.x} cy={p.y} r={4.5} fill={CREAM} opacity={0.75} />; })}
        {seek > 0 && <>
          <circle cx={sx} cy={sy} r={7} fill={TAUPE} opacity={seek} />
          <circle cx={sx} cy={sy} r={26 + 10 * Math.sin(t * 5)} fill="none" stroke={TAUPE} strokeWidth={2} opacity={0.7 * seek} />
          {DOTS.map((_, i) => { const p = pos(i), d = Math.hypot(p.x - sx, p.y - sy); return d < 200 ? <line key={i} x1={sx} y1={sy} x2={p.x} y2={p.y} stroke={TAUPE} strokeOpacity={0.35 * seek * (1 - d / 200)} strokeWidth={1.2} strokeDasharray="4 6" /> : null; })}
        </>}
      </svg>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1100, height: 1080, background: "linear-gradient(90deg, rgba(43,43,43,0.92) 40%, rgba(43,43,43,0))" }} />
      <Caps t="FUTURE UNICORN FOUNDERS" x={140} y={330} o={k(g, "open-0.6", 0.5) * (1 - k(g, "but-0.3", 0.3, OUT))} />
      <Para g={g} lines={[["open-0.35", "Great opportunities start"], ["0.95", "with the right *connections.*"]]} x={136} y={400} size={96} color={CREAM} out="but-0.35" />
      <Para g={g} lines={[["but", "But finding ambitious people"], ["vision-0.3", "who share your vision"], ["easy-0.3", "isn't always *easy.*"]]} x={136} y={360} size={84} color={CREAM} out="meet-0.3" />
    </div>
  );
};
