// Segment 6 (718-865), measured from the reference (spec/seg6.md), in WKC's script and blues:
//  A 718-767 "Made for every platform" / "From websites to social ads": 11 glass platform tiles around two glowing rings,
//    zoom-out settle with radial blur + RGB split after the hard cut, two tiles spin, expo-in zoom dip into 768.
//  B 768-818 "Publish anywhere" / "Every format": OFF toggle, three format cards (16:9, 1:1, 9:16) whose selection hops.
//  C 819-865 "Multiple versions" / "One project": ON toggle, the project card with three version bars, stretched upward exit.
import React from "react";
import { AbsoluteFill } from "remotion";
import { F, clamp01, lerp } from "./lib";
import { tw } from "./kit";
import {
  Composite, Glass, Glyph, HEAD_GLOW, RIM_BIG, RIM_CARD, RIM_TILE, Ring, Smear, Txt, kl, mix, rgbShift, rgbSplit, spline, tab, textBox,
} from "./seg6_parts";

/** the frames this segment draws (hard cut in at 717|718, hard cut out at 865|866) */
export const RANGE: [number, number] = [718, 866];

const easeIn = (t: number) => t * t * t;
const TRK = -0.05; // headline tracking (em)
const WS = 0.07; // extra word spacing (em) so the tight headlines keep readable word gaps

// =====================================================================================================================
// SHOT A (718-767)
// =====================================================================================================================
const A_HEAD_S = [1.205, 1.165, 1.132, 1.111, 1.096, 1.083, 1.071, 1.061, 1.052, 1.044, 1.036, 1.029, 1.023, 1.017, 1.012, 1.008, 1.005, 1.002, 1.0];
const A_SUB_S = [1.2700, 1.2150, 1.1783, 1.1562, 1.1424, 1.1323, 1.1230, 1.1133, 1.1031, 1.0929, 1.0833, 1.0747, 1.0672, 1.0608, 1.0550, 1.0497, 1.0447, 1.0399, 1.0355, 1.0315, 1.0279, 1.0248, 1.0222, 1.0199, 1.0180, 1.0162, 1.0147, 1.0132, 1.0117, 1.0102, 1.0088, 1.0074, 1.0060, 1.0046, 1.0033, 1.0021, 1.0010, 1.0000];
const A_TILE_S = [1.32100, 1.28316, 1.24961, 1.22003, 1.19399, 1.17101, 1.15061, 1.13237, 1.11602, 1.10144, 1.08865, 1.07765, 1.06838, 1.06061, 1.05407, 1.04847, 1.04357, 1.03920, 1.03528, 1.03176, 1.02859, 1.02571, 1.02307, 1.02060, 1.01826, 1.01605, 1.01395, 1.01196, 1.01008, 1.00830, 1.00663, 1.00505, 1.00359, 1.00230, 1.00125, 1.00051, 1.00011, 1.00008, 1.00051, 1.00160, 1.00380, 1.00790, 1.01610, 1.02820, 1.04620, 1.07150, 1.10480, 1.16000, 1.25000, 1.40000, 1.62000];
const A_TILE_R = [2.2091, 2.1019, 1.9988, 1.8998, 1.8048, 1.7137, 1.6265, 1.5424, 1.4600, 1.3776, 1.2937, 1.2081, 1.1220, 1.0381, 0.9591, 0.8866, 0.8208, 0.7612, 0.7063, 0.6547, 0.6051, 0.5563, 0.5079, 0.4604, 0.4148, 0.3719, 0.3323, 0.2957, 0.2616, 0.2295, 0.1987, 0.1689, 0.1399, 0.1114, 0.0836, 0.0562, 0.0289, 0.0015];
const A_RING_IN = [885.0, 716.1, 655.6, 614.3, 582.0, 556.2, 535.9, 519.4, 505.5, 493.4, 482.5, 472.8, 464.3, 456.9, 450.3, 444.5, 439.3, 434.7, 430.5, 426.6, 423.1, 419.9, 417.0, 414.3, 412.0, 409.9, 407.9, 405.9, 404.2, 402.7, 401.5, 400.6, 400.1, 400.0, 400.2, 400.7, 401.5, 402.6, 404.0, 405.9, 408.3, 411.6, 416.1, 422.4, 431.4, 444.0, 460.5, 484.1, 514.8, 558.9, 620.0];
const A_RING_OUT = [1654.9, 1340.7, 1229.1, 1153.1, 1093.9, 1046.7, 1009.6, 980.1, 956.1, 936.1, 918.9, 903.9, 890.6, 878.6, 867.7, 857.9, 849.2, 841.4, 834.3, 828.1, 822.5, 817.5, 812.7, 808.2, 804.0, 800.2, 796.8, 793.7, 791.2, 789.3, 788.1, 787.7, 788.0, 789.1, 791.1, 794.0, 798.0, 803.0, 809.1, 816.5, 825.7, 837.1, 851.7, 871.0, 896.7, 931.9, 980.0, 1056.1, 1157.2, 1293.7, 1473.5];

type Tile = { b: [number, number, number, number]; glyph?: string; label?: string; rot?: number; spin?: "T2" | "T9"; gh?: number; stack?: boolean; target?: number };
const TILES: Tile[] = [
  { b: [435, 125.5, 644, 245], glyph: "browser", label: "Website" },
  { b: [1371, 132, 1512, 252], glyph: "infinity", gh: 56, spin: "T2" },
  { b: [1642.5, 133, 1851, 234], glyph: "in", label: "LinkedIn" },
  { b: [90.5, 384.3, 222, 512], glyph: "play", gh: 53 },
  { b: [312.3, 513.7, 519, 614], glyph: "camera", label: "Instagram", rot: 2 },
  { b: [1637, 402, 1846, 520], glyph: "note", label: "TikTok" },
  { b: [1465.7, 587, 1596, 700], glyph: "x", gh: 52, rot: -2 },
  { b: [94, 758, 303, 856], glyph: "megaphone", label: "Google Ads" },
  { b: [449, 854, 580, 990], glyph: "bag", gh: 66, spin: "T9" },
  { b: [1223.3, 883.3, 1450, 986], glyph: "w", label: "Webflow", target: 165 },
  { b: [1627.3, 801.3, 1797, 929], label: "Vimeo", stack: true },
];
const INK = "#F3F7FC";
const T9_SPIN: [number, number][] = [-0.00, 1.50, 3.60, 6.15, 9.12, 12.59, 16.72, 21.75, 28.01, 35.76, 44.97, 55.50, 67.91, 82.62, 102.23, 129.57, 162.12, 197.83, 231.73, 258.64, 280.00, 296.80, 310.01, 320.56, 329.08, 335.95, 341.48, 345.99, 349.89, 353.38, 356.30, 358.41, 359.63, 360.00].map((v, i): [number, number] => [728 + i, v]);
const T2_SPIN: [number, number][] = [[752, 0], [753, -1], [754, -5], [755, -13], [756, -30], [757, -57], [758, -97], [759, -151], [760, -200], [761, -239], [762, -268],
  [763, -287], [764, -303], [765, -317], [766, -329], [767, -339], [768, -347]];

/** a wide tile's content: glyph + Inter 600 wordmark, about 67 % of the tile width */
const Wordmark: React.FC<{ glyph: string; label: string; target: number }> = ({ glyph, label, target }) => {
  const ar = { browser: 1.25, in: 1, camera: 1.15, note: 0.85, megaphone: 1.15, w: 1.3 }[glyph] ?? 1;
  const unit = tw(label, 100, 600, F.ui, -0.01) / 100; // text width per px of font size
  const size = Math.min(34, target / (0.92 * ar + 0.3 + unit));
  return (
    <div style={{ display: "flex", alignItems: "center", gap: size * 0.3 }}>
      <Glyph k={glyph} h={size * 0.92} color={INK} />
      <div style={{ fontFamily: F.ui, fontWeight: 600, fontSize: size, lineHeight: `${size}px`, letterSpacing: -0.01 * size, color: INK, whiteSpace: "nowrap" }}>{label}</div>
    </div>
  );
};
const StackMark: React.FC<{ label: string }> = ({ label }) => {
  const size = 102 / (tw(label, 100, 600, F.ui, -0.02) / 100);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 9, marginTop: 4 }}>
      <div style={{ fontFamily: F.ui, fontWeight: 600, fontSize: size, lineHeight: `${size * 0.8}px`, letterSpacing: -0.02 * size, color: INK }}>{label}</div>
      <svg width={102} height={12} viewBox="0 0 102 12" style={{ display: "block", overflow: "visible" }}>
        <path d="M3 6 H99" stroke={INK} strokeOpacity={0.35} strokeWidth={4} strokeLinecap="round" />
        <path d="M3 6 H64" stroke={INK} strokeWidth={4} strokeLinecap="round" />
        <circle cx={66} cy={6} r={6} fill={INK} />
      </svg>
    </div>
  );
};

const SceneA: React.FC<{ t: number; zoom: number; zoomT: number }> = ({ t, zoom, zoomT }) => {
  const sTile = tab(t, 718, A_TILE_S, true) * (1 - 0.009 * Math.pow(2, -(t - 722) / 3)), rTile = tab(t, 718, A_TILE_R, true);
  const sHead = tab(t, 718, A_HEAD_S, true) * kl(t, [[758, 1], [759, 1.005], [760, 1.01], [761, 1.025], [762, 1.035], [763, 1.055], [764, 1.09], [765, 1.13], [766, 1.17], [767, 1.21], [768, 1.26]]);
  const sSub = tab(t, 718, A_SUB_S, true) * kl(t, [[760, 1], [761, 1.01], [762, 1.02], [763, 1.035], [764, 1.06], [765, 1.095], [766, 1.15], [767, 1.23], [768, 1.33]]);
  const aHead = kl(t, [[760, 1], [761, 0.94], [762, 0.82], [763, 0.66], [764, 0.47], [765, 0.31], [766, 0.19], [767, 0.09], [768, 0.02]]);
  const aSub = kl(t, [[761, 1], [762, 0.88], [763, 0.73], [764, 0.47], [765, 0.29], [766, 0.16], [767, 0.07], [768, 0.02]]);
  const aTile = kl(t, [[762, 1], [763, 0.97], [764, 0.89], [765, 0.8], [766, 0.65], [767, 0.45], [768, 0.2]]);
  const rIn = tab(t, 718, A_RING_IN, true);
  const rOut = tab(t, 718, A_RING_OUT, true);
  const a1 = 132 - 1.86 * (t - 750), aA = 141 + 0.65 * (t - 740);
  const dark = 0.3 * easeIn(clamp01((t - 759) / 8));
  // headline wipe: the reference's ramp re-expressed against our right edge (same speed, same width)
  const head = "Made for every platform", sub = "From websites to social ads";
  const hb = textBox(head, 85, 800, F.head, TRK, WS);
  const front = 1185 + 30 * (t - 719) + (958 + hb.vis / 2 - 1326), W = Math.min(960, 735 + 9 * (t - 719));
  // measured: early on the reference's tile layer and rings sit (-8, +15.5) px off their settled model, decaying with an 8-frame half-life
  const off = Math.pow(2, -(t - 722) / 8), ox = -8 * off, oy = 15.5 * off;
  const layer = (s: number, rot = 0, z = zoom, dx = 0, dy = 0): React.CSSProperties => ({ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "960px 540px", transform: `translate(${dx}px, ${dy}px) rotate(${rot}deg) scale(${s * z})` });
  return (
    <AbsoluteFill>
      <div style={layer(1, 0, 1, ox, oy)}>
        <Ring r={rIn * zoomT} arcs={[{ a: a1, peak: 1 }, { a: a1 + 150, peak: 1 }]} />
        <Ring r={rOut * zoomT} arcs={[{ a: aA, peak: 1 }, { a: aA + 179, peak: 0.38 }]} />
      </div>
      {dark > 0 && <div style={{ position: "absolute", inset: -300, background: "#000", opacity: dark }} />}
      <div style={{ ...layer(sTile, rTile, zoomT, ox, oy), opacity: aTile }}>
        {TILES.map((d, i) => {
          const [x0, y0, x1, y1] = d.b, w = x1 - x0, h = y1 - y0;
          const spin = d.spin === "T9" ? spline(t, T9_SPIN) : d.spin === "T2" ? spline(t, T2_SPIN) : 0;
          return (
            <Glass key={i} id={`t${i}`} w={w} h={h} r={20} fill="rgba(16,28,44,0.9)" rim={RIM_TILE}
              style={{ left: x0, top: y0, transform: `rotate(${(d.rot ?? 0) + spin}deg)` }}>
              {d.stack ? <StackMark label={d.label!} /> : d.label ? <Wordmark glyph={d.glyph!} label={d.label} target={d.target ?? 146} /> : <Glyph k={d.glyph!} h={d.gh!} color={INK} />}
            </Glass>
          );
        })}
      </div>
      <div style={layer(sHead)}>
        <Txt text={head} size={85} weight={800} family={F.head} track={TRK} ws={WS} cx={958} base={540} shadow={HEAD_GLOW} wipe={{ front, W }} opacity={aHead} />
      </div>
      <div style={layer(sSub)}>
        <Txt text={sub} size={41} weight={500} family={F.ui} cx={958} base={630} color="#FEFEFF" opacity={aSub} />
      </div>
    </AbsoluteFill>
  );
};

// blur samples per frame (0.5-frame shutter), extra zoom-blur spread and RGB split (R-B scale difference) after the cut / before the dip
// (the reference's spinning tiles stay crisp: no extra spin blur; samples only where the zoom moves fast)
const A_N: Record<number, number> = { 718: 20, 719: 14, 720: 12, 721: 10, 722: 8, 723: 6, 724: 4, 725: 3, 726: 2, 762: 3, 763: 5, 764: 8, 765: 10, 766: 14, 767: 18 };
const BG_A = <div style={{ position: "absolute", inset: -300, background: "radial-gradient(ellipse 1100px 700px at 50% 50%, #0A1424 0%, #08111E 70%, #07101C 100%)" }} />;
const ShotA: React.FC<{ g: number }> = ({ g }) => {
  const n = A_N[g] ?? 1;
  // the reference's settle is blurred harder than a 180-degree shutter: an extra radial spread (tiles/rings zT, text zX)
  const zT = kl(g, [[718, 0.14], [719, 0.07], [720, 0.05], [721, 0.035], [722, 0.025], [723, 0.015], [724, 0.008], [725, 0.004], [726, 0]]);
  const zX = kl(g, [[718, 0.12], [719, 0.02], [720, 0.012], [721, 0.01], [722, 0.008], [723, 0.004], [724, 0.002], [725, 0]]);
  const ca = kl(g, [[718, 0.038], [719, 0.009], [720, 0.006], [721, 0.003], [722, 0.0015], [723, 0], [764, 0], [765, 0.0025], [766, 0.004], [767, 0.006]]);
  return <Composite n={n} bg={BG_A} chans={ca > 0.0005 ? rgbSplit(ca) : undefined} fg={(u) => <SceneA t={g + 0.5 * u} zoom={1 + zX * u} zoomT={1 + zT * u} />} />;
};

// =====================================================================================================================
// SHOT B (768-818)
// =====================================================================================================================
// camera roll (deg): the measured keys 1 | 0.5 @784-788 | 0 @790-801 | -0.4 @804 | -0.8 @807 rolled in 0.5-degree steps over two frames
// (a 2 px/frame jolt at the outer cards the reference does not have); Whittaker-smoothed through them (max 0.2 deg off)
const B_ROLL = [1.000, 1.003, 1.008, 1.017, 1.029, 1.043, 1.057, 1.070, 1.079, 1.080, 1.071, 1.047, 1.007, 0.950, 0.876, 0.790, 0.694, 0.595, 0.494, 0.394, 0.296, 0.203, 0.121, 0.055, 0.010, -0.015, -0.021, -0.013, 0.001, 0.015, 0.018, 0.006, -0.029, -0.090, -0.174, -0.278, -0.393, -0.510, -0.618, -0.711, -0.782, -0.831, -0.860, -0.871, -0.869, -0.860, -0.846, -0.832, -0.819, -0.808, -0.800];
const camB = (t: number) => {
  const d = t - 795;
  const s = 0.99909 + 0.00523 * d + 0.00008 * Math.max(0, t - 805) ** 2 - 0.14939 * Math.pow(2, -(t - 768) / 3.2534);
  const ty = 0.101 + 1.1469 * d + 0.0854 * Math.max(0, t - 800) ** 2 + 9.2776 * Math.pow(2, -(t - 768) / 1.4678);
  const roll = tab(t, 768, B_ROLL);
  return { s, ty, roll };
};
const poly = (c: number[], d: number) => c[0] + d * (c[1] + d * (c[2] + d * c[3]));
type CardDef = { label: string; fw: number; fh: number; H: number; dy: number; cs: number; early: number; late: [number, number][]; x: number[]; y: number[]; k: number[]; sel: [number, number][]; w: [number, number][] };
const CARDS: CardDef[] = [
  { label: "16:9", fw: 118, fh: 66, H: 330, dy: 0, cs: 1, early: 0, late: [[806, 0], [811, -6]], x: [481.157, 0.675375, -0.00771006, -0.000381291], y: [727.224, -2.09693, 0.030467, 0.00046481], k: [1.00371, -0.00296101, 2.05411e-5, -1.31496e-6],
    sel: [[798, 0], [799, 0.2], [800, 0.5], [801, 0.72], [802, 0.88], [803, 1], [814, 1], [815, 0.75], [816, 0.4], [817, 0.35], [818, 0.35]],
    w: [[799, 0], [800, 0.03], [801, 0.3], [802, 0.59], [803, 0.87], [804, 1], [814, 1], [815, 0.88], [816, 0.6], [817, 0.3], [818, 0.01]] },
  { label: "1:1", fw: 70, fh: 70, H: 373, dy: 2.3, cs: 0.89, early: 0, late: [[806, 0], [812, -3]], x: [962.053, -0.125613, -0.00371732, 0.000139697], y: [729.978, -1.03148, 0.0127139, -3.85923e-7], k: [0.879672, -0.000717171, 5.92128e-6, 5.86004e-7],
    sel: [[781, 1], [782, 0.53], [783, 0.07], [784, 0]],
    w: [[780, 1], [781, 0.86], [782, 0.58], [783, 0.23], [784, 0]] },
  { label: "9:16", fw: 44, fh: 78, H: 352, dy: 15, cs: 1, early: 0.1, late: [[800, 0]], x: [1404.91, 0.499562, 0.013619, 0.000185246], y: [709.853, -0.324879, 0.0296261, -0.000522908], k: [0.900998, 0.000344405, 5.54421e-5, -2.62475e-8],
    sel: [[781, 0], [782, 0.46], [783, 0.65], [784, 0.82], [785, 0.9], [786, 1], [797, 1], [798, 0.75], [799, 0.35], [800, 0]],
    w: [[781, 0.02], [782, 0.2], [783, 0.42], [784, 0.64], [785, 0.86], [786, 0.99], [787, 1], [798, 1], [799, 0.71], [800, 0.42], [801, 0.14], [802, 0]] },
];
/** a linear-key drift eased with smootherstep between consecutive keys (same values at the keys, no velocity steps) */
const late = (t: number, k: [number, number][]) => {
  if (t <= k[0][0]) return k[0][1];
  for (let i = 1; i < k.length; i++) if (t <= k[i][0]) {
    const x = (t - k[i - 1][0]) / (k[i][0] - k[i - 1][0]);
    return lerp(k[i - 1][1], k[i][1], x * x * x * (x * (6 * x - 15) + 10));
  }
  return k[k.length - 1][1];
};
const FormatCard: React.FC<{ c: CardDef; t: number; i: number }> = ({ c, t, i }) => {
  // the frame (per-card measured height and offset) and the content (logo at -70, button at +70) scale about their own centres
  const d = t - 795, w = kl(t, c.w), K = poly(c.k, d) * (1 + 0.2 * kl(t, c.sel)) * (1 - c.early * Math.pow(2, -(t - 769) / 5));
  const cx = poly(c.x, d), cy = poly(c.y, d) + late(t, c.late), Kc = K * c.cs;
  const logo = mix("#5C6573", "#FFFFFF", w);
  return (
    <>
      <Glass id={`c${i}`} w={444} h={c.H} r={18} fill={mix("#0E1828", "#132138", w, 0.85)} rim={RIM_CARD} k={lerp(0.2, 1, w)} lw={2.8}
        soft={{ dy: 12, s: 15, a: 0.45 }} style={{ left: 0, top: 0, transform: `translate(${cx - 222}px, ${cy + c.dy * K - c.H / 2}px) scale(${K})` }} />
      <div style={{ position: "absolute", left: 0, top: 0, width: 444, height: 120, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", transform: `translate(${cx - 222}px, ${cy - 70 * K - 60}px) scale(${Kc})` }}>
        <div style={{ width: c.fw, height: c.fh, border: `4px solid ${logo}`, borderRadius: 9, boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width={14} height={16} viewBox="0 0 14 16" style={{ display: "block", marginLeft: 3 }}><path d="M1.5 1.5 L12.5 8 L1.5 14.5 Z" fill={logo} stroke={logo} strokeWidth={2} strokeLinejoin="round" /></svg>
        </div>
        <div style={{ marginTop: 9, fontFamily: F.ui, fontWeight: 600, fontSize: 24, lineHeight: "24px", color: logo, letterSpacing: -0.2 }}>{c.label}</div>
      </div>
      <div style={{
        position: "absolute", left: 0, top: 0, width: 214, height: 90, borderRadius: 45, background: mix("#12284D", "#3F8CE8", w), transform: `translate(${cx - 107}px, ${cy + 70 * K - 45}px) scale(${Kc})`,
        boxShadow: `0 0 9px rgba(63,140,232,${(0.45 * w).toFixed(3)})`, display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: F.ui, fontWeight: 500, fontSize: 24, color: mix("#6F8DB8", "#FFFFFF", w),
      }}>Publish</div>
    </>
  );
};
// measured element tracks the single camera does not explain (spec T3, smoothed; frames 768..818):
// headline offset from the camera model (screen px) and the toggle track's centre y and scale
const B_HX = [-6.30, -7.29, -7.85, -8.02, -7.90, -7.64, -7.37, -7.17, -7.09, -7.13, -7.24, -7.34, -7.30, -7.05, -6.57, -5.97, -5.35, -4.81, -4.33, -3.86, -3.31, -2.70, -2.08, -1.55, -1.14, -0.83, -0.55, -0.26, 0.04, 0.31, 0.52, 0.73, 1.03, 1.51, 2.21, 3.12, 4.16, 5.21, 6.16, 6.95, 7.56, 8.03, 8.36, 8.56, 8.64, 8.57, 8.30, 7.74, 6.82, 5.46, 3.61];
const B_HY = [-4.30, -5.16, -5.26, -4.69, -3.66, -2.42, -1.20, -0.12, 0.76, 1.46, 1.98, 2.29, 2.41, 2.34, 2.17, 1.96, 1.80, 1.72, 1.69, 1.66, 1.62, 1.59, 1.62, 1.77, 2.06, 2.50, 3.07, 3.75, 4.54, 5.41, 6.33, 7.22, 8.00, 8.60, 8.98, 9.13, 9.09, 8.92, 8.69, 8.44, 8.19, 7.92, 7.56, 7.09, 6.52, 5.89, 5.33, 4.96, 4.89, 5.20, 5.90];
const B_TY = [442.00, 441.47, 440.08, 438.02, 435.70, 433.51, 431.69, 430.30, 429.27, 428.47, 427.77, 427.09, 426.40, 425.71, 425.05, 424.42, 423.83, 423.27, 422.73, 422.21, 421.74, 421.36, 421.10, 420.97, 420.93, 420.94, 420.95, 420.94, 420.93, 420.97, 421.10, 421.36, 421.75, 422.23, 422.78, 423.34, 423.90, 424.47, 425.10, 425.82, 426.67, 427.68, 428.82, 430.10, 431.53, 433.21, 435.28, 437.87, 441.12, 445.08, 449.80];
const B_TS = [0.7000, 0.7341, 0.7652, 0.7932, 0.8176, 0.8379, 0.8538, 0.8663, 0.8767, 0.8863, 0.8959, 0.9056, 0.9148, 0.9231, 0.9306, 0.9376, 0.9447, 0.9521, 0.9598, 0.9672, 0.9736, 0.9788, 0.9829, 0.9864, 0.9900, 0.9945, 0.9999, 1.0057, 1.0111, 1.0158, 1.0200, 1.0242, 1.0289, 1.0344, 1.0402, 1.0455, 1.0498, 1.0533, 1.0568, 1.0613, 1.0675, 1.0752, 1.0841, 1.0931, 1.1013, 1.1083, 1.1138, 1.1177, 1.1200, 1.1204, 1.1190];
// headline reveal front (measured keys 768..818, Whittaker-smoothed: the linear keys jumped 15 -> 23 -> 16 px/frame at 795-797)
const B_FRONT = [1059.0, 1083.5, 1107.9, 1132.2, 1156.1, 1179.5, 1202.1, 1223.8, 1244.3, 1264.0, 1282.9, 1301.4, 1319.8, 1338.3, 1357.0, 1376.0, 1395.1, 1414.3, 1433.5, 1452.4, 1470.9, 1488.8, 1506.2, 1523.0, 1539.6, 1556.4, 1573.5, 1591.3, 1609.5, 1627.8, 1645.7, 1662.9, 1679.1, 1694.5, 1709.0, 1722.9, 1736.4, 1749.4, 1762.1, 1774.5, 1786.5, 1798.1, 1809.2, 1819.8, 1829.8, 1839.2, 1848.1, 1856.6, 1864.7, 1872.5, 1880.0];
const SceneB: React.FC<{ t: number; dy: number }> = ({ t, dy }) => {
  const { s, ty, roll } = camB(t);
  const head = "Publish anywhere", hb = textBox(head, 76, 800, F.head, TRK, WS);
  const hx0 = 952 - hb.vis / 2, hx1 = 952 + hb.vis / 2;
  const front = tab(t, 768, B_FRONT) + (hx1 - 1263);
  const tail = t < 798 ? undefined : 633 + 36 * (t - 815) + 4 * Math.max(0, t - 815) ** 2 + (hx0 - 640);
  const knob = spline(t, [[796, -21], [800, -18], [804, -14], [808, -9.5], [812, -4], [815, 2.5], [818, 13], [819, 18]]);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "960px 540px", transform: `translate(0px, ${ty + dy}px) rotate(${roll}deg) scale(${s})` }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "952px 201px", transform: `translate(${tab(t, 768, B_HX) / s}px, ${tab(t, 768, B_HY) / s}px) rotate(1.3deg)` }}>
          <Txt text={head} size={76} weight={800} family={F.head} track={TRK} ws={WS} cx={952} base={228.9} shadow={HEAD_GLOW} wipe={{ front, W: 650, tail, Wout: 645 }} />
        </div>
        <Txt text="Every format" size={44} weight={500} family={F.ui} cx={958} base={310.5} color="#FDFEFF" />
        {CARDS.map((c, i) => <FormatCard key={i} c={c} t={t} i={i} />)}
      </div>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "959px 421px", transform: `translate(0px, ${tab(t, 768, B_TY) - 421 + dy}px) rotate(${roll}deg) scale(${tab(t, 768, B_TS)})` }}>
        <div style={{ position: "absolute", left: 909, top: 397, width: 100, height: 48, borderRadius: 24, background: "#D6DEE9" }} />
        <div style={{ position: "absolute", left: 0, top: 0, width: 30, height: 30, borderRadius: 15, background: "#3F8CE8", transform: `translate(${959 + knob - 15}px, ${421 - 15}px)` }} />
      </div>
    </AbsoluteFill>
  );
};
const bgB = (t: number) => {
  const floor = mix("#0E2342", "#123058", (t - 780) / 35);
  return (
    <>
      <div style={{ position: "absolute", inset: -300, background: "#07101C" }} />
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 760px 640px at 0px 0px, #0B1A30 0%, rgba(11,26,48,0.5) 40%, rgba(11,26,48,0) 100%)" }} />
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 900px 450px at 960px 1150px, ${floor} 0%, ${floor.replace(",1)", ",0.55)")} 45%, rgba(14,35,66,0) 100%)` }} />
    </>
  );
};
const B_SMEAR: [number, number][] = [[768, 24], [769, 9], [771, 9], [772, 4.5], [775, 4.5], [776, 0], [811, 0], [812, 4.5], [815, 4.5], [816, 9], [817, 10.5], [818, 12]];
const ShotB: React.FC<{ g: number }> = ({ g }) => {
  const L = kl(g, B_SMEAR), n = L > 0 ? Math.max(2, Math.ceil(L / 2)) : 1;
  const ca = kl(g, [[814, 0], [815, 0.5], [816, 1], [817, 1.25], [818, 1.5]]);
  const fade = kl(g, [[768, 0.45], [769, 0.8], [770, 0.88], [772, 0.94], [775, 1]]);
  return (
    <AbsoluteFill style={{ opacity: fade }}>
      <Composite n={n} bg={bgB(g)} chans={ca > 0 ? rgbShift(ca) : undefined} fg={(u) => <SceneB t={g} dy={u * L} />} />
    </AbsoluteFill>
  );
};

// =====================================================================================================================
// SHOT C (819-865)
// =====================================================================================================================
// per-frame measurements 819..849 (spec T4), Whittaker-smoothed (3rd differences: the raw ones stepped up to 2 px), settled at rest from 845
const C_T = {
  subS: [0.8370, 0.8593, 0.8799, 0.8983, 0.9136, 0.9256, 0.9346, 0.9415, 0.9471, 0.9522, 0.9567, 0.9608, 0.9646, 0.9684, 0.9724, 0.9766, 0.9809, 0.9846, 0.9873, 0.9891, 0.9906, 0.9926, 0.9954, 0.9982, 1.0000, 1.0000, 1.0000],
  subX: [965.90, 966.39, 966.79, 967.09, 967.29, 967.43, 967.55, 967.64, 967.71, 967.76, 967.80, 967.85, 967.90, 967.92, 967.88, 967.81, 967.77, 967.79, 967.87, 967.96, 968.01, 968.02, 968.02, 968.01, 968.00, 968.00, 968.00],
  subY: [326.01, 329.81, 332.13, 333.31, 333.88, 334.40, 335.15, 336.13, 337.21, 338.25, 339.19, 340.04, 340.85, 341.67, 342.46, 343.18, 343.78, 344.31, 344.82, 345.37, 345.91, 346.38, 346.73, 346.93, 347.00, 347.00, 347.00],
  fuS: [0.8790, 0.8989, 0.9128, 0.9214, 0.9268, 0.9310, 0.9353, 0.9404, 0.9462, 0.9522, 0.9582, 0.9635, 0.9679, 0.9715, 0.9745, 0.9775, 0.9805, 0.9835, 0.9862, 0.9887, 0.9912, 0.9938, 0.9966, 0.9988, 1.0000, 1.0000, 1.0000],
  fuX: [672.00, 664.61, 658.55, 653.72, 649.92, 646.89, 644.37, 642.16, 640.17, 638.36, 636.74, 635.30, 634.00, 632.75, 631.52, 630.34, 629.26, 628.33, 627.54, 626.81, 626.09, 625.39, 624.70, 624.00, 623.30, 622.60, 622.00],
  fuY: [216.10, 216.13, 216.25, 216.49, 216.83, 217.23, 217.60, 217.87, 218.05, 218.21, 218.39, 218.60, 218.80, 218.99, 219.18, 219.41, 219.66, 219.88, 220.01, 220.06, 220.05, 220.02, 220.01, 220.00, 220.00, 220.00, 220.00],
  tgY: [429.71, 435.97, 440.72, 444.18, 446.75, 448.85, 450.74, 452.53, 454.24, 455.87, 457.41, 458.84, 460.17, 461.39, 462.51, 463.56, 464.53, 465.42, 466.24, 467.02, 467.78, 468.54, 469.25, 469.87, 470.30, 470.50, 470.50],
  tgS: [0.8130, 0.8442, 0.8705, 0.8922, 0.9100, 0.9243, 0.9355, 0.9436, 0.9493, 0.9538, 0.9580, 0.9626, 0.9671, 0.9711, 0.9747, 0.9783, 0.9823, 0.9866, 0.9903, 0.9928, 0.9944, 0.9957, 0.9973, 0.9990, 1.0000, 1.0000, 1.0000],
  knob: [933.11, 943.29, 951.24, 957.23, 961.71, 965.22, 968.18, 970.82, 973.20, 975.37, 977.34, 979.14, 980.80, 982.34, 983.75, 985.01, 986.13, 987.12, 987.98, 988.71, 989.34, 989.90, 990.39, 990.80, 991.10, 991.30, 991.50],
  iconY: [720.20, 722.56, 724.46, 725.93, 727.03, 727.85, 728.50, 729.08, 729.72, 730.51, 731.48, 732.71, 734.30, 736.33, 738.86, 741.83, 745.14, 748.58, 751.87, 754.68, 756.81, 758.28, 759.30, 760.18, 761.10, 762.00, 762.50],
  btnY: [884.21, 896.06, 905.42, 912.52, 917.83, 921.90, 925.17, 927.91, 930.25, 932.30, 934.19, 936.08, 938.02, 940.03, 942.03, 943.94, 945.70, 947.31, 948.82, 950.28, 951.75, 953.24, 954.69, 956.00, 957.00, 957.70, 958.50],
  grp: [0.7080, 0.7684, 0.8160, 0.8519, 0.8784, 0.8981, 0.9130, 0.9245, 0.9341, 0.9425, 0.9504, 0.9580, 0.9651, 0.9717, 0.9776, 0.9825, 0.9863, 0.9889, 0.9905, 0.9917, 0.9931, 0.9950, 0.9972, 0.9991, 1.0000, 1.0000, 1.0000],
};
const C_K = [0, 0.0019, 0.0037, 0.0056, 0.0075, 0.0093, 0.013, 0.0186, 0.0242, 0.0298, 0.0391, 0.0503, 0.0634, 0.082, 0.108, 0.15, 0.226, 0.34]; // 849..866
const C_TAIL: [number, number][] = [[852, -460], [853, -360], [854, -262], [855, -174], [856, -97], [857, 0], [858, 98], [859, 215], [860, 330], [861, 460], [862, 600], [863, 760], [864, 940], [865, 1140], [866, 1360]];
const Bar: React.FC<{ y: number; rot: number; v: string; p: number }> = ({ y, rot, v, p }) => (
  <div style={{ position: "absolute", left: 0, top: y, width: 168, height: 47, borderRadius: 9, background: "#FFFFFF", transform: `rotate(${rot}deg)`, boxShadow: "0 2px 6px rgba(1,4,10,0.25)" }}>
    <svg width={12} height={14} viewBox="0 0 12 14" style={{ position: "absolute", left: 19, top: 16.5 }}><path d="M1.5 1.5 L10.5 7 L1.5 12.5 Z" fill="#050F19" stroke="#050F19" strokeWidth={2} strokeLinejoin="round" /></svg>
    <div style={{ position: "absolute", left: 38, top: 23.5 - 0.8635 * 22 + 0.364 * 22 + 0.5, fontFamily: F.ui, fontWeight: 700, fontSize: 22, lineHeight: "22px", color: "#050F19", letterSpacing: -0.3 }}>{v}</div>
    <div style={{ position: "absolute", right: 18, top: 20, width: 46, height: 7, borderRadius: 3.5, background: "rgba(5,15,25,0.16)" }}>
      <div style={{ width: 46 * p, height: 7, borderRadius: 3.5, background: "#050F19" }} />
    </div>
  </div>
);
const SceneC: React.FC<{ t: number; dy: number }> = ({ t, dy }) => {
  const T = (a: number[]) => tab(t, 819, a);
  const k = tab(t, 849, C_K, true), drift = spline(t, [[849, 1], [856, 1.02], [860, 1.04], [864, 1.04], [865, 1.07], [866, 1.1]]);
  const exitTf = t > 849 ? `scale(1, ${1 + k})` : undefined;
  // horizontal widening on the exit: text by the measured drift, the toggle a little more, the card group not at all (measured)
  const tgDrift = spline(t, [[849, 1], [856, 1.02], [860, 1.05], [863, 1.1], [865, 1.18], [866, 1.22]]);
  // headline: scale fuS about its rest centre (959, 212), carried by the measured left word
  const fuS = T(C_T.fuS), hX = T(C_T.fuX) + fuS * 337, hY = T(C_T.fuY) - 8 * fuS;
  const head = "Multiple versions", hb = textBox(head, 93, 800, F.head, TRK, WS);
  const hx0 = 959 - hb.vis / 2, hx1 = 959 + hb.vis / 2;
  const front = Math.max(1116, 1116 + 29.4 * (t - 820)) + (hx1 - 1404);
  const tail = t < 852 ? undefined : kl(t, C_TAIL) + (hx0 - 514);
  const subS = T(C_T.subS), tgS = T(C_T.tgS), tgY = T(C_T.tgY);
  const knobOff = Math.max(-31.5, Math.min(31.5, (T(C_T.knob) - 960) / tgS));
  const gS = T(C_T.grp), iconY = T(C_T.iconY), btnY = T(C_T.btnY);
  const cardTop = spline(t, [[819, 562.5], [822, 563], [826, 564], [830, 566], [835, 567.2], [840, 569], [845, 571.5]]);
  const sy = spline(t, [[819, 0.855], [822, 0.865], [826, 0.88], [835, 0.95], [841, 1]]);
  // the card group: a slight 3D turn on the cut, then on the exit it turns its right side towards us (measured edge ratio 1.10 by 863)
  const ry = spline(t, [[819, 8], [822, 4], [826, 0]]) + spline(t, [[852, 0], [856, -2], [858, -4], [860, -7], [862, -10], [863, -12], [864, -13], [865, -13.5], [866, -14]]);
  // early on, the card reads a little wider and the icon / button a little taller than the group scale (measured 819-845)
  const gC = gS + spline(t, [[819, 0.012], [822, 0.033], [826, 0.015], [836, 0]]);
  const vbI = spline(t, [[819, 1.1], [822, 1.12], [826, 1.07], [836, 1.04], [841, 1.02], [845, 1]]);
  const vbB = spline(t, [[819, 1.1], [822, 1.12], [826, 1.06], [832, 1.02], [836, 1]]);
  const rz = spline(t, [[854, 0], [860, 0.5], [865, 0.8], [866, 0.9]]);
  // (the sparse measured keys above: Catmull-Rom, not linear; linear keys stepped the velocity at 822 / 826 by up to 2.3 px/frame)
  const gcy = cardTop + 289 * sy;
  const hsm = kl(t, [[858, 0], [860, 8], [862, 30], [863, 40], [866, 40]]);
  const topRot = spline(t, [[831, -5.4], [833, -3.7], [834, -2.2], [835, -1.2], [836, 0]]);
  const lowRot = spline(t, [[826, -5.5], [829, -3.5], [831, -3.5], [833, -2.0], [834, -1.0], [835, -0.4], [836, 0]]);
  const full: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: 1920, height: 1080 };
  return (
    <AbsoluteFill>
      <div style={{ ...full, transformOrigin: "960px 1958px", transform: exitTf }}>
        <div style={{ ...full, transform: `translateY(${dy}px)` }}>
          <div style={{ ...full, transformOrigin: "959px 212px", transform: `translate(${hX - 959}px, ${hY - 212}px) scale(${fuS * drift}, ${fuS})` }}>
            <Smear L={hsm}><Txt text={head} size={93} weight={800} family={F.head} track={TRK} ws={WS} cx={959} base={246} shadow={HEAD_GLOW} wipe={{ front, W: 900, tail, Wout: 975 }} /></Smear>
          </div>
          <div style={{ ...full, transformOrigin: "968px 347px", transform: `translate(${T(C_T.subX) - 968}px, ${T(C_T.subY) - 347}px) scale(${subS * drift}, ${subS})` }}>
            <Txt text="One project" size={41} weight={500} family={F.ui} cx={967} base={358.5} />
          </div>
          <div style={{ ...full, transformOrigin: "960px 470.5px", transform: `translate(0px, ${tgY - 470.5}px) scale(${tgS * tgDrift}, ${tgS})` }}>
            <div style={{ position: "absolute", left: 900, top: 442, width: 120, height: 57, borderRadius: 28.5, background: "#3F8CE8" }} />
            <div style={{ position: "absolute", left: 0, top: 0, width: 34.5, height: 34.5, borderRadius: 17.25, background: "#FFFFFF", transform: `translate(${960 + knobOff - 17.25}px, ${470.5 - 17.25}px)` }} />
          </div>
          <div style={{ ...full, perspective: 1600, perspectiveOrigin: "960px 540px" }}>
            <div style={{ ...full, transformOrigin: `958.5px ${gcy}px`, transform: `rotateZ(${rz}deg) rotateY(${ry}deg)` }}>
              <div style={{ position: "absolute", left: 0, top: 0, width: 561, height: 578, transformOrigin: "280.5px 0px", transform: `translate(${958.5 - 280.5}px, ${cardTop}px) scale(${gC}, ${sy})` }}>
                <Glass id="srv" w={561} h={578} r={22} fill="linear-gradient(180deg, rgba(21,35,56,0.94) 0%, rgba(26,44,69,0.94) 100%)" rim={RIM_BIG} lw={3} shadow="0 14px 40px rgba(1,4,10,0.45)" style={{ left: 0, top: 0 }} />
              </div>
              <div style={{ position: "absolute", left: 0, top: 0, width: 168, height: 147, transform: `translate(${958 - 84}px, ${iconY - 73.5}px) scale(${gS}, ${gS * vbI})` }}>
                <Bar y={0} rot={topRot} v="V1" p={1} />
                <Bar y={50} rot={lowRot} v="V2" p={0.7} />
                <Bar y={100} rot={lowRot} v="V3" p={0.4} />
              </div>
              <div style={{
                position: "absolute", left: 0, top: 0, width: 246, height: 104, borderRadius: 52, background: "#3F8CE8", transform: `translate(${959 - 123}px, ${btnY - 52}px) scale(${gS}, ${gS * vbB})`,
                boxShadow: "0 0 18px rgba(63,140,232,0.35)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.ui, fontWeight: 500, fontSize: 37, color: "#FFFFFF",
              }}>Render all</div>
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
const BG_C = (
  <>
    <div style={{ position: "absolute", inset: -300, background: "#07101C" }} />
    <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 760px 640px at 0px 0px, #0B1A30 0%, rgba(11,26,48,0.5) 40%, rgba(11,26,48,0) 100%)" }} />
    <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 700px 420px at 960px 1150px, #16385F 0%, rgba(22,56,95,0.55) 45%, rgba(22,56,95,0) 100%)" }} />
  </>
);
const C_N: Record<number, number> = { 860: 2, 861: 2, 862: 3, 863: 3, 864: 4, 865: 6 };
const ShotC: React.FC<{ g: number }> = ({ g }) => {
  const L = kl(g, [[819, 10], [820, 6], [821, 3], [822, 1.5], [823, 0]]);
  if (L > 0) return <Composite n={Math.max(2, Math.ceil(L / 2))} bg={BG_C} fg={(u) => <SceneC t={g} dy={u * L} />} />;
  return <Composite n={C_N[g] ?? 1} bg={BG_C} fg={(u) => <SceneC t={g + 0.1 * u} dy={0} />} />;
};

export const Seg6: React.FC<{ g: number }> = ({ g }) => (g < 768 ? <ShotA g={g} /> : g < 819 ? <ShotB g={g} /> : <ShotC g={g} />);
