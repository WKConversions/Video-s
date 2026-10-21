import React from "react";
import { T, Para, Caps, Photo, vis, k, s, rnd, measure, ARRIVE, MOVE, OUT, SOFT, IN, FLICK, clamp01, lerp, Img, staticFile, SERIF, SANS, INK, CREAM, TAUPE, TAUPE_D } from "./brand";

// ---- 5. gatherings and what comes of them -----------------------------------------------------------------------------------------
const CARDS: { src: string; label: string; cap: string; pos?: string }[] = [
  { src: "c-laptop.jpg", label: "ideas", cap: "New ideas *emerge.*" },
  { src: "c-lounge.jpg", label: "partnerships", cap: "Partnerships *form.*" },
  { src: "c-palms.jpg", label: "opportunities", cap: "Opportunities *grow.*", pos: "50% 60%" },
];
export const Gatherings: React.FC<{ g: number }> = ({ g }) => {
  const o = vis(g, "through-0.2", "no-0.15");
  if (o <= 0) return null;
  const t = g / 30;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o, background: CREAM }}>
      <Para g={g} lines={[["exclusive", "Exclusive gatherings."], ["meaningful", "*Meaningful conversations.*"]]} x={136} y={110} size={78} color={INK} accent={TAUPE_D} lh={1.08} />
      {CARDS.map((c, i) => {
        const a = k(g, `through+${(0.5 + 0.18 * i).toFixed(2)}`, 0.8, MOVE), on = k(g, c.label, 0.5);
        const x = 136 + i * 568;
        return (
          <React.Fragment key={c.src}>
            <Photo src={c.src} x={x} y={360} w={520} h={470} a={a} zoom={1.04 + 0.06 * clamp01((t - s("through")) / 6)} pos={c.pos} />
            <div style={{ position: "absolute", left: x, top: 858, width: lerp(0, 520, k(g, c.label, 0.6, MOVE)), height: 1.5, background: TAUPE }} />
            {on > 0 && <Para g={g} lines={[[c.label, c.cap]]} x={x} y={880} size={50} color={INK} accent={TAUPE_D} />}
          </React.Fragment>
        );
      })}
    </div>
  );
};
