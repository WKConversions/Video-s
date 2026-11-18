// Group D: pillar 3, Growth Technology. S9 text, S10 SEO & GEO (search + AI answer), S11 conversion then product marketing.
// Motion pass: content that acts (feeds scroll, answer streams, rank climbs, page recording plays); no camera or drift.
import React from "react";
import { C, FONT, GRAD, SHADOW, Stage, Words, Eyebrow, Win, Btn, Chip, E, S, ease, mix, clamp, pressAt, Ripple } from "../kit";
import type { Group, Scene, HandKey, Sfx } from "../types";
import { RowFeed, LineFeed, VPage, scrollOff } from "./D_parts";

const Box: React.FC<{ x: number; y: number; w: number; h: number; bg?: string; r?: number; style?: React.CSSProperties; children?: React.ReactNode }> = ({ x, y, w, h, bg = C.card, r, style, children }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: r ?? Math.min(h / 2, 12), background: bg, ...style }}>{children}</div>
);

// ---------------- S9: text ----------------
const S9: Scene = ({ t }) => {
  const sub = S(t, 0.35), feed = S(t, -0.25, { damping: 15 });
  const heights = [0.3, 0.45, 0.4, 0.7, 0.85, 1], cols = [C.cyan, C.mint, C.indigo, C.cyan, C.mint, "url(#g9)"];
  return (
    <Stage t={t} tint={C.mint} tint2={C.cyan}>
      <Eyebrow t={t} t0={-0.15} text="PILLAR 03" y={330} color={C.mint} />
      <Words t={t} t0={0} text={"Growth\nTechnology"} size={124} y={530} hi={{ Growth: GRAD.growth }} stagger={0.1} />
      <div style={{ position: "absolute", left: 960, top: 740, transform: `translate3d(-50%, calc(-50% + ${(1 - sub) * 24}px), 0)`, willChange: "transform", opacity: clamp(sub * 1.5), fontFamily: FONT, fontWeight: 600, fontSize: 34, color: C.sub, letterSpacing: -0.5, whiteSpace: "nowrap" }}>Visibility. Conversion. Product marketing.</div>
      {/* growth: solid bars rising one after another */}
      <div style={{ position: "absolute", left: 110, top: 400, width: 420, height: 480 }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: 420, height: 450, overflow: "hidden" }}>
          {heights.map((h, i) => {
            const p = S(t, -0.25 + i * 0.13, { damping: 13 }), full = 420 * h;
            return <div key={i} style={{ position: "absolute", left: i * 68, top: 450 - full, width: 52, height: full, borderRadius: 14, background: i === 5 ? `linear-gradient(to top, ${C.mint}, ${C.cyan})` : cols[i], transform: `translate3d(0, ${(1 - p) * full}px, 0)`, willChange: "transform" }} />;
          })}
        </div>
        <div style={{ position: "absolute", left: -6, top: 452, width: 400, height: 10, borderRadius: 5, background: C.navy }} />
      </div>
      {/* visibility: a feed of results streaming up */}
      <div style={{ opacity: clamp(feed * 2), transform: `translateY(${(1 - feed) * 60}px)` }}>
        <RowFeed t={t} x={1430} y={250} w={390} h={640} speed={540} pitch={104} seed={9} />
      </div>
    </Stage>
  );
};

// ---------------- S10: SEO & GEO ----------------
const SX = 120, SW = 900, ROW = 130, R0 = 300, CH = 108, EXTRA = 230;
const Sparkle: React.FC<{ s: number }> = ({ s }) => (
  <svg width={s} height={s} viewBox="0 0 24 24"><path d="M12 2 L14 10 L22 12 L14 14 L12 22 L10 14 L2 12 L10 10 Z" fill="#fff" /></svg>
);
const S10: Scene = ({ t }) => {
  const q = "your business", n = Math.floor(clamp(t / 0.8) * q.length);
  const cfg = { damping: 13, stiffness: 140 };
  const sw = [S(t, 0.7, cfg), S(t, 1.15, cfg), S(t, 1.6, cfg)];
  const fillMine = E(t, 1.85, 0.45, ease.out), press = pressAt(t, 2.3), ex = E(t, 2.45, 0.55, ease.inOut);
  const chipOn = S(t, 2.0, { damping: 11 }), chipPulse = Math.max(0, Math.sin(Math.PI * clamp((t - 2.41) / 0.6)));
  const panel = S(t, -0.2, { damping: 16 });
  const cards = [
    { i: 0, slot: sw[2], col: C.indigo }, { i: 1, slot: 1 + sw[1], col: C.coral }, { i: 2, slot: 2 + sw[0], col: C.amber },
    { i: 3, slot: 3 - sw[0] - sw[1] - sw[2], col: C.mint }, { i: 4, slot: 4, col: C.violet },
  ];
  return (
    <Stage t={t} tint={C.mint} tint2={C.cyan} grid>
      {/* Spotlight-like search bar */}
      <Box x={SX} y={140} w={SW} h={110} bg="rgba(255,255,255,.96)" r={55} style={{ boxShadow: SHADOW.card, border: `1px solid ${C.line}`, transform: `scale(${mix(0.94, 1, S(t, -0.25))})`, opacity: clamp(S(t, -0.25) * 2) }}>
        <svg width={48} height={48} viewBox="0 0 48 48" style={{ position: "absolute", left: 38, top: 31 }}><circle cx={21} cy={21} r={13} fill="none" stroke={C.navy2} strokeWidth={5} /><line x1={31} y1={31} x2={42} y2={42} stroke={C.navy2} strokeWidth={5} strokeLinecap="round" /></svg>
        <div style={{ position: "absolute", left: 110, top: 0, height: 110, display: "flex", alignItems: "center", fontFamily: FONT, fontWeight: 600, fontSize: 44, color: C.navy, letterSpacing: -1 }}>
          {q.slice(0, n)}<span style={{ display: "inline-block", width: 3, height: 48, background: C.cyan, marginLeft: 4, opacity: Math.sin(t * 12) > -0.2 ? 1 : 0 }} />
        </div>
        <Chip text="Search" size={20} color={C.sub} bg={C.muted} style={{ position: "absolute", right: 30, top: 34 }} />
      </Box>
      {/* result cards: the rank climbs slot by slot, the rank digit rolls like an odometer */}
      {[...cards].sort((a, b) => (a.i === 3 ? 1 : 0) - (b.i === 3 ? 1 : 0)).map(({ i, slot, col }) => {
        const mine = i === 3, p = S(t, -0.25 + i * 0.08);
        const y = R0 + slot * ROW + (mine ? 0 : ex * EXTRA) + (1 - p) * 140;
        const h = CH + (mine ? ex * EXTRA : 0);
        const op = clamp(p * 2) * (mine ? 1 : 1 - 0.8 * ex);
        return (
          <div key={i} style={{ position: "absolute", left: SX, top: R0, width: SW, height: h, borderRadius: 24, background: C.white, overflow: "hidden", opacity: op, willChange: "transform",
            boxShadow: mine ? `0 ${20 + 20 * fillMine}px ${50 + 20 * fillMine}px rgba(34,199,160,${0.14 + 0.2 * fillMine})` : SHADOW.soft, border: `${mine ? 2 : 1}px solid ${mine ? `rgba(34,199,160,${0.3 + 0.7 * fillMine})` : C.line}`,
            transform: `translate3d(0, ${y - R0}px, 0) scale(${1 - 0.025 * (mine ? press : 0)})` }}>
            {mine && <div style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%", background: GRAD.growth, transform: `scaleX(${fillMine})`, transformOrigin: "0 50%" }} />}
            <div style={{ position: "absolute", left: 16, top: 16, width: 76, height: 76, borderRadius: 20, background: mine ? C.navy : col, overflow: "hidden" }}>
              <div style={{ transform: `translate3d(0, ${-slot * 76}px, 0)`, willChange: "transform" }}>
                {[1, 2, 3, 4, 5].map((d) => <div key={d} style={{ height: 76, lineHeight: "76px", textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 44, color: "#fff" }}>{d}</div>)}
              </div>
            </div>
            <Box x={116} y={24} w={mine ? 360 : 200 + (i * 53) % 140} h={26} bg={C.navy} r={13} />
            <Box x={116} y={64} w={mine ? 520 : 380 + (i * 71) % 180} h={14} bg={mine && fillMine > 0.6 ? "rgba(255,255,255,.75)" : "#C9D0E2"} r={7} />
            <Box x={116} y={84} w={mine ? 400 : 260 + (i * 37) % 160} h={14} bg={mine && fillMine > 0.6 ? "rgba(255,255,255,.55)" : "#D8DDEA"} r={7} />
            {mine ? (
              <div style={{ position: "absolute", right: 24, top: 28, display: "flex", alignItems: "center", gap: 10, padding: "10px 20px", borderRadius: 30, background: C.white, border: `2px solid ${C.cyan}`, fontFamily: FONT, fontWeight: 700, fontSize: 24, color: C.navy }}>
                <div style={{ width: 16, height: 16, borderRadius: "50%", background: C.cyan }} />Your site
              </div>
            ) : <Box x={SW - 120} y={36} w={90} h={34} bg={col} r={17} style={{ opacity: 0.85 }} />}
            {mine && [0, 1, 2, 3, 4, 5].map((j) => {
              const g = E(t, 2.55 + j * 0.07, 0.5, ease.out), bh = 150 * [0.4, 0.55, 0.5, 0.75, 0.9, 1][j] * g;
              return <div key={j} style={{ position: "absolute", left: 30 + j * 140, top: CH + EXTRA - 22 - bh, width: 110, height: bh, borderRadius: 16, background: j === 5 ? C.navy : "#fff" }} />;
            })}
          </div>
        );
      })}
      <Ripple t={t} c={2.3} x={560} y={R0 + CH / 2} color={C.mint} r={150} />
      {/* AI answer panel: the answer streams and scrolls, then cites "Your site" */}
      <div style={{ position: "absolute", left: 1130, top: 140, width: 670, height: 780, borderRadius: 40, background: "linear-gradient(165deg,#1F2B3D,#2B4260)", boxShadow: SHADOW.lift, opacity: clamp(panel * 2), transform: `translateY(${(1 - panel) * 60}px)` }}>
        <div style={{ position: "absolute", left: 44, top: 40, width: 76, height: 76, borderRadius: "50%", background: GRAD.ai, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 12px 30px rgba(124,108,255,.4)" }}><Sparkle s={42} /></div>
        <Box x={144} y={58} w={210} h={22} bg="#fff" r={11} /><Box x={144} y={92} w={130} h={14} bg="rgba(255,255,255,.4)" r={7} />
        <Box x={300} y={140} w={326} h={60} bg={C.cyan} r={30} style={{ opacity: S(t, 0.1) }}><Box x={28} y={21} w={200} h={18} bg={C.navy} r={9} /></Box>
        <LineFeed t={t} x={44} y={232} w={582} h={460} speed={420} />
        <div style={{ position: "absolute", left: 44, top: 704, display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 26px", borderRadius: 40, background: C.white, fontFamily: FONT, fontWeight: 700, fontSize: 28, color: C.navy,
            border: `3px solid ${chipOn > 0.3 ? C.cyan : "rgba(255,255,255,.3)"}`, opacity: 0.4 + 0.6 * clamp(chipOn), transform: `scale(${mix(0.9, 1, chipOn) + 0.08 * chipPulse})`, boxShadow: `0 0 ${60 * chipPulse + 20 * clamp(chipOn)}px rgba(56,200,255,.6)` }}>
            <div style={{ width: 18, height: 18, borderRadius: "50%", background: C.cyan }} />Your site
          </div>
          <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 24, color: C.mint, opacity: clamp(chipOn) }}>Source</div>
        </div>
      </div>
    </Stage>
  );
};

// ---------------- S11: conversion, then product marketing ----------------
const WX = 140, WY = 130, PLX = 240, PLY = 155;
const tp = 2.71;
/** page-recording scroll offset (design px): a calm preview until play is pressed, then it really plays */
const recOff = (t: number) => {
  const pre = scrollOff(t, 1.5, 420);
  if (t < tp) return pre;
  const u = t - tp;
  return scrollOff(tp, 1.5, 420) + 420 * u + 300 * (u - 0.25 * (1 - Math.exp(-u / 0.25)));
};
const S11: Scene = ({ t }) => {
  const out = E(t, 1.45, 0.7, ease.inOut), rise = S(t, 1.45, { damping: 16 });
  const press = pressAt(t, 0.9), pPress = pressAt(t, 2.6);
  const fill = E(t, -0.1, 1.5, ease.out), ring = 2 * Math.PI * 110;
  const flip = E(t, 1.0, 0.45, ease.out), book = S(t, 1.0, { damping: 12 });
  const playing = t > tp, off = recOff(t), prog = clamp((t - tp) / 1.2), btnGone = E(t, tp, 0.25);
  const win = S(t, -0.25, { damping: 16 });
  const clips = [[120, C.indigo], [90, C.mint], [140, C.coral], [110, C.violet], [130, C.cyan], [100, C.amber]] as [number, string][];
  let cx = 22;
  return (
    <Stage t={t} tint={C.cyan} tint2={C.mint}>
      {/* ----- first half: landing page that converts ----- */}
      <div style={{ position: "absolute", inset: 0, transform: `translateY(${-1150 * out}px)` }}>
        <div style={{ opacity: clamp(win * 2), transform: `translateY(${(1 - win) * 70}px)` }}>
          <Win x={WX} y={WY} w={1180} h={760} title="">
            <Box x={60} y={50} w={460} h={48} bg={C.navy} r={24} />
            <Box x={60} y={114} w={320} h={48} bg={GRAD.growth} r={24} />
            <Box x={60} y={182} w={420} h={18} bg="#BFC8DC" r={9} /><Box x={60} y={212} w={300} h={18} bg="#D8DDEA" r={9} />
            <Btn x={310} y={286} text="Book a call" size={30} press={press} />
            {/* conversion ring + bars */}
            <svg width={280} height={280} viewBox="0 0 280 280" style={{ position: "absolute", left: 40, top: 376 }}>
              <defs><linearGradient id="rg11" x1="0" x2="1"><stop offset="0" stopColor={C.mint} /><stop offset="1" stopColor={C.cyan} /></linearGradient></defs>
              <circle cx={140} cy={140} r={110} fill="none" stroke="#DDE3F0" strokeWidth={34} />
              <circle cx={140} cy={140} r={110} fill="none" stroke="url(#rg11)" strokeWidth={34} strokeLinecap="round" strokeDasharray={ring} strokeDashoffset={ring * (1 - 0.1 - 0.82 * fill)} transform="rotate(-90 140 140)" />
              <path d="M96,160 L124,128 L146,148 L186,102" fill="none" stroke={C.navy} strokeWidth={13} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {[0.35, 0.5, 0.65, 0.85, 1].map((h, i) => {
              const hh = 260 * h * E(t, -0.1 + i * 0.12, 0.7, ease.out);
              return <Box key={i} x={350 + i * 48} y={650 - hh} w={36} h={hh} bg={i === 4 ? GRAD.growth : i % 2 ? C.cyan : C.indigo} r={12} />;
            })}
            {/* bookings streaming in */}
            <RowFeed t={t} x={600} y={24} w={540} h={650} speed={540} pitch={104} seed={4} card={false} style={{ background: "#fff" }} />
          </Win>
        </div>
        <Ripple t={t} c={0.9} x={450} y={468} r={110} />
        {/* booking card flips in */}
        <div style={{ position: "absolute", left: 700, top: 500, width: 470, height: 300, perspective: 1400, opacity: clamp(flip * 3) }}>
          <div style={{ position: "absolute", inset: 0, borderRadius: 30, background: C.white, boxShadow: SHADOW.lift, border: `1px solid ${C.line}`, transform: `rotateY(${(1 - flip) * -88}deg) scale(${mix(0.8, 1, book)})`, transformOrigin: "0% 50%" }}>
            <div style={{ position: "absolute", left: 30, top: 28, width: 72, height: 72, borderRadius: "50%", background: C.green, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${S(t, 1.2, { damping: 9 })})` }}>
              <svg width={40} height={40} viewBox="0 0 24 24"><path d="M5 12.5 L10 17.5 L19 7" fill="none" stroke="#fff" strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - E(t, 1.25, 0.3, ease.out)} /></svg>
            </div>
            <div style={{ position: "absolute", left: 124, top: 42, fontFamily: FONT, fontWeight: 800, fontSize: 38, color: C.navy, letterSpacing: -1 }}>Confirmed</div>
            <Box x={124} y={90} w={170} h={16} bg="#C9D0E2" r={8} />
            {[0, 1, 2].map((i) => <Box key={i} x={30 + i * 146} y={136} w={130} h={58} bg={i === 1 ? C.green : C.muted} r={16} style={{ opacity: clamp(S(t, 1.15 + i * 0.08) * 1.5) }}><Box x={26} y={22} w={78} h={14} bg={i === 1 ? "#fff" : "#C9D0E2"} r={7} /></Box>)}
            <Box x={30} y={218} w={410} h={52} bg={GRAD.growth} r={26} />
          </div>
        </div>
      </div>

      {/* ----- second half: the product-marketing video plays, in three formats at once ----- */}
      <div style={{ position: "absolute", inset: 0, opacity: clamp(rise * 1.6), transform: `translateY(${(1 - rise) * 1100}px)` }}>
        <div style={{ position: "absolute", left: PLX, top: PLY, width: 800, height: 450, borderRadius: 30, overflow: "hidden", boxShadow: SHADOW.lift }}>
          <VPage off={off} />
          {playing && <div style={{ position: "absolute", left: 0, bottom: 0, width: 800, height: 16, background: "rgba(41,58,81,.35)" }}><div style={{ width: 800, height: 16, background: GRAD.growth, transform: `scaleX(${prog})`, transformOrigin: "0 50%" }} /></div>}
          {btnGone < 1 && <div style={{ position: "absolute", left: 400 - 56, top: 225 - 56, width: 112, height: 112, borderRadius: "50%", background: "rgba(255,255,255,.95)", display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${(1 - 0.1 * pPress) * (1 - btnGone)})`, boxShadow: SHADOW.card }}>
            <div style={{ marginLeft: 8, width: 0, height: 0, borderTop: "26px solid transparent", borderBottom: "26px solid transparent", borderLeft: `42px solid ${C.navy}` }} />
          </div>}
        </div>
        <Ripple t={t} c={2.6} x={640} y={380} r={130} />
        {/* timeline clips */}
        <div style={{ position: "absolute", left: PLX, top: 640, width: 800, height: 130, borderRadius: 26, background: C.white, boxShadow: SHADOW.card, border: `1px solid ${C.line}` }}>
          {clips.map(([w, col], i) => {
            const x = cx; cx += w + 8; const p = S(t, 1.7 + i * 0.1);
            return <div key={i} style={{ position: "absolute", left: x, top: 24, width: w, height: 82, borderRadius: 16, background: col, transform: `scaleX(${p})`, transformOrigin: "0 50%", opacity: clamp(p * 2) }} />;
          })}
          {playing && <div style={{ position: "absolute", left: 22, top: 8, width: 6, height: 114, borderRadius: 3, background: C.navy, transform: `translate3d(${prog * 740}px, 0, 0)`, willChange: "transform" }}><div style={{ position: "absolute", left: -7, top: -6, width: 20, height: 20, borderRadius: "50%", background: C.navy }} /></div>}
        </div>
        {/* the same recording in 16:9, 9:16 and 1:1 */}
        {[
          { w: 560, h: 315, x: 1120, y: 155, lab: "16:9", d: 1.75, col: C.cyan, sc: 0.7, ox: 0 },
          { w: 190, h: 338, x: 1120, y: 500, lab: "9:16", d: 1.95, col: C.mint, sc: 0.751, ox: -(800 * 0.751 - 190) / 2 },
          { w: 338, h: 338, x: 1330, y: 500, lab: "1:1", d: 2.15, col: C.violet, sc: 0.751, ox: -(800 * 0.751 - 338) / 2 },
        ].map((f, i) => {
          const p = S(t, f.d, { damping: 12 });
          return (
            <div key={i} style={{ position: "absolute", left: f.x, top: f.y, width: f.w, height: f.h, borderRadius: 24, background: "#fff", border: `4px solid ${f.col}`, boxShadow: SHADOW.card, overflow: "hidden", opacity: clamp(p * 1.5), transform: `translateY(${(1 - p) * 140}px) scale(${mix(0.7, 1, p)})` }}>
              <div style={{ position: "absolute", left: f.ox, top: (f.h - 450 * f.sc) / 2, width: 800, height: 450, transform: `scale(${f.sc})`, transformOrigin: "0 0" }}><VPage off={off} /></div>
              <div style={{ position: "absolute", right: 10, top: 10, padding: "5px 14px", borderRadius: 16, background: f.col, color: "#fff", fontFamily: FONT, fontWeight: 700, fontSize: 20 }}>{f.lab}</div>
            </div>
          );
        })}
      </div>
    </Stage>
  );
};

const hand: Record<string, HandKey[]> = {
  S10: [{ at: 1.0, x: 700, y: 195 }, { at: 2.3, x: 560, y: R0 + CH / 2, click: true }],
  S11: [{ at: 0.9, x: 450, y: 468, click: true }, { at: 2.6, x: 640, y: 380, click: true }],
};
const sfx: Record<string, Sfx[]> = {
  S9: [{ t: -0.05, kind: "whoosh", note: "headline words in" }, { t: 0.45, kind: "pop", note: "bars rise, feed streams" }],
  S10: [{ t: 0.0, kind: "type", note: "query types" }, { t: 0.7, kind: "slide", note: "rank 4 to 3" }, { t: 1.15, kind: "slide", note: "rank 3 to 2" }, { t: 1.6, kind: "slide", note: "rank 2 to 1" },
    { t: 2.0, kind: "success", note: "source chip lights" }, { t: 2.41, kind: "click", note: "top result click" }, { t: 2.6, kind: "pop", note: "result opens, bars grow" }],
  S11: [{ t: 1.01, kind: "click", note: "CTA click" }, { t: 1.1, kind: "pop", note: "booking card flips in" }, { t: 1.3, kind: "success", note: "green check" }, { t: 1.55, kind: "slide", note: "video takes over" },
    { t: 1.85, kind: "pop", note: "format cards" }, { t: 2.71, kind: "click", note: "play pressed" }],
};
export const GROUP: Group = { scenes: { S9, S10, S11 }, hand, sfx };
