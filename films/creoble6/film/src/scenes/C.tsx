// Scene C (h2 44.65 s → end 65.2 s): the panel that updates the live site, "Aldrig en linje kode.", the plan card,
// Danish support, and the outro (send button → dot → the C → the lockup, the button, the address).
// Object-led: every beat is a fixed 2D frame in a slow steady push (0.97 → 1, so everything ends inside SAFE); the
// things in it arrive from below, leave upward or sink back, and grow out of what caused them. No camera moves.
import React from "react";
import { AbsoluteFill, Easing, Img, staticFile } from "remotion";
import { C, HOLM, OUT, SANS, SERIF, SHADOW, SHADOW_BIG, clamp01, mix } from "../lib";
import { aspring, press, typed, Ico, Wordmark, HolmSite, Browser } from "../shared";
import { ACCENT, TYPE, measure, useFonts } from "../type";
import { Spinner, Dots, Icon, ANG, RING, LOGO, BOX_C } from "../dots";
import { HostingCard, CARD, Cursor, cursorAt, Handoff2, NEW_HEADLINE } from "../ui";
import { f } from "../shared";

export const BLUR: [number, number][] = [];

export const EVENTS: { t: number; kind: "click" | "type" | "check" | "pop" | "open" | "send" | "logo"; len?: number; note: string }[] = [
  { t: 45.0, kind: "open", note: "hosting card shrinks left; panel and live site rise" },
  { t: 45.75, kind: "type", len: 0.95, note: "panel field: Massage: 450 kr." },
  { t: 46.95, kind: "pop", note: "site: Massage price swaps to 450 kr." },
  { t: 47.5, kind: "click", note: "photo dropped on the panel" },
  { t: 47.9, kind: "pop", note: "site: hero photo cross-fades" },
  { t: 48.35, kind: "check", note: "Opdateret chip lands on the site window" },
  { t: 49.6, kind: "open", note: "panel and site sink away; type line begins" },
  { t: 53.4, kind: "open", note: "plan card rises" },
  { t: 53.95, kind: "check", note: "row: Stop når som helst" },
  { t: 54.35, kind: "pop", note: "År 1" },
  { t: 54.85, kind: "pop", note: "År 2" },
  { t: 55.4, kind: "pop", note: "År 3" },
  { t: 56.6, kind: "open", note: "plan card leaves upward; chat panel rises" },
  { t: 57.2, kind: "send", note: "customer bubble: Kan I hjælpe med min e-mail?" },
  { t: 57.4, kind: "type", len: 0.85, note: "Sofie's reply types" },
  { t: 57.9, kind: "pop", note: "chip: Dansk support" },
  { t: 58.65, kind: "click", note: "send button pressed; turns sage" },
  { t: 59.0, kind: "send", note: "the dot leaves the panel and glides to the centre" },
  { t: 59.9, kind: "logo", len: 0.6, note: "the six dots unfurl into the C" },
  { t: 60.4, kind: "open", note: "wordmark slides out beside the C" },
  { t: 61.0, kind: "pop", note: "button: Byg din side gratis" },
  { t: 61.3, kind: "type", len: 0.7, note: "creoble.dk types" },
  { t: 63.3, kind: "click", note: "the button is pressed" },
];

/* ---------- motion helpers (seconds) ---------- */
const GL = Easing.bezier(0.42, 0, 0.22, 1);            // a glide: soft start, long landing (big surfaces: 1 s or more)
const SINE = (x: number) => 0.5 - 0.5 * Math.cos(Math.PI * x);
const gl = (t: number, at: number, dur: number) => GL(clamp01((t - at) / dur));
const sn = (t: number, at: number, dur: number) => SINE(clamp01((t - at) / dur));
const push = (t: number, a: number, b: number, from = 0.96, to = 1) => from + (to - from) * clamp01((t - a) / (b - a));
const arr = (q: number, rise = 30, from = 0.95): React.CSSProperties => ({ opacity: SINE(clamp01(q * 1.25)), transform: `translateY(${((1 - q) * rise).toFixed(2)}px) scale(${mix(from, 1, q).toFixed(4)})` });
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
const SITE_S = 900 / 1460, SITE_H = 46 + 1150, SCROLL = 20;
const PANEL = { x: 380, y: 320, w: 460, h: 440 }, SITEP = { x: 876, y: 171, w: 900, h: SITE_H * SITE_S };
const ZONE = { x: 30, y: 232, w: 400, h: 170 };
const NEWTXT = "Massage: 450 kr.";
const C1: React.FC<{ g: number }> = ({ g }) => {
  const t = g / 30;
  const out = (i: number) => sn(t, 49.5 + i * 0.08, 0.85);
  const fade = (i: number) => 1 - sn(t, 49.5 + i * 0.08, 0.6);
  const leave = (i: number) => `translateY(${(out(i) * 90).toFixed(2)}px) scale(${(1 - 0.07 * out(i)).toFixed(4)})`;
  // the hosting card: from the hand-off pose to a small card at the left edge of SAFE
  const cq = gl(t, 44.95, 1.3);
  const cs = 1.0248 * Math.pow(0.2 / 1.0248, cq), cx = mix(960, 244, cq);
  const pq = gl(t, 45.0, 1.05), sq = gl(t, 45.1, 1.2);
  // the field
  const focus = aspring(g, 45.5, 0.4), txt = typed(g, 45.75, NEWTXT, 17), typing = t > 45.75 && t < 46.72;
  const busy = sn(t, 46.6, 0.2) * (1 - sn(t, 46.95, 0.25)), done = aspring(g, 47.05, 0.45, 0.88);
  // the site's price line
  const sw = aspring(g, 46.85, 0.55), hl = sn(t, 46.75, 0.4) * (1 - sn(t, 47.8, 0.9));
  // the photo: carried by the cursor from below, dropped on the panel
  const carry = gl(t, 46.4, 1.1), drop = aspring(g, 47.5, 0.45, 0.9), away = gl(t, 47.62, 0.9);
  const zc = { x: PANEL.x + ZONE.x + ZONE.w / 2, y: PANEL.y + ZONE.y + ZONE.h / 2 };
  const th = { x: mix(zc.x + 70, zc.x, carry), y: mix(1190, zc.y, carry) };
  const cur = { x: th.x + 36 + away * 60, y: th.y + 22 + away * 520 };
  const hero = sn(t, 47.6, 0.95), hhl = sn(t, 47.55, 0.4) * (1 - sn(t, 48.3, 0.8));
  const chip = aspring(g, 48.1, 0.5, 0.88);
  const caretOn = typing || Math.floor(g / 15) % 2 === 0;
  return (
    <Group s={push(t, 44.95, 50.6)}>
      {/* the small hosting card */}
      <div style={{ position: "absolute", left: cx - CARD.w / 2, top: 540 - CARD.h / 2, width: CARD.w, height: CARD.h, opacity: fade(0), transform: leave(0) }}>
        <div style={{ width: CARD.w, height: CARD.h, transform: `scale(${cs.toFixed(5)})` }}><HostingCard g={g} rows={3} active={[1, 1, 1]} price={1} /></div>
      </div>
      {/* the panel */}
      <div style={{ position: "absolute", left: PANEL.x, top: PANEL.y, width: PANEL.w, height: PANEL.h, opacity: fade(1), transform: leave(1) }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: 24, background: C.white, boxShadow: `0 0 0 1px ${C.line}, ${SHADOW_BIG}`, fontFamily: SANS, color: C.ink, ...arr(pq, 70, 0.94) }}>
          <div style={{ position: "absolute", left: 30, top: 26, fontFamily: SERIF, fontSize: 38, letterSpacing: "-0.025em" }}>Dit panel</div>
          <div style={{ position: "absolute", right: 30, top: 42, display: "flex", alignItems: "center", gap: 8, fontSize: 17, color: C.muted }}><span style={{ width: 8, height: 8, borderRadius: 4, background: C.sage }} />holmfysio.dk</div>
          <div style={{ position: "absolute", left: 30, top: 100, fontSize: 17, color: C.muted }}>Skriv en ændring</div>
          <div style={{ position: "absolute", left: 30, top: 132, width: 400, height: 68, boxSizing: "border-box", borderRadius: 12, background: C.white, border: `1.5px solid color-mix(in srgb, #8FAFA6 ${focus * 100}%, #E1DDD6)`,
            boxShadow: `0 0 0 4px rgba(135,168,158,${(0.22 * focus).toFixed(3)})`, display: "flex", alignItems: "center", padding: "0 18px", fontSize: 28, fontWeight: 500, letterSpacing: "-0.01em", whiteSpace: "nowrap" }}>
            {txt && <span>{txt}</span>}
            {focus > 0.5 && t < 47.0 && <span style={{ width: 2, height: 32, marginLeft: 2, marginRight: 2, background: C.ink, opacity: caretOn ? 1 : 0 }} />}
            {!txt && <span style={{ color: "#A9A39B", fontWeight: 400 }}>fx nye priser</span>}
            <div style={{ flex: 1 }} />
            <div style={{ position: "relative", width: 30, height: 30 }}>
              <div style={{ position: "absolute", left: 15, top: 15, opacity: busy }}><Spinner g={g} size={30} /></div>
              <div style={{ position: "absolute", left: 0, top: 0 }}><CheckDot s={30} q={done} /></div>
            </div>
          </div>
          <div style={{ position: "absolute", left: ZONE.x, top: ZONE.y, width: ZONE.w, height: ZONE.h, boxSizing: "border-box", borderRadius: 14, border: `2px dashed color-mix(in srgb, ${C.sage} ${carry * 100}%, #D9D4CC)`,
            background: `rgba(231,239,236,${(0.7 * carry).toFixed(3)})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, color: C.muted }}>
            <span style={{ opacity: 1 - carry }}>Slip et billede her</span>
          </div>
        </div>
      </div>
      {/* the live site */}
      <div style={{ position: "absolute", left: SITEP.x, top: SITEP.y, width: SITEP.w, height: SITEP.h, opacity: fade(2), transform: leave(2) }}>
        <div style={{ position: "absolute", inset: 0, ...arr(sq, 90, 0.94) }}>
          <div style={{ width: 1460, height: SITE_H, transform: `scale(${SITE_S})`, transformOrigin: "0 0" }}>
            <Browser w={1460} h={SITE_H} url="holmfysio.dk" live={1}>
              <HolmSite w={1460} h={1150} scroll={SCROLL} headline={NEW_HEADLINE} />
              <div style={{ position: "absolute", left: 0, top: -SCROLL, width: 1460, height: 1500, fontFamily: SANS, color: HOLM.ink }}>
                {/* the new hero photo */}
                <div style={{ position: "absolute", left: 760, top: 120, width: 630, height: 560, borderRadius: 24, overflow: "hidden", opacity: hero }}>{photo("holm-stretch.jpg", { transform: `scale(${(1.06 - 0.06 * hero).toFixed(4)})` })}</div>
                <div style={{ position: "absolute", left: 752, top: 112, width: 646, height: 576, borderRadius: 32, boxSizing: "border-box", border: `8px solid ${C.sage}`, opacity: hhl }} />
                {/* the service cards carry a price line */}
                {[["Fysioterapi", "550 kr."], ["Massage", "400 kr."], ["Genoptræning", "500 kr."]].map(([n, p], i) => (
                  <div key={n} style={{ position: "absolute", left: 70 + i * 450, top: 1030, width: 420, height: 130, background: "#fff", borderRadius: "0 0 22px 22px" }}>
                    {i === 1 && <div style={{ position: "absolute", left: 12, top: 10, right: 12, bottom: 10, borderRadius: 14, background: C.sageTint, opacity: hl }} />}
                    <div style={{ position: "absolute", left: 26, top: 20, fontSize: 24, fontWeight: 600 }}>{n}</div>
                    <div style={{ position: "absolute", left: 26, top: 58, width: 300, height: 46, overflow: "hidden", fontSize: 34, fontWeight: 600, letterSpacing: "-0.02em", color: HOLM.accent, lineHeight: "46px" }}>
                      {i === 1 ? <>
                        <div style={{ position: "absolute", transform: `translateY(${(-sw * 46).toFixed(2)}px)`, opacity: 1 - clamp01(sw) }}>{p}</div>
                        <div style={{ position: "absolute", transform: `translateY(${((1 - sw) * 46).toFixed(2)}px)`, opacity: clamp01(sw) }}>450 kr.</div>
                      </> : p}
                    </div>
                  </div>
                ))}
                <div style={{ position: "absolute", left: 512, top: 752, width: 436, height: 416, borderRadius: 28, boxSizing: "border-box", border: `7px solid ${C.sage}`, opacity: hl }} />
              </div>
            </Browser>
          </div>
        </div>
        {/* "Opdateret" lands on the window's top edge */}
        <div style={{ position: "absolute", right: 36, top: -29, height: 58, padding: "0 24px 0 14px", borderRadius: 999, background: C.white, boxShadow: `0 0 0 1px ${C.line}, ${SHADOW}`, display: "flex", alignItems: "center", gap: 12,
          fontFamily: SANS, fontSize: 27, fontWeight: 500, color: C.sageDeep, ...arr(chip, 26, 0.9) }}><CheckDot s={34} q={aspring(g, 48.22, 0.45, 0.88)} />Opdateret</div>
      </div>
      {/* the photo and the cursor that carries it */}
      {t > 46.4 && <div style={{ position: "absolute", left: th.x - 84, top: th.y - 60, width: 168, height: 120, opacity: fade(1), transform: `${leave(1)} scale(${(1.1 - 0.1 * drop).toFixed(4)})` }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: 12, boxShadow: SHADOW_BIG, opacity: 1 - clamp01(drop) }} />
        <div style={{ position: "absolute", inset: 0, borderRadius: 12, overflow: "hidden", boxShadow: `0 0 0 1px ${C.line}` }}>{photo("holm-stretch.jpg")}</div>
      </div>}
      {t > 46.4 && away < 1 && <Cursor x={cur.x} y={cur.y} press={1 - clamp01(drop)} size={44} opacity={1 - sn(t, 48.1, 0.4)} />}
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
  const t = g / 30, o = 52.72;
  return (
    <Group s={push(t, 50.0, 53.5, 0.95)}>
      <div style={{ position: "absolute", left: 960, top: 540 }}>
        <Line t={t} size={TYPE.hero} items={[
          { t: "Aldrig", at: 50.12, dur: 0.85, out: o }, { t: "en", at: 50.62, dur: 0.8, out: o + 0.03 },
          { t: "linje", at: 50.86, dur: 0.85, out: o + 0.06 }, { t: "kode.", at: 51.1, dur: 0.95, accent: true, out: o + 0.09 },
        ]} />
      </div>
    </Group>
  );
};

/* ---------- C3: the plan card ---------- */
const PLAN = { x: 510, y: 280, w: 900, h: 520 };
const C3: React.FC<{ g: number }> = ({ g }) => {
  const t = g / 30;
  const q = gl(t, 53.3, 0.95), out = sn(t, 56.3, 1.0), gone = sn(t, 56.3, 0.62);
  const row = aspring(g, 53.72, 0.55), tick = aspring(g, 53.84, 0.45, 0.88);
  const yr = [54.08, 54.6, 55.08].map((a) => aspring(g, a, 0.6));
  const line = (yr[0] + yr[1] + yr[2]) / 3;
  return (
    <Group s={push(t, 52.8, 57.3) * 1.15}>
      <div style={{ position: "absolute", left: PLAN.x, top: PLAN.y, width: PLAN.w, height: PLAN.h, opacity: 1 - gone, transform: `translateY(${(-out * 300).toFixed(2)}px) scale(${(1 - 0.04 * out).toFixed(4)})` }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: 28, background: C.white, boxShadow: `0 0 0 1px ${C.line}, ${SHADOW_BIG}`, fontFamily: SANS, color: C.ink, ...arr(q, 110, 0.95) }}>
          <div style={{ position: "absolute", left: 52, top: 44, fontSize: 15, fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", color: C.muted }}>Hosting</div>
          <div style={{ position: "absolute", left: 52, top: 70, fontFamily: SERIF, fontSize: 48, letterSpacing: "-0.025em", lineHeight: 1.1 }}>holmfysio.dk</div>
          <div style={{ position: "absolute", right: 52, top: 54, fontFamily: SERIF, fontSize: 62, letterSpacing: "-0.025em", lineHeight: 1, whiteSpace: "nowrap" }}>99 kr.<span style={{ fontSize: 32, color: C.muted }}> /md.</span></div>
          <div style={{ position: "absolute", left: 52, top: 152, width: 796, height: 1, background: C.line }} />
          <div style={{ position: "absolute", left: 52, top: 153, height: 84, display: "flex", alignItems: "center", gap: 16, fontSize: 29, fontWeight: 500, letterSpacing: "-0.01em", ...arr(row, 20, 0.98) }}>
            <CheckDot s={38} q={tick} />Stop når som helst</div>
          <div style={{ position: "absolute", left: 52, top: 238, width: 796, height: 1, background: C.line }} />
          {/* the same price every year: three equal columns under one level line */}
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ position: "absolute", left: 52 + i * 272, top: 286, width: 252, height: 190 }}>
              <div style={{ position: "absolute", left: 0, top: 0, width: 252, height: 132, borderRadius: 14, background: C.sageTint, transformOrigin: "50% 100%", transform: `scaleY(${yr[i].toFixed(4)})`, opacity: clamp01(yr[i] * 2) }} />
              <div style={{ position: "absolute", left: 0, top: 0, width: 252, height: 132, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, fontWeight: 500, letterSpacing: "-0.01em", color: C.sageDeep, whiteSpace: "nowrap", ...arr(yr[i], 18, 0.97) }}>99 kr. /md.</div>
              <div style={{ position: "absolute", left: 0, top: 146, width: 252, textAlign: "center", fontSize: 22, color: C.muted, opacity: clamp01(yr[i] * 1.5) }}>År {i + 1}</div>
            </div>
          ))}
          <div style={{ position: "absolute", left: 52, top: 284, width: 796, height: 3, borderRadius: 2, background: C.sage, transformOrigin: "0 50%", transform: `scaleX(${line.toFixed(4)})` }} />
        </div>
      </div>
    </Group>
  );
};

/* ---------- C4: Danish support ---------- */
const CHAT = { x: 550, y: 240, w: 820, h: 600 };
const SEND = { x: CHAT.x + CHAT.w - 24 - 30, y: CHAT.y + CHAT.h - 24 - 30 };   // the send button's centre on screen (1316, 786)
const REPLY = "Selvfølgelig. Jeg kigger på det nu.";
const T_SEND = 58.65, T_SINK = 58.95, KC = 1.2;                              // the chat shows at 1.2× (984 × 720)
const SEND_S = { x: 960 + (SEND.x - 960) * KC, y: 540 + (SEND.y - 540) * KC };
const C4: React.FC<{ g: number }> = ({ g }) => {
  const t = g / 30;
  const q = gl(t, 56.7, 0.95), sink = sn(t, T_SINK, 1.0);
  const b1 = aspring(g, 57.08, 0.5), rep = aspring(g, 57.25, 0.5), flag = aspring(g, 57.68, 0.5, 0.88);
  const txt = typed(g, 57.4, REPLY, 42);
  const cur = cursorAt(g, [{ at: 57.75, x: SEND.x + 70, y: 1150 }, { at: 58.52, x: SEND.x + 4, y: SEND.y + 6 }, { at: 58.95, x: SEND.x + 4, y: SEND.y + 6 }, { at: 59.75, x: SEND.x + 40, y: 1150 }]);
  const bubble: React.CSSProperties = { padding: "17px 26px", fontSize: 28, lineHeight: 1.25, letterSpacing: "-0.01em", whiteSpace: "nowrap" };
  return (
    <Group s={push(t, 56.45, T_SEND) * KC}>
      <div style={{ position: "absolute", left: CHAT.x, top: CHAT.y, width: CHAT.w, height: CHAT.h, opacity: 1 - sink, transform: `translateY(${(sink * 200).toFixed(2)}px) scale(${(1 - 0.05 * sink).toFixed(4)})` }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: 28, background: C.white, boxShadow: `0 0 0 1px ${C.line}, ${SHADOW_BIG}`, fontFamily: SANS, color: C.ink, ...arr(q, 230, 0.95) }}>
          <div style={{ position: "absolute", left: 0, top: 0, width: CHAT.w, height: 92, borderBottom: `1px solid ${C.line}`, boxSizing: "border-box" }}>
            <div style={{ position: "absolute", left: 32 + 24, top: 46 }}><Icon size={48} /></div>
            <div style={{ position: "absolute", left: 98, top: 28, fontSize: 28, fontWeight: 600, letterSpacing: "-0.015em" }}>Creoble Support</div>
          </div>
          {/* the customer */}
          <div style={{ position: "absolute", right: 32, top: 124, transformOrigin: "100% 100%", borderRadius: "24px 24px 8px 24px", background: "#F1EEE8", ...bubble, ...arr(b1, 26, 0.94) }}>Kan I hjælpe med min e-mail?</div>
          {/* Sofie */}
          <div style={{ position: "absolute", left: 32, top: 232, width: 700, height: 150, transformOrigin: "0 100%", ...arr(rep, 26, 0.95) }}>
            <div style={{ position: "absolute", left: 0, top: 4, width: 52, height: 52, borderRadius: 26, background: C.sage, color: C.white, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 25, fontWeight: 600 }}>S</div>
            <div style={{ position: "absolute", left: 68, top: 0, height: 36, display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ fontSize: 23, fontWeight: 600 }}>Sofie</span>
              <div style={{ height: 36, padding: "0 14px 0 10px", borderRadius: 999, background: C.sageTint, display: "flex", alignItems: "center", gap: 9, fontSize: 19, fontWeight: 500, color: C.sageDeep, transformOrigin: "0 50%", opacity: clamp01(flag * 1.6), transform: `scale(${mix(0.8, 1, flag).toFixed(4)})` }}>
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
      {t > 57.7 && t < 59.75 && <Cursor x={cur.x} y={cur.y} press={press(g, T_SEND)} size={38} />}
    </Group>
  );
};

/* ---------- C5: the outro ---------- */
// The pressed send button turns sage and contracts into a dot; the dot glides to the centre on a calm arc and is the
// logo's largest dot; the other five unfurl round the ring from it; the C moves left as the wordmark slides out; the
// button rises under the lockup; the address types.
const LOGO_S = 200, LY = 420, WM_H = 112, GAP = 44;
const C_W = (78.81 - 17.06) * (LOGO_S / 100);                     // the C's visual width
const LOCK_W = C_W + GAP + WM_H * 4.77;
const C_X1 = 960 - LOCK_W / 2 + C_W / 2;                          // the C's visual centre in the lockup
const UNWRAP = ANG.map((a) => (a <= ANG[0] ? a : a - 2 * Math.PI));   // the ring, counter-clockwise from the largest dot
const ADDR = "creoble.dk";
const C5: React.FC<{ g: number }> = ({ g }) => {
  const t = g / 30, s = LOGO_S / 100;
  const P = 1 + 0.04 * clamp01((t - T_SINK) / (65.2 - T_SINK));
  const shift = gl(t, 60.3, 1.05), dx = (C_X1 - 960) * shift;
  const ring = { x: 960 + (RING.x - BOX_C.x) * s, y: LY + (RING.y - BOX_C.y) * s };
  const D0 = { x: ring.x + Math.cos(ANG[0]) * RING.r * s, y: ring.y + Math.sin(ANG[0]) * RING.r * s };
  // the final press answers in the dots: one soft wave round the ring
  const wave = (i: number) => 1 + 0.14 * Math.sin(Math.PI * clamp01((t - 63.42 - i * 0.11) / 0.7)) ** 2;
  // the lead dot: press, sage, circle, flight
  const pr = press(g, T_SEND), sage = sn(t, T_SEND + 0.02, 0.28), round = gl(t, T_SEND + 0.06, 0.34);
  const fl = gl(t, T_SINK + 0.02, 1.05), u = 1 - fl;
  const mx = (SEND_S.x + D0.x) / 2 + 0.776 * 120, my = (SEND_S.y + D0.y) / 2 - 0.631 * 120;
  const lead = { x: u * u * SEND_S.x + 2 * u * fl * mx + fl * fl * D0.x + dx, y: u * u * SEND_S.y + 2 * u * fl * my + fl * fl * D0.y };
  const leadScale = mix(KC, (LOGO[0].r * s * 2) / 60, round) * (1 - 0.06 * pr) * wave(0);
  const others = [1, 2, 3, 4, 5].map((i) => {
    const q = aspring(g, 59.82 + (i - 1) * 0.08, 0.6, 0.9), a = mix(ANG[0], UNWRAP[i], q);
    return { x: ring.x + dx + Math.cos(a) * RING.r * s, y: ring.y + Math.sin(a) * RING.r * s, r: LOGO[i].r * s * clamp01(q * 1.4) * wave(i) };
  });
  const wm = sn(t, 60.35, 1.25), wmask = `linear-gradient(90deg, #000 ${(wm * 116 - 10).toFixed(2)}%, transparent ${(wm * 116).toFixed(2)}%)`, wx = (960 - C_X1) * (1 - shift);
  const btn = aspring(g, 60.85, 0.65), bp = press(g, 63.3);
  const adr = typed(g, 61.3, ADDR, 14), caret = t > 61.2 && t < 64.3 && (t < 62.05 || Math.floor((t - 62.05) * 2) % 2 === 0);
  const cur = cursorAt(g, [{ at: 62.0, x: 1090, y: 1150 }, { at: 63.1, x: 1046, y: 622 }]);
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
      <div style={{ position: "absolute", left: 960 - 230, top: 566, width: 460, height: 88, ...arr(btn, 36, 0.95) }}>
        <div style={{ width: 460, height: 88, borderRadius: 12, background: C.ink, color: C.btnText, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontWeight: 500, fontSize: 34, letterSpacing: "-0.01em", whiteSpace: "nowrap",
          transform: `scale(${(1 - 0.04 * bp).toFixed(4)})` }}>Byg din side gratis</div>
      </div>
      {/* the address */}
      <div style={{ position: "absolute", left: 0, top: 700, width: 1920, display: "flex", justifyContent: "center", fontFamily: SANS, fontSize: 32, color: C.ink, letterSpacing: "-0.005em", whiteSpace: "nowrap" }}>
        <div style={{ position: "relative" }}>
          <span style={{ visibility: "hidden" }}>{ADDR}</span>
          <span style={{ position: "absolute", left: 0, top: 0, display: "flex", alignItems: "center" }}>{adr}<span style={{ width: 2, height: 34, marginLeft: 3, background: C.ink, opacity: caret ? 1 : 0, flex: "none" }} /></span>
        </div>
      </div>
      {t > 61.95 && <Cursor x={cur.x} y={cur.y} press={bp} size={44} />}
    </Group>
  );
};

export const SceneC: React.FC<{ g: number }> = ({ g }) => {
  if (g <= f("h2") + 9) return <Handoff2 g={g} />;
  const t = g / 30;
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      {t < 50.8 && <C1 g={g} />}
      {t > 50.0 && t < 53.7 && <C2 g={g} />}
      {t > 53.25 && t < 57.35 && <C3 g={g} />}
      {t > 56.45 && t < 60.0 && <C4 g={g} />}
      {t >= T_SEND && <C5 g={g} />}
    </AbsoluteFill>
  );
};
