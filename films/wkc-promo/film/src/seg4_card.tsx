// Segment 4 cards: the white storyboard-frame card (500 x 170 local px, §3.2 / §9.2), the highlighted WKC-blue
// "Storyboard" card (540 x 222, the reference's purple "Send To"), and the blue connector arrow.
import React from "react";
import { C, F } from "./lib";
import { WkcMark, tw } from "./kit";
import { Icon, IconKind, T } from "./seg4_util";

export const CW = 500, CH = 170;
/** storyboard frames by slot (§9.2) */
export const CARDS: Record<string, { t: string; s: string; k: IconKind }> = {
  c1r1: { t: "01 · Hook", s: "Logo lands on the beat", k: "logo" },
  c2r1: { t: "02 · Problem", s: "Show the pain point", k: "bars" },
  c3r1: { t: "03 · Product", s: "Hero UI, slow push-in", k: "play" },
  c4r1: { t: "04 · Feature", s: "Callout with a cursor", k: "cursor" },
  c1r2: { t: "05 · Benefit", s: "Before and after split", k: "split" },
  c2r2: { t: "06 · Detail", s: "Macro on the interface", k: "zoom" },
  c3r2: { t: "07 · Transition", s: "Match cut to mobile", k: "cut" },
  c4r2: { t: "08 · Mobile", s: "The 9:16 version", k: "phone" },
  c1r3: { t: "09 · Kinetic type", s: "One idea per line", k: "type" },
  c2r3: { t: "10 · Sound", s: "Whoosh on every cut", k: "wave" },
  c3r3: { t: "11 · Brand", s: "WKC blue, Inter Tight", k: "drop" },
  c4r3: { t: "12 · Outro", s: "Logo and call to action", k: "flag" },
  c1r4: { t: "Script", s: "Read from the brief", k: "doc" },
  c2r4: { t: "Voice-over", s: "Timed to the frame", k: "mic" },
  c3r4: { t: "Styleframes", s: "Polish every composition", k: "frame" },
  c4r4: { t: "Render", s: "16:9 · 1:1 · 9:16", k: "render" },
  c3r5: { t: "Export", s: "For every platform", k: "export" },
};

/** the white storyboard-frame card in its own 500 x 170 px (lip, lavender-blue shadow, thumbnail, title, diamond, divider, note) */
export const StoryCard: React.FC<{ slot: string; shadow?: boolean }> = ({ slot, shadow = true }) => {
  const c = CARDS[slot];
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: CW, height: CH, borderRadius: 15, background: C.white,
      boxShadow: `${shadow ? "0 8px 20px rgba(63,140,232,0.22), " : ""}0 3.5px 0 #E6F0FD, 0 0 0 1px rgba(5,15,25,0.035)` }}>
      <svg width={CW} height={CH} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        <rect x={39} y={31} width={50} height={50} rx={10} fill={C.blueSoft} />
        <Icon k={c.k} cx={64} cy={56} size={28} color={C.blue} sw={2} />
        <T x={111} y={70} s={c.t} size={36} w={600} fill={C.ink} />
        <Icon k="diamond" cx={452.5} cy={69} size={31} color={C.muted} sw={2} />
        <rect x={39} y={95.25} width={431} height={1.5} fill="#E3E8EF" />
        <T x={40} y={136} s={c.s} size={34} w={400} fill={C.muted2} />
      </svg>
    </div>
  );
};

export const HW = 540, HH = 222;
const SUB = "From brief to storyboard...";
/** the subtitle size: the reference's 38 px, fitted so the full line ends 25 px inside the card */
const subSize = () => Math.min(38, (38 * 453) / tw(SUB, 38, 400, F.ui));
/** the highlighted WKC-blue card, 540 x 216 px; n = typed characters of the subtitle */
export const StoryboardCard: React.FC<{ n: number }> = ({ n }) => {
  const ss = subSize();
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: HW, height: HH, borderRadius: 10, background: C.blue,
      boxShadow: "0 12px 26px rgba(63,140,232,0.30), 0 3px 0 #2F78D2" }}>
      <div style={{ position: "absolute", left: 62, top: 48, width: 62, height: 62, display: "flex", alignItems: "center", justifyContent: "center",
        filter: "drop-shadow(0 0 5px rgba(255,255,255,0.55))" }}><WkcMark w={62} fill="#FFFFFF" /></div>
      <svg width={HW} height={HH} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        <T x={142} y={100} s="Storyboard" size={41} w={600} fill="#FFFFFF" />
        <Icon k="diamond" cx={454.5} cy={85} size={37} color="#FFFFFF" sw={2.4} />
        <rect x={62} y={122.25} width={424} height={1.5} fill="#FFFFFF" opacity={0.6} />
        <T x={62} y={150 + 0.7275 * ss} s={SUB.slice(0, n)} size={ss} w={400} fill="#E6F0FD" opacity={0.75} />
      </svg>
    </div>
  );
};
/** the blue connector arrow from (x0,y) to (x1,y), stroke sw, with a small open head; p = drawn fraction */
export const Arrow: React.FC<{ x0: number; x1: number; y: number; sw?: number; head?: number; p?: number }> = ({ x0, x1, y, sw = 2.6, head = 7, p = 1 }) => {
  if (p <= 0) return null;
  const xe = x0 + (x1 - x0) * Math.min(1, p);
  return (
    <g>
      <path d={`M${x0} ${y} H${xe - 0.5}`} stroke={C.blue} strokeWidth={sw} strokeLinecap="round" />
      {p > 0.55 && <path d={`M${xe - head} ${y - head * 0.75} L${xe} ${y} L${xe - head} ${y + head * 0.75}`} fill="none" stroke={C.blue} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />}
    </g>
  );
};
