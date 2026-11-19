// Package R10 (reference f833-f961; cuts f847, f871, f900, f925).
//   AG f833-f846   dark ground: the collage of idea cards flies in and settles ("Think big.")
//   AH f847-f870   the product window on dark; f871-f899 the same window turned bolder, the picture filling it
//   AI f900-f924   the board seen close: numbers count, the K.B and You cursors move ("Build well.")
//   AJ f925-f961   the whole board, slowly pulling back; the cursors keep moving ("Grow with us.")
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import type { Pkg, Sfx } from "../types";
import { Bar, Bars, C, E, Ground, Rank, S, SH, Tool, Tx, abs, clamp, ease, mix, rs, useFonts } from "../kit";

const F0 = 833;
const at = (n: number) => rs(n - F0);
const GRAD = `linear-gradient(140deg, ${C.indigo}, ${C.cyan} 60%, ${C.mint})`;

// ---------------------------------------------------------------- AG: the collage
// [x, y, w, h, where it flies in from (dx, dy), what it is]
const CARDS: [number, number, number, number, number, number, React.ReactNode, string][] = [
  [380, 250, 560, 460, -520, 120, null, GRAD],
  [880, 110, 320, 320, 80, -420, <svg key="a" width="320" height="320"><ellipse cx="160" cy="160" rx="110" ry="50" fill="none" stroke="#fff" strokeWidth="6" strokeDasharray="2 22" strokeLinecap="round" transform="rotate(-20 160 160)" /></svg>, "#2A3648"],
  [1140, 380, 240, 300, 480, -60, null, C.mint],
  [1380, 300, 190, 190, 520, -240, null, C.cyan],
  [950, 640, 190, 190, -80, 460, <div key="b" style={abs(40, 40, 110, 110, { borderRadius: 55, background: C.ink })} />, "#F4F1EA"],
  [1290, 540, 320, 320, 420, 380, <svg key="c" width="320" height="320"><path d="M60 90 C160 40 240 110 150 150 C60 190 250 190 180 250" fill="none" stroke={C.ink} strokeWidth="7" /></svg>, "#8B95A5"],
];
const AG: React.FC<{ t: number }> = ({ t }) => (
  <Ground tone="dark">
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "960px 540px", transform: `scale(${(0.97 + 0.05 * t).toFixed(4)})`, willChange: "transform" }}>
      {CARDS.map(([x, y, w, h, dx, dy, inner, bg], i) => {
        const p = S(t, 0.01 + i * 0.035, { damping: 15, stiffness: 150 });
        return <div key={i} style={abs(x, y, w, h, { background: bg, opacity: clamp(p * 2.5), transform: `translate3d(${(dx * (1 - p)).toFixed(2)}px, ${(dy * (1 - p)).toFixed(2)}px, 0) rotate(${((1 - p) * (i % 2 ? 6 : -6)).toFixed(2)}deg)`, willChange: "transform" })}>{inner}</div>;
      })}
    </div>
  </Ground>
);

// ---------------------------------------------------------------- AH: the window, then the bolder window
const SMALL = ["#2A3648", C.mint, C.cyan, "#8B95A5", C.indigo, "#F4F1EA"];
const AH: React.FC<{ t: number }> = ({ t }) => {
  const u = t - at(847), bold = t >= at(871), v = t - at(871), inn = S(u, 0, { damping: 16, stiffness: 160 });
  return (
    <Ground tone="dark">
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "960px 540px", transform: `scale(${(mix(0.965, 1, inn) + 0.012 * u).toFixed(4)})`, willChange: "transform" }}>
        <div style={abs(400, 130, 1120, 820, { background: "#F1EFEA", borderRadius: 6, overflow: "hidden" })}>
          {!bold ? (
            <>
              <div style={abs(40, 110, 540, 520, { background: GRAD })} />
              {SMALL.map((c, i) => { const p = S(u, 0.05 + i * 0.04, { damping: 14 }); return <div key={i} style={abs(620 + (i % 3) * 160, 110 + Math.floor(i / 3) * 270, 144, 200, { background: c, border: i === 5 ? `1px solid ${C.line}` : "none", opacity: clamp(p * 2), transform: `translate3d(0, ${((1 - p) * 26).toFixed(2)}px, 0)` })} />; })}
              <Tx x={40} y={660} s={40} w={500}>Your product</Tx>
              <div style={abs(40, 760, 1040, 6, { background: "#D5D9DF" })}><div style={{ width: 1040, height: 6, background: C.ink, transformOrigin: "0 50%", transform: `scaleX(${(0.2 + 0.06 * u).toFixed(4)})` }} /></div>
            </>
          ) : (
            <>
              {/* the bolder version: the picture fills the window, the words go large, the cards line up along the bottom */}
              <div style={abs(-40, -40, 1200, 900, { background: GRAD, transformOrigin: "50% 50%", transform: `scale(${(1.08 - 0.05 * E(v, 0, 0.5, ease.out) + 0.01 * v).toFixed(4)})` })} />
              <div style={abs(0, 0, 1120, 820, { background: "radial-gradient(70% 60% at 30% 35%, rgba(255,255,255,.28), transparent 70%)" })} />
              <Tx x={56} y={520} s={92} w={600} c="#fff" style={{ opacity: E(v, 0.03, 0.2, ease.out), transform: `translate3d(0, ${((1 - E(v, 0.03, 0.35, ease.out)) * 30).toFixed(2)}px, 0)` }}>Your product</Tx>
              <div style={abs(56, 650, 1008, 6, { background: "rgba(255,255,255,.35)" })}><div style={{ width: 1008, height: 6, background: "#fff", transformOrigin: "0 50%", transform: `scaleX(${(0.3 + 0.07 * v).toFixed(4)})` }} /></div>
              {SMALL.map((c, i) => { const p = S(v, 0.06 + i * 0.035, { damping: 14 }); return <div key={i} style={abs(56 + i * 172, 690, 152, 104, { background: c, opacity: clamp(p * 2), transform: `translate3d(0, ${((1 - p) * 40).toFixed(2)}px, 0)`, boxShadow: "0 10px 26px rgba(17,26,39,.25)" })} />; })}
            </>
          )}
        </div>
      </div>
    </Ground>
  );
};

// ---------------------------------------------------------------- AI, AJ: the board
const CLIENTS = ["abroad-internships", "tale-forge", "venga-travel", "worldwiders", "olea-hospitality", "mindmymind", "jongleren-es", "custom-staffing"];
const Cursor: React.FC<{ x: number; y: number; label: string }> = ({ x, y, label }) => {
  const c = label === "You" ? C.coral : C.indigo;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, transform: `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`, willChange: "transform" }}>
      <svg width="34" height="34" viewBox="0 0 24 24"><path d="M3 2l7 19 3-8 8-3z" fill={c} /></svg>
      <div style={abs(26, 26, undefined, undefined, { background: c, color: "#fff", fontSize: 20, fontWeight: 700, padding: "5px 12px", borderRadius: 8, whiteSpace: "nowrap" })}>{label}</div>
    </div>
  );
};
const Board: React.FC<{ u: number }> = ({ u }) => {
  // u = seconds since the board first shows; the numbers count up in its first second
  const n25 = Math.round(mix(18, 25, E(u, 0, 0.9, ease.out))), n100 = Math.round(mix(72, 100, E(u, 0.1, 1.0, ease.out)));
  const cur = (x0: number, y0: number, x1: number, y1: number, a: number, d: number) => { const p = E(u, a, d, ease.inOut); return [mix(x0, x1, p), mix(y0, y1, p)]; };
  const k1 = cur(420, 250, 505, 330, 0.1, 0.8), k2 = cur(1250, 300, 1130, 395, 0.5, 0.9), k3 = cur(760, 900, 640, 815, 0.3, 1.0);
  const k1b = cur(0, 0, 240, 150, 1.2, 1.2), k2b = cur(0, 0, -170, 210, 1.5, 1.1), k3b = cur(0, 0, 330, -60, 1.4, 1.2);
  return (
    <div style={{ position: "relative", width: 1920, height: 1080 }}>
      <div style={abs(-900, -700, 3720, 2480, { backgroundImage: `radial-gradient(${C.line} 2px, transparent 2px)`, backgroundSize: "36px 36px" })} />
      <div style={abs(60, 60, 430, 250, { borderRadius: 16, background: C.dark, overflow: "hidden" })}><div style={abs(0, 0, 430, 250, { transformOrigin: "50% 230px", transform: `scaleY(${mix(0.6, 1, E(u, 0, 0.8, ease.out)).toFixed(4)})` })}><Bars x={30} y={40} w={370} h={190} n={10} /></div></div>
      <div style={abs(540, 40, 560, 320, { borderRadius: 16, background: "#F7F9FB", boxShadow: SH })}><svg width="560" height="320"><path d="M110 160 H240 M330 160 C380 160 380 90 440 90 M330 160 C380 160 380 230 440 230" fill="none" stroke={C.cyan} strokeWidth="5" /></svg><Tool n="pipedrive" x={40} y={120} s={80} navy /><Tool n="n8n-logo2" x={440} y={50} s={80} /><Tool n="odoo-1" x={440} y={190} s={80} navy /><div style={abs(245, 118, 84, 84, { borderRadius: 20, border: `4px solid ${C.cyan}`, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" })}><Img src={staticFile("logo/kb-logo-tile.svg")} style={{ width: 46, height: 46, borderRadius: 7 }} /></div></div>
      <div style={abs(1150, 60, 300, 300, { borderRadius: 16, background: C.cyan, padding: 30, fontSize: 96, fontWeight: 700, boxSizing: "border-box" })}>{n25}<div style={{ fontSize: 22, fontWeight: 600 }}>client projects</div></div>
      <div style={abs(1500, 60, 380, 300, { borderRadius: 16, background: C.ink, padding: 30, fontSize: 96, fontWeight: 700, color: "#fff", boxSizing: "border-box" })}>{n100}{n100 >= 100 ? "+" : ""}<div style={{ fontSize: 22, fontWeight: 600 }}>automations</div></div>
      <div style={abs(60, 370, 300, 420, { borderRadius: 30, background: C.white, boxShadow: SH })}><div style={abs(0, 0, 300, 220, { borderRadius: "30px 30px 0 0", background: `linear-gradient(150deg, ${C.cyan}, ${C.indigo})` })} /><Bar x={30} y={260} w={200} h={18} c={C.ink} /><Bar x={30} y={300} w={140} h={14} /></div>
      <div style={abs(420, 420, 700, 380, { borderRadius: 16, background: C.dark, padding: 30, boxSizing: "border-box", overflow: "hidden" })}><Rank x={30} y={30} w={640} at={0} /></div>
      <div style={abs(1180, 420, 700, 380, { borderRadius: 16, background: C.white, boxShadow: SH, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, padding: 26, boxSizing: "border-box" })}>{CLIENTS.map((n) => <div key={n} style={{ borderRadius: 12, background: "#F4F6F9", display: "flex", alignItems: "center", justifyContent: "center" }}><Img src={staticFile(`clients/${n}-logo.png`)} style={{ maxWidth: "78%", maxHeight: "62%", objectFit: "contain" }} /></div>)}</div>
      <div style={abs(60, 850, 560, 260, { borderRadius: 16, background: "#FFF6C9", padding: 30, fontSize: 30, fontWeight: 600, boxSizing: "border-box" })}>Next: the customer app</div>
      <div style={abs(680, 850, 520, 260, { borderRadius: 16, background: C.mint })} />
      <div style={abs(1260, 850, 620, 260, { borderRadius: 16, background: C.white, boxShadow: SH })}><Bars x={40} y={40} w={540} h={200} n={16} c={C.cyan} /></div>
      <Cursor x={k1[0] + k1b[0]} y={k1[1] + k1b[1]} label="K.B" /><Cursor x={k2[0] + k2b[0]} y={k2[1] + k2b[1]} label="K.B" /><Cursor x={k3[0] + k3b[0]} y={k3[1] + k3b[1]} label="You" />
    </div>
  );
};
const AIJ: React.FC<{ t: number }> = ({ t }) => {
  const u = t - at(900), wide = t >= at(925), v = t - at(925);
  // close on the upper left of the board, then the whole board, pulling back a little more
  const sc = wide ? 1 - 0.035 * E(v, 0, 1.6, ease.out) - 0.004 * v : 2.0 - 0.06 * u;
  const ox = wide ? 960 : 520, oy = wide ? 540 : 250;
  return (
    <Ground>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: `${ox}px ${oy}px`, transform: `scale(${sc.toFixed(4)})`, willChange: "transform" }}><Board u={u} /></div>
    </Ground>
  );
};

const Comp: React.FC<{ t: number }> = ({ t }) => {
  const ok = useFonts();
  if (!ok) return <AbsoluteFill style={{ background: C.dark }} />;
  if (t < at(847)) return <AG t={t} />;
  if (t < at(900)) return <AH t={t} />;
  return <AIJ t={t} />;
};
const sfx: Sfx[] = [
  { t: 0, kind: "swish", note: "the collage flies in" },
  { t: at(847), kind: "pop", note: "the product window" },
  { t: at(871), kind: "rise", note: "the bolder version" },
  { t: at(900), kind: "swish", note: "the board, close" },
  { t: at(925), kind: "slide", note: "the whole board" },
];
export const PKG: Pkg = { id: "R10", Comp, sfx };
