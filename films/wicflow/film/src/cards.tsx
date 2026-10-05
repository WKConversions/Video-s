// The product moments, drawn from the site's own illustrative cards (wicflow.com home and services pages): the first
// message to Anna, her reply, the CRM row whose status rolls, and the meetings-this-week counter. Every word and number is
// the site's own (harvest/facts.md).
import React from "react";
import { C, F, R, SHADOW, rgba } from "./lib";
import { Icon, LiveDot } from "./ui";
import { Typed, Digit } from "./kinetic";

/** The outreach draft: "Hi Anna, I saw you're hiring two salespeople…", typed from `at`, with "Anna" and the reason
 *  marked in AI blue once typed (personalised). */
export const MessageCard: React.FC<{ g: number; at: number; w?: number; mark?: number; style?: React.CSSProperties }> = ({ g, at, w = 760, mark = 0, style }) => {
  const line = "Hi Anna, I saw you’re hiring two salespeople…";
  return (
    <div style={{ position: "absolute", width: w, padding: "30px 36px 34px", background: C.paper, borderRadius: R.card, boxShadow: `${SHADOW.float}, ${SHADOW.edge}`, fontFamily: F.ui, color: C.ink, ...style }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 24, color: C.muted, fontWeight: 600 }}>
        <Icon name="pencil" size={26} color={C.blue} stroke={1.8} />
        <span>Wrote the first message</span>
      </div>
      <div style={{ height: 1, background: C.line2, margin: "20px 0 22px" }} />
      <div style={{ fontSize: 40, lineHeight: 1.25, fontWeight: 600, letterSpacing: "-0.015em", position: "relative" }}>
        <Typed g={g} text={line} at={at} cps={34} caret />
        {mark > 0 && (
          <span style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none" }}>
            <span style={{ visibility: "hidden" }}>Hi </span>
            <span style={{ position: "relative", display: "inline-block" }}>
              <span style={{ visibility: "hidden" }}>Anna</span>
              <span style={{ position: "absolute", left: -6, right: -6, bottom: -4, height: 6, borderRadius: 4, background: C.blue, transformOrigin: "0 50%", transform: `scaleX(${mark})` }} />
            </span>
          </span>
        )}
      </div>
    </div>
  );
};

/** A chat bubble: Anna's reply as the site writes it. */
export const Bubble: React.FC<{ text: string; who?: string; w?: number; style?: React.CSSProperties; tail?: "left" | "right" }> = ({ text, who, w, style, tail = "left" }) => (
  <div style={{ position: "absolute", width: w, padding: "20px 26px", background: C.paper, borderRadius: 26, [tail === "left" ? "borderBottomLeftRadius" : "borderBottomRightRadius"]: 8,
    boxShadow: `${SHADOW.card}, ${SHADOW.edge}`, fontFamily: F.ui, color: C.ink, ...style }}>
    {who && <div style={{ fontSize: 21, color: C.muted, fontWeight: 700, marginBottom: 6 }}>{who}</div>}
    <div style={{ fontSize: 32, fontWeight: 600, letterSpacing: "-0.01em", whiteSpace: "nowrap" }}>{text}</div>
  </div>
);

/** The CRM row (the site's illustrative sales view): a contact and a status that rolls through the site's own steps. */
export const CRM_STEPS = ["New contact", "Interested prospect", "Meeting booked"];
export const CrmCard: React.FC<{ g: number; step: number; tick: number; w?: number; style?: React.CSSProperties; logo?: React.ReactNode }> = ({ g, step, tick, w = 720, style, logo }) => {
  const h = 52;
  return (
    <div style={{ position: "absolute", width: w, padding: "26px 32px 30px", background: C.paper, borderRadius: R.card, boxShadow: `${SHADOW.float}, ${SHADOW.edge}`, fontFamily: F.ui, color: C.ink, ...style }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 24, color: C.muted, fontWeight: 600 }}>
        <span>Your CRM</span><span style={{ flex: 1 }} />{logo}
      </div>
      <div style={{ height: 1, background: C.line2, margin: "18px 0 22px" }} />
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <div style={{ width: 64, height: 64, borderRadius: "50%", background: C.tBlue[2], display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 28, color: C.blueDeep }}>A</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 34, fontWeight: 700, letterSpacing: "-0.01em" }}>Anna</div>
          <div style={{ fontSize: 24, color: C.muted, marginTop: 2 }}>Building firm · Tampere</div>
        </div>
        <div style={{ position: "relative", height: h, minWidth: 330, overflow: "hidden", borderRadius: 999, background: step >= 1.5 ? C.inkStrong : C.tBlue[1],
          boxShadow: `inset 0 0 0 1.5px ${step >= 1.5 ? C.inkStrong : rgba(C.blue, 0.3)}` }}>
          <div style={{ transform: `translateY(${-step * h}px)` }}>
            {CRM_STEPS.map((s, i) => (
              <div key={s} style={{ height: h, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, fontSize: 25, fontWeight: 700, padding: "0 22px",
                color: i === 2 ? "#fff" : C.blueDeep, whiteSpace: "nowrap" }}>
                {i === 2 && <Icon name="calendar" size={24} color="#fff" stroke={1.8} />}{s}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 22, fontSize: 23, color: C.muted, opacity: tick }}>
        <span style={{ width: 30, height: 30, borderRadius: "50%", background: C.blue, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${0.6 + 0.4 * tick})` }}>
          <Icon name="check" size={20} color="#fff" stroke={2.2} /></span>
        Updated automatically
      </div>
    </div>
  );
};

/** The site's own counter (AI-at-work card footer): "Meetings booked this week", rolling 7 → 8 like an odometer. */
export const Counter: React.FC<{ g: number; v: number; size?: number; style?: React.CSSProperties }> = ({ g, v, size = 120, style }) => (
  <div style={{ position: "absolute", padding: "26px 34px 28px", background: C.paper, borderRadius: R.card, boxShadow: `${SHADOW.float}, ${SHADOW.edge}`, fontFamily: F.ui, color: C.ink, ...style }}>
    <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 24, color: C.muted, fontWeight: 600 }}><LiveDot g={g} size={12} />Meetings booked this week</div>
    <div style={{ display: "flex", fontFamily: F.display, fontWeight: 600, fontSize: size, letterSpacing: "-0.045em", lineHeight: 1, marginTop: 14, color: C.ink }}>
      <Digit v={v} size={size} width={0.66} />
    </div>
  </div>
);
