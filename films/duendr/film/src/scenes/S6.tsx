// S6 "and explore opportunities on the map." 14.3-16.7: Karl's map. The globe grows out of S5's "Let's collab" pill, the camera settles from
// wide to the coast, 11 coral pins pop with Inter labels, arcs link them, Marbella's sheet rises; then the map sinks and the
// Find work / Find talent switch arrives, ending exactly at H.toggle.
import React from "react";
import { C, INOUT, OUT, c01, k, mix, sp, SHADOW } from "../kit";
import { H } from "../handoff";
import { CITIES, View, makeView } from "../globe";
import { GlobeMap } from "../map";
import { MapSheet2, PILL_RECT, Pin2, Pins, SHEET_H } from "./b2-map";
import { Segmented } from "../ui";
import { F } from "./b2-shared";
import { Scene } from "./types";
import { PILL_Y } from "./S5";

const PINS: Pin2[] = [
  { name: "Cádiz", at: 14.52, lab: { a: "r", dx: 24, dy: 0 } }, { name: "Sotogrande", at: 14.62, lab: { a: "l", dx: -24, dy: 0 } }, { name: "Estepona", at: 14.72, lab: { a: "l", dx: -24, dy: -10 } },
  { name: "Marbella", at: 14.82, count: 6, lab: { a: "c", dx: 0, dy: 92, lead: [0, 66] } }, { name: "Fuengirola", at: 14.92, lab: { a: "c", dx: -15, dy: 40 } },
  { name: "Torremolinos", at: 15.02, lab: { a: "r", dx: 40, dy: 62, lead: [34, 50] } }, { name: "Málaga", at: 15.12, big: true, lab: { a: "r", dx: 30, dy: -6 } },
  { name: "Nerja", at: 15.24, lab: { a: "c", dx: 0, dy: -38 } }, { name: "Ronda", at: 15.36, lab: { a: "c", dx: 0, dy: -36 } }, { name: "Sevilla", at: 15.48, lab: { a: "r", dx: 24, dy: 0 } },
  { name: "Granada", at: 15.6, lab: { a: "r", dx: 24, dy: 0 } },
];
const ARCS: [string, string, number][] = [["Málaga", "Marbella", 15.22], ["Málaga", "Nerja", 15.34], ["Málaga", "Ronda", 15.46], ["Málaga", "Sevilla", 15.58], ["Málaga", "Granada", 15.7]];
const pos = (n: string) => CITIES.find((c) => c.name === n)!;

const cam = (t: number): View => {
  const e = k(t, 14.3, 1.5, OUT), d = t - 14.3;
  return { lam0: -4.9, phi0: mix(36.95, 36.6, e), k: 10, pitch: mix(24, 38, e), d: 1.55, S: mix(1700, 3400, e) + 30 * d, cx: 960, cy: mix(560, 580, e) };
};
export const SHEET = { x: 560, y: 36, s: 1.8 };
const T_OUT = 16.2, DETACH = 16.22;

const Arcs: React.FC<{ t: number; at: (lo: number, la: number) => [number, number, boolean] }> = ({ t, at }) => (
  <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
    {ARCS.map(([a, b, t0], i) => {
      const A = at(pos(a).lon, pos(a).lat), B = at(pos(b).lon, pos(b).lat); const p = k(t, t0, 0.5, OUT); if (!A[2] || !B[2] || p <= 0) return null;
      const L = Math.hypot(B[0] - A[0], B[1] - A[1]), lift = Math.min(0.45 * L, 160);
      const c1: [number, number] = [A[0], A[1] - lift], c2: [number, number] = [B[0], B[1] - lift];
      const u = ((t - t0) * 0.5 + i * 0.17) % 1, q = 1 - u, w0 = q * q * q, w1 = 3 * q * q * u, w2 = 3 * q * u * u, w3 = u * u * u;
      const px = w0 * A[0] + w1 * c1[0] + w2 * c2[0] + w3 * B[0], py = w0 * A[1] + w1 * c1[1] + w2 * c2[1] + w3 * B[1];
      const d = `M${A[0]} ${A[1]}C${c1[0]} ${c1[1]} ${c2[0]} ${c2[1]} ${B[0]} ${B[1]}`;
      return <g key={i}><path d={d} pathLength={1} fill="none" stroke="rgba(226,90,61,0.22)" strokeWidth={9} strokeDasharray="1 1" strokeDashoffset={1 - p} strokeLinecap="round" />
        <path d={d} pathLength={1} fill="none" stroke={C.coral} strokeWidth={3.2} strokeDasharray="1 1" strokeDashoffset={1 - p} strokeLinecap="round" />
        {p > 0.98 && <circle cx={px} cy={py} r={6} fill={C.cream} />}</g>;
    })}
  </svg>
);

const Body: React.FC<{ t: number }> = ({ t }) => {
  const v = cam(t), R = mix(38, 1750, k(t, 14.3, 0.6, INOUT)), reveal = R < 1740;
  const sink = k(t, DETACH, 0.28, INOUT), lf = 1 - k(t, T_OUT, 0.12);
  const [mx, my] = makeView(v).at(pos("Marbella").lon, pos("Marbella").lat);
  const sh = sp(t, 15.0, 1.7, 0.75);
  // the cream "See all" pill detaches and springs into the switch's thumb
  const e = k(t, DETACH, 0.36, INOUT), tr = k(t, 16.38, 0.2), fin = t >= 16.6;
  const P0 = { x: SHEET.x + PILL_RECT.x * SHEET.s, y: SHEET.y + PILL_RECT.y * SHEET.s, w: PILL_RECT.w * SHEET.s, h: PILL_RECT.h * SHEET.s };
  const P1 = { x: 960 - 533 + 7.2, y: 540 - 53 + 7.2, w: 518.4, h: 91.2 };
  const L = (a: number, b: number) => mix(a, b, e);
  return (
    <>
      <div style={{ position: "absolute", inset: 0, opacity: 1 - sink, transform: `translateY(${120 * sink}px)`, clipPath: reveal ? `circle(${R}px at 960px ${PILL_Y}px)` : undefined }}>
        <GlobeMap v={v} t={t} pins={[]}>{(at) => <div style={{ opacity: lf }}><Arcs t={t} at={at} /></div>}</GlobeMap>
        <Pins v={v} t={t} pins={PINS} size={40} pulse2={16.08} labelFade={lf} />
        <div style={{ opacity: lf }}>
          <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, opacity: c01(sh * 2) }}>
            <path d={`M${mx} ${my - 26}L${mx} ${SHEET.y + SHEET_H * SHEET.s}`} stroke={C.coral} strokeWidth={3} strokeDasharray="1 8" strokeLinecap="round" fill="none" />
          </svg>
          <div style={{ position: "absolute", left: 0, top: 0, transform: `translate(${SHEET.x}px, ${SHEET.y + (1 - sh) * 70}px) scale(${SHEET.s})`, transformOrigin: "0 0", opacity: c01(sh * 2), boxShadow: SHADOW, borderRadius: 18 }}>
            <MapSheet2 city="Marbella" count={6} pillOpacity={t < T_OUT ? 1 : 0} rows={[{ letter: "C", title: "Live DJ for sunset sessions", sub: "Casa Brisa · Fri 20 Nov", fee: "€280" }, { letter: "C", title: "Photographer for sunset sessions", sub: "Casa Brisa · Marbella", fee: "On request" }]} />
          </div>
        </div>
      </div>
      {R < 1750 && R > 20 && <div style={{ position: "absolute", left: 960 - R, top: PILL_Y - R, width: 2 * R, height: 2 * R, borderRadius: R, background: C.coral, opacity: 1 - k(t, 14.36, 0.22) }} />}
      {R < 1750 && R > 20 && <div style={{ position: "absolute", left: 960 - R, top: PILL_Y - R, width: 2 * R, height: 2 * R, borderRadius: R, border: `3px solid rgba(226,90,61,${0.7 * (1 - k(t, 14.3, 0.8))})` }} />}
      {tr > 0 && !fin && <div style={{ position: "absolute", left: 960 - 533, top: 540 - 53, width: 1066, height: 106, borderRadius: 53, background: C.card2, opacity: tr, transform: `scale(${mix(0.94, 1, tr)})` }}>
        <div style={{ position: "absolute", right: 0, top: 0, width: 533, height: 106, display: "flex", alignItems: "center", justifyContent: "center", ...F(36, 600, C.muted) }}>Find talent</div>
      </div>}
      {t >= T_OUT + 0.02 && !fin && <div style={{ position: "absolute", left: 0, top: 0, width: L(P0.w, P1.w), height: L(P0.h, P1.h), borderRadius: L(P0.h / 2, 45.6), background: C.cream, transform: `translate(${L(P0.x, P1.x)}px, ${L(P0.y, P1.y)}px)`, display: "flex", alignItems: "center", justifyContent: "center", whiteSpace: "nowrap" }}>
        <span style={{ position: "absolute", ...F(L(15 * SHEET.s, 36), 600, C.ink), opacity: 1 - c01(e * 2.2) }}>See all 6 in Marbella</span>
        <span style={{ position: "absolute", ...F(36, 600, C.ink), opacity: c01((e - 0.45) / 0.55) }}>Find work</span>
      </div>}
      {fin && <div style={{ position: "absolute", left: H.toggle.x - 222, top: H.toggle.y - 22, width: 444, height: 44, transform: `scale(${H.toggle.scale})` }}><Segmented on={0} /></div>}
    </>
  );
};
export const S6: Scene = { id: "S6", t0: 14.3, t1: 16.7, C: ({ t }) => <div style={{ position: "absolute", inset: 0 }}><Body t={t} /></div> };
