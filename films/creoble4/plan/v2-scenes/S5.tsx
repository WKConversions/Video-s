// Builder 5 — v2 (plan/storyboard.md, shots 29–38): h4 → end. Constant motion, a new shot with a real move on every
// sentence. 29 the help bubble whips in, pinging, beside "Brug for hjælp?" and MORPHS into a Glass chat card; 30 the
// chat scrolls and tilts (the client's photo and question, typing, the human reply); PUSH left to 31, a queue chip
// rolls 14 → 0 and is thrown off under "Ingen kø."; vertical PUSH to 32, a "Bot" chip is struck and tips away; ZOOM
// THROUGH the o of "robotsvar" to 33, the wordmark flies in and builds (its full stop on the word) and is CARRIED up
// (34) while the live site and the hosting card fly in and snap together on "samlet"; an ink MASK WIPE on the music's
// return carries one line that whips along its phrases (35–37: "Byg den." "Se den." "Så køber du."), and the ink frame
// MORPHS into the pill button (38); the client's site rises under it on "side", creoble.dk types, a slow push to the end.
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import {
  Browser, C, Card, EXIT, Glass, HolmSite, Ico, INOUT, Label, LIN, OUT, PillButton, SANS, SERIF, SHADOW_BIG,
  WIPE, Wordmark, aspring, clamp01, f, k, kf, mix, press, whipIn,
} from "../shared";
import { WM_VIEW } from "../wordmark";

/* ---------- the cuts (frames, from the words) ---------- */
const H4 = f("h4");
const MS = f("w:hjlp") + 7, MD = 12;            // 29 → 30: bubble morphs into the chat card
const P1 = f("w:ingen4") - 14, PD1 = 12;        // 30 → 31: push left
const P2 = f("w:ingen5") - 6, PD2 = 10;         // 31 → 32: push up
const Z = f("w:creoble3") - 10, ZD = 10;        // 32 → 33: zoom through the o
const WU = f("w:hjemmeside2") - 4;              // 33 → 34: the wordmark is carried up
const IW = f("w:byg") - 10, IWD = 10;           // 34 → 35: ink mask wipe (on the beat)
const MO = f("w:byg2") - 9, MOD = 13;           // 37 → 38: the ink frame morphs into the button
const END = f("end"), HOLD = END - 18;          // the last 0.6 s may hold
const u01 = (g: number, a: number, b: number) => clamp01((g - a) / Math.max(1, b - a));
const sec = (fr: number) => fr / 30;

/* ---------- local icons ---------- */
const LP: Record<string, React.ReactNode> = {
  clock: <><circle cx="24" cy="24" r="17" /><path d="M24 14 V24 L31 29" /></>,
  bot: <><rect x="9" y="16" width="30" height="23" rx="7" /><path d="M24 16 V9" /><circle cx="24" cy="7.5" r="1.6" /><path d="M18.5 25.5 V29 M29.5 25.5 V29" /></>,
  up: <path d="M24 36 V13 M14 23 L24 13 L34 23" />,
};
const LIco: React.FC<{ n: string; s?: number; c?: string; w?: number; style?: React.CSSProperties }> = ({ n, s = 24, c = C.ink, w = 2, style }) => (
  <svg width={s} height={s} viewBox="0 0 48 48" fill="none" stroke={c} strokeWidth={(w * 48) / 26} strokeLinecap="round" strokeLinejoin="round" style={{ display: "block", flex: "none", ...style }}>{LP[n]}</svg>
);

/* ---------- kinetic type (as the kit's KineticLine, with a colour for italic words on ink and a frozen drift) ---------- */
type KW = { t: string; at: string | number; it?: boolean };
const Kin: React.FC<{ g: number; words: KW[]; cy: number; size: number; x?: number; align?: "center" | "left"; color?: string; itColor?: string; dx?: number; grow?: number; life?: number; stop?: number }> = ({
  g, words, cy, size, x = 960, align = "center", color = C.ink, itColor = C.sageDeep, dx = -60, grow = 0.06, life = 45, stop = 1e9 }) => {
  const t = Math.max(0, Math.min(g, stop) - f(words[0].at)) / life;
  return (
    <div style={{ position: "absolute", left: align === "center" ? x - 1600 : x, top: cy - size * 0.58, width: align === "center" ? 3200 : undefined, display: "flex", justifyContent: align === "center" ? "center" : "flex-start",
      columnGap: size * 0.24, fontFamily: SERIF, fontWeight: 400, fontSize: size, letterSpacing: "-0.025em", lineHeight: 1.05, color, whiteSpace: "nowrap",
      transform: `translateX(${dx * t}px) scale(${1 + grow * t})`, transformOrigin: align === "center" ? "50% 50%" : "0% 50%" }}>
      {words.map((w, i) => {
        const p = Math.min(1, aspring(g, w.at, 0.42, 1));
        return (
          <span key={i} style={{ display: "inline-block", overflow: "hidden", paddingBottom: size * 0.16, marginBottom: -size * 0.16, paddingRight: w.it ? size * 0.06 : 0 }}>
            <span style={{ display: "inline-block", transform: `translateY(${(1 - p) * 100}%) scale(${0.92 + 0.08 * p})`, transformOrigin: "50% 100%", fontStyle: w.it ? "italic" : "normal", color: w.it ? itColor : undefined }}>{w.t}</span>
          </span>
        );
      })}
    </div>
  );
};

// A big UI chip (DM Sans 500): white, hairline, soft shadow.
const BigChip: React.FC<{ size: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ size, children, style }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: size * 0.4, padding: `${size * 0.36}px ${size * 0.78}px ${size * 0.36}px ${size * 0.62}px`, borderRadius: 999, background: C.white,
    border: `1px solid ${C.line}`, boxShadow: SHADOW_BIG, fontFamily: SANS, fontWeight: 500, fontSize: size, lineHeight: `${size * 1.2}px`, color: C.ink, whiteSpace: "nowrap", position: "relative", ...style }}>{children}</div>
);

/* ---------- 29–30: the help bubble → the chat card ---------- */
const CARD = { cx: 960, cy: 540, w: 1040, h: 860 };
const BD = 330;
const bubbleAt = (g: number) => {
  const u = u01(g, H4, MS);
  const sIn = 0.62 + 0.38 * aspring(g, sec(H4 - 5), 0.45);
  const pop = 0.1 * (aspring(g, "w:hjlp", 0.3) - aspring(g, "w:hjlp+0.13", 0.3));
  return { cx: mix(486, 430, u), cy: 540 + mix(18, -18, u), d: BD * (sIn + pop), rot: mix(-12, 6, u) };
};

const ChatBody: React.FC<{ g: number }> = ({ g }) => {
  const imgIn = aspring(g, sec(MS + 4), 0.42), msgIn = aspring(g, sec(MS + 8), 0.42);
  const dotsIn = aspring(g, "w:menneske", 0.38);
  const rep = Math.min(1, aspring(g, "w:forstr", 0.4));
  const writing = kf(g, f("w:menneske") - 1, 5) * (1 - kf(g, f("w:forstr"), 5));
  const scroll = 40 - 3.2 * Math.max(0, g - MS) - 64 * rep;
  const dots = [0, 1, 2].map((i) => 0.5 + 0.5 * Math.sin((g / 30) * Math.PI * 2 * 1.8 - i * 1.0));
  const land = (p: number): React.CSSProperties => ({ opacity: clamp01(p * 1.5), transform: `translateY(${(1 - p) * 60}px) scale(${0.9 + 0.1 * p})` });
  return (
    <div style={{ position: "absolute", inset: 0, fontFamily: SANS, color: C.ink }}>
      {/* the conversation, always scrolling (under the header) */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 161, height: 560, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, transform: `translateY(${scroll}px)` }}>
          <div style={{ position: "absolute", right: 44, top: 40, width: 360, height: 240, borderRadius: 26, borderBottomRightRadius: 10, overflow: "hidden", transformOrigin: "100% 100%", ...land(imgIn) }}>
            <Img src={staticFile("img/holm-stretch.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transform: `scale(${1.12 - 0.08 * u01(g, MS, P1 + PD1)})` }} />
          </div>
          <div style={{ position: "absolute", right: 44, top: 296, maxWidth: 620, padding: "22px 30px", borderRadius: 30, borderBottomRightRadius: 10, background: C.sageDark, color: C.white,
            fontSize: 40, lineHeight: 1.35, transformOrigin: "100% 100%", ...land(msgIn) }}>
            Hej! Kan I hjælpe med at skifte et billede?
          </div>
          <div style={{ position: "absolute", left: 44, top: 498, display: "flex", alignItems: "flex-end", gap: 18, opacity: clamp01(dotsIn * 1.5), transform: `translateY(${(1 - dotsIn) * 50}px)` }}>
            <div style={{ width: 62, height: 62, borderRadius: "50%", background: C.sageTint, display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}><Ico n="user" s={34} c={C.sageDeep} w={2.2} /></div>
            <div style={{ position: "relative", width: mix(150, 690, rep), height: mix(86, 152, rep), borderRadius: 30, borderBottomLeftRadius: 10, background: C.card, border: `1px solid ${C.line}`, overflow: "hidden", transform: `scale(${0.9 + 0.1 * dotsIn})`, transformOrigin: "0% 100%" }}>
              <div style={{ position: "absolute", left: 0, top: 0, width: 150, height: 86, display: "flex", alignItems: "center", justifyContent: "center", gap: 12, opacity: 1 - clamp01(rep * 3) }}>
                {dots.map((d, i) => <div key={i} style={{ width: 16, height: 16, borderRadius: "50%", background: C.sageDeep, opacity: 0.35 + 0.65 * d, transform: `translateY(${-7 * d}px)` }} />)}
              </div>
              <div style={{ position: "absolute", left: 0, top: 0, width: 690, boxSizing: "border-box", padding: "22px 30px", fontSize: 40, lineHeight: 1.35, opacity: clamp01(rep * 1.6 - 0.4), transform: `translateY(${(1 - rep) * 14}px)` }}>
                Selvfølgelig! Jeg ordner det med det samme.
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* header: a neutral avatar with the online dot, the team's name, its status */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 160, background: "rgba(255,255,255,0.9)" }} />
      <div style={{ position: "absolute", left: 44, top: 36, width: 88, height: 88, borderRadius: "50%", background: C.sageTint, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Ico n="user" s={50} c={C.sageDeep} w={2.1} />
        <div style={{ position: "absolute", right: -2, bottom: -2, width: 26, height: 26, borderRadius: "50%", background: C.sage, border: `4px solid ${C.white}` }} />
      </div>
      <div style={{ position: "absolute", left: 158, top: 36, fontSize: 40, fontWeight: 500, letterSpacing: "-0.01em", whiteSpace: "nowrap" }}>Creoble support</div>
      <div style={{ position: "absolute", left: 158, top: 88, height: 40, fontSize: 30 }}>
        <span style={{ position: "absolute", left: 0, top: 0, whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 10, color: C.muted, opacity: 1 - writing }}>
          <span style={{ width: 12, height: 12, borderRadius: "50%", background: C.sage }} />Online</span>
        <span style={{ position: "absolute", left: 0, top: 0, whiteSpace: "nowrap", color: C.sageDeep, opacity: writing }}>Skriver…</span>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 160, height: 1, background: C.line }} />
      {/* the composer */}
      <div style={{ position: "absolute", left: 44, right: 44, top: 748, height: 76, borderRadius: 999, background: "#F4F2EE", border: `1px solid ${C.line}`, display: "flex", alignItems: "center", padding: "0 10px 0 32px", boxSizing: "border-box" }}>
        <div style={{ fontSize: 30, color: C.soft, flex: 1, whiteSpace: "nowrap" }}>Skriv en besked…</div>
        <div style={{ width: 56, height: 56, borderRadius: "50%", background: C.sage, display: "flex", alignItems: "center", justifyContent: "center" }}><LIco n="up" s={30} c={C.white} w={2.6} /></div>
      </div>
    </div>
  );
};

const ChatShot: React.FC<{ g: number }> = ({ g }) => {
  const wx = whipIn(g, "h4"), px = -1950 * kf(g, P1, PD1, INOUT);
  const b = bubbleAt(g), m = kf(g, MS, MD, INOUT);
  const rx = mix(b.cx, CARD.cx, m), ry = mix(b.cy, CARD.cy, m), rw = mix(b.d, CARD.w, m), rh = mix(b.d, CARD.h, m), rr = mix(b.d / 2, 44, m);
  const u = u01(g, MS, P1 + PD1);
  const tilt = `rotateY(${m * mix(-13, 9, u)}deg) rotateX(${m * mix(6, -4, u)}deg) scale(${mix(1, mix(1.1, 1.2, u), m)})`;
  const dark = 1 - clamp01((m - 0.38) / 0.2), icon = 1 - clamp01(m / 0.3);
  const tOut = kf(g, MS - 2, 8, EXIT);
  const s = b.d * 0.5;
  const dots = [0, 1, 2].map((i) => 0.5 + 0.5 * Math.sin((g / 30) * Math.PI * 2 * 1.8 - i * 1.0));
  // the bubble pings: rings keep leaving it until it opens
  const rings = [0, 1, 2].map((i) => ((g - H4 + 40) / 22 + i / 3) % 1);
  return (
    <AbsoluteFill style={{ transform: `translateX(${wx + px}px)`, perspective: 2400 }}>
      {tOut < 1 && (
        <div style={{ position: "absolute", inset: 0, opacity: 1 - tOut, transform: `translateX(${tOut * 460}px)` }}>
          <Kin g={g} words={[{ t: "Brug", at: "w:brug" }, { t: "for", at: "w:for2" }, { t: "hjælp?", at: "w:hjlp", it: true }]} x={694} align="left" cy={540} size={180} dx={-60} grow={0.05} life={30} />
        </div>
      )}
      {m < 0.4 && rings.map((r, i) => (
        <div key={i} style={{ position: "absolute", left: b.cx - (b.d * (1 + 1.1 * r)) / 2, top: b.cy - (b.d * (1 + 1.1 * r)) / 2, width: b.d * (1 + 1.1 * r), height: b.d * (1 + 1.1 * r), borderRadius: "50%",
          border: `3px solid ${C.sage}`, boxSizing: "border-box", opacity: 0.55 * (1 - r) * clamp01(r * 6) * (1 - m * 2.5) }} />
      ))}
      <div style={{ position: "absolute", left: rx - rw / 2, top: ry - rh / 2, width: rw, height: rh, transform: tilt }}>
        <Glass p={clamp01(m * 1.7)} radius={rr} weight={1.4} style={{ position: "absolute", inset: 0 }} />
        {dark > 0 && <div style={{ position: "absolute", inset: 0, borderRadius: rr, background: C.sageDark, opacity: dark, boxShadow: "0 30px 60px -28px rgba(26,22,20,0.55)" }} />}
        {icon > 0 && (
          <div style={{ position: "absolute", left: rw / 2 - s / 2, top: rh / 2 - s / 2, width: s, height: s, opacity: icon, transform: `rotate(${b.rot * (1 - m)}deg) scale(${1 + m})` }}>
            <Ico n="chat" s={s} c={C.cream} w={2.4} />
            {dots.map((d, i) => <div key={i} style={{ position: "absolute", left: s * (0.5 + (i - 1) * 0.17) - s * 0.04, top: s * (22 / 48) - s * 0.04 - s * 0.035 * d, width: s * 0.08, height: s * 0.08, borderRadius: "50%", background: C.cream, opacity: 0.55 + 0.45 * d }} />)}
          </div>
        )}
        {m > 0.5 && <div style={{ position: "absolute", inset: 0, borderRadius: rr, overflow: "hidden", opacity: clamp01((m - 0.55) / 0.45) }}><div style={{ position: "absolute", left: (rw - CARD.w) / 2, top: (rh - CARD.h) / 2, width: CARD.w, height: CARD.h }}><ChatBody g={g} /></div></div>}
      </div>
    </AbsoluteFill>
  );
};

/* ---------- 31–32: no queue, no robot answers ---------- */
const Roll14: React.FC<{ r: number; size: number }> = ({ r, size }) => {
  const lh = size * 1.2, idx = r * 14;
  return (
    <span style={{ display: "inline-block", height: lh, overflow: "hidden", width: `${mix(1.22, 0.66, clamp01((idx - 4) / 1.5))}em`, position: "relative", flex: "none" }}>
      <span style={{ position: "absolute", left: 0, right: 0, top: 0, transform: `translateY(${-idx * lh}px)` }}>
        {Array.from({ length: 15 }, (_, n) => <div key={n} style={{ height: lh, lineHeight: `${lh}px`, textAlign: "center", fontVariantNumeric: "tabular-nums", color: C.sageDeep }}>{14 - n}</div>)}
      </span>
    </span>
  );
};
// the first o of "robotsvar": its counter's centre in the shot's own coordinates (measured on a still at frame Z)
const O = { x: 895, y: 585 };

const NoShot: React.FC<{ g: number }> = ({ g }) => {
  const enter = 1950 * (1 - kf(g, P1, PD1, INOUT)), v = kf(g, P2, PD2, INOUT);
  // 31: the queue
  const qu = u01(g, P1, P2 + PD2), roll = kf(g, f("w:ingen4") - 2, f("w:k") + 2 - (f("w:ingen4") - 2), INOUT);
  const fo = kf(g, f("w:k") + 3, 11, EXIT), lift1 = -46 * kf(g, f("w:k") + 3, 14, INOUT);
  // 32: the bot
  const bu = u01(g, P2, Z + ZD), st = kf(g, f("w:robotsvar"), 7, WIPE), fl = kf(g, f("w:robotsvar") + 8, 12, EXIT), lift2 = -46 * kf(g, f("w:robotsvar") + 3, 13, INOUT);
  const zt = kf(g, Z, ZD, (t) => Math.pow(t, 2.2)), zs = Math.exp(Math.log(46) * zt);
  return (
    <AbsoluteFill style={{ transform: `translateX(${enter}px)` }}>
      {g < P2 + PD2 && (
        <AbsoluteFill style={{ transform: `translateY(${-1150 * v}px)` }}>
          {fo < 1 && (
            <div style={{ position: "absolute", left: 0, width: 1920, top: 290, display: "flex", justifyContent: "center", opacity: 1 - clamp01((fo - 0.45) / 0.55),
              transform: `translate(${mix(70, -50, qu) + fo * 820}px, ${-fo * 560}px) rotate(${fo * 22}deg) scale(${mix(1, 1.06, qu) - 0.15 * fo})` }}>
              <BigChip size={64}><LIco n="clock" s={68} c={C.sageDeep} w={2.2} /><span>Du er nr.</span><Roll14 r={roll} size={64} /><span>i køen</span></BigChip>
            </div>
          )}
          <div style={{ position: "absolute", inset: 0, transform: `translateY(${lift1}px)` }}>
            <Kin g={g} words={[{ t: "Ingen", at: "w:ingen4" }, { t: "kø.", at: "w:k" }]} cy={618} size={236} dx={-80} grow={0.07} life={40} />
          </div>
        </AbsoluteFill>
      )}
      {g >= P2 && (
        <AbsoluteFill style={{ transform: `translateY(${1150 * (1 - v)}px)` }}>
          <AbsoluteFill style={{ transform: `scale(${zs})`, transformOrigin: `${O.x}px ${O.y}px`, opacity: 1 - clamp01((zt - 0.6) / 0.4) }}>
            {fl < 1 && (
              <div style={{ position: "absolute", left: 0, width: 1920, top: 290, display: "flex", justifyContent: "center", opacity: (1 - 0.3 * st) * (1 - clamp01((fl - 0.25) / 0.6)),
                transform: `perspective(1200px) translate(${mix(-60, 50, bu) + fl * 120}px, ${-fl * 150}px) rotateX(${fl * 70}deg) rotate(${fl * 10}deg) scale(${mix(1, 1.06, bu) * (1 - 0.45 * fl)})`, transformOrigin: "50% 100%" }}>
                <BigChip size={64}>
                  <LIco n="bot" s={70} c={C.sageDeep} w={2.2} /><span>Bot</span>
                  <div style={{ position: "absolute", left: 36, top: "50%", height: 6, marginTop: -3, borderRadius: 3, background: C.ink, width: `calc(${st} * (100% - 72px))` }} />
                </BigChip>
              </div>
            )}
            <div style={{ position: "absolute", inset: 0, transform: `translateY(${lift2}px)` }}>
              <Kin g={g} words={[{ t: "Ingen", at: "w:ingen5" }, { t: "robotsvar.", at: "w:robotsvar", it: true }]} cy={612} size={200} dx={-70} grow={0.06} life={40} stop={Z} />
            </div>
          </AbsoluteFill>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

/* ---------- 33–34: the wordmark, then the site and hosting snap together under it ---------- */
const WM_H = 190, WM_W = (WM_H * WM_VIEW.w) / WM_VIEW.h;
const UNIT = { y: 318, h: 520, siteX: 330, siteW: 800, cardX: 1150, cardW: 440 };

const HostingCard: React.FC = () => (
  <Card w={UNIT.cardW} h={UNIT.h} pad={40} style={{ boxShadow: SHADOW_BIG }}>
    <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
      <div style={{ width: 64, height: 64, borderRadius: "50%", background: C.sageTint, display: "flex", alignItems: "center", justifyContent: "center" }}><Ico n="server" s={34} c={C.sageDeep} w={2.2} /></div>
      <div style={{ fontSize: 36, fontWeight: 500, letterSpacing: "-0.01em" }}>Hosting</div>
    </div>
    <div style={{ marginTop: 44, fontSize: 30, color: C.muted }}>fra</div>
    <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginTop: -6 }}>
      <span style={{ fontFamily: SERIF, fontSize: 150, lineHeight: 1, letterSpacing: "-0.03em" }}>83</span>
      <span style={{ fontSize: 38, color: C.ink }}>kr /md</span>
    </div>
    <div style={{ fontSize: 28, color: C.muted, marginTop: 8 }}>Betalt årligt</div>
    <div style={{ height: 1, background: C.line, marginTop: 30 }} />
    <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 26, fontSize: 28 }}>
      <div style={{ width: 32, height: 32, borderRadius: "50%", background: C.sage, display: "flex", alignItems: "center", justifyContent: "center" }}><Ico n="check" s={22} c={C.white} w={2.8} /></div>
      Domæne & e-mail med
    </div>
  </Card>
);

const BrandShot: React.FC<{ g: number }> = ({ g }) => {
  // the wordmark flies in out of the zoom (still decelerating while it builds), then it is carried up
  const W0 = Z + ZD - 2, zin = u01(g, W0, WU + 12), wmP = clamp01((g - W0) / 20 + 0.2);
  const up = kf(g, WU, 18, INOUT);
  const pre = mix(1.55, 1, 1 - (1 - zin) * (1 - zin));
  const post = 0.55 * (1 + 0.04 * u01(g, WU, IW + IWD));
  const wmS = mix(pre, post, up), wmY = mix(540, 196, up);
  const lab = k(g, "w:hjemmeside2+0.15", 0.9, LIN);
  // the site from the left, the hosting card from the right; they snap together on "samlet"
  const s1 = aspring(g, "w:hjemmeside2", 0.55), c1 = aspring(g, "w:hosting", 0.5), snap = aspring(g, "w:samlet", 0.3);
  const ap1 = u01(g, f("w:hjemmeside2"), f("w:samlet")), ap2 = u01(g, f("w:hosting"), f("w:samlet"));
  const siteX = mix(-950, UNIT.siteX - 75, s1) + 25 * ap1 + 50 * snap;
  const cardX = mix(2150, UNIT.cardX + 75, c1) - 25 * ap2 - 50 * snap;
  const bump = 0.022 * (aspring(g, "w:t", 0.28) - aspring(g, "w:t+0.12", 0.28)) - 0.012 * (aspring(g, "w:samlet", 0.25) - aspring(g, "w:samlet+0.1", 0.25));
  const us = 1 + 0.03 * u01(g, f("w:samlet"), IW + IWD) + bump;
  const ol = k(g, "w:t", 0.55, WIPE);
  const out = kf(g, IW, IWD, EXIT);
  const scroll = 560 * u01(g, f("w:hjemmeside2") - 6, IW + IWD);
  return (
    <AbsoluteFill style={{ transform: `translateY(${-240 * out}px) scale(${1 - 0.06 * out})`, perspective: 2200 }}>
      <div style={{ position: "absolute", left: 0, width: 1920, top: 84, display: "flex", justifyContent: "center", transform: `translateY(${mix(30, 0, up)}px)`, opacity: clamp01(lab * 4) }}>
        <Label text="Hjemmeside & hosting" p={lab} size={28} style={{ transform: `translateX(${-mix(36, 0, clamp01(lab * 1.6))}px)` }} />
      </div>
      <div style={{ position: "absolute", left: 960 - WM_W / 2, top: wmY - WM_H / 2, opacity: clamp01((g - W0 - 1) / 3), transform: `scale(${wmS})` }}>
        <Wordmark h={WM_H} p={wmP} />
      </div>
      {g >= f("w:hjemmeside2") && (
        <div style={{ position: "absolute", inset: 0, transform: `scale(${us})`, transformOrigin: `960px ${UNIT.y + UNIT.h / 2}px` }}>
          <div style={{ position: "absolute", left: siteX, top: UNIT.y, transform: `rotateY(${26 * (1 - s1)}deg)`, transformOrigin: "100% 50%" }}>
            <Browser w={UNIT.siteW} h={UNIT.h} url="holmfysio.dk" live={1}>
              <HolmSite w={UNIT.siteW} h={UNIT.h - 46} booking={1} scroll={scroll} />
            </Browser>
          </div>
          {g >= f("w:hosting") && (
            <div style={{ position: "absolute", left: cardX, top: UNIT.y, transform: `rotateY(${-26 * (1 - c1)}deg)`, transformOrigin: "0% 50%" }}>
              <HostingCard />
            </div>
          )}
          {ol > 0 && (
            <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
              <rect x={UNIT.siteX - 18} y={UNIT.y - 18} width={UNIT.cardX + UNIT.cardW - UNIT.siteX + 36} height={UNIT.h + 36} rx={34} fill="none" stroke={C.sage} strokeWidth={3} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - ol} />
            </svg>
          )}
        </div>
      )}
    </AbsoluteFill>
  );
};

/* ---------- 35–37 on ink: one line that whips along its three phrases; then the ink frame becomes the button ---------- */
const BTN = { cx: 960, cy: 238, w: 640, h: 118 };
const PH = 1180, DRIFT = 4;                                       // phrase spacing on the line, its constant travel (px/frame)
const PHRASES: KW[][] = [
  [{ t: "Byg", at: "w:byg-0.15" }, { t: "den.", at: "w:den3" }],
  [{ t: "Se", at: "w:se-0.08" }, { t: "den.", at: "w:den4" }],
  [{ t: "Så", at: "w:s2-0.05", it: true }, { t: "køber", at: "w:kber" }, { t: "du.", at: "w:du5" }],
];
const MID = [f("w:byg") + 7, f("w:se") + 8, f("w:s2") + 11];
const PX = MID.map((m, i) => i * PH + DRIFT * (m - IW));
const ARRIVE: (string | number)[] = [sec(IW + 2), "w:se-0.17", "w:s2-0.17"];
const track = (g: number) => PH * (aspring(g, ARRIVE[1], 0.32) + aspring(g, ARRIVE[2], 0.32)) + DRIFT * (g - IW);

const InkShot: React.FC<{ g: number }> = ({ g }) => {
  const wipe = kf(g, IW, IWD, WIPE);
  const mo = Math.min(1, aspring(g, sec(MO), 0.45) / 0.983);
  const rx = mix(0, BTN.cx - BTN.w / 2, mo), ry = mo > 0 ? mix(0, BTN.cy - BTN.h / 2, mo) : 1080 * (1 - wipe);
  const rw = mix(1920, BTN.w, mo), rh = mo > 0 ? mix(1080, BTN.h, mo) : 1080 * wipe, rr = mix(0, BTN.h / 2, mo);
  const sc = mix(1, 0.3, mo);
  const inner = mo > 0 ? `translate(${rw / 2 - 960}px, ${rh / 2 - 540}px) scale(${sc})` : `translate(0px, ${-ry}px)`;
  const tr = track(g), push = 1 + 0.05 * u01(g, IW, MO + MOD);
  return (
    <div style={{ position: "absolute", left: rx, top: ry, width: rw, height: rh, borderRadius: rr, overflow: "hidden", background: C.ink, boxShadow: mo > 0 ? `0 ${26 * mo}px ${60 * mo}px -30px rgba(26,22,20,${0.55 * mo})` : undefined }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: inner, transformOrigin: "960px 540px", opacity: 1 - clamp01(mo * 1.8) }}>
        <div style={{ position: "absolute", inset: 0, transform: `translateY(${70 * (1 - wipe)}px) scale(${push})`, transformOrigin: "960px 540px" }}>
          {PHRASES.map((words, i) => {
            const x = 960 + PX[i] - tr;
            if (Math.abs(x - 960) > 2300) return null;
            const land = 1 + 0.14 * (1 - aspring(g, ARRIVE[i], 0.45));        // each phrase lands with a settle
            return (
              <div key={i} style={{ position: "absolute", inset: 0, transform: `scale(${land})`, transformOrigin: `${x}px 540px` }}>
                <Kin g={g} words={words} x={x} cy={540} size={250} color={C.cream} itColor={C.sageLight} dx={0} grow={0.04} life={40} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/* ---------- 38: the button, creoble.dk, the client's site rising under them ---------- */
const URL = "creoble.dk";
const typedN = (g: number) => {
  const a = f("w:creoble4"), b = f("w:dk");
  if (g < a) return 0;
  if (g < b) return Math.min(8, 1 + Math.floor((g - a) / ((b - a) / 8)));
  return Math.min(10, 9 + Math.floor((g - b) / 2));
};
const SITE = { x: 400, y: 532, w: 1120, h: 720 };
const CtaShot: React.FC<{ g: number }> = ({ g }) => {
  const L = MO + MOD;
  const t = u01(g, L, HOLD), ease = 1 - Math.pow(1 - t, 1.7);         // keeps travelling until the final hold
  const lab = 1 - kf(g, L - 1, 7, OUT);
  const pr = press(g, "w:gratis"), sh = k(g, "w:gratis", 0.7, INOUT), rip = k(g, "w:gratis+0.06", 0.8, OUT);
  const n = typedN(g), caret = g >= f("w:creoble4") - 3 && g < f("w:dk") + 24 && (n < 10 || Math.floor(g / 8) % 2 === 0);
  const rise = aspring(g, "w:side-0.15", 0.55);
  const scroll = 620 * (1 - Math.pow(1 - u01(g, f("w:side") - 4, HOLD), 1.6));
  return (
    <AbsoluteFill style={{ transform: `translateY(${-24 * ease}px) scale(${mix(1, 1.04, ease)})`, transformOrigin: "960px 400px" }}>
      {rise > 0.001 && (
        <div style={{ position: "absolute", left: SITE.x, top: mix(1120, SITE.y, rise), transform: `perspective(2400px) rotateX(${14 * (1 - rise)}deg)`, transformOrigin: "50% 0%" }}>
          <Browser w={SITE.w} h={SITE.h} url="holmfysio.dk" live={1}>
            <HolmSite w={SITE.w} h={SITE.h - 46} booking={1} scroll={scroll} />
          </Browser>
        </div>
      )}
      <div style={{ position: "absolute", left: BTN.cx - BTN.w / 2, top: BTN.cy - BTN.h / 2, width: BTN.w, height: BTN.h }}>
        {rip > 0 && rip < 1 && <div style={{ position: "absolute", inset: -70 * rip, borderRadius: 999, border: `3px solid ${C.sage}`, opacity: 0.6 * (1 - rip) }} />}
        <PillButton text="Byg din side gratis" size={38} press={pr} shine={sh} style={{ width: BTN.w, height: BTN.h, padding: 0, justifyContent: "center", boxSizing: "border-box" }} />
        {lab > 0 && <div style={{ position: "absolute", inset: 0, borderRadius: 999, background: C.ink, opacity: lab }} />}
      </div>
      <div style={{ position: "absolute", left: 0, width: 1920, top: 322, display: "flex", justifyContent: "center" }}>
        <div style={{ position: "relative", fontFamily: SERIF, fontSize: 92, letterSpacing: "-0.025em", lineHeight: 1.1, color: C.ink, whiteSpace: "nowrap" }}>
          <span style={{ visibility: "hidden" }}>{URL}</span>
          <div style={{ position: "absolute", left: 0, top: 0, display: "flex", alignItems: "center" }}>
            {URL.slice(0, n).split("").map((ch, i) => <span key={i} style={{ color: ch === "." ? C.sage : C.ink }}>{ch}</span>)}
            {caret && <span style={{ display: "inline-block", width: 4, height: 76, marginLeft: 6, borderRadius: 2, background: C.sage }} />}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const Scene5: React.FC<{ g: number }> = ({ g }) => {
  if (g < f("h4") || g >= f("end")) return null;
  return (
    <AbsoluteFill>
      {g < P1 + PD1 && <ChatShot g={g} />}
      {g >= P1 && g <= Z + ZD && <NoShot g={g} />}
      {g >= Z + 3 && g < IW + IWD && <BrandShot g={g} />}
      {g >= MO + MOD - 1 && <CtaShot g={g} />}
      {g >= IW && g < MO + MOD + 1 && <InkShot g={g} />}
    </AbsoluteFill>
  );
};
