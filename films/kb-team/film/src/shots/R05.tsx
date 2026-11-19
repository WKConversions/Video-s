// Package R05 · reference f385–f474 · shots M N O.
//   M  f385–f419  full-screen flash cuts of record cards: a new arrangement at every cut; placeholders fill in while the
//                 row grows from three cards to five to a wall of three rows, and resolves on three finished records
//   N  f420–f433  macro: the letters of "found" as they are typed, a new crop at each cut: f, fo, ou, un, nd
//   O  f434–f474  the message box: the second sentence is typed to its end
// Every change is a hard cut on its reference frame. t = seconds since f385.
import React from "react";
import { Bar, C, E, Ground, Msg, SH, Tx, abs, ease, typed, useFonts } from "../kit";
import type { Pkg, Sfx } from "../types";

const F0 = 385;
/** local seconds of reference frame n */
const at = (n: number) => (n - F0) / 24;
/** the reference frame (fractional) on screen at local time t; the small bias keeps every cut on its exact film frame */
const refAt = (t: number) => F0 + t * 24 + 1e-4;

// ---------------------------------------------------------------- M: the record cards (the storyboard's FR 14)
// A card is written as 10 * look + bars; CY = a cyan placeholder, NO = no card there.
const CY = -1, NO = -2;
const LOOKS = [
  { top: C.ink, av: C.cyan }, { top: "#EEF3FF", av: C.indigo }, { top: "#E9F8F1", av: C.mint }, { top: "#F1EEFF", av: C.violet },
  { top: "#FFF4E0", av: C.amber }, { top: "#FFECE8", av: C.coral }, { top: C.dark2, av: C.mint }, { top: C.ink, av: C.amber },
];
const BARS = [[300, 220, 260, 180], [260, 300, 190, 240], [320, 200, 240, 150], [280, 240, 300, 200]];
const PILL = [180, 150, 210, 180];
const Card: React.FC<{ k: number }> = ({ k }) => {
  if (k === NO) return <div style={{ flex: 1 }} />;
  if (k === CY) return <div style={{ flex: 1, borderRadius: 20, background: C.cyan, boxShadow: SH }} />;
  const look = LOOKS[Math.floor(k / 10)], b = k % 10;
  return (
    <div style={{ flex: 1, borderRadius: 20, background: C.white, boxShadow: SH, position: "relative", overflow: "hidden" }}>
      <div style={abs(0, 0, 400, 300, { background: look.top })}><div style={abs(40, 60, 150, 150, { borderRadius: 75, background: look.av })} /></div>
      {BARS[b].map((w, i) => <Bar key={i} x={36} y={350 + i * 70} w={w} h={22} c={i === 0 ? C.ink : "#D5D9DF"} />)}
      <div style={abs(36, 690, PILL[b], 70, { borderRadius: 35, background: C.green })} />
    </div>
  );
};
const Row: React.FC<{ y: number; cards: number[] }> = ({ y, cards }) => (
  <div style={abs(-60, y, 2040, 820, { display: "flex", gap: 22 })}>{cards.map((k, i) => <Card key={i} k={k} />)}</div>
);
// The arrangements, each from its reference frame on. The middle card stays the same record until f405 (as the
// reference's middle picture does); f390 is the change inside the second shot; f393–f413 show the rows above and below.
type Grid = { f: number; top?: number[]; mid: number[]; bot?: number[] };
const GRID: Grid[] = [
  { f: 385, mid: [NO, CY, 20, CY, NO] },
  { f: 387, mid: [CY, 10, 20, 0, CY] },                                                             // the storyboard frame
  { f: 390, mid: [CY, 41, 20, 32, CY] },
  { f: 393, top: [52, 1, 33, 13, 40], mid: [31, 53, 20, 72, 12], bot: [CY, 43, 61, 22, CY] },
  { f: 396, top: [13, 42, 0, 51, 23], mid: [62, 11, 20, 43, 1], bot: [CY, 70, 32, 13, CY] },
  { f: 399, top: [21, 63, 50, 32, 71], mid: [40, 2, 20, 51, 33], bot: [3, 52, 11, 60, 42] },
  { f: 402, top: [72, 30, 12, 3, 53], mid: [13, 71, 20, 30, 62], bot: [31, 23, 40, 72, 1] },
  { f: 405, top: [43, 51, 62, 20, 10], mid: [2, 33, 51, 12, 40], bot: [60, 11, 3, 43, 22] },
  { f: 408, top: [30, 2, 73, 41, 61], mid: [52, 21, 3, 63, 10], bot: [12, 40, 31, 53, 70] },
  { f: 411, top: [61, 22, 43, 10, 32], mid: [71, 42, 30, 11, 53], bot: [23, 0, 52, 33, 11] },
  { f: 414, mid: [33, 52, 61, 41, 13] },
  { f: 417, mid: [NO, 10, 20, 0, NO] },                                                             // the three placeholders of f385, filled
];
const ShotM: React.FC<{ n: number }> = ({ n }) => {
  let g = GRID[0];
  for (const s of GRID) if (n >= s.f) g = s;
  return (
    <Ground>
      {g.top && <Row y={130 - 842} cards={g.top} />}
      {g.bot && <Row y={130 + 842} cards={g.bot} />}
      <Row y={130} cards={g.mid} />
    </Ground>
  );
};

// ---------------------------------------------------------------- N: the macro letters (the storyboard's FR 15)
// The camera jumps along the word with the typing: each crop shows the newest letter and the one before it, as large
// as FR 15 and at its height. The two letters end where FR 15's "ou" ends (the hidden "ou" sizes the box), so the
// "ou" crop is that frame exactly; dx moves a crop sideways (the first two sit further left, as in the reference).
const CROPS = [{ f: 420, txt: "f", dx: -600 }, { f: 423, txt: "fo", dx: -110 }, { f: 426, txt: "ou", dx: 0 }, { f: 429, txt: "un", dx: 0 }, { f: 431, txt: "nd", dx: 0 }];
const ShotN: React.FC<{ n: number }> = ({ n }) => {
  let c = CROPS[0];
  for (const s of CROPS) if (n >= s.f) c = s;
  return (
    <Ground tone="vig">
      <Tx x={-110} y={-140} s={1500} w={500} c="#111A27" style={{ letterSpacing: -60, transform: `translate3d(${c.dx}px, 0, 0)` }}>
        <span style={{ visibility: "hidden" }}>ou</span>
        <span style={{ position: "absolute", right: 0, top: 0 }}>{c.txt}</span>
      </Tx>
    </Ground>
  );
};

// ---------------------------------------------------------------- O: the second message (the storyboard's FR 16)
const HEAD = "We want to be found by the right customers, in search and";
// The finished sentence breaks before "answers." (FR 16), but its first four letters would still fit on the first line
// and jump down at the fifth. PAD invisible no-break spaces after "AI" fill the rest of that line (9 to 12 of them do,
// measured on the kit's Msg at this width), so the word starts on its own line and no letter ever shifts.
// PAD = 0 gives the plain wrapping of a text field.
const PAD = 10;
const ShotO: React.FC<{ t: number }> = ({ t }) => {
  // the reference types a character about every two frames, in two runs with a short breath between them
  const a = typed(" in AI", t, at(433), 12), b = typed(" answers.", t, at(447), 12);
  const text = HEAD + a + (b.length > 1 ? "\u00A0".repeat(PAD) : "") + b;
  // in its last frames the reference's box begins to slide to the right (the cut takes it away)
  const dx = 10 * E(t, at(469.5), 5 / 24, ease.inOut);
  return (
    <Ground tone="ui">
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `translate3d(${dx.toFixed(2)}px, 0, 0)`, willChange: "transform" }}>
        <Msg x={405} y={400} w={1110} text={text} />
      </div>
    </Ground>
  );
};

const Comp: React.FC<{ t: number }> = ({ t }) => {
  const ok = useFonts();
  const n = refAt(t);
  if (!ok) return <Ground tone={n >= 434 ? "ui" : n >= 420 ? "vig" : "paper"} />;
  if (n >= 434) return <ShotO t={t} />;
  if (n >= 420) return <ShotN n={n} />;
  return <ShotM n={n} />;
};

const sfx: Sfx[] = [
  // M: one tick on every flash cut (f390 is the change inside the second shot)
  ...[385, 387, 390, 393, 396, 399, 402, 405, 408, 411, 414, 417].map((f) => ({ t: at(f), kind: "tick", note: "flash cut", ref: f })),
  // N: one key on each cut, as the letter appears
  ...[420, 423, 426, 429, 431].map((f, i) => ({ t: at(f), kind: "type", note: i === 3 ? "0.08" : "0.12", ref: f })),
  // O: the sentence is typed on in two runs
  { t: at(435), kind: "type", note: "0.46", ref: 435 },
  { t: at(449), kind: "type", note: "0.70", ref: 449 },
];

export const PKG: Pkg = { id: "R05", Comp, sfx };
