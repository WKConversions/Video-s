// Builder 3 (version 3) — B3, h2 → h3: the deal. Eight shots, each with its own motion (plan/storyboard.md 12–19):
// 12 hard cut on the beat: "Tilfreds?" letters bounce up one by one, ride a small wave, then deflate one by one →
// 13 "499" rolls DOWN in a ticker and lands with a bounce, "kr" drops in from above; the number sways slowly in 3D →
// 14 the digits melt into sage drops that flow together (Gooey) into one coin; it falls, bounces ONCE on a hairline
//    (hits on "Én", lands again on "gang"), "Én gang." springs up off the floor; a slow rise, then it recedes in depth →
// 15 a Liquid Glass slab slides in from the RIGHT (stretching with its speed, rubber-band landing); its giant toggle
//    "Abonnement" switches OFF on the word, the knob squishing against the stop; the word is struck; the slab leaves
//    accelerating out to the left →
// 16 the site pops in a Liquid Glass frame and scrolls inside it; "Siden er din." rises through masks; a glass "Din"
//    chip flies an arc around the frame and docks on its corner with a bounce →
// 17 the film's only 3D flip (rotateY, rubber-band), to a sage full frame: "Ikke tilfreds?", the words easing apart →
// 18 the line rolls UP into "499 kr", the digits roll UP to 0 with a bounce and close up: "0 kr" pops bigger →
// 19 the sage sheet drops away; a shield-check pops with a bounce, "Nul risiko." bounces in letter by letter; the
//    SageIris grows from the shield to cover the frame at h3.
import React from "react";
import { T } from "../clock";
import {
  C, Gooey, HOLM, HolmSite, INOUT, Ico, LIN, LiquidGlass, OUT, SANS, SERIF, SageIris,
  aspring, bounce, clamp01, f, kf, mix, squash,
} from "../shared";

const W = 1920, H = 1080;
const H2 = f("h2"), H3 = f("h3");
const S = (u: number) => u / 30;                              // 30-unit frames → seconds
const wd = (label: string) => T.s(label) * 30;                // a word's start on the 30-unit clock (unrounded)
// The kit's springs, started on a fractional 30-unit frame (labels and seconds round to whole frames in f()).
const bz = (g: number, a: number, response = 0.5, damping = 0.62) => { const i = Math.floor(a); return bounce(g - (a - i), S(i), response, damping); };
const sp = (g: number, a: number, response = 0.5) => { const i = Math.floor(a); return aspring(g - (a - i), S(i), response, 1); };
const ramp = (g: number, a: number, d: number, e: (t: number) => number = INOUT) => kf(g, a, d, e);
const quadIn = (t: number) => t * t;
// The kit's bouncy spring as an impulse response: a knock at `a` that springs back (0 before, settling to 0). Peaks
// near 0.47 for damping 0.45–0.5.
const kick = (g: number, a: number, response = 0.4, damping = 0.45) => {
  const t = (g - a) / 30; if (t <= 0) return 0;
  const w0 = (2 * Math.PI) / response; return Math.exp(-damping * w0 * t) * Math.sin(w0 * Math.sqrt(1 - damping * damping) * t);
};

/* ---------- the beats of the span (30-unit frames) ---------- */
const ROLL13 = wd("w:499") - 7;            // 499 starts rolling down
const KR13 = wd("w:kroner") - 3;           // "kr" drops
const MELT = wd("w:kroner") + 9;           // digits melt into drops (as "kroner" ends)
const SLAB_IN = wd("w:intet") - 6.5;       // the glass slab slides in from the right
const SWITCH = wd("w:abonnement") - 1;     // the toggle switches OFF
const SLAB_OUT = SWITCH + 13.5;            // the slab leaves to the left
const POP16 = SLAB_OUT + 5.5;              // the site's glass frame pops
const CHIP = wd("w:din3") - 14;            // the chip's arc starts (docks on "din")
const FLIP = wd("w:ikke") - 5;             // the 3D flip
const ROLLUP = wd("w:tilfreds2") + 9;     // "Ikke tilfreds?" rolls up into "499 kr"
const DIG = wd("w:s") - 4.3;               // the reels spin 499 → 0 through "koster det", landing on "ingenting"
const SHEET = wd("w:nul") - 10;            // the sage sheet drops away
const SHIELD = wd("w:nul") - 3.5;          // the shield pops as the sheet clears
const SHIELD_C = { x: 960, y: 470 };       // the shield's centre = the iris centre (keeps the corners covered at h3)

/* ---------- letters that bounce in (12, 19) ---------- */
// The kit's BounceText build (each letter pops up from below and springs past its size), with per-part timing, an
// italic accent, an optional wave while it holds and an optional staggered deflate on the way out.
type Part = { t: string; at: number; it?: boolean };
const Letters: React.FC<{ g: number; parts: Part[]; stagger: number; cx: number; y: number; size: number; color?: string; itColor?: string; damping?: number; rise?: number; wave?: number; waveFrom?: number; out?: number; outStagger?: number }> = ({
  g, parts, stagger, cx, y, size, color = C.ink, itColor = C.sageDeep, damping = 0.55, rise = 0.55, wave = 0, waveFrom = 0, out, outStagger = 0.9 }) => {
  let n = 0;
  return (
    <div style={{ position: "absolute", left: cx - 1600, top: y, width: 3200, display: "flex", justifyContent: "center", fontFamily: SERIF, fontWeight: 400, fontSize: size, letterSpacing: "-0.025em", lineHeight: 1.05, color, whiteSpace: "pre" }}>
      {parts.map((pt, pi) => pt.t.split("").map((ch, j) => {
        const i = n++;
        const p = bz(g, pt.at + j * stagger, 0.42, damping);
        const wv = wave ? wave * Math.sin((g - waveFrom) / 4.2 - i * 0.6) * ramp(g, waveFrom, 8) : 0;
        const q = out !== undefined ? quadIn(clamp01((g - out - i * outStagger) / 6.5)) : 0;
        // the move is a composited layer (glides at sub-pixel steps); the scale is painted inside it, so the layer
        // never rasterizes small (a will-change layer keeps the scale it first rasterized at: soft when it grows)
        return (
          <span key={`${pi}-${j}`} style={{ display: "inline-block", marginRight: ch === " " ? 0.1 * size : 0, opacity: clamp01(p * 2.5) * (1 - q),
            transform: `translateY(${(1 - p) * rise * size + wv - q * 0.2 * size}px)`, willChange: "transform" }}>
            <span style={{ display: "inline-block", fontStyle: pt.it ? "italic" : "normal", color: pt.it ? itColor : color, transformOrigin: "50% 90%", transform: `scale(${(0.35 + 0.65 * p) * (1 - q)})` }}>{ch}</span>
          </span>
        );
      }))}
    </div>
  );
};

/* ---------- a ticker reel (13, 18) ---------- */
// A slot-machine reel: from p0 (moving at v0 cells per unit) it travels to p1 over D units on a smooth curve, arriving
// at speed v1; a bouncy spring (damping 0.6, response 0.5 s, the kit's bounce) catches it, so it runs a little past
// the digit and settles back, whatever the length of the spin.
const reel = (g: number, a: number, D: number, p0: number, p1: number, v0: number, v1: number, damping = 0.6, response = 0.5) => {
  const t = g - a;
  if (t <= 0) return p0 + v0 * t;
  if (t < D) { const u = t / D, u2 = u * u, u3 = u2 * u; return (2 * u3 - 3 * u2 + 1) * p0 + (u3 - 2 * u2 + u) * D * v0 + (-2 * u3 + 3 * u2) * p1 + (u3 - u2) * D * v1; }
  const w0 = (2 * Math.PI) / response / 30, wd = w0 * Math.sqrt(1 - damping * damping), tau = t - D;
  return p1 + (v1 / wd) * Math.exp(-damping * w0 * tau) * Math.sin(wd * tau);
};
// One digit column like an iOS picker: digit n sits (n − pos) cells from the centre; pos falling = rolling DOWN,
// rising = rolling UP. While it spins (speed in cells per unit) the neighbours above and below show faintly; at rest
// only the digit. w = the column's width. Its layout box is one cell high and static: the digits roll by a transform,
// and a column that collapses to close up a number keeps its box and is cut (clip, both sides) and shifted (dx) instead
// (box geometry and a re-centred flex row snap to whole pixels every frame).
const Column: React.FC<{ pos: number; speed?: number; size: number; cell: number; w: number; opacity?: number; cut?: number; dx?: number }> = ({ pos, speed = 0, size, cell, w, opacity = 1, cut = 0, dx = 0 }) => {
  const ch = cell * size, n0 = Math.floor(pos) - 2, s = Math.min(0.4, Math.max(0, Math.abs(speed) - 0.1) * 0.5);
  const m = `linear-gradient(180deg, transparent 0%, rgba(0,0,0,${s}) 10%, rgba(0,0,0,${s}) 27%, #000 36%, #000 64%, rgba(0,0,0,${s}) 73%, rgba(0,0,0,${s}) 90%, transparent 100%)`;
  return (
    <div style={{ position: "relative", width: w, height: ch, flex: "none", opacity, transform: dx ? `translateX(${dx}px)` : undefined }}>
      <div style={{ position: "absolute", left: 0, top: -ch, width: w, height: 3 * ch, overflow: "hidden", WebkitMaskImage: m, maskImage: m, clipPath: cut > 0 ? `inset(0 ${cut / 2}px)` : undefined }}>
        {[0, 1, 2, 3, 4, 5].map((j) => {
          const nn = n0 + j, d = ((nn % 10) + 10) % 10;
          return <div key={j} style={{ position: "absolute", left: "50%", marginLeft: -0.4 * size, width: 0.8 * size, top: ch, height: ch, lineHeight: `${ch}px`, textAlign: "center", transform: `translateY(${(nn - pos) * ch}px)` }}>{d}</div>;
        })}
      </div>
    </div>
  );
};

/* ---------- 12 · "Tilfreds?" ---------- */
// The word swings up into place (a hinge at its foot, bounce) while its letters pop; it then rides a small wave.
const Shot12: React.FC<{ g: number }> = ({ g }) => {
  const sw = 1 - bz(g, H2 - 2, 0.6, 0.58);
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H, transform: `perspective(1300px) rotateX(${38 * sw}deg)`, transformOrigin: "960px 660px" }}>
      <Letters g={g} parts={[{ t: "Tilfreds", at: H2 - 2.5 }, { t: "?", at: H2 - 2.5 + 8 * 0.9, it: true }]} stagger={0.9} damping={0.5} rise={0.9}
        cx={960} y={540 - 0.55 * 250} size={250} wave={14} waveFrom={H2 + 10} out={ROLL13 - 7} outStagger={0.85} />
    </div>
  );
};

/* ---------- 13 · "499 kroner." ---------- */
const N13 = { x: 470, y: 384, size: 260, cell: 1.2, dw: 161 };
const DIGIT_C = [0, 1, 2].map((i) => ({ x: N13.x + N13.dw * (i + 0.5), y: 540 }));
const KR_C = { x: 1068, y: 578 };
const Shot13: React.FC<{ g: number }> = ({ g }) => {
  const sway = 1 - ramp(g, ROLL13, MELT - ROLL13 + 8, LIN);   // a slow turn in 3D through the shot
  const kp = bz(g, KR13, 0.55, 0.66), kOut = ramp(g, MELT + 2.4, 5);
  const jolt = 52 * kick(g, KR13 + 7.8, 0.42, 0.45);    // "kr" lands on the number: it dips and springs back
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H, transform: `perspective(1500px) rotateY(${36 * sway - 8}deg) rotateX(${7 * sway}deg)`, transformOrigin: "820px 540px" }}>
      <div style={{ position: "absolute", left: N13.x, top: N13.y, transform: `translateY(${jolt}px)`, display: "flex", fontFamily: SERIF, fontSize: N13.size, color: C.ink, letterSpacing: "-0.03em", fontVariantNumeric: "tabular-nums" }}>
        {[4, 9, 9].map((d, i) => {
          const a = ROLL13 + i * 2, D = 14 + 3 * i, R = (x: number) => reel(x, a, D, d + 11 + 3 * i, d, -1.25, -0.28);
          const melt = ramp(g, MELT + i * 0.8, 5);
          return (
            <div key={i} style={{ transform: `scale(${1 - melt})`, opacity: clamp01((g - a + 1) / 3) }}>
              <Column pos={R(g)} speed={(R(g) - R(g - 0.5)) / 0.5} size={N13.size} cell={N13.cell} w={N13.dw} />
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 985, top: 453, fontFamily: SERIF, fontStyle: "italic", fontSize: 210, lineHeight: 1, color: C.sageDeep, opacity: clamp01(kp * 3),
        transform: `translateY(${0.6 * jolt - (1 - kp) * 640}px) scale(${1 - kOut})`, transformOrigin: "50% 60%" }}>kr</div>
    </div>
  );
};

/* ---------- 14 · "Én gang." ---------- */
const COIN = { x: 570, y0: 540, r: 100 }, FLOOR = 806, GRAV = 13;
const TI = wd("w:n"), T2 = wd("w:gang");                         // the hit on "Én", the one bounce lands on "gang"
const REST = FLOOR - COIN.r, T0 = TI - Math.sqrt((2 * (REST - COIN.y0)) / GRAV);
const D1 = 1.6, D2 = 1.4, V1 = (GRAV * (T2 - TI - D1)) / 2;
const coinAt = (g: number) => {
  if (g < T0) return { y: COIN.y0, v: 0, sq: 0 };
  if (g < TI) { const t = g - T0; return { y: COIN.y0 + 0.5 * GRAV * t * t, v: GRAV * t, sq: 0 }; }
  if (g < TI + D1) return { y: REST, v: 0, sq: 0.2 * Math.sin((Math.PI * (g - TI)) / D1) };
  if (g < T2) { const t = g - TI - D1; return { y: REST - V1 * t + 0.5 * GRAV * t * t, v: Math.abs(V1 - GRAV * t), sq: 0 }; }
  if (g < T2 + D2) return { y: REST, v: 0, sq: 0.09 * Math.sin((Math.PI * (g - T2)) / D2) };
  return { y: REST, v: 0, sq: 0 };
};
const Shot14: React.FC<{ g: number }> = ({ g }) => {
  // the drops pull together faster as they meet (ease-in) and merge 1.5 units before the fall; the coin wobbles
  const TM = T0 - 1.5, conv = ramp(g, MELT + 3.5, TM - (MELT + 3.5), quadIn), wob = 0.34 * kick(g, TM, 0.36, 0.42);
  const drops = [...DIGIT_C.map((c, i) => ({ ...c, r: 64 * sp(g, MELT + i * 0.8, 0.3) })), { ...KR_C, r: 54 * sp(g, MELT + 2.4, 0.3) }];
  const cs = coinAt(g), stretch = Math.min(0.12, cs.v * 0.0022) * clamp01((REST - cs.y) / 24);
  const sx = ((1 + 0.8 * cs.sq) / (1 + stretch)) * (1 + wob), sy = (1 - cs.sq) * (1 + stretch) * (1 - wob);
  const near = g >= T0 ? clamp01(1 - (REST - cs.y) / (REST - COIN.y0)) : 0;
  const line = ramp(g, wd("w:kroner") + 3, 14, OUT), detail = ramp(g, TM, 5);
  const rise = 60 * ramp(g, T2 - 3, 26), rec = quadIn(clamp01((g - (SLAB_IN - 0.5)) / 12));
  const word = (t: string, at: number, it?: boolean) => {
    const p = bz(g, at, 0.45, 0.55);
    // (as in Letters: a composited move, the scale painted inside it so the layer rasterizes at full size)
    return (
      <span style={{ display: "inline-block", opacity: clamp01(p * 3), transform: `translateY(${(1 - p) * 110}px)`, willChange: "transform" }}>
        <span style={{ display: "inline-block", fontStyle: it ? "italic" : "normal", color: it ? C.sageDeep : C.ink, transform: `scale(${0.25 + 0.75 * p})`, transformOrigin: "50% 100%" }}>{t}</span>
      </span>
    );
  };
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H, transform: `translateY(${-rise}px) scale(${1 - 0.14 * rec})`, transformOrigin: "960px 650px", willChange: "transform", opacity: 1 - rec, filter: rec > 0 ? `blur(${6 * rec}px)` : undefined }}>
      {/* the hairline floor: it draws under the number on "kroner"; the coin lands on it */}
      {/* (static boxes: the line is revealed by a clip, the shadow and the drops sized by transforms; box geometry snaps) */}
      <div style={{ position: "absolute", left: COIN.x - 280, top: FLOOR - 1, width: 1360, height: 3, borderRadius: 2, background: "rgba(26,22,20,0.42)", clipPath: `inset(0 ${1080 * (1 - line)}px 0 ${280 * (1 - line)}px round 2px)` }} />
      {/* the coin's contact shadow */}
      <div style={{ position: "absolute", left: COIN.x - 1.05 * COIN.r, top: FLOOR - 9, width: 2.1 * COIN.r, height: 18, opacity: near, filter: "blur(4px)" }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "rgba(26,22,20,0.16)", transform: `scaleX(${mix(0.4, 1.05, near) / 1.05})` }} />
      </div>
      {g < TM ? (
        <Gooey>
          {drops.map((d, i) => {
            const x = mix(d.x, COIN.x, conv), y = mix(d.y, COIN.y0, conv), r = mix(d.r, COIN.r, conv);
            return r > 0.5 ? <div key={i} style={{ position: "absolute", left: -COIN.r, top: -COIN.r, width: 2 * COIN.r, height: 2 * COIN.r, borderRadius: "50%", background: C.sage, transform: `translate(${x}px, ${y}px) scale(${r / COIN.r})` }} /> : null;
          })}
        </Gooey>
      ) : (
        <div style={{ position: "absolute", left: COIN.x - COIN.r, top: COIN.y0 - COIN.r, width: 2 * COIN.r, height: 2 * COIN.r, transform: `translateY(${cs.y - COIN.y0}px) scale(${sx}, ${sy})`, transformOrigin: "50% 100%" }}>
          <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: C.sage }} />
          <div style={{ position: "absolute", inset: 0, borderRadius: "50%", opacity: detail, background: "radial-gradient(circle at 34% 28%, rgba(255,255,255,0.42), rgba(255,255,255,0) 52%)", boxShadow: "inset 0 -6px 14px rgba(73,93,88,0.35)" }} />
          <div style={{ position: "absolute", inset: COIN.r * 0.2, borderRadius: "50%", border: "3px solid rgba(255,255,255,0.5)", opacity: detail }} />
        </div>
      )}
      <div style={{ position: "absolute", left: COIN.x + COIN.r + 66, top: FLOOR - 192, display: "flex", columnGap: 48, fontFamily: SERIF, fontSize: 210, lineHeight: 1, letterSpacing: "-0.025em" }}>
        {word("Én", TI, true)}{word("gang.", T2)}
      </div>
    </div>
  );
};

/* ---------- 15 · "Intet abonnement." ---------- */
// The giant iOS switch in Creoble's sage: the knob stretches in transit and squishes against the stop when the
// spring overshoots (on < 0).
const BigToggle: React.FC<{ on: number; size: number }> = ({ on, size }) => {
  const Wt = size * 1.7, pad = size * 0.075, d = size - 2 * pad;
  const q = clamp01(on), tr = 4 * q * (1 - q), push = Math.max(0, -on) + Math.max(0, on - 1);
  const kw = d * (1 + 0.34 * tr - 1.7 * push), kh = d * (1 + 0.25 * push);
  const left = on < 0 ? pad : on > 1 ? Wt - pad - kw : pad + q * (Wt - 2 * pad - kw);
  // the knob's layout box is a static d × d circle: its place and its kw × kh size are a transform (box geometry snaps
  // to whole pixels every frame), its corner radii pre-divided by the scale so it stays the same round-ended pill
  const sx = kw / d, sy = kh / d, r = Math.min(kw, kh) / 2, sh = 1 / Math.sqrt(sx * sy);
  return (
    <div style={{ width: Wt, height: size, borderRadius: size, background: `color-mix(in srgb, ${C.sage} ${q * 100}%, #DCD8D1)`, position: "relative", boxShadow: "inset 0 2px 6px rgba(26,22,20,0.08)" }}>
      <div style={{ position: "absolute", top: 0, left: 0, width: d, height: d, transformOrigin: "0 0", transform: `translate(${left}px, ${(size - kh) / 2}px) scale(${sx}, ${sy})`,
        borderRadius: `${r / sx}px / ${r / sy}px`, background: C.white, boxShadow: `0 ${8 / sy}px ${22 * sh}px rgba(26,22,20,0.2), 0 ${2 / sy}px ${4 * sh}px rgba(26,22,20,0.12)` }} />
    </div>
  );
};
const SLAB = { x: 220, y: 390, w: 1480, h: 300 };
const slabX = (g: number) => { const p = bz(g, SLAB_IN, 0.62, 0.7), t = clamp01((g - SLAB_OUT) / 13); return (1 - p) * 1760 - quadIn(t) * 1980; };
const Shot15: React.FC<{ g: number }> = ({ g }) => {
  const x = slabX(g), vx = (x - slabX(g - 0.5)) / 0.5;
  const on = 1 - bz(g, SWITCH, 0.5, 0.55), strike = ramp(g, SWITCH + 5, 10, OUT);
  const sheen = 0.85 - 0.6 * clamp01(1 - x / 1760) + 0.45 * clamp01((g - SLAB_OUT) / 13);
  const fl = ramp(g, SLAB_IN + 8, 8), bob = 13 * Math.sin((g - SLAB_IN - 10) / 4.4) * fl, tilt = 1.1 * Math.sin((g - SLAB_IN - 10) / 4.4 + 1.3) * fl;   // the glass floats while it holds
  return (
    <div style={{ position: "absolute", left: SLAB.x, top: SLAB.y, transform: `translate(${x}px, ${bob}px) rotate(${tilt}deg)` }}>
      <LiquidGlass w={SLAB.w} h={SLAB.h} radius={SLAB.h / 2} sheen={sheen} transform={squash(vx, 0, 0.0005)}>
        <div style={{ position: "absolute", left: 120, top: 0, height: SLAB.h, display: "flex", alignItems: "center" }}>
          <span style={{ position: "relative", fontFamily: SERIF, fontSize: 140, lineHeight: 1, letterSpacing: "-0.025em", whiteSpace: "nowrap", color: `color-mix(in srgb, ${C.ink} ${100 - 60 * strike}%, ${C.soft})` }}>
            Abonnement
            <span style={{ position: "absolute", left: -8, top: "56%", height: 7, width: "104%", borderRadius: 4, background: C.ink, opacity: 0.85, clipPath: `inset(0 ${(1 - strike) * 100}% 0 0 round 4px)` }} />
          </span>
        </div>
        <div style={{ position: "absolute", left: SLAB.w - 72 - 306, top: (SLAB.h - 180) / 2 }}><BigToggle on={on} size={180} /></div>
      </LiquidGlass>
    </div>
  );
};

/* ---------- 16 · "Siden er din." ---------- */
const GF = { x: 820, y: 236, w: 980, h: 610 }, GC = { x: GF.x + GF.w / 2, y: GF.y + GF.h / 2 };
// The chip's flight: a spiral arc around the frame (up from below, under it and up its right side), bent onto its
// dock on the frame's top-right corner; u from bounce() so it swings past the dock along the arc and settles back.
const DOCK = { x: 1758, y: 252 }, TH0 = 122, TH1 = -38;
const arcAt = (u: number) => { const th = ((TH0 + (TH1 - TH0) * u) * Math.PI) / 180, rf = mix(1.8, 1, u); return { x: GC.x + 560 * rf * Math.cos(th), y: GC.y + 400 * rf * Math.sin(th) }; };
const ARC_END = arcAt(1);
const chipAt = (u: number) => { const a = arcAt(u); return { x: a.x + (DOCK.x - ARC_END.x) * u, y: a.y + (DOCK.y - ARC_END.y) * u }; };
const Shot16: React.FC<{ g: number }> = ({ g }) => {
  const q = bz(g, POP16, 0.55, 0.6), scroll = Math.max(0, g - POP16) * 4.4;
  const u = bz(g, CHIP, 0.9, 0.7), c = chipAt(u), c0 = chipAt(bz(g - 0.5, CHIP, 0.9, 0.7));
  const word = (t: string, at: number, it?: boolean) => {
    const p = Math.min(1, sp(g, at - 1.5, 0.45));
    return (
      <span style={{ display: "inline-block", overflow: "hidden", paddingBottom: 30, marginBottom: -30, paddingRight: it ? 12 : 0 }}>
        <span style={{ display: "inline-block", transform: `translateY(${(1 - p) * 115}%)`, willChange: "transform", fontStyle: it ? "italic" : "normal", color: it ? C.sageDeep : C.ink }}>{t}</span>
      </span>
    );
  };
  return (
    <>
      {q > 0 && (
        <div style={{ position: "absolute", left: GF.x, top: GF.y }}>
          <LiquidGlass w={GF.w} h={GF.h} radius={46} p={q} sheen={0.15 + 0.6 * ramp(g, POP16, 50, LIN)}>
            <div style={{ position: "absolute", left: 22, top: 22, width: GF.w - 44, height: GF.h - 44, borderRadius: 26, overflow: "hidden", background: HOLM.bg, boxShadow: `0 0 0 1px ${C.line}` }}>
              {/* The page scrolls painted, not as a composited layer (a layer moved by sub-pixel steps is resampled
                  every frame: its small text goes soft). Painted text keeps its glyphs crisp but Skia snaps an
                  axis-aligned line of text to whole pixels vertically (1, 2, 1, 1, 2 px steps); under a slightly
                  rotated matrix it places glyphs at sub-pixel positions both ways. 0.1° does it (0.03° still
                  stepped, measured): 0.8 px at the page's ends, invisible; the clip's background fills the
                  sub-pixel sliver along its edges. */}
              <div style={{ position: "absolute", left: 0, top: 0, transform: "rotate(0.1deg)" }}><HolmSite w={GF.w - 44} h={GF.h - 44} booking={1} scroll={scroll} /></div>
            </div>
          </LiquidGlass>
        </div>
      )}
      <div style={{ position: "absolute", left: 110, top: 386, fontFamily: SERIF, fontSize: 140, letterSpacing: "-0.025em", lineHeight: 1.06 }}>
        <div style={{ display: "flex", columnGap: 34 }}>{word("Siden", wd("w:siden2"))}{word("er", wd("w:er2"))}</div>
        <div style={{ display: "flex" }}>{word("din.", wd("w:din3"), true)}</div>
      </div>
      {g >= CHIP && (
        <div style={{ position: "absolute", left: 0, top: 0, transform: `translate(${c.x - 114}px, ${c.y - 46}px)` }}>
          <LiquidGlass w={228} h={92} sheen={0.2 + 0.6 * clamp01(u)} transform={squash((c.x - c0.x) / 0.5, (c.y - c0.y) / 0.5, 0.0016)}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, height: "100%", fontFamily: SANS, fontWeight: 600, fontSize: 44, color: C.ink }}>
              <Ico n="user" s={44} c={C.sageDeep} w={2.4} />Din
            </div>
          </LiquidGlass>
        </div>
      )}
    </>
  );
};

/* ---------- 17 + 18 · the back of the flip: "Ikke tilfreds?" → "499 kr" → "0 kr" ---------- */
const Back: React.FC<{ g: number }> = ({ g }) => {
  const SZ = 210, LINE = 252, roll = bz(g, ROLLUP, 0.55, 0.7), apart = 36 * ramp(g, FLIP + 4, 30, LIN);
  const masked = g < ROLLUP + 16;
  const m = "linear-gradient(180deg, transparent 0%, #000 10%, #000 90%, transparent 100%)";
  const cols = [4, 9, 9].map((d, i) => {
    const a = DIG + i * 1.5, D = 17 + 2 * i, R = (x: number) => reel(x, a, D, d, [10, 20, 30][i], 0, 0.28);
    return { pos: R(g), speed: (R(g) - R(g - 0.5)) / 0.5, w: i < 2 ? 1 - ramp(g, a + D + 2 + i, 7) : 1 };
  });
  // the first two columns close up (each gives up cut px); the row stays laid out at full width and each piece is
  // shifted to where the centred, closed-up row puts it
  const CW = 0.62 * SZ, cut = cols.map((c) => CW * (1 - c.w)), cutAll = cut[0] + cut[1] + cut[2];
  const dx = cols.map((_, i) => cutAll / 2 - cut.slice(0, i).reduce((s, x) => s + x, 0) - cut[i] / 2);
  const zero = 1 + 0.22 * bz(g, DIG + 24.5, 0.6, 0.55);
  return (
    <div style={{ position: "absolute", left: 0, top: 540 - LINE / 2, width: W, height: LINE, overflow: masked ? "hidden" : "visible", WebkitMaskImage: masked ? m : undefined, maskImage: masked ? m : undefined, fontFamily: SERIF, color: C.cream }}>
      {masked && (
        <div style={{ position: "absolute", left: 0, top: 0, width: W, height: LINE, display: "flex", justifyContent: "center", alignItems: "center", fontSize: SZ, lineHeight: `${LINE}px`, letterSpacing: "-0.025em", columnGap: SZ * 0.24, whiteSpace: "nowrap",
          transform: `perspective(1400px) translateY(${-roll * LINE}px) rotateX(${55 * roll}deg)` }}>
          {/* painted: text moving sideways already glides (sub-pixel glyph positions along the line) and stays crisp */}
          <span style={{ display: "inline-block", fontStyle: "italic", transform: `translateX(${-apart}px)` }}>Ikke</span>
          <span style={{ display: "inline-block", transform: `translateX(${apart}px)` }}>tilfreds?</span>
        </div>
      )}
      <div style={{ position: "absolute", left: 0, top: 0, width: W }}>
        <div style={{ height: LINE, display: "flex", justifyContent: "center", alignItems: "flex-start", fontSize: SZ, letterSpacing: "-0.03em", fontVariantNumeric: "tabular-nums",
          transform: `perspective(1400px) translateY(${(1 - roll) * LINE}px) rotateX(${-55 * (1 - roll)}deg) scale(${zero})` }}>
          {cols.map((c, i) => <Column key={i} pos={c.pos} speed={c.speed} size={SZ} cell={1.2} w={CW} cut={cut[i]} dx={dx[i]} opacity={c.w} />)}
          <div style={{ fontStyle: "italic", fontSize: SZ * 0.62, lineHeight: 1, marginTop: 96, marginLeft: SZ * 0.16, transform: `translateX(${-cutAll / 2}px)` }}>kr</div>
        </div>
      </div>
    </div>
  );
};

/* ---------- 16 → 17 · the film's only 3D flip; 18 → 19 · the sage sheet drops away ---------- */
const Flip: React.FC<{ g: number }> = ({ g }) => {
  const a = 180 * bz(g, FLIP, 0.75, 0.64), s = Math.sin(Math.PI * clamp01(a / 180)), sc = 1 - 0.17 * s;
  const drop = g >= SHEET ? 1350 * sp(g, SHEET, 0.55) : 0;
  const face = (rot: number, bg: string, child: React.ReactNode, pre = "") => (
    <div style={{ position: "absolute", left: -80, top: -80, width: W + 160, height: H + 160, background: bg, overflow: "hidden", borderRadius: 40 * s,
      transform: `${pre} perspective(2600px) rotateY(${rot}deg) scale(${sc})`, boxShadow: s > 0.01 ? `0 60px 140px -40px rgba(26,22,20,${0.45 * s})` : undefined }}>
      <div style={{ position: "absolute", left: 80, top: 80, width: W, height: H }}>{child}</div>
    </div>
  );
  return (
    <>
      {g > FLIP && g < FLIP + 30 && <div style={{ position: "absolute", left: -80, top: -80, width: W + 160, height: H + 160, background: "#E9E4DB" }} />}
      {a < 90 && face(a, C.bg, <Shot16 g={g} />)}
      {a >= 90 && drop < 1250 && face(a - 180, C.sage, <Back g={g} />, `translateY(${drop}px)`)}
    </>
  );
};

/* ---------- 19 · "Nul risiko." ---------- */
const Shot19: React.FC<{ g: number }> = ({ g }) => {
  const q = bz(g, SHIELD, 0.5, 0.55), bob = 11 * Math.sin((g - SHIELD - 8) / 4.2) * ramp(g, SHIELD + 6, 6);
  const d = ramp(g, SHIELD + 4, 9, OUT);
  return (
    <>
      <div style={{ position: "absolute", left: SHIELD_C.x - 160, top: SHIELD_C.y - 160, width: 320, height: 320, opacity: clamp01(q * 3),
        transform: `translateY(${bob}px) perspective(1200px) rotateY(${16 * Math.sin((g - SHIELD - 6) / 5) * ramp(g, SHIELD + 4, 8)}deg) scale(${q}) rotate(${(1 - q) * -14}deg)`, filter: "drop-shadow(0 22px 30px rgba(26,22,20,0.16))" }}>
        <svg width={320} height={320} viewBox="0 0 48 48" style={{ display: "block", overflow: "visible" }}>
          <path d="M24 5 L39 11 V23 c0 9 -6 16 -15 20 c-9 -4 -15 -11 -15 -20 V11 Z" fill={C.sage} stroke={C.sage} strokeWidth={2.6} strokeLinejoin="round" />
          <path d="M17 24 L22 29 L31 19" fill="none" stroke={C.cream} strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={21} strokeDashoffset={21 * (1 - d)} />
        </svg>
      </div>
      <Letters g={g} parts={[{ t: "Nul", at: wd("w:nul") - 0.5, it: true }, { t: " risiko.", at: wd("w:nul") - 0.5 + 3 * 1.0 }]} stagger={1.0} damping={0.5} rise={0.8} cx={960} y={662} size={170} />
    </>
  );
};

export const Scene3: React.FC<{ g: number }> = ({ g }) => {
  if (g < H2 || g >= H3) return null;
  return (
    <>
      {g < ROLL13 + 9 && <Shot12 g={g} />}
      {g >= ROLL13 - 1 && g < MELT + 9 && <Shot13 g={g} />}
      {g >= wd("w:kroner") && g < SLAB_IN + 12 && <Shot14 g={g} />}
      {g >= SHIELD - 1 && <Shot19 g={g} />}
      {g >= SLAB_OUT - 1 && <Flip g={g} />}
      {g >= SLAB_IN - 1 && g < SLAB_OUT + 14 && <Shot15 g={g} />}
      <SageIris g={g} at="h3" cx={SHIELD_C.x} cy={SHIELD_C.y} />
    </>
  );
};
