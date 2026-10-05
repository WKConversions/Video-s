// The E46 330Ci coupe: body (paint with detail maps), interior shell, glass, lenses, and any extra GLBs (wheels,
// details, internals). Everything is in car coordinates (m): +X front, +Y up, +Z right, origin on the ground at the
// wheelbase midpoint. Load the assets outside the canvas with useCarAssets and pass them in.
import { Environment, Lightformer } from "@react-three/drei";
import React, { useEffect, useMemo, useState } from "react";
import { continueRender, delayRender, staticFile } from "remotion";
import * as THREE from "three";
import { CarMaps, MAP_NAMES } from "./maps";
import { Look, makeGlass, makeLens, makePaint, makeXray } from "./materials";
import { loadGlb } from "../useGlb";

export type CarAssets = { maps: CarMaps; body: THREE.Group; glass: THREE.Group; lens: THREE.Group; extras: Record<string, THREE.Group> };

const loadTex = (src: string) => new Promise<THREE.Texture>((res, rej) => new THREE.TextureLoader().load(staticFile(src), (t) => {
  t.colorSpace = THREE.NoColorSpace; t.anisotropy = 8; t.minFilter = THREE.LinearMipmapLinearFilter; t.generateMipmaps = true;
  res(t);
}, undefined, rej));

export const useCarAssets = (extras: string[] = []) => {
  const key = extras.join("|");
  const [assets, setAssets] = useState<CarAssets | null>(null);
  const [handle] = useState(() => delayRender("car assets", { timeoutInMilliseconds: 240000 }));
  useEffect(() => {
    Promise.all([
      Promise.all(MAP_NAMES.map((n) => loadTex(`tex/${n}.png`))),
      loadGlb("models/body.glb"), loadGlb("models/glass.glb"), loadGlb("models/lens.glb"),
      Promise.all((key ? key.split("|") : []).map((e) => loadGlb(`models/${e}.glb`))),
    ]).then(([texs, body, glass, lens, ex]) => {
      const maps = Object.fromEntries(MAP_NAMES.map((n, i) => [n, texs[i]])) as CarMaps;
      const extrasMap = Object.fromEntries((key ? key.split("|") : []).map((e, i) => [e, ex[i]]));
      setAssets({ maps, body, glass, lens, extras: extrasMap });
    }).catch((e) => { console.error(e); continueRender(handle); });
  }, [key, handle]);
  return { assets, handle };
};

const firstGeometry = (g: THREE.Group) => {
  let geo: THREE.BufferGeometry | null = null;
  g.traverse((o) => { if (!geo && (o as THREE.Mesh).isMesh) geo = (o as THREE.Mesh).geometry; });
  return geo as unknown as THREE.BufferGeometry;
};

/** The car's own materials, created once per look. */
export const useCarMaterials = (assets: CarAssets | null, look: Look) => useMemo(() => {
  if (!assets) return null;
  return {
    paint: makePaint(assets.maps, look),
    glass: makeGlass(assets.maps, look),
    lens: makeLens(assets.maps, look),
    xray: makeXray(assets.maps, look),
    interior: (() => {
      const m = makePaint(assets.maps, look, { color: "#16181C" });
      m.side = THREE.BackSide; m.metalness = 0; m.roughness = 0.9; m.clearcoat = 0;
      return m;
    })(),
  };
}, [assets, look]);

export const CarBody: React.FC<{ assets: CarAssets; mats: NonNullable<ReturnType<typeof useCarMaterials>>; xray?: boolean }> = ({ assets, mats, xray = true }) => {
  const geo = useMemo(() => firstGeometry(assets.body), [assets]);
  const glassGeo = useMemo(() => firstGeometry(assets.glass), [assets]);
  const lensGeo = useMemo(() => firstGeometry(assets.lens), [assets]);
  return (
    <group name="car_body">
      <mesh geometry={geo} material={mats.paint} castShadow />
      <mesh geometry={geo} material={mats.interior} />
      <mesh geometry={glassGeo} material={mats.glass} renderOrder={2} />
      <mesh geometry={lensGeo} material={mats.lens} renderOrder={3} />
      {xray && <mesh geometry={geo} material={mats.xray} renderOrder={5} />}
    </group>
  );
};

/** The bright studio: soft key from above, long strip lights for the reflections on the black paint, a grey cyc. */
export const Studio: React.FC<{ envLevel?: number }> = ({ envLevel = 1 }) => (
  <>
    <ambientLight intensity={0.35} />
    <directionalLight position={[-4, 9, 5]} intensity={1.6} castShadow shadow-mapSize={[2048, 2048]} />
    <directionalLight position={[5, 4, -6]} intensity={0.5} />
    <Environment resolution={512} frames={1} environmentIntensity={envLevel}>
      <color attach="background" args={["#2A2E35"]} />
      {/* overhead softbox */}
      <Lightformer form="rect" intensity={3.2} position={[0, 7, 0]} rotation-x={Math.PI / 2} scale={[9, 4, 1]} />
      {/* long horizontal strips on both sides: the highlight lines along the flanks */}
      <Lightformer form="rect" intensity={2.4} position={[0, 2.2, 7]} scale={[16, 0.5, 1]} />
      <Lightformer form="rect" intensity={2.4} position={[0, 2.2, -7]} rotation-y={Math.PI} scale={[16, 0.5, 1]} />
      <Lightformer form="rect" intensity={1.2} position={[0, 0.9, 7]} scale={[16, 0.25, 1]} />
      <Lightformer form="rect" intensity={1.2} position={[0, 0.9, -7]} rotation-y={Math.PI} scale={[16, 0.25, 1]} />
      {/* front and rear panels */}
      <Lightformer form="rect" intensity={1.6} position={[8, 2, 0]} rotation-y={-Math.PI / 2} scale={[8, 3, 1]} />
      <Lightformer form="rect" intensity={1.2} position={[-8, 2, 0]} rotation-y={Math.PI / 2} scale={[8, 3, 1]} />
      {/* the bright floor of the cyc, seen in the lower body */}
      <Lightformer form="rect" intensity={0.9} position={[0, -1.5, 0]} rotation-x={-Math.PI / 2} scale={[30, 30, 1]} color="#E9ECF1" />
    </Environment>
  </>
);
