// Shared pieces drawn in the site's own UI language (wicflow.com): white cards with a soft float shadow and a hairline edge,
// the "AI at work" card with its live blue dot, the site's 16-px stroke icons, tool tiles, the black pill button, the mark.
import React from "react";
import { Img, staticFile } from "remotion";
import { C, F, SHADOW, R, rgba } from "./lib";
import { MARK_D } from "./mark";

/** The site's own 16-px stroke icons (home page, AI-at-work rows and workflow steps). */
export const ICON: Record<string, React.ReactNode> = {
  target: <><circle cx="8" cy="8" r="5.5" /><circle cx="8" cy="8" r="2" /></>,
  pencil: <path d="M10.5 2.5l3 3L6 13H3v-3z" />,
  check: <path d="M3 8.5l3 3 7-7" />,
  reply: <path d="M6.5 4L2.5 8l4 4M3 8h6.5a4 4 0 0 1 4 4v1" />,
  calendar: <><rect x="2.5" y="3.5" width="11" height="10" rx="2" /><path d="M2.5 7h11M5.5 2v3M10.5 2v3" /></>,
  arrow: <path d="M4 12L12 4M6 4h6v6" />,
  swap: <path d="M2.5 8h11M5 5.5L2.5 8 5 10.5M11 5.5l2.5 2.5L11 10.5" />,
  refresh: <path d="M13 8a5 5 0 1 1-1.5-3.6M13 2.5v3h-3" />,
};
export const Icon: React.FC<{ name: string; size: number; color?: string; stroke?: number; style?: React.CSSProperties }> = ({ name, size, color = C.ink, stroke = 1.5, style }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" style={style}>{ICON[name]}</svg>
);

/** The round icon well of an AI-at-work row; `dark` is the site's filled black well (the last row, Meeting booked). */
export const Well: React.FC<{ icon: string; size: number; dark?: boolean; blue?: number }> = ({ icon, size, dark, blue = 0 }) => (
  <div style={{ width: size, height: size, borderRadius: "50%", flex: "none", display: "flex", alignItems: "center", justifyContent: "center",
    background: dark ? C.inkStrong : blue > 0 ? `rgba(23,105,194,${0.1 * blue})` : C.paper2, boxShadow: dark ? undefined : `inset 0 0 0 1.5px ${blue > 0 ? rgba(C.blue, 0.45 * blue) : C.line}` }}>
    <Icon name={icon} size={size * 0.46} color={dark ? "#fff" : blue > 0.5 ? C.blue : C.ink} stroke={1.7} />
  </div>
);

/** The live dot: the site's 8-px blue dot with its 4-px 12% halo, breathing. */
export const LiveDot: React.FC<{ g: number; size: number; style?: React.CSSProperties }> = ({ g, size, style }) => {
  const p = 0.5 + 0.5 * Math.sin(g / 9);
  return <span style={{ display: "inline-block", width: size, height: size, borderRadius: "50%", background: C.blue, flex: "none",
    boxShadow: `0 0 0 ${size * (0.45 + 0.25 * p)}px ${rgba(C.blue, 0.1 + 0.06 * (1 - p))}`, ...style }} />;
};

export const Card: React.FC<{ style?: React.CSSProperties; children?: React.ReactNode; radius?: number }> = ({ style, children, radius = R.card }) => (
  <div style={{ position: "absolute", background: C.paper, borderRadius: radius, boxShadow: `${SHADOW.card}, ${SHADOW.edge}`, fontFamily: F.ui, color: C.ink, ...style }}>{children}</div>
);

/** One row of the AI-at-work card: icon well, title, sub-line, time. */
export const Row: React.FC<{ icon: string; title: React.ReactNode; sub?: React.ReactNode; time?: string; scale?: number; dark?: boolean; blue?: number; style?: React.CSSProperties }> = ({
  icon, title, sub, time, scale = 1, dark, blue, style }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 20 * scale, ...style }}>
    <Well icon={icon} size={56 * scale} dark={dark} blue={blue} />
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: 30 * scale, fontWeight: 700, letterSpacing: "-0.01em", whiteSpace: "nowrap" }}>{title}</div>
      {sub && <div style={{ fontSize: 24 * scale, color: C.muted, marginTop: 4 * scale, whiteSpace: "nowrap" }}>{sub}</div>}
    </div>
    {time && <div style={{ fontSize: 21 * scale, color: C.muted, fontVariantNumeric: "tabular-nums" }}>{time}</div>}
  </div>
);

/** The black pill button (the site's "AI analysis"). */
export const Pill: React.FC<{ children: React.ReactNode; size?: number; style?: React.CSSProperties; light?: boolean }> = ({ children, size = 30, style, light }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: size * 0.4, padding: `${size * 0.62}px ${size * 1.1}px`, borderRadius: 999, background: light ? C.paper : C.btn,
    color: light ? C.ink : C.btnInk, fontFamily: F.ui, fontWeight: 700, fontSize: size, letterSpacing: "-0.015em", whiteSpace: "nowrap", boxShadow: light ? `${SHADOW.card}, ${SHADOW.edge}` : undefined, ...style }}>{children}</div>
);

/** The cursor (one, for the one click that belongs to the viewer's team). */
export const Cursor: React.FC<{ x: number; y: number; s?: number; press?: number; o?: number }> = ({ x, y, s = 1, press = 0, o = 1 }) => (
  <svg width={44 * s} height={52 * s} viewBox="0 0 22 26" style={{ position: "absolute", left: x, top: y, overflow: "visible", opacity: o, transform: `scale(${1 - 0.12 * press})`, transformOrigin: "0 0", filter: "drop-shadow(0 6px 10px rgba(0,0,0,.18))" }}>
    <path d="M2 1.5v19l5.2-4.6 3.4 7.6 3.3-1.5-3.3-7.4 7.1-.4z" fill={C.inkStrong} stroke="#fff" strokeWidth={1.6} strokeLinejoin="round" />
  </svg>
);

/** The tool tiles as the site shows them (Connected to your existing workflows). */
export const TOOLS: { id: string; label: string; src: string; w?: number }[] = [
  { id: "chatgpt", label: "ChatGPT", src: "logos/chatgpt.svg" }, { id: "claude", label: "Claude", src: "logos/claude.svg" },
  { id: "gemini", label: "Gemini", src: "logos/gemini.png" }, { id: "copilot", label: "Copilot", src: "logos/copilot.svg" },
  { id: "google", label: "Google Workspace", src: "logos/google.svg", w: 1.6 }, { id: "microsoft", label: "Microsoft 365", src: "logos/microsoft.png", w: 1.9 },
  { id: "gmail", label: "Gmail", src: "logos/gmail.svg" }, { id: "outlook", label: "Outlook", src: "logos/outlook.svg" },
  { id: "sheets", label: "Google Sheets", src: "logos/sheets.svg" }, { id: "teams", label: "Teams", src: "logos/teams.svg" },
  { id: "slack", label: "Slack", src: "logos/slack.svg" }, { id: "hubspot", label: "HubSpot", src: "logos/hubspot.svg" },
  { id: "pipedrive", label: "Pipedrive", src: "logos/pipedrive.png" }, { id: "salesforce", label: "Salesforce", src: "logos/salesforce.svg", w: 1.3 },
  { id: "n8n", label: "n8n", src: "logos/n8n.svg", w: 1.2 },
];
export const ToolLogo: React.FC<{ id: string; size: number; style?: React.CSSProperties }> = ({ id, size, style }) => {
  const t = TOOLS.find((q) => q.id === id)!;
  return <Img src={staticFile(t.src)} style={{ width: size * (t.w ?? 1), height: size, objectFit: "contain", ...style }} />;
};
export const ToolTile: React.FC<{ id: string; size: number; label?: boolean; style?: React.CSSProperties }> = ({ id, size, label = true, style }) => {
  const t = TOOLS.find((q) => q.id === id)!;
  return (
    <div style={{ width: size, height: size, borderRadius: size * 0.2, background: C.paper, boxShadow: `${SHADOW.card}, ${SHADOW.edge}`, display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", gap: size * 0.08, fontFamily: F.ui, ...style }}>
      <ToolLogo id={id} size={size * (label ? 0.36 : 0.48)} />
      {label && <div style={{ fontSize: size * 0.12, color: C.muted, fontWeight: 600, whiteSpace: "nowrap" }}>{t.label}</div>}
    </div>
  );
};

/** The mark, filled; `reveal` 0..1 draws it along its stroke order (a thick mask along the ribbon's centre line). */
export const MARK_CENTRE = "M70,76 L92.7,99.4 L105.9,139.2 L114.2,185.6 L125.8,215.4 L152.3,215.4 L164.8,207.8 L182.1,178.6 L203.0,144.2 L182.1,115.3 L175.4,92.1 L195.3,76.2 L228.4,79.5 L245.6,77.2 L274.8,72.8 L307.9,79.5 L321.2,109.3 L294.7,152.4 L268.2,188.9 L241.7,218.7 L201.9,228.6 L175.4,218.7";
export const Mark: React.FC<{ w: number; color?: string; reveal?: number; id?: string; style?: React.CSSProperties }> = ({ w, color = C.inkStrong, reveal = 1, id = "mk", style }) => (
  <svg viewBox="43 43 298 194" width={w} height={(w * 194) / 298} style={{ overflow: "visible", ...style }}>
    {reveal < 1 && <defs><mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="400" height="300">
      <path d={MARK_CENTRE} pathLength={1} fill="none" stroke="#fff" strokeWidth={92} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={`${reveal} 2`} />
    </mask></defs>}
    {reveal > 0 && <path d={MARK_D} fill={color} fillRule="evenodd" mask={reveal < 1 ? `url(#${id})` : undefined} />}
  </svg>
);
