// The model from the solved camera of the photo of the car (build/camera_match.py), to overlay on the photo.
import { ContactShadows } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { ThreeCanvas } from "@remotion/three";
import React, { useLayoutEffect, useMemo } from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import * as THREE from "three";
import { CarBody, Studio, useCarAssets, useCarMaterials } from "./car/Car";
import { makeLook } from "./car/materials";
import { DrawWhenReady } from "./useGlb";

export type Cam = { position: number[]; target: number[]; up: number[]; vfov: number };

const CamSet: React.FC<{ cam: Cam }> = ({ cam }) => {
  const { camera } = useThree();
  useLayoutEffect(() => {
    const c = camera as THREE.PerspectiveCamera;
    c.fov = cam.vfov; c.near = 0.05; c.far = 100;
    c.position.set(cam.position[0], cam.position[1], cam.position[2]);
    c.up.set(cam.up[0], cam.up[1], cam.up[2]);
    c.lookAt(cam.target[0], cam.target[1], cam.target[2]); c.updateProjectionMatrix();
  }, [cam, camera]);
  return null;
};

export const PhotoMatch: React.FC<{ cam: Cam; extras: string[] }> = ({ cam, extras }) => {
  const { width, height } = useVideoConfig();
  const { assets, handle } = useCarAssets(extras);
  const look = useMemo(() => makeLook(), []);
  const mats = useCarMaterials(assets, look);
  return (
    <AbsoluteFill style={{ background: "#F2F3F6" }}>
      <ThreeCanvas width={width} height={height} gl={{ antialias: true, preserveDrawingBuffer: true }} shadows>
        <CamSet cam={cam} />
        <Studio />
        {assets && mats && <CarBody assets={assets} mats={mats} xray={false} />}
        {assets && Object.entries(assets.extras).map(([k, s]) => <primitive key={k} object={s} />)}
        <ContactShadows position={[0, 0.001, 0]} opacity={0.55} scale={9} blur={2.2} far={1.5} resolution={512} frames={1} />
        <DrawWhenReady ready={!!(assets && mats)} handle={handle} />
      </ThreeCanvas>
    </AbsoluteFill>
  );
};
