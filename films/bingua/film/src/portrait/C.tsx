// Portrait (1080×1920) version of scene C — re-laid out from ../scenes/C.tsx. See ../../../plan/portrait.md.
// Scene C (12.45–21.6 s): See a word you want to remember? Save it instantly. / Bingua turns your discoveries into
// smart flashcards and quizzes, helping new vocabulary stick. See ../../../plan/storyboard.md.
// Same content, animation and timing as the 16:9 scene; only the layout changes for the vertical frame:
// the video card on top with the Cards tile top-right, the transcript line card under it (+ Save to the left of the
// lifted word); the deck centred big with Forgot / Got it under it, rising on "quizzes" to make room for the four quiz
// modes (a 2×2 grid) and the quiz card under them; the quiz card grows into a tall, 940-wide memory chart.
import React from "react";
import { Sequence } from "remotion";
import { measure } from "../kinetic";
import { ARRIVE, C, CARD, Feed, Ico, MOVE, SANS, SNAP, SaveBtn, Tap, VideoCard, clamp01, f, k, mix } from "../shared";

const lin = (x: number) => x;
const pulse = (p: number) => (p > 0 && p < 1 ? Math.sin(p * Math.PI) : 0);
const sec = (at: string) => f(at) / 30;

/* ======================= beat 1: the line, the word, + Save ======================= */
const VID = { x: 280, y: 236, w: 520, h: 924 };
const CD = { x: 60, w: 960 };                  // the transcript card
const PAD = 36, BPX = 36, BPY = 28;            // card padding, active-block padding
const ES = 70, LH = ES * 1.2, GAP = ES * 0.27, EN = 36;
const CH = PAD * 2 + BPY * 2 + LH * 2 + 16 + EN * 1.3;
const CY = 1250;
const ROWS = [["O", "sea,", "trae", "lechuga"], ["para", "cinco", "familias,", "tío."]];
const ww = (t: string) => measure(t, ES, 700, -0.015);
const TX = CD.x + PAD + BPX, TY = CY + PAD + BPY;
const LX = TX + ww("O") + ww("sea,") + ww("trae") + GAP * 3, LW = ww("lechuga");
const LCX = LX + LW / 2, LCY = TY + LH / 2;     // lechuga's slot centre
const LIFT = 112;
const SX = LX - 44;                             // + Save's right edge, left of the lifted word
const TILE = { cx: 912, cy: 320, s: 156 };     // the Cards tab tile

/* ======================= beat 2–4: chips → flashcards → quizzes ======================= */
type WD = { w: string; t: string; from: [number, number]; at: [number, number]; ch: number };
const MID: [number, number] = [540, 860];
// back to front: the deck's top card is lechuga, the word just saved
const WORDS: WD[] = [
  { w: "tío", t: "man", from: [-220, 1250], at: [560, 530], ch: 16.3 },
  { w: "nos vemos", t: "see you", from: [1320, 1300], at: [770, 1180], ch: 16.38 },
  { w: "la noche", t: "the night", from: [380, 2100], at: [300, 1030], ch: 16.22 },
  { w: "grandes", t: "great", from: [850, -150], at: [790, 700], ch: 16.14 },
  { w: "ocupado", t: "busy", from: [-320, 520], at: [300, 680], ch: 16.07 },
  { w: "lechuga", t: "lettuce", from: [TILE.cx, TILE.cy], at: [540, 860], ch: 16.46 },
];
const CHS = 48, CHT = 36, CHH = 100;
const chipW = (d: WD) => measure(d.w, CHS, 700, -0.02) + measure(d.t, CHT, 500, -0.01) + 16 + 72;
const FW = 700, FH = 452;                       // flashcard
const FAN = [
  { r: -14, x: -70, y: 22 }, { r: 12, x: 66, y: 20 }, { r: -8.5, x: -42, y: 10 }, { r: 7, x: 40, y: 8 }, { r: -3.5, x: -16, y: 2 }, { r: 0, x: 0, y: 0 },
];
const DX = 540, DY0 = 860, DY1 = 520;           // the deck's centre, before / after it rises on "quizzes"
const BW = 320, BH = 96, BG = 44;               // Forgot / Got it
const QUIZ = [{ n: "headphones", l: "Listening" }, { n: "keyboard", l: "Typing" }, { n: "match", l: "Matching" }, { n: "mic", l: "Speaking" }];
const QX = 70, QY = DY1 + FH / 2 + BG + BH + 38, QW = 460, QH = 116, QG = 20;
const MC = { x: 70, y: QY + 2 * QH + QG + 38, w: 940, h: 340 };
const CHART = { x: 70, y: 425, w: 940, h: 1010 };

/* ======================= beat 5: the memory chart ======================= */
const PL = 110, PR = 870, PT = 340, PB = 900, PWD = PR - PL, PHT = PB - PT;
const REV = [0.17, 0.39, 0.66];
const LAM = [5.4, 3.4, 2.1, 0.42];
const FORGET = 0.3;
const mem = (u: number) => {
  let s = 0, i = 0;
  while (i < REV.length && u >= REV[i]) { s = REV[i]; i++; }
  return Math.exp(-LAM[i] * (u - s));
};
const px = (u: number) => PL + u * PWD, py = (m: number) => PB - m * PHT;
const curvePath = (uh: number) => {
  let d = `M${px(0)} ${py(1)}`;
  let segStart = 0;
  for (let i = 0; i <= REV.length; i++) {
    const end = Math.min(uh, i < REV.length ? REV[i] : 1);
    for (let u = segStart + 0.004; u < end; u += 0.004) d += ` L${px(u).toFixed(1)} ${py(Math.exp(-LAM[i] * (u - segStart))).toFixed(1)}`;
    d += ` L${px(end).toFixed(1)} ${py(Math.exp(-LAM[i] * (end - segStart))).toFixed(1)}`;
    if (i < REV.length && uh >= REV[i]) { d += ` L${px(REV[i]).toFixed(1)} ${py(1)}`; segStart = REV[i]; } else break;
  }
  return d;
};
const ghostPath = () => {
  let d = `M${px(0)} ${py(1)}`;
  for (let u = 0.004; u <= 0.62; u += 0.006) d += ` L${px(u).toFixed(1)} ${py(Math.exp(-LAM[0] * u)).toFixed(1)}`;
  return d;
};
const GHOST = ghostPath();

/* ======================= small pieces ======================= */
const WordChip: React.FC<{ d: WD; o?: number }> = ({ d, o = 1 }) => (
  <div style={{ display: "flex", alignItems: "baseline", gap: 16, fontFamily: SANS, whiteSpace: "nowrap", opacity: o }}>
    <span style={{ fontWeight: 700, fontSize: CHS, letterSpacing: "-0.02em", color: C.ink }}>{d.w}</span>
    <span style={{ fontWeight: 500, fontSize: CHT, letterSpacing: "-0.01em", color: C.gray }}>{d.t}</span>
  </div>
);
const Front: React.FC<{ w: string; o?: number }> = ({ w, o = 1 }) => (
  <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20, opacity: o }}>
    <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
      <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 88, letterSpacing: "-0.035em", color: C.ink }}>{w}</div>
      <Ico n="speaker" s={50} c={C.sky} w={2.6} />
    </div>
    <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 30, letterSpacing: "0.08em", color: C.light }}>TAP TO FLIP</div>
  </div>
);
const Back: React.FC = () => (
  <div style={{ position: "absolute", inset: 0, padding: "40px 48px", boxSizing: "border-box", fontFamily: SANS, transform: "rotateY(180deg)" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
      <div style={{ fontWeight: 700, fontSize: 66, letterSpacing: "-0.035em", color: C.ink }}>lechuga</div>
      <Ico n="speaker" s={40} c={C.sky} w={2.6} />
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 4 }}>
      <div style={{ fontWeight: 600, fontSize: 48, letterSpacing: "-0.02em", color: C.sky }}>lettuce</div>
      <div style={{ fontWeight: 700, fontSize: 23, letterSpacing: "0.06em", color: C.green, background: C.greenTint, borderRadius: 8, padding: "5px 12px" }}>NOUN</div>
    </div>
    <div style={{ marginTop: 24, background: C.bg, borderRadius: 20, padding: "18px 24px" }}>
      <div style={{ fontWeight: 600, fontSize: 24, letterSpacing: "0.06em", color: C.light }}>IN CONTEXT</div>
      <div style={{ fontWeight: 700, fontSize: 33, lineHeight: 1.3, color: C.ink2, marginTop: 6 }}>
        O sea, trae <span style={{ color: C.sky }}>lechuga</span> para cinco familias, tío.
      </div>
    </div>
  </div>
);
const Btn: React.FC<{ kind: "forgot" | "got"; hot?: number }> = ({ kind, hot = 0 }) => {
  const got = kind === "got", c = got ? C.green : C.red;
  return (
    <div style={{ width: BW, height: BH, borderRadius: 24, boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center", gap: 14,
      background: got ? C.greenTint : C.redTint, border: `2.5px solid ${got ? `rgba(46,139,78,${0.35 + 0.65 * hot})` : "rgba(229,72,77,0.35)"}`,
      fontFamily: SANS, fontWeight: 600, fontSize: 38, color: c, transform: `scale(${1 - 0.06 * pulse(hot < 1 ? hot : 0)})` }}>
      <Ico n={got ? "check" : "x"} s={38} c={c} w={3} />{got ? "Got it" : "Forgot"}
    </div>
  );
};

export const SceneCP: React.FC<{ g: number }> = ({ g }) => {
  if (g < f(12.45) || g > f(21.6)) return null;
  const t = g / 30;

  /* ---------- beat 1 ---------- */
  const b1Out = k(g, 15.88, 0.36, MOVE);
  const b1 = b1Out < 1;
  const spoken = (i: number) => k(g, 12.72 + i * 0.07, 0.16, lin);
  const tapW = k(g, "w:word-0.08", 0.5, lin);
  const mark = k(g, "w:word", 0.26, SNAP);
  const lift = k(g, "w:remember-0.05", 0.5, ARRIVE);
  const saveIn = k(g, "w:save-0.32", 0.32, SNAP);
  const tapS = k(g, "w:save-0.06", 0.5, lin);
  const saved = t >= sec("w:save") + 0.08 ? 1 : 0;
  const press = pulse(k(g, "w:save-0.02", 0.24, lin));
  const fly = k(g, "w:instantly", 0.5, MOVE);
  const saveOut = k(g, "w:instantly", 0.2, MOVE);
  const tileIn = k(g, "w:save-0.32", 0.4, SNAP);
  const landT = sec("w:instantly") + 0.5;
  const badge = pulse(k(g, landT - 0.02, 0.32, lin));
  const roll = k(g, landT - 0.02, 0.3, SNAP);
  const tileHit = pulse(k(g, landT - 0.04, 0.26, lin));
  // the word: in its slot → lifted chip → flies in an arc into the Cards tile
  const wx = mix(LCX, TILE.cx, fly), wy = mix(LCY - LIFT * lift, TILE.cy - 6, fly) - 170 * Math.sin(Math.PI * fly);
  const ws = mix(1 + 0.04 * lift, 0.32, fly), wo = 1 - clamp01((fly - 0.82) / 0.18);
  const chipBg = clamp01(lift * 1.4);
  const b1o = 1 - b1Out, b1s = (1 - 0.06 * b1Out) * (1 + 0.035 * k(g, 12.9, 3.0, lin));

  /* ---------- beat 2–4 ---------- */
  const qShift = k(g, "w:quizzes-0.3", 0.45, MOVE);
  const DY = mix(DY0, DY1, qShift);
  const flip = k(g, "w:flashcards", 0.36, MOVE);
  const btnIn = (i: number) => k(g, sec("w:flashcards") + 0.2 + i * 0.06, 0.34, SNAP);
  const tapG = k(g, "w:and3-0.3", 0.5, lin);
  const gotHot = k(g, "w:and3-0.22", 0.22, SNAP);
  const b4Out = k(g, "w:helping-0.14", 0.32, MOVE);
  const morphCh = k(g, "w:helping-0.08", 0.5, MOVE);
  const mcIn = k(g, "w:quizzes+0.06", 0.4, ARRIVE);
  const tapQ = k(g, "w:quizzes+0.26", 0.5, lin);
  const right = k(g, "w:quizzes+0.34", 0.22, SNAP);
  const mcO = 1 - k(g, "w:helping-0.06", 0.14, lin);
  const chartO = k(g, "w:helping+0.12", 0.3, lin);
  const drawU = t < sec("w:stick") - 0.04 ? 0.86 * k(g, "w:helping+0.16", sec("w:stick") - 0.04 - sec("w:helping") - 0.16, (x) => Math.pow(x, 0.85))
      : 0.86 + 0.09 * k(g, "w:stick-0.04", 21.15 - sec("w:stick") + 0.04, lin);
  const stickIn = k(g, "w:stick-0.04", 0.36, SNAP);
  const stickCheck = k(g, "w:stick+0.16", 0.3, SNAP);
  const cap = k(g, "w:helping+0.3", 0.5, ARRIVE);

  // the MC card's rectangle, which grows into the chart
  const R = { x: mix(MC.x, CHART.x, morphCh), y: mix(MC.y, CHART.y, morphCh), w: mix(MC.w, CHART.w, morphCh), h: mix(MC.h, CHART.h, morphCh) };
  const uh = Math.max(0, drawU);
  const hx = px(uh), hy = py(mem(uh));

  return (
    <Feed g={g} in="s2" out="s3" h={1920}>
      {/* ===== beat 1: the video and its transcript line ===== */}
      {b1 && (
        <div style={{ position: "absolute", inset: 0, opacity: b1o, transform: `scale(${b1s})`, transformOrigin: "540px 920px" }}>
          <Sequence from={f(12.4)} layout="none">
            <VideoCard clip="v5" w={VID.w} h={VID.h} r={34} from={0.3} style={{ position: "absolute", left: VID.x, top: VID.y }}>
              <div style={{ position: "absolute", left: 22, bottom: 22, display: "flex", alignItems: "center", gap: 10, padding: "10px 18px", borderRadius: 999,
                background: "rgba(255,255,255,0.92)", fontFamily: SANS, fontWeight: 600, fontSize: 30, color: C.ink }}>
                <Ico n="play" s={26} c={C.sky} w={3} fill={C.sky} />Spanish
              </div>
            </VideoCard>
          </Sequence>
          {/* the transcript card */}
          <div style={{ ...CARD, position: "absolute", left: CD.x, top: CY, width: CD.w, height: CH, padding: PAD, boxSizing: "border-box", borderRadius: 30 }}>
            <div style={{ background: C.skyTint, borderRadius: 26, padding: `${BPY}px ${BPX}px`, height: "100%", boxSizing: "border-box" }}>
              {ROWS.map((row, ri) => (
                <div key={ri} style={{ display: "flex", height: LH, alignItems: "center", fontFamily: SANS, fontWeight: 700, fontSize: ES, letterSpacing: "-0.015em", whiteSpace: "nowrap" }}>
                  {row.map((w, wi) => {
                    const i = ri === 0 ? wi : wi + ROWS[0].length;
                    const isL = w === "lechuga";
                    const col = spoken(i) > 0.5 ? C.ink : C.light;
                    return (
                      <span key={wi} style={{ position: "relative", marginRight: GAP, color: isL && lift > 0 ? "transparent" : col }}>
                        {isL && mark > 0 && (
                          <span style={{ position: "absolute", left: -6, right: -6, top: 2, bottom: 2, borderRadius: 10,
                            background: lift > 0 ? `rgba(255,255,255,${0.6 * lift})` : `rgba(47,175,238,${0.26 * mark})`,
                            border: lift > 0 ? `3px dashed rgba(47,175,238,${0.7 * lift})` : undefined,
                            boxShadow: lift > 0 ? undefined : `inset 0 -5px 0 ${C.sky}`, clipPath: `inset(0 ${100 - 100 * mark}% 0 0)` }} />
                        )}
                        <span style={{ position: "relative" }}>{w}</span>
                      </span>
                    );
                  })}
                </div>
              ))}
              <div style={{ marginTop: 16, fontFamily: SANS, fontWeight: 500, fontSize: EN, lineHeight: 1.3, color: C.gray, whiteSpace: "nowrap" }}>
                That is, it brings <span style={{ color: mark > 0.5 ? C.skyDeep : C.gray, fontWeight: mark > 0.5 ? 600 : 500 }}>lettuce</span> for five families, man.
              </div>
            </div>
          </div>
          <Tap x={LCX} y={LCY + 6} p={tapW} size={90} />
          {/* the Cards tab: the saved word lands here */}
          {tileIn > 0 && (
            <div style={{ ...CARD, position: "absolute", left: TILE.cx - TILE.s / 2, top: TILE.cy - TILE.s / 2, width: TILE.s, height: TILE.s, borderRadius: 36,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6,
              opacity: clamp01(tileIn * 2), transform: `scale(${(0.6 + 0.4 * tileIn) * (1 + 0.07 * tileHit)})` }}>
              <Ico n="cards" s={66} c={C.sky} w={2.8} fill={C.skyTint} />
              <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 30, color: C.sky }}>Cards</div>
              <div style={{ position: "absolute", right: -16, top: -16, height: 56, minWidth: 56, borderRadius: 28, background: C.red, overflow: "hidden",
                transform: `scale(${1 + 0.3 * badge})`, boxShadow: `0 0 0 4px ${C.bg}` }}>
                {[14, 15].map((n, i) => (
                  <div key={n} style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontWeight: 700, fontSize: 30,
                    color: C.white, transform: `translateY(${(i - roll) * 56}px)` }}>{n}</div>
                ))}
              </div>
            </div>
          )}
          {/* the word itself: marked in the line, lifted, flown into Cards */}
          {lift > 0 && wo > 0 && (
            <div style={{ position: "absolute", left: wx, top: wy, transform: `translate(-50%,-50%) scale(${ws})`, opacity: wo, padding: "6px 22px", borderRadius: 22,
              background: `rgba(255,255,255,${chipBg})`, boxShadow: `0 0 0 1px rgba(0,0,0,${0.06 * chipBg}), 0 26px 44px -20px rgba(15,26,41,${0.4 * chipBg})`,
              fontFamily: SANS, fontWeight: 700, fontSize: ES, letterSpacing: "-0.015em", color: C.ink, whiteSpace: "nowrap", lineHeight: 1.2 }}>
              <span style={{ boxShadow: `inset 0 -5px 0 ${C.sky}` }}>lechuga</span>
            </div>
          )}
          {/* + Save, beside the lifted word (to its left: the word sits at the right of the narrow card) */}
          {saveIn > 0 && saveOut < 1 && (
            <div style={{ position: "absolute", left: SX, top: LCY - LIFT, transform: `translate(-100%,-50%) scale(${(0.7 + 0.3 * saveIn) * (1 - 0.3 * saveOut)})`,
              transformOrigin: "100% 50%", opacity: clamp01(saveIn * 2) * (1 - saveOut) }}>
              <SaveBtn size={46} done={saved} press={press} />
            </div>
          )}
          <Tap x={SX - 118} y={LCY - LIFT} p={tapS} size={100} />
        </div>
      )}

      {/* ===== beat 2–4: saved words → flashcards; quizzes ===== */}
      {t >= 15.9 && b4Out < 1 && (
        <div style={{ position: "absolute", inset: 0 }}>
          {/* the four quiz modes fan out of the deck into a 2×2 grid */}
          {QUIZ.map((q, i) => {
            const p = k(g, sec("w:quizzes") - 0.1 + i * 0.06, 0.5, ARRIVE);
            if (p <= 0) return null;
            const ex = QX + (i % 2) * (QW + QG) + QW / 2, ey = QY + Math.floor(i / 2) * (QH + QG) + QH / 2;
            const x = mix(DX, ex, p), y = mix(DY, ey, p);
            const o = (1 - b4Out) * clamp01(p * 3);
            return (
              <div key={q.l} style={{ ...CARD, position: "absolute", left: x - QW / 2, top: y - QH / 2, width: QW, height: QH, borderRadius: 28, boxSizing: "border-box",
                display: "flex", alignItems: "center", gap: 24, padding: "0 22px", opacity: o,
                transform: `rotate(${(1 - p) * (i - 1.5) * 14}deg) scale(${(0.5 + 0.5 * p) * (1 - 0.08 * b4Out)})` }}>
                <div style={{ width: 76, height: 76, borderRadius: 22, background: C.skyTint, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Ico n={q.n} s={50} c={C.sky} w={2.6} />
                </div>
                <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 38, letterSpacing: "-0.01em", color: C.ink }}>{q.l}</div>
              </div>
            );
          })}
          {/* the deck: chips gather, then become fanned flashcards */}
          <div style={{ position: "absolute", inset: 0, opacity: 1 - b4Out, transform: `translateY(${b4Out * 30}px) scale(${1 - 0.06 * b4Out})`, transformOrigin: `${DX}px ${DY}px` }}>
            {WORDS.map((d, i) => {
              const gIn = k(g, d.ch, 0.62, ARRIVE);
              if (gIn <= 0) return null;
              const m = k(g, sec("w:smart") - 0.14 + (i < 5 ? i * 0.04 : 0.14), 0.42, MOVE);
              const fl = FAN[i];
              const drift = clamp01((t - d.ch - 0.62) / 1.2);
              const ax = mix(d.at[0], MID[0], 0.05 * drift) + Math.sin(t * 2.4 + i * 1.3) * 12, ay = mix(d.at[1], MID[1], 0.05 * drift) + Math.cos(t * 2.1 + i) * 10;
              const cx0 = mix(d.from[0], ax, gIn), cy0 = mix(d.from[1], ay, gIn);
              const cx = mix(cx0, DX + fl.x * (1 + 0.15 * qShift), m), cy = mix(cy0, DY + fl.y, m);
              const w = mix(chipW(d), FW, m), h = mix(CHH, FH, m), r = mix(CHH / 2, 32, m);
              const rot = mix((1 - gIn) * (i % 2 ? 8 : -8), fl.r, m);
              const top = i === WORDS.length - 1;
              const a = top ? flip * 180 : 0, back = a > 90;
              return (
                <div key={d.w} style={{ position: "absolute", left: cx - w / 2, top: cy - h / 2, width: w, height: h,
                  transform: `rotate(${rot}deg) perspective(2200px) rotateY(${a}deg)`, opacity: clamp01(gIn * 2.5) }}>
                  <div style={{ ...CARD, position: "absolute", inset: 0, borderRadius: r, transform: back ? "rotateY(180deg)" : undefined }} />
                  {m < 0.3 && <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}><WordChip d={d} o={1 - m / 0.3} /></div>}
                  {m > 0.55 && !back && <Front w={d.w} o={(m - 0.55) / 0.45} />}
                  {back && <Back />}
                </div>
              );
            })}
            {/* Forgot / Got it */}
            {(["forgot", "got"] as const).map((kd, i) => {
              const p = btnIn(i);
              if (p <= 0) return null;
              return (
                <div key={kd} style={{ position: "absolute", left: DX + (i ? 12 : -12 - BW), top: DY + FH / 2 + BG, opacity: clamp01(p * 2),
                  transform: `translateY(${(1 - p) * 26}px) scale(${0.9 + 0.1 * p})` }}>
                  <Btn kind={kd} hot={i ? gotHot : 0} />
                </div>
              );
            })}
            <Tap x={DX + 12 + BW / 2} y={DY + FH / 2 + BG + BH / 2} p={tapG} size={92} />
          </div>
        </div>
      )}

      {/* ===== the quiz card, which grows into the memory chart ===== */}
      {mcIn > 0 && (
        // overflow hidden: the card grows ~780 px upward into the tall chart, so the chart is revealed inside it rather than spilling below it
        <div style={{ ...CARD, position: "absolute", left: R.x, top: R.y + (1 - mcIn) * 40, width: R.w, height: R.h, opacity: clamp01(mcIn * 2), borderRadius: mix(30, 34, morphCh), overflow: "hidden",
          transform: `scale(${1 + 0.03 * k(g, "w:helping+0.42", 21.15 - sec("w:helping") - 0.42, lin)})` }}>
          {mcO > 0 && (
            <div style={{ position: "absolute", left: 44, top: 36, right: 44, opacity: mcO, fontFamily: SANS }}>
              <div style={{ fontWeight: 600, fontSize: 30, lineHeight: 1.2, letterSpacing: "0.07em", color: C.light }}>QUIZ · FROM YOUR CARDS</div>
              <div style={{ fontWeight: 700, fontSize: 72, lineHeight: 1.2, letterSpacing: "-0.035em", color: C.ink, marginTop: 12 }}>ocupado <span style={{ color: C.light }}>= ?</span></div>
              <div style={{ display: "flex", gap: 18, marginTop: 30 }}>
                {["busy", "tired", "free"].map((o, i) => {
                  const p = k(g, sec("w:quizzes") + 0.12 + i * 0.05, 0.3, SNAP);
                  const ok = i === 0 && right > 0;
                  return (
                    <div key={o} style={{ width: 268, height: 96, borderRadius: 22, boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
                      background: ok ? C.greenTint : C.bg, border: `2.5px solid ${ok ? `rgba(46,139,78,${0.5 * right})` : "transparent"}`,
                      fontWeight: 600, fontSize: 38, color: ok ? C.green : C.ink2, opacity: clamp01(p * 2), transform: `scale(${(0.85 + 0.15 * p) * (1 + 0.05 * pulse(i === 0 ? right : 0))})` }}>
                      {ok && <Ico n="check" s={36 * right} c={C.green} w={3.2} />}{o}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          <Tap x={44 + 134} y={36 + 36 + 12 + 86 + 30 + 48} p={tapQ} size={92} />
          {/* the chart */}
          {chartO > 0 && (
            <div style={{ position: "absolute", left: 0, top: 0, width: CHART.w, height: CHART.h, opacity: chartO }}>
              <div style={{ position: "absolute", left: 56, top: 56, right: 56, display: "flex", alignItems: "flex-start", gap: 22, opacity: cap, transform: `translateY(${(1 - cap) * 16}px)` }}>
                <div style={{ width: 76, height: 76, borderRadius: 22, background: C.skyTint, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 4 }}>
                  <Ico n="cards" s={48} c={C.sky} w={2.6} />
                </div>
                <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 50, lineHeight: 1.12, letterSpacing: "-0.03em", color: C.ink }}>Cards come back right before you’d forget them</div>
              </div>
              <svg width={CHART.w} height={CHART.h} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
                <path d={`M${PL} ${PT - 20} V${PB} H${PR + 20}`} fill="none" stroke={C.line} strokeWidth={3} strokeLinecap="round" />
                <line x1={PL} x2={PR} y1={py(FORGET)} y2={py(FORGET)} stroke={C.light} strokeWidth={2.5} strokeDasharray="10 10" />
                <path d={GHOST} fill="none" stroke={C.light} strokeWidth={4} strokeDasharray="2 12" strokeLinecap="round" opacity={clamp01(drawU * 4)} />
                <path d={curvePath(uh)} fill="none" stroke={C.sky} strokeWidth={7} strokeLinejoin="round" strokeLinecap="round" />
                {REV.map((u, i) => {
                  const p = clamp01((uh - u) / 0.03);
                  return p > 0 ? (
                    <g key={i}>
                      <line x1={px(u)} x2={px(u)} y1={PB} y2={PB + 14 * p} stroke={C.sky} strokeWidth={4} strokeLinecap="round" />
                      <circle cx={px(u)} cy={py(1)} r={13 * SNAP(p)} fill={C.sky} stroke={C.white} strokeWidth={5} />
                    </g>
                  ) : null;
                })}
                {uh > 0.004 && <circle cx={hx} cy={hy} r={12} fill={C.white} stroke={C.sky} strokeWidth={6} />}
              </svg>
              {/* axis labels */}
              <div style={{ position: "absolute", left: PL - 4, top: PT - 66, fontFamily: SANS, fontWeight: 600, fontSize: 30, color: C.gray }}>Memory</div>
              <div style={{ position: "absolute", left: PR - 80, top: PB + 24, fontFamily: SANS, fontWeight: 600, fontSize: 30, color: C.gray }}>Time</div>
              <div style={{ position: "absolute", left: PR - 180, top: py(FORGET) - 44, fontFamily: SANS, fontWeight: 600, fontSize: 30, color: C.light }}>Forgotten</div>
              <div style={{ position: "absolute", left: px(0.42), top: py(0.255), fontFamily: SANS, fontWeight: 500, fontSize: 30, color: C.light, opacity: clamp01(drawU * 3 - 1) }}>without review</div>
              {REV.map((u, i) => {
                const p = clamp01((uh - u) / 0.04);
                return p > 0 ? (
                  <div key={i} style={{ position: "absolute", left: px(u) - 70, width: 140, top: PB + 24, textAlign: "center", fontFamily: SANS, fontWeight: 600, fontSize: 30, color: C.skyDeep,
                    opacity: p, transform: `translateY(${(1 - p) * 8}px)` }}>Review</div>
                ) : null;
              })}
              {/* the word sticks: above the curve's high, flat end (clear of the review dots) */}
              {stickIn > 0 && (
                <div style={{ position: "absolute", left: hx + 48, top: Math.min(hy - 34, PT - 30), transform: `translate(-100%, -100%) translateY(${(1 - stickIn) * -40}px) scale(${0.8 + 0.2 * stickIn})`,
                  opacity: clamp01(stickIn * 2), transformOrigin: "85% 100%" }}>
                  <div style={{ ...CARD, borderRadius: 999, display: "flex", alignItems: "center", gap: 16, padding: "16px 24px 16px 32px", whiteSpace: "nowrap" }}>
                    <span style={{ fontFamily: SANS, fontWeight: 700, fontSize: 44, letterSpacing: "-0.02em", color: C.ink }}>lechuga</span>
                    <span style={{ fontFamily: SANS, fontWeight: 500, fontSize: 34, color: C.gray }}>lettuce</span>
                    <div style={{ width: 50, height: 50, borderRadius: 25, background: C.green, display: "flex", alignItems: "center", justifyContent: "center",
                      transform: `scale(${stickCheck})` }}>
                      <Ico n="check" s={34} c={C.white} w={3.4} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </Feed>
  );
};
