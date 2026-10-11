// The camera never sways and never zooms out on a subject that is still being looked at. Each shot has one push in
// on what the line is about, at a constant speed (a short ramp in and out, at most about 5 %/s, the K.B limit); the
// push is let go only while the whole frame changes anyway (a colour field growing, a whip), or eased a little when
// the subject itself changes. T(x) = s·x + (1 − s)·o: the scale s and its centre o are both eased, so nothing jumps.
import React from "react";
import { AbsoluteFill } from "remotion";
import { track } from "./kinetic";
import { MOVE, RAMP } from "./lib";
import { Scenes } from "./Scenes";

const R = RAMP(0.2);
const CAM = (g: number) => track(g, [
  // 1 the hook: from close on the practice back to the whole problem, anchored on the words (they never leave the frame)
  ["open", 1.1, 130, 450], ["turn", 1, 130, 450, R],
  // 2 the turn: in on the receptionist as she appears
  ["turn+0.3", 1, 1380, 520, MOVE], ["talk+0.15", 1.098, 1380, 520, R],
  // 3 eased a little as the words take the left; then in on the words and on through the night to the call at 03:20
  ["words3+0.25", 1, 900, 520, MOVE], ["h247-0.3", 1.098, 560, 470, R], ["white", 1.17, 500, 650, R],
  // 4 let go under the white field; in on the conversation; on to the appointment as it lands
  ["white+0.55", 1, 960, 450, MOVE], ["agenda", 1.055, 960, 450, R], ["agenda+0.5", 1.03, 900, 700, MOVE], ["whip1", 1.11, 900, 700, R],
  // 5 let go in the whip; in on the phone; 6 eased as the phone goes and the practice opens up; in on the practice
  ["whip1+0.6", 1, 1100, 560, MOVE], ["open6", 1.098, 1100, 560, R], ["open6+0.8", 1, 900, 520, MOVE], ["teal", 1.079, 900, 520, R],
  // 7 let go under the teal field; in on the words
  ["teal+0.55", 1, 1000, 520, MOVE], ["cream", 1.13, 1000, 520, R],
  // 8 let go under the cream field; in on the five calls; the customer's phone
  ["cream+0.55", 1, 1020, 536, MOVE], ["photo", 1.061, 1020, 536, R], ["photo+0.65", 1, 960, 540, MOVE], ["whip2", 1.024, 960, 540, R],
  // 9 let go in the whip; in on the week as it fills; 10 one slow push to the end
  ["whip2+0.55", 1, 960, 560, MOVE], ["cta", 1.079, 960, 560, R], ["end", 1.122, 960, 600, R],
]);

export const Story: React.FC<{ g: number }> = ({ g }) => {
  const [s, ox, oy] = CAM(g);
  return (
    <AbsoluteFill style={{ transform: `translate(${(1 - s) * ox}px, ${(1 - s) * oy}px) scale(${s}) perspective(4000px) rotateX(0.01deg)`, transformOrigin: "0 0" }}>
      <Scenes g={g} />
    </AbsoluteFill>
  );
};
