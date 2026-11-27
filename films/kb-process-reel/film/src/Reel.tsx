// K.B process reel v2 (1080x1920, 60 fps, 23 s). Karl's direction: a white, bright page with the navy on top; nothing
// floats or sways: every element keeps its place and the animation happens IN it (morphs, fills, ticks, typing);
// few particles; one distinctive idea. The idea: ONE navy object carries the whole process in place. The signed
// contract's scope lines split into task tiles; AI agents work through the tiles and validate them; the tiles merge back
// into the documentation, whose lines are rewritten; the page closes into the process ring, double-checked by K.B; the
// ring opens into a "Message us" chat bubble. A fixed track at the bottom fills step by step.
import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { C, F, FPS, OUT, INOUT, IN, k, mix, c01, useFont, Layer, LogoKey, LogoLayer } from "./kit";
import { w } from "./timing";

const NAVY = C.navy, BLUE = C.blue, BLUES = C.blueS, ICE = C.ice, WHITE = "#FFFFFF", GREEN = "#75EFA6";
const X0 = 140, WD = 800, HH = 170, SL = 124, GAP = 22, NS = 6;
const font = (size: number, weight = 800, color = NAVY): React.CSSProperties => ({ fontFamily: F, fontSize: size, fontWeight: weight, color, letterSpacing: "-0.03em", lineHeight: 1.05, whiteSpace: "nowrap" });
/** a colour between two colours (hex or rgb()) */
const parse = (s: string) => s.startsWith("#") ? [1, 3, 5].map((i) => parseInt(s.slice(i, i + 2), 16)) : (s.match(/\d+/g) || ["0", "0", "0"]).slice(0, 3).map(Number);
const lerpC = (a: string, b: string, p: number) => { const A = parse(a), B = parse(b); return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * c01(p))).join(",")})`; };

// ------------------------------------------------------------------ the headline: swaps in place (a vertical roll inside a mask)
const HEADS: [number, string][] = [[w("signed") - 0.05, "Signed contract"], [w("clear") - 0.05, "Clear tasks"], [w("agents") - 0.15, "AI agents"], [w("validate") - 0.05, "Validated"],
  [w("update") - 0.05, "Update documentation"], [w("improve") - 0.05, "Improve the process"], [w("do") - 0.2, ""]];
const Head: React.FC<{ t: number }> = ({ t }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top: 268, height: 110, overflow: "hidden" }}>
    {HEADS.map(([t0, txt], i) => {
      if (!txt) return null;
      const a = k(t, t0, 0.5, INOUT), b = k(t, HEADS[i + 1][0], 0.45, INOUT);
      if (a <= 0 || b >= 1) return null;
      return <div key={i} style={{ position: "absolute", left: 0, right: 0, top: 0, height: 110, display: "flex", alignItems: "center", justifyContent: "center", transform: `translateY(${((1 - a) * 110 - b * 110).toFixed(1)}px)` }}>
        <span style={font(80)}>{txt}</span>
      </div>;
    })}
  </div>
);

// ------------------------------------------------------------------ small icons
const Sparkle: React.FC<{ s: number; c?: string }> = ({ s, c = BLUE }) => (
  <svg width={s} height={s} viewBox="0 0 40 40"><path d="M20 3 C21.4 13 27 18.6 37 20 C27 21.4 21.4 27 20 37 C18.6 27 13 21.4 3 20 C13 18.6 18.6 13 20 3 Z" fill={c} /></svg>
);
const CheckMark: React.FC<{ s: number; p: number; c?: string; w_?: number }> = ({ s, p, c = NAVY, w_ = 9 }) => (
  <svg width={s} height={s} viewBox="0 0 100 100"><path d="M24 53 L42 70 L76 32" fill="none" stroke={c} strokeWidth={w_} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - c01(p)} /></svg>
);
const Send: React.FC<{ s: number; c: string }> = ({ s, c }) => <svg width={s} height={s} viewBox="0 0 40 40"><path d="M5 20 L35 6 L27 34 L19 23 Z" fill={c} /></svg>;

// ------------------------------------------------------------------ the split-flap: every state change is a flip in place
const FLIP = 0.5, STAG = 0.3;
/** angle (deg, rotateX) and which state to show, for an element whose states change at the given times */
const flapAt = (t: number, times: number[]): { st: number; ang: number } => {
  let st = 0;
  for (let n = 0; n < times.length; n++) {
    const te = times[n];
    if (t < te) break;
    const q = (t - te) / FLIP;
    if (q < 0.5) return { st: n, ang: -180 * q };          // the old face folds away
    if (q < 1) return { st: n + 1, ang: 90 - 180 * (q - 0.5) }; // the new face unfolds
    st = n + 1;
  }
  return { st, ang: 0 };
};
/** a flap: rotates on its horizontal axis and catches the light as it turns (light = a white sheen on dark faces,
 *  a navy shade on light faces), the way a real split-flap does */
const Flap: React.FC<{ ang: number; light?: boolean; r?: number | string; style?: React.CSSProperties; children?: React.ReactNode }> = ({ ang, light, r = 0, style, children }) => {
  const sheen = Math.abs(Math.sin((ang * Math.PI) / 180));
  return (
    <div style={{ perspective: 1400, ...style }}><div style={{ position: "relative", width: "100%", height: "100%", transform: `rotateX(${ang.toFixed(2)}deg)`, transformOrigin: "50% 50%", backfaceVisibility: "hidden" }}>
      {children}
      {sheen > 0.001 && <div style={{ position: "absolute", inset: 0, borderRadius: r, background: light ? NAVY : "#FFFFFF", opacity: (light ? 0.45 : 0.7) * sheen, pointerEvents: "none" }} />}
    </div></div>
  );
};

export const Reel: React.FC<{ layer: Layer }> = ({ layer }) => {
  const ok = useFont();
  const t = useCurrentFrame() / FPS;
  if (!ok) return null;

  // ---- the object's states
  const docIn = k(t, 0.95, 0.75, OUT);
  const sep = k(t, w("into") - 0.05, 0.75, INOUT) * (1 - k(t, w("then") - 0.05, 0.8, INOUT));
  const docsMode = t > w("then");
  const toRing = k(t, w("improve") - 0.25, 0.8, INOUT);
  const toBubble = k(t, w("do") - 0.25, 0.85, INOUT);
  const endOut = k(t, 20.75, 0.5, IN);

  // ---- the page (header + six slices), centred on one fixed point
  const hh = HH * (1 - sep), gap = GAP * sep;
  const stackH = hh + NS * SL + (NS - 1) * gap;
  const top = 1000 - stackH / 2;
  const stackO = docIn * (1 - c01(toRing * 1.6));
  const stackS = mix(0.82, 1, OUT(docIn)) * mix(1, 0.55, toRing);

  const title = "Software development", typed = Math.round(title.length * c01((t - w("software")) / 0.75));
  const sig = [k(t, w("signed") - 0.12, 0.55, INOUT), k(t, w("contract") + 0.05, 0.5, INOUT)];
  const seal = k(t, w("contract") + 0.5, 0.45);
  const contractFade = k(t, w("into") - 0.1, 0.4);
  const head2 = k(t, w("then") + 0.25, 0.5);
  // the tiles' state changes (cascade starts); state n+1 = after the n-th flip
  //  1 drafted · 2 signed · 3 scope · 4 task · 5 in the project · 6 agent assigned · 7 working · 8 validated · 9 doc line · 10 rewritten · 11 new section
  const CASC = [1.15, w("contract") + 0.5, w("scope") - 0.05, w("clear") - 0.05, w("project") - 0.1, w("agents") - 0.12, w("those") - 0.3, w("validate"), w("then") + 0.15, w("update"), w("documentation") + 0.3];

  // ---- the ring and the disc
  const ringIn = k(t, w("improve") - 0.05, 0.7);
  const disc = toRing * (1 - toBubble);
  const dcheck = k(t, w("process") - 0.2, 0.55);
  const seg = (j: number) => k(t, w("improve") + 0.05 + j * 0.13, 0.35);
  const lit = (j: number) => { if (t <= w("improve") + 0.6) return 0; const ph = ((t - w("improve") - 0.6) * 1.6) % 4; return Math.max(0, 1 - Math.abs(((ph - j + 4) % 4) - 0.5) * 1.6); };

  // ---- the bubble (morphed from the disc)
  const bw = mix(380, 860, toBubble), bh = mix(380, 420, toBubble), br = mix(190, 60, toBubble), by = mix(1000, 960, toBubble);
  const press = k(t, w("message") - 0.05, 0.12) * (1 - k(t, w("message") + 0.15, 0.3));

  // ---- the progress track
  const STEP_T = [0.9, w("turn") - 0.2, w("ai") - 0.2, w("then") - 0.1, w("development", 2) - 0.3, w("do") - 0.25];
  const cur = STEP_T.findIndex((x, i) => t >= x && (i === STEP_T.length - 1 || t < STEP_T[i + 1]));
  const trackO = k(t, 1.3, 0.5) * (1 - endOut);

  const LOGO: LogoKey[] = [
    { t: 0, x: 540, y: 150, size: 120, o: 0 }, { t: 0.25, x: 540, y: 150, size: 120, o: 0 }, { t: 0.8, x: 540, y: 150, size: 170, o: 1 },
    { t: 20.8, x: 540, y: 150, size: 170, o: 1 }, { t: 21.05, x: 540, y: 150, size: 170, o: 0 }, { t: 21.1, x: 540, y: 900, size: 260, o: 0 },
    { t: 21.7, x: 540, y: 900, size: 440, o: 1 }, { t: 23, x: 540, y: 900, size: 440, o: 1 },
  ];

  return (
    <AbsoluteFill style={{ background: layer === "logoOnly" ? "transparent" : "linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 55%, #F2F6FB 100%)" }}>
      {layer !== "logoOnly" && <>
        <Head t={t} />

        {/* ===== the page: header + six slices (contract -> tasks -> documentation) ===== */}
        {stackO > 0.001 && (
          <div style={{ position: "absolute", left: X0, top, width: WD, height: stackH, opacity: stackO, transform: `scale(${stackS.toFixed(4)})`, transformOrigin: "50% 50%" }}>
            {hh > 1 && (
              <div style={{ position: "absolute", left: 0, top: 0, width: WD, height: hh, background: NAVY, borderRadius: "40px 40px 0 0", overflow: "hidden" }}>
                <div style={{ position: "absolute", left: 44, top: 34, display: "flex", alignItems: "center", gap: 20, opacity: c01(hh / HH) }}>
                  <div style={{ width: 66, height: 66, borderRadius: 16, background: BLUE, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {!docsMode
                      ? <svg width={40} height={40} viewBox="0 0 40 40"><rect x={9} y={5} width={22} height={30} rx={3} fill="none" stroke={NAVY} strokeWidth={3.5} /><rect x={14} y={13} width={12} height={3} rx={1.5} fill={NAVY} /><rect x={14} y={20} width={12} height={3} rx={1.5} fill={NAVY} /></svg>
                      : <svg width={42} height={42} viewBox="0 0 40 40"><path d="M5 9 C11 7 16 8 20 11 C24 8 29 7 35 9 V32 C29 30 24 31 20 34 C16 31 11 30 5 32 Z" fill="none" stroke={NAVY} strokeWidth={3.5} strokeLinejoin="round" /><line x1={20} y1={11} x2={20} y2={34} stroke={NAVY} strokeWidth={3.5} /></svg>}
                  </div>
                  <div>
                    <div style={font(28, 700, BLUE)}>{docsMode ? "Documentation" : "Contract"}</div>
                    <div style={{ ...font(42, 800, WHITE), marginTop: 6, opacity: docsMode ? head2 : 1 }}>{docsMode ? "How we build" : <>{title.slice(0, typed)}<span style={{ opacity: typed < title.length && Math.floor(t * 3) % 2 === 0 ? 1 : 0, color: BLUE }}>|</span></>}</div>
                  </div>
                </div>
                {!docsMode && seal > 0 && (
                  <div style={{ position: "absolute", right: 34, top: 30, width: 110, height: 110, borderRadius: "50%", background: BLUE, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${mix(1.5, 1, OUT(seal))}) rotate(${mix(-40, -10, OUT(seal))}deg)`, opacity: seal * (1 - contractFade) }}>
                    <CheckMark s={84} p={c01((t - w("contract") - 0.6) / 0.35)} />
                  </div>
                )}
              </div>
            )}
            {Array.from({ length: NS }, (_, i) => {
              const y = hh + i * (SL + gap);
              const rTop = 26 * sep, rBot = i === NS - 1 ? mix(40, 26, sep) : 26 * sep;
              const { st, ang } = flapAt(t, CASC.map((c) => c + i * STAG));
              const BG = [NAVY, NAVY, NAVY, "#1E3A5E", NAVY, NAVY, NAVY, "#24466F", "#235C49", NAVY, NAVY, NAVY][st];
              const sigP = i >= 4 ? (i === 4 ? sig[0] : sig[1]) : 1;
              const bar = (ww: number, c: string, top_: number, h = 22) => <div style={{ position: "absolute", left: 44, top: top_, width: ww, height: h, borderRadius: h / 2, background: c }} />;
              const W1 = [560, 480, 600, 440, 520, 460][i], W2 = [330, 280, 360, 250, 310, 290][i], W3 = [210, 250, 180, 230, 200, 260][i];
              const face = () => {
                if (st === 0) return null;
                if (st <= 2) return i < 4 ? <>{bar(W1, "#3A5577", 51)}{st === 2 && <div style={{ position: "absolute", right: 40, top: SL / 2 - 26 }}><CheckMark s={52} p={1} c={BLUE} /></div>}</> : (
                  <div style={{ position: "absolute", left: 44, right: 44, top: 0, height: SL }}>
                    <svg width={420} height={84} style={{ position: "absolute", left: 0, top: 6 }}>
                      <path d={i === 4 ? "M8 60 C30 26 52 82 82 40 C110 8 124 72 154 50 C182 30 204 66 236 44 C262 30 290 56 330 40" : "M8 68 C36 20 62 22 72 56 C84 86 104 30 134 40 C164 50 176 70 206 46 C236 24 266 62 330 48"}
                        fill="none" stroke={WHITE} strokeWidth={6} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - sigP} />
                    </svg>
                    <div style={{ position: "absolute", left: 0, top: 88, width: 360, height: 3, background: "rgba(255,255,255,0.35)" }} />
                    <div style={{ position: "absolute", right: 0, top: 40, ...font(34, 800, BLUE) }}>{i === 4 ? "Client" : "K.B"}</div>
                  </div>);
                if (st === 3) return <>{bar(W1, BLUE, 51)}<div style={{ position: "absolute", left: 44 + ((t * 600 + i * 90) % (W1 + 120)) - 120, top: 51, width: 90, height: 22, borderRadius: 11, background: "rgba(255,255,255,0.7)" }} /></>;
                if (st <= 8) {
                  const working = st === 7, done = st === 8;
                  const wk = c01((t - CASC[6] - i * STAG) / 1.2);
                  return <>
                    <div style={{ position: "absolute", left: 30, top: SL / 2 - 30, width: 60, height: 60, borderRadius: 18, border: `4px solid ${done ? GREEN : BLUE}`, background: done ? GREEN : "transparent", boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {done ? <CheckMark s={52} p={1} /> : working ? <div style={{ width: 34, height: 34, borderRadius: "50%", border: "5px solid rgba(153,205,252,0.3)", borderTopColor: BLUE, transform: `rotate(${(t * 600) % 360}deg)`, boxSizing: "border-box" }} /> : null}
                    </div>
                    <div style={{ position: "absolute", left: 120, top: 34, width: W2, height: 22, borderRadius: 11, background: WHITE }} />
                    <div style={{ position: "absolute", left: 120, top: 70, width: W3, height: 16, borderRadius: 8, background: "rgba(255,255,255,0.4)" }} />
                    {st === 5 && <div style={{ position: "absolute", right: 30, top: SL / 2 - 22, width: 110, height: 44, borderRadius: 22, background: [BLUES, BLUE, "#E9B949", BLUES, BLUE, "#E9B949"][i] }} />}
                    {st >= 6 && <div style={{ position: "absolute", right: 30, top: SL / 2 - 34, height: 68, borderRadius: 34, display: "flex", alignItems: "center", gap: 10, padding: "0 20px 0 12px", background: done ? GREEN : BLUE }}>
                      <div style={{ transform: `rotate(${(working ? t * 240 : 0) % 360}deg)` }}><Sparkle s={36} c={NAVY} /></div>
                      <span style={font(26, 800, NAVY)}>{done ? "Validated" : "AI agent"}</span>
                    </div>}
                    {st >= 7 && <div style={{ position: "absolute", left: 120, right: 30, bottom: 0, height: 8, background: "rgba(255,255,255,0.1)" }}><div style={{ width: `${((done ? 1 : wk) * 100).toFixed(1)}%`, height: "100%", background: done ? GREEN : BLUE }} /></div>}
                  </>;
                }
                const rw = st >= 10 ? 1 : 0, rw2 = st >= 11 ? 1 : 0;
                const ww = [[520, 380], [460, 560], [600, 300], [400, 520], [560, 420], [480, 360]][i];
                return <>{bar(ww[0], rw ? BLUE : "rgba(255,255,255,0.85)", 32, 20)}{bar(ww[1], rw2 ? BLUES : "rgba(255,255,255,0.55)", 74, 20)}</>;
              };
              return (
                <div key={i} style={{ position: "absolute", left: 0, top: y, width: WD, height: SL }}>
                  <Flap ang={ang} r={`${rTop}px ${rTop}px ${rBot}px ${rBot}px`} style={{ position: "absolute", inset: 0 }}>
                    <div style={{ position: "absolute", inset: 0, background: BG, borderRadius: `${rTop}px ${rTop}px ${rBot}px ${rBot}px`, overflow: "hidden", boxShadow: Math.abs(ang) > 1 ? "inset 0 0 0 2px rgba(153,205,252,0.5)" : undefined }}>
                      {face()}
                      {/* the split line of the flap */}
                      <div style={{ position: "absolute", left: 0, right: 0, top: SL / 2 - 1, height: 2, background: "rgba(0,0,0,0.18)" }} />
                    </div>
                  </Flap>
                </div>
              );
            })}
          </div>
        )}
        {/* "Project tools": a header bar wipes on above the task list (in place) */}
        {(() => {
          const p = k(t, w("project") - 0.15, 0.5, INOUT) * (1 - k(t, w("then") - 0.1, 0.4, IN));
          if (p <= 0) return null;
          return <div style={{ position: "absolute", left: X0, top: top - 118, width: WD, height: 92, borderRadius: 26, background: ICE, border: `3px solid ${NAVY}`, boxSizing: "border-box", clipPath: `inset(0 ${((1 - p) * 100).toFixed(1)}% 0 0 round 26px)`, display: "flex", alignItems: "center", gap: 18, padding: "0 28px" }}>
            <svg width={50} height={50} viewBox="0 0 40 40"><rect x={4} y={6} width={32} height={28} rx={5} fill="none" stroke={NAVY} strokeWidth={3.5} /><rect x={9} y={12} width={6} height={16} rx={2} fill={BLUES} /><rect x={17} y={12} width={6} height={10} rx={2} fill={NAVY} /><rect x={25} y={12} width={6} height={13} rx={2} fill={BLUE} /></svg>
            <span style={font(38)}>Project tools</span>
            <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>{[0, 1, 2, 3].map((j) => <div key={j} style={{ width: 22, height: 22, borderRadius: 11, background: j <= Math.floor((t * 3) % 4) ? NAVY : "rgba(23,43,68,0.2)" }} />)}</div>
          </div>;
        })()}

        {/* ===== the ring: four steps, each lights in turn ===== */}
        {ringIn > 0 && toBubble < 1 && (
          <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: 1 - toBubble }}>
            {[0, 1, 2, 3].map((j) => {
              const a0 = -90 + j * 90 + 6, a1 = a0 + 78 * seg(j), R = 330;
              const P = (a: number) => [540 + R * Math.cos((a * Math.PI) / 180), 1000 + R * Math.sin((a * Math.PI) / 180)];
              const [x0, y0] = P(a0), [x1, y1] = P(a1);
              return <path key={j} d={`M ${x0} ${y0} A ${R} ${R} 0 0 1 ${x1} ${y1}`} fill="none" stroke={lerpC(NAVY, BLUE, lit(j))} strokeWidth={64} strokeLinecap="round" opacity={ringIn} />;
            })}
          </svg>
        )}
        {ringIn > 0 && toBubble < 1 && [0, 1, 2, 3].map((j) => {
          const a = ((-90 + j * 90 + 45) * Math.PI) / 180, p = seg(j);
          const ic = [<svg key={0} width={44} height={44} viewBox="0 0 40 40"><rect x={9} y={5} width={22} height={30} rx={3} fill="none" stroke={WHITE} strokeWidth={4} /><rect x={14} y={14} width={12} height={3} rx={1.5} fill={WHITE} /></svg>,
            <svg key={1} width={44} height={44} viewBox="0 0 40 40"><rect x={6} y={8} width={28} height={7} rx={3} fill={WHITE} /><rect x={6} y={19} width={28} height={7} rx={3} fill={WHITE} /><rect x={6} y={30} width={18} height={6} rx={3} fill={WHITE} /></svg>,
            <Sparkle key={2} s={46} c={WHITE} />,
            <svg key={3} width={46} height={46} viewBox="0 0 40 40"><path d="M5 9 C11 7 16 8 20 11 C24 8 29 7 35 9 V32 C29 30 24 31 20 34 C16 31 11 30 5 32 Z" fill="none" stroke={WHITE} strokeWidth={4} strokeLinejoin="round" /></svg>][j];
          const cyc = Array.from({ length: 10 }, (_, n) => w("improve") + 0.3 + j * 0.16 + n * 0.6);
          const { st, ang } = flapAt(t, cyc);
          return <Flap key={j} ang={ang} r={48} style={{ position: "absolute", left: 540 + 330 * Math.cos(a) - 105, top: 1000 + 330 * Math.sin(a) - 105, width: 210, height: 210, opacity: p * (1 - toBubble), transform: `scale(${mix(0.4, 1, OUT(p))})` }}>
            <div style={{ width: 210, height: 210, borderRadius: 48, background: st % 2 ? BLUES : NAVY, border: `6px solid ${WHITE}`, boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center", transform: "scale(1.3)" }}>{ic}</div>
          </Flap>;
        })}
        {/* ===== the disc that becomes the bubble ===== */}
        {toRing > 0 && endOut < 1 && (
          <div style={{ position: "absolute", left: 540 - bw / 2, top: by - bh / 2, width: bw, height: bh, borderRadius: br, background: NAVY, opacity: c01(toRing * 1.5) * (1 - endOut), transform: `scale(${mix(0.6, 1, OUT(c01(toRing * 1.3))).toFixed(4)})`, overflow: "hidden" }}>
            {disc > 0.02 && (
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: c01(1 - toBubble * 2) }}>
                <svg width={200} height={200} viewBox="0 0 100 100" style={{ overflow: "visible" }}>
                  <circle cx={50} cy={50} r={44} fill="none" stroke="rgba(153,205,252,0.25)" strokeWidth={6} />
                  <circle cx={50} cy={50} r={44} fill="none" stroke={BLUE} strokeWidth={6} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - dcheck} transform="rotate(-90 50 50)" />
                  <path d="M28 52 L44 67 L73 35" fill="none" stroke={WHITE} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - c01((t - w("process") + 0.05) / 0.4)} />
                </svg>
              </div>
            )}
            {toBubble > 0.3 && (
              <div style={{ position: "absolute", inset: 0, opacity: c01((toBubble - 0.3) / 0.5) }}>
                <div style={{ position: "absolute", left: 50, top: 44, display: "flex", alignItems: "center", gap: 20 }}>
                  <div style={{ width: 84, height: 84, borderRadius: 24, background: WHITE, display: "flex", alignItems: "center", justifyContent: "center" }}><Img src={staticFile("brand/logo.png")} style={{ width: 70, height: 70, borderRadius: 14 }} /></div>
                  <div><div style={font(36, 800, WHITE)}>K.B</div><div style={{ display: "flex", gap: 8, marginTop: 10 }}>{[0, 1, 2].map((j) => <div key={j} style={{ width: 14, height: 14, borderRadius: 7, background: BLUE, opacity: 0.3 + 0.7 * Math.max(0, Math.sin(t * 7 - j * 0.9)) }} />)}</div></div>
                </div>
                {(() => { const { st, ang } = flapAt(t, [w("differently") - 0.1, w("message") + 0.1]); return (
                  <Flap ang={ang} r="36px 36px 36px 10px" style={{ position: "absolute", left: 50, right: 50, top: 170, height: 150 }}>
                    <div style={{ width: "100%", height: 150, borderRadius: "36px 36px 36px 10px", background: st === 2 ? BLUE : "#22406A", padding: "34px 36px", boxSizing: "border-box", display: "flex", flexDirection: "column", justifyContent: "center", gap: 20 }}>
                      {st === 0 ? <div style={{ display: "flex", gap: 14 }}>{[0, 1, 2].map((j) => <div key={j} style={{ width: 22, height: 22, borderRadius: 11, background: WHITE, opacity: 0.3 + 0.7 * Math.max(0, Math.sin(t * 7 - j * 0.9)) }} />)}</div>
                        : <><div style={{ width: 560, height: 22, borderRadius: 11, background: st === 2 ? NAVY : WHITE }} /><div style={{ width: 380, height: 22, borderRadius: 11, background: st === 2 ? NAVY : "rgba(255,255,255,0.6)" }} /></>}
                    </div>
                  </Flap>); })()}
              </div>
            )}
          </div>
        )}
        {/* the question, the button and the trick: fixed in place */}
        {toBubble > 0 && endOut < 1 && (
          <>
            <div style={{ position: "absolute", left: 0, right: 0, top: 300, textAlign: "center", opacity: 1 - endOut }}>
              {[["Do", "you", "work"], ["differently?"]].map((line, li) => (
                <div key={li} style={{ display: "flex", justifyContent: "center", gap: 24, height: 124, overflow: "hidden" }}>
                  {line.map((wd) => { const te = w(wd === "differently?" ? "differently" : wd.toLowerCase()) - 0.2; const { st, ang } = flapAt(t, [te]); return st ? <Flap key={wd} ang={ang} light style={{ display: "inline-block" }}><span style={{ ...font(li ? 112 : 100, 800, li ? BLUES : NAVY), display: "inline-block" }}>{wd}</span></Flap> : <span key={wd} style={{ ...font(li ? 112 : 100, 800, "transparent"), display: "inline-block" }}>{wd}</span>; })}
                </div>
              ))}
            </div>
            {(() => { const { st, ang } = flapAt(t, [w("message") - 0.6]); return st ? (
              <Flap ang={ang} light r={60} style={{ position: "absolute", left: 540 - 230, top: 1250, width: 460, height: 120, opacity: 1 - endOut }}>
                <div style={{ width: 460, height: 120, borderRadius: 60, background: lerpC(BLUE, NAVY, press), transform: `scale(${(1 - 0.07 * press).toFixed(3)})`, display: "flex", alignItems: "center", justifyContent: "center", gap: 18 }}>
                  <span style={font(48, 800, press > 0.5 ? WHITE : NAVY)}>Message us</span><Send s={44} c={press > 0.5 ? WHITE : NAVY} />
                </div>
              </Flap>) : null; })()}
            {(() => { const { st, ang } = flapAt(t, [w("share") - 0.15]); return st ? (
              <Flap ang={ang} light r={30} style={{ position: "absolute", left: 140, top: 1420, width: 800, height: 110, opacity: 1 - endOut }}>
                <div style={{ width: 800, height: 110, borderRadius: 30, background: ICE, border: `3px solid ${BLUES}`, boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center", gap: 16 }}>
                  <Sparkle s={44} c={BLUES} /><span style={font(40)}>We'll share a trick in return</span>
                </div>
              </Flap>) : null; })()}
          </>
        )}
        {(() => { const p = k(t, w("process") - 0.1, 0.45, INOUT) * (1 - toBubble); return p > 0 ? (
          <div style={{ position: "absolute", left: 0, right: 0, top: 1420, height: 90, overflow: "hidden", display: "flex", justifyContent: "center" }}>
            <span style={{ ...font(56, 800, NAVY), transform: `translateY(${((1 - p) * 90).toFixed(1)}px)`, display: "inline-block" }}>Double-checked by K.B</span>
          </div>) : null; })()}

        {/* ===== the progress track: five fixed steps ===== */}
        {trackO > 0 && (
          <div style={{ position: "absolute", left: 60, top: 1640, width: 960, height: 150, opacity: trackO }}>
            {["Contract", "Tasks", "AI agents", "Docs", "Check"].map((s, i) => {
              const { st, ang } = flapAt(t, [STEP_T[i], STEP_T[i + 1]]);
              return <Flap key={s} ang={ang} light={st !== 1} r={42} style={{ position: "absolute", left: i * 194, top: 0, width: 180, height: 84 }}>
                <div style={{ width: 180, height: 84, borderRadius: 42, background: ["#FFFFFF", NAVY, BLUE][st], border: `3px solid ${NAVY}`, boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center", transform: i === cur ? `scale(${(1 + 0.04 * Math.sin(t * 6)).toFixed(3)})` : undefined }}>
                  <span style={font(26, 800, st === 1 ? WHITE : NAVY)}>{s}</span>
                </div>
              </Flap>;
            })}
            <div style={{ position: "absolute", left: 0, top: 112, width: 960, height: 10, borderRadius: 5, background: "rgba(23,43,68,0.10)" }}>
              <div style={{ width: `${(c01((t - 0.9) / 19.9) * 100).toFixed(2)}%`, height: "100%", borderRadius: 5, background: NAVY }} />
            </div>
          </div>
        )}

        {/* ===== the end card: rings pulse out of the logo's tile in place; "Message us" under it ===== */}
        {t > 21.0 && (
          <>
            {[0, 1].map((j) => { const p = ((t - 21.4 - j * 0.5) % 1.0 + 1) % 1.0; return t > 21.4 + j * 0.5 ? <div key={j} style={{ position: "absolute", left: 540 - 160 - 120 * p, top: 900 - 160 - 120 * p, width: 320 + 240 * p, height: 320 + 240 * p, borderRadius: 70 + 50 * p, border: `5px solid ${BLUES}`, opacity: 1 - p, boxSizing: "border-box" }} /> : null; })}
            <div style={{ position: "absolute", left: 0, right: 0, top: 1180, height: 130, overflow: "hidden", display: "flex", justifyContent: "center" }}>
              <div style={{ transform: `translateY(${((1 - k(t, 21.5, 0.5, INOUT)) * 130).toFixed(1)}px)`, height: 120, padding: "0 60px", borderRadius: 60, background: NAVY, display: "flex", alignItems: "center", gap: 18 }}>
                <span style={font(52, 800, WHITE)}>Message us</span><Send s={46} c={BLUE} />
              </div>
            </div>
          </>
        )}
      </>}
      {layer !== "noLogo" && <LogoLayer track={LOGO} t={t} />}
    </AbsoluteFill>
  );
};
