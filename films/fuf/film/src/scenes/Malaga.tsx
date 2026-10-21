import React from "react";
import { T, Para, Caps, Photo, vis, k, s, rnd, measure, ARRIVE, MOVE, OUT, SOFT, IN, FLICK, clamp01, lerp, Img, staticFile, SERIF, SANS, INK, CREAM, TAUPE, TAUPE_D } from "./brand";

// ---- 4. Málaga: who it brings together -------------------------------------------------------------------------------------------
export const Malaga: React.FC<{ g: number }> = ({ g }) => {
  const o = vis(g, "an-0.25", "through-0.1");
  if (o <= 0) return null;
  const z = 1.04 + 0.1 * clamp01((g / 30 - s("an")) / 7.5);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o, background: INK }}>
      <Img src={staticFile("img/hero-malaga.jpg")} style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, objectFit: "cover", objectPosition: "60% 50%", transform: `scale(${z})`, transformOrigin: "70% 60%" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(24,20,17,0.78) 0%, rgba(24,20,17,0.45) 45%, rgba(24,20,17,0) 75%)" }} />
      <Caps t="AN INTERNATIONAL NETWORKING COMMUNITY" x={140} y={190} o={k(g, "an", 0.5)} color="#E6D7C8" />
      <Para g={g} lines={[["founders2", "Founders,"], ["entrepreneurs", "entrepreneurs,"], ["builders", "builders"], ["investors-0.2", "& *investors.*"]]} x={136} y={260} size={100} color={CREAM} accent="#E6D2BE" lh={1.04} out="through-0.4" />
      <Para g={g} lines={[["together", "Together in *Málaga.*"]]} x={136} y={720} size={76} color={CREAM} accent="#E6D2BE" out="through-0.4" />
      <div style={{ position: "absolute", left: 140, top: 830, width: lerp(0, 420, k(g, "malaga", 0.7, MOVE)), height: 1.5, background: "#E6D2BE" }} />
      <Caps t="36.72° N  ·  4.42° W" x={140} y={852} o={k(g, "malaga+0.2", 0.5) * (1 - k(g, "through-0.4", 0.3, OUT))} color="#E6D7C8" size={20} />
    </div>
  );
};
