// K.B process reel v3 (1080x1920, 60 fps, 23 s): ONE LINE. A single navy line draws the whole process live on a white
// page; nothing changes place. It draws the contract and its two signatures, the scope becomes a task list in the
// project tools, AI agents work through the tasks and validate them, the documentation is rewritten, the line closes
// into the process loop with K.B's double-check, then a chat bubble: "Message us". The motion is the drawing itself and
// shapes that fill the moment they are complete (no flips, no particles, no camera).
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, F, FPS, OUT, INOUT, IN, k, c01, useFont, Layer, LogoKey, LogoLayer } from "./kit";
import { w } from "./timing";

const NAVY = C.navy, BLUE = C.blue, BLUES = C.blueS, ICE = C.ice, WHITE = "#FFFFFF", MUTED = "#8A97A8";
const SW = 11; // the line's weight

/** a drawn path: p = drawn share 0..1, e = erased share from the start 0..1 (pathLength 1) */
const D: React.FC<{ d: string; p: number; e?: number; c?: string; w_?: number; fill?: string }> = ({ d, p, e = 0, c = NAVY, w_ = SW, fill = "none" }) => {
  const vis = Math.max(0, c01(p) - c01(e));
  if (vis <= 0.0005) return null;
  return <path d={d} fill={fill} stroke={c} strokeWidth={w_} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={`${vis} 2`} strokeDashoffset={-c01(e)} />;
};
/** a rounded rectangle as one path, starting at the top-left and running clockwise */
const rr = (x: number, y: number, wd: number, h: number, r: number) =>
  `M ${x + r} ${y} H ${x + wd - r} A ${r} ${r} 0 0 1 ${x + wd} ${y + r} V ${y + h - r} A ${r} ${r} 0 0 1 ${x + wd - r} ${y + h} H ${x + r} A ${r} ${r} 0 0 1 ${x} ${y + h - r} V ${y + r} A ${r} ${r} 0 0 1 ${x + r} ${y}`;
const circ = (cx: number, cy: number, r: number, a0 = -90) => {
  const P = (a: number) => [cx + r * Math.cos((a * Math.PI) / 180), cy + r * Math.sin((a * Math.PI) / 180)];
  const [x0, y0] = P(a0), [x1, y1] = P(a0 + 180);
  return `M ${x0} ${y0} A ${r} ${r} 0 0 1 ${x1} ${y1} A ${r} ${r} 0 0 1 ${x0} ${y0}`;
};
const T: React.FC<{ x: number; y: number; size: number; o: number; c?: string; anchor?: "start" | "middle" | "end"; weight?: number; children: React.ReactNode }> = ({ x, y, size, o, c = NAVY, anchor = "start", weight = 800, children }) =>
  o <= 0.001 ? null : <text x={x} y={y} fontFamily={F} fontSize={size} fontWeight={weight} fill={c} textAnchor={anchor} letterSpacing={-size * 0.03} opacity={o}>{children}</text>;
const sparkle = (cx: number, cy: number, s: number) => `M ${cx} ${cy - s} C ${cx + s * 0.08} ${cy - s * 0.3} ${cx + s * 0.3} ${cy - s * 0.08} ${cx + s} ${cy} C ${cx + s * 0.3} ${cy + s * 0.08} ${cx + s * 0.08} ${cy + s * 0.3} ${cx} ${cy + s} C ${cx - s * 0.08} ${cy + s * 0.3} ${cx - s * 0.3} ${cy + s * 0.08} ${cx - s} ${cy} C ${cx - s * 0.3} ${cy - s * 0.08} ${cx - s * 0.08} ${cy - s * 0.3} ${cx} ${cy - s} Z`;
const checkD = (cx: number, cy: number, s: number) => `M ${cx - s * 0.5} ${cy + s * 0.02} L ${cx - s * 0.14} ${cy + s * 0.36} L ${cx + s * 0.52} ${cy - s * 0.34}`;

// ------------------------------------------------------------------ the headline, one per beat (fades in place)
const HEADS: [number, string][] = [[w("signed") - 0.05, "Signed contract"], [w("clear") - 0.05, "Clear tasks"], [w("agents") - 0.15, "AI agents"], [w("validate") - 0.05, "Validated"],
  [w("update") - 0.05, "Update documentation"], [w("improve") - 0.05, "Improve the process"], [w("do") - 0.25, ""]];

/** a band of light that sweeps across a filled shape (clipPath id) every `period` s from t0 */
const Sweep: React.FC<{ t: number; t0: number; id: string; x: number; w_: number; y: number; h: number; period?: number; o?: number }> = ({ t, t0, id, x, w_, y, h, period = 1.3, o = 1 }) => {
  if (t < t0 || o <= 0) return null;
  const ph = ((t - t0) % period) / period;
  const bx = x - 180 + ph * (w_ + 360);
  return <g clipPath={`url(#${id})`} opacity={o}><rect x={bx} y={y - 40} width={110} height={h + 80} fill="#FFFFFF" opacity={0.38} transform={`skewX(-18)`} style={{ transformOrigin: `${bx}px ${y}px` }} /></g>;
};

export const Reel: React.FC<{ layer: Layer }> = ({ layer }) => {
  const ok = useFont();
  const t = useCurrentFrame() / FPS;
  if (!ok) return null;
  const fl = (t0: number, d = 0.3) => k(t, t0, d, OUT);            // a fill floods in
  const dr = (t0: number, d: number) => k(t, t0, d, INOUT);           // a line draws
  const er = (t0: number, d = 0.55) => k(t, t0, d, INOUT);            // a line erases (from its start)

  // ---------------- 1. the contract
  const DOC = { x: 250, y: 520, w: 580, h: 720 };
  const cIn = dr(1.0, 0.85), cOut = er(w("into") - 0.05, 0.6);
  const title = "Software development", typed = Math.round(title.length * c01((t - w("software")) / 0.75));
  const scopeY = [700, 770, 840], scopeW = [440, 380, 470];
  const sc = (i: number) => dr(1.85 + i * 0.18, 0.45);
  const scopeHi = k(t, w("scope") - 0.05, 0.35);
  const sig1 = dr(w("signed") - 0.12, 0.55), sig2 = dr(w("contract") + 0.05, 0.5);
  const sealC = dr(w("contract") + 0.45, 0.3), sealF = fl(w("contract") + 0.65), sealK = dr(w("contract") + 0.75, 0.3);
  const docF = fl(w("contract") + 0.7, 0.4) * (1 - k(t, w("into") - 0.1, 0.35));

  // ---------------- 2. the tasks in the project tools
  const RY = (i: number) => 640 + i * 136, RN = 5, RW = [420, 360, 450, 330, 400];
  const rowIn = (i: number) => dr(w("into") + 0.1 + i * 0.15, 0.5);
  const frameIn = dr(w("project") - 0.25, 0.7), headF = fl(w("project") + 0.1, 0.35);
  const boardOut = er(w("then") - 0.05, 0.6), boardFade = k(t, w("then") - 0.05, 0.4);
  // ---------------- 3. the AI agents
  const agC = (i: number) => dr(w("agents") - 0.1 + i * 0.08, 0.3), agF = (i: number) => fl(w("agents") + 0.1 + i * 0.08);
  const work = (i: number) => k(t, w("carry") + i * 0.18, 1.0, INOUT);
  const val = (i: number) => fl(w("validate") + i * 0.11, 0.28), valK = (i: number) => dr(w("validate") + 0.12 + i * 0.11, 0.25);
  // ---------------- 4. the documentation, then the loop
  const pIn = dr(w("then") + 0.1, 0.8), pOut = er(w("improve") - 0.25, 0.6);
  const dl = (i: number) => dr(w("then") + 0.6 + i * 0.1, 0.4);
  const rw = (i: number) => k(t, w("update") - 0.05 + i * 0.16, 0.4, INOUT);
  const add = (i: number) => dr(w("documentation") + 0.25 + i * 0.15, 0.4);
  const docF2 = fl(w("then") + 0.8, 0.4) * (1 - k(t, w("improve") - 0.3, 0.3));
  const LOOP = { cx: 540, cy: 930, r: 330 };
  const lIn = dr(w("improve") - 0.1, 0.9), lOut = er(w("do") - 0.3, 0.6), lFade = k(t, w("do") - 0.3, 0.4);
  const nF = (j: number) => fl(w("improve") + 0.15 + j * 0.2, 0.3);
  const ckC = dr(w("process") - 0.25, 0.3), ckF = fl(w("process") - 0.05), ckK = dr(w("process") + 0.05, 0.3);
  // ---------------- 5. the chat
  const bIn = dr(w("do") - 0.1, 0.7), bF = fl(w("do") + 0.45, 0.35);
  const pillIn = dr(w("message") - 0.55, 0.4), pillF = fl(w("message") - 0.2, 0.3);
  const press = k(t, w("message") - 0.05, 0.1) * (1 - k(t, w("message") + 0.2, 0.3));
  const sent = (i: number) => dr(w("message") + 0.2 + i * 0.2, 0.4);
  const trIn = dr(w("share") - 0.15, 0.45), trF = fl(w("share") + 0.15, 0.3);
  const ctaOut = k(t, 20.75, 0.45, IN);
  // ---------------- end card
  const tileIn = dr(20.95, 0.55), endPill = dr(21.45, 0.4), endPillF = fl(21.75, 0.3);

  const LOGO: LogoKey[] = [
    { t: 0, x: 540, y: 150, size: 150, o: 0 }, { t: 0.25, x: 540, y: 150, size: 150, o: 0 }, { t: 0.75, x: 540, y: 150, size: 170, o: 1 },
    { t: 20.75, x: 540, y: 150, size: 170, o: 1 }, { t: 21.0, x: 540, y: 150, size: 170, o: 0 }, { t: 21.05, x: 540, y: 860, size: 380, o: 0 },
    { t: 21.6, x: 540, y: 860, size: 420, o: 1 }, { t: 23, x: 540, y: 860, size: 420, o: 1 },
  ];

  return (
    <AbsoluteFill style={{ background: layer === "logoOnly" ? "transparent" : WHITE }}>
      {layer !== "logoOnly" && (
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
          <defs>
            <clipPath id="cHead"><path d={`M 130 ${470 + 36} A 36 36 0 0 1 166 470 H 914 A 36 36 0 0 1 950 506 V 570 H 130 Z`} /></clipPath>
            <clipPath id="cSeal"><circle cx={DOC.x + DOC.w - 20} cy={DOC.y + 20} r={68} /></clipPath>
            <clipPath id="cAg">{Array.from({ length: RN }, (_, i) => <circle key={i} cx={850} cy={RY(i)} r={40} />)}{Array.from({ length: RN }, (_, i) => <rect key={"b" + i} x={180} y={RY(i) - 32} width={64} height={64} rx={16} />)}</clipPath>
            <clipPath id="cDoc"><rect x={DOC.x} y={DOC.y} width={DOC.w} height={DOC.h} rx={36} /></clipPath>
            <clipPath id="cCk"><circle cx={LOOP.cx} cy={LOOP.cy} r={130} />{[0, 1, 2, 3].map((j) => { const a = (-90 + j * 90 + 45) * Math.PI / 180; return <circle key={j} cx={LOOP.cx + LOOP.r * Math.cos(a)} cy={LOOP.cy + LOOP.r * Math.sin(a)} r={70} />; })}</clipPath>
            <clipPath id="cBub"><path d={rr(140, 620, 800, 380, 50)} /></clipPath>
            <clipPath id="cPill"><rect x={290} y={1130} width={500} height={130} rx={65} /><rect x={140} y={1340} width={800} height={120} rx={30} /></clipPath>
            <clipPath id="cEnd"><rect x={290} y={1160} width={500} height={130} rx={65} /></clipPath>
          </defs>
          {/* the headline */}
          {HEADS.map(([t0, txt], i) => {
            if (!txt) return null;
            const o = k(t, t0, 0.4) * (1 - k(t, HEADS[i + 1][0] - 0.05, 0.3));
            return <T key={i} x={540} y={340} size={78} o={o} anchor="middle">{txt}</T>;
          })}

          {/* ========== 1. the contract ========== */}
          {cOut < 1 && <>
            <rect x={DOC.x} y={DOC.y} width={DOC.w} height={DOC.h} rx={36} fill={ICE} opacity={docF} />
            <D d={`M 110 ${DOC.y} H ${DOC.x + 36}`} p={dr(0.8, 0.25)} e={cOut > 0 ? 1 : er(1.05, 0.3)} c={BLUE} w_={SW} />
            <D d={rr(DOC.x, DOC.y, DOC.w, DOC.h, 36)} p={cIn} e={cOut} />
            <T x={DOC.x + 40} y={DOC.y + 92} size={42} o={1 - cOut}>{title.slice(0, typed)}</T>
            {t > w("software") && typed < title.length && Math.floor(t * 3) % 2 === 0 && <rect x={DOC.x + 40 + typed * 22.5} y={DOC.y + 58} width={4} height={44} fill={BLUES} />}
            {scopeY.map((y, i) => <D key={i} d={`M ${DOC.x + 40} ${y} H ${DOC.x + 40 + scopeW[i]}`} p={sc(i)} e={k(t, w("into") - 0.1 + i * 0.05, 0.3)} c={scopeHi > 0 ? BLUES : "#C3CCD8"} w_={SW + 14 * scopeHi} />)}
            {/* the two signatures and their lines */}
            {[0, 1].map((j) => {
              const x0 = DOC.x + 40 + j * 270, base = DOC.y + 590, sp = j ? sig2 : sig1;
              return <g key={j} opacity={1 - cOut}>
                <D d={`M ${x0} ${base} H ${x0 + 230}`} p={dr(2.2 + j * 0.15, 0.4)} c="#C3CCD8" w_={4} />
                <D d={j ? `M ${x0 + 6} ${base - 20} C ${x0 + 30} ${base - 80} ${x0 + 52} ${base - 74} ${x0 + 60} ${base - 34} C ${x0 + 70} ${base} ${x0 + 92} ${base - 64} ${x0 + 120} ${base - 48} C ${x0 + 150} ${base - 30} ${x0 + 160} ${base - 16} ${x0 + 190} ${base - 40} C ${x0 + 206} ${base - 54} ${x0 + 216} ${base - 30} ${x0 + 226} ${base - 36}`
                  : `M ${x0 + 6} ${base - 30} C ${x0 + 26} ${base - 70} ${x0 + 44} ${base - 6} ${x0 + 70} ${base - 46} C ${x0 + 96} ${base - 84} ${x0 + 108} ${base - 20} ${x0 + 134} ${base - 40} C ${x0 + 160} ${base - 60} ${x0 + 180} ${base - 22} ${x0 + 210} ${base - 44}`} p={sp} />
                <T x={x0} y={base + 44} size={30} o={k(t, 2.4 + j * 0.15, 0.4)} c={MUTED} weight={700}>{j ? "K.B" : "Client"}</T>
              </g>;
            })}
            {/* the seal */}
            <circle cx={DOC.x + DOC.w - 20} cy={DOC.y + 20} r={68} fill={BLUE} opacity={sealF * (1 - cOut)} />
            <D d={circ(DOC.x + DOC.w - 20, DOC.y + 20, 68)} p={sealC} e={cOut} />
            <D d={checkD(DOC.x + DOC.w - 20, DOC.y + 20, 70)} p={sealK} e={cOut} w_={12} />
            <Sweep t={t} t0={w("contract") + 0.7} id="cSeal" x={DOC.x + DOC.w - 90} w_={140} y={DOC.y - 50} h={140} period={0.9} o={1 - cOut} />
            <Sweep t={t} t0={2.0} id="cDoc" x={DOC.x} w_={DOC.w} y={DOC.y} h={DOC.h} period={1.6} o={docF * 0.6 * (1 - cOut)} />
          </>}

          {/* ========== 2./3. the task list in the project tools, the AI agents ========== */}
          {rowIn(0) > 0 && boardOut < 1 && <>
            <D d={rr(130, 470, 820, 870, 36)} p={frameIn} e={boardOut} />
            <path d={`M 130 ${470 + 36} A 36 36 0 0 1 ${166} 470 H ${914} A 36 36 0 0 1 950 ${506} V 570 H 130 Z`} fill={NAVY} opacity={headF * (1 - boardFade)} />
            <T x={180} y={540} size={40} o={headF * (1 - boardFade)} c={WHITE}>Project tools</T>
            <D d={rr(860, 500, 48, 42, 8)} p={headF} e={boardOut} c={BLUE} w_={5} />
            {Array.from({ length: RN }, (_, i) => {
              const y = RY(i), p = rowIn(i), v = val(i), wk = work(i);
              return <g key={i} opacity={1 - boardFade}>
                {/* checkbox: outline, then validated (fills navy, a white check) */}
                <rect x={180} y={y - 32} width={64} height={64} rx={16} fill={NAVY} opacity={v} />
                <D d={rr(180, y - 32, 64, 64, 16)} p={p} e={boardOut} />
                <D d={checkD(212, y, 46)} p={valK(i)} c={WHITE} w_={9} />
                {/* the task: a line, which fills as the agent carries it out */}
                <D d={`M 290 ${y} H ${290 + RW[i]}`} p={dr(w("into") + 0.25 + i * 0.15, 0.5)} e={boardOut} c="#C3CCD8" w_={SW} />
                <D d={`M 290 ${y} H ${290 + RW[i]}`} p={wk} e={boardOut} c={v > 0.5 ? NAVY : BLUES} w_={22} />
                {/* the agent on this task: a circle that floods navy, a white spark; it spins while working */}
                <circle cx={850} cy={y} r={40} fill={NAVY} opacity={agF(i)} />
                <D d={circ(850, y, 40)} p={agC(i)} e={boardOut} />
                {agF(i) > 0 && <path d={sparkle(850, y, 22)} fill={v > 0.5 ? BLUE : WHITE} opacity={agF(i)} transform={wk > 0 && wk < 1 ? `rotate(${(t * 240) % 360} 850 ${y})` : undefined} />}
                {wk > 0 && wk < 1 && <circle cx={850} cy={y} r={54} fill="none" stroke={BLUES} strokeWidth={6} strokeDasharray="40 300" strokeDashoffset={-t * 400} strokeLinecap="round" />}
              </g>;
            })}
            <T x={850} y={1300} size={30} o={k(t, w("agents"), 0.4) * (1 - boardFade)} anchor="middle" c={MUTED} weight={700}>AI agents</T>
            <Sweep t={t} t0={w("project") + 0.3} id="cHead" x={130} w_={820} y={470} h={100} period={1.2} o={headF * (1 - boardFade)} />
            <Sweep t={t} t0={w("agents") + 0.3} id="cAg" x={160} w_={760} y={RY(0) - 50} h={RY(RN - 1) - RY(0) + 100} period={1.0} o={1 - boardFade} />
          </>}

          {/* ========== 4. the documentation ========== */}
          {pIn > 0 && pOut < 1 && <>
            <rect x={DOC.x} y={DOC.y} width={DOC.w} height={DOC.h} rx={36} fill={ICE} opacity={docF2} />
            <D d={rr(DOC.x, DOC.y, DOC.w, DOC.h, 36)} p={pIn} e={pOut} />
            <path d={`M ${DOC.x + 40} ${DOC.y + 60} C ${DOC.x + 60} ${DOC.y + 52} ${DOC.x + 74} ${DOC.y + 54} ${DOC.x + 84} ${DOC.y + 64} C ${DOC.x + 94} ${DOC.y + 54} ${DOC.x + 108} ${DOC.y + 52} ${DOC.x + 128} ${DOC.y + 60} V ${DOC.y + 104} C ${DOC.x + 108} ${DOC.y + 96} ${DOC.x + 94} ${DOC.y + 98} ${DOC.x + 84} ${DOC.y + 108} C ${DOC.x + 74} ${DOC.y + 98} ${DOC.x + 60} ${DOC.y + 96} ${DOC.x + 40} ${DOC.y + 104} Z`}
              fill="none" stroke={NAVY} strokeWidth={6} strokeLinejoin="round" opacity={k(t, w("then") + 0.5, 0.4) * (1 - pOut)} />
            <T x={DOC.x + 150} y={DOC.y + 98} size={42} o={k(t, w("then") + 0.55, 0.4) * (1 - pOut)}>Documentation</T>
            {[0, 1, 2, 3, 4].map((i) => {
              const y = DOC.y + 200 + i * 80, ww = [460, 380, 480, 340, 420][i];
              const re = i === 1 || i === 3 ? rw(i) : 0;
              return <g key={i}>
                <D d={`M ${DOC.x + 40} ${y} H ${DOC.x + 40 + ww}`} p={dl(i)} e={Math.max(re, pOut)} c="#C3CCD8" />
                {(i === 1 || i === 3) && <D d={`M ${DOC.x + 40} ${y} H ${DOC.x + 40 + ww - 30}`} p={re} e={pOut} c={BLUES} w_={20} />}
              </g>;
            })}
            {[0, 1].map((i) => <D key={i} d={`M ${DOC.x + 40} ${DOC.y + 600 + i * 50} H ${DOC.x + 40 + [400, 300][i]}`} p={add(i)} e={pOut} c={NAVY} w_={14} />)}
            <Sweep t={t} t0={w("update") - 0.2} id="cDoc" x={DOC.x} w_={DOC.w} y={DOC.y} h={DOC.h} period={1.2} o={docF2 * (1 - pOut)} />
          </>}

          {/* ========== 4. the loop and the double-check ========== */}
          {lIn > 0 && lOut < 1 && <>
            <D d={circ(LOOP.cx, LOOP.cy, LOOP.r)} p={lIn} e={lOut} w_={10} />
            {[0, 1, 2, 3].map((j) => {
              const a = (-90 + j * 90 + 45) * Math.PI / 180, x = LOOP.cx + LOOP.r * Math.cos(a), y = LOOP.cy + LOOP.r * Math.sin(a);
              const o = nF(j) * (1 - lFade);
              return <g key={j}>
                <circle cx={x} cy={y} r={70} fill={WHITE} opacity={nF(j) > 0 ? 1 - lFade : 0} />
                <circle cx={x} cy={y} r={70} fill={NAVY} opacity={o} />
                <D d={circ(x, y, 70)} p={dr(w("improve") + j * 0.2, 0.35)} e={lOut} />
                {o > 0 && (j === 2 ? <path d={sparkle(x, y, 32)} fill={WHITE} opacity={o} /> : <path d={[`M ${x - 16} ${y - 26} H ${x + 16} V ${y + 26} H ${x - 16} Z M ${x - 8} ${y - 10} H ${x + 8}`, `M ${x - 24} ${y - 16} H ${x + 24} M ${x - 24} ${y} H ${x + 24} M ${x - 24} ${y + 16} H ${x + 8}`, "", `M ${x - 26} ${y - 18} C ${x - 12} ${y - 22} ${x - 4} ${y - 20} ${x} ${y - 14} C ${x + 4} ${y - 20} ${x + 12} ${y - 22} ${x + 26} ${y - 18} V ${y + 22} C ${x + 12} ${y + 18} ${x + 4} ${y + 20} ${x} ${y + 26} C ${x - 4} ${y + 20} ${x - 12} ${y + 18} ${x - 26} ${y + 22} Z`][j]} fill="none" stroke={WHITE} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" opacity={o} />)}
              </g>;
            })}
            <circle cx={LOOP.cx} cy={LOOP.cy} r={130} fill={BLUE} opacity={ckF * (1 - lFade)} />
            <D d={circ(LOOP.cx, LOOP.cy, 130)} p={ckC} e={lOut} />
            <D d={checkD(LOOP.cx, LOOP.cy, 130)} p={ckK} e={lOut} w_={16} />
            <T x={540} y={1400} size={56} o={k(t, w("process") - 0.05, 0.4) * (1 - lFade)} anchor="middle">Double-checked by K.B</T>
            <Sweep t={t} t0={w("improve") + 0.4} id="cCk" x={130} w_={820} y={530} h={800} period={1.1} o={1 - lFade} />
          </>}

          {/* ========== 5. the chat: Do you work differently? Message us ========== */}
          {t > w("do") - 0.3 && ctaOut < 1 && <>
            {[["Do you work", 0, w("do") - 0.2], ["differently?", 1, w("differently") - 0.15]].map(([txt, li, t0]) => (
              <T key={String(li)} x={540} y={(li as number) ? 470 : 360} size={(li as number) ? 108 : 96} o={k(t, t0 as number, 0.4) * (1 - ctaOut)} anchor="middle" c={(li as number) ? BLUES : NAVY}>{txt as string}</T>
            ))}
            <path d={`${rr(140, 620, 800, 380, 50)}`} fill={NAVY} opacity={bF * (1 - ctaOut)} />
            <D d={`${rr(140, 620, 800, 380, 50)} M 220 1000 L 200 1080 L 300 1000`} p={bIn} e={ctaOut} />
            <path d="M 220 1000 L 200 1080 L 300 1000 Z" fill={NAVY} opacity={bF * (1 - ctaOut)} />
            {bF > 0 && sent(0) <= 0 && [0, 1, 2].map((j) => <circle key={j} cx={470 + j * 70} cy={810} r={18} fill={WHITE} opacity={(0.3 + 0.7 * Math.max(0, Math.sin(t * 7 - j * 0.9))) * bF * (1 - ctaOut)} />)}
            {[0, 1].map((i) => <D key={i} d={`M 220 ${760 + i * 80} H ${220 + [560, 400][i]}`} p={sent(i)} e={ctaOut} c={i ? BLUE : WHITE} w_={22} />)}
            <rect x={290} y={1130} width={500} height={130} rx={65} fill={press > 0.5 ? NAVY : BLUE} opacity={pillF * (1 - ctaOut)} />
            <D d={rr(290, 1130, 500, 130, 65)} p={pillIn} e={ctaOut} />
            <T x={540} y={1213} size={50} o={pillF * (1 - ctaOut)} anchor="middle" c={press > 0.5 ? WHITE : NAVY}>Message us</T>
            <rect x={140} y={1340} width={800} height={120} rx={30} fill={ICE} opacity={trF * (1 - ctaOut)} />
            <D d={rr(140, 1340, 800, 120, 30)} p={trIn} e={ctaOut} c={BLUES} w_={6} />
            <path d={sparkle(214, 1400, 26)} fill={BLUES} opacity={trF * (1 - ctaOut)} />
            <T x={560} y={1415} size={42} o={trF * (1 - ctaOut)} anchor="middle">We'll share a trick in return</T>
            <Sweep t={t} t0={w("do") + 0.6} id="cBub" x={140} w_={800} y={620} h={380} period={1.2} o={bF * (1 - ctaOut)} />
            <Sweep t={t} t0={w("message") - 0.1} id="cPill" x={140} w_={800} y={1130} h={330} period={1.0} o={pillF * (1 - ctaOut)} />
          </>}

          {/* ========== the pen tip: never stops, tracing the outline of what is active ========== */}
          {(() => {
            const act: [number, string][] = [[1.0, rr(DOC.x, DOC.y, DOC.w, DOC.h, 36)], [w("into") + 0.1, rr(130, 470, 820, 870, 36)], [w("then") + 0.1, rr(DOC.x, DOC.y, DOC.w, DOC.h, 36)],
              [w("improve") - 0.1, circ(LOOP.cx, LOOP.cy, LOOP.r)], [w("do") - 0.1, rr(140, 620, 800, 380, 50)], [20.95, rr(540 - 175, 860 - 175, 350, 350, 70)]];
            const idx = act.findIndex((a, i) => t >= a[0] && (i === act.length - 1 || t < act[i + 1][0]));
            if (idx < 0) return null;
            const ph = ((t - act[idx][0]) * 0.32) % 1;
            return <g>
              <path d={act[idx][1]} fill="none" stroke={BLUES} strokeWidth={SW + 6} strokeLinecap="round" pathLength={1} strokeDasharray="0.09 0.91" strokeDashoffset={-ph} opacity={0.95} />
              <path d={act[idx][1]} fill="none" stroke={BLUE} strokeWidth={SW + 2} strokeLinecap="round" pathLength={1} strokeDasharray="0.04 0.96" strokeDashoffset={-ph + 0.11} opacity={0.8} />
            </g>;
          })()}

          {/* ========== end card: the line draws the logo's tile; Message us ========== */}
          {t > 20.9 && <>
            <D d={rr(540 - 175, 860 - 175, 350, 350, 70)} p={tileIn} c={BLUES} w_={10} />
            <circle cx={540} cy={860} r={250} fill="none" stroke={BLUE} strokeWidth={6} strokeDasharray="60 1510" strokeDashoffset={-t * 520} strokeLinecap="round" opacity={k(t, 21.4, 0.5)} />
            <rect x={290} y={1160} width={500} height={130} rx={65} fill={NAVY} opacity={endPillF} />
            <D d={rr(290, 1160, 500, 130, 65)} p={endPill} />
            <T x={540} y={1243} size={50} o={endPillF} anchor="middle" c={WHITE}>Message us</T>
            <Sweep t={t} t0={21.9} id="cEnd" x={290} w_={500} y={1160} h={130} period={0.9} o={endPillF} />
          </>}
        </svg>
      )}
      {layer !== "noLogo" && <LogoLayer track={LOGO} t={t} />}
    </AbsoluteFill>
  );
};
