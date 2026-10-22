// Segment C (20-30 s): "Meet up in every city." (the chat) and "Play apps built on Earth." (the apps in cover flow).
// In: H2Panel (white panel) at 20.0, drawn unchanged to 20.25, then it slides left and becomes the Chat app.
// Out: the Network States card floods into H3Gradient by 29.75 and draws it unchanged to 30.0.
import React from "react";
import { AbsoluteFill } from "remotion";
import { S, GRAD, BTN, SANS, SHADOW, clamp, mix, ease, inout, spring, bounce, Logo, CityMap, Avatar, Pin, Island, Glass, H2Panel, H3Gradient, toScreen } from "../kit";

// KWords: BounceWords' look, but each letter lands on a short, damped spring (no slow settle tail) and then holds still.
const KWords: React.FC<{ t: number; at: number; text: string; cx: number; y: number; size: number; accentFrom?: number; stagger?: number }> = ({ t, at, text, cx, y, size, accentFrom = 9999, stagger = 0.022 }) => (
  <div style={{ position: "absolute", left: cx - 1600, top: y, width: 3200, display: "flex", justifyContent: "center", fontFamily: SANS, fontWeight: 700, fontSize: size, letterSpacing: "-0.03em", whiteSpace: "pre", lineHeight: 1.05 }}>
    {text.split("").map((ch, i) => { const a = at + i * stagger, p = t - a > 0.42 ? 1 : spring(t, a, 0.34, 0.8); return <span key={i} style={{ display: "inline-block", transform: `translateY(${(1 - p) * size * 0.7}px) scale(${0.55 + 0.45 * p})`, opacity: clamp(p * 2), color: i >= accentFrom ? S.blue : S.ink }}>{ch}</span>; })}
  </div>
);
const backOut = (x: number, c1 = 0.5) => { const u = clamp(x) - 1; return 1 + (c1 + 1) * u * u * u + c1 * u * u; };

const abs = (x: number, y: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left: 0, top: 0, transform: `translate(${x}px, ${y}px)`, ...extra });

// ---------- small icons for the tab bar ----------
const NavIcon: React.FC<{ k: number; c: string }> = ({ k, c }) => (
  <svg width={38} height={38} viewBox="0 0 38 38" fill="none" stroke={c} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
    {k === 0 && <path d="M6 18 L19 7 L32 18 M10 15 V31 H28 V15" />}
    {k === 1 && <g><circle cx={19} cy={19} r={13} /><path d="M6 19 H32 M19 6 C13 12 13 26 19 32 C25 26 25 12 19 6" /></g>}
    {k === 2 && <g><rect x={6} y={6} width={11} height={11} rx={2} /><rect x={21} y={6} width={11} height={11} rx={2} /><rect x={6} y={21} width={11} height={11} rx={2} /><rect x={21} y={21} width={11} height={11} rx={2} /></g>}
    {k === 3 && <g fill={c} stroke="none">{[0, 1, 2].map((a) => [0, 1, 2].map((b) => <circle key={a * 3 + b} cx={9 + a * 10} cy={9 + b * 10} r={3.2} />))}</g>}
    {k === 4 && <path d="M7 9 H31 V26 H18 L11 32 V26 H7 Z" fill={c === S.blue ? "rgba(39,111,243,0.15)" : "none"} />}
  </svg>
);
const NAV = ["Home", "Map", "Properties", "Apps", "Chat"];

// ---------- the chat app inside the panel (820 x 960) ----------
const ChatPanel: React.FC<{ t: number }> = ({ t }) => {
  const hp = spring(t, 20.3, 0.35, 0.85);
  const segIn = spring(t, 20.45, 0.35, 0.85);
  const segP = spring(t, 21.75, 0.35, 0.85);
  const push = inout((t - 21.8) / 0.45);
  const navIn = spring(t, 20.55, 0.35, 0.88);
  const rows = [
    { title: "New York", sub: "21 members", icon: "🗽", bg: "#E8F0FF" },
    { title: "Jersey City", sub: "2 members", icon: "🌉", bg: "#F1ECFF" },
    { title: "SuperWorld City Ambassadors", sub: "@hrish · Manhattan", icon: "", bg: "" },
  ];
  // activity card
  const expP = spring(t, 22.25, 0.4, 0.9);
  const cardH = mix(150, 470, expP);
  const item = (a: number) => { const p = spring(t, a, 0.35, 0.82); return { opacity: clamp(p * 2), transform: `translateY(${(1 - p) * 40}px)` }; };
  const press = t > 23.0 ? 1 - 0.1 * Math.sin(Math.PI * clamp((t - 23.0) / 0.16)) : 1;
  const joined = clamp((t - 23.12) / 0.12);
  const jp = inout((t - 23.12) / 0.36);
  const land = bounce(t, 23.48, 0.4);
  const flyX = mix(560, 112, jp), flyY = mix(372, 372, jp) - 70 * Math.sin(Math.PI * jp);
  const sq = Math.sin(Math.PI * jp);
  const ringP = clamp((t - 22.86) / 0.14) * (1 - clamp((t - 23.15) / 0.2));
  const mapCam = { cx: 1700 + (t - 21.8) * 60, cy: 1300 - (t - 21.8) * 25, z: 0.75, rot: 0 };
  return (
    <div style={{ position: "absolute", inset: 0, fontFamily: SANS, color: S.ink, overflow: "hidden", borderRadius: 48 }}>
      {/* header */}
      <div style={abs(48, 44, { opacity: clamp(hp * 2), transform: `translate(48px, ${44 + (1 - hp) * 40}px)` })}>
        <div style={{ fontSize: 60, fontWeight: 700, letterSpacing: "-0.03em" }}>Chat</div>
      </div>
      <div style={abs(708, 50, { transform: `translate(708px, 50px) scale(${hp})` })}><Avatar name="isla.vuorinen" size={64} i={1} /></div>
      {/* segmented control */}
      <div style={abs(48, 140, { width: 724, height: 80, borderRadius: 40, background: S.panel, transform: `translate(48px, 140px) scale(${0.7 + 0.3 * segIn})`, opacity: clamp(segIn * 2) })}>
        <div style={{ position: "absolute", left: 6, top: 6, width: 356, height: 68, borderRadius: 34, background: S.white, boxShadow: "0 2px 8px rgba(26,26,26,0.12)", transform: `translateX(${segP * 356}px) scaleX(${1 + 0.12 * Math.sin(Math.PI * clamp((t - 21.75) / 0.3))})` }} />
        {["Messages", "Discover"].map((s, i) => (
          <div key={s} style={{ position: "absolute", left: 6 + i * 356, top: 6, width: 356, height: 68, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, fontWeight: 600, color: (i === 0 ? 1 - segP : segP) > 0.5 ? S.ink : S.muted }}>{s}</div>
        ))}
      </div>
      {/* Messages: city chats stacking in like notifications */}
      <div style={{ position: "absolute", left: 0, top: 0, width: 820, height: 960, transform: `translateX(${-820 * push}px)` }}>
        {rows.map((r, i) => {
          const p = spring(t, 20.72 + i * 0.35, 0.33, 0.84);
          return (
            <div key={i} style={{ position: "absolute", left: 48, top: 250 + i * 176, width: 724, height: 156, borderRadius: 32, background: S.white, border: `1.5px solid ${S.line}`, boxShadow: "0 10px 30px -14px rgba(26,26,26,0.25)",
              transform: `translateY(${(1 - p) * 90}px) scale(${0.9 + 0.1 * p})`, opacity: clamp(p * 2.5), display: "flex", alignItems: "center", padding: "0 28px", boxSizing: "border-box", gap: 24 }}>
              <div style={{ width: 96, height: 96, borderRadius: 28, background: r.bg || GRAD, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 54, flex: "none" }}>
                {r.icon || <div style={{ background: S.white, borderRadius: 18, padding: 6 }}><Logo size={52} id={"amb"} /></div>}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 34, fontWeight: 700, letterSpacing: "-0.02em" }}>{r.title}</div>
                <div style={{ fontSize: 28, color: S.muted, marginTop: 4 }}>{r.sub}</div>
              </div>
              <svg width={22} height={36} viewBox="0 0 22 36"><path d="M4 4 L18 18 L4 32" stroke={S.soft} strokeWidth={4} fill="none" strokeLinecap="round" /></svg>
            </div>
          );
        })}
      </div>
      {/* Discover: an activity chat */}
      <div style={{ position: "absolute", left: 0, top: 0, width: 820, height: 960, transform: `translateX(${820 * (1 - push)}px)` }}>
        <div style={{ position: "absolute", left: 48, top: 246, display: "flex", alignItems: "center", gap: 16, fontSize: 28, color: S.grey }}>
          <Avatar name="sebastian.ramon" size={58} i={2} />
          <div><b style={{ color: S.ink }}>sebastian.ramon</b> is hosting an activity chat</div>
        </div>
        <div style={{ position: "absolute", left: 48, top: 326, width: 724, height: 470, clipPath: `inset(0 0 ${470 - cardH}px 0 round 32px)` }}>
          <div style={{ position: "absolute", inset: 0, borderRadius: 32, background: S.white, border: `1.5px solid ${S.line}`, boxSizing: "border-box" }} />
          {/* a live mini map */}
          <div style={{ position: "absolute", left: 0, top: 0, width: 724, height: 150, overflow: "hidden", borderRadius: "32px 32px 0 0" }}>
            <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `translate(${(724 - 1920 * 0.6) / 2}px, ${(150 - 1080 * 0.6) / 2}px) scale(0.6)`, transformOrigin: "0 0" }}>
              <CityMap cam={mapCam} labels={false} />
              <Pin x={960} y={590} p={bounce(t, 22.0, 0.5)} emoji="🎤" size={110} />
            </div>
          </div>
          <div style={{ position: "absolute", left: 32, top: 172, fontSize: 46, fontWeight: 700, letterSpacing: "-0.02em", ...item(22.4) }}>🎤 valencia vds</div>
          <div style={{ position: "absolute", left: 32, top: 236, fontSize: 28, color: S.grey, ...item(22.5) }}>📍 Ciudad de las Artes y las Ciencias</div>
          <div style={{ position: "absolute", left: 32, top: 288, display: "flex", gap: 12, fontSize: 26, fontWeight: 600, ...item(22.6) }}>
            <div style={{ padding: "8px 18px", borderRadius: 30, background: "#E8F0FF", color: S.blue }}>Wed, Oct 21</div>
            <div style={{ padding: "8px 18px", borderRadius: 30, background: S.panel, color: S.grey }}>2 members · 1 going</div>
          </div>
          {/* avatars + Join */}
          <div style={{ position: "absolute", left: 32, top: 372, ...item(22.7) }}>
            <div style={abs(0, 0)}><Avatar name="sebastian.ramon" size={68} i={2} /></div>
            <div style={abs(46, 0)}><div style={{ width: 68, height: 68, borderRadius: 68, background: S.panel, border: `4px solid ${S.white}`, boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, fontWeight: 700, color: S.grey }}>+1</div></div>
          </div>
          {/* the joining avatar: a liquid squash-and-stretch flight into the stack */}
          {jp > 0 && (
            <div style={abs(flyX, flyY, { transform: `translate(${flyX}px, ${flyY}px) scale(${1 + 0.35 * sq}, ${(1 - 0.22 * sq) * (jp >= 1 ? 0.82 + 0.18 * land : 1)})`, transformOrigin: "50% 100%" })}>
              <Avatar name="isla.vuorinen" size={68} i={1} />
            </div>
          )}
          {jp > 0.6 && jp < 1 && <div style={abs(112, 386, { width: 46, height: 40, borderRadius: 20, background: "#7B61FF", transform: `translate(${104}px, ${386}px) scaleY(${Math.sin(Math.PI * (jp - 0.6) / 0.4)})` })} />}
          <div style={{ position: "absolute", left: 480, top: 366, width: 212, height: 80, borderRadius: 40, background: joined > 0.5 ? S.green : BTN, color: S.white, fontSize: 32, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center",
            transform: `scale(${press * (0.6 + 0.4 * bounce(t, 22.75, 0.5))})`, opacity: clamp(bounce(t, 22.75, 0.5) * 2), boxShadow: "0 12px 26px -10px rgba(39,111,243,0.6)" }}>
            {joined > 0.5 ? "Joined ✓" : "Join"}
          </div>
          {ringP > 0 && <div style={{ position: "absolute", left: 586 - 50, top: 406 - 50, width: 100, height: 100, borderRadius: 100, background: "rgba(26,26,26,0.16)", border: "3px solid rgba(255,255,255,0.9)", transform: `scale(${0.5 + 0.6 * ringP})`, opacity: ringP }} />}
        </div>
      </div>
      {/* tab bar */}
      <div style={{ position: "absolute", left: 48, top: 828, width: 724, height: 96, borderRadius: 48, background: S.panel, display: "flex", alignItems: "center", justifyContent: "space-around", transform: `translateY(${(1 - navIn) * 140}px)` }}>
        {NAV.map((n, i) => (
          <div key={n} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, color: i === 4 ? S.blue : S.muted, fontSize: 26, fontWeight: 600, transform: `scale(${i === 4 ? 1 + 0.15 * Math.sin(Math.PI * clamp((t - 20.7) / 0.3)) : 1})` }}>
            <NavIcon k={i} c={i === 4 ? S.blue : S.muted} /><div>{n}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ---------- the apps: designed cards with a living illustration ----------
type App = { name: string; tag: string; tagC: string; desc: string; bg: string };
const APPS: App[] = [
  { name: "Treasure Hunt", tag: "ADVENTURE", tagC: "#B26A00", desc: "Decode clues on a hand-drawn chart, dig up lost artifacts.", bg: "#F6E7C1" },
  { name: "Postcards", tag: "TOUR", tagC: "#E65100", desc: "Collect a postcard from every place you visit.", bg: "#FFE3D3" },
  { name: "Party World", tag: "MULTIPLAYER", tagC: S.violet, desc: "Hang out with friends by voice in 3D worlds.", bg: "#E7E1FF" },
  { name: "SpaceTime", tag: "VIEWER", tagC: "#0E8FB8", desc: "Real environments captured as Gaussian splats.", bg: S.night },
  { name: "Theories of Everything", tag: "VISUALIZATION", tagC: "#8D6E00", desc: "Five theories of how the Pyramids were built.", bg: "#FCEFD5" },
  { name: "Network States", tag: "COMMUNITY", tagC: S.blue, desc: "Fly the globe from Próspera to the Network School.", bg: GRAD },
  { name: "CryptoMondays", tag: "COMMUNITY", tagC: S.green, desc: "", bg: "#DDF5E6" },
  { name: "Disclosure — The UAP / UFO Files", tag: "MYSTERY", tagC: "#2E7D32", desc: "", bg: "#141A24" },
];
const CW = 540, CH = 690, IH = 360;

// a dot globe, rotating (used on the Network States card and in the flood)
const GLOBE_PTS: { lat: number; lon: number }[] = [];
for (let la = -80; la <= 80; la += 10) { const n = Math.max(6, Math.round(36 * Math.cos((la * Math.PI) / 180))); for (let k = 0; k < n; k++) GLOBE_PTS.push({ lat: la, lon: (k * 360) / n }); }
const DotGlobe: React.FC<{ r: number; rot: number; color?: string; fly?: number }> = ({ r, rot, color = "#FFFFFF", fly = 0 }) => (
  <g>
    {GLOBE_PTS.map((p, i) => {
      const la = (p.lat * Math.PI) / 180, lo = ((p.lon + rot) * Math.PI) / 180;
      const z = Math.cos(la) * Math.cos(lo); if (z < -0.05) return null;
      const x = r * Math.cos(la) * Math.sin(lo), y = -r * Math.sin(la), rr = 2.6 + 1.6 * z, op = 0.35 + 0.6 * z;
      if (fly <= 0) return <circle key={i} cx={x} cy={y} r={rr} fill={color} opacity={op} />;
      // fly-through: each dot streams radially out; the nearer (larger z) dots fly faster, streak longer and fade first
      const sp = 1 + (6 + 10 * z) * fly * fly, tail = 1 + (5 + 9 * z) * Math.max(0, fly - 0.06) * Math.max(0, fly - 0.06);
      const d = Math.hypot(x * sp, y * sp) / r;
      const o = op * (1 - Math.pow(fly, 4)) * clamp(1.6 - d * 0.18);
      return <line key={i} x1={x * tail} y1={y * tail} x2={x * sp} y2={y * sp} stroke={color} strokeWidth={2 * rr * (1 + 0.6 * fly)} strokeLinecap="round" opacity={o} />;
    })}
  </g>
);
// the Network States illustration's globe group (centred at 0,0 in illustration units): disc, dot globe, flight arc and
// its two gold dots. g scales the globe; aux fades the arc, dots and disc; fly streams the dots out.
const NSGlobe: React.FC<{ t: number; g?: number; aux?: number; fly?: number }> = ({ t, g = 1, aux = 1, fly = 0 }) => (
  <g transform={`scale(${g})`}>
    {aux > 0 && <circle r={130} fill="rgba(255,255,255,0.12)" opacity={aux} />}
    <DotGlobe r={130} rot={t * 40} fly={fly} />
    {aux > 0 && <g opacity={aux}><path d="M-90 40 Q0 -170 100 -30" stroke={S.white} strokeWidth={4} fill="none" strokeDasharray="10 8" strokeDashoffset={-t * 60} /><circle cx={-90} cy={40} r={9} fill="#FFC857" /><circle cx={100} cy={-30} r={9} fill="#FFC857" /></g>}
  </g>
);
// the globe grows on the lifted card before the flood (28.0-28.7)
const globeGrow = (t: number) => 1 + 0.16 * ease((t - 28.0) / 0.7);

const Illus: React.FC<{ k: number; t: number }> = ({ k, t }) => {
  const w = 500, h = 334;
  if (k === 0) { // treasure chart: a dashed route drawing to an X
    const d = 1 - ((t * 0.5) % 1);
    return (<svg width={w} height={h}><path d="M60 260 C140 120 220 300 300 170 C350 90 400 120 430 80" stroke="#8B5E1A" strokeWidth={6} fill="none" strokeDasharray="14 12" strokeDashoffset={d * 104} />
      <path d="M90 60 C150 30 200 80 260 50" stroke="#C9A35C" strokeWidth={4} fill="none" /><g transform={`translate(430 80) rotate(${Math.sin(t * 4) * 12})`}><path d="M-22 -22 L22 22 M22 -22 L-22 22" stroke={S.red} strokeWidth={10} strokeLinecap="round" /></g>
      <g transform={`translate(110 150) rotate(${t * 60})`}><circle r={44} fill="none" stroke="#8B5E1A" strokeWidth={4} /><path d="M0 -38 L8 0 L0 38 L-8 0 Z" fill="#8B5E1A" /></g></svg>);
  }
  if (k === 1) { // postcards: a spinning rack of cards
    return (<svg width={w} height={h}>{[0, 1, 2].map((i) => { const a = Math.sin(t * 2 + i) * 10 + (i - 1) * 14; return (
      <g key={i} transform={`translate(${250 + (i - 1) * 90} ${170}) rotate(${a})`}><rect x={-90} y={-62} width={180} height={124} rx={10} fill={S.white} stroke="#F2C6AE" strokeWidth={3} />
        <rect x={-78} y={-50} width={96} height={100} rx={6} fill={["#FFB38A", "#8EC9FF", "#A7E3B5"][i]} /><rect x={38} y={-50} width={36} height={42} rx={4} fill="none" stroke="#E65100" strokeWidth={3} strokeDasharray="5 4" />
        <path d="M30 10 H72 M30 28 H72" stroke="#D7C2B5" strokeWidth={4} /></g>); })}</svg>);
  }
  if (k === 2) { // party world: avatars bobbing, voice waves
    return (<svg width={w} height={h}><ellipse cx={250} cy={268} rx={200} ry={34} fill="#D3C9FF" />
      {[0, 1, 2].map((i) => { const y = 200 - Math.abs(Math.sin(t * 5 + i * 1.3)) * 30; return (<g key={i} transform={`translate(${150 + i * 100} ${y})`}><circle r={34} fill={["#276FF3", "#FF6D00", "#2EB872"][i]} /><rect x={-26} y={34} width={52} height={50} rx={20} fill={["#276FF3", "#FF6D00", "#2EB872"][i]} opacity={0.7} /></g>); })}
      {[0, 1, 2].map((i) => { const s = ((t * 1.4 + i / 3) % 1); return <circle key={"w" + i} cx={250} cy={110} r={20 + s * 70} fill="none" stroke={S.violet} strokeWidth={4} opacity={1 - s} />; })}</svg>);
  }
  if (k === 3) { // spacetime: a cloud of gaussian splats turning
    const pts = Array.from({ length: 70 }, (_, i) => ({ a: i * 2.399, r: 18 + (i % 14) * 9, y: ((i * 37) % 120) - 60 }));
    return (<svg width={w} height={h}>{pts.map((p, i) => { const a = p.a + t * 0.9; const x = Math.cos(a) * p.r, z = Math.sin(a); return <ellipse key={i} cx={250 + x * 1.4} cy={165 + p.y + z * 12} rx={10 + 8 * (z + 1)} ry={6 + 4 * (z + 1)} fill={["#44C6FA", "#7B61FF", "#FFAB00", "#2EB872"][i % 4]} opacity={0.25 + 0.4 * (z + 1) / 2} />; })}</svg>);
  }
  if (k === 4) { // pyramids being built, block by block
    const n = Math.floor((t * 6) % 16);
    return (<svg width={w} height={h}><circle cx={400} cy={80} r={34} fill="#FFC857" />{Array.from({ length: 5 }, (_, row) => Array.from({ length: 5 - row }, (_, c) => { const idx = row * 5 + c; return <rect key={idx} x={250 - (5 - row) * 34 + c * 68} y={262 - row * 44} width={64} height={40} rx={4} fill="#D9A441" opacity={idx <= n + 6 ? 1 : 0.2} />; }))}<path d="M30 284 H470" stroke="#C99A3A" strokeWidth={4} /></svg>);
  }
  if (k === 5) { // network states: the dot globe with a flight arc
    return (<svg width={w} height={h}><g transform="translate(250 170)"><NSGlobe t={t} g={globeGrow(t)} /></g></svg>);
  }
  if (k === 6) { // crypto mondays: a calendar with a ticking coin
    return (<svg width={w} height={h}><rect x={130} y={70} width={240} height={200} rx={24} fill={S.white} /><rect x={130} y={70} width={240} height={56} rx={24} fill={S.green} />
      {Array.from({ length: 12 }, (_, i) => <rect key={i} x={150 + (i % 4) * 54} y={142 + Math.floor(i / 4) * 40} width={40} height={28} rx={6} fill={i === 4 ? S.green : "#E3F3E9"} />)}
      <g transform={`translate(380 90) scale(${Math.cos(t * 4)} 1)`}><circle r={40} fill="#FFC857" /><circle r={28} fill="none" stroke="#B8860B" strokeWidth={4} /></g></svg>);
  }
  // disclosure: a UFO and its beam
  return (<svg width={w} height={h}><g transform={`translate(${250 + Math.sin(t * 2) * 40} ${110 + Math.sin(t * 3) * 10})`}><path d="M-40 10 L40 10 L90 200 L-90 200 Z" fill="rgba(120,255,160,0.18)" /><ellipse rx={90} ry={24} fill="#B0BEC5" /><ellipse cy={-14} rx={40} ry={26} fill="#80DEEA" /></g>
    {Array.from({ length: 30 }, (_, i) => <circle key={i} cx={(i * 97) % 500} cy={(i * 53) % 300} r={1.8} fill={S.white} opacity={0.4 + 0.6 * Math.abs(Math.sin(t * 3 + i))} />)}</svg>);
};

const AppCard: React.FC<{ a: App; k: number; t: number; lift?: number; openPress?: number }> = ({ a, k, t, openPress = 1 }) => {
  const dark = k === 3 || k === 7;
  return (
    <div style={{ width: CW, height: CH, borderRadius: 40, background: S.white, border: `1.5px solid ${S.line}`, boxShadow: SHADOW, overflow: "hidden", fontFamily: SANS, position: "relative" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: CW, height: IH, background: a.bg }}><div style={{ transform: `scale(${CW / 500})`, transformOrigin: "0 0" }}><Illus k={k} t={t} /></div></div>
      <div style={{ position: "absolute", left: 28, top: IH + 22, padding: "4px 14px", borderRadius: 20, fontSize: 26, fontWeight: 700, letterSpacing: "0.08em", color: a.tagC, background: dark ? "#E3F2F7" : "rgba(0,0,0,0.05)" }}>{a.tag}</div>
      <div style={{ position: "absolute", left: 28, top: IH + 74, width: CW - 56, fontSize: a.name.length > 20 ? 34 : 42, fontWeight: 700, letterSpacing: "-0.02em", color: S.ink, lineHeight: 1.1 }}>{a.name}</div>
      <div style={{ position: "absolute", left: 28, top: IH + 132, width: CW - 56, fontSize: 26, color: S.muted, lineHeight: 1.25 }}>{a.desc}</div>
      <div style={{ position: "absolute", left: 28, top: CH - 92, height: 64, padding: "0 30px", borderRadius: 32, background: BTN, color: S.white, display: "flex", alignItems: "center", gap: 10, fontSize: 28, fontWeight: 700, transform: `scale(${openPress})`, transformOrigin: "30% 50%" }}>▶ Open</div>
    </div>
  );
};


// ---------- the map window beside the chat: the camera glides to each city as its chat lands ----------
const WL = 1030, WT = 64, WW = 826, WH = 952;
const KEYS: { t: number; cx: number; cy: number; z: number }[] = [
  { t: 20.0, cx: 1500, cy: 1050, z: 0.5 },
  { t: 20.7, cx: 1950, cy: 900, z: 0.78 },
  { t: 21.0, cx: 760, cy: 930, z: 0.72 },
  { t: 21.3, cx: 1880, cy: 1230, z: 0.92 },
  { t: 21.78, cx: 1500, cy: 1150, z: 0.42 },
  { t: 22.5, cx: 1300, cy: 1350, z: 0.95 },
  { t: 23.0, cx: 1300, cy: 950, z: 0.5 },
  { t: 23.5, cx: 1000, cy: 1250, z: 1.0 },
  { t: 23.95, cx: 800, cy: 1050, z: 0.6 },
];
const camAt = (t: number) => {
  let cx = KEYS[0].cx, cy = KEYS[0].cy, z = KEYS[0].z;
  for (let i = 1; i < KEYS.length; i++) { const k = spring(t, KEYS[i].t, 0.85, 0.88); cx += (KEYS[i].cx - KEYS[i - 1].cx) * k; cy += (KEYS[i].cy - KEYS[i - 1].cy) * k; z += (KEYS[i].z - KEYS[i - 1].z) * k; }
  return { cx: cx + (t - 20) * 300, cy: cy - (t - 20) * 90, z, rot: Math.sin((t - 20) * 0.9) * 6 };
};
const MapChip: React.FC<{ x: number; y: number; p: number; title: string; sub: string; i: number; name: string }> = ({ x, y, p, title, sub, i, name }) => (
  <div style={{ position: "absolute", left: 0, top: 0, transform: `translate(${x}px, ${y}px) translate(-50%, -100%) translateY(${-(1 - p) * 40}px) scale(${0.3 + 0.7 * p})`, transformOrigin: "50% 100%", opacity: clamp(p * 2.5) }}>
    <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 22px 12px 12px", borderRadius: 40, background: S.white, boxShadow: "0 14px 30px -12px rgba(26,26,26,0.35)", fontFamily: SANS, whiteSpace: "nowrap" }}>
      <Avatar name={name} size={56} i={i} />
      <div><div style={{ fontSize: 28, fontWeight: 700, color: S.ink }}>{title}</div><div style={{ fontSize: 26, color: S.muted }}>{sub}</div></div>
    </div>
    <div style={{ width: 22, height: 22, background: S.white, transform: "translate(-50%, -12px) rotate(45deg)", marginLeft: "50%" }} />
  </div>
);
const PEOPLE = [
  { n: "@katya", x: 900, y: 700, i: 1, at: 21.88 },
  { n: "@maxwoon", x: 1720, y: 1180, i: 2, at: 22.0 },
  { n: "@travellingtexan", x: 1980, y: 820, i: 3, at: 22.12 },
  { n: "@alex.alexander", x: 2600, y: 1800, i: 4, at: 22.24 },
  { n: "@isla.vuorinen", x: 2180, y: 1420, i: 1, at: 22.36 },
  { n: "@hrish", x: 1350, y: 1650, i: 0, at: 22.48 },
];
const MapWindow: React.FC<{ t: number }> = ({ t }) => {
  const enter = backOut((t - 20.25) / 0.75);
  const cam = camAt(t);
  const sc = (x: number, y: number) => { const q = toScreen(x, y, cam); return { x: q.x - 547, y: q.y - 64 }; };
  const ny = sc(1980, 820), jc = sc(640, 930), mh = sc(1900, 1250);
  const chipOut = 1 - clamp((t - 21.78) / 0.2);
  return (
    <div style={{ position: "absolute", left: WL, top: WT, width: WW, height: WH, borderRadius: 48, overflow: "hidden", boxShadow: SHADOW, background: S.land,
      transform: `translateX(${(1 - enter) * 920}px) perspective(2000px) rotateY(${-4 + Math.sin((t - 20) * 1.7) * 1.5}deg) scale(0.96)` }}>
      <div style={{ position: "absolute", left: -547, top: -64, width: 1920, height: 1080 }}>
        <CityMap cam={cam} />
      </div>
      {chipOut > 0 && <>
        <MapChip x={ny.x} y={ny.y} p={spring(t, 20.74, 0.36, 0.8) * chipOut} title="New York" sub="21 members" i={0} name="New York" />
        <MapChip x={jc.x} y={jc.y} p={spring(t, 21.04, 0.36, 0.8) * chipOut} title="Jersey City" sub="2 members" i={2} name="Jersey City" />
        <MapChip x={mh.x} y={mh.y} p={spring(t, 21.34, 0.36, 0.8) * chipOut} title="City Ambassadors" sub="@hrish · Manhattan" i={5} name="hrish" />
      </>}
      {PEOPLE.map((q, k) => { const s = sc(q.x, q.y); return <Pin key={k} x={s.x} y={s.y} p={bounce(t, q.at, 0.5)} name={q.n} i={q.i} size={76} />; })}
    </div>
  );
};

const FLICKS = [25.0, 25.5, 26.0, 26.5, 27.0];
const CARD_CY = 585;

export const SegC: React.FC<{ t: number }> = ({ t }) => {
  if (t < 20.25) return <AbsoluteFill><H2Panel t={t} /></AbsoluteFill>;
  if (t >= 29.75) return <AbsoluteFill><H3Gradient t={t} /></AbsoluteFill>;

  // ---- chat (20.25-24.6) ----
  const pIn = ease((t - 20.25) / 0.7);              // a finite ease: no settle tail on the panel
  const out = inout((t - 24.2) / 0.42);              // the speed-matched push to the apps
  const wobY = Math.sin((t - 20) * 2.4) * 5, wobX = Math.cos((t - 20) * 2) * 3, bob = Math.sin((t - 20) * 3) * 10;
  const panelX = -380 * pIn - 1700 * out;
  const rotY = wobY * (1 - pIn) + 6 * pIn;          // H2Panel's wobble hands over to one clean turn, then holds
  const showChat = t < 24.65;

  // ---- apps (24.2-29.75) ----
  const enter = out;
  const groupX = 1700 * (1 - enter);
  let flow = -1.0 + 1.0 * spring(t, 24.3, 0.9, 0.85);
  FLICKS.forEach((f) => { flow += spring(t, f, 0.62, 0.78); });
  const liftP = bounce(t, 27.55, 0.55);
  const openPress = t > 27.95 ? 1 - 0.12 * Math.sin(Math.PI * clamp((t - 27.95) / 0.16)) : 1;
  const tapRing = clamp((t - 27.82) / 0.12) * (1 - clamp((t - 28.1) / 0.2));
  const sideOut = inout((t - 28.1) / 0.3);
  const flood = ease((t - 28.35) / 1.1);             // ease-out: the flood moves fast from its first frame
  const showApps = t > 24.2;

  // the centre card's rect (Network States, index 5)
  const cs = 1 + 0.07 * liftP;
  // the card's illustration rect on screen (the card is 543 x 693 with its 1.5 px border, scaled about its centre)
  const oy = CARD_CY - CH / 2 - 14 * liftP + 346.5;
  const IL = 961.5 - 270 * cs, IT = oy - 345 * cs, IW = 540 * cs, IHs = 360 * cs, IR = 38.5 * cs;
  const fb = { l: mix(IL, 0, flood), tp: mix(IT, 0, flood), w: mix(IW, 1920, flood), h: mix(IHs, 1080, flood), rad: IR * (1 - flood) };
  const gy = mix(IT + 170 * 1.08 * cs, 540, flood);
  const fly = clamp((t - 29.05) / 0.7);
  const gsc = mix(1.08 * cs * globeGrow(t), 3.2, flood);

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {showChat && (
        <>
          <div style={{ position: "absolute", left: 550, top: 60, width: 820, height: 960, borderRadius: 48, background: S.white, boxShadow: SHADOW, border: `1.5px solid ${S.line}`,
            transform: `translateX(${panelX}px) perspective(1800px) rotateY(${rotY}deg) rotateX(${wobX * (1 - pIn)}deg) translateY(${bob * (1 - pIn)}px) scale(${1 - 0.04 * pIn})` }}>
            <ChatPanel t={t} />
          </div>
          <div style={{ position: "absolute", inset: 0, transform: `translateX(${-1700 * out}px)` }}>
            <MapWindow t={t} />
            {t > 20.5 && (() => { const gp = t - 20.5 > 0.62 ? 1 : spring(t, 20.5, 0.45, 0.82); return <Glass w={780} h={292} r={44} transform={`translate(${1443 - 390}px, ${694 + (1 - gp) * 420}px) scale(${0.8 + 0.2 * gp})`} />; })()}
            <KWords t={t} at={20.6} text="Meet up in" cx={1443} y={712} size={118} />
            <KWords t={t} at={20.92} text="every city." cx={1443} y={834} size={118} accentFrom={0} />
            {t > 23.35 && (() => {
              const p1 = bounce(t, 23.35, 0.6), m = spring(t, 23.95, 0.5, 0.65);
              const w = mix(740, 600, m) * (1 + 0.04 * Math.sin(Math.PI * clamp((t - 23.95) / 0.3)));
              const a1 = 1 - clamp((t - 23.95) / 0.12), a2 = clamp((t - 24.02) / 0.15);
              return (
                <Island cx={1443} cy={160} w={w} h={100} p={p1}>
                  <div style={{ position: "relative", width: w, height: 100 }}>
                    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", gap: 14, padding: "0 24px", fontSize: 28, fontWeight: 600, opacity: a1, whiteSpace: "nowrap" }}>
                      <Avatar name="isla.vuorinen" size={58} i={1} ring={S.ink} /><span>isla.vuorinen joined the València chat</span></div>
                    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", gap: 14, padding: "0 24px", fontSize: 28, fontWeight: 600, opacity: a2, whiteSpace: "nowrap", transform: `translateY(${(1 - a2) * 20}px)` }}>
                      <Avatar name="tattiv" size={58} i={3} ring={S.ink} /><span>tattiv joined the Lisbon chat</span></div>
                  </div>
                </Island>
              );
            })()}
          </div>
        </>
      )}

      {showApps && (
        <>
          {/* the map floor the cards stand on: Earth, gliding as the apps flick by */}
          <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `translateX(${groupX}px) translateY(${330 + 60 * sideOut}px) perspective(1400px) rotateX(64deg) scale(1.55)`,
            opacity: 1 - sideOut * 0.6, WebkitMaskImage: "radial-gradient(ellipse 55% 60% at 50% 62%, black 35%, transparent 100%)", maskImage: "radial-gradient(ellipse 55% 60% at 50% 62%, black 35%, transparent 100%)" }}>
            <CityMap cam={{ cx: 1200 + flow * 260, cy: 1150 - flow * 40, z: 0.55, rot: 0 }} />
          </div>
          <div style={{ position: "absolute", inset: 0, transform: `translateX(${groupX}px)` }}>
            {APPS.map((a, i) => ({ a, i, d: i - flow })).sort((p, q) => Math.abs(q.d) - Math.abs(p.d)).map(({ a, i, d }) => {
              const ad = Math.abs(d), sg = Math.sign(d);
              if (ad > 3.2) return null;
              const centre = i === 5;
              let x = sg * (Math.min(ad, 1) * 400 + Math.max(ad - 1, 0) * 210);
              let op = clamp(3.0 - ad);
              if (!centre) { x += sg * (90 * liftP + 700 * sideOut); op *= 1 - sideOut; }
              const rot = centre ? -9 * Math.sin(Math.PI * clamp((t - 27.55) / 0.75)) : -sg * Math.min(ad, 1) * (52 + 14 * liftP);
              const z = -Math.min(ad, 1) * 240 - Math.max(ad - 1, 0) * 80;
              const sc = centre ? cs : 1;
              const wob = Math.sin(t * 2.2 + i) * 2 * (centre ? 1 - inout((t - 27.85) / 0.45) : 1);
              return (
                <div key={i} style={{ position: "absolute", left: 0, top: 0, opacity: op,
                  transform: `translate(${960 - CW / 2 + x}px, ${CARD_CY - CH / 2 - (centre ? 14 * liftP : 0)}px) perspective(2000px) translateZ(${z}px) rotateY(${rot}deg) rotateX(${wob}deg) scale(${sc})` }}>
                  <AppCard a={a} k={i} t={t} openPress={centre ? openPress : 1} />
                </div>
              );
            })}
            {tapRing > 0 && <div style={{ position: "absolute", left: 960 - CW / 2 * cs + 28 + 80 - 50, top: CARD_CY + (CH / 2 - 92 + 32) * cs - 14 * liftP - 50, width: 100, height: 100, borderRadius: 100, background: "rgba(26,26,26,0.16)", border: "3px solid rgba(255,255,255,0.9)", transform: `scale(${0.5 + 0.6 * tapRing})`, opacity: tapRing }} />}
          </div>
          <div style={{ position: "absolute", inset: 0, transform: `translateX(${groupX}px) translateY(${-300 * inout((t - 28.2) / 0.4)}px) scale(${1 - 0.15 * inout((t - 28.2) / 0.4)})`, opacity: 1 - clamp((t - 28.4) / 0.2) }}>
            <KWords t={t} at={24.5} text="Play apps built on Earth." cx={960} y={78} size={112} accentFrom={19} />
            {t > 25.75 && (() => { const gp = t - 25.75 > 0.36 ? 1 : spring(t, 25.75, 0.3, 0.86); return <Glass w={820} h={72} r={36} transform={`translate(${960 - 410}px, ${936 + (1 - gp) * 60 + 620 * inout((t - 28.2) / 0.4)}px) scale(${0.7 + 0.3 * gp})`}>
              <div style={{ height: 72, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, fontWeight: 600, color: S.grey }}>Interactive experiences you open right on the map.</div>
            </Glass>; })()}
          </div>
          {/* the colour flood from the Network States illustration into H3 */}
          {/* at flood = 0 this layer is the card's illustration exactly (the gradient mapped to its rect, the globe, arc,
              dots and disc); the rect grows to full frame (only the top corners rounded, like the illustration), the arc,
              dots and disc fade, H3Gradient crossfades in, and the globe flies apart around the camera */}
          {t >= 28.35 && (
            <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, overflow: "hidden" }}>
              <div style={{ position: "absolute", left: fb.l, top: fb.tp, width: fb.w, height: fb.h, background: GRAD, borderRadius: `${fb.rad}px ${fb.rad}px 0 0`, overflow: "hidden" }}>
                <div style={{ position: "absolute", left: -fb.l, top: -fb.tp, width: 1920, height: 1080, opacity: clamp((flood - 0.35) / 0.55) }}><H3Gradient t={t} /></div>
                <svg width={1920} height={1080} style={{ position: "absolute", left: -fb.l, top: -fb.tp }}>
                  <g transform={`translate(960 ${gy}) scale(${gsc})`}><NSGlobe t={t} aux={1 - clamp((t - 28.35) / 0.2)} fly={fly} /></g>
                </svg>
              </div>
            </div>
          )}
        </>
      )}
    </AbsoluteFill>
  );
};
