// Scene F (29.9–35.6 s): "Just your website, made simple." / "Creoble." See ../../../plan/v2-storyboard.md.
// 1 · The hero shot: the laptop (the finished, edited bakery site) and the phone rise into view turned in 3D and
//     swing slowly toward the camera, the screens scrolling a touch; the line builds at the top on its words.
// 2 · 31.75–32.3: the devices flatten, fly to the centre and shrink, each turning into a blue disc: one blue dot,
//     the dot that started the film. The line leaves.
// 3 · "Creoble." grows out of the dot exactly as in scene A (the dot slides right to become its full stop, the letters
//     unfurl right to left), then "Build your website for free at creoble.dk" builds under it. A slow push to the end.
import React from "react";
import { AbsoluteFill, Easing } from "remotion";
import { ARRIVE, C, MOVE, clamp01, mix } from "../lib";
import { Laptop, MobileSite, Phone, SANS, SERIF, Say, Site, SW, SH, PW, PH, f, k } from "../shared";

const sec = (g: number) => g / 30;
const ss = (a: number, b: number, x: number) => { const t = clamp01((x - a) / (b - a)); return t * t * (3 - 2 * t); };
const lerpLog = (a: number, b: number, t: number) => Math.exp(mix(Math.log(a), Math.log(b), t));
const IN = Easing.bezier(0.45, 0, 0.7, 0.4);           // the devices accelerate into the dot
const LAND = Easing.bezier(0.33, 0, 0.12, 1);          // the dot's carry to its place as the full stop (as in A)
const SWING = Easing.bezier(0.3, 0.25, 0.25, 1);       // the word's swing open (as in A)

/* ---------- the devices ---------- */
const LW = SW + 32, LH = SH + 32;                      // the laptop's body (Laptop draws a 30 px base below it)
const PWB = PW + 26, PHB = PH + 26;                     // the phone's body
const FOLD = 31.75, FOLD_D = 0.55;                     // the fold into the dot

/* ---------- the end card (A's numbers, at 200 px, drawn at 0.95 → 190 px) ---------- */
const WM = 200, WM_Y = 500, DOT_DX = 296, DOT_DY = 60, DOT_D = 26;
const MS = 0.95;                                       // mark scale
const REVEAL = 32.24;                                  // the dot starts pulling the word out (just before "creoble")
const push = (t: number) => { const x = clamp01((t - 31.9) / 3.7); return 0.96 + 0.1 * (1 - Math.pow(1 - x, 1.5)); };

// A device on its own 3D plane, centred on (x, y), scaled s; `blue` 0..1 turns it into a blue disc of diameter `d`.
const Dev: React.FC<{ w: number; h: number; x: number; y: number; s: number; ry: number; rx: number; o: number; blue: number; r0: number; children: React.ReactNode }> = ({ w, h, x, y, s, ry, rx, o, blue, r0, children }) => {
  if (o <= 0.005) return null;
  const D = Math.min(w, h);
  const m = ss(0.4, 1, blue), bw = mix(w, D, m), bh = mix(h, D, m);
  return (
    <div style={{ position: "absolute", left: x - w / 2, top: y - h / 2, width: w, height: h, opacity: o,
      transform: `perspective(2600px) rotateY(${ry}deg) rotateX(${rx + 0.01}deg) scale(${s})`, transformOrigin: "50% 50%" }}>
      {blue < 0.98 && <div style={{ position: "absolute", inset: 0, opacity: 1 - ss(0.2, 0.5, blue) }}>{children}</div>}
      {blue > 0.02 && <div style={{ position: "absolute", left: (w - bw) / 2, top: (h - bh) / 2, width: bw, height: bh, borderRadius: mix(r0, D / 2, m), background: C.blue, opacity: ss(0.02, 0.4, blue) }} />}
    </div>
  );
};

// A soft bloom ring widening out of the dot (as in A).
const Bloom: React.FC<{ x: number; y: number; r0: number; r1: number; k: number; a?: number }> = ({ x, y, r0, r1, k: kk, a = 1 }) => {
  if (kk <= 0 || kk >= 1) return null;
  const R = mix(r0, r1, ARRIVE(kk));
  return <div style={{ position: "absolute", left: x - R, top: y - R, width: 2 * R, height: 2 * R, borderRadius: "50%", opacity: a * Math.pow(1 - kk, 1.6),
    background: "radial-gradient(circle, rgba(74,163,245,0) 48%, rgba(74,163,245,0.26) 64%, rgba(74,163,245,0.10) 78%, rgba(74,163,245,0) 92%)" }} />;
};

const TAG: { t: string; blue?: boolean }[] = [{ t: "Build" }, { t: "your" }, { t: "website" }, { t: "for" }, { t: "free" }, { t: "at" }, { t: "creoble.dk", blue: true }];

export const SceneF: React.FC<{ g: number }> = ({ g }) => {
  if (g < f(29.9) || g > f(35.6)) return null;
  const t = sec(g);
  const P = push(t);
  // mark space (200 px wordmark) → screen
  const sx = (x: number) => 960 + (x - 960) * P * MS, sy = (y: number) => 540 + (y - 540) * P * MS;

  /* 1 · the hero devices */
  const rise = k(g, 30.0, 1.1), riseP = k(g, 30.12, 1.1);
  const turn = MOVE(clamp01((t - 30.0) / 2.0));
  const fo = clamp01((t - FOLD) / FOLD_D), e = IN(fo), ep = MOVE(clamp01((t - FOLD) / (FOLD_D * 0.85)));
  const blue = ss(0.15, 0.85, fo);
  const hero = 1 + 0.03 * clamp01((t - 30) / 1.9);       // a gentle push on the hero
  const scroll = 150 * MOVE(clamp01((t - 30.5) / 1.4));
  const dot0: [number, number] = [sx(960), sy(WM_Y + DOT_DY)];
  // laptop
  const L = { x: 850, y: 600, s: 0.72 * hero };
  const lx = mix(960 + (L.x - 960) * hero, dot0[0], ep), ly = mix(540 + (L.y - 540) * hero + 300 * (1 - rise), dot0[1], ep);
  const ls = lerpLog(L.s, (DOT_D * P * MS) / LH, e);
  const lry = mix(-18, -5, turn) * (1 - e), lrx = mix(8, 3, turn) * (1 - e);
  // phone
  const Ph = { x: 1440, y: 690, s: 0.56 * hero };
  const px = mix(960 + (Ph.x - 960) * hero - 40 * (1 - turn), dot0[0], ep), py = mix(540 + (Ph.y - 540) * hero + 340 * (1 - riseP), dot0[1], ep);
  const ps = lerpLog(Ph.s, (DOT_D * P * MS) / PWB, e);
  const pry = mix(-26, -9, turn) * (1 - e), prx = mix(8, 3, turn) * (1 - e);
  const shadowO = Math.min(1, rise * 1.3) * (1 - ss(0, 0.5, fo));

  /* 2 · the dot */
  const E = LAND(clamp01((t - REVEAL) / 0.6));
  const track = 13 * (1 - ss(REVEAL + 0.12, REVEAL + 0.78, t));
  const dotLX = 960 + E * (DOT_DX + 4 * track);
  const Gx = dotLX - (960 + DOT_DX + 4 * track);
  const dIn = ss(0.85, 1, fo);
  const absorb = Math.sin(Math.PI * clamp01((t - (FOLD + FOLD_D) + 0.05) / 0.4));
  const settle = k(g, REVEAL + 0.42, 0.26);
  const dSize = mix(30, DOT_D, settle) * (1 + 0.25 * absorb);
  const toGlyph = ss(REVEAL + 0.62, REVEAL + 0.75, t);
  const glow = ss(FOLD + 0.3, FOLD + 0.55, t) * (1 - ss(REVEAL + 0.32, REVEAL + 0.64, t));
  const flare = Math.sin(Math.PI * clamp01((t - (REVEAL + 0.38)) / 0.32));
  const ringA = clamp01((t - (FOLD + FOLD_D - 0.05)) / 0.8);
  const swing = -50 * (1 - SWING(clamp01((t - REVEAL) / 0.7)));
  const dScreen: [number, number] = [sx(dotLX), sy(WM_Y + DOT_DY)];

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {/* 1 · the hero shot */}
      {fo < 1 && (
        <>
          <div style={{ position: "absolute", left: 960 - 760, top: 905 + 300 * (1 - rise), width: 1520, height: 120, borderRadius: "50%", opacity: 0.55 * shadowO,
            background: "radial-gradient(ellipse at center, rgba(29,29,31,0.20) 0%, rgba(29,29,31,0) 68%)" }} />
          <Dev w={LW} h={LH + 30} x={lx} y={ly} s={ls} ry={lry} rx={lrx} o={Math.min(1, rise * 1.5)} blue={blue} r0={30}>
            <Laptop x={LW / 2} y={LH / 2} s={1}><Site g={g} build={1} scroll={scroll} select={false} /></Laptop>
          </Dev>
          <Dev w={PWB} h={PHB} x={px} y={py} s={ps} ry={pry} rx={prx} o={Math.min(1, riseP * 1.5)} blue={blue} r0={66}>
            <Phone x={PWB / 2} y={PHB / 2} s={1}><div style={{ position: "absolute", inset: 0, transform: `translateY(${-scroll * 0.6}px)` }}><MobileSite g={g} build={1} /></div></Phone>
          </Dev>
        </>
      )}

      {/* 1 · the line */}
      <Say g={g} y={104} size={68} out="w:simple2+0.4" words={[
        { t: "Just", at: "w:just4" }, { t: "your", at: "w:your3" }, { t: "website,", at: "w:website3" }, { t: "made", at: "w:made" }, { t: "simple.", at: "w:simple2", blue: true },
      ]} />

      {/* 2 · the dot: glow, bloom, the dot itself */}
      {fo > 0.85 && toGlyph < 1 && (
        <>
          <div style={{ position: "absolute", left: dScreen[0] - 170, top: dScreen[1] - 170, width: 340, height: 340, borderRadius: "50%", opacity: Math.max(glow * (0.6 + 0.3 * absorb), 0.6 * flare),
            background: "radial-gradient(circle, rgba(74,163,245,0.26) 0%, rgba(74,163,245,0.10) 38%, rgba(74,163,245,0) 70%)" }} />
          <Bloom x={dot0[0]} y={dot0[1]} r0={20} r1={420} k={ringA} />
          <div style={{ position: "absolute", left: dScreen[0] - (dSize * P * MS) / 2, top: dScreen[1] - (dSize * P * MS) / 2, width: dSize * P * MS, height: dSize * P * MS, borderRadius: "50%",
            background: C.blue, opacity: dIn * (1 - toGlyph), boxShadow: glow > 0 ? `0 0 ${18 * glow}px ${4 * glow}px rgba(74,163,245,${0.45 * glow})` : undefined }} />
        </>
      )}

      {t >= REVEAL && (() => { const h = ss(REVEAL + 0.3, REVEAL + 1.6, t), R = mix(380, 620, clamp01((t - REVEAL) / 3.4)); return (
        <div style={{ position: "absolute", left: 960 - R * 1.6, top: 520 - R, width: R * 3.2, height: R * 2, borderRadius: "50%", opacity: 0.55 * h,
          background: "radial-gradient(ellipse at center, rgba(74,163,245,0.16) 0%, rgba(74,163,245,0.06) 45%, rgba(74,163,245,0) 70%)" }} />); })()}

      {/* 3 · Creoble. — out of the dot, letter by letter, right to left (as in scene A) */}
      {t >= REVEAL && (
        <AbsoluteFill style={{ transform: `scale(${P * MS})`, transformOrigin: "960px 540px" }}>
          <div style={{ position: "absolute", left: 0, top: 0, transform: `translate(${960 + Gx}px, ${WM_Y}px)` }}>
            <div style={{ position: "absolute", left: 0, top: 0, fontFamily: SERIF, fontWeight: 500, fontSize: WM, letterSpacing: "-0.02em", color: C.ink, whiteSpace: "nowrap", lineHeight: 1,
              transform: `translate(-50%, -50%)${swing < -0.01 ? ` perspective(1500px) rotateY(${swing}deg)` : ""}`,
              transformOrigin: `calc(50% + ${DOT_DX + 4 * track}px) ${WM / 2 + DOT_DY}px` }}>
              {"Creoble".split("").map((ch, i) => {
                const j = 6 - i;
                const p = k(g, REVEAL + 0.04 + j * 0.05, 0.45);
                const lx2 = (1 - p) * 34 + (i - 3) * track, ly2 = (1 - p) * 18;
                return <span key={i} style={{ position: "relative", left: lx2, top: ly2, opacity: Math.min(1, p * 1.6), filter: p < 1 ? `blur(${(1 - p) * 9}px)` : undefined }}>{ch}</span>;
              })}
              <span style={{ display: "inline-block", position: "relative", left: 4 * track, color: C.blue, transformOrigin: "50% 80%", opacity: toGlyph }}>.</span>
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* 3 · the call to action */}
      {t >= 32.8 && (
        <div style={{ position: "absolute", left: 0, top: 0, width: 1920, display: "flex", justifyContent: "center", gap: 36 * 0.27, transformOrigin: "960px 540px",
          transform: `scale(${P}) translateY(${672}px)`, fontFamily: SANS, fontWeight: 500, fontSize: 36, letterSpacing: "-0.015em", lineHeight: 1.2, color: C.gray, whiteSpace: "nowrap" }}>
          {TAG.map((w, i) => {
            const kk = k(g, 32.88 + i * 0.045, 0.8);
            return <span key={i} style={{ display: "inline-block", color: w.blue ? C.blueDeep : undefined, fontWeight: w.blue ? 600 : 500, opacity: Math.min(1, kk * 1.4),
              transform: `translateY(${(1 - kk) * 12}px)`, filter: kk < 1 ? `blur(${(1 - kk) * 8}px)` : undefined }}>{w.t}</span>;
          })}
        </div>
      )}
    </AbsoluteFill>
  );
};
