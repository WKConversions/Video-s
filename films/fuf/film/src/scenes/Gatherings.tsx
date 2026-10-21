import React from "react";
import { T, Para, Caps, Photo, vis, k, s, rnd, measure, ARRIVE, MOVE, OUT, SOFT, IN, FLICK, clamp01, lerp, Img, staticFile, SERIF, SANS, INK, CREAM, TAUPE, TAUPE_D } from "./brand";

// ---- 5. gatherings and what comes of them -----------------------------------------------------------------------------------------
const CARDS: { src: string; label: string; cap: string; pos?: string }[] = [
  { src: "c-laptop.jpg", label: "ideas", cap: "New ideas *emerge.*" },
  { src: "c-lounge.jpg", label: "partnerships", cap: "Partnerships *form.*" },
  { src: "c-palms.jpg", label: "opportunities", cap: "Opportunities *grow.*", pos: "50% 60%" },
];
export const Gatherings: React.FC<{ g: number }> = ({ g }) => {
  const o = vis(g, "through-0.2", "no-0.15");
  if (o <= 0) return null;
  const t = g / 30;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o, background: CREAM }}>
      <Para g={g} lines={[["exclusive", "Exclusive gatherings."], ["meaningful", "*Meaningful conversations.*"]]} x={136} y={110} size={78} color={INK} accent={TAUPE_D} lh={1.08} />
      {CARDS.map((c, i) => {
        const a = k(g, `through+${(0.5 + 0.18 * i).toFixed(2)}`, 0.8, MOVE), on = k(g, c.label, 0.5);
        const x = 136 + i * 568;
        return (
          <React.Fragment key={c.src}>
            <Photo src={c.src} x={x} y={360} w={520} h={470} a={a} zoom={1.06 + 0.16 * clamp01((t - s("through")) / 7)} pos={c.pos ?? `${50 + (i - 1) * 6 * clamp01((t - s("through")) / 7)}% 50%`} />
            <div style={{ position: "absolute", left: x, top: 858, width: lerp(0, 520, k(g, c.label, 0.6, MOVE)), height: 1.5, background: TAUPE }} />
            {on > 0 && <Para g={g} lines={[[c.label, c.cap]]} x={x} y={880} size={50} color={INK} accent={TAUPE_D} />}
          </React.Fragment>
        );
      })}
      {/* opportunities grow: one rising line across the spread, drawn like a chart */}
      {(() => {
        const p = k(g, "opportunities-0.1", 1.4, SOFT);
        if (p <= 0) return null;
        const pts = Array.from({ length: 41 }, (_, i) => { const u = i / 40; return [136 + u * 1656, 1030 - 70 * Math.pow(u, 2.2) - 8 * Math.sin(u * 19) * (1 - u)]; });
        const n = Math.max(2, Math.round(41 * p));
        const d = pts.slice(0, n).map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
        const [hx, hy] = pts[n - 1];
        return <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          {Array.from({ length: 13 }, (_, i) => <line key={i} x1={136 + i * 138} y1={1040} x2={136 + i * 138} y2={1046} stroke={TAUPE} strokeWidth={1.5} opacity={p} />)}
          <path d={`${d} L${hx} 1040 L136 1040 Z`} fill={TAUPE} opacity={0.12} />
          <path d={d} fill="none" stroke={TAUPE_D} strokeWidth={2.2} />
          <circle cx={hx} cy={hy} r={5} fill={TAUPE_D} />
        </svg>;
      })()}
    </div>
  );
};
