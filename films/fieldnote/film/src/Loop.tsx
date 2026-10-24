// Fieldnote ("Work that moves", field service operations): a 12 s seamless loop in Fieldnote's own brand (site
// tokens: cream #fffaf2, ink #20232b, coral #ff654d, blue #3269e8, mint #c8f2df, yellow #ffd76a, muted #70727a;
// Space Grotesk + DM Sans). One work order moves through the site's three moves, 4 s each: Capture on site → Make it
// actionable → Close the loop; the day's visits stream underneath. Every beat enters from an empty card body and
// leaves to one, and the stream repeats exactly every 12 s, so the last frame flows into the first.
import React from "react";
import { AbsoluteFill, continueRender, delayRender, Easing, staticFile, useCurrentFrame } from "remotion";
import { loadFont } from "@remotion/fonts";

const F = { cream: "#FFFAF2", ink: "#20232B", coral: "#FF654D", blue: "#3269E8", mint: "#C8F2DF", yellow: "#FFD76A", muted: "#70727A", line: "rgba(32,35,43,0.10)" };
const SANS = "DM Sans", HEAD = "Space Grotesk";
const fh = typeof window !== "undefined" ? delayRender("fonts") : null;
if (typeof window !== "undefined") {
  Promise.all([
    ...[400, 500, 600, 700].map((w) => loadFont({ family: SANS, url: staticFile(`fonts/dmsans-${w}.woff2`), weight: String(w) })),
    ...[500, 600, 700].map((w) => loadFont({ family: HEAD, url: staticFile(`fonts/spacegrotesk-${w}.woff2`), weight: String(w) })),
  ]).then(() => fh !== null && continueRender(fh));
}
const OUT = Easing.bezier(0.22, 1, 0.36, 1), INOUT = Easing.bezier(0.65, 0, 0.35, 1);
const c01 = (x: number) => Math.min(1, Math.max(0, x));
const k = (t: number, a: number, d: number, e = OUT) => e(c01((t - a) / d));
/** Apple spring 0 → 1 with overshoot (f = Hz, z = damping) */
const sp = (t: number, a: number, f = 2.2, z = 0.5) => { const u = t - a; if (u <= 0) return 0; const w = 2 * Math.PI * f; return 1 - Math.exp(-z * w * u) * Math.cos(w * Math.sqrt(1 - z * z) * u); };
const SHADOW = "0 0 2px rgba(32,35,43,0.08), 0 0 26px rgba(32,35,43,0.08), 0 0 80px rgba(32,35,43,0.10)";
const P = 4;

// ── beat 1: Capture on site (photos, a checklist, a note) ─────────────────────────────────────────────────────────
const Capture: React.FC<{ u: number }> = ({ u }) => {
  const tiles = [[F.coral, "Meter"], [F.blue, "Valve"], [F.yellow, "Boiler"], [F.mint, "Room"]] as const;
  const checks = ["Pressure checked", "Valve inspected", "Photo of meter"];
  const note = "Valve seal worn, replace this week.", typed = note.slice(0, Math.floor(c01((u - 1.6) / 1.4) * note.length));
  return (
    <div style={{ display: "flex", gap: 34 }}>
      <div style={{ display: "grid", gridTemplateColumns: "150px 150px", gap: 14 }}>
        {tiles.map(([c, l], j) => { const p = sp(u, 0.25 + j * 0.14, 2.4, 0.48); return (
          <div key={l} style={{ width: 150, height: 120, borderRadius: 18, background: `linear-gradient(140deg, ${c}, ${c}AA)`, transform: `scale(${p}) rotate(${(1 - c01(p)) * -8}deg)`, opacity: c01(p * 2),
            display: "flex", alignItems: "flex-end", padding: 12, boxSizing: "border-box", fontFamily: SANS, fontWeight: 700, fontSize: 18, color: F.ink, boxShadow: SHADOW }}>📷 {l}</div>); })}
      </div>
      <div style={{ width: 330, fontFamily: SANS }}>
        {checks.map((c, j) => { const p = sp(u, 0.7 + j * 0.28, 2.6, 0.5); const tick = k(u, 0.95 + j * 0.28, 0.3); return (
          <div key={c} style={{ display: "flex", alignItems: "center", gap: 14, height: 56, opacity: c01(p * 2), transform: `translateX(${(1 - p) * 40}px)`, fontSize: 22, fontWeight: 600, color: F.ink }}>
            <div style={{ width: 30, height: 30, borderRadius: 9, background: tick > 0.01 ? F.ink : "transparent", border: `2px solid ${F.ink}`, display: "flex", alignItems: "center", justifyContent: "center", color: F.mint, fontSize: 18, transform: `scale(${1 + 0.25 * Math.sin(Math.PI * tick)})` }}>{tick > 0.3 ? "✓" : ""}</div>{c}</div>); })}
        <div style={{ marginTop: 14, padding: "14px 16px", borderRadius: 14, background: "#F6F1E7", fontSize: 19, color: F.ink, minHeight: 54, opacity: c01((u - 1.4) * 4) }}>
          {typed}<span style={{ opacity: Math.floor(u * 3) % 2 ? 1 : 0, color: F.coral }}>|</span></div>
      </div>
    </div>
  );
};
// ── beat 2: Make it actionable (tasks with owners and due dates) ──────────────────────────────────────────────────
const Actionable: React.FC<{ u: number }> = ({ u }) => {
  const tasks = [["Replace valve seal", "SV", F.coral, "Thu"], ["Order part #V-220", "MK", F.blue, "Today"], ["Book follow-up visit", "JL", F.yellow, "Fri"]] as const;
  return (
    <div style={{ width: 700, fontFamily: SANS }}>
      {tasks.map(([t, o, c, d], j) => { const p = sp(u, 0.25 + j * 0.22, 2.2, 0.5); const own = sp(u, 0.9 + j * 0.22, 2.8, 0.45); return (
        <div key={t} style={{ display: "flex", alignItems: "center", gap: 18, height: 84, marginBottom: 14, padding: "0 22px", borderRadius: 18, background: "#fff", boxShadow: SHADOW,
          transform: `translateX(${(1 - p) * 120}px) scale(${0.9 + 0.1 * p})`, opacity: c01(p * 2) }}>
          <div style={{ width: 14, height: 14, borderRadius: 7, background: c }} />
          <div style={{ flex: 1, fontSize: 25, fontWeight: 700, color: F.ink }}>{t}</div>
          <div style={{ width: 46, height: 46, borderRadius: 23, background: F.ink, color: F.cream, fontWeight: 700, fontSize: 17, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${own})` }}>{o}</div>
          <div style={{ padding: "8px 14px", borderRadius: 999, background: F.mint, fontWeight: 700, fontSize: 18, color: F.ink, transform: `scale(${own})` }}>{d}</div>
        </div>); })}
      <div style={{ fontFamily: HEAD, fontWeight: 600, fontSize: 18, letterSpacing: "0.12em", color: F.blue, opacity: k(u, 1.6, 0.4) }}>NO RE-ENTRY</div>
    </div>
  );
};
// ── beat 3: Close the loop (the route, the crew, the customer) ────────────────────────────────────────────────────
const Close: React.FC<{ u: number }> = ({ u }) => {
  const path = "M 30 200 C 120 40, 230 230, 330 120 S 470 60, 520 150";
  const d = k(u, 0.3, 2.4, INOUT);
  const done = ["Crew aligned", "Customer notified", "Work order closed"];
  return (
    <div style={{ display: "flex", gap: 30, alignItems: "center" }}>
      <div style={{ width: 560, height: 260, borderRadius: 20, background: "#EEF3FB", position: "relative", overflow: "hidden", boxShadow: SHADOW, transform: `scale(${0.92 + 0.08 * sp(u, 0.1, 2, 0.6)})` }}>
        {Array.from({ length: 8 }, (_, j) => <div key={j} style={{ position: "absolute", left: j * 76 - 20, top: 0, width: 2, height: 260, background: "rgba(50,105,232,0.08)" }} />)}
        <svg width={560} height={260} style={{ position: "absolute", inset: 0 }}>
          <path d={path} fill="none" stroke="rgba(50,105,232,0.25)" strokeWidth={10} strokeLinecap="round" />
          <path d={path} fill="none" stroke={F.blue} strokeWidth={10} strokeLinecap="round" pathLength={1} strokeDasharray={`${d} 1`} />
          <circle cx={520} cy={150} r={14} fill={F.coral} />
        </svg>
        <Van d={d} path={path} />
      </div>
      <div style={{ fontFamily: SANS }}>
        {done.map((t, j) => { const p = sp(u, 0.9 + j * 0.45, 2.6, 0.45); return (
          <div key={t} style={{ display: "flex", alignItems: "center", gap: 12, height: 60, fontSize: 23, fontWeight: 700, color: F.ink, opacity: c01(p * 2), transform: `translateY(${(1 - p) * 24}px)` }}>
            <div style={{ width: 34, height: 34, borderRadius: 17, background: F.mint, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${p})` }}>✓</div>{t}</div>); })}
      </div>
    </div>
  );
};
const Van: React.FC<{ d: number; path: string }> = ({ d, path }) => {
  // point on the path (sampled once per render via an offscreen SVG path)
  if (typeof document === "undefined") return null;
  const el = document.createElementNS("http://www.w3.org/2000/svg", "path"); el.setAttribute("d", path);
  const L = el.getTotalLength(), pt = el.getPointAtLength(L * d);
  return <div style={{ position: "absolute", left: pt.x - 22, top: pt.y - 22, width: 44, height: 44, borderRadius: 22, background: F.ink, color: F.cream, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, boxShadow: SHADOW }}>🚐</div>;
};

// ── the day's visits streaming underneath (useful, steady, exactly periodic over 12 s) ───────────────────────────
const VISITS = [["08:30", "Boiler service", F.coral], ["09:45", "Leak report", F.blue], ["11:00", "Annual check", F.yellow], ["12:30", "Install valve", F.mint], ["14:15", "Follow-up visit", F.coral], ["15:40", "Safety audit", F.blue]] as const;
const SP = 340, V = 1360;  // 1360 × 12 = 48 × 340: seamless
const Day: React.FC<{ t: number; y: number; dir: 1 | -1; shift: number }> = ({ t, y, dir, shift }) => {
  const x0 = ((t * V + shift) % SP + SP) % SP;
  return (<>{Array.from({ length: 8 }, (_, j) => {
    const x = dir > 0 ? -SP + x0 + j * SP : 1920 + SP - x0 - j * SP - 300;
    const idx = (Math.floor((t * V + shift) / SP) * dir + j * dir + 6000) % 6;
    const [h, l, c] = VISITS[idx];
    return (<div key={j} style={{ position: "absolute", left: x, top: y, height: 66, width: 300, padding: "0 20px", boxSizing: "border-box", borderRadius: 33, background: "#fff", boxShadow: SHADOW, display: "flex", alignItems: "center", gap: 12, fontFamily: SANS }}>
      <span style={{ width: 12, height: 12, borderRadius: 6, background: c }} /><b style={{ fontFamily: HEAD, fontSize: 20, color: F.muted }}>{h}</b><span style={{ fontWeight: 700, fontSize: 21, color: F.ink, whiteSpace: "nowrap" }}>{l}</span></div>);
  })}</>);
};

const BEATS = [
  { n: "01", title: ["Capture", "on site."], pill: ["On site", F.yellow], C: Capture },
  { n: "02", title: ["Make it", "actionable."], pill: ["Actionable", "#CFDCFA"], C: Actionable },
  { n: "03", title: ["Close", "the loop."], pill: ["Done", F.mint], C: Close },
];

export const Loop: React.FC = () => {
  const t = useCurrentFrame() / 60;
  const i = Math.floor(t / P) % 3, u = t % P, b = BEATS[i];
  const enter = sp(u, 0.0, 1.6, 0.6), leave = k(u, 3.55, 0.45, INOUT);      // beat body in from empty, out to empty
  const tIn = c01(sp(u, 0.05, 1.8, 0.55)), tOut = k(u, 3.6, 0.4, INOUT);
  const B = b.C;
  return (
    <AbsoluteFill style={{ background: F.cream, overflow: "hidden" }}>
      {/* PLAN · CAPTURE · MOVE */}
      <div style={{ position: "absolute", top: 70, left: 0, right: 0, display: "flex", justifyContent: "center", alignItems: "center", gap: 16, fontFamily: HEAD, fontWeight: 600, fontSize: 22, letterSpacing: "0.16em" }}>
        <span style={{ color: F.coral, fontSize: 26 }}>✦</span><span style={{ color: F.ink }}>FIELDNOTE</span><span style={{ color: "#C9C5BC" }}>/</span>
        {["CAPTURE", "ACT", "CLOSE"].map((w, j) => <span key={w} style={{ color: j === i ? F.ink : "#B8B4AA", borderBottom: `3px solid ${j === i ? F.coral : "transparent"}`, paddingBottom: 4 }}>{w}</span>)}
      </div>
      {/* the work-order card */}
      <div style={{ position: "absolute", left: 960 - 760, top: 160, width: 1520, height: 600, borderRadius: 32, background: "#fff", boxShadow: SHADOW, overflow: "hidden" }}>
        <div style={{ height: 84, borderBottom: `1px solid ${F.line}`, display: "flex", alignItems: "center", padding: "0 36px", gap: 18, fontFamily: SANS }}>
          <span style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 22, color: F.muted }}>WO-1042</span>
          <span style={{ fontWeight: 700, fontSize: 24, color: F.ink }}>Boiler service · 14 Harbour St</span>
          <div style={{ flex: 1 }} />
          <span style={{ padding: "9px 18px", borderRadius: 999, background: b.pill[1], fontWeight: 700, fontSize: 20, color: F.ink, transform: `scale(${0.85 + 0.15 * c01(sp(u, 0.1, 2.6, 0.45))})` }}>● {b.pill[0]}</span>
        </div>
        <div style={{ display: "flex", padding: "48px 56px", gap: 60 }}>
          <div style={{ width: 380, opacity: tIn * (1 - tOut), transform: `translateY(${(1 - tIn) * 40 - tOut * 30}px)`, filter: tIn < 0.98 || tOut > 0.02 ? `blur(${(1 - tIn) * 8 + tOut * 8}px)` : undefined }}>
            <div style={{ fontFamily: HEAD, fontWeight: 600, fontSize: 22, color: F.coral, letterSpacing: "0.1em" }}>{b.n}</div>
            <div style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 76, letterSpacing: "-0.035em", lineHeight: 0.98, color: F.ink, marginTop: 10 }}>{b.title[0]}<br />{b.title[1]}</div>
          </div>
          <div style={{ flex: 1, opacity: c01(enter * 2) * (1 - leave), transform: `translateX(${(1 - c01(enter)) * 60 - leave * 80}px) scale(${0.96 + 0.04 * c01(enter)})` }}><B u={u} /></div>
        </div>
      </div>
      {/* the day's visits */}
      <Day t={t} y={810} dir={1} shift={0} />
      <Day t={t} y={900} dir={-1} shift={170} />
      <div style={{ position: "absolute", left: 0, top: 790, width: 140, height: 200, background: `linear-gradient(90deg, ${F.cream}, rgba(255,250,242,0))` }} />
      <div style={{ position: "absolute", right: 0, top: 790, width: 140, height: 200, background: `linear-gradient(270deg, ${F.cream}, rgba(255,250,242,0))` }} />
    </AbsoluteFill>
  );
};
