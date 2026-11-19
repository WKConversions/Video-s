// Package R06 · reference f475–f556 · shots P Q R S.
//   P  f475–f483  dark ground, the big circles: the violet one alone, then "?" (f478) and "AI" (f481) appear, all sliding left
//   Q  f484–f512  the browser: the checklist arrives line by line, the circles leave the search field and travel down
//                 to the "Your business" card, which lights up
//   R  f513–f527  filmed: the customer
//   S  f528–f556  filmed hands on the left; on the right "Your business" climbs the ranking, the rows it passes move down
// Every change of shot is a hard cut on its reference frame. t = seconds since f475.
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { C, Check, E, F, Footage, Ground, S, Win, abs, ease, mix, onTwos, settle, useFonts } from "../kit";
import type { Pkg, Sfx } from "../types";

const F0 = 475;
/** local seconds of reference frame n */
const at = (n: number) => (n - F0) / 24;
/** the reference frame (fractional) on screen at local time t; the small bias keeps every cut on its exact film frame */
const refAt = (t: number) => F0 + t * 24 + 1e-4;

// ---------------------------------------------------------------- P: circles on dark (the storyboard's FR 17)
// The reference's picture slides left and gathers speed until f481, then runs evenly: here 216 -> 480 px/s over
// those six frames, then 8 px a film frame. FR 17 is the picture at f481, when the third circle is there.
const RAMP = at(481), V0 = 216, V1 = 480;
const slid = (s: number) => (s <= RAMP ? V0 * s + ((V1 - V0) * s * s) / (2 * RAMP) : V0 * RAMP + ((V1 - V0) * RAMP) / 2 + V1 * (s - RAMP));
const ShotP: React.FC<{ t: number; n: number }> = ({ t, n }) => {
  const dx = slid(RAMP) - slid(t);
  const label: React.CSSProperties = { display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600, color: C.ink };
  return (
    <Ground tone="dark">
      <div style={abs(0, 300, 1920, 6, { background: "#1E2A3C" })} /><div style={abs(0, 800, 1920, 6, { background: "#1E2A3C" })} />
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `translate3d(${dx.toFixed(2)}px, 0, 0)`, willChange: "transform" }}>
        <div style={abs(-140, 620, 420, 420, { borderRadius: 210, background: C.violet })} />
        {n >= 478 && <div style={abs(560, 210, 620, 620, { ...label, borderRadius: 310, background: C.cyan, fontSize: 200 })}>?</div>}
        {n >= 481 && <div style={abs(1330, -160, 600, 600, { ...label, borderRadius: 300, background: C.mint, fontSize: 150, paddingTop: 120 })}>AI</div>}
      </div>
    </Ground>
  );
};

// ---------------------------------------------------------------- Q: the browser (the storyboard's FR 18)
const LINES = ["Technical SEO", "Page structure", "Metadata", "Internal links", "Structured information"];
const DOTS: [number, number, number, string][] = [[150, 300, 150, C.cyan], [420, 240, 110, C.mint], [640, 360, 130, C.violet], [880, 260, 100, C.amber], [1040, 380, 120, C.coral]];
/** one line and one circle on every beat of 2.5 reference frames (the reference adds a note at that pace); the first is under way at the cut */
const beat = (i: number) => at(483.5 + 2.5 * i);
const LIT = beat(5);                     // f496: the card lights up, the note arrives
const Q_END = at(513), DRIFT = 60;       // the circles keep travelling down at 1 px a frame and are on FR 18's places at the cut
const Face: React.FC<{ bg: string; icon: string; title: string; sub: string; o?: number }> = ({ bg, icon, title, sub, o = 1 }) => (
  <div style={{ position: "absolute", left: 0, top: 0, right: 0, bottom: 0, borderRadius: 24, background: bg, display: "flex", alignItems: "center", gap: 30, paddingLeft: 40, opacity: o }}>
    <div style={{ width: 110, height: 110, borderRadius: 26, background: icon }} />
    <div><div style={{ fontSize: 46, fontWeight: 700, color: title }}>Your business</div><div style={{ fontSize: 26, color: sub, fontWeight: 500, marginTop: 6 }}>the first result</div></div>
  </div>
);
const ShotQ: React.FC<{ t: number }> = ({ t }) => {
  const lit = E(t, LIT, 0.14, ease.out), since = Math.max(0, t - LIT);
  const glow = lit * (0.12 + 0.5 * Math.exp(-since / 0.28) + 0.05 * Math.sin(since * 9));
  const cardS = 0.985 + 0.015 * S(t, LIT, { stiffness: 320, damping: 15 });
  const note = E(t, LIT, 0.2, ease.out);
  return (
    <Ground>
      <Win x={110} y={90} w={1700} h={900}>
        <div style={abs(0, 0, 470, 860, { background: "#FAFBFC", borderRight: `1px solid ${C.line}`, padding: 30 })}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 22, fontWeight: 700 }}><Img src={staticFile("logo/kb-logo-tile.svg")} style={{ width: 34, height: 34, borderRadius: 6 }} />K.B team</div>
          {LINES.map((txt, i) => {
            const p = E(t, beat(i), 0.16, ease.out), tick = S(t, beat(i) + 0.04, { stiffness: 420, damping: 17 });
            return (
              <div key={txt} style={{ marginTop: 22, display: "flex", alignItems: "center", gap: 14, fontSize: 23, fontWeight: 500, opacity: p, transform: `translate3d(0, ${((1 - p) * 14).toFixed(2)}px, 0)` }}>
                <span style={{ display: "inline-flex", transform: `scale(${tick.toFixed(4)})` }}><Check s={28} /></span>{txt}
              </div>
            );
          })}
          <div style={{ marginTop: 34, padding: 22, borderRadius: 16, background: "#EEF3FF", fontSize: 21, lineHeight: 1.4, fontWeight: 500, opacity: note, transform: `translate3d(0, ${((1 - note) * 16).toFixed(2)}px, 0)` }}>Your pages now read clearly to search engines, AI tools and people.</div>
        </div>
        <div style={abs(470, 0, 1230, 860, { background: C.dark, overflow: "hidden" })}>
          {DOTS.map(([x, y, s, c], i) => {
            const a = beat(i);
            if (t < a) return null;
            const lane = y + s / 2 - DRIFT * (Q_END - t);                       // its slow way down to the card
            const cy = mix(105, lane, E(t, a, 0.5, ease.out));                  // out of the search field, onto that way
            const pop = S(t, a, { stiffness: 260, damping: 15 });
            return <div key={i} style={abs(x, -s / 2, s, s, { borderRadius: 999, background: c, transform: `translate3d(0, ${cy.toFixed(2)}px, 0) scale(${pop.toFixed(4)})`, willChange: "transform" })} />;
          })}
          <div style={abs(60, 60, 1110, 90, { borderRadius: 45, background: "#1B2636", display: "flex", alignItems: "center", paddingLeft: 40, fontSize: 30, color: "#C5CEDB", fontWeight: 500 })}>best near me</div>
          <div style={abs(60, 560, 1110, 240, { borderRadius: 24, transform: `scale(${cardS.toFixed(4)})`, boxShadow: `0 0 90px rgba(56,200,255,${glow.toFixed(3)})` })}>
            <Face bg="#1B2636" icon="#2C3B52" title="#8494AB" sub="#5B6A82" />
            <Face bg="#F4F7FA" icon={C.cyan} title={C.ink} sub={C.sub} o={lit} />
          </div>
        </div>
      </Win>
    </Ground>
  );
};

// ---------------------------------------------------------------- R: the filmed customer (the storyboard's FR 19)
// The clip's last 19 drawings, on twos (kit: onTwos): she breaks into the smile of the storyboard frame as the shot ends.
const ShotR: React.FC<{ t: number }> = ({ t }) => { const tw = onTwos("R", t - at(513), 0.625); return <Footage name="R" at={tw.at} scale={settle(tw.sj, 0.03)} />; };

// ---------------------------------------------------------------- S: the hands and the climbing row (the storyboard's FR 20)
// "Your business" starts under the list, in eighth place, and takes five places in five hops (f534–f552), as the
// reference's row hops up from the bottom: it lands third with "▲ 5", which is FR 20. Each row it passes moves down one
// place; the one pushed out of the seven fades away.
const MONO = "ui-monospace, Menlo, monospace", PITCH = 98;
const HOPS = [534.5, 538.25, 542, 545.25, 548.5].map(at);
const hop = (t: number, k: number) => S(t, HOPS[k], { stiffness: 900, damping: 36 });
const RIVALS: [string, number][] = [["#4F7BFF", 260], ["#22C7A0", 210], ["#7C6CFF", 260], ["#FF7A66", 210], ["#8FA0B6", 160], ["#4F7BFF", 260], ["#FFB547", 160]];
const rowBox = (y: number, more: React.CSSProperties): React.CSSProperties => ({ position: "absolute", left: 0, right: 0, top: 14, height: 84, borderRadius: 12, display: "flex", alignItems: "center", gap: 26, padding: "0 28px", willChange: "transform", transform: `translate3d(0, ${y.toFixed(2)}px, 0)`, ...more });
const ShotS: React.FC<{ t: number }> = ({ t }) => {
  const tw = onTwos("S", t - at(528), 0.45), zoom = settle(tw.sj, 0.03);       // the footage on twos, the camera stepping with it
  const hops = HOPS.map((_, k) => hop(t, k)), done = hops.filter((h) => h > 0.5).length;
  const lift = E(t, at(532), 0.14, ease.out) * (1 - E(t, at(552.5), 0.22, ease.inOut));      // it rises off the list while it climbs
  const landed = Math.max(0, t - at(552));
  const glow = 0.35 + 0.22 * lift + (t >= at(552) ? 0.3 * Math.exp(-landed / 0.25) : 0);
  const tickAt = done > 0 ? HOPS[done - 1] + 0.045 : -9, tick = t >= tickAt ? Math.exp(-(t - tickAt) / 0.09) : 0;   // the count ticks as a place is taken
  return (
    <AbsoluteFill style={{ background: C.dark, fontFamily: F }}>
      <div style={abs(0, 0, 760, 1080, { overflow: "hidden" })}>
        <Footage name="S" at={tw.at} scale={zoom} x={-420 - 560 * (zoom - 1)} />
      </div>
      <div style={abs(860, 90, 960)}>
        <div style={{ fontSize: 46, fontWeight: 600, letterSpacing: 6, color: "#E8EDF4", fontFamily: MONO }}>RANKING</div>
        <div style={{ position: "relative", height: 7 * PITCH }}>
          {RIVALS.map(([c, w], j) => {
            const passed = j >= 2 ? hops[6 - j] : 0;                                           // the hop that takes this row's place
            return (
              <div key={j} style={rowBox((j + passed) * PITCH, { background: "#1B2636", opacity: j === 6 ? 1 - E(t, HOPS[0], 0.24, ease.out) : 1 })}>
                <div style={{ fontSize: 34, fontWeight: 500, color: "#C5CEDB", width: 34, fontFamily: MONO }}>{j + 1 + (passed > 0.5 ? 1 : 0)}</div>
                <div style={{ width: 34, height: 34, borderRadius: 8, background: c }} />
                <div style={{ width: w, height: 14, borderRadius: 7, background: "#33425A" }} />
                <div style={{ marginLeft: "auto", fontSize: 24, fontWeight: 600, color: "#5E6E86", fontFamily: MONO }}>—</div>
              </div>
            );
          })}
          <div style={rowBox((7 - hops.reduce((a, b) => a + b, 0)) * PITCH, { background: "#F4F7FA", boxShadow: `0 14px 40px rgba(56,200,255,${glow.toFixed(3)})`, transform: `translate3d(0, ${((7 - hops.reduce((a, b) => a + b, 0)) * PITCH).toFixed(2)}px, 0) scale(${(1 + 0.03 * lift).toFixed(4)})` })}>
            <div style={{ fontSize: 34, fontWeight: 500, color: C.ink, width: 34, fontFamily: MONO }}>{8 - done}</div>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: C.cyan }} />
            <div style={{ fontSize: 30, fontWeight: 700, color: C.ink }}>Your business</div>
            <div style={{ marginLeft: "auto", fontSize: 24, fontWeight: 600, color: done > 0 ? C.green : "#8FA0B6", fontFamily: MONO, transform: `scale(${(1 + 0.2 * tick).toFixed(4)})`, transformOrigin: "100% 50%" }}>{done > 0 ? `▲ ${done}` : "—"}</div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Comp: React.FC<{ t: number }> = ({ t }) => {
  const ok = useFonts();
  const n = refAt(t);
  if (!ok) return <Ground tone={n >= 484 && n < 513 ? "paper" : "dark"} />;
  if (n >= 528) return <ShotS t={t} />;
  if (n >= 513) return <ShotR t={t} />;
  if (n >= 484) return <ShotQ t={t} />;
  return <ShotP t={t} n={n} />;
};

const sfx: Sfx[] = [
  // P: the two circles that appear
  { t: at(478), kind: "pop", note: "the ? circle appears", ref: 478 },
  { t: at(481), kind: "pop", note: "the AI circle appears", ref: 481 },
  // Q: a line and a circle on each beat, then the card lights up
  ...[484, 486, 488.5, 491, 493.5].map((f, i) => ({ t: at(f), kind: "pop", note: `checklist line ${i + 1} and a circle`, ref: Math.round(f), db: -6 })),
  { t: LIT, kind: "sparkle", note: "the Your business card lights up", ref: 496 },
  // S: the row hops up five places and lands
  // (the reference rattles here: one short tick per hop, each a step higher)
  ...HOPS.map((h, i) => ({ t: h, kind: "tick", note: `the row takes place ${7 - i}`, ref: Math.round(F0 + h * 24), db: 2, keep: true })),
  { t: at(552), kind: "pop", note: "it lands third, ▲ 5", ref: 552 },
];

export const PKG: Pkg = { id: "R06", Comp, sfx };
