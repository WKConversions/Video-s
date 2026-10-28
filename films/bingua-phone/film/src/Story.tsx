// The stage: Bingua's navy, one phone running the real app (src/app.tsx), and what the finger opens lifted out
// beside it. Every move is the app doing something: the feed scrolls, the transcript keeps pace, a word is tapped, a
// line is swiped, a word is saved, a card flips, a quiz is answered. Keyed to the voice's words (src/clock.ts).
import React from "react";
import { Img, staticFile } from "remotion";
import { T } from "./clock";
import { Line, Track, measure, track } from "./kinetic";
import { ARRIVE, BinguaIcon, C, FLICK, Flag, MOVE, OUT, SOFT, clamp01, lerp, txt } from "./lib";
import {
  Breakdown, CardsScreen, Clip, FlashCard, Feed, Lesson, Page, PAGE, QuizScreen, SH, SW, StatusBar, TabBar, TopBar, WordCard, lineTop, wordBox,
} from "./app";

const k = (g: number, pos: string | number, dur: number, ease = ARRIVE) => T.k(g, pos, dur, ease);
const trk = (g: number, keys: Track[]) => {
  for (let i = 1; i < keys.length; i++) if (T.f(keys[i][0]) < T.f(keys[i - 1][0])) throw new Error(`keys out of order: ${keys[i - 1][0]} > ${keys[i][0]}`);
  return track(g, keys);
};
const on = (g: number, a: string, b: string) => g >= T.f(a) && g < T.f(b);
const PS = 1.1;                                    // phone scale on stage
const PW = (SW + 24) * PS, PHt = (SH + 24) * PS;   // the phone's outer size

// ---- the footage of the feed -------------------------------------------------------------------------------------------
const V = {
  de: "portrait-of-an-influencer-talking-to-the-camera-42323.mp4",
  fr: "man-being-recorded-himself-for-a-blog-on-the-street-34469.mp4",
  it: "serving-parmesan-cheese-in-spaghetti-bolognese-close-up-engr-12171.mp4",
  es: "woman-eating-fast-food-in-the-street-26219.mp4",
};
const L = {
  de: [["Heute zeige ich euch meine Lieblingsstadt.", "Today I'm showing you my favourite city."], ["Kommt mit!", "Come along!"], ["Hier gibt es den besten Kaffee.", "This is where the best coffee is."]],
  fr: [["On commence la journée au parc.", "We start the day at the park."], ["Il fait trop beau aujourd'hui !", "The weather is so nice today!"], ["Venez, je vous montre.", "Come on, I'll show you."]],
  it: [["Un po' di parmigiano sulla pasta.", "A bit of parmesan on the pasta."], ["Guarda che meraviglia!", "Look how gorgeous!"], ["La ricetta di mia nonna.", "My grandmother's recipe."]],
  es: [["¡Este bocadillo es buenísimo!", "This sandwich is amazing!"], ["Es el más famoso de toda la ciudad.", "It's the most famous one in the whole city."],
    ["¿Qué está pasando aquí?", "What's going on here?"], ["Hay una cola enorme para comprarlo.", "There's a huge line to buy it."]],
} as Record<string, [string, string][]>;
const s = (pos: string) => T.s(pos);
const pagesA = (): Page[] => [
  { clip: V.fr, at: s("flick") - 0.2, offset: 0, lines: L.fr }, { clip: V.it, at: s("flick") - 0.2, offset: 0, lines: L.it },
  { clip: V.de, at: s("flick") - 0.2, offset: 1, pos: "50% 30%", lines: L.de },
];
const pagesB = (): Page[] => [
  { clip: V.de, at: s("reopen") - 0.4, offset: 4, pos: "50% 30%", lines: L.de }, { clip: V.fr, at: s("s1") - 0.4, offset: 2, lines: L.fr },
  { clip: V.it, at: s("s2") - 0.4, offset: 2, lines: L.it }, { clip: V.es, at: s("s3") - 0.4, offset: 3, pos: "45% 40%", lines: L.es },
];
const pagesC = (): Page[] => [
  { clip: V.es, at: s("feed") - 0.4, offset: 10, pos: "45% 40%", lines: L.es }, { clip: V.fr, at: s("next") - 0.4, offset: 8, lines: L.fr },
];

// ---- where things are on the screen (points) ------------------------------------------------------------------------------
const famoso = (cur: number) => { const b = wordBox(L.es[1][0], "famoso"); return { x: 24 + b.x + b.w / 2, y: PAGE.top + lineTop(1, cur) + 20 }; };
const cardTop = (cur: number) => PAGE.top + lineTop(1, cur) - 132;
const TAB = (i: number) => ({ x: 49 + i * 97.5, y: 800 });

/** The finger: a touch point, as a screen recording shows it; `press` squeezes it and sends a ring. */
const Finger: React.FC<{ g: number }> = ({ g }) => {
  const f1 = famoso(1), f2 = famoso(2), ct = cardTop(2);
  const swipeKeys = (lab: string): Track[] => [[`${lab}-0.4`, 300, 640, 0], [`${lab}-0.12`, 300, 610, 1, SOFT], [`${lab}+0.24`, 300, 300, 1, MOVE], [`${lab}+0.38`, 300, 280, 0]];
  const p = trk(g, [
    ["open", 300, 700, 0], ["flick-0.32", 300, 700, 0], ["flick-0.04", 300, 640, 1, SOFT], ["flick+0.22", 300, 230, 1, FLICK], ["flick+0.4", 300, 200, 0],
    ...swipeKeys("s1"), ...swipeKeys("s2"), ...swipeKeys("s3"),
    ["w:word-0.3", f1.x + 30, f1.y + 90, 0], ["tap-0.06", f1.x, f1.y, 1, MOVE], ["tap+0.35", f1.x, f1.y, 1], ["tap+0.6", f1.x + 40, f1.y + 90, 0],
    ["swipe-0.45", 330, f2.y + 6, 0], ["swipe-0.05", 330, f2.y + 6, 1, SOFT], ["swipe+0.3", 160, f2.y + 6, 1, MOVE], ["swipe+0.5", 140, f2.y + 6, 0],
    ["w:useful-0.3", f1.x + 30, famoso(2).y + 90, 0], ["w:useful+0.04", famoso(2).x, famoso(2).y, 1, MOVE], ["w:useful+0.3", famoso(2).x, famoso(2).y, 1],
    ["save-0.06", 318, ct + 28, 1, MOVE], ["save+0.3", 318, ct + 28, 1], ["cards-0.42", TAB(1).x + 60, TAB(1).y - 120, 1, MOVE], ["cards-0.05", TAB(1).x, TAB(1).y, 1, MOVE],
    ["cards+0.3", TAB(1).x, TAB(1).y, 1], ["flip-0.06", 195, 330, 1, MOVE], ["flip+0.3", 195, 330, 1], ["gotit-0.06", 282, 586, 1, MOVE], ["gotit+0.3", 282, 586, 1],
    ["pick-0.06", 195, 357, 1, MOVE], ["pick+0.4", 195, 357, 1], ["pick+0.7", 230, 450, 0],
    ["feed-0.45", TAB(0).x + 60, TAB(0).y - 120, 0], ["feed-0.06", TAB(0).x, TAB(0).y, 1, MOVE], ["feed+0.25", TAB(0).x, TAB(0).y, 1],
    ["next-0.12", 300, 610, 1, MOVE], ["next+0.24", 300, 300, 1, MOVE], ["heart-0.06", 362, PAGE.top + 210, 1, MOVE], ["heart+0.35", 362, PAGE.top + 210, 1], ["heart+0.6", 330, 400, 0],
  ]);
  if (p[2] <= 0.01) return null;
  const pr = ["tap", "w:useful+0.04", "save", "cards-0.05", "flip", "gotit", "pick", "feed-0.06", "heart"].map((a) => { const d = g - T.f(a); return d < -3 || d > 9 ? 0 : d < 0 ? (d + 3) / 3 : 1 - d / 9; });
  const press = Math.max(...pr), ring = ["tap", "w:useful+0.04", "save", "cards-0.05", "flip", "gotit", "pick", "feed-0.06", "heart"].map((a) => (g - T.f(a)) / 14).find((v) => v > 0 && v < 1) ?? 0;
  return (
    <div style={{ position: "absolute", left: p[0], top: p[1], zIndex: 50, opacity: p[2] }}>
      {ring > 0 && <div style={{ position: "absolute", left: -28 - 26 * ring, top: -28 - 26 * ring, width: 56 + 52 * ring, height: 56 + 52 * ring, borderRadius: "50%", border: "3px solid rgba(255,255,255,0.9)", opacity: 1 - ring }} />}
      <div style={{ position: "absolute", left: -28, top: -28, width: 56, height: 56, borderRadius: 28, background: "rgba(120,120,128,0.35)", border: "3px solid rgba(255,255,255,0.95)", boxSizing: "border-box",
        boxShadow: "0 4px 14px rgba(0,0,0,0.3)", transform: `scale(${1 - 0.18 * press})` }} />
    </div>
  );
};

/** What the phone shows, in points. */
const Screen: React.FC<{ g: number }> = ({ g }) => {
  const xp = 82 + 10 * k(g, "pick+0.2", 0.5) + 8 * k(g, "xp", 0.9, MOVE);
  const streak = g >= T.f("streak") ? 3 : 2;
  const tab = on(g, "cards", "quiz") ? 1 : on(g, "quiz", "feed") ? 2 : 0;
  const badgeBump = (() => { const d = (g - T.f("badge")) / 10; return d > 0 && d < 1 ? Math.sin(Math.PI * d) : 0; })();
  // V1's transcript: line 2 (famoso) then line 3; famoso pulses, is tapped; line 3 is swiped
  const cur = k(g, "l2", 0.35, MOVE) + k(g, "l3", 0.35, MOVE);
  const pulse = on(g, "unknown", "tap") ? 0.5 + 0.5 * Math.sin((g - T.f("unknown")) / 3) : 0;
  const tapped = Math.max(k(g, "tap", 0.15) * (1 - k(g, "close", 0.2)), k(g, "w:useful+0.04", 0.15) * (1 - k(g, "cards", 0.2)));
  const swipeX = -90 * (k(g, "swipe", 0.3, MOVE) - k(g, "sheet", 0.3, MOVE));
  const offB = k(g, "s1", 0.4, MOVE) + k(g, "s2", 0.4, MOVE) + k(g, "s3", 0.4, MOVE);
  const cardO = Math.max(k(g, "card", 0.25) * (1 - k(g, "close", 0.2)), k(g, "w:useful+0.12", 0.25) * (1 - k(g, "fly", 0.2)));
  const cardCur = g < T.f("shut") ? cur : 2;
  const saved = k(g, "save", 0.12);
  const sheet = k(g, "sheet", 0.35) * (1 - k(g, "shut", 0.25, OUT));
  const fly = k(g, "fly", 0.5, MOVE);
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: SW, height: SH, background: C.bg, overflow: "hidden", borderRadius: 52 }}>
      <StatusBar />
      <TopBar xp={xp} streak={streak} goal={k(g, "xp+0.8", 0.2)} />
      {g < T.f("reopen") && <Feed pages={pagesA()} offset={3 * k(g, "flick", 0.95, FLICK)} lesson={<Lesson g={g} mark={0} study />} />}
      {g >= T.f("reopen") && g < T.f("cards+0.15") && <Feed pages={pagesB()} offset={offB} exPage={3} ex={{ cur, hi: { line: 1, word: "famoso", pulse, tapped }, swipe: { line: 2, x: swipeX } }} />}
      {on(g, "cards+0.1", "quiz+0.1") && <CardsScreen g={g} />}
      {on(g, "quiz+0.1", "feed+0.1") && <QuizScreen g={g} />}
      {g >= T.f("feed+0.1") && <Feed pages={pagesC()} offset={k(g, "next", 0.4, MOVE)} exPage={1} ex={{ cur: 0, heart: k(g, "heart", 0.35) }} />}
      {cardO > 0 && <div style={{ position: "absolute", left: 30, top: cardTop(cardCur), zIndex: 12, opacity: cardO, transform: `translateY(${(1 - Math.min(1, cardO * 1.2)) * 12}px)` }}><WordCard saved={saved} tr={Math.max(k(g, "trans", 0.3), g > T.f("shut") ? 1 : 0)} /></div>}
      {sheet > 0 && <>
        <div style={{ position: "absolute", inset: 0, background: `rgba(0,0,0,${0.35 * sheet})`, zIndex: 13 }} />
        <div style={{ position: "absolute", left: 22, top: 230 + (1 - sheet) * 120, zIndex: 14, opacity: Math.min(1, sheet * 1.5) }}><Breakdown g={g} /></div>
      </>}
      {fly > 0 && fly < 1 && (
        <div style={{ position: "absolute", left: lerp(300, TAB(1).x, fly) - 46, top: lerp(cardTop(2) + 28, TAB(1).y - 10, fly) - 60 * Math.sin(Math.PI * fly) - 16, zIndex: 40,
          height: 32, padding: "0 14px", borderRadius: 16, background: C.blue, display: "flex", alignItems: "center", ...txt(15, 800, C.white), transform: `scale(${1 - 0.4 * fly})` }}>famoso</div>
      )}
      <TabBar active={tab} badge={g >= T.f("badge") ? 15 : 14} bump={badgeBump} />
      <Finger g={g} />
    </div>
  );
};

/** The phone that can become the Bingua tile (m 0 → 1): the frame shrinks into the navy tile, the screen gives way to
 *  the icon's play triangle and its two subtitle bars. */
const Device: React.FC<{ g: number; x: number; y: number; m: number; size: number }> = ({ g, x, y, m, size }) => {
  const w = lerp(PW, size, m), h = lerp(PHt, size, m), r = lerp(66, size * 0.222, m);
  const screenO = 1 - clamp01(m / 0.35), parts = clamp01((m - 0.55) / 0.45);
  const sc = Math.min((w - 26 * PS) / SW, (h - 26 * PS) / SH);
  return (
    <div style={{ position: "absolute", left: x - w / 2, top: y - h / 2, width: w, height: h }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: r, background: `linear-gradient(135deg, ${m > 0.5 ? "#0E1826" : "#05070B"}, ${m > 0.5 ? "#152741" : "#10141B"})`,
        boxShadow: `0 40px 90px rgba(0,0,0,0.55), 0 0 0 ${2 * (1 - m)}px rgba(255,255,255,0.10), 0 0 120px rgba(47,175,238,${0.12 + 0.1 * m})` }} />
      {parts > 0 && <div style={{ position: "absolute", left: 0, top: (h - w) / 2 }}><BinguaIcon size={w} parts={parts} /></div>}
      {screenO > 0 && (
        <div style={{ position: "absolute", left: w / 2 - (SW * sc) / 2, top: h / 2 - (SH * sc) / 2, width: SW, height: SH, transform: `scale(${sc})`, transformOrigin: "0 0", opacity: screenO }}>
          <Screen g={g} />
          <div style={{ position: "absolute", left: SW / 2 - 62, top: 11, width: 124, height: 36, borderRadius: 18, background: "#000", zIndex: 60 }} />
        </div>
      )}
    </div>
  );
};

// ---- what lifts out beside the phone (frame px) -------------------------------------------------------------------------
const lift = (g: number, a: string, b: string) => { const i = k(g, a, 0.5), o = k(g, b, 0.25, OUT); return { o: Math.min(1, i * 1.5) * (1 - o), dx: (1 - i) * -160, s: 0.88 + 0.12 * i }; };
const Lifted: React.FC<{ x: number; y: number; l: { o: number; dx: number; s: number }; children: React.ReactNode }> = ({ x, y, l, children }) =>
  l.o <= 0.001 ? null : <div style={{ position: "absolute", left: x, top: y, opacity: l.o, transform: `translateX(${l.dx}px) scale(${l.s})`, transformOrigin: "0 50%" }}>{children}</div>;

const LANGS: [string, "de" | "fr" | "it" | "es"][] = [["Deutsch", "de"], ["Français", "fr"], ["Italiano", "it"], ["Español", "es"]];
const PX = 840, PY = 170, PWd = 840, PHd = 740;   // the big video panel
/** The feed's videos, playing large: the same clips at the same moment as in the phone, swiped with it. */
const Panel: React.FC<{ pages: Page[]; offset: number; heart?: number; children?: React.ReactNode }> = ({ pages, offset, heart = 0, children }) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: PWd, height: PHd, borderRadius: 36, overflow: "hidden", background: "#000", boxShadow: "0 40px 90px rgba(0,0,0,0.5)" }}>
    {pages.map((p, i) => { const y = (i - offset) * PHd; if (y <= -PHd || y >= PHd) return null; return (
      <div key={i} style={{ position: "absolute", left: 0, top: y, width: PWd, height: PHd }}><Clip src={p.clip} at={p.at} offset={p.offset} pos={p.pos} /></div>
    ); })}
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(rgba(0,0,0,0) 55%, rgba(0,0,0,0.45))" }} />
    {heart > 0 && (() => { const b = Math.min(1, heart * 1.2); return (
      <div style={{ position: "absolute", left: PWd / 2 - 110, top: PHd / 2 - 130, width: 220, height: 220, opacity: 1 - Math.max(0, (heart - 0.6) / 0.4), transform: `scale(${0.4 + 0.8 * b})` }}>
        <svg width={220} height={220} viewBox="0 0 24 24"><path d="M12 20.5S3.5 15 3.5 9.2A4.7 4.7 0 0 1 12 6.6a4.7 4.7 0 0 1 8.5 2.6C20.5 15 12 20.5 12 20.5z" fill={C.red} /></svg>
      </div>
    ); })()}
    {children}
  </div>
);
const Lifts: React.FC<{ g: number }> = ({ g }) => {
  const offB = k(g, "s1", 0.4, MOVE) + k(g, "s2", 0.4, MOVE) + k(g, "s3", 0.4, MOVE);
  const panelB = lift(g, "reopen+0.25", "cards-0.15"), panelC = lift(g, "feed+0.15", "outro-0.25");
  const lang = k(g, "reopen+0.45", 0.4) * (1 - k(g, "l1-0.15", 0.25));
  const line = k(g, "l1", 0.4) * (1 - k(g, "unknown-0.1", 0.25));
  const curLine = g < T.f("l2") ? 0 : 1, lineStart = T.s(curLine ? "l2" : "l1"), lineDur = curLine ? 1.5 : 0.85;
  const words = L.es[curLine][0].split(" ");
  const spoken = clamp01((g / 30 - lineStart) / lineDur) * words.length;
  const wc = Math.max(k(g, "card", 0.35) * (1 - k(g, "close", 0.2)), k(g, "w:useful+0.12", 0.35) * (1 - k(g, "fly", 0.2)));
  const bd = k(g, "sheet", 0.4) * (1 - k(g, "shut", 0.25, OUT));
  const fc = lift(g, "cards+0.3", "quiz");
  const flip = k(g, "flip", 0.4), got = k(g, "gotit", 0.3);
  const xpO = k(g, "xp-0.1", 0.4);
  const xp = 92 + 8 * k(g, "xp", 0.9, MOVE);
  const lesIn = k(g, "lesson", 0.45), lesOut = k(g, "lessonOut", 0.45, OUT);
  const rouIn = k(g, "routine", 0.45), rouOut = k(g, "routineOut", 0.45, OUT);
  const flickF = (a: string, x: number, y: number) => {
    const t = (g - T.f(a)) / 30; if (t < -0.35 || t > 0.4) return null;
    const p = t < 0 ? 0 : MOVE(clamp01(t / 0.35)), o = t < -0.2 ? (t + 0.35) / 0.15 : t > 0.25 ? 1 - (t - 0.25) / 0.15 : 1;
    return <div style={{ position: "absolute", left: x + 260 * p - 30, top: y - 40 * p - 30, width: 60, height: 60, borderRadius: 30, background: "rgba(120,120,128,0.35)", border: "3px solid rgba(255,255,255,0.95)", boxSizing: "border-box", opacity: o }} />;
  };
  const ROUTINE = ["Review grammar notes · 15 min", "Conjugation drill · 20 verbs", "Write 10 sentences", "Vocabulary list · 30 words", "Listening exercise", "Translate a paragraph", "Self-test · 10 questions"];
  return (
    <>
      <Lifted x={PX} y={PY} l={panelB}>
        <Panel pages={pagesB()} offset={offB}>
          {lang > 0 && <div style={{ position: "absolute", left: 30, top: 30, opacity: lang, transform: `translateY(${(1 - lang) * -16}px)`, width: 460, height: 96 }}>
            {LANGS.map(([n, c], i) => { const d = i - offB, o = Math.max(0, 1 - Math.abs(d) * 1.6); return o > 0 && (
              <div key={n} style={{ position: "absolute", left: 0, top: d * 50, opacity: o, height: 96, padding: "0 36px 0 24px", borderRadius: 48, background: C.white, display: "flex", alignItems: "center", gap: 18, boxShadow: "0 12px 30px rgba(0,0,0,0.35)" }}>
                <Flag code={c} size={58} /><span style={txt(46, 800)}>{n}</span>
              </div>
            ); })}
          </div>}
          {line > 0 && <div style={{ position: "absolute", left: 28, right: 28, bottom: 28, opacity: line, transform: `translateY(${(1 - line) * 30}px)`, borderRadius: 26, background: "rgba(255,255,255,0.96)", padding: "26px 32px", boxSizing: "border-box" }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0 13px", ...txt(42, 750, C.ink, { whiteSpace: "normal" }) }}>
              {words.map((w, i) => <span key={i} style={{ color: i < spoken ? C.ink : C.grey3 }}>{w}</span>)}
            </div>
            <div style={{ marginTop: 10, ...txt(29, 500, C.grey2, { whiteSpace: "normal" }) }}>{L.es[curLine][1]}</div>
          </div>}
          {wc > 0 && <div style={{ position: "absolute", left: 60, bottom: 50, opacity: Math.min(1, wc * 1.4), transform: `translateY(${(1 - wc) * 40}px)` }}>
            <WordCard saved={k(g, "save", 0.12)} tr={Math.max(k(g, "trans", 0.3), g > T.f("shut") ? 1 : 0)} scale={2.1} />
          </div>}
          {bd > 0 && <>
            <div style={{ position: "absolute", inset: 0, background: `rgba(0,0,0,${0.4 * bd})` }} />
            <div style={{ position: "absolute", left: 56, top: 80 + (1 - bd) * 80, opacity: Math.min(1, bd * 1.5) }}><Breakdown g={g} scale={2.1} /></div>
          </>}
        </Panel>
      </Lifted>
      <Lifted x={PX} y={PY} l={panelC}>
        <Panel pages={pagesC()} offset={k(g, "next", 0.4, MOVE)} heart={k(g, "heart", 0.7, MOVE)}>
          {xpO > 0 && <div style={{ position: "absolute", left: 40, top: 36, opacity: xpO, transform: `translateY(${(1 - xpO) * -20}px)`, display: "flex", alignItems: "center", gap: 24 }}>
            <div style={{ position: "relative", width: 540, height: 104, borderRadius: 52, background: C.white, boxShadow: "0 16px 40px rgba(0,0,0,0.35)" }}>
              <div style={{ position: "absolute", left: 34, top: 20, display: "flex", alignItems: "center", gap: 10, ...txt(31, 800) }}><svg width={28} height={28} viewBox="0 0 24 24"><path d="M13 2.5 4.5 13.5h6.5l-1 8 8.5-11h-6.5z" fill={C.blue} /></svg>{Math.round(xp)} XP today</div>
              <div style={{ position: "absolute", right: 34, top: 25, ...txt(25, 700, C.blueD) }}>Goal 100{xp >= 99.5 ? " ✓" : ""}</div>
              <div style={{ position: "absolute", left: 34, right: 34, bottom: 18, height: 8, borderRadius: 4, background: C.line }}><div style={{ width: `${xp}%`, height: "100%", borderRadius: 4, background: C.blue }} /></div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, height: 104, padding: "0 30px 0 22px", borderRadius: 52, background: C.white, ...txt(56, 800) }}>
              <svg width={54} height={54} viewBox="0 0 24 24"><path d="M12 22c-4 0-7-2.8-7-6.6 0-3.4 2.6-5.3 3.7-8.4.3 1.9 1.4 3 2.4 3.4-.2-3.4 1.4-6.4 4.3-8.4-.4 3.3 1 5 2.6 7 1.1 1.4 1.9 3 1.9 5 0 4.4-3.2 8-7.9 8z" fill={C.orange} /></svg>
              {g >= T.f("streak") ? 3 : 2}
            </div>
          </div>}
        </Panel>
      </Lifted>
      <Lifted x={1010} y={230} l={fc}><FlashCard flip={flip} got={got} scale={1.55} /></Lifted>
      {lesIn > 0 && lesOut < 1 && (
        <div style={{ position: "absolute", left: 1080 + 1000 * lesOut, top: 150 + (1 - lesIn) * 60, width: 390, height: 640, opacity: Math.min(1, lesIn * 1.5), transform: `rotate(${14 * lesOut}deg) scale(1.1)`, transformOrigin: "50% 50%",
          borderRadius: 26, overflow: "hidden", boxShadow: "0 30px 70px rgba(0,0,0,0.4)" }}>
          <div style={{ position: "relative", width: 390, height: 640 }}><Lesson g={g} mark={1} /></div>
        </div>
      )}
      {flickF("lessonOut", 1230, 520)}
      {rouIn > 0 && rouOut < 1 && (
        <div style={{ position: "absolute", left: 1000 + 1000 * rouOut, top: 200 + (1 - rouIn) * 60, width: 600, opacity: Math.min(1, rouIn * 1.5), transform: `rotate(${12 * rouOut}deg)`,
          borderRadius: 26, background: C.white, padding: "28px 32px", boxSizing: "border-box", boxShadow: "0 30px 70px rgba(0,0,0,0.4)" }}>
          <div style={txt(30, 800)}>My study routine</div>
          <div style={{ marginTop: 4, ...txt(18, 500, C.grey) }}>Every day · 2 h 10 min</div>
          {ROUTINE.map((r, i) => (
            <div key={i} style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 14, ...txt(21, 500, C.grey2) }}>
              <div style={{ width: 24, height: 24, borderRadius: 7, border: `2.5px solid ${C.grey3}`, flex: "none" }} />{r}
            </div>
          ))}
        </div>
      )}
      {flickF("routineOut", 1160, 560)}
    </>
  );
};

export const Story: React.FC<{ g: number }> = ({ g }) => {
  const D = trk(g, [
    ["open", 960, 540, 0, 260], ["logo", 960, 540, 0, 260], ["logo+0.5", 690, 540, 1, 260, MOVE], ["reopen", 690, 540, 1, 260], ["reopen+0.55", 540, 540, 0, 260, MOVE],
    ["outro", 540, 540, 0, 240], ["outro+0.55", 655, 450, 1, 240, MOVE],
  ]);
  const wordA = [{ t: "Bingua", at: "word" }];
  const wordB = [{ t: "Bingua", at: "outro+0.3" }];
  const tag = [{ t: "Learn", at: "tag" }, { t: "languages", at: "w:languages" }, { t: "by", at: "w:by" }, { t: "Scrolling.", at: "scroll", color: C.blue }];
  const tagX = 960 - (measure("Learn languages by Scrolling.", 74, 800, -0.02) + 0.26 * 74 * 3 - 74 * 0.26 * 3 * 0.1) / 2;
  const badge = k(g, "scroll+0.45", 0.5);
  return (
    <div style={{ position: "absolute", left: -80, top: -80, width: 2080, height: 1240, overflow: "hidden", background: `radial-gradient(1100px 800px at 40% 50%, #16304C 0%, ${C.navy} 55%, #0A111B 100%)` }}>
      <div style={{ position: "absolute", left: 80, top: 80, width: 1920, height: 1080 }}>
        {on(g, "reopen", "outro") && <Lifts g={g} />}
        <Device g={g} x={D[0]} y={D[1]} m={D[2]} size={D[3]} />
        {on(g, "word-0.1", "reopen+0.3") && <Line g={g} words={wordA} x={690 + 130 + 46} y={540 - 92} size={160} weight={800} color={C.white} ls={-0.03} out="reopen-0.05" outDur={0.3} />}
        {g >= T.f("outro") && <>
          <Line g={g} words={wordB} x={655 + 120 + 44} y={450 - 82} size={150} weight={800} color={C.white} ls={-0.03} />
          <Line g={g} words={tag} x={tagX} y={650} size={74} weight={800} color={C.white} ls={-0.02} />
          {badge > 0 && <Img src={staticFile("app-store-badge-white.svg")} style={{ position: "absolute", left: 960 - 132, top: 800 + (1 - badge) * 24, width: 264, opacity: badge }} />}
        </>}
      </div>
    </div>
  );
};
