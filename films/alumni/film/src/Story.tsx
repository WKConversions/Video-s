// Alumni — "Your next chapter starts abroad". One continuous stage on the gradient canvas; every phrase of the
// voice-over gets its own visual on its key word (storyboard/plan.md). The thread: one line in the logo's orange →
// green that leaves the finished internship, becomes the AL, runs as the cables, and ends between "experience"
// and "opportunity".
import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { T } from "./clock";
import { ARRIVE, C, DEPART, GROW, GRAD, MOVE, SMALLPOP, clamp01, mix } from "./lib";
import { Avatar, Box, Cable, Chip, Eyebrow, Grad, Grain, Icon, Mesh, Skel, Win, glass, pointAt } from "./saas";
import { breathe, off } from "./kinetic";

const k = (g: number, at: string | number, dur: number, ease = ARRIVE) => T.k(g, at, dur, ease);
const f = (at: string | number) => T.f(at);
/** a slow constant drift that eases in over 0.4 s (a "working hold": content keeps moving while it holds) */
const drift = (g: number, from: string | number, pps: number) => {
  const t = (g - f(from)) / 30; if (t <= 0) return 0; return pps * (t < 0.4 ? (t * t) / 0.8 : t - 0.2);
};

/* ---------- words: a line built word by word (rise, fade, de-blur), leaving with a lift ---------- */
type Wd = { t: string; at: string; grad?: boolean; color?: string };
const Words: React.FC<{ g: number; words: Wd[]; x?: number; y: number; size: number; weight?: number; center?: boolean; out?: string; color?: string; ls?: number }> = ({
  g, words, x = 0, y, size, weight = 900, center, out, color = C.ink, ls = -0.025 }) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: center ? 1920 : undefined, display: "flex", justifyContent: center ? "center" : "flex-start",
    gap: size * 0.24, whiteSpace: "nowrap", transform: `translate(${center ? x : x}px, ${y}px)`, fontFamily: C.font, fontWeight: weight, fontSize: size,
    lineHeight: 1.08, letterSpacing: `${ls}em`, color }}>
    {words.map((w, i) => {
      const kk = k(g, w.at, 0.45);
      const o = out ? k(g, off(out, i * 0.03), 0.32, DEPART) : 0;
      if (kk <= 0) return <span key={i} style={{ opacity: 0 }}>{w.t}</span>;
      return (
        <span key={i} style={{ display: "inline-block", opacity: Math.min(1, kk * 1.6) * (1 - o), color: w.color,
          transform: `translateY(${((1 - kk) * 0.35 - o * 0.35) * size}px)`, filter: kk < 1 || o > 0 ? `blur(${(1 - kk) * 8 + o * 8}px)` : undefined }}>
          {w.grad ? <Grad k={k(g, off(w.at, 0.2), 0.8, MOVE)}>{w.t}</Grad> : w.t}
        </span>
      );
    })}
  </div>
);

/* ---------- the AL monogram in its three layers (orange A, lime stem, green foot), drawn by k ---------- */
const LOGO_W = 1058, LOGO_H = 653;
const AL: React.FC<{ x: number; y: number; h: number; a: number; l: number; foot: number; o?: number }> = ({ x, y, h, a, l, foot, o = 1 }) => {
  const w = (h * LOGO_W) / LOGO_H;
  const layer = (src: string, clip: string, extra?: React.CSSProperties) => (
    <Img src={staticFile(src)} style={{ position: "absolute", left: 0, top: 0, width: w, height: h, clipPath: clip, ...extra }} />
  );
  // the A climbs: revealed from its left foot up to the apex and down the right leg (a sweep from left to right
  // with the left side rising first); the L's stem drops, then its foot runs to the right
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: w, height: h, opacity: o, transform: `translate(${x - w / 2}px, ${y - h / 2}px)` }}>
      {layer("img/al-orange.png", a >= 1 ? "none" : `inset(${mix(100, 0, clamp01(a * 1.35))}% ${mix(100, 40, a)}% 0% 0%)`)}
      {layer("img/al-lime.png", l >= 1 ? "none" : `inset(0% 0% ${mix(100, 0, l)}% 0%)`)}
      {layer("img/al-green.png", foot >= 1 ? "none" : `inset(0% ${mix(100, 0, foot)}% 0% 0%)`)}
    </div>
  );
};

/** A photo inside a window or tile (the style's only place for imagery): a crop with a slow push and pan. */
const Shot: React.FC<{ src: string; w: number | string; h: number | string; pos: string; zoom: number; px?: number; py?: number; r?: number; style?: React.CSSProperties; children?: React.ReactNode }> = ({
  src, w, h, pos, zoom, px = 0, py = 0, r = 18, style, children }) => (
  <div style={{ position: "absolute", width: w, height: h, borderRadius: r, overflow: "hidden", ...style }}>
    <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: pos, transform: `translate(${px}px, ${py}px) scale(${zoom})` }} />
    {children}
  </div>
);
const SPLIT = "img/career-abroad.jpg", LISBON = "img/new-perspectives.jpg";

/* ---------- 1 · hook: the internship completes, and the line keeps going ---------- */
const INTERN = { x: 1390, y: 560, w: 760, h: 440 };
const Hook: React.FC<{ g: number }> = ({ g }) => {
  if (g > f("meet+0.3")) return null;
  const win = k(g, "w:your", 0.6);
  const leave = k(g, "ask-0.25", 0.5, DEPART);
  const fill = mix(0.42, 1, k(g, "w:internship", 1.5, MOVE));        // the bar fills to 100% by "beginning"
  const done = k(g, "w:beginning-0.05", 0.4, SMALLPOP);
  const dx = drift(g, "w:your", 55);
  const wx = INTERN.x - dx - leave * 700, wy = INTERN.y - (1 - win) * 60;
  // the bar's end: in frame coordinates (the bar sits 60 px in from the window's left, 250 px down)
  const bx0 = wx - INTERN.w / 2 + 60, by = wy - INTERN.h / 2 + 277, bw = INTERN.w - 120;
  const run = k(g, "w:beginning+0.15", 0.8, MOVE);                    // past 100%: the line runs on out of the card
  return (
    <AbsoluteFill>
      <Words g={g} x={150 + drift(g, "w:your", 40)} y={250} size={98} out="ask-0.3" words={[{ t: "Your", at: "w:your" }, { t: "internship", at: "w:internship" }]} />
      <Words g={g} x={150 + drift(g, "w:your", 40)} y={362} size={98} out="ask-0.25" words={[{ t: "was", at: "w:was" }, { t: "just", at: "w:just" }]} />
      <Words g={g} x={150 + drift(g, "w:your", 40)} y={474} size={98} out="ask-0.2" words={[{ t: "the", at: "w:the", grad: true }, { t: "beginning.", at: "w:beginning", grad: true }]} />
      <Win x={wx} y={wy} w={INTERN.w} h={INTERN.h} o={win * (1 - leave)} s={0.92 + 0.08 * win} blur={leave * 10} title="Internship" glow={C.lime}>
        <Shot src={LISBON} w={250} h={170} pos="30% 70%" zoom={1.18 + drift(g, "w:your", 0.12)} px={-drift(g, "w:your", 30)} r={16} style={{ left: 40, top: 74 }} />
        <div style={{ position: "absolute", left: 318, top: 92 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}><Icon name="briefcase" size={34} color={C.deep} /><Eyebrow text="Your internship" size={17} /></div>
          <Skel w={300} h={16} style={{ marginTop: 18 }} /><Skel w={220} h={12} style={{ marginTop: 12 }} /><Skel w={260} h={12} style={{ marginTop: 10 }} />
        </div>
        <div style={{ position: "absolute", left: 60, top: 270, width: bw, height: 14, borderRadius: 6, background: "rgba(20,48,38,0.08)" }} />
        <div style={{ position: "absolute", left: 60, top: 270, width: bw * fill, height: 14, borderRadius: 7, background: `linear-gradient(90deg, ${GRAD})`, backgroundSize: `${bw}px 14px` }} />
        <div style={{ position: "absolute", left: 60, top: 312, fontFamily: C.font, fontWeight: 700, fontSize: 22, color: C.muted }}>{Math.round(fill * 100)}%</div>
        <div style={{ position: "absolute", right: 60, top: 304, transform: `scale(${done})`, transformOrigin: "100% 50%" }}><Chip text="Completed" size={20} on={1} icon={<Icon name="check" size={20} color="#FFFFFF" sw={3} />} /></div>
      </Win>
      {/* the line runs on past the end of the bar, out of the card and up: the beginning */}
      <Cable id="hookrun" d={`M ${bx0 + bw} ${by + 6} C ${bx0 + bw + 160} ${by + 6}, ${bx0 + bw + 200} ${by - 220}, ${bx0 + bw + 420} ${by - 420}`} k={run * (1 - leave)} w={6} orb={run > 0.05 && run < 1 ? run : undefined} />
    </AbsoluteFill>
  );
};

/* ---------- 2 · what comes next: a search bar types the question ---------- */
const Ask: React.FC<{ g: number }> = ({ g }) => {
  if (g < f("ask-0.3") || g > f("meet+0.9")) return null;
  const inn = k(g, "ask+0.1", 0.55);
  const shrink = k(g, "meet-0.05", 0.45, MOVE);                         // the bar closes into the mark on "Meet"
  const q = "What comes next?";
  const typed = Math.max(0, Math.min(q.length, Math.floor(((g - f("w:so")) / 30) * 15.5)));
  const w = mix(1000, 130, shrink), h = 130, x = 960 - drift(g, "ask", 30) * (1 - shrink), y = 520 - drift(g, "ask", 22);
  const sug = [{ i: "globe", t: "Working abroad" }, { i: "briefcase", t: "A new career" }, { i: "users", t: "A new colleague" }];
  return (
    <AbsoluteFill>
      <Box x={x} y={y + (1 - inn) * 80} w={w} h={h} r={65} s={0.9 + 0.1 * inn} o={inn * (1 - k(g, "meet+0.25", 0.3, DEPART))} style={{ ...glass(C.orange), overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 44, top: 41, opacity: 1 - shrink }}><Icon name="search" size={48} color={C.deep} sw={3} /></div>
        <div style={{ position: "absolute", left: 118, top: 30, fontFamily: C.font, fontWeight: 700, fontSize: 60, color: C.ink, whiteSpace: "nowrap", letterSpacing: "-0.01em", opacity: 1 - shrink * 2 }}>
          {q.slice(0, typed)}<span style={{ display: "inline-block", width: 4, height: 62, marginLeft: 6, verticalAlign: "-8px", background: C.orange, opacity: Math.floor(g / 8) % 2 ? 1 : 0.15 }} />
        </div>
      </Box>
      {sug.map((sg, i) => {
        const a = k(g, off("w:comes", i * 0.12), 0.45), b = k(g, "meet-0.15", 0.3, DEPART);
        return (
          <Box key={i} x={960 - 210 + i * 30 + drift(g, "w:comes", 50 + i * 16)} y={y + 140 + i * 82 + (1 - a) * 40} w={700} h={64} r={20} o={a * (1 - b) * (0.95 - i * 0.18)} style={{ ...glass(C.lime, 0.85) }}>
            <div style={{ position: "absolute", left: 22, top: 13 }}><Icon name={sg.i} size={36} color={C.muted} /></div>
            <div style={{ position: "absolute", left: 80, top: 14, fontFamily: C.font, fontWeight: 700, fontSize: 30, color: C.muted, whiteSpace: "nowrap" }}>{sg.t}</div>
          </Box>
        );
      })}
    </AbsoluteFill>
  );
};

/* ---------- 3 · Meet Alumni: the AL draws itself, the name lands ---------- */
const MEET_LOGO = { x: 645, y: 520, h: 250 };
const Meet: React.FC<{ g: number }> = ({ g }) => {
  if (g < f("meet") || g >= f("connect+0.7")) return null;
  const a = k(g, "meet+0.1", 0.55, GROW), l = k(g, "meet+0.38", 0.4, MOVE), foot = k(g, "meet+0.58", 0.4, MOVE);
  const name = k(g, "w:alumni-0.05", 0.5);
  const toHub = k(g, "connect", 0.7, MOVE);                            // into the hub tile of the next line
  const hx = mix(MEET_LOGO.x, 960, toHub), hy = mix(MEET_LOGO.y, 600, toHub), hh = mix(MEET_LOGO.h, 104, toHub);
  const push = 1 + drift(g, "meet+0.5", 0.1) * (1 - toHub);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `scale(${push})`, transformOrigin: "960px 540px" }}>
        <AL x={hx} y={hy} h={hh} a={a} l={l} foot={foot} />
        <div style={{ position: "absolute", left: 0, top: 0, transform: `translate(${MEET_LOGO.x + 250}px, ${MEET_LOGO.y - 95 + (1 - name) * 30}px)`, opacity: name * (1 - k(g, "connect", 0.3, DEPART)),
          fontFamily: C.font, fontWeight: 900, fontSize: 168, letterSpacing: "-0.035em", color: C.ink, filter: name < 1 ? `blur(${(1 - name) * 10}px)` : undefined }}>Alumni</div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- 4 · connecting graduates with international career opportunities: the hub ---------- */
const HUB = { x: 960, y: 600 };
const GRADT = { x: 400, y: 600, w: 360, h: 210 };
const OPPS = [
  { x: 1520, y: 350, img: "img/career-abroad.jpg", pos: "60% 40%", at: "w:international" },
  { x: 1570, y: 612, img: "img/new-perspectives.jpg", pos: "50% 60%", at: "w:career" },
  { x: 1520, y: 874, img: "img/career-abroad.jpg", pos: "88% 80%", at: "w:opportunities" },
];
const Connect: React.FC<{ g: number }> = ({ g }) => {
  if (g < f("connect") || g > f("start+1.0")) return null;
  const hub = k(g, "connect+0.2", 0.5);
  const leave = k(g, "start", 0.5, DEPART);                          // hub and opportunities step back for the profile
  const gt = k(g, "w:graduates-0.1", 0.5);
  const d = drift(g, "connect", 42);
  const gx = GRADT.x + d * 0.6 - leave * 0, gy = GRADT.y;
  const c0 = k(g, "w:graduates+0.1", 0.55, MOVE);
  return (
    <AbsoluteFill style={{ opacity: 1 }}>
      <Words g={g} x={-d * 0.6} y={92} size={66} center out="start-0.1" words={[{ t: "Connecting", at: "w:connecting" }, { t: "graduates", at: "w:graduates" }, { t: "with", at: "w:with" }]} />
      <Words g={g} x={-d * 0.6} y={172} size={66} center out="start-0.05" words={[{ t: "international", at: "w:international", grad: true }, { t: "career", at: "w:career", grad: true }, { t: "opportunities.", at: "w:opportunities", grad: true }]} />
      {/* cables: graduate → hub → each opportunity, an orb travelling along each */}
      <Cable id="c-g" d={`M ${gx + GRADT.w / 2} ${gy} C ${gx + 330} ${gy}, ${HUB.x - 260} ${HUB.y}, ${HUB.x - 120} ${HUB.y}`} k={c0} w={4} o={1 - leave}
        orb={c0 >= 1 ? ((g - f("w:graduates+0.65")) / 36) % 1 : undefined} />
      {OPPS.map((o, i) => {
        const ck = k(g, off(o.at, -0.05), 0.5, MOVE);
        const ox = o.x - d * (1 + i * 0.3) + (1 - k(g, o.at, 0.55)) * 300;
        const path = `M ${HUB.x + 120} ${HUB.y} C ${HUB.x + 300} ${HUB.y}, ${ox - 440} ${o.y}, ${ox - 235} ${o.y}`;
        return <Cable key={i} id={`c-o${i}`} d={path} k={ck} w={4} o={1 - leave} orb={ck >= 1 ? ((g - f(off(o.at, 0.5)) + i * 9) / 33) % 1 : undefined} />;
      })}
      {/* the graduate */}
      <Box x={gx} y={gy + (1 - gt) * 40} w={GRADT.w} h={GRADT.h} r={26} s={0.85 + 0.15 * gt} o={gt * (1 - leave)} style={{ ...glass(C.green) }}>
        <div style={{ position: "absolute", left: 30, top: 34, width: 84, height: 84, borderRadius: 24, background: "#E8F4EC", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="cap" size={52} color={C.green} /></div>
        <div style={{ position: "absolute", left: 136, top: 40, fontFamily: C.font, fontWeight: 900, fontSize: 36, color: C.ink }}>Graduates</div>
        <Skel w={150} h={13} style={{ position: "absolute", left: 138, top: 92 }} />
        <div style={{ position: "absolute", left: 30, top: 140, display: "flex", gap: 8 }}><Chip text="Internship experience" size={18} icon={<Icon name="check" size={18} color={C.green} sw={3} />} /></div>
      </Box>
      {/* the hub: Alumni */}
      <Box x={HUB.x} y={HUB.y} w={240} h={240} r={56} s={0.8 + 0.2 * hub} o={hub * (1 - leave)} style={{ ...glass(C.orange), boxShadow: `0 0 0 ${10 * Math.sin(Math.PI * clamp01((g - f("w:opportunities")) / 20))}px rgba(254,108,2,0.15), 0 30px 60px -18px rgba(254,108,2,0.4)` }}>
        {g >= f("connect+0.7") && <AL x={120} y={120} h={104} a={1} l={1} foot={1} />}
      </Box>
      {/* opportunities abroad */}
      {OPPS.map((o, i) => {
        const a = k(g, o.at, 0.55);
        const ox = o.x - d * (1 + i * 0.3) + (1 - a) * 300;
        return (
          <Win key={i} x={ox} y={o.y} w={470} h={226} o={a * (1 - leave)} s={0.85 + 0.15 * a} blur={(1 - a) * 8} glow={[C.orange, C.lime, C.green][i]}>
            <Shot src={o.img} w={200} h={150} pos={o.pos} zoom={1.15 + drift(g, o.at, 0.12)} px={-drift(g, o.at, 22)} r={16} style={{ left: 20, top: 62 }} />
            <div style={{ position: "absolute", left: 240, top: 74, display: "flex", alignItems: "center", gap: 10 }}><Icon name="briefcase" size={32} color={C.deep} /><Skel w={150} h={14} /></div>
            <Skel w={190} h={11} style={{ position: "absolute", left: 242, top: 124 }} />
            <div style={{ position: "absolute", left: 240, top: 152 }}><Chip text="Abroad" size={18} icon={<Icon name="globe" size={19} color={C.deep} sw={2.6} />} /></div>
          </Win>
        );
      })}
    </AbsoluteFill>
  );
};

/* ---------- 5 · start with your experience, your ambitions, and where you want to go: the profile ---------- */
const PROF = { x: 960, y: 560, w: 1300, h: 820 };
const Profile: React.FC<{ g: number }> = ({ g }) => {
  if (g < f("start-0.1") || g > f("brings+1.0")) return null;
  const grow = k(g, "start", 0.65, MOVE);                            // the graduate tile opens into the profile
  const fold = k(g, "brings", 0.6, MOVE);                            // and folds back into a tile for the next line
  const gx0 = GRADT.x + drift(f("start"), "connect", 42) * 0.6;
  const cx = mix(mix(gx0, PROF.x, grow), 330, fold), cy = mix(mix(GRADT.y, PROF.y, grow), 610, fold);
  const w = mix(mix(GRADT.w, PROF.w, grow), 360, fold), h = mix(mix(GRADT.h, PROF.h, grow), 270, fold);
  const push = 1 + drift(g, "start+0.6", 0.035);
  const exp = [k(g, "w:experience", 0.4), k(g, "w:experience+0.18", 0.4)];
  const amb = ["Work abroad", "Grow in my field", "A new team"].map((_, i) => k(g, off("w:ambitions", i * 0.14), 0.45));
  const dest = k(g, "w:where", 0.5), route = k(g, "w:want", 0.6, MOVE), pick = k(g, "w:go", 0.35, SMALLPOP);
  const inner = clamp01((grow - 0.6) / 0.4) * (1 - clamp01(fold * 3));
  return (
    <AbsoluteFill style={{ opacity: 1 - clamp01((fold - 0.85) / 0.15) }}>
      <Win x={cx - drift(g, "start+0.6", 36) * (1 - fold)} y={cy} w={w} h={h} s={mix(push, 1, fold)} title={inner > 0.5 ? "Your profile" : undefined} glow={C.lime}>
        <div style={{ position: "absolute", inset: 0, opacity: inner }}>
          <Shot src={SPLIT} w={1272} h={170} pos="60% 62%" zoom={1.25 + drift(g, "start", 0.03)} px={-drift(g, "start", 34)} style={{ left: 14, top: 54 }} />
          <div style={{ position: "absolute", left: 56, top: 168 }}><Avatar i="You" size={112} hue={1} style={{ fontSize: 32, border: "5px solid #FFFFFF" }} /></div>
          <div style={{ position: "absolute", left: 196, top: 236 }}><Eyebrow text="01 · Introduce" size={18} style={{ color: C.deep }} /></div>
          <div style={{ position: "absolute", left: 196, top: 262, fontFamily: C.font, fontWeight: 900, fontSize: 44, color: C.ink, letterSpacing: "-0.02em" }}>Start with your experience.</div>
          {/* experience */}
          <div style={{ position: "absolute", left: 60, top: 330, width: 1180, height: 1, background: C.line }} />
          <div style={{ position: "absolute", left: 60, top: 352, fontFamily: C.font, fontWeight: 700, fontSize: 26, color: C.muted }}>Experience</div>
          {["Qualification", "Internship"].map((t, i) => (
            <div key={t} style={{ position: "absolute", left: 300 + i * 330, top: 338, display: "flex", alignItems: "center", gap: 14, opacity: exp[i], transform: `translateX(${(1 - exp[i]) * 40}px)` }}>
              <div style={{ width: 54, height: 54, borderRadius: 16, background: "#E8F4EC", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name={i ? "briefcase" : "cap"} size={32} color={C.green} /></div>
              <div style={{ fontFamily: C.font, fontWeight: 700, fontSize: 30, color: C.ink }}>{t}</div>
              <div style={{ width: 34, height: 34, borderRadius: 17, background: C.green, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${k(g, off("w:experience", 0.25 + i * 0.18), 0.35, SMALLPOP)})` }}><Icon name="check" size={22} color="#FFFFFF" sw={4} /></div>
            </div>
          ))}
          {/* ambitions */}
          <div style={{ position: "absolute", left: 60, top: 432, width: 1180, height: 1, background: C.line }} />
          <div style={{ position: "absolute", left: 60, top: 456, fontFamily: C.font, fontWeight: 700, fontSize: 26, color: C.muted }}>Ambitions</div>
          <div style={{ position: "absolute", left: 300, top: 444, display: "flex", gap: 14 }}>
            {["Work abroad", "Grow in my field", "A new team"].map((t, i) => (
              <div key={t} style={{ opacity: amb[i], transform: `translateY(${(1 - amb[i]) * 30}px) scale(${0.9 + 0.1 * amb[i]})` }}><Chip text={t} size={26} on={i === 0 ? k(g, "w:ambitions+0.5", 0.3) : 0} /></div>
            ))}
          </div>
          {/* where you want to go */}
          <div style={{ position: "absolute", left: 60, top: 536, width: 1180, height: 1, background: C.line }} />
          <div style={{ position: "absolute", left: 60, top: 560, fontFamily: C.font, fontWeight: 700, fontSize: 26, color: C.muted }}>Destination</div>
          {[{ img: "img/new-perspectives.jpg", pos: "50% 55%" }, { img: "img/career-abroad.jpg", pos: "70% 60%" }].map((p, i) => {
            const L0 = 470;
            const a = k(g, off("w:where", i * 0.15), 0.5);
            return (
              <div key={i} style={{ position: "absolute", left: L0 + i * 330, top: 572, width: 300, height: 170, borderRadius: 20, overflow: "hidden", opacity: a,
                transform: `translateY(${(1 - a) * 40}px)`, boxShadow: i === 1 ? `0 0 0 ${6 * pick}px ${C.orange}, 0 14px 30px rgba(18,38,30,0.16)` : "0 14px 30px rgba(18,38,30,0.12)" }}>
                <Img src={staticFile(p.img)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: p.pos, transform: `scale(${1.12 + drift(g, "w:where", 0.09)})` }} />
                <div style={{ position: "absolute", right: 14, top: 12, opacity: i === 1 ? pick : 0 }}><Icon name="pin" size={38} color="#FFFFFF" sw={3.4} /></div>
              </div>
            );
          })}
          {/* the route: from you to where you want to go */}
          <svg width={1300} height={820} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
            <defs><linearGradient id="rt" x1="0" x2="1"><stop offset="0" stopColor={C.orange} /><stop offset="0.35" stopColor={C.amber} /><stop offset="0.7" stopColor={C.lime} /><stop offset="1" stopColor={C.green} /></linearGradient></defs>
            <path d="M 334 646 C 470 516, 900 506, 1092 584" fill="none" stroke="url(#rt)" strokeWidth={5} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - route} />
          </svg>
          <div style={{ position: "absolute", left: 1100, top: 538, transform: `scale(${route >= 1 ? pick : 0}) rotate(-10deg)` }}><Icon name="plane" size={58} color={C.deep} sw={2.8} /></div>
          <div style={{ position: "absolute", left: 300, top: 646, width: 68, height: 68, opacity: dest, transform: `scale(${0.7 + 0.3 * dest})` }}><Avatar i="You" size={68} hue={1} style={{ fontSize: 20 }} /></div>
        </div>
      </Win>
    </AbsoluteFill>
  );
};

/* ---------- 6 · Alumni brings you closer to employers and recruitment agencies looking for emerging talent ---------- */
const Closer: React.FC<{ g: number }> = ({ g }) => {
  if (g < f("brings") || g > f("grads+0.8")) return null;
  const tile = k(g, "brings+0.2", 0.6);
  const closer = k(g, "w:closer-0.1", 1.0, MOVE);                   // the distance shrinks: both sides move in
  const leave = k(g, "grads-0.25", 0.45, DEPART);
  const hub = k(g, "w:brings-0.1", 0.5);
  const near = drift(g, "w:closer+0.9", 24);
  const px = mix(330, 520, closer) + near - leave * 600, py = 610;
  const rx = mix(1640, 1430, closer) - near + leave * 600;
  const emp = k(g, "w:employers-0.05", 0.5), ag = k(g, "w:recruitment-0.05", 0.5);
  const talent = k(g, "w:emerging", 0.45, SMALLPOP);
  const looking = k(g, "w:looking", 0.4);
  const ce = k(g, "w:employers+0.15", 0.5, MOVE), ca = k(g, "w:agencies", 0.5, MOVE), cp = k(g, "w:brings", 0.6, MOVE);
  const d = drift(g, "brings", 36);
  const Stack: React.FC<{ y: number; a: number; fan: number; dot: string; icon: string; label: string; sub: string; img: string; pos: string }> = ({ y, a, fan, dot, icon, label, sub, img, pos }) => (
    <>
      {[1, 0].map((j) => (
        <Box key={j} x={rx + j * 40 * fan - d} y={y - j * 34 * fan + (1 - a) * 50} w={430} h={236} r={26} s={(0.86 + 0.14 * a) * (1 - j * 0.06)} o={a * (1 - leave) * (j ? 0.75 * fan : 1)} blur={(1 - a) * 8}
          rot={j * 3 * fan} style={{ ...glass(dot) }}>
          {j === 0 && <>
            <Shot src={img} w={406} h={70} pos={pos} zoom={1.3 + drift(g, "brings", 0.05)} px={-drift(g, "brings", 26)} r={16} style={{ left: 12, top: 12 }} />
            <div style={{ position: "absolute", left: 26, top: 96, width: 72, height: 72, borderRadius: 22, background: "#F3F6F2", border: "3px solid #FFFFFF", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name={icon} size={44} color={C.ink} /></div>
            <div style={{ position: "absolute", left: 116, top: 98, display: "flex", alignItems: "center", gap: 10 }}><div style={{ width: 12, height: 12, borderRadius: 6, background: dot }} /><div style={{ fontFamily: C.font, fontWeight: 900, fontSize: 30, color: C.ink, whiteSpace: "nowrap" }}>{label}</div></div>
            <div style={{ position: "absolute", left: 118, top: 142, fontFamily: C.font, fontWeight: 700, fontSize: 20, color: C.muted }}>{sub}</div>
            <div style={{ position: "absolute", left: 28, top: 190, display: "flex", alignItems: "center", gap: 10, opacity: looking }}><Icon name="search" size={26} color={C.deep} sw={3} /><Skel w={200} h={12} /></div>
          </>}
        </Box>
      ))}
    </>
  );
  const ey = 400, ay = 810;
  return (
    <AbsoluteFill>
      <Words g={g} x={d * 0.8} y={96} size={70} center out="grads-0.15" words={[{ t: "Alumni", at: "w:alumni2" }, { t: "brings", at: "w:brings" }, { t: "you", at: "w:you2" }, { t: "closer.", at: "w:closer", grad: true }]} />
      <Cable id="cp" d={`M ${px + 180} ${py + 20} C ${px + 300} ${py}, ${880 - 120} 610, ${960 - 80} 610`} k={cp} w={4} o={1 - leave} orb={cp >= 1 ? ((g - f("w:brings+0.6")) / 30) % 1 : undefined} />
      <Cable id="ce" d={`M ${960 + 80} 610 C ${1120} 610, ${rx - 360 - d} ${ey}, ${rx - 215 - d} ${ey}`} k={ce} w={4} o={1 - leave} orb={ce >= 1 ? 1 - (((g - f("w:looking")) / 30) % 1) : undefined} />
      <Cable id="ca" d={`M ${960 + 80} 610 C ${1120} 610, ${rx - 360 - d} ${ay}, ${rx - 215 - d} ${ay}`} k={ca} w={4} o={1 - leave} orb={ca >= 1 ? 1 - (((g - f("w:looking+0.5")) / 30) % 1) : undefined} />
      <Box x={960} y={610} w={170} h={170} r={44} s={0.8 + 0.2 * hub} o={hub * (1 - leave)} style={{ ...glass(C.orange) }}>
        <div style={{ position: "absolute", left: 0, top: 0 }}><AL x={85} y={85} h={78} a={1} l={1} foot={1} /></div>
      </Box>
      {/* you: the profile, folded into a tile */}
      <Box x={px} y={py} w={360} h={270} r={28} s={0.9 + 0.1 * tile} o={tile * (1 - leave)} style={{ ...glass(C.lime), boxShadow: `0 0 ${50 * talent}px rgba(106,187,36,${0.45 * talent}), 0 18px 40px rgba(18,38,30,0.10)` }}>
        <Shot src={SPLIT} w={336} h={84} pos="60% 62%" zoom={1.3 + drift(g, "brings", 0.04)} px={-drift(g, "brings", 30)} r={16} style={{ left: 12, top: 12 }} />
        <div style={{ position: "absolute", left: 26, top: 60 }}><Avatar i="You" size={78} hue={1} style={{ fontSize: 24, border: "4px solid #FFFFFF" }} /></div>
        <div style={{ position: "absolute", left: 120, top: 104, fontFamily: C.font, fontWeight: 900, fontSize: 32, color: C.ink }}>Graduate</div>
        <div style={{ position: "absolute", left: 122, top: 146, display: "flex", gap: 6 }}><Icon name="cap" size={26} color={C.green} /><Icon name="briefcase" size={26} color={C.green} /><Icon name="globe" size={26} color={C.green} /></div>
        <div style={{ position: "absolute", left: 26, top: 196, transform: `scale(${talent})`, transformOrigin: "0% 50%" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "12px 20px", borderRadius: 40, background: `linear-gradient(90deg, ${GRAD})`, color: "#FFFFFF",
            fontFamily: C.font, fontWeight: 900, fontSize: 24, whiteSpace: "nowrap", boxShadow: "0 10px 24px rgba(254,108,2,0.3)" }}><Icon name="spark" size={24} color="#FFFFFF" sw={2.6} />Emerging talent</div>
        </div>
      </Box>
      <Stack y={ey} a={emp} fan={k(g, "w:employers+0.3", 0.45)} dot={C.orange} icon="building" label="Employers" sub="Your next colleague" img={SPLIT} pos="20% 30%" />
      <Stack y={ay} a={ag} fan={k(g, "w:agencies", 0.45)} dot={C.lime} icon="users" label="Recruitment agencies" sub="Your next talent connection" img={LISBON} pos="70% 45%" />
    </AbsoluteFill>
  );
};

/* ---------- 7–9 · for graduates / businesses / recruitment partners: three panels, one after the other ---------- */
const PANELS = [
  { label: "For graduates & former interns", dot: C.green, sub: "Your career abroad", at: "grads", lines: [[{ t: "A", at: "w:a" }, { t: "path", at: "w:path" }], [{ t: "forward.", at: "w:forward", grad: true }]] },
  { label: "For employers", dot: C.orange, sub: "Your next colleague", at: "biz", lines: [[{ t: "Access", at: "w:access" }, { t: "to", at: "w:to3" }, { t: "new", at: "w:new" }], [{ t: "professionals.", at: "w:professionals", grad: true }]] },
  { label: "For recruitment agencies", dot: C.lime, sub: "Your next talent connection", at: "agency", lines: [[{ t: "A", at: "w:a2" }, { t: "stronger", at: "w:stronger" }], [{ t: "connection.", at: "w:connection", grad: true }]] },
];
const Panels: React.FC<{ g: number }> = ({ g }) => {
  if (g < f("grads-0.2") || g > f("newc+0.9")) return null;
  // the track slides one panel to the left on each audience
  const pos = k(g, "biz", 0.7, MOVE) + k(g, "agency", 0.7, MOVE);
  const leave = k(g, "newc-0.3", 0.42, DEPART);
  const inn = k(g, "grads+0.12", 0.6);
  return (
    <AbsoluteFill>
      {PANELS.map((p, i) => {
        const rel = i - pos;                                            // 0 = in focus
        const foc = 1 - Math.min(1, Math.abs(rel));
        const x = 960 + rel * 1180 - drift(g, "grads", 44) * (1 + Math.abs(rel) * 0.4) - leave * 900, y = 560 + (1 - inn) * 60;
        const sc = 0.84 + 0.16 * foc;
        return (
          <Win key={i} x={x} y={y} w={1180} h={680} s={sc * (0.94 + 0.06 * inn)} o={(0.45 + 0.55 * foc) * inn * (1 - leave)} blur={(1 - foc) * 3 + leave * 10} glow={p.dot}>
            <div style={{ position: "absolute", left: 70, top: 100, display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 16, height: 16, borderRadius: 8, background: p.dot }} /><div style={{ fontFamily: C.font, fontWeight: 700, fontSize: 30, color: C.muted }}>{p.label}</div>
            </div>
            <div style={{ position: "absolute", left: 70, top: 152, fontFamily: C.font, fontWeight: 900, fontSize: 44, color: C.deep, letterSpacing: "-0.01em" }}>{p.sub}</div>
            <div style={{ position: "absolute", left: 0, top: 0 }}>{p.lines.map((ln, j) => <Words key={j} g={g} x={70} y={280 + j * 100} size={84} words={ln as Wd[]} />)}</div>
            <Shot src={[SPLIT, LISBON, LISBON][i]} w={500} h={540} r={22} pos={["68% 70%", "18% 88%", "45% 48%"][i]} zoom={1.15 + drift(g, p.at, 0.07)} px={-drift(g, p.at, 18)}
              style={{ right: 40, top: 92, boxShadow: "0 16px 40px rgba(18,38,30,0.14)" }}>
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(23,39,31,0.05), rgba(23,39,31,0.35))" }} />
            </Shot>
            <div style={{ position: "absolute", right: 80, top: 152, width: 420, height: 420 }}>
              {i === 0 && <Guidance g={g} />}
              {i === 1 && <Pros g={g} />}
              {i === 2 && <Conn g={g} />}
            </div>
          </Win>
        );
      })}
    </AbsoluteFill>
  );
};
// the site's own shapes (assets/site/svg), drawn on the key words
const Guidance: React.FC<{ g: number }> = ({ g }) => {
  const p = k(g, "w:path-0.05", 0.7, MOVE), hd = k(g, "w:forward", 0.35, SMALLPOP);
  return (
    <svg width={420} height={420} viewBox="0 0 120 120" style={{ overflow: "visible" }}>
      <path d="M17 100V53q0-25 25-25h60" fill="none" stroke="#FFFFFF" strokeWidth={15} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
      <path d="M17 100V53q0-25 25-25h60" fill="none" stroke={C.orange} strokeWidth={9} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
      <path d="m84 12 22 16-22 17" fill="none" stroke={C.orange} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" opacity={hd} transform={`translate(${(1 - hd) * -10} 0)`} />
      <circle cx={17} cy={100} r={7} fill={C.green} opacity={k(g, "w:path-0.1", 0.3)} />
    </svg>
  );
};
const Pros: React.FC<{ g: number }> = ({ g }) => {
  const names = ["SM", "JB", "LK", "AV", "TR", "NO"];
  return (
    <div style={{ position: "absolute", left: 10, top: 40, display: "grid", gridTemplateColumns: "repeat(3, 120px)", gap: 26 }}>
      {names.map((n, i) => {
        const a = k(g, off("w:access", i * 0.12), 0.45, SMALLPOP);
        const unlock = k(g, off("w:new", i * 0.05), 0.35);
        return (
          <div key={n} style={{ width: 120, height: 120, borderRadius: 30, ...glass([C.orange, C.lime, C.green][i % 3]), display: "flex", alignItems: "center", justifyContent: "center", opacity: a, transform: `scale(${0.6 + 0.4 * a})` }}>
            <div style={{ filter: `grayscale(${1 - unlock}) blur(${(1 - unlock) * 2}px)`, opacity: 0.4 + 0.6 * unlock }}><Avatar i={n} size={78} hue={i} /></div>
          </div>
        );
      })}
    </div>
  );
};
const Conn: React.FC<{ g: number }> = ({ g }) => {
  const a = k(g, "w:partners", 0.7, MOVE), b = k(g, "w:partners+0.15", 0.7, MOVE), st = k(g, "w:stronger", 0.5, MOVE), node = k(g, "w:connection", 0.4, SMALLPOP);
  const w = 7 + 7 * st;
  return (
    <svg width={420} height={420} viewBox="0 0 120 120" style={{ overflow: "visible" }}>
      <path d="M8 34h27q25 0 25 25v25" fill="none" stroke="#FFFFFF" strokeWidth={w + 6} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - a} />
      <path d="M112 84H85q-25 0-25-25V34" fill="none" stroke="#FFFFFF" strokeWidth={w + 6} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - b} />
      <path d="M8 34h27q25 0 25 25v25" fill="none" stroke={C.orange} strokeWidth={w} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - a} />
      <path d="M112 84H85q-25 0-25-25V34" fill="none" stroke={C.green} strokeWidth={w} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - b} />
      <circle cx={60} cy={59} r={9 + 4 * node} fill={C.lime} opacity={b >= 1 ? 1 : 0} transform={`translate(60 59) scale(${0.4 + 0.6 * node}) translate(-60 -59)`} />
      <circle cx={60} cy={59} r={14 + 20 * node} fill="none" stroke={C.lime} strokeWidth={2} opacity={(1 - node) * (node > 0 ? 1 : 0)} />
    </svg>
  );
};

/* ---------- 10 · new countries, new colleagues, new possibilities ---------- */
const NewWorld: React.FC<{ g: number }> = ({ g }) => {
  if (g < f("newc-0.2") || g > f("sign+1.0")) return null;
  const leave = k(g, "sign-0.25", 0.45, DEPART);
  const c1 = k(g, "w:new2", 0.6), c2 = k(g, "w:new3", 0.6), c3 = k(g, "w:new4", 0.6);
  const d = drift(g, "newc", 40);
  const arc = k(g, "w:countries", 0.9, MOVE);
  const arcD = `M 1090 560 C 1260 330, 1500 280, 1760 300`;
  const plane = arc > 0 && arc < 1 ? pointAt(arcD, arc) : null;
  const msg = "Welcome to the team!";
  const typed = Math.max(0, Math.min(msg.length, Math.floor(((g - f("w:colleagues")) / 30) * 26)));
  return (
    <AbsoluteFill style={{ opacity: 1 - leave }}>
      <div style={{ transform: `translateX(${-leave * 200 + d * 0.5}px)` }}>
        <Words g={g} x={130} y={250} size={80} words={[{ t: "New", at: "w:new2", grad: true }, { t: "countries.", at: "w:countries" }]} />
        <Words g={g} x={130} y={370} size={80} words={[{ t: "New", at: "w:new3", grad: true }, { t: "colleagues.", at: "w:colleagues" }]} />
        <Words g={g} x={130} y={490} size={80} words={[{ t: "New", at: "w:new4", grad: true }, { t: "possibilities.", at: "w:possibilities" }]} />
      </div>
      {/* a new country: the site's harbour town, with the flight in */}
      <Win x={1420 + (1 - c1) * 500} y={420 - d * 0.8} w={760} h={480} o={c1} s={0.9 + 0.1 * c1} blur={(1 - c1) * 8 + leave * 8} title="New countries" glow={C.orange}>
        <div style={{ position: "absolute", left: 14, right: 14, top: 64, bottom: 14, borderRadius: 18, overflow: "hidden" }}>
          <Img src={staticFile("img/career-abroad.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "55% 45%", transform: `scale(${1.08 + drift(g, "w:new2", 0.1)})` }} />
        </div>
      </Win>
      <Cable id="arc" d={arcD} k={arc * (1 - leave)} w={5} />
      {plane && <div style={{ position: "absolute", left: 0, top: 0, transform: `translate(${plane.x - 30}px, ${plane.y - 30}px) rotate(${-20 + arc * 30}deg)` }}><Icon name="plane" size={60} color={C.deep} sw={3} /></div>}
      {/* new colleagues: a team says hello */}
      <Win x={1530 + (1 - c2) * 400} y={835 - d * 1.15} w={600} h={250} o={c2} s={0.9 + 0.1 * c2} blur={(1 - c2) * 8 + leave * 8} title="Team" glow={C.lime} z={2}>
        <div style={{ position: "absolute", left: 30, top: 80, display: "flex" }}>
          {["EM", "LU", "KO", "PA"].map((n, i) => {
            const a = k(g, off("w:colleagues", i * 0.1), 0.4, SMALLPOP);
            return <div key={n} style={{ marginLeft: i ? -18 : 0, transform: `scale(${a})`, opacity: a }}><Avatar i={n} size={74} hue={i} /></div>;
          })}
        </div>
        <div style={{ position: "absolute", left: 30, top: 172, padding: "14px 22px", borderRadius: "22px 22px 22px 6px", background: C.deep, color: "#FFFFFF", fontFamily: C.font, fontWeight: 700, fontSize: 26,
          opacity: typed > 0 ? 1 : 0, whiteSpace: "nowrap" }}>{msg.slice(0, typed) || " "}</div>
      </Win>
      {/* new possibilities: the site's opportunity shape, and a second city */}
      <Win x={1010} y={850 - d * 0.9 + (1 - c3) * 300} w={420} h={300} o={c3} s={0.9 + 0.1 * c3} blur={(1 - c3) * 8 + leave * 8} title="Look beyond borders" glow={C.green} z={1}>
        <div style={{ position: "absolute", left: 14, top: 64, width: 392, height: 222, borderRadius: 16, overflow: "hidden" }}>
          <Img src={staticFile("img/new-perspectives.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 60%", transform: `scale(${1.1 + drift(g, "w:new4", 0.1)})` }} />
        </div>
        <svg width={120} height={100} viewBox="0 0 120 100" style={{ position: "absolute", right: 22, top: 80, overflow: "visible" }}>
          <path d="M17 82 59 15M59 82l42-67" fill="none" stroke="#FFFFFF" strokeWidth={9} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - k(g, "w:possibilities", 0.5, MOVE)} />
          <path d="M59 15h42" fill="none" stroke={C.lime} strokeWidth={12} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - k(g, "w:possibilities+0.3", 0.35, MOVE)} />
        </svg>
      </Win>
    </AbsoluteFill>
  );
};

/* ---------- 11 · Alumni. From experience to opportunity. ---------- */
const SIGN = { x: 960, y: 400, h: 230 };
const Sign: React.FC<{ g: number }> = ({ g }) => {
  if (g < f("sign-0.1") || g > f("end")) return null;
  const a = k(g, "sign+0.2", 0.5), lift = k(g, "chapter-0.25", 0.6, MOVE);
  const ll = k(g, "w:to4-0.1", 0.7, MOVE);
  const out = k(g, "chapter-0.3", 0.35, DEPART);
  const y = mix(SIGN.y, 210, lift), h = mix(SIGN.h, 120, lift);
  const push = 1 + drift(g, "sign+0.3", 0.06) * (1 - lift);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `scale(${push})`, transformOrigin: "960px 500px" }}>
        <div style={{ position: "absolute", left: 0, top: 0, transform: `translateY(${(1 - a) * 40}px) scale(${0.92 + 0.08 * a})`, transformOrigin: `960px ${y}px`, opacity: a, filter: a < 1 ? `blur(${(1 - a) * 10}px)` : undefined }}>
          <AL x={SIGN.x} y={y} h={h} a={1} l={1} foot={1} />
        </div>
        <div style={{ opacity: 1 - out }}>
          <Words g={g} y={640} size={84} center words={[{ t: "From", at: "w:from" }, { t: "experience", at: "w:experience2", color: C.orange }, { t: "to", at: "w:to4" }, { t: "opportunity.", at: "w:opportunity", color: C.green }]} />
          {/* the line between them, in the logo's colours */}
          <Cable id="eo" d="M 560 790 C 760 860, 1160 860, 1370 790" k={ll} w={6} orb={ll > 0.02 && ll < 1 ? ll : undefined} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- 12 · your next chapter starts abroad (the site's own headline and call to action) ---------- */
const Chapter: React.FC<{ g: number }> = ({ g }) => {
  if (g < f("chapter-0.1")) return null;
  const cta = k(g, "w:abroad+0.3", 0.6);
  const p1 = k(g, "chapter+0.2", 0.8), p2 = k(g, "chapter+0.45", 0.8);
  const d = drift(g, "chapter", 36);
  return (
    <AbsoluteFill>
      {/* the site's two cities, floating at the sides */}
      <Box x={300 + d * 0.8 - (1 - p1) * 400} y={760 - d * 0.5} w={420} h={300} r={26} o={p1} rot={-4} blur={(1 - p1) * 8} style={{ ...glass(C.orange), padding: 12, boxSizing: "border-box" }}>
        <div style={{ width: "100%", height: "100%", borderRadius: 16, overflow: "hidden" }}><Img src={staticFile("img/career-abroad.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.1 + drift(g, "chapter", 0.09)})` }} /></div>
      </Box>
      <Box x={1680 - d * 0.8 + (1 - p2) * 400} y={250 + d * 0.5} w={400} h={290} r={26} o={p2} rot={4} blur={(1 - p2) * 8} style={{ ...glass(C.green), padding: 12, boxSizing: "border-box" }}>
        <div style={{ width: "100%", height: "100%", borderRadius: 16, overflow: "hidden" }}><Img src={staticFile("img/new-perspectives.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.1 + drift(g, "chapter", 0.09)})` }} /></div>
      </Box>
      <Eyebrow text="From graduation to working abroad" size={22} style={{ position: "absolute", left: 0, top: 0, width: 1920, textAlign: "center", transform: `translateY(${325}px)`, opacity: k(g, "w:next2+0.1", 0.5), color: C.deep }} />
      <Words g={g} y={375} size={110} center words={[{ t: "Your", at: "w:your4" }, { t: "next", at: "w:next2" }, { t: "chapter", at: "w:chapter" }]} />
      <Words g={g} y={500} size={110} center words={[{ t: "starts", at: "w:starts", grad: true }, { t: "abroad.", at: "w:abroad", grad: true }]} />
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, display: "flex", justifyContent: "center", gap: 22, transform: `translateY(${700 + (1 - cta) * 30}px)`, opacity: cta }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "24px 40px", borderRadius: 60, background: C.orange, color: C.ink, fontFamily: C.font, fontWeight: 700, fontSize: 32,
          boxShadow: "0 16px 36px rgba(254,108,2,0.32)" }}>Explore my next step <Icon name="arrow" size={32} color={C.ink} sw={3} /></div>
        <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "24px 40px", borderRadius: 60, background: "rgba(255,255,255,0.85)", border: `2px solid ${C.line}`, color: C.ink,
          fontFamily: C.font, fontWeight: 700, fontSize: 32 }}>Find talent <Icon name="arrow" size={32} color={C.ink} sw={3} /></div>
      </div>
    </AbsoluteFill>
  );
};

export const Story: React.FC = () => {
  const g = useCurrentFrame();
  const cam = breathe(g, "chapter", 0.04);
  // the gradient's hue balance shifts by chapter: warm (the question) → green (Alumni) → warm (the world) → green
  const tint = k(g, "meet", 1.2, MOVE) * (1 - k(g, "newc", 1.2, MOVE)) + k(g, "sign", 1.2, MOVE);
  const bloom = 1 + 0.35 * Math.sin(Math.PI * clamp01((g - f("meet")) / 45));
  return (
    <AbsoluteFill style={{ background: C.paper }}>
      <Mesh g={g} tint={clamp01(tint)} bloom={bloom} />
      <AbsoluteFill style={{ transform: `translate(${cam.x}px, ${cam.y}px) scale(${cam.s})`, transformOrigin: "50% 50%" }}>
        <Hook g={g} />
        <Ask g={g} />
        <Connect g={g} />
        <Meet g={g} />
        <Profile g={g} />
        <Closer g={g} />
        <Panels g={g} />
        <NewWorld g={g} />
        <Sign g={g} />
        <Chapter g={g} />
      </AbsoluteFill>
      <Grain />
    </AbsoluteFill>
  );
};
