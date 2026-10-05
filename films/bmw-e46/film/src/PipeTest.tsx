import { Environment, Lightformer, RoundedBox } from "@react-three/drei";
import { ThreeCanvas } from "@remotion/three";
import React, { useMemo } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import * as THREE from "three";
import { sweepPatch, xrayMaterial } from "./xray";

const Cam: React.FC<{ g: number }> = () => null;

export const PipeTest: React.FC = () => {
  const g = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const sweep = useMemo(() => ({ value: 0 }), []);
  sweep.value = 2.4 - (g / 59) * 4.8;
  const paint = useMemo(() => sweepPatch(new THREE.MeshPhysicalMaterial({ color: "#0B0D11", metalness: 0.55, roughness: 0.32, clearcoat: 1, clearcoatRoughness: 0.06 }), sweep, "front"), [sweep]);
  const glass = useMemo(() => xrayMaterial(sweep), [sweep]);
  const yaw = -0.6 + g * 0.01;
  return (
    <ThreeCanvas width={width} height={height} camera={{ fov: 30, position: [0, 2.2, 13] }} gl={{ antialias: true, preserveDrawingBuffer: true }}
      style={{ background: "#F2F3F6" }} onCreated={({ camera }) => camera.lookAt(0, 0.6, 0)}>
      <Cam g={g} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[-6, 10, 8]} intensity={2.2} />
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={2.5} position={[0, 6, 4]} scale={[12, 4, 1]} rotation-x={Math.PI / 2.4} />
        <Lightformer form="rect" intensity={1.4} position={[-8, 2, 2]} scale={[4, 10, 1]} rotation-y={Math.PI / 2} />
        <Lightformer form="rect" intensity={1} position={[8, 1, -2]} scale={[4, 8, 1]} rotation-y={-Math.PI / 2} />
      </Environment>
      <group rotation={[0, yaw, 0]}>
        <RoundedBox args={[4.5, 1.2, 1.75]} radius={0.35} smoothness={8} position={[0, 0.75, 0]} material={paint} />
        <RoundedBox args={[4.5, 1.2, 1.75]} radius={0.35} smoothness={8} position={[0, 0.75, 0]} material={glass} renderOrder={10} />
        <mesh position={[1.3, 0.7, 0]}><boxGeometry args={[0.9, 0.5, 0.5]} /><meshStandardMaterial color="#D9D6D0" roughness={0.6} /></mesh>
        <mesh position={[0.4, 0.5, 0]}><cylinderGeometry args={[0.2, 0.25, 0.8, 32]} /><meshStandardMaterial color="#1C69D4" roughness={0.4} emissive="#1C69D4" emissiveIntensity={0.25} /></mesh>
      </group>
    </ThreeCanvas>
  );
};
