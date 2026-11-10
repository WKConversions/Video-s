// Scene B's animated copy of the kit's HostingCard (ui.tsx): the same layout to the pixel when every row is done,
// with each row as an event: it slides in, its value types, its small logo turns, then it turns green with the check
// drawing itself and a tint sweeping across the row. Scene B swaps to the kit's card once everything has settled.
import React from "react";
import { C, SANS, SERIF, SHADOW_BIG } from "../lib";
import { Spinner } from "../dots";
import { CARD, CARD_ROWS, CARD_R } from "../ui";

// in 0..1 the row slides in; chars = letters of the value shown (caret while typing); a 0..1 "Sætter op" → "Aktiv";
// draw 0..1 the check draws itself; tint 0..1 the sage tint sweeps across (tintO its strength); pulse 0..1 the check swells
export type HRow = { in: number; chars: number; caret: boolean; a: number; draw: number; tint: number; tintO: number; pulse: number };
export const HostCard: React.FC<{ g: number; rows: HRow[]; price: number; spin: number }> = ({ g, rows, price, spin }) => (
  <div style={{ position: "relative", width: CARD.w, height: CARD.h, borderRadius: 24, background: C.white, boxShadow: `0 0 0 1px ${C.line}, ${SHADOW_BIG}`, fontFamily: SANS, color: C.ink, overflow: "hidden" }}>
    {rows.map((r, i) => { const R = CARD_R.rows[i]; return r.tint > 0 && r.tintO > 0 ? <div key={i} style={{ position: "absolute", left: 0, top: R.y, width: CARD.w, height: R.h, background: "rgba(135,168,158,0.22)", transformOrigin: "0% 50%", transform: `scaleX(${r.tint.toFixed(4)})`, opacity: r.tintO }} /> : null; })}
    <div style={{ position: "absolute", left: 64, top: 56, fontSize: 15, fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", color: C.muted }}>Hosting</div>
    <div style={{ position: "absolute", left: 64, top: 86, fontFamily: SERIF, fontSize: 52, letterSpacing: "-0.025em", lineHeight: 1.1 }}>holmfysio.dk</div>
    {spin > 0 && <div style={{ position: "absolute", left: 900, top: 104 }}><Spinner g={g} size={64} p={spin} speed={200} /></div>}
    {CARD_ROWS.map(([l, v], i) => {
      const r = rows[i], R = CARD_R.rows[i], q = r.in, a = r.a;
      if (q <= 0) return null;
      return (
        <div key={l} style={{ position: "absolute", left: R.x, top: R.y, width: R.w, height: R.h, borderTop: `1px solid ${C.line}`, display: "flex", alignItems: "center", opacity: q, transform: `translateY(${((1 - q) * 40).toFixed(2)}px)` }}>
          <div><div style={{ fontSize: 17, color: C.muted }}>{l}</div>
            <div style={{ marginTop: 4, fontSize: 25, fontWeight: 500, letterSpacing: "-0.01em", whiteSpace: "nowrap", position: "relative" }}>
              <span style={{ visibility: "hidden" }}>{v}</span>
              <span style={{ position: "absolute", left: 0, top: 0 }}>{v.slice(0, r.chars)}{r.caret && <span style={{ display: "inline-block", width: 2, height: 26, marginLeft: 2, verticalAlign: "-4px", background: C.sageDark }} />}</span>
            </div></div>
          <div style={{ flex: 1 }} />
          <div style={{ position: "relative", height: 44, width: 168, borderRadius: 999, overflow: "hidden", background: `color-mix(in srgb, ${C.sageTint} ${a * 100}%, #F1EEE8)`, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, fontSize: 17, fontWeight: 500 }}>
            {a < 1 && <div style={{ display: "flex", alignItems: "center", gap: 10, opacity: 1 - a, position: "absolute", transform: `translateY(${(-a * 40).toFixed(2)}px)` }}>
              <div style={{ position: "relative", width: 22, height: 22 }}><div style={{ position: "absolute", left: 11, top: 11 }}><Spinner g={g + i * 7} size={24} color="#9C968E" /></div></div>
              <span style={{ color: C.muted }}>Sætter op</span></div>}
            {a > 0 && <div style={{ display: "flex", alignItems: "center", gap: 9, opacity: a, position: "absolute", color: C.sageDeep, transform: `translateY(${((1 - a) * 40).toFixed(2)}px)` }}>
              <div style={{ width: 24, height: 24, borderRadius: "50%", background: C.sage, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${(1 + 0.22 * r.pulse).toFixed(4)})` }}>
                <svg width={16} height={16} viewBox="0 0 48 48" fill="none" stroke={C.white} strokeWidth={(3 * 48) / 26} strokeLinecap="round" strokeLinejoin="round" style={{ display: "block", flex: "none" }}>
                  <path d="M12 25 L20 33 L36 15" strokeDasharray={36} strokeDashoffset={r.draw >= 1 ? undefined : 36 * (1 - r.draw)} style={r.draw >= 1 ? { strokeDasharray: "none" } : undefined} /></svg>
              </div>Aktiv</div>}
          </div>
        </div>
      );
    })}
    <div style={{ position: "absolute", left: 64, top: 498, width: 872, height: 1, background: C.line, opacity: price }} />
    <div style={{ position: "absolute", left: 64, top: 528, opacity: price, transform: `translateY(${((1 - price) * 40).toFixed(2)}px)` }}>
      <div style={{ fontFamily: SERIF, fontSize: 54, letterSpacing: "-0.025em", lineHeight: 1 }}>99 kr.<span style={{ fontSize: 30, color: C.muted }}> /md.</span></div>
      <div style={{ marginTop: 10, fontSize: 16, color: C.muted }}>Uden binding</div>
    </div>
    <div style={{ position: "absolute", left: 744, top: 540, width: 192, height: 60, borderRadius: 12, background: C.ink, color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 19, fontWeight: 500,
      opacity: price, transform: `translateY(${((1 - price) * 40).toFixed(2)}px)` }}>Sæt online</div>
  </div>
);
