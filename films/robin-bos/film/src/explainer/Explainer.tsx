// Robin Bos — a silent 30-second SaaS-explainer film. One infinite canvas of UI screens; the camera glides between
// them. No audio. Every figure, name and logo comes from ../../harvest/facts.md.
//
// World layout (scene origins; each scene is a 1920×1080 area):
//   S1 profile (0,0) → S2 company (2200,0) → S3 valuation (4400,0)
//                                                  ↓
//   S6 let's talk (0,1300) ← S5 roles (2200,1300) ← S4 dashboard (4400,1300)
import React, { useEffect, useState } from "react";
import { AbsoluteFill, Freeze, Img, continueRender, delayRender, staticFile, useCurrentFrame } from "remotion";
import { fontsReady } from "../fonts";
import { measure } from "../kinetic";
import { ARRIVE, C, MOVE } from "../lib";

export const EXPLAINER_DURATION = 900;
export type ExplainerProps = { blurSamples: number };

// ---------- helpers ----------
const cl = (t: number) => Math.min(1, Math.max(0, t));
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const outCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const k = (g: number, at: number, dur: number, e: (t: number) => number = ARRIVE) => e(cl((g - at) / dur));
/** Fade + rise (+ optional scale) on ARRIVE; opacity over the first 60 % of the move. */
const rise = (g: number, at: number, dur = 20, dy = 40, sc = 0, fade = 0.6): React.CSSProperties => {
  const p = k(g, at, dur);
  return { opacity: cl((g - at) / (dur * fade)), transform: `translateY(${(1 - p) * dy}px) scale(${1 - sc * (1 - p)})` };
};
const FONT = "Manrope";
const SH = {
  card: "0 40px 80px -30px rgba(14,32,56,.22), 0 2px 8px rgba(14,32,56,.06), 0 0 0 1px rgba(14,32,56,.05)",
  soft: "0 12px 30px -12px rgba(14,32,56,.18), 0 0 0 1px rgba(14,32,56,.05)",
};
const BG = "#F5F8FC";
const GREEN = "#2FA86B";

// ---------- scenes and camera ----------
const O = { s1: [0, 0], s2: [2200, 0], s3: [4400, 0], s4: [4400, 1300], s5: [2200, 1300], s6: [0, 1300] } as const;
const centre = (o: readonly [number, number]) => ({ x: o[0] + 960, y: o[1] + 540 });
const PANS = [
  { a: 120, b: 152, from: centre(O.s1), to: centre(O.s2), dip: 0.12 },
  { a: 238, b: 292, from: centre(O.s2), to: centre(O.s3), dip: 0.22 },  // tracks the timeline's 18 months
  { a: 432, b: 464, from: centre(O.s3), to: centre(O.s4), dip: 0.12 },
  { a: 602, b: 634, from: centre(O.s4), to: centre(O.s5), dip: 0.12 },
  { a: 752, b: 784, from: centre(O.s5), to: centre(O.s6), dip: 0.12 },
];
const PUSH = 0.025; // the slow push while a screen holds
const camera = (g: number) => {
  let pos = centre(O.s1), s = 1;
  let holdStart = 0, holdEnd = PANS[0].a;
  for (let i = 0; i < PANS.length; i++) {
    const p = PANS[i];
    if (g < p.a) break;
    const t = cl((g - p.a) / (p.b - p.a));
    const m = MOVE(t);
    pos = { x: lerp(p.from.x, p.to.x, m), y: lerp(p.from.y, p.to.y, m) };
    if (g < p.b) {
      const base = lerp(1 + PUSH, 1, m);
      return { ...pos, s: base * (1 - p.dip * Math.sin(Math.PI * t)) };
    }
    holdStart = p.b; holdEnd = i + 1 < PANS.length ? PANS[i + 1].a : EXPLAINER_DURATION;
  }
  const h = cl((g - holdStart) / (holdEnd - holdStart));
  s = 1 + PUSH * Math.sin((h * Math.PI) / 2);
  return { ...pos, s };
};

// ---------- small parts ----------
const ICON: Record<string, React.ReactNode> = {
  pin: <><path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></>,
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  folder: <><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><path d="M9 13l2 2 4-4" /></>,
  bolt: <path d="M13 2L4 14h7l-1 8 9-12h-7z" />,
  globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" /></>,
  compass: <><circle cx="12" cy="12" r="9" /><path d="M15.5 8.5l-2 5-5 2 2-5z" /></>,
  users: <><circle cx="9" cy="8" r="3.2" /><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" /><circle cx="17" cy="9" r="2.5" /><path d="M15.5 14.2c3 .2 5.5 2.6 5.5 5.8" /></>,
  trend: <><path d="M3 17l6-6 4 4 8-8" /><path d="M15 7h6v6" /></>,
  bank: <><path d="M3 10l9-6 9 6" /><path d="M5 10v8M10 10v8M14 10v8M19 10v8M3 20h18" /></>,
  arrow: <path d="M7 17L17 7M8 7h9v9" />,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></>,
  link: <><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1" /><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" /></>,
  chat: <path d="M4 5h16v11H8l-4 4z" />,
  grid: <><rect x="4" y="4" width="7" height="7" rx="1.5" /><rect x="13" y="4" width="7" height="7" rx="1.5" /><rect x="4" y="13" width="7" height="7" rx="1.5" /><rect x="13" y="13" width="7" height="7" rx="1.5" /></>,
  heart: <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />,
};
const Icon: React.FC<{ n: keyof typeof ICON; size?: number; color?: string; stroke?: number; style?: React.CSSProperties }> = ({ n, size = 28, color = C.blue, stroke = 2, style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" style={{ display: "block", flexShrink: 0, ...style }}>{ICON[n]}</svg>
);
const IconChip: React.FC<{ n: keyof typeof ICON; size?: number }> = ({ n, size = 60 }) => (
  <div style={{ width: size, height: size, borderRadius: size * 0.3, background: C.haze, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
    <Icon n={n} size={size * 0.5} color={C.blue} />
  </div>
);

/** Words rising one after the other; `period` ends the line with the site's sky-blue square. */
const Words: React.FC<{ g: number; at: number; text: string; size: number; weight?: number; color?: string; stagger?: number; width?: number;
  blue?: string[]; period?: boolean; lh?: number; ls?: number; style?: React.CSSProperties }> = ({ g, at, text, size, weight = 700, color = C.ink, stagger = 3, width, blue = [], period, lh = 1.04, ls = -0.035, style }) => {
  const words = text.split(" ");
  return (
    <div style={{ fontFamily: FONT, fontSize: size, fontWeight: weight, color, lineHeight: lh, letterSpacing: `${ls}em`, width, ...style }}>
      {words.map((w, i) => {
        const a = at + i * stagger, p = k(g, a, 18);
        const last = i === words.length - 1;
        return (
          <React.Fragment key={i}>
            <span style={{ display: "inline-block", opacity: cl((g - a) / 10), transform: `translateY(${(1 - p) * size * 0.45}px)`, color: blue.includes(w) ? C.blue : undefined }}>
              {w}
              {last && period && <span style={{ display: "inline-block", width: size * 0.17, height: size * 0.17, background: C.accent, marginLeft: size * 0.07, transform: `scale(${k(g, a + 6, 14)})`, transformOrigin: "50% 100%" }} />}
            </span>
            {!last && " "}
          </React.Fragment>
        );
      })}
    </div>
  );
};

const Eyebrow: React.FC<{ g: number; at: number; text: string; color?: string; style?: React.CSSProperties }> = ({ g, at, text, color = C.blue, style }) => (
  <div style={{ fontFamily: FONT, fontSize: 22, fontWeight: 700, letterSpacing: "0.16em", color, ...rise(g, at, 18, 16), ...style }}>{text}</div>
);
const Chip: React.FC<{ text: string; icon?: keyof typeof ICON; style?: React.CSSProperties; dark?: boolean }> = ({ text, icon, style, dark }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "10px 22px", borderRadius: 999, background: dark ? "rgba(255,255,255,.14)" : C.haze, color: dark ? C.white : C.blue,
    fontFamily: FONT, fontWeight: 600, fontSize: 24, letterSpacing: "-0.01em", whiteSpace: "nowrap", ...style }}>
    {icon && <Icon n={icon} size={22} color={dark ? C.white : C.blue} />}{text}
  </div>
);
const Card: React.FC<{ x: number; y: number; w: number; h: number; style?: React.CSSProperties; children?: React.ReactNode; r?: number }> = ({ x, y, w, h, style, children, r = 32 }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: r, background: C.white, boxShadow: SH.card, overflow: "hidden", ...style }}>{children}</div>
);
const Scene: React.FC<{ o: readonly [number, number]; children: React.ReactNode }> = ({ o, children }) => (
  <div style={{ position: "absolute", left: o[0], top: o[1], width: 1920, height: 1080 }}>{children}</div>
);
const Cursor: React.FC<{ x: number; y: number; press?: number; o?: number }> = ({ x, y, press = 0, o = 1 }) => (
  <svg width={46} height={46} viewBox="0 0 24 24" style={{ position: "absolute", left: 0, top: 0, opacity: o, transform: `translate(${x - 6}px, ${y - 3}px) scale(${1 - press * 0.14})`, transformOrigin: "6px 3px",
    filter: "drop-shadow(0 6px 10px rgba(14,32,56,.28))", zIndex: 20 }}>
    <path d="M5 2.5v17.2l4.6-4.4 3.1 6.6 3-1.4-3.1-6.5h6.3z" fill={C.ink} stroke={C.white} strokeWidth={1.4} strokeLinejoin="round" />
  </svg>
);
const Ripple: React.FC<{ g: number; at: number; x: number; y: number; color?: string }> = ({ g, at, x, y, color = C.accent }) => {
  const p = cl((g - at) / 22);
  if (p <= 0 || p >= 1) return null;
  const r = 20 + outCubic(p) * 120;
  return <div style={{ position: "absolute", left: x - r, top: y - r, width: 2 * r, height: 2 * r, borderRadius: "50%", border: `3px solid ${color}`, opacity: 0.6 * (1 - p), zIndex: 19 }} />;
};
const Avatar: React.FC<{ size: number; ring?: number; style?: React.CSSProperties }> = ({ size, ring = 0, style }) => (
  <div style={{ width: size, height: size, borderRadius: "50%", overflow: "hidden", border: ring ? `${ring}px solid ${C.white}` : undefined, boxShadow: ring ? SH.soft : undefined, flexShrink: 0, ...style }}>
    <Img src={staticFile("img/robin-linkedin.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
  </div>
);
const LogoBox: React.FC<{ src: string; w: number; h: number; pad?: number; style?: React.CSSProperties }> = ({ src, w, h, pad = 12, style }) => (
  <div style={{ width: w, height: h, borderRadius: 18, background: C.white, boxShadow: "0 0 0 1px rgba(14,32,56,.08)", display: "flex", alignItems: "center", justifyContent: "center", padding: pad, boxSizing: "border-box", flexShrink: 0, ...style }}>
    <Img src={staticFile(`img/${src}`)} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", display: "block" }} />
  </div>
);
const money = (v: number) => "€" + Math.round(v).toLocaleString("en-US");

// ---------- S1: the profile ----------
const S1: React.FC<{ g: number }> = ({ g }) => {
  const card = { x: 1040, y: 190, w: 700 };
  const roleY = 368, roleSize = 30;
  const pre = measure("CEO & Founder, ", roleSize, 500, -0.01);
  const linkW = measure("K.B Consultancy", roleSize, 600, -0.01);
  const link = { x: card.x + 56 + pre + linkW / 2, y: card.y + roleY + roleSize * 0.62 };
  const cur = k(g, 86, 22, MOVE);
  const cx = lerp(1640, link.x, cur), cy = lerp(1010, link.y, cur);
  const hover = g >= 106 ? k(g, 106, 6) : 0;
  const press = Math.sin(Math.PI * cl((g - 112) / 8));
  const stats: [number, string, string][] = [[8, "+", "years across business & people"], [5, "", "current roles"], [22, "", "positions across his career"]];
  return (
    <Scene o={O.s1}>
      <div style={{ position: "absolute", left: 140, top: 300 }}>
        <Eyebrow g={g} at={-4} text="BUSINESS STRATEGY & COMPANY LEADERSHIP" />
        <Words g={g} at={-2} text="Meet Robin Bos" size={124} period style={{ marginTop: 26 }} />
        <Words g={g} at={20} text="He builds businesses around people, process and technology." size={40} weight={500} color={C.muted} stagger={1.2} width={780} lh={1.32} ls={-0.015} style={{ marginTop: 34 }} />
      </div>
      <Card x={card.x} y={card.y} w={card.w} h={720} style={rise(g, -6, 26, 80, 0.04, 0.25)}>
        <div style={{ height: 170, background: `linear-gradient(120deg, ${C.sky} 0%, ${C.haze} 55%, ${C.mist} 100%)` }} />
        <div style={{ position: "absolute", left: 56, top: 70, ...rise(g, -4, 20, 20, 0.1) }}><Avatar size={190} ring={8} /></div>
        <div style={{ position: "absolute", left: 56, top: 286, display: "flex", alignItems: "center", gap: 14, ...rise(g, 2, 18, 24) }}>
          <span style={{ fontFamily: FONT, fontSize: 60, fontWeight: 700, color: C.ink, letterSpacing: "-0.03em" }}>Robin Bos</span>
          <div style={{ width: 38, height: 38, borderRadius: "50%", background: C.accent, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${k(g, 14, 14)})` }}><Icon n="check" size={24} color={C.white} stroke={3} /></div>
        </div>
        <div style={{ position: "absolute", left: 56, top: roleY, fontFamily: FONT, fontSize: roleSize, fontWeight: 500, color: C.ink, letterSpacing: "-0.01em", whiteSpace: "nowrap", ...rise(g, 8, 18, 20) }}>
          CEO &amp; Founder,{" "}
          <span style={{ fontWeight: 600, color: C.blue, position: "relative" }}>
            K.B Consultancy
            <span style={{ position: "absolute", left: 0, right: 0, bottom: -3, height: 3, borderRadius: 2, background: C.blue, transform: `scaleX(${hover})`, transformOrigin: "0 50%" }} />
          </span>
        </div>
        <div style={{ position: "absolute", left: 56, top: 424, display: "flex", alignItems: "center", gap: 10, fontFamily: FONT, fontSize: 26, fontWeight: 500, color: C.muted, ...rise(g, 14, 18, 20) }}>
          <Icon n="pin" size={26} color={C.muted} />Málaga, Spain
        </div>
        <div style={{ position: "absolute", left: 56, top: 482, display: "flex", gap: 12 }}>
          {["CEO", "Advisor", "Consultant"].map((t, i) => <div key={t} style={rise(g, 20 + i * 4, 16, 18)}><Chip text={t} /></div>)}
        </div>
        <div style={{ position: "absolute", left: 56, right: 56, top: 574, height: 2, background: C.line, transform: `scaleX(${k(g, 32, 20, MOVE)})`, transformOrigin: "0 50%" }} />
        <div style={{ position: "absolute", left: 56, top: 604, display: "flex", gap: 34 }}>
          {stats.map(([n, suf, label], i) => (
            <div key={label} style={{ width: 176, ...rise(g, 36 + i * 5, 18, 18) }}>
              <div style={{ fontFamily: FONT, fontSize: 50, fontWeight: 700, color: C.ink, letterSpacing: "-0.03em", fontVariantNumeric: "tabular-nums" }}>{Math.round(n * outCubic(cl((g - 38 - i * 5) / 30)))}{suf}</div>
              <div style={{ fontFamily: FONT, fontSize: 20, fontWeight: 500, color: C.muted, lineHeight: 1.25, marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </div>
      </Card>
      {g >= 84 && g < 140 && <Cursor x={cx} y={cy} press={press} o={cl((g - 84) / 6) * (1 - cl((g - 126) / 10))} />}
      <Ripple g={g} at={112} x={link.x} y={link.y} />
    </Scene>
  );
};

// ---------- S2: the company + the timeline ----------
const TL = { y: 930, x0: O.s2[0] + 160, x1: O.s3[0] + 560, a: 196, b: 292 }; // world coordinates
const S2: React.FC<{ g: number }> = ({ g }) => (
  <Scene o={O.s2}>
    <Card x={160} y={190} w={760} h={610} style={rise(g, 132, 26, 70, 0.04, 0.25)}>
      <div style={{ height: 220, background: `linear-gradient(135deg, ${C.kb} 0%, ${C.field} 100%)`, position: "relative" }}>
        <div style={{ position: "absolute", left: 48, top: 44, width: 132, height: 132, borderRadius: 30, overflow: "hidden", boxShadow: "0 0 0 4px rgba(255,255,255,.9), 0 12px 30px rgba(0,0,0,.25)", ...rise(g, 142, 20, 20, 0.15) }}>
          <Img src={staticFile("img/kb-consultancy.png")} style={{ width: "100%", height: "100%", display: "block" }} />
        </div>
        <div style={{ position: "absolute", left: 214, top: 62, ...rise(g, 148, 18, 20) }}>
          <div style={{ fontFamily: FONT, fontSize: 50, fontWeight: 700, color: C.white, letterSpacing: "-0.03em" }}>K.B Consultancy</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8, fontFamily: FONT, fontSize: 24, fontWeight: 500, color: "rgba(255,255,255,.75)" }}><Icon n="pin" size={22} color="rgba(255,255,255,.75)" />Málaga, Spain</div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 48, top: 256, width: 660, fontFamily: FONT, fontSize: 36, fontWeight: 600, color: C.ink, lineHeight: 1.25, letterSpacing: "-0.02em", ...rise(g, 156, 18, 20) }}>
        The embedded tech partner for growing businesses.
      </div>
      <div style={{ position: "absolute", left: 48, top: 370, display: "flex", gap: 12 }}>
        <div style={rise(g, 164, 16, 16)}><Chip text="AI, Agents & Automation" icon="bolt" /></div>
        <div style={rise(g, 168, 16, 16)}><Chip text="Software Development" icon="grid" /></div>
      </div>
      <div style={{ position: "absolute", left: 48, right: 48, top: 462, height: 2, background: C.line, transform: `scaleX(${k(g, 172, 18, MOVE)})`, transformOrigin: "0 50%" }} />
      <div style={{ position: "absolute", left: 48, top: 492, display: "flex", gap: 70 }}>
        {[["Co-founded", "2024"], ["Robin today", "CEO & Founder"]].map(([a, b], i) => (
          <div key={a} style={rise(g, 176 + i * 5, 18, 16)}>
            <div style={{ fontFamily: FONT, fontSize: 22, fontWeight: 500, color: C.muted }}>{a}</div>
            <div style={{ fontFamily: FONT, fontSize: 40, fontWeight: 700, color: C.ink, letterSpacing: "-0.02em", marginTop: 4 }}>{b}</div>
          </div>
        ))}
      </div>
    </Card>
    <div style={{ position: "absolute", left: 1030, top: 290 }}>
      <Eyebrow g={g} at={146} text="JULY 2024" />
      <Words g={g} at={150} text="He co-founded K.B Consultancy" size={88} period width={800} style={{ marginTop: 22 }} blue={["K.B", "Consultancy"]} />
      <Words g={g} at={172} text="The technical team growing businesses don't have to hire yet." size={36} weight={500} color={C.muted} stagger={1.2} width={740} lh={1.32} ls={-0.015} style={{ marginTop: 30 }} />
    </div>
  </Scene>
);

/** The timeline: from "Founded · Jul 2024" to month 18, drawn in world space; the camera tracks its head. */
const Timeline: React.FC<{ g: number }> = ({ g }) => {
  const h = k(g, TL.a, TL.b - TL.a, MOVE);
  const hx = lerp(TL.x0, TL.x1, h);
  const per = (TL.x1 - TL.x0) / 18;
  const month = Math.max(1, Math.ceil(h * 18 - 1e-6));
  const done = g >= TL.b;
  const trackIn = cl((g - 186) / 12);
  return (
    <>
      <div style={{ position: "absolute", left: TL.x0, top: TL.y - 2, width: TL.x1 - TL.x0, height: 4, borderRadius: 2, background: C.line, opacity: trackIn }} />
      <div style={{ position: "absolute", left: TL.x0, top: TL.y - 3, width: hx - TL.x0, height: 6, borderRadius: 3, background: C.accent }} />
      {Array.from({ length: 19 }, (_, m) => {
        const x = TL.x0 + m * per, passed = hx >= x - 1;
        const label = m === 6 ? "6 months" : m === 12 ? "12 months" : null;
        return (
          <React.Fragment key={m}>
            <div style={{ position: "absolute", left: x - 1.5, top: TL.y + 10, width: 3, height: 14, borderRadius: 2, background: passed ? C.accent : C.line, opacity: trackIn }} />
            {label && <div style={{ position: "absolute", left: x - 100, width: 200, top: TL.y + 34, textAlign: "center", fontFamily: FONT, fontSize: 22, fontWeight: 600, color: passed ? C.blue : C.muted, opacity: trackIn }}>{label}</div>}
          </React.Fragment>
        );
      })}
      {/* the start: founded */}
      <div style={{ position: "absolute", left: TL.x0 - 13, top: TL.y - 13, width: 26, height: 26, borderRadius: "50%", background: C.blue, border: `5px solid ${C.white}`, boxSizing: "border-box", boxShadow: SH.soft, transform: `scale(${k(g, 188, 14)})` }} />
      <div style={{ position: "absolute", left: TL.x0 - 20, top: TL.y + 36, ...rise(g, 190, 16, 14) }}><Chip text="Founded · Jul 2024" icon="check" style={{ background: C.white, boxShadow: SH.soft }} /></div>
      {/* the head and its month counter */}
      {g >= TL.a && (
        <>
          <div style={{ position: "absolute", left: hx - 16, top: TL.y - 16, width: 32, height: 32, borderRadius: "50%", background: C.accent, border: `6px solid ${C.white}`, boxSizing: "border-box", boxShadow: "0 0 0 10px rgba(121,185,255,.22)" }} />
          <div style={{ position: "absolute", left: hx, top: TL.y - 82, transform: "translateX(-50%)", padding: "10px 22px", borderRadius: 999, background: done ? C.blue : C.ink, color: C.white, fontFamily: FONT, fontSize: 26, fontWeight: 700, whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums", opacity: cl((g - TL.a) / 8) }}>
            {done ? "18 months" : `Month ${month}`}
          </div>
        </>
      )}
    </>
  );
};

// ---------- S3: the valuation ----------
const S3: React.FC<{ g: number }> = ({ g }) => {
  const v = 2_000_000 * outCubic(cl((g - 296) / 42));
  const stem = k(g, 290, 12, MOVE);
  const numSize = Math.floor(150 * Math.min(1, 780 / measure("€2,000,000", 150, 700, -0.045)));
  return (
    <Scene o={O.s3}>
      {/* the milestone: from the timeline up into the card */}
      <div style={{ position: "absolute", left: 558, top: 800 + (1 - stem) * 130, width: 4, height: stem * 130, background: C.accent, borderRadius: 2 }} />
      <Ripple g={g} at={292} x={560} y={930} />
      <Card x={110} y={170} w={900} h={630} style={rise(g, 272, 24, 60, 0.04, 0.25)}>
        <div style={{ position: "absolute", left: 56, top: 54, right: 56, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Eyebrow g={g} at={280} text="18 MONTHS LATER" />
          <div style={rise(g, 300, 18, 14)}><Chip text="First funding round" icon="check" /></div>
        </div>
        <div style={{ position: "absolute", left: 56, top: 140, display: "flex", alignItems: "center", gap: 16, fontFamily: FONT, fontSize: 32, fontWeight: 500, color: C.muted, ...rise(g, 284, 18, 16) }}>
          <div style={{ width: 52, height: 52, borderRadius: 13, overflow: "hidden" }}><Img src={staticFile("img/kb-consultancy.png")} style={{ width: "100%", height: "100%", display: "block" }} /></div>
          K.B Consultancy valuation
        </div>
        <div style={{ position: "absolute", left: 50, top: 222, fontFamily: FONT, fontSize: numSize, fontWeight: 700, color: C.ink, letterSpacing: "-0.045em", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap", ...rise(g, 290, 16, 20) }}>
          {money(v)}
        </div>
        <div style={{ position: "absolute", left: 56, top: 420, display: "flex", alignItems: "center", gap: 12, fontFamily: FONT, fontSize: 30, fontWeight: 600, color: GREEN, ...rise(g, 330, 18, 14) }}>
          <Icon n="trend" size={32} color={GREEN} stroke={2.4} />from founding to €2M in 18 months
        </div>
        <div style={{ position: "absolute", left: 56, right: 56, top: 500, height: 2, background: C.line }} />
        <div style={{ position: "absolute", left: 56, top: 530, fontFamily: FONT, fontSize: 24, fontWeight: 500, color: C.muted, ...rise(g, 336, 18, 10) }}>
          Company-reported, following its first funding round.
        </div>
      </Card>
      {/* his post about it, with the team photo */}
      <Card x={1070} y={80} w={700} h={920} style={rise(g, 316, 28, 140, 0.03, 0.25)}>
        <div style={{ position: "absolute", left: 32, top: 28, display: "flex", alignItems: "center", gap: 18 }}>
          <Avatar size={76} />
          <div>
            <div style={{ fontFamily: FONT, fontSize: 30, fontWeight: 700, color: C.ink, letterSpacing: "-0.02em" }}>Robin Bos</div>
            <div style={{ fontFamily: FONT, fontSize: 22, fontWeight: 500, color: C.muted, marginTop: 2 }}>CEO &amp; Founder, K.B Consultancy</div>
          </div>
        </div>
        <div style={{ position: "absolute", left: 32, top: 132, width: 636, fontFamily: FONT, fontSize: 28, fontWeight: 500, color: C.ink, lineHeight: 1.38, letterSpacing: "-0.01em" }}>
          <b>€2,000,000.</b> That’s our valuation after finishing our first ever fundraising for K.B Consultancy.
        </div>
        <div style={{ position: "absolute", left: 32, top: 262, width: 636, height: 470, borderRadius: 20, overflow: "hidden", background: C.haze }}>
          <Img src={staticFile("img/team-2m.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 72%", display: "block", opacity: cl((g - 330) / 14), transform: `scale(${1.12 - 0.12 * k(g, 330, 40)})` }} />
        </div>
        <div style={{ position: "absolute", left: 32, top: 756, width: 636, fontFamily: FONT, fontSize: 25, fontWeight: 500, fontStyle: "italic", color: C.muted, lineHeight: 1.35, ...rise(g, 350, 18, 12) }}>
          “It’s not the number that excites me. It’s the trust behind it.”
        </div>
        <div style={{ position: "absolute", left: 32, right: 32, top: 846, display: "flex", gap: 28, alignItems: "center", fontFamily: FONT, fontSize: 22, fontWeight: 600, color: C.muted, ...rise(g, 358, 16, 10) }}>
          <span style={{ display: "flex", alignItems: "center", gap: 8 }}><Icon n="heart" size={24} color={C.blue} />Celebrated by his network</span>
          <span style={{ display: "flex", alignItems: "center", gap: 8 }}><Icon n="chat" size={24} color={C.muted} />46 comments</span>
        </div>
      </Card>
    </Scene>
  );
};

// ---------- S4: the dashboard ----------
const CLIENTS = ["mindmymind-logo.png", "jongleren-es-logo.png", "venga-travel-logo.png", "olea-hospitality-logo.png", "worldwiders-logo.png", "abroad-internships-logo.png", "custom-staffing-logo.png",
  "hirebetter.svg", "tale-forge.png", "express-revisor-logo.png", "next-job-abroad-logo.png", "social-impact-factory-logo.png", "the-dutch-hub-logo.png", "topjobsabroad.png"];
const S4: React.FC<{ g: number }> = ({ g }) => {
  const kpis: { n: number; suf: string; label: string; icon: keyof typeof ICON; at: number }[] = [
    { n: 25, suf: "", label: "client projects completed", icon: "folder", at: 470 },
    { n: 100, suf: "+", label: "automations built & integrated", icon: "bolt", at: 478 },
    { n: 5, suf: "+", label: "languages projects delivered in", icon: "globe", at: 486 },
  ];
  const nav: [string, keyof typeof ICON][] = [["Overview", "grid"], ["Projects", "folder"], ["Automations", "bolt"], ["Clients", "users"], ["Growth", "trend"]];
  return (
    <Scene o={O.s4}>
      <Card x={120} y={90} w={1680} h={900} r={28} style={rise(g, 440, 26, 80, 0.03, 0.25)}>
        {/* window bar */}
        <div style={{ height: 60, borderBottom: `1px solid ${C.line}`, display: "flex", alignItems: "center", padding: "0 24px", gap: 10, background: "#FAFCFE" }}>
          {["#FF6B5E", "#FFC23D", "#2FCB5B"].map((c) => <div key={c} style={{ width: 14, height: 14, borderRadius: "50%", background: c, opacity: 0.85 }} />)}
          <div style={{ marginLeft: 24, fontFamily: FONT, fontSize: 20, fontWeight: 600, color: C.muted }}>K.B Consultancy · Overview</div>
        </div>
        {/* sidebar */}
        <div style={{ position: "absolute", left: 0, top: 60, bottom: 0, width: 280, borderRight: `1px solid ${C.line}`, background: "#FAFCFE", padding: "30px 22px", boxSizing: "border-box" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 34, ...rise(g, 450, 16, 12) }}>
            <div style={{ width: 52, height: 52, borderRadius: 13, overflow: "hidden" }}><Img src={staticFile("img/kb-consultancy.png")} style={{ width: "100%", height: "100%", display: "block" }} /></div>
            <div style={{ fontFamily: FONT, fontSize: 24, fontWeight: 700, color: C.ink }}>K.B</div>
          </div>
          {nav.map(([t, ic], i) => (
            <div key={t} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", borderRadius: 14, marginBottom: 6, background: i === 0 ? C.haze : undefined, color: i === 0 ? C.blue : C.muted, fontFamily: FONT, fontSize: 22, fontWeight: 600, ...rise(g, 454 + i * 3, 14, 10) }}>
              <Icon n={ic} size={24} color={i === 0 ? C.blue : C.muted} />{t}
            </div>
          ))}
        </div>
        {/* main */}
        <div style={{ position: "absolute", left: 336, top: 104 }}>
          <Eyebrow g={g} at={460} text="SINCE 2024" />
          <div style={{ fontFamily: FONT, fontSize: 54, fontWeight: 700, color: C.ink, letterSpacing: "-0.03em", marginTop: 10, ...rise(g, 462, 18, 20) }}>What K.B has delivered</div>
        </div>
        <div style={{ position: "absolute", left: 336, top: 250, display: "flex", gap: 28 }}>
          {kpis.map((t) => (
            <div key={t.label} style={{ width: 410, height: 220, borderRadius: 24, boxShadow: "0 0 0 1px rgba(14,32,56,.08), 0 10px 24px -14px rgba(14,32,56,.2)", background: C.white, position: "relative", ...rise(g, t.at, 20, 30, 0.04) }}>
              <div style={{ position: "absolute", right: 28, top: 28 }}><IconChip n={t.icon} size={64} /></div>
              <div style={{ position: "absolute", left: 32, top: 34, fontFamily: FONT, fontSize: 104, fontWeight: 700, color: C.ink, letterSpacing: "-0.045em", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
                {Math.round(t.n * outCubic(cl((g - t.at - 4) / 40)))}<span style={{ color: C.accent }}>{t.suf}</span>
              </div>
              <div style={{ position: "absolute", left: 32, top: 156, fontFamily: FONT, fontSize: 24, fontWeight: 500, color: C.muted }}>{t.label}</div>
            </div>
          ))}
        </div>
        <div style={{ position: "absolute", left: 336, top: 506, right: 56, display: "flex", alignItems: "center", gap: 14, ...rise(g, 494, 16, 12) }}>
          <div style={{ fontFamily: FONT, fontSize: 30, fontWeight: 700, color: C.ink }}>Clients</div>
          <div style={{ padding: "4px 14px", borderRadius: 999, background: C.haze, color: C.blue, fontFamily: FONT, fontSize: 20, fontWeight: 700 }}>{CLIENTS.length}</div>
        </div>
        <div style={{ position: "absolute", left: 336, top: 566, display: "grid", gridTemplateColumns: "repeat(7, 166px)", gap: 18 }}>
          {CLIENTS.map((src, i) => <div key={src} style={rise(g, 500 + i * 3, 16, 24, 0.12)}><LogoBox src={src} w={166} h={136} pad={src === "topjobsabroad.png" || src === "hirebetter.svg" ? 18 : 10} /></div>)}
        </div>
      </Card>
    </Scene>
  );
};

// ---------- S5: today, he advises founders ----------
const ROLES = [
  { logo: "kb-consultancy.png", co: "K.B Consultancy", role: "CEO & Founder", since: "Co-founded 2024" },
  { logo: "wkconversions.svg", co: "WKConversions", role: "Advisor", since: "Since Oct 2026" },
  { logo: "topjobsabroad.png", co: "Top Jobs Abroad", role: "Consultant", since: "Since Sep 2026" },
  { logo: "clearscaler.svg", co: "ClearScaler", role: "Advisor", since: "Since Jul 2026" },
  { logo: "tale-forge.png", co: "Tale Forge", role: "Co-owner · Advisor", since: "Since Sep 2025" },
];
const AREAS: [string, string, keyof typeof ICON][] = [
  ["Company strategy", "Positioning, priorities, direction", "compass"],
  ["Leadership & talent", "Teams, people, ownership", "users"],
  ["Commercial growth", "Partnerships, clients, markets", "trend"],
  ["Capital & operations", "Investors, systems to scale", "bank"],
];
const S5: React.FC<{ g: number }> = ({ g }) => (
  <Scene o={O.s5}>
    <div style={{ position: "absolute", left: 140, top: 200 }}>
      <Eyebrow g={g} at={612} text="TODAY" />
      <Words g={g} at={616} text="He advises founders" size={100} period width={820} style={{ marginTop: 22 }} blue={["founders"]} />
      <Words g={g} at={632} text="On strategy, leadership, growth and capital." size={38} weight={500} color={C.muted} stagger={1.5} width={800} lh={1.3} ls={-0.015} style={{ marginTop: 26 }} />
    </div>
    <div style={{ position: "absolute", left: 140, top: 560, display: "grid", gridTemplateColumns: "repeat(2, 400px)", gap: 20 }}>
      {AREAS.map(([t, d, ic], i) => (
        <div key={t} style={{ height: 150, borderRadius: 24, background: C.white, boxShadow: SH.soft, padding: "26px 26px", boxSizing: "border-box", display: "flex", gap: 20, alignItems: "flex-start", ...rise(g, 646 + i * 6, 18, 26, 0.04) }}>
          <IconChip n={ic} size={60} />
          <div>
            <div style={{ fontFamily: FONT, fontSize: 28, fontWeight: 700, color: C.ink, letterSpacing: "-0.02em" }}>{t}</div>
            <div style={{ fontFamily: FONT, fontSize: 20, fontWeight: 500, color: C.muted, marginTop: 6, lineHeight: 1.3 }}>{d}</div>
          </div>
        </div>
      ))}
    </div>
    <Card x={1020} y={110} w={760} h={860} style={rise(g, 608, 26, 80, 0.03, 0.25)}>
      <div style={{ position: "absolute", left: 40, top: 36, right: 40, display: "flex", alignItems: "center", gap: 18 }}>
        <Avatar size={68} />
        <div style={{ fontFamily: FONT, fontSize: 34, fontWeight: 700, color: C.ink, letterSpacing: "-0.02em" }}>Current roles</div>
        <div style={{ padding: "4px 16px", borderRadius: 999, background: C.haze, color: C.blue, fontFamily: FONT, fontSize: 24, fontWeight: 700 }}>5</div>
      </div>
      <div style={{ position: "absolute", left: 40, right: 40, top: 130, height: 2, background: C.line }} />
      {ROLES.map((r, i) => (
        <div key={r.co} style={{ position: "absolute", left: 40, right: 40, top: 156 + i * 136, height: 120, display: "flex", alignItems: "center", gap: 24, ...rise(g, 624 + i * 6, 20, 0, 0) , transform: `translateX(${(1 - k(g, 624 + i * 6, 22)) * 80}px)` }}>
          <LogoBox src={r.logo} w={124} h={90} pad={r.logo === "topjobsabroad.png" ? 12 : 10} />
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: FONT, fontSize: 30, fontWeight: 700, color: C.ink, letterSpacing: "-0.02em" }}>{r.co}</div>
            <div style={{ fontFamily: FONT, fontSize: 24, fontWeight: 500, color: C.blue, marginTop: 4 }}>{r.role}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: FONT, fontSize: 20, fontWeight: 700, color: GREEN }}><span style={{ width: 10, height: 10, borderRadius: "50%", background: GREEN }} />Active</div>
            <div style={{ fontFamily: FONT, fontSize: 20, fontWeight: 500, color: C.muted, marginTop: 6 }}>{r.since}</div>
          </div>
        </div>
      ))}
    </Card>
  </Scene>
);

// ---------- S6: let's talk ----------
const S6: React.FC<{ g: number }> = ({ g }) => {
  const btn = { x: 140, y: 690, w: 560, h: 108 };
  const bc = { x: btn.x + btn.w / 2, y: btn.y + btn.h / 2 };
  const cur = k(g, 812, 26, MOVE);
  const cx = lerp(1180, bc.x + 120, cur), cy = lerp(1040, bc.y + 10, cur);
  const hover = k(g, 834, 8);
  const press = Math.sin(Math.PI * cl((g - 846) / 8));
  return (
    <Scene o={O.s6}>
      <div style={{ position: "absolute", left: 1440 - 430, top: 560 - 430, width: 860, height: 860, borderRadius: "50%", background: `radial-gradient(closest-side, ${C.sky} 0%, ${C.sky}aa 45%, ${C.haze}00 100%)`, opacity: k(g, 760, 30) }} />
      <div style={{ position: "absolute", left: 1440 - 365, top: 1080 - 1000, width: 730, height: 1000, ...rise(g, 768, 30, 120, 0, 0.2) }}>
        <Img src={staticFile("img/robin-cutout.png")} style={{ width: "100%", height: "100%", display: "block", filter: "drop-shadow(0 30px 40px rgba(14,32,56,.18))" }} />
      </div>
      <div style={{ position: "absolute", left: 140, top: 230 }}>
        <Eyebrow g={g} at={770} text="ROBIN BOS · CEO, ADVISOR, CONSULTANT" />
        <Words g={g} at={774} text="Let’s talk" size={176} period style={{ marginTop: 18 }} />
        <Words g={g} at={790} text="For advisory, business consulting, partnerships and company-building conversations." size={34} weight={500} color={C.muted} stagger={1} width={780} lh={1.35} ls={-0.015} style={{ marginTop: 28 }} />
      </div>
      <div style={{ position: "absolute", left: btn.x, top: btn.y, width: btn.w, height: btn.h, borderRadius: 999, background: hover > 0 ? `rgb(${lerp(14, 27, hover)},${lerp(32, 51, hover)},${lerp(56, 79, hover)})` : C.ink,
        display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 40px 0 46px", boxSizing: "border-box", boxShadow: `0 ${18 + hover * 8}px 40px -14px rgba(14,32,56,${0.45 + hover * 0.1})`,
        ...rise(g, 800, 20, 30, 0.05), ...(g >= 846 ? { transform: `scale(${1 - press * 0.035})` } : {}) }}>
        <span style={{ fontFamily: FONT, fontSize: 40, fontWeight: 700, color: C.white, letterSpacing: "-0.02em" }}>Start a conversation</span>
        <Icon n="arrow" size={40} color={C.white} stroke={2.4} style={{ transform: `translate(${press * 5}px, ${-press * 5}px)` }} />
      </div>
      <div style={{ position: "absolute", left: btn.x + 6, top: 850, display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontFamily: FONT, fontSize: 32, fontWeight: 600, color: C.ink, ...rise(g, 808, 18, 14) }}><Icon n="mail" size={32} color={C.blue} />robin@kruslockbosconsultancy.com</div>
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontFamily: FONT, fontSize: 32, fontWeight: 600, color: C.blue, ...rise(g, 814, 18, 14) }}><Icon n="link" size={32} color={C.blue} />linkedin.com/in/robindanielbos</div>
      </div>
      <Ripple g={g} at={846} x={bc.x + 120} y={bc.y + 10} color={C.white} />
      {g >= 810 && <Cursor x={cx} y={cy} press={press} o={cl((g - 810) / 6)} />}
    </Scene>
  );
};

// ---------- the stage ----------
const World: React.FC = () => {
  const g = useCurrentFrame();
  const cam = camera(g);
  const glow = (x: number, y: number, r = 900) => (
    <div style={{ position: "absolute", left: x - r, top: y - r, width: 2 * r, height: 2 * r, borderRadius: "50%", background: `radial-gradient(closest-side, rgba(200,225,250,.55), rgba(200,225,250,0))` }} />
  );
  return (
    <AbsoluteFill style={{ background: BG, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, top: 0, transformOrigin: "0 0", transform: `translate(960px, 540px) scale(${cam.s}) translate(${-cam.x}px, ${-cam.y}px)` }}>
        <div style={{ position: "absolute", left: -1400, top: -1200, width: 9000, height: 4800, background: BG,
          backgroundImage: "radial-gradient(circle, #D5E0EC 2px, rgba(213,224,236,0) 2.6px)", backgroundSize: "44px 44px" }} />
        {glow(1300, 560)}{glow(3300, 520)}{glow(5100, 560)}{glow(5300, 1840)}{glow(3300, 1820)}{glow(1400, 1860)}
        <S1 g={g} />
        <S2 g={g} />
        <Timeline g={g} />
        <S3 g={g} />
        <S4 g={g} />
        <S5 g={g} />
        <S6 g={g} />
      </div>
    </AbsoluteFill>
  );
};

/** Camera motion blur as a running mean: sample i at opacity 1/(i+1) over the samples before it (exact average). */
const MotionBlur: React.FC<{ samples: number; children: React.ReactNode }> = ({ samples, children }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      {Array.from({ length: samples }, (_, i) => (
        <AbsoluteFill key={i} style={{ opacity: 1 / (i + 1) }}>
          <Freeze frame={Math.max(0, f - 0.5 * (i / Math.max(1, samples - 1)))}>{children}</Freeze>
        </AbsoluteFill>
      ))}
    </AbsoluteFill>
  );
};

export const Explainer: React.FC<ExplainerProps> = ({ blurSamples = 1 }) => {
  const [handle] = useState(() => delayRender("fonts"));
  const [ready, setReady] = useState(false);
  useEffect(() => { fontsReady.then(() => { setReady(true); continueRender(handle); }); }, [handle]);
  if (!ready) return <AbsoluteFill style={{ background: BG }} />;
  return blurSamples > 1 ? <MotionBlur samples={blurSamples}><World /></MotionBlur> : <World />;
};
