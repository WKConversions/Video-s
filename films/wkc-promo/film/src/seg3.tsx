// Segment 3 (frames 287–386, 9.57–12.87 s): hard cut to the pastel glass prompt pill, "Tell us what needs explaining"
// types in, the send button is pressed, the rings fly past the camera and the input field morphs into the 3D WKC project
// brief card (seg3_card.tsx), which turns away until the hard cut at 387. Built from spec/seg3.md; every size and pose
// is the reference's measurement (seg3_data.tsx), re-coloured into WKC's blues.
import React, { useLayoutEffect, useRef } from "react";
import { AbsoluteFill } from "remotion";
import { C, F, clamp01, lerp } from "./lib";
import { Grain } from "./kit";
import { FIELD_H, FIELD_W, GRIDS, PILL_H, PILL_W, RIM, RING_B, RING_D, RING_H } from "./seg3_data";
import { Card, Ghosts, TypedText, kf, mix, stadium } from "./seg3_card";

/** the frames this segment draws: the reference cuts in at 287 and out at 387 (seg 4 keeps the background going) */
export const RANGE: [number, number] = [287, 387];

/** value of a per-frame table starting at frame a (clamped at both ends) */
const at = (arr: number[], a: number, g: number) => arr[Math.max(0, Math.min(arr.length - 1, Math.round(g - a)))];

/** The measured per-frame tables carry the reference's 1-px measurement steps; used raw they make the pill, field,
 *  text and button shake (jitter_check 9.5-11.3 s). Weighted Whittaker smoother: penalises third differences (eased
 *  curves keep their acceleration); a frame's weight grows with its speed (1 + (v/c)^2), so fast eases keep their
 *  measured values and only slow motion is evened out (stays within ~2 px of the measurements). cuts start a new
 *  piece at an event (cut-in, button press, the rings' fly-out); pieces starting at an index in raw stay as measured. */
const smooth = (y: number[], c: number, cuts: number[] = [], raw: number[] = [], lam = 10): number[] => {
  const out = y.slice(), b = [0, ...cuts, y.length];
  for (let p = 0; p < b.length - 1; p++) {
    const a = b[p], n = b[p + 1] - a;
    if (n <= 4 || raw.includes(a)) continue;
    const s = y.slice(a, a + n), r: number[] = [];
    const A = Array.from({ length: n }, () => new Array<number>(n).fill(0));
    for (let i = 0; i < n; i++) {
      const v = (s[Math.min(n - 1, i + 1)] - s[Math.max(0, i - 1)]) / (i === 0 || i === n - 1 ? 1 : 2), w = 1 + (v / c) ** 2;
      A[i][i] += w; r.push(w * s[i]);
    }
    const D3 = [-1, 3, -3, 1];
    for (let i = 0; i + 3 < n; i++) for (let j = 0; j < 4; j++) for (let k = 0; k < 4; k++) A[i + j][i + k] += lam * D3[j] * D3[k];
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
      const f = A[j][i] / A[i][i];
      for (let k = i; k < n; k++) A[j][k] -= f * A[i][k];
      r[j] -= f * r[i];
    }
    for (let i = n - 1; i >= 0; i--) { let t = r[i]; for (let k = i + 1; k < n; k++) t -= A[i][k] * out[a + k]; out[a + i] = t / A[i][i]; }
  }
  return out;
};
// smoothed geometry (c in table units per frame = ~3 px/frame at the moving edge)
const PW = smooth(PILL_W, 6, [2, 40]), PH = smooth(PILL_H, 6, [2, 40]);   // from 287; 287-288 cut-in, 327 the fly-out
const FW = smooth(FIELD_W, 6, [2]), FH = smooth(FIELD_H, 6, [2]);         // from 287
const RH = smooth(RING_H, 3 / 2.56, [1, 31], [31]);                       // from 295; W = 5.12 H; 326+ (fly-out) as measured

// ------------------------------------------------------------------------------------------------ background (§2, §10.1)
const GX = [15, 240, 480, 720, 960, 1200, 1440, 1680, 1905];
const GY = [15, 180, 360, 540, 720, 900, 1065];
const GRID_RGB = GRIDS.map(([f, rows]) => [f, rows.map((r) => r.map((h) => [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16))))] as [number, number[][][]]);
const BW = 480, BH = 270;
/** cubic (Catmull-Rom) weights of the four knots around index i at fraction t */
const cr = (t: number) => [(-t * t * t + 2 * t * t - t) / 2, (3 * t * t * t - 5 * t * t + 2) / 2, (-3 * t * t * t + 4 * t * t + t) / 2, (t * t * t - t * t) / 2];
const locate = (ks: number[], v: number): [number, number] => {
  if (v <= ks[0]) return [0, 0];
  for (let i = 0; i < ks.length - 1; i++) if (v <= ks[i + 1]) return [i, (v - ks[i]) / (ks[i + 1] - ks[i])];
  return [ks.length - 2, 1];
};
const drawBg = (cv: HTMLCanvasElement, g: number) => {
  const ctx = cv.getContext("2d");
  if (!ctx) return;
  // the grid of this frame: linear in time between the measured grids
  let k = 0;
  while (k < GRID_RGB.length - 2 && g > GRID_RGB[k + 1][0]) k++;
  const [fa, A] = GRID_RGB[k], [fb, B] = GRID_RGB[k + 1];
  const t = clamp01((g - fa) / (fb - fa));
  const grid = A.map((row, j) => row.map((c, i) => c.map((v, ch) => lerp(v, B[j][i][ch], t))));
  const img = ctx.createImageData(BW, BH);
  const cols = Array.from({ length: BW }, (_, x) => { const [i, f] = locate(GX, (x + 0.5) * (1920 / BW)); return { i, w: cr(f) }; });
  for (let y = 0; y < BH; y++) {
    const [j, fy] = locate(GY, (y + 0.5) * (1080 / BH));
    const wy = cr(fy);
    for (let x = 0; x < BW; x++) {
      const { i, w: wx } = cols[x];
      const o = (y * BW + x) * 4;
      for (let ch = 0; ch < 3; ch++) {
        let s = 0;
        for (let a = 0; a < 4; a++) {
          const jj = Math.max(0, Math.min(GY.length - 1, j - 1 + a));
          let r = 0;
          for (let b = 0; b < 4; b++) r += wx[b] * grid[jj][Math.max(0, Math.min(GX.length - 1, i - 1 + b))][ch];
          s += wy[a] * r;
        }
        img.data[o + ch] = s;
      }
      img.data[o + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
};
export const Bg: React.FC<{ g: number }> = ({ g }) => {
  const ref = useRef<HTMLCanvasElement>(null);
  useLayoutEffect(() => { if (ref.current) drawBg(ref.current, g); }, [g]);
  return <canvas ref={ref} width={BW} height={BH} style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080 }} />;
};

// ------------------------------------------------------------------------------- outline intensity masks (conic, measured)
/** the outline points the reference was measured at: top L->R nt, right arc na, bottom R->L nt, left arc na */
const outline = (w: number, h: number, cx: number, cy: number, nt: number, na: number) => {
  const r = h / 2, x0 = cx - w / 2 + r, x1 = cx + w / 2 - r, P: [number, number][] = [];
  for (let i = 0; i < nt; i++) P.push([x0 + ((x1 - x0) * i) / (nt - 1), cy - r]);
  for (let i = 1; i <= na; i++) { const th = -Math.PI / 2 + (Math.PI * i) / (na + 1); P.push([x1 + r * Math.cos(th), cy + r * Math.sin(th)]); }
  for (let i = 0; i < nt; i++) P.push([x1 - ((x1 - x0) * i) / (nt - 1), cy + r]);
  for (let i = 1; i <= na; i++) { const th = Math.PI / 2 + (Math.PI * i) / (na + 1); P.push([x0 + r * Math.cos(th), cy + r * Math.sin(th)]); }
  return P;
};
/** a CSS conic-gradient alpha mask that gives each outline point its alpha */
const conicMask = (pts: [number, number][], alpha: number[], cx: number, cy: number) => {
  const st = pts.map(([x, y], i) => [((Math.atan2(x - cx, -(y - cy)) * 180) / Math.PI + 360) % 360, alpha[i]]).sort((a, b) => a[0] - b[0]);
  const first = st[0], last = st[st.length - 1];
  const span = first[0] + 360 - last[0];
  const a0 = span > 0 ? lerp(last[1], first[1], (360 - last[0]) / span) : first[1];
  const s = [[0, a0], ...st, [360, a0]].map(([d, a]) => `rgba(0,0,0,${clamp01(a).toFixed(3)}) ${d.toFixed(2)}deg`).join(", ");
  return `conic-gradient(from 0deg at ${cx}px ${cy}px, ${s})`;
};
const Masked: React.FC<{ mask: string; style?: React.CSSProperties; children: React.ReactNode }> = ({ mask, style, children }) => (
  <div style={{ position: "absolute", inset: 0, WebkitMaskImage: mask, maskImage: mask, ...style }}>{children}</div>
);
const lerpArr = (A: number[][], a: number, g: number) => {
  const i = Math.max(0, Math.min(A.length - 1, Math.floor(g - a))), j = Math.min(A.length - 1, i + 1), t = clamp01(g - a - i);
  return A[i].map((v, k) => lerp(v, A[j][k], t));
};

// ------------------------------------------------------------------------------------------------ main pill rim (§3.1–3.2)
/** the reference rim's ink mass that our stroke (core + glow) gives at full alpha */
const RIM_GAIN = 520;
const PillRim: React.FC<{ g: number }> = ({ g }) => {
  if (g > 334) return null;
  const w = at(PW, 287, g), h = at(PH, 287, g), cx = 960, cy = 539.5;
  const prof = lerpArr(RIM, 287, Math.min(g, 333));
  const mask = conicMask(outline(w, h, cx, cy, 21, 7), prof.map((m) => m / RIM_GAIN), cx, cy);
  const op = kf(g, [[333, 1], [334, 0.27]]); // the measured masses already hold the 331–333 fade
  const blur = g === 288 ? 3.5 : kf(g, [[330, 0], [331, 1.2], [332, 2], [334, 3]]);
  const d = stadium(cx, cy, w, h);
  return (
    <Masked mask={mask} style={{ opacity: op, filter: blur ? `blur(${blur}px)` : undefined }}>
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        <path d={d} fill="none" stroke={C.blue} strokeOpacity={0.4} strokeWidth={13} style={{ filter: "blur(4px)" }} />
        <path d={d} fill="none" stroke={C.blue} strokeWidth={4.5} />
      </svg>
    </Masked>
  );
};

// ---------------------------------------------------------------------------------------------------- outer ring (§3.6)
const RING_DARK_GAIN = 420, RING_BRIGHT_GAIN = 330;
const ringH = (g: number) => (g <= 331 ? at(RH, 295, g) : kf(g, [[331, 389], [332, 428], [333, 474]]));
const Ring: React.FC<{ g: number }> = ({ g }) => {
  if (g < 295 || g > 333) return null;
  const h = ringH(g), w = 5.12 * h, cx = 960, cy = 540;
  const pts = outline(w, h, cx, cy, 31, 7);
  const pd = lerpArr(RING_D, 295, Math.min(g, 331)), pb = lerpArr(RING_B, 295, Math.min(g, 331));
  const op = kf(g, [[330, 1], [331, 0.8], [332, 0.45], [333, 0.18]]);
  const blur = kf(g, [[295, 2.6], [300, 2.2], [303, 1.2], [306, 0.3], [307, 0], [330, 0], [331, 1], [333, 3]]);
  const d = stadium(cx, cy, w, h);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: op, filter: blur > 0.05 ? `blur(${blur}px)` : undefined }}>
      <Masked mask={conicMask(pts, pd.map((m) => m / RING_DARK_GAIN), cx, cy)}>
        <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          <path d={d} fill="none" stroke={C.blue} strokeOpacity={0.35} strokeWidth={9} style={{ filter: "blur(2.5px)" }} />
          <path d={d} fill="none" stroke={C.blue} strokeWidth={4} />
        </svg>
      </Masked>
      <Masked mask={conicMask(pts, pb.map((m) => m / RING_BRIGHT_GAIN), cx, cy)}>
        <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          <path d={d} fill="none" stroke="#FFFFFF" strokeOpacity={0.5} strokeWidth={9} style={{ filter: "blur(3px)" }} />
          <path d={d} fill="none" stroke="#FFFFFF" strokeWidth={3} />
        </svg>
      </Masked>
    </div>
  );
};

// --------------------------------------------------------------------------------------------------- input field (§3.3)
/** field box (cx, cy, w, h) per frame; 334–336 from the morph table (§4) */
export const fieldBox = (g: number): [number, number, number, number] => {
  if (g <= 333) return [960, kf(g, [[287, 540], [291, 542], [296, 540], [328, 540], [330, 541], [333, 541]]), at(FW, 287, g), at(FH, 287, g)];
  if (g <= 334) return [960, 540, 1296, 130];
  if (g <= 335) return [952.5, 540.5, 1245, 125];
  return [955.5, 543, 1191, 130];
};
export const FIELD_FILL = (k = 1) =>
  `linear-gradient(90deg, rgba(250,252,255,${0.56 * k}) 0%, rgba(250,252,255,${0.46 * k}) 30%, rgba(250,252,255,${0.3 * k}) 70%, rgba(250,252,255,${0.24 * k}) 100%)`;
const Field: React.FC<{ g: number }> = ({ g }) => {
  if (g > 336) return null;
  const [cx, cy, w, h] = fieldBox(g);
  const blur = g === 288 ? 3 : kf(g, [[334, 0], [335, 1.2], [336, 1.5]]);
  // an SVG stadium (sub-pixel exact; a div's box would snap to whole pixels as it shrinks); fill = FIELD_FILL()
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", filter: blur ? `blur(${blur}px)` : undefined }}>
      <defs>
        <linearGradient id="seg3-field-fill" x1="0" x2="1" y1="0" y2="0">
          {[[0, 0.56], [0.3, 0.46], [0.7, 0.3], [1, 0.24]].map(([o, a]) => <stop key={o} offset={o} stopColor="rgb(250,252,255)" stopOpacity={a} />)}
        </linearGradient>
      </defs>
      <rect x={cx - w / 2} y={cy - h / 2} width={w} height={h} rx={h / 2} fill="url(#seg3-field-fill)" />
      <rect x={cx - w / 2 + 0.75} y={cy - h / 2 + 0.75} width={w - 1.5} height={h - 1.5} rx={h / 2 - 0.75} fill="none" stroke="rgba(5,15,25,0.10)" strokeWidth={1.5} />
    </svg>
  );
};

// --------------------------------------------------------------------------------------------- typed line (§3.4, §10.2)
const LINE = "Tell us what needs explaining";
const TYPED = [0, 2, 4, 6, 9, 11, 14, 16, 17, 18, 20, 22, 24, 25, 26, 27, 28, 29]; // chars at 290..307
// left ink edge per frame from 291 (§3.4)
const TX = [381, 361.5, 349.5, 342, 336, 331.5, 327, 325.5, 324, 322.5, 321, 321, 321, 321, 322.5, 324, 325.5, 327, 328.5, 330, 331.5, 333, 333,
  334.5, 336, 336, 337.5, 337.5, 339, 340.5, 340.5, 342, 343.5, 345, 346.5, 348, 351, 354, 357, 360, 364.5, 369, 375, 384, 397.5];
const capScale = (g: number) => kf(g, [[291, 1.11], [292, 1.09], [293, 1.08], [294, 1.07], [295, 1.055], [296, 1.048], [297, 1.044], [298, 1.04],
  [300, 1.032], [303, 1.018], [307, 1], [318, 0.972], [330, 0.945], [333, 0.914], [335, 0.88]]);
// the measured left edge (1.5-px steps) and cap scale, smoothed (c: ~3 px/frame at the edge / at the line's right end)
const TXS = smooth(TX, 3), CAP = smooth(Array.from({ length: 45 }, (_, i) => capScale(291 + i)), 3 / 690);
const PromptLine: React.FC<{ g: number }> = ({ g }) => {
  if (g < 291 || g > 340) return null;
  const n = at(TYPED, 290, g);
  const appear = (i: number) => 290 + TYPED.findIndex((c) => c > i);
  const layer = kf(g, [[291, 0.4], [292, 0.42], [293, 0.5], [294, 0.62], [295, 0.8], [296, 0.9], [297, 0.97], [298, 1]]);
  const exit = kf(g, [[333, 1], [334, 0.84], [335, 0.38], [336, 0.2], [337, 0.07], [338, 0.035], [339, 0.025], [340, 0.015], [340.5, 0]]);
  // 336–340: the faint ghost of the line rides inside the morphing field/card
  const x = g <= 335 ? at(TXS, 291, g) : kf(g, [[336, 412], [337, 492], [338, 484], [339, 505], [340, 520]]), base = kf(g, [[333, 553], [335, 551.5]]);
  // baseline held at 553 through 333 (measured 554.5 -> 553 -> 552): the glyph baseline snaps to whole pixels, so a slow
  // 1-px drift shows as a one-frame jump (329); the line's vertical position stays within 1.5 px of the measurement
  const glyph = (i: number) => Math.min(layer, kf(g - appear(i), [[0, 0.75], [1, 0.9], [2, 0.97], [3, 1]]));
  const blur = kf(g, [[334, 0], [335, 1.2], [336, 1.8], [337, 2.5], [338, 3.5], [340, 4]]);
  return (
    <TypedText text={LINE} n={n} x={x} base={base} size={44.7} scale={at(CAP, 291, g)} weight={600} color={C.ink} opacity={glyph} style={{ opacity: g >= 333 ? exit * 0.95 : 1, filter: blur ? `blur(${blur}px)` : undefined }} />
  );
};

// ---------------------------------------------------------------------------------------------- send button (§3.5, §10.2)
const BD = [10, 36, 53, 65, 74, 78, 79, 79, 79, 78, 76.8, 75.7, 74.5, 74, 74, 74, 72, 69.5, 59.5, 71, 91, 104, 112.5, 117.5, 123.5, 127, 130, 132.5, 134,
  135.5, 135.5, 135.5, 135.5, 135.5, 133.5, 131, 127.5, 121.5, 116, 108, 97, 81.5, 45];
const BX = [1660, 1651, 1641.5, 1635, 1628, 1623, 1617.5, 1613.5, 1609.5, 1606.5, 1603.7, 1600.8, 1598, 1595, 1593, 1591, 1589, 1587.5, 1586.5, 1585.5,
  1586.5, 1589, 1591, 1591, 1591.5, 1591.5, 1590.75, 1590, 1589, 1588, 1585.9, 1583.75, 1581.6, 1579.5, 1574, 1568.5, 1562.5, 1555.5, 1549, 1540, 1531.5, 1519.5, 1502];
const BY = [541, 542, 542, 542, 542, 541.5, 541.5, 541.5, 541.5, 541.5, 541.5, 541.5, 541.5, 541, 541, 541, 541, 541, 541, 540.5, 540.5, 539, 538.5, 538.5,
  539, 537.5, 537.5, 537.5, 537.5, 537.5, 537.5, 537.5, 537.5, 537.5, 537.5, 537.5, 539, 541, 543, 545, 547.5, 550, 552];
const BA = [45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 35, 0, 16, 23, 29, 34, 36, 40, 41, 42.5, 44, 44.5, 45, 45, 45, 45, 45, 44, 41,
  36, 28, 17, 1, -17, -42, -90];
// smoothed (the press at 309-312 and the cut-in are kept as measured)
const BDS = smooth(BD, 6, [16, 20, 34]), BXS = smooth(BX, 3, [18]), BYS = smooth(BY, 3, [18]), BAS = smooth(BA, 6, [17, 19]);
/** the button is drawn at a fixed size N and placed/scaled with a transform (a box of size D would snap to whole pixels) */
const BN = 136;
const SendButton: React.FC<{ g: number }> = ({ g }) => {
  if (g < 293 || g > 335) return null;
  const D = at(BDS, 293, g), x = at(BXS, 293, g), y = at(BYS, 293, g), ang = at(BAS, 293, g), k = D / BN;
  const hov = kf(g, [[311, 0], [312, 0.23], [313, 0.33], [314, 0.49], [315, 0.64], [316, 0.69], [317, 0.82], [318, 0.87], [319, 0.93], [320, 0.97], [321, 1]]);
  const glow = kf(g, [[312, 0], [313, 0.6], [315, 1]]);
  const op = g >= 335 ? 0.4 : 1;
  const L = 0.45 * BN, a = 0.24 * BN, sw = 0.065 * BN;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: BN, height: BN, borderRadius: "50%", opacity: op, transformOrigin: "0 0",
      transform: `translate(${x - D / 2}px, ${y - D / 2}px) scale(${k})`, background: mix(C.blueText, C.blue, hov),
      boxShadow: glow ? `0 0 ${28 / k}px ${2 / k}px rgba(63,140,232,${0.38 * glow})` : undefined, filter: g >= 334 ? `blur(${1 / k}px)` : undefined }}>
      {D > 20 && (
        <svg width={BN} height={BN} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", transform: `rotate(${-ang}deg)` }}>
          <g transform={`translate(${BN / 2} ${BN / 2})`} fill="none" stroke="#FEFDFF" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
            <path d={`M${-L / 2} 0 H${L / 2}`} />
            <path d={`M${L / 2 - a * Math.SQRT1_2} ${-a * Math.SQRT1_2} L${L / 2} 0 L${L / 2 - a * Math.SQRT1_2} ${a * Math.SQRT1_2}`} />
          </g>
        </svg>
      )}
    </div>
  );
};

// ------------------------------------------------------------------------------------------------------------- segment
export const Seg3: React.FC<{ g: number }> = ({ g }) => (
  <AbsoluteFill style={{ overflow: "hidden", background: "#DCE8F6", fontFamily: F.ui }}>
    <Bg g={g} />
    <Ghosts g={g} />
    <Ring g={g} />
    <PillRim g={g} />
    <Field g={g} />
    <Card g={g} />
    <PromptLine g={g} />
    <SendButton g={g} />
    {/* static grain; its strength follows the reference's (stronger on the held shots, softer in the fast moves) */}
    <Grain opacity={kf(g, [[287, 0.4], [293, 0.3], [305, 0.3], [314, 0.45], [326, 0.45], [332, 0.3], [341, 0.3], [359, 0.4], [368, 0.3], [377, 0.22], [386, 0.2]])} seed={5} />
  </AbsoluteFill>
);
