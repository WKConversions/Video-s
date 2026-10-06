// The canvas: near-white where the type sits, a blurred mesh gradient glowing up from the corners (WKConversions blue and
// sky from the left, bFound indigo and lilac from the right, bFound's cream low in the middle), drifting slowly; the
// site's dot grid drifting with the stage; a fixed film grain over everything. `hue` shifts the balance between chapters.
import React from "react";
import { AbsoluteFill } from "remotion";
import { C, rgba } from "./lib";

export const Background: React.FC<{ t: number; warm: number; cool: number }> = ({ t, warm, cool }) => {
  const d = (a: number, f: number, p: number) => a * Math.sin(t * f + p);
  const blob = (x: number, y: number, r: number, col: string, o: number) =>
    `radial-gradient(${r}px ${r * 0.8}px at ${x}px ${y}px, ${rgba(col, o)}, ${rgba(col, 0)} 70%)`;
  const bg = [
    blob(80 + d(60, 0.35, 0), 60 + d(40, 0.3, 1), 760, C.wkc, 0.55 * cool + 0.25),
    blob(420 + d(80, 0.27, 2), -120 + d(40, 0.33, 3), 620, C.sky, 0.5),
    blob(1880 + d(70, 0.31, 4), 1060 + d(50, 0.29, 5), 820, C.bf, 0.5 * cool + 0.3),
    blob(1500 + d(90, 0.25, 1), 1180 + d(40, 0.37, 2), 640, C.lilac, 0.55),
    blob(1840 + d(50, 0.33, 3), 40 + d(60, 0.26, 4), 520, C.lilac, 0.32),
    blob(260 + d(60, 0.29, 5), 1100 + d(50, 0.31, 0), 600, "#F7E7B0", 0.35 + 0.35 * warm),
  ].join(", ");
  return (
    <AbsoluteFill style={{ background: C.page }}>
      <AbsoluteFill style={{ backgroundImage: bg }} />
      <AbsoluteFill style={{ background: "radial-gradient(900px 560px at 960px 520px, rgba(255,255,255,0.78), rgba(255,255,255,0) 72%)" }} />
    </AbsoluteFill>
  );
};

/** The dot grid (the WKConversions site's paper), drifting with the stage: fine dots, too small to read as things. */
export const Dots: React.FC<{ t: number; ox: number; oy: number }> = ({ t, ox, oy }) => {
  const step = 40, dx = (((t * 42 + ox) % step) + step) % step, dy = (((t * -22 + oy) % step) + step) % step;
  return (
    <AbsoluteFill style={{ backgroundImage: `radial-gradient(circle, ${rgba("#8E93C8", 0.42)} 2.5px, transparent 3px)`, backgroundSize: `${step}px ${step}px`,
      backgroundPosition: `${dx}px ${dy}px`, WebkitMaskImage: "radial-gradient(900px 560px at 960px 540px, rgba(0,0,0,0.25) 10%, #000 70%)", maskImage: "radial-gradient(900px 560px at 960px 540px, rgba(0,0,0,0.25) 10%, #000 70%)" }} />
  );
};

/** Fixed film grain (it never moves; the gradient drifts under it). */
export const Grain: React.FC = () => (
  <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, opacity: 0.09, mixBlendMode: "multiply" }}>
    <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={7} stitchTiles="stitch" /><feColorMatrix type="saturate" values="0" /></filter>
    <rect width="1920" height="1080" filter="url(#grain)" />
  </svg>
);

/** The ecosystem: small glass chips drifting through the back layer at their own speeds (never bobbing in place). */
const CHIP_GLYPHS = ["play", "film", "spark", "comment", "heart", "tag"];
export const Chips: React.FC<{ t: number; o?: number }> = ({ t, o = 1 }) => (
  <>
    {Array.from({ length: 6 }, (_, i) => {
      const h = (n: number) => { const s = Math.sin(i * 127.1 + n * 311.7) * 43758.5453; return s - Math.floor(s); };
      const size = 56 + 28 * h(1), sp = 40 + 36 * h(2), dir = h(3) < 0.5 ? 1 : -1;
      const span = 2300, x = ((((h(4) * span + dir * sp * t) % span) + span) % span) - 190, y = 60 + 960 * ((i + 0.5) / 6) + 40 * (h(5) - 0.5) + Math.sin(t * 0.5 + i) * 14;
      const g = CHIP_GLYPHS[i % CHIP_GLYPHS.length];
      return (
        <div key={i} style={{ position: "absolute", left: 0, top: 0, width: size, height: size, transform: `translate3d(${x}px, ${y}px, 0) rotate(${(h(6) - 0.5) * 16}deg)`, borderRadius: size * 0.24,
          background: "linear-gradient(160deg, rgba(255,255,255,0.8), rgba(255,255,255,0.45))", boxShadow: "inset 0 0 0 1.5px rgba(255,255,255,0.95), 0 16px 30px -18px rgba(40,50,110,0.35)",
          display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.6 * o, filter: "blur(1.2px)" }}>
          <svg width={size * 0.46} height={size * 0.46} viewBox="0 0 24 24" fill="none" stroke="#8F96D2" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">{CHIP_PATHS[g]}</svg>
        </div>
      );
    })}
  </>
);
const CHIP_PATHS: Record<string, React.ReactNode> = {
  play: <path d="M8 5.5v13l10.5-6.5z" />, film: <><rect x="3.5" y="5.5" width="17" height="13" rx="2.5" /><path d="M3.5 9.5h17M3.5 14.5h17" /></>,
  spark: <path d="M12 3.5l1.8 6.7 6.7 1.8-6.7 1.8-1.8 6.7-1.8-6.7-6.7-1.8 6.7-1.8z" />, comment: <path d="M4.5 6.5h15v9.5H10l-4.5 3.5v-3.5h-1z" />,
  chart: <><path d="M4 20h16" /><path d="M7 16v-4M12 16V8M17 16v-7" /></>, heart: <path d="M12 20s-7.5-4.5-7.5-10A4.3 4.3 0 0 1 12 7.6 4.3 4.3 0 0 1 19.5 10c0 5.5-7.5 10-7.5 10z" />,
  rocket: <path d="M12 3c3 2 4.5 5 4.5 8.5L14 15h-4l-2.5-3.5C7.5 8 9 5 12 3z" />, tag: <><path d="M3.5 12.5V5a1.5 1.5 0 0 1 1.5-1.5h7.5l8 8a1.5 1.5 0 0 1 0 2.1l-6.4 6.4a1.5 1.5 0 0 1-2.1 0z" /><circle cx="8.3" cy="8.3" r="1.4" /></>,
};
