// B1 flow (revision 1): one continuous timeline for 0 - 20.2 s (home -> knowledge base -> Sales department), sentence by sentence.
// S1, S2 and S3 each draw this same function inside their own windows, so the overlaps are pixel-identical and the hand-off H1
// (screen 06, nothing lifted, no cursor, Cam {1280, 600, 1.0}) is exact. Every time is derived from w()/we() of the paced VO.
import React from "react";
import { Img, staticFile } from "remotion";
import { Cursor, INOUT, OUT, SW, SH, SOFT, k, mix, sp, c01, w, we } from "../kit";
import {
  Bump, CamT, DEPT_RECT, GRID_RECT, HOME_CARDS, HOME_GREET, HWW_BLOCK, LiftTo, PAGE, PB_BLOCK, PB_LABEL, Page01, Page02, Page06, PlaybooksCard,
  Region, STRAT_BLOCK, SOFTSH, toF, Rect, shadowA,
} from "./b1-parts";

// ------------------------------------------------------------------ anchors (all from the VO)
const tPlatformEnd = we("platform"), tPlaceEnd = we("place"), tS2 = w("the"), tFinanceEnd = we("finance");
// camera: A0 greeting close-up (sentence 1) -> A1 the three cards (reframe in pause 1) -> A2 = hand-off framing (reframe in pause 2), then STILL
const A0: CamT = { x: 960, y: 204, s: 1.7 }, A1: CamT = { x: 1280, y: 450, s: 1.3 }, A2: CamT = { x: 1280, y: 600, s: 1.0 };
const R1 = tPlatformEnd - 0.07, R2 = tPlaceEnd; // reframes, 1.0 s INOUT each, only in the pauses
export const camAt = (t: number): CamT => {
  const u1 = k(t, R1, 1.0, INOUT), u2 = k(t, R2, 1.0, INOUT);
  const f = (key: "x" | "y" | "s") => mix(mix(A0[key], A1[key], u1), A2[key], u2);
  return { x: f("x"), y: f("y"), s: f("s") };
};

// click 1: home -> knowledge base (in the pause after "one place")
const P1 = tS2 - 0.5;                 // press down
const G1: [number, number] = [P1 - 0.95, P1 - 0.15]; // glide (0.8 s INOUT), then rest 0.15 s with the hover state
const D1 = P1 + 0.32 + 0.2;           // the app responds 0.2 s after the release: soft dissolve 0.48 s
// click 2: knowledge base -> Sales (in the pause after "finance")
const P2 = tFinanceEnd + 0.9;
const G2: [number, number] = [P2 - 0.95, P2 - 0.15];
const D2 = P2 + 0.32 + 0.2;
const DD = 0.48;
// knowledge base: one lifted grid (the six departments), a relay of highlights inside it
const GRID_A = w("covers") - 0.12, GRID_SETTLE = tFinanceEnd + 0.3;
const RING_ALL = w("department");
const DEPT_AT: [number, number, number][] = [[0, 0, w("sales")], [1, 0, w("marketing")], [2, 0, w("operations")], [1, 1, w("finance")]];
// Sales: three calm lifts, one after the other (0.55 s rise, hold, 0.4 s settle)
const L1 = D2 + DD + 0.05, L2 = L1 + 1.95, L3 = L2 + 1.95, END = 20.15;
const HOLD1 = 1.0, HOLD2 = 1.0, HOLD3 = END - 0.95 - L3;

// cursor (screen px)
const T_KB = { x: 905, y: 470 }, T_SALES = { x: 895, y: 450 };
const FROM1 = { x: 1640, y: 770 }, FROM2 = { x: 1700, y: 820 };
const ease = (t: number, [a, b]: [number, number]) => INOUT(c01((t - a) / (b - a)));
const pressU = (t: number, t0: number) => { const u = t - t0; if (u <= 0 || u >= 0.32) return 0; return u < 0.12 ? (0.5 * u) / 0.12 : 0.5 + (0.5 * (u - 0.12)) / 0.2; };
const dip = (p: number) => Math.sin(Math.PI * c01(p)); // 0 -> 1 -> 0 over the 0.32 s press (peak at the squeeze end)

const lift = (t: number, a: number, hold: number) => sp(t, a, 1.4, 0.95) * (1 - k(t, a + 0.55 + hold, 0.4, INOUT));
const bumpRise = (t: number, a: number) => sp(t, a, 2.0, 0.95);

export const Flow: React.FC<{ t: number }> = ({ t }) => {
  const cam = camAt(t);
  const d1 = k(t, D1, DD, SOFT), d2 = k(t, D2, DD, SOFT); // the app's own state changes (dissolves, camera still)
  const showHome = t < D1 + DD + 0.03, show02 = t >= D1 && t < D2 + DD + 0.03, show06 = t >= D2;

  // ---------------- home (screen 01): builds on sentence 1, cards on sentence 2
  const chrome = k(t, 0.0, 0.7, OUT);
  const g = [k(t, w("meet") - 0.1, 0.9, OUT), k(t, w("intelligence") - 0.1, 0.9, OUT), k(t, w("platform") - 0.16, 0.62, OUT)];
  const cStart = [w("everything") + 0.15, w("how") + 0.06, w("works")];
  const card = cStart.map((a) => ({ q: sp(t, a, 1.5, 0.92), o: k(t, a, 0.3, OUT) }));
  const hover1 = k(t, G1[1], 0.2, OUT), press1 = pressU(t, P1), pd1 = dip(press1 / 1) ;
  const settle = k(t, w("one"), 0.8, SOFT); // "one place": the three settle together
  const home = showHome && (
    <div style={{ position: "absolute", inset: 0 }}>
      <Cam cam={cam}>
        <Page01Base />
        <div style={{ position: "absolute", left: 690, top: 8, width: 1180, height: 54, background: PAGE, opacity: 1 - chrome }} />
        {HOME_GREET.map((r, i) => (
          <Slab key={i} rect={r} style={{ opacity: g[i], transform: `translateY(${46 * (1 - g[i])}px)` }}><Region rect={r}><Page01 /></Region></Slab>
        ))}
        <div style={{ position: "absolute", left: 0, top: 0, width: SW, height: SH, transformOrigin: "1280px 452px", transform: `scale(${1 + 0.012 * settle})` }}>
          {HOME_CARDS.map((r, i) => {
            const c = card[i];
            if (c.o <= 0) return null;
            const hov = i === 0 ? hover1 * (1 - c01(t > D1 ? 1 : 0)) : 0, pr = i === 0 ? 1 - 0.02 * pd1 : 1;
            return (
              <Slab key={i} rect={r} style={{ opacity: c.o, transform: `translateY(${80 * (1 - c.q) - 7 * hov}px) scale(${mix(0.965, 1, c.q) * pr * (1 + 0.008 * hov)})`, borderRadius: 26, overflow: "hidden",
                boxShadow: i === 1 ? "0 10px 30px rgba(5,15,25,0.16)" : hov > 0 ? `0 0 0 ${2 * hov}px rgba(18,102,201,${0.3 * hov}), ${shadowA(0.7 * hov)}` : SOFTSH }}>
                <Region rect={r} r={26}><Page01 /></Region>
              </Slab>
            );
          })}
        </div>
      </Cam>
    </div>
  );

  // ---------------- knowledge base (screen 02)
  const gp = lift(t, GRID_A, GRID_SETTLE - GRID_A - 0.55);
  const ringAll = k(t, RING_ALL, 0.45, OUT) * (1 - k(t, DEPT_AT[0][2] - 0.2, 0.3, INOUT));
  const dp = DEPT_AT.map(([c, r, a], i) => {
    const nxt = i < 3 ? DEPT_AT[i + 1][2] - 0.05 : GRID_SETTLE - 0.1;
    return { c, r, p: bumpRise(t, a - 0.05) * (1 - k(t, nxt, 0.4, INOUT)) };
  });
  const hoverS = k(t, G2[1], 0.2, OUT) * (1 - k(t, D2 + 0.1, 0.3, OUT)), press2 = pressU(t, P2);
  const page02 = show02 && (
    <div style={{ position: "absolute", inset: 0, opacity: d1 }}>
      <Cam cam={cam}><Page02 /></Cam>
      {gp > 0.0005 && <div style={{ position: "absolute", inset: 0, background: PAGE, opacity: 0.8 * c01(gp) }} />}
      <LiftTo cam={cam} rect={GRID_RECT} p={gp} to={{ cx: 960, cy: 540, scale: 1.55 * (1 + 0.012 * c01((t - GRID_A) / (GRID_SETTLE - GRID_A))) }} r={28}>
        <Region rect={GRID_RECT} r={28}>
          <Page02 />
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const c = i % 3, r = Math.floor(i / 3), R = DEPT_RECT(c, r);
            return <div key={i} style={{ position: "absolute", left: R.x, top: R.y, width: R.w, height: R.h, borderRadius: 25, boxShadow: `0 0 0 ${2.5 * ringAll}px rgba(18,102,201,${0.4 * ringAll})`, pointerEvents: "none" }} />;
          })}
          {dp.map((d, i) => {
            const R = DEPT_RECT(d.c, d.r); if (d.p <= 0.0005) return null;
            const a = c01(d.p);
            return (
              <div key={i} style={{ position: "absolute", left: R.x, top: R.y - 6 * d.p, width: R.w, height: R.h, transform: `scale(${1 + 0.045 * d.p})`, borderRadius: 25,
                boxShadow: `0 0 0 ${2.5 * a}px rgba(18,102,201,${0.45 * a}), 0 0 0 ${7 * a}px rgba(18,102,201,${0.12 * a}), ${shadowA(a)}` }}>
                <Region rect={R} r={25}><Page02 /></Region>
              </div>
            );
          })}
        </Region>
      </LiftTo>
      {/* hover and press on the Sales card (click 2) */}
      {hoverS > 0.001 && <Bump cam={cam} rect={DEPT_RECT(0, 0)} p={0.6 * hoverS * (1 - 0.35 * dip(press2))}><Region rect={DEPT_RECT(0, 0)} r={25}><Page02 /></Region></Bump>}
    </div>
  );

  // ---------------- Sales department (screen 06): three lifts, one at a time
  const pS = lift(t, L1, HOLD1), pH = lift(t, L2, HOLD2), pP = lift(t, L3, HOLD3);
  const veil = c01(Math.max(pS, pH, pP));
  const rowP = [0, 1, 2, 3].map((i) => k(t, L3 + 0.15 + 0.1 * i, 0.3, OUT));
  const br = (a: number, hold: number) => 1 + 0.015 * c01((t - a) / (0.55 + hold));
  const fadeIn = (p: number) => ({ opacity: Math.min(1, p * 3) });
  const page06 = show06 && (
    <div style={{ position: "absolute", inset: 0, opacity: d2 }}>
      <Cam cam={cam}><Page06 /></Cam>
      {veil > 0.0005 && <div style={{ position: "absolute", inset: 0, background: PAGE, opacity: 0.8 * veil }} />}
      <div style={fadeIn(pS)}><LiftTo cam={cam} rect={STRAT_BLOCK} p={pS} to={{ cx: 960, cy: 540, scale: 1.6 * br(L1, HOLD1) }} r={28}><Region rect={STRAT_BLOCK} r={28}><Page06 /></Region></LiftTo></div>
      <div style={fadeIn(pH)}><LiftTo cam={cam} rect={HWW_BLOCK} p={pH} to={{ cx: 960, cy: 540, scale: 1.55 * br(L2, HOLD2) }} r={28}><Region rect={HWW_BLOCK} r={28}><Page06 /></Region></LiftTo></div>
      <div style={fadeIn(pP)}>
        <LiftTo cam={cam} rect={PB_BLOCK} p={pP} to={{ cx: 960, cy: 540, scale: 1.55 * br(L3, HOLD3) }} r={28}>
          <div style={{ position: "relative", width: PB_BLOCK.w, height: PB_BLOCK.h, overflow: "hidden", borderRadius: 28, background: PAGE }}>
            <Region rect={PB_LABEL}><Page06 /></Region>
            <div style={{ position: "absolute", left: 0, top: PB_LABEL.h }}><PlaybooksCard rowP={rowP} /></div>
          </div>
        </LiftTo>
      </div>
    </div>
  );

  // ---------------- cursor: one glide per click, rest, hover, press, release, then the app responds
  const s2 = cam, ph1 = t < 10;
  const pos1 = { x: mix(FROM1.x, T_KB.x, ease(t, G1)), y: mix(FROM1.y, T_KB.y, ease(t, G1)) };
  const pos2 = { x: mix(FROM2.x, T_SALES.x, ease(t, G2)), y: mix(FROM2.y, T_SALES.y, ease(t, G2)) };
  const cp = ph1 ? pos1 : pos2, cf = toF(s2, cp.x, cp.y);
  const cop = ph1 ? k(t, G1[0] - 0.12, 0.3, OUT) * (1 - k(t, D1 + 0.12, 0.3, INOUT)) : k(t, G2[0] - 0.12, 0.3, OUT) * (1 - k(t, D2 + 0.12, 0.3, INOUT));
  const pr = ph1 ? press1 : press2;

  return (
    <div style={{ position: "absolute", inset: 0, background: PAGE, overflow: "hidden" }}>
      {home}
      {page02}
      {page06}
      {cop > 0.001 && <div style={{ opacity: cop }}><Cursor x={cf.x} y={cf.y} press={pr > 0 && pr < 1 ? pr : 0} s={1.15} /></div>}
    </div>
  );
};

const Slab: React.FC<{ rect: Rect; children: React.ReactNode; style?: React.CSSProperties }> = ({ rect, children, style }) => (
  <div style={{ position: "absolute", left: rect.x, top: rect.y, width: rect.w, height: rect.h, ...style }}>{children}</div>
);
const Cam: React.FC<{ cam: CamT; children: React.ReactNode }> = ({ cam, children }) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: SW, height: SH, transformOrigin: "0 0", transform: `translate(${960 - cam.x * cam.s}px, ${540 - cam.y * cam.s}px) scale(${cam.s})` }}>{children}</div>
);
/** home page under the animated pieces: photo with the greeting, sub and cards row covered in the page colour */
const Page01Base: React.FC = () => (
  <div style={{ position: "absolute", left: 0, top: 0, width: SW, height: SH, overflow: "hidden" }}>
    <Img src={staticFile("screens/01.png")} style={{ position: "absolute", left: 0, top: 0, width: SW, height: SH }} />
    <div style={{ position: "absolute", left: 700, top: 148, width: 480, height: 112, background: PAGE }} />
    <div style={{ position: "absolute", left: 640, top: 275, width: 1280, height: 430, background: PAGE }} />
  </div>
);
void OUT;
