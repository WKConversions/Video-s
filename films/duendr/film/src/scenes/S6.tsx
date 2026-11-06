// S6 "and explore opportunities on the map." 14.3-16.7: Karl's map. The globe grows out of S5's "Let's collab" pill, the camera settles from
// wide to the coast, 11 coral pins pop with Inter labels, arcs link them, Marbella's sheet rises; then the map sinks and the
// Find work / Find talent switch arrives, ending exactly at H.toggle.
import React from "react";
import { C, INOUT, OUT, SOFT, c01, k, mix, sp, SHADOW } from "../kit";
import { H } from "../handoff";
import { CITIES, View, makeView } from "../globe";
import { GlobeMap } from "../map";
import { Pin2, Pins } from "./b2-map";
import { MapSheet, Segmented } from "../ui";
import { Scene } from "./types";
import { PILL_Y } from "./S5";

const PINS: Pin2[] = [
  { name: "Cádiz", at: 14.62, place: "r" }, { name: "Sotogrande", at: 14.76, place: "l" }, { name: "Estepona", at: 14.9, place: "l" }, { name: "Marbella", at: 15.04, count: 6, place: "bl" },
  { name: "Fuengirola", at: 15.18, place: "br" }, { name: "Torremolinos", at: 15.3, place: "al" }, { name: "Málaga", at: 15.42, big: true, count: 12, place: "r" }, { name: "Nerja", at: 15.58, place: "r" },
  { name: "Ronda", at: 15.7, place: "r" }, { name: "Sevilla", at: 15.82, place: "r" }, { name: "Granada", at: 15.94, place: "l" },
];
const ARCS: [string, string, number][] = [["Málaga", "Marbella", 15.5], ["Málaga", "Granada", 16.0], ["Málaga", "Sevilla", 15.9], ["Málaga", "Ronda", 15.78], ["Málaga", "Nerja", 15.66], ["Marbella", "Sotogrande", 15.2], ["Marbella", "Ronda", 15.5]];
const pos = (n: string) => CITIES.find((c) => c.name === n)!;

const cam = (t: number): View => {
  const e = k(t, 14.3, 1.5, OUT), d = t - 14.3;
  return { lam0: -4.95 + 0.02 * d, phi0: 36.95, k: 10, pitch: mix(24, 38, e), d: 1.55, S: mix(1700, 3050, e) + 45 * d, cx: 960, cy: mix(560, 620, e) };
};
export const SHEET = { x: 380, y: 30, s: 1.6 };

const Arcs: React.FC<{ t: number; at: (lo: number, la: number) => [number, number, boolean] }> = ({ t, at }) => (
  <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
    {ARCS.map(([a, b, t0], i) => {
      const A = at(pos(a).lon, pos(a).lat), B = at(pos(b).lon, pos(b).lat); const p = k(t, t0, 0.5, OUT); if (!A[2] || !B[2] || p <= 0) return null;
      const dx = B[0] - A[0], dy = B[1] - A[1], L = Math.hypot(dx, dy), mx = (A[0] + B[0]) / 2, my = (A[1] + B[1]) / 2 - 0.28 * L;
      const u = ((t - t0) * 0.5 + i * 0.17) % 1, q = 1 - u, px = q * q * A[0] + 2 * q * u * mx + u * u * B[0], py = q * q * A[1] + 2 * q * u * my + u * u * B[1];
      const d = `M${A[0]} ${A[1]}Q${mx} ${my} ${B[0]} ${B[1]}`;
      return <g key={i}><path d={d} pathLength={1} fill="none" stroke="rgba(226,90,61,0.22)" strokeWidth={9} strokeDasharray="1 1" strokeDashoffset={1 - p} strokeLinecap="round" />
        <path d={d} pathLength={1} fill="none" stroke={C.coral} strokeWidth={3.2} strokeDasharray="1 1" strokeDashoffset={1 - p} strokeLinecap="round" />
        {p > 0.98 && <circle cx={px} cy={py} r={6} fill={C.cream} />}</g>;
    })}
  </svg>
);

const Body: React.FC<{ t: number }> = ({ t }) => {
  const v = cam(t), R = 1750 * k(t, 14.3, 0.8, SOFT), sink = k(t, 16.0, 0.5, INOUT), reveal = R < 1740;
  const [mx, my] = makeView(v).at(pos("Marbella").lon, pos("Marbella").lat);
  const sh = sp(t, 15.3, 1.7, 0.75), tg = k(t, 16.02, 0.68, OUT);
  return (
    <>
      <div style={{ position: "absolute", inset: 0, opacity: 1 - sink, transform: `translateY(${150 * sink}px) scale(${1 - 0.1 * sink})`, transformOrigin: "50% 60%", clipPath: reveal ? `circle(${R}px at 960px ${PILL_Y}px)` : undefined }}>
        <GlobeMap v={v} t={t} pins={[]}>{(at) => <Arcs t={t} at={at} />}</GlobeMap>
        <Pins v={v} t={t} pins={PINS} size={30} />
        <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, opacity: c01(sh * 2) }}>
          <path d={`M${mx} ${my - 18}L${mx} ${SHEET.y + 340 * SHEET.s / 1.6 + 120}`} stroke={C.coral} strokeWidth={3} strokeDasharray="1 8" strokeLinecap="round" fill="none" />
        </svg>
        <div style={{ position: "absolute", left: 0, top: 0, transform: `translate(${SHEET.x}px, ${SHEET.y + (1 - sh) * 70}px) scale(${SHEET.s})`, transformOrigin: "0 0", opacity: c01(sh * 2), boxShadow: SHADOW, borderRadius: 18 }}>
          <MapSheet city="Marbella" count={6} rows={[{ letter: "C", title: "Live DJ for sunset sessions", sub: "Casa Brisa · Fri 20 Nov", fee: "€280" }, { letter: "A", title: "Campaign designer", sub: "Atelier Mar", fee: "On request" }]} />
        </div>
      </div>
      {R < 1750 && R > 20 && <div style={{ position: "absolute", left: 960 - R, top: PILL_Y - R, width: 2 * R, height: 2 * R, borderRadius: R, border: `3px solid rgba(226,90,61,${0.7 * (1 - k(t, 14.3, 0.8))})` }} />}
      {tg > 0.001 && <div style={{ position: "absolute", left: H.toggle.x - 222, top: H.toggle.y - 22, width: 444, height: 44, opacity: c01(tg * 3), transform: `translateY(${(1 - tg) * 280}px) scale(${mix(1.2, H.toggle.scale, tg)})` }}><Segmented on={0} /></div>}
    </>
  );
};
export const S6: Scene = { id: "S6", t0: 14.3, t1: 16.7, C: ({ t }) => <div style={{ position: "absolute", inset: 0 }}><Body t={t} /></div> };
