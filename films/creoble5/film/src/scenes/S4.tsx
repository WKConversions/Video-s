// Scene 4 (h3 to h4): hosting. One sage capsule morphs: globe, setup ring, price, chips, lock, year flip, domain chip,
// Europe pin, chain that breaks. One thing on screen at a time, centred, small, on plain cream (plan/storyboard.md).
import React from "react";
import { C, EXIT, INOUT, OUT, SANS, SERIF, clamp01, mix } from "../lib";
import { Chip, Ico, RollNumber, aspring, bounce, f, k, press, squash } from "../shared";
import { CX, CY, Handoff, HANDOFF_HALF, Line, Pill, float } from "../v5";

const FLAGS = "0000000001000010000100100101000010011000010100000000000011111101011011100010110100111101001011010110101011011100111111101111111010100111101101010011111110111001001010011101100111001100010011100100111001100110011100100111001110110011100111011001110110011100111011001110010111100111001001110010101100111001011100011100100111001010110011100100110001100010011000101111001110010011100100011001110010101000110001000110010001100110001011110010000100111001011110011000100011001010010011000101111001000010001100101011001100010101100101001001110010101100101001000110010100100111001010010010100101110001010010010100101001001010010011100101001001010010001100101000001010010100100101000000110010100100101001010010010101000001001010110010100000011000010010000100101001001010000000100001001001010000101100001000000010010101100101000000010000101000101000010010000100000001000010000000101001001000010000000100101000000010100000100001000000010100100100001010000010010100100101010000010000100000001010010010000101000001010010000010101000001000000000000101000001001010100000101000000000010100000100000010001010100000000101010000010100000000001010000000000101000101010001000010101000001010000100000101000000010011100000101000100000010100000001000110000010100000001001010000010100010000001010000000100001000001010000000000101000001010000100000101000100000010100000101000000000010100000001000010000010100000000001010000010100010000001110001010000101000001010001000000101000100010001000000101000100000010100010001000100000010100010100000100001010100010000001010001000100010000001010001000000011000100010001000000101000100000001000010101000100000010100010000000100000010100010000000100001000100010000001010001000000010000000010000000000001000000000001000000001000000000001000000000000000000000100000010000100000000000000000000010000000000000000000010000000000010000000000000000000001000000000000000000000000000000000100000010000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000010010100100001001010010111100101001011110011100111111001111110111100111111000000";
const EU: number[] = [194,8,209,8,225,8,240,8,256,8,271,8,287,8,302,8,318,8,333,8,395,8,411,8,426,8,442,8,457,8,473,8,488,8,504,8,519,8,202,21,232,21,248,21,264,21,279,21,294,21,310,21,326,21,388,21,403,21,418,21,434,21,450,21,465,21,480,21,496,21,512,21,194,35,209,35,225,35,240,35,256,35,271,35,287,35,302,35,318,35,333,35,395,35,411,35,426,35,442,35,457,35,473,35,488,35,504,35,519,35,202,48,217,48,232,48,248,48,264,48,279,48,294,48,310,48,326,48,341,48,372,48,403,48,418,48,496,48,512,48,194,61,209,61,225,61,240,61,256,61,271,61,287,61,302,61,318,61,333,61,349,61,426,61,442,61,457,61,473,61,488,61,504,61,519,61,93,75,202,75,217,75,232,75,264,75,279,75,294,75,310,75,326,75,418,75,434,75,450,75,465,75,480,75,496,75,512,75,54,88,70,88,85,88,209,88,225,88,271,88,287,88,302,88,318,88,395,88,426,88,442,88,457,88,473,88,488,88,504,88,519,88,46,102,62,102,78,102,93,102,108,102,279,102,294,102,310,102,326,102,418,102,434,102,450,102,465,102,480,102,496,102,512,102,54,115,70,115,85,115,101,115,240,115,287,115,302,115,318,115,395,115,426,115,442,115,457,115,473,115,488,115,504,115,519,115,62,129,78,129,93,129,232,129,248,129,279,129,294,129,310,129,326,129,388,129,403,129,418,129,434,129,450,129,465,129,480,129,496,129,512,129,54,142,85,142,101,142,240,142,256,142,271,142,287,142,380,142,395,142,411,142,426,142,442,142,457,142,473,142,488,142,504,142,519,142,31,155,46,155,78,155,93,155,108,155,232,155,248,155,388,155,403,155,418,155,434,155,450,155,465,155,480,155,496,155,512,155,39,169,54,169,101,169,116,169,240,169,287,169,333,169,349,169,364,169,380,169,395,169,411,169,426,169,442,169,457,169,473,169,488,169,504,169,519,169,16,182,31,182,46,182,108,182,124,182,232,182,248,182,264,182,279,182,294,182,310,182,326,182,341,182,356,182,372,182,388,182,403,182,418,182,434,182,450,182,465,182,480,182,496,182,512,182,23,196,39,196,54,196,85,196,101,196,116,196,132,196,209,196,225,196,240,196,256,196,271,196,287,196,302,196,318,196,333,196,349,196,364,196,380,196,395,196,411,196,426,196,442,196,457,196,473,196,488,196,504,196,519,196,16,209,31,209,46,209,93,209,108,209,124,209,140,209,186,209,202,209,217,209,232,209,248,209,264,209,279,209,294,209,310,209,326,209,341,209,356,209,372,209,388,209,403,209,418,209,434,209,450,209,465,209,480,209,496,209,512,209,8,223,23,223,70,223,85,223,101,223,116,223,132,223,178,223,194,223,209,223,225,223,240,223,256,223,271,223,287,223,302,223,318,223,333,223,349,223,364,223,380,223,395,223,411,223,426,223,442,223,457,223,473,223,488,223,504,223,519,223,93,236,108,236,124,236,140,236,170,236,186,236,202,236,217,236,232,236,248,236,264,236,279,236,294,236,310,236,326,236,341,236,356,236,372,236,388,236,403,236,418,236,434,236,450,236,465,236,480,236,496,236,512,236,70,249,85,249,163,249,178,249,194,249,209,249,225,249,240,249,256,249,271,249,287,249,302,249,318,249,333,249,349,249,364,249,380,249,395,249,411,249,426,249,442,249,457,249,473,249,488,249,504,249,519,249,108,263,140,263,155,263,170,263,186,263,202,263,217,263,232,263,248,263,264,263,279,263,294,263,310,263,326,263,341,263,356,263,372,263,388,263,403,263,418,263,434,263,450,263,465,263,480,263,496,263,512,263,116,276,132,276,147,276,163,276,178,276,194,276,209,276,225,276,240,276,256,276,271,276,287,276,302,276,318,276,333,276,349,276,364,276,380,276,395,276,411,276,426,276,442,276,457,276,473,276,488,276,504,276,519,276,93,290,108,290,124,290,140,290,155,290,170,290,186,290,202,290,217,290,232,290,248,290,264,290,279,290,294,290,310,290,326,290,341,290,356,290,372,290,388,290,403,290,418,290,434,290,450,290,465,290,480,290,496,290,512,290,101,303,116,303,132,303,147,303,163,303,178,303,194,303,209,303,225,303,240,303,256,303,271,303,287,303,302,303,318,303,333,303,349,303,364,303,380,303,395,303,411,303,426,303,442,303,457,303,473,303,488,303,504,303,519,303,108,316,124,316,140,316,155,316,170,316,186,316,202,316,217,316,232,316,248,316,264,316,279,316,294,316,310,316,326,316,341,316,356,316,372,316,388,316,403,316,418,316,434,316,450,316,465,316,480,316,496,316,512,316,132,330,147,330,163,330,178,330,194,330,209,330,225,330,240,330,256,330,271,330,287,330,302,330,318,330,333,330,349,330,364,330,380,330,395,330,411,330,426,330,442,330,457,330,473,330,124,343,140,343,155,343,170,343,186,343,202,343,217,343,232,343,248,343,264,343,294,343,310,343,326,343,341,343,356,343,372,343,388,343,403,343,418,343,434,343,450,343,465,343,480,343,116,357,132,357,147,357,163,357,178,357,194,357,209,357,225,357,256,357,271,357,318,357,333,357,349,357,364,357,380,357,395,357,411,357,426,357,442,357,457,357,31,370,46,370,62,370,78,370,93,370,108,370,124,370,140,370,155,370,170,370,186,370,202,370,264,370,279,370,326,370,341,370,356,370,372,370,388,370,403,370,418,370,434,370,450,370,23,384,39,384,54,384,70,384,85,384,101,384,116,384,132,384,147,384,163,384,240,384,271,384,287,384,349,384,364,384,380,384,395,384,411,384,426,384,442,384,31,397,46,397,62,397,78,397,93,397,108,397,124,397,140,397,155,397,279,397,294,397,310,397,372,397,388,397,403,397,418,397,434,397,450,397,39,410,54,410,70,410,85,410,101,410,116,410,132,410,240,410,302,410,318,410,333,410,364,410,380,410,395,410,411,410,442,410,488,410,504,410,519,410,31,424,46,424,62,424,78,424,93,424,108,424,124,424,232,424,310,424,326,424,372,424,388,424,450,424,465,424,480,424,496,424,512,424,23,437,39,437,54,437,70,437,85,437,101,437,116,437,240,437,333,437,380,437,395,437,411,437,442,437,457,437,473,437,488,437,504,437,519,437,31,451,46,451,62,451,78,451,93,451,108,451,124,451,310,451,372,451,388,451,403,451,450,451,465,451,480,451,496,451,512,451,39,464,54,464,70,464,85,464,101,464,302,464,395,464,457,464,473,464,488,464,504,464,519,464,62,478,155,478,170,478,186,478,202,478,217,478,232,478,248,478,403,478,480,478,512,478,132,491,147,491,163,491,178,491,194,491,209,491,225,491,240,491,256,491,411,491];
const EU_W = 520, EU_H = 491, PIN: [number, number] = [233, 254];


// ── helpers ──────────────────────────────────────────────────────────────────────────────────────────────────────
const S = (g: number, at: string) => (g - f(at)) / 30;                                   // seconds since a label
const seq = (g: number, init: number, steps: Array<[string, number, number, number]>) => { // additive springs: overshoot and settle
  let v = init, prev = init;
  for (const [at, to, r, d] of steps) { v += (to - prev) * aspring(g, at, r, d); prev = to; }
  return v;
};
const ez = (t: number) => INOUT(clamp01(t));
const ou = (t: number) => OUT(clamp01(t));
const TINT = "#D6E4DF";
const SAGE = [135, 168, 158], DEEP = [73, 93, 88];
const rgb = (a: number[], b: number[], q: number) => `rgb(${Math.round(mix(a[0], b[0], q))},${Math.round(mix(a[1], b[1], q))},${Math.round(mix(a[2], b[2], q))})`;

// ── the morphing body: a static box, clip-path inset + round = the capsule/circle/chip; moves by transform only ───
const BW = 640, BH = 380;
const Shape: React.FC<{ x: number; y: number; w: number; h: number; color: string; tf?: string; op?: number; sheen?: number; clipped?: React.ReactNode; over?: React.ReactNode }> =
  ({ x, y, w, h, color, tf = "", op = 1, sheen = -1, clipped, over }) => {
  const r = Math.min(w, h) / 2, ix = (BW - w) / 2, iy = (BH - h) / 2;
  return (
    <div style={{ position: "absolute", left: CX - BW / 2, top: CY - BH / 2, width: BW, height: BH, opacity: op, transform: `translate(${x - CX}px, ${y - CY}px) ${tf}` }}>
      <div style={{ position: "absolute", inset: 0, filter: "drop-shadow(0 16px 20px rgba(26,22,20,0.15))" }}>
        <div style={{ position: "absolute", inset: 0, background: color, clipPath: `inset(${iy}px ${ix}px round ${r}px)` }}>
          {sheen >= 0 && <div style={{ position: "absolute", inset: 0, background: `linear-gradient(105deg, rgba(255,255,255,0) ${mix(-30, 100, sheen)}%, rgba(255,255,255,0.46) ${mix(-18, 112, sheen)}%, rgba(255,255,255,0) ${mix(-6, 124, sheen)}%)` }} />}
          {clipped}
        </div>
      </div>
      {over}
    </div>
  );
};
const Mid: React.FC<{ children?: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", ...style }}>{children}</div>
);
/** a centred thing at (x, y): children centred on that point, transform only */
const At: React.FC<{ x: number; y: number; tf?: string; op?: number; raw?: boolean; children?: React.ReactNode }> = ({ x, y, tf = "", op = 1, raw, children }) => (
  <div style={{ position: "absolute", left: CX, top: CY, width: 0, height: 0, opacity: op, transform: `translate(${x - CX}px, ${y - CY}px) ${tf}` }}>
    {raw ? children : <div style={{ position: "absolute", left: 0, top: 0, transform: "translate(-50%, -50%)" }}>{children}</div>}
  </div>
);

// ── the dotted globe (fibonacci sphere, land from Natural Earth) ───────────────────────────────────────────────
const NG = 2200, GA = Math.PI * (3 - Math.sqrt(5));
const GP = Array.from({ length: NG }, (_, i) => { const z = 1 - (2 * (i + 0.5)) / NG; return { cl: Math.sqrt(1 - z * z), sl: z, lon: ((GA * i) % (2 * Math.PI)) - Math.PI, land: FLAGS[i] === "1" }; });
const Globe: React.FC<{ th: number; R: number; op: number }> = ({ th, R, op }) => {
  const tilt = 0.36, ct = Math.cos(tilt), st = Math.sin(tilt), out: React.ReactNode[] = [];
  for (let i = 0; i < NG; i++) {
    const p = GP[i], a = p.lon + th, x = p.cl * Math.sin(a), z0 = p.cl * Math.cos(a);
    const y2 = p.sl * ct - z0 * st, z2 = p.sl * st + z0 * ct;
    if (z2 < 0.03) continue;
    const rad = (p.land ? 5.6 : 1.9) * (0.45 + 0.55 * z2) * op;
    out.push(<circle key={i} cx={(x * R).toFixed(1)} cy={(-y2 * R).toFixed(1)} r={rad.toFixed(2)} fill={p.land ? "#749289" : C.sageLight} opacity={(0.4 + 0.6 * z2).toFixed(2)} />);
  }
  return <svg width={BW} height={BH} viewBox={`${-BW / 2} ${-BH / 2} ${BW} ${BH}`} style={{ position: "absolute", left: 0, top: 0 }}>{out}</svg>;
};
const CheckDisc: React.FC<{ size: number; p: number }> = ({ size, p }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: "block" }}>
    <circle cx="50" cy="50" r="50" fill={C.sage} />
    <path d="M28 52 L43 66 L72 35" fill="none" stroke="#fff" strokeWidth="8.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="64" strokeDashoffset={64 * (1 - clamp01(p))} />
  </svg>
);

// ── the lock: the shackle lifts open, then snaps shut ───────────────────────────────────────────────────────────
const Lock: React.FC<{ lift: number }> = ({ lift }) => (
  <svg width="80" height="100" viewBox="0 0 64 80" style={{ display: "block", overflow: "visible" }}>
    <path d="M17 46 V27 a15 15 0 0 1 30 0 V46" fill="none" stroke={C.sageDeep} strokeWidth="7" strokeLinecap="round" transform={`translate(0 ${-lift})`} />
    <rect x="6" y="34" width="52" height="40" rx="11" fill={C.sage} />
    <circle cx="32" cy="52" r="5.2" fill={C.white} /><rect x="30" y="54" width="4" height="9" rx="2" fill={C.white} />
  </svg>
);

// ── a calendar card whose year flips (split flap) ──────────────────────────────────────────────────────────────
const FW = 188, FH = 116;
const Half: React.FC<{ text: string; bottom?: boolean; style?: React.CSSProperties }> = ({ text, bottom, style }) => (
  <div style={{ position: "absolute", left: 0, top: bottom ? FH / 2 : 0, width: FW, height: FH / 2, overflow: "hidden", background: C.white, backfaceVisibility: "hidden", ...style }}>
    <div style={{ position: "absolute", left: 0, top: bottom ? -FH / 2 : 0, width: FW, height: FH, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SERIF, fontSize: 74, letterSpacing: "-0.03em", color: C.ink }}>{text}</div>
  </div>
);
const Flip: React.FC<{ a: string; b: string; ang1: number; ang2: number }> = ({ a, b, ang1, ang2 }) => (
  <div style={{ position: "relative", width: FW, height: FH, perspective: 520 }}>
    <Half text={b} />
    <Half text={a} bottom />
    <Half text={a} style={{ transformOrigin: "50% 100%", transform: `rotateX(${ang1}deg)`, display: ang1 <= -89.9 ? "none" : undefined, filter: `brightness(${1 + ang1 / 500})` }} />
    <Half text={b} bottom style={{ transformOrigin: "50% 0%", transform: `rotateX(${ang2}deg)`, display: ang2 >= 89.9 ? "none" : undefined }} />
    <div style={{ position: "absolute", left: 0, top: FH / 2 - 1, width: FW, height: 2, background: "rgba(26,22,20,0.10)" }} />
  </div>
);

// ── the pin ─────────────────────────────────────────────────────────────────────────────────────────────────────
const Pin: React.FC<{ tail: number; col: string }> = ({ tail, col }) => (
  <svg width="60" height="80" viewBox="-30 -64 60 80" style={{ display: "block", overflow: "visible" }}>
    <path d={`M0 0 C -6 -14, -21 -${20 * tail + 18 * (1 - tail)}, -21 -40 a21 21 0 1 1 42 0 C 21 -${20 * tail + 18 * (1 - tail)}, 6 -14, 0 0 Z`} fill={col} />
    <circle cx="0" cy="-40" r="7.5" fill={C.white} />
  </svg>
);

// ── the chain: two stadium links, over-under at the crossings ──────────────────────────────────────────────────
const LW = 210, LH = 80, SW = 14, LX = 78;
const linkPath = (cx: number) => { const w = LW - SW, h = LH - SW, r = h / 2; return `M ${cx - w / 2 + r} ${-h / 2} H ${cx + w / 2 - r} A ${r} ${r} 0 0 1 ${cx + w / 2 - r} ${h / 2} H ${cx - w / 2 + r} A ${r} ${r} 0 0 1 ${cx - w / 2 + r} ${-h / 2} Z`; };
const Link: React.FC<{ clipX?: number }> = ({ clipX }) => (
  <svg width={LW + 40} height={LH + 40} viewBox={`${-(LW + 40) / 2} ${-(LH + 40) / 2} ${LW + 40} ${LH + 40}`} style={{ display: "block", overflow: "visible" }}>
    {clipX !== undefined && <clipPath id="topx"><rect x={clipX - 26} y={-60} width={52} height={60} /></clipPath>}
    <path d={linkPath(0)} fill="none" stroke={C.sage} strokeWidth={SW} strokeLinejoin="round" clipPath={clipX !== undefined ? "url(#topx)" : undefined} />
  </svg>
);

// ── the scene ───────────────────────────────────────────────────────────────────────────────────────────────────
const main = (g: number) => ({
  x: seq(g, 1160, [["h3+0.25", 960, 0.55, 0.8], ["w:ogs-0.02", 848, 0.5, 0.7], ["w:domnet-0.05", 960, 0.5, 0.7]]),
  y: seq(g, 540, [["h3+0.25", 466, 0.55, 0.8], ["w:fra-0.12", 540, 0.5, 0.7], ["w:fast-0.4", 576, 0.4, 0.8], ["w:ogs-0.02", 540, 0.45, 0.8], ["w:domnet-0.05", 500, 0.5, 0.7], ["w:servere-0.04", 290, 0.32, 0.8]]),
  w: Math.max(2, seq(g, 200, [["h3+0.3", 340, 0.42, 0.62], ["w:fra-0.12", 480, 0.45, 0.62], ["w:domnet-0.05", 480, 0.45, 0.62], ["w:servere-0.04", 46, 0.3, 0.8]])),
  h: Math.max(2, seq(g, 60, [["h3+0.3", 340, 0.42, 0.62], ["w:fra-0.12", 140, 0.45, 0.62], ["w:domnet-0.05", 118, 0.45, 0.62], ["w:servere-0.04", 46, 0.3, 0.8]])),
  tint: clamp01(seq(g, 0, [["h3+0.5", 1, 0.3, 1], ["w:fra-0.12", 0, 0.3, 1]])),
});

export const Scene4: React.FC<{ g: number }> = ({ g }) => {
  if (g <= f("h3") + HANDOFF_HALF) return <Handoff g={g} at="h3" />;
  if (g >= f("h4") - HANDOFF_HALF) return <Handoff g={g} at="h4" />;
  const t = (at: string) => S(g, at);
  const sec = g / 30;
  const M = main(g), Mp = main(g - 1);
  const phaseMap = g >= f("w:servere-0.04");          // from here the body is the dot that becomes the pin
  const body = M;

  // ── globe + ring + check ──
  const t0 = t("h3+0.25");
  const ringP = ez(t("w:vi") / 1.35), ringIn = bounce(g, "w:vi-0.08", 0.4, 0.6), ringOut = ez(t("w:fra-0.12") / 0.3);
  const th = 1.3 * t0 + 4 * ou(t0 / 1.4) + 7.5 * ringP;
  const chkP = bounce(g, "w:vi+1.38", 0.4, 0.55), chkDraw = clamp01(t("w:vi+1.42") / 0.25), chkOut = clamp01(t("w:fra-0.12") / 0.12);
  const dotsOp = ou(t("h3+0.55") / 0.3) * (1 - clamp01(t("w:fra-0.12") / 0.14)) * (1 - 0.72 * clamp01(chkP));
  const globeStage = g < f("w:fra") + 8;
  const RR = 190, RL = 2 * Math.PI * RR;

  // ── the price ──
  const pcIn = ou(t("w:fra") / 0.3), pcOut = clamp01(t("w:domnet-0.05") / 0.2);
  const qKr = ou(t("w:kroner2") / 0.35), qMd = ou(t("w:mneden") / 0.4);
  const shift = (84 * (1 - qKr) + 98 * (1 - qMd)) / 2;
  // ── the domain chip ──
  const dIn = ou(t("w:domnet-0.02") / 0.3), dOut = clamp01(t("w:servere-0.1") / 0.15);

  // pulse on events (a quick dip of the body)
  const pulse = 0.05 * press(g, "w:domne", 0.03) + 0.07 * press(g, "w:fast-0.02", 0.04) + 0.05 * press(g, "w:ogs-0.1", 0.03) + 0.05 * press(g, "w:domnet-0.02", 0.03);
  const vx = M.x - Mp.x, vy = M.y - Mp.y;
  const trav = g < f("h3") + 40 ? squash(vx, vy) : "";
  const roll = -180 * (1 - aspring(g, "h3+0.25", 0.55, 0.8));
  const sway = float(g, 0.3, 1.3 * ou(t0 / 0.5));
  const tf = `rotate(${roll}deg) ${trav} perspective(1400px) ${sway} scale(${1 + pulse * 0.4}, ${1 - pulse})`;
  const sheenPhase = (((g - f("h3") - HANDOFF_HALF) / 30) * 1.05) % 1;
  const bodyColor = `color-mix(in srgb, ${TINT} ${(body.tint * 100).toFixed(1)}%, ${C.sage})`;

  // ── chips (31.58 → 33.0) ──
  const chip = (at: string, tuckAt: string, P1: [number, number], Pc: [number, number], seed: number) => {
    const u = bounce(g, at, 0.5, 0.58), tk = ez(t(tuckAt) / 0.3);
    const bx = (1 - u) * (1 - u) * 0 + 2 * (1 - u) * u * Pc[0] + u * u * P1[0], by = 2 * (1 - u) * u * Pc[1] + u * u * P1[1];
    const bobY = 5 * Math.sin(sec * 2.3 + seed);
    return { x: 960 + bx * (1 - tk), y: 540 + by * (1 - tk) + bobY * (1 - tk), s: (0.25 + 0.75 * Math.min(1.1, clamp01(u) + Math.max(0, u - 1))) * (1 - 0.8 * tk), op: clamp01(u * 3) * (1 - clamp01((tk - 0.4) / 0.6)) };
  };
  const showChips = g >= f("w:domne") - 1 && g < f("w:med-0.12") + 12;
  // ── the lock (33.27) ──
  const lockP = bounce(g, "w:fast-0.2", 0.42, 0.55), snap = bounce(g, "w:fast+0.0", 0.3, 0.5), lockTuck = ez(t("w:ogs-0.12") / 0.22);
  const showLock = g >= f("w:fast-0.2") - 1 && g < f("w:ogs-0.12") + 8;
  const lockY = 576 - 70 - 6 - 50 - 300 * (1 - lockP) + 120 * lockTuck, lockS = 1 - 0.85 * lockTuck;
  // ── the year (34.3 → 35.3) ──
  const cp = bounce(g, "w:ogs", 0.45, 0.58), cTuck = ez(t("w:domnet-0.14") / 0.26);
  const f1 = "w:du4+0.03", f2 = "w:fornyer+0.37";
  const yearsAt = (base: string, off: number) => ({ ang1: -90 * EXIT(clamp01(S(g, `${base}+${off.toFixed(2)}`) / 0.2)), ang2: 90 * (1 - aspring(g, `${base}+${(off + 0.19).toFixed(2)}`, 0.3, 0.5)) });
  let ya = "2027", yb = "2027", fl = { ang1: 0, ang2: 90 };
  if (g >= f(f2) + 20) { ya = yb = "2029"; } else if (g >= f(f2)) { ya = "2028"; yb = "2029"; fl = yearsAt("w:fornyer", 0.37); } else if (g >= f(f1) + 20) { ya = yb = "2028"; } else if (g >= f(f1)) { ya = "2027"; yb = "2028"; fl = yearsAt("w:du4", 0.03); }
  const showYear = g >= f("w:ogs") - 1 && g < f("w:domnet-0.14") + 10;
  const cardX = mix(940, 1206, cp) * (1 - cTuck) + 960 * cTuck, cardS = (0.3 + 0.7 * Math.min(1.1, cp)) * (1 - 0.85 * cTuck);
  // ── the tag (36.2) ──
  const tg = t("w:dit-0.05"), tagIn = bounce(g, "w:dit-0.05", 0.4, 0.58), tagOut = ez(t("w:servere-0.1") / 0.18);
  const tagAng = tg > 0 ? 38 * Math.exp(-2.7 * tg) * Math.cos(2 * Math.PI * 1.45 * tg) : 0;
  const showTag = g >= f("w:dit-0.05") - 1 && g < f("w:servere-0.1") + 8;
  // ── the pin + the map (37.0 → 38.1) ──
  const pinAt = "w:servere+0.2", pd = bounce(g, pinAt, 0.38, 0.55), tm = t("w:servere+0.3");
  const MX = CX - EU_W / 2, MY = CY - EU_H / 2 - 40, PX = MX + PIN[0], PY = MY + PIN[1];
  const colT = ez(t("w:ingen3-0.4") / 0.34);      // the collapse into the chain
  const showMap = g >= f(pinAt) && g < f("w:ingen3") + 14;
  const P0 = main(f(pinAt)), pinTipY = PY - (PY - (P0.y + 40)) * (1 - pd), pinX = mix(P0.x, PX, clamp01(pd)), pinTail = clamp01(t(pinAt) / 0.12);
  const pinCol = rgb(SAGE, DEEP, ez(t(pinAt) / 0.25));
  const pinScale = (1 + 0.06 * Math.sin(sec * 6.9)) * (1 - colT);
  // ── the chain (38.2 → 38.97): two links, one of which becomes the capsule ──
  const chIn = bounce(g, "w:ingen3-0.25", 0.38, 0.58), tens = ez(t("w:ingen3+0.02") / 0.23), tb = Math.max(0, t("w:ingen3+0.25"));
  const sA = aspring(g, "w:ingen3+0.25", 0.2, 0.55), sB = aspring(g, "w:ingen3+0.25", 0.22, 0.6), lk = clamp01((g - (f("h4") - HANDOFF_HALF - 3.5)) / 3);
  const cs = (0.3 + 0.7 * Math.min(1.12, chIn)) * (1.25 - 0.25 * clamp01(tb / 0.2)), chOp = clamp01(chIn * 3);
  const phi = 3.2 * Math.sin(sec * 9) * tens * (1 - clamp01(tb / 0.08)) + 4 * Math.sin(sec * 2.2) * (1 - tens), dA = LX + 8 * tens;
  const co = Math.cos((phi * Math.PI) / 180), si = Math.sin((phi * Math.PI) / 180);
  const xA0 = 960 - dA * cs * co, yA0 = 530 - dA * cs * si, xB0 = 960 + dA * cs * co, yB0 = 530 + dA * cs * si;
  const xA = mix(xA0 + (760 - xA0) * sA, 760, lk), yA = mix(yA0 + (540 - yA0) * sA, 540, lk);
  const xB = xB0 + 250 * sB, yB = yB0 + 2200 * tb * tb - 420 * tb;
  const sf = clamp01((tb - 0.12) / 0.1), bOp = 1 - clamp01((tb - 0.1) / 0.14);
  const showChain = g >= f("w:ingen3-0.25") - 1;

  return (
    <>
      {/* chips behind the body so they come out of it */}
      {showChips && [
        { c: chip("w:domne", "w:med-0.25", [-250, -120], [-60, -210], 0), text: "holmfysio.dk", icon: "globe" },
        { c: chip("w:email", "w:med-0.12", [250, 120], [80, 220], 2), text: "@holmfysio.dk", icon: "mail" },
      ].map(({ c, text, icon }, i) => (
        <At key={i} x={c.x} y={c.y} op={c.op} tf={`scale(${c.s})`}><Chip text={text} icon={icon} size={27} /></At>
      ))}
      {showLock && (
        <At x={960} y={lockY} op={clamp01(lockP * 4)} tf={`scale(${lockS})`}><Lock lift={14 * (1 - snap)} /></At>
      )}
      {showTag && (
        <div style={{ position: "absolute", left: CX, top: CY, width: 0, height: 0, opacity: 1 - tagOut, transform: `translate(0px, ${500 + 59 - 8 - CY}px) rotate(${tagAng}deg) scale(${(0.5 + 0.5 * Math.min(1.1, tagIn)) * (1 - 0.7 * tagOut)})`, transformOrigin: "0 0" }}>
          <div style={{ position: "absolute", left: -1, top: 0, width: 2, height: 26, background: C.sage }} />
          <div style={{ position: "absolute", left: -98, top: 24, width: 196, height: 60, borderRadius: 18, background: C.white, border: `1px solid ${C.line}`, boxShadow: "0 12px 24px -12px rgba(26,22,20,0.30)",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 10, fontFamily: SANS, fontWeight: 500, fontSize: 28, color: C.ink, whiteSpace: "nowrap" }}>
            <Ico n="user" s={28} c={C.sageDeep} w={2.2} />Ejer: dig
          </div>
        </div>
      )}
      {showYear && (
        <At x={cardX} y={M.y + 6 * Math.sin(sec * 2.1 + 1)} op={clamp01(cp * 4) * (1 - clamp01((cTuck - 0.5) * 2))} tf={`scale(${cardS})`}>
          <div style={{ width: FW, borderRadius: 18, overflow: "hidden", background: C.white, border: `1px solid ${C.line}`, boxShadow: "0 16px 30px -14px rgba(26,22,20,0.30)" }}>
            <div style={{ height: 30, background: C.sage, display: "flex", justifyContent: "space-around", alignItems: "center", padding: "0 40px" }}>
              <div style={{ width: 9, height: 9, borderRadius: 5, background: C.bg }} /><div style={{ width: 9, height: 9, borderRadius: 5, background: C.bg }} />
            </div>
            <Flip a={ya} b={yb} ang1={fl.ang1} ang2={fl.ang2} />
          </div>
        </At>
      )}

      {/* the body: capsule → globe → price capsule → domain chip → dot */}
      {g < f(pinAt) && (
        <Shape x={M.x} y={M.y} w={M.w} h={M.h} color={bodyColor} tf={tf} op={1} sheen={body.tint < 0.5 && !phaseMap ? sheenPhase : -1}
          clipped={<>
            {globeStage && <>
              <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 50%, rgba(135,168,158,0) 52%, rgba(135,168,158,0.42) 100%)", opacity: dotsOp }} />
              <Globe th={th} R={0.474 * Math.min(M.w, M.h)} op={0.6 + 0.4 * dotsOp} />
              <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 36% 28%, rgba(255,255,255,0.32), rgba(255,255,255,0) 46%)", opacity: dotsOp }} />
            </>}
            {g >= f("w:fra") - 2 && g < f("w:domnet-0.05") + 14 && (
              <Mid style={{ opacity: pcIn * (1 - pcOut), filter: pcIn < 1 || pcOut > 0 ? `blur(${(1 - pcIn) * 8 + pcOut * 8}px)` : undefined }}>
                <div style={{ display: "flex", alignItems: "center", transform: `translateX(${shift}px)`, color: C.ink }}>
                  <RollNumber value={83} p={k(g, "w:83", 1.0)} size={100} color={C.ink} />
                  <span style={{ marginLeft: 12, fontFamily: SANS, fontWeight: 500, fontSize: 46, opacity: qKr, transform: `translateX(${(1 - qKr) * -14}px)`, filter: qKr < 1 ? `blur(${(1 - qKr) * 6}px)` : undefined }}>kr.</span>
                  <span style={{ marginLeft: 3, fontFamily: SANS, fontWeight: 500, fontSize: 46, opacity: qMd * 0.62, transform: `translateX(${(1 - qMd) * -18}px)`, filter: qMd < 1 ? `blur(${(1 - qMd) * 6}px)` : undefined }}>/md.</span>
                </div>
              </Mid>
            )}
            {g >= f("w:domnet-0.05") - 2 && g < f("w:servere") + 4 && (
              <Mid style={{ opacity: dIn * (1 - dOut), filter: dIn < 1 ? `blur(${(1 - dIn) * 8}px)` : undefined }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16, transform: `translateX(${(1 - dIn) * 16}px)` }}>
                  <div style={{ width: 64, height: 64, borderRadius: 32, background: C.white, display: "flex", alignItems: "center", justifyContent: "center" }}><Ico n="globe" s={40} c={C.sageDeep} w={2.1} /></div>
                  <span style={{ fontFamily: SANS, fontWeight: 500, fontSize: 46, letterSpacing: "-0.01em", color: C.ink }}>holmfysio.dk</span>
                </div>
              </Mid>
            )}
          </>}
          over={globeStage && (
            <>
              <svg width={BW} height={BH} viewBox={`${-BW / 2} ${-BH / 2} ${BW} ${BH}`} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: clamp01(ringIn * 3) * (1 - ringOut),
                transform: `scale(${(0.9 + 0.1 * Math.min(1.1, ringIn)) * (1 - 0.4 * ringOut)})` }}>
                <circle cx="0" cy="0" r={RR} fill="none" stroke={C.line} strokeWidth="10" />
                <circle cx="0" cy="0" r={RR} fill="none" stroke={C.sage} strokeWidth="10" strokeLinecap="round" strokeDasharray={RL} strokeDashoffset={RL * (1 - ringP)} transform="rotate(-90)" />
                {ringP > 0.01 && ringP < 0.995 && <circle cx={RR * Math.cos(-Math.PI / 2 + 2 * Math.PI * ringP)} cy={RR * Math.sin(-Math.PI / 2 + 2 * Math.PI * ringP)} r="8" fill={C.sageDeep} stroke={C.white} strokeWidth="3" />}
              </svg>
              {chkP > 0 && (
                <div style={{ position: "absolute", left: BW / 2 - 64, top: BH / 2 - 64, opacity: (1 - chkOut) * clamp01(chkP * 3), transform: `scale(${(0.3 + 0.7 * chkP) * (1 - 0.6 * chkOut)})` }}>
                  <CheckDisc size={128} p={chkDraw} />
                </div>
              )}
            </>
          )} />
      )}

      {/* lines */}
      {g >= f("w:p") - 2 && g < f("w:vi") + 12 && <Line text="på nettet?" y={748} p={k(g, "w:p", 0.9)} out={k(g, "w:vi", 0.3)} italicWords={["nettet"]} />}
      {g >= f("w:kroner2+0.35") - 1 && g < f("w:domne") + 6 && <Line text="faktureres årligt" y={668} size={24} serif={false} color={C.muted} p={k(g, "w:kroner2+0.35", 0.45)} out={k(g, "w:domne-0.1", 0.25)} />}
      {g >= f("w:i2") - 2 && g < f("w:ingen3-0.4") + 10 && <Line text="Servere i Europa." y={826} size={68} p={k(g, "w:i2", 0.8)} out={k(g, "w:ingen3-0.42", 0.28)} italicWords={["Europa"]} />}

      {/* Europe */}
      {showMap && (
        <>
          <svg width={EU_W} height={EU_H} style={{ position: "absolute", left: MX, top: CY - EU_H / 2, overflow: "visible", transform: "translateY(-40px)" }}>
            {Array.from({ length: EU.length / 2 }, (_, i) => {
              const x = EU[2 * i], y = EU[2 * i + 1], d = Math.hypot(x - PIN[0], y - PIN[1]);
              const rr = Math.hypot((x - EU_W / 2) / (EU_W / 2), (y - EU_H / 2) / (EU_H / 2)), vig = clamp01((1.34 - rr) / 0.3);
              if (vig <= 0.02) return null;
              const ap = ou((tm - 0.04 - d / 620) / 0.3);
              if (ap <= 0) return null;
              const wave = Math.sin(2 * Math.PI * (sec * 0.95 - d / 230));
              const dc = Math.hypot(x - EU_W / 2, y - (EU_H / 2 + 30)), cdelay = (dc / 330) * 0.1;
              const cq = ez((t("w:ingen3-0.4") - cdelay) / 0.26);
              const px = mix(x, EU_W / 2, cq), py = mix(y, EU_H / 2 + 30, cq);
              const r = 5.3 * vig * (0.3 + 0.7 * ap) * (1 + 0.26 * wave * ap) * (1 - cq);
              return <circle key={i} cx={px.toFixed(1)} cy={py.toFixed(1)} r={Math.max(0, r).toFixed(2)} fill={rgb(SAGE, DEEP, 0.38 * Math.max(0, wave))} opacity={Math.min(1, ap * (0.7 + 0.3 * vig))} />;
            })}
          </svg>
          {/* pulse rings on the pin */}
          {[0, 0.5].map((o, i) => {
            const u = (((tm - 0.1) * 1.05 + o) % 1 + 1) % 1, on = tm > 0.05 ? 1 : 0;
            return <At key={i} x={PX} y={PY} op={on * (1 - u) * 0.7 * (1 - colT)} tf={`scale(${(0.25 + 1.5 * u).toFixed(3)}, ${(0.12 + 0.55 * u).toFixed(3)})`}>
              <div style={{ width: 150, height: 150, borderRadius: 75, border: `5px solid ${C.sageDeep}` }} />
            </At>;
          })}
          <At raw x={pinX + (960 - pinX) * colT} y={pinTipY + (530 - pinTipY) * colT} tf={`scale(${pinScale})`}>
            <div style={{ position: "absolute", left: -30, top: -64 }}><Pin tail={pinTail} col={pinCol} /></div>
          </At>
        </>
      )}

      {/* the chain: two links, one of which becomes the capsule */}
      {showChain && (
        <>
          <At x={xA} y={yA} op={chOp * (1 - sf)} tf={`rotate(${phi}deg) scale(${cs})`}><Link /></At>
          <At x={xB} y={yB} op={chOp * bOp} tf={`rotate(${phi + 160 * tb}deg) scale(${cs})`}><Link /></At>
          {tb < 0.2 && <At x={xA} y={yA} op={chOp * (1 - sf)} tf={`rotate(${phi}deg) scale(${cs})`}><Link clipX={dA} /></At>}
          {sf > 0 && <div style={{ position: "absolute", inset: 0, opacity: sf }}><Pill x={xA} y={yA} /></div>}
        </>
      )}
    </>
  );
};
