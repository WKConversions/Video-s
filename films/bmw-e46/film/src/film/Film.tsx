// The film: Karl's brother's BMW 330Ci Coupé (E46, 2001) in a bright studio. The car never stops turning; its body
// lifts off and turns to glass, and five things are pointed at inside it, taken out and explained.
import { Line } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { CameraMotionBlur } from "@remotion/motion-blur";
import { ThreeCanvas } from "@remotion/three";
import React, { useLayoutEffect, useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import * as THREE from "three";
import { CarBody, Studio, useCarAssets, useCarMaterials } from "../car/Car";
import { makeLook } from "../car/materials";
import { DrawWhenReady } from "../useGlb";
import { Overlay } from "./Overlay";
import { makePartU, makeShared, patchTree, PartU } from "./partMaterials";
import { DIFF_GROUP, GEARBOX_GROUP, HEAD_GROUP, makeRig, poseRig, Rig, rigStateAt, VANOS_GROUP } from "./parts";
import roof from "./rooflines.json";
import { bodyLiftAt, cameraAt, carMatrix, EASE, floatAt, k, lerp, poseAt, shadowAt, sweepAt, xrayFadeAt } from "./timeline";

export type FilmProps = { blurSamples: number; internals: string[] };

const Cam: React.FC<{ g: number }> = ({ g }) => {
  const { camera } = useThree();
  useLayoutEffect(() => {
    const c = cameraAt(g); const cam = camera as THREE.PerspectiveCamera;
    cam.fov = c.fov; cam.near = 0.05; cam.far = 120;
    cam.position.set(...c.pos); cam.lookAt(...c.target); cam.updateProjectionMatrix();
  }, [g, camera]);
  return null;
};

/** A soft contact shadow that follows the car on the floor and fades as the car rises. */
const useShadowTex = () => useMemo(() => {
  const c = document.createElement("canvas"); c.width = 256; c.height = 128;
  const x = c.getContext("2d")!;
  const gr = x.createRadialGradient(128, 64, 4, 128, 64, 120);
  gr.addColorStop(0, "rgba(20,24,32,0.95)"); gr.addColorStop(0.45, "rgba(20,24,32,0.55)"); gr.addColorStop(1, "rgba(20,24,32,0)");
  x.fillStyle = gr; x.save(); x.scale(1, 0.5); x.beginPath(); x.arc(128, 128, 126, 0, Math.PI * 2); x.fill(); x.restore();
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}, []);

export const Film: React.FC<FilmProps> = ({ blurSamples, internals }) => {
  const g = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const extras = useMemo(() => ["details", "wheels", ...internals], [internals]);
  const { assets, handle } = useCarAssets(extras);
  const look = useMemo(() => makeLook(), []);
  const mats = useCarMaterials(assets, look);
  const S = useMemo(() => makeShared(), []);
  const shadowTex = useShadowTex();

  // per-part uniforms: one set per beat group, plus one for everything else
  const U = useMemo(() => ({ rest: makePartU(), head: makePartU(), cams: makePartU(), cover: makePartU(), vanos: makePartU(), gearbox: makePartU(), diff: makePartU(),
    prop: makePartU(), shell: makePartU(), wheels: makePartU(), wheelsR: makePartU(), cabin: makePartU() }), []);

  const built = useMemo(() => {
    if (!assets) return null;
    const details = assets.extras.details.clone(true);
    patchTree(details, "shell", S, U.shell, "details");
    const wheels = assets.extras.wheels.clone(true);
    wheels.traverse((o) => {
      if (!(o as THREE.Mesh).isMesh) return;
      const isTyre = /tyre|rubber/i.test(o.name + ((o as THREE.Mesh).material as THREE.Material).name);
      let p: THREE.Object3D | null = o; let rear = false;
      while (p) { if (/_R[LR]$/.test(p.name)) rear = true; p = p.parent; }
      patchTree(o, isTyre ? "tyre" : "mech", S, rear ? U.wheelsR : U.wheels, isTyre ? "tyre" : "wheel");
    });
    // the interior belongs to the body: it lifts with it and turns to clay behind the sweep like the mechanical parts
    const cabin = assets.extras.interior ? assets.extras.interior.clone(true) : null;
    if (cabin) patchTree(cabin, "mech", S, U.cabin, "cabin");
    const mech = internals.filter((n) => n !== "interior");
    const rig: Rig | null = mech.length ? makeRig(mech.map((n) => assets.extras[n])) : null;
    if (rig) {
      const groupOf = (name: string): PartU => {
        if (VANOS_GROUP.includes(name)) return U.vanos;
        if (name === "valve_cover") return U.cover;
        if (name.startsWith("camshaft") || /^valve_c\d/.test(name) || name.startsWith("spring_")) return U.cams;
        if (HEAD_GROUP.includes(name) || name.startsWith("valve")) return U.head;
        if (GEARBOX_GROUP.includes(name)) return U.gearbox;
        if (DIFF_GROUP.includes(name)) return U.diff;
        if (name === "propshaft") return U.prop;
        return U.rest;
      };
      // patch each named subtree with its group's uniforms (deepest names first so children keep their own group)
      const done = new Set<THREE.Object3D>();
      Object.entries(rig.nodes).sort((a, b) => b[0].length - a[0].length).forEach(([name, node]) => {
        node.traverse((o) => { if ((o as THREE.Mesh).isMesh && !done.has(o)) { patchTree(o, "mech", S, groupOf(name), name); done.add(o); } });
      });
      rig.root.traverse((o) => { if ((o as THREE.Mesh).isMesh && !done.has(o)) { patchTree(o, "mech", S, U.rest, "rest"); done.add(o); } });
    }
    // the cases that turn to glass to show what turns inside them
    const caseMats = { gearbox: [] as THREE.Material[], diff: [] as THREE.Material[] };
    if (rig) {
      ([["gearbox", ["gearbox_case", "bell_housing", "gearbox_pan"]], ["diff", ["diff_housing", "diff_cover"]]] as ["gearbox" | "diff", string[]][]).forEach(([key, names]) => {
        names.forEach((n) => rig.nodes[n]?.traverse((o) => {
          const m = (o as THREE.Mesh).material as THREE.Material | undefined;
          if (m) { m.transparent = true; caseMats[key].push(m); }
        }));
      });
    }
    return { details, wheels, rig, caseMats, cabin };
  }, [assets, internals, S, U]);

  // ------------------------------------------------------------------ state for this frame
  const pose = poseAt(g);
  const float = floatAt(g);
  const M = carMatrix(pose, float);
  const lift = bodyLiftAt(g);
  look.sweep.value = sweepAt(g);
  look.xrayFade.value = xrayFadeAt(g);
  S.uSweep.value = look.sweep.value;
  S.uCarInv.value.copy(M).invert();
  const st = rigStateAt(g);
  // highlights: a pulse in, a steady glow while out
  const hi = (start: string, end: string) => k(g, start, 0.35, EASE.arrive) * (1 - k(g, end, 0.5, EASE.move));
  U.head.uHi.value = hi("head+0.2", "vanos+0.2");
  U.cams.uHi.value = U.head.uHi.value * 0.18;
  // the valve cover lifts off the head and fades, so the camshafts and valves show; it comes back with the head
  U.cover.uHi.value = U.head.uHi.value * 0.55;
  U.cover.uAlpha.value = 1 - Math.min(1, Math.max(0, (st.coverOff - 0.55) / 0.45));
  U.cover.uDim.value = Math.max(st.gearbox, st.diff);
  U.cams.uDim.value = Math.max(st.gearbox, st.diff);
  U.vanos.uHi.value = hi("vanos+0.3", "vanos+3.6") + (1 - k(g, "vanos+0.3", 0.3)) * U.head.uHi.value;
  U.gearbox.uHi.value = hi("gearbox+0.3", "diff");
  U.diff.uHi.value = hi("diff+0.6", "outro");
  U.prop.uHi.value = k(g, "diff", 0.2) * (1 - k(g, "diff+0.9", 0.5));
  U.wheelsR.uHi.value = 0.55 * k(g, "diff+2.6", 0.5) * (1 - k(g, "outro", 0.5));
  // everything else steps back while a part is out
  const out = Math.max(st.head, st.gearbox, st.diff);
  U.rest.uDim.value = out; U.wheels.uDim.value = out; U.wheelsR.uDim.value = st.head + st.gearbox;
  U.head.uDim.value = Math.max(st.gearbox, st.diff); U.vanos.uDim.value = U.head.uDim.value;
  U.gearbox.uDim.value = Math.max(st.head, st.diff); U.diff.uDim.value = Math.max(st.head, st.gearbox);
  U.prop.uDim.value = Math.max(st.head, st.gearbox) * (1 - U.prop.uHi.value);
  // the cabin stays a quiet ghost in the x-ray, quieter still while a part is out
  U.cabin.uDim.value = 0.55 + 0.45 * out;
  if (built?.rig) poseRig(built.rig, st);
  if (built) {
    const glassy = (ms: THREE.Material[], a: number) => ms.forEach((m) => { m.opacity = 1 - 0.78 * a; m.depthWrite = a < 0.05; });
    glassy(built.caseMats.gearbox, st.gbGlass); glassy(built.caseMats.diff, st.diffGlass);
  }
  // the power pulse runs down the propshaft from the gearbox to the differential
  U.prop.uPulse.value = st.propPulse > 0 && st.propPulse < 1 ? lerp(0.1, -1.3, st.propPulse) : -99;
  if (built) {
    const sp = (name: string, a: number) => { const o = built.wheels.getObjectByName(name); if (o) o.rotation.z = -a; };
    sp("spin_RL", st.wheelL); sp("spin_RR", st.wheelR);
  }

  // the roof lines of the body beat: the coupé's own line drawn in blue, the sedan's above it as a ghost that drops
  const drawOn = k(g, "body+0.7", 1.0, EASE.move);
  const ghostIn = k(g, "body+1.55", 0.4) * (1 - k(g, "lift-0.25", 0.3, EASE.move));
  const ghostDrop = k(g, "body+2.25", 0.85, EASE.move);
  const lineOut = 1 - k(g, "lift-0.2", 0.35, EASE.move);
  const toCar = (s: number, h: number, dz = 0) => new THREE.Vector3((2136.5 - s) / 1000, h / 1000 + 0.006, dz);
  const coupePts = roof.s.map((s, i) => toCar(s, roof.coupe_h[i]));
  const nDraw = Math.max(2, Math.round(coupePts.length * drawOn));
  const ghostPts = roof.s.map((s, i) => toCar(s, lerp(roof.sedan_h[i], roof.coupe_h[i] + 2, ghostDrop)));

  const ready = !!(assets && mats && built);
  const scene = (
    <ThreeCanvas width={width} height={height} gl={{ antialias: true, preserveDrawingBuffer: true }}>
      <Cam g={g} />
      <Studio />
      {/* floor shadow */}
      <mesh rotation-x={-Math.PI / 2} position={[new THREE.Vector3(0, 0, 0).applyMatrix4(M).x, 0.002, new THREE.Vector3(0, 0, 0).applyMatrix4(M).z]} rotation-z={pose.yaw * Math.PI / 180}>
        <planeGeometry args={[5.6, 2.6]} />
        <meshBasicMaterial map={shadowTex} transparent opacity={0.62 * shadowAt(g, M)} depthWrite={false} toneMapped={false} />
      </mesh>
      <group matrixAutoUpdate={false} matrix={M}>
        {ready && (
          <>
            <group position={[0, lift, 0]}>
              <CarBody assets={assets!} mats={mats!} sweep={look.sweep.value} />
              <primitive object={built!.details} />
              {built!.cabin && <primitive object={built!.cabin} />}
            </group>
            <primitive object={built!.wheels} />
            {built!.rig && <primitive object={built!.rig.root} />}
            {drawOn > 0 && lineOut > 0.01 && (
              <group position={[0, lift, 0]}>
                <Line points={coupePts.slice(0, nDraw)} color="#1C69D4" lineWidth={4} transparent opacity={lineOut} />
                {ghostIn > 0.01 && <Line points={ghostPts} color="#8A93A3" lineWidth={2.5} dashed dashSize={0.05} gapSize={0.035}
                  transparent opacity={ghostIn * 0.9} />}
              </group>
            )}
          </>
        )}
      </group>
      <DrawWhenReady ready={ready} handle={handle} />
    </ThreeCanvas>
  );
  return (
    <AbsoluteFill style={{ background: "radial-gradient(120% 95% at 50% 42%, #FBFBFC 0%, #F1F3F6 55%, #E4E8EE 100%)" }}>
      {blurSamples > 1 ? <CameraMotionBlur samples={blurSamples} shutterAngle={180}>{scene}</CameraMotionBlur> : scene}
      <AbsoluteFill style={{ pointerEvents: "none", opacity: k(g, "head+0.3", 0.5) * (1 - k(g, "diff+0.2", 0.5)),
        background: "linear-gradient(90deg, rgba(246,247,249,0.94) 0%, rgba(246,247,249,0.86) 26%, rgba(246,247,249,0) 46%)" }} />
      <AbsoluteFill style={{ pointerEvents: "none", opacity: k(g, "diff+0.4", 0.5) * (1 - k(g, "outro", 0.5)),
        background: "linear-gradient(270deg, rgba(246,247,249,0.94) 0%, rgba(246,247,249,0.86) 26%, rgba(246,247,249,0) 46%)" }} />
      <Overlay g={g} M={M} lift={lift} rig={built?.rig ?? null} ghost={{ ghostIn, ghostDrop }} />
    </AbsoluteFill>
  );
};
