// B2: the map's pin layer with hand-placed labels (the coast cities sit ~40 px apart, so labels go left, right, above or below).
import React from "react";
import { C, SANS, c01, sp } from "../kit";
import { CITIES, View, makeView } from "../globe";

export type Place = "l" | "r" | "bl" | "br" | "al" | "ar";
export type Pin2 = { name: string; at: number; place: Place; count?: number; big?: boolean };
export const Pins: React.FC<{ v: View; t: number; pins: Pin2[]; size?: number }> = ({ v, t, pins, size = 30 }) => {
  const m = makeView(v);
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {pins.map((p) => {
        const c = CITIES.find((x) => x.name === p.name)!; const [x, y, ok] = m.at(c.lon, c.lat); const q = c01(sp(t, p.at, 2.1, 0.55));
        if (!ok || q <= 0) return null;
        const r = p.big ? 17 : 12, ring = c01((t - p.at) / 1.1), fs = p.big ? size * 1.25 : size, lo = c01((t - p.at - 0.05) / 0.25), pl = p.place;
        const lab: React.CSSProperties = { position: "absolute", whiteSpace: "nowrap", fontFamily: SANS, fontWeight: p.big ? 800 : 600, fontSize: fs, lineHeight: 1, color: C.cream, letterSpacing: "-0.01em", opacity: lo, textShadow: "0 0 12px rgba(22,20,19,0.95), 0 0 4px rgba(22,20,19,0.9)" };
        const sl = (1 - c01((t - p.at) / 0.35)) * 12;
        if (pl === "l") Object.assign(lab, { right: r + 10, top: -fs / 2, transform: `translateX(${sl}px)` });
        else if (pl === "r") Object.assign(lab, { left: r + 10, top: -fs / 2, transform: `translateX(${-sl}px)` });
        else if (pl === "bl") Object.assign(lab, { right: -6, top: r + 12, transform: `translateY(${-sl}px)` });
        else if (pl === "br") Object.assign(lab, { left: -6, top: r + 12, transform: `translateY(${-sl}px)` });
        else if (pl === "al") Object.assign(lab, { right: -6, bottom: r + 12, transform: `translateY(${sl}px)` });
        else Object.assign(lab, { left: -6, bottom: r + 12, transform: `translateY(${sl}px)` });
        return (
          <div key={p.name} style={{ position: "absolute", left: 0, top: 0, transform: `translate(${x}px, ${y}px)` }}>
            {ring < 1 && <div style={{ position: "absolute", left: -r * 3, top: -r * 3, width: r * 6, height: r * 6, borderRadius: r * 3, border: `2px solid rgba(226,90,61,${0.8 * (1 - ring)})`, transform: `scale(${0.3 + ring})` }} />}
            <div style={{ position: "absolute", left: -r, top: -r, width: 2 * r, height: 2 * r, borderRadius: r, background: C.coral, boxShadow: "0 0 0 3px rgba(22,20,19,0.9), 0 0 24px rgba(226,90,61,0.6)", transform: `scale(${q})`,
              display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontWeight: 800, fontSize: r * 0.95, color: C.cream }}>{p.count ?? ""}</div>
            <div style={lab}>{p.name}</div>
          </div>
        );
      })}
    </div>
  );
};
