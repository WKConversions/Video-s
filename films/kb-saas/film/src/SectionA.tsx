// 01–08: one business, countless tools, hundreds of tasks; the question typed and sent; the send tile becomes K.B;
// the tile becomes the site's nav pill, "K.B Tech Partner".
import React from "react";
import { OffthreadVideo, Sequence, staticFile } from "remotion";
import { C, F, MOVE, W, at, clamp01, expoOut, lerp, mix, pr, press, px, pxi, rgba, tip } from "./lib";
import { Composer, KBMark, TaskPill, WordLine, tw } from "./parts";
import { Cursor } from "./ui";
import { Icon } from "./icons";

// ---- the hook --------------------------------------------------------------------------------------------------
const ROLL = ["Email", "CRM", "Spreadsheets", "Invoices", "Calendar", "Chat", "Forms", "Support desk", "Bookings", "Files", "tools."];
const PITCH = 150;

const Hook: React.FC<{ g: number }> = ({ g }) => {
  const up = pr(g, W("w:business", 0.62), 14, expoOut(14, 0.8));          // line 1 makes room in the pause
  const out = pxi(g, W("w:tools", 0.5), 9, 0.75);                         // both lines leave in the next pause
  if (out >= 1) return null;
  const oy = -900 * out;
  // the slot: rolls at constant speed from "Countless", lands on "tools."
  const g0 = W("w:countless", -0.05), g1 = W("w:tools", -0.45), v = 0.36;
  const p1 = v * (g1 - g0);
  const N = ROLL.length - 1, d = N - p1;
  const pos = g < g0 ? 0 : g < g1 ? v * (g - g0) : p1 + d * expoOut(8, 0.72)(clamp01((g - g1) / 8));
  const landed = g >= g1 + 8;
  const size2 = 120;
  const X0 = 210;
  const slotX = X0 + tw("Countless ", size2, 700);
  const y2 = 640;
  const shadow = "0 4px 30px rgba(20,30,45,0.35)";
  return (
    <div style={{ position: "absolute", inset: 0, transform: `translateY(${oy}px)`, textShadow: shadow }}>
      <div style={{ position: "absolute", inset: 0, transform: `translateY(${-150 * up}px) scale(${1 - 0.3 * up})`, transformOrigin: `${X0}px 520px` }}>
        <WordLine g={g} size={128} x={X0} y={520} align="left" color={mix("#FFFFFF", "#D9E2EC", up)}
          words={[{ t: "One", f: W("w:one", -0.07) }, { t: "business.", f: W("w:business", -0.07) }]} />
      </div>
      {g >= g0 && (
        <>
          <WordLine g={g} size={size2} x={X0} y={y2} align="left" color="#FFFFFF" words={[{ t: "Countless", f: g0 }]} />
          <div style={{ position: "absolute", left: slotX, top: y2 - PITCH * 1.6, height: PITCH * 3.2, width: 1100, overflow: "hidden",
            WebkitMaskImage: "linear-gradient(180deg, transparent 0%, #000 34%, #000 66%, transparent 100%)" }}>
            {ROLL.map((name, i) => {
              const dy = (i - pos) * PITCH;
              if (Math.abs(dy) > PITCH * 2) return null;
              const near = 1 - clamp01(Math.abs(dy) / PITCH);
              const last = i === N;
              const fade = landed && !last ? clamp01(1 - (g - g1 - 8) / 12) : 1;
              return (
                <div key={i} style={{ position: "absolute", left: 0, top: PITCH * 1.6 + dy - size2 * 0.62, fontFamily: F.ui, fontWeight: 700, fontSize: size2,
                  lineHeight: 1.24, whiteSpace: "nowrap", color: last && landed ? "#FFFFFF" : mix("#9FB0C4", "#E6EEF6", near), opacity: fade }}>{name}</div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

/** The business at work (Mixkit 42628, free licence): the real world before K.B, in a large window; it dims and blurs
 *  as the tasks pile up, and the white field out of the K.B tile covers it. */
const WIN = { x: 960, y: 540, w: 1720, h: 968 };
const OpeningFootage: React.FC<{ g: number }> = ({ g }) => {
  if (g > W("w:meet", 1.0)) return null;
  const dim = pr(g, W("w:hundreds", -0.2), 16, MOVE);
  const blur = pr(g, W("w:what", -0.5), 10);
  const push = 1 + 0.06 * clamp01(g / 250);
  return (
    <div style={{ position: "absolute", left: WIN.x - WIN.w / 2, top: WIN.y - WIN.h / 2, width: WIN.w, height: WIN.h, borderRadius: 48, overflow: "hidden",
      boxShadow: "0 50px 100px -50px rgba(41,58,81,0.5)" }}>
      <div style={{ position: "absolute", inset: 0, transform: `scale(${push})`, filter: `blur(${2 * dim + 8 * blur}px)` }}>
        <Sequence from={0} layout="none">
          <OffthreadVideo src={staticFile("footage/business-woman-on-call-while-working-42628.mp4")} muted
            style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </Sequence>
      </div>
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(90deg, ${rgba(C.navy, 0.72)} 0%, ${rgba(C.navy, 0.35)} 48%, ${rgba(C.navy, 0.05)} 75%)` }} />
      <div style={{ position: "absolute", inset: 0, background: rgba(C.navy, 0.5 * dim + 0.15 * blur) }} />
    </div>
  );
};

/** The white field out of the K.B tile, drawn over the opening (the Fields layer sits below the sections). */
const WhiteFromTile: React.FC<{ g: number }> = ({ g }) => {
  const a = W("w:meet", 0.0);
  if (g < a || g > a + 30) return null;
  const r = 1300 * clamp01((g - a) / 36) + 160;              // K.B's clean space grows around the tile, at a steady pace
  return <div style={{ position: "absolute", inset: 0, background: C.white, clipPath: `circle(${r}px at 960px 540px)` }} />;
};

// ---- the task feed ---------------------------------------------------------------------------------------------
const TASKS = ["Follow-ups", "CRM updates", "Payment confirmations", "Excel files", "Outreach", "Intake calls", "Approval flows", "Data routing",
  "Invoices", "Reporting", "Onboarding", "Scheduling"];
const TOOLS: [string, string][] = [["Email", "mail"], ["CRM", "crm"], ["Spreadsheets", "sheet"], ["Calendar", "calendar"], ["Invoices", "invoice"],
  ["Chat", "chat"], ["Forms", "form"], ["Support desk", "users"], ["Files", "folder"]];

const spawns = (() => {
  const out: number[] = [];
  let t = W("w:and", 0.12);
  const tasks = W("w:tasks", -0.1), conn = W("w:connecting", -0.1), q = W("w:what", -0.5), end = W("w:meet", 1.0);
  while (t < end) { out.push(t); t += t < tasks ? 8 : t < conn ? 4 : t < q ? 2 : 6; }
  return out;
})();

const ToolChip: React.FC<{ name: string; icon: string; ink: number }> = ({ name, icon, ink }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 14, height: 78, padding: "0 26px 0 20px", borderRadius: 22, background: C.white,
    border: `1.5px solid ${rgba(C.navy, 0.07)}`, boxShadow: "0 16px 30px -22px rgba(41,58,81,0.35)" }}>
    <Icon name={icon} size={38} color={mix("#B3BAC3", C.navy, ink)} stroke={2} />
    <span style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 32, color: mix("#B3BAC3", C.muted, ink), whiteSpace: "nowrap" }}>{name}</span>
  </div>
);

export const Feed: React.FC<{ g: number }> = ({ g }) => {
  if (g < spawns[0] || g > W("w:meet", 1.4)) return null;
  const PIT = 124, YS = 900;
  const born = spawns.filter((s) => s <= g);
  const e = born.map((s) => px(g, s, 10, 0.78));
  const tasksF = W("w:tasks", -0.1), connF = W("w:connecting", -0.1);
  const blur = pr(g, W("w:what", -0.5), 10);
  return (
    <div style={{ position: "absolute", inset: 0, filter: blur > 0 ? `blur(${12 * blur}px)` : undefined, opacity: 1 - 0.55 * blur }}>
      {born.map((s, k) => {
        let pushes = 0;
        for (let j = k + 1; j < born.length; j++) pushes += e[j];
        const y = YS + PIT * (1 - e[k]) - PIT * pushes;
        if (y < -80) return null;
        const age = born.length - 1 - k;
        const ink = clamp01(1 - age * 0.45);
        const top = clamp01((y - 40) / 220);
        const label = TASKS[k % TASKS.length];
        const lt = TOOLS[k % TOOLS.length], rt = TOOLS[(k * 4 + 3) % TOOLS.length];
        const chipOn = g >= Math.max(s, tasksF + Math.min(age, 6) * 0) ? (s >= tasksF ? 1 : g >= tasksF + (k % 4) * 2 ? 1 : 0) : 0;
        const lineStart = s >= connF ? s + 2 : connF + Math.max(0, 6 - age) * 2;
        const draw = clamp01((g - lineStart) / 8);
        const pw = tw(label, 46, 600) + 46 * 3.2;
        const L1 = 300 + 130, L2 = 960 - pw / 2, R1 = 960 + pw / 2, R2 = 1620 - 130;
        const lc = age === 0 ? C.navy : "#B8C0CA";
        return (
          <div key={k} style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 0, transform: `translateY(${y}px)`, opacity: top }}>
            {draw > 0 && (
              <svg style={{ position: "absolute", left: 0, top: -10, overflow: "visible" }} width={1920} height={20}>
                <line x1={L2} y1={10} x2={L2 - (L2 - L1) * draw} y2={10} stroke={lc} strokeWidth={3} strokeDasharray="10 9" />
                <line x1={R1} y1={10} x2={R1 + (R2 - R1) * draw} y2={10} stroke={lc} strokeWidth={3} strokeDasharray="10 9" />
              </svg>
            )}
            {chipOn > 0 && <div style={at(300, 0)}><ToolChip name={lt[0]} icon={lt[1]} ink={ink} /></div>}
            {chipOn > 0 && <div style={at(1620, 0)}><ToolChip name={rt[0]} icon={rt[1]} ink={ink} /></div>}
            <div style={at(960, 0)}><TaskPill label={label} size={46} ink={ink} /></div>
          </div>
        );
      })}
    </div>
  );
};

// ---- the question, the send, K.B -------------------------------------------------------------------------------
export const Q_TEXT = "What if everything just worked together?";
const CW = 1560, CH = 184, CY = 560, TS = CH * 0.62;
const TILE_X = 960 + CW / 2 - (CH - TS) / 2 - TS / 2;

const Question: React.FC<{ g: number }> = ({ g }) => {
  const a = W("w:what", -0.48);                       // rises in the pause before "What"
  const rel = W("w:together", 0.85);                  // the click's release (in the pause)
  const end = W("w:meet", 0.1);
  if (g < a || g > end + 2) return null;
  const rise = px(g, a, 18, 0.8);
  const ty0 = W("w:what", -0.06), ty1 = W("w:together", -0.4);
  const n = Q_TEXT.length * MOVE(clamp01((g - ty0) / (ty1 - ty0)));
  const send = g >= ty0 ? clamp01((g - ty0) / 3) : 0;
  const pz = press(g, rel - 6);
  // the collapse: the field closes onto its send tile, both ends converging on the frame centre
  const col = pr(g, rel, 11, MOVE);
  const w = lerp(CW, TS + 1, col);
  const textOut = g >= rel - 1;
  return (
    <>
      {col < 1 && (
        <div style={{ position: "absolute", left: lerp(960 - CW / 2, 960 - TS / 2, col), top: CY - CH / 2 + 700 * (1 - rise), width: w, height: CH,
          borderRadius: lerp(CH * 0.32, TS * 0.28, col), background: C.white, boxShadow: "0 40px 80px -40px rgba(41,58,81,0.35)",
          border: `1.5px solid ${rgba(C.navy, 0.07)}`, overflow: "hidden" }}>
          {!textOut && (
            <div style={{ position: "absolute", left: 0, top: 0 }}>
              <Composer w={CW} h={CH} text={Q_TEXT} n={n} size={60} send={send} placeholder="How can we help?" blinkT={(g - ty1) / 30} tileScale={1 - 0.08 * pz} />
            </div>
          )}
        </div>
      )}
      {/* the sent question rises away as a bubble (kept for "everything works together") */}
      {textOut && g < rel + 14 && (
        <div style={at(960 - 60, CY - 1000 * pxi(g, rel - 1, 12, 0.75))}>
          <Bubble text={Q_TEXT} size={58} />
        </div>
      )}
    </>
  );
};

export const Bubble: React.FC<{ text: string; size: number; bg?: string; color?: string }> = ({ text, size, bg = C.pale, color = C.ink }) => (
  <div style={{ background: bg, borderRadius: size * 0.8, padding: `${size * 0.42}px ${size * 0.7}px`, fontFamily: F.ui, fontWeight: 500, fontSize: size,
    color, whiteSpace: "nowrap" }}>{text}</div>
);

/** The send tile after the click: slides to the centre, grows into the K.B logo tile on "Meet". */
const SendTile: React.FC<{ g: number }> = ({ g }) => {
  const rel = W("w:together", 0.85);
  if (g < rel - 1) return null;
  const x = lerp(TILE_X, 960, pr(g, rel, 11, MOVE)), y = CY;
  const meet = W("w:meet", -0.03);
  const grow = px(g, meet, 26, 0.88);
  const size = lerp(TS, 330, grow);
  const arrow = 1 - clamp01((g - meet) / 5);
  const lettersAt = [meet + 6, meet + 8, meet + 10];
  const morphA = W("w:kb", 0.62);                    // into the nav pill, in the pause after "K.B"
  if (g >= morphA) return null;
  return (
    <div style={at(x, y)}>
      <div style={{ width: size, height: size, borderRadius: size * 0.074 + (1 - grow) * size * 0.2, position: "relative", overflow: "hidden",
        background: `linear-gradient(90deg, ${mix(C.navy, "#354C67", grow)}, ${mix(C.navy, "#3D5574", grow)})`, boxShadow: "0 40px 80px -40px rgba(41,58,81,0.45)" }}>
        {arrow > 0 && <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${arrow})` }}>
          <Icon name="arrowUp" size={TS * 0.5} color="#fff" stroke={2.6} /></div>}
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {["K", ".", "B"].map((ch, i) => (
            <span key={i} style={{ fontFamily: F.logo, fontWeight: 800, fontSize: size * 0.367, color: "#fff", opacity: g >= lettersAt[i] ? 1 : 0, lineHeight: 1 }}>{ch}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

/** The tile becomes the nav pill; on hover it widens to "K.B Tech Partner" (the site's own nav behaviour). */
export const pillState = (g: number) => {
  const mA = W("w:kb", 0.62);
  const m = pr(g, mA, 14, MOVE);
  const h = lerp(330, 190, m);
  const o1a = W("w:technology", -0.27), o2a = W("w:partner", -0.27);
  const hh = 190;
  const open1 = (hh * 0.22 + tw("Tech", hh * 0.3, 600)) * pr(g, o1a, 12, MOVE);
  const open2 = (hh * 0.11 + tw("Partner", hh * 0.3, 600)) * pr(g, o2a, 12, MOVE);
  const w1 = clamp01((g - (o1a + 6)) / 4), w2 = clamp01((g - (o2a + 6)) / 4);
  const push = 1 + 0.4 * pr(g, W("w:technology", -0.4), 60, MOVE);     // the pill is pushed to as it is named
  return { m, h, open: open1 + open2, words: [{ t: "Tech", o: w1 }, { t: "Partner", o: w2 }], show: g >= mA, push };
};

const Pill: React.FC<{ g: number }> = ({ g }) => {
  const s = pillState(g);
  const built = W("w:built", -0.05);
  if (!s.show || g >= built + 2) return null;
  return <div style={at(960, 540, s.push)}><KBMark h={s.h} m={s.m} open={s.open} words={s.words} /></div>;
};

// ---- the cursors -----------------------------------------------------------------------------------------------
const CS = 92;
const TeamCursor: React.FC<{ g: number }> = ({ g }) => {
  // 1) onto the send tile on "together", click in the pause, leave
  const a1 = W("w:together", -0.1), rel = W("w:together", 0.85);
  // 2) back from the lower left onto the pill on "technology", click on "built", leave
  const a2 = W("w:technology", -0.45), clk = W("w:built", -0.1);
  let x = -999, y = -999, pz = 0;
  if (g >= a1 && g < rel + 12) {
    const e = px(g, a1, 14, 0.78), ex = pxi(g, rel + 2, 10, 0.75);
    x = lerp(1980, TILE_X + 6, e) + 900 * ex; y = lerp(1150, CY + 14, e) + 700 * ex; pz = press(g, rel - 6);
  } else if (g >= a2 && g < clk + 22) {
    const e = px(g, a2, 16, 0.8), ex = pxi(g, clk + 9, 10, 0.75);
    x = lerp(-120, 1040, e) - 1200 * ex; y = lerp(1180, 610, e) + 800 * ex; pz = press(g, clk - 3);
  } else return null;
  const t = tip(CS);
  return <div style={{ position: "absolute", left: 0, top: 0, transform: `translate3d(${x + t.dx}px, ${y + t.dy}px, 0)` }}><Cursor size={CS} press={pz} label="Your team" /></div>;
};

export const SectionA: React.FC<{ g: number }> = ({ g }) => (
  <>
    <OpeningFootage g={g} />
    <Hook g={g} />
    <Feed g={g} />
    <WhiteFromTile g={g} />
    <Question g={g} />
    <SendTile g={g} />
    <Pill g={g} />
    <TeamCursor g={g} />
  </>
);
