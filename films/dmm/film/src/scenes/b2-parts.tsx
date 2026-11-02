// B2 (S4 + S5): the drawn parts: the stage (wave, hero cards, dot, light pulse), the top-slot type, the rings.
import React from "react";
import { C, OUT, Photo, SANS, SHADOW, WavePoly, c01, k, mix, sp } from "../kit";
import { H } from "../handoff";
import { CARDS, LCUM, LINE, LTOT, NP, RING_C, RING_SPEED, RING_T, T_LAND, camAt, cardAt, pulseAt, waveAt } from "./b2-model";

let uid = 0;
const useId = (p: string) => React.useMemo(() => `${p}${uid++}`, [p]);

/** x, y on the community line at arc length s (px) */
const onLine = (s: number): [number, number] => {
  let i = 0; while (i < NP - 2 && LCUM[i + 1] < s) i++;
  const u = c01((s - LCUM[i]) / (LCUM[i + 1] - LCUM[i] || 1));
  return [mix(LINE[i][0], LINE[i + 1][0], u), mix(LINE[i][1], LINE[i + 1][1], u)];
};

/** a light pulse running along the line, left to right (10.00 -> 10.60) */
const Pulse: React.FC<{ u: number; width: number }> = ({ u, width }) => {
  const id = useId("b2pu");
  const sc = u * LTOT, [cx, cy] = onLine(Math.min(LTOT, sc));
  const pts = LINE.filter((_, i) => Math.abs(LCUM[i] - sc) <= 150);
  const fade = 1 - k(u, 0.96, 0.12);
  if (pts.length < 2 || fade <= 0) return null;
  const P = pts.map((q) => `${q[0].toFixed(1)},${q[1].toFixed(1)}`).join(" ");
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", pointerEvents: "none", opacity: fade }}>
      <defs><linearGradient id={id} gradientUnits="userSpaceOnUse" x1={cx - 110} x2={cx + 110} y1={0} y2={0}>
        <stop offset="0" stopColor="#FFFFFF" stopOpacity="0" /><stop offset="0.55" stopColor="#FFFFFF" stopOpacity="1" /><stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
      </linearGradient>
      <radialGradient id={`${id}h`} gradientUnits="userSpaceOnUse" cx={cx} cy={cy} r={95}>
        <stop offset="0" stopColor="#E8FBFF" stopOpacity="0.55" /><stop offset="0.4" stopColor="#9EE6FD" stopOpacity="0.22" /><stop offset="1" stopColor="#9EE6FD" stopOpacity="0" />
      </radialGradient></defs>
      <circle cx={cx} cy={cy} r={95} fill={`url(#${id}h)`} />
      <polyline points={P} stroke={`url(#${id})`} strokeWidth={width + 22} strokeLinecap="round" strokeLinejoin="round" fill="none" opacity={0.35} />
      <polyline points={P} stroke={`url(#${id})`} strokeWidth={width * 0.62} strokeLinecap="round" strokeLinejoin="round" fill="none" opacity={0.95} />
    </svg>
  );
};

/** one of the hero's rounded photo cards */
const Card: React.FC<{ i: number; t: number; px: number | null }> = ({ i, t, px }) => {
  const c = CARDS[i], st = cardAt(i, t);
  if (!st.on) return null;
  const lit = c01(st.lift / 14), left = st.x - st.w / 2, band = st.w * 0.5;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: st.w, height: st.h, transform: `translate(${left}px, ${st.y - st.h / 2 - st.lift}px) rotate(${st.rot}deg) scale(${st.sc})` }}>
      <Photo src={c.src} w={st.w} h={st.h} r={28} pos={c.pos}
        shadow={lit > 0.01 ? `${SHADOW}, 0 0 0 ${(2.5 * lit).toFixed(2)}px rgba(158,230,253,${(0.85 * lit).toFixed(3)}), 0 0 ${(44 * lit).toFixed(1)}px rgba(73,216,237,${(0.42 * lit).toFixed(3)})` : SHADOW}>
        {lit > 0.01 && <div style={{ position: "absolute", inset: 0, background: `rgba(255,255,255,${0.12 * lit})` }} />}
        {px !== null && st.sheen >= 0 && px > left - band && px < left + st.w + band && (
          <div style={{ position: "absolute", left: 0, top: 0, width: band, height: st.h, transform: `translateX(${px - left - band / 2}px)`,
            background: "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(232,251,255,0.42) 50%, rgba(255,255,255,0) 100%)" }} />
        )}
      </Photo>
    </div>
  );
};

/** the wave's dot (from the logo); after landing it is the pin */
const Dot: React.FC<{ x: number; y: number; r: number; glow: number; sx?: number; sy?: number }> = ({ x, y, r, glow, sx = 1, sy = 1 }) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: r * 2, height: r * 2, borderRadius: r, background: C.cyanL,
    boxShadow: glow > 0.01 ? `0 0 ${18 + 30 * glow}px rgba(158,230,253,${0.6 * glow}), 0 0 ${60 * glow}px rgba(73,216,237,${0.35 * glow})` : undefined,
    transform: `translate(${x - r}px, ${y - r}px) scale(${sx}, ${sy})` }} />
);

/** the wave, the four cards and the dot, under the camera (S4's pull; 1 from 10.1). dot: draw the dot (S6 owns it from 12.45) */
export const Stage: React.FC<{ t: number; dot?: boolean }> = ({ t, dot = true }) => {
  const wv = waveAt(t), s = camAt(t), pu = pulseAt(t);
  const px = pu > -0.2 && pu < 1.2 ? onLine(c01(pu) * LTOT)[0] : null;
  let d = { x: wv.dot[0], y: wv.dot[1], r: wv.dotR, glow: wv.glow, sx: 1, sy: 1 };
  if (t >= T_LAND) {   // the landing: one small settle, a short glow; exact H.pin from 12.40
    const u = t - T_LAND, lock = 1 - k(t, 12.2, 0.2), dd = Math.exp(-u * 9) * Math.sin(u * 22) * lock;
    d = { x: wv.dot[0], y: wv.dot[1] + 6 * dd, r: H.pin.r, glow: 0.7 * Math.exp(-u * 4.5) * lock, sx: 1 + 0.16 * dd, sy: 1 - 0.16 * dd };
  }
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: s !== 1 ? `scale(${s})` : undefined, transformOrigin: "960px 540px" }}>
      {wv.show && <WavePoly pts={wv.pts} width={wv.width} from={wv.from} />}
      {pu > 0 && pu < 1.1 && <Pulse u={pu} width={wv.width} />}
      {CARDS.map((c, i) => <Card key={c.src} i={i} t={t} px={px} />)}
      {dot && <Dot {...d} />}
    </div>
  );
};

/** the top slot: one line, laid out at its final width (words appear in place); from 1 = rises from below,
 *  -1 = drops in from above; outDir 1 = drops out (the roll), -1 = lifts away */
export type Wd = { s: string; at: number; cyan?: boolean };
export const SLOT_TOP = 112;
export const Slot: React.FC<{ t: number; words: Wd[]; from: 1 | -1; outAt: number; outDir: 1 | -1; size?: number }> = ({ t, words, from, outAt, outDir, size = 100 }) => {
  if (t < words[0].at - 0.02 || t > outAt + (words.length - 1) * 0.035 + 0.27) return null;
  return (
    <div style={{ position: "absolute", left: 0, top: SLOT_TOP, width: 1920, textAlign: "center", fontFamily: SANS, fontWeight: 700, fontSize: size,
      lineHeight: 1.06, letterSpacing: "-0.025em", whiteSpace: "nowrap", color: C.white }}>
      {words.map((wd, j) => {
        const q = c01(sp(t, wd.at, 1.7, 0.74)), ox = c01((t - outAt - j * 0.035) / 0.26), o = ox ** 3, of = c01(1.6 * ox * ox);
        return (
          // moving words get their own layer (slow glyphs otherwise snap to whole pixels), dropped at rest (build-gotchas)
          <span key={j} style={{ display: "inline-block", marginRight: j < words.length - 1 ? "0.24em" : 0, color: wd.cyan ? C.cyan : C.white,
            willChange: (q > 0 && q < 1) || (ox > 0 && ox < 1) ? "transform" : undefined,
            opacity: c01(q * 1.6) * (1 - of), transform: `translateY(${(1 - q) * 0.42 * size * from + o * 0.36 * size * outDir}px)`,
            filter: q < 0.97 || of > 0.01 ? `blur(${(1 - q) * 10 + of * 10}px)` : undefined }}>{wd.s}</span>
        );
      })}
    </div>
  );
};

/** S4: three cyan rings out of the dot across the contour field (with the spine's ripples), to the frame edges */
export const Rings: React.FC<{ t: number }> = ({ t }) => {
  const live = RING_T.map((a) => t - a).filter((age) => age > 0 && age < 1.4);
  if (!live.length) return null;
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none" }}>
      {live.map((age, i) => <circle key={i} cx={RING_C[0]} cy={RING_C[1]} r={14 + age * RING_SPEED} fill="none" stroke={C.cyan} strokeWidth={4}
        opacity={0.25 * (1 - age / 1.4) ** 1.3} />)}
    </svg>
  );
};

/** S5: the pin's ping, a ring that goes out to meet the summit's rings */
export const Ping: React.FC<{ t: number }> = ({ t }) => {
  const rings = [0, 0.14].map((d) => c01((t - T_LAND - d) / 0.75)).filter((u) => u > 0 && u < 1);
  if (!rings.length) return null;
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none" }}>
      {rings.map((u, i) => <circle key={i} cx={H.pin.x} cy={H.pin.y} r={H.pin.r + (i ? 100 : 150) * OUT(u)} fill="none" stroke={C.cyanL} strokeWidth={i ? 3 : 4}
        opacity={(i ? 0.4 : 0.7) * (1 - u) ** 1.4} />)}
    </svg>
  );
};
