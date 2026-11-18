// Group E helpers: S12 (Diagnose, Build, Run) and S14 (end card), motion pass.
import React from "react";
import { C, E, FONT, GRAD, KBTile, S, SHADOW, Stage, Words, Chip, Ripple, clamp, ease, mix, pressAt } from "../kit";
import type { Scene } from "../types";

const CX = [360, 960, 1560], CW = 540, CT = 270, CH = 560, PIC_H = 380;
const ACC = [C.cyan, C.indigo, C.mint];
const NAMES = ["Diagnose", "Build", "Run"];
const WIN: [number, number][] = [[0.45, 1.7], [1.7, 2.7], [2.7, 3.7]];

// --- picture 1: a scan sweeping a system map
const NODES = [[80, 90], [240, 70], [410, 100], [110, 230], [270, 260], [410, 250]];
const LINKS = [[0, 1], [1, 2], [0, 3], [1, 4], [2, 5], [3, 4], [4, 5]];
const PicScan: React.FC<{ t: number }> = ({ t }) => {
  const per = 0.85, ph = (t % per) / per, y = ph * (PIC_H + 80) - 60;
  return (
    <>
      <svg width={CW - 40} height={PIC_H} style={{ position: "absolute", left: 0, top: 0 }}>
        {LINKS.map(([a, b], i) => <line key={i} x1={NODES[a][0]} y1={NODES[a][1]} x2={NODES[b][0]} y2={NODES[b][1]} stroke={C.navy} strokeWidth="6" opacity=".25" />)}
      </svg>
      {NODES.map(([x, yy], i) => {
        const hit = (t - 0 + 100) % per, since = ((t % per) / per) * (PIC_H + 80) - 60 - yy; // band below node => scanned this pass
        const col = since < -10 ? C.amber : since < 200 ? C.cyan : C.green;
        const pop = since > 0 && since < 90 ? 1 + 0.18 * Math.sin((since / 90) * Math.PI) : 1; void hit;
        return <div key={i} style={{ position: "absolute", left: x - 38, top: yy - 38, width: 76, height: 76, borderRadius: 22, background: col, transform: `scale(${pop})`, boxShadow: "0 8px 20px rgba(41,58,81,.18)" }} />;
      })}
      <div style={{ position: "absolute", left: -20, width: CW, top: y, height: 60, background: `linear-gradient(180deg, transparent, ${C.cyan}CC 60%, ${C.cyan})`, borderBottom: `4px solid ${C.white}`, boxShadow: `0 6px 18px ${C.cyan}99` }} />
    </>
  );
};

// --- picture 2: blocks assembling into an app
const BLOCKS: { x: number; y: number; w: number; h: number; c: string; from: [number, number] }[] = [
  { x: 0, y: 0, w: 460, h: 64, c: C.navy, from: [0, -160] },
  { x: 0, y: 84, w: 120, h: 276, c: C.indigo, from: [-260, 0] },
  { x: 140, y: 84, w: 150, h: 120, c: C.cyan, from: [0, -200] },
  { x: 310, y: 84, w: 150, h: 120, c: C.violet, from: [260, -80] },
  { x: 140, y: 224, w: 320, h: 136, c: C.mint, from: [0, 240] },
];
const PicBuild: React.FC<{ t: number }> = ({ t }) => {
  const per = 2.6, tt = t % per;
  const fade = tt > 2.3 ? 1 - E(tt, 2.3, 0.25) : 1;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: CW - 40, height: PIC_H, opacity: fade }}>
      {BLOCKS.map((b, i) => {
        const p = S(tt, 0.1 + i * 0.38, { damping: 13, stiffness: 190 });
        return <div key={i} style={{ position: "absolute", left: b.x, top: b.y, width: b.w, height: b.h, borderRadius: 16, background: b.c, opacity: clamp(p * 3),
          transform: `translate(${(1 - p) * b.from[0]}px, ${(1 - p) * b.from[1]}px)`, boxShadow: "0 8px 20px rgba(41,58,81,.16)" }} />;
      })}
      {[0, 1, 2, 3].map((i) => {
        const p = S(tt, 1.3 + i * 0.2);
        return <div key={"b" + i} style={{ position: "absolute", left: 170 + i * 72, bottom: 40, width: 46, height: (50 + (i * 37) % 70) * p, borderRadius: 8, background: C.white, opacity: 0.95 }} />;
      })}
    </div>
  );
};

// --- picture 3: a live uptime chart streaming left, with a strip of status blocks
const val = (x: number) => 0.55 + 0.2 * Math.sin(x * 0.021) + 0.14 * Math.sin(x * 0.057 + 1) + 0.06 * Math.sin(x * 0.13);
const PicRun: React.FC<{ t: number }> = ({ t }) => {
  const w = CW - 40, off = t * 170, pts: string[] = [];
  for (let x = 0; x <= w; x += 8) pts.push(`${x},${(1 - val(x + off)) * 230 + 10}`);
  const poly = `M0,250 L${pts.join(" L")} L${w},250 Z`;
  const bw = 26, sx = off * 0.9 % bw;
  return (
    <>
      <svg width={w} height={260} style={{ position: "absolute", left: 0, top: 0 }}>
        <defs><linearGradient id="runfill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={C.mint} /><stop offset="1" stopColor={C.cyan} stopOpacity=".55" /></linearGradient></defs>
        <path d={poly} fill="url(#runfill)" />
      </svg>
      <div style={{ position: "absolute", left: 0, top: 290, width: w, height: 80, overflow: "hidden" }}>
        {Array.from({ length: 19 }).map((_, i) => {
          const k = i + Math.floor(off * 0.9 / bw), amber = (k * 7) % 11 === 0;
          return <div key={i} style={{ position: "absolute", left: i * bw - sx, top: 0, width: bw - 6, height: 80, borderRadius: 6, background: amber ? C.amber : C.green }} />;
        })}
      </div>
    </>
  );
};

export const S12: Scene = ({ t }) => {
  return (
    <Stage t={t} tint={C.cyan} tint2={C.mint}>
      <Words t={t} t0={-0.15} text={"Built together.\nBuilt to be run."} size={72} y={135} stagger={0.12} hi={{ together: GRAD.brand, run: GRAD.growth }} />
      {CX.map((x, i) => {
        const [a, b] = WIN[i], appear = S(t, -0.15 + i * 0.12);
        const act = clamp((t - a) / 0.2) * (1 - clamp((t - b) / 0.25)), done = t >= b ? E(t, b, 0.4, ease.out) : 0;
        const fill = E(t, a, b - a, (v) => v);
        const Pic = [PicScan, PicBuild, PicRun][i];
        return (
          <div key={i} style={{ position: "absolute", left: x - CW / 2, top: CT, width: CW, height: CH, borderRadius: 40, background: C.white, opacity: clamp(appear * 1.5),
            transform: `translateY(${(1 - appear) * 90 - act * 10}px) scale(${mix(0.88, 1, appear)})`, border: `3px solid ${act > 0.05 ? ACC[i] : "rgba(41,58,81,.08)"}`,
            boxShadow: act > 0.05 ? `0 30px 70px ${ACC[i]}55` : SHADOW.card, overflow: "hidden" }}>
            <div style={{ position: "absolute", left: 20, top: 20, width: CW - 40, height: PIC_H, borderRadius: 26, background: `${ACC[i]}1F`, overflow: "hidden" }}>
              <div style={{ position: "absolute", left: 20, top: 0, width: CW - 40, height: PIC_H }}><Pic t={t + 3} /></div>
            </div>
            <div style={{ position: "absolute", left: 32, top: 424, fontFamily: FONT, fontWeight: 700, fontSize: 44, color: C.navy, letterSpacing: -1 }}>{NAMES[i]}</div>
            <div style={{ position: "absolute", right: 32, top: 420, width: 56, height: 56, borderRadius: "50%", background: C.green, transform: `scale(${S(t, b, { damping: 9 }) * (t >= b ? 1 : 0)})` }}>
              <svg width="56" height="56" viewBox="0 0 56 56"><path d="M15 29 L25 39 L42 18" fill="none" stroke="#fff" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="50" strokeDashoffset={50 * (1 - done)} /></svg>
            </div>
            <div style={{ position: "absolute", left: 32, right: 32, top: 495, height: 22, borderRadius: 11, background: `${ACC[i]}2E`, overflow: "hidden" }}>
              <div style={{ width: `${fill * 100}%`, height: "100%", borderRadius: 11, background: i === 2 ? GRAD.growth : i === 1 ? GRAD.dev : GRAD.brand }} />
            </div>
          </div>
        );
      })}
      {(() => { const p0 = S(t, 2.7, { damping: 14 }); return (
        <div style={{ position: "absolute", left: 0, right: 0, top: 938, height: 70, display: "flex", alignItems: "center", justifyContent: "center", gap: 22 }}>
          <span style={{ fontFamily: FONT, fontWeight: 600, fontSize: 34, color: C.sub, opacity: clamp(p0 * 2), transform: `translateY(${(1 - p0) * 30}px)`, marginRight: 8 }}>After we deliver</span>
          {["Hosting", "Maintenance", "Growth"].map((w, i) => {
            const p = S(t, 2.8 + i * 0.15, { damping: 12 });
            return <div key={w} style={{ transform: `translateY(${(1 - p) * 40}px) scale(${mix(0.5, 1, p)})`, opacity: clamp(p * 2) }}>
              <Chip text={w} size={36} color={C.navy} bg={[C.cyanSoft, "#E8EEFF", "#E2F8F1"][i]} style={{ border: `2.5px solid ${ACC[i]}`, boxShadow: SHADOW.soft }} />
            </div>;
          })}
        </div>); })()}
    </Stage>
  );
};

// ---------------- S14 ----------------
const BTN_Y = 745, BTN_W = 1000, BTN_H = 140;
export const S14: Scene = ({ t }) => {
  const tile = S(t, -0.15, { damping: 12, stiffness: 150 });
  const btn = S(t, 0.9, { damping: 12 });
  const fillIn = E(t, 1.1, 0.95, ease.smooth);
  const press = pressAt(t, 2.0);
  const wave = E(t, 2.11, 0.95, ease.smooth);
  const check = E(t, 2.6, 0.85, ease.inOut);
  const line = "We build the systems your business runs on, with you.";
  const n = Math.floor(line.length * E(t, 0.9, 1.1, (v) => v));
  return (
    <Stage t={t} tint={C.cyan} tint2={C.violet}>
      <KBTile x={960} y={170} size={190} style={{ transform: `scale(${tile})`, opacity: clamp(tile * 2) }} />
      <Words t={t} t0={0.0} text="Your tech partner." size={150} y={400} maxW={1800} stagger={0.5} hi={{ tech: GRAD.brand, partner: GRAD.brand }} />
      <div style={{ position: "absolute", left: 960, top: 520, width: 1500, textAlign: "center", transform: "translate(-50%,-50%)", fontFamily: FONT, fontWeight: 500, fontSize: 38, color: C.sub, letterSpacing: -0.5 }}>
        {line.slice(0, n)}<span style={{ opacity: 0 }}>{line.slice(n)}</span>
      </div>
      {/* the CTA stays one clean pill to the last frame: a gradient sweep fills it, the click sends a mint wave across it and a check draws on beside the label */}
      <div style={{ position: "absolute", left: 960 - BTN_W / 2, top: BTN_Y - BTN_H / 2, width: BTN_W, height: BTN_H, borderRadius: BTN_H / 2, background: C.navy, overflow: "hidden",
        transform: `scale(${mix(0.7, 1, btn) * (1 - 0.05 * press) * (1 + 0.035 * Math.sin(Math.PI * clamp((t - 2.2) / 0.55)))})`, opacity: clamp(btn * 2), boxShadow: `0 ${16 - 8 * press}px 40px rgba(56,200,255,.4)` }}>
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${fillIn * 100}%`, background: GRAD.brand }} />
        <div style={{ position: "absolute", left: BTN_W / 2 - 40 - BTN_W * 0.56 * wave, top: BTN_H / 2 - 40 - BTN_W * 0.56 * wave, width: 80 + BTN_W * 1.12 * wave, height: 80 + BTN_W * 1.12 * wave, borderRadius: "50%", background: GRAD.growth, opacity: wave > 0 ? 1 : 0 }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 700, fontSize: 50, color: "#fff", whiteSpace: "nowrap" }}>
          <span>Book a Free Discovery Call</span>
          <svg width={86 * clamp(check * 2.5)} height="70" viewBox="-10 0 76 56" style={{ marginLeft: 6 * clamp(check * 2.5), overflow: "visible" }}>
            <circle cx="34" cy="28" r={26 * clamp(check * 2.5)} fill="#fff" />
            <path d="M21 29 L31 39 L48 18" fill="none" stroke={C.green} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="50" strokeDashoffset={50 * (1 - clamp((check - 0.3) / 0.7))} />
          </svg>
        </div>
      </div>
      {[0, 0.3, 0.6].map((d, i) => { const p = E(t, d - 0.1, 0.9, ease.out); return p > 0 && p < 1 ? <div key={i} style={{ position: "absolute", left: 960 - 105 - 400 * p, top: 170 - 105 - 400 * p, width: 210 + 800 * p, height: 210 + 800 * p, borderRadius: "50%", border: `${14 * (1 - p) + 2}px solid ${[C.cyan, C.indigo, C.mint][i]}`, opacity: 1 - p }} /> : null; })}
      <Ripple t={t} c={2.0} x={960} y={BTN_Y} r={300} />
      <Ripple t={t + 0.3} c={2.0} x={960} y={BTN_Y} r={520} color={C.mint} />
      <Ripple t={t + 0.6} c={2.0} x={960} y={BTN_Y} r={720} color={C.indigo} />
      <Ripple t={t + 0.25} c={2.0} x={960} y={BTN_Y} r={380} color={C.mint} />
    </Stage>
  );
};
