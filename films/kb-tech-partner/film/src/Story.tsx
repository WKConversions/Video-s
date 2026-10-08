// The stage: one continuous world in which three objects persist and change (storyboard/plan.md):
//   BT  the business (one clip in a tile): lands, grows, is held back, waits, is understood, opened, fixed, rides, grows
//   KT  the K.B tile: comes in, becomes the field, stands beside, sends the dot, rides alongside, turns to the founders,
//       goes behind, rises behind, turns back to the logo
//   the tools: the floor, the reel, the wall, the three solutions, the treadmill
// Every move is keyed to a label of src/clock.ts (the voice's words), never to a frame number.
import React from "react";
import { AbsoluteFill } from "remotion";
import { T } from "./clock";
import { EASE, Line, W, track } from "./kinetic";
import { ARRIVE, C, DEPART, F, MOVE, R, SOFT, clamp01, lerp } from "./lib";
import { Biz, Flip3D, Founders, Note, Piece, ToolFace, ToolRow, travelled } from "./parts";

const LONGS = EASE.longS;
const k = (g: number, pos: string | number, dur: number, ease = ARRIVE) => T.k(g, pos, dur, ease);
const on = (g: number, a: string, b?: string) => g >= T.f(a) && (b === undefined || g < T.f(b));

const ROW1 = ["make", "n8n", "supabase", "claude", "next", "pipedrive", "odoo", "postgres", "ts", "resend", "vite", "tanstack"];
const ROW2 = ["odoo", "spring", "payload", "make", "datadog", "next", "apollo", "claude", "zenchef", "supabase", "n8n", "pipedrive"];
const REEL = ["claude", "supabase", "pipedrive", "n8n", "odoo", "make", "next", "postgres", "resend", "ts", "vite", "tanstack", "payload", "spring"];

// ---- the business: x, y, w, h, zoom -------------------------------------------------------------------------------
const btTrack = (g: number) => track(g, [
  ["open", 720, -420, 440, 440, 1.5],
  ["w:should-0.06", 720, -420, 440, 440, 1.5],
  ["land", 720, 480, 440, 440, 1.5, ARRIVE],
  ["lift", 720, 480, 440, 440, 1.5],
  ["lift+0.62", 720, 345, 510, 510, 1.5, LONGS],
  ["sink", 720, 345, 510, 510, 1.5],
  ["sink+0.6", 720, 610, 460, 460, 1.5, SOFT],
  ["slide", 720, 610, 460, 460, 1.5],
  ["slide+0.5", 520, 610, 460, 460, 1.5, MOVE],
  ["where", 520, 610, 460, 460, 1.5],
  ["where+0.55", 760, 540, 480, 480, 1.5, MOVE],
  ["field+0.48", 760, 540, 480, 480, 1.5],
  ["field+0.5", 1340, 560, 760, 760, 1.5],                     // under the field, unseen: waits at right
  ["first", 1340, 560, 760, 760, 1.5],
  ["first+0.6", 1150, 540, 900, 900, 1.5, MOVE],
  ["open3", 1150, 540, 900, 900, 1.5],
  ["open3+0.62", 980, 540, 1480, 820, 1.22, LONGS],
  ["bring", 980, 540, 1480, 820, 1.22],
  ["bring+0.55", 1080, 540, 840, 840, 1.5, MOVE],
  ["life", 1080, 540, 840, 840, 1.5],
  ["life+0.5", 1080, 480, 840, 840, 1.5, ARRIVE],
  ["road", 1080, 480, 840, 840, 1.5],
  ["road+0.6", 560, 520, 380, 380, 1.5, MOVE],
  ["ride", 560, 520, 380, 380, 1.5],
  ["ride+1.0", 1380, 520, 380, 380, 1.5, LONGS],
  ["gather", 1380, 520, 380, 380, 1.5],
  ["gather+0.65", 1280, 540, 620, 620, 1.5, MOVE],
  ["behind0", 1280, 540, 620, 620, 1.5],
  ["behind0+0.7", 1180, 520, 680, 680, 1.5, MOVE],
  ["rise", 1180, 520, 680, 680, 1.5],
  ["rise+0.5", 1180, 420, 680, 680, 1.5, ARRIVE],
  ["floorIn", 1180, 420, 680, 680, 1.5],
  ["floorIn+0.6", 1180, 520, 680, 680, 1.5, SOFT],
  ["partner", 1180, 520, 680, 680, 1.5],
  ["partner+0.7", 800, 960, 380, 380, 1.5, LONGS],
  ["up", 800, 960, 380, 380, 1.5],
  ["up+0.75", 800, 760, 380, 380, 1.5, ARRIVE],
]);

// ---- the K.B tile: x, y, w, h, radius, letters ---------------------------------------------------------------------
const ktTrack = (g: number) => track(g, [
  ["open", 2320, 420, 220, 220, 16, 220],
  ["kb", 2320, 420, 220, 220, 16, 220],
  ["kb+0.45", 1120, 420, 220, 220, 16, 220, ARRIVE],
  ["field", 1120, 420, 220, 220, 16, 220],
  ["field+0.55", 960, 540, 2000, 1160, 0, 1045, LONGS],
  ["fold", 960, 540, 2000, 1160, 0, 1130],                     // the letters keep growing under the voice
  ["fold+0.5", 420, 360, 360, 360, 27, 360, LONGS],
  ["dock", 420, 360, 360, 360, 27, 360],
  ["dock+0.6", 756, 360, 360, 360, 27, 360, LONGS],
  ["first", 756, 360, 360, 360, 27, 360],
  ["first+0.6", 556, 210, 240, 240, 18, 240, MOVE],
  ["open3", 556, 210, 240, 240, 18, 240],
  ["open3+0.6", 112, 540, 150, 150, 11, 150, MOVE],
  ["bring", 112, 540, 150, 150, 11, 150],
  ["bring+0.55", 516, 240, 240, 240, 18, 240, MOVE],
  ["road", 516, 240, 240, 240, 18, 240],
  ["road+0.6", 272, 410, 160, 160, 12, 160, MOVE],
  ["ride", 272, 410, 160, 160, 12, 160],
  ["ride+1.0", 1092, 410, 160, 160, 12, 160, LONGS],
  ["gather", 1092, 410, 160, 160, 12, 160],
  ["gather+0.65", 640, 540, 620, 620, 46, 620, MOVE],
  ["behind0", 640, 540, 620, 620, 46, 620],
  ["behind0+0.7", 1232, 466, 680, 680, 50, 680, MOVE],
  ["rise", 1232, 466, 680, 680, 50, 680],
  ["rise+0.5", 1232, 366, 680, 680, 50, 680, ARRIVE],
  ["floorIn", 1232, 366, 680, 680, 50, 680],
  ["floorIn+0.6", 1232, 466, 680, 680, 50, 680, SOFT],
  ["partner", 1232, 466, 680, 680, 50, 680],
  ["partner+0.7", 570, 600, 520, 520, 38, 520, LONGS],
  ["up", 570, 600, 520, 520, 38, 520],
  ["up+0.75", 570, 400, 520, 520, 38, 520, ARRIVE],
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

export const Story: React.FC<{ g: number }> = ({ g }) => {
  const t = g / 30;
  const [bx, by, bw, bh, bz] = btTrack(g);
  const [kx, ky, kw, kh, krad, kL] = ktTrack(g);

  // grey: held back from "back" until the colour comes back on "life"
  const grey = clamp01(k(g, "sink", 0.5, SOFT)) * (g < T.f("life") + 30 ? 1 : 0);
  const opened = k(g, "open3", 0.62, LONGS) * (1 - k(g, "bring", 0.55, MOVE));

  // ---- the floor (hook) and the treadmill (close) ----
  const floorTop1 = g < T.f("land") ? lerp(330, 700, k(g, "w:should-0.1", 0.62, MOVE)) : by + bh / 2;   // the business stands on it
  const floorA = g < T.f("where") + 20;
  const floorY = lerp(on(g, "open", "slide") ? floorTop1 : 840, 1250, k(g, "where-0.05", 0.55, DEPART));
  const off1 = travelled(g, [[0, 115], [45, 115], [T.f("w:hold"), 95], [T.f("sink+0.6"), 60]]);
  const off2 = travelled(g, [[0, 90], [45, 90], [T.f("w:hold"), 75], [T.f("sink+0.6"), 45]]);
  const tmA = g >= T.f("floorIn") - 2;
  const tmEdge = lerp(1960, -300, k(g, "floorIn", 0.65, SOFT));
  const tmY = 860 + 400 * k(g, "drop", 0.55, DEPART);
  const tmOff = 95 * t;

  // ---- grip tiles (on "hold": they turn their blank backs over the business's foot) ----
  const gripK = k(g, "grip", 0.32);
  const gripOut = k(g, "slide", 0.35, DEPART);

  // ---- the reel (finding the right solutions) ----
  const reelOff = travelled(g, [[T.f("reel") - 1, 0], [T.f("reel") + 9, 300], [T.f("slow"), 300], [T.f("slow") + 12, 45], [T.f("slow") + 20, 45], [T.f("slow") + 32, 240]]);
  const reelA = on(g, "reel", "close");
  const fWhere = T.f("where");
  const reelAt = (i: number, gg: number) => 840 + i * 220 - travelled(gg, [[T.f("reel") - 1, 0], [T.f("reel") + 9, 300], [T.f("slow"), 300], [T.f("slow") + 12, 45], [T.f("slow") + 20, 45], [T.f("slow") + 32, 240]]);
  // the three tiles nearest the selector when the reel breaks, and where they land around the business
  const breakY = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => ({ i, y: reelAt(i, fWhere) })).filter((q) => q.y > 160 && q.y < 760).sort((a, b) => Math.abs(a.y - 300) - Math.abs(b.y - 300)).slice(0, 3);
  const HOVER = [[430, 210], [1220, 480], [1040, 880]];               // around the business (760, 540)
  const hop = [T.f("where+0.12"), T.f("where+0.38"), T.f("where+0.62"), T.f("where+0.86")];
  const hopI = hop.filter((f) => g >= f).length;
  const hopTo = [0, 1, 2, 0][Math.max(0, hopI - 1)];
  const hopFrom = [0, 0, 1, 2][Math.max(0, hopI - 1)];
  const hopK = hopI > 0 ? EASE.lead(clamp01((g - hop[hopI - 1]) / 9)) : 0;

  // ---- the wall (isn't always easy): 4×4 cells round the business, one hole ----
  const WC = { x: 760, y: 540 }, CELL = 240;
  const cell = (c: number, r: number) => [WC.x + (c - 1.5) * CELL, WC.y + (r - 1.5) * CELL];
  const WALL: { c: number; r: number; from: [number, number]; step: number; tool: string; hover?: number }[] = [
    { c: 0, r: 0, from: [0, 0], step: 0, tool: "claude", hover: 0 },
    { c: 3, r: 2, from: [0, 0], step: 0, tool: "supabase", hover: 1 },
    { c: 2, r: 3, from: [0, 0], step: 1, tool: "pipedrive", hover: 2 },
    { c: 1, r: 0, from: [640, -420], step: 1, tool: "next" },
    { c: 0, r: 1, from: [-420, 420], step: 2, tool: "odoo" },
    { c: 3, r: 3, from: [2360, 900], step: 2, tool: "make" },
    { c: 2, r: 0, from: [880, -420], step: 3, tool: "n8n" },
    { c: 0, r: 2, from: [-420, 660], step: 3, tool: "postgres" },
    { c: 3, r: 0, from: [1120, -420], step: 4, tool: "resend" },
    { c: 1, r: 3, from: [640, 1500], step: 4, tool: "ts" },
    { c: 0, r: 3, from: [-420, 900], step: 5, tool: "vite" },
  ];
  const STEPS = ["close", "close+0.17", "w:always-0.04", "w:always+0.14", "w:easy-0.06", "w:easy+0.1"];

  // ---- the dot and the lens (understand), the rings (identify) ----
  const pk = { x: kx - kw / 2 + DOT.x * kw, y: ky - kh / 2 + DOT.y * kh };   // KT's period, on screen
  const dotOut = k(g, "first+0.22", 0.45, MOVE);
  const lensK = k(g, "lens", 0.3);
  const lensGlide = k(g, "lens+0.2", 0.85, LONGS);
  const lensBack = k(g, "open3", 0.35, MOVE);
  const lensLocal = { x: lerp(230, 640, lensGlide), y: lerp(250, 560, lensGlide) };
  const dotHome = k(g, "life+0.1", 0.45, MOVE);

  // ---- pieces: rings, labels, flips ----
  const LAB: Record<number, { label: string; tool: string; at: string }> = {
    1: { label: "Excel files", tool: "make", at: "ring1" },
    5: { label: "CRM updates", tool: "n8n", at: "ring2" },
    6: { label: "Follow-ups", tool: "claude", at: "ring2+0.1" },
  };
  const flipAt: Record<number, string> = { 1: "flip", 5: "flip+0.1", 6: "flip+0.2" };
  const backAt: Record<number, string> = { 1: "life+0.12", 5: "life+0.2", 6: "life+0.28" };
  const pieces: Record<number, Piece> = {};
  const dimK = k(g, "ring1", 0.35) * (1 - k(g, "bring", 0.4, MOVE));
  for (let i = 0; i < 9; i++) {
    const L = LAB[i];
    if (!L) { pieces[i] = { dim: dimK }; continue; }
    const rk = k(g, L.at, 0.3);
    const fl = k(g, flipAt[i], 0.42, MOVE) * (1 - k(g, backAt[i], 0.42, MOVE));
    pieces[i] = { ring: rk * (1 - k(g, "bring", 0.3)), lift: rk * (1 - k(g, "bring", 0.45, MOVE)), label: L.label, labelK: k(g, T.s(L.at) + 0.08, 0.35) * (1 - k(g, flipAt[i], 0.2)), flip: fl, tool: L.tool };
  }
  const cw = bw / 3, ch = bh / 3, gp = 22 * opened;
  const pc = (i: number) => ({ x: (i % 3) * cw + ((i % 3) - 1) * gp + cw / 2, y: Math.floor(i / 3) * ch + (Math.floor(i / 3) - 1) * gp + ch / 2 });
  const floods = g >= T.f("life") && g < T.f("life+1.1")
    ? [1, 5, 6].map((i, j) => ({ ...pc(i), r: 1400 * k(g, `life+${(0.12 + j * 0.08).toFixed(2)}`, 0.8, EASE.steady) }))
    : [];
  const greyNow = g >= T.f("life+1.1") ? 0 : grey;

  // ---- the road (strategy → implementation) ----
  const roadK = k(g, "road+0.15", 0.6, EASE.steady) * (1 - k(g, "gather", 0.5, MOVE));
  const rideK = k(g, "ride", 1.0, LONGS);
  const planK = g < T.f("road") ? 1 : g < T.f("ride") ? 1 - k(g, "road+0.12", 0.42, MOVE) : g < T.f("gather") ? rideK : 1;

  // ---- KT faces: the founders from "side" to the sign-off ----
  const founders = k(g, "side", 0.45, MOVE) * (1 - k(g, "rest-0.05", 0.45, MOVE));
  const ktBehind = g >= T.f("behind0");

  // ---- words ----
  const growIn = k(g, "w:grow-0.1", 0.45);
  const growSink = k(g, "sink", 0.6);
  const growOut = k(g, "slide", 0.3, DEPART);
  const whereWords: W[] = [{ t: "Where", at: "w:where-0.08" }, { t: "to", at: "w:to-0.06" }, { t: "start?", at: "w:start-0.06" }];
  const partnerWords: W[] = [{ t: "TECH", at: "w:tech-0.06" }, { t: "PARTNER", at: "w:partner-0.06", under: "w:partner+0.12" }];
  const aloneWords: W[] = [{ t: "alone.", at: "alone" }];
  const endWords: W[] = [{ t: "We", at: "rest+0.05" }, { t: "grow", at: "up-0.1", color: C.navy }, { t: "with", at: "rest+0.2" }, { t: "you.", at: "rest+0.32" }];

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
      {/* the reel rises out of the floor (behind it) */}
      {reelA && (
        <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, clipPath: "inset(60px 0 240px 0)" }}>
          {Array.from({ length: 14 }, (_, i) => {
            const y = 840 + i * 220 - reelOff;
            const bi = breakY.findIndex((q) => q.i === i);
            if (g >= fWhere && bi >= 0) return null;                    // broken out of the reel: drawn below
            if (y < -240 || y > 1080) return null;
            return (
              <div key={i} data-probe={`reel-${i}`} style={{ position: "absolute", left: 0, top: 0, transform: `translate(1200px, ${y}px)`, opacity: g >= fWhere ? 1 - k(g, "where", 0.3) : 1, willChange: "transform" }}>
                <ToolFace tool={REEL[i % REEL.length]} w={200} h={200} />
              </div>
            );
          })}
        </div>
      )}
      {reelA && g < fWhere + 2 && (
        <div data-probe="selector" style={{ position: "absolute", left: 0, top: 0, width: 240, height: 240, borderRadius: 36, border: `6px solid ${C.cyan}`, boxSizing: "border-box",
          transform: `translate(1180px, 560px) scale(${lerp(0.9, 1, k(g, "reel+0.12", 0.3))})`, opacity: k(g, "reel+0.12", 0.25) }} />
      )}

      {/* the floor: two rows of the real tools */}
      {floorA && (
        <>
          <ToolRow tools={ROW1} y={floorY} offset={off1 + 40} name="row1" />
          <ToolRow tools={ROW2} y={floorY + 220} offset={off2 + 150} name="row2" />
        </>
      )}

      {/* the wall: tiles close round the business in pairs, one hole left */}
      {on(g, "close", "field+0.6") && WALL.map((wt, i) => {
        const [tx, ty] = cell(wt.c, wt.r);
        const s = k(g, STEPS[wt.step], 0.32, wt.hover !== undefined ? MOVE : ARRIVE);
        let fx = wt.from[0], fy = wt.from[1];
        if (wt.hover !== undefined) { fx = HOVER[wt.hover][0]; fy = HOVER[wt.hover][1]; }
        return (
          <div key={i} data-probe={`wall-${i}`} style={{ position: "absolute", left: 0, top: 0, transform: `translate(${lerp(fx, tx, s) - 110}px, ${lerp(fy, ty, s) - 110}px)`, willChange: "transform",
            filter: "drop-shadow(0 16px 22px rgba(41,58,81,0.28))" }}>
            <ToolFace tool={wt.tool} w={220} h={220} />
          </div>
        );
      })}

      {/* the three tiles that broke out of the reel, hovering round the business (where to start?) */}
      {on(g, "where", "close") && breakY.map((q, j) => {
        const sx = 1300, sy = reelAt(q.i, fWhere) + 100;
        const m = k(g, `where+${(j * 0.05).toFixed(2)}`, 0.5, LONGS);
        return (
          <div key={j} data-probe={`hover-${j}`} style={{ position: "absolute", left: 0, top: 0, transform: `translate(${lerp(sx, HOVER[j][0], m) - 110}px, ${lerp(sy, HOVER[j][1], m) - 110}px) scale(${lerp(200 / 220, 1, m)})`,
            filter: "drop-shadow(0 16px 22px rgba(41,58,81,0.28))", willChange: "transform" }}>
            <ToolFace tool={REEL[q.i % REEL.length]} w={220} h={220} />
          </div>
        );
      })}
      {on(g, "where+0.1", "close+0.1") && (() => {
        const a = HOVER[hopFrom], b = HOVER[hopTo];
        const x = lerp(a[0], b[0], hopK), y = lerp(a[1], b[1], hopK);
        return <div data-probe="seeker" style={{ position: "absolute", left: 0, top: 0, width: 262, height: 262, borderRadius: 40, border: `6px solid ${C.cyan}`, boxSizing: "border-box",
          transform: `translate(${x - 131}px, ${y - 131}px)`, opacity: k(g, "where+0.1", 0.2) * (1 - k(g, "close", 0.15)) }} />;
      })()}

      {/* KT under the business once it has gone behind */}
      {ktBehind && KTnode}

      {/* the business */}
      {g >= T.f("w:should-0.08") && (
        <Biz t={t} x={bx} y={by} w={bw} h={bh} zoom={bz} grey={greyNow} open={opened} pieces={pieces} flood={floods} plan={planK} radius={0.09}
          lens={g >= T.f("lens") && g < T.f("open3+0.35") ? { x: lensLocal.x, y: lensLocal.y, r: lerp(28, 180, lensK) * (1 - lensBack) + 26 * lensBack, k: lensK * (1 - lensBack) } : undefined} />
      )}

      {/* the flow between the three solutions, and the pulse that brings them to life */}
      {on(g, "flow", "life+0.9") && (() => {
        const ox = bx - bw / 2, oy = by - bh / 2;
        const pts = [1, 5, 6].map((i) => pc(i)).map((p) => ({ x: ox + p.x, y: oy + p.y }));
        const d = `M ${pts[0].x} ${pts[0].y} L ${pts[1].x} ${pts[1].y} L ${pts[2].x} ${pts[2].y}`;
        const len = Math.hypot(pts[1].x - pts[0].x, pts[1].y - pts[0].y) + Math.hypot(pts[2].x - pts[1].x, pts[2].y - pts[1].y);
        const draw = k(g, "flow", 0.5, EASE.steady);
        const pulse = k(g, "life-0.25", 0.4, EASE.steady);
        const a = pulse * len, l1 = Math.hypot(pts[1].x - pts[0].x, pts[1].y - pts[0].y);
        const P = a < l1 ? { x: lerp(pts[0].x, pts[1].x, a / l1), y: lerp(pts[0].y, pts[1].y, a / l1) } : { x: lerp(pts[1].x, pts[2].x, (a - l1) / (len - l1)), y: lerp(pts[1].y, pts[2].y, (a - l1) / (len - l1)) };
        const fade = 1 - k(g, "life+0.4", 0.4);
        return (
          <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, opacity: fade }}>
            <path d={d} fill="none" stroke={C.cyan} strokeWidth={7} strokeLinecap="round" strokeDasharray={`${draw * len} ${len}`} opacity={0.35} />
            <path d={d} fill="none" stroke={C.cyan} strokeWidth={7} strokeLinecap="round" strokeDasharray="2 20" style={{ clipPath: undefined }} opacity={draw} />
            {g >= T.f("life-0.25") && pulse < 1 && <circle cx={P.x} cy={P.y} r={16} fill={C.cyan} />}
          </svg>
        );
      })()}

      {/* the dot: out of the period, onto the business (becomes the lens); later, home again */}
      {on(g, "first+0.22", "lens+0.05") && (
        <div data-probe="dot" style={{ position: "absolute", left: 0, top: 0, width: 56, height: 56, borderRadius: "50%", background: C.cyan,
          transform: `translate(${lerp(pk.x, bx - bw / 2 + 230, dotOut) - 28}px, ${lerp(pk.y, by - bh / 2 + 250, dotOut) - 28}px)` }} />
      )}
      {on(g, "open3+0.3", "ring1+0.2") && (
        <div data-probe="dot2" style={{ position: "absolute", left: 0, top: 0, width: 52, height: 52, borderRadius: "50%", background: C.cyan, opacity: 1 - k(g, "ring1", 0.15),
          transform: `translate(${lerp(bx, bx - bw / 2 + pc(1).x, k(g, "ring1-0.12", 0.2, EASE.lead)) - 26}px, ${lerp(by, by - bh / 2 + pc(1).y, k(g, "ring1-0.12", 0.2, EASE.lead)) - 26}px)` }} />
      )}
      {on(g, "life+0.1", "life+0.6") && (
        <div data-probe="dot3" style={{ position: "absolute", left: 0, top: 0, width: 40, height: 40, borderRadius: "50%", background: C.cyan, opacity: 1 - k(g, "life+0.48", 0.1),
          transform: `translate(${lerp(bx - bw / 2 + pc(6).x, pk.x, dotHome) - 20}px, ${lerp(by - bh / 2 + pc(6).y, pk.y, dotHome) - 20}px) scale(${lerp(1, 0.6, dotHome)})` }} />
      )}

      {/* the road */}
      {roadK > 0 && (
        <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
          <line x1={370} y1={762} x2={lerp(370, 1570, roadK)} y2={762} stroke={C.cyan} strokeWidth={6} strokeLinecap="round" strokeDasharray="16 14" />
          <line x1={370} y1={762} x2={lerp(370, Math.max(370, bx), g >= T.f("ride") ? 1 : 0) * 1} y2={762} stroke={C.navy} strokeWidth={8} strokeLinecap="round" opacity={g >= T.f("ride") ? 1 : 0} />
          <circle cx={370} cy={762} r={12} fill={C.navy} opacity={roadK} />
          <circle cx={1570} cy={762} r={12} fill={g >= T.f("ride+0.9") ? C.navy : C.cyan} opacity={roadK > 0.95 ? 1 : 0} />
        </svg>
      )}
      {on(g, "road", "gather+0.4") && <Line g={g} words={[{ t: "Strategy", at: "w:strategy-0.08" }]} x={370} y={800} size={54} weight={700} color={C.navy} out="gather" style={{ willChange: "transform" }} />}
      {on(g, "ride", "gather+0.4") && <Line g={g} words={[{ t: "Implementation", at: "w:implementation+0.25" }]} x={1570 - 470} y={800} size={54} weight={700} color={C.navy} out="gather" style={{ willChange: "transform" }} />}

      {/* the grip: two tiles slide in along the floor and clamp the business's feet, turning their blank backs */}
      {on(g, "grip-0.02", "slide+0.4") && [-1, 1].map((s) => {
        const x = bx + s * lerp(bw / 2 + 330, bw / 2 - 30, gripK);
        return (
          <div key={s} data-probe={`grip${s}`} style={{ position: "absolute", left: 0, top: 0, transform: `translate(${x - 90}px, ${floorTop1 - 180 + 520 * gripOut}px)`,
            opacity: clamp01(gripK * 3) * (1 - gripOut), filter: "drop-shadow(0 16px 22px rgba(41,58,81,0.35))", willChange: "transform" }}>
            <Flip3D k={gripK} w={180} h={180} a={<ToolFace tool={s < 0 ? "odoo" : "n8n"} w={180} h={180} />} b={<div style={{ width: 180, height: 180, borderRadius: R.tile, background: C.navy }} />} />
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
          <div data-probe="note" style={{ position: "absolute", left: 0, top: 0, transform: `translate(${lerp(420, 1010, m) - 180}px, ${lerp(380, 770, m) - 126 + 520 * d}px) rotate(${lerp(0, -5, m) - 10 * d}deg)`, willChange: "transform" }}>
            <Note w={360} />
          </div>
        );
      })()}

      {/* KT above everything until it goes behind */}
      {!ktBehind && g >= T.f("kb") && KTnode}

      {/* words */}
      {on(g, "w:grow-0.12", "slide+0.4") && (
        <div data-probe="grow" style={{ position: "absolute", left: 0, top: 0, transform: `translate(${1040}px, ${lerp(220, 175, growIn) + 300 * growSink}px)` }}>
          <div style={{ fontFamily: F.sans, fontWeight: 800, fontSize: 190, letterSpacing: "-0.045em", lineHeight: 1, color: growSink > 0 ? `rgb(${lerp(41, 160, growSink)},${lerp(58, 168, growSink)},${lerp(81, 178, growSink)})` : C.navy,
            opacity: clamp01(growIn * 1.6) * (1 - growOut), transform: `translateY(${(1 - growIn) * 60 - growOut * 50}px)`, filter: growIn < 1 || growOut > 0 ? `blur(${(1 - growIn) * 10 + growOut * 10}px)` : undefined }}>grow</div>
        </div>
      )}
      {on(g, "where-0.2", "close+0.4") && <Line g={g} words={whereWords} x={1010} y={92} size={96} weight={700} color={C.ink} out="close" split style={{ willChange: "transform" }} />}
      {on(g, "w:tech-0.2", "first+0.5") && <Line g={g} words={partnerWords} x={578} y={588} size={60} weight={800} color={C.navy} out="first" style={{ fontFamily: F.logo, letterSpacing: "0.02em", flexDirection: "column", gap: 14, willChange: "transform" }} ls={0.02} />}
      {on(g, "alone-0.1", "drop+0.3") && <Line g={g} words={aloneWords} x={110} y={330} size={210} weight={800} color={C.navy} out="w:it2+0.02" split style={{ willChange: "transform" }} />}
      {g >= T.f("up-0.2") && <Line g={g} words={endWords} x={1060} y={430} size={84} weight={700} color={C.ink} style={{ willChange: "transform" }} />}
      {g >= T.f("rest+0.55") && (() => {
        const b = k(g, "rest+0.55", 0.5);
        return (
          <div data-probe="cta" style={{ position: "absolute", left: 0, top: 0, transform: `translate(1060px, ${lerp(610, 570, b)}px)`, opacity: clamp01(b * 1.5) }}>
            <div style={{ padding: "26px 44px 27px", borderRadius: R.pill, background: C.cyan, fontFamily: F.sans, fontWeight: 600, fontSize: 36, color: C.ink, letterSpacing: "-0.01em", whiteSpace: "nowrap" }}>
              Book a Free Discovery Call
            </div>
          </div>
        );
      })()}
      {/* the end card's logo is KT's front face; nothing else crosses the screen */}
    </AbsoluteFill>
  );
};
