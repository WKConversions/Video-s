// S11 "After each completed booking, recommendations help build trust and strengthen your reputation." (30.6-36.05, B4)
// The "0" disc turns into the booking tile; "completed" it is stamped; recommendation cards rise out of it and pile up; on "build trust" they
// fly into Javi's profile (venue discs pop in as each lands: "Recommended by"); on "strengthen" the profile grows; it then becomes his row of
// the people list, which grows out of that row; on "reputation" his row lifts out of the list; a cream circle grows out of his badge (H.cream, 36.05).
import React from "react";
import { C, SHADOW, k, sp, mix, c01, INOUT, OUT, IN } from "../kit";
import { BookedTile } from "../ui";
import { DISC, F, javiRow, JaviProfile, PeopleList, Place, PUSH_END, RECS, RecCard, RiseL, Seq } from "./b4-parts";
import { Scene } from "./types";

const T0 = 30.6;
const TILE = { mon: "NOV", day: "21", dow: "Sat", name: "Javi Ortega", at: "Casa Brisa", time: "Sat · 20:00", img: "clips/dj-stage.mp4" };
const T = { completed: 31.4, booking: 31.78, recs: 32.56, build: 33.48, trust: 33.7, strengthen: 34.42, reputation: 35.08 };
const REC_AT = [32.56, 32.94, 33.22];                 // the cards rise out of the tile
const FLY_AT = [33.48, 33.7, 33.92];                  // and fly into Javi's profile
const LS = 2.7, LY = 640;                             // the people list: scale and centre y

const Head: React.FC<{ t: number; text: string; at: number; end: number; times?: number[]; colors?: (string | undefined)[] }> = ({ t, text, at, end, times, colors }) => {
  if (t < at - 0.1 || t > end + 0.5) return null;
  return <div style={{ position: "absolute", left: 0, top: 100, width: 1920, display: "flex", justifyContent: "center" }}><RiseL text={text} t={t} at={at} size={112} gap={0.1} times={times} out={k(t, end, 0.3, IN)} colors={colors} /></div>;
};

const S11C: React.FC<{ t: number }> = ({ t }) => {
  // 1. disc -> tile (the disc starts exactly where S10's push-in leaves it)
  const m = sp(t, 30.62, 1.5, 0.8);
  const dX = 960 + (DISC.x - 960) * PUSH_END, dY = 540 + (DISC.y - 540) * PUSH_END, dR = DISC.R * PUSH_END;
  const mx = mix(dX, 960, m), my = mix(dY, 540, m);
  const mw = mix(dR * 2, 840, m), mh = mix(dR * 2, 291, m), mr = mix(dR, 39, m);
  const holeS = dR * 0.52 * (1 - c01(m * 2.2));
  const tileO = k(t, 31.2, 0.2);
  // 2. the tile: stamp, then it sinks to the bottom and the cards rise out of it
  const sink = k(t, 32.3, 0.7, INOUT);
  const tileS = mix(2.8 + 0.049 * c01((t - 31.2) / 1.2), 1.4, sink);
  const tileY = mix(540, 930, sink);
  const stamp = sp(t, T.booking, 2.4, 0.5);
  const tileOut = 1 - k(t, 33.3, 0.35);
  const sheen = (t - 31.2) / 0.5;
  // the pile
  const pileDrop = k(t, 33.05, 0.5, INOUT);             // the pile drops before the profile arrives
  // the profile: enters from above, already opaque
  const prof = sp(t, 33.4, 1.5, 0.78);
  const grow = sp(t, T.strengthen, 1.4, 0.8);
  const profYb = mix(-300, 470, prof);
  const profS = mix(2.1, 3.08, grow), profY = mix(profYb, 590, grow);
  const pops = [0, 1, 2].map((i) => sp(t, FLY_AT[2 - i] + 0.34, 1.8, 0.55));   // CB, LT, AM pop in as their cards land
  const lit = k(t, 34.5, 0.35);
  // the profile becomes Javi's row, the list grows out of that row
  const carry = k(t, 34.95, 0.3, INOUT);
  const lift = sp(t, 35.25, 1.4, 0.82);
  const listS = LS * (1 + 0.012 * c01((t - 35.0) / 1.0)) * (1 - 0.04 * lift);
  const row = javiRow(listS, LY, lift);
  const rowC = javiRow(LS * (1 + 0.012 * c01((t - 35.0) / 1.0)), LY, 0);
  const listG = k(t, 34.95, 0.3, OUT);
  const rowO = [0, 1, 2].map((i) => k(t, 35.0 + 0.05 * i, 0.2));
  // cream: grows out of his badge and fills the frame on the last frame
  const cr = k(t, 35.58, 0.47, INOUT);
  const bx = row.bx, by = row.by;
  const rMax = Math.hypot(Math.max(bx, 1920 - bx), Math.max(by, 1080 - by)) + 2;
  const crR = 14 + (rMax - 14) * cr;
  return (
    <>
      <Head t={t} text="Completed" at={T.completed} end={32.22} />
      <Head t={t} text="Recommendations" at={T.recs} end={33.18} />
      <Head t={t} text="Build trust" at={T.build} end={34.1} times={[T.build, T.trust]} />
      <Head t={t} text="Strengthen your reputation" at={T.strengthen} end={35.5} times={[T.strengthen, 34.86 - 0.3, T.reputation]} colors={[, , C.coral]} />
      {/* the morphing disc, which lands in the tile's exact rect (600x208, radius 28) and gives way to it */}
      {t < 31.45 && (
        <div style={{ position: "absolute", left: 0, top: 0, width: mw, height: mh, borderRadius: mr, background: C.coral, transform: `translate(${mx - mw / 2}px, ${my - mh / 2}px)`, opacity: 1 - tileO }}>
          {holeS > 0.5 && <div style={{ position: "absolute", left: mw / 2 - holeS, top: mh / 2 - holeS, width: holeS * 2, height: holeS * 2, borderRadius: holeS, background: C.bg }} />}
        </div>
      )}
      {t >= 31.15 && (
        <Place t={t} x={960} y={tileY} s={tileS} o={tileO * tileOut}>
          <div style={{ position: "relative", boxShadow: SHADOW, borderRadius: 14 }}>
            <BookedTile {...TILE} />
            {sheen > 0 && sheen < 1 && <div style={{ position: "absolute", inset: 0, borderRadius: 14, overflow: "hidden" }}><div style={{ position: "absolute", top: 0, bottom: 0, width: 70, left: 0, transform: `translateX(${-80 + 460 * sheen}px) skewX(-18deg)`, background: "linear-gradient(90deg, rgba(240,235,225,0), rgba(240,235,225,0.22), rgba(240,235,225,0))" }} /></div>}
            {stamp > 0 && (
              <div style={{ position: "absolute", right: -16, bottom: -20, transform: `rotate(-6deg) scale(${mix(2.4, 1, c01(stamp)) + (stamp > 1 ? (stamp - 1) * 1 : 0)})`, opacity: c01(stamp * 3), transformOrigin: "100% 100%",
                display: "flex", alignItems: "center", gap: 6, height: 40, padding: "0 16px 0 12px", borderRadius: 20, background: C.coral, boxShadow: "0 0 24px rgba(226,90,61,0.5)", ...F(15, 800, C.cream, { letterSpacing: "0.1em" }) }}>
                <svg width={20} height={20} viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" fill={C.cream} /><path d="M7 12.5l3.2 3.2L17 9" stroke={C.coral} strokeWidth="2.8" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>COMPLETED</div>)}
          </div>
        </Place>
      )}
      {/* recommendation cards: rise out of the tile, pile up, fly into the profile */}
      {RECS.map((r, i) => {
        const q = sp(t, REC_AT[i], 1.5, 0.78);
        if (q <= 0) return null;
        const shift = REC_AT.map((a, j) => (j > i ? sp(t, a, 1.5, 0.8) : 0)).reduce((a, b) => a + b, 0);
        const baseY = mix(540, 800, pileDrop);
        const yy = mix(930, baseY - 28 * shift, c01(q) * 1 + (q - c01(q)));
        const ss = (2.45 * mix(0.45, 1, c01(q))) * (1 - 0.055 * shift);
        const fly = k(t, FLY_AT[2 - i], 0.34, IN);              // the front card (i = 2) goes first
        const px = mix(960, 960, fly), py = mix(yy, profYb, fly);
        const sfl = ss * mix(1, 0.32, fly);
        return (
          <Place key={i} t={t} x={px} y={py} s={sfl} o={c01(q * 3) * (1 - c01((fly - 0.7) / 0.3)) * (1 - k(t, 34.2, 0.15))} r={(1 - c01(q)) * (i % 2 ? 5 : -5)}>
            <div style={{ boxShadow: SHADOW, borderRadius: 18, position: "relative" }}><RecCard {...r} /><div style={{ position: "absolute", inset: 0, borderRadius: 18, background: `rgba(22,20,19,${0.3 * Math.min(2, shift)})` }} /></div>
          </Place>
        );
      })}
      {/* the people list: grows out of Javi's row */}
      {t >= 34.95 && (
        <Place x={960} y={LY} s={listS} o={1}>
          <PeopleList lift={lift} lit={lit} clip={listG} rowO={rowO} />
        </Place>
      )}
      {/* Javi's profile: arrives from above, grows, then becomes his row (carry) */}
      {prof > 0 && carry < 1 && (
        <Place x={960} y={mix(profY, rowC.cy, carry)} s={mix(profS * mix(0.8, 1, c01(prof)), LS * (1 + 0.012 * c01((t - 35.0) / 1.0)), carry)} o={c01(prof * 6)}>
          <div style={{ boxShadow: `0 0 30px rgba(0,0,0,${0.35 * (1 - carry)}), 0 0 90px rgba(0,0,0,${0.45 * (1 - carry)})`, borderRadius: 18 }}><JaviProfile pops={pops} lit={lit} m={carry} /></div>
        </Place>
      )}
      {/* a cream circle out of the badge */}
      {cr > 0 && <div style={{ position: "absolute", left: 0, top: 0, width: crR * 2, height: crR * 2, borderRadius: crR, background: C.paper, transform: `translate(${bx - crR}px, ${by - crR}px)` }} />}
    </>
  );
};
export const S11: Scene = { id: "S11", t0: T0, t1: 36.05, C: (p) => <Seq from={T0}><S11C {...p} /></Seq> };
