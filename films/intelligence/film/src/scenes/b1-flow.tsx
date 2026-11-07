// B1 flow: one continuous timeline for 0 - 17.2 s (home -> knowledge base -> Sales department). S1, S2 and S3 each draw this same
// function inside their own windows, so the overlaps (5.6 - 6.0, 11.4 - 11.6) are pixel-identical and the hand-offs exact.
import React from "react";
import { Img, staticFile } from "remotion";
import { Cursor, INOUT, OUT, SW, SH, SOFT, SANS, k, mix, sp, c01 } from "../kit";
import {
  Bump, CamT, DEPT_RECT, HOME_CARDS, HOME_GREET, HWW_RECT, LiftTo, MUTED, PAGE, PB_RECT, Page01, Page02, Page06, PlaybooksCard, Region, STRAT_RECT,
  SOFTSH, pchip, toF, K6, Rect,
} from "./b1-parts";

void Img; void staticFile; void SANS; void MUTED;

// --- camera: one monotone spline over the whole job; ends exactly at the hand-off H1 {x:1280, y:600, s:1.0}
const CAM_S = [[0, 1.2], [3, 1.27], [5, 1.31], [6.2, 1.39], [8, 1.36], [11.8, 1.42], [13, 1.12], [16.9, 1.0], [20, 1.0]];
const CAM_Y = [[0, 325], [5, 330], [6.2, 335], [8, 490], [11.8, 520], [13, 560], [16.9, 600], [20, 600]];
export const camAt = (t: number): CamT => ({ x: 1280, y: pchip(CAM_Y, t), s: pchip(CAM_S, t) });

// --- cursor: waypoints in screen px [t, x, y]
const CUR = [[1.2, 1780, 780], [3.0, 1500, 650], [4.4, 1200, 600], [5.5, 1000, 540], [6.2, 965, 525], [7.2, 1020, 505], [8.7, 1040, 512], [9.2, 1420, 512],
  [9.9, 1800, 512], [10.8, 1420, 730], [11.6, 1010, 505], [11.85, 1010, 505], [12.6, 1300, 560], [13.6, 1900, 500]];
const curAt = (t: number) => ({ x: pchip(CUR.map((a) => [a[0], a[1]]), t), y: pchip(CUR.map((a) => [a[0], a[2]]), t) });

const DEPT_AT = [[0, 0, 8.76], [1, 0, 9.22], [2, 0, 9.92], [1, 1, 10.8]]; // [col, row, film time]: Sales, Marketing, Operations, Finance
const lift = (t: number, a: number, hold: number, spf = 1.7, z = 0.8, drop = 0.4) => sp(t, a, spf, z) * (1 - k(t, a + hold, drop, INOUT));

const Slab: React.FC<{ rect: Rect; children: React.ReactNode; style?: React.CSSProperties }> = ({ rect, children, style }) => (
  <div style={{ position: "absolute", left: rect.x, top: rect.y, width: rect.w, height: rect.h, ...style }}>{children}</div>
);

export const Flow: React.FC<{ t: number }> = ({ t }) => {
  const cam = camAt(t);
  const d1 = k(t, 6.3, 0.3, SOFT), d2 = k(t, 11.9, 0.3, SOFT); // the app's own state changes (dissolves)
  const showHome = t < 6.62, show02 = t >= 6.3 && t < 12.22, show06 = t >= 11.9;

  // ---------------- home (screen 01)
  const g = [k(t, 0.05, 0.9, OUT), k(t, 0.3, 0.9, OUT), k(t, 0.58, 0.9, OUT)];
  const card = [2.7, 3.4, 4.1].map((a) => ({ q: sp(t, a, 1.5, 0.72), o: k(t, a, 0.28, OUT) }));
  const press1 = c01((t - 6.2) / 0.28), press2 = c01((t - 11.8) / 0.28);
  const home = showHome && (
    <div style={{ position: "absolute", inset: 0 }}>
      <Cam cam={cam}>
        <Page01Layer />
        {/* header chrome fades in, greeting rises, sub rises */}
        <div style={{ position: "absolute", left: 690, top: 8, width: 1180, height: 54, background: PAGE, opacity: 1 - k(t, 0.1, 0.6, OUT) }} />
        {HOME_GREET.map((r, i) => (
          <Slab key={i} rect={r} style={{ opacity: g[i], transform: `translateY(${46 * (1 - g[i])}px)` }}><Region rect={r}><Page01 /></Region></Slab>
        ))}
        {HOME_CARDS.map((r, i) => {
          const c = card[i], pr = i === 0 ? 1 - 0.018 * Math.sin(Math.PI * press1) : 1;
          if (c.o <= 0) return null;
          return (
            <Slab key={i} rect={r} style={{ opacity: c.o, transform: `translateY(${80 * (1 - c.q)}px) scale(${mix(0.965, 1, c.q) * pr})`, borderRadius: 26, overflow: "hidden", boxShadow: i === 1 ? "0 10px 30px rgba(5,15,25,0.16)" : SOFTSH }}>
              <Region rect={r} r={26}><Page01 /></Region>
            </Slab>
          );
        })}
      </Cam>
    </div>
  );

  // ---------------- knowledge base (screen 02)
  const dp = DEPT_AT.map(([c, r, a]) => ({ c, r, p: lift(t, a, 0.62, 2.0, 0.78) }));
  const page02 = show02 && (
    <div style={{ position: "absolute", inset: 0, opacity: d1 }}>
      <Cam cam={cam}><Page02 /></Cam>
      {dp.map((d, i) => <Bump key={i} cam={cam} rect={DEPT_RECT(d.c, d.r)} p={d.p}><Region rect={DEPT_RECT(d.c, d.r)} r={25}><Page02 /></Region></Bump>)}
      {/* the click on Sales presses the card */}
      {press2 > 0 && <PressDim cam={cam} rect={DEPT_RECT(0, 0)} press={press2} />}
    </div>
  );

  // ---------------- Sales department (screen 06)
  const pS = lift(t, 12.64, 1.62), pH = lift(t, 14.7, 1.3), pP = lift(t, 16.18, 0.5, 1.9, 0.8, 0.32), veil = c01(Math.max(pS, pH, pP));
  const rowP = [0, 1, 2, 3].map((i) => k(t, 16.26 + 0.07 * i, 0.28, OUT));
  const page06 = show06 && (
    <div style={{ position: "absolute", inset: 0, opacity: d2 }}>
      <Cam cam={cam}><Page06 /></Cam>
      <div style={{ position: "absolute", inset: 0, background: PAGE, opacity: 0.74 * veil }} />
      <LiftTo cam={cam} rect={STRAT_RECT} p={pS} to={{ cx: 960, cy: 540, scale: 1.65 }}><Region rect={STRAT_RECT} r={25}><Page06 /></Region></LiftTo>
      <LiftTo cam={cam} rect={HWW_RECT} p={pH} to={{ cx: 960, cy: 540, scale: 1.5 }}><Region rect={HWW_RECT} r={25}><Page06 /></Region></LiftTo>
      <LiftTo cam={cam} rect={PB_RECT} p={pP} to={{ cx: 960, cy: 540, scale: 1.65 }}><PlaybooksCard rowP={rowP} /></LiftTo>
    </div>
  );

  // ---------------- cursor
  const cp = curAt(t), cf = toF(cam, cp.x, cp.y);
  const cop = k(t, 1.2, 0.4, OUT) * (1 - k(t, 12.55, 0.4, INOUT));
  const press = t < 9 ? press1 : press2;

  return (
    <div style={{ position: "absolute", inset: 0, background: PAGE, overflow: "hidden" }}>
      {home}
      {page02}
      {page06}
      {cop > 0 && <div style={{ opacity: cop }}><Cursor x={cf.x} y={cf.y} press={press > 0 && press < 1 ? press : 0} s={1.15} /></div>}
    </div>
  );
};

const Cam: React.FC<{ cam: CamT; children: React.ReactNode }> = ({ cam, children }) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: SW, height: SH, transformOrigin: "0 0", transform: `translate(${960 - cam.x * cam.s}px, ${540 - cam.y * cam.s}px) scale(${cam.s})` }}>{children}</div>
);
/** home page under the animated pieces: photo with the greeting, sub and cards row covered in the page colour */
const Page01Layer: React.FC = () => (
  <Page01Base />
);
const Page01Base: React.FC = () => (
  <div style={{ position: "absolute", left: 0, top: 0, width: SW, height: SH, overflow: "hidden" }}>
    <Img src={staticFile("screens/01.png")} style={{ position: "absolute", left: 0, top: 0, width: SW, height: SH }} />
    <div style={{ position: "absolute", left: 700, top: 148, width: 480, height: 112, background: PAGE }} />
    <div style={{ position: "absolute", left: 640, top: 275, width: 1280, height: 430, background: PAGE }} />
  </div>
);
/** a quick dim on the pressed card */
const PressDim: React.FC<{ cam: CamT; rect: Rect; press: number }> = ({ cam, rect, press }) => {
  const b = toF(cam, rect.x + rect.w / 2, rect.y + rect.h / 2), a = Math.sin(Math.PI * c01(press));
  return <div style={{ position: "absolute", left: b.x - rect.w / 2, top: b.y - rect.h / 2, width: rect.w, height: rect.h, transform: `scale(${cam.s})`, borderRadius: 25, background: `rgba(5,15,25,${0.035 * a})` }} />;
};
void K6;
