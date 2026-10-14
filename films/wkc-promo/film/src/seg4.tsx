// Segment 4 (frames 387-529, 12.90-17.67 s): "the brief becomes a storyboard". Shot A (387-428): storyboard frames
// pop onto the pastel board as pixel mosaics and the WKC-blue "Storyboard" card types its line, then de-rezzes.
// Hard cut to shot B (429-529): the same frames as a real 3D wall that swings away, WKC Studio flies in defocused with
// a client clip and a keyframe timeline, dashed motion paths grow toward it, and the orbit accelerates into the hard
// cut to seg 5. Built from spec/seg4.md; measured tables in seg4_data.tsx, shots in seg4_a.tsx / seg4_b.tsx.
import React, { useLayoutEffect, useRef } from "react";
import { AbsoluteFill } from "remotion";
import { clamp01, lerp } from "./lib";
import { BG_DELTA } from "./seg4_data";
import { GRIDS as SEG3_GRIDS } from "./seg3_data";
import { FilterDefs } from "./seg4_util";
import { ShotA } from "./seg4_a";
import { ShotB } from "./seg4_b";

/** the frames this segment draws: hard cut in at 387 (seg 3 ends at 386), hard cut out at 530 (seg 5) */
export const RANGE: [number, number] = [387, 530];

// ------------------------------------------------------------------------------------------- background (§2)
// The screen-fixed pastel mesh. Same 9 x 7 grid layout and drawing as seg 3's background so the 386|387 cut is
// seamless: frame 387 IS seg 3's frame-386 grid (read from seg3_data), later frames add the reference's measured colour
// drift (§2, re-coloured with seg 3's map; BG_DELTA).
const GX = [15, 240, 480, 720, 960, 1200, 1440, 1680, 1905];
const GY = [15, 180, 360, 540, 720, 900, 1065];
const rgb = (h: string) => [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
const BASE = (SEG3_GRIDS.find(([f]) => f === 386) ?? SEG3_GRIDS[SEG3_GRIDS.length - 1])[1].map((r) => r.map(rgb));
const GRID_RGB = BG_DELTA.map(([f, d]) => [f, BASE.map((r, j) => r.map((c, i) => c.map((v, ch) => Math.max(0, Math.min(255, v + d[j][i][ch])))))] as [number, number[][][]]);
const BW = 480, BH = 270;
const cr = (t: number) => [(-t * t * t + 2 * t * t - t) / 2, (3 * t * t * t - 5 * t * t + 2) / 2, (-3 * t * t * t + 4 * t * t + t) / 2, (t * t * t - t * t) / 2];
const locate = (ks: number[], v: number): [number, number] => {
  if (v <= ks[0]) return [0, 0];
  for (let i = 0; i < ks.length - 1; i++) if (v <= ks[i + 1]) return [i, (v - ks[i]) / (ks[i + 1] - ks[i])];
  return [ks.length - 2, 1];
};
const drawBg = (cv: HTMLCanvasElement, g: number) => {
  const ctx = cv.getContext("2d");
  if (!ctx) return;
  let k = 0;
  while (k < GRID_RGB.length - 2 && g > GRID_RGB[k + 1][0]) k++;
  const [fa, A] = GRID_RGB[k], [fb, B] = GRID_RGB[k + 1];
  const t = clamp01((g - fa) / (fb - fa));
  const grid = A.map((row, j) => row.map((c, i) => c.map((v, ch) => lerp(v, B[j][i][ch], t))));
  const img = ctx.createImageData(BW, BH);
  const cols = Array.from({ length: BW }, (_, x) => { const [i, f] = locate(GX, (x + 0.5) * (1920 / BW)); return { i, w: cr(f) }; });
  for (let y = 0; y < BH; y++) {
    const [j, fy] = locate(GY, (y + 0.5) * (1080 / BH));
    const wy = cr(fy);
    for (let x = 0; x < BW; x++) {
      const { i, w: wx } = cols[x];
      const o = (y * BW + x) * 4;
      for (let ch = 0; ch < 3; ch++) {
        let s = 0;
        for (let a = 0; a < 4; a++) {
          const jj = Math.max(0, Math.min(GY.length - 1, j - 1 + a));
          let r = 0;
          for (let b = 0; b < 4; b++) r += wx[b] * grid[jj][Math.max(0, Math.min(GX.length - 1, i - 1 + b))][ch];
          s += wy[a] * r;
        }
        img.data[o + ch] = s;
      }
      img.data[o + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
};
const Bg: React.FC<{ g: number }> = ({ g }) => {
  const ref = useRef<HTMLCanvasElement>(null);
  useLayoutEffect(() => { if (ref.current) drawBg(ref.current, g); }, [g]);
  return <canvas ref={ref} width={BW} height={BH} style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080 }} />;
};

export const Seg4: React.FC<{ g: number }> = ({ g }) => (
  <AbsoluteFill style={{ overflow: "hidden" }}>
    <Bg g={g} />
    <FilterDefs />
    {g <= 428 ? <ShotA g={g} /> : <ShotB g={g} />}
  </AbsoluteFill>
);
