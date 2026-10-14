// Segment 7, shot F (962-1008): "2 Founders, / 1 Studio" among glass tiles (the founders' portraits and client stills),
// a pull-back zoom about the frame centre with per-layer parallax, cut in with smear + chromatic aberration,
// handed to segment 8 with the reference's fade gains over 1002-1009.
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { F, keys } from "./lib";
import { GlyphLine, NUDGE, fsCap, glyphs, seqv } from "./seg7_util";

// per-layer zoom scale about (960, 540), frames 962..1004 (spec T3), then extrapolated with the text layer's acceleration.
// The measured per-frame scales were noisy (0.002-0.01 a frame: 1-9 px of shake at a tile's far edge); these are the
// tables smoothed with a penalised spline in log scale (lam 2, first 6 frames weighted x4): <= 1.5 px from the
// measurements at the far edges (3 px on veri at 976, 4 px on natw at 965 under the cut-in smear).
const S: Record<string, number[]> = {
  text: [1.6085, 1.5387, 1.4719, 1.4124, 1.3633, 1.3231, 1.2883, 1.2576, 1.2307, 1.2070, 1.1862, 1.1675, 1.1505, 1.1348, 1.1203, 1.1071, 1.0950, 1.0838, 1.0734, 1.0637, 1.0547, 1.0462, 1.0382, 1.0308, 1.0238, 1.0172, 1.0110, 1.0052, 0.9999, 0.9948, 0.9900, 0.9855, 0.9812, 0.9771, 0.9728, 0.9680, 0.9624, 0.9558, 0.9482, 0.9397, 0.9303, 0.9202, 0.9098],
  penn: [1.6929, 1.6170, 1.5480, 1.4871, 1.4335, 1.3852, 1.3422, 1.3043, 1.2713, 1.2424, 1.2170, 1.1944, 1.1742, 1.1561, 1.1395, 1.1241, 1.1097, 1.0965, 1.0844, 1.0733, 1.0629, 1.0531, 1.0440, 1.0354, 1.0273, 1.0197, 1.0125, 1.0059, 0.9998, 0.9939, 0.9883, 0.9831, 0.9781, 0.9732, 0.9682, 0.9627, 0.9565, 0.9492, 0.9409, 0.9315, 0.9210, 0.9096, 0.8977],
  harv: [1.7688, 1.6994, 1.6348, 1.5761, 1.5230, 1.4750, 1.4316, 1.3922, 1.3564, 1.3235, 1.2927, 1.2640, 1.2379, 1.2145, 1.1933, 1.1740, 1.1559, 1.1388, 1.1230, 1.1080, 1.0935, 1.0794, 1.0659, 1.0532, 1.0413, 1.0303, 1.0200, 1.0101, 1.0005, 0.9912, 0.9823, 0.9740, 0.9661, 0.9583, 0.9503, 0.9421, 0.9336, 0.9246, 0.9148, 0.9040, 0.8924, 0.8805, 0.8688],
  clip: [1.5372, 1.4885, 1.4428, 1.4005, 1.3623, 1.3290, 1.2985, 1.2698, 1.2426, 1.2173, 1.1943, 1.1740, 1.1560, 1.1397, 1.1252, 1.1122, 1.1005, 1.0895, 1.0784, 1.0668, 1.0549, 1.0436, 1.0336, 1.0251, 1.0180, 1.0122, 1.0073, 1.0032, 0.9994, 0.9954, 0.9910, 0.9862, 0.9810, 0.9758, 0.9709, 0.9662, 0.9614, 0.9559, 0.9491, 0.9398, 0.9275, 0.9129, 0.8973],
  snap: [1.4926, 1.4428, 1.3971, 1.3561, 1.3193, 1.2864, 1.2563, 1.2296, 1.2065, 1.1863, 1.1683, 1.1520, 1.1369, 1.1230, 1.1102, 1.0984, 1.0877, 1.0777, 1.0683, 1.0596, 1.0516, 1.0441, 1.0370, 1.0302, 1.0233, 1.0165, 1.0102, 1.0047, 0.9997, 0.9951, 0.9905, 0.9862, 0.9819, 0.9779, 0.9737, 0.9689, 0.9634, 0.9569, 0.9497, 0.9420, 0.9339, 0.9253, 0.9163],
  veri: [1.7904, 1.7108, 1.6374, 1.5713, 1.5123, 1.4598, 1.4127, 1.3703, 1.3323, 1.2983, 1.2675, 1.2398, 1.2140, 1.1900, 1.1683, 1.1495, 1.1328, 1.1177, 1.1038, 1.0906, 1.0780, 1.0660, 1.0547, 1.0440, 1.0340, 1.0248, 1.0163, 1.0080, 0.9999, 0.9923, 0.9857, 0.9799, 0.9743, 0.9687, 0.9627, 0.9559, 0.9482, 0.9395, 0.9297, 0.9183, 0.9054, 0.8909, 0.8758],
  natw: [1.6777, 1.5894, 1.5110, 1.4421, 1.3791, 1.3251, 1.2807, 1.2441, 1.2136, 1.1875, 1.1649, 1.1451, 1.1275, 1.1119, 1.0980, 1.0855, 1.0742, 1.0640, 1.0547, 1.0464, 1.0388, 1.0320, 1.0258, 1.0201, 1.0150, 1.0105, 1.0065, 1.0029, 0.9996, 0.9967, 0.9945, 0.9928, 0.9914, 0.9898, 0.9878, 0.9850, 0.9811, 0.9758, 0.9690, 0.9605, 0.9502, 0.9383, 0.9257],
  adobe: [2.2243, 2.0861, 1.9608, 1.8497, 1.7520, 1.6660, 1.5900, 1.5228, 1.4631, 1.4101, 1.3630, 1.3211, 1.2837, 1.2502, 1.2203, 1.1935, 1.1694, 1.1476, 1.1277, 1.1097, 1.0934, 1.0789, 1.0653, 1.0524, 1.0406, 1.0297, 1.0193, 1.0094, 1.0001, 0.9918, 0.9843, 0.9775, 0.9709, 0.9642, 0.9571, 0.9491, 0.9401, 0.9299, 0.9186, 0.9065, 0.8936, 0.8802, 0.8666],
  banco: [1.4703, 1.4150, 1.3646, 1.3200, 1.2809, 1.2457, 1.2140, 1.1864, 1.1631, 1.1436, 1.1268, 1.1119, 1.0987, 1.0869, 1.0765, 1.0670, 1.0583, 1.0504, 1.0432, 1.0365, 1.0305, 1.0249, 1.0198, 1.0152, 1.0111, 1.0073, 1.0041, 1.0015, 0.9992, 0.9970, 0.9953, 0.9937, 0.9924, 0.9911, 0.9894, 0.9871, 0.9839, 0.9796, 0.9742, 0.9678, 0.9604, 0.9524, 0.9443],
};
const TEXT_TAIL = [0.909, 0.896, 0.882, 0.866, 0.849, 0.830];
const sc = (layer: string, g: number) => {
  if (g <= 1004) return seqv(g, 962, S[layer]);
  const t = seqv(g, 1004, TEXT_TAIL) / 0.909;
  return S[layer][S[layer].length - 1] * t;
};

type Tile = { k: string; x0: number; x1: number; y0: number; y1: number; src?: string; kind: "img" | "icon" | "person"; label?: string; pos?: string };
const TILES: Tile[] = [
  { k: "penn", x0: 416, x1: 717, y0: 92, y1: 255, src: "clips/clearscaler-16x9.jpg", kind: "img", pos: "30% 40%" },
  { k: "harv", x0: 900, x1: 1106, y0: 72, y1: 300, src: "clips/vendom-1x1.jpg", kind: "img", pos: "55% 50%" },
  { k: "clip", x0: 1356, x1: 1556, y0: 206, y1: 399, src: "clips/voxflow-9x16.jpg", kind: "img", pos: "50% 45%" },
  { k: "snap", x0: 202, x1: 414, y0: 416, y1: 639, src: "clips/creoble-9x16.jpg", kind: "icon", label: "Creoble", pos: "50% 50%" },
  { k: "veri", x0: 1539, x1: 1882, y0: 426, y1: 666, src: "clips/malaga-16x9.jpg", kind: "img", pos: "50% 50%" },
  { k: "banco", x0: 22, x1: 332, y0: 802, y1: 963, src: "clips/robin-bos-16x9.jpg", kind: "img", pos: "50% 45%" },
  { k: "natw", x0: 1192, x1: 1557, y0: 606, y1: 994, src: "img/karl-400.webp", kind: "person", label: "Karl van Kessel", pos: "50% 22%" },
  { k: "adobe", x0: 406, x1: 758, y0: 711, y1: 1104, src: "img/raphael-400.webp", kind: "person", label: "Raphael Wind", pos: "50% 22%" },
];
// far, heavily blurred tiles (positions at frame 990, scaled with the text layer)
const FAR = [
  { x: 240, y: 135, w: 120, h: 110, src: "clips/kb-saas-16x9.jpg" },
  { x: 1550, y: 147, w: 110, h: 30, src: "clips/wicflow-16x9.jpg" },
  { x: 1725, y: 822, w: 130, h: 45, src: "clips/wkc-bfound-16x9.jpg" },
  { x: 983, y: 878, w: 100, h: 30, src: "clips/creoble-lovable-16x9.jpg" },
];

const GlassTile: React.FC<{ t: Tile; s: number }> = ({ t, s }) => {
  const w = t.x1 - t.x0, h = t.y1 - t.y0, r = Math.max(18, Math.round(w * 0.092)), ins = 7;
  let body: React.ReactNode = null;
  if (t.kind === "img") {
    body = <Img src={staticFile(t.src!)} style={{ position: "absolute", left: ins, top: ins, width: w - 2 * ins - 5, height: h - 2 * ins - 5, objectFit: "cover", objectPosition: t.pos, borderRadius: r - ins }} />;
  } else if (t.kind === "icon") {
    body = (
      <>
        <Img src={staticFile(t.src!)} style={{ position: "absolute", left: (w - 98) / 2 - 2.5, top: 37, width: 98, height: 98, objectFit: "cover", objectPosition: t.pos, borderRadius: 22 }} />
        <div style={{ position: "absolute", left: 0, width: w - 5, top: 181 - 26 * 0.97 - 2.5, textAlign: "center", fontFamily: F.ui, fontWeight: 600, fontSize: 26, lineHeight: "26px", color: "#FFFFFF", letterSpacing: "-0.01em" }}>{t.label}</div>
      </>
    );
  } else {
    const ph = Math.round(h * 0.7);
    body = (
      <>
        <Img src={staticFile(t.src!)} style={{ position: "absolute", left: ins, top: ins, width: w - 2 * ins - 5, height: ph - ins, objectFit: "cover", objectPosition: t.pos, borderRadius: `${r - ins}px ${r - ins}px 12px 12px` }} />
        <div style={{ position: "absolute", left: ins, top: ins + (ph - ins) * 0.62, width: w - 2 * ins - 5, height: (ph - ins) * 0.38, borderRadius: "0 0 12px 12px", background: "linear-gradient(180deg, rgba(10,22,48,0) 0%, rgba(10,22,48,0.42) 100%)" }} />
        <div style={{ position: "absolute", left: 0, width: w - 5, top: h * 0.82 - 18 - 2.5, textAlign: "center", fontFamily: F.ui, fontWeight: 600, fontSize: 36, lineHeight: "36px", color: "#FFFFFF", letterSpacing: "-0.01em" }}>{t.label}</div>
      </>
    );
  }
  return (
    <div style={{
      position: "absolute", left: t.x0, top: t.y0, width: w, height: h, boxSizing: "border-box", transformOrigin: `${960 - t.x0}px ${540 - t.y0}px`, transform: `scale(${s}) rotate(${NUDGE}deg)`,
      borderRadius: r, borderStyle: "solid", borderWidth: 2.5,
      borderColor: "rgba(230,240,253,0.78) rgba(63,140,232,0.95) rgba(27,79,184,0.22) rgba(230,240,253,0.62)",
      background: "linear-gradient(180deg, rgba(26,42,66,0.92) 0px, rgba(16,27,44,0.9) 18px, rgba(15,25,40,0.88) 100%)",
      boxShadow: "7px 0 14px -5px rgba(27,79,184,0.95), 0 0 10px rgba(63,140,232,0.22)", overflow: "hidden",
    }}>
      {body}
      {/* glass sheen on top of the content */}
      <div style={{ position: "absolute", inset: 0, borderRadius: r, background: "linear-gradient(180deg, rgba(230,240,253,0.16) 0px, rgba(230,240,253,0) 16px), linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0) 45%)" }} />
    </div>
  );
};

const L1 = "2 Founders,", L2 = "1 Studio";
const FS = fsCap(57);

/** the picture of shot F at frame g (no smear) */
const Scene: React.FC<{ g: number }> = ({ g }) => {
  const st = sc("text", g);
  const m1 = glyphs(L1, FS), m2 = glyphs(L2, FS);
  const op = (i: number) => {
    const u = Math.min(1, Math.max(0, (g - 948 - 0.8 * i) / 21.2));
    return 1 - Math.pow(1 - u, 1.3);
  };
  const bl = (i: number) => { const o = op(i); return o < 0.6 ? 2.2 * (1 - o / 0.6) : 0; };
  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg, #050F19 0%, #07122A 55%, #0A1630 100%)" }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 900px 520px at 260px 1000px, rgba(14,34,68,0.75), rgba(14,34,68,0) 100%)" }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.2) 100%)" }} />
      {FAR.map((f, i) => (
        <div key={i} style={{ position: "absolute", left: f.x - f.w / 2, top: f.y - f.h / 2, width: f.w, height: f.h, transformOrigin: `${960 - f.x + f.w / 2}px ${540 - f.y + f.h / 2}px`, transform: `scale(${st})`, filter: "blur(20px) saturate(0.6)", opacity: 0.55, borderRadius: 14, overflow: "hidden" }}>
          <Img src={staticFile(f.src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
      ))}
      {TILES.map((t) => <GlassTile key={t.k} t={t} s={sc(t.k, g)} />)}
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        <g transform={`translate(960 540) rotate(${NUDGE}) scale(${st}) translate(-960 -540)`}>
          <GlyphLine text={L1} size={FS} x0={930 - m1.w / 2} y={474.75} idp="s7f1" i0={0} fill="#FBFCFF" op={op} blur={bl} />
          <GlyphLine text={L2} size={FS} x0={930 - m2.w / 2} y={603.75} idp="s7f2" i0={10} fill="#FBFCFF" op={op} blur={bl} />
        </g>
      </svg>
    </AbsoluteFill>
  );
};

const CH = { r: "1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0", g: "0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0", b: "0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" };

/** shot F with its cut-in smear / chromatic aberration and the hand-off fade */
export const ShotF: React.FC<{ g: number }> = ({ g }) => {
  const smear = keys(g, [[962, 9], [963, 4], [964, 2], [965, 0.8], [966, 0.8], [967, 0]]);
  const ca = keys(g, [[962, 0.0095], [963, 0.004], [964, 0.0015], [965, 0]]);
  const gain = keys(g, [[1002, 1], [1003, 0.84], [1004, 0.65], [1005, 0.48], [1006, 0.31], [1007, 0.16], [1008, 0.07], [1009, 0.02]]);
  const echo = (
    <AbsoluteFill style={{ filter: smear > 0.05 ? `url(#s7f-hb)` : undefined }}>
      <Scene g={g} />
      {g < 963 && <AbsoluteFill style={{ opacity: 0.32, transform: "translateX(45px)" }}><Scene g={g} /></AbsoluteFill>}
      {g < 963 && <AbsoluteFill style={{ opacity: 0.22, transform: "translateX(-45px)" }}><Scene g={g} /></AbsoluteFill>}
    </AbsoluteFill>
  );
  return (
    <AbsoluteFill style={{ opacity: gain, background: "#050F19" }}>
      <svg width={0} height={0} style={{ position: "absolute" }}>
        <defs>
          <filter id="s7f-hb" x="-5%" y="-5%" width="110%" height="110%" colorInterpolationFilters="sRGB"><feGaussianBlur stdDeviation={`${smear} ${smear * 0.15}`} /></filter>
          {(["r", "g", "b"] as const).map((c) => <filter key={c} id={`s7f-${c}`} colorInterpolationFilters="sRGB"><feColorMatrix type="matrix" values={CH[c]} /></filter>)}
        </defs>
      </svg>
      {ca > 0 ? (
        <AbsoluteFill style={{ isolation: "isolate", background: "#000" }}>
          {(["r", "g", "b"] as const).map((c) => (
            <AbsoluteFill key={c} style={{ mixBlendMode: "screen", filter: `url(#s7f-${c})`, transform: `scale(${c === "r" ? 1 - ca : c === "b" ? 1 + ca : 1})` }}>{echo}</AbsoluteFill>
          ))}
        </AbsoluteFill>
      ) : echo}
    </AbsoluteFill>
  );
};
