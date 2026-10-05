// The 3D kit for Remotion films (design/three-d.md): a studio stage, a rounded tile with a logo face, a laptop and a
// phone whose screens are live React interface, thin interface panels with depth, and a camera that only breathes.
// Built on @remotion/three (React Three Fiber) and @react-three/drei. Copy into src/.
//   npm i @react-three/drei@10.7.9 @react-three/postprocessing@3.0.4      (three 0.180 and fiber 9 come with Remotion's set)
//   render with --gl=angle (stills: npx remotion still … --gl=angle; renderMedia/renderStill: chromiumOptions: { gl: "angle" })
// Rules: everything moves from the frame (pass g in), never useFrame or clocks, so the speed graphs, the voice timing
// and the motion probe all apply. Units: 1 = 100 px at the default camera (fov 30, z 20), so a 4-wide tile is
// about 400 px on a 1080p frame.
import { ContactShadows, Environment, Lightformer, RoundedBox } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { ThreeCanvas } from "@remotion/three";
import React, { createContext, Suspense, useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import { AbsoluteFill, continueRender, delayRender, Easing, staticFile, useVideoConfig } from "remotion";
import * as THREE from "three";

/** A texture from public/, loaded before the frame is taken (Remotion waits for it). Call it outside the canvas (in the
 *  film component) and pass the texture in: the 3D scene only redraws when the frame changes. */
export const useTex = (src: string) => {
  const [tex, setTex] = useState<THREE.Texture | null>(null);
  const [handle] = useState(() => delayRender(`texture ${src}`));
  useEffect(() => {
    new THREE.TextureLoader().load(staticFile(src), (t) => { t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; setTex(t); continueRender(handle); });
  }, [src, handle]);
  return tex;
};

export const EASE3 = {
  arrive: Easing.bezier(0.22, 1, 0.36, 1),
  longS: Easing.bezier(0.8, 0, 0.2, 1),       // B2: a big, deliberate move
  soft: Easing.bezier(0.4, 0, 0.15, 1),       // B3: leaves rest, long settle
  lead: Easing.bezier(0.16, 1, 0.3, 1),       // B9 leader
  follow: Easing.bezier(0.22, 1, 0.36, 1),    // B9 followers
  depart: Easing.bezier(0.55, 0, 0.9, 0.4),
};
export const clamp01 = (t: number) => Math.min(1, Math.max(0, t));
/** progress over n frames from frame a */
export const k3 = (g: number, a: number, n: number, ease: (t: number) => number = EASE3.arrive) => ease(clamp01((g - a) / n));
export const mix = (a: number, b: number, t: number) => a + (b - a) * t;

/** The camera: a slow breath around a target (the approved K.B camera, in 3D). `orbit` turns it slowly round the
 *  target in radians over the shot; `push` brings it closer (0..1 of `dolly` units). Never a fast move. */
export const Camera3D: React.FC<{ g: number; target?: [number, number, number]; z?: number; orbit?: number; push?: number; dolly?: number; fov?: number }> = ({
  g, target = [0, 0, 0], z = 20, orbit = 0, push = 0, dolly = 3, fov = 30 }) => {
  const { camera } = useThree();
  useLayoutEffect(() => {
    const r = z - push * dolly;
    const a = orbit + Math.sin(g / 120) * 0.035;                 // the breath: a few degrees, very slow
    const y = target[1] + 1.2 + Math.cos(g / 150) * 0.25;
    camera.position.set(target[0] + Math.sin(a) * r, y, target[2] + Math.cos(a) * r);
    (camera as unknown as { fov: number }).fov = fov;
    camera.lookAt(target[0], target[1], target[2]);
    camera.updateProjectionMatrix();
  }, [camera, g, target, z, orbit, push, dolly, fov]);
  return null;
};

/** A bright studio: brand background, soft key light from above-left, reflections from soft light panels (no
 *  downloads: the environment is built from Lightformers), and a soft contact shadow on an invisible floor. */
export const Stage3D: React.FC<{ g: number; bg?: string; floorY?: number; shadow?: number; children?: React.ReactNode; camera?: React.ReactNode; warm?: boolean }> = ({
  bg = "#F4F5F9", floorY = -2.2, shadow = 0.45, children, camera, warm = false }) => {
  const { width, height } = useVideoConfig();
  return (
    <ThreeCanvas width={width} height={height} camera={{ fov: 30, position: [0, 1.2, 20] }} gl={{ antialias: true, preserveDrawingBuffer: true }} shadows
      style={{ background: bg }}>
      {camera}
      <ambientLight intensity={1.1} />
      <directionalLight position={[-6, 10, 8]} intensity={2.4} color={warm ? "#FFF4E8" : "#FFFFFF"} castShadow shadow-mapSize={[1024, 1024]} />
      <directionalLight position={[8, 3, 6]} intensity={0.9} color="#E8F4FF" />
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={2.2} position={[0, 6, 4]} scale={[12, 4, 1]} rotation-x={Math.PI / 2.4} />
        <Lightformer form="rect" intensity={1.2} position={[-8, 2, 2]} scale={[4, 10, 1]} rotation-y={Math.PI / 2} />
        <Lightformer form="rect" intensity={0.8} position={[8, 1, -2]} scale={[4, 8, 1]} rotation-y={-Math.PI / 2} />
        <Lightformer form="ring" intensity={0.6} position={[0, 2, -8]} scale={6} />
      </Environment>
      <ContactShadows position={[0, floorY, 0]} opacity={shadow} scale={30} blur={2.6} far={6} resolution={512} frames={1} />
      <Suspense fallback={null}>{children}</Suspense>
    </ThreeCanvas>
  );
};

/** A rounded tile with an image on its face: the client's logo badge as a real object (the real logo file, never
 *  redrawn). `material`: "matte" (soft rubber), "satin" (painted metal), "glass". */
export const Tile3D: React.FC<{ tex: THREE.Texture | null; size?: number; depth?: number; color?: string; material?: "matte" | "satin" | "glass";
  position?: [number, number, number]; rotation?: [number, number, number]; scale?: number }> = ({
  tex, size = 4, depth = 0.5, color = "#33475F", material = "satin", position = [0, 0, 0], rotation = [0, 0, 0], scale = 1 }) => {
  const m = material === "matte" ? { roughness: 0.85, metalness: 0 } : material === "satin" ? { roughness: 0.38, metalness: 0.35 } : { roughness: 0.05, metalness: 0 };
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <RoundedBox args={[size, size, depth]} radius={size * 0.1} smoothness={6} castShadow receiveShadow>
        {material === "glass"
          ? <meshPhysicalMaterial color={color} transmission={0.9} thickness={depth} roughness={0.08} ior={1.4} />
          : <meshStandardMaterial color={color} {...m} />}
      </RoundedBox>
      <mesh position={[0, 0, depth / 2 + 0.002]}>
        <planeGeometry args={[size * 0.985, size * 0.985]} />
        {tex && <meshStandardMaterial map={tex} transparent roughness={m.roughness} metalness={m.metalness * 0.5} />}
      </mesh>
    </group>
  );
};

// ---------------------------------------------------------------- live screens
// A 3D screen reports where its four corners land on the frame; the live interface (any React, at its own pixel size)
// is then drawn onto exactly that shape by a CSS homography, above the canvas. Screens draw above all 3D objects, so
// keep things from passing in front of a screen. Wrap the film in <Screens>, put the canvas inside, and give every
// Screen3D an id and the interface as children.
type Quad = [number, number][];
type Reg = { set: (id: string, q: Quad, px: [number, number], node: React.ReactNode, o: number) => void };
const ScreenCtx = createContext<Reg | null>(null);

export const Screens: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<Record<string, { q: Quad; px: [number, number]; node: React.ReactNode; o: number }>>({});
  const reg = useRef<Reg>({ set: () => {} });
  reg.current.set = (id, q, px, node, o) => setItems((m) => {
    const p = m[id];
    if (p && p.o === o && p.node === node && p.q.every((c, i) => Math.abs(c[0] - q[i][0]) < 0.01 && Math.abs(c[1] - q[i][1]) < 0.01)) return m;
    return { ...m, [id]: { q, px, node, o } };
  });
  return (
    <ScreenCtx.Provider value={reg.current}>
      {children}
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        {Object.entries(items).map(([id, it]) => it.o > 0 && (
          <div key={id} style={{ position: "absolute", left: 0, top: 0, width: it.px[0], height: it.px[1], overflow: "hidden", transformOrigin: "0 0",
            transform: homography(it.px, it.q), opacity: it.o, background: "#fff" }}>{it.node}</div>
        ))}
      </AbsoluteFill>
    </ScreenCtx.Provider>
  );
};

/** The CSS matrix3d that maps the rectangle 0..w × 0..h onto the quad (TL, TR, BR, BL). */
export const homography = (px: [number, number], q: Quad) => {
  const [w, h] = px, src = [[0, 0], [w, 0], [w, h], [0, h]];
  const A: number[][] = [], b: number[] = [];
  for (let i = 0; i < 4; i++) {
    const [x, y] = src[i], [u, v] = q[i];
    A.push([x, y, 1, 0, 0, 0, -u * x, -u * y]); b.push(u);
    A.push([0, 0, 0, x, y, 1, -v * x, -v * y]); b.push(v);
  }
  const H = solve(A, b);
  return `matrix3d(${H[0]},${H[3]},0,${H[6]},${H[1]},${H[4]},0,${H[7]},0,0,1,0,${H[2]},${H[5]},0,1)`;
};
const solve = (A: number[][], b: number[]) => {
  const n = b.length, M = A.map((r, i) => [...r, b[i]]);
  for (let c = 0; c < n; c++) {
    let p = c; for (let r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r;
    [M[c], M[p]] = [M[p], M[c]];
    for (let r = 0; r < n; r++) if (r !== c) { const f = M[r][c] / M[c][c]; for (let k = c; k <= n; k++) M[r][k] -= f * M[c][k]; }
  }
  return M.map((r, i) => r[n] / r[i]);
};

/** A screen surface w × h units in its group's plane, facing +z, showing live interface at px pixels. */
export const Screen3D: React.FC<{ id: string; w: number; h?: number; px: [number, number]; children: React.ReactNode; z?: number; o?: number }> = ({
  id, w, h, px, children, z = 0.01, o = 1 }) => {
  const reg = useContext(ScreenCtx);
  const ref = useRef<THREE.Group>(null);
  const { camera, size } = useThree();
  const H = h ?? (w * px[1]) / px[0];
  const [handle] = useState(() => delayRender(`screen ${id}`));
  useLayoutEffect(() => {
    const gr = ref.current; if (!gr || !reg) return;
    gr.updateWorldMatrix(true, false); camera.updateMatrixWorld();
    const q = ([[-w / 2, H / 2], [w / 2, H / 2], [w / 2, -H / 2], [-w / 2, -H / 2]] as [number, number][]).map(([x, y]) => {
      const v = new THREE.Vector3(x, y, z).applyMatrix4(gr.matrixWorld).project(camera);
      return [((v.x + 1) / 2) * size.width, ((1 - v.y) / 2) * size.height] as [number, number];
    });
    reg.set(id, q, px, children, o);
    requestAnimationFrame(() => continueRender(handle));
  });
  return <group ref={ref}><mesh position={[0, 0, z * 0.5]}><planeGeometry args={[w, H]} /><meshBasicMaterial color="#ffffff" toneMapped={false} /></mesh></group>;
};

/** A laptop, open; `open` 0..1 is the lid angle (closed → about 105°). The screen is live interface. */
export const Laptop3D: React.FC<{ id?: string; open?: number; screen?: React.ReactNode; px?: [number, number]; position?: [number, number, number]; rotation?: [number, number, number]; scale?: number }> = ({
  id = "laptop", open = 1, screen, px = [1280, 800], position = [0, 0, 0], rotation = [0, 0, 0], scale = 1 }) => {
  const W = 8, D = 5.4, T = 0.22, lidAngle = mix(Math.PI / 2, -0.26, open);
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <RoundedBox args={[W, T, D]} radius={0.1} smoothness={4} castShadow receiveShadow position={[0, T / 2, 0]}>
        <meshStandardMaterial color="#D9DCE3" roughness={0.35} metalness={0.6} />
      </RoundedBox>
      <mesh position={[0, T + 0.002, 0.55]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[W * 0.86, D * 0.42]} />
        <meshStandardMaterial color="#C3C8D2" roughness={0.6} />
      </mesh>
      <group position={[0, T, -D / 2]} rotation={[lidAngle, 0, 0]}>
        <RoundedBox args={[W, D * 0.98, 0.14]} radius={0.08} smoothness={4} castShadow position={[0, D * 0.49, -0.07]}>
          <meshStandardMaterial color="#1E2633" roughness={0.3} metalness={0.4} />
        </RoundedBox>
        {screen && (
          <group position={[0, D * 0.49, 0.01]}>
            <Screen3D id={id} w={W * 0.92} h={D * 0.9} px={px} o={open > 0.6 ? 1 : 0}>{screen}</Screen3D>
          </group>
        )}
      </group>
    </group>
  );
};

/** A phone standing or lying; the screen is live interface. */
export const Phone3D: React.FC<{ id?: string; screen?: React.ReactNode; px?: [number, number]; position?: [number, number, number]; rotation?: [number, number, number]; scale?: number }> = ({
  id = "phone", screen, px = [390, 800], position = [0, 0, 0], rotation = [0, 0, 0], scale = 1 }) => (
  <group position={position} rotation={rotation} scale={scale}>
    <RoundedBox args={[2.1, 4.3, 0.22]} radius={0.3} smoothness={6} castShadow>
      <meshStandardMaterial color="#1E2633" roughness={0.25} metalness={0.5} />
    </RoundedBox>
    {screen && <group position={[0, 0, 0.115]}><Screen3D id={id} w={1.9} h={4.05} px={px}>{screen}</Screen3D></group>}
  </group>
);

/** An interface panel with real thickness and a soft shadow: a card, a dashboard tile. Its face is live interface. */
export const Panel3D: React.FC<{ id: string; w: number; h: number; px: [number, number]; children?: React.ReactNode; position?: [number, number, number];
  rotation?: [number, number, number]; color?: string; opacity?: number }> = ({ id, w, h, px, children, position = [0, 0, 0], rotation = [0, 0, 0], color = "#FFFFFF", opacity = 1 }) => (
  <group position={position} rotation={rotation}>
    <RoundedBox args={[w, h, 0.12]} radius={0.16} smoothness={4} castShadow>
      <meshStandardMaterial color={color} roughness={0.5} transparent={opacity < 1} opacity={opacity} />
    </RoundedBox>
    {children && <group position={[0, 0, 0.065]}><Screen3D id={id} w={w * 0.94} h={h * 0.86} px={px} o={opacity > 0.5 ? 1 : 0}>{children}</Screen3D></group>}
  </group>
);
