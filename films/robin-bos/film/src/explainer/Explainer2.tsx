// Robin Bos — silent SaaS explainer, v2: constant motion. Every change is a move (morph, whip, grow-from-click,
// zoom-through), something large is always moving (3D-tilted UI turning, bobbing satellites, an orbit, Ken Burns,
// drifting blooms), UI at about twice real size. No audio. Every figure from ../../harvest/facts.md.
//
// Shot list (frames at 30 fps):
//   0–116    "Meet Robin Bos." → the period becomes his photo → the profile card, metric satellites; cursor clicks K.B
//   98–236   the K.B card grows out of the click; "He co-founded K.B Consultancy"; the 2024 line shoots right
//   210–306  whip right into the dial: Month 1 → 18 on a scrolling ruler
//   288–430  the dial pill grows into the valuation card (€2,000,000); his post flies in (team photo, quote)
//   412–552  whip up into the dashboard on a tilted plane: 25 · 100+ · 5+, 14 client logos filling in
//   526–726  "Today, he advises founders." → shrinks to the title of a hub: his photo, four areas, five companies orbiting
//   704–860  zoom through his photo into "Let's talk." — button, cursor click, email and LinkedIn
import React, { useEffect, useState } from "react";
import { AbsoluteFill, Img, continueRender, delayRender, staticFile, useCurrentFrame } from "remotion";
import { fontsReady } from "../fonts";
import { measure } from "../kinetic";
import { ARRIVE, C, DEPART, MOVE } from "../lib";

export const EXPLAINER2_DURATION = 836;
export type Explainer2Props = { blurSamples: number };

// ---------- helpers ----------
const cl = (t: number) => Math.min(1, Math.max(0, t));
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const outCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const k = (t: number, at: number, dur: number, e: (x: number) => number = ARRIVE) => e(cl((t - at) / dur));
const fadeIn = (t: number, at: number, dur: number) => cl((t - at) / dur);
const FONT = "Manrope";
const BG = "#F4F8FC";
const GREEN = "#2FA86B";
const SH = {
  card: "0 50px 100px -35px rgba(14,32,56,.30), 0 4px 14px rgba(14,32,56,.06), 0 0 0 1px rgba(14,32,56,.05)",
  soft: "0 18px 40px -14px rgba(14,32,56,.24), 0 0 0 1px rgba(14,32,56,.05)",
};
const money = (v: number) => "€" + Math.round(v).toLocaleString("en-US");
/** Fly-in: from an offset, with a blur that clears as it lands. */
const fly = (t: number, at: number, dur: number, dx: number, dy: number, sc = 0.9): React.CSSProperties => {
  const p = k(t, at, dur);
  return {
    opacity: fadeIn(t, at, dur * 0.3),
    transform: `translate(${(1 - p) * dx}px, ${(1 - p) * dy}px) scale(${lerp(sc, 1, p)})`,
    filter: p < 0.85 ? `blur(${(1 - p) * 10}px)` : undefined,
  };
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
  grid: <><rect x="4" y="4" width="7" height="7" rx="1.5" /><rect x="13" y="4" width="7" height="7" rx="1.5" /><rect x="4" y="13" width="7" height="7" rx="1.5" /><rect x="13" y="13" width="7" height="7" rx="1.5" /></>,
};
const Icon: React.FC<{ n: keyof typeof ICON; size?: number; color?: string; stroke?: number; style?: React.CSSProperties }> = ({ n, size = 28, color = C.blue, stroke = 2, style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" style={{ display: "block", flexShrink: 0, ...style }}>{ICON[n]}</svg>
);
const IconChip: React.FC<{ n: keyof typeof ICON; size?: number; dark?: boolean }> = ({ n, size = 60, dark }) => (
  <div style={{ width: size, height: size, borderRadius: size * 0.3, background: dark ? C.blue : C.haze, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
    <Icon n={n} size={size * 0.52} color={dark ? C.white : C.blue} stroke={2.2} />
  </div>
);
const Chip: React.FC<{ text: string; icon?: keyof typeof ICON; size?: number; style?: React.CSSProperties; tone?: "haze" | "white" | "ink" | "green" }> = ({ text, icon, size = 30, style, tone = "haze" }) => {
  const bg = { haze: C.haze, white: C.white, ink: C.ink, green: "#E6F6EE" }[tone];
  const fg = { haze: C.blue, white: C.ink, ink: C.white, green: GREEN }[tone];
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: size * 0.38, padding: `${size * 0.38}px ${size * 0.8}px`, borderRadius: 999, background: bg, color: fg,
      fontFamily: FONT, fontWeight: 700, fontSize: size, letterSpacing: "-0.015em", whiteSpace: "nowrap", boxShadow: tone === "white" ? SH.soft : undefined, ...style }}>
      {icon && <Icon n={icon} size={size * 0.95} color={fg} stroke={2.4} />}{text}
    </div>
  );
};
const Avatar: React.FC<{ size: number; ring?: number; style?: React.CSSProperties }> = ({ size, ring = 0, style }) => (
  <div style={{ width: size, height: size, borderRadius: "50%", overflow: "hidden", border: ring ? `${ring}px solid ${C.white}` : undefined, boxShadow: ring ? SH.soft : undefined, flexShrink: 0, boxSizing: "border-box", ...style }}>
    <Img src={staticFile("img/robin-linkedin.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
  </div>
);
const LogoBox: React.FC<{ src: string; w: number; h: number; pad?: number; r?: number; style?: React.CSSProperties }> = ({ src, w, h, pad = 12, r = 20, style }) => (
  <div style={{ width: w, height: h, borderRadius: r, background: C.white, boxShadow: "0 0 0 1px rgba(14,32,56,.08), 0 10px 22px -12px rgba(14,32,56,.25)", display: "flex", alignItems: "center", justifyContent: "center", padding: pad, boxSizing: "border-box", flexShrink: 0, ...style }}>
    <Img src={staticFile(`img/${src}`)} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", display: "block" }} />
  </div>
);
const Cursor: React.FC<{ x: number; y: number; press?: number; o?: number }> = ({ x, y, press = 0, o = 1 }) => (
  <svg width={54} height={54} viewBox="0 0 24 24" style={{ position: "absolute", left: 0, top: 0, opacity: o, transform: `translate(${x - 7}px, ${y - 3}px) scale(${1 - press * 0.14})`, transformOrigin: "7px 3px",
    filter: "drop-shadow(0 8px 12px rgba(14,32,56,.3))", zIndex: 50 }}>
    <path d="M5 2.5v17.2l4.6-4.4 3.1 6.6 3-1.4-3.1-6.5h6.3z" fill={C.ink} stroke={C.white} strokeWidth={1.4} strokeLinejoin="round" />
  </svg>
);
const Ripple: React.FC<{ t: number; at: number; x: number; y: number; color?: string }> = ({ t, at, x, y, color = C.accent }) => {
  const p = cl((t - at) / 22);
  if (p <= 0 || p >= 1) return null;
  const r = 24 + outCubic(p) * 150;
  return <div style={{ position: "absolute", left: x - r, top: y - r, width: 2 * r, height: 2 * r, borderRadius: "50%", border: `4px solid ${color}`, opacity: 0.7 * (1 - p), zIndex: 49 }} />;
};
/** Words rising out of a blur one after another; `period` ends with the site's sky-blue square. */
const Words: React.FC<{ t: number; at: number; text: string; size: number; weight?: number; color?: string; stagger?: number; width?: number;
  blue?: string[]; period?: boolean; lh?: number; ls?: number; style?: React.CSSProperties; hidePeriod?: boolean; align?: "left" | "center" }> =
  ({ t, at, text, size, weight = 700, color = C.ink, stagger = 3, width, blue = [], period, lh = 1.04, ls = -0.035, style, hidePeriod, align = "left" }) => {
  const words = text.split(" ");
  return (
    <div style={{ fontFamily: FONT, fontSize: size, fontWeight: weight, color, lineHeight: lh, letterSpacing: `${ls}em`, width, textAlign: align, ...style }}>
      {words.map((w, i) => {
        const a = at + i * stagger, p = k(t, a, 16);
        const last = i === words.length - 1;
        return (
          <React.Fragment key={i}>
            <span style={{ display: "inline-block", opacity: cl((t - a) / 7), transform: `translateY(${(1 - p) * size * 0.5}px)`, filter: p < 0.8 ? `blur(${(1 - p) * 10}px)` : undefined, color: blue.includes(w) ? C.blue : undefined }}>
              {w}
              {last && period && <span style={{ display: "inline-block", width: size * 0.17, height: size * 0.17, background: C.accent, marginLeft: size * 0.07, opacity: hidePeriod ? 0 : 1, transform: `scale(${k(t, a + 5, 12)})`, transformOrigin: "50% 100%" }} />}
            </span>
            {!last && " "}
          </React.Fragment>
        );
      })}
    </div>
  );
};

// ---------- the background: always drifting ----------
const Background: React.FC<{ g: number }> = ({ g }) => {
  const bloom = (x: number, y: number, r: number, color: string, a: number) => (
    <div style={{ position: "absolute", left: x - r, top: y - r, width: 2 * r, height: 2 * r, borderRadius: "50%", background: `radial-gradient(closest-side, ${color}, transparent)`, opacity: a }} />
  );
  return (
    <AbsoluteFill style={{ background: `linear-gradient(160deg, #FBFDFF 0%, ${BG} 55%, #E9F2FB 100%)`, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: -100, top: -100, width: 2200, height: 1300, backgroundImage: "radial-gradient(circle, #D3DFEB 2px, rgba(211,223,235,0) 2.6px)", backgroundSize: "46px 46px",
        transform: `translate(${-(g * 0.6) % 46}px, ${-(g * 0.35) % 46}px)`, opacity: 0.8 }} />
      {bloom(300 + 220 * Math.sin(g / 70), 260 + 140 * Math.cos(g / 90), 620, "rgba(121,185,255,.55)", 0.55)}
      {bloom(1600 + 200 * Math.cos(g / 80), 820 + 160 * Math.sin(g / 65), 700, "rgba(200,225,250,.95)", 0.8)}
      {bloom(1100 + 300 * Math.sin(g / 110 + 2), 120 + 120 * Math.sin(g / 75), 480, "rgba(214,230,246,.9)", 0.7)}
    </AbsoluteFill>
  );
};

// ---------- 1. Meet Robin Bos → the profile ----------
const PCARD = { x: 640, y: 130, w: 820, h: 810 };
const PC = { x: PCARD.x + PCARD.w / 2, y: PCARD.y + PCARD.h / 2 };
const PAV = { x: PCARD.x + 160, y: PCARD.y + 200, s: 200 };
const ROLE = { y: 412, size: 38 };
const pScale = (t: number) => lerp(0.92, 1, k(t, 36, 20));
const pLift = (t: number) => (1 - k(t, 36, 20)) * 140;
/** The link's centre in screen space at the moment of the click (the card is flat again by then). */
const linkCentre = () => {
  const pre = measure("CEO & Founder, ", ROLE.size, 500, -0.01), w = measure("K.B Consultancy", ROLE.size, 700, -0.01);
  return { x: PCARD.x + 60 + pre + w / 2, y: PCARD.y + ROLE.y + ROLE.size * 0.62 };
};
const MEET = { size: 150, text: "Meet Robin Bos" };
const meetBox = () => {
  const tw = measure(MEET.text, MEET.size, 700, -0.035), sq = MEET.size * 0.17, gap = MEET.size * 0.07;
  const W = tw + gap + sq, x0 = 960 - W / 2, top = 540 - MEET.size * 0.52;
  return { x0, top, period: { x: x0 + tw + gap + sq / 2, y: top + 0.883 * MEET.size - sq / 2, s: sq } };
};

const Meet: React.FC<{ g: number }> = ({ g }) => {
  if (g > 60) return null;
  const t = g, b = meetBox();
  const exit = k(t, 28, 12, DEPART);
  const words = MEET.text.split(" ");
  return (
    <div style={{ position: "absolute", left: b.x0, top: b.top, transformOrigin: `${960 - b.x0}px ${MEET.size / 2}px`, transform: `scale(${1 + 0.12 * k(t, -10, 44, MOVE)})`, display: "flex", gap: MEET.size * 0.26, fontFamily: FONT, fontSize: MEET.size, fontWeight: 700, letterSpacing: "-0.035em", lineHeight: 1, color: C.ink, whiteSpace: "nowrap" }}>
      {words.map((w, i) => {
        const a = -8 + i * 5, p = k(t, a, 16);
        const off = (i - 1) * exit * 420;
        return (
          <span key={w} style={{ display: "inline-block", opacity: cl((t - a) / 7) * (1 - exit), transform: `translate(${off}px, ${(1 - p) * MEET.size * 0.5}px)`, filter: p < 0.8 || exit > 0 ? `blur(${(1 - p) * 10 + exit * 14}px)` : undefined }}>
            {w}
            {i === 2 && <span style={{ display: "inline-block", width: b.period.s, height: b.period.s, marginLeft: MEET.size * 0.07, background: C.accent, opacity: t < 30 ? 1 : 0, transform: `scale(${k(t, 4, 12)})`, transformOrigin: "50% 100%" }} />}
          </span>
        );
      })}
    </div>
  );
};

const Profile: React.FC<{ g: number }> = ({ g }) => {
  if (g > 118) return null;
  const t = g;
  const b = meetBox();
  // the period → his photo
  const mp = k(t, 30, 26, MOVE), sc = pScale(t), lift = pLift(t);
  const target = { x: PC.x + (PAV.x - PC.x) * sc, y: PC.y + (PAV.y - PC.y) * sc + lift, s: PAV.s * sc };
  const ts = 1 + 0.12 * k(t, -10, 44, MOVE);
  const p0 = { x: 960 + (b.period.x - 960) * ts, y: b.top + MEET.size / 2 + (b.period.y - b.top - MEET.size / 2) * ts, s: b.period.s * ts };
  const mx = lerp(p0.x, target.x, mp), my = lerp(p0.y, target.y, mp), ms = lerp(p0.s, target.s, mp);
  // the card: lands flat, turns while you read, comes back flat for the click, then falls away
  const hold = cl((t - 56) / 38), turn = Math.sin(Math.PI * hold);
  const out = k(t, 98, 16, DEPART);
  const rotY = -11 * turn - 32 * out, rotX = 5 * turn + 8 * out, tx = -36 * turn;
  const cardOpacity = fadeIn(t, 36, 5) * (1 - out);
  const link = linkCentre();
  const cur = k(t, 70, 22, MOVE);
  const cx = lerp(1320, link.x, cur), cy = lerp(1040, link.y, cur);
  const hover = k(t, 90, 6), press = Math.sin(Math.PI * cl((t - 96) / 8));
  const stats: [number, string, string][] = [[8, "+", "years across business & people"], [5, "", "current roles"], [22, "", "positions in his career"]];
  const sat = (at: number, dx: number, dy: number, bob: number): React.CSSProperties => {
    const f = fly(t, at, 18, dx, dy, 0.85);
    const o = k(t, 96, 12, DEPART);
    return { ...f, opacity: (f.opacity as number) * (1 - o), transform: `${f.transform} translate(${dx * 0.6 * o}px, ${Math.sin((g + bob) / 16) * 9 + dy * 0.4 * o}px)`, filter: o > 0 ? `blur(${o * 12}px)` : f.filter };
  };
  return (
    <>
      {/* metric satellites */}
      <div style={{ position: "absolute", left: 100, top: 210, ...sat(54, -500, 0, 0) }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "20px 28px 20px 20px", borderRadius: 26, background: C.white, boxShadow: SH.soft }}>
          <div style={{ width: 72, height: 72, borderRadius: 18, overflow: "hidden" }}><Img src={staticFile("img/kb-consultancy.png")} style={{ width: "100%", height: "100%", display: "block" }} /></div>
          <div><div style={{ fontFamily: FONT, fontSize: 32, fontWeight: 700, color: C.ink, letterSpacing: "-0.02em" }}>K.B Consultancy</div><div style={{ fontFamily: FONT, fontSize: 26, fontWeight: 600, color: C.muted, marginTop: 2 }}>Co-founded 2024</div></div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 150, top: 790, ...sat(60, -400, 200, 30) }}><Chip text="€2M valuation" icon="trend" tone="green" size={34} style={{ boxShadow: SH.soft }} /></div>
      <div style={{ position: "absolute", left: 1500, top: 250, ...sat(64, 500, -100, 60) }}><Chip text="25 client projects" icon="folder" tone="white" size={30} /></div>
      <div style={{ position: "absolute", left: 1520, top: 760, ...sat(68, 500, 200, 90) }}><Chip text="100+ automations" icon="bolt" tone="white" size={30} /></div>
      {/* the card */}
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, perspective: 2200, perspectiveOrigin: `${PC.x}px ${PC.y}px` }}>
        <div style={{ position: "absolute", left: PCARD.x, top: PCARD.y, width: PCARD.w, height: PCARD.h, borderRadius: 40, background: C.white, boxShadow: SH.card, overflow: "hidden",
          opacity: cardOpacity, transform: `translate(${tx}px, ${lift}px) rotateY(${rotY}deg) rotateX(${rotX}deg) scale(${sc * (1 - 0.15 * out)})`, filter: out > 0 ? `blur(${out * 10}px)` : undefined }}>
          <div style={{ height: 200, background: `linear-gradient(120deg, ${C.sky} 0%, ${C.haze} 55%, ${C.mist} 100%)`, transform: `scaleX(${k(t, 38, 20, MOVE)})`, transformOrigin: "0 50%" }} />
          {t >= 56 && <div style={{ position: "absolute", left: 60, top: 100 }}><Avatar size={200} ring={9} /></div>}
          <div style={{ position: "absolute", left: 60, top: 312, display: "flex", alignItems: "center", gap: 16, ...fly(t, 42, 16, 0, 30, 1) }}>
            <span style={{ fontFamily: FONT, fontSize: 76, fontWeight: 700, color: C.ink, letterSpacing: "-0.035em" }}>Robin Bos</span>
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: C.accent, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${k(t, 52, 12)})` }}><Icon n="check" size={30} color={C.white} stroke={3.2} /></div>
          </div>
          <div style={{ position: "absolute", left: 60, top: ROLE.y, fontFamily: FONT, fontSize: ROLE.size, fontWeight: 500, color: C.ink, letterSpacing: "-0.01em", whiteSpace: "nowrap", ...fly(t, 46, 16, 0, 26, 1) }}>
            CEO &amp; Founder,{" "}
            <span style={{ fontWeight: 700, color: C.blue, position: "relative" }}>
              K.B Consultancy
              <span style={{ position: "absolute", left: 0, right: 0, bottom: -4, height: 4, borderRadius: 2, background: C.blue, transform: `scaleX(${hover})`, transformOrigin: "0 50%" }} />
            </span>
          </div>
          <div style={{ position: "absolute", left: 60, top: 476, display: "flex", alignItems: "center", gap: 12, fontFamily: FONT, fontSize: 32, fontWeight: 500, color: C.muted, ...fly(t, 50, 16, 0, 24, 1) }}>
            <Icon n="pin" size={32} color={C.muted} />Málaga, Spain
          </div>
          <div style={{ position: "absolute", left: 60, top: 540, display: "flex", gap: 14 }}>
            {["CEO", "Advisor", "Consultant"].map((s, i) => <div key={s} style={fly(t, 54 + i * 3, 14, 60, 0, 0.8)}><Chip text={s} size={30} /></div>)}
          </div>
          <div style={{ position: "absolute", left: 60, right: 60, top: 634, height: 3, background: C.line, transform: `scaleX(${k(t, 60, 18, MOVE)})`, transformOrigin: "0 50%" }} />
          <div style={{ position: "absolute", left: 60, top: 660, display: "flex", gap: 30 }}>
            {stats.map(([n, suf, label], i) => (
              <div key={label} style={{ width: 210, ...fly(t, 62 + i * 3, 16, 0, 30, 1) }}>
                <div style={{ fontFamily: FONT, fontSize: 64, fontWeight: 700, color: C.ink, letterSpacing: "-0.04em", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{Math.round(n * outCubic(cl((t - 64 - i * 3) / 24)))}{suf}</div>
                <div style={{ fontFamily: FONT, fontSize: 24, fontWeight: 600, color: C.muted, lineHeight: 1.22, marginTop: 8 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* the period travelling into his photo */}
      {t >= 30 && t < 56 && (
        <div style={{ position: "absolute", left: mx - ms / 2, top: my - ms / 2, width: ms, height: ms, borderRadius: `${mp * 50}%`, background: C.accent, overflow: "hidden", border: mp > 0.5 ? `${9 * sc * (mp - 0.5) * 2}px solid ${C.white}` : undefined, boxSizing: "border-box",
          boxShadow: SH.soft, filter: `blur(${Math.sin(Math.PI * mp) * 3}px)` }}>
          <Img src={staticFile("img/robin-linkedin.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", opacity: cl((mp - 0.35) / 0.4) }} />
        </div>
      )}
      {t >= 68 && t < 112 && <Cursor x={cx} y={cy} press={press} o={fadeIn(t, 68, 5) * (1 - cl((t - 104) / 6))} />}
      <Ripple t={t} at={96} x={link.x} y={link.y} />
    </>
  );
};

// ---------- 2. K.B grows out of the click ----------
const KCARD = { x: 900, y: 190, w: 880, h: 680 };
const KB: React.FC<{ g: number }> = ({ g }) => {
  if (g < 98 || g > 236) return null;
  const t = g - 98;
  const link = linkCentre();
  const p = k(t, 0, 20);
  const target = { x: KCARD.x + KCARD.w / 2, y: KCARD.y + KCARD.h / 2 };
  const ccx = lerp(link.x, target.x, p), ccy = lerp(link.y, target.y, p), s = lerp(0.06, 1, p);
  const turn = Math.sin(Math.PI * cl((t - 20) / 100));
  const pulse = Math.sin(Math.PI * cl((t - 92) / 12));
  const shoot = k(t, 98, 14, MOVE);
  const push = 1 + 0.08 * k(t, 10, 110, MOVE);
  const steps: [string, string][] = [["01", "Diagnose"], ["02", "Build"], ["03", "Run"]];
  return (
    <div style={{ position: "absolute", inset: 0, transformOrigin: "1100px 540px", transform: `scale(${push}) translateX(${-30 * k(t, 10, 110, MOVE)}px)` }}>
      <div style={{ position: "absolute", left: 110, top: 300 }}>
        <div style={{ fontFamily: FONT, fontSize: 30, fontWeight: 800, letterSpacing: "0.16em", color: C.blue, ...fly(t, 10, 14, 0, 20, 1) }}>JULY 2024</div>
        <Words t={t} at={14} text="He co-founded K.B Consultancy" size={100} period width={760} blue={["K.B", "Consultancy"]} stagger={4} style={{ marginTop: 22 }} />
        <Words t={t} at={36} text="The technical team you don’t have to hire yet." size={40} weight={600} color={C.muted} stagger={1.5} width={720} lh={1.3} ls={-0.015} style={{ marginTop: 30 }} />
      </div>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, perspective: 2200, perspectiveOrigin: `${target.x}px ${target.y}px` }}>
        <div style={{ position: "absolute", left: ccx - KCARD.w / 2, top: ccy - KCARD.h / 2, width: KCARD.w, height: KCARD.h, borderRadius: 40, background: C.white, boxShadow: SH.card, overflow: "hidden",
          opacity: fadeIn(t, 0, 4), transform: `scale(${s}) rotateY(${-14 * turn}deg) rotateX(${5 * turn}deg) translateY(${-20 * turn}px)`, filter: p < 0.8 ? `blur(${(1 - p) * 8}px)` : undefined }}>
          <div style={{ height: 240, background: `linear-gradient(135deg, ${C.kb} 0%, ${C.field} 100%)`, position: "relative" }}>
            <div style={{ position: "absolute", left: 50, top: 50, width: 140, height: 140, borderRadius: 32, overflow: "hidden", boxShadow: "0 0 0 5px rgba(255,255,255,.9), 0 14px 30px rgba(0,0,0,.3)", ...fly(t, 12, 16, 0, 20, 0.7) }}>
              <Img src={staticFile("img/kb-consultancy.png")} style={{ width: "100%", height: "100%", display: "block" }} />
            </div>
            <div style={{ position: "absolute", left: 226, top: 66, ...fly(t, 16, 16, 40, 0, 1) }}>
              <div style={{ fontFamily: FONT, fontSize: 58, fontWeight: 700, color: C.white, letterSpacing: "-0.035em" }}>K.B Consultancy</div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10, fontFamily: FONT, fontSize: 30, fontWeight: 600, color: "rgba(255,255,255,.78)" }}><Icon n="pin" size={28} color="rgba(255,255,255,.78)" />Málaga, Spain</div>
            </div>
          </div>
          <div style={{ position: "absolute", left: 50, top: 276, width: 780, fontFamily: FONT, fontSize: 42, fontWeight: 700, color: C.ink, lineHeight: 1.22, letterSpacing: "-0.025em", ...fly(t, 22, 16, 0, 30, 1) }}>
            The embedded tech partner for growing businesses.
          </div>
          <div style={{ position: "absolute", left: 50, top: 418, display: "flex", gap: 14 }}>
            <div style={fly(t, 28, 14, 80, 0, 0.8)}><Chip text="AI, Agents & Automation" icon="bolt" size={28} /></div>
            <div style={fly(t, 31, 14, 80, 0, 0.8)}><Chip text="Software Development" icon="grid" size={28} /></div>
          </div>
          <div style={{ position: "absolute", left: 50, right: 50, top: 520, height: 3, background: C.line, transform: `scaleX(${k(t, 34, 16, MOVE)})`, transformOrigin: "0 50%" }} />
          <div style={{ position: "absolute", left: 50, top: 546, display: "flex", gap: 80 }}>
            <div style={fly(t, 38, 14, 0, 24, 1)}>
              <div style={{ fontFamily: FONT, fontSize: 26, fontWeight: 600, color: C.muted }}>Co-founded</div>
              <div style={{ display: "inline-block", fontFamily: FONT, fontSize: 60, fontWeight: 700, color: pulse > 0 ? C.blue : C.ink, letterSpacing: "-0.035em", marginTop: 2, transform: `scale(${1 + 0.12 * pulse})`, transformOrigin: "0 60%" }}>2024</div>
            </div>
            <div style={fly(t, 42, 14, 0, 24, 1)}>
              <div style={{ fontFamily: FONT, fontSize: 26, fontWeight: 600, color: C.muted }}>Robin today</div>
              <div style={{ fontFamily: FONT, fontSize: 60, fontWeight: 700, color: C.ink, letterSpacing: "-0.035em", marginTop: 2 }}>CEO &amp; Founder</div>
            </div>
          </div>
        </div>
      </div>
      {/* K.B's process: three steps flying in under the card, joined as they land */}
      <div style={{ position: "absolute", left: 930, top: 902, width: 760, height: 6, borderRadius: 3, background: C.accent, opacity: 0.6, transform: `scaleX(${k(t, 52, 30, MOVE)})`, transformOrigin: "0 50%" }} />
      {steps.map(([n, label], i) => (
        <div key={n} style={{ position: "absolute", left: 900 + i * 300, top: 870, ...fly(t, 46 + i * 7, 18, 400, 120, 0.6) }}>
          <div style={{ transform: `translateY(${Math.sin((g + i * 25) / 15) * 8}px)`, display: "flex", alignItems: "center", gap: 14, padding: "12px 28px 12px 12px", borderRadius: 999, background: C.white, boxShadow: SH.soft }}>
            <div style={{ width: 46, height: 46, borderRadius: "50%", background: C.blue, color: C.white, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontSize: 20, fontWeight: 800 }}>{n}</div>
            <span style={{ fontFamily: FONT, fontSize: 32, fontWeight: 700, color: C.ink, letterSpacing: "-0.02em" }}>{label}</span>
          </div>
        </div>
      ))}
      {/* the line out of "2024": it carries the eye into the next scene */}
      {t >= 98 && <div style={{ position: "absolute", left: KCARD.x + 200, top: KCARD.y + 640, width: shoot * (1920 - KCARD.x), height: 6, borderRadius: 3, background: C.accent, boxShadow: "0 0 18px rgba(121,185,255,.7)" }} />}
    </div>
  );
};

// ---------- 3. the dial: Month 1 → 18 ----------
const DIAL = { cx: 960, cy: 520, h: 230, pillW: 380, pillH: 290 };
const monthAt = (t: number) => lerp(1, 18, k(t, 14, 62, MOVE));
const Dial: React.FC<{ g: number }> = ({ g }) => {
  if (g < 210 || g > 306) return null;
  const t = g - 210;
  const m = monthAt(t);
  const per = 150, rulerY = 850;
  const done = t >= 76;
  const out = k(t, 84, 6, DEPART);
  const flash = Math.sin(Math.PI * cl((t - 76) / 10));
  const handed = g >= 294;   // from here the valuation card is the pill
  return (
    <>
      <div style={{ position: "absolute", left: 0, right: 0, top: 150, textAlign: "center", fontFamily: FONT, fontSize: 32, fontWeight: 800, letterSpacing: "0.16em", color: C.blue, opacity: 1 - out, ...fly(t, 8, 14, 0, -20, 1) }}>FROM FOUNDING TO FIRST FUNDING ROUND</div>
      {/* the rolling numbers */}
      <div style={{ position: "absolute", left: DIAL.cx - 520, top: DIAL.cy - DIAL.h * 1.6, width: 1040, height: DIAL.h * 3.2, overflow: "hidden", opacity: handed ? 0 : 1,
        WebkitMaskImage: "linear-gradient(180deg, transparent 0%, #000 30%, #000 70%, transparent 100%)", maskImage: "linear-gradient(180deg, transparent 0%, #000 30%, #000 70%, transparent 100%)" }}>
        {Array.from({ length: 20 }, (_, j) => j).filter((j) => j >= 1 && j <= 18 && Math.abs(j - m) < 2.2).map((j) => {
          const y = DIAL.h * 1.6 + (j - m) * DIAL.h;
          const near = 1 - Math.min(1, Math.abs(j - m));
          return (
            <div key={j} style={{ position: "absolute", left: 0, width: 1040, top: y - DIAL.h / 2, height: DIAL.h, display: "flex", alignItems: "center", justifyContent: "center", gap: 30,
              fontFamily: FONT, fontWeight: 700, letterSpacing: "-0.04em", color: C.ink, opacity: 0.25 + 0.75 * near, transform: `scale(${0.7 + 0.3 * near})` }}>
              <span style={{ fontSize: 200, fontVariantNumeric: "tabular-nums" }}>{j}</span>
              <span style={{ fontSize: 76, color: C.muted, marginTop: 70 }}>{j === 1 ? "month" : "months"}</span>
            </div>
          );
        })}
      </div>
      {/* the selector pill */}
      <div style={{ position: "absolute", left: DIAL.cx - 500, top: DIAL.cy - DIAL.h / 2 - 10, width: 1000, height: DIAL.h + 20, borderRadius: 60, border: `5px solid ${done ? C.accent : C.line}`,
        background: done ? `rgba(121,185,255,${0.12 * flash})` : "transparent", opacity: handed ? 0 : fadeIn(t, 6, 10), transform: `scale(${1 + 0.04 * flash})` }} />
      {/* the ruler scrolling under the head */}
      <div style={{ position: "absolute", left: 0, top: rulerY - 3, width: 960, height: 6, background: C.accent, borderRadius: 3, opacity: 1 - out }} />
      <div style={{ position: "absolute", left: 960, top: rulerY - 2, width: 960, height: 4, background: C.line, opacity: 1 - out }} />
      {Array.from({ length: 30 }, (_, j) => j - 6).map((j) => {
        const x = 960 + (j - (m - 1)) * per;
        if (x < -100 || x > 2020) return null;
        const label = j === 0 ? "Founded · Jul 2024" : j === 6 ? "6 months" : j === 12 ? "12 months" : j === 18 ? "18 months" : null;
        const passed = x <= 961;
        return (
          <React.Fragment key={j}>
            <div style={{ position: "absolute", left: x - 2, top: rulerY + 16, width: 4, height: j % 6 === 0 ? 30 : 18, borderRadius: 2, background: passed ? C.accent : C.line, opacity: 1 - out }} />
            {label && j >= 0 && j <= 18 && <div style={{ position: "absolute", left: x - 200, width: 400, top: rulerY + 58, textAlign: "center", fontFamily: FONT, fontSize: 30, fontWeight: 700, color: passed ? C.blue : C.muted, opacity: 1 - out }}>{label}</div>}
          </React.Fragment>
        );
      })}
      <div style={{ position: "absolute", left: 960 - 22, top: rulerY - 22, width: 44, height: 44, borderRadius: "50%", background: C.accent, border: `8px solid ${C.white}`, boxSizing: "border-box", boxShadow: "0 0 0 14px rgba(121,185,255,.25)", opacity: 1 - out }} />
    </>
  );
};

// ---------- 4. the valuation, and his post ----------
const VCARD = { x: 90, y: 200, w: 960, h: 680 };
const Valuation: React.FC<{ g: number }> = ({ g }) => {
  if (g < 294 || g > 430) return null;
  const t = g - 294;
  const p = k(t, 0, 18, MOVE);
  const x = lerp(DIAL.cx - 500, VCARD.x, p), y = lerp(DIAL.cy - DIAL.h / 2 - 10, VCARD.y, p);
  const w = lerp(1000, VCARD.w, p), h = lerp(DIAL.h + 20, VCARD.h, p);
  const v = Math.round((2_000_000 * outCubic(cl((t - 14) / 32))) / 100_000) * 100_000;
  const numSize = Math.floor(170 * Math.min(1, 840 / measure("€2,000,000", 170, 700, -0.045)));
  const hold = cl((t - 20) / 120);
  const glow = Math.sin(Math.PI * cl((t - 46) / 20));
  return (
    <>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, perspective: 2400, perspectiveOrigin: "560px 540px" }}>
        <div style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: lerp(60, 40, p), background: `rgba(255,255,255,${lerp(0.5, 1, cl(p * 2))})`, boxShadow: SH.card, overflow: "hidden",
          border: p < 1 ? `${5 * (1 - p)}px solid ${C.accent}` : undefined, boxSizing: "border-box",
          transform: `translateY(${-24 * hold}px) rotateY(${7 * Math.sin(Math.PI * hold)}deg)` }}>
          {p < 0.6 && <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 30, fontFamily: FONT, fontWeight: 700, letterSpacing: "-0.04em", color: C.ink, opacity: 1 - p / 0.6 }}>
            <span style={{ fontSize: 200, fontVariantNumeric: "tabular-nums" }}>18</span><span style={{ fontSize: 76, color: C.muted, marginTop: 70 }}>months</span></div>}
          <div style={{ position: "absolute", left: 56, top: 50, right: 56, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontFamily: FONT, fontSize: 28, fontWeight: 800, letterSpacing: "0.16em", color: C.blue, ...fly(t, 12, 14, 0, 16, 1) }}>18 MONTHS LATER</div>
            <div style={fly(t, 30, 16, 120, 0, 0.8)}><Chip text="First funding round" icon="check" size={28} /></div>
          </div>
          <div style={{ position: "absolute", left: 56, top: 140, display: "flex", alignItems: "center", gap: 18, fontFamily: FONT, fontSize: 38, fontWeight: 600, color: C.muted, ...fly(t, 14, 14, 0, 16, 1) }}>
            <div style={{ width: 62, height: 62, borderRadius: 15, overflow: "hidden" }}><Img src={staticFile("img/kb-consultancy.png")} style={{ width: "100%", height: "100%", display: "block" }} /></div>
            K.B Consultancy valuation
          </div>
          <div style={{ position: "absolute", left: 50, top: 230, fontFamily: FONT, fontSize: numSize, fontWeight: 700, color: C.ink, letterSpacing: "-0.045em", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap",
            textShadow: glow > 0 ? `0 0 ${40 * glow}px rgba(121,185,255,${0.8 * glow})` : undefined, opacity: fadeIn(t, 12, 6) }}>
            {money(v)}
          </div>
          <div style={{ position: "absolute", left: 56, top: 448, display: "flex", alignItems: "center", gap: 14, fontFamily: FONT, fontSize: 36, fontWeight: 700, color: GREEN, ...fly(t, 44, 16, -60, 0, 1) }}>
            <Icon n="trend" size={40} color={GREEN} stroke={2.6} />From founding to €2M in 18 months
          </div>
          <div style={{ position: "absolute", left: 56, right: 56, top: 540, height: 3, background: C.line, transform: `scaleX(${k(t, 48, 16, MOVE)})`, transformOrigin: "0 50%" }} />
          <div style={{ position: "absolute", left: 56, top: 572, fontFamily: FONT, fontSize: 28, fontWeight: 600, color: C.muted, ...fly(t, 52, 16, 0, 14, 1) }}>
            Company-reported, following its first funding round.
          </div>
        </div>
      </div>
      {/* his post: flies in tilted, settles, keeps turning a little */}
      {(() => {
        const q = k(t, 22, 26);
        const rot = lerp(32, -5, q) + 3 * Math.sin(Math.PI * hold);
        return (
          <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, perspective: 2200, perspectiveOrigin: "1460px 540px" }}>
            <div style={{ position: "absolute", left: 1100, top: 70, width: 730, height: 940, borderRadius: 36, background: C.white, boxShadow: SH.card, overflow: "hidden",
              opacity: fadeIn(t, 22, 6), transform: `translate(${(1 - q) * 900}px, ${-20 * hold}px) rotateY(${rot}deg)`, filter: q < 0.85 ? `blur(${(1 - q) * 14}px)` : undefined }}>
              <div style={{ position: "absolute", left: 34, top: 30, display: "flex", alignItems: "center", gap: 20 }}>
                <Avatar size={86} />
                <div>
                  <div style={{ fontFamily: FONT, fontSize: 36, fontWeight: 700, color: C.ink, letterSpacing: "-0.025em" }}>Robin Bos</div>
                  <div style={{ fontFamily: FONT, fontSize: 26, fontWeight: 600, color: C.muted, marginTop: 2 }}>Founder, K.B Consultancy</div>
                </div>
              </div>
              <div style={{ position: "absolute", left: 34, top: 142, width: 662, fontFamily: FONT, fontSize: 34, fontWeight: 600, color: C.ink, lineHeight: 1.3, letterSpacing: "-0.02em" }}>
                <b>€2,000,000.</b> That’s our valuation after finishing our first ever fundraising for K.B Consultancy.
              </div>
              <div style={{ position: "absolute", left: 34, top: 330, width: 662, height: 430, borderRadius: 24, overflow: "hidden", background: C.haze }}>
                <Img src={staticFile("img/team-2m.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 72%", display: "block",
                  opacity: fadeIn(t, 30, 10), transform: `scale(${1.22 - 0.2 * cl((t - 30) / 110)}) translateY(${-14 + 14 * cl((t - 30) / 110)}px)` }} />
              </div>
              <div style={{ position: "absolute", left: 34, top: 790, width: 662, fontFamily: FONT, fontSize: 34, fontWeight: 700, fontStyle: "italic", color: C.ink, lineHeight: 1.3, letterSpacing: "-0.02em", ...fly(t, 50, 16, 0, 20, 1) }}>
                “It’s not the number that excites me. It’s the trust behind it.”
              </div>
            </div>
          </div>
        );
      })()}
    </>
  );
};

// ---------- 5. the dashboard on a tilted plane ----------
const CLIENTS = ["mindmymind-logo.png", "jongleren-es-logo.png", "venga-travel-logo.png", "olea-hospitality-logo.png", "worldwiders-logo.png", "abroad-internships-logo.png", "custom-staffing-logo.png",
  "hirebetter.svg", "tale-forge.png", "express-revisor-logo.png", "next-job-abroad-logo.png", "social-impact-factory-logo.png", "the-dutch-hub-logo.png", "topjobsabroad.png"];
const Dashboard: React.FC<{ g: number }> = ({ g }) => {
  if (g < 412 || g > 552) return null;
  const t = g - 412;
  const enter = k(t, 0, 16, MOVE);
  const push = k(t, 0, 120, MOVE);
  const out = k(t, 110, 16, DEPART);
  const rotX = lerp(18, 4, push) + 46 * out, rotZ = lerp(-3, 0, push), sc = lerp(0.9, 1.0, push) * (1 - 0.18 * out);
  const kpis: { n: number; suf: string; label: string; icon: keyof typeof ICON; at: number; dx: number; dy: number }[] = [
    { n: 25, suf: "", label: "client projects completed", icon: "folder", at: 14, dx: -500, dy: 0 },
    { n: 100, suf: "+", label: "automations built", icon: "bolt", at: 20, dx: 0, dy: 400 },
    { n: 5, suf: "+", label: "languages delivered in", icon: "globe", at: 26, dx: 500, dy: 0 },
  ];
  const nav: [string, keyof typeof ICON][] = [["Overview", "grid"], ["Projects", "folder"], ["Automations", "bolt"], ["Clients", "users"], ["Growth", "trend"]];
  const sweep = Math.floor(cl((t - 72) / 56) * CLIENTS.length);
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, perspective: 2000, perspectiveOrigin: "960px 400px", transform: `translateY(${(1 - enter) * 1080}px)` }}>
      <div style={{ position: "absolute", left: 110, top: 60, width: 1700, height: 960, borderRadius: 34, background: C.white, boxShadow: SH.card, overflow: "hidden", transformOrigin: "50% 60%",
        transform: `translateY(${300 * out}px) rotateX(${rotX}deg) rotateZ(${rotZ}deg) scale(${sc})`, opacity: 1 - out, filter: out > 0 ? `blur(${out * 10}px)` : undefined }}>
        <div style={{ height: 66, borderBottom: `2px solid ${C.line}`, display: "flex", alignItems: "center", padding: "0 28px", gap: 12, background: "#FAFCFE" }}>
          {["#FF6B5E", "#FFC23D", "#2FCB5B"].map((c) => <div key={c} style={{ width: 16, height: 16, borderRadius: "50%", background: c, opacity: 0.85 }} />)}
          <div style={{ marginLeft: 26, fontFamily: FONT, fontSize: 26, fontWeight: 700, color: C.muted }}>K.B Consultancy · Overview</div>
        </div>
        <div style={{ position: "absolute", left: 0, top: 66, bottom: 0, width: 300, borderRight: `2px solid ${C.line}`, background: "#FAFCFE", padding: "34px 24px", boxSizing: "border-box" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 34, ...fly(t, 6, 14, -100, 0, 1) }}>
            <div style={{ width: 60, height: 60, borderRadius: 15, overflow: "hidden" }}><Img src={staticFile("img/kb-consultancy.png")} style={{ width: "100%", height: "100%", display: "block" }} /></div>
            <div style={{ fontFamily: FONT, fontSize: 30, fontWeight: 800, color: C.ink }}>K.B</div>
          </div>
          {nav.map(([s, ic], i) => (
            <div key={s} style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 18px", borderRadius: 16, marginBottom: 8, background: i === 0 ? C.haze : undefined, color: i === 0 ? C.blue : C.muted, fontFamily: FONT, fontSize: 27, fontWeight: 700, ...fly(t, 8 + i * 2, 12, -120, 0, 1) }}>
              <Icon n={ic} size={28} color={i === 0 ? C.blue : C.muted} stroke={2.2} />{s}
            </div>
          ))}
        </div>
        <div style={{ position: "absolute", left: 340, top: 104 }}>
          <div style={{ fontFamily: FONT, fontSize: 28, fontWeight: 800, letterSpacing: "0.16em", color: C.blue, ...fly(t, 8, 14, 0, 20, 1) }}>SINCE 2024</div>
          <div style={{ fontFamily: FONT, fontSize: 66, fontWeight: 700, color: C.ink, letterSpacing: "-0.035em", marginTop: 8, ...fly(t, 10, 16, 0, 30, 1) }}>What K.B has delivered</div>
        </div>
        <div style={{ position: "absolute", left: 340, top: 270, display: "flex", gap: 26 }}>
          {kpis.map((q) => (
            <div key={q.label} style={{ width: 436, height: 250, borderRadius: 28, boxShadow: "0 0 0 2px rgba(14,32,56,.07), 0 16px 34px -18px rgba(14,32,56,.3)", background: C.white, position: "relative", ...fly(t, q.at, 20, q.dx, q.dy, 0.85) }}>
              <div style={{ position: "absolute", right: 30, top: 30 }}><IconChip n={q.icon} size={70} /></div>
              <div style={{ position: "absolute", left: 34, top: 34, fontFamily: FONT, fontSize: 132, fontWeight: 700, color: C.ink, letterSpacing: "-0.05em", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
                {Math.round(q.n * outCubic(cl((t - q.at - 4) / 34)))}<span style={{ color: C.accent }}>{q.suf}</span>
              </div>
              <div style={{ position: "absolute", left: 34, top: 186, fontFamily: FONT, fontSize: 30, fontWeight: 600, color: C.muted, whiteSpace: "nowrap" }}>{q.label}</div>
            </div>
          ))}
        </div>
        <div style={{ position: "absolute", left: 340, top: 568, display: "flex", alignItems: "center", gap: 16, ...fly(t, 34, 14, 0, 20, 1) }}>
          <div style={{ fontFamily: FONT, fontSize: 38, fontWeight: 700, color: C.ink, letterSpacing: "-0.02em" }}>Clients</div>
          <div style={{ padding: "6px 18px", borderRadius: 999, background: C.haze, color: C.blue, fontFamily: FONT, fontSize: 26, fontWeight: 800 }}>{Math.min(CLIENTS.length, Math.max(0, Math.floor((t - 38) / 2)))}</div>
        </div>
        <div style={{ position: "absolute", left: 340, top: 638, display: "grid", gridTemplateColumns: "repeat(7, 178px)", gap: 16 }}>
          {CLIENTS.map((src, i) => (
            <div key={src} style={{ ...fly(t, 40 + i * 2, 14, 0, 140, 0.5), position: "relative" }}>
              <LogoBox src={src} w={178} h={140} pad={src === "topjobsabroad.png" || src === "hirebetter.svg" ? 20 : 12} style={{ boxShadow: i === sweep ? `0 0 0 4px ${C.accent}, 0 16px 30px -12px rgba(121,185,255,.6)` : undefined, transform: i === sweep ? "translateY(-8px)" : undefined }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ---------- 6. "Today, he advises founders." → the hub ----------
const HUB = { x: 960, y: 660, av: 250 };
const ORB = { rx: 860, ry: 340, d: 130 };   // the orbit clears the pills (inner ends ±200, outer ±600) and the title
const AREAS: [string, keyof typeof ICON, number, number][] = [
  ["Company strategy", "compass", -1, -1], ["Leadership & talent", "users", 1, -1], ["Commercial growth", "trend", -1, 1], ["Capital & operations", "bank", 1, 1],
];
const COMPANIES = ["kb-consultancy.png", "wkconversions.svg", "topjobsabroad.png", "clearscaler.svg", "tale-forge.png"];
const hubScale = (g: number) => 1 + 7 * k(g, 700, 22, DEPART);
const Hub: React.FC<{ g: number }> = ({ g }) => {
  if (g < 526 || g > 726) return null;
  const t = g - 526;              // the type's clock
  const h = g - 574;              // the hub's clock
  const shrink = k(t, 48, 20, MOVE);
  const zs = hubScale(g), zoomOut = k(g, 700, 22, DEPART);
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: `${HUB.x}px ${HUB.y}px`, transform: `scale(${zs})`, filter: zoomOut > 0 ? `blur(${zoomOut * 6}px)` : undefined }}>
      {/* the line, then the title */}
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "960px 0px", transform: `translateY(${lerp(370 - 30 * cl((t - 10) / 38), 40, shrink)}px) scale(${lerp(1 + 0.1 * k(t, 10, 38, MOVE), 0.5, shrink)})` }}>
        <Words t={t} at={10} text="Today, he advises founders" size={128} period width={1500} align="center" blue={["founders"]} stagger={4} style={{ margin: "0 auto" }} />
        <div style={{ textAlign: "center", marginTop: 26, fontFamily: FONT, fontSize: 64, fontWeight: 700, color: C.blue, opacity: fadeIn(t, 56, 10) }}>5 current roles · 4 focus areas</div>
      </div>
      {h > -2 && (
        <>
          {/* the orbit path */}
          <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
            <ellipse cx={HUB.x} cy={HUB.y} rx={ORB.rx} ry={ORB.ry} fill="none" stroke={C.line} strokeWidth={3} strokeDasharray="10 14" opacity={fadeIn(h, 10, 14)} strokeDashoffset={-g * 1.2} />
            {AREAS.map(([, , sx, sy], i) => {
              const p = k(h, 10 + i * 5, 18);
              const tx = HUB.x + sx * 400 * p, ty = HUB.y + sy * 115 * p;
              return <line key={i} x1={HUB.x} y1={HUB.y} x2={tx} y2={ty} stroke={C.accent} strokeWidth={4} opacity={0.7 * fadeIn(h, 10 + i * 5, 6)} />;
            })}
          </svg>
          {/* pulse rings */}
          {[0, 1, 2].map((i) => {
            const ph = ((h + i * 16) % 48) / 48;
            if (h < 8) return null;
            const r = HUB.av / 2 + ph * 150;
            return <div key={i} style={{ position: "absolute", left: HUB.x - r, top: HUB.y - r, width: 2 * r, height: 2 * r, borderRadius: "50%", border: `3px solid ${C.accent}`, opacity: 0.55 * (1 - ph) }} />;
          })}
          {/* the five companies, orbiting (behind first) */}
          {COMPANIES.map((src, i) => {
            const a = g * 0.017 + (i * 2 * Math.PI) / 5 + 0.2;
            const depth = (Math.sin(a) + 1) / 2;   // 0 back (top), 1 front (bottom)
            const p = k(h, 22 + i * 4, 20);
            const ox = HUB.x + Math.cos(a) * ORB.rx * lerp(1.8, 1, p), oy = HUB.y + Math.sin(a) * ORB.ry * lerp(1.8, 1, p);
            const s = lerp(0.82, 1.08, depth);
            return (
              <div key={src} style={{ position: "absolute", left: ox - ORB.d / 2, top: oy - ORB.d / 2, width: ORB.d, height: ORB.d, zIndex: depth < 0.5 ? 1 : 6, opacity: fadeIn(h, 22 + i * 4, 6), transform: `scale(${s})`, filter: p < 0.85 ? `blur(${(1 - p) * 10}px)` : undefined }}>
                <LogoBox src={src} w={ORB.d} h={ORB.d} r={ORB.d / 2} pad={src === "topjobsabroad.png" ? 16 : src === "kb-consultancy.png" ? 0 : 22} style={{ borderRadius: "50%", overflow: "hidden" }} />
              </div>
            );
          })}
          {/* the four areas */}
          {AREAS.map(([label, ic, sx, sy], i) => {
            const p = k(h, 10 + i * 5, 18);
            const bob = Math.sin((g + i * 23) / 17) * 8;
            const x = HUB.x + sx * 400 * p, y = HUB.y + sy * 115 * p + bob;
            return (
              <div key={label} style={{ position: "absolute", left: x, top: y, zIndex: 5, transform: `translate(-50%, -50%) scale(${lerp(0.4, 1, p)})`, opacity: fadeIn(h, 10 + i * 5, 6) }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px 30px 14px 14px", borderRadius: 999, background: C.white, boxShadow: SH.soft, whiteSpace: "nowrap" }}>
                  <IconChip n={ic} size={58} dark={i === Math.floor(((h - 50) / 26) % 4 + 4) % 4 && h > 50} />
                  <span style={{ fontFamily: FONT, fontSize: 36, fontWeight: 700, color: C.ink, letterSpacing: "-0.025em" }}>{label}</span>
                </div>
              </div>
            );
          })}
          {/* his photo at the centre */}
          <div style={{ position: "absolute", left: HUB.x - HUB.av / 2, top: HUB.y - HUB.av / 2, zIndex: 7, transform: `scale(${lerp(0.3, 1, k(h, 0, 18))})`, opacity: fadeIn(h, 0, 5) }}>
            <Avatar size={HUB.av} ring={10} />
          </div>
        </>
      )}
    </div>
  );
};

// ---------- 7. Let's talk ----------
const CTA: React.FC<{ g: number }> = ({ g }) => {
  if (g < 704) return null;
  const t = g - 704;
  const r = (HUB.av / 2) * hubScale(g) + k(t, 4, 20, MOVE) * 1800;   // his photo's circle opens into the scene
  const push = k(t, 0, 132, (x) => x);
  const btn = { x: 140, y: 650, w: 600, h: 116 };
  const tip = { x: btn.x + btn.w - 62, y: btn.y + btn.h / 2 + 4 };
  const cur = k(t, 56, 24, MOVE);
  const cx = lerp(1300, tip.x, cur), cy = lerp(1060, tip.y, cur);
  const hover = k(t, 76, 8), press = Math.sin(Math.PI * cl((t - 86) / 8));
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, clipPath: `circle(${r}px at ${HUB.x}px ${HUB.y}px)`, overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(160deg, #FBFDFF 0%, ${C.haze} 60%, ${C.mist} 100%)` }} />
      <div style={{ position: "absolute", left: 1440 - 480 + 60 * Math.sin(g / 60), top: 560 - 480 + 40 * Math.cos(g / 70), width: 960, height: 960, borderRadius: "50%", background: `radial-gradient(closest-side, ${C.sky} 0%, ${C.sky}aa 45%, transparent 100%)` }} />
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "30% 55%", transform: `scale(${1 + 0.09 * push}) translateX(${18 * push}px)` }}>
        <div style={{ position: "absolute", left: 1440 - 380, top: 1080 - 1040, width: 760, height: 1040, opacity: fadeIn(t, 4, 4),
          transform: `translate(${-70 * push}px, ${(1 - k(t, 4, 26)) * 260}px) scale(${1 + 0.06 * push})`, transformOrigin: "50% 100%" }}>
          <Img src={staticFile("img/robin-cutout.png")} style={{ width: "100%", height: "100%", display: "block", filter: "drop-shadow(0 30px 40px rgba(14,32,56,.2))" }} />
        </div>
        <div style={{ position: "absolute", left: 140, top: 170 }}>
          <div style={{ fontFamily: FONT, fontSize: 30, fontWeight: 800, letterSpacing: "0.16em", color: C.blue, ...fly(t, 10, 14, 0, 20, 1) }}>ROBIN BOS · CEO, ADVISOR, CONSULTANT</div>
          <Words t={t} at={12} text="Let’s talk" size={190} period stagger={5} style={{ marginTop: 14 }} />
          <Words t={t} at={26} text="For advisory, business consulting, partnerships and company-building conversations." size={38} weight={600} color={C.muted} stagger={1} width={820} lh={1.3} ls={-0.015} style={{ marginTop: 26 }} />
        </div>
        <div style={{ position: "absolute", left: btn.x, top: btn.y, width: btn.w, height: btn.h, borderRadius: 999,
          background: `rgb(${lerp(14, 27, hover)},${lerp(32, 51, hover)},${lerp(56, 79, hover)})`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 44px 0 50px", boxSizing: "border-box",
          boxShadow: `0 ${20 + hover * 10}px 44px -14px rgba(14,32,56,${0.45 + hover * 0.1})`, ...fly(t, 34, 18, -300, 0, 0.8), ...(t >= 86 ? { transform: `scale(${1 - press * 0.04})` } : {}) }}>
          <span style={{ fontFamily: FONT, fontSize: 44, fontWeight: 700, color: C.white, letterSpacing: "-0.02em" }}>Start a conversation</span>
          <Icon n="arrow" size={44} color={C.white} stroke={2.6} style={{ transform: `translate(${press * 6}px, ${-press * 6}px)` }} />
        </div>
        <div style={{ position: "absolute", left: btn.x + 4, top: 808, display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 16, fontFamily: FONT, fontSize: 46, fontWeight: 700, color: C.ink, letterSpacing: "-0.02em", ...fly(t, 40, 16, -200, 0, 1) }}>
            <div style={{ position: "absolute", left: -18, right: -24, top: -10, bottom: -10, borderRadius: 18, background: C.white, boxShadow: SH.soft, transform: `scaleX(${k(t, 94, 16, MOVE)})`, transformOrigin: "0 50%", zIndex: -1 }} />
            <Icon n="mail" size={46} color={C.blue} stroke={2.3} />robin@kruslockbosconsultancy.com</div>
          <div style={{ display: "flex", alignItems: "center", gap: 16, fontFamily: FONT, fontSize: 46, fontWeight: 700, color: C.blue, letterSpacing: "-0.02em", ...fly(t, 44, 16, -200, 0, 1) }}><Icon n="link" size={46} color={C.blue} stroke={2.3} />linkedin.com/in/robindanielbos</div>
        </div>
        <Ripple t={t} at={86} x={tip.x} y={tip.y} color={C.white} />
        {t >= 54 && t < 120 && <Cursor x={cx} y={cy} press={press} o={fadeIn(t, 54, 5) * (1 - cl((t - 104) / 10))} />}
      </div>
    </div>
  );
};

// ---------- the stage ----------
/** Screen-space whips: a directional blur from the scene's own speed (σ ≈ 0.13 × px per frame). */
const whipX = (g: number) => -1920 * k(g, 210, 18, MOVE);     // K.B → the dial
const whipY = (g: number) => -1080 * k(g, 412, 16, MOVE);     // the valuation → the dashboard
const Stage: React.FC = () => {
  const g = useCurrentFrame();
  const vx = Math.abs(whipX(g) - whipX(g - 1)) * 0.13, vy = Math.abs(whipY(g) - whipY(g - 1)) * 0.13;
  const fx = vx > 0.4 ? "url(#whipx)" : undefined, fy = vy > 0.4 ? "url(#whipy)" : undefined;
  const breath = 1 + 0.012 * Math.sin(g / 75);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <svg width={0} height={0} style={{ position: "absolute" }}>
        <filter id="whipx" x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="sRGB"><feGaussianBlur stdDeviation={`${vx.toFixed(2)} 0`} /></filter>
        <filter id="whipy" x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="sRGB"><feGaussianBlur stdDeviation={`0 ${vy.toFixed(2)}`} /></filter>
      </svg>
      <Background g={g} />
      <AbsoluteFill style={{ transform: `scale(${breath})` }}>
        <Meet g={g} />
        <Profile g={g} />
        <AbsoluteFill style={{ transform: `translateX(${whipX(g)}px)`, filter: fx }}><KB g={g} /></AbsoluteFill>
        <AbsoluteFill style={{ transform: `translateX(${whipX(g) + 1920}px)`, filter: fx }}><Dial g={g} /></AbsoluteFill>
        <AbsoluteFill style={{ transform: `translateY(${whipY(g)}px)`, filter: fy }}><Valuation g={g} /></AbsoluteFill>
        <AbsoluteFill style={{ filter: fy }}><Dashboard g={g} /></AbsoluteFill>
        <Hub g={g} />
        <CTA g={g} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const Explainer2: React.FC<Explainer2Props> = () => {
  const [handle] = useState(() => delayRender("fonts"));
  const [ready, setReady] = useState(false);
  useEffect(() => { fontsReady.then(() => { setReady(true); continueRender(handle); }); }, [handle]);
  if (!ready) return <AbsoluteFill style={{ background: BG }} />;
  return <Stage />;
};
