// Builder 2 — B2, "see it, change it" (h1 → h2, plan/storyboard.md).
//   "Det bedste?"            the site settles back and right (0.62×); "Det / bedste?" is revealed through the mask.
//   "Du ser den færdig, …"   the frame itself expands to full bleed (a product shot that gently scrolls); on "færdig"
//                            a Glass chip "Forhåndsvisning · Gratis" materializes out of the URL pill; on "betaler"
//                            a receipt card lands ("Betalt indtil nu" / "0 kr"), the site dims to focus, the check
//                            lands on "krone".
//   "Vil du ændre noget? …"  the frame returns smaller (same path, from the frame), Creoble's Glass prompt bar rises
//                            under it; "Skriv det" types the request, "det" sends it (press); "Creoble" marks the
//                            spot; "retter det" sweeps the hero and grows "Book tid" in, the bar reads "Opdateret",
//                            and the frame carries everything back home: exactly Handoff2.
import React from "react";
import {
  BAR, Browser, C, Card, Check, EXIT, Glass, Handoff1, Handoff2, HOME, HolmSite, Ico, INOUT, OUT, SANS, SERIF, Scrim, WIPE,
  aspring, breath, clamp01, f, k, mix, typed,
} from "../shared";

/* ---------- local helpers (frame-based; the kit's helpers read a bare number as seconds) ---------- */
const spr = (g: number, a: number, resp = 0.4) => {               // critically damped spring from frame a
  const t = (g - a) / 30;
  if (t <= 0) return 0;
  const w = (2 * Math.PI) / resp;
  return 1 - (1 + w * t) * Math.exp(-w * t);
};
const prs = (g: number, a: number, hold = 0.12) => {               // press feedback from frame a (0 → 1 → spring back)
  const t = (g - a) / 30;
  if (t < 0) return 0;
  if (t < 0.1) return t / 0.1;
  if (t < 0.1 + hold) return 1;
  return 1 - spr(g, a + (0.1 + hold) * 30, 0.3);
};
// One mask-revealed run of text (the Statement's reveal): p rises it in, o wipes it up and out.
const Mask: React.FC<{ p: number; o?: number; size: number; children: React.ReactNode }> = ({ p, o = 0, size, children }) => (
  <span style={{ display: "inline-block", overflow: "hidden", paddingBottom: size * 0.16, marginBottom: -size * 0.16, paddingRight: size * 0.08, verticalAlign: "top" }}>
    <span style={{ display: "inline-block", transform: `translateY(${(1 - p) * 105 - o * 110}%)` }}>{children}</span>
  </span>
);

/* ---------- the frame's geometry: a visual rect (x, y, w, h) and its design scale s ---------- */
type R = { x: number; y: number; w: number; h: number; s: number };
const lerpR = (a: R, b: R, p: number): R => ({ x: mix(a.x, b.x, p), y: mix(a.y, b.y, p), w: mix(a.w, b.w, p), h: mix(a.h, b.h, p), s: mix(a.s, b.s, p) });
const H0: R = { x: HOME.x, y: HOME.y, w: HOME.w, h: HOME.h, s: 1 };
const BACK: R = { x: 1772 - HOME.w * 0.62, y: 540 - (HOME.h * 0.62) / 2, w: HOME.w * 0.62, h: HOME.h * 0.62, s: 0.62 };
// Full bleed: the screen rect mapped back through Story's breath, so the frame meets the edges exactly.
const FULL = (g: number): R => {
  const b = breath(g), pad = 3;
  return { x: 960 + (-960 - b.x) / b.s - pad, y: 540 + (-540 - b.y) / b.s - pad, w: 1920 / b.s + 2 * pad, h: 1080 / b.s + 2 * pad, s: 1 };
};
const TXT = "Tilføj en knap til online booking";
const BAR_W = 920, BAR_H = 84, GAP = 34;

export const Scene2: React.FC<{ g: number }> = ({ g }) => {
  if (g < f("h1") || g >= f("h2")) return null;
  const F = {
    det: f("w:det"), du: f("w:du"), vil: f("w:vil"), ndre: f("w:ndre"), noget: f("w:noget"), skriv: f("w:skriv"),
    det2: f("w:det2"), creoble2: f("w:creoble2"), retter: f("w:retter"), det3: f("w:det3"), h2: f("h2"),
  };
  // the exact hand-off states at both ends
  if (g < F.det - 3) return <Handoff1 />;
  if (g >= F.h2 - 1) return <Handoff2 />;

  // stages of the one thread object (each a spring from the frame itself)
  const pA = spr(g, F.det - 3, 0.55);                    // settle back and right
  const pB = spr(g, F.du, 0.75);                         // expand to full bleed
  const pC = spr(g, F.vil, 0.6);                         // return smaller (prompt layout)
  const pD = clamp01(spr(g, F.retter, 0.42) / spr(F.h2 - 2, F.retter, 0.42));   // carry home (lands exactly on h2 − 2)
  const PROMPT = (): R => {
    const s = 0.78 + 0.03 * clamp01((g - F.vil) / (F.retter - F.vil)), w = HOME.w * s, h = HOME.h * s;
    return { x: 960 - w / 2, y: 110, w, h, s };
  };
  let r = H0;
  r = lerpR(r, BACK, pA);
  r = lerpR(r, FULL(g), pB);
  r = lerpR(r, PROMPT(), pC);
  r = lerpR(r, H0, pD);
  const fullness = pB * (1 - pC);
  const bw = r.w / r.s, bh = r.h / r.s, ss = bw / HOME.w;   // browser design size; the site's scale inside it

  /* "Det bedste?" */
  const sOut1 = k(g, "w:du-0.2", 0.4, INOUT), sOut2 = k(g, "w:du-0.13", 0.4, INOUT);   // wiped up as the frame comes
  const SZ = 190;

  /* full bleed: gentle scroll, chip, receipt, scrim */
  const scroll = 130 * k(g, "w:ser", 2.7, INOUT) * (1 - pC);
  const chipIn = aspring(g, "w:frdig", 0.4), awayO = k(g, "w:vil-0.3", 0.3, EXIT);
  const rcIn = aspring(g, "w:betaler", 0.45);
  const dim = 0.34 * aspring(g, "w:betaler", 0.5) * (1 - awayO);

  /* the edit */
  const mark = k(g, "w:creoble2", 0.55, WIPE), markO = 1 - k(g, "w:retter+0.15", 0.3);
  const sweep = k(g, "w:retter-0.05", 0.5, INOUT);
  const booking = clamp01((g - F.retter - 2) / 12);

  return (
    <>
      {/* "Det bedste?" — left, generous margin, italic sage key word */}
      {g < F.du + 20 && (
        <div style={{ position: "absolute", left: 160, top: 540 - SZ * 1.06, fontFamily: SERIF, fontWeight: 400, fontSize: SZ, letterSpacing: "-0.025em", lineHeight: 1.06, color: C.ink, whiteSpace: "nowrap" }}>
          <div><Mask p={k(g, "w:det", 0.55)} o={sOut1} size={SZ}>Det</Mask></div>
          <div><Mask p={k(g, "w:bedste", 0.55)} o={sOut2} size={SZ}><span style={{ fontStyle: "italic", color: C.sageDeep }}>bedste</span>?</Mask></div>
        </div>
      )}

      {/* the thread object: the browser frame with Holm's site */}
      <Browser w={bw} h={bh} style={{ position: "absolute", left: r.x, top: r.y, transform: `scale(${r.s})`, transformOrigin: "0 0", borderRadius: mix(16, 0, fullness) }}>
        <HolmSite w={bw} h={bh - BAR} booking={booking} scroll={scroll} />
        {/* overlays in the site's design px */}
        <div style={{ position: "absolute", left: 0, top: 0, width: HOME.w, height: 1500, transform: `scale(${ss}) translateY(${-scroll}px)`, transformOrigin: "0 0", pointerEvents: "none" }}>
          {mark > 0 && markO > 0 && (
            <svg width={HOME.w} height={900} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: markO }}>
              <rect x={50} y={538} width={456} height={100} rx={50} fill={C.sageTint} fillOpacity={0.22 * mark} stroke={C.sage} strokeWidth={3}
                strokeDasharray={1040} strokeDashoffset={1040 * (1 - mark)} />
            </svg>
          )}
          {sweep > 0 && sweep < 1 && (
            <div style={{ position: "absolute", top: 80, left: mix(-520, 1560, sweep), width: 420, height: 700, transform: "skewX(-14deg)",
              background: `linear-gradient(90deg, rgba(168,196,187,0), rgba(168,196,187,0.55), rgba(168,196,187,0))` }} />
          )}
        </div>
        {dim > 0.001 && <Scrim p={dim} />}
      </Browser>

      {/* "færdig": the preview chip materializes out of the URL pill */}
      {g >= f("w:frdig") && awayO < 1 && (
        <div style={{ position: "absolute", left: r.x + r.w / 2, top: r.y + (BAR + 16) * r.s, transform: `translate(-50%, ${-(1 - chipIn) * 18}px)` }}>
          <Glass p={chipIn * (1 - awayO)} radius={999} weight={1.5} style={{ display: "inline-flex", alignItems: "center", gap: 12, padding: "12px 24px", fontSize: 24, fontWeight: 500, whiteSpace: "nowrap", transformOrigin: "50% -30px" }}>
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: C.sage }} />
            Forhåndsvisning<span style={{ color: C.soft }}>·</span><span style={{ color: C.sageDeep }}>Gratis</span>
          </Glass>
        </div>
      )}

      {/* "betaler en krone": the receipt card lands */}
      {g >= f("w:betaler") && awayO < 1 && (
        <div style={{ position: "absolute", left: r.x + r.w - 150 - 390, top: r.y + r.h - 140 - 214, opacity: rcIn * (1 - awayO),
          transform: `translateY(${(1 - rcIn) * 40 + awayO * 46}px) scale(${0.965 + 0.035 * rcIn})`, transformOrigin: "50% 100%" }}>
          <Card w={390} pad={34} style={{ background: C.card }}>
            <div style={{ fontFamily: SANS, fontSize: 24, color: C.muted }}>Betalt indtil nu</div>
            <div style={{ height: 1, background: C.line, margin: "16px 0 6px", transform: `scaleX(${OUT(clamp01(rcIn * 1.2))})`, transformOrigin: "0 50%" }} />
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ fontFamily: SERIF, fontSize: 96, letterSpacing: "-0.025em", lineHeight: 1.08, color: C.ink }}><Mask p={k(g, "w:betaler+0.2", 0.55)} size={96}>0 kr</Mask></div>
              <Check size={46} p={k(g, "w:krone", 0.4)} />
            </div>
          </Card>
        </div>
      )}

      {/* "Vil du ændre noget?": Creoble's Glass prompt bar rises under the frame */}
      {g >= F.ndre && <PromptBar g={g} F={F} top={r.y + r.h + GAP} />}
    </>
  );
};

/* ---------- Creoble's prompt bar ---------- */
const PromptBar: React.FC<{ g: number; F: Record<string, number>; top: number }> = ({ g, F, top }) => {
  const rise = spr(g, F.ndre, 0.5);
  const out = k(g, "w:det3", 0.24, EXIT);
  if (out >= 1) return null;
  const focus = k(g, "w:noget", 0.35);
  const txt = typed(g, "w:skriv-0.1", TXT, 95);
  const typing = txt.length > 0 && txt.length < TXT.length;
  const pr = prs(g, F.det2);
  const sent = g >= F.det2;
  const work = clamp01((g - F.det2 - 3) / 5) * (1 - k(g, "w:retter", 0.25));
  const prog = INOUT(clamp01((g - F.det2 - 3) / (F.retter - F.det2 - 3)));
  const done = k(g, "w:retter", 0.3);
  const active = clamp01(txt.length / 4);
  const caretOn = g >= F.noget && !sent && (typing || Math.floor((g - F.noget) / 8) % 2 === 0);
  const pulse = 1 + 0.12 * Math.sin(((g - F.det2) / 30) * Math.PI * 2 * 1.4) * work;
  const shim = ((g - F.det2) / 30) * 1.5 % 1;                     // the "working" shimmer across the request
  const a = -20 + 140 * shim;
  const SZ = 28;
  return (
    <div style={{ position: "absolute", left: 960 - BAR_W / 2, top: top + (1 - rise) * 240 + out * 260, width: BAR_W }}>
      <div style={{ position: "absolute", inset: -7, borderRadius: 999, border: `2px solid ${C.sageLight}`, opacity: focus * (1 - done) * 0.9 }} />
      <Glass p={rise * (1 - 0.6 * out)} radius={999} weight={1.3} style={{ position: "relative", height: BAR_H, display: "flex", alignItems: "center", padding: "0 14px 0 30px", gap: 18, transformOrigin: "50% 100%", overflow: "hidden" }}>
        <div style={{ position: "relative", width: 34, height: 34, flex: "none" }}>
          <Ico n="sparkle" s={34} c={C.sageDeep} w={1.9} fill={C.sageTint} style={{ position: "absolute", inset: 0, opacity: 1 - done, transform: `scale(${pulse})` }} />
          <Check size={34} p={done} style={{ position: "absolute", inset: 0 }} />
        </div>
        <div style={{ position: "relative", flex: 1, height: BAR_H, fontFamily: SANS, fontSize: SZ, whiteSpace: "nowrap" }}>
          <div style={{ position: "absolute", left: 0, top: 0, height: BAR_H, display: "flex", alignItems: "center" }}><Mask p={1} o={done} size={SZ}><span style={{ display: "flex", alignItems: "center" }}>
            {caretOn && txt.length === 0 && <span style={{ width: 2.5, height: 32, background: C.sageDeep, marginRight: 3 }} />}
            {txt.length === 0 ? <span style={{ color: C.soft }}>Skriv din ændring…</span> : (
              <span style={sent ? { backgroundImage: `linear-gradient(90deg, ${C.ink} 0%, ${C.ink} ${a - 14}%, ${C.sage} ${a}%, ${C.ink} ${a + 14}%, ${C.ink} 100%)`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" } : { color: C.ink }}>{txt}</span>
            )}
            {caretOn && txt.length > 0 && <span style={{ width: 2.5, height: 32, background: C.sageDeep, marginLeft: 3 }} />}
          </span></Mask></div>
          <div style={{ position: "absolute", left: 0, top: 0, height: BAR_H, display: "flex", alignItems: "center", fontWeight: 500, color: C.ink }}>
            <Mask p={done} size={SZ}>Opdateret</Mask>
          </div>
        </div>
        <div style={{ width: 56, height: 56, borderRadius: "50%", flex: "none", display: "flex", alignItems: "center", justifyContent: "center", opacity: 1 - done,
          background: `color-mix(in srgb, ${C.sageDeep} ${pr * 45}%, color-mix(in srgb, ${C.sage} ${active * 100}%, #E4E0D9))`,
          transform: `scale(${1 - 0.03 * pr})`, boxShadow: `0 0 0 ${9 * pr}px rgba(135,168,158,0.28)` }}>
          <Ico n="arrow" s={28} c={C.white} w={2.6} style={{ transform: "rotate(-90deg)" }} />
        </div>
        {/* Creoble at work: a hairline of progress along the bar's lower edge */}
        <div style={{ position: "absolute", left: 46, right: 46, bottom: 0, height: 3, borderRadius: 2, background: C.sage, opacity: work, transform: `scaleX(${prog})`, transformOrigin: "0 50%" }} />
      </Glass>
    </div>
  );
};
