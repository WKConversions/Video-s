// Karl's 3D hand cursor (his Cursor.glb, rendered to 289 tilt poses in public/hand by brand/cursor/shoot.mjs), and
// the cursor's motion for the whole film. Karl: "a very animated, bouncy cursor, used through the video, but calm:
// if there has to be a click at some moment, it should already have slid in well before".
//   const h = handAt(g, [{ at: "w:navn", x: 620, y: 410, click: true }, { at: 12.3, x: 900, y: 640, click: true }]);
//   <Hand {...h} />
// handAt glides between targets on a bouncy spring (it overshoots and swings back, in position and in rotation), ARRIVES EARLY (0.55 s
// before `at` by default) and rests on the target with a slow float, leans into its direction of travel (the 3D
// tilt comes from its speed), and clicks at `at`: a deep 3D push of the FINGERTIP into the screen: the hand is anchored at its bottom (the
// wrist) and the finger swings away from the viewer by up to 40°, so the tip goes deepest; a slight squash and
// turn come with it and the shadow closes, then a loose, wobbling release that swells past its size. x, y are SCREEN px of the TARGET: for a click key the
// fingertip is exactly there at the deepest point of the click (before it, the finger hovers just short of it and
// swings in); for a key without a click the resting fingertip is there.
import React from "react";
import { Img, staticFile } from "remotion";
import { clamp01 } from "./lib";
import { f } from "./shared";
import TIPS from "./handTips.json";

const STEPS = Array.from({ length: 17 }, (_, i) => -40 + 5 * i);   // 5° apart, so blending two poses never shows a double edge
const TIP = { x: 0.39, y: 0.135 };        // the top of the index finger inside the square sprite (measured on h_0_0.png): the click point
const WRIST = { x: 0.5, y: 0.875 };       // the bottom of the hand: the anchor of every tilt, turn and squash
// Hand: the cursor at fingertip (x, y). size = sprite box px (the hand itself is about 0.64 × 0.76 of it).
// tiltX / tiltY in degrees (±40), about the wrist: tiltX − swings the fingertip AWAY (into the screen), + toward the
// viewer; tiltY turns it sideways. press 0..1 (below 0 on the rebound).
export const Hand: React.FC<{ x: number; y: number; tiltX?: number; tiltY?: number; press?: number; size?: number; opacity?: number; rot?: number }> = ({ x, y, tiltX = 0, tiltY = 0, press = 0, size = 150, opacity = 1, rot = 0 }) => {
  if (opacity <= 0.001) return null;
  const cl = (v: number) => Math.max(-40, Math.min(40, v));
  const ax = cl(tiltX) / 5 + 8, ay = cl(tiltY) / 5 + 8;                     // 0..16 in sprite steps
  const i0 = Math.min(15, Math.floor(ax)), j0 = Math.min(15, Math.floor(ay)), u = ax - i0, v = ay - j0;
  const img = (i: number, j: number, o: number) => o <= 0.003 ? null : (
    <Img key={`${i}_${j}`} src={staticFile(`hand/h_${STEPS[i]}_${STEPS[j]}.png`)} style={{ position: "absolute", left: 0, top: 0, width: size, height: size, opacity: o }} />);
  const sc = 1 - 0.12 * press;                                              // press may go below 0 on the rebound: it swells past its size
  return (
    <div style={{ position: "absolute", left: x - TIP.x * size, top: y - TIP.y * size, width: size, height: size, opacity,
      transformOrigin: `${WRIST.x * 100}% ${WRIST.y * 100}%`, transform: `rotate(${rot.toFixed(2)}deg) scale(${sc.toFixed(4)}, ${(sc * (1 - 0.08 * press)).toFixed(4)})`,
      filter: `drop-shadow(0 ${Math.max(1, 14 - 12 * press).toFixed(1)}px ${Math.max(2, 20 - 16 * press).toFixed(1)}px rgba(26,22,20,${Math.min(0.4, Math.max(0.1, 0.2 + 0.16 * press)).toFixed(3)}))` }}>
      {/* bilinear blend of the four nearest poses: a base at full strength, the others laid over it */}
      {img(i0, j0, 1)}{img(i0 + 1, j0, u)}{img(i0, j0 + 1, v * (1 - u))}{img(i0 + 1, j0 + 1, u * v)}
    </div>
  );
};

// tipOf: where the top of the index finger is inside the sprite box for a pose (fractions of the box), measured on
// every rendered pose (handTips.json) and blended like the sprites.
const tipOf = (tiltX: number, tiltY: number) => {
  const cl = (v: number) => Math.max(-40, Math.min(40, v)), ax = cl(tiltX) / 5 + 8, ay = cl(tiltY) / 5 + 8;
  const i0 = Math.min(15, Math.floor(ax)), j0 = Math.min(15, Math.floor(ay)), u = ax - i0, v = ay - j0;
  const at = (i: number, j: number) => (TIPS as Record<string, number[]>)[`${STEPS[i]}_${STEPS[j]}`];
  const a = at(i0, j0), b = at(i0 + 1, j0), c = at(i0, j0 + 1), d = at(i0 + 1, j0 + 1), m = (k: number) => (a[k] * (1 - u) + b[k] * u) * (1 - v) + (c[k] * (1 - u) + d[k] * u) * v;
  return { x: m(0), y: m(1) };
};
// The click's deepest pose (press = 1), as handAt builds it: the finger swung 40° into the screen about the wrist.
const PRESS = { tiltX: -40, tiltY: -10, rot: -9, dy: 4 };
// pressShift: how far (fractions of the box) the fingertip travels from the rest pose to the deepest point of the
// click, the wrist staying where it is. A click target is approached with the fingertip hovering this far short of
// it, so that AT THE DEEPEST POINT OF THE CLICK THE FINGERTIP IS EXACTLY ON THE TARGET (Karl).
const pressShift = (() => {
  const r = tipOf(0, 0), p = tipOf(PRESS.tiltX, PRESS.tiltY), sc = 1 - 0.12, sy = sc * (1 - 0.08), a = (PRESS.rot * Math.PI) / 180;
  const vx = (p.x - WRIST.x) * sc, vy = (p.y - WRIST.y) * sy;
  return { x: vx * Math.cos(a) - vy * Math.sin(a) - (r.x - WRIST.x), y: vx * Math.sin(a) + vy * Math.cos(a) - (r.y - WRIST.y) };
})();
export type HandKey = { at: string | number; x: number; y: number; click?: boolean; early?: number; dur?: number };
// a spring 0..1 (damping 0.5 by default: a clear bounce that settles in two swings)
const spring = (t: number, response: number, damping = 0.5) => {
  if (t <= 0) return 0;
  const w0 = (2 * Math.PI) / response, wd = w0 * Math.sqrt(1 - damping * damping);
  return 1 - Math.exp(-damping * w0 * t) * (Math.cos(wd * t) + ((damping * w0) / wd) * Math.sin(wd * t));
};
const posAt = (g: number, keysIn: HandKey[], size: number) => {
  // a click target is held with the fingertip hovering short of it by the press travel (see pressShift)
  const keys = keysIn.map((kk) => (kk.click ? { ...kk, x: kk.x - pressShift.x * size, y: kk.y - pressShift.y * size - PRESS.dy } : kk));
  let x = keys[0].x, y = keys[0].y;
  for (let i = 1; i < keys.length; i++) {
    const kk = keys[i], dur = kk.dur ?? 0.95, early = kk.early ?? 0.55;
    const start = f(kk.at) / 30 - early - dur;                              // the glide starts here, lands `early` s before `at`
    const p = spring(g / 30 - start, dur * 0.7);
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
    if (t < -0.03 || t > 1.6) continue;
    // deep and bouncy: down in 0.11 s, held 0.07 s, released on a loose spring that rebounds past rest (p < 0) and wobbles
    const v = t < 0.08 ? clamp01((t + 0.03) / 0.11) : t < 0.15 ? 1 : 1 - spring(t - 0.15, 0.42, 0.32);
    if (Math.abs(v) > Math.abs(p)) p = v;
  }
  return p;
};
// handAt: the cursor's state at g. opts.float = idle bob in px (default 3).
export const handAt = (g: number, keys: HandKey[], opts: { float?: number; size?: number } = {}) => {
  const size = opts.size ?? 150;
  const p = posAt(g, keys, size), a = posAt(g - 1.5, keys, size), b = posAt(g + 1.5, keys, size);
  const vx = ((b.x - a.x) / 3) * 30, vy = ((b.y - a.y) / 3) * 30;           // px per second, smoothed over 0.1 s
  const press = clickAt(g, keys), q = 1 - Math.min(1, Math.abs(press)), fl = (opts.float ?? 3) * q, t = g / 30;
  const lean = (v: number) => Math.max(-36, Math.min(36, v / 30));
  return {
    x: p.x + fl * 0.6 * Math.sin(t * 1.7), y: p.y + fl * Math.sin(t * 2.3 + 1) + PRESS.dy * press,
    tiltY: lean(vx) + 4 * q * Math.sin(t * 1.1) + PRESS.tiltY * press, tiltX: -lean(vy) * 0.6 + PRESS.tiltX * press + 3 * q * Math.sin(t * 1.4 + 0.6),
    rot: Math.max(-26, Math.min(26, vx / 55 + vy / 140)) + PRESS.rot * press, press, size,
  };
};
