// Segment C (10-15 s): how TNOA works, in three steps. Global time t (s), 60 fps.
//  7  10.00-11.12  step 1 on the blue field: a giant "1" rises from below the frame with a coin turn, "Tell us
//                  what's broken" rises in letter by letter, a glass composer types the visitor's broken workflow
//                  and sends it; a steady camera pan with parallax   -> push with momentum (speed-matched pages)
//  8  11.12-13.02  step 2: cover flow of TNOA's 13 workflows flicks past and snaps on "Inbound lead response", the
//                  neighbours are nudged, a "Vetted engineer" chip docks, the others part -> card expand (App Store)
//  9  13.02-14.18  step 3 builds inside the expanding card: an iOS settings card, a giant "Deploy" switch flips on,
//                  status rolls Off -> Live, "Accountable" pops    -> capsule morph: everything collapses into the
//                  switch, whose track travels to the centre and becomes the kit's navy island (exact at 14.75)
// Hand-in: H2Blue as is; the "1" only rises in across the bottom edge from 10.00 (frame 600 is H2Blue alone).
// Hand-off: from 14.75 the kit's H3Capsule as is, plus two landing ripples that leave the frame by 15.00.
import React from "react";
import { AbsoluteFill } from "remotion";
import { B, SANS, SHADOW, clamp, mix, ease, spring, bounce, Glass, H2Blue, H3Capsule, H3 } from "../kit";

// ---------- helpers ----------
const lim = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const seg = (t: number, a: number, b: number) => clamp((t - a) / (b - a));
const inout2 = (x: number) => { const c = clamp(x); return c < 0.5 ? 2 * c * c : 1 - Math.pow(-2 * c + 2, 2) / 2; };
const sine = (x: number) => 0.5 - 0.5 * Math.cos(Math.PI * clamp(x));
const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const tint = (a: string, b: string, k: number) => { const x = hex(a), y = hex(b); return `rgb(${x.map((v, i) => Math.round(mix(v, y[i], clamp(k)))).join(",")})`; };
const speed = (f: (x: number) => number, t: number) => (f(t) - f(t - 1 / 60)) * 60;

// ---------- timeline (global seconds) ----------
const T1 = 10.0;              // "1" rises in from below
const TT1 = 10.03, TT2 = 10.09; // "Tell us" / "what's broken" rise from below, letters bouncing
const TG = 10.3;              // glass composer
const TY0 = 10.42, TY1 = 10.86; // typing
const TREADY = 10.88;         // send button lights up
const TSEND = 10.98;          // send pressed
const TPUSH = 11.12;          // push with momentum to step 2
const TT8 = 11.3;             // step 2 title letters
const TF1 = 12.34;            // the flick ends (overshoot), springs back onto the agent
const TSNAP = 12.5;          // the hero lands in the centre
const TPILL = 12.52;          // "Proven in production" glows
const TCHIP = 12.5;          // engineer chip docks
const TPART = 12.64;          // the other agents part to the sides
const TEXP = 13.02;           // card expand
const TB9 = 13.08, TT9 = 13.12; // "3" badge, step 3 title
const TC1 = 13.14, TC2 = 13.42;  // card 1 rises; card 2 drops out from behind it
const TFLIP = 13.64;          // switch
const TLIVE = 13.78;          // status rolls to Live
const TACC = 13.94;           // Accountable
const TM0 = 14.18;            // everything collapses
const TM1 = H3 - 0.25;        // 14.75: exactly the kit capsule

// ---------- small UI parts ----------
const Letters: React.FC<{ t: number; at: number; text: string; size: number; color: string; stagger?: number; weight?: number }> = ({ t, at, text, size, color, stagger = 0.022, weight = 700 }) => (
  <div style={{ display: "flex", whiteSpace: "pre", fontFamily: SANS, fontWeight: weight, fontSize: size, letterSpacing: "-0.035em", lineHeight: 1.05, color }}>
    {text.split("").map((ch, i) => {
      const p = bounce(t, at + i * stagger, 0.5);
      return <span key={i} style={{ display: "inline-block", transform: `translateY(${(1 - p) * size * 0.75}px) scale(${0.5 + 0.5 * p}) rotateX(0.01deg)`, opacity: clamp(p * 2.2) }}>{ch}</span>;   // a 3D layer: settles without pixel steps
    })}
  </div>
);

const ICONS: Record<string, React.ReactNode> = {
  lead: <><path d="M9 12h30a3 3 0 0 1 3 3v15a3 3 0 0 1-3 3H22l-8 7v-7H9a3 3 0 0 1-3-3V15a3 3 0 0 1 3-3z" /><path d="M14 20h20M14 26h12" /></>,
  support: <><path d="M7 15h34v6a3.5 3.5 0 0 0 0 7v6H7v-6a3.5 3.5 0 0 0 0-7z" /><path d="M20 15v19" strokeDasharray="3 4" /></>,
  voice: <path d="M10 20v8M17 14v20M24 9v30M31 16v16M38 21v6" />,
  invoice: <><path d="M13 6h15l8 8v28H13z" /><path d="M28 6v8h8M18 24h13M18 31h9" /></>,
  proposal: <><path d="M11 37l3-10L32 9l7 7-18 18z" /><path d="M28 13l7 7" /></>,
  schedule: <><rect x="7" y="11" width="34" height="29" rx="4" /><path d="M7 19h34M16 7v8M32 7v8M15 27h4M23 27h4M31 27h3M15 33h4M23 33h4" /></>,
  data: <><rect x="7" y="9" width="34" height="30" rx="4" /><path d="M7 19h34M7 29h34M20 9v30" /></>,
  report: <path d="M8 40h32M13 34V24M21 34V14M29 34V20M37 34V9" />,
  content: <path d="M24 39S8 30 8 19a8 8 0 0 1 16-3 8 8 0 0 1 16 3c0 11-16 20-16 20z" />,
  email: <><rect x="6" y="11" width="36" height="26" rx="4" /><path d="M7 13l17 13 17-13" /></>,
  ads: <><path d="M8 20v8h7l17 9V11l-17 9z" /><path d="M15 28l3 10" /></>,
  seo: <><circle cx="21" cy="21" r="12" /><path d="M30 30l10 10" /></>,
  custom: <path d="M24 8v32M8 24h32" />,
};
const AgentIcon: React.FC<{ kind: string; size: number }> = ({ kind, size }) => (
  <div style={{ width: size, height: size, borderRadius: size * 0.27, background: `linear-gradient(140deg, ${B.sky}, ${B.blue})`, display: "flex", alignItems: "center", justifyContent: "center",
    boxShadow: "inset 0 1.5px 0 rgba(255,255,255,0.35), 0 10px 22px -10px rgba(37,99,235,0.7)" }}>
    <svg width={size * 0.56} height={size * 0.56} viewBox="0 0 48 48" fill="none" stroke="#fff" strokeWidth={3.6} strokeLinecap="round" strokeLinejoin="round">{ICONS[kind]}</svg>
  </div>
);
const Avatar: React.FC<{ size: number }> = ({ size }) => (
  <div style={{ width: size, height: size, borderRadius: size / 2, background: `linear-gradient(150deg, #E8EEF8, #C9D5E6)`, overflow: "hidden", boxShadow: "inset 0 0 0 2px rgba(255,255,255,0.8)", flex: "none" }}>
    <svg width={size} height={size} viewBox="0 0 48 48"><circle cx="24" cy="19" r="8.5" fill={B.navy} opacity={0.82} /><path d="M7 48c1.5-10 8.5-15 17-15s15.5 5 17 15z" fill={B.navy} opacity={0.82} /></svg>
  </div>
);
const Check: React.FC<{ size: number; color: string; w?: number }> = ({ size, color, w = 3.4 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
);
const Pill: React.FC<{ children: React.ReactNode; bg: string; color: string; size?: number; h?: number }> = ({ children, bg, color, size = 28, h = 52 }) => (
  <div style={{ height: h, borderRadius: h / 2, background: bg, color, display: "inline-flex", alignItems: "center", gap: 10, padding: `0 ${h * 0.42}px`, fontFamily: SANS, fontWeight: 600, fontSize: size, letterSpacing: "-0.01em", whiteSpace: "nowrap" }}>{children}</div>
);
const Badge: React.FC<{ n: string; size: number; bg: string; color: string }> = ({ n, size, bg, color }) => (
  <div style={{ width: size, height: size, borderRadius: size / 2, background: bg, color, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontWeight: 700, fontSize: size * 0.56, letterSpacing: "-0.03em", flex: "none",
    boxShadow: "0 14px 30px -14px rgba(11,18,32,0.45)" }}>{n}</div>
);

// =====================================================================================================
// Shot 7: step 1 on blue
// =====================================================================================================
const TYPED = "Leads wait until the next morning.";
const Shot7: React.FC<{ t: number; dx: number }> = ({ t, dx }) => {
  const lin = (t - 10) / 1.15, cam = mix(250, -250, lin), yaw = mix(18, -18, clamp(lin));   // a steady camera pan that runs on into the push
  // the giant "1": rises from below the frame with a coin turn, stretches while fast, squashes as it settles
  const f1 = (x: number) => spring(x, T1 - 0.08, 0.55, 0.58);   // already moving at 10.00, still below the frame
  const p1 = f1(t), v1 = speed(f1, t);
  const sy = 1 + lim(v1 * 0.02, -0.07, 0.13), sx = 1 / Math.sqrt(sy);
  const oneX = 120 + dx + cam * 0.5, oneY = -66 + (1 - p1) * 1566;   // its foot ends ~70 px inside the glass, never under it
  // title
  const tx = 760 + dx + cam;
  const q1 = spring(t, TT1, 0.55, 0.7), q2 = spring(t, TT2, 0.55, 0.7);
  // glass composer
  const g = spring(t, TG, 0.55, 0.66);
  const gx = 470 + dx + cam * 1.35, gy = 590 + (1 - g) * 600;
  const nTyped = Math.floor(seg(t, TY0, TY1) * TYPED.length + 0.0001);
  const glint = seg(t, TG + 0.2, TG + 0.62);   // a light sweep across the glass once it lands
  const done = t >= TY1;
  const caret = !done || Math.floor((t - TY1) * 3.2) % 2 === 0;
  const ready = bounce(t, TREADY, 0.42);
  const press = t >= TSEND ? 1 - 0.16 * Math.sin(Math.PI * seg(t, TSEND, TSEND + 0.16)) : 1;
  const flyUp = ease(seg(t, TSEND + 0.06, TSEND + 0.4));       // the sent text lifts away
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 0, top: 0, width: 680, height: 980, transform: `translate(${oneX}px, ${oneY}px) perspective(1600px) rotateY(${(1 - p1) * -70 + yaw * 1.2}deg) scale(${sx * (1 + 0.05 * seg(t, 10.3, 11.4))}, ${sy * (1 + 0.05 * seg(t, 10.3, 11.4))})`, transformOrigin: "50% 80%",
        fontFamily: SANS, fontWeight: 700, fontSize: 980, lineHeight: "980px", letterSpacing: "-0.05em", color: B.white, textAlign: "center", textShadow: "0 40px 80px rgba(11,18,32,0.25)" }}>1</div>
      <div style={{ position: "absolute", left: 0, top: 0, transform: `translate(${tx}px, ${150 + (1 - q1) * 980}px) perspective(1800px) rotateY(${yaw * 0.8}deg)`, transformOrigin: "0% 50%" }}>
        <Letters t={t} at={TT1 + 0.04} text="Tell us" size={150} color={B.white} />
      </div>
      <div style={{ position: "absolute", left: 0, top: 0, transform: `translate(${tx}px, ${305 + (1 - q2) * 860}px) perspective(1800px) rotateY(${yaw * 0.8}deg)`, transformOrigin: "0% 50%" }}>
        <Letters t={t} at={TT2 + 0.04} text="what’s broken" size={150} color={B.white} stagger={0.018} />
      </div>
      <Glass w={1240} h={220} r={52} tint="rgba(255,255,255,0.66)"
        transform={`translate(${gx}px, ${gy}px) perspective(1400px) rotateX(${(1 - g) * 40}deg) rotateY(${yaw * 0.8}deg) scale(${0.86 + 0.14 * g})`}>
        {glint > 0 && glint < 1 && <div style={{ position: "absolute", left: 0, top: -40, width: 260, height: 300, background: "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.75), rgba(255,255,255,0))", transform: `translateX(${mix(-300, 1300, glint)}px) skewX(-18deg)` }} />}
        <div style={{ position: "absolute", left: 52, top: 40, fontSize: 30, fontWeight: 600, color: B.muted, letterSpacing: "-0.01em", display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 12, height: 12, borderRadius: 6, background: B.blue }} />Your workflow
        </div>
        <div style={{ position: "absolute", left: 52, top: 92, fontSize: 60, fontWeight: 600, color: B.navy, letterSpacing: "-0.03em", whiteSpace: "pre", display: "flex", alignItems: "center",
          transform: `translateY(${-flyUp * 30}px)`, opacity: 1 - flyUp * 0.55 }}>
          {TYPED.slice(0, nTyped).split("").map((ch, i) => { const at = TY0 + (i / TYPED.length) * (TY1 - TY0), q = spring(t, at, 0.3, 0.6);
            return <span key={i} style={{ display: "inline-block", transform: `translateY(${(1 - q) * 22}px) scale(${0.5 + 0.5 * q})`, transformOrigin: "50% 100%" }}>{ch}</span>; })}
          <span style={{ display: "inline-block", width: 5, height: 66, borderRadius: 3, marginLeft: 4, background: B.blue, opacity: caret ? 1 : 0 }} />
        </div>
        <div style={{ position: "absolute", left: 1240 - 52 - 112, top: 54, width: 112, height: 112, borderRadius: 56, background: tint("#9DB6EE", B.blue, ready), display: "flex", alignItems: "center", justifyContent: "center",
          transform: `scale(${(0.8 + 0.2 * ready) * press})`, boxShadow: `0 16px 30px -12px rgba(37,99,235,${0.7 * clamp(ready)})` }}>
          <svg width={52} height={52} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.8} strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5M5.5 11.5L12 5l6.5 6.5" /></svg>
        </div>
      </Glass>
    </AbsoluteFill>
  );
};

// =====================================================================================================
// Shot 8: step 2, cover flow of agents
// =====================================================================================================
const AGENTS: { name: string; icon: string }[] = [
  { name: "Something custom", icon: "custom" }, { name: "SEO & outbound", icon: "seo" }, { name: "Paid ads", icon: "ads" },
  { name: "Email marketing", icon: "email" }, { name: "Content & social", icon: "content" }, { name: "Reporting & insights", icon: "report" },
  { name: "Data entry & reconciliation", icon: "data" }, { name: "Scheduling & dispatch", icon: "schedule" }, { name: "Voice agents", icon: "voice" },
  { name: "Customer support triage", icon: "support" }, { name: "Inbound lead response", icon: "lead" }, { name: "Quote & proposal drafting", icon: "proposal" },
  { name: "Invoicing & collections", icon: "invoice" },
];
const K = 10;                       // Inbound lead response
const CW = 760, CH = 470, CX = 960, CY = 650;
const S0 = 3.4, SOV = 10.42, TFL = TPUSH;
const out2 = (x: number) => 1 - Math.pow(1 - clamp(x), 2);
const scrollAt = (t: number) => (t < TF1 ? mix(S0, SOV, out2(seg(t, TFL, TF1))) : mix(SOV, K, spring(t, TF1, 0.44, 0.6)));

const Chip: React.FC = () => (
  <div style={{ height: 84, borderRadius: 42, background: B.navy, display: "inline-flex", alignItems: "center", gap: 16, padding: "0 30px 0 14px", fontFamily: SANS, fontWeight: 600, fontSize: 32, color: B.white, letterSpacing: "-0.015em", whiteSpace: "nowrap",
    boxShadow: "0 22px 40px -16px rgba(11,18,32,0.65), inset 0 1px 0 rgba(255,255,255,0.12)" }}>
    <Avatar size={58} />Vetted engineer
  </div>
);

const CardFace: React.FC<{ a: { name: string; icon: string }; t: number; hero: boolean; bare?: boolean }> = ({ a, t, hero, bare }) => {
  const glow = hero ? seg(t, TPILL, TPILL + 0.55) : 0;
  const pop = hero ? 1 + 0.1 * Math.sin(Math.PI * seg(t, TPILL, TPILL + 0.22)) : 1;
  return (
    <div style={{ position: "absolute", inset: 0, borderRadius: 48, background: bare ? undefined : B.white, boxShadow: bare ? undefined : SHADOW, fontFamily: SANS }}>
      <div style={{ position: "absolute", left: 52, top: 52 }}><AgentIcon kind={a.icon} size={120} /></div>
      <div style={{ position: "absolute", left: 52, top: 204, width: CW - 104, fontSize: 60, fontWeight: 700, color: B.navy, letterSpacing: "-0.035em", lineHeight: 1.04 }}>{a.name}</div>
      <div style={{ position: "absolute", left: 52, right: 52, top: 356, height: 2, background: B.line }} />
      <div style={{ position: "absolute", left: 52, top: 380 }}>
        {hero && <div style={{ position: "absolute", left: -6, top: -6, right: -6, bottom: -6, borderRadius: 40, border: `3px solid ${B.green}`, transform: `scale(${1 + glow * 0.35})`, opacity: glow > 0 ? (1 - glow) * 0.9 : 0 }} />}
        <div style={{ transform: `scale(${pop})`, transformOrigin: "20% 50%" }}>
          <Pill bg="rgba(52,211,153,0.16)" color={B.greenInk} size={32} h={58}><Check size={30} color={B.greenInk} />Proven in production</Pill>
        </div>
      </div>
    </div>
  );
};

const Shot8: React.FC<{ t: number; dx: number }> = ({ t, dx }) => {
  const s = scrollAt(t);
  const hideHero = t >= TEXP;     // the expanding card takes over the hero
  const cards = AGENTS.map((a, i) => ({ a, i, d: i - s })).filter((c) => Math.abs(c.d) < 4.6).sort((p, q) => Math.abs(q.d) - Math.abs(p.d));
  // the engineer chip flies in on an arc and docks on the hero card's top-right corner, squashing as it lands
  const fc = (x: number) => spring(x, TCHIP, 0.5, 0.6);
  const c = fc(t), cv = speed(fc, t);
  const csq = 1 - lim(-cv * 0.02, 0, 0.12);
  const orbit = mix(26, 0, sine(seg(t, TPUSH, TEXP)));        // the camera orbits round to face the hero square-on
  const part = Math.pow(seg(t, TPART, TEXP + 0.12), 2);         // the other agents part to the sides (ease-in)
  const kick = t > TSNAP ? Math.exp(-(t - TSNAP) * 6) * Math.sin((t - TSNAP) * 17) : 0;   // the snap nudges the neighbours outward
  const lift = Math.pow(seg(t, TPART + 0.04, TEXP + 0.1), 2);   // the title rises away
  return (
    <AbsoluteFill style={{ transform: `translateX(${dx}px)` }}>
      {/* title (translate only, its own layer) */}
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, display: "flex", justifyContent: "center", alignItems: "center", gap: 30,
        transform: `translateY(${92 - lift * 300}px)`, willChange: "transform" }}>
        <div style={{ transform: `scale(${bounce(t, TT8 - 0.06, 0.5)})` }}><Badge n="2" size={112} bg={B.white} color={B.blue} /></div>
        <Letters t={t} at={TT8} text="Get matched with a working agent" size={96} color={B.white} stagger={0.012} />
      </div>
      {/* cover flow */}
      <div style={{ position: "absolute", inset: 0, perspective: 1700, perspectiveOrigin: `${CX}px ${CY}px` }}>
        {cards.map(({ a, i, d }) => {
          const ad = Math.abs(d), near = Math.min(ad, 1), far = Math.max(ad - 1, 0), sg = Math.sign(d);
          const x = sg * ((near * 600 + far * 330) * (1 + part * 3) + kick * near * (70 - 15 * Math.min(ad, 3))), z = -near * 260 - far * 140;
          const ry = -lim(d, -1, 1) * (44 + part * 22) + orbit * (0.5 + 0.5 * near);
          const hero = i === K;
          if (hero && hideHero) return null;
          const cx = CW - 330, cy = -46;
          return (
            <div key={i} style={{ position: "absolute", left: 0, top: 0, width: CW, height: CH, zIndex: 1000 - Math.round(ad * 100),
              transform: `translate3d(${CX - CW / 2 + x}px, ${CY - CH / 2}px, ${z}px) rotateY(${ry}deg) rotateX(${orbit * 0.4}deg)` }}>
              <CardFace a={a} t={t} hero={hero} />
              <div style={{ position: "absolute", inset: 0, borderRadius: 48, background: B.navy, opacity: 0.1 * near + 0.06 * far, pointerEvents: "none" }} />
              {hero && t >= TCHIP && (
                <div style={{ position: "absolute", left: 0, top: 0, transform: `translate(${cx + (1 - c) * 1150}px, ${cy - (1 - c) * 40 - Math.sin(Math.PI * clamp(c)) * 110}px) rotate(${(1 - c) * 16}deg) scale(${(0.6 + 0.4 * c)}, ${(0.6 + 0.4 * c) * csq})`, transformOrigin: "50% 100%" }}>
                  <Chip />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// the hero card grows to fill the frame (App Store card expand); its fill turns into the light field
const expandAt = (t: number) => {
  const e = clamp(spring(t, TEXP, 0.56, 0.74));
  const l = mix(CX - CW / 2, 0, e), tp = mix(CY - CH / 2, 0, e), r = mix(CX + CW / 2, 1920, e), b = mix(CY + CH / 2, 1080, e);
  return { e, l, tp, r, b, clip: `inset(${tp}px ${1920 - r}px ${1080 - b}px ${l}px round ${mix(48, 0, e)}px)` };
};
const TEXPD = 13.5;            // the expand has filled the frame
const Expand: React.FC<{ t: number }> = ({ t }) => {
  const { e, l, tp, r, b, clip } = expandAt(t);
  const sx = (r - l) / CW, sy = (b - tp) / CH, sc = Math.min(sx, sy);
  const fade = 1 - ease(e / 0.36);                 // the old face is gone by e ~ 0.36 (frame 787)
  const chipK = clamp(e / 0.32);
  return (
    <AbsoluteFill>
      {/* the card's own shadow, stretched with the box (under it), fades as the card fills the frame */}
      <div style={{ position: "absolute", left: 0, top: 0, width: CW, height: CH, borderRadius: 48, boxShadow: SHADOW, transformOrigin: "0 0",
        transform: `translate(${l}px, ${tp}px) scale(${sx}, ${sy})`, opacity: 1 - clamp(e * 2.2) }} />
      <AbsoluteFill style={{ background: tint(B.white, B.bg, ease(e * 1.4)), clipPath: clip }} />
      {fade > 0 && (
        <AbsoluteFill style={{ clipPath: clip }}>
          <div style={{ position: "absolute", left: 0, top: 0, width: CW, height: CH, opacity: fade, transformOrigin: "0 0", transform: `translate(${l}px, ${tp}px) scale(${sc})` }}>
            <CardFace a={AGENTS[K]} t={t} hero={false} bare />
          </div>
        </AbsoluteFill>
      )}
      {chipK < 1 && (
        <div style={{ position: "absolute", left: 0, top: 0, transform: `translate(${r - 330 + chipK * 60}px, ${tp - 46 - chipK * 70}px) scale(${1 + chipK * 0.25})`, transformOrigin: "50% 50%", opacity: 1 - ease(chipK) }}><Chip /></div>
      )}
    </AbsoluteFill>
  );
};

// =====================================================================================================
// Shot 9: step 3, the Deploy switch, then everything collapses into the navy capsule
// =====================================================================================================
const C1W = 1320, C1H = 270, C1Y = 520, C2H = 250, C2Y = 822;
const TMC = TM0 + 0.03;      // card 1 collapses into its switch; the switch track becomes the capsule
const TRX = 960 + C1W / 2 - 56 - 180;   // the switch track's centre in the frame (card 1 at rest)
// 0 -> 1 in-out with a small settle past 1 near the end; exactly 1 with zero speed at x = 1
// a spring that lands exactly on 1 at t1 (blended to rest over the last 30% of the span)
const landing = (t: number, t0: number, t1: number, r: number, z: number) => { const c = seg(t, t0 + (t1 - t0) * 0.7, t1); return mix(spring(t, t0, r, z), 1, c * c * (3 - 2 * c)); };
const islandAt = (t: number) => { const p = 1 + Math.sin((t - H3) * 6) * 0.03; return { cy: 540 + Math.sin((t - H3) * 4) * 8, W: mix(180, 640, p), H: mix(54, 120, p) }; };

const SW = { TW: 360, TH: 218, KN: 186 };
const knobAt = (t: number) => {
  const { TW, TH, KN } = SW, pad = (TH - KN) / 2, travel = TW - KN - pad * 2;
  const press = seg(t, TFLIP - 0.1, TFLIP) * (1 - seg(t, TFLIP + 0.04, TFLIP + 0.2));   // held: it stretches toward its travel
  const kR = spring(t, TFLIP, 0.42, 0.55), kL = spring(t, TFLIP + 0.035, 0.42, 0.55);
  const R = Math.min(TW - pad, pad + KN + press * 0.3 * KN + kR * travel);   // the leading edge stops at the track end
  const L = Math.min(TW - pad - KN * 0.86, pad + kL * travel);                // the trailing edge lags, then squashes it
  const w = R - L, sq = Math.max(0, (KN - w) / KN);
  return { L, R, w, sy: 1 + sq * 0.5, pad, kR };
};
const Switch: React.FC<{ t: number; hide?: boolean }> = ({ t, hide }) => {
  const { TW, TH, KN } = SW;
  const { L, w, sy, pad, kR } = knobAt(t);
  const BW = 300;                                   // the knob is a static white box shaped with clip-path (no width animation)
  const flood = ease(seg(t, TFLIP + 0.02, TFLIP + 0.3));
  const kc = L + w / 2;
  const shine = seg(t, TFLIP + 0.22, TFLIP + 0.55);
  return (
    <div style={{ position: "relative", width: TW, height: TH, borderRadius: TH / 2, background: "#E4E9F0", overflow: "hidden", boxShadow: "inset 0 2px 5px rgba(11,18,32,0.08)", opacity: hide ? 0 : 1 }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: TH * 4, height: TH * 4, borderRadius: TH * 2, background: B.green,
        transform: `translate(${kc - TH * 2}px, ${TH / 2 - TH * 2}px) scale(${flood})` }} />
      {shine > 0 && shine < 1 && <div style={{ position: "absolute", left: 0, top: -20, width: 120, height: TH + 40, background: "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.6), rgba(255,255,255,0))", transform: `translateX(${mix(-140, TW + 20, shine)}px) skewX(-16deg)` }} />}
      <div style={{ position: "absolute", left: 0, top: 0, width: BW, height: KN, transform: `translate(${L}px, ${pad}px) scaleY(${sy})`, transformOrigin: "0 50%",
        filter: `drop-shadow(0 ${6 + 2 * clamp(kR)}px 10px rgba(11,18,32,0.2)) drop-shadow(0 2px 2px rgba(11,18,32,0.1))` }}>
        <div style={{ position: "absolute", inset: 0, background: B.white, clipPath: `inset(0px ${BW - w}px 0px 0px round ${KN / 2}px)` }} />
      </div>
    </div>
  );
};

const LiveRoll: React.FC<{ t: number }> = ({ t }) => {
  const r = spring(t, TLIVE, 0.45, 0.62), H = 72, W = 220;
  const pulse = (t - TLIVE) % 0.7;
  return (
    <div style={{ height: H, borderRadius: H / 2, background: tint("#EEF1F5", "#DDF7EC", ease(seg(t, TLIVE, TLIVE + 0.25))), width: W, overflow: "hidden", position: "relative", fontFamily: SANS, fontWeight: 600, fontSize: 36, letterSpacing: "-0.01em" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: W, transform: `translateY(${-r * H}px)`, willChange: "transform" }}>
        <div style={{ height: H, display: "flex", alignItems: "center", justifyContent: "center", gap: 12, color: B.muted }}>
          <div style={{ width: 14, height: 14, borderRadius: 7, background: B.light }} />Off
        </div>
        <div style={{ height: H, display: "flex", alignItems: "center", justifyContent: "center", gap: 14, color: B.greenInk }}>
          <div style={{ position: "relative", width: 16, height: 16 }}>
            <div style={{ position: "absolute", inset: 0, borderRadius: 8, background: B.green }} />
            {t > TLIVE && <div style={{ position: "absolute", inset: 0, borderRadius: 8, border: `3px solid ${B.green}`, transform: `scale(${1 + pulse * 3})`, opacity: 1 - pulse / 0.7 }} />}
          </div>Live
        </div>
      </div>
    </div>
  );
};

const Row: React.FC<{ children: React.ReactNode; top: number }> = ({ children, top }) => (
  <div style={{ position: "absolute", left: 52, top, height: C2H / 2, display: "flex", alignItems: "center", gap: 22, fontSize: 44, fontWeight: 600, color: B.navy, letterSpacing: "-0.02em" }}>{children}</div>
);

const Shot9: React.FC<{ t: number }> = ({ t }) => {
  const m = seg(t, TMC, TM1);                    // switch track -> capsule
  const mp = landing(t, TMC, TM1, 0.75, 0.6), ms = landing(t, TMC + 0.18, TM1, 0.42, 0.45);   // travel, then shape (squash on landing)
  const camK = 1 - ease(seg(t, TMC, TM1 - 0.06)); // the camera drift hands over to identity as it collapses
  const dr = seg(t, 13.06, 14.45);
  const camRY = mix(16, -16, dr) * camK, camX = mix(260, -260, dr) * camK;
  const isl = islandAt(t);
  // title flies down into the capsule
  const gone = inout2(seg(t, TM0 + 0.02, TM0 + 0.44));
  // cards
  const c1 = spring(t, TC1, 0.55, 0.66), c2 = spring(t, TC2, 0.5, 0.62);
  const c2out = Math.pow(seg(t, TM0 - 0.04, TM0 + 0.2), 1.7);   // card 2 shrinks up into the switch (ease-in)
  const acc = bounce(t, TACC, 0.45);
  const collapsing = t >= TMC;
  const s1 = Math.pow(seg(t, TMC, TMC + 0.26), 1.6);            // card 1 shrinks into its switch
  const c1y = (1 - c1) * 780;
  const card1T = `translate(${960 - C1W / 2}px, ${C1Y - C1H / 2 + c1y}px) perspective(1600px) rotateX(${(1 - c1) * 40}deg) scale(${0.88 + 0.12 * c1})`;
  // the track: from the switch on card 1 to the kit's island
  const TW = mix(360, isl.W, ms), TH = mix(218, isl.H, ms), TX = mix(TRX, 960, mp), TY = mix(C1Y, isl.cy, mp);
  const knob = 1 - ease(seg(m, 0, 0.3));
  return (
    <AbsoluteFill style={{ transform: `translateX(${camX}px) perspective(2400px) rotateY(${camRY}deg)`, transformOrigin: "960px 560px" }}>
      {/* title */}
      {gone < 1 && (
        <div style={{ position: "absolute", left: 0, top: 0, width: 1920, display: "flex", justifyContent: "center", alignItems: "center", gap: 32,
          transform: `translateY(${mix(150, isl.cy - 60, gone)}px) scale(${1 - 0.85 * gone})`, opacity: 1 - Math.pow(gone, 1.6), transformOrigin: "960px 60px" }}>
          <div style={{ transform: `scale(${bounce(t, TB9, 0.5)})` }}><Badge n="3" size={120} bg={B.blue} color={B.white} /></div>
          <Letters t={t} at={TT9} text="Deploy with accountability" size={108} color={B.navy} stagger={0.014} />
        </div>
      )}
      {/* card 2: status + engineer */}
      {t >= TC2 && c2out < 1 && (
        <div style={{ position: "absolute", left: 0, top: 0, width: C1W, height: C2H, borderRadius: 52, background: B.white, boxShadow: SHADOW, fontFamily: SANS, overflow: "hidden",
          transform: `translate(${960 - C1W / 2}px, ${C2Y - C2H / 2 - (1 - c2) * (C2Y - C1Y) - c2out * (C2Y - C1Y)}px) perspective(1600px) rotateX(${0.05 + (1 - c2) * 12}deg) scale(${(0.94 + 0.06 * c2) * (1 - 0.72 * c2out)})`,
          transformOrigin: `${C1W - 56 - 180}px 0px`, opacity: 1 - ease(seg(c2out, 0.08, 0.62)) }}>
          <Row top={0}>
            <div style={{ width: 70, height: 70, borderRadius: 20, background: "#EEF1F5", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width={40} height={40} viewBox="0 0 24 24" fill="none" stroke={B.muted} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round"><path d="M3 12h4l3-7 4 14 3-7h4" /></svg>
            </div>Status
          </Row>
          <div style={{ position: "absolute", right: 48, top: (C2H / 2 - 72) / 2 }}><LiveRoll t={t} /></div>
          <div style={{ position: "absolute", left: 52, right: 48, top: C2H / 2 - 1, height: 2, background: B.line }} />
          <Row top={C2H / 2}><Avatar size={70} />Vetted engineer</Row>
          <div style={{ position: "absolute", right: 48, top: C2H / 2 + (C2H / 2 - 70) / 2, transform: `scale(${acc})`, transformOrigin: "100% 50%", opacity: clamp(acc * 2) }}>
            <Pill bg="rgba(52,211,153,0.16)" color={B.greenInk} size={34} h={70}><Check size={32} color={B.greenInk} />Accountable</Pill>
          </div>
        </div>
      )}
      {/* card 1: the Deploy row; it collapses into its own switch */}
      {s1 < 1 && (
        <div style={{ position: "absolute", left: 0, top: 0, width: C1W, height: C1H, transform: card1T }}>
          <div style={{ position: "absolute", inset: 0, transform: `scale(${1 - 0.7 * s1})`, transformOrigin: `${C1W - 56 - 180}px ${C1H / 2}px` }}>
            <div style={{ position: "absolute", inset: 0, borderRadius: 64, background: B.white, boxShadow: SHADOW, opacity: 1 - ease(seg(s1, 0.1, 0.55)) }} />
            <div style={{ position: "absolute", inset: 0, fontFamily: SANS, opacity: 1 - seg(s1, 0, 0.3) }}>
              <div style={{ position: "absolute", left: 56, top: (C1H - 136) / 2 }}><AgentIcon kind="lead" size={136} /></div>
              <div style={{ position: "absolute", left: 230, top: 40, fontSize: 118, fontWeight: 700, color: B.navy, letterSpacing: "-0.045em", lineHeight: 1 }}>Deploy</div>
              <div style={{ position: "absolute", left: 234, top: 174, fontSize: 40, fontWeight: 500, color: B.muted, letterSpacing: "-0.015em" }}>Inbound lead response</div>
            </div>
            <div style={{ position: "absolute", right: 56, top: (C1H - 218) / 2 }}><Switch t={t} hide={collapsing} /></div>
          </div>
        </div>
      )}
      {/* the switch track leaves the card and becomes the navy island */}
      {collapsing && (
        <>
          <AbsoluteFill style={{ background: tint(B.green, B.navy, ease(seg(m, 0.02, 0.5))), clipPath: `inset(${TY - TH / 2}px ${1920 - TX - TW / 2}px ${1080 - TY - TH / 2}px ${TX - TW / 2}px round ${TH / 2}px)` }} />
          {knob > 0 && (
            <div style={{ position: "absolute", left: 0, top: 0, width: 186, height: 186, borderRadius: 93, background: B.white, opacity: knob, boxShadow: "0 8px 20px rgba(11,18,32,0.22)",
              transform: `translate(${TX + TW / 2 - 109 * (TH / 218) - 93}px, ${TY - 93}px) scale(${(TH / 218) * knob})` }} />
          )}
        </>
      )}
    </AbsoluteFill>
  );
};

// landing ripples round the capsule; both are gone before 15.0, so the hand-off frame is the kit capsule alone
const RIPPLES = [14.5, 14.66];
const Ripple: React.FC<{ t: number; at: number }> = ({ t, at }) => {
  const k = seg(t, at, H3);      // 0..1: at 15.0 the offset passes 824 px, so the ring has left the whole frame
  if (k <= 0 || k >= 1) return null;
  const isl = islandAt(t);
  return <div style={{ position: "absolute", left: 0, top: 0, width: 640, height: 120, borderRadius: 60, outline: `3px solid ${B.navy}`, outlineOffset: 8 + Math.pow(k, 0.9) * 842, opacity: 0.16 * clamp(k * 8),
    transform: `translate(${960 - 320}px, ${isl.cy - 60}px)` }} />;
};

// =====================================================================================================
const SEAM = 260, EXT = 420;   // push seam: soft fade width; how far the incoming page extends left of its edge
const maskX = (g: string): React.CSSProperties => ({ maskImage: g, WebkitMaskImage: g, maskRepeat: "no-repeat", WebkitMaskRepeat: "no-repeat", maskSize: "100% 100%", WebkitMaskSize: "100% 100%" });
export const SegC: React.FC<{ t: number }> = ({ t }) => {
  if (t >= TM1) return <AbsoluteFill><H3Capsule t={t} />{RIPPLES.map((a) => <Ripple key={a} t={t} at={a} />)}</AbsoluteFill>;   // hand-off: the kit capsule as is
  const P = t < TPUSH ? 0 : spring(t, TPUSH, 0.8, 0.82);    // push with momentum (both shots share it)
  const blue = t < TEXPD;
  return (
    <AbsoluteFill>
      {blue && <H2Blue t={t} />}
      {blue && t < TPUSH && <Shot7 t={t} dx={0} />}
      {blue && t >= TPUSH && P < 0.999 && (
        <AbsoluteFill style={{ transform: `translateX(${-1920 * P}px)`, ...maskX(`linear-gradient(270deg, transparent 0px, #000 ${SEAM}px)`) }}>
          <AbsoluteFill style={{ background: B.blue }} />{/* the page's own blue: the glass keeps the same backdrop inside the masked page */}
          <Shot7 t={t} dx={0} />
        </AbsoluteFill>
      )}
      {blue && t >= TPUSH && (() => {
        const o = -EXT * inout2(seg(P, 0.72, 1));    // the incoming fade slides off-frame as the push lands
        return (
          <div style={{ position: "absolute", left: -EXT, top: 0, width: 1920 + EXT, height: 1080, transform: `translateX(${1920 * (1 - P)}px)`,
            ...maskX(`linear-gradient(90deg, transparent ${EXT + o}px, #000 ${EXT + o + SEAM}px)`) }}>
            <div style={{ position: "absolute", left: EXT, top: 0, width: 1920, height: 1080 }}><Shot8 t={t} dx={0} /></div>
          </div>
        );
      })()}
      {t >= TEXP && t < TEXPD && <Expand t={t} />}
      {t >= TEXP && <AbsoluteFill style={{ clipPath: t < TEXPD ? expandAt(t).clip : undefined }}><Shot9 t={t} /></AbsoluteFill>}   {/* step 3 builds inside the expanding card */}
      {RIPPLES.map((a) => <Ripple key={a} t={t} at={a} />)}
    </AbsoluteFill>
  );
};
