// WORKED EXAMPLE (realism demo, Oct 2026): two real Mixkit phone shots with tracked screens, a virtual camera,
// zoom-through joints, break-out UI layers and shutter motion blur. It imports FPS, OnQuad, quadMatrix, Quad, Pt and
// the eases from a film kit (see realism_kit.tsx) and the screen UIs from ./ui; adapt the imports to your build.
import React, { useCallback, useLayoutEffect, useRef, useState } from "react";
import { AbsoluteFill, Easing, Img, OffthreadVideo, continueRender, delayRender, getRemotionEnvironment, staticFile } from "remotion";
import { C, FPS, INOUT, OUT, OnQuad, Pt, Quad, SCREEN_GRAD, clamp01, mix, ramp } from "./kit";
import {
  FORM_FIELD, FORM_FIELD_LIFT, FORM_H, FORM_PRESS, FORM_W, FormField, PHONE_WAKE_GLOW, PhoneForm, PhoneWake,
  WAKE_H, WAKE_LOGO, WAKE_LOGO_LIFT, WAKE_W, WakeLogo,
} from "./ui";
import round from "../../public/tracks/round.json";
import wood from "../../public/tracks/wood.json";

// The two real-footage shots (Mixkit, graded low-key), each with a UI pinned on the tracked phone screen and its
// light spilling onto the surface. t = local seconds; the shot plays from its own Sequence start, so the video and
// the track line up frame for frame (tracks: public/tracks/*.json, one quad per 60 fps frame, TL TR BR BL).
//
// Motion design on top of the footage:
// - a virtual CAMERA (2D similarity: a footage point lands on the frame centre, scaled and rolled) with speed-ramped
//   moves; the joints are camera moves that start/end on a screen filling the frame (scale and roll solved from the
//   tracked quad so the upright screen covers 1920x1080);
// - a 3D pose of the screen plane recovered from the quad (homography decomposition, f = 1700 px), so break-out
//   layers (the wordmark, the text field) float above the glass with true parallax and fly past the camera on a dive;
// - shutter motion blur: the scene is drawn at several camera times across a 270° shutter and averaged.
export const ROUND_DUR = 2.2;
export const WOOD_DUR = 1.45;
const ROUND_LAST = 131 / FPS; // local time of the shot's last frame
const WOOD_LAST = 86 / FPS;
const D2R = Math.PI / 180;
const W = 1920;
const H_ = 1080;

// ───────────────────────── geometry
type V3 = [number, number, number];
type M3 = number[]; // row-major 3x3
const add3 = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const sc3 = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k];
const dot3 = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross3 = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const unit3 = (a: V3): V3 => sc3(a, 1 / Math.hypot(a[0], a[1], a[2]));

/** UI (u, v) in a w×h box → image px, the same projective map as kit's quadMatrix */
const homography = (w: number, h: number, q: Quad): M3 => {
  const [[x0, y0], [x1, y1], [x2, y2], [x3, y3]] = q;
  const dx1 = x1 - x2, dx2 = x3 - x2, dy1 = y1 - y2, dy2 = y3 - y2;
  const sx = x0 - x1 + x2 - x3, sy = y0 - y1 + y2 - y3;
  let g = 0, hh = 0;
  if (Math.abs(sx) > 1e-9 || Math.abs(sy) > 1e-9) {
    const den = dx1 * dy2 - dx2 * dy1;
    g = (sx * dy2 - dx2 * sy) / den;
    hh = (dx1 * sy - sx * dy1) / den;
  }
  return [(x1 - x0 + g * x1) / w, (x3 - x0 + hh * x3) / h, x0, (y1 - y0 + g * y1) / w, (y3 - y0 + hh * y3) / h, y0, g / w, hh / h, 1];
};
const hApply = (H: M3, u: number, v: number): Pt => {
  const z = H[6] * u + H[7] * v + H[8];
  return [(H[0] * u + H[1] * v + H[2]) / z, (H[3] * u + H[4] * v + H[5]) / z];
};
const hInv = (H: M3): M3 => [
  H[4] * H[8] - H[5] * H[7], H[2] * H[7] - H[1] * H[8], H[1] * H[5] - H[2] * H[4],
  H[5] * H[6] - H[3] * H[8], H[0] * H[8] - H[2] * H[6], H[2] * H[3] - H[0] * H[5],
  H[3] * H[7] - H[4] * H[6], H[1] * H[6] - H[0] * H[7], H[0] * H[4] - H[1] * H[3],
];

// the screen plane in camera space (units: UI px): X(u, v, z) = r1 u + r2 v + n z + t
const FOCAL = 1700;
interface Pose { r1: V3; r2: V3; n: V3; t: V3 }
const project = (X: V3): Pt => [W / 2 + (FOCAL * X[0]) / X[2], H_ / 2 + (FOCAL * X[1]) / X[2]];
const poseOf = (H: M3): Pose => {
  if (Math.abs(H[6]) + Math.abs(H[7]) > 1e-7) {
    // projective track: decompose K^-1 H = λ [r1 r2 t]
    const col = (j: number): V3 => [(H[j] - (W / 2) * H[6 + j]) / FOCAL, (H[3 + j] - (H_ / 2) * H[6 + j]) / FOCAL, H[6 + j]];
    const m1 = col(0), m2 = col(1), m3 = col(2);
    let l = 2 / (Math.hypot(...m1) + Math.hypot(...m2));
    if (m3[2] * l < 0) l = -l;
    const r1 = sc3(m1, l), r2 = sc3(m2, l), t = sc3(m3, l);
    let n = unit3(cross3(r1, r2));
    if (dot3(n, t) > 0) n = sc3(n, -1);
    return { r1, r2, n, t };
  }
  // affine track (weak perspective): recover the plane's tilt from the 2x2 part, normal pointing up the image
  const a: Pt = [H[0] / H[8], H[3] / H[8]], b: Pt = [H[1] / H[8], H[4] / H[8]];
  const aa = a[0] * a[0] + a[1] * a[1], bb = b[0] * b[0] + b[1] * b[1], ab = a[0] * b[0] + a[1] * b[1];
  const c1 = aa + bb, c2 = aa * bb - ab * ab;
  const u = (c1 - Math.sqrt(Math.max(0, c1 * c1 - 4 * c2))) / (2 * c2);
  const s = 1 / Math.sqrt(u);
  let r1z = Math.sqrt(Math.max(0, 1 - aa * u));
  let r2z = r1z > 1e-6 ? (-ab * u) / r1z : Math.sqrt(Math.max(0, 1 - bb * u));
  const mk = (): Pose => {
    const r1: V3 = [a[0] / s, a[1] / s, r1z], r2: V3 = [b[0] / s, b[1] / s, r2z];
    let n = unit3(cross3(r1, r2));
    if (n[2] > 0) n = sc3(n, -1);
    const Z0 = FOCAL / s;
    return { r1, r2, n, t: [(H[2] / H[8] - W / 2) / s, (H[5] / H[8] - H_ / 2) / s, Z0] };
  };
  let P = mk();
  if (P.n[1] > 0) { r1z = -r1z; r2z = -r2z; P = mk(); }
  return P;
};
const world = (P: Pose, u: number, v: number, z: number): V3 =>
  add3(add3(add3(sc3(P.r1, u), sc3(P.r2, v)), sc3(P.n, z)), P.t);

/** image point of (u, v) lifted z above the plane, as an offset from its footprint (exact at z = 0 for any track) */
const liftImg = (P: Pose, H: M3, u: number, v: number, z: number): Pt => {
  const f = hApply(H, u, v);
  const a = project(world(P, u, v, z)), b = project(world(P, u, v, 0));
  return [f[0] + a[0] - b[0], f[1] + a[1] - b[1]];
};

// ───────────────────────── camera: footage point (ax, ay) lands on the frame centre, scaled s, rolled th (rad)
interface Cam { ax: number; ay: number; s: number; th: number }
const camPt = (c: Cam, p: Pt): Pt => {
  const dx = (p[0] - c.ax) * c.s, dy = (p[1] - c.ay) * c.s, co = Math.cos(c.th), si = Math.sin(c.th);
  return [W / 2 + co * dx - si * dy, H_ / 2 + si * dx + co * dy];
};
const camInv = (c: Cam, p: Pt): Pt => {
  const dx = p[0] - W / 2, dy = p[1] - H_ / 2, co = Math.cos(c.th), si = Math.sin(c.th);
  return [c.ax + (co * dx + si * dy) / c.s, c.ay + (-si * dx + co * dy) / c.s];
};
const camCss = (c: Cam) => `translate(${W / 2}px, ${H_ / 2}px) rotate(${c.th}rad) scale(${c.s}) translate(${-c.ax}px, ${-c.ay}px)`;
/** zoom interpolates in log space (constant-feeling zoom speed); anchor and roll can run on their own curves */
const lerpCam = (a: Cam, b: Cam, kS: number, kA = kS, kTh = kS): Cam => ({
  ax: mix(a.ax, b.ax, kA), ay: mix(a.ay, b.ay, kA), s: Math.exp(mix(Math.log(a.s), Math.log(b.s), kS)), th: mix(a.th, b.th, kTh),
});

/** keep a footage-only framing inside the footage: scale up if needed, then slide the anchor in */
const frameClamp = (c: Cam): Cam => {
  const co = Math.abs(Math.cos(c.th)), si = Math.abs(Math.sin(c.th));
  const s = Math.max(c.s, co + (W / H_) * si, co + (H_ / W) * si) * 1.002;
  const ex = (W / 2 * co + H_ / 2 * si) / s, ey = (W / 2 * si + H_ / 2 * co) / s;
  return { ax: Math.min(W - ex, Math.max(ex, c.ax)), ay: Math.min(H_ - ey, Math.max(ey, c.ay)), s, th: c.th };
};

const orient = (q: Quad) => {
  let a = 0;
  for (let j = 0; j < 4; j++) { const p = q[j], r = q[(j + 1) % 4]; a += p[0] * r[1] - p[1] * r[0]; }
  return a > 0 ? 1 : -1;
};
const inQuad = (q: Quad, p: Pt, sg: number) => {
  for (let j = 0; j < 4; j++) {
    const a = q[j], b = q[(j + 1) % 4];
    if (sg * ((b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0])) < 0) return false;
  }
  return true;
};
const FRAME_CORNERS: Pt[] = [[0, 0], [W, 0], [W, H_], [0, H_]];
/** largest 1/s for which the rolled frame around anchor A fits inside the (convex) quad */
const fitRho = (q: Quad, A: Pt, th: number) => {
  const sg = orient(q), co = Math.cos(-th), si = Math.sin(-th);
  const ds = FRAME_CORNERS.map(([x, y]) => [co * (x - W / 2) - si * (y - H_ / 2), si * (x - W / 2) + co * (y - H_ / 2)]);
  let rho = 1e9;
  for (let j = 0; j < 4; j++) {
    const p = q[j], r = q[(j + 1) % 4], ex = r[0] - p[0], ey = r[1] - p[1];
    const base = sg * (ex * (A[1] - p[1]) - ey * (A[0] - p[0]));
    for (const d of ds) {
      const k = sg * (ex * d[1] - ey * d[0]);
      if (k < 0) rho = Math.min(rho, base / -k);
    }
  }
  return Math.max(rho, 1e-4);
};
/** the camera that fills the frame with the upright screen around UI point (u, v), with a margin */
const fillCam = (H: M3, q: Quad, u: number, v: number, margin: number): Cam => {
  const A = hApply(H, u, v), B = hApply(H, u + 1, v);
  const th = -Math.atan2(B[1] - A[1], B[0] - A[0]);
  return { ax: A[0], ay: A[1], s: margin / fitRho(q, A, th), th };
};
/** no black: every frame-edge point must land on the footage or on the screen; otherwise zoom in just enough */
const BORDER: Pt[] = [];
for (let i = 0; i < 12; i++) { const k = i / 12; BORDER.push([k * W, 0], [W, k * H_], [W - k * W, H_], [0, H_ - k * H_]); }
const covered = (c: Cam, q: Quad, sg: number) => BORDER.every((F) => {
  const p = camInv(c, F);
  return (p[0] >= 0 && p[0] <= W && p[1] >= 0 && p[1] <= H_) || inQuad(q, p, sg);
});
const ensureCover = (c: Cam, q: Quad): Cam => {
  const sg = orient(q);
  if (covered(c, q, sg)) return c;
  let lo = Math.log(c.s), hi = lo + 3;
  for (let i = 0; i < 20; i++) { const m = (lo + hi) / 2; if (covered({ ...c, s: Math.exp(m) }, q, sg)) hi = m; else lo = m; }
  return { ...c, s: Math.exp(hi) };
};

// ───────────────────────── eases (speed ramps)
/** fast-slow push: a firm start that keeps decelerating into a creep */
const PUSH = Easing.bezier(0.3, 0.62, 0.25, 1);
/** the dive: a slow wind-up that whips at the end (max speed on the last frame) */
const DIVE = Easing.bezier(0.6, 0, 0.8, 0.25);
/** fast start with a small overshoot that settles back (the pull-out lands) */
const backOut = (x: number, c = 1.1) => { const y = clamp01(x) - 1; return 1 + (c + 1) * y * y * y + c * y * y; };

// ───────────────────────── shutter motion blur
const SHUTTER = 0.75 / FPS; // 270°
const PROBES: Pt[] = [[0, 0], [W, 0], [W, H_], [0, H_], [W / 2, H_ / 2], [W / 2, 0], [W / 2, H_]];
const blurPlan = (camAt: (tc: number) => Cam, t: number, tEnd: number) => {
  const a = Math.max(0, t - SHUTTER / 2), b = Math.min(tEnd, t + SHUTTER / 2);
  const c = camAt(t), c0 = camAt(a), c1 = camAt(b);
  let disp = 0;
  for (const F of PROBES) {
    const p = camInv(c, F), p0 = camPt(c0, p), p1 = camPt(c1, p);
    disp = Math.max(disp, Math.hypot(p1[0] - p0[0], p1[1] - p0[1]));
  }
  const n = Math.max(1, Math.min(12, Math.ceil(disp / 5)));
  /** the sample times for m samples (m = 1 in the Studio preview: a plain blur stands in) */
  const at = (m: number) => m <= 1
    ? { times: [t], blur: disp > 2.5 ? Math.min(14, disp * 0.3) : 0 }
    : { times: Array.from({ length: m }, (_, i) => mix(a, b, i / (m - 1))), blur: Math.min(10, (disp / (m - 1)) * 0.45) };
  return { n, at, disp };
};

// ───────────────────────── the scene
/** a card floating above the screen (UI box x, y, w, h at height z, UI px), seen by the camera: its corners in frame
 * px, its depth ratio (glass depth / card depth, > 1 = nearer than the glass) and whether it is still before the lens.
 * face 0..1 turns the card from the glass's plane toward the lens; launch 0..1 sends it along its line of sight to a
 * point aimUp above the lens (1 = at the lens), so it grows and flies past the camera. */
const floatQuad = (P: Pose, H: M3, cam: Cam, x: number, y: number, w: number, h: number, z: number, face = 0, launch = 0, aimUp = 0) => {
  // the 2D zoom is read as a dolly toward the anchor's point on the plane (k = 1 - 1/s), which gives the parallax
  const k = 1 - 1 / cam.s;
  const A = hApply(hInv(H), cam.ax, cam.ay);
  const T = sc3(world(P, A[0], A[1], 0), k);
  const co = Math.cos(cam.th), si = Math.sin(cam.th);
  const cu = x + w / 2, cv = y + h / 2;
  const C0 = world(P, cu, cv, z);
  const Xc = add3(C0, sc3(T, -1));
  const Cn = add3(Xc, sc3(add3([0, -aimUp, 0], sc3(Xc, -1)), launch));
  // Rodrigues: turn the plane normal toward the lens (0, 0, -1) by `face`
  const tgt: V3 = [0, 0, -1];
  const ax0 = cross3(P.n, tgt), sinA = Math.hypot(ax0[0], ax0[1], ax0[2]);
  const ax = sinA > 1e-6 ? sc3(ax0, 1 / sinA) : ([1, 0, 0] as V3);
  const ang = Math.atan2(sinA, dot3(P.n, tgt)) * face, ca = Math.cos(ang), sa = Math.sin(ang);
  const rot = (v: V3): V3 => add3(add3(sc3(v, ca), sc3(cross3(ax, v), sa)), sc3(ax, dot3(ax, v) * (1 - ca)));
  let minZ = Infinity;
  const corners = ([[x, y], [x + w, y], [x + w, y + h], [x, y + h]] as Pt[]).map(([u, v]) => {
    const Xl = add3(Cn, rot(add3(world(P, u, v, z), sc3(C0, -1))));
    const Xf = add3(world(P, u, v, 0), sc3(T, -1));
    minZ = Math.min(minZ, Xl[2]);
    const a = project(Xl), b = project(Xf), f = camPt(cam, hApply(H, u, v));
    const dx = a[0] - b[0], dy = a[1] - b[1];
    return [f[0] + co * dx - si * dy, f[1] + si * dx + co * dy] as Pt;
  }) as Quad;
  const zScreen = world(P, cu, cv, 0)[2] - T[2];
  return { q: corners, ratio: zScreen / Math.max(1e-3, minZ), visible: minZ > 0.04 * zScreen };
};

interface SceneProps {
  video: React.ReactNode; cam: Cam; q: Quad; uiW: number; uiH: number; glow: number; spill: number; videoBlur?: number;
  ui: React.ReactNode; under?: React.ReactNode; over?: React.ReactNode;
}
/** footage + grade + spill + pinned UI, through the camera; `over` is drawn in frame space above it */
const Scene: React.FC<SceneProps> = ({ video, cam, q, uiW, uiH, glow, spill, ui, under, over }) => {
  const cx = (q[0][0] + q[1][0] + q[2][0] + q[3][0]) / 4, cy = (q[0][1] + q[1][1] + q[2][1] + q[3][1]) / 4;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H_, transformOrigin: "0 0", transform: camCss(cam) }}>
        {video}
        {/* cool low-key grade */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(20,40,60,0.35), rgba(5,12,18,0.25))", mixBlendMode: "multiply" }} />
        {/* the screen's light on the surface */}
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 820px 560px at ${cx}px ${cy}px, rgba(168,196,187,${0.55 * glow * spill}) 0%, rgba(135,168,158,${0.22 * glow * spill}) 40%, rgba(0,0,0,0) 72%)`, mixBlendMode: "screen" }} />
        {under}
        <OnQuad w={uiW} h={uiH} q={q}>{ui}</OnQuad>
        {/* glass sheen over the screen */}
        <OnQuad w={uiW} h={uiH} q={q} style={{ background: "linear-gradient(125deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.02) 38%, rgba(255,255,255,0) 60%)" }}><div /></OnQuad>
      </div>
      {over}
    </AbsoluteFill>
  );
};

/** One OffthreadVideo per shot fetches the footage frame; the other shutter samples reuse its decoded blob (several
 * OffthreadVideos asking the compositor for the same frame at once stall it). While rendering, a delayRender holds
 * the frame until the copies are mounted (their Img then holds it until decoded). In the Studio preview: one sample. */
const useFootage = (src: string, t: number, wantSamples: number, videoBlur: number) => {
  const rendering = getRemotionEnvironment().isRendering;
  const need = rendering && wantSamples > 1;
  const [shared, setShared] = useState<{ t: number; src: string } | null>(null);
  const handle = useRef<number | null>(null);
  useLayoutEffect(() => {
    if (!need) return;
    const h = delayRender(`footage shutter samples ${src} t=${t}`);
    handle.current = h;
    return () => { if (handle.current === h) { continueRender(h); handle.current = null; } };
  }, [need, src, t]);
  const ready = need && shared !== null && shared.t === t;
  useLayoutEffect(() => {
    if (ready && handle.current !== null) { continueRender(handle.current); handle.current = null; }
  }, [ready]);
  const onFrame = useCallback((f: CanvasImageSource) => {
    if (typeof HTMLImageElement !== "undefined" && f instanceof HTMLImageElement) setShared({ t, src: f.src });
  }, [t]);
  const style: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: W, height: H_,
    filter: `brightness(0.62) contrast(1.18) saturate(0.78)${videoBlur > 0.05 ? ` blur(${videoBlur.toFixed(2)}px)` : ""}` };
  const video = (i: number): React.ReactNode => i === 0
    ? <OffthreadVideo src={staticFile(src)} muted style={style} onVideoFrame={need ? onFrame : undefined} />
    : ready ? <Img src={shared!.src} style={style} /> : null;
  return { samples: need ? wantSamples : 1, video };
};

/** averages the scene over the shutter: layer i at opacity 1/(i+1) gives the mean of all samples */
const Shutter: React.FC<{ times: number[]; blur: number; render: (tc: number, i: number) => React.ReactNode }> = ({ times, blur, render }) => (
  <>
    {times.map((tc, i) => (
      <AbsoluteFill key={i} style={{ opacity: 1 / (i + 1), filter: blur > 0.05 ? `blur(${blur.toFixed(2)}px)` : undefined }}>
        {render(tc, i)}
      </AbsoluteFill>
    ))}
  </>
);

const Vignette: React.FC<{ k: number }> = ({ k }) => (k > 0.001
  ? <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,${0.55 * k}) 100%)` }} />
  : null);

const quadAt = (Q: Quad[], t: number): Quad => Q[Math.min(Math.max(0, Math.round(t * FPS)), Q.length - 1)];

// ───────────────────────── 1. round: the phone on the stone stool wakes; the camera dives through the glass (J1)
const RQ = round.quads as unknown as Quad[];
const R_FILL = { u: WAKE_W / 2, v: 700 };
const J1_ROLL = 1.74;
const J1_DIVE = 1.8;

const roundBase = (tc: number): Cam => {
  const k = ramp(tc, 0, 1.75, PUSH);
  const creep = clamp01((tc - 0.8) / 1.4);
  return frameClamp({
    ax: mix(905, 716, k), ay: mix(566, 614, k),
    s: 1.07 * Math.exp(Math.log(1.4 / 1.07) * k + 0.07 * creep),
    th: (mix(-2.6, 1.0, k) + 1.2 * creep) * D2R,
  });
};
const roundCam = (tc: number, q: Quad, H: M3): Cam => {
  const base = roundBase(tc);
  // a breath back before the dive (anticipation), then the whip in with the roll that straightens the screen
  const antic = 0.04 * Math.sin(Math.PI * clamp01((tc - 1.62) / 0.3));
  const fill = fillCam(H, q, R_FILL.u, R_FILL.v, 1.16);
  const kS = ramp(tc, J1_DIVE, ROUND_LAST - J1_DIVE, DIVE);
  const kA = ramp(tc, 1.74, 0.36, INOUT);
  const kTh = ramp(tc, J1_ROLL, ROUND_LAST - J1_ROLL, Easing.bezier(0.5, 0, 0.3, 1));
  return ensureCover(lerpCam({ ...base, s: base.s * (1 - antic) }, fill, kS, kA, kTh), q);
};
/** the wordmark: lifts off the glass on a spring (tilting up toward us), then turns to face the lens and flies past
 * it as the camera dives */
const LAUNCH = Easing.bezier(0.55, 0, 0.85, 0.35);
const roundLogo = (t: number) => {
  const lift = WAKE_LOGO_LIFT(t);
  const launch = 0.97 * ramp(t, 1.9, ROUND_LAST - 0.03 - 1.9, LAUNCH);
  return { z: lift + 60 * launch, face: 0.3 * clamp01(lift / 70) + 0.7 * ramp(t, 1.88, 0.22, INOUT), launch };
};

/** the glass ring: a thin ring of sage light on the stone, rippling out from under the phone as the screen blooms */
const GlassRing: React.FC<{ t: number; P: Pose; H: M3; id: string }> = ({ t, P, H, id }) => {
  const k = ramp(t, 0.97, 1.05, Easing.bezier(0.1, 0.7, 0.3, 1));
  if (t < 0.97 || k >= 0.999) return null;
  const r = mix(340, 1120, k);
  const a = clamp01((t - 0.97) / 0.07) * Math.pow(1 - k, 0.9);
  const zT = -55; // the stone surface, a phone's thickness under the glass
  const ring = (rr: number) => Array.from({ length: 120 }, (_, i) => {
    const g = (i / 120) * Math.PI * 2;
    const p = liftImg(P, H, WAKE_W / 2 + rr * Math.cos(g), WAKE_H / 2 + rr * Math.sin(g), zT);
    return `${p[0].toFixed(1)},${p[1].toFixed(1)}`;
  }).join(" ");
  // the phone body (glass + bezel, top and bottom faces) masks the ring: it passes under the phone
  const e = 34;
  const body: Pt[] = [];
  for (const z of [0, zT]) for (const [u, v] of [[-e, -e], [WAKE_W + e, -e], [WAKE_W + e, WAKE_H + e], [-e, WAKE_H + e]]) body.push(liftImg(P, H, u, v, z));
  const hull = convexHull(body).map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
  return (
    <svg width={W} height={H_} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", mixBlendMode: "screen" }}>
      <defs>
        <mask id={`m${id}`} maskUnits="userSpaceOnUse" x={-6000} y={-6000} width={14000} height={14000}>
          <rect x={-6000} y={-6000} width={14000} height={14000} fill="white" />
          <polygon points={hull} fill="black" />
        </mask>
        <filter id={`g${id}`} x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation={16} /></filter>
        <filter id={`h${id}`} x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation={2.2} /></filter>
      </defs>
      <g mask={`url(#m${id})`} opacity={a}>
        <polygon points={ring(r - 10)} fill="none" stroke={C.sage} strokeWidth={34} filter={`url(#g${id})`} opacity={0.95} />
        <polygon points={ring(r)} fill="none" stroke={C.glow} strokeWidth={5} filter={`url(#h${id})`} opacity={0.9} />
        <polygon points={ring(r)} fill="none" stroke="#F2FAF7" strokeWidth={1.8} />
        <polygon points={ring(r - 22)} fill="none" stroke={C.sageLight} strokeWidth={1.2} opacity={0.6} />
      </g>
    </svg>
  );
};
const convexHull = (pts: Pt[]): Pt[] => {
  const p = [...pts].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cr = (o: Pt, a: Pt, b: Pt) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lo: Pt[] = [], up: Pt[] = [];
  for (const q of p) { while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop(); lo.push(q); }
  for (const q of [...p].reverse()) { while (up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], q) <= 0) up.pop(); up.push(q); }
  return lo.slice(0, -1).concat(up.slice(0, -1));
};

export const RoundShot: React.FC<{ t: number }> = ({ t }) => {
  const q = quadAt(RQ, t);
  const H = homography(WAKE_W, WAKE_H, q);
  const P = poseOf(H);
  const camAt = (tc: number) => roundCam(tc, q, H);
  const plan = blurPlan(camAt, t, ROUND_LAST);
  const foot = useFootage("footage/seg_round.mp4", t, plan.n, 0);
  const shot = plan.at(foot.samples);
  const logo = roundLogo(t);
  const glow = PHONE_WAKE_GLOW(t);
  const dive = ramp(t, J1_DIVE, ROUND_LAST - J1_DIVE, (x) => x);
  const L = WAKE_LOGO;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <Shutter times={shot.times} blur={shot.blur} render={(tc, i) => {
        const cam = camAt(tc);
        const fq = t >= 1.38 ? floatQuad(P, H, cam, L.x, L.y, L.w, L.h, logo.z, logo.face, logo.launch, 260) : null;
        const fade = fq ? 1 - ramp(fq.ratio, 2.6, 3.4, (x) => x) : 0;
        return (
          <Scene video={foot.video(i)} cam={cam} q={q} uiW={WAKE_W} uiH={WAKE_H} glow={glow} spill={1}
            ui={<PhoneWake t={t} logoZ={logo.z + 500 * logo.launch} />} under={<GlassRing t={t} P={P} H={H} id={`r${i}`} />}
            over={fq && fq.visible && fade > 0.01 ? (
              <OnQuad w={L.w} h={L.h} q={fq.q} style={{ overflow: "visible", opacity: fade,
                filter: fq.ratio > 1.15 ? `blur(${Math.min(30, (fq.ratio - 1.1) * 9).toFixed(2)}px)` : undefined }}>
                <WakeLogo t={t} />
              </OnQuad>
            ) : null} />
        );
      }} />
      <Vignette k={1 - dive} />
      {/* J1: the last frames settle on the full-frame screen glow the next shot opens on */}
      {t > ROUND_LAST - 0.08 && <AbsoluteFill style={{ background: SCREEN_GRAD, opacity: ramp(t, ROUND_LAST - 0.075, 0.075, (x) => x) }} />}
    </AbsoluteFill>
  );
};

// ───────────────────────── 2. wood: out of the white (J2), the field lifts off while it types, press, dive (J3)
const WQ = wood.quads as unknown as Quad[];
const J2_END = 0.5;
const J3_DIVE = 1.1;

const woodBase = (tc: number): Cam => {
  const k = ramp(tc, 0.15, 1.3, INOUT);
  return frameClamp({ ax: mix(915, 870, k), ay: mix(452, 488, k), s: mix(1.17, 1.25, k), th: mix(-4.2, -1.4, k) * D2R });
};
const woodCam = (tc: number, q: Quad, H: M3): Cam => {
  const base = woodBase(tc);
  // J2: from the upright white screen filling the frame, a fast pull-out with roll that lands with a small overshoot
  const fillIn = fillCam(H, q, FORM_W / 2, 690, 1.12);
  const kIn = backOut(tc / J2_END);
  const kInA = ramp(tc, 0, J2_END, OUT);
  let c = lerpCam(fillIn, base, kIn, kInA, kIn);
  // J3: after the press, the dive into the white with the roll back to upright
  const fillOut = fillCam(H, q, FORM_PRESS.u, FORM_PRESS.v + 10, 1.16);
  const kS = ramp(tc, J3_DIVE, WOOD_LAST - J3_DIVE, DIVE);
  const kA = ramp(tc, 1.06, 0.3, INOUT);
  const kTh = ramp(tc, 1.04, WOOD_LAST - 1.04, Easing.bezier(0.5, 0, 0.3, 1));
  c = lerpCam(c, fillOut, kS, kA, kTh);
  return ensureCover(c, q);
};
/** the field: lifts toward the camera while it types (tilting up toward us), then flies past the lens on the dive */
const woodField = (t: number) => {
  const lift = FORM_FIELD_LIFT(t);
  const launch = 0.97 * ramp(t, 1.1, WOOD_LAST - 0.03 - 1.1, LAUNCH);
  return { z: lift, face: 0.35 * clamp01(lift / 120) + 0.65 * ramp(t, 1.06, 0.25, INOUT), launch };
};

export const WoodShot: React.FC<{ t: number }> = ({ t }) => {
  const q = quadAt(WQ, t);
  const H = homography(FORM_W, FORM_H, q);
  const P = poseOf(H);
  const camAt = (tc: number) => woodCam(tc, q, H);
  const plan = blurPlan(camAt, t, WOOD_LAST);
  const fld = woodField(t);
  const lifted = clamp01(FORM_FIELD_LIFT(t) / 120);
  const out = ramp(t, 0, J2_END, OUT) * (1 - ramp(t, J3_DIVE, WOOD_LAST - J3_DIVE, (x) => x));
  // a touch of rack focus: the slats soften while the field floats toward the lens
  const foot = useFootage("footage/seg_wood.mp4", t, plan.n, 1.4 * lifted * out);
  const shot = plan.at(foot.samples);
  const F = FORM_FIELD, M = 40; // the floating card carries a margin for its glow
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <Shutter times={shot.times} blur={shot.blur} render={(tc, i) => {
        const cam = camAt(tc);
        const fq = floatQuad(P, H, cam, F.x - M, F.y - M, F.w + 2 * M, F.h + 2 * M, fld.z, fld.face, fld.launch, 200);
        const fade = 1 - ramp(fq.ratio, 2.6, 3.0, (x) => x);
        return (
          <Scene video={foot.video(i)} cam={cam} q={q} uiW={FORM_W} uiH={FORM_H} glow={1} spill={0.7}
            ui={<PhoneForm t={t} fieldZ={fld.z + 400 * fld.launch} />}
            over={fq.visible && fade > 0.01 ? (
              <OnQuad w={F.w + 2 * M} h={F.h + 2 * M} q={fq.q} style={{ opacity: fade,
                filter: fq.ratio > 1.15 ? `blur(${Math.min(30, (fq.ratio - 1.1) * 9).toFixed(2)}px)` : undefined }}>
                <div style={{ position: "absolute", left: M, top: M, borderRadius: 20,
                  boxShadow: `0 ${mix(4, 16, lifted)}px ${mix(10, 34, lifted)}px rgba(26,22,20,${0.1 + 0.1 * lifted}), 0 0 ${24 * lifted}px rgba(135,168,158,${0.35 * lifted})` }}>
                  <FormField t={t} focus={lifted} />
                </div>
              </OnQuad>
            ) : null} />
        );
      }} />
      <Vignette k={out} />
      {/* J2: the first frames are the white the previous shot bloomed into */}
      {t < 0.06 && <AbsoluteFill style={{ background: C.bg, opacity: 1 - ramp(t, 0, 0.05, (x) => x) }} />}
      {/* J3: the last frames settle on full white */}
      {t > WOOD_LAST - 0.08 && <AbsoluteFill style={{ background: C.bg, opacity: ramp(t, WOOD_LAST - 0.075, 0.075, (x) => x) }} />}
    </AbsoluteFill>
  );
};
