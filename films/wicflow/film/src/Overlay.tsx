// Everything that faces the camera: the site's "AI at work" chip, the assistant bubble, the cards that grow out of the
// world's objects (message, reply, CRM record, counter), the tool badges, the bubbles and booked badges, the tags.
// Positions come from projecting world points, so a card stays attached to the block it grew out of.
import React from "react";
import { interpolate } from "remotion";
import { T } from "./clock";
import { C, F, R, SHADOW, clamp01, lerp, rgba } from "./lib";
import { proj } from "./iso";
import { EASE, Flip, Typed } from "./kinetic";
import { ANNA, CRM, TEAM, TOOL_TILES, TO_ANNA, VIEW, along, loopPoint } from "./map";
import { ARRIVE, DEPART, MOVE, dim, dot, k, roofXY, s } from "./scene";
import { Bubble, CrmCard, Counter } from "./cards";
import { Icon, LiveDot, Pill, ToolLogo, TOOLS } from "./ui";
import { COPIES } from "./World";

const scr = (g: number, x: number, y: number, z = 0) => proj(VIEW(g), x, y, z);
const lin = (x: number) => x;
const enter = (g: number, pos: string | number, dur = 0.45) => { const u = k(g, pos, dur, lin); return { u, s: lerp(0.15, 1, ARRIVE(u)), o: clamp01(u * dur * 30 / 4) }; };
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
  const grow = k(g, "lock", 0.45, MOVE) * (1 - k(g, "card-0.05", 0.35, MOVE)) + k(g, "customers-0.1", 0.4, MOVE);
  const hero = k(g, "blue+0.12", 0.55, MOVE);
  const home = k(g, "gather", 0.55, EASE.longS);
  const [hx, hy] = roofXY(g);
  const back = 0;
  const w = lerp(300, 780, grow), h = lerp(64, 236, grow);
  // the current row and the one before it, for the drop-through (A2): 6 f out, 6 f in
  let cur = -1;
  ROWS.forEach((r, i) => { if (t >= T.s(r.at)) cur = i; });
  if (t > T.s("card") + 0.4) cur = t >= T.s(ROWS[ROWS.length - 1].at) ? ROWS.length - 1 : -1;   // the chip shows only its own two rows
  else if (t > T.s("card")) cur = 0;
  const rowEl = (i: number, y: number, o: number) => {
    const r = ROWS[i];
    return (
      <div key={i} style={{ position: "absolute", left: 26, right: 26, top: 82, height: 130, display: "flex", alignItems: "center", gap: 20, transform: `translateY(${y}px)`, opacity: o }}>
        <div style={{ width: 66, height: 66, borderRadius: "50%", flex: "none", display: "flex", alignItems: "center", justifyContent: "center", background: r.dark ? C.inkStrong : C.paper2, boxShadow: r.dark ? undefined : `inset 0 0 0 1.5px ${C.line}` }}>
          <Icon name={r.icon} size={31} color={r.dark ? "#fff" : C.ink} stroke={1.7} /></div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 38, fontWeight: 700, letterSpacing: "-0.015em", whiteSpace: "nowrap" }}>{r.title}</div>
          {r.sub && <div style={{ fontSize: 28, color: C.muted, marginTop: 4, whiteSpace: "nowrap" }}>{r.sub}</div>}
        </div>
        <div style={{ fontSize: 21, color: C.muted, fontVariantNumeric: "tabular-nums", alignSelf: "flex-start", marginTop: 14 }}>{r.time}</div>
      </div>
    );
  };
  const rows: React.ReactNode[] = [];
  const rowO = clamp01((grow - 0.45) / 0.35);
  if (cur >= 0 && rowO > 0) {
    const a = T.s(ROWS[cur].at);
    const reopen = cur === ROWS.length - 1;                 // the chip reopens straight on its last row
    const outD = reopen ? 1 : clamp01((t - a) / 0.18), inD = reopen ? 1 : clamp01((t - a - 0.18) / 0.22);
    if (cur > 0 && outD < 1) rows.push(rowEl(cur - 1, -EASE.whipIn(outD) * 70, (1 - outD) * rowO));
    if (outD >= 1 || cur === 0) rows.push(rowEl(cur, (1 - EASE.whipOut(inD)) * 70, clamp01(inD * 2) * rowO));
  }
  return (
    <div data-probe="chip" style={{ position: "absolute", left: 0, top: 0, width: w, height: h, borderRadius: lerp(32, R.card, grow), background: C.paper, overflow: "hidden",
      boxShadow: `${SHADOW.float}, ${SHADOW.edge}`, fontFamily: F.ui, color: C.ink, opacity: clamp01(inU * 2) * (1 - 0.45 * back) * (1 - clamp01((home - 0.75) / 0.25)),
      transform: `translate(${lerp(lerp(72, 960 - (w * 1.3) / 2, hero), hx - (w * 0.08) / 2, home)}px, ${lerp(lerp(64, 330, hero), hy - (h * 0.08) / 2, home) + (1 - inU) * -40}px) scale(${lerp(lerp(1, 1.3, hero), 0.08, home) * (1 - 0.04 * back)})`, transformOrigin: "0 0" }}>
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
  const en = enter(g, "card");
  const hinge = en.u > 0 ? ARRIVE(en.u) : 0;
  if (hinge <= 0 || t > T.s("send") + 0.3) return null;
  const fold = k(g, "send", 0.27, DEPART);
  const [rx, ry] = roofXY(g);
  const typedN = Math.max(0, (t - T.s("card") - 0.12) * 60);
  let n = 0;
  const mk = k(g, "personal", 0.3, MOVE);
  const appr = k(g, "approve", 0.3, lin);
  const W = 720, left = 1130, top = 560;
  return (
    <>
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: clamp01(hinge * 2) * (1 - fold) }}>
      <path d={`M ${rx} ${ry} C ${rx + 60} ${ry + 60}, ${left - 60} ${top + 40}, ${left + 30} ${top + 60}`} fill="none" stroke={C.blue} strokeWidth={3} strokeDasharray="2 7" strokeLinecap="round" pathLength={1} />
    </svg>
    <div style={{ position: "absolute", left, top, width: W, transformOrigin: `${rx - left}px ${ry - top}px`,
      transform: `perspective(1400px) rotateX(${(1 - hinge) * 40}deg) scale(${en.s * (1 - 0.94 * fold)})`, opacity: en.o * (1 - clamp01((fold - 0.6) / 0.4)) }}>
      <div style={{ padding: "26px 34px 34px", background: C.paper, borderRadius: R.card, boxShadow: `${SHADOW.float}, ${SHADOW.edge}`, fontFamily: F.ui, color: C.ink }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 24, color: C.muted, fontWeight: 700 }}>
          <Icon name="pencil" size={24} color={C.blue} stroke={1.9} />New message · to Anna
        </div>
        <div style={{ height: 1, background: C.line2, margin: "18px 0 22px" }} />
        <div style={{ fontSize: 42, lineHeight: 1.28, fontWeight: 700, letterSpacing: "-0.02em" }}>
          {PIECES.map((p, i) => {
            const nv = Math.max(0, Math.min(p.t.length, Math.floor(typedN - n)));
            const vis = p.t.slice(0, nv);
            n += p.t.length;
            return (
              <span key={i} style={{ position: "relative", color: p.mark && mk > 0 ? C.blue : C.ink }}>
                {vis}<span style={{ color: "transparent" }}>{p.t.slice(nv)}</span>
                {p.mark && vis.length === p.t.length && <span style={{ position: "absolute", left: 0, right: 0, bottom: -2, height: 5, borderRadius: 3, background: C.blue, transformOrigin: "0 50%", transform: `scaleX(${mk})` }} />}
              </span>
            );
          })}

        </div>
      </div>
      {appr > 0 && (
        <div style={{ position: "absolute", right: 26, top: -26, transform: `scale(${pop(appr)})`, transformOrigin: "80% 50%" }}>
          <Pill size={30}><Icon name="check" size={30} color="#fff" stroke={2.2} />Approved</Pill>
        </div>
      )}
    </div>
    </>
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
    <div style={{ position: "absolute", left: x + 36, top: y - 60, transformOrigin: "0 50%", transform: `scale(${pop(u) * (1 - fold)})`, opacity: 1 - fold }}>
      <div style={{ padding: "24px 34px", background: C.paper, borderRadius: 34, borderBottomLeftRadius: 10, boxShadow: `${SHADOW.card}, ${SHADOW.edge}`, fontFamily: F.ui, display: "flex", alignItems: "center", gap: 20 }}>
        <span style={{ fontSize: 46, fontWeight: 700, color: C.ink, whiteSpace: "nowrap", letterSpacing: "-0.02em" }}>How can I help?</span>
        <span style={{ display: "flex", gap: 8 }}>{[0, 1, 2].map((i) => <span key={i} style={{ width: 12, height: 12, borderRadius: 9, background: C.muted, opacity: typing >= 0 && typing % 3 === i ? 0.9 : 0.3 }} />)}</span>
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
    <div style={{ position: "absolute", left: rx, top: ry - 130 - 20 * (1 - u), transform: "translateX(-50%)", opacity: clamp01(u * 2) * o }}>
      <Pill size={30}>Your business</Pill>
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
      <Pill size={34}>Your team</Pill>
    </div>
  );
};

/** The stations get named on their word (P6–P8): upright black pills, the site's button language. */
const STATIONS: { at: string; label: string; w: [number, number, number] }[] = [
  { at: "sales", label: "Your CRM", w: [40, -505, 230] },
  { at: "marketing", label: "Your market", w: [-456, -456, 110] },
  { at: "work", label: "Your team", w: [-400, 120, 150] },
];
const Stations: React.FC<{ g: number }> = ({ g }) => (
  <>
    {STATIONS.map((st) => {
      const u = k(g, `${st.at}+0.05`, 0.4);
      const o = 1 - k(g, "capOut3", 0.3, DEPART);
      if (u <= 0 || o <= 0) return null;
      const [x, y] = scr(g, ...st.w);
      return <div key={st.label} style={{ position: "absolute", left: x, top: y - 30 - 22 * (1 - ARRIVE(u)), transform: "translateX(-50%)", opacity: clamp01(u * 2) * o }}><Pill size={26}>{st.label}</Pill></div>;
    })}
  </>
);

/** What the system does (P5): the demo's own four steps light on the track as the dot passes — find, write, follow up,
 *  update — then fold into it once the loop is live. */
const SYS: { u: number; icon: string }[] = [{ u: 0.06, icon: "target" }, { u: 0.31, icon: "pencil" }, { u: 0.56, icon: "refresh" }, { u: 0.81, icon: "check" }];
const SysSteps: React.FC<{ g: number }> = ({ g }) => (
  <>
    {SYS.map((st, i) => {
      const a = T.s("run") + EASE.steady(st.u) * 1.0 - 0.05;
      const u = clamp01((s(g) - a) / 0.3);
      const o = 1 - k(g, "capOut2", 0.3, DEPART);
      if (u <= 0 || o <= 0) return null;
      const [x, y] = scr(g, ...loopPoint(st.u), 0);
      return (
        <div key={i} style={{ position: "absolute", left: x - 32, top: y - 82, width: 64, height: 64, borderRadius: "50%", background: C.paper, display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: `${SHADOW.card}, inset 0 0 0 2px ${rgba(C.blue, 0.5)}`, transform: `scale(${pop(u) * (1 - 0.3 * (1 - o))})`, transformOrigin: "50% 120%", opacity: clamp01(u * 3) * o }}>
          <Icon name={st.icon} size={32} color={C.blue} stroke={1.9} />
        </div>
      );
    })}
  </>
);

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
  const en = enter(g, "drawer+0.1");
  const u = en.u;
  const fold = k(g, "drawerIn-0.05", 0.27, DEPART);
  if (u <= 0 || fold >= 1) return null;
  const [dx, dy] = scr(g, 40, CRM.y1 + 40, CRM.h * 0.8);
  const step = k(g, "updated", 0.33, EASE.lead);
  return (
    <div style={{ position: "absolute", left: 1100, top: 540, transformOrigin: `${dx - 1100}px ${dy - 540}px`, transform: `perspective(1400px) rotateX(${(1 - ARRIVE(u)) * -40}deg) scale(${en.s * (1 - 0.9 * fold)})`, opacity: en.o * (1 - fold) }}>
      <CrmCard g={g} step={step} tick={k(g, "updated+0.15", 0.3)} w={740} style={{ position: "relative" }} logo={<span style={{ display: "flex", gap: 12, alignItems: "center" }}><ToolLogo id="hubspot" size={30} /><ToolLogo id="pipedrive" size={30} /><ToolLogo id="salesforce" size={30} /></span>} />
    </div>
  );
};

/** The follow-up (P11): a small pill riding the second dot along the route, sent by itself. */
const FollowTag: React.FC<{ g: number }> = ({ g }) => {
  const u = k(g, "follow", 0.5, EASE.longS);
  const show = k(g, "timer", 0.3, lin) * (1 - k(g, "follow+0.55", 0.2));
  if (show <= 0) return null;
  const [x, y] = scr(g, ...along(TO_ANNA, u), 0);
  const pu = k(g, "timer", 0.3, lin);
  return (
    <div style={{ position: "absolute", left: x + 18, top: y - 62, opacity: show, transform: `scale(${pop(pu)})`, transformOrigin: "0 100%" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 22px", borderRadius: 999, background: C.paper, boxShadow: `${SHADOW.card}, ${SHADOW.edge}`, fontFamily: F.ui, fontWeight: 700, fontSize: 32, color: C.blue, whiteSpace: "nowrap" }}>
        <Icon name="refresh" size={30} color={C.blue} stroke={2} />Follow-up
      </div>
    </div>
  );
};

/** The tools (P14): the site's own panel ("Connected to your existing workflows"), hinging up out of the tool plot; its three
 *  rows of five rise one after another; the team's own tools pop over the people; the dot's path lights Gmail and HubSpot. */
const Tools: React.FC<{ g: number }> = ({ g }) => {
  const t = s(g);
  if (t >= T.s("blue") + 0.6) return null;
  const els: React.ReactNode[] = [];
  const ten = enter(g, "tools-0.15");
  const hinge = ten.u > 0 ? ARRIVE(ten.u) : 0;
  const fold = k(g, "capOut6", 0.35, DEPART);
  const passA = k(g, "already+0.3", 0.25) * (1 - k(g, "already+1.3", 0.4)), passB = k(g, "already+0.6", 0.25) * (1 - k(g, "already+1.5", 0.4));
  if (hinge > 0 && fold < 1) {
    const xs = TOOL_TILES.map((q) => (q.x0 + q.x1) / 2), ys = TOOL_TILES.map((q) => (q.y0 + q.y1) / 2);
    const [px, py] = scr(g, (Math.min(...xs) + Math.max(...xs)) / 2, (Math.min(...ys) + Math.max(...ys)) / 2, 12);
    const L = 1196, TOP = 300;
    els.push(
      <div key="toolcard" style={{ position: "absolute", left: L, top: TOP, width: 640, transformOrigin: `${px - L}px ${py - TOP}px`,
        transform: `perspective(1600px) rotateX(${(1 - hinge) * 40}deg) scale(${ten.s * (1 - 0.85 * fold)})`, opacity: ten.o * (1 - clamp01((fold - 0.5) / 0.5)) }}>
        <div style={{ padding: "26px 28px 28px", background: C.paper, borderRadius: R.card, boxShadow: `${SHADOW.float}, ${SHADOW.edge}`, fontFamily: F.ui, color: C.ink }}>
          <div style={{ fontFamily: F.display, fontWeight: 600, fontSize: 36, letterSpacing: "-0.04em", lineHeight: 1.05 }}>Connected to your existing workflows</div>
          <div style={{ fontSize: 22, color: C.muted, marginTop: 8 }}>Your AI, email and CRM. Working together.</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12, marginTop: 20 }}>
            {TOOL_TILES.map((tl, i) => {
              const row = Math.floor(i / 5);
              const u = k(g, `tools+${(row * 0.33 + (i % 5) * 0.035).toFixed(3)}`, 0.4, (x) => x);
              const ring = tl.id === "gmail" ? passA : tl.id === "hubspot" ? passB : 0;
              const w = TOOLS.find((q) => q.id === tl.id)!.w ?? 1;
              return (
                <div key={tl.id} style={{ height: 96, borderRadius: 18, background: C.paper, display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: `inset 0 0 0 ${1.5 + 2.5 * ring}px ${ring > 0 ? rgba(C.blue, Math.max(0.12, ring)) : C.line2}, 0 6px 14px -8px rgba(23,23,27,0.18)`,
                  transform: `translateY(${(1 - ARRIVE(clamp01(u))) * 18}px) scale(${pop(u)})`, opacity: clamp01(u * 3) }}>
                  <ToolLogo id={tl.id} size={w > 1.4 ? 30 : w > 1.1 ? 40 : 52} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
  // "already uses": the tools in the team's hands
  const D = dim(g);
  const mine = ["gmail", "hubspot", "slack"];
  TEAM.forEach(([px, py], i) => {
    const u = k(g, `already+${(i * 0.1).toFixed(2)}`, 0.4, (x) => x);
    const o = 1 - k(g, "capOut6", 0.3);
    if (u <= 0 || o <= 0) return;
    const [x, y0] = scr(g, px, py, 90);
    const y = Math.min(...TEAM.map(([a, b]) => scr(g, a, b, 90)[1])) - 40;
    els.push(<svg key={`ml${i}`} width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: clamp01(u * 3) * o * (1 - D) }}>
      <line x1={x} y1={y - 8} x2={x} y2={y0 - 20} stroke={C.line} strokeWidth={2} /></svg>);
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
  const en = enter(g, "less-0.2");
  const u = en.u;
  const fold = k(g, "convos-0.35", 0.3, DEPART);
  if (u <= 0 || fold >= 1) return null;
  const [dx, dy] = scr(g, -285, 285, 40);
  return (
    <div style={{ position: "absolute", left: 96, top: 170, width: 470, transformOrigin: `${dx - 96}px ${dy - 170}px`, transform: `scale(${en.s * (1 - 0.9 * fold)})`, opacity: en.o * (1 - fold) }}>
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
              <span style={{ position: "relative", fontSize: 32, fontWeight: 700, letterSpacing: "-0.015em", color: done > 0.5 ? C.muted : C.ink, whiteSpace: "nowrap" }}>
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
  const cen = enter(g, "measure");
  const cu = cen.u;
  const cf = k(g, "scale-0.15", 0.25, DEPART);
  const v = 7 + k(g, "results", 0.35, EASE.lead);
  const [ax, ay] = scr(g, (ANNA.x0 + ANNA.x1) / 2, (ANNA.y0 + ANNA.y1) / 2, ANNA.h * 1.4);
  return (
    <>
      {tag > 0 && <div style={{ position: "absolute", left: px - 90, top: py - 6, opacity: clamp01(k(g, "plot+0.25", 0.12, lin)) * (1 - k(g, "scale", 0.3, DEPART)), transform: `scale(${pop(k(g, "plot+0.25", 0.35, lin))})`, transformOrigin: "50% 100%" }}><Pill size={34}>Pilot</Pill></div>}
      {cu > 0 && cf < 1 && (
        <div style={{ position: "absolute", left: 1150, top: 470, transformOrigin: `${ax - 1150}px ${ay - 470}px`, transform: `scale(${cen.s * (1 - 0.95 * cf)})`, opacity: cen.o * (1 - cf) }}>
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
    const [cx0, cy0] = badgeAt(g, i);
    const arr = k(g, `blue+${(0.1 + i * 0.03).toFixed(2)}`, 0.55, MOVE);
    const slot: [number, number] = [[470, 250], [960, 250], [1450, 250], [470, 800], [960, 800], [1450, 800]][i] as [number, number];
    const x0 = lerp(cx0, slot[0], arr), y0 = lerp(cy0, slot[1], arr);
    const x = lerp(x0, bx, home), y = lerp(y0, by, home) - Math.sin(home * Math.PI) * 120;
    const bubble = (
      <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 22px 14px 14px", background: C.paper, borderRadius: 30, borderBottomLeftRadius: 8, boxShadow: `${SHADOW.card}, ${SHADOW.edge}`, fontFamily: F.ui, fontWeight: 700, fontSize: 26, color: C.ink, whiteSpace: "nowrap" }}>
        <span style={{ width: 48, height: 48, borderRadius: "50%", background: C.tBlue[1], display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `inset 0 0 0 1.5px ${rgba(C.blue, 0.35)}` }}>
          <Icon name="reply" size={26} color={C.blue} stroke={2} /></span>
        Replied
      </div>
    );
    const badge = (
      <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 22px 14px 14px", background: C.paper, borderRadius: 999, boxShadow: `${SHADOW.card}, ${SHADOW.edge}`, fontFamily: F.ui, fontWeight: 700, fontSize: 26, color: C.ink, whiteSpace: "nowrap" }}>
        <span style={{ width: 48, height: 48, borderRadius: "50%", background: C.inkStrong, display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="calendar" size={26} color="#fff" stroke={1.8} /></span>
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
    <Stations g={g} />
    <SysSteps g={g} />
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
