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
  "subframe_front", "subframe_rear", "seats", "dashboard", "steering_wheel",
];

export const HEAD_GROUP = ["cylinder_head", "valve_cover", "camshaft_intake", "camshaft_exhaust", "valves", "vanos_unit",
  "vanos_sprocket_intake", "vanos_sprocket_exhaust", "timing_chain"];
export const VANOS_GROUP = ["vanos_unit", "vanos_sprocket_intake", "vanos_sprocket_exhaust"];
export const GEARBOX_GROUP = ["gearbox_case", "bell_housing", "torque_converter", "planetary_sets", "gearbox_pan"];
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

// the rig's root sits at the car origin, so "car space" = the rig root's space. Parents' matrixWorld are relative
// to the root because the rig root is reset to identity while posing (see poseRig).
export type RigState = {
  head: number; vanos: number; gearbox: number; diff: number;      // 0..1 how far each group is out
  camAngle: number; vanosShift: number; valveLift: Record<string, number>;
  converter: number; planets: number; ring: number; pinion: number; gear: number;
  wheelL: number; wheelR: number; propPulse: number;
  gbGlass: number; diffGlass: number; coverOff: number;
};

const FIRING = [1, 5, 3, 6, 2, 4];

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
  // gearbox: the converter and planetary sets turn, the gear steps 1 -> 5
  const gbRun = k(g, "gearbox+1.3", 0.6, EASE.soft) * (1 - k(g, "diff-0.2", 0.5, EASE.move));
  const gear = Math.min(5, 1 + Math.floor(Math.max(0, t - T.s("gearbox+1.6")) / 0.55));
  const converter = (t - T.s("gearbox")) * 2 * Math.PI * 1.1 * gbRun;
  const planets = (t - T.s("gearbox")) * 2 * Math.PI * (0.35 + gear * 0.12) * gbRun;
  // the differential: pinion turns the ring gear (3.38:1 shown as ratio); wheels: straight, then a left-hand corner
  const dRun = k(g, "diff+1.6", 0.6, EASE.soft) * (1 - k(g, "outro", 0.6, EASE.move));
  const ringSpeed = 0.35;  // rev/s
  const ring = (t - T.s("diff")) * 2 * Math.PI * ringSpeed * dRun;
  const pinion = ring * 3.38;
  const corner = k(g, "diff+2.8", 0.6, EASE.move);
  const wheelL = ring * (1 - 0.35 * corner), wheelR = ring * (1 + 0.35 * corner);
  const propPulse = k(g, "diff+0.05", 0.75, EASE.move);
  const gbGlass = k(g, "gearbox+1.1", 0.5, EASE.move) * (1 - k(g, "diff-0.3", 0.4, EASE.move));
  const diffGlass = k(g, "diff+1.5", 0.5, EASE.move) * (1 - k(g, "outro-0.3", 0.4, EASE.move));
  const coverOff = k(g, "head+1.25", 0.6, EASE.move) * (1 - k(g, "vanos+3.3", 0.5, EASE.move));
  return { coverOff, head, vanos, gearbox, diff, camAngle, vanosShift, valveLift, converter, planets, ring, pinion, gear, wheelL, wheelR, propPulse, gbGlass, diffGlass };
};

export const poseRig = (rig: Rig, st: RigState) => {
  const saved = rig.root.matrix.clone();
  rig.root.matrix.identity(); rig.root.matrixWorld.identity();
  rig.root.updateMatrixWorld(true);
  const head = rig.centre["cylinder_head"], block = rig.centre["engine_block"];
  const up = head && block ? head.clone().sub(block).normalize() : new THREE.Vector3(0, 1, 0);
  const X = new THREE.Vector3(1, 0, 0), Z = new THREE.Vector3(0, 0, 1);
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
  // valves open along their axes (lift 9.7 mm, shown x1.6)
  Object.keys(rig.nodes).filter((n) => n.startsWith("valve_c")).forEach((n) => {
    const a = rig.axis[n]; if (!a) return;
    const o = rig.nodes[n];
    // valves are children of 'valves', which already moved with the head: offset relative to the parent
    const lift = (st.valveLift[n] ?? 0) * 0.0097 * 1.6;
    const r = rig.rest[n];
    const pinv = new THREE.Matrix4().copy(o.parent!.matrixWorld).invert();
    const dirLocal = a.clone().transformDirection(pinv);
    o.position.copy(r.pos).addScaledVector(dirLocal, lift);
  });
  const gbOff = new THREE.Vector3(0, -0.36 * st.gearbox, 0);
  GEARBOX_GROUP.forEach((n) => {
    if (n === "torque_converter" || n === "planetary_sets") {
      const piv = rig.nodes[n] ? new THREE.Vector3().setFromMatrixPosition(rig.nodes[n].matrixWorld) : undefined;
      setOffset(rig, n, gbOff, X, n === "torque_converter" ? st.converter : st.planets, piv);
    } else setOffset(rig, n, gbOff);
  });
  // the propshaft turns with the pinion; the half-shafts with their wheels
  ([["propshaft", st.pinion], ["halfshaft_left", -st.wheelL], ["halfshaft_right", -st.wheelR]] as [string, number][]).forEach(([n, a]) => {
    if (!rig.nodes[n]) return;
    setOffset(rig, n, new THREE.Vector3(), rig.axis[n] ?? (n === "propshaft" ? X : Z), a, rig.centre[n]);
  });
  const dOff = new THREE.Vector3(-0.30 * st.diff, -0.08 * st.diff, 0);
  DIFF_GROUP.forEach((n) => {
    const o = rig.nodes[n]; if (!o) return;
    const piv = new THREE.Vector3().setFromMatrixPosition(o.matrixWorld);
    if (n === "ring_gear" || n === "spider_gears") setOffset(rig, n, dOff, Z, st.ring, piv);
    else if (n === "pinion") setOffset(rig, n, dOff, X, st.pinion, piv);
    else setOffset(rig, n, dOff);
  });
  rig.root.matrix.copy(saved);
};
