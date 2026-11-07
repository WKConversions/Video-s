// B2 overlays: covers + custom text re-set in the platform's own type, per screen. All coordinates are NATIVE screenshot px
// (OCR px / 2); <Nat> scales them onto the 2559 x 1350 stage exactly like the stretched photo.
import React from "react";
import { C, SANS, SW, SH, Shot } from "../kit";

export const NATIVE: Record<string, [number, number]> = {
  "04": [2559, 1351], "06": [2545, 1350], "18": [2543, 1351], "24": [2544, 1350], "25": [2545, 1349], "26": [2545, 1350],
  "27": [2544, 1350], "28": [2544, 1351], "29": [2543, 1351], "30": [2545, 1352], "31": [2544, 1351], "34": [2543, 1351],
};
export const DEBUG = false;
export const MONO = "Menlo, 'DejaVu Sans Mono', monospace";
export const INK = "#121e2a", MUTE = "#5f666f", SUB = "#7d838c";

export const Nat: React.FC<{ n: string; children?: React.ReactNode; style?: React.CSSProperties }> = ({ n, children, style }) => {
  const [W, H] = NATIVE[n];
  return <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H, transformOrigin: "0 0", transform: `scale(${SW / W}, ${SH / H})`, ...style }}>{children}</div>;
};
/** a cover in native px (hidden in DEBUG so the original shows through) */
export const Cv: React.FC<{ x: number; y: number; w: number; h: number; c?: string; r?: number }> = ({ x, y, w, h, c = "#fff", r = 0 }) =>
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, background: DEBUG ? "rgba(0,180,255,0.18)" : c, borderRadius: r }} />;
/** one line of text; y = the OCR ink top of the line */
export const Ln: React.FC<{ x: number; y: number; size?: number; color?: string; weight?: number; mono?: boolean; ls?: string; style?: React.CSSProperties; children?: React.ReactNode }> =
  ({ x, y, size = 17, color = INK, weight = 400, mono, ls, style, children }) => (
    <div style={{ position: "absolute", left: x, top: y - 0.03 * size, whiteSpace: "pre", fontFamily: mono ? MONO : SANS, fontSize: size, lineHeight: 1, fontWeight: weight, color: DEBUG ? "#e00" : color, letterSpacing: ls ?? (mono ? "0" : "-0.003em"), ...style }}>{children}</div>
  );
export const Para: React.FC<{ x: number; y: number; pitch?: number; lines: React.ReactNode[]; size?: number; color?: string; weight?: number; dy?: number }> =
  ({ x, y, pitch = 28.4, lines, size, color, weight, dy = 0 }) => <>{lines.map((l, i) => <Ln key={i} x={x} y={y + dy + i * pitch} size={size} color={color} weight={weight}>{l}</Ln>)}</>;

const B: React.FC<{ children?: React.ReactNode }> = ({ children }) => <b style={{ fontWeight: 600 }}>{children}</b>;

// ------------------------------------------------------------------ Sales strategy, left column
/** v "A" = screens 24/25 (6. Pricing at the top), "B" = 26-29 (scrolled 100 px); val = the project minimum shown in the table */
export const SalesCol: React.FC<{ v: "A" | "B"; val: "400" | "450" }> = ({ v, val }) => {
  const dy = v === "A" ? 0 : -100;
  const X = 975, S = 17, TS = 14.2;
  const row = (y: number, a: React.ReactNode[], b: React.ReactNode[]) => (<>
    <Cv x={985} y={y + dy - 4} w={365} h={a.length > 1 || b.length > 1 ? 58 : 32} />
    {a.map((l, i) => <Ln key={"a" + i} x={992} y={y + dy + i * 26} size={TS}>{l}</Ln>)}
    {b.map((l, i) => <Ln key={"b" + i} x={1134} y={y + dy + i * 26} size={TS}>{l}</Ln>)}
  </>);
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%", clipPath: "inset(73px 0px 0px 0px)" }}>
      {/* intro of 6. Pricing */}
      <Cv x={962} y={140 + dy} w={410} h={84} />
      <Para x={X} y={146} dy={dy} size={S} lines={[<><B>In short:</B> Prices are set per client and agreed in</>, "the call, above clear minimums. We don't publish", "a price list and we don't discount."]} />
      <Cv x={962} y={241 + dy} w={410} h={142} />
      <Para x={X} y={247} dy={dy} size={S} lines={["Every quote starts with a conversation, so the", "amount depends on the scope of the project and", "on the client, and it is agreed in the call. We", "keep a clear floor for every service, and quotes", "exclude VAT."]} />
      {/* table */}
      {row(470, ["Minimum one-off", "project"], [val === "450" ? "€450" : "€400"])}
      {row(544, ["Minimum monthly", "retainer"], ["€900 to €2,000 a month"])}
      {row(618, ["Range per", "service"], ["€450 to €4,500"])}
      {row(694, ["Discounts"], ["Never; scope comes down,", "not the price"])}
      {row(768, ["Add-on inside", "a project"], ["From €250, e.g. an", "extra landing page."])}
      {/* after the table */}
      <Cv x={962} y={850 + dy} w={410} h={290} />
      <Para x={X} y={856} dy={dy} size={S} lines={["If a client pushes back on price, we make the", "scope smaller rather than lowering the price for", "the same work. This keeps our pricing fair and", "consistent, and it protects the quality we", "promise. €250 is only ever the price of a small", "add-on inside a project; a stand-alone project", `never goes below €${val}.`, "Invoicing and payment terms are owned by", "Finance (see Finance, layer 2: invoicing and", "payment)."]} />
      {/* 7. Revenue goal and metrics */}
      <Cv x={962} y={1231 + dy} w={410} h={90} />
      <Para x={X} y={1237} dy={dy} size={S} lines={[<><B>In short:</B> Grow retainers to half of our revenue</>, "within 12 months, mainly by turning one-off", "projects into monthly work."]} />
      <Cv x={962} y={1330 + dy} w={410} h={130} />
      <Para x={X} y={1337} dy={dy} size={S} lines={["Today most of our revenue still comes from one-", "off projects, with a handful of retainers on top.", "The target for the next 12 months is to move half", "of it to monthly retainers, reviewed each quarter."]} />
    </div>
  );
};

/** screen 18: the top of Sales strategy (subtitle, introduction, chapter 1) */
export const Ov18: React.FC = () => {
  const X = 975, S = 17;
  return (<>
    <Cv x={942} y={252} w={440} h={140} c={C.page} />
    <Para x={944} y={258} pitch={28.8} size={18.6} color={SUB} lines={["The one strategic document for Sales at Nova.", "Every choice about who we sell to, how, what, at", "what price and towards which goal lives here; all", "Layer 2 and Layer 3 Sales documents are updated", "from it."]} />
    <Cv x={962} y={535} w={410} h={285} />
    <Para x={X} y={542} size={S} lines={["This document sets out how Nova sells: who we", "sell to, through which channels, how a deal runs,", "what we offer and at what price. Every How we", "work page and every playbook in Sales follows", "from it."]} />
    <Cv x={962} y={915} w={410} h={90} />
    <Para x={X} y={922} size={S} lines={[<><B>In short:</B> Sales turns a good first conversation</>, "into a signed project or a monthly retainer, and", "never sells what we can't deliver well."]} />
    <Cv x={962} y={1016} w={410} h={190} />
    <Para x={X} y={1023} size={S} lines={["Our promise is simple: one team for brand and", "web, from first sketch to launch. We always talk", "founder to founder: Sam or Daniel speaks directly", "with the person who decides, never with a", "marketing team."]} />
    <Cv x={962} y={1231} w={410} h={120} />
    <Para x={X} y={1238} size={S} lines={["We start by listening. The first call is free and", "takes as long as it needs, because the goal is to", "work out what to build and how. We also take the", "risk off the client: they approve every step."]} />
  </>);
};
export const V18: React.FC = () => <Shot n="18"><Nat n="18"><Ov18 /></Nat></Shot>;

// ------------------------------------------------------------------ the agent panel
const PX = 1439, PS = 14.8, PP = 24.4;
export const REPLY = ["You want the minimum price for a stand-alone", "project to go from €400 to €450. I only changed", "Pricing (chapter 6). Retainers and the no-discount", "rule stay as they are."];
/** the reply text block of screens 26-29 (y of its first line = OCR) */
export const Reply: React.FC<{ y: number }> = ({ y }) => (<>
  <Cv x={1432} y={y - 6} w={375} h={5 * PP + 4} />
  <Para x={PX} y={y} pitch={PP} size={PS} lines={REPLY} />
</>);
/** typed text in the agent input of screen 24 */
export const InputCover: React.FC = () => <Cv x={1436} y={1190} w={380} h={60} c="#fff" />;
/** the diff-preview block of the suggestion card (screen 26); strike 0..1 animates the old value, show450 the new one */
export const CodeBlock: React.FC<{ strike: number; show: number }> = ({ strike, show }) => {
  const x = 1475, S = 14.4;
  return (<>
    <Cv x={1462} y={724} w={300} h={288} c="#f7f7f8" />
    <div style={{ position: "absolute", left: 1462, top: 724, width: 300, height: 285, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: -1462, top: -724 }}>
        <Ln x={x} y={730} size={S} color="#8b8b8b">· · ·</Ln>
        <Ln x={x + 3} y={758} size={S}>agreed in the call; quotes exclude VAT.</Ln>
        <Ln x={x} y={801} size={S}>| Choice | Decision |</Ln>
        <Ln x={x} y={825} size={S}>|---|---|</Ln>
        <Ln x={x} y={848} size={S}>| Minimum one-off project | €<span style={{ background: `rgba(251,228,220,${0.15 + 0.85 * strike})`, color: strike > 0.5 ? "#8c2d0c" : INK, textDecoration: strike > 0.02 ? "line-through" : "none", textDecorationColor: "#c0392b", padding: "0 1px" }}>400</span><span style={{ background: "#dcf3e5", opacity: show, display: "inline-block", maxWidth: show > 0.01 ? 60 : 0, overflow: "hidden", verticalAlign: "top", padding: show > 0.01 ? "0 1px" : 0 }}>450</span> |</Ln>
        <Ln x={x} y={871} size={S}>| Minimum monthly retainer | €900 to</Ln>
        <Ln x={x} y={894} size={S}>€2,000 a month |</Ln>
        <Ln x={x} y={917} size={S}>| Range per service | €450 to</Ln>
        <Ln x={x} y={940} size={S}>€4,500 |</Ln>
        <Ln x={x} y={965} size={S} color="#8b8b8b">· · ·</Ln>
        <Ln x={x + 3} y={994} size={S}>never goes below €450 and</Ln>
      </div>
    </div>
  </>);
};
export const Ov26: React.FC<{ strike?: number; show?: number }> = ({ strike = 0, show = 0 }) => (<>
  <SalesCol v="B" val="400" />
  <Reply y={432} />
  <CodeBlock strike={strike} show={show} />
</>);
export const Ov27: React.FC<{ n?: number; val?: "400" | "450" }> = ({ n = 0, val = "450" }) => (<>
  <SalesCol v="B" val={val} />
  <Reply y={514} />
</>);
export const Ov29: React.FC = () => (<>
  <SalesCol v="B" val="450" />
  <Reply y={514} />
</>);
export const Ov24: React.FC<{ typed?: React.ReactNode }> = ({ typed }) => (<>
  <SalesCol v="A" val="400" />
  <InputCover />
  {typed != null && <Ln x={1450} y={1206} size={PS}>{typed}</Ln>}
</>);
export const Ov25: React.FC = () => <SalesCol v="A" val="400" />;

// ------------------------------------------------------------------ panel-only parts (used inside the lifted panel)
export const PanelHole: React.FC<{ op: number }> = ({ op }) => op <= 0.001 ? null : <div style={{ position: "absolute", left: 0, top: 0, opacity: op }}><Cv x={1426} y={99} w={405} h={1217} /></div>;
export const PanelP24: React.FC<{ typed: string; caret: boolean }> = ({ typed, caret }) => (<>
  <InputCover />
  <Ln x={1450} y={1206} size={PS}>{typed}{caret && <span style={{ display: "inline-block", width: 1.6, height: 17, background: INK, verticalAlign: -3, marginLeft: 1 }} />}</Ln>
</>);
export const PanelP26: React.FC<{ strike: number; show: number }> = ({ strike, show }) => (<><Reply y={432} /><CodeBlock strike={strike} show={show} /></>);
export const PanelP27: React.FC<{ n: number; p: number }> = ({ n, p }) => (<>
  <Reply y={514} />
  <Cv x={1458} y={741} w={344} h={8} c="#eff0f2" r={4} />
  <Cv x={1458} y={741} w={Math.max(0, 342 * p)} h={8} c="#3f8ce8" r={4} />
  <Cv x={1454} y={752} w={70} h={22} />
  <Ln x={1458} y={757} size={11.6} color="#7d838c">{n} of 15</Ln>
</>);
export const PanelP29: React.FC = () => <Reply y={514} />;

/** the base screens behind the lifted panel (left column re-set + the hole the panel left) */
export const StageOv: React.FC<{ n: "18" | "24" | "25" | "26" | "27"; hole: number }> = ({ n, hole }) => (<Nat n={n}>
  {n === "18" ? <Ov18 /> : <SalesCol v={n === "24" || n === "25" ? "A" : "B"} val={n === "27" ? "450" : "400"} />}
  <PanelHole op={hole} />
</Nat>);

// ------------------------------------------------------------------ screen 31: the two open diffs
const dmono = 11.9, DY = 6.5, CW = 0.602;
type DL = { t: string; k?: "red" | "green" };
/** rev 0..1 per changed row: the band fades in, the old line is struck through left to right, the new line appears */
const DiffBox: React.FC<{ y0: number; pitch: number; lines: DL[]; boxTop: number; boxH: number; rev: (i: number) => number }> = ({ y0, pitch, lines, boxTop, boxH, rev }) => (<>
  <Cv x={776} y={boxTop} w={1020} h={boxH} c="#f7f7f8" />
  {lines.map((l, i) => {
    const r = rev(i), cy = y0 + i * pitch;
    return (<React.Fragment key={i}>
      {l.k && <div style={{ position: "absolute", left: 772, top: cy - pitch / 2, width: 1026, height: pitch, background: l.k === "red" ? "#fbe4dc" : "#dcf3e5", opacity: r }} />}
      {l.t && <Ln x={785} y={cy - DY} size={dmono} mono color={l.k === "red" && r > 0.5 ? "#8c2d0c" : /unchanged/.test(l.t) ? "#8b8b8b" : INK} style={l.k === "green" ? { opacity: r } : undefined}>{l.t}</Ln>}
      {l.k === "red" && r > 0 && <div style={{ position: "absolute", left: 785, top: cy, width: l.t.length * dmono * CW * r, height: 1.2, background: "#b3401e" }} />}
    </React.Fragment>);
  })}
</>);
export const D1: DL[] = [{ t: "· · · 5 unchanged lines · · ·" }, { t: "|---|---|" }, { t: "| Range per service | €450 to €4,500 |" }, { t: "| Minimum one-off project | €400 |", k: "red" }, { t: "| Minimum one-off project | €450 |", k: "green" },
  { t: "| Minimum monthly retainer | €900 to €2,000 a month |" }, { t: "| Discounts | Never; scope comes down, not the price |" }, { t: "" }, { t: "A stand-alone project never goes below €400.", k: "red" }, { t: "A stand-alone project never goes below €450.", k: "green" },
  { t: "" }, { t: "## What drives the price" }, { t: "· · · 37 unchanged lines · · ·" }];
export const D2: DL[] = [{ t: "· · · 5 unchanged lines · · ·" }, { t: "|---|---|" }, { t: "| Range per service | €450 to €4,500 |" }, { t: "| Floor for a stand-alone project | €400 |", k: "red" }, { t: "| Floor for a stand-alone project | €450 |", k: "green" },
  { t: "| Minimum monthly retainer | €900 to €2,000 a month |" }, { t: "| Discounts | Never; scope comes down |" }, { t: "· · · 9 unchanged lines · · ·" }, { t: "## Decisions" }, { t: "" },
  { t: "- Floor for a stand-alone project: €400, never lower.", k: "red" }, { t: "- Floor for a stand-alone project: €450, never lower.", k: "green" }, { t: "- Margin check: set by Finance (see Finance, layer 2: pricing and margins)." }];
/** r1 / r2 = reveal of the first diff's two changed pairs (rows 3-4 and 8-9); the second diff is always fully shown */
export const Ov31: React.FC<{ r1?: number; r2?: number }> = ({ r1 = 1, r2 = 1 }) => (<>
  <DiffBox y0={367} pitch={20} boxTop={350} boxH={272} lines={D1} rev={(i) => (i === 3 || i === 4 ? r1 : i === 8 || i === 9 ? r2 : 1)} />
  <DiffBox y0={804} pitch={20.1} boxTop={788} boxH={270} lines={D2} rev={() => 1} />
</>);
