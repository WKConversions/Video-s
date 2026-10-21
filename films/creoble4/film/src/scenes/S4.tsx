// Builder 4 — hosting (plan/storyboard.md, "B4, hosting"): h3 → h4.
// From Handoff3 the address pill lifts out as a large Glass twin of the address bar ("Skal den på nettet?"), types
// the domain while a setup list ticks, and returns into the pill, now live. The site steps aside for Creoble's
// hosting card (fra 83 kr /md, Betalt årligt), domain and e-mail chips attach, the card morphs into a fixed-price
// chart, then the site comes home and three promises land in a Glass row over it. It ends exactly on Handoff4.
import React from "react";
import { C, Check, EXIT, Glass, HOME, Handoff4, INOUT, Ico, OUT, SANS, SERIF, SHADOW, Scrim, SiteHome, Statement, WIPE, aspring, clamp01, f, k, mix, typed } from "../shared";

/* ---------- local geometry ---------- */
// The Browser's address pill at HOME (320 wide as rendered, 28 tall, 9 px from the top, centred).
const PILL = { x: HOME.x + HOME.w / 2 - 160, y: HOME.y + 9, w: 320, h: 28 };
// The twin's forward position and the setup list under it (one centred unit over the dimmed site).
const TWIN = { x: 460, y: 318, w: 1000, h: 112 };
const LIST = { x: 460, y: 448, w: 1000 };
// The smaller site beside the hosting card, and the card itself (tops aligned with the site's frame).
const SM = { s: 0.56, x: 170, y: 299 };
const CARD = { x: 1068, y: 299, w: 680 };
// Chart geometry inside the card (card px).
const CH = { x0: 44, x1: 636, sage: 262, grey1: 284, grey2: 160, base: 370 };
const COL = (CH.x1 - CH.x0) / 3;

/* ---------- small local helpers ---------- */
const pct = (p: number) => `${Math.round(clamp01(p) * 100)}%`;
const tint = (a: string, b: string, p: number) => `color-mix(in srgb, ${a} ${pct(p)}, ${b})`;
// Mask reveal (the Statement's rise from below the line) without breaking baseline alignment: a clip, not overflow.
const Rv: React.FC<{ p: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ p, children, style }) => (
  <span style={{ display: "inline-block", clipPath: "inset(-40% -14% -6% -14%)", ...style }}>
    <span style={{ display: "inline-block", transform: `translateY(${(1 - clamp01(p)) * 112}%)` }}>{children}</span>
  </span>
);
// A polyline drawn to length fraction p (for the dashed "Typisk webhotel" line with its step).
const partial = (pts: number[][], len: number) => {
  let left = len; const out = [pts[0]];
  for (let i = 1; i < pts.length && left > 0; i++) {
    const [ax, ay] = pts[i - 1], [bx, by] = pts[i], d = Math.hypot(bx - ax, by - ay), t = Math.min(1, left / d);
    out.push([ax + (bx - ax) * t, ay + (by - ay) * t]); left -= d;
  }
  return out.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
};
// A lock whose shackle lifts open (open 0..1): the right leg withdraws and the shackle rises; no rotation.
const Lock: React.FC<{ s: number; open: number; c: string }> = ({ s, open, c }) => {
  const o = OUT(clamp01(open));
  return (
    <svg width={s} height={s} viewBox="0 0 48 48" fill="none" stroke={c} strokeWidth={(2.3 * 48) / 26} strokeLinecap="round" strokeLinejoin="round" style={{ display: "block", flex: "none", overflow: "visible" }}>
      <rect x="11" y="21" width="26" height="20" rx="4" />
      <path d={`M16 21 V15 a8 8 0 0 1 16 0 V${21 - 7 * o}`} transform={`translate(0 ${-4 * o})`} />
    </svg>
  );
};
// A chip that attaches to the hosting card; its icon turns into a sage check on "med".
const ChipX: React.FC<{ text: string; icon: string; chk: number; style?: React.CSSProperties }> = ({ text, icon, chk, style }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "11px 18px 11px 14px", borderRadius: 999, background: C.white, border: `1px solid ${C.line}`, boxShadow: SHADOW, fontFamily: SANS, fontWeight: 500, fontSize: 24, color: C.ink, whiteSpace: "nowrap", ...style }}>
    <div style={{ position: "relative", width: 28, height: 28, flex: "none" }}>
      <Ico n={icon} s={28} c={C.sageDeep} w={2.2} style={{ position: "absolute", left: 0, top: 0, opacity: 1 - OUT(clamp01(chk)) }} />
      <Check size={28} p={chk} style={{ position: "absolute", left: 0, top: 0 }} />
    </div>
    {text}
  </div>
);

/* ---------- the twin of the address bar ---------- */
const Twin: React.FC<{ g: number; tp: number }> = ({ g, tp }) => {
  const p = clamp01(tp);
  const x = mix(PILL.x, TWIN.x, p), y = mix(PILL.y, TWIN.y, p), w = mix(PILL.w, TWIN.w, p), h = mix(PILL.h, TWIN.h, p);
  const fs = mix(15, 42, p), sc = fs / 15, r = mix(8, 30, p);
  const gp = clamp01(p * 3);                                                  // the glass arrives early, leaves late
  const edit = k(g, "w:nettet", 0.35, INOUT) * clamp01(p / 0.6);             // edit mode: the text moves to the left
  const typing = g >= f("w:vi");
  const sel = typing ? 0 : k(g, "w:nettet+0.05", 0.3, WIPE);                 // "Forhåndsvisning" gets selected
  const text = typing ? typed(g, "w:vi", "holmfysio.dk", 32) : "Forhåndsvisning";
  const caretOn = g >= f("w:nettet") && g < f("w:op") && (g < f("w:vi+0.5") ? g >= f("w:vi") || Math.floor((g - f("w:nettet")) / 8) % 2 === 0 : Math.floor((g - f("w:vi")) / 9) % 2 === 0);
  const lockP = k(g, "w:op", 0.3), liveP = k(g, "w:for", 0.3);               // with the SSL and Hosting ticks
  const ink = typing ? clamp01((p - 0.15) / 0.5) : 0;
  const ticks = ["w:det5", "w:hele2", "w:op", "w:for"].reduce((s, l) => s + k(g, l, 0.3), 0) / 4;
  const prog = clamp01(k(g, "w:stter", 0.3) * 0.08 + ticks * 0.92), progO = k(g, "w:stter", 0.2) * (1 - k(g, "w:for+0.3", 0.3));
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: r, background: "#F1EEE8", opacity: 1 - gp }} />
      <Glass p={gp} radius={r} weight={1.3} style={{ position: "absolute", inset: 0, transform: "none" }} />
      <div style={{ position: "absolute", inset: 0, borderRadius: r, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, bottom: 0, height: 4 * p, width: `${prog * 100}%`, background: C.sage, opacity: progO }} />
      </div>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", padding: `0 ${mix(16, 40, p)}px`, fontFamily: SANS, fontSize: fs, whiteSpace: "nowrap", color: tint(C.ink, C.muted, ink) }}>
        <div style={{ flex: `${1 - edit} 1 0`, minWidth: 0 }} />
        <div style={{ width: (14 * sc + 8 * sc) * lockP, overflow: "hidden", flex: "none", opacity: lockP }}>
          <Ico n="lock" s={14 * sc} c={tint(C.sageDeep, C.muted, p)} w={2.2} />
        </div>
        <span style={{ position: "relative" }}>
          {sel > 0 && <span style={{ position: "absolute", left: -3 * sc * 0.4, right: -3 * sc * 0.4, top: "-0.08em", bottom: "-0.08em", borderRadius: 3 * sc, background: `${C.sageLight}70`, clipPath: `inset(0 ${(1 - sel) * 100}% 0 0)` }} />}
          <span style={{ position: "relative" }}>{text}</span>
        </span>
        <span style={{ display: "inline-block", width: Math.max(1.5, 1.4 * sc), height: fs * 1.1, marginLeft: 1.5 * sc, background: C.sageDeep, opacity: caretOn ? 1 : 0, flex: "none" }} />
        <span style={{ display: "inline-flex", alignItems: "center", gap: 5 * sc, marginLeft: 6 * sc * liveP, color: C.sageDeep, fontWeight: 500, opacity: liveP, maxWidth: 60 * sc * liveP, overflow: "hidden", flex: "none" }}>
          <span style={{ width: 7 * sc, height: 7 * sc, borderRadius: "50%", background: C.sage, flex: "none" }} />Live
        </span>
        <div style={{ flex: "1 1 0", minWidth: 0 }} />
      </div>
    </div>
  );
};

/* ---------- the setup list ---------- */
const SETUP: [string, string, string][] = [["Domæne", "globe", "w:det5"], ["E-mail", "mail", "w:hele2"], ["SSL", "lock", "w:op"], ["Hosting", "server", "w:for"]];
const SetupList: React.FC<{ g: number; p: number }> = ({ g, p }) => (
  <Glass p={p} radius={26} weight={1.2} style={{ position: "absolute", left: LIST.x, top: LIST.y, width: LIST.w, padding: "14px 34px", boxSizing: "border-box", marginTop: -22 * (1 - clamp01(p)) }}>
    {SETUP.map(([t, icon, at], i) => {
      const d = k(g, at, 0.3);
      return (
        <div key={t} style={{ display: "flex", alignItems: "center", height: 64, gap: 20, borderTop: i ? `1px solid ${C.line}` : undefined }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: tint(C.sageTint, "#F1EEE8", d), display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
            <Ico n={icon} s={24} c={tint(C.sageDeep, C.soft, d)} w={2.2} />
          </div>
          <div style={{ fontSize: 28, fontWeight: 500, color: tint(C.ink, C.soft, d) }}>{t}</div>
          <div style={{ flex: 1 }} />
          <div style={{ position: "relative", width: 32, height: 32 }}>
            <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "2px solid #D6D2CB", boxSizing: "border-box", opacity: 1 - d }} />
            <Check size={32} p={d} style={{ position: "absolute", left: 0, top: 0 }} />
          </div>
        </div>
      );
    })}
  </Glass>
);

/* ---------- the hosting card that becomes the chart ---------- */
const HostingCard: React.FC<{ g: number }> = ({ g }) => {
  const cin = aspring(g, "w:83", 0.5), cout = k(g, "w:domnet", 0.35, EXIT);
  const chipsIn = aspring(g, "w:domne", 0.45);
  const m = k(g, "w:fast", 0.7, INOUT);                                     // the morph into the chart
  const H = 330 + 92 * chipsIn + 60 * m;
  const big = mix(132, 46, m), small = mix(28, 24, m);
  const titleOut = k(g, "w:fast", 0.35, WIPE);
  const chipsOut = k(g, "w:fast", 0.3, EXIT);
  const c1 = aspring(g, "w:domne", 0.45), c2 = aspring(g, "w:email", 0.45);
  const sageP = k(g, "w:pris", 0.7, INOUT);
  const greyLen = 197 * k(g, "w:ogs", 0.4, INOUT) + (124 + 395) * k(g, "w:fornyer", 0.36, INOUT);
  const grey = [[CH.x0, CH.grey1], [CH.x0 + COL, CH.grey1], [CH.x0 + COL, CH.grey2], [CH.x1, CH.grey2]];
  const extra = k(g, "w:fornyer+0.06", 0.36, INOUT);                     // the gap a renewal would add
  const baseP = k(g, "w:fast+0.15", 0.55, WIPE);
  const o = clamp01(cin) * (1 - cout);
  return (
    <div style={{ position: "absolute", left: CARD.x, top: CARD.y, width: CARD.w, height: H, borderRadius: 20, background: C.card, border: `1px solid ${C.line}`, boxShadow: SHADOW, boxSizing: "border-box",
      opacity: o, transform: `translate(${28 * cout}px, ${18 * (1 - clamp01(cin))}px) scale(${mix(0.965, 1, clamp01(cin)) - 0.03 * cout})`, transformOrigin: "50% 40%", fontFamily: SANS, color: C.ink, overflow: "hidden" }}>
      {/* title: "Hosting" wipes up as "Fast pris." reveals on its words */}
      <div style={{ position: "absolute", left: 44, top: 38, fontFamily: SERIF, fontSize: 44, letterSpacing: "-0.025em", lineHeight: 1.1, overflow: "hidden", paddingBottom: 6 }}>
        <div style={{ transform: `translateY(${-110 * titleOut}%)` }}>Hosting</div>
      </div>
      <Statement g={g} x={44} y={38} size={44} lh={1.1} words={[{ t: "Fast", at: "w:fast+0.1", it: true }, { t: "pris.", at: "w:pris" }]} />
      {/* the price: "fra 83 kr /md" — it travels into the chart as the label of the flat line */}
      <div style={{ position: "absolute", left: 44, width: CH.x1 - 44, top: mix(96, 272, m), display: "flex", alignItems: "baseline", whiteSpace: "nowrap" }}>
        <div style={{ flex: `${m} 1 0` }} />
        <div style={{ maxWidth: 70 * (1 - m), overflow: "hidden", opacity: 1 - m, fontSize: 26, color: C.muted, marginRight: 12 * (1 - m) }}><Rv p={k(g, "w:83", 0.45)}>fra</Rv></div>
        <div style={{ fontFamily: SERIF, fontSize: big, letterSpacing: "-0.025em", lineHeight: 1, color: C.ink }}>
          <Rv p={k(g, "w:83+0.08", 0.55)}>83</Rv><span style={{ display: "inline-block", width: big * 0.24 }} /><Rv p={k(g, "w:kroner2", 0.5)}>kr</Rv>
        </div>
        <div style={{ fontSize: small, color: C.muted, marginLeft: mix(12, 8, m) }}><Rv p={k(g, "w:om2", 0.45)}>/md</Rv></div>
        <div style={{ flex: `${1 - m} 1 0` }} />
      </div>
      <div style={{ position: "absolute", left: 44, width: CH.x1 - 44, top: mix(244, 326, m), display: "flex", fontSize: 24, color: C.muted }}>
        <div style={{ flex: `${m} 1 0` }} /><Rv p={k(g, "w:mneden+0.05", 0.45)}>Betalt årligt</Rv><div style={{ flex: `${1 - m} 1 0` }} />
      </div>
      {/* domain and e-mail attach; on "med" their icons become checks */}
      {chipsOut < 1 && (
        <div style={{ position: "absolute", left: 44, top: 318, display: "flex", gap: 12, opacity: 1 - chipsOut, transform: `translateY(${14 * chipsOut}px)` }}>
          <ChipX text="holmfysio.dk" icon="globe" chk={k(g, "w:er3", 0.3)} style={{ opacity: clamp01(c1), transform: `translate(${60 * (1 - clamp01(c1))}px, ${10 * (1 - clamp01(c1))}px)` }} />
          <ChipX text="kontakt@holmfysio.dk" icon="mail" chk={k(g, "w:med", 0.3)} style={{ opacity: clamp01(c2), transform: `translate(${60 * (1 - clamp01(c2))}px, ${10 * (1 - clamp01(c2))}px)` }} />
        </div>
      )}
      {/* the chart: 2026 · 2027 · 2028, Creoble flat at 83 kr, a typical web host steps up after year one */}
      {m > 0 && (
        <>
          <svg width={CARD.w} height={482} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} fill="none">
            <line x1={CH.x0} x2={mix(CH.x0, CH.x1, baseP)} y1={CH.base} y2={CH.base} stroke="#D9D4CC" strokeWidth={1.5} />
            {extra > 0 && <rect x={CH.x0 + COL} y={CH.grey2} width={(CH.x1 - CH.x0 - COL) * extra} height={CH.sage - CH.grey2} fill="#E6E1D8" opacity={0.85} />}
            {greyLen > 0 && <path d={partial(grey, greyLen)} stroke="#B3ADA5" strokeWidth={3} strokeDasharray="9 9" strokeLinecap="round" strokeLinejoin="round" />}
            {sageP > 0 && <line x1={CH.x0} x2={mix(CH.x0, CH.x1, sageP)} y1={CH.sage} y2={CH.sage} stroke={C.sage} strokeWidth={4.5} strokeLinecap="round" />}
            {sageP > 0 && <circle cx={mix(CH.x0, CH.x1, sageP)} cy={CH.sage} r={7} fill={C.sage} />}
          </svg>
          {["2026", "2027", "2028"].map((y, i) => (
            <div key={y} style={{ position: "absolute", left: CH.x0 + COL * i, width: COL, top: 386, textAlign: "center", fontFamily: SERIF, fontSize: 30, letterSpacing: "-0.02em", color: C.muted }}>
              <Rv p={k(g, `w:fast+${(0.25 + i * 0.1).toFixed(2)}`, 0.45)}>{y}</Rv>
            </div>
          ))}
          <div style={{ position: "absolute", left: CH.x0, top: 220, fontSize: 24, fontWeight: 500, color: C.sageDeep }}><Rv p={k(g, "w:pris", 0.45)}>Creoble</Rv></div>
          <div style={{ position: "absolute", left: CH.x0, top: 296, fontSize: 24, color: C.muted }}><Rv p={k(g, "w:ogs", 0.45)}>Typisk webhotel</Rv></div>
        </>
      )}
    </div>
  );
};

/* ---------- the three promises ---------- */
const ROW = { y: 796, w: 440, h: 124, gap: 24 };
const PromiseCard: React.FC<{ i: number; p: number; out: number; icon: React.ReactNode; title: string; sub?: string; subP?: number; hot?: number }> = ({ i, p, out, icon, title, sub, subP = 0, hot = 0 }) => {
  const q = clamp01(p) * (1 - out);
  if (q <= 0) return null;
  const x = 960 - (3 * ROW.w + 2 * ROW.gap) / 2 + i * (ROW.w + ROW.gap);
  return (
    <Glass p={q} radius={24} weight={1.6} style={{ position: "absolute", left: x, top: ROW.y, width: ROW.w, height: ROW.h, boxSizing: "border-box", padding: "0 28px", display: "flex", alignItems: "center", gap: 20, marginTop: 22 * (1 - clamp01(p)) + 10 * out }}>
      <div style={{ width: 64, height: 64, borderRadius: 18, background: tint(C.sage, C.sageTint, hot), display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>{icon}</div>
      <div style={{ whiteSpace: "nowrap" }}>
        <div style={{ fontSize: 30, fontWeight: 500, letterSpacing: "-0.01em", color: C.ink }}>{title}</div>
        {sub && <div style={{ fontSize: 24, color: C.muted, marginTop: 4 }}><Rv p={subP}>{sub}</Rv></div>}
      </div>
    </Glass>
  );
};

export const Scene4: React.FC<{ g: number }> = ({ g }) => {
  if (g < f("h3") || g >= f("h4")) return null;
  if (g >= f("h4") - 1) return <Handoff4 />;                               // the frame before h4: exactly Handoff4

  // The twin: out of the pill on "Skal", back into it on "dig".
  const up = aspring(g, "w:skal", 0.55), down = aspring(g, "w:dig", 0.42);
  const tp = up * (1 - down);
  const twinOn = g >= f("w:skal") && down < 0.985;
  const url = g < f("w:skal") ? "Forhåndsvisning" : twinOn ? "" : "holmfysio.dk";
  const live = g < f("w:skal") || twinOn ? 0 : 1;
  const listP = aspring(g, "w:stter", 0.45) * (1 - k(g, "w:dig", 0.25, EXIT));
  // The site: steps aside (smaller) on "Fra", comes home on "Domænet".
  const a = aspring(g, "w:fra", 0.5) * (1 - aspring(g, "w:domnet", 0.65));
  const s = mix(1, SM.s, a), tx = mix(HOME.x, SM.x, a) - s * HOME.x, ty = mix(HOME.y, SM.y, a) - s * HOME.y;
  // The page lives under everything: it drifts down while the site waits, and is back at the top before the row
  // clears (scroll 0 at both hand-offs).
  const seg = (a0: string, a1: string) => INOUT(clamp01((g - f(a0)) / (f(a1) - f(a0))));
  const scroll = 400 * seg("h3", "w:fast") - 150 * seg("w:fast", "w:domnet") - 250 * seg("w:domnet", "w:binding");
  // A sage focus ring on the pill: the anticipation before the twin lifts, and the domain as the site comes home.
  const ring = k(g, "w:skal-0.25", 0.25) * (1 - k(g, "w:skal", 0.15)) + k(g, "w:domnet+0.3", 0.35) * (1 - k(g, "w:servere-0.4", 0.4));
  // The promises.
  const p1 = aspring(g, "w:i", 0.45), p2 = aspring(g, "w:servere", 0.45), p3 = aspring(g, "w:ingen3", 0.45);
  const o1 = k(g, "w:binding-0.07", 0.2, EXIT), o2 = k(g, "w:binding", 0.2, EXIT), o3 = k(g, "h4-0.27", 0.2, EXIT);
  const unlock = k(g, "w:binding", 0.2);

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {g >= f("w:fra") && g < f("w:domnet+0.4") && <HostingCard g={g} />}
      <div style={{ position: "absolute", inset: 0, transform: a > 0 ? `translate(${tx}px, ${ty}px) scale(${s})` : undefined, transformOrigin: "0 0" }}>
        <SiteHome booking={1} url={url} live={live} scroll={scroll} />
        {ring > 0.001 && <div style={{ position: "absolute", left: PILL.x - 1, top: PILL.y - 1, width: PILL.w + 2, height: PILL.h + 2, borderRadius: 9, boxShadow: `0 0 0 3px rgba(135,168,158,${0.85 * ring}), 0 0 0 9px rgba(135,168,158,${0.18 * ring})` }} />}
        {tp > 0.001 && <Scrim p={tp} />}
        {listP > 0.001 && <SetupList g={g} p={listP} />}
        {twinOn && <Twin g={g} tp={tp} />}
      </div>
      <PromiseCard i={0} p={p1} out={o1} icon={<Ico n="user" s={34} c={C.sageDeep} w={2.2} />} title="holmfysio.dk" sub="Ejer: Holm Fysioterapi" subP={k(g, "w:navn", 0.5)} />
      <PromiseCard i={1} p={p2} out={o2} icon={<Ico n="server" s={34} c={C.sageDeep} w={2.2} />} title="Servere i Europa" sub="GDPR" subP={k(g, "w:europa", 0.5)} />
      <PromiseCard i={2} p={p3} out={o3} hot={unlock} icon={<Lock s={34} open={unlock} c={tint(C.white, C.sageDeep, unlock)} />} title="Ingen binding" />
    </div>
  );
};
