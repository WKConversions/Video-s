// The stage: one continuous world in which three objects persist and change (storyboard/plan.md):
//   BT  the business (one clip in a tile): lands, grows, is held back, waits, is understood, opened, fixed, rides, is
//       held back again ("alone"), and lifts with the partner behind it
//   KT  the K.B tile: comes in, becomes the field, stands beside, sends the dot, rides alongside, turns to the founders,
//       hides behind the business, rises behind it, turns back to the logo
//   the tools: the floor, the reel, the wall, the three solutions, the treadmill
// Every move is keyed to a label of src/clock.ts (the voice's words), never to a frame number.
import React from "react";
import { AbsoluteFill, Easing } from "remotion";
import { T } from "./clock";
import { EASE, Line, W, measure, track } from "./kinetic";
import { ARRIVE, C, DEPART, F, MOVE, R, SOFT, clamp01, lerp } from "./lib";
import { Biz, Flip3D, Founders, Note, Piece, ToolFace, ToolRow, rowX, travelled } from "./parts";

const LONGS = EASE.longS;
const k = (g: number, pos: string | number, dur: number, ease = ARRIVE) => T.k(g, pos, dur, ease);
const on = (g: number, a: string, b?: string) => g >= T.f(a) && (b === undefined || g < T.f(b));

const ROW1 = ["make", "n8n", "supabase", "claude", "next", "pipedrive", "odoo", "postgres", "ts", "resend"];
const ROW2 = ["vite", "tanstack", "spring", "payload", "datadog", "apollo", "zenchef", "expogo", "aqqo", "gyg"];
// arrivals from outside the frame: a gentler start than ARRIVE so no frame outruns the motion blur (≤ ~120 px a frame)
const IN = Easing.bezier(0.3, 0.7, 0.4, 1);
const REEL = ["claude", "supabase", "pipedrive", "n8n", "odoo", "make", "next", "postgres", "resend", "ts", "vite", "tanstack", "payload", "spring", "datadog", "apollo"];

// ---- the business: x, y, w, h, zoom -------------------------------------------------------------------------------
const btTrack = (g: number) => track(g, [
  ["open", 720, -250, 440, 440, 1.5],
  ["w:should-0.12", 720, -250, 440, 440, 1.5],
  ["land", 720, 480, 440, 440, 1.5, IN],
  ["lift", 720, 480, 440, 440, 1.5],
  ["lift+0.62", 720, 345, 510, 510, 1.5, LONGS],
  ["sink", 720, 345, 510, 510, 1.5],
  ["sink+0.6", 720, 610, 460, 460, 1.5, SOFT],
  ["slide", 720, 610, 460, 460, 1.5],
  ["slide+0.5", 520, 610, 460, 460, 1.5, MOVE],
  ["where", 520, 610, 460, 460, 1.5],
  ["where+0.55", 760, 540, 460, 460, 1.5, MOVE],
  ["field+0.48", 760, 540, 460, 460, 1.5],
  ["field+0.5", 1110, 450, 600, 600, 1.5],                     // under the field, unseen: waits at right
  ["first", 1110, 450, 600, 600, 1.5],
  ["first+0.6", 1150, 540, 900, 900, 1.5, MOVE],
  ["open3", 1150, 540, 900, 900, 1.5],
  ["open3+0.62", 960, 540, 1920, 1080, 1.05, LONGS],          // the business opens to the frame
  ["bring", 960, 540, 1920, 1080, 1.05],
  ["bring+0.55", 1080, 540, 840, 840, 1.5, MOVE],
  ["life+0.3", 1080, 540, 840, 840, 1.5],
  ["life+0.8", 1080, 480, 840, 840, 1.5, ARRIVE],
  ["road", 1080, 480, 840, 840, 1.5],
  ["road+0.6", 590, 510, 440, 440, 1.5, MOVE],
  ["ride", 590, 510, 440, 440, 1.5],
  ["ride+1.0", 1350, 510, 440, 440, 1.5, LONGS],
  ["gather", 1350, 510, 440, 440, 1.5],
  ["gather+0.65", 1280, 540, 620, 620, 1.5, MOVE],
  ["behind0", 1280, 540, 620, 620, 1.5],
  ["behind0+0.66", 1180, 480, 680, 680, 1.5, MOVE],
  ["rise", 1180, 480, 680, 680, 1.5],
  ["rise+0.5", 1180, 380, 680, 680, 1.5, ARRIVE],
  ["floorIn", 1180, 380, 680, 680, 1.5],
  ["floorIn+0.6", 1180, 480, 680, 680, 1.5, SOFT],
  ["alone", 1180, 480, 680, 680, 1.5],
  ["alone+0.6", 1180, 600, 680, 680, 1.5, SOFT],               // alone: grey, and sinking into the floor
  ["w:it2", 1180, 600, 680, 680, 1.5],
  ["w:it2+0.85", 450, 700, 560, 560, 1.5, LONGS],
  ["up", 450, 700, 560, 560, 1.5],
  ["up+0.75", 450, 560, 560, 560, 1.5, SOFT],                  // lifted, with the partner behind it
  ["rest", 450, 560, 560, 560, 1.5],
  ["rest+0.6", 680, 690, 380, 380, 1.5, MOVE],
]);

// ---- the K.B tile: x, y, w, h, radius, letters ---------------------------------------------------------------------
const ktTrack = (g: number) => track(g, [
  ["open", 2060, 420, 220, 220, 16, 220],
  ["kb-0.08", 2060, 420, 220, 220, 16, 220],
  ["kb+0.5", 1120, 420, 220, 220, 16, 220, IN],
  ["field", 1120, 420, 220, 220, 16, 220],
  ["field+0.55", 960, 540, 2000, 1160, 0, 1045, LONGS],
  ["fold", 960, 540, 2000, 1160, 0, 1130],                     // the letters keep growing under the voice
  ["fold+0.5", 300, 300, 300, 300, 22, 300, LONGS],
  ["dock", 300, 300, 300, 300, 22, 300],
  ["dock+0.6", 636, 300, 300, 300, 22, 300, LONGS],
  ["first", 636, 300, 300, 300, 22, 300],
  ["first+0.6", 556, 210, 240, 240, 18, 240, MOVE],
  ["open3", 556, 210, 240, 240, 18, 240],
  ["open3+0.6", -140, 210, 240, 240, 18, 240, MOVE],           // steps out of frame: the lens works for it
  ["bring", -140, 210, 240, 240, 18, 240],
  ["bring+0.55", 516, 240, 240, 240, 18, 240, MOVE],
  ["road", 516, 240, 240, 240, 18, 240],
  ["road+0.6", 262, 380, 180, 180, 13, 180, MOVE],
  ["ride", 262, 380, 180, 180, 13, 180],
  ["ride+1.0", 1022, 380, 180, 180, 13, 180, LONGS],
  ["gather", 1022, 380, 180, 180, 13, 180],
  ["gather+0.65", 640, 540, 620, 620, 46, 620, MOVE],
  ["behind0", 640, 540, 620, 620, 46, 620],
  ["behind0+0.66", 1180, 480, 640, 640, 47, 640, MOVE],         // hidden behind the business: technology alone
  ["rise", 1180, 480, 640, 640, 47, 640],
  ["rise+0.5", 1180, 380, 640, 640, 47, 640, ARRIVE],
  ["floorIn", 1180, 380, 640, 640, 47, 640],
  ["floorIn+0.6", 1180, 480, 640, 640, 47, 640, SOFT],
  ["alone", 1180, 480, 640, 640, 47, 640],
  ["alone+0.6", 1180, 600, 640, 640, 47, 640, SOFT],
  ["w:it2", 1180, 600, 640, 640, 47, 640],
  ["w:it2+0.85", 450, 700, 540, 540, 40, 540, LONGS],
  ["partner", 450, 700, 540, 540, 40, 540],
  ["partner+0.45", 450, 430, 540, 540, 40, 540, SOFT],         // the right partner rises behind it
  ["up", 450, 430, 540, 540, 40, 540],
  ["up+0.75", 450, 300, 540, 540, 40, 540, SOFT],
  ["rest", 450, 300, 540, 540, 40, 540],
  ["rest+0.5", 450, 370, 520, 520, 38, 520, MOVE],
]);

const KB_PATHS = [
  { t: "translate(61.650 334.974) scale(0.21014 -0.21014)", d: "M65 0H215V15H195V242L330 354L594 15H576V0H755V15H733L408 418L732 685H750V700H572V685H593L195 367V685H215V700H65V685H85V15H65Z" },
  { t: "translate(285.453 334.974) scale(0.21014 -0.21014)", d: "M65 0H525C670 0 753 71 753 190C753 278 708 337 626 362C687 386 735 433 735 520C735 629 650 700 505 700H65V685H85V15H65ZM485 600C565 600 625 584 625 505C625 429 565 405 475 405H189V600ZM189 100V315H500C590 315 643 281 643 215C643 119 590 100 500 100Z" },
];
const DOT = { x: 253.93 / 512, y: 323.42 / 512, r: 14.71 / 512 };

/** The K.B tile as one object that can become the field: gradient, radius, the Copperplate letters at size L. */
const KTile: React.FC<{ w: number; h: number; rad: number; L: number; dotFill?: string; dotScale?: number }> = ({ w, h, rad, L, dotFill = C.white, dotScale = 1 }) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: w, height: h, borderRadius: rad, overflow: "hidden", background: `linear-gradient(90deg, ${C.kbL}, ${C.kbR})` }}>
    <svg width={L} height={L} viewBox="0 0 512 512" style={{ position: "absolute", left: 0, top: 0, transform: `translate(${(w - L) / 2}px, ${(h - L) / 2}px)`, overflow: "visible" }}>
      <g fill="#FFFFFF">{KB_PATHS.map((p, i) => <path key={i} transform={p.t} d={p.d} />)}</g>
      <circle cx={DOT.x * 512} cy={DOT.y * 512} r={DOT.r * 512 * dotScale} fill={dotFill} />
    </svg>
  </div>
);

let lctx: CanvasRenderingContext2D | null = null;
const widthOf = (text: string, size: number, family: string, weight: number, ls: number) => {
  lctx = lctx ?? document.createElement("canvas").getContext("2d")!;
  lctx.font = `${weight} ${size}px ${family}`;
  (lctx as unknown as { letterSpacing: string }).letterSpacing = `${ls * size}px`;
  return lctx.measureText(text).width - ls * size;
};

// the reel: a full column of tools running up out of the floor through a selector that never settles
const REEL_X = 1226, REEL_PITCH = 232, REEL_TILE = 208, REEL_FLOOR = 853;
const reelKeys = () => [[T.f("reel") - 1, 0], [T.f("reel"), 1700], [T.f("reel") + 14, 260]] as [number, number][];
const reelY = (i: number, gg: number) => REEL_FLOOR + i * REEL_PITCH - travelled(gg, reelKeys());
const HOVER: [number, number][] = [[343, 213], [1176, 413], [1176, 713]];   // round the business (760, 540)

// the wall: 4×4 cells round the business, one hole (3, 1)
const WC = { x: 760, y: 540 }, CELL = 240;
const cell = (c: number, r: number) => [WC.x + (c - 1.5) * CELL, WC.y + (r - 1.5) * CELL];
const WALL: { c: number; r: number; from: [number, number]; step: number; tool: string; hover?: number }[] = [
  { c: 0, r: 0, from: [0, 0], step: 0, tool: "", hover: 0 },
  { c: 3, r: 0, from: [0, 0], step: 0, tool: "", hover: 1 },
  { c: 3, r: 2, from: [0, 0], step: 1, tool: "", hover: 2 },
  { c: 1, r: 0, from: [640, -230], step: 1, tool: "next" },
  { c: 0, r: 1, from: [-230, 420], step: 2, tool: "odoo" },
  { c: 3, r: 3, from: [2150, 900], step: 2, tool: "make" },
  { c: 2, r: 0, from: [880, -230], step: 3, tool: "n8n" },
  { c: 0, r: 2, from: [-230, 660], step: 3, tool: "postgres" },
  { c: 1, r: 3, from: [640, 1310], step: 4, tool: "ts" },
  { c: 2, r: 3, from: [880, 1310], step: 4, tool: "resend" },
  { c: 0, r: 3, from: [-230, 900], step: 5, tool: "vite" },
];
const STEPS = ["close", "close+0.17", "w:always-0.04", "w:always+0.14", "w:easy-0.06", "w:easy+0.1"];

// the three parts of the business K.B finds (K.B's own words for manual work: [C1], [C2]) and the tools they become
const LAB: Record<number, { label: string; tool: string; at: string; flip: string; back: string }> = {
  1: { label: "Excel files", tool: "make", at: "ring1", flip: "flip", back: "life+0.45" },
  3: { label: "Follow-ups", tool: "n8n", at: "ring2", flip: "flip+0.1", back: "life+0.53" },
  7: { label: "CRM updates", tool: "claude", at: "ring2+0.1", flip: "flip+0.2", back: "life+0.61" },
};
const SOL = [1, 3, 7];

export const Story: React.FC<{ g: number }> = ({ g }) => {
  const t = g / 30;
  const [bx, by, bw, bh, bz] = btTrack(g);
  const [kx, ky, kw, kh, krad, kL] = ktTrack(g);

  // grey: held back from "back" until "life"; and again, alone, from "alone" until the partner rises behind it
  const greyA = clamp01(k(g, "sink", 0.5, SOFT)) * (g < T.f("life+1.0") ? 1 : 0);
  const greyB = k(g, "alone", 0.34, MOVE) * (1 - k(g, "partner", 0.45, MOVE));
  const opened = k(g, "open3", 0.62, LONGS) * (1 - k(g, "bring", 0.55, MOVE));

  // ---- the floor (hook) and the treadmill (close) ----
  const floorTop1 = g < T.f("land") ? lerp(330, 700, k(g, "w:should-0.1", 0.62, MOVE)) : by + bh / 2;   // the business stands on it
  const floorA = g < T.f("where") + 20;
  const floorY = lerp(on(g, "open", "slide") ? floorTop1 : 840, 1250, k(g, "where-0.05", 0.55, DEPART));
  const off1 = travelled(g, [[0, 115], [45, 115], [T.f("w:hold"), 95], [T.f("sink+0.6"), 60]]) + 40;
  const off2 = travelled(g, [[0, 90], [45, 90], [T.f("w:hold"), 75], [T.f("sink+0.6"), 45]]) + 150;
  const tmA = g >= T.f("floorIn") - 2;
  const tmEdge = lerp(1960, -300, k(g, "floorIn", 0.65, SOFT));
  const tmY = 820 + 420 * k(g, "drop", 0.75, DEPART);
  const tmOff = 95 * t;

  // ---- the grip: on "Not" the two row tiles under the business's feet lift out of the row; on "hold" they turn their
  //      blank backs over its feet; they sink with it, and drop back down when it slides away ----
  const fNot = T.f("w:not");
  const offNot = travelled(fNot, [[0, 115], [45, 115], [T.f("w:hold"), 95], [T.f("sink+0.6"), 60]]) + 40;
  const [nbx, , nbw] = btTrack(fNot);
  const gripIdx = [nbx - nbw / 2, nbx + nbw / 2].map((cx) => {
    let best = 0, d = 1e9;
    for (let i = 0; i < 22; i++) { const dx = Math.abs(rowX(i, offNot, ROW1.length) + 100 - cx); if (dx < d) { d = dx; best = i; } }
    return best;
  });
  const gripOn = on(g, "w:not", "slide+0.4");
  const gripRise = k(g, "w:not", 0.34, SOFT);
  const gripTurn = k(g, "grip", 0.36, MOVE);
  const gripOut = k(g, "slide", 0.35, DEPART);

  // ---- the reel (finding the right solutions) and the break (where to start?) ----
  const reelA = on(g, "reel", "close");
  const fWhere = T.f("where");
  const breakout = Array.from({ length: 16 }, (_, i) => ({ i, y: reelY(i, fWhere) })).filter((q) => q.y > 40 && q.y < 700)
    .sort((a, b) => Math.abs(a.y - 330) - Math.abs(b.y - 330)).slice(0, 3).sort((a, b) => a.y - b.y);
  // which hover spot each broken-out tile takes: the top one goes left, the other two right of the business
  const hoverOf = [0, 1, 2];
  const hop = ["where+0.36", "where+0.58", "where+0.80"].map((p) => T.f(p));
  const hopSeq = [1, 2, 0];
  const hopI = hop.filter((f) => g >= f).length;
  const seekAt = (n: number) => (n === 0 ? [REEL_X + REEL_TILE / 2, 446] : HOVER[hopSeq[n - 1]]);
  const hopK = hopI > 0 ? MOVE(clamp01((g - hop[hopI - 1]) / 9)) : 0;
  const wallFade = 1 - 0.65 * k(g, "kb", 0.24, MOVE);

  // ---- the dot and the lens (understand), the rings (identify) ----
  const pk = { x: kx - kw / 2 + DOT.x * kw, y: ky - kh / 2 + DOT.y * kh };   // KT's period, on screen
  const dotOut = k(g, "first+0.22", 0.45, MOVE);
  const lensK = k(g, "lens", 0.3);
  const lensGlide = k(g, "lens+0.2", 0.85, LONGS);
  const lensBack = k(g, "open3", 0.35, MOVE);
  const lensLocal = { x: lerp(230, 640, lensGlide), y: lerp(250, 560, lensGlide) };
  const dotHome = k(g, "life+0.62", 0.45, MOVE);

  // ---- pieces: rings, labels, flips ----
  const pieces: Record<number, Piece> = {};
  const dimK = k(g, "ring1", 0.35) * (1 - k(g, "bring", 0.4, MOVE));
  for (let i = 0; i < 9; i++) {
    const L = LAB[i];
    if (!L) { pieces[i] = { dim: dimK }; continue; }
    const rk = k(g, L.at, 0.3);
    const fl = k(g, L.flip, 0.42, MOVE) * (1 - k(g, L.back, 0.3, MOVE));
    pieces[i] = { ring: rk * (1 - k(g, "bring", 0.3)), lift: rk * (1 - k(g, "bring", 0.45, MOVE)), label: L.label,
      labelK: k(g, T.s(L.at) + 0.08, 0.35) * (1 - k(g, L.flip, 0.2)), flip: fl, tool: L.tool };
  }
  const gp = 9 * opened, cw = bw / 3, ch = bh / 3;
  const pc = (i: number) => ({ x: (i % 3) * cw + ((i % 3) - 1) * gp + cw / 2, y: Math.floor(i / 3) * ch + (Math.floor(i / 3) - 1) * gp + ch / 2 });
  const floodOn = g >= T.f("life") && g < T.f("life+1.0");
  const floods = floodOn ? SOL.map((i, j) => ({ ...pc(i), r: 1300 * k(g, T.s("life") + j * 0.06, 0.45, ARRIVE) })) : [];
  const grey = g >= T.f("life+1.0") ? greyB : greyA;

  // ---- the road (strategy → implementation) ----
  const roadK = k(g, "road+0.15", 0.6, EASE.steady) * (1 - k(g, "gather", 0.5, MOVE));
  const rideK = k(g, "ride", 1.0, LONGS);
  const planK = g < T.f("road") ? 1 : g < T.f("ride") ? 1 - k(g, "road+0.12", 0.42, MOVE) : g < T.f("gather") ? rideK : 1;
  const ghost = on(g, "road", "gather") ? 0.35 * k(g, "road+0.12", 0.3) : 0;

  // ---- KT faces: the founders from "side" until the sign-off ----
  const founders = k(g, "side", 0.45, MOVE) * (1 - k(g, "rest", 0.45, MOVE));
  const ktBehind = g >= T.f("behind0");

  // ---- words ----
  const growIn = k(g, "w:grow-0.1", 0.45);
  const growSink = k(g, "sink", 0.6, SOFT);
  const growOut = k(g, "slide", 0.3, DEPART);
  const whereWords: W[] = [{ t: "Where", at: "w:where-0.08" }, { t: "to", at: "w:to-0.06" }, { t: "start?", at: "w:start-0.06" }];
  const partnerWords: W[] = [{ t: "TECH", at: "w:tech-0.06" }, { t: "PARTNER", at: "w:partner-0.06", under: "w:partner+0.12" }];
  const TP = 96, tpW = widthOf("TECH PARTNER", TP, F.logo, 800, 0.04) + TP * 0.26 - widthOf(" ", TP, F.logo, 800, 0.04);
  const aloneWords: W[] = [{ t: "alone.", at: "alone" }];
  // the end line: "We grow with you." ("grow" is the hook's word, carried in from the lift; the line keeps its slot)
  const EL = { x: 930, y: 400, size: 84 };
  const growSlotX = EL.x + measure("We", EL.size, 700) + EL.size * 0.26;
  const endWords: W[] = [{ t: "We", at: "rest+0.38" }, { t: "grow", at: "rest+0.38", color: "transparent" }, { t: "with", at: "rest+0.5" }, { t: "you.", at: "rest+0.62" }];
  const g2In = k(g, "up-0.1", 0.5), g2Lift = k(g, "up", 0.75, SOFT), g2Set = k(g, "rest-0.05", 0.45, MOVE);
  const g2 = {
    x: lerp(790, growSlotX, g2Set), y: lerp(lerp(452, 312, g2Lift), EL.y, g2Set), size: lerp(190, EL.size, g2Set), weight: lerp(800, 700, g2Set),
  };

  const KTnode = (
    <div data-probe="kt" style={{ position: "absolute", left: 0, top: 0, width: kw, height: kh, transform: `translate(${kx - kw / 2}px, ${ky - kh / 2}px)`, willChange: "transform",
      filter: kw < 900 ? "drop-shadow(0 26px 30px rgba(41,58,81,0.32))" : undefined }}>
      {founders > 0
        ? <Flip3D k={founders} w={kw} h={kh} a={<KTile w={kw} h={kh} rad={krad} L={kL} />} b={<Founders t={t} w={kw} h={kh} radius={krad / kw} />} />
        : <KTile w={kw} h={kh} rad={krad} L={kL} dotFill={g >= T.f("first") && dotOut < 0.05 ? C.cyan : C.white} dotScale={1 + 0.5 * k(g, "first", 0.2) * (1 - dotOut)} />}
    </div>
  );

  return (
    <AbsoluteFill style={{ background: C.canvas }}>
      {/* the reel runs up out of the floor (behind it) through a selector that never settles */}
      {reelA && (
        <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, clipPath: `inset(0 0 ${1080 - REEL_FLOOR}px 0)` }}>
          {Array.from({ length: 16 }, (_, i) => {
            const y = reelY(i, g);
            if (g >= fWhere && breakout.some((q) => q.i === i)) return null;     // broken out: drawn below
            if (y < -240 || y > 1080) return null;
            return (
              <div key={i} data-probe={`reel-${i}`} style={{ position: "absolute", left: 0, top: 0, transform: `translate(${REEL_X}px, ${y}px)`,
                opacity: g >= fWhere ? 1 - k(g, "where", 0.25) : 1, willChange: "transform" }}>
                <ToolFace tool={REEL[i % REEL.length]} w={REEL_TILE} h={REEL_TILE} />
              </div>
            );
          })}
        </div>
      )}

      {/* the floor: two rows of the real tools (two tiles lift out of it for the grip) */}
      {floorA && (
        <>
          <ToolRow tools={ROW1} y={floorY} offset={off1} name="row1" skipIdx={(i) => g >= fNot && gripIdx.includes(i)} />
          <ToolRow tools={ROW2} y={floorY + 220} offset={off2} name="row2" />
        </>
      )}

      {/* the wall: tiles close round the business in pairs, one hole left; they fade back when K.B arrives */}
      {on(g, "close", "field+0.6") && WALL.map((wt, i) => {
        const [tx, ty] = cell(wt.c, wt.r);
        const s = k(g, STEPS[wt.step], wt.hover !== undefined ? 0.34 : 0.42, wt.hover !== undefined ? MOVE : IN);
        const [fx, fy] = wt.hover !== undefined ? HOVER[wt.hover] : wt.from;
        const tool = wt.hover !== undefined ? REEL[breakout[wt.hover]?.i ?? 0] : wt.tool;
        return (
          <div key={i} data-probe={`wall-${i}`} style={{ position: "absolute", left: 0, top: 0, transform: `translate(${lerp(fx, tx, s) - 110}px, ${lerp(fy, ty, s) - 110}px)`, willChange: "transform",
            opacity: wallFade, filter: "drop-shadow(0 16px 22px rgba(41,58,81,0.28))" }}>
            <ToolFace tool={tool} w={220} h={220} />
          </div>
        );
      })}

      {/* the three tiles that broke out of the reel, round the business (where to start?) */}
      {on(g, "where", "close") && breakout.map((q, j) => {
        const sx = REEL_X + REEL_TILE / 2, sy = reelY(q.i, fWhere) + REEL_TILE / 2;
        const m = k(g, `where+${(j * 0.04).toFixed(2)}`, 0.5, MOVE);
        const [hx, hy] = HOVER[hoverOf[j]];
        return (
          <div key={j} data-probe={`hover-${j}`} style={{ position: "absolute", left: 0, top: 0, transform: `translate(${lerp(sx, hx, m) - 110}px, ${lerp(sy, hy, m) - 110}px) scale(${lerp(REEL_TILE / 220, 1, m)})`,
            filter: "drop-shadow(0 16px 22px rgba(41,58,81,0.28))", willChange: "transform" }}>
            <ToolFace tool={REEL[q.i % REEL.length]} w={220} h={220} />
          </div>
        );
      })}
      {/* the selector: fixed on the reel, then hopping from tile to tile without settling */}
      {on(g, "reel", "close+0.1") && (() => {
        const a = seekAt(Math.max(0, hopI - 1)), b = seekAt(hopI);
        const x = hopI === 0 ? a[0] : lerp(a[0], b[0], hopK), y = hopI === 0 ? a[1] : lerp(a[1], b[1], hopK);
        const S = g < fWhere ? 248 : 258;
        return <div data-probe="selector" style={{ position: "absolute", left: 0, top: 0, width: S, height: S, borderRadius: 38, border: `6px solid ${C.cyan}`, boxSizing: "border-box",
          transform: `translate(${x - S / 2}px, ${y - S / 2}px) scale(${lerp(0.92, 1, k(g, "reel+0.1", 0.3))})`, opacity: k(g, "reel+0.1", 0.25) * (1 - k(g, "close", 0.15)) }} />;
      })()}

      {/* the road, under the tiles */}
      {roadK > 0 && (
        <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
          <line x1={360} y1={790} x2={lerp(360, 1580, roadK)} y2={790} stroke={C.cyan} strokeWidth={6} strokeLinecap="round" strokeDasharray="16 14" />
          {g >= T.f("ride") && <line x1={360} y1={790} x2={Math.max(360, Math.min(1580, bx))} y2={790} stroke={C.navy} strokeWidth={8} strokeLinecap="round" />}
          <circle cx={360} cy={790} r={12} fill={C.navy} opacity={roadK} />
          <circle cx={1580} cy={790} r={12} fill={g >= T.f("ride+0.9") ? C.navy : C.cyan} opacity={roadK > 0.95 ? 1 : 0} />
        </svg>
      )}

      {/* KT under the business once it has gone behind */}
      {ktBehind && KTnode}

      {/* the business */}
      {g >= T.f("w:should-0.08") && (
        <Biz t={t} x={bx} y={by} w={bw} h={bh} zoom={bz} grey={grey} open={opened} gap={9} tilt={0} pieces={pieces} flood={floods} plan={planK} planGhost={ghost}
          radius={0.09 * (1 - opened)} backing={on(g, "bring", "life+1.0")} logo={0.6}
          lens={g >= T.f("lens") && g < T.f("open3+0.35") ? { x: lensLocal.x, y: lensLocal.y, r: lerp(28, 180, lensK) * (1 - lensBack) + 26 * lensBack, k: lensK * (1 - lensBack) } : undefined} />
      )}

      {/* the flow between the three solutions (stopping short of each logo), and the pulse that brings them to life */}
      {on(g, "flow", "life+0.5") && (() => {
        const ox = bx - bw / 2, oy = by - bh / 2, rl = 0.6 * Math.min(cw, ch) / 2 + 22;
        const pts = SOL.map((i) => pc(i)).map((p) => ({ x: ox + p.x, y: oy + p.y }));
        const segs = [[pts[0], pts[1]], [pts[1], pts[2]]].map(([a, b]) => {
          const L = Math.hypot(b.x - a.x, b.y - a.y), ux = (b.x - a.x) / L, uy = (b.y - a.y) / L;
          return { a: { x: a.x + ux * rl, y: a.y + uy * rl }, b: { x: b.x - ux * rl, y: b.y - uy * rl }, l: Math.max(1, L - 2 * rl) };
        });
        const draw = k(g, "flow", 0.5, EASE.steady);
        const pulse = k(g, "life-0.4", 0.4, EASE.steady) * (segs[0].l + segs[1].l);
        const P = pulse < segs[0].l ? { s: segs[0], u: pulse / segs[0].l } : { s: segs[1], u: (pulse - segs[0].l) / segs[1].l };
        return (
          <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, opacity: 1 - k(g, "life+0.35", 0.1) }}>
            {segs.map((q, i) => {
              const dk = clamp01(draw * 2 - i);
              return <line key={i} x1={q.a.x} y1={q.a.y} x2={lerp(q.a.x, q.b.x, dk)} y2={lerp(q.a.y, q.b.y, dk)} stroke={C.cyan} strokeWidth={7} strokeLinecap="round" strokeDasharray="2 20" opacity={dk > 0 ? 1 : 0} />;
            })}
            {g >= T.f("life-0.4") && pulse < segs[0].l + segs[1].l && (
              <circle cx={lerp(P.s.a.x, P.s.b.x, P.u)} cy={lerp(P.s.a.y, P.s.b.y, P.u)} r={16 * clamp01((g - T.f("life-0.4") + 1) / 4)} fill={C.cyan} />
            )}
          </svg>
        );
      })()}

      {/* the dot: out of the period, onto the business (becomes the lens); then onto the first part; later, home again */}
      {on(g, "first+0.22", "lens+0.05") && (
        <div data-probe="dot" style={{ position: "absolute", left: 0, top: 0, width: 56, height: 56, borderRadius: "50%", background: C.cyan,
          transform: `translate(${lerp(pk.x, bx - bw / 2 + 230, dotOut) - 28}px, ${lerp(pk.y, by - bh / 2 + 250, dotOut) - 28}px)` }} />
      )}
      {on(g, "open3+0.3", "ring1+0.2") && (() => {
        const p1 = pc(1), tx = bx - bw / 2 + p1.x, ty = by - bh / 2 + p1.y;
        const drift = clamp01((g - T.f("open3+0.3")) / Math.max(1, T.f("ring1-0.12") - T.f("open3+0.3")));
        const sx = lerp(bx, lerp(bx, tx, 0.55), drift), sy = lerp(by, lerp(by, ty, 0.55), drift);
        const h = k(g, "ring1-0.12", 0.24, MOVE);
        return <div data-probe="dot2" style={{ position: "absolute", left: 0, top: 0, width: 52, height: 52, borderRadius: "50%", background: C.cyan, opacity: 1 - k(g, "ring1", 0.15),
          transform: `translate(${lerp(sx, tx, h) - 26}px, ${lerp(sy, ty, h) - 26}px)` }} />;
      })()}
      {on(g, "life+0.62", "life+1.1") && (
        <div data-probe="dot3" style={{ position: "absolute", left: 0, top: 0, width: 40, height: 40, borderRadius: "50%", background: C.cyan, opacity: 1 - k(g, "life+1.0", 0.1),
          transform: `translate(${lerp(bx - bw / 2 + pc(7).x, pk.x, dotHome) - 20}px, ${lerp(by - bh / 2 + pc(7).y, pk.y, dotHome) - 20}px) scale(${lerp(1, 0.6, dotHome)})` }} />
      )}
      {on(g, "road", "gather+0.4") && <Line g={g} words={[{ t: "Strategy", at: "w:strategy-0.08" }]} x={360} y={826} size={64} weight={700} color={C.navy} out="gather" style={{ willChange: "transform" }} />}
      {on(g, "ride", "gather+0.4") && <Line g={g} words={[{ t: "Implementation", at: "w:implementation+0.25" }]} x={1580 - measure("Implementation", 64, 700)} y={826} size={64} weight={700} color={C.navy} out="gather" style={{ willChange: "transform" }} />}

      {/* the grip */}
      {gripOn && gripIdx.map((ri, j) => {
        const sx = rowX(ri, offNot, ROW1.length) + 100;
        const corner = j === 0 ? bx - bw / 2 + 40 : bx + bw / 2 - 40;
        const x = lerp(sx, corner, gripRise);
        const top = floorTop1 - 150 * gripRise + 520 * gripOut;
        return (
          <div key={j} data-probe={`grip${j}`} style={{ position: "absolute", left: 0, top: 0, transform: `translate(${x - 100}px, ${top}px)`,
            opacity: 1 - gripOut, filter: "drop-shadow(0 16px 22px rgba(41,58,81,0.35))", willChange: "transform" }}>
            {gripTurn > 0
              ? <Flip3D k={gripTurn} w={200} h={200} a={<ToolFace tool={ROW1[ri % ROW1.length]} w={200} h={200} />} b={<div style={{ width: 200, height: 200, borderRadius: R.tile, background: C.navy }} />} />
              : <ToolFace tool={ROW1[ri % ROW1.length]} w={200} h={200} />}
          </div>
        );
      })}

      {/* the treadmill: the opening's floor returns under the business ("technology alone") */}
      {tmA && (
        <>
          <ToolRow tools={ROW1} y={tmY} offset={tmOff} name="tm1" skip={(x) => x < tmEdge} />
          <ToolRow tools={ROW2} y={tmY + 220} offset={tmOff * 0.8 + 90} name="tm2" skip={(x) => x < tmEdge + 120} />
        </>
      )}

      {/* the note: advice handed over across the gap */}
      {on(g, "note", "dock+0.6") && (() => {
        const m = k(g, "note", 0.55, LONGS), d = k(g, "dock+0.05", 0.45, DEPART);
        return (
          <div data-probe="note" style={{ position: "absolute", left: 0, top: 0, transform: `translate(${lerp(300, 760, m) - 180}px, ${lerp(300, 700, m) - 126 + 520 * d}px) rotate(${lerp(0, -5, m) - 10 * d}deg)`, willChange: "transform" }}>
            <Note w={360} />
          </div>
        );
      })()}

      {/* KT above everything until it goes behind */}
      {!ktBehind && g >= T.f("kb") && KTnode}

      {/* words */}
      {on(g, "w:grow-0.12", "slide+0.4") && (
        <div data-probe="grow" style={{ position: "absolute", left: 0, top: 0, transform: `translate(${1040}px, ${lerp(220, 175, growIn) + 300 * growSink}px)`, willChange: "transform" }}>
          <div style={{ fontFamily: F.sans, fontWeight: 800, fontSize: 190, letterSpacing: "-0.045em", lineHeight: 1, color: growSink > 0 ? `rgb(${lerp(41, 111, growSink)},${lerp(58, 123, growSink)},${lerp(81, 138, growSink)})` : C.navy,
            opacity: clamp01(growIn * 1.6) * (1 - growOut), transform: `translateY(${(1 - growIn) * 60 - growOut * 50}px)`, filter: growIn < 1 || growOut > 0 ? `blur(${(1 - growIn) * 10 + growOut * 10}px)` : undefined }}>grow</div>
        </div>
      )}
      {on(g, "where-0.2", "close+0.4") && <Line g={g} words={whereWords} x={1010} y={92} size={96} weight={700} color={C.navy} out="close" split style={{ willChange: "transform" }} />}
      {on(g, "w:tech-0.2", "first+0.3") && <Line g={g} words={partnerWords} x={948 - tpW / 2} y={800} size={TP} weight={800} color={C.navy} out="w:partner+0.61" ls={0.04}
        style={{ fontFamily: F.logo, willChange: "transform" }} />}
      {on(g, "alone-0.1", "drop+0.3") && <Line g={g} words={aloneWords} x={190} y={330} size={210} weight={800} color={C.navy} out="w:it2+0.02" split style={{ willChange: "transform" }} />}

      {/* "grow" returns at the hook's size, rises with the lift, and settles into the end line */}
      {g >= T.f("up-0.1") && (
        <div data-probe="grow2" style={{ position: "absolute", left: 0, top: 0, transform: `translate(${g2.x}px, ${g2.y}px)`, willChange: "transform" }}>
          <div style={{ clipPath: g2In < 1 ? `inset(-60px -60px ${-0.3 * g2.size}px -60px)` : undefined }}>
            <div style={{ fontFamily: F.sans, fontWeight: g2.weight, fontSize: g2.size, letterSpacing: "-0.045em", lineHeight: 1, color: C.navy, whiteSpace: "nowrap",
              transform: `translateY(${(1 - g2In) * g2.size * 1.35}px)` }}>grow</div>
          </div>
          <div style={{ position: "absolute", left: 0, top: g2.size * 1.02, height: 7, width: measure("grow", EL.size, 700), borderRadius: 9, background: C.cyan,
            transformOrigin: "0 50%", transform: `scaleX(${k(g, "rest+0.45", 0.3, MOVE)})` }} />
        </div>
      )}
      {g >= T.f("rest") && <Line g={g} words={endWords} x={EL.x} y={EL.y} size={EL.size} weight={700} color={C.navy} style={{ willChange: "transform" }} />}
      {g >= T.f("rest+0.2") && <Line g={g} words={[{ t: "K.B", at: "rest+0.2" }, { t: "TECH", at: "rest+0.26" }, { t: "PARTNER", at: "rest+0.32" }]} x={EL.x + 2} y={EL.y - 74} size={40} weight={800} color={C.navy} ls={0.04}
        style={{ fontFamily: F.logo, willChange: "transform" }} />}
      {g >= T.f("rest+0.7") && (() => {
        const b = k(g, "rest+0.7", 0.5);
        return (
          <div data-probe="cta" style={{ position: "absolute", left: 0, top: 0, transform: `translate(${EL.x}px, ${lerp(580, 540, b)}px)`, opacity: clamp01(b * 1.5) }}>
            <div style={{ padding: "30px 52px 31px", borderRadius: R.pill, background: C.cyan, fontFamily: F.sans, fontWeight: 600, fontSize: 48, color: C.ink, letterSpacing: "-0.015em", whiteSpace: "nowrap" }}>
              Book a Free Discovery Call
            </div>
          </div>
        );
      })()}
    </AbsoluteFill>
  );
};
