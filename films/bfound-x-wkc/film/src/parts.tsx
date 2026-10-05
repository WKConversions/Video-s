import React from "react";
import { Img, staticFile } from "remotion";
import { BF, WK } from "./lib";
import ENV from "./env.json";

const env = ENV as number[];
export const level = (f: number) => env[Math.max(0, Math.min(env.length - 1, Math.round(f)))] ?? 0;

/** A person with no face (the commenters, the "others"): bFound's pastel circle with a soft silhouette. */
const TONES: [string, string][] = [
  ["#eff3ff", "#9fb2ec"], ["#fbf4fc", "#cfb3d8"], ["#fdf8da", "#d3c37a"], ["#e9edfb", "#7e8fc9"], ["#f3f1fb", "#a9afe3"],
];
export const Person: React.FC<{ x: number; y: number; d: number; tone?: number; style?: React.CSSProperties; children?: React.ReactNode }> = ({ x, y, d, tone = 0, style, children }) => {
  const [bg, fg] = TONES[tone % TONES.length];
  return (
    <div style={{ position: "absolute", left: x - d / 2, top: y - d / 2, width: d, height: d, ...style }}>
      <svg width={d} height={d} viewBox="0 0 100 100" style={{ position: "absolute", inset: 0 }}>
        <defs><clipPath id={`pc${tone}`}><circle cx="50" cy="50" r="50" /></clipPath></defs>
        <g clipPath={`url(#pc${tone})`}>
          <rect width="100" height="100" fill={bg} />
          <circle cx="50" cy="40" r="17" fill={fg} />
          <ellipse cx="50" cy="98" rx="34" ry="32" fill={fg} />
        </g>
      </svg>
      {children}
    </div>
  );
};

/** bFound's four-point sparkle, from its logo. */
export const Sparkle: React.FC<{ x: number; y: number; s: number; color?: string; rot?: number }> = ({ x, y, s, color = BF.logo, rot = 0 }) =>
  s <= 0.001 ? null : (
    <svg width={120} height={120} viewBox="-1 -1 2 2" style={{ position: "absolute", left: x - 60, top: y - 60, transform: `scale(${s}) rotate(${rot}deg)`, overflow: "visible" }}>
      <path d="M0,-1 C0.1,-0.3 0.3,-0.1 1,0 C0.3,0.1 0.1,0.3 0,1 C-0.1,0.3 -0.3,0.1 -1,0 C-0.3,-0.1 -0.1,-0.3 0,-1Z" fill={color} />
    </svg>
  );

/** An odometer digit: v counts continuously (rolls 0→9→0…), soft mask top and bottom. */
export const Digit: React.FC<{ v: number; size: number; width?: number }> = ({ v, size, width = 0.6 }) => (
  <div style={{ width: size * width, height: size, overflow: "hidden", position: "relative",
    WebkitMaskImage: "linear-gradient(180deg, transparent 0%, #000 16%, #000 84%, transparent 100%)" }}>
    <div style={{ position: "absolute", left: 0, right: 0, top: -v * size }}>
      {Array.from({ length: 30 }, (_, i) => <div key={i} style={{ height: size, lineHeight: `${size}px`, textAlign: "center" }}>{i % 10}</div>)}
    </div>
  </div>
);

export const Phone: React.FC<{ size: number; color?: string }> = ({ size, color = "#fff" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path fill={color} d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
  </svg>
);

export const PlayBadge: React.FC<{ x: number; y: number; d: number; s?: number; bg?: string; fg?: string }> = ({ x, y, d, s = 1, bg = WK.blue, fg = "#fff" }) =>
  s <= 0.001 ? null : (
    <div style={{ position: "absolute", left: x - d / 2, top: y - d / 2, width: d, height: d, borderRadius: "50%", background: bg,
      transform: `scale(${s})`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 10px 24px -10px rgba(5,15,25,.45)" }}>
      <svg width={d * 0.42} height={d * 0.42} viewBox="0 0 10 10"><path d="M2.6 1.2 L8.6 5 L2.6 8.8 Z" fill={fg} strokeLinejoin="round" stroke={fg} strokeWidth={0.8} /></svg>
    </div>
  );

export const Check: React.FC<{ x: number; y: number; d: number; s: number }> = ({ x, y, d, s }) =>
  s <= 0.001 ? null : (
    <div style={{ position: "absolute", left: x - d / 2, top: y - d / 2, width: d, height: d, borderRadius: "50%", background: WK.blue, transform: `scale(${s})`,
      display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width={d * 0.5} height={d * 0.5} viewBox="0 0 10 10"><path d="M1.8 5.2 L4.1 7.4 L8.3 2.7" fill="none" stroke="#fff" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" /></svg>
    </div>
  );

/** Emma's own portrait from bfoundconsulting.com, on its cream backdrop. */
export const EmmaPhoto: React.FC<{ style?: React.CSSProperties; pos?: string }> = ({ style, pos = "50% 35%" }) => (
  <div style={{ position: "absolute", overflow: "hidden", background: BF.cream, ...style }}>
    <Img src={staticFile("img/emma.webp")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: pos }} />
  </div>
);

/** A live voice meter: the actual loudness of the call, scrolling right to left. Flat when Karl listens. */
export const Bars: React.FC<{ f: number; n: number; w: number; h: number; color?: string; step?: number; gain?: number }> = ({ f, n, w, h, color = WK.blue, step = 3, gain = 1 }) => {
  const bw = (w / n) * 0.5;
  return (
    <div style={{ position: "relative", width: w, height: h }}>
      {Array.from({ length: n }, (_, i) => {
        const v = level(f - (n - 1 - i) * step);
        const bh = Math.max(bw, Math.min(h, bw + v * (h - bw) * gain));
        return <div key={i} style={{ position: "absolute", left: i * (w / n), top: (h - bh) / 2, width: bw, height: bh, borderRadius: bw, background: color }} />;
      })}
    </div>
  );
};

/** WKC's arrow cursor. */
export const Cursor: React.FC<{ x: number; y: number; s?: number; o?: number }> = ({ x, y, s = 1, o = 1 }) => (
  <svg width={90} height={110} viewBox="0 0 18 22" style={{ position: "absolute", left: x, top: y, opacity: o, transform: `scale(${s})`, transformOrigin: "0 0",
    filter: "drop-shadow(0 8px 14px rgba(5,15,25,.35))" }}>
    <path d="M1.5 1.5 L1.5 17.5 L5.6 13.6 L8.4 20 L11.2 18.8 L8.5 12.6 L14.2 12.6 Z" fill={WK.ink} stroke="#fff" strokeWidth={1.4} strokeLinejoin="round" />
  </svg>
);
