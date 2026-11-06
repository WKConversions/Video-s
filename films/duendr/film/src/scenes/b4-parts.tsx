// B4 helpers: placement, demo cards (Lucía profile, Javi wallet/profile, recommendation cards), the "0" disc.
import React from "react";
import { Sequence } from "remotion";
import { C, SANS, FPS, c01, mix, k, sp, SOFT, Media } from "../kit";
import { Pill } from "../ui";
import { Avatar, Badge, Ico, PersonRow } from "../ui";

export const F = (size: number, weight = 500, color: string = C.cream, extra: React.CSSProperties = {}): React.CSSProperties => ({ fontFamily: SANS, fontSize: size, fontWeight: weight, color, letterSpacing: "-0.01em", ...extra });

/** centres its child on (x, y) in the frame, scaled and rotated about its centre */
export const Place: React.FC<{ x: number; y: number; s?: number; r?: number; o?: number; t?: number; amp?: number; children?: React.ReactNode }> = ({ x, y, s = 1, r = 0, o = 1, t, amp = 0, children }) => {
  if (t !== undefined) { y += Math.sin(t * 1.3 + x * 0.01) * amp; s *= 1 + 0.014 * Math.sin(t * 1.1); }
  if (o <= 0.003 || s <= 0.001) return null;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, transform: `translate(${x}px, ${y}px)` }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: "max-content", opacity: o < 0.999 ? o : undefined, transform: `translate(-50%, -50%) scale(${s})${r ? ` rotate(${r}deg)` : ""}` }}>{children}</div>
    </div>
  );
};
/** kit Rise with a small compositor layer per moving word (the browser would otherwise snap each blurred word to whole pixels: SHAKE) */
export const RiseL: React.FC<{ text: string; t: number; at: number; size: number; color?: string; weight?: number; gap?: number; times?: number[]; out?: number; spacing?: string; colors?: (string | undefined)[] }> =
  ({ text, t, at, size, color = C.cream, weight = 800, gap = 0.07, times, out = 0, spacing = "-0.035em", colors }) => (
    <div style={{ fontFamily: SANS, fontWeight: weight, fontSize: size, color, lineHeight: 1.04, letterSpacing: spacing, whiteSpace: "nowrap" }}>
      {text.split(" ").map((wd, j) => { const q = c01(sp(t, times ? times[j] : at + j * gap, 1.8, 0.75)); const o = c01(out); const off = (1 - q) * 0.4 * size - o * 0.3 * size; const mv = Math.abs(off) >= 0.6; const bl = q < 0.97 || o > 0.01;
        return <span key={j} style={{ display: "inline-block", marginRight: "0.24em", color: colors?.[j] ?? color, opacity: c01(q * 1.6) * (1 - o), transform: `translateY(${mv ? off : 0}px)`, willChange: mv || bl ? "transform, opacity" : undefined,
          filter: bl ? `blur(${(1 - q) * 10 + o * 10}px)` : undefined }}>{wd}</span>; })}
    </div>
  );

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
      <div><div style={F(16, 700)}>{venue}</div><div style={F(14.5, 500, C.muted)}>{sub}</div></div>
      <div style={{ flex: 1 }} />
      <div style={{ display: "flex", alignItems: "center", gap: 4, ...F(14, 700, C.coral, { letterSpacing: "0.1em" }) }}><Ico n="check" s={16} c={C.coral} w={2.6} />RECOMMENDED</div>
    </div>
    <div style={F(24, 700, C.cream, { lineHeight: 1.18, letterSpacing: "-0.02em" })}>{quote}</div>
  </Card>
);
export const RECS = [
  { venue: "Casa Brisa", sub: "Beach club · Marbella", quote: "Packed dance floor, perfect set." },
  { venue: "La Terraza", sub: "Rooftop · Málaga", quote: "Great energy." },
  { venue: "Atelier Mar", sub: "Brand · Málaga", quote: "Easy to work with." },
];

/** Javi's card (S10): who, when, and a slot where the EUR 280 lands; their "Full fee" pill springs in beside it. No fee line: Duendr takes nothing. */
export const FEE_W = 444, FEE_H = 222;
export const FEE_SLOT = { x: -222 + 20 + 80, y: 53 }; // the fee's centre relative to the card centre, app px
export const FeeCard: React.FC<{ info?: number; pill?: number }> = ({ info = 1, pill = 1 }) => (
  <Card w={FEE_W} pad={20} style={{ height: FEE_H, gap: 0, position: "relative" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 14, height: 56 }}>
      <Avatar s={56} initials="JO" />
      <div><div style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={F(22, 800)}>Javi Ortega</span><Badge s={18} /></div><div style={F(15.5, 500, C.muted)}>DJ, Producer · Marbella</div></div>
    </div>
    <div style={{ height: 1, background: C.border, margin: "16px 0 12px" }} />
    <div style={F(15.5, 600, C.muted, { letterSpacing: "0.01em", opacity: info })}>Casa Brisa · Sat 21 Nov</div>
    <div style={{ position: "absolute", left: 20 + 178, top: 20 + 56 + 29 + 22 + 20, transform: `scale(${Math.max(0, pill)})`, opacity: c01(pill * 3), transformOrigin: "0 50%" }}><Pill label="Full fee" h={34} size={16} /></div>
  </Card>
);

/** Javi's profile (S11): "Recommended by" three venue discs, and the badge's glow. m 0..1 morphs the whole card into his row of the people list (header only). */
export const PROF_H = 199;
export const JaviProfile: React.FC<{ pops: number[]; lit: number; m?: number }> = ({ pops, lit, m = 0 }) => {
  const av = mix(76, 46, m), bs = mix(24, 16, m);
  return (
    <Card w={mix(444, 432, m)} pad={0} style={{ height: mix(PROF_H, ROW_H, m), padding: `${mix(22, 9, m)}px ${mix(22, 8, m)}px`, gap: 16, overflow: "hidden", position: "relative", border: `1px solid rgba(46,42,39,${1 - m})` }}>
      <div style={{ position: "absolute", inset: 0, background: C.card2, opacity: m }} />
      <div style={{ display: "flex", alignItems: "center", gap: mix(16, 12, m), position: "relative" }}>
        <Avatar s={av} initials="JO" />
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: mix(8, 6, m) }}><span style={{ ...F(mix(28, 16.5, m), mix(800, 700, m)), whiteSpace: "nowrap" }}>Javi Ortega</span>
            <div style={{ position: "relative", width: bs, height: bs, boxShadow: lit > 0.01 ? `0 0 ${28 * lit}px rgba(76,141,246,${0.8 * lit})` : undefined, borderRadius: bs / 2 }}><Badge s={bs} /></div></div>
          <div style={F(mix(15.5, 13.5, m), 500, C.muted, { whiteSpace: "nowrap" })}>DJ, Producer · Marbella<span style={{ opacity: c01((m - 0.4) / 0.6) }}> · €200–€400</span></div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, opacity: c01((m - 0.4) / 0.6), ...F(12.5, 600) }}><span style={{ width: 7, height: 7, borderRadius: 4, background: C.coral }} />Weekends</div>
      </div>
      <div style={{ opacity: 1 - c01(m * 1.8), display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ height: 1, background: C.border }} />
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div><div style={F(18, 700, C.cream, { lineHeight: 1.15 })}>Recommended by</div><div style={F(15.5, 500, C.muted)}>from completed bookings</div></div>
          <div style={{ flex: 1 }} />
          <div style={{ display: "flex", gap: 8 }}>{["CB", "LT", "AM"].map((v, i) => <div key={v} style={{ transform: `scale(${mix(0.3, 1, pops[i] ?? 0)})`, opacity: c01((pops[i] ?? 0) * 3) }}><Avatar s={46} initials={v} tint={C.cream} /></div>)}</div>
        </div>
      </div>
    </Card>
  );
};

/** the people list (S11). Javi stays in the last slot; lift 0..1 raises his row out of the list while the others dim. clip 0..1 grows the card out of his row. */
export const LIST_W = 444, ROW_H = 64, LIST_PAD = 14, LIST_H = ROW_H * 4 + LIST_PAD * 2;
export const JAVI_NAME_W = 90;
const LLIST_ROW_TOP = LIST_PAD + 3 * ROW_H;                 // Javi's row top in the list
export const JAVI_BADGE_X = 58 + JAVI_NAME_W + 6 + 8; // from the row's inner left, app px
export const PeopleList: React.FC<{ lift: number; lit: number; clip?: number; rowO?: number[] }> = ({ lift, lit, clip = 1, rowO = [1, 1, 1] }) => {
  const others = [
    { name: "Nadia Vega", roles: "Dancer, Choreographer", city: "Málaga", avatar: "img/avatars/nadia.jpg", avail: "Most days" },
    { name: "Mateo Ruiz", roles: "Videographer, Photographer", city: "Marbella", avatar: "img/avatars/mateo.jpg", avail: "Weekends", badge: "verified" as const },
    { name: "Lucía Moreno", roles: "Photographer, Model +1", city: "Málaga", avatar: "img/avatars/lucia.jpg", avail: "Most days", badge: "founding" as const },
  ];
  const g = clip, open = g >= 1;
  return (
    <div style={{ width: LIST_W, height: LIST_H, position: "relative" }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: 20, boxShadow: "0 0 2px rgba(0,0,0,0.25), 0 0 30px rgba(0,0,0,0.35), 0 0 90px rgba(0,0,0,0.45)", opacity: g * g }} />
      <div style={{ width: LIST_W, height: LIST_H, borderRadius: 20, background: C.card, border: `1px solid ${C.border}`, boxSizing: "border-box", padding: LIST_PAD, position: "relative",
        clipPath: open ? undefined : `inset(${LLIST_ROW_TOP * (1 - g)}px ${6 * (1 - g)}px ${14 * (1 - g)}px ${6 * (1 - g)}px round ${mix(14, 20, g)}px)` }}>
        {others.map((o, i) => (
          <div key={o.name} style={{ position: "absolute", left: LIST_PAD, top: LIST_PAD, transform: `translateY(${i * ROW_H}px)`, opacity: rowO[i] * mix(1, 0.5, lift) }}><PersonRow p={o} w={LIST_W - 2 * LIST_PAD} /></div>
        ))}
        <div style={{ position: "absolute", left: LIST_PAD - 8, top: LIST_PAD, width: LIST_W - 2 * LIST_PAD + 16, height: ROW_H, borderRadius: 14, transform: `translateY(${3 * ROW_H}px) scale(${1 + 0.12 * lift})`, background: C.card2,
          boxShadow: lift > 0.01 ? `0 0 0 1.5px rgba(226,90,61,${0.7 * lift}), 0 0 ${30 * lift}px rgba(226,90,61,${0.3 * lift}), 0 0 ${60 * lift}px rgba(0,0,0,${0.55 * lift})` : undefined, display: "flex", alignItems: "center", gap: 12, padding: "0 8px", boxSizing: "border-box" }}>
          <Avatar s={46} initials="JO" />
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ ...F(16.5, 700), whiteSpace: "nowrap" }}>Javi Ortega</span>
              <div style={{ borderRadius: 9, boxShadow: lit > 0 ? `0 0 ${16 * lit}px rgba(76,141,246,0.8)` : undefined }}><Badge s={16} /></div></div>
            <div style={F(13.5, 500, C.muted, { whiteSpace: "nowrap" })}>DJ, Producer · Marbella · €200–€400</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, ...F(12.5, 600) }}><span style={{ width: 7, height: 7, borderRadius: 4, background: C.coral }} />Weekends</div>
        </div>
      </div>
    </div>
  );
};
/** frame position of the list (scale ls, centred 960 x LY): Javi's row centre y, and his badge centre */
export const javiRow = (ls: number, ly: number, lift = 0) => { const s = 1 + 0.12 * lift; return { cy: ly + (LLIST_ROW_TOP + ROW_H / 2 - LIST_H / 2) * ls, bx: 960 + (LIST_PAD + JAVI_BADGE_X - LIST_W / 2) * s * ls, by: ly + (LLIST_ROW_TOP + ROW_H / 2 - LIST_H / 2) * ls }; };

/** the "0": the app icon's coral circle as a disc with an opening hole. Geometry shared by S10 and S11. */
export const DISC = { x: 800, y: 420, R: 125 };
/** the slow push-in on "0% commission" (about 960, 540); S11's morph starts from the disc scaled by PUSH_END */
export const PUSH = (t: number) => 1 + 0.03 * k(t, 29.9, 0.8, SOFT);
export const PUSH_END = 1.03;
