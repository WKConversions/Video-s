// The interface pieces, rebuilt in voxflow.nl's own style: white cards with soft wide shadows, Geist, teal, the
// site's assistant as the face of the AI receptionist, the site's phone placeholder 06 12 34 56 78.
import React from "react";
import { Img, staticFile } from "remotion";
import { C, F, SHADOW, clamp01, lerp, mix } from "./lib";

const P: Record<string, React.ReactNode> = {
  phone: <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384" />,
  missed: <><path d="m16 2 6 6" /><path d="m22 2-6 6" /><path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384" /></>,
  check: <path d="M20 6 9 17l-5-5" />,
  arrow: <><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></>,
  bell: <><path d="M10.268 21a2 2 0 0 0 3.464 0" /><path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326" /></>,
  calendar: <><path d="M8 2v4" /><path d="M16 2v4" /><rect width="18" height="18" x="3" y="4" rx="2" /><path d="M3 10h18" /></>,
};
export const Icon: React.FC<{ name: keyof typeof P | string; size: number; color?: string; stroke?: number }> = ({ name, size, color = C.ink, stroke = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" style={{ display: "block", flex: "none" }}>{P[name]}</svg>
);

/** The site's assistant, cropped to her face in a disc. */
export const Avatar: React.FC<{ size: number; ring?: string }> = ({ size, ring = "#fff" }) => (
  <div style={{ width: size, height: size, borderRadius: "50%", overflow: "hidden", position: "relative", flex: "none", background: C.tealSoft, boxShadow: `0 0 0 ${Math.max(2, size * 0.05)}px ${ring}` }}>
    <Img src={staticFile("img/assistant.png")} style={{ position: "absolute", width: size * 2.45, left: -size * 0.70, top: -size * 0.28 }} />
  </div>
);

/** A live voice: bars that move with the time, never a loop you can see repeat. */
export const Wave: React.FC<{ t: number; n?: number; h: number; w?: number; color?: string; amp?: number }> = ({ t, n = 7, h, w = 5, color = C.teal, amp = 1 }) => (
  <div style={{ display: "flex", alignItems: "center", gap: w * 0.8, height: h }}>
    {Array.from({ length: n }, (_, i) => {
      const v = 0.28 + 0.72 * Math.abs(Math.sin(t * (5.1 + i * 1.37) + i * 1.9) * Math.sin(t * (2.3 + i * 0.61) + i));
      return <div key={i} style={{ width: w, height: Math.max(w, h * lerp(0.2, v, amp)), borderRadius: w, background: color }} />;
    })}
  </div>
);

/** Ring pulses around a ringing phone icon: two waves a ring cycle (the phone is ringing). */
export const Rings: React.FC<{ t: number; r: number; color?: string; on?: number }> = ({ t, r, color = C.teal, on = 1 }) => (
  <>
    {[0, 0.5].map((ph) => {
      const p = ((t * 1.25 + ph) % 1 + 1) % 1;
      return <div key={ph} style={{ position: "absolute", left: "50%", top: "50%", width: r * 2, height: r * 2, borderRadius: "50%", border: `4px solid ${color}`, background: `${color}22`,
        transform: `translate(-50%, -50%) scale(${1 + p * 1.9})`, opacity: on * (1 - p) * 0.7 }} />;
    })}
  </>
);

export type CallState = "incoming" | "missed" | "answered" | "talk" | "picked" | "night";
const callFace = (s: CallState, t: number, time?: string) => {
  switch (s) {
    case "incoming": case "night": return { label: "Inkomend gesprek", lc: C.teal, right: "accept" as const, left: "ring" as const, time };
    case "missed": return { label: "Gemiste oproep", lc: C.red, right: "time" as const, left: "missed" as const, time };
    case "answered": return { label: "Opgenomen door VoxFlow", lc: C.teal, right: "check" as const, left: "face" as const, time };
    case "talk": return { label: "In gesprek met je klant", lc: C.teal, right: "wave" as const, left: "face" as const, time };
    case "picked": return { label: "Opgenomen binnen 3 sec", lc: C.teal, right: "wave" as const, left: "face" as const, time };
  }
};
/** One face of a call card (the card rolls between faces). */
const CallFace: React.FC<{ s: CallState; t: number; time?: string; ring?: number; press?: number; caller?: string }> = ({ s, t, time, ring = 1, press = 0, caller = "06 12 34 56 78" }) => {
  const f = callFace(s, t, time);
  return (
    <div style={{ height: 116, display: "flex", alignItems: "center", gap: 20, padding: "0 26px 0 22px" }}>
      <div style={{ position: "relative", flex: "none" }}>
        {f.left === "ring" && <><Rings t={t} r={32} on={ring} /><div style={{ width: 64, height: 64, borderRadius: "50%", background: C.tealSoft, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}><Icon name="phone" size={30} color={C.teal} /></div></>}
        {f.left === "missed" && <div style={{ width: 64, height: 64, borderRadius: "50%", background: C.redSoft, display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="missed" size={30} color={C.red} /></div>}
        {f.left === "face" && <Avatar size={64} />}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 25, color: f.lc, whiteSpace: "nowrap" }}>{f.label}</div>
        <div style={{ fontFamily: F.ui, fontWeight: 700, fontSize: 31, color: C.ink, letterSpacing: "-0.01em", whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums" }}>{caller}</div>
      </div>
      {f.right === "time" && <div style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 25, color: C.red, fontVariantNumeric: "tabular-nums" }}>{f.time}</div>}
      {f.right === "accept" && <div style={{ width: 62, height: 62, borderRadius: "50%", background: C.teal, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${1 - 0.12 * Math.sin(Math.PI * clamp01(press))})`,
        boxShadow: `0 0 0 ${10 * Math.sin(Math.PI * clamp01(press))}px ${mix(C.tealSoft, C.white, 0.2)}` }}><Icon name="phone" size={28} color="#fff" /></div>}
      {f.right === "check" && <div style={{ width: 44, height: 44, borderRadius: "50%", background: C.teal, display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="check" size={26} color="#fff" stroke={3} /></div>}
      {f.right === "wave" && <Wave t={t} h={40} />}
    </div>
  );
};
/** A call card that rolls from one face to the next (k 0..1), on the site's white card. */
export const CallCard: React.FC<{ a: CallState; b?: CallState; k?: number; t: number; time?: string; timeB?: string; w?: number; ring?: number; press?: number; caller?: string; style?: React.CSSProperties }> = ({ a, b, k = 0, t, time, timeB, w = 600, ring, press, caller, style }) => (
  <div style={{ width: w, height: 116, borderRadius: 26, background: C.white, boxShadow: SHADOW, overflow: "hidden", position: "relative", ...style }}>
    <div style={{ transform: `translateY(${-k * 116}px)`, filter: k > 0.02 && k < 0.98 ? `blur(${Math.sin(k * Math.PI) * 4}px)` : undefined }}>
      <CallFace s={a} t={t} time={time} ring={ring} press={press} caller={caller} />
      {b && <CallFace s={b} t={t} time={timeB ?? time} caller={caller} />}
    </div>
  </div>
);

/** A chat bubble: the caller's (beige, left) or the assistant's (teal, right); `n` characters typed. */
export const Bubble: React.FC<{ who: "caller" | "ai"; text: string; n?: number; size?: number; style?: React.CSSProperties }> = ({ who, text, n, size = 40, style }) => {
  const shown = n === undefined ? text : text.slice(0, Math.max(0, Math.floor(n)));
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 16, flexDirection: who === "ai" ? "row-reverse" : "row", ...style }}>
      {who === "ai" && <Avatar size={size * 1.5} />}
      <div style={{ padding: `${size * 0.48}px ${size * 0.7}px`, borderRadius: size * 0.7, borderBottomLeftRadius: who === "caller" ? 8 : size * 0.7, borderBottomRightRadius: who === "ai" ? 8 : size * 0.7,
        background: who === "ai" ? C.teal : C.beige, color: who === "ai" ? "#fff" : C.ink, fontFamily: F.ui, fontWeight: 500, fontSize: size, lineHeight: 1.25, whiteSpace: "nowrap", position: "relative" }}>
        <span style={{ visibility: "hidden" }}>{text}</span>
        <span style={{ position: "absolute", left: size * 0.7, top: size * 0.48 }}>{shown}</span>
      </div>
    </div>
  );
};

/** The week agenda, the site's "Afspraken plannen" in its own card style. */
export const DAYS = ["ma", "di", "wo", "do", "vr"];
export const HOURS = ["09:00", "10:00", "11:00", "12:00", "13:00"];
export const AG = { w: 1180, h: 700, colX: 150, colW: 196, rowY: 170, rowH: 104 };
/** Where an agenda cell's centre is, in the agenda's own pixels (top-left origin). */
export const cell = (day: number, hour: number): [number, number] => [AG.colX + AG.colW * day + AG.colW / 2, AG.rowY + AG.rowH * hour + AG.rowH / 2];
export const BUSY: [number, number][] = [[0, 0], [2, 0], [3, 0], [3, 1], [2, 2], [0, 3], [4, 3]];
export const Agenda: React.FC<{ hilite?: number; children?: React.ReactNode; busy?: [number, number][]; label?: string; flat?: boolean }> = ({ hilite = 0, children, busy = BUSY, label = "deze week", flat = false }) => (
  <div style={{ width: AG.w, height: AG.h, borderRadius: 34, background: C.white, boxShadow: flat ? undefined : SHADOW, position: "relative", fontFamily: F.ui, flex: "none" }}>
    <div style={{ position: "absolute", left: 50, top: 38, fontWeight: 700, fontSize: 38, color: C.ink, letterSpacing: "-0.02em" }}>Agenda</div>
    <div style={{ position: "absolute", right: 50, top: 44, fontWeight: 500, fontSize: 28, color: C.txt3 }}>{label}</div>
    {DAYS.map((d, i) => (
      <div key={d} style={{ position: "absolute", left: AG.colX + AG.colW * i, width: AG.colW, top: 112, display: "flex", justifyContent: "center" }}>
        <div style={{ padding: "4px 18px", borderRadius: 99, fontWeight: 600, fontSize: 30, background: i === hilite ? C.teal : "transparent", color: i === hilite ? "#fff" : C.txt2 }}>{d}</div>
      </div>
    ))}
    {HOURS.map((h, j) => (
      <React.Fragment key={h}>
        <div style={{ position: "absolute", left: 36, top: AG.rowY + AG.rowH * j + 8, fontSize: 27, fontWeight: 500, color: C.txt3, fontVariantNumeric: "tabular-nums" }}>{h}</div>
        <div style={{ position: "absolute", left: AG.colX, right: 40, top: AG.rowY + AG.rowH * j, height: 2, background: C.line }} />
      </React.Fragment>
    ))}
    {busy.map(([d, h], i) => {
      const [cx, cy] = cell(d, h);
      return <div key={i} style={{ position: "absolute", left: cx - AG.colW / 2 + 10, top: cy - AG.rowH / 2 + 10, width: AG.colW - 20, height: AG.rowH - 20, borderRadius: 16, background: C.beige }} />;
    })}
    {children}
  </div>
);
/** An appointment block in a cell. */
export const Appt: React.FC<{ time: string; w?: number; h?: number; glow?: number }> = ({ time, w = AG.colW - 20, h = AG.rowH - 20, glow = 0 }) => (
  <div style={{ width: w, height: h, borderRadius: 16, background: C.teal, color: "#fff", fontFamily: F.ui, padding: "12px 16px", boxSizing: "border-box",
    boxShadow: `0 16px 30px -18px rgba(10,79,74,0.7), 0 0 0 ${glow * 8}px rgba(15,110,106,${0.18 * glow})`, display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
    <svg width={26} height={26} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" style={{ flex: "none", opacity: 0.85 }}><path d="M8 2v4" /><path d="M16 2v4" /><rect width="18" height="18" x="3" y="4" rx="2" /><path d="M3 10h18" /></svg>
    <div style={{ fontWeight: 700, fontSize: 32, fontVariantNumeric: "tabular-nums" }}>{time}</div>
  </div>
);

/** A phone (the site's photography shows iPhones): a dark frame, rounded screen, an island. */
export const Phone: React.FC<{ w: number; h: number; screen?: string; children?: React.ReactNode; bezel?: number }> = ({ w, h, screen = C.page, children, bezel = 1 }) => (
  <div style={{ width: w, height: h, borderRadius: w * 0.16, background: `rgba(22,34,31,${bezel})`, padding: w * 0.035 * bezel, boxSizing: "border-box", boxShadow: bezel > 0.01 ? SHADOW : undefined, position: "relative" }}>
    <div style={{ width: "100%", height: "100%", borderRadius: w * 0.13, background: screen, overflow: "hidden", position: "relative" }}>
      {children}
      <div style={{ position: "absolute", left: "50%", top: w * 0.04, width: w * 0.3, height: w * 0.085, borderRadius: 99, background: C.ink, transform: "translateX(-50%)", opacity: bezel }} />
    </div>
  </div>
);
/** A notification on the phone's lock screen. */
export const Note: React.FC<{ title: string; sub: string; w: number }> = ({ title, sub, w }) => (
  <div style={{ width: w, borderRadius: 28, background: "rgba(255,255,255,0.94)", boxShadow: "0 10px 24px -16px rgba(22,34,31,0.35)", padding: "18px 18px", boxSizing: "border-box", display: "flex", alignItems: "center", gap: 14, fontFamily: F.ui }}>
    <Avatar size={52} />
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontWeight: 700, fontSize: 26, color: C.ink, lineHeight: 1.15 }}>{title}</div>
      <div style={{ fontWeight: 500, fontSize: 25, color: C.txt2, whiteSpace: "nowrap", lineHeight: 1.2 }}>{sub}</div>
    </div>
  </div>
);

/** The site's primary button. */
export const Button: React.FC<{ size?: number; press?: number }> = ({ size = 40, press = 0 }) => (
  <div style={{ display: "flex", alignItems: "center", gap: size * 0.4, padding: `${size * 0.5}px ${size * 1.05}px`, borderRadius: 999, background: C.teal, color: "#fff", fontFamily: F.ui, fontWeight: 600,
    fontSize: size, whiteSpace: "nowrap", transform: `scale(${1 - 0.05 * Math.sin(Math.PI * clamp01(press))})`, boxShadow: "0 22px 40px -22px rgba(10,79,74,0.8)" }}>
    Start gratis <Icon name="arrow" size={size * 0.9} color="#fff" stroke={2.4} />
  </div>
);
/** The site's status chip: a dot and small caps. */
export const Chip: React.FC<{ text: string; size?: number; live?: number }> = ({ text, size = 22, live = 1 }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: size * 0.55, padding: `${size * 0.45}px ${size * 0.9}px`, borderRadius: 999, background: C.white, boxShadow: "0 0 0 1.5px " + C.line,
    fontFamily: F.ui, fontWeight: 600, fontSize: size, letterSpacing: "0.12em", textTransform: "uppercase", color: C.ink, whiteSpace: "nowrap" }}>
    <div style={{ width: size * 0.45, height: size * 0.45, borderRadius: "50%", background: C.teal, boxShadow: `0 0 0 ${size * 0.3 * live}px rgba(15,110,106,${0.25 * (1 - live)})` }} />{text}
  </div>
);
/** The wordmark, revealed left to right (k). */
export const Wordmark: React.FC<{ h: number; k?: number; tint?: string }> = ({ h, k = 1, tint }) => (
  <div style={{ width: h * (625 / 289), height: h, clipPath: `inset(-10% ${100 - clamp01(k) * 100}% -10% -2%)`, position: "relative" }}>
    <Img src={staticFile("img/wordmark.png")} style={{ width: "100%", height: "100%", filter: tint ? tint : undefined }} />
  </div>
);
