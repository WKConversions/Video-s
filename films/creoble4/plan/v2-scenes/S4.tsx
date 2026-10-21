// Builder 4 — hosting, version 2 (plan/storyboard.md, shots 20–28): h3 → h4. Constant motion, one shot per sentence,
// a different move on every cut:
//  20 whip in → a huge Glass address bar slides across the moving site, "Forhåndsvisning" selects on "nettet";
//  21 zoom-through the site while the bar rises and pushes the question off the top: the domain types, four rows
//     cascade and check on the words, lock and Live on "dig";
//  22 push left: "83" rolls in beside the live site (3D, scrolling), "kr /md", "Betalt årligt";
//  23 two chips are thrown in from the sides and dock under the price (springs 0.85);
//  24 morph: the price shrinks onto the left end of a sage line;  25 pan through the years, the grey line steps up;
//  26 3D fly-in of the domain card;  27 push up: twelve dots assemble the EU ring around a server;
//  28 iris wipe out of the ring to deep sage: the padlock opens on "binding" and is thrown off with the whip at h4.
import React from "react";
import {
  Browser, C, Check, Chip, EXIT, Glass, HolmSite, INOUT, Ico, KineticLine, Label, OUT, RollNumber, SANS, SERIF, SHADOW, SHADOW_BIG, Scrim, WIPE,
  aspring, clamp01, drift, f, kf, mix, typed, whipFade, whipIn, whipOut,
} from "../shared";

/* ---------- the clock of this span (frames) ---------- */
const F = {
  h3: f("h3"), skal: f("w:skal"), nettet: f("w:nettet"), vi: f("w:vi"), dig: f("w:dig"), fra: f("w:fra"), n83: f("w:83"),
  kroner: f("w:kroner2"), om: f("w:om2"), mdr: f("w:mneden"), domne: f("w:domne"), email: f("w:email"), med: f("w:med"),
  fast: f("w:fast"), pris: f("w:pris"), ogs: f("w:ogs"), fornyer: f("w:fornyer"), domnet: f("w:domnet"), dit: f("w:dit"), navn: f("w:navn"),
  servere: f("w:servere"), europa: f("w:europa"), ingen: f("w:ingen3"), binding: f("w:binding"), h4: f("h4"),
};
const PUSH = F.dig + 5, PUSH_D = 14;           // 21 → 22: push left
const UPP = F.servere - 7, UPP_D = 14;         // 26 → 27: push up
const IRIS = F.ingen - 6, IRIS_D = 14;         // 27 → 28: iris wipe

/* ---------- small local helpers ---------- */
// aspring from a frame number (aspring itself takes labels or seconds).
const sp = (g: number, frame: number, response = 0.42, damping = 1) => aspring(g, frame / 30, response, damping);
// glide: constant travel between frames a and b (a trapezoid velocity: short soft ramps, then an even speed), so a
// hold keeps moving at the same pace instead of slowing to a stop the way an in-out ease does.
const glide = (g: number, a: number, b: number, from: number, to: number, e = 0.18) => {
  const t = clamp01((g - a) / Math.max(1, b - a));
  const v = t < e ? (t * t) / (2 * e * (1 - e)) : t > 1 - e ? 1 - ((1 - t) * (1 - t)) / (2 * e * (1 - e)) : (t - e / 2) / (1 - e);
  return mix(from, to, v);
};
// A polyline drawn to length `len` (for the dashed "Typisk webhotel" line with its step).
const partial = (pts: number[][], len: number) => {
  let left = len; const out = [pts[0]];
  for (let i = 1; i < pts.length && left > 0; i++) {
    const [ax, ay] = pts[i - 1], [bx, by] = pts[i], d = Math.hypot(bx - ax, by - ay), t = Math.min(1, left / d);
    out.push([ax + (bx - ax) * t, ay + (by - ay) * t]); left -= d;
  }
  return out.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
};
// A word rising through its mask on a spring (for UI text and the colour plate's type).
const Rise: React.FC<{ p: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ p, children, style }) => (
  <span style={{ display: "inline-block", overflow: "hidden", paddingBottom: "0.22em", marginBottom: "-0.22em", ...style }}>
    <span style={{ display: "inline-block", transform: `translateY(${(1 - Math.min(1, p)) * 105}%)` }}>{children}</span>
  </span>
);
// Kinetic type on the colour plate: KineticLine's behaviour with its own colours (cream, italic light sage).
const Kin: React.FC<{ g: number; words: { t: string; at: number; it?: boolean }[]; x: number; y: number; size: number; color: string; itc: string; dx?: number }> = ({ g, words, x, y, size, color, itc, dx = -60 }) => {
  const life = clamp01((g - words[0].at) / 40);
  return (
    <div style={{ position: "absolute", left: x, top: y, display: "flex", columnGap: size * 0.24, fontFamily: SERIF, fontSize: size, letterSpacing: "-0.025em", lineHeight: 1.05, color, whiteSpace: "nowrap", transformOrigin: "0% 50%", transform: `translateX(${dx * life}px) scale(${1 + 0.05 * life})` }}>
      {words.map((w, i) => {
        const p = sp(g, w.at, 0.42);
        return (
          <span key={i} style={{ display: "inline-block", overflow: "hidden", paddingBottom: size * 0.16, marginBottom: -size * 0.16, paddingRight: w.it ? size * 0.06 : 0 }}>
            <span style={{ display: "inline-block", transform: `translateY(${(1 - Math.min(1, p)) * 100}%) scale(${0.92 + 0.08 * Math.min(1, p)})`, transformOrigin: "50% 100%", fontStyle: w.it ? "italic" : "normal", color: w.it ? itc : undefined }}>{w.t}</span>
          </span>
        );
      })}
    </div>
  );
};
// The padlock: a solid body with a keyhole and a heavy shackle; open 0..1+ lifts the shackle out of the body (the
// long left leg stays inside) and swings it a little.
const Lock: React.FC<{ s: number; open: number; c: string; hole: string }> = ({ s, open, c, hole }) => (
  <svg width={s} height={s} viewBox="0 0 48 48" style={{ display: "block", overflow: "visible" }}>
    <g transform={`translate(0 ${-8 * open}) rotate(${-9 * open} 16 26)`}>
      <path d="M16 31 V16 a8 8 0 0 1 16 0 V22" fill="none" stroke={c} strokeWidth={4.2} strokeLinecap="round" />
    </g>
    <rect x="9" y="21" width="30" height="23" rx="5.5" fill={c} />
    <circle cx="24" cy="30.5" r="2.8" fill={hole} /><rect x="22.8" y="30.5" width="2.4" height="6.5" rx="1.2" fill={hole} />
  </svg>
);

/* ---------- 20 + 21: the address bar ---------- */
const BAR = { w: 1400, h: 120 };
const ROWS = [
  { icon: "globe", t: "Domæne", at: "w:det5" },
  { icon: "mail", t: "E-mail", at: "w:hele2" },
  { icon: "shield", t: "SSL", at: "w:op" },
  { icon: "server", t: "Hosting", at: "w:for" },
];
const AddressBar: React.FC<{ g: number }> = ({ g }) => {
  const sel = kf(g, F.nettet, 5, OUT);                         // "Forhåndsvisning" selects on "nettet"
  const txt = typed(g, "w:vi", "holmfysio.dk", 26);
  const live = sp(g, F.dig, 0.36);
  const caret = g >= F.vi && live < 0.5 && (g < F.vi + 16 || Math.floor(g / 8) % 2 === 0);
  const ring = Math.max(sel * (1 - kf(g, F.dig, 10)), 0);
  return (
    <div style={{ position: "relative", width: BAR.w, height: BAR.h, borderRadius: BAR.h / 2, boxShadow: `0 0 0 ${8 * ring}px rgba(135,168,158,${0.32 * ring})` }}>
      <Glass p={1} radius={BAR.h / 2} weight={1.5} style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", padding: "0 56px", gap: 30 }}>
        <div style={{ position: "relative", width: 52, height: 52, flex: "none" }}>
          <Ico n="link" s={52} c={C.soft} w={2.2} style={{ position: "absolute", inset: 0, opacity: 1 - Math.min(1, live) }} />
          <Ico n="lock" s={52} c={C.ink} w={2.4} style={{ position: "absolute", inset: 0, opacity: Math.min(1, live), transform: `scale(${0.6 + 0.4 * Math.min(1, live)})` }} />
        </div>
        <div style={{ fontFamily: SANS, fontSize: 56, letterSpacing: "-0.01em", whiteSpace: "nowrap", display: "flex", alignItems: "center", flex: 1 }}>
          {txt.length === 0
            ? <span style={{ color: C.muted, background: `rgba(135,168,158,${0.42 * sel})`, borderRadius: 10, padding: "2px 8px", margin: "0 -8px" }}>Forhåndsvisning</span>
            : <span style={{ color: C.ink }}>{txt}</span>}
          {caret && <span style={{ display: "inline-block", width: 4, height: 62, marginLeft: 4, borderRadius: 2, background: C.sageDeep }} />}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontFamily: SANS, fontWeight: 500, fontSize: 46, color: C.sageDeep, opacity: Math.min(1, live * 1.5), transform: `translateX(${(1 - Math.min(1, live)) * 40}px) scale(${0.7 + 0.3 * Math.min(1, live)})`, transformOrigin: "100% 50%" }}>
          <div style={{ width: 22, height: 22, borderRadius: "50%", background: C.sage, boxShadow: `0 0 0 ${10 * clamp01(1 - kf(g, F.dig + 4, 18))}px rgba(135,168,158,0.35)` }} />Live
        </div>
      </Glass>
    </div>
  );
};
const StageA: React.FC<{ g: number }> = ({ g }) => {
  if (g > PUSH + PUSH_D) return null;
  const x = whipIn(g, "h3") - 1920 * kf(g, PUSH, PUSH_D, INOUT);
  const z = kf(g, F.vi - 3, 15, INOUT);                         // 20 → 21: zoom through the site
  const up = sp(g, F.vi - 4, 0.42);                             // the bar rises (match move across the cut)
  const enter = sp(g, F.h3, 0.55);
  const barX = 260 + (1 - enter) * 520 + glide(g, F.h3, PUSH + PUSH_D, 90, -170);
  const barY = mix(600, 190, up);
  const grp = glide(g, F.vi - 4, PUSH + PUSH_D, 1, 1.07);
  return (
    <div style={{ position: "absolute", inset: 0, transform: `translateX(${x}px)` }}>
      {z < 1 && (
        <div style={{ position: "absolute", inset: 0, transformOrigin: "960px 660px", transform: `scale(${1 + 1.9 * z})`, opacity: 1 - z }}>
          <div style={{ position: "absolute", left: -190 + drift(g, "h3", "w:vi", 0, -120), top: -100, filter: "blur(3px)" }}>
            <HolmSite w={2340} h={1320} booking={1} scroll={drift(g, "h3", "w:vi+0.3", 20, 430)} />
          </div>
          <Scrim p={1} />
        </div>
      )}
      {/* the rising bar pushes the question off the top */}
      <div style={{ position: "absolute", inset: 0, transform: `translateY(${-500 * up}px)` }}>
        <KineticLine g={g} words={[{ t: "Skal", at: "w:skal" }, { t: "den", at: "w:den2" }, { t: "på", at: "w:p" }, { t: "nettet?", at: "w:nettet", it: true }]}
          x={960} y={300} size={136} align="center" out="w:vi" dir="up" dx={-50} grow={0.06} />
      </div>
      <div style={{ position: "absolute", inset: 0, transformOrigin: "960px 480px", transform: `scale(${grp})` }}>
        <div style={{ position: "absolute", left: barX, top: barY }}><AddressBar g={g} /></div>
        {ROWS.map((r, i) => {
          const p = sp(g, F.vi + 2 + i * 3, 0.45);
          if (p <= 0) return null;
          const c = sp(g, f(r.at), 0.32);
          const y = 360 + i * 120 + (1 - p) * 260 + glide(g, F.vi, PUSH + PUSH_D, 20 + i * 10, -40 - i * 16);
          return (
            <div key={r.t} style={{ position: "absolute", left: 340 + glide(g, F.vi, PUSH + PUSH_D, 110 + i * 14, -110 - i * 14), top: y, width: 1240, height: 100, borderRadius: 26, boxSizing: "border-box",
              background: `color-mix(in srgb, ${C.white} ${Math.round(100 * clamp01(c))}%, ${C.card})`, border: `1px solid ${C.line}`, boxShadow: SHADOW, display: "flex", alignItems: "center", padding: "0 30px 0 22px", gap: 26,
              opacity: Math.min(1, p * 1.6), transform: `scale(${mix(0.94, 1, Math.min(1, p))})`, fontFamily: SANS }}>
              <div style={{ width: 64, height: 64, borderRadius: "50%", background: C.sageTint, display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}><Ico n={r.icon} s={38} c={C.sageDeep} w={2.2} /></div>
              <div style={{ fontSize: 44, fontWeight: 500, color: C.ink, flex: 1 }}>{r.t}</div>
              <Check size={60} p={c} style={{ transform: `scale(${0.4 + 0.6 * Math.min(1.08, c)})` }} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ---------- 22–25: the price, the chips, the fixed line, the years ---------- */
const LINE_Y = 720;
const ROWW = 640, ROWH = 325;                                 // the "83 kr /md" row as laid out (natural size)
const S1 = 0.34, X1 = 130;                                    // the price's place at the line's left end
const LINE_X0 = X1 + ROWW * S1 + 30;
const YEARS = ["2026", "2027", "2028", "2029", "2030", "2031"].map((y, i) => ({ y, x: 560 + i * 800 }));
const MONTHS = Array.from({ length: 66 }, (_, i) => 560 + Math.floor(i / 11) * 800 + ((i % 11) + 1) * (800 / 12));   // month ticks
const GREY = [[LINE_X0, LINE_Y + 24], [1360, LINE_Y + 24], [1360, LINE_Y - 170], [5200, LINE_Y - 170]];
const PCX = 560;                                              // the price's centre while the live site sits beside it
const StageB: React.FC<{ g: number }> = ({ g }) => {
  if (g < PUSH || g > UPP + UPP_D) return null;
  const x = 1920 * (1 - kf(g, PUSH, PUSH_D, INOUT)), y = -1080 * kf(g, UPP, UPP_D, INOUT);
  const rec = kf(g, F.domnet - 4, 18, INOUT);                     // 25 → 26: dims behind the flying card, keeps panning
  const pan = glide(g, F.fast - 4, UPP + UPP_D, 0, -1900, 0.25);  // 24 → 25: the years travel past
  // the price: beside the live site and drifting, lifted for the chips, then morphed onto the line's left end
  const lift = 130 * sp(g, F.domne - 2, 0.5);
  const S0 = glide(g, PUSH, F.fast, 1, 1.1), dx0 = glide(g, PUSH, F.fast, 120, -100);
  const m = kf(g, F.fast - 3, 18, INOUT);
  const S = mix(S0, S1, m), X = mix(PCX - (ROWW / 2) * S0 + dx0, X1, m) + pan, Y = mix(520 - (ROWH / 2) * S0 - lift, LINE_Y - (ROWH / 2) * S1 - 8, m);
  const roll = kf(g, F.n83 - 4, 32, (t) => t);
  const small = 1 - kf(g, F.fast - 3, 8);                         // "Fra" and "Betalt årligt" leave with the morph
  const so = kf(g, F.fast - 4, 15, EXIT);                         // the site flies off on "Fast"
  // the sage line and the grey "Typisk webhotel" line (layer coordinates; the layer pans)
  const head = mix(LINE_X0, 5200, kf(g, F.fast + 1, 40, WIPE));
  const gl = 978 * kf(g, F.pris, 18, INOUT) + 194 * kf(g, F.fornyer - 1, 7, OUT) + 3840 * kf(g, F.fornyer + 5, 34, OUT);
  return (
    <div style={{ position: "absolute", inset: 0, transform: `translate(${x}px, ${y}px)` }}>
      {/* 22–23: the live site beside the price, scrolling, in a slow 3D turn */}
      {so < 1 && (
        <div style={{ position: "absolute", left: 1010, top: 168, perspective: 2200 }}>
          <div style={{ transformOrigin: "0% 50%", transform: `translateX(${glide(g, PUSH, F.fast, 70, -70) + so * 1100}px) rotateY(${glide(g, PUSH, F.fast, -20, -9) - so * 24}deg)`, opacity: 1 - so }}>
            <Browser w={1180} h={760} url="holmfysio.dk" live={1}>
              <HolmSite w={1180} h={714} booking={1} scroll={glide(g, PUSH, F.fast + 12, 0, 600)} />
            </Browser>
          </div>
        </div>
      )}
      {/* the chart layer */}
      <div style={{ position: "absolute", inset: 0, opacity: 1 - 0.72 * rec, transform: `scale(${1 - 0.08 * rec})`, transformOrigin: "960px 700px" }}>
        {g >= F.fast - 2 && (
          <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
            <g transform={`translate(${pan} 0)`}>
              {MONTHS.map((mx, i) => <path key={i} d={`M${mx} ${LINE_Y + 66} V${LINE_Y + 80}`} stroke="#D3CEC6" strokeWidth={4} strokeLinecap="round" opacity={kf(g, F.pris + i * 0.5, 8)} />)}
              {gl > 1 && <path d={partial(GREY, gl)} fill="none" stroke="#B4AFA7" strokeWidth={7} strokeDasharray="18 14" strokeLinecap="round" strokeLinejoin="round" />}
              <path d={`M${LINE_X0} ${LINE_Y} L${head} ${LINE_Y}`} fill="none" stroke={C.sage} strokeWidth={10} strokeLinecap="round" />
              <circle cx={head} cy={LINE_Y} r={13} fill={C.sage} />
              {YEARS.map((yr, i) => {
                const p = sp(g, F.ogs - 6 + i * 3, 0.45);
                return <g key={yr.y} opacity={Math.min(1, p)} transform={`translate(0 ${(1 - Math.min(1, p)) * 50})`}><path d={`M${yr.x} ${LINE_Y + 58} V${LINE_Y + 90}`} stroke={C.soft} strokeWidth={4} strokeLinecap="round" /></g>;
              })}
            </g>
          </svg>
        )}
        {g >= F.ogs - 8 && YEARS.map((yr, i) => {
          const p = sp(g, F.ogs - 6 + i * 3, 0.45);
          return <div key={yr.y} style={{ position: "absolute", left: yr.x + pan - 100, top: LINE_Y + 104 + (1 - Math.min(1, p)) * 50, width: 200, textAlign: "center", fontFamily: SANS, fontWeight: 500, fontSize: 40, color: i === 1 ? C.sageDeep : C.muted, opacity: Math.min(1, p) }}>{yr.y}</div>;
        })}
        {g >= F.fornyer - 2 && (
          <>
            <div style={{ position: "absolute", left: 1360 + pan - 140, top: LINE_Y + 156, width: 280, textAlign: "center", fontFamily: SANS, fontSize: 32, color: C.sageDeep }}><Rise p={sp(g, F.fornyer, 0.4)}>Fornyelse</Rise></div>
            <div style={{ position: "absolute", left: 1400 + pan, top: LINE_Y - 238, fontFamily: SANS, fontWeight: 500, fontSize: 34, color: C.muted, whiteSpace: "nowrap" }}><Rise p={sp(g, F.fornyer + 5, 0.4)}>Typisk webhotel</Rise></div>
          </>
        )}
      </div>
      {/* the price */}
      <div style={{ position: "absolute", left: 0, top: 0, width: ROWW, height: ROWH, transformOrigin: "0 0", transform: `translate(${X}px, ${Y}px) scale(${S})`, opacity: 1 - 0.72 * rec }}>
        <div style={{ position: "absolute", left: 8, top: -26, fontFamily: SANS, fontWeight: 500, fontSize: 46, color: C.muted, opacity: small }}><Rise p={sp(g, F.fra, 0.4)}>Fra</Rise></div>
        <div style={{ position: "absolute", left: 0, top: 0 }}><RollNumber value={83} p={roll} size={260} /></div>
        <div style={{ position: "absolute", left: 342, top: 150, fontFamily: SERIF, fontSize: 104, letterSpacing: "-0.025em", lineHeight: 1.1, whiteSpace: "nowrap", color: C.ink, display: "flex", gap: 22 }}>
          <Rise p={sp(g, F.kroner, 0.42)}>kr</Rise><Rise p={sp(g, F.om, 0.42)} style={{ color: C.muted }}>/md</Rise>
        </div>
        <div style={{ position: "absolute", left: 10, top: 296, fontFamily: SANS, fontSize: 38, color: C.muted, whiteSpace: "nowrap", opacity: small }}><Rise p={sp(g, F.kroner + 5, 0.42)}>Betalt årligt</Rise></div>
      </div>
      {/* 23: the chips, thrown in from the sides, dock under the price; thrown out again on "Fast" */}
      {g >= F.domne - 2 && g < F.fast + 18 && (
        <div style={{ position: "absolute", left: PCX - 300, top: 636, display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 24, transform: `translateX(${glide(g, F.domne - 2, F.fast + 16, 70, -90)}px)` }}>
          {[{ t: "holmfysio.dk", icon: "globe", at: F.domne }, { t: "kontakt@holmfysio.dk", icon: "mail", at: F.email - 3 }].map((c, i) => {
            const p = sp(g, c.at, 0.6, 0.85), side = i === 0 ? -1 : 1, q = kf(g, F.fast - 2 + i * 2, 16, EXIT);
            const chk = sp(g, F.med + i * 3, 0.32);
            return (
              <div key={c.t} style={{ position: "relative", transform: `translate(${side * (1 - p) * 1500 - q * 300}px, ${q * 700}px) rotate(${side * (1 - p) * 16 - q * 26}deg)`, opacity: 1 - q * 0.6 }}>
                <Chip text={c.t} icon={c.icon} size={42} />
                <div style={{ position: "absolute", right: -12, top: -16, transform: `scale(${Math.min(1.1, chk)})` }}><Check size={46} p={chk} /></div>
              </div>
            );
          })}
        </div>
      )}
      {/* 24 and 25: the kinetic lines */}
      {g >= F.fast - 2 && <KineticLine g={g} words={[{ t: "Fast", at: "w:fast", it: true }, { t: "pris.", at: "w:pris" }]} x={130} y={190} size={210} out="w:ogs" dir="up" dx={-170} grow={0.08} />}
      {g >= F.ogs && <KineticLine g={g} words={[{ t: "Også", at: "w:ogs+0.08" }, { t: "når", at: "w:nr+0.06" }, { t: "du", at: "w:du4" }, { t: "fornyer.", at: "w:fornyer", it: true }]} x={130} y={210} size={146} out="w:domnet" dir="up" dx={-150} grow={0.07} />}
    </div>
  );
};

/* ---------- 26: the domain card ---------- */
const StageC: React.FC<{ g: number }> = ({ g }) => {
  if (g < F.domnet - 8 || g > UPP + UPP_D) return null;
  const p = sp(g, F.domnet - 6, 0.6);
  const y = -1080 * kf(g, UPP, UPP_D, INOUT);
  const ry = mix(-46, 0, p) + glide(g, F.domnet, UPP + UPP_D, 9, -9), rx = mix(28, 0, p) + glide(g, F.domnet, UPP + UPP_D, 4, -4);
  const s = mix(0.55, 1, p) * glide(g, F.domnet, UPP + UPP_D, 1, 1.08);
  const own = sp(g, F.dit, 0.42), name = sp(g, F.navn, 0.42), ul = kf(g, F.navn + 2, 14, WIPE);
  return (
    <div style={{ position: "absolute", inset: 0, transform: `translateY(${y}px)`, perspective: 1700 }}>
      <div style={{ position: "absolute", left: 360, top: 300, width: 1200, height: 470, transformOrigin: "50% 50%",
        transform: `translate3d(${(1 - p) * 980 + glide(g, F.domnet, UPP + UPP_D, 130, -140)}px, ${(1 - p) * 620}px, 0) rotateY(${ry}deg) rotateX(${rx}deg) scale(${s})`, opacity: Math.min(1, p * 2.5) }}>
        <div style={{ width: "100%", height: "100%", boxSizing: "border-box", borderRadius: 36, background: C.card, border: `1px solid ${C.line}`, boxShadow: SHADOW_BIG, padding: "58px 72px", fontFamily: SANS, color: C.ink }}>
          <Label text="Domæne" size={28} p={kf(g, F.domnet, 16, (t) => t)} />
          <div style={{ display: "flex", alignItems: "center", gap: 30, marginTop: 34 }}>
            <Ico n="globe" s={92} c={C.sageDeep} w={2} />
            <div style={{ fontSize: 108, fontWeight: 500, letterSpacing: "-0.03em", lineHeight: 1 }}>holmfysio.dk</div>
          </div>
          <div style={{ height: 1, background: C.line, margin: "44px 0 34px", transformOrigin: "0 50%", transform: `scaleX(${kf(g, F.domnet + 6, 20, OUT)})` }} />
          <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
            <div style={{ width: 80, height: 80, borderRadius: "50%", background: C.sageTint, display: "flex", alignItems: "center", justifyContent: "center", flex: "none", transform: `scale(${0.5 + 0.5 * Math.min(1, own)})`, opacity: Math.min(1, own * 2) }}><Ico n="user" s={46} c={C.sageDeep} w={2.2} /></div>
            <div style={{ fontSize: 48, color: C.muted, whiteSpace: "nowrap" }}><Rise p={own}>Ejer:</Rise></div>
            <div style={{ position: "relative", fontSize: 58, fontWeight: 500, whiteSpace: "nowrap" }}>
              <Rise p={name}>Holm Fysioterapi</Rise>
              <div style={{ position: "absolute", left: 0, bottom: -10, height: 6, borderRadius: 3, width: `${100 * ul}%`, background: C.sage }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ---------- 27: servers in Europe; 28: no lock-in ---------- */
const RING = { x: 520, y: 540, r: 236 };
const StageD: React.FC<{ g: number }> = ({ g }) => {
  if (g < UPP || g > IRIS + IRIS_D + 1) return null;
  const y = 1080 * (1 - kf(g, UPP, UPP_D, INOUT));
  const dx = glide(g, UPP, IRIS + IRIS_D, 120, -120);
  const zoom = glide(g, UPP, IRIS, 1, 1.08) * (1 + 0.9 * kf(g, IRIS, IRIS_D, INOUT));
  const srv = sp(g, F.servere + 4, 0.45);
  return (
    <div style={{ position: "absolute", inset: 0, transform: `translate(${dx}px, ${y}px)` }}>
      <div style={{ position: "absolute", inset: 0, transformOrigin: `${RING.x}px ${RING.y}px`, transform: `perspective(1800px) scale(${zoom}) rotateY(${glide(g, UPP, IRIS + IRIS_D, 16, -8)}deg) rotateX(${glide(g, UPP, IRIS + IRIS_D, 8, -4)}deg)` }}>
        {Array.from({ length: 12 }, (_, i) => {
          const a = (i / 12) * Math.PI * 2 - Math.PI / 2, p = sp(g, F.servere - 6 + i * 2.2, 0.5);
          const fa = i * 2.39 + 0.6, fr = 430 + (i % 4) * 110;          // where each dot flies in from
          const tx = RING.x + Math.cos(a) * RING.r, ty = RING.y + Math.sin(a) * RING.r;
          const px = mix(RING.x + Math.cos(fa) * fr, tx, p), py = mix(RING.y + Math.sin(fa) * fr, ty, p);
          return <div key={i} style={{ position: "absolute", left: px - 19, top: py - 19, width: 38, height: 38, borderRadius: "50%", background: C.sage, transform: `scale(${0.5 + 0.5 * Math.min(1, p)})` }} />;
        })}
        <div style={{ position: "absolute", left: RING.x - 80, top: RING.y - 80, opacity: Math.min(1, srv * 2), transform: `scale(${0.6 + 0.4 * Math.min(1, srv)})` }}><Ico n="server" s={160} c={C.sageDeep} w={1.7} /></div>
      </div>
      <KineticLine g={g} words={[{ t: "Servere", at: "w:servere" }, { t: "i", at: "w:i2" }]} x={880} y={300} size={170} dx={-150} grow={0.06} />
      <KineticLine g={g} words={[{ t: "Europa.", at: "w:europa", it: true }]} x={880} y={482} size={170} dx={-190} grow={0.06} />
      <div style={{ position: "absolute", left: 888 + glide(g, F.europa, IRIS + IRIS_D, 0, -120), top: 724, opacity: Math.min(1, sp(g, F.europa + 4, 0.4) * 2), transform: `translateY(${(1 - Math.min(1, sp(g, F.europa + 4, 0.4))) * 60}px)` }}>
        <Chip text="GDPR" icon="shield" size={36} />
      </div>
    </div>
  );
};
const StageE: React.FC<{ g: number }> = ({ g }) => {
  if (g < IRIS) return null;
  const r = 1750 * kf(g, IRIS, IRIS_D, INOUT);
  const dx = glide(g, UPP, IRIS + IRIS_D, 120, -120);
  const pl = glide(g, IRIS, F.h4, 60, -150);                          // the plate's content keeps travelling
  const cx = RING.x + dx, cy = RING.y;
  const lk = sp(g, IRIS + 2, 0.5), open = sp(g, F.binding - 1, 0.45, 0.8);
  const t = clamp01((g - (F.h4 - 9)) / 9);                         // the throw, inside the whip
  return (
    <div style={{ position: "absolute", inset: 0, transform: `translateX(${whipOut(g, "h4")}px)`, opacity: whipFade(g, "h4") }}>
      <div style={{ position: "absolute", inset: 0, background: C.sageDeep, clipPath: `circle(${r}px at ${cx}px ${cy}px)` }}>
        <div style={{ position: "absolute", left: cx - 170, top: cy - 190, transform: `translate(${pl - 260 * t * t}px, ${-180 * t * t}px) rotate(${mix(-18, 0, Math.min(1, lk)) + glide(g, IRIS, F.h4, 0, 8) - 22 * t * t}deg) scale(${mix(0.55, 1, Math.min(1, lk)) * glide(g, IRIS, F.h4, 1, 1.08)})` }}>
          <Lock s={340} open={open} c={C.cream} hole={C.sageDeep} />
        </div>
        <Kin g={g} words={[{ t: "Ingen", at: F.ingen }, { t: "binding.", at: F.binding - 1, it: true }]} x={850 + pl} y={446} size={164} color={C.cream} itc={C.sageLight} dx={-90} />
      </div>
    </div>
  );
};

export const Scene4: React.FC<{ g: number }> = ({ g }) => {
  if (g < f("h3") || g >= f("h4")) return null;
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <StageA g={g} />
      <StageB g={g} />
      <StageC g={g} />
      <StageD g={g} />
      <StageE g={g} />
    </div>
  );
};
