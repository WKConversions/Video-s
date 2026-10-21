// TNOA (The Network of Agents), 20 s, no voice-over, music only, 60 fps. Apple-style motion in TNOA's own brand
// (thenetworkofagents.com: navy #0B1220, blue #2563EB / #1DA1F2, soft #F4F7FB, green and amber status, system sans).
// Five beats: a network forms -> it folds into the live agent-activity panel -> the numbers -> agent + engineer ->
// the wordmark and "Book a Call".
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import "./lib";   // loads DM Sans (the site uses the system sans)

const B = { navy: "#0B1220", text: "#1A2233", muted: "#5A6678", light: "#AAB4C4", blue: "#2563EB", sky: "#1DA1F2", bg: "#F4F7FB", white: "#FFFFFF", line: "#E2E8F1", green: "#34D399", amber: "#FBBF24" };
const SANS = "DM Sans";
const clamp = (v: number) => Math.min(1, Math.max(0, v));
const mix = (a: number, b: number, k: number) => a + (b - a) * k;
// a damped spring from 0 to 1 starting at t0 (s): response = period (s), damping 1 = no overshoot, 0.6 = Apple bouncy
const spring = (t: number, t0: number, response = 0.45, damping = 0.62) => {
  const x = t - t0; if (x <= 0) return 0;
  const w = (2 * Math.PI) / response, z = damping;
  if (z >= 1) return 1 - Math.exp(-w * x) * (1 + w * x);
  const wd = w * Math.sqrt(1 - z * z);
  return 1 - Math.exp(-z * w * x) * (Math.cos(wd * x) + ((z * w) / wd) * Math.sin(wd * x));
};
const ease = (t: number) => 1 - Math.pow(1 - clamp(t), 3);
const win = (t: number, a: number, b: number) => t >= a && t < b;

// the network: twelve agents on two rings around a hub
const NODES = Array.from({ length: 12 }, (_, i) => {
  const ring = i % 2 === 0 ? 300 : 470, a = (i / 12) * Math.PI * 2 + (i % 2 ? 0.26 : 0);
  return { x: Math.cos(a) * ring * 1.25, y: Math.sin(a) * ring * 0.78, d: 0.35 + i * 0.07 };
});
const ROWS = [
  { task: "Qualify inbound lead — ACME Roofing", agent: "Lead Response", ok: true, status: "Routed to sales", time: "38s" },
  { task: "Ticket #4812 — billing question", agent: "Support Triage", ok: true, status: "Resolved", time: "1m 12s" },
  { task: "Invoice #2207 — 14 days overdue", agent: "Collections", ok: true, status: "Reminder sent", time: "22s" },
  { task: "Proposal draft — discovery call", agent: "Proposals", ok: false, status: "Human review", time: "4m 03s" },
];

const Dots: React.FC<{ t: number; dark?: boolean }> = ({ t, dark }) => (
  <AbsoluteFill style={{ transform: `translate(${-((t * 150) % 72)}px, ${-((t * 90) % 72)}px)`, width: 2100, height: 1200,
    backgroundImage: `radial-gradient(${dark ? "rgba(255,255,255,0.16)" : "rgba(37,99,235,0.24)"} 3.2px, transparent 3.6px)`, backgroundSize: "72px 72px" }} />
);

const Network: React.FC<{ t: number }> = ({ t }) => {
  // forms 0-3.4 s, then folds into the panel (3.4-4.4 s)
  const fold = ease((t - 3.4) / 0.9), rot = t * 0.45, hub = spring(t, 0.15, 0.5, 0.55);
  const pts = NODES.map((n) => {
    const p = spring(t, n.d, 0.55, 0.6), a = Math.atan2(n.y, n.x) + rot, r = Math.hypot(n.x / 1.25, n.y / 0.78);
    const x = Math.cos(a) * r * 1.25 * p * (1 - fold), y = Math.sin(a) * r * 0.78 * p * (1 - fold);
    return { x, y, p };
  });
  const title = (i: number) => spring(t, 1.4 + i * 0.03, 0.5, 0.58);
  const words = "The Network of Agents".split("");
  return (
    <AbsoluteFill style={{ opacity: 1 - clamp((t - 4.1) / 0.3) }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <g transform="translate(960 470)">
          {pts.map((q, i) => <line key={i} x1={0} y1={0} x2={q.x} y2={q.y} stroke={B.blue} strokeOpacity={0.22 * clamp(q.p)} strokeWidth={2} />)}
          {pts.map((q, i) => { const j = (i + 2) % 12, r = pts[j]; return <line key={"r" + i} x1={q.x} y1={q.y} x2={r.x} y2={r.y} stroke={B.sky} strokeOpacity={0.16 * clamp(q.p) * clamp(r.p)} strokeWidth={1.5} />; })}
          {pts.map((q, i) => { // a pulse runs out along every spoke, one after another
            const ph = ((t * 0.9 + i / 12) % 1), s = clamp(q.p);
            return <circle key={"p" + i} cx={q.x * ph} cy={q.y * ph} r={5} fill={B.sky} opacity={0.8 * s * (1 - fold)} />;
          })}
          {pts.map((q, i) => <circle key={"n" + i} cx={q.x} cy={q.y} r={Math.max(0, 15 * q.p)} fill={B.white} stroke={B.blue} strokeWidth={4} />)}
          <circle cx={0} cy={0} r={Math.max(0, 46 * hub * (1 + 0.04 * Math.sin(t * 5)))} fill={B.blue} />
          <circle cx={0} cy={0} r={Math.max(0, 46 * hub + 30 * ((t * 0.8) % 1))} fill="none" stroke={B.blue} strokeOpacity={0.35 * (1 - ((t * 0.8) % 1)) * hub} strokeWidth={3} />
        </g>
      </svg>
      <div style={{ position: "absolute", left: 0, right: 0, top: 850, display: "flex", justifyContent: "center", fontFamily: SANS, fontWeight: 700, fontSize: 92, letterSpacing: "-0.035em", color: B.navy, whiteSpace: "pre" }}>
        {words.map((ch, i) => { const p = title(i); return <span key={i} style={{ display: "inline-block", transform: `translateY(${(1 - p) * 70}px) scale(${0.6 + 0.4 * p})`, opacity: clamp(p * 2), color: i >= 15 ? B.blue : B.navy }}>{ch}</span>; })}
      </div>
    </AbsoluteFill>
  );
};

const Activity: React.FC<{ t: number }> = ({ t }) => {
  // the hub grows into the panel (3.6-4.4 s), rows stack in like notifications, then the panel lifts away (8.6 s)
  const g = spring(t, 3.55, 0.6, 0.72), out = ease((t - 8.55) / 0.55);
  const W = mix(92, 1180, g), H = mix(92, 640, g), R = mix(46, 34, g);
  const lift = -out * 1100, tilt = Math.sin(t * 0.8) * 1.2;
  return (
    <AbsoluteFill style={{ transform: `translateY(${lift}px)` }}>
      <div style={{ position: "absolute", left: 960 - W / 2, top: 470 - H / 2 + 40 * g, width: W, height: H, borderRadius: R, background: g < 0.3 ? B.blue : B.white,
        boxShadow: "0 2px 6px rgba(11,18,32,0.06), 0 50px 120px -40px rgba(11,18,32,0.35)", overflow: "hidden", transform: `rotate(${tilt * 0.3}deg)`, fontFamily: SANS }}>
        <div style={{ opacity: clamp((g - 0.5) * 3), position: "absolute", inset: 0 }}>
          <div style={{ height: 76, background: B.navy, display: "flex", alignItems: "center", padding: "0 34px", gap: 12 }}>
            {[B.amber, B.green, B.sky].map((c, i) => <div key={i} style={{ width: 13, height: 13, borderRadius: 7, background: c, opacity: 0.9 }} />)}
            <div style={{ color: B.light, fontSize: 24, marginLeft: 18, fontFamily: "monospace" }}>tnoa ~ agent activity</div>
            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10, color: B.green, fontSize: 22, fontWeight: 600 }}>
              <div style={{ width: 11, height: 11, borderRadius: 6, background: B.green, opacity: 0.5 + 0.5 * Math.sin(t * 8) }} />Live</div>
          </div>
          {ROWS.map((r, i) => {
            const p = spring(t, 4.55 + i * 0.62, 0.5, 0.6), push = ROWS.slice(i + 1).reduce((s, _, j) => s + spring(t, 4.55 + (i + 1 + j) * 0.62, 0.5, 0.8), 0);
            const y = 100 + (ROWS.length - 1 - i) * 128 - (ROWS.length - 1 - i) * 128 * (1 - clamp(push / Math.max(1, ROWS.length - 1 - i)));
            const row = 100 + i * 128;
            return (
              <div key={i} style={{ position: "absolute", left: 30, right: 30, top: 0, height: 110, transform: `translateY(${mix(row - 60, row, p)}px) scale(${0.9 + 0.1 * p})`, opacity: clamp(p * 1.6),
                borderRadius: 22, background: i % 2 ? B.white : B.bg, border: `1.5px solid ${B.line}`, display: "flex", alignItems: "center", padding: "0 30px", gap: 26 }}>
                <div style={{ width: 52, height: 52, borderRadius: 16, background: r.ok ? "rgba(52,211,153,0.16)" : "rgba(251,191,36,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, color: r.ok ? "#059669" : "#B45309", transform: `scale(${spring(t, 4.75 + i * 0.62, 0.4, 0.5)})` }}>{r.ok ? "✓" : "!"}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 29, fontWeight: 600, color: B.text, letterSpacing: "-0.01em" }}>{r.task}</div>
                  <div style={{ fontSize: 22, color: B.muted, marginTop: 4 }}>{r.agent} agent</div>
                </div>
                <div style={{ fontSize: 23, fontWeight: 600, padding: "9px 18px", borderRadius: 999, background: r.ok ? "rgba(52,211,153,0.16)" : "rgba(251,191,36,0.22)", color: r.ok ? "#047857" : "#92400E" }}>{r.status}</div>
                <div style={{ fontSize: 24, color: B.muted, width: 92, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{r.time}</div>
              </div>
            );
            void y;
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Roll: React.FC<{ value: number; t: number; t0: number; dec?: number; size: number; color: string }> = ({ value, t, t0, dec = 0, size, color }) => {
  const p = clamp(ease((t - t0) / 1.1)), v = value * p;
  return <span style={{ fontSize: size, fontWeight: 700, letterSpacing: "-0.04em", color, fontVariantNumeric: "tabular-nums" }}>{v.toFixed(dec)}</span>;
};

const Bento: React.FC<{ t: number }> = ({ t }) => {
  // three tiles rise in from below with staggered bounces (8.7-9.6 s), drift, then fall away down (12.6 s)
  const out = ease((t - 12.55) / 0.5);
  const tile = (i: number) => spring(t, 8.75 + i * 0.16, 0.55, 0.6);
  const T = [
    { x: 150, y: 210, w: 760, h: 660, bg: B.navy, fg: B.white, k: "Leads handled today", v: <Roll value={312} t={t} t0={8.9} size={250} color={B.white} /> },
    { x: 950, y: 210, w: 820, h: 310, bg: B.blue, fg: B.white, k: "Resolved without escalation", v: <span><Roll value={96.8} dec={1} t={t} t0={9.05} size={150} color={B.white} /><span style={{ fontSize: 110, fontWeight: 700 }}>%</span></span> },
    { x: 950, y: 560, w: 820, h: 310, bg: B.white, fg: B.navy, k: "Avg. response time", v: <span style={{ fontSize: 150, fontWeight: 700, letterSpacing: "-0.04em", color: B.navy }}>{t < 9.2 ? "0m 00s" : `${Math.min(2, Math.floor(ease((t - 9.2) / 1.1) * 2.99))}m ${String(Math.round(ease((t - 9.2) / 1.1) * 41)).padStart(2, "0")}s`}</span> },
  ];
  return (
    <AbsoluteFill style={{ transform: `translateY(${out * 1200}px) rotate(${out * 4}deg)` }}>
      {T.map((b, i) => {
        const p = tile(i), drift = Math.sin(t * 2.2 + i) * 22;
        return (
          <div key={i} style={{ position: "absolute", left: 0, top: 0, width: b.w, height: b.h, borderRadius: 44, background: b.bg, color: b.fg, fontFamily: SANS, overflow: "hidden",
            transform: `translate(${b.x}px, ${b.y + (1 - p) * 700 + drift}px) scale(${0.85 + 0.15 * p})`, boxShadow: "0 40px 90px -40px rgba(11,18,32,0.35)", border: b.bg === B.white ? `1.5px solid ${B.line}` : "none" }}>
            <div style={{ position: "absolute", left: 52, top: 44, fontSize: 30, fontWeight: 500, opacity: 0.75 }}>{b.k}</div>
            <div style={{ position: "absolute", left: 48, bottom: i === 0 ? 30 : 18 }}>{b.v}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const Accountable: React.FC<{ t: number }> = ({ t }) => {
  // an agent and an engineer slide together and lock (gooey join), the two lines pop in (12.8-16.4 s)
  const a = spring(t, 12.75, 0.6, 0.6), join = spring(t, 13.6, 0.55, 0.55), out = ease((t - 16.3) / 0.45);
  const gap = mix(520, 150, join), sc = 1 - out * 0.4, op = 1 - out;
  const l1 = spring(t, 13.9, 0.5, 0.58), l2 = spring(t, 14.6, 0.5, 0.58);
  return (
    <AbsoluteFill style={{ opacity: op, transform: `scale(${sc})` }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <defs><filter id="tg"><feGaussianBlur stdDeviation="16" /><feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 26 -11" /></filter></defs>
        <g filter="url(#tg)">
          <circle cx={960 - gap / 2 - (1 - a) * 500} cy={400} r={95 * clamp(a * 1.2)} fill={B.blue} />
          <circle cx={960 + gap / 2 + (1 - a) * 500} cy={400} r={95 * clamp(a * 1.2)} fill={B.navy} />
        </g>
        <g transform={`translate(${960 - gap / 2 - (1 - a) * 500} 400)`} opacity={clamp(a * 2)}>
          <path d="M0 -38 L9 -9 L38 0 L9 9 L0 38 L-9 9 L-38 0 L-9 -9 Z" fill={B.white} transform={`rotate(${t * 40})`} />
        </g>
        <g transform={`translate(${960 + gap / 2 + (1 - a) * 500} 400)`} opacity={clamp(a * 2)}>
          <circle cx={0} cy={-16} r={18} fill={B.white} /><path d="M-34 34 C-34 8 34 8 34 34 Z" fill={B.white} />
        </g>
      </svg>
      <div style={{ position: "absolute", left: 0, right: 0, top: 600, textAlign: "center", fontFamily: SANS, fontWeight: 700, letterSpacing: "-0.035em" }}>
        <div style={{ fontSize: 96, color: B.navy, transform: `translateY(${(1 - l1) * 60}px)`, opacity: clamp(l1 * 2) }}>Proven agents.</div>
        <div style={{ fontSize: 96, color: B.blue, transform: `translateY(${(1 - l2) * 60}px)`, opacity: clamp(l2 * 2) }}>Accountable engineers.</div>
      </div>
    </AbsoluteFill>
  );
};

const End: React.FC<{ t: number }> = ({ t }) => {
  // navy floods up from the joined pair; the wordmark lands letter by letter; the capsule springs open into the button
  const flood = ease((t - 16.25) / 0.6), w = (i: number) => spring(t, 16.75 + i * 0.07, 0.5, 0.55), cap = spring(t, 17.7, 0.6, 0.6);
  const press = t > 18.9 && t < 19.15 ? 0.95 : 1, W = mix(160, 720, cap), bob = Math.sin(t * 2.2) * 6;
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 960, top: 540, width: 2400, height: 2400, borderRadius: 1200, background: B.navy, transform: `translate(-50%, -50%) scale(${flood})` }} />
      {flood > 0.5 && <Dots t={t} dark />}
      <div style={{ position: "absolute", left: 0, right: 0, top: 330 + bob * 0.5, display: "flex", justifyContent: "center", fontFamily: SANS, fontWeight: 700, fontSize: 230, letterSpacing: "-0.05em", color: B.white }}>
        {"TNOA".split("").map((c, i) => { const p = w(i); return <span key={i} style={{ display: "inline-block", transform: `translateY(${(1 - p) * -160}px)`, opacity: clamp(p * 2) }}>{c}</span>; })}
        <span style={{ color: B.sky, display: "inline-block", transform: `scale(${spring(t, 17.15, 0.45, 0.5)})` }}>.</span>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 590, textAlign: "center", fontFamily: SANS, fontSize: 40, color: B.light, opacity: clamp((t - 17.3) * 3) }}>The Network of Agents</div>
      <div style={{ position: "absolute", left: 960 - W / 2, top: 700 + bob, width: W, height: 96, borderRadius: 48, background: B.blue, transform: `scale(${press})`, boxShadow: "0 24px 60px -20px rgba(37,99,235,0.7)",
        display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", fontFamily: SANS, fontWeight: 600, fontSize: 38, color: B.white, opacity: clamp(cap * 3), whiteSpace: "nowrap" }}>
        <span style={{ opacity: clamp((cap - 0.6) * 3) }}>Book a Call — Free Audit →</span>
        <div style={{ position: "absolute", top: 0, bottom: 0, width: 120, left: mix(-200, W + 100, clamp((t - 18.4) / 0.8)), background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)" }} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 840 + bob, textAlign: "center", fontFamily: SANS, fontSize: 34, color: B.light, opacity: clamp((t - 18.3) * 3) }}>thenetworkofagents.com</div>
    </AbsoluteFill>
  );
};

export const Story: React.FC = () => {
  const t = useCurrentFrame() / 60;
  const cam = 1.04 + 0.035 * Math.sin(t * 0.7);
  return (
    <AbsoluteFill style={{ background: B.bg, overflow: "hidden" }}>
      <Dots t={t} />
      <AbsoluteFill style={{ transform: `translate(${Math.sin(t * 0.8) * 40}px, ${Math.cos(t * 0.6) * 24}px) scale(${cam}) rotate(${Math.sin(t * 0.5) * 0.8}deg)` }}>
        {win(t, 0, 4.5) && <Network t={t} />}
        {win(t, 3.5, 9.3) && <Activity t={t} />}
        {win(t, 8.6, 13.2) && <Bento t={t} />}
        {win(t, 12.7, 16.9) && <Accountable t={t} />}
        {t >= 16.2 && <End t={t} />}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
