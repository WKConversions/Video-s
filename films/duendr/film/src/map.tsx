// The curved-globe map in Duendr's style: space (dark) above a soft cream limb glow, land a warm dark grey with a
// thin cream coastline, the sea darker, a faint graticule, and coral pins with Inter labels (their app's map pins).
import React from "react";
import { C, SANS, c01, sp } from "./kit";
import { CITIES, View, makeView } from "./globe";

export type Pin = { name: string; at: number; count?: number; big?: boolean; side?: "l" | "r" };
/** v: the camera (animate it); pins: which cities pop when (film s); t: film time; glow: the limb glow 0..1 */
export const GlobeMap: React.FC<{ v: View; t: number; pins: Pin[]; glow?: number; labelSize?: number; children?: (at: (lon: number, lat: number) => [number, number, boolean]) => React.ReactNode }> =
  ({ v, t, pins, glow = 1, labelSize = 26, children }) => {
    const m = makeView(v);
    const limb = m.limbPath();
    return (
      <div style={{ position: "absolute", inset: 0 }}>
        <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
          <defs>
            <radialGradient id="gm-sea" cx="50%" cy="35%" r="75%"><stop offset="0" stopColor="#1C1917" /><stop offset="1" stopColor="#121010" /></radialGradient>
            <filter id="gm-blur" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="18" /></filter>
            <clipPath id="gm-limb"><path d={limb} /></clipPath>
          </defs>
          {/* the atmosphere: a soft cream glow along the limb */}
          <path d={limb} fill="none" stroke={`rgba(240,235,225,${0.16 * glow})`} strokeWidth={40} filter="url(#gm-blur)" />
          <path d={limb} fill="url(#gm-sea)" />
          <g clipPath="url(#gm-limb)">
            <path d={m.gridPath(0.5)} stroke="rgba(240,235,225,0.06)" strokeWidth={1.5} fill="none" />
            <path d={m.landPath()} fill="#2A2522" stroke="rgba(240,235,225,0.32)" strokeWidth={1.6} fillRule="evenodd" />
          </g>
          <path d={limb} fill="none" stroke={`rgba(240,235,225,${0.28 * glow})`} strokeWidth={2} />
        </svg>
        {children?.(m.at)}
        {pins.map((p) => {
          const c = CITIES.find((x) => x.name === p.name)!; const [x, y, ok] = m.at(c.lon, c.lat); const q = c01(sp(t, p.at, 2.1, 0.55));
          if (!ok || q <= 0) return null;
          const r = p.big ? 17 : 12; const ring = c01((t - p.at) / 1.1);
          return (
            <div key={p.name} style={{ position: "absolute", left: 0, top: 0, transform: `translate(${x}px, ${y}px)` }}>
              {ring < 1 && <div style={{ position: "absolute", left: -r * 3, top: -r * 3, width: r * 6, height: r * 6, borderRadius: r * 3, border: `2px solid rgba(226,90,61,${0.8 * (1 - ring)})`, transform: `scale(${0.3 + ring})` }} />}
              <div style={{ position: "absolute", left: -r, top: -r, width: 2 * r, height: 2 * r, borderRadius: r, background: C.coral, boxShadow: "0 0 0 3px rgba(22,20,19,0.9), 0 0 24px rgba(226,90,61,0.6)", transform: `scale(${q})`,
                display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontWeight: 800, fontSize: r * 0.95, color: C.cream }}>{p.count ?? ""}</div>
              <div style={{ position: "absolute", top: -labelSize * 0.62, ...(p.side === "l" ? { right: r + 10 } : { left: r + 10 }), whiteSpace: "nowrap", fontFamily: SANS, fontWeight: p.big ? 800 : 600, fontSize: p.big ? labelSize * 1.25 : labelSize,
                color: C.cream, letterSpacing: "-0.01em", opacity: c01((t - p.at - 0.05) / 0.25), transform: `translateX(${(1 - c01((t - p.at) / 0.35)) * (p.side === "l" ? 12 : -12)}px)`, textShadow: "0 0 12px rgba(22,20,19,0.9)" }}>{p.name}</div>
            </div>
          );
        })}
      </div>
    );
  };
