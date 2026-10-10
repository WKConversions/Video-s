// The kinetic kit for Remotion films built phrase by phrase on one continuous stage (planning/phrase-by-phrase.md).
// Copy into src/ next to timeline.ts. It needs two project files:
//   src/clock.ts  export const T = timeline(30, { hook: 0, turn: 3.4, …, end: 30, ...WORDS });   // beats + aligned words
//   src/lib.tsx   export const KIT = { font: "DM Sans", serif: "Gelasio", ink: "#0D2139", word: "#2D5F95",
//                                      mark: "#C9D7E6", under: "#2D5F95", strike: "#2D5F95" };  // the brand's roles
// Built from Karl's October 2026 films (Bruno Morgante v3, MindMirror, Amargier Advisory).
import React from "react";
import { Easing, Img, interpolate, staticFile } from "remotion";
import { T } from "./clock";
import { KIT } from "./lib";

export const ARRIVE = Easing.bezier(0.22, 1, 0.36, 1);
export const MOVE = Easing.bezier(0.65, 0, 0.35, 1);
export const DEPART = Easing.bezier(0.55, 0, 0.9, 0.4);
export const POP = Easing.bezier(0.3, 1.45, 0.6, 1);            // a small overshoot, for pops on landings only
export const LIN = (t: number) => t;
export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
/** A label plus any number of offsets, in seconds: off("w:two", -0.05, 0.1). (A label string takes one offset.) */
export const off = (pos: string, ...d: number[]) => T.s(pos) + d.reduce((a, b) => a + b, 0);

let ctx: CanvasRenderingContext2D | null = null;
/** Width of a run of type (after fonts load), so a mark, a morph or a centred line starts from the word's exact box. */
export const measure = (t: string, size: number, weight = 500, ls = -0.045, serif = false) => {
  ctx = ctx ?? document.createElement("canvas").getContext("2d")!;
  ctx.font = serif ? `italic ${weight} ${size}px ${KIT.serif}` : `${weight} ${size}px ${KIT.font}`;
  (ctx as unknown as { letterSpacing: string }).letterSpacing = `${ls * size}px`;
  return ctx.measureText(t).width;
};

/** A word of a Line: `at` is its spoken word ("w:idea"); `mark` sweeps a block behind it, `under` draws an
 *  underline, `strike` crosses it out; `serif` sets it in the brand's italic; `accent` colours it. */
export type W = { t: string; at: string; accent?: boolean; color?: string; serif?: boolean; mark?: string; under?: string; strike?: string };

/** Words that build on the voice: each rises 32% of its size out of a blur on its spoken word, and leaves
 *  (with `out`) upward into a blur, staggered; with `split` the words leave sideways, apart from the centre,
 *  into a blur (Qwilr's "It's both." exit). Words, not sentences: six or fewer to a line. */
export const Line: React.FC<{ g: number; words: W[]; x: number; y: number; size: number; weight?: number; color?: string; out?: string; outDur?: number;
  dy?: number; ls?: number; split?: boolean; style?: React.CSSProperties }> = ({ g, words, x, y, size, weight = 500, color = KIT.ink, out, outDur = 0.3, dy = 0.32, ls = -0.045, split = false, style }) => (
  <div style={{ position: "absolute", left: x, top: y, display: "flex", gap: size * 0.26, whiteSpace: "nowrap", fontFamily: KIT.font, fontWeight: weight, fontSize: size,
    lineHeight: 1, letterSpacing: `${ls}em`, ...style }}>
    {words.map((w, i) => {
      const k = T.k(g, w.at, 0.42);
      const o = out ? T.k(g, off(out, i * 0.035), outDur, DEPART) : 0;
      const m = w.mark ? T.k(g, w.mark, 0.32, MOVE) : 0;
      return (
        <span key={i} style={{ position: "relative", isolation: "isolate", display: "inline-block", opacity: Math.min(1, k * 1.7) * (1 - o),
          ...(w.serif ? { fontFamily: KIT.serif, fontStyle: "italic", fontWeight: 400, letterSpacing: "-0.02em" } : {}),
          transform: split ? `translate(${(i - (words.length - 1) / 2) * o * size * 0.9}px, ${(1 - k) * dy * size}px)` : `translateY(${((1 - k) * dy - o * 0.3) * size}px)`, filter: k < 1 || o > 0 ? `blur(${(1 - k) * 9 + o * 9}px)` : undefined,
          color: w.color ?? (w.accent ? KIT.word : color) }}>
          {w.mark && <span style={{ position: "absolute", zIndex: -1, left: -size * 0.1, right: -size * 0.1, top: size * 0.06, bottom: -size * 0.1, borderRadius: size * 0.08,
            background: KIT.mark, transformOrigin: "0 50%", transform: `scaleX(${m})` }} />}
          {w.t}
          {w.under && <span style={{ position: "absolute", left: 0, right: 0, bottom: -size * 0.06, height: Math.max(4, size * 0.045), borderRadius: 9, background: KIT.under,
            transformOrigin: "0 50%", transform: `scaleX(${T.k(g, w.under, 0.45, MOVE)})` }} />}
          {w.strike && <span style={{ position: "absolute", left: -size * 0.04, right: -size * 0.04, top: "54%", height: Math.max(6, size * 0.075), borderRadius: 9,
            background: KIT.strike, transformOrigin: "0 50%", transform: `scaleX(${T.k(g, w.strike, 0.28, MOVE)}) rotate(-2deg)` }} />}
        </span>
      );
    })}
  </div>
);
/** The x that centres a Line on cx. */
export const centred = (words: W[], size: number, cx = 960, weight = 500) =>
  cx - (words.reduce((a, w) => a + measure(w.t, size, w.serif ? 400 : weight, w.serif ? -0.02 : -0.045, !!w.serif), 0) + 0.26 * size * (words.length - 1)) / 2;

/** One slot, two contents: the first rolls up out of a mask as the second rolls in ("hard lessons" into "stories",
 *  "Idea" into "Result"). Slots are position: relative, so a Line inside sits at its own x/y. */
export const Roll: React.FC<{ g: number; a: React.ReactNode; b: React.ReactNode; at: string; dur?: number; h: number; style?: React.CSSProperties }> = ({ g, a, b, at, dur = 0.45, h, style }) => {
  const k = T.k(g, at, dur, MOVE);
  return (
    <div style={{ position: "relative", height: h, overflow: "hidden", ...style }}>
      <div style={{ transform: `translateY(${-k * h}px)`, filter: k > 0 && k < 1 ? `blur(${Math.sin(k * Math.PI) * 5}px)` : undefined }}>
        <div style={{ position: "relative", height: h, display: "flex", alignItems: "center" }}>{a}</div>
        <div style={{ position: "relative", height: h, display: "flex", alignItems: "center" }}>{b}</div>
      </div>
    </div>
  );
};

/** An odometer digit: v counts continuously (0 → 2 rolls through 1); a soft mask at top and bottom. */
export const Digit: React.FC<{ v: number; size: number; width?: number }> = ({ v, size, width = 0.62 }) => (
  <div style={{ width: size * width, height: size, overflow: "hidden", position: "relative", WebkitMaskImage: "linear-gradient(180deg, transparent 0%, #000 14%, #000 86%, transparent 100%)" }}>
    <div style={{ position: "absolute", left: 0, top: -v * size }}>{Array.from({ length: 21 }, (_, i) => <div key={i} style={{ height: size, lineHeight: `${size}px`, textAlign: "center" }}>{i % 10}</div>)}</div>
  </div>
);

/** A photo in a circle, cropped by object-position and zoom. */
export const Disc: React.FC<{ src: string; x: number; y: number; r: number; pos?: string; zoom?: number; ring?: number; ringColor?: string; style?: React.CSSProperties; children?: React.ReactNode }> = ({
  src, x, y, r, pos = "50% 30%", zoom = 1, ring = 0, ringColor = "#fff", style, children }) => (
  <div style={{ position: "absolute", left: x - r, top: y - r, width: 2 * r, height: 2 * r, borderRadius: "50%", overflow: "hidden",
    boxShadow: ring ? `0 0 0 ${ring}px ${ringColor}, 0 40px 80px -30px rgba(0,0,0,.4)` : undefined, ...style }}>
    <Img src={staticFile(`img/${src}`)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: pos, transform: `scale(${zoom})`, transformOrigin: pos }} />
    {children}
  </div>
);

/** A colour field (or a whole scene) growing as a circle out of an object at (x, y): the transition is itself a move.
 *  It bleeds 300 px past the frame so the camera can breathe out without an edge; children use frame coordinates.
 *  Use a flat colour: a large gradient bands into rings under a camera push. */
export const Iris: React.FC<{ x: number; y: number; r: number; bg?: string; children?: React.ReactNode }> = ({ x, y, r, bg, children }) =>
  r <= 0 ? null : (
    <div style={{ position: "absolute", left: -300, top: -300, width: 2520, height: 1680, background: bg, clipPath: r > 2200 ? undefined : `circle(${r}px at ${x + 300}px ${y + 300}px)` }}>
      <div style={{ position: "absolute", left: 300, top: 300, width: 1920, height: 1080 }}>{children}</div>
    </div>
  );

/** Values keyed on labels, for an object that persists across beats: track(g, [["hook", x, y, s, o], ["turn+0.6", x2, y2, s2, o2, MOVE], …]).
 *  A trailing function eases the segment arriving at that key; without one it is linear (a drift). */
export type Track = [string, ...(number | ((t: number) => number))[]];
export const track = (g: number, keys: Track[]) => {
  let i = 0;
  while (i < keys.length - 1 && g >= T.f(keys[i + 1][0])) i++;
  const a = keys[i], b = keys[Math.min(i + 1, keys.length - 1)];
  const fa = T.f(a[0]), fb = T.f(b[0]);
  const ease = (typeof b[b.length - 1] === "function" ? b[b.length - 1] : LIN) as (t: number) => number;
  const t = fb > fa ? ease(Math.min(1, Math.max(0, (g - fa) / (fb - fa)))) : 1;
  const va = a.slice(1).filter((v) => typeof v === "number") as number[], vb = b.slice(1).filter((v) => typeof v === "number") as number[];
  return va.map((v, j) => lerp(v, vb[j], t));
};

/** The camera Karl approved (K.B, October 2026, "great"): one slow breath for the whole film, a drift that eases
 *  out over a second before the sign-off (`rest`, a label), then one slow straight push to the end. It never pans
 *  or zooms on a transition: those read as spikes (motion/camera.md). Apply to the one camera AbsoluteFill:
 *  transform `translate(${x}px, ${y}px) scale(${s}) perspective(4000px) rotateX(0.01deg)` (the 3D term stops text
 *  snapping to whole pixels under the drift). */
export const breathe = (g: number, rest?: string, push = 0.04) => {
  const sm = (t: number) => { const c = Math.min(1, Math.max(0, t)); return c * c * (3 - 2 * c); };
  const r = rest ? sm((g - T.f(rest) + 27) / 45) : 0;                     // the drift settles over 1.5 s
  const p = rest ? Math.max(0, g - T.f(rest)) / Math.max(1, T.f("end") - T.f(rest)) : 0;
  const b = 1.02 + Math.sin(g / 100) * 0.018;
  // it settles on the breath's mean scale, so the push starts from where the breath is, without a zoom
  return { s: lerp(b, 1.02 + p * push, r), x: Math.sin(g / 80) * 20 * (1 - r), y: Math.cos(g / 110) * 11 * (1 - r) };
};

/** Older keyed camera, for a film whose brief is energetic: keys are pushes and releases, so keep them slow, give
 *  every segment an ease, and run scripts/motion_probe.py --style energetic on the build.
 *  The camera breathes: a slow linear push through each beat, released with MOVE on each transition.
 *  Keys are [label, scale, x, y, ease?]; at(px, py, s) aims the push at a point of the frame. Apply to one
 *  AbsoluteFill: transform `translate(${x}px, ${y}px) scale(${s})`, transformOrigin 50% 50%, willChange transform. */
export type Key = [string, number, number, number, ((t: number) => number)?];
export const at = (px: number, py: number, s: number): [number, number, number] => [s, (960 - px) * s, (540 - py) * s];
export const camera = (g: number, keys: Key[]) => {
  const [s, x, y] = track(g, keys as unknown as Track[]);
  return { s, x, y };
};

/** Clamped interpolation on frames, for anything not keyed on a label. */
export const tw = (g: number, a: number, b: number, from = 0, to = 1, ease = ARRIVE) =>
  interpolate(g, [a, b], [from, to], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });

// ---- from Karl's reference films (references/technique-catalogue.md) ----

/** Typed text with a caret, the way a prompt or a search box fills: `cps` characters a second from `at`.
 *  Each character fades in over two frames instead of popping; the caret blinks once it stops. Put an inline
 *  icon or product image in the text as a React node with `slots` ({ "(1)": <Img …/> }), as SKUVE does. */
export const Typed: React.FC<{ g: number; text: string; at: string | number; cps?: number; caret?: boolean; color?: string; slots?: Record<string, React.ReactNode>; style?: React.CSSProperties }> = ({
  g, text, at, cps = 18, caret = true, color, slots = {}, style }) => {
  const t0 = typeof at === "number" ? at : T.s(at), t = g / 30 - t0;
  const parts = text.split(/(\(\d+\))/).filter(Boolean);
  let n = 0;
  const shown = Math.max(0, t * cps);
  const done = shown >= text.length;
  return (
    <span style={{ whiteSpace: "pre", color, ...style }}>
      {parts.map((p, j) => {
        if (slots[p] !== undefined) { const v = Math.min(1, Math.max(0, shown - n)); n += 1; return <span key={j} style={{ display: "inline-block", transform: `scale(${v})`, opacity: v }}>{slots[p]}</span>; }
        return [...p].map((c, i) => { const v = Math.min(1, Math.max(0, (shown - n - i) * 1.5)); if (i === p.length - 1) n += p.length; return v > 0 && <span key={j + "-" + i} style={{ opacity: v }}>{c}</span>; });
      })}
      {caret && t > 0 && (!done || Math.floor(t * 2) % 2 === 0) && <span style={{ display: "inline-block", width: "0.06em", height: "1em", marginLeft: "0.04em", verticalAlign: "-0.12em", background: "currentColor" }} />}
    </span>
  );
};

/** A choice that rolls through a pill like a dial: a vertical list scrolls from `from` to `to` (indices) and
 *  stops on the answer, the neighbours fading above and below (Kaelio's "Set it up under [15 mins]"). */
export const Selector: React.FC<{ g: number; items: string[]; from?: number; to: number; at: string; dur?: number; size: number; weight?: number; pill?: string; color?: string; style?: React.CSSProperties }> = ({
  g, items, from = 0, to, at, dur = 0.7, size, weight = 700, pill = KIT.word, color = KIT.ink, style }) => {
  const v = lerp(from, to, T.k(g, at, dur, MOVE)), h = size * 1.25;
  return (
    <span style={{ position: "relative", display: "inline-block", height: h, minWidth: measure(items[to], size, weight, 0) + size * 0.8, fontWeight: weight, verticalAlign: "middle", ...style }}>
      <span style={{ position: "absolute", inset: 0, borderRadius: 999, border: `${Math.max(2, size * 0.05)}px solid ${pill}` }} />
      {items.map((it, i) => { const d = i - v; return Math.abs(d) < 2.6 && (
        <span key={i} style={{ position: "absolute", left: 0, right: 0, top: 0, height: h, lineHeight: `${h}px`, textAlign: "center", fontSize: size, color,
          transform: `translateY(${d * h}px) scale(${1 - Math.min(1, Math.abs(d)) * 0.15})`, opacity: Math.max(0, 1 - Math.abs(d) * 0.7), whiteSpace: "nowrap" }}>{it}</span>); })}
    </span>
  );
};

/** A line, arrow or logo stroke that draws itself on: an SVG path (in the box's own coordinates) revealed from
 *  0 to 1 by `k`; `dash` makes it a dotted path that still draws on (pretaa's dashed route that bends up into
 *  growth, Vela's V written as one stroke). */
export const Stroke: React.FC<{ d: string; k: number; w: number; h: number; width?: number; color?: string; dash?: number; style?: React.CSSProperties }> = ({ d, k, w, h, width = 6, color = KIT.ink, dash, style }) =>
  k <= 0 ? null : (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ position: "absolute", overflow: "visible", ...style }}>
      {dash ? <>
        <defs><mask id={`m${d.length}${w}`}><path d={d} pathLength={1} fill="none" stroke="#fff" strokeWidth={width * 3} strokeDasharray={`${k} 1`} /></mask></defs>
        <path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeDasharray={`0 ${dash}`} mask={`url(#m${d.length}${w})`} />
      </> : <path d={d} pathLength={1} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={`${k} 1`} />}
    </svg>
  );

/** A soft colour bloom: a blurred disc of the brand's colour that drifts behind an object or in a corner, so a
 *  white page is never flat (OSK Manager's corner glows, Qwilr's bloom behind the AI circle). Keep it moving and
 *  not too large: a still, frame-filling gradient bands. */
export const Bloom: React.FC<{ g: number; x: number; y: number; r: number; color: string; k?: number; drift?: number; style?: React.CSSProperties }> = ({ g, x, y, r, color, k = 1, drift = 40, style }) =>
  k <= 0 ? null : (
    <div style={{ position: "absolute", left: 0, top: 0, width: 2 * r, height: 2 * r, borderRadius: "50%", background: color, filter: `blur(${r * 0.45}px)`, opacity: 0.55 * k,
      transform: `translate(${x - r + Math.sin(g / 70) * drift}px, ${y - r + Math.cos(g / 90) * drift}px) scale(${0.6 + 0.4 * k})`, willChange: "transform", ...style }} />
  );

/** Something becomes something else by a sideways flip: `a` turns edge-on and `b` turns out of the edge (Dripc's
 *  money bag into a coin, pretaa's coin into the stroke of its logo). k runs 0 → 1; the swap is at 0.5. */
export const Flip: React.FC<{ k: number; a: React.ReactNode; b: React.ReactNode; style?: React.CSSProperties }> = ({ k, a, b, style }) => (
  <div style={{ position: "relative", transform: `scaleX(${Math.max(0.02, Math.abs(Math.cos(k * Math.PI)))})`, ...style }}>{k < 0.5 ? a : b}</div>
);

// ---- the speed graphs Karl approved (motion/speed-graphs.md; codes A1–A7 from his Training.aep, B1–B17 new) ----

/** Named curves; each comment gives the card it comes from. Pick by the moment, not by habit. */
export const EASE = {
  whipIn: Easing.bezier(0.9, 0, 1, 1),            // A1/A2: into a cut, speeding up (AE influence 90% → 0.1%)
  whipOut: Easing.bezier(0, 0, 0.1, 1),           // A1/A2: out of a cut, slowing down; A6 type-on (0.1% → 90%)
  word: Easing.bezier(0.15, 0.45, 0.12, 1),       // A5: each word of a cascade, fast start, soft landing
  easy: Easing.bezier(0.33, 0, 0.67, 1),          // B1: the neutral move of something already on screen
  longS: Easing.bezier(0.8, 0, 0.2, 1),           // B2: a big, deliberate move (a pin from city to city)
  soft: Easing.bezier(0.4, 0, 0.15, 1),           // B3: leaves rest without a jolt, long settle
  back: Easing.bezier(0.34, 1.56, 0.64, 1),       // B5: one ≈10% overshoot; energetic films, small things only
  windup: Easing.bezier(0.4, 0, 0.6, 1),          // B6: the pull-back of an anticipation
  launch: Easing.bezier(0.25, 0, 0.1, 1),         // B6: the go after the pull-back
  impact: Easing.bezier(0.6, 0, 0.85, 0.55),      // B7: speeds up into contact and stops on it
  lead: Easing.bezier(0.16, 1, 0.3, 1),           // B9 leader, B13 each step
  follow: Easing.bezier(0.22, 1, 0.36, 1),        // B9 followers (= ARRIVE), 2–4 f behind the leader
  steady: Easing.bezier(0.25, 0.08, 0.75, 0.92),  // B11: linear with soft ends (progress, a route drawing)
  sweep: Easing.bezier(0.65, 0, 0.35, 1),         // B17: each pass of a sweep (= MOVE)
};

const cl = (t: number) => Math.min(1, Math.max(0, t));

/** A1/A2 whip through a cut: before `cut` (a frame) the outgoing thing runs side 0 with EASE.whipIn over `n` frames,
 *  from the cut the incoming thing runs side 1 with EASE.whipOut. k is each side's progress 0 → 1; the speed peaks
 *  on the cut and matches on both sides, so swap the shape (or the scene) exactly there. Blur the 4 fastest frames. */
export const whip = (g: number, cut: number, n = 10) =>
  g < cut ? { side: 0 as const, k: EASE.whipIn(cl((g - cut + n) / n)) } : { side: 1 as const, k: EASE.whipOut(cl((g - cut) / n)) };

/** Karl's Elastic Controller (A3, A7), as in his file (amplitude 20, frequency 40, decay 60): after a key the move
 *  carries on as a decaying sine sized by the speed it arrived with. v: units a second just before the key;
 *  t: seconds since the key. Returns the offset to add. Playful and energetic films only. */
export const aeElastic = (v: number, t: number, amp = 20, freq = 40, decay = 60) =>
  t <= 0 ? 0 : (v * (amp / 200) * Math.sin((freq / 30) * t * 2 * Math.PI)) / Math.exp((decay / 10) * t);

/** A3 pop: linear from `from` to `to` over `n` frames (g = frames since the start), then the elastic settle. */
export const popElastic = (g: number, n: number, from: number, to: number, fps = 30) =>
  g <= n ? lerp(from, to, cl(g / n)) : to + aeElastic(((to - from) * fps) / n, (g - n) / fps);

/** B8 gravity drop: u 0 → 1 gives 0 (top) → 1 (floor) with `n` bounces, each `e` the height of the one before. */
export const bounce = (u: number, e = 0.35, n = 2) => {
  let tot = 1, h = 1;
  for (let i = 0; i < n; i++) { h *= e; tot += 2 * Math.sqrt(h); }
  let t = cl(u) * tot;
  if (t <= 1) return t * t;
  t -= 1; h = 1;
  for (let i = 0; i < n; i++) {
    h *= e; const half = Math.sqrt(h);
    if (t <= 2 * half) { const x = (t - half) / half; return 1 - h * (1 - x * x); }
    t -= 2 * half;
  }
  return 1;
};

/** B12 fast–slow–fast: progress 0 → 1 that enters fast, drifts through the middle (readable), and speeds out.
 *  ratio: how much faster the ends are than the middle; tau: how long the fast ends last (share of the time). */
export const speedRamp = (u: number, ratio = 16, tau = 0.06) => {
  const P = (s: number) => s + ratio * tau * (1 - Math.exp(-s / tau) + Math.exp(-(1 - s) / tau) - Math.exp(-1 / tau));
  return P(cl(u)) / P(1);
};

/** B13 step, hold, step: how many steps are done at frame g (fractional while moving). starts: the frame of each
 *  step (put them on beats or stressed words); n: frames per step. */
export const stepper = (g: number, starts: number[], n = 7) => starts.reduce((v, a) => v + EASE.lead(cl((g - a) / n)), 0);

/** B14 finger flick: a push that builds to full speed over `push` (share of the time), then an exponential coast.
 *  The speed never jumps at the join. For real interface scrolls and swipes. */
export const flick = (u: number, push = 0.08, k = 7.7) => {
  const K = k / ((1 - Math.exp(-k)) * (1 - push)), share = (push * K) / 2 / (1 + (push * K) / 2), s = cl(u);
  if (s < push) return share * (s / push) ** 2;
  return share + ((1 - share) * (1 - Math.exp((-k * (s - push)) / (1 - push)))) / (1 - Math.exp(-k));
};

/** B16 zoom-through: the element scales up into the cut (side 0, 1 → z) and the next scene keeps growing as it slows
 *  (side 1, 1/z → 1). Exponential scale keeps the zoom speed even. The element zooms; the camera stays calm. */
export const zoomThrough = (g: number, cut: number, n = 10, z = 4) =>
  g < cut
    ? { side: 0 as const, s: Math.exp(Math.log(z) * EASE.whipIn(cl((g - cut + n) / n))) }
    : { side: 1 as const, s: Math.exp(Math.log(z) * EASE.whipOut(cl((g - cut) / n))) / z };
