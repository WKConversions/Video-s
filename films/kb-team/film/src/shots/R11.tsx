// Package R11 (reference f962-f1079; cuts f1007, f1050) rebuilt on the reference's own measured frames (v2).
//   AK f962-f1006   full-frame chat screen: the report scrolls up in five pushes, three check rows arrive, "Involved." is typed
//   AL f1007-f1049  macro: two lines of 144 px ink height running off the frame, settle f1007-f1010, slow drift, footer row f1023, arrow from the lower right f1040
//   AM f1050-f1079  the corner of the window: the CTA button, the pointer lands under its label and presses at f1075
import React from "react";
import type { Pkg, Sfx } from "../types";
import { Caret, Check, E, Hand, S, abs, clamp, ease, kf, mix, refN, rs, typed, useFonts } from "../kit";

const F0 = 962;
const at = (n: number) => rs(n - F0);
const say = (filmSeconds: number) => filmSeconds - rs(F0);
const INK = "#16202E";

const Cur: React.FC<{ t: number; h: number; w: number; up: number; gap: number; c?: string }> = ({ t, h, w, up, gap, c }) => (
  <span style={{ display: "inline-block", position: "relative", width: 0, height: 0 }}>
    <Caret t={t} h={h} w={w} c={c} typing style={{ position: "absolute", left: gap, top: -up, marginLeft: 0 }} />
  </span>
);

// ---------------------------------------------------------------- AK: the chat screen
const PUSH: [number, number][] = [[962, 52], [966, 86], [971, 86], [986, 138], [1004, 72]];   // [starts on frame, px up]
const ROW_AT = [963, 967, 972];
const YG: [string, number][] = [["Your", 987], [" growth", 988], [" has", 989], [" a", 990], [" partner.", 991]];
const TXT: React.CSSProperties = { position: "absolute", fontSize: 34, fontWeight: 500, lineHeight: "49px", color: "#1E232B", letterSpacing: "-0.01em", whiteSpace: "nowrap" };
const Line: React.FC<{ y: number; x?: number; c?: string; style?: React.CSSProperties; children: React.ReactNode }> = ({ y, x = 165, c, style, children }) => (
  <div style={{ ...TXT, left: x, top: y - 24.5, color: c ?? TXT.color, ...style }}>{children}</div>
);
const Warn: React.FC<{ y: number }> = ({ y }) => (
  <svg style={{ position: "absolute", left: 100, top: y - 17 }} width={38} height={34} viewBox="0 0 38 34"><path d="M19 3 L36 31 H2 Z" fill="#F2B21B" stroke="#F2B21B" strokeWidth="4" strokeLinejoin="round" /><path d="M19 13v9" stroke="#fff" strokeWidth="3.4" strokeLinecap="round" /><circle cx="19" cy="26.5" r="1.9" fill="#fff" /></svg>
);
const PanelIcon: React.FC<{ y: number; k: number }> = ({ y, k }) => (
  <div style={abs(1332, y, 120, 120, { borderRadius: 24, background: "#252A36", border: "2px solid #2E3442", display: "flex", alignItems: "center", justifyContent: "center" })}>
    <svg width={66} height={66} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      {k === 0 && <><path d="M3 17l6-6 4 4 7-8" /><path d="M3 21h18" /></>}
      {k === 1 && <><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" /></>}
      {k === 2 && <><circle cx="12" cy="12" r="9.5" /><path d="M9.2 9.3c.3-1.7 1.5-2.6 2.9-2.6 1.6 0 2.8 1 2.8 2.5 0 2-2.9 2.3-2.9 4.3M12 17.3v.2" /></>}
    </svg>
  </div>
);
const ROWS: [string, number][] = [["Built alongside your team from day one", 520], ["We stay on to run and improve it", 590], ["Part of your team", 660]];
const AK: React.FC<{ t: number }> = ({ t }) => {
  const P = PUSH.map(([f]) => E(t, at(f), 0.3, ease.out));
  const s = 52 * (1 - P[0]) + 86 * (1 - P[1]) + 86 * (1 - P[2]) - 138 * P[3] - 72 * P[4];
  const cardBottom = 740 - 138 * P[3] - 72 * P[4];
  const next = t >= at(1004) + 0.04;
  const cur = t >= at(987) ? <Cur t={t} h={44} w={4} up={36} gap={6} c="#1B1B1B" /> : null;
  return (
    <div style={{ position: "absolute", inset: 0, background: "radial-gradient(70% 75% at 40% 50%, #F8F8F7 0%, #EFEEEC 70%, #E6E5E2 100%)", fontFamily: "Montserrat, sans-serif", overflow: "hidden" }}>
      {/* the card of the report: its bottom edge rides up with the pushes */}
      <div style={abs(48, -300, 1194, cardBottom + 300, { background: "#FDFDFC", borderRadius: 36, border: "2px solid #E8E7E4", boxSizing: "border-box", boxShadow: "0 8px 30px rgba(30,30,30,.05)" })} />
      <div style={{ position: "absolute", left: 0, top: 0, width: 1297, height: 1080, transform: `translate3d(0, ${s.toFixed(2)}px, 0)`, willChange: "transform" }}>
        <Line y={-194} x={100} c="#A0A3A8">The update is complete.</Line>
        <Line y={40} x={92} c="#5C6168" style={{ fontSize: 31, fontWeight: 600, letterSpacing: "0.01em" }}>WHY IT MATTERED</Line>
        <Warn y={90} /><Line y={90}>Follow-ups were slipping through the cracks</Line><Line y={139}>after the first call, with nobody owning them.</Line>
        <Warn y={228} /><Line y={228}>Leads waited days for a reply, so the team lost</Line><Line y={277}>track of who was hot and who was cold.</Line>
        <Line y={411} x={92} c="#5C6168" style={{ fontSize: 31, fontWeight: 600, letterSpacing: "0.01em" }}>WHAT WE DID</Line>
        {ROWS.map(([txt, y], i) => {
          const r = at(ROW_AT[i]), ring = clamp((t - r - 0.05) / 0.55);
          return (
            <div key={txt} style={{ opacity: E(t, r, 0.08, ease.out), transform: `translate3d(0, ${(14 * (1 - E(t, r, 0.3, ease.out))).toFixed(2)}px, 0)` }}>
              <div style={abs(100, y - 18, 36, 36)}>
                <div style={abs(0, 0, 36, 36, { borderRadius: 18, border: "3px solid #1F9D5A", boxSizing: "border-box", opacity: 0.5 * (1 - ring), transform: `scale(${(1 + 0.85 * ease.out(ring)).toFixed(4)})` })} />
                <div style={abs(0, 0, 36, 36, { transform: `scale(${mix(0.45, 1, S(t, r, { damping: 11, stiffness: 240 })).toFixed(4)})` })}><Check s={36} /></div>
              </div>
              <Line y={y}>{txt}</Line>
            </div>
          );
        })}
        <Line y={825} x={100} style={{ fontSize: 36, color: "#17191D" }}>{YG.map(([w, f]) => (refN(t, F0) >= f ? w : "")).join("")}{typed(" Involved.", t, at(993), 22)}{!next && cur}</Line>
        {next && <Line y={880} x={100} style={{ fontSize: 36 }}>{cur}</Line>}
      </div>
      {/* fixed: suggestions and the prompt box */}
      <svg style={{ position: "absolute", left: 62, top: 780 }} width={40} height={54} viewBox="0 0 24 32" fill="none" stroke="#1B1B1B" strokeWidth="1.6" strokeLinecap="round"><path d="M12 3a7.5 7.5 0 0 0-4 13.8V21h8v-4.2A7.5 7.5 0 0 0 12 3z" /><path d="M9 25h6" /></svg>
      <div style={{ position: "absolute", left: 116, top: 777, fontSize: 38, fontWeight: 500, color: "#1B1B1B", lineHeight: "48px" }}>Suggestions</div>
      <div style={abs(45, 870, 600, 84, { borderRadius: 42, background: "#E8E6E2", fontSize: 36, fontWeight: 500, color: "#1B1B1B", display: "flex", alignItems: "center", paddingLeft: 36, whiteSpace: "nowrap" })}>Plan the next release</div>
      <div style={abs(660, 870, 500, 84, { borderRadius: 42, background: "#F1F0EE", fontSize: 36, fontWeight: 500, color: "#1B1B1B", display: "flex", alignItems: "center", paddingLeft: 24, gap: 18, whiteSpace: "nowrap", WebkitMaskImage: "linear-gradient(90deg,#000 62%,transparent 94%)" })}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: C_CYAN, flex: "none" }} />Review the numbers
      </div>
      <svg style={{ position: "absolute", left: 1162, top: 888, }} width={36} height={44} viewBox="0 0 24 30" fill="none" stroke="#1B1B1B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 5l10 10L8 25" /></svg>
      <div style={abs(48, 1005, 1180, 140, { borderRadius: 42, background: "#FFFFFF", border: "2px solid #E6E5E2", boxSizing: "border-box", boxShadow: "0 6px 24px rgba(30,30,30,.05)" })}>
        <div style={{ position: "absolute", left: 28, top: 38, fontSize: 38, fontWeight: 500, color: "#B3B6BB" }}>Ask the K.B team to change anything</div>
      </div>
      {/* the dark side panel */}
      <div style={abs(1297, 0, 623, 1080, { background: "linear-gradient(180deg,#1B202B,#171B25)" })} />
      <div style={abs(1522, 50, 420, 1100, { background: "#2A2E39", borderRadius: 30 })} />
      <PanelIcon y={-23} k={0} /><PanelIcon y={157} k={1} /><PanelIcon y={335} k={2} />
    </div>
  );
};
const C_CYAN = "#38C8FF";

// ---------------------------------------------------------------- AL: the macro lines
const CPS = 40;
const SAID: [string, number][] = [["From day", say(42.3) - 0.02 - 1 / CPS], [" one", say(42.64) - 0.045 - 1 / CPS], [" onwards.", say(42.98) - 0.045 - 1 / CPS]];
// top of line 1's ink (measured): settles 309 -> 246 in f1007-f1010, then drifts to 213 at f1049
const L1: [number, number][] = [[1006, 309], [1007, 309], [1008, 270], [1009, 252], [1010, 246], [1012, 244], [1049, 207]];
const ASC = 15;      // box top to ink top of the tall letters, at 150 px Montserrat (calibrated)
// the arrow's tip (measured), entering from the lower right
const ARR_X: [number, number][] = [[1039, 1281], [1040, 1281], [1041, 1293], [1042, 1305], [1043, 1320], [1044, 1336], [1045, 1356], [1046, 1378], [1047, 1404], [1048, 1434], [1049, 1470]];
const ARR_Y: [number, number][] = [[1039, 1062], [1040, 1062], [1041, 1038], [1042, 1011], [1043, 980], [1044, 945], [1045, 904], [1046, 858], [1047, 807], [1048, 744], [1049, 669]];
const AL: React.FC<{ t: number }> = ({ t }) => {
  const n = refN(t, F0);
  const y1 = kf(n, L1) - ASC;
  const big: React.CSSProperties = { position: "absolute", left: 0, fontSize: 150, fontWeight: 560, color: INK, letterSpacing: "-0.03em", lineHeight: "150px", whiteSpace: "nowrap" };
  const fo = E(t, at(1022), 0.09, ease.out), fy = 28 * (1 - E(t, at(1022), 0.25, ease.out));
  return (
    <div style={{ position: "absolute", inset: 0, background: "radial-gradient(80% 96% at 50% 52%, #FFFFFF 0%, #FBFBFB 38%, #DADADB 53%, #DADADB 100%)", fontFamily: "Montserrat, sans-serif", overflow: "hidden" }}>
      <div style={abs(0, 0, 1920, 84, { background: "linear-gradient(180deg,#F6F6F6,#EDEDED)", borderBottom: "2px solid #DADADA" })} />
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, transform: `translate3d(0, ${y1.toFixed(2)}px, 0)`, willChange: "transform" }}>
        <div style={{ ...big, left: "auto", right: 90, top: 0 }}>Your growth has a partner. Involved.</div>
        <div style={{ ...big, top: 232 }}>{SAID.map(([w, s]) => typed(w, t, s, CPS)).join("")}<Cur t={t} h={140} w={8} up={118} gap={10} c={INK} /></div>
        <div style={{ position: "absolute", left: 0, top: 0, opacity: fo, transform: `translate3d(0, ${fy.toFixed(2)}px, 0)` }}>
          <div style={{ position: "absolute", left: -30, top: 553, fontSize: 128, fontWeight: 500, color: "#7B7D80", letterSpacing: "-0.03em", lineHeight: "150px", whiteSpace: "nowrap" }}>Just Now</div>
          <svg style={{ position: "absolute", left: 660, top: 572 }} width={118} height={118} viewBox="0 0 24 24" fill="none" stroke="#14181F" strokeWidth="1.7" strokeLinejoin="round"><rect x="8.5" y="8.5" width="12" height="12" rx="3" /><path d="M15.5 5.5V5.8a2.7 2.7 0 0 0-2.7-2.7H6a2.7 2.7 0 0 0-2.7 2.7v6.8a2.7 2.7 0 0 0 2.7 2.7h.5" /></svg>
          <div style={{ position: "absolute", left: 958, top: 624 }}>{[0, 1, 2].map((i) => <div key={i} style={abs(i * 28, 0, 14, 14, { borderRadius: 7, background: "#14181F" })} />)}</div>
        </div>
      </div>
      <Hand x={kf(n, ARR_X)} y={kf(n, ARR_Y)} size={400} opacity={n < 1039.5 ? 0 : 1} />
    </div>
  );
};

// ---------------------------------------------------------------- AM: the corner of the window
const PT_X: [number, number][] = [[1049, 942], [1050, 942], [1051, 981], [1052, 1008], [1053, 1030], [1054, 1047], [1056, 1074], [1059, 1100], [1063, 1130], [1066, 1148], [1070, 1150], [1079, 1150]];
const PT_Y: [number, number][] = [[1049, 856], [1050, 856], [1051, 798], [1052, 756], [1053, 723], [1054, 696], [1056, 660], [1059, 622], [1063, 592], [1066, 580], [1070, 579], [1079, 579]];
const AM: React.FC<{ t: number }> = ({ t }) => {
  const n = refN(t, F0);
  const press = kf(n, [[1073, 0], [1075, 1], [1077, 0.35], [1079, 0]]);
  const dim = kf(n, [[1073, 0], [1075, 1], [1078, 0.2], [1079, 0]]);
  return (
    <div style={{ position: "absolute", inset: 0, background: "#EDEDEE", fontFamily: "Montserrat, sans-serif", overflow: "hidden" }}>
      {/* faint blurred lines of what stands behind the window, and the amber dot */}
      <div style={{ position: "absolute", left: 1420, top: 20, filter: "blur(3px)", opacity: 0.5 }}>
        {[0, 1, 2, 3].map((i) => <div key={i} style={abs(0, i * 22, 230 - i * 40, 10, { background: "#C9CACE", borderRadius: 5 })} />)}
      </div>
      <div style={abs(1312, 108, 24, 24, { background: "#F0A830", borderRadius: 3 })} />
      {/* window: tab bar, toolbar, dark app */}
      <div style={abs(-60, 135, 1372, 1100, { background: "#1A1E2A", borderRadius: "36px 36px 0 0", overflow: "hidden" })}>
        <div style={abs(0, 0, 1372, 265, { background: "#D9DAE5" })} />
        <div style={abs(0, 48, 485, 220, { background: "#FFFFFF", borderRadius: "0 0 36px 0" })} />
        <div style={abs(0, 265, 1372, 272, { background: "#EFEDEA" })} />
        <div style={abs(0, 535, 1372, 3, { background: "#D8D6D2" })} />
        <svg style={{ position: "absolute", left: 335, top: 130 }} width={50} height={50} viewBox="0 0 24 24" stroke="#2A2D33" strokeWidth="1.8" strokeLinecap="round"><path d="M5 5l14 14M19 5L5 19" /></svg>
        <svg style={{ position: "absolute", left: 547, top: 130 }} width={50} height={50} viewBox="0 0 24 24" stroke="#A7A9AF" strokeWidth="1.8" strokeLinecap="round"><path d="M12 4v16M4 12h16" /></svg>
        <div style={abs(498, 322, 120, 120, { borderRadius: 60, background: "#E8DFD8", border: "2px solid #DAD2CB", boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 38, fontWeight: 500, color: "#2A2D33" })}>YB</div>
        <div style={abs(585, 322, 120, 120, { borderRadius: 60, background: "#F5F3F0", border: "2px solid #DAD2CB", boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 70, fontWeight: 300, color: "#14181F" })}>+</div>
        <div style={abs(776, 380, 100, 20, { display: "flex", gap: 14, justifyContent: "center" })}>{[0, 1, 2].map((i) => <div key={i} style={{ width: 9, height: 9, borderRadius: 5, background: "#14181F", marginTop: 8 }} />)}</div>
        <div style={abs(160 + 60, 0, 0, 0)} />
        {/* the dark app below: an outlined box, cut by the frame */}
        <div style={abs(96, 825, 1131, 300, { border: "3px solid #3A4050", borderRadius: 36, boxSizing: "border-box" })}>
          <div style={{ position: "absolute", left: 54, top: 100, fontSize: 40, fontWeight: 500, color: "#9AA0AD" }}>248 bookings this week</div>
        </div>
      </div>
      {/* the button */}
      <div style={abs(867, 457, 381, 158, { borderRadius: 38, background: "#0A0A0C", color: "#fff", fontSize: 56, fontWeight: 600, letterSpacing: "-0.01em", display: "flex", alignItems: "center", justifyContent: "center", whiteSpace: "nowrap", transform: `scale(${(1 - 0.025 * dim).toFixed(4)})`, willChange: "transform" })}>Go live</div>
      <Hand x={kf(n, PT_X)} y={kf(n, PT_Y)} size={150} press={press} tiltX={-30 * press} />
    </div>
  );
};

const Comp: React.FC<{ t: number }> = ({ t }) => {
  const ok = useFonts();
  if (!ok) return <div style={{ position: "absolute", inset: 0, background: "#EFEEEC" }} />;
  return t >= at(1050) ? <AM t={t} /> : t >= at(1007) ? <AL t={t} /> : <AK t={t} />;
};
const sfx: Sfx[] = [
  { t: at(964), kind: "pop", note: "check row 1 lands", ref: 964, db: -8 },
  { t: at(968), kind: "pop", note: "check row 2 lands", ref: 968, db: -8 },
  { t: at(973), kind: "pop", note: "check row 3 lands", ref: 973, db: -8 },
  { t: at(987), kind: "type", note: "0.25 Your growth has a partner.", ref: 987 },
  { t: at(993), kind: "type", note: "0.45", ref: 988 },
  { t: say(42.3) - 0.02, kind: "type", note: "0.2", ref: 1009 },
  { t: say(42.64) - 0.02, kind: "type", note: "0.08", ref: 1013 },
  { t: say(42.98) - 0.02, kind: "type", note: "0.2", ref: 1017 },
  { t: at(1075), kind: "click", note: "the pointer presses the button", ref: 1075 },
];
export const PKG: Pkg = { id: "R11", Comp, sfx };
