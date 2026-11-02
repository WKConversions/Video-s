// B3's helpers for S6 (the events) and S7 (the speakers): the event card's shared state (so S7 picks the card up
// exactly where S6 leaves it), the card faces, the flip, the logo's wave flattened into an underline, a gradient
// stroke that draws on by arc length, the site's date line as an odometer and a one-line roller.
import React from "react";
import { Img, staticFile } from "remotion";
import { C, SANS, SHADOW_L, W, H, c01, mix, k, sp, OUT, INOUT, markPoints, Pt } from "../kit";

let uid = 0;
const useUid = (p: string) => React.useMemo(() => `${p}${uid++}`, []);

// ------------------------------------------------------------------ the event card (S6 -> S7)
/** the grown event card: 1360 x 744 centred (960, 430), radius 28 */
export const EV = { cx: 960, cy: 430, w: 1360, h: 744, r: 28 };
/** the banner faces: each 2026 banner in its own shape (as on their events page), its opaque box drawn 1260 x 700 */
export const BAN = { w: 1260, h: 700 };
/** opaque boxes of the 1600-px banner PNGs (all from x 0, y 0; all ~1.80:1): Tatiana and Yago end short of the
 *  image's right edge, and every photo half has its own rounded, outlined right side */
const BOX: Record<string, number> = { tatiana: 873, yago: 854, charlie: 889 };
const S0 = 1280 / EV.w;                     // the event face first appears in the contract's 1280 x 700 card
/** the event face's scale: banner size until 14.55, then it springs to 1360 x 744 */
export const evScale = (t: number) => (t < 14.55 ? S0 : t >= 15.9 ? 1 : mix(S0, 1, sp(t, 14.55, 1.6, 0.75)));
/** the photo inside the event card settles 1.04 -> 1.0 (14.45 -> 15.0) */
export const evZoom = (t: number) => 1.04 - 0.04 * k(t, 14.45, 0.55, OUT);
/** talk.jpg (1600 x 1200: the talk in the stone-walled room) covering the 1360 x 744 card, framed at 50% 35% */
export const PHOTO = { src: "talk.jpg", w: 1360, h: 1020, top: -(1020 - 744) * 0.35 };
/** one flip's progress 0 -> 1 (a spring: fastest near the 90° swap, a small overshoot, settled in ~0.5 s) */
export const flip = (t: number, at: number) => 1 - (1 - sp(t, at, 1.9, 0.72)) * (1 - k(t, at + 0.5, 0.3, INOUT));   // exactly at rest from at + 0.8
/** how far into its turn a flip is (0 at rest, 1 edge-on): drives the small scale dip */
export const dipOf = (f: number) => Math.sin(Math.PI * c01(f));
export const lerpC = (a: string, b: string, p: number) => {
  const h = (s: string, i: number) => parseInt(s.slice(1 + 2 * i, 3 + 2 * i), 16);
  const c = [0, 1, 2].map((i) => Math.round(mix(h(a, i), h(b, i), c01(p))));
  return `rgb(${c[0]},${c[1]},${c[2]})`;
};

const Shade: React.FC<{ a: number }> = ({ a }) => (a > 0.002 ? <div style={{ position: "absolute", inset: 0, background: `rgba(16,16,20,${a.toFixed(3)})` }} /> : null);

/** one of their 2026 event banners, in its own shape: the PNG's alpha is the silhouette (their rounded corners and the
 *  outlined photo half, exactly as on the site), the soft shadow follows it, the flip shading darkens only the banner */
export const BannerFace: React.FC<{ name: string; shade?: number; children?: React.ReactNode }> = ({ name, shade = 0, children }) => {
  const s = BAN.h / BOX[name];
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: BAN.w, height: BAN.h }}>
      <Img src={staticFile(`img/banner-${name}.png`)} style={{ position: "absolute", left: 0, top: 0, width: 1600 * s, height: BAN.h,
        filter: `brightness(${(1 - shade).toFixed(3)}) drop-shadow(0 0 28px rgba(20,24,30,0.08)) drop-shadow(0 0 90px rgba(20,24,30,0.11))` }} />
      {children}
    </div>
  );
};
/** where a banner pixel (1600-px PNG coordinates) lands on its face */
export const banPx = (name: string, x: number, y: number): Pt => { const s = BAN.h / BOX[name]; return [x * s, y * s]; };

/** the event itself: the talk in the stone-walled room, laid out at 1360 x 744 (scaled by the caller) */
export const EventFace: React.FC<{ zoom: number; radius: number; shade?: number }> = ({ zoom, radius, shade = 0 }) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: EV.w, height: EV.h, borderRadius: radius, overflow: "hidden", background: C.charL, boxShadow: SHADOW_L }}>
    <Img src={staticFile(`img/${PHOTO.src}`)} style={{ position: "absolute", left: 0, top: 0, width: PHOTO.w, height: PHOTO.h,
      transform: `translate(0px, ${PHOTO.top.toFixed(3)}px) scale(${zoom.toFixed(5)})`, transformOrigin: `${EV.w / 2}px ${0.35 * EV.h - PHOTO.top}px` }} />
    <Shade a={shade} />
  </div>
);

// ------------------------------------------------------------------ the wave
/** the logo's wave flattened into an underline: its stroke runs from x0 over L px, centred on cy, hgt px crest to
 *  trough (low first hump, taller second hump, hook); returns the points and the mark's separate dot */
export const flatMark = (N: number, x0: number, L: number, cy: number, hgt: number): [Pt[], Pt] => {
  const s = L / 141, width = 160 * s, cx = x0 + 75 * s, fy = hgt / (68 * s);
  const pts = markPoints(N, cx, cy, width).map(([x, y]): Pt => [x, cy + (y - cy) * fy]);
  return [pts, [cx + 75 * s, cy + 6 * s * fy]];
};
export const arcLen = (pts: Pt[]) => { let L = 0; for (let i = 1; i < pts.length; i++) L += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); return L; };
/** the point at arc-length fraction f along pts */
export const pointAt = (pts: Pt[], f: number): Pt => {
  let d = c01(f) * arcLen(pts);
  for (let i = 1; i < pts.length; i++) {
    const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    if (d <= l || i === pts.length - 1) { const u = c01(d / (l || 1)); return [mix(pts[i - 1][0], pts[i][0], u), mix(pts[i - 1][1], pts[i][1], u)]; }
    d -= l;
  }
  return pts[pts.length - 1];
};
/** a point on the quadratic curve a -> b bending toward c */
export const bez = (a: Pt, c: Pt, b: Pt, s: number): Pt => [(1 - s) ** 2 * a[0] + 2 * (1 - s) * s * c[0] + s * s * b[0], (1 - s) ** 2 * a[1] + 2 * (1 - s) * s * c[1] + s * s * b[1]];

/** a stroke through pts with a 2-stop gradient (left -> right). p draws it on and from trims its start, both by arc length
 *  (no whole-point steps); the dot sits at the head, or at dotAt (the mark's separate dot). */
export const Poly: React.FC<{ pts: Pt[]; c1: string; c2: string; width: number; p?: number; from?: number; dot?: number; dotAt?: Pt; dotR?: number; vw?: number; vh?: number }> =
  ({ pts, c1, c2, width, p = 1, from = 0, dot = 0, dotAt, dotR, vw = W, vh = H }) => {
    const id = useUid("b3p");
    const n = pts.length; const cum = [0];
    for (let i = 1; i < n; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
    const L = cum[n - 1] || 1;
    const at = (f: number): Pt => {
      const d = c01(f) * L; let j = 1; while (j < n - 1 && cum[j] < d) j++;
      const a = pts[j - 1], b = pts[j], u = c01((d - cum[j - 1]) / (cum[j] - cum[j - 1] || 1));
      return [mix(a[0], b[0], u), mix(a[1], b[1], u)];
    };
    const f0 = c01(from), f1 = c01(p); const seg: Pt[] = [];
    if (f1 > f0 + 0.0005) { seg.push(at(f0)); for (let i = 0; i < n; i++) if (cum[i] > f0 * L && cum[i] < f1 * L) seg.push(pts[i]); seg.push(at(f1)); }
    const xs = pts.map((q) => q[0]); const x1 = Math.min(...xs), x2 = Math.max(...xs); const head = dotAt ?? at(f1);
    return (
      <svg width={vw} height={vh} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", pointerEvents: "none" }}>
        <defs><linearGradient id={id} gradientUnits="userSpaceOnUse" x1={x1} y1={0} x2={Math.max(x1 + 1, x2)} y2={0}><stop offset="0" stopColor={c1} /><stop offset="1" stopColor={c2} /></linearGradient></defs>
        {seg.length > 1 && <polyline points={seg.map((q) => `${q[0].toFixed(2)},${q[1].toFixed(2)}`).join(" ")} stroke={`url(#${id})`} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" fill="none" />}
        {dot > 0.001 && <circle cx={head[0]} cy={head[1]} r={Math.max(0, (dotR ?? width * 0.47) * dot)} fill={c2} />}
      </svg>
    );
  };

// ------------------------------------------------------------------ type
const MASK = "linear-gradient(to bottom, transparent 0%, #000 14%, #000 86%, transparent 100%)";
/** Albert Sans 500 advances (em), measured from public/fonts/albertsans.woff2 (its figures are proportional) */
const ADV: Record<string, number> = { "0": 0.635, "1": 0.314, "2": 0.598, "3": 0.597, "4": 0.654, "5": 0.623, "6": 0.607, "7": 0.557, "8": 0.628, "9": 0.607, "-": 0.523, ":": 0.256, " ": 0.28 };

/** the site's date line ('2026-10-15 19:00:00', Albert Sans 500) centred on the frame at cy. Between dates only the
 *  changing digits roll, the short way round, like an odometer (a spring per digit, 0.045 s apart); every glyph is
 *  placed with a transform, so the line re-centres smoothly while digits of different widths roll. */
export const Odometer: React.FC<{ t: number; dates: string[]; rolls: number[]; cy: number; size: number; color: string; style?: React.CSSProperties }> =
  ({ t, dates, rolls, cy, size, color, style }) => {
    const hb = size * 1.36, pitch = size * 1.3, n = dates[0].length; const order = rolls.map(() => 0);
    const slots: { w: number; g: [string, number][] }[] = [];
    for (let i = 0; i < n; i++) {
      const ch = dates[0][i];
      if (ch < "0" || ch > "9") { slots.push({ w: ADV[ch] * size, g: [[ch, 0]] }); continue; }
      let v = +ch;
      for (let j = 0; j < rolls.length; j++) {
        let d = (+dates[j + 1][i] - +dates[j][i] + 10) % 10; if (d > 5) d -= 10;
        if (d !== 0) { v += d * sp(t, rolls[j] + 0.045 * order[j], 2.0, 0.86); order[j]++; }
      }
      const fl = Math.floor(v + 1e-6), fr = c01(v - fl), a = ((fl % 10) + 10) % 10, b = (a + 1) % 10;
      const g: [string, number][] = [[String(a), -fr * pitch]]; if (fr > 0.002) g.push([String(b), (1 - fr) * pitch]);
      slots.push({ w: mix(ADV[String(a)], ADV[String(b)], fr) * size, g });
    }
    let x = W / 2 - slots.reduce((s, q) => s + q.w, 0) / 2; const spans: React.ReactNode[] = [];
    slots.forEach((q, i) => {
      q.g.forEach(([ch, y], m) => spans.push(
        <span key={`${i}.${m}`} style={{ position: "absolute", left: 0, top: 0, lineHeight: `${hb}px`, whiteSpace: "pre",
          transform: `translate(${(x + (q.w - ADV[ch] * size) / 2).toFixed(2)}px, ${y.toFixed(2)}px)` }}>{ch}</span>));
      x += q.w;
    });
    return (
      <div style={{ position: "absolute", left: 0, top: cy - hb / 2, width: W, height: hb, overflow: "hidden", fontFamily: SANS, fontWeight: 500, fontSize: size, color,
        WebkitMaskImage: MASK, maskImage: MASK, ...style }}>{spans}</div>
    );
  };

/** one centred line that rolls from text a to text b (a spring from `at`): a leaves upward, b arrives from below */
export const Roller: React.FC<{ t: number; a: string; b: string; at: number; cy: number; size: number; color: string; weight?: number; style?: React.CSSProperties }> =
  ({ t, a, b, at, cy, size, color, weight = 700, style }) => {
    const hb = size * 1.6, pitch = size * 1.5, e = sp(t, at, 1.8, 0.72);
    const line = (txt: string, y: number) => (
      <div style={{ position: "absolute", left: 0, top: 0, width: W, textAlign: "center", lineHeight: `${hb}px`, whiteSpace: "pre", transform: `translateY(${y.toFixed(2)}px)` }}>{txt}</div>
    );
    return (
      <div style={{ position: "absolute", left: 0, top: cy - hb / 2, width: W, height: hb, overflow: "hidden", fontFamily: SANS, fontWeight: weight, fontSize: size, color,
        letterSpacing: "-0.01em", WebkitMaskImage: MASK, maskImage: MASK, ...style }}>
        {e < 0.999 && line(a, -e * pitch)}
        {e > 0.001 && line(b, (1 - e) * pitch)}
      </div>
    );
  };

/** rise in (spring) and drop away (accelerating) for a text block: opacity, translate, a short blur */
export const riseStyle = (e: number, o: number, lift = 26, drop = 30): React.CSSProperties => ({
  opacity: c01(e * 1.6) * (1 - c01(o)),
  transform: `translateY(${((1 - e) * lift + c01(o) * drop).toFixed(2)}px)`,
  filter: e < 0.97 || o > 0.01 ? `blur(${((1 - c01(e)) * 8 + c01(o) * 8).toFixed(2)}px)` : undefined,
});
