// Scene C — solution (s2 → sC): "Meet Moviqly. Describe your idea, and Moviqly reads your website, understands your
// business, writes the story, designs the look and checks every fact." The glow rises and the logo builds big; it moves
// up and the landing prompt box types a brief; on send the box becomes the user's bubble, the logo lifts away and the
// activity card arrives (the thread, its steps ticking), and one big card per phrase rises through the feed on its word:
// the lumo.app site scanned, "Understood Lumo", the story writing itself, the art direction, the facts checked.
// Lumo / lumo.app is the user's own (fictional) product. Clears its stage upward by sC; D takes over.
import React from "react";
import {
  ActivityCard, ARRIVE, C, clamp01, DEPART, f, FONT, Glow, GRAD, Ico, k, LIN, mix, MMark, MOVE, POP, PromptBox, SCENES,
  SHADOW, SHADOW_BIG, Step, typed, UserBubble, Wordmark,
} from "../shared";

const LUMO = { bg: "#2440FF", deep: "#1428C8", accent: "#7FF0FF" };
const BRIEF = "A launch film for lumo.app";
// layout: the thread (bubble + activity card) on the left, the phrase cards on the right
const ACT = { x: 110, y: 395, w: 560, size: 26 };
const BUB = { right: 670, y: 315 };
const CARD = { x: 790, y: 220, w: 1000, h: 640 };
// the lockup: mark height H, wordmark 0.9 H after a 0.3 H gap (as Logo); W = the wordmark's measured width
const LG = { H: 200, gap: 60, W: 598 };

/* ---------- small local pieces ---------- */
// a label shifted by s seconds ("w:look", -0.08 -> "w:look-0.08")
const lab = (base: string, s: number) => `${base}${s < 0 ? "-" : "+"}${Math.abs(s).toFixed(3)}`;
const pop = (g: number, at: string, d = 0.32) => k(g, at, d, POP);
const Chip: React.FC<{ p: number; children: React.ReactNode; size?: number; style?: React.CSSProperties }> = ({ p, children, size = 26, style }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: size * 0.45, padding: `${size * 0.45}px ${size * 0.8}px`, borderRadius: 999, background: C.white,
    border: `1.5px solid ${C.line}`, boxShadow: SHADOW, fontFamily: FONT, fontWeight: 600, fontSize: size, color: C.ink, whiteSpace: "nowrap", flex: "none",
    transform: `scale(${Math.max(0, p)})`, opacity: clamp01(p * 3), ...style }}>{children}</div>
);
const Check: React.FC<{ p: number; s?: number }> = ({ p, s = 44 }) => (
  <div style={{ width: s, height: s, borderRadius: "50%", background: C.violet, display: "flex", alignItems: "center", justifyContent: "center", flex: "none",
    transform: `scale(${Math.max(0, p)})`, opacity: clamp01(p * 3), boxShadow: "0 6px 14px -6px rgba(124,58,237,0.7)" }}><Ico n="check" s={s * 0.68} c={C.white} w={3} /></div>
);
const Badge: React.FC<{ n: string }> = ({ n }) => (
  <div style={{ width: 60, height: 60, borderRadius: "50%", background: C.lavender, display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}><Ico n={n} s={32} c={C.violet} w={2.4} /></div>
);
const Head: React.FC<{ icon: string; t: string; right?: React.ReactNode }> = ({ icon, t, right }) => (
  <div style={{ position: "absolute", left: 56, right: 56, top: 48, display: "flex", alignItems: "center", gap: 20 }}>
    <Badge n={icon} /><div style={{ fontWeight: 700, fontSize: 44, letterSpacing: "-0.03em", color: C.ink }}>{t}</div><div style={{ flex: 1 }} />{right}
  </div>
);
const LumoMark: React.FC<{ s: number }> = ({ s }) => (
  <div style={{ width: s, height: s, borderRadius: "50%", background: C.white, display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
    <div style={{ width: s * 0.48, height: s * 0.48, borderRadius: "50%", background: LUMO.bg }} />
  </div>
);
const Swatch: React.FC<{ c: string; s?: number }> = ({ c, s = 26 }) => <div style={{ width: s, height: s, borderRadius: "50%", background: c, boxShadow: `inset 0 0 0 1.5px rgba(38,35,44,0.12)`, flex: "none" }} />;

// A phrase card in the feed: rises in from below on its word, leaves upward as the next one arrives.
const Panel: React.FC<{ g: number; inAt: string; outAt?: string; children: React.ReactNode }> = ({ g, inAt, outAt, children }) => {
  const i = k(g, inAt, 0.55), o = outAt ? k(g, outAt, 0.42, MOVE) : 0;
  if (i <= 0 || o >= 1) return null;
  const drift = 80 - (g - f(inAt)) * 3.4; // the feed keeps scrolling gently while the card works
  return (
    <div style={{ position: "absolute", left: CARD.x, top: CARD.y, width: CARD.w, height: CARD.h, background: C.white, borderRadius: 26, border: `1px solid ${C.line}`,
      boxShadow: SHADOW_BIG, overflow: "hidden", boxSizing: "border-box", fontFamily: FONT, opacity: clamp01(i * 2.5) * (1 - clamp01(o * 1.7)),
      transform: `translateY(${(1 - i) * 460 + drift - o * 440}px) scale(${1 - 0.08 * o})` }}>{children}</div>
  );
};

/* ---------- 1. reads your website: the lumo.app site, scanned by a light sweep; what it finds pops into the tray ---------- */
const PAGE = { top: 64, h: 400 };
const WebCard: React.FC<{ g: number }> = ({ g }) => {
  const sp = k(g, "w:reads+0.15", 0.85, MOVE), lineY = PAGE.top + sp * PAGE.h;
  const box = (th: number) => k(g, lab("w:reads", 0.15 + th * 0.75), 0.25, ARRIVE);
  const det: [number, number, number, number, number][] = [[36, 96, 500, 150, 0.25], [36, 302, 196, 64, 0.62], [612, 54, 330, 346, 0.15]];
  const chips = [pop(g, "w:reads+0.47"), pop(g, "w:reads+0.55"), pop(g, "w:reads+0.63"), pop(g, "w:reads+0.8")];
  return (
    <>
      {/* browser chrome */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: PAGE.top, background: "#F4F2F7", display: "flex", alignItems: "center", gap: 10, padding: "0 24px", boxSizing: "border-box" }}>
        {[0, 1, 2].map((i) => <div key={i} style={{ width: 14, height: 14, borderRadius: "50%", background: "#DDD8E3" }} />)}
        <div style={{ marginLeft: 26, height: 40, padding: "0 20px", borderRadius: 20, background: C.white, border: `1px solid ${C.line}`, display: "flex", alignItems: "center", gap: 10, fontSize: 23, fontWeight: 500, color: C.ink }}>
          <Ico n="globe" s={22} c={C.muted} />lumo.app
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 22, fontWeight: 600, color: C.violet, opacity: sp > 0 && sp < 1 ? 1 : sp >= 1 ? 0.0 : 0 }}>Reading…</div>
      </div>
      {/* the site */}
      <div style={{ position: "absolute", left: 0, right: 0, top: PAGE.top, height: PAGE.h, background: LUMO.bg, overflow: "hidden", color: C.white }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(255,255,255,0.16) 2px, transparent 2.6px)", backgroundSize: "26px 26px" }} />
        <div style={{ position: "absolute", left: 48, top: 26, display: "flex", alignItems: "center", gap: 12 }}><LumoMark s={36} /><div style={{ fontWeight: 700, fontSize: 32, letterSpacing: "-0.05em" }}>lumo</div></div>
        <div style={{ position: "absolute", left: 300, top: 32, display: "flex", gap: 30, fontSize: 22, fontWeight: 500, opacity: 0.85 }}><span>Product</span><span>Teams</span><span>Stories</span></div>
        <div style={{ position: "absolute", left: 48, top: 104, fontWeight: 700, fontSize: 66, letterSpacing: "-0.045em", lineHeight: 1.02 }}>Plan your week,<br /><span style={{ color: LUMO.accent }}>together.</span></div>
        <div style={{ position: "absolute", left: 48, top: 258, fontSize: 26, fontWeight: 500, opacity: 0.88 }}>The planner for small teams.</div>
        <div style={{ position: "absolute", left: 48, top: 310, padding: "12px 28px", borderRadius: 999, background: C.white, color: LUMO.bg, fontWeight: 700, fontSize: 24 }}>Get Lumo</div>
        <div style={{ position: "absolute", left: 632, top: 70, width: 290, height: 370, borderRadius: 26, background: C.white, boxShadow: "0 20px 40px rgba(0,0,0,0.25)", padding: 22, boxSizing: "border-box", display: "grid", gap: 14, alignContent: "start" }}>
          <div style={{ height: 20, width: 120, borderRadius: 6, background: "#DCE2FF" }} />
          {[0, 1, 2, 3].map((j) => <div key={j} style={{ height: 50, borderRadius: 12, background: j === 1 ? LUMO.accent : "#EEF1FF", width: `${100 - j * 10}%` }} />)}
        </div>
        {/* what the scan detected */}
        {det.map(([x, y, w, h, th], i) => { const q = box(th); return q > 0 && <div key={i} style={{ position: "absolute", left: x - 8, top: y - 8, width: w + 16, height: h + 16, borderRadius: 14, border: `2.5px solid ${LUMO.accent}`, opacity: q * 0.95, transform: `scale(${1.06 - 0.06 * q})` }} />; })}
        {/* the light sweep */}
        {sp > 0 && sp < 1 && <>
          <div style={{ position: "absolute", left: 0, right: 0, top: lineY - PAGE.top - 150, height: 150, background: "linear-gradient(180deg, rgba(127,240,255,0) 0%, rgba(127,240,255,0.32) 100%)" }} />
          <div style={{ position: "absolute", left: 0, right: 0, top: lineY - PAGE.top - 2, height: 5, background: GRAD, boxShadow: "0 0 22px 6px rgba(127,240,255,0.85)" }} />
        </>}
      </div>
      {/* the tray: what Moviqly found */}
      <div style={{ position: "absolute", left: 0, right: 0, top: PAGE.top + PAGE.h, bottom: 0, background: "#FBFAF8", borderTop: `1px solid ${C.line}` }}>
        <div style={{ position: "absolute", left: 44, top: 24, display: "flex", alignItems: "center", gap: 10, fontSize: 24, fontWeight: 500, color: C.muted }}><Ico n="spark" s={22} c={C.violet} fill={C.violet} w={1} />Found on lumo.app</div>
        <div style={{ position: "absolute", left: 40, top: 76, display: "flex", gap: 16 }}>
          <Chip p={chips[0]}><Swatch c={LUMO.bg} />#2440FF</Chip>
          <Chip p={chips[1]}><Swatch c={LUMO.accent} />#7FF0FF</Chip>
          <Chip p={chips[2]}><span style={{ fontWeight: 700, fontSize: 30, letterSpacing: "-0.04em" }}>Aa</span>Lumo Sans</Chip>
          <Chip p={chips[3]}><Ico n="layers" s={26} c={C.violet} />6 sections</Chip>
        </div>
      </div>
    </>
  );
};

/* ---------- 2. understands your business ---------- */
const UnderstoodCard: React.FC<{ g: number }> = ({ g }) => {
  const line = typed(g, "w:understands+0.25", "A planner for small teams", 46);
  const tile = k(g, "w:understands", 0.5);
  const ch = [pop(g, "w:business-0.08"), pop(g, "w:business+0.06"), pop(g, "w:business+0.2")];
  return (
    <>
      <div style={{ position: "absolute", left: 56, top: 60, display: "flex", alignItems: "center", gap: 20 }}>
        <Check p={pop(g, "w:understands+0.1")} s={64} /><div style={{ fontWeight: 700, fontSize: 56, letterSpacing: "-0.035em", color: C.ink }}>Understood Lumo</div>
      </div>
      <div style={{ position: "absolute", left: 56, top: 196, display: "flex", alignItems: "center", gap: 44 }}>
        <div style={{ width: 236, height: 236, borderRadius: 54, background: LUMO.bg, display: "flex", alignItems: "center", justifyContent: "center", flex: "none",
          transform: `scale(${0.7 + 0.3 * tile}) rotate(${(1 - tile) * -8}deg)`, opacity: tile, boxShadow: "0 24px 40px -18px rgba(36,64,255,0.7)" }}><LumoMark s={116} /></div>
        <div>
          <div style={{ fontWeight: 600, fontSize: 23, letterSpacing: "0.12em", color: C.soft }}>THE BUSINESS</div>
          <div style={{ fontWeight: 700, fontSize: 54, letterSpacing: "-0.035em", color: C.ink, marginTop: 12, minHeight: 64, whiteSpace: "nowrap" }}>
            {line}<span style={{ display: "inline-block", width: 3, height: 46, marginLeft: 4, verticalAlign: "-6px", background: C.blue, opacity: line.length < 25 ? 1 : 0 }} />
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 56, top: 490, display: "flex", gap: 18 }}>
        <Chip p={ch[0]} size={30}><Ico n="calendar" s={30} c={C.violet} />Planner app</Chip>
        <Chip p={ch[1]} size={30}><Ico n="users" s={30} c={C.violet} />Small teams</Chip>
        <Chip p={ch[2]} size={30}><Ico n="spark" s={28} c={C.violet} />Friendly, upbeat</Chip>
      </div>
    </>
  );
};

/* ---------- 3. writes the story: six beats writing themselves ---------- */
const StoryCard: React.FC<{ g: number }> = ({ g }) => {
  const at = (i: number) => lab("w:writes", -0.05 + i * 0.15);
  let active = -1;
  return (
    <>
      <Head icon="pen" t="The story" right={<div style={{ fontSize: 26, fontWeight: 500, color: C.muted }}>6 scenes · 25 s</div>} />
      <div style={{ position: "absolute", left: 56, right: 56, top: 140, display: "grid", gap: 14 }}>
        {SCENES.map((s, i) => {
          const r = k(g, at(i), 0.3), txt = typed(g, at(i), s.copy, 80);
          if (r > 0 && txt.length < s.copy.length) active = i;
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 20, height: 62, opacity: clamp01(r * 3), transform: `translateX(${(1 - r) * 40}px)` }}>
              <div style={{ width: 46, height: 46, borderRadius: "50%", background: i === active ? C.violet : C.mist, color: i === active ? C.white : C.muted, fontWeight: 700, fontSize: 23, display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>{i + 1}</div>
              <div style={{ fontWeight: 600, fontSize: 23, letterSpacing: "0.08em", color: C.soft, width: 228, flex: "none", textTransform: "uppercase", whiteSpace: "nowrap" }}>{s.type}</div>
              <div style={{ fontWeight: 500, fontSize: 36, letterSpacing: "-0.02em", color: C.ink, whiteSpace: "nowrap" }}>
                {txt}{i === active && <span style={{ display: "inline-block", width: 3, height: 34, marginLeft: 3, verticalAlign: "-5px", background: C.blue }} />}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

/* ---------- 4. designs the look: palette, type specimen, motion style ---------- */
const LookCard: React.FC<{ g: number }> = ({ g }) => {
  const aa = k(g, "w:designs", 0.5);
  const sw = [LUMO.bg, LUMO.deep, LUMO.accent, C.white];
  const chips = ["Bold type", "Dots world", "Whip cuts", "Punchy motion"];
  return (
    <>
      <Head icon="palette" t="Art direction" />
      <div style={{ position: "absolute", left: 56, top: 140, width: 380, height: 290, borderRadius: 24, background: C.mist, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        opacity: clamp01(aa * 2), transform: `scale(${0.85 + 0.15 * aa})` }}>
        <div style={{ fontWeight: 700, fontSize: 168, letterSpacing: "-0.06em", color: LUMO.bg, lineHeight: 1 }}>Aa</div>
        <div style={{ fontWeight: 500, fontSize: 26, color: C.muted, marginTop: 14 }}>Lumo Sans · Bold</div>
      </div>
      <div style={{ position: "absolute", left: 476, top: 150, display: "flex", gap: 20 }}>
        {sw.map((c, i) => { const q = pop(g, lab("w:designs", 0.08 + i * 0.07)); return (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, transform: `scale(${Math.max(0, q)})`, opacity: clamp01(q * 3) }}>
            <div style={{ width: 100, height: 160, borderRadius: 22, background: c, boxShadow: `inset 0 0 0 1.5px rgba(38,35,44,0.1), 0 10px 20px -12px ${c === C.white ? "rgba(0,0,0,0.2)" : c}` }} />
            <div style={{ fontSize: 22, fontWeight: 500, color: C.muted, fontVariantNumeric: "tabular-nums" }}>{c.toUpperCase()}</div>
          </div>
        ); })}
      </div>
      <div style={{ position: "absolute", left: 56, top: 476, fontWeight: 600, fontSize: 23, letterSpacing: "0.12em", color: C.soft, opacity: clamp01(k(g, "w:look-0.15", 0.3) * 2) }}>MOTION STYLE</div>
      <div style={{ position: "absolute", left: 56, top: 524, display: "flex", gap: 16 }}>
        {chips.map((c, i) => <Chip key={c} p={pop(g, lab("w:look", -0.08 + i * 0.07))} size={27}><Ico n={["layers", "spark", "film", "rocket"][i]} s={26} c={C.violet} />{c}</Chip>)}
      </div>
    </>
  );
};

/* ---------- 5. checks every fact ---------- */
const FactsCard: React.FC<{ g: number }> = ({ g }) => {
  const claims: [string, string][] = [["The planner for small teams", "w:checks+0.15"], ["Your week, in one view", "w:every-0.15"], ["Plan, share and ship together", "w:fact-0.02"]];
  const ban = k(g, "w:every", 0.45);
  return (
    <>
      <Head icon="shield" t="Checking facts" right={<div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 25, fontWeight: 500, color: C.muted }}><Ico n="globe" s={24} c={C.muted} />lumo.app</div>} />
      <div style={{ position: "absolute", left: 56, right: 56, top: 140, display: "grid", gap: 16 }}>
        {claims.map(([t, at], i) => {
          const r = k(g, lab("w:checks", i * 0.07), 0.4), c = pop(g, at, 0.3);
          return (
            <div key={i} style={{ height: 78, borderRadius: 18, background: c > 0 ? "#F6F1FF" : C.mist, display: "flex", alignItems: "center", padding: "0 18px 0 28px", gap: 18,
              opacity: clamp01(r * 3), transform: `translateX(${(1 - r) * 60}px)`, boxShadow: c > 0 ? `inset 0 0 0 1.5px rgba(124,58,237,${0.35 * clamp01(c)})` : undefined }}>
              <div style={{ fontWeight: 500, fontSize: 34, letterSpacing: "-0.02em", color: C.ink, flex: 1, whiteSpace: "nowrap" }}>“{t}”</div>
              <div style={{ fontSize: 23, fontWeight: 500, color: C.violet, opacity: clamp01(c * 2) }}>on the site</div>
              <Check p={c} s={46} />
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 56, right: 56, top: 462, height: 120, borderRadius: 24, background: C.lavender, display: "flex", alignItems: "center", gap: 22, padding: "0 32px",
        opacity: clamp01(ban * 2.5), transform: `translateY(${(1 - ban) * 50}px) scale(${0.96 + 0.04 * ban})` }}>
        <Ico n="shield" s={54} c={C.violet} w={2.4} />
        <div style={{ fontWeight: 700, fontSize: 36, letterSpacing: "-0.025em", color: C.lavenderInk }}>Every number and quote is on the site</div>
      </div>
    </>
  );
};

/* ---------- the thread ---------- */
const STEPS: [string, string, string][] = [
  ["Read lumo.app", "w:reads-0.15", "w:understands-0.2"],
  ["Understood Lumo", "w:understands-0.15", "w:writes-0.2"],
  ["Wrote the story", "w:writes-0.15", "w:designs-0.2"],
  ["Art direction", "w:designs-0.15", "w:checks-0.2"],
  ["Checked facts", "w:checks-0.15", "w:fact+0.1"],
];

export const SceneC: React.FC<{ g: number }> = ({ g }) => {
  if (g < f("s2") || g >= f("sC")) return null;

  // the glow rises for the brand moment, settles to the landing look, then rests lower under the work
  const up = k(g, "s2", 1.0);
  const hold = k(g, "w:meet", (f("w:describe-0.35") - f("w:meet")) / 30, LIN); // keeps lifting through the brand moment
  const rise = (0.3 * up + 0.35 * hold) * (1 - k(g, "w:describe-0.3", 1.2, MOVE));
  const glowA = up * (1 - 0.55 * k(g, "w:and2", 0.7, MOVE));

  // the logo: the mark builds centred, the wordmark slides out beside it, a slow push; then it moves up (landing look),
  // then flies into the activity card's header as Moviqly gets to work
  const pM = k(g, "w:meet-0.2", 0.8, LIN), pW = k(g, "w:moviqly-0.05", 0.75, LIN), sl = k(g, "w:moviqly-0.1", 0.7);
  const push = 0.9 + 0.15 * hold;
  const mv = k(g, "w:describe-0.35", 1.1, MOVE), cr = k(g, "w:and2+0.05", 0.5, MOVE);
  const S0 = mix(push, 0.42, mv), cy0 = mix(530, 175, mv);
  const S = S0 * (1 - 0.25 * cr), my = cy0 - 300 * cr;
  const cx = 960, logoO = 1 - clamp01(cr * 1.4);

  // the prompt box: arrives, types the brief, sends; then shrinks into the user's bubble
  const pa = k(g, "w:describe-0.15", 0.9);
  const bp = 1 + 0.07 * k(g, "w:describe+0.2", (f("w:and2") - f("w:describe+0.2")) / 30, LIN); // a slow push while it types
  const press = k(g, "w:and2-0.1", 0.1) - k(g, "w:and2+0.05", 0.25);
  const mb = k(g, "w:and2", 0.4, MOVE);
  const bub = k(g, "w:and2+0.25", 0.3, POP);

  // the activity card (the thread)
  const ac = k(g, "w:and2+0.22", 0.5);
  const steps: Step[] = STEPS.map(([t, a, d]) => ({ t, state: g < f(a) ? 0 : g < f(d) ? 0.5 : 1 }));
  const secs = Math.max(0, Math.floor(((g - f("w:and2")) / 30) * 4));

  // the stage clears upward into D
  const ex = k(g, "sC-0.33", 0.33, DEPART);

  return (
    <>
      <Glow g={g} a={glowA} rise={rise} />
      <div style={{ position: "absolute", inset: 0, transform: `translateY(${-ex * 760}px)`, opacity: 1 - ex * 0.8 }}>
        {/* the thread */}
        {ac > 0 && <ActivityCard g={g} steps={steps} clock={`Working 0:${String(secs).padStart(2, "0")}`} w={ACT.w} size={ACT.size}
          style={{ position: "absolute", left: ACT.x, top: ACT.y, opacity: clamp01(ac * 1.6), transform: `translateX(${(1 - ac) * -80}px)` }} />}
        {bub > 0 && <div style={{ position: "absolute", right: 1920 - BUB.right, top: BUB.y, transform: `scale(${bub})`, transformOrigin: "100% 0%", opacity: clamp01(bub * 3) }}><UserBubble text={BRIEF} size={25} /></div>}

        {/* the phrase cards */}
        <Panel g={g} inAt="w:reads-0.15" outAt="w:understands-0.2"><WebCard g={g} /></Panel>
        <Panel g={g} inAt="w:understands-0.15" outAt="w:writes-0.2"><UnderstoodCard g={g} /></Panel>
        <Panel g={g} inAt="w:writes-0.15" outAt="w:designs-0.2"><StoryCard g={g} /></Panel>
        <Panel g={g} inAt="w:designs-0.15" outAt="w:checks-0.2"><LookCard g={g} /></Panel>
        <Panel g={g} inAt="w:checks-0.15"><FactsCard g={g} /></Panel>

        {/* the prompt box */}
        {pa > 0 && mb < 1 && (
          <PromptBox w={1000} text={typed(g, "w:describe+0.05", BRIEF, 40)} g={g} caret={g < f("w:and2-0.1")} press={press}
            style={{ position: "absolute", left: 460, top: 470, transformOrigin: "100% 0%", opacity: clamp01(pa * 2) * (1 - clamp01((mb - 0.75) / 0.25)),
              transform: `translate(${mb * (BUB.right - 1460)}px, ${(1 - pa) * 320 + (1 - bp) * 600 + 42 + mb * (BUB.y - 470)}px) scale(${mix(bp, 0.36, mb)})` }} />
        )}

        {/* the logo */}
        {pM > 0 && logoO > 0 && (
          <div style={{ position: "absolute", left: cx, top: my, transform: `translate(-50%, -50%) scale(${S})`, display: "flex", alignItems: "center", opacity: logoO }}>
            <MMark size={LG.H} p={pM} />
            <div style={{ width: (LG.gap + LG.W) * sl, flex: "none", overflow: "visible", opacity: 1 - clamp01(cr * 2.2) }}>
              <Wordmark size={LG.H * 0.9} p={pW} style={{ paddingLeft: LG.gap, width: "max-content" }} />
            </div>
          </div>
        )}
      </div>
    </>
  );
};
