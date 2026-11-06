// S11 "After each completed booking, recommendations help build trust and strengthen your reputation." (30.6-36.05, B4)
// The "0" disc turns into the booking tile; "completed" it is stamped; recommendation cards rise out of it and pile up; on "build trust" they
// fly into Javi's profile one by one (a counter 1, 2, 3); on "strengthen" the profile grows and its badge lights; on "reputation" Javi's row
// climbs to the top of the people list; a cream circle grows out of his badge until the frame is cream (H.cream, 36.05).
import React from "react";
import { C, SHADOW, k, sp, mix, c01, INOUT, IN, Rise } from "../kit";
import { BookedTile } from "../ui";
import { DISC, F, JAVI_BADGE_X, JaviProfile, LIST_PAD, LIST_W, PeopleList, Place, RECS, RecCard, ROW_H, Seq } from "./b4-parts";
import { Scene } from "./types";

const T0 = 30.6;
const TILE = { mon: "NOV", day: "21", dow: "Sat", name: "Javi Ortega", at: "Casa Brisa", time: "Sat · 20:00", img: "clips/dj-stage.mp4" };
const T = { completed: 31.4, booking: 31.78, recs: 32.56, build: 33.48, trust: 33.7, strengthen: 34.42, reputation: 35.08 };
const REC_AT = [32.56, 32.94, 33.22];                 // the cards rise out of the tile
const FLY_AT = [33.48, 33.7, 33.92];                  // and fly into Javi's profile
const LS = 2.1, LY = 575;                             // the people list: scale and centre y
const BX = 960 - (LIST_W / 2) * LS + (LIST_PAD + JAVI_BADGE_X) * LS;
const BY = LY - ((ROW_H * 4 + LIST_PAD * 2) / 2) * LS + (LIST_PAD + ROW_H / 2) * LS;

const Head: React.FC<{ t: number; text: string; at: number; end: number; times?: number[]; colors?: (string | undefined)[] }> = ({ t, text, at, end, times, colors }) => {
  if (t < at - 0.1 || t > end + 0.5) return null;
  return <div style={{ position: "absolute", left: 0, top: 100, width: 1920, display: "flex", justifyContent: "center" }}><Rise text={text} t={t} at={at} size={112} gap={0.1} times={times} out={k(t, end, 0.3, IN)} colors={colors} /></div>;
};

const S11C: React.FC<{ t: number }> = ({ t }) => {
  // 1. disc -> tile
  const m = k(t, 30.62, 0.62, INOUT);
  const mx = mix(DISC.x, 960, m), my = mix(DISC.y, 540, m);
  const mw = mix(DISC.R * 2, 600, m), mh = mix(DISC.R * 2, 208, m), mr = mix(DISC.R, 28, m);
  const holeS = DISC.R * 0.52 * (1 - c01(m * 2.2));
  const tileO = k(t, 30.85, 0.3);
  // 2. the tile: stamp, then it sinks to the bottom and the cards rise out of it
  const sink = k(t, 32.3, 0.7, INOUT);
  const tileS = mix(2 + 0.035 * c01((t - 31.2) / 1.2), 1.0, sink);
  const tileY = mix(540, 930, sink);
  const stamp = sp(t, T.booking, 2.4, 0.5);
  const tileOut = 1 - k(t, 33.3, 0.35);
  // the pile
  const pileDrop = k(t, 33.3, 0.6, INOUT);              // the pile moves down as the profile arrives
  // the profile
  const prof = sp(t, 33.3, 1.5, 0.78);
  const grow = sp(t, T.strengthen, 1.4, 0.8);
  const profS = mix(1.6, 2.2, grow), profY = mix(375, 560, grow);
  const profOut = k(t, 35.0, 0.3);
  const counted = FLY_AT.filter((a) => t >= a + 0.34).length;
  const lastLand = Math.max(...FLY_AT.map((a) => (t >= a + 0.34 ? a + 0.34 : 0)));
  const pop = lastLand ? Math.max(0, Math.sin(Math.PI * c01((t - lastLand) / 0.4))) : 0;
  const lit = k(t, 34.5, 0.35);
  // the list
  const listS = LS * (1 + 0.012 * c01((t - 35.0) / 1.0)) * mix(0.9, 1, sp(t, 34.98, 1.5, 0.8));
  const listIn = k(t, 34.98, 0.25);
  const climb = sp(t, 35.12, 1.4, 0.82);
  // cream
  const cr = k(t, 35.5, 0.5, INOUT);
  const crR = 14 + 1500 * cr;
  return (
    <>
      <Head t={t} text="Completed" at={T.completed} end={32.4} />
      <Head t={t} text="Recommendations" at={T.recs} end={33.4} />
      <Head t={t} text="Build trust" at={T.build} end={34.3} times={[T.build, T.trust]} />
      <Head t={t} text="Strengthen your reputation" at={T.strengthen} end={35.5} times={[T.strengthen, 34.86 - 0.3, T.reputation]} colors={[, , C.coral]} />
      {/* the morphing disc / tile */}
      {t < 31.0 && (
        <div style={{ position: "absolute", left: 0, top: 0, width: mw, height: mh, borderRadius: mr, background: C.coral, transform: `translate(${mx - mw / 2}px, ${my - mh / 2}px)`, opacity: 1 - tileO }}>
          {holeS > 0.5 && <div style={{ position: "absolute", left: mw / 2 - holeS, top: mh / 2 - holeS, width: holeS * 2, height: holeS * 2, borderRadius: holeS, background: C.bg }} />}
        </div>
      )}
      {t >= 30.8 && (
        <Place x={960} y={tileY} s={tileS * (0.94 + 0.06 * tileO)} o={tileO * tileOut}>
          <div style={{ position: "relative", boxShadow: SHADOW, borderRadius: 14 }}>
            <BookedTile {...TILE} />
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
        const baseY = mix(540, 790, pileDrop);
        const yy = mix(930, baseY - 70 * shift - 40 * 0, c01(q) * 1 + (q - c01(q)));
        const ss = (1.75 * mix(0.45, 1, c01(q))) * (1 - 0.055 * shift);
        const fly = k(t, FLY_AT[2 - i], 0.34, IN);              // the front card (i = 2) goes first
        const px = mix(960, 960, fly), py = mix(yy, 375, fly);
        const sfl = ss * mix(1, 0.32, fly);
        const bob = Math.sin(t * 2 + i) * 3;
        return (
          <Place key={i} x={px} y={py + bob} s={sfl} o={c01(q * 3) * (1 - c01((fly - 0.7) / 0.3)) * (1 - k(t, 34.2, 0.15))} r={(1 - c01(q)) * (i % 2 ? 5 : -5)}>
            <div style={{ boxShadow: SHADOW, borderRadius: 18, position: "relative" }}><RecCard {...r} /><div style={{ position: "absolute", inset: 0, borderRadius: 18, background: `rgba(22,20,19,${0.3 * Math.min(2, shift)})` }} /></div>
          </Place>
        );
      })}
      {/* Javi's profile */}
      {prof > 0 && (
        <Place x={960} y={profY} s={profS * mix(0.8, 1, c01(prof))} o={c01(prof * 2) * (1 - profOut)}>
          <div style={{ boxShadow: SHADOW, borderRadius: 18 }}><JaviProfile count={counted} pop={pop} lit={lit} /></div>
        </Place>
      )}
      {/* the people list */}
      {listIn > 0 && (
        <Place x={960} y={LY} s={listS} o={listIn}>
          <div style={{ boxShadow: SHADOW, borderRadius: 20 }}><PeopleList p={climb} lit={lit} /></div>
        </Place>
      )}
      {/* a cream circle out of the badge */}
      {cr > 0 && <div style={{ position: "absolute", left: 0, top: 0, width: crR * 2, height: crR * 2, borderRadius: crR, background: C.paper, transform: `translate(${BX - crR}px, ${BY - crR}px)` }} />}
    </>
  );
};
export const S11: Scene = { id: "S11", t0: T0, t1: 36.05, C: (p) => <Seq from={T0}><S11C {...p} /></Seq> };
