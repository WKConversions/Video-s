// B2: the map's pin layer with hand-placed labels (the coast cities sit ~40 px apart, so labels go left, right, above or below).
import React from "react";
import { C, SANS, c01, sp } from "../kit";
import { Ico, Pill } from "../ui";
import { F } from "./b2-shared";
import { CITIES, View, makeView } from "../globe";

export type Lab = { a: "l" | "r" | "c"; dx: number; dy: number; lead?: [number, number] };
export type Pin2 = { name: string; at: number; lab: Lab; count?: number; big?: boolean };
export const Pins: React.FC<{ v: View; t: number; pins: Pin2[]; size?: number; pulse2?: number; labelFade?: number }> = ({ v, t, pins, size = 40, pulse2, labelFade = 1 }) => {
  const m = makeView(v);
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {pins.map((p) => {
        const c = CITIES.find((x) => x.name === p.name)!; const [x, y, ok] = m.at(c.lon, c.lat); const q = c01(sp(t, p.at, 2.1, 0.55));
        if (!ok || q <= 0) return null;
        const r = p.count ? 22 : p.big ? 17 : 12, ring2 = pulse2 === undefined ? 1 : c01((t - pulse2) / 0.7), ring = c01((t - p.at) / 1.1), fs = p.big ? 50 : size, lo = c01((t - p.at - 0.05) / 0.25), L = p.lab;
        const lab: React.CSSProperties = { position: "absolute", whiteSpace: "nowrap", fontFamily: SANS, fontWeight: p.big ? 800 : 600, fontSize: fs, lineHeight: 1, color: C.cream, letterSpacing: "-0.01em", opacity: lo * labelFade, textShadow: "0 0 14px rgba(22,20,19,0.95), 0 0 5px rgba(22,20,19,0.95)", top: L.dy - fs / 2 };
        if (L.a === "l") Object.assign(lab, { right: -L.dx, textAlign: "right" }); else if (L.a === "r") Object.assign(lab, { left: L.dx }); else Object.assign(lab, { left: L.dx - 200, width: 400, textAlign: "center" });
        return (
          <div key={p.name} style={{ position: "absolute", left: 0, top: 0, transform: `translate(${x}px, ${y}px)`, willChange: "transform" }}>
            {L.lead && <svg width={1} height={1} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: lo * labelFade }}><line x1={0} y1={0} x2={L.lead[0]} y2={L.lead[1]} stroke="rgba(240,235,225,0.6)" strokeWidth={2} strokeLinecap="round" /></svg>}
            {ring < 1 && <div style={{ position: "absolute", left: -r * 3, top: -r * 3, width: r * 6, height: r * 6, borderRadius: r * 3, border: `2px solid rgba(226,90,61,${0.8 * (1 - ring)})`, transform: `scale(${0.3 + ring})` }} />}
            {pulse2 !== undefined && ring2 > 0 && ring2 < 1 && <div style={{ position: "absolute", left: -r * 3, top: -r * 3, width: r * 6, height: r * 6, borderRadius: r * 3, border: `2px solid rgba(226,90,61,${0.8 * (1 - ring2)})`, transform: `scale(${0.3 + ring2})` }} />}
            <div style={{ position: "absolute", left: -r, top: -r, width: 2 * r, height: 2 * r, borderRadius: r, background: C.coral, boxShadow: "0 0 0 3px rgba(22,20,19,0.9), 0 0 24px rgba(226,90,61,0.6)", transform: `scale(${q})`,
              display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontWeight: 800, fontSize: r * 0.95, color: C.cream }}>{p.count ?? ""}</div>
            <div style={lab}>{p.name}</div>
          </div>
        );
      })}
    </div>
  );
};

/** local copy of ui MapSheet with a fixed layout (238 app px tall; the pill is at x 16, y 182, 412 x 40) and a pill-opacity prop */
export const SHEET_H = 238, PILL_RECT = { x: 16, y: 182, w: 412, h: 40 };
export const MapSheet2: React.FC<{ city: string; count: number; rows: { letter: string; title: string; sub: string; fee: string }[]; pillOpacity?: number }> = ({ city, count, rows, pillOpacity = 1 }) => (
  <div style={{ position: "relative", width: 444, height: SHEET_H, borderRadius: 18, background: C.card, border: `1px solid ${C.border}`, boxSizing: "border-box" }}>
    <div style={{ position: "absolute", left: 16, top: 16, right: 16, height: 24, display: "flex", alignItems: "center", gap: 8 }}><span style={{ width: 9, height: 9, borderRadius: 5, background: C.coral }} /><span style={F(19, 700)}>{city}</span><div style={{ flex: 1 }} /><Ico n="x" s={18} c={C.muted} /></div>
    <span style={{ position: "absolute", left: 33, top: 42, ...F(13.5, 500, C.muted) }}>{count} open jobs</span>
    {rows.map((r, i) => <div key={r.title} style={{ position: "absolute", left: 16, right: 16, top: 70 + i * 50, height: 46, display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{ width: 34, height: 34, borderRadius: 8, background: C.cream, display: "flex", alignItems: "center", justifyContent: "center", ...F(14, 700, C.ink) }}>{r.letter}</div>
      <div style={{ flex: 1 }}><div style={F(15, 600)}>{r.title}</div><div style={F(13.5, 500, C.muted)}>{r.sub}</div></div><span style={F(15, 700)}>{r.fee}</span></div>)}
    <div style={{ position: "absolute", left: PILL_RECT.x, top: PILL_RECT.y, width: PILL_RECT.w, opacity: pillOpacity }}><Pill label={`See all ${count} in ${city}`} kind="cream" w="100%" /></div>
  </div>
);
