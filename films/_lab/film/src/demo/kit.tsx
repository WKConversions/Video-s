// The realism demo: a 15 s film in the style of the Upwork ad seen on the laptop in instagram.com/p/DeQQcHvOaaH
// (photoreal devices on tactile surfaces, low-key light, the brand colour glowing from the screens and lighting the
// room, slow dollies, shallow focus, clean white UI beats, an abstract dark space with type, the logo on a gradient),
// made in Creoble's own brand (films/creoble/brand/BRANDKIT.md): background #fafaf8, ink #1a1614, sage #87a89e,
// light sage #a8c4bb, Fraunces 400 and DM Sans 400/500, the client's wordmark SVG. Free means only: Blender Cycles
// plates, Mixkit footage with tracked screens, Remotion for the UI and the 2D shots.
import React from "react";
import { continueRender, delayRender, Easing, staticFile } from "remotion";
import { loadFont } from "@remotion/fonts";

export const FPS = 60;
export const C = {
  bg: "#FAFAF8", ink: "#1A1614", sage: "#87A89E", sageLight: "#A8C4BB", sageDeep: "#495D58", sageDark: "#4A6B62",
  sageTint: "#E7EFEC", cream: "#F5F1EA", card: "#F7F4ED", line: "#E8E5DF", muted: "#6B6560", white: "#FFFFFF",
  // the dark spaces: sage shades at low lightness (the ad's dark green and navy spaces, in Creoble's hue)
  night: "#0E1312", nightSage: "#16211E", glow: "#B9D6CC",
};
export const SERIF = "Fraunces";
export const SANS = "DM Sans";

// the screen glow gradient: light sage at the top melting into sage and deep sage (the ad's green gradient screens)
export const SCREEN_GRAD = `linear-gradient(180deg, ${C.sageTint} 0%, ${C.sageLight} 48%, ${C.sage} 78%, ${C.sageDark} 100%)`;

export const OUT = Easing.bezier(0.22, 1, 0.36, 1);
export const INOUT = Easing.bezier(0.65, 0, 0.35, 1);
export const EXIT = Easing.bezier(0.55, 0, 0.75, 0.2);
export const clamp01 = (t: number) => Math.min(1, Math.max(0, t));
export const mix = (a: number, b: number, k: number) => a + (b - a) * k;
/** 0→1 over [a, a+d] seconds with an ease */
export const ramp = (t: number, a: number, d: number, e: (x: number) => number = OUT) => e(clamp01((t - a) / d));

const fontHandle = typeof window !== "undefined" ? delayRender("fonts") : null;
if (typeof window !== "undefined") {
  Promise.all([
    loadFont({ family: SANS, url: staticFile("brand/dmsans.woff2"), weight: "100 1000" }),
    loadFont({ family: SERIF, url: staticFile("brand/fraunces.woff2"), weight: "100 900", style: "normal" }),
    loadFont({ family: SERIF, url: staticFile("brand/fraunces-italic.woff2"), weight: "100 900", style: "italic" }),
  ]).then(() => fontHandle !== null && continueRender(fontHandle));
}

/** The Creoble wordmark "Creoble." (outlined Fraunces), `w` px wide: light = cream #f5f1ea, dark = ink. */
export const Wordmark: React.FC<{ w: number; dark?: boolean; style?: React.CSSProperties }> = ({ w, dark, style }) => (
  <img src={staticFile(`brand/creoble-wordmark-${dark ? "dark" : "light"}.svg`)} width={w} height={(w * 1511) / 7208}
    style={{ display: "block", ...style }} />
);

export type Pt = [number, number];
export type Quad = [Pt, Pt, Pt, Pt]; // TL, TR, BR, BL of the UI as the viewer reads it

/** CSS matrix3d that maps a w×h box (origin 0 0) onto the quad (a projective transform). */
export const quadMatrix = (w: number, h: number, q: Quad): string => {
  const [[x0, y0], [x1, y1], [x2, y2], [x3, y3]] = q;
  // unit square → quad (Heckbert)
  const dx1 = x1 - x2, dx2 = x3 - x2, dy1 = y1 - y2, dy2 = y3 - y2;
  const sx = x0 - x1 + x2 - x3, sy = y0 - y1 + y2 - y3;
  let g = 0, hh = 0;
  if (Math.abs(sx) > 1e-9 || Math.abs(sy) > 1e-9) {
    const den = dx1 * dy2 - dx2 * dy1;
    g = (sx * dy2 - dx2 * sy) / den;
    hh = (dx1 * sy - sx * dy1) / den;
  }
  const a = x1 - x0 + g * x1, b = x3 - x0 + hh * x3, c = x0;
  const d = y1 - y0 + g * y1, e = y3 - y0 + hh * y3, f = y0;
  // scale the unit square to w×h
  const A = a / w, B = b / h, D = d / w, E = e / h, G = g / w, H = hh / h;
  // column-major 4x4: [A D 0 G, B E 0 H, 0 0 1 0, c f 0 1]
  return `matrix3d(${A},${D},0,${G},${B},${E},0,${H},0,0,1,0,${c},${f},0,1)`;
};

/** Pins a w×h UI onto a screen quad given in the parent's pixel space. */
export const OnQuad: React.FC<{ w: number; h: number; q: Quad; children: React.ReactNode; style?: React.CSSProperties }> = ({ w, h, q, children, style }) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: w, height: h, transformOrigin: "0 0", transform: quadMatrix(w, h, q), overflow: "hidden", ...style }}>
    {children}
  </div>
);
