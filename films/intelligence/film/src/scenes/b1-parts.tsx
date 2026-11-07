// B1 parts: the platform's pages 01 (home), 02 (knowledge base), 06 (Sales department) with every example text re-set as custom Nova
// content in the platform's own type (Inter, opsz 14), plus the lift helpers. Coordinates are screenshot px (OCR boxes / 2).
// Page 06 is 2545 px wide in the file (the others 2559), so its overlay layer is stretched by SW/2545 like the photo.
import React from "react";
import { C, CX, CY, SH, SW, Shot, T, mix } from "../kit";

export const MUTED = "#575e68", FAINT = "#838a94", BLUE = "#1266c9", PAGE = "#f7f7f8", PAGE2 = "#f6f6f7", INK = C.ink, HDR = "#fcfcfd";
export const K6 = SW / 2545; // page 06 stretch

// ------------------------------------------------------------------ small helpers
export type CamT = { x: number; y: number; s: number };
export type Rect = { x: number; y: number; w: number; h: number };
/** screen point -> frame point under a camera */
export const toF = (cam: CamT, sx: number, sy: number) => ({ x: CX + (sx - cam.x) * cam.s, y: CY + (sy - cam.y) * cam.s });

/** monotone cubic (PCHIP) through [t, v] keys: smooth, no overshoot, flat at the ends */
export const pchip = (pts: number[][], t: number) => {
  const n = pts.length; if (t <= pts[0][0]) return pts[0][1]; if (t >= pts[n - 1][0]) return pts[n - 1][1];
  const d: number[] = []; for (let i = 0; i < n - 1; i++) d.push((pts[i + 1][1] - pts[i][1]) / (pts[i + 1][0] - pts[i][0]));
  const m: number[] = pts.map((_, i) => (i === 0 || i === n - 1 ? 0 : d[i - 1] * d[i] <= 0 ? 0 : (2 * d[i - 1] * d[i]) / (d[i - 1] + d[i])));
  let i = 0; while (t > pts[i + 1][0]) i++;
  const h = pts[i + 1][0] - pts[i][0], u = (t - pts[i][0]) / h, u2 = u * u, u3 = u2 * u;
  return (2 * u3 - 3 * u2 + 1) * pts[i][1] + (u3 - 2 * u2 + u) * h * m[i] + (-2 * u3 + 3 * u2) * pts[i + 1][1] + (u3 - u2) * h * m[i + 1];
};

/** one line of re-set text: x / y0 are the OCR box of the original line (left edge, ascender top); Inter opsz 14 like the platform */
export const Ln: React.FC<{ x: number; y0: number; size: number; weight?: number; color?: string; children: React.ReactNode; w?: number; align?: "left" | "right" }> =
  ({ x, y0, size, weight = 400, color = MUTED, children, w, align = "left" }) => (
    <T x={x - 1} y={y0 - 0.1 * size} w={w} size={size} lh={1} weight={weight} color={color}
      style={{ whiteSpace: "nowrap", fontVariationSettings: "'opsz' 14", textAlign: align }}>{children}</T>
  );
const Lines: React.FC<{ x: number; y0: number; pitch: number; size: number; lines: string[]; color?: string }> = ({ x, y0, pitch, size, lines, color }) => (
  <>{lines.map((l, i) => <Ln key={i} x={x} y0={y0 + pitch * i} size={size} color={color}>{l}</Ln>)}</>
);

/** a region of a (composed) page as its own object; inset 1 px so the photo's anti-aliased card edge never leaks */
export const Region: React.FC<{ rect: Rect; r?: number; children: React.ReactNode }> = ({ rect, r = 0, children }) => (
  <div style={{ position: "relative", width: rect.w, height: rect.h, overflow: "hidden", borderRadius: r }}>
    <div style={{ position: "absolute", left: -rect.x, top: -rect.y, width: SW, height: SH }}>{children}</div>
  </div>
);

export const shadowA = (a: number) => `0 1px 2px rgba(5,15,25,${0.06 * a}), 0 12px 32px rgba(5,15,25,${0.10 * a}), 0 40px 90px rgba(5,15,25,${0.12 * a})`;
export const SOFTSH = "0 1px 3px rgba(5,15,25,0.04), 0 10px 30px rgba(5,15,25,0.085)";

/** lifts an object from its slot on the stage (under camera cam) to a frame position and scale; p 0..1 (springs may overshoot) */
export const LiftTo: React.FC<{ cam: CamT; rect: Rect; p: number; to: { cx: number; cy: number; scale: number }; r?: number; children: React.ReactNode }> =
  ({ cam, rect, p, to, r = 25, children }) => {
    if (p <= 0.0005) return null;
    const b = toF(cam, rect.x + rect.w / 2, rect.y + rect.h / 2);
    const sc = mix(cam.s, to.scale, p), cx = mix(b.x, to.cx, p), cy = mix(b.y, to.cy, p), a = Math.min(1, Math.max(0, p));
    return <div style={{ position: "absolute", left: cx - rect.w / 2, top: cy - rect.h / 2, width: rect.w, height: rect.h, transform: `scale(${sc})`, borderRadius: r, boxShadow: shadowA(a) }}>{children}</div>;
  };
/** a small lift in place: scale 1 + 0.04 p, rises a few px, soft shadow and a blue ring */
export const Bump: React.FC<{ cam: CamT; rect: Rect; p: number; r?: number; children: React.ReactNode }> = ({ cam, rect, p, r = 25, children }) => {
  if (p <= 0.0005) return null;
  const b = toF(cam, rect.x + rect.w / 2, rect.y + rect.h / 2), a = Math.min(1, Math.max(0, p));
  return <div style={{ position: "absolute", left: b.x - rect.w / 2, top: b.y - rect.h / 2 - 6 * p, width: rect.w, height: rect.h, transform: `scale(${cam.s * (1 + 0.045 * p)})`, borderRadius: r,
    boxShadow: `0 0 0 ${2.5 * a}px rgba(18,102,201,${0.38 * a}), 0 0 0 ${7 * a}px rgba(18,102,201,${0.10 * a}), ${shadowA(a)}` }}>{children}</div>;
};

// ------------------------------------------------------------------ page 01: home
export const Page01: React.FC = () => (
  <Shot n="01">
    {/* the platform's own sentence, with Nova set in the same type as the rest (the photo's name patch has a different weight) */}
    <div style={{ position: "absolute", left: 745, top: 468, width: 322, height: 56, background: "#fff" }} />
    <Ln x={749} y0={475} size={16.4}>Read how Nova works, from strategy</Ln>
    <Ln x={749} y0={501} size={16.4}>to day-to-day playbooks.</Ln>
  </Shot>
);
export const HOME_CARDS: Rect[] = [{ x: 715, y: 303, w: 359, h: 298 }, { x: 1100, y: 303, w: 360, h: 298 }, { x: 1484, y: 303, w: 361, h: 298 }];
export const HOME_GREET: Rect[] = [{ x: 710, y: 150, w: 336, h: 72 }, { x: 1046, y: 150, w: 124, h: 72 }, { x: 710, y: 224, w: 320, h: 34 }];

// ------------------------------------------------------------------ page 02: knowledge base
const NAV_BASE = (x: number, size: number, y0: number) => (
  <Ln x={x - 150} y0={y0} w={150} size={size} weight={500} color={INK} align="right">Knowledge base</Ln>
);
const DEPT: { c: number; r: number; lines: string[] }[] = [
  { c: 0, r: 0, lines: ["How Nova sells: who we sell to, through", "which channels, how a deal runs, what we", "offer and at what price. Every How we…"] },
  { c: 1, r: 0, lines: ["How Nova gets noticed: our voice, the", "channels we use and the content that", "brings Sales the right projects. Every…"] },
  { c: 2, r: 0, lines: ["How Nova delivers: how a project runs,", "who does what from kickoff to launch and", "how we plan capacity. Every section…"] },
  { c: 0, r: 1, lines: ["How Nova supports clients after launch:", "onboarding, check-ins, retainer reviews", "and how a project becomes a long…"] },
  { c: 1, r: 1, lines: ["How Nova handles money: invoicing,", "payment terms, margins, costs and the", "monthly numbers we review. Every…"] },
  { c: 2, r: 1, lines: ["How Nova works as a team: who does what,", "how we bring in freelancers and how we", "grow and review each other's work…"] },
];
export const DEPT_X = [715, 1099, 1483], DEPT_Y = [331, 552];
export const DEPT_RECT = (c: number, r: number): Rect => ({ x: DEPT_X[c] + 1, y: DEPT_Y[r] + 1, w: 360, h: 199 });
export const Page02: React.FC = () => (
  <Shot n="02">
    <div style={{ position: "absolute", left: 809, top: 17, width: 143, height: 36, background: "#fff", borderRadius: 18 }} />
    {NAV_BASE(940.5, 15, 29)}
    {/* page subtitle: the photo's name patch is a different weight, so the whole line is re-set */}
    <div style={{ position: "absolute", left: 712, top: 168, width: 590, height: 30, background: PAGE2 }} />
    <Ln x={716} y0={174} size={17.05}>Everything about how Nova works. Read-only — it follows your strategy.</Ln>
    {DEPT.map((d, i) => {
      const x = [743, 1127, 1511][d.c], y0 = [402, 623][d.r];
      return (
        <React.Fragment key={i}>
          <div style={{ position: "absolute", left: x - 6, top: y0 - 5, width: 327, height: 74, background: "#fff" }} />
          <Lines x={x} y0={y0} pitch={24} size={14.96} lines={d.lines} />
        </React.Fragment>
      );
    })}
  </Shot>
);

// ------------------------------------------------------------------ page 06: Sales department
export const HWW = [
  ["Purpose and philosophy", "Why Nova sells the way it does, and how that shows up in every client conversation."],
  ["Client types and ICP", "The kinds of clients we take on, what each needs from us and how we qualify a lead."],
  ["Channels and partners", "Where Nova's leads come from, which channels earn their place and how partners fit in."],
  ["Sales process", "The steps from the first call to a paid invoice, and what happens at each one."],
  ["Service mix", "Which services we lead with, how brand and web combine, and how a project grows into a retainer."],
  ["Pricing", "How Nova prices: the minimums, how payment works and why we never discount."],
  ["Revenue goal and metrics", "The revenue goal for the next 12 months and the numbers we check to stay on track."],
  ["Tools and ownership", "The tools Sales uses, what each is for, and who owns and reviews them."],
];
export const PB = [
  ["3.6.1", "Pricing calculator", "Work out a quote from the scope, with the minimums built in."],
  ["3.6.2", "Quote and payment terms", "How a quote is sent, what we ask for up front and when invoices are due."],
  ["3.6.3", "Custom project pricing", "What to do when a project doesn't fit the standard scope and price."],
];
const L6: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: 2545, height: SH, transformOrigin: "0 0", transform: `scaleX(${K6})` }}>{children}</div>
);
export const Page06: React.FC = () => (
  <Shot n="06">
    <L6>
      {/* nav tab "Knowledge base" (the photo has an anonymising patch over it) */}
      <div style={{ position: "absolute", left: 804, top: 16, width: 140, height: 36, background: "#fff", borderRadius: 18 }} />
      {NAV_BASE(933.5, 14.7, 28)}
      {/* department intro */}
      <div style={{ position: "absolute", left: 703, top: 198, width: 627, height: 88, background: PAGE }} />
      <Lines x={707} y0={205} pitch={27.5} size={17.08} lines={["This document sets out how Nova sells: who we sell to, through which", "channels, how a deal runs, what we offer and at what price. Every How we", "work page and every playbook in Sales follows from it."]} />
      {/* Strategy row */}
      <div style={{ position: "absolute", left: 792, top: 408, width: 1000, height: 24, background: "#fff" }} />
      <Ln x={797} y0={412} size={14.04}>This document sets out how Nova sells: who we sell to, through which channels, how a deal runs, what we offer and at what price. Every…</Ln>
      {/* How we work rows */}
      {HWW.map((r, i) => (
        <React.Fragment key={i}>
          <div style={{ position: "absolute", left: 792, top: 578 + 85 * i - 4, width: 1000, height: 26, background: "#fff" }} />
          <Ln x={797} y0={578 + 85 * i} size={14.04}>{r[1]}</Ln>
        </React.Fragment>
      ))}
      {/* Playbooks: first group header */}
      <div style={{ position: "absolute", left: 728, top: 1303, width: 180, height: 28, background: HDR }} />
      <Ln x={733} y0={1311} size={13.3} weight={600} color={FAINT}>Pricing</Ln>
    </L6>
  </Shot>
);
// card rects on 06 in Shot px (native x scaled by K6)
const R6 = (x: number, y: number, w: number, h: number): Rect => ({ x: Math.round(x * K6) + 1, y: y + 1, w: Math.round(w * K6) - 2, h: h - 2 });
export const STRAT_RECT = R6(707, 363, 1132, 84);
export const HWW_RECT = R6(707, 529, 1132, 679);
export const PB_RECT: Rect = { x: Math.round(707 * K6) + 1, y: 1291, w: Math.round(1132 * K6) - 2, h: 302 };

/** the Layer 3 card (its first group, "Pricing"), built in the platform's row style; rowP[0] = header, rowP[1..3] = rows (0..1) */
export const PlaybooksCard: React.FC<{ rowP: number[] }> = ({ rowP }) => {
  const rowH = 85;
  return (
    <div style={{ position: "relative", width: PB_RECT.w, height: PB_RECT.h, background: "#fff", overflow: "hidden", borderRadius: 25 }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 2545, height: PB_RECT.h, transformOrigin: "0 0", transform: `scaleX(${K6})` }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: 1132, height: 46, background: HDR, borderBottom: "1px solid #eceef1", opacity: rowP[0] }}>
          <Ln x={26} y0={21} size={13.3} weight={600} color={FAINT}>Pricing</Ln>
        </div>
        {PB.map((r, i) => {
          const p = rowP[i + 1], top = 47 + rowH * i;
          return (
            <div key={i} style={{ position: "absolute", left: 0, top: top + (1 - p) * 26, width: 1132, height: rowH, opacity: p, borderTop: i ? "1px solid #e9eaed" : "none" }}>
              <Ln x={27} y0={37} size={14.04} color={FAINT}>{r[0]}</Ln>
              <Ln x={90} y0={24} size={16} weight={500} color={INK}>{r[1]}</Ln>
              <Ln x={90} y0={49} size={14.04}>{r[2]}</Ln>
              <svg style={{ position: "absolute", left: 1091, top: 36 }} width={12} height={14} viewBox="0 0 12 14"><path d="M3.5 2 L8.5 7 L3.5 12" fill="none" stroke={FAINT} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export { Cover } from "../kit";
