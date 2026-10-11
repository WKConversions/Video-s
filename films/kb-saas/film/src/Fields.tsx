// The colour fields: each new ground grows as a circle out of the object that causes it (no crossfades), and the one
// full cyan field contracts back into the process card.
import React from "react";
import { AbsoluteFill } from "remotion";
import { C, W, clamp01, expoOut, lerp, mix, px } from "./lib";

type Fd = { f: number; color: string; x: number; y: number; n: number; lin?: number };
const R = 2300;
export const fieldList = (): Fd[] => [
  { f: 0, color: C.page, x: 960, y: 540, n: 1 },
  { f: W("w:meet", 0.0), color: C.white, x: 960, y: 540, n: 44 },        // out of the K.B tile
  { f: W("w:kb", 0.55), color: C.cyanPale, x: 960, y: 540, n: 40, lin: 1300 },   // K.B's tint grows out of the tile, slowly
  { f: W("w:tools2"), color: C.paleCool, x: 960, y: 560, n: 24 },        // out of the connection line
  { f: W("w:workflows"), color: C.pale, x: 960, y: 650, n: 22 },         // out of the workflow card
  { f: W("w:simplify", -0.1), color: C.white, x: 960, y: 540, n: 20 },  // the deck gathering clears it
  { f: W("w:operations", -0.1), color: C.cyanPale, x: 960, y: 540, n: 36, lin: 1300 }, // out of the "Operations" line
  { f: W("w:together2", -0.05), color: C.cyan, x: 960, y: 760, n: 24 }, // the answer floods cyan
  { f: W("w:just2", -0.1), color: C.white, x: 960, y: 300, n: 20 },     // out of the business pill
  { f: W("w:less", -0.28), color: C.paleCool, x: 960, y: 560, n: 22 },   // out of the "Manual work" card
  { f: W("w:kb2", -0.35), color: C.white, x: 960, y: 420, n: 22 },      // out of the rising K.B tile
];

/** The cyan contraction: from the full field into the process card's rectangle. */
export const CONTRACT = { a: () => W("w:analyze", -0.62), n: 14 };

export const Fields: React.FC<{ g: number }> = ({ g }) => {
  const list = fieldList();
  const ca = CONTRACT.a();
  // after the contraction starts the ground is the page again until the next field
  const items = list.map((d) => ({ ...d }));
  let base = 0;
  for (let i = 0; i < items.length; i++) if (g >= items[i].f + items[i].n) base = i;
  const cyanIdx = items.findIndex((d) => d.color === C.cyan);
  const inContract = g >= ca && g < items[cyanIdx + 1].f;
  const baseColor = inContract ? C.page : items[base].color;
  const growing = items.filter((d, i) => i > base && g >= d.f && g < d.f + d.n && !(inContract && i === cyanIdx));
  const cp = px(g, ca, CONTRACT.n, 0.82);
  // card rect the cyan contracts into (the process card: 1560×760 at 960,560)
  const cw = lerp(2600, 1560, cp), ch = lerp(2600, 760, cp), rr = lerp(1300, 40, cp);
  return (
    <AbsoluteFill style={{ background: baseColor }}>
      {growing.map((d, i) => {
        const k = clamp01((g - d.f) / d.n);
        const r = d.lin ? d.lin * k : R * expoOut(d.n, 0.86)(k);
        return <AbsoluteFill key={i} style={{ background: d.color, clipPath: `circle(${r}px at ${d.x}px ${d.y}px)` }} />;
      })}
      {inContract && g < ca + CONTRACT.n + 2 && (
        <div style={{ position: "absolute", left: 960 - cw / 2, top: 560 - ch / 2, width: cw, height: ch, borderRadius: rr,
          background: mix(C.cyan, C.white, clamp01((cp - 0.7) / 0.3)) }} />
      )}
    </AbsoluteFill>
  );
};
