// Klyro (klyro-site): "Customer operations. Always in motion." A 12 s seamless loop in Klyro's own brand (site
// tokens: paper #f1f0e9, ink #151715, lime #c9ff3d, purple #7566ff, blue #4d8cff, orange #ff7048; Manrope + DM Mono).
// Every 4 s one customer signal travels into the Klyro hub, the hub decides, and a next best action comes out.
// Everything is a function of (time mod 4 s), so the last frame flows into the first.
import React from "react";
import { AbsoluteFill, continueRender, delayRender, Easing, staticFile, useCurrentFrame } from "remotion";
import { loadFont } from "@remotion/fonts";

const K = { paper: "#F1F0E9", ink: "#151715", muted: "#686B65", lime: "#C9FF3D", purple: "#7566FF", blue: "#4D8CFF", orange: "#FF7048" };
const SANS = "Manrope", MONO = "DM Mono";
const fh = typeof window !== "undefined" ? delayRender("fonts") : null;
if (typeof window !== "undefined") {
  Promise.all([
    ...[500, 600, 700, 800].map((w) => loadFont({ family: SANS, url: staticFile(`fonts/manrope-${w}.woff2`), weight: String(w) })),
    ...[400, 500].map((w) => loadFont({ family: MONO, url: staticFile(`fonts/dmmono-${w}.woff2`), weight: String(w) })),
  ]).then(() => fh !== null && continueRender(fh));
}
const OUT = Easing.bezier(0.22, 1, 0.36, 1), INOUT = Easing.bezier(0.65, 0, 0.35, 1);
const c01 = (x: number) => Math.min(1, Math.max(0, x));
const k = (t: number, a: number, d: number, e = OUT) => e(c01((t - a) / d));
const spring = (t: number, a: number, f = 2.2, z = 0.5) => { const u = t - a; if (u <= 0) return 0; const w = 2 * Math.PI * f; return 1 - Math.exp(-z * w * u) * Math.cos(w * Math.sqrt(1 - z * z) * u); };
const SHADOW = "0 0 2px rgba(21,23,21,0.08), 0 0 24px rgba(21,23,21,0.08), 0 0 70px rgba(21,23,21,0.08)";

// the three signals and the moves Klyro makes from them (copy from the site)
const CYCLE = [
  { icon: "!", col: K.orange, title: "Churn risk detected", meta: "Arcade Labs · 2m ago", score: 82, action: "Protect the renewal", conf: "94% confidence" },
  { icon: "↗", col: K.purple, title: "Expansion intent", meta: "Northstar · 8m ago", score: 94, action: "Unlock expansion", conf: "Buying signal" },
  { icon: "→", col: K.blue, title: "Handoff ready", meta: "Harbor Co. · 14m ago", score: 76, action: "Accelerate onboarding", conf: "Owner assigned" },
];
const P = 4; // seconds per signal

const SignalCard: React.FC<{ s: (typeof CYCLE)[number] }> = ({ s }) => (
  <div style={{ width: 400, height: 96, background: "#fff", borderRadius: 14, boxShadow: SHADOW, display: "flex", alignItems: "center", gap: 16, padding: "0 22px", boxSizing: "border-box", fontFamily: SANS }}>
    <div style={{ width: 44, height: 44, borderRadius: 22, background: `${s.col}26`, color: s.col, fontWeight: 800, fontSize: 22, display: "flex", alignItems: "center", justifyContent: "center" }}>{s.icon}</div>
    <div style={{ flex: 1 }}>
      <div style={{ fontWeight: 700, fontSize: 22, color: K.ink }}>{s.title}</div>
      <div style={{ fontSize: 16, color: K.muted, marginTop: 2 }}>{s.meta}</div>
    </div>
    <div style={{ fontFamily: MONO, fontSize: 18, color: K.muted }}>{s.score}</div>
  </div>
);

const ActionCard: React.FC<{ s: (typeof CYCLE)[number] }> = ({ s }) => (
  <div style={{ width: 430, height: 128, background: K.lime, borderRadius: 16, boxShadow: SHADOW, padding: "20px 24px", boxSizing: "border-box", fontFamily: SANS, color: K.ink }}>
    <div style={{ fontFamily: MONO, fontWeight: 500, fontSize: 14, letterSpacing: "0.12em" }}>NEXT BEST ACTION</div>
    <div style={{ fontWeight: 700, fontSize: 30, letterSpacing: "-0.02em", marginTop: 8 }}>{s.action}</div>
    <div style={{ fontSize: 17, marginTop: 4, opacity: 0.75 }}>{s.conf}</div>
  </div>
);


// the streams: small chips flowing into the hub (signals) and out of it (actions), steady, periodic over 12 s
const INS = [["Usage −38%", K.purple], ["Support ticket", K.orange], ["CRM note", K.blue], ["Sales call", K.purple], ["Inbox", K.blue], ["Product event", K.orange]] as const;
const OUTS = ["Notify CSM", "Schedule check-in", "Brief owner", "Run play", "Route insight", "Update CRM"];
const SP = 340, V = 850;                                   // chip spacing (px) and speed (px/s): 850 × 12 = 30 × 340 → seamless
const Stream: React.FC<{ t: number; side: "in" | "out"; HX: number; y: number; shift?: number }> = ({ t: t0, side, HX, y, shift = 0 }) => {
  const t = t0 + shift / V, off = (t * V) % SP, n = 8;
  return (<>{Array.from({ length: n }, (_, j) => {
    const idx = (Math.floor((t * V) / SP) + j) % 6;
    const x = side === "in" ? HX - 160 - (n - 1 - j) * SP + off - SP : HX + 160 + j * SP + off - SP;
    const fade = side === "in" ? c01((x + 200) / 400) * c01((HX - 150 - x) / 140) : c01((x - HX - 140) / 160) * c01((2100 - x) / 400);
    if (fade <= 0) return null;
    const label = side === "in" ? INS[(idx + 600) % 6][0] : OUTS[(600 - idx) % 6];
    const col = side === "in" ? INS[(idx + 600) % 6][1] : K.ink;
    return (
      <div key={j} style={{ position: "absolute", left: side === "in" ? x - 190 : x, top: y - 32, height: 64, padding: "0 24px", borderRadius: 32, display: "flex", alignItems: "center", gap: 12,
        background: side === "in" ? "#fff" : "rgba(201,255,61,0.9)", boxShadow: SHADOW, opacity: fade, fontFamily: SANS, fontWeight: 700, fontSize: 25, color: K.ink, whiteSpace: "nowrap" }}>
        <span style={{ width: 10, height: 10, borderRadius: 5, background: col }} />{label}
      </div>);
  })}</>);
};

export const Loop: React.FC = () => {
  const t = useCurrentFrame() / 60;
  const i = Math.floor(t / P) % 3, u = t % P;            // which signal, and local time in its 4 s cycle
  const s = CYCLE[i], prev = CYCLE[(i + 2) % 3];
  const HX = 960, HY = 470;                                  // the hub, centred
  // signal (1.5×): 0.0–1.8 s travels in from the left, shrinking into the hub at the end
  const sIn = k(u, 0, 1.8, INOUT);
  const sx = mixv(-420, HX - 140, sIn), sScale = 1.5 * (1 - 0.88 * k(u, 1.45, 0.45, INOUT)), sOp = 1 - k(u, 1.7, 0.2);
  // hub: pulses as it decides (1.8–2.4 s), a lime ring sweeps
  const pulse = spring(u, 1.8, 2.4, 0.45) * (1 - k(u, 2.3, 0.6));
  const ring = k(u, 1.8, 0.7, INOUT), ringOp = 1 - k(u, 2.45, 0.4);
  // action (1.5×): springs out at 2.1 s and keeps gliding right until 4.6 s (into the next cycle), so something always moves
  const act = (v: number, a: (typeof CYCLE)[number], key: string) => {
    if (v < 2.1 || v > 4.7) return null;
    const pop = spring(v, 2.1, 1.8, 0.55), glide = k(v, 2.1, 2.5, (x) => x), out = k(v, 4.1, 0.6, INOUT);
    const x = HX + 160 + 120 * pop + 520 * glide;
    return <div key={key} style={{ position: "absolute", left: x, top: HY - 96, opacity: c01(pop * 3) * (1 - out), transform: `scale(${1.5 * (0.6 + 0.4 * c01(pop))})`, transformOrigin: "0% 50%" }}><ActionCard s={a} /></div>;
  };
  const step = u < 1.8 ? 0 : u < 2.3 ? 1 : 2;
  return (
    <AbsoluteFill style={{ background: K.paper, fontFamily: SANS, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 800, textAlign: "center", color: K.ink, fontWeight: 600, fontSize: 72, letterSpacing: "-0.05em", lineHeight: 1 }}>
        Customer operations. <span style={{ color: "#757971", fontWeight: 500 }}>Always in motion.</span>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 120, display: "flex", justifyContent: "center", gap: 34, fontFamily: MONO, fontWeight: 500, fontSize: 20, letterSpacing: "0.14em" }}>
        {["LISTEN EVERYWHERE", "DECIDE INTELLIGENTLY", "MOVE AS ONE"].map((w, j) => (
          <span key={w} style={{ color: j === step ? K.ink : "#A8AAA3", display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ width: 10, height: 10, borderRadius: 5, background: j === step ? K.lime : "#CFCFC8", boxShadow: j === step ? "0 0 0 5px rgba(201,255,61,0.25)" : undefined }} />{w}
          </span>))}
      </div>
      <div style={{ position: "absolute", left: 0, width: HX - 130, top: HY - 1, height: 2, background: `linear-gradient(90deg, rgba(0,0,0,0), ${s.col}66)` }} />
      <div style={{ position: "absolute", left: HX + 130, width: 830, top: HY - 1, height: 2, background: "linear-gradient(90deg, rgba(150,200,20,0.7), rgba(201,255,61,0))" }} />
      <Stream t={t} side="in" HX={HX} y={HY + 150} /><Stream t={t} side="out" HX={HX} y={HY + 150} />
      <Stream t={t} side="in" HX={HX} y={HY - 150} shift={3 * SP / 2} /><Stream t={t} side="out" HX={HX} y={HY - 150} shift={3 * SP / 2} />
      {sOp > 0.001 && <div style={{ position: "absolute", left: sx - 400, top: HY - 48, opacity: sOp, transform: `scale(${sScale})`, transformOrigin: "100% 50%" }}><SignalCard s={s} /></div>}
      {act(u, s, "a")}{act(u + P, prev, "b")}
      <div style={{ position: "absolute", left: HX - 120, top: HY - 120, width: 240, height: 240, transform: `scale(${1 + 0.07 * pulse})` }}>
        <svg width={240} height={240} style={{ position: "absolute", inset: 0, overflow: "visible", opacity: ringOp }}>
          <circle cx={120} cy={120} r={142} fill="none" stroke={K.lime} strokeWidth={6} strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 142 * ring} 9999`} transform="rotate(-90 120 120)" />
        </svg>
        <div style={{ position: "absolute", inset: 0, borderRadius: 48, background: K.ink, boxShadow: `${SHADOW}, 0 0 ${40 + 60 * pulse}px rgba(201,255,61,${0.12 + 0.3 * pulse})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 96, height: 96, borderRadius: 48, background: K.lime, color: K.ink, fontWeight: 800, fontSize: 52, display: "flex", alignItems: "center", justifyContent: "center" }}>K</div>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 262, textAlign: "center", fontWeight: 800, fontSize: 22, letterSpacing: "0.12em", color: K.ink }}>KLYRO</div>
      </div>
    </AbsoluteFill>
  );
};
const mixv = (a: number, b: number, e: number) => a + (b - a) * e;
