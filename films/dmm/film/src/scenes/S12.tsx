// S12 (30.8–36.4) "Join Digital Marketing Málaga. Let's grow together.": the cyan light condenses into their own
// JOIN US pill (pressed on "Join") and reveals the footer's topographic charcoal; the serif logotype builds word by
// word and the wave draws itself back after "Málaga" exactly as on frame 0; on "grow" it grows, and rings keep
// rippling from its dot through the contours to the last frame.
import React from "react";
import { AbsoluteFill } from "remotion";
import { C, CX, GRAD, GLOW, INOUT, OUT, SANS, SERIF, WaveMark, c01, k, mix, sp, w } from "../kit";
import { H } from "../handoff";
import { Scene } from "./types";

const T0 = 30.8, T1 = 36.41;
const LOGO = { size: 136, top: 140 };                 // the logotype block (3 lines), centred horizontally as a group
const PILL = { w0: 600, h0: 160, w1: 470, h1: 124, y0: 540, y1: 848 };

const Line: React.FC<{ t: number; at: number; text: string; children?: React.ReactNode }> = ({ t, at, text, children }) => {
  const q = c01(sp(t, at, 1.7, 0.74));
  return <div style={{ display: "flex", alignItems: "baseline", gap: LOGO.size * 0.2, opacity: c01(q * 1.6), transform: `translateY(${(1 - q) * LOGO.size * 0.42}px)`, filter: q < 0.97 ? `blur(${(1 - q) * 9}px)` : undefined }}>
    <span>{text}</span>{children}</div>;
};

const Join: React.FC<{ t: number }> = ({ t }) => {
  const shrink = k(t, H.cyan.t, 0.34, INOUT);                         // the cyan field condenses into the pill
  const move = k(t, w("digital3") - 0.1, 0.55, INOUT);                // then the pill steps down under the logo
  const pw = mix(mix(1920, PILL.w0, shrink), PILL.w1, move), ph = mix(mix(1080, PILL.h0, shrink), PILL.h1, move);
  const py = mix(540, mix(PILL.y0, PILL.y1, move), shrink);
  const pr = mix(0, ph / 2, k(t, H.cyan.t + 0.06, 0.24, OUT));
  const press = t > w("join") ? 1 - 0.06 * Math.sin(Math.min(Math.PI, (t - w("join")) * 12)) * Math.exp(-(t - w("join")) * 2.5) : 1;
  const label = c01(sp(t, H.cyan.t + 0.3, 2, 0.75));
  const markDraw = k(t, w("malaga3") + 0.12, 0.5, INOUT), dot = c01(sp(t, we3(), 2.4, 0.55));
  const grow = c01(sp(t, w("grow") - 0.02, 1.2, 0.7));
  return (
    <>
      {/* the logotype, built on the words; the wave mark draws on after "Málaga" as on frame 0 */}
      <div style={{ position: "absolute", left: 0, right: 0, top: LOGO.top, display: "flex", justifyContent: "center", transform: "translateX(56px)" }}>
        <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: LOGO.size, lineHeight: 0.98, color: C.white, letterSpacing: "-0.012em", fontVariationSettings: "'opsz' 60", paddingRight: LOGO.size * 0.9 }}>
          <Line t={t} at={w("digital3") - 0.06} text="Digital" />
          <Line t={t} at={w("marketing3") - 0.06} text="Marketing" />
          <Line t={t} at={w("malaga3") - 0.06} text="Málaga">
            <div style={{ transform: `translateY(${LOGO.size * 0.1}px) scaleY(${1 + 0.18 * grow})`, transformOrigin: "50% 100%" }}>
              <WaveMark width={LOGO.size * 1.25} p={markDraw} dot={dot} />
            </div>
          </Line>
        </div>
      </div>
      {/* "Let's grow together." */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 606, display: "flex", justifyContent: "center", fontFamily: SANS, fontWeight: 700, fontSize: 96, letterSpacing: "-0.025em", color: C.white }}>
        {["Let's", "grow", "together."].map((wd, i) => { const at = [w("lets"), w("grow"), w("together")][i] - 0.08; const q = c01(sp(t, at, 1.8, 0.72));
          return <span key={wd} style={{ display: "inline-block", marginRight: "0.24em", opacity: c01(q * 1.6), transform: `translateY(${(1 - q) * 38}px)`, filter: q < 0.97 ? `blur(${(1 - q) * 10}px)` : undefined,
            ...(i === 2 ? { backgroundImage: GRAD, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" } : {}) }}>{wd}</span>; })}
      </div>
      {/* the cyan field that becomes the JOIN US pill */}
      <div style={{ position: "absolute", left: 0, top: 0, width: pw, height: ph, borderRadius: pr, background: GRAD, boxShadow: shrink > 0.8 ? GLOW : undefined,
        transform: `translate(${CX - pw / 2}px, ${py - ph / 2}px) scale(${press})`, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        <span style={{ fontFamily: SANS, fontWeight: 600, fontSize: mix(58, 48, move), letterSpacing: "0.04em", color: C.char, opacity: label, transform: `translateY(${(1 - label) * 16}px)` }}>JOIN US</span>
        {/* a slow sheen keeps the pill alive on the end card */}
        <div style={{ position: "absolute", top: 0, bottom: 0, width: 120, left: 0, transform: `translateX(${mix(-160, pw + 40, ((t - 34.2) / 1.8) % 1)}px) skewX(-18deg)`,
          background: "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.35), rgba(255,255,255,0))", opacity: t > 34.2 ? 1 : 0 }} />
      </div>
      {/* the address */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 950, textAlign: "center", fontFamily: SANS, fontWeight: 500, fontSize: 40, color: C.grey, letterSpacing: "0.01em",
        opacity: k(t, w("lets") + 0.1, 0.5), transform: `translateY(${(1 - k(t, w("lets") + 0.1, 0.6)) * 18}px)` }}>digitalmarketingmalaga.com</div>
      {t < H.cyan.t + 0.02 && <AbsoluteFill style={{ background: GRAD }} />}
    </>
  );
};
const we3 = () => w("malaga3") + 0.55;

/** where the wave's dot sits on the end card (for the rings) */
const DOT = { x: CX + 360, y: 450 };

export const S12: Scene = {
  id: "S12", t0: T0, t1: T1, C: Join,
  topo: (t) => ({
    ripples: [
      { x: CX, y: PILL.y0, age: t - w("join"), h: 0.6, w: 80, speed: 950 },
      ...[0, 1, 2, 3].map((i) => ({ x: DOT.x, y: DOT.y, age: t - (w("together") + i * 0.7), h: 0.45, w: 70, speed: 700 })),
    ],
    bumps: [{ x: DOT.x, y: DOT.y, h: 0.5 * c01(sp(t, w("grow"), 1, 0.8)), r: 220 }],
  }),
};
