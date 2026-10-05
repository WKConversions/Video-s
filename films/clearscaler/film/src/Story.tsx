// One continuous stage: the market map, and on top of it the GTM app's chip, the cards that unfold out of the blocks
// they belong to, the captions, and the finale. Story order follows storyboard/plan.md.
import React from "react";
import { AbsoluteFill } from "remotion";
import { Cursor, Finale, LeadCard, Reply, Week, slotOf } from "./cards";
import { T } from "./clock";
import { C, DEPART, F, MOVE, clamp01, lerp } from "./lib";
import { Captions, Chip, Pill, tk } from "./ui";
import { BRIGHT, Block, FERN, LARK, PELL, QUILL, ROUTES, SENDS, YOU, centre, pointOn, proj, rise, view } from "./world";
import { World } from "./World";

const L = (p: string) => T.s(p);

/** A block's pin top on screen (where a label or a card attaches). */
const pinOf = (g: number, b: Block, extra = 44): [number, number] => {
  const v = view(g);
  const [x, y] = centre(b);
  return proj(v, x, y, rise(g, b) + extra);
};

const Tag: React.FC<{ g: number; b: Block; from: number; to: number; children: React.ReactNode; dy?: number }> = ({ g, b, from, to, children, dy = 0 }) => {
  const t = g / 30;
  if (t < from - 0.05 || t > to + 0.4) return null;
  const kIn = tk(g, from, 0.4), kOut = tk(g, to, 0.3, DEPART);
  const [x, y] = pinOf(g, b);
  return (
    <div style={{ position: "absolute", left: 0, top: 0, transform: `translate(${x}px, ${y - 18 + dy + (1 - kIn) * 10 - kOut * 8}px) translate(-50%, -100%)`, opacity: kIn * (1 - kOut), whiteSpace: "nowrap", willChange: "transform" }}>
      {children}
    </div>
  );
};
const Name: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span style={{ display: "inline-block", padding: "7px 14px", borderRadius: 10, background: "rgba(16,16,18,0.92)", border: `1px solid ${C.ruleStrong}`, fontFamily: F.ui, fontWeight: 600, fontSize: 24, color: C.ink, letterSpacing: "-0.01em" }}>{children}</span>
);

/** The map steps back while a card holds the eye: a dark veil with a hole at the block the card belongs to. */
const Veil: React.FC<{ g: number; fern: [number, number]; quill: [number, number]; home: [number, number] }> = ({ g, fern, quill, home }) => {
  const card = clamp01(tk(g, L("card"), 0.5) - tk(g, L("fold"), 0.35));
  const reply = clamp01(tk(g, L("marta"), 0.5) - tk(g, L("weekOut"), 0.5));
  const fin = tk(g, L("stat"), 0.8);
  const a = Math.max(card * 0.62, reply * 0.45, fin * 0.82);
  if (a <= 0.001) return null;
  // the hole glides from Quillmoor to the viewer's block when the week opens (never jumps)
  const toHome = tk(g, L("week") - 0.1, 0.5, MOVE);
  const rp: [number, number] = [lerp(quill[0], home[0], toHome), lerp(quill[1], home[1], toHome)];
  const at = fin > 0.01 ? [960, 540] : card >= reply ? fern : rp;
  const hole = lerp(90, 0, fin);
  return <AbsoluteFill style={{ background: `radial-gradient(circle at ${at[0]}px ${at[1]}px, rgba(7,8,12,0) ${hole}px, rgba(7,8,12,${a}) ${hole + 200}px)` }} />;
};

export const Story: React.FC<{ g: number }> = ({ g }) => {
  const v = view(g);
  const leads = 1284 * T.k(g, "scan", 2.2, (u) => u * u * (3 - 2 * u));
  const fern = pinOf(g, FERN), quill = pinOf(g, QUILL);
  const r = ROUTES.get(FERN)!;
  const home = proj(v, ...pointOn(r, 0));
  const youTop = pinOf(g, YOU, 0);
  const tether = clamp01(tk(g, L("card") + 0.2, 0.4) - tk(g, L("fold"), 0.2));
  void SENDS;
  return (
    <AbsoluteFill>
      <World g={g} />
      <Veil g={g} fern={fern} quill={quill} home={youTop} />
      {/* a scrim for the captions, bottom left */}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 1150px 420px at 0px 1080px, rgba(7,8,12,0.85), rgba(7,8,12,0) 100%)" }} />

      {/* names and tags on the map */}
      <Tag g={g} b={YOU} from={L("offer")} to={L("pull") + 0.3} dy={-6}><Name>Your company</Name></Tag>
      <Tag g={g} b={PELL} from={L("hold")} to={L("card") + 0.3}><Pill tone="ring" size={22}>On hold · nothing is sent</Pill></Tag>
      <Tag g={g} b={FERN} from={L("sofia")} to={L("card") + 0.1}><Name>Fernhollow Freight</Name></Tag>
      <Tag g={g} b={FERN} from={L("arrive") + 0.05} to={L("replies") - 0.2}><Name>Fernhollow Freight</Name></Tag>
      <Tag g={g} b={QUILL} from={L("replies") + 0.95} to={L("marta") + 0.1}><Pill tone="green" size={26}>Interested</Pill></Tag>
      <Tag g={g} b={BRIGHT} from={L("replies") + 1.15} to={L("week")}><Pill tone="grey" size={26}>Not now</Pill></Tag>
      <Tag g={g} b={LARK} from={L("replies") + 1.5} to={L("week")}><Pill tone="grey" size={26}>Out of office</Pill></Tag>

      {/* the tether from Fernhollow's pin to its card */}
      {tether > 0 && (
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <line x1={fern[0]} y1={fern[1]} x2={lerp(fern[0], 1110, tether)} y2={lerp(fern[1], 420, tether)} stroke={C.ruleStrong} strokeWidth={1.5} />
          <circle cx={fern[0]} cy={fern[1]} r={5} fill={C.ink} />
        </svg>
      )}
      <LeadCard g={g} pin={fern} home={home} />
      <Reply g={g} pin={quill} slot={slotOf(youTop)} />
      <Week g={g} home={youTop} />
      <Chip g={g} leads={leads} />
      <Captions g={g} />
      <Finale g={g} />
      <Cursor g={g} />
    </AbsoluteFill>
  );
};
