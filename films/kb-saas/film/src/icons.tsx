// Simple line icons drawn for this film (24-unit grid, round strokes), for the business's everyday tools and K.B's
// building blocks. Generic on purpose: the business's tools carry no third-party brand.
import React from "react";

type P = { size?: number; color?: string; stroke?: number; style?: React.CSSProperties };
const Svg: React.FC<P & { children: React.ReactNode }> = ({ size = 48, color = "currentColor", stroke = 2, style, children }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={stroke}
    strokeLinecap="round" strokeLinejoin="round" style={style}>{children}</svg>
);

export const ICONS: Record<string, React.FC<P>> = {
  mail: (p) => <Svg {...p}><rect x="3" y="5" width="18" height="14" rx="2.5" /><path d="M3.5 7l8.5 6 8.5-6" /></Svg>,
  calendar: (p) => <Svg {...p}><rect x="3.5" y="5" width="17" height="15" rx="2.5" /><path d="M3.5 10h17M8 3v4M16 3v4" /><circle cx="8.5" cy="14.5" r="0.6" fill={p.color ?? "currentColor"} /><circle cx="12" cy="14.5" r="0.6" fill={p.color ?? "currentColor"} /></Svg>,
  sheet: (p) => <Svg {...p}><rect x="4" y="3.5" width="16" height="17" rx="2.5" /><path d="M4 9h16M4 14.5h16M10 9v11.5" /></Svg>,
  crm: (p) => <Svg {...p}><circle cx="9" cy="9" r="3.2" /><path d="M3.5 19c.8-3.2 3-5 5.5-5s4.7 1.8 5.5 5" /><path d="M16 7h5M16 11h5M17.5 15h3.5" /></Svg>,
  invoice: (p) => <Svg {...p}><path d="M6 3.5h12v17l-2.5-1.6L13 20.5l-2.5-1.6L8 20.5l-2-1.3z" /><path d="M9 8.5h6M9 12h6M9 15.5h3.5" /></Svg>,
  chat: (p) => <Svg {...p}><path d="M4 6.5A2.5 2.5 0 016.5 4h11A2.5 2.5 0 0120 6.5v7a2.5 2.5 0 01-2.5 2.5H10l-4.5 4v-4h0A2.5 2.5 0 014 13.5z" /><path d="M8.5 9.5h7M8.5 12.5h4" /></Svg>,
  folder: (p) => <Svg {...p}><path d="M3.5 7.5A2 2 0 015.5 5.5h4l2 2.2h7a2 2 0 012 2v7.8a2 2 0 01-2 2h-13a2 2 0 01-2-2z" /></Svg>,
  form: (p) => <Svg {...p}><rect x="4.5" y="3.5" width="15" height="17" rx="2.5" /><path d="M8 8h8M8 12h8" /><rect x="8" y="15" width="4" height="2.5" rx="0.8" /></Svg>,
  cart: (p) => <Svg {...p}><path d="M3.5 4.5h2.2l2.1 10.2a1.6 1.6 0 001.6 1.3h7.6a1.6 1.6 0 001.6-1.2l1.5-6.3H6.6" /><circle cx="9.5" cy="19.5" r="1.2" /><circle cx="17" cy="19.5" r="1.2" /></Svg>,
  phone: (p) => <Svg {...p}><rect x="7" y="2.5" width="10" height="19" rx="2.5" /><path d="M11 18.5h2" /></Svg>,
  database: (p) => <Svg {...p}><ellipse cx="12" cy="6" rx="7" ry="2.8" /><path d="M5 6v12c0 1.5 3.1 2.8 7 2.8s7-1.3 7-2.8V6M5 12c0 1.5 3.1 2.8 7 2.8s7-1.3 7-2.8" /></Svg>,
  bolt: (p) => <Svg {...p}><path d="M13 3L5 13.5h6l-1 7.5 8-10.5h-6z" /></Svg>,
  check: (p) => <Svg {...p}><path d="M5 12.5l4.5 4.5L19 7.5" /></Svg>,
  spark: (p) => <Svg {...p}><path d="M12 3.5l1.9 5.1 5.1 1.9-5.1 1.9-1.9 5.1-1.9-5.1-5.1-1.9 5.1-1.9z" /><path d="M18.5 15.5l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z" /></Svg>,
  chart: (p) => <Svg {...p}><path d="M4 20h16" /><path d="M7 16v-4M11.5 16V8M16 16v-6.5" /></Svg>,
  code: (p) => <Svg {...p}><path d="M9 7l-5 5 5 5M15 7l5 5-5 5" /></Svg>,
  search: (p) => <Svg {...p}><circle cx="10.5" cy="10.5" r="6" /><path d="M15 15l5 5" /></Svg>,
  users: (p) => <Svg {...p}><circle cx="9" cy="8.5" r="3" /><path d="M3.5 19c.7-3 2.8-4.8 5.5-4.8s4.8 1.8 5.5 4.8" /><circle cx="16.5" cy="9" r="2.4" /><path d="M16.8 13.8c2 .3 3.3 1.8 3.8 4.2" /></Svg>,
  plus: (p) => <Svg {...p}><path d="M12 5v14M5 12h14" /></Svg>,
  arrowUp: (p) => <Svg {...p}><path d="M12 19V5M6 11l6-6 6 6" /></Svg>,
  clock: (p) => <Svg {...p}><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></Svg>,
  pulse: (p) => <Svg {...p}><path d="M3 12h4l2.5-6 4 12 2.5-6h5" /></Svg>,
  grow: (p) => <Svg {...p}><path d="M4 17l5.5-5.5 3.5 3.5L20 8" /><path d="M14.5 8H20v5.5" /></Svg>,
};
export type IconName = keyof typeof ICONS;
export const Icon: React.FC<P & { name: string }> = ({ name, ...p }) => { const I = ICONS[name]; return I ? <I {...p} /> : null; };
