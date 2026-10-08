// Act 4 (37.9–58.0 s): the team channel (K.B joins the row of the team's initials and posts what it is doing);
// launch (Go live → Live); the monthly plan (hosting and maintenance every week, a new feature every month);
// the loop Diagnose → Build → Run; the loop gathers into the K.B logo; "Book a Free Discovery Call".
import React from "react";
import { T } from "./clock";
import { EASE, off } from "./kinetic";
import { ARRIVE, C, KBTile, MOVE, SHADOW, lerp } from "./lib";
import { IN, OUT } from "./a1";
import { Avatar, BarTitle, Box, Cursor, Icon, IconBox, Pill, U, Win, mix, press, ripple, trk, txt } from "./ui";

const k = (g: number, pos: string | number, dur: number, ease = ARRIVE) => T.k(g, pos, dur, ease);

// ---- the team channel -----------------------------------------------------------------------------------------------
const TEAM = [{ t: "AM", bg: C.cyanSoft }, { t: "JS", bg: "#E3E8EF" }, { t: "RK", bg: "#DCE6F2" }, { t: "LT", bg: U.tint }];
const MSGS = [
  { who: "AM", t: "Morning, team!", at: "team+0.75" },
  { who: "You", t: "How's it going?", at: "ask" },
  { who: "K.B", t: "The intake form is live.", at: "always" },
  { who: "K.B", t: "CRM sync: testing today.", at: "w:know-0.08" },
  { who: "K.B", t: "Next: follow-up emails.", at: "w:doing2-0.12" },
];
const Channel: React.FC<{ g: number }> = ({ g }) => {
  const join = k(g, "inside", 0.62, IN), make = k(g, "inside+0.06", 0.45, MOVE), count = k(g, "around+0.06", 0.4, MOVE);
  const ring = k(g, "around", 0.5, MOVE);
  const slotX = (s: number) => 350 + s * 104;
  return (
    <>
      <div style={{ position: "absolute", left: 0, top: 0, width: 300, height: 704, background: U.tint }}>
        <div style={{ position: "absolute", left: 30, top: 30, ...txt(20, 700, C.muted) }}>Channels</div>
        {["general", "projects", "operations"].map((n, j) => (
          <div key={j} style={{ position: "absolute", left: 16, top: 76 + j * 58, width: 268, height: 48, borderRadius: 12, background: j === 2 ? C.white : "transparent", display: "flex", alignItems: "center", gap: 10, paddingLeft: 14, ...txt(23, j === 2 ? 700 : 600, j === 2 ? C.navy : C.muted) }}>
            <Icon name="hash" size={22} color={j === 2 ? C.navy : C.muted} />{n}
          </div>
        ))}
      </div>
      {TEAM.map((m, i) => {
        const s = i < 2 ? i : lerp(i, i + 1, make);
        return <div key={i} style={{ position: "absolute", left: slotX(s), top: 36 }}><Avatar size={84} text={m.t} bg={m.bg} /></div>;
      })}
      {join > 0 && (
        <div style={{ position: "absolute", left: lerp(1500, slotX(2), join), top: 36, opacity: Math.min(1, join * 2) }}>
          <Avatar size={84} kb />
          {ring > 0 && <svg width={120} height={120} style={{ position: "absolute", left: -18, top: -18 }}><rect x={4} y={4} width={112} height={112} rx={30} fill="none" stroke={C.cyan} strokeWidth={5} pathLength={1} strokeDasharray={`${ring} 1`} /></svg>}
        </div>
      )}
      <div style={{ position: "absolute", left: slotX(5) + 30, top: 62, height: 34, overflow: "hidden" }}>
        <div style={{ transform: `translateY(${-count * 34}px)` }}>
          <div style={{ height: 34, ...txt(26, 600, C.muted) }}>4 members</div>
          <div style={{ height: 34, ...txt(26, 700, C.navy) }}>5 members</div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 300, top: 150, width: 1140, height: 2, background: U.skel }} />
      {MSGS.map((m, i) => {
        // older messages step up first; the new one rises into the space a moment later
        if (g < T.f(m.at)) return null;
        const a = k(g, off(m.at, 0.08), 0.45);
        const later = MSGS.slice(i + 1).reduce((s, n) => s + k(g, n.at, 0.32), 0);
        const y = 600 - later * 100 + (1 - a) * 30;
        if (y < 150) return null;
        const av = m.who === "K.B" ? <Avatar size={58} kb /> : m.who === "You" ? <Avatar size={58} text="You" bg={C.cyan} /> : <Avatar size={58} text={m.who} bg={TEAM[0].bg} />;
        return (
          <div key={i} style={{ position: "absolute", left: 350, top: y, opacity: Math.min(1, a * 1.5) * Math.min(1, (y - 150) / 40), display: "flex", gap: 18 }}>
            {av}
            <div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}><span style={txt(22, 700)}>{m.who}</span><span style={txt(18, 600, C.muted)}>now</span></div>
              <div style={{ marginTop: 6, ...txt(27, 600, m.who === "K.B" ? C.navy : C.ink) }}>{m.t}</div>
            </div>
          </div>
        );
      })}
    </>
  );
};
export const Team: React.FC<{ g: number }> = ({ g }) => {
  const W = trk(g, [["team", 960, 1580, 1], ["team+0.65", 960, 560, 1, IN], ["launch", 960, 560, 1], ["launch+0.5", 960, 1000, 0, OUT]]);
  if (W[2] <= 0) return null;
  return (
    <Box x={W[0]} y={W[1]} w={1440} h={820} o={W[2]} s={1 + 0.03 * k(g, "team+0.65", 4.2, EASE.steady)}>
      <Win w={1440} h={820} logo={false} title={<BarTitle g={g} text="" at="team+0.3"><Icon name="chat" size={30} color={C.white} />Team channel</BarTitle>}><Channel g={g} /></Win>
    </Box>
  );
};

// ---- launch ------------------------------------------------------------------------------------------------------------
export const Launch: React.FC<{ g: number }> = ({ g }) => {
  const L = trk(g, [["launch", 960, 1400, 1, 1], ["launch+0.6", 960, 560, 1, 1, IN], ["stay", 960, 560, 1, 1], ["stay+0.55", 1480, 230, 0.32, 0, MOVE]]);
  if (L[3] <= 0) return null;
  const live = k(g, "live", 0.3);
  const cur = trk(g, [["launch+0.2", 1300, 900, 0], ["live-0.06", 990, 636, 1, MOVE], ["live+0.5", 1040, 700, 1], ["stay", 1040, 700, 0]]);
  return (
    <>
      <Box x={L[0]} y={L[1]} w={660} h={330} s={L[2]} o={L[3]}>
        <div style={{ position: "absolute", inset: 0, borderRadius: 26, background: C.white, boxShadow: SHADOW.card }} />
        <div style={{ position: "absolute", left: 40, top: 40 }}><IconBox name="rocket" size={76} bg={mix(U.tint, C.cyanSoft, live)} /></div>
        <div style={{ position: "absolute", left: 140, top: 46, ...txt(34, 800) }}>Your system</div>
        <div style={{ position: "absolute", left: 140, top: 92, ...txt(24, 600, C.muted) }}>{live > 0.5 ? "Launched" : "Ready to launch"}</div>
        <div style={{ position: "absolute", left: 40, top: 196, width: 580, height: 92, borderRadius: 18, background: mix(C.navy, U.okSoft, live), display: "flex", alignItems: "center", justifyContent: "center", gap: 14,
          transform: `scale(${1 - press(g, "live") * 0.03})` }}>
          {live > 0.5 && <div style={{ width: 18, height: 18, borderRadius: 9, background: C.ok, opacity: live }} />}
          <span style={txt(32, 700, live > 0.5 ? U.okInk : C.white)}>{live > 0.5 ? "Live" : "Go live"}</span>
        </div>
      </Box>
      {cur[2] > 0 && <div style={{ position: "absolute", left: cur[0], top: cur[1], opacity: cur[2] }}><Cursor press={press(g, "live")} ring={ripple(g, "live")} /></div>}
    </>
  );
};

// ---- the monthly plan ---------------------------------------------------------------------------------------------------
const CW = 1320 / 7, ROW = 110;
const MONTHS = [{ start: 2, days: 30, chip: 18, at: "feat" }, { start: 4, days: 31, chip: 12, at: "month2+0.42" }, { start: 0, days: 30, chip: 24, at: "month3+0.36" }];
const Grid: React.FC<{ g: number; m: number; fill: boolean }> = ({ g, m, fill }) => {
  const M = MONTHS[m];
  const host = (r: number) => (fill ? 1 : k(g, off("hosting", 0.06 * r), 0.45, MOVE)), main = (r: number) => (fill ? 1 : k(g, off("maint", 0.06 * r), 0.45, MOVE));
  const cell = (d: number) => { const n = d + M.start - 1; return { r: Math.floor(n / 7), c: n % 7 }; };
  const chip = k(g, M.at, 0.5, IN), cp = cell(M.chip);
  return (
    <>
      {Array.from({ length: 35 }, (_, n) => {
        const d = n - M.start + 1, inMonth = d >= 1 && d <= M.days;
        return (
          <div key={n} style={{ position: "absolute", left: 60 + (n % 7) * CW + 3, top: 140 + Math.floor(n / 7) * ROW, width: CW - 6, height: ROW - 6, borderRadius: 12,
            background: inMonth ? C.white : U.tint, border: `1.5px solid ${U.skel}`, boxSizing: "border-box" }}>
            {inMonth && <div style={{ position: "absolute", left: 14, top: 8, ...txt(20, 600, C.muted) }}>{d}</div>}
          </div>
        );
      })}
      {[0, 1, 2, 3, 4].map((r) => (
        <React.Fragment key={r}>
          <div style={{ position: "absolute", left: 66, top: 140 + r * ROW + 38, width: 1308, height: 28, borderRadius: 8, background: C.navy, transform: `scaleX(${host(r)})`, transformOrigin: "0 50%",
            display: "flex", alignItems: "center", paddingLeft: 14, ...txt(18, 700, C.white) }}>{r === 0 && <><Icon name="server" size={18} color={C.white} width={2.4} style={{ marginRight: 8 }} />Hosting</>}</div>
          <div style={{ position: "absolute", left: 66, top: 140 + r * ROW + 70, width: 1308, height: 28, borderRadius: 8, background: C.cyan, transform: `scaleX(${main(r)})`, transformOrigin: "0 50%",
            display: "flex", alignItems: "center", paddingLeft: 14, ...txt(18, 700, C.navy) }}>{r === 0 && <><Icon name="wrench" size={18} color={C.navy} width={2.4} style={{ marginRight: 8 }} />Maintenance</>}</div>
        </React.Fragment>
      ))}
      {chip > 0 && (
        <div style={{ position: "absolute", left: 60 + cp.c * CW + CW / 2 - 102, top: 140 + cp.r * ROW + 10, width: 204, height: 48, opacity: Math.min(1, chip * 2), transform: `translateY(${(1 - chip) * -200}px)`, zIndex: 3 }}>
          <Pill bg={C.white} color={C.navy} size={20} icon="sparkle" style={{ border: `3px solid ${C.cyan}`, boxShadow: SHADOW.tile, height: 48, boxSizing: "border-box" }}>New feature</Pill>
        </div>
      )}
    </>
  );
};
const Calendar: React.FC<{ g: number }> = ({ g }) => {
  const t2 = k(g, "month2", 0.55, MOVE), t3 = k(g, "month3", 0.55, MOVE);
  const shipped = [k(g, "feat+0.3", 0.3), k(g, "month2+0.72", 0.3), k(g, "month3+0.66", 0.3)];
  const n = shipped.filter((v) => v > 0.5).length;
  const mo = (i: number) => { const inn = i === 0 ? 1 : i === 1 ? t2 : t3, out = i === 0 ? t2 : i === 1 ? t3 : 0; return { x: (1 - inn) * 420 - out * 420, o: Math.min(inn, 1 - out) }; };
  return (
    <>
      <div style={{ position: "absolute", left: 60, top: 30, height: 46, overflow: "hidden" }}>
        <div style={{ transform: `translateY(${-(t2 + t3) * 46}px)` }}>
          {["Month 1", "Month 2", "Month 3"].map((m) => <div key={m} style={{ height: 46, ...txt(36, 800) }}>{m}</div>)}
        </div>
      </div>
      <div style={{ position: "absolute", right: 60, top: 30, display: "flex", alignItems: "center", gap: 16 }}>
        <span style={txt(22, 600, C.muted)}>Features shipped</span>
        <span style={{ ...txt(40, 800), minWidth: 30 }}>{n}</span>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 44 }}>
          {shipped.map((v, i) => <div key={i} style={{ width: 14, height: 4 + (14 + 12 * i) * v, borderRadius: 4, background: v > 0 ? C.cyan : U.skel }} />)}
        </div>
      </div>
      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d, c) => <div key={d} style={{ position: "absolute", left: 60 + c * CW + 14, top: 104, ...txt(19, 700, C.muted) }}>{d}</div>)}
      {[0, 1, 2].map((i) => { const m = mo(i); return m.o > 0 && (
        <div key={i} style={{ position: "absolute", left: 0, top: 0, width: 1440, height: 704, opacity: m.o, transform: `translateX(${m.x}px)` }}><Grid g={g} m={i} fill={i > 0} /></div>
      ); })}
    </>
  );
};
export const Plan: React.FC<{ g: number }> = ({ g }) => {
  const W = trk(g, [["stay", 960, 1580, 1], ["stay+0.65", 960, 560, 1, IN], ["loop", 960, 560, 1], ["loop+0.45", 960, 1000, 0, OUT]]);
  if (W[2] <= 0) return null;
  const live = k(g, "stay+0.42", 0.3);
  return (
    <Box x={W[0]} y={W[1]} w={1440} h={820} o={W[2]} s={1 + 0.035 * k(g, "stay+0.65", 5.4, EASE.steady)}>
      <Win w={1440} h={820} title={<BarTitle g={g} text="" at="stay+0.3"><Icon name="calendar" size={30} color={C.white} />Monthly plan</BarTitle>}
        right={<div style={{ opacity: live, transform: `scale(${0.7 + 0.3 * live})` }}><Pill bg={U.okSoft} color={U.okInk} size={20} dot={C.ok}>Live</Pill></div>}>
        <Calendar g={g} />
      </Win>
    </Box>
  );
};

// ---- the loop --------------------------------------------------------------------------------------------------------
const LP = { cx: 960, cy: 560, a: 560, b: 700 };
const lp = (t: number) => { const s = Math.sin(t), c = Math.cos(t), d = 1 + s * s; return { x: LP.cx + (LP.a * c) / d, y: LP.cy + (LP.b * s * c) / d }; };
// from the right end round the lower right lobe, through the crossing, round the left lobe and back
const LOOP_D = Array.from({ length: 241 }, (_, i) => { const p = lp((i / 240) * Math.PI * 2); return `${i ? "L" : "M"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`; }).join(" ") + "Z";
const STATIONS = [
  { n: "Diagnose", i: "search", t: Math.PI, at: "w:diagnose", lx: -100, ly: 0, align: "right" as const },
  { n: "Build", i: "code", t: Math.PI / 2, at: "w:build3", lx: 0, ly: -148, align: "center" as const },
  { n: "Run", i: "play", t: 0, at: "w:run2", lx: 100, ly: 0, align: "left" as const },
];
const phaseAt = (g: number) => {
  const f0 = T.f("one"), fl = T.f("lift");
  let p = 0;
  for (let f = f0; f < g; f++) { const u = Math.min(1, Math.max(0, (f - fl) / 24)); p += (1.0 + 0.9 * u * u * (3 - 2 * u)) / 30; }
  return p;
};
export const Loop: React.FC<{ g: number }> = ({ g }) => {
  const draw = k(g, "loop+0.08", 1.0, EASE.steady), dash = k(g, "loop+0.9", 0.4);
  const lift = k(g, "lift", 1.4, EASE.soft), gather = k(g, "talk", 0.6, MOVE);
  const all = k(g, "one", 0.35);
  const ph = g >= T.f("one") ? phaseAt(g) : 0;
  const grow = (() => { const t = (g - T.f("w:growth")) / 18; return t <= 0 || t >= 1 ? 0 : t; })();
  const s = (1 + 0.05 * lift) * (1 - 0.82 * gather), ty = -36 * lift + (470 - 560 + 36) * gather;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, opacity: 1 - k(g, "talk+0.25", 0.35), transform: `translateY(${ty}px) scale(${s})`, transformOrigin: "960px 560px" }}>
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
        <path d={LOOP_D} fill="none" stroke={C.navy} strokeWidth={70} strokeLinejoin="round" pathLength={1} strokeDasharray={`${draw} 1`} />
        {dash > 0 && <path d={LOOP_D} fill="none" stroke={C.white} strokeWidth={5} strokeDasharray="18 26" opacity={0.7 * dash} />}
        {all > 0 && Array.from({ length: 10 }, (_, j) => {
          const p = lp(-ph * 1.0 + (j * Math.PI * 2) / 10);
          return <circle key={j} cx={p.x} cy={p.y} r={13} fill={C.cyan} stroke={C.white} strokeWidth={5} opacity={k(g, off("one", 0.04 * j), 0.3)} />;
        })}
      </svg>
      {STATIONS.map((st, i) => {
        const p = lp(st.t), a = k(g, off(st.at, -0.1), 0.45);
        if (a <= 0) return null;
        const next = STATIONS[i + 1] ? k(g, off(STATIONS[i + 1].at, -0.1), 0.3) : 0;
        const lit = Math.max(Math.min(a, 1 - next), all);
        return (
          <React.Fragment key={i}>
            <Box x={p.x} y={p.y} w={150} h={150} s={0.6 + 0.4 * a} o={Math.min(1, a * 1.6)}
              style={{ borderRadius: "50%", background: mix("#FFFFFF", C.cyan, lit), border: `7px solid ${C.navy}`, boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: SHADOW.tile }}>
              <Icon name={st.i} size={64} color={C.navy} width={2.4} />
            </Box>
            {grow > 0 && <Box x={p.x} y={p.y} w={150} h={150} s={1 + 0.6 * grow} o={1 - grow} style={{ borderRadius: "50%", border: `5px solid ${C.cyan}`, boxSizing: "border-box" }} />}
            <div style={{ position: "absolute", top: p.y + st.ly - 26, left: st.align === "right" ? undefined : st.align === "center" ? p.x - 200 : p.x + st.lx,
              right: st.align === "right" ? 1920 - (p.x + st.lx) : undefined, width: st.align === "center" ? 400 : undefined, textAlign: st.align,
              opacity: Math.min(1, a * 1.5), transform: `translateY(${(1 - a) * 20}px)`, ...txt(44, 800) }}>{st.n}</div>
          </React.Fragment>
        );
      })}
    </div>
  );
};

// ---- the end card -----------------------------------------------------------------------------------------------------
export const End: React.FC<{ g: number }> = ({ g }) => {
  const a = k(g, "talk+0.12", 0.7), b = k(g, "cta", 0.55);
  return (
    <>
      <Box x={960} y={450} w={300} h={300} s={0.3 + 0.7 * a} o={Math.min(1, a * 2)}><KBTile size={300} /></Box>
      {b > 0 && (
        <div style={{ position: "absolute", left: 0, top: 690, width: 1920, display: "flex", justifyContent: "center", opacity: Math.min(1, b * 1.6), transform: `translateY(${(1 - b) * 40}px)` }}>
          <div style={{ height: 108, padding: "0 60px", borderRadius: 54, background: C.navy, display: "flex", alignItems: "center", ...txt(42, 700, C.white), boxShadow: SHADOW.tile }}>Book a Free Discovery Call</div>
        </div>
      )}
    </>
  );
};
