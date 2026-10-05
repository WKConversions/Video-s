// Materials for everything that is not the body shell (details, wheels, the drivetrain, the interior). Each keeps
// its own look in paint mode and turns into the film's x-ray look where the body has turned to glass: clay for the
// mechanical parts, BMW blue while a part is pointed at, faded toward the studio while another part is out.
// The car-space position comes from uCarInv (inverse of the car's world matrix), so moved nodes still know where
// they are in the car.
import * as THREE from "three";

export const BLUE = new THREE.Color("#1C69D4");
export const CLAY = new THREE.Color("#D6D2CA");
export const STUDIO = new THREE.Color("#EEF0F3");

export type Shared = { uSweep: { value: number }; uCarInv: { value: THREE.Matrix4 }; uXray: { value: number } };
export type PartU = { uHi: { value: number }; uDim: { value: number }; uAlpha: { value: number }; uPulse: { value: number } };

export const makeShared = (): Shared => ({ uSweep: { value: 99 }, uCarInv: { value: new THREE.Matrix4() }, uXray: { value: 0 } });
export const makePartU = (): PartU => ({ uHi: { value: 0 }, uDim: { value: 0 }, uAlpha: { value: 1 }, uPulse: { value: -99 } });

/** kind: "shell" parts vanish with the paint (headlights, plates, mirrors); "mech" parts turn to clay; "tyre" darker clay */
export const patchPart = (src: THREE.Material, kind: "shell" | "mech" | "tyre", S: Shared, P: PartU, key: string) => {
  const m = (src as THREE.MeshStandardMaterial).clone();
  m.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, { uSweep: S.uSweep, uCarInv: S.uCarInv, uHi: P.uHi, uDim: P.uDim, uAlpha: P.uAlpha, uPulse: P.uPulse,
      uBlue: { value: BLUE }, uClay: { value: kind === "tyre" ? new THREE.Color("#A9ACB2") : CLAY }, uStudio: { value: STUDIO } });
    sh.vertexShader = sh.vertexShader
      .replace("#include <common>", "#include <common>\nuniform mat4 uCarInv; varying vec3 vCar;")
      .replace("#include <worldpos_vertex>", "#include <worldpos_vertex>\nvCar = (uCarInv * modelMatrix * vec4(transformed, 1.0)).xyz;");
    sh.fragmentShader = sh.fragmentShader
      .replace("#include <common>", `#include <common>
uniform float uSweep; uniform float uHi; uniform float uDim; uniform float uAlpha; uniform float uPulse;
uniform vec3 uBlue; uniform vec3 uClay; uniform vec3 uStudio; varying vec3 vCar;
float hash12(vec2 p) { vec3 p3 = fract(vec3(p.xyx) * .1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }`)
      .replace("void main() {", `void main() {
  float xr = step(uSweep, vCar.x);
  ${kind === "shell" ? "if (xr > 0.5) discard;" : ""}
  if (uAlpha < 0.999 && hash12(gl_FragCoord.xy) > uAlpha) discard;`)
      .replace("#include <metalnessmap_fragment>", `#include <metalnessmap_fragment>
  ${kind === "shell" ? "" : `
  diffuseColor.rgb = mix(diffuseColor.rgb, uClay, xr);
  metalnessFactor = mix(metalnessFactor, 0.05, xr);
  roughnessFactor = mix(roughnessFactor, 0.62, xr);
  diffuseColor.rgb = mix(diffuseColor.rgb, uBlue, uHi * 0.88);
  roughnessFactor = mix(roughnessFactor, 0.35, uHi);`}`)
      .replace("#include <emissivemap_fragment>", `#include <emissivemap_fragment>
  ${kind === "shell" ? "" : `totalEmissiveRadiance += uBlue * 0.32 * uHi;
  float pulse = exp(-pow((vCar.x - uPulse) / 0.09, 2.0));
  diffuseColor.rgb = mix(diffuseColor.rgb, uBlue, pulse * 0.9);
  totalEmissiveRadiance += uBlue * 0.9 * pulse;`}`)
      .replace("#include <dithering_fragment>", `#include <dithering_fragment>
  ${kind === "shell" ? "" : `
  vec3 nV = normalize(vNormal); float rim = pow(1.0 - abs(nV.z), 2.5);
  gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(0.55, 0.78, 1.0), rim * uHi * 0.6);
  gl_FragColor.rgb = mix(gl_FragColor.rgb, uStudio, uDim * 0.78 * xr);`}`);
  };
  m.customProgramCacheKey = () => `part-${kind}-${key}`;
  return m;
};

/** Patch every mesh under `root` (cloned materials, per-part uniforms). Returns the uniforms for animation. */
export const patchTree = (root: THREE.Object3D, kind: "shell" | "mech" | "tyre" | ((name: string) => "shell" | "mech" | "tyre"), S: Shared, P: PartU, key: string) => {
  root.traverse((o) => {
    const mesh = o as THREE.Mesh;
    if (!mesh.isMesh) return;
    const kd = typeof kind === "function" ? kind(mesh.name + "|" + (mesh.material as THREE.Material).name) : kind;
    const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    const patched = mats.map((mm) => patchPart(mm, kd, S, P, `${key}-${kd}-${mm.name}`));
    mesh.material = Array.isArray(mesh.material) ? patched : patched[0];
  });
  return P;
};
