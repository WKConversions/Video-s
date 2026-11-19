// R06 shot S (f528-f556): a split screen. Left: the filmed hand in a rounded window. Right: the ranking panel, drawn in the
// reference's 1280 x 720 units (scaled 1.5). "Your business" is the lit row: it climbs from ninth to second in one
// continuous run (its top edge MEASURED per reference frame); every row it passes slides one place down under it, starting
// when the lit row's top edge is 18 units below that row's top, on a fast ease-out (about 1.8 reference frames).
import React from "react";
import { C, F, Footage, clamp, ease, kf, onTwos, settle } from "../kit";

export const F0 = 475;
const MONO = "'DejaVu Sans Mono', ui-monospace, Menlo, monospace";
const PITCH = 64.4, TOP0 = 140, ROWH = 57.5;
/** top edge of the lit row, reference units, per reference frame (measured) */
const LIT: [number, number][] = [[528, 655], [529, 654], [530, 653], [531, 649], [532, 645], [533, 638], [534, 631], [535, 621], [536, 609], [537, 596], [538, 580], [539, 562], [540, 543], [541, 521], [542, 498], [543, 472], [544, 446], [545, 419], [546, 392], [547, 365], [548, 338], [549, 313], [550, 289], [551, 267], [552, 247], [553, 228], [554, 211], [555, 197], [556, 184], [557, 173]];
const litTop = (n: number) => kf(n, LIT);
/** the frame at which the lit row's top edge is `d` units below the top of slot j (1-based) */
const trigOf = (j: number) => { const y = TOP0 + PITCH * (j - 1) + 18; for (let n = 528; n < 557; n += 0.01) if (litTop(n) <= y) return n; return 557; };
export const PASSED = [8, 7, 6, 5, 4, 3, 2];
export const TRIG = PASSED.map(trigOf);

type Row = { name: string; score: string; ch: string; av: number };
const ROWS: Row[] = [
  { name: "Harbour Kitchen", score: "4820", ch: "*", av: 0 },
  { name: "Olive & Oak", score: "4640", ch: "u3", av: 1 },
  { name: "Mesa Verde", score: "4390", ch: "d1", av: 2 },
  { name: "The Corner Table", score: "4250", ch: "u3", av: 3 },
  { name: "Bistro Lune", score: "4130", ch: "u2", av: 4 },
  { name: "Saffron House", score: "4090", ch: "u2", av: 5 },
  { name: "Canal Street Grill", score: "3980", ch: "d1", av: 6 },
  { name: "Noord Eten", score: "3860", ch: "u3", av: 7 },
];
const LITSCORE = [3710, 3900, 4000, 4110, 4150, 4270, 4400, 4690];

/** nine small abstract avatars in K.B's colours */
const Avatar: React.FC<{ k: number }> = ({ k }) => {
  const p = [C.cyan, C.mint, C.violet, C.amber, C.coral, "#F27AC8", C.indigo, "#1E2631"];
  const g = (el: React.ReactNode, bg = "#D9DEE6") => <svg width={30} height={30} viewBox="0 0 30 30" style={{ display: "block", borderRadius: 5, background: bg }}>{el}</svg>;
  switch (k) {
    case 0: return g(<>{[0, 1, 2, 3].map((i) => <rect key={i} x={i * 7.5} y={0} width={7.5} height={30} fill={[p[4], p[3], p[1], p[5]][i]} />)}</>);
    case 1: return g(<><rect width="30" height="30" fill={p[1]} /><circle cx="15" cy="15" r="9" fill="#10202A" /><circle cx="15" cy="15" r="4" fill={p[0]} /></>);
    case 2: return g(<><rect width="15" height="30" fill={p[5]} /><path d="M15 3L28 15L15 27z" fill={p[6]} /></>, "#E8DCC8");
    case 3: return g(<><rect width="10" height="30" fill="#222" /><rect x="10" width="10" height="30" fill={p[1]} /><rect x="20" width="10" height="30" fill={p[3]} /></>);
    case 4: return g(<><rect width="30" height="30" fill={p[3]} /><path d="M0 0L30 30M30 0L0 30" stroke={p[4]} strokeWidth="9" /></>);
    case 5: return g(<><circle cx="15" cy="15" r="14" fill="#E8DCC8" /><circle cx="15" cy="15" r="10" fill={p[1]} /><circle cx="15" cy="15" r="6" fill="#E8DCC8" /><circle cx="15" cy="15" r="3" fill={p[6]} /></>, "#E8DCC8");
    case 6: return g(<>{[0, 1, 2, 3].map((r) => [0, 1, 2, 3].map((c) => (r + c) % 2 === 0 ? <rect key={r * 4 + c} x={c * 7.5} y={r * 7.5} width={7.5} height={7.5} fill="#111" /> : <rect key={r * 4 + c} x={c * 7.5} y={r * 7.5} width={7.5} height={7.5} fill="#C9C0F5" />))}</>);
    default: return g(<>{[[8, 8], [22, 8], [8, 22], [22, 22]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="3.3" fill="#DDEBFF" />)}</>, p[6]);
  }
};
const Chg: React.FC<{ v: string }> = ({ v }) => {
  if (v === "*") return <svg width={15} height={15} viewBox="0 0 24 24"><path d="M12 2l3 7 7 .6-5.3 4.7 1.6 7.2L12 17.7 5.7 21.5l1.6-7.2L2 9.6 9 9z" fill="#FFC83D" /></svg>;
  const up = v[0] === "u";
  return <span style={{ fontFamily: MONO, fontSize: 14, fontWeight: 700, color: up ? "#2FD38C" : "#FF6B57", whiteSpace: "nowrap" }}>{up ? "↑" : "↓"} {v.slice(1)}</span>;
};
const RowBox: React.FC<{ y: number; rank: number; r: Row; z?: number }> = ({ y, rank, r, z = 1 }) => (
  <div style={{ position: "absolute", left: 669, top: 0, width: 571, height: ROWH, borderRadius: 8, background: "#1D2430", transform: `translate3d(0, ${y.toFixed(2)}px, 0)`, willChange: "transform", zIndex: z, fontFamily: MONO }}>
    <div style={{ position: "absolute", left: 0, width: 91, top: 0, height: ROWH, textAlign: "center", lineHeight: `${ROWH}px`, fontSize: 28, fontWeight: 400, color: "#fff" }}>{rank}</div>
    <div style={{ position: "absolute", left: 92, top: 14 }}><Avatar k={r.av} /></div>
    <div style={{ position: "absolute", left: 137, top: 0, height: ROWH, lineHeight: `${ROWH}px`, fontSize: 16, color: "#fff", whiteSpace: "nowrap" }}>{r.name}</div>
    <div style={{ position: "absolute", left: 393, top: 0, height: ROWH, lineHeight: `${ROWH}px`, fontSize: 16, color: "#fff" }}>{r.score}</div>
    <div style={{ position: "absolute", right: 14, top: 0, height: ROWH, display: "flex", alignItems: "center" }}><Chg v={r.ch} /></div>
  </div>
);

export const ShotS: React.FC<{ t: number; n: number; t0: number }> = ({ t, n, t0 }) => {
  const tw = onTwos("S", t - t0, 0.45), zoom = 1.5 * settle(tw.sj, 0.03);
  // the reference's left picture runs down the frame (tracked: 0 -> 844 px); ours tilts the same way, at half the travel, so the clip keeps its subject
  const pan = 0.45 * kf(528 + tw.sj * 24, [[528, 0], [530, 21], [533, 85], [536, 166], [540, 289], [545, 455], [550, 630], [556, 844]]);
  const ly = litTop(n);
  const taken = TRIG.filter((tg) => n >= tg + 0.8).length;
  const rank = 9 - taken;
  const lscore = LITSCORE[taken];
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, background: "#0E131B", fontFamily: F, overflow: "hidden" }}>
      {/* the filmed half */}
      <div style={{ position: "absolute", left: 37, top: 37, width: 908, height: 1003, borderRadius: 18, overflow: "hidden", background: "#000" }}>
        <div style={{ position: "absolute", left: 454 - 960 - 40 * zoom, top: -150 + pan, width: 1920, height: 1080 }}>
          <Footage name="S" at={tw.at} scale={zoom} style={{ overflow: "visible" }} />
        </div>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(14,19,27,.9) 0, rgba(14,19,27,.85) 7%, rgba(14,19,27,0) 17%, rgba(14,19,27,0) 76%, rgba(14,19,27,.75) 100%)" }} />
      </div>
      {/* the ranking panel */}
      <div style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 720, transformOrigin: "0 0", transform: "scale(1.5)" }}>
        <div style={{ position: "absolute", left: 651, top: 25, width: 609, height: 668, borderRadius: 14, background: "linear-gradient(#0B0F15,#10151D 30%,#10151D)", overflow: "hidden" }}>
          <div style={{ position: "absolute", left: -651, top: -25, width: 1280, height: 720 }}>
            <div style={{ position: "absolute", left: 669, top: 47, width: 30, height: 30, borderRadius: 15, background: "#1D2430" }} />
            <svg style={{ position: "absolute", left: 677, top: 55 }} width={14} height={14} viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" /></svg>
            <div style={{ position: "absolute", left: 719, top: 38, fontSize: 64, fontWeight: 600, letterSpacing: "0.04em", lineHeight: "64px", color: "transparent", backgroundImage: "radial-gradient(circle at 2px 2px, #FFFFFF 1.5px, transparent 1.9px)", backgroundSize: "4px 4px", WebkitBackgroundClip: "text", backgroundClip: "text", whiteSpace: "nowrap" }}>RANKING</div>
            <svg style={{ position: "absolute", left: 1143, top: 45, opacity: 0.9 }} width={15} height={15} viewBox="0 0 24 24"><circle cx="9" cy="8" r="3.6" fill="none" stroke="#fff" strokeWidth="2" /><path d="M2.5 20c0-4 3-6 6.5-6s6.5 2 6.5 6M16 5a3.4 3.4 0 010 6.5M18 14c2.6.6 3.8 2.6 3.8 5" fill="none" stroke="#fff" strokeWidth="2" /></svg>
            <div style={{ position: "absolute", left: 1164, top: 43, fontFamily: MONO, fontSize: 14, color: "#fff", lineHeight: "18px" }}>248 bookings</div>
            <div style={{ position: "absolute", left: 669, top: 114, fontFamily: MONO, fontSize: 11, fontWeight: 700, color: "#fff", lineHeight: "16px" }}>Weekly top 9</div>
            <div style={{ position: "absolute", left: 1062, top: 114, fontFamily: MONO, fontSize: 11, fontWeight: 700, color: "#fff", lineHeight: "16px" }}>Score</div>
            {/* rows: orig slot j = i + 1 (i = 0..7); passed rows slide down one place */}
            {ROWS.map((r, i) => {
              const j = i + 1, k = PASSED.indexOf(j);
              const d = k < 0 ? 0 : PITCH * ease.out(clamp((n - TRIG[k]) / 1.8));
              const moved = k >= 0 && n >= TRIG[k] + 0.8;
              return <RowBox key={r.name} y={TOP0 + PITCH * i + d} rank={j + (moved ? 1 : 0)} r={r} />;
            })}
            {/* the lit row */}
            <div style={{ position: "absolute", left: 669, top: 0, width: 571, height: ROWH, borderRadius: 8, background: "#E6EBEF", transform: `translate3d(0, ${ly.toFixed(2)}px, 0)`, willChange: "transform", zIndex: 5, fontFamily: MONO, boxShadow: "0 6px 22px rgba(0,0,0,.35)" }}>
              <div style={{ position: "absolute", left: 0, width: 91, top: 0, height: ROWH, textAlign: "center", lineHeight: `${ROWH}px`, fontSize: 28, color: "#16202E" }}>{rank}</div>
              <div style={{ position: "absolute", left: 92, top: 14, width: 30, height: 30, borderRadius: 5, background: C.cyan }}><div style={{ position: "absolute", left: 8, top: 8, width: 14, height: 14, borderRadius: 3, background: "#fff" }} /></div>
              <div style={{ position: "absolute", left: 137, top: 0, height: ROWH, display: "flex", alignItems: "center", gap: 8, fontSize: 16, fontWeight: 700, color: "#16202E", whiteSpace: "nowrap" }}>Your business<span style={{ height: 17, padding: "0 5px", borderRadius: 3, background: "#16202E", color: "#fff", fontSize: 9, lineHeight: "17px", fontWeight: 700 }}>You</span></div>
              <div style={{ position: "absolute", left: 393, top: 0, height: ROWH, lineHeight: `${ROWH}px`, fontSize: 16, color: "#16202E" }}>{lscore}</div>
              <div style={{ position: "absolute", right: 14, top: 0, height: ROWH, display: "flex", alignItems: "center" }}><Chg v="u7" /></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
