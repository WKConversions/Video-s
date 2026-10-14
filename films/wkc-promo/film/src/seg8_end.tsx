// Segment 8, shot 3 (1153-1261): the WKC end card building on the reference end card's frames: the wkc mark writes
// itself on (1153-1163) and slides right (1153-1197), "WK" comes out of the cut's white bloom (1153-1171),
// "Conversions" wipes in left to right (to 1179), the "Let's talk" pill rises and its edge lights fade up, its label
// wipes in, and wkconversions.com is typed (1171-1184). From 1205 (everything at rest) it is logo.tsx's EndCard itself.
import React from "react";
import { AbsoluteFill } from "remotion";
import { F, clamp01 } from "./lib";
import { EndCard, spline } from "./logo";
import { WkcLogoParts } from "./seg8_logo";
import { ink, tv } from "./seg8_util";

// the opening-reveal tables the lockup parts are driven by (logo.tsx), used here to find each part's clock
const WRITE: [number, number][] = [[45, 0], [46, 0.05], [47, 0.25], [48, 0.35], [49, 0.45], [50, 0.5], [51, 0.55], [52, 0.62], [53, 0.68], [54, 0.72], [55, 0.76], [56, 0.8], [57, 0.83], [58, 0.86], [59, 0.89], [60, 0.91], [61, 0.93], [62, 0.94], [63, 0.96], [64, 0.97], [65, 0.98], [66, 0.99], [67, 1]];
const BRIGHT: [number, number][] = [[46, 0.22], [47, 0.3], [49, 0.46], [51, 0.62], [53, 0.76], [55, 0.89], [57, 0.95], [59, 1]];
const BLOOM_G: [number, number][] = [[46, 1], [51, 1], [53, 0.95], [54, 0.88], [55, 0.66], [57, 0.54], [58, 0.4], [60, 0.3], [62, 0.24], [64, 0.18], [66, 0.11], [68, 0.05], [69, 0]];
/** inverse of a monotone table: the f in [lo, hi] where spline(f, k) = v (bisection) */
const inv = (v: number, k: [number, number][], lo: number, hi: number) => {
  const up = spline(hi, k) > spline(lo, k);
  let a = lo, b = hi;
  for (let i = 0; i < 40; i++) { const m = (a + b) / 2, y = spline(m, k); if ((y < v) === up) a = m; else b = m; }
  return (a + b) / 2;
};

// ---- measured end-card timing (spec seg8 §4E) ----
/** mark: visible fraction of the handwriting (the reference icon's draw-on: partial at 1153, complete at 1163) */
const W_FR: [number, number][] = [[1152, 0.22], [1153, 0.3], [1154, 0.42], [1155, 0.52], [1156, 0.56], [1157, 0.6], [1158, 0.64], [1159, 0.74], [1160, 0.86], [1161, 0.94], [1162, 0.98], [1163, 1]];
/** mark brightness (the reference icon is already vivid at the cut) */
const M_BR: [number, number][] = [[1153, 0.82], [1156, 0.9], [1160, 1]];
/** mark offset to the left (px): icon left edge 417 (1153) -> 460 (1197), ease-in-out, fastest 1176-1179 */
const M_OFF: [number, number][] = [[1153, 43], [1159, 40], [1163, 38], [1170, 34], [1175, 25], [1180, 11], [1185, 5], [1190, 2], [1197, 0]];
/** "WK" bloom gain: halo luminance above the word 64 -> 21 over 1153-1171 */
const WK_G: [number, number][] = [[1153, 1], [1154, 1], [1155, 0.93], [1156, 0.91], [1157, 0.81], [1158, 0.77], [1159, 0.7], [1160, 0.63], [1161, 0.56], [1162, 0.49],
  [1163, 0.42], [1164, 0.35], [1165, 0.28], [1166, 0.23], [1167, 0.16], [1168, 0.12], [1169, 0.07], [1170, 0.04], [1171, 0]];
/** pill rise (px): top edge light 576 (1155) -> 549 (1204) */
const RISE: [number, number][] = [[1153, 29], [1155, 27], [1159, 23], [1161, 19], [1165, 15], [1169, 12], [1173, 9], [1179, 6], [1185, 4], [1189, 3], [1197, 1], [1204, 0]];
/** edge-light peak (top); the bottom one lags 2 frames */
const STREAK: [number, number][] = [[1153, 0.3], [1157, 0.36], [1161, 0.43], [1165, 0.53], [1169, 0.64], [1173, 0.74], [1175, 0.77], [1181, 0.8], [1183, 1]];
const LENGTH: [number, number][] = [[1153, 0.55], [1165, 0.8], [1183, 1]];
/** label reveal: brightness at its left edge and the drop across it (left-to-right soft wipe), 25 % 1160 ... 100 % 1181 */
const LAB_A: [number, number][] = [[1153, 0.22], [1159, 0.3], [1165, 0.48], [1171, 0.68], [1177, 0.88], [1181, 1]];
const LAB_K: [number, number][] = [[1153, 0.3], [1159, 0.3], [1165, 0.2], [1171, 0.08], [1177, 0]];
/** url: characters typed (17 in 1171-1184, ~1.2 per frame like the reference) */
const URL_N: [number, number][] = [[1170, 0], [1171, 1], [1172, 2], [1173, 4], [1174, 5], [1175, 6], [1176, 7], [1177, 9], [1178, 10], [1179, 11], [1180, 13], [1181, 14], [1182, 15], [1183, 16], [1184, 17]];
const SETTLED = 1205;

const LABEL = { cx: 980.5, size: 62, weight: 700, track: -0.01 };
const step = (n: number, k: [number, number][]) => { let v = k[0][1]; for (const [f, x] of k) if (n >= f) v = x; return v; };

/** the pill (no background, no lockup, no url) moved up by `rise`, clipped and masked */
const PillPart: React.FC<{ rise: number; glow: number; blur?: number; op: number; clip: string; mask?: string }> = ({ rise, glow, blur = 0, op, clip, mask }) =>
  op <= 0 ? null : (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `translateY(${rise}px)`, clipPath: clip, opacity: op,
      WebkitMaskImage: mask, maskImage: mask }}>
      <EndCard logoT={-1} bg={false} url={0} pill={1} glow={glow} pillBlur={blur} />
    </div>
  );

export const EndShot: React.FC<{ g: number }> = ({ g }) => {
  const n = g;
  if (n >= SETTLED) return <AbsoluteFill><EndCard /></AbsoluteFill>;
  const fMark = inv(spline(n, W_FR), WRITE, 45, 67);
  const brightK = Math.min(4, spline(n, M_BR) / Math.max(0.05, spline(fMark, BRIGHT)));
  const fWk = n <= 1153 ? 50 : n <= 1154 ? 51 : inv(spline(n, WK_G), BLOOM_G, 51, 69);
  const fConv = 51.5 + (n - 1156);
  const rise = spline(n, RISE), glow = spline(n, LENGTH), blur = tv(n, [[1153, 2], [1165, 0]]);
  const top = spline(n, STREAK), bot = spline(n - 2, STREAK);
  // label: soft left-to-right brightness ramp across its ink box
  const k = ink("Let's talk", LABEL.size, LABEL.weight, F.head, LABEL.track * LABEL.size);
  const lx0 = LABEL.cx - (k.r - k.l) / 2, lx1 = LABEL.cx + (k.r - k.l) / 2;
  const A = spline(n, LAB_A), K = spline(n, LAB_K);
  const ramp = [0, 0.25, 0.5, 0.75, 1].map((u) => `rgba(0,0,0,${clamp01(A - K * u * 2.4).toFixed(3)}) ${(lx0 + (lx1 - lx0) * u).toFixed(1)}px`).join(", ");
  const labelMask = `linear-gradient(90deg, ${ramp})`;
  const LR = { x0: 790, x1: 1175, y0: 578, y1: 668, mid: 623 };
  return (
    <AbsoluteFill>
      <EndCard logoT={-1} pill={0} url={step(n, URL_N) / 17} />
      <WkcLogoParts fMark={fMark} brightK={brightK} markOff={spline(n, M_OFF)} fWk={fWk} fConv={fConv} convOff={0} />
      <PillPart rise={rise} glow={glow} blur={blur} op={top} clip={`path(evenodd, "M0 0H1920V${LR.mid}H0Z M${LR.x0} ${LR.y0}H${LR.x1}V${LR.mid}H${LR.x0}Z")`} />
      <PillPart rise={rise} glow={glow} blur={blur} op={bot} clip={`path(evenodd, "M0 ${LR.mid}H1920V1080H0Z M${LR.x0} ${LR.mid}H${LR.x1}V${LR.y1}H${LR.x0}Z")`} />
      <PillPart rise={rise} glow={glow} blur={blur} op={1} clip={`inset(${LR.y0}px ${1920 - LR.x1}px ${1080 - LR.y1}px ${LR.x0}px)`} mask={labelMask} />
    </AbsoluteFill>
  );
};
