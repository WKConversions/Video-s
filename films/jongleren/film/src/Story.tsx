// JongLeren.es — one continuous stage. The thread is the logo's red juggling ball: the hook's start dot,
// the juggled to-dos, the five step dots of the route (the site's own "zo gaat dat" line), the progress dot in
// the app, and finally the four balls the bull juggles in the logo. Every move is placed on the voice-over's
// words (clock.ts); see ../../storyboard/plan.md for the phrase-by-phrase table.
import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { T } from "./clock";
import { Ball, C, CARRY, clamp01, EXPO, GROW, LEAVE, mix, Photo, Pill, SMALLPOP, Tick } from "./lib";
import { Bloom, breathe, centred, Flip, Iris, Line, off } from "./kinetic";
import LOGO from "./logo.json";

const k = (g: number, at: string | number, dur: number, ease = EXPO) => T.k(g, at, dur, ease);
const f = (at: string | number) => T.f(at);
/** Working holds: a slow, steady drift (px) since `from` at `pps` px a second, eased in over 0.4 s. */
const drift = (g: number, from: string | number, pps: number) => {
  const t = (g - f(from)) / 30;
  if (t <= 0) return 0;
  return pps * (t < 0.4 ? (t * t) / 0.8 : t - 0.2);
};

/* ---------- the route: the site's five steps, the film's spine ---------- */
const STEPS = ["Intake", "App", "Zoektocht", "Gesprek", "Spanje"];
// two layouts: along the bottom while the steps happen, across the middle for the summary
const routeBottom = (i: number) => ({ x: 300 + i * 330, y: 940 });
const routeMid = (i: number) => ({ x: 330 + i * 315, y: 560 });
// when each dot is ticked
const TICK = ["w:stelt+0.35", "w:volgen", "w:stageplek+0.35", "w:aangenomen+0.25", "w:spanje2"];

// ink → white, for a word whose red mark grows behind it
const inkToWhite = (u: number) => { const a = [0x26, 0x23, 0x1f], v = a.map((c) => Math.round(c + (255 - c) * clamp01(u * 1.4))); return `rgb(${v.join(",")})`; };
/** A white word line for red fields and photos (the kit's Line is for the white pages); ink: dark words for a bright photo. */
const WhiteLine: React.FC<{ g: number; words: { t: string; at: string; under?: string; mark?: string }[]; x: number; y: number; size: number; weight?: number; out?: string; shadow?: boolean; ink?: boolean }> = ({ g, words, x, y, size, weight = 700, out, shadow, ink }) => (
  <div style={{ position: "absolute", left: 0, top: 0, transform: `translate(${x}px, ${y}px)`, display: "flex", gap: size * 0.26, whiteSpace: "nowrap", fontFamily: "Roboto", fontWeight: weight, fontSize: size, lineHeight: 1,
    letterSpacing: "-0.03em", color: C.white, textShadow: shadow ? "0 4px 24px rgba(0,0,0,0.35)" : undefined }}>
    {words.map((w, i) => {
      const kk = T.k(g, w.at, 0.42);
      const o = out ? T.k(g, off(out, i * 0.035), 0.3, LEAVE) : 0;
      const m = w.mark ? T.k(g, w.mark, 0.32, CARRY) : 0;
      return (
        <span key={i} style={{ position: "relative", isolation: "isolate", display: "inline-block", opacity: Math.min(1, kk * 1.7) * (1 - o), color: ink ? (w.mark ? inkToWhite(m) : C.ink) : undefined,
          transform: `translateY(${((1 - kk) * 0.32 - o * 0.3) * size}px)`, filter: kk < 1 || o > 0 ? `blur(${(1 - kk) * 9 + o * 9}px)` : undefined }}>
          {w.mark && <span style={{ position: "absolute", zIndex: -1, left: -size * 0.1, right: -size * 0.1, top: size * 0.04, bottom: -size * 0.12, borderRadius: size * 0.1,
            background: C.red, transformOrigin: "0 50%", transform: `scaleX(${m})` }} />}
          {w.t}
          {w.under && <span style={{ position: "absolute", left: 0, right: 0, bottom: -size * 0.08, height: Math.max(5, size * 0.06), borderRadius: 9, background: C.white,
            transformOrigin: "0 50%", transform: `scaleX(${T.k(g, w.under, 0.45, CARRY)})` }} />}
        </span>
      );
    })}
  </div>
);

/* ---------- 1 · hook: the route starts before the suitcase is packed ---------- */
// what goes in the suitcase: the case waits open and empty while the route already runs ("begint al voordat"),
// then on "koffer pakt" everything flies in from outside the frame, one after the other, and the lid shuts
const PACK = [
  { at: "w:je2+0.02", c: C.pink, x: 40, y: 50, w: 190, h: 86, r: -6, from: [-900, -500] },          // a shirt
  { at: "w:je2+0.1", c: C.terracotta, x: 30, y: 150, w: 250, h: 70, r: 4, from: [700, -700] },     // a towel
  { at: "w:koffer+0.02", c: C.sky, x: 60, y: 232, w: 160, h: 78, r: -3, from: [900, 300] },        // shorts
  { at: "w:koffer+0.1", c: C.red, x: 214, y: 70, w: 86, h: 116, r: 10, from: [400, -800] },        // the passport
  { at: "w:koffer+0.18", c: "#2D2B2A", x: 56, y: 330, w: 120, h: 38, r: -10, from: [-600, 700] },  // sunglasses
  { at: "w:pakt-0.02", c: C.leaf, x: 150, y: 120, w: 130, h: 64, r: 6, from: [900, -300] },        // a cap
];
const Suitcase: React.FC<{ g: number }> = ({ g }) => {
  const enter = k(g, "w:jouw", 0.6);                             // slides in from the right with the first word
  const close = k(g, "w:pakt+0.22", 0.32, CARRY);                 // the lid swings down onto the base
  const W = 340, H = 420;
  const x = 1540 + (1 - enter) * 900 + drift(g, "w:jouw+0.6", 30), y = 790;
  const tag = k(g, "w:pakt+0.45", 0.45);
  return (
    <div style={{ position: "absolute", left: 0, top: 0, transform: `translate(${x - W / 2}px, ${y - H - 30}px)`, width: W, height: H, opacity: enter > 0 ? 1 : 0,
      filter: enter < 0.6 ? `blur(${(0.6 - enter) * 16}px)` : undefined }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: 40, background: "#2D2B2A", boxShadow: "0 30px 50px rgba(38,35,31,0.25)" }} />
      <div style={{ position: "absolute", left: 20, top: 20, right: 20, bottom: 20, borderRadius: 26, background: "#E9E3DC" }} />
      {PACK.map((it, i) => {
        const d = k(g, T.s(it.at) - 0.3, 0.4, CARRY);
        if (d <= 0) return null;
        const arc = Math.sin(d * Math.PI) * -160;
        return <div key={i} style={{ position: "absolute", left: it.x, top: it.y, width: it.w, height: it.h, borderRadius: 12, background: it.c,
          transform: `translate(${(1 - d) * it.from[0]}px, ${(1 - d) * it.from[1] + arc}px) rotate(${it.r + (1 - d) * 160}deg) scale(${1 + (1 - d) * 0.3})`,
          boxShadow: "0 6px 12px rgba(0,0,0,0.14)", filter: d < 0.7 ? `blur(${(0.7 - d) * 10}px)` : undefined }} />;
      })}
      <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H, borderRadius: 40, background: "#3A3836", transformOrigin: "50% 0%",
        transform: `scaleY(${mix(-0.55, 1, close)})` }}>
        {[0.25, 0.5, 0.75].map((p) => <div key={p} style={{ position: "absolute", left: W * p - 3, top: 30, bottom: 30, width: 7, borderRadius: 4, background: "rgba(255,255,255,0.10)" }} />)}
      </div>
      <div style={{ position: "absolute", left: W / 2 - 60, top: -30, width: 120, height: 34, borderRadius: "18px 18px 0 0", border: "12px solid #2D2B2A", borderBottom: "none" }} />
      <div style={{ position: "absolute", left: W - 52, top: -10, width: 76, height: 102, borderRadius: 14, background: C.red, transformOrigin: "50% 0%",
        transform: `rotate(${(1 - tag) * 40 + Math.sin(g / 9) * 4 * tag}deg) scale(${tag})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Img src={staticFile("img/jl-mark-white.png")} style={{ height: 62 }} />
      </div>
      {[46, W - 76].map((wx) => <div key={wx} style={{ position: "absolute", left: wx, top: H - 6, width: 30, height: 30, borderRadius: 15, background: "#1E1C1B" }} />)}
    </div>
  );
};

const Hook: React.FC<{ g: number }> = ({ g }) => {
  if (g > f("w:jongleren+0.6")) return null;
  const drop = k(g, "w:begint-0.25", 0.38, SMALLPOP);
  const lineK = k(g, "w:begint-0.1", 0.7, CARRY);
  const run = k(g, "w:al", 1.0, CARRY);                           // the red progress already under way, a ball at its head
  return (
    <AbsoluteFill>
      <Bloom g={g} x={1500} y={260} r={420} color="#F9D5D6" />
      <Line g={g} x={200 - drift(g, "w:jouw", 20)} y={230} size={112} weight={700} dy={0.6} out="turn+0.05"
        words={[{ t: "Jouw", at: "w:jouw" }, { t: "stage", at: "w:stage" }, { t: "in", at: "w:in" }, { t: "Spanje", at: "w:spanje", accent: true, under: "w:spanje+0.3" }]} />
      <Line g={g} x={200 - drift(g, "w:jouw", 20)} y={372} size={112} weight={700} dy={0.6} out="turn+0.1" color={C.ink}
        words={[{ t: "begint", at: "w:begint" }, { t: "al.", at: "w:al" }]} />
      <div style={{ position: "absolute", left: 150, top: 787, width: 1620, height: 6, transformOrigin: "0 50%", transform: `scaleX(${lineK})`,
        backgroundImage: `repeating-linear-gradient(90deg, ${C.line} 0 22px, transparent 22px 38px)` }} />
      <div style={{ position: "absolute", left: 150, top: 785, width: 1060, height: 10, borderRadius: 5, background: C.red, transformOrigin: "0 50%", transform: `scaleX(${run})` }} />
      {run > 0 && run < 1 && <Ball x={150 + 1060 * run} y={790} r={16} />}
      <Ball x={150} y={790 - (1 - drop) * 420} r={26} style={{ opacity: drop > 0 ? 1 : 0 }} />
      <div style={{ position: "absolute", left: 112, top: 830, fontFamily: "Roboto", fontWeight: 700, fontSize: 30, color: C.soft, opacity: k(g, "w:begint+0.2", 0.4) }}>Start</div>
      <Suitcase g={g} />
    </AbsoluteFill>
  );
};

/* ---------- 2 · turn: JongLeren juggles it all ---------- */
const TODOS = [
  { t: "Stageplek", from: [-300, 180], heap: [1260, 360, -14] },
  { t: "Schooleisen", from: [2200, 120], heap: [1420, 500, 9] },
  { t: "Huisvesting", from: [2300, 980], heap: [1210, 630, -6] },
  { t: "Gesprekken", from: [1300, 1300], heap: [1460, 760, 12] },
];
// the logo, large, while it juggles: centred at (700, 520), 460 px tall
const TURN_MARK = { cx: 700, cy: 500, h: 470 };
// the mark's own move (rises, settles, slowly grows), so the juggled balls stay in the bull's hands
const turnMark = (g: number) => {
  const markIn = k(g, "w:jongleren", 0.55), markOut = k(g, "intake-0.05", 0.4, LEAVE);
  return { markIn, markOut, cy: TURN_MARK.cy + (1 - markIn) * 90 - drift(g, "w:jongleren+0.5", 40),
    sc: (0.9 + 0.1 * markIn + drift(g, "w:jongleren+0.5", 0.05)) * (1 - markOut * 0.3) };
};
// a point of the logo image (900 x 1120) in the frame
const turnPoint = (g: number, p: number[]) => {
  const s = TURN_MARK.h / 1120, m = turnMark(g);
  return { x: TURN_MARK.cx + (p[0] - 450) * s * m.sc, y: m.cy + (p[1] - 560) * s * m.sc };
};
// the cascade, in logo coordinates: up from the left hand (205, 460) along the arc of the logo's own four balls,
// over the head, down into the right hand (660, 390); then a quick low pass back to the left hand
const cascade = (u: number) => {
  const c = [430, 420], rx = 255, ry = 355, a0 = Math.PI * 1.03, a1 = -Math.PI * 0.03;
  const at = (th: number) => [c[0] + rx * Math.cos(th), c[1] - ry * Math.sin(th)];
  if (u < 0.78) return at(mix(a0, a1, u / 0.78));
  const v = (u - 0.78) / 0.22, p = at(a1), q = at(a0);
  return [mix(p[0], q[0], v), mix(p[1], q[1], v) + Math.sin(v * Math.PI) * 50];
};
const JUGGLE_PERIOD = 1.1;
// a juggled to-do: the logo's red ball, ringed in white so it reads on the white mark and on the red field;
// a white centre opens once it lands on the route (a step dot)
const TodoBall: React.FC<{ t: { toBall: number; route: number; x: number; y: number } }> = ({ t }) => {
  if (t.toBall <= 0.55 || t.route >= 1) return null;
  const r = mix(19, 22, t.route), c = clamp01((t.route - 0.75) / 0.25);
  return (
    <Ball x={t.x} y={t.y} r={r} color={C.red} style={{ opacity: clamp01((t.toBall - 0.55) / 0.25), boxShadow: `0 0 0 ${5 * (1 - t.route)}px ${C.white}` }}>
      {t.route > 0.75 && <div style={{ width: (r - 6) * 2 * c, height: (r - 6) * 2 * c, borderRadius: "50%", background: C.white }} />}
    </Ball>
  );
};

const Turn: React.FC<{ g: number }> = ({ g }) => {
  if (g < f("turn") || g > f("w:plannen+0.4")) return null;
  const field = k(g, "w:jongleren-0.22", 0.75, GROW);             // the red field grows out of the start ball
  const recede = k(g, "intake", 0.5, CARRY);                      // and closes into the first step dot
  const r = field * 2400 * (1 - recede) + (recede > 0 ? 0 : 0);
  const { markIn, markOut, cy: markCy, sc: markSc } = turnMark(g);
  const sTurn = TURN_MARK.h / 1120;
  const todos = TODOS.map((td, i) => {
    // fly in to a heap on "wordt alles", shrink into a ball on "stuk" and join the juggle
    const arrive = k(g, off("w:wordt", i * 0.1), 0.5);
    const toBall = k(g, off("w:stuk", -0.1 + i * 0.05), 0.45, CARRY);
    // the juggle: four balls a quarter of a cycle apart on the cascade
    const ph = (((g - f("w:stuk")) / 30 / JUGGLE_PERIOD + 0.6 - i * 0.25) % 1 + 1) % 1;
    const jp = turnPoint(g, cascade(ph));
    // then down to the route on "eerst"
    const route = k(g, off("intake", i * 0.04), 0.6, CARRY);
    const rp = routeBottom(i);
    const wob = arrive * (1 - toBall);
    const x0 = mix(td.from[0], td.heap[0], arrive) + Math.sin(g / 6 + i) * 14 * wob, y0 = mix(td.from[1], td.heap[1], arrive) + Math.cos(g / 7 + i * 1.7) * 12 * wob;
    const x = mix(mix(x0, jp.x, toBall), rp.x, route), y = mix(mix(y0, jp.y, toBall), rp.y, route);
    const rot = (td.heap[2] + (1 - arrive) * (i % 2 ? 140 : -140) + Math.sin(g / 5 + i * 2) * 9 * arrive) * (1 - toBall);
    return { arrive, toBall, route, x, y, rot };
  }).filter((t) => t.arrive > 0);
  return (
    <AbsoluteFill>
      <Iris x={mix(150, routeBottom(0).x, recede)} y={mix(760, routeBottom(0).y, recede)} r={r} bg={C.red}>
        <div style={{ position: "absolute", left: 0, top: 0,
          opacity: markIn * (1 - markOut), transform: `translate(${TURN_MARK.cx - (900 * sTurn) / 2}px, ${markCy - TURN_MARK.h / 2}px) scale(${markSc})` }}>
          <Img src={staticFile("img/jl-mark-white-blank.png")} style={{ height: TURN_MARK.h }} />
        </div>
        <WhiteLine g={g} x={150 + drift(g, "w:alles+0.4", 50)} y={870} size={76} out="intake-0.1"
          words={[{ t: "Alles", at: "w:alles" }, { t: "een", at: "w:een" }, { t: "stuk", at: "w:stuk" }, { t: "makkelijker.", at: "w:makkelijker", under: "w:makkelijker+0.25" }]} />
      </Iris>
      {todos.map((t, i) => (
        <React.Fragment key={i}>
          {t.toBall < 1 && (
            <div style={{ position: "absolute", left: 0, top: 0, transform: `translate(${t.x}px, ${t.y}px) translate(-50%, -50%) rotate(${t.rot}deg) scale(${1 - t.toBall * 0.9})`,
              opacity: 1 - clamp01((t.toBall - 0.6) / 0.3), filter: t.arrive < 0.7 ? `blur(${(0.7 - t.arrive) * 12}px)` : undefined }}>
              <Pill text={TODOS[i].t} size={40} style={{ position: "relative" }} />
            </div>
          )}
          <TodoBall t={t} />
        </React.Fragment>
      ))}
    </AbsoluteFill>
  );
};

/* ---------- the route along the bottom (intake → housing) and across the middle (summary) ---------- */
const Route: React.FC<{ g: number; top?: boolean }> = ({ g, top }) => {
  if (g < f("intake") || g > f("close+0.9")) return null;
  if (!top && g >= f("journey")) return null;
  if (top && g < f("journey")) return null;
  const aside = top ? 0 : k(g, "w:waarin-0.1", 0.4, LEAVE) * (1 - k(g, "w:met2+0.15", 0.5));
  const show = k(g, "intake+0.15", 0.5) * (1 - k(g, "w:vinden-0.2", 0.35, LEAVE)) * (1 - aside) + k(g, "journey", 0.5) * (1 - k(g, "close+0.3", 0.4, LEAVE));
  const mid = k(g, "journey", 0.6, CARRY);
  const lineDraw = k(g, "intake+0.1", 0.7, CARRY);
  const pos = (i: number) => { const a = routeBottom(i), b = routeMid(i); return { x: mix(a.x, b.x, mid), y: mix(a.y, b.y, mid) }; };
  const p0 = pos(0), p4 = pos(4);
  // the red progress follows the ticks; in the summary it draws again from the first question to the last day
  const ticked = TICK.map((t) => k(g, t, 0.35, SMALLPOP));
  const prog = TICK.slice(0, 4).reduce((a, t) => a + k(g, off(t, -0.1), 0.55, CARRY), 0) / 4;
  const summary = k(g, "w:tot-0.1", 1.1, CARRY);
  const progShown = g >= f("journey") ? summary : prog;
  return (
    <AbsoluteFill style={{ opacity: show, transform: aside > 0 ? `translateY(${aside * 120}px)` : undefined }}>
      <div style={{ position: "absolute", left: p0.x, top: p0.y - 3, width: p4.x - p0.x, height: 6, borderRadius: 3, background: C.line, transformOrigin: "0 50%", transform: `scaleX(${lineDraw})` }} />
      <div style={{ position: "absolute", left: p0.x, top: p0.y - 5, width: p4.x - p0.x, height: 10, borderRadius: 5, background: C.red, transformOrigin: "0 50%", transform: `scaleX(${progShown})` }} />
      {g >= f("journey") && summary > 0 && summary < 1 && <Ball x={p0.x + (p4.x - p0.x) * summary} y={p0.y} r={38} />}
      {STEPS.map((s, i) => {
        const p = pos(i);
        const tk = g >= f("journey") ? k(g, off("w:tot", -0.1 + i * 0.22), 0.3, SMALLPOP) : ticked[i];
        const appear = i < 4 ? (g >= f(off("intake", 0.6 + i * 0.04)) ? 1 : 0) : k(g, "intake+0.55", 0.4, SMALLPOP);
        const r = (22 + tk * 6) * (g >= f("journey") ? 1 + 0.45 * Math.sin(Math.PI * tk) : 1);
        if (top && i < 4 && k(g, liftAt(i), 0.65, CARRY) > 0) return null;
        // dots 1-4 rise into the logo's four balls on "JongLeren"; the fifth folds into the mark
        return (
          <React.Fragment key={s}>
            <div style={{ position: "absolute", left: p.x - r, top: p.y - r, width: 2 * r, height: 2 * r, borderRadius: "50%", transform: `scale(${appear})`,
              background: tk > 0.05 ? C.red : C.white, border: tk > 0.05 ? "none" : `6px solid ${C.red}`, boxSizing: "border-box",
              display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 18px rgba(38,35,31,0.12)" }}>
              {tk > 0.05 && <Tick k={tk} size={r * 1.5} />}
            </div>
            <div style={{ position: "absolute", left: p.x - 160, top: p.y + 36, width: 320, textAlign: "center", fontFamily: "Roboto", fontWeight: 700, fontSize: 38,
              color: tk > 0.5 ? C.ink : i === ticked.findIndex((t) => t <= 0.5) ? C.red : C.soft, opacity: appear * (1 - mid) }}>{s}</div>
          </React.Fragment>
        );
      })}
    </AbsoluteFill>
  );
};

/* ---------- 3 · intake: a video call ---------- */
const STUDIES = ["Marketing & Communicatie", "IT-sector", "Toerisme & Recreatie"];
const Intake: React.FC<{ g: number }> = ({ g }) => {
  if (g < f("w:eerst") || g >= f("w:vervolgens+0.47")) return null;
  // the card grows out of the first dot
  const grow = k(g, "w:eerst+0.05", 0.55);
  const morph = k(g, "w:vervolgens-0.05", 0.5, CARRY);          // the card folds into the phone
  const d0 = routeBottom(0);
  const dx = drift(g, "w:eerst+0.6", 40), dz = drift(g, "w:eerst+0.6", 0.02);
  const W = mix(980, 420, morph), H = mix(600, 820, morph), cx = mix(960 - dx, 960, morph), cy = mix(470, 470, morph);
  const x = mix(d0.x, cx, grow), y = mix(d0.y, cy, grow), s = mix(0.06, 1, grow);
  const pick = k(g, "w:plannen", 0.45, CARRY);                   // the day picked
  const call = k(g, "w:intakegesprek-0.05", 0.5);                // the week strip gives way to the call
  const fade = 1 - k(g, "w:vervolgens-0.1", 0.25, LEAVE);
  const days = ["ma", "di", "wo", "do", "vr"];
  const talk = (n: number) => 10 + Math.abs(Math.sin(g / 3.1 + n * 1.7)) * 34 * k(g, "w:vertelt-0.2", 0.3) * (1 - k(g, "w:stelt+0.2", 0.3));
  const studyAt = (i: number) => (i === 0 ? "w:wat" : i === 1 ? "w:je4" : "w:studeert");
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H, borderRadius: mix(30, 64, morph), background: mix(0, 1, morph) > 0.5 ? "#1E1C1B" : C.white,
      willChange: "transform", transform: `translate(${x - W / 2}px, ${y - H / 2}px) scale(${s * mix(1.08 + dz, 1, morph)})`, boxShadow: "0 40px 90px rgba(38,35,31,0.20)", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: mix(0, 14, morph), borderRadius: mix(30, 52, morph), background: C.white, overflow: "hidden", opacity: 1 }}>
        <div style={{ opacity: fade, position: "absolute", inset: 0 }}>
          {/* header */}
          <div style={{ position: "absolute", left: 48, top: 40, fontFamily: "Roboto", fontWeight: 700, fontSize: 52, color: C.ink, letterSpacing: "-0.02em" }}>Intakegesprek</div>
          <div style={{ position: "absolute", left: 50, top: 104, fontFamily: "Roboto", fontWeight: 500, fontSize: 28, color: C.soft }}>Online · vrijblijvend</div>
          {/* the week: a day is picked on "plannen" */}
          <div style={{ position: "absolute", left: 48, top: 180, display: "flex", gap: 22, opacity: 1 - call, transform: `translateY(${-call * 60}px)` }}>
            {days.map((d, i) => {
              const on = i === 1 ? pick : 0;
              return <div key={d} style={{ position: "relative", width: 154, height: 150, borderRadius: 26, background: C.grey, color: on > 0 ? inkToWhite(on) : C.ink, overflow: "hidden",
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "Roboto", transform: `scale(${1 + Math.sin(on * Math.PI) * 0.08})` }}>
                {on > 0 && <div style={{ position: "absolute", inset: 0, background: C.red, clipPath: `circle(${on * 110}px at 50% 50%)` }} />}
                <div style={{ position: "relative", fontWeight: 700, fontSize: 30, opacity: 0.7 }}>{d}</div>
                <div style={{ position: "relative", height: 56, width: 154 }}>
                  <div style={{ position: "absolute", left: 0, right: 0, textAlign: "center", fontWeight: 700, fontSize: 48, opacity: 1 - clamp01(on * 2.5) }}>·</div>
                  <div style={{ position: "absolute", left: 0, right: 0, textAlign: "center", fontWeight: 700, fontSize: 48, opacity: clamp01(on * 2 - 0.5), transform: `translateY(${(1 - on) * 14}px)` }}>14:00</div>
                </div>
              </div>;
            })}
          </div>
          {/* the call: JongLeren and you; on "vertelt" your tile becomes the big one */}
          {(() => {
            const sw = k(g, "w:vertelt-0.1", 0.5, CARRY);
            const jl = { x: mix(48, 48, sw), y: 170, w: mix(430, 250, sw), h: mix(250, 250, sw) };
            const me = { x: mix(502, 322, sw), y: 170, w: mix(430, 610, sw), h: 250 };
            return (
              <div style={{ position: "absolute", left: 0, top: 0, opacity: call, transform: `translateY(${(1 - call) * 70}px)` }}>
                <div style={{ position: "absolute", left: jl.x, top: jl.y, width: jl.w, height: jl.h, borderRadius: 26, background: C.red, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Img src={staticFile("img/jl-mark-white.png")} style={{ height: mix(170, 140, sw) }} />
                  <div style={{ position: "absolute", left: 18, bottom: 14, fontFamily: "Roboto", fontWeight: 700, fontSize: 24, color: C.white }}>JongLeren</div>
                </div>
                <div style={{ position: "absolute", left: me.x, top: me.y, width: me.w, height: me.h, borderRadius: 26, background: C.warm, overflow: "hidden", boxShadow: sw > 0 ? `0 0 0 ${6 * sw}px ${C.red}` : undefined }}>
                  <div style={{ position: "absolute", left: me.w / 2 - 50, top: 46, width: 100, height: 100, borderRadius: 50, background: "#D6CFC7" }} />
                  <div style={{ position: "absolute", left: me.w / 2 - 100, top: 156, width: 200, height: 120, borderRadius: "100px 100px 0 0", background: "#D6CFC7" }} />
                  <div style={{ position: "absolute", right: 18, top: 16, display: "flex", gap: 6, alignItems: "flex-end", height: 50 }}>
                    {[0, 1, 2, 3, 4, 5].map((n) => <div key={n} style={{ width: 9, height: talk(n), borderRadius: 5, background: C.red }} />)}
                  </div>
                  <div style={{ position: "absolute", left: 18, bottom: 14, fontFamily: "Roboto", fontWeight: 700, fontSize: 24, color: C.ink }}>Jij</div>
                </div>
              </div>
            );
          })()}
          {/* what you study: the field rolls through the site's sectors */}
          <div style={{ position: "absolute", left: 50, top: 452, fontFamily: "Roboto", fontWeight: 700, fontSize: 28, color: C.soft, opacity: k(g, "w:vertelt", 0.4) }}>Studie</div>
          <div style={{ position: "absolute", left: 180, top: 438, height: 58, width: 520, overflow: "hidden", opacity: k(g, "w:vertelt", 0.4) }}>
            {STUDIES.map((s2, i) => {
              const inn = k(g, studyAt(i), 0.32, CARRY), out = i < 2 ? k(g, studyAt(i + 1), 0.32, CARRY) : 0;
              return <div key={s2} style={{ position: "absolute", left: 0, top: 0, transform: `translateY(${(1 - inn) * 60 - out * 60}px)` }}>
                <Pill text={s2} size={30} bg={i === 2 ? C.red : C.grey} color={i === 2 ? C.white : C.ink} style={{ position: "relative", boxShadow: "none" }} />
              </div>;
            })}
          </div>
          {/* what you're looking for */}
          <div style={{ position: "absolute", left: 50, top: 526, fontFamily: "Roboto", fontWeight: 700, fontSize: 28, color: C.soft, opacity: k(g, "w:zoekt-0.1", 0.4) }}>Wensen</div>
          <div style={{ position: "absolute", left: 180, top: 512, display: "flex", gap: 14 }}>
            {["Málaga", "Marbella", "Stage + woning"].map((w, i) => {
              const p = k(g, off("w:zoekt", -0.2 + i * 0.12), 0.5, CARRY);
              return <div key={w} style={{ transform: `translateX(${(1 - p) * 900}px) rotate(${(1 - p) * 20}deg)`, opacity: p > 0 ? 1 : 0, filter: p < 0.7 ? `blur(${(0.7 - p) * 10}px)` : undefined }}><Pill text={w} size={28} bg={C.grey} color={C.ink} style={{ position: "relative", boxShadow: "none" }} /></div>;
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

/** The school's requirements: a checklist that slides in and ticks on "eisen" … "school". */
const School: React.FC<{ g: number }> = ({ g }) => {
  if (g < f("w:welke-0.3") || g > f("w:vervolgens+0.4")) return null;
  const inn = k(g, "w:welke-0.15", 0.5), out = k(g, "w:vervolgens-0.1", 0.3, LEAVE);
  const rows = ["w:eisen", "w:jouw2", "w:school+0.12"];
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 520, height: 420, borderRadius: 30, background: C.white,
      boxShadow: "0 40px 90px rgba(38,35,31,0.22)", transform: `translate(${1270 + (1 - inn) * 900 + out * 900 - drift(g, "w:welke+0.35", 30)}px, ${330 - drift(g, "w:welke+0.35", 14)}px) rotate(${3 - inn * 1}deg)`, filter: inn < 0.7 || out > 0 ? `blur(${(0.7 - Math.min(inn, 0.7)) * 12 + out * 14}px)` : undefined }}>
      <div style={{ position: "absolute", left: 40, top: 34, display: "flex", alignItems: "center", gap: 18 }}>
        <svg width="56" height="56" viewBox="0 0 64 64"><path d="M32 10 L60 24 L32 38 L4 24 Z" fill={C.red} /><path d="M16 31 V44 C22 51 42 51 48 44 V31 L32 39 Z" fill={C.red} opacity="0.8" /></svg>
        <div style={{ fontFamily: "Roboto", fontWeight: 700, fontSize: 40, color: C.ink, letterSpacing: "-0.02em" }}>Eisen van school</div>
      </div>
      {rows.map((r, i) => {
        const t = k(g, r, 0.35, SMALLPOP);
        return <div key={i} style={{ position: "absolute", left: 40, top: 140 + i * 88, display: "flex", alignItems: "center", gap: 22 }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: t > 0.05 ? C.red : C.grey, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${0.9 + 0.1 * t})` }}>
            <Tick k={t} size={44} />
          </div>
          <div style={{ fontFamily: "Roboto", fontWeight: 500, fontSize: 32, color: t > 0.5 ? C.ink : C.soft }}>{["Stageperiode", "Uren per week", "Leerdoelen"][i]}</div>
        </div>;
      })}
    </div>
  );
};

/* ---------- 4 · the app ---------- */
const PHONE = { cx: 960, cy: 470, w: 420, h: 820 };
const AppPhone: React.FC<{ g: number }> = ({ g }) => {
  if (g < f("w:vervolgens+0.05") || g > f("w:met2+0.5")) return null;
  const phoneOn = g >= f("w:vervolgens+0.47");
  const toSide = k(g, "search", 0.6, CARRY);
  const leave = k(g, "w:met2-0.2", 0.45, LEAVE);
  const cx = mix(PHONE.cx - drift(g, "w:vervolgens+0.47", 46), 470, toSide) - leave * 900, cy = PHONE.cy, sc = mix(1, 0.92, toSide) + drift(g, "w:vervolgens+0.47", 0.008) * (1 - toSide);
  const tap = k(g, "w:download+0.12", 0.25);
  const ring = k(g, "w:download+0.2", 0.55, CARRY);
  const open = k(g, "w:app", 0.5);
  const sheet = k(g, "w:waarin-0.05", 0.5);
  const rows = ["Intakegesprek", "Installeer de app", "Zoektocht", "Kennismaking", "Stage in Spanje"];
  const rowTick = ["intake", "w:stap+0.15", "w:stageplek+0.35", "w:aangenomen+0.25", "w:spanje2"];
  const icon = { x: PHONE.w / 2, y: 300 };
  const fly = k(g, "w:vervolgens+0.05", 0.6);
  const slot = { x: cx + (14 + icon.x - PHONE.w / 2) * sc, y: cy + (14 + icon.y - PHONE.h / 2) * sc };
  const fx = mix(-220, slot.x, fly), fy = mix(260, slot.y, fly) - Math.sin(fly * Math.PI) * 140, fs = mix(2.2, sc, fly);
  return (
    <>
    {fly > 0 && fly < 1 && (
      <div style={{ position: "absolute", left: fx - 90, top: fy - 90, width: 180, height: 180, borderRadius: 44, background: C.red, display: "flex", alignItems: "center", justifyContent: "center",
        transform: `scale(${fs}) rotate(${(1 - fly) * -25}deg)`, zIndex: 5, boxShadow: "0 30px 60px rgba(120,0,6,0.3)", filter: fly < 0.5 ? `blur(${(0.5 - fly) * 14}px)` : undefined }}>
        <Img src={staticFile("img/jl-mark-white.png")} style={{ height: 130 }} />
      </div>
    )}
    {phoneOn && <div style={{ position: "absolute", left: 0, top: 0, width: PHONE.w, height: PHONE.h, transform: `translate(${cx - PHONE.w / 2}px, ${cy - PHONE.h / 2}px) scale(${sc})`,
      borderRadius: 64, background: "#1E1C1B", boxShadow: "0 50px 100px rgba(38,35,31,0.28)", filter: leave > 0 ? `blur(${leave * 14}px)` : undefined }}>
      <div style={{ position: "absolute", inset: 14, borderRadius: 52, background: C.white, overflow: "hidden" }}>
        {/* the store: icon, name, download → ring */}
        <div style={{ position: "absolute", inset: 0, opacity: 1 - open }}>
          <div style={{ position: "absolute", left: icon.x - 90, top: icon.y - 90, width: 180, height: 180, borderRadius: 44, background: C.red, display: "flex", alignItems: "center", justifyContent: "center",
            opacity: fly >= 1 ? 1 : 0 }}>
            <Img src={staticFile("img/jl-mark-white.png")} style={{ height: 130 }} />
          </div>
          <svg style={{ position: "absolute", left: icon.x - 118, top: icon.y - 118 }} width={236} height={236} viewBox="0 0 236 236">
            <circle cx={118} cy={118} r={110} fill="none" stroke={C.grey} strokeWidth={10} opacity={tap > 0 ? 1 : 0} />
            <circle cx={118} cy={118} r={110} fill="none" stroke={C.red} strokeWidth={10} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - ring} transform="rotate(-90 118 118)" />
          </svg>
          <div style={{ position: "absolute", left: 0, right: 0, top: 440, textAlign: "center", fontFamily: "Roboto", fontWeight: 700, fontSize: 40, color: C.ink }}>JongLeren.es</div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 492, textAlign: "center", fontFamily: "Roboto", fontWeight: 500, fontSize: 24, color: C.soft }}>Jouw stage in Spanje</div>
          <div style={{ position: "absolute", left: 96, top: 580, width: 200, height: 72, borderRadius: 36, background: ring > 0.98 ? C.ink : C.red, color: C.white,
            display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Roboto", fontWeight: 700, fontSize: 30, transform: `scale(${1 - Math.sin(tap * Math.PI) * 0.08})` }}>
            {ring > 0.98 ? "Open" : ring > 0 ? `${Math.round(ring * 100)}%` : "Download"}
          </div>
        </div>
        {/* the app opens out of its icon: their home screen */}
        {open > 0 && (
          <div style={{ position: "absolute", inset: 0, clipPath: `circle(${open * 900}px at ${icon.x}px ${icon.y}px)` }}>
            <Img src={staticFile("img/app.png")} style={{ position: "absolute", left: -58, top: -70, width: 508, transform: `translateY(${-drift(g, "w:app+0.3", 70)}px)` }} />
          </div>
        )}
        {/* the sheet: every step, followed */}
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 560, borderRadius: "36px 36px 0 0", background: C.white, boxShadow: "0 -20px 40px rgba(38,35,31,0.15)",
          transform: `translateY(${(1 - sheet) * 600}px)` }}>
          <div style={{ position: "absolute", left: 32, top: 30, fontFamily: "Roboto", fontWeight: 700, fontSize: 36, color: C.ink }}>Mijn stage</div>
          <div style={{ position: "absolute", left: 51, top: 118, width: 6, height: 380, background: C.grey }} />
          <div style={{ position: "absolute", left: 51, top: 118, width: 6, height: 380, background: C.red, transformOrigin: "50% 0%",
            transform: `scaleY(${rowTick.slice(0, 4).reduce((a, t) => a + k(g, t, 0.35, CARRY), 0) / 4})` }} />
          {rows.map((r, i) => {
            const t = k(g, rowTick[i], 0.35, SMALLPOP);
            const active = i === 2 && g > f("w:volgen") && t < 0.05;
            const slide = k(g, off("w:waarin", 0.1 + i * 0.07), 0.45);
            return <div key={r} style={{ position: "absolute", left: 30, top: 100 + i * 92, display: "flex", alignItems: "center", gap: 20, transform: `translateX(${(1 - slide) * 420}px)`, opacity: slide > 0 ? 1 : 0 }}>
              <div style={{ width: 48, height: 48, borderRadius: 24, background: t > 0.05 ? C.red : C.white, border: t > 0.05 ? "none" : `5px solid ${active ? C.red : C.line}`, boxSizing: "border-box",
                display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${active ? 1 + Math.sin(g / 4) * 0.08 : 1})` }}>
                {t > 0.05 && <Tick k={t} size={36} />}
              </div>
              <div style={{ fontFamily: "Roboto", fontWeight: t > 0.5 || active ? 700 : 500, fontSize: 28, color: t > 0.5 || active ? C.ink : C.soft }}>{r}</div>
            </div>;
          })}
        </div>
      </div>
    </div>}
    </>
  );
};

/* ---------- 5 · the search, the match, the meeting ---------- */
const VACANCIES = [
  ["Marketing & Communicatie", "Málaga"], ["IT-sector", "Granada"], ["Handel & Ondernemerschap", "Torremolinos"], ["Mode & Interieur", "Marbella"],
  ["Zorg & Welzijn", "Benalmádena"], ["Socialwork", "Málaga"], ["Marketing & Communicatie", "Marbella"], ["IT-sector", "Málaga"],
  ["Toerisme & Recreatie", "Málaga"],
];
const CARD = { cx: 1250, cy: 450, w: 620, h: 380 };
const Search: React.FC<{ g: number }> = ({ g }) => {
  if (g < f("search") || g > f("house+0.6")) return null;
  const t0 = T.s("w:zoeken");
  const gap = 0.1;                                                  // a card every 3 frames
  const flip = k(g, "w:regelen-0.3", 0.5, CARRY);                    // the match card turns into the invitation
  const expand = k(g, "w:met2-0.1", 0.6, CARRY);                     // the invitation opens into the photo
  const away = k(g, "house", 0.6, LEAVE);                            // the photo leaves for the housing option
  const stamp = k(g, "w:aangenomen", 0.42, SMALLPOP);
  const md = drift(g, "w:stageplek", 50);
  const W = mix(CARD.w, 1240, expand), H = mix(CARD.h, 820, expand), cx = mix(CARD.cx - md, 960, expand), cy = mix(CARD.cy, 470, expand);
  const ring = k(g, "w:stageplek+0.15", 0.4, CARRY);
  const link = k(g, "w:kennismakingsgesprek", 0.6, CARRY);
  const last = VACANCIES.length - 1;
  return (
    <AbsoluteFill>
      {VACANCIES.map(([title, city], i) => {
        if (i === last) return null;
        const ti = t0 + i * gap, sec = g / 30;
        const u = clamp01((sec - ti) / (gap * 2.2));                 // flicks right → left past the slot
        if (u <= 0 || u >= 1) return null;
        const x = CARD.cx + 900 - u * 1500;
        return <VacancyCard key={i} title={title} city={city} x={x} y={CARD.cy} w={CARD.w} h={CARD.h} blur={Math.sin(u * Math.PI) * 10} rot={-4 + u * 8} />;
      })}
      <Confetti g={g} />
      {/* the passende stageplek: lands, rings, turns into the invitation, opens into the company */}
      {g >= f(off("w:zoeken", last * gap - 0.05)) && (
        <div style={{ position: "absolute", left: 0, top: 0,
          width: W, height: H, willChange: "transform", transform: `translate(${cx - W / 2 - away * 1500 + (1 - k(g, off("w:zoeken", last * gap - 0.05), 0.45)) * 900}px, ${cy - H / 2 - away * 260}px) scale(${(1 - away * 0.45) * (1 + 0.16 * k(g, "w:regelen", 1.9, CARRY) * (1 - expand))})`, transformOrigin: "50% 50%", filter: away > 0 ? `blur(${away * 14}px)` : undefined }}>
          <Flip k={expand > 0 ? 1 : flip} style={{ width: "100%", height: "100%" }}
            a={<VacancyCard title={VACANCIES[last][0]} city={VACANCIES[last][1]} x={W / 2} y={H / 2} w={W} h={H} ring={ring} />}
            b={<Invite g={g} w={W} h={H} link={link} expand={expand} stamp={stamp} />} />
        </div>
      )}
    </AbsoluteFill>
  );
};

const Confetti: React.FC<{ g: number }> = ({ g }) => {
  const t = (g - f("w:aangenomen+0.15")) / 30;
  if (t <= 0 || t > 1.05) return null;
  const cols = [C.red, C.pink, C.terracotta, C.white, C.leaf];
  return (
    <>
      {Array.from({ length: 22 }, (_, i) => {
        const a = (i * 137.5 * Math.PI) / 180, sp = 700 + ((i * 53) % 9) * 110;
        const vx = Math.cos(a) * sp, vy = -Math.abs(Math.sin(a)) * sp - 300;
        const x = 640 + vx * t, y = 760 + vy * t + 0.5 * 1500 * t * t;
        return <div key={i} style={{ position: "absolute", left: x, top: y, width: 24, height: 14, borderRadius: 4, background: cols[i % cols.length],
          transform: `rotate(${i * 47 + t * 720 * (i % 2 ? 1 : -1)}deg)`, opacity: 1 - clamp01((t - 0.6) / 0.45), boxShadow: "0 2px 4px rgba(0,0,0,0.12)" }} />;
      })}
    </>
  );
};

const VacancyCard: React.FC<{ title: string; city: string; x: number; y: number; w: number; h: number; blur?: number; rot?: number; ring?: number }> = ({ title, city, x, y, w, h, blur = 0, rot = 0, ring = 0 }) => (
  <div style={{ position: "absolute", left: x - w / 2, top: y - h / 2, width: w, height: h, borderRadius: 30, background: C.white, transform: `rotate(${rot}deg)`,
    boxShadow: `0 40px 80px rgba(38,35,31,0.18)${ring > 0 ? `, 0 0 0 ${ring * 10}px ${C.red}` : ""}`, filter: blur > 0.5 ? `blur(${blur}px)` : undefined }}>
    <div style={{ position: "absolute", left: 40, top: 38 }}><Pill text="Stagevacature" size={24} bg={C.grey} color={C.ink} style={{ position: "relative", boxShadow: "none" }} /></div>
    <div style={{ position: "absolute", left: 40, top: 118, fontFamily: "Roboto", fontWeight: 700, fontSize: 44, color: C.ink, letterSpacing: "-0.02em", width: w - 80, lineHeight: 1.05 }}>{title}</div>
    <div style={{ position: "absolute", left: 40, bottom: 40, display: "flex", alignItems: "center", gap: 12, fontFamily: "Roboto", fontWeight: 700, fontSize: 30, color: C.red }}>
      <svg width="26" height="34" viewBox="0 0 26 34"><path d="M13 0 C6 0 0 6 0 13 C0 23 13 34 13 34 C13 34 26 23 26 13 C26 6 20 0 13 0 Z" fill={C.red} /><circle cx="13" cy="13" r="5" fill={C.white} /></svg>
      {city}
    </div>
    {ring > 0 && (
      <div style={{ position: "absolute", right: 34, top: 34, transform: `scale(${ring})` }}>
        <Pill text="Match" size={28} bg={C.red} color={C.white} style={{ position: "relative" }} icon={<div style={{ width: 30, height: 30 }}><Tick k={ring} size={30} /></div>} />
      </div>
    )}
  </div>
);

const Invite: React.FC<{ g: number; w: number; h: number; link: number; expand: number; stamp: number }> = ({ g, w, h, link, expand, stamp }) => (
  <div style={{ position: "absolute", inset: 0, borderRadius: 30, background: C.white, overflow: "hidden", boxShadow: "0 40px 80px rgba(38,35,31,0.20)" }}>
    <div style={{ position: "absolute", inset: 0, opacity: 1 - clamp01(expand * 1.6) }}>
      <div style={{ position: "absolute", left: 40, top: 36 }}><Pill text="Uitnodiging" size={24} bg={C.red} color={C.white} style={{ position: "relative", boxShadow: "none" }} /></div>
      <div style={{ position: "absolute", left: 40, top: 110, fontFamily: "Roboto", fontWeight: 700, fontSize: 42, color: C.ink, letterSpacing: "-0.02em" }}>Kennismakingsgesprek</div>
      <div style={{ position: "absolute", right: 40, top: 36, transform: `translateX(${(1 - k(g, "w:regelen+0.05", 0.5, CARRY)) * 700}px)` }}>
        <Pill text="do · 10:00" size={24} bg={C.grey} color={C.ink} style={{ position: "relative", boxShadow: "none" }} /></div>
      {/* you and the company, joined by the red line */}
      <div style={{ position: "absolute", left: 60, top: 210, width: 100, height: 100, borderRadius: 50, background: C.warm, display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "Roboto", fontWeight: 700, fontSize: 30, color: C.ink }}>Jij</div>
      <div style={{ position: "absolute", left: 170, top: 255, width: w - 400, height: 10, borderRadius: 5, background: C.red, transformOrigin: "0 50%", transform: `scaleX(${link})` }} />
      <div style={{ position: "absolute", left: w - 210, top: 210, width: 100, height: 100, borderRadius: 50, background: C.red, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${0.8 + 0.2 * link})` }}>
        <svg width="54" height="54" viewBox="0 0 54 54"><rect x="10" y="8" width="34" height="40" rx="3" fill={C.white} /><g fill={C.red}>{[0, 1, 2].map((r) => [0, 1].map((c) => <rect key={`${r}${c}`} x={17 + c * 12} y={14 + r * 10} width="7" height="6" />))}</g><rect x="23" y="38" width="8" height="10" fill={C.red} /></svg>
      </div>
      <div style={{ position: "absolute", left: w - 260, top: 318, width: 200, textAlign: "center", fontFamily: "Roboto", fontWeight: 700, fontSize: 24, color: C.soft }}>Het bedrijf</div>
    </div>
    {/* the company, for real: interns with their manager (jongleren.es) */}
    {expand > 0 && (
      <div style={{ position: "absolute", inset: 0, clipPath: `circle(${expand * 1500}px at ${w - 160}px 260px)` }}>
        <Img src={staticFile("img/company.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 35%", transform: `scale(${1.2 - 0.12 * expand + drift(g, "w:met2", 0.03)})`, transformOrigin: "60% 40%" }} />
      </div>
    )}
    {stamp > 0 && (
      <div style={{ position: "absolute", left: 50, bottom: 50, transform: `rotate(${-5 + (1 - stamp) * 10}deg) scale(${mix(1.8, 1, stamp)})`, opacity: clamp01(stamp * 3),
        display: "flex", alignItems: "center", gap: 18, padding: "22px 34px", borderRadius: 26, background: C.red, boxShadow: "0 20px 50px rgba(120,0,6,0.35)" }}>
        <div style={{ width: 60, height: 60, borderRadius: 30, background: C.white, display: "flex", alignItems: "center", justifyContent: "center" }}><Tick k={stamp} size={48} color={C.red} /></div>
        <div style={{ fontFamily: "Roboto", fontWeight: 700, fontSize: 64, color: C.white, letterSpacing: "-0.02em" }}>Aangenomen!</div>
      </div>
    )}
  </div>
);

/* ---------- 6 · housing, if you want it: over their photo of a white house in Spain ---------- */
const HOUSE = { w: 2400, h: 1600, door: [1612, 824] };
const houseZoom = (g: number) => 1.12 + drift(g, "house", 0.03);
// the house in frame coordinates (cover 1920 wide, centred, zoom about the frame centre)
export const housePoint = (g: number) => {
  const s0 = 1920 / HOUSE.w, z = houseZoom(g);
  const x = HOUSE.door[0] * s0, y = HOUSE.door[1] * s0 - (HOUSE.h * s0 - 1080) / 2;
  return { x: 960 + (x - 960) * z, y: 540 + (y - 540) * z };
};
const Housing: React.FC<{ g: number }> = ({ g }) => {
  if (g < f("house") || g > f("w:eenmaal+0.8")) return null;
  const photo = k(g, "house+0.05", 0.6);
  const inn = k(g, "house+0.15", 0.5), out = k(g, "w:vinden-0.1", 0.35, LEAVE);
  const on = k(g, "w:indien", 0.35, CARRY);
  const veil = 0.6 * (1 - k(g, "w:vinden-0.05", 0.6));
  const dy = drift(g, "house+0.6", 58);
  const knob = { x: 1404 + mix(-34, 34, on), y: 540 - dy };
  const pin = k(g, "w:huisvesting+0.05", 0.4, SMALLPOP);
  const hp = housePoint(g);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity: photo }}>
        <Img src={staticFile("img/house.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${houseZoom(g)})` }} />
        <AbsoluteFill style={{ background: `rgba(255,255,255,${veil})` }} />
        <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.82) 22%, rgba(255,255,255,0) 42%)", opacity: k(g, "w:vinden-0.05", 0.5) }} />
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1120, height: 220, borderRadius: 34, background: C.white, opacity: inn * (1 - out),
        boxShadow: "0 40px 90px rgba(38,35,31,0.22)", display: "flex", alignItems: "center", gap: 30, paddingLeft: 44, boxSizing: "border-box", transform: `translate(${960 - 560}px, ${540 - 110 + (1 - inn) * 500 - dy}px) scale(${1 - out * 0.2})` }}>
        <div style={{ width: 110, height: 110, borderRadius: 55, background: C.red, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="60" height="60" viewBox="0 0 60 60"><path d="M30 8 L54 28 H47 V52 H13 V28 H6 Z" fill={C.white} /><rect x="25" y="36" width="10" height="16" fill={C.red} /></svg>
        </div>
        <div>
          <div style={{ fontFamily: "Roboto", fontWeight: 700, fontSize: 52, color: C.ink, letterSpacing: "-0.02em" }}>Huisvesting regelen?</div>
          <div style={{ fontFamily: "Roboto", fontWeight: 500, fontSize: 30, color: C.soft, marginTop: 6 }}>Indien nodig</div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, top: 0, transform: `translate(${1404 - 74}px, ${540 - 42 + (1 - inn) * 500 - dy}px)`, width: 148, height: 84, borderRadius: 42, background: on > 0.5 ? C.red : "#D7D2CD", opacity: inn * (1 - out) }} />
      <Ball x={knob.x} y={540 + (1 - inn) * 500 - dy} r={34} color={C.white} style={{ opacity: inn * (1 - out), boxShadow: "0 4px 10px rgba(0,0,0,0.18)" }} />
      <Line g={g} x={150} y={110} size={84} weight={700}
        words={[{ t: "Huisvesting", at: "w:vinden+0.05", accent: true }, { t: "dicht", at: "w:vinden+0.2" }, { t: "bij", at: "w:vinden+0.27" }, { t: "je", at: "w:vinden+0.34" }, { t: "stage.", at: "w:vinden+0.41", under: "w:huisvesting+0.1" }]} />
      {/* the key pin lands on the house */}
      <div style={{ position: "absolute", left: 0, top: 0, opacity: pin > 0 ? 1 : 0, transform: `translate(${hp.x - 50}px, ${hp.y - 136 - (1 - pin) * 320}px) scale(${0.6 + 0.4 * pin})`, transformOrigin: "50% 100%" }}>
        <svg width="100" height="136" viewBox="0 0 88 120"><path d="M44 0 C20 0 0 20 0 44 C0 78 44 120 44 120 C44 120 88 78 88 44 C88 20 68 0 44 0 Z" fill={C.red} /><path d="M44 22 L66 41 H60 V62 H28 V41 H22 Z" fill={C.white} /></svg>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- 7 · in Spain: the suitcase arrived; support ---------- */
const HERO = { w: 2560, h: 1707, suitcase: [870, 1262] };
// the hero fills the frame with object-fit cover (scale 0.75, 62% vertical position) and a slow push about
// ORIGIN; the suitcase's place in the frame follows from that, for the ring
const HERO_ORIGIN = [0.45 * 1920, 0.7 * 1080];
const heroPoint = (p: number[], z: number) => {
  const s = 1920 / HERO.w, oy = -(HERO.h * s - 1080) * 0.62;
  const x = p[0] * s, y = p[1] * s + oy;
  return [HERO_ORIGIN[0] + (x - HERO_ORIGIN[0]) * z, HERO_ORIGIN[1] + (y - HERO_ORIGIN[1]) * z];
};
const Spain: React.FC<{ g: number }> = ({ g }) => {
  if (g < f("spain") || g > f("close+0.6")) return null;
  const hp = housePoint(g), pinX = hp.x, pinY = hp.y - 80;
  const open = k(g, "spain", 0.6);                                  // out of the pin
  const shrink = k(g, "w:ook2-0.05", 0.6, CARRY);                     // the photo becomes a card for the team beside it
  const dealOut = k(g, "w:met4-0.15", 0.95, CARRY);
  const z = 1.24 - 0.2 * k(g, "spain", 2.2) - 0.04 * clamp01((g - f("spain")) / 150);   // the push on the photo, settling
  const card = { x: 540, y: 560, w: 760, h: 560 };
  const cx = mix(960, card.x - drift(g, "w:ook2+0.55", 30), shrink) - dealOut * 1300, cy = mix(540, card.y, shrink) - dealOut * 200;
  const cw = mix(1920, card.w, shrink), ch = mix(1080, card.h, shrink);
  const ring = k(g, "w:spanje2+0.05", 0.5, CARRY);
  const [sx, sy] = heroPoint(HERO.suitcase, z);
  const team = k(g, "w:staan-0.15", 0.55);
  return (
    <AbsoluteFill>
      <Iris x={pinX} y={pinY} r={open * 2400} bg={C.warm}>
        <Bloom g={g} x={1500} y={220} r={380} color="#F9D5D6" k={shrink} />
        <div style={{ position: "absolute", left: 0, top: 0, width: cw, height: ch, overflow: "hidden", borderRadius: shrink * 28,
          boxShadow: shrink > 0 ? `0 40px 90px rgba(38,35,31,${0.22 * shrink})` : undefined, transform: `translate(${cx - cw / 2}px, ${cy - ch / 2}px) rotate(${-2 * shrink}deg)`, filter: dealOut > 0 ? `blur(${dealOut * 12}px)` : undefined }}>
          <Img src={staticFile("img/hero.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 62%",
            transform: `scale(${z})`, transformOrigin: `${(HERO_ORIGIN[0] / 1920) * 100}% ${(HERO_ORIGIN[1] / 1080) * 100}%` }} />
          {/* the suitcase from the hook, arrived: ringed (only while the photo is full frame) */}
          <svg style={{ position: "absolute", left: sx - 120, top: sy - 135, overflow: "visible", opacity: 1 - clamp01(shrink * 4) }} width="240" height="260" viewBox="0 0 240 260">
            <path d="M120 14 C190 10 232 70 226 136 C220 206 166 248 108 244 C46 240 8 190 14 124 C20 60 70 16 132 18" fill="none" stroke={C.red} strokeWidth="10" strokeLinecap="round"
              pathLength={1} strokeDasharray={1} strokeDashoffset={1 - ring} />
          </svg>
          {(() => { const t5 = k(g, "w:spanje2+0.45", 0.35, SMALLPOP); return t5 > 0 && (
            <Ball x={sx + 100} y={sy - 112} r={34} style={{ transform: `translate(${sx + 66}px, ${sy - 146}px) scale(${t5})`, opacity: 1 - clamp01(shrink * 4), boxShadow: "0 8px 18px rgba(38,35,31,0.25)" }}><Tick k={t5} size={50} /></Ball>); })()}
        </div>
        <WhiteLine g={g} x={140} y={130} size={110} ink out="w:ook2-0.1" words={[{ t: "Eenmaal", at: "w:eenmaal" }, { t: "in", at: "w:in2" }, { t: "Spanje?", at: "w:spanje2", mark: "w:spanje2+0.15" }]} />
        {/* the team beside you */}
        <Photo src="img/team.jpg" w={760} h={560} pos="50% 40%" zoom={1.04 + 0.04 * team + drift(g, "w:staan", 0.035)}
          style={{ left: 0, top: 0, transform: `translate(${1380 - 380 + (1 - team) * 900 - dealOut * 2100 + drift(g, "w:staan+0.4", 30) * (1 - dealOut)}px, ${560 - 280 - dealOut * 200}px) rotate(${2 - dealOut * 4}deg)`, opacity: team > 0 && dealOut < 1 ? 1 : 0,
            filter: team < 0.6 || dealOut > 0 ? `blur(${(0.6 - Math.min(team, 0.6)) * 14 + dealOut * 12}px)` : undefined }}>
          <div style={{ position: "absolute", left: 24, bottom: 22 }}><Pill text="Team JongLeren · Málaga" size={26} style={{ position: "relative" }} /></div>
        </Photo>
        <Line g={g} x={150} y={110} size={84} weight={700} out="w:persoonlijke+0.4"
          words={[{ t: "We", at: "w:staan" }, { t: "staan", at: "w:we3" }, { t: "voor", at: "w:voor" }, { t: "je", at: "w:je10" }, { t: "klaar.", at: "w:klaar", accent: true, under: "w:klaar+0.2" }]} />
        <Support g={g} />
      </Iris>
    </AbsoluteFill>
  );
};

const SUPPORT = [
  { src: "img/visit.jpg", label: "Persoonlijke begeleiding", at: "w:persoonlijke-0.1", x: 420, y: 560, r: -4, pos: "50% 35%" },
  { src: "img/coaching.jpg", label: "Coaching", at: "w:coaching-0.1", x: 960, y: 540, r: 1.5, pos: "50% 55%" },
  { src: "img/meetup.jpg", label: "Activiteiten", at: "w:activiteiten-0.1", x: 1500, y: 560, r: 4, pos: "50% 50%" },
];
// in the summary the three cards fold into the route's fifth dot, Spanje, where this support happens
const Support: React.FC<{ g: number }> = ({ g }) => {
  if (g < f("w:met4-0.2")) return null;
  return (
    <>
      {SUPPORT.map((c, i) => {
        const d = k(g, c.at, 0.55);
        const toDot = k(g, off("journey", 0.1 + i * 0.06), 0.6, CARRY);
        const dot = routeMid(4);
        const w = mix(500, 56, toDot), h = mix(600, 56, toDot);
        const up = drift(g, T.s(c.at) + 0.55, 40 + i * 10);
        const hide = k(g, off("close", -0.2 + i * 0.05), 0.35, LEAVE);
        const row = 270 * (2 - k(g, SUPPORT[1].at, 0.6, CARRY) - k(g, SUPPORT[2].at, 0.6, CARRY));   // 1 card: centred; 2: a pair; 3: the row
        const x = mix(c.x + row + (1 - d) * 1100, dot.x, toDot), y = mix(c.y + (1 - d) * 500 - up, dot.y, toDot) - hide * 160;
        if (d <= 0 || toDot >= 1) return null;
        return (
          <div key={c.label} style={{ position: "absolute", left: 0, top: 0, width: w, height: h, borderRadius: mix(28, 90, toDot), overflow: "hidden", background: C.white,
            transform: `translate(${x - w / 2}px, ${y - h / 2}px) rotate(${mix(c.r + (1 - d) * 12, 0, toDot)}deg)`,
            boxShadow: "0 40px 80px rgba(38,35,31,0.22)", opacity: (1 - hide) * (1 - clamp01((toDot - 0.8) / 0.2)),
            filter: d < 0.6 ? `blur(${(0.6 - d) * 16}px)` : undefined }}>
            <div style={{ position: "absolute", left: 0, top: 0, width: "100%", height: mix(470, 56, toDot), overflow: "hidden" }}>
              <Img src={staticFile(c.src)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: c.pos,
                transform: `scale(${1.08 - 0.06 * d + drift(g, T.s(c.at) + 0.5, 0.09)})` }} />
            </div>
            <div style={{ position: "absolute", left: 26, right: 20, top: 492, fontFamily: "Roboto", fontWeight: 700, fontSize: 40, color: C.ink, letterSpacing: "-0.02em", opacity: 1 - toDot, lineHeight: 1.05, whiteSpace: "nowrap" }}>
              {i === 0 ? <>Persoonlijke<br /><span style={{ position: "relative" }}>begeleiding
                <span style={{ position: "absolute", left: 0, right: 0, bottom: -6, height: 7, borderRadius: 4, background: C.red, transformOrigin: "0 50%", transform: `scaleX(${k(g, "w:begeleiding", 0.4, CARRY)})` }} /></span></> : c.label}
            </div>
          </div>
        );
      })}
    </>
  );
};

/* ---------- 8 · the whole journey: from the first question to the last day ---------- */
const Journey: React.FC<{ g: number }> = ({ g }) => {
  if (g < f("journey") || g > f("close+0.7")) return null;
  const q = k(g, "w:vraag-0.15", 0.4, SMALLPOP);
  const end = k(g, "w:stagedag-0.1", 0.4, SMALLPOP);
  const out = k(g, "close-0.1", 0.35, LEAVE);
  const a = routeMid(0), b = routeMid(4);
  return (
    <AbsoluteFill style={{ opacity: 1 - out }}>
      <Line g={g} x={150 + drift(g, "w:van2+0.3", 60)} y={130} size={92} weight={700} dy={0.6} out="close-0.15"
        words={[{ t: "Van", at: "w:van2" }, { t: "je", at: "w:je11" }, { t: "eerste", at: "w:eerste" }, { t: "vraag", at: "w:vraag", accent: true }]} />
      <Line g={g} x={700 - drift(g, "w:tot+0.3", 60)} y={780} size={100} weight={700} dy={0.6} out="close-0.1"
        words={[{ t: "tot", at: "w:tot" }, { t: "je", at: "w:je12" }, { t: "laatste", at: "w:laatste" }, { t: "stagedag.", at: "w:stagedag", accent: true }]} />
      {/* the first question */}
      <div style={{ position: "absolute", left: a.x - 210, top: a.y - 150, width: 140, height: 120, transform: `scale(${q})`, transformOrigin: "100% 100%" }}>
        <svg width="140" height="120" viewBox="0 0 140 120"><path d="M20 0 H120 A20 20 0 0 1 140 20 V80 A20 20 0 0 1 120 100 H50 L22 120 L28 100 H20 A20 20 0 0 1 0 80 V20 A20 20 0 0 1 20 0 Z" fill={C.red} /></svg>
        <div style={{ position: "absolute", left: 0, top: 6, width: 140, textAlign: "center", fontFamily: "Roboto", fontWeight: 700, fontSize: 72, color: C.white }}>?</div>
      </div>
      {/* the last day */}
      <div style={{ position: "absolute", left: b.x + 70, top: a.y - 170, width: 150, height: 160, transform: `scale(${end})`, transformOrigin: "0% 100%", borderRadius: 24, background: C.white,
        boxShadow: "0 20px 50px rgba(38,35,31,0.2)", overflow: "hidden" }}>
        <div style={{ height: 46, background: C.red }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 54, textAlign: "center", fontFamily: "Roboto", fontWeight: 700, fontSize: 64, color: C.ink }}>✓</div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- 9 · close: the dots become the bull's juggling balls, on a card in Granada ---------- */
// when route dot i lifts off for the logo (before Granada opens, so the hand-over is seen)
const liftAt = (i: number) => off("close", -0.05 + i * 0.06);
const END_MARK = { cx: 960, cy: 390, h: 400 };
const END_WORD = { w: (END_MARK.h * 900) / 1120, top: END_MARK.cy + END_MARK.h / 2 + (END_MARK.h * 19) / 1122 };
const TAG = [{ t: "Jouw", at: "w:jouw3" }, { t: "stage,", at: "w:stage2" }, { t: "volledig", at: "w:volledig", accent: true }, { t: "begeleid.", at: "w:begeleid", accent: true }];
const Close: React.FC<{ g: number }> = ({ g }) => {
  if (g < f("close-0.2")) return null;
  const s = END_MARK.h / 1120, left = END_MARK.cx - (900 * s) / 2, top = END_MARK.cy - END_MARK.h / 2;
  const bg = k(g, "close+0.12", 0.7);
  const card = k(g, "close+0.02", 0.6);
  const mark = k(g, "w:jongleren2-0.05", 0.6);
  const word = k(g, "w:jongleren2+0.25", 0.5);
  return (
    <AbsoluteFill>
      {/* Granada behind (jongleren.es locations), pushing in slowly */}
      <AbsoluteFill style={{ clipPath: `circle(${bg * 1250}px at 960px 520px)` }}>
        <Img src={staticFile("img/granada.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 60%",
          transform: `scale(${1.16 - 0.08 * bg + drift(g, "close", 0.065)})` }} />
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 960 - 560, top: 150, width: 1120, height: 650, borderRadius: 40, background: C.white,
        boxShadow: "0 50px 120px rgba(38,35,31,0.30)", transform: `scale(${mix(0.85, 1, card)})`, opacity: card }} />
      <div style={{ position: "absolute", left: 0, top: 0, opacity: mark, transform: `translate(${left}px, ${top + (1 - mark) * 50}px) scale(${0.94 + 0.06 * mark})` }}>
        <Img src={staticFile("img/jl-mark.png")} style={{ height: END_MARK.h }} />
      </div>
      {LOGO.balls.map((b, i) => {
        // from route dot i, an arc up into the ball: the juggle
        const u = k(g, liftAt(i), 0.65, CARRY);
        if (u <= 0) return null;
        const from = routeMid(i), to = { x: left + b[0] * s, y: top + b[1] * s };
        const x = mix(from.x, to.x, u), y = mix(from.y, to.y, u) - Math.sin(u * Math.PI) * 200;
        const r = mix(26, b[2] * s, u);
        return <Ball key={i} x={x} y={y} r={r} color={u > 0.85 ? C.white : C.red} />;
      })}
      <Img src={staticFile("img/jl-word.png")} style={{ position: "absolute", left: 0, top: 0, transform: `translate(${960 - END_WORD.w / 2}px, ${END_WORD.top + (1 - word) * 30}px)`, width: END_WORD.w, opacity: word }} />
      <Line g={g} x={centred(TAG, 54, 960, 700)} y={692} size={54} weight={700} dy={0.6} words={TAG} />
    </AbsoluteFill>
  );
};

export const Story: React.FC = () => {
  const g = useCurrentFrame();
  const cam = breathe(g, "close", 0.035);
  return (
    <AbsoluteFill style={{ background: C.white }}>
      <AbsoluteFill style={{ transform: `translate(${cam.x}px, ${cam.y}px) scale(${cam.s}) perspective(4000px) rotateX(0.01deg)`, transformOrigin: "50% 50%" }}>
        <Bloom g={g} x={260} y={180} r={360} color="#F7E3D6" />
        <Hook g={g} />
        <Turn g={g} />
        <Route g={g} />
        <Intake g={g} />
        <School g={g} />
        <AppPhone g={g} />
        <Search g={g} />
        <Housing g={g} />
        <Spain g={g} />
        <Route g={g} top />
        <Journey g={g} />
        <Close g={g} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
