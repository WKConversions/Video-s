// Package R07 · reference f557–f662 · cuts f606, f610, f618, f622, f639 · shots T U V W
// T  the dark message box: the hand brings four sketches, drops them on it, the box opens, the attachments load in
//    (a spinner ring, then the sketch), in the reference's order and frames
// U  flash cuts: the pencil sketch (f606), more notes drawn on (f610), the clean drawing (f613), the wireframe (f618)
// V  the finished product: the numbers count, the bars rise, the cyan hotspots pulse in one after another
// W  filmed: the founder at work (the picture arrives with a quick settle, then drifts)
import React from "react";
import { AbsoluteFill } from "remotion";
import type { Pkg } from "../types";
import { PencilSketch, Product, TechSheet, WireFrame } from "./R07_art";
import type { VState } from "./R07_art";
import { C, F, Footage, Ground, Hand, Msg, Tile, abs, kf, onTwos, refN, useFonts } from "../kit";

const F0 = 557;
/** local seconds of reference frame n */
const at = (n: number) => (n - F0) / 24;
/** true from the hard cut at reference frame n (a hair early, so a rounding error can never delay a cut by a frame) */
const from = (t: number, n: number) => t >= at(n) - 1e-6;

// ------------------------------------------------------------------ T  f557–f605
// The reference: a dark prompt box (462,417 990x243, never moves) and a stack of four files that rises over it with a
// small arrow (rigid: offsets measured on the reference), rests f572–f577, then at f578 the files become four chips in a
// row above the box (spinner rings that load, in the order 1,3,2,4 at f590, f595, f599, f601).
const RIG: [number, number][] = [[557, 250], [558, 216], [559, 184], [560, 158], [561, 130], [562, 106], [563, 86], [564, 66], [565, 50], [566, 36], [567, 24], [568, 15], [569, 9], [570, 3], [571, 2], [572, 0]];
const RIGX: [number, number][] = [[557, 56], [558, 51], [559, 46], [560, 40], [561, 36], [562, 32], [563, 26], [564, 21], [565, 16], [566, 12], [567, 9], [568, 6], [569, 3], [570, 2], [571, 0], [572, 0]];
const CHIP_X = [459, 576, 692, 807], CHIP_Y = 291, CHIP_S = 93;
const CHIP_IN = [578, 581, 579, 583];       // frame each chip appears
const CHIP_LOAD = [590, 599, 595, 601];     // frame each chip's picture has loaded
const PH = { stroke: "#5B6470", fill: "none", strokeWidth: 3, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
const MiniSketch: React.FC<{ s: number }> = ({ s }) => (
  <svg width={s} height={s} viewBox="0 0 96 96"><rect width="96" height="96" fill="#F4F2EC" /><g {...PH}><rect x="30" y="10" width="36" height="72" rx="9" /><rect x="36" y="20" width="24" height="16" rx="3" /><path d="M36 44h24M36 52h16" /><rect x="36" y="60" width="10" height="12" rx="2" /><rect x="50" y="60" width="10" height="12" rx="2" /><path d="M10 76q10-10 20 0M72 24l14-6M72 34l12 2" /></g></svg>
);
const MiniPhoto: React.FC<{ s: number }> = ({ s }) => (
  <svg width={s} height={s} viewBox="0 0 96 96"><defs><linearGradient id="r07ph" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#1B5E80" /><stop offset="1" stopColor="#2B3F8F" /></linearGradient></defs><rect width="96" height="96" fill="url(#r07ph)" /><rect x="31" y="12" width="34" height="68" rx="8" fill="#E9EEF3" /><rect x="35" y="19" width="26" height="46" rx="4" fill="#38C8FF" /><rect x="38" y="24" width="20" height="6" rx="3" fill="#fff" opacity=".8" /><rect x="38" y="34" width="20" height="14" rx="3" fill="#fff" opacity=".55" /><rect x="40" y="55" width="16" height="6" rx="3" fill="#293A51" /><ellipse cx="48" cy="84" rx="26" ry="5" fill="#0D2540" opacity=".5" /></svg>
);
const MiniFile: React.FC<{ s: number; label?: boolean }> = ({ s }) => (
  <svg width={s} height={s} viewBox="0 0 96 96"><rect width="96" height="96" fill="#F4F4F4" /><path d="M24 10h34l16 16v60H24z" fill="#fff" stroke="#DADADA" strokeWidth="1.5" /><path d="M58 10v16h16" fill="#E6E6E6" /><text x="49" y="66" textAnchor="middle" fontFamily={F} fontWeight="700" fontSize="18" fill="#B4B4B4">PDF</text></svg>
);
const MiniSheet: React.FC<{ w: number; h: number }> = ({ w, h }) => (
  <svg width={w} height={h} viewBox="0 0 121 76" preserveAspectRatio="none"><rect width="121" height="76" fill="#EDEDED" />
    {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => <g key={i}><rect x="8" y={6 + i * 7.2} width="14" height="3.2" fill="#BDBDBD" /><rect x="34" y={6 + i * 7.2} width="46" height="3.2" fill="#9A9A9A" /><rect x="84" y={6 + i * 7.2} width="8" height="3.2" fill="#BDBDBD" /><rect x="100" y={6 + i * 7.2} width="14" height="3.2" fill="#BDBDBD" /></g>)}
    <rect x="0" y="62" width="121" height="14" fill="#F7F7F7" /><rect x="6" y="65" width="8" height="8" rx="1.5" fill="#38C8FF" /><rect x="20" y="67" width="52" height="4" rx="2" fill="#6E7580" /></svg>
);
const Spin: React.FC<{ n: number; i: number }> = ({ n, i }) => {
  const a = ((n * 47 + i * 83) % 360);                               // turns on every film frame (it stepped 24 times a second)
  return <svg width={CHIP_S} height={CHIP_S} viewBox="0 0 93 93" style={abs(0, 0)}><circle cx="46.5" cy="46.5" r="9" fill="none" stroke="rgba(255,255,255,.78)" strokeWidth="2.2" strokeLinecap="round" strokeDasharray="30 27" transform={`rotate(${a} 46.5 46.5)`} /></svg>;
};
const Chip: React.FC<{ i: number; n: number }> = ({ i, n }) => {
  if (n < CHIP_IN[i]) return null;
  const done = n >= CHIP_LOAD[i];
  return (
    <div style={abs(CHIP_X[i], CHIP_Y, CHIP_S, CHIP_S, { borderRadius: 11, overflow: "hidden", background: done ? "#E9E9E9" : "#222B38", border: done ? "none" : "1px solid rgba(255,255,255,.10)", boxSizing: "border-box" })}>
      {!done && <Spin n={n} i={i} />}
      {done && i === 0 && <MiniSketch s={CHIP_S} />}
      {done && i === 1 && <MiniPhoto s={CHIP_S} />}
      {done && i === 2 && <MiniFile s={CHIP_S} />}
      {done && i === 3 && <div style={{ background: "#D7D7D7", width: CHIP_S, height: CHIP_S }}><MiniSheet w={CHIP_S} h={CHIP_S} /></div>}
    </div>
  );
};
const Cap: React.FC<{ x: number; y: number; children: string }> = ({ x, y, children }) => <div style={abs(x, y - 7, 130, 14, { transform: "translateX(-50%)", textAlign: "center", fontSize: 8.5, fontWeight: 600, color: "#E8EDF4", letterSpacing: -0.1 })}>{children}</div>;
const ShotT: React.FC<{ t: number }> = ({ t }) => {
  const nc = refN(t, F0), tx = kf(nc, RIGX), ty = kf(nc, RIG);
  const n = nc;
  const stack = n < 578;
  return (
    <Ground tone="dark">
      <div style={abs(27, 26, 144, 30, { display: "flex", alignItems: "center", gap: 8, opacity: 0.5, fontSize: 25, fontWeight: 700, color: "#9aa5b4" })}><Tile x={14} y={15} s={26} /><span style={{ marginLeft: 22 }}>K.B</span></div>
      <Msg x={462} y={417} k={0.9} text="Turn these sketches into an app our customers can use." dark caret={false} />
      {[0, 1, 2, 3].map((i) => <Chip key={i} i={i} n={n} />)}
      {n < 580 && (
        <div style={{ position: "absolute", left: 0, top: 0, transform: `translate3d(${n < 579 ? tx : tx - 90}px, ${ty}px, 0)`, willChange: "transform" }}>
          {stack && <div style={abs(1085, 288, 81, 84, { borderRadius: 6, overflow: "hidden", boxShadow: "0 6px 16px rgba(0,0,0,.4)" })}><MiniSketch s={84} /></div>}
          {stack && <Cap x={1126} y={387}>Sketches.png</Cap>}
          {stack && (
            <div style={abs(1185, 230, 117, 163, { borderRadius: 4, overflow: "hidden", background: "#F2F2F2", boxShadow: "0 6px 16px rgba(0,0,0,.4)" })}>
              <div style={{ width: 117, height: 117 }}><MiniPhoto s={117} /></div>
              <div style={abs(8, 126, 16, 16, { borderRadius: 3, background: C.cyan })} /><div style={abs(30, 124, 80, 12, { fontSize: 9, fontWeight: 700, color: "#2a2f36" })}>Bookings</div><div style={abs(10, 146, 100, 10, { fontSize: 7.5, fontWeight: 500, color: "#8a8f98" })}>Product manual</div>
            </div>)}
          <div style={abs(1314, 318, 87, 108, { filter: "drop-shadow(0 6px 10px rgba(0,0,0,.4))" })}>
            <svg width="87" height="108" viewBox="0 0 87 108"><path d="M6 2h50l24 24v78a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V6a4 4 0 0 1 4-4z" fill="#F0F0F0" /><path d="M56 2v20a4 4 0 0 0 4 4h20z" fill="#DADADA" /><text x="43" y="80" textAnchor="middle" fontFamily={F} fontWeight="700" fontSize="26" fill="#A9A9A9">PDF</text></svg>
          </div>
          {n < 579 && <Cap x={1357} y={436}>Screens.pdf</Cap>}
          <div style={abs(1415, 288, 181, 117, { overflow: "hidden", boxShadow: "0 6px 16px rgba(0,0,0,.4)" })}>
            <MiniSheet w={181} h={117} />
            <div style={abs(13, 100, 120, 12, { fontSize: 8.5, fontWeight: 600, color: "#4a505a" })}>Bookings - this week</div>
          </div>
          {stack && <div style={{ position: "absolute", left: 0, top: 0, transform: "translate3d(1494px, 387px, 0)" }}><Hand x={0} y={0} size={115} /></div>}
        </div>)}
    </Ground>
  );
};

// ------------------------------------------------------------------ U  f606–f621
// The reference: four full-frame pictures, each held still. f606–f609 the pale pencil sketch, jumping in scale at f607 (x1.076)
// and f609 (x1.092); f610–f612 the same sketch darker with more notes; f613–f617 the technical sheet; f618–f621 the wireframe.
const U_ZOOM: [number, number][] = [[606, 1], [607, 1.0758], [608, 1.0758], [609, 1.0921], [610, 1.0921]];
const ShotU: React.FC<{ t: number }> = ({ t }) => {
  const nc = refN(t, F0), n = nc;
  if (n >= 618) return <AbsoluteFill><WireFrame /></AbsoluteFill>;
  if (n >= 613) return <AbsoluteFill><TechSheet /></AbsoluteFill>;
  if (n >= 610) return <AbsoluteFill><PencilSketch dense /></AbsoluteFill>;
  return <AbsoluteFill style={{ overflow: "hidden" }}><AbsoluteFill style={{ transform: `scale(${kf(nc, U_ZOOM).toFixed(5)})`, willChange: "transform" }}><PencilSketch /></AbsoluteFill></AbsoluteFill>;
};

// ------------------------------------------------------------------ V  f622–f638
// The reference: the finished product, full frame; the central picture swings slowly, the numbers tick, sliders and the
// live pictures drift, the hotspots are on from the first frame.
const V_ROT: [number, number][] = [[622, -30], [623, -23], [625, -13], [628, -5], [632, 0], [635, 2], [638, 3]];
const HOT_T = (i: number) => 0.0 + i * 0.05;
const ShotV: React.FC<{ t: number }> = ({ t }) => {
  const nc = refN(t, F0), tl = t - at(622);
  const st: VState = {
    n: nc, rot: kf(nc, V_ROT), lift: kf(nc, [[622, 4], [626, 0], [638, -2]]), tick: Math.floor(Math.max(0, nc - 622) * 0.8),
    pulse: (i) => 0.5 + 0.5 * Math.sin((tl - i * 0.12) * 2 * Math.PI * 0.8), sl: kf(nc, [[622, 0], [638, 16]]),
  };
  return <AbsoluteFill><Product s={st} /></AbsoluteFill>;
};

// ------------------------------------------------------------------ W  f639–f662
const W_DX: [number, number][] = [[639, 0], [640, -1.8], [641, -4.4], [642, -6.7], [643, -8.8], [644, -10.8], [645, -12.7], [646, -14.3], [648, -16.7], [650, -18.3], [653, -19.3], [657, -20.5], [660, -21.8], [662, -21.7]];
const W_DY: [number, number][] = [[639, 0], [644, -0.2], [648, -1.4], [652, -2.8], [656, -3.9], [662, -4.6]];
const W_SC: [number, number][] = [[639, 1], [648, 0.9962], [656, 0.9936], [662, 0.9921]];
const ShotW: React.FC<{ t: number }> = ({ t }) => {
  // the reference's camera: a quick drift left of about 22 px that settles by f653 (track.py cam 639 662); the clip runs on twos and the camera steps with it
  const tw = onTwos("W", t - at(639), 0.1), n = 639 + tw.sj * 24;
  return <Footage name="W" at={tw.at} scale={1.03 * kf(n, W_SC)} x={kf(n, W_DX)} y={kf(n, W_DY)} />;
};

const Comp: React.FC<{ t: number }> = ({ t }) => {
  useFonts();
  if (from(t, 639)) return <ShotW t={t} />;
  if (from(t, 622)) return <ShotV t={t} />;
  if (from(t, 606)) return <ShotU t={t} />;
  return <ShotT t={t} />;
};

export const PKG: Pkg = {
  id: "R07", Comp,
  sfx: [
    { t: at(578), kind: "click", note: "the files drop on the box: four chips appear", ref: 578 },
    { t: at(590), kind: "pop", note: "attachment 1 has loaded", ref: 590 },
    { t: at(595), kind: "pop", note: "attachment 3 has loaded", ref: 595 },
    { t: at(599), kind: "pop", note: "attachment 2 has loaded", ref: 599 },
    { t: at(601), kind: "pop", note: "attachment 4 has loaded", ref: 601 },
    { t: at(606), kind: "tick", note: "flash cut: the pencil sketch", ref: 606 },
    { t: at(610), kind: "tick", note: "flash cut: more notes drawn on", ref: 610 },
    { t: at(613), kind: "tick", note: "flash: the clean drawing", ref: 613 },
    { t: at(618), kind: "tick", note: "flash cut: the wireframe", ref: 618 },
    { t: at(622) + HOT_T(0), kind: "sparkle", note: "the finished product: the hotspots pulse in", ref: 622 },
    { t: at(639), kind: "swish", note: "cut to the filmed founder: the picture settles", ref: 639 },
  ],
};
