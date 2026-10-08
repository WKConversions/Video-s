// Act 4 (37.9–58.0 s): the team channel (K.B joins the row of the team's initials and posts what it is doing);
// launch (Go live → Live); the monthly plan (hosting and maintenance every week, a new feature every month);
// the loop Diagnose → Build → Run; the loop gathers into the K.B logo; "Book a Free Discovery Call".
import React from "react";
import { T } from "./clock";
import { EASE, Line, centred, off } from "./kinetic";
import { ARRIVE, C, KBTile, MOVE, SHADOW, lerp } from "./lib";
import { IN, OUT } from "./a1";
import { Avatar, BarTitle, Box, Cursor, Icon, IconBox, Pill, U, Win, mix, press, ripple, trk, txt } from "./ui";

const k = (g: number, pos: string | number, dur: number, ease = ARRIVE) => T.k(g, pos, dur, ease);

// ---- the team channel -----------------------------------------------------------------------------------------------
const TEAM = [{ t: "AM", bg: C.cyanSoft }, { t: "JS", bg: "#E3E8EF" }, { t: "RK", bg: "#DCE6F2" }, { t: "LT", bg: U.tint }];
const MSGS = [
  { who: "AM", t: "Morning, team!", at: "team+0.6" },
  { who: "You", t: "How's it going?", at: "ask" },
  { who: "K.B", t: "The intake form is live.", at: "always" },
  { who: "K.B", t: "CRM sync: testing today.", at: "w:know-0.08" },
  { who: "K.B", t: "Next: follow-up emails.", at: "w:doing2-0.12" },
];
const slotX = (s: number) => 350 + s * 124;
const Channel: React.FC<{ g: number }> = ({ g }) => {
  // the team makes room, then K.B takes the seat; the count changes as it lands
  const room = k(g, "inside-0.12", 0.42, MOVE), join = k(g, "inside+0.16", 0.45), count = k(g, "inside+0.5", 0.35, MOVE);
  const ring = k(g, "around", 0.5, MOVE), burst = Math.min(1, Math.max(0, (g - T.f("inside+0.3")) / 15));
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
      {TEAM.map((m, i) => <div key={i} style={{ position: "absolute", left: slotX(i < 2 ? i : lerp(i, i + 1, room)), top: 26 }}><Avatar size={104} text={m.t} bg={m.bg} /></div>)}
      {join > 0 && (
        <div style={{ position: "absolute", left: slotX(2), top: 26, opacity: Math.min(1, join * 2), transform: `scale(${0.4 + 0.6 * join})` }}>
          <Avatar size={104} kb />
          {burst > 0 && burst < 1 && <div style={{ position: "absolute", left: -20 - 30 * burst, top: -20 - 30 * burst, width: 144 + 60 * burst, height: 144 + 60 * burst, borderRadius: 40, border: `4px solid ${C.cyan}`, opacity: 1 - burst, boxSizing: "border-box" }} />}
          {ring > 0 && <svg width={144} height={144} style={{ position: "absolute", left: -20, top: -20 }}><rect x={4} y={4} width={136} height={136} rx={36} fill="none" stroke={C.cyan} strokeWidth={5} pathLength={1} strokeDasharray={`${ring} 1`} /></svg>}
        </div>
      )}
      <div style={{ position: "absolute", left: slotX(5) + 20, top: 60, height: 36, overflow: "hidden" }}>
        <div style={{ transform: `translateY(${-count * 36}px)` }}>
          <div style={{ height: 36, ...txt(28, 600, C.muted) }}>4 members</div>
          <div style={{ height: 36, ...txt(28, 700, C.navy) }}>5 members</div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 300, top: 158, width: 1140, height: 2, background: U.skel }} />
      {/* messages fill the channel from the top */}
      {MSGS.map((m, i) => {
        const a = k(g, m.at, 0.45);
        if (a <= 0) return null;
        const av = m.who === "K.B" ? <Avatar size={60} kb /> : m.who === "You" ? <Avatar size={60} text="You" bg={C.cyan} /> : <Avatar size={60} text={m.who} bg={TEAM[0].bg} />;
        return (
          <div key={i} style={{ position: "absolute", left: 340, top: 182 + i * 102, opacity: Math.min(1, a * 1.5), transform: `translateY(${(1 - a) * 24}px)`, display: "flex", gap: 16, alignItems: "flex-start" }}>
            {av}
            <div style={{ background: C.white, border: `2px solid ${m.who === "K.B" ? C.cyan : U.skel}`, borderRadius: "6px 20px 20px 20px", padding: "10px 22px 12px", boxShadow: "0 8px 20px -16px rgba(41,58,81,0.35)" }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}><span style={txt(21, 700)}>{m.who}</span><span style={txt(18, 600, C.muted)}>now</span></div>
              <div style={{ marginTop: 4, ...txt(28, 600, C.navy) }}>{m.t}</div>
            </div>
          </div>
        );
      })}
    </>
  );
};
export const Team: React.FC<{ g: number }> = ({ g }) => {
  const W = trk(g, [["team", 960, 980, 0], ["team+0.8", 960, 560, 1, IN], ["launch", 960, 560, 1], ["launch+0.35", 960, 860, 0, OUT]]);
  if (W[2] <= 0) return null;
  return (
    <Box x={W[0]} y={W[1]} w={1440} h={820} o={W[2]} s={0.97 * (1 + 0.08 * k(g, "team+0.8", 4.0, EASE.steady))}>
      <Win w={1440} h={820} logo={false} title={<BarTitle g={g} text="" at="team+0.3"><Icon name="chat" size={30} color={C.white} />Team channel</BarTitle>}><Channel g={g} /></Win>
    </Box>
  );
};

// ---- launch ------------------------------------------------------------------------------------------------------------
export const Launch: React.FC<{ g: number }> = ({ g }) => {
  const L = trk(g, [["launch", 960, 900, 0], ["launch+0.7", 960, 560, 1, IN], ["stay", 960, 560, 1], ["stay+0.3", 960, 440, 0, OUT]]);
  if (L[2] <= 0) return null;
  const live = k(g, "live", 0.3), pulse = Math.min(1, Math.max(0, (g - T.f("live+0.05")) / 18));
  const cur = trk(g, [["launch+0.2", 1300, 900, 0], ["live-0.06", 985, 668, 1, MOVE], ["live+0.5", 1030, 720, 1], ["stay", 1030, 720, 0]]);
  return (
    <>
      <Box x={L[0]} y={L[1]} w={660} h={330} s={1.3} o={L[2]}>
        <div style={{ position: "absolute", inset: 0, borderRadius: 26, background: C.white, boxShadow: SHADOW.card }} />
        <div style={{ position: "absolute", left: 40, top: 40 }}><IconBox name="rocket" size={76} bg={mix(U.tint, C.cyanSoft, live)} /></div>
        <div style={{ position: "absolute", left: 140, top: 46, ...txt(34, 800) }}>Your system</div>
        <div style={{ position: "absolute", left: 140, top: 92, ...txt(24, 600, C.muted) }}>{live > 0.5 ? "Launched" : "Ready to launch"}</div>
        {pulse > 0 && pulse < 1 && <div style={{ position: "absolute", left: 40 - 24 * pulse, top: 196 - 24 * pulse, width: 580 + 48 * pulse, height: 92 + 48 * pulse, borderRadius: 18 + 24 * pulse, border: `4px solid ${C.cyan}`, opacity: 1 - pulse, boxSizing: "border-box" }} />}
        <div style={{ position: "absolute", left: 40, top: 196, width: 580, height: 92, borderRadius: 18, background: C.navy, display: "flex", alignItems: "center", justifyContent: "center", gap: 14,
          transform: `scale(${1 - press(g, "live") * 0.03})` }}>
          {live > 0.5 && <div style={{ width: 20, height: 20, borderRadius: 10, background: C.cyan, opacity: live }} />}
          <span style={txt(32, 700, C.white)}>{live > 0.5 ? "Live" : "Go live"}</span>
        </div>
      </Box>
      {cur[2] > 0 && <div style={{ position: "absolute", left: cur[0], top: cur[1], opacity: cur[2] }}><Cursor press={press(g, "live")} ring={ripple(g, "live")} /></div>}
    </>
  );
};

// ---- the monthly plan ---------------------------------------------------------------------------------------------------
const CW = 1320 / 7, ROW = 110;
const MONTHS = [{ start: 2, days: 30, chip: 18, at: "feat" }, { start: 4, days: 31, chip: 12, at: "month2+0.45" }, { start: 0, days: 30, chip: 24, at: "month3+0.4" }];
const HOST = "#B4C0CE";
const Grid: React.FC<{ g: number; m: number; fill: boolean }> = ({ g, m, fill }) => {
  const M = MONTHS[m];
  const host = (r: number) => (fill ? 1 : k(g, off("hosting", 0.06 * r), 0.45, MOVE)), main = (r: number) => (fill ? 1 : k(g, off("maint", 0.06 * r), 0.45, MOVE));
  const cell = (d: number) => { const n = d + M.start - 1; return { r: Math.floor(n / 7), c: n % 7 }; };
  const chip = k(g, M.at, 0.45), cp = cell(M.chip), hi = k(g, off(M.at, 0.3), 0.3);
  return (
    <>
      {Array.from({ length: 35 }, (_, n) => {
        const d = n - M.start + 1, inMonth = d >= 1 && d <= M.days, isChip = d === M.chip;
        return (
          <div key={n} style={{ position: "absolute", left: 60 + (n % 7) * CW + 3, top: 140 + Math.floor(n / 7) * ROW, width: CW - 6, height: ROW - 6, borderRadius: 12,
            background: !inMonth ? U.tint : isChip ? mix("#FFFFFF", C.cyanSoft, hi) : C.white, border: `${isChip && hi > 0 ? 3 : 1.5}px solid ${isChip ? mix(U.skel, C.cyan, hi) : U.skel}`, boxSizing: "border-box" }}>
            {inMonth && <div style={{ position: "absolute", left: 14, top: 8, ...txt(22, 700, C.muted) }}>{d}</div>}
          </div>
        );
      })}
      {[0, 1, 2, 3, 4].map((r) => (
        <React.Fragment key={r}>
          <div style={{ position: "absolute", left: 70, top: 140 + r * ROW + 50, width: 1300, height: 14, borderRadius: 7, background: HOST, transform: `scaleX(${host(r)})`, transformOrigin: "0 50%" }} />
          <div style={{ position: "absolute", left: 70, top: 140 + r * ROW + 72, width: 1300, height: 14, borderRadius: 7, background: C.cyan, transform: `scaleX(${main(r)})`, transformOrigin: "0 50%" }} />
        </React.Fragment>
      ))}
      {chip > 0 && (
        <div style={{ position: "absolute", left: 60 + cp.c * CW + 9, top: 140 + cp.r * ROW + 52, width: CW - 18, height: 44, opacity: Math.min(1, chip * 2), transform: `translateY(${(1 - chip) * -120}px)`, zIndex: 3,
          borderRadius: 22, background: C.white, border: `3px solid ${C.cyan}`, boxShadow: SHADOW.tile, boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, ...txt(19, 700) }}>
          <Icon name="sparkle" size={20} color={C.navy} width={2.4} />New feature
        </div>
      )}
    </>
  );
};
const Calendar: React.FC<{ g: number }> = ({ g }) => {
  const o2 = k(g, "month2", 0.22, OUT), i2 = k(g, "month2+0.18", 0.42), o3 = k(g, "month3", 0.22, OUT), i3 = k(g, "month3+0.18", 0.42);
  const t2 = k(g, "month2", 0.5, MOVE), t3 = k(g, "month3", 0.5, MOVE);
  const shipped = [k(g, "feat+0.3", 0.3), k(g, "month2+0.75", 0.3), k(g, "month3+0.7", 0.3)];
  const n = shipped.filter((v) => v > 0.5).length;
  // the old month leaves before the new one comes in (no doubled grid)
  const mo = [{ x: -260 * o2, o: 1 - o2 }, { x: 260 * (1 - i2) - 260 * o3, o: Math.min(i2, 1 - o3) }, { x: 260 * (1 - i3), o: i3 }];
  const call = k(g, "w:stay", 0.45), hostL = k(g, "hosting", 0.35), mainL = k(g, "maint", 0.35);
  return (
    <>
      <div style={{ position: "absolute", left: 60, top: 26, height: 46, overflow: "hidden" }}>
        <div style={{ transform: `translateY(${-(t2 + t3) * 46}px)` }}>
          {["Month 1", "Month 2", "Month 3"].map((m) => <div key={m} style={{ height: 46, ...txt(38, 800) }}>{m}</div>)}
        </div>
      </div>
      <div style={{ position: "absolute", left: 270, top: 24, opacity: call, transform: `translateY(${(1 - call) * -16}px)`, display: "flex", alignItems: "center", gap: 10, height: 50, padding: "0 18px 0 7px", borderRadius: 25, background: C.cyanSoft }}>
        <Avatar size={38} kb /><span style={txt(22, 700)}>K.B · on call</span>
      </div>
      <div style={{ position: "absolute", left: 560, top: 34, display: "flex", gap: 22 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, opacity: hostL }}><div style={{ width: 30, height: 14, borderRadius: 7, background: HOST }} /><span style={txt(22, 700)}>Hosting</span></div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, opacity: mainL }}><div style={{ width: 30, height: 14, borderRadius: 7, background: C.cyan }} /><span style={txt(22, 700)}>Maintenance</span></div>
      </div>
      <div style={{ position: "absolute", right: 60, top: 24, display: "flex", alignItems: "center", gap: 16 }}>
        <span style={txt(22, 600, C.muted)}>Features shipped</span>
        <span style={{ ...txt(40, 800), minWidth: 30 }}>{n}</span>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 44 }}>
          {shipped.map((v, i) => <div key={i} style={{ width: 14, height: 4 + (14 + 12 * i) * v, borderRadius: 4, background: v > 0 ? C.cyan : U.skel }} />)}
        </div>
      </div>
      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d, c) => <div key={d} style={{ position: "absolute", left: 60 + c * CW + 14, top: 104, ...txt(20, 700, C.muted) }}>{d}</div>)}
      {mo.map((m, i) => m.o > 0 && (
        <div key={i} style={{ position: "absolute", left: 0, top: 0, width: 1440, height: 704, opacity: m.o, transform: `translateX(${m.x}px)` }}><Grid g={g} m={i} fill={i > 0} /></div>
      ))}
    </>
  );
};
export const Plan: React.FC<{ g: number }> = ({ g }) => {
  const W = trk(g, [["stay+0.15", 960, 980, 0], ["stay+0.9", 960, 560, 1, IN], ["loop-0.18", 960, 560, 1], ["loop+0.12", 960, 860, 0, OUT]]);
  if (W[2] <= 0 || g < T.f("stay+0.15")) return null;
  return (
    <Box x={W[0]} y={W[1]} w={1440} h={820} o={W[2]} s={0.97 * (1 + 0.08 * k(g, "stay+0.9", 5.0, EASE.steady))}>
      <Win w={1440} h={820} title={<BarTitle g={g} text="" at="stay+0.4"><Icon name="calendar" size={30} color={C.white} />Monthly plan</BarTitle>}
        right={<div style={{ opacity: k(g, "stay+0.6", 0.3) }}><Pill bg={C.white} color={C.navy} size={20} dot={C.cyan}>Live</Pill></div>}>
        <Calendar g={g} />
      </Win>
    </Box>
  );
};

// ---- the loop --------------------------------------------------------------------------------------------------------
const LP = { cx: 960, cy: 560, a: 560, b: 700 };
const lp = (t: number) => { const s = Math.sin(t), c = Math.cos(t), d = 1 + s * s; return { x: LP.cx + (LP.a * c) / d, y: LP.cy + (LP.b * s * c) / d }; };
// from the right end round the lower right lobe, through the crossing, round the left lobe and back
// drawn from Diagnose (the left end) through the crossing, round the right lobe and back, so the road reaches each
// station before it is named
const LOOP_D = Array.from({ length: 241 }, (_, i) => { const p = lp(Math.PI + (i / 240) * Math.PI * 2); return `${i ? "L" : "M"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`; }).join(" ") + "Z";
const STATIONS = [
  { n: "Diagnose", i: "search", t: Math.PI, at: "w:diagnose", lx: -95, ly: 0, align: "right" as const },
  { n: "Build", i: "code", t: Math.PI / 2, at: "w:build3", lx: 0, ly: -198, align: "center" as const },
  { n: "Run", i: "play", t: 0, at: "w:run2", lx: 95, ly: 0, align: "left" as const },
];
const phaseAt = (g: number) => {
  const f0 = T.f("loop+1.6"), fl = T.f("lift");
  let p = 0;
  for (let f = f0; f < g; f++) { const u = Math.min(1, Math.max(0, (f - fl) / 24)); p += (1.2 + 1.0 * u * u * (3 - 2 * u)) / 30; }
  return p;
};
export const Loop: React.FC<{ g: number }> = ({ g }) => {
  // the loop draws on a clear canvas (the plan has gone), grows only a little (labels keep their margin), and fades
  // out before the logo comes in
  const draw = k(g, "loop+0.15", 1.5, EASE.steady), dash = k(g, "loop+1.5", 0.4);
  const lift = k(g, "lift", 1.4, EASE.soft), gone = k(g, "talk-0.24", 0.35, MOVE), labels = 1 - k(g, "talk-0.3", 0.25);
  // the stations all light on "one loop"; the dots start running as soon as the road has closed
  const all = k(g, "one", 0.35), run = k(g, "loop+1.6", 0.35);
  const ph = g >= T.f("loop+1.6") ? phaseAt(g) : 0;
  const grow = (() => { const t = (g - T.f("w:growth")) / 18; return t <= 0 || t >= 1 ? 0 : t; })();
  const s = (1 + 0.015 * k(g, "loop+0.5", 3.4, EASE.steady) + 0.015 * lift) * (1 - 0.06 * gone), ty = -30 * lift;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, opacity: 1 - gone, transform: `translateY(${ty}px) scale(${s})`, transformOrigin: "960px 560px" }}>
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
        <path d={LOOP_D} fill="none" stroke={C.navy} strokeWidth={70} strokeLinejoin="round" pathLength={1} strokeDasharray={`${draw} 1`} />
        {dash > 0 && <path d={LOOP_D} fill="none" stroke={C.white} strokeWidth={5} strokeDasharray="18 26" strokeDashoffset={3 * (g - T.f("loop+0.9")) + 1.6 * Math.max(0, g - T.f("lift"))} opacity={0.7 * dash} />}
        {run > 0 && Array.from({ length: 14 }, (_, j) => {
          const p = lp(-ph * 1.0 + (j * Math.PI * 2) / 14);
          return <circle key={j} cx={p.x} cy={p.y} r={17} fill={C.cyan} stroke={C.white} strokeWidth={6} opacity={k(g, off("loop+1.6", 0.03 * j), 0.3)} />;
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
              opacity: Math.min(1, a * 1.5) * labels, transform: `translateY(${(1 - a) * 20}px)`, ...txt(44, 800) }}>{st.n}</div>
          </React.Fragment>
        );
      })}
    </div>
  );
};

// ---- the end card -----------------------------------------------------------------------------------------------------
export const End: React.FC<{ g: number }> = ({ g }) => {
  const a = k(g, "talk+0.1", 0.45), b = k(g, "w:kb2-0.1", 0.5);
  const words = [{ t: "Talk", at: "w:talk" }, { t: "to", at: "w:to3" }, { t: "K.B.", at: "w:kb2" }];
  return (
    <>
      <Box x={960} y={330} w={220} h={220} s={0.85 + 0.15 * a} o={a}><KBTile size={220} /></Box>
      <Line g={g} words={words} x={centred(words, 84, 960, 800)} y={500} size={84} weight={800} color={C.navy} ls={-0.02} />
      {b > 0 && (
        <div style={{ position: "absolute", left: 0, top: 690, width: 1920, display: "flex", justifyContent: "center", opacity: Math.min(1, b * 1.6), transform: `translateY(${(1 - b) * 36}px)` }}>
          <div style={{ height: 104, padding: "0 58px", borderRadius: 52, background: C.cyan, display: "flex", alignItems: "center", ...txt(40, 800, C.navy), boxShadow: SHADOW.tile }}>Book a Free Discovery Call</div>
        </div>
      )}
    </>
  );
};
