// A film's timing as labels and relative placements, the way a GSAP timeline is written, so that
// retiming the film to a recorded voice-over means moving the labels, not hunting frame numbers.
// Copy into src/ of a Remotion project.
//
//   const T = timeline(30, {                 // fps, then labels in seconds (or "label+0.4")
//     hook: 0, problem: 3.6, turn: 8.4, consulting: 12.4, cta: 42.8, end: 48.5,
//   });
//   T.f("problem")          -> 108             frames of a label
//   T.f("problem+0.5")      -> 123             half a second after it
//   T.f("turn-0.2")         -> 246             just before it (an outgoing change that leads in)
//   T.span("turn")          -> [252, 372]       a beat's start and the next label
//   T.k(g, "turn", 0.8)     -> 0..1            progress of a 0.8 s move starting at the label, eased
//   T.k(g, "turn+0.3", 0.5, MOVE)
//   T.at(g, "consulting")   -> local frame inside the beat
//
// Words from a force-aligned voice-over (planning/voice-over.md) become labels too:
//   const T = timeline(30, { ...beats, ...words });  words = { "w:results": 11.62, ... }
// so "the statuses flip on 'results'" is written T.k(g, "w:results", 0.4).
import { Easing, interpolate } from "remotion";

type Labels = Record<string, number | string>;

export const timeline = (fps: number, labels: Labels) => {
  const sec: Record<string, number> = {};
  const parse = (pos: string | number): number => {
    if (typeof pos === "number") return pos;
    const m = pos.match(/^([^+-]+?)\s*([+-]\s*[\d.]+)?$/);
    if (!m) throw new Error(`timeline: cannot read position "${pos}"`);
    const base = m[1].trim();
    if (!(base in sec)) {
      if (!(base in labels)) throw new Error(`timeline: no label "${base}"`);
      sec[base] = parse(labels[base]);
    }
    return sec[base] + (m[2] ? parseFloat(m[2].replace(/\s/g, "")) : 0);
  };
  for (const k of Object.keys(labels)) sec[k] = parse(labels[k]);
  const order = Object.keys(sec).filter((k) => !k.startsWith("w:")).sort((a, b) => sec[a] - sec[b]);
  const f = (pos: string | number) => Math.round(parse(pos) * fps);
  return {
    f,
    s: parse,
    span: (label: string): [number, number] => {
      const i = order.indexOf(label);
      return [f(label), i >= 0 && i + 1 < order.length ? f(order[i + 1]) : f(label)];
    },
    at: (g: number, label: string) => g - f(label),
    k: (g: number, pos: string | number, seconds: number, ease = Easing.bezier(0.22, 1, 0.36, 1)) =>
      interpolate(g, [f(pos), f(pos) + Math.max(1, Math.round(seconds * fps))], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease }),
    labels: () => ({ ...sec }),
  };
};
