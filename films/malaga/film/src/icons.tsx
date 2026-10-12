// Simple line icons (24-unit grid, round strokes): the everyday parts of running a holiday home. Generic on purpose:
// no third-party brand.
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
  building: (p) => <Svg {...p}><rect x="5" y="3.5" width="14" height="17" rx="2" /><path d="M9 7.5h2M13 7.5h2M9 11h2M13 11h2M9 14.5h2M13 14.5h2M10.5 20.5v-3h3v3" /></Svg>,
  link: (p) => <Svg {...p}><path d="M10 14a4 4 0 005.7 0l3-3a4 4 0 00-5.7-5.7l-1 1" /><path d="M14 10a4 4 0 00-5.7 0l-3 3a4 4 0 005.7 5.7l1-1" /></Svg>,
  shield: (p) => <Svg {...p}><path d="M12 3.5l7 2.8v5.2c0 4.3-3 7.7-7 9-4-1.3-7-4.7-7-9V6.3z" /></Svg>,
  refresh: (p) => <Svg {...p}><path d="M19.5 12a7.5 7.5 0 01-13.2 4.9M4.5 12a7.5 7.5 0 0113.2-4.9" /><path d="M18 3.5v3.8h-3.8M6 20.5v-3.8h3.8" /></Svg>,
  grid: (p) => <Svg {...p}><rect x="4" y="4" width="7" height="7" rx="1.5" /><rect x="13" y="4" width="7" height="7" rx="1.5" /><rect x="4" y="13" width="7" height="7" rx="1.5" /><rect x="13" y="13" width="7" height="7" rx="1.5" /></Svg>,
  key: (p) => <Svg {...p}><circle cx="8" cy="12" r="4" /><path d="M12 12h8.5M17.5 12v3M20.5 12v2.2" /></Svg>,
  bed: (p) => <Svg {...p}><path d="M3.5 18.5V7M3.5 14.5h17v4M20.5 14.5v-2.5a3 3 0 00-3-3H11v5.5" /><circle cx="7.3" cy="11.3" r="1.8" /></Svg>,
  wrench: (p) => <Svg {...p}><path d="M14.5 6.2a4 4 0 015.2 5.2l-2.4-.8-1.9 1.9.8 2.4a4 4 0 01-5.2-5.2L4.8 3.8M10.9 9.6l-6.8 6.8a1.9 1.9 0 102.7 2.7l6.8-6.8" /></Svg>,
  suitcase: (p) => <Svg {...p}><rect x="5" y="7" width="14" height="12.5" rx="2.5" /><path d="M9.5 7V5a1.5 1.5 0 011.5-1.5h2A1.5 1.5 0 0114.5 5v2M9 7v12.5M15 7v12.5M8 19.5v1.5M16 19.5v1.5" /></Svg>,
  lock: (p) => <Svg {...p}><rect x="5" y="10.5" width="14" height="10" rx="2.5" /><path d="M8 10.5V8a4 4 0 018 0v2.5" /><circle cx="12" cy="15.5" r="1.2" /></Svg>,
  wifi: (p) => <Svg {...p}><path d="M3.5 9.5a12 12 0 0117 0M6.5 12.7a7.6 7.6 0 0111 0M9.5 15.8a3.3 3.3 0 015 0" /><circle cx="12" cy="18.8" r="0.9" fill={p.color ?? "currentColor"} /></Svg>,
  waves: (p) => <Svg {...p}><path d="M3.5 9c2 0 2-1.5 4.2-1.5S9.9 9 12 9s2.1-1.5 4.3-1.5S18.5 9 20.5 9M3.5 13.5c2 0 2-1.5 4.2-1.5s2.2 1.5 4.3 1.5 2.1-1.5 4.3-1.5 2.2 1.5 4.2 1.5M3.5 18c2 0 2-1.5 4.2-1.5S9.9 18 12 18s2.1-1.5 4.3-1.5S18.5 18 20.5 18" /></Svg>,
  laundry: (p) => <Svg {...p}><rect x="4.5" y="3.5" width="15" height="17" rx="2.5" /><path d="M4.5 7.5h15" /><circle cx="12" cy="14" r="4" /><circle cx="7.5" cy="5.5" r="0.5" fill={p.color ?? "currentColor"} /></Svg>,
  sun: (p) => <Svg {...p}><circle cx="12" cy="12" r="4" /><path d="M12 2.8v2.2M12 19v2.2M2.8 12H5M19 12h2.2M5.5 5.5l1.6 1.6M16.9 16.9l1.6 1.6M5.5 18.5l1.6-1.6M16.9 7.1l1.6-1.6" /></Svg>,
  star: (p) => <Svg {...p}><path d="M12 3.8l2.5 5.1 5.6.8-4 3.9 1 5.6-5.1-2.6-5.1 2.6 1-5.6-4-3.9 5.6-.8z" /></Svg>,
  home: (p) => <Svg {...p}><path d="M4 10.5L12 4l8 6.5V19a1.5 1.5 0 01-1.5 1.5h-13A1.5 1.5 0 014 19z" /><path d="M9.5 20.5v-6h5v6" /></Svg>,
  bell: (p) => <Svg {...p}><path d="M6.5 16.5V11a5.5 5.5 0 0111 0v5.5l1.5 2h-14z" /><path d="M10 20.5a2 2 0 004 0" /></Svg>,
  pen: (p) => <Svg {...p}><path d="M15.5 4.5l4 4L9 19l-5 1 1-5z" /><path d="M13.5 6.5l4 4" /></Svg>,
  camera: (p) => <Svg {...p}><path d="M4 8.5A2 2 0 016 6.5h2.2l1.5-2h4.6l1.5 2H18a2 2 0 012 2V18a2 2 0 01-2 2H6a2 2 0 01-2-2z" /><circle cx="12" cy="13" r="3.6" /></Svg>,
  thermo: (p) => <Svg {...p}><path d="M10 14.2V5a2 2 0 014 0v9.2a4 4 0 11-4 0z" /><path d="M12 9v7" /></Svg>,
  bulb: (p) => <Svg {...p}><path d="M9 17.5h6M10 20.5h4M8.2 14a6 6 0 117.6 0c-.8.7-1.3 1.6-1.3 2.6v.9h-5v-.9c0-1-.5-1.9-1.3-2.6z" /></Svg>,
  leaf: (p) => <Svg {...p}><path d="M5 19c0-8 5-13.5 15-14-.4 9.5-6 15-14 15" /><path d="M5 19l7-7" /></Svg>,
  pin: (p) => <Svg {...p}><path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0113 0c0 5-6.5 11-6.5 11z" /><circle cx="12" cy="10" r="2.4" /></Svg>,
  sparkle: (p) => <Svg {...p}><path d="M12 3.5l1.8 5.2 5.2 1.8-5.2 1.8L12 17.5l-1.8-5.2-5.2-1.8 5.2-1.8zM18.5 15.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z" /></Svg>,
  towel: (p) => <Svg {...p}><path d="M6 4.5h12v13.5H6z" /><path d="M6 8.5h12M9 18v2.5M15 18v2.5" /></Svg>,
  euro: (p) => <Svg {...p}><path d="M17.5 6.2A7 7 0 007 12a7 7 0 0010.5 5.8M4.5 10.2h9M4.5 13.8h9" /></Svg>,
  door: (p) => <Svg {...p}><path d="M6 20.5V4.5a1 1 0 011-1h10a1 1 0 011 1v16M3.5 20.5h17" /><circle cx="14.6" cy="12.5" r="0.9" fill={p.color ?? "currentColor"} /></Svg>,
  clipboard: (p) => <Svg {...p}><rect x="5" y="4.5" width="14" height="16" rx="2.5" /><path d="M9 4.5V3.8A1.3 1.3 0 0110.3 2.5h3.4A1.3 1.3 0 0115 3.8v.7M8.5 10.5l1.5 1.5 3-3M8.5 16h7" /></Svg>,
  plane: (p) => <Svg {...p}><path d="M10.5 13.5L4 11l1.2-1.5 7.3.6 4.2-4.6a1.8 1.8 0 012.6 2.6l-4.6 4.2.6 7.3L14 20.5l-2.5-6.5-3.2 3 .2 2.3-1.3 1-1.5-3.2-3.2-1.5 1-1.3 2.3.2z" /></Svg>,
  grow: (p) => <Svg {...p}><path d="M4 17l5.5-5.5 3.5 3.5L20 8" /><path d="M14.5 8H20v5.5" /></Svg>,
};
export type IconName = keyof typeof ICONS;
export const Icon: React.FC<P & { name: string }> = ({ name, ...p }) => { const I = ICONS[name]; return I ? <I {...p} /> : null; };
