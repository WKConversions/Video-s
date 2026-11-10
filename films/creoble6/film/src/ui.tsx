// v6's product pieces, drawn exactly once here so every builder shows the same UI: Creoble's new wizard (from
// Willads' screenshot, Nov 2026), the example site in its browser, the hosting card, the cursor, and the two hand-off
// states. Calm, light, magazine-like: white fields, hairline borders, Fraunces headlines, one black button.
import React from "react";
import { C, SANS, SERIF, SHADOW, SHADOW_BIG, OUT, INOUT, clamp01, mix } from "./lib";
import { Browser, BAR, HolmSite, Wordmark, Ico, f } from "./shared";
import { Spinner } from "./dots";
import { Stage3D, Plane, cam, PERSP } from "./cam";

/* ---------- the wizard (creoble.dk/builder, step 1) ---------- */
// The page is 1600 × 800 (the screenshot's proportions); in the film it sits in a Browser window (WIZ_WIN, the bar
// adds 46 px on top: page y = window y − 46). WIZ_R holds the page rects (page px) for framing the camera.
export const WIZ = { w: 1600, h: 800 };
export const WIZ_WIN = { w: 1600, h: 800 + BAR };
export const WIZ_R = {
  header: { x: 0, y: 0, w: 1600, h: 73 }, progress: { x: 560, y: 90, w: 480, h: 32 }, headline: { x: 560, y: 150, w: 480, h: 44 },
  sub: { x: 560, y: 198, w: 480, h: 20 }, name: { x: 560, y: 266, w: 480, h: 42 }, branche: { x: 560, y: 352, w: 480, h: 42 },
  email: { x: 560, y: 458, w: 236, h: 42 }, phone: { x: 804, y: 458, w: 236, h: 42 }, note: { x: 560, y: 532, w: 480, h: 36 },
  consent: { x: 560, y: 614, w: 480, h: 36 }, button: { x: 946, y: 703, w: 94, h: 42 }, chat: { x: 1523, y: 735, w: 46, h: 46 },
};
type Field = "name" | "branche" | "email" | "phone" | null;
// name / email / phone = typed text ("" shows the placeholder); branche = chosen value ("" = "Vælg branche");
// focus = the field with the focus ring; caret shows a blinking caret after the focused field's text (g drives
// the blink: on 0.5 s, off 0.5 s; hide it while typing by passing caretSolid); consent 0..1 ticks the box; hover /
// press 0..1 on "Fortsæt" (hideButton leaves it out, when a scene lifts a copy of it off the page); seg = progress segments filled (1 at step 1, fractional while it fills).
export const Wizard: React.FC<{ g?: number; name?: string; branche?: string; email?: string; phone?: string; focus?: Field; caret?: boolean; caretSolid?: boolean;
  consent?: number; hover?: number; press?: number; seg?: number; chatHover?: number; hideButton?: boolean }> = ({ g = 0, name = "", branche = "", email = "", phone = "", focus = null, caret = false, caretSolid = false, consent = 0, hover = 0, press = 0, seg = 1, chatHover = 0, hideButton = false }) => {
  const blinkOn = caretSolid || Math.floor(g / 15) % 2 === 0;
  const label = (r: { x: number; y: number }, t: string, req = true) => (
    <div style={{ position: "absolute", left: r.x, top: r.y - 25, fontSize: 13.5, fontWeight: 500, color: C.ink }}>{t}{req && <span style={{ color: "#B4574A" }}> *</span>}</div>
  );
  const box = (key: Exclude<Field, null>, value: string, ph: string, chevron = false) => {
    const r = WIZ_R[key], on = focus === key;
    return (
      <div style={{ position: "absolute", left: r.x, top: r.y, width: r.w, height: r.h, boxSizing: "border-box", borderRadius: 7, background: C.white,
        border: `1px solid ${on ? "#8FAFA6" : "#E1DDD6"}`, boxShadow: on ? "0 0 0 3px rgba(135,168,158,0.22)" : "0 1px 1px rgba(26,22,20,0.03)",
        display: "flex", alignItems: "center", padding: "0 13px", fontSize: 14, color: value ? C.ink : "#A9A39B", whiteSpace: "nowrap" }}>
        <span>{value || (key === "branche" ? "" : ph)}</span>{key === "branche" && !value && <span style={{ color: C.ink }}>{ph}</span>}
        {on && caret && <span style={{ display: "inline-block", width: 1.5, height: 18, marginLeft: value ? 1 : -2, background: C.ink, opacity: blinkOn ? 1 : 0 }} />}
        <div style={{ flex: 1 }} />{chevron && <Ico n="chevron" s={16} c={C.muted} w={2} />}
      </div>
    );
  };
  const btn = WIZ_R.button, chat = WIZ_R.chat;
  return (
    <div style={{ position: "relative", width: WIZ.w, height: WIZ.h, background: C.bg, fontFamily: SANS, color: C.ink, overflow: "hidden" }}>
      {/* header */}
      <div style={{ position: "absolute", left: 0, top: 0, width: WIZ.w, height: 73, borderBottom: `1px solid ${C.line}`, boxSizing: "border-box" }}>
        <div style={{ position: "absolute", left: 44, top: 27 }}><Wordmark h={20} /></div>
        <div style={{ position: "absolute", left: 136, top: 28, width: 1, height: 17, background: C.line }} />
        <div style={{ position: "absolute", left: 152, top: 27, fontSize: 13, color: C.muted, display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ color: "#00B67A", fontSize: 14 }}>★</span><span style={{ fontWeight: 600, color: C.ink }}>4,7</span> på Trustpilot</div>
        <div style={{ position: "absolute", right: 54, top: 28, fontSize: 13, color: C.muted }}>Brug for hjælp? support@creoble.dk</div>
      </div>
      {/* progress */}
      <div style={{ position: "absolute", left: 560, top: 90, width: 480, fontSize: 12.5, color: C.muted, display: "flex" }}>
        <span>Trin <b style={{ color: C.ink, fontWeight: 600 }}>1</b> af 6, <b style={{ color: C.ink, fontWeight: 600 }}>Virksomhed</b></span><div style={{ flex: 1 }} /><span>Omkring 4 minutter tilbage</span>
      </div>
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} style={{ position: "absolute", left: 560 + i * 80.8, top: 116, width: 76.8, height: 3, borderRadius: 2, background: "#E4E0D9", overflow: "hidden" }}>
          <div style={{ width: "100%", height: "100%", background: C.sageDark, transformOrigin: "0 50%", transform: `scaleX(${clamp01(seg - i)})` }} />
        </div>
      ))}
      {/* headline */}
      <div style={{ position: "absolute", left: 560, top: 146, fontFamily: SERIF, fontSize: 31, letterSpacing: "-0.02em", lineHeight: 1.2, whiteSpace: "nowrap" }}>Lad os starte med det vigtigste</div>
      <div style={{ position: "absolute", left: 560, top: 197, fontSize: 14, color: C.muted, whiteSpace: "nowrap" }}>Fortæl os om din virksomhed. Du ser siden gratis, før du beslutter noget.</div>
      {label(WIZ_R.name, "Virksomhedsnavn")}{box("name", name, "fx Klinik for Fysioterapi")}
      {label(WIZ_R.branche, "Branche")}{box("branche", branche, "Vælg branche", true)}
      <div style={{ position: "absolute", left: 560, top: 401, fontSize: 11.5, color: C.muted }}>Tekst, sektioner og spørgsmålene på næste trin tilpasses branchen.</div>
      {label(WIZ_R.email, "E-mail")}{box("email", email, "din@mail.dk")}
      {label(WIZ_R.phone, "Telefon", false)}{box("phone", phone, "+45 12 34 56 78")}
      <div style={{ position: "absolute", left: 560, top: 532, width: 480, display: "flex", gap: 9, fontSize: 11.5, lineHeight: 1.55, color: C.muted }}>
        <Ico n="lock" s={14} c={C.muted} w={2} style={{ marginTop: 2 }} /><span>Vi bruger e-mail og telefon til kvitteringen og til at kontakte dig, hvis vi har spørgsmål til din side.</span></div>
      <div style={{ position: "absolute", left: 560, top: 589, width: 480, height: 1, background: C.line }} />
      <div style={{ position: "absolute", left: 560, top: 614, width: 480, display: "flex", gap: 10, fontSize: 11.5, lineHeight: 1.55, color: C.muted }}>
        <div style={{ width: 14, height: 14, marginTop: 2, borderRadius: 3, flex: "none", border: `1px solid ${consent > 0.5 ? C.sageDark : "#C9C4BC"}`, background: `rgba(74,107,98,${clamp01(consent)})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {consent > 0 && <Ico n="check" s={11} c={C.white} w={3} style={{ opacity: clamp01(consent) }} />}</div>
        <span>Ja tak, send mig gode råd til min hjemmeside og nyheder fra Creoble på e-mail og sms. Du kan afmelde når som helst.</span></div>
      <div style={{ position: "absolute", left: 560, top: 684, width: 480, height: 1, background: C.line }} />
      {!hideButton && <div style={{ position: "absolute", left: btn.x, top: btn.y, width: btn.w, height: btn.h, borderRadius: 7, background: hover > 0 ? `color-mix(in srgb, #3A3431 ${hover * 100}%, ${C.ink})` : C.ink,
        color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 500, transform: `scale(${1 - 0.045 * press})` }}>Fortsæt</div>}
      <div style={{ position: "absolute", left: chat.x, top: chat.y, width: chat.w, height: chat.h, borderRadius: "50%", background: C.sageDark, display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 4px 14px -6px rgba(26,22,20,0.4)", transform: `scale(${1 + 0.06 * chatHover})` }}><Ico n="chat" s={22} c={C.white} w={2.2} /></div>
    </div>
  );
};
// the wizard in its browser window (1600 × 846), address "creoble.dk/builder"
export const WizardWindow: React.FC<React.ComponentProps<typeof Wizard>> = (p) => (
  <Browser w={WIZ_WIN.w} h={WIZ_WIN.h} url="creoble.dk/builder"><Wizard {...p} /></Browser>
);

/* ---------- the example site in its browser ---------- */
// "Holm Fysioterapi" (fictional), the site Creoble builds. The window is 1460 × 906 (bar 46 + the 1460 × 860 page
// view). build 0..1 generates it block by block; scroll in page px (0 … ~640); booking 0..1 adds "Book tid";
// headline replaces "Kom godt i bevægelse igen." (the edit in scene 4 makes it NEW_HEADLINE); url / live: the
// address pill ("Forhåndsvisning", then "holmfysio.dk" with the lock and the Live dot).
export const SITE_WIN = { w: 1460, h: 906 };
export const NEW_HEADLINE = <>Velkommen hjem<br />i din krop.</>;
export const SiteWindow: React.FC<{ build?: number; scroll?: number; booking?: number; headline?: React.ReactNode; url?: string; live?: number }> = ({ build = 1, scroll = 0, booking = 0, headline, url = "Forhåndsvisning", live = 0 }) => (
  <Browser w={SITE_WIN.w} h={SITE_WIN.h} url={url} live={live}><HolmSite w={SITE_WIN.w} h={SITE_WIN.h - BAR} build={build} scroll={scroll} booking={booking} headline={headline} /></Browser>
);

/* ---------- the hosting card ---------- */
// Creoble's hosting for Holm: 1000 × 660. rows 0..3 shows the three rows in turn (fractional = arriving); active[i]
// 0..1 turns row i from "Sætter op" (grey, a small turning logo) to "Aktiv" (sage, a check): Willads' "domain, mail
// and website turning green one after another". price 0..1 shows "Fra 83 kr./md." (+ "faktureres årligt");
// press 0..1 on the black "Sæt online" button; g turns the spinners.
export const CARD = { w: 1000, h: 660 };
export const CARD_ROWS = [["Domæne", "holmfysio.dk"], ["E-mail", "kontakt@holmfysio.dk"], ["Hjemmeside", "Holm Fysioterapi"]];
export const CARD_R = { title: { x: 64, y: 56, w: 872, h: 110 }, rows: [0, 1, 2].map((i) => ({ x: 64, y: 186 + i * 104, w: 872, h: 104 })), price: { x: 64, y: 524, w: 872, h: 90 }, button: { x: 744, y: 540, w: 192, h: 60 } };
export const HostingCard: React.FC<{ g?: number; rows?: number; active?: number[]; price?: number; press?: number }> = ({ g = 0, rows = 3, active = [0, 0, 0], price = 1, press = 0 }) => (
  <div style={{ position: "relative", width: CARD.w, height: CARD.h, borderRadius: 24, background: C.white, boxShadow: `0 0 0 1px ${C.line}, ${SHADOW_BIG}`, fontFamily: SANS, color: C.ink, overflow: "hidden" }}>
    <div style={{ position: "absolute", left: 64, top: 56, fontSize: 15, fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", color: C.muted }}>Hosting</div>
    <div style={{ position: "absolute", left: 64, top: 86, fontFamily: SERIF, fontSize: 52, letterSpacing: "-0.025em", lineHeight: 1.1 }}>holmfysio.dk</div>
    {CARD_ROWS.map(([l, v], i) => {
      const q = OUT(clamp01(rows - i)), a = INOUT(clamp01(active[i] ?? 0)), r = CARD_R.rows[i];
      return (
        <div key={l} style={{ position: "absolute", left: r.x, top: r.y, width: r.w, height: r.h, borderTop: `1px solid ${C.line}`, display: "flex", alignItems: "center", opacity: q, transform: `translateY(${(1 - q) * 18}px)` }}>
          <div><div style={{ fontSize: 17, color: C.muted }}>{l}</div><div style={{ marginTop: 4, fontSize: 25, fontWeight: 500, letterSpacing: "-0.01em" }}>{v}</div></div>
          <div style={{ flex: 1 }} />
          <div style={{ position: "relative", height: 44, width: 168, borderRadius: 999, overflow: "hidden", background: `color-mix(in srgb, ${C.sageTint} ${a * 100}%, #F1EEE8)`, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, fontSize: 17, fontWeight: 500 }}>
            {a < 1 && <div style={{ display: "flex", alignItems: "center", gap: 10, opacity: 1 - a, position: "absolute", transform: `translateY(${-a * 40}px)` }}>
              <div style={{ position: "relative", width: 22, height: 22 }}><div style={{ position: "absolute", left: 11, top: 11 }}><Spinner g={g + i * 7} size={24} color="#9C968E" /></div></div>
              <span style={{ color: C.muted }}>Sætter op</span></div>}
            {a > 0 && <div style={{ display: "flex", alignItems: "center", gap: 9, opacity: a, position: "absolute", color: C.sageDeep, transform: `translateY(${(1 - a) * 40}px)` }}>
              <div style={{ width: 24, height: 24, borderRadius: "50%", background: C.sage, display: "flex", alignItems: "center", justifyContent: "center" }}><Ico n="check" s={16} c={C.white} w={3} /></div>Aktiv</div>}
          </div>
        </div>
      );
    })}
    <div style={{ position: "absolute", left: 64, top: 498, width: 872, height: 1, background: C.line, opacity: OUT(clamp01(price)) }} />
    <div style={{ position: "absolute", left: 64, top: 528, opacity: OUT(clamp01(price)), transform: `translateY(${(1 - OUT(clamp01(price))) * 16}px)` }}>
      <div style={{ fontFamily: SERIF, fontSize: 54, letterSpacing: "-0.025em", lineHeight: 1 }}>Fra 83 kr.<span style={{ fontSize: 30, color: C.muted }}> /md.</span></div>
      <div style={{ marginTop: 10, fontSize: 16, color: C.muted }}>faktureres årligt</div>
    </div>
    <div style={{ position: "absolute", left: 744, top: 540, width: 192, height: 60, borderRadius: 12, background: C.ink, color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 19, fontWeight: 500,
      opacity: OUT(clamp01(price)), transform: `scale(${1 - 0.045 * press})` }}>Sæt online</div>
  </div>
);

/* ---------- the cursor (screen space) ---------- */
// The macOS arrow, drawn in SCREEN px over the 3D stage: put it after the Stage3D, at project(cam, worldPoint) so it
// stays on its target while the camera moves. x, y = the tip. press 0..1 = the click (it dips 10%).
// size = height px (default 40 at 1080p; scale it with the shot so it stays in proportion to the UI).
export const Cursor: React.FC<{ x: number; y: number; press?: number; size?: number; opacity?: number }> = ({ x, y, press = 0, size = 40, opacity = 1 }) => (
  <svg width={size * 0.66} height={size} viewBox="0 0 22 33" style={{ position: "absolute", left: x - size * 0.06, top: y - size * 0.04, opacity, transformOrigin: "6% 4%", transform: `scale(${1 - 0.1 * press})`, filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.28))", overflow: "visible" }}>
    <path d="M1.5 1.5 L1.5 26.5 L7.6 20.6 L11.8 30.6 L16 28.8 L11.9 19.1 L20.3 19.1 Z" fill="#111" stroke="#fff" strokeWidth={1.6} strokeLinejoin="round" />
  </svg>
);
// cursorAt: an eased glide through screen points (labels or seconds): glides INOUT between keys (0.6–0.9 s apart),
// holds before the first and after the last. Returns { x, y }.
export const cursorAt = (g: number, keys: { at: string | number; x: number; y: number }[]) => {
  const ts = keys.map((kk) => f(kk.at));
  if (g <= ts[0]) return { x: keys[0].x, y: keys[0].y };
  for (let i = 1; i < keys.length; i++) if (g <= ts[i]) { const t = INOUT(clamp01((g - ts[i - 1]) / Math.max(1e-6, ts[i] - ts[i - 1]))); return { x: mix(keys[i - 1].x, keys[i].x, t), y: mix(keys[i - 1].y, keys[i].y, t) }; }
  return { x: keys[keys.length - 1].x, y: keys[keys.length - 1].y };
};

/* ---------- the hand-offs between builders ---------- */
// Both builders draw the same picture inside ±0.3 s (9 g) of h1 and h2, so the cut between their files is invisible.
// h1 (A → B): the finished site, far and soft (depth of field), drifting slowly; no type on screen.
export const HANDOFF_HALF = 9;
export const inHandoff = (g: number, at: "h1" | "h2") => Math.abs(g - f(at)) <= HANDOFF_HALF;
export const camH1 = (g: number) => { const t = (g - f("h1")) / 30; return cam({ x: 24 * t, y: -6 * t, z: -140 - 70 * t, ry: -1.2 * t, ap: 20 }); };
export const H1_SITE = { x: 0, y: 0, z: -1400, ry: -8 };
export const Handoff1: React.FC<{ g: number }> = ({ g }) => (
  <Stage3D cam={camH1(g)}>
    <Plane {...H1_SITE} w={SITE_WIN.w} h={SITE_WIN.h}><SiteWindow /></Plane>
  </Stage3D>
);
// h2 (B → C): the hosting card, whole and sharp, three rows still setting up, the price in view; a slow dolly in.
export const camH2 = (g: number) => { const t = (g - f("h2")) / 30; return cam({ x: 10 * t, z: -40 - 40 * t, ry: 2 - 1.5 * t, ap: 12, focus: PERSP + 60 }); };
export const H2_CARD = { x: 0, y: 0, z: -100, ry: -3 };
export const Handoff2: React.FC<{ g: number }> = ({ g }) => (
  <Stage3D cam={camH2(g)}>
    <Plane {...H2_CARD} w={CARD.w} h={CARD.h}><HostingCard g={g} rows={3} active={[0, 0, 0]} price={1} /></Plane>
  </Stage3D>
);
export { SHADOW };
