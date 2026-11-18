// Group B: pillar 1, AI, Agents & Automation. MINIMAL PASS: one idea per scene.
// S3 title only; S4 drag the AI Agent into the gap, one line, one pulse; S5 the orb hands three tasks to three cards.
import React from "react";
import { C, Caption, E, Eyebrow, FONT, GRAD, SHADOW, S, Stage, Tool, Words, clamp, ease, mix, pressAt } from "../kit";
import type { Group, Scene } from "../types";

const Check: React.FC<{ p: number; size: number; color?: string; sw?: number }> = ({ p, size, color = "#fff", sw = 4 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12.5l4.5 4.5L19 7.5" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - clamp(p)} />
  </svg>
);
const Dot: React.FC<{ x: number; y: number; r: number; color: string; scale?: number; opacity?: number }> = ({ x, y, r, color, scale = 1, opacity = 1 }) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: r * 2, height: r * 2, borderRadius: "50%", background: color, opacity, boxShadow: `0 6px 18px ${color}88`,
    transform: `translate3d(${(x - r).toFixed(2)}px, ${(y - r).toFixed(2)}px, 0) scale(${scale.toFixed(4)})`, willChange: "transform" }} />
);

// ---------------- S3: pillar 1 title ----------------
const S3: Scene = ({ t }) => {
  const sub = S(t, 0.3);
  return (
    <Stage t={t} tint={C.cyan} tint2={C.violet}>
      <Eyebrow t={t} t0={-0.2} text="PILLAR 01" y={330} color={C.violet} />
      <Words t={t} t0={-0.12} text={"AI, Agents\n& Automation"} size={120} y={545} stagger={0.07} hi={{ AI: GRAD.ai, Agents: GRAD.ai, Automation: GRAD.ai }} />
      <div style={{ position: "absolute", left: 960, top: 790, transform: `translate3d(-50%,-50%,0) translateY(${((1 - sub) * 24).toFixed(2)}px)`, opacity: clamp(sub * 1.5), fontFamily: FONT, fontWeight: 500, fontSize: 36, color: C.sub, whiteSpace: "nowrap", letterSpacing: -0.3 }}>
        Connecting your tools to eliminate manual work.
      </div>
    </Stage>
  );
};

// ---------------- S4: cross-platform integrations ----------------
const TS = 210, Y = 540, XL = 540, XM = 960, XR = 1380, AY = 870;
const LogoTile: React.FC<{ t: number; x: number; tool: string; t0: number; check: number }> = ({ t, x, tool, t0, check }) => {
  const p = S(t, t0), pop = S(t, check, { damping: 12, stiffness: 220 });
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: TS, height: TS, opacity: clamp(p * 2), transform: `translate3d(${x - TS / 2}px, ${Y - TS / 2 + (1 - p) * 50}px, 0) scale(${mix(0.8, 1, p).toFixed(4)})`, willChange: "transform" }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: 52, background: C.navy, boxShadow: SHADOW.card, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Tool name={tool} size={120} style={{ filter: "brightness(0) invert(1)" }} />
      </div>
      <div style={{ position: "absolute", right: -18, top: -18, width: 62, height: 62, borderRadius: 31, background: C.green, border: "5px solid #fff", display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${pop.toFixed(4)})`, opacity: pop > 0.01 ? 1 : 0 }}>
        <Check p={E(t, check + 0.08, 0.25)} size={32} />
      </div>
    </div>
  );
};
const S4: Scene = ({ t }) => {
  const arrive = S(t, 0.1);
  const drag = E(t, 1.08, 0.92, ease.inOut);
  const snap = S(t, 2.0, { damping: 11, stiffness: 240 });
  const press = pressAt(t, 0.75);
  const dragging = t > 0.75 && t < 2.0 ? 1 : 0;
  const ay = mix(AY, Y, drag) + (t < 0.75 ? drift0(t) : 0);
  const sc = (t < 2.0 ? 1 - 0.05 * press + 0.06 * Math.sin(Math.PI * drag) : 1) * (t >= 2.0 ? mix(1.08, 1, snap) : 1);
  const line = E(t, 2.1, 0.5, ease.inOut);
  const pulse = E(t, 2.6, 0.7, ease.inOut);
  const glow = t > 3.2 ? 0.5 + 0.5 * Math.sin((t - 3.2) * 4) : 0;
  const slotP = S(t, 0.05);
  return (
    <Stage t={t} tint={C.cyan} tint2={C.violet}>
      <Caption t={t} text="Cross-platform integrations" grad={GRAD.ai} />
      {/* the hero group, enlarged as one (lead): few things, big */}
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "960px 800px", transform: "scale(1.2)" }}>
      {/* the one line, behind the tiles */}
      <div style={{ position: "absolute", left: XL, top: Y - 4, width: XR - XL, height: 8, borderRadius: 4, background: GRAD.ai, transformOrigin: "left center", transform: `scaleX(${line.toFixed(4)})`, opacity: 0.9, willChange: "transform" }} />
      {t > 2.6 && t < 3.4 && <Dot x={mix(XL, XR, pulse)} y={Y} r={20} color="#fff" opacity={Math.sin(Math.PI * clamp((t - 2.6) / 0.8)) } scale={1} />}
      {/* the empty slot */}
      <div style={{ position: "absolute", left: 0, top: 0, width: TS, height: TS, boxSizing: "border-box", borderRadius: 52, border: `5px dashed ${C.cyan}`, background: "rgba(56,200,255,.08)", opacity: clamp(slotP * 2) * (1 - clamp(snap * 3)),
        transform: `translate3d(${XM - TS / 2}px, ${Y - TS / 2}px, 0) scale(${(1 + 0.03 * Math.sin(t * 4)).toFixed(4)})`, willChange: "transform" }} />
      <LogoTile t={t} x={XL} tool="pipedrive" t0={-0.2} check={2.68} />
      <LogoTile t={t} x={XR} tool="odoo-1" t0={0.0} check={3.2} />
      {/* the AI Agent tile */}
      <div style={{ position: "absolute", left: 0, top: 0, width: TS, height: TS + 70, opacity: clamp(arrive * 2),
        transform: `translate3d(${XM - TS / 2}px, ${(ay - TS / 2 + (1 - arrive) * 50).toFixed(2)}px, 0) scale(${sc.toFixed(4)})`, willChange: "transform" }}>
        <div style={{ position: "absolute", width: TS, height: TS, borderRadius: 52, boxSizing: "border-box", border: "7px solid transparent", backgroundImage: `linear-gradient(#fff,#fff), ${GRAD.ai}`, backgroundOrigin: "border-box", backgroundClip: "padding-box, border-box",
          boxShadow: dragging ? SHADOW.lift : `${SHADOW.card}${glow ? `, 0 0 ${(30 * glow).toFixed(0)}px rgba(124,108,255,.45)` : ""}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Tool name="claude-removebg-preview" size={110} />
        </div>
        <div style={{ position: "absolute", top: TS + 14, width: TS, textAlign: "center", fontFamily: FONT, fontWeight: 700, fontSize: 32, color: C.navy, whiteSpace: "nowrap", opacity: t < 2.0 ? 1 : 0 }}>AI Agent</div>
        <div style={{ position: "absolute", right: -18, top: -18, width: 62, height: 62, borderRadius: 31, background: C.green, border: "5px solid #fff", display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${S(t, 2.95, { damping: 12, stiffness: 220 }).toFixed(4)})`, opacity: t > 2.95 ? 1 : 0 }}>
          <Check p={E(t, 3.03, 0.25)} size={32} />
        </div>
      </div>
      </div>
    </Stage>
  );
};
const drift0 = (t: number) => 6 * Math.sin(t * 3);

// ---------------- S5: custom AI agents ----------------
const OX = 600, OY = 610, CX = 1290, CW = 600, CH = 150;
const TASKS = [
  { name: "Email", y: 400, t0: 0.4, d: <g><rect x="3" y="5.5" width="18" height="13" rx="3" /><path d="M4 8l8 6 8-6" /></g> },
  { name: "Report", y: 610, t0: 0.9, d: <g><rect x="5" y="3.5" width="14" height="17" rx="3" /><path d="M8.5 9h7M8.5 13h7M8.5 17h4" /></g> },
  { name: "Booking", y: 820, t0: 1.4, d: <g><rect x="3.5" y="5" width="17" height="15" rx="3" /><path d="M3.5 10h17M8 3v4M16 3v4" /></g> },
];
const S5: Scene = ({ t }) => {
  const orb = S(t, -0.2, { damping: 13, stiffness: 140 });
  const breathe = 1 + 0.025 * Math.sin(t * 3);
  return (
    <Stage t={t} tint={C.violet} tint2={C.cyan}>
      <Caption t={t} text="Custom AI Agents" grad={GRAD.ai} />
      {/* the hero group, enlarged as one (lead): few things, big */}
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "960px 620px", transform: "scale(1.15)" }}>
      {/* connection lines: straight from orb to each card */}
      {TASKS.map((k, i) => {
        const x0 = OX + 150, x1 = CX - CW / 2, dy = k.y - OY, len = Math.hypot(x1 - x0, dy), ang = Math.atan2(dy, x1 - x0);
        const p = E(t, k.t0 - 0.1, 0.35, ease.out), run = E(t, k.t0, 0.4, ease.inOut);
        return (
          <React.Fragment key={i}>
            <div style={{ position: "absolute", left: x0, top: OY - 3, width: len, height: 6, borderRadius: 3, background: "rgba(41,58,81,.14)", transformOrigin: "0 50%", transform: `rotate(${ang}rad) scaleX(${p.toFixed(4)})`, willChange: "transform" }} />
            {t > k.t0 && t < k.t0 + 0.45 && <Dot x={x0 + (x1 - x0) * run} y={OY + dy * run} r={16} color={C.violet} opacity={Math.sin(Math.PI * clamp((t - k.t0) / 0.45))} />}
          </React.Fragment>
        );
      })}
      {/* the agent orb */}
      <div style={{ position: "absolute", left: 0, top: 0, width: 300, height: 300, borderRadius: "50%", background: `radial-gradient(circle at 35% 30%, #A89CFF, ${C.violet} 55%, ${C.cyan} 130%)`, boxShadow: `0 30px 80px rgba(124,108,255,.4), 0 0 ${(50 + 30 * Math.sin(t * 3)).toFixed(0)}px rgba(56,200,255,.45)`,
        opacity: clamp(orb * 2), transform: `translate3d(${OX - 150}px, ${OY - 150}px, 0) scale(${(mix(0.7, 1, orb) * breathe).toFixed(4)})`, willChange: "transform", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg viewBox="0 0 24 24" width={130} height={130} fill="#fff" style={{ transform: `rotate(${(t * 25).toFixed(2)}deg)` }}><path d="M12 2l2.2 6.8L21 11l-6.8 2.2L12 20l-2.2-6.8L3 11l6.8-2.2z" /></svg>
      </div>
      {/* three task cards */}
      {TASKS.map((k, i) => {
        const p = S(t, -0.1 + i * 0.12), done = S(t, k.t0 + 0.4, { damping: 13, stiffness: 200 }), d = E(t, k.t0 + 0.4, 0.3);
        return (
          <div key={i} style={{ position: "absolute", left: 0, top: 0, width: CW, height: CH, boxSizing: "border-box", borderRadius: 34, display: "flex", alignItems: "center", gap: 26, padding: "0 34px",
            background: d > 0 ? `rgba(34,181,115,${(0.06 + 0.1 * d).toFixed(3)})` : "#fff", border: `3px solid ${d > 0.01 ? C.green : C.line}`, boxShadow: SHADOW.card, opacity: clamp(p * 2),
            transform: `translate3d(${CX - CW / 2 + (1 - p) * 60}px, ${k.y - CH / 2}px, 0) scale(${(1 + 0.04 * Math.sin(Math.PI * done)).toFixed(4)})`, willChange: "transform" }}>
            <svg viewBox="0 0 24 24" width={64} height={64} fill="none" stroke={C.navy} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">{k.d}</svg>
            <div style={{ flex: 1, fontFamily: FONT, fontWeight: 700, fontSize: 50, color: C.navy, letterSpacing: -0.5 }}>{k.name}</div>
            <div style={{ width: 64, height: 64, borderRadius: 32, background: C.green, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${done.toFixed(4)})`, opacity: t > k.t0 + 0.4 ? 1 : 0 }}>
              <Check p={E(t, k.t0 + 0.48, 0.3)} size={38} />
            </div>
          </div>
        );
      })}
      </div>
    </Stage>
  );
};

export const GROUP: Group = {
  scenes: { S3, S4, S5 },
  hand: {
    S3: [], S5: [],
    S4: [
      { at: 0.75, x: 960, y: 884, click: true },            // (960, 870) and (960, 540) seen through the 1.2x hero group
      { at: 2.0, x: 960, y: 488, early: 0, dur: 0.92 },
    ],
  },
  sfx: {
    S3: [{ t: 0.0, kind: "whoosh", note: "headline words rise" }, { t: 0.4, kind: "pop", note: "sub line" }],
    S4: [
      { t: 0.86, kind: "click", note: "hand presses the AI Agent tile" },
      { t: 1.4, kind: "slide", note: "drag glide into the slot" },
      { t: 2.0, kind: "snap", note: "tile snaps into the slot" },
      { t: 2.6, kind: "sparkle", note: "pulse runs along the line" },
      { t: 3.2, kind: "success", note: "last check lands" },
    ],
    S5: [
      { t: 0.45, kind: "sparkle", note: "pulse to Email" },
      { t: 0.85, kind: "pop", note: "Email done" },
      { t: 1.35, kind: "success", note: "Report done" },
      { t: 1.85, kind: "thud", note: "Booking done" },
    ],
  },
};
