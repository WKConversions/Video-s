// The film's interface layer: captions (built word by word, grey → white, as in Karl's reference), the GTM app's lead
// chip, and the small parts the cards share. Everything is a function of the frame.
import React from "react";
import { CAPTIONS, T, WORD_STEP } from "./clock";
import { ARRIVE, C, DEPART, F, R, SHADOW, clamp01, lerp } from "./lib";

export const tk = (g: number, a: number, dur: number, e: (t: number) => number = ARRIVE) => e(clamp01((g / 30 - a) / dur));
export const mix = (a: string, b: string, k: number) => {
  const p = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const pa = p(a), pb = p(b);
  return `rgb(${pa.map((v, i) => Math.round(lerp(v, pb[i], k))).join(",")})`;
};

// ---------- captions ----------
export const Captions: React.FC<{ g: number }> = ({ g }) => {
  const t = g / 30;
  return (
    <>
      {CAPTIONS.map((c, n) => {
        // a caption has left its slot before the next one's first word appears: two lines never overlap
        const next = CAPTIONS[n + 1];
        const out = next ? Math.min(c.out, next.at - 0.1 - 0.26) : c.out;
        if (t < c.at - 0.2 || t > out + 0.4) return null;
        const o = tk(g, out, 0.24, DEPART);
        let i = 0;
        return (
          <div key={c.id} data-probe={`cap-${c.id}`} style={{ position: "absolute", left: 120, bottom: 92, opacity: 1 - o, transform: `translateY(${-16 * o}px)`, willChange: "transform" }}>
            {c.lines.map((ln, li) => (
              <div key={li} style={{ display: "flex", gap: "0.24em", fontFamily: F.display, fontWeight: 600, fontSize: 64, lineHeight: 1.08, letterSpacing: "-0.03em", whiteSpace: "nowrap" }}>
                {ln.split(" ").map((w, wi) => {
                  const tw = c.at + i++ * WORD_STEP;
                  const appear = clamp01((t - (tw - 0.1)) / 0.1);
                  const bright = ARRIVE(clamp01((t - tw) / 0.24));
                  const key = c.key.includes(w);
                  return (
                    <span key={wi} style={{ display: "inline-block", opacity: appear * lerp(0.3, 1, bright), transform: `translateY(${(1 - appear) * 10}px)`,
                      color: key ? mix(C.ink, C.orange, bright) : C.ink }}>{w}</span>
                  );
                })}
              </div>
            ))}
            {c.note && (
              <div style={{ marginTop: 14, fontFamily: F.mono, fontSize: 26, letterSpacing: "0.04em", textTransform: "uppercase", color: C.ink3, opacity: tk(g, c.at + 0.5, 0.4) }}>{c.note}</div>
            )}
          </div>
        );
      })}
    </>
  );
};

// ---------- small parts ----------
export const Dot: React.FC<{ tone: "orange" | "green" | "ring" | "grey"; size?: number }> = ({ tone, size = 11 }) => (
  <span style={{ display: "inline-block", width: size, height: size, borderRadius: 99, flex: "none",
    background: tone === "orange" ? C.orange : tone === "green" ? C.green : tone === "grey" ? C.ink3 : "transparent",
    border: tone === "ring" ? `2px solid ${C.ink2}` : undefined, boxSizing: "border-box" }} />
);
export const Check: React.FC<{ size?: number; color?: string }> = ({ size = 22, color = C.green }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" style={{ flex: "none" }}>
    <circle cx="12" cy="12" r="10" /><path d="m8.5 12.2 2.4 2.4 4.6-4.8" />
  </svg>
);
export const Pill: React.FC<{ tone: "orange" | "green" | "ring" | "grey"; size?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ tone, size = 26, children, style }) => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: size * 0.4, height: size * 1.7, padding: `0 ${size * 0.6}px`, borderRadius: 999, whiteSpace: "nowrap",
    fontFamily: F.ui, fontWeight: 600, fontSize: size, letterSpacing: "-0.01em",
    background: tone === "green" ? C.greenSoft : C.n2, color: tone === "green" ? C.green : C.ink, border: `1px solid ${tone === "green" ? "rgba(75,198,128,0.28)" : C.rule}`, ...style }}>
    {tone !== "green" || true ? <Dot tone={tone} size={size * 0.42} /> : null}{children}
  </span>
);
export const Mono: React.FC<{ size?: number; color?: string; children: React.ReactNode; style?: React.CSSProperties }> = ({ size = 20, color = C.ink3, children, style }) => (
  <span style={{ fontFamily: F.mono, fontSize: size, fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", color, whiteSpace: "nowrap", ...style }}>{children}</span>
);
export const Avatar: React.FC<{ initials: string; size?: number }> = ({ initials, size = 60 }) => (
  <span style={{ width: size, height: size, borderRadius: 99, flex: "none", display: "inline-flex", alignItems: "center", justifyContent: "center", background: C.n3,
    border: `1px solid ${C.ruleStrong}`, fontFamily: F.ui, fontWeight: 600, fontSize: size * 0.36, color: C.ink, letterSpacing: "0.02em" }}>{initials}</span>
);

/** A slot whose content changes by rolling: the old state leaves upward, the new one rises in (a status flipping). */
export const Swap: React.FC<{ g: number; states: [number, React.ReactNode][]; h: number; dur?: number; name?: string; style?: React.CSSProperties }> = ({ g, states, h, dur = 0.32, name = "swap", style }) => {
  const t = g / 30;
  let cur = -1;
  states.forEach(([at], n) => { if (t >= at) cur = n; });
  return (
    <div style={{ position: "relative", height: h, overflow: "hidden", ...style }}>
      {states.map(([at, node], n) => {
        if (n !== cur && n !== cur - 1) return null;
        const kIn = n === 0 ? tk(g, at, dur) : tk(g, at + dur * 0.5, dur);
        const next = states[n + 1];
        const kOut = next ? tk(g, next[0], dur * 0.5, DEPART) : 0;
        if (n === cur - 1 && kOut >= 1) return null;
        return (
          <div key={n} data-probe={`${name}-${n}`} style={{ position: "absolute", left: 0, right: 0, top: 0, height: h, display: "flex", alignItems: "center",
            transform: `translateY(${(1 - kIn) * h * 0.6 - kOut * h * 0.6}px)`, opacity: kIn * (1 - kOut) }}>{node}</div>
        );
      })}
    </div>
  );
};

// ---------- the GTM app's lead chip (top left) ----------
const fmt = (n: number) => Math.round(n).toLocaleString("en-GB");
export const Chip: React.FC<{ g: number; leads: number }> = ({ g, leads }) => {
  const kIn = tk(g, T.s("chip"), 0.5);
  const kOut = tk(g, T.s("stat"), 0.35, DEPART);
  if (kIn <= 0 || kOut >= 1) return null;
  const sofia = T.s("sofia"), marta = T.s("marta"), summary = T.s("summary");
  const person = (ini: string, name: string, role: string) => (
    <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
      <Avatar initials={ini} size={62} />
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <span style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 34, color: C.ink, letterSpacing: "-0.015em", lineHeight: 1.1 }}>{name}</span>
        <span style={{ fontFamily: F.ui, fontWeight: 500, fontSize: 24, color: C.ink2, lineHeight: 1.2 }}>{role}</span>
      </div>
    </div>
  );
  return (
    <div data-probe="chip" style={{ position: "absolute", left: 120, top: 92, width: 660, padding: "20px 26px 24px", borderRadius: 18, background: C.n1, border: `1px solid ${C.rule}`,
      boxShadow: `${SHADOW.float}, ${SHADOW.edge}`, opacity: kIn * (1 - kOut), transform: `translateY(${(1 - kIn) * -18 - kOut * 14}px)`, willChange: "transform" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <Swap g={g} h={26} name="url" style={{ flex: 1 }} states={[
          [T.s("chip"), <Mono key="u1">gtm.clearscaler.com/leads</Mono>],
          [marta, <Mono key="u2">gtm.clearscaler.com/inbox</Mono>],
          [summary, <Mono key="u3">Email · weekly summary</Mono>],
        ]} />
        <span style={{ fontFamily: F.ui, fontWeight: 500, fontSize: 19, color: C.ink2, border: `1px solid ${C.ruleStrong}`, borderRadius: 999, padding: "3px 12px", whiteSpace: "nowrap" }}>Demo workspace</span>
      </div>
      <Swap g={g} h={74} name="who" states={[
        [T.s("chip"), (
          <div key="l" style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <span style={{ fontFamily: F.display, fontWeight: 600, fontSize: 44, color: C.ink, letterSpacing: "-0.03em", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{fmt(leads)} leads</span>
            <span style={{ fontFamily: F.ui, fontWeight: 500, fontSize: 22, color: C.ink2 }}>from first research to booked meeting</span>
          </div>
        )],
        [sofia, person("SB", "Sofia Berglund", "Head of Growth · Fernhollow Freight")],
        [marta, person("MV", "Marta Vogel", "Commercial Director · Quillmoor Group")],
        [summary, (
          <div key="s" style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <span style={{ fontFamily: F.display, fontWeight: 600, fontSize: 44, color: C.ink, letterSpacing: "-0.03em", lineHeight: 1 }}>3 meetings booked</span>
            <span style={{ fontFamily: F.ui, fontWeight: 500, fontSize: 22, color: C.ink2 }}>Mon 21 Sep · 438 emails sent · 27 replies</span>
          </div>
        )],
      ]} />
      <Swap g={g} h={52} name="status" style={{ marginTop: 16 }} states={[
        [0, <span key="0" />],
        [sofia + 0.15, <Pill key="1" tone="orange" size={26}>Scoring</Pill>],
        [T.s("merge") + 0.45, <Pill key="2" tone="green" size={26}>Strong fit · 87 / 135</Pill>],
        [T.s("draft") + 0.1, <Pill key="3" tone="orange" size={26}>Writing email</Pill>],
        [T.s("approve"), <Pill key="4" tone="ring" size={26}>Awaiting approval</Pill>],
        [T.s("click") + 0.05, <Pill key="5" tone="green" size={26}>Approved</Pill>],
        [T.s("send"), <Pill key="6" tone="orange" size={26}>In outreach · sent from your mailbox</Pill>],
        [marta, <Pill key="7" tone="green" size={26}>Interested</Pill>],
        [T.s("booked") + 0.1, <Pill key="8" tone="green" size={26}>Meeting booked · Thu 10:00</Pill>],
        [summary, <span key="9" />],
      ]} />
    </div>
  );
};
export { R };
