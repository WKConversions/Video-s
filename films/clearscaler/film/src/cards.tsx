// The product moments, rebuilt from the site's own demo workspace (harvest/facts.md): the score card that turns into
// the email draft, the reply and the suggested answer, the week the meeting lands in; then the finale, where the loop
// lifts off the ground as the 8 of the real 8% and turns into the logo (monochrome, as brand.json requires).
import React from "react";
import { Img, staticFile } from "remotion";
import { T } from "./clock";
import { EASE } from "./kinetic";
import { ARRIVE, C, DEPART, F, MOVE, SHADOW, UI, clamp01, lerp } from "./lib";
import { LOOP_PTS } from "./world";
import { groundLoop } from "./World";
import { Check, Label, Mono, Pill, fadeIn, mix, tk } from "./ui";

const L = (pos: string) => T.s(pos);
const cos01 = (u: number) => 0.5 - 0.5 * Math.cos(Math.PI * clamp01(u));

// ---------------------------------------------------------------- score → email (one card, unfolding from Fernhollow)
const ROWS = [
  ["Structural fit", 24, 30], ["Pain signals", 36, 50], ["Timing signals", 14, 20], ["Commercial pressure", 8, 20], ["Buying committee", 5, 15],
] as const;
const ROW_COL = [C.green, C.ink2, C.ink2, C.ink3, C.ink3];   // the site's score breakdown colours
const GENERIC = "I wanted to reach out about how freight teams can quote faster.";
const PERSONAL = "Your rates page still shows last year's lanes, and you are hiring two pricing analysts to keep quotes moving.";
const ASK = "Worth a short call to see if it fits how Fernhollow quotes today?";
const PAD = 36;

export const cardBox = (g: number) => {
  const m = tk(g, L("draft") + 0.05, 0.55, MOVE);          // the close framing for the email
  return { x: lerp(1080, 920, m), y: lerp(236, 96, m), w: lerp(760, 920, m), h: lerp(560, 880, m) };
};

const ScoreParts: React.FC<{ g: number; w: number }> = ({ g, w }) => {
  const leave = tk(g, L("draft"), 0.5, MOVE);
  if (leave >= 1) return null;
  const compact = tk(g, L("reason") - 0.15, 0.45, MOVE);       // the reasons take over: the score becomes one row
  const merge = tk(g, L("merge"), 0.6, MOVE);
  const labelsOut = tk(g, L("merge"), 0.22, DEPART);
  const total = Math.round(87 * EASE.lead(clamp01((g / 30 - L("merge") - 0.3) / 0.7)));
  const numIn = tk(g, L("merge") + 0.28, 0.4);
  const MY = lerp(214, 96, tk(g, L("reason") - 0.15, 0.45, MOVE));
  let cum = 0;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - clamp01((leave - 0.55) / 0.45), transformOrigin: "0 0", transform: `translate(${-420 * leave}px, ${-160 * leave}px) scale(${1 - 0.6 * leave})` }}>
      <div style={{ position: "absolute", left: 0, top: 0, opacity: 1 - labelsOut }}><Label size={30} weight={600} color={C.ink}>Score breakdown</Label></div>
      <div style={{ position: "absolute", left: 0, top: 50, display: "flex", alignItems: "baseline", gap: 12, opacity: fadeIn(g, L("merge") + 0.28, 6), transformOrigin: "0 0", transform: `translateY(${(1 - numIn) * 14 - 50 * compact}px) scale(${1 - 0.45 * compact})` }}>
        <span style={{ fontFamily: F.display, fontWeight: 600, fontSize: 124, lineHeight: 1, color: C.ink, letterSpacing: "-0.04em", fontVariantNumeric: "tabular-nums" }}>{total}</span>
        <span style={{ fontFamily: F.display, fontWeight: 500, fontSize: 46, color: C.ink3, letterSpacing: "-0.02em" }}>/ 135</span>
      </div>
      <div style={{ position: "absolute", right: 0, top: MY - 52, opacity: fadeIn(g, L("merge") + 0.5, 6) }}><Label size={28} color={C.ink2}>Minimum to contact: <b style={{ color: C.ink }}>60</b></Label></div>
      {ROWS.map(([label, v, max], n) => {
        const y0 = 64 + n * 78;
        const on = tk(g, L("bars") + n * 0.12 - 0.1, 0.3);
        const fill = UI(clamp01((g / 30 - L("bars") - n * 0.12) / 0.45));
        const m = MOVE(clamp01((g / 30 - L("merge") - n * 0.04) / 0.55));
        const x = lerp(0, (w * cum) / 135, m), y = lerp(y0 + 48, MY, m), width = lerp(((w * v) / max) * fill, (w * v) / 135 + (n < 4 ? 1 : 0), m);
        cum += v;
        return (
          <React.Fragment key={label}>
            <div style={{ position: "absolute", left: 0, right: 0, top: y0, display: "flex", justifyContent: "space-between", opacity: fadeIn(g, L("bars") + n * 0.12 - 0.1, 5) * (1 - labelsOut),
              transform: `translateY(${(1 - on) * 10}px)`, fontFamily: F.ui, fontWeight: 500, fontSize: 36, color: C.ink2 }}>
              <span>{label}</span><span style={{ color: C.ink, fontVariantNumeric: "tabular-nums" }}>{v} / {max}</span>
            </div>
            <div style={{ position: "absolute", left: 0, top: y0 + 48, width: w, height: 14, borderRadius: 9, background: C.n3, opacity: fadeIn(g, L("bars") + n * 0.12 - 0.1, 5) * (1 - labelsOut) }} />
            <div style={{ position: "absolute", left: 0, top: 0, transform: `translate(${x}px, ${y}px)`, width, height: 14, background: mix(ROW_COL[n], C.green, merge), opacity: fadeIn(g, L("bars") + n * 0.12 - 0.1, 5),
              borderTopLeftRadius: n === 0 ? 9 : 9 * (1 - m), borderBottomLeftRadius: n === 0 ? 9 : 9 * (1 - m), borderTopRightRadius: n === 4 ? 9 : 9 * (1 - m), borderBottomRightRadius: n === 4 ? 9 : 9 * (1 - m) }} />
          </React.Fragment>
        );
      })}
      <div style={{ position: "absolute", left: 0, top: MY, width: w, height: 14, borderRadius: 9, background: C.n3, opacity: merge, zIndex: -1 }} />
      <div style={{ position: "absolute", left: (w * 60) / 135 - 2, top: MY - 14, width: 4, height: 42, borderRadius: 2, background: C.ink, transformOrigin: "50% 100%", transform: `scaleY(${tk(g, L("merge") + 0.45, 0.35)})` }} />
    </div>
  );
};

const Signal: React.FC<{ label: string; text: string; size: number; edge: string }> = ({ label, text, size, edge }) => (
  <div style={{ minHeight: 100, boxSizing: "border-box", padding: "12px 20px", borderRadius: 12, background: C.n2, border: `1px solid ${C.rule}`, borderLeft: `4px solid ${edge}` }}>
    <Label size={24} color={C.ink3}>{label}</Label>
    <div style={{ fontFamily: F.ui, fontWeight: 600, fontSize: size, color: C.ink, lineHeight: 1.2, marginTop: 4 }}>{text}</div>
  </div>
);

/** The two reasons: they fly out of Fernhollow's block into the card on "reason", then dock at the top of the draft. */
const Signals: React.FC<{ g: number; w: number; box: { x: number; y: number }; pin: [number, number] }> = ({ g, w, box, pin }) => {
  const m = tk(g, L("draft") + 0.3, 0.45, MOVE);
  const dim = tk(g, L("approve"), 0.4);
  const fly = (at: string, slot: { x: number; y: number; w: number; h: number }, n: number) => {
    const k = tk(g, L(at), 0.55, ARRIVE);
    const px = pin[0] - box.x - PAD, py = pin[1] - box.y - PAD;
    const from = n === 1 ? { x: slot.x, y: slot.y + 140 } : { x: px - slot.w * 0.1, y: py };
    return { x: lerp(from.x, slot.x, k), y: lerp(from.y, slot.y, k), s: lerp(n === 1 ? 0.9 : 0.2, 1, k), o: fadeIn(g, L(at), 5), n };
  };
  // sideways first (the two make room for each other), then up to the top of the draft: they never overlap
  const mx = tk(g, L("draft") + 0.05, 0.35, MOVE), my = tk(g, L("draft") + 0.3, 0.45, MOVE);
  const s1 = { x: 0, y: lerp(150, 0, my), w: lerp(w, w / 2 - 8, mx), h: 0 };
  const s2 = { x: lerp(0, w / 2 + 8, mx), y: lerp(286, 0, my), w: lerp(w, w / 2 - 8, mx), h: 0 };
  const a = fly("reason", s1, 0), b = fly("reason2", s2, 1);
  const size = lerp(40, 28, m);
  const edge = mix(C.orange, C.ink3, dim);
  return (
    <>
      {[[a, s1, "Job post", "Hiring two pricing analysts"], [b, s2, "Website watch", "Rates page unchanged since March 2025"]].map(([f, s, label, text], i) => {
        const ff = f as ReturnType<typeof fly>, ss = s as typeof s1;
        const k = tk(g, L(i ? "reason2" : "reason"), 0.55, ARRIVE);
        const x = k < 1 ? ff.x : ss.x, y = k < 1 ? ff.y : ss.y;
        return (
          <div key={i} style={{ position: "absolute", left: 0, top: 0, width: ss.w, opacity: ff.o, transformOrigin: "0 0", transform: `translate(${x}px, ${y}px) scale(${ff.s})` }}>
            <Signal label={label as string} text={text as string} size={size} edge={edge} />
          </div>
        );
      })}
    </>
  );
};

const EmailParts: React.FC<{ g: number; w: number }> = ({ g, w }) => {
  const start = L("subject");
  if (g / 30 < start - 0.05) return null;
  const t = g / 30;
  const row = (at: number) => ({ opacity: fadeIn(g, at, 6), transform: `translateY(${(1 - tk(g, at, 0.4)) * 12}px)` });
  const typed = Math.floor(clamp01((t - L("generic")) / 0.7) * GENERIC.length);
  const strike = tk(g, L("strike"), 0.35, MOVE);
  const dim = tk(g, L("approve"), 0.4);
  const words = PERSONAL.split(" ");
  const bar = tk(g, L("approve"), 0.45);
  const clicked = t >= L("click");
  const press = clicked ? 1 - 0.05 * Math.sin(Math.PI * clamp01((t - L("click")) / 0.16)) : 1;
  const roll = tk(g, L("click") + 0.1, 0.3, MOVE);               // the button rolls to the stamp; the label rolls too
  const accent = mix(C.orange, C.ink3, dim);
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 156, display: "flex", alignItems: "baseline", gap: 16, ...row(L("subject")) }}>
        <Label size={26} color={C.ink3}>Subject</Label>
        <span style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 40, color: C.ink, letterSpacing: "-0.015em" }}>Last year's lanes</span>
        <span style={{ marginLeft: "auto", fontFamily: F.ui, fontWeight: 600, fontSize: 26, color: C.ink2, border: `1px solid ${C.ruleStrong}`, borderRadius: 999, padding: "4px 16px", whiteSpace: "nowrap" }}>Edited by our team</span>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 220, height: 1, background: C.rule, ...row(L("subject")) }} />
      <div style={{ position: "absolute", left: 0, width: w, top: 238, fontFamily: F.ui, fontWeight: 500, fontSize: 36, lineHeight: 1.34, color: C.ink, opacity: lerp(1, 0.3, dim) }}>
        <div style={row(L("subject") + 0.2)}>Hi Sofia,</div>
        <div style={{ position: "relative", minHeight: 98, color: mix(C.ink, C.ink3, strike) }}>
          {GENERIC.slice(0, typed)}
          {/* the strike: a line-through in the text's own colour, wiped across (the site's) */}
          <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 ${100 - strike * 100}% 0 0)`, color: "transparent", textDecoration: "line-through", textDecorationColor: C.ink2, textDecorationThickness: 3 }}>{GENERIC}</div>
        </div>
        <div style={{ marginTop: 2 }}>
          {words.map((wd, i) => {
            const at = L("personal") + i * 0.055;
            const k = tk(g, at, 0.22);
            const u = tk(g, at + 0.12, 0.18, MOVE);
            return (
              <span key={i} style={{ position: "relative", display: "inline-block", marginRight: "0.26em", opacity: fadeIn(g, at, 4), transform: `translateY(${(1 - k) * 8}px)` }}>
                {wd}
                <span style={{ position: "absolute", left: 0, right: i === words.length - 1 ? 0 : "-0.26em", bottom: 1, height: 3, background: accent, opacity: 0.65, transformOrigin: "0 50%", transform: `scaleX(${u})` }} />
              </span>
            );
          })}
        </div>
        <div style={{ marginTop: 10, fontSize: 32, color: C.ink2, ...row(L("ask")) }}>{ASK}</div>
        <div style={{ marginTop: 6, fontSize: 32, color: C.ink2, ...row(L("ask") + 0.15) }}>Anna</div>
      </div>
      {/* the approval bar: the viewer's one click */}
      <div style={{ position: "absolute", left: -PAD, right: -PAD, bottom: -PAD, height: 150, borderTop: `1px solid ${C.rule}`, background: C.n2, borderRadius: "0 0 20px 20px",
        opacity: fadeIn(g, L("approve"), 6), transform: `translateY(${(1 - bar) * 30}px)`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: `0 ${PAD}px`, gap: 18 }}>
        <div style={{ position: "relative", height: 84, width: 270, overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 0, top: 0, width: 270, height: 84, display: "flex", alignItems: "center", fontFamily: F.ui, fontWeight: 500, fontSize: 27, lineHeight: 1.3, color: C.ink2, transform: `translateY(${-roll * 84}px)` }}>
            This email is waiting for your approval</div>
          <div style={{ position: "absolute", left: 0, top: 0, height: 84, display: "flex", alignItems: "center", gap: 10, fontFamily: F.ui, fontWeight: 600, fontSize: 27, color: C.ink, lineHeight: 1.25, transform: `translateY(${(1 - roll) * 84}px)` }}>
            <Check size={28} /><span>Sent from<br />your mailbox</span></div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {["Rewrite", "Reject"].map((b) => (
            <span key={b} style={{ height: 64, padding: "0 16px", borderRadius: 12, border: `1px solid ${C.ruleStrong}`, display: "inline-flex", alignItems: "center", fontFamily: F.ui, fontWeight: 600, fontSize: 26, color: C.ink2, opacity: 1 - roll * 0.6 }}>{b}</span>
          ))}
          <div style={{ position: "relative", width: 300, height: 96, overflow: "hidden", borderRadius: 16 }}>
            <div data-probe="approve-btn" style={{ position: "absolute", inset: 0, borderRadius: 14, background: C.orange, display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: F.ui, fontWeight: 600, fontSize: 36, color: C.night, transform: `translateY(${-roll * 96}px) scale(${press})` }}>Approve &amp; send</div>
            <div style={{ position: "absolute", inset: 0, borderRadius: 14, background: C.n3, border: `1px solid ${C.ruleStrong}`, display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
              fontFamily: F.ui, fontWeight: 600, fontSize: 36, color: C.ink, transform: `translateY(${(1 - roll) * 96}px)` }}><Check size={32} color={C.ink} /> Approved</div>
          </div>
        </div>
      </div>
    </div>
  );
};

/** The lead card: unfolds out of Fernhollow's pin, turns into the draft at the close framing, and folds into the
 *  orange dot that is the email leaving the viewer's block. `home` is where the email's route starts. */
export const LeadCard: React.FC<{ g: number; pin: [number, number]; home: [number, number] }> = ({ g, pin, home }) => {
  const t = g / 30;
  if (t < L("card") - 0.05 || t >= L("send")) return null;
  const box = cardBox(g);
  const kIn = tk(g, L("card"), 0.7, UI);
  const fold = cos01((t - L("fold")) / (L("send") - L("fold")));   // the whole card closes into a dot at home
  const ox = (fold > 0 ? home[0] : pin[0]) - box.x, oy = (fold > 0 ? home[1] : pin[1]) - box.y;
  const s = fold > 0 ? lerp(1, 0.024, fold) : lerp(0.15, 1, kIn);
  const content = fold > 0 ? clamp01((s - 0.2) / 0.3) : 1;
  const tint = fold > 0 ? clamp01((0.45 - s) / 0.3) : 0;
  const w = box.w - 2 * PAD;
  return (
    <div data-probe="lead-card" style={{ position: "absolute", left: box.x, top: box.y, width: box.w, height: box.h, transformOrigin: `${ox}px ${oy}px`, transform: `scale(${s})`,
      opacity: fadeIn(g, L("card"), 5), background: mix(C.n1, C.orange, tint), border: `1px solid ${C.rule}`, borderRadius: lerp(20, box.w / 2, clamp01((fold - 0.6) / 0.4)),
      boxShadow: fold > 0 ? undefined : `${SHADOW.float}, ${SHADOW.edge}`, willChange: "transform" }}>
      <div style={{ position: "absolute", left: PAD, top: PAD, width: w, bottom: PAD, opacity: content }}>
        <ScoreParts g={g} w={w} />
        <Signals g={g} w={w} box={box} pin={pin} />
        <EmailParts g={g} w={w} />
      </div>
    </div>
  );
};

// ---------------------------------------------------------------- the cursor (the viewer's one click)
export const Cursor: React.FC<{ g: number }> = ({ g }) => {
  const t = g / 30;
  if (t < L("cursor") || t > L("fold")) return null;
  const box = cardBox(g);
  const target: [number, number] = [box.x + box.w - PAD - 150 + 20, box.y + box.h - 75 + 10];
  const m = tk(g, L("cursor"), 0.5, ARRIVE);
  const leave = tk(g, L("click") + 0.45, 0.35, DEPART);
  const x = lerp(1980, target[0], m) + leave * 180, y = lerp(1120, target[1], m) + leave * 140;
  const press = 1 - 0.12 * Math.sin(Math.PI * clamp01((t - L("click")) / 0.16));
  const ring = clamp01((t - L("click")) / 0.35);
  return (
    <>
    {ring > 0 && ring < 1 && <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}><circle cx={target[0]} cy={target[1]} r={10 + 80 * ARRIVE(ring)} fill="none" stroke={C.orange} strokeWidth={3} opacity={1 - ring} /></svg>}
    <svg data-probe="cursor" width={61} height={72} viewBox="0 0 22 26" style={{ position: "absolute", left: 0, top: 0, transform: `translate(${x}px, ${y}px) scale(${press})`, transformOrigin: "0 0", opacity: 1 - leave, overflow: "visible" }}>
      <path d="M2 1.5 L2 20 L7 15.6 L10.4 23.4 L13.6 22 L10.3 14.4 L17 14.4 Z" fill={C.ink} stroke={C.night} strokeWidth={1.4} strokeLinejoin="round" />
    </svg>
    </>
  );
};

// ---------------------------------------------------------------- the reply, and the answer drafted
const ANSWER_A = "Great, Marta. I will send an invite for ";
const ANSWER_B = "Thursday at 10:00";
const ANSWER_C = ".";
export const REPLY = { x: 1100, y: 104, w: 720, h: 350 };
/** Where "Thursday at 10:00" sits in the reply card (screen), for the pill that flies to the week. */
export const answerSpot = (): [number, number] => [REPLY.x + 36 + 300, REPLY.y + 270];
export const Reply: React.FC<{ g: number; pin: [number, number] }> = ({ g, pin }) => {
  const t = g / 30;
  if (t < L("bubble") - 0.05 || t > L("fly") + 0.65) return null;
  const kIn = tk(g, L("bubble"), 0.6, UI);
  const out = cos01((t - L("fly") - 0.2) / 0.4);                  // folds back into Quillmoor's pin once the pill has left
  const ox = pin[0] - REPLY.x, oy = pin[1] - REPLY.y;
  const ans = tk(g, L("answer"), 0.4);
  const full = ANSWER_A + ANSWER_B + ANSWER_C;
  const typed = Math.floor(clamp01((t - L("answer") - 0.15) / 0.8) * full.length);
  const a = Math.min(typed, ANSWER_A.length), b = Math.max(0, Math.min(typed - ANSWER_A.length, ANSWER_B.length));
  const lifted = t >= L("fly");
  return (
    <>
      <div data-probe="reply" style={{ position: "absolute", left: REPLY.x, top: REPLY.y, width: REPLY.w, padding: 30, boxSizing: "border-box", borderRadius: 20, background: C.n1,
        border: `1px solid ${C.rule}`, boxShadow: `${SHADOW.float}, ${SHADOW.edge}`, transformOrigin: `${ox}px ${oy}px`, transform: `scale(${lerp(0.15, 1, kIn) * lerp(1, 0.05, out)})`,
        opacity: fadeIn(g, L("bubble"), 5) * (1 - clamp01(out * 1.4)) }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Label size={26} color={C.ink2}>Marta Vogel · Wed 14:03</Label>
          <span style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 26, color: C.ink, border: `1px solid ${C.ruleStrong}`, borderRadius: 999, padding: "3px 14px" }}>Demo workspace</span>
        </div>
        <div style={{ marginTop: 14, display: "inline-block", padding: "16px 24px", borderRadius: 18, background: C.n3, fontFamily: F.ui, fontWeight: 600, fontSize: 44, color: C.ink, letterSpacing: "-0.015em" }}>
          Good timing. Thursday works.</div>
        <div style={{ marginTop: 18, opacity: fadeIn(g, L("answer"), 6), transform: `translateY(${(1 - ans) * 12}px)` }}>
          <Label size={24} color={C.ink3}>Suggested reply · edit anything before sending</Label>
          <div style={{ marginTop: 6, fontFamily: F.ui, fontWeight: 500, fontSize: 32, color: C.ink2, lineHeight: 1.35, minHeight: 86 }}>
            {ANSWER_A.slice(0, a)}
            <span style={{ color: C.ink, borderBottom: `3px solid ${C.green}`, opacity: lifted ? 0.25 : 1 }}>{ANSWER_B.slice(0, b)}</span>
            {typed > ANSWER_A.length + ANSWER_B.length && ANSWER_C}
          </div>
        </div>
      </div>
    </>
  );
};

// ---------------------------------------------------------------- the week the meeting lands in
export const WEEK = { w: 968, h: 400, gut: 110, col: 270, row: 130, top: 116 };
export const weekBox = (home: [number, number]) => ({ x: Math.max(110, home[0] - WEEK.w - 110), y: 476 });
export const slotBox = (home: [number, number]) => {
  const b = weekBox(home);
  return { x: b.x + 24 + WEEK.gut + 1 * WEEK.col + 6, y: b.y + WEEK.top + 6, w: WEEK.col - 12, h: WEEK.row - 12 };
};
const Meeting: React.FC<{ w: number; h: number; name: number }> = ({ w, h, name }) => (
  <div style={{ width: w, height: h, boxSizing: "border-box", borderRadius: 12, background: C.greenSoft, border: `1px solid ${C.green}`, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "0 14px" }}>
    <span style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: F.ui, fontWeight: 600, fontSize: 44, color: C.green, transform: `translateY(${(1 - name) * 22}px)` }}><Check size={36} />10:00</span>
    <span style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 36, color: C.ink, whiteSpace: "nowrap", opacity: name, height: 44 * name }}>Marta Vogel</span>
  </div>
);
export const Week: React.FC<{ g: number; home: [number, number] }> = ({ g, home }) => {
  const t = g / 30;
  if (t < L("week") - 0.05 || t > L("weekOut") + 0.45) return null;
  const b = weekBox(home);
  const kIn = tk(g, L("week"), 0.6, UI);
  const out = cos01((t - L("weekOut")) / 0.4);
  const landed = t >= L("booked");
  const days = ["Wed", "Thu", "Fri"];
  const ox = home[0] - b.x, oy = home[1] - b.y;
  const s = slotBox(home);
  return (
    <div data-probe="week" style={{ position: "absolute", left: b.x, top: b.y, width: WEEK.w, height: WEEK.h, borderRadius: 20, background: C.n1, border: `1px solid ${C.rule}`,
      boxShadow: `${SHADOW.float}, ${SHADOW.edge}`, transformOrigin: `${ox}px ${oy}px`, transform: `scale(${lerp(0.12, 1, kIn) * lerp(1, 0.06, out)})`,
      opacity: fadeIn(g, L("week"), 5) * (1 - clamp01(out * 1.4)) }}>
      <div style={{ position: "absolute", left: 24, right: 24, top: 22, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Label size={32} color={C.ink2} weight={600}>Your calendar · this week</Label>
        <span style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 26, color: C.ink, border: `1px solid ${C.ruleStrong}`, borderRadius: 999, padding: "3px 14px" }}>Demo workspace</span>
      </div>
      {days.map((d, i) => (
        <div key={d} style={{ position: "absolute", left: 24 + WEEK.gut + i * WEEK.col, top: 70, width: WEEK.col, textAlign: "center", fontFamily: F.ui, fontWeight: 600, fontSize: 36, color: i === 1 ? C.ink : C.ink3 }}>{d}</div>
      ))}
      {["10:00", "11:00"].map((h, r) => (
        <React.Fragment key={h}>
          <div style={{ position: "absolute", left: 24, top: WEEK.top + r * WEEK.row + 12, fontFamily: F.mono, fontSize: 30, color: C.ink3 }}>{h}</div>
          <div style={{ position: "absolute", left: 24 + WEEK.gut, right: 24, top: WEEK.top + r * WEEK.row, height: 1, background: C.rule }} />
        </React.Fragment>
      ))}
      {days.map((d, i) => <div key={"c" + d} style={{ position: "absolute", left: 24 + WEEK.gut + i * WEEK.col, top: WEEK.top, width: 1, height: 2 * WEEK.row, background: i ? C.rule : "transparent" }} />)}
      {landed && <div style={{ position: "absolute", left: s.x - b.x, top: s.y - b.y }}><Meeting w={s.w} h={s.h} name={tk(g, L("booked") + 0.05, 0.35)} /></div>}
    </div>
  );
};
/** "Thursday at 10:00" lifts off the suggested answer as a green pill and lands exactly on Thursday's 10:00 slot,
 *  growing into the meeting (drawn above the week). */
export const FlyPill: React.FC<{ g: number; home: [number, number] }> = ({ g, home }) => {
  const t = g / 30;
  if (t < L("fly") || t >= L("booked")) return null;
  const k = MOVE(clamp01((t - L("fly")) / (L("booked") - L("fly"))));
  const [ax, ay] = answerSpot(), s = slotBox(home);
  const label = k < 0.25 ? "Thursday at 10:00" : "10:00";
  const w = Math.max(k < 0.25 ? 330 : 190, lerp(330, s.w, k)), h = lerp(56, s.h, k);
  const x = lerp(ax, s.x + s.w / 2, k) - w / 2, y = lerp(ay, s.y + s.h / 2, k) - h / 2;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, transform: `translate(${x}px, ${y}px)`, width: w, height: h, borderRadius: lerp(999, 12, k), background: C.greenSoft, border: `1px solid ${C.green}`,
      display: "flex", alignItems: "center", justifyContent: "center", gap: 10, fontFamily: F.ui, fontWeight: 600, fontSize: lerp(30, 44, k), color: C.green, whiteSpace: "nowrap" }}>
      <Check size={lerp(26, 36, k)} />{label}
    </div>
  );
};

// ---------------------------------------------------------------- the finale: the loop lifts off as the 8, then the logo
const ROT = (x: number, y: number, a: number): [number, number] => [x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a)];
const STROKE_RATIO = 97.2 / 720;                      // the mark's stroke against the loop's width
const S8 = 330 / 720;                                 // the upright 8: the loop's 720 units become 330 px of height
const P8 = { x: 300, y: 470 };                        // the 8's centre in the stat
const SL = 104 / 372;                                 // the lockup: the mark (with its stroke) 104 px tall
const LOCK = { x: 960 - 1018.2 * SL, y: 330 };        // the loop's centre in the lockup (the logo's own grid)
const shape = (cx: number, cy: number, s: number, a: number) => LOOP_PTS.map((p) => { const [x, y] = ROT((p.x - 512) * s, (p.y - 512) * s, a); return [cx + x, cy + y] as [number, number]; });
const pathOf = (pts: [number, number][]) => "M" + pts.map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join("L");

export const Finale: React.FC<{ g: number }> = ({ g }) => {
  const t = g / 30;
  if (t < L("stat") - 0.05) return null;
  const lift = MOVE(clamp01((t - L("stat")) / 1.1));
  const turn = MOVE(clamp01((t - L("turn")) / 0.9));
  // the loop: from the ground (projected) to the upright 8, then turning into the lockup's ∞
  let pts: [number, number][];
  if (turn <= 0) {
    const ground = groundLoop(g), up = shape(P8.x, P8.y, S8, Math.PI / 2);
    pts = ground.map((p, i) => [lerp(p[0], up[i][0], lift), lerp(p[1], up[i][1], lift)]);
  } else {
    pts = shape(lerp(P8.x, LOCK.x, turn), lerp(P8.y, LOCK.y, turn), lerp(S8, SL, turn), lerp(Math.PI / 2, 0, turn));
  }
  const width = 720 * lerp(lerp(0.004, S8, lift), SL, turn) * STROKE_RATIO;
  const half = Math.floor(pts.length / 2);
  const colA = mix(C.orange, C.ink, lift), colB = mix(C.green, C.ink, lift);
  // % · label · source
  const pct = tk(g, L("stat") + 1.0, 0.45), lab = tk(g, L("stat") + 1.3, 0.45), src = tk(g, L("stat") + 1.6, 0.45);
  const out = tk(g, L("turn") - 0.1, 0.45, MOVE);
  // the end card
  const word = tk(g, L("word"), 0.6, ARRIVE);
  const line = "Your distribution, fixed.".split(" ");
  const cta = tk(g, L("cta"), 0.5), faces = tk(g, L("faces"), 0.5);
  return (
    <>
      <svg data-probe="mark" width={1920} height={1080} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        <path d={pathOf(pts.slice(0, half + 1))} fill="none" stroke={colA} strokeWidth={Math.max(2, width)} strokeLinecap="round" strokeLinejoin="round" />
        <path d={pathOf(pts.slice(half))} fill="none" stroke={colB} strokeWidth={Math.max(2, width)} strokeLinecap="round" strokeLinejoin="round" />

      </svg>
      <div style={{ position: "absolute", left: 0, top: 0, transform: `translate(${P8.x + 105 + out * 90}px, ${P8.y - 236 + (1 - pct) * 30}px)`, opacity: fadeIn(g, L("stat") + 1.0, 6) * (1 - out),
        fontFamily: F.display, fontWeight: 600, fontSize: 420, lineHeight: 1, letterSpacing: "-0.04em", color: C.orange }}>%</div>
      <div style={{ position: "absolute", left: 160, top: 690, opacity: fadeIn(g, L("stat") + 1.3, 6) * (1 - out), transform: `translateY(${(1 - lab) * 16 + out * 24}px)`,
        fontFamily: F.display, fontWeight: 600, fontSize: 72, letterSpacing: "-0.03em", color: C.ink }}>reply rate, first month of sending</div>
      <div style={{ position: "absolute", left: 160, top: 800, opacity: fadeIn(g, L("stat") + 1.6, 6) * (1 - out), transform: `translateY(${(1 - src) * 12 + out * 24}px)`, display: "flex", flexDirection: "column", gap: 12 }}>
        <span style={{ alignSelf: "flex-start", display: "inline-flex", alignItems: "center", gap: 12, padding: "6px 16px", borderRadius: 999, border: `1px solid ${C.ruleStrong}`, fontFamily: F.ui, fontWeight: 600, fontSize: 36, color: C.ink }}>
          <span style={{ width: 16, height: 16, borderRadius: 9, border: `2px solid ${C.orange}`, display: "inline-block" }} />Real · anonymised · campaign report</span>
        <Label size={36} color={C.ink2}>A B2B services company · replies over 300 contacts · 12 Aug to 12 Sep 2026</Label>
      </div>
      {/* the wordmark slides out from behind the mark */}
      {word > 0 && (
        <div style={{ position: "absolute", left: LOCK.x + 612.2 * SL, top: LOCK.y - 186 * SL, width: 1833 * SL, height: 372 * SL, overflow: "hidden" }}>
          <Img src={staticFile("img/clearscaler-wordmark-white.svg")} style={{ width: 1833 * SL, height: 372 * SL, transform: `translateX(${(1 - word) * -70}px)`, opacity: fadeIn(g, L("word"), 6) }} />
        </div>
      )}
      <div style={{ position: "absolute", left: 0, right: 0, top: 440, display: "flex", justifyContent: "center", gap: "0.24em", fontFamily: F.display, fontWeight: 600, fontSize: 112, letterSpacing: "-0.045em", lineHeight: 1 }}>
        {line.map((w, i) => {
          const tw = L("line") + i * 0.16;
          const appear = clamp01((t - tw + 0.1) / 0.1), bright = ARRIVE(clamp01((t - tw) / 0.26));
          return <span key={i} style={{ opacity: appear * lerp(0.3, 1, bright), transform: `translateY(${(1 - appear) * 12}px)`, color: i === 2 ? mix(C.ink, C.orange, bright) : C.ink }}>{w}</span>;
        })}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 588, textAlign: "center", opacity: fadeIn(g, L("sub"), 6), transform: `translateY(${(1 - tk(g, L("sub"), 0.5)) * 12}px)`,
        fontFamily: F.ui, fontWeight: 500, fontSize: 44, color: C.ink2, letterSpacing: "-0.01em" }}>Outbound, built and run for you.</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 690, display: "flex", justifyContent: "center", alignItems: "center", gap: 40 }}>
        <div data-probe="cta" style={{ height: 96, padding: "0 40px 0 44px", borderRadius: 16, background: C.orange, display: "flex", alignItems: "center", gap: 16, opacity: fadeIn(g, L("cta"), 6),
          transform: `translateY(${(1 - cta) * 22}px)`, fontFamily: F.ui, fontWeight: 600, fontSize: 44, color: C.night }}>
          Book a call
          <svg width={28} height={28} viewBox="0 0 16 16" fill="none"><path d="M6 3.5 10.5 8 6 12.5" stroke={C.night} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 20, opacity: fadeIn(g, L("faces"), 6), transform: `translateY(${(1 - faces) * 16}px)` }}>
          <div style={{ display: "flex" }}>
            <Img src={staticFile("img/magnus-avatar-128.png")} style={{ width: 96, height: 96, borderRadius: 99, border: `3px solid ${C.night}` }} />
            <Img src={staticFile("img/kian-avatar-128.png")} style={{ width: 96, height: 96, borderRadius: 99, border: `3px solid ${C.night}`, marginLeft: -22 }} />
          </div>
          <span style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 36, color: C.ink }}>30 minutes with Magnus or Kian</span>
        </div>
      </div>
    </>
  );
};
void Mono; void Pill;
