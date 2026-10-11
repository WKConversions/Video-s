// A tested 3D example for Remotion (production/remotion.md): a card tilting into place with a soft shadow.
// Register it as a Composition; render stills or the film with --gl=swangle.
import { ThreeCanvas } from "@remotion/three";
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, Easing } from "remotion";

// 3D check: a card tilting into place, lit, driven only by the frame (never useFrame or clocks).
export const Test3D: React.FC = () => {
  const f = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const k = interpolate(f, [0, 45], [0, 1], { extrapolateRight: "clamp", easing: Easing.bezier(0.22, 1, 0.36, 1) });
  return (
    <AbsoluteFill style={{ background: "#F6F4F1" }}>
      <ThreeCanvas width={width} height={height} camera={{ fov: 30, position: [0, 0, 9] }} shadows>
        <ambientLight intensity={0.7} />
        <directionalLight position={[3, 5, 6]} intensity={1.6} castShadow />
        <group rotation={[interpolate(k, [0, 1], [-0.9, -0.18]), interpolate(k, [0, 1], [0.7, 0.32]), 0]} position={[0, interpolate(k, [0, 1], [-1.2, 0]), 0]}>
          <mesh castShadow>
            <boxGeometry args={[4.2, 2.6, 0.08]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.6} />
          </mesh>
          {[0, 1, 2, 3].map((i) => (
            <mesh key={i} position={[-1.9 + (0.9 + i * 0.5) * 1.0, 0.75 - i * 0.5, 0.06]}>
              <boxGeometry args={[1.6 * interpolate(f, [20 + i * 6, 50 + i * 6], [0.05, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), 0.24, 0.04]} />
              <meshStandardMaterial color={i === 0 ? "#121212" : "#4A4844"} />
            </mesh>
          ))}
          <mesh position={[0.25, 0, 0.07]}><boxGeometry args={[0.03, 2.2, 0.03]} /><meshStandardMaterial color="#BD1717" /></mesh>
        </group>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.9, 0]} receiveShadow>
          <planeGeometry args={[30, 30]} />
          <shadowMaterial opacity={0.12} />
        </mesh>
      </ThreeCanvas>
    </AbsoluteFill>
  );
};
