import React from "react";
import { T, Para, Caps, Photo, vis, k, s, rnd, measure, ARRIVE, MOVE, OUT, SOFT, IN, FLICK, clamp01, lerp, Img, staticFile, SERIF, SANS, INK, CREAM, TAUPE, TAUPE_D } from "./brand";

// ---- 9. end card ------------------------------------------------------------------------------------------------------------------
export const End: React.FC<{ g: number }> = ({ g }) => {
  if (g < T.f("endcard-0.2")) return null;
  const a = k(g, "endcard-0.1", 0.7, MOVE), m = k(g, "endcard", 1.0, SOFT), btn = k(g, "together2+0.3", 0.5);
  return (
    <div style={{ position: "absolute", inset: 0, background: CREAM, clipPath: `circle(${lerp(0, 1150, a)}px at 960px 540px)` }}>
      <div style={{ position: "absolute", left: 960 - 150, top: 120, width: 300, height: 300, clipPath: `inset(0 0 ${(1 - m) * 100}% 0)` }}>
        <Img src={staticFile("img/unicorn-ink.png")} style={{ width: 300, height: 300 }} />
      </div>
      <Para g={g} lines={[["endcard", "Future *Unicorn* Founders"]]} x={0} y={460} size={92} color={INK} accent={INK} center />
      <div style={{ position: "absolute", left: 960 - lerp(0, 90, k(g, "build-0.3", 0.5, MOVE)), top: 600, width: lerp(0, 180, k(g, "build-0.3", 0.5, MOVE)), height: 1.5, background: TAUPE }} />
      <Para g={g} lines={[["build", "Build what's next, *together.*"]]} x={0} y={640} size={64} color={INK} accent={TAUPE_D} center />
      <div style={{ position: "absolute", left: 960 - 170, top: 790 + (1 - btn) * 16, width: 340, height: 74, borderRadius: 37, background: INK, opacity: btn, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontSize: 24, fontWeight: 500, color: CREAM }}>Join the community</div>
      <Caps t="MÁLAGA  ·  INTERNATIONAL" x={0} y={905} o={k(g, "together2+0.6", 0.5)} color={TAUPE_D} size={18} center />
    </div>
  );
};
