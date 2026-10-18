// The Bingua app, rebuilt from its own screenshots (bingua.app): the XP bar, the video feed with For you / Discover,
// the dual transcript under the video, the word card, the sentence breakdown, Cards and Quiz, the tab bar. Drawn at
// the phone's own size (390 × 844 points); the stage scales it.
import React from "react";
import { OffthreadVideo, Sequence, staticFile } from "remotion";
import { T } from "./clock";
import { measure } from "./kinetic";
import { C, F, MOVE, ARRIVE, lerp, txt } from "./lib";

export const SW = 390, SH = 844;
export const PAGE = { top: 96, h: 674, video: 380 };
const k = (g: number, pos: string | number, dur: number, ease = ARRIVE) => T.k(g, pos, dur, ease);

// ---- icons -----------------------------------------------------------------------------------------------------------
const P: Record<string, string> = {
  gear: "M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z M19.4 13.5l1.6 1.2-1.8 3.1-1.9-.7a7 7 0 0 1-1.9 1.1l-.3 2h-3.6l-.3-2a7 7 0 0 1-1.9-1.1l-1.9.7L3 14.7l1.6-1.2a7 7 0 0 1 0-3L3 9.3l1.8-3.1 1.9.7a7 7 0 0 1 1.9-1.1l.3-2h3.6l.3 2a7 7 0 0 1 1.9 1.1l1.9-.7 1.8 3.1-1.6 1.2a7 7 0 0 1 0 3z",
  heart: "M12 20.5S3.5 15 3.5 9.2A4.7 4.7 0 0 1 12 6.6a4.7 4.7 0 0 1 8.5 2.6C20.5 15 12 20.5 12 20.5z",
  bookmark: "M6.5 3.5h11v17l-5.5-4-5.5 4z",
  flag: "M5.5 21V4 M5.5 4h12l-2.5 4 2.5 4h-12",
  home: "M3.5 11 12 4l8.5 7 M6 9.5V20h12V9.5",
  cards: "M4.5 7.5h15v12h-15z M7 4.5h10",
  quiz: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M9.5 9.3a2.6 2.6 0 0 1 5 .8c0 1.8-2.5 2.2-2.5 3.9 M12 16.8v.2",
  user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M4.5 20.5c0-4 3.4-6 7.5-6s7.5 2 7.5 6",
  speaker: "M4 9.5h3.5L12 6v12l-4.5-3.5H4z M15.5 9a4 4 0 0 1 0 6 M18 6.5a7.5 7.5 0 0 1 0 11",
  close: "M6 6l12 12 M18 6 6 18",
  back: "M15 5l-7 7 7 7",
  list: "M8 6.5h12 M8 12h12 M8 17.5h12 M4 6.5h.5 M4 12h.5 M4 17.5h.5",
  check: "M5 12.5l4.5 4.5L19 7.5",
  bolt: "M13 2.5 4.5 13.5h6.5l-1 8 8.5-11h-6.5z",
  play: "M8 5v14l11-7z",
  edit: "M4 20h4L19 9l-4-4L4 16z",
  timer: "M12 21a8 8 0 1 0 0-16 8 8 0 0 0 0 16z M12 9v4l2.5 2 M9.5 2.5h5",
};
export const Ico: React.FC<{ n: string; s: number; c?: string; w?: number; fill?: string; style?: React.CSSProperties }> = ({ n, s, c = C.ink, w = 2, fill = "none", style }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" style={{ display: "block", flex: "none", ...style }}><path d={P[n]} fill={fill} stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" /></svg>
);
const Flame: React.FC<{ s: number }> = ({ s }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" style={{ display: "block" }}><path d="M12 22c-4 0-7-2.8-7-6.6 0-3.4 2.6-5.3 3.7-8.4.3 1.9 1.4 3 2.4 3.4-.2-3.4 1.4-6.4 4.3-8.4-.4 3.3 1 5 2.6 7 1.1 1.4 1.9 3 1.9 5 0 4.4-3.2 8-7.9 8z" fill={C.orange} /><path d="M12 22c-2 0-3.4-1.4-3.4-3.3 0-2 1.6-3 2.4-4.8.7 1.3 2.6 2 3.3 3.6.8 2-.2 4.5-2.3 4.5z" fill={C.yellow} /></svg>
);

// ---- chrome ----------------------------------------------------------------------------------------------------------
export const StatusBar: React.FC<{ dark?: boolean }> = ({ dark }) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: SW, height: 48, zIndex: 20 }}>
    <div style={{ position: "absolute", left: 36, top: 15, ...txt(16, 700, dark ? C.white : C.ink) }}>9:41</div>
    <div style={{ position: "absolute", right: 30, top: 18, display: "flex", gap: 6, alignItems: "center" }}>
      {[6, 9, 12].map((h, i) => <div key={i} style={{ width: 4, height: h, borderRadius: 1, background: dark ? C.white : C.ink, alignSelf: "flex-end" }} />)}
      <div style={{ width: 26, height: 12, borderRadius: 4, border: `1.5px solid ${dark ? C.white : C.ink}`, padding: 1.5, boxSizing: "border-box", marginLeft: 4 }}><div style={{ width: "80%", height: "100%", borderRadius: 2, background: dark ? C.white : C.ink }} /></div>
    </div>
  </div>
);
export const TopBar: React.FC<{ xp: number; streak: number; goal?: number }> = ({ xp, streak, goal = 0 }) => (
  <div style={{ position: "absolute", left: 0, top: 48, width: SW, height: 48, zIndex: 15, background: C.bg }}>
    <div style={{ position: "absolute", left: 14, top: 12 }}><Ico n="gear" s={24} c={C.grey2} w={1.6} /></div>
    <div style={{ position: "absolute", left: 50, top: 4, width: 272, height: 40, borderRadius: 20, background: C.white, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
      <div style={{ position: "absolute", left: 14, top: 8, display: "flex", alignItems: "center", gap: 5 }}><Ico n="bolt" s={14} c={C.blue} fill={C.blue} w={1} /><span style={txt(13, 700)}>{Math.round(xp)} XP today</span></div>
      <div style={{ position: "absolute", right: 14, top: 9, display: "flex", alignItems: "center", gap: 3, ...txt(12, 600, C.blueD) }}>Goal 100{goal > 0.5 && <Ico n="check" s={12} c={C.blueD} w={2.6} />}</div>
      <div style={{ position: "absolute", left: 14, right: 14, bottom: 7, height: 3, borderRadius: 2, background: C.line }}><div style={{ width: `${Math.min(100, xp)}%`, height: "100%", borderRadius: 2, background: C.blue }} /></div>
    </div>
    <div style={{ position: "absolute", right: 14, top: 12, display: "flex", alignItems: "center", gap: 3 }}><Flame s={22} /><span style={txt(18, 800)}>{streak}</span></div>
  </div>
);
export const TabBar: React.FC<{ active: number; badge: number; bump?: number }> = ({ active, badge, bump = 0 }) => (
  <div style={{ position: "absolute", left: 0, top: 772, width: SW, height: 72, zIndex: 15, background: C.white, borderTop: `1px solid ${C.line}` }}>
    {[["home", "Home"], ["cards", "Cards"], ["quiz", "Quiz"], ["user", "Profile"]].map(([n, l], i) => (
      <div key={l} style={{ position: "absolute", left: 49 + i * 97.5 - 30, top: 8, width: 60, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
        <Ico n={n} s={25} c={active === i ? C.blue : C.grey} w={1.8} />
        <span style={txt(10, 600, active === i ? C.blue : C.grey)}>{l}</span>
        {i === 1 && <div style={{ position: "absolute", left: 34, top: -6, minWidth: 22, height: 18, padding: "0 5px", borderRadius: 9, background: C.red, boxSizing: "border-box",
          display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${1 + 0.35 * bump})`, ...txt(11, 700, C.white) }}>{badge}</div>}
      </div>
    ))}
    <div style={{ position: "absolute", left: SW / 2 - 67, bottom: 8, width: 134, height: 5, borderRadius: 3, background: C.ink }} />
  </div>
);

// ---- the feed ---------------------------------------------------------------------------------------------------------
export type Line = [string, string];
export type Page = { clip: string; at: number; offset: number; pos?: string; lines: Line[] };
/** A clip that plays from film second `at` (its first visible moment), starting `offset` seconds into the file. */
export const Clip: React.FC<{ src: string; at: number; offset: number; pos?: string }> = ({ src, at, offset, pos = "50% 40%" }) => (
  <Sequence from={Math.round(at * 30)} layout="none">
    <OffthreadVideo src={staticFile("footage/" + src)} startFrom={Math.round(offset * 30)} muted
      style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: pos }} />
  </Sequence>
);
export type Extra = {
  cur?: number;                                    // the current line (fractional while the list scrolls)
  hi?: { line: number; word: string; pulse: number; tapped: number };
  swipe?: { line: number; x: number };
  heart?: number;
};
const lineY = (i: number, cur: number) => 18 + (i - Math.max(0, cur - 1)) * 68;
/** The words of a line laid out, so a word's box is known (for the tap). */
export const wordBox = (line: string, word: string) => {
  const i = line.indexOf(word); const x = measure(line.slice(0, i), 16, 650, -0.01); return { x, w: measure(word, 16, 650, -0.01) };
};
export const lineTop = (i: number, cur: number) => PAGE.video + lineY(i, cur);
const Transcript: React.FC<{ lines: Line[]; ex: Extra }> = ({ lines, ex }) => {
  const cur = ex.cur ?? 0;
  return (
    <div style={{ position: "absolute", left: 0, top: PAGE.video, width: SW, height: PAGE.h - PAGE.video, overflow: "hidden", background: C.bg }}>
      <div style={{ position: "absolute", left: SW / 2 - 18, top: 6, width: 36, height: 4, borderRadius: 2, background: C.grey3 }} />
      {lines.map((l, i) => {
        const on = Math.max(0, 1 - Math.abs(i - cur));
        const sx = ex.swipe && ex.swipe.line === i ? ex.swipe.x : 0;
        const hi = ex.hi && ex.hi.line === i ? ex.hi : null;
        const wb = hi ? wordBox(l[0], hi.word) : null;
        return (
          <div key={i} style={{ position: "absolute", left: 12 + sx, top: lineY(i, cur), width: SW - 24, height: 62, borderRadius: 12, background: `rgba(227,241,251,${on})`, boxSizing: "border-box", padding: "9px 12px" }}>
            <div style={{ position: "relative", ...txt(16, 650, on > 0.5 ? C.ink : C.grey2) }}>
              {l[0]}
              {hi && wb && <>
                <div style={{ position: "absolute", left: wb.x - 3, top: -2, width: wb.w + 6, height: 24, borderRadius: 6, background: `rgba(47,175,238,${0.18 * hi.pulse + 0.25 * hi.tapped})` }} />
                <div style={{ position: "absolute", left: wb.x, top: 0, ...txt(16, 650, hi.tapped > 0.5 ? C.blueD : C.ink) }}>{hi.word}</div>
                <div style={{ position: "absolute", left: wb.x, top: 21, width: wb.w, height: 2, borderRadius: 1, background: C.blue, opacity: Math.max(hi.pulse, hi.tapped) }} />
              </>}
            </div>
            <div style={{ marginTop: 4, ...txt(13.5, 500, on > 0.5 ? C.grey2 : C.grey3) }}>{l[1]}</div>
          </div>
        );
      })}
    </div>
  );
};
const VideoBox: React.FC<{ page: Page; heart?: number }> = ({ page, heart = 0 }) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: SW, height: PAGE.video, background: "#000", overflow: "hidden" }}>
    <Clip src={page.clip} at={page.at} offset={page.offset} pos={page.pos} />
    <div style={{ position: "absolute", left: 0, top: 0, width: SW, height: 70, background: "linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0))" }} />
    <div style={{ position: "absolute", left: 0, top: 14, width: SW, display: "flex", justifyContent: "center", gap: 10, ...txt(14, 700, C.white), textShadow: "0 1px 3px rgba(0,0,0,0.4)" }}>
      <span style={{ borderBottom: "2px solid #fff", paddingBottom: 2 }}>For you</span><span style={{ opacity: 0.5 }}>|</span><span style={{ opacity: 0.75, fontWeight: 600 }}>Discover</span>
    </div>
    <div style={{ position: "absolute", right: 14, top: 196, display: "flex", flexDirection: "column", alignItems: "center", gap: 18, filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.5))" }}>
      <div style={{ transform: `scale(${1 + 0.4 * Math.sin(Math.PI * Math.min(1, heart * 1.3))})` }}><Ico n="heart" s={28} c={heart > 0.2 ? C.red : C.white} fill={heart > 0.2 ? C.red : "none"} w={2} /></div>
      <Ico n="bookmark" s={26} c={C.white} w={2} />
      <Ico n="flag" s={26} c={C.white} w={2} />
      <span style={txt(13, 700, C.white)}>1.00x</span>
    </div>
  </div>
);
/** A vertical feed of pages scrolled by `offset` (in pages); only visible pages are mounted. */
export const Feed: React.FC<{ pages: Page[]; offset: number; ex?: Extra; exPage?: number; lesson?: React.ReactNode }> = ({ pages, offset, ex = {}, exPage = -1, lesson }) => (
  <div style={{ position: "absolute", left: 0, top: PAGE.top, width: SW, height: PAGE.h, overflow: "hidden", background: C.bg }}>
    {lesson && offset < 1 && <div style={{ position: "absolute", left: 0, top: -offset * PAGE.h, width: SW, height: PAGE.h }}>{lesson}</div>}
    {pages.map((p, i) => {
      const y = ((lesson ? 1 : 0) + i - offset) * PAGE.h;
      if (y <= -PAGE.h || y >= PAGE.h) return null;
      return (
        <div key={i} style={{ position: "absolute", left: 0, top: y, width: SW, height: PAGE.h }}>
          <VideoBox page={p} heart={i === exPage ? ex.heart : 0} />
          <Transcript lines={p.lines} ex={i === exPage ? ex : { cur: 0 }} />
        </div>
      );
    })}
  </div>
);

// ---- the lesson we leave behind ------------------------------------------------------------------------------------------
export const Lesson: React.FC<{ g: number; mark: number; study?: boolean }> = ({ g, mark, study }) => {
  const secs = 25 * 60 - 2 - Math.floor(g / 30);
  // studying: the page scrolls as it is read and the rows are highlighted one after another
  const scroll = study ? 120 * Math.min(1, g / (T.f("flick") + 6)) : 0;
  const hl = (i: number) => (study ? Math.min(1, Math.max(0, (g - 8 - i * 14) / 10)) : i === 1 ? mark : 0);
  const rows: Line[] = [["yo", "hablo"], ["tú", "hablas"], ["él / ella", "habla"], ["nosotros", "hablamos"], ["vosotros", "habláis"], ["ellos", "hablan"]];
  return (
    <div style={{ position: "absolute", inset: 0, background: C.white, overflow: "hidden" }}>
     <div style={{ position: "absolute", left: 0, top: -scroll, width: SW, height: 900 }}>
      <div style={{ position: "absolute", left: 20, top: 16, ...txt(24, 800) }}>Lesson 4</div>
      <div style={{ position: "absolute", left: 20, top: 48, ...txt(14, 500, C.grey) }}>Present tense · regular verbs</div>
      <div style={{ position: "absolute", right: 18, top: 20, display: "flex", alignItems: "center", gap: 5, ...txt(15, 700, C.grey2) }}>
        <Ico n="timer" s={17} c={C.grey2} w={2} />{String(Math.floor(secs / 60)).padStart(2, "0")}:{String(secs % 60).padStart(2, "0")}
      </div>
      <div style={{ position: "absolute", left: 20, right: 20, top: 78, height: 5, borderRadius: 3, background: C.line }}><div style={{ width: "17%", height: "100%", borderRadius: 3, background: C.grey3 }} /></div>
      <div style={{ position: "absolute", left: 20, right: 20, top: 104, borderRadius: 14, border: `1px solid ${C.line}`, padding: "12px 16px" }}>
        <div style={{ ...txt(13, 700, C.grey), letterSpacing: "0.06em" }}>VERB TABLE · HABLAR</div>
        {rows.map((r, i) => (
          <div key={i} style={{ position: "relative", display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: i < 5 ? `1px solid ${C.line}` : "none" }}>
            {hl(i) > 0 && <div style={{ position: "absolute", left: -6, top: 4, height: 30, width: `${100 * hl(i)}%`, background: "rgba(255,214,10,0.45)", borderRadius: 4 }} />}
            <span style={{ position: "relative", ...txt(16, 500, C.grey2) }}>{r[0]}</span><span style={{ position: "relative", ...txt(16, 700) }}>{r[1]}</span>
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: 20, top: 432, ...txt(13, 700, C.grey), letterSpacing: "0.06em" }}>EXERCISE 1 · FILL IN THE BLANKS</div>
      {["Yo ______ español. (hablar)", "Tú ______ mucho. (hablar)", "Ellos ______ rápido. (hablar)", "Nosotros ______ inglés. (hablar)", "Ella ______ con su madre. (hablar)"].map((s, i) => (
        <div key={i} style={{ position: "absolute", left: 20, right: 20, top: 462 + i * 54, height: 44, borderRadius: 10, background: C.bg, display: "flex", alignItems: "center", padding: "0 14px", ...txt(15, 500, C.grey2) }}>{i + 1}. {s}</div>
      ))}
     </div>
    </div>
  );
};

// ---- the word card, the breakdown ----------------------------------------------------------------------------------------
export const WordCard: React.FC<{ saved: number; tr: number; w?: number; scale?: number; word?: string; mean?: string; kind?: string; def?: string }> = ({ saved, tr, w = 330, scale = 1, word = "famoso", mean = "famous", kind = "ADJECTIVE", def = "well known by many people" }) => {
  const s = scale;
  return (
    <div style={{ width: w * s, borderRadius: 16 * s, background: C.white, boxShadow: `0 ${10 * s}px ${30 * s}px rgba(0,0,0,0.22)`, padding: `${14 * s}px ${16 * s}px ${16 * s}px`, boxSizing: "border-box", position: "relative" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 * s }}><span style={txt(22 * s, 800)}>{word}</span><Ico n="speaker" s={18 * s} c={C.blue} w={2} /></div>
      <div style={{ position: "absolute", right: 14 * s, top: 13 * s, height: 30 * s, padding: `0 ${12 * s}px`, borderRadius: 15 * s, background: saved > 0.5 ? C.ink : C.blue, display: "flex", alignItems: "center", gap: 4 * s, ...txt(14 * s, 700, C.white) }}>
        {saved > 0.5 ? <><Ico n="check" s={14 * s} c={C.white} w={3} />Saved</> : <>+ Save</>}
      </div>
      <div style={{ marginTop: 4 * s, height: 22 * s, ...txt(16 * s, 500, C.grey2), opacity: tr, transform: `translateY(${(1 - tr) * 6 * s}px)` }}>{mean}</div>
      <div style={{ marginTop: 8 * s, display: "flex", alignItems: "center", gap: 8 * s, opacity: tr }}>
        <span style={{ border: `1.5px solid ${C.green}`, borderRadius: 6 * s, padding: `${2 * s}px ${7 * s}px`, ...txt(11 * s, 800, C.greenD), letterSpacing: "0.06em" }}>{kind}</span>
        <span style={txt(13 * s, 500, C.grey2)}>{def}</span>
      </div>
    </div>
  );
};
export const Breakdown: React.FC<{ g: number; scale?: number }> = ({ g, scale = 1 }) => {
  const s = scale, e1 = k(g, "ex1", 0.4), e2 = k(g, "ex2", 0.4);
  const items = [
    [e1, "The question word qué starts the sentence; the verb está follows."],
    [e2, "está pasando is estar + the gerund: something happening right now."],
  ] as [number, string][];
  return (
    <div style={{ width: 346 * s, borderRadius: 18 * s, background: C.white, boxShadow: `0 ${10 * s}px ${30 * s}px rgba(0,0,0,0.25)`, padding: `${16 * s}px ${18 * s}px ${18 * s}px`, boxSizing: "border-box", position: "relative" }}>
      <Ico n="close" s={18 * s} c={C.grey2} w={2} />
      <div style={{ position: "absolute", right: 16 * s, top: 12 * s, height: 28 * s, padding: `0 ${11 * s}px`, borderRadius: 14 * s, background: C.blue, display: "flex", alignItems: "center", ...txt(13 * s, 700, C.white) }}>+ Save</div>
      <div style={{ marginTop: 10 * s, display: "flex", alignItems: "center", gap: 8 * s }}><span style={txt(21 * s, 800)}>¿Qué está pasando aquí?</span><Ico n="speaker" s={17 * s} c={C.blue} w={2} /></div>
      <div style={{ marginTop: 4 * s, ...txt(15 * s, 500, C.grey2, { fontStyle: "italic" }) }}>What's going on here?</div>
      <div style={{ margin: `${12 * s}px 0`, height: 1, background: C.line }} />
      <div style={{ ...txt(11.5 * s, 700, C.grey), letterSpacing: "0.08em" }}>EXPLANATION</div>
      {items.map(([v, t], i) => (
        <div key={i} style={{ marginTop: 8 * s, display: "flex", gap: 8 * s, opacity: v, transform: `translateY(${(1 - v) * 8 * s}px)` }}>
          <span style={txt(14 * s, 700, C.blue)}>{i + 1}.</span><span style={txt(14 * s, 500, C.ink, { whiteSpace: "normal", lineHeight: 1.4 })}>{t}</span>
        </div>
      ))}
    </div>
  );
};

// ---- Cards and Quiz --------------------------------------------------------------------------------------------------
export const FlashCard: React.FC<{ flip: number; got: number; scale?: number; w?: number }> = ({ flip, got, scale = 1, w = 354 }) => {
  const s = scale, back = flip >= 0.5, sx = Math.abs(Math.cos(flip * Math.PI));
  return (
    <div style={{ width: w * s, height: 400 * s, position: "relative", transform: `scaleX(${Math.max(0.02, sx)})` }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: 22 * s, background: C.white, boxShadow: `0 ${8 * s}px ${24 * s}px rgba(0,0,0,0.12)`, border: got > 0 ? `${3 * s}px solid rgba(52,199,89,${got})` : "none", boxSizing: "border-box", padding: `${24 * s}px ${22 * s}px` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 * s }}><span style={txt(36 * s, 800)}>famoso</span><Ico n="speaker" s={22 * s} c={C.blue} w={2} /></div>
        {!back ? (
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 28 * s, textAlign: "center", ...txt(15 * s, 600, C.grey) }}>Tap to reveal</div>
        ) : <>
          <div style={{ marginTop: 4 * s, ...txt(22 * s, 600, C.blue) }}>famous</div>
          <div style={{ marginTop: 10 * s }}><span style={{ border: `1.5px solid ${C.green}`, borderRadius: 6 * s, padding: `${2 * s}px ${7 * s}px`, ...txt(11 * s, 800, C.greenD), letterSpacing: "0.06em" }}>ADJECTIVE</span></div>
          <div style={{ marginTop: 18 * s, ...txt(11.5 * s, 700, C.grey), letterSpacing: "0.08em" }}>IN CONTEXT</div>
          <div style={{ marginTop: 8 * s, borderRadius: 14 * s, background: C.bg, padding: `${12 * s}px ${14 * s}px` }}>
            <div style={txt(16 * s, 650, C.ink, { whiteSpace: "normal" })}>Es el más <span style={{ color: C.blueD }}>famoso</span> de toda la ciudad.</div>
            <div style={{ marginTop: 6 * s, ...txt(13.5 * s, 500, C.grey2, { whiteSpace: "normal" }) }}>It's the most famous one in the whole city.</div>
          </div>
        </>}
      </div>
    </div>
  );
};
export const CardsScreen: React.FC<{ g: number }> = ({ g }) => {
  const flip = k(g, "flip", 0.4), got = k(g, "gotit", 0.3);
  return (
    <div style={{ position: "absolute", left: 0, top: 48, width: SW, height: 724, background: C.bg }}>
      <div style={{ position: "absolute", left: 14, top: 14 }}><Ico n="back" s={26} c={C.blue} w={2.2} /></div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 12, textAlign: "center", ...txt(18, 700) }}>Words</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 36, textAlign: "center", ...txt(13, 500, C.grey) }}>1 of 15 · 14 left</div>
      <div style={{ position: "absolute", right: 14, top: 14 }}><Ico n="list" s={24} c={C.blue} w={2} /></div>
      <div style={{ position: "absolute", left: 14, right: 14, top: 64, height: 4, borderRadius: 2, background: C.line }}><div style={{ width: "7%", height: "100%", background: C.blue, borderRadius: 2 }} /></div>
      <div style={{ position: "absolute", left: 18, top: 92 }}><FlashCard flip={flip} got={got} /></div>
      <div style={{ position: "absolute", left: 18, right: 18, top: 512, display: "flex", gap: 12 }}>
        <div style={{ flex: 1, height: 52, borderRadius: 14, background: C.redSoft, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, ...txt(16, 700, C.red) }}><Ico n="close" s={16} c={C.red} w={2.6} />Forgot</div>
        <div style={{ flex: 1, height: 52, borderRadius: 14, background: got > 0.5 ? C.green : C.greenSoft, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, ...txt(16, 700, got > 0.5 ? C.white : C.greenD) }}><Ico n="check" s={16} c={got > 0.5 ? C.white : C.greenD} w={2.6} />Got it</div>
      </div>
    </div>
  );
};
export const QuizScreen: React.FC<{ g: number }> = ({ g }) => {
  const pick = k(g, "pick", 0.3), plus = k(g, "pick+0.15", 0.4);
  return (
    <div style={{ position: "absolute", left: 0, top: 48, width: SW, height: 724, background: C.bg }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 12, textAlign: "center", ...txt(18, 700) }}>Quiz</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 36, textAlign: "center", ...txt(13, 500, C.grey) }}>Question 3 of 10</div>
      <div style={{ position: "absolute", left: 14, right: 14, top: 64, height: 4, borderRadius: 2, background: C.line }}><div style={{ width: "30%", height: "100%", background: C.blue, borderRadius: 2 }} /></div>
      <div style={{ position: "absolute", left: 22, top: 104, ...txt(14, 700, C.grey), letterSpacing: "0.06em" }}>WHAT DOES THIS MEAN?</div>
      <div style={{ position: "absolute", left: 22, top: 130, display: "flex", alignItems: "center", gap: 10 }}><span style={txt(38, 800)}>famoso</span><Ico n="speaker" s={24} c={C.blue} w={2} /></div>
      {["funny", "famous", "hungry", "far away"].map((o, i) => {
        const on = i === 1 ? pick : 0;
        return (
          <div key={o} style={{ position: "absolute", left: 18, right: 18, top: 210 + i * 70, height: 58, borderRadius: 14, background: on > 0.5 ? C.greenSoft : C.white, border: `2px solid ${on > 0.5 ? C.green : C.line}`, boxSizing: "border-box",
            display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 18px", ...txt(18, 600, on > 0.5 ? C.greenD : C.ink) }}>
            {o}{on > 0.5 && <Ico n="check" s={20} c={C.greenD} w={3} />}
          </div>
        );
      })}
      {plus > 0 && <div style={{ position: "absolute", left: SW / 2 - 60, top: 500 - 20 * plus, width: 120, height: 40, borderRadius: 20, background: C.blue, opacity: Math.min(1, plus * 2), display: "flex", alignItems: "center", justifyContent: "center", gap: 4, ...txt(16, 800, C.white) }}><Ico n="bolt" s={15} c={C.white} fill={C.white} w={1} />+10 XP</div>}
    </div>
  );
};
export const lineWord = (line: string, word: string) => wordBox(line, word);
export const lerpN = lerp;
export const MOVE_ = MOVE;
export const FONT = F.sans;
