// B3 helpers: S7 (post + browse + right fit) and S8 (connect, chat, booking). Duendr's own UI, demo data only.
import React from "react";
import { Sequence } from "remotion";
import { C, SANS, SHADOW, GLOW, IN, SOFT, Media, Rise, c01, k, mix, sp } from "../kit";
import { Badge, Chip, Ico, Pill } from "../ui";
import { Easing, Freeze } from "remotion";
const FREEZE_CLIPS = false; // temp diagnostic

export const F = (size: number, weight = 500, color: string = C.cream, extra: React.CSSProperties = {}): React.CSSProperties => ({ fontFamily: SANS, fontSize: size, fontWeight: weight, color, letterSpacing: "-0.01em", ...extra });

/** a clip card whose video starts at film time `from` (clips are 8 s) */
export const Clip: React.FC<{ src: string; w: number; h: number; from: number; r?: number; shadow?: string }> = ({ from, ...p }) => (
  <Sequence from={Math.round(from * 60)} layout="none">{FREEZE_CLIPS ? <Freeze frame={0}><Media {...p} r={p.r ?? 0} shadow={p.shadow ?? "none"} /></Freeze> : <Media {...p} r={p.r ?? 0} shadow={p.shadow ?? "none"} />}</Sequence>
);

/** big caption at the top of the frame; words rise on their VO times, then leave upward at `exit` */
export const Cap: React.FC<{ t: number; text: string; times: number[]; exit: number; y?: number; size?: number }> = ({ t, text, times, exit, y = 135, size = 110 }) => {
  if (t < times[0] - 0.3 || t > exit + 0.45) return null;
  return (
    <div style={{ position: "absolute", left: 0, top: y - size * 0.55, width: 1920, display: "flex", justifyContent: "center" }}>
      <Rise text={text} t={t} at={times[0]} times={times.map((x) => x - 0.08)} size={size} out={c01((t - exit) / 0.22)} style={{ paddingLeft: "0.24em" }} />
    </div>
  );
};

// ------------------------------------------------------------------ portfolio cards (people list, "Find talent" side)
export type Talent = { name: string; sub: string; chips: string[]; clip: string; initials: string; badge?: boolean };
export const TAL: Talent[] = [
  { name: "Tomás", sub: "Guitarist · Cádiz", chips: ["Guitarist", "Live"], clip: "clips/guitar.mp4", initials: "T" },
  { name: "Violinist", sub: "Strings · Live", chips: ["Violin", "Live"], clip: "clips/fiddle.mp4", initials: "V" },
  { name: "Leo Martín", sub: "Pianist · Sevilla", chips: ["Pianist", "Live"], clip: "clips/piano.mp4", initials: "LM", badge: true },
  { name: "Javi Ortega", sub: "Marbella · €200–€400", chips: ["DJ", "Producer"], clip: "clips/dj-stage.mp4", initials: "JO", badge: true },
  { name: "Vinyl DJ", sub: "Turntables · Live", chips: ["DJ", "Vinyl"], clip: "clips/dj-turntable.mp4", initials: "D" },
  { name: "Nadia Vega", sub: "Dancer · Málaga", chips: ["Dancer", "Choreographer"], clip: "clips/dance-smoke.mp4", initials: "NV" },
];
export const CLIP_FROM = 19.0;

/** 400 x 400 card: work clip, avatar + name, role chips, Connect */
export const TalentCard: React.FC<{ p: Talent; press?: number; label?: string; done?: number }> = ({ p, press = 0, label = "Connect", done = 0 }) => (
  <div style={{ width: 400, height: 400, borderRadius: 20, overflow: "hidden", background: C.card, border: `1px solid ${C.border}`, boxShadow: SHADOW, position: "relative" }}>
    <div style={{ width: 400, height: 225, position: "relative" }}>
      <Clip src={p.clip} w={400} h={225} from={CLIP_FROM} />
      <div style={{ position: "absolute", left: 12, top: 12, display: "flex", alignItems: "center", gap: 6, height: 26, padding: "0 10px", borderRadius: 13, background: "rgba(22,20,19,0.7)", ...F(14, 600) }}>
        <span style={{ width: 7, height: 7, borderRadius: 4, background: C.coral }} />Available</div>
    </div>
    <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, height: 44 }}>
        <div style={{ width: 44, height: 44, borderRadius: 22, background: C.card2, display: "flex", alignItems: "center", justifyContent: "center", flex: "none", ...F(15, 700, C.muted) }}>{p.initials}</div>
        <div style={{ minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={F(18, 700)}>{p.name}</span>{p.badge && <Badge s={15} />}</div>
          <div style={F(15, 500, C.muted, { whiteSpace: "nowrap" })}>{p.sub}</div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, height: 34 }}>{p.chips.map((c) => <Chip key={c} label={c} />)}</div>
      <div style={{ transform: `scale(${1 - 0.07 * Math.sin(Math.PI * c01(press))})` }}>
        <div style={{ position: "relative" }}>
          <Pill label={label} w="100%" h={44} icon={<Ico n="arrow" s={16} w={2.2} />} />
          {done > 0.01 && <div style={{ position: "absolute", inset: 0, opacity: c01(done) }}><Pill kind="cream" label="Connected" w="100%" h={44} icon={<span style={{ display: "inline-flex", transform: `scale(${c01(done)})` }}><Ico n="check" s={16} c={C.ink} w={2.6} /></span>} /></div>}
        </div>
      </div>
    </div>
  </div>
);

export const RowE = Easing.bezier(0.3, 0.55, 0.3, 1);
export const rowOff = (t: number) => 3000 * (1 - k(t, 19.4, 2.0, RowE));
/** Javi's card: in the row, then lifted. x/y/scale about the frame centre; identical in S7 and S8 */
export const javiPose = (t: number) => { const q = sp(t, 20.7, 1.5, 0.8); return { x: 960 + rowOff(t), y: 590 - 15 * q, s: 1.35 + 0.2 * q }; };

/** Javi's card with the coral ring ("Right fit"), the check pill and the press ripple. cx/cy/s are the card's centre and scale. */
export const JaviGroup: React.FC<{ t: number; x: number; y: number; s: number; opacity?: number }> = ({ t, x, y, s, opacity = 1 }) => {
  const ring = sp(t, 21.06, 1.8, 0.7) * (1 - k(t, 22.7, 0.25, SOFT));
  const pill = sp(t, 21.14, 1.9, 0.62) * (1 - k(t, 21.95, 0.2, IN));
  const press = (t - 22.04) / 0.3;
  const rip = k(t, 22.04, 0.7);
  const done = k(t, 22.36, 0.16);
  return (
    <div style={{ position: "absolute", left: 760, top: 340, width: 400, height: 400, opacity, transform: `translate(${x - 960}px,${y - 540}px) scale(${s})` }}>
      {ring > 0.01 && <div style={{ position: "absolute", inset: -10, borderRadius: 28, border: `4px solid ${C.coral}`, boxShadow: GLOW, opacity: c01(ring), transform: `scale(${mix(1.12, 1, c01(ring))})` }} />}
      <TalentCard p={TAL[3]} press={press} done={done} />
      {t > 22.04 && t < 22.8 && <div style={{ position: "absolute", left: 200 - 220, top: 361 - 220, width: 440, height: 440, borderRadius: 220, border: `3px solid ${C.coral}`, opacity: 0.8 * (1 - rip), transform: `scale(${mix(0.1, 0.9, rip)})` }} />}
      {pill > 0.01 && <div style={{ position: "absolute", left: 200, top: -6, transform: `translate(-50%,-50%) scale(${pill * 1.15})`, opacity: c01(pill * 2) }}>
        <Pill label="Right fit" h={44} size={18} icon={<Ico n="check" s={20} w={2.8} />} /></div>}
    </div>
  );
};

// ------------------------------------------------------------------ S7: Casa Brisa's post
export const PostCard: React.FC<{ t: number }> = ({ t }) => {
  const TXT = "Live DJ for sunset sessions";
  const n = Math.floor(c01((t - 18.42) / 0.5) * TXT.length);
  const chip = (a: number) => sp(t, a, 2, 0.7);
  const press = Math.sin(Math.PI * c01((t - 19.0) / 0.25));
  const posted = t > 19.12;
  return (
    <div style={{ width: 444, height: 340, borderRadius: 20, background: C.card, border: `1px solid ${C.border}`, boxShadow: SHADOW, padding: 18, display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: C.cream, display: "flex", alignItems: "center", justifyContent: "center", ...F(20, 800, C.ink) }}>C</div>
        <div><div style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={F(17, 700)}>Casa Brisa</span><Badge s={15} /></div><div style={F(14, 500, C.muted)}>Beach club · Marbella</div></div>
        <div style={{ flex: 1 }} /><span style={{ ...F(12, 700, C.cream, { letterSpacing: "0.12em" }), padding: "4px 8px", borderRadius: 6, background: C.card2 }}>HIRING</span>
      </div>
      <div style={{ height: 76 }}>
        <div style={F(12, 700, C.dim, { letterSpacing: "0.12em" })}>WHAT DO YOU NEED?</div>
        <div style={F(25, 800, C.cream, { lineHeight: 1.18, marginTop: 4 })}>{TXT.slice(0, n)}<span style={{ display: "inline-block", width: 3, height: 24, background: C.coral, marginLeft: 2, verticalAlign: -3, opacity: Math.floor(t * 3) % 2 === 0 || n < TXT.length ? 1 : 0.2 }} /></div>
      </div>
      <div style={{ display: "flex", gap: 8, height: 34 }}>
        {["Live music", "DJ"].map((c, i) => <div key={c} style={{ transform: `scale(${mix(0.5, 1, c01(chip(18.62 + i * 0.12)))})`, opacity: c01(chip(18.62 + i * 0.12) * 3) }}><Chip label={c} on /></div>)}
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        {[["calendar", "Fri 20 Nov", 18.84], ["pin", "€280", 18.92]].map(([ic, lb, a]) => (
          <div key={lb as string} style={{ flex: 1, height: 42, borderRadius: 12, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 8, padding: "0 12px", ...F(15, 600), opacity: c01(sp(t, a as number, 2, 0.8) * 2) }}>
            {ic === "calendar" ? <Ico n="calendar" s={18} c={C.muted} /> : <span style={F(16, 700, C.muted)}>€</span>}{ic === "calendar" ? lb : "280"}</div>))}
      </div>
      <div style={{ transform: `scale(${1 - 0.07 * press})` }}>
        <Pill label={posted ? "Posted" : "Post"} w="100%" h={46} icon={<Ico n={posted ? "check" : "arrow"} s={17} w={2.4} />} />
      </div>
    </div>
  );
};

// ------------------------------------------------------------------ S8: chat
export const Dots: React.FC<{ t: number; me?: boolean }> = ({ t, me }) => (
  <div style={{ display: "inline-flex", gap: 6, alignItems: "center", height: 40, padding: "0 16px", borderRadius: 18, borderBottomRightRadius: me ? 6 : 18, borderBottomLeftRadius: me ? 18 : 6, background: me ? "rgba(226,90,61,0.55)" : C.card2 }}>
    {[0, 1, 2].map((i) => <span key={i} style={{ width: 8, height: 8, borderRadius: 4, background: C.cream, opacity: 0.4 + 0.6 * Math.max(0, Math.sin(t * 11 - i * 0.9)) }} />)}
  </div>
);
const Slot: React.FC<{ t: number; me?: boolean; dots?: [number, number]; at: number; text: string }> = ({ t, me, dots, at, text }) => {
  const q = sp(t, at, 2.0, 0.7);
  const showDots = dots && t >= dots[0] && t < at;
  return (
    <div style={{ height: 72, display: "flex", justifyContent: me ? "flex-end" : "flex-start", alignItems: "flex-end" }}>
      {showDots && <div style={{ transform: `scale(${mix(0.6, 1, c01(sp(t, dots![0], 2.2, 0.7)))})`, transformOrigin: me ? "100% 100%" : "0% 100%" }}><Dots t={t} me={me} /></div>}
      {t >= at && <div style={{ transform: `scale(${mix(0.6, 1, c01(q))})`, opacity: c01(q * 3), transformOrigin: me ? "100% 100%" : "0% 100%" }}>
        <div style={{ maxWidth: 380, padding: "10px 16px", borderRadius: 18, borderBottomRightRadius: me ? 6 : 18, borderBottomLeftRadius: me ? 18 : 6, background: me ? C.coral : C.card2, ...F(21, 500, C.cream, { lineHeight: 1.3 }) }}>{text}</div></div>}
    </div>
  );
};
export const CHAT = { x: 960, y: 612, s: 1.95, w: 500, h: 410 };
/** screen position of a point (lx, ly) in the chat panel's own px */
export const chatPt = (lx: number, ly: number): [number, number] => [CHAT.x + (lx - CHAT.w / 2) * CHAT.s, CHAT.y + (ly - CHAT.h / 2) * CHAT.s];
export const HDR_C = chatPt(36, 32), HDR_J = chatPt(60, 32);

export const ChatPanel: React.FC<{ t: number; inner?: number; hideConfirm?: boolean }> = ({ t, inner = 1, hideConfirm }) => {
  const conf = sp(t, 24.54, 1.9, 0.75);
  const press = Math.sin(Math.PI * c01((t - 24.8) / 0.25));
  const hdr = t >= 23.4;
  return (
    <div style={{ width: CHAT.w, height: CHAT.h, borderRadius: 22, background: C.card, border: `1px solid ${C.border}`, boxShadow: SHADOW, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div style={{ height: 64, borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", padding: "0 16px", gap: 0, flex: "none" }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: C.cream, display: "flex", alignItems: "center", justifyContent: "center", ...F(20, 800, C.ink), opacity: hdr ? 1 : 0 }}>C</div>
        <div style={{ width: 40, height: 40, borderRadius: 20, background: C.card2, border: `2px solid ${C.card}`, marginLeft: -16, display: "flex", alignItems: "center", justifyContent: "center", ...F(14, 700, C.muted), opacity: hdr ? 1 : 0, boxSizing: "content-box" as const, flex: "none" }}>JO</div>
        <div style={{ marginLeft: 14, opacity: inner }}><div style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={F(18, 700)}>Javi Ortega</span><Badge s={15} /></div><div style={F(14, 500, C.muted)}>Casa Brisa · Sunset sessions</div></div>
      </div>
      <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
        <Slot t={t} me at={23.28} text="Hi Javi! Sunset set this weekend?" />
        <Slot t={t} dots={[23.42, 23.74]} at={23.74} text="Works for me. Sat 21 Nov, 20:00?" />
        <Slot t={t} me dots={[24.02, 24.3]} at={24.3} text="Perfect. €280, 3 hours." />
      </div>
      <div style={{ height: 76, padding: "0 16px", display: "flex", alignItems: "center", position: "relative", flex: "none", borderTop: `1px solid ${C.border}` }}>
        <div style={{ position: "absolute", left: 16, right: 16, height: 46, borderRadius: 23, background: C.card2, display: "flex", alignItems: "center", padding: "0 16px", ...F(17, 500, C.dim), opacity: (1 - c01(conf * 5)) * inner }}>Message Javi…<div style={{ flex: 1 }} /><Ico n="send" s={18} c={C.muted} /></div>
        {conf > 0.01 && !hideConfirm && <div style={{ position: "absolute", left: 16, right: 16, transformOrigin: "100% 50%", transform: `scaleX(${mix(0.12, 1, c01(conf)) * (1 - 0.06 * press)}) scaleY(${1 - 0.06 * press})`, opacity: c01(conf * 2.5) }}>
          <Pill label="Confirm booking" w="100%" h={46} size={18} icon={<Ico n="check" s={17} w={2.6} />} /></div>}
        {t > 24.8 && t < 25.3 && <div style={{ position: "absolute", left: 250 - 150, top: 38 - 150, width: 300, height: 300, borderRadius: 150, border: `3px solid ${C.coral}`, opacity: 0.8 * (1 - k(t, 24.8, 0.5)), transform: `scale(${mix(0.1, 1, k(t, 24.8, 0.5))})` }} />}
      </div>
    </div>
  );
};
