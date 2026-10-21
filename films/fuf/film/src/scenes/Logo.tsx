import React from "react";
import { T, Para, Caps, Photo, vis, k, s, rnd, measure, ARRIVE, MOVE, OUT, SOFT, IN, FLICK, clamp01, lerp, Img, staticFile, SERIF, SANS, INK, CREAM, TAUPE, TAUPE_D } from "./brand";

// ---- 3. Meet Future Unicorn Founders --------------------------------------------------------------------------------------------
export const Logo: React.FC<{ g: number }> = ({ g }) => {
  if (g < T.f("meet-0.2") || g > T.f("an+0.6")) return null;
  const r = k(g, "meet-0.1", 0.8, MOVE), o = 1 - k(g, "an-0.1", 0.45, OUT), m = k(g, "future-0.1", 0.9, SOFT);
  return (
    <div style={{ position: "absolute", inset: 0, background: CREAM, clipPath: `circle(${lerp(0, 1150, r)}px at 960px 540px)` }}>
      <div style={{ position: "absolute", inset: 0, opacity: o }}>
        <div style={{ position: "absolute", left: 470, top: 300, width: 480, height: 480, clipPath: `inset(0 0 ${(1 - m) * 100}% 0)`, transform: `scale(${0.94 + 0.06 * m})` }}>
          <Img src={staticFile("img/unicorn-ink.png")} style={{ width: 480, height: 480 }} />
        </div>
        <Para g={g} lines={[["future", "Future"], ["unicorn", "*Unicorn*"], ["founders", "Founders"]]} x={980} y={350} size={124} color={INK} accent={INK} lh={0.98} />
        <div style={{ position: "absolute", left: 958, top: 340, width: 2, height: lerp(0, 400, k(g, "future", 0.6, MOVE)), background: TAUPE }} />
      </div>
    </div>
  );
};
