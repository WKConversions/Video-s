// The film's clock and the car's choreography. Every pose is a key on the timeline; the car moves through them on
// a smooth spline (it never stops), and the framing is written as "bring this point of the car to that point in
// the studio" (focus keys), so a close-up is the car coming to the camera, never the camera flying.
import { Easing } from "remotion";
import * as THREE from "three";
import { timeline } from "../timeline";

export const FPS = 30;
export const DURATION = 900;

export const T = timeline(FPS, {
  intro: 0,
  body: 3.3,       // the beats sit on the music's bar lines (109.09 BPM, a bar = 2.2 s, music offset 0.55 s)
  lift: 7.7,
  head: 9.35,
  vanos: 13.75,
  gearbox: 18.15,
  diff: 22.55,
  outro: 26.95,
  end: 30.0,
});

export const EASE = {
  arrive: Easing.bezier(0.22, 1, 0.36, 1),
  depart: Easing.bezier(0.55, 0, 0.9, 0.4),
  move: Easing.bezier(0.65, 0, 0.35, 1),
  longS: Easing.bezier(0.8, 0, 0.2, 1),
  soft: Easing.bezier(0.4, 0, 0.15, 1),
};
export const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const deg = Math.PI / 180;

/** eased progress of a move of `sec` seconds that starts at timeline position `pos` (label or seconds) */
export const k = (g: number, pos: string | number, sec: number, ease = EASE.arrive) => T.k(g, pos, sec, ease);

// ------------------------------------------------------------------------------------------------ poses
export type Pose = {
  yaw: number; pitch: number; roll: number;         // degrees: about Y (turntable), the car's Z (nose), its X (side)
  focus: [number, number, number];                    // a point of the car (car metres) ...
  at: [number, number, number];                       // ... brought to this studio point (metres)
};
type Key = Pose & { t: number };

// the car's centre and the places the film looks at (car metres)
export const PTS = {
  centre: [0, 0.62, 0] as [number, number, number],
  roof: [-0.45, 1.25, 0] as [number, number, number],
  head: [1.20, 0.86, 0] as [number, number, number],
  vanos: [1.58, 0.92, 0] as [number, number, number],
  gearbox: [0.45, 0.38, 0] as [number, number, number],
  diff: [-1.36, 0.33, 0] as [number, number, number],
};

const KEYS: Key[] = [
  { t: 0.0, yaw: -72, pitch: 0, roll: 0, focus: PTS.centre, at: [0.55, 0.62, -1.6] },
  { t: 1.65, yaw: -44, pitch: 0, roll: 0, focus: PTS.centre, at: [0.35, 0.62, -0.7] },
  { t: 3.3, yaw: -14, pitch: 0, roll: 0, focus: PTS.centre, at: [0.12, 0.62, -0.15] },
  { t: 4.4, yaw: -1.5, pitch: 0, roll: 0, focus: PTS.centre, at: [0.0, 0.56, 0.1] },
  { t: 5.5, yaw: 0.5, pitch: 0, roll: 0, focus: PTS.roof, at: [0.38, 0.66, 2.55] },
  { t: 7.0, yaw: 2.0, pitch: 0, roll: 0, focus: PTS.roof, at: [0.30, 0.66, 2.8] },
  { t: 8.171, yaw: 1, pitch: -2, roll: 0, focus: PTS.centre, at: [0.0, 0.85, 0.7] },
  { t: 9.35, yaw: -16, pitch: -8, roll: 3, focus: PTS.head, at: [0.75, 0.70, 2.6] },
  { t: 10.593, yaw: -32, pitch: -17, roll: 6, focus: PTS.head, at: [0.80, 0.62, 5.0] },
  { t: 13.176, yaw: -42, pitch: -18, roll: 7, focus: PTS.head, at: [0.86, 0.60, 5.2] },
  { t: 14.75, yaw: -76, pitch: -10, roll: 4, focus: PTS.vanos, at: [0.62, 0.70, 6.05] },
  { t: 17.35, yaw: -84, pitch: -9, roll: 3, focus: PTS.vanos, at: [0.58, 0.70, 6.15] },
  { t: 19.15, yaw: -28, pitch: 4, roll: -52, focus: PTS.gearbox, at: [0.95, 0.92, 3.9] },
  { t: 21.95, yaw: -16, pitch: 6, roll: -60, focus: PTS.gearbox, at: [0.9, 0.95, 4.1] },
  { t: 23.55, yaw: 128, pitch: 6, roll: -22, focus: PTS.diff, at: [-0.85, 0.78, 3.6] },
  { t: 26.35, yaw: 142, pitch: 5, roll: -18, focus: PTS.diff, at: [-0.9, 0.80, 3.9] },
  { t: 28.257, yaw: 300, pitch: 0, roll: 0, focus: PTS.centre, at: [0.1, 0.66, 0.4] },
  { t: 30.0, yaw: 316, pitch: 0, roll: 0, focus: PTS.centre, at: [0.05, 0.62, 0.55] },
];

/** Cubic Hermite through the keys with time-aware Catmull-Rom tangents: the car keeps moving through every key. */
const hermite = (get: (k: Key) => number, t: number) => {
  const n = KEYS.length;
  if (t <= KEYS[0].t) return get(KEYS[0]);
  if (t >= KEYS[n - 1].t) return get(KEYS[n - 1]);
  let i = 0;
  while (i < n - 2 && t > KEYS[i + 1].t) i++;
  const k0 = KEYS[Math.max(0, i - 1)], k1 = KEYS[i], k2 = KEYS[i + 1], k3 = KEYS[Math.min(n - 1, i + 2)];
  const slope = (a: Key, b: Key) => (get(b) - get(a)) / Math.max(1e-6, b.t - a.t);
  const m1 = i === 0 ? slope(k1, k2) : (slope(k0, k1) + slope(k1, k2)) / 2;
  const m2 = i + 1 === n - 1 ? slope(k1, k2) : (slope(k1, k2) + slope(k2, k3)) / 2;
  const h = k2.t - k1.t, u = (t - k1.t) / h;
  const u2 = u * u, u3 = u2 * u;
  return (2 * u3 - 3 * u2 + 1) * get(k1) + (u3 - 2 * u2 + u) * h * m1 + (-2 * u3 + 3 * u2) * get(k2) + (u3 - u2) * h * m2;
};

export const poseAt = (g: number): Pose => {
  const t = g / FPS;
  return {
    yaw: hermite((k) => k.yaw, t), pitch: hermite((k) => k.pitch, t), roll: hermite((k) => k.roll, t),
    focus: [0, 1, 2].map((i) => hermite((k) => k.focus[i], t)) as [number, number, number],
    at: [0, 1, 2].map((i) => hermite((k) => k.at[i], t)) as [number, number, number],
  };
};

/** The car's world matrix for a pose: rotate about the focus point, then bring the focus to `at`. */
export const carMatrix = (p: Pose, lift = 0) => {
  const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(p.roll * deg, p.yaw * deg, p.pitch * deg, "YZX"));
  const f = new THREE.Vector3(...p.focus);
  const pos = new THREE.Vector3(...p.at).sub(f.clone().applyQuaternion(q));
  pos.y += lift;
  return new THREE.Matrix4().compose(pos, q, new THREE.Vector3(1, 1, 1));
};

// ------------------------------------------------------------------------------------------------ camera
export const CAMERA = { pos: [0, 1.22, 8.3] as [number, number, number], target: [0, 0.72, 0] as [number, number, number], fov: 30 };

/** The camera only breathes: a fraction of a degree of orbit and a few centimetres of height, very slowly. */
export const cameraAt = (g: number) => {
  const a = Math.sin(g / 95) * 0.006 + Math.sin(g / 41) * 0.0015;
  const r = CAMERA.pos[2];
  return {
    pos: [Math.sin(a) * r, CAMERA.pos[1] + Math.sin(g / 120) * 0.035, Math.cos(a) * r] as [number, number, number],
    target: CAMERA.target,
    fov: CAMERA.fov,
  };
};

/** Project a world point to screen pixels with the film camera at frame g. */
export const project = (g: number, world: THREE.Vector3, width: number, height: number) => {
  const c = cameraAt(g);
  const cam = new THREE.PerspectiveCamera(c.fov, width / height, 0.05, 100);
  cam.position.set(...c.pos); cam.lookAt(...c.target); cam.updateMatrixWorld(); cam.updateProjectionMatrix();
  const v = world.clone().project(cam);
  return { x: (v.x + 1) / 2 * width, y: (1 - v.y) / 2 * height, z: v.z };
};

// ------------------------------------------------------------------------------------------------ the body's state
/** x-ray sweep (car X of the plane): paint where X < sweep. Front→back into glass at the lift, back→front at the end. */
export const sweepAt = (g: number) => {
  const into = k(g, "lift+0.15", 1.15, EASE.move);
  const back = k(g, "outro+0.1", 1.0, EASE.move);
  if (back > 0) return lerp(-2.6, 2.4, back);
  return lerp(2.4, -2.6, into);
};

/** the body shell lifts off the chassis at the lift and settles back as glass */
export const bodyLiftAt = (g: number) => {
  const up = k(g, "lift", 0.7, EASE.soft);
  const down = k(g, "lift+0.75", 0.65, EASE.move);
  return 0.42 * up * (1 - down);
};

/** the whole car leaves the floor after the lift and lands at the end */
export const floatAt = (g: number) => 0.32 * k(g, "lift+0.6", 1.0, EASE.move) * (1 - k(g, "outro+0.5", 1.2, EASE.move));

/** how much of the floor shadow shows: only while the car stands on the floor at its normal distance */
export const shadowAt = (g: number, M: THREE.Matrix4) => {
  // world height of the car's floor point under its centre, and how far toward the camera the car has come
  const p = new THREE.Vector3(0, 0.0, 0).applyMatrix4(M);
  const onFloor = 1 - Math.min(1, Math.abs(p.y) / 0.12);
  const near = 1 - Math.min(1, Math.max(0, (p.z - 0.9) / 0.8));
  return onFloor * near;
};

/** how strongly the x-ray glass shows: full at the transitions, light while a part is out (the part is the hero) */
export const xrayFadeAt = (g: number) => {
  const partOut = k(g, "head+0.6", 0.8, EASE.move) * (1 - k(g, "outro-0.4", 0.6, EASE.move));
  return 1 - 0.5 * partOut;
};
