// Package R08 (reference f663-f732; cuts f679, f699).
//   X f663-f678  the UI close-up: suggestion chips, the instruction being typed to the K.B team
//   Y f679-f698  the browser: the K.B panel on the left, the product's dark dashboard on the right
//   Z f699-f732  the dashboard close: the bars grow, the tooltip moves along them, the numbers count up
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import type { Pkg, Sfx } from "../types";
import { Arrow, Bars, C, Caret, Check, E, Ground, SH, Tx, Win, abs, ease, mix, rs, typed, useFonts } from "../kit";

const F0 = 663;
const at = (n: number) => rs(n - F0);

// ---------------------------------------------------------------- X: the instruction
const TEXT = "Now add online booking, so customers can order in two taps";
const CPS = 22, T0 = -(TEXT.length - 13) / CPS;                         // the last 13 characters are typed in the shot (done by f676)
const X: React.FC<{ t: number }> = ({ t }) => {
  const shown = typed(TEXT, t, T0, CPS), typing = shown.length < TEXT.length;
  return (
    <Ground tone="ui">
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "700px 600px", transform: `scale(${(1 + 0.03 * t).toFixed(4)})`, willChange: "transform" }}>
        <div style={abs(60, 60, 1480, 960, { background: "#FBFBFA", borderRadius: 28 })} /><div style={abs(1600, 0, 320, 1080, { background: C.dark })} />
        <Tx x={150} y={130} s={50} w={600}>Suggestions</Tx>
        <div style={abs(140, 240, 1500, 100, { display: "flex", gap: 26 })}>{["Add onboarding emails", "Sync payments"].map((s) => <div key={s} style={{ height: 100, borderRadius: 24, background: "#EEEDE9", fontSize: 44, fontWeight: 500, padding: "0 40px", display: "flex", alignItems: "center", whiteSpace: "nowrap" }}>{s}</div>)}</div>
        <div style={abs(120, 420, 1400, 540, { borderRadius: 34, background: C.white, boxShadow: SH })} />
        <div style={abs(180, 480, 1280, 200, { fontSize: 56, fontWeight: 500, lineHeight: 1.3, letterSpacing: -1.2 })}>{shown}<span style={{ display: "inline-block", position: "relative", width: 0, height: 0 }}><Caret t={t} h={60} w={4} c={C.cyan} typing={typing} style={{ position: "absolute", left: 6, top: -48, marginLeft: 0 }} /></span></div>
        <div style={abs(180, 820, 1280, 90, { display: "flex", alignItems: "center", gap: 28, fontSize: 50, fontWeight: 600 })}><span style={{ fontWeight: 400, fontSize: 64 }}>+</span><Img src={staticFile("logo/kb-logo-tile.svg")} style={{ width: 62, height: 62, borderRadius: 10 }} />K.B team<span style={{ marginLeft: "auto", fontWeight: 500 }}>Send</span><div style={{ width: 96, height: 96, borderRadius: 22, background: C.ink, display: "flex", alignItems: "center", justifyContent: "center" }}><Arrow s={52} c="#fff" /></div></div>
      </div>
    </Ground>
  );
};

// ---------------------------------------------------------------- the product's dashboard (1920x1080, dark)
const Dash: React.FC<{ grow: number; tip: number; pct: number; rate: number }> = ({ grow, tip, pct, rate }) => (
  <div style={{ position: "relative", width: 1920, height: 1080, background: C.dark, fontFamily: "Montserrat, sans-serif" }}>
    <Tx x={120} y={90} s={36} w={600} c="#C5CEDB">New customers</Tx>
    <div style={abs(120, 170, 1180, 680, { borderRadius: 24, background: "#1B2636", overflow: "hidden" })}>
      {[0, 1, 2, 3].map((i) => <div key={i} style={abs(70, 90 + i * 130, 1040, 1, { background: "rgba(255,255,255,.07)" })} />)}
      <div style={abs(0, 0, 1180, 680, { transformOrigin: "50% 610px", transform: `scaleY(${grow.toFixed(4)})`, willChange: "transform" })}><Bars x={70} y={90} w={1040} h={520} n={18} c={C.indigo} /></div>
      <div style={{ position: "absolute", left: 0, top: 130, transform: `translate3d(${mix(470, 890, tip).toFixed(2)}px, ${(-40 * Math.sin(tip * Math.PI)).toFixed(2)}px, 0)`, willChange: "transform" }}>
        <div style={{ width: 150, height: 84, borderRadius: 14, background: "#F4F7FA", fontSize: 30, fontWeight: 700, color: C.ink, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 10px 30px rgba(0,0,0,.35)" }}>{(11.8 + 3.5 * tip).toFixed(1)}K</div>
      </div>
    </div>
    <div style={abs(1360, 170, 440, 320, { borderRadius: 24, background: "#1B2636" })}><Tx x={40} y={36} s={26} w={500} c="#9FB0C6">Chosen again</Tx><Tx x={40} y={110} s={130} w={700} c="#fff">{`${pct}%`}</Tx></div>
    <div style={abs(1360, 530, 440, 320, { borderRadius: 24, background: "#1B2636" })}><Tx x={40} y={36} s={26} w={500} c="#9FB0C6">Rating</Tx><Tx x={40} y={110} s={130} w={700} c={C.cyan}>{rate.toFixed(1)}</Tx></div>
    <div style={abs(120, 890, 1680, 120, { borderRadius: 24, background: "#1B2636" })}>{[0, 1, 2, 3].map((i) => <div key={i} style={abs(50 + i * 410, 46, 300 - (i % 2) * 70, 26, { borderRadius: 13, background: i === 0 ? C.cyan : "#33425A" })} />)}</div>
  </div>
);

// ---------------------------------------------------------------- Y: the browser
const Y: React.FC<{ t: number }> = ({ t }) => {
  const u = t - at(679), k = 1230 / 1920;
  return (
    <Ground>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "1100px 540px", transform: `scale(${(1.02 + 0.035 * u).toFixed(4)})`, willChange: "transform" }}>
        <Win x={110} y={90} w={1700} h={900}>
          <div style={abs(0, 0, 470, 860, { background: "#FAFBFC", borderRight: `1px solid ${C.line}`, padding: 30 })}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 22, fontWeight: 700 }}><Img src={staticFile("logo/kb-logo-tile.svg")} style={{ width: 34, height: 34, borderRadius: 6 }} />K.B team</div>
            <div style={{ marginTop: 26, padding: 20, borderRadius: 16, background: "#EEEDE9", fontSize: 20, lineHeight: 1.4, fontWeight: 500 }}>{TEXT}</div>
            {["Booking flow added", "Payments connected"].map((s, i) => { const p = E(u, 0.12 + i * 0.3, 0.2, ease.out); return <div key={s} style={{ marginTop: 22, display: "flex", alignItems: "center", gap: 14, fontSize: 22, fontWeight: 500, opacity: p, transform: `translate3d(0, ${((1 - p) * 12).toFixed(2)}px, 0)` }}><Check s={28} />{s}</div>; })}
            {[0, 1, 2].map((i) => <div key={i} style={{ marginTop: i ? 14 : 34, width: [360, 300, 220][i], height: 14, borderRadius: 7, background: "#DADDE3" }} />)}
          </div>
          <div style={abs(470, 0, 1230, 860, { background: C.dark, overflow: "hidden" })}>
            <div style={{ position: "absolute", left: 0, top: 84, width: 1920, height: 1080, transformOrigin: "0 0", transform: `scale(${k})` }}><Dash grow={mix(0.55, 0.8, E(u, 0, 0.8, ease.out))} tip={0} pct={72} rate={4.6} /></div>
          </div>
        </Win>
      </div>
    </Ground>
  );
};

// ---------------------------------------------------------------- Z: the dashboard, close
const Z: React.FC<{ t: number }> = ({ t }) => {
  const u = t - at(699);
  return (
    <AbsoluteFill style={{ background: C.dark }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "760px 520px", transform: `scale(${(1.03 + 0.03 * u).toFixed(4)})`, willChange: "transform" }}>
        <Dash grow={mix(0.8, 1, E(u, 0, 0.7, ease.out))} tip={E(u, 0.15, 1.15, ease.inOut)} pct={u < 0.55 ? 72 : u < 1.05 ? 73 : 74} rate={u < 0.4 ? 4.6 : u < 0.9 ? 4.7 : 4.8} />
      </div>
    </AbsoluteFill>
  );
};

const Comp: React.FC<{ t: number }> = ({ t }) => {
  const ok = useFonts();
  if (!ok) return <AbsoluteFill style={{ background: C.ui }} />;
  if (t < at(679)) return <X t={t} />;
  if (t < at(699)) return <Y t={t} />;
  return <Z t={t} />;
};
const sfx: Sfx[] = [
  { t: 0, kind: "type", note: "0.55 the instruction's last words" },
  { t: at(679) + 0.12, kind: "pop", note: "the first check in the K.B panel" },
  { t: at(699), kind: "sparkle", note: "the dashboard comes alive" },
  { t: at(699) + 1.05, kind: "pop", note: "74%" },
];
export const PKG: Pkg = { id: "R08", Comp, sfx };
