// Package R10 (reference f833-f961; cuts f847, f871, f900, f925), rebuilt frame by frame from the reference.
//   AG f833-f846   cards settle on black (pebbles + sketch first, then the dotted card, the leaf picture, ...) and the
//                  window's ghost fades in around them
//   AH f847-f870   the lit product window; the pointer rests on the refresh button; the picture swells over the window
//   AH2 f871-f899  the bolder window: the picture fills it, the card row builds from the right
//   AI f900-f924   K.B's canvas close: counters count, the K.B and You cursors move, a note is dragged and typed
//   AJ f925-f961   the second canvas, full frame, pulling back; the donut counts, the cursors keep moving
import React from "react";
import { AbsoluteFill } from "remotion";
import type { Pkg, Sfx } from "../types";
import { C, refN, rs, useFonts } from "../kit";
import { WinScene } from "./R10_win";
import { BoardAI, BoardAJ } from "./R10_boards";

const F0 = 833;
const at = (n: number) => rs(n - F0);

const Comp: React.FC<{ t: number }> = ({ t }) => {
  const ok = useFonts();
  if (!ok) return <AbsoluteFill style={{ background: "#020202" }} />;
  const n = refN(t, F0);
  if (n < 900) return <WinScene n={n} />;
  if (n < 925) return <BoardAI n={n} />;
  return <BoardAJ n={n} />;
};
const sfx: Sfx[] = [
  { t: 0, kind: "swish", note: "the pebbles and the sketch card" },
  { t: at(835), kind: "pop", note: "the dotted card" },
  { t: at(836), kind: "pop", note: "the leaf picture" },
  { t: at(839), kind: "pop", note: "mint and glyph cards" },
  { t: at(840), kind: "pop", note: "the plant card" },
  { t: at(844), kind: "swish", note: "the window's ghost, the cards settle" },
  { t: at(847), kind: "pop", note: "the window lights" },
  { t: at(863), kind: "click", note: "the refresh button takes the pointer" },
  { t: at(867), kind: "swish", note: "the picture swells over the window" },
  { t: at(871), kind: "rise", note: "the bolder window" },
  { t: at(873), kind: "tick", note: "the card row builds" },
  { t: at(875.5), kind: "tick", note: "card" },
  { t: at(878), kind: "tick", note: "card" },
  { t: at(900), kind: "swish", note: "the canvas, close" },
  { t: at(900), kind: "tick", note: "the counters count", keep: true },
  { t: at(902.5), kind: "type", note: "1.2" },
  { t: at(916), kind: "click", note: "the second flow is selected" },
  { t: at(925), kind: "slide", note: "the second canvas pulls back" },
  { t: at(929), kind: "tick", note: "the donut counts" },
  { t: at(933), kind: "tick", note: "the bar lights" },
];
export const PKG: Pkg = { id: "R10", Comp, sfx };
void C;
