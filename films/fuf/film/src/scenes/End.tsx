import React from "react";
import { T, Para, Caps, Photo, vis, k, s, rnd, measure, ARRIVE, MOVE, OUT, SOFT, IN, FLICK, clamp01, lerp, Img, staticFile, SERIF, SANS, INK, CREAM, TAUPE, TAUPE_D } from "./brand";

// ---- 9. end card ------------------------------------------------------------------------------------------------------------------
export const End: React.FC<{ g: number }> = ({ g }) => {
  if (g < T.f("endcard-0.2")) return null;
  const a = k(g, "endcard-0.1", 0.7, MOVE), m = k(g, "endcard", 1.0, SOFT), btn = k(g, "together2+0.3", 0.5);
  return (
    <div style={{ position: "absolute", inset: 0, background: CREAM, clipPath: `circle(${lerp(0, 1150, a)}px at 960px 540px)` }}>
      {/* the opening's network, drawing again faintly behind the lockup */}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {Array.from({ length: 60 }, (_, n) => {
          const a = n, b = (n * 7 + 3) % 60, ax = 60 + rnd(a) * 1800, ay = 50 + rnd(a + 77) * 980, bx = 60 + rnd(b) * 1800, by = 50 + rnd(b + 77) * 980;
          if (Math.hypot(ax - bx, ay - by) > 520) return null;
          const p = k(g, (s("endcard") + 0.3 + n * 0.07).toFixed(3), 0.9, SOFT);
          return p > 0 ? <g key={n} opacity={0.32}><line x1={ax} y1={ay} x2={lerp(ax, bx, p)} y2={lerp(ay, by, p)} stroke={TAUPE} strokeWidth={1.4} /><circle cx={ax} cy={ay} r={3.5} fill={TAUPE} /></g> : null;
        })}
      </svg>
      <div style={{ position: "absolute", left: 960 - 150, top: 120, width: 300, height: 300, clipPath: `inset(0 0 ${(1 - m) * 100}% 0)` }}>
        <Img src={staticFile("img/unicorn-ink.png")} style={{ width: 300, height: 300 }} />
      </div>
      <Para g={g} lines={[["endcard", "Future *Unicorn* Founders"]]} x={0} y={460} size={92} color={INK} accent={INK} center />
      <div style={{ position: "absolute", left: 960 - lerp(0, 90, k(g, "build-0.3", 0.5, MOVE)), top: 600, width: lerp(0, 180, k(g, "build-0.3", 0.5, MOVE)), height: 1.5, background: TAUPE }} />
      <Para g={g} lines={[["build", "Build what's next, *together.*"]]} x={0} y={640} size={64} color={INK} accent={TAUPE_D} center />
      <div style={{ position: "absolute", left: 960 - 170, top: 790 + (1 - btn) * 16, width: 340, height: 74, borderRadius: 37, background: INK, opacity: btn, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontSize: 24, fontWeight: 500, color: CREAM }}>Join the community</div>
      <Caps t="MÁLAGA  ·  INTERNATIONAL" x={0} y={905} o={k(g, "together2+0.6", 0.5)} color={TAUPE_D} size={18} center />
    </div>
  );
};
