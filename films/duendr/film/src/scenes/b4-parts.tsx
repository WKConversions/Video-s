// B4 helpers: placement, demo cards (Lucía profile, Javi wallet/profile, recommendation cards), the "0" disc.
import React from "react";
import { Sequence } from "remotion";
import { C, SANS, FPS, c01, mix, Media } from "../kit";
import { Avatar, Badge, Ico, PersonRow } from "../ui";

export const F = (size: number, weight = 500, color: string = C.cream, extra: React.CSSProperties = {}): React.CSSProperties => ({ fontFamily: SANS, fontSize: size, fontWeight: weight, color, letterSpacing: "-0.01em", ...extra });

/** centres its child on (x, y) in the frame, scaled and rotated about its centre */
export const Place: React.FC<{ x: number; y: number; s?: number; r?: number; o?: number; t?: number; amp?: number; children?: React.ReactNode }> = ({ x, y, s = 1, r = 0, o = 1, t, amp = 5, children }) => {
  if (t !== undefined) { y += Math.sin(t * 2.7 + x * 0.01) * amp; s *= 1 + 0.006 * Math.sin(t * 1.9); }
  if (o <= 0.003 || s <= 0.001) return null;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, transform: `translate(${x}px, ${y}px)` }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: "max-content", opacity: o < 0.999 ? o : undefined, transform: `translate(-50%, -50%) scale(${s})${r ? ` rotate(${r}deg)` : ""}` }}>{children}</div>
    </div>
  );
};
/** resets the clips' clock to the scene start */
export const Seq: React.FC<{ from: number; children?: React.ReactNode }> = ({ from, children }) => <Sequence from={Math.round(from * FPS)} layout="none">{children}</Sequence>;

export const Card: React.FC<{ w: number; children?: React.ReactNode; pad?: number; style?: React.CSSProperties }> = ({ w, children, pad = 16, style }) => (
  <div style={{ width: w, borderRadius: 18, background: C.card, border: `1px solid ${C.border}`, padding: pad, boxSizing: "border-box", display: "flex", flexDirection: "column", gap: 10, ...style }}>{children}</div>
);

/** Lucía Moreno's profile card (demo) */
export const LuciaCard: React.FC = () => (
  <Card w={360}>
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <Avatar s={56} src="img/avatars/lucia.jpg" />
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={F(19, 800)}>Lucía Moreno</span><Badge kind="founding" s={16} /></div>
        <div style={F(13, 500, C.muted)}>Photographer, Model +1 · Málaga</div>
      </div>
    </div>
    <div style={{ display: "flex", gap: 8 }}>
      {["clips/model-shoot.mp4", "clips/portrait-hair.mp4", "clips/photog-lens.mp4"].map((s) => <Media key={s} src={s} w={102} h={76} r={10} shadow="none" />)}
    </div>
  </Card>
);

/** a recommendation card (their style: venue avatar, RECOMMENDED tag, a short line) */
export const RecCard: React.FC<{ venue: string; sub: string; quote: string }> = ({ venue, sub, quote }) => (
  <Card w={380} style={{ gap: 12 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <Avatar s={40} initials={venue.split(" ").map((s) => s[0]).join("").slice(0, 2)} tint={C.cream} />
      <div><div style={F(16, 700)}>{venue}</div><div style={F(12.5, 500, C.muted)}>{sub}</div></div>
      <div style={{ flex: 1 }} />
      <div style={{ display: "flex", alignItems: "center", gap: 4, ...F(10.5, 700, C.coral, { letterSpacing: "0.12em" }) }}><Ico n="check" s={13} c={C.coral} w={2.6} />RECOMMENDED</div>
    </div>
    <div style={F(24, 700, C.cream, { lineHeight: 1.18, letterSpacing: "-0.02em" })}>{quote}</div>
    <div style={{ display: "flex", alignItems: "center", gap: 3 }}>{[0, 1, 2, 3, 4].map((i) => <Ico key={i} n="star" s={15} c={C.coral} w={2} />)}<span style={F(12.5, 500, C.muted, { marginLeft: 8 })}>for Javi Ortega · DJ</span></div>
  </Card>
);
export const RECS = [
  { venue: "Casa Brisa", sub: "Beach club · Marbella", quote: "Packed dance floor, perfect set." },
  { venue: "La Terraza", sub: "Rooftop · Málaga", quote: "Great energy." },
  { venue: "Atelier Mar", sub: "Brand · Málaga", quote: "Easy to work with." },
];

/** Javi's booking wallet (S10). The fee text is drawn by the scene (it flies in), so the slot is only reserved here. strike 0..1 draws the line through the fee row */
export const WALLET_W = 444, WALLET_H = 284;
export const WALLET_SLOT = { x: -222 + 20 + 80, y: 28 }; // the fee's centre relative to the card centre, app px
export const Wallet: React.FC<{ strike?: number; show?: number }> = ({ strike = 0, show = 1 }) => (
  <Card w={WALLET_W} pad={20} style={{ height: WALLET_H, gap: 0 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 14, height: 56 }}>
      <Avatar s={56} initials="JO" />
      <div><div style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={F(22, 800)}>Javi Ortega</span><Badge s={18} /></div><div style={F(14, 500, C.muted)}>DJ, Producer · Marbella</div></div>
    </div>
    <div style={{ height: 1, background: C.border, margin: "18px 0 12px" }} />
    <div style={F(13.5, 600, C.muted, { letterSpacing: "0.02em" })}>Casa Brisa · Sat 21 Nov · fee kept in full</div>
    <div style={{ height: 78 }} />
    <div style={{ position: "relative", display: "flex", alignItems: "center", height: 34, borderRadius: 10, background: C.card2, padding: "0 12px", opacity: show, ...F(16, 600, C.muted) }}>
      <span>Duendr fee</span><div style={{ flex: 1 }} /><span style={F(16, 700, C.cream)}>−€0</span>
      <div style={{ position: "absolute", left: 8, top: 16, width: `calc(100% - 16px)`, height: 2.5, borderRadius: 2, background: C.coral, transformOrigin: "0 50%", transform: `scaleX(${c01(strike)})` }} />
    </div>
  </Card>
);

/** Javi's profile (S11): the recommendation counter and the badge that lights up */
export const JaviProfile: React.FC<{ count: number; pop: number; lit: number }> = ({ count, pop, lit }) => (
  <Card w={444} pad={22} style={{ gap: 16 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <Avatar s={76} initials="JO" />
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}><span style={F(28, 800)}>Javi Ortega</span>
          <div style={{ position: "relative", width: 24, height: 24, filter: `grayscale(${1 - lit}) brightness(${mix(0.7, 1, lit)})`, boxShadow: lit > 0.01 ? `0 0 ${28 * lit}px rgba(76,141,246,${0.8 * lit})` : undefined, borderRadius: 12 }}><Badge s={24} /></div></div>
        <div style={F(15.5, 500, C.muted)}>DJ, Producer · Marbella</div>
      </div>
    </div>
    <div style={{ height: 1, background: C.border }} />
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      <div style={{ ...F(64, 900, C.cream, { letterSpacing: "-0.04em", lineHeight: 1 }), width: 52, textAlign: "center", transform: `scale(${1 + 0.22 * pop})`, color: pop > 0.05 ? C.coralL : C.cream }}>{count}</div>
      <div style={F(18, 700, C.cream, { lineHeight: 1.15 })}>recommendations<div style={F(13.5, 500, C.muted)}>from completed bookings</div></div>
      <div style={{ flex: 1 }} />
      <div style={{ display: "flex", alignItems: "center", gap: 6, ...F(13, 600) }}><span style={{ width: 7, height: 7, borderRadius: 4, background: C.coral }} />Weekends</div>
    </div>
  </Card>
);

/** the people list (S11); Javi's row climbs from last to first. p 0..1 */
export const LIST_W = 444, ROW_H = 64, LIST_PAD = 14;
export const JAVI_BADGE_X = 58 + 112 + 6 + 8; // from the row's left, app px
export const PeopleList: React.FC<{ p: number; lit: number }> = ({ p, lit }) => {
  const others = [
    { name: "Nadia Vega", roles: "Dancer, Choreographer", city: "Málaga", avatar: "img/avatars/nadia.jpg", avail: "Most days" },
    { name: "Mateo Ruiz", roles: "Videographer, Photographer", city: "Marbella", avatar: "img/avatars/mateo.jpg", avail: "Weekends", badge: "verified" as const },
    { name: "Lucía Moreno", roles: "Photographer, Model +1", city: "Málaga", avatar: "img/avatars/lucia.jpg", avail: "Most days", badge: "founding" as const },
  ];
  return (
    <div style={{ width: LIST_W, height: ROW_H * 4 + LIST_PAD * 2, borderRadius: 20, background: C.card, border: `1px solid ${C.border}`, boxSizing: "border-box", padding: LIST_PAD, position: "relative" }}>
      {others.map((o, i) => (
        <div key={o.name} style={{ position: "absolute", left: LIST_PAD, top: LIST_PAD, transform: `translateY(${(i + p) * ROW_H}px)`, opacity: mix(1, 0.8, p) }}><PersonRow p={o} w={LIST_W - 2 * LIST_PAD} /></div>
      ))}
      <div style={{ position: "absolute", left: LIST_PAD - 8, top: LIST_PAD, width: LIST_W - 2 * LIST_PAD + 16, height: ROW_H, borderRadius: 14, transform: `translateY(${3 * (1 - p) * ROW_H}px)`, background: C.card2, boxShadow: p > 0.01 ? `0 0 0 1.5px rgba(226,90,61,${0.7 * p}), 0 0 ${30 * p}px rgba(226,90,61,${0.3 * p})` : undefined, display: "flex", alignItems: "center", gap: 12, padding: "0 8px", boxSizing: "border-box" }}>
        <Avatar s={46} initials="JO" />
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ ...F(16.5, 700), width: 112, whiteSpace: "nowrap" }}>Javi Ortega</span>
            <div style={{ borderRadius: 9, boxShadow: lit > 0 ? `0 0 ${16 * lit}px rgba(76,141,246,0.8)` : undefined }}><Badge s={16} /></div></div>
          <div style={F(13.5, 500, C.muted, { whiteSpace: "nowrap" })}>DJ, Producer · Marbella · €200–€400</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, ...F(12.5, 600) }}><span style={{ width: 7, height: 7, borderRadius: 4, background: C.coral }} />Weekends</div>
      </div>
    </div>
  );
};

/** the "0": the app icon's coral circle as a disc with an opening hole. Geometry shared by S10 and S11. */
export const DISC = { x: 790, y: 330, R: 125 };
