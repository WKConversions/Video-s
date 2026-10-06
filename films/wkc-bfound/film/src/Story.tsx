// The one stage: the gradient canvas and dot grid, the scenes under a breathing camera, the few words, the grain.
import React from "react";
import { AbsoluteFill } from "remotion";
import { Background, Chips, Dots, Grain } from "./Background";
import { Headlines, Scenes } from "./Scenes";
import { T } from "./clock";

/** The camera breathes and pushes in slowly through each chapter; it never pans or zooms on a transition. */
const camera = (g: number) => {
  const t = g / 30;
  const chapters = ["open", "maker", "response", "price", "wkc", "field", "visit", "endcard", "end"].map((l) => T.s(l));
  let i = 0;
  while (i < chapters.length - 2 && t >= chapters[i + 1]) i++;
  const u = (t - chapters[i]) / (chapters[i + 1] - chapters[i]);
  const sm = (x: number) => x * x * (3 - 2 * x);
  // each chapter pushes 3% in; the release back happens over the 0.6 s around the chapter change, eased
  const rel = Math.min(1, Math.max(0, (t - chapters[i]) / 0.8));
  const push = 1 + 0.03 * u * sm(rel);
  // a slow elliptical drift (about 25 px/s), so every layer is always travelling a little, at its own depth
  return { s: push * (1.02 + 0.008 * Math.sin(t * 0.9)), x: Math.sin(t * 0.58) * 80 + Math.sin(t * 1.1) * 6, y: Math.cos(t * 0.58) * 50,
    ry: Math.sin(t * 0.45) * 3.5, rx: Math.cos(t * 0.38) * 2.2 };
};

export const Story: React.FC<{ g: number }> = ({ g }) => {
  const t = g / 30;
  const cam = camera(g);
  const warm = T.k(g, "field", 1.2) - T.k(g, "visit", 1.2) + T.k(g, "endcard", 1.2);
  const cool = 1 - T.k(g, "price", 1.0) + T.k(g, "wkc", 1.0);
  return (
    <AbsoluteFill>
      <Background t={t} warm={warm} cool={cool} />
      <Dots t={t} ox={cam.x * 0.5} oy={cam.y * 0.5} />
      <AbsoluteFill style={{ transform: `translate(${cam.x * 0.6}px, ${cam.y * 0.6}px) scale(${1 + (cam.s - 1) * 0.5})`, transformOrigin: "50% 50%" }}>
        <Chips t={t} />
      </AbsoluteFill>
      <AbsoluteFill data-probe="camera" style={{ transform: `perspective(2400px) translate(${cam.x}px, ${cam.y}px) scale(${cam.s}) rotateY(${cam.ry}deg) rotateX(${cam.rx}deg)`, transformOrigin: "50% 50%" }}>
        <Scenes g={g} />
        <Headlines g={g} />
      </AbsoluteFill>
      <Grain />
    </AbsoluteFill>
  );
};
