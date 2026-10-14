// Segment 4, shot B (429-529): the storyboard wall as a true 3D plane (measured per-frame quads, TB1), the "06 · Detail"
// card re-rezzing in the old Storyboard slot, WKC Studio flying in defocused (TB2), dashed motion paths growing from
// the frames toward it (§4.6), and the accelerating orbit with a directional blur into the hard cut (§4.7).
import React from "react";
import { C } from "./lib";
import { PANEL, WALL } from "./seg4_data";
import { Arrow, CH, CW, StoryCard } from "./seg4_card";
import { PH, PW, StudioPanel } from "./seg4_panel";
import { P2, QuadLayer, applyH, flatQuad, mosaicId, rectToQuadH, rows } from "./seg4_util";

const WW = 2279, WH = 1154;
const COLS = [0, 593, 1186, 1779], ROWS = [0, 246, 492, 738, 984];
const SLOTS: [string, number, number][] = [];
for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) SLOTS.push([`c${c + 1}r${r + 1}`, COLS[c], ROWS[r]]);
SLOTS.push(["c3r5", COLS[2], ROWS[4]]);

/** the 06 · Detail card's re-rez (§4.2): scale (about its centre: the reference card's centre holds still while its
 * right edge moves out 40 px) and mosaic block (local px), read off the reference */
const BOX_S: Record<number, number> = { 429: 0.8, 430: 0.87, 431: 0.92, 432: 0.97, 433: 0.98, 434: 0.99 };
const boxBlock = (g: number) => (g <= 431 ? 8 : g === 432 ? 4 : g <= 435 ? 3 : 0);

const WallCard: React.FC<{ slot: string; x: number; y: number; g: number }> = ({ slot, x, y, g }) => {
  const card = <div style={{ position: "absolute", left: x, top: y, width: CW, height: CH, transform: "rotate(-0.45deg)" }}><StoryCard slot={slot} /></div>;
  if (slot !== "c2r2" || g >= 436) return card;
  const s = BOX_S[g] ?? 1, b = boxBlock(g), pad = 40;
  return (
    <div style={{ position: "absolute", left: x - pad, top: y - pad, width: CW + 2 * pad, height: CH + 2 * pad, filter: b ? `url(#${mosaicId(b)})` : undefined }}>
      <div style={{ position: "absolute", left: pad, top: pad, width: CW, height: CH, transformOrigin: `${CW / 2}px ${CH / 2}px`, transform: `scale(${s}) rotate(-0.45deg)` }}>
        <StoryCard slot={slot} />
      </div>
    </div>
  );
};

const Wall: React.FC<{ g: number }> = ({ g }) => {
  const arrows: React.ReactNode[] = [];
  for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++) {
    let p = 1;
    if (r === 1 && c === 0) p = (g - 434) / 4; // into 06 · Detail: draws on over 435-438
    if (r === 1 && c === 1) p = g >= 440 ? 1 : 0; // out of it: appears at 440
    arrows.push(<Arrow key={`${r}${c}`} x0={COLS[c] + CW + 10} x1={COLS[c + 1] - 10} y={ROWS[r] + 84} sw={3} head={9} p={p} />);
  }
  return (
    <QuadLayer w={WW} h={WH} q={flatQuad(WALL[g])}>
      {SLOTS.map(([slot, x, y]) => <WallCard key={slot} slot={slot} x={x} y={y} g={g} />)}
      <svg width={WW} height={WH} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>{arrows}</svg>
    </QuadLayer>
  );
};

// ----------------------------------------------------------------------------------------- motion paths (§4.6)
type Line = { p: P2; d: P2; appear: number; s: number[][] };
const LINES: Line[] = [
  { p: [-10, 136], d: [-0.967, 0.256], appear: 458, s: [[458, 98], [460, 299], [462, 378], [464, 448], [466, 501], [468, 558], [470, 610]] },
  { p: [1340, 126], d: [-0.929, 0.369], appear: 458, s: [[458, 39], [460, 107], [462, 168], [464, 229], [466, 283], [468, 324], [470, 371], [474, 447], [478, 499], [482, 550], [486, 579], [490, 612], [494, 626], [498, 649], [502, 663], [506, 670], [510, 686], [514, 709]] },
  { p: [1880, 437], d: [-0.844, 0.536], appear: 471, s: [[471, 32], [472, 68], [474, 140], [476, 180], [478, 219], [482, 364], [486, 423], [490, 470], [494, 504], [498, 518], [502, 542], [506, 562], [510, 579], [514, 601]] },
  { p: [1845, 908], d: [-0.769, 0.639], appear: 462, s: [[462, 50], [475, 50], [476, 92], [480, 139], [484, 170], [488, 210], [490, 380], [494, 455], [498, 519], [502, 540], [506, 590], [510, 665], [514, 701], [518, 767]] },
];
const DASH = "20 20";
const MotionPaths: React.FC<{ g: number }> = ({ g }) => {
  const H = rectToQuadH(WW, WH, flatQuad(WALL[g]));
  const at = (l: Line, s: number) => applyH(H, l.p[0] + l.d[0] * s, l.p[1] + l.d[1] * s);
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      {LINES.map((l, i) => {
        if (g < l.appear) return null;
        const s = rows(l.s, g)[0];
        const [x0, y0] = at(l, 0), [x1, y1] = at(l, s);
        const len = Math.hypot(x1 - x0, y1 - y0), ux = (x1 - x0) / len, uy = (y1 - y0) / len;
        const hl = 30, hw = 10; // arrowhead length / half-width, screen px
        const bx = x1 - ux * hl, by = y1 - uy * hl;
        const ghost = i === 1 && g >= 461 && g <= 480 ? at(l, 1100) : null;
        return (
          <g key={i}>
            {ghost && <path d={`M${x1} ${y1} L${ghost[0]} ${ghost[1]}`} stroke={C.blue} strokeOpacity={0.5} strokeWidth={3} strokeDasharray={DASH} />}
            <path d={`M${x0} ${y0} L${bx} ${by}`} stroke={C.glowHi} strokeOpacity={0.4} strokeWidth={9} strokeDasharray={DASH} />
            <path d={`M${x0} ${y0} L${bx} ${by}`} stroke={C.blue} strokeWidth={5} strokeDasharray={DASH} />
            <path d={`M${x1} ${y1} L${bx - uy * hw} ${by + ux * hw} L${bx + uy * hw} ${by - ux * hw} Z`} fill={C.blue} stroke={C.glowHi} strokeOpacity={0.4} strokeWidth={2} strokeLinejoin="round" />
            <rect x={x0 - 5} y={y0 - 5} width={10} height={10} fill={C.white} stroke={C.blue} strokeWidth={2.2} transform={`rotate(45 ${x0} ${y0})`} />
          </g>
        );
      })}
    </svg>
  );
};

// ------------------------------------------------------------------------------------------------- panel (TB2)
const Panel: React.FC<{ g: number }> = ({ g }) => {
  const v = PANEL[g];
  if (!v) return null;
  const blur = v[8];
  const layer = <QuadLayer w={PW} h={PH} q={flatQuad(v)}><StudioPanel /></QuadLayer>;
  return blur > 0.05 ? <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, filter: `blur(${blur}px)` }}>{layer}</div> : layer;
};

/** the exit's directional blur: box smear length (px) per frame, along -x tilted 12 degrees up (§4.7; lengths fitted so
 * the edge spreads match the reference's: 2, 4, 8, 7-10, 15 px on the 08 · Mobile card's right edge) */
const EXIT: Record<number, number> = { 525: 5, 526: 9, 527: 13, 528: 17, 529: 25 };
const PAD = 500;
export const ShotB: React.FC<{ g: number }> = ({ g }) => {
  const scene = <><Wall g={g} /><MotionPaths g={g} /><Panel g={g} /></>;
  const sm = EXIT[g];
  if (!sm) return scene;
  const n = Math.round(sm) | 1;
  return (
    <>
      <svg width={0} height={0} style={{ position: "absolute" }}>
        <defs>
          <filter id="s4exit" x="-0.05" y="-0.05" width="1.1" height="1.1" colorInterpolationFilters="sRGB">
            <feConvolveMatrix order={`${n} 1`} kernelMatrix={Array(n).fill(1).join(" ")} divisor={n} targetX={(n - 1) / 2} targetY={0} edgeMode="none" preserveAlpha="false" />
          </filter>
        </defs>
      </svg>
      <div style={{ position: "absolute", left: -PAD, top: -PAD, width: 1920 + 2 * PAD, height: 1080 + 2 * PAD, transformOrigin: `${960 + PAD}px ${540 + PAD}px`, transform: "rotate(12deg)", filter: "url(#s4exit)" }}>
        <div style={{ position: "absolute", left: PAD, top: PAD, width: 1920, height: 1080, transformOrigin: "960px 540px", transform: "rotate(-12deg)" }}>{scene}</div>
      </div>
    </>
  );
};
