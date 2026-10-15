// The film, beat by beat (storyboard/plan.md). One stage inside the site's paper shell; one white card that keeps becoming
// the next thing (slot A), joined by siblings that bud out of it (B, C, D). Every move is on the voice-over's words.
import React from "react";
import { Img, staticFile } from "remotion";
import { measureText } from "@remotion/layout-utils";
import { C, DEPART, EASE, F, MOVE, W, at, clamp01, float, lerp, pr, rise } from "./lib";
import { Ambient, Body, Button, Eyebrow, Icon, Shell, Tag, Wordmark } from "./kit";
import { Intelligence } from "./hero";

// ---- the words' frames ------------------------------------------------------------------------------------------------
const K = {
  ai: W("w:ai"), every: W("w:everywhere"), but: W("w:but"), business: W("w:business"), thats: W("w:thats"), complicated: W("w:complicated"),
  meet: W("w:meet"), adrian: W("w:adrian"), independent: W("w:independent"), expert: W("w:expert"),
  from: W("w:from"), right: W("w:right"), opps: W("w:opportunities"), building: W("w:building"), solutions: W("w:solutions"),
  adrian2: W("w:adrian2"), connects: W("w:connects"), strategy: W("w:strategy"), engineering: W("w:engineering"), execution: W("w:execution"),
  explore: W("w:explore"), develop: W("w:develop"), evaluate: W("w:evaluate"), bring: W("w:bring"), team: W("w:team"),
  no: W("w:no"), no2: W("w:no2"), just: W("w:just"), practical: W("w:practical"), built: W("w:built"), around: W("w:around"), your4: W("w:your4"), business2: W("w:business2"),
  ready: W("w:ready"), potential: W("w:potential"), impact: W("w:impact"), lets: W("w:lets"), talk: W("w:talk"),
};
export const KEYS = K;
const END_OF_SIGN = 1100;   // the sign-off starts

// ---- the stage: ambient field, the shell, the hero-art top and bottom lines --------------------------------------------
export const SHELL = { x: 44, y: 40, w: 1832, h: 1000 };
const BEATS: [number, string, string][] = [
  [0, "Intelligence, applied.", "01 — AT"], [K.meet - 4, "The expertise behind your next step", "02 — AT"], [K.from - 4, "The way forward", "03 — AT"],
  [K.explore - 8, "Expertise, built around you", "04 — AT"], [K.no - 6, "A little more clarity", "05 — AT"],
];
const TopLine: React.FC<{ g: number }> = ({ g }) => (
  <>
    {BEATS.map(([a, left, right], i) => {
      const next = BEATS[i + 1]?.[0] ?? 99999;
      if (g < a - 2 || g > next + 10) return null;
      const kin = i === 0 ? pr(g, 6, 22) : pr(g, a + 10, 18), kout = pr(g, next, 9, DEPART);
      const st = { opacity: kin * (1 - kout), transform: rise(10 * (1 - kin)) };
      return (
        <React.Fragment key={i}>
          <div style={{ position: "absolute", left: 104, top: 86, ...st }}><Eyebrow text={left} size={15} color={C.label} style={{ fontWeight: 600, letterSpacing: 2.8 }} /></div>
          <div style={{ position: "absolute", right: 104, top: 86, ...st }}><Eyebrow text={right} size={15} color={C.label} style={{ fontWeight: 600, letterSpacing: 2.8 }} /></div>
        </React.Fragment>
      );
    })}
  </>
);
const BottomLine: React.FC<{ g: number }> = ({ g }) => {
  const k = pr(g, 8, 22), grow = clamp01(g / END_OF_SIGN);
  return (
    <div style={{ position: "absolute", left: 104, right: 104, top: 976, display: "flex", alignItems: "center", gap: 30, opacity: k }}>
      <Eyebrow text="Your ambition" size={15} color={C.label} style={{ fontWeight: 600, letterSpacing: 2.8 }} />
      <div style={{ flex: 1, height: 2, background: "rgba(201,201,194,0.45)", position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, background: C.rule, transformOrigin: "0 50%", transform: `scaleX(${grow})` }} />
      </div>
      <Eyebrow text="Applied AI" size={15} color={C.label} style={{ fontWeight: 600, letterSpacing: 2.8 }} />
    </div>
  );
};

// ---- the hook: AI everywhere, then it piles onto your business ----------------------------------------------------------
type TagDef = { text: string; icon?: string; dark?: boolean; x: number; y: number; px: number; py: number; rot: number };
const TAGS: TagDef[] = [
  { text: "AI", dark: true, x: 1190, y: 190, px: 690, py: 410, rot: -8 },
  { text: "Chatbots", icon: "plus", x: 430, y: 250, px: 1240, py: 420, rot: 9 },
  { text: "AI agents", dark: true, x: 1480, y: 260, px: 780, py: 720, rot: -12 },
  { text: "Copilots", icon: "arrow-up-right", x: 300, y: 560, px: 1180, py: 735, rot: 6 },
  { text: "Automation", icon: "plus", x: 1620, y: 540, px: 990, py: 650, rot: -4 },
  { text: "LLMs", dark: true, x: 520, y: 840, px: 860, py: 600, rot: 13 },
  { text: "Image generation", icon: "arrow-up-right", x: 1390, y: 830, px: 1000, py: 800, rot: -9 },
  { text: "Predictions", icon: "plus", x: 760, y: 200, px: 1260, py: 600, rot: 5 },
  { text: "Assistants", icon: "arrow-up-right", x: 1060, y: 900, px: 680, py: 560, rot: -14 },
];
const CENTER = [960, 540];
const HookTags: React.FC<{ g: number }> = ({ g }) => {
  if (g > K.meet + 30) return null;
  return (
    <>
      {TAGS.map((t, i) => {
        const born = i === 0 ? K.ai - 2 : K.every - 4 + i * 3;
        if (g < born) return null;
        const kb = pr(g, born, 26);
        // the first tag starts big in the centre and joins the others on "But"
        let x = i === 0 ? lerp(CENTER[0], t.x, pr(g, K.but - 4, 26, MOVE)) : lerp(CENTER[0], t.x, kb);
        let y = i === 0 ? lerp(CENTER[1], t.y, pr(g, K.but - 4, 26, MOVE)) : lerp(CENTER[1], t.y, kb);
        let sc = i === 0 ? lerp(1.5, 1, pr(g, K.but - 4, 26, MOVE)) : lerp(0.55, 1, kb);
        // make room for the card ("But making it work for your business?"): drift a little further out
        const room = pr(g, K.but, 30, MOVE);
        x += (t.x - CENTER[0]) * 0.08 * room; y += (t.y - CENTER[1]) * 0.08 * room;
        // "That's where things get complicated": they pile onto the card
        const kp = pr(g, K.thats - 6 + i * 2, 24, MOVE);
        x = lerp(x, t.px, kp); y = lerp(y, t.py, kp);
        const tilt = pr(g, K.complicated - 2, 18, EASE);
        let rot = t.rot * kp + (t.rot > 0 ? 3 : -3) * tilt;
        // "Meet": the pile drops away
        const kd = pr(g, K.meet - 4 + i, 12, DEPART);
        y += 160 * kd; rot += (t.rot > 0 ? 8 : -8) * kd;
        const fl = float(g, 7, -12, i * 0.77) * (1 - kp);
        return <div key={i} style={{ ...at(x, y + fl, sc * (1 - 0.06 * kp), (i === 0 ? pr(g, born, 14) : kb) * clamp01(1 - 1.7 * kd), `rotate(${rot}deg)`), zIndex: g < K.meet - 4 ? 5 : 2 }}>
          <Tag text={t.text} icon={t.icon} glyph={t.icon ? undefined : "✳"} dark={t.dark} size={1.25} />
        </div>;
      })}
    </>
  );
};
/** The tangle: hairlines crossing between the piled tags and the card, drawn on "That's where things get complicated". */
const TANGLE = [
  "M640 380C900 260 1300 820 1240 470", "M760 760C680 420 1260 300 1130 720", "M700 520C1000 900 1320 380 900 330",
  "M1260 600C900 860 620 300 1010 410", "M820 280C1180 360 760 900 1190 780", "M680 650C860 300 1230 520 980 800",
];
const Tangle: React.FC<{ g: number }> = ({ g }) => {
  if (g < K.thats || g > K.meet + 14) return null;
  const out = pr(g, K.meet - 2, 12, DEPART);
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, zIndex: 4, opacity: 1 - out }}>
      {TANGLE.map((d, i) => {
        const k = pr(g, K.thats + 4 + i * 3, 26, EASE);
        return <path key={i} d={d} fill="none" stroke={C.ink} strokeOpacity={0.42} strokeWidth={2.4} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - k} />;
      })}
    </svg>
  );
};

// ---- the card thread ------------------------------------------------------------------------------------------------------
type Geo = { x: number; y: number; w: number; h: number; r?: number };
type Key = Geo & { at: number; dur: number };
/** The state at frame g of a card that moves between held states (MOVE between keys). */
const geo = (g: number, keys: Key[]): Geo => {
  let cur: Geo = keys[0];
  for (let i = 1; i < keys.length; i++) {
    const k = keys[i];
    if (g < k.at) break;
    const t = pr(g, k.at, k.dur, MOVE), p = cur;
    cur = { x: lerp(p.x, k.x, t), y: lerp(p.y, k.y, t), w: lerp(p.w, k.w, t), h: lerp(p.h, k.h, t), r: lerp(p.r ?? 0, k.r ?? 0, t) };
  }
  return cur;
};
/** A layer that is on between frames a and b (fading in over fi, out over fo). */
const win = (g: number, a: number, b: number, fi = 12, fo = 10) => pr(g, a, fi) * (1 - pr(g, b, fo, DEPART));

const SERVICE_W = 400, SERVICE_H = 620;
const COL4 = [330, 750, 1170, 1590], COL3 = [400, 960, 1520];
const A_KEYS: Key[] = [
  { at: 0, dur: 1, x: 960, y: 590, w: 560, h: 400 },
  { at: K.meet + 2, dur: 24, x: 1350, y: 560, w: 680, h: 800 },
  { at: K.from + 2, dur: 24, x: 560, y: 560, w: 600, h: 640 },
  { at: K.adrian2 + 2, dur: 22, x: COL3[0], y: 560, w: 480, h: SERVICE_H },
  { at: K.explore - 10, dur: 22, x: COL4[0], y: 560, w: SERVICE_W, h: SERVICE_H },
];
const B_KEYS: Key[] = [
  { at: 0, dur: 1, x: 1360, y: 560, w: 600, h: 640 },
  { at: K.adrian2 + 2, dur: 22, x: COL3[1], y: 560, w: 480, h: SERVICE_H },
  { at: K.explore - 10, dur: 22, x: COL4[1], y: 560, w: SERVICE_W, h: SERVICE_H },
];
const C_KEYS: Key[] = [
  { at: 0, dur: 1, x: COL3[2], y: 560, w: 480, h: SERVICE_H },
  { at: K.explore - 10, dur: 22, x: COL4[2], y: 560, w: SERVICE_W, h: SERVICE_H },
];
const D_KEYS: Key[] = [{ at: 0, dur: 1, x: COL4[3], y: 560, w: SERVICE_W, h: SERVICE_H }];

type Txt = { from: number; to: number; num?: string; eyebrow: string; title: string[]; foot: string };
type Pic = { from: number; to: number; src: string; scale?: number; dy?: number };
const SLOT: Record<string, { keys: Key[]; born: number; texts: Txt[]; pics: Pic[]; lifts: [number, number][]; bornDy?: number }> = {
  A: {
    keys: A_KEYS, born: K.business - 16,
    texts: [
      { from: K.from + 8, to: K.adrian2 + 2, num: "01", eyebrow: "Understand", title: ["The right", "opportunity"], foot: "From possibility to a plan" },
      { from: K.adrian2 + 12, to: K.explore - 12, num: "01", eyebrow: "Find the right opportunity", title: ["Strategy"], foot: "From possibility to a plan" },
      { from: K.explore - 2, to: 99999, num: "01", eyebrow: "Find the right opportunity", title: ["AI strategy", "& direction"], foot: "From possibility to a plan" },
    ],
    pics: [{ from: K.from + 8, to: 99999, src: "service-strategy" }],
    lifts: [[K.strategy - 2, K.engineering - 2], [K.explore - 2, K.develop - 2]],
  },
  B: {
    keys: B_KEYS, born: K.building - 10,
    texts: [
      { from: K.building - 10, to: K.adrian2 + 2, num: "02", eyebrow: "Build", title: ["A real", "solution"], foot: "From concept to capability" },
      { from: K.adrian2 + 12, to: K.explore - 12, num: "02", eyebrow: "Make the idea work", title: ["Engineering"], foot: "From concept to capability" },
      { from: K.explore - 2, to: 99999, num: "02", eyebrow: "Make the idea work", title: ["AI development", "& integration"], foot: "From concept to capability" },
    ],
    pics: [{ from: K.building - 10, to: 99999, src: "service-build" }],
    lifts: [[K.engineering - 2, K.execution - 2], [K.develop - 2, K.evaluate - 2]],
  },
  C: {
    keys: C_KEYS, born: K.adrian2 + 20,
    texts: [
      { from: K.adrian2 + 20, to: K.explore - 12, num: "03", eyebrow: "Put it into practice", title: ["Execution"], foot: "A foundation to build on" },
      { from: K.explore - 2, to: 99999, num: "03", eyebrow: "Know what works", title: ["Evaluation", "& performance"], foot: "From assumptions to evidence" },
    ],
    pics: [{ from: K.adrian2 + 20, to: K.explore - 8, src: "hero-intelligence", scale: 0.86, dy: 6 }, { from: K.explore - 10, to: 99999, src: "service-performance" }],
    lifts: [[K.execution - 2, K.explore - 4], [K.evaluate - 2, K.bring - 2]],
  },
  D: {
    keys: D_KEYS, born: K.explore + 8,
    texts: [{ from: K.explore + 8, to: 99999, num: "04", eyebrow: "Bring your people with you", title: ["Fractional AI", "leadership"], foot: "Expertise, when you need it" }],
    pics: [{ from: K.explore + 8, to: 99999, src: "service-enablement" }],
    lifts: [[K.bring - 2, K.no - 4]],
  },
};
const ORDER = ["A", "B", "C", "D"];
const CARDS_OUT = K.no - 20;

/** The card's lift (the site's hover: up 6 px ×2, the image scales 1.06, the arrow turns dark), 0..1. */
const liftK = (g: number, lifts: [number, number][]) => lifts.reduce((m, [a, b]) => Math.max(m, pr(g, a, 14) * (1 - pr(g, b, 14, MOVE))), 0);

const ServiceText: React.FC<{ t: Txt; w: number; h: number; wellH: number; lift: number }> = ({ t, w, h, wellH, lift }) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: w, height: h }}>
    <div style={{ position: "absolute", left: 36, top: wellH + 12 + 38, right: 30 }}>
      <div style={{ fontFamily: F.ui, fontWeight: 650, fontSize: 14, letterSpacing: 2.4, color: "#888882", textTransform: "uppercase", whiteSpace: "nowrap" }}>{t.eyebrow}</div>
      <div style={{ marginTop: 18, fontFamily: F.ui, fontWeight: 650, fontSize: 40, lineHeight: 1.2, letterSpacing: -1.6, color: C.ink, whiteSpace: "nowrap" }}>
        {t.title.map((l, i) => <div key={i}>{l}</div>)}
      </div>
    </div>
    <div style={{ position: "absolute", left: 36, right: 28, bottom: 26, borderTop: "2px solid #EAEAE6", paddingTop: 20, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <span style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 16, color: "#72726D", whiteSpace: "nowrap" }}>{t.foot}</span>
      <span style={{ width: 52, height: 52, borderRadius: "50%", display: "grid", placeItems: "center", background: lift > 0.5 ? C.btn : C.chip, transition: "none" }}>
        <Icon name="arrow-up-right" size={24} color={lift > 0.5 ? "#fff" : C.ink} />
      </span>
    </div>
  </div>
);

const BusinessContent: React.FC<{ w: number }> = ({ w }) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: w, padding: "40px 44px", boxSizing: "border-box" }}>
    <Eyebrow text="Your business" size={15} color="#888882" dot style={{ fontWeight: 650 }} />
    <div style={{ marginTop: 16, fontFamily: F.ui, fontWeight: 650, fontSize: 46, letterSpacing: -1.9, lineHeight: 1.15, color: C.ink }}>Goals, data & team</div>
    <div style={{ marginTop: 26 }}>
      {["Goals", "Data", "Team"].map((r) => (
        <div key={r} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "2px solid #EAEAE6", height: 62,
          fontFamily: F.ui, fontWeight: 600, fontSize: 24, color: C.ink }}>{r}<Icon name="plus" size={24} color="#777770" /></div>
      ))}
    </div>
  </div>
);

const PortraitContent: React.FC<{ w: number; h: number; k: number; push: number }> = ({ w, h, k, push }) => (
  <div style={{ position: "absolute", left: 12, top: 12, width: w - 24, height: h - 24, borderRadius: 30, overflow: "hidden", background: "#DADAD6" }}>
    <Img src={staticFile("img/adrian-tineo.jpg")} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 30%",
      filter: "grayscale(1)", transform: `scale(${1.08 - 0.08 * k + 0.05 * push})`, transformOrigin: "50% 35%" }} />
    <div style={{ position: "absolute", left: 30, top: 30, fontFamily: F.ui, fontWeight: 650, fontSize: 13, letterSpacing: 2.6, color: "#707068", textTransform: "uppercase" }}>
      The expertise behind your next step</div>
    <div style={{ position: "absolute", left: 24, right: 24, bottom: 24, height: 104, borderRadius: 18, background: "rgba(255,255,255,0.93)", display: "flex",
      alignItems: "center", justifyContent: "space-between", padding: "0 36px", boxSizing: "border-box", transform: `translate3d(0, ${30 * (1 - k)}px, 0)`, opacity: k }}>
      <span style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 30, color: C.ink, letterSpacing: -0.6 }}>Adrian Tineo</span>
      <span style={{ fontFamily: F.ui, fontWeight: 500, fontSize: 17, color: "#777770" }}>PhD in Computer Science</span>
    </div>
  </div>
);

const ThreadCard: React.FC<{ g: number; id: string }> = ({ g, id }) => {
  const s = SLOT[id];
  if (g < s.born || g > CARDS_OUT + 30) return null;
  const G = geo(g, s.keys);
  const born = pr(g, s.born, 26);
  const i = ORDER.indexOf(id);
  const out = pr(g, CARDS_OUT + i * 2, 12, DEPART);
  const lift = liftK(g, s.lifts);
  // A's own life before it is a service card: the business card that tilts under the pile, then Adrian's portrait
  const tilt = id === "A" ? pr(g, K.complicated - 2, 18) * (1 - pr(g, K.meet + 2, 20, MOVE)) : 0;
  const bizK = id === "A" ? 1 - pr(g, K.meet, 8, DEPART) : 0;
  const portK = id === "A" ? win(g, K.meet + 8, K.from, 14, 10) : 0;
  const wellH = Math.round(G.h * 0.54);
  const x = G.x, y = G.y + 60 * (1 - born) + 70 * out - 12 * lift + 16 * tilt;
  return (
    <div style={{ ...at(x, y, 1, born * (1 - out), `rotate(${-3.5 * tilt}deg)`), width: G.w, height: G.h, zIndex: 3 }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: 32, background: C.white, border: "2px solid #fff", boxSizing: "border-box",
        boxShadow: `0 ${32 + 20 * lift}px ${70 + 30 * lift}px rgba(0,0,0,${0.04 + 0.04 * lift}), 0 2px 6px rgba(0,0,0,0.03)`, overflow: "hidden" }}>
        {bizK > 0 && <div style={{ opacity: bizK }}><BusinessContent w={G.w} /></div>}
        {portK > 0 && <div style={{ opacity: portK }}><PortraitContent w={G.w} h={G.h} k={pr(g, K.meet + 8, 30)} push={pr(g, K.meet + 8, K.from - K.meet, (t) => t)} /></div>}
        {s.pics.map((p, j) => {
          const o = win(g, p.from, p.to, 14, 10);
          if (o <= 0) return null;
          return (
            <div key={j} style={{ position: "absolute", left: 12, top: 12, width: G.w - 24, height: wellH, borderRadius: 22, background: C.well, overflow: "hidden", opacity: o }}>
              <Img src={staticFile(`img/${p.src}.svg`)} style={{ position: "absolute", left: "50%", top: "50%", width: Math.max(G.w - 24, wellH * 1.2) * (p.scale ?? 1), mixBlendMode: "multiply",
                transform: `translate(-50%, calc(-50% + ${(p.dy ?? 0) + float(g, 9, -16, ORDER.indexOf(id) * 2.3 + j)}px)) scale(${1 + 0.06 * lift}) rotate(${float(g, 9, 1.5, ORDER.indexOf(id) * 2.3 + j)}deg)` }} />
            </div>
          );
        })}
        {s.texts.map((t, j) => {
          const o = win(g, t.from, t.to, 12, 8);
          if (o <= 0) return null;
          return <div key={j} style={{ opacity: o, transform: rise(12 * (1 - pr(g, t.from, 16))) }}>
            {t.num && <span style={{ position: "absolute", left: 40, top: 40, fontFamily: F.ui, fontSize: 16, color: C.num, fontWeight: 500, zIndex: 2 }}>{t.num}</span>}
            <ServiceText t={t} w={G.w} h={G.h} wellH={wellH} lift={lift} />
          </div>;
        })}
      </div>
    </div>
  );
};

// ---- meet Adrian: the two-tone name ------------------------------------------------------------------------------------
const MeetText: React.FC<{ g: number }> = ({ g }) => {
  if (g < K.meet || g > K.from + 20) return null;
  const out = (d: number) => pr(g, K.from - 2 + d, 12, DEPART);
  const line = (a: number, d: number): React.CSSProperties => {
    const k = pr(g, a, 26), o = out(d);
    return { opacity: k * (1 - o), transform: rise(34 * (1 - k), -50 * o) };
  };
  const sz = 112;
  const H: React.CSSProperties = { fontFamily: F.ui, fontWeight: 650, fontSize: sz, letterSpacing: -0.054 * sz, lineHeight: 1.08, whiteSpace: "nowrap" };
  return (
    <div style={{ position: "absolute", left: 140, top: 300, zIndex: 3 }}>
      <div style={line(K.meet + 4, 0)}><Eyebrow text="Independent AI consulting" size={18} dot style={{ marginBottom: 34 }} /></div>
      <div style={{ ...H, color: C.ink, ...line(K.adrian - 2, 1) }}>Adrian Tineo.</div>
      <div style={{ ...H, color: C.grey2, ...line(K.independent - 4, 2) }}>Independent</div>
      <div style={{ ...H, color: C.grey2, ...line(K.independent + 4, 3) }}>AI expert.</div>
    </div>
  );
};

// ---- floating tags on the cards (the site's two art tags and friends) ---------------------------------------------------
const FloatTag: React.FC<{ g: number; a: number; b: number; x: number; y: number; text: string; icon?: string; glyph?: string; dark?: boolean; ph?: number }> = ({ g, a, b, x, y, text, icon, glyph, dark, ph = 0 }) => {
  if (g < a || g > b + 16) return null;
  const k = pr(g, a, 24), o = pr(g, b, 12, DEPART);
  return <div style={{ ...at(x, y + 30 * (1 - k) + 40 * o + float(g, 7, -12, ph), 1, k * (1 - o)), zIndex: 6 }}><Tag text={text} icon={icon} glyph={glyph} dark={dark} size={1.25} /></div>;
};

// ---- the way forward: an arrow from opportunity to solution; strategy · engineering · execution on one rule -------------
const ArrowLine: React.FC<{ g: number }> = ({ g }) => {
  if (g < K.opps || g > K.adrian2 + 14) return null;
  const k = pr(g, K.opps + 2, 26), o = pr(g, K.adrian2, 10, DEPART);
  return (
    <div style={{ position: "absolute", left: 892, top: 560, display: "flex", alignItems: "center", opacity: 1 - o, zIndex: 2 }}>
      <div style={{ width: 110, height: 2, background: C.ink, transformOrigin: "0 50%", transform: `scaleX(${k})` }} />
      <div style={{ opacity: pr(g, K.opps + 18, 10), marginLeft: -8 }}><Icon name="arrow-right" size={34} color={C.ink} /></div>
    </div>
  );
};
const Connect: React.FC<{ g: number }> = ({ g }) => {
  if (g < K.connects - 4 || g > K.explore + 6) return null;
  const k = pr(g, K.connects - 2, 28), o = pr(g, K.explore - 12, 12, DEPART);
  const dots = [K.strategy, K.engineering, K.execution];
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - o, zIndex: 2 }}>
      <div style={{ position: "absolute", left: COL3[0], top: 913, width: COL3[2] - COL3[0], height: 2, background: C.ink, transformOrigin: "0 50%", transform: `scaleX(${k})` }} />
      {COL3.map((cx, i) => {
        const on = pr(g, dots[i] - 2, 12), seen = pr(g, K.connects - 2 + i * 10, 12);
        return <div key={i} style={{ ...at(cx, 914, 1, seen) }}>
          <div style={{ width: 22, height: 22, borderRadius: "50%", background: on > 0.5 ? C.dot : C.ink, boxShadow: `0 0 0 ${10 * on}px rgba(165,190,184,${0.22 * on})`, border: "3px solid " + C.paper }} />
        </div>;
      })}
    </div>
  );
};

// ---- no hype, no guesswork, just practical AI; the sculpture assembles around its core --------------------------------
const STATE_SZ = 150, SMALL = 0.62;
const lineW = (t: string, sz: number) => measureText({ text: t, fontFamily: F.ui, fontSize: sz, fontWeight: "650", letterSpacing: `${-0.054 * sz}px` }).width;
const Statement: React.FC<{ g: number }> = ({ g }) => {
  if (g < K.no - 4 || g > K.ready + 40) return null;
  const mv = pr(g, K.just - 8, 20, MOVE);
  const sc = lerp(1, SMALL, mv);
  const lines: [string, string, number][] = [["No hype.", C.ink, K.no - 4], ["No guesswork.", C.grey2, K.no2 - 4]];
  const lh = STATE_SZ * 1.08;
  const H: React.CSSProperties = { fontFamily: F.ui, fontWeight: 650, fontSize: STATE_SZ, letterSpacing: -0.054 * STATE_SZ, lineHeight: 1.08, whiteSpace: "nowrap" };
  const y0c = 540 - lh / 2, y0l = 330;                                  // first line centre: centred pair, then the left column
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 3 }}>
      {lines.map(([t, col, a], i) => {
        const k = pr(g, a, 26), w = lineW(t, STATE_SZ);
        const cx = lerp(960, 140 + (w * SMALL) / 2, mv), cy = lerp(y0c + i * lh, y0l + i * lh * SMALL, mv);
        return <div key={i} style={{ ...at(cx, cy + 40 * (1 - k), sc, k), ...H, color: col }}>{t}</div>;
      })}
      {(() => {
        const t = "Just practical AI.", k = pr(g, Math.max(K.practical - 2, K.just + 12), 26), w = lineW(t, STATE_SZ);
        return <div style={{ ...at(140 + (w * SMALL) / 2, y0l + 2 * lh * SMALL + 26 + 34 * (1 - k), SMALL, k), ...H, color: C.ink }}>{t}</div>;
      })()}
      <div style={{ position: "absolute", left: 140, top: y0l + 3 * lh * SMALL + 30, width: 620, ...{ opacity: pr(g, K.built, 26), transform: rise(24 * (1 - pr(g, K.built, 26))) } }}>
        <Body size={30} color={C.desc}>Clear strategy. Hands-on engineering. Built around your business.</Body>
      </div>
    </div>
  );
};
const Sculpt: React.FC<{ g: number }> = ({ g }) => {
  if (g < K.practical - 10 || g > K.ready + 40) return null;
  const orb = pr(g, K.practical - 4, 26);
  const base = pr(g, K.built - 6, 28), mid = pr(g, K.built + 2, 28), top = pr(g, K.around - 2, 30), guides = pr(g, K.your4 - 4, 20);
  const size = 860, fl = float(g, 9, -18);
  return (
    <div style={{ ...at(1310, 540 + fl, 1, 1, `rotate(${float(g, 9, 1.5)}deg)`), width: size, height: size, zIndex: 2 }}>
      <Intelligence id="hero" size={size} p={{
        ground: base, base: [-140 * (1 - base), base], mid: [-110 * (1 - mid), mid], top: [160 * (1 - top), top], guides,
        orb: [30 * (1 - orb), orb, 0.7 + 0.3 * orb],
      }} />
    </div>
  );
};

// ---- the dark contact panel and the sign-off ------------------------------------------------------------------------------
const PANEL = { x: 76, y: 72, w: 1768, h: 936 };
const Panel: React.FC<{ g: number }> = ({ g }) => {
  if (g < K.ready - 4) return null;
  const k = pr(g, K.ready - 2, 32, EASE);
  const clr = pr(g, END_OF_SIGN, 14, DEPART);                          // the panel's copy clears for the sign-off
  const L = (a: number, d = 34): React.CSSProperties => { const q = pr(g, a, 26); return { opacity: q * (1 - clr), transform: rise(d * (1 - q)) }; };
  const sz = 150, H: React.CSSProperties = { fontFamily: F.ui, fontWeight: 650, fontSize: sz, letterSpacing: -0.052 * sz, lineHeight: 1.1, whiteSpace: "nowrap" };
  // the button: under the headline, then the centre of the sign-off
  const bm = pr(g, END_OF_SIGN + 4, 26, MOVE), press = pr(g, K.talk + 2, 8) * (1 - pr(g, K.talk + 14, 10));
  const bk = pr(g, K.lets - 6, 24);
  return (
    <div style={{ position: "absolute", left: PANEL.x, top: PANEL.y, width: PANEL.w, height: PANEL.h, borderRadius: 40, background: C.panel, overflow: "hidden", zIndex: 8,
      transform: `translate3d(0, ${(1 - k) * 1000}px, 0)`, boxShadow: "0 -20px 80px rgba(0,0,0,0.12)" }}>
      <svg width={PANEL.w} height={PANEL.h} style={{ position: "absolute", inset: 0 }}>
        <circle cx={1420} cy={620} r={620} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={2} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - pr(g, K.ready + 20, 60)} />
      </svg>
      <div style={{ position: "absolute", left: 104, top: 96, ...L(K.ready + 18, 16) }}><Eyebrow text="Your next chapter with AI" size={15} color="#A0A09A" dot /></div>
      <div style={{ position: "absolute", right: 104, top: 84, ...L(K.ready + 22, 16) }}><Icon name="arrow-up-right" size={62} color="#B4B4AA" stroke={1.4} /></div>
      <div style={{ position: "absolute", left: 100, top: 262 }}>
        <div style={{ ...H, color: C.onPanel, ...L(K.potential - 8) }}>AI potential.</div>
        <div style={{ ...H, color: C.onPanel2, ...L(K.impact - 6) }}>Business impact.</div>
      </div>
      <div style={{ ...at(lerp(104 + 215, PANEL.w / 2, bm), lerp(712, 640, bm), 1, bk, `translateY(${34 * (1 - bk)}px)`) }}>
        <Button text="Let’s talk" light size={1.35} press={press} style={{ minWidth: 340 }} />
      </div>
      {/* the sign-off */}
      <div style={{ ...at(PANEL.w / 2, 420 + 30 * (1 - pr(g, END_OF_SIGN + 8, 26)), 1, pr(g, END_OF_SIGN + 8, 26)) }}>
        <Wordmark size={128} color={C.onPanel} dotK={pr(g, END_OF_SIGN + 24, 14)} />
      </div>
      <div style={{ ...at(PANEL.w / 2, 530 + 24 * (1 - pr(g, END_OF_SIGN + 16, 26)), 1, pr(g, END_OF_SIGN + 16, 26)) }}>
        <Body size={30} color={C.onPanel3} style={{ whiteSpace: "nowrap" }}>Independent expertise. Shared ambition.</Body>
      </div>
    </div>
  );
};

// ---- the whole film ----------------------------------------------------------------------------------------------------------
export const Film_: React.FC<{ g: number }> = ({ g }) => {
  const shellK = pr(g, 0, 22);
  return (
    <div style={{ position: "absolute", inset: 0, background: C.body }}>
      <Ambient drift={g / 1170} />
      <Shell x={SHELL.x} y={SHELL.y + 40 * (1 - shellK)} w={SHELL.w} h={SHELL.h} style={{ opacity: shellK }}>
        <div style={{ position: "absolute", left: -SHELL.x, top: -SHELL.y, width: 1920, height: 1080 }}>
          <TopLine g={g} />
          <BottomLine g={g} />
          <Tangle g={g} />
          {ORDER.map((id) => <ThreadCard key={id} g={g} id={id} />)}
          <HookTags g={g} />
          <MeetText g={g} />
          <FloatTag g={g} a={K.expert - 6} b={K.from} x={990} y={290} text="Business-minded, hands-on" icon="check" ph={0.4} />
          <FloatTag g={g} a={K.right - 4} b={K.adrian2} x={700} y={330} text="A clear direction" icon="arrow-up-right" ph={1.2} />
          <FloatTag g={g} a={K.solutions - 6} b={K.adrian2} x={1500} y={720} text="A real-world advantage" glyph="✳" dark ph={3.1} />
          <FloatTag g={g} a={K.team - 8} b={CARDS_OUT} x={1560} y={300} text="Expertise, when you need it" glyph="✳" dark ph={2.2} />
          <ArrowLine g={g} />
          <Connect g={g} />
          <Sculpt g={g} />
          <Statement g={g} />
          <FloatTag g={g} a={K.your4 - 6} b={K.ready + 30} x={1030} y={360} text="A clear direction" icon="arrow-up-right" ph={0.8} />
          <FloatTag g={g} a={K.business2 - 4} b={K.ready + 30} x={1600} y={720} text="A real-world advantage" glyph="✳" dark ph={2.6} />
          <Panel g={g} />
        </div>
      </Shell>
    </div>
  );
};

