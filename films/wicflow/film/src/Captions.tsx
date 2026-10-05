// The on-screen words: the key phrase of each line, built word by word on the spoken words (blur-rise), bottom left,
// Space Grotesk 600; the key word in the live-AI blue, marked (underline, strike); slots that roll or drop through when a
// list is spoken ("for sales / marketing / everyday work", "pilot / measure / scale", "less / more / more").
import React from "react";
import { T } from "./clock";
import { C, F } from "./lib";
import { DEPART, EASE, Line, W, stepper } from "./kinetic";

const X = 110, Y1 = 852, Y2 = 934, SIZE = 66;

/** A one-line slot whose content steps (A2 drop-through: the old line drops out below as the new one drops in from above). */
const Slot: React.FC<{ g: number; lines: React.ReactNode[]; steps: string[]; y: number; h?: number }> = ({ g, lines, steps, y, h = 84 }) => {
  const v = stepper(g, steps.map((l) => T.f(l)), 9);
  return (
    <div style={{ position: "absolute", left: X - 20, top: y - 10, height: h + 20, width: 1500, overflow: "hidden" }}>
      {lines.map((ln, i) => {
        const d = i - v;
        if (Math.abs(d) > 1) return null;
        return <div key={i} style={{ position: "absolute", left: 20, top: 10 + d * -h, opacity: 1 - Math.abs(d) * 0.8, filter: Math.abs(d) > 0.02 && Math.abs(d) < 0.98 ? `blur(${Math.sin(Math.abs(d) * Math.PI) * 6}px)` : undefined }}>{ln}</div>;
      })}
    </div>
  );
};
const S: React.FC<{ children: React.ReactNode; color?: string; under?: number; strike?: number }> = ({ children, color, under = 0, strike = 0 }) => (
  <span style={{ position: "relative", color }}>
    {children}
    {under > 0 && <span style={{ position: "absolute", left: 0, right: 0, bottom: -4, height: 6, borderRadius: 4, background: C.blue, transformOrigin: "0 50%", transform: `scaleX(${under})` }} />}
    {strike > 0 && <span style={{ position: "absolute", left: -4, right: -4, top: "55%", height: 6, borderRadius: 4, background: C.blue, transformOrigin: "0 50%", transform: `scaleX(${strike}) rotate(-2deg)` }} />}
  </span>
);
const typo: React.CSSProperties = { fontFamily: F.display, fontWeight: 600, fontSize: SIZE, letterSpacing: "-0.045em", lineHeight: 1, whiteSpace: "nowrap", color: C.ink };

export const Captions: React.FC<{ g: number; onBlue: number }> = ({ g, onBlue }) => {
  const t = g / 30;
  const ink = onBlue > 0.5 ? "#FFFFFF" : C.ink;
  const acc = onBlue > 0.5 ? "#FFFFFF" : C.blue;
  const els: React.ReactNode[] = [];
  const line = (key: string, words: W[], y: number, out: string, from: string, until: string) => {
    if (t < T.s(from) - 0.05 || t > T.s(until) + 0.5) return;
    els.push(<Line key={key} g={g} words={words} x={X} y={y} size={SIZE} weight={600} color={ink} out={out} outDur={0.2} />);
  };
  // P1–P3
  line("c1a", [{ t: "What", at: "w:what" }, { t: "if", at: "w:if" }, { t: "AI", at: "w:ai", accent: true }], Y1, "capOut1", "w:what", "capOut1");
  line("c1b", [{ t: "didn't", at: "w:didnt" }, { t: "just", at: "w:just" }, { t: "assist", at: "w:assist", strike: "strike" }, { t: "your", at: "w:your" }, { t: "team,", at: "w:team" }], Y2, "fwd-0.3", "w:didnt", "fwd");
  line("c1c", [{ t: "moved", at: "w:moved" }, { t: "your", at: "w:your2" }, { t: "business", at: "w:business" }, { t: "forward?", at: "w:forward", accent: true, under: "w:forward+0.1" }], Y2, "capOut1", "w:moved", "capOut1");
  // P4–P5
  line("c2a", [{ t: "Wicflow", at: "w:wicflow" }, { t: "builds", at: "w:builds" }], Y1, "capOut2", "w:wicflow", "capOut2");
  line("c2b", [{ t: "practical", at: "w:practical" }, { t: "AI", at: "w:ai2" }, { t: "systems.", at: "w:systems", accent: true, under: "w:systems+0.15" }], Y2, "capOut2", "w:practical", "capOut2");
  // P6–P8: one slot rolls through the list
  if (t > T.s("w:for") - 0.1 && t < T.s("capOut3") + 0.5) {
    const o = 1 - T.k(g, "capOut3", 0.2, DEPART);
    const inU = 1;
    els.push(
      <div key="c3" style={{ opacity: Math.min(inU * 1.6, 1) * o, transform: `translateY(${(1 - inU) * 20 - (1 - o) * 20}px)`, filter: inU < 1 || o < 1 ? `blur(${(1 - Math.min(inU, o)) * 8}px)` : undefined }}>
        <Slot g={g} y={Y2 - 4} steps={["w:marketing-0.1", "w:everyday-0.12"]} lines={[
          <span key="a" style={{ ...typo, color: ink, position: "relative", display: "block", height: SIZE }}><Line g={g} words={[{ t: "For", at: "w:for" }, { t: "sales,", at: "w:sales", accent: true }]} x={0} y={0} size={SIZE} weight={600} color={ink} /></span>,
          <span key="b" style={{ ...typo, color: ink }}><S color={acc}>marketing,</S></span>,
          <span key="c" style={{ ...typo, color: ink }}>and <S color={acc}>everyday work.</S></span>,
        ]} />
      </div>
    );
  }
  // P9–P10
  line("c4a", [{ t: "Finding", at: "w:finding" }, { t: "the", at: "w:the" }, { t: "right", at: "w:right" }, { t: "prospects,", at: "w:prospects", accent: true }], Y1, "capOut4", "w:finding", "capOut4");
  line("c4b", [{ t: "writing", at: "w:writing" }, { t: "personalized", at: "w:personalized", accent: true, under: "w:personalized+0.2" }, { t: "outreach.", at: "w:outreach" }], Y2, "capOut4", "w:writing", "capOut4");
  // P11–P12
  line("c5a", [{ t: "Automating", at: "w:automating" }, { t: "follow-ups,", at: "w:followups", accent: true }], Y1, "capOut5", "w:automating", "capOut5");
  line("c5b", [{ t: "keeping", at: "w:keeping" }, { t: "your", at: "w:your3" }, { t: "CRM", at: "w:crm" }, { t: "updated.", at: "w:updated", accent: true, under: "w:updated+0.15" }], Y2, "capOut5", "w:keeping", "capOut5");
  // P13–P14
  line("c6a", [{ t: "Everything", at: "w:everything" }, { t: "connects", at: "w:connects", accent: true, under: "w:connects+0.1" }], Y1, "capOut6", "w:everything", "capOut6");
  line("c6b", [{ t: "with", at: "w:with" }, { t: "the", at: "w:the2" }, { t: "tools", at: "w:tools", accent: true }, { t: "your", at: "w:your4" }, { t: "team", at: "w:team2" }, { t: "uses.", at: "w:uses" }], Y2, "capOut6", "w:with", "capOut6");
  // P15–P17: one slot drops through
  if (t > T.s("w:start") - 0.1 && t < T.s("capOut7") + 0.5) {
    const o = 1 - T.k(g, "capOut7", 0.2, DEPART);
    const inU = 1;
    els.push(
      <div key="c7" style={{ opacity: Math.min(inU * 1.6, 1) * o, transform: `translateY(${(1 - inU) * 20 - (1 - o) * 20}px)`, filter: inU < 1 || o < 1 ? `blur(${(1 - Math.min(inU, o)) * 8}px)` : undefined }}>
        <Slot g={g} y={Y2 - 4} steps={["w:measure-0.12", "w:scale-0.12"]} lines={[
          <span key="a" style={{ ...typo, color: ink, position: "relative", display: "block", height: SIZE, width: 1200 }}><Line g={g} words={[{ t: "Start", at: "w:start" }, { t: "with", at: "w:with2" }, { t: "one", at: "w:one" }, { t: "focused", at: "w:focused" }, { t: "pilot.", at: "w:pilot", accent: true, under: "w:pilot+0.1" }]} x={0} y={0} size={SIZE} weight={600} color={ink} /></span>,
          <span key="b" style={{ ...typo, color: ink }}><S color={acc}>Measure</S> the results.</span>,
          <span key="c" style={{ ...typo, color: ink }}><S color={acc}>Scale</S> what works.</span>,
        ]} />
      </div>
    );
  }
  // P18–P20: less / more / more (white on the blue field)
  if (t > T.s("w:less") - 0.1 && t < T.s("capOut8") + 0.5) {
    const o = 1 - T.k(g, "capOut8", 0.2, DEPART);
    const inU = 1;
    els.push(
      <div key="c8" style={{ opacity: Math.min(inU * 1.6, 1) * o, transform: `translateY(${(1 - inU) * 20 - (1 - o) * 20}px)`, filter: inU < 1 || o < 1 ? `blur(${(1 - Math.min(inU, o)) * 8}px)` : undefined }}>
        <Slot g={g} y={Y2 - 4} steps={["w:more-0.1", "w:more2-0.1"]} lines={[
          <span key="a" style={{ ...typo, color: ink, position: "relative", display: "block", height: SIZE, width: 1200 }}><Line g={g} words={[{ t: "Less", at: "w:less", accent: true }, { t: "manual", at: "w:manual", strike: "w:manual+0.1" }, { t: "work.", at: "w:work2" }]} x={0} y={0} size={SIZE} weight={600} color={ink} /></span>,
          <span key="b" style={{ ...typo, color: ink }}><S color={acc}>More</S> conversations.</span>,
          <span key="c" style={{ ...typo, color: ink }}><S color={acc}>More</S> customers.</span>,
        ]} />
      </div>
    );
  }
  // P21–P23
  line("c9a", [{ t: "Wicflow", at: "w:wicflow2" }, { t: "helps", at: "w:helps" }, { t: "turn", at: "w:turn" }, { t: "AI", at: "w:ai3", accent: true }, { t: "into", at: "w:into" }], Y1, "out", "w:wicflow2", "out");
  line("c9b", [{ t: "real", at: "w:real" }, { t: "business", at: "w:business2" }, { t: "growth", at: "w:growth", accent: true }, { t: "that", at: "w:that" }, { t: "lasts.", at: "w:lasts", under: "w:lasts+0.1" }], Y2, "out", "w:real", "out");
  return <>{els}</>;
};
export { EASE };
