// Recruiting Rewards design tokens, measured from recruitingrewards.com (computed CSS, 15 Oct 2026) and the product
// demo films. Motion: confident and clean. A fast start and a long soft settle for arrivals, a soft in-out for light
// and camera, a symmetric move for things travelling across the frame.
import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

export const C = {
  page: "#F8F6F5", panel: "#F3F0EC", card: "#FFFFFF", line: "#E2DFD9", lineSoft: "#ECE9E4",
  ink: "#1C1917", ink2: "#44403C", muted: "#777069", faint: "#A8A29E",
  green: "#287E61", greenDeep: "#1F6650", greenSoft: "#E3F1EA", greenMint: "#D7EFE3", greenLine: "#BFE0CF",
  amber: "#E0A458", amberSoft: "#FBF0E1", navy: "#0B1F3A", navy2: "#132B4D", red: "#C2410C",
  white: "#FFFFFF",
};
export const F = { display: "Lora, Georgia, serif", ui: "Manrope, system-ui, sans-serif" };

export const fontsReady = Promise.all([
  loadFont({ family: "Lora", url: staticFile("fonts/Lora-latin.woff2"), weight: "400 700" }),
  loadFont({ family: "Lora", url: staticFile("fonts/Lora-latin-ext.woff2"), weight: "400 700" }),
  loadFont({ family: "Manrope", url: staticFile("fonts/Manrope-latin.woff2"), weight: "200 800" }),
  loadFont({ family: "Manrope", url: staticFile("fonts/Manrope-latin-ext.woff2"), weight: "200 800" }),
]);

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const bez = (x1: number, y1: number, x2: number, y2: number) => (t: number) => {
  let u = t;
  for (let i = 0; i < 7; i++) {
    const x = 3 * (1 - u) * (1 - u) * u * x1 + 3 * (1 - u) * u * u * x2 + u * u * u - t;
    const dx = 3 * (1 - u) * (1 - u) * x1 + 6 * (1 - u) * u * (x2 - x1) + 3 * u * u * (1 - x2);
    if (Math.abs(dx) < 1e-6) break;
    u = clamp01(u - x / dx);
  }
  return 3 * (1 - u) * (1 - u) * u * y1 + 3 * (1 - u) * u * u * y2 + u * u * u;
};
export const SETTLE = bez(0.22, 1, 0.36, 1);
export const SOFT = bez(0.45, 0, 0.55, 1);
export const MOVE = bez(0.65, 0, 0.35, 1);
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
/** eased 0..1 between frames a and b */
export const tw = (g: number, a: number, b: number, e = SETTLE) => e(clamp01((g - a) / Math.max(1, b - a)));
export const FPS = 30;
export const SHADOW = {
  card: "0 1px 2px rgba(28,25,23,0.04), 0 12px 32px -12px rgba(28,25,23,0.16)",
  lift: "0 2px 4px rgba(28,25,23,0.05), 0 28px 60px -20px rgba(28,25,23,0.28)",
  window: "0 2px 6px rgba(28,25,23,0.05), 0 40px 90px -30px rgba(28,25,23,0.32)",
};
