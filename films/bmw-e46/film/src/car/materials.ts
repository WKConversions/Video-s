// The car's body materials: black metallic paint with every region from the detail maps (chrome, gaps, black
// plastic, lights), the glass, and the x-ray glass the body turns into. Paint and x-ray share one sweep plane in the
// car's own space: the paint keeps the part of the body behind the sweep, the x-ray the part in front of it.
import * as THREE from "three";
import { CarMaps, MASK_GLSL } from "./maps";

export type Sweep = { value: number };            // object-space X (m) of the sweep plane
export type Look = {
  sweep: Sweep;              // paint where X < sweep, x-ray where X > sweep
  xrayFade: { value: number };   // 0..1, how strongly the x-ray glass shows
  seam: { value: number };       // 0..1, brightness of the accent seam on the sweep line
};

export const makeLook = (): Look => ({ sweep: { value: 99 }, xrayFade: { value: 1 }, seam: { value: 1 } });

const mapUniforms = (maps: CarMaps) => ({
  tSide: { value: maps.side }, tSide2: { value: maps.side2 }, tTop: { value: maps.top },
  tFront: { value: maps.front }, tFront2: { value: maps.front2 }, tRear: { value: maps.rear },
});

const VARY_V = `varying vec3 vObjPos; varying vec3 vObjN;`;

/** Black metallic paint (BMW black, a little blue in the flake) with the detail regions. */
export const makePaint = (maps: CarMaps, look: Look, opts: { color?: string } = {}) => {
  const m = new THREE.MeshPhysicalMaterial({
    color: opts.color ?? "#07090D", metalness: 0.55, roughness: 0.36, clearcoat: 1, clearcoatRoughness: 0.035,
    envMapIntensity: 1.25,
  });
  m.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, mapUniforms(maps), { uSweep: look.sweep });
    sh.vertexShader = sh.vertexShader
      .replace("#include <common>", `#include <common>\n${VARY_V}`)
      .replace("#include <begin_vertex>", `#include <begin_vertex>\nvObjPos = position; vObjN = normal;`);
    sh.fragmentShader = sh.fragmentShader
      .replace("#include <common>", `#include <common>\n${VARY_V}\nuniform float uSweep;\n${MASK_GLSL}`)
      .replace("void main() {", `void main() {\n  if (vObjPos.x > uSweep) discard;\n  Regions rg = carRegions(vObjPos, normalize(vObjN));\n  if (rg.glass > 0.5 || rg.head > 0.5 || rg.fog > 0.5) discard;`)
      .replace("#include <roughnessmap_fragment>", `#include <roughnessmap_fragment>
  float gapK = rg.gap;
  roughnessFactor = mix(roughnessFactor, 0.55, rg.black);
  roughnessFactor = mix(roughnessFactor, 0.07, rg.chrome);
  roughnessFactor = mix(roughnessFactor, 0.12, max(max(rg.tailRed, rg.tailInd), max(rg.repeater, rg.reflector)));
  roughnessFactor = mix(roughnessFactor, 0.9, gapK);`)
      .replace("#include <metalnessmap_fragment>", `#include <metalnessmap_fragment>
  metalnessFactor = mix(metalnessFactor, 0.0, max(rg.black, max(rg.tailRed, rg.tailInd)));
  metalnessFactor = mix(metalnessFactor, 1.0, rg.chrome);
  metalnessFactor = mix(metalnessFactor, 0.0, gapK);
  diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.012, 0.012, 0.013), rg.black);
  diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.86, 0.88, 0.91), rg.chrome);
  diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.42, 0.015, 0.02), rg.tailRed);
  float outerLamp = smoothstep(440.0, 480.0, abs(vObjPos.z * 1000.0));
  diffuseColor.rgb = mix(diffuseColor.rgb, mix(vec3(0.70, 0.71, 0.73), vec3(0.66, 0.34, 0.07), outerLamp), rg.tailInd);
  diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.80, 0.42, 0.04), rg.repeater);
  diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.35, 0.01, 0.015), rg.reflector);
  diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.0), gapK);
  diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.0), rg.slatGap);
  roughnessFactor = mix(roughnessFactor, 1.0, rg.slatGap);`)
      .replace("#include <lights_physical_fragment>", `#include <lights_physical_fragment>
  #ifdef USE_CLEARCOAT
  material.clearcoat *= (1.0 - gapK) * (1.0 - rg.chrome) * (1.0 - 0.7 * rg.black);
  #endif`)
      .replace("#include <emissivemap_fragment>", `#include <emissivemap_fragment>
  totalEmissiveRadiance += vec3(0.18, 0.0, 0.0) * rg.tailRed;`);
  };
  const key = `e46-paint-${opts.color ?? "paint"}`;
  m.customProgramCacheKey = () => key;
  return m;
};

/** Tinted side and screen glass: a thin transparent layer that reflects the studio; outside the glass regions it
 *  discards, so the body's detail maps decide its exact outline. */
export const makeGlass = (maps: CarMaps, look: Look) => {
  const m = new THREE.MeshPhysicalMaterial({
    color: "#0A0E13", metalness: 0, roughness: 0.03, transparent: true, opacity: 0.62, clearcoat: 1,
    clearcoatRoughness: 0.02, envMapIntensity: 1.6, depthWrite: false,
  });
  m.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, mapUniforms(maps), { uSweep: look.sweep });
    sh.vertexShader = sh.vertexShader
      .replace("#include <common>", `#include <common>\n${VARY_V}`)
      .replace("#include <begin_vertex>", `#include <begin_vertex>\nvObjPos = position; vObjN = normal;`);
    sh.fragmentShader = sh.fragmentShader
      .replace("#include <common>", `#include <common>\n${VARY_V}\nuniform float uSweep;\n${MASK_GLSL}`)
      .replace("void main() {", `void main() {\n  if (vObjPos.x > uSweep) discard;\n  Regions rg = carRegions(vObjPos, normalize(vObjN));\n  if (rg.glass < 0.5) discard;`);
  };
  m.customProgramCacheKey = () => "e46-glass";
  return m;
};

/** Clear lens over the headlights and fog lights. */
export const makeLens = (maps: CarMaps, look: Look) => {
  const m = new THREE.MeshPhysicalMaterial({
    color: "#FFFFFF", metalness: 0, roughness: 0.02, transparent: true, opacity: 0.16, clearcoat: 1,
    clearcoatRoughness: 0.01, envMapIntensity: 2.2, depthWrite: false,
  });
  m.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, mapUniforms(maps), { uSweep: look.sweep });
    sh.vertexShader = sh.vertexShader
      .replace("#include <common>", `#include <common>\n${VARY_V}`)
      .replace("#include <begin_vertex>", `#include <begin_vertex>\nvObjPos = position; vObjN = normal;`);
    sh.fragmentShader = sh.fragmentShader
      .replace("#include <common>", `#include <common>\n${VARY_V}\nuniform float uSweep;\n${MASK_GLSL}`)
      .replace("void main() {", `void main() {\n  if (vObjPos.x > uSweep) discard;\n  Regions rg = carRegions(vObjPos, normalize(vObjN));\n  if (max(rg.head, rg.fog) < 0.5) discard;`);
  };
  m.customProgramCacheKey = () => "e46-lens";
  return m;
};

/** The x-ray: near-clear glass with a fresnel rim and the car's lines drawn on it like a technical drawing. */
export const makeXray = (maps: CarMaps, look: Look, opts: { rim?: string; line?: string; seam?: string } = {}) =>
  new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, side: THREE.FrontSide,
    uniforms: {
      ...mapUniforms(maps), uSweep: look.sweep, uFade: look.xrayFade, uSeamK: look.seam,
      uRim: { value: new THREE.Color(opts.rim ?? "#5B6B82") }, uLine: { value: new THREE.Color(opts.line ?? "#33445C") },
      uSeam: { value: new THREE.Color(opts.seam ?? "#1C69D4") },
    },
    vertexShader: /* glsl */ `
      ${VARY_V} varying vec3 vN; varying vec3 vV;
      void main() {
        vObjPos = position; vObjN = normal;
        vec4 wp = modelMatrix * vec4(position, 1.0);
        vN = normalize(mat3(modelMatrix) * normal);
        vV = normalize(cameraPosition - wp.xyz);
        gl_Position = projectionMatrix * viewMatrix * wp;
      }`,
    fragmentShader: /* glsl */ `
      ${VARY_V} varying vec3 vN; varying vec3 vV;
      uniform float uSweep; uniform float uFade; uniform float uSeamK; uniform vec3 uRim; uniform vec3 uLine; uniform vec3 uSeam;
      ${MASK_GLSL}
      float edge(float m) { float w = fwidth(m); return 1.0 - smoothstep(0.0, 1.0, abs(m - 0.5) / max(w * 1.2, 1e-4)); }
      void main() {
        if (vObjPos.x < uSweep) discard;
        Regions rg = carRegions(vObjPos, normalize(vObjN));
        float f = pow(1.0 - abs(dot(normalize(vN), normalize(vV))), 2.0);
        float lines = max(max(edge(rg.glass), edge(rg.head)), max(edge(rg.tailRed + rg.tailInd), edge(rg.chrome)));
        lines = max(lines, smoothstep(0.25, 0.75, rg.gap));
        float a = (0.02 + f * 0.34 + lines * 0.5) * uFade;
        float seam = exp(-pow((vObjPos.x - uSweep) / 0.03, 2.0)) * uSeamK;
        vec3 c = mix(uRim, uLine, clamp(lines, 0.0, 1.0));
        c = mix(c, uSeam, seam);
        gl_FragColor = vec4(c, clamp(a + seam * 0.9, 0.0, 1.0));
      }`,
  });
