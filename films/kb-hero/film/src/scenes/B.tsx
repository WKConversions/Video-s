// Group B: pillar 1, AI, Agents & Automation (S3 text, S4 automation canvas, S5 agent in the background).
import React from "react";
import { C, E, Eyebrow, FONT, GRAD, SHADOW, S, Stage, Tool, Words, clamp, drift, ease, mix, pressAt, rnd } from "../kit";
import type { Group, Scene } from "../types";

const Sparkle: React.FC<{ x: number; y: number; size: number; t: number; t0: number; color?: string; spin?: number }> = ({ x, y, size, t, t0, color = C.violet, spin = 0 }) => {
  const p = S(t, t0), pulse = 1 + 0.18 * Math.sin(t * 4 + x);
  return (
    <svg width={size} height={size} viewBox="-50 -50 100 100" style={{ position: "absolute", left: x - size / 2, top: y - size / 2, transform: `scale(${p * pulse}) rotate(${spin * t * 30}deg)`, opacity: clamp(p * 2), overflow: "visible" }}>
      <path d="M0 -46 C4 -14 14 -4 46 0 C14 4 4 14 0 46 C-4 14 -14 4 -46 0 C-14 -4 -4 -14 0 -46Z" fill={color} />
    </svg>
  );
};

// ---------------- S3: text ----------------
const S3: Scene = ({ t }) => {
  const sub = S(t, 0.3);
  const w = 2 + 2 * Math.sin(t * 5);
  const wireP = E(t, 0.25, 0.5, ease.out);
  const pulse = ((t * 1.1) % 1);
  return (
    <Stage t={t} tint={C.cyan} tint2={C.violet}>
      <div style={{ position: "absolute", inset: 0, transform: `scale(${1 + 0.02 * E(t, -0.3, 2.2, ease.smooth)}) translate(${drift(t, 5, 4)}px, ${drift(t, 4, 3, 1)}px)` }}>
        <Eyebrow t={t} t0={-0.2} text="PILLAR 01" y={330} color={C.violet} />
        <Words t={t} t0={-0.12} text={"AI, Agents\n& Automation"} size={120} y={545} stagger={0.07} hi={{ AI: GRAD.ai, Agents: GRAD.ai, Automation: GRAD.ai }} />
        <div style={{ position: "absolute", left: 960, top: 790, transform: `translate(-50%,-50%) translateY(${(1 - sub) * 24}px)`, opacity: clamp(sub * 1.5), fontFamily: FONT, fontWeight: 500, fontSize: 34, color: C.sub, whiteSpace: "nowrap", letterSpacing: -0.3 }}>
          Connecting your tools to eliminate manual work.
        </div>
        <Sparkle x={420} y={400} size={64} t={t} t0={0.1} color={C.cyan} spin={1} />
        <Sparkle x={1500} y={720} size={44} t={t} t0={0.25} color={C.violet} spin={-1.5} />
        <Sparkle x={1560} y={330} size={30} t={t} t0={0.35} color={C.indigo} spin={2} />
        {/* two tiny nodes linked by a pulsing wire */}
        <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
          <defs><linearGradient id="s3g" x1="0" x2="1"><stop offset="0" stopColor={C.cyan} /><stop offset="1" stopColor={C.violet} /></linearGradient></defs>
          <path d="M250 700 C 330 700 330 760 410 760" fill="none" stroke="url(#s3g)" strokeWidth={5} strokeLinecap="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - wireP} opacity={0.9} />
          <circle cx={250} cy={700} r={12 + w * 0.3} fill={C.white} stroke={C.cyan} strokeWidth={5} opacity={S(t, 0.1)} />
          <circle cx={410} cy={760} r={12 + w * 0.3} fill={C.white} stroke={C.violet} strokeWidth={5} opacity={S(t, 0.2)} />
          {wireP >= 1 && (() => { const u = pulse, x = mix(250, 410, u), y = 700 + 60 * u * u * (3 - 2 * u); return <circle cx={x} cy={y} r={7} fill={C.violet} style={{ filter: `drop-shadow(0 0 8px ${C.violet})` }} />; })()}
        </svg>
      </div>
    </Stage>
  );
};

// ---------------- S4: the automation canvas ----------------
const TS = 170; // tile size
type TileDef = { id: string; tool: string; x: number; y: number; label?: string };
const TILES: TileDef[] = [
  { id: "trig", tool: "pipedrive", x: 360, y: 520, label: "Trigger" },
  { id: "n8n", tool: "n8n-logo2", x: 1330, y: 330 },
  { id: "make", tool: "makecom-removebg-preview", x: 1330, y: 710 },
  { id: "resend", tool: "resend", x: 1660, y: 330, label: "Done" },
  { id: "odoo", tool: "odoo-1", x: 1660, y: 710, label: "Done" },
];
const AG = { x: 960, y: 520 };
const A0 = { x: 520, y: 760 };
const byId = (id: string) => (id === "agent" ? AG : TILES.find((q) => q.id === id)!);
// wires: [from, to, drawStart, preexisting]
const WIRES: [string, string, number, boolean][] = [
  ["trig", "agent", 2.0, false], ["agent", "n8n", 2.15, false], ["agent", "make", 2.3, false], ["n8n", "resend", 2.45, true], ["make", "odoo", 2.55, true],
];
const bez = (a: { x: number; y: number }, b: { x: number; y: number }) => {
  const x0 = a.x + TS / 2, y0 = a.y, x1 = b.x - TS / 2, y1 = b.y, dx = (x1 - x0) * 0.5;
  return { x0, y0, x1, y1, c1x: x0 + dx, c2x: x1 - dx, d: `M${x0} ${y0} C${x0 + dx} ${y0} ${x1 - dx} ${y1} ${x1} ${y1}` };
};
const bpt = (b: ReturnType<typeof bez>, u: number) => {
  const v = 1 - u;
  return { x: v * v * v * b.x0 + 3 * v * v * u * b.c1x + 3 * v * u * u * b.c2x + u * u * u * b.x1, y: v * v * v * b.y0 + 3 * v * v * u * b.y0 + 3 * v * u * u * b.y1 + u * u * u * b.y1 };
};
const Glass: React.FC<{ x: number; y: number; tool: string; scale?: number; lift?: number; glow?: number; ring?: number; opacity?: number; badge?: number; label?: string; accent?: boolean; dark?: boolean }> = ({ x, y, tool, scale = 1, lift = 0, glow = 0, ring = 0, opacity = 1, badge = 0, label, accent, dark }) => (
  <div style={{ position: "absolute", left: x - TS / 2, top: y - TS / 2, width: TS, height: TS, transform: `scale(${scale * (1 + 0.07 * lift)}) translateY(${-10 * lift}px)`, opacity }}>
    <div style={{ position: "absolute", inset: 0, borderRadius: 42, background: dark ? "linear-gradient(160deg,#354C67,#1F2B3D)" : "linear-gradient(160deg, rgba(255,255,255,.95), rgba(240,246,255,.72))", border: accent ? "3px solid transparent" : `2px solid rgba(255,255,255,.9)`,
      backgroundImage: accent ? `linear-gradient(160deg,#fff,#F3F6FF), ${GRAD.ai}` : undefined, backgroundOrigin: "border-box", backgroundClip: accent ? "padding-box, border-box" : undefined,
      boxShadow: `${SHADOW.card}, 0 ${20 + 24 * lift}px ${40 + 30 * lift}px rgba(41,58,81,${0.10 + 0.10 * lift}), 0 0 ${60 * glow}px rgba(124,108,255,${0.55 * glow}), 0 0 0 ${10 * ring}px rgba(34,181,115,${0.28 * (1 - ring)})` }} />
    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}><Tool name={tool} size={96} /></div>
    {label && <div style={{ position: "absolute", left: "50%", top: TS + 16, transform: "translateX(-50%)", fontFamily: FONT, fontWeight: 600, fontSize: 20, color: C.sub, whiteSpace: "nowrap", background: "rgba(255,255,255,.85)", padding: "5px 16px", borderRadius: 20, border: `1px solid ${C.line}` }}>{label}</div>}
    {badge > 0 && <div style={{ position: "absolute", right: -14, top: -14, width: 44, height: 44, borderRadius: "50%", background: C.green, transform: `scale(${badge})`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 18px rgba(34,181,115,.4)" }}>
      <svg width={24} height={24} viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="#fff" strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round" /></svg></div>}
  </div>
);
const Check: React.FC<{ size?: number }> = ({ size = 40 }) => (
  <div style={{ width: size, height: size, borderRadius: "50%", background: C.green, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 14px rgba(34,181,115,.35)" }}>
    <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="#fff" strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round" /></svg>
  </div>
);

const S4: Scene = ({ t }) => {
  const tilt = 11 * (1 - E(t, -0.3, 2.3, ease.out));
  const tiltY = -4 * (1 - E(t, -0.3, 2.8, ease.out));
  const push = 1 + 0.035 * E(t, -0.3, 4.6, ease.smooth);
  const dp = E(t, 1.25, 0.75);
  const dragging = t >= 0.95 && t < 2.0;
  const ax = t < 1.25 ? A0.x : mix(A0.x, AG.x, dp), ay = t < 1.25 ? A0.y : mix(A0.y, AG.y, dp);
  const snap = S(t, 2.0, { damping: 11, stiffness: 240 });
  const press = pressAt(t, 0.9);
  const lift = dragging ? clamp((t - 0.95) / 0.2) : t >= 2.0 ? Math.max(0, 1 - (t - 2.0) / 0.25) : 0;
  const aIn = S(t, -0.1);
  const connected = E(t, 2.0, 0.6);
  const agentFloat = t < 0.9 ? drift(t, 3, 6) : 0;
  const tickTimes: Record<string, number> = { trig: 2.3, agent: 2.55, n8n: 2.8, make: 3.05, resend: 3.3, odoo: 3.55 };
  const ringOf = (id: string) => E(t, tickTimes[id], 0.5, ease.out);
  const badgeOf = (id: string) => S(t, tickTimes[id] + 0.1);
  return (
    <Stage t={t} tint={C.cyan} tint2={C.violet}>
      <div style={{ position: "absolute", inset: 0, perspective: 1800, perspectiveOrigin: "50% 40%" }}>
        <div style={{ position: "absolute", inset: 0, transform: `scale(${push}) translate(${drift(t, 6, 6)}px, ${drift(t, 5, 4, 1)}px) rotateX(${tilt}deg) rotateY(${tiltY}deg)`, transformOrigin: "50% 55%" }}>
          {/* the canvas plane: dotted grid with depth */}
          <div style={{ position: "absolute", inset: -500, backgroundImage: `radial-gradient(rgba(41,58,81,.22) 2.2px, transparent 2.4px)`, backgroundSize: "48px 48px", backgroundPosition: `${(t * 10) % 48}px ${(t * 6) % 48}px` }} />
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(247,247,247,.85) 100%)" }} />
          {/* wires */}
          <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
            <defs><linearGradient id="wg" gradientUnits="userSpaceOnUse" x1="300" y1="0" x2="1700" y2="0"><stop offset="0" stopColor={C.cyan} /><stop offset="1" stopColor={C.violet} /></linearGradient></defs>
            {WIRES.map(([a, b, ds, pre], i) => {
              const bz = bez(byId(a), byId(b)), p = E(t, ds, 0.5, ease.out);
              return (
                <g key={i}>
                  {pre && <path d={bz.d} fill="none" stroke="rgba(41,58,81,.22)" strokeWidth={5} strokeDasharray="4 12" strokeLinecap="round" opacity={S(t, 0.1)} />}
                  <path d={bz.d} fill="none" stroke="rgba(124,108,255,.25)" strokeWidth={14} strokeLinecap="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - p} style={{ filter: "blur(6px)" }} />
                  <path d={bz.d} fill="none" stroke="url(#wg)" strokeWidth={6} strokeLinecap="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - p} />
                  {p >= 1 && [0, 0.5].map((off) => {
                    const u0 = ((t - ds - 0.5) / 0.95 + off + i * 0.17);
                    const u = u0 - Math.floor(u0), fade = Math.sin(Math.PI * u);
                    return [0, 0.05, 0.1].map((tr, k) => { const uu = Math.max(0, u - tr), q = bpt(bz, uu); return <circle key={`${off}${k}`} cx={q.x} cy={q.y} r={10 - k * 3} fill={k === 0 ? "#fff" : C.cyan} opacity={(k === 0 ? 1 : 0.5 / k) * fade} style={k === 0 ? { filter: `drop-shadow(0 0 10px ${C.violet}) drop-shadow(0 0 4px ${C.cyan})` } : undefined} />; });
                  })}
                </g>
              );
            })}
          </svg>
          {/* the gap */}
          {t < 2.3 && (
            <div style={{ position: "absolute", left: AG.x - TS / 2, top: AG.y - TS / 2, width: TS, height: TS, borderRadius: 42, border: `3px dashed ${C.violet}`, opacity: S(t, 0.1) * (1 - connected) * (0.6 + 0.3 * Math.sin(t * 6)), transform: `scale(${1 + 0.04 * Math.sin(t * 6)})`,
              display: "flex", alignItems: "center", justifyContent: "center", color: C.violet, fontFamily: FONT, fontWeight: 600, fontSize: 56 }}>+</div>
          )}
          {/* tiles */}
          {TILES.map((q, i) => {
            const p = S(t, -0.25 + 0.09 * i);
            const ring = ringOf(q.id);
            return <Glass key={q.id} x={q.x} y={q.y + drift(t, 4 + i * 0.6, 5, i)} tool={q.tool} scale={p} opacity={clamp(p * 2)} ring={ring > 0 && ring < 1 ? ring : 0} badge={badgeOf(q.id)} label={q.label} dark={q.tool === "resend"} glow={0.4 * connected} />;
          })}
          <Glass x={t >= 2.0 ? AG.x : ax} y={(t >= 2.0 ? AG.y : ay) + agentFloat} tool="claude-removebg-preview" scale={aIn * (1 - 0.05 * press) * (1 + 0.08 * (snap - 1) * (t >= 2.0 ? 1 : 0))} lift={lift} glow={0.2 + 0.8 * connected} accent
            ring={ringOf("agent") > 0 && ringOf("agent") < 1 ? ringOf("agent") : 0} badge={badgeOf("agent")} label={t > 2.0 ? "AI Agent" : undefined} opacity={clamp(aIn * 2)} />
          {/* manual task slips shrinking away, each replaced by a check */}
          {[0, 1, 2, 3].map((i) => {
            const x = 120 + 130, y = 760 + i * 74 - 20, t0 = 2.45 + 0.38 * i;
            const k = E(t, t0, 0.4, ease.in), c = S(t, t0 + 0.25);
            return (
              <div key={i} style={{ position: "absolute", left: x - 130, top: y - 28, width: 260, height: 56 }}>
                <div style={{ position: "absolute", inset: 0, borderRadius: 16, background: "#E9EBF0", border: `1px solid ${C.line}`, display: "flex", alignItems: "center", gap: 12, padding: "0 16px", transform: `scale(${(1 - k) * S(t, 0.1 + i * 0.08)})`, opacity: 1 - k * 0.5, transformOrigin: "20% 50%" }}>
                  <div style={{ width: 20, height: 20, borderRadius: 6, border: "3px solid #B8BEC9" }} />
                  <div><div style={{ width: 120 - i * 10, height: 9, borderRadius: 5, background: "#B8BEC9" }} /><div style={{ width: 70, height: 8, borderRadius: 5, background: "#CDD1DA", marginTop: 8 }} /></div>
                </div>
                <div style={{ position: "absolute", left: 14, top: 8, transform: `scale(${c})`, opacity: c }}><Check size={40} /></div>
                {c > 0.2 && <div style={{ position: "absolute", left: 66, top: 22, width: 90 * c, height: 10, borderRadius: 5, background: "rgba(34,181,115,.25)", opacity: 1 }} />}
              </div>
            );
          })}
        </div>
      </div>
    </Stage>
  );
};

// ---------------- S5: an agent working in the background ----------------
const WIN = { x: 1130, y: 250, w: 600, h: 580 };
const ROWH = 82;
const N_CARDS = 14;
const tc = (i: number) => -0.9 + 0.3 * i;       // card spawn time
const TRAVEL = 0.9;
const ORB = { x: 700, y: 640 };
const COLS = [C.cyan, C.violet, C.amber, C.coral, C.mint, C.indigo];
const S5: Scene = ({ t }) => {
  const push = 1 + 0.04 * E(t, -0.3, 2.8, ease.smooth);
  const spin = t * 60;
  const breathe = 1 + 0.05 * Math.sin(t * 5);
  const rows = Array.from({ length: N_CARDS }, (_, i) => i).filter((i) => t >= tc(i) + TRAVEL - 0.05);
  const scroll = rows.reduce((s, i) => s + (i >= 5 ? E(t, tc(i) + TRAVEL, 0.35, ease.out) : 0), 0);
  return (
    <Stage t={t} tint={C.violet} tint2={C.cyan}>
      <div style={{ position: "absolute", inset: 0, transform: `scale(${push}) translate(${drift(t, 5, 6)}px, ${drift(t, 6, 4, 2)}px)` }}>
        {/* the incoming cards, falling toward the orb */}
        {Array.from({ length: N_CARDS }, (_, i) => i).map((i) => {
          const p = (t - tc(i)) / TRAVEL;
          if (p < 0 || p > 1) return null;
          const e = ease.in(p);
          const y = mix(-90, ORB.y, e), sc = p < 0.72 ? 1 : mix(1, 0.15, E(p, 0.72, 0.28, ease.in)), op = p < 0.8 ? 1 : 1 - (p - 0.8) / 0.2;
          const xo = Math.sin(i * 2.3) * 36 * (1 - e), col = COLS[i % COLS.length];
          return (
            <div key={i} style={{ position: "absolute", left: ORB.x - 230 + xo, top: y - 48, width: 460, height: 96, borderRadius: 26, background: "rgba(255,255,255,.92)", boxShadow: SHADOW.card, border: `1px solid ${C.line}`,
              display: "flex", alignItems: "center", gap: 20, padding: "0 22px", transform: `scale(${sc}) rotate(${Math.sin(i * 1.7) * 2.5 * (1 - e)}deg)`, opacity: op }}>
              <div style={{ width: 52, height: 52, borderRadius: 15, background: col, display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
                <div style={{ width: 24, height: 17, borderRadius: 5, border: "3px solid #fff", position: "relative" }}><div style={{ position: "absolute", left: 2, top: 2, width: 14, height: 6, borderLeft: "3px solid #fff", borderBottom: "3px solid #fff", transform: "rotate(-45deg) scale(.6)", display: "none" }} /></div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ width: `${70 + rnd(i) * 25}%`, height: 12, borderRadius: 6, background: "#C9CED8" }} />
                <div style={{ width: `${40 + rnd(i + 9) * 25}%`, height: 10, borderRadius: 5, background: "#DDE0E7", marginTop: 11 }} />
              </div>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: C.cyan, flex: "none" }} />
            </div>
          );
        })}
        {/* the agent orb */}
        <div style={{ position: "absolute", left: ORB.x, top: ORB.y, width: 0, height: 0 }}>
          <div style={{ position: "absolute", left: -200, top: -200, width: 400, height: 400, borderRadius: "50%", background: `radial-gradient(circle, rgba(124,108,255,${0.28 * breathe}), transparent 65%)` }} />
          <svg width={320} height={320} viewBox="-160 -160 320 320" style={{ position: "absolute", left: -160, top: -160, overflow: "visible" }}>
            <defs><linearGradient id="og" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stopColor={C.cyan} /><stop offset="1" stopColor={C.violet} /></linearGradient></defs>
            <circle r={130} fill="none" stroke="url(#og)" strokeWidth={5} strokeDasharray="60 28 14 28" strokeLinecap="round" transform={`rotate(${spin})`} opacity={0.9} />
            <circle r={150} fill="none" stroke="rgba(124,108,255,.35)" strokeWidth={3} strokeDasharray="4 16" strokeLinecap="round" transform={`rotate(${-spin * 0.6})`} />
            <circle r={96 * breathe} fill="url(#og)" style={{ filter: "drop-shadow(0 20px 40px rgba(124,108,255,.45))" }} />
            <circle r={96 * breathe} fill="none" stroke="rgba(255,255,255,.55)" strokeWidth={3} />
            <ellipse cx={-30} cy={-44} rx={46} ry={22} fill="rgba(255,255,255,.28)" transform="rotate(-25 -30 -44)" />
            <g transform={`scale(${1 + 0.15 * Math.sin(t * 4)}) rotate(${spin * 0.5})`}><path d="M0 -44 C4 -14 14 -4 44 0 C14 4 4 14 0 44 C-4 14 -14 4 -44 0 C-14 -4 -4 -14 0 -44Z" fill="#fff" /></g>
          </svg>
        </div>
        {/* running indicator: moon + pulsing dot */}
        <div style={{ position: "absolute", left: ORB.x - 100, top: ORB.y + 190, width: 200, height: 56, borderRadius: 30, background: "rgba(255,255,255,.9)", boxShadow: SHADOW.soft, border: `1px solid ${C.line}`, display: "flex", alignItems: "center", justifyContent: "center", gap: 18, opacity: S(t, 0.0) }}>
          <svg width={28} height={28} viewBox="0 0 24 24"><path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z" fill={C.violet} /></svg>
          <div style={{ position: "relative", width: 18, height: 18 }}>
            <div style={{ position: "absolute", inset: -((t * 14) % 14) / 2 * 1, borderRadius: "50%", border: `2px solid ${C.green}`, opacity: 1 - ((t * 14) % 14) / 14 }} />
            <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: C.green }} />
          </div>
          <div style={{ display: "flex", gap: 5 }}>{[0, 1, 2].map((k) => <div key={k} style={{ width: 8, height: 8, borderRadius: "50%", background: C.cyan, opacity: 0.35 + 0.65 * Math.max(0, Math.sin(t * 7 - k * 0.9)) }} />)}</div>
        </div>
        {/* flow trail between orb and window */}
        <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
          <defs><linearGradient id="tg" x1="0" x2="1"><stop offset="0" stopColor={C.violet} stopOpacity={0.6} /><stop offset="1" stopColor={C.cyan} stopOpacity={0.1} /></linearGradient></defs>
          <path d={`M${ORB.x + 130} ${ORB.y} C ${ORB.x + 260} ${ORB.y} ${WIN.x - 120} ${WIN.y + 400} ${WIN.x} ${WIN.y + 400}`} fill="none" stroke="url(#tg)" strokeWidth={4} strokeDasharray="6 14" strokeDashoffset={-t * 80} strokeLinecap="round" />
        </svg>
        {/* the resolved list window */}
        <div style={{ position: "absolute", left: WIN.x, top: WIN.y, width: WIN.w, height: WIN.h, borderRadius: 26, background: "rgba(255,255,255,.95)", boxShadow: SHADOW.lift, border: `1px solid ${C.line}`, overflow: "hidden", opacity: S(t, -0.3), transform: `translateY(${(1 - S(t, -0.3)) * 40}px)` }}>
          <div style={{ height: 56, display: "flex", alignItems: "center", gap: 9, padding: "0 20px", borderBottom: `1px solid ${C.line}`, background: "#FBFBFD" }}>
            {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => <div key={c} style={{ width: 13, height: 13, borderRadius: "50%", background: c }} />)}
            <div style={{ flex: 1 }} />
            <div style={{ width: 90, height: 12, borderRadius: 6, background: C.card }} />
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 56, bottom: 0, overflow: "hidden" }}>
            {rows.map((i) => {
              const t0 = tc(i) + TRAVEL, p = S(t, t0, { damping: 13, stiffness: 190 });
              const slot = rows.indexOf(i) - scroll;
              const y = 18 + slot * ROWH, col = COLS[i % COLS.length];
              const op = clamp(p * 2) * clamp(slot + 1.3);
              return (
                <div key={i} style={{ position: "absolute", left: 22, right: 22, top: y, height: 66, borderRadius: 18, background: p < 1 ? `rgba(34,181,115,${0.12 * (1 - p)})` : C.muted, border: `1px solid ${C.line}`, display: "flex", alignItems: "center", gap: 16, padding: "0 16px",
                  transform: `translateX(${(1 - p) * -90}px) scale(${mix(0.85, 1, p)})`, opacity: op }}>
                  <div style={{ width: 8, height: 36, borderRadius: 4, background: col, flex: "none" }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ width: `${60 + rnd(i) * 30}%`, height: 11, borderRadius: 6, background: "#C9CED8" }} />
                    <div style={{ width: `${30 + rnd(i + 9) * 25}%`, height: 9, borderRadius: 5, background: "#DDE0E7", marginTop: 10 }} />
                  </div>
                  <div style={{ transform: `scale(${S(t, t0 + 0.12)})` }}><Check size={38} /></div>
                </div>
              );
            })}
          </div>
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
      { at: 0.9, x: 520, y: 760, click: true },
      { at: 2.0, x: 960, y: 520, early: 0, dur: 0.75 },
      { at: 3.2, x: 1240, y: 800 },
    ],
  },
  sfx: {
    S3: [{ t: 0.0, kind: "whoosh", note: "headline words rise" }, { t: 0.4, kind: "pop", note: "sub line" }],
    S4: [
      { t: 1.01, kind: "click", note: "hand grabs the AI Agent tile" },
      { t: 1.3, kind: "slide", note: "drag glide" },
      { t: 2.0, kind: "snap", note: "tile snaps into the gap" },
      { t: 2.3, kind: "success", note: "wires draw, pulses start" },
      { t: 2.8, kind: "tick", note: "tiles tick in sequence" },
      { t: 3.3, kind: "tick", note: "slips become checks" },
    ],
    S5: [
      { t: 0.1, kind: "pop", note: "first resolved row" },
      { t: 0.7, kind: "tick", note: "card resolved" },
      { t: 1.3, kind: "tick", note: "card resolved" },
      { t: 1.9, kind: "success", note: "list keeps filling" },
    ],
  },
};
