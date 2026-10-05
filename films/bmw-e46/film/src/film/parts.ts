// The animated parts: which nodes belong to which beat, how they leave and return, and what they do while out.
// Everything is a function of the frame. Node names follow build/SPEC.md; a missing node is skipped.
import * as THREE from "three";
import { EASE, k, T } from "./timeline";

export type Rig = {
  root: THREE.Object3D;
  nodes: Record<string, THREE.Object3D>;
  rest: Record<string, { pos: THREE.Vector3; quat: THREE.Quaternion }>;
  centre: Record<string, THREE.Vector3>;      // bounding-box centre of each named node, car space
  axis: Record<string, THREE.Vector3>;        // for valves: the opening direction (car space, unit)
};

const WANT = [
  "cylinder_head", "valve_cover", "camshaft_intake", "camshaft_exhaust", "valves", "vanos_unit", "vanos_sprocket_intake",
  "vanos_sprocket_exhaust", "timing_chain", "engine_block", "oil_pan", "intake_manifold", "exhaust_manifold", "engine_front",
  "gearbox_case", "bell_housing", "torque_converter", "planetary_sets", "gearbox_pan", "propshaft", "diff_housing", "diff_cover",
  "ring_gear", "pinion", "spider_gears", "halfshaft_left", "halfshaft_right", "exhaust_system", "radiator", "fuel_tank",
  "subframe_front", "subframe_rear", "output_shaft", "propshaft_support", "gearbox_crossmember",
];

export const HEAD_GROUP = ["cylinder_head", "valve_cover", "camshaft_intake", "camshaft_exhaust", "valves", "vanos_unit",
  "vanos_sprocket_intake", "vanos_sprocket_exhaust", "timing_chain"];
export const VANOS_GROUP = ["vanos_unit", "vanos_sprocket_intake", "vanos_sprocket_exhaust"];
export const GEARBOX_GROUP = ["gearbox_case", "bell_housing", "torque_converter", "planetary_sets", "gearbox_pan", "output_shaft"];
export const DIFF_GROUP = ["diff_housing", "diff_cover", "ring_gear", "pinion", "spider_gears"];

/** Build a rig from loaded scenes (cloned): index the named nodes, remember their rest transforms and centres. */
export const makeRig = (scenes: THREE.Object3D[]): Rig => {
  const root = new THREE.Group();
  scenes.forEach((s) => root.add(s.clone(true)));
  root.updateMatrixWorld(true);
  const nodes: Rig["nodes"] = {}, rest: Rig["rest"] = {}, centre: Rig["centre"] = {}, axis: Rig["axis"] = {};
  root.traverse((o) => {
    const base = o.name.replace(/_\d+$/, "");
    const match = WANT.includes(o.name) ? o.name : (/^valve_c\d_(in|ex)\d$/.test(o.name) ? o.name : (WANT.includes(base) && !nodes[base] ? base : null));
    if (!match || nodes[match]) return;
    nodes[match] = o;
    rest[match] = { pos: o.position.clone(), quat: o.quaternion.clone() };
    const b = new THREE.Box3().setFromObject(o);
    if (!b.isEmpty()) centre[match] = b.getCenter(new THREE.Vector3());
  });
  // valve axes: the long axis of each valve's geometry, pointing away from the camshafts (into the cylinder)
  const head = centre["cylinder_head"], block = centre["engine_block"];
  const up = head && block ? head.clone().sub(block).normalize() : new THREE.Vector3(0, 1, 0);
  Object.keys(nodes).filter((n) => n.startsWith("valve_c")).forEach((n) => {
    const pts: THREE.Vector3[] = [];
    nodes[n].traverse((o) => {
      const g = (o as THREE.Mesh).geometry as THREE.BufferGeometry | undefined;
      if (!g) return;
      const p = g.attributes.position;
      for (let i = 0; i < p.count; i += Math.max(1, Math.floor(p.count / 200))) pts.push(new THREE.Vector3().fromBufferAttribute(p, i).applyMatrix4(o.matrixWorld));
    });
    if (pts.length < 3) return;
    const c = pts.reduce((a, b) => a.add(b), new THREE.Vector3()).multiplyScalar(1 / pts.length);
    let best = new THREE.Vector3(0, 1, 0), bestD = -1;
    for (const p of pts) { const d = p.distanceTo(c); if (d > bestD) { bestD = d; best = p.clone().sub(c).normalize(); } }
    if (best.dot(up) > 0) best.negate();
    axis[n] = best;
  });
  ["propshaft", "halfshaft_left", "halfshaft_right"].forEach((n) => {
    const node = nodes[n]; if (!node) return;
    const pts: THREE.Vector3[] = [];
    node.traverse((o) => {
      const g = (o as THREE.Mesh).geometry as THREE.BufferGeometry | undefined; if (!g) return;
      const p = g.attributes.position;
      for (let i = 0; i < p.count; i += Math.max(1, Math.floor(p.count / 400))) pts.push(new THREE.Vector3().fromBufferAttribute(p, i).applyMatrix4(o.matrixWorld));
    });
    if (pts.length < 3) return;
    const c = pts.reduce((a, b) => a.add(b), new THREE.Vector3()).multiplyScalar(1 / pts.length);
    let best = new THREE.Vector3(1, 0, 0), bestD = -1;
    for (const p of pts) { const d = p.distanceTo(c); if (d > bestD) { bestD = d; best = p.clone().sub(c).normalize(); } }
    axis[n] = best; centre[n] = c;
  });
  return { root, nodes, rest, centre, axis };
};

const setOffset = (rig: Rig, name: string, offCar: THREE.Vector3, rotAxisCar?: THREE.Vector3, angle = 0, pivotCar?: THREE.Vector3) => {
  const o = rig.nodes[name]; const r = rig.rest[name];
  if (!o || !r) return;
  // the parent's world (car) matrix, to convert car-space offsets into the node's parent space
  const parentInv = o.parent ? new THREE.Matrix4().copy(o.parent.matrixWorld).invert() : new THREE.Matrix4();
  const restWorld = new THREE.Matrix4().compose(r.pos, r.quat, o.scale);
  if (o.parent) restWorld.premultiply(o.parent.matrixWorld);
  let world = restWorld.clone();
  if (rotAxisCar && angle) {
    const piv = pivotCar ?? new THREE.Vector3().setFromMatrixPosition(restWorld);
    const R = new THREE.Matrix4().makeRotationAxis(rotAxisCar, angle);
    const Tm = new THREE.Matrix4().makeTranslation(piv.x, piv.y, piv.z);
    const Ti = new THREE.Matrix4().makeTranslation(-piv.x, -piv.y, -piv.z);
    world = Tm.multiply(R).multiply(Ti).multiply(world);
  }
  world.premultiply(new THREE.Matrix4().makeTranslation(offCar.x, offCar.y, offCar.z));
  const local = parentInv.multiply(world);
  local.decompose(o.position, o.quaternion, new THREE.Vector3());
};

/** Turn a node about one of its own local axes (through its origin), on top of its current local pose. Nodes that
 * setOffset does not move keep their rest rotation, remembered on first use. */
const AX = { x: new THREE.Vector3(1, 0, 0), y: new THREE.Vector3(0, 1, 0), z: new THREE.Vector3(0, 0, 1) };
const spinRest = new WeakMap<THREE.Object3D, THREE.Quaternion>();
const spinLocal = (rig: Rig, name: string, axis: "x" | "y" | "z", angle: number) => {
  const o = rig.nodes[name] ?? rig.root.getObjectByName(name);
  if (!o) return;
  if (!rig.nodes[name] || !rig.rest[name]) {
    if (!spinRest.has(o)) spinRest.set(o, o.quaternion.clone());
    o.quaternion.copy(spinRest.get(o)!);
  }
  o.quaternion.multiply(new THREE.Quaternion().setFromAxisAngle(AX[axis], angle));
};

// the rig's root sits at the car origin, so "car space" = the rig root's space. Parents' matrixWorld are relative
// to the root because the rig root is reset to identity while posing (see poseRig).
export type RigState = {
  head: number; vanos: number; gearbox: number; diff: number;      // 0..1 how far each group is out
  camAngle: number; vanosShift: number; valveLift: Record<string, number>;
  gbIn: number; gbOut: number; ring: number; pinion: number; diffD: number; gear: number;   // turns (revolutions), integrated
  wheelL: number; wheelR: number; propPulse: number;              // radians
  gbGlass: number; diffGlass: number; coverOff: number;
};

const FIRING = [1, 5, 3, 6, 2, 4];
const RATIOS = [3.67, 2.0, 1.41, 1.0, 0.74];   // ZF 5HP19 forward gears
const FINAL = 44 / 13;                           // 3.38 final drive as modelled (ring 44, pinion 13 teeth)

/** Speeds in rev/s at frame g: gearbox input and output (the ratio eases into the next gear just before the
 * read-out steps), the ring gear, and the corner difference between the rear wheels. */
const speedsAt = (g: number) => {
  const t = g / 30;
  const gbRun = k(g, "gearbox+1.3", 0.6, EASE.soft) * (1 - k(g, "diff-0.2", 0.5, EASE.move));
  const x = Math.max(0, t - T.s("gearbox+1.6")) / 0.55;
  const i = Math.min(4, Math.floor(x));
  const blend = i >= 4 ? 0 : EASE.move(Math.min(1, Math.max(0, (x - i - 0.72) / 0.28)));
  const ratio = RATIOS[i] + (RATIOS[Math.min(4, i + 1)] - RATIOS[i]) * blend;
  const gin = 1.1 * gbRun;
  const dRun = k(g, "diff+1.6", 0.6, EASE.soft) * (1 - k(g, "outro", 0.6, EASE.move));
  const ring = 0.35 * dRun;
  const corner = k(g, "diff+2.8", 0.6, EASE.move);
  return [gin, gin / ratio, ring, 0.35 * corner * ring];
};
const SUB = 4;
let TURNS: Float64Array[] | null = null;
/** Turns since the start of the film (trapezoid sums of speedsAt, 4 steps per frame, interpolated in between). */
const turnsAt = (g: number) => {
  if (!TURNS) {
    const n = Math.ceil(T.f("end")) * SUB + SUB * 4;
    TURNS = [0, 1, 2, 3].map(() => new Float64Array(n));
    let prev = speedsAt(0);
    for (let j = 1; j < n; j++) {
      const cur = speedsAt(j / SUB);
      for (let c = 0; c < 4; c++) TURNS[c][j] = TURNS[c][j - 1] + (prev[c] + cur[c]) / 2 / (30 * SUB);
      prev = cur;
    }
  }
  const x = Math.max(0, g * SUB), j = Math.min(TURNS[0].length - 2, Math.floor(x)), f = Math.min(1, x - j);
  const at = (c: number) => TURNS![c][j] + (TURNS![c][j + 1] - TURNS![c][j]) * f;
  return { gbIn: at(0), gbOut: at(1), ring: at(2), d: at(3) };
};

export const rigStateAt = (g: number): RigState => {
  const t = g / 30;
  const head = k(g, "head+0.8", 0.9, EASE.soft) * (1 - k(g, "vanos+3.5", 0.8, EASE.move));
  const vanos = k(g, "vanos+0.9", 0.8, EASE.soft) * (1 - k(g, "vanos+3.4", 0.7, EASE.move));
  const gearbox = k(g, "gearbox+0.8", 0.8, EASE.soft) * (1 - k(g, "diff-0.1", 0.7, EASE.move));
  const diff = k(g, "diff+1.1", 0.8, EASE.soft) * (1 - k(g, "outro-0.2", 0.8, EASE.move));
  // camshafts turn from the head beat into the VANOS beat (half crank speed, shown slowly: 0.45 rev/s)
  const camRun = k(g, "head+1.5", 0.8, EASE.soft) * (1 - k(g, "vanos+3.6", 0.6, EASE.move));
  const camAngle = (t - T.s("head+1.5")) * 2 * Math.PI * 0.45 * camRun;
  // the VANOS shift: the sprockets turn against their camshafts (exaggerated x1.0 of the cam angle in degrees)
  const vanosShift = k(g, "vanos+2.1", 0.7, EASE.move) * (1 - k(g, "vanos+3.1", 0.4, EASE.move));
  const valveLift: Record<string, number> = {};
  for (let c = 1; c <= 6; c++) {
    const order = FIRING.indexOf(c);
    const phIn = camAngle - order * (Math.PI * 2 / 6);              // cam degrees between firings: 60
    const lobe = (ph: number) => { const x = ((ph % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI); return x < 2.0 ? Math.sin(x / 2.0 * Math.PI) : 0; };
    const li = lobe(phIn) * camRun, le = lobe(phIn + 1.9) * camRun;
    valveLift[`valve_c${c}_in1`] = li; valveLift[`valve_c${c}_in2`] = li;
    valveLift[`valve_c${c}_ex1`] = le; valveLift[`valve_c${c}_ex2`] = le;
  }
  // gearbox: the gear steps 1 -> 5; the drivetrain angles are integrated speeds (see turnsAt), so nothing jumps
  const gear = Math.min(5, 1 + Math.floor(Math.max(0, t - T.s("gearbox+1.6")) / 0.55));
  const tn = turnsAt(g);
  const wheelL = (tn.ring - tn.d) * 2 * Math.PI, wheelR = (tn.ring + tn.d) * 2 * Math.PI;
  const propPulse = k(g, "diff+0.05", 0.75, EASE.move);
  const gbGlass = k(g, "gearbox+1.1", 0.5, EASE.move) * (1 - k(g, "diff-0.3", 0.4, EASE.move));
  const diffGlass = k(g, "diff+1.5", 0.5, EASE.move) * (1 - k(g, "outro-0.3", 0.4, EASE.move));
  const coverOff = k(g, "head+1.25", 0.6, EASE.move) * (1 - k(g, "vanos+3.3", 0.5, EASE.move));
  return { coverOff, head, vanos, gearbox, diff, camAngle, vanosShift, valveLift, gbIn: tn.gbIn, gbOut: tn.gbOut, ring: tn.ring,
    pinion: tn.ring * FINAL, diffD: tn.d, gear, wheelL, wheelR, propPulse, gbGlass, diffGlass };
};

export const poseRig = (rig: Rig, st: RigState) => {
  const saved = rig.root.matrix.clone();
  rig.root.matrix.identity(); rig.root.matrixWorld.identity();
  rig.root.updateMatrixWorld(true);
  const head = rig.centre["cylinder_head"], block = rig.centre["engine_block"];
  const up = head && block ? head.clone().sub(block).normalize() : new THREE.Vector3(0, 1, 0);
  const X = new THREE.Vector3(1, 0, 0);
  const headOff = up.clone().multiplyScalar(0.42 * st.head);
  const vanosOff = headOff.clone().add(new THREE.Vector3(0.24 * st.vanos, 0, 0));
  HEAD_GROUP.forEach((n) => {
    if (VANOS_GROUP.includes(n)) return;
    if (n === "camshaft_intake" || n === "camshaft_exhaust") {
      const piv = rig.centre[n] ? new THREE.Vector3().setFromMatrixPosition(rig.nodes[n].matrixWorld) : undefined;
      setOffset(rig, n, headOff, X, st.camAngle, piv);
    } else if (n === "valve_cover") setOffset(rig, n, headOff.clone().add(up.clone().multiplyScalar(0.95 * st.coverOff)));
    else setOffset(rig, n, headOff);
  });
  ["vanos_unit"].forEach((n) => setOffset(rig, n, vanosOff));
  ["vanos_sprocket_intake", "vanos_sprocket_exhaust"].forEach((n, i) => {
    const o = rig.nodes[n]; if (!o) return;
    const piv = new THREE.Vector3().setFromMatrixPosition(o.matrixWorld);
    const shift = (i === 0 ? 20 : -12.5) * Math.PI / 180 * st.vanosShift;
    setOffset(rig, n, headOff, X, st.camAngle + shift, piv);   // the sprockets stay on their camshafts
  });
  // valves open along their axes (real lift, shown x1.6)
  Object.keys(rig.nodes).filter((n) => n.startsWith("valve_c")).forEach((n) => {
    const a = rig.axis[n]; if (!a) return;
    const o = rig.nodes[n];
    // valves are children of 'valves', which already moved with the head: offset relative to the parent
    // (intake cam 9.7 mm; the exhaust cam carries over from the M52TU, about 9.0 mm)
    const lift = (st.valveLift[n] ?? 0) * (n.includes("_ex") ? 0.0090 : 0.0097) * 1.6;
    const r = rig.rest[n];
    const pinv = new THREE.Matrix4().copy(o.parent!.matrixWorld).invert();
    const dirLocal = a.clone().transformDirection(pinv);
    o.position.copy(r.pos).addScaledVector(dirLocal, lift);
  });
  const gbOff = new THREE.Vector3(0, -0.36 * st.gearbox, 0);
  GEARBOX_GROUP.forEach((n) => setOffset(rig, n, gbOff));
  // inside the gearbox every part turns about its own local X (origins on the axis; all turn clockwise seen from
  // the front, so negative). Converter: impeller with the engine, turbine with a little slip, stator held.
  // Ravigneaux set: large sun = input, ring = output, carrier from the planetary equation (sun 30, ring 72 teeth),
  // planets about their pins relative to the carrier. Tail set: sun held, ring 1.42x output, carrier = output.
  const Zs = 30, Zr = 72, Zp = 21;
  const cRav = (Zs * st.gbIn + Zr * st.gbOut) / (Zs + Zr);
  const pRav = -(st.gbIn - cRav) * Zs / Zp;
  const spins: [string, number][] = [
    ["torque_converter_shell", st.gbIn], ["impeller", st.gbIn], ["lockup_clutch", st.gbIn], ["turbine", st.gbIn * 0.93], ["stator", 0],
    ["input_shaft", st.gbIn * 0.93], ["rav_sun_large", st.gbIn * 0.93], ["rav_sun_small", cRav + (st.gbIn - cRav) * 1.5],
    ["rav_ring", st.gbOut], ["rav_carrier", cRav], ["tail_ring", st.gbOut * 1.42], ["tail_sun", 0], ["tail_carrier", st.gbOut],
    ["output_shaft", st.gbOut],
  ];
  for (let i = 1; i <= 3; i++) spins.push([`rav_planet_long_${i}`, pRav], [`rav_planet_short_${i}`, -pRav * 1.3]);
  for (let i = 1; i <= 4; i++) spins.push([`tail_planet_${i}`, st.gbOut * Zs / Zp]);
  spins.forEach(([n, turns]) => spinLocal(rig, n, "x", -turns * 2 * Math.PI));
  // the propshaft turns with the pinion; the half-shafts with their wheels
  ["propshaft", "propshaft_support", "halfshaft_left", "halfshaft_right"].forEach((n) => setOffset(rig, n, new THREE.Vector3()));
  spinLocal(rig, "propshaft", "x", -st.pinion * 2 * Math.PI);
  spinLocal(rig, "halfshaft_left", "z", -st.wheelL);
  spinLocal(rig, "halfshaft_right", "z", -st.wheelR);
  // the differential moves back out of the axle; the pinion drives the ring gear, the carrier turns with the ring,
  // and in the corner the side gears turn against the carrier and the spider gears about their pin
  const dOff = new THREE.Vector3(-0.30 * st.diff, -0.08 * st.diff, 0);
  DIFF_GROUP.forEach((n) => setOffset(rig, n, dOff));
  spinLocal(rig, "pinion", "x", -st.pinion * 2 * Math.PI);
  spinLocal(rig, "ring_gear", "z", -st.ring * 2 * Math.PI);
  spinLocal(rig, "spider_gears", "z", -st.ring * 2 * Math.PI);
  spinLocal(rig, "side_gear_left", "z", st.diffD * 2 * Math.PI);
  spinLocal(rig, "side_gear_right", "z", -st.diffD * 2 * Math.PI);
  spinLocal(rig, "spider_gear_top", "y", st.diffD * 1.4 * 2 * Math.PI);
  spinLocal(rig, "spider_gear_bottom", "y", -st.diffD * 1.4 * 2 * Math.PI);
  rig.root.matrix.copy(saved);
};
