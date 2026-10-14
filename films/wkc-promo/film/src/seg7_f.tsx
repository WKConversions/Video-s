// Segment 7, shot F (962-1008): "2 Founders, / 1 Studio" among glass tiles (the founders' portraits and client stills),
// a pull-back zoom about the frame centre with per-layer parallax, cut in with smear + chromatic aberration,
// handed to segment 8 with the reference's fade gains over 1002-1009.
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { F, keys } from "./lib";
import { GlyphLine, fsCap, glyphs, seqv } from "./seg7_util";

// per-layer zoom scale about (960, 540), frames 962..1004 (spec T3), then extrapolated with the text layer's acceleration
const S: Record<string, number[]> = {
  text: [1.608, 1.542, 1.472, 1.409, 1.362, 1.325, 1.288, 1.258, 1.230, 1.207, 1.186, 1.168, 1.151, 1.135, 1.120, 1.107, 1.095, 1.084, 1.073, 1.064, 1.055, 1.046, 1.038, 1.031, 1.024, 1.017, 1.011, 1.005, 1.000, 0.995, 0.990, 0.985, 0.981, 0.977, 0.973, 0.968, 0.963, 0.956, 0.948, 0.940, 0.931, 0.920, 0.909],
  penn: [1.695, 1.616, 1.547, 1.486, 1.435, 1.385, 1.341, 1.304, 1.271, 1.242, 1.218, 1.194, 1.174, 1.156, 1.140, 1.125, 1.109, 1.097, 1.083, 1.074, 1.064, 1.052, 1.044, 1.036, 1.027, 1.020, 1.012, 1.006, 1.000, 0.994, 0.988, 0.983, 0.978, 0.973, 0.968, 0.963, 0.957, 0.949, 0.941, 0.932, 0.921, 0.911, 0.896],
  harv: [1.770, 1.699, 1.634, 1.576, 1.523, 1.475, 1.431, 1.392, 1.356, 1.325, 1.294, 1.263, 1.237, 1.214, 1.193, 1.175, 1.157, 1.137, 1.123, 1.109, 1.094, 1.079, 1.066, 1.053, 1.041, 1.030, 1.020, 1.011, 1.000, 0.992, 0.981, 0.974, 0.966, 0.959, 0.950, 0.942, 0.933, 0.925, 0.916, 0.904, 0.893, 0.879, 0.869],
  clip: [1.538, 1.488, 1.443, 1.401, 1.360, 1.330, 1.300, 1.270, 1.244, 1.217, 1.192, 1.174, 1.157, 1.140, 1.124, 1.112, 1.100, 1.090, 1.080, 1.068, 1.055, 1.042, 1.033, 1.025, 1.018, 1.012, 1.007, 1.003, 1.000, 0.996, 0.991, 0.987, 0.981, 0.975, 0.970, 0.966, 0.961, 0.955, 0.950, 0.942, 0.930, 0.912, 0.895],
  snap: [1.494, 1.442, 1.396, 1.357, 1.318, 1.288, 1.254, 1.228, 1.206, 1.187, 1.168, 1.153, 1.137, 1.123, 1.110, 1.098, 1.088, 1.078, 1.068, 1.060, 1.051, 1.044, 1.037, 1.031, 1.024, 1.016, 1.009, 1.005, 1.000, 0.995, 0.991, 0.986, 0.981, 0.978, 0.974, 0.969, 0.964, 0.957, 0.950, 0.941, 0.934, 0.927, 0.915],
  veri: [1.792, 1.710, 1.637, 1.571, 1.512, 1.460, 1.413, 1.370, 1.332, 1.299, 1.265, 1.242, 1.216, 1.190, 1.165, 1.150, 1.133, 1.118, 1.104, 1.091, 1.078, 1.066, 1.055, 1.044, 1.033, 1.025, 1.016, 1.010, 1.000, 0.990, 0.986, 0.980, 0.974, 0.969, 0.963, 0.956, 0.948, 0.939, 0.930, 0.919, 0.907, 0.891, 0.874],
  natw: [1.681, 1.587, 1.507, 1.449, 1.376, 1.324, 1.280, 1.245, 1.214, 1.188, 1.165, 1.146, 1.127, 1.112, 1.098, 1.086, 1.074, 1.064, 1.055, 1.046, 1.039, 1.032, 1.026, 1.020, 1.015, 1.010, 1.007, 1.003, 1.000, 0.996, 0.994, 0.993, 0.991, 0.990, 0.988, 0.985, 0.981, 0.976, 0.969, 0.961, 0.952, 0.938, 0.924],
  adobe: [2.227, 2.085, 1.960, 1.849, 1.752, 1.666, 1.590, 1.523, 1.463, 1.410, 1.363, 1.321, 1.284, 1.250, 1.220, 1.194, 1.169, 1.148, 1.128, 1.110, 1.091, 1.080, 1.068, 1.050, 1.040, 1.031, 1.020, 1.009, 1.000, 0.991, 0.984, 0.978, 0.970, 0.965, 0.957, 0.949, 0.941, 0.930, 0.918, 0.907, 0.894, 0.880, 0.866],
  banco: [1.472, 1.414, 1.364, 1.319, 1.282, 1.246, 1.214, 1.184, 1.162, 1.144, 1.128, 1.112, 1.099, 1.086, 1.077, 1.068, 1.057, 1.051, 1.044, 1.035, 1.032, 1.024, 1.020, 1.015, 1.012, 1.007, 1.003, 1.002, 1.000, 0.996, 0.996, 0.993, 0.992, 0.991, 0.990, 0.987, 0.984, 0.980, 0.974, 0.969, 0.960, 0.952, 0.944],
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
      position: "absolute", left: t.x0, top: t.y0, width: w, height: h, boxSizing: "border-box", transformOrigin: `${960 - t.x0}px ${540 - t.y0}px`, transform: `scale(${s})`,
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
        <g transform={`translate(960 540) scale(${st}) translate(-960 -540)`}>
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
