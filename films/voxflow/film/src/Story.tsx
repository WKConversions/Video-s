// The camera: it never sways sideways. It is always on a motivated move: it pulls back to reveal the problem, pushes
// in on whatever the line is about (the receptionist, the words, the ringing call, the appointment, the practice in
// focus), and lets each push go while a colour field or a whip changes the whole frame, so no release is ever seen.
// T(x) = s·x + (1 − s)·o: the scale s and its centre o are both eased, so the picture never jumps.
import React from "react";
import { AbsoluteFill } from "remotion";
import { track } from "./kinetic";
import { MOVE } from "./lib";
import { Scenes } from "./Scenes";

const L = (t: number) => t;
// Pushes run at a constant speed (about 4–5 %/s, under the 5.3 %/s K.B limit) so the frame is never still;
// each one lets go (eased) while the whole frame is changing anyway: a field growing, a whip, a glide.
// Each push also arcs a little around its subject (rotateY in degrees, one direction per shot, never back and forth):
// the subject stays put and the plane turns slowly towards it, like a dolly on a curved track.
const CAM = (g: number) => track(g, [
  // 1 the hook: from close on the busy practice, back to see the missed calls pile up
  ["open", 1.135, 1370, 420], ["turn", 1, 1370, 420, L],
  // 2 the turn: in on the receptionist as she appears
  ["flip-0.2", 1, 1370, 420, MOVE], ["glide", 1.122, 1380, 560, L],
  // 3 she glides left (the push follows her); in on the words; let go as night falls; in on the call that comes at 03:20
  ["glide+0.8", 1.122, 960, 560, MOVE], ["h247-0.15", 1.16, 1250, 470, L], ["night+0.55", 1, 1250, 470, MOVE],
  ["white", 1.081, 520, 800, L],
  // 4 the conversation (in on the answer); the agenda: in on the appointment as it lands
  ["white+0.55", 1, 960, 480, MOVE], ["agenda", 1.054, 960, 480, L], ["agenda+0.6", 1, 1176, 681, MOVE],
  ["whip1", 1.081, 1176, 681, L],
  // 5 the phone and the practice; 6 in on the practice when the phone has gone
  ["whip1+0.5", 1, 1400, 560, MOVE], ["w:en2", 1.095, 1400, 560, L], ["w:en2+0.7", 1, 900, 520, MOVE],
  ["teal", 1.088, 900, 520, L],
  // 7 in on the words
  ["teal+0.6", 1, 760, 470, MOVE], ["cream", 1.175, 760, 470, L],
  // 8 the five calls, then the customer's phone
  ["cream+0.6", 1, 1020, 536, MOVE], ["photo", 1.061, 1020, 536, L], ["photo+0.6", 1, 960, 540, MOVE],
  ["whip2", 1.016, 960, 540, L],
  // 9 the week fills; 10 the sign-off, one slow push (no arc)
  ["whip2+0.5", 1, 960, 560, MOVE], ["cta", 1.101, 960, 560, L], ["cta+0.8", 1, 960, 600, MOVE], ["end", 1.047, 960, 600, L],
]);

export const Story: React.FC<{ g: number }> = ({ g }) => {
  const [s, ox, oy] = CAM(g);
  return (
    <AbsoluteFill style={{ transform: `translate(${(1 - s) * ox}px, ${(1 - s) * oy}px) scale(${s}) perspective(4000px) rotateX(0.01deg)`, transformOrigin: "0 0" }}>
      <Scenes g={g} />
    </AbsoluteFill>
  );
};
