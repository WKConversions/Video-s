// COYOR RUN ad: the extra animation layer (Karl, 17 Nov: "add lots of animations: click animations, effects, particles,
// so the video has much more"). Every effect is deterministic (a hash, never Math.random) and a function of film time T.
import React from "react";
import { AbsoluteFill } from "remotion";

const clamp = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
export const rnd = (k: number) => { const s = Math.sin(k * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
const GOLDS = ["#FFF2C4", "#FFDD70", "#E9C66A", "#F8F1E2"];
const CONF = ["#FFDD70", "#E9C66A", "#F8F1E2", "#7FE3EC", "#F6A27F", "#A9B1FF", "#FF8AC4"];

// a burst of particles from (x, y) at t0: sparks (streaks), dots, confetti (spinning rectangles) or coins
export const Burst: React.FC<{ T: number; t0: number; x: number; y: number; n?: number; speed?: number; life?: number; g?: number; size?: number;
  kind?: "spark" | "dot" | "confetti" | "coin"; colors?: string[]; seed?: number; up?: boolean; spread?: number }> =
  ({ T, t0, x, y, n = 26, speed = 900, life = 0.8, g = 900, size = 10, kind = "spark", colors = GOLDS, seed = 1, up = false, spread = Math.PI * 2 }) => {
    const t = T - t0;
    if (t < 0 || t > life * 1.6) return null;
    const els: React.ReactNode[] = [];
    for (let k = 0; k < n; k++) {
      const r1 = rnd(seed * 97 + k), r2 = rnd(seed * 131 + k * 7), r3 = rnd(seed * 17 + k * 3);
      const a = (up ? -Math.PI / 2 : 0) + (r1 - 0.5) * spread, v = speed * (0.35 + 0.8 * r2), L = life * (0.6 + 0.6 * r3);
      if (t > L) continue;
      const drag = 1 - Math.exp(-3.2 * t);                       // velocity decays (air), gravity pulls
      const px = x + Math.cos(a) * v * drag / 3.2, py = y + Math.sin(a) * v * drag / 3.2 + 0.5 * g * t * t;
      const o = 1 - (t / L) ** 2, c = colors[k % colors.length], s = size * (0.6 + 0.8 * r3);
      if (kind === "spark") {
        const vx = Math.cos(a) * v * Math.exp(-3.2 * t), vy = Math.sin(a) * v * Math.exp(-3.2 * t) + g * t, sp = Math.hypot(vx, vy) + 1;
        const len = Math.min(70, 8 + sp * 0.045);
        els.push(<line key={k} x1={px} y1={py} x2={px - (vx / sp) * len} y2={py - (vy / sp) * len} stroke={c} strokeWidth={s * 0.45} strokeLinecap="round" opacity={o} />);
      } else if (kind === "confetti") {
        const rot = (r1 * 720 + t * 540 * (r2 > 0.5 ? 1 : -1)) % 360, w = s * 1.4, h = s * 0.7 * Math.abs(Math.cos(t * 9 + k));
        els.push(<rect key={k} x={px - w / 2} y={py - h / 2} width={w} height={Math.max(1, h)} fill={c} opacity={o} transform={`rotate(${rot} ${px} ${py})`} />);
      } else if (kind === "coin") {
        const sx = Math.max(0.15, Math.abs(Math.cos(t * 8 + k)));
        els.push(<g key={k} opacity={o} transform={`translate(${px} ${py}) scale(${sx} 1)`}><circle r={s} fill="#F2CF6E" stroke="#B4842F" strokeWidth={s * 0.18} />
          <text y={s * 0.38} fontSize={s * 0.9} fontWeight={900} fontStyle="italic" fontFamily="'Barlow Condensed'" fill="#5E3F0C" textAnchor="middle">CY</text></g>);
      } else {
        els.push(<circle key={k} cx={px} cy={py} r={s * 0.5} fill={c} opacity={o} />);
      }
    }
    return <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>{els}</svg>;
  };

// a shockwave ring (and a soft flash) where something lands
export const Shock: React.FC<{ T: number; t0: number; x: number; y: number; r?: number; color?: string; w?: number; ry?: number }> = ({ T, t0, x, y, r = 420, color = "#FFDD70", w = 10, ry }) => {
  const t = T - t0; if (t < 0 || t > 0.6) return null;
  const p = 1 - (1 - t / 0.6) ** 3, rr = 30 + r * p;
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
      <ellipse cx={x} cy={y} rx={rr} ry={ry ? rr * ry : rr} fill="none" stroke={color} strokeWidth={w * (1 - p) + 1} opacity={0.9 * (1 - p)} />
      <ellipse cx={x} cy={y} rx={rr * 0.6} ry={(ry ? rr * ry : rr) * 0.6} fill={color} opacity={0.18 * (1 - p)} />
    </svg>
  );
};

// a tap: a finger dot that presses and rings that spread (mobile "click" animation), optional label
export const Tap: React.FC<{ T: number; t0: number; x: number; y: number; label?: string; color?: string }> = ({ T, t0, x, y, label, color = "#F8F1E2" }) => {
  const t = T - t0; if (t < -0.12 || t > 0.7) return null;
  const press = t < 0 ? 1 + t / 0.12 : Math.max(0, 1 - t / 0.18);
  const rings = [0, 0.12].map((d, i) => { const q = clamp((t - d) / 0.55); return q <= 0 ? null :
    <circle key={i} cx={x} cy={y} r={34 + 120 * (1 - (1 - q) ** 2)} fill="none" stroke={color} strokeWidth={5 * (1 - q) + 1} opacity={0.85 * (1 - q)} />; });
  return (
    <>
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
        {rings}
        <circle cx={x} cy={y} r={30 + 8 * (1 - press)} fill={color} opacity={0.22 + 0.35 * press} />
        <circle cx={x} cy={y} r={14} fill={color} opacity={0.9 * clamp(1 - t / 0.5)} />
      </svg>
      {label && <div style={{ position: "absolute", left: x, top: y + 70, transform: "translateX(-50%)", fontFamily: "'DM Sans'", fontWeight: 700, fontSize: 28, letterSpacing: 4,
        color, opacity: clamp(1 - t / 0.6) * 0.9, whiteSpace: "nowrap", textShadow: "0 4px 12px rgba(0,0,0,.6)" }}>{label}</div>}
    </>
  );
};

// a swipe hint: an arrow sliding sideways with a trail (lane change)
export const Swipe: React.FC<{ T: number; t0: number; x: number; y: number; dir: 1 | -1 }> = ({ T, t0, x, y, dir }) => {
  const t = T - t0; if (t < 0 || t > 0.55) return null;
  const p = 1 - (1 - t / 0.55) ** 2, dx = dir * 220 * p, o = Math.sin(Math.PI * (t / 0.55));
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }} opacity={o}>
      <line x1={x} y1={y} x2={x + dx} y2={y} stroke="#F8F1E2" strokeWidth={10} strokeLinecap="round" opacity={0.35} />
      <circle cx={x + dx} cy={y} r={26} fill="#F8F1E2" opacity={0.9} />
      <path d={`M${x + dx + dir * 44},${y} l${-dir * 22},-20 M${x + dx + dir * 44},${y} l${-dir * 22},20`} stroke="#F8F1E2" strokeWidth={8} strokeLinecap="round" fill="none" />
    </svg>
  );
};

// "+10" with a coin, floating up and fading
export const Plus: React.FC<{ T: number; t0: number; x: number; y: number; text?: string; size?: number }> = ({ T, t0, x, y, text = "+10", size = 54 }) => {
  const t = T - t0; if (t < 0 || t > 0.9) return null;
  const s = t < 0.14 ? 0.5 + 0.7 * (t / 0.14) : 1.2 - 0.2 * clamp((t - 0.14) / 0.2);
  return (
    <div style={{ position: "absolute", left: x, top: y - 140 * (1 - (1 - t / 0.9) ** 2), transform: `translate(-50%,-50%) scale(${s})`, opacity: clamp((0.9 - t) / 0.3),
      fontFamily: "'Barlow Condensed'", fontWeight: 900, fontStyle: "italic", fontSize: size, color: "#FFDD70", whiteSpace: "nowrap",
      textShadow: "0 4px 0 #8A6216, 0 8px 18px rgba(0,0,0,.5)" }}>{text}</div>
  );
};

// radial speed lines (a burst at a cut)
export const Speed: React.FC<{ T: number; t0: number; x?: number; y?: number; seed?: number }> = ({ T, t0, x = 540, y = 960, seed = 3 }) => {
  const t = T - t0; if (t < 0 || t > 0.32) return null;
  const p = t / 0.32;
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
      {Array.from({ length: 34 }, (_, k) => {
        const a = (k / 34) * Math.PI * 2 + rnd(seed + k) * 0.15, r0 = 380 + 300 * rnd(seed * 3 + k) + 700 * p, r1 = r0 + 160 + 240 * rnd(seed * 5 + k);
        return <line key={k} x1={x + Math.cos(a) * r0} y1={y + Math.sin(a) * r0} x2={x + Math.cos(a) * r1} y2={y + Math.sin(a) * r1} stroke="#fff" strokeWidth={3 + 4 * rnd(k)} opacity={0.55 * (1 - p)} strokeLinecap="round" />;
      })}
    </svg>
  );
};

// a light sweep across a box (cards, buttons, price tags)
export const Sheen: React.FC<{ T: number; t0: number; dur?: number; radius?: number; color?: string }> = ({ T, t0, dur = 0.6, radius = 0, color = "rgba(255,255,255,.55)" }) => {
  const p = (T - t0) / dur; if (p < 0 || p > 1) return null;
  return (
    <div style={{ position: "absolute", inset: 0, borderRadius: radius, overflow: "hidden", pointerEvents: "none" }}>
      <div style={{ position: "absolute", top: "-20%", bottom: "-20%", width: "38%", left: `${-45 + 150 * p}%`, transform: "skewX(-22deg)",
        background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />
    </div>
  );
};

// twinkles: four-point stars blinking at seeded spots inside a box
export const Twinkles: React.FC<{ T: number; x: number; y: number; w: number; h: number; n?: number; seed?: number; op?: number; size?: number }> = ({ T, x, y, w, h, n = 10, seed = 5, op = 1, size = 34 }) => (
  <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }} opacity={op}>
    {Array.from({ length: n }, (_, k) => {
      const px = x + w * rnd(seed + k * 3), py = y + h * rnd(seed * 7 + k), ph = rnd(seed * 11 + k) * 6.28, per = 0.9 + rnd(k + seed) * 0.8;
      const q = Math.max(0, Math.sin((T / per) * Math.PI * 2 + ph)) ** 3, s = size * (0.5 + rnd(k * 13 + seed)) * q;
      if (s < 1) return null;
      return <path key={k} d={`M${px},${py - s} Q${px},${py} ${px + s},${py} Q${px},${py} ${px},${py + s} Q${px},${py} ${px - s},${py} Q${px},${py} ${px},${py - s} Z`} fill="#FFF6D8" opacity={0.95} />;
    })}
  </svg>
);

// floating gold dust over everything (the frame is never still)
export const Dust: React.FC<{ T: number; op?: number }> = ({ T, op = 1 }) => (
  <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }} opacity={op}>
    {Array.from({ length: 34 }, (_, k) => {
      const sp = 40 + 90 * rnd(k * 5), x = (1080 * rnd(k * 3) + 30 * Math.sin(T * 0.8 + k)) % 1080, y = (1920 + 60 - ((T * sp + 1980 * rnd(k * 7)) % 1980)) - 30;
      const r = 1.5 + 3.5 * rnd(k * 11), tw = 0.35 + 0.65 * Math.abs(Math.sin(T * (1 + rnd(k)) * 2 + k));
      return <circle key={k} cx={x} cy={y} r={r} fill={k % 4 === 0 ? "#F8F1E2" : "#FFDD70"} opacity={0.5 * tw} />;
    })}
  </svg>
);

// screen shake: the offset at T from a list of hits (decaying, small, never on a still picture for long)
export const shakeAt = (T: number, hits: number[], amp = 14) => {
  let x = 0, y = 0;
  for (const h of hits) { const t = T - h; if (t < 0 || t > 0.35) continue; const a = amp * Math.exp(-t * 13); x += a * Math.sin(t * 95 + h); y += a * Math.cos(t * 83 + h * 2); }
  return [x, y];
};

// rays behind a badge (an unlock)
export const Rays: React.FC<{ T: number; t0: number; x: number; y: number; r?: number; color?: string }> = ({ T, t0, x, y, r = 360, color = "rgba(255,221,112,.32)" }) => {
  const t = T - t0; if (t < 0 || t > 1.4) return null;
  const o = Math.min(1, t / 0.2) * (1 - clamp((t - 1.0) / 0.4)), rot = t * 40;
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }} opacity={o}>
      <g transform={`translate(${x} ${y}) rotate(${rot})`}>
        {Array.from({ length: 14 }, (_, k) => { const a = (k / 14) * Math.PI * 2, b = a + 0.12; return <path key={k} d={`M0,0 L${Math.cos(a) * r},${Math.sin(a) * r} L${Math.cos(b) * r},${Math.sin(b) * r} Z`} fill={color} />; })}
      </g>
    </svg>
  );
};

export const Layer: React.FC<{ children: React.ReactNode }> = ({ children }) => <AbsoluteFill style={{ pointerEvents: "none" }}>{children}</AbsoluteFill>;
