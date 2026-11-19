// R06 shot Q (f484-f512): the full-frame browser. Everything is drawn in the reference's own 1280 x 720 units and the
// whole screen is scaled 1.5 into 1920 x 1080. Measured on the reference: the screen itself is still (a 4 px nudge at
// f492/f495); inside it the chat scrolls up, the notes layer scrolls left 2.2 units a frame, the timing line slides
// right and settles at f494, new notes arrive on their frames, the key lights at f492.
import React from "react";
import { Img, staticFile } from "remotion";
import { C, F, ease, kf } from "../kit";

const INK = "#16202E";
const A = (x: number, y: number, w?: number, h?: number, more: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left: x, top: y, width: w, height: h, ...more });

// colours of the notes (K.B palette)
const NOTE = { lav: "#B3AAF7", cor: "#FF7A66", cyan: "#38C8FF", amb: "#FFC83D", pink: "#EE7AC5" };
// [layer x at f484, y, w, label, colour, first frame, pill?]
type Note = { x: number; y: number; w: number; label: string; c: string; n0: number; fade?: boolean };
const NOTES: Note[] = [
  { x: 353, y: 292, w: 46, label: "1", c: NOTE.lav, n0: 0 },
  { x: 427, y: 292, w: 139, label: "AI answer", c: NOTE.lav, n0: 0 },
  { x: 578, y: 261, w: 46, label: "2", c: NOTE.cor, n0: 0 },
  { x: 635, y: 232, w: 47, label: "3", c: NOTE.cyan, n0: 0 },
  { x: 692, y: 232, w: 47, label: "4", c: NOTE.cyan, n0: 0 },
  { x: 807, y: 232, w: 139, label: "AI answer", c: NOTE.cyan, n0: 485, fade: true },
  { x: 957, y: 261, w: 46, label: "5", c: NOTE.cor, n0: 487 },
  { x: 1015, y: 292, w: 46, label: "6", c: NOTE.lav, n0: 489 },
  { x: 1072, y: 320, w: 47, label: "7", c: NOTE.amb, n0: 491 },
  { x: 1130, y: 348, w: 46, label: "8", c: NOTE.pink, n0: 492 },
  { x: 1187, y: 320, w: 93, label: "AI answer", c: NOTE.amb, n0: 493 },
  { x: 1291, y: 320, w: 93, label: "AI answer", c: NOTE.amb, n0: 0 },
];
const SCROLL = 2.2; // layer units per reference frame
const LANES = ["Search", "Maps", "AI", "Voice", "Social", "Reviews", "Local", "Search", "Maps", "AI", "Voice", "You", "Social", "Reviews"];
const BLACK = [394, 460, 593, 659, 725, 858, 924, 1057, 1123, 1189];

const Ico: React.FC<{ x: number; y: number; r?: number; c?: string; d?: string; s?: number }> = ({ x, y, c = "#5B6573", d, s = 14 }) => (
  <svg style={A(x - s / 2, y - s / 2, s, s)} width={s} height={s} viewBox="0 0 24 24"><path d={d} fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
);

export const ShotQ: React.FC<{ n: number }> = ({ n }) => {
  // the screen's tiny nudge (film px / scale)
  const dx = kf(n, [[491, 0], [492, -0.4], [494, -0.4], [495, -1.6], [512, -1.7]]);
  const dy = kf(n, [[485, 0], [486, -0.3], [491, -0.3], [492, -1.3], [494, -1.3], [495, -4.4], [498, -4.7], [512, -4.7]]);
  const sc = kf(n, [[491, 1], [492, 0.9997], [494, 0.9996], [495, 0.9982], [512, 0.9982]]);
  const line = kf(n, [[484, 786], [485, 790], [486, 793], [487, 796], [488, 798], [489, 801], [490, 802], [491, 804], [492, 805], [493, 806], [494, 807], [512, 807]]);
  const chat = kf(n, [[484, 0], [485, -6], [486, -7], [488, -7], [489, -22], [490, -47], [491, -64], [492, -66], [494, -66], [495, -71], [496, -79], [497, -85], [512, -85]]);
  const scroll = -SCROLL * (n - 484);
  const lit = n >= 492;
  const ver = kf(n, [[484.9, 0], [485.6, 1]]);       // "Verified" line
  const par = kf(n, [[490.4, 0], [491.6, 1]]);       // the paragraph
  const ago = kf(n, [[495.4, 0], [496.4, 1]]);
  const LINES = ["Technical SEO", "Page structure", "Metadata", "Internal links", "Structured information", "Search and AI answers"];
  return (
    <div style={A(0, 0, 1920, 1080, { background: "#FFFFFF", overflow: "hidden", fontFamily: F, letterSpacing: "-0.015em" })}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 720, transformOrigin: "0 0", transform: `translate3d(${dx.toFixed(2)}px, ${dy.toFixed(2)}px, 0) scale(${(1.5 * sc).toFixed(5)})`, willChange: "transform" }}>
        {/* browser bar */}
        <div style={A(0, 0, 1280, 48, { background: "#FFFFFF" })} />
        {["#FF6059", "#FFBD2E", "#28C941"].map((c, i) => <div key={c} style={A(21 + 19 * i, 17, 11, 11, { borderRadius: 6, background: c })} />)}
        <div style={A(381, 10, 519, 27, { borderRadius: 8, background: "#F2F2F2", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, color: "#4A5260", fontWeight: 500 })}>Your business</div>
        <Ico x={97} y={22} d="M4 5h16v14H4zM9 5v14" /><Ico x={145} y={22} d="M14 6l-6 6 6 6" /><Ico x={177} y={22} d="M10 6l6 6-6 6" c="#B8BEC8" />
        <Ico x={355} y={22} d="M12 3l8 3v6c0 5-4 8-8 9-4-1-8-4-8-9V6z" /><Ico x={1133} y={22} d="M12 4v10M7 10l5 5 5-5M5 19h14" /><Ico x={1173} y={22} d="M12 15V4M8 8l4-4 4 4M5 12v8h14v-8" /><Ico x={1213} y={22} d="M12 5v14M5 12h14" /><Ico x={1252} y={22} d="M8 8h11v11H8zM5 15V5h10" />
        {/* left panel */}
        <div style={A(0, 48, 334, 672, { background: "#F6F7F9" })} />
        <div style={A(335, 48, 945, 44, { background: "#F6F7F9" })} />
        <Img src={staticFile("logo/kb-logo-tile.svg")} style={A(11, 61, 18, 18, { borderRadius: 4 })} />
        <div style={A(50, 60, 20, 20, { borderRadius: 4, background: C.mint })} />
        <div style={A(78, 60, 200, 20, { fontSize: 13, fontWeight: 600, color: INK, lineHeight: "20px" })}>Search and AI</div>
        <Ico x={325} y={69} d="M8 5v14M12 12h8M16 8l4 4-4 4" s={12} />
        <div style={A(343, 58, 130, 24, { background: "#EDEFF2", borderRadius: 6 })} />
        <div style={A(345, 60, 60, 20, { background: "#FFFFFF", borderRadius: 5, fontSize: 13, fontWeight: 600, color: INK, display: "flex", alignItems: "center", justifyContent: "center" })}>Preview</div>
        <div style={A(411, 60, 60, 20, { fontSize: 13, fontWeight: 600, color: INK, display: "flex", alignItems: "center", justifyContent: "center" })}>Dashboard</div>
        <Ico x={1088} y={70} d="M12 5v14M5 12h14" /><Ico x={1118} y={70} d="M12 5v.1M12 12v.1M12 19v.1" c="#3A4250" />
        <div style={A(1140, 59, 50, 22, { fontSize: 13.5, fontWeight: 600, color: C.cyan, display: "flex", alignItems: "center" })}>Share</div>
        <div style={A(1201, 58, 64, 25, { background: INK, borderRadius: 7, color: "#fff", fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center" })}>Publish</div>

        {/* chat (scrolls) */}
        <div style={A(0, 95, 334, 430, { overflow: "hidden" })}>
          <div style={{ position: "absolute", left: 0, top: -95, width: 334, height: 700, transform: `translate3d(0, ${chat.toFixed(2)}px, 0)`, willChange: "transform" }}>
            {LINES.map((l, i) => (
              <div key={l} style={A(0, 202 + 24.4 * i - 11, 334, 22)}>
                <Ico x={30} y={11} d="M7 4h7l4 4v12H7zM14 4v4h4" s={13} />
                <div style={A(44, 0, 40, 22, { fontSize: 12.5, fontWeight: 500, color: INK, lineHeight: "22px" })}>Wrote</div>
                <div style={A(83, 2, undefined, 19, { background: "#ECEDF0", borderRadius: 5, padding: "0 9px", fontSize: 11.5, fontWeight: 500, color: INK, lineHeight: "19px", whiteSpace: "nowrap" })}>{l}</div>
              </div>
            ))}
            <div style={A(289, 361, 22, 12, { fontSize: 8.5, color: "#5B6573", fontWeight: 600, textAlign: "center", lineHeight: "12px" })}>YB</div>
            <div style={A(24, 387, 288, 54, { background: "#E7EAEE", borderRadius: 7 })} />
            <div style={A(37, 396, 262, 40, { fontSize: 12.5, fontWeight: 500, lineHeight: "16px", color: INK })}>Make our pages easier to find in search and AI answers.</div>
            <Ico x={30} y={466} d="M9 6l6 6-6 6" s={11} />
            <div style={A(44, 457, 260, 18, { fontSize: 12, fontWeight: 500, color: "#5B6573", lineHeight: "18px" })}>Built the page structure</div>
            <div style={A(0, 481, 334, 22, { opacity: ver, transform: `translate3d(0, ${((1 - ver) * 6).toFixed(2)}px, 0)` })}>
              <Ico x={30} y={11} d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6S2 12 2 12zM12 9.5a2.5 2.5 0 100 5 2.5 2.5 0 000-5z" s={13} c={INK} />
              <div style={A(44, 0, 280, 22, { fontSize: 12, lineHeight: "22px", color: "#5B6573", whiteSpace: "nowrap" })}><b style={{ color: INK, fontWeight: 600 }}>Verified the pages</b> {"—"} Checking the search view</div>
            </div>
            <div style={A(24, 523, 270, 50, { fontSize: 12, fontWeight: 500, lineHeight: "16.5px", color: "#4A5260", opacity: par, transform: `translate3d(0, ${((1 - par) * 10).toFixed(2)}px, 0)` })}>Your pages now read clearly to search engines, AI tools and people.</div>
            <div style={A(24, 575, 120, 14, { fontSize: 9.5, color: "#98A1AE", fontWeight: 500, opacity: ago })}>4 minutes ago</div>
          </div>
        </div>
        {/* chat footer (fixed) */}
        <div style={A(0, 520, 334, 200, { background: "#F6F7F9" })} />
        <Ico x={24} y={536} d="M9 18h6M10 21h4M12 3a6 6 0 00-4 10c1 1 1 2 1 3h6c0-1 0-2 1-3a6 6 0 00-4-10z" s={12} />
        <div style={A(35, 528, 120, 16, { fontSize: 12, fontWeight: 600, color: INK, lineHeight: "16px" })}>Suggestions</div>
        {[["Add reviews and ratings", 25, 125], ["Build a booking page", 162, 100]].map(([t, x, w]) => <div key={t as string} style={A(x as number, 552, w as number, 23, { background: "#ECEDF0", borderRadius: 6, fontSize: 11, fontWeight: 500, color: INK, display: "flex", alignItems: "center", paddingLeft: 9, whiteSpace: "nowrap" })}>{t}</div>)}
        <Ico x={313} y={564} d="M9 6l6 6-6 6" s={11} />
        <div style={A(12, 590, 310, 80, { background: "#FFFFFF", borderRadius: 10, boxShadow: "0 0 0 1px rgba(22,32,46,.06)" })} />
        <div style={A(25, 598, 260, 18, { fontSize: 12.5, color: "#9AA3AF", fontWeight: 500, lineHeight: "18px" })}>What would you like to change?</div>
        <Ico x={38} y={681} d="M12 5v14M5 12h14" />
        <Img src={staticFile("logo/kb-logo-tile.svg")} style={A(64, 673, 16, 16, { borderRadius: 4 })} />
        <div style={A(86, 672, 60, 18, { fontSize: 13, fontWeight: 600, color: INK, lineHeight: "18px" })}>K.B team</div>
        <div style={A(205, 672, 40, 18, { fontSize: 13, fontWeight: 600, color: INK, lineHeight: "18px" })}>Ask</div>
        <Ico x={263} y={681} d="M12 4a3 3 0 013 3v5a3 3 0 01-6 0V7a3 3 0 013-3zM6 11a6 6 0 0012 0M12 17v3" s={13} c={INK} />
        <div style={A(285, 668, 25, 25, { borderRadius: 5, background: C.cyan })} />
        <Ico x={297.5} y={680.5} d="M12 19V6M6 12l6-6 6 6" c="#fff" s={12} />

        {/* the app */}
        <div style={A(335, 92, 945, 628, { background: "#0C1118" })} />
        <div style={A(347, 102, 24, 24, { borderRadius: 12, overflow: "hidden" })}><Img src={staticFile("logo/kb-logo-tile.svg")} style={{ width: 24, height: 24 }} /></div>
        {/* header cards */}
        <div style={A(382, 104, 310, 84, { background: "#1E2631", borderRadius: 10 })} />
        <div style={A(390, 110, 160, 12, { fontSize: 10, fontWeight: 600, color: "#E9EDF2", lineHeight: "12px" })}>Search and AI answers</div>
        <div style={A(641, 110, 44, 12, { background: "#CFC7FF", borderRadius: 3, fontSize: 8, fontWeight: 700, color: "#3B2F8C", textAlign: "center", lineHeight: "12px" })}>Live</div>
        <div style={A(390, 126, 240, 30, { fontSize: 12.5, fontWeight: 300, color: "#9CA6B4", lineHeight: "16px", letterSpacing: "0.02em" })}>YOUR BUSINESS<br />BOOKINGS</div>
        <div style={A(390, 171, 200, 10, { fontSize: 8, fontWeight: 600, color: "#E9EDF2", lineHeight: "10px" })}>Restaurant {"·"} Local search</div>
        <div style={A(614, 172, 8, 8, { borderRadius: 4, background: C.mint })} />
        <div style={A(628, 170, 60, 12, { fontSize: 8, fontWeight: 600, color: "#C9D1DC", lineHeight: "12px", whiteSpace: "nowrap" })}>248 this week</div>
        <div style={A(700, 104, 212, 84, { background: "#1E2631", borderRadius: 10 })} />
        <div style={A(700, 110, 212, 14, { fontSize: 10.5, fontWeight: 600, color: "#E9EDF2", textAlign: "center", lineHeight: "14px" })}>Visitors</div>
        <div style={A(700, 125, 212, 16, { fontSize: 13, fontWeight: 300, color: "#9CA6B4", textAlign: "center", lineHeight: "16px" })}>+38%</div>
        <div style={A(708, 153, 198, 30, { background: "#E4E7EC", borderRadius: 2, overflow: "hidden" })}>
          {Array.from({ length: 52 }).map((_, i) => <div key={i} style={A(i * 3.8, 0, 1.3, i % 7 === 1 || i % 7 === 3 || i % 7 === 4 || i % 7 === 6 || i % 7 === 0 ? 17 : 0, { background: "#1E2631" })} />)}
          {lit && <div style={A(127, 0, 3, 30, { background: C.cyan })} />}
        </div>
        <div style={A(921, 104, 135, 84, { background: "#1E2631", borderRadius: 10 })} />
        <div style={A(930, 110, 60, 12, { fontSize: 9, fontWeight: 600, color: "#E9EDF2", lineHeight: "12px" })}>Rating</div>
        <div style={A(930, 124, 60, 14, { fontSize: 12, fontWeight: 300, color: "#9CA6B4", lineHeight: "14px" })}>4.8</div>
        <svg style={A(961, 112, 60, 68)} width={60} height={68} viewBox="0 0 60 68"><path d="M30 0L50 68H10z" fill="#E4E7EC" /><path d="M36 14L26 62" stroke={C.coral} strokeWidth="2.4" strokeLinecap="round" /><circle cx="27" cy="63" r="4.5" fill={C.coral} /></svg>
        <div style={A(1064, 103, 134, 26, { background: "#E4E7EC", borderRadius: 7, fontSize: 11, fontWeight: 600, color: INK, display: "flex", alignItems: "center", paddingLeft: 26 })}>best near me</div>
        <Ico x={1078} y={116} d="M11 4a7 7 0 100 14 7 7 0 000-14zM16 16l5 5" s={12} c={INK} />
        <div style={A(1064, 140, 134, 50, { background: "#1E2631", borderRadius: 10 })} />
        {[1095, 1130, 1166].map((x, i) => <div key={x} style={A(x - 11, 153, 22, 22, { borderRadius: 11, background: i === 1 ? "#FFFFFF" : "#2C3644" })}><div style={A(7, 6, 8, 10, { background: i === 1 ? "#1E2631" : "#C9D1DC", borderRadius: 1 })} /></div>)}
        <div style={A(1208, 104, 24, 24, { borderRadius: 12, background: "#1E2631" })} />
        <div style={A(1241, 104, 28, 28, { borderRadius: 14, background: "#E4E7EC", color: INK, fontSize: 9, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" })}>YB</div>
        <div style={A(1208, 152, 24, 24, { borderRadius: 12, background: "#1E2631" })} />
        <div style={A(1240, 148, 24, 32, { borderRadius: 6, background: C.green })} />

        {/* the canvas */}
        <div style={A(344, 197, 926, 235, { background: "#1E2631", borderRadius: "12px 12px 0 0", overflow: "hidden" })}>
          <div style={A(0, 0, line - 344, 235, { background: "#1F3B3F" })} />
          <div style={A(50, 0, 1, 235, { background: "rgba(255,255,255,.07)" })} /><div style={A(875, 0, 1, 235, { background: "rgba(255,255,255,.07)" })} />
          <div style={A(0, 116, 926, 1, { background: "rgba(255,255,255,.05)" })} /><div style={A(0, 175, 926, 1, { background: "rgba(255,255,255,.05)" })} />
          <div style={A(line - 344, 0, 1.2, 235, { background: "#F2F5F8" })} />
          {NOTES.map((nt, i) => {
            if (nt.n0 && n < nt.n0 - 0.2) return null;
            const p = nt.n0 ? kf(n, [[nt.n0 - 0.2, 0], [nt.n0 + 0.5, 1]]) : 1;
            const s = nt.n0 && !nt.fade ? 0.55 + 0.45 * ease.out(p) : 1;
            const pill = nt.w > 60;
            return (
              <div key={i} style={A(nt.x - 344 + scroll, nt.y - 197, nt.w, 47, { borderRadius: 24, background: nt.c, opacity: nt.fade ? 0.55 + 0.45 * p : Math.min(1, p * 2), transform: `scale(${s.toFixed(3)})`, color: INK, fontSize: pill ? 11 : 11.5, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: pill ? "flex-start" : "center", paddingLeft: pill ? 14 : 0, whiteSpace: "nowrap", willChange: "transform" })}>{nt.label}</div>
            );
          })}
        </div>
        <div style={A(344, 432, line - 344, 14, { background: C.mint })} />
        <div style={A(line, 432, 1270 - line, 14, { background: "#3A4350" })} />
        {/* the lanes (keys) */}
        <div style={A(344, 448, 926, 260, { background: "#DDE2E8", borderRadius: "0 0 8px 8px", overflow: "hidden" })}>
          {Array.from({ length: 13 }).map((_, i) => <div key={i} style={A((i + 1) * 66.14 - 0.5, 0, 1, 260, { background: "#C4CBD4" })} />)}
          {lit && <div style={A(1071 - 344, 145, 66, 115, { background: C.cyan })} />}
          {BLACK.map((x) => <div key={x} style={A(x - 344, 0, 32, 145, { background: "#1E2631", borderRadius: "0 0 3px 3px" })} />)}
          {lit && <div style={A(1089 - 344, 0, 32, 145, { background: C.cyan })} />}
          {LANES.map((l, i) => <div key={i} style={A(i * 66.14, l === "You" ? 212 : 226, 66.14, 34, { textAlign: "center", fontSize: 12, fontWeight: l === "You" ? 700 : 500, color: l === "You" && lit ? "#0B2A3A" : "#8791A0", lineHeight: l === "You" ? "15px" : "20px", whiteSpace: "nowrap", paddingTop: l === "You" ? 5 : 0 })}>{l === "You" ? <>Your<br />business</> : l}</div>)}
        </div>
      </div>
    </div>
  );
};
