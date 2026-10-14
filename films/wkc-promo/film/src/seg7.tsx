// Segment 7 (866-1008): "Detail-driven / design" between two chrome WKC detail stamps (A), a defocused badge passing the
// lens (T1), four rapid lines over the light-streak ring (B-E), then "2 Founders, / 1 Studio" among glass tiles (F,
// in seg7_f.tsx). Frame for frame on the reference (spec/seg7.md); the "3" portal of segment 8 takes over at 1002.
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { bezier, clamp01, keys } from "./lib";
import { Badge, BADGE_RINGS, BW, BH } from "./seg7_badge";
import { Ring } from "./seg7_ring";
import { ShotF } from "./seg7_f";
import { Blur, GlyphLine, WSP, fsCap, glyphs, seqv } from "./seg7_util";

/** the frames this segment draws (it may overlap its neighbours for a transition) */
export const RANGE: [number, number] = [866, 1009];

const BASE = "linear-gradient(180deg, #050F19 0%, #07122A 55%, #0A1630 100%)";
const VIGNETTE = "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.18) 100%)";

// ---------------------------------------------------------------- shot A (866-908)
const RISE = bezier(0, 0.63, 0.44, 0.99);
const base1 = (g: number) => 621.9 + (504.75 - 621.9) * RISE(clamp01((g - 865.8) / 38.2));
// the common ease-in pan left into T1 (title dx, frames 885..908)
const PAN = [0, -0.3, -0.6, -0.9, -1.3, -1.8, -2.4, -3.2, -3.9, -5.1, -6.3, -7.6, -9.4, -11.3, -13.9, -16.9, -20.2, -24.4, -29.9, -36.5, -44.4, -55.0, -69.1, -86.5];
const panX = (g: number) => seqv(g, 885, PAN);

// badges: measured centre / rotZ / scale per frame (spec T1)
const SOC_X = [292, 296, 298, 299, 300, 302, 302, 303, 304, 305, 305, 306, 306, 307, 307, 308, 308, 308, 308, 309, 309, 309, 308, 308, 308, 308, 307, 306, 306, 304, 303, 302, 300, 298, 296, 292, 289, 285, 279, 272, 263, 252, 236];
const SOC_Y = [322, 388, 421, 446, 466, 484, 500, 513, 526, 537, 547, 557, 565, 573, 581, 588, 594, 600, 605, 610, 615, 620, 624, 628, 631, 634, 637, 640, 643, 645, 647, 649, 651, 652, 654, 655, 656, 657, 658, 658, 659, 659, 659];
const SOC_RZ = [-8.5, -8.8, -9.0, -8.9, -8.8, -8.5, -8.3, -8.1, -7.9, -7.6, -7.4, -7.0, -6.9, -6.6, -6.3, -6.1, -5.8, -5.4, -5.1, -4.9, -4.5];
const SOC_S = [0.993, 0.994, 0.994, 0.995, 0.996, 0.996, 0.996, 0.998, 0.998, 0.998, 0.998, 0.998, 0.999, 1.0, 0.999, 1.0, 1.0, 1.001, 1.002, 1.002, 1.002, 1.001, 1.001, 1.001, 1.002, 1.002, 1.002, 0.999, 1.0, 1.0, 1.0, 0.999, 0.999, 0.997, 0.998, 0.998, 0.996, 0.995, 0.996, 0.994, 0.995, 0.995, 0.994];
const HIP_X = [1704, 1704, 1704, 1704, 1704, 1704, 1704, 1704, 1704, 1704, 1704, 1704, 1704, 1704, 1704, 1704, 1704, 1704, 1704, 1704, 1704, 1703, 1703, 1702, 1702, 1701, 1700, 1699, 1698, 1696, 1695, 1693, 1690, 1688, 1684, 1681, 1676, 1670, 1663, 1655, 1644, 1629, 1610];
const HIP_Y = [1300, 1147, 1073, 1011, 961, 919, 882, 848, 818, 791, 766, 744, 723, 703, 685, 669, 653, 639, 625, 613, 601, 590, 580, 571, 562, 554, 547, 540, 534, 528, 523, 518, 514, 510, 506, 503, 500, 498, 496, 494, 493, 492, 491];
const HIP_RZ = [20, 19, 18, 17.3, 16.4, 15.7, 15.0, 14.2, 13.5, 12.8, 12.3, 11.6, 11.0, 10.4, 9.7, 9.1, 8.5, 8.0, 7.4, 6.9, 6.2, 5.6, 5.1, 4.5, 3.9, 3.4, 2.8, 2.3, 1.8, 1.2, 0.7, 0.2, -0.4, -0.9, -1.5, -2.0, -2.5, -3.0, -3.5, -4.0, -4.6, -5.2, -5.8];
const HIP_K = 1.29; // the right badge is nearer the camera

const socRz = (g: number) => (g <= 886 ? seqv(g, 866, SOC_RZ) : -4.5 + 0.305 * (g - 886));
const hipS = (g: number) => keys(g, [[866, 1.03], [869, 1.015], [880, 1.012], [895, 1.0], [907, 0.98]]);

/** a badge in 3D (perspective 1500 px, vanishing point w of the way from the badge to the frame centre), turning about its own centre */
const Placed: React.FC<{ x: number; y: number; rz: number; ry: number; s: number; w: number; children: React.ReactNode; blurY?: number }> = ({ x, y, rz, ry, s, w, children, blurY = 0 }) => {
  const pad = 40;
  return (
    <AbsoluteFill style={{ perspective: "1500px", perspectiveOrigin: `${x + w * (960 - x)}px ${y + w * (540 - y)}px` }}>
      <div style={{ position: "absolute", left: x - BW / 2 - pad, top: y - BH / 2 - pad, width: BW + 2 * pad, height: BH + 2 * pad,
        transform: `rotateZ(${rz}deg) rotateY(${ry}deg) scale(${s})`, transformOrigin: "50% 50%", filter: blurY > 0.2 ? `blur(${blurY}px)` : undefined }}>
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
  const hipY = seqv(g, 866, HIP_Y);
  return (
    <AbsoluteFill style={{ background: BASE }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 1350px 580px at 954px 1032px, rgba(14,34,68,1) 0%, rgba(14,34,68,0.5) 50%, rgba(14,34,68,0) 100%)" }} />
      <AbsoluteFill style={{ background: VIGNETTE }} />
      <NeonLines g={g} dx={dx} dy={dy} />
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        <defs><Blur id="s7a-mb" sx={0} sy={mb} /></defs>
        <g filter={mb > 0.2 ? "url(#s7a-mb)" : undefined} transform={`translate(${dx} ${dy})`}>
          <GlyphLine text={TA1} size={FA} x0={957 - m1.w / 2} y={504.75} idp="s7a1" i0={0} op={op} blur={bl} />
          <GlyphLine text={TA2} size={FA} x0={957 - m2.w / 2} y={621.9} idp="s7a2" i0={TA1.length} op={op} blur={bl} />
        </g>
      </svg>
      <Placed x={seqv(g, 866, SOC_X) + 7} y={seqv(g, 866, SOC_Y)} w={0} rz={socRz(g)} ry={10} s={seqv(g, 866, SOC_S)} blurY={k < 2 ? 3 - 1.5 * k : 0}>
        <Badge id="s7-soc" band="TYPE" value="-0.05em" foot="KERNED" />
      </Placed>
      {hipY < 1500 && (
        <Placed x={seqv(g, 866, HIP_X)} y={hipY + keys(g, [[870, 5], [880, 0], [895, 5], [905, 10]])} w={0.6} rz={seqv(g, 866, HIP_RZ)} ry={-17} s={HIP_K * hipS(g)} blurY={k < 3 ? 4 - 1.4 * k : 0}>
          <Badge id="s7-hip" band="EASE" value=".22 1 .36 1" foot="TUNED" />
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
  const op = keys(g, [[907, 0.62], [908, 1]]);
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
      const o = 0.42 * clamp01((g - b.k[0][0] + 1) / 2);
      return (
        <div key={i} style={{ position: "absolute", left: x - w / 2, top: y - h / 2, width: w, height: h, borderRadius: Math.min(w, h) * 0.22, overflow: "hidden", opacity: o, filter: "blur(10px) saturate(0.4)" }}>
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
      <Occluder g={g} />
    </AbsoluteFill>
  );
};
