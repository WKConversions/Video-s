// S12 Outro (36.05-42.4, lead), Karl's reference 16 (35-40 s): on cream, "From your next project / to your next partnership /
// find your people" word by word on the VO. The first phrase tightens its spacing as it completes; the next ones swap in with a
// wave (out upward with a tilt, in from below). The last phrase is pushed off left while the coral circle comes in from the right;
// on "Duendr" their app icon grows around it (the dark tile out of the circle, the cream bar shooting up: the "d"), the icon shrinks
// left and the wordmark slides out from behind it, its coral dot last; the lockup breathes to the end.
import React from "react";
import { C, SANS, SHADOW_L, c01, k, sp, w, mix, IN, INOUT, SOFT, Icon, Wordmark } from "../kit";
import { H } from "../handoff";
import { Scene } from "./types";

const SIZE = 118;
const PRE = 0.1; // a word starts rising this long before it is spoken
type Ph = { words: string[]; times: number[]; key: number; exit: number };
const PH: Ph[] = [
  { words: ["From", "your", "next", "project"], times: [w("from"), w("your", 5), w("next", 1), w("project")], key: 3, exit: 36.94 },
  { words: ["to", "your", "next", "partnership"], times: [w("to", 1), w("your", 6), w("next", 2), w("partnership")], key: 3, exit: 38.54 },
  { words: ["find", "your", "people"], times: [w("find", 2), w("your", 7), w("people")], key: 2, exit: 99 },
];
const T_ON = w("on", 1), T_DUENDR = w("duendr", 1);

// the push of the last phrase and the circle's entrance (x offsets in px), and their per-frame speed for a horizontal blur
const pushX = (t: number) => -1700 * k(t, 39.5, 0.66, IN) - 26 * k(t, 38.9, 0.9, SOFT);
const circX = (t: number) => 1250 * (1 - c01(sp(t, T_ON - 0.12, 1.15, 0.86)));
const speed = (f: (t: number) => number, t: number) => Math.abs(f(t) - f(t - 1 / 60));

const Word: React.FC<{ t: number; text: string; at: number; exit: number; j: number; color: string; dx: number }> = ({ t, text, at, exit, j, color, dx }) => {
  const q = c01(sp(t, at, 1.9, 0.78));
  const u = k(t, exit + j * 0.035, 0.24, IN);
  if (q <= 0 || u >= 1) return <span style={{ display: "inline-block", marginRight: "0.24em", opacity: 0 }}>{text}</span>;
  let y = (1 - q) * 0.42 * SIZE - u * 0.45 * SIZE; if (Math.abs(y) < 0.6) y = 0;
  let r = (1 - q) * 7 - u * 9; if (Math.abs(r) < 0.05) r = 0;
  const b = (1 - q) * 9 + u * 8;
  const moving = y !== 0 || r !== 0 || Math.abs(dx) > 0.01;
  return (
    <span style={{ display: "inline-block", marginRight: "0.24em", color, opacity: c01(q * 1.6) * (1 - u), transformOrigin: "50% 80%",
      transform: `translate(${dx}px, ${y}px) rotate(${r}deg)`, filter: b > 0.3 ? `blur(${b}px)` : undefined, willChange: moving ? "transform" : undefined }}>{text}</span>
  );
};

const Phrase: React.FC<{ t: number; p: Ph; i: number }> = ({ t, p, i }) => {
  if (t < p.times[0] - PRE || t > p.exit + 0.45) return null;
  const n = p.words.length;
  // the first phrase arrives spread out and draws together as it completes (the reference's tightening)
  const gap = i === 0 ? 74 * (1 - k(t, p.times[0], 0.86, SOFT)) : 0;
  const px = i === 2 ? pushX(t) : i === 1 ? -22 * k(t, p.times[0], 1.5, SOFT) : 0;
  const bx = i === 2 ? Math.min(30, speed(pushX, t) * 0.55) : 0;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, display: "flex", alignItems: "center", justifyContent: "center",
      transform: px ? `translateX(${px}px)` : undefined, filter: bx > 0.5 ? `url(#s12-hb${Math.round(bx)})` : undefined }}>
      <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: SIZE, lineHeight: 1.04, letterSpacing: "-0.035em", whiteSpace: "nowrap", marginRight: "-0.24em" }}>
        {p.words.map((wd, j) => (
          <Word key={j} t={t} text={wd} at={p.times[j] - PRE} exit={p.exit} j={j} color={j === p.key ? C.coral : C.ink} dx={(j - (n - 1) / 2) * gap} />
        ))}
      </div>
    </div>
  );
};

// the app icon: big at the centre on "Duendr", then the lockup (icon + wordmark in ink with the coral dot) centred on the frame
const S_BIG = 520, S_LOCK = 176, WM_H = 128, GAP = 44;
const LOCK_W = S_LOCK + GAP + WM_H * 4.454;
const LOCK_X = 960 - LOCK_W / 2 + S_LOCK / 2;           // the icon's centre in the lockup
const WM_X = 960 - LOCK_W / 2 + S_LOCK + GAP;           // the wordmark's left edge
const CIRC = [199.5 / 512, 311.5 / 512];                 // the circle's centre inside the icon (fraction of its side)

const Outro: React.FC<{ t: number }> = ({ t }) => {
  if (t < H.cream.t) return null;
  const p = k(t, T_DUENDR + 0.34, 0.66, INOUT);                     // big -> lockup
  const s = mix(S_BIG, S_LOCK, p), mx = mix(960, LOCK_X, p), x0 = mx - s / 2, y0 = 540 - s / 2;
  const cx = circX(t), cb = Math.min(26, speed(circX, t) * 0.55);
  const tile = c01(sp(t, T_DUENDR - 0.08, 1.7, 0.78));              // the dark tile grows out of the circle
  const bar = c01(sp(t, T_DUENDR - 0.02, 2.0, 0.74));               // the cream bar shoots up beside it: the "d"
  const r = k(t, T_DUENDR + 0.52, 0.55, SOFT);                       // the wordmark slides out from behind the icon
  const dot = c01(sp(t, T_DUENDR + 0.98, 2.2, 0.7));
  const breath = 1 + 0.036 * c01((t - (T_DUENDR + 0.9)) / 1.45);    // a slow breath to the end
  return (
    <div style={{ position: "absolute", inset: 0, background: C.paper, overflow: "hidden" }}>
      <svg width={0} height={0} style={{ position: "absolute" }}>
        <defs>{Array.from({ length: 31 }, (_, i) => <filter key={i} id={`s12-hb${i}`} x="-20%" y="-10%" width="140%" height="120%"><feGaussianBlur stdDeviation={`${i} 0`} /></filter>)}</defs>
      </svg>
      {PH.map((ph, i) => <Phrase key={i} t={t} p={ph} i={i} />)}
      {t > T_ON - 0.15 && (
        <div style={{ position: "absolute", inset: 0, transform: breath !== 1 ? `scale(${breath})` : undefined }}>
          {/* the wordmark, revealed left to right as it slides out from behind the icon */}
          {r > 0 && (
            <div style={{ position: "absolute", left: WM_X, top: 540 - WM_H / 2, clipPath: `inset(-20% ${(1 - r) * 100}% -20% 0)`,
              transform: `translateX(${(1 - r) * -110}px)`, opacity: c01(r * 3) }}>
              <Wordmark h={WM_H} color={C.ink} dot={dot} />
            </div>
          )}
          {/* the tile (growing about the circle's centre), the cream bar, then the coral circle on top */}
          {tile > 0 && (
            <div style={{ position: "absolute", left: 0, top: 0, width: s, height: s, borderRadius: s * 0.2227, background: "#151413", boxShadow: SHADOW_L,
              transformOrigin: `${CIRC[0] * s}px ${CIRC[1] * s}px`, transform: `translate(${x0}px, ${y0}px) scale(${tile})` }} />
          )}
          <div style={{ position: "absolute", left: 0, top: 0, transform: `translate(${x0}px, ${y0}px)` }}>
            <Icon s={s} tile={false} circle={0} bar={bar} barColor={C.cream} />
          </div>
          <div style={{ position: "absolute", left: 0, top: 0, transform: `translate(${x0 + cx}px, ${y0}px)`, filter: cb > 0.5 ? `url(#s12-hb${Math.round(cb)})` : undefined }}>
            <Icon s={s} tile={false} circle={1} bar={0} />
          </div>
        </div>
      )}
    </div>
  );
};

export const S12: Scene = { id: "S12", t0: H.cream.t, t1: 42.4, C: Outro };
