// The on-screen words: the key phrase of each line, built word by word on the spoken words (blur-rise), bottom left,
// in the site's headline face (Inter Tight 800, −0.05em); good things in the accent blue; lists roll through one slot.
// A line leaves as one block before the next arrives.
import React from "react";
import { T } from "./clock";
import { C, F } from "./lib";
import { DEPART, Line, MOVE, W } from "./kinetic";

const X = 110, Y1 = 846, Y2 = 926, SIZE = 64, LS = -0.05;
const GLOW = "0 0 14px #F7F7F8, 0 0 4px #F7F7F8";
const typo: React.CSSProperties = { fontFamily: F.display, fontWeight: 800, fontSize: SIZE, letterSpacing: `${LS}em`, lineHeight: 1, whiteSpace: "nowrap", color: C.ink, textShadow: GLOW };

/** One line whose content steps: the old line rolls up and out as the new one rolls in from below. */
const Slot: React.FC<{ g: number; lines: React.ReactNode[]; steps: string[]; y: number; h?: number }> = ({ g, lines, steps, y, h = 80 }) => {
  const v = steps.reduce((a, l) => a + T.k(g, l, 0.4, MOVE), 0);
  return (
    <div style={{ position: "absolute", left: X - 20, top: y - 12, height: h + 24, width: 1500, overflow: "hidden" }}>
      {lines.map((ln, i) => {
        const d = i - v;
        if (Math.abs(d) > 1) return null;
        return <div key={i} style={{ position: "absolute", left: 20, top: 12 + d * h, opacity: 1 - Math.abs(d) * 0.85, filter: Math.abs(d) > 0.02 && Math.abs(d) < 0.98 ? `blur(${Math.sin(Math.abs(d) * Math.PI) * 6}px)` : undefined }}>{ln}</div>;
      })}
    </div>
  );
};
const A: React.FC<{ children: React.ReactNode; under?: number; strike?: number; color?: string }> = ({ children, under = 0, strike = 0, color = C.blue }) => (
  <span style={{ position: "relative", color }}>
    {children}
    {under > 0 && <span style={{ position: "absolute", left: 0, right: 0, bottom: -5, height: 6, borderRadius: 6, background: C.blue, transformOrigin: "0 50%", transform: `scaleX(${under})` }} />}
    {strike > 0 && <span style={{ position: "absolute", left: -4, right: -4, top: "54%", height: 6, borderRadius: 6, background: C.blue, transformOrigin: "0 50%", transform: `scaleX(${strike}) rotate(-2deg)` }} />}
  </span>
);

export const Captions: React.FC<{ g: number }> = ({ g }) => {
  const t = g / 30;
  const els: React.ReactNode[] = [];
  const line = (key: string, words: W[], y: number, out: string) => {
    if (t < T.s(words[0].at) - 0.05 || t > T.s(out) + 0.3) return;
    els.push(<Line key={key} g={g} words={words} x={X} y={y} size={SIZE} weight={800} ls={LS} color={C.ink} out={out} outDur={0.2} style={{ textShadow: GLOW }} />);
  };
  const slot = (key: string, first: string, out: string, y: number, steps: string[], lines: React.ReactNode[]) => {
    if (t < T.s(first) - 0.1 || t > T.s(out) + 0.3) return;
    const o = 1 - T.k(g, out, 0.2, DEPART);
    els.push(<div key={key} style={{ opacity: o, transform: `translateY(${-(1 - o) * 20}px)`, filter: o < 1 ? `blur(${(1 - o) * 8}px)` : undefined }}><Slot g={g} y={y} steps={steps} lines={lines} /></div>);
  };
  const first = (words: W[]) => <span style={{ ...typo, position: "relative", display: "block", height: SIZE, width: 1400 }}><Line g={g} words={words} x={0} y={0} size={SIZE} weight={800} ls={LS} color={C.ink} style={{ textShadow: GLOW }} /></span>;
  const k = (pos: string, d = 0.4) => T.k(g, pos, d);
  // P1–P2
  line("1a", [{ t: "You", at: "w:you" }, { t: "don't", at: "w:dont" }, { t: "have", at: "w:have" }, { t: "what", at: "w:what" }, { t: "makes", at: "w:makes" }], Y1, "capOut1");
  line("1b", [{ t: "your", at: "w:your" }, { t: "competitors", at: "w:competitors" }, { t: "stand", at: "w:stand", accent: true }, { t: "out.", at: "w:out", accent: true, under: "w:out+0.1" }], Y2, "capOut1");
  // P3–P5
  line("2a", [{ t: "Not", at: "w:not" }, { t: "because", at: "w:because" }, { t: "their", at: "w:their" }, { t: "offer", at: "w:offer" }, { t: "is", at: "w:is" }, { t: "better,", at: "w:better", strike: "equal+0.1" }], Y1, "capOut2");
  line("2b", [{ t: "but", at: "w:but" }, { t: "because", at: "w:because2" }, { t: "they", at: "w:they" }, { t: "communicate", at: "w:communicate", accent: true, under: "w:communicate+0.3" }, { t: "it", at: "w:it" }, { t: "better.", at: "w:better2" }], Y2, "capOut2");
  // P6–P7
  line("3a", [{ t: "Most", at: "w:most" }, { t: "businesses", at: "w:businesses" }, { t: "lose", at: "w:lose" }, { t: "attention", at: "w:attention" }], Y1, "capOut3");
  line("3b", [{ t: "with", at: "w:with" }, { t: "unclear", at: "w:unclear" }, { t: "messaging,", at: "w:messaging" }], Y2, "capOut3");
  // P8–P10
  line("4a", [{ t: "forgettable", at: "w:forgettable" }, { t: "visuals,", at: "w:visuals" }], Y1, "capOut4");
  slot("4b", "w:and", "capOut4", Y2 - 4, ["w:no-0.1"], [
    first([{ t: "and", at: "w:and" }, { t: "content", at: "w:content" }, { t: "that", at: "w:that" }, { t: "gives", at: "w:gives" }, { t: "people", at: "w:people" }]),
    <span key="b" style={typo}>no reason to act.</span>,
  ]);
  // P11–P12
  line("5a", [{ t: "That's", at: "w:thats" }, { t: "where", at: "w:where" }], Y1, "capOut5");
  line("5b", [{ t: "WKConversions", at: "w:wkconversions", accent: true }, { t: "comes", at: "w:comes" }, { t: "in.", at: "w:in", under: "w:in" }], Y2, "capOut5");
  // P13–P16
  line("6a", [{ t: "We", at: "w:we" }, { t: "turn", at: "w:turn" }, { t: "complex", at: "w:complex" }, { t: "offers", at: "w:offers" }], Y1, "capOut6");
  slot("6b", "w:into", "capOut6", Y2 - 4, ["w:motion-0.1"], [
    first([{ t: "into", at: "w:into" }, { t: "clear,", at: "w:clear", accent: true }, { t: "high-performance", at: "w:highperformance" }]),
    <span key="b" style={typo}><A under={k("w:design", 0.45)}>motion design.</A></span>,
  ]);
  // P17–P19
  line("7a", [{ t: "Built", at: "w:built" }, { t: "to", at: "w:to2" }, { t: "attract", at: "w:attract" }, { t: "attention,", at: "w:attention2", accent: true }], Y1, "capOut7");
  slot("7b", "w:explain", "capOut7", Y2 - 4, ["w:and2-0.1"], [
    first([{ t: "explain", at: "w:explain" }, { t: "value,", at: "w:value", accent: true }]),
    <span key="b" style={typo}>and drive <A under={k("w:conversion+0.1", 0.45)}>conversion.</A></span>,
  ]);
  // P20–P23
  line("8a", [{ t: "We", at: "w:we2" }, { t: "start", at: "w:start" }, { t: "with", at: "w:with2" }, { t: "your", at: "w:your2" }, { t: "goal,", at: "w:goal", accent: true }], Y1, "capOut8");
  slot("8b", "w:sharpen", "capOut8", Y2 - 4, ["w:build-0.1", "w:and3-0.1"], [
    first([{ t: "sharpen", at: "w:sharpen", accent: true }, { t: "the", at: "w:the" }, { t: "message,", at: "w:message" }]),
    <span key="b" style={typo}>build the <A>concept,</A></span>,
    <span key="c" style={typo}>and design every frame with <A under={k("w:purpose+0.1", 0.45)}>purpose.</A></span>,
  ]);
  // P24–P26
  line("9a", [{ t: "No", at: "w:no2" }, { t: "random", at: "w:random", strike: "strike1" }, { t: "animations.", at: "w:animations", strike: "strike1+0.08" }], Y1, "capOut9");
  line("9b", [{ t: "No", at: "w:no3" }, { t: "visuals", at: "w:visuals2", strike: "sweep" }, { t: "just", at: "w:just" }, { t: "to", at: "w:to3" }, { t: "look", at: "w:look" }, { t: "good.", at: "w:good" }], Y2, "capOut9");
  // P27–P33: the sign-off
  line("10a", [{ t: "WKConversions.", at: "w:wkconversions2", accent: true }], Y1, "capOut10");
  line("10b", [{ t: "Creative", at: "w:creative" }, { t: "built", at: "w:built2" }, { t: "to", at: "w:to4" }, { t: "stand", at: "w:stand2", accent: true }, { t: "out.", at: "w:out2", accent: true, under: "w:out2+0.1" }], Y2, "capOut10");
  line("11a", [{ t: "Designed", at: "w:designed" }, { t: "to", at: "w:to5" }, { t: "move.", at: "w:move", accent: true }], Y1, "capOut11");
  line("11b", [{ t: "Built", at: "w:built3" }, { t: "to", at: "w:to6" }, { t: "convert.", at: "w:convert", accent: true, under: "w:convert+0.15" }], Y2, "capOut11");
  return <>{els}</>;
};
