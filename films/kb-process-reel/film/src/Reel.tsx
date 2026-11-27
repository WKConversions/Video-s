// K.B process reel (1080x1920, 60 fps, 23 s), on Karl's script and VO: contract signed -> scope becomes tasks in the
// project tools -> AI agents carry them out and validate -> we update the documentation and improve the process (and
// double-check) -> "Do you work differently? Message us". New K.B brand: navy page, light blue, Manrope, KB monogram.
// Motion: the work itself travels (task cards stream through the board, sparks, an orbiting loop) over a constant
// horizontal camera sway, so the 4% norm is met by useful motion.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, F, FPS, OUT, INOUT, IN, k, mix, c01, enter, Title, Check, Ring, Avatar, Cursor, cursorAt, floatStyle, LogoLayer, LogoKey, Page, useFont, Layer } from "./kit";
import { w } from "./timing";

const W_ = 1080;
const Bar: React.FC<{ w: number; h?: number; c?: string; style?: React.CSSProperties }> = ({ w: ww, h = 16, c = "#E4E8EE", style }) =>
  <div style={{ width: ww, height: h, borderRadius: h / 2, background: c, ...style }} />;
const card = (s: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", background: C.white, borderRadius: 28, boxShadow: "0 30px 70px -24px rgba(0,0,0,0.45)", fontFamily: F, color: C.navy, overflow: "hidden", ...s });

// ------------------------------------------------------------------ icons
const Spark: React.FC<{ s: number; c?: string; r?: number }> = ({ s, c = C.blue, r = 0 }) => (
  <svg width={s} height={s} viewBox="0 0 40 40" style={{ display: "block", transform: `rotate(${r}deg)` }}>
    <path d="M20 2 C21.5 13 27 18.5 38 20 C27 21.5 21.5 27 20 38 C18.5 27 13 21.5 2 20 C13 18.5 18.5 13 20 2 Z" fill={c} />
  </svg>
);
const DocIcon: React.FC<{ s: number }> = ({ s }) => (
  <svg width={s} height={s} viewBox="0 0 40 40"><rect x={8} y={4} width={24} height={32} rx={4} fill={C.ice} stroke={C.navy} strokeWidth={3} /><rect x={13} y={12} width={14} height={3} rx={1.5} fill={C.navy} /><rect x={13} y={19} width={14} height={3} rx={1.5} fill={C.blueS} /><path d="M13 29 C16 25 18 31 21 27 S 25 28 27 27" fill="none" stroke={C.navy} strokeWidth={2} strokeLinecap="round" /></svg>
);
const BoardIcon: React.FC<{ s: number }> = ({ s }) => (
  <svg width={s} height={s} viewBox="0 0 40 40"><rect x={4} y={6} width={32} height={28} rx={5} fill={C.ice} stroke={C.navy} strokeWidth={3} /><rect x={9} y={12} width={6} height={16} rx={2} fill={C.blueS} /><rect x={17} y={12} width={6} height={10} rx={2} fill={C.navy} /><rect x={25} y={12} width={6} height={13} rx={2} fill={C.blue} /></svg>
);
const BookIcon: React.FC<{ s: number }> = ({ s }) => (
  <svg width={s} height={s} viewBox="0 0 40 40"><path d="M6 8 C12 6 17 7 20 10 C23 7 28 6 34 8 V32 C28 30 23 31 20 34 C17 31 12 30 6 32 Z" fill={C.ice} stroke={C.navy} strokeWidth={3} strokeLinejoin="round" /><line x1={20} y1={10} x2={20} y2={34} stroke={C.navy} strokeWidth={3} /></svg>
);
const Pen: React.FC<{ s: number }> = ({ s }) => (
  <svg width={s} height={s} viewBox="0 0 60 60" style={{ display: "block", overflow: "visible" }}><path d="M6 54 L10 40 L44 6 L54 16 L20 50 Z" fill={C.navy} stroke={C.white} strokeWidth={3} strokeLinejoin="round" /><path d="M6 54 L10 40 L20 50 Z" fill={C.blue} /></svg>
);
const Glass: React.FC<{ s: number }> = ({ s }) => (
  <svg width={s} height={s} viewBox="0 0 60 60" style={{ display: "block", overflow: "visible" }}><circle cx={24} cy={24} r={17} fill="rgba(153,205,252,0.25)" stroke={C.white} strokeWidth={6} /><line x1={37} y1={37} x2={54} y2={54} stroke={C.white} strokeWidth={8} strokeLinecap="round" /></svg>
);

// ------------------------------------------------------------------ the headline at the top, one per beat
const HEADS: [number, string][] = [[w("signed"), "Signed contract"], [w("clear"), "Clear tasks"], [w("agents") - 0.1, "AI agents"], [w("validate"), "Validated"],
  [w("update"), "Update documentation"], [w("improve"), "Improve the process"], [w("do") - 0.2, ""]];
const Heads: React.FC<{ t: number }> = ({ t }) => (
  <>{HEADS.map(([t0, txt], i) => {
    if (!txt) return null;
    const t1 = HEADS[i + 1][0];
    const a = k(t, t0 - 0.05, 0.55), b = k(t, t1 - 0.1, 0.4, IN);
    if (a <= 0 || b >= 1) return null;
    return <div key={i} style={{ position: "absolute", left: 0, right: 0, top: 290, display: "flex", justifyContent: "center", opacity: a * (1 - b), transform: `translateY(${((1 - a) * 60 - b * 60).toFixed(1)}px)` }}>
      <Title size={84}>{txt}</Title>
    </div>;
  })}</>
);

// ------------------------------------------------------------------ the board geometry (absolute frame px)
const BX = 60, BY = 640, BW = 960, BH = 1040;
const COLX = (c: number) => BX + 24 + c * 312;          // column left
const SLOT = (j: number) => BY + 200 + j * 150;          // task card top in a column
const NT = 5;
const T_FLY = (i: number) => w("into") + 0.15 + i * 0.13;
const T_DOING = (i: number) => w("carry") + i * 0.22;
const T_DONE = (i: number) => w("those") + 0.25 + i * 0.2;
const T_CHECK = (i: number) => w("validate") + 0.05 + i * 0.12;

const Task: React.FC<{ t: number; i: number; prog: number; checked: number }> = ({ t, i, prog, checked }) => (
  <div style={card({ width: 288, height: 128, borderRadius: 18, padding: "20px 20px 0 30px", boxSizing: "border-box" })}>
    <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 10, background: checked > 0.5 ? C.green : [C.blueS, C.navy, C.blue, C.blueS, C.navy][i] }} />
    <Bar w={[190, 160, 210, 170, 150][i]} h={18} c={C.navy} style={{ opacity: 0.85 }} />
    <Bar w={[130, 180, 110, 150, 170][i]} h={14} style={{ marginTop: 14 }} />
    <div style={{ position: "absolute", left: 30, right: 20, bottom: 16, height: 8, borderRadius: 4, background: "#EEF2F7", overflow: "hidden" }}>
      <div style={{ width: `${(prog * 100).toFixed(1)}%`, height: "100%", background: checked > 0.5 ? C.green : C.blueS }} />
    </div>
    <div style={{ position: "absolute", right: 14, top: 14, opacity: checked, transform: `scale(${mix(0.4, 1, OUT(checked))})` }}><Check size={44} p={checked} color={C.greenInk} /></div>
    {prog > 0 && prog < 1 && <div style={{ position: "absolute", right: 16, top: 16, width: 38, height: 38, borderRadius: "50%", border: `5px solid ${C.ice2}`, borderTopColor: C.blueS, transform: `rotate(${(t * 540) % 360}deg)`, boxSizing: "border-box" }} />}
  </div>
);

// ------------------------------------------------------------------ the logo track (its own layer)
const LOGO: LogoKey[] = [
  { t: 0, x: 540, y: 820, size: 240, o: 0 }, { t: 0.25, x: 540, y: 820, size: 240, o: 0 }, { t: 0.85, x: 540, y: 800, size: 320, o: 1 },
  { t: 1.2, x: 540, y: 800, size: 320, o: 1 }, { t: 1.9, x: 540, y: 150, size: 150, o: 1 }, { t: 20.9, x: 540, y: 150, size: 150, o: 1 },
  { t: 21.6, x: 540, y: 760, size: 360, o: 1 }, { t: 22.3, x: 540, y: 748, size: 376, o: 1 }, { t: 23, x: 540, y: 756, size: 366, o: 1 },
];

export const Reel: React.FC<{ layer: Layer }> = ({ layer }) => {
  const ok = useFont();
  const t = useCurrentFrame() / FPS;
  if (!ok) return null;
  // camera: a constant horizontal sway (never resting) + breathing push
  const camX = 65 * Math.sin(t * 0.8) + 32 * Math.sin(t * 1.9 + 1.3), camY = 18 * Math.sin(t * 0.55), camS = 1.03 + 0.025 * Math.sin(t * 0.9 + 0.5), camR = 0.6 * Math.sin(t * 0.5);

  // ---- A: the contract
  const docIn = k(t, 1.1, 0.8);
  const docOut = k(t, w("into") - 0.1, 0.9, INOUT);
  const docX = mix(540, 250, docOut), docY = mix(1080, 620, docOut), docS = mix(1, 0.42, docOut), docO = docIn * (1 - k(t, w("tasks") + 0.6, 0.5, IN));
  const title = "Software development", typed = Math.round(title.length * c01((t - w("software")) / 0.75));
  const sig1 = k(t, w("signed") - 0.1, 0.5, INOUT), sig2 = k(t, w("contract") + 0.05, 0.45, INOUT), seal = k(t, w("contract") + 0.55, 0.5);
  const scopeGlow = k(t, w("scope") - 0.05, 0.4);
  const penP = t < w("contract") + 0.05 ? sig1 : sig2;
  const idle = 1 - k(t, w("signed") - 0.45, 0.35, INOUT);
  const penXs = t < w("contract") + 0.05 ? mix(90, 300, penP) : mix(450, 660, penP);
  const penYs = 870 - 18 * Math.sin(penP * Math.PI * 5);
  const penX = mix(penXs, 380 + 170 * Math.sin(t * 1.7), idle), penY = mix(penYs, 520 + 90 * Math.sin(t * 3.4), idle);
  const penO = k(t, 1.7, 0.4) * (1 - k(t, w("contract") + 0.5, 0.3, IN));

  // ---- B/C: the board
  const boardIn = k(t, w("into") - 0.05, 0.8);
  const boardOut = k(t, w("then") + 0.1, 0.9, INOUT);
  const agentsIn = (j: number) => k(t, w("agents") - 0.1 + j * 0.12, 0.6);
  const scan = c01((t - w("validate")) / 0.7);

  // ---- D: documentation, the loop, the double-check
  const docsIn = k(t, w("learn") - 0.1, 0.8);
  const docsOut = k(t, w("improve") - 0.2, 0.8, INOUT);
  const rew = k(t, w("update") - 0.05, 0.6, INOUT), rew2 = k(t, w("documentation") + 0.2, 0.6, INOUT);
  const loopIn = k(t, w("improve") - 0.1, 0.9);
  const loopOut = k(t, w("do") - 0.15, 0.8, IN);
  const check = k(t, w("process") - 0.15, 0.6);

  // ---- E: the call to action
  const ctaIn = k(t, w("message") - 0.45, 0.8);
  const press = t >= w("message") - 0.05 && t < w("message") + 0.4 ? (t - w("message") + 0.05) / 0.45 : 0;
  const pressed = k(t, w("message"), 0.3);
  const trick = k(t, w("share") - 0.1, 0.7);
  const ctaOut = k(t, 20.85, 0.7, INOUT);
  const cur = cursorAt([[w("differently") - 0.2, 980, 1700], [w("message") - 0.1, 795, 1228], [w("message") + 0.6, 860, 1300], [20.8, 980, 1750]], t);
  const curO = k(t, w("differently") - 0.2, 0.4) * (1 - k(t, 20.5, 0.4, IN));

  return (
    <AbsoluteFill style={{ background: layer === "logoOnly" ? "transparent" : undefined }}>
      {layer !== "logoOnly" && <Page />}
      {layer !== "logoOnly" && (
        <div style={{ position: "absolute", inset: 0, transform: `translate(${camX.toFixed(2)}px, ${camY.toFixed(2)}px) rotate(${camR.toFixed(3)}deg) scale(${camS.toFixed(4)})` }}>
          <Heads t={t} />
          {t < 2.2 && Array.from({ length: 10 }, (_, i) => {
            const p = c01((t - 0.35 - i * 0.03) / 1.3), a = (i / 10) * Math.PI * 2 + 0.3;
            return p > 0 && p < 1 ? <div key={"b" + i} style={{ position: "absolute", left: 540 + Math.cos(a) * 460 * OUT(p) - 22, top: 800 + Math.sin(a) * 460 * OUT(p) - 22, opacity: Math.sin(Math.PI * p) }}><Spark s={44} r={t * 260 + i * 36} /></div> : null;
          })}
          {t < 2 && [0, 1].map((j) => <Ring key={"lr" + j} x={540} y={800} p={c01((t - 0.4 - j * 0.3) / 1.1)} r={420} color="rgba(153,205,252,0.6)" />)}

          {/* A: the contract, signed by both sides */}
          {docO > 0 && (
            <div style={{ position: "absolute", left: docX - 390, top: docY - 480, width: 780, height: 960, opacity: docO, transform: `translateX(${(26 * Math.sin(t * 1.2)).toFixed(2)}px) scale(${docS}) rotate(${mix(-9, -3, OUT(docIn)) + 3 * Math.sin(t * 1.1)}deg) translateY(${(1 - OUT(docIn)) * 300}px)`, transformOrigin: "50% 50%" }}>
              <div style={card({ inset: 0 })}>
                <div style={{ height: 120, background: C.navy, display: "flex", alignItems: "center", gap: 18, padding: "0 40px", color: C.white, fontSize: 40, fontWeight: 800 }}>
                  <DocIcon s={56} /><span>Contract</span>
                </div>
                <div style={{ padding: "40px 46px 0" }}>
                  <div style={{ fontSize: 46, fontWeight: 800, letterSpacing: "-0.03em", height: 60 }}>{title.slice(0, typed)}<span style={{ opacity: typed < title.length && t > w("software") ? 1 : 0 }}>|</span></div>
                  {[600, 520, 640, 480, 560].map((ww, j) => (
                    <div key={j} style={{ marginTop: 26, height: 20, width: ww, borderRadius: 10, background: scopeGlow > 0 ? `rgba(111,174,241,${(0.25 + 0.75 * scopeGlow * (0.6 + 0.4 * Math.sin(t * 6 + j))).toFixed(3)})` : "#E4E8EE", opacity: 1 - k(t, T_FLY(j) - 0.05, 0.2) }} />
                  ))}
                </div>
                {[0, 1].map((j) => (
                  <div key={j} style={{ position: "absolute", left: 46 + j * 360, bottom: 70, width: 320 }}>
                    <svg width={320} height={90} style={{ display: "block" }}>
                      <path d={j ? "M10 70 C40 20 60 20 70 55 C80 85 100 30 130 40 C160 50 170 70 200 45 C230 25 260 60 300 50" : "M10 60 C30 30 50 80 80 40 C110 10 120 70 150 50 C180 30 200 65 230 45 C260 30 280 55 300 40"}
                        fill="none" stroke={C.navy} strokeWidth={6} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - (j ? sig2 : sig1)} />
                    </svg>
                    <div style={{ height: 3, background: C.muted, opacity: 0.6 }} />
                    <div style={{ marginTop: 10, fontSize: 28, fontWeight: 700, color: C.muted }}>{j ? "K.B" : "Client"}</div>
                  </div>
                ))}
                <div style={{ position: "absolute", right: 34, top: 150, opacity: seal, transform: `scale(${mix(1.6, 1, OUT(seal))}) rotate(${mix(-30, -8, OUT(seal))}deg)` }}><Check size={130} p={seal} color={C.blueS} /></div>
              </div>
              {penO > 0 && <div style={{ position: "absolute", left: penX - 6, top: penY - 50, opacity: penO }}><Pen s={70} /></div>}
            </div>
          )}

          {/* B/C: the project board; the scope lines fly in as tasks; AI agents carry them out and validate */}
          {boardIn > 0 && boardOut < 1 && (
            <div style={{ position: "absolute", inset: 0, opacity: boardIn * (1 - boardOut), transform: `translateX(${(-boardOut * 700).toFixed(1)}px) scale(${1 - 0.15 * boardOut})` }}>
              <div style={card({ left: BX, top: BY, width: BW, height: BH, transform: `translate(${(20 * Math.sin(t * 1.05 + 1)).toFixed(2)}px, ${(1 - OUT(boardIn)) * 220}px) rotate(${(1.2 * Math.sin(t * 0.9)).toFixed(3)}deg)`, background: "#F4F7FB" })}>
                <div style={{ height: 110, background: C.white, display: "flex", alignItems: "center", gap: 20, padding: "0 34px", fontSize: 38, fontWeight: 800, borderBottom: `2px solid ${C.lineSoft}` }}>
                  <BoardIcon s={56} /><span>Project tools</span>
                  <div style={{ marginLeft: "auto", display: "flex", gap: 10 }}>{[0, 1, 2].map((j) => <Avatar key={j} size={46} tone={j === 1 ? "ice" : "blue"} />)}</div>
                </div>
                {["To do", "Doing", "Done"].map((h, c) => (
                  <div key={h} style={{ position: "absolute", left: 24 + c * 312, top: 130, width: 288, height: BH - 160, borderRadius: 18, background: c === 2 && scan > 0 ? `rgba(117,239,166,${(0.12 * Math.min(1, scan * 2)).toFixed(3)})` : "#EAEFF6" }}>
                    <div style={{ padding: "18px 20px", fontSize: 30, fontWeight: 800, color: c === 1 && t > w("carry") && t < T_DONE(NT - 1) + 0.5 ? C.blueS : C.navy }}>{h}</div>
                  </div>
                ))}
                {scan > 0 && scan < 1 && <div style={{ position: "absolute", left: 24 + 2 * 312, top: 190 + scan * 760, width: 288, height: 6, borderRadius: 3, background: C.green, boxShadow: `0 0 24px ${C.green}` }} />}
              </div>
              {/* the AI agents above the Doing column, beaming into it */}
              {[0, 1, 2].map((j) => {
                const a = agentsIn(j), x = 160 + j * 380, y = 540;
                return a > 0 ? (
                  <div key={j} style={{ position: "absolute", left: x - 150, top: y - 50, opacity: a, transform: `translateY(${(1 - OUT(a)) * -120}px)` }}>
                    <div style={floatStyle(t, 50 + j, 10)}>
                      <div style={{ display: "flex", alignItems: "center", gap: 14, height: 92, padding: "0 30px 0 18px", borderRadius: 999, background: C.navy, border: `3px solid ${C.blue}`, color: C.white, fontFamily: F, fontSize: 32, fontWeight: 800, boxShadow: "0 18px 40px -16px rgba(0,0,0,0.6)" }}>
                        <div style={{ width: 60, height: 60, borderRadius: "50%", background: "rgba(153,205,252,0.18)", display: "flex", alignItems: "center", justifyContent: "center" }}><Spark s={40} r={t * 90 + j * 40} /></div>
                        AI agent
                      </div>
                    </div>
                  </div>
                ) : null;
              })}
              {t > w("carry") - 0.2 && t < T_DONE(NT - 1) + 0.6 && (
                <svg width={W_} height={1920} style={{ position: "absolute", inset: 0 }}>
                  {[0, 1, 2].map((j) => <path key={j} d={`M ${160 + j * 380} 590 C ${160 + j * 380} 700, ${COLX(1) + 144} 640, ${COLX(1) + 144} 820`} fill="none" stroke={C.blue} strokeWidth={5} strokeDasharray="4 18" strokeDashoffset={-t * 90} strokeLinecap="round" opacity={0.9} />)}
                </svg>
              )}
              {/* the tasks */}
              {Array.from({ length: NT }, (_, i) => {
                const fly = k(t, T_FLY(i), 0.75);
                if (fly <= 0) return null;
                const m1 = k(t, T_DOING(i), 0.55, INOUT), m2 = k(t, T_DONE(i), 0.55, INOUT);
                // from the contract's scope line (where the doc was) into To do, then Doing, then Done
                const sx = 250 - 130 + (i % 2) * 40, sy = 620 - 120 + i * 28;
                const PERM = [2, 0, 4, 1, 3];
                const so = k(t, w("project") - 0.35 + i * 0.06, 0.8, INOUT);
                const tx = COLX(0) + Math.sin(Math.PI * so) * (i % 2 ? 70 : -40), ty = mix(SLOT(i), SLOT(PERM[i]), so);
                const x0 = mix(sx, tx, OUT(fly)), y0 = mix(sy, ty, OUT(fly)) - Math.sin(Math.PI * fly) * 160;
                const x = mix(mix(x0, COLX(1), m1), COLX(2), m2);
                const y = y0;
                const prog = c01((t - T_DOING(i) - 0.3) / Math.max(0.3, T_DONE(i) - T_DOING(i) - 0.2));
                const tilt = (m1 > 0 && m1 < 1) || (m2 > 0 && m2 < 1) ? 4 * Math.sin(Math.PI * (m1 < 1 ? m1 : m2)) : 0;
                return (
                  <div key={i} style={{ position: "absolute", left: x, top: y, transform: `rotate(${((1 - OUT(fly)) * (i % 2 ? 25 : -25) + tilt).toFixed(2)}deg) scale(${mix(0.5, 1, OUT(fly))})` }}>
                    <div style={floatStyle(t, 60 + i, 4)}><Task t={t} i={i} prog={prog} checked={k(t, T_CHECK(i), 0.45)} /></div>
                  </div>
                );
              })}
            </div>
          )}

          {/* D: what we learn goes into the documentation */}
          {docsIn > 0 && docsOut < 1 && (
            <>
              {Array.from({ length: 7 }, (_, i) => {
                const p = c01((t - w("then") - 0.05 - i * 0.07) / 0.9);
                if (p <= 0 || p >= 1) return null;
                const x = mix(COLX(2) + 144 - 500 * k(t, w("then") + 0.1, 0.9, INOUT), 540 + (i - 3) * 60, OUT(p)), y = mix(SLOT(i % 5) + 60, 760, OUT(p)) - Math.sin(Math.PI * p) * 200;
                return <div key={i} style={{ position: "absolute", left: x - 22, top: y - 22, opacity: Math.sin(Math.PI * p) }}><Spark s={44} r={t * 200 + i * 30} /></div>;
              })}
              <div style={{ position: "absolute", left: 130, top: 700, width: 820, height: 900, opacity: docsIn * (1 - docsOut), transform: `translateX(${((1 - OUT(docsIn)) * 600 + 26 * Math.sin(t * 1.15)).toFixed(1)}px) scale(${mix(1, 0.3, docsOut)}) rotate(${(3 * Math.sin(t * 0.9)).toFixed(2)}deg)`, transformOrigin: "50% 50%" }}>
                <div style={card({ inset: 0 })}>
                  <div style={{ height: 120, background: C.navy, display: "flex", alignItems: "center", gap: 18, padding: "0 40px", color: C.white, fontSize: 40, fontWeight: 800 }}><BookIcon s={58} /><span>Documentation</span></div>
                  <div style={{ padding: "44px 50px", position: "relative" }}>
                    {t > w("learn") && <div style={{ position: "absolute", left: 50 + ((t * 520) % 760) - 80, top: 44 + (Math.floor(t * 1.6) % 7) * 60 - 8, width: 170, height: 38, borderRadius: 10, background: "rgba(153,205,252,0.45)" }} />}
                    {[620, 540, 660, 500, 600, 560, 640].map((ww, j) => {
                      const r = j === 1 || j === 3 ? rew : j === 5 || j === 6 ? rew2 : 0;
                      return (
                        <div key={j} style={{ position: "relative", height: 26, marginBottom: 34, overflow: "visible" }}>
                          <div style={{ position: "absolute", left: (r * 700).toFixed(1) + "px", width: ww, height: 22, borderRadius: 11, background: "#E4E8EE", opacity: 1 - r }} />
                          {r > 0 && <div style={{ position: "absolute", left: ((1 - r) * -700).toFixed(1) + "px", width: ww - 40, height: 22, borderRadius: 11, background: C.blueS, opacity: r }} />}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* D: the loop that improves the process, double-checked by K.B */}
          {loopIn > 0 && loopOut < 1 && (
            <div style={{ position: "absolute", inset: 0, opacity: loopIn * (1 - loopOut), transform: `scale(${(mix(0.7, 1, OUT(loopIn)) * (1 - 0.2 * loopOut)).toFixed(4)})`, transformOrigin: "540px 1150px" }}>
              <svg width={W_} height={1920} style={{ position: "absolute", inset: 0 }}>
                <g transform={`rotate(${(t * 40) % 360} 540 1150)`}>
                  {[0, 1, 2, 3].map((j) => (
                    <path key={j} d={`M ${540 + 340 * Math.cos((j * 90 + 18) * Math.PI / 180)} ${1150 + 340 * Math.sin((j * 90 + 18) * Math.PI / 180)} A 340 340 0 0 1 ${540 + 340 * Math.cos((j * 90 + 72) * Math.PI / 180)} ${1150 + 340 * Math.sin((j * 90 + 72) * Math.PI / 180)}`}
                      fill="none" stroke={C.blue} strokeWidth={12} strokeLinecap="round" markerEnd="url(#arr)" />
                  ))}
                  <defs><marker id="arr" viewBox="0 0 10 10" refX={5} refY={5} markerWidth={3.2} markerHeight={3.2} orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill={C.blue} /></marker></defs>
                </g>
                <circle cx={540} cy={1150} r={420} fill="none" stroke="rgba(153,205,252,0.25)" strokeWidth={3} strokeDasharray="6 16" strokeDashoffset={-t * 60} />
              </svg>
              {[<DocIcon key={0} s={96} />, <BoardIcon key={1} s={96} />, <Spark key={2} s={84} r={t * 120} c={C.blueS} />, <BookIcon key={3} s={96} />].map((ic, j) => {
                const a = (j * 90 - 90 + t * 40) * Math.PI / 180, pin = k(t, w("improve") + j * 0.1, 0.6);
                return <div key={j} style={{ position: "absolute", left: 540 + 340 * Math.cos(a) - 85, top: 1150 + 340 * Math.sin(a) - 85, width: 170, height: 170, borderRadius: "50%", background: C.white, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 20px 50px -20px rgba(0,0,0,0.5)", opacity: pin, transform: `scale(${mix(0.3, 1, OUT(pin))})` }}>{ic}</div>;
              })}
              {/* the double-check: K.B's glass sweeps the loop, a check lands in the middle */}
              {(() => {
                const sw = c01((t - w("development", 2) + 0.4) / 1.1);
                const a = (-90 + sw * 300) * Math.PI / 180;
                return <>
                  {sw > 0 && sw < 1 && <div style={{ position: "absolute", left: 540 + 340 * Math.cos(a) - 45, top: 1150 + 340 * Math.sin(a) - 45 }}><Glass s={110} /></div>}
                  <div style={{ position: "absolute", left: 540 - 110, top: 1150 - 110, opacity: check, transform: `scale(${mix(0.4, 1, OUT(check))})` }}>
                    <div style={{ width: 220, height: 220, borderRadius: "50%", background: C.navy, border: `5px solid ${C.blue}`, display: "flex", alignItems: "center", justifyContent: "center" }}><Check size={130} p={check} color={C.blueS} /></div>
                  </div>
                  <div style={{ position: "absolute", left: 0, right: 0, top: 1660, display: "flex", justifyContent: "center", ...enter(k(t, w("process") - 0.05, 0.6)) }}>
                    <Title size={56} color={C.blue}>Double-checked by K.B</Title>
                  </div>
                </>;
              })()}
              <Ring x={540} y={1150} p={check > 0 ? (((t - w("process")) % 1) + 1) % 1 : 0} r={300} color="rgba(153,205,252,0.6)" />
            </div>
          )}

          {/* E: Do you work differently? Message us */}
          {t > w("do") - 0.3 && (
            <div style={{ position: "absolute", inset: 0, transform: `translateY(${(ctaOut * 520).toFixed(1)}px)`, opacity: 1 - 0.0 * ctaOut }}>
              <div style={{ position: "absolute", left: 0, right: 0, top: 560 - ctaOut * 400, textAlign: "center", opacity: 1 - ctaOut }}>
                {[["Do", "you", "work"], ["differently?"]].map((line, li) => (
                  <div key={li} style={{ display: "flex", justifyContent: "center", gap: 26 }}>
                    {line.map((wd, j) => <Title key={wd} size={li ? 118 : 104} color={li ? C.blue : C.white} style={{ ...enter(k(t, w(wd === "differently?" ? "differently" : wd.toLowerCase()) - 0.08, 0.5), 50) }}>{wd}</Title>)}
                  </div>
                ))}
              </div>
              <div style={{ position: "absolute", left: 90, top: 1040, width: 900, opacity: ctaIn * (1 - ctaOut), transform: `translateY(${((1 - OUT(ctaIn)) * 200).toFixed(1)}px)` }}>
                <div style={{ ...floatStyle(t, 80, 14), marginLeft: (24 * Math.sin(t * 1.25)).toFixed(1) + "px" }}>
                  <div style={card({ position: "relative", width: 900, height: 330, padding: "34px 38px", boxSizing: "border-box" })}>
                    <div style={{ display: "flex", alignItems: "center", gap: 20 }}><Avatar size={80} /><div><Bar w={240} h={22} c={C.navy} style={{ opacity: 0.8 }} /><Bar w={160} style={{ marginTop: 12 }} /></div></div>
                    <div style={{ marginTop: 30, height: 96, borderRadius: 48, background: "#EEF2F7", display: "flex", alignItems: "center", padding: "0 14px 0 34px" }}>
                      <div style={{ display: "flex", gap: 10 }}>{[0, 1, 2].map((j) => <div key={j} style={{ width: 16, height: 16, borderRadius: 8, background: C.muted, opacity: 0.35 + 0.65 * Math.max(0, Math.sin(t * 7 - j * 0.8)) }} />)}</div>
                      <div style={{ marginLeft: "auto", height: 72, padding: "0 34px", borderRadius: 36, background: pressed > 0.5 ? C.blueS : C.blue, color: C.navy, display: "flex", alignItems: "center", fontSize: 34, fontWeight: 800, transform: `scale(${(1 - 0.08 * Math.sin(Math.PI * c01(press))).toFixed(3)})` }}>Message us</div>
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ position: "absolute", left: 140, top: 1450, width: 800, opacity: trick * (1 - ctaOut), transform: `translateY(${((1 - OUT(trick)) * 120).toFixed(1)}px) scale(${mix(0.8, 1, OUT(trick))})` }}>
                <div style={{ ...floatStyle(t, 81, 14), marginLeft: (22 * Math.sin(t * 1.1 + 2)).toFixed(1) + "px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 22, padding: "28px 36px", borderRadius: 28, background: C.navy, border: `3px solid ${C.blue}`, fontFamily: F, fontSize: 42, fontWeight: 800, color: C.white, letterSpacing: "-0.02em" }}>
                    <Spark s={60} r={t * 150} />We'll share a trick in return
                  </div>
                </div>
              </div>
              {(() => { const sp = c01((t - w("message") - 0.15) / 1.0); return sp > 0 && sp < 1 ? (
                <div style={{ position: "absolute", left: 620 - 260 * sp, top: 1200 - 330 * OUT(sp), opacity: Math.sin(Math.PI * sp) * 1.4 > 1 ? 1 : Math.sin(Math.PI * sp) * 1.4, transform: `scale(${mix(0.5, 1, OUT(sp))}) rotate(${(-6 * sp).toFixed(2)}deg)` }}>
                  <div style={{ width: 320, height: 110, borderRadius: "40px 40px 10px 40px", background: C.blueS, display: "flex", flexDirection: "column", justifyContent: "center", gap: 12, padding: "0 34px", boxSizing: "border-box" }}><Bar w={220} h={16} c={C.white} /><Bar w={150} h={16} c="rgba(255,255,255,0.7)" /></div>
                </div>) : null; })()}
              <Cursor x={cur.x} y={cur.y} press={press} o={curO} size={64} />
            </div>
          )}

          {/* the process rail: the five steps glide steadily along the bottom, the current one lit */}
          {(() => {
            const STEPS = ["Contract", "Tasks", "AI agents", "Docs", "Double-check"];
            const at_ = [1.6, w("turn") - 0.3, w("ai") - 0.3, w("then") - 0.2, w("development", 2) - 0.4, w("do") - 0.3];
            const cur_ = at_.findIndex((x, i) => t >= x && (i === at_.length - 1 || t < at_[i + 1]));
            const o = k(t, 1.6, 0.6) * (1 - k(t, 20.6, 0.5, IN));
            if (o <= 0) return null;
            const PITCH = 300, off = (t * 72) % (PITCH * 5);
            return <div style={{ position: "absolute", left: 0, top: 1772, width: W_, height: 100, opacity: o }}>
              {Array.from({ length: 15 }, (_, n) => {
                const i = n % 5, x = n * PITCH - off - PITCH;
                if (x < -320 || x > W_ + 20) return null;
                const on = i === cur_;
                return <div key={n} style={{ position: "absolute", left: x, top: 0, width: 270, height: 92, borderRadius: 46, display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
                  background: on ? C.blue : "rgba(255,255,255,0.10)", border: `2px solid ${on ? C.blue : "rgba(153,205,252,0.35)"}`, color: on ? C.navy : C.white, fontFamily: F, fontSize: 30, fontWeight: 800 }}>
                  <span style={{ width: 14, height: 14, borderRadius: 7, background: on ? C.navy : C.blue }} />{STEPS[i]}</div>;
              })}
            </div>;
          })()}

          {/* the end card: the logo lands; rings and sparks keep it alive */}
          {t > 20.9 && (
            <>
              {[0, 1, 2].map((j) => <Ring key={j} x={540} y={760} p={((t - 21.2 - j * 0.33) % 1 + 1) % 1 * (t > 21.2 + j * 0.33 ? 1 : 0)} r={360} color="rgba(153,205,252,0.5)" />)}
              {Array.from({ length: 8 }, (_, i) => {
                const a = (i / 8) * Math.PI * 2 + t * 0.9, pin = k(t, 21.2 + i * 0.06, 0.6);
                return <div key={i} style={{ position: "absolute", left: 540 + Math.cos(a) * 330 * mix(0.5, 1, OUT(pin)) - 18, top: 760 + Math.sin(a) * 330 * mix(0.5, 1, OUT(pin)) - 18, opacity: pin }}><Spark s={36} r={t * 120 + i * 45} /></div>;
              })}
              <div style={{ position: "absolute", left: 0, right: 0, top: 1130, display: "flex", justifyContent: "center", ...enter(k(t, 21.4, 0.6), 50) }}>
                <div style={{ ...floatStyle(t, 90, 6) }}>
                  <div style={{ height: 110, padding: "0 56px", borderRadius: 55, background: C.blue, color: C.navy, display: "flex", alignItems: "center", fontFamily: F, fontSize: 52, fontWeight: 800 }}>Message us</div>
                </div>
              </div>
            </>
          )}
        </div>
      )}
      {layer !== "noLogo" && <LogoLayer track={LOGO} t={t} />}
    </AbsoluteFill>
  );
};
