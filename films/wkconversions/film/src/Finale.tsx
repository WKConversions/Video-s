// The end card: the site's dot-grid page grows out of your roof (a feathered circle, never a hard wipe) and carries the
// mark, the name, the line and the site's own button. It keeps moving: the grid drifts, the button's arrow nudges.
import React from "react";
import { T } from "./clock";
import { C, F, clamp01, lerp, rgba } from "./lib";
import { EASE } from "./kinetic";
import { k, sec, youRoof } from "./scene";
import { Button, Mark } from "./ui";

export const Finale: React.FC<{ g: number }> = ({ g }) => {
  const t = sec(g);
  if (t < T.s("endcard") - 0.05) return null;
  const [rx, ry] = youRoof(g);
  const u = k(g, "endcard", 0.9, EASE.soft);
  const r = lerp(0, 2300, u), feather = 220;
  const cx = lerp(rx, 960, u), cy = lerp(ry, 540, u);
  const a = (d: number, dur = 0.55) => k(g, `endcard+${d}`, dur);
  const drift = (t - T.s("endcard")) * 34;
  const nudge = Math.max(0, Math.sin((t - T.s("endcard") - 1.4) * 4)) * 5;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080,
      WebkitMaskImage: `radial-gradient(circle at ${cx}px ${cy}px, #000 ${Math.max(0, r - feather)}px, transparent ${r}px)`,
      maskImage: `radial-gradient(circle at ${cx}px ${cy}px, #000 ${Math.max(0, r - feather)}px, transparent ${r}px)` }}>
      <div style={{ position: "absolute", inset: 0, background: C.page, backgroundImage: `radial-gradient(circle, ${C.dot} 2.4px, transparent 2.9px)`, backgroundSize: "40px 40px",
        backgroundPosition: `${drift}px ${-drift * 0.5}px` }} />
      <div style={{ position: "absolute", left: 960 - 520, top: 540 - 470, width: 1040, height: 1040, borderRadius: "50%", background: `radial-gradient(circle, ${rgba(C.blue, 0.1)}, transparent 62%)`,
        transform: `scale(${1 + 0.04 * Math.sin(t * 1.5)})` }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 236, display: "flex", flexDirection: "column", alignItems: "center", fontFamily: F.display, color: C.ink, transform: `scale(${1 + 0.018 * (t - T.s("endcard"))})`, transformOrigin: "50% 45%" }}>
        <div style={{ opacity: clamp01(a(0.15) * 1.5), transform: `translateY(${(1 - a(0.15)) * 24}px)` }}>
          <Mark w={260} id="end" reveal={k(g, "endcard+0.15", 0.8, EASE.steady)} />
        </div>
        <div style={{ marginTop: 26, fontWeight: 800, fontSize: 112, letterSpacing: "-0.05em", lineHeight: 1, opacity: a(0.35), transform: `translateY(${(1 - a(0.35)) * 30}px)`, filter: a(0.35) < 1 ? `blur(${(1 - a(0.35)) * 8}px)` : undefined }}>
          WKConversions
        </div>
        <div style={{ marginTop: 26, fontWeight: 700, fontSize: 44, letterSpacing: "-0.035em", color: C.txt2, opacity: a(0.55), transform: `translateY(${(1 - a(0.55)) * 24}px)` }}>
          Designed to move. Built to <span style={{ color: C.blue }}>convert.</span>
        </div>
        <div style={{ marginTop: 48, opacity: a(0.75), transform: `translateY(${(1 - a(0.75)) * 24}px) translateX(${nudge * 0.2}px)` }}>
          <Button size={30} />
        </div>
      </div>
    </div>
  );
};
