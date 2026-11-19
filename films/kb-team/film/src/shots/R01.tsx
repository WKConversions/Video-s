// K.B team film, package R01 (reference f0-f92).
//   A  f0-f41   the three small words; the portrait card opens between them and is dealt over three times
//   B1 f42-f63  the flow window that grows out of the card (one continuous shot with A)
//   B2 f64-f74  the ranking window (hard cut)
//   B3 f75-f92  the product card (hard cut); it shrinks into a portrait and the first word of the next line arrives
// Every frame number below is a reference frame measured in the reference film.
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import type { Pkg } from "../types";
import { C, E, Ground, Port, ROLE, S, SH, Tool, Tx, Win, abs, clamp, ease, mix, useFonts } from "../kit";

const T = (n: number) => n / 24;                                    // local seconds of reference frame n (this package starts at f0)
const EPS = 1e-6;
const fast = { damping: 20, stiffness: 400, mass: 0.5 };            // a quick arrival with about 4% overshoot
const snap = { damping: 20, stiffness: 800, mass: 0.3 };            // 80% after one reference frame, then a small overshoot
const pop = (t: number, n: number) => S(t, T(n), fast);
const bump = (x: number) => (x <= 0 || x >= 1 ? 0 : Math.sin(Math.PI * x));
const Pin: React.FC<{ x: number; y: number; k?: number; rot?: number; o?: number; children: React.ReactNode }> = ({ x, y, k = 1, rot = 0, o = 1, children }) => (
  <div style={{ position: "absolute", left: x, top: y, width: 0, height: 0, opacity: o, transform: `rotate(${rot}deg) scale(${k})`, willChange: "transform" }}>{children}</div>
);

// ---------------------------------------------------------------- A + B1: the words, the portrait card, the flow window
const CX = 1020, CY = 540;                                          // the gap between "right" and "team": where the card opens
// the card is dealt over at the reference's picture changes (f15, f21, f26, f30); at f26 it is the storyboard's frame
const SHEETS = [
  { who: "cedric", n: 15, w: 344, h: 320, rot: -3.5, dx: -5, dy: 4 },
  { who: "karl", n: 21, w: 366, h: 342, rot: 3, dx: 5, dy: -4 },
  { who: "tom", n: 26, w: 384, h: 358, rot: -0.6, dx: 0, dy: 0 },
  { who: "robin", n: 30, w: 400, h: 372, rot: 2.2, dx: 3, dy: -2 },
];
const WIN = { cx: 1120, cy: 530, s0: 0.39 };                        // the window's centre (storyboard) and its size as a card
/** the window's growth out of the card, 0..1, fitted to the reference (f36.3 on: a burst, then a long settle to f49) */
const grow = (n: number) => { const x = Math.max(0, n - 36.3); return 1 - 0.4 * (1 + 0.966 * x) * Math.exp(-0.966 * x) - 0.6 * Math.exp(-0.409 * x); };
const bez = (u: number, p: number[][]) => { const v = 1 - u; return [0, 1].map((i) => v * v * v * p[0][i] + 3 * v * v * u * p[1][i] + 3 * v * u * u * p[2][i] + u * u * u * p[3][i]); };
const UP = [[690, 360], [790, 360], [790, 200], [900, 200]], DOWN = [[690, 360], [790, 360], [790, 520], [900, 520]];
const PULSES = [44, 50, 56, 62];                                    // data leaves the first tool at these frames

const Flow: React.FC<{ t: number }> = ({ t }) => {
  const n = t * 24;
  const d1 = E(t, T(35.5), T(2.5)), d2 = E(t, T(38), T(3.5));       // the lines draw
  const kIn = pop(t, 35), kUp = pop(t, 41), kDown = pop(t, 43);
  const hit = (at: number) => PULSES.reduce((a, s) => a + bump((n - s - at) / 2.6), 0);
  const line = (d: string, p: number) => <path d={d} fill="none" stroke={C.cyan} strokeWidth="6" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p} />;
  return (
    <>
      <div style={abs(0, 0, 1300, 720, { background: "#F7F9FB", backgroundImage: `radial-gradient(${C.line} 1.5px, transparent 1.5px)`, backgroundSize: "40px 40px" })} />
      <svg style={abs(0, 0)} width="1300" height="720">
        {d1 > 0 && line("M270 360 H520", d1)}
        {d2 > 0 && line("M690 360 C790 360 790 200 900 200", d2)}
        {d2 > 0 && line("M690 360 C790 360 790 520 900 520", d2)}
        {PULSES.map((s) => {
          const a = (n - s) / 5, b = (n - s - 5.5) / 5;
          return (
            <g key={s} fill={C.ink}>
              {a > 0 && a < 1 && <circle cx={mix(270, 520, a)} cy={360} r={8} />}
              {b > 0 && b < 1 && [UP, DOWN].map((p, i) => { const [x, y] = bez(ease.inOut(b), p); return <circle key={i} cx={x} cy={y} r={8} />; })}
            </g>
          );
        })}
      </svg>
      <Pin x={190} y={360} k={kIn * (1 + 0.05 * hit(0))}><Tool n="pipedrive" x={-80} y={-80} s={160} navy /></Pin>
      {PULSES.map((s) => { const r = (n - s - 5) / 4; return r > 0 && r < 1 ? <div key={s} style={abs(520, 275, 170, 170, { borderRadius: 38, border: `5px solid ${C.cyan}`, opacity: 0.7 * (1 - r), transform: `scale(${1 + 0.4 * ease.out(r)})` })} /> : null; })}
      <Pin x={605} y={360} k={1 + 0.05 * hit(5)}>
        <div style={abs(-85, -85, 170, 170, { borderRadius: 38, background: C.white, border: `5px solid ${C.cyan}`, boxShadow: SH, display: "flex", alignItems: "center", justifyContent: "center" })}><Img src={staticFile("logo/kb-logo-tile.svg")} style={{ width: 96, height: 96, borderRadius: 14 }} /></div>
      </Pin>
      <Pin x={980} y={200} k={kUp * (1 + 0.06 * hit(10.5))}><Tool n="n8n-logo2" x={-80} y={-80} s={160} /></Pin>
      <Pin x={980} y={520} k={kDown * (1 + 0.06 * hit(10.5))}><Tool n="odoo-1" x={-80} y={-80} s={160} navy /></Pin>
    </>
  );
};

const A: React.FC<{ t: number }> = ({ t }) => {
  const n = t * 24;
  // the words: "The" is there, "right" at f5, "team" at f8; the card pushes them apart from f15; from f36 they leave
  const open = S(t, T(15), snap);                                   // the reference opens it in one frame
  const half = 172 + 11 * S(t, T(21), snap) + 9 * S(t, T(26), snap) + 8 * S(t, T(30), snap) + 54 * S(t, T(34), snap) + 6 * clamp((n - 15) / 19);   // half the card's width
  const push = open * (half + 30);
  const go1 = E(t, T(35.6), 0.12, ease.out), go2 = E(t, T(37.6), 0.12, ease.out);   // the words leave in two steps, as in the reference
  const in1 = E(t, 0, 0.22, ease.out), in2 = E(t, T(5), 0.11, ease.out), in3 = E(t, T(8), 0.16, ease.out);
  const oL = 1 - 0.55 * clamp((t - T(35.5)) / 0.05) - 0.45 * clamp((t - T(37.5)) / 0.085), oR = 1 - clamp((t - T(37.8)) / 0.1);
  const word = (x: number, y: number, o: number): React.CSSProperties => ({ display: "inline-block", transform: `translate3d(${x}px, ${y}px, 0)`, opacity: o, willChange: "transform" });
  // the window: lands on the stack as a small card at f34, grows into the first screen from f36.3
  const g = grow(n), land = S(t, T(34), snap);
  const sw = mix(WIN.s0 * mix(0.6, 1, land), 1, g);
  return (
    <Ground>
      <Tx x={720} y={506} s={66} w={600}>
        <span style={word(100 * (1 - in2) - push - 60 * go1 - 40 * go2, 10 * (1 - in1), oL)}>The</span>{" "}
        <span style={word(40 * (1 - in2) - push - 60 * go1 - 40 * go2, 0, clamp((t - T(5) - 0.012) / 0.04) * oL)}>right</span>{" "}
        <span style={word(-8 * (1 - in3) + push + 110 * go1 + 70 * go2, 10 * (1 - in3) + 24 * go2, clamp((t - T(8)) / 0.04) * oR)}>team</span>
      </Tx>
      {n < 41 && SHEETS.map((s, i) => {
        const t0 = T(s.n), dt = t - t0;
        if (dt < 0) return null;
        const k = i === 0 ? mix(0.25, 1, open) : mix(1.08, 1, S(t, t0, snap));
        return (
          <Pin key={s.who} x={CX + s.dx} y={CY + s.dy} k={k * (1 + 0.03 * dt)} rot={s.rot + (i % 2 ? 0.7 : -0.7) * dt} o={clamp(dt / 0.05)}>
            <Port who={s.who} x={-s.w / 2} y={-s.h / 2} w={s.w} h={s.h} />
          </Pin>
        );
      })}
      {t + EPS >= T(34) && (
        <div style={{ position: "absolute", left: 0, top: 0, width: 0, height: 0, opacity: clamp((t - T(34)) / 0.04), transform: `translate3d(${mix(CX, WIN.cx, g)}px, ${mix(CY, WIN.cy, g)}px, 0) rotate(${-2 * (1 - g)}deg) scale(${sw})`, willChange: "transform" }}>
          <Win x={-650} y={-380} w={1300} h={760}><Flow t={t} /></Win>
        </div>
      )}
    </Ground>
  );
};

// ---------------------------------------------------------------- B2: the ranking window
const MONO = "ui-monospace, Menlo, monospace";
const B2: React.FC<{ t: number }> = ({ t }) => {
  const n = t * 24;
  const k = 1 + 0.024 * Math.exp(-(n - 64) / 2.1);                  // the window settles, as in the reference
  const p = S(t, T(65.4), { damping: 18, stiffness: 300, mass: 0.6 });   // "Your business" climbs from third to second
  const glow = 0.35 + 0.3 * bump((n - 68) / 5);
  const visitors = Math.round(mix(27, 38, E(t, T(64), 0.36, ease.out)));
  return (
    <Ground>
      <Pin x={800} y={530} k={k}>
        <Win x={-650} y={-380} w={1300} h={760} dark>
          <div style={abs(60, 40, 620)}>
            <div style={{ fontSize: 46, fontWeight: 600, letterSpacing: 6, color: "#E8EDF4", fontFamily: MONO }}>RANKING</div>
            {Array.from({ length: 7 }, (_, i) => {
              const me = i === 1, dy = i === 1 ? 98 * (1 - p) : i === 2 ? -98 * (1 - p) : 0;
              const place = i === 1 ? (p < 0.5 ? 3 : 2) : i === 2 ? (p < 0.5 ? 2 : 3) : i + 1;
              return (
                <div key={i} style={{ position: "relative", zIndex: me ? 2 : 1, marginTop: 14, height: 84, borderRadius: 12, background: me ? "#F4F7FA" : "#1B2636", display: "flex", alignItems: "center", gap: 26, padding: "0 28px", boxShadow: me ? `0 14px 40px rgba(56,200,255,${glow})` : "none", transform: `translate3d(0, ${dy}px, 0)`, willChange: "transform" }}>
                  <div style={{ fontSize: 34, fontWeight: 500, color: me ? C.ink : "#C5CEDB", width: 34, fontFamily: MONO }}>{place}</div>
                  <div style={{ width: 34, height: 34, borderRadius: 8, background: me ? C.cyan : ["#4F7BFF", "#22C7A0", "#FFB547", "#7C6CFF", "#FF7A66", "#8FA0B6", "#4F7BFF"][i] }} />
                  {me ? <div style={{ fontSize: 30, fontWeight: 700, color: C.ink }}>Your business</div> : <div style={{ width: 260 - (i % 3) * 50, height: 14, borderRadius: 7, background: "#33425A" }} />}
                  <div style={{ marginLeft: "auto", fontSize: 24, fontWeight: 600, color: me ? C.green : "#5E6E86", fontFamily: MONO }}>{me ? (p < 0.5 ? "▲ 4" : "▲ 5") : "—"}</div>
                </div>
              );
            })}
          </div>
          <div style={abs(740, 60, 500, 600, { borderRadius: 20, background: "#1B2636" })}>
            <Tx x={36} y={32} s={22} w={600} c="#9FB0C6">Visitors</Tx>
            <Tx x={36} y={66} s={76} w={700} c="#fff">+{visitors}%</Tx>
            <div style={abs(36, 220, 428, 340, { display: "flex", alignItems: "flex-end", gap: (428 / 12) * 0.28 })}>
              {Array.from({ length: 12 }, (_, i) => (
                <div key={i} style={{ flex: 1, height: `${30 + 62 * Math.abs(Math.sin(i * 1.3 + 0.6)) * (0.55 + (i / 12) * 0.45)}%`, background: i === 9 ? C.cyan : C.indigo, borderRadius: "5px 5px 0 0", transformOrigin: "50% 100%", transform: `scaleY(${mix(0.4, 1, S(t, T(64) + i * 0.024, fast))})` }} />
              ))}
            </div>
          </div>
        </Win>
      </Pin>
    </Ground>
  );
};

// ---------------------------------------------------------------- B3: the product card; it shrinks into the portrait of who builds it
const B3: React.FC<{ t: number }> = ({ t }) => {
  const n = t * 24;
  const s85 = E(t, T(85) - 0.02, 0.13, ease.out), s87 = E(t, T(87) - 0.02, 0.12, ease.out), s90 = E(t, T(90) - 0.02, 0.12, ease.out);
  // settles from the cut, shrinks slowly, then in the reference's three steps: 0.82 (f85), 0.74 (f87), 0.647 (f90)
  const s = (1 + 0.03 * Math.exp(-(n - 75) / 1.44) - 0.012 * clamp((n - 79) / 6)) * mix(1, 0.83, s85) * mix(1, 0.902, s87) * mix(1, 0.874, s90);
  const top = mix(mix(540 - 430 * s, 261, s87), 286, s90);
  const fold = E(t, T(86.7), 0.09);                                 // the lower part closes and the picture becomes the portrait
  const tap = bump((n - 80.5) / 3);
  const say = S(t, T(90.6), fast);
  return (
    <Ground>
      <div style={{ position: "absolute", left: 960, top: 0, width: 0, height: 0, transformOrigin: "0 0", transform: `translate3d(0, ${top}px, 0) scale(${s})`, willChange: "transform" }}>
        <div style={abs(-225, 0, 450, 860, { filter: "drop-shadow(0 30px 70px rgba(41,58,81,.16)) drop-shadow(0 4px 14px rgba(41,58,81,.08))" })}>
          <div style={abs(0, 0, 450, 860, { background: C.white, clipPath: `inset(0px 0px ${350 * fold}px 0px round ${mix(44, 9.3, fold)}px)` })}>
            <div style={abs(0, 0, 450, 470, { background: `linear-gradient(150deg, ${C.cyan}, ${C.indigo})` })}><Tx x={36} y={40} s={24} w={600} c="#fff">Good morning</Tx><Tx x={36} y={330} s={60} w={700} c="#fff">Book a table</Tx></div>
            {[0, 1, 2].map((i) => <div key={i} style={abs(30 + i * 134, 500, 122, 150, { borderRadius: 20, background: ["#EEF3FF", "#E6F7FF", "#E9F8F1"][i], transform: `scale(${pop(t, 75.4 + i * 1.1)})` })} />)}
            <div style={abs(30, 690, 390, 110, { borderRadius: 28, background: C.ink, color: "#fff", fontSize: 32, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${1 - 0.045 * tap})`, boxShadow: `0 0 0 ${10 * tap}px rgba(56,200,255,${0.35 * tap})` })}>Confirm booking</div>
            {fold > 0 && <Img src={staticFile("team/youri.jpg")} style={abs(0, 0, 450, 510, { objectFit: "cover", objectPosition: "50% 22%", opacity: fold })} />}
          </div>
        </div>
        <div style={abs(-225, 526, 450, undefined, { fontSize: 23.2, fontWeight: 500, color: C.sub, display: "flex", alignItems: "center", gap: 10.8, whiteSpace: "nowrap", opacity: E(t, T(90), 0.07) })}><span style={{ width: 10.8, height: 10.8, borderRadius: 6, background: C.cyan }} />{ROLE.youri}</div>
      </div>
      <Tx x={636} y={380} s={132} w={600} style={{ lineHeight: 1.02, opacity: clamp((t - T(90.6)) / 0.05), transform: `translate3d(0, ${16 * (1 - say)}px, 0)`, willChange: "transform" }}>For</Tx>
    </Ground>
  );
};

const Comp: React.FC<{ t: number }> = ({ t }) => {
  const ok = useFonts();
  if (!ok) return <AbsoluteFill style={{ background: C.paper }} />;
  if (t + EPS >= T(75)) return <B3 t={t} />;
  if (t + EPS >= T(64)) return <B2 t={t} />;
  return <A t={t} />;
};

export const PKG: Pkg = {
  id: "R01",
  Comp,
  sfx: [
    { t: T(15), kind: "pop", note: "the portrait card opens between the words" },
    { t: T(21), kind: "tick", note: "a portrait is dealt onto the card", db: -10 },
    { t: T(26), kind: "tick", note: "a portrait is dealt onto the card", db: -10 },
    { t: T(30), kind: "tick", note: "a portrait is dealt onto the card", db: -10 },
    { t: T(36.3), kind: "rise", note: "the card grows into the first screen", ref: 37 },
    { t: T(64), kind: "tick", note: "cut to the ranking window" },
    { t: T(75), kind: "tick", note: "cut to the product card" },
    { t: T(85), kind: "swish", note: "the product card shrinks into the portrait" },
  ],
};
