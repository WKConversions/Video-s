// B3: the whole 31.9 - 49.8 stretch as one continuous composition (so the hand-offs between S8..S11 are seamless by construction).
// Layers are screens under their own camera; a screen change is a soft dissolve (upper layer fades in over the opaque lower one).
import React from "react";
import { Crop, SHADOW, Shot } from "../kit";
import { CamK, Layer, Lift, Veil, camAt, cursorAt, dis, liftP, Ptr, Spin, Way, k } from "./b3-lib";
import { SOFT } from "../kit";
import { liftRect, Pg03, Pg13, Pg16, Pg17, Pg18, OFFER_TITLE, STRAT_RECT, TABLE_RECT } from "./b3-screens";

// ------------------------------------------------------------------ cameras (screen px at frame centre, scale)
const CAM_A: CamK[] = [[31.9, 1280, 600, 1], [32.2, 1280, 600, 1], [32.64, 1250, 440, 1.03], [33.2, 1262, 540, 1.06], [33.58, 1272, 590, 1.075], [34.5, 1280, 640, 1.09], [35.0, 1284, 650, 1.1],
  [35.45, 1280, 470, 1.22], [36.0, 1280, 520, 1.18], [36.9, 1280, 610, 1.15], [37.8, 1280, 720, 1.12], [38.45, 1280, 830, 1.1], [38.6, 1280, 850, 1.1], [39.15, 1190, 1640, 1.22], [39.7, 1190, 1650, 1.22]];
const CAM_B: CamK[] = [[39.3, 1280, 470, 1.15], [40.1, 1280, 520, 1.1], [41.1, 1280, 835, 1.1], [41.9, 1280, 845, 1.1], [42.4, 1280, 450, 1.1], [43.5, 1280, 430, 1.12], [43.9, 1280, 430, 1.12]];
const CAM_C: CamK[] = [[41.5, 1280, 560, 1.36], [42.7, 1280, 650, 1.4], [43.0, 1280, 650, 1.4]];
const CAM_18: CamK[] = [[43.4, 1280, 430, 1.12], [44.2, 1330, 480, 1.1], [44.95, 1330, 500, 1.12], [45.3, 1330, 500, 1.12]];
const CAM_02: CamK[] = [[44.9, 1280, 450, 1.06], [46.3, 1280, 480, 1.12], [46.6, 1280, 480, 1.12]];
const CAM_16C: CamK[] = [[46.2, 1280, 520, 1.14], [47.5, 1280, 400, 1.14], [47.8, 1280, 400, 1.14]];
const CAM_01: CamK[] = [[47.45, 1280, 400, 1.14], [49.9, 1280, 385, 1.27]];
const cA = (t: number) => camAt(CAM_A, t), cB = (t: number) => camAt(CAM_B, t), cC = (t: number) => camAt(CAM_C, t);
const c18 = (t: number) => camAt(CAM_18, t), c02 = (t: number) => camAt(CAM_02, t), c16c = (t: number) => camAt(CAM_16C, t), c01 = (t: number) => camAt(CAM_01, t);

// ------------------------------------------------------------------ screen points (screen px)
const TAB_OFFER = { x: 988, y: 35 }, TAB_STRAT = { x: 1068, y: 35 }, TAB_BASE = { x: 921, y: 35 }, LOGO = { x: 745, y: 33 };
const READ_BTN = { x: 835, y: 907 }, CHIP_OFFER = { x: 813, y: 1658 }, COPY = { x: 1557, y: 321 };

const tracks = (t: number) => {
  const t1: Way[] = [
    { t: 32.64, ...TAB_OFFER, cam: cA, dur: 0.44, press: 32.64 },
    { t: 33.5, x: 1100, y: 470, cam: cA, dur: 0.6, press: 33.5 },
    { t: 34.72, ...READ_BTN, cam: cA, dur: 0.55, press: 34.72 },
  ];
  const t2: Way[] = [{ t: 39.1, ...CHIP_OFFER, cam: cA, dur: 0.75, press: 39.1 }];
  const t3: Way[] = [
    { t: 42.88, ...COPY, cam: cB, dur: 0.55, press: 42.88 },
    { t: 43.4, ...TAB_STRAT, cam: cB, dur: 0.45, press: 43.4 },
    { t: 44.92, ...TAB_BASE, cam: c18, dur: 0.7, press: 44.92 },
    { t: 47.42, ...LOGO, cam: c16c, dur: 0.8, press: 47.42 },
  ];
  if (t < 35.4) return { ...cursorAt({ t: 32.2, x: 1560, y: 300 }, t1, t), op: k(t, 32.15, 0.15) * (1 - k(t, 35.0, 0.3)) };
  if (t > 38.3 && t < 39.9) return { ...cursorAt({ t: 38.35, x: 1500, y: 520 }, t2, t), op: k(t, 38.3, 0.2) * (1 - k(t, 39.45, 0.3)) };
  if (t > 42.2) return { ...cursorAt({ t: 42.3, x: 1560, y: 760 }, t3, t), op: k(t, 42.25, 0.2) * (1 - k(t, 48.0, 0.5)) };
  return null;
};

// ------------------------------------------------------------------ the 02 ripple
const KB_CARDS = [[714, 331], [1098, 331], [1482, 331], [714, 552], [1098, 552], [1482, 552]];
const LitCard: React.FC<{ i: number; t: number }> = ({ i, t }) => {
  const a = 45.22 + i * 0.085;
  const up = k(t, a, 0.2, SOFT), down = k(t, a + 0.5, 0.3, SOFT), p = up * (1 - down);
  if (p <= 0.001) return null;
  const [x, y] = KB_CARDS[i];
  return (
    <div style={{ position: "absolute", left: x, top: y, width: 364, height: 201 + (i > 2 ? 1 : 0), transform: `scale(${1 + 0.04 * p})`, borderRadius: 24, boxShadow: `0 0 0 ${3.5 * p}px rgba(47,125,225,${0.6 * p}), ${SHADOW}`, zIndex: 3 }}>
      <Crop n="02" x={x} y={y} w={364} h={201 + (i > 2 ? 1 : 0)} r={24} />
    </div>
  );
};

// ------------------------------------------------------------------ the film part
export const Flow: React.FC<{ t: number }> = ({ t }) => {
  const a = cA(t), b = cB(t), cc = cC(t), c8 = c18(t), c2 = c02(t), c6 = c16c(t), c1 = c01(t);
  // lifts (each: progress, its camera)
  const pTx = liftP(t, 33.58, 34.4, 0.34);
  const pNeeds = liftP(t, 37.1, 37.76, 0.16), pBud = liftP(t, 37.84, 38.26, 0.16), pTime = liftP(t, 38.32, 38.8, 0.3);
  const pTitle = liftP(t, 40.1, 40.95, 0.36), pTable = liftP(t, 41.14, 41.5, 0.3), pStrat = liftP(t, 43.92, 44.62, 0.32);
  const veil = Math.max(pTx, pNeeds, pBud, pTime, pTitle, pTable, pStrat);
  const cur = tracks(t);

  return (
    <>
      {t < 32.97 && <Layer cam={a} op={1}><Shot n="34" /></Layer>}
      {t >= 32.6 && t < 35.25 && <Layer cam={a} op={dis(t, 32.64, 0.3)}><Pg03 t={t} /></Layer>}
      {t >= 34.9 && t < 36.35 && (
        <Layer cam={a} op={dis(t, 34.92, 0.3)}>
          <Shot n="12"><Spin x={756} y={350} t={t} /></Shot>
        </Layer>
      )}
      {t >= 35.95 && t < 39.65 && <Layer cam={a} op={dis(t, 36.0, 0.3)}><Pg13 t={t} /></Layer>}
      {t >= 39.25 && t < 40.1 && (
        <Layer cam={b} op={dis(t, 39.3, 0.3)}>
          <Shot n="15"><Spin x={756} y={350} t={t} /></Shot>
        </Layer>
      )}
      {t >= 39.7 && t < 41.9 && <Layer cam={b} op={dis(t, 39.75, 0.3)}><Pg16 /></Layer>}
      {t >= 41.5 && t < 42.95 && <Layer cam={cc} op={dis(t, 41.55, 0.3)}><Pg17 /></Layer>}
      {t >= 42.55 && t < 43.75 && <Layer cam={b} op={dis(t, 42.6, 0.3)}><Pg16 /></Layer>}
      {t >= 43.38 && t < 45.35 && <Layer cam={c8} op={dis(t, 43.42, 0.3)}><Pg18 /></Layer>}
      {t >= 44.95 && t < 46.55 && (
        <Layer cam={c2} op={dis(t, 45.0, 0.3)}>
          <Shot n="02">{KB_CARDS.map((_, i) => <LitCard key={i} i={i} t={t} />)}</Shot>
        </Layer>
      )}
      {t >= 46.15 && t < 47.85 && <Layer cam={c6} op={dis(t, 46.2, 0.3)}><Pg16 /></Layer>}
      {t >= 47.4 && <Layer cam={c1} op={dis(t, 47.45, 0.3)}><Shot n="01" /></Layer>}

      <Veil p={veil} />
      <Lift cam={a} rect={{ x: 735, y: 322, w: 1090, h: 372 }} p={pTx} ts={1.5} ty={520} r={22}><Pg03 t={t} /></Lift>
      <Lift cam={a} rect={liftRect("needs")} p={pNeeds} ts={2} r={17}><Pg13 t={t} /></Lift>
      <Lift cam={a} rect={liftRect("budget")} p={pBud} ts={2} r={17}><Pg13 t={t} /></Lift>
      <Lift cam={a} rect={liftRect("timeline")} p={pTime} ts={2} r={17}><Pg13 t={t} /></Lift>
      <Lift cam={b} rect={OFFER_TITLE} p={pTitle} ts={1.6} ty={500} r={20}><Pg16 /></Lift>
      <Lift cam={b} rect={TABLE_RECT} p={pTable} ts={1.6} r={20}><Pg16 /></Lift>
      <Lift cam={c8} rect={STRAT_RECT} p={pStrat} ts={1.3} r={22}><Pg18 /></Lift>
      {cur && <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, zIndex: 40 }}><Ptr x={cur.x} y={cur.y} press={cur.press} op={cur.op} /></div>}
    </>
  );
};
