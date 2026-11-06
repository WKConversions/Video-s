// B2 helpers: shared data, the new-post panels (S4), the gig deck state shared by S4 -> S5.
import React from "react";
import { Sequence } from "remotion";
import { C, SANS, SHADOW, c01, k, mix } from "../kit";
import { Avatar, Badge, Chip, Gig, GigCard, Ico, Pill } from "../ui";

/** a Sequence anchored at an absolute film time so clips inside start at 0 there */
export const Seq: React.FC<{ from: number; children?: React.ReactNode }> = ({ from, children }) => <Sequence from={Math.round(from * 60)} layout="none">{children}</Sequence>;

const hx = (s: string) => [1, 3, 5].map((i) => parseInt(s.slice(i, i + 2), 16));
export const lerpHex = (a: string, b: string, p: number) => { const A = hx(a), B = hx(b); return `rgb(${A.map((v, i) => Math.round(mix(v, B[i], c01(p)))).join(",")})`; };
export const F = (size: number, weight = 500, color: string = C.cream, extra: React.CSSProperties = {}): React.CSSProperties => ({ fontFamily: SANS, fontSize: size, fontWeight: weight, color, letterSpacing: "-0.01em", ...extra });

export const GIGS: Gig[] = [
  { tag: "HIRING", roles: "1 ROLE", title: "Live DJ for sunset sessions", by: "Casa Brisa", city: "Marbella", role: "Live DJ", open: "Open · 0/1", fee: "€280", time: "Fri 20 Nov", img: "clips/dj-stage.mp4" },
  { tag: "HIRING", roles: "1 ROLE", title: "Photographer for a rooftop launch", by: "La Terraza", city: "Málaga", role: "Event photographer", open: "Open · 0/1", fee: "€350", time: "Sat 21 Nov", img: "clips/photog-review.mp4" },
  { tag: "HIRING", roles: "1 ROLE", title: "Acoustic duo for a wedding", by: "Hotel Sol Nerja", city: "Nerja", role: "Acoustic duo", open: "Open · 0/1", fee: "€450", img: "clips/guitar.mp4" },
];
export const DECK_FROM = 11.1;
/** the gig deck's front card scale: S4's flip ends on it, S5 starts from it (same function, same state) */
export const deckScale = (_t?: number) => 1.7;
export const DECK_Y = 600;

/** "What's new?": the app's new-post sheet (444 x 356 app px) */
export const PanelA: React.FC<{ t: number }> = ({ t }) => {
  const press = Math.sin(Math.PI * c01((t - 10.4) / 0.2)), sel = k(t, 10.42, 0.2), cont = Math.sin(Math.PI * c01((t - 10.54) / 0.2)), rip = c01((t - 10.4) / 0.55);
  const rows: { ico: "calendar" | "user" | "plus"; l: string }[] = [{ ico: "calendar", l: "I'm available" }, { ico: "user", l: "Let's collab" }, { ico: "plus", l: "Add new work" }];
  return (
    <div style={{ width: 444, height: 356, borderRadius: 22, background: C.card, border: `1px solid ${C.border}`, boxShadow: SHADOW, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 20, top: 18, ...F(24, 800, C.cream, { letterSpacing: "-0.03em" }) }}>What's new?</div>
      {rows.map((r, i) => {
        const on = i === 0;
        return (
          <div key={r.l} style={{ position: "absolute", left: 20, top: 66 + i * 74, width: 404, height: 64, borderRadius: 14, display: "flex", alignItems: "center", gap: 14, padding: "0 14px", boxSizing: "border-box",
            background: on ? lerpHex(C.card2, "#3A2019", sel) : C.card2, border: `1.5px solid ${on ? lerpHex(C.border, C.coral, sel) : C.border}`, transform: on ? `scale(${1 - 0.04 * press})` : undefined }}>
            <div style={{ width: 38, height: 38, borderRadius: 19, background: on ? lerpHex(C.bg, C.coral, sel) : C.bg, display: "flex", alignItems: "center", justifyContent: "center" }}><Ico n={r.ico} s={20} c={C.cream} /></div>
            <div style={{ flex: 1 }}><div style={F(18, 700)}>{r.l}</div></div>
            {on && <div style={{ width: 24, height: 24, borderRadius: 12, background: C.coral, display: "flex", alignItems: "center", justifyContent: "center", opacity: sel, transform: `scale(${sel})` }}><Ico n="check" s={15} w={2.8} /></div>}
          </div>
        );
      })}
      {rip > 0 && rip < 1 && <div style={{ position: "absolute", left: 222 - 120, top: 98 - 120, width: 240, height: 240, borderRadius: 120, border: `2px solid rgba(226,90,61,${0.7 * (1 - rip)})`, transform: `scale(${0.2 + rip * 0.8})` }} />}
      <div style={{ position: "absolute", left: 20, top: 290, width: 404, transform: `scale(${1 - 0.04 * cont})` }}><Pill label="Continue" icon={<Ico n="arrow" s={16} w={2.2} />} w="100%" h={46} size={16} /></div>
    </div>
  );
};

const DAYS = [["Mon", 16], ["Tue", 17], ["Wed", 18], ["Thu", 19], ["Fri", 20], ["Sat", 21], ["Sun", 22]] as const;
/** the available post (444 x 310 app px): coral AVAILABLE pill, "Available this weekend", the week strip (Fri Sat Sun light up) */
export const PanelB: React.FC<{ t: number }> = ({ t }) => (
  <div style={{ width: 444, height: 310, borderRadius: 22, background: C.card, border: `1px solid ${C.border}`, boxShadow: SHADOW, position: "relative", overflow: "hidden" }}>
    <div style={{ position: "absolute", left: 20, top: 18, right: 20, display: "flex", alignItems: "center", gap: 12 }}>
      <Avatar s={44} src="img/avatars/lucia.jpg" />
      <div style={{ flex: 1 }}><div style={{ display: "flex", alignItems: "center", gap: 6, ...F(16.5, 700) }}>Lucía Moreno<Badge kind="founding" s={15} /></div><div style={F(13, 500, C.muted)}>Just now</div></div>
      <div style={{ padding: "6px 11px", borderRadius: 12, background: C.coral, ...F(11, 700, C.cream, { letterSpacing: "0.12em" }) }}>AVAILABLE</div>
    </div>
    <div style={{ position: "absolute", left: 20, top: 82, ...F(30, 800, C.cream, { letterSpacing: "-0.03em" }) }}>Available this weekend</div>
    <div style={{ position: "absolute", left: 20, top: 124, ...F(14, 500, C.muted) }}>Photographer, Model +1 · Málaga</div>
    <div style={{ position: "absolute", left: 25, top: 160, display: "flex", gap: 5 }}>
      {DAYS.map(([d, n], i) => {
        const lit = i >= 4 ? k(t, 10.84 + (i - 4) * 0.1, 0.18) : 0; const pop = i >= 4 ? 1 + 0.14 * Math.sin(Math.PI * c01((t - 10.84 - (i - 4) * 0.1) / 0.3)) : 1;
        return <div key={d} style={{ width: 52, height: 72, borderRadius: 14, background: lerpHex(C.card2, C.coral, lit), border: `1px solid ${lerpHex(C.border, C.coral, lit)}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2, transform: `scale(${pop})` }}>
          <span style={F(12, 600, lerpHex(C.muted, C.cream, lit))}>{d}</span><span style={F(22, 800)}>{n}</span></div>;
      })}
    </div>
    <div style={{ position: "absolute", left: 20, top: 252, display: "flex", gap: 8 }}><Chip label="Photography" /><Chip label="Model" /></div>
  </div>
);

export const GigFace: React.FC<{ i: number }> = ({ i }) => <Seq from={DECK_FROM}><GigCard g={GIGS[i]} /></Seq>;
