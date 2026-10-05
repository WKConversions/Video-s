// The film's interface layer: captions (built word by word, grey → white, as in Karl's reference), the GTM app's lead
// chip, and the small parts the cards share. Type scale for anything read in the world: 36 px and up (40 for the line's
// subject); mono only for eyebrow texture. Everything is a function of the frame.
import React from "react";
import { CAPTIONS, T, WORD_STEP } from "./clock";
import { ARRIVE, C, DEPART, F, R, SHADOW, clamp01, lerp } from "./lib";

export const tk = (g: number, a: number, dur: number, e: (t: number) => number = ARRIVE) => e(clamp01((g / 30 - a) / dur));
/** Opacity for an arrival: a linear 5-frame ramp, kept apart from the move's curve so nothing pops in one frame. */
export const fadeIn = (g: number, a: number, frames = 5) => clamp01(((g / 30 - a) * 30) / frames);
export const mix = (a: string, b: string, k: number) => {
  const p = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const pa = p(a), pb = p(b);
  return `rgb(${pa.map((v, i) => Math.round(lerp(v, pb[i], k))).join(",")})`;
};

// ---------- captions ----------
const Words: React.FC<{ g: number; text: string; from: number; keys: string[]; size: number; color?: string }> = ({ g, text, from, keys, size, color = C.ink }) => {
  const t = g / 30;
  return (
    <div style={{ display: "flex", gap: "0.24em", fontFamily: F.display, fontWeight: 600, fontSize: size, lineHeight: 1.08, letterSpacing: "-0.03em", whiteSpace: "nowrap" }}>
      {text.split(" ").map((w, i) => {
        const tw = from + i * WORD_STEP;
        const appear = clamp01((t - (tw - 0.1)) / 0.1);
        const bright = ARRIVE(clamp01((t - tw) / 0.22));
        const key = keys.includes(w);
        return (
          <span key={i} style={{ display: "inline-block", opacity: appear * lerp(0.3, 1, bright), transform: `translateY(${(1 - appear) * 10}px)`, color: key ? mix(C.ink, C.orange, bright) : color }}>{w}</span>
        );
      })}
    </div>
  );
};
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
        const starts = c.lines.map((ln) => { const s = c.at + i * WORD_STEP; i += ln.split(" ").length; return s; });
        return (
          <div key={c.id} data-probe={`cap-${c.id}`} style={{ position: "absolute", left: 120, bottom: 108, opacity: 1 - o, transform: `translateY(${-16 * o}px)`, willChange: "transform" }}>
            {c.lines.map((ln, li) => <Words key={li} g={g} text={ln} from={starts[li]} keys={c.key} size={68} />)}
            {c.sub && <div style={{ marginTop: 6 }}><Words g={g} text={c.sub} from={c.at + i * WORD_STEP} keys={[]} size={46} color={C.ink2} /></div>}
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
  <span style={{ display: "inline-flex", alignItems: "center", gap: size * 0.4, height: size * 1.7, padding: `0 ${size * 0.62}px`, borderRadius: 999, whiteSpace: "nowrap",
    fontFamily: F.ui, fontWeight: 600, fontSize: size, letterSpacing: "-0.01em",
    background: tone === "green" ? C.greenSoft : C.n2, color: tone === "green" ? C.green : C.ink, border: `1px solid ${tone === "green" ? "rgba(75,198,128,0.3)" : C.ruleStrong}`, ...style }}>
    <Dot tone={tone} size={size * 0.42} />{children}
  </span>
);
/** Mono for eyebrow texture only (caps); lowercase for URLs. */
export const Mono: React.FC<{ size?: number; color?: string; caps?: boolean; children: React.ReactNode; style?: React.CSSProperties }> = ({ size = 20, color = C.ink3, caps = true, children, style }) => (
  <span style={{ fontFamily: F.mono, fontSize: size, fontWeight: 500, letterSpacing: caps ? "0.06em" : "0", textTransform: caps ? "uppercase" : "none", color, whiteSpace: "nowrap", ...style }}>{children}</span>
);
export const Label: React.FC<{ size?: number; color?: string; weight?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ size = 24, color = C.ink3, weight = 500, children, style }) => (
  <span style={{ fontFamily: F.ui, fontSize: size, fontWeight: weight, color, whiteSpace: "nowrap", ...style }}>{children}</span>
);
export const Avatar: React.FC<{ initials: string; size?: number }> = ({ initials, size = 60 }) => (
  <span style={{ width: size, height: size, borderRadius: 99, flex: "none", display: "inline-flex", alignItems: "center", justifyContent: "center", background: C.n3,
    border: `1px solid ${C.ruleStrong}`, fontFamily: F.ui, fontWeight: 600, fontSize: size * 0.36, color: C.ink, letterSpacing: "0.02em" }}>{initials}</span>
);

/** A slot whose content changes by rolling: the old state leaves upward first, then the new one rises in. */
export const Swap: React.FC<{ g: number; states: [number, React.ReactNode][]; h: number; dur?: number; name?: string; style?: React.CSSProperties }> = ({ g, states, h, dur = 0.32, name = "swap", style }) => {
  const t = g / 30;
  let cur = -1;
  states.forEach(([at], n) => { if (t >= at) cur = n; });
  return (
    <div style={{ position: "relative", height: h, overflow: "hidden", ...style }}>
      {states.map(([at, node], n) => {
        if (n !== cur && n !== cur - 1) return null;
        const start = n === 0 ? at : at + dur * 0.45;
        const kIn = tk(g, start, dur);
        const next = states[n + 1];
        const kOut = next ? tk(g, next[0], dur * 0.45, DEPART) : 0;
        if (n === cur - 1 && kOut >= 1) return null;
        return (
          <div key={n} data-probe={`${name}-${n}`} style={{ position: "absolute", left: 0, right: 0, top: 0, height: h, display: "flex", alignItems: "center",
            transform: `translateY(${(1 - kIn) * h * 0.6 - kOut * h * 0.6}px)`, opacity: fadeIn(g, start, 4) * (1 - kOut) }}>{node}</div>
        );
      })}
    </div>
  );
};

// ---------- the GTM app's lead chip (top left) ----------
const fmt = (n: number) => Math.round(n).toLocaleString("en-GB");
const Person: React.FC<{ ini: string; name: string; role: string; size?: number }> = ({ ini, name, role, size = 1 }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 18 * size }}>
    <Avatar initials={ini} size={64 * size} />
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <span style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 40 * size, color: C.ink, letterSpacing: "-0.015em", lineHeight: 1.1 }}>{name}</span>
      <span style={{ fontFamily: F.ui, fontWeight: 500, fontSize: 28 * size, color: C.ink2, lineHeight: 1.2 }}>{role}</span>
    </div>
  </div>
);
export const Chip: React.FC<{ g: number; leads: number }> = ({ g, leads }) => {
  const kIn = tk(g, T.s("chip"), 0.5);
  const kOut = tk(g, T.s("pull") + 0.4, 0.4, DEPART);
  if (kIn <= 0 || kOut >= 1) return null;
  const sofia = T.s("sofia"), marta = T.s("marta");
  // the chip steps back while a card carries the beat (it is the context, not the subject)
  const cardUp = clamp01(tk(g, T.s("card"), 0.4) - tk(g, T.s("fold"), 0.4)) + clamp01(tk(g, T.s("bubble"), 0.4) - tk(g, T.s("weekOut"), 0.4));
  const dim = 1 - 0.38 * Math.min(1, cardUp);
  // from Marta's reply on, the chip holds two leads: Marta on top, Sofia below, still in outreach
  const stack = tk(g, marta, 0.5);
  return (
    <div data-probe="chip" style={{ position: "absolute", left: 110, top: 86, width: 720, padding: "20px 26px 22px", borderRadius: 20, border: `1px solid ${C.rule}`,
      boxShadow: `${SHADOW.float}, ${SHADOW.edge}`, background: mix(C.n1, C.night, 1 - dim), opacity: fadeIn(g, T.s("chip"), 6) * (1 - kOut), transform: `translateY(${(1 - kIn) * -18 - kOut * 14}px)`, willChange: "transform" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, gap: 16 }}>
        <Swap g={g} h={40} name="url" style={{ flex: 1, opacity: dim }} states={[
          [T.s("chip"), <span key="u1" style={{ background: C.n2, borderRadius: 999, padding: "5px 16px" }}><Mono caps={false} size={22} color={C.ink2}>gtm.clearscaler.com/leads</Mono></span>],
          [marta, <span key="u2" style={{ background: C.n2, borderRadius: 999, padding: "5px 16px" }}><Mono caps={false} size={22} color={C.ink2}>gtm.clearscaler.com/inbox</Mono></span>],
        ]} />
        <span style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 28, color: C.ink, border: `1px solid ${C.ruleStrong}`, borderRadius: 999, padding: "4px 16px", whiteSpace: "nowrap" }}>Demo workspace</span>
      </div>
      <Swap g={g} h={86} name="who" style={{ opacity: dim }} states={[
        [T.s("chip"), (
          <div key="l" style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <span style={{ fontFamily: F.display, fontWeight: 600, fontSize: 52, color: C.ink, letterSpacing: "-0.03em", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{fmt(leads)} leads</span>
            <span style={{ fontFamily: F.ui, fontWeight: 500, fontSize: 28, color: C.ink2 }}>from first research to booked meeting</span>
          </div>
        )],
        [sofia, <Person key="s" ini="SB" name="Sofia Berglund" role="Head of Growth · Fernhollow Freight" />],
        [marta, <Person key="m" ini="MV" name="Marta Vogel" role="Commercial Director · Quillmoor Group" />],
      ]} />
      <Swap g={g} h={64} name="status" style={{ marginTop: 14, opacity: dim }} states={[
        [0, <span key="0" />],
        [sofia + 0.15, <Pill key="1" tone="orange" size={34}>Scoring</Pill>],
        [T.s("merge") + 0.6, <Pill key="2" tone="green" size={34}>Strong fit · 87 / 135</Pill>],
        [T.s("draft") + 0.55, <Pill key="3" tone="orange" size={34}>Writing email</Pill>],
        [T.s("qc"), <Pill key="4" tone="orange" size={34}>Quality check</Pill>],
        [T.s("approve"), <Pill key="5" tone="ring" size={34}>Awaiting approval</Pill>],
        [T.s("click") + 0.05, <Pill key="6" tone="ring" size={34}>Approved</Pill>],
        [T.s("send"), <Pill key="7" tone="orange" size={34}>In outreach · sent from your mailbox</Pill>],
        [marta, <Pill key="8" tone="green" size={34}>Interested</Pill>],
        [T.s("booked") + 0.1, <Pill key="9" tone="green" size={34}>Meeting booked · Thu 10:00</Pill>],
      ]} />
      {/* Sofia stays in the list, below, still in outreach: one pipeline with many leads */}
      {stack > 0 && (
        <div style={{ marginTop: 16 * stack, height: 70 * stack, overflow: "hidden", opacity: fadeIn(g, marta + 0.15, 6) * 0.6 * dim, borderTop: `1px solid ${C.rule}`, paddingTop: 14 * stack,
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <Avatar initials="SB" size={44} />
            <span style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 30, color: C.ink }}>Sofia Berglund</span>
          </div>
          <Pill tone="orange" size={24}>In outreach</Pill>
        </div>
      )}
    </div>
  );
};
export { R };
