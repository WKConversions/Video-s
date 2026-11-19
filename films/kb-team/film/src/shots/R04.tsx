// Package R04 (reference f265-f384; cut f295).
//   I f265-f294  the message to the K.B team: the sentence is finished, the hand glides in and clicks send (f288)
//   J f295-f311  two K.B glyphs flash (6 frames each), then the first tool tile pops in the centre
//   K f312-f335  K.B's tools fly in around the centre, the flow card builds in the middle, cyan dots pop
//   L f336-f384  the flow card alone: its four rows complete one after another; then it thins to an outline and grows
import React from "react";
import { AbsoluteFill } from "remotion";
import type { Pkg, Sfx } from "../types";
import type { HandKey } from "../kit";
import { C, E, FlowCard, Glyph, Ground, HandAt, Msg, S, Tool, abs, clamp, ease, mix, pressAt, rs, typed, useFonts } from "../kit";

const F0 = 265;
const at = (n: number) => rs(n - F0);

// ---------------------------------------------------------------- I: the message and the click
const TEXT = "Can you help us automate our follow-ups and keep the CRM up to date?";
const CPS = 15, T0 = -(TEXT.length - 12) / CPS;                         // the last 12 characters are typed in the shot (done by f284)
const SEND = { x: 1457, y: 552 };                                      // the centre of the send button
const CLICK = at(288) - 0.11;                                          // the fingertip is deepest on f288
const HAND: HandKey[] = [{ at: -1, x: 1760, y: 1240 }, { at: CLICK, x: SEND.x, y: SEND.y, click: true, early: 0.22 }];
const I: React.FC<{ t: number }> = ({ t }) => {
  const press = pressAt(t, CLICK), ring = clamp((t - CLICK - 0.11) / 0.5);
  return (
    <Ground tone="ui">
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "960px 500px", transform: `scale(${(1 + 0.012 * t - 0.006 * press).toFixed(4)})`, willChange: "transform" }}>
        <Msg x={405} y={400} w={1110} text={typed(TEXT, t, T0, CPS)} />
        <div style={abs(SEND.x - 22, SEND.y - 22, 44, 44, { borderRadius: 11, background: "#fff", opacity: 0.55 * press })} />
        <div style={abs(SEND.x - 60, SEND.y - 60, 120, 120, { borderRadius: 60, border: `4px solid ${C.cyan}`, boxSizing: "border-box", opacity: ring > 0 && ring < 1 ? 0.8 * (1 - ring) : 0, transform: `scale(${(0.4 + 0.9 * ease.out(ring)).toFixed(4)})` })} />
      </div>
      <HandAt t={t} keys={HAND} size={210} />
    </Ground>
  );
};

// ---------------------------------------------------------------- J, K, L: the answer assembles
// the tools around the centre: [logo, x, y, size, navy tile, rotation, where it flies in from (dx, dy)]
const TOOLS: [string, number, number, number, boolean, number, number, number][] = [
  ["pipedrive", 170, 150, 190, true, -6, -700, -300], ["n8n-logo2", 390, 520, 170, false, 5, -800, 100], ["makecom-removebg-preview", 150, 770, 200, false, -4, -600, 500],
  ["odoo-1", 1420, 170, 200, true, 6, 700, -300], ["resend", 1560, 540, 170, true, -5, 800, 100], ["supabase", 1330, 800, 180, false, 4, 600, 500],
];
const DOTS = [[330, 110], [640, 330], [1250, 420], [1700, 420], [620, 900], [1240, 760]];
const ROWS_AT = [at(342), at(354), at(366), at(376)];
const JKL: React.FC<{ t: number }> = ({ t }) => {
  const n = t * 24 + F0;                                               // the reference frame we are on
  const kIn = at(312), lIn = at(336), outline = E(t, at(378), 0.28, ease.in);
  const card = S(t, kIn + 0.06, { damping: 15, stiffness: 150 }), small = E(t, lIn - 0.04, 0.3, ease.out);
  const done = ROWS_AT.filter((r) => t >= r).length, bump = ROWS_AT.reduce((s, r) => s + Math.max(0, Math.sin(Math.PI * clamp((t - r) / 0.3))), 0);
  const first = S(t, at(307), { damping: 11, stiffness: 220 });        // the first tool tile, alone in the centre
  return (
    <Ground tone="ui">
      {n < 301 && <div style={abs(810, 390)}><Glyph k={0} s={300} /></div>}
      {n >= 301 && n < 307 && <div style={abs(810, 390)}><Glyph k={3} s={300} /></div>}
      {n >= 307 && n < 312 && <div style={{ position: "absolute", left: 0, top: 0, transformOrigin: "960px 540px", transform: `scale(${mix(0.5, 1, first).toFixed(4)})`, width: 1920, height: 1080 }}><Tool n="pipedrive" x={875} y={455} s={170} navy /></div>}
      {/* the tools fly in to their places, then leave as the card takes the frame */}
      {t >= kIn && TOOLS.map(([name, x, y, s, navy, rot, dx, dy], i) => {
        const p = S(t, kIn + i * 0.045, { damping: 15, stiffness: 140 }), away = E(t, lIn - 0.06, 0.22, ease.in);
        const ox = dx * (1 - p) + dx * 0.9 * away, oy = dy * (1 - p) + dy * 0.9 * away;
        return (
          <div key={name} style={{ position: "absolute", left: 0, top: 0, transform: `translate3d(${ox.toFixed(2)}px, ${oy.toFixed(2)}px, 0)`, opacity: clamp(p * 2.5) * (1 - away), willChange: "transform" }}>
            {/* a soft ghost of the tile behind it, as in the reference */}
            <div style={{ position: "absolute", left: dx * 0.06, top: dy * 0.06, opacity: 0.22, filter: "blur(14px)" }}><Tool n={name} x={x} y={y} s={s * 1.25} navy={navy} rot={rot} /></div>
            <Tool n={name} x={x} y={y} s={s} navy={navy} rot={rot} />
          </div>
        );
      })}
      {t >= kIn && DOTS.map(([x, y], i) => { const p = S(t, at(326) + i * 0.045, { damping: 9, stiffness: 260 }); return <div key={i} style={abs(x, y, 30, 30, { borderRadius: 15, background: C.cyan, transform: `scale(${p.toFixed(4)})`, opacity: 1 - E(t, lIn - 0.06, 0.2, ease.in) })} />; })}
      {/* the flow card: builds in the middle, then stands alone and completes row by row */}
      {t >= kIn && (
        <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "960px 540px", transform: `scale(${(mix(0.72, 1, card) * mix(1, 0.9, small) * (1 + 0.012 * bump) * (1 + 0.55 * outline)).toFixed(4)})`, opacity: clamp(card * 2.2), willChange: "transform" }}>
          <div style={{ opacity: 1 - 0.85 * outline }}><FlowCard x={750} y={150} done={done} /></div>
          <div style={abs(750, 150, 420, 780, { borderRadius: 34, border: `3px solid ${C.ink}`, boxSizing: "border-box", opacity: 0.5 * outline })} />
        </div>
      )}
    </Ground>
  );
};

const Comp: React.FC<{ t: number }> = ({ t }) => {
  const ok = useFonts();
  if (!ok) return <AbsoluteFill style={{ background: C.ui }} />;
  return t < at(295) ? <I t={t} /> : <JKL t={t} />;
};
const sfx: Sfx[] = [
  { t: 0, kind: "type", note: "0.8 the end of the message" },
  { t: CLICK + 0.11, kind: "click", note: "send" },
  { t: at(295), kind: "tick", note: "glyph" },
  { t: at(301), kind: "tick", note: "glyph" },
  { t: at(307), kind: "pop", note: "the first tool" },
  { t: at(312), kind: "swish", note: "the tools fly in" },
  { t: ROWS_AT[0], kind: "pop", note: "row 1 done" }, { t: ROWS_AT[1], kind: "pop", note: "row 2 done" },
  { t: ROWS_AT[2], kind: "pop", note: "row 3 done" }, { t: ROWS_AT[3], kind: "success", note: "the flow runs by itself" },
];
export const PKG: Pkg = { id: "R04", Comp, sfx };
