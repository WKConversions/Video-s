// Act 2 (7.0–25.0 s): one window that stays on screen while its body changes, the way the reference stays in its
// app: the process audit (steps, friction flags, a priority picked "First"), the build board (K.B and You move
// cards; the activity is shared), the intake form (filled and sent), the workflow (CRM update, follow-up, Make,
// n8n, an AI agent; runs on its own).
import React from "react";
import { T } from "./clock";
import { Typed, off } from "./kinetic";
import { ARRIVE, C, MOVE, SHADOW, ToolTile, lerp } from "./lib";
import { IN, OUT } from "./a1";
import { Abs, Arrow, Avatar, BarTitle, Box, Check, Cursor, Icon, IconBox, PHONE, Phone, Pill, Skel, U, Win, mix, press, ripple, trk, txt } from "./ui";

const k = (g: number, pos: string | number, dur: number, ease = ARRIVE) => T.k(g, pos, dur, ease);
/** A body's way in and out: the old one slides left and is gone in 0.25 s; the new one comes from the right after it. */
const pane = (g: number, at: string, out?: string) => {
  const i = k(g, at, 0.45), o = out ? k(g, out, 0.25, OUT) : 0;
  return { o: Math.min(1, i * 1.5) * (1 - o), dx: (1 - i) * 200 - o * 200 };
};
/** A card lifting out of its window (the reference's emphasis): scale, a deeper shadow. */
const liftShadow = (l: number) => `0 ${10 + 26 * l}px ${26 + 40 * l}px -16px rgba(41,58,81,${0.28 + 0.24 * l})`;
const card = (extra?: React.CSSProperties): React.CSSProperties => ({ position: "absolute", inset: 0, borderRadius: 18, background: C.white, border: `2px solid ${U.skel}`,
  boxShadow: "0 10px 26px -16px rgba(41,58,81,0.28)", ...extra });

// ---- the process audit -------------------------------------------------------------------------------------------------
const STEPS = [
  { n: "Lead", i: "userPlus", r: "Sales" }, { n: "Intake", i: "clipboard", r: "Ops" }, { n: "Quote", i: "file", r: "Sales" },
  { n: "Invoice", i: "receipt", r: "Finance" }, { n: "Follow-up", i: "mail", r: "Sales" },
];
const stepX = (i: number) => 68 + i * 272;
const FLAGS: Record<number, string> = { 1: "w:friction", 4: "w:is" };
const Audit: React.FC<{ g: number }> = ({ g }) => {
  const p = pane(g, "audit+0.3", "board");
  if (p.o <= 0) return null;
  const listO = k(g, "pick+0.46", 0.25) * (1 - k(g, "first+0.14", 0.22));
  const hl = trk(g, [["pick", 0], ["pick+0.6", 0], ["first-0.06", 2, MOVE]])[0];
  // the dropdown is drawn 1.12× (lifted), about its top centre (448, 392); the cursor aims at the lifted items
  const cur = trk(g, [["pick", 760, 690, 0], ["pick+0.36", 473, 428, 1, MOVE], ["pick+0.6", 473, 428, 1], ["first-0.06", 428, 657, 1, MOVE], ["first+0.25", 440, 640, 1], ["first+0.5", 450, 630, 0]]);
  const chosen = k(g, "first+0.1", 0.3);
  const head = k(g, "w:audit-0.14", 0.45);
  return (
    <Abs x={0} y={0} w={1440} h={704} o={p.o} dx={p.dx}>
      <div style={{ position: "absolute", left: 68, top: 34, display: "flex", alignItems: "center", gap: 18, opacity: head, transform: `translateY(${(1 - head) * 24}px)` }}>
        <IconBox name="search" size={60} bg={C.cyanSoft} /><span style={txt(40, 800)}>Current process</span>
      </div>
      <div style={{ position: "absolute", left: 830, top: 52, opacity: k(g, "steps", 0.4), ...txt(24, 600, C.muted) }}>How the work moves today</div>
      {/* the audit: a magnifier passes over the process before its steps are drawn */}
      {STEPS.map((s, i) => { const a = k(g, off("audit+0.5", 0.08 * i), 0.35) * (1 - k(g, off("steps", 0.13 * i), 0.3)), seen = k(g, off("w:audit-0.2", 0.2 + 0.2 * i), 0.25); return a > 0 && (
        <div key={i} style={{ position: "absolute", left: stepX(i), top: 160, width: 216, height: 210, borderRadius: 18, border: `3px dashed ${mix(U.skelD, C.cyan, seen)}`, background: `rgba(215,243,255,${0.5 * seen})`, boxSizing: "border-box", opacity: a }} />
      ); })}
      {(() => { const t = k(g, "w:audit-0.2", 1.05, MOVE), o = Math.min(k(g, "w:audit-0.25", 0.2), 1 - k(g, "steps-0.15", 0.25)); return o > 0 && (
        <div style={{ position: "absolute", left: lerp(stepX(0) + 60, stepX(4) + 156, t) - 52, top: 213, width: 104, height: 104, borderRadius: 52, background: C.white, border: `5px solid ${C.cyan}`,
          boxSizing: "border-box", boxShadow: SHADOW.tile, display: "flex", alignItems: "center", justifyContent: "center", opacity: o, zIndex: 5 }}><Icon name="search" size={50} color={C.navy} width={2.6} /></div>
      ); })()}
      {STEPS.map((s, i) => {
        const a = k(g, off("steps", 0.13 * i), 0.45);
        const flag = FLAGS[i] ? k(g, FLAGS[i], 0.35) : 0;
        const first = i === 1 ? chosen : 0;
        // the two manual steps lift out on their flags; Follow-up settles back when the priority opens
        const lift = FLAGS[i] ? k(g, FLAGS[i], 0.45, MOVE) * (i === 4 ? 1 - k(g, "pick", 0.45, MOVE) : 1 - k(g, "board-0.3", 0.3, MOVE)) : 0;
        return (
          <React.Fragment key={i}>
            <Abs x={stepX(i)} y={160} w={216} h={210} o={a} dx={(1 - a) * -40} s={1 + 0.14 * lift} z={lift > 0 ? 3 : 1}>
              <div style={card({ border: `3px solid ${first ? mix(C.warn, C.cyan, first) : mix(U.skel, C.warn, flag)}`, boxShadow: liftShadow(lift) })} />
              <div style={{ position: "absolute", left: 22, top: 22 }}><IconBox name={s.i} size={58} /></div>
              <div style={{ position: "absolute", left: 22, top: 100, ...txt(28, 700) }}>{s.n}</div>
              <div style={{ position: "absolute", left: 22, top: 146 }}><Pill bg={U.tint} color={C.navy} size={18}>{s.r}</Pill></div>
              {flag > 0 && (
                <div style={{ position: "absolute", right: -14, top: -26, opacity: Math.min(1, flag * 1.5), transform: `scale(${0.7 + 0.3 * flag})`, transformOrigin: "100% 100%" }}>
                  <Pill bg={C.warnSoft} color={U.warnInk} size={20} icon="alert" style={{ boxShadow: "0 6px 14px -8px rgba(180,35,24,0.5)" }}>Manual</Pill>
                </div>
              )}
              {first > 0 && (
                <div style={{ position: "absolute", left: -18, top: -18, width: 46, height: 46, borderRadius: 23, background: C.cyan, display: "flex", alignItems: "center", justifyContent: "center",
                  opacity: first, transform: `scale(${0.6 + 0.4 * first})`, ...txt(24, 800, C.navy) }}>1</div>
              )}
            </Abs>
            {i < 4 && (
              <Abs x={stepX(i) + 222} y={253} w={44} h={24}><Arrow k={k(g, off("steps", 0.13 * i + 0.16), 0.3, MOVE)} w={44} width={3.5} /></Abs>
            )}
          </React.Fragment>
        );
      })}
      {/* the priority picked for Intake */}
      <div style={{ position: "absolute", left: 0, top: 0, width: 1440, height: 704, transform: "scale(1.12)", transformOrigin: "448px 392px", zIndex: 4 }}>
      <Abs x={298} y={392} w={300} h={64} o={k(g, "pick+0.12", 0.35)} dy={(1 - k(g, "pick+0.12", 0.4)) * 20}>
        <div style={{ position: "absolute", inset: 0, borderRadius: 14, background: C.white, border: `2px solid ${mix(U.line, C.cyan, chosen)}`, boxShadow: "0 8px 20px -14px rgba(41,58,81,0.3)" }} />
        <div style={{ position: "absolute", left: 20, top: 19, ...txt(22, 600, C.muted) }}>Priority</div>
        <div style={{ position: "absolute", right: 54, top: 16, display: "flex", alignItems: "center", gap: 10 }}>
          {chosen > 0 && <div style={{ width: 14, height: 14, borderRadius: 7, background: C.cyan, opacity: chosen }} />}
          <span style={{ ...txt(25, 700, chosen > 0 ? C.navy : C.muted), opacity: chosen > 0 ? chosen : 1 }}>{chosen > 0 ? "First" : "Choose"}</span>
        </div>
        <Icon name="chevron" size={26} color={C.muted} style={{ position: "absolute", right: 18, top: 19 }} />
      </Abs>
      <Abs x={298} y={466} w={300} h={198} o={listO} dy={(1 - k(g, "pick+0.46", 0.3)) * -14}>
        <div style={{ position: "absolute", inset: 0, borderRadius: 16, background: C.white, boxShadow: SHADOW.card, border: `2px solid ${U.skel}` }} />
        <div style={{ position: "absolute", left: 8, top: 8 + hl * 62, width: 284, height: 58, borderRadius: 12, background: C.cyanSoft }} />
        {["Later", "Next", "First"].map((t, j) => <div key={j} style={{ position: "absolute", left: 24, top: 8 + j * 62 + 16, ...txt(25, 600) }}>{t}</div>)}
      </Abs>
      </div>
      {cur[2] > 0 && <div style={{ position: "absolute", left: cur[0], top: cur[1], opacity: cur[2], zIndex: 6 }}><Cursor label="K.B" press={press(g, "pick+0.4") + press(g, "first")} ring={ripple(g, "pick+0.4") || ripple(g, "first")} /></div>}
    </Abs>
  );
};

// ---- the build board ---------------------------------------------------------------------------------------------------
const colX = (c: number) => 84 + c * 436;
const slot = (c: number, s: number): [number, number] => [colX(c) + 16, 104 + s * 112];
const BoardCard: React.FC<{ title: string; tone: string; xy: number[]; lift: number }> = ({ title, tone, xy, lift }) => (
  <div style={{ position: "absolute", left: xy[0], top: xy[1], width: 368, height: 96, zIndex: lift > 0 ? 5 : 1, transform: `rotate(${lift * 2}deg) scale(${1 + lift * 0.04})` }}>
    <div style={{ position: "absolute", inset: 0, borderRadius: 14, background: C.white, boxShadow: lift > 0 ? `0 ${12 + 16 * lift}px ${24 + 20 * lift}px -14px rgba(41,58,81,${0.3 + 0.2 * lift})` : "0 6px 16px -12px rgba(41,58,81,0.3)" }} />
    <div style={{ position: "absolute", left: 0, top: 14, width: 6, height: 68, borderRadius: 3, background: tone }} />
    <div style={{ position: "absolute", left: 24, top: 20, ...txt(25, 700) }}>{title}</div>
    <Skel w={150} style={{ position: "absolute", left: 24, top: 62 }} />
  </div>
);
const bump = (g: number, a: string, dur: number) => { const t = (g - T.f(a)) / (dur * 30); return t <= 0 || t >= 1 ? 0 : Math.sin(Math.PI * t); };
const Board: React.FC<{ g: number }> = ({ g }) => {
  const p = pane(g, "board+0.22", "form");
  if (p.o <= 0) return null;
  const OFF = [150, 50];
  const c1 = trk(g, [["board", ...slot(0, 0)], ["drag1", ...slot(0, 0)], ["drag1+0.7", ...slot(1, 1), MOVE]]);
  const c2 = trk(g, [["board", ...slot(0, 1)], ["drag2", ...slot(0, 1)], ["drag2+0.7", ...slot(1, 2), MOVE]]);
  const c3 = trk(g, [["board", ...slot(0, 2)], ["drag2+0.4", ...slot(0, 2)], ["drag2+0.9", ...slot(0, 0), MOVE]]);
  const kb = trk(g, [["board+0.2", 760, 640, 0], ["drag1-0.06", slot(0, 0)[0] + OFF[0], slot(0, 0)[1] + OFF[1], 1, MOVE], ["drag1", slot(0, 0)[0] + OFF[0], slot(0, 0)[1] + OFF[1], 1],
    ["drag1+0.7", slot(1, 1)[0] + OFF[0], slot(1, 1)[1] + OFF[1], 1, MOVE], ["form-0.2", slot(1, 1)[0] + 220, slot(1, 1)[1] + 110, 1], ["form", slot(1, 1)[0] + 220, slot(1, 1)[1] + 110, 0]]);
  const you = trk(g, [["board+0.45", 1300, 700, 0], ["drag2-0.06", slot(0, 1)[0] + OFF[0], slot(0, 1)[1] + OFF[1], 1, MOVE], ["drag2", slot(0, 1)[0] + OFF[0], slot(0, 1)[1] + OFF[1], 1],
    ["drag2+0.7", slot(1, 2)[0] + OFF[0], slot(1, 2)[1] + OFF[1], 1, MOVE], ["form-0.2", slot(1, 2)[0] + 260, slot(1, 2)[1] + 130, 1], ["form", slot(1, 2)[0] + 260, slot(1, 2)[1] + 130, 0]]);
  const done1 = g >= T.f("drag1+0.4"), done2 = g >= T.f("drag2+0.4");
  const counts = [done2 ? 1 : done1 ? 2 : 3, done2 ? 3 : done1 ? 2 : 1, 1];
  const share = k(g, "open2+0.3", 0.4), lift = k(g, "open2", 0.5, MOVE) * (1 - k(g, "form-0.3", 0.3, MOVE));
  const lines = [
    { at: "drag1+0.72", who: "kb", t: "K.B moved Intake form to Building" },
    { at: "drag2+0.72", who: "you", t: "You moved CRM sync to Building" },
  ];
  return (
    <Abs x={0} y={0} w={1440} h={704} o={p.o} dx={p.dx}>
      {["To do", "Building", "Live"].map((n, c) => (
        <React.Fragment key={c}>
          <div style={{ position: "absolute", left: colX(c) + 6, top: 34, display: "flex", alignItems: "center", gap: 14 }}>
            <span style={txt(27, 700)}>{n}</span>
            <Pill bg={U.tint} color={C.navy} size={18}>{String(counts[c])}</Pill>
          </div>
          <div style={{ position: "absolute", left: colX(c), top: 88, width: 400, height: 420, borderRadius: 20, background: U.tint }} />
        </React.Fragment>
      ))}
      <BoardCard title="Dashboard" tone={C.cyan} xy={slot(1, 0)} lift={0} />
      <BoardCard title="Website" tone={C.navy} xy={slot(2, 0)} lift={0} />
      <BoardCard title="Follow-up emails" tone={U.skelD} xy={c3} lift={0} />
      <BoardCard title="CRM sync" tone={g >= T.f("drag2+0.35") ? C.cyan : U.skelD} xy={c2} lift={bump(g, "drag2", 0.7)} />
      <BoardCard title="Intake form" tone={g >= T.f("drag1+0.35") ? C.cyan : U.skelD} xy={c1} lift={bump(g, "drag1", 0.7)} />
      {/* the activity, shared with the team */}
      <div style={{ position: "absolute", left: 84, top: 532, width: 1272, height: 152, borderRadius: 20, background: C.white, border: `2px solid ${mix(U.skel, C.cyan, share)}`, boxShadow: liftShadow(lift),
        transform: `translateY(${-10 * lift}px) scale(${1 + 0.06 * lift})`, zIndex: 4 }}>
        <div style={{ position: "absolute", left: 28, top: 20, ...txt(22, 700, C.muted) }}>Activity</div>
        {lines.map((l, j) => {
          const a = k(g, l.at, 0.4);
          return a > 0 && (
            <div key={j} style={{ position: "absolute", left: 28, top: 58 + j * 44, display: "flex", alignItems: "center", gap: 14, opacity: a, transform: `translateX(${(1 - a) * -24}px)` }}>
              {l.who === "kb" ? <Avatar size={34} kb /> : <Avatar size={34} text="You" bg={C.cyan} />}
              <span style={txt(23, 600)}>{l.t}</span>
              <span style={txt(19, 600, C.muted)}>now</span>
            </div>
          );
        })}
        <div style={{ position: "absolute", right: 24, top: 16, display: "flex", alignItems: "center", gap: 16, opacity: share, transform: `translateY(${(1 - share) * 14}px)` }}>
          <Pill bg={C.cyanSoft} color={C.navy} size={20} icon="eye">Shared with your team</Pill>
        </div>
        <div style={{ position: "absolute", right: 24, top: 82, display: "flex", alignItems: "center", gap: 10, opacity: k(g, "w:open", 0.4) }}>
          <span style={{ ...txt(19, 600, C.muted), marginRight: 6 }}>Seen by</span>
          {["AM", "JS", "RK"].map((t, j) => <div key={j} style={{ marginLeft: j ? -16 : 0, transform: `scale(${0.6 + 0.4 * k(g, off("w:open", 0.08 * j), 0.35)})` }}><Avatar size={44} text={t} bg={[C.cyanSoft, "#E3E8EF", "#DCE6F2"][j]} /></div>)}
        </div>
      </div>
      {kb[2] > 0 && <div style={{ position: "absolute", left: kb[0], top: kb[1], opacity: kb[2], zIndex: 6 }}><Cursor label="K.B" press={press(g, "drag1") + press(g, "drag1+0.7")} /></div>}
      {you[2] > 0 && <div style={{ position: "absolute", left: you[0], top: you[1], opacity: you[2], zIndex: 6 }}><Cursor label="You" tone="you" press={press(g, "drag2") + press(g, "drag2+0.7")} /></div>}
    </Abs>
  );
};

// ---- the intake form, folding into the workflow ------------------------------------------------------------------------
const FIELDS = [
  { l: "Name", v: "Jordan Smith", at: "w:intake-0.06", cps: 40 },
  { l: "Company", v: "Acme Studio", at: "w:forms-0.14", cps: 40 },
  { l: "Service", v: "Website + CRM", at: "w:forms+0.1", cps: 52 },
];
const NODE = { y: 176, w: 280, h: 150 };
const nodeX = (i: number) => 70 + i * 340;
const FormCard: React.FC<{ g: number }> = ({ g }) => {
  const a = k(g, "form+0.22", 0.45);
  if (a <= 0) return null;
  const r = trk(g, [["form", 400, 52, 640, 600], ["flow", 400, 52, 640, 600], ["flow+0.6", nodeX(0), NODE.y, NODE.w, NODE.h, MOVE]]);
  const sc = r[2] / 640, formO = 1 - k(g, "flow+0.3", 0.25), nodeO = k(g, "flow+0.36", 0.25);
  const lift = k(g, "form+0.5", 0.5, MOVE) * (1 - k(g, "flow", 0.5, MOVE));
  const sent = k(g, "send+0.04", 0.25);
  const cur = trk(g, [["form+0.3", 1000, 660, 0], ["send-0.06", 640, 606, 1, MOVE], ["flow", 640, 606, 1], ["flow+0.25", 680, 650, 0]]);
  return (
    <>
      <div style={{ position: "absolute", left: r[0], top: r[1], width: r[2], height: r[3], opacity: Math.min(1, a * 1.5), transform: `translateX(${(1 - a) * 200}px) scale(${1 + 0.12 * lift})`, zIndex: 2 }}>
        <div style={card({ borderRadius: lerp(22, 18, k(g, "flow", 0.6, MOVE)), boxShadow: liftShadow(Math.max(lift, 0.3)) })} />
        <div style={{ position: "absolute", inset: 0, borderRadius: 18, overflow: "hidden" }}>
        {formO > 0 && (
          <div style={{ position: "absolute", left: 0, top: 0, width: 640, height: 600, opacity: formO, transform: `scale(${sc})`, transformOrigin: "0 0" }}>
            <div style={{ position: "absolute", left: 36, top: 32, display: "flex", alignItems: "center", gap: 16 }}><IconBox name="clipboard" size={50} /><span style={txt(32, 700)}>New client intake</span></div>
            {FIELDS.map((f, i) => {
              const t = g / 30 - T.s(f.at), typing = t > 0 && t * f.cps < f.v.length;
              return (
                <div key={i} style={{ position: "absolute", left: 36, top: 112 + i * 120 }}>
                  <div style={txt(20, 600, C.muted)}>{f.l}</div>
                  <div style={{ position: "absolute", left: 0, top: 32, width: 568, height: 64, borderRadius: 12, border: `2px solid ${typing ? C.cyan : U.line}`, background: C.white, boxSizing: "border-box",
                    display: "flex", alignItems: "center", padding: "0 20px" }}>
                    <Typed g={g} text={f.v} at={f.at} cps={f.cps} caret={typing} style={txt(26, 600)} />
                  </div>
                </div>
              );
            })}
            <div style={{ position: "absolute", left: 36, top: 492, width: 568, height: 74, borderRadius: 14, background: C.navy, display: "flex", alignItems: "center", justifyContent: "center", gap: 14,
              transform: `scale(${1 - press(g, "send") * 0.03})` }}>
              <Icon name={sent > 0.5 ? "check" : "send"} size={30} color={sent > 0.5 ? C.cyan : C.white} width={2.8} />
              <span style={txt(28, 700, C.white)}>{sent > 0.5 ? "Sent" : "Send"}</span>
            </div>
          </div>
        )}
        {nodeO > 0 && <NodeBody g={g} i={0} o={nodeO} />}
        </div>
      </div>
      {cur[2] > 0 && <div style={{ position: "absolute", left: cur[0], top: cur[1], opacity: cur[2], zIndex: 6 }}><Cursor press={press(g, "send")} ring={ripple(g, "send")} /></div>}
    </>
  );
};
const NODES = [
  { n: "Intake form", i: "clipboard", done: "Received", at: "flow+0.4" },
  { n: "Update CRM", i: "users", done: "Updated", at: "crm" },
  { n: "Follow-up", i: "mail", done: "Email sent", at: "run" },
  { n: "AI agent", i: "", done: "Reply drafted", at: "manual" },
];
const NodeBody: React.FC<{ g: number; i: number; o?: number }> = ({ g, i, o = 1 }) => {
  const d = k(g, NODES[i].at, 0.3);
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: NODE.w, height: NODE.h, opacity: o }}>
      <div style={{ position: "absolute", left: 22, top: 22 }}>{NODES[i].i ? <IconBox name={NODES[i].i} size={56} /> : <ToolTile tool="claude" size={56} shadow={false} />}</div>
      <div style={{ position: "absolute", left: 92, top: 36, ...txt(24, 700) }}>{NODES[i].n}</div>
      <div style={{ position: "absolute", left: 22, top: 104, display: "flex", alignItems: "center", gap: 8 }}>
        {d > 0 ? <>
          <div style={{ opacity: d, transform: `scale(${0.6 + 0.4 * d})` }}><Check size={28} /></div>
          <span style={{ ...txt(21, 700), opacity: d }}>{NODES[i].done}</span>
        </> : <Skel w={150} h={14} style={{ marginTop: 6 }} />}
      </div>
    </div>
  );
};
/** A sweep of light along a connector, and the node it reaches flashing. */
const sweep = (g: number, at: string | number, dur = 0.26) => k(g, at, dur, MOVE);
const flash = (g: number, at: string | number) => { const t = (g - T.f(at)) / 15; return t < 0 || t > 1 ? 0 : 1 - t; };
const RUNS = [0.1];   // one more run after "manual", seconds after it
const Flow: React.FC<{ g: number }> = ({ g }) => {
  if (g < T.f("flow")) return null;
  const head = k(g, "flow+0.2", 0.45);
  const nodeIn = (i: number) => (i === 3 ? k(g, "ai", 0.55) : k(g, off("flow", 0.28 + 0.12 * i), 0.45));
  const conn = (i: number) => (i === 2 ? k(g, "ai+0.35", 0.3, MOVE) : k(g, off("flow", 0.35 + 0.1 * i), 0.3, MOVE));
  // the first run (crm, run, manual), then three more runs through all four nodes
  const sweeps: [number, number][] = [[0, T.s("crm") - 0.28], [1, T.s("run") - 0.28], [2, T.s("manual") - 0.28]];
  RUNS.forEach((d) => [0, 1, 2].forEach((i) => sweeps.push([i, T.s("manual") + d + i * 0.1])));
  const count = +(g >= T.f("run")) + +(g >= T.f("manual")) + RUNS.filter((d) => g >= T.f(off("manual", d + 0.46))).length;
  const log = [
    { t: "Intake form received", at: "flow+0.5" }, { t: "CRM record updated", at: "crm" }, { t: "Follow-up email sent", at: "run" }, { t: "AI agent drafted a reply", at: "manual" },
  ];
  const tools: [string, number, string][] = [["make", 1, "make"], ["n8n", 2, "n8n"]];
  return (
    <>
      <div style={{ position: "absolute", left: 70, top: 56, opacity: head, transform: `translateY(${(1 - head) * 20}px)`, display: "flex", alignItems: "center", gap: 16 }}>
        <Icon name="bolt" size={32} color={C.navy} width={2.2} /><span style={txt(30, 700)}>When an intake form is sent</span>
      </div>
      <div style={{ position: "absolute", right: 70, top: 46, opacity: head, display: "flex", alignItems: "baseline", gap: 14 }}>
        <span style={txt(22, 600, C.muted)}>Runs today</span><span style={txt(44, 800)}>{count}</span>
      </div>
      {[0, 1, 2].map((i) => {
        const x0 = nodeX(i) + NODE.w + 6, len = 340 - NODE.w - 12;
        const lit = Math.max(0, ...sweeps.filter((s) => s[0] === i).map((s) => { const v = sweep(g, s[1]); return v > 0 && v < 1 ? 1 : 0; }));
        const pos = sweeps.filter((s) => s[0] === i).map((s) => sweep(g, s[1])).find((v) => v > 0 && v < 1);
        return (
          <React.Fragment key={i}>
            <Abs x={x0} y={NODE.y + NODE.h / 2 - 12} w={len} h={24}>
              <Arrow k={conn(i)} w={len} width={4} color={lit ? C.cyan : U.link} />
            </Abs>
            {pos !== undefined && <div style={{ position: "absolute", left: x0 + pos * (len - 8) - 9, top: NODE.y + NODE.h / 2 - 9, width: 18, height: 18, borderRadius: 9, background: C.cyan, boxShadow: `0 0 0 4px ${C.white}` }} />}
          </React.Fragment>
        );
      })}
      {[1, 2, 3].map((i) => {
        const a = nodeIn(i);
        if (a <= 0) return null;
        const fl = Math.max(...sweeps.filter((s) => s[0] === i - 1).map((s) => flash(g, s[1] + 0.26)));
        return (
          <Abs key={i} x={nodeX(i)} y={NODE.y} w={NODE.w} h={NODE.h} o={Math.min(1, a * 1.4)} dx={i === 3 ? (1 - a) * 260 : 0} dy={i === 3 ? 0 : (1 - a) * 40}>
            <div style={card({ border: `3px solid ${mix(U.skel, C.cyan, fl)}`, boxShadow: SHADOW.soft })} />
            <NodeBody g={g} i={i} />
          </Abs>
        );
      })}
      {tools.map(([t, i, at]) => {
        const a = k(g, at, 0.5, IN);
        return a > 0 && (
          <React.Fragment key={t}>
            <Box x={nodeX(i) + NODE.w - 12} y={NODE.y - 8} w={72} h={72} o={Math.min(1, a * 2)} style={{ transform: `translateY(${(1 - a) * -360}px)`, zIndex: 3 }}><ToolTile tool={t} size={72} /></Box>
            {(() => { const n = k(g, off(at, 0.4), 0.3) * (1 - k(g, off(at, 1.7), 0.3)); return n > 0 && (
              <div style={{ position: "absolute", left: nodeX(i) + NODE.w / 2, top: NODE.y + NODE.h + 12, transform: `translate(-50%, ${(1 - n) * -8}px)`, opacity: n, zIndex: 4 }}>
                <Pill bg={C.navy} color={C.white} size={20}>{t === "make" ? "Make" : "n8n"}</Pill>
              </div>
            ); })()}
          </React.Fragment>
        );
      })}
      {/* the run log */}
      <div style={{ position: "absolute", left: 70, top: 396, width: 1300, height: 250, borderRadius: 20, background: C.white, border: `2px solid ${U.skel}`, opacity: k(g, "flow+0.4", 0.4) }}>
        {log.map((l, j) => {
          const a = k(g, l.at, 0.4);
          return a > 0 && (
            <div key={j} style={{ position: "absolute", left: 30, top: 26 + j * 52, right: 30, display: "flex", alignItems: "center", gap: 14, opacity: a, transform: `translateX(${(1 - a) * -24}px)` }}>
              <Check size={30} />
              <span style={{ flex: 1, ...txt(24, 600) }}>{l.t}</span>
              <span style={txt(19, 600, C.muted)}>now</span>
            </div>
          );
        })}
      </div>
    </>
  );
};

// ---- the client's phone: the follow-up email arrives (the reference's phone, coming back) ------------------------------
const EmailPhone: React.FC<{ g: number }> = ({ g }) => {
  const P = trk(g, [["run-0.3", 2250, 700, 1], ["run+0.3", 1590, 700, 1, IN], ["n8n+0.4", 1600, 692, 1], ["n8n+0.8", 2250, 692, 1, OUT]]);
  if (g < T.f("run-0.3") || g > T.f("n8n+0.8")) return null;
  const m = k(g, "run+0.12", 0.45);
  return (
    <Box x={P[0]} y={P[1]} w={PHONE.w} h={PHONE.h} s={0.78}>
      <Phone>
        <div style={{ position: "absolute", left: 0, top: 0, width: PHONE.w - 26, height: 140, background: C.navy }} />
        <div style={{ position: "absolute", left: 26, top: 78, display: "flex", alignItems: "center", gap: 12, ...txt(28, 800, C.white) }}><Icon name="mail" size={30} color={C.white} />Inbox</div>
        <div style={{ position: "absolute", left: 16, top: 160 + (1 - m) * -40, width: PHONE.w - 58, height: 250, borderRadius: 20, background: C.white, border: `3px solid ${C.cyan}`,
          boxShadow: SHADOW.soft, opacity: Math.min(1, m * 1.6), boxSizing: "border-box" }}>
          <div style={{ position: "absolute", left: 20, top: 20, display: "flex", alignItems: "center", gap: 10 }}><IconBox name="mail" size={44} bg={C.cyanSoft} /><span style={txt(20, 700, C.muted)}>Follow-up · now</span></div>
          <div style={{ position: "absolute", left: 20, top: 84, width: PHONE.w - 100, ...txt(24, 700), whiteSpace: "normal", lineHeight: 1.25 }}>Thanks, Jordan! Here's what happens next.</div>
          <Skel w={240} style={{ position: "absolute", left: 20, top: 180 }} /><Skel w={180} style={{ position: "absolute", left: 20, top: 204 }} />
        </div>
        {[0, 1, 2].map((j) => (
          <div key={j} style={{ position: "absolute", left: 16, top: 430 + j * 92 + (1 - m) * 40, width: PHONE.w - 58, height: 78, borderRadius: 16, background: C.white, border: `2px solid ${U.skel}`, boxSizing: "border-box" }}>
            <Skel w={170} style={{ position: "absolute", left: 18, top: 22 }} /><Skel w={110} style={{ position: "absolute", left: 18, top: 46 }} />
          </div>
        ))}
      </Phone>
    </Box>
  );
};

// ---- the window ------------------------------------------------------------------------------------------------------
export const Main: React.FC<{ g: number }> = ({ g }) => {
  // the window rises a short way into place and stays whole in the frame, clear of the corner mark; it only creeps
  // (≤ 3 % a second), and cards lift out of it for emphasis
  const W = trk(g, [["audit+0.1", 960, 980, 0], ["audit+0.9", 960, 560, 1, IN], ["need-0.3", 960, 560, 1], ["need+0.02", 960, 860, 0, OUT]]);
  if (W[2] <= 0) return null;
  // one slow growth across the whole act (no reset at each change of body)
  const v = [0, 0, 0.97 * trk(g, [["audit", 1], ["audit+0.9", 1], ["need", 1.05]])[0]];
  const presence = (d: number) => ({ opacity: k(g, off("board+0.3", d), 0.3) * (1 - k(g, "form", 0.3)), transform: `scale(${0.5 + 0.5 * k(g, off("board+0.3", d), 0.45)})` });
  const running = k(g, "run+0.1", 0.35);
  const right = (
    <div style={{ position: "relative", height: 72, width: 300 }}>
      <div style={{ position: "absolute", right: 0, top: 10, display: "flex" }}>
        <div style={presence(0)}><Avatar size={52} kb ring={C.white} /></div>
        <div style={{ marginLeft: 10, ...presence(0.12) }}><Avatar size={52} text="You" bg={C.cyan} ring={C.white} /></div>
      </div>
      {running > 0 && <div style={{ position: "absolute", right: 0, top: 15, opacity: running }}><Pill bg={C.white} color={C.navy} size={20} dot={C.cyan}>Running</Pill></div>}
    </div>
  );
  const title = (
    <>
      <BarTitle g={g} text="" at="audit+0.3" out="board"><Typed g={g} text="Process audit" at="audit+0.4" cps={24} caret={false} /></BarTitle>
      <BarTitle g={g} text="Build board" at="board+0.1" out="form" />
      <BarTitle g={g} text="Client intake" at="form+0.1" out="flow" />
      <BarTitle g={g} text="Workflow" at="flow+0.1" />
    </>
  );
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080 }}>
      <Box x={W[0]} y={W[1]} w={1440} h={820} s={v[2]} o={W[2]}>
        <Win w={1440} h={820} title={title} right={right}>
          <Audit g={g} />
          <Board g={g} />
          {g < T.f("need+0.6") && g >= T.f("form") && <FormCard g={g} />}
          <Flow g={g} />
        </Win>
      </Box>
      <EmailPhone g={g} />
    </div>
  );
};
