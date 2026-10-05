// The end card (the calmest moment of the film): the building fades in place; the dot that did the work all film glides
// off the roof and becomes the "." of wicflow.com; the wordmark opens out of it; the W writes itself; the site's line and
// its black "AI analysis" pill arrive. Nothing else crosses the screen.
import React from "react";
import { T } from "./clock";
import { C, F, clamp01, lerp, mix } from "./lib";
import { EASE, measure } from "./kinetic";
import { ARRIVE, MOVE, k, roofXY } from "./scene";
import { Mark, Pill } from "./ui";

const WS = 112;                                       // wordmark size
export const Finale: React.FC<{ g: number }> = ({ g }) => {
  const t = g / 30;
  if (t < T.s("glide") - 0.05) return null;
  const ls = -0.045;
  const wW = measure("wicflow", WS, 600, ls), dW = measure(".", WS, 600, ls), cW = measure("com", WS, 600, ls);
  const markW = 168, gap = 34;
  const total = markW + gap + wW + dW + cW;
  const x0 = 960 - total / 2, base = 470;               // the lockup's left edge and the wordmark's top
  const wx = x0 + markW + gap;                          // where "wicflow" starts
  const dotX = wx + wW + dW * 0.5, dotY = base + WS * 0.78;
  // the dot's glide (B2 long S): from the roof to the period
  const gl = k(g, "glide", 0.52, EASE.longS);
  const [rx, ry] = roofXY(g);
  const x = lerp(rx, dotX, gl), y = lerp(ry, dotY, gl) - Math.sin(gl * Math.PI) * 60;
  const r = lerp(11, WS * 0.085, gl);
  const ink = k(g, "end-0.9", 0.6, MOVE);              // the period eases to the wordmark's ink for the hold
  // the wordmark opens out of the dot: "wicflow" leftward, "com" rightward (masks from the dot)
  const open = k(g, "word", 0.45);
  const markU = k(g, "mark", 0.42, ARRIVE);
  const lineU = k(g, "line", 0.5);
  const ctaL = k(g, "cta", 0.4, (x) => x);
  const cta = ARRIVE(ctaL);
  const words = "An AI partner that runs your sales and marketing.".split(" ");
  return (
    <>
      {open > 0 && (
        <div style={{ position: "absolute", left: wx, top: base, fontFamily: F.display, fontWeight: 600, fontSize: WS, letterSpacing: `${ls}em`, lineHeight: 1.1, color: C.ink, whiteSpace: "nowrap" }}>
          <span style={{ display: "inline-block", WebkitMaskImage: `linear-gradient(to left, #000 ${open * 100}%, transparent ${open * 100 + 18}%)`, maskImage: `linear-gradient(to left, #000 ${open * 100}%, transparent ${open * 100 + 18}%)`, transform: `translateX(${(1 - open) * 40}px)` }}>wicflow</span>
          <span style={{ display: "inline-block", width: dW }} />
          <span style={{ display: "inline-block", WebkitMaskImage: `linear-gradient(to right, #000 ${open * 100}%, transparent ${open * 100 + 30}%)`, maskImage: `linear-gradient(to right, #000 ${open * 100}%, transparent ${open * 100 + 30}%)`, transform: `translateX(${(1 - open) * -40}px)` }}>com</span>
        </div>
      )}
      {markU > 0 && <div style={{ position: "absolute", left: x0, top: base + 6, WebkitMaskImage: `linear-gradient(to right, #000 ${markU * 100}%, transparent ${markU * 100 + 20}%)`, maskImage: `linear-gradient(to right, #000 ${markU * 100}%, transparent ${markU * 100 + 20}%)`, transform: `translateX(${(1 - markU) * -18}px)` }}><Mark w={markW} /></div>}
      {gl > 0 && <div style={{ position: "absolute", left: x - r, top: y - r, width: 2 * r, height: 2 * r, borderRadius: gl > 0.95 ? "18%" : "50%", background: mix(C.blue, C.ink, ink),
        boxShadow: gl < 0.9 ? `0 0 0 ${10 * (1 - gl)}px rgba(23,105,194,0.12)` : undefined }} />}
      {lineU > 0 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: base + 168, textAlign: "center", fontFamily: F.ui, fontSize: 42, fontWeight: 500, color: C.muted, letterSpacing: "-0.01em" }}>
          {words.map((w, i) => { const u = clamp01((t - T.s("line") - i * 0.06) / 0.3); return <span key={i} style={{ display: "inline-block", marginRight: 11, opacity: ARRIVE(u), transform: `translateY(${(1 - ARRIVE(u)) * 14}px)` }}>{w}</span>; })}
        </div>
      )}
      {cta > 0 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: base + 250, display: "flex", justifyContent: "center", opacity: clamp01(ctaL * 3), transform: `translateY(${(1 - cta) * 24}px) scale(${lerp(0.85, 1, cta)})` }}>
          <Pill size={30}>AI analysis</Pill>
        </div>
      )}
    </>
  );
};
