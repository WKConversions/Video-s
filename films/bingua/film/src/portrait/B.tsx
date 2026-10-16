// Portrait (1080×1920) version of scene B — re-laid out from ../scenes/B.tsx. See ../../../plan/portrait.md.
// Scene B (3.25–12.95 s): Learn languages through real videos and everyday conversations. / Follow along with
// translations that make unfamiliar words and sentences easy to understand. See ../../../plan/storyboard.md.
// Same beats, words and timings as the 16:9 scene; only the layout changes:
// "Learn / languages" centred on two lines, the six greetings above and below it → they fly onto a 3×2 grid of real
// video cards as language tags (row 1 drifts left, row 2 right) → the people talk → the Spanish video comes forward
// as the hero on top, the transcript card rises under it (karaoke sweep, translations, tap "ocupado" for its pop-up
// over the line above) → swipe the line: the same card turns into the sentence breakdown → one clear sentence.
import React, { useEffect, useState } from "react";
import { continueRender, delayRender, Freeze, useCurrentFrame } from "remotion";
import { ARRIVE, C, CARD, Feed, Ico, MOVE, SANS, SNAP, Say, SaveBtn, Tap, VideoCard, clamp01, f, k, mix } from "../shared";

/* ---------- local helpers ---------- */
const s = (lab: string) => f(lab) / 30;                                   // a label's time in seconds
const lin = (g: number, a: number, b: number) => clamp01((g - a * 30) / ((b - a) * 30));

// text width in px (Inter), measured on a canvas; letter-spacing 0
let ctx: CanvasRenderingContext2D | null = null;
const tw = (text: string, size: number, weight = 700) => {
  if (typeof document === "undefined") return text.length * size * 0.55;
  if (!ctx) ctx = document.createElement("canvas").getContext("2d");
  if (!ctx) return text.length * size * 0.55;
  ctx.font = `${weight} ${size}px Inter`;
  return ctx.measureText(text).width;
};

// a real video card whose clip plays from the frame it mounts; it holds its last frame (only reached during the swipe out)
const Clip: React.FC<{ at: number; clip: string; w: number; h: number; r?: number; from?: number; style?: React.CSSProperties }> = ({ at, ...p }) => {
  const g = useCurrentFrame();
  const last = Math.round((8 - (p.from ?? 0)) * 30) - 2;
  return <Freeze frame={Math.min(last, Math.max(0, g - at))}><VideoCard {...p} /></Freeze>;
};

/* ---------- content ---------- */
// grid slots (row 1: 0–2, row 2: 3–5): clip, language, greeting, an everyday line, where its greeting bubble sits in the ring
const SLOTS = [
  { clip: "v2", from: 1.0, lang: "Portuguese", hi: "Olá!", say: "Tudo bem?", ring: [262, 545] },
  { clip: "v3", from: 0.0, lang: "Spanish", hi: "¡Hola!", say: "¿Qué tal?", ring: [262, 1305] },
  { clip: "v4", from: 2.0, lang: "French", hi: "Salut !", say: "On y va ?", ring: [628, 405] },
  { clip: "v7", from: 1.5, lang: "German", hi: "Hallo!", say: "Alles klar?", ring: [640, 1475] },
  { clip: "v6", from: 2.0, lang: "Italian", hi: "Ciao!", say: "Andiamo!", ring: [842, 640] },
  { clip: "v5", from: 1.0, lang: "Dutch", hi: "Hoi!", say: "Lekker!", ring: [846, 1255] },
];
const POP_ORDER = [5, 2, 0, 4, 1, 3];                                        // when each greeting pops (rank)
const SAY_DELAY = [0.12, 0, 0.3, 0.2, 0.4, 0.26];
const ROWS = [
  { es: "¿Qué está ocurriendo?", en: "What's going on?" },
  { es: "No moleste, no ve que estoy ocupado", en: "Don't bother me—can't you see I'm busy?" },
  { es: "Sí, amorita, a la noche nos vemos", en: "Yeah, sweetheart, see you tonight" },
  { es: "Árbitro, yo ni lo toqué", en: "Referee, I didn't even touch him" },
];
const CHUNKS = [
  { es: "No moleste", en: "Don't bother me" },
  { es: "no ve que", en: "can't you see" },
  { es: "estoy ocupado", en: "I'm busy" },
];

/* ---------- geometry (portrait) ---------- */
const MOUNT = 135;                                   // frame the grid's videos mount (4.5 s, still off screen)
const CW_ = 300, CH_ = 533, COLX = [220, 540, 860];   // grid card size and column centres
const ROWCY = [412 + CH_ / 2, 1032 + CH_ / 2];        // grid row centres
const VX = 540, VY = 595, VW = 405, VH = 720;          // the video that comes forward (hero, top)
const BX = 70, BY = 985, BW = 940, BH = 625;           // the transcript card (under the hero)
const ES = 38, EN = 30;                               // transcript type
const ROW0 = 116, ROWGAP = 8, PADY = 14, ESH = 48, ENH = 42;
const ROWX = 18, TEXTX = 40;                          // row rect inset and text inset in the card
const POPW = 660;                                     // the word pop-up's width

/* ---------- small pieces ---------- */
const Greeting: React.FC<{ lang: string; hi: string }> = ({ lang, hi }) => (
  <div style={{ position: "relative", ...CARD, borderRadius: 30, padding: "18px 34px 22px", whiteSpace: "nowrap" }}>
    <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 30, color: C.gray, letterSpacing: "-0.005em" }}>{lang}</div>
    <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 68, color: C.ink, letterSpacing: "-0.03em", lineHeight: 1.1 }}>{hi}</div>
    <div style={{ position: "absolute", left: 34, bottom: -10, width: 24, height: 24, background: C.white, transform: "rotate(45deg)", borderRadius: 4 }} />
  </div>
);
const Tag: React.FC<{ text: string }> = ({ text }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "9px 20px", borderRadius: 999, background: C.white, whiteSpace: "nowrap",
    boxShadow: "0 0 0 1px rgba(0,0,0,0.06), 0 12px 26px -14px rgba(15,26,41,0.3)", fontFamily: SANS, fontWeight: 600, fontSize: 30, color: C.ink, letterSpacing: "-0.01em" }}>
    <div style={{ width: 12, height: 12, borderRadius: 6, background: C.sky }} />{text}
  </div>
);
const Speech: React.FC<{ text: string }> = ({ text }) => (
  <div style={{ position: "relative", background: C.white, borderRadius: 20, padding: "10px 18px 12px", whiteSpace: "nowrap",
    boxShadow: "0 16px 30px -14px rgba(15,26,41,0.45)", fontFamily: SANS, fontWeight: 700, fontSize: 34, color: C.ink, letterSpacing: "-0.02em" }}>
    <div style={{ position: "absolute", left: 22, top: -8, width: 20, height: 20, background: C.white, transform: "rotate(45deg)", borderRadius: 3 }} />
    <span style={{ position: "relative" }}>{text}</span>
  </div>
);
const Toggle: React.FC<{ on: number }> = ({ on }) => (
  <div style={{ position: "relative", width: 76, height: 44, borderRadius: 22, background: on > 0.5 ? C.sky : C.line, transition: "none" }}>
    <div style={{ position: "absolute", inset: 0, borderRadius: 22, background: C.sky, opacity: on }} />
    <div style={{ position: "absolute", top: 4, left: 4 + 32 * on, width: 36, height: 36, borderRadius: 18, background: C.white, boxShadow: "0 2px 6px rgba(0,0,0,0.18)" }} />
  </div>
);
// the tap-a-word pop-up, phone scale: word, speaker, + Save; the meaning and its word class. ax = its pointer's x
const Pop: React.FC<{ ax: number }> = ({ ax }) => (
  <div style={{ position: "relative", ...CARD, borderRadius: 28, width: POPW, boxSizing: "border-box", padding: "24px 32px 28px" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 54, letterSpacing: "-0.025em", color: C.ink, lineHeight: 1.15 }}>ocupado</div>
      <Ico n="speaker" s={36} c={C.sky} w={2.6} />
      <div style={{ flex: 1 }} />
      <SaveBtn size={28} />
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 8 }}>
      <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 40, color: C.ink2, lineHeight: 1.25 }}>busy</div>
      <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 23, letterSpacing: "0.06em", color: C.green, background: C.greenTint, borderRadius: 9, padding: "5px 12px" }}>ADJECTIVE</div>
    </div>
    <div style={{ position: "absolute", left: ax - 12, bottom: -11, width: 24, height: 24, background: C.white, transform: "rotate(45deg)", borderRadius: 4, boxShadow: "3px 3px 6px -3px rgba(15,26,41,0.18)" }} />
  </div>
);

export const SceneBP: React.FC<{ g: number }> = ({ g }) => {
  // re-measure once the font is in (canvas widths need Inter loaded)
  const [handle] = useState(() => (typeof window !== "undefined" ? delayRender("scene B fonts") : null));
  const [, setReady] = useState(false);
  useEffect(() => {
    if (handle === null) return;
    document.fonts.load("700 40px Inter").then(() => { setReady(true); continueRender(handle); }).catch(() => continueRender(handle));
  }, [handle]);

  if (g < f(3.25) || g > f(12.95)) return null;

  /* ===== beat 1: "Learn languages" with six greetings in a ring ===== */
  const tThrough = s("w:through"), tEvery = s("w:everyday"), tFollow = s("w:follow");
  const ringPush = 1 + 0.03 * lin(g, 3.3, 4.8);
  const drift = -Math.max(0, g - f(4.6)) * 0.3;                            // row 1 drifts left, row 2 right
  const row = (i: number) => (i < 3 ? 0 : 1);
  const slotX = (i: number) => COLX[i % 3] + (row(i) === 0 ? drift : -drift);
  const slotY = (i: number) => ROWCY[row(i)];
  const enter = (i: number) => (1 - k(g, 4.58 + i * 0.025, 0.75, ARRIVE)) * 1250 * (row(i) === 0 ? 1 : -1);
  const leave = k(g, tFollow - 0.32, 0.25);                               // tags and speech bubbles clear

  const bubbles = SLOTS.map((sl, i) => {
    const pop = k(g, 3.62 + POP_ORDER[i] * 0.075, 0.4, SNAP);
    if (pop <= 0) return null;
    const fly = k(g, tThrough + 0.22 + i * 0.03, 0.72, MOVE);
    const [rx, ry] = sl.ring;
    const fx = 540 + (rx - 540) * ringPush, fy = 960 + (ry - 960) * ringPush;
    const float = Math.sin(g / 30 * 1.7 + i * 1.3) * 7 * (1 - fly);
    const x = mix(fx, slotX(i), fly), y = mix(fy + float, slotY(i) - CH_ / 2 - 40, fly) - Math.sin(fly * Math.PI) * 70;
    const bO = 1 - clamp01((fly - 0.5) / 0.3), tO = clamp01((fly - 0.62) / 0.3) * (1 - leave);
    return (
      <React.Fragment key={i}>
        {bO > 0 && <div style={{ position: "absolute", left: x, top: y, zIndex: 3, transform: `translate(-50%,-50%) translateY(${(1 - pop) * 28}px) scale(${(0.6 + 0.4 * pop) * (1 - 0.45 * fly)})`, opacity: Math.min(1, pop * 1.5) * bO }}>
          <Greeting lang={sl.lang} hi={sl.hi} />
        </div>}
        {tO > 0 && <div style={{ position: "absolute", left: x, top: y, zIndex: 3, transform: `translate(-50%,-50%) scale(${(0.85 + 0.15 * clamp01((fly - 0.62) / 0.3)) * (1 - 0.1 * leave)})`, opacity: tO }}>
          <Tag text={sl.lang} />
        </div>}
      </React.Fragment>
    );
  });

  /* ===== beat 2–3: the grid of real videos, and the people in them talking ===== */
  const fwd = k(g, tFollow - 0.24, 0.75, MOVE);                            // the Spanish video comes forward
  const cards = SLOTS.map((sl, i) => {
    if (g < MOUNT) return null;
    if (i === 1) {
      const x = mix(slotX(1) + enter(1), VX, fwd), y = mix(slotY(1), VY, fwd), w = mix(CW_, VW, fwd), h = mix(CH_, VH, fwd);
      return <div key={i} style={{ position: "absolute", left: x - w / 2, top: y - h / 2, zIndex: 2 }}>
        <Clip at={MOUNT} clip={sl.clip} from={sl.from} w={w} h={h} r={mix(26, 34, fwd)} />
      </div>;
    }
    // the lower cards drop first and fade fast, so they are gone before the transcript card rises there
    const fall = k(g, tFollow - 0.38 + (5 - i) * 0.03, 0.45, MOVE);
    if (fall >= 0.46) return null;
    const x = slotX(i) + enter(i), y = slotY(i) + fall * 520;
    return <div key={i} style={{ position: "absolute", left: x - CW_ / 2, top: y - CH_ / 2, opacity: 1 - clamp01(fall * 2.2), transform: `scale(${1 - 0.12 * fall})` }}>
      <Clip at={MOUNT} clip={sl.clip} from={sl.from} w={CW_} h={CH_} r={26} />
    </div>;
  });
  const speech = SLOTS.map((sl, i) => {
    const q = k(g, tEvery - 0.06 + SAY_DELAY[i], 0.34, SNAP);
    if (q <= 0 || leave >= 1) return null;
    const x = slotX(i) - CW_ / 2 + 16, y = slotY(i) + 60 + (i % 2) * 70;
    return <div key={i} style={{ position: "absolute", left: x, top: y, zIndex: 3, transformOrigin: "30px 0px", opacity: Math.min(1, q * 1.6) * (1 - leave),
      transform: `translateY(${(1 - q) * 16}px) scale(${(0.55 + 0.45 * q) * (1 - 0.1 * leave)})` }}>
      <Speech text={sl.say} />
    </div>;
  });

  /* ===== beat 4–6: the transcript card ===== */
  const ce = k(g, tFollow - 0.04, 0.6, ARRIVE);
  const tWith = s("w:with"), tTrans = s("w:translations"), tUnf = s("w:unfamiliar");
  const on = k(g, tWith + 0.02, 0.22, SNAP);
  const ex = ROWS.map((_, i) => k(g, tTrans - 0.1 + i * 0.05, 0.45, ARRIVE));
  const rowH = (i: number) => PADY * 2 + ESH + ex[i] * ENH;
  const rowTop = (i: number) => { let y = ROW0; for (let j = 0; j < i; j++) y += rowH(j) + ROWGAP; return y; };
  const hiIn = k(g, tFollow + 0.06, 0.25);
  const sw = k(g, 8.8, 0.3, MOVE);                                         // the active line moves to row 2
  const sweep = [lin(g, 7.86, 8.46), lin(g, 8.94, 9.42)];
  const markO = k(g, tUnf, 0.2, SNAP);
  const rs = k(g, 10.36, 0.3, MOVE);                                       // row 2 slides on the swipe
  const push = k(g, 10.5, 0.45, MOVE);                                     // transcript → sentence breakdown
  const hiY = mix(rowTop(0), rowTop(1), sw), hiH = mix(rowH(0), rowH(1), sw);

  const rows = ROWS.map((r, i) => {
    const words = r.es.split(" ");
    const active = (i === 0 && sw < 0.5) || (i === 1 && sw >= 0.5);
    const p = i < 2 ? sweep[i] : 0;
    const said = p * words.length;
    return (
      <div key={i} style={{ position: "absolute", left: TEXTX, top: rowTop(i) + PADY, width: BW - TEXTX * 2, transform: i === 1 ? `translateX(${-90 * rs}px)` : undefined }}>
        <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: ES, lineHeight: `${ESH}px`, whiteSpace: "nowrap" }}>
          {words.map((wd, j) => {
            const isOc = i === 1 && wd === "ocupado";
            let col = C.light;
            if (active) col = j < Math.floor(said) || p >= 1 ? C.ink : j === Math.floor(said) && p > 0 ? C.sky : "#B9B9BE";
            return <React.Fragment key={j}>
              <span style={{ color: col, ...(isOc && markO > 0 ? { background: `rgba(47,175,238,${0.24 * markO})`, borderRadius: 8, padding: "0 6px", margin: "0 -6px", boxShadow: `inset 0 -3px 0 rgba(47,175,238,${markO})`, color: C.ink } : {}) }}>{wd}</span>
              {j < words.length - 1 ? " " : ""}
            </React.Fragment>;
          })}
        </div>
        <div style={{ height: ex[i] * ENH, overflow: "hidden" }}>
          <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: EN, lineHeight: "36px", marginTop: 6, color: active ? C.gray : "#B9B9BE", whiteSpace: "nowrap",
            opacity: ex[i], transform: `translateY(${(1 - ex[i]) * -10}px)` }}>{r.en}</div>
        </div>
      </div>
    );
  });

  // where "ocupado" sits (card coordinates)
  const ocX = TEXTX + tw("No moleste, no ve que estoy ", ES) + tw("ocupado", ES) / 2;
  const ocY = rowTop(1) + PADY + ESH / 2;
  const popIn = k(g, tUnf + 0.12, 0.32, SNAP), popOut = k(g, 10.24, 0.18);
  // the pop-up sits above the word, kept inside the safe area; its pointer still lands on the word
  const popL = Math.max(60, Math.min(1020 - POPW, BX + ocX - POPW / 2)), popAx = BX + ocX - popL;

  /* the sentence breakdown */
  const split = k(g, 10.84, 0.4, ARRIVE);
  const FS = 38, padX = 20 * split;
  const esW = CHUNKS.map((c) => tw(c.es, FS) + 2 * padX);
  const GAPMAX = Math.max(24, Math.min(72, (BW - 64 - CHUNKS.reduce((a, c) => a + tw(c.es, FS) + 40, 0)) / 2));
  const gaps = [mix(tw(", ", FS), GAPMAX, split), mix(tw(" ", FS), GAPMAX, split)];
  const esTot = esW[0] + esW[1] + esW[2] + gaps[0] + gaps[1];
  const esL = [BW / 2 - esTot / 2]; esL.push(esL[0] + esW[0] + gaps[0]); esL.push(esL[1] + esW[1] + gaps[1]);
  const esC = esL.map((l, i) => l + esW[i] / 2);
  const ESY = 212, ENY = 352, SENY = 500;
  const ENFS = 34;
  const enW = CHUNKS.map((c) => tw(c.en, ENFS));
  const dashW = tw("—", ENFS), spW = tw(" ", ENFS), qW = tw("?", ENFS);
  const senW = enW[0] + dashW + enW[1] + spW + enW[2] + qW;
  const groupW = 52 + 20 + senW, groupL = BW / 2 - groupW / 2, senL = groupL + 72;
  const inl = [senL + enW[0] / 2, senL + enW[0] + dashW + enW[1] / 2, senL + enW[0] + dashW + enW[1] + spW + enW[2] / 2];
  const tEasy = s("w:easy"), tUnd = s("w:understand");
  const panel = k(g, tEasy + 0.22, 0.35, ARRIVE);
  const ck = k(g, tUnd + 0.04, 0.35, SNAP);
  const punct = k(g, tEasy + 0.62, 0.2);
  const pulse = (i: number) => Math.sin(Math.PI * lin(g, 12.0 + i * 0.15, 12.32 + i * 0.15));

  const breakdown = (
    <div style={{ position: "absolute", inset: 0, transform: `translateX(${(1 - push) * BW}px)` }}>
      <div style={{ position: "absolute", left: 36, top: 30, display: "flex", alignItems: "center", gap: 14 }}>
        <Ico n="translate" s={38} c={C.sky} w={2.6} />
        <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 32, color: C.ink2, letterSpacing: "-0.01em" }}>Sentence breakdown</div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 100, height: 1.5, background: C.line }} />
      {/* the Spanish line, splitting into chunks */}
      {CHUNKS.map((c, i) => (
        <div key={i} style={{ position: "absolute", left: esL[i], top: ESY - 37, height: 74, display: "flex", alignItems: "center", padding: `0 ${padX}px`, boxSizing: "border-box",
          borderRadius: 18, background: `rgba(228,243,252,${split})`, boxShadow: `inset 0 -3px 0 rgba(47,175,238,${split}), 0 0 0 ${3 * pulse(i)}px rgba(47,175,238,${0.6 * pulse(i)})`,
          transform: `scale(${1 + 0.05 * pulse(i)})`, fontFamily: SANS, fontWeight: 700, fontSize: FS, color: C.ink, whiteSpace: "nowrap" }}>{c.es}</div>
      ))}
      <div style={{ position: "absolute", left: esL[0] + esW[0], top: ESY - 37, height: 74, display: "flex", alignItems: "center", fontFamily: SANS, fontWeight: 700, fontSize: FS, color: C.ink, opacity: 1 - clamp01(split * 2.5) }}>,</div>
      {/* connectors */}
      {CHUNKS.map((_, i) => {
        const c = k(g, 11.0 + i * 0.06, 0.25, ARRIVE), m = k(g, tEasy + 0.3 + i * 0.05, 0.5, MOVE);
        const len = (ENY - 30) - (ESY + 37);
        return <div key={i} style={{ position: "absolute", left: esC[i] - 1.5, top: ESY + 37, width: 3, height: len * c, background: C.sky, borderRadius: 2, opacity: 1 - clamp01(m * 2.5) }} />;
      })}
      {/* the meanings, which then click into one sentence */}
      {CHUNKS.map((c, i) => {
        const ea = k(g, 11.08 + i * 0.07, 0.3, SNAP), m = k(g, tEasy + 0.3 + i * 0.05, 0.5, MOVE);
        if (ea <= 0) return null;
        const x = mix(esC[i], inl[i], m), y = mix(ENY, SENY, m) - Math.sin(m * Math.PI) * 18;
        const pu = pulse(i);
        return <div key={i} style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) translateY(${(1 - ea) * -14 - 4 * pu}px) scale(${mix(0.86, 1, m)})`, opacity: Math.min(1, ea * 1.5),
          padding: "10px 18px", borderRadius: 16, background: `rgba(255,255,255,${1 - m})`, boxShadow: `inset 0 0 0 2px rgba(229,229,234,${1 - m})`,
          fontFamily: SANS, fontWeight: 700, fontSize: ENFS, color: pu > 0.3 ? C.skyDeep : C.ink, whiteSpace: "nowrap" }}>{c.en}</div>;
      })}
      {/* the result: one clear sentence with a check */}
      <div style={{ position: "absolute", left: 30, right: 30, top: SENY - 72, height: 144, borderRadius: 24, background: C.bg, opacity: panel, transform: `scale(${0.96 + 0.04 * panel})`, zIndex: -1 }} />
      <div style={{ position: "absolute", left: senL + enW[0], top: SENY, transform: "translateY(-50%)", fontFamily: SANS, fontWeight: 700, fontSize: ENFS, color: C.ink, opacity: punct }}>—</div>
      <div style={{ position: "absolute", left: senL + senW - qW, top: SENY, transform: "translateY(-50%)", fontFamily: SANS, fontWeight: 700, fontSize: ENFS, color: C.ink, opacity: punct }}>?</div>
      <div style={{ position: "absolute", left: groupL, top: SENY - 26, width: 52, height: 52, borderRadius: 26, background: C.sky, display: "flex", alignItems: "center", justifyContent: "center",
        opacity: Math.min(1, ck * 2), transform: `scale(${0.4 + 0.6 * ck})` }}>
        <Ico n="check" s={32} c={C.white} w={3.6} />
      </div>
    </div>
  );

  const transcript = (
    <div style={{ position: "absolute", inset: 0, transform: `translateX(${-push * BW}px)` }}>
      <div style={{ position: "absolute", left: 36, top: 30, display: "flex", alignItems: "center", gap: 14 }}>
        <Ico n="list" s={38} c={C.sky} w={2.6} />
        <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 32, color: C.ink2, letterSpacing: "-0.01em" }}>Transcript</div>
      </div>
      <div style={{ position: "absolute", right: 36, top: 28, display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 30, color: on > 0.5 ? C.ink2 : C.gray }}>Translation</div>
        <Toggle on={on} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 100, height: 1.5, background: C.line }} />
      <div style={{ position: "absolute", left: ROWX, top: hiY, width: BW - ROWX * 2, height: hiH, borderRadius: 18, background: C.skyTint, boxShadow: "inset 0 0 0 1.5px rgba(47,175,238,0.35)", opacity: hiIn,
        transform: sw >= 0.5 ? `translateX(${-90 * rs}px)` : undefined }} />
      {rows}
      {/* the swipe hint revealed behind the line */}
      <div style={{ position: "absolute", left: BW - 90, top: rowTop(1) + rowH(1) / 2 - 28, width: 56, height: 56, borderRadius: 28, background: C.sky, display: "flex", alignItems: "center", justifyContent: "center", opacity: rs, transform: `scale(${0.6 + 0.4 * rs})` }}>
        <Ico n="swipe" s={32} c={C.white} w={3.2} />
      </div>
    </div>
  );

  // finger for the swipe
  const sp = lin(g, 10.32, 10.66), fingerO = Math.min(clamp01(sp * 6), clamp01((1 - sp) * 4));
  const fx0 = BX + BW - 120, fx1 = BX + BW - 480, fy = BY + rowTop(1) + rowH(1) / 2;
  const fxNow = mix(fx0, fx1, MOVE(sp));

  return (
    <Feed g={g} in="s1" out="s2" h={1920}>
      {/* beat 1 statement, two centred lines */}
      <Say g={g} words={[{ t: "Learn", at: "s1+0.06" }, { t: "languages", at: "w:languages-0.12", blue: true }]} x={140} width={800} y={808} size={140} out="w:through+0.04" />
      {cards}
      {speech}
      {bubbles}
      {/* the transcript card */}
      {ce > 0 && (
        <div style={{ position: "absolute", left: BX, top: BY, width: BW, height: BH, ...CARD, borderRadius: 32, overflow: "hidden", zIndex: 4,
          transform: `translateY(${(1 - ce) * 220}px)`, opacity: clamp01(ce * 1.6) }}>
          {push < 1 && transcript}
          {push > 0 && breakdown}
        </div>
      )}
      {/* the toggle tap, the word tap, the pop-up, the swipe */}
      <div style={{ position: "absolute", inset: 0, zIndex: 6, pointerEvents: "none" }}>
        <Tap x={BX + BW - 36 - 38} y={BY + 50} p={lin(g, tWith - 0.12, tWith + 0.38)} size={84} />
        <Tap x={BX + ocX} y={BY + ocY} p={lin(g, tUnf - 0.1, tUnf + 0.45)} size={90} />
        {popIn > 0 && popOut < 1 && (
          <div style={{ position: "absolute", left: popL, top: BY + rowTop(1) - 16, transform: `translateY(-100%) translateY(${(1 - popIn) * 16}px) scale(${0.9 + 0.1 * popIn - 0.06 * popOut})`,
            transformOrigin: `${popAx}px 100%`, opacity: Math.min(1, popIn * 1.6) * (1 - popOut) }}>
            <Pop ax={popAx} />
          </div>
        )}
        {fingerO > 0 && <>
          <div style={{ position: "absolute", left: fxNow, top: fy - 3, width: Math.max(0, fx0 - fxNow), height: 6, borderRadius: 3, background: C.sky, opacity: 0.45 * fingerO }} />
          <div style={{ position: "absolute", left: fxNow - 30, top: fy - 30, width: 60, height: 60, borderRadius: 30, background: "rgba(15,26,41,0.22)", boxShadow: `0 0 0 3px ${C.white}`, opacity: fingerO }} />
        </>}
      </div>
    </Feed>
  );
};
