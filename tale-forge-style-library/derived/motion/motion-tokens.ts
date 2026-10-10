// Tale Forge motion tokens for film (Remotion 4). Every number is taken from the shipped CSS/JS of tale-forge.app
// (see analysis/09-motion-and-interaction.md for the line-level sources) and, where marked "measured", checked live.
// Drop into a Remotion project's src/ and import. Times are in seconds; use sec(s, fps) to get frames.
import { Easing, interpolate } from "remotion";

// ---------- Curves (cubic-bezier values exactly as in the CSS) ----------
export const EASE = {
  css: Easing.bezier(0.25, 0.1, 0.25, 1),       // CSS `ease`: theme crossfade, colour, border, shadow, most fades
  inOut: Easing.bezier(0.42, 0, 0.58, 1),      // `ease-in-out`: every idle loop (float, twinkle, breathe, pulse dots)
  out: Easing.bezier(0, 0, 0.58, 1),           // `ease-out`: map path draw (.9 s), rising embers tfRise (2.4 s)
  settle: Easing.bezier(0.2, 0.7, 0.3, 1),     // house arrival: .reveal (.7 s), start-screen tfStartIn (.45 s), easel scale (1.6 s)
  softSpring: Easing.bezier(0.2, 0.7, 0.3, 1.2), // objects landing: fan books .5 s, toggle thumb .5 s, cards .3-.35 s, glöd book 1.1 s (peak +4.4 %)
  spring: Easing.bezier(0.2, 0.7, 0.3, 1.4),   // press targets: .btn/.fab/.hiw-play .25 s, tfUnveilPop .42 s (peak +11.7 %, measured +11.6 %)
  quad: (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2), // glöd canvas JS easeInOutQuad (ember lift .9 s / settle 1.2 s)
};

// ---------- Durations (s) ----------
export const DUR = {
  theme: 0.5,          // --theme-transition-duration
  press: 0.25,         // .btn transform
  shadow: 0.3,         // .btn box-shadow
  trait: 0.25,         // .trait / .pick `all`
  card: 0.35,          // .book lift
  arrive: 0.45,        // start-screen tfStartIn
  reveal: 0.7,         // .reveal / reveal-line / reveal-name
  pathDraw: 0.9,       // map lit path
  pathFade: 0.25,      // map previous path fade
  mapHold: 4.5,        // map cycles to the next ending every 4.5 s
  twinkle: 4.6, float1: 7, float2: 8, floatBadge: 9, pulse: 2.4,
  glodPulse: 2.6, veilBreathe: 4.6, veilDrift: 5.4, brushBob: 2.6, emberRise: 2.4, sweep: 1.3,
};

export const sec = (s: number, fps = 30) => Math.round(s * fps);

// Keyframe yoyo exactly like the CSS loops: 0% = a, 50% = b, 100% = a, with ease-in-out applied PER SEGMENT
// (CSS applies animation-timing-function between keyframes, not over the whole cycle).
export const yoyo = (tSec: number, period: number, a: number, b: number, phase = 0) => {
  const u = (((tSec + phase) % period) + period) % period / period;
  return u < 0.5
    ? interpolate(u, [0, 0.5], [a, b], { easing: EASE.inOut })
    : interpolate(u, [0.5, 1], [b, a], { easing: EASE.inOut });
};

// ---------- Idle loops (home hero; all start together at page load, phase 0) ----------
export const heroIdle = (tSec: number) => ({
  // .fb1  float1 7 s: rotate(-8deg) translateY(0) <-> rotate(-8.6deg) translateY(-12px)   (measured p2p 11.7 px)
  fb1: { rotate: yoyo(tSec, 7, -8, -8.6), y: yoyo(tSec, 7, 0, -12) },
  // .fb2  float2 8 s: rotate(7deg) <-> rotate(7.6deg), y 0 <-> -16px                        (measured p2p 15.7 px)
  fb2: { rotate: yoyo(tSec, 8, 7, 7.6), y: yoyo(tSec, 8, 0, -16) },
  // .badge floatBadge 9 s: rotate(2.5deg) <-> rotate(3deg), y 0 <-> -7px                  (measured p2p 7.0 px)
  badge: { rotate: yoyo(tSec, 9, 2.5, 3), y: yoyo(tSec, 9, 0, -7) },
  // .starfield twinkle 4.6 s: opacity .95 <-> .55 (natt only; the morning backdrop has no stars)
  stars: yoyo(tSec, 4.6, 0.95, 0.55),
});

// .dotpulse `pulse` 2.4 s, timing `ease` per segment: ring 0 -> 12 px spread at 70 %, alpha .45 -> 0, then rests 30 %.
export const pulseRing = (tSec: number) => {
  const u = (tSec % 2.4) / 2.4;
  if (u < 0.7) {
    const k = interpolate(u, [0, 0.7], [0, 1], { easing: EASE.css });
    return { spread: 12 * k, alpha: 0.45 * (1 - k) };  // #f2b22e73 -> #f2b22e00
  }
  return { spread: interpolate(u, [0.7, 1], [12, 0], { easing: EASE.css }), alpha: 0 };
};

// ---------- One-shot moves ----------
// tfStartIn: opacity 0 -> 1, translateY 22px -> 0 (screens .45 s settle; gallery/sheets .35-.4 s `ease`; reveal line .7 s)
export const fadeUp = (frame: number, start: number, fps = 30, dur = DUR.arrive, curve = EASE.settle) => {
  const k = interpolate(frame, [start, start + sec(dur, fps)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: curve });
  return { opacity: k, y: 22 * (1 - k) };
};
// .btn-primary:hover: translateY 0 -> -3px over .25 s spring (+11.6 % overshoot to -3.35 px);
// box-shadow 0 14px 40px #f5c54247 -> 0 20px 55px #f5c5426b over .3 s `ease` (natt; morgon: 0 14px 34px #6d4fe059 -> 0 22px 48px #6d4fe073);
// the inset top highlight `inset 0 1px 0 #ffffff73` fades out on hover. :active = scale(.96) on the same spring.
export const hoverLift = (frame: number, start: number, fps = 30, lift = -3) =>
  interpolate(frame, [start, start + sec(DUR.press, fps)], [0, lift], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.spring });
// Map ending path: stroke-dashoffset 1 -> 0 (pathLength=1) over .9 s ease-out, opacity 0 -> .9 over .2 s `ease`.
export const pathDraw = (frame: number, start: number, fps = 30) => ({
  dashoffset: interpolate(frame, [start, start + sec(DUR.pathDraw, fps)], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.out }),
  opacity: interpolate(frame, [start, start + sec(0.2, fps)], [0, 0.9], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.css }),
});
// Theme switch natt <-> morgon: body colours + both backdrop layers crossfade 0.5 s `ease` (gradients snap at frame 0).
export const themeMix = (frame: number, start: number, fps = 30) =>
  interpolate(frame, [start, start + sec(DUR.theme, fps)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.css });
// tfRise ember (unveil burst): 18 embers, size 3-8 px, start x 35-65 %, drift x ±110 px, rise 120-280 px, delay 0-0.9 s,
// 2.4 s ease-out, opacity 0 -> .95 at 12 % -> 0.
export const emberRise = (tSec: number, e: { dx: number; dy: number; delay: number }) => {
  const u = Math.min(1, Math.max(0, (tSec - e.delay) / DUR.emberRise));
  const k = EASE.out(u);
  // ease-out applies per keyframe segment: opacity has keyframes at 0 %, 12 %, 100 %; transform only at 0 % and 100 %.
  const opacity = u <= 0 ? 0 : u < 0.12
    ? interpolate(u, [0, 0.12], [0, 0.95], { easing: EASE.out })
    : interpolate(u, [0.12, 1], [0.95, 0], { easing: EASE.out });
  return { x: e.dx * k, y: e.dy * k, opacity };
};
