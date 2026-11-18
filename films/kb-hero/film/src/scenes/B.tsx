// Group B: pillar 1, AI, Agents & Automation (S3 text, S4 automation canvas, S5 agent in the background).
// Motion pass: content that acts (feeds that stream, piles that drain, rows that stack, counters that roll).
import React from "react";
import { C, E, Eyebrow, FONT, GRAD, SHADOW, S, Stage, Tool, Words, Ripple, clamp, ease, mix, pressAt } from "../kit";
import type { Group, Scene } from "../types";

const LABELS = ["Invoice", "Lead", "Report", "Email", "Sync", "Booking", "Support", "Update", "Quote"];
const GR = [GRAD.ai, GRAD.dev, GRAD.growth, GRAD.warm, GRAD.navy];
const COLS = [C.cyan, C.violet, C.amber, C.coral, C.mint, C.indigo];
const mod = (x: number, m: number) => ((x % m) + m) % m;

/** small white glyphs: doc, mail, bolt, check, chat */
const Glyph: React.FC<{ k: number; s?: number }> = ({ k, s = 36 }) => (
  <svg viewBox="0 0 24 24" width={s} height={s} fill="none" stroke="#fff" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
    {[
      <g key="0"><rect x="5" y="3.5" width="14" height="17" rx="3" /><path d="M8.5 9h7M8.5 13h7M8.5 17h4" /></g>,
      <g key="1"><rect x="3" y="5.5" width="18" height="13" rx="3" /><path d="M4 8l8 6 8-6" /></g>,
      <path key="2" d="M13 2.5L5 13.5h6l-1 8 8-11h-6z" />,
      <path key="3" d="M5 12.5l4.5 4.5L19 7.5" />,
      <path key="4" d="M4 6.5a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3h-6l-5 4v-4a3 3 0 0 1-2-3z" />,
    ][mod(k, 5)]}
  </svg>
);

/** a solid gradient card with a glyph and a label */
const SolidCard: React.FC<{ w: number; h: number; i: number; style?: React.CSSProperties }> = ({ w, h, i, style }) => (
  <div style={{ width: w, height: h, borderRadius: 28, background: GR[mod(i, GR.length)], boxShadow: SHADOW.card, display: "flex", alignItems: "center", gap: 20, padding: "0 22px", boxSizing: "border-box", ...style }}>
    <div style={{ width: h * 0.56, height: h * 0.56, borderRadius: 16, background: "rgba(255,255,255,.28)", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}><Glyph k={i} s={h * 0.32} /></div>
    <div style={{ flex: 1 }}>
      <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 30, color: "#fff", letterSpacing: -0.4, whiteSpace: "nowrap" }}>{LABELS[mod(i, LABELS.length)]}</div>
      <div style={{ width: `${55 + mod(i * 37, 35)}%`, height: 11, borderRadius: 6, background: "rgba(255,255,255,.55)", marginTop: 10 }} />
    </div>
  </div>
);

/** an odometer: v rolls digit by digit */
const Odo: React.FC<{ v: number; size: number; color?: string; digits?: number }> = ({ v, size, color = C.navy, digits = 2 }) => {
  const val = Math.max(0, v), lh = size * 1.12;
  return (
    <div style={{ display: "flex", fontFamily: FONT, fontWeight: 800, fontSize: size, color, lineHeight: `${lh}px`, letterSpacing: -size * 0.03 }}>
      {Array.from({ length: digits }, (_, k) => digits - 1 - k).map((p) => {
        const lower = p > 0 ? (val / Math.pow(10, p - 1)) % 10 : 0;
        const carry = p > 0 ? ease.inOut(clamp(lower - 9)) : 0;
        const base = Math.floor(val / Math.pow(10, p)) % 10;
        const pos = p === 0 ? val % 10 : base + carry;
        const hide = p > 0 && Math.floor(val / Math.pow(10, p)) === 0 && carry === 0;
        return (
          <div key={p} style={{ width: size * 0.62, height: lh, overflow: "hidden", opacity: hide ? 0 : 1 }}>
            <div style={{ transform: `translateY(${-pos * lh}px)` }}>{[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((d, i) => <div key={i} style={{ height: lh, textAlign: "center" }}>{d}</div>)}</div>
          </div>
        );
      })}
    </div>
  );
};

// ---------------- S3: text, with the work it is about streaming past ----------------
const COLW = 300, CH = 124, CP = 148, CN = 9;
const Column: React.FC<{ t: number; x: number; dir: number; seed: number }> = ({ t, x, dir, seed }) => {
  const p = S(t, -0.25 + seed * 0.05), total = CP * CN;
  return (
    <div style={{ position: "absolute", left: x, top: 0, width: COLW, height: 1080, opacity: clamp(p * 2), transform: `scale(${mix(0.9, 1, p)})`, WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, #000 14%, #000 86%, transparent 100%)", maskImage: "linear-gradient(to bottom, transparent 0%, #000 14%, #000 86%, transparent 100%)" }}>
      {Array.from({ length: CN }, (_, i) => {
        const y = mod(i * CP - dir * (t + 0.3) * 140 + seed * 300, total) - CP;
        return <SolidCard key={i} w={COLW} h={CH} i={i + seed * 3} style={{ position: "absolute", left: 0, top: y }} />;
      })}
    </div>
  );
};
const S3: Scene = ({ t }) => {
  const sub = S(t, 0.3);
  return (
    <Stage t={t} tint={C.cyan} tint2={C.violet}>
      <Column t={t} x={90} dir={1} seed={0} />
      <Column t={t} x={1530} dir={-1} seed={1} />
      <Eyebrow t={t} t0={-0.2} text="PILLAR 01" y={330} color={C.violet} />
      <Words t={t} t0={-0.12} text={"AI, Agents\n& Automation"} size={120} y={545} stagger={0.07} hi={{ AI: GRAD.ai, Agents: GRAD.ai, Automation: GRAD.ai }} />
      <div style={{ position: "absolute", left: 960, top: 790, transform: `translate(-50%,-50%) translateY(${(1 - sub) * 24}px)`, opacity: clamp(sub * 1.5), fontFamily: FONT, fontWeight: 500, fontSize: 34, color: C.sub, whiteSpace: "nowrap", letterSpacing: -0.3 }}>
        Connecting your tools to eliminate manual work.
      </div>
    </Stage>
  );
};

// ---------------- S4: the automation canvas ----------------
const TS = 170; // tile size
const LP = { x: 60, y: 110, w: 370, h: 860 };       // inbox (manual work) panel
const RP = { x: 1500, y: 110, w: 360, h: 860 };     // done panel
const HEAD = 96;
const AG = { x: 960, y: 520 };
const A0 = { x: 520, y: 760 };
const N8 = { x: 1285, y: 300 }, MK = { x: 1285, y: 740 };
const bez = (x0: number, y0: number, x1: number, y1: number) => { const dx = (x1 - x0) * 0.5; return { x0, y0, x1, y1, c1x: x0 + dx, c2x: x1 - dx, d: `M${x0} ${y0} C${x0 + dx} ${y0} ${x1 - dx} ${y1} ${x1} ${y1}` }; };
type Bz = ReturnType<typeof bez>;
const bpt = (b: Bz, u: number) => {
  const v = 1 - u;
  return { x: v * v * v * b.x0 + 3 * v * v * u * b.c1x + 3 * v * u * u * b.c2x + u * u * u * b.x1, y: v * v * v * b.y0 + 3 * v * v * u * b.y0 + 3 * v * u * u * b.y1 + u * u * u * b.y1 };
};
const WA = bez(LP.x + LP.w, AG.y, AG.x - TS / 2, AG.y);
const WN = bez(AG.x + TS / 2, AG.y, N8.x - TS / 2, N8.y), WM = bez(AG.x + TS / 2, AG.y, MK.x - TS / 2, MK.y);
const WN2 = bez(N8.x + TS / 2, N8.y, RP.x, N8.y), WM2 = bez(MK.x + TS / 2, MK.y, RP.x, MK.y);
const WIRES: [Bz, number, boolean][] = [[WA, 2.0, false], [WN, 2.08, false], [WM, 2.08, false], [WN2, 2.2, true], [WM2, 2.2, true]];

const Glass: React.FC<{ x: number; y: number; tool: string; scale?: number; lift?: number; glow?: number; ring?: number; opacity?: number; label?: string; accent?: boolean }> = ({ x, y, tool, scale = 1, lift = 0, glow = 0, ring = 0, opacity = 1, label, accent }) => (
  <div style={{ position: "absolute", left: x - TS / 2, top: y - TS / 2, width: TS, height: TS, transform: `scale(${scale * (1 + 0.07 * lift)}) translateY(${-10 * lift}px)`, opacity }}>
    <div style={{ position: "absolute", inset: 0, borderRadius: 42, backgroundImage: accent ? `linear-gradient(160deg,#fff,#F3F6FF), ${GRAD.ai}` : "linear-gradient(160deg, #fff, #F0F4FB)",
      border: accent ? "3px solid transparent" : "2px solid rgba(255,255,255,.9)", backgroundOrigin: "border-box", backgroundClip: accent ? "padding-box, border-box" : "border-box",
      boxShadow: `${SHADOW.card}, 0 ${20 + 24 * lift}px ${40 + 30 * lift}px rgba(41,58,81,${0.10 + 0.10 * lift}), 0 0 ${60 * glow}px rgba(124,108,255,${0.55 * glow}), 0 0 0 ${14 * ring}px rgba(124,108,255,${0.3 * (1 - ring)})` }} />
    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}><Tool name={tool} size={100} /></div>
    {label && <div style={{ position: "absolute", left: "50%", top: TS + 16, transform: "translateX(-50%)", fontFamily: FONT, fontWeight: 600, fontSize: 28, color: C.navy, whiteSpace: "nowrap", background: "rgba(255,255,255,.92)", padding: "4px 18px", borderRadius: 24, border: `1px solid ${C.line}` }}>{label}</div>}
  </div>
);
const Check: React.FC<{ size?: number }> = ({ size = 40 }) => (
  <div style={{ width: size, height: size, borderRadius: "50%", background: C.green, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 14px rgba(34,181,115,.35)", flex: "none" }}>
    <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="#fff" strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round" /></svg>
  </div>
);

// inbox cards stream down (a feed that fills), then drain into the agent
const CARD_W = 340, CARD_H = 88, PITCH = 100, ISPD = 588, N_IN = 18;
const ts = (i: number) => -1.0 + 0.17 * i;
const tt = (t: number) => { if (t < 1.8) return t; const u = clamp((t - 1.8) / 0.35); return 1.8 + 0.35 * (u - (u * u) / 2); };   // feed eases to a stop as the agent lands
const iy = (i: number, T: number) => -100 + (tt(T) - ts(i)) * ISPD;
const BODY_H = LP.h - HEAD;
const DRAIN = (() => {
  const vis = Array.from({ length: N_IN }, (_, i) => i).filter((i) => { const y = iy(i, 5); return y > -60 && y < BODY_H - 30; }).sort((a, b) => iy(b, 5) - iy(a, 5));
  const m: Record<number, number> = {};
  vis.forEach((i, k) => { m[i] = 2.0 + 0.08 * k; });
  return m;
})();
const InboxCard: React.FC<{ i: number }> = ({ i }) => (
  <div style={{ width: CARD_W, height: CARD_H, borderRadius: 22, background: "#fff", border: "3px solid #FFE2AE", boxSizing: "border-box", boxShadow: SHADOW.soft, display: "flex", alignItems: "center", gap: 18, padding: "0 18px" }}>
    <div style={{ width: 50, height: 50, borderRadius: 25, background: C.amber, color: "#fff", fontFamily: FONT, fontWeight: 800, fontSize: 32, display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>!</div>
    <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 30, color: C.navy, letterSpacing: -0.4 }}>{LABELS[mod(i, LABELS.length)]}</div>
    <div style={{ flex: 1 }} />
    <div style={{ width: 34, height: 12, borderRadius: 6, background: C.navy2, opacity: 0.5 }} />
  </div>
);
// done rows, one per chip that arrives
const L0 = 2.1, LSTEP = 0.1, N_CH = 22, RPITCH = 96, RSPD = RPITCH / LSTEP;
const arrOf = (j: number) => L0 + LSTEP * j + 0.4;

const Panel: React.FC<{ x: number; y: number; w: number; h: number; o: number; children: React.ReactNode }> = ({ x, y, w, h, o, children }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: 30, background: "#fff", boxShadow: SHADOW.card, border: `1px solid ${C.line}`, overflow: "hidden", opacity: clamp(o * 2), transform: `scale(${mix(0.94, 1, o)})` }}>{children}</div>
);

const S4: Scene = ({ t }) => {
  const dragging = t >= 0.86 && t < 2.0;
  const dp = E(t, 1.08, 0.92, ease.inOut);
  const ax = t < 1.08 ? A0.x : mix(A0.x, AG.x, dp), ay = t < 1.08 ? A0.y : mix(A0.y, AG.y, dp);
  const snap = S(t, 2.0, { damping: 11, stiffness: 240 });
  const press = pressAt(t, 0.75);
  const lift = t < 0.86 ? 0 : dragging ? clamp((t - 0.86) / 0.2) : Math.max(0, 1 - (t - 2.0) / 0.25);
  const connected = E(t, 2.0, 0.6);
  const aIn = S(t, -0.1);
  const handled = Array.from({ length: N_CH }, (_, j) => E(t, arrOf(j) - 0.25, 0.25, ease.out)).reduce((a, b) => a + b, 0);
  const openN = t < 2.05 ? 3 + (t + 0.3) * 6.5 : (3 + 2.35 * 6.5) * (1 - E(t, 2.05, 1.2, ease.inOut));
  const pIn = S(t, -0.25), pOut = S(t, -0.15);
  return (
    <Stage t={t} tint={C.cyan} tint2={C.violet}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(rgba(41,58,81,.16) 2.2px, transparent 2.4px)`, backgroundSize: "48px 48px" }} />
      {/* inbox: manual work piling up */}
      <Panel x={LP.x} y={LP.y} w={LP.w} h={LP.h} o={pIn}>
        <div style={{ height: HEAD, display: "flex", alignItems: "center", gap: 14, padding: "0 22px", borderBottom: `1px solid ${C.line}` }}>
          <Tool name="pipedrive" size={56} />
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 34, color: C.navy }}>Inbox</div>
          <div style={{ flex: 1 }} />
          <div style={{ background: C.amber, borderRadius: 30, padding: "2px 18px", display: "flex" }}><Odo v={openN} size={38} color="#fff" /></div>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: HEAD, height: BODY_H, overflow: "hidden" }}>
          {Array.from({ length: N_IN }, (_, i) => i).map((i) => {
            if (tt(t) < ts(i)) return null;
            if (DRAIN[i] !== undefined && t >= DRAIN[i]) return null;
            const y = iy(i, t);
            if (y > BODY_H) return null;
            return <div key={i} style={{ position: "absolute", left: 15, top: y }}><InboxCard i={i} /></div>;
          })}
        </div>
      </Panel>
      {/* done: finished rows stack up */}
      <Panel x={RP.x} y={RP.y} w={RP.w} h={RP.h} o={pOut}>
        <div style={{ height: HEAD, display: "flex", alignItems: "center", gap: 14, padding: "0 22px", borderBottom: `1px solid ${C.line}` }}>
          <Check size={48} />
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 34, color: C.navy }}>Done</div>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: HEAD, height: BODY_H, overflow: "hidden" }}>
          {Array.from({ length: N_CH }, (_, j) => j).map((j) => {
            const a = arrOf(j), y = -90 + (t - a) * RSPD;
            if (t < a || y > BODY_H) return null;
            const p = S(t, a, { damping: 14, stiffness: 220 });
            return (
              <div key={j} style={{ position: "absolute", left: 15, top: y, width: CARD_W, height: 84, borderRadius: 22, background: "#EAFBF3", border: "3px solid #BDEFD7", boxSizing: "border-box", display: "flex", alignItems: "center", gap: 16, padding: "0 18px", transform: `scale(${mix(0.88, 1, p)})`, opacity: clamp(p * 3) }}>
                <Check size={46} />
                <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 30, color: C.navy, letterSpacing: -0.4 }}>{LABELS[mod(j + 2, LABELS.length)]}</div>
              </div>
            );
          })}
        </div>
      </Panel>
      {/* wires and travelling chips */}
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        <defs><linearGradient id="wg" gradientUnits="userSpaceOnUse" x1="430" y1="0" x2="1500" y2="0"><stop offset="0" stopColor={C.cyan} /><stop offset="1" stopColor={C.violet} /></linearGradient></defs>
        {WIRES.map(([bz, ds, pre], i) => {
          const p = E(t, ds, 0.3, ease.out);
          return (
            <g key={i}>
              {pre && <path d={bz.d} fill="none" stroke="rgba(41,58,81,.22)" strokeWidth={5} strokeDasharray="4 12" strokeLinecap="round" opacity={S(t, 0.1)} />}
              <path d={bz.d} fill="none" stroke="url(#wg)" strokeWidth={7} strokeLinecap="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - p} />
            </g>
          );
        })}
      </svg>
      {Array.from({ length: N_CH }, (_, j) => j).map((j) => {
        const L = L0 + LSTEP * j, k = t - L;
        if (k < 0 || k > 0.42) return null;
        const br = j % 2 ? [WM, WM2] : [WN, WN2];
        const leg = k < 0.22 ? 0 : 1, u = leg === 0 ? E(k, 0, 0.22, ease.smooth) : E(k, 0.22, 0.18, ease.smooth);
        const q = bpt(br[leg], u), s = S(t, L, { damping: 12, stiffness: 260 });
        return (
          <div key={j} style={{ position: "absolute", left: q.x - 32, top: q.y - 32, width: 64, height: 64, borderRadius: 20, background: GR[mod(j, GR.length)], boxShadow: "0 10px 24px rgba(41,58,81,.25)", display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${s})` }}><Glyph k={j + 1} s={34} /></div>
        );
      })}
      {/* the gap */}
      {t < 2.3 && (
        <div style={{ position: "absolute", left: AG.x - TS / 2, top: AG.y - TS / 2, width: TS, height: TS, borderRadius: 42, border: `3px dashed ${C.violet}`, opacity: S(t, 0.1) * (1 - connected) * 0.7,
          display: "flex", alignItems: "center", justifyContent: "center", color: C.violet, fontFamily: FONT, fontWeight: 600, fontSize: 56 }}>+</div>
      )}
      {[{ q: N8, tool: "n8n-logo2" }, { q: MK, tool: "makecom-removebg-preview" }].map(({ q, tool }, i) => {
        const p = S(t, -0.25 + 0.09 * i);
        return <Glass key={tool} x={q.x} y={q.y} tool={tool} scale={p} opacity={clamp(p * 2)} glow={0.3 * connected} />;
      })}
      {/* draining inbox cards fly into the agent */}
      {Object.entries(DRAIN).map(([ks, tr]) => {
        const i = +ks, k = t - tr;
        if (k < 0 || k > 0.31) return null;
        const p = E(k, 0, 0.3, ease.in), y0 = LP.y + HEAD + iy(i, tr) + CARD_H / 2;
        return (
          <div key={i} style={{ position: "absolute", left: mix(LP.x + 15 + CARD_W / 2, AG.x, p) - CARD_W / 2, top: mix(y0, AG.y, p) - CARD_H / 2, transform: `scale(${mix(1, 0.3, p)})`, opacity: p < 0.85 ? 1 : (1 - p) / 0.15 }}><InboxCard i={i} /></div>
        );
      })}
      <Glass x={t >= 2.0 ? AG.x : ax} y={t >= 2.0 ? AG.y : ay} tool="claude-removebg-preview" scale={aIn * (1 - 0.05 * press) * (t >= 2.0 ? 1 + 0.08 * (snap - 1) : 1)} lift={lift} glow={0.2 + 0.8 * connected} accent
        ring={E(t, 2.0, 0.6, ease.out) < 1 && t >= 2.0 ? E(t, 2.0, 0.6, ease.out) : 0} label={t > 2.0 ? "AI Agent" : undefined} opacity={clamp(aIn * 2)} />
      {/* the handled counter */}
      <div style={{ position: "absolute", left: 770, top: 790, width: 380, height: 130, borderRadius: 32, background: "#fff", boxShadow: SHADOW.card, border: `1px solid ${C.line}`, display: "flex", alignItems: "center", justifyContent: "center", gap: 22, opacity: clamp(S(t, 2.0) * 2), transform: `scale(${mix(0.9, 1, S(t, 2.0))})` }}>
        <Odo v={handled} size={92} color={C.navy} />
        <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 30, color: C.sub }}>Handled</div>
      </div>
      <Ripple t={t} c={0.75} x={520} y={760} color={C.violet} />
    </Stage>
  );
};

// ---------------- S5: an agent working in the background ----------------
const WIN = { x: 1040, y: 90, w: 820, h: 900 };
const WHEAD = 70, RROW = 108, RP5 = 124, TRAVEL = 0.8, SPACE = 0.3, RSPD5 = RP5 / SPACE;
const N_CARDS = 16;
const tc = (i: number) => -1.6 + SPACE * i;       // card spawn time
const ORB = { x: 520, y: 540 };
const S5: Scene = ({ t }) => {
  const spin = t * 90;
  const pw = S(t, -0.3);
  return (
    <Stage t={t} tint={C.violet} tint2={C.cyan}>
      {/* the incoming notification cards, falling into the orb */}
      {Array.from({ length: N_CARDS }, (_, i) => i).map((i) => {
        const p = (t - tc(i)) / TRAVEL;
        if (p < 0 || p > 1) return null;
        const e = ease.in(p), y = mix(-70, ORB.y, e), sc = p < 0.7 ? 1 : mix(1, 0.15, E(p, 0.7, 0.3, ease.in)), op = p < 0.85 ? 1 : 1 - (p - 0.85) / 0.15;
        const xo = Math.sin(i * 2.3) * 70 * (1 - e);
        return <div key={i} style={{ position: "absolute", left: ORB.x - 270 + xo, top: y - 58, transform: `scale(${sc})`, opacity: op }}><SolidCard w={540} h={116} i={i} /></div>;
      })}
      {/* the agent orb */}
      <div style={{ position: "absolute", left: ORB.x, top: ORB.y, width: 0, height: 0, transform: "scale(1.3)", opacity: S(t, -0.3) }}>
        <div style={{ position: "absolute", left: -200, top: -200, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(124,108,255,.3), transparent 65%)" }} />
        <svg width={320} height={320} viewBox="-160 -160 320 320" style={{ position: "absolute", left: -160, top: -160, overflow: "visible" }}>
          <defs><linearGradient id="og" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stopColor={C.cyan} /><stop offset="1" stopColor={C.violet} /></linearGradient></defs>
          <circle r={130} fill="none" stroke="url(#og)" strokeWidth={6} strokeDasharray="60 28 14 28" strokeLinecap="round" transform={`rotate(${spin})`} opacity={0.9} />
          <circle r={96} fill="url(#og)" style={{ filter: "drop-shadow(0 20px 40px rgba(124,108,255,.45))" }} />
          <circle r={96} fill="none" stroke="rgba(255,255,255,.55)" strokeWidth={3} />
          <ellipse cx={-30} cy={-44} rx={46} ry={22} fill="rgba(255,255,255,.28)" transform="rotate(-25 -30 -44)" />
          <g transform={`rotate(${spin * 0.5})`}><path d="M0 -44 C4 -14 14 -4 44 0 C14 4 4 14 0 44 C-4 14 -14 4 -44 0 C-14 -4 -4 -14 0 -44Z" fill="#fff" /></g>
        </svg>
      </div>
      {/* the resolved list window: rows stack in and scroll continuously */}
      <div style={{ position: "absolute", left: WIN.x, top: WIN.y, width: WIN.w, height: WIN.h, borderRadius: 30, background: "#fff", boxShadow: SHADOW.lift, border: `1px solid ${C.line}`, overflow: "hidden", opacity: clamp(pw * 2), transform: `translateY(${(1 - pw) * 40}px)` }}>
        <div style={{ height: WHEAD, display: "flex", alignItems: "center", gap: 10, padding: "0 24px", borderBottom: `1px solid ${C.line}`, background: "#FBFBFD" }}>
          {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => <div key={c} style={{ width: 14, height: 14, borderRadius: "50%", background: c }} />)}
          <div style={{ flex: 1, textAlign: "center", marginRight: 60, fontFamily: FONT, fontWeight: 700, fontSize: 28, color: C.navy }}>Resolved</div>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: WHEAD, bottom: 0, overflow: "hidden" }}>
          {Array.from({ length: N_CARDS }, (_, i) => i).map((i) => {
            const a = tc(i) + TRAVEL, y = -RROW + (t - a) * RSPD5;
            if (t < a || y > WIN.h - WHEAD) return null;
            const p = S(t, a, { damping: 14, stiffness: 200 }), col = COLS[i % COLS.length];
            return (
              <div key={i} style={{ position: "absolute", left: 24, right: 24, top: y, height: RROW, borderRadius: 24, background: col + "26", display: "flex", alignItems: "center", gap: 22, padding: "0 24px 0 0", overflow: "hidden", transform: `scale(${mix(0.9, 1, p)})`, opacity: clamp(p * 3) }}>
                <div style={{ width: 16, alignSelf: "stretch", background: col, flex: "none" }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 32, color: C.navy, letterSpacing: -0.4 }}>{LABELS[mod(i, LABELS.length)]}</div>
                  <div style={{ width: `${40 + mod(i * 29, 30)}%`, height: 12, borderRadius: 6, background: C.navy2, opacity: 0.35, marginTop: 10 }} />
                </div>
                <Check size={56} />
              </div>
            );
          })}
        </div>
      </div>
    </Stage>
  );
};

export const GROUP: Group = {
  scenes: { S3, S4, S5 },
  hand: {
    S3: [], S5: [],
    S4: [
      { at: 0.75, x: 520, y: 760, click: true },
      { at: 2.0, x: 960, y: 520, early: 0, dur: 0.92 },
    ],
  },
  sfx: {
    S3: [{ t: 0.0, kind: "whoosh", note: "headline words rise, task streams run" }, { t: 0.4, kind: "pop", note: "sub line" }],
    S4: [
      { t: 0.86, kind: "click", note: "hand grabs the AI Agent tile" },
      { t: 1.4, kind: "slide", note: "drag glide" },
      { t: 2.0, kind: "snap", note: "tile snaps into the gap, wires draw" },
      { t: 2.3, kind: "whoosh", note: "inbox drains, chips start travelling" },
      { t: 2.8, kind: "tick", note: "first done rows stack up" },
      { t: 3.4, kind: "success", note: "counter keeps rolling" },
    ],
    S5: [
      { t: 0.0, kind: "pop", note: "cards keep falling into the orb" },
      { t: 0.5, kind: "tick", note: "rows resolve" },
      { t: 1.1, kind: "tick", note: "list scrolls" },
      { t: 1.8, kind: "success", note: "list full of checks" },
    ],
  },
};
