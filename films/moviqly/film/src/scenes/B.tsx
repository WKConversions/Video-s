// Scene B — the problem: "Motion design takes designers, expensive tools, and weeks of revisions. Most teams simply
// can't keep up." One muted visual per phrase, each whipping in from the right on its word while the last one leaves
// left: three busy designers; a stack of pricey generic tool windows with cost stickers; a calendar burning weeks while
// launch_v… files pile up; a request queue that overflows and tips over, which clears the stage before s2.
// Ink and greys only (the brand colour arrives with the solution); the one warm accent is the small "Late" badge.
import React from "react";
import { ARRIVE, C, FONT, Ico, MOVE, POP, SHADOW, SHADOW_BIG, SNAP, Say, clamp01, f, k, kf, mix } from "../shared";

const G = { g1: "#F1EFF3", g2: "#E2DEE7", g3: "#B9B3C2", g4: "#8E8899", ink2: "#4A4553", late: "#D2483F" };
const easeIn = (t: number) => t * t;
const CARD: React.CSSProperties = { position: "absolute", background: C.white, borderRadius: 24, boxShadow: `0 0 0 1px ${C.line}, ${SHADOW_BIG}`, boxSizing: "border-box", fontFamily: FONT, overflow: "hidden" };

// One beat's element i: whips in from the right (ARRIVE) and leaves to the left (MOVE).
const slide = (g: number, inAt: number, outAt: number, i = 0, st = 5) => {
  const a = kf(g, inAt + i * st, 20, ARRIVE), o = kf(g, outAt + i * 2, 13, MOVE);
  return { x: (1 - a) * 1300 - o * 2100, show: a > 0 && o < 1, a };
};

/* ---------- 1 · designers ---------- */
const PEOPLE = [
  { role: "Motion designer", status: "Busy · 4 projects", load: 0.96, tone: "#E7E3EB", at: "s1" },
  { role: "Animator", status: "In revisions", load: 1.0, tone: "#DEDAE3", at: "w:design-0.1" },
  { role: "3D artist", status: "Booked for weeks", load: 1.2, tone: "#E9E6EE", at: "w:takes-0.1" },
];
const Avatar: React.FC<{ size: number; tone: string; busy: number; g: number }> = ({ size, tone, busy, g }) => (
  <div style={{ position: "relative", width: size, height: size }}>
    <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: tone, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: size * 0.32, top: size * 0.2, width: size * 0.36, height: size * 0.36, borderRadius: "50%", background: G.g3 }} />
      <div style={{ position: "absolute", left: size * 0.14, top: size * 0.62, width: size * 0.72, height: size * 0.6, borderRadius: "50%", background: G.g3 }} />
    </div>
    {busy > 0 && (
      <svg width={size + 28} height={size + 28} viewBox="0 0 100 100" style={{ position: "absolute", left: -14, top: -14, opacity: busy, transform: `rotate(${g * 9}deg)` }}>
        <circle cx="50" cy="50" r="47" fill="none" stroke={G.g2} strokeWidth="2.6" />
        <path d="M50 3 A47 47 0 0 1 97 50" fill="none" stroke={C.ink} strokeWidth="3.2" strokeLinecap="round" />
      </svg>
    )}
    <div style={{ position: "absolute", right: 2, bottom: 2, width: size * 0.24, height: size * 0.24, borderRadius: "50%", border: `5px solid ${C.white}`, boxSizing: "border-box",
      background: busy > 0.5 ? C.ink : G.g3, display: "flex", alignItems: "center", justifyContent: "center" }}>
      {busy > 0.5 && <div style={{ width: "48%", height: 4, borderRadius: 2, background: C.white }} />}
    </div>
  </div>
);
const Designer: React.FC<{ g: number; i: number }> = ({ g, i }) => {
  const p = PEOPLE[i];
  const busy = kf(g, f("w:designers") + i * 4, 8, SNAP), pop = kf(g, f("w:designers") + i * 4, 10, POP);
  const load = p.load * k(g, `w:designers+${(i * 0.13).toFixed(2)}`, 0.9);
  const dots = [0, 1, 2].map((d) => 0.35 + 0.65 * Math.max(0, Math.sin((g - d * 4) / 4.5)));
  return (
    <div style={{ ...CARD, width: 400, height: 480, transform: `translateY(${Math.sin((g + i * 23) / 22) * 6}px)` }}>
      <div style={{ position: "absolute", left: 125, top: 46 }}><Avatar size={150} tone={p.tone} busy={busy} g={g + i * 13} /></div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 232, textAlign: "center", fontWeight: 700, fontSize: 32, color: C.ink, letterSpacing: "-0.02em" }}>{p.role}</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 288, display: "flex", justifyContent: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 18px", borderRadius: 999, background: G.g1, color: C.ink, fontSize: 23, fontWeight: 600,
          transform: `scale(${pop})`, opacity: clamp01(pop * 3) }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: C.ink }} />{p.status}
          <div style={{ display: "flex", gap: 4, marginLeft: 2 }}>{dots.map((d, j) => <div key={j} style={{ width: 6, height: 6, borderRadius: "50%", background: G.g4, opacity: d }} />)}</div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 44, right: 44, top: 376, display: "flex", fontSize: 22, color: C.muted, fontWeight: 500 }}>
        Workload<div style={{ flex: 1 }} /><span style={{ color: C.ink, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>{Math.round(load * 100)}%</span>
      </div>
      <div style={{ position: "absolute", left: 44, right: 44, top: 416, height: 14, borderRadius: 7, background: G.g1, overflow: "hidden" }}>
        <div style={{ width: `${Math.min(1, load) * 100}%`, height: "100%", borderRadius: 7, background: load > 1.001 ? C.ink : G.ink2 }} />
      </div>
    </div>
  );
};

/* ---------- 2 · tools ---------- */
const WIN = [
  { title: "Compositor", x: 300, y: 270, tag: "$$$ / seat", rot: -7 },
  { title: "3D studio", x: 570, y: 340, tag: "+ $$ plugins", rot: 6 },
  { title: "Animation suite", x: 840, y: 410, tag: "+ $$$ renders", rot: -5 },
];
const WW = 780, WH = 440, BAR = 54;
const Cube: React.FC<{ g: number; cx: number; cy: number; r: number }> = ({ g, cx, cy, r }) => {
  const a = g / 22, b = 0.5;
  const P = [-1, 1].flatMap((x) => [-1, 1].flatMap((y) => [-1, 1].map((z) => [x, y, z])));
  const pr = P.map(([x, y, z]) => {
    const x1 = x * Math.cos(a) - z * Math.sin(a), z1 = x * Math.sin(a) + z * Math.cos(a);
    const y1 = y * Math.cos(b) - z1 * Math.sin(b);
    return [cx + x1 * r, cy + y1 * r];
  });
  const E = [[0, 1], [2, 3], [4, 5], [6, 7], [0, 2], [1, 3], [4, 6], [5, 7], [0, 4], [1, 5], [2, 6], [3, 7]];
  return <>{E.map(([p, q], i) => <line key={i} x1={pr[p][0]} y1={pr[p][1]} x2={pr[q][0]} y2={pr[q][1]} stroke={G.ink2} strokeWidth={3} strokeLinecap="round" />)}</>;
};
const ToolBody: React.FC<{ i: number; g: number }> = ({ i, g }) => {
  const H = WH - BAR;
  if (i === 0) {                                     // node graph (only its left part shows)
    const nodes = [["Input", 30, 40], ["Blur", 30, 150], ["Grade", 30, 260]] as const;
    const t = ((g / 26) % 1);
    return (
      <svg width={WW} height={H} style={{ position: "absolute", left: 0, top: BAR }}>
        {nodes.map(([, x, y], j) => <path key={j} d={`M${x + 170} ${y + 30} C ${x + 300} ${y + 30}, ${x + 260} ${200}, ${x + 420} ${200}`} fill="none" stroke={G.g3} strokeWidth={3} />)}
        <circle cx={200 + 220 * t} cy={70 + 130 * Math.sin(t * Math.PI / 2)} r={7} fill={G.ink2} />
        {nodes.map(([n, x, y]) => <g key={n}><rect x={x} y={y} width={170} height={60} rx={14} fill={C.white} stroke={G.g2} strokeWidth={2} /><text x={x + 22} y={y + 38} fontFamily={FONT} fontSize={23} fontWeight={600} fill={C.ink}>{n}</text></g>)}
      </svg>
    );
  }
  if (i === 1) {                                     // a 3D viewport with a turning wireframe cube
    return (
      <svg width={WW} height={H} style={{ position: "absolute", left: 0, top: BAR }}>
        {[0, 1, 2, 3, 4, 5].map((j) => <line key={j} x1={0} y1={250 + j * 24} x2={WW} y2={250 + j * 24} stroke={G.g2} strokeWidth={2} />)}
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((j) => <line key={`v${j}`} x1={135 + (j - 4) * 30} y1={250} x2={135 + (j - 4) * 90} y2={386} stroke={G.g2} strokeWidth={2} />)}
        <Cube g={g} cx={135} cy={150} r={62} />
      </svg>
    );
  }
  // the animation timeline: a viewport with a moving shape, layer tracks with keyframes, a sweeping playhead
  const ph = 0.5 + 0.5 * Math.sin(g / 14);
  const tracks = [["Logo", 40, 380], ["Title", 120, 520], ["Shape 1", 20, 300], ["Background", 0, 560]] as const;
  return (
    <div style={{ position: "absolute", left: 0, top: BAR, width: WW, height: H, background: "#F7F6F8" }}>
      <div style={{ position: "absolute", left: 24, top: 18, width: WW - 48, height: 150, borderRadius: 12, background: G.g2, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 40 + ph * 560, top: 40, width: 70, height: 70, borderRadius: 18, background: G.ink2, transform: `rotate(${ph * 180}deg)` }} />
      </div>
      {tracks.map(([n, a, b], j) => (
        <div key={n} style={{ position: "absolute", left: 24, top: 190 + j * 46, width: WW - 48, height: 38, display: "flex", alignItems: "center" }}>
          <div style={{ width: 160, fontSize: 22, fontWeight: 600, color: C.ink }}>{n}</div>
          <div style={{ position: "relative", flex: 1, height: 26 }}>
            <div style={{ position: "absolute", left: a, width: b - a, top: 4, height: 18, borderRadius: 9, background: G.g2 }} />
            {[a, (a + b) / 2, b].map((x, q) => <div key={q} style={{ position: "absolute", left: x - 8, top: 5, width: 16, height: 16, background: G.ink2, transform: "rotate(45deg)", borderRadius: 3 }} />)}
          </div>
        </div>
      ))}
      <div style={{ position: "absolute", left: 184 + ph * 540, top: 180, width: 3, height: H - 190, background: C.ink }} />
    </div>
  );
};
const ToolWindow: React.FC<{ i: number; g: number }> = ({ i, g }) => (
  <div style={{ ...CARD, borderRadius: 20, width: WW, height: WH }}>
    <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: BAR, display: "flex", alignItems: "center", gap: 10, padding: "0 22px", borderBottom: `1px solid ${C.line}` }}>
      {[0, 1, 2].map((d) => <div key={d} style={{ width: 14, height: 14, borderRadius: "50%", background: G.g2 }} />)}
      <div style={{ marginLeft: 12, fontSize: 23, fontWeight: 600, color: C.ink }}>{WIN[i].title}</div>
    </div>
    <ToolBody i={i} g={g} />
  </div>
);
const CostTag: React.FC<{ text: string; p: number; rot: number; g: number }> = ({ text, p, rot, g }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 20px 12px 16px", borderRadius: 14, background: C.ink, color: C.white, fontFamily: FONT, fontSize: 26, fontWeight: 700,
    whiteSpace: "nowrap", boxShadow: "0 14px 30px -14px rgba(38,35,44,0.7)", transform: `scale(${p}) rotate(${rot + Math.sin(g / 7) * 3 * clamp01(p)}deg)`, opacity: clamp01(p * 3) }}>
    <Ico n="coin" s={30} c={C.white} w={2.4} />{text}
  </div>
);

/* ---------- 3 · weeks of revisions ---------- */
const FILES = ["launch_v1.mp4", "launch_v3.mp4", "launch_v4_edits.mp4", "launch_v7_final.mp4", "launch_final_v2.mp4", "launch_FINAL_final2.mp4"];
const JIT = [[0, -1.5], [28, 2], [-16, -2.5], [34, 1.5], [-8, -3], [18, 2.2]];
const DUE = 13;
const Calendar: React.FC<{ g: number }> = ({ g }) => {
  const p = kf(g, f("w:weeks"), f("w:most") - f("w:weeks") - 4, (t) => t);
  const cells = p * 35, week = Math.min(5, 1 + Math.floor(cells / 7)), ph = (cells / 7) % 1;
  const flip = cells >= 7 && ph < 0.3 && week < 5 ? 1 - ph / 0.3 : 0;
  const late = k(g, "w:revisions+0.15", 0.4, POP);
  return (
    <div style={{ ...CARD, width: 540, height: 540 }}>
      <div style={{ position: "absolute", left: 36, top: 30, display: "flex", alignItems: "center", gap: 16 }}>
        <Ico n="calendar" s={40} c={C.ink} w={2.4} />
        <div style={{ fontSize: 48, fontWeight: 700, color: C.ink, letterSpacing: "-0.03em", transform: `perspective(600px) rotateX(${flip * 80}deg)`, transformOrigin: "50% 0%", fontVariantNumeric: "tabular-nums" }}>Week {week}</div>
      </div>
      <div style={{ position: "absolute", right: 32, top: 38, padding: "8px 16px", borderRadius: 999, background: G.late, color: C.white, fontSize: 24, fontWeight: 700,
        display: "flex", alignItems: "center", gap: 8, transform: `scale(${late})`, opacity: clamp01(late * 3) }}><Ico n="clock" s={24} c={C.white} w={2.6} />Late</div>
      <div style={{ position: "absolute", left: 37, top: 116, display: "grid", gridTemplateColumns: "repeat(7, 58px)", columnGap: 10, rowGap: 10 }}>
        {"MTWTFSS".split("").map((d, j) => <div key={`h${j}`} style={{ textAlign: "center", fontSize: 22, fontWeight: 600, color: C.soft }}>{d}</div>)}
        {Array.from({ length: 35 }, (_, j) => {
          const on = clamp01(cells - j), cur = cells > j && cells < j + 1;
          return (
            <div key={j} style={{ width: 58, height: 58, borderRadius: 12, background: on >= 1 ? G.g2 : G.g1, boxSizing: "border-box", position: "relative",
              border: j === DUE ? `3px solid ${G.late}` : cur ? `3px solid ${C.ink}` : "none" }}>
              {on > 0 && <svg width={58} height={58} viewBox="0 0 58 58" style={{ position: "absolute", left: j === DUE || cur ? -3 : 0, top: j === DUE || cur ? -3 : 0 }}>
                <path d={`M18 18 L${18 + 22 * on} ${18 + 22 * on}`} stroke={G.g4} strokeWidth={4} strokeLinecap="round" />
                {on > 0.5 && <path d={`M40 18 L${40 - 22 * (on - 0.5) * 2} ${18 + 22 * (on - 0.5) * 2}`} stroke={G.g4} strokeWidth={4} strokeLinecap="round" />}
              </svg>}
            </div>
          );
        })}
      </div>
    </div>
  );
};
const FileRow: React.FC<{ name: string; last: boolean }> = ({ name, last }) => (
  <div style={{ ...CARD, position: "relative", width: 640, height: 82, borderRadius: 18, boxShadow: `0 0 0 1px ${C.line}, ${SHADOW}`, display: "flex", alignItems: "center", gap: 20, padding: "0 22px" }}>
    <div style={{ width: 62, height: 44, borderRadius: 9, background: G.g2, display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}><Ico n="play" s={20} c={G.ink2} fill={G.ink2} w={1.5} /></div>
    <div style={{ fontSize: 28, fontWeight: last ? 700 : 600, color: C.ink, letterSpacing: "-0.01em" }}>{name}</div>
  </div>
);

/* ---------- 4 · the request queue ---------- */
const REQ: [string, boolean][] = [
  ["Launch video", true], ["Feature teaser", false], ["Social cut · 9:16", true], ["Product demo", false], ["Onboarding explainer", false],
  ["Event recap", true], ["Spring campaign ad", false], ["Webinar promo", false], ["Hiring film", true], ["Release highlights", false],
  ["Customer story", false], ["Holiday promo", true], ["Partner announcement", false], ["Tutorial series", false], ["Year in review", true],
];
const QX = 520, QY = 250, QW = 880, QH = 580, LT = QY + 104, PITCH = 92;
const ReqRow: React.FC<{ title: string; late: boolean; due: string }> = ({ title, late, due }) => (
  <div style={{ width: 816, height: 80, borderRadius: 16, background: C.white, boxShadow: `0 0 0 1px ${C.line}, ${SHADOW}`, display: "flex", alignItems: "center", gap: 18, padding: "0 18px 0 14px", boxSizing: "border-box", fontFamily: FONT }}>
    <div style={{ width: 52, height: 52, borderRadius: 12, background: G.g1, display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}><Ico n="film" s={28} c={G.g4} w={2.2} /></div>
    <div style={{ fontSize: 27, fontWeight: 600, color: C.ink, letterSpacing: "-0.01em" }}>{title}</div>
    <div style={{ fontSize: 22, color: C.muted }}>{due}</div>
    <div style={{ flex: 1 }} />
    <div style={{ padding: "6px 14px", borderRadius: 999, fontSize: 22, fontWeight: 700, background: late ? G.late : G.g1, color: late ? C.white : C.muted }}>{late ? "Late" : "Waiting"}</div>
  </div>
);

export const SceneB: React.FC<{ g: number }> = ({ g }) => {
  const s1 = f("s1"), s2 = f("s2");
  if (g < s1 || g >= s2) return null;
  const veil = 0.75 * kf(g, s1, 14, MOVE) * (1 - kf(g, s2 - 16, 15, MOVE));   // mutes the ground's glow
  // each beat starts leaving 7 frames before the next one whips in (a pan: out left, in from the right)
  const in2 = f("w:expensive") - 5, in3 = f("w:weeks") - 6, in4 = f("w:most") - 2, out1 = in2 - 7, out2 = in3 - 7, out3 = in4 - 7;

  // 4 · queue arrivals (newest on top), accelerating into "keep up"
  const n0 = 3, nMore = REQ.length - n0, ta = f("w:teams"), tb = f("w:keep") - 3;
  const arr = REQ.map((_, j) => (j < n0 ? in4 + j * 3 : ta + (tb - ta) * Math.pow((j - n0) / (nMore - 1), 0.7)));
  const arrived = arr.filter((t) => g >= t).length;
  const cnt = kf(g, Math.max(...arr.filter((t) => g >= t)), 6, POP);
  const wob = Math.sin((g - f("w:cant")) * 0.9) * 1.8 * kf(g, f("w:cant"), 8);
  const tip = kf(g, f("w:keep") - 1, s2 - f("w:keep"), (t) => t);   // gone exactly at s2 - 1
  const q = slide(g, in4, 9999, 0);

  return (
    <>
      <div style={{ position: "absolute", inset: 0, background: C.paper, opacity: veil }} />

      {/* 1 · designers */}
      {(() => { const c = slide(g, f("s1"), out1, 0); return c.show && <Say g={g} x={c.x} y={150} size={56} words={[{ t: "Motion", at: "w:motion" }, { t: "design", at: "w:design" }, { t: "takes", at: "w:takes" }, { t: "designers", at: "w:designers" }]} />; })()}
      {PEOPLE.map((p, i) => {
        const c = slide(g, f(p.at) - i * 5, out1, i);
        return c.show && <div key={i} style={{ position: "absolute", left: 310 + i * 450, top: 300, transform: `translateX(${c.x}px)` }}><Designer g={g} i={i} /></div>;
      })}

      {/* 2 · tools */}
      {(() => { const c = slide(g, in2, out2, 0); return c.show && <Say g={g} x={c.x} y={150} size={56} words={[{ t: "Expensive", at: "w:expensive" }, { t: "tools", at: "w:tools" }]} />; })()}
      {WIN.map((w, i) => {
        const c = slide(g, in2, out2, i);
        return c.show && <div key={i} style={{ position: "absolute", left: w.x, top: w.y, transform: `translateX(${c.x}px)` }}><ToolWindow i={i} g={g} /></div>;
      })}
      {WIN.map((w, i) => {
        const c = slide(g, in2, out2, i), p = kf(g, f("w:tools") + i * 4, 10, POP);
        return c.show && p > 0 && <div key={`t${i}`} style={{ position: "absolute", left: w.x + WW - 110, top: w.y - 34, transform: `translateX(${c.x}px)` }}><CostTag text={w.tag} p={p} rot={w.rot} g={g + i * 9} /></div>;
      })}

      {/* 3 · weeks of revisions */}
      {(() => { const c = slide(g, in3, out3, 0); return c.show && <Say g={g} x={c.x} y={150} size={56} words={[{ t: "Weeks", at: "w:weeks" }, { t: "of", at: "w:of" }, { t: "revisions", at: "w:revisions" }]} />; })()}
      {(() => { const c = slide(g, in3, out3, 0); return c.show && <div style={{ position: "absolute", left: 270, top: 290, transform: `translateX(${c.x}px)` }}><Calendar g={g} /></div>; })()}
      {FILES.map((name, j) => {
        const c = slide(g, in3, out3, 1), t = f("w:weeks") + j * 5, fall = kf(g, t, 9, easeIn), b = kf(g, t + 9, 7, (x) => x);
        if (!c.show || g < t) return null;
        const rest = 830 - (j + 1) * 86, y = rest - 760 * (1 - fall) - 20 * Math.sin(Math.PI * b) * (1 - b);
        return <div key={name} style={{ position: "absolute", left: 900 + JIT[j][0], top: y, transform: `translateX(${c.x}px) rotate(${JIT[j][1] * fall}deg)` }}><FileRow name={name} last={j === FILES.length - 1} /></div>;
      })}

      {/* 4 · can't keep up: the queue overflows, wobbles and tips over */}
      {q.show && tip < 1 && <Say g={g} x={q.x} y={150} size={56} out="w:keep+0.1" words={[{ t: "Most", at: "w:most" }, { t: "teams", at: "w:teams" }, { t: "can't", at: "w:cant" }, { t: "keep", at: "w:keep" }, { t: "up", at: "w:up" }]} />}
      {q.show && tip < 1 && (
        <div style={{ position: "absolute", inset: 0, transformOrigin: `${QX + QW}px ${QY + QH}px`,
          transform: `translate(${q.x + 120 * tip}px, ${1500 * tip * tip}px) rotate(${wob + 50 * tip * tip}deg)` }}>
          <div style={{ ...CARD, left: QX, top: QY, width: QW, height: QH }}>
            <div style={{ position: "absolute", left: 32, top: 26, display: "flex", alignItems: "center", gap: 14 }}>
              <Ico n="layers" s={38} c={C.ink} w={2.4} /><div style={{ fontSize: 36, fontWeight: 700, color: C.ink, letterSpacing: "-0.02em" }}>Requests</div>
            </div>
            <div style={{ position: "absolute", right: 32, top: 26, padding: "8px 18px", borderRadius: 999, background: C.ink, color: C.white, fontSize: 24, fontWeight: 700,
              fontVariantNumeric: "tabular-nums", transform: `scale(${1 + 0.1 * Math.sin(Math.PI * cnt)})` }}>{arrived} waiting</div>
            <div style={{ position: "absolute", left: 0, right: 0, top: 90, height: 1, background: C.line }} />
          </div>
          {REQ.map(([title, late], j) => {
            if (g < arr[j]) return null;
            const e = kf(g, arr[j], 8, SNAP);
            let idx = 0;
            for (let l = j + 1; l < REQ.length; l++) idx += kf(g, arr[l], 8, ARRIVE);
            const y = LT + idx * PITCH, spill = clamp01((y - (QY + QH - 90)) / 420);
            const dx = (j % 2 ? 46 : -38) * spill, rot = (j % 2 ? 7 : -6) * spill;
            return (
              <div key={j} style={{ position: "absolute", left: QX + 32, top: y, opacity: clamp01(e * 2), transform: `translateX(${(1 - e) * 180 + dx}px) rotate(${rot}deg) scale(${mix(0.94, 1, e)})` }}>
                <ReqRow title={title} late={late} due={late ? "Due yesterday" : "Due Fri"} />
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};
