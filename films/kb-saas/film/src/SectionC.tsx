// 18–29: Diagnose → Build → Run on one process card with two cursors; the maintenance behind it unfolds and folds away;
// the card collapses into the business's pill; the claim, with "you" as that pill; manual work checks itself off and
// becomes time to grow; the sign-off: the logo and the words, nothing else.
import React from "react";
import { OffthreadVideo, Sequence, staticFile } from "remotion";
import { ARRIVE, C, F, MOVE, SHADOW, SHADOW_SOFT, SOFT, W, at, clamp01, lerp, mix, pr, press, px, pxi, rgba, tip } from "./lib";
import { BusinessChip, TaskPill, WordLine, tw } from "./parts";
import { Chip, Cursor, KBTile } from "./ui";
import { Icon } from "./icons";
import { CONTRACT } from "./Fields";

// ---- 18–20 Diagnose, Build, Run -----------------------------------------------------------------------------------
const PC = { x: 960, y: 560, w: 1560, h: 760 };
const STEPS = ["Outreach", "Follow-ups", "Approvals", "CRM updates"];
const SX = [380, 766, 1152, 1538], SY = 470, SW = 330;

const Title: React.FC<{ n: string; t: string }> = ({ n, t }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
    <div style={{ height: 64, padding: "0 20px", borderRadius: 32, background: C.navy, color: C.paleCool, fontFamily: F.ui, fontWeight: 700, fontSize: 32,
      display: "flex", alignItems: "center" }}>{n}</div>
    <span style={{ fontFamily: F.ui, fontWeight: 700, fontSize: 64, color: C.ink, whiteSpace: "nowrap" }}>{t}</span>
  </div>
);

const Swap: React.FC<{ g: number; at: number; a: React.ReactNode; b: React.ReactNode }> = ({ g, at: a0, a, b }) => {
  const o = clamp01((g - a0) / 5), i = clamp01((g - a0 - 6) / 9);
  if (g < a0) return <>{a}</>;
  return (
    <div style={{ position: "relative" }}>
      {o < 1 && <div style={{ filter: `blur(${10 * o}px)`, opacity: 1 - o }}>{a}</div>}
      {i > 0 && <div style={{ position: o < 1 ? "absolute" : "relative", left: 0, top: 0, filter: `blur(${10 * (1 - ARRIVE(i))}px)`, opacity: i }}>{b}</div>}
    </div>
  );
};

const procT = () => {
  const analyze = W("w:analyze", -0.05), processes = W("w:processes", -0.05), build = W("w:build", -0.05), along = W("w:alongside", -0.1);
  const team = W("w:team", -0.08), keep = W("w:keep", -0.08), systems = W("w:systems", -0.08), running = W("w:running", -0.08);
  const kbClick = build + 13, teamClick = team;
  const autoAt = [systems + 3, kbClick + 3, teamClick + 3, systems + 6];
  return { analyze, processes, build, along, team, keep, systems, running, kbClick, teamClick, autoAt };
};

const Process: React.FC<{ g: number; s: number; y: number; fade: number }> = ({ g, s, y, fade }) => {
  const T = procT();
  const ca = CONTRACT.a();
  void ca;
  const show = clamp01((g - (ca + 10)) / 4);
  const scan = pr(g, T.analyze - 2, 40, MOVE);
  const scanX = lerp(PC.x - PC.w / 2 + 20, PC.x + PC.w / 2 - 20, scan);
  const friction = [g >= T.processes + 0 ? 1 : 0, g >= T.processes + 5 ? 1 : 0];
  const auto = T.autoAt.map((a) => clamp01((g - a) / 6));
  const lift = (i: number) => clamp01((g - T.autoAt[i]) / 8);
  const upt = px(g, T.running, 12, 0.8);
  const L = PC.x - PC.w / 2, Tp = PC.y - PC.h / 2;
  return (
    <div style={{ position: "absolute", inset: 0, transform: `translateY(${y - PC.y}px) scale(${s})`, transformOrigin: `${PC.x}px ${PC.y}px` }}>
      <div style={{ position: "absolute", left: L, top: Tp, width: PC.w, height: PC.h, borderRadius: 40, background: C.white,
        boxShadow: show > 0 ? SHADOW : "none", overflow: "hidden" }}>
        <div style={{ opacity: show * fade }}>
          <div style={{ position: "absolute", left: 64, top: 52 }}>
            <Swap g={g} at={T.build} a={<Title n="01" t="Diagnose" />}
              b={<Swap g={g} at={T.keep} a={<Title n="02" t="Build" />} b={<Title n="03" t="Run" />} />} />
          </div>
          {/* the flow */}
          <svg style={{ position: "absolute", left: 0, top: 0, zIndex: 2 }} width={PC.w} height={PC.h}>
            {[0, 1, 2].map((i) => {
              const x1 = SX[i] - L + SW / 2, x2 = SX[i + 1] - L - SW / 2, yy = SY - Tp;
              const on = auto[i] >= 1 && auto[i + 1] >= 1 ? 1 : auto[i];
              return <g key={i}>
                <line x1={x1} y1={yy} x2={x2} y2={yy} stroke={mix("#C9CFD8", C.cyan, on)} strokeWidth={6} strokeDasharray="12 10"
                  strokeDashoffset={on > 0 ? -(g * 2.2) % 22 : 0} />
              </g>;
            })}
          </svg>
          {STEPS.map((st, i) => {
            const crossed = scanX > SX[i] - SW / 2 ? 1 : 0;
            const a = auto[i];
            return (
              <div key={i} style={{ position: "absolute", zIndex: 2, left: SX[i] - L - SW / 2, top: SY - Tp - 56, width: SW, height: 112, borderRadius: 56,
                background: C.white, border: `3px solid ${mix(C.line, C.cyan, a)}`, boxSizing: "border-box", display: "flex", alignItems: "center",
                justifyContent: "center", gap: 14, boxShadow: SHADOW_SOFT }}>
                {a > 0 && <div style={{ width: 44 * a, height: 44, borderRadius: 22, background: C.navy, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                  <Icon name="check" size={30} color="#fff" stroke={3.2} /></div>}
                <span style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 38, color: mix("#A9B0B9", C.ink, Math.max(crossed, a)), whiteSpace: "nowrap" }}>{st}</span>
              </div>
            );
          })}
          {[1, 2].map((si, k) => {
            if (!friction[k]) return null;
            const l = lift(si);
            const e = px(g, T.processes + k * 5, 8, 0.8);
            return (
              <div key={si} style={{ ...at(SX[si] - L, SY - Tp - 104 - 30 * l + 14 * (1 - e)), opacity: 1 - l, zIndex: 3 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, background: C.redSoft, color: C.red, fontFamily: F.ui, fontWeight: 700, fontSize: 30,
                  padding: "10px 22px", borderRadius: 26 }}>
                  <div style={{ width: 12, height: 12, borderRadius: 6, background: C.red }} />Friction</div>
              </div>
            );
          })}
          {scan > 0 && scan < 1 && (
            <div style={{ position: "absolute", inset: 0, zIndex: 1 }}>
              <div style={{ position: "absolute", left: 40, top: 150, width: Math.max(0, scanX - L - 40), height: PC.h - 190, background: rgba(C.cyan, 0.16) }} />
              <div style={{ position: "absolute", left: scanX - L - 300, top: 150, width: 300, height: PC.h - 190,
                background: `linear-gradient(90deg, ${rgba(C.cyan, 0)}, ${rgba(C.cyan, 0.32)})` }} />
              <div style={{ position: "absolute", left: scanX - L - 3, top: 150, width: 6, height: PC.h - 190, background: C.cyan, borderRadius: 3 }} />
            </div>
          )}
          {g >= ca + 10 && (
            <div style={{ position: "absolute", left: 40, top: 150, width: PC.w - 80, height: PC.h - 190, borderRadius: 30, overflow: "hidden",
              clipPath: `inset(0 ${100 * (1 - px(g, ca + 10, 16, 0.8))}% 0 0 round 30px)` }}>
              <Sequence from={ca + 10} layout="none">
                <OffthreadVideo src={staticFile("footage/young-people-working-together-in-the-office-42641.mp4")} muted
                  style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 45%" }} />
              </Sequence>
              <div style={{ position: "absolute", inset: 0, background: rgba(C.navy, 0.18) }} />
              {g >= T.along && (
                <div style={{ position: "absolute", left: 24, bottom: 22 + 10 * (1 - px(g, T.along, 8, 0.8)), background: rgba(C.white, 0.94), borderRadius: 22,
                  padding: "8px 18px", fontFamily: F.ui, fontWeight: 600, fontSize: 30, color: C.ink, display: "flex", alignItems: "center", gap: 10 }}>
                  <Icon name="users" size={32} color={C.navy} stroke={2.2} />Your team</div>
              )}
            </div>
          )}
          {upt > 0 && (
            <div style={{ position: "absolute", zIndex: 2, left: 80, top: 590 + 60 * (1 - upt), width: PC.w - 160, height: 96, borderRadius: 30, background: C.paleCool,
              display: "flex", alignItems: "center", padding: "0 30px", gap: 28, boxSizing: "border-box", overflow: "hidden" }}>
              <Icon name="pulse" size={40} color={C.navy} stroke={2.4} />
              <span style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 32, color: C.muted, whiteSpace: "nowrap" }}>Uptime and monitoring</span>
              <div style={{ flex: 1, height: 44, position: "relative", overflow: "hidden" }}>
                {Array.from({ length: 40 }, (_, k) => {
                  const xx = ((k * 22 - (g - T.running) * 3) % 880 + 880) % 880;
                  return <div key={k} style={{ position: "absolute", left: xx, top: 4, width: 9, height: 36, borderRadius: 4, background: rgba(C.cyan, 0.85) }} />;
                })}
              </div>
              <Chip text="Running" tone="green" size={32} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/** The process card's push (one slow push over its life), shared by the card and the cursors that point into it. */
const procScale = (g: number) => {
  const exitP = W("w:no", -0.53);
  return 1 + 0.18 * pr(g, CONTRACT.a() + 14, exitP - CONTRACT.a() - 14, (x) => x);
};
const inCard = (x: number, y: number, s: number) => ({ x: PC.x + (x - PC.x) * s, y: PC.y + (y - PC.y) * s });

const CS = 92;
const ProcessCursors: React.FC<{ g: number }> = ({ g }) => {
  const T = procT();
  const out: React.ReactNode[] = [];
  const t = tip(CS);
  // K.B: in from the right on "build", clicks Follow-ups, parks, leaves in the pause after "running"
  if (g >= T.build && g < W("w:no", -0.3)) {
    const e = px(g, T.build, 14, 0.78), ex = pxi(g, W("w:running", 0.4), 10, 0.75);
    const tg = inCard(SX[1] + 40, SY + 26, procScale(g));
    const x = lerp(2000, tg.x, e) + 900 * ex, y = lerp(820, tg.y, e) - 700 * ex;
    out.push(<div key="kb" style={{ position: "absolute", transform: `translate3d(${x + t.dx}px, ${y + t.dy}px, 0)` }}>
      <Cursor size={CS} color={C.navy} press={press(g, T.kbClick - 3)} label="K.B" labelBg={C.navy} labelColor={C.paleCool} labelFont={F.logo} /></div>);
  }
  // Your team: in from the left on "alongside", clicks Approvals on "team", leaves on "keep"
  if (g >= T.along && g < T.keep + 14) {
    const e = px(g, T.along, 16, 0.8), ex = pxi(g, T.keep + 2, 10, 0.75);
    const tg = inCard(SX[2] - 30, SY + 30, procScale(g));
    const x = lerp(-100, tg.x, e) - 1000 * ex, y = lerp(900, tg.y, e) + 600 * ex;
    out.push(<div key="tm" style={{ position: "absolute", transform: `translate3d(${x + t.dx}px, ${y + t.dy}px, 0)` }}>
      <Cursor size={CS} press={press(g, T.teamClick - 3)} label="Your team" /></div>);
  }
  return <>{out}</>;
};

// ---- 21–22 no unnecessary complexity --------------------------------------------------------------------------------
const MAINT: [string, string][] = [["shield", "SSL certificates"], ["shield", "Security patches"], ["database", "Regular backups"],
  ["refresh", "Dependency updates"], ["link", "Reconnecting APIs"], ["pulse", "Monitoring and alerts"]];

const Complexity: React.FC<{ g: number; cardBottom: number }> = ({ g, cardBottom }) => {
  const no = W("w:no", -0.06), un = W("w:unnecessary", -0.05), cx = W("w:complexity", -0.08);
  if (g < no || g > cx + 30) return null;
  return (
    <>
      {MAINT.map(([ic, lb], i) => {
        const a = no + i * 3;
        if (g < a) return null;
        const e = px(g, a, 12, 0.8);
        const y0 = 650 + i * 74;
        const fold = pxi(g, cx + i * 2, 16, 0.82);
        const y = lerp(y0 - 50 * (1 - e), cardBottom - 40, fold);
        const chip = g >= un + i * 3;
        return (
          <div key={i} style={{ ...at(960, y), opacity: e > 0 ? 1 : 0 }}>
            <div style={{ width: 1120, height: 66, borderRadius: 20, background: C.white, border: `1.5px solid ${C.line}`, display: "flex", alignItems: "center",
              gap: 18, padding: "0 24px", boxSizing: "border-box" }}>
              <Icon name={ic} size={34} color="#9AA3AD" stroke={2} />
              <span style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 34, color: "#8A939D" }}>{lb}</span>
              {chip && <div style={{ marginLeft: "auto", background: C.navy, color: C.paleCool, fontFamily: F.logo, fontWeight: 800, fontSize: 24,
                padding: "8px 16px", borderRadius: 16, transform: `scale(${0.85 + 0.15 * px(g, un + i * 3, 6, 0.8)})` }}>K.B</div>}
            </div>
          </div>
        );
      })}
    </>
  );
};

// ---- 23–24 the claim; "you" is the business's pill ----------------------------------------------------------------
const L1Y = 560, L2Y = 712, S1 = 104, S2 = 96;
const youPillW = (h: number) => h * 0.16 + h * 0.68 + h * 0.22 + tw("you", 88, 700) + h * 0.36;
const line2 = () => {
  const words = ["that", "works", "the", "way", "@you", "do."];
  const sp = tw(" ", S2, 700);
  const ws = words.map((w) => (w === "@you" ? youPillW(124) : tw(w, S2, 700)));
  const total = ws.reduce((a, b) => a + b, 0) + sp * (words.length - 1);
  let x = 960 - total / 2;
  const xs = ws.map((w) => { const l = x; x += w + sp; return l; });
  return { words, ws, xs, sp };
};

const claimScale = (g: number) => 1 + 0.2 * pr(g, W("w:just2", -0.07), 66, (x) => x);
const PillThread: React.FC<{ g: number; collapse: number }> = ({ g, collapse }) => {
  const youF = W("w:you", -0.3), swapF = W("w:you", -0.12), exit = W("w:less", -0.55);
  if (collapse <= 0 || g > exit + 10) return null;
  const L2 = line2();
  const slotX = L2.xs[4] + L2.ws[4] / 2;
  const tr = pr(g, youF, 11, MOVE);
  const cs = claimScale(g);
  const tx = 960 + (slotX - 960) * cs, ty = 640 + (L2Y + 6 - 640) * cs;
  const x = lerp(960, tx, tr), y = lerp(300, ty, tr);
  const swap = clamp01((g - swapF) / 4);
  const ex = pxi(g, exit, 9, 0.75);
  const pop = clamp01((collapse - 0.6) / 0.4);
  return (
    <div style={{ ...at(x, y - 1100 * ex, lerp(1, cs, tr)), opacity: pop }}>
      <BusinessChip h={lerp(120, 124, swap)} label={swap > 0.5 ? "you" : "Your business"} labelOpacity={swap > 0.5 ? (swap - 0.5) * 2 : 1 - swap * 2}
        labelSize={swap > 0.5 ? 88 : undefined} labelWeight={swap > 0.5 ? 700 : 600}>
        {swap < 0.5 && <Chip text="Running" tone="green" size={32} style={{ opacity: 1 - swap * 2 }} />}
      </BusinessChip>
    </div>
  );
};

/** Behind the claim: the business from the opening again (Mixkit 42628), growing out of the business pill. */
const ClaimFootage: React.FC<{ g: number }> = ({ g }) => {
  const a = W("w:just2", -0.12), exit = W("w:less", -0.55);
  if (g < a || g > exit + 10) return null;
  const ex = pxi(g, exit, 9, 0.75);
  const r = 2300 * px(g, a, 24, 0.86);
  return (
    <div style={{ position: "absolute", inset: 0, transform: `translateY(${-1100 * ex}px)`, clipPath: `circle(${r}px at 960px 300px)` }}>
      <Sequence from={a} layout="none">
        <OffthreadVideo src={staticFile("footage/business-woman-on-call-while-working-42628.mp4")} muted startFrom={150}
          style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.05 + 0.05 * clamp01((g - a) / 70)})` }} />
      </Sequence>
      <div style={{ position: "absolute", inset: 0, background: rgba(C.navy, 0.58) }} />
    </div>
  );
};

const Claim: React.FC<{ g: number }> = ({ g }) => {
  const just = W("w:just2", -0.07), exit = W("w:less", -0.55);
  if (g < just - 2 || g > exit + 10) return null;
  const ex = pxi(g, exit, 9, 0.75);
  const L2 = line2();
  const times = [W("w:that", -0.07), W("w:works2", -0.07), W("w:the", -0.07), W("w:way", -0.07), -1, W("w:do", -0.07)];
  return (
    <div style={{ position: "absolute", inset: 0, transform: `translateY(${-1100 * ex}px) scale(${claimScale(g)})`, transformOrigin: "960px 640px" }}>
      <WordLine g={g} size={S1} x={960} y={L1Y} glide={140} glideFrom={just} glideFrames={21} color="#FFFFFF"
        words={[{ t: "Just", f: just }, { t: "technology", f: W("w:technology2", -0.07) }]} />
      {L2.words.map((w, i) => {
        if (w === "@you" || g < times[i]) return null;
        const age = g - times[i], band = clamp01(1 - age / 12);
        return (
          <div key={i} style={{ position: "absolute", left: 0, top: 0, transform: `translate3d(${L2.xs[i]}px, ${L2Y - S2 * 0.62}px, 0)` }}>
            {band > 0 && <div style={{ position: "absolute", left: -6, top: S2 * 0.42, width: L2.ws[i] + 12, height: S2 * 0.62, borderRadius: 14, background: rgba(C.cyan, 0.22 * band) }} />}
            <span style={{ position: "relative", fontFamily: F.ui, fontWeight: 700, fontSize: S2, color: "#FFFFFF", whiteSpace: "pre", lineHeight: 1.24 }}>{w}</span>
          </div>
        );
      })}
    </div>
  );
};

// ---- 25–26 less manual work, more time to grow ---------------------------------------------------------------------
const MW = { x: 960, y: 560, w: 1200, h: 680 };
const ManualWork: React.FC<{ g: number }> = ({ g }) => {
  const a = W("w:less", -0.5), time = W("w:time", -0.1), grow = W("w:grow", -0.1), exit = W("w:kb2", -0.6);
  if (g < a || g > exit + 12) return null;
  const rise = px(g, a, 18, 0.8);
  const ex = pxi(g, exit, 9, 0.75);
  const gr = pr(g, grow, 22, SOFT);
  const h = MW.h + 200 * gr;
  const top = MW.y - h / 2 + 900 * (1 - rise) - 1200 * ex;
  const checks = [W("w:less", -0.03), W("w:less", 0.17), W("w:manual", -0.03), W("w:manual", 0.2), W("w:work", -0.03)];
  const TASKS = ["Follow-ups", "CRM updates", "Payment confirmations", "Excel files", "Outreach"];
  const fold = checks.map((c) => pr(g, c + 4, 8, MOVE));
  const line = pr(g, grow + 2, 24, MOVE);
  const more = W("w:more", -0.08);
  const wipe = px(g, more, 14, 0.8);
  const mpush = 1 + 0.15 * pr(g, a + 10, exit - a - 10, (x) => x);
  return (
    <div style={{ position: "absolute", left: MW.x - MW.w / 2, top, width: MW.w, height: h, borderRadius: 44, background: C.white, boxShadow: SHADOW,
      border: `1.5px solid ${rgba(C.navy, 0.06)}`, overflow: "hidden", transform: `scale(${mpush})` }}>
      {g >= a && (
        <div style={{ position: "absolute", left: 40, top: 190, right: 40, bottom: 40, borderRadius: 30, overflow: "hidden" }}>
          <Sequence from={a} layout="none">
            <OffthreadVideo src={staticFile("footage/woman-working-on-laptop-she-drinks-coffee-43259.mp4")} muted
              style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.04 + 0.06 * clamp01((g - a) / 90)})` }} />
          </Sequence>
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(0deg, ${rgba(C.navy, 0.35)}, ${rgba(C.navy, 0)} 60%)` }} />
        </div>
      )}
      <div style={{ position: "absolute", left: 64, top: 50 }}>
        <Swap g={g} at={time}
          a={<span style={{ fontFamily: F.ui, fontWeight: 700, fontSize: 64, color: C.ink, whiteSpace: "nowrap" }}>Manual work</span>}
          b={<div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ width: 70, height: 70, borderRadius: 20, background: C.cyan, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name="grow" size={48} color={C.navy} stroke={2.6} /></div>
            <span style={{ fontFamily: F.ui, fontWeight: 700, fontSize: 64, color: C.ink, whiteSpace: "nowrap" }}>Time to grow</span></div>} />
      </div>
      <div style={{ position: "absolute", left: 40, right: 40, top: 160, height: 1.5, background: C.line }} />
      {(() => {
        const left = 5 - fold.reduce((x, y) => x + y, 0);
        const cover = clamp01(left / 5) * (1 - wipe);
        return <div style={{ position: "absolute", left: 40, right: 40, top: 190, height: (h - 230) * cover + (cover > 0 ? 30 : 0), background: C.white,
          borderRadius: "0 0 30px 30px" }} />;
      })()}
      {TASKS.map((t, i) => {
        const ap = a + 5 + i * 3;
        if (g < ap) return null;
        const e = px(g, ap, 10, 0.8);
        let shift = 0;
        for (let j = 0; j < i; j++) shift += fold[j] * 104;
        const ck = clamp01((g - checks[i]) / 4);
        return (
          <div key={i} style={{ position: "absolute", left: 64, top: 200 + i * 104 - shift + 60 * (1 - e), opacity: 1 - fold[i],
            transform: `scaleY(${1 - fold[i]})`, transformOrigin: "0 0" }}>
            <TaskPill label={t} size={44} check={ck} ink={1} />
          </div>
        );
      })}
      {line > 0 && (
        <svg style={{ position: "absolute", left: 0, top: 0 }} width={MW.w} height={h}>
          <path d={`M 120 ${h - 120} C 420 ${h - 150}, 620 ${h - 330}, ${MW.w - 160} ${200}`} fill="none" stroke={C.cyan} strokeWidth={10}
            strokeLinecap="round" pathLength={1} strokeDasharray={`${line} 1`} />
        </svg>
      )}
    </div>
  );
};

// ---- 27–29 the sign-off ------------------------------------------------------------------------------------------
const SignOff: React.FC<{ g: number }> = ({ g }) => {
  const a = W("w:kb2", -0.45);
  if (g < a) return null;
  const e = px(g, a, 20, 0.85);
  const y = lerp(1300, 400, e);
  const sp = 1 + 0.1 * pr(g, a + 10, 100, (x) => x);
  return (
    <div style={{ position: "absolute", inset: 0, transform: `scale(${sp})`, transformOrigin: "960px 600px" }}>
      <div style={at(960, y)}><KBTile size={240} /></div>
      <WordLine g={g} size={84} x={960} y={682}
        words={[{ t: "Your", f: W("w:your7", -0.07) }, { t: "tech", f: W("w:tech", -0.07) }, { t: "team,", f: W("w:team2", -0.07) }]} />
      <WordLine g={g} size={84} x={960} y={790}
        words={[{ t: "without", f: W("w:without", -0.07) }, { t: "the", f: W("w:the2", -0.07) }, { t: "hiring.", f: W("w:hiring", -0.07) }]} />
    </div>
  );
};

export const SectionC: React.FC<{ g: number }> = ({ g }) => {
  const ca = CONTRACT.a();
  const exitP = W("w:no", -0.53);            // the card makes room for the maintenance rows in the pause
  const m = pr(g, exitP, 12, MOVE);
  const ppush = procScale(g);
  const s = ppush * lerp(1, 0.72 / 1.18, m), y = lerp(PC.y, 330, m);
  const coll = W("w:complexity", 0.0) + 20;  // collapse in the pause before "Just"
  const cp = pr(g, coll, 10, MOVE);
  const cardBottom = y + (PC.h / 2) * s;
  const showProcess = g >= ca + 8 && cp < 1;
  // collapse: the card's rectangle closes into the business pill
  const pw = 120 * 0.16 + 120 * 0.68 + 120 * 0.22 + tw("Your business", 43.2, 600) + 120 * 0.22 + tw("Running", 32, 600) + 32 * 1.6 + 120 * 0.36;
  const cz = 1 + 0.1 * pr(g, W("w:no", -0.1), 40, MOVE) * (1 - cp);   // pushed into the maintenance as it unfolds
  return (
    <>
      <div style={{ position: "absolute", inset: 0, transform: `scale(${cz})`, transformOrigin: "960px 560px" }}>
      <Complexity g={g} cardBottom={cardBottom} />
      {showProcess && (cp <= 0 ? <Process g={g} s={s} y={y} fade={1} /> : (
        <div style={{ position: "absolute", left: lerp(960 - PC.w * s / 2, 960 - pw / 2, cp), top: lerp(y - PC.h * s / 2, 300 - 60, cp),
          width: lerp(PC.w * s, pw, cp), height: lerp(PC.h * s, 120, cp), borderRadius: lerp(40, 36, cp), background: C.white, boxShadow: SHADOW }} />
      ))}
      </div>
      <ProcessCursors g={g} />
      <ClaimFootage g={g} />
      <PillThread g={g} collapse={cp} />
      <Claim g={g} />
      <ManualWork g={g} />
      <SignOff g={g} />
    </>
  );
};
