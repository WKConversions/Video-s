// The Recruiting Rewards interface, rebuilt from the product demo films at film scale (simplified, real labels), plus
// the film's type: Lora headlines that build word by word, the step kicker, pills, the cursor.
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { C, F, SETTLE, SHADOW, SOFT, clamp01, lerp, tw } from "./tokens";

export const img = (n: string) => staticFile(`img/${n}`);

// ------------------------------------------------------------------------------------------------ icons (line)
const P: Record<string, string> = {
  home: "M3 10.5 12 3l9 7.5V21h-6v-6H9v6H3z",
  kanban: "M5 4v16M12 4v10M19 4v6",
  users: "M16 20v-1.5a3.5 3.5 0 0 0-3.5-3.5h-5A3.5 3.5 0 0 0 4 18.5V20M10 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7M21 20v-1.5a3.5 3.5 0 0 0-2.6-3.4M15.5 4.2a3.5 3.5 0 0 1 0 6.6",
  briefcase: "M3 8h18v12H3zM8 8V5h8v3M3 13h18",
  compass: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18M15.5 8.5l-2 5-5 2 2-5z",
  userplus: "M15 20v-1.5a3.5 3.5 0 0 0-3.5-3.5h-5A3.5 3.5 0 0 0 3 18.5V20M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7M19 8v6M16 11h6",
  pin: "M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11M12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5",
  building: "M4 21V5h10v16M14 9h6v12M7 9h4M7 13h4M7 17h4M2 21h20",
  shield: "M12 3l7.5 3v5.5c0 4.6-3.2 8.2-7.5 9.5-4.3-1.3-7.5-4.9-7.5-9.5V6z",
  phone: "M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2",
  calendar: "M4 6h16v15H4zM4 10h16M8 3v4M16 3v4",
  deck: "M3 4h18v12H3zM12 16v4M8 20h8M7 8h6M7 11h9",
  check: "M5 12.5l4.5 4.5L19 7.5",
  sparkle: "M12 3l1.8 5.4L19 10l-5.2 1.6L12 17l-1.8-5.4L5 10l5.2-1.6zM19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z",
  send: "M4 12l16-8-6 16-2.5-6.5z",
  arrow: "M5 12h14M13 6l6 6-6 6",
  arrowup: "M12 19V5M6 11l6-6 6 6",
  mail: "M3 6h18v12H3zM3 7l9 6 9-6",
  file: "M6 3h8l4 4v14H6zM14 3v4h4M9 12h6M9 16h6",
  star: "M12 3.5l2.6 5.3 5.9.9-4.2 4.1 1 5.8-5.3-2.8-5.3 2.8 1-5.8-4.2-4.1 5.9-.9z",
  message: "M4 5h16v11H9l-5 4z",
  search: "M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14M20 20l-4-4",
  coins: "M9 8a5 3 0 1 0 0-.01M4 8v4c0 1.7 2.2 3 5 3M14 11c2.8 0 5 1.3 5 3v4c0 1.7-2.2 3-5 3s-5-1.3-5-3v-4c0-1.7 2.2-3 5-3M9 15v.0",
  clip: "M20 11.5l-8 8a5 5 0 0 1-7-7l8-8a3.5 3.5 0 0 1 5 5l-8 8a2 2 0 0 1-3-3l7.5-7.5",
  receipt: "M6 3h12v18l-3-2-3 2-3-2-3 2zM9 8h6M9 12h6",
};
export const Icon: React.FC<{ n: keyof typeof P | string; s?: number; c?: string; w?: number; fill?: string; style?: React.CSSProperties }> = ({ n, s = 20, c = C.muted, w = 1.8, fill = "none", style }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" style={{ flex: "none", ...style }}><path d={P[n as string]} fill={fill} stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" /></svg>
);

// ------------------------------------------------------------------------------------------------ film type
export type Word = { t: string; at: number; green?: boolean };
/** A Lora headline whose words rise out of a soft blur on their frames, then leave together. */
export const Headline: React.FC<{ g: number; words: Word[]; x: number; y: number; size: number; out?: number; width?: number; align?: "left" | "center"; color?: string; weight?: number; lh?: number; name?: string }> = ({
  g, words, x, y, size, out, width = 1200, align = "left", color = C.ink, weight = 600, lh = 1.08, name,
}) => {
  const o = out === undefined ? 0 : tw(g, out, out + 10, SOFT);
  if (o >= 1 || g < words[0].at - 2) return null;
  return (
    <div data-name={name} style={{ position: "absolute", left: align === "center" ? x - width / 2 : x, top: y, width, textAlign: align, fontFamily: F.display, fontWeight: weight, fontSize: size, lineHeight: lh, letterSpacing: "-0.02em", color, opacity: 1 - o, transform: `translateY(${-o * 14}px)` }}>
      {words.map((w, i) => {
        const k = tw(g, w.at, w.at + 14);
        return (
          <span key={i} style={{ display: "inline-block", whiteSpace: "pre", opacity: k, transform: `translateY(${(1 - k) * 0.32 * size}px)`, filter: k < 1 ? `blur(${(1 - k) * 8}px)` : undefined, color: w.green ? C.green : undefined }}>
            {w.t}{i < words.length - 1 && !w.t.endsWith("\n") ? " " : ""}
          </span>
        );
      })}
    </div>
  );
};
/** split "Real assignments, |already on the platform." into words; the part after | is green */
export const words = (s: string, start: number, step = 3): Word[] => {
  const [a, b = ""] = s.split("|");
  const wa = a.trim() ? a.trim().split(/\s+/) : [], wb = b.trim() ? b.trim().split(/\s+/) : [];
  return [...wa.map((t, i) => ({ t, at: start + i * step })), ...wb.map((t, i) => ({ t, at: start + (wa.length + i) * step, green: true }))];
};

/** "STEP 1 · Pick assignments": the site's numbered node and small caps kicker. */
export const Kicker: React.FC<{ g: number; at: number; n?: number; text: string; x: number; y: number; out?: number }> = ({ g, at, n, text, x, y, out }) => {
  const k = tw(g, at, at + 14), o = out === undefined ? 0 : tw(g, out, out + 10, SOFT);
  if (k <= 0 || o >= 1) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, display: "flex", alignItems: "center", gap: 14, opacity: k * (1 - o), transform: `translateY(${(1 - k) * 16}px)` }}>
      {n !== undefined && <div style={{ width: 40, height: 40, borderRadius: 20, background: C.green, color: C.white, fontFamily: F.ui, fontWeight: 700, fontSize: 19, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 16px -6px rgba(40,126,97,0.6)" }}>{n}</div>}
      <div style={{ fontFamily: F.ui, fontWeight: 700, fontSize: 17, letterSpacing: "0.14em", textTransform: "uppercase", color: C.green }}>{text}</div>
    </div>
  );
};

// ------------------------------------------------------------------------------------------------ small UI
export const Chip: React.FC<{ children: React.ReactNode; icon?: string; tone?: "line" | "green" | "amber" | "white"; size?: number; style?: React.CSSProperties }> = ({ children, icon, tone = "line", size = 15, style }) => {
  const t = { line: { bg: C.card, bd: C.line, fg: C.muted }, green: { bg: C.greenSoft, bd: C.greenLine, fg: C.greenDeep }, amber: { bg: C.amberSoft, bd: "#F1D9B5", fg: "#9A6418" }, white: { bg: C.card, bd: C.line, fg: C.ink2 } }[tone];
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: size * 0.45, padding: `${size * 0.42}px ${size * 0.8}px`, borderRadius: 999, background: t.bg, border: `1.5px solid ${t.bd}`, color: t.fg, fontFamily: F.ui, fontWeight: 600, fontSize: size, whiteSpace: "nowrap", ...style }}>
      {icon && <Icon n={icon} s={size * 1.15} c={t.fg} />}{children}
    </div>
  );
};
export const Button: React.FC<{ children: React.ReactNode; icon?: string; iconRight?: string; size?: number; press?: number; ghost?: boolean; style?: React.CSSProperties }> = ({ children, icon, iconRight, size = 18, press = 0, ghost, style }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: size * 0.5, padding: `${size * 0.62}px ${size * 1.25}px`, borderRadius: 999, fontFamily: F.ui, fontWeight: 700, fontSize: size, whiteSpace: "nowrap",
    background: ghost ? C.card : press > 0.5 ? C.greenDeep : C.green, color: ghost ? C.ink : C.white, border: ghost ? `1.5px solid ${C.line}` : "1.5px solid transparent",
    boxShadow: ghost ? "none" : `0 8px 20px -10px rgba(40,126,97,0.7)`, transform: `scale(${1 - 0.05 * Math.sin(Math.PI * clamp01(press))})`, ...style }}>
    {icon && <Icon n={icon} s={size * 1.1} c={ghost ? C.ink : C.white} />}{children}{iconRight && <Icon n={iconRight} s={size * 1.1} c={C.white} />}
  </div>
);
export const Avatar: React.FC<{ t: string; s?: number; tone?: number }> = ({ t, s = 44, tone = 0 }) => {
  const tones = [[C.greenSoft, C.greenDeep], [C.amberSoft, "#9A6418"], ["#E6ECF5", "#2C4A72"], ["#F1E8F5", "#6B3F80"], ["#F5E9E4", "#8A4A2C"]][tone % 5];
  return <div style={{ width: s, height: s, borderRadius: s * 0.28, background: tones[0], color: tones[1], fontFamily: F.ui, fontWeight: 700, fontSize: s * 0.36, display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>{t}</div>;
};
export const Stars: React.FC<{ n: number; of?: number; s?: number; fill?: number }> = ({ n, of = 5, s = 22, fill = 1 }) => (
  <div style={{ display: "flex", gap: s * 0.18 }}>{Array.from({ length: of }, (_, i) => {
    const on = clamp01(fill * n - i);
    return <Icon key={i} n="star" s={s} c={on > 0.5 ? "#D98E2B" : C.line} fill={on > 0.5 ? "#E0A458" : "none"} w={1.6} />;
  })}</div>
);
/** a typed line: the characters of `text` appear between frames a and b, with a caret */
export const typed = (text: string, g: number, a: number, b: number) => text.slice(0, Math.round(text.length * clamp01((g - a) / Math.max(1, b - a))));
export const Caret: React.FC<{ g: number; on?: boolean; h?: number }> = ({ g, on = true, h = 26 }) =>
  on ? <span style={{ display: "inline-block", width: 2.5, height: h, background: C.green, marginLeft: 2, verticalAlign: "middle", opacity: Math.floor(g / 15) % 2 ? 0.2 : 1 }} /> : null;
/** a counter between frames a and b */
export const count = (to: number, g: number, a: number, b: number, from = 0) => Math.round(lerp(from, to, tw(g, a, b, SOFT)));
export const sek = (v: number) => "SEK " + v.toLocaleString("en-US");

// ------------------------------------------------------------------------------------------------ the cursor
/** the pointer gliding from point to point (keys: [frame, x, y]); `clicks` frames get a ring and a squeeze */
export const Cursor: React.FC<{ g: number; path: [number, number, number][]; clicks?: number[]; show?: [number, number] }> = ({ g, path, clicks = [], show }) => {
  if (show && (g < show[0] || g > show[1])) return null;
  let x = path[0][1], y = path[0][2];
  for (let i = 1; i < path.length; i++) {
    const [f0, x0, y0] = path[i - 1], [f1, x1, y1] = path[i];
    if (g >= f0) { const k = tw(g, f0, f1, SOFT); x = lerp(x0, x1, k); y = lerp(y0, y1, k); }
  }
  const fade = show ? Math.min(tw(g, show[0], show[0] + 8, SOFT), 1 - tw(g, show[1] - 8, show[1], SOFT)) : 1;
  const c = clicks.find((f) => g >= f && g < f + 14);
  const ck = c !== undefined ? (g - c) / 14 : 0;
  return (
    <>
      {c !== undefined && <div style={{ position: "absolute", left: x - 30 * ck - 6, top: y - 30 * ck - 6, width: 12 + 60 * ck, height: 12 + 60 * ck, borderRadius: "50%", border: `3px solid ${C.green}`, opacity: (1 - ck) * 0.6 * fade }} />}
      <svg width={34} height={34} viewBox="0 0 24 24" style={{ position: "absolute", left: x - 6, top: y - 3, opacity: fade, transform: `scale(${1 - 0.12 * Math.sin(Math.PI * ck)})`, transformOrigin: "6px 3px", filter: "drop-shadow(0 4px 6px rgba(28,25,23,0.25))" }}>
        <path d="M5 2.5v17l4.6-4.4 3 6.4 3-1.4-3-6.3H19z" fill={C.ink} stroke={C.white} strokeWidth={1.4} strokeLinejoin="round" />
      </svg>
    </>
  );
};

// ------------------------------------------------------------------------------------------------ the app shell
export const AppShell: React.FC<{ w: number; h: number; nav: { icon: string; label: string; on?: boolean }[]; workspace: string; ws?: string; children: React.ReactNode; banner?: React.ReactNode }> = ({ w, h, nav, workspace, ws = "R", children, banner }) => (
  <div style={{ position: "relative", width: w, height: h, borderRadius: 22, overflow: "hidden", background: C.page, border: `1.5px solid ${C.line}`, boxShadow: SHADOW.window, display: "flex" }}>
    <div style={{ width: 250, flex: "none", borderRight: `1.5px solid ${C.lineSoft}`, background: "#F6F4F2", padding: "22px 14px", display: "flex", flexDirection: "column", gap: 6 }}>
      <Img src={img("logo-icon.svg")} style={{ width: 36, height: 36, margin: "0 0 16px 6px" }} />
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 10px", borderRadius: 12, border: `1.5px solid ${C.line}`, background: C.card, marginBottom: 14 }}>
        <div style={{ width: 26, height: 26, borderRadius: 7, background: C.green, color: C.white, fontFamily: F.ui, fontWeight: 700, fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center" }}>{ws}</div>
        <div style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 15, color: C.ink }}>{workspace}</div>
      </div>
      {nav.map((n, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 12px", borderRadius: 11, background: n.on ? C.greenSoft : "transparent", fontFamily: F.ui, fontWeight: n.on ? 700 : 500, fontSize: 16, color: n.on ? C.greenDeep : C.ink2 }}>
          <Icon n={n.icon} s={19} c={n.on ? C.green : C.muted} />{n.label}
        </div>
      ))}
    </div>
    <div style={{ position: "relative", flex: 1, overflow: "hidden" }}>{banner}{children}</div>
  </div>
);

// ------------------------------------------------------------------------------------------------ marketplace job card
export type Job = { co: string; ini: string; title: string; pos: string; loc: string; guar: string; hired: number; proc: number; wait: number; reward: number };
export const JobCard: React.FC<{ j: Job; w?: number; press?: number; highlight?: number; tone?: number }> = ({ j, w = 1100, press = 0, highlight = 0, tone = 0 }) => (
  <div style={{ width: w, padding: "22px 28px", borderRadius: 18, background: C.card, border: `1.5px solid ${highlight > 0 ? `rgba(40,126,97,${0.25 + 0.6 * highlight})` : C.lineSoft}`, boxShadow: highlight > 0 ? `0 0 0 ${5 * highlight}px rgba(40,126,97,0.10), ${SHADOW.card}` : SHADOW.card, display: "flex", flexDirection: "column", gap: 14 }}>
    <div style={{ display: "flex", alignItems: "flex-start", gap: 18 }}>
      <Avatar t={j.ini} s={50} tone={tone} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 14, color: C.muted }}>{j.co}</div>
        <div style={{ fontFamily: F.display, fontWeight: 600, fontSize: 28, color: C.ink, letterSpacing: "-0.01em", marginTop: 2 }}>{j.title}</div>
        <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
          <Chip icon="building" size={13}>{j.pos}</Chip><Chip icon="pin" size={13}>{j.loc}</Chip><Chip icon="shield" size={13}>{j.guar}</Chip>
        </div>
      </div>
      <div style={{ textAlign: "right" }}>
        <div style={{ fontFamily: F.ui, fontWeight: 800, fontSize: 30, color: C.green, letterSpacing: "-0.01em" }}>{sek(j.reward)}</div>
        <div style={{ fontFamily: F.ui, fontWeight: 700, fontSize: 11.5, letterSpacing: "0.1em", color: C.muted }}>REWARD PER HIRED</div>
      </div>
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: 30, paddingLeft: 68 }}>
      {([[j.hired, "HIRED", C.green], [j.proc, "IN PROCESS", C.green], [j.wait, "WAITING", "#C98A2E"]] as const).map(([v, l, c], i) => (
        <div key={i} style={{ fontFamily: F.ui, fontSize: 13, fontWeight: 700, letterSpacing: "0.06em", color: C.muted }}><span style={{ color: c, fontSize: 16, marginRight: 6 }}>{v}</span>{l}</div>
      ))}
      <div style={{ flex: 1 }} />
      <Button icon="userplus" size={16} press={press}>Recommend</Button>
    </div>
  </div>
);

// ------------------------------------------------------------------------------------------------ AI match score
export const ScoreRing: React.FC<{ v: number; max?: number; s?: number; k: number }> = ({ v, max = 10, s = 120, k }) => {
  const r = s / 2 - 7, c = 2 * Math.PI * r;
  return (
    <div style={{ position: "relative", width: s, height: s, flex: "none" }}>
      <svg width={s} height={s} style={{ position: "absolute", transform: "rotate(-90deg)" }}>
        <circle cx={s / 2} cy={s / 2} r={r} fill={C.greenSoft} stroke={C.greenLine} strokeWidth={5} />
        <circle cx={s / 2} cy={s / 2} r={r} fill="none" stroke={C.green} strokeWidth={6} strokeLinecap="round" strokeDasharray={`${c * (v / max) * k} ${c}`} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.display, fontWeight: 600, fontSize: s * 0.36, color: C.green }}>{Math.round(v * k)}</div>
    </div>
  );
};
export const Bar: React.FC<{ label: string; v: number; k: number; w?: number }> = ({ label, v, k, w = 700 }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
    <div style={{ width: 230, fontFamily: F.ui, fontWeight: 600, fontSize: 18, color: C.ink2, lineHeight: 1.2 }}>{label}</div>
    <div style={{ width: w, height: 10, borderRadius: 5, background: C.lineSoft, overflow: "hidden" }}>
      <div style={{ width: `${(v / 10) * 100 * k}%`, height: "100%", borderRadius: 5, background: C.green }} />
    </div>
    <div style={{ width: 80, fontFamily: F.ui, fontWeight: 700, fontSize: 18, color: C.ink, textAlign: "right" }}>{(v * k).toFixed(v % 1 ? 1 : 0)}/10</div>
  </div>
);

// ------------------------------------------------------------------------------------------------ pipeline
export const CandidateCard: React.FC<{ name: string; role: string; ini: string; tone?: number; ai?: number; stars?: number; w?: number; style?: React.CSSProperties; glow?: number }> = ({ name, role, ini, tone = 0, ai, stars, w = 330, style, glow = 0 }) => (
  <div style={{ width: w, padding: "16px 18px", borderRadius: 16, background: C.card, border: `1.5px solid ${glow > 0 ? `rgba(40,126,97,${0.3 + 0.6 * glow})` : C.lineSoft}`, boxShadow: SHADOW.card, display: "flex", flexDirection: "column", gap: 10, ...style }}>
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <Avatar t={ini} s={40} tone={tone} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: F.ui, fontWeight: 700, fontSize: 16, color: C.ink, whiteSpace: "nowrap" }}>{name}</div>
        <div style={{ fontFamily: F.ui, fontWeight: 500, fontSize: 13, color: C.muted, whiteSpace: "nowrap" }}>{role}</div>
      </div>
      {ai !== undefined && <div style={{ padding: "4px 9px", borderRadius: 999, background: C.amberSoft, color: "#9A6418", fontFamily: F.ui, fontWeight: 700, fontSize: 13 }}>AI {ai}</div>}
    </div>
    {stars !== undefined && <Stars n={stars} s={17} />}
  </div>
);

/** a soft background that keeps the page alive: two very large, slow, pale washes of the brand's green and amber */
export const Page: React.FC<{ g: number; tint?: number; navy?: number }> = ({ g, tint = 0, navy = 0 }) => (
  <AbsoluteFill style={{ background: C.page }}>
    <div style={{ position: "absolute", left: -300 + 60 * Math.sin(g / 140), top: -420, width: 1300, height: 1100, borderRadius: "50%", background: `radial-gradient(circle, rgba(40,126,97,${0.07 + 0.08 * tint}) 0%, rgba(40,126,97,0) 65%)` }} />
    <div style={{ position: "absolute", right: -360 + 50 * Math.cos(g / 160), bottom: -520, width: 1400, height: 1200, borderRadius: "50%", background: "radial-gradient(circle, rgba(224,164,88,0.09) 0%, rgba(224,164,88,0) 65%)" }} />
    {navy > 0 && <AbsoluteFill style={{ background: C.navy, opacity: navy }} />}
  </AbsoluteFill>
);
export { SETTLE, lerp, tw };
