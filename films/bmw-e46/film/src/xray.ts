// Paint and x-ray materials that share one sweep plane: the paint keeps the part of the body in front of the
// sweep (x > uSweep in the car's own space), the x-ray glass keeps the rest, and a thin accent seam glows where
// they meet. Everything is driven by uniforms set from the frame.
import * as THREE from "three";

export type Sweep = { value: number };

/** Patch a standard/physical material so it discards fragments on one side of the sweep plane (object x). */
export const sweepPatch = (mat: THREE.Material, sweep: Sweep, keep: "front" | "back") => {
  mat.onBeforeCompile = (sh) => {
    sh.uniforms.uSweep = sweep;
    sh.vertexShader = sh.vertexShader
      .replace("#include <common>", "#include <common>\nvarying float vSx;")
      .replace("#include <begin_vertex>", "#include <begin_vertex>\nvSx = position.x;");
    sh.fragmentShader = sh.fragmentShader
      .replace("#include <common>", "#include <common>\nvarying float vSx;\nuniform float uSweep;")
      .replace("void main() {", `void main() {\n  if (${keep === "front" ? "vSx < uSweep" : "vSx > uSweep"}) discard;`);
  };
  mat.customProgramCacheKey = () => `sweep-${keep}`;
  return mat;
};

/** The x-ray glass: a fresnel rim on a near-transparent face, plus an accent seam at the sweep. */
export const xrayMaterial = (sweep: Sweep, opts: { rim?: string; seam?: string; base?: number; rimAlpha?: number } = {}) => {
  const m = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    side: THREE.FrontSide,
    uniforms: {
      uSweep: sweep,
      uRim: { value: new THREE.Color(opts.rim ?? "#4A5668") },
      uSeam: { value: new THREE.Color(opts.seam ?? "#1C69D4") },
      uBase: { value: opts.base ?? 0.035 },
      uRimA: { value: opts.rimAlpha ?? 0.55 },
      uFade: { value: 1 },
    },
    vertexShader: `
      varying vec3 vN; varying vec3 vV; varying float vSx;
      void main() {
        vSx = position.x;
        vec4 wp = modelMatrix * vec4(position, 1.0);
        vN = normalize(mat3(modelMatrix) * normal);
        vV = normalize(cameraPosition - wp.xyz);
        gl_Position = projectionMatrix * viewMatrix * wp;
      }`,
    fragmentShader: `
      uniform float uSweep; uniform vec3 uRim; uniform vec3 uSeam; uniform float uBase; uniform float uRimA; uniform float uFade;
      varying vec3 vN; varying vec3 vV; varying float vSx;
      void main() {
        if (vSx > uSweep) discard;
        float f = pow(1.0 - abs(dot(normalize(vN), normalize(vV))), 2.2);
        float a = (uBase + f * uRimA) * uFade;
        float seam = exp(-pow((uSweep - vSx) / 0.035, 2.0));
        vec3 c = mix(uRim, uSeam, seam);
        gl_FragColor = vec4(c, clamp(a + seam * 0.9, 0.0, 1.0));
      }`,
  });
  return m;
};
