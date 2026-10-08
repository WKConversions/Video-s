// Act 3 (25.0–37.9 s): "Need more?"; a window builds itself block by block and becomes a dashboard; a website
// slides in behind it, an app in front, whose sections reorder to the team's way of working; then every tool,
// connected to one system, data flowing between them, copy-paste struck out.
import React from "react";
import { T } from "./clock";
import { EASE, Line, Stroke, measure, off } from "./kinetic";
import { ARRIVE, C, MOVE, SHADOW, ToolTile, lerp } from "./lib";
import { IN, OUT } from "./a1";
import { Abs, BarTitle, Box, Check, Icon, IconBox, PHONE, Phone, Pill, Skel, U, Win, mix, trk, txt } from "./ui";

const k = (g: number, pos: string | number, dur: number, ease = ARRIVE) => T.k(g, pos, dur, ease);
const drop = (g: number, at: string | number, dur = 0.45) => { const a = k(g, at, dur); return { o: Math.min(1, a * 1.5), dy: (1 - a) * 34 }; };

export const Need: React.FC<{ g: number }> = ({ g }) => {
  const words = [{ t: "Need", at: "w:need" }, { t: "more?", at: "w:more" }];
  const size = 210, w = measure("Need", size, 800) + measure("more?", size, 800) + 0.26 * size;
  return <Line g={g} words={words} x={960 - w / 2} y={540 - 130} size={size} weight={800} color={C.navy} out="custom" outDur={0.35} />;
};

// ---- the dashboard ---------------------------------------------------------------------------------------------------
const KPI = [{ l: "New leads", v: 128 }, { l: "Projects", v: 14 }, { l: "Invoices", v: 36 }];
const BARS = [90, 130, 110, 170, 150, 200, 180, 228, 206, 256];
const Dashboard: React.FC<{ g: number }> = ({ g }) => {
  const side = k(g, "w:build2", 0.45, MOVE), dash = k(g, "dash", 0.4);
  const line = BARS.map((h, j) => `${j ? "L" : "M"}${58 + j * 64} ${330 - h - 26}`).join(" ");
  return (
    <>
      <div style={{ position: "absolute", left: 0, top: 0, width: 260, height: 704, background: U.tint, transform: `scaleX(${side})`, transformOrigin: "0 50%" }}>
        <div style={{ opacity: k(g, "w:build2+0.2", 0.3) }}>
          <div style={{ position: "absolute", left: 30, top: 32, width: 44, height: 44, borderRadius: 12, background: C.navy }} />
          {[0, 1, 2, 3, 4].map((j) => (
            <div key={j} style={{ position: "absolute", left: 18, top: 110 + j * 58, width: 224, height: 46, borderRadius: 12, background: j === 0 ? C.white : "transparent", display: "flex", alignItems: "center", gap: 12, paddingLeft: 14 }}>
              <div style={{ width: 18, height: 18, borderRadius: 5, background: j === 0 ? C.cyan : U.skelD }} /><Skel w={[110, 130, 90, 120, 100][j]} h={12} c={j === 0 ? U.skelD : U.skel} />
            </div>
          ))}
        </div>
      </div>
      {/* the header: a placeholder that becomes the page's title */}
      <Abs x={310} y={36} o={drop(g, "w:custom").o * (1 - dash)} dy={drop(g, "w:custom").dy}><Skel w={340} h={30} c={U.skelD} /></Abs>
      <Abs x={310} y={28} o={dash}><span style={txt(36, 800)}>Dashboard</span></Abs>
      <Abs x={1188} y={30} o={drop(g, "w:custom+0.1").o} dy={drop(g, "w:custom+0.1").dy}>
        {dash > 0 ? <div style={{ opacity: dash }}><Pill bg={U.tint} color={C.muted} size={19}>Example data</Pill></div> : <Skel w={170} h={36} c={U.skel} />}
      </Abs>
      {KPI.map((m, i) => {
        const d = drop(g, off("w:software2", 0.08 * i)), f = k(g, off("dash", 0.06 * i), 0.7);
        return (
          <Abs key={i} x={310 + i * 364} y={104} w={340} h={156} o={d.o} dy={d.dy}>
            <div style={{ position: "absolute", inset: 0, borderRadius: 18, background: C.white, border: `2px solid ${U.skel}` }} />
            {f <= 0.3 && <><Skel w={150} style={{ position: "absolute", left: 26, top: 32, opacity: 1 - f * 3 }} /><Skel w={110} h={34} style={{ position: "absolute", left: 26, top: 74, opacity: 1 - f * 3 }} /></>}
            <div style={{ position: "absolute", left: 26, top: 26, opacity: f, ...txt(22, 600, C.muted) }}>{m.l}</div>
            <div style={{ position: "absolute", left: 26, top: 62, opacity: Math.min(1, f * 2), ...txt(54, 800) }}>{Math.round(m.v * EASE.lead(f))}</div>
          </Abs>
        );
      })}
      {(() => { const d = drop(g, "w:software2+0.24"); return (
        <Abs x={310} y={290} w={700} h={384} o={d.o} dy={d.dy}>
          <div style={{ position: "absolute", inset: 0, borderRadius: 18, background: C.white, border: `2px solid ${U.skel}` }} />
          <div style={{ position: "absolute", left: 30, top: 26, opacity: dash, ...txt(23, 700) }}>This month</div>
          {dash <= 0 && <Skel w={160} style={{ position: "absolute", left: 30, top: 32 }} />}
          {BARS.map((h, j) => {
            const b = k(g, off("dash", 0.1 + 0.04 * j), 0.5);
            return <div key={j} style={{ position: "absolute", left: 40 + j * 64, top: 350 - Math.max(16, h * b), width: 36, height: Math.max(16, h * b), borderRadius: 8, background: b > 0 ? mix(U.skel, C.navy, Math.min(1, b * 2)) : U.skel }} />;
          })}
          <Stroke d={line} k={k(g, "dash+0.35", 0.8, EASE.steady)} w={700} h={384} width={6} color={C.cyan} style={{ left: 0, top: 20 }} />
        </Abs>
      ); })()}
      {(() => { const d = drop(g, "w:software2+0.32"), r = k(g, "dash+0.25", 0.8, MOVE); return (
        <Abs x={1034} y={290} w={346} h={384} o={d.o} dy={d.dy}>
          <div style={{ position: "absolute", inset: 0, borderRadius: 18, background: C.white, border: `2px solid ${U.skel}` }} />
          <svg width={200} height={200} viewBox="0 0 200 200" style={{ position: "absolute", left: 73, top: 40 }}>
            <circle cx={100} cy={100} r={76} fill="none" stroke={U.tint} strokeWidth={28} />
            {r > 0 && <circle cx={100} cy={100} r={76} fill="none" stroke={C.cyan} strokeWidth={28} strokeLinecap="round" pathLength={1} strokeDasharray={`${0.68 * r} 1`} transform="rotate(-90 100 100)" />}
          </svg>
          <Skel w={200} style={{ position: "absolute", left: 73, top: 274 }} />
          <Skel w={150} style={{ position: "absolute", left: 98, top: 302 }} />
        </Abs>
      ); })()}
    </>
  );
};

// ---- the website -----------------------------------------------------------------------------------------------------
const Website: React.FC<{ g: number }> = ({ g }) => {
  const d = (j: number) => drop(g, off("web+0.3", 0.06 * j));
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1200, height: 644, background: C.white }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1200, height: 84, borderBottom: `2px solid ${U.skel}` }}>
        <div style={{ position: "absolute", left: 40, top: 22, width: 40, height: 40, borderRadius: 11, background: C.navy }} />
        <Skel w={120} h={14} c={U.skelD} style={{ position: "absolute", left: 94, top: 35 }} />
        {[0, 1, 2, 3].map((j) => <Skel key={j} w={74} h={12} style={{ position: "absolute", left: 620 + j * 104, top: 36 }} />)}
        <div style={{ position: "absolute", left: 1046, top: 22, width: 118, height: 42, borderRadius: 21, background: C.navy }} />
      </div>
      <Abs x={60} y={146} o={d(0).o} dy={d(0).dy}><Skel w={470} h={40} c={C.navy} /></Abs>
      <Abs x={60} y={202} o={d(1).o} dy={d(1).dy}><Skel w={370} h={40} c={C.navy} /></Abs>
      <Abs x={60} y={278} o={d(2).o} dy={d(2).dy}><Skel w={440} h={14} /><Skel w={400} h={14} style={{ marginTop: 12 }} /><Skel w={300} h={14} style={{ marginTop: 12 }} /></Abs>
      <Abs x={60} y={384} o={d(3).o} dy={d(3).dy}><div style={{ width: 230, height: 64, borderRadius: 32, background: C.cyan, display: "flex", alignItems: "center", justifyContent: "center" }}><Skel w={110} h={14} c={C.navy} /></div></Abs>
      <Abs x={640} y={130} w={500} h={330} o={d(2).o} dy={d(2).dy}>
        <div style={{ position: "absolute", inset: 0, borderRadius: 22, background: C.cyanSoft, overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 340, top: 50, width: 70, height: 70, borderRadius: 35, background: C.cyan }} />
          <svg width={500} height={330} style={{ position: "absolute", left: 0, top: 0 }}><path d="M0 330 140 160 250 270 340 190 500 330Z" fill={C.kb} opacity={0.85} /></svg>
        </div>
      </Abs>
      {[0, 1, 2].map((j) => (
        <Abs key={j} x={60 + j * 370} y={500} w={340} h={110} o={d(4 + j).o} dy={d(4 + j).dy}>
          <div style={{ position: "absolute", inset: 0, borderRadius: 16, background: U.body, border: `2px solid ${U.skel}` }} />
          <div style={{ position: "absolute", left: 20, top: 28 }}><IconBox name={["bolt", "chart", "users"][j]} size={52} /></div>
          <Skel w={180} style={{ position: "absolute", left: 92, top: 38 }} /><Skel w={130} style={{ position: "absolute", left: 92, top: 62 }} />
        </Abs>
      ))}
    </div>
  );
};

// ---- the app: sections reorder to the team's way of working ------------------------------------------------------------
const SECTIONS = [{ n: "Today's jobs", i: "calendar" }, { n: "Clients", i: "users" }, { n: "Invoices", i: "receipt" }, { n: "Messages", i: "chat" }];
const BEFORE = [3, 2, 1, 0];   // slot of each section before "tailored" (Messages first), then its own order
const AppScreen: React.FC<{ g: number }> = ({ g }) => {
  const saved = k(g, "works", 0.35);
  return (
    <Phone>
      <div style={{ position: "absolute", left: 0, top: 0, width: PHONE.w - 26, height: 150, background: C.navy }} />
      <div style={{ position: "absolute", left: 26, top: 82, ...txt(28, 800, C.white) }}>Your app</div>
      <div style={{ position: "absolute", right: 22, top: 74, width: 46, height: 46, borderRadius: 23, background: C.cyanSoft, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon name="user" size={26} color={C.navy} />
      </div>
      {SECTIONS.map((s, i) => {
        const m = k(g, off("tailor", 0.07 * i), 0.7, MOVE);
        const y = 170 + lerp(BEFORE[i], i, m) * 132, lift = Math.sin(Math.PI * m) * (BEFORE[i] !== i ? 1 : 0);
        const hi = i === 0 ? saved : 0;
        return (
          <div key={i} style={{ position: "absolute", left: 16, top: y, width: PHONE.w - 58, height: 116, zIndex: lift > 0 ? 3 : 1, transform: `scale(${1 + 0.04 * lift})` }}>
            <div style={{ position: "absolute", inset: 0, borderRadius: 18, background: C.white, border: `${hi ? 3 : 2}px solid ${hi ? mix(U.skel, C.cyan, hi) : U.skel}`,
              boxShadow: `0 ${8 + 14 * lift}px ${20 + 16 * lift}px -14px rgba(41,58,81,${0.3 + 0.2 * lift})` }} />
            <div style={{ position: "absolute", left: 18, top: 30 }}><IconBox name={s.i} size={54} bg={hi ? mix(U.tint, C.cyanSoft, hi) : U.tint} /></div>
            <div style={{ position: "absolute", left: 88, top: 32, ...txt(23, 700) }}>{s.n}</div>
            <Skel w={130} h={11} style={{ position: "absolute", left: 88, top: 70 }} />
            {hi > 0 ? <div style={{ position: "absolute", right: 16, top: 38, opacity: hi, transform: `scale(${0.6 + 0.4 * hi})` }}><Check size={40} /></div>
              : <Icon name="drag" size={30} color={U.skelD} width={4} style={{ position: "absolute", right: 18, top: 43 }} />}
          </div>
        );
      })}
    </Phone>
  );
};

export const Custom: React.FC<{ g: number }> = ({ g }) => {
  const gone = k(g, "tools+0.15", 0.4);
  const SW = trk(g, [["custom", 960, 1580, 1], ["custom+0.65", 960, 560, 1, IN], ["web", 960, 560, 1.0], ["web+0.6", 690, 610, 0.72, MOVE], ["app", 690, 610, 0.72],
    ["app+0.6", 640, 620, 0.7, MOVE], ["tools", 640, 620, 0.7], ["tools+0.55", 960, 600, 0.14, MOVE]]);
  const WB = trk(g, [["custom", 2400, 430, 0.72], ["web", 2400, 430, 0.72], ["web+0.7", 1240, 430, 0.72, IN], ["app", 1240, 430, 0.72], ["app+0.6", 1170, 420, 0.72, MOVE],
    ["tools", 1170, 420, 0.72], ["tools+0.55", 960, 600, 0.12, MOVE]]);
  const P = trk(g, [["custom", 1560, 1560, 0.84], ["app", 1560, 1560, 0.84], ["app+0.6", 1530, 640, 0.84, IN], ["tools", 1530, 640, 0.84], ["tools+0.55", 960, 600, 0.12, MOVE]]);
  return (
    <>
      {g >= T.f("web") && <Box x={WB[0]} y={WB[1]} w={1200} h={760} s={WB[2]} o={1 - gone}>
        <Win w={1200} h={760} logo={false} title={<BarTitle g={g} text="" at="web+0.2"><Icon name="globe" size={30} color={C.white} />Website</BarTitle>}><Website g={g} /></Win>
      </Box>}
      <Box x={SW[0]} y={SW[1]} w={1440} h={820} s={SW[2]} o={1 - gone}>
        <Win w={1440} h={820} logo={false} title={<>
          <BarTitle g={g} text="Custom software" at="custom+0.35" out="dash" />
          <BarTitle g={g} text="" at="dash+0.05"><Icon name="chart" size={30} color={C.white} />Dashboard</BarTitle>
        </>}><Dashboard g={g} /></Win>
      </Box>
      {g >= T.f("app") && <Box x={P[0]} y={P[1]} w={PHONE.w} h={PHONE.h} s={P[2]} o={1 - gone}><AppScreen g={g} /></Box>}
    </>
  );
};

// ---- every tool, connected -------------------------------------------------------------------------------------------
const RING = ["pipedrive", "odoo", "supabase", "resend", "make", "n8n", "claude", "next"];
const HUB = { x: 960, y: 600, r: 150 };
const ringPos = (i: number) => { const a = ((22.5 + 45 * i) * Math.PI) / 180; return { x: HUB.x + 610 * Math.cos(a), y: HUB.y + 300 * Math.sin(a), ux: Math.cos(a), uy: Math.sin(a) }; };
export const Tools: React.FC<{ g: number }> = ({ g }) => {
  const hub = k(g, "tools+0.25", 0.55), hubOut = k(g, "team", 0.4, OUT);
  const fl = k(g, "flows", 0.4) * (1 - k(g, "team", 0.3));
  const keys = k(g, "copy", 0.4), keys2 = k(g, "paste-0.06", 0.4), keysOut = k(g, "team", 0.3);
  const strike = k(g, "paste+0.12", 0.32, MOVE);
  return (
    <>
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
        {RING.map((t, i) => {
          const p = ringPos(i), dx = p.x - HUB.x, dy = p.y - HUB.y, d = Math.hypot(dx, dy), ux = dx / d, uy = dy / d;
          const a = { x: p.x - ux * 82, y: p.y - uy * 82 }, b = { x: HUB.x + ux * (HUB.r + 10), y: HUB.y + uy * (HUB.r + 10) };
          const kk = k(g, off("connect", 0.035 * i), 0.42, EASE.steady) * (1 - k(g, "team", 0.3));
          if (kk <= 0) return null;
          return (
            <g key={i}>
              <path d={`M${a.x} ${a.y}L${b.x} ${b.y}`} stroke={U.link} strokeWidth={5} strokeLinecap="round" pathLength={1} strokeDasharray={`${kk} 1`} fill="none" />
              {fl > 0 && [0, 1].map((j) => {
                const u0 = ((g - T.f("flows")) / 34 + j * 0.5 + i * 0.13) % 1, u = i % 2 ? 1 - u0 : u0;
                const x = lerp(a.x, b.x, u), y = lerp(a.y, b.y, u), o = fl * Math.min(1, u0 * 6, (1 - u0) * 6);
                return <circle key={j} cx={x} cy={y} r={10} fill={C.cyan} stroke={C.white} strokeWidth={4} opacity={o} />;
              })}
            </g>
          );
        })}
      </svg>
      <Box x={HUB.x} y={HUB.y} w={HUB.r * 2} h={HUB.r * 2} s={(0.3 + 0.7 * hub) * (1 - 0.6 * hubOut)} o={Math.min(1, hub * 1.5) * (1 - hubOut)}
        style={{ borderRadius: "50%", background: C.white, boxShadow: SHADOW.card, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
        <IconBox name="layers" size={64} bg={C.cyanSoft} />
        <div style={{ ...txt(32, 800), textAlign: "center", lineHeight: 1.1 }}>Your<br />system</div>
      </Box>
      {RING.map((t, i) => {
        const p = ringPos(i), a = k(g, off("tools+0.12", 0.07 * i), 0.62, IN), o = k(g, off("team", 0.03 * i), 0.45, OUT);
        if (a <= 0 || o >= 1) return null;
        const away = (1 - a) * 760 + o * 520;
        return <Box key={t} x={p.x + p.ux * away} y={p.y + p.uy * away} w={128} h={128} o={1 - o}><ToolTile tool={t} size={128} /></Box>;
      })}
      {keys > 0 && keysOut < 1 && (
        <div style={{ position: "absolute", left: 0, top: 0, opacity: 1 - keysOut }}>
          {[["Copy", keys, 806], ["Paste", keys2, 978]].map(([t, a, x]) => (a as number) > 0 && (
            <div key={t as string} style={{ position: "absolute", left: x as number, top: 104, width: 150, height: 96, borderRadius: 16, background: C.white, border: `2px solid ${U.skel}`,
              borderBottom: `7px solid ${U.skelD}`, boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center", ...txt(30, 700),
              opacity: Math.min(1, (a as number) * 1.5), transform: `translateY(${(1 - (a as number)) * -40}px)` }}>{t as string}</div>
          ))}
          <div style={{ position: "absolute", left: 776, top: 146, width: 386, height: 11, borderRadius: 6, background: C.cyan, transform: `rotate(-4deg) scaleX(${strike})`, transformOrigin: "0 50%" }} />
        </div>
      )}
    </>
  );
};
