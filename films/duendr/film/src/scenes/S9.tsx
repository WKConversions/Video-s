// S9 "All in one place." (25.6-27.7, B4). From H.booking (the booked tile alone, scale 2): on "All" pieces of the film fly in around it
// (Lucía's profile, a gig card, the Marbella map sheet, a chat, the Find talent switch); on "one place" they all converge and dive into
// the Phone, which settles centred; the tile travels into the phone's "This weekend" slot. Then the phone and tile leave (S10 takes over).
import React from "react";
import { Sequence } from "remotion";
import { C, SHADOW, k, sp, mix, c01, INOUT, OUT, SOFT, w } from "../kit";
import { AppHeader, BookedTile, BottomNav, Bubble, Chip, GigCard, MapSheet, Phone, Segmented } from "../ui";
import { F, LuciaCard, Place, Seq } from "./b4-parts";
import { Scene } from "./types";

const T0 = 25.6;
const GIG = { tag: "HIRING", roles: "2 ROLES", title: "Photographer for a rooftop launch", by: "La Terraza", city: "Málaga", role: "Event photographer", open: "Open · 0/1", fee: "€350", time: "Sat 21 Nov", img: "clips/photog-lens.mp4" };
const TILE = { mon: "NOV", day: "21", dow: "Sat", name: "Javi Ortega", at: "Casa Brisa", time: "Sat · 20:00", img: "clips/dj-stage.mp4" };
const SHEET = [{ letter: "C", title: "Live DJ for sunset sessions", sub: "Casa Brisa · Fri 20 Nov", fee: "€280" }, { letter: "C", title: "Photographer for sunset sessions", sub: "Casa Brisa · Marbella", fee: "On request" }];

type Piece = { key: string; fx: number; fy: number; s: number; from: [number, number]; at: number; rot: number; node: React.ReactNode };
const PIECES: Piece[] = [
  { key: "profile", fx: 360, fy: 300, s: 1.2, from: [-460, 330], at: w("all"), rot: -7, node: <LuciaCard /> },
  { key: "gig", fx: 1560, fy: 330, s: 0.85, from: [2400, 330], at: w("all") + 0.1, rot: 7, node: <GigCard g={GIG} /> },
  { key: "map", fx: 360, fy: 790, s: 1.05, from: [-460, 1350], at: w("all") + 0.2, rot: 5, node: <MapSheet city="Marbella" count={6} rows={SHEET} /> },
  { key: "chat", fx: 1560, fy: 800, s: 1.35, from: [1560, 1400], at: w("all") + 0.3, rot: -5, node: (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-start" }}><Bubble text="Hi Javi! Fri 20 Nov, sunset set?" /><div style={{ alignSelf: "flex-end" }}><Bubble me text="Works for me. Sat 21 Nov, 20:00?" /></div></div>) },
  { key: "toggle", fx: 960, fy: 190, s: 1.5, from: [960, -220], at: w("all") + 0.4, rot: 0, node: <Segmented on={1} /> },
];

const S0 = 600 / 408;                                   // at H.booking the phone's slot is exactly the 600x208 tile (scale 2)
const PH_CY = 477, SLOT_CY = 290.5;                     // phone px: its centre, and the tile slot's centre (screen y 208-349 + 12)
const WRAP = 140;                                       // padding around the phone inside the clipped wrapper (rim and shadow)
const PHH = 954;
const GROW = 0.2;                                       // the lone tile grows gently (x2 -> x2.4) while the pieces fly in
const TILE_SEQ = Math.round(24.9 * 60) - Math.round(T0 * 60); // S8 plays this tile from 24.9: the clip carries on, no jump

const S9C: React.FC<{ t: number }> = ({ t }) => {
  const conv = k(t, w("one") + 0.02, 0.55, INOUT);                 // the pieces converge on the centre
  const ex = k(t, 27.25, 0.5, INOUT);                              // the phone leaves
  const c2 = k(t, 26.4, 0.55, INOUT);                              // the slot grows into the phone
  const open = k(t, 26.4, 0.45, OUT);                              // and the rest of the phone opens out of it
  const g = 1 + GROW * k(t, 25.72, 0.75, SOFT);                    // 1 at 25.6-25.72 (hand-off state exact)
  const S0g = S0 * g;
  const phS = mix(S0g, 1, c2) * (1 - 0.14 * ex) * (1 + 0.012 * c01((t - 27.0) / 0.6)), phO = 1 - ex;
  const phY = mix(540 + (PH_CY - SLOT_CY) * S0g, 540, c2) + 30 * ex;
  const shO = k(t, 25.7, 0.3) * (1 - k(t, 26.4, 0.4));            // the tile's shadow, until the phone's own takes over
  const insetT = (12 + 208) + WRAP, insetB = (PHH - (12 + 349)) + WRAP, insetX = 30 + WRAP;
  const clip = open >= 1 ? undefined : `inset(${insetT * (1 - open)}px ${insetX * (1 - open)}px ${insetB * (1 - open)}px ${insetX * (1 - open)}px round ${19 * (1 - open)}px)`;
  return (
    <>
      {phO > 0.003 && <div style={{ position: "absolute", left: 960 - 204 * phS, top: phY + (SLOT_CY - PH_CY) * phS - 70.5 * phS, width: 408 * phS, height: 141 * phS, borderRadius: 19 * phS, boxShadow: SHADOW, opacity: shO * phO }} />}
      <Place x={960} y={phY} s={phS} o={phO}>
        <div style={{ padding: WRAP, clipPath: clip }}>
          <Phone>
            <AppHeader />
            <div style={{ padding: "6px 18px 0" }}><Segmented w={408} on={0} /></div>
            <div style={{ display: "flex", gap: 8, padding: "12px 18px 0" }}>{["All", "Hiring", "Collab", "This week"].map((s, i) => <Chip key={s} label={s} on={i === 0} />)}</div>
            <div style={F(17, 700, C.cream, { padding: "16px 18px 8px" })}>This weekend on the coast</div>
            <div style={{ margin: "0 18px", width: 408, height: 141, borderRadius: 19, position: "relative", overflow: "hidden", background: C.card }}>
              <div style={{ transform: "scale(1.36)", transformOrigin: "0 0", width: 300, height: 104, position: "relative" }}>
                <Sequence from={TILE_SEQ} layout="none"><BookedTile {...TILE} /></Sequence>
                {t < 26.6 && <div style={{ position: "absolute", top: 0, bottom: 0, width: 70, left: 0, transform: `translateX(${-80 + 460 * ((t - 25.6) / 0.9)}px) skewX(-18deg)`, background: "linear-gradient(90deg, rgba(240,235,225,0), rgba(240,235,225,0.22), rgba(240,235,225,0))" }} />}
              </div>
            </div>
            <div style={{ padding: "14px 18px 0", transform: `translateY(${-14 * k(t, 26.9, 1.2, (x) => x)}px)` }}><GigCard g={{ ...GIG, img: "clips/photog-lens.mp4" }} w={408} /></div>
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 0 }}><BottomNav /></div>
          </Phone>
        </div>
      </Place>
      {PIECES.map((p) => {
        const q = sp(t, p.at, 1.4, 0.8);
        if (q <= 0) return null;
        const x = mix(p.from[0], p.fx, q), y = mix(p.from[1], p.fy, q);
        const drift = 1 + 0.018 * c01((t - p.at) / 1.2);
        return <Place key={p.key} x={mix(x, 960, conv)} y={mix(y, 600, conv)} s={p.s * drift * mix(1, 0.25, conv)} r={p.rot * (1 - c01(q)) + Math.sin(t * 2.2 + p.fx) * 0.8 * (1 - conv)} o={1 - k(t, 26.8, 0.12)}>{p.node}</Place>;
      })}
    </>
  );
};
export const S9: Scene = { id: "S9", t0: T0, t1: 27.8, C: (p) => <Seq from={T0}><S9C {...p} /></Seq> };
