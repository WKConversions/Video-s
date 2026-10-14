// Segment 7 (866-1008): "Detail-driven / design" between two chrome WKC detail stamps (A), a defocused badge passing the
// lens (T1), four rapid lines over the light-streak ring (B-E), then "2 Founders, / 1 Studio" among glass tiles (F,
// in seg7_f.tsx). Frame for frame on the reference (spec/seg7.md); the "3" portal of segment 8 takes over at 1002.
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { bezier, clamp01, keys } from "./lib";
import { Badge, BADGE_RINGS, BW, BH } from "./seg7_badge";
import { Ring } from "./seg7_ring";
import { ShotF } from "./seg7_f";
import { Blur, GlyphLine, NUDGE, WSP, fsCap, glyphs, seqv } from "./seg7_util";

/** the frames this segment draws (it may overlap its neighbours for a transition) */
export const RANGE: [number, number] = [866, 1009];

const BASE = "linear-gradient(180deg, #050F19 0%, #07122A 55%, #0A1630 100%)";
const VIGNETTE = "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.18) 100%)";

// ---------------------------------------------------------------- shot A (866-908)
const RISE = bezier(0, 0.63, 0.44, 0.99);
const base1 = (g: number) => 621.9 + (504.75 - 621.9) * RISE(clamp01((g - 865.8) / 38.2));
// the common ease-in pan left into T1 (title dx, frames 885..908; the measured track smoothed with a spline, so the
// velocity rises without kinks)
const PAN = [0.0, -0.24, -0.52, -0.85, -1.25, -1.74, -2.35, -3.08, -3.97, -5.03, -6.27, -7.73, -9.41, -11.36, -13.7, -16.57, -20.12, -24.48, -29.8, -36.31, -44.56, -55.22, -68.94, -86.37];
const panX = (g: number) => seqv(g, 885, PAN);

// badges: measured centre / rotZ / scale per frame 866..908 (spec T1) with the shot's extra offsets folded in (left badge
// x + 7 and the y / rotZ / scale corrections; right badge y offsets and its nearer-camera scale 1.29), then smoothed with
// a spline (the raw table was whole pixels: +1, 0, +1, 0 ... steps read as shake). Residuals <= 1.2 px, 1.8 px at 867.
const BA: Record<string, number[]> = {
  sx: [299.34, 302.48, 304.71, 306.31, 307.53, 308.5, 309.33, 310.11, 310.85, 311.55, 312.2, 312.8, 313.35, 313.85, 314.29, 314.67, 315.0, 315.26, 315.45, 315.57, 315.63, 315.61, 315.51, 315.32, 315.03, 314.61, 314.06, 313.35, 312.47, 311.41, 310.14, 308.66, 306.95, 304.98, 302.6, 299.69, 296.09, 291.65, 286.16, 279.15, 270.05, 258.32, 243.41],
  sy: [312.31, 377.4, 413.18, 437.37, 457.88, 476.06, 492.18, 506.48, 519.21, 530.63, 540.99, 550.54, 559.48, 567.89, 575.77, 583.16, 590.07, 596.51, 602.53, 608.12, 613.32, 618.15, 622.62, 626.75, 630.56, 634.05, 637.25, 640.17, 642.81, 645.2, 647.35, 649.27, 650.98, 652.49, 653.81, 654.96, 655.95, 656.81, 657.53, 658.13, 658.64, 659.05, 659.4],
  sr: [-8.697, -8.788, -8.812, -8.776, -8.687, -8.551, -8.375, -8.166, -7.929, -7.672, -7.401, -7.122, -6.842, -6.561, -6.279, -5.995, -5.71, -5.424, -5.135, -4.845, -4.553, -4.258, -3.961, -3.658, -3.346, -3.022, -2.683, -2.326, -1.947, -1.543, -1.111, -0.649, -0.151, 0.382, 0.948, 1.541, 2.157, 2.791, 3.437, 4.091, 4.747, 5.401, 6.048],
  ss: [1.0134, 1.0122, 1.011, 1.0098, 1.0086, 1.0075, 1.0064, 1.0054, 1.0044, 1.0036, 1.0029, 1.0023, 1.0019, 1.0015, 1.0013, 1.0012, 1.0011, 1.0011, 1.0011, 1.0011, 1.0012, 1.0012, 1.0012, 1.0011, 1.001, 1.0009, 1.0007, 1.0005, 1.0003, 0.9999, 0.9996, 0.9992, 0.9987, 0.9982, 0.9977, 0.9971, 0.9966, 0.996, 0.9955, 0.995, 0.9946, 0.9943, 0.994],
  hx: [1704.28, 1704.09, 1703.95, 1703.87, 1703.82, 1703.81, 1703.83, 1703.87, 1703.92, 1703.99, 1704.06, 1704.12, 1704.18, 1704.22, 1704.23, 1704.22, 1704.17, 1704.08, 1703.95, 1703.76, 1703.5, 1703.19, 1702.79, 1702.3, 1701.7, 1700.97, 1700.08, 1699.01, 1697.76, 1696.28, 1694.57, 1692.61, 1690.37, 1687.81, 1684.74, 1680.97, 1676.29, 1670.49, 1663.33, 1654.31, 1642.93, 1628.64, 1610.92],
  hy: [1332.73, 1165.13, 1079.25, 1017.04, 966.1, 923.36, 885.63, 851.7, 821.08, 793.38, 768.19, 745.11, 723.79, 704.08, 685.89, 669.1, 653.63, 639.38, 626.23, 614.11, 602.9, 592.51, 582.85, 573.89, 565.59, 557.94, 550.9, 544.46, 538.58, 533.24, 528.41, 524.07, 520.2, 516.76, 513.74, 511.1, 508.82, 506.88, 505.25, 503.9, 502.81, 501.95, 501.3],
  hr: [19.746, 18.913, 18.102, 17.309, 16.536, 15.782, 15.045, 14.325, 13.621, 12.932, 12.258, 11.598, 10.951, 10.317, 9.694, 9.082, 8.48, 7.888, 7.304, 6.728, 6.16, 5.598, 5.042, 4.491, 3.944, 3.402, 2.862, 2.326, 1.792, 1.26, 0.728, 0.197, -0.334, -0.865, -1.398, -1.933, -2.47, -3.011, -3.554, -4.102, -4.655, -5.213, -5.777],
  hs: [1.324, 1.3203, 1.3171, 1.3145, 1.3123, 1.3105, 1.3091, 1.3079, 1.307, 1.3063, 1.3057, 1.3052, 1.3048, 1.3043, 1.3038, 1.3034, 1.3029, 1.3023, 1.3017, 1.301, 1.3002, 1.2994, 1.2984, 1.2973, 1.2961, 1.2948, 1.2934, 1.2919, 1.2903, 1.2886, 1.2869, 1.2851, 1.2832, 1.2813, 1.2794, 1.2774, 1.2753, 1.2732, 1.2711, 1.269, 1.2669, 1.2647, 1.2625],
};
const ba = (k: string, g: number) => seqv(g, 866, BA[k]);

/** a badge in 3D (perspective 1500 px, vanishing point w of the way from the badge to the frame centre), turning about its own centre */
const Placed: React.FC<{ x: number; y: number; rz: number; ry: number; s: number; w: number; children: React.ReactNode; blurY?: number }> = ({ x, y, rz, ry, s, w, children, blurY = 0 }) => {
  const pad = 40;
  return (
    <AbsoluteFill style={{ perspective: "1500px", perspectiveOrigin: `${x + w * (960 - x)}px ${y + w * (540 - y)}px` }}>
      {/* positioned by transform: a fractional left/top on a 3D-transformed (composited) box snaps to whole pixels */}
      <div style={{ position: "absolute", left: -BW / 2 - pad, top: -BH / 2 - pad, width: BW + 2 * pad, height: BH + 2 * pad,
        transform: `translate(${x}px, ${y}px) rotateY(${ry}deg) rotateZ(${rz}deg) scale(${s})`, transformOrigin: "50% 50%", filter: blurY > 0.2 ? `blur(${blurY}px)` : undefined }}>
        {children}
      </div>
    </AbsoluteFill>
  );
};

const TA1 = "Detail-driven", TA2 = "design";
const FA = fsCap(68);

const NeonLines: React.FC<{ g: number; dx: number; dy: number }> = ({ g, dx, dy }) => {
  // bottom-left corner (measured on the reference): a slightly tilted horizontal to (272, 938.7), then down-right; drawn on
  // from the cut (length along the path from x = -40), riding the title's rise
  const s1 = keys(g, [[866, 159], [867, 185], [868, 208], [869, 232], [870, 252], [871, 273], [872, 294], [873, 314], [874, 333], [875, 358], [877, 398], [879, 444], [881, 475], [883, 495], [885, 520], [887, 560]]);
  // top-right corner: from above the frame down to (1605, 107), then right with a slight rise, fading out by x ~1860
  const s2 = keys(g, [[884.6, 0], [885, 41], [886, 60], [887, 82], [888, 106], [889, 124], [890, 139], [891, 157], [892, 174], [893, 199], [894, 215], [895, 238], [896, 254], [898, 285], [900, 338], [903, 395], [906, 430], [908, 450]]);
  const o1 = keys(g, [[866, 0.5], [871, 0.62], [875, 0.7], [885, 0.8], [900, 0.86]]);
  const o2 = keys(g, [[885, 0.6], [890, 0.72], [895, 0.8], [900, 0.88]]);
  const glow = (d: string, len: number, grad: string, k: string, o: number) => (
    <g key={k} opacity={o}>
      <path d={d} fill="none" stroke="#1B4FB8" strokeWidth={16} strokeOpacity={0.5} strokeDasharray={`${len} 4000`} filter="url(#s7a-ng)" />
      <path d={d} fill="none" stroke={`url(#${grad})`} strokeWidth={3.6} strokeDasharray={`${len} 4000`} strokeLinecap="round" />
    </g>
  );
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      <defs>
        <filter id="s7a-ng" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="5" /></filter>
        <linearGradient id="s7a-l1" gradientUnits="userSpaceOnUse" x1={0} y1={0} x2={300} y2={0}>
          <stop offset="0" stopColor="#3F8CE8" stopOpacity={0.5} /><stop offset="0.9" stopColor="#3F8CE8" stopOpacity={1} /><stop offset="1" stopColor="#5A9EF0" stopOpacity={1} />
        </linearGradient>
        <linearGradient id="s7a-l2" gradientUnits="userSpaceOnUse" x1={1500} y1={0} x2={1870} y2={0}>
          <stop offset="0" stopColor="#3F8CE8" stopOpacity={0.85} /><stop offset="0.3" stopColor="#5A9EF0" stopOpacity={1} /><stop offset="0.45" stopColor="#3F8CE8" stopOpacity={0.95} />
          <stop offset="0.73" stopColor="#3F8CE8" stopOpacity={0.5} /><stop offset="1" stopColor="#3F8CE8" stopOpacity={0} />
        </linearGradient>
      </defs>
      {s1 > 0 && <g transform={`translate(${dx} ${dy})`}>{glow("M-40 929.2 L272 938.7 L374 1080 L420 1144", s1, "s7a-l1", "a", o1)}</g>}
      {s2 > 0 && <g transform={`translate(${dx} 0)`}>{glow("M1498 -30 L1605 107 L1760 86 L1900 67", s2, "s7a-l2", "b", o2)}</g>}
    </svg>
  );
};

const ShotA: React.FC<{ g: number }> = ({ g }) => {
  const b1 = base1(g), dy = b1 - 504.75, dx = panX(g);
  const v = Math.abs(base1(g) - base1(g - 1));
  const mb = Math.max(0, 0.45 * (v - 6));
  const m1 = glyphs(TA1, FA), m2 = glyphs(TA2, FA);
  const op = (i: number) => 1 - Math.pow(1 - clamp01((g - 823.4 - 1.74 * i) / 44), 1.36);
  const bl = (i: number) => { const o = op(i); return o < 0.6 ? 2.5 * (1 - o / 0.6) : 0; };
  const k = g - 866;
  const hipY = ba("hy", g);
  return (
    <AbsoluteFill style={{ background: BASE }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 1350px 580px at 954px 1032px, rgba(14,34,68,1) 0%, rgba(14,34,68,0.5) 50%, rgba(14,34,68,0) 100%)" }} />
      <AbsoluteFill style={{ background: VIGNETTE }} />
      <NeonLines g={g} dx={dx} dy={dy} />
      {/* 907: the pass-by's soft leading edge arrives behind the badges as a grey veil */}
      {g >= 907 && g < 908 && <Occluder g={g} />}
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        <defs><Blur id="s7a-mb" sx={0} sy={mb} /></defs>
        <g filter={mb > 0.2 ? "url(#s7a-mb)" : undefined} transform={`translate(${dx} ${dy}) rotate(${NUDGE} 957 563)`}>
          <GlyphLine text={TA1} size={FA} x0={957 - m1.w / 2} y={504.75} idp="s7a1" i0={0} op={op} blur={bl} />
          <GlyphLine text={TA2} size={FA} x0={957 - m2.w / 2} y={621.9} idp="s7a2" i0={TA1.length} op={op} blur={bl} />
        </g>
      </svg>
      <Placed x={ba("sx", g)} y={ba("sy", g)} w={0} rz={ba("sr", g)} ry={10} s={ba("ss", g)} blurY={k < 2 ? 3 - 1.5 * k : 0}>
        <Badge id="s7-soc" band="TYPE" value="-0.05em" foot="KERNED" />
      </Placed>
      {hipY < 1500 && (
        <Placed x={ba("hx", g)} y={hipY} w={0.6} rz={ba("hr", g)} ry={-17} s={ba("hs", g)} blurY={k < 3 ? 4 - 1.4 * k : 0}>
          <Badge id="s7-hip" band="EASE" value=".22 1 .36 1" foot="TUNED" k={0.29} />
        </Placed>
      )}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- T1 (907-912): a giant defocused badge passes the lens
const Occluder: React.FC<{ g: number }> = ({ g }) => {
  if (g < 907 || g > 912.5) return null;
  // centre x of a ~1500 px wide chrome badge (pointed left/right vertices at y 540), decelerating right to left
  const CXK: [number, number][] = [[906, 3200], [907, 2110], [908, 1110], [909, 330], [910, -100], [911, -390], [912, -600], [913, -900]];
  const cx = keys(g, CXK), v = Math.abs(keys(g, CXK) - keys(g - 1, CXK));
  const op = keys(g, [[907, 0.8], [908, 1]]);
  const k = `scale(${1500 / BW} ${1900 / BH})`;
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: op }}>
      <defs>
        <filter id="s7-occ" x="-40%" y="-30%" width="180%" height="160%"><feGaussianBlur stdDeviation={`${44 + 0.035 * v} 44`} /></filter>
        <linearGradient id="s7-occb" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#5A5A5A" /><stop offset="0.5" stopColor="#3E3E3E" /><stop offset="1" stopColor="#2A2A2A" /></linearGradient>
        <radialGradient id="s7-occf" cx="0.5" cy="0.6" r="0.6"><stop offset="0" stopColor="#111111" /><stop offset="0.45" stopColor="#1C1C1C" /><stop offset="0.75" stopColor="#262626" /><stop offset="1" stopColor="#1E1E1E" /></radialGradient>
      </defs>
      <g filter="url(#s7-occ)">
        <g transform={`translate(${cx} 540) ${k}`}>
          <path d={BADGE_RINGS.outer} fill="url(#s7-occb)" />
          <path d={BADGE_RINGS.recess} fill="#181818" />
          <path d={BADGE_RINGS.rim} fill="#353535" />
          <path d={BADGE_RINGS.face} fill="url(#s7-occf)" />
        </g>
      </g>
    </svg>
  );
};

// ---------------------------------------------------------------- shots B-E (909-961)
const EXPO_B = bezier(0.02, 0.22, 0.24, 1);
type Line = { text: string; cap: number; base: number };
const LB: Line = { text: "Detail-driven design", cap: 96, base: 573.75 };
const LC: Line = { text: "Clear messaging", cap: 93, base: 570.75 };
const LD: Line = { text: "Smooth transitions", cap: 90, base: 576 };
const LE: Line = { text: "Every frame intentional", cap: 78, base: 562 };

const bX = (g: number) => 1105.5 + (956.8 - 1105.5) * EXPO_B(clamp01((g - 909) / 23.4));
const cX = (g: number) => seqv(g, 919, [1004.5, 1000, 996, 991, 987, 984, 981, 979, 976, 974, 972, 970, 968]);

/** a line of type centred on cx, baseline y, scaled by s about (sx0, sy0) */
const TextLine: React.FC<{ l: Line; cx: number; dy?: number; s?: number; o?: number; ox?: number; oy?: number; bx?: number; by?: number; id: string; neg?: 0 | 1 | 2 }> = ({ l, cx, dy = 0, s = 1, o = 1, ox, oy, bx = 0, by = 0, id, neg = 0 }) => {
  const fs = fsCap(l.cap), m = glyphs(l.text, fs);
  const x0 = cx - m.w / 2, y = l.base + dy;
  const px = ox ?? cx, py = oy ?? l.base - l.cap / 2;
  const blur = bx > 0.15 || by > 0.15;
  const style = { fontFamily: "Inter Tight", fontWeight: 800, fontSize: fs, letterSpacing: `${-0.05 * fs}px`, wordSpacing: `${WSP * fs}px` } as const;
  return (
    <g transform={`translate(${px} ${py}) scale(${s}) translate(${-px} ${-py})`} opacity={o}>
      <defs>
        {blur && <Blur id={`${id}-b`} sx={bx} sy={by} />}
        {neg > 0 && (
          <linearGradient id={`${id}-ng`} gradientUnits="userSpaceOnUse" x1={0} y1={y - l.cap} x2={0} y2={y + 0.05 * l.cap}>
            <stop offset="0" stopColor={neg === 1 ? "#070C14" : "#050B16"} /><stop offset="1" stopColor={neg === 1 ? "#44505E" : "#050B16"} />
          </linearGradient>
        )}
        {neg > 0 && <Blur id={`${id}-nb`} sx={1.5} />}
        {neg === 1 && <Blur id={`${id}-nh`} sx={6} />}
      </defs>
      <g filter={blur ? `url(#${id}-b)` : undefined}>
        {neg === 0 && <text x={x0} y={y} fill="#FFFFFF" style={style}>{l.text}</text>}
        {neg === 1 && <text x={x0} y={y} fill="none" stroke="#8DC0FF" strokeOpacity={0.35} strokeWidth={7} filter={`url(#${id}-nh)`} style={style}>{l.text}</text>}
        {neg > 0 && <text x={x0} y={y} fill={`url(#${id}-ng)`} style={style}>{l.text}</text>}
        {neg > 0 && <text x={x0} y={y} fill="none" stroke="#8DC0FF" strokeOpacity={0.6} strokeWidth={2.6} filter={`url(#${id}-nb)`} style={style}>{l.text}</text>}
      </g>
    </g>
  );
};

// out-of-focus client stills flying in past the camera during E (948-961)
const BOKEH = [
  { src: "clips/clearscaler-16x9.jpg", k: [[948, 1775, 14, 200, 64], [950, 1622, 104, 150, 52], [953, 1475, 203, 90, 40], [954, 1430, 225, 72, 34], [957, 1330, 270, 60, 28]] },
  { src: "clips/malaga-16x9.jpg", k: [[949, 1908, 972, 220, 90], [950, 1865, 936, 200, 80], [953, 1694, 857, 150, 62], [955, 1592, 818, 120, 50], [961, 1460, 760, 80, 34]] },
  { src: "clips/robin-bos-16x9.jpg", k: [[949, 956, 1044, 150, 64], [950, 956, 990, 136, 58], [953, 953, 881, 92, 38], [957, 950, 840, 70, 30], [961, 948, 820, 60, 26]] },
  { src: "clips/vendom-1x1.jpg", k: [[953, 640, -60, 130, 70], [954, 668, 8, 110, 56], [955, 740, 65, 96, 48], [957, 788, 168, 80, 40], [960, 833, 263, 64, 32], [961, 845, 285, 60, 30]] },
  { src: "clips/creoble-16x9.jpg", k: [[956, -60, 440, 140, 90], [957, 3, 443, 120, 80], [959, 72, 457, 96, 64], [960, 120, 462, 86, 58], [961, 150, 466, 78, 52]] },
  { src: "clips/creoble-lovable-1x1.jpg", k: [[956, 1990, 975, 150, 110], [957, 1905, 965, 130, 96], [958, 1800, 952, 110, 82], [961, 1640, 905, 76, 56]] },
] as { src: string; k: [number, number, number, number, number][] }[];

const Bokeh: React.FC<{ g: number }> = ({ g }) => (
  <>
    {BOKEH.map((b, i) => {
      if (g < b.k[0][0] || g > 961) return null;
      const at = (n: number) => keys(g, b.k.map((r) => [r[0], r[n]] as [number, number]));
      const x = at(1), y = at(2), w = at(3), h = at(4);
      const o = 0.3 * clamp01((g - b.k[0][0] + 1) / 2);
      return (
        <div key={i} style={{ position: "absolute", left: x - w / 2, top: y - h / 2, width: w, height: h, borderRadius: Math.min(w, h) * 0.22, overflow: "hidden", opacity: o, filter: "blur(10px) saturate(0.4) brightness(0.75)" }}>
          <Img src={staticFile(b.src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
      );
    })}
  </>
);

const ShotBE: React.FC<{ g: number }> = ({ g }) => {
  const els: React.ReactNode[] = [];
  // B: slides in from the right behind the pass-by, horizontal smear about half the step
  if (g >= 909 && g <= 917) {
    const x = bX(g), v = Math.abs(bX(g) - bX(g - 1));
    els.push(<TextLine key="b" l={LB} cx={x} id="s7b" bx={v > 1.5 ? v * 0.22 : 0} />);
  }
  if (g === 918) els.push(<TextLine key="bn" l={LB} cx={bX(918) - 6} dy={-7.5} id="s7bn" neg={1} />);
  if (g === 919) els.push(<TextLine key="bg" l={LB} cx={bX(918)} dy={-70} o={0.13} id="s7bg" neg={1} />);
  // C
  if (g >= 919 && g <= 930) {
    const o = keys(g, [[919, 0.52], [920, 0.91], [921, 0.96], [922, 1]]);
    const dy = keys(g, [[919, 24.6], [920, 9.3], [921, 4.2], [922, 1.5], [923, 0]]);
    const s = keys(g, [[919, 0.955], [920, 0.973], [921, 0.989], [922, 0.997], [923, 1]]);
    const bx = keys(g, [[919, 10], [920, 2.2], [921, 0.8], [922, 0]]), by = keys(g, [[919, 6], [920, 1.6], [921, 0.5], [922, 0]]);
    els.push(<TextLine key="c" l={LC} cx={cX(g)} dy={dy} s={s} o={o} bx={bx} by={by} id="s7c" />);
  }
  if (g === 931) {
    [3, 2, 1].forEach((n) => els.push(<TextLine key={`ce${n}`} l={LC} cx={cX(931) - 9 * n} dy={-8} s={0.96} o={0.45 / n} id={`s7ce${n}`} neg={1} />));
    els.push(<TextLine key="cn" l={LC} cx={cX(931)} dy={-8} s={0.96} id="s7cn" neg={1} />);
  }
  if (g === 932) els.push(<TextLine key="cg" l={LC} cx={cX(931)} dy={-60} s={0.73} o={0.13} id="s7cg" neg={1} />);
  // D
  if (g >= 932 && g <= 940) {
    const o = keys(g, [[932, 0.53], [933, 0.95], [934, 1]]);
    const dy = keys(g, [[932, 18.6], [933, 5.9], [934, 1.8], [935, 0.2], [936, 0]]);
    const s = keys(g, [[932, 0.975], [933, 0.992], [934, 0.998], [935, 1], [936, 0.992], [937, 0.984], [938, 0.976], [939, 0.963], [940, 0.955]]);
    const bx = keys(g, [[932, 7], [933, 1.4], [934, 0]]), by = keys(g, [[932, 4.5], [933, 1], [934, 0]]);
    els.push(<TextLine key="d" l={LD} cx={958} dy={dy} s={s} o={o} bx={bx} by={by} id="s7d" />);
  }
  if (g === 941) els.push(<TextLine key="dn" l={LD} cx={958} s={0.955 * 0.98} id="s7dn" neg={2} />);
  if (g === 942) els.push(<TextLine key="dg" l={LD} cx={958} s={0.955 * 0.77} o={0.13} id="s7dg" neg={2} />);
  // E: rise, then the pull-back (scale about (969, 533), fading and defocusing)
  if (g >= 942 && g <= 961) {
    const dy = keys(g, [[942, 69], [943, 53], [944, 40], [945, 31], [946, 24], [947, 18.5], [948, 14], [949, 10.4], [950, 7.5], [951, 5.1], [952, 3.5], [953, 2.3], [954, 1.4], [955, 0.6], [956, 0]]);
    const s = keys(g, [[942, 0.94], [943, 0.962], [944, 0.986], [945, 0.997], [946, 1], [947, 1], [948, 0.997], [949, 0.993], [950, 0.984], [951, 0.976], [952, 0.965], [953, 0.952], [954, 0.938], [955, 0.922], [956, 0.905], [957, 0.886], [958, 0.863], [959, 0.831], [960, 0.794], [961, 0.737]]);
    const o = keys(g, [[942, 0.24], [943, 0.97], [944, 1], [953, 0.98], [954, 0.95], [956, 0.9], [958, 0.87], [960, 0.85], [961, 0.74]]);
    const def = keys(g, [[953, 0], [956, 0.6], [959, 1.4], [961, 2.5]]);
    const bx = keys(g, [[942, 6], [943, 2], [944, 0.8], [945, 0]]) + def, by = keys(g, [[942, 5], [943, 1.6], [944, 0.6], [945, 0]]) + def;
    els.push(<TextLine key="e" l={LE} cx={969} dy={dy} s={s} o={o} ox={969} oy={533} bx={bx} by={by} id="s7e" />);
  }
  return (
    <AbsoluteFill style={{ background: BASE }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 1230px 1170px at 945px 540px, rgba(11,42,87,1) 0%, rgba(11,42,87,0.5) 33%, rgba(11,42,87,0.12) 66%, rgba(11,42,87,0) 100%)" }} />
      <AbsoluteFill style={{ background: VIGNETTE }} />
      <Ring g={g} />
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>{els}</svg>
      <Bokeh g={g} />
    </AbsoluteFill>
  );
};

export const Seg7: React.FC<{ g: number }> = ({ g }) => {
  if (g < 866) return null;
  if (g >= 962) return <ShotF g={g} />;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {g <= 908 ? <ShotA g={g} /> : <ShotBE g={g} />}
      {g >= 908 && <Occluder g={g} />}
    </AbsoluteFill>
  );
};
