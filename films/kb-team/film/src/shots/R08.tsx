// Package R08 (reference f663-f732; cuts f679, f699), rebuilt to the reference's own layout and moves.
//   X f663-f678  the UI close-up: light screen, suggestion chips, the instruction typed into the K.B team box (rests: only typing)
//   Y f679-f698  the browser: K.B panel on the left (chat scrolls up as lines arrive), the Bookings dashboard on the right
//   Z f699-f732  the dashboard close: bars grow left to right, hatched bars arrive, tooltip hops along them, numbers change
// Everything is drawn in the reference's 1280 x 720 pixels and scaled 1.5.
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import type { Pkg, Sfx } from "../types";
import { C, F, clamp, kf, refN, useFonts } from "../kit";

const F0 = 663;
const TEXT = "Now add online booking, so customers can order in two taps";
const INK = "#16202E";
const D = { bg: "#161E2B", card: "#1D2738", edge: "#33425C", chip: "#2A3850", txt: "#E8EDF5", dim: "#8E9BB0", bar: "#5B7FFF", cyan: C.cyan, amber: "#FF9A3D" };
const A = (x: number, y: number, w?: number, h?: number, more: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left: x, top: y, width: w, height: h, ...more });
const Stage: React.FC<{ bg: string; children: React.ReactNode }> = ({ bg, children }) => (
  <AbsoluteFill style={{ background: bg, fontFamily: F, overflow: "hidden" }}>
    <div style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 720, transform: "scale(1.5)", transformOrigin: "0 0", overflow: "hidden" }}>{children}</div>
  </AbsoluteFill>
);
const Tile: React.FC<{ x: number; y: number; s: number; o?: number }> = ({ x, y, s, o = 1 }) => <Img src={staticFile("logo/kb-logo-tile.svg")} style={{ ...A(x, y, s, s), borderRadius: s * 0.08, opacity: o }} />;

// ---------------------------------------------------------------- X
const Bulb: React.FC<{ x: number; y: number; s: number }> = ({ x, y, s }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" style={A(x - s / 2, y - s / 2)}><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2V16h5v-.1c0-.8.4-1.5 1-2A6 6 0 0 0 12 3z" fill="none" stroke={INK} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
);
const X: React.FC<{ n: number }> = ({ n }) => {
  const nShown = n >= 669 ? 3 : n >= 667 ? 2 : n >= 665 ? 1 : 0;
  const shown = TEXT.slice(0, TEXT.length - 3 + nShown);
  const sent = n >= 676, caret = n < 676 && !(n >= 664 && n < 665);
  const fade = "linear-gradient(90deg,#000 60%,transparent 100%)";
  return (
    <Stage bg="#F8F7F5">
      <div style={A(1047, 0, 233, 720, { background: "#202126" })} />
      <Tile x={18} y={14} s={22} o={0.12} />
      <Bulb x={57} y={148} s={28} />
      <div style={A(92, 126, 300, 40, { fontSize: 29, fontWeight: 500, color: INK, letterSpacing: -0.6, lineHeight: "40px" })}>Suggestions</div>
      <div style={A(34, 200, 496, 72, { borderRadius: 36, background: "#EAE6E1" })}><div style={A(23, 0, 460, 72, { fontSize: 31, fontWeight: 500, color: INK, letterSpacing: -0.7, lineHeight: "72px", whiteSpace: "nowrap" })}>Add onboarding emails</div></div>
      <div style={A(547, 200, 400, 72, { borderRadius: 36, background: "#F0EDE9", WebkitMaskImage: fade, maskImage: fade })}>
        <Tile x={34} y={21} s={30} />
        <div style={A(85, 0, 400, 72, { fontSize: 31, fontWeight: 500, color: INK, letterSpacing: -0.7, lineHeight: "76px", whiteSpace: "nowrap" })}>Sync payments to booking</div>
      </div>
      <svg width="24" height="30" viewBox="0 0 24 30" style={A(969, 220)}><path d="M7 4l10 11L7 26" fill="none" stroke={INK} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
      <div style={A(21, 315, 984, 375, { boxSizing: "border-box", borderRadius: 30, background: "#fff", border: "1.5px solid #E8E5E1" })} />
      <div style={A(57, 348, 800, 100, { fontSize: 36, fontWeight: 500, lineHeight: "48px", color: INK, letterSpacing: -0.9 })}>
        {shown}{caret && <span style={{ display: "inline-block", width: 3, height: 40, background: C.cyan, verticalAlign: "-8px", marginLeft: 2 }} />}
      </div>
      <svg width="30" height="30" viewBox="0 0 30 30" style={A(88, 605)}><path d="M15 3v24M3 15h24" stroke={INK} strokeWidth="2.4" strokeLinecap="round" /></svg>
      <Tile x={200} y={596} s={42} />
      <div style={A(258, 596, 300, 46, { fontSize: 38, fontWeight: 500, color: INK, letterSpacing: -1, lineHeight: "46px" })}>K.B team</div>
      <div style={A(636, 596, 120, 46, { fontSize: 38, fontWeight: 500, color: INK, letterSpacing: -1, lineHeight: "46px" })}>Ask</div>
      <svg width="30" height="42" viewBox="0 0 24 34" style={A(804, 598)}><rect x="7" y="2" width="10" height="18" rx="5" fill="none" stroke={INK} strokeWidth="2.2" /><path d="M3 15a9 9 0 0 0 18 0M12 24v7" stroke={INK} strokeWidth="2.2" fill="none" strokeLinecap="round" /></svg>
      <div style={A(882, 576, 88, 86, { boxSizing: "border-box", borderRadius: 9, background: sent ? "#EDEBE8" : C.cyan, border: sent ? "2px solid #D9D6D1" : "none", display: "flex", alignItems: "center", justifyContent: "center" })}>
        {sent ? <div style={{ width: 28, height: 28, borderRadius: 5, border: "2px solid #C9C5BF" }} /> : <svg width="50" height="50" viewBox="0 0 24 24"><path d="M12 19V6M6 12l6-6 6 6" fill="none" stroke={INK} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
      </div>
    </Stage>
  );
};

// ---------------------------------------------------------------- shared dark pieces
const Card: React.FC<{ x: number; y: number; w: number; h: number; edge?: boolean; children?: React.ReactNode; style?: React.CSSProperties }> = ({ x, y, w, h, edge, children, style }) => (
  <div style={A(x, y, w, h, { boxSizing: "border-box", background: D.card, borderRadius: 14, border: edge ? `1.5px solid ${D.edge}` : "none", ...style })}>{children}</div>
);
const T: React.FC<{ x: number; y: number; s: number; c?: string; w?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ x, y, s, c = D.txt, w = 500, children, style }) => (
  <div style={A(x, y - s * 0.6, undefined, s * 1.2, { fontSize: s, fontWeight: w, color: c, lineHeight: `${s * 1.2}px`, whiteSpace: "nowrap", letterSpacing: -s * 0.02, ...style })}>{children}</div>
);
const Dot: React.FC<{ x: number; y: number; s: number; c: string; r?: number }> = ({ x, y, s, c, r = 3 }) => <div style={A(x - s / 2, y - s / 2, s, s, { background: c, borderRadius: r })} />;
const Hatch: React.FC<{ x: number; y: number; w: number; h: number; r?: number }> = ({ x, y, w, h, r = 3 }) => (
  <div style={A(x, y, w, h, { borderRadius: r, backgroundImage: "repeating-linear-gradient(135deg, rgba(190,200,218,.85) 0 1.5px, transparent 1.5px 5px)" })} />
);

// ---------------------------------------------------------------- Y
const arc = (cx: number, cy: number, r: number, a0: number, a1: number) => {
  const p = (a: number) => [cx + r * Math.sin((a * Math.PI) / 180), cy - r * Math.cos((a * Math.PI) / 180)];
  const [x0, y0] = p(a0), [x1, y1] = p(a1);
  return `M${x0.toFixed(2)} ${y0.toFixed(2)} A${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`;
};
const Donut: React.FC<{ n: number }> = ({ n }) => {
  const p = kf(n, [[679, 0], [682, 0.12], [686, 0.88], [690, 1]]);
  const m = (a: number, b: number) => a + (b - a) * p;
  const P0 = m(180, 300), H1 = m(400, 549), L1 = m(460, 589), M1 = m(510, 623), D1 = m(538, 656), g = 3.2;
  const segs: [number, number, string][] = [[P0, 373, D.bar], [373 + g, H1 - g, "url(#hz)"], [H1 + g, L1 - g, "#C9D0DD"], [L1 + g, M1 - g, "#8793A8"], [M1 + g, D1 - g, "#566178"]];
  return (
    <svg width="240" height="240" viewBox="0 0 240 240" style={A(623, 308)}>
      <defs><pattern id="hz" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="6" height="6" fill="#1D2738" /><rect width="2" height="6" fill="#AEB8CB" /></pattern></defs>
      {segs.map(([a, b, c], i) => b > a ? <path key={i} d={arc(120, 120, 101, a - 360 * Math.floor(0), b)} fill="none" stroke={c} strokeWidth={33} strokeLinecap="butt" /> : null)}
    </svg>
  );
};
const Slider: React.FC<{ x: number; y: number; k: number }> = ({ x, y, k }) => (
  <>
    <div style={A(x, y - 3, Math.max(0, k - x), 6, { background: D.bar, borderRadius: 3 })} />
    <div style={A(x, y - 3, 230, 6, { background: D.chip, borderRadius: 3, zIndex: -1 })} />
    <div style={A(k - 13, y - 13, 26, 26, { background: D.bar, borderRadius: 13, display: "flex", alignItems: "center", justifyContent: "center" })}><svg width="14" height="14" viewBox="0 0 24 24"><path d="M4 12h15M13 6l6 6-6 6" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></svg></div>
  </>
);
const Ico: React.FC<{ y: number; k: number }> = ({ y, k }) => (
  <div style={A(434, y - 21, 42, 42, { borderRadius: 10, background: "#1F2A3D", display: "flex", alignItems: "center", justifyContent: "center" })}>
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#DDE4F0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {k === 0 && <path d="M3 7h11v9H3zM14 10h4l3 3v3h-7" />}{k === 1 && <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9zM12 12l8-4.5M12 12v9M12 12L4 7.5" />}
      {k === 2 && <path d="M4 11l8-7 8 7v9H4zM10 20v-6h4v6" />}{k === 3 && <path d="M6 17a2.5 2.5 0 1 0 0-.1M18 7a2.5 2.5 0 1 0 0-.1M8 15l8-6" />}
      {k === 4 && <path d="M4 18l5-6 4 3 7-9" />}{k === 5 && <path d="M12 12a4 4 0 1 0 0-.1M5 21a7 7 0 0 1 14 0" />}{k === 6 && <path d="M12 21a9 9 0 1 0 0-.1M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 .9-1 1.7M12 17v.1" />}
    </svg>
  </div>
);
const Y: React.FC<{ n: number }> = ({ n }) => {
  const off = kf(n, [[682, 0], [683, -10], [684, -28], [685, -39], [686, -40], [688, -40], [689, -51], [690, -71], [691, -83], [692, -84], [694, -84], [695, -107], [696, -145], [697, -170], [698, -173]]);
  const op = (a: number, d = 1.2) => clamp((n - a) / d);
  const row = (flow: number, a: number, children: React.ReactNode) => <div style={{ ...A(0, flow + off, 423, 40), opacity: op(a), }}>{children}</div>;
  const Ck: React.FC = () => <div style={A(32, 8, 18, 18, { borderRadius: 9, background: C.green, display: "flex", alignItems: "center", justifyContent: "center" })}><svg width="11" height="11" viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="#fff" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" /></svg></div>;
  const legend = (x: number, y: number, a: number, name: string, sub: string, mark: React.ReactNode) => <div style={{ opacity: op(a, 1.5) }}>{mark}<T x={x + 24} y={y} s={16} c={D.txt}>{name}</T><T x={x + 24} y={y + 17} s={9} c={D.dim}>{sub}</T></div>;
  return (
    <Stage bg={D.bg}>
      {/* ---- right: the dashboard */}
      <div style={A(423, 0, 857, 720, { background: D.bg })} />
      {[5, 64, 127, 188, 249, 312, 373].map((y, i) => <Ico key={i} y={y} k={i} />)}
      <Card x={498} y={-60} w={699} h={250} />
      {[14, 77].map((y) => <div key={y} style={A(580, y, 580, 0, { borderTop: "1.5px dashed #4A5A76" })} />)}
      <T x={540} y={14} s={13} c={D.dim}>150</T><T x={548} y={77} s={13} c={D.dim}>0</T>
      {["06:00", "08:00", "10:00", "12:00", "14:00", "16:00", "18:00"].map((s, i) => <T key={s} x={569 + i * 95} y={103} s={13} c={D.dim}>{s}</T>)}
      <svg width="700" height="120" viewBox="498 0 700 120" style={A(498, 0)}>
        <polyline points="581,72 676,58 770,35 866,0" fill="none" stroke={D.bar} strokeWidth="2.4" /><polyline points="581,74 676,73 770,71 866,67 960,61 1055,51 1149,37" fill="none" stroke="#C9D0DD" strokeWidth="2.2" />
        {[[581, 72], [676, 58], [770, 35]].map(([x, y]) => <circle key={x} cx={x} cy={y} r="4.5" fill={D.bar} />)}{[581, 676, 770, 866, 960, 1055, 1149].map((x, i) => <circle key={x} cx={x} cy={[74, 73, 71, 67, 61, 51, 37][i]} r="4.5" fill="#C9D0DD" />)}
      </svg>
      <Dot x={562} y={146} s={14} c={D.bar} /><T x={597} y={146} s={15}>Booked</T><T x={696} y={146} s={15}>Cancelled</T>
      <Card x={1225} y={-60} w={120} h={250} /><T x={1252} y={22} s={13} c={D.dim}>5K</T>
      <T x={500} y={226} s={20} w={400}>Booking status</T><T x={1020} y={226} s={20} w={400}>Tables tonight</T>
      <Card x={500} y={255} w={485} h={480} />
      <div style={A(861, 275, 105, 25, { background: D.chip, borderRadius: 4 })}><T x={36} y={13} s={13}>monthly  ⌄</T></div>
      <Donut n={n} />
      <T x={702} y={416} s={34} w={400} style={{ transform: "translateX(0)" }}>248</T>
      <T x={696} y={447} s={13} c="#C9D0DD" w={400}>Bookings this week</T>
      {legend(614, 629, 682, "Upcoming", "50% • 124", <div style={A(614, 622, 14, 14, { backgroundImage: "repeating-linear-gradient(135deg, #AEB8CB 0 1.5px, transparent 1.5px 4px)" })} />)}
      {legend(779, 631, 685, "Seated", "20% • 50", <Dot x={785} y={630} s={14} c={D.bar} />)}
      {legend(552, 669, 686, "Late", "15% • 37", <Dot x={565} y={670} s={14} c="#566178" />)}
      {legend(698, 673, 688, "Waiting", "10% • 25", <Dot x={705} y={674} s={14} c="#8793A8" />)}
      {legend(834, 678, 689, "Cancelled", "5% • 12", <div style={A(833, 671, 14, 14, { border: "1.5px solid #C9D0DD", borderRadius: 3, boxSizing: "border-box" })} />)}
      {[[275, "Table 01", "19:30", "Deck", kf(n, [[679, 1190], [690, 1196]])], [427, "Table 02", "20:15", "Hall", kf(n, [[679, 1217], [683, 1262], [686, 1300]])], [578, "Table 03", "21:00", "Bar", kf(n, [[679, 1166], [686, 1250], [690, 1268]])]].map(([y, id, eta, loc, k]) => (
        <React.Fragment key={String(id)}>
          <Card x={1033} y={y as number} w={300} h={135} edge style={{ background: "transparent" }} />
          <T x={1080} y={(y as number) + 37} s={16} w={700}>{id as string}<span style={{ fontWeight: 400, color: D.dim }}> • {eta as string}</span></T>
          <T x={1080} y={(y as number) + 95} s={16} w={600}>{loc as string}</T>
          <Slider x={1124} y={(y as number) + 96} k={k as number} />
        </React.Fragment>
      ))}
      {/* ---- left: the K.B panel */}
      <div style={A(0, 0, 423, 720, { background: "#FAF9F7" })} />
      <div style={A(0, 0, 423, 472, { overflow: "hidden" })}>
        <div style={A(365, 168 + off, 30, 30, { borderRadius: 15, background: "#EAE6E0", fontSize: 11, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", color: "#555" })}>YB</div>
        <div style={A(33, 206 + off, 362, 71, { background: "#EAE6E0", borderRadius: 8, boxSizing: "border-box", padding: "14px 14px", fontSize: 14.5, fontWeight: 500, lineHeight: "20px", color: "#222", letterSpacing: -0.3 })}>{TEXT}</div>
        <div style={A(31, 305 + off, 24, 22, { })}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" style={{ marginTop: 3 }}><path d="M6 3h9l4 4v14H6zM9 12h6M9 16h6" /></svg></div>
        <T x={55} y={316 + off} s={15} w={500} c="#222">Edited</T>
        <div style={A(106, 305 + off, 119, 23, { border: "1px solid #DAD6D0", borderRadius: 6, background: "#F3F1EE", boxSizing: "border-box" })}><T x={9} y={12} s={13.5} c="#333">Booking page</T></div>
        <div style={A(33, 339 + off, 345, 62, { fontSize: 14.5, fontWeight: 400, lineHeight: "20.5px", color: "#555", letterSpacing: -0.2 })}>Booking is live. Customers pick a time, add their party size and confirm in two taps.</div>
        <T x={33} y={445 + off} s={11} c="#9A9A9A" w={400}>Thought for 2s ⌄</T>
        {row(460, 683.5, <><Ck /><T x={59} y={20} s={15} c="#333">Booking flow added</T></>)}
        {row(502, 689.5, <><Ck /><T x={59} y={20} s={15} c="#333">Payments connected</T></>)}
        <div style={{ ...A(33, 547 + off, 345, 70, { fontSize: 14.5, fontWeight: 400, lineHeight: "20.5px", color: "#555", letterSpacing: -0.2 }), opacity: op(694.5, 1.5) }}>Payments are connected. Customers can now pay when they book: by card, in two taps. What would you like to do next?</div>
      </div>
      <div style={A(0, 470, 423, 250, { background: "#FAF9F7" })} />
      <div style={A(0, 440, 423, 30, { background: "linear-gradient(#FAF9F700,#FAF9F7)" })} />
      <Bulb x={31} y={490} s={16} />
      <T x={45} y={490} s={13.5} c="#222">Suggestions</T>
      <div style={A(22, 511, 195, 30, { borderRadius: 15, background: "#EAE6E1" })}><T x={9} y={16} s={13} c="#222">Add onboarding emails</T></div>
      <div style={A(224, 511, 165, 30, { borderRadius: 15, background: "#F0EDE9" })}><Tile x={9} y={7.5} s={15} /><T x={31} y={16} s={13} c="#222">Sync payments</T></div>
      <svg width="12" height="16" viewBox="0 0 12 16" style={A(391, 518)}><path d="M3 2l6 6-6 6" fill="none" stroke="#222" strokeWidth="1.8" /></svg>
      <div style={A(17, 557, 390, 148, { boxSizing: "border-box", background: "#fff", border: "1px solid #E8E5E1", borderRadius: 14 })} />
      <T x={31} y={580} s={15} c="#B4B4B4" w={400}>What would you like to change?</T>
      <div style={A(41, 668, 14, 20, {})}><svg width="14" height="14" viewBox="0 0 14 14" style={{ marginTop: 3 }}><path d="M7 1v12M1 7h12" stroke="#222" strokeWidth="1.5" /></svg></div>
      <Tile x={87} y={669} s={19} /><T x={113} y={678} s={15} c="#222">K.B team</T>
      <T x={260} y={678} s={15} c="#222">Ask</T>
      <svg width="14" height="20" viewBox="0 0 24 34" style={A(327, 668)}><rect x="7" y="2" width="10" height="18" rx="5" fill="none" stroke="#222" strokeWidth="2.6" /><path d="M3 15a9 9 0 0 0 18 0M12 24v7" stroke="#222" strokeWidth="2.6" fill="none" /></svg>
      <div style={A(358, 661, 36, 36, { boxSizing: "border-box", background: "#EDEBE8", borderRadius: 6 })}><div style={A(11, 11, 14, 14, { border: "1.5px solid #BDB9B3", borderRadius: 3, boxSizing: "border-box" })} /></div>
    </Stage>
  );
};

// ---------------------------------------------------------------- Z
const FR = [699, 702, 705, 708, 711, 714, 717, 720, 723, 726, 729, 732];
const PT = [[374, 322, 240, 364, 343, 358, 432, 455, 450, 372, 406, 406, 419, 341, 379, 372, 330, 304, 330, 364, 419, 395], [373, 319, 234, 353, 324, 324, 396, 429, 438, 370, 406, 406, 419, 341, 379, 372, 330, 304, 330, 364, 419, 395], [373, 319, 234, 352, 319, 309, 374, 399, 403, 340, 390, 402, 419, 341, 379, 372, 330, 304, 330, 364, 419, 395], [371, 319, 234, 352, 319, 303, 366, 385, 384, 311, 354, 375, 421, 334, 378, 372, 330, 304, 330, 364, 419, 395], [373, 320, 234, 351, 319, 302, 363, 380, 375, 300, 338, 344, 376, 299, 352, 361, 328, 304, 330, 364, 419, 395], [373, 320, 234, 352, 319, 302, 363, 380, 373, 296, 330, 333, 349, 276, 315, 360, 297, 288, 326, 364, 419, 395], [373, 320, 234, 352, 318, 303, 363, 379, 374, 295, 329, 330, 344, 267, 315, 360, 270, 253, 292, 343, 412, 394], [373, 319, 234, 351, 319, 302, 363, 380, 374, 296, 329, 329, 342, 264, 304, 291, 258, 236, 267, 309, 377, 369], [373, 319, 234, 352, 319, 302, 363, 380, 374, 296, 329, 329, 343, 264, 303, 295, 253, 229, 257, 347, 354, 338], [373, 319, 234, 352, 319, 302, 363, 379, 373, 296, 329, 329, 343, 265, 303, 295, 254, 227, 254, 288, 372, 324], [373, 319, 234, 352, 319, 302, 363, 379, 373, 296, 329, 329, 343, 264, 302, 296, 253, 227, 253, 288, 379, 379], [373, 319, 234, 352, 319, 302, 363, 379, 374, 296, 329, 329, 342, 264, 303, 296, 254, 227, 253, 286, 379, 379]];
const HT = [[374, 322, 240, 364, 343, 358, 432, 455, 450, 372, 406, 406, 419, 341, 379, 372, 330, 304, 330, 364, 419, 395], [373, 319, 234, 353, 324, 324, 396, 429, 438, 370, 406, 406, 419, 341, 379, 372, 330, 304, 330, 364, 419, 395], [373, 319, 234, 352, 319, 309, 374, 399, 403, 340, 390, 402, 419, 341, 379, 372, 330, 304, 330, 364, 419, 395], [371, 301, 234, 262, 319, 303, 366, 385, 384, 311, 354, 362, 362, 334, 378, 372, 330, 304, 330, 364, 419, 395], [358, 285, 234, 258, 319, 302, 363, 380, 375, 300, 338, 344, 362, 299, 352, 361, 328, 304, 330, 364, 419, 395], [349, 264, 229, 236, 302, 302, 363, 380, 373, 296, 325, 333, 349, 276, 315, 317, 297, 288, 326, 364, 419, 395], [344, 254, 217, 220, 283, 287, 344, 371, 340, 295, 322, 330, 344, 267, 315, 317, 270, 253, 292, 343, 412, 394], [343, 250, 211, 213, 274, 276, 331, 357, 286, 269, 300, 292, 312, 264, 298, 291, 258, 236, 267, 309, 377, 369], [343, 249, 210, 210, 270, 271, 326, 351, 261, 256, 283, 268, 277, 264, 279, 262, 253, 229, 257, 288, 354, 338], [343, 249, 210, 210, 269, 270, 324, 348, 251, 250, 276, 255, 259, 257, 260, 223, 231, 227, 245, 275, 312, 324], [343, 249, 210, 210, 269, 270, 324, 348, 248, 248, 273, 249, 250, 250, 252, 205, 217, 219, 223, 239, 270, 297], [343, 249, 210, 210, 269, 270, 324, 348, 248, 248, 273, 248, 247, 248, 248, 197, 211, 212, 213, 219, 238, 267]];
const barKeys = (tab: number[][], i: number): [number, number][] => FR.map((f, k) => [f, tab[k][i]]);
const TIPS: [number, number, number, string, string][] = [[708, 632, 363, "106", "22"], [709, 662, 363, "96", "12"], [712, 690, 363, "96", "12"], [714, 717, 302, "128", "15"], [718, 757, 278, "153", "27"], [721, 812, 289, "106", "32"], [725, 845, 314, "96", "12"], [729, 881, 321, "128", "15"]];
const Z: React.FC<{ n: number }> = ({ n }) => {
  const bars = Array.from({ length: 22 }, (_, i) => ({ x: 339 + 29.46 * i, top: kf(n, barKeys(PT, i)), hat: kf(n, barKeys(HT, i)) }));
  // tooltip: holds on a bar, hops to the next within one frame
  const tk = (j: 1 | 2): [number, number][] => { const o: [number, number][] = []; TIPS.forEach((t, i) => { if (i) o.push([t[0] - 1, TIPS[i - 1][j]]); o.push([t[0], t[j]]); }); return o; };
  const tx = kf(n, tk(1)), ty = kf(n, tk(2)), tOp = clamp((n - 707) / 1.2);
  const tipIdx = TIPS.reduce((a, t, i) => (n >= t[0] - 0.5 ? i : a), 0);
  const num1 = n < 716 ? "07" : n < 727 ? "08" : "09", pct = n < 727 ? "72%" : "74%";
  const repC = n < 719 ? D.amber : D.dim;
  const kpi = [[-6, 258, "248", "+12.5%", "Bookings this week vs last"], [281, 332, "92%", "+3.1%", "Show-up rate vs last month"], [643, 334, "4.8", "+0.2", "Rating vs last month"], [1005, 300, "+38%", "+9.0%", "Visitors vs last month"]] as const;
  return (
    <Stage bg={D.bg}>
      {kpi.map(([x, w, big, badge, sub], i) => (
        <React.Fragment key={i}>
          <Card x={x} y={-30} w={w} h={93} edge style={{ background: "#192232" }} />
          <T x={x + 48} y={-1} s={50} w={500} c="#fff" style={{ letterSpacing: -2 }}>{big}</T>
          <div style={A(x + 138 + i * 4, -3, 50, 16, { background: "#3A4A64", borderRadius: 3, fontSize: 10, fontWeight: 600, color: "#E8EDF5", textAlign: "center", lineHeight: "16px" })}>{badge}</div>
          <T x={x + 20} y={36} s={13} c={D.dim} w={400}>{sub}</T>
        </React.Fragment>
      ))}
      <Tile x={22} y={16} s={20} o={0.45} />
      <T x={258} y={124} s={20} w={400}>Bookings by month</T>
      <div style={A(897, 107, 130, 31, { background: D.chip, borderRadius: 4 })}><T x={36} y={16} s={15}>monthly  ⌄</T></div>
      <T x={1062} y={122} s={20} w={400}>Live table view</T>
      {/* line chart, left */}
      <Card x={-20} y={153} w={251} h={415} />
      {[209, 265, 329, 392].map((y) => <div key={y} style={A(-20, y, 251, 0, { borderTop: "1.5px dashed #3E4D68" })} />)}
      <svg width="240" height="300" viewBox="0 150 240 300" style={A(0, 150)}>
        <polyline points="-30,345 0,320 90,257 182,209" fill="none" stroke={D.bar} strokeWidth="2.2" /><polyline points="-30,440 0,437 90,429 182,414" fill="none" stroke="#C9D0DD" strokeWidth="2.2" />
        {[[90, 257], [182, 209]].map(([x, y]) => <circle key={x} cx={x} cy={y} r="4.5" fill={D.bar} />)}{[[90, 429], [182, 414]].map(([x, y]) => <circle key={x} cx={x} cy={y} r="4.5" fill="#C9D0DD" />)}
      </svg>
      <T x={0} y={481} s={13} c={D.dim}>0</T><T x={66} y={481} s={13} c={D.dim}>16:00</T><T x={154} y={481} s={13} c={D.dim}>18:00</T>
      {/* the bar chart */}
      <Card x={258} y={153} w={770} h={415} />
      {["200", "150", "100", "50"].map((s, i) => <T key={s} x={299 - s.length * 3.5} y={202 + i * 66.6} s={13} c={D.dim} style={{ transform: "translateX(-50%)", marginLeft: 0 }}>{s}</T>)}
      <T x={303} y={467} s={13} c={D.dim} style={{ transform: "translateX(-50%)" }}>0</T>
      {bars.map((b, i) => (
        <React.Fragment key={i}>
          {b.hat < b.top - 4 && <Hatch x={b.x - 12} y={b.hat} w={24} h={b.top - b.hat + 10} r={12} />}
          {/* the bar is a fixed shape that slides up behind a clip at the baseline: its top glides between pixels (a bar
              sized with top / height snaps to whole pixels, 1.5 screen px here, and grew in steps) */}
          <div style={A(b.x - 12, 140, 24, 336, { overflow: "hidden" })}>
            <div style={{ position: "absolute", left: 0, top: 0, width: 24, height: 350, background: D.bar, borderRadius: "12px 12px 0 0", transform: `translate3d(0, ${(b.top - 140).toFixed(3)}px, 0)`, willChange: "transform" }} />
          </div>
        </React.Fragment>
      ))}
      {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((m, j) => <T key={m} x={337 + 55.3 * j} y={490} s={13} c={D.dim} style={{ transform: "translateX(-50%)" }}>{m}</T>)}
      <Dot x={321} y={525} s={14} c={D.bar} /><T x={335} y={526} s={15}>Booked</T>
      <div style={{ opacity: clamp((n - 704) / 1.5) }}><Hatch x={490} y={518} w={14} h={14} r={2} /><T x={510} y={525} s={15} c={repC}>No-shows</T></div>
      {/* tooltip */}
      <div style={{ ...A(0, 0, 130, 80, { transform: `translate3d(${(tx).toFixed(2)}px, ${ty.toFixed(2)}px, 0)`, willChange: "transform" }), opacity: tOp }}>
        <div style={A(0, 0, 99, 58, { background: "#F1EEFF", borderRadius: 7, boxShadow: "0 6px 18px rgba(0,0,0,.35)" })}>
          <Dot x={19} y={19} s={13} c={D.bar} /><T x={32} y={20} s={13.5} c={INK} w={600}>{TIPS[tipIdx][3]}</T>
          <div style={A(12, 33, 13, 13, { backgroundImage: "repeating-linear-gradient(135deg, #7C8798 0 1.5px, transparent 1.5px 4px)" })} /><T x={32} y={40} s={13.5} c={INK} w={600}>{TIPS[tipIdx][4]}</T>
        </div>
      </div>
      {/* bottom row */}
      <T x={54} y={603} s={19} w={400}>Tables tonight</T>
      <Card x={47} y={632} w={589} h={120} />
      <div style={A(68, 652, 547, 90, { boxSizing: "border-box", border: `1.5px solid ${D.edge}`, borderRadius: 12 })} />
      <T x={114} y={690} s={15} w={700}>Table 01<span style={{ fontWeight: 400, color: D.dim }}> • 19:30</span></T>
      <div style={A(510, 678, 75, 24, { boxSizing: "border-box", border: `1.5px solid ${D.edge}`, borderRadius: 7 })}><T x={11} y={13} s={12} c="#DDE4F0">Seated</T></div>
      <T x={663} y={601} s={19} w={400}>Bookings today</T>
      <Card x={663} y={632} w={360} h={120} />
      <T x={696} y={686} s={42} w={400} c="#fff" style={{ letterSpacing: -1 }}>{num1}</T><T x={693} y={711} s={9} c={D.dim} w={400}>Tables booked now</T>
      <T x={882} y={686} s={42} w={400} c="#fff" style={{ letterSpacing: -1 }}>{pct}</T><T x={882} y={711} s={9} c={D.dim} w={400}>Seats filled</T>
      {/* live map */}
      <Card x={1057} y={153} w={260} h={600} />
      <Dot x={1098} y={199} s={14} c={D.bar} /><T x={1112} y={199} s={15}>Seated</T><Dot x={1226} y={199} s={14} c="#C9D0DD" /><T x={1238} y={199} s={15}>Walk-</T>
      <div style={A(1114, 237, 200, 500, { background: "#26364A", borderRadius: 24, overflow: "hidden" })}>
        <svg width="200" height="500" viewBox="1114 237 200 500" style={A(0, 0)}>
          {[[1114, 330, 1280, 360], [1114, 420, 1260, 470], [1160, 237, 1200, 700], [1114, 560, 1280, 530], [1230, 237, 1210, 700]].map(([a, b, c, d], i) => <line key={i} x1={a} y1={b} x2={c} y2={d} stroke="#3D5069" strokeWidth={i % 2 ? 2 : 4} />)}
          <polyline points="1188,355 1176,392 1134,481 1180,502 1220,545 1270,470" fill="none" stroke={D.bar} strokeWidth="2.2" /><polyline points="1180,502 1176,560 1190,620 1230,680" fill="none" stroke="#FF8A70" strokeWidth="2.2" />
        </svg>
        {[["Harbour", 1130, 267], ["Old Town", 1128, 309], ["Canal St", 1118, 452], ["Market", 1120, 528], ["Quay", 1140, 565], ["East Side", 1150, 650]].map(([s, x, y]) => <T key={String(s)} x={(x as number) - 1114} y={(y as number) - 237} s={11} c="#9FB0C8" w={600}>{String(s).toUpperCase()}</T>)}
        {[["T-04", 1187, 354, D.bar], ["T-09", 1134, 482, D.bar], ["T-12", 1237, 544, "#FF7A66"]].map(([s, x, y, c]) => <div key={String(s)} style={A((x as number) - 1114, (y as number) - 237 - 11, 62, 22, { background: c as string, borderRadius: 6, fontSize: 10.5, fontWeight: 600, color: "#fff", lineHeight: "22px", paddingLeft: 24, boxSizing: "border-box" })}>{s}</div>)}
      </div>
    </Stage>
  );
};

const Comp: React.FC<{ t: number }> = ({ t }) => {
  const ok = useFonts();
  if (!ok) return <AbsoluteFill style={{ background: D.bg }} />;
  const n = refN(t, F0);
  if (n < 679) return <X n={n} />;
  if (n < 699) return <Y n={n} />;
  return <Z n={n} />;
};
const r = (n: number) => (n - F0) / 24;
const sfx: Sfx[] = [
  { t: r(665), kind: "type", note: "0.25 the last three letters, 665-669" },
  { t: r(676), kind: "click", note: "send" },
  { t: r(684), kind: "pop", note: "Booking flow added" },
  { t: r(690), kind: "pop", note: "Payments connected" },
  { t: r(699), kind: "sparkle", note: "the chart wakes, bars grow" },
  { t: r(708), kind: "tick", note: "the tooltip appears" },
  { t: r(727), kind: "pop", note: "74%" },
];
export const PKG: Pkg = { id: "R08", Comp, sfx };
