// K.B team film: the storyboard. One still frame per shot of the film, in K.B's brand, with K.B's content.
// Render: npx remotion render src/Storyboard.tsx Board out/sb --sequence --image-format=jpeg --scale=0.25
import React, { useEffect, useState } from "react";
import { AbsoluteFill, Composition, Img, continueRender, delayRender, registerRoot, staticFile, useCurrentFrame } from "remotion";
import { Hand } from "./hand";

const C = { paper: "#F6F6F4", ink: "#293A51", cyan: "#38C8FF", dark: "#111A27", dark2: "#1B2636", ui: "#E9E8E4", line: "rgba(41,58,81,.14)", sub: "#7A8494", mint: "#22C7A0", violet: "#7C6CFF", indigo: "#4F7BFF", amber: "#FFB547", coral: "#FF7A66", green: "#22B573", white: "#FFFFFF" };
const F = "Montserrat, sans-serif";
const SH = "0 30px 70px rgba(41,58,81,.16), 0 4px 14px rgba(41,58,81,.08)";
const FACES = [["Montserrat", "montserrat-var-latin.woff2", "100 900"], ["Montserrat", "montserrat-var-latin-ext.woff2", "100 900"], ["Copperplate CC", "copperplate-cc-heavy.otf", "800"]];
const useFonts = () => {
  const [ok, setOk] = useState(false); const [h] = useState(() => delayRender("fonts"));
  useEffect(() => {
    const el = document.createElement("style");
    el.textContent = FACES.map(([f, file, w]) => `@font-face{font-family:'${f}';src:url(${staticFile("fonts/" + file)});font-weight:${w}}`).join("\n");
    document.head.appendChild(el);
    Promise.all([400, 500, 600, 700].map((w) => document.fonts.load(`${w} 60px Montserrat`))).then(() => { setOk(true); continueRender(h); });
  }, [h]);
  return ok;
};
type P = React.CSSProperties;
const abs = (x: number, y: number, w?: number, h?: number, more: P = {}): P => ({ position: "absolute", left: x, top: y, width: w, height: h, ...more });
const Ground: React.FC<{ tone?: "paper" | "vig" | "ui" | "dark" | "cyan"; children?: React.ReactNode }> = ({ tone = "paper", children }) => {
  const bg = { paper: `radial-gradient(120% 100% at 50% 45%, #FBFBFA 0%, ${C.paper} 60%, #EEEEEB 100%)`, vig: "radial-gradient(90% 90% at 50% 50%, #FFFFFF 0%, #EFEFF1 55%, #D6D7DB 100%)", ui: C.ui, dark: C.dark, cyan: C.cyan }[tone];
  return <AbsoluteFill style={{ background: bg, fontFamily: F, color: C.ink, overflow: "hidden" }}>{children}</AbsoluteFill>;
};
const Tx: React.FC<{ x: number; y: number; s: number; w?: number; c?: string; children: React.ReactNode; style?: P }> = ({ x, y, s, w = 500, c = C.ink, children, style }) => (
  <div style={{ position: "absolute", left: x, top: y, fontSize: s, fontWeight: w, color: c, letterSpacing: -s * 0.03, lineHeight: 1.08, whiteSpace: "nowrap", ...style }}>{children}</div>
);
const Port: React.FC<{ who: string; x: number; y: number; w: number; h: number; cap?: string; rot?: number; o?: number }> = ({ who, x, y, w, h, cap, rot = 0, o = 1 }) => (
  <div style={abs(x, y, w, undefined, { transform: `rotate(${rot}deg)`, opacity: o })}>
    <div style={{ width: w, height: h, borderRadius: 6, overflow: "hidden", boxShadow: "0 14px 34px rgba(41,58,81,.18)" }}>
      <Img src={staticFile(`team/${who}.jpg`)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 22%" }} />
    </div>
    {cap && <div style={{ marginTop: 10, fontSize: 15, fontWeight: 500, color: C.sub, display: "flex", alignItems: "center", gap: 7, whiteSpace: "nowrap" }}><span style={{ width: 7, height: 7, borderRadius: 4, background: C.cyan }} />{cap}</div>}
  </div>
);
const Tile: React.FC<{ x: number; y: number; s: number }> = ({ x, y, s }) => <Img src={staticFile("logo/kb-logo-tile.svg")} style={abs(x - s / 2, y - s / 2, s, s, { borderRadius: s * 0.075 })} />;
const Arrow: React.FC<{ s: number; c: string }> = ({ s, c }) => <svg width={s} height={s} viewBox="0 0 24 24"><path d="M12 19V6M6 12l6-6 6 6" fill="none" stroke={c} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;
const Msg: React.FC<{ x: number; y: number; w: number; text: string; dark?: boolean; big?: number; children?: React.ReactNode }> = ({ x, y, w, text, dark, big = 1, children }) => (
  <div style={abs(x, y, w, undefined, { background: dark ? C.dark2 : C.white, borderRadius: 16 * big, boxShadow: dark ? "none" : "0 20px 50px rgba(41,58,81,.10)", border: dark ? "1px solid rgba(255,255,255,.08)" : "none", padding: `${30 * big}px ${36 * big}px ${24 * big}px` })}>
    {children}
    <div style={{ fontSize: 30 * big, fontWeight: 500, lineHeight: 1.36, color: dark ? "#E8EDF4" : C.ink, letterSpacing: -0.4, minHeight: 82 * big }}>{text}<span style={{ display: "inline-block", width: 2.5 * big, height: 32 * big, background: dark ? "#fff" : C.ink, marginLeft: 3, verticalAlign: "-5px" }} /></div>
    <div style={{ display: "flex", alignItems: "center", gap: 16 * big, marginTop: 18 * big, fontSize: 21 * big, fontWeight: 600, color: dark ? "#C5CEDB" : C.ink }}>
      <span style={{ fontSize: 30 * big, fontWeight: 400 }}>+</span><span style={{ width: 1, height: 26 * big, background: dark ? "rgba(255,255,255,.15)" : C.line }} />
      <Img src={staticFile("logo/kb-logo-tile.svg")} style={{ width: 28 * big, height: 28 * big, borderRadius: 5 }} /><span>K.B team</span>
      <span style={{ marginLeft: "auto", fontWeight: 500 }}>Send</span>
      <div style={{ width: 44 * big, height: 44 * big, borderRadius: 11 * big, background: C.cyan, display: "flex", alignItems: "center", justifyContent: "center" }}><Arrow s={24 * big} c={C.ink} /></div>
    </div>
  </div>
);
const Shot: React.FC<{ src: string; dim?: number; children?: React.ReactNode }> = ({ src, dim = 0, children }) => (
  <AbsoluteFill style={{ fontFamily: F }}><Img src={staticFile(`sb/${src}.jpg`)} style={{ width: "100%", height: "100%", objectFit: "cover" }} /><AbsoluteFill style={{ background: `rgba(10,16,26,${dim})` }} />{children}</AbsoluteFill>
);
const Over: React.FC<{ text: string }> = ({ text }) => (
  <div style={abs(560, 470, 820, undefined, { color: "#fff", fontSize: 40, fontWeight: 500, lineHeight: 1.3, letterSpacing: -0.6, textShadow: "0 2px 18px rgba(0,0,0,.45)" })}>{text}
    <div style={abs(740, 108, 40, 40, { borderRadius: 10, background: C.cyan, display: "flex", alignItems: "center", justifyContent: "center" })}><Arrow s={22} c={C.ink} /></div></div>
);
// five simple K.B pictograms
const Glyph: React.FC<{ k: number; s: number; c?: string }> = ({ k, s, c = C.ink }) => (
  <svg width={s} height={s} viewBox="0 0 100 100">
    {k === 0 && <g fill={c}><circle cx="50" cy="50" r="15" /><circle cx="50" cy="15" r="13" /><circle cx="50" cy="85" r="13" /><circle cx="15" cy="50" r="13" /><circle cx="85" cy="50" r="13" /><rect x="44" y="15" width="12" height="70" /><rect x="15" y="44" width="70" height="12" /></g>}
    {k === 1 && <g fill="none" stroke={c} strokeWidth="15" strokeLinejoin="round"><path d="M36 14 L10 50 L36 86" /><path d="M64 14 L90 50 L64 86" /></g>}
    {k === 2 && <g fill={c}><rect x="6" y="6" width="88" height="88" rx="24" /><path d="M50 76V28M30 46l20-20 20 20" fill="none" stroke="#F6F6F4" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" /></g>}
    {k === 3 && <path fill={c} d="M50 2 C55 32 68 45 98 50 C68 55 55 68 50 98 C45 68 32 55 2 50 C32 45 45 32 50 2Z" />}
    {k === 4 && <g fill={c}>{[0, 1, 2].flatMap((i) => [0, 1, 2].map((j) => <rect key={`${i}${j}`} x={8 + i * 30} y={8 + j * 30} width="24" height="24" rx="6" />))}</g>}
  </svg>
);
const Bar: React.FC<{ x: number; y: number; w: number; h: number; c?: string; r?: number }> = ({ x, y, w, h, c = "#DADDE3", r }) => <div style={abs(x, y, w, h, { background: c, borderRadius: r ?? h / 2 })} />;
const Win: React.FC<{ x: number; y: number; w: number; h: number; dark?: boolean; children?: React.ReactNode; bar?: boolean }> = ({ x, y, w, h, dark, children, bar = true }) => (
  <div style={abs(x, y, w, h, { background: dark ? "#141D2B" : C.white, borderRadius: 16, boxShadow: SH, overflow: "hidden" })}>
    {bar && <div style={{ height: 40, background: dark ? "#0F1722" : "#F1F2F4", display: "flex", alignItems: "center", gap: 8, paddingLeft: 16 }}>{["#FF6059", "#FFBD2E", "#28C941"].map((c) => <span key={c} style={{ width: 11, height: 11, borderRadius: 6, background: c }} />)}</div>}
    <div style={{ position: "relative", width: "100%", height: h - (bar ? 40 : 0) }}>{children}</div>
  </div>
);
const Tool: React.FC<{ n: string; x: number; y: number; s: number; navy?: boolean; rot?: number }> = ({ n, x, y, s, navy, rot = 0 }) => (
  <div style={abs(x, y, s, s, { borderRadius: s * 0.22, background: navy ? C.ink : C.white, boxShadow: "0 12px 30px rgba(41,58,81,.14)", display: "flex", alignItems: "center", justifyContent: "center", transform: `rotate(${rot}deg)` })}><Img src={staticFile(`tools/${n}.png`)} style={{ width: "62%", height: "62%", objectFit: "contain" }} /></div>
);
const Check: React.FC<{ s?: number }> = ({ s = 30 }) => <div style={{ width: s, height: s, borderRadius: s / 2, background: C.green, display: "inline-flex", alignItems: "center", justifyContent: "center", flex: "none" }}><svg width={s * 0.6} height={s * 0.6} viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" /></svg></div>;
const TEAM = ["robin", "tom", "youri", "karl", "cedric"];
const ROLE: Record<string, string> = { robin: "Founder & CEO", tom: "Co-Founder & CTO", youri: "Software Engineering", karl: "Commercial Technology", cedric: "Fractional CSO & Advisor" };
// ---- a few small UI pieces reused in several frames
const FlowCard: React.FC<{ x: number; y: number; s?: number; done?: number }> = ({ x, y, s = 1, done = 2 }) => (
  <div style={abs(x, y, 420 * s, 780 * s, { background: C.white, borderRadius: 34 * s, boxShadow: SH, padding: 30 * s })}>
    <div style={{ fontSize: 22 * s, fontWeight: 700, letterSpacing: 1.2 * s, color: C.ink }}>FOLLOW-UPS</div><div style={{ fontSize: 17 * s, color: C.sub, marginTop: 4 * s, fontWeight: 500 }}>runs by itself</div>
    {["New lead", "Follow-up sent", "CRM updated", "Team notified"].map((t, i) => (
      <div key={t} style={{ marginTop: 22 * s, height: 124 * s, borderRadius: 22 * s, background: i < done ? "#E9F8F1" : "#F2F4F7", border: `2px solid ${i < done ? "#BFE9D5" : "transparent"}`, display: "flex", alignItems: "center", gap: 18 * s, padding: `0 ${22 * s}px` }}>
        <div style={{ width: 64 * s, height: 64 * s, borderRadius: 18 * s, background: [C.ink, C.cyan, C.indigo, C.mint][i], display: "flex", alignItems: "center", justifyContent: "center" }}><Glyph k={[0, 2, 4, 3][i]} s={34 * s} c="#fff" /></div>
        <div style={{ fontSize: 25 * s, fontWeight: 600 }}>{t}</div><div style={{ marginLeft: "auto" }}>{i < done ? <Check s={34 * s} /> : <div style={{ width: 34 * s, height: 34 * s, borderRadius: 17 * s, border: `3px solid #C9CFD8` }} />}</div>
      </div>))}
  </div>
);
const Rank: React.FC<{ x: number; y: number; w: number; at: number }> = ({ x, y, w, at }) => (
  <div style={abs(x, y, w)}>
    <div style={{ fontSize: 46, fontWeight: 600, letterSpacing: 6, color: "#E8EDF4", fontFamily: "ui-monospace, Menlo, monospace" }}>RANKING</div>
    {Array.from({ length: 7 }, (_, i) => { const me = i === at; return (
      <div key={i} style={{ marginTop: 14, height: 84, borderRadius: 12, background: me ? "#F4F7FA" : "#1B2636", display: "flex", alignItems: "center", gap: 26, padding: "0 28px", boxShadow: me ? "0 14px 40px rgba(56,200,255,.35)" : "none" }}>
        <div style={{ fontSize: 34, fontWeight: 500, color: me ? C.ink : "#C5CEDB", width: 34, fontFamily: "ui-monospace, Menlo, monospace" }}>{i + 1}</div>
        <div style={{ width: 34, height: 34, borderRadius: 8, background: me ? C.cyan : ["#4F7BFF", "#22C7A0", "#FFB547", "#7C6CFF", "#FF7A66", "#8FA0B6", "#4F7BFF"][i] }} />
        {me ? <div style={{ fontSize: 30, fontWeight: 700, color: C.ink }}>Your business</div> : <div style={{ width: 260 - (i % 3) * 50, height: 14, borderRadius: 7, background: "#33425A" }} />}
        <div style={{ marginLeft: "auto", fontSize: 24, fontWeight: 600, color: me ? C.green : "#5E6E86", fontFamily: "ui-monospace, Menlo, monospace" }}>{me ? "▲ 5" : "—"}</div>
      </div>); })}
  </div>
);
const Bars: React.FC<{ x: number; y: number; w: number; h: number; n?: number; c?: string }> = ({ x, y, w, h, n = 14, c = C.indigo }) => (
  <div style={abs(x, y, w, h, { display: "flex", alignItems: "flex-end", gap: w / n * 0.28 })}>{Array.from({ length: n }, (_, i) => <div key={i} style={{ flex: 1, height: `${30 + 62 * Math.abs(Math.sin(i * 1.3 + 0.6)) * (0.55 + i / n * 0.45)}%`, background: i === n - 3 ? C.cyan : c, borderRadius: "5px 5px 0 0" }} />)}</div>
);
const AppUI: React.FC<{ s?: number; wire?: boolean }> = ({ s = 1, wire }) => { const g = wire ? "#D5D9DF" : undefined; return (
  <div style={{ position: "relative", width: 1500 * s, height: 800 * s, transform: `scale(${s})`, transformOrigin: "0 0" }}>
    <div style={abs(0, 0, 320, 800, { background: wire ? "#EEF0F3" : "#F4F6F9", borderRight: `1px solid ${C.line}` })}>
      <div style={abs(30, 30, 56, 56, { borderRadius: 14, background: g ?? C.ink })} />{[0, 1, 2, 3, 4].map((i) => <Bar key={i} x={30} y={130 + i * 64} w={210 - (i % 2) * 50} h={18} c={i === 0 && !wire ? C.cyan : "#D5D9DF"} />)}
    </div>
    <div style={abs(360, 34, 620, 44, { fontSize: 38, fontWeight: 700 })}>{wire ? <Bar x={0} y={8} w={340} h={26} c="#C9CED6" /> : "Bookings"}</div>
    {[0, 1, 2].map((i) => <div key={i} style={abs(360 + i * 280, 110, 256, 150, { borderRadius: 20, background: g ?? [C.ink, C.cyan, "#EEF3FF"][i], border: wire ? "2px dashed #B9C0CA" : "none" })}>{!wire && <><Bar x={24} y={26} w={120} h={12} c={i === 0 ? "rgba(255,255,255,.4)" : "rgba(41,58,81,.3)"} /><div style={abs(24, 62, 200, 60, { fontSize: 50, fontWeight: 700, color: i === 0 ? "#fff" : C.ink })}>{["248", "92%", "4.8"][i]}</div></>}</div>)}
    <div style={abs(360, 290, 816, 470, { borderRadius: 22, background: wire ? "#EEF0F3" : "#FFFFFF", border: wire ? "2px dashed #B9C0CA" : `1px solid ${C.line}` })}>{!wire && <Bars x={40} y={70} w={736} h={360} />}</div>
    <div style={abs(1210, 110, 260, 650, { borderRadius: 22, background: wire ? "#EEF0F3" : "#F4F6F9", border: wire ? "2px dashed #B9C0CA" : "none" })}>{[0, 1, 2, 3, 4].map((i) => <div key={i} style={abs(20, 24 + i * 122, 220, 104, { borderRadius: 16, background: wire ? "#E1E4E9" : "#fff" })}><div style={abs(16, 20, 64, 64, { borderRadius: 14, background: g ?? [C.cyan, C.mint, C.amber, C.violet, C.coral][i] })} /><Bar x={96} y={30} w={100} h={12} c="#C9CED6" /><Bar x={96} y={58} w={70} h={10} /></div>)}</div>
  </div>); };

// ---------------------------------------------------------------- the frames, in film order
const FR: React.FC[] = [
  // A  the opening words and the image card
  () => <Ground><Tx x={560} y={516} s={46} w={600}>The right</Tx><Port who="tom" x={830} y={400} w={300} h={280} /><Tx x={1176} y={516} s={46} w={600}>team</Tx></Ground>,
  // B1  the first screen: a flow K.B built
  () => <Ground><Win x={470} y={150} w={1300} h={760}><div style={abs(0, 0, 1300, 720, { background: "#F7F9FB", backgroundImage: `radial-gradient(${C.line} 1.5px, transparent 1.5px)`, backgroundSize: "40px 40px" })} />
    <svg style={abs(0, 0)} width="1300" height="720"><path d="M270 360 H520 M690 360 C790 360 790 200 900 200 M690 360 C790 360 790 520 900 520" fill="none" stroke={C.cyan} strokeWidth="6" /></svg>
    <Tool n="pipedrive" x={110} y={280} s={160} navy /><div style={abs(520, 275, 170, 170, { borderRadius: 38, background: C.white, border: `5px solid ${C.cyan}`, boxShadow: SH, display: "flex", alignItems: "center", justifyContent: "center" })}><Img src={staticFile("logo/kb-logo-tile.svg")} style={{ width: 96, height: 96, borderRadius: 14 }} /></div>
    <Tool n="n8n-logo2" x={900} y={120} s={160} /><Tool n="odoo-1" x={900} y={440} s={160} navy /></Win></Ground>,
  // B2  the second screen: found online
  () => <Ground><Win x={150} y={150} w={1300} h={760} dark><Rank x={60} y={40} w={620} at={1} /><div style={abs(740, 60, 500, 600, { borderRadius: 20, background: "#1B2636" })}><Tx x={36} y={32} s={22} w={600} c="#9FB0C6">Visitors</Tx><Tx x={36} y={66} s={76} w={700} c="#fff">+38%</Tx><Bars x={36} y={220} w={428} h={340} n={12} c={C.indigo} /></div></Win></Ground>,
  // B3  the third screen: a product
  () => <Ground><div style={abs(735, 110, 450, 860, { borderRadius: 44, background: C.white, boxShadow: SH, overflow: "hidden" })}>
    <div style={abs(0, 0, 450, 470, { background: `linear-gradient(150deg, ${C.cyan}, ${C.indigo})` })}><Tx x={36} y={40} s={24} w={600} c="#fff">Good morning</Tx><Tx x={36} y={330} s={60} w={700} c="#fff">Book a table</Tx></div>
    {[0, 1, 2].map((i) => <div key={i} style={abs(30 + i * 134, 500, 122, 150, { borderRadius: 20, background: ["#EEF3FF", "#E6F7FF", "#E9F8F1"][i] })} />)}
    <div style={abs(30, 690, 390, 110, { borderRadius: 28, background: C.ink, color: "#fff", fontSize: 32, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center" })}>Confirm booking</div></div></Ground>,
  // D  the words and the team
  () => <Ground><Tx x={690} y={380} s={132} w={600} style={{ lineHeight: 1.02 }}>For what</Tx><Tx x={560} y={520} s={132} w={600}>comes next</Tx>
    <Port who="robin" x={150} y={170} w={210} h={230} cap={ROLE.robin} /><Port who="youri" x={1395} y={120} w={235} h={260} cap={ROLE.youri} /><Port who="karl" x={1560} y={560} w={200} h={220} cap={ROLE.karl} /><Port who="cedric" x={330} y={700} w={190} h={210} cap={ROLE.cedric} /><Port who="tom" x={1010} y={770} w={190} h={210} cap={ROLE.tom} /></Ground>,
  // E1  the five portraits in a row
  () => <Ground>{TEAM.map((w, i) => <Port key={w} who={w} x={960 - 2.5 * 210 + i * 210 + 10} y={445} w={190} h={190} />)}</Ground>,
  // E2  the logo
  () => <Ground><div style={abs(700, 0, 1, 1080, { background: C.line })} /><div style={abs(0, 730, 1920, 1, { background: C.line })} /><Tile x={960} y={540} s={200} /></Ground>,
  // F  filmed flash cuts: a team at work
  () => <Shot src="F" />,
  // G  the caret and the typed words
  () => <Ground tone="vig"><Tx x={690} y={486} s={96} w={400} c="#1F2A3A">Can you help</Tx><div style={abs(1300, 474, 4, 124, { background: "#1F2A3A" })} /></Ground>,
  // H  macro
  () => <Ground tone="vig"><Tx x={-60} y={130} s={860} w={400} c="#1F2A3A" style={{ letterSpacing: -34 }}>auto</Tx><div style={abs(1830, 150, 24, 800, { background: "#1F2A3A" })} /><AbsoluteFill style={{ backgroundImage: "repeating-linear-gradient(90deg, rgba(255,60,60,.05) 0 2px, rgba(60,255,120,.05) 2px 4px, rgba(60,120,255,.05) 4px 6px)", mixBlendMode: "multiply" }} /></Ground>,
  // I  the message and the click
  () => <Ground tone="ui"><Msg x={405} y={400} w={1110} text="Can you help us automate our follow-ups and keep the CRM up to date?" /><Hand x={1456} y={640} size={210} tiltX={-8} /></Ground>,
  // J  a K.B glyph
  () => <Ground tone="ui"><div style={abs(810, 390)}><Glyph k={0} s={300} /></div></Ground>,
  // K  the pieces fly in around the card
  () => <Ground tone="ui"><Tool n="pipedrive" x={170} y={150} s={190} navy rot={-6} /><Tool n="n8n-logo2" x={390} y={520} s={170} rot={5} /><Tool n="makecom-removebg-preview" x={150} y={770} s={200} rot={-4} /><Tool n="odoo-1" x={1420} y={170} s={200} navy rot={6} /><Tool n="resend" x={1560} y={540} s={170} navy rot={-5} /><Tool n="supabase" x={1330} y={800} s={180} rot={4} />
    {[[330, 110], [640, 330], [1250, 420], [1700, 420], [620, 900], [1240, 760]].map(([x, y], i) => <div key={i} style={abs(x, y, 30, 30, { borderRadius: 15, background: C.cyan })} />)}
    <FlowCard x={750} y={150} done={0} /></Ground>,
  // L  the card at work
  () => <Ground tone="ui"><FlowCard x={750} y={150} done={3} /></Ground>,
  // M  full-screen flash cuts: records, placeholders filling in
  () => <Ground><div style={abs(-60, 130, 2040, 820, { display: "flex", gap: 22 })}>{[0, 1, 2, 3, 4].map((i) => (
    <div key={i} style={{ flex: 1, borderRadius: 20, background: i === 0 || i === 4 ? C.cyan : C.white, boxShadow: SH, position: "relative", overflow: "hidden" }}>
      {i !== 0 && i !== 4 && <><div style={abs(0, 0, 400, 300, { background: [C.ink, "#EEF3FF", "#E9F8F1", C.ink, C.ink][i] })}><div style={abs(40, 60, 150, 150, { borderRadius: 75, background: [C.cyan, C.indigo, C.mint, C.cyan, C.cyan][i] })} /></div>
        {[0, 1, 2, 3].map((k) => <Bar key={k} x={36} y={350 + k * 70} w={[300, 220, 260, 180][k]} h={22} c={k === 0 ? C.ink : "#D5D9DF"} />)}<div style={abs(36, 690, 180, 70, { borderRadius: 35, background: C.green })} /></>}
    </div>))}</div></Ground>,
  // N  macro
  () => <Ground tone="vig"><Tx x={-110} y={-140} s={1500} w={500} c="#111A27" style={{ letterSpacing: -60 }}>ou</Tx></Ground>,
  // O  the second message
  () => <Ground tone="ui"><Msg x={405} y={400} w={1110} text="We want to be found by the right customers, in search and in AI answers." /></Ground>,
  // P  circles on dark
  () => <Ground tone="dark"><div style={abs(0, 300, 1920, 6, { background: "#1E2A3C" })} /><div style={abs(0, 800, 1920, 6, { background: "#1E2A3C" })} />
    <div style={abs(-140, 620, 420, 420, { borderRadius: 210, background: C.violet })} /><div style={abs(560, 210, 620, 620, { borderRadius: 310, background: C.cyan, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 200, fontWeight: 600, color: C.ink })}>?</div><div style={abs(1330, -160, 600, 600, { borderRadius: 300, background: C.mint, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 150, fontWeight: 600, color: C.ink, paddingTop: 120 })}>AI</div></Ground>,
  // Q  the browser: the K.B panel and the site
  () => <Ground><Win x={110} y={90} w={1700} h={900}>
    <div style={abs(0, 0, 470, 860, { background: "#FAFBFC", borderRight: `1px solid ${C.line}`, padding: 30 })}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 22, fontWeight: 700 }}><Img src={staticFile("logo/kb-logo-tile.svg")} style={{ width: 34, height: 34, borderRadius: 6 }} />K.B team</div>
      {["Technical SEO", "Page structure", "Metadata", "Internal links", "Structured information"].map((t) => <div key={t} style={{ marginTop: 22, display: "flex", alignItems: "center", gap: 14, fontSize: 23, fontWeight: 500 }}><Check s={28} />{t}</div>)}
      <div style={{ marginTop: 34, padding: 22, borderRadius: 16, background: "#EEF3FF", fontSize: 21, lineHeight: 1.4, fontWeight: 500 }}>Your pages now read clearly to search engines, AI tools and people.</div></div>
    <div style={abs(470, 0, 1230, 860, { background: C.dark })}><div style={abs(60, 60, 1110, 90, { borderRadius: 45, background: "#1B2636", display: "flex", alignItems: "center", paddingLeft: 40, fontSize: 30, color: "#C5CEDB", fontWeight: 500 })}>best near me</div>
      {[[150, 300, 150, C.cyan], [420, 240, 110, C.mint], [640, 360, 130, C.violet], [880, 260, 100, C.amber], [1040, 380, 120, C.coral]].map(([x, y, s, c], i) => <div key={i} style={abs(x as number, y as number, s as number, s as number, { borderRadius: 999, background: c as string })} />)}
      <div style={abs(60, 560, 1110, 240, { borderRadius: 24, background: "#F4F7FA", display: "flex", alignItems: "center", gap: 30, paddingLeft: 40 })}><div style={{ width: 110, height: 110, borderRadius: 26, background: C.cyan }} /><div><div style={{ fontSize: 46, fontWeight: 700 }}>Your business</div><div style={{ fontSize: 26, color: C.sub, fontWeight: 500, marginTop: 6 }}>the first result</div></div></div></div></Win></Ground>,
  // R  filmed: a customer
  () => <Shot src="R2" />,
  // S  filmed hands, and the row that climbs
  () => <AbsoluteFill style={{ background: C.dark, fontFamily: F }}><div style={abs(0, 0, 760, 1080, { overflow: "hidden" })}><Img src={staticFile("sb/S2.jpg")} style={{ height: "100%", width: 1920, objectFit: "cover", marginLeft: -420 }} /></div><Rank x={860} y={90} w={960} at={2} /></AbsoluteFill>,
  // T  the dark message with attachments
  () => <Ground tone="dark"><Msg x={405} y={380} w={1110} dark text="Turn these sketches into an app our customers can use.">
    <div style={{ display: "flex", gap: 16, marginBottom: 26 }}>{[0, 1, 2, 3].map((i) => <div key={i} style={{ width: 96, height: 96, borderRadius: 12, background: i < 2 ? "#F4F1EA" : "transparent", border: i < 2 ? "none" : "2px solid rgba(255,255,255,.25)", position: "relative" }}>{i < 2 && <svg width="96" height="96" viewBox="0 0 96 96"><rect x="18" y="14" width="60" height="68" rx="6" fill="none" stroke="#5B6470" strokeWidth="2.5" /><path d="M26 30h44M26 44h30M26 58h38" stroke="#5B6470" strokeWidth="2.5" /></svg>}</div>)}</div></Msg></Ground>,
  // U1  the pencil sketch
  () => <AbsoluteFill style={{ background: "#F3F0E9" }}><svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{ filter: "url(#rough)" }}><defs><filter id="rough"><feTurbulence baseFrequency="0.02" numOctaves="2" seed="3" /><feDisplacementMap in="SourceGraphic" scale="7" /></filter></defs>
    <g fill="none" stroke="#4C5360" strokeWidth="3.5" strokeLinecap="round"><rect x="660" y="120" width="420" height="820" rx="50" /><rect x="700" y="200" width="340" height="230" rx="16" /><path d="M700 480h340M700 540h250M700 600h300" /><rect x="700" y="680" width="100" height="120" rx="12" /><rect x="820" y="680" width="100" height="120" rx="12" /><rect x="940" y="680" width="100" height="120" rx="12" /><rect x="720" y="840" width="300" height="60" rx="30" />
      <path d="M1130 300 C1250 260 1300 300 1420 280M1130 330h260M1130 520 C1200 500 1330 540 1460 510M1130 550h200" /><path d="M560 640 C470 600 420 700 330 660M300 690l30-30 12 40" /><circle cx="1300" cy="760" r="90" /><path d="M1240 760l40 40 80-90" /></g>
    <g fill="#4C5360" fontFamily="'Comic Sans MS', cursive" fontSize="44"><text x="1130" y="240">book in 2 taps</text><text x="1130" y="470">show what's free</text><text x="210" y="620">our app</text></g></svg></AbsoluteFill>,
  // U2  the wireframe
  () => <AbsoluteFill style={{ background: "#F7F8FA" }}><div style={abs(210, 140)}><AppUI wire /></div></AbsoluteFill>,
  // V  the finished product
  () => <Ground tone="ui"><Win x={170} y={110} w={1580} h={860} bar={false}><div style={abs(40, 30)}><AppUI /></div>{[[520, 130], [1010, 240], [800, 560], [1420, 420]].map(([x, y], i) => <div key={i} style={abs(x, y, 44, 44, { borderRadius: 22, background: C.cyan, border: "5px solid #fff", boxShadow: "0 6px 16px rgba(41,58,81,.25)" })} />)}</Win></Ground>,
  // W  filmed: the founder at work
  () => <Shot src="W" />,
  // X  the UI close-up
  () => <Ground tone="ui"><div style={abs(60, 60, 1480, 960, { background: "#FBFBFA", borderRadius: 28 })} /><div style={abs(1600, 0, 320, 1080, { background: C.dark })} />
    <Tx x={150} y={130} s={50} w={600}>Suggestions</Tx><div style={abs(140, 240, 1500, 100, { display: "flex", gap: 26 })}>{["Add onboarding emails", "Sync payments"].map((t) => <div key={t} style={{ height: 100, borderRadius: 24, background: "#EEEDE9", fontSize: 44, fontWeight: 500, padding: "0 40px", display: "flex", alignItems: "center", whiteSpace: "nowrap" }}>{t}</div>)}</div>
    <div style={abs(120, 420, 1400, 540, { borderRadius: 34, background: C.white, boxShadow: SH })} /><div style={abs(180, 480, 1280, 200, { fontSize: 56, fontWeight: 500, lineHeight: 1.3, letterSpacing: -1.2 })}>Now add online booking, so customers can order in two taps<span style={{ display: "inline-block", width: 4, height: 60, background: C.cyan, marginLeft: 6, verticalAlign: "-8px" }} /></div>
    <div style={abs(180, 820, 1280, 90, { display: "flex", alignItems: "center", gap: 28, fontSize: 50, fontWeight: 600 })}><span style={{ fontWeight: 400, fontSize: 64 }}>+</span><Img src={staticFile("logo/kb-logo-tile.svg")} style={{ width: 62, height: 62, borderRadius: 10 }} />K.B team<span style={{ marginLeft: "auto", fontWeight: 500 }}>Send</span><div style={{ width: 96, height: 96, borderRadius: 22, background: C.ink, display: "flex", alignItems: "center", justifyContent: "center" }}><Arrow s={52} c="#fff" /></div></div></Ground>,
  // Y/Z  the dashboard: people choose it
  () => <Ground tone="dark"><Tx x={120} y={90} s={36} w={600} c="#C5CEDB">New customers</Tx><div style={abs(120, 170, 1180, 680, { borderRadius: 24, background: "#1B2636" })}><Bars x={70} y={90} w={1040} h={520} n={18} c={C.indigo} /><div style={abs(820, 130, 150, 84, { borderRadius: 14, background: "#F4F7FA", fontSize: 30, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" })}>15.3K</div></div>
    <div style={abs(1360, 170, 440, 320, { borderRadius: 24, background: "#1B2636" })}><Tx x={40} y={36} s={26} w={500} c="#9FB0C6">Chosen again</Tx><Tx x={40} y={110} s={130} w={700} c="#fff">74%</Tx></div><div style={abs(1360, 530, 440, 320, { borderRadius: 24, background: "#1B2636" })}><Tx x={40} y={36} s={26} w={500} c="#9FB0C6">Rating</Tx><Tx x={40} y={110} s={130} w={700} c={C.cyan}>4.8</Tx></div></Ground>,
  // AA  filmed: one business, one wish
  () => <Shot src="AA" dim={0.28}><Over text="Can you help us automate our follow-ups and keep the CRM up to date?" /></Shot>,
  // AC  filmed: another
  () => <Shot src="AC" dim={0.34}><Over text="We want to be found by the right customers, in search and in AI answers." /></Shot>,
  // AE  one button
  () => <Ground><div style={abs(810, 390, 300, 300, { borderRadius: 66, background: C.cyan, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 30px 70px rgba(56,200,255,.45)" })}><Arrow s={150} c={C.ink} /></div><Hand x={1040} y={640} size={330} tiltX={-14} press={0.6} /></Ground>,
  // AF  the burst
  () => <Ground><div style={abs(330, 150, 620, 400, { borderRadius: 22, background: C.dark })}><Bars x={50} y={60} w={520} h={290} n={12} /></div>
    <div style={abs(1010, 110, 520, 330, { borderRadius: 22, background: "#F4F1EA", boxShadow: SH, padding: 44 })}><div style={{ fontSize: 150, fontWeight: 600, fontFamily: "ui-monospace, Menlo, monospace", letterSpacing: -6 }}>100+</div><div style={{ fontSize: 26, letterSpacing: 3, fontWeight: 600, color: C.sub }}>AUTOMATIONS BUILT</div></div>
    <Port who="karl" x={860} y={470} w={300} h={300} rot={-3} /><div style={abs(1230, 500, 430, 300, { borderRadius: 22, background: C.indigo })}><div style={abs(50, 50, 200, 200, { borderRadius: 100, background: "#DCE6FF" })} /></div>
    <div style={abs(420, 620, 380, 260, { borderRadius: 22, background: C.white, boxShadow: SH, padding: 40 })}><div style={{ fontSize: 120, fontWeight: 600, fontFamily: "ui-monospace, Menlo, monospace" }}>25</div><div style={{ fontSize: 22, letterSpacing: 3, fontWeight: 600, color: C.sub }}>CLIENT PROJECTS</div></div>
    <div style={abs(840, 860, 240, 240, { borderRadius: 54, background: C.cyan, display: "flex", alignItems: "center", justifyContent: "center" })}><Arrow s={120} c={C.ink} /></div></Ground>,
  // AG  the collage: think big
  () => <Ground tone="dark"><div style={abs(380, 250, 560, 460, { background: `linear-gradient(140deg, ${C.indigo}, ${C.cyan} 60%, ${C.mint})` })} /><div style={abs(880, 110, 320, 320, { background: "#2A3648" })}><svg width="320" height="320"><ellipse cx="160" cy="160" rx="110" ry="50" fill="none" stroke="#fff" strokeWidth="6" strokeDasharray="2 22" strokeLinecap="round" transform="rotate(-20 160 160)" /></svg></div>
    <div style={abs(1140, 380, 240, 300, { background: C.mint })} /><div style={abs(1380, 300, 190, 190, { background: C.cyan })} /><div style={abs(950, 640, 190, 190, { background: "#F4F1EA" })}><div style={abs(40, 40, 110, 110, { borderRadius: 55, background: C.ink })} /></div><div style={abs(1290, 540, 320, 320, { background: "#8B95A5" })}><svg width="320" height="320"><path d="M60 90 C160 40 240 110 150 150 C60 190 250 190 180 250" fill="none" stroke={C.ink} strokeWidth="7" /></svg></div></Ground>,
  // AH  the window: build well
  () => <Ground tone="dark"><div style={abs(400, 130, 1120, 820, { background: "#F1EFEA", borderRadius: 6, overflow: "hidden" })}><div style={abs(40, 110, 540, 520, { background: `linear-gradient(140deg, ${C.indigo}, ${C.cyan} 60%, ${C.mint})` })} />
    {[0, 1, 2, 3, 4, 5].map((i) => <div key={i} style={abs(620 + (i % 3) * 160, 110 + Math.floor(i / 3) * 270, 144, 200, { background: ["#2A3648", C.mint, C.cyan, "#8B95A5", C.indigo, "#F4F1EA"][i], border: i === 5 ? `1px solid ${C.line}` : "none" })} />)}
    <Tx x={40} y={660} s={40} w={500}>Your product</Tx><div style={abs(40, 760, 1040, 6, { background: "#D5D9DF" })}><div style={{ width: 260, height: 6, background: C.ink }} /></div></div></Ground>,
  // AI/AJ  the canvas: grow with us
  () => <Ground><div style={abs(-80, -60, 2100, 1200, { backgroundImage: `radial-gradient(${C.line} 2px, transparent 2px)`, backgroundSize: "36px 36px" })} />
    <div style={abs(60, 60, 430, 250, { borderRadius: 16, background: C.dark, overflow: "hidden" })}><Bars x={30} y={40} w={370} h={190} n={10} /></div><div style={abs(540, 40, 560, 320, { borderRadius: 16, background: "#F7F9FB", boxShadow: SH })}><svg width="560" height="320"><path d="M110 160 H240 M330 160 C380 160 380 90 440 90 M330 160 C380 160 380 230 440 230" fill="none" stroke={C.cyan} strokeWidth="5" /></svg><Tool n="pipedrive" x={40} y={120} s={80} navy /><Tool n="n8n-logo2" x={440} y={50} s={80} /><Tool n="odoo-1" x={440} y={190} s={80} navy /><div style={abs(245, 118, 84, 84, { borderRadius: 20, border: `4px solid ${C.cyan}`, background: "#fff" })} /></div>
    <div style={abs(1150, 60, 300, 300, { borderRadius: 16, background: C.cyan, padding: 30, fontSize: 96, fontWeight: 700 })}>25<div style={{ fontSize: 22, fontWeight: 600 }}>client projects</div></div><div style={abs(1500, 60, 380, 300, { borderRadius: 16, background: C.ink, padding: 30, fontSize: 96, fontWeight: 700, color: "#fff" })}>100+<div style={{ fontSize: 22, fontWeight: 600 }}>automations</div></div>
    <div style={abs(60, 370, 300, 420, { borderRadius: 30, background: C.white, boxShadow: SH })}><div style={abs(0, 0, 300, 220, { borderRadius: "30px 30px 0 0", background: `linear-gradient(150deg, ${C.cyan}, ${C.indigo})` })} /><Bar x={30} y={260} w={200} h={18} c={C.ink} /><Bar x={30} y={300} w={140} h={14} /></div>
    <div style={abs(420, 420, 700, 380, { borderRadius: 16, background: C.dark, padding: 30 })}><Rank x={0} y={0} w={640} at={0} /></div>
    <div style={abs(1180, 420, 700, 380, { borderRadius: 16, background: C.white, boxShadow: SH, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, padding: 26 })}>{["abroad-internships", "tale-forge", "venga-travel", "worldwiders", "olea-hospitality", "mindmymind", "jongleren-es", "custom-staffing"].map((n) => <div key={n} style={{ borderRadius: 12, background: "#F4F6F9", display: "flex", alignItems: "center", justifyContent: "center" }}><Img src={staticFile(`clients/${n}-logo.png`)} style={{ maxWidth: "78%", maxHeight: "62%", objectFit: "contain" }} /></div>)}</div>
    <div style={abs(60, 850, 560, 260, { borderRadius: 16, background: "#FFF6C9", padding: 30, fontSize: 30, fontWeight: 600 })}>Next: the customer app</div><div style={abs(680, 850, 520, 260, { borderRadius: 16, background: C.mint })} /><div style={abs(1260, 850, 620, 260, { borderRadius: 16, background: C.white, boxShadow: SH })}><Bars x={40} y={40} w={540} h={200} n={16} c={C.cyan} /></div>
    {[[505, 330, "K.B"], [1130, 395, "K.B"], [640, 815, "You"]].map(([x, y, t], i) => <div key={i} style={abs(x as number, y as number)}><svg width="34" height="34" viewBox="0 0 24 24"><path d="M3 2l7 19 3-8 8-3z" fill={t === "You" ? C.coral : C.indigo} /></svg><div style={abs(26, 26, undefined, undefined, { background: t === "You" ? C.coral : C.indigo, color: "#fff", fontSize: 20, fontWeight: 700, padding: "5px 12px", borderRadius: 8 })}>{t}</div></div>)}</Ground>,
  // AK  the update
  () => <Ground tone="ui"><div style={abs(60, 0, 1400, 1080, { background: "#FBFBFA" })} /><div style={abs(1620, 0, 300, 1080, { background: C.dark })} />
    <Tx x={150} y={90} s={30} w={700} c={C.sub} style={{ letterSpacing: 3 }}>WHAT WE DID</Tx>{["Process audit with your team", "Built in the open, with your team", "Training and onboarding"].map((t, i) => <div key={t} style={abs(150, 160 + i * 86, 1200, 60, { display: "flex", alignItems: "center", gap: 24, fontSize: 44, fontWeight: 500 })}><Check s={44} />{t}</div>)}
    <Tx x={150} y={470} s={52} w={500}>Involved.</Tx><div style={abs(420, 468, 4, 62, { background: C.ink })} />
    <Tx x={150} y={640} s={42} w={600}>Suggestions</Tx><div style={abs(140, 730, 1300, 100, { display: "flex", gap: 26 })}>{["Plan the next release", "Review the numbers"].map((t) => <div key={t} style={{ height: 96, borderRadius: 24, background: "#EEEDE9", fontSize: 40, fontWeight: 500, padding: "0 40px", display: "flex", alignItems: "center", whiteSpace: "nowrap" }}>{t}</div>)}</div></Ground>,
  // AL  macro: the sentence
  () => <Ground tone="vig"><Tx x={70} y={300} s={190} w={400} c="#1F2A3A" style={{ letterSpacing: -5 }}>Involved.</Tx><Tx x={70} y={540} s={190} w={400} c="#1F2A3A" style={{ letterSpacing: -5 }}>From day one onwar</Tx><AbsoluteFill style={{ backgroundImage: "repeating-linear-gradient(90deg, rgba(255,60,60,.04) 0 2px, rgba(60,255,120,.04) 2px 4px, rgba(60,120,255,.04) 4px 6px)", mixBlendMode: "multiply" }} /></Ground>,
  // AM  the button in the corner
  () => <Ground><div style={abs(-40, 150, 1700, 1000, { background: "#EDEEF0", borderRadius: 40 })} /><div style={abs(-40, 380, 1700, 800, { background: C.white })} /><div style={abs(-40, 600, 1700, 600, { background: C.dark })} />
    <Tx x={300} y={236} s={70} w={400}>×</Tx><Tx x={560} y={236} s={70} w={300} c="#9AA3AF">+</Tx>
    <div style={abs(420, 430, 300, 110, { display: "flex" })}>{["robin", "tom", "youri"].map((w, i) => <Img key={w} src={staticFile(`team/${w}.jpg`)} style={{ width: 110, height: 110, borderRadius: 55, objectFit: "cover", objectPosition: "50% 20%", border: "6px solid #fff", marginLeft: i ? -34 : 0 }} />)}</div>
    <div style={abs(790, 420, 820, 130, { borderRadius: 30, background: C.ink, color: "#fff", fontSize: 54, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", letterSpacing: -1 })}>Book a Free Discovery Call</div><Hand x={1470} y={520} size={300} tiltX={-10} /></Ground>,
  // AN  filmed: the close
  () => <Shot src="AN" dim={0.42}><div style={{ position: "absolute", left: 0, right: 0, top: 462, textAlign: "center", color: "#fff", fontSize: 132, fontWeight: 600, letterSpacing: -5, fontFamily: F }}>Your next chapter<span style={{ display: "inline-block", width: 7, height: 130, background: C.cyan, marginLeft: 10, verticalAlign: "-16px" }} /></div></Shot>,
  // AO  the glyph row
  () => <Ground tone="ui">{[[690, 440], [1230, 440], [690, 640], [1230, 640]].map(([x, y], i) => <div key={i} style={abs(x, y, 8, 8, { background: C.cyan })} />)}<div style={abs(730, 480, 460, 120, { display: "flex", gap: 22, alignItems: "center" })}>{[0, 1, 2, 3, 4].map((k) => <div key={k} style={{ width: 74, height: 74, borderRadius: 8, background: k === 2 ? C.cyan : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}><Glyph k={k} s={62} /></div>)}</div></Ground>,
  // AP  the end
  () => <Ground tone="cyan"><Tile x={960} y={540} s={230} /></Ground>,
];
export const N = FR.length;
const Board: React.FC = () => { const ok = useFonts(); const i = useCurrentFrame(); if (!ok) return <AbsoluteFill style={{ background: C.paper }} />; const Fr = FR[Math.min(i, N - 1)]; return <Fr />; };
registerRoot(() => <Composition id="Board" component={Board} durationInFrames={N} fps={60} width={1920} height={1080} />);
