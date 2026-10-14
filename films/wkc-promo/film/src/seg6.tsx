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
const A_SUB_S = [1.27, 1.215, 1.178, 1.16, 1.147, 1.136, 1.124, 1.112, 1.101, 1.091, 1.082, 1.074, 1.067, 1.061, 1.056, 1.05, 1.045, 1.04, 1.035, 1.031,
  1.028, 1.025, 1.022, 1.02, 1.018, 1.016, 1.015, 1.013, 1.012, 1.01, 1.009, 1.007, 1.006, 1.005, 1.003, 1.002, 1.001, 1.0];
const A_TILE_S = [1.321, 1.283, 1.25, 1.22, 1.194, 1.171, 1.151, 1.133, 1.117, 1.101, 1.088, 1.077, 1.068, 1.061, 1.054, 1.049, 1.044, 1.039, 1.035, 1.032,
  1.028, 1.026, 1.023, 1.021, 1.018, 1.016, 1.014, 1.012, 1.01, 1.008, 1.007, 1.005, 1.004, 1.002, 1.001, 1.0, 1.0, 1.0, 1.0,
  1.0016, 1.0038, 1.0079, 1.0161, 1.0282, 1.0462, 1.0715, 1.1048, 1.16, 1.25, 1.4, 1.62];
const A_TILE_R = [2.21, 2.1, 2.0, 1.9, 1.81, 1.71, 1.62, 1.54, 1.46, 1.38, 1.3, 1.22, 1.12, 1.03, 0.95, 0.89, 0.82, 0.76, 0.71, 0.65,
  0.61, 0.56, 0.51, 0.46, 0.41, 0.37, 0.33, 0.3, 0.26, 0.23, 0.2, 0.17, 0.14, 0.11, 0.08, 0.06, 0.03, 0];
const A_RING_IN = [800, 716, 656, 614, 582, 556, 536, 520, 506, 494, 482, 473, 464, 457, 450, 445, 439, 435, 430, 427, 423, 420, 417, 414, 412, 410, 408, 406, 404, 403,
  401, 401, 400, 400, 400, 401, 401, 403, 404, 406, 408, 412, 416, 424, 431, 445, 459, 486, 513, 560, 620];
const A_RING_OUT = [956, 937, 918, 904, 891, 879, 867, 858, 849, 842, 834, 828, 822, 818, 813, 808, 804, 800, 797, 794, 791, 789, 788, 788, 788, 789, 791, 794, 798, 803,
  809, 817, 825, 838, 851, 873, 896, 935, 974];

type Tile = { b: [number, number, number, number]; glyph?: string; label?: string; rot?: number; spin?: "T2" | "T9"; gh?: number; stack?: boolean; target?: number };
const TILES: Tile[] = [
  { b: [426, 122, 644, 243], glyph: "browser", label: "Website" },
  { b: [1364, 128, 1512, 250], glyph: "infinity", gh: 56, spin: "T2" },
  { b: [1635, 128, 1851, 232], glyph: "in", label: "LinkedIn" },
  { b: [84, 380, 222, 510], glyph: "play", gh: 53 },
  { b: [306, 512, 519, 612], glyph: "camera", label: "Instagram", rot: 2 },
  { b: [1628, 398, 1846, 518], glyph: "note", label: "TikTok" },
  { b: [1458, 578, 1596, 698], glyph: "x", gh: 52, rot: -2 },
  { b: [92, 756, 303, 854], glyph: "megaphone", label: "Google Ads" },
  { b: [442, 850, 580, 988], glyph: "bag", gh: 66, spin: "T9" },
  { b: [1218, 880, 1450, 984], glyph: "w", label: "Webflow", target: 165 },
  { b: [1623, 798, 1797, 927], label: "Vimeo", stack: true },
];
const INK = "#F3F7FC";
const T9_SPIN: [number, number][] = [[728, 0], [729, 1.5], [730, 4], [732, 9], [734, 17], [736, 28], [738, 45], [740, 68], [742, 102], [744, 162], [746, 232], [748, 280],
  [750, 310], [752, 329], [754, 342], [756, 349], [758, 357], [761, 360]];
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

const SceneA: React.FC<{ t: number; zoom: number }> = ({ t, zoom }) => {
  const sTile = tab(t, 718, A_TILE_S, true), rTile = tab(t, 718, A_TILE_R, true);
  const sHead = tab(t, 718, A_HEAD_S, true) * kl(t, [[758, 1], [759, 1.005], [760, 1.01], [761, 1.025], [762, 1.035], [763, 1.055], [764, 1.09], [765, 1.13], [766, 1.17], [767, 1.21], [768, 1.26]]);
  const sSub = tab(t, 718, A_SUB_S, true) * kl(t, [[760, 1], [761, 1.01], [762, 1.02], [763, 1.035], [764, 1.06], [765, 1.095], [766, 1.15], [767, 1.23], [768, 1.33]]);
  const aHead = kl(t, [[760, 1], [761, 0.94], [762, 0.82], [763, 0.66], [764, 0.47], [765, 0.31], [766, 0.19], [767, 0.09], [768, 0.02]]);
  const aSub = kl(t, [[761, 1], [762, 0.88], [763, 0.73], [764, 0.47], [765, 0.29], [766, 0.16], [767, 0.07], [768, 0.02]]);
  const aTile = kl(t, [[762, 1], [763, 0.97], [764, 0.89], [765, 0.75], [766, 0.55], [767, 0.28], [768, 0]]);
  const rIn = tab(t, 718, A_RING_IN, true);
  const rOut = t < 726 ? rIn * lerp(1.87, 1.889, clamp01((t - 718) / 8)) : t <= 764 ? tab(t, 726, A_RING_OUT) : rIn * (974 / 459) * (1 + 0.03 * (t - 764));
  const a1 = 132 - 1.86 * (t - 750), aA = 141 + 0.65 * (t - 740);
  const dark = 0.3 * easeIn(clamp01((t - 759) / 8));
  // headline wipe: the reference's ramp re-expressed against our right edge (same speed, same width)
  const head = "Made for every platform", sub = "From websites to social ads";
  const hb = textBox(head, 85, 800, F.head, TRK, WS);
  const front = 1185 + 30 * (t - 719) + (958 + hb.vis / 2 - 1326), W = Math.min(960, 735 + 9 * (t - 719));
  const layer = (s: number, rot = 0): React.CSSProperties => ({ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "960px 540px", transform: `rotate(${rot}deg) scale(${s * zoom})` });
  return (
    <AbsoluteFill>
      <div style={layer(1)}>
        <Ring r={rIn * zoom} arcs={[{ a: a1, peak: 1 }, { a: a1 + 150, peak: 1 }]} />
        <Ring r={rOut * zoom} arcs={[{ a: aA, peak: 1 }, { a: aA + 179, peak: 0.38 }]} />
      </div>
      {dark > 0 && <div style={{ position: "absolute", inset: -300, background: "#000", opacity: dark }} />}
      <div style={{ ...layer(sTile, rTile), opacity: aTile }}>
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
const A_N: Record<number, number> = { 718: 20, 719: 10, 720: 7, 721: 5, 722: 4, 723: 3, 724: 3, 725: 2, 726: 2, 738: 3, 739: 3, 740: 5, 741: 5, 742: 8, 743: 8, 744: 8, 745: 8, 746: 8,
  747: 8, 748: 5, 749: 5, 750: 3, 751: 3, 755: 3, 756: 5, 757: 8, 758: 10, 759: 10, 760: 10, 761: 10, 762: 10, 763: 10, 764: 10, 765: 12, 766: 16, 767: 20 };
const BG_A = <div style={{ position: "absolute", inset: -300, background: "radial-gradient(ellipse 1100px 700px at 50% 50%, #0A1424 0%, #08111E 70%, #07101C 100%)" }} />;
const ShotA: React.FC<{ g: number }> = ({ g }) => {
  const n = A_N[g] ?? 1;
  const z = kl(g, [[718, 0.05], [719, 0.01], [720, 0]]);
  const ca = kl(g, [[718, 0.038], [719, 0.006], [720, 0.0025], [721, 0.001], [722, 0], [764, 0], [765, 0.0025], [766, 0.004], [767, 0.006]]);
  return <Composite n={n} bg={BG_A} chans={ca > 0.0005 ? rgbSplit(ca) : undefined} fg={(u) => <SceneA t={g + 0.5 * u} zoom={1 + z * u} />} />;
};

// =====================================================================================================================
// SHOT B (768-818)
// =====================================================================================================================
const camB = (t: number) => {
  const d = t - 795;
  const s = 0.99909 + 0.00523 * d + 0.00008 * Math.max(0, t - 805) ** 2 - 0.14939 * Math.pow(2, -(t - 768) / 3.2534);
  const ty = 0.101 + 1.1469 * d + 0.0854 * Math.max(0, t - 800) ** 2 + 9.2776 * Math.pow(2, -(t - 768) / 1.4678);
  const roll = spline(t, [[768, 1], [782, 1], [784, 0.5], [788, 0.5], [790, 0], [801, 0], [804, -0.4], [807, -0.8], [818, -0.8]]);
  return { s, ty, roll };
};
const poly = (c: number[], d: number) => c[0] + d * (c[1] + d * (c[2] + d * c[3]));
type CardDef = { label: string; fw: number; fh: number; H: number; dy: number; cs: number; x: number[]; y: number[]; k: number[]; sel: [number, number][]; w: [number, number][] };
const CARDS: CardDef[] = [
  { label: "16:9", fw: 118, fh: 66, H: 330, dy: 0, cs: 1, x: [481.157, 0.675375, -0.00771006, -0.000381291], y: [727.224, -2.09693, 0.030467, 0.00046481], k: [1.00371, -0.00296101, 2.05411e-5, -1.31496e-6],
    sel: [[798, 0], [799, 0.2], [800, 0.55], [801, 0.7], [802, 0.88], [803, 1], [814, 1], [815, 0.75], [816, 0.4], [817, 0.35], [818, 0.35]],
    w: [[799, 0], [800, 0.03], [801, 0.3], [802, 0.59], [803, 0.87], [804, 1], [814, 1], [815, 0.88], [816, 0.6], [817, 0.3], [818, 0.01]] },
  { label: "1:1", fw: 70, fh: 70, H: 373, dy: 2.3, cs: 0.89, x: [962.053, -0.125613, -0.00371732, 0.000139697], y: [729.978, -1.03148, 0.0127139, -3.85923e-7], k: [0.879672, -0.000717171, 5.92128e-6, 5.86004e-7],
    sel: [[781, 1], [782, 0.53], [783, 0.07], [784, 0]],
    w: [[780, 1], [781, 0.86], [782, 0.58], [783, 0.23], [784, 0]] },
  { label: "9:16", fw: 44, fh: 78, H: 352, dy: 15, cs: 1, x: [1404.91, 0.499562, 0.013619, 0.000185246], y: [709.853, -0.324879, 0.0296261, -0.000522908], k: [0.900998, 0.000344405, 5.54421e-5, -2.62475e-8],
    sel: [[781, 0], [782, 0.46], [783, 0.65], [784, 0.82], [785, 0.9], [786, 1], [797, 1], [798, 0.75], [799, 0.35], [800, 0]],
    w: [[781, 0.02], [782, 0.2], [783, 0.42], [784, 0.64], [785, 0.86], [786, 0.99], [787, 1], [798, 1], [799, 0.71], [800, 0.42], [801, 0.14], [802, 0]] },
];
const FormatCard: React.FC<{ c: CardDef; t: number; i: number }> = ({ c, t, i }) => {
  // the frame (per-card measured height and offset) and the content (logo at -70, button at +70) scale about their own centres
  const d = t - 795, w = kl(t, c.w), K = poly(c.k, d) * (1 + 0.2 * kl(t, c.sel));
  const cx = poly(c.x, d), cy = poly(c.y, d), Kc = K * c.cs;
  const logo = mix("#5C6573", "#FFFFFF", w);
  return (
    <>
      <Glass id={`c${i}`} w={444} h={c.H} r={18} fill={mix("#0E1828", "#132138", w, 0.85)} rim={RIM_CARD} k={lerp(0.2, 1, w)} lw={2.8}
        shadow="0 12px 30px rgba(1,4,10,0.45)" style={{ left: cx - 222, top: cy + c.dy * K - c.H / 2, transform: `scale(${K})` }} />
      <div style={{ position: "absolute", left: cx - 222, top: cy - 70 * K - 60, width: 444, height: 120, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", transform: `scale(${Kc})` }}>
        <div style={{ width: c.fw, height: c.fh, border: `4px solid ${logo}`, borderRadius: 9, boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width={14} height={16} viewBox="0 0 14 16" style={{ display: "block", marginLeft: 3 }}><path d="M1.5 1.5 L12.5 8 L1.5 14.5 Z" fill={logo} stroke={logo} strokeWidth={2} strokeLinejoin="round" /></svg>
        </div>
        <div style={{ marginTop: 9, fontFamily: F.ui, fontWeight: 600, fontSize: 24, lineHeight: "24px", color: logo, letterSpacing: -0.2 }}>{c.label}</div>
      </div>
      <div style={{
        position: "absolute", left: cx - 107, top: cy + 70 * K - 45, width: 214, height: 90, borderRadius: 45, background: mix("#12284D", "#3F8CE8", w), transform: `scale(${Kc})`,
        boxShadow: `0 0 16px rgba(63,140,232,${(0.55 * w).toFixed(3)})`, display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: F.ui, fontWeight: 500, fontSize: 24, color: mix("#6F8DB8", "#FFFFFF", w),
      }}>Publish</div>
    </>
  );
};
const B_FRONT: [number, number][] = [[768, 1059], [775, 1227], [780, 1319], [786, 1433], [790, 1509], [795, 1586], [797, 1632], [800, 1680], [805, 1750], [810, 1810], [813, 1840], [818, 1880]];
const SceneB: React.FC<{ t: number; dy: number }> = ({ t, dy }) => {
  const { s, ty, roll } = camB(t);
  const head = "Publish anywhere", hb = textBox(head, 76, 800, F.head, TRK, WS);
  const hx0 = 952 - hb.vis / 2, hx1 = 952 + hb.vis / 2;
  const front = kl(t, B_FRONT) + (hx1 - 1263);
  const tail = t < 798 ? undefined : 633 + 36 * (t - 815) + 4 * Math.max(0, t - 815) ** 2 + (hx0 - 640);
  const knob = kl(t, [[796, -21], [800, -18], [804, -14], [808, -9.5], [812, -4], [815, 2.5], [818, 13], [819, 18]]);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "960px 540px", transform: `translate(0px, ${ty + dy}px) rotate(${roll}deg) scale(${s})` }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "952px 201px", transform: "rotate(1.3deg)" }}>
          <Txt text={head} size={76} weight={800} family={F.head} track={TRK} ws={WS} cx={952} base={228.9} shadow={HEAD_GLOW} wipe={{ front, W: 650, tail, Wout: 645 }} />
        </div>
        <Txt text="Every format" size={44} weight={500} family={F.ui} cx={958} base={310.5} color="#FDFEFF" />
        <div style={{ position: "absolute", left: 909, top: 397, width: 100, height: 48, borderRadius: 24, background: "#D6DEE9" }} />
        <div style={{ position: "absolute", left: 959 + knob - 15, top: 421 - 15, width: 30, height: 30, borderRadius: 15, background: "#3F8CE8" }} />
        {CARDS.map((c, i) => <FormatCard key={i} c={c} t={t} i={i} />)}
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
// smoothed per-frame measurements 819..849 (spec T4), settled at rest from 845
const C_T = {
  subS: [0.837, 0.857, 0.879, 0.899, 0.915, 0.927, 0.934, 0.941, 0.945, 0.953, 0.958, 0.96, 0.965, 0.969, 0.971, 0.976, 0.981, 0.985, 0.989, 0.99, 0.99, 0.99, 0.993, 0.997, 1, 1, 1],
  subX: [965.9, 966.2, 966.9, 967.2, 967.3, 967.3, 967.5, 967.7, 967.8, 967.8, 967.7, 967.7, 967.9, 968.2, 967.9, 967.7, 967.7, 967.7, 967.9, 968.1, 968, 968, 968, 968, 968, 968, 968],
  subY: [326, 331, 332.6, 333.4, 333.1, 333.9, 335.3, 336.2, 337.4, 338.5, 339.1, 340.1, 340.7, 341.4, 342.6, 343.5, 343.7, 344.3, 344.7, 345.2, 346, 346.5, 346.7, 347, 347, 347, 347],
  fuS: [0.879, 0.902, 0.915, 0.921, 0.926, 0.929, 0.935, 0.941, 0.947, 0.951, 0.959, 0.964, 0.968, 0.972, 0.974, 0.976, 0.981, 0.984, 0.987, 0.989, 0.99, 0.993, 0.996, 0.998, 1, 1, 1],
  fuX: [672, 664.3, 658.4, 653.7, 649.9, 647, 644.5, 642.2, 640.2, 638.4, 636.5, 635.2, 634.1, 632.9, 631.7, 630.2, 629.1, 628.2, 627.7, 626.9, 626.1, 625.3, 624.6, 624, 623.3, 622.6, 622],
  fuY: [216.1, 216.2, 216.3, 216.4, 216.6, 217.3, 217.8, 218, 218, 218, 218.3, 218.7, 219, 219, 219, 219.3, 219.7, 220, 220.1, 220, 220, 220, 220, 220, 220, 220, 220],
  tgY: [429.7, 436.8, 441, 444.3, 446.2, 448.6, 450.8, 452.7, 454.2, 455.9, 457.4, 458.9, 460.1, 461.5, 462.4, 463.5, 464.6, 465.5, 466.2, 467, 467.8, 468.4, 469.2, 469.9, 470.3, 470.5, 470.5],
  tgS: [0.813, 0.845, 0.872, 0.891, 0.909, 0.924, 0.936, 0.946, 0.949, 0.953, 0.955, 0.963, 0.969, 0.973, 0.974, 0.977, 0.98, 0.987, 0.993, 0.994, 0.994, 0.993, 0.996, 0.998, 1, 1, 1],
  knob: [933.1, 944.1, 951.6, 957.4, 961.3, 964.9, 968, 971, 973.3, 975.4, 977.4, 979.1, 980.7, 982.4, 983.8, 985, 986.1, 987.1, 988, 988.8, 989.3, 989.8, 990.3, 990.8, 991.1, 991.3, 991.5],
  iconY: [720.2, 722.6, 724.5, 726, 726.9, 727.9, 728.7, 728.8, 729.6, 730.7, 731.6, 732.7, 734.3, 736.2, 738.9, 741.8, 745, 748.3, 752, 755, 757.2, 758.4, 759.2, 759.9, 761.1, 762, 762.5],
  btnY: [884.2, 896.7, 905.9, 912.7, 917.4, 921.5, 925.1, 928, 930.5, 932.4, 934.1, 935.9, 938, 940, 942.1, 944, 945.8, 947.3, 948.8, 950.3, 951.7, 953, 954.4, 955.8, 957, 957.7, 958.5],
  grp: [0.708, 0.773, 0.817, 0.853, 0.875, 0.898, 0.914, 0.924, 0.934, 0.943, 0.949, 0.959, 0.966, 0.97, 0.978, 0.983, 0.986, 0.99, 0.991, 0.991, 0.992, 0.994, 0.997, 1, 1, 1, 1],
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
  const exitTf = t > 849 ? `scale(${drift}, ${1 + k})` : undefined;
  // headline: scale fuS about its rest centre (959, 212), carried by the measured left word
  const fuS = T(C_T.fuS), hX = T(C_T.fuX) + fuS * 337, hY = T(C_T.fuY) - 8 * fuS;
  const head = "Multiple versions", hb = textBox(head, 93, 800, F.head, TRK, WS);
  const hx0 = 959 - hb.vis / 2, hx1 = 959 + hb.vis / 2;
  const front = Math.max(1116, 1116 + 29.4 * (t - 820)) + (hx1 - 1404);
  const tail = t < 852 ? undefined : kl(t, C_TAIL) + (hx0 - 514);
  const subS = T(C_T.subS), tgS = T(C_T.tgS), tgY = T(C_T.tgY);
  const knobOff = Math.max(-31.5, Math.min(31.5, (T(C_T.knob) - 960) / tgS));
  const gS = T(C_T.grp), iconY = T(C_T.iconY), btnY = T(C_T.btnY);
  const cardTop = kl(t, [[819, 562.5], [822, 563], [826, 564], [830, 566], [835, 567.2], [840, 569], [845, 571.5]]);
  const sy = kl(t, [[819, 0.855], [822, 0.865], [826, 0.88], [835, 0.95], [841, 1]]);
  // the card group: a slight 3D turn on the cut, then on the exit it turns its right side towards us (measured edge ratio 1.10 by 863)
  const ry = kl(t, [[819, 8], [822, 4], [826, 0]]) + spline(t, [[852, 0], [856, -2], [858, -4], [860, -7], [861, -9], [862, -11], [863, -13.5], [864, -15], [865, -15.5], [866, -16]]);
  const rz = spline(t, [[854, 0], [860, 0.5], [865, 0.8], [866, 0.9]]);
  const gcy = cardTop + 289 * sy;
  const hsm = kl(t, [[858, 0], [860, 8], [862, 30], [863, 40], [866, 40]]);
  const topRot = kl(t, [[831, -5.4], [833, -3.7], [834, -2.2], [835, -1.2], [836, 0]]);
  const lowRot = kl(t, [[826, -5.5], [829, -3.5], [831, -3.5], [833, -2.0], [834, -1.0], [835, -0.4], [836, 0]]);
  const full: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: 1920, height: 1080 };
  return (
    <AbsoluteFill>
      <div style={{ ...full, transformOrigin: "960px 1958px", transform: exitTf }}>
        <div style={{ ...full, transform: `translateY(${dy}px)` }}>
          <div style={{ ...full, transformOrigin: "959px 212px", transform: `translate(${hX - 959}px, ${hY - 212}px) scale(${fuS})` }}>
            <Smear L={hsm}><Txt text={head} size={93} weight={800} family={F.head} track={TRK} ws={WS} cx={959} base={246} shadow={HEAD_GLOW} wipe={{ front, W: 900, tail, Wout: 975 }} /></Smear>
          </div>
          <div style={{ ...full, transformOrigin: "968px 347px", transform: `translate(${T(C_T.subX) - 968}px, ${T(C_T.subY) - 347}px) scale(${subS})` }}>
            <Txt text="One project" size={41} weight={500} family={F.ui} cx={967} base={358.5} />
          </div>
          <div style={{ ...full, transformOrigin: "960px 470.5px", transform: `translate(0px, ${tgY - 470.5}px) scale(${tgS})` }}>
            <div style={{ position: "absolute", left: 900, top: 442, width: 120, height: 57, borderRadius: 28.5, background: "#3F8CE8" }} />
            <div style={{ position: "absolute", left: 960 + knobOff - 17.25, top: 470.5 - 17.25, width: 34.5, height: 34.5, borderRadius: 17.25, background: "#FFFFFF" }} />
          </div>
          <div style={{ ...full, perspective: 1600, perspectiveOrigin: "960px 540px" }}>
            <div style={{ ...full, transformOrigin: `958.5px ${gcy}px`, transform: `rotateZ(${rz}deg) rotateY(${ry}deg)` }}>
              <div style={{ position: "absolute", left: 958.5 - 280.5, top: cardTop, width: 561, height: 578, transformOrigin: "280.5px 0px", transform: `scale(${gS}, ${sy})` }}>
                <Glass id="srv" w={561} h={578} r={22} fill="linear-gradient(180deg, rgba(21,35,56,0.94) 0%, rgba(26,44,69,0.94) 100%)" rim={RIM_BIG} lw={3} shadow="0 14px 40px rgba(1,4,10,0.45)" style={{ left: 0, top: 0 }} />
              </div>
              <div style={{ position: "absolute", left: 958 - 84, top: iconY - 73.5, width: 168, height: 147, transform: `scale(${gS})` }}>
                <Bar y={0} rot={topRot} v="V1" p={1} />
                <Bar y={50} rot={lowRot} v="V2" p={0.7} />
                <Bar y={100} rot={lowRot} v="V3" p={0.4} />
              </div>
              <div style={{
                position: "absolute", left: 959 - 123, top: btnY - 52, width: 246, height: 104, borderRadius: 52, background: "#3F8CE8", transform: `scale(${gS})`,
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
