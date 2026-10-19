// Scene A — behind the prompt (open → sB): "Behind this prompt, an AI motion-design studio."
// The landing look (glow, a big prompt box tilted back on a 3D stage). On "Behind / this prompt" the box swings open
// like a door on its left edge, the glow sinks away and the studio stands behind it in depth, dim and out of focus:
// the Fjello site, film tiles, the storyboard card, a step list, the loupe. On "an AI motion-design studio" the
// stations come into focus front to back, each with a violet check; on "studio" the whole studio is lit. Then the
// door closes and the stations recede, leaving the box alone, front-on, where B types the brief.
import React from "react";
import {
  Activity, C, CRAFT, Check, FjFrame, FjSite, Glow, LAND, LEAVE, PromptBox, SHADOW_BIG, SHADOW_DEEP, Stage3D, StoryboardCard,
  clamp01, f, k, mix, promptH, steps,
} from "../shared";

// The prompt box's place in A and B (the landing page's position: centred, a little below the middle).
export const BOX = { x: 410, y: 560, w: 1100 };
export const BOX_H = promptH(BOX.w);
export const PERSP = 2400;
// The box's slow push toward the viewer: already moving at frame 0, resting while the door is open, then a gentle
// push again from "studio" through B (one function, so A and B join without a step).
export const boxZ = (g: number) =>
  -60 * (1 - LAND(clamp01(g / 70))) + 40 * CRAFT(clamp01((g - f("w:studio")) / (f("sC") - f("w:studio"))));

// a label shifted by off seconds (labels may already carry an offset: "w:numbers+0.1")
const lbl = (l: string, off: number) => {
  const m = l.match(/^(.+?)([+-][\d.]+)?$/) as RegExpMatchArray;
  const o = (m[2] ? parseFloat(m[2]) : 0) + off;
  return Math.abs(o) < 1e-6 ? m[1] : `${m[1]}${o > 0 ? "+" : "-"}${Math.abs(o).toFixed(3)}`;
};

// A station of the studio, placed by where it should appear (projected centre cx, cy) at depth z.
type St = { cx: number; cy: number; z: number; w: number; h: number; ry: number; el: React.ReactNode; check: [number, number] };

const Loupe: React.FC<{ d: number }> = ({ d }) => (
  <div style={{ position: "relative", width: d * 1.5, height: d * 1.5 }}>
    <div style={{ position: "absolute", left: d * 0.86, top: d * 0.86, width: d * 0.62, height: d * 0.13, borderRadius: d * 0.07, background: C.ink, transform: "rotate(45deg)", transformOrigin: "0 50%" }} />
    <div style={{ position: "absolute", left: 0, top: 0, width: d, height: d, borderRadius: "50%", overflow: "hidden", background: C.white,
      boxShadow: `0 0 0 ${d * 0.05}px ${C.white}, 0 0 0 ${d * 0.075}px ${C.violet}, ${SHADOW_BIG}` }}>
      <div style={{ position: "absolute", left: -d * 0.55, top: -d * 0.2, width: d * 2.2, height: d * 1.24 }}><FjFrame i={0} w={d * 2.2} h={d * 1.24} t={1} /></div>
    </div>
  </div>
);

const Tiles: React.FC<{ w: number }> = ({ w }) => {
  const h = (w * 9) / 16;
  return (
    <div style={{ position: "relative", width: w * 1.3, height: h * 1.5 }}>
      {[3, 2, 0].map((i, j) => (
        <div key={i} style={{ position: "absolute", left: (2 - j) * w * 0.15, top: j * h * 0.25, width: w, height: h, borderRadius: w * 0.03, overflow: "hidden", boxShadow: `0 0 0 1px ${C.line}, ${SHADOW_BIG}` }}>
          <FjFrame i={i} w={w} h={h} t={1} />
        </div>
      ))}
    </div>
  );
};

const STATIONS: St[] = [
  { cx: 650, cy: 300, z: -150, w: 760, h: 470, ry: 8, check: [760, 0], el: <FjSite w={760} h={470} /> },
  { cx: 1390, cy: 290, z: -350, w: 640, h: 520, ry: -6, check: [624, 0], el: <Tiles w={480} /> },
  { cx: 1530, cy: 760, z: -550, w: 600, h: 500, ry: -10, check: [600, 0], el: <StoryboardCard w={600} size={20} /> },
  { cx: 975, cy: 828, z: -750, w: 600, h: 480, ry: 4, check: [600, 0],
    el: <Activity g={0} steps={steps(4).slice(0, 4)} clock="Working 0:42" w={600} size={26} /> },
  { cx: 1215, cy: 560, z: -950, w: 360, h: 360, ry: 0, check: [215, 25], el: <Loupe d={240} /> },
];

export const SceneA: React.FC<{ g: number }> = ({ g }) => {
  if (g < f("open") || g >= f("sB")) return null;

  // the door: opens on "Behind / this prompt", shuts after "studio"
  const open = k(g, "w:behind", 1.25, CRAFT);
  const shut = k(g, "w:studio+0.1", 0.65, CRAFT);
  const ang = -70 * open * (1 - shut);
  const tilt = 8 * (1 - shut);
  // the glow sinks away as we go behind the prompt
  const sink = k(g, "w:behind", 1.4, CRAFT);
  // the studio: revealed dim, focused front to back, lit on "studio", receding as the door shuts
  const rev = k(g, "w:this", 1.4, LAND);
  const lit = k(g, "w:studio", 0.35, LAND);
  const out = k(g, "w:studio+0.1", 0.62, LEAVE);
  const dolly = 160 * CRAFT(clamp01(g / f("sB")));

  return (
    <>
      <Glow g={g} a={1 - sink} y={sink * 420} />
      {/* the studio's light, on "studio" */}
      <div style={{ position: "absolute", inset: 0, opacity: lit * (1 - out),
        background: "radial-gradient(ellipse 46% 52% at 62% 50%, rgba(238,232,255,0.95), rgba(238,232,255,0.45) 55%, rgba(238,232,255,0) 80%)" }} />
      <Stage3D persp={PERSP}>
        {STATIONS.map((s, i) => {
          const p = k(g, lbl("w:an", i * 0.25), 0.4, LAND);
          const sc = PERSP / (PERSP - s.z);
          const X = 960 + (s.cx - 960) / sc, Y = 540 + (s.cy - 540) / sc;
          const op = rev * mix(0.4, 1, p) * (1 - out);
          const blur = mix(7, 0, p) + (1 - rev) * 6 + out * 12;
          const scale = mix(0.95, 1, p) * (1 + 0.025 * lit) * (1 - 0.12 * out);
          if (op <= 0.001) return null;
          return (
            <div key={i} style={{ position: "absolute", left: X - s.w / 2, top: Y - s.h / 2, width: s.w, height: s.h, opacity: op,
              transform: `translateZ(${s.z + dolly - 260 * out}px) rotateY(${s.ry}deg) scale(${scale})`,
              filter: `blur(${blur.toFixed(2)}px) saturate(${mix(0.35, 1, p).toFixed(3)})` }}>
              {s.el}
              <Check size={40} p={clamp01((p - 0.45) * 2.2)} style={{ position: "absolute", left: s.check[0] - 20, top: s.check[1] - 20, boxShadow: "0 6px 16px -6px rgba(136,83,223,0.7)" }} />
            </div>
          );
        })}
        {/* the prompt box, a door on its left edge */}
        <div style={{ position: "absolute", left: BOX.x, top: BOX.y, width: BOX.w, transformOrigin: "0% 50%",
          transform: `translateZ(${boxZ(g)}px) rotateY(${ang}deg) rotateX(${tilt}deg)` }}>
          <PromptBox w={BOX.w} g={g} style={{ boxShadow: open > 0.02 && shut < 0.98 ? `${SHADOW_DEEP}, -30px 0 60px -30px rgba(60,40,110,0.25)` : SHADOW_BIG }} />
        </div>
      </Stage3D>
    </>
  );
};

