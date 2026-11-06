// S9 "All in one place." (25.6-27.7, B4). From H.booking (the booked tile alone, scale 2): on "All" pieces of the film fly in around it
// (Lucía's profile, a gig card, the Marbella map sheet, a chat, the Find talent switch); on "one place" they all converge and dive into
// the Phone, which settles centred; the tile travels into the phone's "This weekend" slot. Then the phone and tile leave (S10 takes over).
import React from "react";
import { C, SHADOW, k, sp, mix, c01, INOUT, w } from "../kit";
import { H } from "../handoff";
import { AppHeader, BookedTile, BottomNav, Bubble, Chip, GigCard, MapSheet, Phone, Segmented } from "../ui";
import { F, LuciaCard, Place, Seq } from "./b4-parts";
import { Scene } from "./types";

const T0 = 25.6;
const GIG = { tag: "HIRING", roles: "2 ROLES", title: "Photographer for a rooftop launch", by: "La Terraza", city: "Málaga", role: "Event photographer", open: "Open · 0/1", fee: "€350", time: "Sat 21 Nov", img: "clips/photog-lens.mp4" };
const TILE = { mon: "NOV", day: "21", dow: "Sat", name: "Javi Ortega", at: "Casa Brisa", time: "Sat · 20:00", img: "clips/dj-stage.mp4" };
const SHEET = [{ letter: "C", title: "Live DJ for sunset sessions", sub: "Casa Brisa · Fri 20 Nov", fee: "€280" }, { letter: "A", title: "Campaign designer", sub: "Atelier Mar", fee: "On request" }];

type Piece = { key: string; fx: number; fy: number; s: number; from: [number, number]; at: number; rot: number; node: React.ReactNode };
const PIECES: Piece[] = [
  { key: "profile", fx: 360, fy: 300, s: 1.2, from: [-460, 330], at: w("all"), rot: -7, node: <LuciaCard /> },
  { key: "gig", fx: 1560, fy: 330, s: 0.85, from: [2400, 330], at: w("all") + 0.1, rot: 7, node: <GigCard g={GIG} /> },
  { key: "map", fx: 360, fy: 790, s: 1.05, from: [-460, 1350], at: w("all") + 0.2, rot: 5, node: <MapSheet city="Marbella" count={6} rows={SHEET} /> },
  { key: "chat", fx: 1560, fy: 800, s: 1.35, from: [1560, 1400], at: w("all") + 0.3, rot: -5, node: (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-start" }}><Bubble text="Hi Javi! Fri 20 Nov, sunset set?" /><div style={{ alignSelf: "flex-end" }}><Bubble me text="Works for me." /></div></div>) },
  { key: "toggle", fx: 960, fy: 190, s: 1.5, from: [960, -220], at: w("all") + 0.4, rot: 0, node: <Segmented on={1} /> },
];

const PH_Y = 354; // the tile's slot in the phone (screen y 208-349 + the phone's top)

const S9C: React.FC<{ t: number }> = ({ t }) => {
  const conv = k(t, w("one") + 0.02, 0.55, INOUT);                 // the pieces converge on the centre
  const pq = sp(t, 26.5, 1.5, 0.8), ph = mix(0.5, 1, pq);          // the phone arrives
  const ex = k(t, 27.25, 0.5, INOUT);                              // and leaves
  const phS = ph * (1 - 0.14 * ex) * (1 + 0.012 * c01((t - 27.0) / 0.6)), phO = k(t, 26.5, 0.12) * (1 - ex);
  const c2 = k(t, 26.42, 0.62, INOUT);
  const ty = 540 + (PH_Y - 540) * phS;
  const tileS = t < 26.42 ? 2 + 0.03 * Math.max(0, t - H.booking.t) : mix(2.03 + 0.0, 1.36 * phS, c2);
  const tileY = mix(540, ty, c2);
  const tileO = 1 - k(t, 27.5, 0.3);
  return (
    <>
      {PIECES.map((p) => {
        const q = sp(t, p.at, 1.4, 0.8);
        if (q <= 0) return null;
        const x = mix(p.from[0], p.fx, q), y = mix(p.from[1], p.fy, q);
        const drift = 1 + 0.018 * c01((t - p.at) / 1.2);
        return <Place key={p.key} x={mix(x, 960, conv)} y={mix(y, 540, conv)} s={p.s * drift * mix(1, 0.3, conv)} r={p.rot * (1 - c01(q)) + Math.sin(t * 2.2 + p.fx) * 0.8 * (1 - conv)} o={1 - k(t, 26.78, 0.2)}>{p.node}</Place>;
      })}
      {t >= 26.5 && (
        <Place t={t} amp={3} x={960} y={540 + 30 * ex} s={phS} o={phO}>
          <Phone>
            <AppHeader />
            <div style={{ padding: "6px 18px 0" }}><Segmented w={408} on={0} /></div>
            <div style={{ display: "flex", gap: 8, padding: "12px 18px 0" }}>{["All", "Hiring", "Collab", "This week"].map((s, i) => <Chip key={s} label={s} on={i === 0} />)}</div>
            <div style={F(17, 700, C.cream, { padding: "16px 18px 8px" })}>This weekend on the coast</div>
            <div style={{ margin: "0 18px", width: 408, height: 141, borderRadius: 18, background: C.card }} />
            <div style={{ padding: "14px 18px 0", transform: `translateY(${-14 * k(t, 26.9, 1.2, (x) => x)}px)` }}><GigCard g={{ ...GIG, img: "clips/photog-lens.mp4" }} w={408} /></div>
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 0 }}><BottomNav /></div>
          </Phone>
        </Place>
      )}
      <Place x={960} y={tileY} s={tileS} o={tileO}>
        <div style={{ boxShadow: SHADOW, borderRadius: 14 }}><BookedTile {...TILE} />{t < 26.6 && <div style={{ position: "absolute", inset: 0, borderRadius: 14, overflow: "hidden" }}><div style={{ position: "absolute", top: 0, bottom: 0, width: 70, left: 0, transform: `translateX(${-80 + 460 * ((t - 25.6) / 0.9)}px) skewX(-18deg)`, background: "linear-gradient(90deg, rgba(240,235,225,0), rgba(240,235,225,0.22), rgba(240,235,225,0))" }} /></div>}</div>
      </Place>
    </>
  );
};
export const S9: Scene = { id: "S9", t0: T0, t1: 27.8, C: (p) => <Seq from={T0}><S9C {...p} /></Seq> };
