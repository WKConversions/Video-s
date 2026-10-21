// Builder 5 — B5, a human, the brand, the CTA (plan/storyboard.md): h4 → end.
// From Handoff4 the site recedes (iOS sheet idiom: scale back + scrim) and gently scrolls; a help bubble lands in the
// bottom-right corner and a Glass chat card grows out of it ("Creoble support"); the client's message, typing, the
// human reply; the queue and bot chips are struck through in sage. On "Creoble." the card folds back into its bubble,
// everything clears and the wordmark builds large; the label draws, the site frame and the hosting card slide in from
// their sides and meet as one unit on "samlet ét sted". Then Creoble's own line, the button (press + shine on
// "gratis") and creoble.dk, and a calm hold.
import React from "react";
import {
  BAR, Browser, C, Card, EXIT, Glass, Handoff4, HolmSite, Ico, INOUT, Label, LIN, OUT, PillButton, SANS, SERIF, Scrim,
  SiteHome, Statement, WIPE, Wordmark, aspring, clamp01, f, k, mix, press,
} from "../shared";
import { WM_VIEW } from "../wordmark";

/* ---------- local helpers ---------- */
const LP: Record<string, React.ReactNode> = {
  clock: <><circle cx="24" cy="24" r="17" /><path d="M24 14 V24 L31 29" /></>,
  bot: <><rect x="9" y="16" width="30" height="23" rx="7" /><path d="M24 16 V9" /><circle cx="24" cy="7.5" r="1.6" /><path d="M18.5 25.5 V29 M29.5 25.5 V29" /></>,
  send: <path d="M24 36 V13 M14 23 L24 13 L34 23" />,
};
const LIco: React.FC<{ n: string; s?: number; c?: string; w?: number; style?: React.CSSProperties }> = ({ n, s = 24, c = C.ink, w = 2, style }) => (
  <svg width={s} height={s} viewBox="0 0 48 48" fill="none" stroke={c} strokeWidth={(w * 48) / 26} strokeLinecap="round" strokeLinejoin="round" style={{ display: "block", flex: "none", ...style }}>{LP[n]}</svg>
);
// a word or line rising through its own mask (the film's text entrance), p 0..1
const Rise: React.FC<{ p: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ p, children, style }) => (
  <span style={{ display: "inline-block", overflow: "hidden", paddingBottom: "0.14em", marginBottom: "-0.14em", verticalAlign: "bottom" }}>
    <span style={{ display: "inline-block", transform: `translateY(${(1 - clamp01(p)) * 108}%)`, ...style }}>{children}</span>
  </span>
);

/* ---------- layout ---------- */
const CARD = { x: 610, y: 205, w: 700, h: 670 };     // the chat card's resting rect (centred)
const BUB = { x: 1784, y: 976, d: 82 };              // the help bubble (centre), bottom-right corner
const SITE_C = { x: 960, y: 536 };                    // the home site's centre (it recedes about it)
const WM_H = 150, WM_W = (WM_H * WM_VIEW.w) / WM_VIEW.h;
const UNIT = { y: 508, siteW: 520, h: 340, cardW: 300, gap: 24 };
const UNIT_W = UNIT.siteW + UNIT.gap + UNIT.cardW, UNIT_X = 960 - UNIT_W / 2;

/* ---------- the chat card's contents ---------- */
const Pill: React.FC<{ text: string; icon: string; inP: number; strike: number; dim: number }> = ({ text, icon, inP, strike, dim }) => (
  <div style={{ position: "relative", display: "inline-flex", alignItems: "center", gap: 12, padding: "11px 22px", borderRadius: 999, background: "#F2F0EB", border: `1px solid ${C.line}`,
    fontFamily: SANS, fontWeight: 500, fontSize: 24, color: C.muted, whiteSpace: "nowrap", opacity: OUT(clamp01(inP)) * (1 - 0.5 * dim), transform: `translateY(${(1 - OUT(clamp01(inP))) * 12}px) scale(${mix(0.965, 1, OUT(clamp01(inP))) - 0.02 * dim})` }}>
    <LIco n={icon} s={26} c={C.muted} w={2.2} />{text}
    <div style={{ position: "absolute", left: 16, top: "50%", height: 3, marginTop: -1.5, borderRadius: 2, background: C.sage, width: `calc(${strike} * (100% - 32px))` }} />
  </div>
);

const ChatBody: React.FC<{ g: number }> = ({ g }) => {
  const msg = aspring(g, "w:hjlp+0.3", 0.42);                       // the client's message lands
  const typeIn = k(g, "w:et", 0.3), r1 = k(g, "w:forstr", 0.45, OUT), r2 = aspring(g, "w:forretning", 0.42);
  const ring = k(g, "w:menneske", 0.55, OUT);
  const writing = k(g, "w:menneske", 0.25) * (1 - k(g, "w:forstr", 0.25));
  const p1 = k(g, "w:ingen4-0.15", 0.35), s1 = k(g, "w:k", 0.32, WIPE), d1 = k(g, "w:k+0.3", 0.4);
  const p2 = k(g, "w:ingen5-0.12", 0.35), s2 = k(g, "w:robotsvar", 0.32, WIPE), d2 = k(g, "w:robotsvar+0.3", 0.4);
  const dots = [0, 1, 2].map((i) => 0.35 + 0.65 * (0.5 + 0.5 * Math.sin((g / 30) * Math.PI * 2 * 1.6 - i * 0.9)));
  const supAv = (top: number, o: number) => (
    <div style={{ position: "absolute", left: 30, top, width: 42, height: 42, borderRadius: "50%", background: C.sageTint, display: "flex", alignItems: "center", justifyContent: "center", opacity: o }}>
      <Ico n="user" s={24} c={C.sageDeep} w={2.2} />
    </div>
  );
  const bubble: React.CSSProperties = { position: "absolute", left: 86, padding: "16px 24px", borderRadius: 22, borderBottomLeftRadius: 7, background: C.card, border: `1px solid ${C.line}`, fontSize: 26, lineHeight: 1.35, color: C.ink, whiteSpace: "nowrap" };
  return (
    <div style={{ position: "absolute", inset: 0, fontFamily: SANS }}>
      {/* header: neutral avatar, name, online */}
      <div style={{ position: "absolute", left: 30, top: 26, width: 62, height: 62, borderRadius: "50%", background: C.sageTint, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Ico n="user" s={34} c={C.sageDeep} w={2.1} />
        <svg width={76} height={76} viewBox="0 0 76 76" style={{ position: "absolute", left: -7, top: -7, transform: "rotate(-90deg)" }}>
          <circle cx={38} cy={38} r={35.5} fill="none" stroke={C.sage} strokeWidth={2.5} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - ring} strokeLinecap="round" />
        </svg>
        <div style={{ position: "absolute", right: -1, bottom: -1, width: 17, height: 17, borderRadius: "50%", background: C.sage, border: `3px solid ${C.white}` }} />
      </div>
      <div style={{ position: "absolute", left: 112, top: 24, fontSize: 28, fontWeight: 500, color: C.ink, letterSpacing: "-0.01em" }}>Creoble support</div>
      <div style={{ position: "absolute", left: 112, top: 62, height: 30, fontSize: 22, color: C.muted }}>
        <span style={{ position: "absolute", left: 0, top: 0, whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 8, opacity: 1 - writing }}>
          <span style={{ width: 9, height: 9, borderRadius: "50%", background: C.sage }} />Online</span>
        <span style={{ position: "absolute", left: 0, top: 0, whiteSpace: "nowrap", color: C.sageDeep, opacity: writing }}>Skriver…</span>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 114, height: 1, background: C.line }} />

      {/* the client's message */}
      <div style={{ position: "absolute", right: 30, top: 142, maxWidth: 452, padding: "16px 24px", borderRadius: 22, borderBottomRightRadius: 7, background: C.sageDark, color: C.white, fontSize: 26, lineHeight: 1.35,
        opacity: clamp01(msg * 1.6), transform: `translateY(${(1 - msg) * 22}px)`, transformOrigin: "100% 100%" }}>Hej! Kan I hjælpe med at<br />skifte et billede?</div>

      {/* typing, then the human reply */}
      {supAv(282, clamp01(typeIn * 1.5))}
      <div style={{ ...bubble, top: 268, padding: "0 24px", height: 62, display: "flex", alignItems: "center", gap: 9, opacity: typeIn * (1 - k(g, "w:forstr", 0.18, LIN)), transform: `scale(${mix(0.9, 1, typeIn)})`, transformOrigin: "0 100%" }}>
        {dots.map((o, i) => <div key={i} style={{ width: 11, height: 11, borderRadius: "50%", background: C.sageDeep, opacity: o }} />)}
      </div>
      <div style={{ ...bubble, top: 268, clipPath: `inset(0 ${(1 - r1) * 100}% 0 0 round 22px)` }}>Selvfølgelig!</div>
      <div style={{ ...bubble, top: 346, opacity: clamp01(r2 * 1.6), transform: `translateY(${(1 - r2) * 18}px)` }}>Jeg ordner det med det samme.</div>

      {/* what you don't get: a queue, a bot */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 466, display: "flex", justifyContent: "center", gap: 16 }}>
        <Pill text="Du er nr. 14 i køen" icon="clock" inP={p1} strike={s1} dim={d1} />
        <Pill text="Bot" icon="bot" inP={p2} strike={s2} dim={d2} />
      </div>

      {/* the input */}
      <div style={{ position: "absolute", left: 30, right: 30, bottom: 26, height: 62, borderRadius: 999, background: C.white, border: `1px solid ${C.line}`, display: "flex", alignItems: "center", padding: "0 8px 0 26px", fontSize: 23, color: C.soft }}>
        Skriv en besked…<div style={{ flex: 1 }} />
        <div style={{ width: 46, height: 46, borderRadius: "50%", background: C.sage, display: "flex", alignItems: "center", justifyContent: "center" }}><LIco n="send" s={24} c={C.white} w={2.6} /></div>
      </div>
    </div>
  );
};

export const Scene5: React.FC<{ g: number }> = ({ g }) => {
  if (g < f("h4") || g >= f("end")) return null;

  /* ---- B5a: the site recedes, the chat card ---- */
  const rec = aspring(g, "h4", 0.8);                                   // recede (sheet idiom)
  const drift = k(g, "h4+0.8", 5, LIN);                                // keeps receding, very slowly
  const sc = k(g, "w:brug", 5.1, LIN), scroll = 430 * (0.55 * sc + 0.45 * INOUT(sc));   // the site keeps living behind
  const siteOut = k(g, "w:creoble3-0.45", 0.5, EXIT);
  const siteS = 1 - 0.1 * rec - 0.025 * drift - 0.05 * siteOut;
  const bIn = aspring(g, "w:brug", 0.45), bOut = k(g, "w:creoble3-0.22", 0.35, EXIT);
  const cin = aspring(g, "w:hjlp", 0.55), cout = aspring(g, "w:creoble3-0.55", 0.42);
  const pc = clamp01(cin * (1 - cout));
  const cs = mix(0.05, 1, pc);
  const dx = BUB.x - 6 - (CARD.x + CARD.w), dy = BUB.y - 6 - (CARD.y + CARD.h);
  const cardDrift = -16 * k(g, "w:hjlp+0.6", 4.2, LIN);
  const showA = siteOut < 1;

  /* ---- B5b: the brand ---- */
  const wmP = k(g, "w:creoble3-0.05", 0.85, LIN);
  const rise = aspring(g, "w:hjemmeside2-0.1", 0.75);
  const wmTop = mix(465, 222, rise);
  const lab = k(g, "w:hjemmeside2+0.1", 1.15, LIN);
  const sIn = aspring(g, "w:hjemmeside2+0.15", 0.8), hIn = aspring(g, "w:hosting", 0.7), meet = aspring(g, "w:samlet", 0.6);
  const siteX = mix(-UNIT.siteW - 60, UNIT_X - 140, sIn) + 140 * meet;
  const hostX = mix(1920 + 60, UNIT_X + UNIT.siteW + UNIT.gap + 140, hIn) - 140 * meet;
  const ring = k(g, "w:t", 0.5, WIPE), fill = k(g, "w:sted", 0.45, OUT);
  const bOutB = k(g, "w:byg-0.3", 0.45, EXIT);
  const showB = g >= f("w:creoble3") - 4 && bOutB < 1;

  /* ---- B5c: the line, the button, the address ---- */
  const sl = k(g, "w:byg-0.1", 3.6, LIN), lineY = mix(484, 356, 0.5 * sl + 0.5 * INOUT(sl));   // the line drifts up into its place
  const hold = k(g, "w:creoble4", 2.3, INOUT);   // a last tiny drift under the address, then the still hold
  const btn = aspring(g, "w:byg2+0.08", 0.55);
  const pr = press(g, "w:gratis");
  const shine = k(g, "w:gratis-0.4", 0.9, INOUT);
  const u1 = k(g, "w:creoble4", 0.6), u2 = k(g, "w:dk", 0.55), ul = k(g, "w:dk+0.06", 0.6, WIPE);
  const showC = g >= f("w:byg") - 2;

  return (
    <>
      {showA && (
        <>
          <div style={{ position: "absolute", inset: 0, transformOrigin: `${SITE_C.x}px ${SITE_C.y}px`, transform: `scale(${siteS})`, opacity: 1 - siteOut }}>
            {scroll < 0.01 ? <Handoff4 /> : <SiteHome booking={1} url="holmfysio.dk" live={1} scroll={scroll} />}
          </div>
          <Scrim p={rec} />
          {pc > 0.001 && (
            <div style={{ position: "absolute", left: CARD.x, top: CARD.y, width: CARD.w, height: CARD.h, transformOrigin: "100% 100%",
              transform: `translate(${dx * (1 - pc)}px, ${dy * (1 - pc) + cardDrift * pc}px) scale(${cs})` }}>
              <Glass p={clamp01(pc * 1.5)} radius={20} weight={1.4} style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
                <ChatBody g={g} />
              </Glass>
            </div>
          )}
          {bIn > 0.001 && bOut < 1 && (
            <div style={{ position: "absolute", left: BUB.x - BUB.d / 2, top: BUB.y - BUB.d / 2, width: BUB.d, height: BUB.d, borderRadius: "50%", background: C.sageDark,
              boxShadow: "0 14px 30px -12px rgba(26,22,20,0.45)", opacity: clamp01(bIn * 1.4) * (1 - bOut), transform: `scale(${mix(0.55, 1, bIn) * (1 - 0.3 * bOut)})` }}>
              <Ico n="chat" s={36} c={C.white} w={2.2} style={{ position: "absolute", left: 23, top: 23, opacity: 1 - clamp01(pc * 2) }} />
              <Ico n="chevron" s={36} c={C.white} w={2.4} style={{ position: "absolute", left: 23, top: 24, opacity: clamp01(pc * 2) }} />
            </div>
          )}
        </>
      )}

      {showB && (
        <div style={{ position: "absolute", inset: 0, opacity: 1 - bOutB, transform: `translateY(${-60 * bOutB}px)` }}>
          <div style={{ position: "absolute", left: 960 - WM_W / 2, top: wmTop }}><Wordmark h={WM_H} p={wmP} /></div>
          <Label text="Hjemmeside & hosting" p={lab} size={24} style={{ position: "absolute", left: 741, top: 410 }} />
          <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
            <rect x={UNIT_X - 22} y={UNIT.y - 22} width={UNIT_W + 44} height={UNIT.h + 44} rx={32} fill={C.sageTint} opacity={fill * 0.75} />
            <rect x={UNIT_X - 22} y={UNIT.y - 22} width={UNIT_W + 44} height={UNIT.h + 44} rx={32} fill="none" stroke={C.sageLight} strokeWidth={2}
              pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - ring} opacity={ring > 0 ? 1 : 0} />
          </svg>
          {sIn > 0.001 && (
            <Browser w={UNIT.siteW} h={UNIT.h} url="holmfysio.dk" live={1} style={{ position: "absolute", left: siteX, top: UNIT.y }}>
              <HolmSite w={UNIT.siteW} h={UNIT.h - BAR} booking={1} scroll={140 * k(g, "w:hjemmeside2", 2.6, INOUT)} />
            </Browser>
          )}
          {hIn > 0.001 && (
            <Card w={UNIT.cardW} h={UNIT.h} pad={30} style={{ position: "absolute", left: hostX, top: UNIT.y }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: C.sageTint, display: "flex", alignItems: "center", justifyContent: "center" }}><Ico n="server" s={28} c={C.sageDeep} w={2.2} /></div>
              <div style={{ marginTop: 26, fontSize: 28, fontWeight: 500 }}>Hosting</div>
              <div style={{ marginTop: 14, display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{ fontFamily: SERIF, fontSize: 50, letterSpacing: "-0.025em" }}>fra 83 kr</span><span style={{ fontSize: 22, color: C.muted }}>/md</span>
              </div>
              <div style={{ marginTop: 8, fontSize: 19, color: C.muted }}>Betalt årligt</div>
              <div style={{ marginTop: 22, display: "flex", alignItems: "center", gap: 8, fontSize: 20, color: C.sageDeep, fontWeight: 500 }}>
                <span style={{ width: 9, height: 9, borderRadius: "50%", background: C.sage }} />holmfysio.dk</div>
            </Card>
          )}
        </div>
      )}

      {showC && (
        <>
          <div style={{ position: "absolute", inset: 0, transform: `translateY(${-10 * hold}px)` }}>
            <Statement g={g} x={960} y={lineY} size={112} align="center" words={[
              { t: "Byg", at: "w:byg" }, { t: "den.", at: "w:den3" }, { t: "Se", at: "w:se" }, { t: "den.", at: "w:den4" },
              { t: "Så", at: "w:s2", it: true }, { t: "køber", at: "w:kber" }, { t: "du.", at: "w:du5" }]} />
          </div>
          {btn > 0.001 && (
            <div style={{ position: "absolute", left: 0, width: 1920, top: 548, display: "flex", justifyContent: "center", opacity: clamp01(btn * 1.5),
              transform: `translateY(${(1 - btn) * 26 - 14 * hold}px) scale(${mix(0.965, 1, btn)})` }}>
              <PillButton text="Byg din side gratis" size={30} press={0.6 * pr} shine={shine} />
            </div>
          )}
          <div style={{ position: "absolute", left: 0, width: 1920, top: 664, display: "flex", justifyContent: "center", transform: `translateY(${-16 * hold}px)` }}>
            <div style={{ display: "inline-flex", flexDirection: "column", fontFamily: SANS, fontWeight: 500, fontSize: 60, letterSpacing: "-0.015em", color: C.ink }}>
              <div style={{ whiteSpace: "nowrap" }}><Rise p={u1}>creoble</Rise><Rise p={u2}><span style={{ color: C.sage }}>.</span>dk</Rise></div>
              <div style={{ marginTop: 6, height: 3, borderRadius: 2, width: `${ul * 100}%`, background: C.sage }} />
            </div>
          </div>
        </>
      )}
    </>
  );
};
