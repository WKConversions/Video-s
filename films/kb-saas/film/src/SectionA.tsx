// 01–08: one business, countless tools, hundreds of tasks; the question typed and sent; the send tile becomes K.B;
// the tile becomes the site's nav pill, "K.B Tech Partner".
import React from "react";
import { OffthreadVideo, Sequence, staticFile } from "remotion";
import { ARRIVE, C, F, MOVE, W, at, clamp01, lerp, mix, pr, press, px, pxi, rgba, tip } from "./lib";
import { Composer, KBMark, TaskPill, tw } from "./parts";
import { Cursor } from "./ui";
import { Icon } from "./icons";

// ---- the hook --------------------------------------------------------------------------------------------------
/** A word that eases in: it rises 26 px out of a light blur and fades on over 10 f (technique 1, the blur-rise build). */
const RiseWords: React.FC<{ g: number; words: { t: string; f: number }[]; size: number; x: number; y: number; color?: string; opacity?: number }> =
  ({ g, words, size, x, y, color = "#FFFFFF", opacity = 1 }) => {
    const sp = tw(" ", size, 700);
    let cx = x;
    return (
      <>
        {words.map((w, i) => {
          const left = cx; cx += tw(w.t, size, 700) + sp;
          if (g < w.f) return null;
          const k = clamp01((g - w.f) / 14);
          const e = ARRIVE(k);
          return (
            <div key={i} style={{ position: "absolute", left: 0, top: 0, transform: `translate3d(${left}px, ${y - size * 0.62 + 26 * (1 - e)}px, 0)`,
              opacity: opacity * clamp01((g - w.f) / 9), filter: k < 1 ? `blur(${6 * (1 - e)}px)` : undefined, fontFamily: F.ui, fontWeight: 700,
              fontSize: size, color, whiteSpace: "pre", lineHeight: 1.24 }}>{w.t}</div>
          );
        })}
      </>
    );
  };

const X0 = 210;
const Hook: React.FC<{ g: number }> = ({ g }) => {
  const out = pr(g, W("w:tools", 0.5), 16, MOVE);                         // both lines ease away in the pause after "tools."
  if (out >= 1) return null;
  const dim = pr(g, W("w:business", 0.6), 14, MOVE);                       // line 1 steps back as line 2 arrives (it doesn't move)
  return (
    <div style={{ position: "absolute", inset: 0, transform: `translateY(${-50 * out}px)`, opacity: 1 - out, textShadow: "0 4px 30px rgba(20,30,45,0.35)" }}>
      <RiseWords g={g} size={124} x={X0} y={470} opacity={1 - 0.35 * dim}
        words={[{ t: "One", f: W("w:one", -0.12) }, { t: "business.", f: W("w:business", -0.1) }]} />
      <RiseWords g={g} size={124} x={X0} y={622}
        words={[{ t: "Countless", f: W("w:countless", -0.12) }, { t: "tools.", f: W("w:tools", -0.1) }]} />
    </div>
  );
};

// ---- the tools: settle around the business on "tools.", line up on both sides for the tasks, fan into the question
const TOOLS: [string, string][] = [["Email", "mail"], ["CRM", "crm"], ["Spreadsheets", "sheet"], ["Calendar", "calendar"], ["Invoices", "invoice"],
  ["Chat", "chat"], ["Forms", "form"], ["Support desk", "users"]];
const P1: [number, number][] = [[1090, 175], [1480, 165], [1735, 345], [1745, 610], [1665, 865], [1295, 925], [935, 905], [565, 905]];
const COLY = [235, 385, 705, 855];
const P2 = (i: number): [number, number] => [i % 2 === 0 ? 245 : 1675, COLY[Math.floor(i / 2)]];
const chipW = (name: string) => 20 + 38 + 14 + tw(name, 32, 600) + 26;

const ToolChip: React.FC<{ name: string; icon: string; glow?: number }> = ({ name, icon, glow = 0 }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 14, height: 78, padding: "0 26px 0 20px", borderRadius: 22, background: C.white,
    border: `2px solid ${mix(rgba(C.navy, 0.07), C.cyan, glow)}`, boxShadow: "0 16px 30px -22px rgba(41,58,81,0.35)", whiteSpace: "nowrap", boxSizing: "border-box" }}>
    <Icon name={icon} size={38} color={C.navy} stroke={2} />
    <span style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 32, color: C.muted }}>{name}</span>
  </div>
);

export const Q_TEXT = "What if everything just worked together?";
const CW = 1240, CH = 170, CY = 540, TS = CH * 0.62;
/** The prompt bar's push toward its send button from "everything" (released inside the morph into K.B). */
const qPush = (g: number) => 1 + 0.16 * pr(g, W("w:everything", -0.1), 56, MOVE) * (1 - pr(g, W("w:together", 0.85) - 4, 26, MOVE));
const REL = () => W("w:together", 0.85);               // the click's release, in the pause after "together"
const M0 = () => REL() - 4;                            // the prompt bar starts becoming the K.B tile
const chipPos = (g: number, i: number): [number, number, number, number] => {
  const app = W("w:tools", -0.12) + i * 3;
  const e = ARRIVE(clamp01((g - app) / 16));
  const op = clamp01((g - app) / 8);
  const toCol = pr(g, W("w:tools", 0.55) + i, 20, MOVE);
  const [x1, y1] = P1[i], [x2, y2] = P2(i);
  let x = lerp(x1, x2, toCol), y = lerp(y1 + 24 * (1 - e), y2, toCol);
  let sc = 0.94 + 0.06 * e, o = op;
  const conv = pr(g, M0() + i, 18, MOVE);                // pulled into the prompt bar as it becomes K.B
  if (conv > 0) { x = lerp(x, 960, conv); y = lerp(y, CY, conv); sc *= 1 - 0.65 * conv; o *= 1 - clamp01((conv - 0.7) / 0.3); }
  return [x, y, sc, o];
};

const Tools: React.FC<{ g: number }> = ({ g }) => {
  if (g < W("w:tools", -0.12) || g > M0() + 30) return null;
  const ev = W("w:everything", -0.05), wk = W("w:worked", -0.05), tog = W("w:together", -0.05);
  const fadeLines = 1 - clamp01((g - M0()) / 6);
  const lines = TOOLS.map((tl, i) => {
    const [x, y] = chipPos(g, i);
    const left = i % 2 === 0;
    const sx = left ? x + chipW(tl[0]) / 2 : x - chipW(tl[0]) / 2;
    const row = Math.floor(i / 2), topRow = row < 2;
    const tx0 = (left ? [560, 760, 760, 560] : [1360, 1160, 1160, 1360])[row];
    const qp = qPush(g);
    const ty = CY + ((topRow ? -CH / 2 : CH / 2)) * qp;
    const d = pr(g, ev + i * 2, 12, MOVE);
    const solid = pr(g, wk + i, 10, MOVE);
    const tx = 960 + (tx0 - 960) * qp;
    return { sx, sy: y, tx, ty, d, solid };
  });
  return (
    <>
      {g >= ev && fadeLines > 0 && (
        <svg style={{ position: "absolute", left: 0, top: 0, opacity: fadeLines }} width={1920} height={1080}>
          {lines.map((l, i) => {
            const ex = lerp(l.sx, l.tx, l.d), ey = lerp(l.sy, l.ty, l.d);
            return <g key={i}>
              <line x1={l.sx} y1={l.sy} x2={ex} y2={ey} stroke={rgba(C.white, 0.75)} strokeWidth={3} strokeDasharray="10 9" />
              {l.solid > 0 && <line x1={l.sx} y1={l.sy} x2={lerp(l.sx, ex, l.solid)} y2={lerp(l.sy, ey, l.solid)} stroke={C.cyan} strokeWidth={5} strokeLinecap="round" />}
            </g>;
          })}
        </svg>
      )}
      {TOOLS.map(([name, icon], i) => {
        const [x, y, sc, o] = chipPos(g, i);
        if (o <= 0) return null;
        const glow = g >= tog ? pr(g, tog + i, 8, MOVE) : 0;
        return <div key={i} style={at(x, y, sc, o)}><ToolChip name={name} icon={icon} glow={glow} /></div>;
      })}
    </>
  );
};

/** The business at work (Mixkit 42628, free licence): the real world before K.B, in a large window; it dims as the tasks
 *  pile up and softens behind the question; the white field out of the K.B tile covers it. */
const WIN = { x: 960, y: 540, w: 1720, h: 968 };
const OpeningFootage: React.FC<{ g: number }> = ({ g }) => {
  if (g > W("w:meet", 1.0)) return null;
  const dim = pr(g, W("w:hundreds", -0.2), 16, MOVE);
  const blur = pr(g, W("w:what", -0.5), 14, MOVE);
  const push = 1 + 0.1 * clamp01(g / 150) + 0.16 * pr(g, W("w:what", -0.5), 90, (x) => x);   // a slow push into the business
  return (
    <div style={{ position: "absolute", left: WIN.x - WIN.w / 2, top: WIN.y - WIN.h / 2, width: WIN.w, height: WIN.h, borderRadius: 48, overflow: "hidden",
      boxShadow: "0 50px 100px -50px rgba(41,58,81,0.5)" }}>
      <div style={{ position: "absolute", inset: 0, transform: `scale(${push})`, filter: `blur(${1.5 * dim + 1 * blur}px)` }}>
        <Sequence from={0} layout="none">
          <OffthreadVideo src={staticFile("footage/business-woman-on-call-while-working-42628.mp4")} muted
            style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </Sequence>
      </div>
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(90deg, ${rgba(C.navy, 0.72)} 0%, ${rgba(C.navy, 0.35)} 48%, ${rgba(C.navy, 0.05)} 75%)` }} />
      <div style={{ position: "absolute", inset: 0, background: rgba(C.navy, 0.42 * dim) }} />
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

// ---- the task feed: tasks stream up between the tools; on "connecting" each one is linked to two of them -------------
const TASKS = ["Follow-ups", "CRM updates", "Payment confirmations", "Excel files", "Outreach", "Intake calls", "Approval flows", "Data routing",
  "Invoices", "Reporting", "Onboarding", "Scheduling"];
const spawns = (() => {
  const out: number[] = [];
  let t = W("w:and", 0.12);
  const tasks = W("w:tasks", -0.1), conn = W("w:connecting", -0.1), q = W("w:what", -0.55);
  while (t < q) { out.push(t); t += t < tasks ? 8 : t < conn ? 5 : 3; }
  return out;
})();

export const Feed: React.FC<{ g: number }> = ({ g }) => {
  const q = W("w:what", -0.55);
  if (g < spawns[0] || g > q + 14) return null;
  const PIT = 118, YS = 880;
  const born = spawns.filter((s) => s <= g);
  const e = born.map((s) => px(g, s, 12, 0.8));
  const connF = W("w:connecting", -0.1);
  const fade = 1 - pr(g, q, 12, MOVE);                      // the tasks give way to the question
  return (
    <div style={{ position: "absolute", inset: 0, opacity: fade }}>
      {born.map((s, k) => {
        let pushes = 0;
        for (let j = k + 1; j < born.length; j++) pushes += e[j];
        const y = YS + PIT * (1 - e[k]) - PIT * pushes;
        if (y < -60) return null;
        const age = born.length - 1 - k;
        const ink = clamp01(1 - age * 0.4);
        const top = clamp01((y - 60) / 200);
        const label = TASKS[k % TASKS.length];
        const pw = tw(label, 44, 600) + 44 * 3.2;
        const lineStart = s >= connF ? s + 3 : connF + Math.max(0, 5 - age) * 2;
        const draw = pr(g, lineStart, 10, MOVE);
        const li = (k % 4) * 2, ri = ((k + 2) % 4) * 2 + 1;
        const [lx, ly] = P2(li), [rx, ry] = P2(ri);
        const L = lx + chipW(TOOLS[li][0]) / 2, R = rx - chipW(TOOLS[ri][0]) / 2;
        const lc = age === 0 ? C.cyan : rgba(C.white, 0.55);
        return (
          <React.Fragment key={k}>
            {draw > 0 && (
              <svg style={{ position: "absolute", left: 0, top: 0, opacity: top }} width={1920} height={1080}>
                <line x1={960 - pw / 2} y1={y} x2={lerp(960 - pw / 2, L, draw)} y2={lerp(y, ly, draw)} stroke={lc} strokeWidth={age === 0 ? 4 : 3} strokeDasharray="10 9" />
                <line x1={960 + pw / 2} y1={y} x2={lerp(960 + pw / 2, R, draw)} y2={lerp(y, ry, draw)} stroke={lc} strokeWidth={age === 0 ? 4 : 3} strokeDasharray="10 9" />
              </svg>
            )}
            <div style={{ ...at(960, y), opacity: top }}><TaskPill label={label} size={44} ink={0.35 + 0.65 * ink} /></div>
          </React.Fragment>
        );
      })}
    </div>
  );
};

// ---- the question, then the prompt bar becomes the K.B tile --------------------------------------------------------
const Question: React.FC<{ g: number }> = ({ g }) => {
  const a = W("w:what", -0.5);
  const rel = REL(), m0 = M0();
  const morphEnd = m0 + 26;
  if (g < a || g >= W("w:kb", 0.62)) return null;
  const rise = px(g, a, 18, 0.8);
  const ty0 = W("w:what", -0.06), ty1 = W("w:together", -0.4);
  const n = Q_TEXT.length * MOVE(clamp01((g - ty0) / (ty1 - ty0)));
  const send = g >= ty0 ? clamp01((g - ty0) / 3) : 0;
  const pz = press(g, rel - 6);
  const m = pr(g, m0, 26, MOVE);                                  // one continuous morph: bar → tile
  const qpush = qPush(g);
  const w = lerp(CW, 330, m), h = lerp(CH, 330, m), r = lerp(CH * 0.32, 24, m);
  const fill = clamp01((m - 0.2) / 0.5);
  void fill;
  const flood = MOVE(clamp01(m / 0.65));                 // the send button's navy floods the bar from where it sits
  const letters = clamp01((m - 0.55) / 0.4);
  const textOut = g >= rel - 1;
  const content = 1 - clamp01((g - (rel - 1)) / 6);
  return (
    <>
      <div style={{ position: "absolute", left: 960 - w / 2, top: CY - h / 2 + 700 * (1 - rise), width: w, height: h, borderRadius: r, transform: `scale(${qpush})`,
        background: C.white,
        boxShadow: "0 40px 80px -40px rgba(41,58,81,0.45)", border: `1.5px solid ${rgba(C.navy, 0.07 * (1 - fill))}`, overflow: "hidden" }}>
        {content > 0 && (
          <div style={{ position: "absolute", left: 0, top: 0, opacity: content, transform: `translateX(${(w - CW) / 2}px)` }}>
            <Composer w={CW} h={CH} text={textOut ? "" : Q_TEXT} n={textOut ? 0 : n} size={52} send={send} caret={!textOut} placeholder={textOut ? undefined : "How can we help?"}
              blinkT={(g - ty1) / 30} tileScale={1 - 0.08 * pz} />
          </div>
        )}
        {flood > 0 && (
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, #354C67, #3D5574)",
            clipPath: `circle(${flood * 900}px at ${lerp(w / 2 + (CW / 2 - (CH - TS) / 2 - TS / 2), w / 2, m)}px 50%)` }} />
        )}
        {letters > 0 && (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: letters,
            filter: letters < 1 ? `blur(${8 * (1 - letters)}px)` : undefined }}>
            <span style={{ fontFamily: F.logo, fontWeight: 800, fontSize: 330 * 0.367, color: "#fff", lineHeight: 1 }}>K.B</span>
          </div>
        )}
      </div>
      {/* the sent question rises away as a bubble (it comes back for "everything works together") */}
      {textOut && g < rel + 14 && (
        <div style={at(960, CY - 1000 * pxi(g, rel - 1, 12, 0.75))}><Bubble text={Q_TEXT} size={52} /></div>
      )}
      {g >= morphEnd && null}
    </>
  );
};

export const Bubble: React.FC<{ text: string; size: number; bg?: string; color?: string }> = ({ text, size, bg = C.pale, color = C.ink }) => (
  <div style={{ background: bg, borderRadius: size * 0.8, padding: `${size * 0.42}px ${size * 0.7}px`, fontFamily: F.ui, fontWeight: 500, fontSize: size,
    color, whiteSpace: "nowrap" }}>{text}</div>
);

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
  const push = 1 + 0.42 * pr(g, W("w:technology", -0.4), W("w:built", -0.1) - W("w:technology", -0.4), (x) => 1 - (1 - x) * (1 - x));
  return { m, h, open: open1 + open2, words: [{ t: "Tech", o: w1 }, { t: "Partner", o: w2 }], show: g >= mA, push };
};

const Pill: React.FC<{ g: number }> = ({ g }) => {
  const s = pillState(g);
  const built = W("w:built", -0.05);
  if (!s.show || g >= built + 2) return null;
  return <div style={at(960, 540, s.push)}><KBMark h={s.h} m={s.m} open={s.open} words={s.words} /></div>;
};

// ---- the cursors -----------------------------------------------------------------------------------------------
const TILE_X = 960 + CW / 2 - (CH - TS) / 2 - TS / 2;
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
    <Tools g={g} />
    <Question g={g} />
    <Pill g={g} />
    <TeamCursor g={g} />
  </>
);
