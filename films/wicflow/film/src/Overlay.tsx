// Everything that faces the camera: the site's "AI at work" chip, the assistant bubble, the cards that grow out of the
// world's objects (message, reply, CRM record, counter), the tool badges, the bubbles and booked badges, the tags.
// Positions come from projecting world points, so a card stays attached to the block it grew out of.
import React from "react";
import { interpolate } from "remotion";
import { T } from "./clock";
import { C, F, R, SHADOW, clamp01, lerp, rgba } from "./lib";
import { proj } from "./iso";
import { EASE, Flip, Typed } from "./kinetic";
import { ANNA, CRM, TEAM, TOOL_TILES, TO_ANNA, VIEW, along } from "./map";
import { ARRIVE, DEPART, MOVE, dim, dot, k, roofXY, s } from "./scene";
import { Bubble, CrmCard, Counter } from "./cards";
import { Icon, LiveDot, Pill, ToolLogo, TOOLS } from "./ui";
import { COPIES } from "./World";

const scr = (g: number, x: number, y: number, z = 0) => proj(VIEW(g), x, y, z);
const pop = (u: number) => (u <= 0 ? 0 : EASE.back(clamp01(u)) * 0.92 + 0.08 * clamp01(u)); // ≤8% overshoot

/** The site's AI-at-work chip: a pill on "systems" that grows into the card on "prospects"; one row at a time drops through. */
const ROWS: { at: string; icon: string; title: string; sub?: string; time: string; dark?: boolean }[] = [
  { at: "lock", icon: "target", title: "Found a company that fits", sub: "Building firm · 40 staff · Tampere", time: "09:02" },
  { at: "personal", icon: "pencil", title: "Wrote the first message", sub: "A relevant, personal message", time: "09:03" },
  { at: "approve", icon: "check", title: "Your team approved it", sub: "Sent after a quick check", time: "09:14" },
  { at: "reply", icon: "reply", title: "Anna replied", sub: "“Sounds useful. Thursday at 10?”", time: "11:40" },
  { at: "customers-0.1", icon: "calendar", title: "Meeting booked", sub: "Thursday 10:00, in your calendar", time: "11:41", dark: true },
];
const Chip: React.FC<{ g: number }> = ({ g }) => {
  const t = s(g);
  const inU = k(g, "chip", 0.4);
  if (inU <= 0) return null;
  const grow = k(g, "lock", 0.45, MOVE) * (1 - k(g, "capOut5", 0.4, MOVE)) + k(g, "customers-0.35", 0.4, MOVE) * (1 - k(g, "gather", 0.3, MOVE));
  const leave = k(g, "gather+0.25", 0.3, DEPART);
  const back = 0;
  const w = lerp(300, 660, grow), h = lerp(64, 214, grow);
  // the current row and the one before it, for the drop-through (A2): 6 f out, 6 f in
  let cur = -1;
  ROWS.forEach((r, i) => { if (t >= T.s(r.at)) cur = i; });
  const rowEl = (i: number, y: number, o: number) => {
    const r = ROWS[i];
    return (
      <div key={i} style={{ position: "absolute", left: 26, right: 26, top: 80, height: 110, display: "flex", alignItems: "center", gap: 18, transform: `translateY(${y}px)`, opacity: o }}>
        <div style={{ width: 58, height: 58, borderRadius: "50%", flex: "none", display: "flex", alignItems: "center", justifyContent: "center", background: r.dark ? C.inkStrong : C.paper2, boxShadow: r.dark ? undefined : `inset 0 0 0 1.5px ${C.line}` }}>
          <Icon name={r.icon} size={27} color={r.dark ? "#fff" : C.ink} stroke={1.7} /></div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: "-0.01em", whiteSpace: "nowrap" }}>{r.title}</div>
          {r.sub && <div style={{ fontSize: 23, color: C.muted, marginTop: 3, whiteSpace: "nowrap" }}>{r.sub}</div>}
        </div>
        <div style={{ fontSize: 21, color: C.muted, fontVariantNumeric: "tabular-nums", alignSelf: "flex-start", marginTop: 14 }}>{r.time}</div>
      </div>
    );
  };
  const rows: React.ReactNode[] = [];
  if (cur >= 0 && grow > 0.5) {
    const a = T.s(ROWS[cur].at), d = clamp01((t - a) / 0.4);
    rows.push(rowEl(cur, (1 - EASE.whipOut(d)) * -60, clamp01(d * 2.5)));
    if (cur > 0 && d < 1) rows.push(rowEl(cur - 1, EASE.whipIn(clamp01(d * 2)) * 60, 1 - clamp01(d * 2.5)));
  }
  return (
    <div data-probe="chip" style={{ position: "absolute", left: 72, top: 64, width: w, height: h, borderRadius: lerp(32, R.card, grow), background: C.paper, overflow: "hidden",
      boxShadow: `${SHADOW.card}, ${SHADOW.edge}`, fontFamily: F.ui, color: C.ink, opacity: clamp01(inU * 2) * (1 - leave) * (1 - 0.45 * back),
      transform: `translateY(${(1 - inU) * -40 - leave * 60}px) scale(${1 - 0.04 * back})`, transformOrigin: "0 0" }}>
      <div style={{ position: "absolute", left: 26, top: 0, height: 64, right: 24, display: "flex", alignItems: "center", gap: 14, fontSize: 26, fontWeight: 700 }}>
        <LiveDot g={g} size={13} /><span style={{ whiteSpace: "nowrap" }}>AI at work</span><span style={{ flex: 1 }} />
        {grow > 0.3 && <span style={{ fontSize: 19, fontWeight: 600, color: C.muted, opacity: grow, whiteSpace: "nowrap" }}>Example workflow</span>}
        <svg width={16} height={16} viewBox="0 0 14 14" style={{ marginLeft: 14 }}><path d="M3 2h3v10H3zM8 2h3v10H8z" fill={C.ink} /></svg>
      </div>
      <div style={{ position: "absolute", left: 24, right: 24, top: 64, height: 1, background: C.line2, opacity: grow }} />
      {rows}
    </div>
  );
};

/** The message to Anna, typed; the reason marked in AI blue; the team's "Approved" pill; folds into the dot. */
const PIECES: { t: string; mark?: boolean }[] = [{ t: "Hi " }, { t: "Anna", mark: true }, { t: ", I saw you’re " }, { t: "hiring two salespeople", mark: true }, { t: "…" }];
const Message: React.FC<{ g: number }> = ({ g }) => {
  const t = s(g);
  const hinge = k(g, "card", 0.45);
  if (hinge <= 0 || t > T.s("send") + 0.3) return null;
  const fold = k(g, "send", 0.27, DEPART);
  const [rx, ry] = roofXY(g);
  const typedN = Math.max(0, (t - T.s("card") - 0.12) * 40);
  let n = 0;
  const mk = k(g, "personal", 0.3, MOVE);
  const appr = k(g, "approve", 0.4);
  const W = 720, left = 250, top = 300;
  return (
    <div style={{ position: "absolute", left, top, width: W, transformOrigin: `${rx - left}px ${ry - top}px`,
      transform: `perspective(1400px) rotateX(${(1 - hinge) * 70}deg) scale(${1 - 0.92 * fold})`, opacity: clamp01(hinge * 3) * (1 - clamp01((fold - 0.6) / 0.4)) }}>
      <div style={{ padding: "26px 34px 34px", background: C.paper, borderRadius: R.card, boxShadow: `${SHADOW.float}, ${SHADOW.edge}`, fontFamily: F.ui, color: C.ink }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 24, color: C.muted, fontWeight: 700 }}>
          <Icon name="pencil" size={24} color={C.blue} stroke={1.9} />New message · to Anna
        </div>
        <div style={{ height: 1, background: C.line2, margin: "18px 0 22px" }} />
        <div style={{ fontSize: 42, lineHeight: 1.28, fontWeight: 700, letterSpacing: "-0.02em" }}>
          {PIECES.map((p, i) => {
            const vis = p.t.slice(0, Math.max(0, Math.floor(typedN - n)));
            n += p.t.length;
            return (
              <span key={i} style={{ position: "relative", color: p.mark && mk > 0 ? C.blue : C.ink }}>
                {vis}
                {p.mark && vis.length === p.t.length && <span style={{ position: "absolute", left: 0, right: 0, bottom: -2, height: 5, borderRadius: 3, background: C.blue, transformOrigin: "0 50%", transform: `scaleX(${mk})` }} />}
              </span>
            );
          })}
          {typedN < 60 && <span style={{ display: "inline-block", width: 3, height: 40, background: C.ink, verticalAlign: -6, marginLeft: 2, opacity: Math.floor(t * 4) % 2 ? 1 : 0.2 }} />}
        </div>
      </div>
      {appr > 0 && (
        <div style={{ position: "absolute", right: 26, top: -26, transform: `scale(${pop(appr)})`, transformOrigin: "80% 50%" }}>
          <Pill size={26}><Icon name="check" size={26} color="#fff" stroke={2.2} />Approved</Pill>
        </div>
      )}
    </div>
  );
};

/** The assistant bubble (P2): small, off to the side, the dot as its avatar; it folds back into the dot on "but". */
const Assistant: React.FC<{ g: number }> = ({ g }) => {
  const u = k(g, "hop+0.13", 0.4, (x) => x);
  const fold = k(g, "strike", 0.27, DEPART);
  if (u <= 0 || fold >= 1) return null;
  const d = dot(g);
  const [x, y] = scr(g, d.x, d.y, d.z);
  const typing = Math.floor((s(g) - T.s("hop") - 0.4) / 0.18);
  return (
    <div style={{ position: "absolute", left: x + 30, top: y - 44, transformOrigin: "0 50%", transform: `scale(${pop(u) * (1 - fold)})`, opacity: 1 - fold }}>
      <div style={{ padding: "18px 26px", background: C.paper, borderRadius: 26, borderBottomLeftRadius: 8, boxShadow: `${SHADOW.card}, ${SHADOW.edge}`, fontFamily: F.ui, display: "flex", alignItems: "center", gap: 16 }}>
        <span style={{ fontSize: 30, fontWeight: 700, color: C.ink, whiteSpace: "nowrap" }}>How can I help?</span>
        <span style={{ display: "flex", gap: 6 }}>{[0, 1, 2].map((i) => <span key={i} style={{ width: 9, height: 9, borderRadius: 9, background: C.muted, opacity: typing >= 0 && typing % 3 === i ? 0.9 : 0.3 }} />)}</span>
      </div>
    </div>
  );
};

/** The black pill tag on the business ("Your business"), riding its roof. */
const BizTag: React.FC<{ g: number }> = ({ g }) => {
  const u = k(g, "tag", 0.4);
  const o = 1 - k(g, "capOut3", 0.3, DEPART);
  if (u <= 0 || o <= 0) return null;
  const [rx, ry] = roofXY(g);
  return (
    <div style={{ position: "absolute", left: rx, top: ry - 70 - 20 * (1 - u), transform: "translateX(-50%)", opacity: clamp01(u * 2) * o }}>
      <Pill size={24}>Your business</Pill>
    </div>
  );
};

/** The black pill tag on the team ("Your team", P2): the people the assistant only helps. */
const TeamTag: React.FC<{ g: number }> = ({ g }) => {
  const u = k(g, "w:team-0.13", 0.4);
  const o = 1 - k(g, "fwd", 0.3, DEPART);
  if (u <= 0 || o <= 0) return null;
  const [x, y] = scr(g, -430, 90, 120);
  return (
    <div style={{ position: "absolute", left: x, top: y - 100 - 20 * (1 - u), transform: "translateX(-50%)", opacity: clamp01(u * 2) * o }}>
      <Pill size={28}>Your team</Pill>
    </div>
  );
};

/** Anna's reply (P11), rising out of her company; it folds into the dot that carries it to the CRM (P12). */
const Reply: React.FC<{ g: number }> = ({ g }) => {
  const u = k(g, "reply", 0.4, (x) => x);
  const fold = k(g, "toCrm", 0.25, DEPART);
  if (u <= 0 || fold >= 1) return null;
  const [ax, ay] = scr(g, (ANNA.x0 + ANNA.x1) / 2, (ANNA.y0 + ANNA.y1) / 2, ANNA.h * 1.4);
  return (
    <div style={{ position: "absolute", left: ax - 40, top: ay - 150 + (1 - ARRIVE(u)) * 30, transformOrigin: "40px 140px", transform: `scale(${pop(u) * (1 - fold)})`, opacity: clamp01(u * 3) * (1 - fold) }}>
      <Bubble who="Anna replied" text="Sounds useful. Thursday at 10?" />
    </div>
  );
};

/** The CRM record (P12), hinging up out of the cabinet's top drawer; its status rolls on "updated". */
const Record: React.FC<{ g: number }> = ({ g }) => {
  const u = k(g, "drawer+0.1", 0.4);
  const fold = k(g, "drawerIn-0.05", 0.27, DEPART);
  if (u <= 0 || fold >= 1) return null;
  const [dx, dy] = scr(g, 40, CRM.y1 + 40, CRM.h * 0.8);
  const step = k(g, "updated", 0.33, EASE.lead);
  return (
    <div style={{ position: "absolute", left: 1130, top: 96, transformOrigin: `${dx - 1130}px ${dy - 96}px`, transform: `perspective(1400px) rotateX(${(1 - u) * -60}deg) scale(${(0.6 + 0.4 * ARRIVE(u)) * (1 - 0.9 * fold)})`, opacity: clamp01(u * 3) * (1 - fold) }}>
      <CrmCard g={g} step={step} tick={k(g, "updated+0.15", 0.3)} w={680} style={{ position: "relative" }} logo={<span style={{ display: "flex", gap: 12, alignItems: "center" }}><ToolLogo id="hubspot" size={30} /><ToolLogo id="pipedrive" size={30} /><ToolLogo id="salesforce" size={30} /></span>} />
    </div>
  );
};

/** The follow-up (P11): a small pill riding the second dot along the route, sent by itself. */
const FollowTag: React.FC<{ g: number }> = ({ g }) => {
  const u = k(g, "follow", 0.5, EASE.longS);
  const show = k(g, "follow-0.1", 0.2) * (1 - k(g, "follow+0.55", 0.2));
  if (show <= 0) return null;
  const [x, y] = scr(g, ...along(TO_ANNA, u), 0);
  return (
    <div style={{ position: "absolute", left: x + 18, top: y - 62, opacity: show }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 18px", borderRadius: 999, background: C.paper, boxShadow: `${SHADOW.card}, ${SHADOW.edge}`, fontFamily: F.ui, fontWeight: 700, fontSize: 26, color: C.blue, whiteSpace: "nowrap" }}>
        <Icon name="refresh" size={24} color={C.blue} stroke={2} />Follow-up
      </div>
    </div>
  );
};

/** The tool badges (P14): screen-facing, on their tiles, logos at 56 px; the team's own tools pop above the people. */
const Tools: React.FC<{ g: number }> = ({ g }) => {
  const t = s(g);
  const D = Math.max(dim(g), 0.62 * k(g, "dim", 0.4, MOVE));
  if (t >= T.s("blue") + 0.6) return null;
  const els: React.ReactNode[] = [];
  const passA = k(g, "already+0.3", 0.25) * (1 - k(g, "already+1.3", 0.4)), passB = k(g, "already+0.6", 0.25) * (1 - k(g, "already+1.5", 0.4));
  TOOL_TILES.forEach((tl) => {
    const u = k(g, `tools+${(tl.row * 0.33 + tl.col * 0.035).toFixed(3)}`, 0.4, (x) => x);
    if (u <= 0) return;
    const [x, y] = scr(g, (tl.x0 + tl.x1) / 2, (tl.y0 + tl.y1) / 2, 14);
    const ring = tl.id === "gmail" ? passA : tl.id === "hubspot" ? passB : 0;
    const w = TOOLS.find((q) => q.id === tl.id)!.w ?? 1;
    els.push(
      <div key={tl.id} style={{ position: "absolute", left: x - 44, top: y - 92, width: 88, height: 88, borderRadius: 20, background: C.paper, display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: `${SHADOW.card}, inset 0 0 0 ${1 + 2.5 * ring}px ${ring > 0 ? rgba(C.blue, ring) : "rgba(0,0,0,0.07)"}`, transform: `translateY(${(1 - ARRIVE(clamp01(u))) * 26}px) scale(${pop(u)})`, transformOrigin: "50% 100%", opacity: clamp01(u * 3) * (1 - D) }}>
        <ToolLogo id={tl.id} size={w > 1.4 ? 34 : w > 1.1 ? 44 : 56} />
      </div>
    );
  });
  // "already uses": the tools in the team's hands
  const mine = ["gmail", "hubspot", "slack"];
  TEAM.forEach(([px, py], i) => {
    const u = k(g, `already+${(i * 0.1).toFixed(2)}`, 0.4, (x) => x);
    const o = 1 - k(g, "capOut6", 0.3);
    if (u <= 0 || o <= 0) return;
    const [x, y] = scr(g, px, py, 90);
    els.push(
      <div key={`m${i}`} style={{ position: "absolute", left: x - 34, top: y - 78, width: 68, height: 68, borderRadius: 18, background: C.paper, display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: `${SHADOW.card}, ${SHADOW.edge}`, transform: `scale(${pop(u)})`, transformOrigin: "50% 100%", opacity: clamp01(u * 3) * o * (1 - D) }}>
        <ToolLogo id={mine[i]} size={40} />
      </div>
    );
  });
  return <>{els}</>;
};

/** Less manual work (P18): the site's own chain of repeated work ("Research → prepare a follow-up → update your CRM"),
 *  rising out of the desk; the dot ticks each step off and the card folds away. */
const STEPS = ["Research", "Prepare a follow-up", "Update your CRM"];
const Manual: React.FC<{ g: number }> = ({ g }) => {
  const u = k(g, "less-0.2", 0.4);
  const fold = k(g, "convos-0.35", 0.3, DEPART);
  if (u <= 0 || fold >= 1) return null;
  const [dx, dy] = scr(g, -285, 285, 40);
  return (
    <div style={{ position: "absolute", left: 120, top: 318, width: 520, transformOrigin: `${dx - 120}px ${dy - 318}px`, transform: `scale(${(0.55 + 0.45 * ARRIVE(u)) * (1 - 0.9 * fold)})`, opacity: clamp01(u * 3) * (1 - fold) }}>
      <div style={{ padding: "24px 30px 26px", background: C.paper, borderRadius: R.card, boxShadow: `${SHADOW.float}, ${SHADOW.edge}`, fontFamily: F.ui, color: C.ink }}>
        <div style={{ fontSize: 24, color: C.muted, fontWeight: 700 }}>Repeated work</div>
        <div style={{ height: 1, background: C.line2, margin: "16px 0 10px" }} />
        {STEPS.map((st, i) => {
          const done = k(g, `less+${(0.15 + i * 0.28).toFixed(2)}`, 0.3, EASE.lead);
          return (
            <div key={st} style={{ display: "flex", alignItems: "center", gap: 18, height: 64 }}>
              <span style={{ width: 40, height: 40, borderRadius: 12, flex: "none", display: "flex", alignItems: "center", justifyContent: "center", background: done > 0.5 ? C.blue : C.paper2,
                boxShadow: done > 0.5 ? undefined : `inset 0 0 0 2px ${C.line}`, transform: `scale(${1 + 0.12 * Math.sin(Math.PI * done)})` }}>
                {done > 0.5 && <Icon name="check" size={26} color="#fff" stroke={2.4} />}</span>
              <span style={{ position: "relative", fontSize: 34, fontWeight: 700, letterSpacing: "-0.015em", color: done > 0.5 ? C.muted : C.ink, whiteSpace: "nowrap" }}>
                {st}
                <span style={{ position: "absolute", left: -2, right: -2, top: "54%", height: 3, background: C.muted, transformOrigin: "0 50%", transform: `scaleX(${done})` }} />
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/** The pilot's tag (P15) and the measure (P16): the site's own counter, rolling 7 → 8 on "results". */
const Pilot: React.FC<{ g: number }> = ({ g }) => {
  const tag = k(g, "plot+0.25", 0.35) * (1 - k(g, "scale", 0.3, DEPART));
  const [px, py] = scr(g, ANNA.x0 - 30, ANNA.y1 + 30, 0);
  const cu = k(g, "measure", 0.45);
  const cf = k(g, "scale-0.15", 0.25, DEPART);
  const v = 7 + k(g, "results", 0.35, EASE.lead);
  const [ax, ay] = scr(g, (ANNA.x0 + ANNA.x1) / 2, (ANNA.y0 + ANNA.y1) / 2, ANNA.h * 1.4);
  return (
    <>
      {tag > 0 && <div style={{ position: "absolute", left: px - 60, top: py - 10, opacity: clamp01(tag * 2), transform: `translateY(${(1 - tag) * 16}px)` }}><Pill size={24}>Pilot</Pill></div>}
      {cu > 0 && cf < 1 && (
        <div style={{ position: "absolute", left: 1210, top: 110, transformOrigin: `${ax - 1210}px ${ay - 110}px`, transform: `scale(${(0.5 + 0.5 * ARRIVE(cu)) * (1 - 0.95 * cf)})`, opacity: clamp01(cu * 3) * (1 - cf) }}>
          <Counter g={g} v={v} size={124} style={{ position: "relative" }} />
          {k(g, "results+0.2", 0.3) > 0 && (
            <div style={{ position: "absolute", right: 30, bottom: 34, width: 54, height: 54, borderRadius: "50%", background: C.blue, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${pop(k(g, "results+0.2", 0.3, (x) => x))})` }}>
              <Icon name="check" size={32} color="#fff" stroke={2.4} /></div>
          )}
        </div>
      )}
    </>
  );
};

/** More conversations (P19): reply bubbles rise out of the pilot's copies; more customers (P20): each flips into the
 *  site's "Meeting booked" badge; on Wicflow (P21) they stream home into the business. */
export const BOOKED = 6;
export const badgeAt = (g: number, i: number): [number, number] => {
  const m = COPIES[i];
  return scr(g, (m.x0 + m.x1) / 2, (m.y0 + m.y1) / 2, m.h + 20);
};
const Outcomes: React.FC<{ g: number }> = ({ g }) => {
  const els: React.ReactNode[] = [];
  const [bx, by] = roofXY(g);
  for (let i = 0; i < BOOKED; i++) {
    const u = k(g, `convos+${(i * 0.1).toFixed(2)}`, 0.4, (x) => x);
    if (u <= 0) continue;
    const flip = k(g, T.s("customers") - 0.08 + i * 0.05, 0.3, MOVE);
    const home = k(g, `gather+${(i * 0.04).toFixed(2)}`, 0.7, EASE.longS);
    if (home >= 1) continue;
    const [x0, y0] = badgeAt(g, i);
    const x = lerp(x0, bx, home), y = lerp(y0, by, home) - Math.sin(home * Math.PI) * 120;
    const bubble = (
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 18px", background: C.paper, borderRadius: 22, borderBottomLeftRadius: 6, boxShadow: `${SHADOW.card}, ${SHADOW.edge}` }}>
        <span style={{ width: 16, height: 16, borderRadius: 9, background: C.blue, boxShadow: `0 0 0 6px ${C.blueHalo}` }} />
        <span style={{ display: "grid", gap: 7 }}><span style={{ width: 84, height: 9, borderRadius: 5, background: C.line }} /><span style={{ width: 56, height: 9, borderRadius: 5, background: C.line }} /></span>
      </div>
    );
    const badge = (
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 20px 12px 12px", background: C.paper, borderRadius: 999, boxShadow: `${SHADOW.card}, ${SHADOW.edge}`, fontFamily: F.ui, fontWeight: 700, fontSize: 22, color: C.ink, whiteSpace: "nowrap" }}>
        <span style={{ width: 44, height: 44, borderRadius: "50%", background: C.inkStrong, display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="calendar" size={24} color="#fff" stroke={1.8} /></span>
        Meeting booked
      </div>
    );
    els.push(
      <div key={i} style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -100%) translateY(${(1 - ARRIVE(clamp01(u))) * 26}px) scale(${pop(u) * (1 - 0.7 * home)})`, transformOrigin: "50% 100%",
        opacity: clamp01(u * 3) * (1 - clamp01((home - 0.75) / 0.25)) }}>
        <Flip k={flip} a={bubble} b={badge} />
      </div>
    );
  }
  return <>{els}</>;
};

/** Below the AI-blue field: everything that belongs to the world. Above it: the outcomes and the chip. */
export const OverlayBelow: React.FC<{ g: number }> = ({ g }) => (
  <>
    <BizTag g={g} />
    <TeamTag g={g} />
    <Assistant g={g} />
    <Tools g={g} />
    <Pilot g={g} />
    <Manual g={g} />
    <Reply g={g} />
    <FollowTag g={g} />
    <Record g={g} />
    <Message g={g} />
  </>
);
export const OverlayAbove: React.FC<{ g: number }> = ({ g }) => (
  <>
    <Outcomes g={g} />
    <Chip g={g} />
  </>
);
export { interpolate, Typed };
