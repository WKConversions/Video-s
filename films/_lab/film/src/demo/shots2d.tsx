// 2D shots for the realism demo: dark sage space with words, the white flow-check beat, floating UI cards, end card.
// Each shot takes t = local seconds from its start.
import React from "react";
import { AbsoluteFill } from "remotion";
import { C, SERIF, SANS, OUT, INOUT, ramp, clamp01, mix, Wordmark } from "./kit";

const DARK_BG = `radial-gradient(ellipse 80% 70% at 50% 45%, ${C.nightSage} 0%, ${C.night} 100%)`;

/** blur-in helper: opacity 0→1 and blur b→0 over [a, a+d] */
const blurIn = (t: number, a: number, d: number, b = 14) => {
  const k = ramp(t, a, d);
  return { opacity: k, filter: `blur(${mix(b, 0, k)}px)` };
};

// ───────────────────────────────── 1. WordsSpace (1.4 s)
export const WORDS_SPACE_DUR = 1.4;
export const WordsSpace: React.FC<{ t: number }> = ({ t }) => {
  const push = mix(1.0, 1.06, clamp01(t / WORDS_SPACE_DUR)); // whole-space dolly
  const driftX = mix(0, -18, clamp01(t / WORDS_SPACE_DUR));
  // words: [text, x, y, base scale, blur, delay, serif]
  const words: { s: string; x: number; y: number; z: number; blur: number; a: number; serif: boolean }[] = [
    { s: "Ingen skabeloner.", x: 420, y: -170, z: 0.72, blur: 5, a: 0.0, serif: false },
    { s: "Ingen teknik.", x: -440, y: -60, z: 0.84, blur: 3, a: 0.08, serif: false },
    { s: "Bygget af AI.", x: 0, y: 80, z: 1, blur: 0, a: 0.15, serif: true },
  ];
  const orbK = ramp(t, 1.05, 0.35, OUT);
  const orbSize = mix(40, 1150, orbK);
  return (
    <AbsoluteFill style={{ background: DARK_BG, overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `translateX(${driftX}px) scale(${push})` }}>
        {/* glowing horizon */}
        <div style={{ position: "absolute", left: -200, right: -200, top: 760, height: 2, background: C.sageLight, opacity: 0.85,
          boxShadow: `0 0 12px 2px ${C.sageLight}, 0 0 60px 12px ${C.sage}aa, 0 0 180px 50px ${C.sage}55` }} />
        <div style={{ position: "absolute", left: -200, right: -200, top: 640, height: 260,
          background: `radial-gradient(ellipse 60% 50% at 50% 50%, ${C.sage}33 0%, transparent 70%)`, filter: "blur(20px)" }} />
        {/* words at depth */}
        {words.map((w, i) => {
          const life = clamp01((t - w.a) / (WORDS_SPACE_DUR - w.a));
          const sc = w.z * mix(0.94, 1.08, life); // drift toward camera
          const k = ramp(t, w.a, 0.5);
          return (
            <div key={i} style={{ position: "absolute", left: 960, top: 470, transform: `translate(-50%, -50%) translate(${w.x * mix(1, 1.06, life)}px, ${w.y}px) scale(${sc})`,
              whiteSpace: "nowrap", opacity: k * (w.serif ? 1 : 0.8), filter: `blur(${w.blur + mix(12, 0, k)}px)`,
              fontFamily: w.serif ? SERIF : SANS, fontWeight: w.serif ? 400 : 400, fontSize: w.serif ? 96 : 44,
              color: w.serif ? C.cream : C.sageLight, letterSpacing: w.serif ? "-0.01em" : "0.01em",
              textShadow: w.serif ? `0 0 40px ${C.sage}55` : undefined }}>
              {w.s}
            </div>
          );
        })}
      </AbsoluteFill>
      {/* sage orb bloom */}
      {orbK > 0 && (
        <div style={{ position: "absolute", left: 960, top: 540, width: orbSize, height: orbSize,
          transform: "translate(-50%, -50%)", borderRadius: "50%", opacity: mix(0.4, 1, orbK),
          background: `radial-gradient(circle, ${C.glow} 0%, ${C.sageLight} 30%, ${C.sage}cc 55%, ${C.sage}00 72%)`,
          filter: `blur(${mix(6, 24, orbK)}px)` }} />
      )}
    </AbsoluteFill>
  );
};

// ───────────────────────────────── 2. FlowCheck (1.1 s)
export const FLOW_CHECK_DUR = 1.1;
const Tick: React.FC<{ k: number }> = ({ k }) => (
  <svg width={56} height={56} viewBox="0 0 56 56" style={{ display: "block", transform: `scale(${mix(0.6, 1, k)})` }}>
    <circle cx={28} cy={28} r={28} fill={C.sage} />
    <path d="M17 29 L25 37 L40 20" fill="none" stroke={C.white} strokeWidth={4.5} strokeLinecap="round" strokeLinejoin="round"
      strokeDasharray={40} strokeDashoffset={40 * (1 - ramp(k, 0.3, 0.7))} />
  </svg>
);
const Arrow: React.FC<{ k: number }> = ({ k }) => (
  <svg width={90} height={24} viewBox="0 0 90 24" style={{ display: "block" }}>
    <path d="M4 12 L82 12 M72 4 L82 12 L72 20" fill="none" stroke={C.ink} strokeOpacity={0.55} strokeWidth={2}
      strokeLinecap="round" strokeLinejoin="round" strokeDasharray={110} strokeDashoffset={110 * (1 - k)} />
  </svg>
);
export const FlowCheck: React.FC<{ t: number }> = ({ t }) => {
  const drift = mix(0, -30, clamp01(t / FLOW_CHECK_DUR));
  const push = mix(1.0, 1.025, clamp01(t / FLOW_CHECK_DUR));
  const st = 0.18;
  const item = (i: number, node: React.ReactNode) => {
    const b = blurIn(t, 0.05 + i * st * 0.5, 0.35, 10);
    return <div style={{ ...b, display: "flex", alignItems: "center", transform: `translateY(${mix(10, 0, ramp(t, 0.05 + i * st * 0.5, 0.4))}px)` }}>{node}</div>;
  };
  const txt = (s: string) => <span style={{ fontFamily: SANS, fontWeight: 500, fontSize: 44, color: C.ink, whiteSpace: "nowrap" }}>{s}</span>;
  const ak = (i: number) => ramp(t, 0.05 + i * st * 0.5, 0.3, INOUT);
  return (
    <AbsoluteFill style={{ background: C.bg, overflow: "hidden" }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 75% 70% at 50% 50%, transparent 55%, rgba(26,22,20,0.10) 100%)" }} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", transform: `translateX(${drift}px) scale(${push})` }}>
        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", left: "8%", right: "8%", bottom: -46, height: 30, borderRadius: "50%",
            background: "rgba(26,22,20,0.10)", filter: "blur(18px)", opacity: ramp(t, 0.1, 0.6) }} />
          <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
            {item(0, txt("Byg den"))}
            {item(1, <Arrow k={ak(1)} />)}
            {item(2, <Tick k={ramp(t, 0.05 + 2 * st * 0.5, 0.4)} />)}
            {item(3, txt("Se den"))}
            {item(4, <Arrow k={ak(4)} />)}
            {item(5, <Tick k={ramp(t, 0.05 + 5 * st * 0.5, 0.4)} />)}
            {item(6, txt("Så køber du"))}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ───────────────────────────────── 3. Cards (1.3 s)
export const CARDS_DUR = 1.3;
const spring = (x: number) => {
  const k = clamp01(x);
  return 1 - Math.exp(-6 * k) * Math.cos(7 * k);
};
export const Cards: React.FC<{ t: number }> = ({ t }) => {
  const life = clamp01(t / CARDS_DUR);
  const rotY = mix(-16, -11, life);
  const rotX = mix(19, 16, life);
  const labels = ["Hjemmeside", "Domæne", "E-mail"];
  const blurs = [0, 2, 5]; // front sharp, others soft
  return (
    <AbsoluteFill style={{ background: DARK_BG, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 960, top: 620, width: 900, height: 500, transform: "translate(-50%, -50%)",
        background: `radial-gradient(ellipse 50% 50% at 50% 50%, ${C.sage}30 0%, transparent 70%)`, filter: "blur(30px)" }} />
      <AbsoluteFill style={{ perspective: 1600, perspectiveOrigin: "50% 45%", transform: `scale(${mix(1, 1.04, life)})` }}>
        <div style={{ position: "absolute", left: 960, top: 540, width: 0, height: 0, transformStyle: "preserve-3d",
          transform: `translateX(${mix(20, -20, life)}px) rotateX(${rotX}deg) rotateY(${rotY}deg)` }}>
          {labels.map((s, i) => {
            const a = i * 0.12;
            const p = spring((t - a) / 0.7);
            const o = ramp(t, a, 0.3);
            const z = -i * 120; // depth: card 0 front
            const y = (i - 1) * -150 + mix(140, 0, p);
            const bob = Math.sin((t + i * 0.7) * 2.2) * 4;
            return (
              <div key={s} style={{ position: "absolute", left: -310, top: -55, width: 620, height: 110, borderRadius: 22,
                border: "1px solid rgba(255,255,255,0.08)", background: "rgba(30,40,37,0.85)", boxSizing: "border-box",
                boxShadow: `0 30px 60px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.05)`,
                display: "flex", alignItems: "center", gap: 26, padding: "0 40px",
                opacity: o, filter: `blur(${blurs[i] + mix(8, 0, o)}px)`,
                transform: `translate3d(${i * 40}px, ${y + bob}px, ${z}px)` }}>
                <div style={{ width: 16, height: 16, borderRadius: 8, background: C.sage, boxShadow: `0 0 14px ${C.sage}` }} />
                <span style={{ fontFamily: SANS, fontWeight: 500, fontSize: 40, color: C.cream, whiteSpace: "nowrap" }}>{s}</span>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ───────────────────────────────── 4. EndCard (1.6 s)
export const END_CARD_DUR = 1.6;
export const EndCard: React.FC<{ t: number }> = ({ t }) => {
  const bloom = ramp(t, 0, 0.45, OUT);
  const push = mix(1.0, 1.03, clamp01(t / END_CARD_DUR));
  const bloomSize = mix(200, 3200, bloom);
  const wm = ramp(t, 0.25, 0.5);
  return (
    <AbsoluteFill style={{ background: C.night, overflow: "hidden" }}>
      {/* full gradient fades in under the bloom */}
      <AbsoluteFill style={{ opacity: ramp(t, 0.15, 0.4),
        background: `radial-gradient(ellipse 90% 85% at 50% 20%, ${C.sageTint} 0%, ${C.sage} 50%, ${C.sageDark} 100%)` }} />
      {/* bright bloom from centre */}
      <div style={{ position: "absolute", left: 960, top: 540, width: bloomSize, height: bloomSize, borderRadius: "50%",
        transform: "translate(-50%, -50%)", opacity: mix(1, 0, ramp(t, 0.3, 0.5)),
        background: `radial-gradient(circle, ${C.white} 0%, ${C.glow} 25%, ${C.sage}aa 55%, ${C.sage}00 72%)`, filter: "blur(30px)" }} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", transform: `scale(${push})` }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ opacity: wm, filter: `blur(${mix(16, 0, wm)}px)`, transform: `scale(${mix(1.04, 1.0, ramp(t, 0.25, 1.2))})` }}>
            <Wordmark w={760} />
          </div>
          <div style={{ ...blurIn(t, 0.7, 0.4, 12), marginTop: 44, fontFamily: SANS, fontWeight: 400, fontSize: 34, color: C.cream, whiteSpace: "nowrap" }}>
            <span style={{ opacity: 0.9 }}>Hjemmeside og hosting, samlet ét sted.</span>
          </div>
          <div style={{ ...blurIn(t, 1.0, 0.4, 10), marginTop: 26, fontFamily: SANS, fontWeight: 500, fontSize: 26, color: C.cream,
            letterSpacing: "0.06em", whiteSpace: "nowrap" }}>
            creoble.dk
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
