// Model preview: orthographic blueprint views (side, front, rear, top) and a 3/4 view, to compare with the drawing.
import { Environment, Lightformer } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { ThreeCanvas } from "@remotion/three";
import React, { useLayoutEffect, useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import * as THREE from "three";
import { DrawWhenReady, useGlbs } from "./useGlb";

const VIEWS: Record<number, { pos: [number, number, number]; up?: [number, number, number]; ortho: boolean }> = {
  0: { pos: [0, 0.68, 30], ortho: true },           // side (car's right)
  1: { pos: [30, 0.68, 0], ortho: true },           // front
  2: { pos: [-30, 0.68, 0], ortho: true },          // rear
  3: { pos: [0, 30, 0], up: [-1, 0, 0], ortho: true }, // top
  4: { pos: [6.5, 2.4, 6.5], ortho: false },        // 3/4 front
  5: { pos: [-6.5, 1.6, 6.0], ortho: false },       // 3/4 rear
  6: { pos: [7.5, 0.9, 3.2], ortho: false },        // low front
  7: { pos: [5.2, 1.05, -3.9], ortho: false },       // front-left, like the photo of the car
  8: { pos: [-5.0, 1.3, -4.2], ortho: false },       // rear-left
  9: { pos: [2.2, 1.0, -7.2], ortho: false },        // left side, a little forward
};

const Cam: React.FC<{ v: number }> = ({ v }) => {
  const { camera } = useThree();
  useLayoutEffect(() => {
    const V = VIEWS[v];
    // blueprint views: a very long lens from far away (near-orthographic)
    const cam = camera as THREE.PerspectiveCamera;
    const far = V.ortho ? 70 : 1;
    cam.fov = V.ortho ? 4.55 : 30; cam.near = 0.1; cam.far = 200;
    cam.position.set(V.pos[0] * (V.ortho ? far / 30 : 1), V.ortho ? (V.up ? V.pos[1] * far / 30 : V.pos[1]) : V.pos[1], V.pos[2] * (V.ortho ? far / 30 : 1));
    cam.up.set(0, 1, 0);
    if (V.up) cam.up.set(...V.up);
    cam.lookAt(V.ortho ? 0 : 0.15, V.ortho ? 0.68 : 0.62, 0);
    cam.updateProjectionMatrix();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [v, camera]);
  return null;
};

export const Preview: React.FC<{ model?: string; mode?: "clay" | "paint" }> = ({ model = "models/body.glb", mode = "clay" }) => {
  const g = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const { scenes, handle } = useGlbs([model]);
  const scene = scenes ? scenes[0] : null;
  const mat = useMemo(() => mode === "clay"
    ? new THREE.MeshStandardMaterial({ color: "#C9CDD3", roughness: 0.55, metalness: 0.0 })
    : new THREE.MeshPhysicalMaterial({ color: "#0B0D11", metalness: 0.5, roughness: 0.3, clearcoat: 1, clearcoatRoughness: 0.05 }), [mode]);
  const obj = useMemo(() => {
    if (!scene) return null;
    const c = scene.clone(true);
    c.traverse((o) => { if ((o as THREE.Mesh).isMesh) (o as THREE.Mesh).material = mat; });
    return c;
  }, [scene, mat]);
  return (
    <AbsoluteFill style={{ background: "#F2F3F6" }}>
      <ThreeCanvas width={width} height={height} gl={{ antialias: true, preserveDrawingBuffer: true }}>
        <Cam v={g % 10} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[-4, 8, 6]} intensity={2.0} />
        <directionalLight position={[5, 3, -4]} intensity={0.8} />
        <Environment resolution={256} frames={1}>
          <Lightformer form="rect" intensity={2.5} position={[0, 6, 4]} scale={[12, 4, 1]} rotation-x={Math.PI / 2.4} />
          <Lightformer form="rect" intensity={1.4} position={[-8, 2, 2]} scale={[4, 10, 1]} rotation-y={Math.PI / 2} />
          <Lightformer form="rect" intensity={1} position={[8, 1, -2]} scale={[4, 8, 1]} rotation-y={-Math.PI / 2} />
        </Environment>
        {obj && <primitive object={obj} />}
        <DrawWhenReady ready={!!obj} handle={handle} />
      </ThreeCanvas>
    </AbsoluteFill>
  );
};
