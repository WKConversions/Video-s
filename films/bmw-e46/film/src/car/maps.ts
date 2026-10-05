// The E46 surface-detail maps (build/make_maps.py) and the GLSL that reads them. Every map is a projection of the
// car in its own millimetres: s = from the front bumper, h = height, y = lateral (+ right).
//   side/side2: u = (s + 60) / 4620, v = (h - 100) / 1300
//   top:        u = (s + 60) / 4620, v = (y + 920) / 1840
//   front/front2: u = (y + 920) / 1840, v = (h - 100) / 1000
//   rear:       u = (y + 920) / 1840, v = (h - 100) / 1100
// Channels: side R glass, G chrome, B panel gaps | side2 R headlight, G taillight, B side repeater, A fuel flap
//           top R windscreen, G rear window, B panel gaps, A black cowl
//           front R headlight, G chrome (kidneys, strips), B panel gaps, A black plastic | front2 R fog lens, G plate,
//           B kidney opening (slats), A lower intake mesh
//           rear R tail red, G tail indicator/reverse, B panel gaps, A reflectors
import * as THREE from "three";

export type CarMaps = Record<"side" | "side2" | "top" | "front" | "front2" | "rear", THREE.Texture>;

export const MAP_NAMES = ["side", "side2", "top", "front", "front2", "rear"] as const;

/** GLSL declarations: uniforms and a function that evaluates every region at an object-space point and normal. */
export const MASK_GLSL = /* glsl */ `
uniform sampler2D tSide; uniform sampler2D tSide2; uniform sampler2D tTop;
uniform sampler2D tFront; uniform sampler2D tFront2; uniform sampler2D tRear;
struct Regions { float glass; float chrome; float gap; float black; float head; float tailRed; float tailInd;
                 float repeater; float fog; float reflector; float slatGap; };
Regions carRegions(vec3 p, vec3 n) {
  float s = 2136.5 - p.x * 1000.0; float h = p.y * 1000.0; float y = p.z * 1000.0;
  vec2 uvS = vec2((s + 60.0) / 4620.0, (h - 100.0) / 1300.0);
  vec2 uvT = vec2((s + 60.0) / 4620.0, (y + 920.0) / 1840.0);
  vec2 uvF = vec2((y + 920.0) / 1840.0, (h - 100.0) / 1000.0);
  vec2 uvR = vec2((y + 920.0) / 1840.0, (h - 100.0) / 1100.0);
  float wS = smoothstep(0.12, 0.32, abs(n.z));
  float wT = smoothstep(0.15, 0.35, n.y);
  float wF = smoothstep(0.10, 0.30, n.x) * (1.0 - smoothstep(560.0, 640.0, s));
  float wR = smoothstep(0.10, 0.30, -n.x) * smoothstep(3880.0, 3960.0, s);
  vec4 S = texture2D(tSide, uvS); vec4 S2 = texture2D(tSide2, uvS); vec4 T = texture2D(tTop, uvT);
  vec4 F = texture2D(tFront, uvF); vec4 F2 = texture2D(tFront2, uvF); vec4 R = texture2D(tRear, uvR);
  Regions r;
  r.glass = max(S.r * wS, max(T.r, T.g) * wT);
  r.chrome = max(S.g * wS, F.g * wF);
  r.gap = max(max(S.b * wS, T.b * wT), max(F.b * wF, R.b * wR));
  r.gap = max(r.gap, S2.a * wS * step(0.0, y));
  r.black = max(T.a * wT, F.a * wF);
  float frontEnd = 1.0 - smoothstep(420.0, 470.0, s);
  r.head = max(F.r * wF, S2.r * wS * frontEnd);
  float rearEnd = smoothstep(4120.0, 4180.0, s);
  float tail = max((R.r + R.g) * wR, S2.g * wS * rearEnd);
  float split = smoothstep(748.0, 756.0, h);          // the split line at 772 drawing mm = 754 real
  r.tailRed = tail * split;
  r.tailInd = tail * (1.0 - split);
  r.repeater = S2.b * wS * (1.0 - smoothstep(1500.0, 1600.0, s));
  r.fog = F2.r * wF;
  r.reflector = R.a * wR;
  // kidney slats: vertical bars, 7 mm with 10 mm gaps; the lower intake: a fine horizontal mesh
  float kid = F2.b * wF;
  float bar = smoothstep(0.30, 0.42, abs(fract(y / 17.0) - 0.5));
  float mesh = F2.a * wF * smoothstep(0.32, 0.45, abs(fract(h / 9.0) - 0.5));
  r.slatGap = max(kid * bar, mesh);
  return r;
}
`;
