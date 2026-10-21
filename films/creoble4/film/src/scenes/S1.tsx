// Builder 1 — B1, VERSION 2 (open → h1, frames 0–302). plan/storyboard.md, shots 1–6. Constant motion: a new shot
// with a real move on every sentence, the voice-over visualised as kinetic type and big UI close-ups.
// 1 "Din nye hjemmeside er få minutter væk.": the words spring in; on the beat the camera zooms THROUGH the "d" of
//   "hjemmeside" (the letters are nearer than the site: parallax) into a website flying forward from depth and
//   assembling; a sage progress ring completes around a clock at the frame's corner.
// 2 "Bygget af AI.": push-in; a light-sage sweep resolves the site; "Bygget af AI." slides across on Glass.
// 3 "Fortæl kort om din virksomhed.": morph: the window shrinks into the huge Virksomhedsnavn field; the name types;
//   the real Branche chips fly in and "Sundhed / Klinik" is chosen.
// 4 "Creoble bygger hele siden.": match move: the typed name becomes the site's own name in its nav while the page
//   builds around it (zoom-out), then the page scrolls top to bottom.
// 5 "Ingen teknik.": whip to deep sage, cream type, code glyphs fly off and dissolve.
// 6 "Ingen skabeloner.": vertical push to a sliding carousel of identical grey templates; they drop away, the one
//   real site flies forward; whip out at h1.
import React from "react";
import { Easing } from "remotion";
import {
  BAR, C, EXIT, Glass, HolmSite, INOUT, Ico, OUT, SANS, SERIF, SHADOW, SHADOW_BIG, aspring, clamp01, f, mix, press,
  typed, whipFade, whipIn, whipOut,
} from "../shared";

/* ---------- local helpers ---------- */
const span = (g: number, a: number, b: number) => clamp01((g - a) / Math.max(1e-6, b - a));
const spr = (g: number, fr: number, resp = 0.42, damp = 1) => aspring(g, fr / 30, resp, damp);   // spring from a FRAME
const lmix = (a: number, b: number, p: number) => Math.exp(mix(Math.log(a), Math.log(b), p));      // scale in log space

const F = {
  din: f("w:din"), nye: f("w:nye"), hj: f("w:hjemmeside"), er: f("w:er"), fa: f("w:f"), min: f("w:minutter"), vk: f("w:vk"),
  byg: f("w:bygget"), af: f("w:af"), ai: f("w:ai"), fortl: f("w:fortl"), kort: f("w:kort"), virk: f("w:virksomhed"),
  om: f("w:om"), din2: f("w:din2"), creo: f("w:creoble"), bygger: f("w:bygger"), hele: f("w:hele"), siden: f("w:siden"), ingen: f("w:ingen"),
  teknik: f("w:teknik"), ingen2: f("w:ingen2"), skab: f("w:skabeloner"), h1: f("h1"),
};

// Kinetic words (Fraunces 400): each springs up through its own mask on its frame. Italic colour is a parameter so
// the line also works on deep sage (light-sage italic there).
type KW = { t: string; at: number; it?: boolean };
const KL: React.FC<{ g: number; words: KW[]; size: number; color?: string; itColor?: string; resp?: number }> = ({ g, words, size, color = C.ink, itColor = C.sageDeep, resp = 0.42 }) => (
  <div style={{ display: "flex", columnGap: size * 0.24, fontFamily: SERIF, fontWeight: 400, fontSize: size, letterSpacing: "-0.025em", lineHeight: 1.05, color, whiteSpace: "nowrap" }}>
    {words.map((w, i) => {
      const p = Math.min(1, spr(g, w.at, resp));
      return (
        <span key={i} style={{ display: "inline-block", overflow: "hidden", paddingBottom: size * 0.16, marginBottom: -size * 0.16, paddingRight: w.it ? size * 0.07 : 0 }}>
          <span style={{ display: "inline-block", transform: `translateY(${(1 - p) * 100}%) scale(${0.9 + 0.1 * p})`, transformOrigin: "50% 100%", fontStyle: w.it ? "italic" : "normal", color: w.it ? itColor : undefined }}>{w.t}</span>
        </span>
      );
    })}
  </div>
);
// centre a child on (cx, cy) with an extra transform
const At: React.FC<{ cx: number; cy: number; tf?: string; o?: number; children: React.ReactNode }> = ({ cx, cy, tf = "", o = 1, children }) => (
  <div style={{ position: "absolute", left: cx, top: cy, transform: `translate(-50%, -50%) ${tf}`, opacity: o }}>{children}</div>
);

// The window (as shared Browser, 1460 wide in design px) with the top bar and the frame's box fading separately, so
// it can grow out of the site's own page or shrink into a field.
const Win: React.FC<{ h?: number; bar?: number; box?: number; children?: React.ReactNode }> = ({ h = 860, bar = 1, box = 1, children }) => (
  <div style={{ position: "relative", width: 1460, height: h }}>
    <div style={{ position: "absolute", inset: 0, borderRadius: 16, background: C.white, boxShadow: `0 0 0 1px ${C.line}, ${SHADOW_BIG}`, opacity: box }} />
    <div style={{ position: "absolute", inset: 0, borderRadius: 16, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1460, height: BAR, background: "#FBFAF7", borderBottom: `1px solid ${C.line}`, display: "flex", alignItems: "center", padding: "0 18px", gap: 8, boxSizing: "border-box", opacity: bar }}>
        {[0, 1, 2].map((i) => <div key={i} style={{ width: 11, height: 11, borderRadius: "50%", background: "#E4E0D9" }} />)}
        <div style={{ position: "absolute", left: "50%", top: 9, transform: "translateX(-50%)", height: 28, minWidth: 320, padding: "0 16px", borderRadius: 8, background: "#F1EEE8", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontSize: 15, color: C.muted, whiteSpace: "nowrap" }}>Forhåndsvisning</div>
      </div>
      <div style={{ position: "absolute", left: 0, top: BAR, width: 1460, height: h - BAR, overflow: "hidden" }}>{children}</div>
    </div>
  </div>
);
// place a 1460 × h window centred on (cx, cy), scaled s, with an optional 3D turn
const winStyle = (cx: number, cy: number, s: number, h = 860, ry = 0, rx = 0): React.CSSProperties => ({
  position: "absolute", left: cx - 730, top: cy - h / 2, transformOrigin: "50% 50%",
  transform: `perspective(2600px) rotateY(${ry}deg) rotateX(${rx}deg) scale(${s})`,
});

// a slim sage progress ring around a small clock (minute hand sweeps with the ring)
const ClockRing: React.FC<{ p: number; size: number }> = ({ p, size }) => {
  const m = size / 2, r = size * 0.43, c = 2 * Math.PI * r, sw = size * 0.05;
  const a = (deg: number, len: number) => ({ x2: m + len * Math.sin((deg * Math.PI) / 180), y2: m - len * Math.cos((deg * Math.PI) / 180) });
  return (
    <svg width={size} height={size} style={{ display: "block", overflow: "visible" }}>
      <circle cx={m} cy={m} r={r} fill="none" stroke={C.line} strokeWidth={sw} />
      <circle cx={m} cy={m} r={r} fill="none" stroke={C.sage} strokeWidth={sw} strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - p)} transform={`rotate(-90 ${m} ${m})`} />
      <circle cx={m} cy={m} r={size * 0.22} fill="none" stroke={C.sageDeep} strokeWidth={size * 0.035} />
      <line x1={m} y1={m} {...a(360 * p, size * 0.15)} stroke={C.sageDeep} strokeWidth={size * 0.035} strokeLinecap="round" />
      <line x1={m} y1={m} {...a(120 + 30 * p, size * 0.1)} stroke={C.sageDeep} strokeWidth={size * 0.035} strokeLinecap="round" />
    </svg>
  );
};

// one identical grey template (a generic theme thumbnail), 500 × 294
const Tpl: React.FC = () => (
  <div style={{ width: 500, height: 294, borderRadius: 14, background: "#EFECE6", border: `1px solid ${C.line}`, boxSizing: "border-box", overflow: "hidden", boxShadow: SHADOW }}>
    <div style={{ height: 22, background: "#E7E3DC", display: "flex", alignItems: "center", gap: 5, padding: "0 10px" }}>{[0, 1, 2].map((i) => <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "#D3CEC6" }} />)}</div>
    <div style={{ padding: "18px 22px" }}>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}><div style={{ width: 20, height: 20, borderRadius: 6, background: "#D6D1C9" }} /><div style={{ width: 80, height: 9, borderRadius: 5, background: "#D6D1C9" }} /><div style={{ flex: 1 }} />{[0, 1, 2, 3].map((i) => <div key={i} style={{ width: 30, height: 7, borderRadius: 4, background: "#DDD9D2" }} />)}</div>
      <div style={{ display: "flex", gap: 18, marginTop: 22 }}>
        <div style={{ flex: 1 }}><div style={{ height: 18, borderRadius: 6, background: "#D3CEC6", width: "92%" }} /><div style={{ height: 18, borderRadius: 6, background: "#D3CEC6", width: "70%", marginTop: 10 }} /><div style={{ height: 8, borderRadius: 4, background: "#DDD9D2", width: "88%", marginTop: 18 }} /><div style={{ height: 8, borderRadius: 4, background: "#DDD9D2", width: "64%", marginTop: 8 }} /><div style={{ height: 28, borderRadius: 14, background: "#D3CEC6", width: 96, marginTop: 18 }} /></div>
        <div style={{ width: 190, height: 150, borderRadius: 12, background: "#DCD8D0" }} />
      </div>
    </div>
  </div>
);

/* ---------- shot 1–2: the site's journey (out of the letter, flying forward, pushed in) ---------- */
const O = { x: 1314, y: 617 };                        // the counter of the "d" in "hjemmeside" (measured on a still)
const SITE0 = 50 / 1460, SITE1 = 0.8, SITE2 = 1.2;    // the site inside the counter → flown in → pushed in (full)
const PAR = 0.6;                                      // parallax: the site is further away than the letters
const UZ = Math.log(SITE1 / SITE0) / PAR;
const ZE = Easing.bezier(0.5, 0, 0.2, 1);
const ZA = F.hj + 4, ZB = F.hj + 60;                   // the camera's run: just after the word lands → the site in
const cam = (g: number) => UZ * ZE(span(g, ZA, ZB));
const typeZoom = (g: number) => (1 + 0.05 * span(g, 0, ZA)) * Math.exp(cam(g));
const siteS12 = (g: number) => SITE0 * Math.exp(PAR * cam(g)) * lmix(1, SITE2 / SITE1, INOUT(span(g, F.byg - 7, F.byg + 20))) * (1 + 0.04 * INOUT(span(g, F.vk, F.fortl + 4)));
const siteC12 = (g: number) => { const p = INOUT(span(g, ZA + 8, ZB - 2)); return { x: mix(O.x, 960, p), y: mix(O.y, 548, p) - 8 * INOUT(span(g, F.byg, F.byg + 22)) }; };

/* ---------- shot 3: the field ---------- */
const FLD = { x: 310, y: 440, w: 1300, h: 150 };       // the Virksomhedsnavn field (screen, before the push)
const FPAD = 44, FSIZE = 64;
const PUSH_O = { x: 960, y: 560 };
const M3A = F.fortl - 4, M3B = F.fortl + 12;           // the window shrinks into the field
const push3 = (g: number) => 1 + 0.12 * INOUT(span(g, M3A, F.creo + 12));
const dx3 = (g: number) => 40 - 90 * INOUT(span(g, M3A, F.creo + 12));
const fieldText = (g: number) => {                     // the typed text's left edge and centre line on screen
  const P = push3(g);
  return { x: PUSH_O.x + P * (FLD.x + FPAD - PUSH_O.x) + dx3(g), y: PUSH_O.y + P * (FLD.y + FLD.h / 2 - PUSH_O.y), size: FSIZE * P };
};
const NAME = "Holm Fysioterapi";
const CHIPS = ["Håndværker / Service", "Sundhed / Klinik", "Restaurant / Café"];   // the real builder's Branche options

/* ---------- shot 4: the name becomes the site's own name ---------- */
const NAV = { x: 112, y: BAR + 57 };                   // the nav name in the window (design px)
const S4 = 0.9, C4 = { x: 960, y: 548 };

export const Scene1: React.FC<{ g: number }> = ({ g }) => {
  if (g < f("open") || g >= F.h1) return null;

  /* ===== shot 1: the type and the zoom-through ===== */
  const tz = typeZoom(g), sc = siteC12(g);
  const typeOn = tz < 46;

  /* ===== the site (shots 1–3) ===== */
  const siteOn12 = g >= ZA - 2 && g < M3B;
  const m3 = INOUT(span(g, M3A, M3B));
  const s12 = siteS12(g);
  const build12 = g < F.vk + 10 ? 0.7 * span(g, F.hj + 20, F.vk + 10) : 0.7 + 0.3 * span(g, F.vk + 10, F.byg + 22);
  const scroll12 = 240 * INOUT(span(g, F.byg + 8, M3B));
  const sweep = INOUT(span(g, F.byg - 1, F.byg + 24));
  const ry12 = 15 * (1 - OUT(span(g, ZA + 10, F.byg)));
  const rx12 = -5 * (1 - OUT(span(g, ZA + 10, F.byg)));
  // morph into the field
  const sF = FLD.w / 1460, hF = FLD.h / sF;
  const P3 = push3(g);
  const fCx = PUSH_O.x + P3 * (FLD.x + FLD.w / 2 - PUSH_O.x) + dx3(g), fCy = PUSH_O.y + P3 * (FLD.y + FLD.h / 2 - PUSH_O.y);
  const sNow = lmix(s12, sF * P3, m3), hNow = mix(860, hF, m3);
  const cxNow = mix(sc.x, fCx, m3), cyNow = mix(sc.y, fCy, m3);
  const siteFade = (g < ZA + 6 ? span(g, ZA - 2, ZA + 6) : 1);

  /* ===== the clock ring (shot 1) ===== */
  const ringIn = spr(g, F.fa - 2, 0.4), ringOut = EXIT(span(g, F.byg - 2, F.byg + 6));
  const ringP = INOUT(span(g, F.fa, F.vk + 4));
  const corner = { x: sc.x + 730 * s12 * (1 - ry12 / 60), y: sc.y - 430 * s12 };

  /* ===== shot 2: Glass card ===== */
  const gIn = spr(g, F.byg - 4, 0.5), gOut = EXIT(span(g, F.fortl - 6, F.fortl + 4));
  const gx = mix(1500, 0, gIn) - 90 * span(g, F.byg - 4, F.fortl) - 700 * gOut;

  /* ===== shot 3: field, label, chips ===== */
  const f3on = g >= M3A && g < F.creo + 10;
  const fieldO = span(m3, 0.6, 1) * (1 - span(g, F.creo, F.creo + 7));
  const name = g >= F.kort ? typed(g, "w:kort", NAME, 28) : "";
  const caretOn = Math.floor((g - F.kort) / 8) % 2 === 0 || (g > F.kort && name.length < NAME.length);
  const lblIn = spr(g, M3B - 4, 0.45);
  const chipsOut = EXIT(span(g, F.creo, F.creo + 9));
  const sel = spr(g, F.virk + 12, 0.35), selPress = press(g, F.virk / 30 + 0.38, 0.06);
  const brIn = spr(g, F.virk - 4, 0.45);

  /* ===== shot 4 ===== */
  const p4 = INOUT(span(g, F.creo + 1, F.bygger + 10));
  const ft = fieldText(F.creo);
  const sA = ft.size / 21;
  const s4base = lmix(sA, S4, p4);
  const A0 = { x: ft.x, y: ft.y }, A1 = { x: C4.x - 730 * S4 + NAV.x * S4, y: C4.y - 430 * S4 + NAV.y * S4 };
  const ax = mix(A0.x, A1.x, p4), ay = mix(A0.y, A1.y, p4);
  const c4 = { x: ax + (730 - NAV.x) * s4base, y: ay + (430 - NAV.y) * s4base };
  const s4 = s4base * (1 + 0.07 * INOUT(span(g, F.bygger, F.ingen + 2)));
  const build4 = 0.143 + 0.857 * span(g, F.creo + 6, F.siden + 6);
  const scroll4 = 686 * INOUT(span(g, F.hele - 6, F.ingen - 4));
  const shot4On = g >= F.creo && g < F.ingen;
  const w4 = whipOut(g, "w:ingen"), w4o = whipFade(g, "w:ingen");

  /* ===== shot 5: deep sage ===== */
  const shot5On = g >= F.ingen && g < F.ingen2 + 8;
  const push56 = INOUT(span(g, F.ingen2 - 5, F.ingen2 + 7));
  const w5 = whipIn(g, "w:ingen");

  /* ===== shot 6: carousel ===== */
  const shot6On = g >= F.ingen2 - 5;
  const R = 3, TS = 1.3, PITCH = 700, V = 26, FLY = F.skab + 3;
  const carX = (gg: number) => 960 - R * PITCH + V * (FLY - gg);
  const w6 = whipOut(g, "h1"), w6o = whipFade(g, "h1");

  return (
    <>
      {/* ---------------- the site: out of the letter, flying, pushed in, shrinking into the field ---------------- */}
      {siteOn12 && (
        <div style={{ position: "absolute", inset: 0, transform: g >= M3A ? `translateX(0px)` : undefined }}>
          <div style={{ ...winStyle(cxNow, cyNow, sNow, hNow, ry12 * (1 - m3), rx12 * (1 - m3)), opacity: siteFade }}>
            <Win h={hNow} bar={1 - span(m3, 0, 0.5)} box={1 - span(m3, 0.7, 1)}>
              <div style={{ opacity: 1 - span(m3, 0.05, 0.5) }}>
                <HolmSite w={1460} h={hNow - BAR} build={build12} scroll={scroll12} />
              </div>
              {sweep > 0 && sweep < 1 && (
                <div style={{ position: "absolute", top: 0, bottom: 0, left: mix(-900, 1700, sweep), width: 760, background: "linear-gradient(100deg, rgba(168,196,187,0) 0%, rgba(168,196,187,0.55) 45%, rgba(231,239,236,0.7) 55%, rgba(168,196,187,0) 100%)" }} />
              )}
            </Win>
          </div>
        </div>
      )}

      {/* the clock ring at the frame's corner */}
      {g >= F.fa - 2 && ringOut < 1 && (
        <At cx={corner.x - 40 * clamp01(s12 / SITE1)} cy={corner.y + 40 * clamp01(s12 / SITE1)} tf={`scale(${(0.6 + 0.4 * Math.min(1, ringIn)) * (1 - 0.4 * ringOut) * (0.5 + 0.5 * clamp01(s12 / SITE1))})`} o={Math.min(1, ringIn) * (1 - ringOut)}>
          <Glass p={Math.min(1, ringIn)} radius={999} weight={1.2} style={{ width: 168, height: 168, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ClockRing p={ringP} size={124} />
          </Glass>
        </At>
      )}

      {/* ---------------- shot 1: the hook ---------------- */}
      {typeOn && (
        <div style={{ position: "absolute", inset: 0, transformOrigin: `${O.x}px ${O.y}px`, transform: `translate(${sc.x - O.x}px, ${sc.y - O.y}px) scale(${tz})`, opacity: 1 - span(tz, 30, 46) }}>
          <At cx={960} cy={350 + 70 * (1 - OUT(span(g, 0, ZA + 6)))}><KL g={g} size={150} resp={0.3} words={[{ t: "Din", at: 0 }, { t: "nye", at: F.nye - 1 }]} /></At>
          <At cx={960} cy={585}><KL g={g} size={250} resp={0.36} words={[{ t: "hjemmeside", at: F.hj, it: true }]} /></At>
        </div>
      )}

      {/* ---------------- shot 2: "Bygget af AI." on Glass ---------------- */}
      {g >= F.byg - 4 && gOut < 1 && (
        <div style={{ position: "absolute", left: 150 + gx, top: 700 - 40 * gOut, opacity: 1 - gOut }}>
          <Glass p={Math.min(1, gIn)} radius={36} weight={1.5} style={{ width: 1130, height: 240, position: "relative", display: "flex", alignItems: "center", padding: "0 64px", boxSizing: "border-box", gap: 30 }}>
            <KL g={g} size={136} words={[{ t: "Bygget", at: F.byg }, { t: "af", at: F.af }, { t: "AI.", at: F.ai, it: true }]} />
            <div style={{ transform: `scale(${Math.min(1.1, spr(g, F.ai + 2, 0.4, 0.85))}) rotate(${-90 + 90 * Math.min(1, spr(g, F.ai + 2, 0.5)) + 20 * span(g, F.ai, F.fortl)}deg)`, opacity: span(g, F.ai, F.ai + 3) }}>
              <Ico n="sparkle" s={104} c={C.sageDeep} w={2} fill={C.sageTint} />
            </div>
          </Glass>
        </div>
      )}

      {/* ---------------- shot 3: the field, the label, the chips ---------------- */}
      {f3on && (
        <div style={{ position: "absolute", inset: 0, transformOrigin: `${PUSH_O.x}px ${PUSH_O.y}px`, transform: `translateX(${dx3(g)}px) scale(${P3})` }}>
          <At cx={960} cy={FLD.y - 205 - 140 * EXIT(span(g, F.creo, F.creo + 10))} o={1 - span(g, F.creo + 2, F.creo + 10)}>
            <KL g={g} size={120} words={[{ t: "Fortæl", at: F.fortl }, { t: "kort", at: F.kort }, { t: "om", at: F.om }, { t: "din", at: F.din2 }, { t: "virksomhed.", at: F.virk, it: true }]} />
          </At>
          <div style={{ position: "absolute", left: FLD.x, top: FLD.y - 70 + 24 * (1 - Math.min(1, lblIn)), opacity: Math.min(1, lblIn) * (1 - chipsOut), fontFamily: SANS, fontWeight: 500, fontSize: 36, color: C.ink }}>
            Virksomhedsnavn <span style={{ color: C.sage }}>*</span>
          </div>
          <div style={{ position: "absolute", left: FLD.x, top: FLD.y, width: FLD.w, height: FLD.h, boxSizing: "border-box", borderRadius: 18, background: C.white, border: `2px solid ${C.sage}`, boxShadow: `0 0 0 8px ${C.sageTint}, ${SHADOW}`, opacity: fieldO, display: "flex", alignItems: "center", padding: `0 ${FPAD - 2}px`, fontFamily: SANS, fontSize: FSIZE, fontWeight: 500, letterSpacing: "-0.01em", color: name ? C.ink : C.soft }}>
            {g < F.creo && (name || "fx Klinik for Fysioterapi")}
            {g < F.creo && <span style={{ display: "inline-block", width: 4, height: 76, marginLeft: 4, borderRadius: 2, background: C.sageDeep, opacity: caretOn ? 1 : 0 }} />}
          </div>
          <div style={{ position: "absolute", left: FLD.x, top: FLD.y + FLD.h + 54 + 20 * (1 - Math.min(1, brIn)), opacity: Math.min(1, brIn) * (1 - chipsOut), fontFamily: SANS, fontWeight: 500, fontSize: 30, color: C.muted }}>Branche</div>
          <div style={{ position: "absolute", left: FLD.x, top: FLD.y + FLD.h + 112 + 90 * chipsOut, display: "flex", gap: 22, opacity: 1 - chipsOut }}>
            {CHIPS.map((t, i) => {
              const p = spr(g, F.virk + i * 3, 0.45);
              const on = i === 1 ? Math.min(1, sel) : 0;
              return (
                <div key={t} style={{ display: "flex", alignItems: "center", gap: 14 * on, height: 84, padding: "0 34px", borderRadius: 999, boxSizing: "border-box",
                  background: on > 0 ? `color-mix(in srgb, ${C.sageTint} ${on * 100}%, #FFFFFF)` : C.white, border: `2px solid ${on > 0 ? `color-mix(in srgb, ${C.sage} ${on * 100}%, ${C.line})` : C.line}`,
                  boxShadow: SHADOW, fontFamily: SANS, fontWeight: 500, fontSize: 34, color: C.ink, whiteSpace: "nowrap",
                  transform: `translate(${(1 - p) * (380 + i * 160)}px, ${(1 - p) * 120}px) scale(${(1 - 0.04 * (i === 1 ? selPress : 0)) * (0.9 + 0.1 * Math.min(1, p))})`, opacity: clamp01(p * 2.5) }}>
                  {i === 1 && <div style={{ width: 40 * on, height: 40, overflow: "hidden", flex: "none" }}><div style={{ width: 40, height: 40, borderRadius: "50%", background: C.sage, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${on})` }}><Ico n="check" s={28} c={C.white} w={3} /></div></div>}
                  {t}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ---------------- shot 4: the name becomes the site's; the page builds and scrolls ---------------- */}
      {shot4On && (
        <div style={{ position: "absolute", inset: 0, transform: `translateX(${w4}px)`, opacity: w4o }}>
          <div style={{ ...winStyle(c4.x, c4.y, s4), opacity: span(g, F.creo + 1, F.creo + 7) }}>
            <Win bar={span(p4, 0.45, 1)} box={span(p4, 0.45, 1)}>
              <HolmSite w={1460} h={860 - BAR} build={build4} scroll={scroll4} />
            </Win>
          </div>
          {g < F.creo + 10 && (
            <div style={{ position: "absolute", left: ax, top: ay, transform: "translateY(-50%)", fontFamily: SANS, fontWeight: mix(500, 600, span(g, F.creo, F.creo + 3)), fontVariationSettings: `"opsz" ${mix(40, 21, span(g, F.creo, F.creo + 3))}`, fontSize: 21 * s4base, letterSpacing: "-0.01em", color: C.ink, whiteSpace: "nowrap", opacity: 1 - span(g, F.creo + 6, F.creo + 10) }}>{NAME}</div>
          )}
        </div>
      )}

      {/* ---------------- shot 5: "Ingen teknik." on deep sage ---------------- */}
      {shot5On && (
        <div style={{ position: "absolute", inset: 0, background: C.sageDeep, overflow: "hidden", transform: `translateY(${-1080 * push56}px)` }}>
          <div style={{ position: "absolute", inset: 0, transform: `translateX(${w5}px)` }}>
          {["</>", "{ }", "<div>", "=>", "{ }", "</>", ";", "[ ]"].map((t, i) => {
            const ang = (i / 8) * Math.PI * 2 + 0.4, r0 = 330 + (i % 3) * 70;
            const fly = EXIT(span(g, F.teknik - 2 + i * 1.2, F.teknik + 14 + i * 1.2));
            const r = r0 + 40 * span(g, F.ingen, F.teknik) + 1100 * fly;
            const o = (0.35 + 0.65 * span(g, F.ingen, F.ingen + 5)) * (1 - span(fly, 0.3, 0.9));
            return (
              <div key={i} style={{ position: "absolute", left: 960 + Math.cos(ang) * r * 1.6, top: 530 + Math.sin(ang) * r * 0.75, transform: `translate(-50%, -50%) rotate(${(i % 2 ? 1 : -1) * (6 + 30 * fly)}deg)`, fontFamily: SANS, fontWeight: 500, fontSize: 64 + (i % 3) * 22, color: C.sageLight, opacity: 0.55 * o, filter: `blur(${6 * fly}px)`, whiteSpace: "nowrap" }}>{t}</div>
            );
          })}
          <At cx={960 - 40 * span(g, F.ingen, F.ingen2 + 8)} cy={540} tf={`scale(${1 + 0.06 * span(g, F.ingen, F.ingen2 + 8)})`}>
            <KL g={g} size={230} color={C.cream} itColor={C.sageLight} words={[{ t: "Ingen", at: F.ingen - 1 }, { t: "teknik.", at: F.teknik, it: true }]} />
          </At>
          </div>
        </div>
      )}

      {/* ---------------- shot 6: the templates drop away; the real site flies forward ---------------- */}
      {shot6On && (
        <div style={{ position: "absolute", inset: 0, transform: `translate(${w6}px, ${1080 * (1 - push56)}px)`, opacity: w6o }}>
          <At cx={960 - 40 * span(g, F.ingen2, F.h1)} cy={205} tf={`scale(${1 + 0.05 * span(g, F.ingen2, F.h1)})`}>
            <KL g={g} size={150} words={[{ t: "Ingen", at: F.ingen2 }, { t: "skabeloner.", at: F.skab, it: true }]} />
          </At>
          {Array.from({ length: 9 }, (_, i) => i).filter((i) => i !== R).map((i) => {
            const x = carX(g) + i * PITCH;
            const order = i < R ? i : i - 1;
            const t = span(g, F.skab + 1 + order * 1.4, F.skab + 15 + order * 1.4);
            if (t >= 1) return null;
            return (
              <At key={i} cx={x} cy={660 + 1000 * t * t} tf={`rotate(${(i % 2 ? 1 : -1) * 9 * t}deg) scale(${TS})`} o={1 - span(t, 0.5, 1)}><Tpl /></At>
            );
          })}
          {(() => {
            const q = spr(g, FLY, 0.5);
            const xFrom = carX(Math.min(g, FLY)) + R * PITCH;
            const s = lmix((500 * TS) / 1460, 0.72, Math.min(1, q));
            return (
              <div style={{ ...winStyle(mix(xFrom, 960, Math.min(1, q)), mix(660, 648, Math.min(1, q)), s, 860, -10 * (1 - Math.min(1, q))), boxShadow: undefined }}>
                <Win><HolmSite w={1460} h={860 - BAR} build={1} scroll={60 * span(g, F.ingen2, F.h1)} /></Win>
              </div>
            );
          })()}
        </div>
      )}
    </>
  );
};
