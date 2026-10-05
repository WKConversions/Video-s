// The product moments, rebuilt from the site's own demo workspace (harvest/facts.md): the score card that turns into
// the email draft, the reply and the suggested answer, the week the meeting lands in, the 8% whose 8 is the ∞ mark
// stood upright, and the end card. Every move is placed on a label of the clock.
import React from "react";
import { Img, staticFile } from "remotion";
import { T } from "./clock";
import { EASE } from "./kinetic";
import { ARRIVE, C, DEPART, F, MOVE, SHADOW, UI, clamp01, lerp } from "./lib";
import { MARK_D, MARK_H, MARK_STROKE, MARK_W } from "./mark";
import { Check, Mono, Pill, mix, tk } from "./ui";

const L = (pos: string) => T.s(pos);

// ---------------------------------------------------------------- score → email
const W = 672;                               // inner width of the card
const ROWS = [
  ["Structural fit", 24, 30], ["Pain signals", 36, 50], ["Timing signals", 14, 20], ["Commercial pressure", 8, 20], ["Buying committee", 5, 15],
] as const;
const GENERIC = "I wanted to reach out about how freight teams can quote faster.";
const PERSONAL = "Your rates page still shows last year's lanes, and you are hiring two pricing analysts to keep quotes moving.";

export const CARD = { x: 1110, w: 740 };
export const cardBox = (g: number) => {
  const m = tk(g, L("draft"), 0.55, MOVE);
  return { x: CARD.x, y: lerp(214, 132, m), w: CARD.w, h: lerp(590, 812, m) };
};

/** The card's text and parts, inside the box (padding 34). */
const ScoreParts: React.FC<{ g: number }> = ({ g }) => {
  const toEmail = tk(g, L("draft"), 0.3, DEPART);
  const merge = tk(g, L("merge"), 0.6, MOVE);
  const total = Math.round(87 * EASE.lead(clamp01((g / 30 - L("merge") - 0.15) / 0.75)));
  const MY = 318;                            // the merged bar's y
  let cum = 0;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - toEmail, transform: `translateY(${-30 * toEmail}px)` }}>
      <div style={{ position: "absolute", left: 0, top: 0, right: 0, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 40, color: C.ink, letterSpacing: "-0.02em", lineHeight: 1.1 }}>Sofia Berglund</div>
          <div style={{ fontFamily: F.ui, fontWeight: 500, fontSize: 24, color: C.ink2, marginTop: 6 }}>Head of Growth, Fernhollow Freight</div>
        </div>
        <div style={{ opacity: tk(g, L("merge") + 0.45, 0.3), transform: `translateY(${(1 - tk(g, L("merge") + 0.45, 0.3)) * 8}px)` }}>
          <Pill tone="green" size={24}>Strong fit</Pill>
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, top: 112, opacity: 1 - merge }}><Mono>Score breakdown</Mono></div>
      {/* the big number, rolling up as the bars join */}
      <div style={{ position: "absolute", left: 0, top: 150, display: "flex", alignItems: "baseline", gap: 12, opacity: tk(g, L("merge") + 0.1, 0.3) }}>
        <span style={{ fontFamily: F.display, fontWeight: 600, fontSize: 128, lineHeight: 1, color: C.ink, letterSpacing: "-0.04em", fontVariantNumeric: "tabular-nums" }}>{total}</span>
        <span style={{ fontFamily: F.display, fontWeight: 500, fontSize: 44, color: C.ink3, letterSpacing: "-0.02em" }}>/ 135</span>
      </div>
      {ROWS.map(([label, v, max], n) => {
        const y0 = 150 + n * 62;
        const fill = UI(clamp01((g / 30 - L("bars") - n * 0.12) / 0.45));
        const m = MOVE(clamp01((g / 30 - L("merge") - n * 0.04) / 0.55));
        const w0 = (W * v) / max * fill, w1 = (W * v) / 135;
        const x = lerp(0, (W * cum) / 135, m), y = lerp(y0 + 38, MY, m), w = lerp(w0, w1, m);
        cum += v;
        const rowOn = tk(g, L("bars") + n * 0.12 - 0.1, 0.3);
        return (
          <React.Fragment key={label}>
            <div style={{ position: "absolute", left: 0, right: 0, top: y0, display: "flex", justifyContent: "space-between", opacity: rowOn * (1 - merge * 1.6),
              fontFamily: F.ui, fontWeight: 500, fontSize: 25, color: C.ink2 }}>
              <span>{label}</span><span style={{ color: C.ink, fontVariantNumeric: "tabular-nums" }}>{v} / {max}</span>
            </div>
            <div style={{ position: "absolute", left: 0, top: y0 + 38, width: W, height: 8, borderRadius: 9, background: C.n3, opacity: rowOn * (1 - merge) }} />
            <div style={{ position: "absolute", left: x, top: y + lerp(0, -2, merge), width: w + (n < 4 ? 1 : 0) * m, height: lerp(8, 12, merge), background: C.green, opacity: rowOn,
              borderTopLeftRadius: n === 0 ? 9 : 9 * (1 - m), borderBottomLeftRadius: n === 0 ? 9 : 9 * (1 - m), borderTopRightRadius: n === 4 ? 9 : 9 * (1 - m), borderBottomRightRadius: n === 4 ? 9 : 9 * (1 - m) }} />
          </React.Fragment>
        );
      })}
      {/* the merged track and the minimum */}
      <div style={{ position: "absolute", left: 0, top: MY, width: W, height: 12, borderRadius: 9, background: C.n3, opacity: merge, zIndex: -1 }} />
      <div style={{ position: "absolute", left: (W * 60) / 135 - 1.5, top: MY - 12, width: 3, height: 36, borderRadius: 2, background: C.ink, transformOrigin: "50% 100%", transform: `scaleY(${tk(g, L("merge") + 0.45, 0.35)})` }} />
      <div style={{ position: "absolute", right: 0, top: MY - 48, opacity: tk(g, L("merge") + 0.6, 0.3) }}><Mono size={20} color={C.ink2}>Minimum to contact: 60</Mono></div>
    </div>
  );
};

const Signal: React.FC<{ label: string; text: string; size: number; glow: number }> = ({ label, text, size, glow }) => (
  <div style={{ height: "100%", boxSizing: "border-box", padding: "12px 18px", borderRadius: 12, background: C.n2, border: `1px solid ${C.rule}`, borderLeft: `4px solid ${mix(C.orange, "#FFC2A6", glow)}` }}>
    <Mono size={18}>{label}</Mono>
    <div style={{ fontFamily: F.ui, fontWeight: 600, fontSize: size, color: C.ink, lineHeight: 1.25, marginTop: 4 }}>{text}</div>
  </div>
);

const Signals: React.FC<{ g: number }> = ({ g }) => {
  const m = tk(g, L("draft"), 0.55, MOVE);
  const glow = clamp01(tk(g, L("personal") + 0.5, 0.3) - tk(g, L("personal") + 1.4, 0.5));
  const a = tk(g, L("reason"), 0.4), b = tk(g, L("reason2"), 0.4);
  // score layout: stacked under the bar; email layout: side by side at the top
  const s1 = { x: 0, y: lerp(372, 0, m), w: lerp(W, W / 2 - 8, m), h: lerp(82, 96, m) };
  const s2 = { x: lerp(0, W / 2 + 8, m), y: lerp(468, 0, m), w: lerp(W, W / 2 - 8, m), h: lerp(82, 96, m) };
  const size = lerp(28, 22, m);
  return (
    <>
      <div style={{ position: "absolute", left: s1.x, top: s1.y, width: s1.w, height: s1.h, opacity: a, transform: `translateY(${(1 - a) * 14}px)` }}>
        <Signal label="Job post" text="Hiring two pricing analysts" size={size} glow={glow} />
      </div>
      <div style={{ position: "absolute", left: s2.x, top: s2.y, width: s2.w, height: s2.h, opacity: b, transform: `translateY(${(1 - b) * 14}px)` }}>
        <Signal label="Website watch" text="Rates page unchanged since March 2025" size={size} glow={glow} />
      </div>
    </>
  );
};

const EmailParts: React.FC<{ g: number }> = ({ g }) => {
  const on = tk(g, L("draft") + 0.25, 0.4);
  if (on <= 0) return null;
  const t = g / 30;
  const typed = Math.floor(clamp01((t - L("generic")) / 0.7) * GENERIC.length);
  const strike = tk(g, L("strike"), 0.35, MOVE);
  const words = PERSONAL.split(" ");
  const under = (from: number, to: number, at: number) => ({ from, to, k: tk(g, at, 0.35, MOVE) });
  const marks = [under(5, 8, L("personal") + 0.55), under(12, 16, L("personal") + 0.85)];   // last year's lanes · hiring two pricing analysts
  const bar = tk(g, L("approve"), 0.4);
  const clicked = g / 30 >= L("click");
  const press = clicked ? 1 - 0.05 * Math.sin(Math.PI * clamp01((t - L("click")) / 0.16)) : 1;
  const done = tk(g, L("click") + 0.12, 0.3);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: on }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 122, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Mono>Draft · touch 1</Mono>
        <span style={{ fontFamily: F.ui, fontWeight: 500, fontSize: 20, color: C.ink2, border: `1px solid ${mix("#3E3E41", C.orange, strike)}`, borderRadius: 999, padding: "4px 14px" }}>Edited by our team</span>
      </div>
      <div style={{ position: "absolute", left: 0, top: 172, fontFamily: F.mono, fontSize: 20, color: C.ink3 }}>To&nbsp;&nbsp;sofia.berglund@fernhollowfreight.com</div>
      <div style={{ position: "absolute", left: 0, top: 208, display: "flex", alignItems: "baseline", gap: 14 }}>
        <span style={{ fontFamily: F.ui, fontSize: 22, color: C.ink3 }}>Subject</span>
        <span style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 30, color: C.ink }}>Last year's lanes</span>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 268, height: 1, background: C.rule }} />
      <div style={{ position: "absolute", left: 0, width: W, top: 292, fontFamily: F.ui, fontWeight: 500, fontSize: 30, lineHeight: 1.42, color: C.ink }}>
        <div style={{ opacity: tk(g, L("generic") - 0.25, 0.25) }}>Hi Sofia,</div>
        <div style={{ position: "relative", color: mix(C.ink, C.ink3, strike), minHeight: 86 }}>
          {GENERIC.slice(0, typed)}
          {/* the strike, drawn across both lines */}
          {[0, 1].map((ln) => (
            <div key={ln} style={{ position: "absolute", left: 0, top: 23 + ln * 42.6, height: 3, borderRadius: 2, background: C.orange,
              width: ln === 0 ? W * clamp01(strike * 2) : 300 * clamp01(strike * 2 - 1) }} />
          ))}
        </div>
        <div style={{ marginTop: 4 }}>
          {words.map((w, i) => {
            const k = tk(g, L("personal") + i * 0.055, 0.22);
            const mk = marks.find((m) => i >= m.from && i <= m.to);
            return (
              <span key={i} style={{ position: "relative", display: "inline-block", marginRight: "0.26em", opacity: k, transform: `translateY(${(1 - k) * 8}px)` }}>
                {w}
                {mk && <span style={{ position: "absolute", left: 0, right: i === mk.to ? 0 : "-0.26em", bottom: 2, height: 3, background: C.orange, transformOrigin: "0 50%",
                  transform: `scaleX(${clamp01(mk.k * (mk.to - mk.from + 1) - (i - mk.from))})` }} />}
              </span>
            );
          })}
        </div>
      </div>
      {/* approval bar */}
      <div style={{ position: "absolute", left: -34, right: -34, bottom: -34, height: 112, borderTop: `1px solid ${C.rule}`, background: C.n2, borderRadius: "0 0 18px 18px",
        opacity: bar, transform: `translateY(${(1 - bar) * 30}px)`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 34px" }}>
        <div style={{ position: "relative", height: 34, width: 400 }}>
          <span style={{ position: "absolute", left: 0, top: 0, fontFamily: F.ui, fontWeight: 500, fontSize: 24, color: C.ink2, opacity: 1 - done, transform: `translateY(${-done * 20}px)`, whiteSpace: "nowrap" }}>
            This email is waiting for your approval</span>
          <span style={{ position: "absolute", left: 0, top: 0, display: "flex", alignItems: "center", gap: 10, fontFamily: F.ui, fontWeight: 600, fontSize: 24, color: C.ink, opacity: done, transform: `translateY(${(1 - done) * 20}px)`, whiteSpace: "nowrap" }}>
            <Check size={24} /> Sent from your mailbox</span>
        </div>
        <div style={{ position: "relative", width: 250, height: 60 }}>
          <div data-probe="approve-btn" style={{ position: "absolute", inset: 0, borderRadius: 12, background: C.orange, display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: F.ui, fontWeight: 600, fontSize: 26, color: C.night, transform: `scale(${press})`, opacity: 1 - done }}>Approve &amp; send</div>
          <div style={{ position: "absolute", inset: 0, borderRadius: 12, background: C.greenSoft, border: "1px solid rgba(75,198,128,0.35)", display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
            fontFamily: F.ui, fontWeight: 600, fontSize: 26, color: C.green, opacity: done }}><Check size={24} /> Approved</div>
        </div>
      </div>
    </div>
  );
};

/** The score card, unfolding out of Fernhollow's pin, turning into the draft, and folding into the orange dot that is
 *  the email leaving the viewer's block. `pin` is Fernhollow's pin on screen, `home` the start of the email's route. */
export const LeadCard: React.FC<{ g: number; pin: [number, number]; home: [number, number] }> = ({ g, pin, home }) => {
  const t = g / 30;
  if (t < L("card") - 0.05 || t > L("send") + 0.1) return null;
  const box = cardBox(g);
  const kIn = tk(g, L("card"), 0.5);
  const fold = tk(g, L("fold"), 0.27, DEPART);                    // closes on its centre line
  const fly = tk(g, L("fold") + 0.25, 0.3, MOVE);                // the line shrinks into a dot and flies home
  const ox = pin[0] - box.x, oy = pin[1] - box.y;
  if (fold >= 1) {
    const cx = lerp(box.x + box.w / 2, home[0], fly), cy = lerp(box.y + box.h / 2, home[1], fly);
    const w = lerp(box.w, 11, fly);
    return <div style={{ position: "absolute", left: 0, top: 0, transform: `translate(${cx - w / 2}px, ${cy - lerp(3, 5.5, fly)}px)`, width: w, height: lerp(6, 11, fly), borderRadius: 99, background: C.orange, opacity: 1 - tk(g, L("send"), 0.08) }} />;
  }
  return (
    <div data-probe="lead-card" style={{ position: "absolute", left: box.x, top: box.y, width: box.w, height: box.h, transformOrigin: fold > 0 ? "50% 50%" : `${ox}px ${oy}px`,
      transform: fold > 0 ? `scaleY(${Math.max(0.006, 1 - fold)})` : `scale(${lerp(0.18, 1, kIn)})`, opacity: Math.min(1, kIn * 1.6),
      background: C.n1, border: `1px solid ${C.rule}`, borderRadius: 18, boxShadow: `${SHADOW.float}, ${SHADOW.edge}`, willChange: "transform" }}>
      <div style={{ position: "absolute", left: 34, top: 34, width: W, bottom: 34 }}>
        <ScoreParts g={g} />
        <Signals g={g} />
        <EmailParts g={g} />
      </div>
    </div>
  );
};

// ---------------------------------------------------------------- the cursor (the viewer's one click)
export const Cursor: React.FC<{ g: number }> = ({ g }) => {
  const t = g / 30;
  if (t < L("cursor") || t > L("fold") + 0.1) return null;
  const box = cardBox(g);
  const target: [number, number] = [box.x + 34 + W - 125 + 20, box.y + box.h - 56 + 12];
  const m = tk(g, L("cursor"), 0.45, ARRIVE);
  const leave = tk(g, L("click") + 0.35, 0.3, DEPART);
  const x = lerp(1960, target[0], m) + leave * 160, y = lerp(1110, target[1], m) + leave * 120;
  const press = 1 - 0.12 * Math.sin(Math.PI * clamp01((t - L("click")) / 0.16));
  return (
    <svg data-probe="cursor" width={44} height={52} viewBox="0 0 22 26" style={{ position: "absolute", left: 0, top: 0, transform: `translate(${x}px, ${y}px) scale(${press})`, transformOrigin: "0 0", opacity: 1 - leave, overflow: "visible" }}>
      <path d="M2 1.5 L2 20 L7 15.6 L10.4 23.4 L13.6 22 L10.3 14.4 L17 14.4 Z" fill={C.ink} stroke={C.night} strokeWidth={1.4} strokeLinejoin="round" />
    </svg>
  );
};

// ---------------------------------------------------------------- the reply, and the answer drafted
const ANSWER = "Great, Marta. I will send an invite for Thursday at 10:00.";
export const Reply: React.FC<{ g: number; pin: [number, number]; slot: [number, number] }> = ({ g, pin, slot }) => {
  const t = g / 30;
  if (t < L("marta") - 0.05 || t > L("booked") + 0.6) return null;
  const kIn = tk(g, L("marta"), 0.45);
  const out = tk(g, L("booked") - 0.1, 0.35, DEPART);
  const x = Math.min(1840 - 640, pin[0] + 36), y = Math.max(110, pin[1] - 250);
  const ans = tk(g, L("answer"), 0.4);
  const typed = Math.floor(clamp01((t - L("answer") - 0.2) / 0.8) * ANSWER.length);
  const idx = ANSWER.indexOf("Thursday at 10:00");
  // "Thursday at 10:00" leaves as a green pill and drops into the week's Thursday slot
  const fly = tk(g, L("booked") - 0.25, 0.42, MOVE);
  const pillFrom: [number, number] = [x + 24 + 16 * 0, y + 236];
  return (
    <>
      <div data-probe="reply" style={{ position: "absolute", left: x, top: y, width: 640, opacity: kIn * (1 - out), transform: `translateY(${(1 - kIn) * 16 - out * 12}px)` }}>
        <Mono size={19} color={C.ink3}>Marta Vogel · Wed 14:03</Mono>
        <div style={{ marginTop: 10, display: "inline-block", padding: "16px 24px", borderRadius: 18, background: C.n2, border: `1px solid ${C.ruleStrong}`, boxShadow: SHADOW.float,
          fontFamily: F.ui, fontWeight: 600, fontSize: 36, color: C.ink, letterSpacing: "-0.015em" }}>Good timing. Thursday works.</div>
        <div style={{ marginTop: 18, padding: "16px 22px", borderRadius: 16, background: C.n1, border: `1px solid ${C.rule}`, opacity: ans, transform: `translateY(${(1 - ans) * 12}px)` }}>
          <Mono size={18} color={C.orange}>Suggested reply</Mono>
          <div style={{ marginTop: 6, fontFamily: F.ui, fontWeight: 500, fontSize: 27, color: C.ink2, lineHeight: 1.35, minHeight: 74 }}>
            {ANSWER.slice(0, Math.min(typed, idx))}
            {typed > idx && <span style={{ color: C.ink, borderBottom: `3px solid ${C.green}`, opacity: 1 - fly }}>{ANSWER.slice(idx, Math.min(typed, idx + 17))}</span>}
            {typed > idx + 17 && ANSWER.slice(idx + 17, typed)}
          </div>
        </div>
      </div>
      {fly > 0 && fly < 1 && (
        <div style={{ position: "absolute", left: 0, top: 0, transform: `translate(${lerp(pillFrom[0] + 300, slot[0], fly) - 60}px, ${lerp(pillFrom[1], slot[1], fly) - 20}px)`, width: 120, height: 40, borderRadius: 999,
          background: C.greenSoft, border: `1px solid ${C.green}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.ui, fontWeight: 600, fontSize: 22, color: C.green }}>10:00</div>
      )}
    </>
  );
};

// ---------------------------------------------------------------- the week the meeting lands in
export const WEEK = { w: 700, h: 300 };
export const weekBox = (home: [number, number]) => ({ x: Math.max(120, home[0] - WEEK.w - 90), y: Math.max(330, Math.min(1000 - WEEK.h - 160, home[1] - WEEK.h + 10)) });
export const slotOf = (home: [number, number]): [number, number] => {
  const b = weekBox(home);
  return [b.x + 24 + 76 + 3 * 120 + 60, b.y + 70 + 70 + 35];
};
export const Week: React.FC<{ g: number; home: [number, number] }> = ({ g, home }) => {
  const t = g / 30;
  if (t < L("week") - 0.05 || t > L("weekOut") + 0.5) return null;
  const b = weekBox(home);
  const kIn = tk(g, L("week"), 0.5);
  const out = tk(g, L("weekOut"), 0.4, DEPART);
  const land = tk(g, L("booked") + 0.15, 0.35, UI);
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const ox = home[0] - b.x, oy = home[1] - b.y;
  return (
    <div data-probe="week" style={{ position: "absolute", left: b.x, top: b.y, width: WEEK.w, height: WEEK.h, borderRadius: 18, background: C.n1, border: `1px solid ${C.rule}`,
      boxShadow: `${SHADOW.float}, ${SHADOW.edge}`, transformOrigin: `${ox}px ${oy}px`, transform: `scale(${lerp(0.15, 1, kIn) * lerp(1, 0.12, out)})`, opacity: Math.min(1, kIn * 1.6) * (1 - out) }}>
      <div style={{ position: "absolute", left: 24, top: 20 }}><Mono size={19}>Your calendar · this week</Mono></div>
      {days.map((d, i) => (
        <div key={d} style={{ position: "absolute", left: 24 + 76 + i * 120, top: 62, width: 112, textAlign: "center", fontFamily: F.ui, fontWeight: 600, fontSize: 22, color: i === 3 ? C.ink : C.ink3 }}>{d}</div>
      ))}
      {["09:00", "10:00", "11:00"].map((h, r) => (
        <React.Fragment key={h}>
          <div style={{ position: "absolute", left: 24, top: 104 + r * 70, fontFamily: F.mono, fontSize: 18, color: C.ink3 }}>{h}</div>
          <div style={{ position: "absolute", left: 24 + 76, right: 24, top: 100 + r * 70, height: 1, background: C.rule }} />
        </React.Fragment>
      ))}
      {days.map((d, i) => <div key={"c" + d} style={{ position: "absolute", left: 24 + 76 + i * 120 - 4, top: 100, width: 1, height: 210, background: i ? C.rule : "transparent" }} />)}
      {/* the meeting */}
      <div style={{ position: "absolute", left: 24 + 76 + 3 * 120 + 4, top: 100 + 70 + 4, width: 108, height: 62, borderRadius: 10, background: C.greenSoft, border: `1px solid ${C.green}`,
        opacity: land, transform: `scale(${lerp(0.7, 1, land)})`, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontFamily: F.ui, fontWeight: 600, fontSize: 22, color: C.green }}>
        <Check size={18} /> 10:00
      </div>
      <div style={{ position: "absolute", left: 24, right: 24, bottom: -64, opacity: tk(g, L("booked") + 0.35, 0.35), fontFamily: F.ui, fontWeight: 600, fontSize: 26, color: C.ink,
        display: "flex", alignItems: "center", gap: 12 }}>
        <Pill tone="green" size={22}>Meeting booked</Pill><span style={{ whiteSpace: "nowrap" }}>Thu 10:00 · Marta Vogel</span>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------- the 8%, whose 8 is the ∞ mark stood upright; the end card
const MarkPath: React.FC<{ color: string; stroke?: number }> = ({ color, stroke = MARK_STROKE }) => (
  <path d={MARK_D} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" />
);
// the lockup: mark + wordmark on the logo's own 2854 × 372 grid, 104 px tall, centred
const LK = { h: 104, y: 330 };
const lkScale = LK.h / MARK_H;
const lkLeft = 960 - (2854 * lkScale) / 2;

export const Finale: React.FC<{ g: number }> = ({ g }) => {
  const t = g / 30;
  if (t < L("stat") - 0.05) return null;
  // the 8 (the mark turned upright) and its %
  const stat = tk(g, L("stat"), 0.7, UI);
  const turn = tk(g, L("turn"), 0.9, MOVE);
  const labelOut = tk(g, L("turn") - 0.1, 0.45, MOVE);
  const H8 = 300, s8 = H8 / MARK_W;                       // upright: the mark's 817 becomes the 8's height
  const statPos = { x: 160 + (MARK_H * s8) / 2, y: 470 };  // the 8's centre in the stat
  const lockPos = { x: lkLeft + (MARK_W * lkScale) / 2, y: LK.y + LK.h / 2 };
  const cx = lerp(statPos.x, lockPos.x, turn), cy = lerp(statPos.y, lockPos.y, turn);
  const sc = lerp(s8, lkScale, turn);
  const rot = lerp(90, 0, turn);
  const rise8 = (1 - stat) * 40;
  const col = mix(C.ink, C.orange, tk(g, L("turn") + 0.55, 0.4));
  // the % and the label, built after the 8
  const pct = tk(g, L("stat") + 0.15, 0.45);
  const lab = tk(g, L("stat") + 0.5, 0.45), src = tk(g, L("stat") + 0.95, 0.45);
  // the end card
  const word = tk(g, L("word"), 0.6, ARRIVE);
  const line = "Your distribution, fixed.".split(" ");
  const cta = tk(g, L("cta"), 0.5), faces = tk(g, L("faces"), 0.5);
  return (
    <>
      {/* the 8 / the ∞ */}
      <svg data-probe="mark" width={MARK_W} height={MARK_H} viewBox={`0 0 ${MARK_W} ${MARK_H}`} style={{ position: "absolute", left: 0, top: 0, overflow: "visible",
        transform: `translate(${cx - MARK_W / 2}px, ${cy - MARK_H / 2 + rise8}px) rotate(${rot}deg) scale(${sc * lerp(0.9, 1, stat)})`, transformOrigin: "50% 50%", opacity: stat, willChange: "transform" }}>
        <MarkPath color={col} />
      </svg>
      {/* % · label · source */}
      <div style={{ position: "absolute", left: 160 + MARK_H * s8 + 18, top: 470 - 210, opacity: pct * (1 - labelOut), transform: `translate(${labelOut * 90}px, ${(1 - pct) * 30}px)`,
        fontFamily: F.display, fontWeight: 600, fontSize: 400, lineHeight: 1, letterSpacing: "-0.04em", color: C.orange }}>%</div>
      <div style={{ position: "absolute", left: 160, top: 690, opacity: lab * (1 - labelOut), transform: `translateY(${(1 - lab) * 16 + labelOut * 24}px)`,
        fontFamily: F.display, fontWeight: 600, fontSize: 68, letterSpacing: "-0.03em", color: C.ink }}>reply rate, first month of sending</div>
      <div style={{ position: "absolute", left: 160, top: 790, opacity: src * (1 - labelOut), transform: `translateY(${labelOut * 24}px)`, display: "flex", alignItems: "center", gap: 14 }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "6px 14px", borderRadius: 999, border: `1px solid ${C.ruleStrong}`, fontFamily: F.ui, fontWeight: 600, fontSize: 22, color: C.ink2 }}>
          <span style={{ width: 11, height: 11, borderRadius: 9, border: `2px solid ${C.orange}`, display: "inline-block" }} />Real · anonymised</span>
        <Mono size={21} color={C.ink3}>Replies over 300 contacts · 12 Aug to 12 Sep 2026</Mono>
      </div>
      {/* the wordmark slides out from behind the mark */}
      {word > 0 && (
        <div style={{ position: "absolute", left: lkLeft + 1021 * lkScale, top: LK.y, width: 1833 * lkScale, height: LK.h, overflow: "hidden" }}>
          <Img src={staticFile("img/clearscaler-wordmark-white.svg")} style={{ width: 1833 * lkScale, height: LK.h, transform: `translateX(${(1 - word) * -60}px)`, opacity: word }} />
        </div>
      )}
      {/* Your distribution, fixed. */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 500, display: "flex", justifyContent: "center", gap: "0.24em", fontFamily: F.display, fontWeight: 600, fontSize: 112, letterSpacing: "-0.045em", lineHeight: 1 }}>
        {line.map((w, i) => {
          const tw = L("line") + i * 0.16;
          const appear = clamp01((t - tw + 0.1) / 0.1), bright = ARRIVE(clamp01((t - tw) / 0.26));
          return <span key={i} style={{ opacity: appear * lerp(0.3, 1, bright), transform: `translateY(${(1 - appear) * 12}px)`, color: i === 2 ? mix(C.ink, C.orange, bright) : C.ink }}>{w}</span>;
        })}
      </div>
      {/* Book a call · 30 minutes with Magnus or Kian */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 700, display: "flex", justifyContent: "center", alignItems: "center", gap: 34 }}>
        <div data-probe="cta" style={{ height: 84, padding: "0 34px 0 38px", borderRadius: 14, background: C.orange, display: "flex", alignItems: "center", gap: 14, opacity: cta,
          transform: `translateY(${(1 - cta) * 22}px)`, fontFamily: F.ui, fontWeight: 600, fontSize: 34, color: C.night }}>
          Book a call
          <svg width={22} height={22} viewBox="0 0 16 16" fill="none"><path d="M6 3.5 10.5 8 6 12.5" stroke={C.night} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16, opacity: faces, transform: `translateY(${(1 - faces) * 16}px)` }}>
          <div style={{ display: "flex" }}>
            <Img src={staticFile("img/magnus-avatar-128.png")} style={{ width: 64, height: 64, borderRadius: 99, border: `2px solid ${C.night}` }} />
            <Img src={staticFile("img/kian-avatar-128.png")} style={{ width: 64, height: 64, borderRadius: 99, border: `2px solid ${C.night}`, marginLeft: -16 }} />
          </div>
          <span style={{ fontFamily: F.ui, fontWeight: 500, fontSize: 30, color: C.ink2 }}>30 minutes with Magnus or Kian</span>
        </div>
      </div>
    </>
  );
};
export { MarkPath };
