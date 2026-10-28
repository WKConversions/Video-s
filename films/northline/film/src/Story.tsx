// Northline Advisory: a 12-second seamless explainer loop (1920 × 1080). "Progress starts with a clear line", then the
// three areas of expertise (strategic focus, organizational transformation, operational acceleration), each with its
// photograph, and back to the opening line. A copper progress line under the copy marks the step. The opening beat
// wraps round the loop's end, so the last frame leads straight into the first. Brand: the site's paper, navy, ink and
// copper; Manrope and DM Sans.
import React from "react";
import { Img, staticFile } from "remotion";
import { MOVE, clamp01, lerp } from "./lib";

const PAPER = "#f3f0e9", INK = "#111b2b", NAVY = "#0d1d31", COPPER = "#b66d45", MUTED = "#606875", LINE = "rgba(17,27,43,.17)";
const HEAD = "Manrope", BODY = "DM Sans";
const LOOP = 12;
type Beat = { from: number; to: number; num?: string; kicker: string; head: [string, string]; body: [string, string]; img: string; pos?: string };
// beat windows in seconds; the first one wraps (10.6 → 15.0 = 3.0)
const BEATS: Beat[] = [
  { from: 10.6, to: 15.0, kicker: "Strategy · Transformation · Execution", head: ["Progress starts", "with a clear line."], body: ["Northline helps leaders turn complex choices", "into a focused direction, and visible progress."], img: "northline-hero.png" },
  { from: 3.0, to: 5.6, num: "01", kicker: "Strategic focus", head: ["Sharpen choices.", "One direction."], body: ["Connect priorities into a direction", "the whole organization understands."], img: "case-strategy.png" },
  { from: 5.6, to: 8.2, num: "02", kicker: "Organizational transformation", head: ["Structure around", "what creates value."], body: ["Redesign structure, leadership and", "decision-making around one direction."], img: "case-operations.png", pos: "60% 50%" },
  { from: 8.2, to: 10.6, num: "03", kicker: "Operational acceleration", head: ["Turn strategy", "into rhythm."], body: ["Clear programs, ownership", "and measurable progress."], img: "northline-hero.png", pos: "35% 50%" },
];
const local = (t: number, b: Beat) => ((t - b.from) % LOOP + LOOP) % LOOP;   // seconds since the beat began
const span = (b: Beat) => b.to - b.from;
const ease = (x: number) => MOVE(clamp01(x));

export const Story: React.FC<{ g: number }> = ({ g }) => {
  const t = (g / 30) % LOOP;
  return (
    <div style={{ position: "absolute", inset: 0, background: PAPER, overflow: "hidden" }}>
      {/* the photograph panel: each beat's photo crossfades in and pushes in slowly */}
      <div style={{ position: "absolute", left: 1000, top: 0, width: 920, height: 1080, overflow: "hidden", background: NAVY }}>
        {BEATS.map((b, i) => {
          const u = local(t, b), inA = ease(u / 0.7), live = u < span(b) + 0.7;
          if (!live) return null;
          return <Img key={i} src={staticFile("img/" + b.img)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: b.pos ?? "50% 50%", opacity: inA, transform: `scale(${1.04 + 0.05 * clamp01(u / (span(b) + 0.7))})`, zIndex: u < 0.7 ? 2 : 1 }} />;
        })}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(13,29,49,0.18), rgba(13,29,49,0) 40%)" }} />
      </div>
      {/* the brand */}
      <div style={{ position: "absolute", left: 120, top: 92, display: "flex", alignItems: "center", gap: 18 }}>
        <div style={{ width: 52, height: 52, background: NAVY, color: PAPER, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: HEAD, fontWeight: 700, fontSize: 28 }}>N</div>
        <div style={{ fontFamily: HEAD, fontWeight: 600, fontSize: 30, color: INK, letterSpacing: "-0.01em" }}>Northline Advisory</div>
      </div>
      {/* the copy for each beat */}
      {BEATS.map((b, i) => {
        const u = local(t, b), d = span(b);
        if (u > d + 0.1) return null;
        const a = (q: number) => ease((u - q) / 0.55) * (1 - ease((u - d + 0.45) / 0.4));
        const rise = (q: number) => (1 - ease((u - q) / 0.55)) * 22;
        return (
          <div key={i} style={{ position: "absolute", left: 120, top: 0, width: 820 }}>
            <div style={{ position: "absolute", top: 330, display: "flex", gap: 18, fontFamily: BODY, fontWeight: 600, fontSize: 22, letterSpacing: "0.2em", textTransform: "uppercase", color: COPPER, opacity: a(0), transform: `translateY(${rise(0)}px)`, whiteSpace: "nowrap" }}>
              {b.num && <span>{b.num}</span>}<span>{b.kicker}</span>
            </div>
            {b.head.map((h, j) => (
              <div key={j} style={{ position: "absolute", top: 380 + j * 100, fontFamily: HEAD, fontWeight: 700, fontSize: 86, letterSpacing: "-0.035em", lineHeight: 1.05, color: j === 1 && i === 0 ? COPPER : INK, opacity: a(0.08 + 0.08 * j), transform: `translateY(${rise(0.08 + 0.08 * j)}px)`, whiteSpace: "nowrap" }}>{h}</div>
            ))}
            {b.body.map((l, j) => (
              <div key={j} style={{ position: "absolute", top: 610 + j * 44, fontFamily: BODY, fontSize: 30, color: MUTED, opacity: a(0.3), transform: `translateY(${rise(0.3)}px)`, whiteSpace: "nowrap" }}>{l}</div>
            ))}
          </div>
        );
      })}
      {/* the clear line: three steps, the active one drawn in copper */}
      <div style={{ position: "absolute", left: 120, top: 860, width: 760, height: 2, background: LINE }} />
      {[1, 2, 3].map((n) => {
        const b = BEATS[n], u = local(t, b), on = u < span(b) ? ease(u / 0.5) * (1 - ease((u - span(b) + 0.3) / 0.3)) : 0;
        const x0 = 120 + (n - 1) * 260, fill = u < span(b) ? clamp01(u / span(b)) : 0;
        return (
          <React.Fragment key={n}>
            <div style={{ position: "absolute", left: x0, top: 859, width: 240 * fill, height: 4, background: COPPER, opacity: on }} />
            <div style={{ position: "absolute", left: x0, top: 880, fontFamily: BODY, fontWeight: 600, fontSize: 22, letterSpacing: "0.16em", color: lerp(0, 1, on) > 0.5 ? COPPER : MUTED }}>{`0${n}`}</div>
          </React.Fragment>
        );
      })}
    </div>
  );
};
