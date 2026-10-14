// Segment 5 helpers: a smooth colour field drawn from a coarse grid, a radial zoom blur, keyframe tables.
import React, { useLayoutEffect, useRef } from "react";
import { clamp01, lerp } from "./lib";

/** per-frame table lookup: [[frame, v0, v1, ...], ...] -> linearly interpolated row (clamped at the ends) */
export const tab = (g: number, rows: number[][]): number[] => {
  if (g <= rows[0][0]) return rows[0].slice(1);
  for (let i = 1; i < rows.length; i++) {
    if (g <= rows[i][0]) {
      const a = rows[i - 1], b = rows[i], t = (g - a[0]) / (b[0] - a[0]);
      return a.slice(1).map((v, k) => lerp(v, b[k + 1], t));
    }
  }
  return rows[rows.length - 1].slice(1);
};

const decCache = new Map<string, Float32Array>();
const dec = (h: string) => {
  let a = decCache.get(h);
  if (!a) {
    a = new Float32Array(h.length / 2);
    for (let i = 0; i < a.length; i++) a[i] = parseInt(h.substr(i * 2, 2), 16);
    decCache.set(h, a);
  }
  return a;
};
const cr = (t: number): [number, number, number, number] => {
  const t2 = t * t, t3 = t2 * t;
  return [(-t3 + 2 * t2 - t) / 2, (3 * t3 - 5 * t2 + 2) / 2, (-3 * t3 + 4 * t2 + t) / 2, (t3 - t2) / 2];
};

/**
 * A soft colour field: a gx x gy grid of hex colours (cell centres on a 1920x1080 frame), Catmull-Rom interpolated
 * onto a small canvas and stretched to the frame. b/t crossfade to a second grid.
 */
export const Field: React.FC<{ a: string; b?: string; t?: number; gx?: number; gy?: number; style?: React.CSSProperties }> = ({ a, b, t = 0, gx = 16, gy = 9, style }) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const W = 320, H = 180;
  useLayoutEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const A = dec(a), B = b ? dec(b) : A, k = b ? clamp01(t) : 0;
    const G = new Float32Array(A.length);
    for (let i = 0; i < G.length; i++) G[i] = A[i] + (B[i] - A[i]) * k;
    const img = ctx.createImageData(W, H);
    const cl = (v: number, n: number) => (v < 0 ? 0 : v >= n ? n - 1 : v);
    const colW: [number[], number[]][] = [];
    for (let x = 0; x < W; x++) {
      const u = ((x + 0.5) / W) * gx - 0.5, i0 = Math.floor(u), w = cr(u - i0);
      colW.push([[cl(i0 - 1, gx), cl(i0, gx), cl(i0 + 1, gx), cl(i0 + 2, gx)], w]);
    }
    for (let y = 0; y < H; y++) {
      const v = ((y + 0.5) / H) * gy - 0.5, j0 = Math.floor(v), wy = cr(v - j0);
      const js = [cl(j0 - 1, gy), cl(j0, gy), cl(j0 + 1, gy), cl(j0 + 2, gy)];
      for (let x = 0; x < W; x++) {
        const [is, wx] = colW[x];
        let r = 0, gg = 0, bb = 0;
        for (let q = 0; q < 4; q++) for (let p = 0; p < 4; p++) {
          const w = wy[q] * wx[p], o = (js[q] * gx + is[p]) * 3;
          r += G[o] * w; gg += G[o + 1] * w; bb += G[o + 2] * w;
        }
        const o = (y * W + x) * 4;
        img.data[o] = r; img.data[o + 1] = gg; img.data[o + 2] = bb; img.data[o + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
  }, [a, b, t, gx, gy]);
  return <canvas ref={ref} width={W} height={H} style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, ...style }} />;
};

/**
 * Radial zoom blur: n copies of a layer, scaled about (cx, cy) over a spread of `amt` (smear = amt x distance from the
 * centre), averaged. render(i) draws copy i (copy 0 is the sharp one when amt is 0).
 */
export const ZoomBlur: React.FC<{ amt: number; cx?: number; cy?: number; n?: number; soft?: number; render: (i: number) => React.ReactNode }> = ({ amt, cx = 960, cy = 540, n = 8, soft = 0, render }) => {
  if (amt < 0.001) return <>{render(0)}</>;
  return (
    <>
      {Array.from({ length: n }, (_, i) => {
        const k = 1 + amt * (i / (n - 1) - 0.5);
        return (
          <div key={i} style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: `${cx}px ${cy}px`, transform: `scale(${k})`, opacity: 1 / (i + 1), filter: soft ? `blur(${soft}px)` : undefined }}>
            {render(i)}
          </div>
        );
      })}
    </>
  );
};
