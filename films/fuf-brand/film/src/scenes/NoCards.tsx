import React from "react";
import { T, Para, Caps, Photo, vis, k, s, rnd, measure, ARRIVE, MOVE, OUT, SOFT, IN, FLICK, clamp01, lerp, Img, staticFile, SERIF, SANS, INK, CREAM, TAUPE, TAUPE_D } from "./brand";

// ---- 6. not the usual networking ---------------------------------------------------------------------------------------------------
export const NoCards: React.FC<{ g: number }> = ({ g }) => {
  const o = vis(g, "no-0.25", "just-0.1");
  if (o <= 0) return null;
  const t = g / 30;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o, background: INK }}>
      {Array.from({ length: 7 }, (_, i) => {
        const a = k(g, `no+${(0.08 * i).toFixed(2)}`, 0.6), away = k(g, `business+${(0.1 * (6 - i)).toFixed(2)}`, 0.7, OUT);
        const rot = -14 + i * 4.5 + Math.sin(t * 0.8 + i) * 0.6, x = 1180 + i * 22 + away * (900 + i * 60), y = 330 + i * 26 - away * (200 - i * 50);
        return (
          <div key={i} style={{ position: "absolute", left: x, top: y + (1 - a) * 60, width: 430, height: 250, borderRadius: 12, background: i % 2 ? "#EFE9E1" : CREAM, boxShadow: "0 20px 50px rgba(0,0,0,0.35)", opacity: Math.min(1, a * 1.5) * (1 - away), transform: `rotate(${rot + away * 25}deg)`, padding: "34px 36px", boxSizing: "border-box" }}>
            <div style={{ width: 150, height: 16, borderRadius: 8, background: "#CFC6BB" }} />
            <div style={{ marginTop: 14, width: 220, height: 10, borderRadius: 5, background: "#DDD5CB" }} />
            <div style={{ position: "absolute", left: 36, bottom: 34, width: 180, height: 8, borderRadius: 4, background: "#DDD5CB" }} />
            <div style={{ position: "absolute", left: 36, bottom: 54, width: 130, height: 8, borderRadius: 4, background: "#DDD5CB" }} />
            <div style={{ position: "absolute", right: 36, top: 34, width: 44, height: 44, borderRadius: 22, background: "#D8CFC4" }} />
          </div>
        );
      })}
      {(() => {
        const t0 = s("no") - 0.1, per = 0.42, d = t - t0;
        if (d < 0 || g > T.f("business+0.25")) return null;
        const c = Math.floor(d / per), u = MOVE(clamp01((d - c * per) / (per * 0.85)));
        const A = { x: 1130, y: 600 }, B = { x: 1560, y: 470 }, from = c % 2 ? B : A, to = c % 2 ? A : B;
        const x = lerp(from.x, to.x, u), y = lerp(from.y, to.y, u) - Math.sin(Math.PI * u) * 120;
        return <div style={{ position: "absolute", left: x, top: y, width: 330, height: 192, borderRadius: 10, background: CREAM, boxShadow: "0 18px 40px rgba(0,0,0,0.4)", transform: `rotate(${lerp(-10, 8, c % 2 ? 1 - u : u)}deg)`, padding: "26px 28px", boxSizing: "border-box", opacity: 1 - k(g, "business", 0.25, OUT) }}>
          <div style={{ width: 120, height: 12, borderRadius: 6, background: "#CFC6BB" }} />
          <div style={{ marginTop: 10, width: 170, height: 8, borderRadius: 4, background: "#DDD5CB" }} />
          <div style={{ position: "absolute", left: 28, bottom: 26, width: 140, height: 6, borderRadius: 3, background: "#DDD5CB" }} />
        </div>;
      })()}
      <Para g={g} lines={[["no", "No awkward networking."]]} x={136} y={380} size={82} color={CREAM} />
      <div style={{ position: "absolute", left: 130, top: 380 + 50, width: lerp(0, measure("No awkward networking.", 82, 400, -0.02) + 12, k(g, "25.4", 0.45, MOVE)), height: 6, borderRadius: 3, background: TAUPE, transform: "rotate(-1.5deg)" }} />
      <Para g={g} lines={[["no2", "No endless"], ["business-0.1", "business card exchanges."]]} x={136} y={520} size={82} color={CREAM} />
      <div style={{ position: "absolute", left: 130, top: 520 + 82 * 1.12 + 50, width: lerp(0, measure("business card exchanges.", 82, 400, -0.02) + 12, k(g, "business+0.75", 0.45, MOVE)), height: 6, borderRadius: 3, background: TAUPE, transform: "rotate(-1.5deg)" }} />
      <div style={{ position: "absolute", left: 130, top: 520 + 50, width: lerp(0, measure("No endless", 82, 400, -0.02) + 12, k(g, "endless+0.35", 0.4, MOVE)), height: 6, borderRadius: 3, background: TAUPE, transform: "rotate(-1.5deg)" }} />
    </div>
  );
};
