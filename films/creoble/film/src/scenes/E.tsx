// Scene E (25.30–30.15 s): "Need hosting? We've got that covered too." / "No coding. No complexity."   (v3)
// Cream throughout. On "Need hosting?" a white address bar rises on clean cream; the blue guide cursor glides in and
// clicks into it (a focus ring, a soft ripple), the pointer hides and bagerietlund.dk types on; it goes Live with a
// gentle pulse. The bar carries up, a dotted globe turns in below it, Denmark lit; three feature chips fly out of the
// globe on "we've", "got", "that"; the hosting price arrives on "covered". The picture leaves. "No coding." builds big
// with ONE small, light code card under it (four short lines of HTML) that dissolves line by line on "coding".
// "No complexity." builds as line 2 while two light technical cards (DNS records, Server settings) rise under it and
// fold away on "complexity". Both lines blur-rise out; clean cream by frame 905.
// See ../../../plan/v3-changes.md and ../../../plan/v2-storyboard.md.
import React from "react";
import { AbsoluteFill } from "remotion";
import { ARRIVE, C, DEPART, MOVE, clamp01, mix } from "../lib";
import { AnswerChip, Cursor, Ico, Plane, SANS, Say, f, k } from "../shared";

const MONO = "'DejaVu Sans Mono', 'Liberation Mono', ui-monospace, monospace";
const bump = (g: number, at: number, dur: number) => Math.sin(Math.PI * clamp01((g - f(at)) / (dur * 30)));

/* ---------- the address bar (on cream) and the guide cursor that clicks into it ---------- */
const BW = 1100, BH = 124;
const DOMAIN = "bagerietlund.dk";
const RISE = 25.3, CLICK = 25.5, TYPE = 25.53, CPS = 56, LIVE = 25.8, UP = 25.95;
const bar = (g: number) => {
  const rise = k(g, RISE, 0.6, ARRIVE);
  const up = k(g, UP, 0.85, MOVE);
  const out = k(g, 27.28, 0.45, DEPART);
  const push = 0.03 * MOVE(clamp01((g - f(RISE)) / 32));        // a slow breath while it types
  return { x: 960, y: mix(540 + 140 * (1 - rise), 205, up) - 40 * out, s: mix(0.95 + 0.05 * rise + push, 0.8, up), o: rise * (1 - out), blur: out * 8, up };
};
const AddressBar: React.FC<{ g: number }> = ({ g }) => {
  const b = bar(g);
  if (b.o <= 0.005) return null;
  const n = Math.max(0, Math.min(DOMAIN.length, Math.floor(((g - f(TYPE)) / 30) * CPS)));
  const txt = DOMAIN.slice(0, n), done = n === DOMAIN.length, clicked = g >= f(CLICK);
  const live = k(g, LIVE, 0.55, ARRIVE);
  const focus = k(g, CLICK, 0.22) * (1 - k(g, LIVE + 0.05, 0.45));
  const caret = !clicked ? 0 : done ? 1 - k(g, LIVE, 0.3) : 1;
  const pulse = ((g - f(LIVE + 0.04)) % 36) / 36, pulseOn = g >= f(LIVE + 0.04);
  const bloom = live * (1 - 0.7 * b.up) * b.o;                  // a soft blue light wakes behind the bar as it goes Live
  return (
    <>
    {bloom > 0.005 && <div style={{ position: "absolute", left: b.x - 760, top: b.y - 250, width: 1520, height: 500, borderRadius: "50%", opacity: bloom,
      transform: `scale(${(0.75 + 0.25 * live + 0.06 * clamp01((g - f(LIVE)) / 30)) * b.s})`,
      background: "radial-gradient(ellipse at center, rgba(74,163,245,0.20) 0%, rgba(74,163,245,0.08) 40%, rgba(74,163,245,0) 70%)" }} />}
    <div style={{ position: "absolute", left: b.x - BW / 2, top: b.y - BH / 2, width: BW, height: BH, transform: `scale(${b.s}) perspective(4000px) rotateX(0.01deg)`, transformOrigin: "50% 50%",
      opacity: b.o, filter: b.blur > 0.05 ? `blur(${b.blur}px)` : undefined, borderRadius: BH / 2, background: C.white,
      boxShadow: `0 0 0 ${2 * focus}px rgba(74,163,245,${0.9 * focus}), 0 0 0 ${10 * focus}px rgba(74,163,245,${0.13 * focus}), 0 0 0 1px rgba(29,29,31,0.05), 0 36px 70px -30px rgba(29,29,31,0.32)` }}>
      <div style={{ position: "absolute", left: 44, top: 0, height: BH, display: "flex", alignItems: "center", gap: 22 }}>
        <Ico n="lock" s={42} c={C.gray} w={2.4} />
        <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 52, letterSpacing: "-0.02em", color: C.ink, whiteSpace: "nowrap", display: "flex", alignItems: "center" }}>
          {txt}<span style={{ display: "inline-block", width: 3, height: 56, marginLeft: 4, borderRadius: 2, background: C.blue, opacity: caret }} />
        </div>
      </div>
      {live > 0 && (
        <div style={{ position: "absolute", right: 30, top: (BH - 66) / 2, height: 66, padding: "0 30px 0 26px", borderRadius: 33, background: C.blueTint, display: "flex", alignItems: "center", gap: 14,
          opacity: live, transform: `translateX(${(1 - live) * 24}px) scale(${0.92 + 0.08 * live})`, fontFamily: SANS, fontWeight: 600, fontSize: 32, color: C.blueDeep, letterSpacing: "-0.01em",
          boxShadow: `0 0 0 ${6 * bump(g, LIVE + 0.04, 0.6)}px rgba(74,163,245,0.18)` }}>
          <div style={{ position: "relative", width: 18, height: 18 }}>
            {pulseOn && <div style={{ position: "absolute", left: 9 - 9 * (1 + 1.6 * pulse), top: 9 - 9 * (1 + 1.6 * pulse), width: 18 * (1 + 1.6 * pulse), height: 18 * (1 + 1.6 * pulse), borderRadius: "50%", background: C.blue, opacity: 0.45 * (1 - pulse) }} />}
            <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: C.blue }} />
          </div>
          Live
        </div>
      )}
    </div>
    </>
  );
};
// The guide: glides in with the rising bar, clicks into the field on "hosting", then hides as typing starts (as macOS does).
const Guide: React.FC<{ g: number }> = ({ g }) => {
  if (g < f(RISE) || g > f(CLICK + 0.5)) return null;
  const b = bar(g);
  const tx = b.x + 70 * b.s, ty = b.y + 10 * b.s;               // the click point, riding on the bar
  const a = k(g, RISE, CLICK - RISE, MOVE), vis = k(g, RISE, 0.12);
  const hide = k(g, CLICK + 0.12, 0.3, DEPART);
  const x = tx + 150 * (1 - a) + 14 * hide, y = ty + 120 * (1 - a) + 10 * hide;
  const press = bump(g, CLICK - 0.02, 0.18);
  const rip = clamp01((g - f(CLICK)) / 12);
  return (
    <>
      {g >= f(CLICK) && rip < 1 && <div style={{ position: "absolute", left: tx - 10 - 40 * rip, top: ty - 10 - 40 * rip, width: 20 + 80 * rip, height: 20 + 80 * rip, borderRadius: "50%",
        background: "rgba(74,163,245,0.22)", opacity: 1 - rip }} />}
      <Cursor x={x} y={y} s={1.3} o={vis * (1 - hide)} press={press} />
    </>
  );
};

/* ---------- the dotted globe (drawn in code) ---------- */
type Dot = { lat: number; lon: number; land: boolean };
const BLOBS: [number, number, number, number][] = [
  [12, 50, 20, 10], [16, 63, 9, 8], [-4, 54, 4, 5], [20, 8, 21, 27], [42, -20, 5, 8], [70, 47, 48, 17], [78, 21, 10, 11], [104, 18, 12, 10], [118, 40, 18, 12],
  [-102, 47, 30, 17], [-88, 20, 9, 7], [-60, -14, 15, 25], [-42, 72, 13, 7], [135, -25, 18, 11], [138, 37, 4, 7],
];
const DOTS: Dot[] = (() => {
  const out: Dot[] = [];
  for (let lat = -78; lat <= 80; lat += 4.6) {
    const n = Math.max(6, Math.round((360 / 4.6) * Math.cos((lat * Math.PI) / 180)));
    for (let i = 0; i < n; i++) {
      const lon = -180 + (i + (Math.round(lat) % 2 ? 0.5 : 0)) * (360 / n);
      const land = BLOBS.some(([lo, la, rl, rf]) => { let d = lon - lo; d = ((d + 540) % 360) - 180; return (d / rl) ** 2 + ((lat - la) / rf) ** 2 < 1; });
      out.push({ lat, lon, land });
    }
  }
  return out;
})();
const GR = 272;
const proj = (lat: number, lon: number, rot: number, tilt: number) => {
  const p = (lat * Math.PI) / 180, l = ((lon + rot) * Math.PI) / 180, t = (tilt * Math.PI) / 180;
  const x = Math.cos(p) * Math.sin(l), y = -Math.sin(p), z = Math.cos(p) * Math.cos(l);
  return { x, y: y * Math.cos(t) + z * Math.sin(t), z: -y * Math.sin(t) + z * Math.cos(t) };
};
const Globe: React.FC<{ g: number; cx: number; cy: number; s: number; o: number; app: number }> = ({ g, cx, cy, s, o, app }) => {
  if (o <= 0.005) return null;
  const rot = -10 + (g - f(26.9)) * 0.34, tilt = 22;
  const dk = proj(56, 10, rot, tilt), pulse = ((g - f(26.4)) % 45) / 45;
  const R = GR + 40;
  return (
    <div style={{ position: "absolute", left: cx - R, top: cy - R, width: 2 * R, height: 2 * R, opacity: o, transform: `scale(${s})`, transformOrigin: "50% 50%" }}>
      <div style={{ position: "absolute", inset: -120, borderRadius: "50%", background: "radial-gradient(circle, rgba(74,163,245,0.20) 0%, rgba(74,163,245,0.07) 42%, rgba(74,163,245,0) 68%)" }} />
      <svg width={2 * R} height={2 * R} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        <circle cx={R} cy={R} r={GR + 1} fill="rgba(255,255,255,0.55)" stroke="rgba(74,163,245,0.22)" strokeWidth={1.5} />
        {DOTS.map((d, i) => {
          const q = proj(d.lat, d.lon, rot, tilt);
          if (q.z < -0.05) return null;
          const front = clamp01(q.z), reveal = clamp01(app * 2.2 - (1 - q.z) * 1.1);
          if (reveal <= 0) return null;
          const r = d.land ? 2.2 + 2.6 * front : 1.2 + 1.2 * front;
          return <circle key={i} cx={R + q.x * GR} cy={R + q.y * GR} r={r * (0.6 + 0.4 * reveal)} fill={d.land ? C.blue : C.blue} opacity={reveal * (d.land ? 0.35 + 0.65 * front : 0.1 + 0.16 * front)} />;
        })}
        {dk.z > 0 && <>
          <circle cx={R + dk.x * GR} cy={R + dk.y * GR} r={10 + 28 * pulse} fill={C.blue} opacity={0.4 * (1 - pulse) * app * dk.z} />
          <circle cx={R + dk.x * GR} cy={R + dk.y * GR} r={8.5} fill={C.blueDeep} stroke={C.white} strokeWidth={3} opacity={app} />
        </>}
      </svg>
    </div>
  );
};

/* ---------- the hosting picture: globe, chips, price ---------- */
const GX = 960, GY = 590;
const FEATS = [
  { icon: "globe", t: "Your own domain", at: "w:weve", x: 470, y: 470 },
  { icon: "mail", t: "Email included", at: "w:got", x: 1450, y: 500 },
  { icon: "server", t: "European servers", at: "w:that", x: 1390, y: 790 },
];
const Hosting: React.FC<{ g: number }> = ({ g }) => {
  const out = k(g, 27.3, 0.45, DEPART);
  if (g < f(26.0) || out >= 1) return null;
  const app = k(g, 26.2, 1.0, ARRIVE);
  const push = 1 + 0.035 * clamp01((g - f(26.4)) / 40);
  const price = k(g, "w:covered", 0.8);
  return (
    <AbsoluteFill style={{ transform: `scale(${push})`, transformOrigin: `${GX}px ${GY}px` }}>
      <Globe g={g} cx={GX} cy={GY + 30 * (1 - app)} s={(0.82 + 0.18 * app) * (1 - 0.18 * out)} o={Math.min(1, app * 1.5) * (1 - out)} app={app} />
      {FEATS.map((c, i) => {
        const t = k(g, `${c.at}-0.06`, 0.85, ARRIVE);
        if (t <= 0) return null;
        const ang = (i * 2.1 + 0.6), arc = (1 - t) * 120;      // fly out of the globe along a gentle arc
        const x = mix(GX, c.x, t) + Math.cos(ang) * arc * Math.sin(Math.PI * t) + 10 * Math.sin((g + i * 40) / 34) + (c.x - GX) * 0.25 * out;
        const y = mix(GY, c.y, t) + Math.sin(ang) * arc * Math.sin(Math.PI * t) + 7 * Math.cos((g + i * 30) / 40) + (c.y - GY) * 0.25 * out;
        return (
          <div key={c.t} style={{ position: "absolute", left: 0, top: 0, transform: `translate(${x}px, ${y}px) translate(-50%, -50%) scale(${0.5 + 0.5 * t})`, opacity: Math.min(1, t * 1.6) * (1 - out),
            filter: t < 0.6 ? `blur(${(1 - t / 0.6) * 6}px)` : undefined }}>
            <AnswerChip icon={c.icon} text={c.t} size={32} />
          </div>
        );
      })}
      {price > 0 && (
        <div style={{ position: "absolute", left: 0, top: 960, width: 1920, textAlign: "center", fontFamily: SANS, fontWeight: 500, fontSize: 36, letterSpacing: "-0.015em", color: C.gray,
          opacity: Math.min(1, price * 1.4) * (1 - out), transform: `translateY(${(1 - price) * 16}px)`, filter: price < 1 ? `blur(${(1 - price) * 8}px)` : undefined }}>
          From <span style={{ color: C.ink, fontWeight: 600 }}>83 kr/month</span>, billed yearly.
        </div>
      )}
    </AbsoluteFill>
  );
};

/* ---------- "No coding.": one small, light code card that dissolves line by line ---------- */
const CODE: [string, string][] = [            // [markup (lighter), text (a touch darker)]
  ['<header class="hero">', ""],
  ["  <h1>", "Bageriet Lund"],
  ['  <a href="/order">', "Order"],
  ["</header>", ""],
];
const CODE_CLOSE = ["", "</h1>", "</a>", ""];
const CARD_Y = 752;
const CodeCard: React.FC<{ g: number }> = ({ g }) => {
  const inn = k(g, 27.74, 0.7, ARRIVE);
  const out = k(g, "w:coding+0.2", 0.24, DEPART);
  if (inn <= 0 || out >= 1) return null;
  const turn = clamp01((g - f(27.74)) / 30);                    // a slow, calm turn while it is on
  return (
    <Plane x={960} y={CARD_Y + 50 * (1 - inn) - 14 * turn + 16 * out} w={540} h={232} rx={mix(14, 6, inn) - 2 * turn} ry={mix(-7, -2, turn)} s={(0.94 + 0.06 * inn) * (1 - 0.04 * out)} o={Math.min(1, inn * 1.4) * (1 - out)}>
      <div style={{ position: "absolute", inset: 0, borderRadius: 26, background: C.white, boxShadow: "0 0 0 1px rgba(29,29,31,0.05), 0 30px 60px -28px rgba(29,29,31,0.30)", padding: "34px 44px", boxSizing: "border-box" }}>
        {CODE.map(([m, t], i) => {
          const w = k(g, `w:coding+${(0.04 + i * 0.045).toFixed(3)}`, 0.3, MOVE);
          return (
            <div key={i} style={{ height: 41, fontFamily: MONO, fontSize: 25, lineHeight: "41px", whiteSpace: "pre", color: "#BDBDC2", opacity: 1 - w,
              transform: `translate(${w * 26}px, ${-w * 8}px)`, filter: w > 0.02 ? `blur(${w * 7}px)` : undefined }}>
              {m}<span style={{ color: C.light }}>{t}</span>{CODE_CLOSE[i]}
            </div>
          );
        })}
      </div>
    </Plane>
  );
};

/* ---------- "No complexity.": two light technical cards that fold away ---------- */
const Toggle: React.FC<{ on: boolean }> = ({ on }) => (
  <div style={{ width: 44, height: 26, borderRadius: 13, background: on ? C.blueTint : C.line, position: "relative" }}>
    <div style={{ position: "absolute", top: 3, left: on ? 21 : 3, width: 20, height: 20, borderRadius: 10, background: on ? C.blue : C.white, opacity: on ? 0.55 : 1 }} /></div>
);
const RowT: React.FC<{ a: string; children: React.ReactNode }> = ({ a, children }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: 50, borderTop: `1px solid ${C.line}`, fontFamily: SANS, fontWeight: 500, fontSize: 21, color: C.gray, whiteSpace: "nowrap" }}>
    <span>{a}</span>{children}
  </div>
);
const val = (t: string) => <span style={{ fontFamily: MONO, fontSize: 19, color: C.light }}>{t}</span>;
const TECH = [
  { t: "DNS records", icon: "globe", x: 700, ry: 9, rz: -1.2, body: <><RowT a="A record">{val("185.21.4.12")}</RowT><RowT a="CNAME">{val("bagerietlund.dk")}</RowT></> },
  { t: "Server settings", icon: "sliders", x: 1220, ry: -9, rz: 1.2, body: <><RowT a="SSL certificate"><Toggle on /></RowT><RowT a="PHP version">{val("8.2")}</RowT></> },
];
const TECH_Y = 862;
const Tech: React.FC<{ g: number }> = ({ g }) => {
  if (g < f("w:no2-0.45") || g > f("w:complexity+1.0")) return null;
  return <>{TECH.map((c, i) => {
    const inn = k(g, `w:no2-${(0.26 - i * 0.06).toFixed(2)}`, 0.7, ARRIVE);
    const fold = k(g, `w:complexity+${(0.1 + i * 0.07).toFixed(2)}`, 0.55, MOVE);
    if (inn <= 0 || fold >= 1) return null;
    const drift = (g - f("w:no2")) * 0.05 * Math.sign(c.ry);
    return (
      <Plane key={c.t} x={c.x + (c.x - 960) * 0.08 * (1 - inn)} y={TECH_Y + 60 * (1 - inn) + 40 * fold} w={440} h={196}
        rx={mix(16, 4, inn) + 84 * fold} ry={c.ry + drift} rz={c.rz} s={(0.94 + 0.06 * inn) * (1 - 0.08 * fold)}
        o={Math.min(1, inn * 1.4) * (1 - clamp01((fold - 0.35) / 0.6))}>
        <div style={{ position: "absolute", inset: 0, borderRadius: 24, background: C.white, boxShadow: "0 0 0 1px rgba(29,29,31,0.05), 0 30px 60px -28px rgba(29,29,31,0.30)", padding: "24px 30px 0", boxSizing: "border-box" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, fontFamily: SANS, fontWeight: 600, fontSize: 24, color: C.ink, letterSpacing: "-0.015em", height: 40, marginBottom: 10 }}>
            <Ico n={c.icon} s={26} c={C.light} w={2.2} />{c.t}</div>
          {c.body}
        </div>
      </Plane>
    );
  })}</>;
};

/* ---------- the scene ---------- */
export const SceneE: React.FC<{ g: number }> = ({ g }) => {
  if (g < 759 || g > 905) return null;
  const lift = k(g, "w:no2-0.45", 0.6, MOVE);
  const y1 = mix(392, 362, lift);
  const push = 1 + 0.045 * clamp01((g - f("w:no")) / (f(30.1) - f("w:no")));   // a slow push under the two lines
  return (
    <AbsoluteFill>
      <Hosting g={g} />
      <AddressBar g={g} />
      <Guide g={g} />
      <CodeCard g={g} />
      <Tech g={g} />
      {g >= f("w:no") - 1 && (
        <AbsoluteFill style={{ transform: `scale(${push})`, transformOrigin: "960px 520px" }}>
          <Say g={g} words={[{ t: "No", at: "w:no" }, { t: "coding.", at: "w:coding" }]} y={y1} size={144} out="simple-0.39" />
          {g >= f("w:no2") - 1 && <Say g={g} words={[{ t: "No", at: "w:no2" }, { t: "complexity.", at: "w:complexity", blue: true }]} y={540} size={144} out="simple-0.32" />}
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
