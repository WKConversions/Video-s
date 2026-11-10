// Scene C (h2 44.65 s → end 65.2 s): the panel that updates the live site, "Aldrig en linje kode.", the plan card,
// Danish support, and the outro (send button → dot → the C → the lockup, the button, the address).
// Object-led: every beat is a fixed 2D frame in a slow steady push (0.97 → 1, so everything ends inside SAFE); the
// things in it arrive from below, leave upward or sink back, and grow out of what caused them. No camera moves.
import React from "react";
import { AbsoluteFill, Easing, Img, staticFile } from "remotion";
import { C, HOLM, OUT, SANS, SERIF, SHADOW, SHADOW_BIG, clamp01, mix } from "../lib";
import { aspring, press, typed, Ico, Wordmark, HolmSite, Browser } from "../shared";
import { ACCENT, TYPE, measure, useFonts } from "../type";
import { Dots, Icon, ANG, RING, LOGO, BOX_C } from "../dots";
import { HostingCard, CARD, Cursor, cursorAt, Handoff2, NEW_HEADLINE } from "../ui";
import { f } from "../shared";

export const BLUR: [number, number][] = [];

export const EVENTS: { t: number; kind: "click" | "type" | "check" | "pop" | "open" | "send" | "logo"; len?: number; note: string }[] = [
  { t: 45.0, kind: "open", note: "hosting card becomes the panel; the live site rises" },
  { t: 45.75, kind: "type", len: 0.95, note: "panel field: Massage: 450 kr." },
  { t: 46.7, kind: "send", note: "sage dot travels panel to site" },
  { t: 47.15, kind: "pop", note: "site: Massage price swaps to 450 kr." },
  { t: 47.5, kind: "click", note: "photo dropped on the panel" },
  { t: 47.3, kind: "open", len: 1.2, note: "site page scrolls up to the hero" },
  { t: 47.9, kind: "send", note: "sage dot travels panel to site" },
  { t: 48.4, kind: "pop", note: "site: hero photo changes" },
  { t: 48.9, kind: "check", note: "Opdateret chip lands on the site window" },
  { t: 49.7, kind: "open", note: "panel and site settle small; type line begins" },
  { t: 52.3, kind: "open", note: "type line glides up; plan card rises" },
  { t: 52.82, kind: "check", note: "row: Stop når som helst" },
  { t: 54.25, kind: "pop", note: "År 1" },
  { t: 54.85, kind: "pop", note: "År 2" },
  { t: 55.35, kind: "pop", note: "År 3" },
  { t: 56.3, kind: "open", note: "plan card leaves upward; chat panel rises" },
  { t: 56.85, kind: "send", note: "customer bubble: Kan I hjælpe med min e-mail?" },
  { t: 57.0, kind: "type", len: 0.76, note: "Sofie's reply types" },
  { t: 57.8, kind: "pop", note: "chip: Dansk support" },
  { t: 58.3, kind: "click", note: "send button pressed; turns sage" },
  { t: 58.6, kind: "send", note: "the dot leaves the panel and glides to the centre" },
  { t: 59.0, kind: "logo", len: 0.5, note: "the six dots unfurl into the C" },
  { t: 59.45, kind: "open", note: "wordmark slides out beside the C" },
  { t: 60.04, kind: "pop", note: "button: Byg din side gratis" },
  { t: 60.9, kind: "type", len: 0.83, note: "creoble.dk types" },
  { t: 62.6, kind: "click", note: "the button is pressed; the dots turn once" },
];

/* ---------- motion helpers (seconds) ---------- */
const GL = Easing.bezier(0.42, 0, 0.22, 1);            // a glide: soft start, long landing (big surfaces: 1 s or more)
const SINE = (x: number) => 0.5 - 0.5 * Math.cos(Math.PI * x);
const gl = (t: number, at: number, dur: number) => GL(clamp01((t - at) / dur));
const sn = (t: number, at: number, dur: number) => SINE(clamp01((t - at) / dur));
const SM = (x: number) => x * x * x * (10 - 15 * x + 6 * x * x);                 // the softest start and stop, for the biggest surfaces
const sm = (t: number, at: number, dur: number) => SM(clamp01((t - at) / dur));
const push = (t: number, a: number, b: number, from = 0.95, to = 1) => from + (to - from) * clamp01((t - a) / (b - a));
const arr = (q: number, rise = 70, from = 0.9): React.CSSProperties => ({ opacity: SINE(clamp01(q * 1.25)), transform: `translateY(${((1 - q) * rise).toFixed(2)}px) scale(${mix(from, 1, q).toFixed(4)})` });
const Group: React.FC<{ s: number; children?: React.ReactNode }> = ({ s, children }) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "960px 540px", transform: `scale(${s.toFixed(5)})` }}>{children}</div>
);
const photo = (src: string, st: React.CSSProperties = {}) => <Img src={staticFile(`img/${src}`)} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", ...st }} />;
const CheckDot: React.FC<{ s: number; q?: number }> = ({ s, q = 1 }) => (
  <div style={{ width: s, height: s, borderRadius: "50%", background: C.sage, display: "flex", alignItems: "center", justifyContent: "center", flex: "none", transform: `scale(${q.toFixed(4)})`, opacity: clamp01(q * 2) }}>
    <Ico n="check" s={s * 0.66} c={C.white} w={3} />
  </div>
);

/* ---------- C1: the panel updates the live site ---------- */
// Two objects fill SAFE: the panel (600 × 560, left) and the live site (1000 × 740, right). The hosting card of the
// hand-off becomes the panel (one box: it shrinks left while its content cross-fades). Each change is a chain: the
// panel takes the input, a sage dot travels to the site, the site's element updates.
const SITE_S = 1000 / 1460, SITE_H = 740 / SITE_S, SCR_CARDS = 430, SCR_HERO = 40;   // the page scrolls from the services row up to the hero
const PANEL = { x: 144, y: 260, w: 600, h: 560 }, SITEP = { x: 776, y: 170, w: 1000, h: 740 };
const FIELD = { x: 34, y: 146, w: 532, h: 84 }, ZONE = { x: 34, y: 290, w: 532, h: 236 }, THUMB = { w: 250, h: 176 };
const pagePt = (x: number, y: number, scroll: number) => ({ x: SITEP.x + x * SITE_S, y: SITEP.y + (46 + y - scroll) * SITE_S });
const SRC1 = { x: PANEL.x + FIELD.x + FIELD.w - 44, y: PANEL.y + FIELD.y + FIELD.h / 2 }, DST1 = pagePt(620, 1110, SCR_CARDS);
const SRC2 = { x: PANEL.x + ZONE.x + ZONE.w / 2, y: PANEL.y + ZONE.y + ZONE.h / 2 }, DST2 = pagePt(1075, 400, SCR_HERO);
const NEWTXT = "Massage: 450 kr.";
const MINI = 0.32, MINI_Y = 838;
// a small sage dot carrying the change from a to b (a low arc), 0.5 s
const Courier: React.FC<{ t: number; at: number; a: { x: number; y: number }; b: { x: number; y: number } }> = ({ t, at, a, b }) => {
  const x = (t - at) / 0.52;
  if (x <= 0 || x >= 1) return null;
  const q = SINE(x), u = 1 - q, mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2 - 70;
  const px = u * u * a.x + 2 * u * q * mx + q * q * b.x, py = u * u * a.y + 2 * u * q * my + q * q * b.y;
  return <div style={{ position: "absolute", left: px - 15, top: py - 15, width: 30, height: 30, borderRadius: 15, background: C.sage, opacity: Math.min(1, x * 6, (1 - x) * 5), transform: `scale(${(0.7 + 0.5 * Math.sin(Math.PI * x)).toFixed(3)})` }} />;
};
const C1: React.FC<{ g: number }> = ({ g }) => {
  const t = g / 30;
  // afterwards (C2): both settle small under the type line, then sink as the plan card rises
  const m = sm(t, 49.3, 1.6), sink = sn(t, 52.1, 0.85);
  const mini = (cx: number, tx: number) => `translate(${((tx - cx) * m).toFixed(2)}px, ${((MINI_Y - 540) * m + sink * 170).toFixed(2)}px) scale(${(mix(1, MINI, m) * (1 - 0.1 * sink)).toFixed(4)})`;
  // the hosting card becomes the panel
  const cq = gl(t, 44.95, 1.15), toX = (960 - (PANEL.x + PANEL.w / 2)) * (1 - cq);
  const cardO = 1 - sn(t, 44.95, 0.6), panelO = sn(t, 45.15, 0.65);
  const sq = sm(t, 45.05, 1.3), scroll = mix(SCR_CARDS, SCR_HERO, sm(t, 47.2, 1.3));
  // the field
  const focus = aspring(g, 45.5, 0.4), txt = typed(g, 45.75, NEWTXT, 17), typing = t > 45.75 && t < 46.72;
  const done = aspring(g, 46.62, 0.45, 0.88) * (1 - sn(t, 46.68, 0.12)) + aspring(g, 47.25, 0.45, 0.88);
  // the site's price line
  const sw = aspring(g, 47.12, 0.55), hl = sn(t, 47.1, 0.35) * (1 - sn(t, 47.9, 0.9)), ring1 = aspring(g, 47.1, 0.6);
  // the photo: carried by the cursor from below, dropped on the panel
  const carry = gl(t, 46.45, 1.05), drop = aspring(g, 47.5, 0.45, 0.9), away = gl(t, 47.6, 1.0);
  const th = { x: mix(SRC2.x + 110, SRC2.x, carry), y: mix(1230, SRC2.y, carry) };
  const cur = { x: th.x + 50 + away * 70, y: th.y + 30 + away * 560 };
  const inPanel = t >= 47.95;
  const hero = gl(t, 48.35, 0.85), hhl = sn(t, 48.35, 0.35) * (1 - sn(t, 49.0, 0.6)), ring2 = aspring(g, 48.35, 0.6);
  const chip = aspring(g, 48.62, 0.5, 0.88);
  const caretOn = typing || Math.floor(g / 15) % 2 === 0;
  const thumb = (st: React.CSSProperties) => <div style={{ position: "absolute", width: THUMB.w, height: THUMB.h, borderRadius: 14, overflow: "hidden", boxShadow: `0 0 0 1px ${C.line}`, ...st }}>{photo("holm-stretch.jpg")}</div>;
  return (
    <Group s={push(t, 44.95, 53.0)}>
      {/* the hosting card, leaving into the panel */}
      {cardO > 0 && <div style={{ position: "absolute", left: 960 - CARD.w / 2, top: 540 - CARD.h / 2, width: CARD.w, height: CARD.h, opacity: cardO, transform: `translateX(${(-(960 - (PANEL.x + PANEL.w / 2)) * cq).toFixed(2)}px) scale(${(1.0355 * Math.pow(0.6 / 1.0355, cq)).toFixed(5)})` }}>
        <HostingCard g={g} rows={3} active={[1, 1, 1]} price={1} /></div>}
      {/* the panel */}
      <div style={{ position: "absolute", left: PANEL.x, top: PANEL.y, width: PANEL.w, height: PANEL.h, opacity: 1 - sink, transform: mini(PANEL.x + PANEL.w / 2, 960 - 271 + 96) }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: 28, background: C.white, boxShadow: `0 0 0 1px ${C.line}, ${SHADOW_BIG}`, fontFamily: SANS, color: C.ink, opacity: panelO, transform: `translateX(${toX.toFixed(2)}px) scale(${mix(1.35, 1, cq).toFixed(4)})` }}>
          <div style={{ position: "absolute", left: 34, top: 30, fontFamily: SERIF, fontSize: 46, letterSpacing: "-0.025em" }}>Dit panel</div>
          <div style={{ position: "absolute", right: 34, top: 52, display: "flex", alignItems: "center", gap: 9, fontSize: 20, color: C.muted }}><span style={{ width: 9, height: 9, borderRadius: 5, background: C.sage }} />holmfysio.dk</div>
          <div style={{ position: "absolute", left: 34, top: 112, fontSize: 20, color: C.muted }}>Skriv en ændring</div>
          <div style={{ position: "absolute", left: FIELD.x, top: FIELD.y, width: FIELD.w, height: FIELD.h, boxSizing: "border-box", borderRadius: 14, background: C.white, border: `1.5px solid color-mix(in srgb, #8FAFA6 ${focus * 100}%, #E1DDD6)`,
            boxShadow: `0 0 0 5px rgba(135,168,158,${(0.22 * focus).toFixed(3)})`, display: "flex", alignItems: "center", padding: "0 22px", fontSize: 34, fontWeight: 500, letterSpacing: "-0.01em", whiteSpace: "nowrap" }}>
            {txt && <span>{txt}</span>}
            {focus > 0.5 && t < 46.75 && <span style={{ width: 2.5, height: 40, marginLeft: 2, marginRight: 3, background: C.ink, opacity: caretOn ? 1 : 0 }} />}
            {!txt && <span style={{ color: "#A9A39B", fontWeight: 400 }}>fx nye priser</span>}
            <div style={{ flex: 1 }} />
            <CheckDot s={36} q={done} />
          </div>
          <div style={{ position: "absolute", left: 34, top: 256, fontSize: 20, color: C.muted }}>Billede</div>
          <div style={{ position: "absolute", left: ZONE.x, top: ZONE.y, width: ZONE.w, height: ZONE.h, boxSizing: "border-box", borderRadius: 16, border: `2px dashed color-mix(in srgb, ${C.sage} ${carry * 100}%, #D9D4CC)`,
            background: `rgba(231,239,236,${(0.7 * carry).toFixed(3)})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, color: C.muted }}>
            <span style={{ opacity: 1 - carry }}>Slip et billede her</span>
          </div>
          {inPanel && thumb({ left: ZONE.x + (ZONE.w - THUMB.w) / 2, top: ZONE.y + (ZONE.h - THUMB.h) / 2 })}
        </div>
      </div>
      {/* the live site */}
      <div style={{ position: "absolute", left: SITEP.x, top: SITEP.y, width: SITEP.w, height: SITEP.h, opacity: 1 - sink, transform: mini(SITEP.x + SITEP.w / 2, 960 + 271 - 160) }}>
        <div style={{ position: "absolute", inset: 0, ...arr(sq, 90, 0.9) }}>
          <div style={{ width: 1460, height: SITE_H, transform: `scale(${SITE_S})`, transformOrigin: "0 0" }}>
            <Browser w={1460} h={SITE_H} url="holmfysio.dk" live={1}>
              <HolmSite w={1460} h={SITE_H - 46} scroll={scroll} headline={NEW_HEADLINE} />
              <div style={{ position: "absolute", left: 0, top: 0, width: 1460, height: 1500, transform: `translateY(${(-scroll).toFixed(2)}px)`, fontFamily: SANS, color: HOLM.ink }}>
                {/* the new hero photo */}
                <div style={{ position: "absolute", left: 760, top: 120, width: 630, height: 560, borderRadius: 24, overflow: "hidden" }}>{hero > 0 && photo("holm-stretch.jpg", { transform: `translateY(${((1 - hero) * 100).toFixed(3)}%) scale(${(1.08 - 0.08 * hero).toFixed(4)})` })}</div>
                <div style={{ position: "absolute", left: 760, top: 120, width: 630, height: 560, borderRadius: 24, boxSizing: "border-box", border: `9px solid ${C.sage}`, opacity: hhl, transform: `scale(${mix(0.9, 1.035, ring2).toFixed(4)})` }} />
                {/* the Massage card carries the price */}
                <div style={{ position: "absolute", left: 520, top: 1030, width: 420, height: 130, background: "#fff", borderRadius: "0 0 22px 22px" }}>
                  <div style={{ position: "absolute", left: 12, top: 8, right: 12, bottom: 8, borderRadius: 14, background: C.sageTint, opacity: hl }} />
                  <div style={{ position: "absolute", left: 26, top: 18, fontSize: 24, fontWeight: 600 }}>Massage</div>
                  <div style={{ position: "absolute", left: 26, top: 52, width: 340, height: 56, overflow: "hidden", fontSize: 44, fontWeight: 600, letterSpacing: "-0.025em", color: HOLM.accent, lineHeight: "56px" }}>
                    <div style={{ position: "absolute", transform: `translateY(${(-sw * 56).toFixed(2)}px)`, opacity: 1 - clamp01(sw) }}>400 kr.</div>
                    <div style={{ position: "absolute", transform: `translateY(${((1 - sw) * 56).toFixed(2)}px)`, opacity: clamp01(sw) }}>450 kr.</div>
                  </div>
                </div>
                <div style={{ position: "absolute", left: 520, top: 760, width: 420, height: 400, borderRadius: 22, boxSizing: "border-box", border: `8px solid ${C.sage}`, opacity: hl, transform: `scale(${mix(0.9, 1.04, ring1).toFixed(4)})` }} />
              </div>
            </Browser>
          </div>
        </div>
        {/* "Opdateret" lands on the window's top edge */}
        <div style={{ position: "absolute", right: 40, top: -32, height: 64, padding: "0 28px 0 16px", borderRadius: 999, background: C.white, boxShadow: `0 0 0 1px ${C.line}, ${SHADOW}`, display: "flex", alignItems: "center", gap: 13,
          fontFamily: SANS, fontSize: 30, fontWeight: 500, color: C.sageDeep, ...arr(chip, 40, 0.85) }}><CheckDot s={38} q={aspring(g, 48.75, 0.45, 0.88)} />Opdateret</div>
      </div>
      {/* the couriers */}
      <Courier t={t} at={46.66} a={SRC1} b={DST1} />
      <Courier t={t} at={47.9} a={SRC2} b={DST2} />
      {/* the photo and the cursor that carries it */}
      {t > 46.45 && !inPanel && <div style={{ position: "absolute", left: th.x - THUMB.w / 2, top: th.y - THUMB.h / 2, width: THUMB.w, height: THUMB.h, transform: `scale(${(1.1 - 0.1 * drop).toFixed(4)})` }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: 14, boxShadow: SHADOW_BIG, opacity: 1 - clamp01(drop) }} />
        {thumb({ left: 0, top: 0 })}
      </div>}
      {t > 46.45 && away < 1 && <Cursor x={cur.x} y={cur.y} press={1 - clamp01(drop)} size={48} opacity={1 - sn(t, 48.2, 0.4)} />}
    </Group>
  );
};

/* ---------- C2: "Aldrig en linje kode." ---------- */
// The kit's Kinetic look (each word rises through its own mask, the line re-centres), with the slot opening ahead of
// the word so two arriving words never overlap, and a sine glide for the re-centring.
type LW = { t: string; at: number; dur: number; out: number; accent?: boolean };
const Line: React.FC<{ t: number; items: LW[]; size: number }> = ({ t, items, size }) => {
  const ready = useFonts();
  const sp = 0.27 * size, lh = size * 1.25, pad = size * 0.16;
  const st = items.map((it) => {
    const a = (t - it.at) / it.dur, o = t - it.out;
    return { it, w: measure(it.t, size, !!it.accent, true, 400, ready), vis: OUT(clamp01((a - 0.14) / 0.86)), gone: SINE(clamp01(o / 0.7)), slot: SINE(clamp01(a / 0.62)) };
  });
  let acc = 0, cum = 0;
  const lefts = st.map((x) => { const pre = sp * x.slot * Math.min(1, acc), l = cum + pre; cum += pre + x.slot * x.w; acc += x.slot; return l; });
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 0, height: 0 }}>
      {st.map((x, i) => (x.vis <= 0 || x.gone >= 1 ? null : (
        <div key={i} style={{ position: "absolute", left: 0, top: -lh / 2, width: x.w + 2 * pad, height: lh, overflow: "hidden", transform: `translateX(${(lefts[i] - cum / 2 - pad).toFixed(2)}px)` }}>
          <div style={{ position: "absolute", left: pad, top: 0, height: lh, display: "flex", alignItems: "center", transform: `translateY(${((1 - x.vis) * size * 0.9 - x.gone * size * 0.95).toFixed(2)}px)`,
            fontFamily: SERIF, fontWeight: 400, fontSize: size, lineHeight: `${lh}px`, letterSpacing: "-0.02em", whiteSpace: "nowrap", color: x.it.accent ? ACCENT : C.ink, fontStyle: x.it.accent ? "italic" : "normal" }}>{x.it.t}</div>
        </div>
      )))}
    </div>
  );
};
const C2: React.FC<{ g: number }> = ({ g }) => {
  const t = g / 30;
  // fully up 51.6 → 52.85: it reads at the centre, then glides up as a heading while the plan card rises, and leaves upward
  const up = sm(t, 52.1, 0.95), off = sn(t, 52.9, 0.55);
  return (
    <Group s={push(t, 50.0, 53.5, 0.94)}>
      <div style={{ position: "absolute", left: 960, top: 450, opacity: 1 - off, transform: `translateY(${(-285 * up - 70 * off).toFixed(2)}px) scale(${mix(1, 0.5, up).toFixed(4)})` }}>
        <Line t={t} size={TYPE.hero} items={[
          { t: "Aldrig", at: 50.2, dur: 0.8, out: 99 }, { t: "en", at: 50.58, dur: 0.8, out: 99 },
          { t: "linje", at: 50.8, dur: 0.85, out: 99 }, { t: "kode.", at: 51.0, dur: 0.95, accent: true, out: 99 },
        ]} />
      </div>
    </Group>
  );
};

/* ---------- C3: the plan card ---------- */
const PLAN = { x: 510, y: 270, w: 900, h: 540 };
const C3: React.FC<{ g: number }> = ({ g }) => {
  const t = g / 30;
  const q = gl(t, 52.35, 0.95), out = sn(t, 56.15, 0.95), gone = sn(t, 56.15, 0.62);
  const title = aspring(g, 52.55, 0.6), row = aspring(g, 52.66, 0.55), tick = aspring(g, 52.8, 0.45, 0.88), price = aspring(g, 53.4, 0.65);
  const yr = [53.92, 54.52, 55.02].map((a) => aspring(g, a, 0.65));
  const line = clamp01((t - 53.85) / 1.9), dot = sn(t, 55.2, 0.9);
  return (
    <Group s={push(t, 52.3, 57.1, 0.93) * 1.15}>
      <div style={{ position: "absolute", left: PLAN.x, top: PLAN.y, width: PLAN.w, height: PLAN.h, opacity: 1 - gone, transform: `translateY(${(-out * 300).toFixed(2)}px) scale(${(1 - 0.05 * out).toFixed(4)})` }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: 28, background: C.white, boxShadow: `0 0 0 1px ${C.line}, ${SHADOW_BIG}`, fontFamily: SANS, color: C.ink, ...arr(q, 120, 0.9) }}>
          <div style={{ position: "absolute", left: 52, top: 44, ...arr(title, 30, 0.96) }}>
            <div style={{ fontSize: 15, fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", color: C.muted }}>Hosting</div>
            <div style={{ marginTop: 6, fontFamily: SERIF, fontSize: 48, letterSpacing: "-0.025em", lineHeight: 1.1 }}>holmfysio.dk</div>
          </div>
          <div style={{ position: "absolute", right: 52, top: 54, fontFamily: SERIF, fontSize: 62, letterSpacing: "-0.025em", lineHeight: 1, whiteSpace: "nowrap", transformOrigin: "100% 50%", ...arr(price, 44, 0.9) }}>99 kr.<span style={{ fontSize: 32, color: C.muted }}> /md.</span></div>
          <div style={{ position: "absolute", left: 52, top: 152, width: 796, height: 1, background: C.line }} />
          <div style={{ position: "absolute", left: 52, top: 153, height: 84, display: "flex", alignItems: "center", gap: 16, fontSize: 30, fontWeight: 500, letterSpacing: "-0.01em", transformOrigin: "0 50%", ...arr(row, 36, 0.94) }}>
            <CheckDot s={40} q={tick} />Stop når som helst</div>
          <div style={{ position: "absolute", left: 52, top: 238, width: 796, height: 1, background: C.line }} />
          {/* the same price every year: three equal columns under one level line */}
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ position: "absolute", left: 52 + i * 272, top: 290, width: 252, height: 210 }}>
              <div style={{ position: "absolute", left: 0, top: 0, width: 252, height: 156, borderRadius: 16, background: C.sage, transformOrigin: "50% 100%", transform: `scaleY(${yr[i].toFixed(4)})`, opacity: clamp01(yr[i] * 2) }} />
              <div style={{ position: "absolute", left: 0, top: 0, width: 252, height: 156, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, fontWeight: 500, letterSpacing: "-0.015em", color: C.white, whiteSpace: "nowrap", ...arr(yr[i], 50, 0.9) }}>99 kr. /md.</div>
              <div style={{ position: "absolute", left: 0, top: 168, width: 252, textAlign: "center", fontSize: 23, color: C.muted, opacity: clamp01(yr[i] * 1.5) }}>År {i + 1}</div>
            </div>
          ))}
          <div style={{ position: "absolute", left: 52, top: 287, width: 796, height: 4, borderRadius: 2, background: C.sageDark, transformOrigin: "0 50%", transform: `scaleX(${line.toFixed(4)})` }} />
          {/* a dot runs the level line once: the same, year after year */}
          <div style={{ position: "absolute", left: 52 - 9, top: 289 - 9, width: 18, height: 18, borderRadius: 9, background: C.sageDark, opacity: Math.min(1, dot * 8, (1 - dot) * 8), transform: `translateX(${(796 * dot).toFixed(2)}px)` }} />
        </div>
      </div>
    </Group>
  );
};

/* ---------- C4: Danish support ---------- */
const CHAT = { x: 550, y: 240, w: 820, h: 600 };
const SEND = { x: CHAT.x + CHAT.w - 24 - 30, y: CHAT.y + CHAT.h - 24 - 30 };   // the send button's centre in the panel's layout
const REPLY = "Selvfølgelig. Jeg kigger på det nu.";
const T_SEND = 58.3, T_SINK = 58.95, KC = 1.2;                               // the chat shows at 1.2× (984 × 720)
const SEND_S = { x: 960 + (SEND.x - 960) * KC, y: 540 + (SEND.y - 540) * KC };
const C4: React.FC<{ g: number }> = ({ g }) => {
  const t = g / 30;
  const q = gl(t, 56.25, 1.0), sink = sn(t, T_SINK, 0.9), gone = sn(t, T_SINK, 0.55);
  const b1 = aspring(g, 56.7, 0.45), rep = aspring(g, 56.92, 0.5), flag = aspring(g, 57.62, 0.5, 0.88);
  const txt = typed(g, 57.0, REPLY, 46);
  const cur = cursorAt(g, [{ at: 57.45, x: SEND.x + 70, y: 1010 }, { at: 58.2, x: SEND.x + 4, y: SEND.y + 6 }, { at: 58.6, x: SEND.x + 4, y: SEND.y + 6 }, { at: 59.3, x: SEND.x + 40, y: 1010 }]);
  const bubble: React.CSSProperties = { padding: "17px 26px", fontSize: 28, lineHeight: 1.25, letterSpacing: "-0.01em", whiteSpace: "nowrap" };
  return (
    <Group s={push(t, 56.25, T_SEND, 0.94) * KC}>
      <div style={{ position: "absolute", left: CHAT.x, top: CHAT.y, width: CHAT.w, height: CHAT.h, opacity: 1 - gone, transform: `translateY(${(sink * 170).toFixed(2)}px) scale(${(1 - 0.08 * sink).toFixed(4)})` }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: 28, background: C.white, boxShadow: `0 0 0 1px ${C.line}, ${SHADOW_BIG}`, fontFamily: SANS, color: C.ink, ...arr(q, 200, 0.9) }}>
          <div style={{ position: "absolute", left: 0, top: 0, width: CHAT.w, height: 92, borderBottom: `1px solid ${C.line}`, boxSizing: "border-box" }}>
            <div style={{ position: "absolute", left: 32 + 24, top: 46 }}><Icon size={48} /></div>
            <div style={{ position: "absolute", left: 98, top: 28, fontSize: 28, fontWeight: 600, letterSpacing: "-0.015em" }}>Creoble Support</div>
          </div>
          {/* the customer */}
          <div style={{ position: "absolute", right: 32, top: 124, transformOrigin: "100% 100%", borderRadius: "24px 24px 8px 24px", background: "#F1EEE8", ...bubble, ...arr(b1, 50, 0.88) }}>Kan I hjælpe med min e-mail?</div>
          {/* Sofie */}
          <div style={{ position: "absolute", left: 32, top: 232, width: 700, height: 150, transformOrigin: "0 100%", ...arr(rep, 50, 0.9) }}>
            <div style={{ position: "absolute", left: 0, top: 4, width: 52, height: 52, borderRadius: 26, background: C.sage, color: C.white, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 25, fontWeight: 600 }}>S</div>
            <div style={{ position: "absolute", left: 68, top: 0, height: 36, display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ fontSize: 23, fontWeight: 600 }}>Sofie</span>
              <div style={{ height: 36, padding: "0 14px 0 10px", borderRadius: 999, background: C.sageTint, display: "flex", alignItems: "center", gap: 9, fontSize: 19, fontWeight: 500, color: C.sageDeep, transformOrigin: "0 50%", opacity: clamp01(flag * 1.6), transform: `translateY(${((1 - flag) * 16).toFixed(2)}px) scale(${mix(0.7, 1, flag).toFixed(4)})` }}>
                <svg width={26} height={19} viewBox="0 0 37 28" style={{ borderRadius: 3, display: "block" }}><rect width="37" height="28" fill="#C8102E" /><rect x="12" width="4" height="28" fill="#fff" /><rect y="12" width="37" height="4" fill="#fff" /></svg>
                Dansk support</div>
            </div>
            <div style={{ position: "absolute", left: 68, top: 48, borderRadius: "8px 24px 24px 24px", background: C.sageTint, ...bubble }}>
              <span style={{ visibility: "hidden" }}>{REPLY}</span>
              <span style={{ position: "absolute", left: 26, top: 17 }}>{txt}</span>
            </div>
          </div>
          {/* the message field; the send button is drawn by the outro once it is pressed */}
          <div style={{ position: "absolute", left: 32, bottom: 24, width: CHAT.w - 32 - 24 - 60 - 16, height: 60, boxSizing: "border-box", borderRadius: 14, border: "1.5px solid #E1DDD6", display: "flex", alignItems: "center", padding: "0 20px", fontSize: 22, color: "#A9A39B" }}>Skriv en besked…</div>
          {t < T_SEND && <div style={{ position: "absolute", right: 24, bottom: 24, width: 60, height: 60, borderRadius: 16, background: C.ink, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Ico n="arrow" s={28} c={C.white} w={2.4} style={{ transform: "rotate(-90deg)" }} /></div>}
        </div>
      </div>
      {t > 57.4 && t < 59.3 && <Cursor x={cur.x} y={cur.y} press={press(g, T_SEND)} size={38} />}
    </Group>
  );
};

/* ---------- C5: the outro ---------- */
// The pressed send button turns sage and contracts into a dot; the dot glides to the centre on a calm arc and is the
// logo's largest dot; the other five unfurl round the ring from it as it lands; the C moves left as the wordmark
// slides out; the button rises on "gratis"; the address types on "creoble.dk"; the final press turns the six dots
// once, slowly and evenly, as the loader did.
const LOGO_S = 200, LY = 420, WM_H = 112, GAP = 44;
const C_W = (78.81 - 17.06) * (LOGO_S / 100);                     // the C's visual width
const LOCK_W = C_W + GAP + WM_H * 4.77;
const C_X1 = 960 - LOCK_W / 2 + C_W / 2;                          // the C's visual centre in the lockup
const UNWRAP = ANG.map((a) => (a <= ANG[0] ? a : a - 2 * Math.PI));   // the ring, counter-clockwise from the largest dot
const ADDR = "creoble.dk";
const T_PRESS = 62.6;
const even = (x: number, r = 0.18) => { const v = 1 / (1 - r); return x <= 0 ? 0 : x >= 1 ? 1 : x < r ? (v * x * x) / (2 * r) : x < 1 - r ? v * (x - r / 2) : 1 - (v * (1 - x) * (1 - x)) / (2 * r); };
const C5: React.FC<{ g: number }> = ({ g }) => {
  const t = g / 30, s = LOGO_S / 100, R = RING.r * s;
  const P = 1 + 0.06 * clamp01((t - 58.6) / (65.2 - 58.6));
  const shift = gl(t, 59.3, 0.95), dx = (C_X1 - 960) * shift;
  const spin = 2 * Math.PI * even((t - (T_PRESS + 0.12)) / (65.12 - T_PRESS - 0.12));
  const ring0 = { x: 960 + (RING.x - BOX_C.x) * s, y: LY + (RING.y - BOX_C.y) * s };
  const D0 = { x: ring0.x + Math.cos(ANG[0]) * R, y: ring0.y + Math.sin(ANG[0]) * R };
  // the lead dot: press, sage, circle, flight (the ring travels with it)
  const pr = press(g, T_SEND), sage = sn(t, T_SEND + 0.02, 0.26), round = gl(t, T_SEND + 0.05, 0.32);
  const fl = gl(t, T_SEND + 0.26, 0.78), u = 1 - fl;
  const mx = (SEND_S.x + D0.x) / 2 + 0.776 * 110, my = (SEND_S.y + D0.y) / 2 - 0.631 * 110;
  const lead0 = { x: u * u * SEND_S.x + 2 * u * fl * mx + fl * fl * D0.x, y: u * u * SEND_S.y + 2 * u * fl * my + fl * fl * D0.y };
  const ring = { x: lead0.x - Math.cos(ANG[0]) * R + dx, y: lead0.y - Math.sin(ANG[0]) * R };
  const lead = { x: ring.x + Math.cos(ANG[0] + spin) * R, y: ring.y + Math.sin(ANG[0] + spin) * R };
  const leadScale = mix(KC, (LOGO[0].r * s * 2) / 60, round) * (1 - 0.06 * pr);
  const others = [1, 2, 3, 4, 5].map((i) => {
    const q = aspring(g, 58.96 + (i - 1) * 0.055, 0.45, 0.9), a = mix(ANG[0], UNWRAP[i], q) + spin;
    return { x: ring.x + Math.cos(a) * R, y: ring.y + Math.sin(a) * R, r: LOGO[i].r * s * clamp01(q * 1.4) };
  });
  const wm = gl(t, 59.34, 0.95), wmask = `linear-gradient(90deg, #000 ${(wm * 116 - 10).toFixed(2)}%, transparent ${(wm * 116).toFixed(2)}%)`, wx = (960 - C_X1) * (1 - shift);
  const btn = aspring(g, 59.84, 0.6), bp = press(g, T_PRESS, 0.16);
  const adr = typed(g, 60.9, ADDR, 12), caret = t > 60.8 && (t < 61.8 || Math.floor((t - 61.8) * 2) % 2 === 0);
  const cur = cursorAt(g, [{ at: 61.55, x: 1100, y: 1150 }, { at: 62.48, x: 1046, y: 622 }]);
  return (
    <Group s={P}>
      <Dots dots={others} />
      <div style={{ position: "absolute", left: 960 - LOCK_W / 2 + C_W + GAP, top: LY - WM_H / 2, transform: `translateX(${wx.toFixed(2)}px)`, WebkitMaskImage: wm < 1 ? wmask : undefined, maskImage: wm < 1 ? wmask : undefined }}><Wordmark h={WM_H} /></div>
      {/* the send button → the dot */}
      <div style={{ position: "absolute", left: lead.x - 30, top: lead.y - 30, width: 60, height: 60, borderRadius: mix(16, 30, round), background: `color-mix(in srgb, ${C.sage} ${(sage * 100).toFixed(1)}%, ${C.ink})`,
        transform: `scale(${leadScale.toFixed(4)})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {round < 1 && <Ico n="arrow" s={28} c={C.white} w={2.4} style={{ transform: "rotate(-90deg)", opacity: 1 - round }} />}
      </div>
      {/* the button */}
      <div style={{ position: "absolute", left: 960 - 230, top: 566, width: 460, height: 88, ...arr(btn, 70, 0.9) }}>
        <div style={{ width: 460, height: 88, borderRadius: 12, background: C.ink, color: C.btnText, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontWeight: 500, fontSize: 34, letterSpacing: "-0.01em", whiteSpace: "nowrap",
          transform: `scale(${(1 - 0.05 * bp).toFixed(4)})` }}>Byg din side gratis</div>
      </div>
      {/* the address */}
      <div style={{ position: "absolute", left: 0, top: 700, width: 1920, display: "flex", justifyContent: "center", fontFamily: SANS, fontSize: 32, color: C.ink, letterSpacing: "-0.005em", whiteSpace: "nowrap" }}>
        <div style={{ position: "relative" }}>
          <span style={{ visibility: "hidden" }}>{ADDR}</span>
          <span style={{ position: "absolute", left: 0, top: 0, display: "flex", alignItems: "center" }}>{adr}<span style={{ width: 2, height: 34, marginLeft: 3, background: C.ink, opacity: caret ? 1 : 0, flex: "none" }} /></span>
        </div>
      </div>
      {t > 61.5 && <Cursor x={cur.x} y={cur.y} press={bp} size={44} />}
    </Group>
  );
};

export const SceneC: React.FC<{ g: number }> = ({ g }) => {
  if (g <= f("h2") + 9) return <Handoff2 g={g} />;
  const t = g / 30;
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      {t < 53.0 && <C1 g={g} />}
      {t > 50.0 && t < 53.5 && <C2 g={g} />}
      {t > 52.3 && t < 57.15 && <C3 g={g} />}
      {t > 56.2 && t < 59.9 && <C4 g={g} />}
      {t >= T_SEND && <C5 g={g} />}
    </AbsoluteFill>
  );
};
