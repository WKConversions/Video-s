// One continuous stage: the market map with ClearScaler's loop on its ground, and on top of it the GTM app's chip, the
// cards that unfold out of the blocks they belong to, the captions, and the finale. Story order follows plan.md.
import React from "react";
import { AbsoluteFill } from "remotion";
import { Cursor, Finale, FlyPill, LeadCard, Reply, Week, cardBox } from "./cards";
import { T } from "./clock";
import { C, DEPART, F, MOVE, clamp01, lerp } from "./lib";
import { Captions, Chip, Pill, fadeIn, tk } from "./ui";
import { BRIGHT, Block, FERN, LARK, PELL, QUILL, ROUTES, YOU, centre, loopWorld, pointOn, proj, rise, view } from "./world";
import { World } from "./World";

const L = (p: string) => T.s(p);

/** A block's pin top on screen (where a label or a card attaches). */
const pinOf = (g: number, b: Block, extra = 44): [number, number] => {
  const v = view(g);
  const [x, y] = centre(b);
  return proj(v, x, y, rise(g, b) + extra);
};

const Tag: React.FC<{ g: number; at: [number, number]; from: number; to: number; children: React.ReactNode; leader?: [number, number]; side?: "left" | "right" | "centre" }> = ({ g, at, from, to, children, leader, side = "centre" }) => {
  const t = g / 30;
  if (t < from - 0.05 || t > to + 0.4) return null;
  const kIn = tk(g, from, 0.4), kOut = tk(g, to, 0.3, DEPART);
  const o = fadeIn(g, from, 5) * (1 - kOut);
  const [x, y] = at;
  return (
    <>
      {leader && <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: o }}><line x1={leader[0]} y1={leader[1]} x2={x} y2={y - 10} stroke={C.ink2} strokeWidth={2} /></svg>}
      <div style={{ position: "absolute", left: 0, top: 0, transform: `translate(${x + (side === "left" ? 24 : side === "right" ? -24 : 0)}px, ${y - 16 + (1 - kIn) * 10 - kOut * 8}px) translate(${side === "left" ? "-100%" : side === "right" ? "0%" : "-50%"}, -100%)`, opacity: o, whiteSpace: "nowrap", willChange: "transform" }}>
        {children}
      </div>
    </>
  );
};
const Name: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span style={{ display: "inline-block", padding: "8px 16px", borderRadius: 12, background: "rgba(16,16,18,0.94)", border: `1px solid ${C.ruleStrong}`, fontFamily: F.ui, fontWeight: 600, fontSize: 34, color: C.ink, letterSpacing: "-0.01em" }}>{children}</span>
);

/** The map steps back while a card holds the eye: a dark veil with a hole at the block the card belongs to; the hole
 *  glides between blocks, it never jumps. */
const Veil: React.FC<{ g: number; fern: [number, number]; quill: [number, number]; home: [number, number] }> = ({ g, fern, quill, home }) => {
  const card = clamp01(tk(g, L("card"), 0.5) - tk(g, L("fold"), 0.35));
  const reply = clamp01(tk(g, L("bubble"), 0.5) - tk(g, L("weekOut"), 0.5));
  const fin = tk(g, L("stat"), 1.0);
  const a = Math.max(card * 0.62, reply * 0.5, fin * 0.5);
  if (a <= 0.001) return null;
  const toHome = tk(g, L("week") - 0.1, 0.5, MOVE);
  const rp: [number, number] = [lerp(quill[0], home[0], toHome), lerp(quill[1], home[1], toHome)];
  const at = fin > 0.01 ? [lerp(card >= reply ? fern[0] : rp[0], 960, fin), lerp(card >= reply ? fern[1] : rp[1], 540, fin)] : card >= reply ? fern : rp;
  const hole = lerp(100, 0, fin);
  return <AbsoluteFill style={{ background: `radial-gradient(circle at ${at[0]}px ${at[1]}px, rgba(7,8,12,0) ${hole}px, rgba(7,8,12,${a}) ${hole + 220}px)` }} />;
};

export const Story: React.FC<{ g: number }> = ({ g }) => {
  const v = view(g);
  const leads = 1284 * T.k(g, "scan", 2.1, (u) => u * u * (3 - 2 * u));
  const fern = pinOf(g, FERN), quill = pinOf(g, QUILL);
  const home = proj(v, ...pointOn(ROUTES.get(FERN)!, 0));
  const youTop = pinOf(g, YOU, 0);
  const youPin = pinOf(g, YOU, 30);
  const box = cardBox(g);
  const tether = clamp01(fadeIn(g, L("card") + 0.25, 8) - tk(g, L("fold"), 0.15));
  const lobe = (lx: number): [number, number] => { const [x, y] = loopWorld(lx, 512); return proj(v, x, y, 0); };
  const seen = lobe(289.2), chosen = lobe(734.8);
  const top = (b: Block): [number, number] => pinOf(g, b, 0);
  return (
    <AbsoluteFill>
      <World g={g} />
      <Veil g={g} fern={fern} quill={quill} home={youTop} />
      {/* soft scrims behind the stat (left) and the lockup (centre), so the end sits on a market still being worked */}
      <AbsoluteFill style={{ opacity: tk(g, L("stat"), 1.0), background: `radial-gradient(ellipse 900px 520px at ${lerp(420, 960, tk(g, L("turn"), 0.9, MOVE))}px 560px, rgba(7,8,12,0.78), rgba(7,8,12,0) 100%)` }} />
      {/* a scrim for the captions, bottom left */}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 1250px 460px at 0px 1080px, rgba(7,8,12,0.88), rgba(7,8,12,0) 100%)" }} />

      {/* names and tags on the map */}
      <Tag g={g} at={youPin} from={L("offer")} to={L("fold") - 0.25}><Name>Your company</Name></Tag>
      <Tag g={g} at={youPin} from={L("send") + 0.2} to={L("week") - 0.15}><Name>Your company</Name></Tag>
      <Tag g={g} at={youPin} from={L("weekOut") + 0.45} to={L("pull") + 0.5}><Name>Your company</Name></Tag>
      <Tag g={g} at={pinOf(g, PELL, 110)} leader={top(PELL)} from={L("hold")} to={L("card") + 0.6}><Pill tone="ring" size={32}>On hold · nothing is sent</Pill></Tag>
      <Tag g={g} at={[fern[0], fern[1] + 74]} side="left" from={L("sofia")} to={L("draft") - 0.1}><Name>Fernhollow Freight</Name></Tag>
      <Tag g={g} at={fern} from={L("arrive") + 0.05} to={L("replies") - 0.2}><Name>Sofia Berglund · Fernhollow Freight</Name></Tag>
      <Tag g={g} at={quill} from={L("more") + 0.6} to={L("marta") - 0.05}><Name>Marta Vogel · Quillmoor Group</Name></Tag>
      <Tag g={g} at={quill} from={L("marta")} to={L("bubble") - 0.3}><Pill tone="green" size={36}>Interested</Pill></Tag>
      <Tag g={g} at={pinOf(g, BRIGHT)} from={L("marta") + 0.1} to={L("bubble") - 0.3}><Pill tone="grey" size={36}>Not now</Pill></Tag>
      <Tag g={g} at={[pinOf(g, LARK)[0] + 40, pinOf(g, LARK)[1]]} side="right" from={L("marta") + 0.2} to={L("bubble") - 0.3}><Pill tone="grey" size={36}>Out of office</Pill></Tag>
      {/* the loop's two halves, named as the site's diagram names them */}
      <Tag g={g} at={[seen[0], seen[1] + 16]} from={L("loopOn") + 0.4} to={L("stat") - 0.2}><Pill tone="orange" size={36}>Be seen</Pill></Tag>
      <Tag g={g} at={[chosen[0], chosen[1] + 16]} from={L("loopOn") + 0.6} to={L("stat") - 0.2}><Pill tone="green" size={36}>Be chosen</Pill></Tag>

      {/* the tether from Fernhollow's pin to its card */}
      {tether > 0 && (
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: tether }}>
          <line x1={fern[0]} y1={fern[1]} x2={box.x} y2={box.y + 140} stroke="rgba(237,239,243,0.45)" strokeWidth={2} />
          <circle cx={fern[0]} cy={fern[1]} r={6} fill={C.ink} />
        </svg>
      )}
      <LeadCard g={g} pin={fern} home={home} />
      <Reply g={g} pin={quill} />
      <Week g={g} home={youTop} />
      <FlyPill g={g} home={youTop} />
      <Chip g={g} leads={leads} />
      <Captions g={g} />
      <Finale g={g} />
      <Cursor g={g} />
    </AbsoluteFill>
  );
};
