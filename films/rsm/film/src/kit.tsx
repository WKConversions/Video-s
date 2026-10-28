// Royal School of Music: the shared kit (brand, timing helpers, notes, the card, type).
// Brand from royalschoolofmusic.es: teal #01ABA8 (logo), Montserrat (site), the logo's Goudy serif (Sorts Mill Goudy),
// the note colours of the site's note artwork (Karl's screenshot 5).
import React from "react";
import { continueRender, delayRender, Easing, staticFile } from "remotion";
import { loadFont } from "@remotion/fonts";

export const FPS = 60, DUR = 35.6, VO = 0.4;
export const C = { bg: "#F6F7F7", ink: "#26292B", teal: "#01ABA8", tealD: "#00807E", tealL: "#E3F5F4", muted: "#71787C", line: "rgba(38,41,43,0.10)", card: "#FFFFFF", pink: "#FEF2F4" };
export const NOTES = ["#25CDBF", "#FFC61A", "#FF8A1E", "#EE4A2E", "#C8174E"];
export const SANS = "Montserrat", SERIF = "Sorts Mill Goudy";
export const SHADOW = "0 0 2px rgba(20,40,40,0.06), 0 0 26px rgba(20,40,40,0.08), 0 0 90px rgba(20,40,40,0.11)";
export const SHADOW_S = "0 0 1px rgba(20,40,40,0.08), 0 0 14px rgba(20,40,40,0.08), 0 0 40px rgba(20,40,40,0.08)";

const fh = typeof window !== "undefined" ? delayRender("fonts") : null;
if (typeof window !== "undefined") {
  Promise.all([
    ...[500, 600, 700, 800].map((w) => loadFont({ family: SANS, url: staticFile("fonts/montserrat-var.woff2"), weight: String(w) })),
    loadFont({ family: SERIF, url: staticFile("fonts/sortsmillgoudy-400.woff2"), weight: "400" }),
  ]).then(() => fh !== null && continueRender(fh));
}

// the voice-over's words on the film clock (VO starts at 0.4 s)
const W: Record<string, number> = {
  exciting: 1.26, finding: 2.56, teacher: 3.08, fitting: 3.96, schedule: 4.96, knowing: 5.9, start: 6.38, often: 7.22, less: 7.7,
  meet: 8.96, royal: 9.18, school: 9.58, of: 9.98, music: 10.16, we: 11.0, bring: 11.16, you: 11.88, personalized: 12.56, home: 13.76,
  complete: 14.44, schools: 15.84, professional: 16.78, live: 17.28, performances: 17.74, events: 18.88, learn: 19.9, piano: 20.08,
  guitar: 20.86, violin: 21.62, singing: 22.3, drums: 22.96, qualified: 23.7, teachers: 24.18, build: 25.26, confidence: 25.44,
  develop: 26.0, skills: 26.66, prepare: 27.58, international: 28.16, certifications: 28.66, your: 30.3, musical: 30.46,
  journey: 30.84, starts: 31.26, here: 31.64, get: 32.52, touch: 32.74, today: 32.94,
};
export const w = (k: string) => W[k] + VO;

export const OUT = Easing.bezier(0.22, 1, 0.36, 1), INOUT = Easing.bezier(0.65, 0, 0.35, 1), SOFT = Easing.bezier(0.4, 0, 0.15, 1);
export const IN = Easing.bezier(0.55, 0, 0.9, 0.4);
export const c01 = (x: number) => Math.min(1, Math.max(0, x));
export const k = (t: number, a: number, d: number, e = OUT) => e(c01((t - a) / d));
export const mix = (a: number, b: number, p: number) => a + (b - a) * p;
/** an under-damped spring from 0 to 1 starting at a (f: Hz, z: damping) */
export const sp = (t: number, a: number, f = 1.8, z = 0.6) => {
  const u = t - a; if (u <= 0) return 0; const om = 2 * Math.PI * f;
  return 1 - Math.exp(-z * om * u) * (Math.cos(om * Math.sqrt(1 - z * z) * u) + (z / Math.sqrt(1 - z * z)) * Math.sin(om * Math.sqrt(1 - z * z) * u));
};
export const rnd = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
/** visible window: 0 before a, ramps in over din, holds, ramps out over dout ending at b */
export const win = (t: number, a: number, b: number, din = 0.35, dout = 0.35) => Math.min(k(t, a, din), 1 - k(t, b - dout, dout, INOUT));

/** a music note (eighth note, or a beamed pair) */
export const Note: React.FC<{ size: number; color: string; beamed?: boolean; style?: React.CSSProperties }> = ({ size, color, beamed, style }) => (
  <svg width={size * (beamed ? 1.1 : 0.7)} height={size} viewBox={beamed ? "0 0 110 100" : "0 0 70 100"} style={{ overflow: "visible", ...style }}>
    {beamed ? (
      <g fill={color}>
        <ellipse cx="22" cy="82" rx="20" ry="14" transform="rotate(-22 22 82)" />
        <ellipse cx="86" cy="74" rx="20" ry="14" transform="rotate(-22 86 74)" />
        <rect x="35" y="12" width="7" height="72" /><rect x="99" y="4" width="7" height="72" />
        <path d="M35 12 L106 4 L106 20 L35 28 Z" />
      </g>
    ) : (
      <g fill={color}>
        <ellipse cx="24" cy="82" rx="21" ry="15" transform="rotate(-22 24 82)" />
        <rect x="38" y="6" width="7" height="78" />
        <path d="M45 6 C 50 22, 70 28, 66 52 C 64 40, 56 32, 45 30 Z" />
      </g>
    )}
  </svg>
);

/** a burst of notes from (x, y) at time a: they fly out, slow, drift and fade (the site's note artwork, in motion) */
export const NoteBurst: React.FC<{ t: number; a: number; x: number; y: number; n?: number; reach?: number; seed?: number; life?: number; colors?: string[]; size?: number }> =
  ({ t, a, x, y, n = 60, reach = 900, seed = 1, life = 2.2, colors = NOTES, size = 70 }) => {
    const u = t - a; if (u < 0 || u > life + 0.6) return null;
    return (<>{Array.from({ length: n }, (_, i) => {
      const r1 = rnd(seed * 97 + i), r2 = rnd(seed * 31 + i * 7), r3 = rnd(seed * 13 + i * 3);
      const ang = r1 * Math.PI * 2, dist = reach * (0.35 + 0.65 * r2);
      const p = 1 - Math.exp(-u * 3.2);                       // fast out, long settle
      const v = 3.2 * Math.exp(-u * 3.2);                     // speed (for the blur)
      const px = x + Math.cos(ang) * dist * p, py = y + Math.sin(ang) * dist * p * 0.8 - u * 30;
      const op = c01(u / 0.08) * (1 - c01((u - life) / 0.6));
      const s = size * (0.55 + 0.8 * r3);
      return <div key={i} style={{ position: "absolute", left: 0, top: 0, opacity: op, transform: `translate(${px - s / 2}px, ${py - s / 2}px) rotate(${(r3 - 0.5) * 70 + u * 40 * (r1 - 0.5)}deg) scale(${0.4 + 0.6 * c01(u / 0.25)})`, filter: v > 0.3 ? `blur(${Math.min(8, v * 2.4)}px)` : undefined }}>
        <Note size={s} color={colors[i % colors.length]} beamed={i % 4 === 0} />
      </div>;
    })}</>);
  };

/** a word-by-word line rising out of a blur */
export const Rise: React.FC<{ text: string; t: number; at: number; size: number; color?: string; weight?: number; serif?: boolean; gap?: number; spacing?: string; times?: number[] }> =
  ({ text, t, at, size, color = C.ink, weight = 700, serif, gap = 0.07, spacing, times }) => (
    <div style={{ fontFamily: serif ? SERIF : SANS, fontWeight: serif ? 400 : weight, fontSize: size, color, lineHeight: 1.1, letterSpacing: spacing ?? (serif ? "0.04em" : "-0.02em"), whiteSpace: "nowrap" }}>
      {text.split(" ").map((wd, j) => { const p = c01(sp(t, times ? times[j] : at + j * gap, 1.7, 0.7)); return (
        <span key={j} style={{ display: "inline-block", marginRight: "0.26em", opacity: c01(p * 1.4), transform: `translateY(${(1 - p) * 0.45 * size}px)`, filter: p < 0.97 ? `blur(${(1 - p) * 10}px)` : undefined }}>{wd}</span>); })}
    </div>
  );

/** the logo: the traced mark on a teal tile */
export const Mark: React.FC<{ h: number; color?: string; d: string; aspect: number }> = ({ h, color = "#fff", d, aspect }) => (
  <svg width={h * aspect} height={h} viewBox={`0 0 ${aspect} 1`}><path d={d} fill={color} fillRule="evenodd" /></svg>
);

export const Wordmark: React.FC<{ size: number; color?: string; t?: number; at?: number[] }> = ({ size, color = C.teal, t, at }) => {
  const words = ["Royal", "School", "of", "Music"];
  return (
    <div style={{ fontFamily: SERIF, fontSize: size, color, letterSpacing: "0.06em", fontVariant: "small-caps", display: "flex", gap: size * 0.28, whiteSpace: "nowrap" }}>
      {words.map((wd, j) => { const p = t === undefined || !at ? 1 : c01(sp(t, at[j], 1.8, 0.7)); return (
        <span key={j} style={{ display: "inline-block", opacity: c01(p * 1.5), transform: `translateY(${(1 - p) * size * 0.5}px)`, filter: p < 0.97 ? `blur(${(1 - p) * 10}px)` : undefined }}>{wd}</span>); })}
    </div>
  );
};

export const Center: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", ...style }}>{children}</div>
);
