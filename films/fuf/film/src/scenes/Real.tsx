import React from "react";
import { T, Para, Caps, Photo, vis, k, s, rnd, measure, ARRIVE, MOVE, OUT, SOFT, IN, FLICK, clamp01, lerp, Img, staticFile, SERIF, SANS, INK, CREAM, TAUPE, TAUPE_D } from "./brand";

// ---- 7. what it is instead ---------------------------------------------------------------------------------------------------------
export const Real: React.FC<{ g: number }> = ({ g }) => {
  const o = vis(g, "just-0.25", "because-0.1");
  if (o <= 0) return null;
  const t = g / 30;
  const items: [string, string][] = [["just", "Ambitious *minds.*"], ["real", "Real *conversations.*"], ["connections2", "Connections that *matter.*"]];
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o, background: CREAM }}>
      <Photo src="c-terrace.jpg" x={136} y={110} w={640} h={860} a={k(g, "just-0.2", 0.9, MOVE)} zoom={1.05 + 0.17 * clamp01((t - s("just")) / 5)} pos={`${42 + 16 * clamp01((t - s("just")) / 5)}% 35%`} />
      <Photo src="c-bar.jpg" x={600} y={640} w={330} h={370} a={k(g, "real-0.2", 0.8, MOVE)} zoom={1.05 + 0.15 * clamp01((t - s("real")) / 3)} />
      <Caps t="JUST" x={1010} y={270} o={k(g, "just", 0.5)} color={TAUPE_D} />
      {items.map(([label, text], i) => (
        <React.Fragment key={label}>
          <div style={{ position: "absolute", left: 1010, top: 360 + i * 150, width: lerp(0, 60, k(g, label, 0.5, MOVE)), height: 1.5, background: TAUPE }} />
          <Para g={g} lines={[[i === 0 ? "minds-0.3" : label, text]]} x={1090} y={322 + i * 150} size={74} color={INK} accent={TAUPE_D} />
        </React.Fragment>
      ))}
    </div>
  );
};
