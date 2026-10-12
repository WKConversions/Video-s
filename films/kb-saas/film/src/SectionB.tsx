// 09–17: the pill opens into a workspace built around the business's tasks; connect, automate, simplify, operations;
// the AI agent answers; custom software develops; everything stacks and the question rewrites itself into the answer.
import React from "react";
import { Img, staticFile } from "remotion";
import { ARRIVE, C, F, MOVE, PUSH, SHADOW, SHADOW_SOFT, W, at, clamp01, expoOut, lerp, mix, pr, px, pxi, rgba } from "./lib";
import { BusinessChip, KBMark, TaskPill, tw } from "./parts";
import { Chip, Shimmer } from "./ui";
import { Icon } from "./icons";
import { pillState } from "./SectionA";

const HOOK_TASKS = ["Follow-ups", "CRM updates", "Payment confirmations", "Excel files", "Outreach"];

// ---- 09 built around your business ------------------------------------------------------------------------------
const CARD = { x: 960, top: 190, w: 1320, h: 740 };
const ROW_Y = (i: number) => 372 + i * 104;
const ROW_X = 380;

const Workspace: React.FC<{ g: number }> = ({ g }) => {
  const built = W("w:built", -0.1), around = W("w:around", -0.1), biz = W("w:business2", -0.08), lift = W("w:business2", 0.45);
  if (g < built || g > lift + 12) return null;
  const out = pxi(g, lift, 9, 0.75);
  const oy = -1150 * out;
  const mv = pr(g, built, 16, MOVE);
  const ps = pillState(g);
  const pillX = lerp(960, 1450, mv), pillY = lerp(540, 268, mv), pillS = lerp(ps.push, 0.49, mv);
  const wpush = 1 + 0.2 * pr(g, W("w:around", 0.1), 34, MOVE);
  // the workspace is built around the business's tasks: the card grows out from around them to its full size
  const widths = HOOK_TASKS.map((tk) => tw(tk, 44, 600) + 44 * 3.2);
  const bx0 = ROW_X - 30, bx1 = ROW_X + Math.max(...widths) + 30, by0 = ROW_Y(0) - 46 - 30, by1 = ROW_Y(4) + 46 + 30;
  const grow = pr(g, around, 22, ARRIVE);
  const L = lerp(bx0, CARD.x - CARD.w / 2, grow), R = lerp(bx1, CARD.x + CARD.w / 2, grow);
  const T0 = lerp(by0, CARD.top, grow), B = lerp(by1, CARD.top + CARD.h, grow);
  const edge = clamp01((g - around) / 6) * (1 - clamp01((grow - 0.6) / 0.4));
  return (
    <div style={{ position: "absolute", inset: 0, transform: `translateY(${oy}px) scale(${wpush})`, transformOrigin: "760px 520px" }}>
      {g >= around && (
        <div style={{ position: "absolute", left: L, top: T0, width: R - L, height: B - T0, borderRadius: lerp(30, 40, grow), background: C.white,
          boxShadow: SHADOW, border: `${lerp(1.5, 3, edge)}px solid ${mix(rgba(C.navy, 0.06), C.cyan, edge)}`, boxSizing: "border-box",
          opacity: clamp01((g - around) / 5) }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: CARD.top + 156 - T0, height: 1.5, background: C.line, opacity: clamp01((grow - 0.7) / 0.3) }} />
        </div>
      )}
      {HOOK_TASKS.map((tk, i) => {
        if (i === 1 && g >= lift) return null;                     // CRM updates lifts out (Connect)
        const a = built + 10 + i * 3;
        if (g < a) return null;
        const k = clamp01((g - a) / 14);
        return <div key={i} style={{ position: "absolute", left: ROW_X, top: ROW_Y(i) - 46 + 30 * (1 - ARRIVE(k)), opacity: clamp01((g - a) / 8) }}>
          <TaskPill label={tk} size={44} /></div>;
      })}
      {g >= biz && (
        <div style={{ position: "absolute", left: 360, top: 268 - 50 + 24 * (1 - ARRIVE(clamp01((g - biz) / 14))), opacity: clamp01((g - biz) / 8) }}><BusinessChip h={100} /></div>
      )}
      <div style={at(pillX, pillY, pillS)}><KBMark h={ps.h} m={1} open={ps.open} words={ps.words} /></div>
    </div>
  );
};

// ---- 10–13 connect, automate, simplify, operations ----------------------------------------------------------------
type Rect = { x: number; y: number; w: number; h: number; r: number };
const rl = (a: Rect, b: Rect, t: number): Rect => ({ x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t), w: lerp(a.w, b.w, t), h: lerp(a.h, b.h, t), r: lerp(a.r, b.r, t) });
const Box: React.FC<{ R: Rect; bg?: string; children?: React.ReactNode; shadow?: string; z?: number }> = ({ R, bg = C.white, children, shadow = SHADOW, z }) => (
  <div style={{ position: "absolute", left: R.x - R.w / 2, top: R.y - R.h / 2, width: R.w, height: R.h, borderRadius: R.r, background: bg, boxShadow: shadow,
    border: `1.5px solid ${rgba(C.navy, 0.06)}`, overflow: "hidden", zIndex: z }}>{children}</div>
);

const EndChip: React.FC<{ icon: string; label: string }> = ({ icon, label }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 18, height: 128, padding: "0 40px 0 30px", borderRadius: 36, background: C.white,
    boxShadow: SHADOW_SOFT, border: `1.5px solid ${rgba(C.navy, 0.08)}` }}>
    <div style={{ width: 76, height: 76, borderRadius: 22, background: C.paleCool, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Icon name={icon} size={46} color={C.navy} stroke={2} /></div>
    <span style={{ fontFamily: F.ui, fontWeight: 700, fontSize: 52, color: C.ink, whiteSpace: "nowrap" }}>{label}</span>
  </div>
);

/** A label that blurs out and the next blurs in, in place (technique 23). */
const BlurSwap: React.FC<{ g: number; at: number; a: React.ReactNode; b: React.ReactNode }> = ({ g, at: a0, a, b }) => {
  const outP = clamp01((g - a0) / 5), inP = clamp01((g - a0 - 6) / 9);
  return (
    <div style={{ position: "relative" }}>
      {outP < 1 && <div style={{ filter: `blur(${10 * outP}px)`, opacity: 1 - outP }}>{a}</div>}
      {inP > 0 && <div style={{ position: outP < 1 ? "absolute" : "relative", left: 0, top: 0, filter: `blur(${10 * (1 - ARRIVE(inP))}px)`, opacity: inP }}>{b}</div>}
    </div>
  );
};

const Systems: React.FC<{ g: number }> = ({ g }) => {
  const lift = W("w:business2", 0.45), conn = W("w:connect", 0.05), tools = W("w:tools2", -0.05);
  const push = W("w:automate", -0.37), req = push, wf = W("w:workflows", -0.3);
  const simp = W("w:simplify", -0.12), ops = W("w:operations", -0.12);
  const agentOpen = W("w:operations", 0.75);
  if (g < lift || g >= agentOpen) return null;
  // the lifted "CRM updates" pill → the connection card
  const pillFrom: Rect = { x: ROW_X + (tw("CRM updates", 44, 600) + 44 * 3.2) / 2, y: ROW_Y(1), w: tw("CRM updates", 44, 600) + 44 * 3.2, h: 92, r: 46 };
  const pillMid: Rect = { x: 960, y: 540, w: pillFrom.w * 1.25, h: 115, r: 58 };
  const cardA: Rect = { x: 960, y: 560, w: 1440, h: 320, r: 44 };
  const t1 = pr(g, lift, 13, MOVE);
  const t2 = px(g, lift + 12, 12, 0.8);
  let R1 = t2 > 0 ? rl(pillMid, cardA, t2) : rl(pillFrom, pillMid, t1);
  // pushed up to a lip by the request (chat scroll)
  const pushY = -470 * pr(g, push, 18, PUSH);
  R1 = { ...R1, y: R1.y + pushY };
  // the request bubble, then the workflow card landing on it
  const reqW = 18 + 68 + 22 + tw("Automate our follow-ups", 46, 500) + 50;
  const reqE = px(g, req, 18, 0.8);
  const recede = pr(g, wf + 8, 12, MOVE);
  let R2: Rect = { x: 1600 - reqW / 2, y: lerp(1260, 330, reqE) - 34 * recede, w: reqW * (1 - 0.08 * recede), h: 104 * (1 - 0.08 * recede), r: 52 };
  const wfE = px(g, wf, 18, 0.8);
  let R3: Rect = { x: 960, y: lerp(1400, 668, wfE), w: 1320, h: 430, r: 40 };
  // simplify: everything gathers into one deck; operations: the deck flattens into one line
  const sp = pr(g, simp - 2, 22, MOVE), op = pr(g, ops, 14, MOVE);
  const D1: Rect = { x: 960, y: 452, w: 980, h: 300, r: 40 }, D2: Rect = { x: 960, y: 488, w: 1040, h: 300, r: 40 }, D3: Rect = { x: 960, y: 540, w: 1100, h: 320, r: 40 };
  const ROW: Rect = { x: 960, y: 540, w: 1100, h: 132, r: 66 };
  if (sp > 0) { R1 = rl(R1, D1, sp); R2 = rl(R2, D2, sp); R3 = rl(R3, D3, sp); }
  if (op > 0) { R1 = rl(R1, ROW, op); R2 = rl(R2, ROW, op); R3 = rl(R3, ROW, op); }
  const fadeIn = 1 - clamp01(sp * 2.2);                       // contents leave as the deck gathers
  const push1 = lerp(1 + 0.3 * pr(g, conn - 2, 40, MOVE), 1, sp);
  const push3 = lerp(1 + 0.24 * pr(g, wf + 10, 36, MOVE), 1, sp);
  const opPush = 1;
  // connection contents
  const chipsOut = px(g, lift + 12, 12, 0.8);
  const lineOn = g >= lift + 18;
  const draw = pr(g, conn + 3, 10, MOVE);
  const capsule = (k: number) => {
    const a = tools + k * 10;
    if (g < a || g > a + 22) return null;
    const bud = px(g, a, 6, 0.8), tr = pr(g, a + 6, 11, MOVE), merge = clamp01((g - a - 17) / 4);
    const x0 = -300, x1 = 300;
    return <div key={k} style={at(lerp(x0, x1, tr), 0, bud * (1 - merge))}><div style={{ background: C.navy, color: "#fff", fontFamily: F.ui, fontWeight: 600, fontSize: 28,
      padding: "10px 22px", borderRadius: 30, boxShadow: SHADOW_SOFT }}>Data</div></div>;
  };
  const showReq = g >= req, showWf = g >= wf;
  const toggle = pr(g, wf + 6, 6, MOVE);
  // the run: a dot passes through three steps, ticking each, and loops
  const run0 = wf + 12, period = 36;
  const rt = g < run0 ? -1 : (g - run0) % period, loopN = g < run0 ? -1 : Math.floor((g - run0) / period);
  const STEPS = ["Scheduled task", "Conditional logic", "Follow-up sent"];
  const sx = [-400, 0, 400];
  const dotX = rt < 0 ? sx[0] : rt < 24 ? lerp(sx[0], sx[2], rt / 24) : sx[2];
  const ticked = (i: number) => rt >= 0 && (rt >= (i * 12) || loopN > 0 && rt < 2);
  const opsOn = g >= ops + 8;
  return (
    <>
      <div style={{ position: "absolute", inset: 0, transform: `scale(${push1 * opPush})`, transformOrigin: `${R1.x}px ${R1.y - 20}px` }}>
      <Box R={R1} shadow={op > 0.5 ? "none" : SHADOW}>
        <div style={{ position: "absolute", inset: 0, opacity: t2 > 0 ? fadeIn : 0 }}>
          <div style={{ position: "absolute", left: 44, top: 30, fontFamily: F.ui, fontWeight: 600, fontSize: 30, color: C.muted2, opacity: clamp01((g - lift - 16) / 3) }}>CRM updates</div>
          <div style={{ position: "absolute", left: R1.w / 2, top: R1.h / 2 + 16 }}>
            {lineOn && (
              <svg style={{ position: "absolute", left: -300, top: -6, overflow: "visible" }} width={600} height={12}>
                <line x1={0} y1={6} x2={600} y2={6} stroke="#B8C0CA" strokeWidth={4} strokeDasharray="12 10" />
                <line x1={0} y1={6} x2={600 * draw} y2={6} stroke={C.cyan} strokeWidth={6} strokeLinecap="round" />
              </svg>
            )}
            {lineOn && <div style={at(0, -62)}>
              <BlurSwap g={g} at={tools} a={<Chip text="Manual" tone="grey" size={28} />} b={<Chip text="Connected" tone="cyan" size={28} />} /></div>}
            {[0, 1, 2, 3, 4, 5].map(capsule)}
            <div style={at(lerp(0, -440, chipsOut), 0, 0.6 + 0.4 * chipsOut, chipsOut > 0 ? 1 : 0)}><EndChip icon="crm" label="CRM" /></div>
            <div style={at(lerp(0, 440, chipsOut), 0, 0.6 + 0.4 * chipsOut, chipsOut > 0 ? 1 : 0)}><EndChip icon="users" label="Support desk" /></div>
          </div>
        </div>
        {t2 <= 0 && (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", paddingLeft: 30, gap: 22 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, border: `3px solid #C9CFD8` }} />
            <span style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 44 * R1.h / 92, color: C.ink, whiteSpace: "nowrap" }}>CRM updates</span>
          </div>
        )}
      </Box>
      </div>
      {showReq && (
        <div style={{ position: "absolute", inset: 0, transform: `scale(${opPush})`, transformOrigin: "960px 540px" }}>
        <Box R={R2} bg={mix(C.pale, C.white, sp)} shadow={sp > 0 ? SHADOW : "none"}>
          <div style={{ position: "absolute", left: 0, top: 0, width: reqW, height: 104, display: "flex", alignItems: "center", gap: 22, paddingLeft: 18,
            opacity: fadeIn, transform: `scale(${R2.w / reqW})`, transformOrigin: "0 0", boxSizing: "border-box" }}>
            <div style={{ width: 68, height: 68, borderRadius: 34, background: C.white, display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
              <Icon name="users" size={38} color={C.navy} stroke={2.1} /></div>
            <span style={{ fontFamily: F.ui, fontWeight: 500, fontSize: 46, color: C.ink, whiteSpace: "nowrap" }}>Automate our follow-ups</span>
          </div>
        </Box>
        </div>
      )}
      {showReq && sp < 0.3 && <div style={{ position: "absolute", left: R2.x + R2.w / 2 - 170, top: R2.y - R2.h / 2 - 50, fontFamily: F.ui, fontWeight: 600,
        fontSize: 28, color: C.muted2, opacity: 1 - sp * 3.3 }}>Your team</div>}
      {showWf && (
        <div style={{ position: "absolute", inset: 0, transform: `scale(${push3 * opPush})`, transformOrigin: `${R3.x}px ${R3.y + 60}px` }}>
        <Box R={R3}>
          <div style={{ position: "absolute", left: 0, top: 0, width: 1320, height: 430, opacity: fadeIn, transform: `scale(${R3.w / 1320})`, transformOrigin: "0 0" }}>
            <div style={{ position: "absolute", left: 56, top: 50, display: "flex", alignItems: "center", gap: 24 }}>
              <Img src={staticFile("img/tools/n8n.png")} style={{ width: 64, height: 64, borderRadius: 14 }} />
              <span style={{ fontFamily: F.ui, fontWeight: 700, fontSize: 56, color: C.ink }}>Follow-ups</span>
              <span style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 30, color: C.muted2, marginLeft: 8 }}>Workflow</span>
            </div>
            <div style={{ position: "absolute", right: 56, top: 58, width: 116, height: 64, borderRadius: 32, background: mix("#D5DAE1", C.navy, toggle) }}>
              <div style={{ position: "absolute", top: 7, left: lerp(7, 59, toggle), width: 50, height: 50, borderRadius: 25, background: "#fff", boxShadow: "0 2px 6px rgba(0,0,0,.2)" }} />
            </div>
            <div style={{ position: "absolute", left: 660, top: 280 }}>
              <svg style={{ position: "absolute", left: -400, top: -3, overflow: "visible" }} width={800} height={6}>
                <line x1={0} y1={3} x2={800} y2={3} stroke={C.line} strokeWidth={5} />
              </svg>
              {rt >= 0 && <div style={at(dotX, 0)}><div style={{ width: 26, height: 26, borderRadius: 13, background: C.cyan, boxShadow: `0 0 0 8px ${rgba(C.cyan, 0.25)}` }} /></div>}
              {STEPS.map((s, i) => (
                <div key={i} style={at(sx[i], 0)}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14, height: 96, padding: "0 28px", borderRadius: 48, background: C.white,
                    border: `3px solid ${ticked(i) ? C.cyan : C.line}`, whiteSpace: "nowrap" }}>
                    <div style={{ width: 40, height: 40, borderRadius: 20, background: ticked(i) ? C.navy : C.paleCool, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {ticked(i) && <Icon name="check" size={30} color="#fff" stroke={3} />}</div>
                    <span style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 34, color: C.ink }}>{s}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {opsOn && <OpsRow g={g} a={ops + 8} />}
        </Box>
        </div>
      )}
    </>
  );
};

const OpsRow: React.FC<{ g: number; a: number }> = ({ g, a }) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: 1100, height: 132, display: "flex", alignItems: "center", paddingLeft: 36, gap: 26 }}>
    <div style={{ width: 72, height: 72, borderRadius: 36, background: C.cyan, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Icon name="check" size={46} color={C.navy} stroke={3.2} /></div>
    <span style={{ fontFamily: F.ui, fontWeight: 700, fontSize: 68, color: C.ink }}>Operations</span>
    {g >= a + 6 && <div style={{ marginLeft: "auto", marginRight: 40 }}><Chip text="Runs smoothly" tone="green" size={32} /></div>}
  </div>
);

// ---- 14–15 the agent, then custom software -----------------------------------------------------------------------
const Agent: React.FC<{ g: number }> = ({ g }) => {
  const a = W("w:operations", 0.75), intel = W("w:intelligent", -0.07), ai = W("w:ai", -0.1), agents = W("w:agents", -0.05), out = W("w:to", -0.1);
  if (g < a || g > out + 10) return null;
  const mv = pr(g, a, 20, MOVE);                            // the line rises and opens into the panel in one move
  const up = mv, open = mv;
  const ex = pxi(g, out, 8, 0.72);
  const w = 1100, h = lerp(132, 560, open);
  const apush = 1 + 0.16 * pr(g, intel, 46, MOVE);              // pushed to as the agent works and answers
  const top = lerp(540 - 66, 300 - 66, up) - 1300 * ex;
  const bodyE = px(g, intel, 10, 0.8);
  const words = ["CRM updated", "Follow-ups sent"];
  const streamN = clamp01((g - ai) / 7) * 4;              // four words in about 7 frames
  const streamed = (i: number) => (i === 0 ? clamp01(streamN) + clamp01(streamN - 1) : clamp01(streamN - 2) + clamp01(streamN - 3));
  const done = g >= agents + 1;
  return (
    <div style={{ position: "absolute", left: 960 - w / 2, top, width: w, height: h, borderRadius: lerp(66, 44, open), background: C.white, boxShadow: SHADOW,
      border: `1.5px solid ${rgba(C.navy, 0.06)}`, overflow: "hidden", transform: `scale(${apush})`, transformOrigin: "40% 75%" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1100, height: 132, display: "flex", alignItems: "center", paddingLeft: 36, gap: 26 }}>
        <div style={{ width: 72, height: 72, borderRadius: 36, background: C.cyan, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name="check" size={46} color={C.navy} stroke={3.2} /></div>
        <span style={{ fontFamily: F.ui, fontWeight: 700, fontSize: 68, color: C.ink }}>Operations</span>
        <div style={{ marginLeft: "auto", marginRight: 40 }}><Chip text="Runs smoothly" tone="green" size={32} /></div>
      </div>
      <div style={{ position: "absolute", left: 40, right: 40, top: 150, height: 1.5, background: C.line, opacity: clamp01((open - 0.5) / 0.5) }} />
      {g >= intel && (
        <div style={{ position: "absolute", left: 50, top: 200 + 30 * (1 - bodyE), display: "flex", alignItems: "center", gap: 30 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, background: C.navy, color: "#fff", borderRadius: 40, padding: "16px 30px 16px 22px" }}>
            <Icon name="spark" size={44} color={C.cyan} stroke={2.2} />
            <span style={{ fontFamily: F.ui, fontWeight: 700, fontSize: 42 }}>AI agent</span>
          </div>
          <BlurSwap g={g} at={agents - 5}
            a={<Shimmer text="Working in the background" size={46} t={(g - intel) / 30} speed={700} />}
            b={<Chip text="Done" tone="green" size={34} icon="check" />} />
        </div>
      )}
      {g >= intel && g < ai + 10 && <AgentInputs g={g} a={intel} end={ai} />}
      {g >= ai && (
        <div style={{ position: "absolute", left: 50, top: 340 + 20 * (1 - px(g, ai, 8, 0.8)), display: "flex", gap: 22 }}>
          {words.map((wd, i) => {
            const n = streamed(i);
            if (n <= 0) return null;
            const parts = wd.split(" ");
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, background: C.cyanPale, borderRadius: 30, padding: "22px 30px",
                border: `1.5px solid ${rgba(C.cyan, 0.35)}` }}>
                <div style={{ width: 46, height: 46, borderRadius: 23, background: C.navy, display: "flex", alignItems: "center", justifyContent: "center", opacity: n >= 2 ? 1 : 0 }}>
                  <Icon name="check" size={32} color="#fff" stroke={3} /></div>
                <span style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 50, color: C.ink, whiteSpace: "nowrap" }}>
                  {parts.slice(0, Math.ceil(n)).join(" ")}</span>
                {!done && n < 2 && <div style={{ width: 16, height: 16, borderRadius: 8, background: C.cyan }} />}
              </div>
            );
          })}
        </div>
      )}
      {done && false}
    </div>
  );
};

/** While the agent works, the records it works on stream in from the left and into it (technique 35). */
const AgentInputs: React.FC<{ g: number; a: number; end: number }> = ({ g, a, end }) => {
  const ICONS_IN = ["mail", "crm", "sheet", "form", "invoice", "calendar", "chat", "mail", "crm", "sheet"];
  const fade = 1 - clamp01((g - end) / 8);
  return (
    <div style={{ position: "absolute", left: 0, top: 300, width: 1100, height: 240, opacity: fade, overflow: "hidden" }}>
      {ICONS_IN.map((ic, i) => {
        const s0 = a - 6 + i * 3;
        if (g < s0) return null;
        const tt = g - s0;
        const x = 1040 - tt * 32;                 // already moving, at constant speed, towards the agent chip
        if (x < 120) return null;
        const o = clamp01((x - 120) / 120);
        return (
          <div key={i} style={{ position: "absolute", left: x, top: 40 + (i % 3) * 62, opacity: o, display: "flex", alignItems: "center", gap: 12,
            background: C.white, border: `1.5px solid ${C.line}`, borderRadius: 18, padding: "10px 16px", boxShadow: SHADOW_SOFT }}>
            <Icon name={ic} size={30} color={C.navy} stroke={2} />
            <div style={{ width: 90, height: 12, borderRadius: 6, background: "#D5DBE3" }} />
          </div>
        );
      })}
    </div>
  );
};

/** The custom dashboard: rises in false colour on "custom", develops on "software"; the chart draws itself. */
const DASH = { w: 1440, h: 800 };
export const Dashboard: React.FC<{ g: number; dev: number; chart: number; band: number }> = ({ g, dev, chart, band }) => {
  const pts = [0, 0.12, 0.08, 0.3, 0.26, 0.44, 0.4, 0.62, 0.58, 0.78, 0.9];
  const cw = 980, ch = 300;
  const path = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${(i / (pts.length - 1)) * cw} ${ch - p * ch * 0.9 - 10}`).join(" ");
  return (
    <div style={{ width: DASH.w, height: DASH.h, borderRadius: 40, background: C.white, boxShadow: SHADOW, overflow: "hidden", position: "relative",
      border: `1.5px solid ${rgba(C.navy, 0.06)}` }}>
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 300, background: C.paleCool, padding: "44px 26px", boxSizing: "border-box" }}>
        {[["grid", "Overview"], ["bolt", "Workflows"], ["spark", "Agents"], ["chart", "Reports"]].map(([ic, lb], i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, height: 74, padding: "0 18px", borderRadius: 20, marginBottom: 10,
            background: i === 0 ? C.white : "transparent", boxShadow: i === 0 ? SHADOW_SOFT : "none" }}>
            <Icon name={ic} size={34} color={i === 0 ? C.navy : C.muted2} stroke={2} />
            <span style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 30, color: i === 0 ? C.ink : C.muted }}>{lb}</span>
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: 360, top: 46, fontFamily: F.ui, fontWeight: 700, fontSize: 60, color: C.ink }}>Dashboard</div>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{ position: "absolute", left: 360 + i * 340, top: 160, width: 310, height: 130, borderRadius: 24, background: C.paleCool, padding: 26, boxSizing: "border-box" }}>
          <div style={{ width: 120, height: 16, borderRadius: 8, background: "#D5DBE3" }} />
          <div style={{ width: [170, 140, 190][i], height: 34, borderRadius: 12, background: i === 0 ? C.navy : "#C5CDD7", marginTop: 26 }} />
        </div>
      ))}
      <div style={{ position: "absolute", left: 360, top: 330, width: 1020, height: 400, borderRadius: 28, border: `1.5px solid ${C.line}`, padding: 20, boxSizing: "border-box" }}>
        <svg width={cw} height={ch + 40} style={{ position: "absolute", left: 20, top: 40 }}>
          {[0, 1, 2, 3].map((i) => <line key={i} x1={0} x2={cw} y1={i * ch / 3} y2={i * ch / 3} stroke={C.line} strokeWidth={2} />)}
          <defs><linearGradient id="ar" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={C.cyan} stopOpacity={0.28} /><stop offset="1" stopColor={C.cyan} stopOpacity={0} /></linearGradient></defs>
          <clipPath id="cl"><rect x={0} y={-20} width={cw * chart} height={ch + 40} /></clipPath>
          <g clipPath="url(#cl)">
            <path d={`${path} L ${cw} ${ch} L 0 ${ch} Z`} fill="url(#ar)" />
            <path d={path} fill="none" stroke={C.cyan} strokeWidth={7} strokeLinejoin="round" strokeLinecap="round" />
          </g>
          {chart > 0 && chart < 1 && <circle cx={cw * chart} cy={ch - (pts[Math.min(pts.length - 1, Math.floor(chart * (pts.length - 1)))]) * ch * 0.9 - 10} r={11} fill={C.navy} />}
        </svg>
      </div>
      {/* false colour while it is being made (technique 40): a deep tint crossed by a lighter band that rises as it develops */}
      {dev < 1 && (
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, ${rgba("#1F5F86", 0.86 * (1 - dev))} 0%, ${rgba("#1F5F86", 0.86 * (1 - dev))} ${band * 100 - 12}%, ${rgba(C.cyan, 0.75 * (1 - dev))} ${band * 100}%, ${rgba("#1F5F86", 0.86 * (1 - dev))} ${band * 100 + 12}%)`,
          mixBlendMode: "multiply" }} />
      )}
    </div>
  );
};

const Software: React.FC<{ g: number }> = ({ g }) => {
  const a = W("w:custom", -0.12), sw = W("w:software", -0.05), shrink = W("w:everything2", -0.6), end = W("w:together2", 0.2);
  if (g < a || g > end) return null;
  const rise = px(g, a, 18, 0.8);
  const dev = pr(g, sw, 15, MOVE);
  const band = 1 - pr(g, sw - 2, 17, MOVE);
  const chart = pr(g, sw + 2, 30, MOVE);
  // into the stack: shrinks and rises as the back card
  const s = pr(g, shrink, 14, MOVE);
  const dpush = 1 + 0.3 * pr(g, sw - 6, 36, MOVE);
  const sc = lerp(dpush, 0.36, s), y = lerp(lerp(1500, 560, rise), 344, s);
  return <div style={{ ...at(960, y, sc), transformOrigin: s > 0 ? "50% 50%" : "60% 66%" }}><Dashboard g={g} dev={dev} chart={chart} band={band} /></div>;
};

// ---- 16–17 everything works together -----------------------------------------------------------------------------
const Together: React.FC<{ g: number; layer: "back" | "front" }> = ({ g, layer }) => {
  const shrink = W("w:everything2", -0.6), qa = W("w:everything2", -0.22), ev = W("w:everything2", -0.03);
  const works = W("w:works", -0.07), tog = W("w:together2", -0.05), exit = W("w:analyze", -0.68);
  if (g < shrink || g > exit + 10) return null;
  // the systems built so far, as the lips of a stack behind the dashboard (each in its tint)
  const lips = [["link", C.paleCool], ["bolt", C.pale], ["spark", C.cyanPale]] as const;
  const flood = g >= tog ? 2300 * expoOut(24, 0.86)(clamp01((g - tog) / 24)) : 0;
  // the question returns, then rewrites itself
  const qE = px(g, qa, 16, 0.8);
  const col = pr(g, works, 6, MOVE);
  const big = pr(g, tog, 20, ARRIVE);
  const size = lerp(78, 108, big);
  const ex = pxi(g, exit, 8, 0.75);
  const qy = lerp(lerp(1300, 760, qE), 540, big) - 1000 * ex;
  const qz = 1 + 0.16 * pr(g, qa + 8, 30, MOVE) * (1 - big);
  const words: { t: string; w: number }[] = [
    { t: "What", w: 1 - col }, { t: "if", w: 1 - col }, { t: col > 0.5 ? "Everything" : "everything", w: 1 }, { t: "just", w: 1 - col },
    { t: col > 0.5 ? "works" : "worked", w: 1 }, { t: g >= tog ? "together." : "together?", w: 1 },
  ];
  const wt = big > 0.5 ? 700 : 500;
  const sp = tw(" ", size, wt);
  const widths = words.map((wd) => (tw(wd.t, size, wt) + sp) * wd.w);
  const total = widths.reduce((x, y) => x + y, 0) - sp;
  const padX = size * 0.75, padY = size * 0.42;
  const underline = pr(g, ev + 2, 8, MOVE) * (1 - col);
  let cx = -total / 2;
  if (layer === "back") return (
    <>
      {lips.map(([ic, bg], i) => {
        const a = shrink + 7 + i * 2;
        if (g < a) return null;
        const e = px(g, a, 12, 0.8);
        const yy = 344 - 36 * (3 - i) + 40 * (1 - e);
        const ww = 1440 * 0.36 - (3 - i) * 28;
        return <div key={i} style={{ ...at(960, yy), zIndex: 0 }}>
          <div style={{ width: ww, height: 288, borderRadius: 18, background: bg, boxShadow: SHADOW_SOFT, border: `1.5px solid ${rgba(C.navy, 0.07)}`, position: "relative" }}>
            <div style={{ position: "absolute", left: 18, top: 6 }}><Icon name={ic} size={24} color={C.navy} stroke={2.2} /></div>
          </div></div>;
      })}
    </>
  );
  return (
    <>
      {flood > 0 && <div style={{ position: "absolute", inset: 0, background: C.cyan, clipPath: `circle(${flood}px at 960px 760px)` }} />}
      {g >= qa && (
        <div style={at(960, qy, qz)}>
          <div style={{ position: "relative", width: total + 2 * padX, height: size * 1.24 + 2 * padY, borderRadius: size * 0.8,
            background: big > 0 ? rgba(C.pale, 1 - clamp01(big * 3)) : C.pale }}>
            {words.map((wd, i) => {
              const left = padX + cx; cx += widths[i];
              if (wd.w <= 0.01) return null;
              const color = mix(C.ink, C.navy, big);
              return (
                <span key={i} style={{ position: "absolute", left: left + total / 2, top: padY, fontFamily: F.ui, fontWeight: wt,
                  fontSize: size, color, opacity: wd.w, whiteSpace: "pre", lineHeight: 1.24 }}>{wd.t}</span>
              );
            })}
            {underline > 0 && (() => {
              const l = padX + widths[0] + widths[1];
              return <div style={{ position: "absolute", left: l, top: padY + size * 1.18, width: tw("everything", size, 500) * underline, height: 7, borderRadius: 4, background: C.cyan }} />;
            })()}
          </div>
        </div>
      )}
    </>
  );
};

export const SectionB: React.FC<{ g: number }> = ({ g }) => (
  <>
    <Workspace g={g} />
    <Systems g={g} />
    <Agent g={g} />
    <Together g={g} layer="back" />
    <Software g={g} />
    <Together g={g} layer="front" />
  </>
);
