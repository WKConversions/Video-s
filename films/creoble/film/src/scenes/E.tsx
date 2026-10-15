// Scene E (25.20–30.20 s): "Need hosting? We've got that covered too." / "No coding. No complexity."
// From D's flat blue field a white address bar rises; bagerietlund.dk types on and goes Live on "hosting". The blue
// field then contracts into the bar (an iris closing onto it) and the bar carries up onto cream. A dotted globe turns
// in below it, Denmark lit; three feature chips fly out of the globe and land on "we've", "got", "that"; the hosting
// price arrives on "covered". The picture leaves, "No coding." builds over a scrolling block of HTML/CSS that wipes
// away line by line on "coding"; "No complexity." builds as line 2 while a messy cluster of technical cards (DNS,
// server, plugins, templates) folds away on "complexity". Both lines blur-rise out; clean cream by frame 905.
// See ../../../plan/v2-storyboard.md.
import React from "react";
import { AbsoluteFill } from "remotion";
import { ARRIVE, C, DEPART, MOVE, clamp01, mix } from "../lib";
import { AnswerChip, Ico, Plane, SANS, Say, f, k, typed } from "../shared";

const MONO = "'DejaVu Sans Mono', 'Liberation Mono', ui-monospace, monospace";
const bump = (g: number, at: number, dur: number) => Math.sin(Math.PI * clamp01((g - f(at)) / (dur * 30)));

/* ---------- the address bar ---------- */
const BW = 1100, BH = 124;
const DOMAIN = "bagerietlund.dk";
const bar = (g: number) => {
  const rise = k(g, 25.2, 0.75, ARRIVE);
  const up = k(g, 25.92, 0.85, MOVE);
  const out = k(g, 27.28, 0.45, DEPART);
  const push = 0.012 * clamp01((g - f(25.3)) / 25);            // a tiny breath while it types on blue
  return { x: 960, y: mix(540 + 140 * (1 - rise), 205, up) - 40 * out, s: mix(0.95 + 0.05 * rise + push, 0.8, up), o: rise * (1 - out), blur: out * 8, up };
};
const AddressBar: React.FC<{ g: number }> = ({ g }) => {
  const b = bar(g);
  if (b.o <= 0.005) return null;
  const txt = typed(g, "w:need", DOMAIN, 38), done = txt.length === DOMAIN.length;
  const live = k(g, "w:hosting+0.26", 0.55, ARRIVE);
  const caret = done ? 1 - k(g, "w:hosting+0.3", 0.3) : Math.floor(g / 7) % 2 ? 1 : 0.35;
  const pulse = ((g - f("w:hosting+0.3")) % 36) / 36, pulseOn = g >= f("w:hosting+0.3");
  const onBlue = 1 - k(g, 25.85, 0.45, MOVE);
  return (
    <div style={{ position: "absolute", left: b.x - BW / 2, top: b.y - BH / 2, width: BW, height: BH, transform: `scale(${b.s}) perspective(4000px) rotateX(0.01deg)`, transformOrigin: "50% 50%",
      opacity: b.o, filter: b.blur > 0.05 ? `blur(${b.blur}px)` : undefined, borderRadius: BH / 2, background: C.white,
      boxShadow: `0 0 0 1px rgba(29,29,31,${0.05 * (1 - onBlue)}), 0 36px 70px -30px rgba(${Math.round(mix(29, 12, onBlue))},${Math.round(mix(29, 60, onBlue))},${Math.round(mix(31, 120, onBlue))},${mix(0.32, 0.55, onBlue)})` }}>
      <div style={{ position: "absolute", left: 44, top: 0, height: BH, display: "flex", alignItems: "center", gap: 22 }}>
        <Ico n="lock" s={42} c={C.gray} w={2.4} />
        <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 52, letterSpacing: "-0.02em", color: C.ink, whiteSpace: "nowrap", display: "flex", alignItems: "center" }}>
          {txt}<span style={{ display: "inline-block", width: 3, height: 56, marginLeft: 4, borderRadius: 2, background: C.blue, opacity: caret }} />
        </div>
      </div>
      {live > 0 && (
        <div style={{ position: "absolute", right: 30, top: (BH - 66) / 2, height: 66, padding: "0 30px 0 26px", borderRadius: 33, background: C.blueTint, display: "flex", alignItems: "center", gap: 14,
          opacity: live, transform: `translateX(${(1 - live) * 24}px) scale(${0.92 + 0.08 * live})`, fontFamily: SANS, fontWeight: 600, fontSize: 32, color: C.blueDeep, letterSpacing: "-0.01em",
          boxShadow: `0 0 0 ${6 * bump(g, 25.68, 0.6)}px rgba(74,163,245,0.18)` }}>
          <div style={{ position: "relative", width: 18, height: 18 }}>
            {pulseOn && <div style={{ position: "absolute", left: 9 - 9 * (1 + 1.6 * pulse), top: 9 - 9 * (1 + 1.6 * pulse), width: 18 * (1 + 1.6 * pulse), height: 18 * (1 + 1.6 * pulse), borderRadius: "50%", background: C.blue, opacity: 0.45 * (1 - pulse) }} />}
            <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: C.blue }} />
          </div>
          Live
        </div>
      )}
    </div>
  );
};

/* ---------- the blue field: flat from 25.20, then it contracts into the bar ---------- */
const BlueField: React.FC<{ g: number }> = ({ g }) => {
  const t = k(g, 25.85, 0.45, MOVE);
  if (t >= 1) return null;
  const b = bar(g), w = BW * b.s, h = BH * b.s;
  const L = mix(0, b.x - w / 2, t), T = mix(0, b.y - h / 2, t), W = mix(1920, w, t), H = mix(1080, h, t);
  return <div style={{ position: "absolute", left: L, top: T, width: W, height: H, borderRadius: mix(0, h / 2, Math.pow(t, 0.6)), background: C.blue, opacity: 1 - clamp01((t - 0.85) / 0.15) }} />;
};

/* ---------- the dotted globe (drawn in code) ---------- */
type Dot = { lat: number; lon: number; land: boolean };
const BLOBS: [number, number, number, number][] = [
  [12, 50, 20, 10], [16, 63, 9, 8], [-4, 54, 4, 5], [20, 8, 21, 27], [42, -20, 5, 8], [70, 47, 48, 17], [78, 21, 10, 11], [104, 18, 12, 10], [118, 40, 18, 12],
  [-102, 47, 30, 17], [-88, 20, 9, 7], [-60, -14, 15, 25], [-42, 72, 13, 7], [135, -25, 18, 11], [138, 37, 4, 7],
];
const DOTS: Dot[] = (() => {
  const out: Dot[] = [];
  for (let lat = -78; lat <= 80; lat += 4.6) {
    const n = Math.max(6, Math.round((360 / 4.6) * Math.cos((lat * Math.PI) / 180)));
    for (let i = 0; i < n; i++) {
      const lon = -180 + (i + (Math.round(lat) % 2 ? 0.5 : 0)) * (360 / n);
      const land = BLOBS.some(([lo, la, rl, rf]) => { let d = lon - lo; d = ((d + 540) % 360) - 180; return (d / rl) ** 2 + ((lat - la) / rf) ** 2 < 1; });
      out.push({ lat, lon, land });
    }
  }
  return out;
})();
const GR = 272;
const proj = (lat: number, lon: number, rot: number, tilt: number) => {
  const p = (lat * Math.PI) / 180, l = ((lon + rot) * Math.PI) / 180, t = (tilt * Math.PI) / 180;
  const x = Math.cos(p) * Math.sin(l), y = -Math.sin(p), z = Math.cos(p) * Math.cos(l);
  return { x, y: y * Math.cos(t) + z * Math.sin(t), z: -y * Math.sin(t) + z * Math.cos(t) };
};
const Globe: React.FC<{ g: number; cx: number; cy: number; s: number; o: number; app: number }> = ({ g, cx, cy, s, o, app }) => {
  if (o <= 0.005) return null;
  const rot = -10 + (g - f(26.9)) * 0.34, tilt = 22;
  const dk = proj(56, 10, rot, tilt), pulse = ((g - f(26.4)) % 45) / 45;
  const R = GR + 40;
  return (
    <div style={{ position: "absolute", left: cx - R, top: cy - R, width: 2 * R, height: 2 * R, opacity: o, transform: `scale(${s})`, transformOrigin: "50% 50%" }}>
      <div style={{ position: "absolute", inset: -120, borderRadius: "50%", background: "radial-gradient(circle, rgba(74,163,245,0.20) 0%, rgba(74,163,245,0.07) 42%, rgba(74,163,245,0) 68%)" }} />
      <svg width={2 * R} height={2 * R} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        <circle cx={R} cy={R} r={GR + 1} fill="rgba(255,255,255,0.55)" stroke="rgba(74,163,245,0.22)" strokeWidth={1.5} />
        {DOTS.map((d, i) => {
          const q = proj(d.lat, d.lon, rot, tilt);
          if (q.z < -0.05) return null;
          const front = clamp01(q.z), reveal = clamp01(app * 2.2 - (1 - q.z) * 1.1);
          if (reveal <= 0) return null;
          const r = d.land ? 2.2 + 2.6 * front : 1.2 + 1.2 * front;
          return <circle key={i} cx={R + q.x * GR} cy={R + q.y * GR} r={r * (0.6 + 0.4 * reveal)} fill={d.land ? C.blue : C.blue} opacity={reveal * (d.land ? 0.35 + 0.65 * front : 0.1 + 0.16 * front)} />;
        })}
        {dk.z > 0 && <>
          <circle cx={R + dk.x * GR} cy={R + dk.y * GR} r={10 + 28 * pulse} fill={C.blue} opacity={0.4 * (1 - pulse) * app * dk.z} />
          <circle cx={R + dk.x * GR} cy={R + dk.y * GR} r={8.5} fill={C.blueDeep} stroke={C.white} strokeWidth={3} opacity={app} />
        </>}
      </svg>
    </div>
  );
};

/* ---------- the hosting picture: globe, chips, price ---------- */
const GX = 960, GY = 590;
const FEATS = [
  { icon: "globe", t: "Your own domain", at: "w:weve", x: 470, y: 470 },
  { icon: "mail", t: "Email included", at: "w:got", x: 1450, y: 500 },
  { icon: "server", t: "European servers", at: "w:that", x: 1390, y: 790 },
];
const Hosting: React.FC<{ g: number }> = ({ g }) => {
  const out = k(g, 27.3, 0.45, DEPART);
  if (g < f(26.0) || out >= 1) return null;
  const app = k(g, 26.2, 1.0, ARRIVE);
  const push = 1 + 0.035 * clamp01((g - f(26.4)) / 40);
  const price = k(g, "w:covered", 0.8);
  return (
    <AbsoluteFill style={{ transform: `scale(${push})`, transformOrigin: `${GX}px ${GY}px` }}>
      <Globe g={g} cx={GX} cy={GY + 30 * (1 - app)} s={(0.82 + 0.18 * app) * (1 - 0.18 * out)} o={Math.min(1, app * 1.5) * (1 - out)} app={app} />
      {FEATS.map((c, i) => {
        const t = k(g, `${c.at}-0.06`, 0.85, ARRIVE);
        if (t <= 0) return null;
        const ang = (i * 2.1 + 0.6), arc = (1 - t) * 120;      // fly out of the globe along a gentle arc
        const x = mix(GX, c.x, t) + Math.cos(ang) * arc * Math.sin(Math.PI * t) + 10 * Math.sin((g + i * 40) / 34) + (c.x - GX) * 0.25 * out;
        const y = mix(GY, c.y, t) + Math.sin(ang) * arc * Math.sin(Math.PI * t) + 7 * Math.cos((g + i * 30) / 40) + (c.y - GY) * 0.25 * out;
        return (
          <div key={c.t} style={{ position: "absolute", left: 0, top: 0, transform: `translate(${x}px, ${y}px) translate(-50%, -50%) scale(${0.5 + 0.5 * t})`, opacity: Math.min(1, t * 1.6) * (1 - out),
            filter: t < 0.6 ? `blur(${(1 - t / 0.6) * 6}px)` : undefined }}>
            <AnswerChip icon={c.icon} text={c.t} size={32} />
          </div>
        );
      })}
      {price > 0 && (
        <div style={{ position: "absolute", left: 0, top: 960, width: 1920, textAlign: "center", fontFamily: SANS, fontWeight: 500, fontSize: 36, letterSpacing: "-0.015em", color: C.gray,
          opacity: Math.min(1, price * 1.4) * (1 - out), transform: `translateY(${(1 - price) * 16}px)`, filter: price < 1 ? `blur(${(1 - price) * 8}px)` : undefined }}>
          From <span style={{ color: C.ink, fontWeight: 600 }}>83 kr/month</span>, billed yearly.
        </div>
      )}
    </AbsoluteFill>
  );
};

/* ---------- "No coding.": the code block that scrolls and wipes away ---------- */
const CODE = [
  "<!doctype html>", "<html lang=\"da\">", "<head>", "  <meta name=\"viewport\" content=\"width=device-width\">", "  <link rel=\"stylesheet\" href=\"/css/style.css\">", "</head>",
  "<body class=\"home\">", "  <nav class=\"nav\"><a href=\"/\">Bageriet Lund</a></nav>", "  <section class=\"hero\">", "    <h1>Fresh sourdough, baked every morning.</h1>",
  ".hero { display: grid; gap: 48px;", "  grid-template-columns: 1fr 1fr; }", ".hero h1 { font: 500 56px/1.06 serif; }", "@media (max-width: 768px) {",
  "  .hero { grid-template-columns: 1fr; } }", "const menu = document.querySelector('.menu');", "menu.addEventListener('click', toggleNav);",
  "fetch('/api/hours').then((r) => r.json())", "  .then(renderHours).catch(console.error);",
];
const Code: React.FC<{ g: number }> = ({ g }) => {
  const inn = k(g, 27.55, 0.7, ARRIVE);
  if (inn <= 0 || g > f("w:coding+1.3")) return null;
  const scroll = (g - f(27.55)) * 2.2;
  return (
    <AbsoluteFill style={{ opacity: inn }}>
      {CODE.map((ln, i) => {
        const w = k(g, `w:coding+${(0.06 + i * 0.024).toFixed(3)}`, 0.42, MOVE);
        if (w >= 1) return null;
        const y = 120 + i * 46 - scroll + (1 - inn) * 60;
        return <div key={i} style={{ position: "absolute", left: 300, top: y, fontFamily: MONO, fontSize: 27, color: i >= 10 && i < 15 ? "#B4B4BA" : "#BDBDC2", whiteSpace: "pre",
          opacity: 1 - w, transform: `translateX(${w * 260}px)`, filter: w > 0 ? `blur(${w * 8}px)` : undefined }}>{ln}</div>;
      })}
    </AbsoluteFill>
  );
};

/* ---------- "No complexity.": a messy cluster of technical cards that folds away ---------- */
const Row: React.FC<{ a: string; b: string; mono?: boolean }> = ({ a, b, mono }) => (
  <div style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderTop: `1px solid ${C.line}`, fontFamily: mono ? MONO : SANS, fontSize: mono ? 16 : 18, color: C.gray, whiteSpace: "nowrap" }}>
    <span style={{ color: C.ink }}>{a}</span><span>{b}</span>
  </div>
);
const Toggle: React.FC<{ on: boolean }> = ({ on }) => (
  <div style={{ width: 40, height: 24, borderRadius: 12, background: on ? C.light : C.line, position: "relative" }}><div style={{ position: "absolute", top: 3, left: on ? 19 : 3, width: 18, height: 18, borderRadius: 9, background: C.white }} /></div>
);
const CARDS: { t: string; icon: string; x: number; y: number; rx: number; ry: number; rz: number; from: [number, number]; body: React.ReactNode }[] = [
  { t: "DNS records", icon: "globe", x: 350, y: 205, rx: 10, ry: 18, rz: -7, from: [-260, -120], body: <>
    <Row mono a="A      @" b="185.21.4.12" /><Row mono a="CNAME  www" b="bagerietlund.dk" /><Row mono a="MX     @" b="10 mx1.mail.eu" /><Row mono a="TXT    @" b="v=spf1 include:…" /></> },
  { t: "Server settings", icon: "sliders", x: 1570, y: 200, rx: 14, ry: -16, rz: 6, from: [260, -120], body: <>
    {[["PHP version", "8.2 ▾"], ["SSL certificate", ""], ["Page cache", ""], ["Max upload", "64 MB"]].map(([a, b], i) => (
      <div key={a} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderTop: `1px solid ${C.line}`, fontFamily: SANS, fontSize: 18, color: C.ink }}>
        {a}{b ? <span style={{ color: C.gray }}>{b}</span> : <Toggle on={i === 1} />}</div>))}</> },
  { t: "Plugins (14)", icon: "code", x: 360, y: 870, rx: -12, ry: 16, rz: 5, from: [-260, 140], body: <>
    {["SEO Toolkit Pro", "Cache Booster", "Contact Forms 7", "Security Shield", "Backup Manager"].map((p, i) => (
      <div key={p} style={{ display: "flex", alignItems: "center", gap: 12, padding: "6px 0", borderTop: `1px solid ${C.line}`, fontFamily: SANS, fontSize: 18, color: C.ink }}>
        <div style={{ width: 18, height: 18, borderRadius: 5, border: `2px solid ${C.light}`, background: i % 2 ? C.light : "transparent" }} />{p}
        <span style={{ marginLeft: "auto", fontSize: 14, color: C.light }}>{i % 3 === 0 ? "Update" : "v" + (2 + i) + ".1"}</span></div>))}</> },
  { t: "Choose a template", icon: "layout", x: 1560, y: 875, rx: -10, ry: -18, rz: -6, from: [260, 140], body: (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, paddingTop: 6 }}>
      {Array.from({ length: 6 }, (_, i) => <div key={i} style={{ height: 66, borderRadius: 8, background: C.fill, border: `1px solid ${C.line}`, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 8, top: 8, right: 8, height: 8, borderRadius: 4, background: C.line }} />
        <div style={{ position: "absolute", left: 8, top: 22, width: "50%", height: 30, borderRadius: 4, background: i === 2 ? "#DCDCE0" : C.line }} /></div>)}
    </div>) },
];
const Cards: React.FC<{ g: number }> = ({ g }) => {
  if (g < f("w:no2-0.3") || g > f("w:complexity+1.2")) return null;
  return <>{CARDS.map((c, i) => {
    const inn = k(g, `w:no2-${(0.24 - i * 0.05).toFixed(2)}`, 0.75, ARRIVE);
    const fold = k(g, `w:complexity+${(0.08 + [0, 2, 1, 3][i] * 0.06).toFixed(2)}`, 0.6, MOVE);
    if (fold >= 1 || inn <= 0) return null;
    const drift = (g - f("w:no2")) * 0.06;
    return (
      <Plane key={c.t} x={c.x + c.from[0] * (1 - inn) + c.from[0] * 0.9 * fold} y={c.y + c.from[1] * (1 - inn) + c.from[1] * 0.6 * fold} w={420} h={262}
        rx={c.rx * (1 + 0.4 * (1 - inn)) + (c.rx > 0 ? -1 : 1) * 0 + mix(0, c.y < 540 ? -88 : 88, fold)} ry={c.ry + drift * Math.sign(c.ry)} rz={c.rz * (1 + 0.6 * (1 - inn)) + 10 * fold * Math.sign(c.rz)}
        s={(0.9 + 0.1 * inn) * (1 - 0.25 * fold)} o={Math.min(1, inn * 1.5) * (1 - clamp01((fold - 0.45) / 0.55))}>
        <div style={{ position: "absolute", inset: 0, borderRadius: 22, background: C.white, boxShadow: "0 0 0 1px rgba(29,29,31,0.06), 0 30px 60px -28px rgba(29,29,31,0.35)", padding: "20px 24px", boxSizing: "border-box", overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, fontFamily: SANS, fontWeight: 600, fontSize: 22, color: C.ink, letterSpacing: "-0.01em", marginBottom: 10 }}>
            <Ico n={c.icon} s={24} c={C.gray} w={2.2} />{c.t}</div>
          {c.body}
        </div>
      </Plane>
    );
  })}</>;
};

/* ---------- the scene ---------- */
export const SceneE: React.FC<{ g: number }> = ({ g }) => {
  if (g < 759 || g > 905) return null;
  const lift = k(g, "w:no2-0.45", 0.6, MOVE);
  const y1 = mix(462, 362, lift);
  const halo = k(g, 27.6, 0.6) * (1 - k(g, "w:coding+0.6", 0.5));
  return (
    <AbsoluteFill>
      <BlueField g={g} />
      <Hosting g={g} />
      <AddressBar g={g} />
      <Code g={g} />
      {halo > 0 && <div style={{ position: "absolute", left: 360, top: y1 - 110, width: 1200, height: 380, borderRadius: "50%", opacity: halo,
        background: "radial-gradient(ellipse at center, rgba(250,250,247,1) 0%, rgba(250,250,247,0.92) 45%, rgba(250,250,247,0) 72%)" }} />}
      <Cards g={g} />
      {g >= f("w:no") - 1 && <Say g={g} words={[{ t: "No", at: "w:no" }, { t: "coding.", at: "w:coding" }]} y={y1} size={144} out="simple-0.39" />}
      {g >= f("w:no2") - 1 && <Say g={g} words={[{ t: "No", at: "w:no2" }, { t: "complexity.", at: "w:complexity", blue: true }]} y={540} size={144} out="simple-0.32" />}
    </AbsoluteFill>
  );
};
