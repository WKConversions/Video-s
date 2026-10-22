// Test 1: a photoreal-style product shot built in real-time 3D. A phone lies on a wooden table (Poly Haven CC0
// texture with its normal and roughness maps), lit by a procedural studio environment (three's RoomEnvironment:
// soft reflections, no HDRI download) and a warm key light with a soft shadow. The screen wakes up and its glow
// lights the wood; the camera makes a slow dolly. No API, no cost.
import React, { useEffect, useMemo, useState } from "react";
import { useCurrentFrame, useVideoConfig, staticFile, delayRender, continueRender } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

const Env: React.FC = () => {
  const { gl, scene } = useThree();
  useMemo(() => {
    const pm = new THREE.PMREMGenerator(gl);
    scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environmentIntensity = 0.55;
  }, [gl, scene]);
  return null;
};

// textures: loaded before the 3D scene mounts (delayRender holds the frame until they are in), then passed in
type Wood = { diff: THREE.Texture; nor: THREE.Texture; rough: THREE.Texture };
const useWood = (): Wood | null => {
  const [wood, setWood] = useState<Wood | null>(null);
  const [handle] = useState(() => delayRender("wood textures"));
  useEffect(() => {
    const L = new THREE.TextureLoader();
    Promise.all(["tex/wood_diff.jpg", "tex/wood_nor_gl.jpg", "tex/wood_rough.jpg"].map((f) => L.loadAsync(staticFile(f)))).then(([diff, nor, rough]) => {
      for (const t of [diff, nor, rough]) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(2, 2); t.anisotropy = 8; }
      diff.colorSpace = THREE.SRGBColorSpace;
      setWood({ diff, nor, rough }); continueRender(handle);
    });
  }, [handle]);
  return wood;
};

const Scene: React.FC<{ t: number; wood: Wood }> = ({ t, wood }) => {
  const { diff, nor, rough } = wood;
  const on = Math.min(1, Math.max(0, (t - 1.0) / 0.6));                  // the screen wakes at 1.0 s
  const { camera } = useThree();
  const k = t / 4;                                                        // slow dolly and a little orbit
  camera.position.set(Math.sin(-0.5 + k * 0.35) * 2.6, 1.55 - k * 0.25, Math.cos(-0.5 + k * 0.35) * 2.6);
  camera.lookAt(0, 0.05, 0);
  const glow = new THREE.Color("#2EE07A");
  return (
    <>
      <Env />
      <ambientLight intensity={0.05} />
      <directionalLight position={[2.5, 4, 1.5]} intensity={2.2} color="#FFE2C4" castShadow shadow-mapSize={[2048, 2048]} shadow-radius={6} shadow-bias={-0.0004} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[8, 8]} />
        <meshStandardMaterial map={diff} normalMap={nor} roughnessMap={rough} roughness={0.9} />
      </mesh>
      <group rotation={[0, 0.5, 0]} position={[0, 0.045, 0]}>
        {/* the body: rounded aluminium-dark glass slab */}
        <RoundedBox args={[0.78, 0.08, 1.6]} radius={0.035} smoothness={6} castShadow>
          <meshPhysicalMaterial color="#121418" metalness={0.6} roughness={0.25} clearcoat={1} clearcoatRoughness={0.08} />
        </RoundedBox>
        {/* the screen: dark glass that wakes up green */}
        <mesh position={[0, 0.0412, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.7, 1.5]} />
          <meshPhysicalMaterial color="#050607" emissive={glow} emissiveIntensity={on * 1.4} roughness={0.08} clearcoat={1} metalness={0.1} />
        </mesh>
        {/* the screen's light falling on the wood */}
        <pointLight position={[0, 0.25, 0]} color={glow} intensity={on * 1.6} distance={1.8} decay={2} />
      </group>
    </>
  );
};

export const PhoneOnWood: React.FC = () => {
  const frame = useCurrentFrame(), { fps, width, height } = useVideoConfig(), wood = useWood();
  return (
    <ThreeCanvas width={width} height={height} shadows camera={{ fov: 32, near: 0.05, far: 50 }}
      gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, outputColorSpace: THREE.SRGBColorSpace }} style={{ background: "#0c0b0a" }}>
      {wood && <Scene t={frame / fps} wood={wood} />}
    </ThreeCanvas>
  );
};
