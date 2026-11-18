// Group D: pillar 3, Growth Technology. S9 text, S10 SEO & GEO (search + AI answer), S11 conversion then product marketing.
import React from "react";
import { C, FONT, GRAD, SHADOW, Stage, Words, Eyebrow, Win, Btn, Chip, E, S, ease, drift, mix, clamp, pressAt, Ripple } from "../kit";
import type { Group, Scene, HandKey, Sfx } from "../types";

const Box: React.FC<{ x: number; y: number; w: number; h: number; bg?: string; r?: number; style?: React.CSSProperties; children?: React.ReactNode }> = ({ x, y, w, h, bg = C.card, r, style, children }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: r ?? Math.min(h / 2, 12), background: bg, ...style }}>{children}</div>
);
const cam = (t: number, dur: number, amp = 0.035) => `scale(${1 + amp * E(t, -0.3, dur + 0.6, ease.smooth)}) translate(${drift(t, 7, 6)}px, ${drift(t, 9, 4, 1)}px)`;

// ---------------- S9: text ----------------
const S9: Scene = ({ t, dur }) => {
  const sub = S(t, 0.35), line = E(t, 0.1, 1.2, ease.out), glass = S(t, 0.2);
  const spark = "M0,120 L40,96 L70,108 L120,60 L150,76 L210,18";
  return (
    <Stage t={t} tint={C.mint} tint2={C.cyan}>
      <div style={{ position: "absolute", inset: 0, transform: cam(t, dur, 0.03) }}>
        <Eyebrow t={t} t0={-0.15} text="PILLAR 03" y={330} color={C.mint} />
        <Words t={t} t0={0} text={"Growth\nTechnology"} size={124} y={530} hi={{ Growth: GRAD.growth }} stagger={0.1} />
        <div style={{ position: "absolute", left: 960, top: 740, transform: `translate(-50%,-50%) translateY(${(1 - sub) * 24}px)`, opacity: clamp(sub * 1.5), fontFamily: FONT, fontWeight: 600, fontSize: 34, color: C.sub, letterSpacing: -0.5, whiteSpace: "nowrap" }}>Visibility. Conversion. Product marketing.</div>
        {/* rising spark line, bottom left */}
        <svg width={240} height={150} style={{ position: "absolute", left: 250, top: 640 + drift(t, 5, 8), opacity: clamp(glass * 2) * 0.95 }} viewBox="-10 0 240 150">
          <defs><linearGradient id="sg" x1="0" x2="1"><stop offset="0" stopColor={C.mint} /><stop offset="1" stopColor={C.cyan} /></linearGradient></defs>
          <path d={spark} fill="none" stroke="url(#sg)" strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - line} />
          <circle cx={210} cy={18} r={11 + 3 * Math.sin(t * 6)} fill={C.cyan} opacity={line > 0.95 ? 1 : 0} />
        </svg>
        {/* search glass, top right */}
        <div style={{ position: "absolute", left: 1500 + drift(t, 6, 10), top: 330 + drift(t, 5, 12, 1), transform: `scale(${glass}) rotate(${drift(t, 6, 6)}deg)` }}>
          <svg width={150} height={150} viewBox="0 0 150 150">
            <circle cx={62} cy={62} r={42} fill={`${C.mint}22`} stroke={C.mint} strokeWidth={12} />
            <line x1={94} y1={94} x2={134} y2={134} stroke={C.cyan} strokeWidth={14} strokeLinecap="round" />
            <path d="M40,66 Q62,40 84,60" stroke="#fff" strokeWidth={6} fill="none" strokeLinecap="round" opacity={0.8} />
          </svg>
        </div>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ position: "absolute", left: 1400 + i * 90 + drift(t, 4 + i, 14, i), top: 760 + drift(t, 5 + i, 18, i * 2), width: 18 + i * 8, height: 18 + i * 8, borderRadius: "50%", background: [C.mint, C.cyan, C.green][i], opacity: 0.35 * S(t, 0.4 + i * 0.1) }} />
        ))}
      </div>
    </Stage>
  );
};

// ---------------- S10: SEO & GEO ----------------
const SX = 120, SW = 900, ROW = 130, R0 = 300, CH = 108;
const Sparkle: React.FC<{ s: number; spin?: number }> = ({ s, spin = 0 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" style={{ transform: `rotate(${spin}deg)` }}><path d="M12 2 L14 10 L22 12 L14 14 L12 22 L10 14 L2 12 L10 10 Z" fill="#fff" /></svg>
);
const S10: Scene = ({ t, dur }) => {
  const q = "your business", n = Math.floor(clamp((t - 0.0) / 0.8) * q.length);
  const climb = S(t, 0.95, { damping: 13, stiffness: 120 });
  const win = E(t, 1.7, 0.5, ease.out);   // soft mint highlight arrives as it reaches the top
  const press = pressAt(t, 2.3);
  const widths = [0.92, 0.78, 0.88, 0.5];
  const chipOn = S(t, 2.0, { damping: 11 }), chipPulse = Math.max(0, Math.sin(Math.PI * clamp((t - 2.41) / 0.6)));
  const cards = [0, 1, 2, 3, 4].map((i) => {
    const slot = i === 3 ? 3 - 3 * climb : i < 3 ? i + climb : i;
    const mine = i === 3;
    const p = S(t, -0.15 + i * 0.09);
    return { i, mine, y: R0 + slot * ROW, p };
  });
  return (
    <Stage t={t} tint={C.mint} tint2={C.cyan} grid>
      <div style={{ position: "absolute", inset: 0, transform: cam(t, dur) }}>
        {/* Spotlight-like search bar */}
        <Box x={SX} y={140} w={SW} h={110} bg="rgba(255,255,255,.92)" r={55} style={{ boxShadow: SHADOW.card, border: `1px solid ${C.line}`, transform: `scale(${mix(0.94, 1, S(t, -0.25))})`, opacity: clamp(S(t, -0.25) * 2) }}>
          <svg width={48} height={48} viewBox="0 0 48 48" style={{ position: "absolute", left: 38, top: 31 }}><circle cx={21} cy={21} r={13} fill="none" stroke={C.navy2} strokeWidth={5} /><line x1={31} y1={31} x2={42} y2={42} stroke={C.navy2} strokeWidth={5} strokeLinecap="round" /></svg>
          <div style={{ position: "absolute", left: 110, top: 0, height: 110, display: "flex", alignItems: "center", fontFamily: FONT, fontWeight: 600, fontSize: 44, color: C.navy, letterSpacing: -1 }}>
            {q.slice(0, n)}<span style={{ display: "inline-block", width: 3, height: 48, background: C.cyan, marginLeft: 4, opacity: Math.sin(t * 12) > -0.2 ? 1 : 0 }} />
          </div>
          <Chip text="Search" size={20} color={C.sub} bg={C.muted} style={{ position: "absolute", right: 30, top: 34 }} />
        </Box>
        {/* result cards */}
        {[...cards].sort((a, b) => (a.mine ? 1 : 0) - (b.mine ? 1 : 0)).map(({ i, mine, y, p }) => {
          const hl = mine ? win : 0;
          return (
            <div key={i} style={{ position: "absolute", left: SX, top: y, width: SW, height: CH, borderRadius: 24, background: mine ? `linear-gradient(100deg, #fff, ${mix(0, 1, hl) > 0 ? "#E4FBF4" : "#fff"})` : C.white,
              boxShadow: mine ? `0 ${20 + 20 * hl}px ${50 + 20 * hl}px rgba(34,199,160,${0.12 + 0.2 * hl})` : SHADOW.soft, border: `${mine ? 2 : 1}px solid ${mine ? `rgba(34,199,160,${0.25 + 0.75 * hl})` : C.line}`,
              opacity: clamp(p * 1.5), transform: `translateY(${(1 - p) * 40 + (mine ? -8 * hl : 0)}px) scale(${(mine ? 1 + 0.015 * hl : 1) - 0.025 * (mine ? press : 0)})` }}>
              <Box x={28} y={30} w={48} h={48} bg={mine ? GRAD.growth : C.card} r={14} />
              <Box x={100} y={28} w={mine ? 380 : 240 + (i * 53) % 140} h={18} bg={mine ? C.navy : "#D7DAE6"} r={9} />
              <Box x={100} y={58} w={mine ? 600 : 420 + (i * 71) % 180} h={12} bg={C.card} r={6} />
              <Box x={100} y={78} w={mine ? 460 : 300 + (i * 37) % 160} h={12} bg={C.card} r={6} />
              {mine && (
                <div style={{ position: "absolute", right: 28, top: 32, display: "flex", alignItems: "center", gap: 10, padding: "10px 20px", borderRadius: 30, background: C.white, border: `2px solid ${C.cyan}`, fontFamily: FONT, fontWeight: 700, fontSize: 22, color: C.navy, boxShadow: `0 0 ${24 * hl}px rgba(56,200,255,.5)` }}>
                  <div style={{ width: 16, height: 16, borderRadius: "50%", background: C.cyan }} />Your site
                </div>
              )}
            </div>
          );
        })}
        <Ripple t={t} c={2.3} x={560} y={R0 + CH / 2} color={C.mint} r={150} />
        {/* AI answer panel */}
        <div style={{ position: "absolute", left: 1130, top: 140, width: 670, height: 780, borderRadius: 40, background: "rgba(255,255,255,.88)", boxShadow: SHADOW.lift, border: `1px solid ${C.line}`, opacity: clamp(S(t, 0.0) * 2), transform: `translateY(${(1 - S(t, 0.0)) * 60}px) rotate(${drift(t, 8, 0.6)}deg)` }}>
          <div style={{ position: "absolute", left: 44, top: 44, width: 76, height: 76, borderRadius: "50%", background: GRAD.ai, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 12px 30px rgba(124,108,255,.4)" }}>
            <Sparkle s={42} spin={t * 40} />
          </div>
          <Box x={144} y={62} w={200} h={20} bg={C.navy} r={10} />
          <Box x={144} y={94} w={120} h={14} bg={C.card} r={7} />
          {/* user question bubble */}
          <Box x={300} y={160} w={326} h={64} bg={C.cyanSoft} r={32} style={{ opacity: S(t, 0.2) }}><Box x={28} y={24} w={200} h={16} bg={C.cyan} r={8} style={{ opacity: 0.7 }} /></Box>
          {/* typed answer bars */}
          {widths.map((w, i) => {
            const k = E(t, 0.85 + i * 0.28, 0.4, ease.out);
            return <Box key={i} x={44} y={290 + i * 62} w={582 * w * k} h={24} bg={i % 2 ? "#E1E4EE" : "#D0D5E4"} r={12} />;
          })}
          {widths.map((w, i) => <Box key={"b" + i} x={44} y={316 + i * 62} w={Math.min(582 * w * 0.7, 582 * 0.7) * E(t, 1.0 + i * 0.28, 0.4, ease.out)} h={14} bg={C.card} r={7} />)}
          {/* cursor caret of typing */}
          {t > 0.85 && t < 2.1 && <Box x={44 + 582 * 0.5 * E(t, 0.85, 1.2, (x) => x)} y={300 + Math.min(3, Math.floor((t - 0.85) / 0.28)) * 62 + 24} w={4} h={22} bg={C.violet} r={2} style={{ opacity: Math.sin(t * 14) > 0 ? 1 : 0.2 }} />}
          {/* source chip */}
          <div style={{ position: "absolute", left: 44, top: 600, display: "flex", alignItems: "center", gap: 12 }}>
            <Box x={0} y={0} w={0} h={0} bg="transparent" />
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 26px", borderRadius: 40, background: C.white, fontFamily: FONT, fontWeight: 700, fontSize: 26, color: C.navy,
              border: `2px solid ${chipOn > 0.3 ? C.cyan : C.line}`, opacity: 0.35 + 0.65 * clamp(chipOn), transform: `scale(${mix(0.9, 1, chipOn) + 0.06 * chipPulse})`,
              boxShadow: `0 0 ${(40 * clamp(chipOn) * 0.6 + 50 * chipPulse)}px rgba(56,200,255,.55), 0 0 ${30 * chipOn * 0.4}px rgba(34,199,160,.4)` }}>
              <div style={{ width: 18, height: 18, borderRadius: "50%", background: C.cyan }} />Your site
            </div>
            <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 22, color: C.mint, opacity: clamp(chipOn) }}>Source</div>
          </div>
          <Box x={44} y={690} w={420} h={14} bg={C.card} r={7} />
          <Box x={44} y={720} w={300} h={14} bg={C.card} r={7} />
        </div>
      </div>
    </Stage>
  );
};

// ---------------- S11: conversion, then product marketing ----------------
const MiniPage: React.FC<{ w: number; h: number; k?: number; cta?: boolean }> = ({ w, h, k = 1, cta = true }) => (
  <div style={{ position: "absolute", inset: 0 }}>
    <Box x={w * 0.06} y={h * 0.06} w={w * 0.88} h={h * 0.5} bg="linear-gradient(120deg,#E6F7FF,#E4FBF4)" r={w * 0.04}>
      <Box x={w * 0.06} y={h * 0.1} w={w * 0.5} h={h * 0.07} bg={C.navy} r={h * 0.035} />
      <Box x={w * 0.06} y={h * 0.2} w={w * 0.36} h={h * 0.05} bg="#C9D3E4" r={h * 0.025} />
      {cta && <Box x={w * 0.06} y={h * 0.31} w={w * 0.24} h={h * 0.1} bg={C.cyan} r={h * 0.05} />}
      <Box x={w * 0.62} y={h * 0.08} w={w * 0.22} h={h * 0.3} bg={GRAD.growth} r={w * 0.03} style={{ opacity: 0.85 }} />
    </Box>
    {[0, 1, 2].map((i) => <Box key={i} x={w * (0.06 + i * 0.3)} y={h * 0.64} w={w * 0.27} h={h * 0.26} bg={C.card} r={w * 0.025} />)}
  </div>
);

const S11: Scene = ({ t, dur }) => {
  const back = E(t, 1.5, 0.8, ease.inOut);       // page slides back
  const front = S(t, 1.55, { damping: 15 });     // video strip takes the front
  const cta = { x: 450, y: 468 }, press = pressAt(t, 0.9);
  const book = S(t, 1.05, { damping: 12 });
  const fill = E(t, 0.95, 0.9, ease.out);
  const ring = 2 * Math.PI * 100;
  const play = { x: 640, y: 380 }, pPress = pressAt(t, 2.6), run = clamp((t - 2.71) / 3.2);
  const playing = t > 2.71;
  return (
    <Stage t={t} tint={C.cyan} tint2={C.mint}>
      <div style={{ position: "absolute", inset: 0, transform: cam(t, dur, 0.03) }}>
        {/* ----- first half: landing page ----- */}
        <div style={{ position: "absolute", inset: 0, transform: `translate(${-120 * back}px, ${-60 * back}px) scale(${1 - 0.22 * back})`, opacity: 1 - 0.95 * back, filter: `blur(${5 * back}px)`, transformOrigin: "50% 50%" }}>
          <div style={{ opacity: clamp(S(t, -0.2) * 2), transform: `translateY(${(1 - S(t, -0.2)) * 50}px)` }}>
            <Win x={220} y={170} w={1060} h={700} title="">
              <MiniPage w={1060} h={648} cta={false} />
              <Btn x={230} y={248} text="Book a call" size={26} press={press} />
              <Ripple t={t} c={0.9} x={230} y={248} r={110} />
            </Win>
          </div>
          {/* booking card */}
          <div style={{ position: "absolute", left: 770, top: 500, width: 460, height: 290, borderRadius: 30, background: C.white, boxShadow: SHADOW.lift, border: `1px solid ${C.line}`, opacity: clamp(book * 1.6), transform: `scale(${mix(0.6, 1, book)}) translateY(${drift(t, 4, 5)}px)`, transformOrigin: "20% 0%" }}>
            <div style={{ position: "absolute", left: 30, top: 28, width: 64, height: 64, borderRadius: "50%", background: C.green, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${S(t, 1.25, { damping: 9 })})` }}>
              <svg width={34} height={34} viewBox="0 0 24 24"><path d="M5 12.5 L10 17.5 L19 7" fill="none" stroke="#fff" strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - E(t, 1.3, 0.35, ease.out)} /></svg>
            </div>
            <Box x={116} y={38} w={220} h={20} bg={C.navy} r={10} /><Box x={116} y={70} w={140} h={14} bg={C.card} r={7} />
            {[0, 1, 2].map((i) => (
              <Box key={i} x={30 + i * 140} y={130} w={125} h={56} bg={i === 1 ? "#E4FBF4" : C.muted} r={16} style={{ border: i === 1 ? `2px solid ${C.green}` : `1px solid ${C.line}`, opacity: clamp(S(t, 1.15 + i * 0.08) * 1.5) }}>
                <Box x={24} y={21} w={77} h={14} bg={i === 1 ? C.green : "#D0D5E4"} r={7} style={{ opacity: i === 1 ? 0.8 : 1 }} />
              </Box>
            ))}
            <Box x={30} y={214} w={400} h={46} bg={GRAD.growth} r={23} style={{ opacity: clamp(S(t, 1.4) * 1.5) }} />
          </div>
          {/* conversion meter */}
          <div style={{ position: "absolute", left: 1330, top: 330, width: 320, height: 420, opacity: clamp(S(t, 0.1) * 2), transform: `translateX(${(1 - S(t, 0.1)) * 80}px)` }}>
            <svg width={300} height={300} viewBox="0 0 240 240" style={{ position: "absolute", left: 10, top: 0 }}>
              <circle cx={120} cy={120} r={100} fill="none" stroke={C.card} strokeWidth={22} />
              <circle cx={120} cy={120} r={100} fill="none" stroke="url(#rg)" strokeWidth={22} strokeLinecap="round" strokeDasharray={ring} strokeDashoffset={ring * (1 - 0.15 - 0.78 * fill)} transform="rotate(-90 120 120)" />
              <defs><linearGradient id="rg" x1="0" x2="1"><stop offset="0" stopColor={C.mint} /><stop offset="1" stopColor={C.cyan} /></linearGradient></defs>
              <path d="M84,138 L108,112 L124,126 L156,92" fill="none" stroke={C.navy} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {[0.35, 0.5, 0.65, 0.85, 1].map((h, i) => <Box key={i} x={20 + i * 58} y={410 - 90 * h * E(t, 0.7 + i * 0.12, 0.6, ease.out) - 6 * Math.sin(t * 3 + i)} w={42} h={90 * h * E(t, 0.7 + i * 0.12, 0.6, ease.out) + 6 * Math.sin(t * 3 + i)} bg={i === 4 ? GRAD.growth : "#CFE9F4"} r={12} style={{ top: undefined, bottom: 10 }} />)}
          </div>
        </div>

        {/* ----- second half: video strip ----- */}
        <div style={{ position: "absolute", inset: 0, opacity: clamp(front * 1.4), transform: `translateY(${(1 - front) * 90}px) scale(${mix(0.92, 1, front)})` }}>
          <div style={{ position: "absolute", left: 280, top: 170, width: 720, height: 405, borderRadius: 30, background: "linear-gradient(135deg,#243247,#354C67)", boxShadow: SHADOW.lift, overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, background: `linear-gradient(120deg, rgba(34,199,160,${0.25 + 0.1 * Math.sin(t * 2)}), rgba(56,200,255,.2))` }} />
            <div style={{ position: "absolute", inset: 0, transform: "scale(.8)", opacity: 0.9 }}><MiniPage w={720} h={405} /></div>
            {!playing && <div style={{ position: "absolute", left: play.x - 280 - 56, top: play.y - 170 - 56, width: 112, height: 112, borderRadius: "50%", background: "rgba(255,255,255,.92)", display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${1 - 0.1 * pPress})`, boxShadow: SHADOW.card }}>
              <div style={{ marginLeft: 8, width: 0, height: 0, borderTop: "26px solid transparent", borderBottom: "26px solid transparent", borderLeft: `42px solid ${C.navy}` }} />
            </div>}
            {playing && <div style={{ position: "absolute", left: 28, bottom: 28, display: "flex", gap: 8 }}>{[0, 1, 2, 3].map((i) => <div key={i} style={{ width: 8, height: 14 + 14 * Math.abs(Math.sin(t * 8 + i)), borderRadius: 4, background: "#fff", alignSelf: "flex-end" }} />)}</div>}
          </div>
          <Ripple t={t} c={2.6} x={play.x} y={play.y} r={130} />
          {/* timeline of frames */}
          <div style={{ position: "absolute", left: 280, top: 640, width: 720, height: 130, borderRadius: 26, background: "rgba(255,255,255,.9)", boxShadow: SHADOW.card, border: `1px solid ${C.line}` }}>
            {Array.from({ length: 8 }).map((_, i) => {
              const p = S(t, 1.85 + i * 0.09);
              return <Box key={i} x={22 + i * 84} y={24} w={74} h={82} bg={[C.cyanSoft, "#E4FBF4", "#EEEBFF", "#FFF2DD"][i % 4]} r={14} style={{ opacity: clamp(p * 1.5), transform: `scaleY(${mix(0.4, 1, p)})`, border: `1px solid ${C.line}` }}>
                <Box x={10} y={14} w={54} h={10} bg="#C9D3E4" r={5} /><Box x={10} y={34} w={34} h={8} bg={C.card} r={4} />
                <Box x={10} y={56} w={30} h={14} bg={i % 2 ? C.mint : C.cyan} r={7} />
              </Box>;
            })}
            {playing && <div style={{ position: "absolute", left: 22 + run * 650, top: 10, width: 4, height: 110, borderRadius: 2, background: C.coral, boxShadow: "0 0 14px rgba(255,122,102,.6)" }}><div style={{ position: "absolute", left: -8, top: -6, width: 20, height: 20, borderRadius: "50%", background: C.coral }} /></div>}
          </div>
          {/* three formats */}
          {[
            { w: 380, h: 214, x: 1100, y: 190, lab: "16:9", d: 1.75, col: C.cyan },
            { w: 150, h: 266, x: 1100, y: 440, lab: "9:16", d: 1.95, col: C.mint },
            { w: 214, h: 214, x: 1300, y: 440, lab: "1:1", d: 2.15, col: C.violet },
          ].map((f, i) => {
            const p = S(t, f.d, { damping: 12 });
            return (
              <div key={i} style={{ position: "absolute", left: f.x, top: f.y + drift(t, 4 + i, 8, i), width: f.w, height: f.h, borderRadius: 24, background: "rgba(255,255,255,.7)", backdropFilter: "blur(8px)", border: `2px solid ${f.col}`, boxShadow: SHADOW.card,
                opacity: clamp(p * 1.5), transform: `scale(${mix(0.6, 1, p)}) rotate(${(1 - p) * -6}deg)`, overflow: "hidden" }}>
                <MiniPage w={f.w} h={f.h} />
                <div style={{ position: "absolute", right: 10, top: 10, padding: "4px 12px", borderRadius: 14, background: f.col, color: "#fff", fontFamily: FONT, fontWeight: 700, fontSize: 16 }}>{f.lab}</div>
              </div>
            );
          })}
        </div>
      </div>
    </Stage>
  );
};

const hand: Record<string, HandKey[]> = {
  S10: [{ at: 1.0, x: 700, y: 195 }, { at: 2.3, x: 560, y: R0 + CH / 2, click: true }],
  S11: [{ at: 0.9, x: 450, y: 468, click: true }, { at: 2.6, x: 640, y: 380, click: true }],
};
const sfx: Record<string, Sfx[]> = {
  S9: [{ t: -0.05, kind: "whoosh", note: "headline words in" }, { t: 0.45, kind: "pop", note: "spark and glass" }],
  S10: [{ t: 0.0, kind: "type", note: "query types" }, { t: 0.95, kind: "slide", note: "result climbs" }, { t: 1.0, kind: "type", note: "AI answer types" }, { t: 2.0, kind: "success", note: "source chip lights" }, { t: 2.41, kind: "click", note: "top result click" }],
  S11: [{ t: 1.01, kind: "click", note: "CTA click" }, { t: 1.1, kind: "pop", note: "booking card" }, { t: 1.3, kind: "success", note: "green check" }, { t: 1.6, kind: "slide", note: "page slides back" }, { t: 1.95, kind: "pop", note: "format cards" }, { t: 2.71, kind: "click", note: "play pressed" }],
};
export const GROUP: Group = { scenes: { S9, S10, S11 }, hand, sfx };
