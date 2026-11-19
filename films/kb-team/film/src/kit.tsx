// K.B team film: the kit. LEAD-OWNED: builders import from here and do not edit it.
// Brand tokens, grounds, type, the portrait card, the message box, K.B's pictograms, windows, the pieces of UI the film
// reuses (FlowCard, Rank, Bars, AppUI), filmed footage, typing, the 3D hand cursor, and the time helpers.
import React, { useEffect, useState } from "react";
import { AbsoluteFill, Easing, Freeze, Img, OffthreadVideo, continueRender, delayRender, spring, staticFile } from "remotion";
import { Hand, handAt } from "./hand";
import type { HandKey } from "./hand";
export { Hand };
export type { HandKey };

export const C = { paper: "#F6F6F4", ink: "#293A51", cyan: "#38C8FF", dark: "#111A27", dark2: "#1B2636", ui: "#E9E8E4", line: "rgba(41,58,81,.14)", sub: "#7A8494", mint: "#22C7A0", violet: "#7C6CFF", indigo: "#4F7BFF", amber: "#FFB547", coral: "#FF7A66", green: "#22B573", white: "#FFFFFF" };
export const F = "Montserrat, sans-serif";
export const SH = "0 30px 70px rgba(41,58,81,.16), 0 4px 14px rgba(41,58,81,.08)";
export const FACES = [["Montserrat", "montserrat-var-latin.woff2", "100 900"], ["Montserrat", "montserrat-var-latin-ext.woff2", "100 900"], ["Copperplate CC", "copperplate-cc-heavy.otf", "800"]];
export const useFonts = () => {
  const [ok, setOk] = useState(false); const [h] = useState(() => delayRender("fonts"));
  useEffect(() => {
    const el = document.createElement("style");
    el.textContent = FACES.map(([f, file, w]) => `@font-face{font-family:'${f}';src:url(${staticFile("fonts/" + file)});font-weight:${w}}`).join("\n");
    document.head.appendChild(el);
    Promise.all([400, 500, 600, 700].map((w) => document.fonts.load(`${w} 60px Montserrat`))).then(() => { setOk(true); continueRender(h); });
  }, [h]);
  return ok;
};
export type P = React.CSSProperties;
export const abs = (x: number, y: number, w?: number, h?: number, more: P = {}): P => ({ position: "absolute", left: x, top: y, width: w, height: h, ...more });
export const Ground: React.FC<{ tone?: "paper" | "vig" | "ui" | "dark" | "cyan"; children?: React.ReactNode }> = ({ tone = "paper", children }) => {
  const bg = { paper: `radial-gradient(120% 100% at 50% 45%, #FBFBFA 0%, ${C.paper} 60%, #EEEEEB 100%)`, vig: "radial-gradient(90% 90% at 50% 50%, #FFFFFF 0%, #EFEFF1 55%, #D6D7DB 100%)", ui: C.ui, dark: C.dark, cyan: C.cyan }[tone];
  return <AbsoluteFill style={{ background: bg, fontFamily: F, color: C.ink, overflow: "hidden" }}>{children}</AbsoluteFill>;
};
export const Tx: React.FC<{ x: number; y: number; s: number; w?: number; c?: string; children: React.ReactNode; style?: P }> = ({ x, y, s, w = 500, c = C.ink, children, style }) => (
  <div style={{ position: "absolute", left: x, top: y, fontSize: s, fontWeight: w, color: c, letterSpacing: -s * 0.03, lineHeight: 1.08, whiteSpace: "nowrap", ...style }}>{children}</div>
);
export const Port: React.FC<{ who: string; x: number; y: number; w: number; h: number; cap?: string; rot?: number; o?: number }> = ({ who, x, y, w, h, cap, rot = 0, o = 1 }) => (
  <div style={abs(x, y, w, undefined, { transform: `rotate(${rot}deg)`, opacity: o })}>
    <div style={{ width: w, height: h, borderRadius: 6, overflow: "hidden", boxShadow: "0 14px 34px rgba(41,58,81,.18)" }}>
      <Img src={staticFile(`team/${who}.jpg`)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 22%" }} />
    </div>
    {cap && <div style={{ marginTop: 10, fontSize: 15, fontWeight: 500, color: C.sub, display: "flex", alignItems: "center", gap: 7, whiteSpace: "nowrap" }}><span style={{ width: 7, height: 7, borderRadius: 4, background: C.cyan }} />{cap}</div>}
  </div>
);
export const Tile: React.FC<{ x: number; y: number; s: number }> = ({ x, y, s }) => <Img src={staticFile("logo/kb-logo-tile.svg")} style={abs(x - s / 2, y - s / 2, s, s, { borderRadius: s * 0.075 })} />;
export const Arrow: React.FC<{ s: number; c: string }> = ({ s, c }) => <svg width={s} height={s} viewBox="0 0 24 24"><path d="M12 19V6M6 12l6-6 6 6" fill="none" stroke={c} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;
/** The message box, measured on the reference's prompt box (f284: x 405, y 400, 1110 x 270 film px; text 35 px medium
 *  on a 48 px line, 47 px from the left edge; the footer row's centre 215 px below the top; send button 50 px, 32 px
 *  from the right edge). k scales everything (the macro shots show the same box much larger). `text` is the part of
 *  the sentence typed so far; `caret` shows the text caret; `press` (0..1) pushes the send button in; children sit
 *  above the text (the attachments row). The box is 270 * k high with up to two lines of text. */
export const Msg: React.FC<{ x: number; y: number; w?: number; text: string; dark?: boolean; k?: number; big?: number; caret?: boolean; press?: number; children?: React.ReactNode }> = ({ x, y, w, text, dark, k, big, caret = true, press = 0, children }) => {
  const s = k ?? big ?? 1, fg = dark ? "#F2F5F9" : "#16202E", sub = dark ? "rgba(255,255,255,.16)" : "rgba(22,32,46,.14)";
  return (
    <div style={abs(x, y, w ?? 1110 * s, undefined, { boxSizing: "border-box", background: dark ? "#1C2634" : "#FFFFFF", borderRadius: 17 * s, boxShadow: dark ? "none" : `0 ${14 * s}px ${44 * s}px rgba(41,58,81,.07)`, border: dark ? "1px solid rgba(255,255,255,.10)" : "none", padding: `${40 * s}px ${32 * s}px ${30 * s}px ${47 * s}px` })}>
      {children}
      <div style={{ fontSize: 35 * s, fontWeight: 500, lineHeight: `${48 * s}px`, color: fg, letterSpacing: -0.7 * s, minHeight: 96 * s, paddingRight: 60 * s }}>{text}{caret && <span style={{ display: "inline-block", width: Math.max(2, 2.5 * s), height: 36 * s, background: fg, marginLeft: 3 * s, verticalAlign: `${-6 * s}px` }} />}</div>
      <div style={{ display: "flex", alignItems: "center", height: 50 * s, marginTop: 54 * s, fontSize: 23 * s, fontWeight: 500, color: fg }}>
        <svg width={22 * s} height={22 * s} viewBox="0 0 22 22" style={{ marginLeft: 1 * s }}><path d="M11 2v18M2 11h18" stroke={fg} strokeWidth="2.4" strokeLinecap="round" /></svg>
        <span style={{ width: Math.max(1, 1.5 * s), height: 30 * s, background: sub, margin: `0 ${30 * s}px 0 ${30 * s}px` }} />
        <Img src={staticFile("logo/kb-logo-tile.svg")} style={{ width: 30 * s, height: 30 * s, borderRadius: 6 * s }} /><span style={{ marginLeft: 14 * s }}>K.B team</span>
        <span style={{ marginLeft: "auto" }}>Ask</span>
        <svg width={14 * s} height={14 * s} viewBox="0 0 14 14" style={{ marginLeft: 8 * s }}><path d="M3 5l4 4 4-4" stroke={fg} strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
        <svg width={24 * s} height={30 * s} viewBox="0 0 24 30" style={{ marginLeft: 34 * s }}><rect x="8" y="2" width="8" height="15" rx="4" stroke={fg} strokeWidth="2" fill="none" /><path d="M4 13a8 8 0 0 0 16 0M12 21v6" stroke={fg} strokeWidth="2" fill="none" strokeLinecap="round" /></svg>
        <div style={{ marginLeft: 30 * s, width: 50 * s, height: 50 * s, borderRadius: 10 * s, background: C.cyan, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${(1 - 0.08 * press).toFixed(4)})`, filter: press > 0 ? `brightness(${(1 - 0.12 * press).toFixed(3)})` : undefined }}><Arrow s={25 * s} c="#16202E" /></div>
      </div>
    </div>
  );
};
export const Shot: React.FC<{ src: string; dim?: number; children?: React.ReactNode }> = ({ src, dim = 0, children }) => (
  <AbsoluteFill style={{ fontFamily: F }}><Img src={staticFile(`sb/${src}.jpg`)} style={{ width: "100%", height: "100%", objectFit: "cover" }} /><AbsoluteFill style={{ background: `rgba(10,16,26,${dim})` }} />{children}</AbsoluteFill>
);
export const Over: React.FC<{ text: string }> = ({ text }) => (
  <div style={abs(560, 470, 820, undefined, { color: "#fff", fontSize: 40, fontWeight: 500, lineHeight: 1.3, letterSpacing: -0.6, textShadow: "0 2px 18px rgba(0,0,0,.45)" })}>{text}
    <div style={abs(740, 108, 40, 40, { borderRadius: 10, background: C.cyan, display: "flex", alignItems: "center", justifyContent: "center" })}><Arrow s={22} c={C.ink} /></div></div>
);
// five simple K.B pictograms
export const Glyph: React.FC<{ k: number; s: number; c?: string }> = ({ k, s, c = C.ink }) => (
  <svg width={s} height={s} viewBox="0 0 100 100">
    {k === 0 && <g fill={c}><circle cx="50" cy="50" r="15" /><circle cx="50" cy="15" r="13" /><circle cx="50" cy="85" r="13" /><circle cx="15" cy="50" r="13" /><circle cx="85" cy="50" r="13" /><rect x="44" y="15" width="12" height="70" /><rect x="15" y="44" width="70" height="12" /></g>}
    {k === 1 && <g fill="none" stroke={c} strokeWidth="15" strokeLinejoin="round"><path d="M36 14 L10 50 L36 86" /><path d="M64 14 L90 50 L64 86" /></g>}
    {k === 2 && <g fill={c}><rect x="6" y="6" width="88" height="88" rx="24" /><path d="M50 76V28M30 46l20-20 20 20" fill="none" stroke="#F6F6F4" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" /></g>}
    {k === 3 && <path fill={c} d="M50 2 C55 32 68 45 98 50 C68 55 55 68 50 98 C45 68 32 55 2 50 C32 45 45 32 50 2Z" />}
    {k === 4 && <g fill={c}>{[0, 1, 2].flatMap((i) => [0, 1, 2].map((j) => <rect key={`${i}${j}`} x={8 + i * 30} y={8 + j * 30} width="24" height="24" rx="6" />))}</g>}
  </svg>
);
export const Bar: React.FC<{ x: number; y: number; w: number; h: number; c?: string; r?: number }> = ({ x, y, w, h, c = "#DADDE3", r }) => <div style={abs(x, y, w, h, { background: c, borderRadius: r ?? h / 2 })} />;
export const Win: React.FC<{ x: number; y: number; w: number; h: number; dark?: boolean; children?: React.ReactNode; bar?: boolean }> = ({ x, y, w, h, dark, children, bar = true }) => (
  <div style={abs(x, y, w, h, { background: dark ? "#141D2B" : C.white, borderRadius: 16, boxShadow: SH, overflow: "hidden" })}>
    {bar && <div style={{ height: 40, background: dark ? "#0F1722" : "#F1F2F4", display: "flex", alignItems: "center", gap: 8, paddingLeft: 16 }}>{["#FF6059", "#FFBD2E", "#28C941"].map((c) => <span key={c} style={{ width: 11, height: 11, borderRadius: 6, background: c }} />)}</div>}
    <div style={{ position: "relative", width: "100%", height: h - (bar ? 40 : 0) }}>{children}</div>
  </div>
);
export const Tool: React.FC<{ n: string; x: number; y: number; s: number; navy?: boolean; rot?: number }> = ({ n, x, y, s, navy, rot = 0 }) => (
  <div style={abs(x, y, s, s, { borderRadius: s * 0.22, background: navy ? C.ink : C.white, boxShadow: "0 12px 30px rgba(41,58,81,.14)", display: "flex", alignItems: "center", justifyContent: "center", transform: `rotate(${rot}deg)` })}><Img src={staticFile(`tools/${n}.png`)} style={{ width: "62%", height: "62%", objectFit: "contain" }} /></div>
);
export const Check: React.FC<{ s?: number }> = ({ s = 30 }) => <div style={{ width: s, height: s, borderRadius: s / 2, background: C.green, display: "inline-flex", alignItems: "center", justifyContent: "center", flex: "none" }}><svg width={s * 0.6} height={s * 0.6} viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" /></svg></div>;
export const TEAM = ["robin", "tom", "youri", "karl", "cedric"];
export const ROLE: Record<string, string> = { robin: "Founder & CEO", tom: "Co-Founder & CTO", youri: "Software Engineering", karl: "Commercial Technology", cedric: "Fractional CSO & Advisor" };
// ---- a few small UI pieces reused in several frames
export const FlowCard: React.FC<{ x: number; y: number; s?: number; done?: number }> = ({ x, y, s = 1, done = 2 }) => (
  <div style={abs(x, y, 420 * s, 780 * s, { background: C.white, borderRadius: 34 * s, boxShadow: SH, padding: 30 * s })}>
    <div style={{ fontSize: 22 * s, fontWeight: 700, letterSpacing: 1.2 * s, color: C.ink }}>FOLLOW-UPS</div><div style={{ fontSize: 17 * s, color: C.sub, marginTop: 4 * s, fontWeight: 500 }}>runs by itself</div>
    {["New lead", "Follow-up sent", "CRM updated", "Team notified"].map((t, i) => (
      <div key={t} style={{ marginTop: 22 * s, height: 124 * s, borderRadius: 22 * s, background: i < done ? "#E9F8F1" : "#F2F4F7", border: `2px solid ${i < done ? "#BFE9D5" : "transparent"}`, display: "flex", alignItems: "center", gap: 18 * s, padding: `0 ${22 * s}px` }}>
        <div style={{ width: 64 * s, height: 64 * s, borderRadius: 18 * s, background: [C.ink, C.cyan, C.indigo, C.mint][i], display: "flex", alignItems: "center", justifyContent: "center" }}><Glyph k={[0, 2, 4, 3][i]} s={34 * s} c="#fff" /></div>
        <div style={{ fontSize: 25 * s, fontWeight: 600 }}>{t}</div><div style={{ marginLeft: "auto" }}>{i < done ? <Check s={34 * s} /> : <div style={{ width: 34 * s, height: 34 * s, borderRadius: 17 * s, border: `3px solid #C9CFD8` }} />}</div>
      </div>))}
  </div>
);
export const Rank: React.FC<{ x: number; y: number; w: number; at: number }> = ({ x, y, w, at }) => (
  <div style={abs(x, y, w)}>
    <div style={{ fontSize: 46, fontWeight: 600, letterSpacing: 6, color: "#E8EDF4", fontFamily: "ui-monospace, Menlo, monospace" }}>RANKING</div>
    {Array.from({ length: 7 }, (_, i) => { const me = i === at; return (
      <div key={i} style={{ marginTop: 14, height: 84, borderRadius: 12, background: me ? "#F4F7FA" : "#1B2636", display: "flex", alignItems: "center", gap: 26, padding: "0 28px", boxShadow: me ? "0 14px 40px rgba(56,200,255,.35)" : "none" }}>
        <div style={{ fontSize: 34, fontWeight: 500, color: me ? C.ink : "#C5CEDB", width: 34, fontFamily: "ui-monospace, Menlo, monospace" }}>{i + 1}</div>
        <div style={{ width: 34, height: 34, borderRadius: 8, background: me ? C.cyan : ["#4F7BFF", "#22C7A0", "#FFB547", "#7C6CFF", "#FF7A66", "#8FA0B6", "#4F7BFF"][i] }} />
        {me ? <div style={{ fontSize: 30, fontWeight: 700, color: C.ink }}>Your business</div> : <div style={{ width: 260 - (i % 3) * 50, height: 14, borderRadius: 7, background: "#33425A" }} />}
        <div style={{ marginLeft: "auto", fontSize: 24, fontWeight: 600, color: me ? C.green : "#5E6E86", fontFamily: "ui-monospace, Menlo, monospace" }}>{me ? "▲ 5" : "—"}</div>
      </div>); })}
  </div>
);
export const Bars: React.FC<{ x: number; y: number; w: number; h: number; n?: number; c?: string }> = ({ x, y, w, h, n = 14, c = C.indigo }) => (
  <div style={abs(x, y, w, h, { display: "flex", alignItems: "flex-end", gap: w / n * 0.28 })}>{Array.from({ length: n }, (_, i) => <div key={i} style={{ flex: 1, height: `${30 + 62 * Math.abs(Math.sin(i * 1.3 + 0.6)) * (0.55 + i / n * 0.45)}%`, background: i === n - 3 ? C.cyan : c, borderRadius: "5px 5px 0 0" }} />)}</div>
);
export const AppUI: React.FC<{ s?: number; wire?: boolean }> = ({ s = 1, wire }) => { const g = wire ? "#D5D9DF" : undefined; return (
  <div style={{ position: "relative", width: 1500 * s, height: 800 * s, transform: `scale(${s})`, transformOrigin: "0 0" }}>
    <div style={abs(0, 0, 320, 800, { background: wire ? "#EEF0F3" : "#F4F6F9", borderRight: `1px solid ${C.line}` })}>
      <div style={abs(30, 30, 56, 56, { borderRadius: 14, background: g ?? C.ink })} />{[0, 1, 2, 3, 4].map((i) => <Bar key={i} x={30} y={130 + i * 64} w={210 - (i % 2) * 50} h={18} c={i === 0 && !wire ? C.cyan : "#D5D9DF"} />)}
    </div>
    <div style={abs(360, 34, 620, 44, { fontSize: 38, fontWeight: 700 })}>{wire ? <Bar x={0} y={8} w={340} h={26} c="#C9CED6" /> : "Bookings"}</div>
    {[0, 1, 2].map((i) => <div key={i} style={abs(360 + i * 280, 110, 256, 150, { borderRadius: 20, background: g ?? [C.ink, C.cyan, "#EEF3FF"][i], border: wire ? "2px dashed #B9C0CA" : "none" })}>{!wire && <><Bar x={24} y={26} w={120} h={12} c={i === 0 ? "rgba(255,255,255,.4)" : "rgba(41,58,81,.3)"} /><div style={abs(24, 62, 200, 60, { fontSize: 50, fontWeight: 700, color: i === 0 ? "#fff" : C.ink })}>{["248", "92%", "4.8"][i]}</div></>}</div>)}
    <div style={abs(360, 290, 816, 470, { borderRadius: 22, background: wire ? "#EEF0F3" : "#FFFFFF", border: wire ? "2px dashed #B9C0CA" : `1px solid ${C.line}` })}>{!wire && <Bars x={40} y={70} w={736} h={360} />}</div>
    <div style={abs(1210, 110, 260, 650, { borderRadius: 22, background: wire ? "#EEF0F3" : "#F4F6F9", border: wire ? "2px dashed #B9C0CA" : "none" })}>{[0, 1, 2, 3, 4].map((i) => <div key={i} style={abs(20, 24 + i * 122, 220, 104, { borderRadius: 16, background: wire ? "#E1E4E9" : "#fff" })}><div style={abs(16, 20, 64, 64, { borderRadius: 14, background: g ?? [C.cyan, C.mint, C.amber, C.violet, C.coral][i] })} /><Bar x={96} y={30} w={100} h={12} c="#C9CED6" /><Bar x={96} y={58} w={70} h={10} /></div>)}</div>
  </div>); };


// ---------------------------------------------------------------- time helpers (t is SECONDS, local to a package)
export const FPS = 60;
export const clamp = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
export const mix = (a: number, b: number, p: number) => a + (b - a) * p;
export const ease = { inOut: Easing.bezier(0.65, 0, 0.35, 1), out: Easing.bezier(0.16, 1, 0.3, 1), in: Easing.bezier(0.5, 0, 0.75, 0), smooth: Easing.bezier(0.42, 0, 0.18, 1) };
/** eased 0..1 from t0 over d seconds */
export const E = (t: number, t0: number, d: number, f: (x: number) => number = ease.inOut) => f(clamp((t - t0) / d));
/** a spring 0..1 starting at t0 (a small overshoot). cfg: damping (default 14), stiffness (170), mass (0.9) */
export const S = (t: number, t0: number, cfg: { damping?: number; stiffness?: number; mass?: number } = {}) =>
  t < t0 ? 0 : spring({ frame: (t - t0) * FPS, fps: FPS, config: { damping: 14, stiffness: 170, mass: 0.9, ...cfg } });
export const rnd = (k: number) => { const s = Math.sin(k * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
/** seconds (from the film's start) of a reference frame; inside a package subtract the package's own f0: rs(n - f0) */
export const rs = (refFrames: number) => refFrames / 24;
/** The reference frame (fractional) on screen at package-local time t, for a package whose first reference frame is f0. */
export const refN = (t: number, f0: number) => f0 + t * 24;
/** A move MEASURED on the reference (tools/track.py), replayed. keys = [[reference frame, value], ...] in rising frame
 *  order; n = refN(t, F0), fractional, so the move glides at 60 fps between the reference's 24 pictures a second.
 *  Monotone cubic: it passes through every key, never overshoots between two keys and has no kinks; before the first
 *  key and after the last it holds. For a move that starts or ends at rest, repeat the resting value on the frame
 *  before / after. Keep the keys that carry the move (start, the fast part, the overshoot's peak, the settle); a key on
 *  every frame of a slow move only copies the measuring noise. */
export const kf = (n: number, keys: [number, number][]): number => {
  const m = keys.length;
  if (m === 0) return 0;
  if (n <= keys[0][0]) return keys[0][1];
  if (n >= keys[m - 1][0]) return keys[m - 1][1];
  let i = 0; while (i < m - 2 && n >= keys[i + 1][0]) i++;
  const slope = (j: number) => (keys[j + 1][1] - keys[j][1]) / (keys[j + 1][0] - keys[j][0]);
  const tan = (j: number) => {
    if (j === 0) return slope(0);
    if (j === m - 1) return slope(m - 2);
    const a = slope(j - 1), b = slope(j);
    if (a * b <= 0) return 0;
    const h0 = keys[j][0] - keys[j - 1][0], h1 = keys[j + 1][0] - keys[j][0];
    return (3 * (h0 + h1)) / ((2 * h1 + h0) / a + (h1 + 2 * h0) / b);
  };
  const [x0, y0] = keys[i], [x1, y1] = keys[i + 1], h = x1 - x0, u = (n - x0) / h, t0 = tan(i) * h, t1 = tan(i + 1) * h, u2 = u * u, u3 = u2 * u;
  return (2 * u3 - 3 * u2 + 1) * y0 + (u3 - 2 * u2 + u) * t0 + (-2 * u3 + 3 * u2) * y1 + (u3 - u2) * t1;
};
// ---------------------------------------------------------------- typing
/** the part of `text` typed by time t, when typing starts at t0 at cps characters a second */
export const typed = (text: string, t: number, t0: number, cps: number) => text.slice(0, Math.max(0, Math.min(text.length, Math.floor((t - t0) * cps + 1e-6))));
/** a caret: solid while typing, blinking (0.53 s on, 0.53 s off) when idle */
export const Caret: React.FC<{ t: number; h: number; w?: number; c?: string; typing?: boolean; style?: P }> = ({ t, h, w = Math.max(2, h * 0.045), c = C.ink, typing, style }) => (
  <span style={{ display: "inline-block", width: w, height: h, background: c, marginLeft: h * 0.06, verticalAlign: "-0.12em", opacity: typing || t % 1.06 < 0.53 ? 1 : 0, ...style }} />
);
/** the faint colour fringes of a filmed screen, over the macro shots of typed letters */
export const Fringe: React.FC<{ o?: number }> = ({ o = 0.05 }) => <AbsoluteFill style={{ backgroundImage: `repeating-linear-gradient(90deg, rgba(255,60,60,${o}) 0 2px, rgba(60,255,120,${o}) 2px 4px, rgba(60,120,255,${o}) 4px 6px)`, mixBlendMode: "multiply" }} />;
// ---------------------------------------------------------------- filmed footage
/** A filmed clip from public/footage (<name>.mp4, 1920x1080). at = seconds into the clip to show now (a pure function
 *  of your local time: at = 0.1 + t). scale / x / y place it (a slow push: scale 1 + 0.02 * t). dim = dark scrim 0..1.
 *  grade = CSS filter for the look (default: a little warm and contrasty, like the reference's rooms). */
export const Footage: React.FC<{ name: string; at: number; scale?: number; x?: number; y?: number; dim?: number; grade?: string; style?: P }> = ({ name, at, scale = 1, x = 0, y = 0, dim = 0, grade = "contrast(1.06) saturate(1.08) sepia(0.10) brightness(0.98)", style }) => (
  <AbsoluteFill style={{ overflow: "hidden", background: "#000", ...style }}>
    <AbsoluteFill style={{ transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`, filter: grade, willChange: "transform" }}>
      <Freeze frame={Math.max(0, Math.round(at * FPS))}><OffthreadVideo src={staticFile(`footage/${name}.mp4`)} muted style={{ width: 1920, height: 1080, objectFit: "cover" }} /></Freeze>
    </AbsoluteFill>
    {dim > 0 && <AbsoluteFill style={{ background: `rgba(10,16,26,${dim})` }} />}
  </AbsoluteFill>
);
/** Footage ON TWOS. The stock clips are 24, 25 or 30 fps; at their own speed in a 60 fps film each drawing would stay
 *  2, 3, 2, 3 frames (a judder the shake check reads as jumps). So a clip advances one drawing per two film frames
 *  (30 drawings a second: 1.2-1.25 x its speed for the 24 and 25 fps clips) and the camera steps with the drawing, so
 *  a held frame is truly held. s = seconds since the shot's cut, inSec = where in the clip the shot starts.
 *  Returns at (the clip time to show) and sj (s stepped with the drawings: use it for every move over the footage). */
export const CLIP_FPS: Record<string, number> = { F1: 23.976, F2: 23.976, F3: 25, F4: 25, R: 24, S: 23.976, W: 24, AA: 23.976, AB: 29.97, AC: 23.976, AD: 25, AN: 23.976 };
export const onTwos = (name: string, s: number, inSec = 0) => {
  const fps = CLIP_FPS[name] ?? 24, j = Math.floor(Math.max(0, Math.floor(s * FPS + 0.25)) / 2);
  return { at: (Math.round(inSec * fps) + j + 0.5) / fps, sj: j / 30 };
};
/** the camera over a filmed shot: the picture arrives a little large and settles (fast, then slow), then keeps a slow
 *  push; never a linear drift. sj = the stepped seconds from onTwos. */
export const settle = (sj: number, big = 0.04, d = 0.45, push = 0.012) => 1 + big * (1 - ease.out(clamp(sj / d))) + push * sj;
// ---------------------------------------------------------------- Karl's 3D hand cursor
/** The hand at local time t. keys: [{ at, x, y, click?, early?, dur? }] with `at` in the package's local seconds and
 *  x, y the screen px of the target. The hand glides calmly (0.55-1.6 s by distance), arrives 0.5 s before `at`
 *  (set `early` to change that), and for a click its fingertip is on the target at the deepest point, at + 0.11 s.
 *  The first key is where it starts (put it below or beside the frame to let it come in). size = sprite box px. */
export const HandAt: React.FC<{ t: number; keys: HandKey[]; size?: number }> = ({ t, keys, size = 190 }) => <Hand {...handAt(t * 30, keys, { size })} />;
/** the press of a click at key time c: 0..1..0, deepest at c + 0.11 s: push the clicked thing in with it */
export const pressAt = (t: number, c: number) => (t < c + 0.03 ? 0 : Math.max(0, Math.sin(Math.PI * clamp((t - c - 0.03) / 0.34))));
