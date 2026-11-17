// COYOR RUN promo demo (vertical 1080x1920, 60 fps, 28 s, English). The gameplay is REAL: captured frame by frame from
// the game on coyorclo.com in mobile mode (tools/capture.js); the four runners are drawn with the game's own sprite code
// (tools/sprites.js). Brand: COYOR dark, gold #E9C66A, cream #F8F1E2, Barlow Condensed + DM Sans (the site's fonts).
import React, { useEffect, useState } from "react";
import { AbsoluteFill, Easing, Img, OffthreadVideo, Sequence, continueRender, delayRender, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import { Hand, handAt } from "./hand";

export const FPS = 60, DUR = 28.0;
const C = { bg: "#0B0B0E", gold: "#E9C66A", gold2: "#FFDD70", cream: "#F8F1E2", muted: "rgba(248,241,226,.62)", line: "rgba(255,255,255,.045)" };
const H = "'Barlow Condensed', sans-serif", B = "'DM Sans', sans-serif";

// ---------- time helpers (seconds) ----------
const clamp = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
const ease = Easing.bezier(0.65, 0, 0.35, 1), easeOut = Easing.bezier(0.16, 1, 0.3, 1), easeIn = Easing.bezier(0.5, 0, 0.75, 0);
const E = (T: number, t0: number, d: number, f = ease) => f(clamp((T - t0) / d));
const S = (T: number, t0: number, cfg: { damping?: number; stiffness?: number; mass?: number } = {}) =>
  T < t0 ? 0 : spring({ frame: (T - t0) * FPS, fps: FPS, config: { damping: 13, stiffness: 170, mass: 0.9, ...cfg } });
const mix = (a: number, b: number, p: number) => a + (b - a) * p;

// ---------- fonts ----------
const FONTS: [string, string, string, string][] = [
  ["Barlow Condensed", "BarlowCondensed-800.woff2", "800", "normal"], ["Barlow Condensed", "BarlowCondensed-900.woff2", "900", "normal"],
  ["Barlow Condensed", "BarlowCondensed-800i.woff2", "800", "italic"], ["Barlow Condensed", "BarlowCondensed-900i.woff2", "900", "italic"],
  ["DM Sans", "DMSans-500.woff2", "500", "normal"], ["DM Sans", "DMSans-700.woff2", "700", "normal"],
];
const useFonts = () => {
  const [ok, setOk] = useState(false);
  const [h] = useState(() => delayRender("fonts"));
  useEffect(() => {
    const el = document.createElement("style");
    el.textContent = FONTS.map(([f, file, w, s]) => `@font-face{font-family:'${f}';src:url(${staticFile("fonts/" + file)}) format('woff2');font-weight:${w};font-style:${s}}`).join("\n");
    document.head.appendChild(el);
    Promise.all(FONTS.map(([f, , w, s]) => document.fonts.load(`${s} ${w} 80px '${f}'`))).then(() => { setOk(true); continueRender(h); });
  }, [h]);
  return ok;
};

// ---------- pieces ----------
const Grid: React.FC<{ T: number; glow: string }> = ({ T, glow }) => (
  <AbsoluteFill style={{ background: C.bg }}>
    <AbsoluteFill style={{ backgroundImage: `linear-gradient(${C.line} 1px, transparent 1px), linear-gradient(90deg, ${C.line} 1px, transparent 1px)`,
      backgroundSize: "72px 72px", backgroundPosition: `0 ${(T * 18) % 72}px` }} />
    <AbsoluteFill style={{ background: `radial-gradient(ellipse 70% 45% at 50% 46%, ${glow}, transparent 70%)` }} />
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 120% 90% at 50% 50%, transparent 55%, rgba(0,0,0,.55))" }} />
  </AbsoluteFill>
);

const NAMES = ["abdel", "bram", "paulie", "rahim"];
// a runner, drawn with the game's sprite code: feet at (x, y), figure height h px; pose run | stand | fly | jump
const Runner: React.FC<{ i: number; T: number; x: number; y: number; h: number; pose?: string; flip?: boolean; op?: number; rot?: number; sc?: number }> =
  ({ i, T, x, y, h, pose = "run", flip = false, op = 1, rot = 0, sc = 1 }) => {
    const n = pose === "jump" ? 0 : Math.floor(T * (pose === "run" ? 48 : 30)) % 24;
    const k = (h / 582) * sc;
    return (
      <div style={{ position: "absolute", left: x - 573 * k, top: y - 604 * k, width: 800 * k, height: 900 * k, opacity: op,
        transformOrigin: `${573 * k}px ${604 * k}px`, transform: `${flip ? "scaleX(-1) " : ""}rotate(${rot}deg)`,
        filter: "drop-shadow(0 18px 22px rgba(0,0,0,.55))" }}>
        <Img src={staticFile(`sprites/${NAMES[i]}-${pose}-${String(n).padStart(2, "0")}.png`)} style={{ width: "100%", height: "100%" }} />
      </div>
    );
  };

// the outfit parcel (the story's thread): a gold box with the CY mark
const Parcel: React.FC<{ x: number; y: number; s: number; rot?: number; op?: number }> = ({ x, y, s, rot = 0, op = 1 }) => (
  <div style={{ position: "absolute", left: x - 60 * s, top: y - 50 * s, width: 120 * s, height: 100 * s, opacity: op, transform: `rotate(${rot}deg)`,
    filter: `drop-shadow(0 ${10 * s}px ${16 * s}px rgba(0,0,0,.5)) drop-shadow(0 0 ${18 * s}px rgba(233,198,106,.45))` }}>
    <svg viewBox="0 0 120 100" width="100%" height="100%">
      <defs><linearGradient id="pg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#FFE7A0" /><stop offset=".55" stopColor="#E9C66A" /><stop offset="1" stopColor="#B88D3A" /></linearGradient></defs>
      <rect x="4" y="14" width="112" height="82" rx="10" fill="url(#pg)" />
      <rect x="2" y="6" width="116" height="22" rx="8" fill="#F6D98A" />
      <rect x="54" y="6" width="12" height="90" fill="#0B0B0E" opacity=".85" />
      <text x="88" y="72" fontFamily={H} fontWeight={900} fontStyle="italic" fontSize="30" fill="#0B0B0E" textAnchor="middle">CY</text>
    </svg>
  </div>
);

const Chip: React.FC<{ text: string; color: string; x: number; y: number; op: number; s?: number }> = ({ text, color, x, y, op, s = 1 }) => (
  <div style={{ position: "absolute", left: x, top: y, transform: `translateX(-50%) scale(${s})`, opacity: op, padding: "12px 26px", borderRadius: 40,
    border: `2px solid ${color}`, background: "rgba(11,11,14,.7)", color, fontFamily: B, fontWeight: 700, fontSize: 30, letterSpacing: 4, whiteSpace: "nowrap" }}>{text}</div>
);

// a word that slams in: big italic Barlow, scale from 1.5 with a spring, then holds
const Slam: React.FC<{ text: string; T: number; t0: number; x: number; y: number; size: number; color: string; out?: number; grad?: string; align?: "center" | "left" }> =
  ({ text, T, t0, x, y, size, color, out = 99, grad, align = "center" }) => {
    const p = S(T, t0, { damping: 11, stiffness: 210, mass: 0.7 }), o = 1 - E(T, out, 0.25, easeIn);
    if (T < t0) return null;
    return (
      <div style={{ position: "absolute", left: x, top: y, transform: `translate(${align === "center" ? "-50%" : "0"}, -50%) translateY(${-60 * E(T, out, 0.25, easeIn)}px) scale(${mix(1.55, 1, p)}) skewX(-4deg)`,
        transformOrigin: align === "center" ? "50% 50%" : "0 50%", opacity: clamp((T - t0) / 0.07) * o, fontFamily: H, fontWeight: 900, fontStyle: "italic", fontSize: size,
        lineHeight: 0.92, letterSpacing: -1, whiteSpace: "nowrap", color, textShadow: "0 10px 30px rgba(0,0,0,.45)",
        ...(grad ? { background: grad, WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" } : {}) }}>{text}</div>
    );
  };

// ---------- the hook ----------
const Hook: React.FC<{ T: number }> = ({ T }) => {
  const zoom = E(T, 2.28, 0.42, easeIn);                       // the parcel flies into the camera: the transition
  const pd = S(T, 0.42, { damping: 9, stiffness: 160 });       // the parcel drops and bounces
  return (
    <AbsoluteFill>
      <Grid T={T} glow="rgba(233,198,106,.16)" />
      <Slam text="ONE OUTFIT." T={T} t0={0.06} x={540} y={430} size={190} color={C.cream} out={2.2} />
      <Slam text="FOUR RUNNERS." T={T} t0={1.0} x={540} y={620} size={170} color={C.gold} grad={`linear-gradient(100deg, ${C.gold2}, ${C.gold} 55%, #C99A45)`} out={2.2} />
      {[0, 1, 2, 3].map((i) => {
        const p = S(T, 1.18 + i * 0.09, { damping: 10, stiffness: 190 }), o = 1 - E(T, 2.15, 0.25, easeIn);
        if (T < 1.18 + i * 0.09) return null;
        const x = [190, 420, 660, 890][i];
        return (
          <React.Fragment key={i}>
            <Runner i={i} T={T + i * 0.13} x={x} y={1390 + 140 * (1 - p)} h={400} pose="stand" op={clamp(p * 3) * o} sc={mix(0.6, 1, p)} />
            <div style={{ position: "absolute", left: x, top: 1430, transform: "translateX(-50%)", opacity: clamp(p * 2) * o, fontFamily: H, fontWeight: 800, fontSize: 44, letterSpacing: 4, color: C.cream }}>
              {["ABDEL", "BRAM", "PAULIE", "RAHIM"][i]}</div>
          </React.Fragment>
        );
      })}
      {T > 0.42 && <Parcel x={540} y={mix(-120, 1610, pd)} s={mix(1.15, 9, zoom)} rot={mix(-14, 0, pd) + 25 * zoom} op={1} />}
      {zoom > 0.6 && <AbsoluteFill style={{ background: C.gold, opacity: E(T, 2.5, 0.12) }} />}
    </AbsoluteFill>
  );
};

// ---------- a runner's gameplay section ----------
type Seg = { i: number; t0: number; t1: number; take: number; from: number; name: string; verb: string; mode: string; accent: string; grad: string; road?: boolean };
const SEGS: Seg[] = [
  { i: 0, t0: 2.6, t1: 7.0, take: 0, from: 1.2, name: "ABDEL", verb: "RUN THE STREETS.", mode: "01 · COYOR STREETS", accent: C.gold, grad: `linear-gradient(100deg, ${C.gold2}, ${C.gold})` },
  { i: 1, t0: 7.0, t1: 11.4, take: 1, from: 1.6, name: "BRAM", verb: "FLY THE JETPACK.", mode: "02 · JETPACK FLAPPY RUN", accent: "#7FE3EC", grad: "linear-gradient(100deg, #B9F6FA, #5FCFDC)" },
  { i: 2, t0: 11.4, t1: 15.8, take: 2, from: 1.4, name: "PAULIE", verb: "DODGE THE TRAFFIC.", mode: "03 · COYOR CAR CHASE", accent: "#F6A27F", grad: "linear-gradient(100deg, #FFD0BA, #EE8A63)", road: true },
  { i: 3, t0: 15.8, t1: 21.0, take: 3, from: 8.6, name: "RAHIM", verb: "SURVIVE THE MOON.", mode: "04 · MOON NIGHTMARE", accent: "#A9B1FF", grad: "linear-gradient(100deg, #D5DAFF, #8C96F5)" },
];
const Section: React.FC<{ s: Seg; T: number }> = ({ s, T }) => {
  const u = T - s.t0, len = s.t1 - s.t0, out = len - 0.34;
  const win = S(T, s.t0 + 0.02, { damping: 15, stiffness: 150 }), wOut = E(u, out, 0.34, easeIn);
  const tilt = (1 - E(u, 0.02, 0.7, easeOut)) * 16;
  const runIn = S(T, s.t0 + 0.12, { damping: 14, stiffness: 120 });
  const punch = 1 + 0.035 * Math.sin(Math.PI * clamp((u - 1.6) / 1.4));          // a slow push-in on the action
  const glow = s.accent + "33";
  const W = s.road ? 900 : 1000, Hh = s.road ? 891 : 562, top = s.road ? 640 : 650;
  return (
    <AbsoluteFill>
      <Grid T={T} glow={glow} />
      {/* the big outline name behind everything */}
      <div style={{ position: "absolute", left: 540 - 140 * u, top: 1080, transform: "translate(-50%,-50%) skewX(-6deg)", fontFamily: H, fontWeight: 900, fontStyle: "italic", fontSize: 470,
        color: "transparent", WebkitTextStroke: `3px ${s.accent}`, opacity: 0.11 * (1 - wOut), whiteSpace: "nowrap" }}>{s.name}</div>
      <Chip text={s.mode} color={s.accent} x={540} y={150 - 40 * wOut} op={clamp((u - 0.1) / 0.15) * (1 - wOut)} s={mix(0.8, 1, S(T, s.t0 + 0.1))} />
      <Slam text={s.name} T={T} t0={s.t0 + 0.08} x={540} y={350} size={250} color={s.accent} grad={s.grad} out={s.t1 - 0.32} />
      <div style={{ position: "absolute", left: 540, top: 500, transform: `translate(-50%,-50%) translateY(${30 * (1 - S(T, s.t0 + 0.3))}px)`, opacity: clamp((u - 0.3) / 0.15) * (1 - wOut),
        fontFamily: H, fontWeight: 800, fontStyle: "italic", fontSize: 72, letterSpacing: 2, color: C.cream, whiteSpace: "nowrap" }}>{s.verb}</div>
      {/* the gameplay window: real footage, landing with a spring, a slight 3D tilt settling flat */}
      <div style={{ position: "absolute", left: 540 - W / 2, top, width: W, height: Hh, perspective: 1400 }}>
        <div style={{ width: "100%", height: "100%", borderRadius: 30, overflow: "hidden", border: `3px solid ${s.accent}`, boxShadow: `0 30px 80px rgba(0,0,0,.6), 0 0 60px ${s.accent}55`,
          transform: `translateY(${180 * (1 - win) - 40 * wOut}px) translateX(${-700 * wOut}px) scale(${mix(0.8, 1, win) * (1 - 0.15 * wOut)}) rotateX(${tilt}deg) rotateZ(${-6 * wOut}deg)`,
          opacity: clamp(win * 2.5) }}>
          <div style={{ width: "100%", height: "100%", transform: `scale(${punch})` }}>
            <Sequence from={Math.round(s.t0 * FPS)} durationInFrames={Math.round(len * FPS) + 2} layout="none">
              <OffthreadVideo src={staticFile(`takes/take${s.take}.mp4`)} startFrom={Math.round(s.from * FPS)} muted
                style={s.road ? { position: "absolute", width: 1584, height: 891, left: -342, top: 0 } : { width: "100%", height: "100%" }} />
            </Sequence>
          </div>
        </div>
      </div>
      {/* the runner, big, running in from the left and on in place */}
      {s.road
        ? <Runner i={s.i} T={T} x={mix(-200, 850, runIn) - 900 * wOut} y={1880} h={360} pose="stand" />
        : <>
          <div style={{ position: "absolute", left: 0, top: 1786, width: 1080, height: 6, opacity: 0.35 * (1 - wOut),
            backgroundImage: `repeating-linear-gradient(90deg, ${s.accent} 0 70px, transparent 70px 130px)`, backgroundPosition: `${-u * 900}px 0` }} />
          <Runner i={s.i} T={T} x={mix(-260, 540, runIn) + 900 * wOut} y={1780} h={480} pose={s.i === 1 ? "fly" : s.i === 3 ? "jump" : "run"}
            rot={s.i === 1 ? -6 + 3 * Math.sin(u * 5) : 0} />
          {s.i === 1 && <div style={{ position: "absolute", left: mix(-260, 540, runIn) - 120 + 900 * wOut, top: 1600, width: 60, height: 120, borderRadius: 30, opacity: 0.8,
            background: "radial-gradient(ellipse at 50% 20%, #FFE7A0, #FF8A3D 50%, transparent 70%)", filter: "blur(4px)", transform: `scaleY(${0.8 + 0.3 * Math.sin(u * 40)})` }} />}
        </>}
    </AbsoluteFill>
  );
};

// a diagonal wipe in the next runner's colour between sections (the hand-off)
const Wipe: React.FC<{ T: number; t: number; color: string }> = ({ T, t, color }) => {
  const p = E(T, t - 0.2, 0.42, ease);
  if (p <= 0 || p >= 1) return null;
  return <AbsoluteFill style={{ background: `linear-gradient(115deg, transparent ${mix(-40, 140, p) - 30}%, ${color} ${mix(-40, 140, p) - 18}%, ${color} ${mix(-40, 140, p)}%, transparent ${mix(-40, 140, p) + 8}%)` }} />;
};

// ---------- infinity mode: the leaderboard ----------
const Board: React.FC<{ T: number }> = ({ T }) => {
  const t0 = 21.0, u = T - t0, out = 3.0;
  const o = 1 - E(u, out, 0.25, easeIn), card = S(T, t0 + 0.35, { damping: 15, stiffness: 140 });
  const climb = E(u, 1.2, 1.1, ease);                                            // YOU climbs from 4th to 1st
  const you = Math.round(mix(1400, 2610, E(u, 0.9, 1.4, easeOut)));
  const rows = [{ n: "PLAYER_01", s: 2480 }, { n: "PLAYER_02", s: 2150 }, { n: "PLAYER_03", s: 1920 }];
  const youRank = climb < 0.33 ? 3 : climb < 0.66 ? 2 : climb < 0.98 ? 1 : 0;
  const yOf = (r: number) => 150 + r * 118;
  const prize = S(T, t0 + 2.25, { damping: 9, stiffness: 190 });
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Grid T={T} glow="rgba(233,198,106,.16)" />
      <Chip text="INFINITY MODE" color={C.gold} x={540} y={250} op={clamp((u - 0.05) / 0.15)} s={mix(0.8, 1, S(T, t0 + 0.05))} />
      <Slam text="CLIMB THE" T={T} t0={t0 + 0.1} x={540} y={440} size={170} color={C.cream} />
      <Slam text="LEADERBOARD." T={T} t0={t0 + 0.3} x={540} y={600} size={170} color={C.gold} grad={`linear-gradient(100deg, ${C.gold2}, ${C.gold} 60%, #C99A45)`} />
      <div style={{ position: "absolute", left: 110, top: 760, width: 860, height: 640, borderRadius: 34, background: "rgba(20,20,26,.92)", border: "2px solid rgba(233,198,106,.35)",
        boxShadow: "0 40px 90px rgba(0,0,0,.6)", transform: `translateY(${160 * (1 - card)}px) scale(${mix(0.86, 1, card)})`, opacity: clamp(card * 2.5) }}>
        <div style={{ position: "absolute", left: 44, top: 46, fontFamily: B, fontWeight: 700, fontSize: 30, letterSpacing: 5, color: C.muted }}>GLOBAL LEADERBOARD</div>
        {rows.map((r, k) => {
          const rank = k < youRank ? k : k + 1;   // rows below YOU move down one
          return <Row key={k} y={yOf(rank)} rank={rank + 1} name={r.n} score={r.s} lead={rank === 0} />;
        })}
        <Row y={mix(yOf(3), yOf(0), climb)} rank={youRank + 1} name="YOU" score={you} lead={youRank === 0} you />
      </div>
      <div style={{ position: "absolute", left: 540, top: 1520, transform: `translate(-50%,-50%) scale(${mix(0.5, 1, prize)})`, opacity: clamp(prize * 3), padding: "26px 54px", borderRadius: 60,
        background: `linear-gradient(100deg, ${C.gold2}, ${C.gold})`, color: C.bg, fontFamily: H, fontWeight: 900, fontStyle: "italic", fontSize: 74, letterSpacing: 1, whiteSpace: "nowrap",
        boxShadow: "0 20px 60px rgba(233,198,106,.35)" }}>🏆 PLAY FOR PRIZES</div>
    </AbsoluteFill>
  );
};
const Row: React.FC<{ y: number; rank: number; name: string; score: number; lead?: boolean; you?: boolean }> = ({ y, rank, name, score, lead, you }) => (
  <div style={{ position: "absolute", left: 30, top: y, width: 800, height: 96, borderRadius: 22, display: "flex", alignItems: "center",
    background: lead ? "rgba(233,198,106,.18)" : you ? "rgba(255,255,255,.07)" : "transparent", border: lead ? `2px solid ${C.gold}` : you ? "2px solid rgba(248,241,226,.25)" : "2px solid transparent" }}>
    <div style={{ width: 110, textAlign: "center", fontFamily: H, fontWeight: 900, fontSize: 52, color: lead ? C.gold : C.muted }}>{String(rank).padStart(2, "0")}</div>
    <div style={{ flex: 1, fontFamily: B, fontWeight: 700, fontSize: 40, letterSpacing: 2, color: you ? C.gold2 : C.cream }}>{name}{you ? "  ▲" : ""}</div>
    <div style={{ width: 200, textAlign: "right", paddingRight: 34, fontFamily: H, fontWeight: 900, fontSize: 56, color: lead ? C.gold : C.cream }}>{score}</div>
  </div>
);

// ---------- the call to action: the hand taps PLAY FREE ----------
const CLICK = 26.25;
const HAND_KEYS = [{ at: 24.6, x: 1250, y: 2200 }, { at: CLICK, x: 600, y: 1452, click: true }, { at: 27.4, x: 760, y: 1640 }];
const CTA: React.FC<{ T: number }> = ({ T }) => {
  const t0 = 24.2, u = T - t0;
  const press = T > CLICK + 0.04 ? Math.max(0, 1 - S(T, CLICK + 0.18, { damping: 8, stiffness: 220 })) * clamp((T - CLICK - 0.04) / 0.07) : 0;
  const btn = S(T, t0 + 0.75, { damping: 10, stiffness: 180 });
  const ring = E(T, CLICK + 0.11, 0.7, easeOut);
  return (
    <AbsoluteFill>
      <Grid T={T} glow="rgba(233,198,106,.2)" />
      <Slam text="COYOR" T={T} t0={t0 + 0.05} x={540} y={400} size={280} color={C.cream} />
      <Slam text="RUN" T={T} t0={t0 + 0.25} x={540} y={640} size={280} color={C.gold} grad={`linear-gradient(100deg, ${C.gold2}, ${C.gold} 60%, #C99A45)`} />
      {[0, 1, 2, 3].map((i) => {
        const p = S(T, t0 + 0.35 + i * 0.08, { damping: 10, stiffness: 190 });
        return <Runner key={i} i={i} T={T + i * 0.2} x={[200, 427, 653, 880][i]} y={1260 + 120 * (1 - p)} h={360} pose="stand" op={clamp(p * 3)} sc={mix(0.6, 1, p)} />;
      })}
      <div style={{ position: "absolute", left: 540, top: 1452, transform: `translate(-50%,-50%) scale(${mix(0.6, 1, btn) * (1 - 0.07 * press)})`, opacity: clamp(btn * 3),
        width: 640, height: 150, borderRadius: 75, background: `linear-gradient(100deg, ${C.gold2}, ${C.gold})`, display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: `0 ${24 - 14 * press}px 70px rgba(233,198,106,.4)`, fontFamily: H, fontWeight: 900, fontStyle: "italic", fontSize: 84, color: C.bg, letterSpacing: 2 }}>PLAY FREE</div>
      {ring > 0 && ring < 1 && <div style={{ position: "absolute", left: 600 - 60 - 240 * ring, top: 1452 - 60 - 240 * ring, width: 120 + 480 * ring, height: 120 + 480 * ring, borderRadius: "50%",
        border: `4px solid ${C.gold2}`, opacity: 0.8 * (1 - ring) }} />}
      <div style={{ position: "absolute", left: 540, top: 1600, transform: "translate(-50%,-50%)", opacity: clamp((u - 1.0) / 0.3), fontFamily: B, fontWeight: 700, fontSize: 50, letterSpacing: 8, color: C.cream }}>COYORCLO.COM</div>
      <Hand {...handAt(T * 30, HAND_KEYS, { size: 190 })} />
    </AbsoluteFill>
  );
};

export const Film: React.FC = () => {
  const T = useCurrentFrame() / FPS;
  const ok = useFonts();
  if (!ok) return <AbsoluteFill style={{ background: C.bg }} />;
  const seg = SEGS.find((s) => T >= s.t0 && T < s.t1);
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      {T < 2.6 && <Hook T={T} />}
      {seg && <Section s={seg} T={T} />}
      {T >= 21.0 && T < 24.2 && <Board T={T} />}
      {T >= 24.2 && <CTA T={T} />}
      {T >= 2.6 && T < 2.85 && <AbsoluteFill style={{ background: C.gold, opacity: 1 - E(T, 2.6, 0.25) }} />}
      {SEGS.slice(1).map((s) => <Wipe key={s.i} T={T} t={s.t0} color={s.accent} />)}
      <Wipe T={T} t={21.0} color={C.gold} />
      <Wipe T={T} t={24.2} color={C.gold} />
    </AbsoluteFill>
  );
};
