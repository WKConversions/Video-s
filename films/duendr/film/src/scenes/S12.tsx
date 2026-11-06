// S12 Outro (36.05-42.4, lead), Karl's reference 16 (35-40 s): on cream, "From your next project / to your next partnership /
// find your people" word by word on the VO. The first phrase stays centred as its words join from the right with wide gaps that
// tighten; the next ones swap in with a wave (out upward with a tilt, in from below). The last phrase is pushed off left while the
// coral circle comes in from the right in lockstep; on "Duendr" their app icon grows around it (the dark tile out of the circle,
// the cream bar shooting up: the "d") and holds big; it shrinks at the centre, slides left, the wordmark slides in to its right,
// its coral dot last; the lockup breathes to the end.
import React from "react";
import { C, SANS, SHADOW_L, c01, k, sp, w, mix, IN, INOUT, OUT, SOFT, Icon, Wordmark } from "../kit";
import { H } from "../handoff";
import { emW, useFonts } from "./b1-lib";
import { Scene } from "./types";

const SIZE = 118, LS = -0.035;
const PRE = 0.1; // a word starts rising this long before it is spoken
type Ph = { words: string[]; at: number[]; key: number; exit: number };
const PH: Ph[] = [
  { words: ["From", "your", "next", "project"], at: [H.cream.t, w("your", 5) - PRE, w("next", 1) - PRE, w("project") - PRE], key: 3, exit: 36.94 },
  { words: ["to", "your", "next", "partnership"], at: [37.12, w("your", 6) - PRE, w("next", 2) - PRE, w("partnership") - PRE], key: 3, exit: 38.54 },
  { words: ["find", "your", "people"], at: [38.9, w("your", 7) - PRE, w("people") - PRE], key: 2, exit: 99 },
];
// measured onsets of the last two words (the VO's RMS envelope; the transcript's times run 0.1-0.2 s early here)
const T_PUSH = 39.78, T_DUENDR = 40.14;

// the push: the last phrase and the coral circle move in lockstep, like an iOS push
const P = (t: number) => k(t, T_PUSH, 0.42, INOUT);
const textX = (t: number) => -16 * c01((t - 38.9) / 0.88) - 1400 * P(t);
const circX = (t: number) => 1400 * (1 - P(t));
const speed = (f: (t: number) => number, t: number) => Math.abs(f(t) - f(t - 1 / 60));
const hb = (v: number) => (v > 0.5 ? `url(#s12-hb${Math.round(v)})` : undefined);

const rise = (t: number, at: number, first: boolean) => c01(first ? sp(t, at, 1.5, 0.8) : sp(t, at, 1.9, 0.78));
const exitOf = (t: number, exit: number, j: number) => k(t, exit + j * 0.035 - (j < 2 ? 0.04 : 0), 0.2, IN);

const Word: React.FC<{ t: number; text: string; q: number; u: number; color: string; x?: number }> = ({ t, text, q, u, color, x }) => {
  if (q <= 0 || u >= 1) return null;
  let y = (1 - q) * 0.42 * SIZE - u * 0.45 * SIZE; if (Math.abs(y) < 0.6) y = 0;
  let r = (1 - q) * 7 - u * 9; if (Math.abs(r) < 0.05) r = 0;
  const b = (1 - q) * 9 + u * 8;
  const pos = x === undefined ? "" : `translateX(${x}px) `;
  return (
    <span style={{ display: "inline-block", ...(x === undefined ? { marginRight: "0.24em" } : { position: "absolute", left: 0, top: 0 }), color, opacity: c01(q * 1.6) * (1 - u),
      transformOrigin: "50% 80%", transform: `${pos}translateY(${y}px) rotate(${r}deg)`, filter: b > 0.3 ? `blur(${b}px)` : undefined, willChange: "transform" }}>{text}</span>
  );
};

// phrase 1: measured slots, so the visible words stay centred while each new word joins from the right with a wide gap that tightens
const Phrase1: React.FC<{ t: number; p: Ph }> = ({ t, p }) => {
  if (t > p.exit + 0.45) return null;
  const items = p.words.map((wd, j) => {
    const q = rise(t, p.at[j], j === 0), settle = k(t, p.at[j], 0.6, OUT);
    return { wd, j, q, gap: SIZE * (0.24 + 0.34 * (1 - settle)), wdt: emW(wd, 800, LS) * SIZE };
  });
  // the line is centred on the risen part of each word, while each word sits at its full position (gap included), so a new word
  // appears at the right with a wide gap and the line re-centres as it settles
  const total = items.reduce((a, it) => a + (it.wdt + (it.j > 0 ? it.gap : 0)) * it.q, 0);
  let x = 960 - total / 2 - 20 * c01((t - H.cream.t) / 1.2);   // and a slow drift left over its life
  return (
    <div style={{ position: "absolute", left: 0, top: 540 - SIZE * 0.52, fontFamily: SANS, fontWeight: 800, fontSize: SIZE, lineHeight: 1.04, letterSpacing: `${LS}em`, whiteSpace: "nowrap" }}>
      {items.map((it) => {
        if (it.j > 0) x += it.gap;
        const left = x; x += it.wdt;
        return <Word key={it.j} t={t} text={it.wd} q={it.q} u={exitOf(t, p.exit, it.j)} color={it.j === p.key ? C.coral : C.ink} x={left} />;
      })}
    </div>
  );
};

// phrases 2 and 3: revealed in place on a centred line, with a slow continuous drift (phrase 3 then pushed off left)
const PhraseN: React.FC<{ t: number; p: Ph; i: number }> = ({ t, p, i }) => {
  if (t < p.at[0] || t > p.exit + 0.45 || (i === 2 && P(t) >= 1)) return null;
  const px = i === 2 ? textX(t) : -52 * c01((t - p.at[0]) / 1.6);
  const bx = i === 2 ? Math.min(12, speed(textX, t) * 0.3) : 0;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, display: "flex", alignItems: "center", justifyContent: "center",
      transform: `translateX(${px}px)`, filter: hb(bx), willChange: "transform" }}>
      <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: SIZE, lineHeight: 1.04, letterSpacing: `${LS}em`, whiteSpace: "nowrap", marginRight: "-0.24em" }}>
        {p.words.map((wd, j) => {
          const q = rise(t, p.at[j], j === 0), u = exitOf(t, p.exit, j);
          return q <= 0 || u >= 1
            ? <span key={j} style={{ display: "inline-block", marginRight: "0.24em", opacity: 0 }}>{wd}</span>
            : <Word key={j} t={t} text={wd} q={q} u={u} color={j === p.key ? C.coral : C.ink} />;
        })}
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
  useFonts();
  if (t < H.cream.t) return null;
  const p1 = k(t, 40.8, 0.4, INOUT), p2 = k(t, 41.08, 0.55, SOFT);             // shrink at the centre, then slide left
  const s = mix(S_BIG * (1 + 0.025 * c01((t - 40.3) / 0.5)), S_LOCK, p1);
  const mx = mix(960, LOCK_X, p2), x0 = mx - s / 2, y0 = 540 - s / 2;
  const cx = circX(t), sv = speed(circX, t), cb = sv < 6 ? 0 : Math.min(12, sv * 0.3);
  const tile = Math.max(0, sp(t, T_DUENDR - 0.06, 2.2, 0.72));                  // the dark tile grows out of the circle (lands with its overshoot)
  const bar = c01(sp(t, T_DUENDR + 0.04, 2.0, 0.74));                          // the cream bar shoots up inside it: the "d"
  const r = k(t, 41.1, 0.6, SOFT);                                              // the wordmark slides in to the right of the icon
  const dot = c01(sp(t, 41.5, 2.2, 0.7));
  const breath = 1 + 0.03 * c01((t - 41.45) / 0.95);                            // a slow breath to the end
  return (
    <div style={{ position: "absolute", inset: 0, background: C.paper, overflow: "hidden" }}>
      <svg width={0} height={0} style={{ position: "absolute" }}>
        <defs>{Array.from({ length: 13 }, (_, i) => <filter key={i} id={`s12-hb${i}`} x="-20%" y="-10%" width="140%" height="120%"><feGaussianBlur stdDeviation={`${i} 0`} /></filter>)}</defs>
      </svg>
      <Phrase1 t={t} p={PH[0]} />
      <PhraseN t={t} p={PH[1]} i={1} />
      <PhraseN t={t} p={PH[2]} i={2} />
      {t > T_PUSH && (
        <div style={{ position: "absolute", inset: 0, transform: breath !== 1 ? `scale(${breath})` : undefined }}>
          {r > 0 && (
            <div style={{ position: "absolute", left: WM_X, top: 540 - WM_H / 2, transform: `translateX(${(1 - r) * 280}px)`, opacity: c01(r * 2.5) }}>
              <Wordmark h={WM_H} color={C.ink} dot={dot} />
            </div>
          )}
          {/* the icon is drawn at a fixed base size and sized by one transform, so its edges never step; the tile grows about the
              circle's current centre with the cream bar inside it (it can never overhang), the circle on top */}
          <div style={{ position: "absolute", left: 0, top: 0, width: S_BIG, height: S_BIG, transformOrigin: "0 0",
            transform: `translate(${x0 + cx}px, ${y0}px) scale(${s / S_BIG})`, willChange: "transform" }}>
            {tile > 0 && (
              <div style={{ position: "absolute", left: 0, top: 0, width: S_BIG, height: S_BIG, borderRadius: S_BIG * 0.2227, background: "#151413", boxShadow: SHADOW_L,
                overflow: "hidden", transformOrigin: `${CIRC[0] * S_BIG}px ${CIRC[1] * S_BIG}px`, transform: `scale(${tile})` }}>
                <Icon s={S_BIG} tile={false} circle={0} bar={bar} barColor={C.cream} />
              </div>
            )}
            <div style={{ position: "absolute", left: 0, top: 0, filter: hb(cb) }}>
              <Icon s={S_BIG} tile={false} circle={1} bar={0} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const S12: Scene = { id: "S12", t0: H.cream.t, t1: 42.4, C: Outro };
