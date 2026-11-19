// R10 AI (f900-f924) and AJ (f925-f961): K.B's shared canvas, seen close and then wide. Drawn in the reference's
// 1280 x 720 units (Px wrapper), the camera is the reference's own (measured with track.py cam, about the frame's centre).
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { C, Glyph, clamp, ease, kf } from "../kit";
import { A, Cur, IcoHeart, IcoMonitor, IcoNext, IcoPause, IcoPlay, IcoPrev, IcoRepeat, IcoShuffle, IcoStar, KBmark, Pic, Px, Sticky } from "./R10_ui";

const IND = "#4F7BFF", PAPER = "#F9F9F7";
const DOTS = { backgroundImage: "radial-gradient(#d6d8dc 1px, transparent 1.2px)", backgroundSize: "12px 12px" };
const Ground: React.FC = () => <div style={A(-200, -200, 1700, 1100, { background: PAPER, ...DOTS })} />;
const Cam: React.FC<{ s: number; dx: number; dy: number; children: React.ReactNode }> = ({ s, dx, dy, children }) => (
  <div style={{ position: "absolute", inset: 0, transformOrigin: "960px 540px", transform: `translate3d(${dx.toFixed(2)}px, ${dy.toFixed(2)}px, 0) scale(${s.toFixed(4)})`, willChange: "transform" }}>{children}</div>
);
const step = (tab: number[], n: number, f0: number) => tab[Math.max(0, Math.min(tab.length - 1, Math.floor(n + 1e-6) - f0))];
const hash = (a: number, b: number) => { const s = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return s - Math.floor(s); };
const F2 = "Montserrat, sans-serif";

// =====================================================================================================  AI
const AI_S: [number, number][] = [[900, 1], [901, 0.9833], [902, 0.9757], [903, 0.9704], [904, 0.9664], [905, 0.9632], [906, 0.9606], [908, 0.9567], [910, 0.9543], [912, 0.953], [915, 0.9522], [920, 0.9522], [921, 0.9517], [922, 0.9503], [923, 0.9476], [924, 0.9433]];
const AI_DX: [number, number][] = [[900, 0], [908, 0.3], [912, 1], [915, 1.6], [920, 1.9], [924, 2]];
const AI_DY: [number, number][] = [[900, 0], [908, 0.2], [913, 0.5], [924, 0.7]];
const V1 = [77, 81, 83, 85, 86, 88, 89, 90, 90, 91, 91, 92], V2 = [27, 30, 31, 33, 34, 35, 36, 36, 37, 37, 37, 38];

const FLOWS = [
  { t: "NEW LEAD", g: 2 }, { t: "FOLLOW-UP", g: 1 }, { t: "CRM UPDATED", g: 4 },
  { t: "TEAM NOTIFIED", g: 3 }, { t: "BOOKINGS", g: 0 }, { t: "RANKING", g: 2 },
];
const FlowCard: React.FC<{ x: number; y: number; i: number; sel: boolean; img: boolean }> = ({ x, y, i, sel, img }) => (
  <div style={A(x, y, 206, img ? 194 : 74, { background: "#fff", border: sel ? `1.5px solid ${IND}` : "1px solid #e6e6e3", borderRadius: 4, boxSizing: "border-box", overflow: "hidden" })}>
    {img && (
      <div style={A(0, 0, 206, 133, { background: "#e9e9e1" })}>
        <div style={A(70, 30, 66, 66, { opacity: 0.9 })}><Glyph k={FLOWS[i].g} s={66} c="#b4b8c0" /></div>
        <div style={A(112, 70, 56, 56, { opacity: 0.8 })}><Glyph k={(FLOWS[i].g + 2) % 5} s={56} c="#c9ccd2" /></div>
      </div>
    )}
    <div style={A(13, img ? 140 : 9, 150, 16, { fontSize: 12, fontWeight: 600, color: "#1a1a1a", letterSpacing: 0.2 })}>{FLOWS[i].t}</div>
    <div style={A(160, img ? 142 : 11, 14, 14)}><IcoStar s={11} c={sel || i === 4 || i === 1 ? IND : "#777"} fill={sel || i === 4 || i === 1 ? IND : "none"} /></div>
    <div style={A(184, img ? 138 : 6, 16, 12, { fontSize: 11, fontWeight: 700, color: "#444", letterSpacing: 1 })}>···</div>
    {[["Last run", "Today"], ["Success", "92%"]].map(([a, b], k) => (
      <div key={a} style={A(13, (img ? 160 : 28) + k * 12, 190, 10, { fontSize: 6.5, fontWeight: 500, color: "#8a8a88" })}>{a}<span style={{ position: "absolute", left: 40, color: "#1a1a1a" }}>{b}</span></div>
    ))}
  </div>
);

const Matrix: React.FC<{ n: number }> = ({ n }) => {
  const out: React.ReactNode[] = [];
  for (let c = 0; c < 21; c++) {
    const top = 6.5 + 3.4 * Math.sin(c * 0.75 + n * 0.5) + 2.6 * Math.sin(c * 1.9 - n * 0.33) + 1.6 * hash(c, 3);
    for (let r = 0; r < 23; r++) {
      const on = r >= top && hash(c * 31 + r, Math.floor(n * 0.5)) > 0.04;
      out.push(<circle key={`${c}_${r}`} cx={-48 + c * 12.8} cy={-24 + r * 12.8} r={5.4} fill={on ? IND : "#ebe8de"} />);
    }
  }
  return <svg width="260" height="330" viewBox="0 0 260 330" style={A(-60, -40, 260, 330)}><g transform="translate(60 40)">{out}</g></svg>;
};

export const BoardAI: React.FC<{ n: number }> = ({ n }) => {
  const s = kf(n, AI_S), dx = kf(n, AI_DX), dy = kf(n, AI_DY);
  const toC = (sx: number, sy: number) => [640 + (sx - 640 - dx / 1.5) / s, 360 + (sy - 360 - dy / 1.5) / s];
  const v1 = step(V1, n, 900), v2 = step(V2, n, 900);
  const sel = n >= 916 ? 1 : 0;
  // the sticky note, dragged by the second cursor (screen px of its top-left, measured), then into the canvas
  const nx = kf(n, [[900, 656], [906, 626], [912, 584], [918, 538], [924, 470]]), ny = kf(n, [[900, 552], [906, 530], [912, 510], [918, 490], [924, 464]]);
  const [ncx, ncy] = toC(nx, ny);
  const jx = kf(n, [[900, 902], [903, 974], [906, 1056], [909, 1078], [912, 1084], [921, 1094], [924, 1126]]);
  const jy = kf(n, [[900, 382], [903, 386], [906, 400], [909, 406], [912, 416], [921, 426], [924, 436]]);
  const [jcx, jcy] = toC(jx, jy);
  const ax = kf(n, [[900, 925], [903, 930], [906, 936], [912, 934], [924, 932]]), ay = kf(n, [[900, 138], [904, 160], [906, 178], [924, 182]]);
  const [acx, acy] = toC(ax, ay);
  const note1 = typed2(n, [[900, "a"], [902.5, "and f"], [905, "and follow-ups"]]);
  return (
    <AbsoluteFill style={{ background: PAPER, overflow: "hidden", fontFamily: F2 }}>
      <Cam s={s} dx={dx} dy={dy}>
        <Px>
          <Ground />
          {/* the dot-matrix chart */}
          <div style={A(-60, -40, 260, 352, { background: "#2b2b2b", borderRadius: "0 0 5px 0" })} />
          <Matrix n={n} />
          {[["12h", 29], ["16h", 90], ["20h", 150]].map(([t, x]) => <div key={t as string} style={A((x as number) - 14, 275, 40, 12, { color: "#cfcfcf", fontSize: 10.5, fontWeight: 500 })}>{t}</div>)}
          {/* the counters */}
          <div style={A(268, -40, 330, 352, { background: IND, borderRadius: "0 0 10px 10px" })} />
          <div style={A(279, -30, 308, 128, { background: "#fff", borderRadius: 14 })}>
            <div style={A(13, 36, 150, 12, { fontSize: 11, fontWeight: 500, color: "#222" })}>Show-up</div>
            <div style={A(13, 54, 200, 60, { fontSize: 44, fontWeight: 500, color: "#111", letterSpacing: -2, lineHeight: "52px" })}>{v1}<span style={{ fontSize: 14, marginLeft: 2, letterSpacing: 0 }}>%</span></div>
            <div style={A(15, 103, 278, 4, { background: "#dcdcdc", borderRadius: 2 })}><div style={A(0, 0, 278 * v1 / 100, 4, { background: "#111", borderRadius: 2 })} /></div>
          </div>
          <div style={A(279, 113, 308, 130, { background: "#fff", borderRadius: 14 })}>
            <div style={A(13, 14, 150, 14, { fontSize: 12, fontWeight: 500, color: "#222" })}>Visitors</div>
            <div style={A(13, 36, 220, 60, { fontSize: 44, fontWeight: 500, color: "#111", letterSpacing: -2, lineHeight: "52px" })}>+{v2}<span style={{ fontSize: 14, marginLeft: 2, letterSpacing: 0 }}>%</span></div>
            <div style={A(15, 103, 278, 4, { background: "#dcdcdc", borderRadius: 2 })}><div style={A(0, 0, 278 * v2 / 100, 4, { background: "#111", borderRadius: 2 })} /></div>
          </div>
          <div style={A(268, 246, 330, 66, { background: "#fff", borderRadius: "0 0 10px 10px" })} />
          {[["Flow", 316], ["Leads", 375], ["Book", 433], ["Rank", 491], ["View", 550]].map(([t, x], k) => (
            <div key={t as string} style={A((x as number) - 25, 300, 50, 12, { fontSize: 8.5, fontWeight: 500, color: k === 2 ? IND : "#666", textAlign: "center" })}>{t}</div>
          ))}
          {[316, 375, 491, 550].map((x, k) => <div key={x} style={A(x - 7, 270, 14, 14, { border: "1.5px solid #777", borderRadius: k % 2 ? 3 : 7, boxSizing: "border-box" })} />)}
          <div style={A(412, 244, 42, 42, { borderRadius: 21, background: IND, border: "3px solid #fff", boxSizing: "border-box" })}><div style={A(11, 11, 14, 14, { border: "2px solid #fff", borderRadius: 7, boxSizing: "border-box" })} /></div>
          {/* the flows */}
          <div style={A(680, -40, 700, 352, { background: "#fff", borderRadius: 6 })} />
          {[0, 1, 2].map((k) => <FlowCard key={`a${k}`} x={706 + k * 222} y={-120} i={k} sel={(k === 0 && !sel)} img />)}
          {[0, 1, 2].map((k) => <FlowCard key={`b${k}`} x={706 + k * 222} y={91} i={3 + k} sel={k === 1 && !!sel} img />)}
          {/* labels between the boards */}
          <div style={A(455, 377, 160, 16, { fontSize: 13.5, fontWeight: 400, color: "#b0b2b6" })}>1920 × 1080<span style={{ position: "absolute", left: 118, top: 1 }}><IcoMonitor s={14} c="#b0b2b6" /></span></div>
          <div style={A(679, 377, 160, 16, { fontSize: 15, fontWeight: 400, color: "#b0b2b6" })}>Live viewport</div>
          {/* the product screen (left) and the live viewport (right) */}
          <div style={A(-20, 407, 613, 340, { background: "#e5e7dc", overflow: "hidden" })}>
            <Img src={staticFile("stills/F2-1.jpg")} style={A(-40, -10, 520, 360, { objectFit: "cover", filter: "grayscale(1) contrast(1.15) brightness(1.04)", mixBlendMode: "multiply", opacity: 0.95 })} />
            <div style={A(0, 0, 613, 340, { background: "linear-gradient(90deg, rgba(229,231,220,0) 40%, rgba(229,231,220,.9) 56%)" })} />
            <div style={A(10, 138, 560, 120, { fontSize: 94, fontWeight: 500, color: "rgba(255,255,255,.96)", letterSpacing: -4, whiteSpace: "nowrap", textShadow: "0 2px 10px rgba(80,80,60,.15)" })}>Your product</div>
            <div style={A(482, 17, 112, 24, { background: IND, color: "#fff", fontSize: 8, fontWeight: 700, letterSpacing: 0.4, display: "flex", alignItems: "center", justifyContent: "center" })}>RUN NOW</div>
          </div>
          <div style={A(16, 475, 40, 40, { borderRadius: 20, background: IND, color: "#fff", fontSize: 15, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,.2)" })}>1</div>
          <div style={A(305, 564, 40, 40, { borderRadius: 20, background: IND, color: "#fff", fontSize: 15, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,.2)" })}>2</div>
          <div style={A(679, 407, 640, 340, { background: "#0b1030", overflow: "hidden" })}>
            <Img src={staticFile("stills/F1-1.jpg")} style={A(-60, -20, 760, 420, { objectFit: "cover", filter: "saturate(.9) contrast(1.15) brightness(.78)" })} />
            <div style={A(0, 0, 640, 340, { background: "linear-gradient(100deg, rgba(10,20,120,.65), rgba(40,60,220,.35) 60%, rgba(10,14,50,.55))", mixBlendMode: "multiply" })} />
            <div style={A(0, 0, 640, 340, { background: "radial-gradient(60% 70% at 25% 20%, rgba(70,110,255,.55), transparent 70%)", mixBlendMode: "screen" })} />
          </div>
          {/* the dashed link and the cursors */}
          <svg width="1400" height="600" style={A(0, 0, 1400, 600, { overflow: "visible", pointerEvents: "none" })}>
            <path d={`M38 320 C38 340 44 345 62 345 L${jcx - 18} 345 C${jcx - 6} 345 ${jcx - 4} 352 ${jcx - 2} ${jcy - 14} L${jcx} ${jcy}`} fill="none" stroke="#5B3FFF" strokeWidth="1.3" strokeDasharray="3 3.5" />
          </svg>
          <div style={A(29, 302, 18, 18, { borderRadius: 9, background: "#4b3cf0", color: "#fff", fontSize: 15, lineHeight: "17px", textAlign: "center", fontWeight: 600 })}>+</div>
          <div style={A(ncx, ncy, 175, 140, { transformOrigin: "0 0" })}>
            <Sticky x={0} y={0} w={175} h={140} bg="#fcf3a0" tag="To do" chip="KB" fs={11} text={<>Connect bookings to the CRM<br />{note1}</>} />
          </div>
          <Cur x={ncx + 105} y={ncy + 138} c="#FF6A2B" label="K.B" />
          <Cur x={jcx} y={jcy} c="#5B3FFF" label="K.B" />
          <Cur x={acx} y={acy} c="#E0103C" label="You" />
        </Px>
      </Cam>
    </AbsoluteFill>
  );
};
const typed2 = (n: number, tab: [number, string][]) => { let o = ""; for (const [f, t] of tab) if (n >= f) o = t; return o; };

// =====================================================================================================  AJ
const AJ_S: [number, number][] = [[925, 1], [926, 0.9949], [927, 0.9845], [928, 0.9759], [929, 0.9701], [930, 0.966], [931, 0.9629], [932, 0.9605], [933, 0.9584], [934, 0.9568], [936, 0.9545], [938, 0.9529], [940, 0.9518], [942, 0.9512], [945, 0.9511], [950, 0.951], [961, 0.9513]];
const AJ_DY: [number, number][] = [[925, 0], [929, -0.2], [933, -0.5], [938, -0.8], [946, -0.7], [961, -0.4]];
const PCT = [88, 89, 90, 91, 92];
const Dk = "#1b1b1e", Dk2 = "#27272b";
const ROWS_L = [["S", "Sanne", "New lead", "#7C6CFF"], ["M", "Milan", "Follow-up sent", C.mint], ["N", "Noor", "Meeting booked", C.coral]];
const Pill: React.FC<{ x: number; y: number; w: number; c: string; h?: number }> = ({ x, y, w, c, h = 10 }) => <div style={A(x, y, w, h, { background: c, borderRadius: h / 2 })} />;
const SVC = [["AI, Agents & Automation", "100+ automations", C.cyan], ["Software Development", "25 client projects", C.indigo], ["Growth Technology", "Search & AI answers", C.mint], ["Operations dashboards", "Always on", C.amber]];
const DAYS = [[2, 3, 4, 5, 6, 7, 8], [9, 10, 11, 12, 13, 14, 15], [16, 17, 18, 19, 20, 21, 22]];

export const BoardAJ: React.FC<{ n: number }> = ({ n }) => {
  const s = kf(n, AJ_S), dy = kf(n, AJ_DY);
  const pct = step(PCT, n, 925) ?? 92, p = n >= 941 ? 92 : pct;
  const scroll = kf(n, [[925, 0], [933, -16], [945, -40], [961, -52]]);
  const barH = kf(n, [[929, 0], [933, 1]]);
  // cursors in screen px (measured on the reference)
  const yx = kf(n, [[925, 990], [929, 968], [933, 962], [945, 956], [957, 944], [961, 930]]);
  const yy = kf(n, [[925, 266], [929, 300], [933, 340], [937, 380], [941, 400], [949, 440], [953, 470], [957, 505], [961, 546]]);
  const bx = kf(n, [[925, 278], [927, 305], [929, 325], [937, 340], [961, 348]]), by = kf(n, [[925, 272], [927, 255], [929, 243], [937, 243], [961, 245]]);
  const weights = [0.3, 0.1, 0.16, 0.2], cols = ["#FFB74D", "#8aa8ff", "#ff8fcf", "#c8b6ff"];
  const R = 76, L = 2 * Math.PI * R; let acc = 0;
  const segs = [{ w: 0.2, c: "#E8582B" }, { w: 0.16, c: "#4a86ff" }, { w: 0.1, c: "#ff8fcf" }, { w: 0.3, c: "#c8b6ff" }];
  void weights; void cols;
  const tot = p / 100, sum = segs.reduce((a, b) => a + b.w, 0);
  return (
    <AbsoluteFill style={{ background: PAPER, overflow: "hidden", fontFamily: F2 }}>
      <Cam s={s} dx={0} dy={dy}>
        <Px>
          <Ground />
          {/* top left: the people list */}
          <div style={A(-60, -40, 411, 199, { background: Dk, borderRadius: "0 0 8px 0" })} />
          {ROWS_L.map(([ini, nm, st, col], k) => (
            <div key={nm} style={A(-20, -2 + k * 55.5, 366, 49, { background: Dk2, borderRadius: 10 })}>
              <div style={A(14, 0, 49, 49, { background: col, color: "#fff", fontSize: 18, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" })}>{ini}</div>
              <div style={A(75, 8, 150, 16, { color: "#fff", fontSize: 11.5, fontWeight: 600 })}>{nm}</div>
              <div style={A(75, 27, 150, 12, { color: "#9a9aa0", fontSize: 9, fontWeight: 500 })}>{st}</div>
              <div style={A(225, 21, 40, 8, { display: "flex", gap: 6 })}>{[0, 1, 2].map((q) => <div key={q} style={{ width: 6, height: 6, borderRadius: 3, background: [col, "#8aa8ff", "#555"][q] }} />)}</div>
              <div style={A(276, 18, 14, 14)}><IcoHeart s={14} c={k < 2 ? "#ff5a4e" : "#999"} fill={k < 2 ? "#ff5a4e" : "none"} /></div>
              <div style={A(306, 12, 46, 25, { background: "#f3f3f1", borderRadius: 13, color: "#222", fontSize: 10, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center" })}>Open</div>
            </div>
          ))}
          {/* top centre: four number cards */}
          <div style={A(400, -30, 148, 40, { background: Dk, borderRadius: 12 })} />
          <div style={A(398, -6, 150, 22, { background: Dk2, borderRadius: 11 })}><div style={A(56, 2, 46, 18, { background: "#fff", borderRadius: 9, color: "#111", fontSize: 8.5, fontWeight: 600, textAlign: "center", lineHeight: "18px" })}>Month</div></div>
          {[["BOOKINGS", "This week", "248", "#C3B4F7"], ["SHOW-UP", "Guests", "92%", "#E8582B"], ["RATING", "Reviews", "4.8", "#4A7BF5"], ["VISITORS", "Last month", "+38%", "#F5E22E"]].map(([lab, ti, v, col], k) => (
            <div key={lab} style={A(399 + k * 143.5, 12, 139, 148, { background: col, borderRadius: 14 })}>
              <div style={A(12, 22, 120, 10, { fontSize: 8, fontWeight: 500, color: "rgba(20,20,40,.7)", letterSpacing: 0.3 })}>{lab}</div>
              <div style={A(12, 38, 124, 16, { fontSize: 13, fontWeight: 500, color: "#14142a", letterSpacing: -0.3 })}>{ti}</div>
              <div style={A(12, 62, 16, 16, { borderRadius: 8, background: k === 1 ? "rgba(20,20,40,.35)" : "rgba(20,20,40,.55)" })}><div style={{ position: "absolute", left: 5, top: 4 }}><IcoPlay s={7} c="#fff" /></div></div>
              <div style={A(12, 86, 124, 50, { fontSize: 30, fontWeight: 500, color: "#14142a", letterSpacing: -1 })}>{v}</div>
            </div>
          ))}
          {/* top right: the weekly bars and the note */}
          <div style={A(1018, -40, 330, 190, { background: "#ececea", borderRadius: "0 0 8px 8px" })} />
          {[1080, 1143, 1206].map((x, k) => <div key={x} style={A(x, -40, 36, 110 + (k === 1 ? 0 : 0), { background: k === 1 ? "#2b2b2b" : "#1f1f1f", borderRadius: "0 0 3px 3px" })} />)}
          <div style={A(1143, -40, 37, 110, { background: "#1E7BFF", borderRadius: "0 0 3px 3px", transformOrigin: "50% 0", transform: `scaleY(${barH.toFixed(3)})` })} />
          {[["Mon", 1055], ["Tue", 1126], ["Wed", 1196], ["Thu", 1262]].map(([t, x]) => <div key={t as string} style={A(x as number, 120, 40, 16, { fontSize: 15, fontWeight: 500, color: "#9a9a98", letterSpacing: 1 })}>{t}</div>)}
          <Sticky x={1160} y={115} w={67} h={75} bg="#fbf0a3" tag="Integration" chip="KB" fs={6.5} text="Connect bookings to the CRM" />
          {/* captions */}
          {[["Team", 195, 222, 0], ["Live flow", 392, 187, 0], ["Results", 1018, 188, 0], ["Bookings", 392, 562, 0]].map(([t, x, y]) => <div key={t as string} style={A(x as number, y as number, 120, 16, { fontSize: 13, color: "#a8aaae", fontWeight: 400 })}>{t}</div>)}
          {[[270, 222], [861, 187], [861, 562]].map(([x, y], k) => <div key={k} style={A(x, y, 110, 16, { fontSize: 13, color: "#a8aaae", whiteSpace: "nowrap" })}>1920 × 1080 <span style={{ marginLeft: 6 }}><IcoMonitor s={13} c="#a8aaae" /></span></div>)}
          <div style={A(62, 222, 70, 16, { fontSize: 13, color: "#a8aaae" })}>1920</div>
          <Sticky x={64} y={181} w={120} h={75} bg="#fbf0a3" tag="Integration" chip="KB" fs={6.5} text="Connect leads to the CRM profile" />
          {/* left: the record panel (a still) */}
          <div style={A(-40, 224, 202, 298, { background: "#111", overflow: "hidden" })}>
            <div style={A(46, 8, 300, 30, { fontSize: 25, fontWeight: 500, color: "#f2f2f2", letterSpacing: 2, fontFamily: "ui-monospace, Menlo, monospace" })}>AUTO FLOW</div>
            <div style={A(46, 42, 200, 10, { fontSize: 6, color: "#aaa", letterSpacing: 0.4, fontWeight: 500 })}>RECORD OR UPLOAD YOUR PROCESS</div>
            <div style={A(32, 52, 122, 20, { background: "#2a2a2c", borderRadius: 10 })}><div style={A(2, 2, 62, 16, { background: "#fff", borderRadius: 8, color: "#111", fontSize: 7, fontWeight: 600, textAlign: "center", lineHeight: "16px" })}>Record</div><div style={A(76, 2, 40, 16, { color: "#ccc", fontSize: 7, textAlign: "center", lineHeight: "16px" })}>Upload</div></div>
            <Img src={staticFile("stills/F1-1.jpg")} style={A(0, 78, 202, 180, { objectFit: "cover", filter: "saturate(.9) contrast(1.1)" })} />
            <div style={A(70, 252, 34, 34, { borderRadius: 17, background: "#ff3b30", boxShadow: "0 0 0 3px #111, 0 0 0 4.5px #ddd" })} />
          </div>
          {/* the profile card (a portrait) */}
          <div style={A(195, 219, 172, 305, { background: "#17171a", borderRadius: 8 })}>
            <div style={A(46, 22, 80, 80, { borderRadius: 40, overflow: "hidden", background: "#555" })}><Img src={staticFile("team/robin.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 22%" }} /></div>
            <div style={A(0, 106, 172, 20, { fontSize: 14, fontWeight: 600, color: "#fff", textAlign: "center", letterSpacing: -0.3 })}>Founder & CEO</div>
            <div style={A(0, 128, 172, 10, { fontSize: 6.5, color: "#8d8d92", textAlign: "center", fontWeight: 500 })}>K.B team</div>
            {[["25", "Projects"], ["100+", "Automations"], ["5", "Team"]].map(([a, b], k) => <div key={b} style={A(14 + k * 52, 146, 50, 26, { textAlign: "center" })}><div style={{ fontSize: 8, fontWeight: 600, color: "#fff" }}>{a}</div><div style={{ fontSize: 5.5, color: "#8d8d92", marginTop: 2 }}>{b}</div></div>)}
            <div style={A(10, 178, 100, 8, { fontSize: 6, color: "#aaa", fontWeight: 500 })}>Services</div>
            {["All", "AI", "Software", "Growth"].map((t, k) => <div key={t} style={A(10 + [0, 22, 38, 68][k], 190, [18, 14, 28, 26][k] + 4, 11, { borderRadius: 6, background: k === 0 ? "#fff" : "#2c2c30", color: k === 0 ? "#111" : "#bbb", fontSize: 5.5, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center" })}>{t}</div>)}
            {SVC.map(([t, sub, col], k) => (
              <div key={t as string} style={A(8, 207 + k * 27.5, 156, 24, { background: "#232327", borderRadius: 4 })}>
                <div style={A(6, 5, 14, 14, { background: col as string, borderRadius: 3 })} />
                <div style={A(26, 4, 110, 9, { color: "#fff", fontSize: 6.8, fontWeight: 600, whiteSpace: "nowrap" })}>{t}</div>
                <div style={A(26, 14, 110, 8, { color: "#8d8d92", fontSize: 5.2, fontWeight: 500 })}>{sub}</div>
                <div style={A(137, 5, 14, 14, { borderRadius: 7, background: "#f3f3f1", display: "flex", alignItems: "center", justifyContent: "center" })}><IcoPlay s={6} c="#111" /></div>
              </div>
            ))}
          </div>
          {/* the centre: the live view */}
          <div style={A(392, 215, 580, 322, { background: "#2a2622", overflow: "hidden" })}>
            <Img src={staticFile("stills/AC-1.jpg")} style={A(-20, -30, 640, 360, { objectFit: "cover", filter: "grayscale(1) sepia(.35) contrast(1.15) brightness(.85)" })} />
            <div style={A(0, 0, 580, 322, { background: "linear-gradient(180deg, rgba(20,16,12,.25), rgba(20,16,12,.05) 40%, rgba(15,12,10,.9) 82%)" })} />
            <div style={A(12, 12, 22, 22, { borderRadius: 11, overflow: "hidden", background: "#111" })}><Img src={staticFile("logo/kb-logo-tile.svg")} style={{ width: 22, height: 22 }} /></div>
            <div style={A(433, 14, 88, 18, { background: "rgba(255,255,255,.78)", borderRadius: 4, fontSize: 7, color: "#555", lineHeight: "18px", paddingLeft: 8, boxSizing: "border-box" })}>Search</div>
            <div style={A(527, 14, 16, 18, { background: "rgba(255,255,255,.78)", borderRadius: 4 })} />
            <div style={A(547, 14, 18, 18, { borderRadius: 4, overflow: "hidden" })}><Img src={staticFile("team/tom.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
            <div style={A(25, 42, 200, 10, { fontSize: 6, color: "#ddd", fontWeight: 500 })}>‹ Back to flows</div>
            <div style={A(25, 58, 160, 10, { fontSize: 5.5, color: "#bbb", fontWeight: 500 })}>Live now</div>
            <div style={A(25, 70, 300, 24, { fontSize: 15, fontWeight: 500, color: "rgba(255,255,255,.4)", letterSpacing: 1.2 })}>YOUR PRODUCT</div>
            {["Automation", "Bookings", "Live"].map((t, k) => <div key={t} style={A(25 + k * 44, 98, 40, 11, { background: "rgba(0,0,0,.55)", borderRadius: 6, color: "#eee", fontSize: 5.5, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center" })}>{t}</div>)}
            <div style={A(483, 38, 85, 76, { background: "rgba(20,20,22,.92)", borderRadius: 5, padding: "6px 7px", boxSizing: "border-box", color: "#fff", fontSize: 5.5, fontWeight: 500 })}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 6.5, fontWeight: 600 }}>Auto mode<span style={{ width: 16, height: 8, borderRadius: 4, background: "#fff", display: "inline-block", position: "relative" }}><span style={{ position: "absolute", right: 1, top: 1, width: 6, height: 6, borderRadius: 3, background: "#111" }} /></span></div>
              {[["Flow", "Follow-up"], ["Status", "Running"], ["Owner", "K.B team"], ["Next", "CRM update"]].map(([a, b]) => <div key={a} style={{ display: "flex", justifyContent: "space-between", marginTop: 9, color: "#cfcfd2" }}><span style={{ color: "#8d8d92" }}>{a}</span>{b}</div>)}
            </div>
            {/* the timeline */}
            <div style={A(0, 225, 580, 97, { background: "linear-gradient(180deg, rgba(10,10,12,.2), rgba(10,10,12,.88))" })} />
            <div style={A(20, 228, 540, 70, { overflow: "hidden" })}>
              <div style={A(scroll, 0, 700, 70, { willChange: "transform" })}>
                {([[68, 47, 18, "#c9b8f7"], [94, 47, 54, "#c9b8f7"], [151, 45, 19, "#e8582b"], [175, 32, 15, "#4a86ff"], [196, 32, 20, "#4a86ff"], [243, 32, 52, "#4a86ff"], [288, 45, 33, "#e8582b"], [326, 48, 18, "#c9b8f7"], [352, 61, 18, "#f5e22e"], [378, 66, 18, "#f5e22e"], [430, 44, 56, "#e8582b"], [161, 68, 17, "#ff8fcf"], [184, 68, 18, "#ff8fcf"], [520, 47, 20, "#c9b8f7"], [550, 61, 30, "#4a86ff"]] as [number, number, number, string][]).map(([x, y, w, c], k) => <Pill key={k} x={x} y={y} w={w} c={c} />)}
              </div>
            </div>
            <div style={A(286, 224, 1, 60, { background: "rgba(255,255,255,.85)" })} />
            <div style={A(22, 292, 12, 12, { color: "#ddd" })}><IcoPause s={9} c="#ddd" /></div>
            <div style={A(170, 296, 140, 3, { background: "rgba(255,255,255,.3)" })}><div style={A(0, 0, 70, 3, { background: "#fff" })} /></div>
            <div style={A(490, 292, 70, 10, { fontSize: 6, color: "#ddd" })}>◀ ▬▬ ⚙ ⛶</div>
          </div>
          <Sticky x={722} y={491} w={96} h={82} bg="#d7c9fa" tag="Backend" chip="KB" fs={7.5} text="Connect the CRM to bookings" />
          {/* the bookings calendar and schedule */}
          <div style={A(404, 580, 296, 200, { background: Dk, borderRadius: 8 })}>
            <div style={A(0, 18, 296, 12, { textAlign: "center", fontSize: 9, fontWeight: 600, color: "#fff" })}>Nov 2026</div>
            <div style={A(18, 18, 8, 12, { color: "#aaa", fontSize: 10 })}>‹</div><div style={A(266, 18, 8, 12, { color: "#aaa", fontSize: 10 })}>›</div>
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d, k) => <div key={d} style={A(11 + k * 39, 48, 30, 10, { textAlign: "center", fontSize: 7.5, color: "#aaa", fontWeight: 500 })}>{d}</div>)}
            {DAYS.map((row, ri) => row.map((d, k) => {
              const hl = ri === 0 && k === 3 ? "#3d7bff" : ri === 0 && k === 6 ? "#ff7ac0" : ri === 1 && k === 0 ? "#e8582b" : ri === 1 && k === 1 ? "#e8582b" : ri === 1 && k === 2 ? "#26b862" : null;
              return <div key={`${ri}_${k}`} style={A(11 + k * 39, 70 + ri * 35, 30, 22, { borderRadius: hl ? 11 : 0, background: hl ?? "transparent", color: hl ? "#fff" : "#ddd", fontSize: 8, fontWeight: 500, textAlign: "center", lineHeight: "22px" })}>{d}</div>;
            }))}
          </div>
          <div style={A(700, 580, 272, 200, { background: Dk, borderRadius: 8 })}>
            {[["7:00 PM", "Table for 4", "Your business · Booked", "#3d7bff"], ["8:30 PM", "Table for 2", "Your business · Booked", "#ff7ac0"], ["9:00 PM", "Table for 6", "Your business · Waiting", "#e8582b"]].map(([tm, t, sub, c], k) => (
              <div key={t as string + k} style={A(6, 12 + k * 52, 260, 44, { background: Dk2, borderRadius: 6 })}>
                <div style={A(14, 16, 60, 12, { fontSize: 8, color: "#bbb", fontWeight: 500 })}>{tm}</div>
                <div style={A(80, 18, 8, 8, { borderRadius: 4, background: c as string })} />
                <div style={A(96, 9, 160, 12, { fontSize: 9, fontWeight: 600, color: "#fff" })}>{t}</div>
                <div style={A(96, 24, 160, 10, { fontSize: 7, color: "#9a9aa0", fontWeight: 500 })}>{sub}</div>
              </div>
            ))}
          </div>
          {/* the bookings player (bottom left) */}
          <div style={A(-40, 573, 391, 200, { background: "#1c1c1f", borderRadius: "0 8px 0 0" })}>
            <div style={A(30, 10, 66, 66, { overflow: "hidden", borderRadius: 4 })}><Pic k="mint" /></div>
            <div style={A(108, 22, 200, 22, { fontSize: 16, fontWeight: 600, color: "#fff", letterSpacing: -0.4 })}>Bookings</div>
            <div style={A(108, 46, 200, 14, { fontSize: 10.5, color: "#aaa", fontWeight: 500 })}>Your business</div>
            <div style={A(342, 24, 16, 16, { color: "#fff" })}><IcoHeart s={14} /></div>
            <div style={A(46, 86, 300, 3, { background: "#444" })}><div style={A(0, 0, 70, 3, { background: "#fff" })} /></div>
            <div style={A(46, 130, 300, 40, { display: "flex", justifyContent: "space-between", alignItems: "center", color: "#ddd" })}><IcoShuffle s={13} /><IcoPrev s={14} /><div style={{ width: 44, height: 44, borderRadius: 22, background: "#f2f2f0", color: "#111", display: "flex", alignItems: "center", justifyContent: "center", marginTop: -4 }}><IcoPause s={16} c="#111" /></div><IcoNext s={14} /><IcoRepeat s={13} /></div>
          </div>
          {/* the results panel */}
          <div style={A(1018, 222, 300, 560, { background: "#17171a", borderRadius: 12 })}>
            <div style={A(14, 14, 260, 40, { fontSize: 35, fontWeight: 500, color: "#f4f4f4", letterSpacing: 2.5, fontFamily: "ui-monospace, Menlo, monospace", opacity: 0.95 })}>RESULTS</div>
            <div style={A(14, 74, 252, 26, { background: "#232326", borderRadius: 13 })}>
              {["Week", "Month", "Year"].map((t, k) => <div key={t} style={A(2 + k * 84, 2, 80, 22, { borderRadius: 11, background: k === 1 ? "#f4f4f4" : "transparent", color: k === 1 ? "#111" : "#aaa", fontSize: 8.5, fontWeight: 500, textAlign: "center", lineHeight: "22px" })}>{t}</div>)}
            </div>
            <svg width="250" height="250" viewBox="-125 -125 250 250" style={A(20, 108, 250, 250)}>
              <circle r={R} fill="none" stroke="#38383c" strokeWidth="22" />
              {segs.map((g, k) => { const len = (g.w / sum) * tot * L, o = acc; acc += len; return <circle key={k} r={R} fill="none" stroke={g.c} strokeWidth="22" strokeDasharray={`${len.toFixed(2)} ${(L - len).toFixed(2)}`} strokeDashoffset={(-o).toFixed(2)} transform="rotate(-90)" />; })}
            </svg>
            <div style={A(20, 213, 250, 36, { textAlign: "center", fontSize: 29, fontWeight: 500, color: "#fff", letterSpacing: -0.5 })}>{p}%</div>
            <div style={A(20, 247, 250, 20, { textAlign: "center", fontSize: 14, fontWeight: 500, color: "#e8e8e8" })}>Show-up</div>
            {[["W1", "#E8582B", 36], ["W2", "#4a86ff", 36], ["W3", "#ff8fcf", 26], ["W4", "#c8b6ff", 34]].map(([t, c, h], k) => (
              <div key={t as string}>
                <div style={A(34 + k * 50, 316, 30, 76, { background: "#303034", borderRadius: 15 })}><div style={A(2, 76 - 2 - (h as number) - 8, 26, (h as number) + 8, { background: c as string, borderRadius: 13 })} /></div>
                <div style={A(24 + k * 50, 395, 50, 12, { textAlign: "center", fontSize: 11, color: "#ddd", fontWeight: 500 })}>{t}</div>
              </div>
            ))}
            <div style={A(14, 432, 280, 84, { background: "#ebebe9", borderRadius: 14 })}>
              <div style={A(14, 14, 30, 30, { color: "#222" })}><IcoStar s={22} c="#222" /></div>
              <div style={A(50, 14, 150, 16, { fontSize: 14, color: "#7d7d7b", fontWeight: 500 })}>Rating</div>
              <div style={A(50, 32, 160, 28, { fontSize: 22, color: "#1a1a1a", fontWeight: 500 })}>4.8 / 5</div>
              <div style={A(228, 26, 22, 22, { borderRadius: 11, border: "1.2px solid #444", boxSizing: "border-box", fontSize: 11, textAlign: "center", lineHeight: "19px", color: "#333" })}>→</div>
            </div>
          </div>
          {/* links between the boards */}
          <svg width="1400" height="800" style={A(0, 0, 1400, 800, { overflow: "visible", pointerEvents: "none" })}>
            <path d="M1008 80 L985 80 L985 372 Q985 388 969 388 L957 388" fill="none" stroke="#5B3FFF" strokeWidth="1.2" strokeDasharray="2 3" />
            <path d="M72 538 L72 543 Q72 547 77 547 L670 547 Q680 547 680 557 L680 574" fill="none" stroke="#5B3FFF" strokeWidth="1.2" strokeDasharray="2 3" />
            <circle cx="957" cy="388" r="4" fill="#fff" stroke="#5B3FFF" strokeWidth="1.2" /><circle cx="680" cy="578" r="4" fill="#fff" stroke="#5B3FFF" strokeWidth="1.2" />
          </svg>
        </Px>
      </Cam>
      {/* the cursors are in screen px (measured on the reference): the board scales under them */}
      <Px>
        <Cur x={bx} y={by} c="#2F7BFF" label="K.B" />
        <Cur x={yx} y={yy} c="#FF6A2B" label="You" />
      </Px>
      <KBmark c="rgba(255,255,255,.55)" />
    </AbsoluteFill>
  );
};
void clamp; void ease; void IcoShuffle;
