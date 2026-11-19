// Package R07 · reference f557–f662 · cuts f606, f610, f618, f622, f639 · shots T U V W
// T  the dark message box: the hand brings four sketches, drops them on it, the box opens, the attachments load in
//    (a spinner ring, then the sketch), in the reference's order and frames
// U  flash cuts: the pencil sketch (f606), more notes drawn on (f610), the clean drawing (f613), the wireframe (f618)
// V  the finished product: the numbers count, the bars rise, the cyan hotspots pulse in one after another
// W  filmed: the founder at work (the picture arrives with a quick settle, then drifts)
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import type { Pkg } from "../types";
import { AppUI, Arrow, Bar, C, Caret, E, F, Footage, Ground, Hand, S, Win, abs, clamp, ease, mix, useFonts } from "../kit";
import type { HandKey } from "../kit";
import { handAt } from "../hand";

const F0 = 557;
/** local seconds of reference frame n */
const at = (n: number) => (n - F0) / 24;
/** true from the hard cut at reference frame n (a hair early, so a rounding error can never delay a cut by a frame) */
const from = (t: number, n: number) => t >= at(n) - 1e-6;

// ------------------------------------------------------------------ T  f557–f605
const PEN = "#5B6470";
// four small pencil sketches (96 × 96): a page, a phone screen, a flow, a chart
const DRAW: React.ReactNode[] = [
  <><rect x="18" y="14" width="60" height="68" rx="6" /><path d="M26 30h44M26 44h30M26 58h38" /></>,
  <><rect x="29" y="10" width="38" height="76" rx="9" /><rect x="35" y="19" width="26" height="20" rx="3" /><path d="M35 47h26M35 55h17" /><rect x="35" y="63" width="11" height="13" rx="2" /><rect x="50" y="63" width="11" height="13" rx="2" /></>,
  <><rect x="12" y="16" width="32" height="24" rx="5" /><rect x="52" y="56" width="32" height="24" rx="5" /><path d="M44 28h14q10 0 10 10v16M61 47l7 8 7-8" /></>,
  <><path d="M14 80h68" /><rect x="20" y="52" width="11" height="28" rx="2" /><rect x="36" y="38" width="11" height="42" rx="2" /><rect x="52" y="46" width="11" height="34" rx="2" /><rect x="68" y="22" width="11" height="58" rx="2" /></>,
];
const Sheet: React.FC<{ k: number; s: number; shadow?: boolean }> = ({ k, s, shadow }) => (
  <div style={{ width: s, height: s, borderRadius: s / 8, background: "#F4F1EA", boxShadow: shadow ? "0 12px 28px rgba(0,0,0,.42)" : "none" }}>
    <svg width={s} height={s} viewBox="0 0 96 96"><g fill="none" stroke={PEN} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">{DRAW[k]}</g></svg>
  </div>
);
// The reference: the cursor carries the files up over the box (still moving at the cut, at rest by f572), lets them
// go at f575–f582 (the four spinner chips appear in the order 1, 3, 2, 4) and the pictures load at f590, f595, f599, f601.
const OPEN = at(575);                                          // the box opens under the finger
const CHIP_IN = [at(577), at(580), at(578), at(582)];          // chip i lands
const CHIP_LOAD = [at(590), at(599), at(595), at(601)];        // its sketch has loaded
const CLICK = 0.72;                                            // the hand lets go: deepest at +0.11 = f577
const HAND_KEYS: HandKey[] = [{ at: 0, x: 1631, y: 758 }, { at: CLICK, x: 1542, y: 552, click: true, early: 0.2 }, { at: 2.6, x: 2100, y: 640 }];
const BUNDLE = [[-282, -26, -7], [-188, -56, 5], [-92, -20, -4], [10, 14, 6]];   // each sheet's centre from the fingertip, and its tilt
const CHIP_X = (i: number) => 442 + 112 * i, CHIP_Y = 411;
const ShotT: React.FC<{ t: number }> = ({ t }) => {
  const top = 502 - 122 * S(t, OPEN, { damping: 24, stiffness: 320 });      // the box's upper edge: it opens for the row
  const h = handAt(t * 30, HAND_KEYS, { size: 210 });
  return (
    <Ground tone="dark">
      <svg width={1920} height={1080} style={abs(0, 0)}>
        <rect x={405} y={top} width={1110} height={702 - top} rx={16} fill={C.dark2} />
        <rect x={405.5} y={top + 0.5} width={1109} height={701 - top} rx={15.5} fill="none" stroke="rgba(255,255,255,.08)" />
      </svg>
      {[0, 1, 2, 3].map((i) => {
        const on = clamp((t - CHIP_IN[i]) / 0.05), lo = clamp((t - CHIP_LOAD[i]) / 0.07);
        if (on <= 0) return null;
        return (
          <div key={i} style={abs(CHIP_X(i), CHIP_Y, 96, 96, { transform: `scale(${mix(0.5, 1, S(t, CHIP_IN[i], { damping: 13, stiffness: 240 }))})`, opacity: on, willChange: "transform" })}>
            {lo < 1 && <div style={abs(0, 0, 96, 96, { borderRadius: 12, border: "2px solid rgba(255,255,255,.25)", opacity: 1 - lo })}>
              <svg width="92" height="92" viewBox="0 0 96 96" style={{ transform: `rotate(${t * 540 + i * 100}deg)` }}><circle cx="48" cy="48" r="13" fill="none" stroke="rgba(255,255,255,.72)" strokeWidth="3.2" strokeLinecap="round" strokeDasharray="54 82" /></svg></div>}
            {lo > 0 && <div style={abs(0, 0, 96, 96, { opacity: lo, transform: `scale(${mix(0.78, 1, S(t, CHIP_LOAD[i], { damping: 13, stiffness: 260 }))})` })}><Sheet k={i} s={96} /></div>}
          </div>);
      })}
      <div style={abs(442, 533, 1036, undefined, { fontSize: 30, fontWeight: 500, lineHeight: 1.36, color: "#E8EDF4", letterSpacing: -0.4 })}>
        Turn these sketches into an app our customers can use.<Caret t={t} h={32} w={2.5} c="#fff" style={{ marginLeft: 3, verticalAlign: "-5px" }} />
      </div>
      <div style={abs(442, 633, 1036, 44, { display: "flex", alignItems: "center", gap: 16, fontSize: 21, fontWeight: 600, color: "#C5CEDB" })}>
        <span style={{ fontSize: 30, fontWeight: 400 }}>+</span><span style={{ width: 1, height: 26, background: "rgba(255,255,255,.15)" }} />
        <Img src={staticFile("logo/kb-logo-tile.svg")} style={{ width: 28, height: 28, borderRadius: 5 }} /><span>K.B team</span>
        <span style={{ marginLeft: "auto", fontWeight: 500 }}>Send</span>
        <div style={{ width: 44, height: 44, borderRadius: 11, background: C.cyan, display: "flex", alignItems: "center", justifyContent: "center" }}><Arrow s={24} c={C.ink} /></div>
      </div>
      {[0, 2, 1, 3].map((i) => {                                // the sheets in the hand; each leaves toward its place as its chip lands
        const L = CHIP_IN[i] - 0.02, p = E(t, L, 0.16, ease.out), o = 1 - clamp((t - L - 0.02) / 0.1);
        if (o <= 0) return null;
        const [dx, dy, rot] = BUNDLE[i], x = mix(h.x + dx, CHIP_X(i) + 48, 0.3 * p), y = mix(h.y + dy, CHIP_Y + 48, 0.3 * p);
        return <div key={i} style={abs(0, 0, 118, 118, { transform: `translate3d(${(x - 59).toFixed(3)}px, ${(y - 59).toFixed(3)}px, 0) rotate(${(rot * (1 - p)).toFixed(3)}deg) scale(${mix(1, 0.7, p).toFixed(4)})`, opacity: o, willChange: "transform" })}><Sheet k={i} s={118} shadow /></div>;
      })}
      <Hand {...h} />
    </Ground>
  );
};

// ------------------------------------------------------------------ U  f606–f621
// the pencil sketch (the storyboard's drawing); `more` = the notes and arrows drawn on at f610
const Sketch: React.FC<{ seed: number; more?: boolean }> = ({ seed, more }) => (
  <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{ position: "absolute", left: 0, top: 0, filter: `url(#r07rough${seed})` }}>
    <defs><filter id={`r07rough${seed}`}><feTurbulence baseFrequency="0.02" numOctaves="2" seed={seed} /><feDisplacementMap in="SourceGraphic" scale="7" /></filter></defs>
    <g fill="none" stroke="#4C5360" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="660" y="120" width="420" height="820" rx="50" /><rect x="700" y="200" width="340" height="230" rx="16" /><path d="M700 480h340M700 540h250M700 600h300" />
      <rect x="700" y="680" width="100" height="120" rx="12" /><rect x="820" y="680" width="100" height="120" rx="12" /><rect x="940" y="680" width="100" height="120" rx="12" /><rect x="720" y="840" width="300" height="60" rx="30" />
      <path d="M1130 300 C1250 260 1300 300 1420 280M1130 330h260M1130 520 C1200 500 1330 540 1460 510M1130 550h200" /><path d="M560 640 C470 600 420 700 330 660M300 690l30-30 12 40" /><circle cx="1300" cy="760" r="90" /><path d="M1240 760l40 40 80-90" />
      {more && <>
        <ellipse cx="870" cy="742" rx="206" ry="96" transform="rotate(-3 870 742)" />
        <path d="M1120 262C1095 268 1078 284 1058 306M1058 306l6-27M1058 306l27-8" /><path d="M1028 872C1100 884 1160 862 1206 824M1206 824l-29 2M1206 824l-8 28" />
        <path d="M206 642h178M216 658h120" />
        <path d="M1130 600q22-16 44 0t44 0 44 0 44 0 44 0M1130 640q22-16 44 0t44 0 44 0" />
        <path d="M230 300q22-16 44 0t44 0 44 0 44 0M230 340q22-16 44 0t44 0M230 380q22-16 44 0t44 0 44 0" />
        <path d="M452 418l13 28 31 4-23 21 7 31-28-16-28 16 7-31-23-21 31-4z" />
        <rect x="250" y="738" width="150" height="224" rx="22" /><path d="M276 790h98M276 826h70M276 896h98" /><path d="M640 890C570 912 500 900 418 884M418 884l25-13M418 884l19 21" />
        <path d="M1436 690l22 22M1458 690l-22 22M1150 930h250M1150 964h170" />
      </>}
    </g>
    <g fill="#4C5360" fontFamily="'Comic Sans MS', cursive" fontSize="44"><text x="1130" y="240">book in 2 taps</text><text x="1130" y="470">show what's free</text><text x="210" y="620">our app</text></g>
  </svg>
);
// the same screen as a clean drawing: ruled lines, measures, numbered parts (the reference's technical drawing, f613–f617)
const Drawing: React.FC = () => (
  <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{ position: "absolute", left: 0, top: 0, fontFamily: F }}>
    <g fill="none" stroke={C.ink} strokeWidth="2.6" strokeLinejoin="round">
      <rect x="660" y="120" width="420" height="820" rx="50" /><rect x="700" y="200" width="340" height="230" rx="16" /><path d="M700 200l340 230M1040 200L700 430" strokeWidth="1.2" opacity=".55" />
      <rect x="700" y="680" width="100" height="120" rx="12" /><rect x="820" y="680" width="100" height="120" rx="12" /><rect x="940" y="680" width="100" height="120" rx="12" /><rect x="720" y="840" width="300" height="60" rx="30" />
      <rect x="250" y="650" width="150" height="290" rx="22" strokeWidth="2" /><rect x="446" y="650" width="26" height="290" rx="11" strokeWidth="2" />
    </g>
    <g fill="rgba(41,58,81,.24)"><rect x="700" y="472" width="340" height="16" rx="8" /><rect x="700" y="532" width="250" height="16" rx="8" /><rect x="700" y="592" width="300" height="16" rx="8" /><rect x="274" y="700" width="102" height="64" rx="8" /><rect x="274" y="786" width="102" height="12" rx="6" /><rect x="274" y="812" width="70" height="12" rx="6" /></g>
    <g fill="none" stroke={C.ink} strokeWidth="1.6" opacity=".72">
      <path d="M596 120v820M582 120h28M582 940h28M660 62h420M660 48v28M1080 48v28M250 986h150M250 974v24M400 974v24" />
      <path d="M1048 315h112M958 540h202M1048 740h112M1028 870h132" strokeDasharray="6 7" />
    </g>
    {[315, 540, 740, 870].map((y, i) => <g key={i}><circle cx="1184" cy={y} r="24" fill="#FAFAF7" stroke={C.ink} strokeWidth="2.2" /><text x="1184" y={y + 8} textAnchor="middle" fontSize="23" fontWeight="600" fill={C.ink}>{i + 1}</text></g>)}
    <g fill={C.ink} fontSize="36" fontWeight="500" letterSpacing="-0.8"><text x="1234" y="327">show what's free</text><text x="1234" y="882">book in 2 taps</text></g>
    <g fill="rgba(41,58,81,.24)"><rect x="1234" y="532" width="230" height="16" rx="8" /><rect x="1234" y="732" width="160" height="16" rx="8" /></g>
    <text x="210" y="236" fontSize="56" fontWeight="700" fill={C.ink} letterSpacing="-1.7">our app</text><path d="M210 264h330" stroke={C.ink} strokeWidth="2.6" />
    {[0, 1, 2, 3].map((i) => <g key={i}><circle cx="226" cy={326 + i * 60} r="15" fill="none" stroke={C.ink} strokeWidth="1.8" /><text x="226" y={332 + i * 60} textAnchor="middle" fontSize="17" fontWeight="600" fill={C.ink}>{i + 1}</text><rect x="260" y={319 + i * 60} width={[230, 160, 200, 130][i]} height="14" rx="7" fill="rgba(41,58,81,.2)" /></g>)}
  </svg>
);
const GRID = "linear-gradient(rgba(41,58,81,.055) 1px, transparent 1px), linear-gradient(90deg, rgba(41,58,81,.055) 1px, transparent 1px)";
const push = (s: number): React.CSSProperties => ({ transform: `scale(${s.toFixed(5)})`, willChange: "transform" });
const ShotU: React.FC<{ t: number }> = ({ t }) => {
  const p = 1 + 0.03 * (t - at(606));                           // one slow push through the drawings
  if (from(t, 618)) return <AbsoluteFill style={{ background: "#F7F8FA" }}><AbsoluteFill style={push(1 + 0.028 * (t - at(622)))}><div style={abs(210, 140)}><AppUI wire /></div></AbsoluteFill></AbsoluteFill>;
  if (from(t, 613)) return <AbsoluteFill style={{ background: "#FAFAF7" }}><AbsoluteFill style={{ backgroundImage: GRID, backgroundSize: "60px 60px", ...push(p) }}><Drawing /></AbsoluteFill></AbsoluteFill>;
  if (from(t, 610)) return <AbsoluteFill style={{ background: "#ECE8DE" }}><AbsoluteFill style={{ transformOrigin: "50% 48%", ...push(1.13 * p) }}><Sketch seed={7} more /></AbsoluteFill></AbsoluteFill>;
  // f606–f609: the drawing "boils" at the two frames where the reference's sketch jumps (f607, f609)
  return <AbsoluteFill style={{ background: "#F3F0E9" }}><AbsoluteFill style={push(p)}><Sketch seed={from(t, 609) ? 23 : from(t, 607) ? 11 : 3} /></AbsoluteFill></AbsoluteFill>;
};

// ------------------------------------------------------------------ V  f622–f638
const BAR_H = (i: number, n: number) => 30 + 62 * Math.abs(Math.sin(i * 1.3 + 0.6)) * (0.55 + (i / n) * 0.45);     // the kit's Bars
// the kit's AppUI, alive: the three numbers count up to the storyboard's and the bars rise
const LiveApp: React.FC<{ tl: number }> = ({ tl }) => {
  const nums = [String(Math.round(mix(229, 248, E(tl, 0, 0.6, ease.out)))), `${Math.round(mix(85, 92, E(tl, 0.04, 0.58, ease.out)))}%`, mix(4.2, 4.8, E(tl, 0.08, 0.54, ease.out)).toFixed(1)];
  return (
    <div style={{ position: "relative", width: 1500, height: 800 }}>
      <div style={abs(0, 0, 320, 800, { background: "#F4F6F9", borderRight: `1px solid ${C.line}` })}>
        <div style={abs(30, 30, 56, 56, { borderRadius: 14, background: C.ink })} />{[0, 1, 2, 3, 4].map((i) => <Bar key={i} x={30} y={130 + i * 64} w={210 - (i % 2) * 50} h={18} c={i === 0 ? C.cyan : "#D5D9DF"} />)}
      </div>
      <div style={abs(360, 34, 620, 44, { fontSize: 38, fontWeight: 700 })}>Bookings</div>
      {[0, 1, 2].map((i) => <div key={i} style={abs(360 + i * 280, 110, 256, 150, { borderRadius: 20, background: [C.ink, C.cyan, "#EEF3FF"][i] })}><Bar x={24} y={26} w={120} h={12} c={i === 0 ? "rgba(255,255,255,.4)" : "rgba(41,58,81,.3)"} /><div style={abs(24, 62, 200, 60, { fontSize: 50, fontWeight: 700, color: i === 0 ? "#fff" : C.ink })}>{nums[i]}</div></div>)}
      <div style={abs(360, 290, 816, 470, { borderRadius: 22, background: "#FFFFFF", border: `1px solid ${C.line}` })}>
        <div style={abs(40, 70, 736, 360, { display: "flex", alignItems: "flex-end", gap: (736 / 14) * 0.28 })}>{Array.from({ length: 14 }, (_, i) => <div key={i} style={{ flex: 1, height: `${BAR_H(i, 14)}%`, background: i === 11 ? C.cyan : C.indigo, borderRadius: "5px 5px 0 0", transformOrigin: "50% 100%", transform: `scaleY(${mix(0.3, 1, S(tl, 0.02 + i * 0.02, { damping: 15, stiffness: 200 })).toFixed(4)})` }} />)}</div>
      </div>
      <div style={abs(1210, 110, 260, 650, { borderRadius: 22, background: "#F4F6F9" })}>{[0, 1, 2, 3, 4].map((i) => <div key={i} style={abs(20, 24 + i * 122, 220, 104, { borderRadius: 16, background: "#fff" })}><div style={abs(16, 20, 64, 64, { borderRadius: 14, background: [C.cyan, C.mint, C.amber, C.violet, C.coral][i] })} /><Bar x={96} y={30} w={100} h={12} c="#C9CED6" /><Bar x={96} y={58} w={70} h={10} /></div>)}</div>
    </div>
  );
};
const HOT = [[520, 130], [1010, 240], [800, 560], [1420, 420]];
const HOT_T = (i: number) => 0.06 + i * 0.125;                  // the hotspots arrive one after another
const ShotV: React.FC<{ t: number }> = ({ t }) => {
  const tl = t - at(622);
  return (
    <Ground tone="ui"><AbsoluteFill style={push(1 + 0.028 * tl)}>
      <Win x={170} y={110} w={1580} h={860} bar={false}><div style={abs(40, 30)}><LiveApp tl={tl} /></div>
        {HOT.map(([x, y], i) => {
          const t0 = HOT_T(i), r = E(tl, t0, 0.6, ease.out), live = clamp((tl - t0 - 0.2) / 0.2);
          if (tl < t0) return null;
          return (
            <div key={i} style={abs(x, y, 44, 44)}>
              <div style={abs(0, 0, 44, 44, { borderRadius: 22, border: `3px solid ${C.cyan}`, transform: `scale(${mix(1, 2.7, r).toFixed(4)})`, opacity: 0.7 * (1 - r) })} />
              <div style={abs(0, 0, 44, 44, { borderRadius: 22, background: C.cyan, border: "5px solid #fff", boxShadow: "0 6px 16px rgba(41,58,81,.25)", transform: `scale(${(S(tl, t0, { damping: 11, stiffness: 260 }) * (1 + 0.07 * live * Math.sin((tl - t0) * 9))).toFixed(4)})` })} />
            </div>);
        })}
      </Win></AbsoluteFill></Ground>
  );
};

// ------------------------------------------------------------------ W  f639–f662
const ShotW: React.FC<{ t: number }> = ({ t }) => {
  const tl = t - at(639), k = 1 - E(tl, 0, 0.5, ease.out);     // the reference's picture arrives moving and settles in about ten frames
  return <Footage name="W" at={0.1 + tl} scale={1.02 + 0.07 * k + 0.015 * (1 - tl)} x={44 * k} />;
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
    { t: CLICK + 0.11, kind: "click", note: "the hand drops the four sketches on the message box", ref: 577 },
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
