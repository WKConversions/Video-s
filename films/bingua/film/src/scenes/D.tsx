// Scene D (21.1–32.3 s): No endless word lists. No repetitive textbook exercises. / Just content you enjoy, a growing
// vocabulary, and more confidence with every video, at your own pace. See ../../../plan/storyboard.md.
// What it replaces: a grey vocabulary list scrolls endlessly, freezes on "lists", is struck through and collapses to a
// thin bar that opens into a textbook worksheet; the worksheet multiplies into a stack on "repetitive", is crossed out
// on "exercises" and folds away. What you get: a row of playing videos scrolls in and one is liked on "enjoy"; the
// row gathers into a feed strip while saved words fly out of it into a word cloud beside a "Words saved" counter; the
// counter becomes the app's XP bar, the words pour into it, and each video that passes the gate fills a step until the
// daily goal completes on "every video"; the XP bar becomes the playback-speed control, which steps 0.75x → 1.25x.
import React from "react";
import { AbsoluteFill, Sequence, interpolateColors } from "remotion";
import { ARRIVE, C, CARD, Feed, Ico, MOVE, SANS, SNAP, Say, Tap, VideoCard, clamp01, f, k, mix } from "../shared";

const sec = (at: string) => f(at) / 30;
const lin = (x: number) => x;
const pulse = (p: number) => (p > 0 && p < 1 ? Math.sin(p * Math.PI) : 0);

/* ======================= part 1: what it replaces ======================= */
const ST = 88, SX = 150;               // the statements: size, left edge
const VX = 1480, VY = 540;             // the visual's centre
const LW = 540, LH = 720, ROW = 80;    // the vocabulary list card
const WW = 560, WH = 720;              // the worksheet

const VOCAB = [
  ["el perro", "the dog"], ["la mesa", "the table"], ["la casa", "the house"], ["el libro", "the book"], ["la silla", "the chair"],
  ["el gato", "the cat"], ["la ventana", "the window"], ["el coche", "the car"], ["la puerta", "the door"], ["el árbol", "the tree"],
  ["la cama", "the bed"], ["el vaso", "the glass"], ["la calle", "the street"], ["el reloj", "the clock"], ["la llave", "the key"], ["el pan", "the bread"],
];

// the endless list: rows scroll by `pos` px; after the freeze each visible row is struck through in a quick cascade
const ListBody: React.FC<{ g: number; pos: number; tS: number; blur: number }> = ({ g, pos, tS, blur }) => {
  const n0 = Math.floor(pos / ROW), fr = pos - n0 * ROW;
  return (
    <>
      <div style={{ position: "absolute", left: 0, top: 0, width: LW, height: 100, display: "flex", alignItems: "center", gap: 14, padding: "0 36px", boxSizing: "border-box",
        borderBottom: `2px solid ${C.line}`, fontFamily: SANS }}>
        <Ico n="list" s={34} c={C.light} w={2.6} />
        <div style={{ fontWeight: 700, fontSize: 30, letterSpacing: "-0.02em", color: C.ink2 }}>Vocabulary list</div>
        <div style={{ marginLeft: "auto", fontWeight: 600, fontSize: 26, color: C.light }}>Unit 1–40</div>
      </div>
      <div style={{ position: "absolute", left: 0, top: 102, width: LW, height: LH - 102, overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, filter: blur > 0.3 ? `blur(${blur.toFixed(2)}px)` : undefined }}>
          {Array.from({ length: 9 }, (_, j) => {
            const n = n0 + j, [es, en] = VOCAB[n % VOCAB.length];
            const st = k(g, tS + 0.06 + j * 0.028, 0.16, SNAP);
            return (
              <div key={n} style={{ position: "absolute", left: 36, right: 36, top: j * ROW - fr, height: ROW, display: "flex", alignItems: "center",
                borderBottom: `2px solid ${C.fill}`, fontFamily: SANS, whiteSpace: "nowrap" }}>
                <span style={{ width: 82, fontWeight: 600, fontSize: 26, color: C.light, fontVariantNumeric: "tabular-nums" }}>{n + 241}.</span>
                <span style={{ fontWeight: 600, fontSize: 30, color: C.gray, letterSpacing: "-0.01em" }}>{es}</span>
                <span style={{ marginLeft: "auto", fontWeight: 500, fontSize: 28, color: C.light }}>{en}</span>
                {st > 0 && <div style={{ position: "absolute", left: -8, top: ROW / 2 - 3, width: (LW - 56) * st, height: 6, borderRadius: 3, background: C.ink }} />}
              </div>
            );
          })}
        </div>
        {/* a tiny scrollbar thumb: the list is very long */}
        <div style={{ position: "absolute", right: 10, top: 14 + ((pos * 0.05) % 480), width: 6, height: 54, borderRadius: 3, background: C.line }} />
      </div>
    </>
  );
};

const SHEET = [["Yo", "estudiante.", "ser"], ["Ella", "un perro.", "tener"], ["Nosotros", "aquí.", "vivir"], ["Tú", "español.", "hablar"], ["Ellos", "pan.", "comer"], ["Vosotros", "mucho.", "leer"]];
// the textbook worksheet: "Exercise 14B · Fill in the blanks."
const Sheet: React.FC<{ label: string; o?: number }> = ({ label, o = 1 }) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: WW, height: WH, padding: "40px 44px", boxSizing: "border-box", fontFamily: SANS, opacity: o, whiteSpace: "nowrap" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
      <div style={{ fontWeight: 700, fontSize: 36, letterSpacing: "-0.02em", color: C.ink2 }}>Exercise {label}</div>
      <div style={{ fontWeight: 600, fontSize: 22, color: C.light }}>p. 112</div>
    </div>
    <div style={{ fontWeight: 500, fontSize: 26, color: C.gray, marginTop: 6 }}>Fill in the blanks.</div>
    <div style={{ height: 2, background: C.line, margin: "24px 0 6px" }} />
    {SHEET.map(([a, b, v], i) => (
      <div key={i} style={{ display: "flex", alignItems: "center", height: 84, borderBottom: `2px solid ${C.fill}`, fontSize: 27, fontWeight: 500, color: C.ink2, gap: 10 }}>
        <span style={{ color: C.light, width: 30, fontWeight: 600 }}>{i + 1}.</span>
        <span>{a}</span>
        <span style={{ width: 84, height: 30, borderBottom: `3px solid ${C.light}` }} />
        <span>{b}</span>
        <span style={{ marginLeft: "auto", color: C.light, fontSize: 24 }}>({v})</span>
      </div>
    ))}
  </div>
);
// copies land on top of the first sheet on "repetitive": same page, next number
const COPIES = [
  { l: "14C", r: -2.6, x: -10, y: 8 }, { l: "14D", r: 2.2, x: 12, y: -6 }, { l: "14E", r: -1.5, x: -6, y: 4 },
  { l: "14F", r: 2.9, x: 9, y: -5 }, { l: "14G", r: -0.7, x: 0, y: 0 },
];

/* ======================= part 2: what you get ======================= */
const SEQ = 25.3; // the video row mounts here (clips play from this moment)
const ROWC = [
  { clip: "v1", from: 0.4, tag: "Friends" }, { clip: "v2", from: 1.0, tag: "Café chats" }, { clip: "v7", from: 0.6, tag: "Vlogs" },
  { clip: "v5", from: 0.8, tag: "Street food" }, { clip: "v6", from: 1.2, tag: "Coffee break" }, { clip: "v3", from: 0.5, tag: "Daily life" },
  { clip: "v4", from: 1.5, tag: "Stories" }, { clip: "v2", from: 0.2, tag: "Café chats" }, { clip: "v5", from: 1.8, tag: "Street food" },
  { clip: "v7", from: 1.6, tag: "Vlogs" },
];
const LIKED = 3;
const BEATS = [29.2, 29.62, 30.08]; // the three videos that fill the XP bar ("confidence", "with", "every")
const XP0 = 46, XPSTEP = 18;
const PANEL = { x: 340, y: 690, w: 1240, h: 310 };
const GATE_Y = 845;

type R = { x: number; y: number; w: number; h: number; r: number };
const lerpR = (a: R, b: R, t: number): R => ({ x: mix(a.x, b.x, t), y: mix(a.y, b.y, t), w: mix(a.w, b.w, t), h: mix(a.h, b.h, t), r: mix(a.r, b.r, t) });
const RA: R = { x: 300, y: 270, w: 380, h: 340, r: 24 };   // Words saved counter
const RB: R = { x: 413, y: 330, w: 900, h: 140, r: 32 };   // XP bar
const RC: R = { x: 687, y: 560, w: 700, h: 130, r: 65 };   // playback-speed control
const STREAK: R = { x: 1337, y: 330, w: 170, h: 140, r: 32 };
const DIAL: R = { x: 533, y: 560, w: 130, h: 130, r: 65 };
const TRACK_X0 = RB.x + 40, TRACK_W = RB.w - 80, TRACK_Y = RB.y + 105;

// the word cloud: saved words, laid out in centred rows
type CW = { t: string; s: number; tint?: boolean };
const CLOUD: CW[][] = [
  [{ t: "ocupado", s: 40, tint: true }, { t: "¿Qué tal?", s: 30 }, { t: "lechuga", s: 36 }],
  [{ t: "la noche", s: 32 }, { t: "realmente", s: 28 }, { t: "tío", s: 36, tint: true }, { t: "grandes", s: 30 }],
  [{ t: "sabor", s: 30 }, { t: "nos vemos", s: 38, tint: true }, { t: "ocurriendo", s: 30 }],
  [{ t: "familias", s: 28 }, { t: "bueno", s: 34 }, { t: "mucho", s: 30, tint: true }, { t: "pizza", s: 28 }],
];
const CLOUD_CX = 1190, CLOUD_Y = [292, 388, 484, 580], CGAP = 28;
const chipW = (w: CW) => w.t.length * 0.57 * w.s + 1.4 * w.s;
const CHIPS = CLOUD.flatMap((row, ri) => {
  const ws = row.map(chipW), total = ws.reduce((a, b) => a + b, 0) + CGAP * (row.length - 1);
  let x = CLOUD_CX - total / 2;
  return row.map((w, i) => { const cx = x + ws[i] / 2; x += ws[i] + CGAP; return { ...w, x: cx, y: CLOUD_Y[ri] }; });
});
const ORDER = [0, 5, 9, 2, 7, 12, 3, 10, 1, 8, 13, 4, 11, 6];

const Rail: React.FC<{ o: number; liked: number; pop: number }> = ({ o, liked, pop }) => (
  <div style={{ position: "absolute", right: 16, top: 300, display: "flex", flexDirection: "column", gap: 22, alignItems: "center", opacity: o }}>
    <div style={{ transform: `scale(${1 + 0.45 * pop})` }}>
      <Ico n="heart" s={38} c={liked > 0.5 ? C.red : C.white} w={2.6} fill={liked > 0.5 ? C.red : "none"} />
    </div>
    <Ico n="bookmark" s={34} c={C.white} w={2.6} />
  </div>
);

// the playback-speed dial: a 220° arc, its sky fill and a needle (a = needle angle, 0 = up)
const Dial: React.FC<{ a: number }> = ({ a }) => {
  const R0 = 40, cx = 65, cy = 70;
  const pt = (deg: number, r: number) => [cx + r * Math.sin((deg * Math.PI) / 180), cy - r * Math.cos((deg * Math.PI) / 180)];
  const [x0, y0] = pt(-110, R0), [x1, y1] = pt(110, R0), [xa, ya] = pt(a, R0), [xn, yn] = pt(a, R0 - 12);
  return (
    <svg width={130} height={130} viewBox="0 0 130 130" style={{ display: "block" }}>
      <path d={`M${x0} ${y0} A${R0} ${R0} 0 1 1 ${x1} ${y1}`} fill="none" stroke={C.line} strokeWidth={9} strokeLinecap="round" />
      <path d={`M${x0} ${y0} A${R0} ${R0} 0 ${a + 110 > 180 ? 1 : 0} 1 ${xa} ${ya}`} fill="none" stroke={C.sky} strokeWidth={9} strokeLinecap="round" />
      <line x1={cx} y1={cy} x2={xn} y2={yn} stroke={C.ink} strokeWidth={6} strokeLinecap="round" />
      <circle cx={cx} cy={cy} r={7} fill={C.ink} />
    </svg>
  );
};

export const SceneD: React.FC<{ g: number }> = ({ g }) => {
  if (g < f(21.1) || g > f(32.3)) return null;
  const t = g / 30;

  /* ---------- part 1 ---------- */
  const part1 = g < f(25.9);
  // the endless list: accelerates, then freezes on "lists" with rows aligned
  const tS = sec("w:lists"), t0 = 20.9;
  const P = (u: number) => 480 * u + 170 * u * u;
  const vS = 480 + 340 * (tS - t0), D = (vS * 0.2) / 4.5;
  const posEnd = P(tS - t0) + D, align = (ROW - (posEnd % ROW)) % ROW;
  const pos = align + (t < tS ? P(Math.max(0, t - t0)) : P(tS - t0) + D * SNAP(clamp01((t - tS) / 0.2)));
  const blur = t < tS ? Math.min(1.8, (480 + 340 * Math.max(0, t - t0)) / 600) : 0;
  // struck through, then collapses to a thin bar that opens into the worksheet
  const col = k(g, tS + 0.44, 0.26, MOVE);
  const ex = k(g, "w:no2", 0.42, ARRIVE);
  const mw = ex > 0 ? mix(LW, WW, ex) : LW, mh = ex > 0 ? mix(10, WH, ex) : mix(LH, 10, col);
  // the worksheet multiplies, is crossed out on "exercises" and folds away
  const rep = sec("w:repetitive");
  const x1 = k(g, "w:exercises", 0.2, SNAP), x2 = k(g, "w:exercises+0.1", 0.2, SNAP);
  const fold = k(g, "w:exercises+0.3", 0.45, MOVE);
  // the statements: line 1 lifts and greys as line 2 arrives; both leave before "just"
  const lift = k(g, "w:no2-0.32", 0.5, MOVE);
  const s1c = interpolateColors(lift, [0, 1], [C.ink, C.light]);
  const s1y = 318 + (1 - lift) * 127;

  /* ---------- part 2 ---------- */
  const part2 = g >= f(SEQ);
  const enter = k(g, SEQ + 0.05, 0.65, ARRIVE);
  const shrink = k(g, 27.02, 0.5, MOVE);
  const drift = 50 * (Math.min(t, 27.02) - SEQ);
  const off = mix((1 - enter) * 1500 - drift, 0, shrink);
  const stepsMove = BEATS.reduce((a, b) => a + k(g, b - 0.4, 0.42, MOVE), 0);
  const cIdx = LIKED + stepsMove;
  const pitch = mix(340, 186, shrink), cw = mix(300, 150, shrink), ch = mix(533, 267, shrink), cy = mix(620, GATE_Y, shrink), cr = mix(28, 16, shrink);
  const out6 = k(g, 30.72, 0.4, MOVE);
  const cardX = (i: number) => 960 + (i - cIdx) * pitch + off;
  const clipL = PANEL.x * shrink, clipR = (1920 - PANEL.x - PANEL.w) * shrink, clipT = PANEL.y * shrink, clipB = (1080 - PANEL.y - PANEL.h) * shrink;
  // the like on "enjoy"
  const tapP = k(g, "w:enjoy-0.1", 0.55, lin);
  const liked = tapP > 0.22 ? 1 : 0;
  const heartPop = pulse(k(g, "w:enjoy-0.02", 0.38, lin));
  const likeLift = k(g, "w:enjoy", 0.4, SNAP) * (1 - shrink);
  const railO = 1 - clamp01(shrink * 3);
  const lx = cardX(LIKED), ly = cy - ch / 2;
  const heartX = lx + cw / 2 - 16 - 19, heartY = ly + 300 + 19;
  // the counter → XP bar → speed control (one white surface)
  const m4 = k(g, "w:a2-0.12", 0.42, SNAP);
  const m5 = k(g, 28.34, 0.5, MOVE);
  const m6 = k(g, 30.8, 0.42, MOVE);
  const rect = m6 > 0 ? lerpR(RB, RC, m6) : lerpR(RA, RB, m5);
  const words = Math.round(mix(12, 86, k(g, "w:growing-0.05", 1.05, MOVE)));
  const fills = BEATS.reduce((a, b) => a + k(g, b - 0.12, 0.35, SNAP), 0);
  const xp = Math.round(XP0 + XPSTEP * fills);
  const done = k(g, BEATS[2] + 0.2, 0.35, SNAP);
  const streakIn = k(g, 28.86, 0.38, SNAP), streakOut = k(g, 30.68, 0.3, MOVE);
  const streakPop = pulse(k(g, BEATS[2] + 0.28, 0.35, lin));
  const gateO = k(g, 28.5, 0.3) * (1 - out6);
  const dialIn = k(g, 30.98, 0.36, SNAP);
  const speed = k(g, "w:own", 0.3, SNAP) + k(g, "w:pace", 0.3, SNAP);

  return (
    <Feed g={g} in="s3" out="s4">
      <AbsoluteFill>
        {/* ======== part 1: the statements ======== */}
        {part1 && <>
          <Say g={g} x={SX} y={s1y} size={ST} align="left" width={1100} color={s1c} out="w:just-0.45" words={[{ t: "No", at: "w:no" }, { t: "endless", at: "w:endless" }]} />
          <Say g={g} x={SX} y={s1y + ST * 1.08} size={ST} align="left" width={1100} color={s1c} out="w:just-0.45" words={[{ t: "word", at: "w:word2" }, { t: "lists.", at: "w:lists" }]} />
          <Say g={g} x={SX} y={570} size={ST} align="left" width={1100} out="w:just-0.45" words={[{ t: "No", at: "w:no2" }, { t: "repetitive", at: "w:repetitive" }]} />
          <Say g={g} x={SX} y={570 + ST * 1.08} size={ST} align="left" width={1100} out="w:just-0.45" words={[{ t: "textbook", at: "w:textbook" }, { t: "exercises.", at: "w:exercises" }]} />
        </>}

        {/* ======== part 1: the list → bar → worksheet stack ======== */}
        {part1 && fold < 1 && (
          <div style={{ position: "absolute", left: VX, top: VY, width: 0, height: 0, transformOrigin: `0px ${WH / 2}px`,
            transform: `perspective(1600px) translateY(${fold * 40}px) rotateX(${fold * 86}deg) scale(${1 + 0.008 * (t - 21.1)})`, opacity: 1 - clamp01((fold - 0.55) / 0.45) }}>
            {/* the morphing card */}
            <div style={{ ...CARD, position: "absolute", left: -mw / 2, top: -mh / 2, width: mw, height: mh, overflow: "hidden", borderRadius: Math.min(ex > 0 ? 16 : 24, mh / 2) }}>
              <div style={{ position: "absolute", left: (mw - (ex > 0 ? WW : LW)) / 2, top: (mh - (ex > 0 ? WH : LH)) / 2, width: ex > 0 ? WW : LW, height: ex > 0 ? WH : LH }}>
                {ex <= 0 ? (
                  <div style={{ position: "absolute", inset: 0, opacity: 1 - clamp01(col * 2.2) }}><ListBody g={g} pos={pos} tS={tS} blur={blur} /></div>
                ) : <Sheet label="14B" o={clamp01((ex - 0.35) / 0.45)} />}
              </div>
            </div>
            {/* repetitive copies land on top */}
            {COPIES.map((c, j) => {
              const p = k(g, rep + j * 0.17, 0.32, SNAP);
              if (p <= 0) return null;
              return (
                <div key={j} style={{ ...CARD, borderRadius: 16, position: "absolute", left: -WW / 2, top: -WH / 2, width: WW, height: WH, overflow: "hidden",
                  transform: `translate(${c.x + (1 - p) * 320}px, ${c.y - (1 - p) * 50}px) rotate(${c.r + (1 - p) * 9}deg)`, opacity: clamp01(p * 3) }}>
                  <Sheet label={c.l} />
                </div>
              );
            })}
            {/* crossed out on "exercises" */}
            {x1 > 0 && (
              <svg width={WW} height={WH} viewBox={`0 0 ${WW} ${WH}`} style={{ position: "absolute", left: -WW / 2, top: -WH / 2, overflow: "visible" }}>
                <path d={`M70 110 L${WW - 70} ${WH - 110}`} stroke={C.ink} strokeWidth={16} strokeLinecap="round" fill="none" strokeDasharray={700} strokeDashoffset={700 * (1 - x1)} />
                {x2 > 0 && <path d={`M${WW - 70} 110 L70 ${WH - 110}`} stroke={C.ink} strokeWidth={16} strokeLinecap="round" fill="none" strokeDasharray={700} strokeDashoffset={700 * (1 - x2)} />}
              </svg>
            )}
          </div>
        )}

        {/* ======== part 2: the headlines ======== */}
        {part2 && <>
          <Say g={g} y={110} size={84} out="w:enjoy+0.54" words={[{ t: "Just", at: "w:just" }, { t: "content", at: "w:content" }, { t: "you", at: "w:you2" }, { t: "enjoy.", at: "w:enjoy", blue: true }]} />
          <Say g={g} y={110} size={84} out="w:and4+0.03" words={[{ t: "A", at: "w:a2" }, { t: "growing", at: "w:growing" }, { t: "vocabulary.", at: "w:vocabulary2", blue: true }]} />
          <Say g={g} y={110} size={84} out="w:video+0.46" words={[{ t: "More", at: "w:more" }, { t: "confidence", at: "w:confidence", blue: true }, { t: "with", at: "w:with2" }, { t: "every", at: "w:every" }, { t: "video.", at: "w:video" }]} />
          <Say g={g} y={340} size={120} words={[{ t: "At", at: "w:at" }, { t: "your", at: "w:your2" }, { t: "own", at: "w:own" }, { t: "pace.", at: "w:pace", blue: true }]} />
        </>}

        {/* ======== part 2: the video row → the feed strip ======== */}
        {part2 && out6 < 1 && (
          <div style={{ position: "absolute", inset: 0, transform: `translateY(${out6 * 420}px)`, opacity: 1 - clamp01((out6 - 0.5) / 0.5) }}>
            {shrink > 0 && <div style={{ ...CARD, position: "absolute", left: PANEL.x, top: PANEL.y, width: PANEL.w, height: PANEL.h, borderRadius: 28, opacity: shrink }} />}
            <div style={{ position: "absolute", inset: 0, clipPath: shrink > 0 ? `inset(${clipT}px ${clipR}px ${clipB}px ${clipL}px round ${28 * shrink}px)` : undefined }}>
              <Sequence from={f(SEQ)} layout="none">
                {ROWC.map((c, i) => {
                  const x = cardX(i);
                  if (x + cw / 2 < clipL - 4 || x - cw / 2 > 1920 - clipR + 4) return null;
                  const isLiked = i === LIKED;
                  const s = isLiked ? 1 + 0.04 * likeLift : 1;
                  const ring = clamp01(1 - Math.abs(x - 960) / 90) * gateO;
                  const bi = i - LIKED, badge = bi >= 0 && bi < 3 ? k(g, BEATS[bi] - 0.5, 0.3, SNAP) : 0;
                  return (
                    <div key={i} style={{ position: "absolute", left: x - cw / 2, top: cy - ch / 2, width: cw, height: ch, transform: `scale(${s})` }}>
                      {ring > 0 && <div style={{ position: "absolute", left: -8, top: -8, right: -8, bottom: -8, borderRadius: cr + 8, border: `4px solid ${C.sky}`, opacity: ring }} />}
                      <VideoCard clip={c.clip} w={cw} h={ch} r={cr} from={c.from}>
                        {railO > 0 && <Rail o={railO} liked={isLiked ? liked : 0} pop={isLiked ? heartPop : 0} />}
                        {railO > 0 && (
                          <div style={{ position: "absolute", left: 16, bottom: 16, opacity: railO, background: C.white, borderRadius: 999, padding: "8px 16px",
                            fontFamily: SANS, fontWeight: 600, fontSize: 26, letterSpacing: "-0.01em", color: C.ink, whiteSpace: "nowrap" }}>{c.tag}</div>
                        )}
                        {badge > 0 && (
                          <div style={{ position: "absolute", right: 10, top: 10, width: 40, height: 40, borderRadius: 20, background: C.sky, display: "flex", alignItems: "center", justifyContent: "center",
                            transform: `scale(${0.4 + 0.6 * badge})`, opacity: clamp01(badge * 3) }}>
                            <Ico n="check" s={26} c={C.white} w={3.4} />
                          </div>
                        )}
                      </VideoCard>
                    </div>
                  );
                })}
              </Sequence>
            </div>
            {/* the like: a tap on the heart, little hearts rise */}
            <Tap x={heartX} y={heartY} p={tapP} size={78} />
            {[0, 1, 2, 3].map((j) => {
              const p = k(g, `w:enjoy+${(0.02 + j * 0.05).toFixed(2)}`, 0.7, ARRIVE);
              if (p <= 0 || p >= 1 || shrink > 0) return null;
              return (
                <div key={j} style={{ position: "absolute", left: heartX - 17 + (j - 1.5) * 34 * p, top: heartY - 17 - 170 * p - j * 12, opacity: clamp01((1 - p) * 1.8), transform: `scale(${0.7 + 0.3 * (j % 2)})` }}>
                  <Ico n="heart" s={34} c={C.red} fill={C.red} w={2} />
                </div>
              );
            })}
          </div>
        )}

        {/* ======== part 2: the streak (beside the XP bar) ======== */}
        {streakIn > 0 && streakOut < 1 && (
          <div style={{ ...CARD, position: "absolute", left: STREAK.x, top: STREAK.y, width: STREAK.w, height: STREAK.h, borderRadius: STREAK.r,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 10, opacity: streakIn * (1 - streakOut),
            transform: `scale(${(0.7 + 0.3 * streakIn) * (1 - 0.3 * streakOut) * (1 + 0.16 * streakPop)})` }}>
            <Ico n="flame" s={54} c={C.flame} fill={C.flame} w={1.5} />
            <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 56, letterSpacing: "-0.03em", color: C.ink, fontVariantNumeric: "tabular-nums" }}>{done > 0.4 ? 3 : 2}</div>
          </div>
        )}

        {/* ======== part 2: the dial (beside the speed control) ======== */}
        {dialIn > 0 && (
          <div style={{ ...CARD, position: "absolute", left: DIAL.x, top: DIAL.y, width: DIAL.w, height: DIAL.h, borderRadius: DIAL.r, opacity: clamp01(dialIn * 2),
            transform: `scale(${0.6 + 0.4 * dialIn})` }}>
            <Dial a={-60 + 60 * speed} />
          </div>
        )}

        {/* ======== part 2: Words saved → XP bar → speed control ======== */}
        {m4 > 0 && (
          <div style={{ ...CARD, position: "absolute", left: rect.x, top: rect.y, width: rect.w, height: rect.h, borderRadius: rect.r, overflow: "hidden",
            opacity: clamp01(m4 * 2), transform: `scale(${0.9 + 0.1 * m4})` }}>
            {/* Words saved */}
            {m5 < 0.4 && (
              <div style={{ position: "absolute", left: 0, top: 0, width: RA.w, height: RA.h, padding: "30px 34px", boxSizing: "border-box", fontFamily: SANS, opacity: 1 - clamp01(m5 * 3) }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <Ico n="cards" s={34} c={C.sky} w={2.6} />
                  <span style={{ fontWeight: 600, fontSize: 28, color: C.gray }}>Words saved</span>
                </div>
                <div style={{ fontWeight: 700, fontSize: 120, letterSpacing: "-0.045em", lineHeight: 1, color: C.ink, marginTop: 16, fontVariantNumeric: "tabular-nums" }}>{words}</div>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 70, marginTop: 20 }}>
                  {[18, 26, 32, 40, 50, 58, 70].map((h, j) => (
                    <div key={j} style={{ width: 34, height: Math.max(4, h * k(g, `w:growing+${(j * 0.12).toFixed(2)}`, 0.45, SNAP)), borderRadius: 6, background: j === 6 ? C.skyDeep : C.sky }} />
                  ))}
                </div>
              </div>
            )}
            {/* XP today · Goal 100 */}
            {m5 > 0.5 && m6 < 0.4 && (
              <div style={{ position: "absolute", left: 0, top: 0, width: RB.w, height: RB.h, fontFamily: SANS, opacity: clamp01((m5 - 0.55) / 0.45) * (1 - clamp01(m6 * 3)) }}>
                <div style={{ position: "absolute", left: 40, top: 26, right: 40, height: 54, display: "flex", alignItems: "center", gap: 12 }}>
                  <Ico n="bolt" s={42} c={C.sky} fill={C.sky} w={1.5} />
                  <span style={{ fontWeight: 700, fontSize: 42, letterSpacing: "-0.02em", color: C.ink, fontVariantNumeric: "tabular-nums" }}>{xp} XP today</span>
                  <span style={{ marginLeft: "auto", fontWeight: 600, fontSize: 34, color: done > 0.3 ? C.skyDeep : C.gray }}>Goal 100</span>
                  {done > 0 && (
                    <div style={{ width: 44, height: 44, borderRadius: 22, background: C.sky, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${0.3 + 0.7 * done})`, opacity: clamp01(done * 3) }}>
                      <Ico n="check" s={28} c={C.white} w={3.4} />
                    </div>
                  )}
                </div>
                <div style={{ position: "absolute", left: 40, top: 98, width: TRACK_W, height: 14, borderRadius: 7, background: C.line }}>
                  <div style={{ width: TRACK_W * ((XP0 + XPSTEP * fills) / 100), height: 14, borderRadius: 7, background: C.sky }} />
                </div>
              </div>
            )}
            {/* 0.75x · 1.00x · 1.25x */}
            {m6 > 0.5 && (
              <div style={{ position: "absolute", left: 0, top: 0, width: RC.w, height: RC.h, fontFamily: SANS, opacity: clamp01((m6 - 0.5) / 0.5) }}>
                <div style={{ position: "absolute", left: 10 + speed * ((RC.w - 20) / 3), top: 10, width: (RC.w - 20) / 3, height: RC.h - 20, borderRadius: 55, background: C.sky }} />
                {["0.75x", "1.00x", "1.25x"].map((s, j) => (
                  <div key={s} style={{ position: "absolute", left: 10 + j * ((RC.w - 20) / 3), top: 10, width: (RC.w - 20) / 3, height: RC.h - 20, display: "flex", alignItems: "center", justifyContent: "center",
                    fontWeight: 700, fontSize: 44, letterSpacing: "-0.02em", fontVariantNumeric: "tabular-nums",
                    color: interpolateColors(clamp01(1 - Math.abs(speed - j) * 1.6), [0, 1], [C.gray, C.white]) }}>{s}</div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ======== part 2: saved words fly out of the videos into a cloud, then pour into the XP bar ======== */}
        {CHIPS.map((c, i) => {
          const o = ORDER.indexOf(i);
          const p = k(g, 27.25 + o * 0.045, 0.5, ARRIVE);
          const q = k(g, 28.36 + o * 0.012, 0.4, MOVE);
          if (p <= 0 || q >= 1) return null;
          const sx = cardX(LIKED + ((o % 3) - 1)), sy = cy - ch * 0.15;
          let x = mix(sx, c.x, p), y = mix(sy, c.y, p) - 90 * Math.sin(Math.PI * p);
          const tx = TRACK_X0 + TRACK_W * (XP0 / 100), ty = TRACK_Y + 7;
          x = mix(x, tx, q); y = mix(y, ty, q);
          const s = (0.45 + 0.55 * p) * (1 - 0.8 * q);
          return (
            <div key={i} style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) scale(${s})`, opacity: clamp01(p * 4) * (1 - clamp01((q - 0.35) / 0.4)),
              padding: `${c.s * 0.32}px ${c.s * 0.7}px`, borderRadius: 999, background: c.tint ? C.skyTint : C.white, color: c.tint ? C.skyDeep : C.ink,
              boxShadow: c.tint ? undefined : "0 0 0 1px rgba(0,0,0,0.06), 0 14px 30px -16px rgba(15,26,41,0.3)",
              fontFamily: SANS, fontWeight: 700, fontSize: c.s, letterSpacing: "-0.01em", whiteSpace: "nowrap" }}>{c.t}</div>
          );
        })}

        {/* ======== part 2: each watched video sends +18 XP up into the bar ======== */}
        {BEATS.map((b, n) => {
          const q = k(g, b - 0.45, 0.36, MOVE);
          if (q <= 0 || q >= 1) return null;
          const tx = TRACK_X0 + TRACK_W * ((XP0 + XPSTEP * (n + 1)) / 100);
          return (
            <div key={n} style={{ position: "absolute", left: mix(960, tx, q), top: mix(GATE_Y - 150, TRACK_Y + 7, q) - 70 * Math.sin(Math.PI * q),
              transform: `translate(-50%, -50%) scale(${1 - 0.35 * q})`, opacity: q < 0.8 ? clamp01(q * 6) : (1 - q) / 0.2,
              display: "flex", alignItems: "center", gap: 6, padding: "8px 18px", borderRadius: 999, background: C.sky, color: C.white,
              fontFamily: SANS, fontWeight: 700, fontSize: 30, whiteSpace: "nowrap" }}>
              <Ico n="bolt" s={26} c={C.white} fill={C.white} w={1.5} />+{XPSTEP} XP
            </div>
          );
        })}
      </AbsoluteFill>
    </Feed>
  );
};
