// v6's 3D camera (Willads: "a 3D camera that moves through the scene, with perspective, depth of field and motion
// blur"). One CSS 3D world per scene: <Stage3D cam={...}> holds <Plane>s placed in world space; the camera moves,
// the planes stay where they are. Depth of field is computed per plane from its distance to the eye. Motion blur is
// added at render time (Film wraps the frame in CameraMotionBlur inside the windows each scene lists in BLUR).
//
// World units are px. With the default camera (all zeros) a plane at z = 0 shows at its natural size, centred on
// screen; world (0, 0) is the screen centre. z grows TOWARD the viewer (CSS): a plane at z = −1200 sits further away,
// and shows at its natural size when the camera is at z = −1200 (moving the camera forward = z decreasing).
//   x, y : camera position (y grows downward, as on screen)
//   z    : camera depth (0 = home; −800 = 800 px further into the scene)
//   rx   : tilt in degrees, + looks DOWN        ry : pan in degrees, + looks RIGHT        rz : roll, + clockwise
//   focus: the eye-distance that is sharp (default PERSP: whatever sits at the camera's own depth + 0)
//   ap   : aperture, the blur in px of something twice as far as the focus (0 = no depth of field)
import React from "react";
import { clamp01, INOUT, mix } from "./lib";
import { f } from "./shared";

export const PERSP = 1600;
export const W = 1920, H = 1080;
// The one grid (Willads 3): every discrete element (card, pill, button, text line) sits fully inside the safe area;
// only a full-page surface (the wizard page, the website) may run past the frame edge, and only in a close-up.
export const SAFE = { x: 144, y: 108, w: 1632, h: 864 };   // 7.5% / 10% margins; the content box is 1632 × 864

export type Cam = { x: number; y: number; z: number; rx: number; ry: number; rz: number; focus: number; ap: number };
export const CAM0: Cam = { x: 0, y: 0, z: 0, rx: 0, ry: 0, rz: 0, focus: PERSP, ap: 0 };
export const cam = (c: Partial<Cam> = {}): Cam => ({ ...CAM0, ...c });

const lerpCam = (a: Cam, b: Cam, t: number): Cam => ({
  x: mix(a.x, b.x, t), y: mix(a.y, b.y, t), z: mix(a.z, b.z, t), rx: mix(a.rx, b.rx, t), ry: mix(a.ry, b.ry, t),
  rz: mix(a.rz, b.rz, t), focus: mix(a.focus, b.focus, t), ap: mix(a.ap, b.ap, t),
});

// camKeys: the camera through poses at times (labels or seconds), rest to rest with INOUT by default (a key's ease
// applies to the move that ENDS at it). Before the first key it holds the first pose, after the last the last.
//   camKeys(g, [{ at: "w:fortl", c: { z: 0 } }, { at: "w:kort", c: { z: -600, x: -200 } }, ...])
export type CamKey = { at: string | number; c: Partial<Cam>; ease?: (t: number) => number };
export const camKeys = (g: number, keys: CamKey[]): Cam => {
  const poses = keys.map((kk) => cam(kk.c)), ts = keys.map((kk) => f(kk.at));
  if (g <= ts[0]) return poses[0];
  for (let i = 1; i < keys.length; i++) {
    if (g <= ts[i]) return lerpCam(poses[i - 1], poses[i], (keys[i].ease ?? INOUT)(clamp01((g - ts[i - 1]) / Math.max(1e-6, ts[i] - ts[i - 1]))));
  }
  return poses[poses.length - 1];
};
// camAdd: a base pose plus moves that each run in their own window and add up (a slow dolly under a quick push):
//   camAdd(g, { z: -400 }, [{ at: "w:du", dur: 1.6, d: { z: -500, ry: 6 } }, { at: "w:krone", dur: 1.2, d: { y: 300 } }])
export type CamMove = { at: string | number; dur: number; d: Partial<Cam>; ease?: (t: number) => number };
export const camAdd = (g: number, base: Partial<Cam>, moves: CamMove[]): Cam => {
  const c = cam(base);
  for (const m of moves) {
    const t = (m.ease ?? INOUT)(clamp01((g - f(m.at)) / (m.dur * 30)));
    for (const key of Object.keys(m.d) as (keyof Cam)[]) c[key] += (m.d[key] as number) * t;
  }
  return c;
};

const rad = (d: number) => (d * Math.PI) / 180;
// toCam: a world point in camera space (CSS rotation matrices, the same order as Stage3D's transform)
export const toCam = (c: Cam, p: { x: number; y: number; z: number }) => {
  let x = p.x - c.x, y = p.y - c.y, z = p.z - c.z;
  { const a = rad(c.ry), X = x * Math.cos(a) + z * Math.sin(a), Z = -x * Math.sin(a) + z * Math.cos(a); x = X; z = Z; }
  { const a = rad(-c.rx), Y = y * Math.cos(a) - z * Math.sin(a), Z = y * Math.sin(a) + z * Math.cos(a); y = Y; z = Z; }
  { const a = rad(-c.rz), X = x * Math.cos(a) - y * Math.sin(a), Y = x * Math.sin(a) + y * Math.cos(a); x = X; y = Y; }
  return { x, y, z };
};
// project: where a world point lands on screen (px), its scale, and its distance from the eye
export const project = (c: Cam, p: { x: number; y: number; z: number }) => {
  const q = toCam(c, p), dist = PERSP - q.z, s = PERSP / Math.max(1, dist);
  return { x: W / 2 + q.x * s, y: H / 2 + q.y * s, s, dist };
};
// dofBlur: the blur (px) of a point at eye-distance `dist`; max 28 px
export const dofBlur = (c: Cam, dist: number) => (c.ap <= 0 ? 0 : Math.min(28, c.ap * Math.abs(1 - c.focus / Math.max(1, dist))));

const CamCtx = React.createContext<Cam>(CAM0);
export const useCam = () => React.useContext(CamCtx);

// Stage3D: the world. Put <Plane>s inside (any order; the browser sorts them by depth).
export const Stage3D: React.FC<{ cam: Cam; children?: React.ReactNode; style?: React.CSSProperties }> = ({ cam: c, children, style }) => (
  <CamCtx.Provider value={c}>
    <div style={{ position: "absolute", inset: 0, perspective: PERSP, perspectiveOrigin: "50% 50%", overflow: "hidden", ...style }}>
      <div style={{ position: "absolute", left: W / 2, top: H / 2, width: 0, height: 0, transformStyle: "preserve-3d",
        transform: `rotateZ(${-c.rz}deg) rotateX(${-c.rx}deg) rotateY(${c.ry}deg) translate3d(${-c.x}px, ${-c.y}px, ${-c.z}px)` }}>
        {children}
      </div>
    </div>
  </CamCtx.Provider>
);

// Plane: a flat element of w × h whose CENTRE sits at world (x, y, z), turned by rx / ry / rz (degrees, CSS sense:
// rx + leans the top away, ry + swings the right side away). Depth of field: the plane is blurred by its centre's
// distance (dof = false to opt out). For a plane seen at a steep angle, pass farBlur (px) and farMask (a CSS
// mask, opaque where the plane is IN focus): the plane is drawn twice, a blurred copy under a masked sharp one, so
// the far part goes soft (as in the reference's tilted UI).
export const Plane: React.FC<{
  x?: number; y?: number; z?: number; rx?: number; ry?: number; rz?: number; w: number; h: number; scale?: number;
  opacity?: number; dof?: boolean; blur?: number; farBlur?: number; farMask?: string; children?: React.ReactNode; style?: React.CSSProperties;
}> = ({ x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0, w, h, scale = 1, opacity = 1, dof = true, blur = 0, farBlur = 0, farMask, children, style }) => {
  const c = useCam();
  const d = dof ? dofBlur(c, project(c, { x, y, z }).dist) : 0;
  const b = Math.max(0, d + blur);
  const tf = `translate3d(${x - w / 2}px, ${y - h / 2}px, ${z}px) rotateY(${ry}deg) rotateX(${rx}deg) rotateZ(${rz}deg) scale(${scale})`;
  if (opacity <= 0.001) return null;
  const base: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: w, height: h, transformOrigin: "50% 50%", transform: tf, opacity };
  if (farBlur > 0 && farMask) {
    return (
      <div style={{ ...base, ...style }}>
        <div style={{ position: "absolute", inset: 0, filter: `blur(${(b + farBlur).toFixed(2)}px)` }}>{children}</div>
        <div style={{ position: "absolute", inset: 0, filter: b > 0.05 ? `blur(${b.toFixed(2)}px)` : undefined, WebkitMaskImage: farMask, maskImage: farMask }}>{children}</div>
      </div>
    );
  }
  return <div style={{ ...base, filter: b > 0.05 ? `blur(${b.toFixed(2)}px)` : undefined, ...style }}>{children}</div>;
};

// blurWindows: helper for a scene's BLUR export (seconds): the windows around fast moves that get motion blur
export const win = (at: string | number, before: number, after: number): [number, number] => [f(at) / 30 - before, f(at) / 30 + after];
