// Blog loop: "Slow Candidate Intake? How Recruitment Agencies Automate the Admin" (K.B). 12 s, 1920×1080, 30 fps, silent,
// seamless (frame 359 flows into frame 0). Key action stays inside the centred 1080 square (x 420–1500) for a 1:1 crop.
// Story: problem (70 min, cluttered notes, half-filled record, an ineligible card) → screen first (form, Eligible, Book
// intake) → the call becomes data (waveform → connectors → Language / Availability / Location) → profile ready
// (Candidate PDF, 70 → 25 min) → a white dot (the K.B logo's full stop) lands where the timer began and becomes it again.
// Brief: one accent (sky blue #38C8FF), Montserrat, ease-in-out (0.65, 0, 0.35, 1), slides of 20–40 px, staggers of
// 80–120 ms, no bounce. On-screen words: only "70 min", "Eligible", "Book intake", "Language", "Availability",
// "Location", "Candidate PDF", "25 min" (the timer's number counts between 70 and 25).
import React, { useEffect, useState } from "react";
import { AbsoluteFill, continueRender, delayRender, Easing, useCurrentFrame } from "remotion";
import { fontsReady } from "../fonts";

export const BLOG_FPS = 30, BLOG_FRAMES = 360;
const K = { navy: "#293A51", navy2: "#3A4E69", off: "#F7F7F7", slate: "#E2E8F0", ink: "#252525", muted: "#49525B", sky: "#38C8FF", grey: "#96979B", grey2: "#B8C2CF", grey3: "#CDD5DF" };
const E = Easing.bezier(0.65, 0, 0.35, 1);
const c01 = (v: number) => Math.min(1, Math.max(0, v));
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const FONT = "Montserrat";

const Card: React.FC<{ x: number; y: number; w: number; h: number; o?: number; dx?: number; dy?: number; s?: number; r?: number; bg?: string; children?: React.ReactNode; style?: React.CSSProperties }> =
  ({ x, y, w, h, o = 1, dx = 0, dy = 0, s = 1, r = 16, bg = K.off, children, style }) => o <= 0.002 ? null : (
    <div style={{ position: "absolute", left: x - w / 2, top: y - h / 2, width: w, height: h, borderRadius: r, background: bg, opacity: Math.min(1, o * 1.7),
      transform: `translate(${dx.toFixed(2)}px, ${dy.toFixed(2)}px) scale(${s.toFixed(4)})`, boxShadow: "0 24px 50px -24px rgba(10,18,30,0.55)", overflow: "hidden", ...style }}>{children}</div>
  );
const Bar: React.FC<{ x: number; y: number; w: number; h?: number; c?: string; o?: number }> = ({ x, y, w, h = 12, c = K.grey3, o = 1 }) =>
  <div style={{ position: "absolute", left: x, top: y, width: Math.max(0, w), height: h, borderRadius: h / 2, background: c, opacity: o }} />;
const Tick: React.FC<{ size: number; s?: number; fill?: boolean }> = ({ size, s = 1, fill = true }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" style={{ display: "block", transform: `scale(${s.toFixed(4)})` }}>
    <circle cx="20" cy="20" r="19" fill={fill ? K.sky : "none"} stroke={K.sky} strokeWidth="2" />
    <path d="M11.5 20.5 L17.5 26.5 L28.5 14" fill="none" stroke={fill ? K.navy : K.sky} strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
// a cubic Bézier point
const bez = (p: number[][], u: number) => { const v = 1 - u; return [0, 1].map((i) => v * v * v * p[0][i] + 3 * v * v * u * p[1][i] + 3 * v * u * u * p[2][i] + u * u * u * p[3][i]); };

export const CandidateIntake: React.FC = () => {
  const [h] = useState(() => delayRender("fonts"));
  useEffect(() => { fontsReady.then(() => continueRender(h)); }, [h]);
  const t = useCurrentFrame() / BLOG_FPS;
  const k = (a: number, b: number) => E(c01((t - a) / (b - a)));

  /* ---------- the timer pill (the anchor at the top of the square) ---------- */
  const PX = 960, PY = 196, PW = 272, PH = 86;
  const pillOut = k(10.5, 11.0);                                   // leaves with the rest
  const morph = k(11.5, 11.88);                                    // the dot becomes the pill again
  const pillText = t < 11.3 ? 1 : k(11.66, 11.92);                // the text leaves with the pill, and returns with it
  const pillO = t < 10.5 ? 1 : t < 11.3 ? 1 - pillOut : morph > 0 ? 1 : 0;
  const pillDy = t < 10.5 ? 0 : t < 11.3 ? -24 * pillOut : 0;
  const mins = t < 11.3 ? Math.round(lerp(70, 25, k(8.9, 9.9))) : 70;   // still 25 while it leaves; 70 when it returns
  const pw = t < 11.3 ? PW : lerp(24, PW, morph), ph = t < 11.3 ? PH : lerp(24, PH, morph);
  const pulse = c01((t - 9.92) / 0.6);

  /* ---------- 1 · the problem (0 – 2.5 s) ---------- */
  const probOut = k(2.25, 2.75);
  const notes = [0, 1, 2, 3].map((i) => k(0.15 + 0.1 * i, 0.65 + 0.1 * i));
  const crmIn = k(0.45, 0.95);
  const rej = k(1.55, 2.15);                                      // the ineligible card slides out
  const cross = k(1.3, 1.55);
  const flick = (i: number) => (Math.floor(t * 9 + i * 3.7) % 5 === 0 ? 0.35 : 1);   // the hand-typed flicker
  const typed = (w: number, a: number, rate: number) => Math.min(w, Math.max(0, Math.floor(((t - a) * rate) / 18) * 18));

  /* ---------- 2 · screen first (2.5 – 5 s) ---------- */
  const formIn = k(2.6, 3.1), formOut = k(4.75, 5.15);
  const fieldFill = [0, 1, 2].map((i) => k(3.05 + 0.1 * i, 3.55 + 0.1 * i));
  const tick = k(3.85, 4.1), elig = k(3.9, 4.15), book = k(4.25, 4.5);

  /* ---------- 3 · the call becomes data (5 – 8 s) ---------- */
  const waveIn = k(5.0, 5.4), waveOut = k(8.0, 8.45);
  const crm2In = k(5.15, 5.6);
  const rows = ["Language", "Availability", "Location"];
  const WX = 700, WY = 600, CX2 = 1240, CY2 = 600, CW2 = 400, CH2 = 360;
  const rowY = (i: number) => CY2 - CH2 / 2 + 132 + i * 82;
  const paths = rows.map((_, i) => [[WX + 150, WY], [WX + 260, WY], [CX2 - CW2 / 2 - 110, rowY(i)], [CX2 - CW2 / 2 + 6, rowY(i)]]);
  const draw = rows.map((_, i) => k(5.55 + 0.1 * i, 6.05 + 0.1 * i));
  const flow = rows.map((_, i) => k(5.95 + 0.6 * i, 6.75 + 0.6 * i));
  const land = rows.map((_, i) => k(6.65 + 0.6 * i, 7.0 + 0.6 * i));
  const amp = c01((t - 5.2) / 0.4) * (1 - c01((t - 7.7) / 0.5));

  /* ---------- 4 · profile ready (8 – 10.5 s) ---------- */
  const squash = k(8.0, 8.8), docIn = k(8.5, 8.9), docTick = k(8.9, 9.15), docLabel = k(9.0, 9.35);
  const docOut = k(10.5, 11.0);

  /* ---------- 5 · the loop: the dot (10.5 – 12 s) ---------- */
  const travel = k(10.85, 11.5);
  const D0 = [960 + 70, 604 - 86], D1 = [PX, PY], DC = [1420, 330];
  const dU = travel, dV = 1 - dU;
  const dot = [dV * dV * D0[0] + 2 * dV * dU * DC[0] + dU * dU * D1[0], dV * dV * D0[1] + 2 * dV * dU * DC[1] + dU * dU * D1[1]];
  const dotO = t >= 10.85 && t < 11.52 ? c01((t - 10.85) / 0.15) : 0;

  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${K.navy} 0%, ${K.navy2} 100%)`, fontFamily: FONT, overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: "scale(1.14)", transformOrigin: "960px 560px" }}>
      {/* 1 · the problem: a cluttered stack of notes, a half-filled record, one ineligible card */}
      {[3, 2, 1, 0].map((i) => {
        const rot = [-7, 5, -3, 6][i], ox = [-30, 24, -8, 10][i], oy = [26, -18, 8, -6][i];
        const isRej = i === 0, p = notes[i];
        const o = p * (1 - probOut) * (isRej ? 1 - c01((t - 1.8) / 0.4) : 1);
        return (
          <Card key={i} x={720 + ox} y={600 + oy} w={300} h={196} r={14} o={o} bg={[K.slate, "#D5DCE6", "#C8D0DB", "#DCE2EA"][i]}
            dx={isRej ? -230 * rej : 0} dy={(1 - p) * 30 + 30 * probOut} style={{ transform: `translate(${isRej ? -230 * rej : 0}px, ${((1 - p) * 30 + 30 * probOut).toFixed(2)}px) rotate(${rot}deg)` }}>
            <Bar x={26} y={30} w={120} c={K.grey} />
            <Bar x={26} y={70} w={i === 0 ? typed(220, 0.6, 140) : 200 - i * 22} c={K.grey2} o={i === 0 ? flick(1) : 1} />
            <Bar x={26} y={102} w={i === 0 ? typed(170, 0.9, 120) : 150 - i * 14} c={K.grey2} o={i === 0 ? flick(2) : 1} />
            <Bar x={26} y={134} w={i === 0 ? typed(110, 1.1, 110) : 90} c={K.grey2} o={i === 0 ? flick(3) : 1} />
            {isRej && cross > 0 && (
              <div style={{ position: "absolute", right: 16, top: 14, width: 40, height: 40, borderRadius: 20, background: K.grey, opacity: cross, transform: `scale(${lerp(0.6, 1, cross)})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="20" height="20" viewBox="0 0 20 20"><path d="M5 5 L15 15 M15 5 L5 15" stroke="#FFFFFF" strokeWidth="2.6" strokeLinecap="round" /></svg>
              </div>
            )}
          </Card>
        );
      })}
      <Card x={1215} y={600} w={400} h={330} o={crmIn * (1 - probOut)} dy={(1 - crmIn) * 30 + 30 * probOut}>
        <Bar x={30} y={30} w={150} h={16} c={K.grey2} />
        {[0, 1, 2, 3].map((r) => (
          <React.Fragment key={r}>
            <Bar x={30} y={88 + r * 56} w={78} h={10} c={K.grey3} />
            {r < 2
              ? <Bar x={130} y={84 + r * 56} w={r === 0 ? typed(200, 0.8, 160) : typed(150, 1.25, 150)} h={18} c={K.grey} o={flick(4 + r)} />
              : <div style={{ position: "absolute", left: 130, top: 78 + r * 56, width: 220, height: 30, borderRadius: 8, border: `1.5px dashed ${K.grey3}` }} />}
          </React.Fragment>
        ))}
        {/* the hand-typing caret */}
        <div style={{ position: "absolute", left: 130 + (t < 1.25 ? typed(200, 0.8, 160) : typed(150, 1.25, 150)) + 4, top: t < 1.25 ? 80 : 136, width: 2, height: 26, background: K.muted, opacity: Math.floor(t * 4) % 2 === 0 ? 1 : 0 }} />
      </Card>

      {/* 2 · screen first: the candidate form */}
      <Card x={960} y={610} w={540} h={430} o={formIn * (1 - formOut)} dy={(1 - formIn) * 36} dx={-40 * formOut}>
        <Bar x={40} y={40} w={170} h={16} c={K.grey2} />
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ position: "absolute", left: 40, top: 84 + i * 68, width: 460, height: 50, borderRadius: 10, background: K.slate }}>
            <Bar x={18} y={19} w={[260, 200, 300][i] * fieldFill[i]} h={12} c={K.muted} />
          </div>
        ))}
        <div style={{ position: "absolute", left: 40, top: 300, display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 38, height: 38, opacity: tick, transform: `scale(${lerp(0.6, 1, tick)})` }}><Tick size={38} /></div>
          <span style={{ fontSize: 30, fontWeight: 600, color: K.ink, opacity: elig, transform: `translateX(${(1 - elig) * 20}px)` }}>Eligible</span>
        </div>
        <div style={{ position: "absolute", right: 40, top: 292, height: 56, padding: "0 30px", borderRadius: 28, display: "flex", alignItems: "center",
          background: `rgba(56,200,255,${book})`, border: `1.5px solid ${book > 0.5 ? K.sky : "#C3CCD8"}`, color: book > 0.5 ? K.navy : K.muted, fontSize: 26, fontWeight: 700 }}>Book intake</div>
      </Card>

      {/* 3 · the call becomes data: waveform → connectors → the record */}
      <Card x={WX} y={WY} w={300} h={200} r={18} o={waveIn * (1 - waveOut)} dy={(1 - waveIn) * 30} bg="rgba(41,58,81,0.85)"
        style={{ border: "1px solid rgba(255,255,255,0.14)", backdropFilter: "blur(10px)" }}>
        <svg width={300} height={200} style={{ position: "absolute", left: 0, top: 0 }}>
          {Array.from({ length: 24 }, (_, i) => {
            const hgt = 10 + amp * (18 + 46 * Math.abs(Math.sin(t * 5.2 + i * 0.7) * Math.cos(t * 2.3 + i * 0.31)));
            return <rect key={i} x={36 + i * 9.6} y={100 - hgt / 2} width={5} height={hgt} rx={2.5} fill={K.sky} opacity={0.55 + 0.45 * amp} />;
          })}
        </svg>
      </Card>
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        {paths.map((p, i) => {
          const L = 520, d = `M${p[0][0]} ${p[0][1]} C${p[1][0]} ${p[1][1]} ${p[2][0]} ${p[2][1]} ${p[3][0]} ${p[3][1]}`;
          return <path key={i} d={d} fill="none" stroke={K.sky} strokeWidth={2} strokeLinecap="round" strokeDasharray={L} strokeDashoffset={L * (1 - draw[i])} opacity={(1 - waveOut) * 0.9} />;
        })}
        {/* thin lines of text peeling off the waveform and flowing along each connector */}
        {paths.map((p, i) => {
          const u = flow[i];
          if (u <= 0 || u >= 1) return null;
          return [0, 1, 2].map((j) => {
            const uu = c01(u - j * 0.07), [x, y] = bez(p, uu);
            return <rect key={`${i}-${j}`} x={x - 22 + j * 4} y={y - 9 + j * 6} width={44 - j * 10} height={3} rx={1.5} fill="#FFFFFF" opacity={0.9 * Math.sin(Math.PI * Math.min(1, u * 1.25)) * (1 - j * 0.2)} />;
          });
        })}
      </svg>
      <Card x={CX2 + lerp(0, 960 - CX2, squash)} y={CY2 + lerp(0, 604 - CY2, squash)} w={CW2} h={CH2} o={crm2In * (1 - docIn) * (1 - waveOut * 0)} dy={(1 - crm2In) * 30} s={lerp(1, 0.36, squash)}>
        <div style={{ opacity: 1 - c01((t - 8.0) / 0.35) }}>
          <Bar x={34} y={34} w={160} h={16} c={K.grey2} />
          {rows.map((label, i) => (
            <div key={label} style={{ position: "absolute", left: 34, top: rowY(i) - (CY2 - CH2 / 2) - 26, width: CW2 - 68 }}>
              <div style={{ fontSize: 22, fontWeight: 600, color: K.muted, letterSpacing: "0.01em" }}>{label}</div>
              <div style={{ marginTop: 8, height: 34, borderRadius: 8, background: K.slate, position: "relative", boxShadow: land[i] > 0 && land[i] < 1 ? `0 0 0 ${2 * (1 - land[i])}px rgba(56,200,255,0.8)` : undefined }}>
                <Bar x={14} y={11} w={[150, 210, 120][i] * land[i]} h={12} c={K.ink} />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* 4 · profile ready: the record becomes the Candidate PDF */}
      {docIn > 0 && (
        <div style={{ position: "absolute", left: 960 - 70, top: 604 - 88, width: 140, height: 176, opacity: docIn * (1 - docOut), transform: `translateY(${(1 - docIn) * 20 + 30 * docOut}px)` }}>
          <svg width={140} height={176} viewBox="0 0 140 176" style={{ display: "block", filter: "drop-shadow(0 18px 24px rgba(10,18,30,0.45))" }}>
            <path d="M14 0 H100 L140 40 V162 A14 14 0 0 1 126 176 H14 A14 14 0 0 1 0 162 V14 A14 14 0 0 1 14 0 Z" fill={K.off} />
            <path d="M100 0 V28 A12 12 0 0 0 112 40 H140 Z" fill={K.slate} />
            <rect x="20" y="62" width="80" height="9" rx="4.5" fill={K.grey2} /><rect x="20" y="86" width="100" height="9" rx="4.5" fill={K.grey3} />
            <rect x="20" y="110" width="88" height="9" rx="4.5" fill={K.grey3} /><rect x="20" y="134" width="64" height="9" rx="4.5" fill={K.grey3} />
          </svg>
          <div style={{ position: "absolute", right: -18, top: -18, opacity: docTick, transform: `scale(${lerp(0.6, 1, docTick)})` }}><Tick size={48} /></div>
        </div>
      )}
      <div style={{ position: "absolute", left: 0, right: 0, top: 712, textAlign: "center", fontSize: 32, fontWeight: 600, color: "#FFFFFF",
        opacity: docLabel * (1 - docOut), transform: `translateY(${(1 - docLabel) * 24 + 30 * docOut}px)` }}>Candidate PDF</div>

      {/* the timer pill (and its one accent pulse) */}
      {pulse > 0 && pulse < 1 && t < 10.6 && (
        <div style={{ position: "absolute", left: PX - PW / 2, top: PY - PH / 2, width: PW, height: PH, borderRadius: PH / 2, border: `2px solid ${K.sky}`,
          opacity: 0.8 * (1 - pulse), transform: `scale(${1 + 0.35 * E(pulse)})` }} />
      )}
      {pillO > 0.002 && (
        <div style={{ position: "absolute", left: PX - pw / 2, top: PY - ph / 2 + pillDy, width: pw, height: ph, borderRadius: ph / 2, opacity: pillO,
          background: t >= 11.3 && morph < 1 ? `rgba(${Math.round(lerp(255, 41, morph))},${Math.round(lerp(255, 58, morph))},${Math.round(lerp(255, 81, morph))},${lerp(1, 0.85, morph)})` : "rgba(41,58,81,0.85)",
          border: `1.5px solid rgba(56,200,255,${t >= 11.3 ? 0.55 * morph : 0.55 + 0.45 * Math.sin(Math.PI * c01((t - 8.9) / 1.0)) * (t < 10.5 ? 1 : 0)})`,
          backdropFilter: "blur(10px)", display: "flex", alignItems: "center", justifyContent: "center", gap: 14, boxShadow: "0 18px 40px -20px rgba(5,10,20,0.6)", overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, opacity: pillText }}>
            <svg width="34" height="34" viewBox="0 0 34 34"><circle cx="17" cy="17" r="14.5" fill="none" stroke={K.sky} strokeWidth="2.5" />
              <path d={`M17 17 L17 8.5`} stroke={K.sky} strokeWidth="2.5" strokeLinecap="round" transform={`rotate(${30 * t - 360 * k(8.9, 9.9)} 17 17)`} />
              <path d="M17 17 L23 20" stroke={K.sky} strokeWidth="2.5" strokeLinecap="round" /></svg>
            <span style={{ fontSize: 44, fontWeight: 700, color: K.sky, fontVariantNumeric: "tabular-nums", letterSpacing: "-0.01em" }}>{mins} min</span>
          </div>
        </div>
      )}
      {/* the white dot travelling back to where the timer began */}
      {dotO > 0 && <div style={{ position: "absolute", left: dot[0] - 12, top: dot[1] - 12, width: 24, height: 24, borderRadius: 12, background: "#FFFFFF", opacity: dotO, boxShadow: "0 0 0 6px rgba(255,255,255,0.08)" }} />}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
