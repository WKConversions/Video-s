// Karl's 3D hand cursor (his Cursor.glb, rendered to 49 tilt poses in public/hand by brand/cursor/shoot.mjs), and
// the cursor's motion for the whole film. Karl: "a very animated, bouncy cursor, used through the video, but calm:
// if there has to be a click at some moment, it should already have slid in well before".
//   const h = handAt(g, [{ at: "w:navn", x: 620, y: 410, click: true }, { at: 12.3, x: 900, y: 640, click: true }]);
//   <Hand {...h} />
// handAt glides between targets on a soft spring with a small settle (bouncy, never jittery), ARRIVES EARLY (0.55 s
// before `at` by default) and rests on the target with a slow float, leans into its direction of travel (the 3D
// tilt comes from its speed), and clicks at `at`: a quick dip toward the screen with a squash, then a springy
// release. x, y are SCREEN px of the fingertip.
import React from "react";
import { Img, staticFile } from "remotion";
import { clamp01 } from "./lib";
import { f } from "./shared";

const STEPS = [-30, -20, -10, 0, 10, 20, 30];
const TIP = { x: 0.455, y: 0.128 };       // the index fingertip inside the square sprite
// Hand: the cursor at fingertip (x, y). size = sprite box px (the hand itself is about 0.64 × 0.76 of it).
// tiltX / tiltY in degrees (±30): tiltY + turns its right side away, tiltX + leans its top away. press 0..1.
export const Hand: React.FC<{ x: number; y: number; tiltX?: number; tiltY?: number; press?: number; size?: number; opacity?: number; rot?: number }> = ({ x, y, tiltX = 0, tiltY = 0, press = 0, size = 150, opacity = 1, rot = 0 }) => {
  if (opacity <= 0.001) return null;
  const cl = (v: number) => Math.max(-30, Math.min(30, v));
  const ax = cl(tiltX) / 10 + 3, ay = cl(tiltY) / 10 + 3;                   // 0..6 in sprite steps
  const i0 = Math.min(5, Math.floor(ax)), j0 = Math.min(5, Math.floor(ay)), u = ax - i0, v = ay - j0;
  const img = (i: number, j: number, o: number) => o <= 0.003 ? null : (
    <Img key={`${i}_${j}`} src={staticFile(`hand/h_${STEPS[i]}_${STEPS[j]}.png`)} style={{ position: "absolute", left: 0, top: 0, width: size, height: size, opacity: o }} />);
  const sc = 1 - 0.1 * press;
  return (
    <div style={{ position: "absolute", left: x - TIP.x * size, top: y - TIP.y * size, width: size, height: size, opacity,
      transformOrigin: `${TIP.x * 100}% ${TIP.y * 100}%`, transform: `rotate(${rot.toFixed(2)}deg) scale(${sc.toFixed(4)}, ${(sc * (1 - 0.05 * press)).toFixed(4)})`,
      filter: `drop-shadow(0 ${(10 - 6 * press).toFixed(1)}px ${(14 - 8 * press).toFixed(1)}px rgba(26,22,20,${(0.22 + 0.08 * press).toFixed(3)}))` }}>
      {/* bilinear blend of the four nearest poses: a base at full strength, the others laid over it */}
      {img(i0, j0, 1)}{img(i0 + 1, j0, u)}{img(i0, j0 + 1, v * (1 - u))}{img(i0 + 1, j0 + 1, u * v)}
    </div>
  );
};

export type HandKey = { at: string | number; x: number; y: number; click?: boolean; early?: number; dur?: number };
// a soft spring 0..1 with a small settle (damping 0.72): bouncy, calm
const spring = (t: number, response: number, damping = 0.72) => {
  if (t <= 0) return 0;
  const w0 = (2 * Math.PI) / response, wd = w0 * Math.sqrt(1 - damping * damping);
  return 1 - Math.exp(-damping * w0 * t) * (Math.cos(wd * t) + ((damping * w0) / wd) * Math.sin(wd * t));
};
const posAt = (g: number, keys: HandKey[]) => {
  let x = keys[0].x, y = keys[0].y;
  for (let i = 1; i < keys.length; i++) {
    const kk = keys[i], dur = kk.dur ?? 0.95, early = kk.early ?? 0.55;
    const start = f(kk.at) / 30 - early - dur;                              // the glide starts here, lands `early` s before `at`
    const p = spring(g / 30 - start, dur * 0.82);
    x += (kk.x - keys[i - 1].x) * p; y += (kk.y - keys[i - 1].y) * p;
  }
  return { x, y };
};
// the click: 0 → 1 in 0.09 s at `at`, held 0.07 s, then a springy release (a small rebound)
const clickAt = (g: number, keys: HandKey[]) => {
  let p = 0;
  for (const kk of keys) {
    if (!kk.click) continue;
    const t = g / 30 - f(kk.at) / 30;
    if (t < -0.02 || t > 1.2) continue;
    p = Math.max(p, t < 0.09 ? clamp01((t + 0.02) / 0.11) : t < 0.16 ? 1 : 1 - spring(t - 0.16, 0.34, 0.6));
  }
  return p;
};
// handAt: the cursor's state at g. opts.float = idle bob in px (default 3).
export const handAt = (g: number, keys: HandKey[], opts: { float?: number; size?: number } = {}) => {
  const p = posAt(g, keys), a = posAt(g - 1.5, keys), b = posAt(g + 1.5, keys);
  const vx = ((b.x - a.x) / 3) * 30, vy = ((b.y - a.y) / 3) * 30;           // px per second, smoothed over 0.1 s
  const press = clickAt(g, keys), fl = opts.float ?? 3, t = g / 30;
  const lean = (v: number) => Math.max(-24, Math.min(24, v / 55));
  return {
    x: p.x + fl * 0.6 * Math.sin(t * 1.7), y: p.y + fl * Math.sin(t * 2.3 + 1) + 5 * press,
    tiltY: lean(vx) + 4 * Math.sin(t * 1.1), tiltX: -lean(vy) + 14 * press + 3 * Math.sin(t * 1.4 + 0.6),
    rot: Math.max(-10, Math.min(10, vx / 160)), press, size: opts.size ?? 150,
  };
};
