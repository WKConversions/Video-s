// The end card: the site's dot-grid page grows out of your roof (a feathered circle, never a hard wipe) while the
// sign-off badge's mark and name fly out of their pill to the centre and grow into the lockup; the line and the site's
// own button follow. It keeps moving: the grid drifts, the halo breathes, a slow push.
import React from "react";
import { T } from "./clock";
import { C, F, clamp01, lerp, rgba } from "./lib";
import { EASE } from "./kinetic";
import { k, sec, youRoof } from "./scene";
import { Button, Mark } from "./ui";

/** Where the badge's mark and name sit (its pill's centre), from Cards.tsx Badge: 52 above the roof, content 104 up. */
const badgeCentre = (g: number): [number, number] => { const [ax, ay] = youRoof(g, 4); return [ax, ay - 104]; };
const LOCK: [number, number] = [960, 440], GROW = 2.6;

export const Finale: React.FC<{ g: number }> = ({ g }) => {
  const t = sec(g);
  if (t < T.s("endcard") - 0.05) return null;
  const [rx, ry] = youRoof(g);
  const u = k(g, "endcard", 0.9, EASE.soft);
  const r = lerp(0, 2300, u), feather = 220;
  const cx = lerp(rx, 960, u), cy = lerp(ry, 540, u);
  const a = (d: number, dur = 0.4) => k(g, `endcard+${d}`, dur);
  const since = t - T.s("endcard");
  const drift = since * 34;
  const push = 1 + 0.014 * since;
  // the lockup flies from the badge to the centre (it rides above the growing page, so it is never masked)
  const [bx, by] = badgeCentre(g);
  const fly = k(g, "endcard", 0.85, EASE.longS), sc = lerp(1, GROW, fly) * push;
  const lx = lerp(bx, LOCK[0], fly), ly = lerp(by, LOCK[1], fly);
  return (
    <>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080,
        WebkitMaskImage: `radial-gradient(circle at ${cx}px ${cy}px, #000 ${Math.max(0, r - feather)}px, transparent ${r}px)`,
        maskImage: `radial-gradient(circle at ${cx}px ${cy}px, #000 ${Math.max(0, r - feather)}px, transparent ${r}px)` }}>
        <div style={{ position: "absolute", inset: 0, background: C.page, backgroundImage: `radial-gradient(circle, ${C.dot} 2.4px, transparent 2.9px)`, backgroundSize: "40px 40px",
          backgroundPosition: `${drift}px ${-drift * 0.5}px` }} />
        <div style={{ position: "absolute", left: 960 - 520, top: 540 - 470, width: 1040, height: 1040, borderRadius: "50%", background: `radial-gradient(circle, ${rgba(C.blue, 0.1)}, transparent 62%)`,
          transform: `scale(${1 + 0.04 * Math.sin(t * 1.5)})` }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 570, display: "flex", flexDirection: "column", alignItems: "center", fontFamily: F.display, color: C.ink,
          transform: `scale(${push})`, transformOrigin: "50% 0%" }}>
          <div style={{ fontWeight: 700, fontSize: 46, letterSpacing: "-0.035em", color: C.txt2, opacity: clamp01(a(0.45) * 1.4), transform: `translateY(${(1 - a(0.45)) * 24}px)`,
            filter: a(0.45) < 1 ? `blur(${(1 - a(0.45)) * 6}px)` : undefined }}>
            Designed to move. Built to <span style={{ color: C.blue }}>convert.</span>
          </div>
          <div style={{ marginTop: 50, opacity: clamp01(a(0.6) * 1.4), transform: `translateY(${(1 - a(0.6)) * 24}px)` }}>
            <Button size={32} />
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, top: 0, transform: `translate3d(${lx}px, ${ly}px, 0)`, willChange: "transform" }}>
        <div style={{ position: "absolute", left: 0, top: 0, transform: `translate(-50%, -50%) scale(${sc})`, display: "flex", alignItems: "center", gap: 16, whiteSpace: "nowrap" }}>
          <Mark w={86} id="end" />
          <div style={{ fontFamily: F.display, fontWeight: 800, fontSize: 36, letterSpacing: "-0.05em", color: C.ink }}>WKConversions</div>
        </div>
      </div>
    </>
  );
};
