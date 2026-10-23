// Scene 4 (h3 to h4), revision 1: hosting, big and always working. One sage capsule morphs: a turning globe, the setup
// ring, the price, two docking cards, a lock, a year flip, the domain, a Europe map with pulsing servers, a chain that
// snaps. One object at a time on plain cream; the motion is the content (continents turning, digits rolling, cards
// flying, pins pulsing, data travelling), never sway. Transforms and clip-path only.
import React from "react";
import { C, EXIT, INOUT, OUT, SANS, SERIF, clamp01, mix } from "../lib";
import { Ico, aspring, bounce, f, k, press, squash, typed } from "../shared";
import { Img, staticFile } from "remotion";
import { CX, CY, HANDOFF_HALF, Line, NEW_HEADLINE, Stage, StageHandoff } from "../v5";

const FLAGS = "000000000000000000010010000000000001000010010000100001001100100010000100001001110000001100111111111111001001000111011110010010110101101001011011010110101101001011010111111111011111110101001111011011100111101101111011010100111001001110011111110111001001010011100100111001100010011110100111001100111011100100101001101110011100110011001110010011100111011001110010010100111011011110011101100111001011110011111100111001011110011100100111001110110011100101111001110010011100101011001110010011100111011001100010101100111011001110010101100110001010110011101100110001011110011100101011001100010011000101011001110010011100100011001110010101000111001001110010001100110001010110010000100011001000100011000100111001000110011100101011001000010011000101011001100010011100101001001100010111100110001000110010101100110001011110010000100110001010110011100100011001010010011000101011001010010011100101001001010010101100101001001110010100100101001000110010100100111001010010010100100110001010110010100101001001010010011100101000001010010101100101000001110010100100101000001110010100000101001010010010100000101001010010010100000111001010110010100101001001010000000100101001001010000101000001000000010010100100101010100110000100100001001010010010100000001001010110010100001011000010000000100101011001010000000100001000001010000100000001000000010000101100101000011010000100000101001010010000100000001000010100010100001001000010000000100101000000010100000100001010001010000100100001000000010000100100001010000010000100000001001010010000101000001000010000000101001101000010100000100001001001010100000100001000000010100100100001010000010000100000101010000010000000000001010010010010101000101010000000000101000001000000100010101000000000010100000100000000000010100000100001010001010100000000001010001010000001000101010000000000101000001010000000000101000001000010100010101000000001010100000101000010000010100000000001010000010100010000101010000010100001000001010000000000101000101010001000000101000000010001100000101000000000011100000101000110001010100000001001010000010100010000001010000000100001000001010000000100101000001010000000000101000000010000100000101000000000010100000101000000000010100000001001010000010100000000001010000000100001000001010001010000101000001010001000000101000100010010100000101000000000010100010001000100000011100010100001010000010100000000001010001000100000000001010001000000101000100010001000000101000101000010000000101000100000010100010001000100000010100010000001010001000100010000001010001010000010000101010001000000101000100010001000000101000100000011100010001000100000010100010000000100001010100010000001010001000000010000001010001000000010000100010001000000101000100000001000000101000100000000100010000000100000010100010000000100001000100010000001010001000000010000001010000000000001000100000001000000101000000000001000000000000000000000100000000000100000000100000000000110000000000000000000010000001000010000000000000000000001000000000000000000000000000000001000000000000000000000100000000000000000000000000000000010000001000000000000000000000000000000000000000000000001000000000000000000000000000000000100000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100010001000010010100100000001010010010100101001001010010111101111001011010010110101111001111110111100111111011111011111100111111011110111111000000000";
const EU: number[] = [376,11,398,11,419,11,441,11,462,11,484,11,505,11,527,11,548,11,570,11,591,11,613,11,828,11,849,11,871,11,892,11,914,11,935,11,957,11,978,11,1000,11,344,29,366,29,387,29,408,29,430,29,473,29,494,29,516,29,538,29,559,29,580,29,602,29,731,29,752,29,774,29,796,29,817,29,838,29,860,29,882,29,903,29,924,29,946,29,968,29,989,29,355,48,376,48,398,48,419,48,484,48,505,48,527,48,548,48,570,48,720,48,742,48,763,48,785,48,806,48,828,48,849,48,871,48,892,48,914,48,935,48,957,48,978,48,1000,48,108,67,150,67,172,67,387,67,473,67,494,67,516,67,538,67,559,67,688,67,731,67,752,67,774,67,796,67,817,67,838,67,860,67,882,67,903,67,924,67,946,67,968,67,989,67,140,85,161,85,484,85,505,85,527,85,548,85,570,85,613,85,742,85,763,85,785,85,806,85,828,85,849,85,871,85,892,85,914,85,935,85,957,85,978,85,1000,85,108,104,129,104,150,104,172,104,194,104,452,104,494,104,516,104,538,104,559,104,580,104,602,104,688,104,731,104,752,104,774,104,796,104,817,104,838,104,860,104,882,104,903,104,924,104,946,104,968,104,989,104,118,122,140,122,161,122,183,122,419,122,441,122,505,122,527,122,548,122,677,122,699,122,720,122,742,122,763,122,785,122,806,122,828,122,849,122,871,122,892,122,914,122,935,122,957,122,978,122,1000,122,129,141,150,141,172,141,408,141,430,141,452,141,494,141,516,141,538,141,559,141,666,141,688,141,710,141,731,141,752,141,774,141,796,141,817,141,838,141,860,141,882,141,903,141,924,141,946,141,968,141,989,141,118,160,161,160,183,160,419,160,441,160,462,160,484,160,505,160,677,160,699,160,720,160,742,160,763,160,785,160,806,160,828,160,849,160,871,160,892,160,914,160,935,160,957,160,978,160,1000,160,86,178,150,178,172,178,194,178,430,178,452,178,473,178,666,178,688,178,710,178,731,178,752,178,774,178,796,178,817,178,838,178,860,178,882,178,903,178,924,178,946,178,968,178,989,178,75,197,97,197,118,197,183,197,204,197,419,197,441,197,505,197,591,197,613,197,656,197,677,197,699,197,720,197,742,197,763,197,785,197,806,197,828,197,849,197,871,197,892,197,914,197,935,197,957,197,978,197,1000,197,43,216,64,216,86,216,108,216,150,216,194,216,215,216,236,216,430,216,452,216,494,216,516,216,559,216,580,216,602,216,624,216,645,216,666,216,688,216,710,216,731,216,752,216,774,216,796,216,817,216,838,216,860,216,882,216,903,216,924,216,946,216,968,216,989,216,54,234,75,234,97,234,183,234,204,234,226,234,376,234,398,234,419,234,441,234,462,234,484,234,505,234,527,234,548,234,570,234,591,234,613,234,634,234,656,234,677,234,699,234,720,234,742,234,763,234,785,234,806,234,828,234,849,234,871,234,892,234,914,234,935,234,957,234,978,234,1000,234,64,253,86,253,108,253,150,253,172,253,194,253,215,253,236,253,366,253,387,253,408,253,430,253,452,253,473,253,494,253,516,253,538,253,559,253,580,253,602,253,624,253,645,253,666,253,688,253,710,253,731,253,752,253,774,253,796,253,817,253,838,253,860,253,882,253,903,253,924,253,946,253,968,253,989,253,54,271,75,271,97,271,161,271,183,271,204,271,226,271,247,271,269,271,333,271,355,271,376,271,398,271,419,271,441,271,462,271,484,271,505,271,527,271,548,271,570,271,591,271,613,271,634,271,656,271,677,271,699,271,720,271,742,271,763,271,785,271,806,271,828,271,849,271,871,271,892,271,914,271,935,271,957,271,978,271,1000,271,43,290,64,290,86,290,150,290,172,290,194,290,215,290,236,290,258,290,322,290,344,290,366,290,387,290,408,290,430,290,452,290,473,290,494,290,516,290,538,290,559,290,580,290,602,290,624,290,645,290,666,290,688,290,710,290,731,290,752,290,774,290,796,290,817,290,838,290,860,290,882,290,903,290,924,290,946,290,968,290,989,290,183,309,204,309,226,309,247,309,269,309,312,309,333,309,355,309,376,309,398,309,419,309,441,309,462,309,484,309,505,309,527,309,548,309,570,309,591,309,613,309,634,309,656,309,677,309,699,309,720,309,742,309,763,309,785,309,806,309,828,309,849,309,871,309,892,309,914,309,935,309,957,309,978,309,1000,309,150,327,172,327,194,327,215,327,280,327,301,327,322,327,344,327,366,327,387,327,408,327,430,327,452,327,473,327,494,327,516,327,538,327,559,327,580,327,602,327,624,327,645,327,666,327,688,327,710,327,731,327,752,327,774,327,796,327,817,327,838,327,860,327,882,327,903,327,924,327,946,327,968,327,989,327,140,346,290,346,312,346,333,346,355,346,376,346,398,346,419,346,441,346,462,346,484,346,505,346,527,346,548,346,570,346,591,346,613,346,634,346,656,346,677,346,699,346,720,346,742,346,763,346,785,346,806,346,828,346,849,346,871,346,892,346,914,346,935,346,957,346,978,346,1000,346,215,365,258,365,280,365,301,365,322,365,344,365,366,365,387,365,408,365,430,365,452,365,473,365,494,365,516,365,538,365,559,365,580,365,602,365,624,365,645,365,666,365,688,365,710,365,731,365,752,365,774,365,796,365,817,365,838,365,860,365,882,365,903,365,924,365,946,365,968,365,989,365,226,383,247,383,269,383,290,383,312,383,333,383,355,383,376,383,398,383,419,383,441,383,462,383,484,383,505,383,527,383,548,383,570,383,591,383,613,383,634,383,656,383,677,383,699,383,720,383,742,383,763,383,785,383,806,383,828,383,849,383,871,383,892,383,914,383,935,383,957,383,978,383,1000,383,150,402,172,402,194,402,215,402,236,402,258,402,280,402,301,402,322,402,344,402,366,402,387,402,408,402,430,402,452,402,473,402,494,402,516,402,538,402,559,402,580,402,602,402,624,402,645,402,666,402,688,402,710,402,731,402,752,402,774,402,796,402,817,402,838,402,860,402,882,402,903,402,924,402,946,402,968,402,989,402,183,420,204,420,226,420,247,420,269,420,290,420,312,420,333,420,355,420,376,420,398,420,419,420,441,420,462,420,484,420,505,420,527,420,548,420,570,420,591,420,613,420,634,420,656,420,677,420,699,420,720,420,742,420,763,420,785,420,806,420,828,420,849,420,871,420,892,420,914,420,935,420,957,420,978,420,1000,420,215,439,236,439,258,439,280,439,301,439,322,439,344,439,366,439,387,439,408,439,430,439,452,439,473,439,494,439,516,439,538,439,559,439,580,439,602,439,624,439,645,439,666,439,688,439,710,439,731,439,752,439,774,439,796,439,817,439,838,439,860,439,882,439,903,439,924,439,946,439,968,439,989,439,226,458,247,458,269,458,290,458,312,458,333,458,355,458,376,458,398,458,419,458,441,458,462,458,484,458,505,458,527,458,548,458,570,458,591,458,613,458,634,458,656,458,677,458,699,458,720,458,742,458,763,458,785,458,806,458,828,458,849,458,892,458,914,458,935,458,1000,458,215,476,236,476,258,476,280,476,301,476,322,476,344,476,366,476,387,476,408,476,430,476,452,476,473,476,494,476,516,476,538,476,559,476,580,476,602,476,624,476,645,476,666,476,688,476,710,476,731,476,752,476,774,476,796,476,817,476,838,476,924,476,226,495,247,495,269,495,290,495,312,495,333,495,355,495,376,495,398,495,419,495,441,495,462,495,484,495,527,495,548,495,570,495,591,495,613,495,634,495,656,495,677,495,699,495,720,495,742,495,763,495,785,495,806,495,828,495,914,495,935,495,957,495,978,495,1000,495,215,513,236,513,258,513,280,513,301,513,322,513,344,513,366,513,387,513,408,513,430,513,452,513,473,513,559,513,580,513,602,513,624,513,645,513,666,513,688,513,710,513,731,513,752,513,774,513,796,513,226,532,247,532,269,532,290,532,312,532,333,532,355,532,376,532,398,532,462,532,484,532,548,532,570,532,591,532,613,532,634,532,656,532,677,532,699,532,720,532,742,532,763,532,785,532,806,532,64,551,86,551,108,551,129,551,150,551,172,551,194,551,215,551,236,551,258,551,280,551,301,551,366,551,452,551,473,551,494,551,516,551,580,551,602,551,624,551,645,551,666,551,688,551,710,551,731,551,752,551,774,551,796,551,75,569,97,569,118,569,140,569,161,569,183,569,204,569,226,569,247,569,269,569,290,569,419,569,462,569,484,569,505,569,613,569,634,569,656,569,677,569,699,569,720,569,742,569,763,569,785,569,64,588,86,588,108,588,129,588,150,588,172,588,194,588,215,588,236,588,258,588,280,588,301,588,494,588,516,588,538,588,559,588,645,588,666,588,688,588,710,588,731,588,752,588,774,588,796,588,903,588,924,588,75,607,97,607,118,607,140,607,161,607,183,607,204,607,226,607,247,607,419,607,527,607,548,607,570,607,634,607,656,607,677,607,699,607,720,607,742,607,763,607,785,607,806,607,828,607,849,607,871,607,892,607,914,607,935,607,957,607,978,607,1000,607,64,625,86,625,108,625,129,625,150,625,172,625,194,625,215,625,236,625,408,625,430,625,559,625,602,625,645,625,666,625,688,625,710,625,774,625,796,625,817,625,838,625,860,625,882,625,903,625,924,625,946,625,968,625,989,625,75,644,97,644,118,644,140,644,161,644,183,644,204,644,226,644,290,644,419,644,570,644,634,644,656,644,677,644,699,644,763,644,785,644,806,644,828,644,849,644,871,644,892,644,914,644,935,644,957,644,978,644,1000,644,64,662,86,662,108,662,129,662,150,662,172,662,194,662,215,662,236,662,408,662,580,662,666,662,688,662,710,662,731,662,796,662,817,662,838,662,860,662,882,662,903,662,924,662,946,662,968,662,989,662,75,681,97,681,118,681,140,681,161,681,183,681,204,681,226,681,548,681,677,681,699,681,720,681,763,681,785,681,806,681,828,681,849,681,871,681,892,681,914,681,935,681,957,681,978,681,1000,681,64,700,86,700,108,700,129,700,150,700,172,700,194,700,516,700,538,700,688,700,710,700,796,700,817,700,838,700,860,700,882,700,903,700,924,700,946,700,968,700,989,700,118,718,140,718,161,718,183,718,312,718,333,718,355,718,376,718,398,718,419,718,441,718,677,718,699,718,828,718,849,718,871,718,892,718,914,718,957,718,978,718,1000,718];
const EU_W = 1000, EU_H = 736;
const PINS: Array<[number, number]> = [[508, 270], [287, 386], [490, 585]];


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
const L = (base: string, off: number) => `${base}${off >= 0 ? "+" : "-"}${Math.abs(off).toFixed(2)}`;     // a label with an offset in seconds

// ── the morphing body: a static box, clip-path inset + round = capsule/circle; moves by transform only ──────────
const BW = 960, BH = 620;
const Shape: React.FC<{ x: number; y: number; w: number; h: number; color: string; tf?: string; sheen?: number; clipped?: React.ReactNode; over?: React.ReactNode }> =
  ({ x, y, w, h, color, tf = "", sheen = -1, clipped, over }) => {
  const r = Math.min(w, h) / 2, ix = (BW - w) / 2, iy = (BH - h) / 2;
  return (
    <div style={{ position: "absolute", left: CX - BW / 2, top: CY - BH / 2, width: BW, height: BH, transform: `translate(${x - CX}px, ${y - CY}px) ${tf}` }}>
      <div style={{ position: "absolute", inset: 0, filter: "drop-shadow(0 22px 26px rgba(26,22,20,0.16))" }}>
        <div style={{ position: "absolute", inset: 0, background: color, clipPath: `inset(${iy}px ${ix}px round ${r}px)` }}>
          {sheen >= 0 && sheen <= 1 && <div style={{ position: "absolute", inset: 0, background: `linear-gradient(105deg, rgba(255,255,255,0) ${mix(-30, 100, sheen)}%, rgba(255,255,255,0.42) ${mix(-18, 112, sheen)}%, rgba(255,255,255,0) ${mix(-6, 124, sheen)}%)` }} />}
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
/** a thing at (x, y), centred on that point (or its own origin with raw), by transform only */
const At: React.FC<{ x: number; y: number; tf?: string; op?: number; raw?: boolean; children?: React.ReactNode }> = ({ x, y, tf = "", op = 1, raw, children }) => (
  <div style={{ position: "absolute", left: CX, top: CY, width: 0, height: 0, opacity: op, transform: `translate(${x - CX}px, ${y - CY}px) ${tf}` }}>
    {raw ? children : <div style={{ position: "absolute", left: 0, top: 0, transform: "translate(-50%, -50%)" }}>{children}</div>}
  </div>
);

// ── the dotted globe: continents turn steadily; the ring sweep darkens the land as it sets up ──────────────────
const NG = 3600, GA = Math.PI * (3 - Math.sqrt(5));
const GP = Array.from({ length: NG }, (_, i) => { const z = 1 - (2 * (i + 0.5)) / NG; return { cl: Math.sqrt(1 - z * z), sl: z, lon: ((GA * i) % (2 * Math.PI)) - Math.PI, land: FLAGS[i] === "1" }; });
const LAND_SET = "#527268";
const Globe: React.FC<{ th: number; R: number; op: number; sweep: number }> = ({ th, R, op, sweep }) => {
  const tilt = 0.34, ct = Math.cos(tilt), st = Math.sin(tilt), out: React.ReactNode[] = [];
  for (let i = 0; i < NG; i++) {
    const p = GP[i], a = p.lon + th, x = p.cl * Math.sin(a), z0 = p.cl * Math.cos(a);
    const y2 = p.sl * ct - z0 * st, z2 = p.sl * st + z0 * ct;
    if (z2 < 0.03) continue;
    const sx = x * R, sy = -y2 * R;
    let fill = "#9DBBB1";
    if (p.land) { const ang = ((Math.atan2(sx, -sy) + 2 * Math.PI) % (2 * Math.PI)) / (2 * Math.PI); fill = ang < sweep ? LAND_SET : C.sage; }
    const rad = (p.land ? 8.2 : 5.0) * (0.4 + 0.6 * z2) * op;
    out.push(<circle key={i} cx={sx.toFixed(1)} cy={sy.toFixed(1)} r={rad.toFixed(2)} fill={fill} opacity={(0.45 + 0.55 * z2).toFixed(2)} />);
  }
  return <svg width={BW} height={BH} viewBox={`${-BW / 2} ${-BH / 2} ${BW} ${BH}`} style={{ position: "absolute", left: 0, top: 0 }}>{out}</svg>;
};
const CheckDisc: React.FC<{ size: number; p: number }> = ({ size, p }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: "block" }}>
    <circle cx="50" cy="50" r="50" fill={C.sage} />
    <path d="M28 52 L43 66 L72 35" fill="none" stroke="#fff" strokeWidth="8.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="64" strokeDashoffset={64 * (1 - clamp01(p))} />
  </svg>
);

// ── the price counter: two digit columns that roll steadily (ones 13 steps, tens 8) ───────────────────────────────
const Roller: React.FC<{ p: number; size: number }> = ({ p, size }) => {
  const row = size * 1.25;
  const col = (steps: number, end: number) => {
    const pos = steps * p;
    return (
      <span style={{ display: "inline-block", height: row, overflow: "hidden", position: "relative", width: "0.62em" }}>
        <span style={{ position: "absolute", left: 0, top: 0, width: "100%", transform: `translateY(${-pos * row}px)`, willChange: "transform" }}>
          {Array.from({ length: steps + 1 }, (_, n) => <div key={n} style={{ height: row, lineHeight: `${row}px`, textAlign: "center" }}>{((end - steps + n) % 10 + 10) % 10}</div>)}
        </span>
      </span>
    );
  };
  return <div style={{ display: "inline-flex", fontFamily: SERIF, fontSize: size, lineHeight: 1, color: C.ink, letterSpacing: "-0.03em", fontVariantNumeric: "tabular-nums" }}>{col(8, 8)}{col(13, 3)}</div>;
};

// ── the lock (~220 px): the shackle lifts open, then snaps shut ─────────────────────────────────────────────────
const Lock: React.FC<{ lift: number }> = ({ lift }) => (
  <svg width="176" height="220" viewBox="0 0 64 80" style={{ display: "block", overflow: "visible" }}>
    <path d="M17 46 V27 a15 15 0 0 1 30 0 V46" fill="none" stroke={C.sageDeep} strokeWidth="7" strokeLinecap="round" transform={`translate(0 ${-lift})`} />
    <rect x="6" y="34" width="52" height="40" rx="11" fill={C.sage} />
    <circle cx="32" cy="52" r="5.2" fill={C.white} /><rect x="30" y="54" width="4" height="9" rx="2" fill={C.white} />
  </svg>
);

// ── a calendar card (~300×200) whose year flips (split flap) ────────────────────────────────────────────────────
const FW = 300, FH = 156;
const Half: React.FC<{ text: string; bottom?: boolean; style?: React.CSSProperties }> = ({ text, bottom, style }) => (
  <div style={{ position: "absolute", left: 0, top: bottom ? FH / 2 : 0, width: FW, height: FH / 2, overflow: "hidden", background: C.white, backfaceVisibility: "hidden", ...style }}>
    <div style={{ position: "absolute", left: 0, top: bottom ? -FH / 2 : 0, width: FW, height: FH, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SERIF, fontSize: 122, letterSpacing: "-0.03em", color: C.ink }}>{text}</div>
  </div>
);
const Flip: React.FC<{ a: string; b: string; ang1: number; ang2: number }> = ({ a, b, ang1, ang2 }) => (
  <div style={{ position: "relative", width: FW, height: FH, perspective: 900 }}>
    <Half text={b} />
    <Half text={a} bottom />
    <Half text={a} style={{ transformOrigin: "50% 100%", transform: `rotateX(${ang1}deg)`, display: ang1 <= -89.9 ? "none" : undefined, filter: `brightness(${1 + ang1 / 450})` }} />
    <Half text={b} bottom style={{ transformOrigin: "50% 0%", transform: `rotateX(${ang2}deg)`, display: ang2 >= 89.9 ? "none" : undefined }} />
    <div style={{ position: "absolute", left: 0, top: FH / 2 - 1.5, width: FW, height: 3, background: "rgba(26,22,20,0.10)" }} />
  </div>
);

// ── a labelled card (domain / e-mail) that flies out and docks ──────────────────────────────────────────────────
const Card: React.FC<{ label: string; icon: string; text: string; done: number }> = ({ label, icon, text, done }) => (
  <div style={{ position: "relative", width: 560, height: 160, borderRadius: 42, background: C.white, border: `1.5px solid ${C.line}`, boxShadow: "0 26px 44px -22px rgba(26,22,20,0.32)",
    display: "flex", alignItems: "center", gap: 26, padding: "0 32px", boxSizing: "border-box", fontFamily: SANS }}>
    <div style={{ width: 96, height: 96, borderRadius: 48, background: C.sageTint, display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}><Ico n={icon} s={56} c={C.sageDeep} w={2.2} /></div>
    <div style={{ display: "flex", flexDirection: "column", gap: 8, width: 374 }}>
      <div style={{ fontSize: 28, fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: C.sageDeep, whiteSpace: "nowrap" }}>{label}</div>
      <div style={{ fontSize: 36, fontWeight: 500, color: C.ink, whiteSpace: "nowrap", height: 44, lineHeight: "44px" }}>{text}</div>
    </div>
    <div style={{ position: "absolute", right: -14, top: -14, width: 48, height: 48, borderRadius: 24, background: C.sage, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${done})`, opacity: clamp01(done * 3) }}>
      <Ico n="check" s={32} c={C.white} w={3} />
    </div>
  </div>
);

// ── the chain (~660 px): two stadium links, over-under at the crossings ─────────────────────────────────────────
const LW = 360, LH = 170, SW = 28, LX = 128;
const linkPath = () => { const w = LW - SW, h = LH - SW, r = h / 2; return `M ${-w / 2 + r} ${-h / 2} H ${w / 2 - r} A ${r} ${r} 0 0 1 ${w / 2 - r} ${h / 2} H ${-w / 2 + r} A ${r} ${r} 0 0 1 ${-w / 2 + r} ${-h / 2} Z`; };
const Link: React.FC<{ clipX?: number }> = ({ clipX }) => (
  <svg width={LW + 60} height={LH + 60} viewBox={`${-(LW + 60) / 2} ${-(LH + 60) / 2} ${LW + 60} ${LH + 60}`} style={{ display: "block", overflow: "visible" }}>
    {clipX !== undefined && <clipPath id="topx"><rect x={clipX - 50} y={-110} width={100} height={110} /></clipPath>}
    <path d={linkPath()} fill="none" stroke={C.sage} strokeWidth={SW} strokeLinejoin="round" clipPath={clipX !== undefined ? "url(#topx)" : undefined} />
  </svg>
);

// ── the camera: eased pushes, glides and pull-backs on the stage (the page itself never scrolls) ─────────────────────
// pose = zoom Z and the stage point (fx, fy), measured from the stage centre, that sits at the screen centre
const CAM: Array<[number, number, number, number, number]> = [   // [from s, to s, Z, fx, fy]; quick eased moves (no slow vertical text drift)
  [26.91, 27.5, 1.25, 0, -10],     // the globe rises out of the address bar
  [27.8, 28.3, 1.45, 0, -90],      // push toward the top while the progress bar fills
  [28.7, 29.2, 1.2, 0, -20],       // the bar finishes, the site goes live
  [29.45, 29.95, 1.05, 0, 0],      // pull back for the price
  [30.3, 30.8, 1.35, 0, 60],       // a step in toward the price
  [31.2, 31.7, 1.55, 0, -200],     // push in on the address bar for the domain
  [32.0, 32.6, 1.55, 220, -200],   // glide sideways to the corner for the e-mail card (a pure pan)
  [32.9, 33.4, 0.95, 0, 30],       // pull back for the lock
  [33.7, 34.2, 1.4, 0, 100],       // in toward the price for the calendar
  [34.45, 34.95, 1.1, 0, 20],      // ease out while the year flips
  [35.2, 35.7, 1.55, 0, -230],     // push in on the address bar: Domænet i dit navn
  [36.25, 36.75, 1.15, 0, 0],      // pull back before the stage flips
  [38.1, 38.9, 1.0, 0, 0],         // settle on the plain stage for the h4 hand-off
];
const cam = (sec: number) => {
  let Z = 1.08, fx = 0, fy = 0;
  for (const [a, b, z, x, y] of CAM) {
    if (sec <= a) break;
    const e = sec >= b ? 1 : INOUT((sec - a) / (b - a));
    Z = mix(Z, z, e); fx = mix(fx, x, e); fy = mix(fy, y, e);
    if (sec < b) break;
  }
  return { Z, fx, fy };
};
// the hero photo swaps in its frame (a carousel: the AI tries photos), one slide every 1.3 s
const SLIDES = Array.from({ length: 15 }, (_, i) => 27.45 + 0.72 * i);   // 15 slides: ends on the first photo again
const PHOTOS = ["holm-shoulder.jpg", "holm-neck.jpg", "holm-calves.jpg"];
const slideIdx = (sec: number) => SLIDES.reduce((a, T) => a + OUT(clamp01((sec - T) / 0.4)), 0);

// ── the body (the thing that lives on the stage): a dot from the address bar → globe → price capsule → domain bar ──
const main = (g: number) => ({
  x: seq(g, 960, [["w:ogs-0.02", 790, 0.5, 0.72], ["w:domnet-0.05", 960, 0.5, 0.72]]),
  y: seq(g, 213, [["h3+0.3", 565, 0.5, 0.7], ["w:fra-0.12", 690, 0.5, 0.7], ["w:domnet-0.05", 470, 0.5, 0.7], ["w:servere-0.04", 540, 0.35, 0.8]]),
  w: Math.max(2, seq(g, 30, [["h3+0.3", 520, 0.45, 0.62], ["w:fra-0.12", 760, 0.45, 0.62], ["w:domnet-0.05", 880, 0.45, 0.62], ["w:servere-0.04", 40, 0.3, 0.8]])),
  h: Math.max(2, seq(g, 30, [["h3+0.3", 520, 0.45, 0.62], ["w:fra-0.12", 230, 0.45, 0.62], ["w:domnet-0.05", 130, 0.45, 0.62], ["w:servere-0.04", 40, 0.3, 0.8]])),
  sc: seq(g, 1, [["w:ogs-0.02", 0.7, 0.5, 0.72], ["w:domnet-0.05", 1, 0.5, 0.72]]),
  tint: clamp01(seq(g, 0, [["h3+0.45", 1, 0.3, 1], ["w:fra-0.12", 0, 0.3, 1]])),
});

export const Scene4: React.FC<{ g: number }> = ({ g }) => {
  if (g <= f("h3") + HANDOFF_HALF) return <StageHandoff g={g} at="h3" />;
  if (g >= f("h4") - HANDOFF_HALF) return <StageHandoff g={g} at="h4" />;
  const t = (at: string) => S(g, at);
  const sec = g / 30;
  const M = main(g), Mp = main(g - 1);
  const P = cam(sec), Z = P.Z;
  const barX = CX + Z * (0 - P.fx), barY = CY + Z * (-277 - P.fy);

  // ── the address bar: Forhåndsvisning → holmfysio.dk live when set up ──
  const live = ez(t("w:vi+1.4") / 0.3), url = g >= f("w:vi+1.4") ? "holmfysio.dk" : "Forhåndsvisning";
  const barP = ez(t("w:vi") / 1.4), barOp = 1 - clamp01(t("w:vi+1.5") / 0.3);

  // ── globe + ring + check ──
  const t0 = t("h3+0.25");
  const ringP = barP, ringIn = bounce(g, "w:vi-0.08", 0.4, 0.6), ringOut = ez(t("w:fra-0.12") / 0.3);
  const th = 1.25 * t0;
  const chkP = bounce(g, "w:vi+1.4", 0.4, 0.55), chkDraw = clamp01(t("w:vi+1.44") / 0.25), chkOut = clamp01(t("w:fra-0.12") / 0.12);
  const dotsOp = ou(t("h3+0.5") / 0.3) * (1 - clamp01(t("w:fra-0.12") / 0.14)) * (1 - 0.65 * clamp01(chkP));
  const globeStage = g < f("w:fra") + 8;
  const RR = 292, RL = 2 * Math.PI * RR;

  // ── the price ──
  const pcIn = ou(t("w:fra") / 0.3), pcOut = clamp01(t("w:domnet-0.05") / 0.2);
  const qFra = ou(t("w:fra") / 0.3), qKr = ou(t("w:kroner2") / 0.35), qMd = ou(t("w:mneden") / 0.4);
  const shift = 34 + (93 * (1 - qKr) + 145 * (1 - qMd)) / 2;
  const rollP = ez(t("w:83") / 1.5);
  // ── the domain bar ──
  const dOut = clamp01(t("w:servere-0.1") / 0.15);
  const DOM = "holmfysio.dk";

  const pulse = 0.05 * press(g, "w:fast-0.02", 0.04) + 0.04 * press(g, "w:domnet-0.02", 0.03) + 0.04 * press(g, "w:fra-0.05", 0.03);
  const trav = g < f("h3") + 40 ? squash(M.x - Mp.x, M.y - Mp.y) : "";
  const tf = `${trav} scale(${M.sc * (1 + pulse * 0.4)}, ${M.sc * (1 - pulse)})`;
  const sh = (() => { for (const [lab, d] of [["w:fra", 0.8], ["w:fast-0.02", 0.8], ["w:domnet", 0.8]] as Array<[string, number]>) { const q = t(lab) / d; if (q >= 0 && q <= 1) return q; } return -1; })();
  const bodyColor = `color-mix(in srgb, ${TINT} ${(M.tint * 100).toFixed(1)}%, ${C.sage})`;
  const bodyOn = g >= f("h3") + HANDOFF_HALF + 1 && g < f("w:servere+0.15");

  // ── the two cards ──
  const card = (at: string, to: [number, number], ctrl: [number, number], seed: number, text: string, absorb: boolean) => {
    const u = bounce(g, at, 0.5, 0.6), tk = absorb ? 0 : ez(t("w:fast-0.27") / 0.3);
    const ab = absorb ? ez((t(at) - 0.5) / 0.2) : 0;
    const P0: [number, number] = [CX, 690];
    const bx = (1 - u) * (1 - u) * P0[0] + 2 * (1 - u) * u * ctrl[0] + u * u * to[0], by = (1 - u) * (1 - u) * P0[1] + 2 * (1 - u) * u * ctrl[1] + u * u * to[1];
    const x = mix(bx, P0[0], tk), y = mix(by, P0[1], tk);
    const s = (0.3 + 0.7 * Math.min(1.08, clamp01(u) + Math.max(0, u - 1))) * (1 - 0.7 * tk) * (1 - 0.85 * ab);
    return { x, y, s, op: clamp01(u * 3) * (1 - clamp01((tk - 0.5) * 2)) * (1 - clamp01((ab - 0.6) * 2.5)), rot: (1 - Math.min(1, u)) * (to[0] < CX ? -14 : 14) * (1 - tk),
      txt: typed(g, L(at, 0.3), text, 26), done: absorb ? 0 : bounce(g, L(at, 0.3 + text.length / 26), 0.4, 0.55) };
  };
  const showCards = g >= f("w:domne") - 1 && g < f("w:fast-0.27") + 14;
  const flash = bounce(g, L("w:domne", 0.62), 0.4, 0.55), flashOut = clamp01(t(L("w:domne", 0.95)) / 0.3);
  // ── the lock ──
  const lockP = bounce(g, "w:fast-0.2", 0.42, 0.55), snap = bounce(g, "w:fast+0.0", 0.3, 0.5), lockTuck = ez(t("w:ogs-0.12") / 0.22);
  const showLock = g >= f("w:fast-0.2") - 1 && g < f("w:ogs-0.12") + 8;
  const lockY = 690 - 115 - 8 - 110 - 420 * (1 - lockP) + (115 + 8 + 110) * lockTuck, lockS = 1 - 0.9 * lockTuck;
  // ── the year ──
  const cp = bounce(g, "w:ogs", 0.45, 0.6), cTuck = ez(t("w:domnet-0.14") / 0.26);
  const f1 = "w:du4+0.03", f2 = "w:fornyer+0.37";
  const yearsAt = (base: string, off: number) => ({ ang1: -90 * EXIT(clamp01(S(g, L(base, off)) / 0.2)), ang2: 90 * (1 - aspring(g, L(base, off + 0.19), 0.3, 0.5)) });
  let ya = "2027", yb = "2027", fl = { ang1: 0, ang2: 90 };
  if (g >= f(f2) + 20) { ya = yb = "2029"; } else if (g >= f(f2)) { ya = "2028"; yb = "2029"; fl = yearsAt("w:fornyer", 0.37); } else if (g >= f(f1) + 20) { ya = yb = "2028"; } else if (g >= f(f1)) { ya = "2027"; yb = "2028"; fl = yearsAt("w:du4", 0.03); }
  const showYear = g >= f("w:ogs") - 1 && g < f("w:domnet-0.14") + 10;
  const cardX = mix(1000, 1250, cp) * (1 - cTuck) + 960 * cTuck, cardS = (0.3 + 0.7 * Math.min(1.08, cp)) * (1 - 0.85 * cTuck);
  // ── the tag ──
  const tg = t("w:dit-0.05"), tagIn = bounce(g, "w:dit-0.05", 0.4, 0.6), tagOut = ez(t("w:servere-0.1") / 0.18);
  const tagAng = tg > 0 ? 34 * Math.exp(-3.4 * tg) * Math.cos(2 * Math.PI * 1.5 * tg) : 0;
  const showTag = g >= f("w:dit-0.05") - 1 && g < f("w:servere-0.1") + 8;

  // ── the flip (36.95): the stage turns to show Europe with the server pins, then turns back ──
  const flipOut = ez(t("w:servere-0.04") / 0.55), flipBack = ez(t("w:ingen3-0.35") / 0.5);
  const ang = 180 * (flipOut - flipBack);
  const flipping = g >= f("w:servere-0.04") - 1 && g < f("w:ingen3-0.35") + 0.5 * 30 + 2;
  const tm = t("w:servere+0.35");
  const pinAt = ["w:servere+0.4", "w:servere+0.55", "w:servere+0.7"];
  const ripple = (i: number) => (((sec - f(pinAt[i]) / 30) * 640) % 1000 + 1000) % 1000;
  const ARCS: Array<[number, number]> = [[0, 1], [0, 2], [1, 2]];
  const arcCtl = (a: number, b: number) => [(PINS[a][0] + PINS[b][0]) / 2, (PINS[a][1] + PINS[b][1]) / 2 - 110];
  const arcPt = (a: number, b: number, u: number) => {
    const A = PINS[a], B = PINS[b], C2 = arcCtl(a, b);
    return [(1 - u) * (1 - u) * A[0] + 2 * (1 - u) * u * C2[0] + u * u * B[0], (1 - u) * (1 - u) * A[1] + 2 * (1 - u) * u * C2[1] + u * u * B[1]];
  };
  const arcOp = ou(t("w:i2-0.2") / 0.3);

  // ── the chain (38.33 → 38.9): snaps around the stage ──
  const chIn = bounce(g, "w:ingen3-0.1", 0.38, 0.58), tens = ez(t("w:ingen3+0.02") / 0.23), tb = Math.max(0, t("w:ingen3+0.25"));
  const sA = aspring(g, "w:ingen3+0.25", 0.2, 0.55), sB = aspring(g, "w:ingen3+0.25", 0.22, 0.6);
  const cs = 0.3 + 0.7 * Math.min(1.1, chIn), chOp = clamp01(chIn * 3) * (1 - clamp01((tb - 0.08) / 0.14));
  const dA = LX + 14 * tens, xA = CX - dA * cs - 330 * sA, xB = CX + dA * cs + 330 * sB, yA = 540 + 1800 * tb * tb - 380 * tb, yB = 540 + 2400 * tb * tb - 440 * tb;
  const showChain = g >= f("w:ingen3-0.1") - 1 && g < f("w:ingen3+0.25") + 9;

  const slideK = slideIdx(sec), kf0 = Math.floor(slideK), SW = 414.2, SH = 368.2;
  const goLive = t("w:vi+1.4");
  const stageEl = (
    <Stage x={480} y={300} scroll={0} url={url} live={live} build={1} booking={1} headline={NEW_HEADLINE}>
      {/* the hero photo swaps in its frame */}
      <div style={{ position: "absolute", left: 499.7, top: 78.9, width: SW, height: SH, borderRadius: 15.8, overflow: "hidden" }}>
        {[0, 1].map((j) => (
          <Img key={j} src={staticFile(`img/${PHOTOS[(kf0 + j) % 3]}`)} style={{ position: "absolute", left: 0, top: 0, width: SW, height: SH, objectFit: "cover", transform: `translateX(${((kf0 + j - slideK) * SW).toFixed(2)}px)` }} />
        ))}
      </div>
      {/* the site goes live: a ripple runs out from the address bar across the page */}
      {goLive > 0 && sec < 36.95 && Array.from({ length: 24 }, (_, i) => i).map((i) => {
        const u = clamp01((goLive - i * 0.4) / 1.3);   // a live heartbeat: a ripple leaves the address bar every 0.4 s
        return u > 0 && u < 1 ? <div key={i} style={{ position: "absolute", left: 480 - 200, top: -200, width: 400, height: 400, borderRadius: 200, border: `${i === 0 ? 26 : 20}px solid rgba(135,168,158,${i === 0 ? 0.55 : 0.45})`, boxSizing: "border-box",
          opacity: 1 - u, transform: `scale(${(0.2 + 3.6 * u).toFixed(3)})` }} /> : null;
      })}
      {barOp > 0 && g < f("w:vi+1.8") && g >= f("w:vi") - 2 && (
        <div style={{ position: "absolute", left: 0, top: 0, width: 960, height: 12, background: "rgba(255,255,255,0.7)", opacity: barOp * clamp01(t("w:vi") / 0.1) }}>
          <div style={{ width: 960, height: 12, background: C.sage, transform: `scaleX(${barP})`, transformOrigin: "0 50%" }} />
        </div>
      )}
    </Stage>
  );
  const backEl = (
    <div style={{ position: "absolute", inset: 0, borderRadius: 16, background: C.white, boxShadow: `0 0 0 1px ${C.line}, 0 40px 90px -40px rgba(26,22,20,0.30)`, overflow: "hidden" }}>
      <svg width={780} height={574} viewBox={`0 0 ${EU_W} ${EU_H}`} style={{ position: "absolute", left: 90, top: 13, overflow: "visible" }}>
        {Array.from({ length: EU.length / 2 }, (_, i) => {
          const x = EU[2 * i], y = EU[2 * i + 1], d0 = Math.hypot(x - PINS[0][0], y - PINS[0][1]);
          const rr = Math.hypot((x - EU_W / 2) / (EU_W / 2), (y - EU_H / 2) / (EU_H / 2)), vig = clamp01((1.34 - rr) / 0.3);
          if (vig <= 0.02) return null;
          const ap = ou((tm - 0.03 - d0 / 1500) / 0.28);
          if (ap <= 0) return null;
          let w = 0;
          if (tm > 0.45) for (let j = 0; j < 3; j++) { if (g < f(pinAt[j]) + 6) continue; const d = Math.hypot(x - PINS[j][0], y - PINS[j][1]); w = Math.max(w, clamp01(1 - Math.abs(d - ripple(j)) / 38)); }
          const r = 8.2 * vig * (0.3 + 0.7 * ap) * (1 + 0.3 * w);
          return <circle key={i} cx={x} cy={y} r={r.toFixed(2)} fill={rgb(SAGE, DEEP, 0.85 * w)} opacity={Math.min(1, ap * (0.72 + 0.28 * vig))} />;
        })}
        <g opacity={arcOp}>
          {ARCS.map(([a, b], i) => { const C2 = arcCtl(a, b); return <path key={i} d={`M ${PINS[a][0]} ${PINS[a][1]} Q ${C2[0]} ${C2[1]} ${PINS[b][0]} ${PINS[b][1]}`} fill="none" stroke={C.sageDeep} strokeWidth="4" strokeDasharray="2 14" strokeLinecap="round" opacity="0.55" />; })}
          {ARCS.flatMap(([a, b], i) => [0, 1].flatMap((dir) => [0, 1, 2].map((tr) => {
            const u0 = (((sec - 37.7) * 0.8 + i * 0.33 + dir * 0.5) % 1 + 1) % 1, u = clamp01(u0 - tr * 0.045);
            const pt = dir ? arcPt(b, a, u) : arcPt(a, b, u);
            return <circle key={`${i}-${dir}-${tr}`} cx={pt[0].toFixed(1)} cy={pt[1].toFixed(1)} r={(15 - tr * 4).toFixed(1)} fill={C.sageDeep} opacity={(1 - tr * 0.3) * Math.sin(Math.PI * u)} />;
          })))}
        </g>
        {PINS.map(([px, py], i) => {
          if (g < f(pinAt[i])) return null;
          const pd = bounce(g, pinAt[i], 0.38, 0.55), tipY = mix(py - 300, py, pd), pp = 1 + 0.07 * Math.sin(sec * 7);
          return <g key={i} transform={`translate(${px} ${tipY}) scale(${1.5 * pp * (0.5 + 0.5 * Math.min(1, pd))})`} opacity={clamp01(pd * 4)}>
            <path d="M0 0 C -6 -14, -21 -20, -21 -40 a21 21 0 1 1 42 0 C 21 -20, 6 -14, 0 0 Z" fill={rgb(SAGE, DEEP, ez(t(pinAt[i]) / 0.25))} /><circle cx="0" cy="-40" r="7.5" fill={C.white} />
          </g>;
        })}
      </svg>
    </div>
  );

  return (
    <>
      {/* the stage: the website is the hero in every beat; it flips to show the server map */}
      <div style={{ position: "absolute", left: CX - 480, top: CY - 300, width: 960, height: 600, transform: `translate(${(-Z * P.fx).toFixed(3)}px, ${(-Z * P.fy).toFixed(3)}px) scale(${Z})` }}>
        {flipping ? (
          <div style={{ position: "absolute", inset: 0, perspective: 2600 }}>
            <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d", transform: `rotateY(${ang}deg)` }}>
              <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden" }}>{stageEl}</div>
              <div style={{ position: "absolute", inset: 0, transform: "rotateY(180deg)", backfaceVisibility: "hidden" }}>{backEl}</div>
            </div>
          </div>
        ) : stageEl}
      </div>

      {/* the address bar takes the domain: a quick highlight when the domain card flies in */}
      {g >= f("w:domne") + 14 && g < f("w:domne") + 50 && (
        <At x={barX} y={barY} op={clamp01(flash * 2) * (1 - flashOut)} tf={`scale(${Z * (0.8 + 0.2 * Math.min(1.15, flash))})`}>
          <div style={{ width: 400, height: 40, borderRadius: 10, background: "rgba(135,168,158,0.35)", border: `2px solid ${C.sage}` }} />
        </At>
      )}
      {/* cards behind the body so they come out of it */}
      {showCards && [
        { c: card("w:domne", [barX, barY], [CX - 300, 420], 0, "holmfysio.dk", true), label: "Domæne", icon: "globe" },
        { c: card("w:email", [barX + 400, barY + 120], [CX + 560, 600], 1, "mail@holmfysio.dk", false), label: "E-mail", icon: "mail" },
      ].map(({ c, label, icon }, i) => (
        <At key={i} x={c.x} y={c.y} op={c.op} tf={`rotate(${c.rot}deg) scale(${c.s})`}><Card label={label} icon={icon} text={c.txt} done={c.done} /></At>
      ))}
      {showLock && <At x={CX} y={lockY} op={clamp01(lockP * 4)} tf={`scale(${lockS})`}><Lock lift={14 * (1 - snap)} /></At>}
      {showTag && (
        <div style={{ position: "absolute", left: CX, top: CY, width: 0, height: 0, opacity: 1 - tagOut, transform: `translate(0px, ${470 + 65 - 10 - CY}px) rotate(${tagAng}deg) scale(${(0.5 + 0.5 * Math.min(1.08, tagIn)) * (1 - 0.7 * tagOut)})`, transformOrigin: "0 0" }}>
          <div style={{ position: "absolute", left: -2, top: 0, width: 4, height: 40, background: C.sage }} />
          <div style={{ position: "absolute", left: -190, top: 36, width: 380, height: 104, borderRadius: 30, background: C.white, border: `1.5px solid ${C.line}`, boxShadow: "0 22px 36px -18px rgba(26,22,20,0.30)",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 16, fontFamily: SANS, fontWeight: 500, fontSize: 50, color: C.ink, whiteSpace: "nowrap" }}>
            <Ico n="user" s={52} c={C.sageDeep} w={2.2} />Ejer: dig
          </div>
        </div>
      )}
      {showYear && (
        <At x={cardX} y={690} op={clamp01(cp * 4) * (1 - clamp01((cTuck - 0.5) * 2))} tf={`scale(${cardS})`}>
          <div style={{ width: FW, borderRadius: 30, overflow: "hidden", background: C.white, border: `1.5px solid ${C.line}`, boxShadow: "0 26px 44px -20px rgba(26,22,20,0.32)" }}>
            <div style={{ height: 44, background: C.sage, display: "flex", justifyContent: "space-around", alignItems: "center", padding: "0 64px" }}>
              <div style={{ width: 14, height: 14, borderRadius: 7, background: C.bg }} /><div style={{ width: 14, height: 14, borderRadius: 7, background: C.bg }} />
            </div>
            <Flip a={ya} b={yb} ang1={fl.ang1} ang2={fl.ang2} />
          </div>
        </At>
      )}

      {/* the body: dot from the address bar → globe → price capsule → domain bar → dot */}
      {bodyOn && (
        <Shape x={M.x} y={M.y} w={M.w} h={M.h} color={bodyColor} tf={tf} sheen={M.tint < 0.5 ? sh : -1}
          clipped={<>
            {globeStage && <>
              <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 50%, rgba(135,168,158,0) 52%, rgba(135,168,158,0.42) 100%)", opacity: dotsOp }} />
              <Globe th={th} R={0.49 * Math.min(M.w, M.h)} op={0.6 + 0.4 * dotsOp} sweep={ringP} />
              <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 36% 28%, rgba(255,255,255,0.30), rgba(255,255,255,0) 46%)", opacity: dotsOp }} />
            </>}
            {g >= f("w:fra") - 2 && g < f("w:domnet-0.05") + 14 && (
              <Mid style={{ opacity: pcIn * (1 - pcOut), filter: pcOut > 0 ? `blur(${pcOut * 10}px)` : undefined }}>
                <div style={{ display: "flex", alignItems: "center", transform: `translateX(${shift}px)`, color: C.ink }}>
                  <Roller p={rollP} size={170} />
                  <span style={{ marginLeft: 16, fontFamily: SANS, fontWeight: 500, fontSize: 66, opacity: qKr, transform: `translateX(${(1 - qKr) * -40}px)`, filter: qKr < 1 ? `blur(${(1 - qKr) * 8}px)` : undefined }}>kr.</span>
                  <span style={{ marginLeft: 4, fontFamily: SANS, fontWeight: 500, fontSize: 66, opacity: qMd * 0.62, transform: `translateX(${(1 - qMd) * -50}px)`, filter: qMd < 1 ? `blur(${(1 - qMd) * 8}px)` : undefined }}>/md.</span>
                </div>
                <div style={{ position: "absolute", left: 100, top: 0, bottom: 0, display: "flex", alignItems: "center", fontFamily: SANS, fontWeight: 500, fontSize: 44, color: "rgba(26,22,20,0.62)", opacity: qFra, transform: `translateX(${(1 - qFra) * -40}px)` }}>Fra</div>
              </Mid>
            )}
            {g >= f("w:domnet-0.05") - 2 && g < f("w:servere") + 4 && (
              <Mid style={{ opacity: 1 - dOut }}>
                <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
                  <div style={{ width: 100, height: 100, borderRadius: 50, background: C.white, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${0.5 + 0.5 * Math.min(1.1, bounce(g, "w:domnet-0.02", 0.4, 0.6))})` }}><Ico n="globe" s={62} c={C.sageDeep} w={2.1} /></div>
                  <div style={{ display: "flex", fontFamily: SANS, fontWeight: 500, fontSize: 84, letterSpacing: "-0.01em", color: C.ink }}>
                    {DOM.split("").map((ch, i) => {
                      const q = aspring(g, L("w:domnet", 0.06 + i * 0.045), 0.35, 0.62);
                      return <span key={i} style={{ display: "inline-block", opacity: clamp01(q * 2.2), transform: `translateY(${(1 - q) * 80}px)`, filter: q < 1 ? `blur(${Math.max(0, (1 - q) * 6)}px)` : undefined }}>{ch}</span>;
                    })}
                  </div>
                </div>
              </Mid>
            )}
          </>}
          over={globeStage && (
            <>
              <svg width={BW} height={BH} viewBox={`${-BW / 2} ${-BH / 2} ${BW} ${BH}`} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: clamp01(ringIn * 3) * (1 - ringOut),
                transform: `scale(${(0.9 + 0.1 * Math.min(1.1, ringIn)) * (1 - 0.4 * ringOut)})` }}>
                <circle cx="0" cy="0" r={RR} fill="none" stroke={C.line} strokeWidth="14" />
                <circle cx="0" cy="0" r={RR} fill="none" stroke={C.sage} strokeWidth="14" strokeLinecap="round" strokeDasharray={RL} strokeDashoffset={RL * (1 - ringP)} transform="rotate(-90)" />
                {ringP > 0.01 && ringP < 0.995 && <circle cx={RR * Math.cos(-Math.PI / 2 + 2 * Math.PI * ringP)} cy={RR * Math.sin(-Math.PI / 2 + 2 * Math.PI * ringP)} r="13" fill={C.sageDeep} stroke={C.white} strokeWidth="5" />}
              </svg>
              {chkP > 0 && (
                <div style={{ position: "absolute", left: BW / 2 - 90, top: BH / 2 - 90, opacity: (1 - chkOut) * clamp01(chkP * 3), transform: `scale(${(0.3 + 0.7 * chkP) * (1 - 0.6 * chkOut)})` }}>
                  <CheckDisc size={180} p={chkDraw} />
                </div>
              )}
            </>
          )} />
      )}

      {/* lines (under the stage) */}
      {g >= f("w:p") - 2 && g < f("w:vi") + 12 && <Line text="på nettet?" y={982} p={k(g, "w:p", 0.8)} out={k(g, "w:vi-0.1", 0.25)} size={100} italicWords={["nettet"]} />}
      {g >= f("w:kroner2+0.2") - 1 && g < f("w:domne") + 6 && <Line text="faktureres årligt" y={934} size={30} serif={false} color={C.muted} p={k(g, "w:kroner2+0.2", 0.45)} out={k(g, "w:domne-0.1", 0.25)} />}
      {g >= f("w:i2") - 2 && g < f("w:ingen3-0.35") + 10 && <Line text="Servere i Europa." y={982} size={100} p={k(g, "w:i2", 0.7)} out={k(g, "w:ingen3-0.4", 0.28)} italicWords={["Europa"]} />}

      {/* the chain snaps around the stage */}
      {showChain && (
        <>
          <At x={xA} y={yA} op={chOp} tf={`scale(${cs})`}><Link /></At>
          <At x={xB} y={yB} op={chOp} tf={`rotate(${160 * tb}deg) scale(${cs})`}><Link /></At>
          {tb < 0.2 && <At x={xA} y={yA} op={chOp} tf={`scale(${cs})`}><Link clipX={dA} /></At>}
        </>
      )}
    </>
  );
};
