// Group A: S1 the hook (headline, K.B tile, hand click) and S2 the three pillars.
import React from "react";
import { C, E, FONT, GRAD, KBTile, Ripple, S, SHADOW, Stage, Words, clamp, drift, ease, mix, pressAt, rnd, Win } from "../kit";
import type { Group, Scene } from "../types";

// ---------- S1 ----------
const TX = 960, TY = 520, CLICK1 = 3.7;
const ROLES: { title: string; g: string; c: string; icon: string }[] = [
  { title: "Developer", g: GRAD.dev, c: C.indigo, icon: "</>" },
  { title: "AI engineer", g: GRAD.ai, c: C.violet, icon: "AI" },
  { title: "Automation specialist", g: GRAD.brand, c: C.cyan, icon: "A→B" },
  { title: "Growth marketer", g: GRAD.growth, c: C.mint, icon: "↗" },
];
const CARD_W = 390, CARD_H = 350, ROW_Y = 720;
const RoleCard: React.FC<{ t: number; i: number }> = ({ t, i }) => {
  const r = ROLES[i], t0 = 0.15 + i * 0.42, a = S(t, t0, { damping: 13, stiffness: 140 });
  const k = E(t, 2.0 + (3 - i) * 0.05, 0.55), f = E(t, 2.65, 0.4, ease.inOut);
  const x0 = 960 + (i - 1.5) * 440, y0 = ROW_Y;
  const x = mix(x0, TX + (i - 1.5) * 14, k), y = mix(y0 + (1 - a) * 420, TY + (i - 1.5) * 10, k);
  const rot = mix((1 - a) * (i % 2 ? 8 : -8), (i - 1.5) * 3, k) * (1 - f);
  const sc = mix(mix(0.8, 1, a), 0.9, k) * mix(1, 280 / CARD_W, f);
  const fill = E(t, t0 + 0.45, 0.55, ease.out), btn = E(t, t0 + 0.8, 0.4, ease.out);
  const op = clamp(a * 3) * (1 - E(t, 2.85, 0.22));
  if (op <= 0) return null;
  return (
    <div style={{ position: "absolute", left: x - CARD_W / 2, top: y - CARD_H / 2, width: CARD_W, height: CARD_H, borderRadius: 30 * (1 - 0.6 * f), background: C.white, boxShadow: SHADOW.card, overflow: "hidden",
      transform: `rotate(${rot}deg) scale(${sc})`, opacity: op, zIndex: i }}>
      <div style={{ height: 150, background: r.g, position: "relative" }}>
        <div style={{ position: "absolute", right: 24, top: 18, fontFamily: "Menlo, monospace", fontWeight: 800, fontSize: 64, color: "#fff", opacity: 0.95 }}>{r.icon}</div>
        <div style={{ position: "absolute", left: 22, top: 22, padding: "8px 18px", borderRadius: 24, background: "#fff", color: C.navy, fontFamily: FONT, fontWeight: 700, fontSize: 22 }}>Open role</div>
        <div style={{ position: "absolute", left: 0, bottom: 0, height: 10, width: `${fill * 100}%`, background: "rgba(255,255,255,.85)" }} />
      </div>
      <div style={{ padding: "22px 26px 0", fontFamily: FONT, fontWeight: 800, fontSize: 32, lineHeight: 1.08, letterSpacing: -0.8, color: C.navy, height: 84 }}>{r.title}</div>
      <div style={{ margin: "10px 26px 0", height: 16, borderRadius: 8, background: r.c, width: `${mix(20, 78, fill)}%` }} />
      <div style={{ margin: "12px 26px 0", height: 16, borderRadius: 8, background: "#CBD5E3", width: "58%" }} />
      <div style={{ position: "absolute", left: 26, bottom: 22, padding: "10px 30px", borderRadius: 30, background: C.navy, color: "#fff", fontFamily: FONT, fontWeight: 700, fontSize: 24, transform: `scale(${mix(0.8, 1, btn)})`, transformOrigin: "left center", opacity: btn }}>Apply</div>
    </div>
  );
};
const CHIPS: [string, number, number][] = [["Developer", 500, 430], ["AI engineer", 480, 590], ["Automation", 1420, 430], ["Growth", 1440, 590]];
const S1: Scene = ({ t }) => {
  const tp = S(t, 2.8, { damping: 11, stiffness: 150 }), press = pressAt(t, CLICK1);
  const tag = S(t, 3.15);
  return (
    <Stage t={t} tint={C.cyan} tint2={C.violet}>
      <Words t={t} t0={-0.1} text={"The technical team\nyou don't have to hire yet."} size={100} y={215} stagger={0.09} hi={{ technical: GRAD.brand, team: GRAD.brand }} out={2.2} maxW={1700} />
      {ROLES.map((_, i) => <RoleCard key={i} t={t} i={i} />)}
      {t > 2.75 && (
        <>
          {[0, 1].map((r) => {
            const ph = clamp((t - 3.0 - r * 0.28) / 0.8);
            return <div key={r} style={{ position: "absolute", left: TX - 150 - 330 * ph, top: TY - 150 - 330 * ph, width: 300 + 660 * ph, height: 300 + 660 * ph, borderRadius: "50%", border: `${22 * (1 - ph) + 4}px solid ${r ? C.indigo : C.cyan}`, opacity: 0.8 * (1 - ph) }} />;
          })}
          {CHIPS.map(([name, cx, cy], i) => {
            const a = S(t, 3.05 + i * 0.12, { damping: 12, stiffness: 150 }), ab = E(t, 3.85 + i * 0.05, 0.4, ease.in);
            const x = mix(mix(TX, cx, a), TX, ab), y = mix(mix(TY, cy, a), TY, ab), sc = a * (1 - 0.6 * ab);
            return (
              <div key={i} style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${sc})`, padding: "16px 34px", borderRadius: 50, background: ROLES[i].g, color: "#fff", fontFamily: FONT, fontWeight: 700, fontSize: 32, whiteSpace: "nowrap", boxShadow: SHADOW.soft, opacity: 1 - ab }}>
                {"✓ "}{name}
              </div>
            );
          })}
          <KBTile x={TX} y={TY} size={280} style={{ transform: `scale(${tp * (1 - 0.07 * press)})`, opacity: clamp(tp * 3), boxShadow: `0 ${30 - 18 * press}px ${70 - 30 * press}px rgba(41,58,81,.28)`, zIndex: 5 }} />
          <div style={{ position: "absolute", left: TX, top: TY + 215, transform: `translate(-50%,-50%) translateY(${(1 - tag) * 26}px)`, opacity: clamp(tag * 1.5), fontFamily: FONT, fontWeight: 700, fontSize: 32, letterSpacing: 9, color: C.navy, whiteSpace: "nowrap" }}>YOUR TECH PARTNER</div>
          <Ripple t={t} c={CLICK1} x={TX} y={TY} r={300} />
          <Ripple t={t - 0.12} c={CLICK1} x={TX} y={TY} r={200} color={C.indigo} />
        </>
      )}
    </Stage>
  );
};

// ---------- S2 ----------
const CW = 540, CH = 620, CY = 680, CLICK2 = 3.3;
const bump = (t: number, a: number, b: number) => E(t, a, 0.35, ease.out) * (1 - E(t, b, 0.4, ease.inOut));

// node graph: solid nodes, solid chips streaming along the wires
const IllusAI: React.FC<{ t: number }> = ({ t }) => {
  const N = [[70, 310], [150, 110], [250, 270], [350, 90], [430, 250]];
  const L = [[0, 1], [0, 2], [1, 3], [2, 3], [3, 4], [2, 4]];
  const CHIP = [C.navy, C.amber, C.coral, C.mint, C.navy, C.violet];
  return (
    <svg width={500} height={400} viewBox="0 0 500 400">
      <defs><linearGradient id="gAI" x1="0" x2="1"><stop offset="0" stopColor={C.cyan} /><stop offset="1" stopColor={C.violet} /></linearGradient></defs>
      {L.map(([a, b], i) => {
        const [x1, y1] = N[a], [x2, y2] = N[b], p = E(t, 0.1 + i * 0.08, 0.4);
        return <line key={i} x1={x1} y1={y1} x2={mix(x1, x2, p)} y2={mix(y1, y2, p)} stroke="url(#gAI)" strokeWidth={12} strokeLinecap="round" opacity={0.5} />;
      })}
      {L.map(([a, b], i) => {
        const [x1, y1] = N[a], [x2, y2] = N[b];
        return [0, 1].map((k) => {
          const q = (t * 0.95 + i * 0.23 + k * 0.5) % 1, on = t > 0.5 + i * 0.05;
          if (!on) return null;
          return <rect key={`${i}-${k}`} x={mix(x1, x2, q) - 22} y={mix(y1, y2, q) - 15} width={44} height={30} rx={9} fill={CHIP[(i + k * 3) % CHIP.length]} />;
        });
      })}
      {N.map(([x, y], i) => {
        const p = S(t, i * 0.08 - 0.05), r = (i === 2 ? 46 : 34) * p;
        return <g key={i}><circle cx={x} cy={y} r={r} fill="url(#gAI)" /><circle cx={x} cy={y} r={r * 0.4} fill="#fff" /></g>;
      })}
    </svg>
  );
};

// code editor: a dark window whose code types and scrolls
const CODE: [string, number][][] = Array.from({ length: 24 }, (_, i) => {
  const cols = [C.violet, C.cyan, C.amber, C.mint, C.coral, "#FFFFFF", C.indigo];
  const n = 2 + Math.floor(rnd(i + 3) * 3), ind = Math.floor(rnd(i + 9) * 3);
  return [["transparent", ind * 34] as [string, number]].concat(Array.from({ length: n }, (_, j) => [cols[Math.floor(rnd(i * 7 + j) * cols.length)], 60 + Math.floor(rnd(i * 5 + j + 1) * 110)] as [string, number]));
});
const IllusDev: React.FC<{ t: number }> = ({ t }) => {
  const LH = 52, front = t * 3.6 - 0.2, VIS = 6.2, scroll = Math.max(0, front - VIS + 1) * LH;
  return (
    <div style={{ position: "relative", width: 500, height: 400 }}>
      <Win x={10} y={6} w={480} h={388} dark bar={44} style={{ boxShadow: "0 18px 40px rgba(41,58,81,.25)" }}>
        <div style={{ position: "absolute", left: 18, top: 20, width: 440, height: 320, overflow: "hidden" }}>
          <div style={{ transform: `translateY(${-scroll}px)` }}>
            {CODE.map((r, i) => {
              const prog = clamp(front - i), cur = front >= i && front - i < 1;
              const total = r.reduce((a, c) => a + c[1] + 10, 0);
              let used = 0;
              return (
                <div key={i} style={{ height: LH, display: "flex", alignItems: "center", gap: 10, background: cur ? "rgba(56,200,255,.16)" : "transparent", borderRadius: 8 }}>
                  <div style={{ width: 26, fontFamily: FONT, fontSize: 20, color: "rgba(255,255,255,.4)", fontWeight: 700, paddingLeft: 4 }}>{i + 1}</div>
                  {r.map((c, j) => {
                    const st = used; used += c[1] + 10;
                    const vis = clamp((total * prog - st) / (c[1] + 10));
                    return <div key={j} style={{ width: c[1] * vis, height: 22, borderRadius: 11, background: c[0], flexShrink: 0 }} />;
                  })}
                  {cur && <div style={{ width: 4, height: 32, background: C.cyan }} />}
                </div>
              );
            })}
          </div>
        </div>
      </Win>
    </div>
  );
};

// live chart: solid bars that re-rank continuously under a growing area
const IllusGrowth: React.FC<{ t: number }> = ({ t }) => {
  const n = 7, bw = 52;
  const hs = Array.from({ length: n }, (_, i) => (0.3 + 0.62 * Math.abs(Math.sin(t * 1.5 + i * 1.25 + rnd(i) * 2))) * S(t, 0.05 + i * 0.07));
  const pts = hs.map((h, i) => [38 + i * 70, 380 - h * 330]);
  const d = pts.map((p, i) => `${i ? "L" : "M"}${p[0]} ${p[1]}`).join(" ");
  return (
    <svg width={500} height={400} viewBox="0 0 500 400">
      <defs>
        <linearGradient id="gGr" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor={C.cyan} /><stop offset="1" stopColor={C.mint} /></linearGradient>
        <linearGradient id="gGr2" x1="0" x2="1"><stop offset="0" stopColor={C.mint} /><stop offset="1" stopColor={C.cyan} /></linearGradient>
      </defs>
      {hs.map((h, i) => <rect key={i} x={pts[i][0] - bw / 2} y={380 - h * 330} width={bw} height={h * 330} rx={12} fill={i % 3 === 1 ? C.navy : "url(#gGr)"} />)}
      <path d={d} fill="none" stroke={C.amber} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
      {pts.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={11} fill="#fff" stroke={C.amber} strokeWidth={6} />)}
    </svg>
  );
};

const PILLARS = [
  { name: "AI, Agents & Automation", grad: GRAD.ai, c: C.violet, x: 360, Illus: IllusAI },
  { name: "Software Development", grad: GRAD.dev, c: C.indigo, x: 960, Illus: IllusDev },
  { name: "Growth Technology", grad: GRAD.growth, c: C.mint, x: 1560, Illus: IllusGrowth },
];

const S2: Scene = ({ t }) => {
  const hovWin: [number, number][] = [[2.7, 3.6], [1.9, 2.4], [0.95, 1.6]];
  const hov = [0.7 * E(t, 2.8, 0.4, ease.out), bump(t, 1.9, 2.4), bump(t, 0.95, 1.6)];
  const hdr = S(t, -0.1), clickScale = E(t, CLICK2 + 0.2, 0.9, ease.inOut);
  return (
    <Stage t={t} tint={C.violet} tint2={C.mint} grid>
      <div style={{ position: "absolute", inset: 0 }}>
        <KBTile x={960} y={140} size={110} style={{ transform: `scale(${hdr})` }} />
        <div style={{ position: "absolute", left: 960, top: 250, transform: `translate(-50%,-50%) translateY(${(1 - S(t, 0.05)) * 20}px)`, opacity: clamp(S(t, 0.05) * 1.5), fontFamily: FONT, fontWeight: 600, fontSize: 40, letterSpacing: -0.5, color: C.navy, whiteSpace: "nowrap" }}>One partner. Three pillars.</div>
        {PILLARS.map((p, i) => {
          const t0 = 0.12 + i * 0.16, a = S(t, t0, { damping: 15, stiffness: 120 }), settle = 1 - a;
          const side = i - 1, h = hov[i];
          const isClick = i === 0;
          const press = isClick ? pressAt(t, CLICK2) : 0;
          const sc = mix(0.55, 1, a) * (1 + 0.03 * h) * (isClick ? (1 - 0.04 * press) * (1 + 0.45 * clickScale) : 1);
          const tx = (960 - p.x) * settle * 0.9;
          const ty = settle * 220 + (side !== 0 ? 22 : 0) * (1 - Math.min(1, a)) - 18 * h;
          const ry = side * -14 * settle, rx = 14 * settle;
          const tt = Math.max(0, t - t0) + 0.9 * clamp(t - hovWin[i][0], 0, hovWin[i][1] - hovWin[i][0]);
          return (
            <div key={i} style={{ position: "absolute", left: p.x - CW / 2, top: CY - CH / 2, width: CW, height: CH, perspective: 1400, zIndex: isClick ? 3 : 1, opacity: clamp(a * 2.2) * (isClick ? 1 : 1 - 0.5 * clickScale) }}>
              <div style={{ width: "100%", height: "100%", borderRadius: 38, background: "linear-gradient(160deg, #fff, rgba(255,255,255,.9))", border: "2px solid rgba(255,255,255,.95)",
                boxShadow: `${SHADOW.card}, 0 0 ${60 * h + 40 * (isClick ? press : 0)}px ${p.c}${h > 0.05 || press > 0.05 ? "55" : "00"}`, overflow: "hidden", position: "relative",
                transform: `translate(${tx}px, ${ty}px) rotateY(${ry}deg) rotateX(${rx}deg) scale(${sc})`, transformOrigin: "50% 50%" }}>
                <div style={{ position: "absolute", left: 20, top: 24 }}><p.Illus t={tt} /></div>
                <div style={{ position: "absolute", left: 0, right: 0, top: 444, textAlign: "center", padding: "0 30px", fontFamily: FONT, fontWeight: 800, fontSize: 42, lineHeight: 1.1, letterSpacing: -1, color: C.navy }}>{p.name}</div>
                <div style={{ position: "absolute", left: 60, right: 60, bottom: 26, height: 10, borderRadius: 5, background: p.grad, transformOrigin: "left", transform: `scaleX(${E(t, t0 + 0.3, 0.6, ease.out)})` }} />
              </div>
            </div>
          );
        })}
        <Ripple t={t} c={CLICK2} x={360} y={640} r={200} color={C.violet} />
      </div>
    </Stage>
  );
};

export const GROUP: Group = {
  scenes: { S1, S2 },
  hand: {
    S1: [{ at: CLICK1, x: TX, y: TY, click: true }],
    S2: [{ at: 1.3, x: 1560, y: 640 }, { at: CLICK2, x: 360, y: 640, click: true }],
  },
  sfx: {
    S1: [{ t: 0.1, kind: "whoosh", note: "headline words rise" }, { t: 0.3, kind: "pop", note: "role card 1" }, { t: 0.72, kind: "pop", note: "role card 2" }, { t: 1.14, kind: "pop", note: "role card 3" }, { t: 1.56, kind: "pop", note: "role card 4" }, { t: 2.2, kind: "slide", note: "cards slide into one stack" }, { t: 2.95, kind: "pop", note: "stack becomes the K.B tile" }, { t: 3.81, kind: "click", note: "hand clicks the tile" }],
    S2: [{ t: 0.15, kind: "pop", note: "first card" }, { t: 0.31, kind: "pop", note: "second card" }, { t: 0.47, kind: "pop", note: "third card" }, { t: 1.0, kind: "tick", note: "hover card 3" }, { t: 2.0, kind: "tick", note: "hand passes card 2" }, { t: 3.41, kind: "click", note: "click card 1" }, { t: 3.6, kind: "whoosh", note: "card scales toward viewer" }],
  },
};
