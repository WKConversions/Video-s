// Duendr's app UI rebuilt from Karl's screenshots (dark theme), at the app's own CSS-pixel scale (the app column is
// ~480 px wide). Demo data only: never Karl's name or photo, never other members' names or work (facts.md).
// Sizes are in app px; scale a whole screen with a transform when it needs to be bigger.
import React from "react";
import { C, Media, SANS, Wordmark } from "./kit";

const F = (size: number, weight = 500, color: string = C.cream, extra: React.CSSProperties = {}): React.CSSProperties => ({ fontFamily: SANS, fontSize: size, fontWeight: weight, color, letterSpacing: "-0.01em", ...extra });

// ------------------------------------------------------------------ icons (stroke, 24 px box)
export const Ico: React.FC<{ n: "bell" | "search" | "chat" | "user" | "grid" | "pin" | "arrow" | "plus" | "check" | "heart" | "bookmark" | "calendar" | "send" | "star" | "map" | "x"; s?: number; c?: string; w?: number }> = ({ n, s = 20, c = C.cream, w = 1.8 }) => {
  const P: Record<string, React.ReactNode> = {
    bell: <><path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z" /><path d="M10 20a2 2 0 0 0 4 0" /></>,
    search: <><circle cx="11" cy="11" r="6.5" /><path d="M16 16l4.5 4.5" /></>,
    chat: <path d="M5 5h14a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1h-8l-4 3v-3H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z" />,
    user: <><circle cx="12" cy="8.5" r="3.5" /><path d="M5 20a7 7 0 0 1 14 0" /></>,
    grid: <><rect x="4.5" y="4.5" width="6" height="6" rx="1.5" /><rect x="13.5" y="4.5" width="6" height="6" rx="1.5" /><rect x="4.5" y="13.5" width="6" height="6" rx="1.5" /><rect x="13.5" y="13.5" width="6" height="6" rx="1.5" /></>,
    pin: <><path d="M12 21s-6-5.5-6-10.5a6 6 0 0 1 12 0C18 15.5 12 21 12 21z" /><circle cx="12" cy="10.5" r="2.2" /></>,
    arrow: <path d="M5 12h13M13 6l6 6-6 6" />,
    plus: <path d="M12 5v14M5 12h14" />,
    check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
    heart: <path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z" />,
    bookmark: <path d="M7 4h10v16l-5-3.5L7 20z" />,
    calendar: <><rect x="4" y="5.5" width="16" height="14" rx="2" /><path d="M4 10h16M8.5 3.5v4M15.5 3.5v4" /></>,
    send: <path d="M4 12l16-7-6 16-3-6.5z" />,
    star: <path d="M12 3.8l2.5 5.2 5.7.8-4.1 4 1 5.7L12 16.8 6.9 19.5l1-5.7-4.1-4 5.7-.8z" />,
    map: <><path d="M9 4.5l-5 2v13l5-2 6 2 5-2v-13l-5 2z" /><path d="M9 4.5v13M15 6.5v13" /></>,
    x: <path d="M6 6l12 12M18 6L6 18" />,
  };
  return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round">{P[n]}</svg>;
};

/** the verified badge (blue) or the founding badge (coral) next to names */
export const Badge: React.FC<{ kind?: "verified" | "founding"; s?: number }> = ({ kind = "verified", s = 16 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" fill={kind === "verified" ? C.blue : C.coral} />
    {kind === "verified" ? <path d="M7 12.5l3.2 3.2L17 9" stroke="#fff" strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" /> : <circle cx="12" cy="12" r="4" fill="#fff" />}</svg>
);

/** a round avatar: a photo/clip (img/... or clips/...) or initials */
export const Avatar: React.FC<{ s?: number; src?: string; initials?: string; tint?: string; ring?: string }> = ({ s = 44, src, initials, tint = C.card2, ring }) => (
  <div style={{ width: s, height: s, borderRadius: s / 2, overflow: "hidden", flex: "none", background: tint, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: ring ? `0 0 0 3px ${ring}` : undefined, position: "relative" }}>
    {src ? <Media src={src} w={s} h={s} r={s / 2} shadow="none" /> : <span style={F(s * 0.36, 700, C.muted)}>{initials}</span>}
  </div>
);

// ------------------------------------------------------------------ app chrome
export const AppHeader: React.FC<{ city?: string }> = ({ city = "All cities" }) => (
  <div style={{ display: "flex", alignItems: "center", height: 64, padding: "0 18px", gap: 14 }}>
    <Wordmark h={22} /><div style={{ flex: 1 }} /><Ico n="bell" s={21} />
    <div style={{ width: 18, height: 18, borderRadius: 9, background: C.coral }} />
    <div style={{ display: "flex", alignItems: "center", gap: 6, height: 34, padding: "0 12px", borderRadius: 17, background: C.card2, ...F(14, 600) }}>{city}<span style={{ fontSize: 10 }}>▾</span></div>
  </div>
);
/** the Find work / Find talent switch; on = 0 (work) .. 1 (talent), animatable */
export const Segmented: React.FC<{ on?: number; a?: string; b?: string; w?: number }> = ({ on = 0, a = "Find work", b = "Find talent", w = 444 }) => (
  <div style={{ position: "relative", width: w, height: 44, borderRadius: 22, background: C.card2, display: "flex" }}>
    <div style={{ position: "absolute", top: 3, left: 3, width: w / 2 - 6, height: 38, borderRadius: 19, background: C.cream, transform: `translateX(${on * (w / 2)}px)` }} />
    {[a, b].map((s, i) => <div key={s} style={{ position: "relative", flex: 1, display: "flex", alignItems: "center", justifyContent: "center", ...F(15, 600, Math.abs(on - i) < 0.5 ? C.ink : C.muted) }}>{s}</div>)}
  </div>
);
export const Chip: React.FC<{ label: string; on?: boolean; icon?: React.ReactNode }> = ({ label, on, icon }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: 6, height: 34, padding: "0 14px", borderRadius: 17, background: on ? C.cream : C.card2, border: on ? "none" : `1px solid ${C.border}`, ...F(14, 600, on ? C.ink : C.cream), whiteSpace: "nowrap" }}>{icon}{label}</div>
);
export const Pill: React.FC<{ label: string; kind?: "coral" | "outline" | "cream"; h?: number; w?: number | string; icon?: React.ReactNode; size?: number }> = ({ label, kind = "coral", h = 40, w, icon, size = 15 }) => (
  <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6, height: h, width: w, padding: w ? undefined : `0 ${h * 0.55}px`, borderRadius: h / 2,
    background: kind === "coral" ? C.coral : kind === "cream" ? C.cream : "transparent", border: kind === "outline" ? `1.5px solid ${C.border}` : "none", ...F(size, 600, kind === "cream" ? C.ink : C.cream), whiteSpace: "nowrap" }}>{label}{icon}</div>
);
export const BottomNav: React.FC<{ active?: "Board" | "Search" | "Messages" | "Profile" }> = ({ active = "Board" }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-around", height: 74, borderTop: `1px solid ${C.border}`, background: C.bg }}>
    {(["Board", "Search", "Post", "Messages", "Profile"] as const).map((n) => n === "Post"
      ? <div key={n} style={{ width: 50, height: 50, borderRadius: 25, background: C.coral, display: "flex", alignItems: "center", justifyContent: "center", marginTop: -14 }}><Ico n="plus" s={24} w={2.4} /></div>
      : <div key={n} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, ...F(11, 600, active === n ? C.cream : C.dim) }}>
          <Ico n={n === "Board" ? "grid" : n === "Search" ? "search" : n === "Messages" ? "chat" : "user"} s={21} c={active === n ? C.cream : C.dim} />{n}</div>)}
  </div>
);

// ------------------------------------------------------------------ content cards
export type Gig = { tag: string; roles?: string; title: string; by: string; byAvatar?: string; city: string; role: string; open: string; fee: string; time?: string; img?: string };
export const GigCard: React.FC<{ g: Gig; w?: number; connect?: number }> = ({ g, w = 444, connect = 0 }) => (
  <div style={{ width: w, borderRadius: 16, background: C.card, border: `1px solid ${C.border}`, padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
    {g.img && <Media src={g.img} w={w - 32} h={(w - 32) * 0.56} r={12} shadow="none" />}
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ ...F(10.5, 700, C.cream, { letterSpacing: "0.12em" }), padding: "4px 8px", borderRadius: 6, background: C.card2 }}>{g.tag}</span>
      {g.roles && <span style={F(10.5, 600, C.muted, { letterSpacing: "0.12em" })}>{g.roles}</span>}<div style={{ flex: 1 }} /><Ico n="bookmark" s={18} c={C.muted} /><Ico n="heart" s={18} c={C.muted} />
    </div>
    <div style={F(20, 700, C.cream, { lineHeight: 1.2 })}>{g.title}</div>
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}><Avatar s={26} src={g.byAvatar} initials={g.by[0]} /><span style={F(14, 600)}>{g.by}</span><Badge s={15} /><span style={F(14, 500, C.muted)}>· {g.city}</span></div>
    <div style={{ borderRadius: 12, border: `1px solid ${C.border}`, padding: "10px 12px", display: "flex", flexDirection: "column", gap: 4 }}>
      <div style={{ display: "flex" }}><span style={F(14, 600)}>{g.role}</span><div style={{ flex: 1 }} /><span style={F(13, 500, C.muted)}>{g.open}</span></div>
      <span style={F(13, 500, C.muted)}>{g.fee}{g.time ? ` · ${g.time}` : ""}</span>
    </div>
    <div style={{ display: "flex", gap: 10 }}><Pill label="See all roles" kind="outline" w="50%" /><div style={{ width: "50%", transform: `scale(${1 - 0.06 * Math.sin(Math.PI * Math.min(1, connect))})` }}><Pill label="Connect" icon={<Ico n="arrow" s={15} w={2.2} />} w="100%" /></div></div>
  </div>
);
export type Person = { name: string; roles: string; city: string; fee?: string; avail?: string; avatar?: string; badge?: "verified" | "founding" };
export const PersonRow: React.FC<{ p: Person; w?: number }> = ({ p, w = 444 }) => (
  <div style={{ width: w, display: "flex", alignItems: "center", gap: 12, padding: "9px 0" }}>
    <Avatar s={46} src={p.avatar} initials={p.name.split(" ").map((s) => s[0]).join("").slice(0, 2)} />
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={F(16.5, 700)}>{p.name}</span>{p.badge && <Badge kind={p.badge} s={15} />}</div>
      <div style={F(13.5, 500, C.muted, { whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" })}>{p.roles} · {p.city}{p.fee ? ` · ${p.fee}` : ""}</div>
    </div>
    {p.avail && <div style={{ display: "flex", alignItems: "center", gap: 6, ...F(12.5, 600) }}><span style={{ width: 7, height: 7, borderRadius: 4, background: C.coral }} />{p.avail}</div>}
  </div>
);
/** the map's bottom sheet: "● Marbella · 6 open jobs" + rows + "See all" */
export const MapSheet: React.FC<{ city: string; count: number; rows: { letter: string; title: string; sub: string; fee: string }[]; w?: number }> = ({ city, count, rows, w = 444 }) => (
  <div style={{ width: w, borderRadius: 18, background: C.card, border: `1px solid ${C.border}`, padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}><span style={{ width: 9, height: 9, borderRadius: 5, background: C.coral }} /><span style={F(19, 700)}>{city}</span><div style={{ flex: 1 }} /><Ico n="x" s={18} c={C.muted} /></div>
    <span style={F(13.5, 500, C.muted, { marginTop: -6 })}>{count} open jobs</span>
    {rows.map((r) => <div key={r.title} style={{ display: "flex", alignItems: "center", gap: 12, padding: "6px 0" }}>
      <div style={{ width: 34, height: 34, borderRadius: 8, background: C.cream, display: "flex", alignItems: "center", justifyContent: "center", ...F(14, 700, C.ink) }}>{r.letter}</div>
      <div style={{ flex: 1 }}><div style={F(15, 600)}>{r.title}</div><div style={F(12.5, 500, C.muted)}>{r.sub}</div></div><span style={F(15, 700)}>{r.fee}</span></div>)}
    <Pill label={`See all ${count} in ${city}`} kind="cream" w="100%" />
  </div>
);
/** "BOOKED ON DUENDR" tile (from the board's "This weekend on the coast") */
export const BookedTile: React.FC<{ mon: string; day: string; dow: string; name: string; at: string; time: string; img?: string; w?: number }> = ({ mon, day, dow, name, at, time, img, w = 300 }) => (
  <div style={{ width: w, height: 104, borderRadius: 14, overflow: "hidden", position: "relative", background: C.card2 }}>
    {img && <div style={{ position: "absolute", inset: 0, opacity: 0.45 }}><Media src={img} w={w} h={104} r={0} shadow="none" /></div>}
    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", gap: 12, padding: 12 }}>
      <div style={{ width: 52, height: 64, borderRadius: 10, border: `1.5px solid ${C.cream}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "rgba(22,20,19,0.55)" }}>
        <span style={F(9, 700, C.coral, { letterSpacing: "0.1em" })}>{mon}</span><span style={F(24, 800)}>{day}</span><span style={F(9, 600, C.muted)}>{dow}</span></div>
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}><span style={F(9.5, 700, C.muted, { letterSpacing: "0.12em" })}>BOOKED ON DUENDR</span><span style={F(15, 700)}>{name}</span>
        <span style={F(12.5, 500, C.muted)}>at <b style={{ color: C.cream }}>{at}</b></span><span style={F(11.5, 500, C.muted)}>{time}</span></div>
    </div>
  </div>
);
export const Bubble: React.FC<{ text: string; me?: boolean; size?: number }> = ({ text, me, size = 15 }) => (
  <div style={{ maxWidth: 300, padding: "10px 14px", borderRadius: 18, borderBottomRightRadius: me ? 6 : 18, borderBottomLeftRadius: me ? 18 : 6, background: me ? C.coral : C.card2, ...F(size, 500, C.cream, { lineHeight: 1.35 }) }}>{text}</div>
);

/** a phone in Duendr's dark theme; children are the screen (app px); w = screen width in px */
export const Phone: React.FC<{ w?: number; h?: number; children?: React.ReactNode; style?: React.CSSProperties }> = ({ w = 444, h = 930, children, style }) => (
  <div style={{ width: w + 24, height: h + 24, borderRadius: 64, background: "#0B0A09", padding: 12, boxShadow: "0 0 0 1.5px #3A3531, 0 0 40px rgba(0,0,0,0.5), 0 0 120px rgba(0,0,0,0.5)", position: "relative", ...style }}>
    <div style={{ width: w, height: h, borderRadius: 52, overflow: "hidden", background: C.bg, position: "relative" }}>
      {children}
      <div style={{ position: "absolute", top: 12, left: w / 2 - 58, width: 116, height: 32, borderRadius: 16, background: "#000" }} />
    </div>
  </div>
);
