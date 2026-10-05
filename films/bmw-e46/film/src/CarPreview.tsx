// Car preview: the assembled car from fixed viewpoints, for checking the model against the photos and the drawing.
import { ContactShadows } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { ThreeCanvas } from "@remotion/three";
import React, { useLayoutEffect, useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import * as THREE from "three";
import { CarBody, Studio, useCarAssets, useCarMaterials } from "./car/Car";
import { makeLook } from "./car/materials";
import { MASK_GLSL } from "./car/maps";
import { DrawWhenReady } from "./useGlb";

// [camera position, look-at, fov]
export const PVIEWS: [number[], number[], number][] = [
  [[5.2, 1.05, 3.9], [0.15, 0.62, 0], 30],     // 0 front-right three-quarter, like the photo of the car
  [[-5.0, 1.3, -4.2], [0, 0.62, 0], 30],       // 1 rear-left
  [[2.2, 1.0, 7.2], [0.2, 0.62, 0], 30],       // 2 right side, a little forward
  [[7.6, 0.75, 0.0], [0, 0.6, 0], 22],          // 3 front
  [[-7.6, 0.9, 0.0], [0, 0.65, 0], 22],         // 4 rear
  [[3.4, 0.9, 2.0], [1.9, 0.6, 0.3], 30],       // 5 front close-up
  [[0.6, 1.3, 4.0], [0.4, 1.0, 0.6], 34],       // 6 side glass close-up
  [[0, 9, 0.01], [0, 0.6, 0], 30],              // 7 top
];

const Cam: React.FC<{ v: number }> = ({ v }) => {
  const { camera } = useThree();
  useLayoutEffect(() => {
    const [p, t, fov] = PVIEWS[v];
    const c = camera as THREE.PerspectiveCamera;
    c.fov = fov; c.near = 0.05; c.far = 100; c.up.set(0, 1, 0);
    if (v === 7) c.up.set(1, 0, 0);
    c.position.set(p[0], p[1], p[2]); c.lookAt(t[0], t[1], t[2]); c.updateProjectionMatrix();
  }, [v, camera]);
  return null;
};

/** debug: the body coloured by its regions (red glass, green head, blue fog) over its normal, to find mask leaks */
const debugMat = (assets: NonNullable<ReturnType<typeof useCarAssets>["assets"]>) => new THREE.ShaderMaterial({
  uniforms: { tSide: { value: assets.maps.side }, tSide2: { value: assets.maps.side2 }, tTop: { value: assets.maps.top },
    tFront: { value: assets.maps.front }, tFront2: { value: assets.maps.front2 }, tRear: { value: assets.maps.rear } },
  vertexShader: `varying vec3 vP; varying vec3 vN; void main() { vP = position; vN = normal; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
  fragmentShader: `varying vec3 vP; varying vec3 vN; ${MASK_GLSL}
    void main() { Regions r = carRegions(vP, normalize(vN)); vec3 c = 0.35 + 0.3 * normalize(vN);
      c = mix(c, vec3(1.0, 0.0, 0.0), step(0.5, r.glass)); c = mix(c, vec3(0.0, 1.0, 0.0), step(0.5, r.head)); c = mix(c, vec3(0.0, 0.0, 1.0), step(0.5, r.fog));
      gl_FragColor = vec4(c, 1.0); }`,
});

export const CarPreview: React.FC<{ extras?: string[]; sweep?: number; debug?: boolean }> = ({ extras = [], sweep = 99, debug = false }) => {
  const g = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const { assets, handle } = useCarAssets(extras);
  const look = useMemo(() => makeLook(), []);
  look.sweep.value = sweep;
  const mats = useCarMaterials(assets, look);
  return (
    <AbsoluteFill style={{ background: "linear-gradient(#F5F6F8, #E9EBEF)" }}>
      <ThreeCanvas width={width} height={height} gl={{ antialias: true, preserveDrawingBuffer: true }} shadows>
        <Cam v={g % PVIEWS.length} />
        <Studio />
        {assets && mats && !debug && <CarBody assets={assets} mats={mats} />}
        {assets && debug && <primitive object={assets.body.clone(true)} onUpdate={(o: THREE.Object3D) => { const m = debugMat(assets); o.traverse((x) => { if ((x as THREE.Mesh).isMesh) (x as THREE.Mesh).material = m; }); }} />}
        {assets && Object.entries(assets.extras).map(([k, s]) => <primitive key={k} object={s} />)}
        <ContactShadows position={[0, 0.001, 0]} opacity={0.55} scale={9} blur={2.2} far={1.5} resolution={512} frames={1} />
        <DrawWhenReady ready={!!(assets && mats)} handle={handle} />
      </ThreeCanvas>
    </AbsoluteFill>
  );
};
